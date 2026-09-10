import { registerSW } from 'virtual:pwa-register'

let applyUpdate: (() => Promise<void>) | null = null

/** 桌面端（Electron，file:// 协议）不支持 Service Worker，跳过注册 */
const isDesktop = typeof location !== 'undefined' && location.protocol === 'file:'

/** 注册 Service Worker；有新版本时回调通知，由 UI 决定何时切换 */
export function registerPWA(onNeedRefresh: () => void) {
  if (isDesktop) return
  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      onNeedRefresh()
    },
    onOfflineReady() {
      /* 已可离线使用，无需打扰用户 */
    },
  })
  applyUpdate = () => updateSW(true)
  return updateSW
}

/** 应用新版本并刷新 */
export async function applyAppUpdate() {
  if (isDesktop) {
    // 桌面端无法用 Service Worker 自更新，引导去 GitHub Releases 下载安装包
    window.open('https://github.com/JH0526/DevDict/releases', '_blank')
    return
  }
  if (applyUpdate) {
    await applyUpdate()
    return
  }
  // 兜底：没有 SW 时直接刷新
  location.reload()
}

/** 主动让浏览器去检查是否有新的 Service Worker */
export async function triggerSWCheck() {
  if (isDesktop) return
  if (!('serviceWorker' in navigator)) return
  const reg = await navigator.serviceWorker.getRegistration()
  await reg?.update()
}
