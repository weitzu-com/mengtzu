# mengtzu.com SEO 审计报告（第一性原理版，Thursday, August 20, 2026）

审计对象：`https://mengtzu.com`、`https://www.mengtzu.com`  
代码仓库：`https://github.com/weitzu-com/mengtzu`  
生产主分支：`main`  
生产 Git HEAD：`577af4f3130c5c77829afd7e6dd37a759837df0a`  
生产提交说明：`Optimize portrait delivery and cache policy`

## 0. Friday, August 21, 2026 最终生产状态覆盖说明

以下状态覆盖本文后续凡仍停留在 `467883e`、`7ff6986`、`38f40d2` 时点的描述：

- 当前生产主分支最新已推送并已上线提交：`577af4f`
- `production-repo` 当前 `HEAD = origin/main = 577af4f`
- `/books/[slug]` 已从重型整卷直出页，收敛为更轻的 book hub 页
- book hub 相关元描述长度异常已归零
- 章句详情页已进一步压缩 pinyin 标点空格冗余，并把 passage detail page 回归门槛从 `100000` 收紧到 `90000`
- GA4 骨架已从“仅注入脚本”升级为“显式记录 App Router 路由切换 page_view”
- 生产 SEO spot-check 已脚本化，减少每次上线后人工验证摩擦
- 首页 JSON-LD 已补 `dateModified`，最新 production spot check 已从 `6 / 7` HTML 页带 freshness 信号提升到 `7 / 7`
- 首页首屏孟子画像已由公共稳定路径收敛为带内容哈希的 Next 静态资源；生产已确认响应 `Cache-Control: public,max-age=31536000,immutable`
- 首屏图的响应式候选尺寸已收敛为实际布局需要的 `640 / 750 / 828 / 1080`，避免创建无用的更大优化缓存变体
- 最终生产全站 crawl 证据文件：
  - `reports/evidence/live-crawl-post-1a3beee-2026-08-20.json`
  - `reports/evidence/book-hub-size-optimization-2026-08-20.md`
  - `reports/evidence/passage-page-pinyin-budget-1a3beee-2026-08-20.md`
  - `reports/evidence/production-spot-check-6838005-2026-08-20.json`
  - `reports/evidence/production-spot-check-577af4f-2026-08-21.json`

最终生产 crawl 汇总结果：

- sitemap URL：`572`
- `572 / 572` 返回 `200`
- 抓取错误：`0`
- 缺失 title / description / canonical：全部 `0`
- hreflang 不完整：`0`
- 缺失 H1：`0`
- JSON-LD 无效 / 缺失：全部 `0`
- 内部坏链：`0`
- 薄内容候选：`0`
- description 长度异常：`0`
- 抓取时间：
  - 平均：`2414.1 ms`
  - 中位数：`2406.2 ms`
  - P75：`2480.9 ms`
  - P95：`2606.1 ms`
  - 最大：`2849.3 ms`

book hub 页体量优化的直接证据：

- `en/books/liang-hui-wang-ii.html`：`606,332` → `74,480` bytes
- `zh/books/liang-hui-wang-ii.html`：`548,346` → `70,823` bytes
- `en/books/jin-xin-i.html`：`511,677` → `145,389` bytes

因此，本文中凡把“整卷页 HTML 体量偏大”描述为当前主要问题的段落，都应理解为 Thursday, August 20, 2026 当天较早时点的诊断，不再代表当前最终生产状态。

## 1. 先说结论

从第一性原理看，SEO 只有三件事：

1. 搜索引擎是否能稳定抓到唯一版本；
2. 抓到之后是否能稳定理解页面主题与结构；
3. 理解之后，这个站是否真的具备争夺搜索需求的内容资产与外部权威。

按这个顺序复核，`mengtzu.com` 当前结论是：

- 技术抓取层：已基本合格
- 机器可理解层：已基本合格
- 增长层：仍然偏弱

所以，当前站点已经不是“技术 SEO 结构性故障”的问题，而是“技术地基已经清掉，但可见度、主题资产、外部权威、监控闭环还不够强”的问题。

## 2. 本次证据边界

### 2.1 真实使用到的证据

1. 生产全站 live crawl  
   `reports/evidence/live-crawl-post-1a3beee-2026-08-20.json`
2. 章句详情页 pinyin HTML 预算验证  
   `reports/evidence/passage-page-pinyin-budget-1a3beee-2026-08-20.md`
3. 最新生产 SEO spot check  
   `reports/evidence/production-spot-check-6838005-2026-08-20.json`
4. 新增解释层逐页元信息比对  
   `reports/evidence/metadata-match-post-467883e-2026-08-20.md`
5. 同日 Semrush 保存快照  
   `../reports/2026-08-20_mengtzu.com_SEO完整审计/evidence/semrush-summary.md`
