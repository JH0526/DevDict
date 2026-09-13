/**
 * 术语库全量体检。
 * 与 check-terms.mjs（正则解析）不同，这里用 esbuild 把 src/data/index.ts
 * 打包后直接 import，拿到的是运行时真实对象，不会误判/漏判。
 *
 * 检查项：id 重复 / en 重复 / zh 重复 / 分类合法性 / 必填字段缺失 /
 *         空值字段 / related 悬空引用 / 分类分布
 */
import { build } from 'esbuild'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

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
const cats = mod.CATEGORIES ?? []
const catSet = new Set(cats)

const norm = (s) => String(s ?? '').trim().toLowerCase()
const REQUIRED = ['id', 'en', 'zh', 'category', 'pro', 'plain', 'scene', 'purpose']

console.log(`词条总数: ${terms.length}   分类数: ${cats.length}`)
console.log(`唯一 id: ${new Set(terms.map((t) => t.id)).size}`)
console.log(`唯一 en: ${new Set(terms.map((t) => norm(t.en))).size}`)
console.log(`唯一 zh: ${new Set(terms.map((t) => norm(t.zh))).size}`)
console.log('')

// ---- 1. id 重复（致命：IndexedDB 主键，后者会覆盖前者）----
const byId = new Map()
for (const t of terms) {
  if (!byId.has(t.id)) byId.set(t.id, [])
  byId.get(t.id).push(t)
}
const dupId = [...byId.entries()].filter(([, v]) => v.length > 1)
console.log(`=== [致命] id 重复 ${dupId.length} 组（IndexedDB 会互相覆盖）===`)
for (const [id, list] of dupId) {
  console.log(`  ${id}: ${list.map((t) => `${t.en}/${t.category}`).join('  ||  ')}`)
}

// ---- 2. en 重复 ----
const byEn = new Map()
for (const t of terms) {
  const k = norm(t.en)
  if (!byEn.has(k)) byEn.set(k, [])
  byEn.get(k).push(t)
}
const dupEn = [...byEn.entries()].filter(([, v]) => v.length > 1)
console.log(`\n=== [严重] en 重复 ${dupEn.length} 组（搜索会出现同名项）===`)
for (const [en, list] of dupEn) {
  console.log(`  ${en}: ${list.map((t) => `${t.id}[${t.category}]`).join('  ||  ')}`)
}

// ---- 3. zh 重复 ----
const byZh = new Map()
for (const t of terms) {
  const k = norm(t.zh)
  if (!byZh.has(k)) byZh.set(k, [])
  byZh.get(k).push(t)
}
const dupZh = [...byZh.entries()].filter(([, v]) => v.length > 1)
console.log(`\n=== [提示] zh 重复 ${dupZh.length} 组 ===`)
for (const [zh, list] of dupZh) {
  console.log(`  ${zh}: ${list.map((t) => `${t.id}(${t.en})`).join('  ||  ')}`)
}

// ---- 4. 分类合法性 ----
const badCat = terms.filter((t) => !catSet.has(t.category))
console.log(`\n=== [严重] 分类不在 CATEGORIES 中：${badCat.length} 条 ===`)
for (const t of badCat) console.log(`  ${t.id} (${t.en}) -> "${t.category}"`)

// ---- 5. 必填字段缺失 / 空值 ----
const missing = []
for (const t of terms) {
  const miss = REQUIRED.filter((f) => t[f] === undefined || t[f] === null || String(t[f]).trim() === '')
  if (miss.length) missing.push({ t, miss })
}
console.log(`\n=== [严重] 必填字段缺失/为空：${missing.length} 条 ===`)
for (const { t, miss } of missing) console.log(`  ${t.id} (${t.en}) 缺: ${miss.join(', ')}`)

// ---- 6. related 字段类型与悬空引用 ----
const enSet = new Set(terms.map((t) => norm(t.en)))
const idSet = new Set(terms.map((t) => t.id))
const aliasSet = new Set()
for (const t of terms) for (const a of t.alias ?? []) aliasSet.add(norm(a))

const badRelatedType = terms.filter((t) => t.related !== undefined && !Array.isArray(t.related))
const dangling = []
let relatedTotal = 0
for (const t of terms) {
  for (const r of t.related ?? []) {
    relatedTotal++
    const k = norm(r)
    if (!enSet.has(k) && !idSet.has(k) && !aliasSet.has(k)) dangling.push(`${t.id} -> ${r}`)
  }
}
console.log(`\n=== [提示] related 引用总数 ${relatedTotal}，悬空 ${dangling.length} 个 ===`)
for (const d of dangling.slice(0, 40)) console.log(`  ${d}`)
if (dangling.length > 40) console.log(`  ... 还有 ${dangling.length - 40} 个`)
if (badRelatedType.length) {
  console.log(`  related 类型错误: ${badRelatedType.map((t) => t.id).join(', ')}`)
}

// ---- 7. alias 与自身 en 相同 ----
// 大小写变体（TurboPack / turbopack）是有意义的搜索别名，不算问题；
// 只报"除了大小写外完全一致"的，那才是冗余。
const aliasSelf = terms.filter((t) =>
  (t.alias ?? []).some((a) => a.trim() === t.en.trim()),
)
console.log(`\n=== [提示] alias 与自身 en 相同：${aliasSelf.length} 条 ===`)
for (const t of aliasSelf) console.log(`  ${t.id}: ${t.en}`)

// ---- 8. 分类分布 ----
console.log('\n=== 分类分布 ===')
const dist = new Map()
for (const t of terms) dist.set(t.category, (dist.get(t.category) ?? 0) + 1)
for (const c of [...dist.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(c[1]).padStart(3)}  ${c[0]}`)
}
const emptyCats = cats.filter((c) => !dist.has(c))
if (emptyCats.length) console.log(`  [空分类] ${emptyCats.join(', ')}`)

// ---- 8.5 重复对详情（DUPS=1 时打印，用于判断"真重复"还是"跨分类同名"）----
if (process.env.DUPS) {
  console.log('\n=== 重复对详情 ===')
  const groups = process.env.DUPS === 'en' ? dupEn : dupId
  for (const [, list] of groups) {
    console.log(`\n--- ${list[0].en} / ${list[0].id} ---`)
    for (const t of list) {
      console.log(`  [${t.category}] zh=${t.zh}`)
      const N = Number(process.env.SLICE || 70)
      console.log(`    pro   : ${String(t.pro).slice(0, N)}`)
      console.log(`    plain : ${String(t.plain).slice(0, N)}`)
      console.log(`    scene : ${String(t.scene).slice(0, N)}`)
      console.log(`    purpose: ${String(t.purpose).slice(0, N)}`)
    }
  }
}

// ---- 9. 汇总 ----
const fatal = dupId.length + badCat.length + missing.length
console.log(`\n========== 汇总 ==========`)
console.log(`致命/严重项: ${fatal}（id 重复 ${dupId.length} + 非法分类 ${badCat.length} + 字段缺失 ${missing.length}）`)
console.log(`en 重复 ${dupEn.length} 组 · zh 重复 ${dupZh.length} 组 · related 悬空 ${dangling.length}`)
console.log(`实际可入库词条（id 去重后）: ${new Set(terms.map((t) => t.id)).size} / ${terms.length}`)
