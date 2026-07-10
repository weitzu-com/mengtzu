import corpus from "../public/data/mencius.json";

export const bookSlugs = [
  "liang-hui-wang-i", "liang-hui-wang-ii", "gong-sun-chou-i", "gong-sun-chou-ii",
  "teng-wen-gong-i", "teng-wen-gong-ii", "li-lou-i", "li-lou-ii",
  "wan-zhang-i", "wan-zhang-ii", "gao-zi-i", "gao-zi-ii", "jin-xin-i", "jin-xin-ii",
] as const;

export const simplifiedBookNames = ["梁惠王上", "梁惠王下", "公孙丑上", "公孙丑下", "滕文公上", "滕文公下", "离娄上", "离娄下", "万章上", "万章下", "告子上", "告子下", "尽心上", "尽心下"];
export type BookSlug = typeof bookSlugs[number];
export type Locale = "zh" | "en";
export type Passage = (typeof corpus.chapters)[number]["passages"][number];

export function getBook(slug: string) {
  const index = bookSlugs.indexOf(slug as BookSlug);
  if (index < 0) return null;
  return { ...corpus.chapters[index], index, slug: bookSlugs[index], simplifiedName: simplifiedBookNames[index] };
}
export { corpus };
