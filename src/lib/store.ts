import { useCallback, useEffect, useMemo, useState } from 'react'
import Fuse from 'fuse.js'
import type { Term, TermView, UserState } from '../types'
import { CATEGORIES } from '../data'
import * as db from './db'
import { fetchSeedBundle } from './update'

export type MasteryFilter = 'all' | 0 | 1 | 2

function merge(terms: Term[], states: UserState[]): TermView[] {
  const map = new Map(states.map((s) => [s.termId, s]))
  return terms.map((t) => {
    const s = map.get(t.id)
    return {
      ...t,
      mastery: s?.mastery ?? 0,
      note: s?.note ?? '',
      starred: s?.starred ?? false,
      source: t.source ?? 'seed',
    }
  })
}

export function useDict() {
  const [terms, setTerms] = useState<TermView[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    await db.ensureSeeded()
    const [t, s] = await Promise.all([db.getAllTerms(), db.getAllStates()])
    const merged = merge(t, s)
    merged.sort((a, b) => {
      const ai = CATEGORIES.indexOf(a.category as never)
      const bi = CATEGORIES.indexOf(b.category as never)
      return ai - bi || a.en.localeCompare(b.en)
    })
    setTerms(merged)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const updateState = useCallback(
    async (termId: string, patch: Partial<UserState>) => {
      let next: UserState
      setTerms((prev) =>
        prev.map((t) => {
          if (t.id !== termId) return t
          const cur: UserState = {
            termId,
            mastery: t.mastery,
            note: t.note,
            starred: t.starred,
            updatedAt: Date.now(),
          }
          next = { ...cur, ...patch, updatedAt: Date.now() }
          return { ...t, ...patch }
        }),
      )
      // 上面赋值在 map 回调里执行，此处 next 已确定
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await db.putState(next!)
    },
    [],
  )

  const addTerm = useCallback(
    async (term: Term) => {
      await db.putTerm({ ...term, source: 'user' })
      await refresh()
    },
    [refresh],
  )

  const removeTerm = useCallback(
    async (id: string) => {
      await db.deleteTerm(id)
      await refresh()
    },
    [refresh],
  )

  const importTerms = useCallback(
    async (list: Term[]) => {
      for (const t of list) await db.putTerm({ ...t, source: t.source ?? 'user' })
      await refresh()
    },
    [refresh],
  )

  /** 拉取线上最新词条库并增量合并，不动用户自建词条和个人标注 */
  const updateSeed = useCallback(async () => {
    const bundle = await fetchSeedBundle()
    const cur = await db.getSeedVersion()
    if (bundle.version <= cur) return { changed: 0, latest: true, version: cur }
    const r = await db.mergeSeeds(bundle.terms, bundle.version)
    await refresh()
    return { changed: r.added + r.updated, latest: false, version: bundle.version }
  }, [refresh])

  const resetAll = useCallback(async () => {
    await db.clearAll()
    await refresh()
  }, [refresh])

  return { terms, loading, refresh, updateState, addTerm, removeTerm, importTerms, updateSeed, resetAll }
}

/** 模糊搜索：英文 / 中文 / 别名 / 解释都能命中，应对"只记得半截/听来的词" */
export function useSearch(terms: TermView[], query: string, category: string, mastery: MasteryFilter) {
  const fuse = useMemo(
    () =>
      new Fuse(terms, {
        includeScore: true,
        ignoreLocation: true,
        threshold: 0.38,
        keys: [
          { name: 'en', weight: 0.4 },
          { name: 'zh', weight: 0.35 },
          { name: 'alias', weight: 0.15 },
          { name: 'plain', weight: 0.05 },
          { name: 'pro', weight: 0.05 },
          { name: 'purpose', weight: 0.05 },
        ],
      }),
    [terms],
  )

  return useMemo(() => {
    let list = terms
    if (category !== 'all') list = list.filter((t) => t.category === category)
    if (mastery !== 'all') list = list.filter((t) => t.mastery === mastery)

    const q = query.trim()
    if (!q) return list

    const lower = q.toLowerCase()
    // 精确子串优先，保证"搜全称"永远排第一
    const exact = list.filter(
      (t) =>
        t.en.toLowerCase().includes(lower) ||
        t.zh.includes(q) ||
        (t.alias ?? []).some((a) => a.toLowerCase().includes(lower)),
    )
    const fuzzy = fuse.search(q).map((r) => r.item)
    const seen = new Set(exact.map((t) => t.id))
    return [...exact, ...fuzzy.filter((t) => !seen.has(t.id) && (category === 'all' || t.category === category) && (mastery === 'all' || t.mastery === mastery))]
  }, [terms, query, category, mastery, fuse])
}
