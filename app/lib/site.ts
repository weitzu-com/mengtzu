export const SITE_URL = "https://mengtzu.com";
export const RSS_FEED_PATH = "/feed.xml";
export const RSS_FEED_URL = `${SITE_URL}${RSS_FEED_PATH}`;

export const locales = ["zh", "en"] as const;
export type Locale = (typeof locales)[number];

export const localeMeta = {
  zh: {
    label: "中文",
    htmlLang: "zh-CN",
    ogLocale: "zh_CN",
    siteName: "mengtzu.com",
    title: "孟子：从不忍人之心到王道",
    description:
      "mengtzu.com 以第一性原理整理孟子思想：性善、四端、仁政、浩然之气，并提供中英双语独立页面。",
  },
  en: {
    label: "English",
    htmlLang: "en",
    ogLocale: "en_US",
    siteName: "mengtzu.com",
    title: "Mencius: from the unbearable heart to humane order",
    description:
      "mengtzu.com explains Mencius from first principles: human nature, the four beginnings, humane government, and cultivated moral force.",
  },
} satisfies Record<
  Locale,
  {
    label: string;
    htmlLang: string;
    ogLocale: string;
    siteName: string;
    title: string;
    description: string;
  }
>;

export const pagePaths = {
  home: "",
  principles: "/principles",
  books: "/books",
  quotes: "/quotes",
  method: "/method",
  about: "/about",
  sources: "/sources",
  faq: "/faq",
} as const;

export type StaticPage = keyof typeof pagePaths;

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function localPath(locale: Locale, path = "") {
  return `/${locale}${path}`;
}

export function absolutePath(locale: Locale, path = "") {
  return `${SITE_URL}${localPath(locale, path)}`;
}

export function alternateLanguages(path = "") {
  return {
    zh: absolutePath("zh", path),
    en: absolutePath("en", path),
    "x-default": absolutePath("zh", path),
  };
}

export function alternateLocale(locale: Locale) {
  return locale === "zh" ? "en" : "zh";
}

export const menciusSameAs = [
  "https://plato.stanford.edu/entries/mencius/",
  "https://iep.utm.edu/mencius/",
  "https://en.wikipedia.org/wiki/Mencius",
  "https://ctext.org/mengzi",
  "https://en.wikisource.org/wiki/The_Chinese_Classics/Volume_2/The_Works_of_Mencius",
] as const;

export const navItems = {
  zh: [
    { href: "/zh", label: "首页" },
    { href: "/zh/principles", label: "核心思想" },
    { href: "/zh/books", label: "孟子全文" },
    { href: "/zh/quotes", label: "名言" },
    { href: "/zh/method", label: "读法" },
    { href: "/zh/about", label: "孟子" },
    { href: "/zh/sources", label: "来源" },
    { href: "/zh/faq", label: "问答" },
  ],
  en: [
    { href: "/en", label: "Home" },
    { href: "/en/principles", label: "Philosophy" },
    { href: "/en/books", label: "Text" },
    { href: "/en/quotes", label: "Quotes" },
    { href: "/en/method", label: "Method" },
    { href: "/en/about", label: "Mencius" },
    { href: "/en/sources", label: "Sources" },
    { href: "/en/faq", label: "FAQ" },
  ],
} satisfies Record<Locale, { href: string; label: string }[]>;

