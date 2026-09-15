import type { Term } from '../types'

// seed-38：「后端」深入相关术语词

export const seed38: Term[] = [
  {
    id: 'be-idempotency',
    en: 'Idempotency',
    zh: '幂等性',
    category: '后端',
    pro: '同一请求重复提交产生相同结果、不产生副作用翻倍的性质，常靠幂等键实现。',
    plain: '点两次"付款"不会扣两次钱。',
    purpose: '理解重试与分布式安全。',
    scene: '用 Idempotency-Key 去重重复请求。',
    related: ['Retry', 'Exactly-Once', 'Distributed Transaction']
  },
  {
    id: 'be-bulkhead',
    en: 'Bulkhead',
    zh: '舱壁隔离',
    category: '后端',
    pro: '把资源（线程、连接）按业务隔离成舱室，一处故障不拖垮全局。',
    plain: '船舱分隔，一个漏水不沉全船。',
    purpose: '理解故障隔离。',
    scene: '给关键接口单独的连接池。',
    related: ['Circuit Breaker', 'Isolation', 'Resource Pool']
  },
  {
    id: 'be-coroutine',
    en: 'Coroutine',
    zh: '协程',
    category: '后端',
    pro: '用户态轻量"线程"，可挂起恢复，以少量内核线程支撑海量并发。',
    plain: '"轻量线程"，成千上万个也不卡。',
    purpose: '理解高并发 IO 模型。',
    scene: 'Go 的 goroutine、Kotlin 的 coroutine。',
    related: ['Async', 'Event Loop', 'Green Thread']
  },
  {
    id: 'be-distributed-transaction',
    en: 'Distributed Transaction',
    zh: '分布式事务',
    category: '后端',
    pro: '跨多个服务/数据库保持一致性，常用 2PC、TCC 或 Saga 等折中方案。',
    plain: '让"分处多地的好几步"像一步一样靠谱。',
    purpose: '理解跨服务一致性的代价。',
    scene: '下单跨库存、支付、积分三个服务。',
    related: ['Saga', '2PC', 'Eventual Consistency']
  },
  {
    id: 'be-n-plus-1',
    en: 'N+1 Problem',
    zh: 'N+1 问题',
    category: '后端',
    pro: '先查 N 条主记录再逐条查关联，引发 N 次额外查询的性能反模式。',
    plain: '查了一堆主数据，又对每条偷偷多查一次。',
    purpose: '理解 ORM 懒加载的性能坑。',
    scene: '用预加载/Eager Load 一次 join 解决。',
    related: ['ORM', 'Eager Loading', 'Query Optimization']
  },
  {
    id: 'be-graceful-shutdown',
    en: 'Graceful Shutdown',
    zh: '优雅停机',
    category: '后端',
    pro: '收到终止信号后先停止接新请求、处理完在途请求再退出，避免中断用户。',
    plain: '下班前把手头活干完、新客不接。',
    purpose: '理解滚动发布不掉请求。',
    scene: '发布新版本时旧实例优雅退出。',
    related: ['Health Check', 'Drain', 'Deployment']
  },
  {
    id: 'be-long-polling',
    en: 'Long Polling',
    zh: '长轮询',
    category: '后端',
    pro: '客户端请求后服务端挂起，有数据才返回，客户端随即再连，模拟实时。',
    plain: '"你先别挂，有消息我马上回"。',
    purpose: '理解 WebSocket 之前的实时折中。',
    scene: '旧浏览器聊天用长轮询兜底。',
    related: ['WebSocket', 'SSE', 'Polling']
  },
  {
    id: 'be-thundering-herd',
    en: 'Thundering Herd',
    zh: '惊群效应',
    category: '后端',
    pro: '缓存同时失效，海量请求瞬间打到数据库把其击垮的现象。',
    plain: '缓存一起过期，所有请求同时砸向数据库。',
    purpose: '理解缓存过期策略设计。',
    scene: '热点 key 同一秒失效引发雪崩。',
    related: ['Cache Stampede', 'Cache', 'Backpressure']
  },
  {
    id: 'be-cache-stampede',
    en: 'Cache Stampede',
    zh: '缓存踩踏',
    category: '后端',
    pro: '缓存未命中时大量请求并发回源重建，可用Singleflight/锁合并。',
    plain: '一堆请求同时发现"没缓存"，一起冲去算。',
    purpose: '理解回源合并。',
    scene: '用 singleflight 让一个请求去加载、其余等待。',
    related: ['Thundering Herd', 'Singleflight', 'Cache']
  },
  {
    id: 'be-singleflight',
    en: 'Singleflight',
    zh: '单飞',
    category: '后端',
    pro: '并发的相同调用只放行一个去执行，其余共享其结果，避免重复昂贵操作。',
    plain: '同一件事同时被叫，只派一个去干，大家等结果。',
    purpose: '理解回源/查询去重。',
    scene: '缓存击穿时用 singleflight 保护 DB。',
    related: ['Cache Stampede', 'Deduplication', 'Concurrency']
  },
  {
    id: 'be-livelock',
    en: 'Livelock',
    zh: '活锁',
    category: '后端',
    pro: '线程不断响应彼此而忙等，状态在变却无进展，看似活着实则无产出。',
    plain: '一直在动，却永远到不了终点。',
    purpose: '理解退避与随机化。',
    scene: '两节点互相让资源却都干不成事。',
    related: ['Deadlock', 'Starvation', 'Backoff']
  },
  {
    id: 'be-starvation',
    en: 'Starvation',
    zh: '饥饿',
    category: '后端',
    pro: '某线程因优先级或锁竞争长期拿不到资源，始终无法执行。',
    plain: '总被插队，永远轮不到你。',
    purpose: '理解公平调度。',
    scene: '高优先级任务一直占着锁，低优先级饿死。',
    related: ['Deadlock', 'Livelock', 'Fairness']
  },
  {
    id: 'be-actor-model',
    en: 'Actor Model',
    zh: 'Actor 模型',
    category: '后端',
    pro: '计算由独立 Actor 组成，仅通过异步消息通信，各自持状态，天然适配并发。',
    plain: '一群"自顾自"的演员，只靠传纸条协作。',
    purpose: '理解无共享状态的并发。',
    scene: 'Akka/Erlang 用 Actor 撑高并发。',
    related: ['Coroutine', 'Message Passing', 'Concurrency']
  },
  {
    id: 'be-reactive',
    en: 'Reactive Programming',
    zh: '响应式编程',
    category: '后端',
    pro: '以数据流与变更传播为核心的异步编程范式，强调背压与非阻塞。',
    plain: '把数据当"流动的河"，下游自动跟着变。',
    purpose: '理解高并发非阻塞系统。',
    scene: 'RxJS/Project Reactor 处理事件流。',
    related: ['Backpressure', 'Streaming', 'Non-Blocking']
  },
  {
    id: 'be-exactly-once',
    en: 'Exactly-Once',
    zh: '恰好一次',
    category: '后端',
    pro: '消息/处理既不丢也不重复的理想语义，实际多由"至少一次+幂等"逼近。',
    plain: '一条消息，正好处理一次，不多不少。',
    purpose: '理解消息可靠性的上限。',
    scene: '消费端配合幂等键逼近 exactly-once。',
    related: ['Idempotency', 'At-Least-Once', 'Message Queue']
  },
  {
    id: 'be-at-least-once',
    en: 'At-Least-Once',
    zh: '至少一次',
    category: '后端',
    pro: '消息保证不丢但可能重投的投递语义，需消费端幂等兜底。',
    plain: '保证送到，但可能送两遍。',
    purpose: '理解常见消息语义。',
    scene: 'Kafka 默认至少一次，去重靠业务键。',
    related: ['Exactly-Once', 'Idempotency', 'Message Queue']
  },
  {
    id: 'be-readiness',
    en: 'Readiness',
    zh: '就绪探针',
    category: '后端',
    pro: '指示实例是否已能接流量（依赖就绪否），未就绪则从负载摘掉。',
    plain: '"我准备好了没"的探针，没好就别给我派活。',
    purpose: '理解启动期流量保护。',
    scene: '依赖 DB 未连上时 readiness 失败不接流。',
    related: ['Health Check', 'Liveness', 'Startup']
  },
  {
    id: 'be-liveness',
    en: 'Liveness',
    zh: '存活探针',
    category: '后端',
    pro: '指示进程是否还活着，失败则触发重启以恢复。',
    plain: '"我是不是还活着"的探针，死了就重启。',
    purpose: '理解故障自愈。',
    scene: '死锁导致 liveness 超时，K8s 重启 Pod。',
    related: ['Health Check', 'Readiness', 'Self-Healing']
  },
  {
    id: 'be-raft',
    en: 'Raft',
    zh: 'Raft 共识',
    category: '后端',
    pro: '易懂的分布式共识算法，通过选举与日志复制在多数派中达成状态一致。',
    plain: '一群节点选个"班长"，照它的日志抄。',
    purpose: '理解 etcd/Consul 等的底层。',
    scene: 'Leader 宕机后重新选举产生新 Leader。',
    related: ['Consensus', 'Leader Election', 'Replication']
  },
  {
    id: 'be-leader-election',
    en: 'Leader Election',
    zh: '选主',
    category: '后端',
    pro: '在多个副本中选出一个负责写/协调的机制，避免脑裂。',
    plain: '一伙人里挑一个拍板的，免得各说各话。',
    purpose: '理解高可用写节点。',
    scene: 'ZooKeeper 协调选主。',
    related: ['Raft', 'Split Brain', 'Quorum']
  },
  {
    id: 'be-quorum',
    en: 'Quorum',
    zh: '法定人数',
    category: '后端',
    pro: '读写需获得多数派节点确认，以在故障下仍保一致与可用。',
    plain: '过半票数才算数。',
    purpose: '理解容错读写。',
    scene: '写需 N/2+1 节点确认。',
    related: ['Raft', 'Consensus', 'Replication']
  },
  {
    id: 'be-rate-limit-server',
    en: 'Rate Limit',
    zh: '服务端限流',
    category: '后端',
    pro: '在入口按用户/IP/令牌桶限制请求速率，保护后端不被冲垮。',
    plain: '门口限流，超了就拒。',
    purpose: '理解稳定性与公平性。',
    scene: '令牌桶算法限每用户 100 QPS。',
    related: ['Token Bucket', 'Throttle', 'Backpressure']
  },
  {
    id: 'be-token-bucket',
    en: 'Token Bucket',
    zh: '令牌桶',
    category: '后端',
    pro: '以固定速率向桶里放令牌，请求需取到令牌才放行，支持一定突发。',
    plain: '桶里攒令牌，来一个取一个，空了就等。',
    purpose: '理解限流算法。',
    scene: '允许短时突发但长期限速。',
    related: ['Rate Limit', 'Leaky Bucket', 'Throttle']
  },
  {
    id: 'be-leaky-bucket',
    en: 'Leaky Bucket',
    zh: '漏桶',
    category: '后端',
    pro: '请求进桶、以恒定速率漏出处理，强制平滑输出、无突发。',
    plain: '桶底匀速漏水，进太快就溢出丢弃。',
    purpose: '理解整形与平滑。',
    scene: '严格限速、削峰填谷。',
    related: ['Token Bucket', 'Rate Limit', 'Shaping']
  }
]
