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

const ENGLISH_TITLE_MAX = 60;
const ENGLISH_TITLE_TARGET = 52;
const ENGLISH_DESCRIPTION_MAX = 160;
const ENGLISH_DESCRIPTION_TARGET = 145;
const ENGLISH_TITLE_TRAILING_STOPWORDS = new Set([
  "and",
  "or",
  "of",
  "the",
  "to",
  "in",
  "on",
  "for",
  "with",
  "without",
  "from",
  "by",
  "is",
  "are",
  "was",
  "were",
  "what",
  "why",
  "how",
  "when",
  "where",
  "which",
  "that",
]);

function takeWords(text: string, limit: number) {
  const words = text.trim().split(/\s+/u).filter(Boolean);
  return words.slice(0, limit).join(" ");
}

function squeezeEnglish(text: string) {
  return text
    .replace(/\s+/gu, " ")
    .replace(/\s+([,.;:!?])/gu, "$1")
    .trim();
}

function normalizeEnglishText(text: string) {
  return squeezeEnglish(
    text
      .replace(/&quot;/gu, "\"")
      .replace(/&#x27;/gu, "'")
      .replace(/&amp;/gu, "&"),
  );
}

function escapeForRegex(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

function ensureSentenceEnd(text: string) {
  return /[.?!]$/u.test(text) ? text : `${text}.`;
}

function trimTrailingEnglishTitleStopwords(text: string) {
  let output = squeezeEnglish(text).replace(/[,:;–—-]+$/gu, "").trim();

  while (true) {
    const match = output.match(/\b([A-Za-z']+)$/u);
    if (!match) return output;

    const word = match[1].toLowerCase();
    if (!ENGLISH_TITLE_TRAILING_STOPWORDS.has(word)) return output;

    output = output
      .slice(0, -match[1].length)
      .replace(/[-,:;–—\s]+$/gu, "")
      .trim();
  }
}

function trimToBoundary(text: string, limit: number) {
  if (text.length <= limit) return text;

  const clipped = text.slice(0, limit);
  const punctuation = Math.max(
    clipped.lastIndexOf(". "),
    clipped.lastIndexOf("; "),
    clipped.lastIndexOf(": "),
    clipped.lastIndexOf(", "),
  );

  if (punctuation >= 72) {
    const stop = clipped[punctuation] === "." ? punctuation + 1 : punctuation;
    return ensureSentenceEnd(clipped.slice(0, stop).trim());
  }

  const lastSpace = clipped.lastIndexOf(" ");
  return ensureSentenceEnd((lastSpace >= 48 ? clipped.slice(0, lastSpace) : clipped).trim());
}

function tightenEnglishTitleTopic(text: string) {
  let output = normalizeEnglishText(text)
    .replace(/^['"]|['"]$/gu, "")
    .replace(/^[A-Z][A-Za-z' ,.-]{0,96}\b(?:said|asked|replied|answered)\b[^A-Za-z0-9]{0,12}(?:saying,?\s*)?/u, "")
    .replace(/[.?!]$/u, "");

  const replacements: Array<[RegExp, string]> = [
    [/\bwhy Mencius insists that\b/iu, "why"],
    [/\bthe basis of\b/giu, ""],
    [/\bthe language of rule\b/giu, "rule"],
    [/\bcarved out of damaged human nature\b/iu, "carved from human nature"],
    [/\bmoral self-examination\b/giu, "self-examination"],
    [/\bpolitical killings\b/giu, "political killing"],
    [/\bfavorable weather is not as good as\b/iu, "human harmony over"],
    [/\bthe child at the well\b/iu, "child at the well"],
    [/\bthe bent finger\b/iu, "bent finger"],
    [/\bthe difference between\b/giu, "difference between"],
    [/\bthe greater and lesser parts of the self\b/iu, "the greater and lesser self"],
    [/\bthe people'?s joy, grieve at their grief\b/iu, "the people's joy and grief"],
    [/\bthe people's joy, grieve at their grief\b/iu, "the people's joy and grief"],
    [/\bthe ruling heart\b/iu, "the heart that rules"],
    [/\bthe quiet home\b/iu, "the home of benevolence"],
  ];

  for (const [pattern, replacement] of replacements) {
    output = output.replace(pattern, replacement);
  }

  if (output.length > 42) {
    output = output.replace(/^the\s+/iu, "");
  }

  return squeezeEnglish(output);
}

function questionToEnglishTitleTopic(question: string) {
  let output = normalizeEnglishText(question).replace(/\?$/u, "");

  const prefixReplacements: Array<[RegExp, string]> = [
    [/^Why does Mencius\b/iu, "why"],
    [/^Why does\b/iu, "why"],
    [/^Why is Mencius'?s\b/iu, "why"],
    [/^Why is\b/iu, "why"],
    [/^What does Mencius\b/iu, "what"],
    [/^What does\b/iu, "what"],
    [/^What is\b/iu, "what is"],
    [/^How does Mencius\b/iu, "how"],
    [/^How does\b/iu, "how"],
    [/^How do\b/iu, "how do"],
    [/^Can\b/iu, "can"],
  ];

  for (const [pattern, replacement] of prefixReplacements) {
    output = output.replace(pattern, replacement);
  }

  const fillerReplacements: Array<[RegExp, string]> = [
    [/\bimmediately\b/giu, ""],
    [/\bthe case for\b/giu, ""],
    [/\bthe detail of\b/giu, ""],
    [/\bthe need to\b/giu, ""],
    [/\brather than a natural accident alone\b/iu, "rather than nature alone"],
    [/\bto talk about cultivating the heart\b/iu, "for cultivating the heart"],
    [/\bto argue about human nature\b/iu, "about human nature"],
    [/\bthrough the greater and lesser parts of the self\b/iu, "through the greater and lesser self"],
  ];

  for (const [pattern, replacement] of fillerReplacements) {
    output = output.replace(pattern, replacement);
  }

  return tightenEnglishTitleTopic(output);
}

function stripEnglishPassageTitlePrefix(title: string, refShort: string) {
  return title.replace(new RegExp(`^Mencius\\s+${escapeForRegex(refShort)}\\s*:\\s*`, "iu"), "").trim();
}

function scoreEnglishTitle(title: string) {
  let score = Math.abs(title.length - ENGLISH_TITLE_TARGET);
  if (title.length > ENGLISH_TITLE_MAX) score += (title.length - ENGLISH_TITLE_MAX) * 25;
  if (title.length < 34) score += (34 - title.length) * 2;
  if (!title.startsWith("Mencius ")) score += 20;
  if (title.endsWith("…")) score += 18;
  if (/\b(said|asked|replied|answered|saying)\b/iu.test(title)) score += 18;
  if (/["']/.test(title)) score += 10;
  return score;
}

function chooseEnglishTitle(candidates: Array<string | null | undefined>) {
  const unique = dedupe(
    candidates
      .map((candidate) => candidate ? trimTrailingEnglishTitleStopwords(candidate) : "")
      .filter(Boolean),
  );

  return unique.sort((left, right) => scoreEnglishTitle(left) - scoreEnglishTitle(right))[0] ?? "";
}

function compactEnglishDescription(text: string, refShort: string) {
  let output = normalizeEnglishText(text)
    .replace(new RegExp(`^In\\s+${escapeForRegex(refShort)}\\s+`, "iu"), "")
    .replace(/^Mencius\s+uses\s+the\s+story\s+of\s+/iu, "")
    .replace(/^Mencius\s+uses\s+/iu, "")
    .replace(/^Mencius\s+explains\s+that\s+/iu, "")
    .replace(/^Mencius\s+argues\s+that\s+/iu, "")
    .replace(/^Mencius\s+argues\s+through\s+/iu, "Through ")
    .replace(/^Mencius\s+charges\s+/iu, "")
    .replace(/^Mencius\s+turns\s+/iu, "")
    .replace(/^Mencius\s+treats\s+/iu, "")
    .replace(/^Mencius\s+compares\s+/iu, "")
    .replace(/^Mencius\s+calls\s+/iu, "")
    .replace(/\balready present in every person\b/iu, "present in everyone")
    .replace(/\ba natural accident alone\b/iu, "nature alone")
    .replace(/\bwhat a human being is\b/iu, "human nature")
    .replace(/\bthe thinking heart or the senses pulled by external things\b/iu, "the thinking heart or the outward-pulled senses");

  output = squeezeEnglish(output);

  if (output.length <= ENGLISH_DESCRIPTION_MAX) return ensureSentenceEnd(output);

  const variants = [output];

  for (const pattern of [/;\s+/u, /:\s+/u, /,\s+(?=arguing|showing|explaining|because|when|while|rather than|which|so that)/iu]) {
    const parts = output.split(pattern).map((part) => part.trim()).filter(Boolean);
    if (parts.length >= 2) {
      variants.push(ensureSentenceEnd(parts[0]));
      variants.push(ensureSentenceEnd(`${parts[0]} ${parts[1]}`));
    }
  }

  variants.push(trimToBoundary(output, ENGLISH_DESCRIPTION_MAX));

  const unique = dedupe(variants.map((variant) => squeezeEnglish(variant)).filter(Boolean));

  return unique
    .sort((left, right) => {
      const leftScore = scoreEnglishDescription(left);
      const rightScore = scoreEnglishDescription(right);
      return leftScore - rightScore;
    })[0] ?? ensureSentenceEnd(trimToBoundary(output, ENGLISH_DESCRIPTION_MAX));
}

function scoreEnglishDescription(text: string) {
  let score = Math.abs(text.length - ENGLISH_DESCRIPTION_TARGET);
  if (text.length > ENGLISH_DESCRIPTION_MAX) score += (text.length - ENGLISH_DESCRIPTION_MAX) * 25;
  if (text.length < 110) score += (110 - text.length) * 1.5;
  return score;
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
  const cleaned = normalizeEnglishText(text).replace(/^['"]|['"]$/gu, "");
  const reported = cleaned.match(/\b(?:said|asked|replied|answered)\b[^"'“”]{0,48}[“"']([^.!?;]{8,})/u)?.[1];
  const quoted = cleaned.match(/(?:[,;:]\s*|^)[“"']([^.!?;]{8,})/u)?.[1];
  const sentence = (reported ?? quoted ?? cleaned.split(/[.?!;]/u).find(Boolean) ?? cleaned).trim();
  const withoutSpeaker = sentence
    .replace(/^(Mencius|Mengzi|The king|King [A-Z][a-z]+|The disciple [A-Z][A-Za-z -]+|Wan Zhang|Gong Sun Chou|Tao Ying)\s+(said|asked|replied|answered),?\s*/iu, "")
    .replace(/^[A-Z][A-Za-z' -]{0,64},\s*(asked|said|replied|answered),?\s*/u, "")
    .replace(/^['"]|['"]$/gu, "")
    .trim();
  return clampWords(withoutSpeaker || sentence, 8);
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
  const cue = buildPassageCue(locale, passage);
  if (locale === "zh") {
    if (note) return note.seoTitle;
    return `《孟子·${bookName}》${passage.ref}：${cue}`;
  }

  const refShort = passage.ref.replace(/^孟子\s*/u, "");
  if (note) {
    if (note.seoTitle.length <= ENGLISH_TITLE_MAX) return note.seoTitle;

    const questionTopic = questionToEnglishTitleTopic(note.readingQuestion);
    const titleTopic = stripEnglishPassageTitlePrefix(note.seoTitle, refShort);
    return chooseEnglishTitle([
      note.seoTitle,
      `Mencius ${refShort}: ${tightenEnglishTitleTopic(titleTopic)}`,
      `Mencius ${refShort}: ${questionTopic}`,
      `Mencius ${refShort}: ${tightenEnglishTitleTopic(takeWords(titleTopic, 6))}`,
      `Mencius ${refShort}: ${tightenEnglishTitleTopic(takeWords(questionTopic, 6))}`,
      `Mencius ${refShort}: ${tightenEnglishTitleTopic(takeWords(cue, 6))}`,
    ]);
  }

  const titleCandidates = [
    `Mencius ${refShort}: ${tightenEnglishTitleTopic(cue)}`,
    `Mencius ${refShort}: ${tightenEnglishTitleTopic(takeWords(cue, 6))}`,
    `${refShort}: ${tightenEnglishTitleTopic(cue)}`,
  ];

  return chooseEnglishTitle(titleCandidates);
}

export function buildPassageDescription(
  locale: Locale,
  bookName: string,
  passage: Passage,
  bookIndex: number,
  passageIndex: number,
) {
  const note = getPassageEditorialNote(passage.ref, locale);
  const cue = buildPassageCue(locale, passage);
  const context = getBookContext(bookIndex, locale);
  if (locale === "zh") {
    if (note) return note.seoDescription;
    return `${passage.ref} 位于《孟子·${bookName}》第 ${passageIndex + 1} 章，围绕“${cue}”展开，适合放回${context.topic}这一问题链中理解。`;
  }

  const refShort = passage.ref.replace(/^孟子\s*/u, "");
  if (note) {
    return dedupe([
      compactEnglishDescription(note.seoDescription, refShort),
      compactEnglishDescription(note.directAnswer, refShort),
      compactEnglishDescription(note.firstPrinciple, refShort),
      compactEnglishDescription(note.whyItMatters, refShort),
    ]).sort((left, right) => scoreEnglishDescription(left) - scoreEnglishDescription(right))[0];
  }

  const principleTopic = getRelatedPrinciples(locale, passage, bookIndex)
    .map((principle) => principle.shortTitle.toLowerCase())
    .slice(0, 2)
    .join(" and ");
  const fallbackTopic = principleTopic || context.topic;
  const fallbackCandidates = [
    `Mencius ${refShort} in ${bookName} opens with "${cue}" and belongs to the argument about ${fallbackTopic}.`,
    `Mencius ${refShort} in ${bookName} turns on "${cue}" and helps explain ${fallbackTopic}.`,
    `Read Mencius ${refShort} in ${bookName} for "${cue}" and the wider debate about ${fallbackTopic}.`,
  ].map((candidate) => compactEnglishDescription(candidate, refShort));

  return fallbackCandidates.sort((left, right) => scoreEnglishDescription(left) - scoreEnglishDescription(right))[0];
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
