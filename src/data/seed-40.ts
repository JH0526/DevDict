import type { Term } from '../types'

// seed-40：「网络协议 / DevOps / 云原生」相关术语词

export const seed40: Term[] = [
  {
    id: 'net-tcp',
    en: 'TCP',
    zh: '传输控制协议',
    category: '网络协议',
    pro: '面向连接、可靠、有序的传输协议，靠三次握手、确认重传与拥塞控制保证交付。',
    plain: '先建立连接、丢了重发、按序到达的"靠谱"传输。',
    purpose: '理解绝大多数应用层协议（HTTP）的底座。',
    scene: '网页、接口底层都跑在 TCP 上。',
    related: ['UDP', 'Handshake', 'HTTP']
  },
  {
    id: 'net-udp',
    en: 'UDP',
    zh: '用户数据报协议',
    category: '网络协议',
    pro: '无连接、不可靠、低开销的传输协议，发出即弃、不保证到达与顺序。',
    plain: '发了不等确认、不保证到的"尽力而为"传输。',
    purpose: '理解实时/广播场景为何用它。',
    scene: '音视频通话、DNS 查询用 UDP。',
    related: ['TCP', 'QUIC', 'Packet Loss']
  },
  {
    id: 'net-http3',
    en: 'HTTP/3',
    zh: 'HTTP/3',
    category: '网络协议',
    pro: '基于 QUIC 的 HTTP 版本，连接迁移与更强抗丢包，弱网更稳。',
    plain: '换 QUIC 当底座的 HTTP，换网络也不掉线。',
    purpose: '理解移动弱网体验提升。',
    scene: '手机切 WiFi 时连接不中断。',
    related: ['QUIC', 'HTTP/2', 'Head-of-Line Blocking']
  },
  {
    id: 'net-hol-blocking',
    en: 'Head-of-Line Blocking',
    zh: '队头阻塞',
    category: '网络协议',
    pro: '前面一个分组阻塞导致后续都排队的现象，HTTP/1.1 与 TCP 层面各有体现。',
    plain: '队首卡住，后面全干等。',
    purpose: '理解多路复用与 QUIC 的价值。',
    scene: '一个慢响应拖住同连接其它请求。',
    related: ['HTTP/2', 'QUIC', 'Multiplexing']
  },
  {
    id: 'net-handshake',
    en: 'Handshake',
    zh: '握手',
    category: '网络协议',
    pro: '通信双方建立连接/协商参数的初始交互过程，如 TCP 三次握手、TLS 握手。',
    plain: '连上线前的"互相确认身份与规则"。',
    purpose: '理解连接建立的代价。',
    scene: 'TLS 握手耗时影响首字节。',
    related: ['TCP', 'TLS', '0-RTT']
  },
  {
    id: 'net-0rtt',
    en: '0-RTT',
    zh: '零往返时延',
    category: '网络协议',
    pro: '在已有会话前提下首包即带数据，省去握手往返，但存在重放风险。',
    plain: '老相识直接"带话"来，不用先寒暄。',
    purpose: '理解连接恢复提速。',
    scene: 'QUIC 0-RTT 复用旧连接发请求。',
    related: ['QUIC', 'Handshake', 'Replay Attack']
  },
  {
    id: 'net-cidr',
    en: 'CIDR',
    zh: '无类域间路由',
    category: '网络协议',
    pro: '用"IP/掩码位数"表示一段地址范围，取代旧的 A/B/C 类划分。',
    plain: '用"前缀+长度"精确圈一段 IP。',
    purpose: '理解子网规划。',
    scene: '10.0.0.0/24 表示 256 个地址。',
    related: ['Subnet', 'VPC', 'IP']
  },
  {
    id: 'net-vpc',
    en: 'VPC',
    zh: '私有云网络',
    category: '网络协议',
    pro: 'Virtual Private Cloud，云上逻辑隔离的私有网络，自建子网、路由与网关。',
    plain: '云里给你划的一块"独立私有园区"。',
    purpose: '理解云上网络隔离。',
    scene: '把数据库放进私有子网不暴露公网。',
    related: ['Subnet', 'CIDR', 'NAT']
  },
  {
    id: 'net-subnet',
    en: 'Subnet',
    zh: '子网',
    category: '网络协议',
    pro: '一个网段内再划分的更小地址块，配合路由与 ACL 控制互通。',
    plain: '大园区里再隔出的"小格子"。',
    purpose: '理解分层与安全边界。',
    scene: '公网子网放网关、私网子网放应用。',
    related: ['CIDR', 'VPC', 'Routing']
  },
  {
    id: 'net-nat',
    en: 'NAT',
    zh: '网络地址转换',
    category: '网络协议',
    pro: '把私有地址映射为公网地址出网，缓解 IPv4 枯竭并隐藏内网。',
    plain: '内网多机共用一个公网 IP 出门。',
    purpose: '理解私网出网与隐藏。',
    scene: '家里多设备经路由器 NAT 上网。',
    related: ['VPC', 'Public IP', 'Firewall']
  },
  {
    id: 'net-anycast',
    en: 'Anycast',
    zh: '任播',
    category: '网络协议',
    pro: '同一 IP 通告到多个地点，路由把请求送到"最近"的节点，常用于 DNS/CDN。',
    plain: '同一个地址多地都有，谁近找谁。',
    purpose: '理解全球加速与抗 DDoS。',
    scene: '根 DNS 用 Anycast 就近响应。',
    related: ['DNS', 'CDN', 'Edge']
  },
  {
    id: 'net-bgp',
    en: 'BGP',
    zh: '边界网关协议',
    category: '网络协议',
    pro: '互联网核心的自治系统间路由协议，靠路径属性交换可达信息。',
    plain: '各大网络之间"互通有无"的路由总则。',
    purpose: '理解全球路由与故障传播。',
    scene: '运营商之间用 BGP 宣告路由。',
    related: ['Anycast', 'Routing', 'Peering']
  },
  {
    id: 'net-packet-loss',
    en: 'Packet Loss',
    zh: '丢包',
    category: '网络协议',
    pro: '数据包在传输中丢失，触发重传，直接影响吞吐与抖动。',
    plain: '发的数据半路"掉水里"了。',
    purpose: '理解弱网重传与降速。',
    scene: 'Wi-Fi 干扰导致视频卡顿。',
    related: ['Congestion Control', 'UDP', 'Jitter']
  },
  {
    id: 'net-jitter',
    en: 'Jitter',
    zh: '抖动',
    category: '网络协议',
    pro: '时延的波动程度，对实时音视频与游戏影响显著。',
    plain: '时延忽高忽低、不稳。',
    purpose: '理解实时业务的体验。',
    scene: '抖动大导致语音断断续续。',
    related: ['Latency', 'Packet Loss', 'QoS']
  },
  {
    id: 'dev-dockerfile',
    en: 'Dockerfile',
    zh: '镜像构建文件',
    category: 'DevOps',
    pro: '声明镜像构建步骤的文本文件，每条指令生成一层。',
    plain: '写清楚"这箱子怎么一层层装出来"。',
    purpose: '理解可复现构建。',
    scene: 'FROM/ RUN/ COPY 逐层定义。',
    related: ['Image', 'Layer', 'Build']
  },
  {
    id: 'dev-ingress',
    en: 'Ingress',
    zh: '入口路由',
    category: 'DevOps',
    pro: 'K8s 中管理外部访问的 API 对象，做七层路由、TLS 终止与虚拟主机。',
    plain: '集群对外的"总前台+路由表"。',
    purpose: '理解集群入口治理。',
    scene: '按域名把流量分到不同服务。',
    related: ['Kubernetes', 'Service', 'Load Balancer']
  },
  {
    id: 'dev-namespace',
    en: 'Namespace',
    zh: '命名空间',
    category: 'DevOps',
    pro: 'K8s 内逻辑隔离资源的边界，常用于多环境/多团队。',
    plain: '集群里再划出的"软隔间"。',
    purpose: '理解多租户与权限边界。',
    scene: 'dev/test/prod 各占一 namespace。',
    related: ['Kubernetes', 'RBAC', 'Quota']
  },
  {
    id: 'dev-hpa',
    en: 'HPA',
    zh: '水平自动伸缩',
    category: 'DevOps',
    pro: 'Horizontal Pod Autoscaler，按 CPU/自定义指标自动增减副本数。',
    plain: '忙了自动加副本，闲了自动减。',
    purpose: '理解弹性与成本平衡。',
    scene: 'CPU 超 70% 自动扩到 10 副本。',
    related: ['Kubernetes', 'ReplicaSet', 'Metrics']
  },
  {
    id: 'dev-configmap',
    en: 'ConfigMap',
    zh: '配置映射',
    category: 'DevOps',
    pro: 'K8s 中存非机密配置的对象，可挂载为文件或环境变量。',
    plain: '把"配置"从镜像里抽出来单独管。',
    purpose: '理解配置与镜像解耦。',
    scene: '改配置无需重建镜像。',
    related: ['Secret', 'Environment Variable', 'Twelve-Factor']
  },
  {
    id: 'dev-helm',
    en: 'Helm',
    zh: 'Helm',
    category: 'DevOps',
    pro: 'K8s 的包管理器，用 Chart 模板化部署，支持版本与回滚。',
    plain: 'K8s 的"应用安装包+一键部署"。',
    purpose: '理解复杂部署的可复用。',
    scene: 'helm install 一键拉起一整套中间件。',
    related: ['Kubernetes', 'Chart', 'Release']
  },
  {
    id: 'dev-gitops',
    en: 'GitOps',
    zh: 'Git 运维',
    category: 'DevOps',
    pro: '以 Git 仓库为唯一事实源，通过同步器把集群状态持续对齐到声明。',
    plain: '把"集群该是什么样"写进 Git，机器人自动对齐。',
    purpose: '理解可审计、可回滚的运维。',
    scene: '改 Git 即触发集群更新。',
    related: ['IaC', 'ArgoCD', 'Continuous Delivery']
  },
  {
    id: 'dev-immutable',
    en: 'Immutable Infrastructure',
    zh: '不可变基础设施',
    category: 'DevOps',
    pro: '部署后不就地修改，更新即替换新实例，杜绝配置漂移。',
    plain: '不修旧的，直接换新的。',
    purpose: '理解稳定与可重现。',
    scene: '新镜像发布替换旧 Pod。',
    related: ['IaC', 'Artifact', 'Drift']
  },
  {
    id: 'dev-sli',
    en: 'SLI',
    zh: '服务等级指标',
    category: 'DevOps',
    pro: 'Service Level Indicator，衡量服务实际表现的具体指标（如错误率、延迟）。',
    plain: '用来算 SLO 的"实测数据"。',
    purpose: '理解目标如何被度量。',
    scene: '用 5xx 率与 P99 延迟算可用性。',
    related: ['SLO', 'Error Budget', 'Metrics']
  },
  {
    id: 'dev-error-budget',
    en: 'Error Budget',
    zh: '错误预算',
    category: 'DevOps',
    pro: 'SLO 允许的错误额度，花光则冻结新功能、优先稳定。',
    plain: '允许的"犯错额度"，用完了先顾稳。',
    purpose: '理解可靠与迭代的取舍。',
    scene: '预算耗尽暂停发布转做稳定性。',
    related: ['SLO', 'SLI', 'Reliability']
  },
  {
    id: 'dev-drift',
    en: 'Configuration Drift',
    zh: '配置漂移',
    category: 'DevOps',
    pro: '实际环境偏离声明状态（手动改、脚本补漏）导致的不一致。',
    plain: '实际环境慢慢"跑偏"了声明。',
    purpose: '理解 IaC/GitOps 的意义。',
    scene: '有人手改线上配置引发差异。',
    related: ['IaC', 'GitOps', 'Immutable Infrastructure']
  },
  {
    id: 'dev-operator',
    en: 'Operator',
    zh: 'Operator 模式',
    category: 'DevOps',
    pro: '把领域运维知识编码成控制器，自动运维有状态中间件（如数据库）。',
    plain: '把"老运维的经验"写成自动控制器。',
    purpose: '理解复杂有状态应用自动化。',
    scene: 'etcd Operator 自动扩缩容与备份。',
    related: ['Kubernetes', 'Controller', 'CRD']
  },
  {
    id: 'dev-tunnel',
    en: 'Tunnel',
    zh: '隧道',
    category: 'DevOps',
    pro: '把一种协议的流量封装进另一种协议传输，实现安全或穿越。',
    plain: '把流量"装进另一条管道"里走。',
    purpose: '理解 VPN/内网穿透。',
    scene: 'SSH 隧道把本地端口映射远端。',
    related: ['VPN', 'Proxy', 'Encryption']
  }
]