6. GitHub 仓库事实
   - 仓库：`https://github.com/weitzu-com/mengtzu`
   - 默认分支：`main`
   - `origin/main` 当前等于 `577af4f`
7. 当前工作区本地构建回归
   - `npm test` 通过
   - `18 / 18` 测试通过
   - 当前静态页面数：`580`

### 2.2 Semrush 当前状态

本轮无法重新拉取实时 Semrush 数据，因为 API units 不足。需要访问 [https://www.semrush.com/mcp-access](https://www.semrush.com/mcp-access) 查看可用选项。

因此，报告中涉及 Semrush 的数字，只引用 Thursday, August 20, 2026 同日已保存快照，不冒充“刚刚刷新”的实时值。

### 2.3 Sites / Vercel / GitHub 的角色边界

- GitHub 是当前最可靠的代码事实来源：公开仓库、默认分支 `main`、最新已推送提交 `577af4f` 可核对。
- Vercel 是当前真实生产承载链路，但本地缺少 `.vercel/project.json`，且当前插件可见团队 `aipy` 下返回 `0` 个可见项目，所以 Vercel 插件不是这次审计的权威证据源；生产是否切到最新版本，仍以 live crawl 与现网 HTML 抽查为准。
- Sites 不是 `mengtzu.com` 当前生产托管链路，本地也没有 `.openai/hosting.json`。本次报告没有把 Sites 当成生产状态来源。

## 3. 当前生产站已经确认没有的 SEO 问题

生产全站 live crawl 结果：

- sitemap URL：`572`
- `572 / 572` 返回 `200`
- 抓取错误：`0`
- sitemap 内重定向：`0`
- 缺失 title：`0`
- 缺失 description：`0`
- 缺失 canonical：`0`
- canonical mismatch：`0`
- hreflang 不完整：`0`
- 缺失 H1：`0`
- 多 H1：`0`
- 缺失 JSON-LD：`0`
- JSON-LD 无效：`0`
- 坏内链：`0`
- 零内链 sitemap URL：`0`
- 薄内容候选：`0`
- title 长度异常：`0`
- description 长度异常：`0`
- 抓取均值：`2414.1 ms`
- 抓取 P95：`2606.1 ms`

这说明：当前生产站已经越过了“能抓到，但信号乱”的阶段。

另外，Thursday, August 20, 2026 的最小线上抽查也与上述结论一致：

- `https://mengtzu.com/` 最终落到 `https://mengtzu.com/zh`
- `https://www.mengtzu.com/` 最终落到 `https://mengtzu.com/zh`
- `https://mengtzu.com/robots.txt` 可访问
- `https://mengtzu.com/sitemap.xml` 可访问
- `/zh/about`、`/en/about`、`/zh/quotes`、`/en/quotes` 当前 title 与 canonical 正常
- 最新 production spot check 已确认：`7 / 7` HTML 页都带 canonical、hreflang、RSS autodiscovery、`sameAs` 与 `dateModified`
- `/en/books/liang-hui-wang-i/1a-7` 当前生产 pinyin 段长度为 `5,266`，与本地构建一致
- 首页已实际输出带哈希的首屏画像地址 `/_next/static/media/mengzi-kano-sansetsu.<hash>.jpg`；该静态资源生产响应为一年 immutable 缓存
- 新增 `35` 条解释层对应的 `70` 个中英文 passage 页面，线上 `<title>` 与 `<meta name="description">` 和本地验证构建 `0` 差异

## 4. 当前仍然存在的全部 SEO 问题

下面这部分才是当前真正需要管理的问题。

### F01 · P1 · 自然搜索可见度仍然接近 0

证据：

- Semrush 同日快照：
  - US Organic keywords：`4`
  - Estimated organic traffic：`0`
  - Domain rank：`22,934,392`
- HK 数据库没有可引用的域级自然搜索数据
- 当前已识别的 4 个 US 关键词都落在 `gaozi` 相关英文章句页，而不是核心主题页

判断：

站点已经“可被索引”，但还没有被识别为关于 Mencius / 孟子 的强主题资源。真正短板不在技术，而在主题权威和需求承接。

### F02 · P1 · 外链画像弱，而且主题相关性差

证据：

- Semrush 同日快照：
  - Authority Score：`2`
  - Backlinks：`30`
  - Referring domains：`29`
  - Follow / nofollow：`8 / 22`
- 抽样链接主题大量偏向 SEO 服务、买链、PBN、DA/DR 提升等非主题相关来源
- 样本链接几乎全部指向首页

判断：

这还不能直接等同于搜索引擎处罚，但已经足够说明：当前外部权威不是围绕孟子、哲学、教育、汉学自然形成的。这会限制增长上限。

### F03 · P1 · 搜索经营闭环缺失

证据：

- 当前没有可核对的 Google Search Console 数据
- 当前没有可核对的 Bing Webmaster 数据
- 当前没有可核对的 GA4 数据
- 因为缺少上述一手数据，当前只能看到“页面结构是否正确”，看不到：
  - 哪些页已索引但无展示
  - 哪些页有展示但点击率差
  - 哪些查询本应由主题页承接，却被章句页误承接

判断：

没有 GSC / Bing / GA4，就无法把 SEO 做成经营闭环。技术完成不等于增长可控。

### F04 · P3 · 抓取响应偏慢，当前不是硬伤，但需要盯住

证据：

- 生产全站 live crawl 响应时间：
  - 平均：`2414.1 ms`
  - 中位数：`2406.2 ms`
  - P75：`2480.9 ms`
  - P95：`2606.1 ms`
  - 最大值：`2849.3 ms`
- 根路径与 `www` 的即时抽查，也在 `4s+` 量级完成最终落地

判断：

当前它还没有表现成索引故障，但如果站点继续扩页、模版继续变重、或引入更多动态逻辑，它会开始侵蚀 crawl efficiency。

### F05 · P3 · 部署可观测性不足，放大 SEO 变更验证成本

证据：

- 本地缺少 `.vercel/project.json`
- Vercel 插件当前能看到团队 `aipy`，但返回 `0` 个可见项目
- 因此，本次只能依赖“GitHub 提交 + 线上抓取 + 现网抽查”来判断是否真的上线

判断：

这不是直接的 SEO 页面缺陷，但它是 SEO 运维问题：每次修复都要更慢地确认是否真正进入生产，会拖慢 PDCA。

## 5. 已修复但不要误判成当前问题的项

Thursday, August 20, 2026 同日早前出现过、但现在已经闭环归零的事项包括：

- 双重本地化坏链（如 `/zh/en/about`）
- 一批中文 description 过短
- 一批英文章句 title 残句
- 缺失 route-specific OG image 的详情页

这些问题在当前生产全站 live crawl 中都已归零，不应再算作“当前线上问题”。

另外，Thursday, August 20, 2026 当晚已经新闭环的事项包括：

- 章句解释层从生产 `225 / 260` 提升到生产 `260 / 260`
- `467883e` 对应新增 `35` 条解释层已经上线
- 对应 `70` 个中英文页面的生产 title / description 已与本地验证构建逐页一致
- `1a3beee` 对应章句页 pinyin HTML 压缩已经上线，`/en/books/liang-hui-wang-i/1a-7` 的生产 pinyin 段长度从 `5,586` 下降到 `5,266`

## 6. 优先级行动清单

### 0–2 天

1. 接入 Google Search Console、Bing Webmaster、GA4
2. 以当前 `572` 页、`260 / 260` 解释层为基线，开始记录真实索引、展示、点击
3. 继续用 production live crawl + 元信息逐页比对做每次上线后的复核

### 3–7 天

1. 优先观察哪些主题查询开始从长尾章句回流到 hub 页
2. 继续补性能与可观测性短板
3. 把外链建设从无关 SEO 域，转向哲学、教育、汉学相关真实引用页

### 8–30 天

1. 建立主题相关外链，而不是继续堆弱相关首页链接
2. 把重点增长词集中到主题页承接：
   - `Who is Mencius`
   - `Mencius philosophy`
   - `Mencius quotes`
   - `Mencius human nature`
   - `孟子是谁`
   - `孟子思想`
   - `孟子名言`
   - `性善`
   - `四端`
   - `仁政`
3. 持续跟踪抓取响应时间，避免整站扩张后演化成 crawl budget 问题

## 7. 最终判断

如果把问题压缩成一句话：

`mengtzu.com` 当前最大的 SEO 问题，已经不是 technical hygiene，而是 growth SEO。

更具体地说：

- 技术抓取层基本过关；
- 页面理解层基本过关；
- 但搜索可见度、主题权威、相关外链、监控闭环，仍然明显偏弱。

这才是当前阶段真正要解决的全部 SEO 问题。

## 8. 相关文件

- 本报告：`reports/seo-audit-2026-08-20-first-principles.md`
- 当前审计续写版：`reports/seo-audit-2026-08-20-current.md`
- 当前 PDCA：`reports/seo-pdca-2026-08-20.md`
- 最新生产 live crawl：`reports/evidence/live-crawl-post-1a3beee-2026-08-20.json`
- 最新生产 spot check：`reports/evidence/production-spot-check-6838005-2026-08-20.json`
- 最新生产 spot check：`reports/evidence/production-spot-check-577af4f-2026-08-21.json`
- 最新单章页体量验证：`reports/evidence/passage-page-pinyin-budget-1a3beee-2026-08-20.md`
- 最新元信息逐页比对：`reports/evidence/metadata-match-post-467883e-2026-08-20.md`
- Semrush 同日快照：`../reports/2026-08-20_mengtzu.com_SEO完整审计/evidence/semrush-summary.md`
