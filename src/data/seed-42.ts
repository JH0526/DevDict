import type { Term } from '../types'

// seed-42：「设计 / 产品 / 架构模式」相关术语词

export const seed42: Term[] = [
  {
    id: 'des-component-library',
    en: 'Component Library',
    zh: '组件库',
    category: '设计',
    pro: '可复用的 UI 组件集合（按钮、表单、弹窗），含交互与无障碍。',
    plain: '一堆"现成 UI 积木"。',
    purpose: '理解高效一致的前端开发。',
    scene: '团队用统一组件库搭页面。',
    related: ['Design System', 'Design Token', 'Atomic Design']
  },
  {
    id: 'des-contrast',
    en: 'Color Contrast',
    zh: '色彩对比度',
    category: '设计',
    pro: '前景与背景的亮度差，决定文字可读性，WCAG 有最低比值要求。',
    plain: '字和底色的"够不够分明"。',
    purpose: '理解可读性与无障碍。',
    scene: '灰字配浅灰底对比不足被判定不合格。',
    related: ['Accessibility', 'WCAG', 'Readability']
  },
  {
    id: 'des-typography',
    en: 'Typography',
    zh: '字体排印',
    category: '设计',
    pro: '字族、字号、行高、字重与节奏的系统化处理，影响可读与气质。',
    plain: '"怎么排字"的艺术与规范。',
    purpose: '理解信息层级与阅读体验。',
    scene: '正文 16px、行高 1.5 提升可读性。',
    related: ['Visual Hierarchy', 'Readability', 'Scale']
  },
  {
    id: 'des-spacing-scale',
    en: 'Spacing Scale',
    zh: '间距体系',
    category: '设计',
    pro: '以固定基数（如 4/8px）推导的间距阶梯，保证留白节奏一致。',
    plain: '用"4 的倍数"统一所有留白。',
    purpose: '理解视觉韵律。',
    scene: '卡片内边距统一用 16/24px。',
    related: ['Design Token', 'Grid System', 'Rhythm']
  },
  {
    id: 'des-grid-system',
    en: 'Grid System',
    zh: '栅格系统',
    category: '设计',
    pro: '用列与槽划分版面，使元素对齐、节奏统一，是布局骨架。',
    plain: '页面排版的"隐形格子"。',
    purpose: '理解对齐与秩序。',
    scene: '12 栅格让多卡片对齐。',
    related: ['Spacing Scale', 'Layout', 'Alignment']
  },
  {
    id: 'des-visual-hierarchy',
    en: 'Visual Hierarchy',
    zh: '视觉层级',
    category: '设计',
    pro: '通过大小、颜色、位置引导视线优先级，让用户先看到重要的。',
    plain: '"先看哪、后看哪"的视觉排序。',
    purpose: '理解信息优先级传达。',
    scene: '主按钮更醒目、次要按钮弱化。',
    related: ['Typography', 'Contrast', 'Affordance']
  },
  {
    id: 'des-affordance',
    en: 'Affordance',
    zh: '可供性',
    category: '设计',
    pro: '物体外观暗示其用法（按钮像能按、把手像能拉），降低学习成本。',
    plain: '东西"长什么样就该怎么用"。',
    purpose: '理解直觉化交互。',
    scene: '阴影让卡片看起来可点。',
    related: ['Visual Hierarchy', 'Usability', 'Skeuomorphism']
  },
  {
    id: 'des-empty-state',
    en: 'Empty State',
    zh: '空状态',
    category: '设计',
    pro: '列表/页面无数据时的引导界面，提供下一步行动与情感化文案。',
    plain: '"这里还什么都没有"时的友好提示。',
    purpose: '理解首次体验与引导。',
    scene: '购物车空时引导去逛逛。',
    related: ['Error State', 'Microcopy', 'Onboarding']
  },
  {
    id: 'des-error-state',
    en: 'Error State',
    zh: '错误状态',
    category: '设计',
    pro: '操作失败时的界面，需说清原因并给出可执行的恢复路径。',
    plain: '"出错了"时别只甩报错，要告诉怎么救。',
    purpose: '理解容错与安抚。',
    scene: '网络失败提示"重试"按钮。',
    related: ['Empty State', 'Microcopy', 'Feedback']
  },
  {
    id: 'des-microcopy',
    en: 'Microcopy',
    zh: '微文案',
    category: '设计',
    pro: '界面里那些短小的人话提示（按钮、报错、引导），显著影响转化与信任。',
    plain: '界面上的"小字文案"，决定顺不顺手。',
    purpose: '理解文字即体验。',
    scene: '空购物车写"挑点喜欢的吧"比"无数据"更暖。',
    related: ['Empty State', 'Error State', 'Tone']
  },
  {
    id: 'des-dark-mode',
    en: 'Dark Mode',
    zh: '深色模式',
    category: '设计',
    pro: '以暗色为背景的配色方案，降低眩光、省电并满足偏好。',
    plain: '把界面"调暗"的配色模式。',
    purpose: '理解主题与可用性。',
    scene: '夜间用深色模式更护眼。',
    related: ['Design Token', 'Theme', 'Contrast']
  },
  {
    id: 'prod-jtbd',
    en: 'Jobs-to-be-Done',
    zh: '待办任务',
    category: '产品',
    pro: '从"用户雇产品来完成什么任务"视角理解需求，超越人口统计。',
    plain: '"用户雇你产品去干啥活"的视角。',
    purpose: '理解真实动机。',
    scene: '买钻不是要钻头，是要墙上的洞。',
    related: ['User Persona', 'Value Proposition', 'Insight']
  },
  {
    id: 'prod-kano',
    en: 'Kano Model',
    zh: '卡诺模型',
    category: '产品',
    pro: '把需求按"满意度-投入"分为基本/期望/兴奋三类，指导优先级。',
    plain: '把功能分"必须有/应该的/惊喜的"三档。',
    purpose: '理解需求价值分层。',
    scene: '稳定性是基础型、彩蛋是兴奋型。',
    related: ['Prioritization', 'MVP', 'User Satisfaction']
  },
  {
    id: 'prod-aarrr',
    en: 'Pirate Metrics',
    zh: '海盗指标',
    category: '产品',
    pro: 'AARRR 漏斗：获取、激活、留存、收入、推荐，刻画增长全链路。',
    plain: '增长"五步漏斗"：拉新→激活→留存→变现→裂变。',
    purpose: '理解增长分析。',
    scene: '优化激活环节提升整体转化。',
    related: ['Funnel', 'Retention', 'Churn']
  },
  {
    id: 'prod-funnel',
    en: 'Conversion Funnel',
    zh: '转化漏斗',
    category: '产品',
    pro: '把用户从进入到转化各步骤的留存比例画出，定位流失点。',
    plain: '"一路上多少人掉队"的漏斗。',
    purpose: '理解流失与优化。',
    scene: '注册漏斗第三步流失最高。',
    related: ['Pirate Metrics', 'Retention', 'A/B Test']
  },
  {
    id: 'prod-churn',
    en: 'Churn',
    zh: '流失',
    category: '产品',
    pro: '用户在一段时间内停止使用的比例，是留存的反面指标。',
    plain: '"用着用着走了"的比例。',
    purpose: '理解健康度。',
    scene: '月流失 5% 需预警。',
    related: ['Retention', 'Funnel', 'Cohort']
  },
  {
    id: 'arch-modular-monolith',
    en: 'Modular Monolith',
    zh: '模块化单体',
    category: '架构模式',
    pro: '仍是单部署，但内部强模块化、边界清晰，兼顾简单与可演进。',
    plain: '"一个包、内部切得清"的折中。',
    purpose: '理解不上微服务的过渡态。',
    scene: '模块间仅经明确接口通信。',
    related: ['Monolith', 'Microservices', 'Bounded Context']
  },
  {
    id: 'arch-bounded-context',
    en: 'Bounded Context',
    zh: '界限上下文',
    category: '架构模式',
    pro: '明确某模型的有效边界，边界内术语与规则自洽，跨边界需显式映射。',
    plain: '"这块领域各说各话，边界划清"。',
    purpose: '理解大模型拆分。',
    scene: '销售与物流对同一"订单"含义不同。',
    related: ['Domain-Driven Design', 'Anti-Corruption Layer', 'Context Map']
  },
  {
    id: 'arch-aggregate',
    en: 'Aggregate',
    zh: '聚合',
    category: '架构模式',
    pro: '一组相关对象的一致性边界，由聚合根统管变更，是事务边界。',
    plain: '"一捆对象一起变、一起保一致"。',
    purpose: '理解领域建模的事务边界。',
    scene: '订单聚合根统领订单项与状态。',
    related: ['Domain-Driven Design', 'Entity', 'Repository Pattern']
  },
  {
    id: 'arch-cqrs-pattern',
    en: 'CQRS Pattern',
    zh: '读写分离模式',
    category: '架构模式',
    pro: '将写模型与读模型分开设计与伸缩，各自优化。',
    plain: '改和查走两套，互不打扰。',
    purpose: '理解高伸缩读写。',
    scene: '写归事件源、读归预聚合投影。',
    related: ['Event Sourcing', 'Read Model', 'Scaling']
  },
  {
    id: 'arch-saga-pattern',
    en: 'Saga Pattern',
    zh: 'Saga 模式',
    category: '架构模式',
    pro: '以一系列本地事务加补偿实现分布式长事务最终一致。',
    plain: '跨服务"分步提交、出错回退"。',
    purpose: '理解分布式一致。',
    scene: '下单跨库存/支付/积分用 Saga。',
    related: ['Distributed Transaction', 'Compensation', 'Eventual Consistency']
  },
  {
    id: 'arch-gateway-pattern',
    en: 'API Gateway Pattern',
    zh: 'API 网关模式',
    category: '架构模式',
    pro: '统一入口负责路由、鉴权、限流与聚合，屏蔽后端细节。',
    plain: '所有 API 的"总前台"。',
    purpose: '理解边缘治理。',
    scene: '网关统一 JWT 校验。',
    related: ['BFF', 'Reverse Proxy', 'Rate Limit']
  }
]
