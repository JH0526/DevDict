/**
 * 构建前生成两份可被应用"在线检查更新"的静态文件：
 *   public/version.json      —— 应用版本、构建时间、更新说明
 *   public/seed-terms.json   —— 词条库内容与版本号
 * 应用启动时 fetch 它们来比对，从而实现「应用内置更新」。
 */
import { build } from 'esbuild'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'))

/** 把 TS 词条库 bundle 成 JS 再 import，避免运行时依赖 TS 编译 */
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

const outDir = resolve(root, 'public')
mkdirSync(outDir, { recursive: true })

writeFileSync(
  resolve(outDir, 'seed-terms.json'),
  JSON.stringify({ version: pkg.seedVersion, count: mod.SEED_TERMS.length, terms: mod.SEED_TERMS }, null, 0),
)

writeFileSync(
  resolve(outDir, 'version.json'),
  JSON.stringify(
    {
      version: pkg.version,
      seedVersion: pkg.seedVersion,
      buildTime: new Date().toISOString(),
      changelog: pkg.changelog ?? [],
    },
    null,
    2,
  ),
)

console.log(
  `[gen-meta] app v${pkg.version} · 词条库 v${pkg.seedVersion} · ${mod.SEED_TERMS.length} 条`,
)
