/** 检查 pairs / related 内部是否有重复项或空值（会导致 React key 警告或渲染空按钮） */
import { build } from 'esbuild'
import { resolve } from 'node:path'

const b = await build({
  entryPoints: [resolve(process.cwd(), 'src/data/index.ts')],
  bundle: true,
  format: 'esm',
  write: false,
  platform: 'node',
})
const mod = await import(
  'data:text/javascript;base64,' + Buffer.from(b.outputFiles[0].text).toString('base64')
)
const terms = mod.SEED_TERMS

let pDup = 0
let rDup = 0
let pEmpty = 0
let rEmpty = 0
const pList = []
const rList = []
for (const t of terms) {
  const pes = (t.pairs ?? []).map((p) => String(p.en ?? '').trim())
  if (pes.length !== new Set(pes).size) {
    pDup++
    pList.push(t.id + ': ' + pes.join(' / '))
  }
  pEmpty += pes.filter((x) => !x).length

  const rs = (t.related ?? []).map((x) => String(x ?? '').trim())
  if (rs.length !== new Set(rs).size) {
    rDup++
    rList.push(t.id + ': ' + rs.join(' / '))
  }
  rEmpty += rs.filter((x) => !x).length
}
console.log('pairs 内 en 重复:', pDup, '| pairs 空 en:', pEmpty, '| related 内重复:', rDup, '| related 空值:', rEmpty)
pList.slice(0, 15).forEach((s) => console.log('  P ' + s))
rList.slice(0, 15).forEach((s) => console.log('  R ' + s))
