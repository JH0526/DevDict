# DevDict · 开发术语词典

> 一个 PWA 术语词典：电脑 + iPhone + 安卓 + 桌面 App（Win/Mac/Linux）同一个网址打开，离线可用，数据云端可同步。

**线上地址**：https://bfb27116819d4d19920fdf683491971a.app.workbuddy.link

**项目主页**：https://github.com/JH0526/DevDict

**桌面 App 下载**：见 [Releases](https://github.com/JH0526/DevDict/releases)（打 tag 后自动生成 Windows / macOS / Linux 安装包）

## 它是什么

- 收 470+ 条开发 / vibecoding 术语（前端 / 后端 / AI / 数据库 / Git / DevOps / 设计 / 产品 / 安全 / 测试 / VibeCoding / 网页 / 网站 / 本地部署 / 云端部署 16 个分类）
- 每条含：英文原词、中文直译、别名、**专业解译**、**大白话类比**、**作用**、**常用场景**、**配合术语**（带关系 / 作用 / 使用环境）
- 搜索支持中英文互搜、模糊匹配（拼错、半截、中英混输都能搜到）
- 离线可用（IndexedDB + Service Worker）
- 数据云端可同步（腾讯云 CloudBase）

## 技术栈

| 层 | 选型 |
|---|---|
| 框架 | Vite 6 + React 18 + TypeScript（严格模式） |
| 样式 | Tailwind CSS v4，深浅色跟随系统 |
| 本地存储 | IndexedDB（idb），本地优先，离线可用 |
| 搜索 | Fuse.js 模糊匹配 + 精确子串优先 |
| 离线/PWA | vite-plugin-pwa（autoUpdate + Workbox 预缓存） |
| 同步 | 腾讯云 CloudBase（NoSQL 文档型，可选） |
| 桌面端 | Electron + electron-builder（不签名） |

## 开发

```bash
npm install
npm run dev          # 启动 Vite dev server（http://localhost:5173）
npm run build        # 构建 PWA 到 dist/
npm run electron:compile  # 编译 electron 入口到 electron/main.cjs
```

## 桌面 App 打包

```bash
npm run cap:build:win      # Windows .exe（NSIS）
npm run cap:build:mac      # macOS .dmg（Intel + Apple Silicon）
npm run cap:build:linux    # Linux .AppImage / .deb
```

产物在 `release/` 目录。

> **不签名**：Windows Defender / macOS Gatekeeper 会弹"未识别开发者"提示，需要在系统设置里手动允许。自用 / 信任的小圈子分发够用。

## 启用数据同步（可选）

复制 `.env.example` 为 `.env.local`，填：

```
VITE_CLOUDBASE_ENV=your-env-id
```

> CloudBase 是腾讯云的产品，国内速度快。注册地址：https://console.cloud.tencent.com/tcb

首次启用需要在 CloudBase 控制台：
1. 启用「匿名登录」或「邮箱密码登录」
2. 创建集合 `terms` 和 `states`
3. 配置安全规则（设置页有完整指引）

## 长期维护

- **代码托管**：本仓库（GitHub 私有）
- **自动构建**：push main → GitHub Actions 自动跑 build
- **自动打包**：push tag `v*` → 自动出 3 平台桌面安装包，上传 GitHub Releases
- **PWA 更新**：seed-terms.json + version.json 走 NetworkOnly 缓存策略，词条库可增量推送

## 目录结构

```
devdict/
├─ src/
│  ├─ data/          # 种子库 19 个分片（seed-01~19），共 ~476 条
│  ├─ lib/           # db(IndexedDB) / store(状态+搜索) / sync(CloudBase) / ai(生成) / update / pwa
│  ├─ components/    # TermCard / TermDetail
│  ├─ views/         # Dict / Vocab / Add / Settings
│  └─ App.tsx
├─ electron/         # 桌面端入口（main.ts 编译成 main.cjs）
├─ build/            # 打包用图标资源
├─ .github/workflows # CI + Release
└─ public/           # PWA 图标 + version.json / seed-terms.json（构建时生成）
```

## 许可

MIT
