import glob, re, io

# ---- gather existing en/zh from all current seeds ----
files = sorted(glob.glob('src/data/seed-*.ts'))
existing_en = set()
existing_zh = set()
for f in files:
    src = open(f, encoding='utf-8').read()
    for m in re.finditer(r"en:\s*'([^']*)'", src):
        existing_en.add(m.group(1).strip().lower())
    for m in re.finditer(r"zh:\s*'([^']*)'", src):
        existing_zh.add(m.group(1).strip())

# ---- candidate pool (id, en, zh, category, pro, plain, purpose, scene, related) ----
C = [
 # 编码与字符
 ('enc-big-endian','Big-Endian','大端序','编码与字符','多字节数据高位字节存于低地址的约定，阅读和调试直观。','高位在前。','理解字节序。','网络协议统一大端传输。',"['Endianness','Little-Endian','Binary']"),
 ('enc-little-endian','Little-Endian','小端序','编码与字符','多字节数据低位字节存于低地址的约定，x86 等主流架构采用。','低位在前。','理解主机字节序。','Intel CPU 内存布局。',"['Endianness','Big-Endian','Binary']"),
 ('enc-ascii','ASCII','ASCII 码','编码与字符','用 0-127 编号表示英文字符的 7 位字符集，是许多编码的基石。','最早的英文字符编号表。','理解字符编码源头。','控制字符与英文字母。',"['Unicode','UTF-8','Encoding']"),
 ('enc-zlib','zlib','zlib 压缩','编码与字符','基于 DEFLATE 的流式无损压缩库，被广泛嵌入各类协议与格式。','常用的压缩库。','理解压缩基础设施。','PNG、HTTP 都用它。',"['DEFLATE','Gzip','Compression']"),
 ('enc-deflate','DEFLATE','Deflate 算法','编码与字符','结合 LZ77 与哈夫曼编码的无损压缩算法，是 zip/gzip 的核心。','经典无损压缩算法。','理解压缩原理。','ZIP 文件底层。',"['zlib','Gzip','LZ77']"),
 ('enc-bom','Byte Order Mark','字节顺序标记','编码与字符','置于文本开头的特殊码元，标识编码与字节序，UTF-8 中常可省略。','文件头上的编码小标签。','理解编码识别。','Windows 记事本加 BOM。',"['UTF-8','Unicode','Encoding']"),
 ('enc-grapheme','Grapheme','字位','编码与字符','用户眼中一个完整的字符，可能由多码点组合（如带变音的字母）。','屏幕上看起来像一个字的单位。','理解字符切分。','emoji 加肤色算一个字位。',"['Code Point','Unicode','Emoji']"),
 ('enc-codepoint','Code Point','码点','编码与字符','Unicode 中字符的逻辑编号，与具体字节编码无关。','字符的全球编号。','理解字符模型。','U+4E2D 是"中"。',"['Unicode','Grapheme','UTF-8']"),
 ('enc-glyph','Glyph','字形','编码与字符','字符在字体中实际绘制的形状，与码点一对多或一对零。','字写出来长什么样。','理解渲染与字体。','同一字不同字体字形不同。',"['Font','Rendering','Code Point']"),
 ('enc-punycode','Punycode','Punycode 编码','编码与字符','把含非 ASCII 的域名转换为 ASCII 的编码，支撑国际化域名。','把中文域名转成英文形式。','理解 IDN。','中文域名底层转换。',"['IDN','Domain','ASCII']"),
 ('enc-emoji','Emoji','绘文字','编码与字符','Unicode 中的表情符号码点，常由多码点组合并带肤色等变体。','聊天里的表情符号。','理解现代字符。','ZWNJ 控制组合。',"['Unicode','Grapheme','Code Point']"),
 ('enc-normalization','Unicode Normalization','Unicode 归一化','编码与字符','把等价字符序列转为唯一标准形式，避免比较不一致。','把同一字的多种写法统一。','理解字符比较。','NFC/NFD 形态。',"['Unicode','Code Point','String']"),

 # 操作系统
 ('os-thrashing','Thrashing','系统抖动','操作系统','频繁页换入换出使 CPU 大量空转于换页，系统近乎停滞。','内存不够疯狂换页卡死。','理解内存压力。','并发进程过多时抖动。',"['Virtual Memory','Page Fault','Swap']"),
 ('os-cow','Copy-on-Write','写时复制','操作系统','fork 等场景先共享页，写时才真正复制，节省内存与启动。','要改才复制，平时共享。','理解高效 fork。','容器镜像层共享。',"['Fork','Virtual Memory','Snapshot']"),
 ('os-mmap','Memory-Mapped File','内存映射文件','操作系统','把文件映射到进程地址空间，像访问内存一样读写磁盘。','把文件当内存用。','理解零拷贝 IO。','大文件 mmap 读取。',"['Virtual Memory','Page Cache','IO']"),
 ('os-spinlock','Spinlock','自旋锁','操作系统','拿不到锁时忙等而非睡眠，适合极短临界区。','等锁时空转不睡觉。','理解低延迟同步。','内核短临界区。',"['Mutex','Lock','Concurrency']"),
 ('os-page-cache','Page Cache','页缓存','操作系统','内核用内存缓存文件页，加速重复读写。','用内存兜住文件读写。','理解 IO 加速。','第二次读命中缓存。',"['Buffer Cache','Virtual Memory','IO']"),
 ('os-vfs','Virtual File System','虚拟文件系统','操作系统','为不同具体文件系统提供统一接口的抽象层。','给各种文件系统统一门面。','理解文件系统抽象。','open 统一调用。',"['File System','Inode','Kernel']"),
 ('os-interrupt','Interrupt','中断','操作系统','硬件异步打断 CPU 当前执行以处理紧急事件。','硬件拍 CPU 肩膀说有事。','理解事件驱动。','网卡收包触发中断。',"['System Call','Signal','Kernel']"),
 ('os-kernel-panic','Kernel Panic','内核恐慌','操作系统','内核遇到无法恢复错误而停机的保护机制。','内核崩了直接停机。','理解严重故障。','驱动野指针触发。',"['Kernel','Crash','Fault']"),
 ('os-working-set','Working Set','工作集','操作系统','进程在一段时间内实际频繁访问的页面集合，是内存分配依据。','进程真正在用的那批页。','理解内存占用。','调页算法参考工作集。',"['Virtual Memory','Thrashing','Page']"),
 ('os-futex','Futex','快速用户态互斥','操作系统','用户态原子检测、仅在竞争时陷入内核的轻量同步原语。','大部分时候用户态就搞定。','理解高性能锁。','pthread 互斥底层。',"['Mutex','Spinlock','System Call']"),

 # 终端
 ('term-alias','Alias','命令别名','终端','为长命令定义简短替代名的 Shell 功能。','给命令起个小名。','理解效率配置。','ll 替代 ls -l。',"['Shell','Function','Configuration']"),
 ('term-glob','Glob','通配符','终端','用 * ? [] 等模式匹配文件名的展开机制。','用星号批量指代文件。','理解批量选择。','rm *.log 删全部。',"['Pattern','Shell','Expansion']"),
 ('term-tty','TTY','终端装置','终端','代表一个文本终端会话的设备抽象，承载输入输出。','一个文本终端会话。','理解终端模型。','SSH 连上就是一个 tty。',"['PTY','Shell','Stdin']"),
 ('term-job-control','Job Control','作业控制','终端','在 Shell 中前后台切换与暂停恢复任务的能力。','把任务扔后台或拉回前台。','理解多任务终端。','Ctrl-Z 挂起。',"['Shell','Process','Signal']"),
 ('term-redirection','Redirection','重定向','终端','把命令的标准流导向文件或另一个流的机制。','把输入输出改道到文件。','理解流控制。','2> error.log。',"['Stdout','Stdin','Pipe']"),
 ('term-expansion','Shell Expansion','Shell 展开','终端','Shell 在执行前对变量、命令替换、通配符等的展开过程。','执行前先把各种符号展开。','理解命令解析。','$VAR $(cmd) 展开。',"['Glob','Variable','Shell']"),

 # 网站
 ('web-canonical','Canonical URL','规范链接','网站','用 link 标签声明重复页面的首选版本，集中 SEO 权重。','告诉搜索引擎哪个是正版。','理解重复内容。','www 与非 www 指定其一。',"['SEO','Duplicate Content','Meta Tag']"),
 ('web-hreflang','Hreflang','多语言链接','网站','标注页面面向的语言与地区，辅助国际版 SEO。','告诉搜索引擎这是哪国语。','理解多语言 SEO。','zh-cn 对应中文页。',"['SEO','Canonical','Localization']"),
 ('web-og','Open Graph','开放图谱','网站','一组 meta 标签，控制链接在社交平台分享时的标题图卡。','分享卡片长什么样由它定。','理解社交传播。','微信分享带图。',"['Meta Tag','SEO','Social']"),
 ('web-meta-desc','Meta Description','元描述','网站','概括页面内容的 meta 标签，常作为搜索结果摘要。','搜索结果底下那行说明。','理解点击率优化。','写清卖点提点击。',"['SEO','Meta Tag','Snippet']"),
 ('web-breadcrumb','Breadcrumb','面包屑导航','网站','展示当前页面在站点层级中位置的导航，利于 SEO 与体验。','你在网站哪一层的位置条。','理解站点结构。','首页>分类>文章。',"['SEO','Navigation','Hierarchy']"),
 ('web-alt-text','Alt Text','替代文本','网站','为图片提供的文字描述，利于无障碍与图片 SEO。','图片挂了也能看到说明。','理解可访问性。','给图加 alt 描述。',"['SEO','Accessibility','Image']"),
 ('web-pagination-seo','Pagination SEO','分页 SEO','网站','用规范与上下页标签正确处理分页，避免权重分散。','多页内容怎么不被判重复。','理解列表分页。','rel=next/prev。',"['SEO','Canonical','Crawl']"),

 # 网页
 ('web-web-component','Web Component','Web 组件','网页','用原生标准封装可复用自定义元素的组件模型。','浏览器原生的组件方案。','理解组件化。','Shadow DOM 隔离。',"['Custom Element','Shadow DOM','Slot']"),
 ('web-custom-element','Custom Element','自定义元素','网页','通过 API 注册具备生命周期的新 HTML 标签。','自己造一个新的 HTML 标签。','理解标签扩展。','<my-button> 可用。',"['Web Component','Lifecycle','Shadow DOM']"),
 ('web-slot','Slot','插槽','网页','Web Component 中承接外部内容的占位机制。','组件里留给外面塞内容的位置。','理解内容分发。','具名 slot 分发。',"['Web Component','Shadow DOM','Template']"),
 ('web-template-el','Template Element','模板元素','网页','不渲染的 HTML 片段容器，供 JS 克隆复用。','藏起来的可复制模板。','理解 DOM 复用。','cloneNode 生成节点。',"['Web Component','DOM','Clone']"),
 ('web-sri','Subresource Integrity','子资源完整性','网页','用哈希校验外部脚本/样式未被篡改。','给外链资源加指纹防篡改。','理解供应链安全。','integrity=sha384。',"['CDN','Security','Hash']"),
 ('web-prefetch','Prefetch','预取','网页','提前下载后续可能需要的资源以加速未来导航。','提前把下一步资源下好。','理解感知性能。','<link rel=prefetch>。',"['Preload','Lazy Loading','Performance']"),
 ('web-preload','Preload','预加载','网页','高优先级提前加载当前页关键资源。','先把重要的资源抢先下。','理解首屏优化。','preload CSS 字体。',"['Prefetch','Critical Rendering Path','Performance']"),
 ('web-reflow','Reflow','重排','网页','因布局变化触发的几何重新计算，代价高于重绘。','改了布局浏览器重新算位置。','理解渲染开销。','改宽高触发重排。',"['Repaint','Critical Rendering Path','Layout']"),
 ('web-repaint','Repaint','重绘','网页','因外观变化触发的像素重新绘制，不含布局。','改了颜色重新画一遍。','理解渲染开销。','改 color 触发重绘。',"['Reflow','Rendering','GPU']"),
 ('web-crp','Critical Rendering Path','关键渲染路径','网页','浏览器把 HTML/CSS/JS 转为首屏像素的关键步骤链。','从代码到首屏像素的流水线。','理解首屏优化。','压缩关键 CSS。',"['Reflow','Preload','Performance']"),
 ('web-module-script','Module Script','模块脚本','网页','以 ES Module 方式加载、具备作用域与依赖图的脚本。','带 import/export 的脚本。','理解现代打包。','type=module。',"['ESM','Import Map','Bundle']"),
 ('web-importmap','Import Map','导入映射','网页','在浏览器中声明裸模块名到 URL 的映射，免打包。','告诉浏览器 import 名字指向哪。','理解免构建开发。','import React 直连 CDN。',"['ESM','Module Script','Bundle']"),

 # 移动开发
 ('mob-compose','Jetpack Compose','Compose 声明式 UI','移动开发','Android 的声明式 UI 工具包，以可组合函数描述界面。','用函数声明式画界面。','理解现代安卓 UI。','@Composable 函数。',"['Declarative UI','SwiftUI','Recomposition']"),
 ('mob-swiftui','SwiftUI','SwiftUI','移动开发','苹果的声明式 UI 框架，跨 Apple 平台共享一套描述。','苹果那边的声明式 UI。','理解 iOS UI。','View 协议组合。',"['Declarative UI','Jetpack Compose','State']"),
 ('mob-broadcast','Broadcast Receiver','广播接收器','移动开发','监听系统或应用广播事件的安卓组件。','收系统广播的耳朵。','理解跨组件通知。','电量变化广播。',"['Intent','Service','Android']"),
 ('mob-content-provider','Content Provider','内容提供者','移动开发','在应用间安全共享结构化数据的安卓组件。','跨应用共享数据的接口。','理解数据共享。','通讯录提供者。',"['URI','Permission','Android']"),
 ('mob-constraint','Constraint Layout','约束布局','移动开发','以约束关系描述视图位置的扁平布局，减少嵌套。','用约束定位、少套娃。','理解布局性能。','相对定位各边。',"['Layout','View','Nesting']"),
 ('mob-recycler','RecyclerView','复用列表','移动开发','只创建可视项视图并复用以高效渲染长列表。','列表项视图循环利用。','理解列表性能。','滚动只重绑数据。',"['Adapter','View Holder','List']"),
 ('mob-workmanager','WorkManager','工作管理器','移动开发','面向可延迟后台任务的安卓调度 API，兼顾省电与可靠。','保证能跑的后台任务。','理解后台调度。','定时上报用它能省电。',"['Background','Job Scheduler','Android']"),
 ('mob-room','Room','Room 持久库','移动开发','在 SQLite 上提供类型安全抽象与编译期校验的安卓持久层。','给 SQLite 套个好用的壳。','理解本地存储。','DAO 注解生成 SQL。',"['SQLite','ORM','Database']"),
 ('mob-nav-comp','Navigation Component','导航组件','移动开发','以图描述页面跳转、统一管理返回栈的安卓库。','用图管理页面跳转。','理解导航。','NavController 导航。',"['Fragment','Back Stack','Routing']"),
 ('mob-service-and','Service','服务组件','移动开发','在后台执行长时操作、无界面的安卓组件。','后台默默干活的组件。','理解后台执行。','音乐播放服务。',"['Foreground Service','Broadcast Receiver','Android']"),

 # 消息队列与缓存
 ('mq-exchange','Exchange','交换机','消息队列与缓存','在 AMQP 中按路由规则把消息分发到一个或多个队列。','消息进队列前的分拣台。','理解路由分发。','direct/topic/fanout。',"['Binding','Queue','Routing Key']"),
 ('mq-binding','Binding','绑定','消息队列与缓存','连接交换机与队列并携带路由规则的关联。','交换机和队列之间的线。','理解路由配置。','routingKey 决定投递。',"['Exchange','Queue','Topic']"),
 ('mq-dlq','Dead Letter Queue','死信队列','消息队列与缓存','无法被正常消费的消息转入的隔离队列，便于排查。','消化不掉的消息收容所。','理解故障隔离。','重试耗尽进 DLQ。',"['Retry','Requeue','Poison Message']"),
 ('mq-delay','Delay Queue','延迟队列','消息队列与缓存','让消息在指定延迟后才可被消费的时间调度队列。','定时才让消费者拿到。','理解定时投递。','订单 30 分未付提醒。',"['TTL','Scheduled Message','Queue']"),
 ('mq-poison','Poison Message','毒消息','消息队列与缓存','因格式或逻辑错误反复消费失败、阻碍进度的消息。','怎么都处理不了的坏消息。','理解消费卡住。','始终抛错堵住队列。',"['Dead Letter Queue','Ack','Retry']"),
 ('mq-stream','Message Stream','消息流','消息队列与缓存','可重放、按序持久化的日志型消息通道。','可回放的有序日志流。','理解事件回放。','Kafka topic 即流。',"['Log','Offset','Replay']"),

 # 算法与数据结构
 ('algo-segment-tree','Segment Tree','线段树','算法与数据结构','以树维护区间，支持区间查询与单点更新的结构。','能快速查区间答案的树。','理解区间统计。','区间和最值。',"['Fenwick Tree','Range Query','Tree']"),
 ('algo-fenwick','Fenwick Tree','树状数组','算法与数据结构','用低位技巧维护前缀和，区间求和比线段树更省空间。','查前缀和的轻量树。','理解前缀统计。','单点改、区间和。',"['Segment Tree','Prefix Sum','BIT']"),
 ('algo-redblack','Red-Black Tree','红黑树','算法与数据结构','自平衡二叉搜索树，约束红黑属性保证近似平衡。','带颜色约束的平衡 BST。','理解有序结构。','C++ map 底层。',"['AVL Tree','Binary Search Tree','Rotation']"),
 ('algo-avl','AVL Tree','AVL 树','算法与数据结构','严格保持左右子树高度差不超过 1 的自平衡 BST。','最严平衡要求的 BST。','理解平衡树。','旋转保持平衡。',"['Red-Black Tree','Binary Search Tree','Height']"),
 ('algo-radix','Radix Sort','基数排序','算法与数据结构','按位从低到高分桶的稳定排序，适合定长整数。','按位分桶排整数。','理解线性排序。',' LSD 到 MSD。',"['Counting Sort','Stable Sort','Bucket']"),
 ('algo-counting','Counting Sort','计数排序','算法与数据结构','以键值频次数组实现的非比较线性排序。','数每个值出现几次来排。','理解线性排序。','整数范围小适用。',"['Radix Sort','Bucket','Linear Time']"),
 ('algo-suffix','Suffix Array','后缀数组','算法与数据结构','将字符串所有后缀排序后的数组，用于子串检索。','把所有后缀排好序。','理解字符串处理。','配合 LCP 查模式。',"['String','Pattern Matching','LCP']"),
 ('algo-kmp','KMP','KMP 匹配','算法与数据结构','利用失配函数避免回退的线性时间字符串匹配算法。','失配时不从头再比。','理解模式匹配。','next 数组跳。',"['String','Pattern Matching','Automaton']"),

 # 设计模式
 ('dp-chain','Chain of Responsibility','责任链模式','设计模式','把请求沿处理者链传递，直到有人处理。','一个个过，谁行谁接。','理解解耦处理。','日志级别过滤器。',"['Handler','Pipeline','Filter']"),
 ('dp-memento','Memento','备忘录模式','设计模式','在不暴露内部的前提下捕获并恢复对象状态。','把状态存个快照可回退。','理解状态存档。','编辑器撤销。',"['Command','State','Snapshot']"),
 ('dp-visitor','Visitor','访问者模式','设计模式','把对元素的操作抽出来，便于在不改结构下加新操作。','操作外置、结构不动。','理解双分派。','AST 多种遍历。',"['Double Dispatch','Composite','Operation']"),
 ('dp-interpreter','Interpreter','解释器模式','设计模式','为文法定义表示并用解释器解释句子。','给一门小语言写解释器。','理解 DSL。','正则引擎雏形。',"['Grammar','AST','Parser']"),
 ('dp-prototype','Prototype','原型模式','设计模式','通过复制原型对象创建新对象，避开昂贵构造。','照着一个样品复制。','理解克隆创建。','clone 深拷贝。',"['Clone','Factory','Copy']"),
 ('dp-bridge','Bridge','桥接模式','设计模式','把抽象与实现分离，使两者可独立变化。','抽象和实现各自发展。','理解多维变化。','形状与颜色两维。',"['Abstraction','Implementation','Composition']"),
 ('dp-composite','Composite','组合模式','设计模式','让单个对象与组合对象以一致方式被处理。','单个和一堆一视同仁。','理解树形结构。','菜单含子菜单。',"['Tree','Recursion','Container']"),
 ('dp-facade','Facade','外观模式','设计模式','为复杂子系统提供统一简单入口。','给一堆复杂接口包个门面。','理解简化调用。','SDK 统一入口。',"['Wrapper','Abstraction','Subsystem']"),

 # 本地部署
 ('local-systemd','systemd','系统守护','本地部署','Linux 主流初始化与系统服务管理系统，以 unit 描述。','管开机启动和服务的管家。','理解服务管理。','enable 开机自启。',"['Service','Daemon','Init']"),
 ('local-supervisor','Supervisor','进程监管','本地部署','用 Python 写的进程管理工具，自动拉起崩溃进程。','盯着进程挂了就重启。','理解进程保活。','托管 gunicorn。',"['Process','Daemon','Restart']"),
 ('local-cron','Cron','定时任务','本地部署','按时间表达式周期性执行命令的守护进程。','到点自动跑任务。','理解定时调度。','0 2 * * * 备份。',"['Schedule','Job','Daemon']"),
 ('local-chroot','Chroot','改变根目录','本地部署','将进程的根目录切换到指定目录，形成受限视图。','把进程关进目录小黑屋。','理解轻量隔离。','chroot 跑服务。',"['Isolation','Jail','Sandbox']"),
 ('local-pkgmgr','Package Manager','包管理器','本地部署','统一安装、升级、卸载软件及其依赖的系统工具。','一键装软件的管家。','理解依赖管理。','apt/yum/dnf。',"['Dependency','Repository','Upgrade']"),
 ('local-service-unit','Service Unit','服务单元','本地部署','systemd 中描述一个服务的配置文件，定义启动与依赖。','告诉 systemd 怎么跑服务。','理解单元配置。','.service 文件。',"['systemd','Daemon','Restart']"),

 # 云端部署
 ('cloud-helm','Helm','舵轮包管理','云端部署','Kubernetes 的包管理器，用 chart 模板化部署。','给 K8s 用的安装包。','理解 K8s 部署。','helm install 一套应用。',"['Kubernetes','Chart','Template']"),
 ('cloud-configmap','ConfigMap','配置映射','云端部署','把非机密配置以键值存入集群、注入容器的资源。','把配置从镜像里拿出来。','理解配置外置。','挂载为环境变量。',"['Secret','Kubernetes','Configuration']"),
 ('cloud-secret-k8s','Secret','密钥对象','云端部署','存储密码、令牌等敏感数据的 K8s 资源，base64 编码。','存机密的地方。','理解敏感配置。','挂载证书文件。',"['ConfigMap','Encryption','Kubernetes']"),
 ('cloud-statefulset','StatefulSet','有状态集','云端部署','为有状态应用提供稳定网络标识与持久存储的 K8s 工作负载。','给有状态应用稳身份。','理解有状态编排。','数据库主从名稳定。',"['Pod','Persistent Volume','Kubernetes']"),
 ('cloud-daemonset','DaemonSet','守护进程集','云端部署','保证每个节点都运行一个副本的 K8s 工作负载。','每台机器都跑一份。','理解节点级服务。','日志采集 agent。',"['Pod','Node','Kubernetes']"),
 ('cloud-namespace-k8s','Namespace','命名空间','云端部署','在集群内做资源与权限逻辑隔离的单元。','集群里划的一块自留地。','理解多租户。','dev/test/prod 分开。',"['Kubernetes','Quota','Isolation']"),
 ('cloud-servicemesh','Service Mesh','服务网格','云端部署','以 sidecar 接管服务间通信、统一治理流量的基础设施层。','给服务通信统一加层管家。','理解流量治理。','mTLS、重试、限流。',"['Sidecar','Proxy','Traffic']"),

 # DevOps
 ('devops-ansible','Ansible','自动化配置','DevOps','基于 SSH 与声明式剧本的无代理配置管理工具。','用剧本批量配服务器。','理解配置即代码。','playbook 装环境。',"['Configuration','Idempotent','SSH']"),
 ('devops-argocd','ArgoCD','声明式 CD','DevOps','基于 GitOps 的 Kubernetes 持续部署控制器。','看 Git 自动同步集群。','理解 GitOps 落地。','UI 看同步状态。',"['GitOps','Kubernetes','Sync']"),
 ('devops-jenkins','Jenkins','持续集成','DevOps','以插件化流水线著称的老牌自动化构建服务器。','搭流水线的老牌工具。','理解 CI 编排。','Jenkinsfile 定义。',"['Pipeline','CI','Build']"),
 ('devops-actions','GitHub Actions','GitHub 动作','DevOps','与仓库深度集成的 CI/CD 工作流服务。','仓库里直接跑的 CI。','理解托管 CI。','on: push 触发。',"['Workflow','CI/CD','Runner']"),
 ('devops-chaos','Chaos Engineering','混沌工程','DevOps','主动注入故障以验证系统韧性的实践。','故意搞破坏测抗压。','理解韧性验证。','随机杀 Pod。',"['Resilience','Fault Injection','Reliability']"),
 ('devops-immutable','Immutable Infrastructure','不可变基础设施','DevOps','部署后不修改，更新即替换新实例的理念。','上线就不动，要改就换新的。','理解可重现部署。','镜像替代改配置。',"['Image','Reproducibility','Cattle']"),

 # 可观测性
 ('obs-metric','Metric','指标','可观测性','对系统状态的数值化采样，如计数器、直方图。','系统的数字体检表。','理解量化监控。','QPS、错误率。',"['Prometheus','Time Series','Alert']"),
 ('obs-log-agg','Log Aggregation','日志聚合','可观测性','集中收集、索引与检索分散在各处的日志。','把各处日志汇到一起查。','理解排障检索。','ELK 栈。',"['Logging','Index','Search']"),
 ('obs-sli','Service Level Indicator','服务等级指标','可观测性','直接衡量用户体验的量化指标，如延迟、成功率。','用户体验的硬指标。','理解 SLO 基础。','成功率即 SLI。',"['SLO','Error Budget','Metric']"),
 ('obs-error-budget','Error Budget','错误预算','可观测性','在 SLO 目标下允许的失败额度，用尽则冻结变更。','允许的出错额度。','理解发布闸门。','预算耗尽停发版。',"['SLO','SLI','Release']"),
 ('obs-dashboard','Dashboard','仪表盘','可观测性','把关键指标可视化聚合的看板，便于一眼掌握状态。','一眼看清系统的看板。','理解态势感知。','Grafana 面板。',"['Metric','Visualization','Alert']"),
 ('obs-alertmgr','Alertmanager','告警管理','可观测性','对告警做去重、分组、静默与路由的组件。','管告警往哪发。','理解告警治理。','静默夜间低优。',"['Alert','Routing','Silence']"),

 # 测试
 ('test-mutation','Mutation Testing','变异测试','测试','故意改代码制造缺陷，检验测试能否捕获以评估质量。','改坏代码看测试抓不抓得到。','理解测试有效性。','生还变异说明测试弱。',"['Coverage','Test Quality','Fault']"),
 ('test-e2e','End-to-End Test','端到端测试','测试','模拟真实用户走通完整链路的测试。','从登录到下单全走一遍。','理解业务闭环。','Playwright 脚本。',"['Integration Test','UI Test','User Flow']"),
 ('test-integration','Integration Test','集成测试','测试','验证多模块协作与接口对接的测试。','测多个模块合起来对不对。','理解协作正确。','服务间调用验证。',"['Unit Test','Contract','E2E Test']"),
 ('test-double','Test Double','测试替身','测试','在测试中替代真实依赖的统称，含 stub/mock/fake。','测试里顶替真依赖的替身。','理解隔离测试。','数据库换内存版。',"['Mock','Stub','Fake']"),
 ('test-mock','Mock Object','Mock 对象','测试','预设期望与行为、用于验证交互的测试替身。','替身还检查你有没有调它。','理解交互验证。','断言调用次数。',"['Stub','Test Double','Expectation']"),
 ('test-pyramid','Test Pyramid','测试金字塔','测试','以大量单测、少量集成、极少 e2e 构成的健康测试分布。','底层多上层少的测试结构。','理解测试投入。','别倒金字塔。',"['Unit Test','E2E Test','Coverage']"),
 ('test-chaos','Chaos Testing','混沌测试','测试','在测试中注入故障以验证系统韧性。','测的时候故意搞坏。','理解容错。','断网测降级。',"['Chaos Engineering','Resilience','Fault']"),
 ('test-load','Load Testing','负载测试','测试','在预期或峰值负载下检验系统表现的测试。','模拟真实流量压一压。','理解容量规划。','逐步加压看拐点。',"['Stress Testing','Throughput','Latency']"),

 # 性能优化
 ('perf-jit','Just-In-Time Compilation','即时编译','性能优化','运行时把字节码编译为机器码以提速的技术。','跑的时候现编译提速。','理解运行时加速。','V8 JIT。',"['AOT','Interpreter','Hot Path']"),
 ('perf-aot','Ahead-Of-Time Compilation','提前编译','性能优化','在构建期就把代码编译为机器码，启动快但体积大。','先编译好再发布。','理解启动优化。','原生 App 即用 AOT。',"['JIT','Build','Startup']"),
 ('perf-connpool','Connection Pool','连接池','性能优化','预先建立并复用连接，避免频繁建连开销。','连好的连接放着复用。','理解连接成本。','DB 连接池。',"['Batching','Throughput','Resource']"),
 ('perf-p99','P99 Latency','P99 延迟','性能优化','99% 请求的延迟上限，反映长尾体验。','最慢那 1% 有多慢。','理解长尾。','P99 优于平均值。',"['Latency','Tail Latency','SLA']"),
 ('perf-objpool','Object Pool','对象池','性能优化','复用对象实例避免频繁分配与 GC 的模式。','用过对象回收再发。','理解 GC 优化。','游戏子弹池。',"['Garbage Collection','Batching','Allocation']"),
 ('perf-tail','Tail Latency','长尾延迟','性能优化','少数极慢请求显著拉高整体体验的延迟现象。','个别超慢请求拖后腿。','理解体验公平。','尾延迟靠缓存压。',"['P99 Latency','Latency','Caching']"),

 # 架构模式
 ('arch-event-sourcing','Event Sourcing','事件溯源','架构模式','以不可变事件序列作为状态唯一来源，可回放重建。','状态由一串事件推导。','理解审计与回放。','账户流水即真相。',"['CQRS','Domain Event','Replay']"),
 ('arch-saga','Saga','Saga 模式','架构模式','以一系列本地事务加补偿操作实现跨服务最终一致。','分布式里一步步提交可回退。','理解分布式事务。','下单跨服务补偿。',"['Compensation','Distributed Transaction','CQRS']"),
 ('arch-circuit-breaker','Circuit Breaker','熔断器','架构模式','在失败率过高时快速熔断，避免雪崩并给依赖恢复时间。','坏了就先断，别一直砸。','理解故障隔离。','半开试探恢复。',"['Bulkhead','Timeout','Resilience']"),
 ('arch-acl','Anti-Corruption Layer','防腐层','架构模式','在新旧系统间加适配层，隔离外来模型污染。','挡住外部烂模型污染内部。','理解边界保护。','适配遗留系统。',"['Adapter','Bounded Context','Integration']"),
 ('arch-bff','Backend for Frontend','面向前端的后端','架构模式','为特定前端定制的聚合层，隔离多端差异。','给某前端专门定制的后端。','理解多端聚合。','Web 与 App 各一个。',"['API Gateway','Aggregation','Client']"),
 ('arch-outbox','Outbox','发件箱模式','架构模式','先把事件写入本地表再异步投递，保证不丢且不重。','先落库再异步发出去。','理解可靠事件。','事务内写 outbox。',"['Eventual Consistency','CDC','Reliability']"),
 ('arch-ambassador','Ambassador','大使模式','架构模式','为远程服务调用提供代理，统一处理重试、熔断等横切关注。','给远程调用配个代言人。','理解调用治理。','sidecar 做 ambassador。',"['Sidecar','Proxy','Resilience']"),

 # AI (补充少量未覆盖)
 ('ml-loss','Loss Function','损失函数','AI','度量模型预测与真实差距、用于驱动优化的目标。','模型离正确答案差多少。','理解训练目标。','交叉熵算分类损失。',"['Gradient Descent','Overfitting','Training']"),
 ('ml-regularization','Regularization','正则化','AI','在损失中加约束抑制过拟合，如 L1/L2、Dropout。','给模型加紧箍咒防死记。','理解泛化。','weight decay 限权重。',"['Overfitting','Dropout','L2']"),
 ('ml-embed-space','Vector Database','向量数据库','AI','专门存储与检索高维向量的数据库，支撑语义搜索。','专门管向量的数据库。','理解语义检索。','余弦相似度召回。',"['Embedding','Similarity','RAG']"),
 ('ml-token','Token','词元','AI','模型处理文本的最小单元，计费与上下文以 token 计。','模型眼里的文本最小块。','理解用量与限制。','一次请求多少 token。',"['Tokenization','Context Window','LLM']"),
]

kept = []
dropped = 0
for (i,e,z,cat,pro,plain,purpose,scene,rel) in C:
    if e.strip().lower() in existing_en or z.strip() in existing_zh:
        dropped += 1
        continue
    kept.append((i,e,z,cat,pro,plain,purpose,scene,rel))

out = []
out.append("import type { Term } from '../types'")
out.append("")
out.append("// seed-47：缺失项补录（由 gen_seed47.py 自动筛选未覆盖术语）")
out.append("")
out.append("export const seed47: Term[] = [")
for (i,e,z,cat,pro,plain,purpose,scene,rel) in kept:
    out.append("  {")
    out.append(f"    id: '{i}',")
    out.append(f"    en: '{e}',")
    out.append(f"    zh: '{z}',")
    out.append(f"    category: '{cat}',")
    out.append(f"    pro: '{pro}',")
    out.append(f"    plain: '{plain}',")
    out.append(f"    purpose: '{purpose}',")
    out.append(f"    scene: '{scene}',")
    out.append(f"    related: {rel},")
    out.append("  },")
out.append("]")
open('src/data/seed-47.ts','w',encoding='utf-8').write("\n".join(out)+"\n")
print(f"kept={len(kept)} dropped={dropped} total_candidates={len(C)}")