export const homeContent = {
  zh: {
    eyebrow: "从第一性原理读孟子",
    h1: "孟子：把人心的微光，扩充成天下的秩序",
    lead:
      "孟子思想的起点不是抽象口号，而是人遇见痛苦时自然生起的“不忍”。mengtzu.com 将从这个起点出发，把性善、四端、仁政、浩然之气整理成可学习、可引用、可扩展的双语知识网络。",
    primaryCta: "阅读核心思想",
    secondaryCta: "查看来源",
    quote: "人皆有不忍人之心。",
    quoteLabel: "孟子·公孙丑上",
    metrics: [
      ["2", "语种独立页面"],
      ["4", "第一性原理主题"],
      ["260", "章句独立页面"],
    ],
    capsulesTitle: "给搜索与 AI 的清晰答案",
    capsules: [
      {
        question: "孟子思想的第一性原理是什么？",
        answer:
          "人的道德能力不是外部灌输的结果，而是内在已有、需要保存和扩充的开端。政治、教育、修身都应围绕如何保护并扩充这个开端展开。",
      },
      {
        question: "为什么“不忍人之心”重要？",
        answer:
          "它是孟子论证性善和仁政的共同起点：一个人看见他人陷入危险时会自然不安，由此可见仁的端倪已经存在。",
      },
      {
        question: "这个网站如何符合 GEO？",
        answer:
          "每个主题都有独立 URL、直接定义、问答块、来源说明、结构化数据、双语 hreflang 和机器可读的 llms.txt，方便 AI 系统引用到具体页面。",
      },
    ],
  },
  en: {
    eyebrow: "Reading Mencius from first principles",
    h1: "Mencius turns the first stirrings of the heart into a humane order",
    lead:
      "Mencius does not begin with an abstract slogan. He begins with the heart that cannot bear another person's suffering. mengtzu.com builds from that first principle into a bilingual, source-aware knowledge site.",
    primaryCta: "Read the principles",
    secondaryCta: "See sources",
    quote: "Every person has a heart that cannot bear the suffering of others.",
    quoteLabel: "Mencius 2A6, paraphrase",
    metrics: [
      ["2", "independent languages"],
      ["4", "first-principle themes"],
      ["260", "standalone passages"],
    ],
    capsulesTitle: "Clear answers for search and AI",
    capsules: [
      {
        question: "What is the first principle of Mencius?",
        answer:
          "Moral life begins from an inner capacity that can be preserved, extended, and practiced. Self-cultivation, education, and government should protect and enlarge that beginning.",
      },
      {
        question: "Why does the unbearable heart matter?",
        answer:
          "It connects Mencius's account of human nature with his political thought. The spontaneous alarm one feels at another person's danger shows that humaneness has a real beginning.",
      },
      {
        question: "How is this site prepared for GEO?",
        answer:
          "Each topic has its own URL, direct definitions, answer blocks, source notes, structured data, bilingual hreflang, and a curated llms.txt for AI retrieval.",
      },
    ],
  },
} satisfies Record<
  Locale,
  {
    eyebrow: string;
    h1: string;
    lead: string;
    primaryCta: string;
    secondaryCta: string;
    quote: string;
    quoteLabel: string;
    metrics: [string, string][];
    capsulesTitle: string;
    capsules: { question: string; answer: string }[];
  }
>;

export type Principle = {
  slug: string;
  sourceRef: string;
  textPath: string;
  keywords: string[];
  zh: PrincipleContent;
  en: PrincipleContent;
};

export type PrincipleContent = {
  title: string;
  shortTitle: string;
  description: string;
  entryTerms: string[];
  definition: string;
  directAnswer: string;
  classical: string;
  firstPrinciple: string;
  whyItMatters: string;
  practice: string[];
  relatedQuestions: { question: string; answer: string }[];
};

