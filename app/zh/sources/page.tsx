import type { Metadata } from "next";

export const metadata: Metadata = { title: "版本与来源｜《孟子》简体拼音版", description: "说明《孟子》中文底本、简体转换、拼音生成、章节编号与校订边界。", alternates: { canonical: "https://www.mengtzu.com/zh/sources" } };

export default function SourcesPage() {
  return <main><header className="masthead"><a className="brand" href="/zh"><span className="seal">孟</span><span>mengtzu<small>.com</small></span></a><nav><a href="/zh/books">十四卷</a><a href="/zh/method">读法</a><a className="active-link" href="/zh/sources">版本</a><span className="locale-switch"><a className="active" href="/zh">简体中文</a><a href="/en">英文版</a></span></nav></header>
    <section className="info-hero"><div className="eyebrow">来源清楚 · 边界公开 · 可以复核</div><h1>版本不是附注，<br/>是可信度本身。</h1><p>古籍网站最基础的责任，是告诉读者文字从哪里来、哪些部分经过转换、哪些部分由程序生成，以及哪里仍需要人工校订。</p></section>
    <section className="source-list"><article><span>一 · 中文底本</span><h2>维基文库《孟子》</h2><p>十四卷章节结构与中文正文以维基文库公开底本为基础，并参考公开古籍数据集交叉核对。原作属于公有领域，整理文字遵循原页面许可。</p></article><article><span>二 · 简体转换</span><h2>保留章句，转换字形</h2><p>中文站由繁体底本自动转换为简体字。转换不改变章节顺序和标点结构；异体字与古今字仍可能需要人工复核。</p></article><article><span>三 · 拼音生成</span><h2>逐字对应，不冒充定音</h2><p>拼音由程序按语境生成，并与每个汉字保持位置对应。古汉语存在多音字、通假字和专名读音，因此自动结果只作为阅读辅助。</p></article><article><span>四 · 章节编号</span><h2>每章都可定位</h2><p>保留通行的卷次与章次编号，使不同版本之间可以相互参照，也让每段文字拥有稳定的引用位置。</p></article><article><span>五 · 校订原则</span><h2>错误可以被指出和修正</h2><p>不隐藏自动处理过程，不把程序输出称为权威定本。后续校订应记录改动原因、依据和影响范围。</p></article></section>
  </main>;
}
