import {
  bookSlugs,
  corpus,
  englishBookNames,
  passageSlug,
  simplifiedBookNames,
  type Passage,
} from "../mencius-data";
import { localPath, principles, SITE_URL, type Locale } from "./site";
import { getPassageEditorialNote } from "./passage-notes";

export const SITE_PUBLISHED = "2026-07-10";
export const EDITOR_NAME = "mengtzu.com Editorial Desk";
export const SOCIAL_IMAGE_PATH = "/images/mengzi-kano-sansetsu.jpg";
export const SOCIAL_IMAGE_URL = `${SITE_URL}${SOCIAL_IMAGE_PATH}`;

export const AUTHOR_SCHEMA = {
  "@type": "Organization",
  name: EDITOR_NAME,
  url: `${SITE_URL}/en/about`,
} as const;

export const PUBLISHER_SCHEMA = {
  "@type": "Organization",
  name: "mengtzu.com",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/favicon.svg`,
  },
} as const;

export type BreadcrumbItem = {
  label: string;
  href: string;
};

export type FaqEntry = {
  question: string;
  answer: string;
};

type BookContext = {
  topicZh: string;
  topicEn: string;
  summaryZh: string;
  summaryEn: string;
};

type MatchedPrinciple = {
  slug: string;
  href: string;
  title: string;
  shortTitle: string;
};

export type PrinciplePassageLink = {
  ref: string;
  href: string;
  bookName: string;
  title: string;
  hasEditorialNote: boolean;
  isAnchor: boolean;
};

const bookContexts: BookContext[] = [
  {
    topicZh: "义利之辨、王道与民生",
    topicEn: "profit, humane rule, and the livelihood of the people",
    summaryZh: "《梁惠王上》集中讨论义利之辨、养民条件与王道政治的起点。",
    summaryEn: "King Hui of Liang I concentrates on profit versus righteousness, public livelihood, and the opening conditions of humane rule.",
  },
  {
    topicZh: "与民同乐、战争判断与政治责任",
    topicEn: "shared joy with the people, judgments about war, and political responsibility",
    summaryZh: "《梁惠王下》把与民同乐、战争选择和君主责任放到同一条政治判断链上。",
    summaryEn: "King Hui of Liang II places shared joy, war, and the ruler's responsibility inside one political chain of judgment.",
  },
  {
    topicZh: "四端、性善与王道根据",
    topicEn: "the four beginnings, human goodness, and the grounds of humane rule",
    summaryZh: "《公孙丑上》是理解四端、性善与仁政根据的关键卷次。",
    summaryEn: "Gong Sun Chou I is a key part for the four beginnings, human goodness, and the grounds of humane government.",
  },
  {
    topicZh: "浩然之气、人格判断与公共责任",
    topicEn: "flood-like qi, moral judgment, and public responsibility",
    summaryZh: "《公孙丑下》围绕浩然之气、人格定力和士人的公共责任展开。",
    summaryEn: "Gong Sun Chou II develops flood-like qi, steadiness of character, and the public duty of the scholar.",
  },
  {
    topicZh: "民生、教育与制度起点",
    topicEn: "livelihood, education, and institutional beginnings",
    summaryZh: "《滕文公上》把民生、教化与制度设计联系到能否真正安顿百姓。",
    summaryEn: "Teng Wen Gong I ties livelihood, teaching, and institutional design to whether people can truly be settled.",
  },
  {
    topicZh: "分工、教化与社会秩序",
    topicEn: "division of labor, teaching, and social order",
    summaryZh: "《滕文公下》集中处理分工、教化和社会角色的正当边界。",
    summaryEn: "Teng Wen Gong II focuses on labor, teaching, and the proper limits of social roles.",
  },
  {
    topicZh: "自反、乱世与守道",
    topicEn: "self-examination, disorder, and keeping the way",
    summaryZh: "《离娄上》经常从自反与守道的角度讨论乱世中的行动标准。",
    summaryEn: "Li Lou I often approaches disorder through self-examination and the standards for keeping the way.",
  },
  {
    topicZh: "观人、礼与关系治理",
    topicEn: "seeing people clearly, ritual restraint, and governing relationships",
    summaryZh: "《离娄下》围绕看人、处关系和礼的节制展开许多具体判断。",
    summaryEn: "Li Lou II offers concrete judgments about seeing people, handling relationships, and the discipline of ritual.",
  },
  {
    topicZh: "臣道、忠告与政治担当",
    topicEn: "ministerial duty, honest counsel, and political commitment",
    summaryZh: "《万章上》反复讨论臣道、忠告和政治责任的边界。",
    summaryEn: "Wan Zhang I repeatedly discusses ministerial duty, honest counsel, and the boundaries of political responsibility.",
  },
  {
    topicZh: "知人、求学与名实之辨",
    topicEn: "recognizing worth, learning, and the relation between name and reality",
    summaryZh: "《万章下》偏重知人、求学与名实是否相副的问题。",
    summaryEn: "Wan Zhang II leans toward questions of recognizing worth, learning, and whether names match realities.",
  },
  {
    topicZh: "性善、欲望与告子论辩",
    topicEn: "human goodness, desire, and the debates with Gaozi",
    summaryZh: "《告子上》是性善论与告子论辩的核心战场。",
    summaryEn: "Gao Zi I is the central battleground for human goodness and the arguments with Gaozi.",
  },
  {
    topicZh: "养心、判断与人格形成",
    topicEn: "nourishing the heart, judgment, and the formation of character",
    summaryZh: "《告子下》把养心、判断和人格形成连成一条修身路线。",
    summaryEn: "Gao Zi II connects nourishing the heart, judgment, and character formation into one path of cultivation.",
  },
  {
    topicZh: "尽心、诚与保存本心",
    topicEn: "exhausting the heart, sincerity, and preserving the original heart",
    summaryZh: "《尽心上》重点是尽心、诚与如何保存已经给定的人心能力。",
    summaryEn: "Jin Xin I centers on exhausting the heart, sincerity, and preserving the capacities already given in the human heart.",
  },
  {
    topicZh: "知言、知命与修养完成",
    topicEn: "knowing words, knowing destiny, and the completion of cultivation",
    summaryZh: "《尽心下》把知言、知命与修养完成阶段的判断放在一起讨论。",
    summaryEn: "Jin Xin II treats knowing words, knowing destiny, and the judgments proper to mature cultivation together.",
  },
];

const principleRules = [
  {
    slug: "si-duan",
    zh: /不忍|恻隐|四端|孺子/u,
    en: /cannot bear|compassion|four beginnings|child/i,
  },
  {
    slug: "xing-shan",
    zh: /性善|性也|人性|告子/u,
    en: /human nature|nature is good|gaozi|gao says/i,
  },
  {
    slug: "ren-zheng",
    zh: /仁政|王道|民为|黎民|天下|王曰|国/u,
    en: /humane government|kingly way|the people|the state|the ruler|king/i,
  },
  {
    slug: "hao-ran-zhi-qi",
    zh: /浩然|义|养气/u,
    en: /flood-like qi|righteousness|nourish(?:ing)? (?:the )?qi|moral courage/i,
  },
] as const;

const fallbackPrinciplesByBook: Record<number, string[]> = {
  0: ["ren-zheng"],
  1: ["ren-zheng"],
  2: ["si-duan", "xing-shan"],
  3: ["hao-ran-zhi-qi"],
  4: ["ren-zheng"],
  5: ["ren-zheng"],
  6: ["xing-shan"],
  7: ["xing-shan"],
  8: ["ren-zheng"],
  9: ["xing-shan"],
  10: ["xing-shan"],
  11: ["hao-ran-zhi-qi", "xing-shan"],
  12: ["xing-shan"],
  13: ["hao-ran-zhi-qi", "xing-shan"],
};

function clampChars(text: string, limit: number) {
  return text.length <= limit ? text : `${text.slice(0, limit).trim()}…`;
}

function clampWords(text: string, limit: number) {
  const words = text.trim().split(/\s+/u).filter(Boolean);
  return words.length <= limit ? words.join(" ") : `${words.slice(0, limit).join(" ")}…`;
}

function extractChineseCue(text: string) {
  const cleaned = text
    .replace(/\s+/gu, "")
    .replace(/^[^「"]*[：「]/u, "")
    .replace(/[「」『』"]/gu, "");
  const sentence = cleaned.split(/[。！？；]/u).find(Boolean) ?? cleaned;
  return clampChars(sentence, 18);
}

function extractEnglishCue(text: string) {
  const cleaned = text.replace(/\s+/gu, " ").trim().replace(/^['"]|['"]$/gu, "");
  const sentence = cleaned.split(/[.?!;]/u).find(Boolean) ?? cleaned;
  const withoutSpeaker = sentence
    .replace(/^(Mencius|Mengzi|The king|King [A-Z][a-z]+|The disciple [A-Z][A-Za-z -]+)\s+(said|asked|replied|answered),?\s*/iu, "")
    .replace(/^['"]|['"]$/gu, "")
    .trim();
  return clampWords(withoutSpeaker || sentence, 11);
}

function dedupe<T>(items: T[]) {
  return [...new Set(items)];
}

export function buildBreadcrumbJsonLd(locale: Locale, items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `${SITE_URL}${localPath(locale, item.href)}`,
    })),
  };
}

export function buildFaqPageJsonLd(url: string, name: string, items: FaqEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    name,
    url,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function getBookContext(bookIndex: number, locale: Locale) {
  const context = bookContexts[bookIndex];
  return {
    topic: locale === "zh" ? context.topicZh : context.topicEn,
    summary: locale === "zh" ? context.summaryZh : context.summaryEn,
  };
}

export function getRelatedPrinciples(locale: Locale, passage: Passage, bookIndex: number): MatchedPrinciple[] {
  const combinedZh = `${passage.chinese} ${passage.simplifiedChinese}`;
  const combinedEn = passage.english;
  const matched = principleRules
    .filter((rule) => rule.zh.test(combinedZh) || rule.en.test(combinedEn))
    .map((rule) => rule.slug);

  const slugs = dedupe(matched.length > 0 ? matched : fallbackPrinciplesByBook[bookIndex] ?? []);

  return slugs
    .map((slug) => principles.find((principle) => principle.slug === slug))
    .filter((principle): principle is NonNullable<typeof principle> => Boolean(principle))
    .map((principle) => ({
      slug: principle.slug,
      href: localPath(locale, `/principles/${principle.slug}`),
      title: principle[locale].title,
      shortTitle: principle[locale].shortTitle,
    }));
}

export function getRelatedPassagesForPrinciple(
  locale: Locale,
  principleSlug: string,
  limit = 8,
): PrinciplePassageLink[] {
  const principle = principles.find((item) => item.slug === principleSlug);
  if (!principle) return [];

  return corpus.chapters
    .flatMap((book, bookIndex) =>
      book.passages.map((passage) => {
        const relativePath = `/books/${bookSlugs[bookIndex]}/${passageSlug(passage.ref)}`;
        const matchesPrinciple = getRelatedPrinciples(locale, passage, bookIndex)
          .some((matched) => matched.slug === principleSlug);

        if (!matchesPrinciple) return null;

        const bookName = locale === "zh" ? simplifiedBookNames[bookIndex] : englishBookNames[bookIndex];
        const note = getPassageEditorialNote(passage.ref, locale);

        return {
          ref: passage.ref,
          href: localPath(locale, relativePath),
          bookName,
          title: buildPassageTitle(locale, bookName, passage),
          hasEditorialNote: Boolean(note),
          isAnchor: relativePath === principle.textPath,
          bookIndex,
          position: book.passages.indexOf(passage),
        };
      }),
    )
    .filter((item): item is PrinciplePassageLink & { bookIndex: number; position: number } => Boolean(item))
    .sort((left, right) =>
      Number(right.isAnchor) - Number(left.isAnchor)
      || Number(right.hasEditorialNote) - Number(left.hasEditorialNote)
      || left.bookIndex - right.bookIndex
      || left.position - right.position,
    )
    .slice(0, limit)
    .map((item) => ({
      ref: item.ref,
      href: item.href,
      bookName: item.bookName,
      title: item.title,
      hasEditorialNote: item.hasEditorialNote,
      isAnchor: item.isAnchor,
    }));
}

export function buildPassageCue(locale: Locale, passage: Passage) {
  return locale === "zh" ? extractChineseCue(passage.simplifiedChinese) : extractEnglishCue(passage.english);
}

export function buildPassageTitle(
  locale: Locale,
  bookName: string,
  passage: Passage,
) {
  const note = getPassageEditorialNote(passage.ref, locale);
  if (note) return note.seoTitle;
  const cue = buildPassageCue(locale, passage);
  return locale === "zh"
    ? `《孟子·${bookName}》${passage.ref}：${cue}`
    : `Mencius ${passage.ref}: ${cue}`;
}

export function buildPassageDescription(
  locale: Locale,
  bookName: string,
  passage: Passage,
  bookIndex: number,
  passageIndex: number,
) {
  const note = getPassageEditorialNote(passage.ref, locale);
  if (note) return note.seoDescription;
  const cue = buildPassageCue(locale, passage);
  const context = getBookContext(bookIndex, locale);
  return locale === "zh"
    ? `${passage.ref} 位于《孟子·${bookName}》第 ${passageIndex + 1} 章，围绕“${cue}”展开，适合放回${context.topic}这一问题链中理解。`
    : `${passage.ref} is passage ${passageIndex + 1} of ${bookName}. It opens with "${cue}" and is best read within Mencius's argument about ${context.topic}.`;
}

