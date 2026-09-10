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
