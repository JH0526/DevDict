import type { Term } from '../types'

// seed-41：「测试 / 可观测性 / 性能优化」相关术语词

export const seed41: Term[] = [
  {
    id: 'test-tdd',
    en: 'TDD',
    zh: '测试驱动开发',
    category: '测试',
    pro: 'Test-Driven Development，先写失败测试再写实现，红-绿-重构循环。',
    plain: '先写"考题"再写"答案"。',
    purpose: '理解以测试塑形设计。',
    scene: '先写测试断言两数相加，再实现 add。',
    related: ['Unit Test', 'Refactoring', 'BDD']
  },
  {
    id: 'test-bdd',
    en: 'BDD',
    zh: '行为驱动开发',
    category: '测试',
    pro: 'Behavior-Driven Development，用 Given-When-Then 的业务语言描述行为，桥接技术与业务。',
    plain: '用"当…时…应…"的话写用例。',
    purpose: '理解可执行的业务规格。',
    scene: 'Cucumber 把文案转成可执行测试。',
    related: ['TDD', 'Acceptance Criteria', 'User Story']
  },
  {
    id: 'test-double',
    en: 'Test Double',
    zh: '测试替身',
    category: '测试',
    pro: '测试中替代真实依赖的对象统称，含 Dummy/Stub/Mock/Spy/Fake。',
    plain: '测试里的"替身演员"，代替真依赖。',
    purpose: '理解隔离与可控。',
    scene: '用 fake 的时钟测试定时逻辑。',
    related: ['Mock', 'Stub', 'Unit Test']
  },
  {
    id: 'test-mock',
    en: 'Mock',
    zh: '模拟对象',
    category: '测试',
    pro: '预先设定期望与返回值、并验证调用是否被按预期发生的测试替身。',
    plain: '替身还"盯着"你有没有按约定调用它。',
    purpose: '理解行为验证。',
    scene: '断言 sendEmail 被调用一次。',
    related: ['Test Double', 'Stub', 'Spy']
  },
  {
    id: 'test-stub',
    en: 'Stub',
    zh: '桩',
    category: '测试',
    pro: '只提供固定返回、不验证交互的测试替身，用于隔离外部依赖。',
    plain: '替身"装样子"返回预设值。',
    purpose: '理解状态验证 vs 行为验证。',
    scene: 'stub 数据库返回假用户。',
    related: ['Test Double', 'Mock', 'Fake']
  },
  {
    id: 'test-fixture',
    en: 'Fixture',
    zh: '测试夹具',
    category: '测试',
    pro: '测试运行前准备的固定上下文（数据/环境），保证可重复。',
    plain: '测试前的"标准布景"，每次都一样。',
    purpose: '理解测试确定性。',
    scene: '每个用例前清空并灌入种子数据。',
    related: ['Test Double', 'Setup', 'Determinism']
  },
  {
    id: 'test-coverage',
    en: 'Code Coverage',
    zh: '代码覆盖率',
    category: '测试',
    pro: '度量被测代码占比（行/分支/条件），高覆盖不等于高正确。',
    plain: '"被测试碰过"的代码比例。',
    purpose: '理解覆盖的盲区与局限。',
    scene: '分支覆盖不足导致边角 bug 漏网。',
    related: ['Unit Test', 'Mutation Testing', 'Quality']
  },
  {
    id: 'test-mutation',
    en: 'Mutation Testing',
    zh: '变异测试',
    category: '测试',
    pro: '故意改代码（如把 > 改 <）看测试能否抓到，评估测试有效性。',
    plain: '故意把代码改错，看你的测试能不能发现。',
    purpose: '理解"假绿"测试。',
    scene: '变异后测试仍通过说明断言太弱。',
    related: ['Code Coverage', 'Assertion', 'Quality']
  },
  {
    id: 'test-fuzz',
    en: 'Fuzz Testing',
    zh: '模糊测试',
    category: '测试',
    pro: '用海量随机/变异输入轰炸程序，挖掘崩溃与漏洞。',
    plain: '往程序里狂灌乱七八糟的输入找崩溃。',
    purpose: '理解鲁棒性与安全边界。',
    scene: '对解析器做模糊测试发现越界。',
    related: ['Edge Case', 'Robustness', 'Crash']
  },
  {
    id: 'test-snapshot',
    en: 'Snapshot Test',
    zh: '快照测试',
    category: '测试',
    pro: '把输出序列化存档，后续比对是否变化，适合 UI/序列化结构。',
    plain: '"拍张照片"留底，下次不一样就报警。',
    purpose: '理解回归检测。',
    scene: '组件渲染结果快照比对。',
    related: ['Regression Test', 'E2E Test', 'Diff']
  },
  {
    id: 'test-contract',
    en: 'Contract Test',
    zh: '契约测试',
    category: '测试',
    pro: '验证服务间接口契约（请求/响应）一致，防联调裂开。',
    plain: '双方先签"接口合同"，各自对着测。',
    purpose: '理解微服务解耦测试。',
    scene: 'Consumer-Driven Contract 校验提供方。',
    related: ['Integration Test', 'API', 'Microservice']
  },
  {
    id: 'test-property',
    en: 'Property-Based Testing',
    zh: '基于性质的测试',
    category: '测试',
    pro: '声明输入输出应满足的不变式，由框架自动生成大量用例验证。',
    plain: '不写具体例子，写"它该永远满足啥规律"。',
    purpose: '理解更通用的正确性。',
    scene: '断言排序后结果长度不变且有序。',
    related: ['Fuzz Testing', 'Assertion', 'Invariant']
  },
  {
    id: 'test-regression',
    en: 'Regression Test',
    zh: '回归测试',
    category: '测试',
    pro: '验证新改动没有破坏已有功能，常靠全集/子集自动化守护。',
    plain: '"改完别把旧功能弄坏"的复测。',
    purpose: '理解持续保障。',
    scene: 'CI 每次跑全量回归套件。',
    related: ['Snapshot Test', 'CI/CD', 'Flaky Test']
  },
  {
    id: 'test-load',
    en: 'Load Test',
    zh: '负载测试',
    category: '测试',
    pro: '在预期并发下检验系统表现，观察吞吐与延迟是否达标。',
    plain: '按"日常高峰"压一压看撑不撑得住。',
    purpose: '理解容量规划。',
    scene: '模拟 1 万并发看 P99 延迟。',
    related: ['Stress Test', 'Soak Test', 'Throughput']
  },
  {
    id: 'test-soak',
    en: 'Soak Test',
    zh: '浸泡测试',
    category: '测试',
    pro: '长时间中低负载运行，暴露内存泄漏与资源耗尽等慢病。',
    plain: '长时间开着，看会不会慢慢"中毒"。',
    purpose: '理解内存泄漏与稳定性。',
    scene: '跑 72 小时观察堆内存趋势。',
    related: ['Load Test', 'Memory Leak', 'Stability']
  },
  {
    id: 'obs-span',
    en: 'Span',
    zh: '跨度',
    category: '可观测性',
    pro: '链路中的单个操作单元，含起止时间、标签与父子关系，合成完整 Trace。',
    plain: '链路里"一小段"操作记录。',
    purpose: '理解调用树结构。',
    scene: '一次 DB 查询是一个 span。',
    related: ['Traces', 'Trace Context', 'OpenTelemetry']
  },
  {
    id: 'obs-trace-context',
    en: 'Trace Context',
    zh: '追踪上下文',
    category: '可观测性',
    pro: '随请求在调用间传递的标识（trace/span id），保证链路连续。',
    plain: '"快递单号"随请求一路带下去。',
    purpose: '理解上下文传播。',
    scene: 'HTTP header 携带 traceparent。',
    related: ['Span', 'Distributed Tracing', 'Correlation ID']
  },
  {
    id: 'obs-correlation-id',
    en: 'Correlation ID',
    zh: '关联 ID',
    category: '可观测性',
    pro: '贯穿一次请求所有日志/链路的唯一标识，便于跨系统串联排查。',
    plain: '给一次请求发"全程身份证"，各处都带上。',
    purpose: '理解跨服务排障。',
    scene: '用 correlation_id 拉出整条链路日志。',
    related: ['Trace Context', 'Structured Logging', 'Distributed Tracing']
  },
  {
    id: 'obs-flame-graph',
    en: 'Flame Graph',
    zh: '火焰图',
    category: '可观测性',
    pro: '把调用栈按耗时铺成横向火焰状图，宽处即热点。',
    plain: '把耗时画成"火苗"，越宽越慢。',
    purpose: '理解性能热点可视化。',
    scene: '火焰图顶部宽栈就是优化重点。',
    related: ['Profiling', 'Bottleneck', 'Stack Trace']
  },
  {
    id: 'perf-profiling',
    en: 'Performance Profiling',
    zh: '性能剖析',
    category: '性能优化',
    pro: '通过采样或插桩量化程序耗时与资源占用，找到真正瓶颈。',
    plain: '"先量再改"，别凭感觉优化。',
    purpose: '理解优化前置量测。',
    scene: '先 profile 发现 IO 才是瓶颈而非算法。',
    related: ['Flame Graph', 'Bottleneck', 'Benchmark']
  },
  {
    id: 'perf-amdahl',
    en: 'Amdahl’s Law',
    zh: '阿姆达尔定律',
    category: '性能优化',
    pro: '描述并行加速的上限受限于不可并行部分的比例。',
    plain: '"不能并行"的那块，决定了你最多快多少。',
    purpose: '理解并行优化极限。',
    scene: '20% 串行时加速比封顶在 5 倍。',
    related: ['Bottleneck', 'Parallelism', 'Scalability']
  },
  {
    id: 'perf-tail-latency',
    en: 'Tail Latency',
    zh: '长尾延迟',
    category: '性能优化',
    pro: '少量请求极慢（P99/P999）的现象，对用户体验与 SLO 影响大。',
    plain: '大多数很快，但"最慢那 1%"很拖后腿。',
    purpose: '理解均值掩盖的问题。',
    scene: 'P99 是 P50 的 10 倍需治理。',
    related: ['P99', 'Latency', 'Sampling']
  },
  {
    id: 'perf-p99',
    en: 'P99 Latency',
    zh: 'P99 延迟',
    category: '性能优化',
    pro: '99% 请求的延迟低于该值，刻画尾部体验而非平均。',
    plain: '"99% 的用户都比这快"，比平均更真实。',
    purpose: '理解体验分位。',
    scene: 'SLO 用 P99 < 200ms 而非均值。',
    related: ['Tail Latency', 'Latency', 'Percentile']
  },
  {
    id: 'perf-hot-path',
    en: 'Hot Path',
    zh: '热路径',
    category: '性能优化',
    pro: '被高频执行的代码路径，哪怕小幅优化也放大为显著收益。',
    plain: '被反复踩的那条"主路"，值得精修。',
    purpose: '理解优化优先级。',
    scene: '请求解析是热路径，优先优化。',
    related: ['Bottleneck', 'Profiling', 'Caching']
  },
  {
    id: 'perf-little-law',
    en: 'Little’s Law',
    zh: '利特尔法则',
    category: '性能优化',
    pro: '队列中平均并发 = 到达率 × 平均停留时间，刻画吞吐与延迟关系。',
    plain: '"在排队的人数 = 来得快不快 × 每人待多久"。',
    purpose: '理解容量与排队。',
    scene: '到达率翻倍而处理不变则排队翻倍。',
    related: ['Bottleneck', 'Throughput', 'Queueing']
  }
]