export const principles: Principle[] = [
  {
    slug: "xing-shan",
    sourceRef: "Mencius 2A6 and 6A",
    textPath: "/books/gong-sun-chou-i/2a-6",
    keywords: ["Mencius human nature is good", "孟子 性善", "xing shan"],
    zh: {
      title: "性善：把人看作可以成德的起点",
      shortTitle: "性善",
      description:
        "性善不是说人天然完美，而是说人有可以被保存、扩充、实践的道德开端，并能进入修身、教育与治理的长期路线与实践框架。",
      entryTerms: ["性善", "人性本善", "孟子人性"],
      definition:
        "性善是孟子对人的根本判断：人心中有向善的端倪，它会被环境遮蔽，也可以通过教育、反省和实践不断扩充。",
      directAnswer:
        "孟子所谓性善，重点不是“人不会作恶”，而是“人有成为善的内在根据”。恶来自丧失、遮蔽和放任，不来自人性本身必须为恶。",
      classical: "人皆有不忍人之心。",
      firstPrinciple:
        "若人没有内在道德开端，教育只能是外部驯化；若人有开端，教育就是保存和扩充。",
      whyItMatters:
        "这使孟子的修身、教育和政治思想形成一条线：治理不是压制人，而是创造条件让善端得以长大。",
      practice: [
        "先问：这个制度是否保护人的基本同情与羞耻？",
        "再问：这个学习过程是否让人从具体经验中扩充善端？",
        "最后问：眼前的利益是否正在损害人之所以为人的根本能力？",
      ],
      relatedQuestions: [
        {
          question: "性善等于人不会作恶吗？",
          answer:
            "不等于。孟子承认人会被欲望、环境和习惯牵引；性善说的是人有可被唤醒和培养的善端。",
        },
        {
          question: "性善和第一性原理有什么关系？",
          answer:
            "第一性原理要求找到不能再还原的起点。对孟子而言，这个起点就是人心中已经存在的道德端倪。",
        },
      ],
    },
    en: {
      title: "Human nature is good: the starting point of moral growth",
      shortTitle: "Human nature",
      description:
        "Mencius does not claim that people are already perfect. He claims that moral beginnings are already present and can be cultivated.",
      entryTerms: ["human nature is good", "Mencius human nature", "xing shan"],
      definition:
        "Human nature is good means that the human heart contains real moral beginnings. These beginnings can be obscured by circumstance, but they can also be preserved and extended.",
      directAnswer:
        "For Mencius, goodness is an inner ground for becoming humane. Wrongdoing comes from loss, obstruction, and neglect, not from a nature that must be evil.",
      classical: "Every person has a heart that cannot bear the suffering of others.",
      firstPrinciple:
        "If there is no inner moral beginning, education is only external control. If there is a beginning, education is preservation and extension.",
      whyItMatters:
        "This connects Mencius's ethics, education, and politics: humane order is not built by crushing people, but by creating conditions in which moral beginnings can grow.",
      practice: [
        "Ask whether a rule protects compassion and shame instead of dulling them.",
        "Build learning around concrete experience, not slogans alone.",
        "Test short-term gain against the deeper capacity that makes a person humane.",
      ],
      relatedQuestions: [
        {
          question: "Does Mencius mean people never do wrong?",
          answer:
            "No. He knows people can be pulled by desire, fear, and environment. His point is that moral beginnings are real and recoverable.",
        },
        {
          question: "How is this a first principle?",
          answer:
            "A first principle is the point that explains the rest. In Mencius, the irreducible starting point is the moral beginning already present in the heart.",
        },
      ],
    },
  },
  {
    slug: "si-duan",
    sourceRef: "Mencius 2A6",
    textPath: "/books/gong-sun-chou-i/2a-6",
    keywords: ["four beginnings", "四端", "ce yin xiu wu ci rang shi fei"],
    zh: {
      title: "四端：仁义礼智的最小可见单位",
      shortTitle: "四端",
      description:
        "四端把抽象德目落到可观察的心之反应：恻隐、羞恶、辞让、是非，并给修身、教育、判断与制度训练提供可验证起点。",
      entryTerms: ["四端", "恻隐羞恶辞让是非", "端绪"],
      definition:
        "四端是孟子说明仁、义、礼、智如何在人心中萌发的四个开端：恻隐之心、羞恶之心、辞让之心、是非之心。",
      directAnswer:
        "四端不是完整的德性，而是德性的萌芽。它们需要被看见、保存、扩充，才能成为稳定的人格与制度。",
      classical: "恻隐之心，仁之端也；羞恶之心，义之端也。",
      firstPrinciple:
        "宏大的道德秩序，必须从最小、最真实、最可验证的心之反应开始。",
      whyItMatters:
        "四端提供了判断教育和组织文化的标尺：好的环境让人更敏锐、更有羞耻、更懂分寸、更能辨是非。",
      practice: [
        "把抽象价值拆成可观察行为。",
        "在日常小事中训练判断，而不是只在重大事件中谈道德。",
        "让团队语言能区分同情、责任、礼让和判断四种能力。",
      ],
      relatedQuestions: [
        {
          question: "四端和四德是什么关系？",
          answer:
            "四端是开端，四德是成熟状态。恻隐扩充为仁，羞恶扩充为义，辞让扩充为礼，是非扩充为智。",
        },
        {
          question: "为什么四端适合 GEO 内容？",
          answer:
            "它有清晰定义、固定结构和可拆分问答，适合搜索引擎与 AI 系统识别、引用和对比。",
        },
      ],
    },
    en: {
      title: "The four beginnings and four sprouts: virtue made visible",
      shortTitle: "Four beginnings / four sprouts",
      description:
        "The four beginnings, also called the four sprouts, make virtue observable through compassion, shame, deference, and moral discernment.",
      entryTerms: ["four beginnings", "four sprouts", "compassion shame deference discernment"],
      definition:
        "The four beginnings, often called the four sprouts, are Mencius's account of how humaneness, righteousness, ritual propriety, and wisdom begin within the heart.",
      directAnswer:
        "They are not finished virtues. They are beginnings that must be noticed, preserved, extended, and stabilized into character and institutions.",
      classical:
        "The heart of compassion is the beginning of humaneness; the heart of shame is the beginning of righteousness.",
      firstPrinciple:
        "A great moral order must begin from the smallest true and testable reactions of the heart.",
      whyItMatters:
        "The four beginnings give education and culture a practical test: do they make people more responsive, responsible, courteous, and discerning?",
      practice: [
        "Turn abstract values into observable habits.",
        "Train judgment in small daily cases before major crises arrive.",
        "Name the difference between compassion, responsibility, deference, and discernment.",
      ],
      relatedQuestions: [
        {
          question: "How do the four beginnings relate to the four virtues?",
          answer:
            "Each beginning can grow into a mature virtue: compassion into humaneness, shame into righteousness, deference into propriety, and discernment into wisdom.",
        },
        {
          question: "Why is this useful for AI-ready content?",
          answer:
            "It has clear definitions, a stable structure, and answerable subtopics that retrieval systems can cite precisely.",
        },
      ],
    },
  },
  {
    slug: "ren-zheng",
    sourceRef: "Mencius 1A7 and 7B14",
    textPath: "/books/liang-hui-wang-i/1a-7",
    keywords: ["benevolent government", "仁政", "王道", "people first"],
    zh: {
      title: "仁政：政治的第一目标是安顿民生",
      shortTitle: "仁政",
      description:
        "仁政不是温和装饰，而是从民生、教育、信任出发重建治理正当性，并把政治目标落回百姓的安顿、成长与真实方向。",
      entryTerms: ["仁政", "王道", "民为贵"],
      definition:
        "仁政是孟子政治思想的核心：统治者应以保民、养民、教民为先，使人民有恒产、有恒心、有尊严。",
      directAnswer:
        "孟子的仁政不是单纯慈善，而是治理的根本次序：先让人民能活、能养家、能受教育，再谈秩序与礼义。",
      classical: "民为贵，社稷次之，君为轻。",
      firstPrinciple:
        "政治权力的正当性，来自它是否保护并成就人的生活，而不是来自权力本身。",
      whyItMatters:
        "这让孟子思想可以进入现代组织与公共治理：任何制度都要接受“是否使人得以安身立命”的检验。",
      practice: [
        "先评估民生基本盘，再评估绩效指标。",
        "把信任视为治理资产，而不是可随意消耗的资源。",
        "用长期教育与稳定预期替代短期威慑。",
      ],
      relatedQuestions: [
        {
          question: "仁政和王道有什么关系？",
          answer:
            "仁政是王道的实际路径。王道不是霸力取胜，而是通过保民与德行获得人心。",
        },
        {
          question: "仁政能用于企业管理吗？",
          answer:
            "可以借鉴其原则：先保障人的基本安全和成长条件，再要求责任、绩效和共同目标。",
        },
      ],
    },
    en: {
      title: "Humane government: political order begins with livelihood",
      shortTitle: "Humane government / kingly way",
      description:
        "Humane government, the kingly way in political practice, rebuilds legitimacy from livelihood, trust, and education.",
      entryTerms: ["humane government", "kingly way", "people first"],
      definition:
        "Humane government is Mencius's core political idea: rulers should secure livelihood, nurture the people, and educate them before demanding moral order.",
      directAnswer:
        "Mencius does not reduce government to charity. His kingly way gives politics an order of operations: let people live, support families, and learn before demanding stable ritual and responsibility.",
      classical: "The people are most precious; the state comes next; the ruler is light.",
      firstPrinciple:
        "Political power is legitimate only insofar as it protects and fulfills human life.",
      whyItMatters:
        "This makes Mencius relevant beyond ancient courts. Any institution can be tested by whether it helps people stand securely and act responsibly.",
      practice: [
        "Assess basic livelihood before abstract performance.",
        "Treat trust as a governing asset, not a disposable resource.",
        "Prefer education and stable expectations to short-term intimidation.",
      ],
      relatedQuestions: [
        {
          question: "How is humane government related to kingly way?",
          answer:
            "Humane government is the practical route to the kingly way: winning allegiance through care and virtue rather than domination.",
        },
        {
          question: "Can this apply to organizations?",
          answer:
            "Yes. The principle is to secure basic safety and growth conditions before demanding responsibility and performance.",
        },
      ],
    },
  },
  {
    slug: "hao-ran-zhi-qi",
    sourceRef: "Mencius 2A2",
    textPath: "/books/gong-sun-chou-i/2a-2",
    keywords: ["flood-like qi", "浩然之气", "moral courage", "cultivation"],
    zh: {
      title: "浩然之气：把义持续做成气质",
      shortTitle: "浩然之气",
      description:
        "浩然之气不是情绪激昂，而是长期合义行动形成的稳定精神力量，并解释道德勇气如何被持续养成、保存与运用。",
      entryTerms: ["浩然之气", "养气", "道德勇气"],
      definition:
        "浩然之气是孟子对道德勇气的描述：它由义与道长期滋养，不是临时鼓动出来的勇敢。",
      directAnswer:
        "浩然之气来自持续做对的事。人若在小处反复违背义，关键时刻就很难拥有不屈的精神力量。",
      classical: "我善养吾浩然之气。",
      firstPrinciple:
        "勇气不是独立能力，而是长期行为与内在判断一致之后自然形成的力量。",
      whyItMatters:
        "这把修身从口号拉回日常：精神力量不是想出来的，而是在每一次合义选择中养出来的。",
      practice: [
        "把“不做亏心事”当作能量管理，而不只是道德要求。",
        "在小决策中保持一致，避免关键时刻透支人格信用。",
        "用长期正直替代短期情绪激励。",
      ],
      relatedQuestions: [
        {
          question: "浩然之气是不是自信？",
          answer:
            "不是普通自信。它更接近由正当行动累积出来的道德定力和精神饱满。",
        },
        {
          question: "怎么培养浩然之气？",
          answer:
            "孟子的答案是“配义与道”。也就是让行为长期符合义理，而不是靠临时鼓励。",
        },
      ],
    },
    en: {
      title: "Flood-like qi: moral courage formed by repeated right action",
      shortTitle: "Flood-like qi",
      description:
        "Flood-like qi is not emotional excitement. It is steady moral force cultivated by acting in accord with what is right.",
      entryTerms: ["flood-like qi", "moral courage", "moral force"],
      definition:
        "Flood-like qi is Mencius's image for moral courage. It is nourished by righteousness and the Way, not manufactured by a sudden burst of confidence.",
      directAnswer:
        "It grows when a person repeatedly does what is right. If small actions keep violating judgment, courage will be thin when a real test arrives.",
      classical: "I am good at nourishing my flood-like qi.",
      firstPrinciple:
        "Courage is not a separate trick. It forms when conduct and moral judgment stay aligned over time.",
      whyItMatters:
        "This returns cultivation to daily life. Moral force is not imagined into being; it is built through repeated right choices.",
      practice: [
        "Treat a clear conscience as energy management, not only moral decoration.",
        "Keep integrity in small decisions so major tests do not spend borrowed character.",
        "Prefer long-term uprightness to short-term emotional motivation.",
      ],
      relatedQuestions: [
        {
          question: "Is flood-like qi just confidence?",
          answer:
            "No. It is closer to moral steadiness and fullness that comes from accumulated right action.",
        },
        {
          question: "How is it cultivated?",
          answer:
            "Mencius says it must be paired with righteousness and the Way. In practice, conduct must repeatedly match moral judgment.",
        },
      ],
    },
  },
];

