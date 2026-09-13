/**
 * 消除 id 重复：同一 id 只保留内容最详细的一条，其余从 seed 源文件里删掉。
 *
 * 背景：IndexedDB 以 id 为主键，id 相同的词条后者会覆盖前者，
 *       848 条实际只入库 828 条。本脚本从源头删除冗余的简略版。
 *
 * 用法：
 *   node scripts/dedupe-terms.mjs            # dry run，只打印决策
 *   APPLY=1 node scripts/dedupe-terms.mjs    # 实际写回文件
 *
 * KEEP：同一 id 但语义不同的词条（如 prompt: AI 提示词 vs 终端提示符），
 *       这些不删除，只列出，需手工改 id 区分。
 */
import { build } from 'esbuild'
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dataDir = resolve(root, 'src/data')
const KEEP = new Set((process.env.KEEP ?? 'prompt,component').split(',').map((s) => s.trim()).filter(Boolean))
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

/** 内容详略用四个正文字段总长衡量 */
const weight = (t) =>
  String(t.pro ?? '').length +
  String(t.plain ?? '').length +
  String(t.scene ?? '').length +
  String(t.purpose ?? '').length

// 读所有 seed 文件，建立 id -> 文件 映射（只认 4 空格缩进的主词条 id）
const seedFiles = readdirSync(dataDir).filter((f) => /^seed-\d+\.ts$/.test(f)).sort()
const idToFile = new Map()
const fileLines = new Map()
for (const f of seedFiles) {
  const lines = readFileSync(resolve(dataDir, f), 'utf8').split(/\r?\n/)
  fileLines.set(f, lines)
  lines.forEach((line, i) => {
    const m = line.match(/^ {4}id: '([^']+)',$/)
    if (m) idToFile.set(`${m[1]}@${f}`, i)
  })
}
/**
 * 精确定位：同一 id 会跨文件出现，必须 id + en + category 三项都对上才算命中，
 * 否则会把另一个文件里同 id 的词条误判成本条。
 */
const findLine = (term) => {
  for (const f of seedFiles) {
    const lines = fileLines.get(f)
    for (let i = 0; i < lines.length; i++) {
      if (lines[i] !== `    id: '${term.id}',`) continue
      let end = i
      while (end < lines.length - 1 && !/^ {2}\},$/.test(lines[end])) end++
      const block = lines.slice(i, end + 1).join('\n')
      if (
        block.includes(`en: '${term.en}',`) &&
        block.includes(`category: '${term.category}',`)
      ) {
        return { file: f, line: i }
      }
    }
  }
  return null
}

// 按 id 分组
const byId = new Map()
for (const t of terms) {
  if (!byId.has(t.id)) byId.set(t.id, [])
  byId.get(t.id).push(t)
}

const toDelete = []
const keepBoth = []
for (const [id, list] of byId) {
  if (list.length < 2) continue
  if (KEEP.has(id)) {
    keepBoth.push({ id, list })
    continue
  }
  const sorted = [...list].sort((a, b) => weight(b) - weight(a))
  const winner = sorted[0]
  const winLoc = findLine(winner)
  for (const loser of sorted.slice(1)) {
    const loc = findLine(loser)
    if (!loc) {
      console.log(`  !! 定位失败，跳过: ${id} (${loser.en} / ${loser.category})`)
      continue
    }
    toDelete.push({
      id,
      en: loser.en,
      category: loser.category,
      w: weight(loser),
      winW: weight(winner),
      winCat: winner.category,
      winFile: winLoc?.file ?? '?',
      ...loc,
    })
  }
}

console.log(`=== 将删除 ${toDelete.length} 条冗余（简略版）===`)
for (const d of toDelete) {
  console.log(
    `  ✂ ${d.file}:${d.line + 1}  [${d.category}] ${d.en}  (${d.w}字)\n` +
      `     保留 ${d.winFile} [${d.winCat}] (${d.winW}字)`,
  )
}
console.log(`\n=== 语义不同、保留两条（需手工改 id）：${keepBoth.length} 组 ===`)
for (const { id, list } of keepBoth) {
  console.log(`  ${id}: ${list.map((t) => `${t.en}/${t.category}`).join('  ||  ')}`)
}

if (!APPLY) {
  console.log('\n[dry run] 加 APPLY=1 实际执行')
  process.exit(0)
}

// 按文件聚合，倒序删除（避免行号偏移）
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
    while (start > 0 && !/^ {2}\{$/.test(lines[start])) start--
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
  // 保留原始换行符（仓库里这些文件是 CRLF，统一写成 LF 会制造满屏 diff）
  const eol = readFileSync(resolve(dataDir, file), 'utf8').includes('\r\n') ? '\r\n' : '\n'
  writeFileSync(resolve(dataDir, file), out.join(eol), 'utf8')
  console.log(`  ${file}: 删除 ${list.length} 条，${lines.length} -> ${out.length} 行`)
}
console.log(`\n完成：共删除 ${removed} 条冗余词条`)
