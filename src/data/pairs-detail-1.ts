/**
 * 种子库配合术语的「作用 / 使用环境」补充（第 1 段：前端 + AI）。
 * key 格式：`词条id::配合术语名`，与 seed 里的 pairs 一一对应。
 */
export const pairsDetail1: Record<string, { role: string; env: string }> = {
  'spa::SSR': {
    role: 'SSR 负责把首屏 HTML 提前在服务端生成，补上 SPA 首屏空白、抓取不到内容的短板',
    env: '做官网、内容站、电商详情这类要首屏速度和搜索收录的项目',
  },
  'spa::Code Splitting': {
    role: '把整包按路由切成小块，用户只下当前页要的代码，压低首屏体积',
    env: 'SPA 打包产物超过几百 KB、首屏明显变慢时',
  },
  'ssr::Hydration': {
    role: '水合给服务端吐出的静态 HTML 绑上事件和状态，让它从"能看"变成"能点"',
    env: '所有 SSR 页面的第二段流程，水合失败就是页面点了没反应',
  },
  'ssr::CSR': {
    role: '首屏交给 SSR，水合后由 CSR 接管后续跳转与交互，兼顾首屏与体验',
    env: 'Next.js / Nuxt 这类同构框架的默认运行方式',
  },
  'ssr::SSG': {
    role: 'SSG 把渲染提前到构建期，比 SSR 更省服务器，是内容不变时的更优解',
    env: '博客、文档、营销页等更新频率低、以读为主的站点',
  },
  'csr::SPA': {
    role: 'CSR 是 SPA 的默认渲染方式，页面内容靠前端 JS 现渲染出来',
    env: '后台管理系统、需登录的应用，不依赖搜索引擎流量',
  },
  'csr::SSR': {
    role: '把首屏渲染搬回服务端，弥补 CSR 的白屏与 SEO 缺失',
    env: '同一个项目需要首屏速度或搜索收录时',
  },
  'csr::Skeleton Screen': {
    role: '骨架屏在 CSR 等数据的空档期占位，掩盖白屏',
    env: '数据请求较慢的列表页、详情页首屏',
  },
  'ssg::CDN': {
    role: 'CDN 把静态文件缓存到边缘节点，用户就近取，放大 SSG 的速度优势',
    env: '静态站点上线部署，面向全国或全球用户',
  },
  'ssg::SSR': {
    role: '内容实时或页面数量海量时改用 SSR，避免构建时间失控',
    env: '商品库存频繁变动、页面数上万甚至百万级',
  },
  'ssg::CI/CD': {
    role: '内容更新后自动触发重新构建发布，省掉手工出包',
    env: '文档站、博客接入"提交即发布"的流水线',
  },
  'hydration::SSR': {
    role: '水合是 SSR 的必经第二步，没有它页面只是一张图',
    env: '排查"页面能看不能点"、水合不匹配的告警',
  },
  'hydration::CSR': {
    role: '水合完成即进入 CSR 模式，之后一切交互由客户端接管',
    env: '同构应用首屏之后的全部交互阶段',
  },
  'virtual-dom::Reconciliation': {
    role: '虚拟 DOM 提供可比较的树结构，Diff 跑在它上面算出最小改动',
    env: 'React / Vue 更新视图的内部流程，做性能优化要先理解它',
  },
  'virtual-dom::Reflow': {
    role: '先在虚拟 DOM 里批量算差异，再一次改真实 DOM，减少触发重排',
    env: '列表频繁更新、动画卡顿需要优化时',
  },
  'reconciliation::Virtual DOM': {
    role: '虚拟 DOM 是 Diff 的输入，新旧两棵树就是比较对象',
    env: '任何一次视图更新发生时',
  },
  'reconciliation::Key': {
    role: 'key 给 Diff 提供身份标识，避免复用错节点',
    env: '渲染列表，尤其有排序、插入、删除时',
  },
  'reconciliation::Memoization': {
    role: 'memo 让没变的子树直接跳过 Diff',
    env: '大列表、重组件，且父级频繁重渲染时',
  },
  'bundle::Tree Shaking': {
    role: '摇树决定打进包里的代码有多少是真正被用到的',
    env: '生产构建，关注产物体积时',
  },
  'bundle::Code Splitting': {
    role: '把单包拆成多块，是控制单包体积的另一半手段',
    env: '首屏慢、包超过几百 KB 时的构建优化',
  },
  'bundle::Cache': {
    role: '文件名带 hash 配合长效缓存，让用户只重下变动的部分',
    env: '生产部署，追求二次访问秒开',
  },
  'tree-shaking::Bundle': {
    role: '摇树作用在打包阶段，最终决定 bundle 的瘦身程度',
    env: '生产构建（dev 模式通常不生效）',
  },
  'tree-shaking::ESM': {
    role: '只有 ESM 的静态导入导出能被静态分析，才摇得动',
    env: '选型第三方库时看它是否提供 ESM 版本',
  },
  'code-splitting::Lazy Loading': {
    role: '懒加载决定切出来的块在什么时候被拉下来',
    env: '路由切换、弹窗与图表等重组件按需加载',
  },
  'code-splitting::Bundle': {
    role: '代码分割就是把一个大 bundle 拆成多个小 chunk',
    env: '构建配置阶段，按路由或组件设分割点',
  },
  'lazy-loading::Code Splitting': {
    role: '代码分割是懒加载成立的前提，先切块才谈得上按需',
    env: '首屏优化、路由级按需加载',
  },
  'lazy-loading::Skeleton Screen': {
    role: '骨架屏在懒加载的空档期占位，避免空白闪烁',
    env: '路由切换、图片与组件异步加载时',
  },
  'debounce::Throttle': {
    role: '节流是防抖的兄弟手段，按固定频率执行，适合持续触发',
    env: '滚动、拖拽、resize 这类连续事件',
  },
  'debounce::Event Loop': {
    role: '防抖靠定时器实现，定时器由事件循环的宏任务队列调度',
    env: '理解为什么延时不精确、为什么被阻塞',
  },
  'throttle::Debounce': {
    role: '防抖等"停手"才执行，适合只取最后一次结果的场景',
    env: '搜索输入、表单校验、resize 结束时',
  },
  'throttle::Reflow': {
    role: '限制读写布局的频率，避免每帧都触发重排',
    env: 'scroll 里算元素位置、无限滚动加载',
  },
  'cors::Proxy': {
    role: '开发期用代理把跨域请求转成同源，绕过浏览器限制',
    env: '本地 dev 调后端接口、vite/webpack devServer 配置',
  },
  'cors::Preflight': {
    role: '非简单请求先发 OPTIONS 预检，通过后才发真请求',
    env: '带自定义头、JSON body、PUT/DELETE 的请求',
  },
  'cors::Same-Origin Policy': {
    role: '同源策略是根源，CORS 是服务端给它的放行规则',
    env: '理解为什么会跨域、为什么前端改不了',
  },
  'memoization::Reconciliation': {
    role: '缓存组件结果让 Diff 直接跳过，省掉重复计算',
    env: '父组件频繁重渲染但子组件 props 没变时',
  },
  'memoization::Closure': {
    role: '闭包提供存放缓存的地方，让上次结果留得住',
    env: '手写记忆化函数、实现缓存工具',
  },
  'props-drilling::Context': {
    role: 'Context 让深层组件直接取值，不必逐层透传',
    env: '主题、语言、当前用户这类全局数据',
  },
  'props-drilling::State Management': {
    role: '状态管理库把共享状态外置，任何组件直接订阅',
    env: '中大型应用跨多个页面共享状态',
  },
  'state-management::Props Drilling': {
    role: 'props 逐层传递是状态管理要解决的原问题',
    env: '组件树小、层级浅时其实够用',
  },
  'state-management::Context': {
    role: 'Context 是内置轻量方案，够用就不必上库',
    env: '共享范围有限、更新不频繁时',
  },
  'reflow::Virtual DOM': {
    role: '虚拟 DOM 批量更新，从源头减少真实 DOM 操作引发的重排',
    env: '大量节点同时变更，如列表重排',
  },
  'reflow::Throttle': {
    role: '节流限制读写布局的频率，把重排次数压下来',
    env: '滚动监听里读 offsetTop / getBoundingClientRect',
  },
  'event-loop::Promise': {
    role: '微任务队列由事件循环在宏任务之间清空，Promise 回调走这里',
    env: '理解 async 代码的输出顺序、排查时序 bug',
  },
  'event-loop::Async/Await': {
    role: 'await 把后续代码挂到微任务，靠事件循环恢复执行',
    env: '调试异步执行顺序、理解为什么"卡住"',
  },
  'closure::Memoization': {
    role: '闭包把缓存变量封在作用域里，不污染全局',
    env: '实现计数器、缓存、私有变量',
  },
  'closure::Hoisting': {
    role: '变量提升决定闭包的形成时机，尤其循环里 var 的坑',
    env: '排查循环里绑事件，索引全变成最后一个',
  },
  'promise::Async/Await': {
    role: 'await 是 Promise 的语法糖，让异步写成同步的样子',
    env: '日常写异步请求、控制串行与并行',
  },
  'promise::Event Loop': {
    role: 'Promise 回调进微任务队列，由事件循环优先执行',
    env: '分析输出顺序、理解为何比 setTimeout 先跑',
  },
  'async-await::Promise': {
    role: 'async 函数返回 Promise，await 等的就是它',
    env: '需要拿返回值、用 Promise.all 并发时',
  },
  'async-await::Event Loop': {
    role: 'await 让出线程但不阻塞，后续进微任务队列',
    env: '理解为何界面不卡、顺序却和直觉不同',
  },
  'polyfill::Build': {
    role: '构建时按目标浏览器注入需要的补丁',
    env: '配置 browserslist、@babel/preset-env',
  },
  'polyfill::Bundle': {
    role: '补丁本身也是代码，会算进产物体积',
    env: '评估首屏体积、决定是否放弃老浏览器',
  },
  'web-storage::IndexedDB': {
    role: 'localStorage 只适合小数据，量大或要查询就上 IndexedDB',
    env: '离线缓存、草稿、万级以上的本地数据',
  },
  'web-storage::Cache': {
    role: '与 HTTP 缓存互补：一个存业务数据，一个存资源',
    env: '做离线可用、记住用户偏好',
  },
  'xss::CORS': {
    role: '同源策略挡不住 XSS，两者是不同层面的问题',
    env: '安全排查时区分"被注入脚本"和"跨域被拒"',
  },
  'xss::Same-Origin Policy': {
    role: '同源策略限制的是读取，不阻止脚本执行，所以防不住 XSS',
    env: '理解为什么 CORS 配好了仍有 XSS 风险',
  },
  'llm::Prompt': {
    role: 'Prompt 是操控 LLM 的唯一输入接口',
    env: '每一次和模型对话、写 AI 应用',
  },
  'llm::RAG': {
    role: 'RAG 给模型外挂知识库，补上它不知道的私有与实时信息',
    env: '问答机器人、企业知识库、文档助手',
  },
  'llm::Token': {
    role: 'Token 是计费与长度的基本单位，决定成本和上下文上限',
    env: '估算 API 费用、控制输入长度',
  },
  'prompt::Few-shot': {
    role: '给几个示例让模型照着做，比空口描述更稳',
    env: '输出格式要求严格、零样本效果不好时',
  },
  'prompt::System Prompt': {
    role: '系统提示设定角色与规则，优先级高于用户的话',
    env: '给 AI 应用定人设、约束输出',
  },
  'prompt::Context Window': {
    role: '上下文窗口决定 prompt 能塞多少，超了就被截断',
    env: '长文档、长对话，需要裁剪或摘要',
  },
  'token::Context Window': {
    role: '上下文窗口以上限 token 数计量，两者是一回事的两面',
    env: '选模型、判断一次能喂多少内容',
  },
  'token::Inference': {
    role: '推理按 token 逐段生成，token 数直接决定耗时与费用',
    env: '评估响应速度和调用成本',
  },
  'context-window::RAG': {
    role: '上下文装不下全量资料，用 RAG 只取相关片段塞进去',
    env: '长文档问答、知识库检索',
  },
  'context-window::Embedding': {
    role: '向量化后按语义切块检索，是塞满上下文前的选择动作',
    env: '文档切分与召回阶段',
  },
  'hallucination::RAG': {
    role: '给模型可依据的材料，是抑制幻觉最有效的一招',
    env: '要求答案有出处、不能瞎编的场景',
  },
  'hallucination::Chain of Thought': {
    role: '让模型写出推理过程，错的中间步骤更容易被发现',
    env: '数学题、逻辑判断等需要准确性的任务',
  },
  'rag::Embedding': {
    role: 'Embedding 把文本变成可比较的向量，是检索的基础',
    env: '建库阶段：切块 → 向量化 → 入库',
  },
  'rag::Vector Database': {
    role: '向量库存向量并做相似度检索，是 RAG 的检索层',
    env: '数据量上万、需要近似检索加速时',
  },
  'rag::Context Window': {
    role: '召回的片段要能塞进上下文窗口，两者互相约束',
    env: '决定 top-k 取几条、每块切多大',
  },
  'fine-tuning::RAG': {
    role: '知识常变用 RAG 改"喂什么"，要改语气格式才用微调',
    env: '区分"模型不知道"和"模型不会按格式说"',
  },
  'fine-tuning::LoRA': {
    role: 'LoRA 只训低秩小矩阵，把微调成本降一个量级',
    env: '单卡或消费级显卡微调、多任务快速切换',
  },
  'embedding::Vector Database': {
    role: '向量库负责存与检索，embedding 模型负责生产向量',
    env: '搭建检索系统时的两段分工',
  },
  'embedding::RAG': {
    role: 'RAG 检索阶段靠 embedding 做语义匹配，而非关键词',
    env: '用户问法和文档措辞不一致时仍能召回',
  },
  'embedding::Multimodal': {
    role: '图文映射到同一向量空间，才能跨模态检索',
    env: '以图搜图、图文混合问答',
  },
  'vector-database::Embedding': {
    role: '向量来自 embedding 模型，换模型就得重建索引',
    env: '选型或升级嵌入模型时',
  },
  'vector-database::RAG': {
    role: '向量库是 RAG 的检索后端，决定召回速度与规模',
    env: '数据量从千级涨到百万级',
  },
  'temperature::Inference': {
    role: 'temperature 在推理采样阶段控制随机性',
    env: '调 API 参数、平衡创意与稳定',
  },
  'temperature::Hallucination': {
    role: '温度越高越敢编，是幻觉的直接旋钮',
    env: '事实类问答调低，创意写作调高',
  },
  'system-prompt::Agent': {
    role: '系统提示定义 Agent 的角色、可用工具与边界',
    env: '搭 AI 助手、客服机器人',
  },
  'system-prompt::Few-shot': {
    role: '示例常写在系统提示里，作为长期生效的示范',
    env: '需要稳定输出固定格式时',
  },
  'few-shot::Prompt': {
    role: '示例是 prompt 的一部分，参与构建最终输入',
    env: '写分类、抽取、格式化任务',
  },
  'few-shot::Fine-tuning': {
    role: '示例多到塞不进上下文时，改为微调把能力训进去',
    env: '几十上百个示例、要省 token 时',
  },
  'chain-of-thought::Agent': {
    role: '思维链让 Agent 先规划再调工具，是推理的主干',
    env: '多步任务、需要工具调用编排时',
  },
  'chain-of-thought::Hallucination': {
    role: '显式推理让错误暴露，反而降低一步到位的瞎编',
    env: '需要可解释答案、要人工核查时',
  },
  'agent::Function Calling': {
    role: '函数调用是 Agent 的手，让它能真的去操作系统',
    env: '查天气、下单、改数据库等需要外部动作时',
  },
  'agent::MCP': {
    role: 'MCP 把工具接入标准化，一个协议接所有数据源',
    env: '接多个内部系统、避免为每个工具写适配器',
  },
  'agent::Chain of Thought': {
    role: '思维链是 Agent 的大脑，决定先做什么后做什么',
    env: '复杂任务拆解、多轮工具调用',
  },
  'function-calling::Agent': {
    role: 'Agent 是调度者，决定何时调哪个函数',
    env: '构建自主完成任务的 AI 应用',
  },
  'function-calling::MCP': {
    role: 'MCP 把函数以统一协议暴露给模型调用',
    env: '跨应用共享工具、避免重复实现',
  },
  'mcp::Function Calling': {
    role: '函数调用是底层能力，MCP 是它的标准化封装',
    env: '在客户端里接自有系统',
  },
  'mcp::Agent': {
    role: 'Agent 通过 MCP 拿到工具，能力边界由接入的工具决定',
    env: '给 AI 接数据库、文件系统、内部 API',
  },
  'vibe-coding::Agent': {
    role: 'Agent 是 vibe coding 的主力执行者，人只下指令不写代码',
    env: '用 Cursor / Claude Code 从零撸原型',
  },
  'vibe-coding::Technical Debt': {
    role: '只求能跑不看代码，债务以最快速度堆积',
    env: 'demo 转正式项目、需要长期维护时',
  },
  'vibe-coding::MVP': {
    role: 'MVP 是 vibe coding 最合适的产出口径',
    env: '验证想法、给用户看第一版',
  },
  'transformer::Attention': {
    role: '注意力机制是 Transformer 的核心，决定它看得懂上下文',
    env: '理解模型为什么强、为什么长文本贵',
  },
  'transformer::LLM': {
    role: 'Transformer 是当代 LLM 的骨架',
    env: '读模型论文、选模型架构时',
  },
  'attention::Transformer': {
    role: '多头注意力组成 Transformer 的每个编码与解码层',
    env: '理解模型结构与计算开销',
  },
  'attention::Context Window': {
    role: '注意力是平方复杂度，直接限制上下文能开多大',
    env: '长文本成本高、需要优化 KV Cache',
  },
  'multimodal::Embedding': {
    role: '多模态靠统一 embedding 空间把图文对齐',
    env: '图文检索、图片问答',
  },
  'multimodal::Diffusion Model': {
    role: '文生图 = 多模态理解 + 扩散模型生成',
    env: '做 AI 绘图、理解生图链路',
  },
  'diffusion-model::LoRA': {
    role: 'LoRA 让扩散模型低成本学会新画风或新角色',
    env: '训练专属风格、保持角色一致性',
  },
  'diffusion-model::Prompt': {
    role: 'prompt 是扩散模型唯一的输入控制信号',
    env: 'AI 绘图、写正向与反向提示词',
  },
  'diffusion-model::Quantization': {
    role: '量化把扩散模型压小，让消费级显卡跑得动',
    env: '本地部署 SD / Flux，显存不够时',
  },
  'lora::Fine-tuning': {
    role: 'LoRA 是微调的一种高效实现，替代全参数训练',
    env: '算力有限、要快速迭代多个版本',
  },
  'lora::Diffusion Model': {
    role: 'LoRA 在绘图领域最普及，用于定制风格与人物',
    env: '训练角色 LoRA、画风 LoRA',
  },
  'quantization::Inference': {
    role: '量化作用在推理阶段，用精度换速度和显存',
    env: '本地跑大模型、边缘设备部署',
  },
  'quantization::Distillation': {
    role: '蒸馏和量化常一起用，先变小再变轻',
    env: '模型压缩上线的组合手段',
  },
  'inference::Quantization': {
    role: '量化直接改善推理的显存占用与吞吐',
    env: '部署阶段优化成本',
  },
  'inference::Token': {
    role: '推理按 token 逐个生成，输出越长越慢越贵',
    env: '估算响应时延与费用',
  },
  'distillation::Quantization': {
    role: '先蒸馏出小模型，再量化部署，压缩效果叠加',
    env: '端侧与低成本部署',
  },
  'distillation::Inference': {
    role: '蒸馏后的小模型推理更快，适合实时场景',
    env: '在线服务对延迟敏感时',
  },
}
