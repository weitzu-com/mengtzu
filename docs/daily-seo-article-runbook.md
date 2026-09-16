# 每日 SEO 文章例行任务（GSC 驱动 · Grok 配图）

首次建立：2026-09-16

## 0. 第一性原理

搜索流量只来自三件事：**有人在搜（需求）**、**我们的页面能被理解为答案（相关）**、**搜索引擎愿意把我们排在前面（信任）**。
Google Search Console（GSC）是唯一能直接告诉我们“有人在搜什么、我们出现在哪、为什么没被点”的数据源，所以每天的选题必须从 GSC 出发，而不是从灵感出发。

每天一篇文章要解决的只有一个问题：**把一个已经有展示、但没有被专门页面承接的搜索意图，写成一篇能被直接引用的页面。**

## 1. 依赖的密钥（Cloud Agent → Secrets）

| 变量 | 用途 | 状态 |
| --- | --- | --- |
| `GSC_SERVICE_ACCOUNT_JSON` | Google 服务账号 JSON（原文 / base64 / 文件路径），需在 Search Console 把该服务账号邮箱添加为 `sc-domain:mengtzu.com` 的用户（Full 或 Restricted 均可） | 待配置 |
| `GSC_SITE_URL` | 默认 `sc-domain:mengtzu.com`，一般不用改 | 可选 |
| `XAI_API_KEY` | xAI API Key，用于 Grok Imagine 生图（console.x.ai） | 待配置 |
| `XAI_IMAGE_MODEL` | 默认 `grok-imagine-image-2.0`（2K、medium 质量） | 可选 |

没有 `GSC_SERVICE_ACCOUNT_JSON` 时，可以把 GSC 界面导出的 CSV（Queries / Pages / Dates）放到一个目录，用 `--csv-dir` 跑同样的分析。

## 2. 每日流程（约 6 步）

```bash
# 1) 拉取最近 90 天 GSC 数据并生成机会简报
npm run gsc:fetch                       # 或 npm run gsc:fetch -- --csv-dir /path/to/export
#    → reports/gsc/<end-date>/summary.md, summary.json, raw-*.json
#    → reports/gsc/latest-summary.md（选题就看这个）

# 2) 选题：读 latest-summary.md 的 "Article candidates"、"Striking distance"、
#    "High impressions, low CTR"、"Queries landing on passage pages" 四个表

# 3) 写文章：新建 content/articles/<slug>.json（结构见 §4），
#    并在 content/articles/index.ts 里 import 一行

# 4) 生图：所有插图必须由 Grok 生成
npm run images:grok -- --article <slug>
#    → public/images/articles/<slug>/*.jpg|png，并把 JSON 中 status 改为 ready

# 5) 校验 + 构建 + 回归
npm run articles:check && npm run lint && npm test

# 6) 提交、推送、开 PR（每天一个分支：cursor/daily-article-YYYY-MM-DD-xxxx）
```

## 3. 选题规则（按优先级）

1. **Article candidates**：脚本已按 `展示量 × (1 − CTR) × 排名系数 × 意图错位系数` 打分，并排除已有文章覆盖的关键词。默认取第一名，除非它明显应该由现有 hub 页承接（这时改去优化 hub 页的 title/description，而不是新写文章）。
2. **Queries landing on passage pages**：搜索意图比章句页更宽（如“孟子性善论”落在 6A.6），说明缺一篇主题文章。
3. **Striking distance（排名 4–20）**：已有相关性，缺深度；新文章要内链回现有承接页，形成簇。
4. **High impressions, low CTR**：先改现有页面 title/description；只有意图确实无人承接时才写新文。
5. 同一主题簇（bucket）连续两天不重复；一周内中英文侧重轮换（zh 侧重 3 天、en 侧重 3 天、1 天补短板）。
6. 没有任何 GSC 数据时（密钥缺失、API 报错），才允许用站内证据（四个主题页的 entryTerms、章句页 SEO 标题、`reports/seo-pdca-*.md` 里的目标词）选题，并在文章 JSON 的 `evidence` 字段写明原因。

## 4. 文章 JSON 结构与质量门槛

文件：`content/articles/<slug>.json`（slug 小写 kebab-case，英文，含核心关键词）。字段见 `app/lib/articles.ts` 中的 `Article` 类型；`npm run articles:check` 与构建时会强制校验：

- `keywords` ≥ 3（中英混合，供 GSC 脚本判断“已覆盖”）
- `targetQueries.zh / en` 各 3–6 条真实搜索句式
- `zh.description` ≥ 50 字；`en.title` ≤ 60 字符；`en.description` ≤ 160 字符
- `blocks` ≥ 4，其中 **图片块 ≥ 2**（首图 + 至少一张正文图），支持 `heading / paragraph / quote / list / callout / image`
- 第一个正文块之后必须有 `callout`（一句话直接回答）
- `faq` ≥ 2（会输出 FAQPage 结构化数据）
- `relatedLinks` ≥ 1，且至少一条回到具体章句页 `/books/<book>/<passage>`、一条回到主题页 `/principles/<slug>`
- 引文块 `quote` 必须给出 `cite` 与站内 `href`，原文以 `public/data/mencius.json` 为准，不自行改写古文
- 中英文是**配对写作**，不是翻译；各自服务各自语言的搜索意图，但事实与出处一致
- 篇幅：中文 1500–2500 字，英文 1000–1800 词

## 5. 配图标准（Grok Imagine）

- 模型：`grok-imagine-image-2.0`，`resolution: 2k`，`quality: medium`，`response_format: b64_json`（脚本已固定）
- 每张图在 JSON 里先写好 `prompt`（英文，80–160 词，写清场景、人物、光线、构图、要表达的章句）、`aspectRatio`（首图 `16:9`，正文 `3:2` 或 `4:3`）、中英 `alt` 与 `caption`
- 脚本会自动追加统一风格后缀（水墨 + 矿物颜料、宣纸暖色、无文字无水印无现代物件），保证全站视觉一致
- 生成后人工快速看一眼：有明显肢体错误、文字、水印或与章句无关的，`--force --only <key>` 重生成
- 页面只渲染 `status: "ready"` 的图；`pending` 的图不会出现在 HTML 中，因此**没配好 `XAI_API_KEY` 时文章可以先发布文字版，图片补上后再提交一次**
- 页面底部自动标注“插图由 Grok 生成，属于示意性艺术再现”

## 6. 例行任务本身

Cloud Agent 内已注册 `subscribe_timer`（名称 `daily-seo-article`，cron `0 1 * * *`，即北京时间每天 09:00）。它会向本会话投递一条提示词，要求 agent 按本文 §2 执行一遍并开 PR。

如需修改频率或提示词：先 `unsubscribe` 再重新 `subscribe_timer`（同名 timer 会去重并保留旧配置）。

如果希望不依赖单个 agent 会话，可在 Cursor Dashboard 创建 Automation，提示词直接引用本文件路径：`docs/daily-seo-article-runbook.md`。

## 7. 每周复盘（周一）

- 用 `reports/gsc/latest-summary.md` 对比上周：新文章是否开始有展示、落地页是否从章句页迁移到文章页
- 有展示无点击的文章：改 `title` / `description` / 首屏 callout
- 连续两周无展示的主题簇：暂停该簇，回到候选表重新选
- 把结论追加到 `reports/seo-pdca-*.md`
