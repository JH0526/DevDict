import type { Term } from '../types'
import { CATEGORIES } from '../data'

export interface AIConfig {
  baseUrl: string
  apiKey: string
  model: string
}

const KEY = 'devdict.ai.config'

export function loadAIConfig(): AIConfig {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as AIConfig
  } catch {
    /* 忽略损坏的配置 */
  }
  return { baseUrl: 'https://api.deepseek.com/v1', apiKey: '', model: 'deepseek-chat' }
}

export function saveAIConfig(cfg: AIConfig) {
  localStorage.setItem(KEY, JSON.stringify(cfg))
}

const SYSTEM = `你是资深开发工程师兼技术翻译，为中文开发者解释技术术语。
只输出 JSON，不要任何解释文字和 markdown 代码块标记。字段：
en(英文术语) zh(中文直译) alias(别名数组，可空) category(必须是其中之一：${CATEGORIES.join('/')})
pro(专业解译，2-3句，准确严谨) plain(大白话，1-2句，必须用一个生活化类比，让完全不懂技术的人能懂)
purpose(作用：它解决什么问题、为什么需要它，1句) scene(什么情况下会用到，1句)
pairs(数组，2-3项，每项 {en(配合术语英文), rel(两者什么关系), role(它在这个配合里起什么作用), env(什么环境下这样配合)})
related(2-3个关联术语英文，数组)
如果输入不是技术术语，仍按最接近的含义解释。所有文本用简体中文。`

export async function generateTerm(word: string, cfg: AIConfig): Promise<Term> {
  if (!cfg.apiKey.trim()) throw new Error('请先在「设置」里填写 AI 接口的 Key')

  const res = await fetch(`${cfg.baseUrl.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cfg.apiKey}`,
    },
    body: JSON.stringify({
      model: cfg.model,
      temperature: 0.3,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM },
        { role: 'user', content: `解释术语：${word}` },
      ],
    }),
  })

  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    throw new Error(`AI 接口返回 ${res.status}：${txt.slice(0, 200)}`)
  }

  const json = await res.json()
  const content = json?.choices?.[0]?.message?.content
  if (!content) throw new Error('AI 返回内容为空')

  let data: Record<string, unknown>
  try {
    data = JSON.parse(content)
  } catch {
    throw new Error('AI 返回的不是合法 JSON，请重试')
  }

  const category = CATEGORIES.includes(data.category as never) ? (data.category as Term['category']) : '前端'
  return {
    id: `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    en: String(data.en ?? word),
    zh: String(data.zh ?? ''),
    alias: Array.isArray(data.alias) ? data.alias.map(String) : [],
    category,
    pro: String(data.pro ?? ''),
    plain: String(data.plain ?? ''),
    scene: String(data.scene ?? ''),
    purpose: data.purpose ? String(data.purpose) : undefined,
    pairs: Array.isArray(data.pairs)
      ? data.pairs
          .map((p) => {
            const o = p as Record<string, unknown>
            return o?.en
              ? {
                  en: String(o.en),
                  rel: o.rel ? String(o.rel) : undefined,
                  role: o.role ? String(o.role) : undefined,
                  env: o.env ? String(o.env) : undefined,
                }
              : null
          })
          .filter((x): x is NonNullable<typeof x> => !!x)
      : [],
    related: Array.isArray(data.related) ? data.related.map(String) : [],
    source: 'user',
  }
}

const SYSTEM_BATCH = `你是资深开发工程师兼技术翻译，为中文开发者批量解释技术术语。
用户会给出多个术语（一行一个）。请对每一个术语，生成一份解释。
最终只输出一个 JSON 对象，结构固定为：
{"terms":[ {"en"(英文术语),"zh"(中文直译),"alias"(别名数组,可空),"category"(必须是其中之一：${CATEGORIES.join(
  '/',
)},"pro"(专业解译,2-3句,准确严谨),"plain"(大白话,1-2句,必须用一个生活化类比,让完全不懂技术的人能懂),"purpose"(作用:它解决什么问题、为什么需要它,1句),"scene"(什么情况下会用到,1句),"pairs"(数组,2-3项,每项 {en(配合术语英文),rel(两者什么关系),role(它在这个配合里起什么作用),env(什么环境下这样配合)}),"related"(2-3个关联术语英文,数组)} , ... ]}
必须包含用户给出的每一个术语，不要遗漏，也不要新增未提及的术语。所有文本用简体中文。`

/**
 * 批量生成术语：一次请求最多 20 个，返回 Term 数组。
 * 调用前应由上层先做查重（术语词典已有则不再生成）。
 */
export async function generateTerms(words: string[], cfg: AIConfig): Promise<Term[]> {
  if (!cfg.apiKey.trim()) throw new Error('请先在「设置」里填写 AI 接口的 Key')
  if (words.length === 0) throw new Error('没有可生成的术语')
  if (words.length > 20) throw new Error('一次最多生成 20 个术语')

  const res = await fetch(`${cfg.baseUrl.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cfg.apiKey}`,
    },
    body: JSON.stringify({
      model: cfg.model,
      temperature: 0.3,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_BATCH },
        {
          role: 'user',
          content: `解释以下术语（每行一个，共 ${words.length} 个）：\n${words.map((w, i) => `${i + 1}. ${w}`).join('\n')}`,
        },
      ],
    }),
  })

  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    throw new Error(`AI 接口返回 ${res.status}：${txt.slice(0, 200)}`)
  }

  const json = await res.json()
  const content = json?.choices?.[0]?.message?.content
  if (!content) throw new Error('AI 返回内容为空')

  let data: Record<string, unknown>
  try {
    data = JSON.parse(content)
  } catch {
    throw new Error('AI 返回的不是合法 JSON，请重试')
  }

  const arr = Array.isArray(data.terms) ? data.terms : []
  if (arr.length === 0) throw new Error('AI 未返回任何术语，请重试')

  const stamp = Date.now().toString(36)
  const out: Term[] = []
  for (let i = 0; i < arr.length; i++) {
    const o = arr[i] as Record<string, unknown>
    if (!o?.en) continue
    const category = CATEGORIES.includes(o.category as never) ? (o.category as Term['category']) : '前端'
    out.push({
      id: `u_${stamp}_${i}_${Math.random().toString(36).slice(2, 6)}`,
      en: String(o.en),
      zh: o.zh ? String(o.zh) : '',
      alias: Array.isArray(o.alias) ? o.alias.map(String) : [],
      category,
      pro: o.pro ? String(o.pro) : '',
      plain: o.plain ? String(o.plain) : '',
      scene: o.scene ? String(o.scene) : '',
      purpose: o.purpose ? String(o.purpose) : undefined,
      pairs: Array.isArray(o.pairs)
        ? o.pairs
            .map((p) => {
              const po = p as Record<string, unknown>
              return po?.en
                ? {
                    en: String(po.en),
                    rel: po.rel ? String(po.rel) : undefined,
                    role: po.role ? String(po.role) : undefined,
                    env: po.env ? String(po.env) : undefined,
                  }
                : null
            })
            .filter((x): x is NonNullable<typeof x> => !!x)
        : [],
      related: Array.isArray(o.related) ? o.related.map(String) : [],
      source: 'user',
    })
  }
  return out
}
