# mengtzu.com SEO 完整审计报告（Thursday, August 20, 2026）

审计对象：`https://mengtzu.com`、`https://www.mengtzu.com`  
代码仓库：`https://github.com/weitzu-com/mengtzu`  
部署环境：Vercel  
当前生产仓库 HEAD：`f259d41455ca1662dc8f404f0af00de6cc8ea1da`

## Thursday, August 20, 2026 深夜最新状态覆盖说明

以下状态已覆盖本文后续所有“待上线”判断：

- 生产主分支已推进到 `467883e`
- `35` 条新增章句解释层已上线生产
- 生产站章句解释层已达到 `260 / 260 = 100%`
- 最新证据：
  - `reports/evidence/live-crawl-post-467883e-2026-08-20.json`
  - `reports/evidence/metadata-match-post-467883e-2026-08-20.md`
- 最新验证结论：
  - sitemap `572 / 572` 页面返回 `200`
  - title / description / canonical / hreflang / H1 / JSON-LD / 内部坏链异常仍为 `0`
  - 新增批次 `70 / 70` 个中英文页面的 `<title>` 与 `<meta name="description">` 已与本地验证构建逐页一致

因此，本文后续凡涉及“生产仍是 `225 / 260`”“新增解释层尚未上线”之处，都应视为 Thursday, August 20, 2026 当晚更早时点的历史状态，而不是当前生产现状。

## 一、结论先行

从第一性原理看，一个站点的 SEO 先后顺序只有三层：

1. 先确认搜索引擎能不能稳定抓到唯一版本；
2. 再确认页面能不能被稳定理解，而不是被重复、残缺或错误信号干扰；
3. 最后才看这个站点有没有足够的主题价值去竞争真实搜索需求。

按这个顺序复核，`mengtzu.com` 当前的判断是：

- 技术底座：合格
- 机器可理解性：合格
- 主题覆盖深度：中等偏弱
- 搜索可见度：弱
- 外部权威与监控闭环：弱

因此，这个站点当前已经不是“基础技术 SEO 有明显硬伤”的站，而是“技术问题基本清掉，但增长型 SEO 资产还不够”的站。

## 一点五、Thursday, August 20, 2026 当晚追加状态（覆盖下文早前判断）

以下事项发生在本报告早前版本之后，并已经推送、部署、抽样核验：

- 推送提交：`f73ea42`
- 本地生产构建验证：`npm test` 通过，`7 / 7` 测试通过
- 新增双语高意图入口页：
  - `https://mengtzu.com/zh/quotes`
  - `https://mengtzu.com/en/quotes`
- 强化既有主题入口页：
  - `https://mengtzu.com/zh/about` / `https://mengtzu.com/en/about`
  - `https://mengtzu.com/zh/principles` / `https://mengtzu.com/en/principles`
- 线上抽样核验结果：
  - `/zh/quotes`、`/en/quotes` 已返回 `200`
  - quotes 页 canonical、生效中的 `CollectionPage` / `FAQPage`、以及原文章句内链已命中
  - sitemap 已包含 `/zh/quotes` 与 `/en/quotes`
  - `llms.txt` 已包含 About Mencius / 孟子简介 与 Quotes / 名言与出处入口

因此：

- 下文 F03 “quotes 枢纽页缺失” 只代表 Thursday, August 20, 2026 当天更早时点的真实状态；
- 它在 Thursday, August 20, 2026 当晚已经闭环，不应再视为当前生产站缺陷。

### Thursday, August 20, 2026 当晚第二次追加状态

在高意图入口页上线后，又完成了一轮章句解释层补强并部署：

- 推送提交：`dc4c49b`
- 新增人工解释层：`8` 条
  - `孟子 1B.10`
  - `孟子 1B.11`
  - `孟子 1B.12`
  - `孟子 1B.13`
  - `孟子 3B.5`
  - `孟子 4B.4`
  - `孟子 4B.6`
  - `孟子 7A.19`
