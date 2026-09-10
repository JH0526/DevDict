import type { MasteryFilter } from '../lib/store'
import type { TermView } from '../types'
import { CATEGORIES } from '../data'
import { TermCardCompact } from '../components/TermCard'

interface Props {
  results: TermView[]
  query: string
  setQuery: (v: string) => void
  category: string
  setCategory: (v: string) => void
  mastery: MasteryFilter
  setMastery: (v: MasteryFilter) => void
  starredOnly: boolean
  setStarredOnly: (v: boolean) => void
  onOpen: (t: TermView) => void
  total: number
}

export function DictView(p: Props) {
  const filters: { label: string; value: MasteryFilter }[] = [
    { label: '全部', value: 'all' },
    { label: '生疏', value: 0 },
    { label: '见过', value: 1 },
    { label: '掌握', value: 2 },
  ]

  return (
    <div className="h-full flex flex-col">
      <div className="shrink-0 px-4 md:px-6 pt-4">
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          <input
            value={p.query}
            onChange={(e) => p.setQuery(e.target.value)}
            placeholder="搜术语：SSR / 防抖 / RAG / 只知道半截也行"
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 pl-10 pr-10 py-3 text-[15px] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-500/20"
          />
          {p.query && (
            <button
              onClick={() => p.setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 px-1"
              aria-label="清空"
            >
              ✕
            </button>
          )}
        </div>

        <div className="mt-3 flex gap-1.5 overflow-x-auto scroll-thin pb-1 -mx-1 px-1">
          <Chip active={p.category === 'all'} onClick={() => p.setCategory('all')}>
            全部
          </Chip>
          {CATEGORIES.map((c) => (
            <Chip key={c} active={p.category === c} onClick={() => p.setCategory(c)}>
              {c}
            </Chip>
          ))}
        </div>

        <div className="mt-2 flex items-center gap-1.5">
          {filters.map((f) => (
            <Chip key={String(f.value)} active={p.mastery === f.value} onClick={() => p.setMastery(f.value)} small>
              {f.label}
            </Chip>
          ))}
          <Chip active={p.starredOnly} onClick={() => p.setStarredOnly(!p.starredOnly)} small>
            ★ 收藏
          </Chip>
          <span className="ml-auto text-xs text-slate-400 shrink-0">{p.results.length} / {p.total}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scroll-thin px-4 md:px-6 py-4">
        {p.results.length === 0 ? (
          <Empty onAdd={() => p.setQuery('')} />
        ) : (
          <div className="grid gap-1.5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
            {p.results.map((t) => (
              <TermCardCompact key={t.id} term={t} onClick={() => p.onOpen(t)} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Chip({
  active,
  onClick,
  children,
  small,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  small?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full border transition ${
        small ? 'text-[11px] px-2.5 py-1' : 'text-[13px] px-3 py-1.5'
      } ${
        active
          ? 'bg-indigo-600 border-indigo-600 text-white'
          : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
      }`}
    >
      {children}
    </button>
  )
}

function Empty({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center py-16">
      <div className="text-4xl">🫥</div>
      <p className="mt-3 text-slate-500 dark:text-slate-400 text-sm">没找到，换个词试试</p>
      <button onClick={onAdd} className="mt-3 text-sm text-indigo-600 dark:text-indigo-400">
        清空搜索
      </button>
    </div>
  )
}
