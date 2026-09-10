export type Category =
  | '前端'
  | '后端'
  | 'AI'
  | '工程化'
  | 'Git'
  | '数据库'
  | 'DevOps'
  | '设计'
  | '产品'
  | '安全'
  | '测试'
  | 'VibeCoding'
  | '网页'
  | '网站'
  | '本地部署'
  | '云端部署'

export interface Term {
  id: string
  en: string
  zh: string
  alias?: string[]
  category: Category
  pro: string
  plain: string
  scene: string
  related: string[]
  source?: 'seed' | 'user'
  /** 作用：它解决什么问题、为什么需要它 */
  purpose?: string
  /** 配合术语：经常一起出现、协同工作的词 */
  pairs?: Pair[]
}

export interface Pair {
  /** 配合术语名 */
  en: string
  /** 关系：两者是什么关系（谁补谁、谁替代谁、上下游…） */
  rel?: string
  /** 作用：在这个配合里它起什么作用 */
  role?: string
  /** 使用环境：什么情况下会这样配合 */
  env?: string
}

/** 用户的个人状态，独立于种子库存储 */
export interface UserState {
  termId: string
  mastery: 0 | 1 | 2 // 0 生疏 / 1 见过 / 2 掌握
  note: string
  starred: boolean
  updatedAt: number
}

export interface TermView extends Term {
  mastery: 0 | 1 | 2
  note: string
  starred: boolean
  source: 'seed' | 'user'
}
