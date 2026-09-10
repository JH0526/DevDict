/** 浏览器内置 TTS：朗读英文术语名。免费、离线、无第三方依赖（PWA 与 Electron 均可用） */

const supported =
  typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window

let cached: SpeechSynthesisVoice | null = null

/** 挑一个英语音色，优先本机自带的 en-US 女声/男声，避免系统拿中文腔读英文 */
function pickVoice(): SpeechSynthesisVoice | null {
  if (!supported) return null
  if (cached) return cached
  const voices = window.speechSynthesis.getVoices()
  if (!voices.length) return null
  const en = voices.filter((v) => /^en(-|_|$)/i.test(v.lang))
  const picked =
    en.find((v) => v.lang === 'en-US' && v.localService) ??
    en.find((v) => v.lang === 'en-US') ??
    en.find((v) => v.localService) ??
    en[0] ??
    null
  cached = picked
  return picked
}

if (supported) {
  // 首次 getVoices() 往往返回空，等系统回调再缓存一次
  window.speechSynthesis.addEventListener?.('voiceschanged', () => {
    cached = null
    pickVoice()
  })
}

export const speechSupported = supported

/** 朗读一段英文；重复点击会先掐掉上一条 */
export function speak(text: string, onEnd?: () => void): boolean {
  if (!supported || !text) return false
  try {
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'en-US'
    u.rate = 0.9
    u.pitch = 1
    const v = pickVoice()
    if (v) u.voice = v
    if (onEnd) {
      u.onend = onEnd
      u.onerror = onEnd
    }
    window.speechSynthesis.speak(u)
    return true
  } catch {
    onEnd?.()
    return false
  }
}

export function stopSpeak() {
  if (supported) window.speechSynthesis.cancel()
}
