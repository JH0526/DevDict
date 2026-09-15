import type { Term } from '../types'

// seed-37：「前端」深入相关术语词

export const seed37: Term[] = [
  {
    id: 'fe-custom-element',
    en: 'Custom Element',
    zh: '自定义元素',
    category: '前端',
    pro: '用 customElements.define 注册可在 HTML 中直接使用的新标签，生命周期由回调管理。',
    plain: '自己造一个像 <my-tag> 这样的原生标签。',
    purpose: '理解框架无关的可复用组件。',
    scene: '定义一个 <user-card> 在全站复用。',
    related: ['Web Component', 'Shadow DOM', 'HTML Template']
  },
  {
    id: 'fe-web-component',
    en: 'Web Component',
    zh: 'Web 组件',
    category: '前端',
    pro: '由 Custom Element、Shadow DOM、HTML Template 组成的原生组件标准，跨框架可用。',
    plain: '浏览器原生的"组件三件套"，不挑框架。',
    purpose: '理解可移植的 UI 封装。',
    scene: '在 React 与 Vue 项目里共用同一个 Web Component。',
    related: ['Custom Element', 'Shadow DOM', 'HTML Template']
  },
  {
    id: 'fe-css-grid',
    en: 'CSS Grid',
    zh: 'CSS 网格',
    category: '前端',
    pro: '二维布局系统，用行列轨道精确摆放元素，适合整体页面骨架。',
    plain: '像画表格一样排版面，横竖都管。',
    purpose: '理解复杂响应式布局。',
    scene: '用 grid-template-areas 摆出卡片墙。',
    related: ['Flexbox', 'Responsive Design', 'Media Query']
  },
  {
    id: 'fe-flexbox',
    en: 'Flexbox',
    zh: '弹性盒子',
    category: '前端',
    pro: '一维布局模型，沿主轴/交叉轴分配空间与对齐，适合组件内排布。',
    plain: '一行或一列里的"弹性排队"。',
    purpose: '理解导航栏、卡片内对齐。',
    scene: '用 justify-content 把按钮推到两端。',
    related: ['CSS Grid', 'Responsive Design', 'Alignment']
  },
  {
    id: 'fe-bem',
    en: 'BEM',
    zh: 'BEM 命名法',
    category: '前端',
    pro: 'Block-Element-Modifier 的 CSS 命名约定，用 block__element--modifier 表达层级与状态。',
    plain: '给 class 起"祖宗-子孙-状态"的规矩名。',
    purpose: '理解大型项目 CSS 可维护性。',
    scene: 'card__title--active 表达激活态标题。',
    related: ['CSS Module', 'Scoped Style', 'OOCSS']
  },
  {
    id: 'fe-css-module',
    en: 'CSS Module',
    zh: 'CSS 模块',
    category: '前端',
    pro: '构建期把类名改写为局部唯一，实现样式作用域隔离的模块化方案。',
    plain: '构建时给 class 加"随机后缀"，互不撞名。',
    purpose: '理解组件级样式隔离。',
    scene: 'import styles 后 .title 被编译成 _title_abc。',
    related: ['BEM', 'Scoped Style', 'Shadow DOM']
  },
  {
    id: 'fe-prefers-reduced-motion',
    en: 'prefers-reduced-motion',
    zh: '减弱动态偏好',
    category: '前端',
    pro: '媒体特性，检测用户是否在系统中开启了"减少动效"，用于关闭过度动画以照顾眩晕与障碍用户。',
    plain: '尊重用户"别晃我"的系统设置。',
    purpose: '理解无障碍与动效克制。',
    scene: '开启偏好后把 transition 设为 none。',
    related: ['Accessibility', 'Media Query', 'Animation']
  },
  {
    id: 'fe-isr',
    en: 'ISR',
    zh: '增量静态再生成',
    category: '前端',
    pro: 'Incremental Static Regeneration，静态页在后台按间隔重新生成，兼顾静态性能与数据新鲜。',
    plain: '静态页定时"回炉重印"，既快又新。',
    purpose: '理解大站点的折中渲染策略。',
    scene: '商品页 60 秒重新生成一次。',
    related: ['SSG', 'SSR', 'Cache']
  },
  {
    id: 'fe-islands',
    en: 'Islands Architecture',
    zh: '孤岛架构',
    category: '前端',
    pro: '页面以静态 HTML 为主，仅把需要交互的"孤岛"组件做水合，其余保持静态。',
    plain: '整页是静的，只把会动的小岛"激活"。',
    purpose: '理解高性能可交互页面的新范式。',
    scene: 'Astro 只给购物车组件注水。',
    related: ['Hydration', 'SSR', 'Partial Hydration']
  },
  {
    id: 'fe-swc',
    en: 'SWC',
    zh: 'SWC',
    category: '前端',
    pro: 'Rust 写的 JS/TS 编译器，替代 Babel 提供更快的转译与压缩。',
    plain: 'Rust 版"Babel 提速替代"。',
    purpose: '理解编译层加速。',
    scene: 'Next.js 用 SWC 做转换与压缩。',
    related: ['esbuild', 'Babel', 'Transpile']
  },
  {
    id: 'fe-module-federation',
    en: 'Module Federation',
    zh: '模块联邦',
    category: '前端',
    pro: '让多个独立构建的应用在运行时共享模块，支持微前端式的远程按需加载。',
    plain: '多个前端应用"拼单"共用同一份模块。',
    purpose: '理解微前端与运行时共享。',
    scene: '壳应用直接远程加载子应用的组件。',
    related: ['Micro Frontend', 'Code Splitting', 'Webpack']
  },
  {
    id: 'fe-intersection-observer',
    en: 'Intersection Observer',
    zh: '交叉观察器',
    category: '前端',
    pro: '异步观察元素是否进入视口的 API，替代频繁的滚动监听做懒加载与曝光。',
    plain: '"看门狗"：元素进视野了通知你。',
    purpose: '理解高效视口检测。',
    scene: '图片进入视口 200px 才加载。',
    related: ['Lazy Loading', 'Resize Observer', 'Scroll']
  },
  {
    id: 'fe-resize-observer',
    en: 'Resize Observer',
    zh: '尺寸观察器',
    category: '前端',
    pro: '监听元素尺寸变化而非窗口变化的 API，适配容器级响应式。',
    plain: '"盯着盒子尺寸"变化的观察器。',
    purpose: '理解组件级自适应。',
    scene: '图表随容器大小重绘。',
    related: ['Intersection Observer', 'Responsive Design', 'Resize']
  },
  {
    id: 'fe-abort-controller',
    en: 'AbortController',
    zh: '中止控制器',
    category: '前端',
    pro: '用 signal 取消进行中的 fetch 或异步任务，避免竞态与浪费。',
    plain: '"取消按钮"：请求发出后还能叫停。',
    purpose: '理解请求竞态与资源清理。',
    scene: '用户快速切换时取消上一次搜索请求。',
    related: ['Fetch', 'Race Condition', 'Cancel Token']
  },
  {
    id: 'fe-inp',
    en: 'INP',
    zh: '交互到下次绘制',
    category: '前端',
    pro: 'Interaction to Next Paint，衡量用户交互到页面响应的延迟，替代 FID 反映真实卡顿。',
    plain: '你点一下，到画面动起来要多久。',
    purpose: '理解交互流畅度。',
    scene: '长任务阻塞导致 INP 飙高。',
    related: ['Web Vitals', 'LCP', 'Main Thread']
  },
  {
    id: 'fe-aria',
    en: 'ARIA',
    zh: '无障碍富互联网应用',
    category: '前端',
    pro: 'Accessible Rich Internet Applications，用 role/aria-* 属性补充语义，辅助读屏理解动态 UI。',
    plain: '给读屏"翻译"复杂组件的隐藏含义。',
    purpose: '理解动态组件的无障碍补全。',
    scene: '给弹窗加 role="dialog" aria-modal。',
    related: ['Accessibility', 'Semantics', 'Screen Reader']
  },
  {
    id: 'fe-event-bubbling',
    en: 'Event Bubbling',
    zh: '事件冒泡',
    category: '前端',
    pro: '事件从触发元素向上传播到祖先，沿途可被捕获处理，是事件委托的基础。',
    plain: '事件像气泡，从里往外一层层冒。',
    purpose: '理解事件流与委托。',
    scene: '列表点击在父级统一处理。',
    related: ['Event Delegation', 'Capture Phase', 'stopPropagation']
  },
  {
    id: 'fe-event-delegation',
    en: 'Event Delegation',
    zh: '事件委托',
    category: '前端',
    pro: '把子元素事件统一在共同祖先上监听，借助冒泡减少监听器数量。',
    plain: '在"父层"一处听所有"孩子"的点击。',
    purpose: '理解动态列表性能与简化。',
    scene: 'ul 上监听 click，靠 target 判断哪项被点。',
    related: ['Event Bubbling', 'Listener', 'Performance']
  },
  {
    id: 'fe-suspense',
    en: 'Suspense',
    zh: '悬念',
    category: '前端',
    pro: '声明式地等待异步资源（数据/代码）并在就绪前展示 fallback 的边界机制。',
    plain: '"这里要等一下，先放个骨架"的占位机制。',
    purpose: '理解异步 UI 与并发渲染。',
    scene: '用 Suspense 包住懒加载路由显示 loading。',
    related: ['Lazy Loading', 'Error Boundary', 'Concurrent']
  },
  {
    id: 'fe-portal',
    en: 'Portal',
    zh: '传送门',
    category: '前端',
    pro: '把子节点渲染到 DOM 树其它位置的机制，常用于弹窗、浮层脱离父级 overflow。',
    plain: '把内容"传送"到 body 下，躲开父级裁剪。',
    purpose: '理解模态/浮层实现。',
    scene: '对话框用 portal 渲染到 #modal-root。',
    related: ['Modal', 'z-index', 'Stacking Context']
  },
  {
    id: 'fe-compound-component',
    en: 'Compound Component',
    zh: '复合组件',
    category: '前端',
    pro: '用父子组件组合表达内在结构，隐藏实现、暴露灵活布局的 API 模式。',
    plain: '把组件拆成"一组搭子"，随意拼装。',
    purpose: '理解可组合的 UI API 设计。',
    scene: '<Tabs><Tab>… 自由组合。',
    related: ['Context', 'Slot', 'Composition']
  },
  {
    id: 'fe-uncontrolled',
    en: 'Uncontrolled Component',
    zh: '非受控组件',
    category: '前端',
    pro: '表单值由 DOM 自身持有，仅在需要时通过 ref 读取，性能更省但控制力弱。',
    plain: '输入框自己管自己，要时再问它。',
    purpose: '理解大表单的性能取舍。',
    scene: '用 defaultValue + ref 读值。',
    related: ['Controlled Component', 'Ref', 'Form']
  }
]