export function buildPassageInsight(
  locale: Locale,
  bookName: string,
  passage: Passage,
  bookIndex: number,
  passageIndex: number,
  totalPassages: number,
) {
  const cue = buildPassageCue(locale, passage);
  const context = getBookContext(bookIndex, locale);
  const relatedPrinciples = getRelatedPrinciples(locale, passage, bookIndex);
  const relatedTitles = relatedPrinciples.map((principle) => principle.shortTitle).join(locale === "zh" ? "、" : ", ");

  return locale === "zh"
    ? {
        summary: `这章是《${bookName}》第 ${passageIndex + 1} / ${totalPassages} 章，最直接的进入线索是“${cue}”。放回全卷，它讨论的是${context.topic}${relatedTitles ? `，并可与${relatedTitles}互相印证` : ""}。`,
        citationNote: `引用时建议同时保留卷名与 ${passage.ref}，并说明本页提供原文、拼音与英译对读，避免把句子从原始论证环境中抽离。`,
      }
    : {
        summary: `This is passage ${passageIndex + 1} of ${totalPassages} in ${bookName}. The cleanest entry point is "${cue}". In context, it works as part of Mencius's argument about ${context.topic}${relatedTitles ? ` and can be read alongside ${relatedTitles}` : ""}.`,
        citationNote: `When citing it, keep both the book name and ${passage.ref}. That preserves the passage's exact place in the argument instead of floating it as an isolated quote.`,
      };
}

export function formatPassagePosition(locale: Locale, passageIndex: number, totalPassages: number) {
  return locale === "zh"
    ? `第 ${String(passageIndex + 1).padStart(2, "0")} / ${String(totalPassages).padStart(2, "0")} 章`
    : `Passage ${String(passageIndex + 1).padStart(2, "0")} / ${String(totalPassages).padStart(2, "0")}`;
}
