import type { Metadata } from "next";

export const metadata: Metadata = { title: "读法｜从第一性原理重读《孟子》", description: "不先接受结论，从原话、事实、前提、推理和边界重新阅读《孟子》。", alternates: { canonical: "https://www.mengtzu.com/zh/method" } };

export default function MethodPage() {
  return <main><header className="masthead"><a className="brand" href="/zh"><span className="seal">孟</span><span>mengtzu<small>.com</small></span></a><nav><a href="/zh/books">十四卷</a><a className="active-link" href="/zh/method">读法</a><a href="/zh/sources">版本</a><span className="locale-switch"><a className="active" href="/zh">简体中文</a><a href="/en">英文版</a></span></nav></header>
    <section className="info-hero"><div className="eyebrow">不背答案 · 追问根本</div><h1>先拆开，<br/>再理解。</h1><p>第一性原理不是把古人的话包装成现代口号，而是暂时放下权威，从最基本的事实和假设开始，重新检查一条论证为什么成立。</p></section>
    <section className="principle-steps"><article><span>一</span><h2>确认原话</h2><p>先确定孟子究竟说了什么，保留上下文、对话对象和章节位置，不用转述代替原文。</p></article><article><span>二</span><h2>还原问题</h2><p>区分表面提问与根本矛盾：讨论的是利益、秩序、人性，还是行动者真正承担的责任。</p></article><article><span>三</span><h2>找出前提</h2><p>把没有明说的判断写出来，例如人是否具有恻隐之心、制度是否会放大人的选择。</p></article><article><span>四</span><h2>检查推理</h2><p>观察结论如何从前提推出，辨认类比、反问、归谬和经验判断各自承担什么作用。</p></article><article><span>五</span><h2>测试边界</h2><p>问它在什么条件下成立，遇到哪些反例会失效，避免把一句话无限扩大。</p></article><article><span>六</span><h2>回到今日</h2><p>不急于套用，而是把原则转化为今天可以观察、讨论和验证的问题。</p></article></section>
  </main>;
}
