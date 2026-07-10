"use client";

import { useEffect, useMemo, useState } from "react";

type Passage = { ref: string; chinese: string; pinyin: string; pinyinTokens: string[]; english: string; confidence: number };
type Chapter = { id: number; name: string; passages: Passage[] };
type Corpus = { chapters: Chapter[]; sources: Record<string, string> };
type Result = Passage & { chapterId: number; chapterName: string };

function RubyText({ passage }: { passage: Passage }) {
  return <p className="ruby-text">{Array.from(passage.chinese).map((char, index) => {
    const reading = passage.pinyinTokens?.[index];
    const isHan = /[\u3400-\u9fff]/.test(char);
    return isHan ? <ruby key={`${passage.ref}-${index}`}>{char}<rt>{reading}</rt></ruby> : <span key={`${passage.ref}-${index}`}>{char}</span>;
  })}</p>;
}

export default function MenciusReader() {
  const [corpus, setCorpus] = useState<Corpus | null>(null);
  const [chapterId, setChapterId] = useState(1);
  const [query, setQuery] = useState("");
  const [showPinyin, setShowPinyin] = useState(true);
  const [showEnglish, setShowEnglish] = useState(true);
  const [bookmark, setBookmark] = useState<{ chapterId: number; ref: string } | null>(null);

  useEffect(() => {
    fetch("/data/mencius.json").then((r) => r.json()).then(setCorpus);
    const saved = localStorage.getItem("mencius-bookmark");
    if (saved) { const parsed = JSON.parse(saved); setBookmark(parsed); setChapterId(parsed.chapterId); }
  }, []);
  const chapter = corpus?.chapters.find((c) => c.id === chapterId);
  const results = useMemo<Result[]>(() => {
    if (!chapter || !corpus) return [];
    const q = query.trim().toLowerCase();
    if (!q) return chapter.passages.map((p) => ({ ...p, chapterId: chapter.id, chapterName: chapter.name }));
    return corpus.chapters.flatMap((c) => c.passages
      .filter((p) => `${p.chinese} ${p.pinyin} ${p.english}`.toLowerCase().includes(q))
      .map((p) => ({ ...p, chapterId: c.id, chapterName: c.name })));
  }, [chapter, corpus, query]);

  const saveBookmark = (result: Result) => {
    const next = { chapterId: result.chapterId, ref: result.ref };
    localStorage.setItem("mencius-bookmark", JSON.stringify(next));
    setBookmark(next);
  };

  const resume = () => {
    if (!bookmark) return;
    setChapterId(bookmark.chapterId);
    setQuery("");
    requestAnimationFrame(() => document.getElementById(`passage-${bookmark.ref.replaceAll(".", "-")}`)?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  if (!corpus || !chapter) return <main className="loading">正在展卷 · Opening the text…</main>;

  return (
    <main>
      <header className="masthead">
        <a className="brand" href="#top" aria-label="孟子首页"><span className="seal">孟</span><span>孟子<br/><small>MÈNGZǏ · FIRST PRINCIPLES</small></span></a>
        <nav><a href="#reader">全文</a><a href="#method">读法</a><a href="#sources">版本</a></nav>
      </header>

      <section className="hero" id="top">
        <div className="eyebrow">THE MENCIUS · COMPLETE TEXT · 7 BOOKS / 14 PARTS</div>
        <h1>先问根本，<br/><em>再读孟子。</em></h1>
        <p className="hero-copy">不是把经典变成答案，而是把每一章还原为一个问题：孟子看见了什么事实？采用了什么前提？由此推出什么原则？</p>
        {bookmark ? <button className="start resume" onClick={resume}>续读 {bookmark.ref} <span>↓</span></button> : <a className="start" href="#reader">从梁惠王开始 <span>↓</span></a>}
        <div className="hero-quote"><span>01 · 利与义</span><b>王何必曰利？<br/>亦有仁义而已矣。</b><small>Why must Your Majesty speak of profit?<br/>Let benevolence and righteousness be the only themes.</small></div>
      </section>

      <section className="method" id="method">
        <div><span>一 · TEXT</span><h2>看见原话</h2><p>先读原文，不急着接受解释。</p></div>
        <div><span>二 · PREMISE</span><h2>找到前提</h2><p>辨认论证依赖的人性与现实判断。</p></div>
        <div><span>三 · PRINCIPLE</span><h2>检验原则</h2><p>问它在今天是否仍成立、边界何在。</p></div>
      </section>

      <section className="reader" id="reader">
        <aside>
          <div className="aside-title">十四卷 <small>14 PARTS</small></div>
          {corpus.chapters.map((c) => <button key={c.id} className={c.id === chapterId ? "active" : ""} onClick={() => { setChapterId(c.id); setQuery(""); document.querySelector("#reader")?.scrollIntoView(); }}><span>{String(c.id).padStart(2, "0")}</span>{c.name}</button>)}
        </aside>
        <article>
          <div className="reader-head">
            <div><span>{query ? "全书检索" : `卷 ${String(chapter.id).padStart(2, "0")}`}</span><h2>{query ? `“${query}”` : chapter.name}</h2><small>{query ? `十四卷 · ${results.length} 条结果` : `${chapter.passages.length} 章`}</small></div>
            <div className="tools">
              <label className="search"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索原文、拼音或英文" aria-label="搜索全文"/></label>
              <button aria-pressed={showPinyin} onClick={() => setShowPinyin(!showPinyin)}>拼音 {showPinyin ? "开" : "关"}</button>
              <button aria-pressed={showEnglish} onClick={() => setShowEnglish(!showEnglish)}>EN {showEnglish ? "ON" : "OFF"}</button>
            </div>
          </div>
          <div className="passages">
            {results.map((p) => <section className="passage" id={`passage-${p.ref.replaceAll(".", "-")}`} key={`${p.chapterId}-${p.ref}`}>
              <div className="ref"><span>{p.ref}</span>{query && <small>{p.chapterName}</small>}<button className={bookmark?.ref === p.ref ? "saved" : ""} onClick={() => saveBookmark(p)} aria-label={`保存阅读位置 ${p.ref}`}>{bookmark?.ref === p.ref ? "已存" : "书签"}</button></div>
              <div className="zh">{showPinyin ? <RubyText passage={p}/> : <p>{p.chinese}</p>}</div>
              {showEnglish && <div className="en">{p.english}</div>}
            </section>)}
            {!results.length && <p className="empty">全书未找到相符内容。换一个关键词试试。</p>}
          </div>
        </article>
      </section>

      <footer id="sources">
        <div><span className="seal">孟</span><h2>读经典，<br/>也读版本。</h2></div>
        <div><b>文本来源</b><p>中文：维基文库底本（CC BY-SA 4.0），由 ChinTransMem 对齐整理。英文：James Legge 1895 年公版译本。拼音：pinyin-pro 自动生成，古汉语多音字仍需人工校订。</p></div>
        <div><b>开放原则</b><p>每一条都保留章节编号；自动生成内容明确标注，不把算法结果伪装成定本。</p><a href="https://github.com/chinese-poetry/chinese-poetry" target="_blank" rel="noreferrer">原文数据参考 ↗</a></div>
      </footer>
    </main>
  );
}
