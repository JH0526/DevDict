/**
 * 种子库配合术语的「作用 / 使用环境」补充（第 2 段：后端 + 数据库 + 工程化 + Git + DevOps + 设计 + 产品）。
 */
export const pairsDetail2: Record<string, { role: string; env: string }> = {
  'api::REST': {
    role: 'REST 是 API 最常见的一种风格约定',
    env: '设计对外接口、写后端路由',
  },
  'api::CRUD': {
    role: 'CRUD 概括了 API 最常见的四类动作',
    env: '设计资源型接口、生成后台管理代码',
  },
  'api::Webhook': {
    role: 'Webhook 是反向 API，由服务端主动推送',
    env: '支付回调、第三方事件通知',
  },
  'rest::Idempotent': {
    role: '幂等保证重试不会造成重复副作用',
    env: '网络超时重试、支付与下单接口',
  },
  'rest::CRUD': {
    role: 'CRUD 映射到 REST 的四个方法',
    env: '设计资源路由：GET / POST / PUT / DELETE',
  },
  'crud::ORM': {
    role: 'ORM 把增删改查翻译成 SQL',
    env: '写业务代码、避免手写 SQL',
  },
  'crud::REST': {
    role: 'REST 把 CRUD 暴露成 HTTP 接口',
    env: '前后端约定接口规范',
  },
  'idempotent::Message Queue': {
    role: '队列只保证至少一次投递，消费端必须幂等',
    env: '消息重复消费、补偿重试',
  },
  'idempotent::Transaction': {
    role: '事务保证一次操作的原子性，与幂等互为补充',
    env: '扣款、改库存等关键写入',
  },
  'middleware::Authentication': {
    role: '鉴权是中间件最典型的用途，拦在业务之前',
    env: '需要登录才能访问的接口',
  },
  'middleware::Rate Limiting': {
    role: '限流放在中间件层，对所有请求统一生效',
    env: '防刷、保护下游服务',
  },
  'middleware::CORS': {
    role: 'CORS 头统一在中间件里加，不用每个路由写一遍',
    env: '前后端分离项目的服务端配置',
  },
  'authentication::JWT': {
    role: 'JWT 是无状态鉴权的载体，服务端不用存 session',
    env: '前后端分离、多服务共享登录态',
  },
  'authentication::Middleware': {
    role: '鉴权挂成中间件，一次配置全站生效',
    env: 'Express / NestJS 的路由保护',
  },
  'jwt::Middleware': {
    role: '中间件负责解析校验 token，再放行请求',
    env: '每次请求进入业务处理器之前',
  },
  'jwt::Horizontal Scaling': {
    role: '无状态 JWT 让加机器不需要同步 session',
    env: '多台服务器负载均衡、服务扩容',
  },
  'rate-limiting::Load Balancer': {
    role: '限流常在网关或负载均衡层做，统一入口',
    env: 'Nginx、API 网关配置',
  },
  'rate-limiting::Message Queue': {
    role: '削峰：超出的请求排队或丢弃，保护消费者',
    env: '秒杀、突发流量',
  },
  'webhook::Idempotent': {
    role: '回调可能重复发，处理端必须幂等',
    env: '支付回调、订单状态同步',
  },
  'webhook::Message Queue': {
    role: '收到回调先入队，异步慢慢处理',
    env: '回调量大、处理耗时长',
  },
  'microservices::Monolith': {
    role: '微服务是单体拆出来的，两者是演化的两端',
    env: '架构选型、判断要不要拆',
  },
  'microservices::Message Queue': {
    role: '服务间靠队列异步通信，解耦调用链',
    env: '跨服务事件通知、削峰',
  },
  'microservices::Docker': {
    role: 'Docker 给每个服务一致的打包和运行环境',
    env: '多语言服务混合部署、K8s 编排',
  },
  'monolith::Microservices': {
    role: '拆微服务是解决单体臃肿的一条路径，不是唯一解',
    env: '团队规模扩大、部署互相阻塞时',
  },
  'monolith::Technical Debt': {
    role: '单体不加约束最容易堆债',
    env: '老项目维护、没人敢动的模块',
  },
  'message-queue::Idempotent': {
    role: '重复投递是常态，幂等是消费端的必备设计',
    env: '任何消费端代码，尤其是要写库的',
  },
  'message-queue::Rate Limiting': {
    role: '队列把突发流量摊平，配合限流保护下游',
    env: '大促、批量任务、第三方 API 限额',
  },
  'message-queue::Transaction': {
    role: '本地事务与投递要一致，靠事务消息或 outbox',
    env: '订单创建后发消息这类强一致场景',
  },
  'load-balancer::Horizontal Scaling': {
    role: '负载均衡是水平扩容能生效的前提，把流量分给多台',
    env: '从一台加到多台、做高可用',
  },
  'load-balancer::Rate Limiting': {
    role: '入口统一，是做全局限流最自然的位置',
    env: '网关层防刷、配额控制',
  },
  'sql-vs-nosql::Transaction': {
    role: '多表强一致用 SQL 事务，NoSQL 往往只能最终一致',
    env: '选库：金融与订单 vs 日志与社交动态',
  },
  'sql-vs-nosql::Sharding': {
    role: 'NoSQL 天生易分片，SQL 分片代价高',
    env: '数据量超单机、要水平扩展',
  },
  'index::Query Plan': {
    role: '执行计划告诉你索引到底有没有被用上',
    env: '慢查询排查、EXPLAIN 分析',
  },
  'index::Foreign Key': {
    role: '外键字段几乎都要建索引，否则关联查询和删改都慢',
    env: '建表阶段、加外键约束',
  },
  'index::Migration': {
    role: '加索引本身是一次迁移，大表要在线加避免锁表',
    env: '上线变更、大表 DDL',
  },
  'transaction::ACID': {
    role: 'ACID 是事务要满足的四条性质',
    env: '设计关键写入、判断一致性需求',
  },
  'transaction::Deadlock': {
    role: '并发事务相互等待就死锁，靠统一顺序和短事务避免',
    env: '高并发写入、批量更新',
  },
  'transaction::Message Queue': {
    role: '跨服务一致性用事务消息或最终一致，强事务做不到',
    env: '分布式下单、扣库存',
  },
  'acid::Transaction': {
    role: 'ACID 描述的就是事务本身',
    env: '理解数据库的一致性保证',
  },
  'acid::Isolation Level': {
    role: '隔离级别决定 ACID 中 I 的强度',
    env: '处理并发问题：脏读、不可重复读、幻读',
  },
  'n-plus-1::ORM': {
    role: 'ORM 的懒加载最容易触发 N+1',
    env: '列表页查关联数据、GraphQL 接口',
  },
  'n-plus-1::Index': {
    role: '索引救不了 N+1，得先减少查询次数',
    env: '慢查询排查，先数 SQL 条数再看索引',
  },
  'migration::Rollback': {
    role: '迁移必须配套回滚脚本，出问题能退回去',
    env: '上线变更、灰度失败',
  },
  'migration::CI/CD': {
    role: '迁移挂在流水线里自动执行，避免忘记',
    env: '自动部署、多环境同步',
  },
  'migration::Environment': {
    role: '不同环境执行不同迁移，先测试再生产',
    env: '开发 / 测试 / 生产多环境',
  },
  'orm::Migration': {
    role: '迁移管理表结构变更，ORM 只负责读写',
    env: '改字段、加表、版本化 schema',
  },
  'orm::N+1 Query': {
    role: 'N+1 是 ORM 最常见的性能陷阱',
    env: '关联查询、列表接口优化',
  },
  'normalization::Foreign Key': {
    role: '规范化靠外键表达关系、消除冗余',
    env: '设计表结构阶段',
  },
  'normalization::Index': {
    role: '规范化后查询常跨表，要靠索引补性能',
    env: '多表 join 变慢时',
  },
  'foreign-key::Normalization': {
    role: '外键是规范化的落地手段',
    env: '关系建模、保证引用完整',
  },
  'foreign-key::Index': {
    role: '外键列建索引，关联查询和删除才快',
    env: '建表、加约束',
  },
  'sharding::Horizontal Scaling': {
    role: '分片是水平扩展在数据库层的实现',
    env: '单表千万或亿级、写入打满单机',
  },
  'sharding::Index': {
    role: '分片键的选择类似索引，决定查询能否单点命中',
    env: '设计分片方案、避免跨片查询',
  },
  'sharding::Transaction': {
    role: '跨片事务代价极高，通常改用最终一致',
    env: '分布式写入、需要拆库时',
  },
  'connection-pool::Transaction': {
    role: '事务占用连接直到提交，长事务会耗尽连接池',
    env: '高并发、慢事务导致获取连接超时',
  },
  'connection-pool::Monitoring': {
    role: '监控连接池使用率，能提前发现慢查询堆积',
    env: '线上排查接口变慢、连接耗尽',
  },
  'deadlock::Transaction': {
    role: '死锁发生在事务之间，靠统一加锁顺序解决',
    env: '并发批量更新、秒杀扣库存',
  },
  'deadlock::Message Queue': {
    role: '把并发写改成串行消费，从根上规避死锁',
    env: '高并发写同一行时的架构改造',
  },
  'build::Bundle': {
    role: '构建的产出就是 bundle',
    env: '发版前的打包环节',
  },
  'build::CI/CD': {
    role: '构建是流水线的第一步',
    env: '自动部署、发布流程',
  },
  'build::Polyfill': {
    role: '构建时决定注入哪些兼容补丁',
    env: '配置目标浏览器',
  },
  'hmr::Dev Server': {
    role: 'HMR 由开发服务器提供，是本地开发体验的核心',
    env: '本地开发、保存即看效果',
  },
  'hmr::Build': {
    role: 'HMR 只服务开发，生产仍要完整构建',
    env: '区分开发态与生产态的行为差异',
  },
  'lint::CI/CD': {
    role: 'lint 挂在流水线上，不合规范直接卡住合并',
    env: 'PR 检查、提交前钩子',
  },
  'lint::Technical Debt': {
    role: 'lint 把债务显性化、可量化',
    env: '长期维护、重构前摸底',
  },
  'monorepo::Build': {
    role: 'Monorepo 需要增量构建，只构建改动的包',
    env: '多包仓库、Turborepo / Nx',
  },
  'monorepo::CI/CD': {
    role: '流水线按改动范围决定构建哪些包',
    env: '大型仓库的 CI 提速',
  },
  'env-var::Environment': {
    role: '环境变量区分环境，同一份代码跑不同配置',
    env: '开发 / 测试 / 生产切换',
  },
  'env-var::CI/CD': {
    role: '密钥通过 CI 的环境变量注入，不进代码库',
    env: '流水线里配数据库地址、API key',
  },
  'env-var::Build': {
    role: '构建时把变量内联进产物，前端只能这样用',
    env: '前端项目配置 VITE_ / NEXT_PUBLIC_ 前缀变量',
  },
  'commit::Branch': {
    role: '提交落在分支上，分支是提交的容器',
    env: '日常开发、切分支做功能',
  },
  'commit::Cherry-pick': {
    role: '摘取某个提交到别的分支',
    env: '紧急修复只要那一个改动',
  },
  'commit::PR': {
    role: 'PR 把一组提交打包请求合并',
    env: '代码评审、团队协作',
  },
  'branch::Merge': {
    role: '分支最终要合并回主线',
    env: '功能完成、发布前',
  },
  'branch::Conflict': {
    role: '同文件并行改动就会冲突',
    env: '多人改同一处、合并时',
  },
  'branch::Stash': {
    role: '暂存未完成的改动再切分支',
    env: '临时插单、要切到别的分支',
  },
  'merge::Rebase': {
    role: 'rebase 是另一种整合方式，历史更线性',
    env: '想要干净的提交历史时',
  },
  'merge::Conflict': {
    role: '冲突在合并那一刻暴露',
    env: '多人协作、并行开发',
  },
  'merge::PR': {
    role: 'PR 审核通过后执行合并',
    env: 'GitHub / GitLab 协作流程',
  },
  'rebase::Squash': {
    role: 'squash 把多个提交压成一个，常配合 rebase',
    env: '合并前整理提交历史',
  },
  'rebase::Conflict': {
    role: 'rebase 逐个提交应用，冲突可能反复出现',
    env: '长分支 rebase 主干',
  },
  'conflict::Merge': {
    role: '冲突解决完才能完成合并',
    env: '手工解决冲突、用工具比对',
  },
  'conflict::PR': {
    role: 'PR 里显示冲突，必须先解决',
    env: '合并前的检查环节',
  },
  'stash::Branch': {
    role: '暂存后干净切分支，回来再恢复',
    env: '临时切换上下文',
  },
  'stash::Commit': {
    role: '与其暂存，不如先提交一个 WIP',
    env: '改动较大、怕暂存丢失',
  },
  'cherry-pick::Commit': {
    role: 'cherry-pick 操作的单位就是提交',
    env: '跨分支搬运单个改动',
  },
  'cherry-pick::Rollback': {
    role: '出错时挑回或反向挑回一个提交',
    env: '线上紧急回退',
  },
  'pr::CI/CD': {
    role: 'PR 触发流水线跑测试和 lint',
    env: '合并前的自动检查',
  },
  'pr::Merge': {
    role: 'PR 的终点是合并',
    env: '评审通过后的操作',
  },
  'pr::Lint': {
    role: 'PR 里看 lint 结果，不合格不让合',
    env: '代码规范把关',
  },
  'cicd::Build': {
    role: '构建是流水线的核心步骤',
    env: '自动打包、出产物',
  },
  'cicd::Rollback': {
    role: '流水线保留历史产物，出事一键回滚',
    env: '发布失败快速恢复',
  },
  'cicd::Environment': {
    role: '流水线把同一份产物部署到不同环境',
    env: '测试 → 预发 → 生产',
  },
  'docker::CI/CD': {
    role: 'CI 里构建镜像，CD 里部署镜像',
    env: '自动化交付、环境一致',
  },
  'docker::Microservices': {
    role: '容器是微服务的事实部署单元',
    env: '多服务独立部署、K8s',
  },
  'docker::Environment': {
    role: '镜像保证各环境运行一致',
    env: '解决"我这儿是好的"问题',
  },
  'environment::Env Var': {
    role: '环境差异全靠环境变量注入',
    env: '同一镜像跑多环境',
  },
  'environment::Docker': {
    role: 'Docker 让环境可复制',
    env: '统一开发与生产环境',
  },
  'environment::Monitoring': {
    role: '各环境分开监控，问题先定位到环境',
    env: '线上告警、环境隔离排查',
  },
  'rollback::Migration': {
    role: '代码回滚要同时回滚数据库迁移',
    env: '发版失败、数据结构已变更',
  },
  'rollback::Monitoring': {
    role: '监控发现异常，触发回滚决策',
    env: '上线后观察指标',
  },
  'rollback::Canary Release': {
    role: '灰度把回滚范围压到最小',
    env: '先放 5% 流量验证',
  },
  'monitoring::Rollback': {
    role: '监控是回滚的发令枪',
    env: '错误率与延迟超阈值',
  },
  'monitoring::Connection Pool': {
    role: '连接池指标是数据库健康的晴雨表',
    env: '排查慢查询、连接耗尽',
  },
  'scaling::Load Balancer': {
    role: '水平扩容靠负载均衡把流量分摊',
    env: '流量增长、加机器',
  },
  'scaling::JWT': {
    role: '无状态鉴权让扩容不用同步 session',
    env: '从单机到多机',
  },
  'scaling::Sharding': {
    role: '应用层好扩，数据库靠分片扩',
    env: '数据量成为瓶颈',
  },
  'responsive::Design System': {
    role: '设计系统提供响应式断点与栅格规范',
    env: '多端适配、统一布局',
  },
  'responsive::Accessibility': {
    role: '响应式改布局不能牺牲无障碍顺序',
    env: '移动适配同时兼顾读屏',
  },
  'design-system::Responsive': {
    role: '响应式规则内置在组件里',
    env: '组件库建设、多端一致',
  },
  'design-system::Accessibility': {
    role: '无障碍作为组件的默认属性',
    env: '组件库、B 端产品',
  },
  'accessibility::Design System': {
    role: '设计系统把无障碍做成默认项',
    env: '团队规模化交付',
  },
  'accessibility::Responsive': {
    role: '响应式布局要保持焦点与阅读顺序',
    env: '小屏适配、键盘导航',
  },
  'mvp::User Story': {
    role: '用户故事圈定 MVP 的范围',
    env: '需求梳理、排优先级',
  },
  'mvp::Vibe Coding': {
    role: 'vibe coding 是快速做出 MVP 的手段',
    env: '验证想法、快速出原型',
  },
  'mvp::Technical Debt': {
    role: 'MVP 允许欠债，但要记账',
    env: '临时方案上线、后续重构排期',
  },
  'user-story::MVP': {
    role: 'MVP 由一小批核心故事组成',
    env: '版本规划、砍需求',
  },
  'user-story::Acceptance Criteria': {
    role: '验收标准定义故事何时算完成',
    env: '开发前对齐、测试验收',
  },
  'technical-debt::Vibe Coding': {
    role: 'vibe coding 是债务增长最快的来源',
    env: 'AI 生成的代码没审就上线',
  },
  'technical-debt::Lint': {
    role: 'lint 让债务可见、可量化',
    env: '重构排期、质量门禁',
  },
  'technical-debt::Refactoring': {
    role: '重构是偿还债务的手段',
    env: '迭代间隙、专项治理',
  },
}
