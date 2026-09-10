import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

const pkg = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf8'))

export default defineConfig({
  // 相对路径：Electron 桌面端用 file:// 加载 asar 内 dist 时，资源才能正确解析
  base: './',
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __SEED_VERSION__: JSON.stringify(pkg.seedVersion),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    __CHANGELOG__: JSON.stringify(pkg.changelog ?? []),
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // prompt：由应用自己决定何时切换，好弹"有新版本"提示
      registerType: 'prompt',
      injectRegister: null, // 手动注册，以便拿到更新回调
      includeAssets: ['icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'DevDict 开发术语词典',
        short_name: 'DevDict',
        description: '开发 / Vibe Coding 术语：专业解译 + 大白话翻译',
        theme_color: '#4f46e5',
        background_color: '#f8fafc',
        display: 'standalone',
        start_url: './',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,json}'],
        runtimeCaching: [
          // 这两个文件必须每次取最新的，否则检测不到更新
          { urlPattern: /\/version\.json$/, handler: 'NetworkOnly' },
          { urlPattern: /\/seed-terms\.json$/, handler: 'NetworkOnly' },
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: { cacheName: 'supabase-api', networkTimeoutSeconds: 6 },
          },
        ],
      },
    }),
  ],
})
