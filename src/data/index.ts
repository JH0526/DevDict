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
import { seed25 } from './seed-25'
import { seed26 } from './seed-26'
import { seed27 } from './seed-27'
import { seed28 } from './seed-28'
import { seed29 } from './seed-29'
import { seed30 } from './seed-30'
import { seed31 } from './seed-31'
import { seed32 } from './seed-32'
import { seed33 } from './seed-33'
import { seed34 } from './seed-34'
import { seed35 } from './seed-35'
import { seed36 } from './seed-36'
import { seed37 } from './seed-37'
import { seed38 } from './seed-38'
import { seed39 } from './seed-39'
import { seed40 } from './seed-40'
import { seed41 } from './seed-41'
import { seed42 } from './seed-42'
import { seed43 } from './seed-43'
import { seed44 } from './seed-44'
import { seed45 } from './seed-45'
import { seed46 } from './seed-46'
import { seed47 } from './seed-47'
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
  ...seed25,
  ...seed26,
  ...seed27,
  ...seed28,
  ...seed29,
  ...seed30,
  ...seed31,
  ...seed32,
  ...seed33,
  ...seed34,
  ...seed35,
  ...seed36,
  ...seed37,
  ...seed38,
  ...seed39,
  ...seed40,
  ...seed41,
  ...seed42,
  ...seed43,
  ...seed44,
  ...seed45,
  ...seed46,
  ...seed47,
])

export const CATEGORIES = [
  '前端',
  'AI',
  'A2A',
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
  '算法与数据结构',
  '设计模式',
  '操作系统',
  '网络协议',
  '性能优化',
  '可观测性',
  '消息队列与缓存',
  '架构模式',
  '移动开发',
  '编码与字符',
] as const
