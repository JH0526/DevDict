import type { Term } from '../types'

export const APP_VERSION = __APP_VERSION__
export const SEED_VERSION = Number(__SEED_VERSION__)
export const BUILD_TIME = __BUILD_TIME__
export const CHANGELOG: string[] = __CHANGELOG__

export interface RemoteMeta {
  version: string
  seedVersion: number
  buildTime: string
  changelog: string[]
}

export interface SeedBundle {
  version: number
  count: number
  terms: Term[]
}

// 桌面端（file://）Electron 读 asar 内文件时不支持查询串，且需相对路径
const isDesktop = typeof location !== 'undefined' && location.protocol === 'file:'
const cacheBust = isDesktop ? '' : `?t=${Date.now()}`

/**
 * 远端版本源。
 *
 * 只 fetch 本地 ./version.json 会永远返回「已是最新」——那份文件是跟程序一起
 * 打包进 dist / Electron 安装包的，版本号恒等于 APP_VERSION。所以必须再取一份
 * 真正的远端。顺序：jsDelivr（国内可达）→ GitHub Release tag → 本地自托管。
 */
const REMOTE_BASE = 'https://cdn.jsdelivr.net/gh/JH0526/DevDict@main/public'
const RELEASE_API = 'https://api.github.com/repos/JH0526/DevDict/releases/latest'

async function getJSON<T>(url: string, timeoutMs = 8000): Promise<T> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const res = await fetch(url, { cache: 'no-store', signal: ctrl.signal })
    if (!res.ok) throw new Error(String(res.status))
    return (await res.json()) as T
  } finally {
    clearTimeout(timer)
  }
}

async function best<T>(
  tasks: Promise<T | null>[],
  pick: (a: T, b: T) => T,
): Promise<T | null> {
  const rs = await Promise.allSettled(tasks)
  let acc: T | null = null
  for (const r of rs) {
    if (r.status !== 'fulfilled' || r.value == null) continue
    acc = acc === null ? r.value : pick(acc, r.value)
  }
  return acc
}

export function isNewer(a: string, b: string): boolean {
  const pa = a.split('.').map(Number)
  const pb = b.split('.').map(Number)
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const x = pa[i] ?? 0
    const y = pb[i] ?? 0
    if (x !== y) return x > y
  }
  return false
}

/** 远端版本：优先完整 meta（带 changelog），取不到时用 Release tag 兜底判断是否落后 */
async function remoteMeta(): Promise<RemoteMeta | null> {
  const withMeta = await getJSON<RemoteMeta>(`${REMOTE_BASE}/version.json?t=${Date.now()}`)
    .then((m) => (m?.version ? m : null))
    .catch(() => null)
  if (withMeta) return withMeta

  // jsDelivr 取不到（未推送 / CDN 未刷新）时，用 Release tag 兜底判断是否落后
  const rel = await getJSON<{ tag_name?: string; published_at?: string }>(RELEASE_API).catch(
    () => null,
  )
  if (!rel?.tag_name) return null
  return {
    version: rel.tag_name.replace(/^v/i, ''),
    seedVersion: 0,
    buildTime: rel.published_at ?? '',
    changelog: [],
  }
}

function localMeta(): Promise<RemoteMeta> {
  return getJSON<RemoteMeta>(`./version.json${cacheBust}`)
}

/** 应用版本信息：本地与远端取较新的那个，都失败才抛错 */
export async function fetchMeta(): Promise<RemoteMeta> {
  const meta = await best([localMeta(), remoteMeta()], (a, b) => (isNewer(b.version, a.version) ? b : a))
  if (!meta) throw new Error('无法获取版本信息（网络不通）')
  return meta
}

/** 最新词条库：本地与远端取 seedVersion 更大的那个 */
export async function fetchSeedBundle(): Promise<SeedBundle> {
  const bundle = await best(
    [
      getJSON<SeedBundle>(`./seed-terms.json${cacheBust}`),
      getJSON<SeedBundle>(`${REMOTE_BASE}/seed-terms.json?t=${Date.now()}`, 20_000),
    ],
    (a, b) => (b.version > a.version ? b : a),
  )
  if (!bundle) throw new Error('无法获取词条库（网络不通）')
  return bundle
}

export function formatBuildTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}
