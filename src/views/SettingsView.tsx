import { useEffect, useRef, useState } from 'react'
import type { Term, UserState } from '../types'
import { loadAIConfig, saveAIConfig, type AIConfig } from '../lib/ai'
import {
  APP_VERSION,
  BUILD_TIME,
  CHANGELOG,
  fetchMeta,
  formatBuildTime,
  isNewer,
  type RemoteMeta,
} from '../lib/update'
import { getSeedVersion } from '../lib/db'
import { triggerSWCheck } from '../lib/pwa'
import {
  SETUP_GUIDE,
  getCurrentUser,
  pull,
  push,
  signInAnonymously,
  signInWithEmail,
  signOut,
  signUpWithEmail,
  syncEnabled,
} from '../lib/sync'

interface Props {
  terms: Term[]
  states: UserState[]
  onImport: (list: Term[]) => Promise<void>
  onReset: () => Promise<void>
  onToast: (msg: string, ok?: boolean) => void
  onRefresh: () => Promise<void>
  onUpdateSeed: () => Promise<{ changed: number; latest: boolean; version: number }>
  needRefresh: boolean
  onApplyUpdate: () => void | Promise<void>
}

export function SettingsView({
  terms,
  states,
  onImport,
  onReset,
  onToast,
  onRefresh,
  onUpdateSeed,
  needRefresh,
  onApplyUpdate,
}: Props) {
  const [ai, setAi] = useState<AIConfig>(loadAIConfig())
  const [seedVersion, setSeedVersion] = useState<number>(0)
  const [appUpdate, setAppUpdate] = useState<RemoteMeta | null>(null)
  const [checking, setChecking] = useState(false)
  const [user, setUser] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [pwd, setPwd] = useState('')
  const [busy, setBusy] = useState(false)
  const [showSql, setShowSql] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!syncEnabled) return
    getCurrentUser().then((u) => setUser(u?.email ?? u?.uid ?? null))
  }, [])

  useEffect(() => {
    getSeedVersion().then(setSeedVersion)
  }, [terms])

  const checkApp = async () => {
    setChecking(true)
    try {
      const meta = await fetchMeta()
      void triggerSWCheck() // 同时让浏览器去查新的 Service Worker
      if (isNewer(meta.version, APP_VERSION)) {
        setAppUpdate(meta)
        onToast(`发现新版本 v${meta.version}`, true)
      } else {
        setAppUpdate(null)
        onToast('已是最新版本')
      }
    } catch (e) {
      onToast(e instanceof Error ? e.message : '检查失败', false)
    } finally {
      setChecking(false)
    }
  }

  const checkSeed = async () => {
    setChecking(true)
    try {
      const r = await onUpdateSeed()
      setSeedVersion(r.version)
      await onRefresh()
      onToast(r.latest ? `词条库已是最新（v${r.version}）` : `词条库已更新到 v${r.version}，变动 ${r.changed} 条`)
    } catch (e) {
      onToast(e instanceof Error ? e.message : '检查失败', false)
    } finally {
      setChecking(false)
    }
  }

  const exportJson = () => {
    const data = terms.filter((t) => t.source === 'user')
    const blob = new Blob([JSON.stringify({ terms: data, states }, null, 2)], {
      type: 'application/json',
    })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `devdict-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(a.href)
    onToast('已导出备份')
  }

  const importJson = async (file: File) => {
    try {
      const json = JSON.parse(await file.text())
      const list: Term[] = Array.isArray(json) ? json : (json.terms ?? [])
      if (!list.length) return onToast('文件里没有词条', false)
      await onImport(list)
      onToast(`已导入 ${list.length} 条`)
    } catch {
      onToast('文件解析失败', false)
    }
  }

  const doLogin = async (mode: 'in' | 'up') => {
    if (!email.trim() || !pwd) return onToast('填邮箱和密码', false)
    setBusy(true)
    try {
      const u = mode === 'in' ? await signInWithEmail(email, pwd) : await signUpWithEmail(email, pwd)
      if (!u) throw new Error('登录失败')
      setUser(u.email ?? u.uid)
      onToast(mode === 'in' ? '已登录' : '注册成功')
    } catch (e) {
      onToast(e instanceof Error ? e.message : '登录失败', false)
    } finally {
      setBusy(false)
    }
  }

  const doAnonymousLogin = async () => {
    setBusy(true)
    try {
      const u = await signInAnonymously()
      if (!u) throw new Error('匿名登录失败')
      setUser(`匿名用户 ${u.uid.slice(0, 6)}`)
      onToast('已匿名登录，可同步数据')
    } catch (e) {
      onToast(e instanceof Error ? e.message : '匿名登录失败', false)
    } finally {
      setBusy(false)
    }
  }

  const doSync = async (dir: 'push' | 'pull') => {
    setBusy(true)
    try {
      if (dir === 'push') {
        const mine = terms.filter((t) => t.source === 'user')
        await push(mine, states)
        onToast(`已上传 ${mine.length} 条自建词条 + ${states.length} 条状态`)
      } else {
        const remote = await pull()
        if (remote.terms.length) await onImport(remote.terms)
        await onRefresh()
        onToast(`已拉取 ${remote.terms.length} 条词条`)
      }
    } catch (e) {
      onToast(e instanceof Error ? e.message : '同步失败', false)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="h-full overflow-y-auto scroll-thin px-4 md:px-6 py-5 max-w-2xl">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">设置</h2>

      <Card title="版本与更新">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400">当前版本</span>
          <span className="text-slate-800 dark:text-slate-100">
            v{APP_VERSION}
            <span className="ml-2 text-xs text-slate-400">{formatBuildTime(BUILD_TIME)}</span>
          </span>
        </div>
        <div className="mt-1.5 flex items-center justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400">词条库</span>
          <span className="text-slate-800 dark:text-slate-100">
            v{seedVersion}
            <span className="ml-2 text-xs text-slate-400">
              共 {terms.filter((t) => (t.source ?? 'seed') === 'seed').length} 条
            </span>
          </span>
        </div>

        {(appUpdate || needRefresh) && (
          <div className="mt-3 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 p-3">
            <p className="text-sm text-indigo-800 dark:text-indigo-300">
              发现新版本 {appUpdate ? `v${appUpdate.version}` : ''}
            </p>
            {!!appUpdate?.changelog?.length && (
              <ul className="mt-1.5 space-y-0.5">
                {appUpdate.changelog.map((c) => (
                  <li key={c} className="text-xs text-indigo-700/80 dark:text-indigo-300/80">
                    · {c}
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={() => onApplyUpdate()}
              className="mt-2 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-sm"
            >
              立即更新
            </button>
          </div>
        )}

        <div className="mt-3 flex flex-wrap gap-2">
          <Btn onClick={checkApp} disabled={checking}>
            检查应用更新
          </Btn>
          <Btn onClick={checkSeed} disabled={checking}>
            检查词条更新
          </Btn>
        </div>

        {!!CHANGELOG.length && (
          <div className="mt-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">本次更新内容</p>
            <ul className="mt-1.5 space-y-0.5">
              {CHANGELOG.map((c) => (
                <li key={c} className="text-xs text-slate-500 dark:text-slate-400">
                  · {c}
                </li>
              ))}
            </ul>
          </div>
        )}
        <p className="mt-2 text-xs text-slate-400">
          手机端用浏览器打开后选「添加到主屏幕」。有新版本时这里会提示，点一下即更新，不用重新下载安装。
        </p>
      </Card>

      <Card title="AI 接口（用于一键生成解释）">
        <Field label="Base URL">
          <input
            value={ai.baseUrl}
            onChange={(e) => setAi({ ...ai, baseUrl: e.target.value })}
            className={INPUT}
            placeholder="https://api.deepseek.com/v1"
          />
        </Field>
        <Field label="API Key">
          <input
            type="password"
            value={ai.apiKey}
            onChange={(e) => setAi({ ...ai, apiKey: e.target.value })}
            className={INPUT}
            placeholder="sk-..."
          />
        </Field>
        <Field label="模型">
          <input
            value={ai.model}
            onChange={(e) => setAi({ ...ai, model: e.target.value })}
            className={INPUT}
            placeholder="deepseek-chat"
          />
        </Field>
        <button
          onClick={() => {
            saveAIConfig(ai)
            onToast('已保存')
          }}
          className="mt-1 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm"
        >
          保存
        </button>
        <p className="mt-2 text-xs text-slate-400">
          Key 只存在你自己这台设备的浏览器里，不会上传到别处。兼容 OpenAI 格式的接口都能用（DeepSeek、通义、Kimi、本地 Ollama 等）。
        </p>
      </Card>

      <Card title="数据同步">
        {!syncEnabled ? (
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              当前是<b>本地模式</b>：数据全在这台设备的浏览器里，不联网也能用。
            </p>
            <p className="mt-2 text-xs text-slate-400">
              要开启三端同步，需要部署时配置 CloudBase 环境变量（VITE_CLOUDBASE_ENV）。
            </p>
          </div>
        ) : user ? (
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              已登录：<b>{user}</b>
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Btn onClick={() => doSync('push')} disabled={busy}>
                上传
              </Btn>
              <Btn onClick={() => doSync('pull')} disabled={busy}>
                下拉同步
              </Btn>
              <Btn
                onClick={async () => {
                  await signOut()
                  setUser(null)
                  onToast('已退出')
                }}
              >
                退出
              </Btn>
            </div>
          </div>
        ) : (
          <div>
            <Field label="邮箱">
              <input value={email} onChange={(e) => setEmail(e.target.value)} className={INPUT} />
            </Field>
            <Field label="密码">
              <input
                type="password"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                className={INPUT}
              />
            </Field>
            <div className="mt-2 flex flex-wrap gap-2">
              <Btn onClick={() => doLogin('in')} disabled={busy}>
                登录
              </Btn>
              <Btn onClick={() => doLogin('up')} disabled={busy}>
                注册
              </Btn>
              <Btn onClick={doAnonymousLogin} disabled={busy}>
                匿名登录（零注册）
              </Btn>
            </div>
          </div>
        )}
        {syncEnabled && (
          <>
            <button
              onClick={() => setShowSql((s) => !s)}
              className="mt-3 text-xs text-slate-400 hover:text-indigo-500"
            >
              {showSql ? '收起' : '查看 CloudBase 集合配置（首次使用需配置）'}
            </button>
            {showSql && (
              <pre className="mt-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-[11px] overflow-x-auto scroll-thin text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                {SETUP_GUIDE}
              </pre>
            )}
          </>
        )}
      </Card>

      <Card title="数据管理">
        <div className="flex flex-wrap gap-2">
          <Btn onClick={exportJson}>导出备份</Btn>
          <Btn onClick={() => fileRef.current?.click()}>导入备份</Btn>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) importJson(f)
              e.target.value = ''
            }}
          />
          <Btn
            danger
            onClick={async () => {
              if (confirm('会清空所有个人标注和自建词条，恢复成初始种子库。确定？')) {
                await onReset()
                onToast('已重置')
              }
            }}
          >
            重置
          </Btn>
        </div>
      </Card>

      <Card title="关于">
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          DevDict · 开发术语词典。当前共 <b>{terms.length}</b> 条词条，你在其中标注了{' '}
          <b>{states.length}</b> 条。
          <br />
          手机端用浏览器打开后，选「添加到主屏幕」即可像 App 一样使用；内容更新后刷新即可，无需重装。
        </p>
      </Card>
    </div>
  )
}

const INPUT =
  'w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent px-3 py-2 text-sm text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-400'

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 p-4">
      <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block mb-2">
      <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  )
}

function Btn({
  onClick,
  disabled,
  danger,
  children,
}: {
  onClick: () => void
  disabled?: boolean
  danger?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg text-sm border disabled:opacity-50 ${
        danger
          ? 'border-rose-200 text-rose-600 dark:border-rose-500/40 dark:text-rose-400'
          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
      }`}
    >
      {children}
    </button>
  )
}