export function getPrinciple(slug: string) {
  return principles.find((principle) => principle.slug === slug);
}

export const aboutContent = {
  zh: {
    eyebrow: "孟子简介",
    title: "孟子是谁：从第一性原理进入《孟子》",
    description:
      "孟子（孟轲）简介页：回答孟子是谁、为什么其思想围绕性善与仁政展开，以及如何从第一性原理进入《孟子》与全站阅读路径。",
    paragraphs: [
      "孟子是战国时期最重要的儒家思想家之一。真正理解他，不能只把他当成“几句名言”的来源，而要先回答：他的政治、教育和修身思想，究竟建立在怎样的人性判断上。",
      "孟子的核心回答是，人并不是先天完美，但人心里已经有可以保存、扩充并落实为制度与人格的善端。性善、四端、仁政和浩然之气，就是从这个起点展开的四条主线。",
      "因此，读《孟子》不能只背结论，还要回到问题、论证和出处。这个站点把“孟子是谁、为什么重要、应从哪里进入”放在同一张双语知识网络里回答，并把每条路径接回具体章句。无论读者是从孟子、孟轲、Mencius、Mengzi 还是 Mengtzu 进入，这些名称都应回到同一个可核查的人物与思想实体。",
      "编辑与构建链路保持可追溯：章句阅读语料来自站内打包语料，中文文本会结合仓库中的 data/mengzi.json 做校核，英译沿用公开领域的 James Legge 译本对齐版本。",
    ],
    rules: ["战国儒家思想家", "性善与四端", "仁政与民本", "浩然之气", "双语独立页面", "可核查来源"],
    aliasEyebrow: "人物别名",
    aliasTitle: "把不同拼写与称呼收束到同一个孟子实体",
    aliases: ["孟子", "孟轲", "Mencius", "Mengzi", "Mengtzu", "Meng Tzu"],
    entryEyebrow: "从这里进入",
    entryTitle: "先抓住人物、思想、原文三个入口",
    entryLinks: [
      {
        path: "/principles",
        label: "孟子思想四大主题",
        note: "先读性善、四端、仁政、浩然之气，再回到章句与实践问题。",
      },
      {
        path: "/quotes",
        label: "孟子名言与出处",
        note: "从高频名句进入，再把名句放回原文、论证与思想结构。",
      },
      {
        path: "/books",
        label: "孟子全文与章句页",
        note: "直接进入十四卷、260 章句独立页，按出处逐页阅读与引用。",
      },
    ],
  },
  en: {
    eyebrow: "Who is Mencius?",
    title: "Who is Mencius? Mengzi, Meng Ke, and Mengtzu explained",
    description:
      "Who is Mencius, also called Mengzi, Meng Ke, or Mengtzu? This introduction explains why his thought turns on human nature and humane government, and where to begin.",
    paragraphs: [
      "Mencius is one of the most important Confucian thinkers of the Warring States period. To understand him well, it is not enough to collect famous lines. The prior question is what view of the human person makes his ethics, politics, and education hang together.",
      "His answer is that people are not already perfect, but they do possess moral beginnings that can be preserved, extended, and embodied in conduct and government. Human nature, the four beginnings, humane government, and flood-like qi unfold from that starting point.",
      "That is why reading the Mengzi requires more than slogans. This site answers who Mencius is, why he matters, and where to begin, then connects each route back to specific passages and source-aware explanations. Readers may arrive through Mencius, Mengzi, Meng Ke, Meng Tzu, or Mengtzu, but the site keeps those names tied to one verifiable person and argument structure.",
      "The editorial and build chain is kept traceable: the packaged reading corpus drives the live passage pages, Chinese text is checked against data/mengzi.json in the repository, and the aligned English layer continues to use the public-domain James Legge translation.",
    ],
    rules: [
      "Warring States thinker",
      "Human nature is good",
      "Four beginnings / four sprouts",
      "Humane government / kingly way",
      "Flood-like qi",
      "Source-aware bilingual pages",
    ],
    aliasEyebrow: "Entity aliases",
    aliasTitle: "Keep Mencius, Mengzi, Meng Ke, and Mengtzu mapped to one person",
    aliases: ["Mencius", "Mengzi", "Meng Ke", "Meng Tzu", "Mengtzu", "孟轲"],
    entryEyebrow: "Start here",
    entryTitle: "Three entry points into Mencius on this site",
    entryLinks: [
      {
        path: "/principles",
        label: "Core philosophy pages",
        note: "Start with human nature, the four beginnings, humane government, and flood-like qi.",
      },
      {
        path: "/quotes",
        label: "Quotes with source passages",
        note: "Use famous lines as entry points, then return to the original argument and context.",
      },
      {
        path: "/books",
        label: "Full text and passage pages",
        note: "Open the fourteen-part text index and all 260 standalone passage pages.",
      },
    ],
  },
} satisfies Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    description: string;
    paragraphs: string[];
    rules: string[];
    aliasEyebrow: string;
    aliasTitle: string;
    aliases: string[];
    entryEyebrow: string;
    entryTitle: string;
    entryLinks: { path: string; label: string; note: string }[];
  }
