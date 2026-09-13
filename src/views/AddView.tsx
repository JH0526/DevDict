import { useMemo, useState } from 'react'
import type { Term, Pair } from '../types'
import { CATEGORIES } from '../data'
import { generateTerms, loadAIConfig } from '../lib/ai'

interface Props {
  terms: Term[]
  onSaveMany: (list: Term[]) => Promise<void>
  onToast: (msg: string, ok?: boolean) => void
}

const MAX = 20

/** 归一化：小写、去首尾空白、合并内部空白，用于查重比对 */
function norm(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ')
}

/** 把多行文本拆成术语词（去空、去重、保序） */
function parseWords(raw: string): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const part of raw.split(/[\n,，、]+/)) {
    const w = part.trim()
    if (!w) continue
    const k = norm(w)
    if (seen.has(k)) continue
    seen.add(k)
    out.push(w)
  }
  return out
}

export function AddView({ terms, onSaveMany, onToast }: Props) {
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [drafts, setDrafts] = useState<Term[]>([])

  // 全库已有术语词集合（en / zh / alias），用于生成前查重
  const existing = useMemo(() => {
    const s = new Set<string>()
    for (const t of terms) {
      if (t.en) s.add(norm(t.en))
      if (t.zh) s.add(norm(t.zh))
      for (const a of t.alias ?? []) if (a) s.add(norm(a))
    }
    return s
  }, [terms])

  const gen = async () => {
    const words = parseWords(input)
    if (words.length === 0) return onToast('先输入要查的词（每行一个，最多 20 个）')
    if (words.length > MAX) return onToast(`一次最多生成 ${MAX} 个术语词`, false)
    const cfg = loadAIConfig()
    if (!cfg.apiKey.trim()) return onToast('请先在「设置」填写 AI 接口 Key', false)

    // 生成前扫描过滤：术语词典内已有的词 → 自动停止生成并提示
    const dups = words.filter((w) => existing.has(norm(w)))
    if (dups.length) {
      return onToast(`术语词典内已有此术语词：${dups.join('、')}`, false)
    }

    setBusy(true)
    try {
      const list = await generateTerms(words, cfg)
      if (!list.length) throw new Error('AI 未返回有效术语')
      // AI 可能漏词（尤其一次性给 20 个时），提示缺了哪些，让用户决定重生成还是手动补
      const got = new Set<string>()
      for (const t of list) {
        got.add(norm(t.en))
        if (t.zh) got.add(norm(t.zh))
      }
      const missed = words.filter((w) => !got.has(norm(w)))
      setDrafts(list)
      onToast(
        missed.length
          ? `生成 ${list.length} 条，AI 漏了 ${missed.length} 个：${missed.join('、')}（可重新生成或手动补充）`
          : `生成完成 ${list.length} 条，确认后保存`,
        !missed.length,
      )
    } catch (e) {
      onToast(e instanceof Error ? e.message : '生成失败', false)
    } finally {
      setBusy(false)
    }
  }

  const addBlank = () => {
    setDrafts((d) => [
      ...d,
      {
        id: `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
        en: input.trim().split(/[\n,，、]/)[0]?.trim() ?? '',
        zh: '',
        alias: [],
        category: '前端',
        pro: '',
        plain: '',
        scene: '',
        related: [],
        source: 'user',
      },
    ])
  }

  const update = (i: number, patch: Partial<Term>) =>
    setDrafts((d) => d.map((t, idx) => (idx === i ? { ...t, ...patch } : t)))

  const remove = (i: number) => setDrafts((d) => d.filter((_, idx) => idx !== i))

  const saveAll = async () => {
    const valid = drafts.filter((d) => d.en.trim())
    if (!valid.length) return onToast('没有可保存的术语', false)

    // 保存前再查一次：AI 返回的英文名/中文名可能与库内已有词重名，
    // 草稿之间也可能重复（比如手动填了两条一样的）。命中就整体拦下。
    const seen = new Set<string>()
    const dups: string[] = []
    for (const d of valid) {
      const keys = [d.en, d.zh, ...(d.alias ?? [])].map(norm).filter(Boolean)
      if (keys.some((k) => existing.has(k) || seen.has(k))) {
        dups.push(d.en || d.zh)
        continue
      }
      keys.forEach((k) => seen.add(k))
    }
    if (dups.length) return onToast(`术语词典内已有此术语词：${dups.join('、')}`, false)

    setBusy(true)
    try {
      await onSaveMany(valid)
      onToast(`已保存 ${valid.length} 条到词典`)
      setDrafts([])
      setInput('')
    } catch (e) {
      onToast(e instanceof Error ? e.message : '保存失败', false)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="h-full overflow-y-auto scroll-thin px-4 md:px-6 py-5">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">添加术语</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
        遇到看不懂的词，每行一个丢进来（最多 {MAX} 个），AI 批量生成「专业解译 + 大白话 + 中英对照」。生成前会自动查重，词典里已有的词不会重复生成。
      </p>

      <div className="mt-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={'每行一个术语，例如：\nTree Shaking\n幂等\nMCP\n乐观锁'}
          rows={5}
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 px-4 py-3 text-[15px] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:border-indigo-400 resize-y"
        />
      </div>

      <div className="mt-3 flex gap-2">
        <button
          onClick={gen}
          disabled={busy}
          className="flex-1 py-3 rounded-xl bg-indigo-600 text-white text-sm font-medium disabled:opacity-50"
        >
          {busy ? '生成中…' : 'AI 批量生成'}
        </button>
        <button
          onClick={addBlank}
          className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm"
        >
          ＋ 手动填
        </button>
      </div>

      {drafts.length > 0 && (
        <div className="mt-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              待保存草稿（{drafts.length}）
            </span>
            <div className="flex gap-2">
              <button
                onClick={saveAll}
                disabled={busy}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium disabled:opacity-50"
              >
                保存全部
              </button>
              <button
                onClick={() => setDrafts([])}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm"
              >
                清空
              </button>
            </div>
          </div>

          {drafts.map((d, i) => (
            <div
              key={d.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/40 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">#{i + 1}</span>
                <button
                  onClick={() => remove(i)}
                  className="text-xs text-rose-500 hover:text-rose-600"
                >
                  移除
                </button>
              </div>
              <Row label="英文">
                <input value={d.en} onChange={(e) => update(i, { en: e.target.value })} className={INPUT} />
              </Row>
              <Row label="中文直译">
                <input value={d.zh} onChange={(e) => update(i, { zh: e.target.value })} className={INPUT} />
              </Row>
              <Row label="别名（逗号分隔）">
                <input
                  value={d.alias?.join(', ') ?? ''}
                  onChange={(e) =>
                    update(i, {
                      alias: e.target.value.split(/[,，]/).map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  className={INPUT}
                />
              </Row>
              <Row label="分类">
                <select value={d.category} onChange={(e) => update(i, { category: e.target.value as Term['category'] })} className={INPUT}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Row>
              <Row label="专业解译">
                <textarea rows={3} value={d.pro} onChange={(e) => update(i, { pro: e.target.value })} className={INPUT} />
              </Row>
              <Row label="大白话">
                <textarea rows={3} value={d.plain} onChange={(e) => update(i, { plain: e.target.value })} className={INPUT} />
              </Row>
              <Row label="作用（解决什么问题）">
                <textarea rows={2} value={d.purpose ?? ''} onChange={(e) => update(i, { purpose: e.target.value })} className={INPUT} />
              </Row>
              <Row label="出现场景">
                <input value={d.scene} onChange={(e) => update(i, { scene: e.target.value })} className={INPUT} />
              </Row>
              <Row label="配合术语（每行：术语 | 关系 | 作用 | 使用环境）">
                <textarea
                  rows={4}
                  value={(d.pairs ?? []).map((p) => [p.en, p.rel, p.role, p.env].filter(Boolean).join(' | ')).join('\n')}
                  onChange={(e) =>
                    update(i, {
                      pairs: e.target.value
                        .split('\n')
                        .map((line) => {
                          if (!line.trim()) return null
                          const parts = line.split('|').map((s) => s.trim())
                          const en = parts[0]
                          if (!en) return null
                          return { en, rel: parts[1], role: parts[2], env: parts[3] } as Pair
                        })
                        .filter((x): x is Pair => !!x),
                    })
                  }
                  className={INPUT}
                />
              </Row>
              <Row label="关联术语（逗号分隔）">
                <input
                  value={d.related.join(', ')}
                  onChange={(e) =>
                    update(i, {
                      related: e.target.value.split(/[,，]/).map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  className={INPUT}
                />
              </Row>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const INPUT =
  'w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent px-3 py-2 text-sm text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-400'

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  )
}
