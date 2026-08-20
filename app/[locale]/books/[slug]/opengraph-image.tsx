import { notFound } from "next/navigation";
import { socialImageContentType, socialImageSize, renderSocialCard } from "../../../lib/og";
import { englishBookNames, getBook, simplifiedBookNames } from "../../../mencius-data";
import { getBookContext } from "../../../lib/seo";
import { isLocale, type Locale } from "../../../lib/site";

export const size = socialImageSize;
export const contentType = socialImageContentType;
export const alt = "Book social card";

type ImageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

function getLocale(value: string): Locale {
  if (!isLocale(value)) notFound();
  return value;
}

export default async function OpenGraphImage({ params }: ImageProps) {
  const { locale: localeParam, slug } = await params;
  const locale = getLocale(localeParam);
  const book = getBook(slug);
  if (!book) notFound();

  const zh = locale === "zh";
  const title = zh ? simplifiedBookNames[book.index] : englishBookNames[book.index];
  const context = getBookContext(book.index, locale);

  return renderSocialCard({
    locale,
    eyebrow: zh
      ? `第 ${String(book.index + 1).padStart(2, "0")} 卷 · ${book.passages.length} 章`
      : `Part ${String(book.index + 1).padStart(2, "0")} · ${book.passages.length} passages`,
    title,
    description: context.summary,
    accent: "#b45309",
    footer: zh ? "卷级导航 · 重点章句支点 · 稳定引用路径" : "part-level navigation · featured passages · stable citation route",
    chips:
      zh
        ? ["逐字拼音", "重点章句", "原典导航"]
        : ["pinyin support", "featured passages", "text navigation"],
  });
}
