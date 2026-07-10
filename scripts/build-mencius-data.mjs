import fs from "node:fs";
import path from "node:path";
import { pinyin } from "pinyin-pro";

const sourceDir = path.resolve("work/source/aligned");
const outDir = path.resolve("public/data");
const names = [
  "梁惠王上", "梁惠王下", "公孫丑上", "公孫丑下", "滕文公上", "滕文公下", "離婁上",
  "離婁下", "萬章上", "萬章下", "告子上", "告子下", "盡心上", "盡心下",
];

const files = fs.readdirSync(sourceDir).filter((name) => name.endsWith(".jsonl")).sort();
const alignedPinyin = (text) => pinyin(text, { toneType: "symbol", type: "all", nonZh: "consecutive" })
  .flatMap((token) => token.isZh ? [token.pinyin] : Array.from(token.origin));
const chapters = files.map((file, chapterIndex) => {
  const passages = fs.readFileSync(path.join(sourceDir, file), "utf8")
    .trim().split("\n").filter(Boolean).map((line) => JSON.parse(line))
    .map((row) => ({
      ref: row.chinese_ref,
      chinese: row.chinese_text,
      pinyin: pinyin(row.chinese_text, { toneType: "symbol", type: "string", nonZh: "consecutive" }),
      pinyinTokens: alignedPinyin(row.chinese_text),
      english: row.translation_text,
      confidence: row.confidence,
    }));
  return { id: chapterIndex + 1, name: names[chapterIndex], passages };
});

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "mencius.json"), JSON.stringify({
  title: "孟子",
  romanizedTitle: "Mèngzǐ",
  generatedAt: new Date().toISOString(),
  sources: {
    chinese: "Chinese Wikisource (CC BY-SA 4.0), aligned by ChinTransMem",
    english: "James Legge, The Chinese Classics, Vol. II (1895), public domain",
    pinyin: "Generated with pinyin-pro; classical polyphones require editorial review",
  },
  chapters,
}));

console.log(`Built ${chapters.length} chapters / ${chapters.reduce((n, c) => n + c.passages.length, 0)} passages.`);
