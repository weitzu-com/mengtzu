import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { bookSlugs, corpus, englishBookNames, getPassage, passageSlug, simplifiedBookNames, type Locale, type Passage } from "../../../../mencius-data";

export function generateStaticParams() {
  return ["zh", "en"].flatMap((locale) => corpus.chapters.flatMap((book, index) => book.passages.map((passage) => ({ locale, slug: bookSlugs[index], passage: passageSlug(passage.ref) }))));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string; passage: string }> }): Promise<Metadata> {
  const { locale, slug, passage: passageParam } = await params; const found = getPassage(slug, passageParam); if (!found) return {};
  const zh = locale === "zh"; const bookName = zh ? simplifiedBookNames[found.book.index] : englishBookNames[found.book.index];
  const excerpt = (zh ? found.passage.simplifiedChinese : found.passage.english).slice(0, 90);
  return { title: zh ? `《孟子·${bookName}》${found.passage.ref}` : `Mencius ${found.passage.ref} — ${bookName}`, description: excerpt, alternates: { canonical: `https://www.mengtzu.com/${locale}/books/${slug}/${passageParam}`, languages: { "zh-Hans": `https://www.mengtzu.com/zh/books/${slug}/${passageParam}`, en: `https://www.mengtzu.com/en/books/${slug}/${passageParam}` } } };
}

function RubyPassage({ passage, locale }: { passage: Passage; locale: Locale }) {
  const text = locale === "zh" ? passage.simplifiedChinese : passage.chinese;
  return <p className="passage-focus-chinese">{Array.from(text).map((char, index) => /[\u3400-\u9fff]/.test(char) ? <ruby key={index}>{char}<rt>{passage.pinyinTokens[index]}</rt></ruby> : <span key={index}>{char}</span>)}</p>;
}

export default async function PassagePage({ params }: { params: Promise<{ locale: string; slug: string; passage: string }> }) {
  const { locale: localeParam, slug, passage: passageParam } = await params; if (localeParam !== "zh" && localeParam !== "en") notFound();
  const locale = localeParam as Locale; const found = getPassage(slug, passageParam); if (!found) notFound();
  const { book, passage, index } = found; const zh = locale === "zh"; const previous = index > 0 ? book.passages[index - 1] : null; const next = index < book.passages.length - 1 ? book.passages[index + 1] : null;
  const bookName = zh ? simplifiedBookNames[book.index] : englishBookNames[book.index];
  return <main><header className="masthead"><a className="brand" href={`/${locale}`}><span className="seal">孟</span><span>mengtzu<small>.com</small></span></a><nav><a href={`/${locale}/books`}>{zh ? "十四卷" : "Books"}</a><a href={`/${locale}/method`}>{zh ? "读法" : "Method"}</a><a href={`/${locale}/sources`}>{zh ? "版本" : "Sources"}</a><span className="locale-switch"><a className={zh ? "active" : ""} href={`/zh/books/${slug}/${passageParam}`}>简体中文</a><a className={!zh ? "active" : ""} href={`/en/books/${slug}/${passageParam}`}>{zh ? "英文版" : "English"}</a></span></nav></header>
    <article className="passage-focus"><div className="eyebrow"><a href={`/${locale}/books/${slug}`}>{bookName}</a> · {passage.ref}</div><h1>{zh ? "章句" : "Passage"} {String(index + 1).padStart(2,"0")}</h1><RubyPassage passage={passage} locale={locale}/>{!zh && <p className="passage-focus-english">{passage.english}</p>}
      <div className="passage-principle"><span>{zh ? "第一性阅读" : "FIRST-PRINCIPLES READING"}</span><p>{zh ? "先确认原话与语境，再写出论证依赖的前提，最后检验这条原则成立的条件与边界。" : "Begin with the words and context, expose the premise beneath the argument, then test the conditions and limits of the principle."}</p></div>
      <nav className="book-pagination">{previous ? <a href={`/${locale}/books/${slug}/${passageSlug(previous.ref)}`}>← {previous.ref}</a> : <span/>}<a href={`/${locale}/books/${slug}`}>{zh ? "返回本卷" : "Back to this part"}</a>{next ? <a href={`/${locale}/books/${slug}/${passageSlug(next.ref)}`}>{next.ref} →</a> : <span/>}</nav>
    </article></main>;
}
