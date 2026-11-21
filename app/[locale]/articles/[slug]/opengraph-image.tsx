import { notFound } from "next/navigation";
import { articles, getArticle } from "../../../lib/articles";
import { socialImageContentType, socialImageSize, renderSocialCard } from "../../../lib/og";
import { isLocale, locales, type Locale } from "../../../lib/site";

export const size = socialImageSize;
export const contentType = socialImageContentType;
export const alt = "Article social card";

type ImageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return locales.flatMap((locale) => articles.map((article) => ({ locale, slug: article.slug })));
}

function getLocale(value: string): Locale {
  if (!isLocale(value)) notFound();
  return value;
}

export default async function OpenGraphImage({ params }: ImageProps) {
  const { locale: localeParam, slug } = await params;
  const locale = getLocale(localeParam);
  const article = getArticle(slug);
  if (!article) notFound();

  const content = article[locale];

  return renderSocialCard({
    locale,
    eyebrow: content.eyebrow,
    title: content.title,
    description: content.description,
    accent: "#0f766e",
    footer: article.sourceRefs.slice(0, 4).join(" · "),
    chips: article.targetQueries[locale].slice(0, 3),
  });
}
