import { getPathLastUpdated } from "../lib/content-dates";
import {
  RSS_FEED_URL,
  SITE_URL,
  aboutContent,
  homeContent,
  localeMeta,
  localPath,
  principles,
  type Locale,
} from "../lib/site";

export const revalidate = 3600;

type FeedEntry = {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  updatedAt: string;
};

const staticHubEntries = [
  {
    path: "",
    zh: {
      title: localeMeta.zh.title,
      description: homeContent.zh.lead,
    },
    en: {
      title: localeMeta.en.title,
      description: homeContent.en.lead,
    },
  },
  {
    path: "/about",
    zh: {
      title: aboutContent.zh.title,
      description: aboutContent.zh.description,
    },
    en: {
      title: aboutContent.en.title,
      description: aboutContent.en.description,
    },
  },
  {
    path: "/principles",
    zh: {
      title: "孟子思想：四个核心主题页",
      description: "性善、四端、仁政、浩然之气四个主题页的统一入口，用来承接高意图问题并回到原文证据。",
    },
    en: {
      title: "Mencius philosophy: four core topic pages",
      description: "A unified entry into human nature, the four beginnings, humane government, and flood-like qi, built to answer high-intent questions and return to textual proof.",
    },
  },
  {
    path: "/books",
    zh: {
      title: "《孟子》全文与作品结构入口",
      description: "十四卷、二百六十章独立页面的《孟子》全文目录，用来承接全文、作品结构、中文原文与稳定引用需求。",
    },
    en: {
      title: "Mencius full text and works of Mencius",
      description: "A fourteen-part, 260-passage reading index for the full Mencius, designed for full-text discovery, source proof, and stable citation.",
    },
  },
  {
    path: "/quotes",
    zh: {
      title: "孟子名言与出处",
      description: "12 条高频孟子名言与出处入口，把名句重新接回原文、问题脉络与相关思想主题。",
    },
    en: {
      title: "Mencius quotes and sayings with source passages",
      description: "A high-intent quotes hub that reconnects famous Mencius sayings to their source passages, surrounding problem, and related principle pages.",
    },
  },
  {
    path: "/method",
    zh: {
      title: "孟子读法：从第一性原理进入原典",
      description: "用六步方法把《孟子》从名句摘录重新拉回问题、结构、章句与实践路径。",
    },
    en: {
      title: "How to read Mencius from first principles",
      description: "A six-step method that turns Mencius from detached quotations back into problems, structure, passages, and practical reading paths.",
    },
  },
  {
    path: "/sources",
    zh: {
      title: "来源与授权",
      description: "原典、图像来源与 SEO/GEO 技术依据页，用来核对本站的文本来源、授权与技术方法。",
    },
    en: {
      title: "Sources and licensing",
      description: "The page that records primary texts, image provenance, and the technical SEO/GEO references behind the site.",
    },
  },
  {
    path: "/faq",
    zh: {
      title: "关于本站与孟子思想的常见问题",
      description: "围绕孟子是谁、如何进入本站、如何把主题页与章句页配合起来的常见问题入口。",
    },
    en: {
      title: "Questions about the site and reading Mencius",
      description: "A FAQ route for who Mencius is, how to enter the site, and how to use hub pages and passage pages together.",
    },
  },
] as const;

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRfc822(date: string) {
  return new Date(`${date}T00:00:00Z`).toUTCString();
}

function buildFeedEntries(): FeedEntry[] {
  const hubEntries = staticHubEntries.flatMap((entry) => ([
    {
      locale: "zh" as const,
      path: entry.path,
      title: entry.zh.title,
      description: entry.zh.description,
      updatedAt: getPathLastUpdated(entry.path),
    },
    {
      locale: "en" as const,
      path: entry.path,
      title: entry.en.title,
      description: entry.en.description,
      updatedAt: getPathLastUpdated(entry.path),
    },
  ]));

  const principleEntries = principles.flatMap((principle) => ([
    {
      locale: "zh" as const,
      path: `/principles/${principle.slug}`,
      title: principle.zh.title,
      description: principle.zh.description,
      updatedAt: getPathLastUpdated(`/principles/${principle.slug}`),
    },
    {
      locale: "en" as const,
      path: `/principles/${principle.slug}`,
      title: principle.en.title,
      description: principle.en.description,
      updatedAt: getPathLastUpdated(`/principles/${principle.slug}`),
    },
  ]));

  return [...hubEntries, ...principleEntries].sort((left, right) => {
    if (left.updatedAt !== right.updatedAt) {
      return right.updatedAt.localeCompare(left.updatedAt);
    }

    return `${left.locale}${left.path}`.localeCompare(`${right.locale}${right.path}`);
  });
}

export function GET() {
  const entries = buildFeedEntries();
  const lastUpdated = entries[0]?.updatedAt ?? getPathLastUpdated("");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>mengtzu.com RSS feed</title>
    <link>${SITE_URL}</link>
    <description>Bilingual hub and principle updates for reading Mencius from first principles.</description>
    <atom:link href="${RSS_FEED_URL}" rel="self" type="application/rss+xml" />
    <lastBuildDate>${toRfc822(lastUpdated)}</lastBuildDate>
    <ttl>60</ttl>
${entries
  .map((entry) => {
    const url = `${SITE_URL}${localPath(entry.locale, entry.path)}`;
    return `    <item>
      <title>${escapeXml(entry.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(entry.description)}</description>
      <pubDate>${toRfc822(entry.updatedAt)}</pubDate>
    </item>`;
  })
  .join("\n")}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