- 覆盖率从 `168 / 260 = 64.6%` 提高到 `176 / 260 = 67.7%`
- 未补强章句从 `92` 降到 `84`
- 本地生产验证：`npm test` 通过，`7 / 7` 测试通过
- 生产抽样核验：
  - `https://mengtzu.com/zh/books/liang-hui-wang-ii/1b-10`
  - `https://mengtzu.com/en/books/liang-hui-wang-ii/1b-10`
  - `https://mengtzu.com/zh/books/teng-wen-gong-ii/3b-5`
  - `https://mengtzu.com/en/books/teng-wen-gong-ii/3b-5`
  - `https://mengtzu.com/zh/books/jin-xin-i/7a-19`
  - `https://mengtzu.com/en/books/jin-xin-i/7a-19`
  均已命中新 title、description、canonical 与 FAQ 结构化数据。

### Thursday, August 20, 2026 当晚第三次追加状态

随后又完成了第二轮修身/方法/教化相关章句补强，并修正了英文章句页 meta description 的生成优先级：

- 推送提交：
  - `b624f3c`
  - `f259d41`
- 新增人工解释层：`8` 条
  - `孟子 2A.9`
  - `孟子 3B.1`
  - `孟子 4A.21`
  - `孟子 4A.22`
  - `孟子 4B.20`
  - `孟子 7A.10`
  - `孟子 7A.12`
  - `孟子 7A.14`
- 覆盖率从 `176 / 260 = 67.7%` 提高到 `184 / 260 = 70.8%`
- 未补强章句从 `84` 降到 `76`
- 本地生产验证：
  - `npm test` 通过
  - `7 / 7` 测试通过
- 生产抽样核验：
  - `https://mengtzu.com/en/books/gong-sun-chou-i/2a-9`
  - `https://mengtzu.com/en/books/li-lou-ii/4b-20`
  - `https://mengtzu.com/en/books/jin-xin-i/7a-14`
  已命中新 title 与编辑层 description；
  - `https://mengtzu.com/en/books/gao-zi-i/6a-1`
  - `https://mengtzu.com/en/books/liang-hui-wang-ii/1b-6`
  已确认英文 meta description 长度压回 `<= 160`。

### Thursday, August 20, 2026 深夜追加状态（先在本地验证，后已部署）

在上述三轮已上线修复之后，工作区又继续完成了三轮高价值章句解释层补强：

- 新增人工解释层：`24` 条
  - 第一轮：`孟子 1B.9`、`2B.8`、`3B.8`、`3B.9`、`6B.4`、`7A.23`、`7A.29`、`7A.40`
  - 第二轮：`孟子 1B.15`、`2B.10`、`2B.12`、`3B.7`、`5B.1`、`5B.3`、`7A.30`、`7A.41`
  - 第三轮：`孟子 4A.7`、`4B.29`、`4B.33`、`5B.4`、`7B.5`、`7B.9`、`7B.12`、`7B.15`
- 章句解释层覆盖率从 `184 / 260 = 70.8%` 提高到 `216 / 260 = 83.1%`
- 未补强章句从 `76` 降到 `44`
- 最新本地生产验证：
  - `npm test` 通过
  - `9 / 9` 测试通过

这 `24` 条新增解释层最初只在本地代码、静态构建与测试结果中成立；后续已随同 Thursday, August 20, 2026 深夜推送一起部署到生产。

### Thursday, August 20, 2026 深夜第二次追加状态（先在本地验证，后已部署）

在上述 `24` 条本地补强之后，工作区又继续完成了一轮高引用短章补强：

- 新增人工解释层：`9` 条
  - `孟子 4B.10`
  - `孟子 4B.31`
  - `孟子 4B.32`
  - `孟子 7A.28`
  - `孟子 7A.31`
  - `孟子 7A.34`
  - `孟子 7A.36`
  - `孟子 7B.6`
  - `孟子 7B.11`
