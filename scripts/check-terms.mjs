import fs from 'fs'
import path from 'path'

const DATA = 'C:/Users/lenovo/WorkBuddy/2026-09-09-19-35-12/devdict/src/data'
const TYPES = 'C:/Users/lenovo/WorkBuddy/2026-09-09-19-35-12/devdict/src/types.ts'

// 1) 合法分类白名单（从 types.ts 提取）
const tsrc = fs.readFileSync(TYPES, 'utf8')
const block = tsrc.slice(tsrc.indexOf('export type Category'), tsrc.indexOf('export interface Term'))
const validCats = [...block.matchAll(/'([^']+)'/g)].map((m) => m[1])

// 2) 读取所有 seed 文件，提取主词条（4 空格缩进的 id/en/category）
const files = fs.readdirSync(DATA).filter((f) => /^seed-\d+\.ts$/.test(f)).sort()
const terms = [] // {file, id, en, category}
for (const f of files) {
  const src = fs.readFileSync(path.join(DATA, f), 'utf8')
  const ids = [...src.matchAll(/^    id:\s*'([^']+)'/gm)].map((m) => m[1])
  const ens = [...src.matchAll(/^    en:\s*'([^']+)'/gm)].map((m) => m[1])
  const cats = [...src.matchAll(/^    category:\s*'([^']+)'/gm)].map((m) => m[1])
  const n = Math.min(ids.length, ens.length, cats.length)
  for (let i = 0; i < n; i++) terms.push({ file: f, id: ids[i], en: ens[i], category: cats[i] })
}

console.log(`文件数: ${files.length}  主词条总数: ${terms.length}`)
console.log(`合法分类数: ${validCats.length}`)

const problems = []
const idMap = new Map()
const enMap = new Map()
for (const t of terms) {
  idMap.set(t.id, [...(idMap.get(t.id) || []), t])
  enMap.set(t.en, [...(enMap.get(t.en) || []), t])
  if (!validCats.includes(t.category)) problems.push(`非法分类 [${t.file}] ${t.id} -> ${t.category}`)
}

// id 重复
for (const [id, arr] of idMap) if (arr.length > 1) problems.push(`ID重复: ${id} @ ${arr.map((a) => a.file).join(', ')}`)

// en 重复（全局）
const enDup = []
for (const [en, arr] of enMap) if (arr.length > 1) enDup.push({ en, where: arr.map((a) => `${a.file}:${a.id}`) })

// 新词 vs 旧词 en 冲突（seed-25..34 是新增）
const oldEns = new Set(terms.filter((t) => /^seed-0[1-9]\.ts$|^seed-1[0-9]\.ts$|^seed-2[0-4]\.ts$/.test(t.file)).map((t) => t.en))
const newTerms = terms.filter((t) => /^seed-2[5-9]\.ts$|^seed-3[0-4]\.ts$/.test(t.file))
const conflicts = newTerms.filter((t) => oldEns.has(t.en))

console.log('\n=== 分类校验问题 ===')
console.log(problems.length ? problems.join('\n') : '  无')
console.log('\n=== 全局 en 重复 ===')
console.log(enDup.length ? enDup.map((d) => `  ${d.en} -> ${d.where.join(' | ')}`).join('\n') : '  无')
console.log('\n=== 我的新词 vs 现有主词条 en 冲突（需处理）===')
console.log(conflicts.length ? conflicts.map((c) => `  ${c.en} [${c.id}] @ ${c.file}`).join('\n') : '  无冲突 ✅')
console.log(`\n新增词条数: ${newTerms.length}`)
