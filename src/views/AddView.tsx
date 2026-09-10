import { useState } from 'react'
import type { Term } from '../types'
import { CATEGORIES } from '../data'
import { generateTerm, loadAIConfig } from '../lib/ai'

interface Props {
  onSave: (t: Term) => Promise<void>
  onToast: (msg: string, ok?: boolean) => void
}

export function AddView({ onSave, onToast }: Props) {
  const [word, setWord] = useState('')
  const [busy, setBusy] = useState(false)
  const [draft, setDraft] = useState<Term | null>(null)

  const gen = async () => {
    const w = word.trim()
    if (!w) return onToast('先输入要查的词')
    const cfg = loadAIConfig()
    if (!cfg.apiKey.trim()) return onToast('请先在「设置」填写 AI 接口 Key', false)
    setBusy(true)
    try {
      const t = await generateTerm(w, cfg)
      setDraft(t)
      onToast('生成完成，确认后保存')
    } catch (e) {
      onToast(e instanceof Error ? e.message : '生成失败', false)
    } finally {
      setBusy(false)
    }
  }

  const save = async () => {
    if (!draft) return
    if (!draft.en.trim()) return onToast('英文术语不能为空', false)
    await onSave(draft)
    onToast('已保存到词典')
    setDraft(null)
    setWord('')
  }

  const patch = (k: keyof Term, v: unknown) => setDraft((d) => (d ? { ...d, [k]: v } : d))

  return (
    <div className="h-full overflow-y-auto scroll-thin px-4 md:px-6 py-5">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">添加术语</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
        遇到看不懂的词，丢进来，AI 生成「专业解译 + 大白话 + 中英对照」
      </p>

      <div className="mt-4 flex gap-2">
        <input
          value={word}
          onChange={(e) => setWord(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !busy && gen()}
          placeholder="例如：Tree Shaking / 幂等 / MCP"
          className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 px-4 py-3 text-[15px] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:border-indigo-400"
        />
        <button
          onClick={gen}
          disabled={busy}
          className="shrink-0 px-5 rounded-xl bg-indigo-600 text-white text-sm font-medium disabled:opacity-50"
        >
          {busy ? '生成中…' : 'AI 生成'}
        </button>
      </div>

      <button
        onClick={() =>
          setDraft({
            id: `u_${Date.now().toString(36)}`,
            en: word.trim(),
            zh: '',
            alias: [],
            category: '前端',
            pro: '',
            plain: '',
            scene: '',
            related: [],
            source: 'user',
          })
        }
        className="mt-2 text-xs text-slate-400 hover:text-indigo-500"
      >
        ＋ 不用 AI，我自己填
      </button>

      {draft && (
        <div className="mt-5 space-y-3">
          <Row label="英文">
            <input value={draft.en} onChange={(e) => patch('en', e.target.value)} className={INPUT} />
          </Row>
          <Row label="中文直译">
            <input value={draft.zh} onChange={(e) => patch('zh', e.target.value)} className={INPUT} />
          </Row>
          <Row label="别名（逗号分隔）">
            <input
              value={draft.alias?.join(', ') ?? ''}
              onChange={(e) =>
                patch(
                  'alias',
                  e.target.value.split(/[,，]/).map((s) => s.trim()).filter(Boolean),
                )
              }
              className={INPUT}
            />
          </Row>
          <Row label="分类">
            <select
              value={draft.category}
              onChange={(e) => patch('category', e.target.value)}
              className={INPUT}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Row>
          <Row label="专业解译">
            <textarea rows={3} value={draft.pro} onChange={(e) => patch('pro', e.target.value)} className={INPUT} />
          </Row>
          <Row label="大白话">
            <textarea rows={3} value={draft.plain} onChange={(e) => patch('plain', e.target.value)} className={INPUT} />
          </Row>
          <Row label="作用（解决什么问题）">
            <textarea
              rows={2}
              value={draft.purpose ?? ''}
              onChange={(e) => patch('purpose', e.target.value)}
              className={INPUT}
            />
          </Row>
          <Row label="出现场景">
            <input value={draft.scene} onChange={(e) => patch('scene', e.target.value)} className={INPUT} />
          </Row>
          <Row label="配合术语（每行一条：术语 | 关系 | 作用 | 使用环境）">
            <textarea
              rows={4}
              placeholder={
                'Proxy | 绕开跨域的替代手段 | 开发期把请求转发成同源 | 本地 dev 调后端接口\nPreflight | CORS 的前置步骤 | 非简单请求先发 OPTIONS 探路 | 带自定义头或 JSON body 的请求'
              }
              defaultValue={(draft.pairs ?? [])
                .map((p) => [p.en, p.rel, p.role, p.env].filter(Boolean).join(' | '))
                .join('\n')}
              onChange={(e) =>
                patch(
                  'pairs',
                  e.target.value
                    .split('\n')
                    .map((line) => {
                      if (!line.trim()) return null
                      const parts = line.split('|').map((s) => s.trim())
                      const en = parts[0]
                      if (!en) return null
                      return { en, rel: parts[1], role: parts[2], env: parts[3] } as {
                        en: string
                        rel?: string
                        role?: string
                        env?: string
                      }
                    })
                    .filter((x): x is NonNullable<typeof x> => !!x),
                )
              }
              className={INPUT}
            />
          </Row>
          <Row label="关联术语（逗号分隔）">
            <input
              value={draft.related.join(', ')}
              onChange={(e) =>
                patch(
                  'related',
                  e.target.value.split(/[,，]/).map((s) => s.trim()).filter(Boolean),
                )
              }
              className={INPUT}
            />
          </Row>

          <div className="flex gap-2 pt-1">
            <button onClick={save} className="flex-1 py-3 rounded-xl bg-indigo-600 text-white text-sm font-medium">
              保存
            </button>
            <button
              onClick={() => setDraft(null)}
              className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm"
            >
              取消
            </button>
          </div>
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
