import { useEffect, useRef, useState } from 'react'
import { speak, speechSupported, stopSpeak } from '../lib/speech'

interface Props {
  /** 要朗读的文本（英文术语名） */
  text: string
  /** 图标像素尺寸 */
  size?: number
  className?: string
}

/**
 * 小喇叭朗读按钮：只朗读英文术语名。
 * 用 span 而非 button，避免卡片本身是 button 时嵌套非法；
 * 点击时阻止冒泡，避免误触发卡片打开。
 */
export function SpeakButton({ text, size = 13, className = '' }: Props) {
  const [playing, setPlaying] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  if (!speechSupported || !text) return null

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    window.clearTimeout(timer.current)
    if (playing) {
      stopSpeak()
      setPlaying(false)
      return
    }
    setPlaying(true)
    const ok = speak(text, () => setPlaying(false))
    if (!ok) setPlaying(false)
    // 兜底：某些浏览器 onend 不触发，按字数估时后复位
    timer.current = window.setTimeout(() => setPlaying(false), Math.min(8000, 1200 + text.length * 130))
  }

  return (
    <span
      role="button"
      aria-label={`朗读 ${text}`}
      title={playing ? '停止' : `朗读 ${text}`}
      onClick={onClick}
      className={`inline-flex shrink-0 items-center justify-center rounded-full transition ${
        playing
          ? 'text-indigo-600 dark:text-indigo-400'
          : 'text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400'
      } ${className}`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" />
        {playing ? (
          <path d="M15.5 8.5a5 5 0 0 1 0 7" />
        ) : (
          <>
            <path d="M15.5 8.5a5 5 0 0 1 0 7" />
            <path d="M19 5a9 9 0 0 1 0 14" opacity="0.55" />
          </>
        )}
      </svg>
    </span>
  )
}
