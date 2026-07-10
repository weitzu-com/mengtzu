import type { Metadata } from "next";
import { bookSlugs, corpus, englishBookNames } from "../../mencius-data";

export const metadata: Metadata = { title: "The Mencius — Fourteen Parts", description: "Browse all fourteen parts and 260 passages of the Mencius, each with a permanent reading page.", alternates: { canonical: "https://www.mengtzu.com/en/books", languages: { en: "https://www.mengtzu.com/en/books", "zh-Hans": "https://www.mengtzu.com/zh/books" } } };

export default function BooksPage() {
  return <main><header className="masthead"><a className="brand" href="/en"><span className="seal">孟</span><span>mengtzu<small>.com</small></span></a><nav><a className="active-link" href="/en/books">Books</a><a href="/en/method">Method</a><a href="/en/sources">Sources</a><span className="locale-switch"><a href="/zh">简体中文</a><a className="active" href="/en">English</a></span></nav></header>
    <section className="info-hero"><div className="eyebrow">Seven books · Fourteen parts · 260 passages</div><h1>Fourteen parts.<br/>One complete Mencius.</h1><p>A title is only an entry point; the passage is where the argument happens. Every part has a permanent page, stable references, and direct links for reading and citation.</p></section>
    <section className="books-grid">{corpus.chapters.map((chapter,index)=><a key={chapter.id} href={`/en/books/${bookSlugs[index]}`}><span>{String(index+1).padStart(2,"0")}</span><h2>{englishBookNames[index]}</h2><p>{chapter.passages.length} passages · {chapter.name}</p><b>Read this part →</b></a>)}</section>
  </main>;
}
