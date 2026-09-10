import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { Term, UserState } from '../types'
import { SEED_TERMS } from '../data'

interface DevDictDB extends DBSchema {
  terms: { key: string; value: Term }
  states: { key: string; value: UserState }
  meta: { key: string; value: unknown }
}

export const SEED_VERSION = Number(__SEED_VERSION__)

let dbPromise: Promise<IDBPDatabase<DevDictDB>> | null = null

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<DevDictDB>('devdict', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('terms')) db.createObjectStore('terms', { keyPath: 'id' })
        if (!db.objectStoreNames.contains('states')) db.createObjectStore('states', { keyPath: 'termId' })
        if (!db.objectStoreNames.contains('meta')) db.createObjectStore('meta')
      },
    })
  }
  return dbPromise
}

/** 首次运行把种子库写入本地 */
export async function ensureSeeded() {
  const db = await getDB()
  const count = await db.count('terms')
  if (count === 0) {
    const tx = db.transaction('terms', 'readwrite')
    await Promise.all(SEED_TERMS.map((t) => tx.store.put({ ...t, source: 'seed' })))
    await tx.done
  }
  const seeded = await db.get('meta', 'seededVersion')
  if (seeded !== SEED_VERSION) {
    // 种子库升级：补进新增词条，不覆盖用户已改过的
    const tx = db.transaction('terms', 'readwrite')
    for (const t of SEED_TERMS) {
      const exist = await tx.store.get(t.id)
      if (!exist || exist.source === 'seed') await tx.store.put({ ...t, source: 'seed' })
    }
    await tx.done
    await db.put('meta', SEED_VERSION, 'seededVersion')
  }
}

/** 当前本地词条库版本 */
export async function getSeedVersion(): Promise<number> {
  const db = await getDB()
  return Number((await db.get('meta', 'seededVersion')) ?? 0)
}

/**
 * 合并一批种子词条：只新增或覆盖 source==='seed' 的词条，
 * 用户自建词条与个人标注（states）一律不动。
 */
export async function mergeSeeds(
  terms: Term[],
  version: number,
): Promise<{ added: number; updated: number }> {
  const db = await getDB()
  let added = 0
  let updated = 0
  const tx = db.transaction('terms', 'readwrite')
  for (const t of terms) {
    const exist = await tx.store.get(t.id)
    if (!exist) added++
    else if (exist.source === 'seed') updated++
    else continue // 用户自建词条，跳过
    await tx.store.put({ ...t, source: 'seed' })
  }
  await tx.done
  await db.put('meta', version, 'seededVersion')
  return { added, updated }
}

export async function getAllTerms(): Promise<Term[]> {
  const db = await getDB()
  return db.getAll('terms')
}

export async function putTerm(term: Term) {
  const db = await getDB()
  await db.put('terms', term)
}

export async function deleteTerm(id: string) {
  const db = await getDB()
  await db.delete('terms', id)
  await db.delete('states', id)
}

export async function getAllStates(): Promise<UserState[]> {
  const db = await getDB()
  return db.getAll('states')
}

export async function putState(state: UserState) {
  const db = await getDB()
  await db.put('states', state)
}

export async function getMeta<T>(key: string): Promise<T | undefined> {
  const db = await getDB()
  return db.get('meta', key) as Promise<T | undefined>
}

export async function setMeta(key: string, value: unknown) {
  const db = await getDB()
  await db.put('meta', value, key)
}

export async function clearAll() {
  const db = await getDB()
  await db.clear('terms')
  await db.clear('states')
  await ensureSeeded()
}