- 章句解释层覆盖率从 `216 / 260 = 83.1%` 提高到 `225 / 260 = 86.5%`
- 未补强章句从 `44` 降到 `35`
- 最新本地生产验证：
  - `npm test` 通过
  - `9 / 9` 测试通过

这 `9` 条新增解释层同样先在本地代码、静态构建与测试结果中成立；后续已随同 Thursday, August 20, 2026 深夜推送一起部署到生产。

### Thursday, August 20, 2026 深夜第三次追加状态（已推送并上线）

随后已将上述修复推送到 GitHub 主分支并触发生产部署：

- 推送提交：`d77f546`
- 推送结果：`main` 从 `f259d41` 更新到 `d77f546`
- 生产抽样核验：
  - `https://mengtzu.com/en/books/jin-xin-i/7a-31`
  - `https://mengtzu.com/en/books/jin-xin-ii/7b-11`
  - `https://mengtzu.com/zh/books/jin-xin-i/7a-31`
  - `https://mengtzu.com/en/books/li-lou-ii/4b-10`
  - `https://mengtzu.com/en/books/jin-xin-i/7a-36`
  - `https://mengtzu.com/zh/books/jin-xin-ii/7b-11`
  均已命中新 title / description / FAQ；
  - `https://mengtzu.com/en/about/opengraph-image`
  - `https://mengtzu.com/en/books/jin-xin-i/7a-36/opengraph-image`
  - `https://mengtzu.com/zh/books/jin-xin-ii/7b-11/opengraph-image`
  均已返回 `200` 与 `image/png`。

### Thursday, August 20, 2026 深夜第四次追加状态（已部署并全量复核）

在生产抽样核验之后，又对当前生产站重新跑了一轮全站 live crawl：

- 证据文件：`reports/evidence/live-crawl-post-push-2026-08-20.json`
- sitemap URL 数：`572`
- `572 / 572` 页面返回 `200`
- 抓取错误：`0`
- sitemap 内重定向：`0`
- 缺失 title / description / canonical / H1：全部 `0`
- canonical 错配：`0`
- hreflang 不完整：`0`
- 内部坏链：`0`
- 缺失 JSON-LD：`0`
- description 长度异常：`0`
- 中文 / 英文薄内容候选：`0`
- 新的响应时间统计：
  - 平均：`2424.7 ms`
  - 中位数：`2407.2 ms`
  - P75：`2536.9 ms`
  - P95：`2848.4 ms`
  - 最大值：`3528.0 ms`

## 二、本次报告使用的证据

本报告只引用 Thursday, August 20, 2026 当天可复核证据：

1. 线上 refresh crawl  
   `../reports/2026-08-20_mengtzu.com_SEO完整审计/evidence/full-crawl-refresh-2026-08-20.json`
2. 最新生产全站 live crawl 汇总  
   `reports/evidence/live-crawl-post-push-2026-08-20.json`
3. Lighthouse 样本  
   `../reports/2026-08-20_mengtzu.com_SEO完整审计/evidence/lighthouse-*.json`
4. Semrush 同日快照  
   `../reports/2026-08-20_mengtzu.com_SEO完整审计/evidence/semrush-summary.md`
5. Thursday, August 20, 2026 晚间线上 spot check
   - `https://mengtzu.com/` → `308` → `https://mengtzu.com/zh`
   - `https://www.mengtzu.com/` → `308` → `https://mengtzu.com/zh`
   - `https://mengtzu.com/robots.txt` → `200`
   - `https://mengtzu.com/sitemap.xml` → `200`
   - `https://mengtzu.com/zh/about` → `200`
   - `https://mengtzu.com/en/about` → `200`
   - `https://mengtzu.com/zh/quotes` → `200`
   - `https://mengtzu.com/en/quotes` → `200`
6. 本地生产构建验证
   - `npm test` 通过
   - `9 / 9` 测试通过
   - 当前工作区已完成额外 `35` 条章句解释层补强，已达到 `260 / 260` 全覆盖，且全部通过本地静态构建与渲染回归
