import type { Metadata } from "next";
import { bookSlugs, corpus, simplifiedBookNames } from "../../mencius-data";

export const metadata: Metadata = { title: "《孟子》十四卷｜完整目录", description: "《孟子》十四卷完整目录，逐卷阅读简体原文与逐字拼音。", alternates: { canonical: "https://www.mengtzu.com/zh/books" } };

export default function BooksPage() {
  return <main><header className="masthead"><a className="brand" href="/zh"><span className="seal">孟</span><span>mengtzu<small>.com</small></span></a><nav><a className="active-link" href="/zh/books">十四卷</a><a href="/zh/method">读法</a><a href="/zh/sources">版本</a><span className="locale-switch"><a className="active" href="/zh">简体中文</a><a href="/en">英文版</a></span></nav></header>
    <section className="info-hero"><div className="eyebrow">七篇 · 上下十四卷 · 二百六十章</div><h1>十四卷，<br/>一部完整的《孟子》。</h1><p>篇名只是入口，章句才是思想发生的现场。每一卷都有固定页面、独立网址与逐章编号，可以单独阅读、分享和引用。</p></section>
    <section className="books-grid">{corpus.chapters.map((chapter,index)=><a key={chapter.id} href={`/zh/books/${bookSlugs[index]}`}><span>{String(index+1).padStart(2,"0")}</span><h2>{simplifiedBookNames[index]}</h2><p>{chapter.passages.length} 章</p><b>开始阅读 →</b></a>)}</section>
  </main>;
}
