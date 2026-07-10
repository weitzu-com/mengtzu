import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { bookSlugs, corpus, getBook, passageSlug, simplifiedBookNames, type Locale, type Passage } from "../../../mencius-data";

export function generateStaticParams() { return ["zh", "en"].flatMap((locale) => bookSlugs.map((slug) => ({ locale, slug }))); }

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params; const book = getBook(slug); if (!book) return {};
  const zh = locale === "zh"; const name = zh ? book.simplifiedName : book.name;
  return {
    title: zh ? `《孟子·${name}》全文｜简体与逐字拼音` : `Mencius: ${name} — Chinese, Pinyin & English`,
    description: zh ? `《孟子·${name}》完整章句，简体中文与逐字拼音对照阅读。` : `Read ${name}, part ${book.index + 1} of the Mencius, with Chinese text, aligned pinyin, and James Legge’s English translation.`,
    alternates: { canonical: `https://www.mengtzu.com/${locale}/books/${slug}`, languages: { "zh-Hans": `https://www.mengtzu.com/zh/books/${slug}`, en: `https://www.mengtzu.com/en/books/${slug}` } }
  };
}

function RubyLine({ passage, locale }: { passage: Passage; locale: Locale }) {
  const text = locale === "zh" ? passage.simplifiedChinese : passage.chinese;
  return <p className="book-chinese">{Array.from(text).map((char, index) => /[\u3400-\u9fff]/.test(char) ? <ruby key={index}>{char}<rt>{passage.pinyinTokens[index]}</rt></ruby> : <span key={index}>{char}</span>)}</p>;
}

export default async function BookPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: localeParam, slug } = await params; if (localeParam !== "zh" && localeParam !== "en") notFound();
  const locale = localeParam as Locale; const book = getBook(slug); if (!book) notFound();
  const previous = book.index > 0 ? bookSlugs[book.index - 1] : null; const next = book.index < bookSlugs.length - 1 ? bookSlugs[book.index + 1] : null;
  const zh = locale === "zh"; const displayName = zh ? book.simplifiedName : book.name;
  return <main>
    <header className="masthead"><a className="brand" href={`/${locale}`}><span className="seal">孟</span><span>mengtzu<small>.com</small></span></a><nav><a href={`/${locale}`}>{zh ? "首页" : "Home"}</a><a href={`/${locale}/books`}>{zh ? "十四卷" : "Books"}</a><a href={`/${locale}/method`}>{zh ? "读法" : "Method"}</a><a href={`/${locale}/sources`}>{zh ? "版本" : "Sources"}</a><span className="locale-switch"><a className={zh ? "active" : ""} href={`/zh/books/${slug}`}>简体中文</a><a className={!zh ? "active" : ""} href={`/en/books/${slug}`}>{zh ? "英文版" : "English"}</a></span></nav></header>
    <div className="book-layout"><aside className="book-index"><div className="aside-title">{zh ? "十四卷" : "FOURTEEN PARTS"}<small>{zh ? "全书卷目" : "THE MENCIUS"}</small></div>{corpus.chapters.map((chapter, index) => <a key={chapter.id} className={index === book.index ? "active" : ""} href={`/${locale}/books/${bookSlugs[index]}`}><span>{String(index + 1).padStart(2, "0")}</span>{zh ? simplifiedBookNames[index] : chapter.name}</a>)}</aside>
      <article className="book-main"><header className="book-heading"><div className="eyebrow">{zh ? `第 ${String(book.index + 1).padStart(2,"0")} 卷 · ${book.passages.length} 章` : `PART ${String(book.index + 1).padStart(2,"0")} · ${book.passages.length} PASSAGES`}</div><h1>{displayName}</h1><p>{zh ? "简体原文与逐字拼音对照。先读其言，再辨其所据，最后检验其原则。" : "Chinese original, character-aligned pinyin, and English translation. Read the words, expose the premise, then test the principle."}</p></header>
        <div className="book-passages">{book.passages.map((passage) => <section key={passage.ref} id={passage.ref.replace(".", "-")} className="book-passage"><div className="book-ref"><a href={`/${locale}/books/${slug}/${passageSlug(passage.ref)}`}>{passage.ref}<small>{zh ? "单章阅读 →" : "Open passage →"}</small></a></div><div><RubyLine passage={passage} locale={locale}/>{!zh && <p className="book-english">{passage.english}</p>}</div></section>)}</div>
        <nav className="book-pagination">{previous ? <a href={`/${locale}/books/${previous}`}>← {zh ? simplifiedBookNames[book.index - 1] : corpus.chapters[book.index - 1].name}</a> : <span/>}<a href={`/${locale}`}>{zh ? "返回总览" : "Back to overview"}</a>{next ? <a href={`/${locale}/books/${next}`}>{zh ? simplifiedBookNames[book.index + 1] : corpus.chapters[book.index + 1].name} →</a> : <span/>}</nav>
      </article></div>
  </main>;
}