>;

export const sourcesContent = {
  zh: {
    title: "来源与授权",
    description:
      "本页列出 mengtzu.com 第一版使用的文本来源、图像来源和 SEO/GEO 技术依据，并说明仓库与阅读语料的对应关系。",
    sections: [
      {
        title: "原典与文本",
        items: [
          {
            label: "GitHub：mengtzu.com source repository",
            href: "https://github.com/weitzu-com/mengtzu",
            note: "公开源码仓库，包含站点页面、构建脚本、vercel.json 和站内阅读语料。",
          },
          {
            label: "本站打包阅读语料（public/data/mencius.json）",
            href: "https://github.com/weitzu-com/mengtzu/blob/main/public/data/mencius.json",
            note: "当前章句页直接使用的打包语料；其来源字段注明 Chinese Wikisource / ChinTransMem 对齐中文，以及 James Legge 公版英译。",
          },
          {
            label: "Chinese Text Project：孟子",
            href: "https://ctext.org/mengzi",
            note: "用于核对篇章顺序、传统原文与章节路径。",
          },
          {
            label: "Wikisource：The Works of Mencius",
            href: "https://en.wikisource.org/wiki/The_Chinese_Classics/Volume_2/The_Works_of_Mencius",
            note: "James Legge 英译公共领域版本；本站英译层以其为基础做段落级对齐，不直接大段复制。",
          },
        ],
      },
      {
        title: "图像",
        items: [
          {
            label: "Painting of Mengzi by Kano Sansetsu",
            href: "https://commons.wikimedia.org/wiki/File:Great_Confucian_Figures_-_Painting_of_Mengzi_by_Kan%C5%8D_Sansetsu.jpg",
            note: "Wikimedia Commons；作者 Kano Sansetsu；Tokyo National Museum；CC BY 4.0 兼容授权。",
          },
        ],
      },
      {
        title: "SEO/GEO 技术依据",
        items: [
          {
            label: "Google Search Central：多语言页面与 hreflang",
            href: "https://developers.google.com/search/docs/specialty/international/localized-versions",
            note: "用于双语页面 alternate/hreflang 设计。",
          },
          {
            label: "Google Search Central：生成式 AI 搜索优化",
            href: "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide",
            note: "用于确认 GEO 的基础仍是清晰结构、可靠内容与技术 SEO。",
          },
          {
            label: "OpenAI Crawlers",
            href: "https://developers.openai.com/api/docs/bots",
            note: "用于 robots.txt 中允许 OAI-SearchBot 和 ChatGPT-User 访问。",
          },
          {
            label: "llms.txt proposal",
            href: "https://llmstxt.org/",
            note: "用于提供 AI 可读的站点重点页面索引。",
          },
        ],
      },
      {
        title: "机器可发现资源",
        items: [
          {
            label: "本站 sitemap.xml",
            href: `${SITE_URL}/sitemap.xml`,
            note: "提供全站双语 URL、alternate 与页面更新时间信号，供搜索引擎稳定发现页面。",
          },
          {
            label: "本站 llms.txt",
            href: `${SITE_URL}/llms.txt`,
            note: "提供面向 AI 检索的重点页面索引，优先暴露主题页、全文页、名言页与来源页。",
          },
          {
            label: "本站 RSS 订阅",
            href: RSS_FEED_URL,
            note: "提供主 hub 页与核心主题页的机器可读更新入口，便于持续跟踪重要页面刷新。",
          },
        ],
      },
    ],
  },
  en: {
    title: "Sources and licensing",
    description:
      "This page lists the textual sources, image source, and SEO/GEO references used for the first version of mengtzu.com.",
    sections: [
      {
        title: "Primary texts",
        items: [
          {
            label: "GitHub: mengtzu.com source repository",
            href: "https://github.com/weitzu-com/mengtzu",
            note: "Public source repository containing the site pages, build scripts, vercel.json, and the packaged reading corpus.",
          },
          {
            label: "Packaged reading corpus (public/data/mencius.json)",
            href: "https://github.com/weitzu-com/mengtzu/blob/main/public/data/mencius.json",
            note: "This is the live corpus used by the passage pages. Its embedded source field records Chinese Wikisource / ChinTransMem alignment for Chinese and James Legge for English.",
          },
          {
            label: "Chinese Text Project: Mengzi",
            href: "https://ctext.org/mengzi",
            note: "Used to verify chapter order, traditional Chinese text, and reference structure.",
          },
          {
            label: "Wikisource: The Works of Mencius",
            href: "https://en.wikisource.org/wiki/The_Chinese_Classics/Volume_2/The_Works_of_Mencius",
            note: "Public-domain James Legge translation used as the aligned English base layer, not for long copied excerpts.",
          },
        ],
      },
      {
        title: "Image",
        items: [
          {
            label: "Painting of Mengzi by Kano Sansetsu",
            href: "https://commons.wikimedia.org/wiki/File:Great_Confucian_Figures_-_Painting_of_Mengzi_by_Kan%C5%8D_Sansetsu.jpg",
            note: "Wikimedia Commons; Kano Sansetsu; Tokyo National Museum; CC BY 4.0-compatible license.",
          },
        ],
      },
      {
        title: "SEO/GEO references",
        items: [
          {
            label: "Google Search Central: localized versions and hreflang",
            href: "https://developers.google.com/search/docs/specialty/international/localized-versions",
            note: "Used for bilingual alternate URL structure.",
          },
          {
            label: "Google Search Central: AI optimization guide",
            href: "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide",
            note: "Used to keep GEO grounded in helpful content and technical SEO.",
          },
          {
            label: "OpenAI Crawlers",
            href: "https://developers.openai.com/api/docs/bots",
            note: "Used for robots.txt access choices for OAI-SearchBot and ChatGPT-User.",
          },
          {
            label: "llms.txt proposal",
            href: "https://llmstxt.org/",
            note: "Used for the AI-readable curated site map.",
          },
        ],
      },
      {
        title: "Machine-readable discovery",
        items: [
          {
            label: "This site's sitemap.xml",
            href: `${SITE_URL}/sitemap.xml`,
            note: "Used to expose the bilingual URL set, alternates, and page freshness signals for stable search discovery.",
          },
          {
            label: "This site's llms.txt",
            href: `${SITE_URL}/llms.txt`,
            note: "Used to expose the priority hub, text, quotes, and sources pages in an AI-readable curated index.",
          },
          {
            label: "This site's RSS feed",
            href: RSS_FEED_URL,
            note: "Used to provide a machine-readable update stream for the main hub pages and core principle routes.",
          },
        ],
      },
    ],
  },
} satisfies Record<
  Locale,
  {
    title: string;
    description: string;
    sections: {
      title: string;
      items: { label: string; href: string; note: string }[];
    }[];
  }