7. Thursday, August 20, 2026 深夜推送后的生产抽样核验  
   `reports/evidence/live-spot-check-post-push-2026-08-20.json`

关于 Semrush：

- Thursday, August 20, 2026 当前无法再次拉取实时 Semrush 审计结果，因为 API units 不足。
- 因此，报告中的 Semrush 数字只引用同日已保存快照，不冒充“刚刚刷新”的实时值。

## 三、当前已经确认闭环、不再构成主问题的项

### 1. 抓取与归一层

- 根路径归一正常：`/` 永久跳转到 `/zh`
- 主机归一正常：`www` 永久归一到 apex
- `robots.txt`、`sitemap.xml` 均可访问
- sitemap 当前包含 `572` 个 URL
- 部署后 live crawl 复核：
  - `572 / 572` URL 成功抓取
  - sitemap 内 `200` 以外页面：`0`
  - sitemap 内重定向 URL：`0`

这说明搜索引擎当前拿到的是单一、可抓取、可遍历的生产版本。

### 2. 页面机器可理解性层

部署后 live crawl 复核结果：

- 缺失 title：`0`
- 缺失 description：`0`
- 缺失 canonical：`0`
- canonical 错配：`0`
- 缺失 H1：`0`
- 多 H1：`0`
- 重复 title：`0`
- 重复 description：`0`
- 缺失 `hreflang="zh"`：`0`
- 缺失 `hreflang="en"`：`0`
- 缺失 `hreflang="x-default"`：`0`
- 中文过短 description：`0`
- 英文章句残缺 title：`0`
- 内部坏链：`0`

这部分结论很关键：站点目前已经不再处于“搜索引擎抓到了，但信号混乱”的阶段。

### 3. Lighthouse 样本

同日 Lighthouse 样本显示：

- 中文首页桌面 Performance：`96`
- 中文首页移动 Performance：`93`
- 英文首页移动 Performance：`96`
- 中文 principle 页移动 Performance：`98`
- 英文章句页移动 Performance：`97`
- 中文重型书页移动 Performance：`94`
- 所有样本 SEO 分数：`100`

这说明前端表现不是当前 SEO 的主阻断项。

## 四、当前仍然存在的 SEO 问题

### F01 · P1 · 自然搜索可见度仍然接近 0

证据：

- Semrush 同日快照：
  - US Organic keywords：`4`
  - Estimated organic traffic：`0`
  - HK：无域级自然搜索数据
- 当前已被识别的 US 关键词全部落在 `gaozi` 相关英文章句页。

判断：

这说明站点已经“可被索引”，但还没有形成稳定的主题权威。问题不在抓取，而在于：

- 搜索引擎只识别到极少数局部页面；
- 主站尚未被识别成关于 Mencius / 孟子 的强主题资源；
- 内容资产与真实搜索意图之间，还缺少足够强的主题入口页和稳定的外部信号。

### F02 · P1 · 章句解释层覆盖仍然不足

证据：

- 当前生产 `d77f546` 版本已覆盖 `225 / 260 = 86.5%`
- 当前工作区 `app/lib/passage-notes.ts` 已覆盖 `260 / 260 = 100%`
- 这 `35` 条新增解释层尚未全部上线到生产
- 站点面向搜索引擎输出的是中英双语章句页，共约 `520` 个 passage URL

判断：

这不是“页面字数少”这种机械问题，而是索引规模和内容深度没有完全匹配：

- 搜索引擎能看到很多章句 URL；
- 但不是所有章句页都具备足够清晰的阅读问题、直接回答、第一性原理解释和相关主题连接。

结果就是：当前公开站点仍有 `35` 个章句页缺少完整解释层，但这一缺口在工作区内已经补齐，剩下的是上线与复核问题。

### F03 · P2 · 外链画像弱且相关性差

证据：

- Semrush 同日快照：
  - Authority Score：`2`
  - Backlinks：`30`
  - Referring domains：`29`
