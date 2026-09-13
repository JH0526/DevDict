/**
 * 消除 zh（中文名）重复：同一中文名只保留内容最详细的一条，其余从 seed 源文件删掉。
 *
 * 背景：v0.7.0 新增分类时为避开 en 冲突改写了英文名（CORS -> Cross-Origin
 *       Resource Sharing），en 不撞了，但中文名和概念仍是同一个，
 *       搜索时会跳出两条雷同内容。
 *
 * 用法：
 *   node scripts/dedupe-zh.mjs            # dry run，只打印决策
 *   APPLY=1 node scripts/dedupe-zh.mjs    # 实际写回文件
 */
import { build } from 'esbuild'
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dataDir = resolve(root, 'src/data')
const APPLY = process.env.APPLY === '1'

const bundle = await build({
  entryPoints: [resolve(root, 'src/data/index.ts')],
  bundle: true,
  format: 'esm',
  write: false,
  platform: 'node',
})
const mod = await import(
  'data:text/javascript;base64,' + Buffer.from(bundle.outputFiles[0].text).toString('base64')
)
const terms = mod.SEED_TERMS

const weight = (t) =>
  String(t.pro ?? '').length +
  String(t.plain ?? '').length +
  String(t.scene ?? '').length +
  String(t.purpose ?? '').length

const seedFiles = readdirSync(dataDir).filter((f) => /^seed-\d+\.ts$/.test(f)).sort()
const fileLines = new Map()
for (const f of seedFiles) {
  fileLines.set(f, readFileSync(resolve(dataDir, f), 'utf8').split(/\r?\n/))
}

/** id + en + category 三项全匹配才算命中，避免跨文件同 id 误判 */
const findLine = (term) => {
  for (const f of seedFiles) {
    const lines = fileLines.get(f)
    for (let i = 0; i < lines.length; i++) {
      if (lines[i] !== `    id: '${term.id}',`) continue
      let end = i
      while (end < lines.length - 1 && !/^ {2}\},$/.test(lines[end])) end++
      const block = lines.slice(i, end + 1).join('\n')
      if (block.includes(`en: '${term.en}',`) && block.includes(`category: '${term.category}',`)) {
        return { file: f, line: i }
      }
    }
  }
  return null
}

// ---- 白名单：中文名撞车但概念确实不同，改名区分，两条都保留 ----
const RENAME = new Map([
  ['game-component', '游戏组件'],
  ['mirror', '仓库镜像'],
  ['os-paging', '内存分页'],
  ['mob-sandbox', '应用沙盒'],
])

const byZh = new Map()
for (const t of terms) {
  const k = String(t.zh ?? '').trim().toLowerCase()
  if (!k) continue
  if (!byZh.has(k)) byZh.set(k, [])
  byZh.get(k).push(t)
}

const toDelete = []
const toRename = []
for (const [zh, list] of byZh) {
  if (list.length < 2) continue
  const renamable = list.filter((t) => RENAME.has(t.id))
  if (renamable.length) {
    // 概念不同：给带 RENAME 的那条换中文名，两条都留
    for (const t of renamable) toRename.push({ term: t, newZh: RENAME.get(t.id) })
    const rest = list.filter((t) => !RENAME.has(t.id))
    // 若改名后仍有多条同名（不该发生），继续按 weight 去重
    if (rest.length > 1) {
      const sorted = [...rest].sort((a, b) => weight(b) - weight(a))
      for (const loser of sorted.slice(1)) {
        const loc = findLine(loser)
        if (loc) toDelete.push({ ...loc, term: loser, win: sorted[0] })
      }
    }
    continue
  }
  const sorted = [...list].sort((a, b) => weight(b) - weight(a))
  const winner = sorted[0]
  const winLoc = findLine(winner)
  for (const loser of sorted.slice(1)) {
    const loc = findLine(loser)
    if (!loc) {
      console.log(`  !! 定位失败，跳过: ${zh} (${loser.en} / ${loser.category})`)
      continue
    }
    toDelete.push({ ...loc, term: loser, win: winner, winFile: winLoc?.file ?? '?' })
  }
}

console.log(`=== 将删除 ${toDelete.length} 条（同概念冗余）===`)
for (const d of toDelete) {
  console.log(
    `  ✂ ${d.file}:${d.line + 1} [${d.term.category}] ${d.term.en} / ${d.term.zh} (${weight(d.term)}字)\n` +
      `     保留 ${d.winFile} [${d.win.category}] ${d.win.en} (${weight(d.win)}字)`,
  )
}
console.log(`\n=== 概念不同，改中文名保留（${toRename.length} 条）===`)
for (const r of toRename) {
  console.log(`  ${r.term.id} [${r.term.category}] ${r.term.en}: ${r.term.zh} -> ${r.newZh}`)
}

if (!APPLY) {
  console.log('\n[dry run] 加 APPLY=1 实际执行')
  process.exit(0)
}

// ---- 改名 ----
for (const r of toRename) {
  const loc = findLine(r.term)
  if (!loc) {
    console.log(`  !! 改名定位失败: ${r.term.id}`)
    continue
  }
  const lines = fileLines.get(loc.file)
  let end = loc.line
  while (end < lines.length - 1 && !/^ {2}\},$/.test(lines[end])) end++
  for (let i = loc.line; i <= end; i++) {
    if (lines[i].startsWith('    zh: ')) {
      lines[i] = `    zh: '${r.newZh}',`
      break
    }
  }
  const eol = readFileSync(resolve(dataDir, loc.file), 'utf8').includes('\r\n') ? '\r\n' : '\n'
  writeFileSync(resolve(dataDir, loc.file), lines.join(eol), 'utf8')
  console.log(`  ✎ ${loc.file}: ${r.term.zh} -> ${r.newZh}`)
}

// ---- 删除（按文件聚合，倒序无关：用行号集合过滤）----
const byFile = new Map()
for (const d of toDelete) {
  if (!byFile.has(d.file)) byFile.set(d.file, [])
  byFile.get(d.file).push(d)
}
let removed = 0
for (const [file, list] of byFile) {
  const lines = fileLines.get(file)
  const kill = new Set()
  for (const d of list) {
    let start = d.line
    while (start > 0 && lines[start] !== '  {') start--
    let end = d.line
    while (end < lines.length - 1 && !/^ {2}\},$/.test(lines[end])) end++
    if (lines[start] !== '  {' || !/^ {2}\},$/.test(lines[end])) {
      console.log(`  !! 块边界识别失败，跳过 ${file}:${d.line + 1}`)
      continue
    }
    for (let i = start; i <= end; i++) kill.add(i)
    removed++
  }
  const out = lines.filter((_, i) => !kill.has(i))
  const eol = readFileSync(resolve(dataDir, file), 'utf8').includes('\r\n') ? '\r\n' : '\n'
  writeFileSync(resolve(dataDir, file), out.join(eol), 'utf8')
  console.log(`  ${file}: 删除 ${list.length} 条，${lines.length} -> ${out.length} 行`)
}
console.log(`\n完成：删除 ${removed} 条，改名 ${toRename.length} 条`)