>;

export const faqContent = {
  zh: {
    title: "常见问题",
    description: "关于 mengtzu.com、孟子思想、双语页面和 GEO 策略的常见问题，帮助读者快速理解站点方法、命名与检索结构。",
    questions: [
      {
        question: "mengtzu.com 为什么使用 Mengtzu 这个拼法？",
        answer:
          "Mengtzu 是孟子在西方语境中常见的旧式拼写之一，便于和 Mengzi、Mencius 等检索词形成互补。页面正文会同时使用孟子、Mengzi、Mencius。",
      },
      {
        question: "这个网站为什么先做四个核心主题？",
        answer:
          "四个主题可以覆盖孟子思想的骨架：人性论、德性开端、政治秩序和修身力量。先把骨架做稳，再扩展原文和专题。",
      },
      {
        question: "双语页面是自动翻译吗？",
        answer:
          "不是。第一版采用对应写作：中文页服务中文搜索意图，英文页服务英文搜索意图，但两者共享同一事实与来源结构。",
      },
      {
        question: "GEO 和 SEO 有冲突吗？",
        answer:
          "没有。Google 的官方建议是继续做好基础 SEO、清晰内容结构和可靠内容。GEO 更像是把页面写得更容易被 AI 正确理解和引用。",
      },
      {
        question: "搜索引擎和 AI 系统可以通过哪些机器可读入口发现本站更新？",
        answer:
          "当前主要有三条入口：sitemap.xml 负责全站 URL 与更新时间信号，llms.txt 负责暴露优先主题页与阅读路径，RSS 订阅则负责持续跟踪主 hub 页和核心主题页刷新。",
      },
    ],
  },
  en: {
    title: "Frequently asked questions",
    description:
      "Common questions about mengtzu.com, Mencius, bilingual pages, and GEO strategy.",
    questions: [
      {
        question: "Why does the domain use Mengtzu?",
        answer:
          "Mengtzu is an older spelling often used in Western contexts. The site also uses Mengzi, Mencius, and 孟子 so readers and search systems can connect the entity clearly.",
      },
      {
        question: "Why start with four core themes?",
        answer:
          "They form the backbone of Mencius: human nature, moral beginnings, political order, and cultivated moral force. A strong backbone makes later passage and article expansion easier.",
      },
      {
        question: "Are the bilingual pages automatic translations?",
        answer:
          "No. The pages are paired, not merely translated. Chinese pages serve Chinese search intent; English pages serve English search intent; both share the same factual and source structure.",
      },
      {
        question: "Do GEO and SEO conflict?",
        answer:
          "No. Google's guidance is that generative AI visibility still depends on helpful content, clear structure, and technical SEO. GEO here means making pages easier for AI systems to understand and cite accurately.",
      },
      {
        question: "Which machine-readable routes help search and AI systems discover updates on this site?",
        answer:
          "Three routes do that job now: sitemap.xml exposes the full bilingual URL set and freshness signals, llms.txt exposes the priority reading routes, and the RSS feed tracks refreshed hub pages and core principle pages.",
      },
    ],
  },
} satisfies Record<
  Locale,
  { title: string; description: string; questions: { question: string; answer: string }[] }
>;
