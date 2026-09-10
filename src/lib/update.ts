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

/** 应用版本信息（构建时生成到 public/version.json） */
export async function fetchMeta(): Promise<RemoteMeta> {
  const res = await fetch(`/version.json?t=${Date.now()}`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`无法获取版本信息（${res.status}）`)
  return res.json()
}

/** 最新词条库（构建时生成到 public/seed-terms.json） */
export async function fetchSeedBundle(): Promise<SeedBundle> {
  const res = await fetch(`/seed-terms.json?t=${Date.now()}`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`无法获取词条库（${res.status}）`)
  return res.json()
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

export function formatBuildTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}
