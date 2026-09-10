import type { TermView } from '../types'
import { SpeakButton } from './SpeakButton'

export const CATEGORY_STYLE: Record<string, string> = {
  前端: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
  AI: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
  后端: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  数据库: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  工程化: 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300',
  Git: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
  DevOps: 'bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300',
  设计: 'bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-300',
  产品: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300',
  安全: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300',
  测试: 'bg-lime-100 text-lime-700 dark:bg-lime-500/15 dark:text-lime-300',
  VibeCoding: 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-500/15 dark:text-fuchsia-300',
  网页: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300',
  网站: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
  本地部署: 'bg-stone-100 text-stone-700 dark:bg-stone-500/15 dark:text-stone-300',
  云端部署: 'bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300',
  游戏: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-300',
  终端: 'bg-zinc-200 text-zinc-700 dark:bg-zinc-500/20 dark:text-zinc-300',
  环境: 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300',
}

export const MASTERY_LABEL = ['生疏', '见过', '掌握'] as const
export const MASTERY_STYLE = [
  'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300',
] as const

const MASTERY_DOT = ['bg-slate-300', 'bg-amber-400', 'bg-green-500'] as const

/** 生词本等页面用的完整卡片 */
export function TermCard({ term, onClick }: { term: TermView; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 p-4 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-sm transition"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-[15px] text-slate-900 dark:text-slate-100 truncate">
              {term.en}
            </span>
            <SpeakButton text={term.en} size={13} />
            {term.starred && <span className="text-amber-400 text-sm">★</span>}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{term.zh}</div>
        </div>
        <span
          className={`shrink-0 text-[11px] px-2 py-0.5 rounded-full ${CATEGORY_STYLE[term.category] ?? 'bg-slate-100 text-slate-600'}`}
        >
          {term.category}
        </span>
      </div>

      <p className="mt-2.5 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2">
        {term.plain}
      </p>

      <div className="mt-2.5 flex items-center gap-2">
        <span className={`text-[11px] px-1.5 py-0.5 rounded ${MASTERY_STYLE[term.mastery]}`}>
          {MASTERY_LABEL[term.mastery]}
        </span>
        {term.source === 'user' && (
          <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400">
            自建
          </span>
        )}
      </div>
    </button>
  )
}

/** 主页列表用的紧凑卡片：单行、横向密集排列 */
export function TermCardCompact({ term, onClick }: { term: TermView; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title={term.plain}
      className="w-full text-left rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 px-2.5 py-1.5 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/40 dark:hover:bg-indigo-500/5 transition"
    >
      <div className="flex items-center gap-1.5 min-w-0">
        <span
          className={`shrink-0 w-1.5 h-1.5 rounded-full ${MASTERY_DOT[term.mastery]}`}
          title={MASTERY_LABEL[term.mastery]}
        />
        <span className="font-medium text-[13px] text-slate-900 dark:text-slate-100 truncate">
          {term.en}
        </span>
        <SpeakButton text={term.en} size={11} />
        {term.starred && <span className="shrink-0 text-amber-400 text-[11px]">★</span>}
        <span className="text-[11px] text-slate-400 dark:text-slate-500 truncate">{term.zh}</span>
        <span
          className={`ml-auto shrink-0 text-[10px] px-1.5 py-0.5 rounded ${CATEGORY_STYLE[term.category] ?? 'bg-slate-100 text-slate-600'}`}
        >
          {term.category}
        </span>
      </div>
    </button>
  )
}
