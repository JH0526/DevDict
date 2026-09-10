import type { Term } from '../types'
import { seed01 } from './seed-01'
import { seed02 } from './seed-02'
import { seed03 } from './seed-03'
import { seed04 } from './seed-04'
import { seed05 } from './seed-05'
import { seed06 } from './seed-06'
import { seed07 } from './seed-07'
import { seed08 } from './seed-08'
import { seed09 } from './seed-09'
import { seed10 } from './seed-10'
import { seed11 } from './seed-11'
import { seed12 } from './seed-12'
import { seed13 } from './seed-13'
import { seed14 } from './seed-14'
import { seed15 } from './seed-15'
import { seed16 } from './seed-16'
import { seed17 } from './seed-17'
import { seed18 } from './seed-18'
import { seed19 } from './seed-19'
import { seed20 } from './seed-20'
import { seed21 } from './seed-21'
import { seed22 } from './seed-22'
import { seed23 } from './seed-23'
import { seed24 } from './seed-24'
import { pairsDetail1 } from './pairs-detail-1'
import { pairsDetail2 } from './pairs-detail-2'

const PAIRS_DETAIL = { ...pairsDetail1, ...pairsDetail2 }

/** 把「作用 / 使用环境」合并进配合术语，key = `词条id::配合术语名` */
function withPairsDetail(list: Term[]): Term[] {
  return list.map((t) => {
    if (!t.pairs?.length) return t
    return {
      ...t,
      pairs: t.pairs.map((p) => ({
        ...p,
        role: p.role ?? PAIRS_DETAIL[`${t.id}::${p.en}`]?.role,
        env: p.env ?? PAIRS_DETAIL[`${t.id}::${p.en}`]?.env,
      })),
    }
  })
}

export const SEED_TERMS: Term[] = withPairsDetail([
  ...seed01,
  ...seed02,
  ...seed03,
  ...seed04,
  ...seed05,
  ...seed06,
  ...seed07,
  ...seed08,
  ...seed09,
  ...seed10,
  ...seed11,
  ...seed12,
  ...seed13,
  ...seed14,
  ...seed15,
  ...seed16,
  ...seed17,
  ...seed18,
  ...seed19,
  ...seed20,
  ...seed21,
  ...seed22,
  ...seed23,
  ...seed24,
])

export const CATEGORIES = [
  '前端',
  'AI',
  '后端',
  '数据库',
  '工程化',
  'Git',
  'DevOps',
  '设计',
  '产品',
  '安全',
  '测试',
  'VibeCoding',
  '网页',
  '网站',
  '本地部署',
  '云端部署',
  '游戏',
  '终端',
  '环境',
] as const
