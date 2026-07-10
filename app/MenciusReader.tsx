"use client";

import { useEffect, useMemo, useState } from "react";
import { bookSlugs } from "./mencius-data";

type Locale = "zh" | "en";
type Passage = { ref: string; chinese: string; simplifiedChinese: string; pinyin: string; pinyinTokens: string[]; english: string; confidence: number };
type Chapter = { id: number; name: string; passages: Passage[] };
type Corpus = { chapters: Chapter[]; sources: Record<string, string> };
type Result = Passage & { chapterId: number; chapterName: string };

const copy = {
  zh: {
    books: "十四卷", method: "读法", sources: "版本", label: "七篇 · 十四卷 · 二百六十章 · 简体拼音版",
    headline: <>让《孟子》<br/><em>成为今天的问题。</em></>,
    intro: "完整收录《孟子》十四卷，以简体中文与逐字拼音呈现。不是把经典变成答案，而是从原话、前提和原则重新阅读。",
    open: "打开十四卷", resume: "继续阅读", daily: "今日章句", study: "进入全文",
    stats: [["十四卷","梁惠王至尽心，全文完整"],["二百六十章","简体原文与拼音逐章对应"],["逐字拼音","汉字与读音保持位置对应"],["可追溯","版本与算法生成内容均明确标注"]],
    text: "看见原话", premise: "找到前提", principle: "检验原则", textD: "先读原文，不急着接受解释。", premiseD: "辨认论证依赖的人性与现实判断。", principleD: "问它在今天是否仍成立、边界何在。",
    search: "搜索十四卷：原文或拼音", pinyin: "拼音", english: "英文", global: "全书检索", results: "条结果", bookmark: "书签", saved: "已存", empty: "全书未找到相符内容。换一个关键词试试。",
    sourceTitle: "读经典，也读版本。", sourceBody: "简体原文由维基文库繁体底本转换；拼音自动生成，古汉语多音字仍需人工校订。", principleBody: "每条保留章节编号。自动生成内容明确标注，不把算法结果伪装成定本。"
  },
  en: {
    books: "Books", method: "Method", sources: "Sources", label: "Seven books · Fourteen parts · 260 passages · Bilingual",
    headline: <>Make the <em>Mencius</em><br/>a living question.</>,
    intro: "All fourteen parts of the Mencius, presented passage by passage with the Chinese original, aligned pinyin, and James Legge’s public-domain English translation. Begin with the words, expose the premise, then test the principle.",
    open: "Open the fourteen parts", resume: "Continue reading", daily: "Passage of the day", study: "Open the complete text",
    stats: [["14 parts","From King Hui of Liang to Jin Xin"],["260 passages","Chinese, pinyin, and English aligned"],["Bilingual","Chinese original + public-domain English"],["Traceable","Sources and generated layers are disclosed"]],
    text: "Read the words", premise: "Expose the premise", principle: "Test the principle", textD: "Begin with the text before accepting an interpretation.", premiseD: "Find the claims about human nature and reality beneath the argument.", principleD: "Ask whether it still holds today—and where it stops.",
    search: "Search all fourteen parts in Chinese, pinyin, or English", pinyin: "Pinyin", english: "English", global: "All-text search", results: "results", bookmark: "Save", saved: "Saved", empty: "No result across the complete text. Try another term.",
    sourceTitle: "Read the classic. Read its sources.", sourceBody: "Chinese base text: Chinese Wikisource. English: James Legge’s 1895 public-domain translation. Pinyin is generated and classical polyphones still require editorial review.", principleBody: "Every passage keeps its canonical reference. Generated material is labeled rather than presented as an authoritative edition."
  }
};

function RubyText({ passage, locale }: { passage: Passage; locale: Locale }) {
  const text = locale === "zh" ? passage.simplifiedChinese : passage.chinese;
  return <p className="ruby-text">{Array.from(text).map((char, index) => {
    const reading = passage.pinyinTokens?.[index];
    return /[\u3400-\u9fff]/.test(char) ? <ruby key={`${passage.ref}-${index}`}>{char}<rt>{reading}</rt></ruby> : <span key={`${passage.ref}-${index}`}>{char}</span>;
  })}</p>;
}

