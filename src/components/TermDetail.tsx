import { useEffect, useState } from 'react'
import type { TermView } from '../types'
import { CATEGORY_STYLE, MASTERY_LABEL, MASTERY_STYLE } from './TermCard'
import { SpeakButton } from './SpeakButton'

interface Props {
  term: TermView
  onClose: () => void
  onUpdate: (patch: { mastery?: 0 | 1 | 2; note?: string; starred?: boolean }) => void
  onDelete?: () => void
  onJump: (en: string) => void
}

export function TermDetail({ term, onClose, onUpdate, onDelete, onJump }: Props) {
  const [note, setNote] = useState(term.note)

  useEffect(() => setNote(term.note), [term.id, term.note])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-slate-900/30 backdrop-blur-sm" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="h-full w-full md:w-[460px] bg-white dark:bg-slate-900 shadow-xl overflow-y-auto scroll-thin"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-2 px-5 py-4 border-b border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 backdrop-blur">
          <span className="text-xs text-slate-400">按 Esc 关闭</span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xl leading-none px-2"
            aria-label="关闭"
          >
            ✕
          </button>
        </div>

        <div className="px-5 pb-10">
          <div className="flex items-start justify-between gap-3 mt-1">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 break-words flex items-center gap-2">
              {term.en}
              <SpeakButton text={term.en} size={17} />
            </h2>
            <span className={`shrink-0 text-[11px] px-2 py-0.5 rounded-full ${CATEGORY_STYLE[term.category] ?? ''}`}>
              {term.category}
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{term.zh}</p>
          {!!term.alias?.length && (
            <p className="text-xs text-slate-400 mt-1.5">又称：{term.alias.join(' · ')}</p>
          )}

          <Section title="大白话" tone="plain">
            {term.plain}
          </Section>

          <Section title="专业解译" tone="pro">
            {term.pro}
          </Section>

          {term.purpose && (
            <Section title="它解决什么问题" tone="purpose">
              {term.purpose}
            </Section>
          )}

          {term.scene && (
            <Section title="什么场景会碰到">{term.scene}</Section>
          )}

          {!!term.pairs?.length && (
            <div className="mt-6">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">配合术语</h3>
              <div className="mt-2 space-y-2">
                {term.pairs.map((pair) => (
                  <button
                    key={pair.en}
                    onClick={() => onJump(pair.en)}
                    className="w-full text-left rounded-lg border border-slate-200 dark:border-slate-700 p-3 hover:border-indigo-400 dark:hover:border-indigo-500 transition"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                        {pair.en}
                      </span>
                      <span className="ml-auto text-[11px] text-slate-400">点开看 →</span>
                    </div>
                    {pair.rel && <PairRow label="关系">{pair.rel}</PairRow>}
                    {pair.role && <PairRow label="作用">{pair.role}</PairRow>}
                    {pair.env && <PairRow label="使用环境">{pair.env}</PairRow>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!!term.related?.length && (
            <div className="mt-6">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">关联 / 对比</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {term.related.map((r) => (
                  <button
                    key={r}
                    onClick={() => onJump(r)}
                    className="text-xs px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-7 pt-5 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">掌握程度</h3>
            <div className="mt-2 flex gap-2">
              {([0, 1, 2] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => onUpdate({ mastery: m })}
                  className={`flex-1 py-2 rounded-lg text-sm border transition ${
                    term.mastery === m
                      ? `${MASTERY_STYLE[m]} border-transparent font-medium`
                      : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  {MASTERY_LABEL[m]}
                </button>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => onUpdate({ starred: !term.starred })}
                className={`flex-1 py-2 rounded-lg text-sm border transition ${
                  term.starred
                    ? 'bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/40 dark:text-amber-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                }`}
              >
                {term.starred ? '★ 已收藏' : '☆ 收藏'}
              </button>
              {term.source === 'user' && onDelete && (
                <button
                  onClick={onDelete}
                  className="px-4 py-2 rounded-lg text-sm border border-rose-200 text-rose-600 dark:border-rose-500/40 dark:text-rose-400"
                >
                  删除
                </button>
              )}
            </div>

            <h3 className="mt-5 text-xs font-semibold text-slate-400 uppercase tracking-wide">我的备注</h3>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onBlur={() => note !== term.note && onUpdate({ note })}
              placeholder="当时在哪遇到的？谁说的？我自己的理解是…"
              rows={3}
              className="mt-2 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent p-3 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 outline-none focus:border-indigo-400 resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function PairRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-1.5 flex gap-2">
      <span className="shrink-0 mt-0.5 text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 dark:bg-slate-700/60 dark:text-slate-400">
        {label}
      </span>
      <span className="text-[13px] leading-relaxed text-slate-600 dark:text-slate-300">
        {children}
      </span>
    </div>
  )
}

function Section({
  title,
  tone,
  children,
}: {
  title: string
  tone?: 'plain' | 'pro' | 'purpose'
  children: React.ReactNode
}) {
  const bg =
    tone === 'plain'
      ? 'bg-indigo-50/70 dark:bg-indigo-500/10 border-indigo-100 dark:border-indigo-500/20'
      : tone === 'pro'
        ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700/60'
        : tone === 'purpose'
          ? 'bg-emerald-50/70 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20'
          : 'bg-white dark:bg-slate-800/30 border-slate-100 dark:border-slate-700/60'

  return (
    <div className={`mt-5 rounded-xl border p-4 ${bg}`}>
      <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
        {title}
      </h3>
      <p className="mt-2 text-[14px] leading-relaxed text-slate-700 dark:text-slate-200 whitespace-pre-wrap">
        {children}
      </p>
    </div>
  )
}
