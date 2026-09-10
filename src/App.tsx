import { useCallback, useEffect, useMemo, useState } from 'react'
import type { TermView, UserState } from './types'
import { useDict, useSearch, type MasteryFilter } from './lib/store'
import { applyAppUpdate, registerPWA } from './lib/pwa'
import { DictView } from './views/DictView'
import { AddView } from './views/AddView'
import { VocabView } from './views/VocabView'
import { SettingsView } from './views/SettingsView'
import { TermDetail } from './components/TermDetail'

type Tab = 'dict' | 'vocab' | 'add' | 'settings'

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'dict', label: '词典', icon: '📖' },
  { key: 'vocab', label: '生词本', icon: '🃏' },
  { key: 'add', label: '添加', icon: '＋' },
  { key: 'settings', label: '设置', icon: '⚙' },
]

export default function App() {
  const { terms, loading, refresh, updateState, addTerm, removeTerm, importTerms, updateSeed, resetAll } =
    useDict()
  const [needRefresh, setNeedRefresh] = useState(false)
  const [tab, setTab] = useState<Tab>('dict')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [mastery, setMastery] = useState<MasteryFilter>('all')
  const [starredOnly, setStarredOnly] = useState(false)
  const [open, setOpen] = useState<TermView | null>(null)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  const results = useSearch(terms, query, category, mastery)
  const visible = useMemo(
    () => (starredOnly ? results.filter((t) => t.starred) : results),
    [results, starredOnly],
  )

  useEffect(() => {
    registerPWA(() => setNeedRefresh(true))
  }, [])

  const showToast = useCallback((msg: string, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 2200)
  }, [])

  const states: UserState[] = useMemo(
    () => terms.map((t) => ({ termId: t.id, mastery: t.mastery, note: t.note, starred: t.starred, updatedAt: 0 })),
    [terms],
  )

  const jump = (word: string) => {
    setOpen(null)
    setCategory('all')
    setMastery('all')
    setStarredOnly(false)
    setQuery(word)
    setTab('dict')
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-slate-400 text-sm">加载中…</div>
    )
  }

  return (
    <div className="h-full flex bg-slate-50 dark:bg-[#0b1220]">
      {/* 桌面侧栏 */}
      <aside className="hidden md:flex w-52 shrink-0 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="px-5 py-5">
          <div className="text-lg font-bold text-slate-900 dark:text-slate-50">DevDict</div>
          <div className="text-[11px] text-slate-400 mt-0.5">开发术语词典</div>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition ${
                tab === t.key
                  ? 'bg-indigo-50 text-indigo-700 font-medium dark:bg-indigo-500/15 dark:text-indigo-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span className="text-base w-5 text-center">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>
        <div className="px-5 py-4 text-[11px] text-slate-400">共 {terms.length} 条 · 离线可用</div>
      </aside>

      {/* 主区 */}
      <main className="flex-1 min-w-0 pb-16 md:pb-0">
        {tab === 'dict' && (
          <DictView
            results={visible}
            query={query}
            setQuery={setQuery}
            category={category}
            setCategory={setCategory}
            mastery={mastery}
            setMastery={setMastery}
            starredOnly={starredOnly}
            setStarredOnly={setStarredOnly}
            onOpen={setOpen}
            total={terms.length}
          />
        )}
        {tab === 'vocab' && (
          <VocabView
            terms={terms}
            onUpdate={(id, patch) => updateState(id, patch)}
            onOpen={setOpen}
          />
        )}
        {tab === 'add' && <AddView onSave={addTerm} onToast={showToast} />}
        {tab === 'settings' && (
          <SettingsView
            terms={terms}
            states={states}
            onImport={importTerms}
            onReset={resetAll}
            onToast={showToast}
            onRefresh={refresh}
            onUpdateSeed={updateSeed}
            needRefresh={needRefresh}
            onApplyUpdate={applyAppUpdate}
          />
        )}
      </main>

      {/* 移动底部栏 */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur pb-safe">
        <div className="flex">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 py-2.5 flex flex-col items-center gap-0.5 text-[11px] ${
                tab === t.key ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
              }`}
            >
              <span className="text-lg leading-none">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      {needRefresh && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] max-w-md flex items-center gap-3 rounded-xl bg-slate-900 dark:bg-slate-700 text-white px-4 py-3 shadow-lg">
          <span className="text-sm flex-1">有新版本可用，更新后刷新即可</span>
          <button
            onClick={async () => {
              await applyAppUpdate()
            }}
            className="shrink-0 px-3 py-1.5 rounded-lg bg-indigo-500 text-sm font-medium"
          >
            更新
          </button>
          <button
            onClick={() => setNeedRefresh(false)}
            className="shrink-0 text-slate-400 hover:text-white text-sm px-1"
            aria-label="稍后"
          >
            ✕
          </button>
        </div>
      )}

      {open && (
        <TermDetail
          term={terms.find((t) => t.id === open.id) ?? open}
          onClose={() => setOpen(null)}
          onUpdate={(patch) => updateState(open.id, patch)}
          onDelete={
            open.source === 'user'
              ? async () => {
                  await removeTerm(open.id)
                  setOpen(null)
                  showToast('已删除')
                }
              : undefined
          }
          onJump={jump}
        />
      )}

      {toast && (
        <div
          className={`fixed left-1/2 -translate-x-1/2 bottom-20 md:bottom-8 z-50 px-4 py-2.5 rounded-lg text-sm text-white shadow-lg ${
            toast.ok ? 'bg-slate-900 dark:bg-slate-700' : 'bg-rose-600'
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  )
}
