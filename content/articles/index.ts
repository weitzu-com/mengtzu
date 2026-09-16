// Every article JSON in this folder must be registered here so that the build,
// sitemap, feed, and llms.txt see it. The daily routine appends one line per
// article; tests/rendered-html.test.mjs fails if a JSON file is missing here.
import menciusVsXunziHumanNature from "./mencius-vs-xunzi-human-nature.json";

export const articleSources = [menciusVsXunziHumanNature];
