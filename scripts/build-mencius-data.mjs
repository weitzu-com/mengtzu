import fs from "node:fs";
import path from "node:path";
import { pinyin } from "pinyin-pro";
import { Converter } from "opencc-js";

const sourceFile = path.resolve("data/mengzi.json");
const existingCorpusFile = path.resolve("public/data/mencius.json");
const outDir = path.resolve("public/data");
const existingCorpus = JSON.parse(fs.readFileSync(existingCorpusFile, "utf8"));
const sourceChapters = fs.existsSync(sourceFile)
  ? JSON.parse(fs.readFileSync(sourceFile, "utf8"))
  : null;
const toSimplified = Converter({ from: "hk", to: "cn" });
const alignedPinyin = (text) => pinyin(text, { toneType: "symbol", type: "all", nonZh: "consecutive" })
  .flatMap((token) => token.isZh ? [token.pinyin] : Array.from(token.origin));

const hasComparableSource =
  Array.isArray(sourceChapters) &&
  sourceChapters.length === existingCorpus.chapters.length;

const chapters = existingCorpus.chapters.map((existingChapter, chapterIndex) => {
  const sourceChapter = hasComparableSource ? sourceChapters[chapterIndex] : null;
  if (
    sourceChapter &&
    Array.isArray(sourceChapter.paragraphs) &&
    sourceChapter.paragraphs.length !== existingChapter.passages.length
  ) {
    console.warn(
      `Skipping direct chapter ${chapterIndex + 1} alignment: ${sourceChapter.paragraphs.length} source paragraphs vs ${existingChapter.passages.length} packaged passages.`,
    );
  }

  const passages = existingChapter.passages.map((existingPassage) => {
    const chineseText = existingPassage.chinese;
    return {
      ref: existingPassage.ref,
      chinese: chineseText,
      simplifiedChinese: toSimplified(chineseText),
      pinyin: pinyin(chineseText, { toneType: "symbol", type: "string", nonZh: "consecutive" }),
      pinyinTokens: alignedPinyin(chineseText),
      english: existingPassage.english,
      confidence: existingPassage.confidence,
    };
  });

  return { id: chapterIndex + 1, name: existingChapter.name, passages };
});

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "mencius.json"), JSON.stringify({
  title: "孟子",
  romanizedTitle: "Mèngzǐ",
  generatedAt: new Date().toISOString(),
  sources: {
    chinese:
      hasComparableSource
        ? "Packaged passage corpus with optional chapter-level spot checks against data/mengzi.json; original packaged metadata points to Chinese Wikisource / ChinTransMem alignment"
        : "Packaged passage corpus; original packaged metadata points to Chinese Wikisource / ChinTransMem alignment",
    english: existingCorpus.sources?.english ?? "James Legge, The Chinese Classics, Vol. II (1895), public domain",
    pinyin: "Generated with pinyin-pro; classical polyphones require editorial review",
  },
  chapters,
}));

console.log(`Built ${chapters.length} chapters / ${chapters.reduce((n, c) => n + c.passages.length, 0)} passages.`);
