import { notFound } from "next/navigation";
import { socialImageContentType, socialImageSize, renderSocialCard } from "../../../../lib/og";
import { englishBookNames, getPassage, simplifiedBookNames } from "../../../../mencius-data";
import { buildPassageDescription, buildPassageTitle, getRelatedPrinciples } from "../../../../lib/seo";
import { isLocale, type Locale } from "../../../../lib/site";

export const size = socialImageSize;
export const contentType = socialImageContentType;
export const alt = "Passage social card";

type ImageProps = {
  params: Promise<{ locale: string; slug: string; passage: string }>;
};

function getLocale(value: string): Locale {
  if (!isLocale(value)) notFound();
  return value;
}

export default async function OpenGraphImage({ params }: ImageProps) {
  const { locale: localeParam, slug, passage: passageParam } = await params;
  const locale = getLocale(localeParam);
  const found = getPassage(slug, passageParam);
  if (!found) notFound();

  const zh = locale === "zh";
  const bookName = zh ? simplifiedBookNames[found.book.index] : englishBookNames[found.book.index];
  const title = buildPassageTitle(locale, bookName, found.passage);
  const description = buildPassageDescription(locale, bookName, found.passage, found.book.index, found.index);
  const related = getRelatedPrinciples(locale, found.passage, found.book.index).slice(0, 3).map((item) => item.shortTitle);

  return renderSocialCard({
    locale,
    eyebrow: zh
      ? `${bookName} · ${found.passage.ref}`
      : `${bookName} · ${found.passage.ref}`,
    title,
    description,
    accent: "#0f766e",
    footer: zh ? "章句页 · 原文证据 · 主题回链" : "passage page · textual evidence · topic backlinks",
    chips: related.length > 0 ? related : zh ? ["章句页", "原典证据", "双语阅读"] : ["passage page", "textual evidence", "bilingual reading"],
  });
}
