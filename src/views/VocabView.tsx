import { useState } from 'react'
import type { TermView } from '../types'

interface Props {
  terms: TermView[]
  onUpdate: (id: string, patch: { mastery?: 0 | 1 | 2; starred?: boolean }) => void
  onOpen: (t: TermView) => void
}

/** 生词本：收藏 + 生疏的词，可以当复习卡片翻 */
export function VocabView({ terms, onUpdate, onOpen }: Props) {
  const list = terms.filter((t) => t.starred || t.mastery === 0)
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const cur = list[idx]

  if (!cur) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-8">
        <div className="text-4xl">🎉</div>
        <p className="mt-3 text-slate-500 dark:text-slate-400 text-sm">
          生词本是空的。遇到不懂的词，点开详情标个★或"生疏"，就会进到这里。
        </p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col px-4 md:px-6 py-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">生词本</h2>
        <span className="text-xs text-slate-400">
          {idx + 1} / {list.length}
        </span>
      </div>

      <div
        onClick={() => setFlipped((f) => !f)}
        className="mt-4 flex-1 min-h-[220px] rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 p-6 flex flex-col justify-center cursor-pointer select-none"
      >
        <div className="text-center">
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-50 break-words">{cur.en}</div>
          <div className="mt-1 text-slate-500 dark:text-slate-400">{cur.zh}</div>
        </div>
        {flipped ? (
          <p className="mt-5 text-[15px] leading-relaxed text-slate-700 dark:text-slate-200 text-center">
            {cur.plain}
          </p>
        ) : (
          <p className="mt-5 text-xs text-slate-400 text-center">点击翻面看解释</p>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          onClick={() => {
            onUpdate(cur.id, { mastery: 0 })
            next()
          }}
          className="py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm"
        >
          还没会
        </button>
        <button
          onClick={() => {
            onUpdate(cur.id, { mastery: 2 })
            next()
          }}
          className="py-3 rounded-xl bg-indigo-600 text-white text-sm font-medium"
        >
          记住了
        </button>
      </div>

      <button
        onClick={() => onOpen(cur)}
        className="mt-2 text-xs text-slate-400 hover:text-indigo-500 py-2"
      >
        查看完整词条 →
      </button>

      <div className="mt-4 border-t border-slate-100 dark:border-slate-800 pt-3">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
          全部生词（{list.length}）
        </h3>
        <div className="mt-2 max-h-52 overflow-y-auto scroll-thin space-y-1.5">
          {list.map((t, i) => (
            <button
              key={t.id}
              onClick={() => {
                setIdx(i)
                setFlipped(false)
              }}
              className="w-full flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 text-left"
            >
              <span className="truncate text-slate-700 dark:text-slate-200">{t.en}</span>
              <span className="text-xs text-slate-400 shrink-0">
                {t.starred && '★ '}
                {t.zh}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  function next() {
    setFlipped(false)
    setIdx((i) => (i + 1) % Math.max(list.length, 1))
  }
}