export default function MenciusReader({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [corpus, setCorpus] = useState<Corpus | null>(null);
  const [chapterId, setChapterId] = useState(1);
  const [query, setQuery] = useState("");
  const [showPinyin, setShowPinyin] = useState(true);
  const [showEnglish, setShowEnglish] = useState(locale === "en");
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
    return corpus.chapters.flatMap((c) => c.passages.filter((p) => `${p.chinese} ${p.simplifiedChinese} ${p.pinyin} ${locale === "en" ? p.english : ""}`.toLowerCase().includes(q)).map((p) => ({ ...p, chapterId: c.id, chapterName: c.name })));
  }, [chapter, corpus, query]);

  const saveBookmark = (p: Result) => { const next = { chapterId: p.chapterId, ref: p.ref }; localStorage.setItem("mencius-bookmark", JSON.stringify(next)); setBookmark(next); };
  const resume = () => { if (!bookmark) return; setChapterId(bookmark.chapterId); setQuery(""); requestAnimationFrame(() => document.getElementById(`passage-${bookmark.ref.replaceAll(".", "-")}`)?.scrollIntoView({ behavior: "smooth" })); };
  if (!corpus || !chapter) return <main className="loading">{locale === "zh" ? "正在展卷…" : "Opening the text…"}</main>;
  const featured = corpus.chapters[0].passages[0];

  return <main>
    <header className="masthead">
      <a className="brand" href={`/${locale}`}><span className="seal">孟</span><span>mengtzu<small>.com</small></span></a>
      <nav><a href="#reader">{t.books}</a><a href="#method">{t.method}</a><a href="#sources">{t.sources}</a><span className="locale-switch"><a className={locale === "zh" ? "active" : ""} href="/zh">简体中文</a><a className={locale === "en" ? "active" : ""} href="/en">{locale === "zh" ? "英文版" : "English"}</a></span></nav>
    </header>

    <section className="home-hero" id="top">
      <div className="home-intro"><div className="eyebrow">{t.label}</div><h1>{t.headline}</h1><p>{t.intro}</p><div className="hero-actions"><a className="primary-action" href="#reader">{t.open}</a>{bookmark && <button onClick={resume}>{t.resume} · {bookmark.ref}</button>}</div></div>
      <div className="featured"><span className="reading-dot"/><small>{t.daily}</small><b>{locale === "zh" ? featured.simplifiedChinese : featured.chinese}</b>{locale === "en" && <p>{featured.english}</p>}<a href="#reader">{t.study} →</a></div>
    </section>

    <section className="site-stats">{t.stats.map(([value, description]) => <div key={value}><b>{value}</b><span>{description}</span></div>)}</section>
    <section className="method" id="method"><div><span>{locale === "zh" ? "一 · 原文" : "01 · TEXT"}</span><h2>{t.text}</h2><p>{t.textD}</p></div><div><span>{locale === "zh" ? "二 · 前提" : "02 · PREMISE"}</span><h2>{t.premise}</h2><p>{t.premiseD}</p></div><div><span>{locale === "zh" ? "三 · 原则" : "03 · PRINCIPLE"}</span><h2>{t.principle}</h2><p>{t.principleD}</p></div></section>

    <section className="reader" id="reader"><aside><div className="aside-title">{t.books}<small>{locale === "zh" ? "全书卷目" : "14 PARTS"}</small></div>{corpus.chapters.map((c, index) => <a key={c.id} className={c.id === chapterId ? "active" : ""} href={`/${locale}/books/${bookSlugs[index]}`}><span>{String(c.id).padStart(2,"0")}</span>{c.name}</a>)}</aside>
      <article><div className="reader-head"><div><span>{query ? t.global : `${locale === "zh" ? "卷" : "PART"} ${String(chapter.id).padStart(2,"0")}`}</span><h2>{query ? `“${query}”` : chapter.name}</h2><small>{query ? `${results.length} ${t.results}` : `${chapter.passages.length} ${locale === "zh" ? "章" : "passages"}`}</small></div><div className="tools"><label className="search"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.search} aria-label={t.search}/></label><button aria-pressed={showPinyin} onClick={() => setShowPinyin(!showPinyin)}>{t.pinyin}</button>{locale === "en" && <button aria-pressed={showEnglish} onClick={() => setShowEnglish(!showEnglish)}>English</button>}</div></div>
        <div className="passages">{results.map((p) => <section className="passage" id={`passage-${p.ref.replaceAll(".", "-")}`} key={`${p.chapterId}-${p.ref}`}><div className="ref"><span>{p.ref}</span>{query && <small>{p.chapterName}</small>}<button className={bookmark?.ref === p.ref ? "saved" : ""} onClick={() => saveBookmark(p)}>{bookmark?.ref === p.ref ? t.saved : t.bookmark}</button></div><div className="zh">{showPinyin ? <RubyText passage={p} locale={locale}/> : <p>{locale === "zh" ? p.simplifiedChinese : p.chinese}</p>}</div>{showEnglish && <div className="en">{p.english}</div>}</section>)}{!results.length && <p className="empty">{t.empty}</p>}</div>
      </article></section>

    <footer id="sources"><div><span className="seal">孟</span><h2>{t.sourceTitle}</h2></div><div><b>{locale === "zh" ? "文本来源" : "SOURCES & LICENSE"}</b><p>{t.sourceBody}</p></div><div><b>{locale === "zh" ? "开放原则" : "OPEN METHOD"}</b><p>{t.principleBody}</p><a href="https://github.com/weitzu-com/mengtzu">{locale === "zh" ? "源代码" : "GitHub"} ↗</a></div></footer>
  </main>;
}
