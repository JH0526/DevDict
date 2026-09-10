/**
 * 数据同步：腾讯云 CloudBase（国内推荐）
 * 不配置环境变量时降级为本地模式（syncEnabled = false）
 *
 * 同步范围（最小化写入）：
 *   - 用户自建词条（terms 表，source === 'user'）
 *   - 个人状态（states 表：mastery / starred / note）
 * 种子词条不同步（每端都自带）
 */
import cloudbase from '@cloudbase/js-sdk'
import type { Term, UserState } from '../types'

const ENV = import.meta.env.VITE_CLOUDBASE_ENV as string | undefined
export const syncEnabled = Boolean(ENV)

let app: ReturnType<typeof cloudbase.init> | null = null
function getApp() {
  if (!app) {
    if (!ENV) throw new Error('未配置 VITE_CLOUDBASE_ENV，无法启用同步')
    app = cloudbase.init({ env: ENV })
  }
  return app
}

// === 认证 ===

export type CloudUser = { uid: string; email?: string }

export async function getCurrentUser(): Promise<CloudUser | null> {
  if (!syncEnabled) return null
  const auth = getApp().auth()
  try {
    const state = await auth.getLoginState()
    if (!state?.user) return null
    return { uid: String(state.user.uid ?? ''), email: state.user.email }
  } catch {
    return null
  }
}

export async function signInAnonymously(): Promise<CloudUser | null> {
  if (!syncEnabled) return null
  const auth = getApp().auth()
  await auth.signInAnonymously()
  return getCurrentUser()
}

export async function signInWithEmail(email: string, password: string): Promise<CloudUser | null> {
  if (!syncEnabled) return null
  const auth = getApp().auth()
  await auth.signInWithEmailAndPassword(email, password)
  return getCurrentUser()
}

export async function signUpWithEmail(email: string, password: string): Promise<CloudUser | null> {
  if (!syncEnabled) return null
  const auth = getApp().auth()
  await auth.signUpWithEmailAndPassword(email, password)
  return getCurrentUser()
}

export async function signOut(): Promise<void> {
  if (!syncEnabled) return
  await getApp().auth().signOut()
}

// === 同步数据 ===

/**
 * 推：把本地自建词条 + 个人状态推到云端
 * 策略：upsert（按 _id 覆盖），保证重试安全
 */
export async function push(userTerms: Term[], states: UserState[]): Promise<void> {
  if (!syncEnabled) return
  const user = await getCurrentUser()
  if (!user) throw new Error('未登录，无法同步')
  const db = getApp().database()

  if (userTerms.length) {
    // CloudBase 单次最多 20 条，分批
    for (let i = 0; i < userTerms.length; i += 20) {
      const batch = userTerms.slice(i, i + 20)
      const promises = batch.map((t) =>
        db.collection('terms').doc(`${user.uid}_${t.id}`).set({ ...t, _uid: user.uid }),
      )
      await Promise.all(promises)
    }
  }

  if (states.length) {
    for (let i = 0; i < states.length; i += 20) {
      const batch = states.slice(i, i + 20)
      const promises = batch.map((s) =>
        db.collection('states').doc(`${user.uid}_${s.termId}`).set({ ...s, _uid: user.uid }),
      )
      await Promise.all(promises)
    }
  }
}

/**
 * 拉：从云端拉自建词条 + 个人状态
 */
export async function pull(): Promise<{ terms: Term[]; states: UserState[] }> {
  if (!syncEnabled) return { terms: [], states: [] }
  const user = await getCurrentUser()
  if (!user) throw new Error('未登录，无法同步')
  const db = getApp().database()

  const [tRes, sRes] = await Promise.all([
    db.collection('terms').where({ _uid: user.uid }).limit(1000).get(),
    db.collection('states').where({ _uid: user.uid }).limit(5000).get(),
  ])

  const terms = (tRes.data ?? []).map((d: any) => ({ ...d, source: 'user' as const })) as Term[]
  const states = (sRes.data ?? []) as UserState[]
  return { terms, states }
}

/**
 * 建集合指引：用户首次启用同步时在设置页展示
 * CloudBase 是 NoSQL 文档数据库，集合（collection）会自动创建
 * 推荐设置的安全规则：
 *   - 集合 terms / states 都开启"仅创建者读写"（_uid 匹配）
 *   - 在 CloudBase 控制台 → 数据模型 → 集合 → 安全规则
 */
export const SETUP_GUIDE = `📋 CloudBase 集合配置（控制台 → 数据模型）：

1. 创建集合 terms（自建词条）和 states（个人状态）
2. 安全规则 → 自定义：
   {
     "read": "doc._uid == auth.uid",
     "write": "doc._uid == auth.uid"
   }
3. 登录方式（用户管理 → 登录方式）：
   - 启用「匿名登录」（推荐：零注册成本，跨端自动同步）
   - 或启用「邮箱密码登录」（需要用户注册）
`