- 样本链接主题大量偏向 SEO 服务、购买外链、DA/DR 提升等非主题相关来源
- `30` 个样本链接均指向首页

判断：

这不等于搜索引擎已经处罚站点，也不能仅凭第三方工具自动下“惩罚”结论。但它至少说明：

- 当前外部权威并不是围绕孟子、哲学、教育、汉学自然形成；
- 即使继续修技术和补内容，外部信号仍然会限制增长上限。

### F04 · P3 · 抓取响应偏慢，但当前不是主阻断

证据来自同日 refresh crawl：

- 平均响应：`2945.4 ms`
- 中位数：`2775.1 ms`
- P75：`3257.7 ms`
- P95：`4034.7 ms`
- 最大值：`6154.7 ms`

判断：

这说明爬虫侧抓取耗时偏高，但在当前 `570` URL 规模下，还没有表现成索引阻断。它更像是一个需要持续盯住的二级问题：

- 如果模板继续变重；
- 如果页面规模继续扩大；
- 如果后续引入更多动态逻辑；

那它会开始影响抓取效率。

## 五、历史问题与当前问题要分开看

Thursday, August 20, 2026 当天早些时候，refresh crawl 确实发现过以下真实问题：

- `https://mengtzu.com/zh/en/about` 与 `https://mengtzu.com/en/en/about` 两个内部坏链
- `45` 个中文页面 description 过短
- 一批英文章句 title 为残句

但这些项已经在同一天完成修复、重新部署，并在部署后全站 live crawl 中复核归零。

因此，今天继续把这些项当作“当前线上未解决问题”是不准确的。它们应当被记录为：

- 同日发现过；
- 同日修掉了；
- 同日复核归零。

## 六、优先级行动清单

### 0–2 天

1. 将当前工作区已验证的 `35` 条新增解释层部署到生产
2. 部署后重跑 live crawl：
   - 新增章句页 title / description / FAQ / canonical 已生效
   - 新增解释层页可被 sitemap 与内部链接稳定触达
   - `/zh/quotes`、`/en/quotes`、`/about`、`/principles` 与新增章句页之间内链联通

### 3–7 天

1. 开始从 GSC / Bing / GA4 看真实查询与索引反馈，而不是继续补缺失章句
2. 每个新增解释层至少包含：
   - 唯一 title / H1
   - 问题式切入
   - 直接回答
   - 第一性原理解释
   - 相关原则 / 相关章句双向内链
3. 建立核心主题枢纽页矩阵：
   - Who is Mencius
   - Mencius philosophy
   - Mencius on human nature
   - 孟子简介
   - 性善
   - 四端
   - 仁政
   - 孟子名言与出处

### 8–30 天

1. 优先争取真实主题相关引用，而不是数量型弱外链
2. 如果存在 Search Console 人工处置或异常链接证据，再决定是否需要 disavow
3. 持续追踪抓取响应时间，避免在扩页后演化成 crawl budget 问题

## 七、最终判断

如果只问一句：`mengtzu.com` 现在最大的 SEO 问题是什么？

答案不是 canonical，不是 hreflang，也不是 title 缺失。

真正的问题是：

这个站已经基本完成技术清障，但还没有把“可被索引”升级成“可争夺搜索需求”。当前最大的剩余缺口，是高意图主题页不够、解释层覆盖不够、外部权威不够。

## 八、相关文件

- 当前审计报告：`reports/seo-audit-2026-08-20-current.md`
- 部署后 live crawl 汇总：`reports/evidence/live-crawl-post-deploy-summary-2026-08-20.json`
- 同日 refresh crawl：`../reports/2026-08-20_mengtzu.com_SEO完整审计/evidence/full-crawl-refresh-2026-08-20.json`
- 同日 Semrush 摘要：`../reports/2026-08-20_mengtzu.com_SEO完整审计/evidence/semrush-summary.md`
- 同日旧版完整审计：`../reports/2026-08-20_mengtzu.com_SEO完整审计/mengtzu.com_SEO完整审计报告_2026-08-20.md`
