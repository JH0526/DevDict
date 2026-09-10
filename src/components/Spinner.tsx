/** 简易 SVG 旋转菊花，用于按钮 / 列表加载态 */
export function Spinner({ size = 14, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`animate-spin ${className}`}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** 进度条：0-100，纯 CSS transition 平滑 */
export function ProgressBar({ value, className = '' }: { value: number; className?: string }) {
  const v = Math.max(0, Math.min(100, value))
  return (
    <div className={`h-1.5 w-full rounded-full bg-slate-200/70 dark:bg-slate-700/60 overflow-hidden ${className}`}>
      <div
        className="h-full rounded-full bg-indigo-500 dark:bg-indigo-400 transition-all duration-300 ease-out"
        style={{ width: `${v}%` }}
      />
    </div>
  )
}
