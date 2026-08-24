import type { Locale } from "./site";

export type QuoteEntry = {
  ref: string;
  sourcePath: string;
  relatedPath: string;
  zh: {
    theme: string;
    title: string;
    quote: string;
    explanation: string;
    sourceCta: string;
    relatedCta: string;
  };
  en: {
    theme: string;
    title: string;
    quote: string;
    explanation: string;
    sourceCta: string;
    relatedCta: string;
  };
};

export const quotesPageContent = {
  zh: {
    title: "孟子名言与出处",
    description:
      "12 条最常被引用的孟子名句，直接回到原文出处、解释页、上下文与相关思想主题，避免把名句浮成空泛鸡汤。",
    eyebrow: "名言与出处",
    h1: "孟子名言与出处：回到原文，别把名句浮成鸡汤",
    lead:
      "真正有价值的名句，不该只剩四个字的口号。这个页面把最常被引用的《孟子》句子重新放回原文、问题脉络和思想主题里，方便读者、搜索引擎和 AI 系统引用到更准确的页面。",
    sectionEyebrow: "高频引用页",
    sectionTitle: "12 条最值得回到原文理解的孟子名句",
    metrics: [
      ["12", "高频名句"],
      ["12", "原文出处页"],
      ["4", "核心主题簇"],
    ] as [string, string][],
    faqs: [
      {
        question: "为什么要把孟子名句单独做成一页？",
        answer:
          "因为很多真实搜索并不是直接找卷、篇、章，而是先从“舍生取义”“民为贵”“反求诸己”这类名句进入。独立页面能更准确地承接这种高意图搜索。",
      },
      {
        question: "这一页是不是也在回答“孟子名言”这类搜索？",
        answer:
          "是。无论读者从“名言”还是“名句”进来，这一页都把他们送回具体章句，而不是停在口号层。",
      },
      {
        question: "这一页和章句原文页是什么关系？",
        answer:
          "这页是入口页，不替代章句页。每条名句都会回到具体章句页面，方便继续看上下文、解释层、相关主题和出处信息。",
      },
      {
        question: "引用孟子名句时最容易错在哪？",
        answer:
          "最常见的问题是只摘口号，不看它回答的究竟是什么问题。这个页面的目标就是把名句重新放回问题、原文和思想结构之中。",
      },
    ],
    nextTitle: "如果只摘一句话，往往会失去《孟子》的论证结构。",
    nextCta: "进入全文与章句页",
  },
  en: {
    title: "Mencius quotes and sayings with source passages",
    description:
      "Twelve well-known Mencius quotes and sayings, each linked back to its source passage, explanation page, and related principle.",
    eyebrow: "Quotes with sources",
    h1: "Mencius quotes and sayings with source passages, context, and first-principles reading",
    lead:
      "A useful quotes or sayings page should not turn Mencius into decontextualized wisdom snippets. This page ties widely quoted lines back to their source passages, explanatory pages, and the philosophical questions they actually answer.",
    sectionEyebrow: "Search-intent hub",
    sectionTitle: "Twelve Mencius lines worth reading back in their original argument",
    metrics: [
      ["12", "high-intent quotes"],
      ["12", "source passage pages"],
      ["4", "core theme clusters"],
    ] as [string, string][],
    faqs: [
      {
        question: "Why make a dedicated Mencius quotes page?",
        answer:
          "Because many real searches begin with famous lines such as 'choose righteousness over life' or 'the people are weightiest' rather than with book and passage numbers. A dedicated hub captures that intent more directly.",
      },
      {
        question: "Is this also a page for Mencius sayings?",
        answer:
          "Yes. The goal is to catch both quote-style and saying-style searches, then send them back to the exact source passage instead of leaving them as detached maxims.",
      },
      {
        question: "How should this page relate to the passage pages?",
        answer:
          "This is an entry page, not a replacement. Every quote points back to the exact passage page so readers can keep reading the argument, context, and related principles.",
      },
      {
        question: "What is the biggest mistake in quoting Mencius?",
        answer:
          "The most common failure is isolating the slogan while losing the question it answers. This page is designed to restore that link between quote, problem, and argument.",
      },
    ],
    nextTitle: "A quote without its argument easily turns into generic inspiration.",
    nextCta: "Open the full text and passage pages",
  },
} satisfies Record<
  Locale,
  {
    title: string;
    description: string;
    eyebrow: string;
    h1: string;
    lead: string;
    sectionEyebrow: string;
    sectionTitle: string;
    metrics: [string, string][];
    faqs: { question: string; answer: string }[];
    nextTitle: string;
    nextCta: string;
  }
>;

export const quoteEntries: QuoteEntry[] = [
  {
    ref: "Mencius 2A.6",
    sourcePath: "/books/gong-sun-chou-i/2a-6",
    relatedPath: "/principles/si-duan",
    zh: {
      theme: "四端",
      title: "人皆有不忍人之心",
      quote: "人皆有不忍人之心。",
      explanation:
        "这是孟子性善论和仁政论的共同起点。它不是空谈善良，而是说人看见他人受苦时会自然惊动，这个反应本身就是德性的开端。",
      sourceCta: "回到原文与解释页",
      relatedCta: "查看四端主题页",
    },
    en: {
      theme: "Four beginnings",
      title: "Every person has a heart that cannot bear suffering",
      quote: "All men have a mind which cannot bear to see the sufferings of others.",
      explanation:
        "This is the common starting point of Mencius on human goodness and humane government. The line matters because it grounds morality in an actual human response, not an external command.",
      sourceCta: "Read the source passage",
      relatedCta: "Open the four beginnings page",
    },
  },
  {
    ref: "Mencius 6A.10",
    sourcePath: "/books/gao-zi-i/6a-10",
    relatedPath: "/principles/xing-shan",
    zh: {
      theme: "义与价值排序",
      title: "舍生取义",
      quote: "生，亦我所欲也；义，亦我所欲也。二者不可得兼，舍生而取义者也。",
      explanation:
        "这句话之所以重要，不在悲壮，而在价值排序。孟子要说明：若没有高于生存本能的尺度，道德就不可能真正成立。",
      sourceCta: "回到原文与解释页",
      relatedCta: "查看性善主题页",
    },
    en: {
      theme: "Righteousness and value order",
      title: "Choose righteousness over life",
      quote: "If I cannot keep the two together, I will let life go, and choose righteousness.",
      explanation:
        "The force of this line is not mere heroism. Mencius is arguing that morality becomes real only when something can stand higher than survival itself.",
      sourceCta: "Read the source passage",
      relatedCta: "Open the human nature page",
    },
  },
  {
    ref: "Mencius 6A.11",
    sourcePath: "/books/gao-zi-i/6a-11",
    relatedPath: "/method",
    zh: {
      theme: "学习与本心",
      title: "学问之道无他，求其放心而已矣",
      quote: "学问之道无他，求其放心而已矣。",
      explanation:
        "孟子把学习的核心定义成“找回走失的心”。若人心本来就有善端，学习就不是外加陌生知识，而是找回、安顿并守住本心。",
      sourceCta: "回到原文与解释页",
      relatedCta: "查看读法页",
    },
    en: {
      theme: "Learning and the heart",
      title: "Learning is seeking the lost heart",
      quote: "The great end of learning is nothing else but to seek for the lost mind.",
      explanation:
        "Mencius treats education as recovery, not accumulation alone. The point is to recall and preserve a heart that has wandered away from what it already knows at root.",
      sourceCta: "Read the source passage",
      relatedCta: "Open the method page",
    },
  },
  {
    ref: "Mencius 7B.35",
    sourcePath: "/books/jin-xin-ii/7b-35",
    relatedPath: "/principles/xing-shan",
    zh: {
      theme: "修身工夫",
      title: "养心莫善于寡欲",
      quote: "养心莫善于寡欲。",
      explanation:
        "孟子不是主张生命枯槁，而是指出欲望越多，心越容易被撕散。减少牵引点，才能让心重新取得主导权。",
      sourceCta: "回到原文与解释页",
      relatedCta: "查看性善主题页",
    },
    en: {
      theme: "Self-cultivation",
      title: "To nourish the heart, make desires few",
      quote: "To nourish the mind there is nothing better than to make the desires few.",
      explanation:
        "The line is not anti-life asceticism. It is about reducing the forces that keep tearing the heart in too many directions, so judgment can lead again.",
      sourceCta: "Read the source passage",
      relatedCta: "Open the human nature page",
    },
  },
  {
    ref: "Mencius 7B.14",
    sourcePath: "/books/jin-xin-ii/7b-14",
    relatedPath: "/principles/ren-zheng",
    zh: {
      theme: "政治合法性",
      title: "民为贵，社稷次之，君为轻",
      quote: "民为贵，社稷次之，君为轻。",
      explanation:
        "这不是简单口号，而是孟子对政治正当性排序的回答：政治若不能安顿百姓，再高的统治位置也失去根基。",
      sourceCta: "回到原文与解释页",
      relatedCta: "查看仁政主题页",
    },
    en: {
      theme: "Political legitimacy",
      title: "The people are weightiest",
      quote: "The people are the most important element in a nation; the sovereign is the lightest.",
      explanation:
        "This is Mencius on legitimacy in ranked form. Rule loses its root when it stops serving the people whose lives it is supposed to order and protect.",
      sourceCta: "Read the source passage",
      relatedCta: "Open the humane government page",
    },
  },
  {
    ref: "Mencius 3B.2",
    sourcePath: "/books/teng-wen-gong-ii/3b-2",
    relatedPath: "/principles/hao-ran-zhi-qi",
    zh: {
      theme: "大丈夫",
      title: "富贵不能淫，贫贱不能移，威武不能屈",
      quote: "富贵不能淫，贫贱不能移，威武不能屈。",
      explanation:
        "这句的核心不是硬撑，而是先有“居天下之广居、立天下之正位、行天下之大道”的内在定向，之后外在处境才摇不动你。",
      sourceCta: "回到原文与解释页",
      relatedCta: "查看浩然之气主题页",
    },
    en: {
      theme: "The great person",
      title: "Riches cannot corrupt, power cannot bend",
      quote: "To be above the power of riches and honours to make dissipated, of poverty to make swerve, and of force to make bend.",
      explanation:
        "The line matters because it rests on prior moral orientation. It is not stubbornness for its own sake, but integrity rooted deeply enough that circumstance cannot reset it.",
      sourceCta: "Read the source passage",
      relatedCta: "Open the flood-like qi page",
    },
  },
  {
    ref: "Mencius 4A.4",
    sourcePath: "/books/li-lou-i/4a-4",
    relatedPath: "/method",
    zh: {
      theme: "反求诸己",
      title: "行有不得，反求诸己",
      quote: "行有不得者，皆反求诸己。",
      explanation:
        "孟子并不是让人无限内耗，而是要求先检查自己能改动的变量，再分清究竟是自己失正还是对方失道。",
      sourceCta: "回到原文与解释页",
      relatedCta: "查看读法页",
    },
    en: {
      theme: "Self-examination",
      title: "Turn the inquiry back on yourself",
      quote: "When we do not, by what we do, realise what we desire, we must turn inwards, and examine ourselves.",
      explanation:
        "Mencius is not prescribing endless self-blame. He is insisting that the first variables worth checking are the ones one can actually repair.",
      sourceCta: "Read the source passage",
      relatedCta: "Open the method page",
    },
  },
  {
    ref: "Mencius 4B.12",
    sourcePath: "/books/li-lou-ii/4b-12",
    relatedPath: "/principles/xing-shan",
    zh: {
      theme: "赤子之心",
      title: "大人者，不失其赤子之心者也",
      quote: "大人者，不失其赤子之心者也。",
      explanation:
        "孟子不是浪漫化幼稚，而是说真正成熟的人，能在复杂世界里保住未被扭曲的根本心性。",
      sourceCta: "回到原文与解释页",
      relatedCta: "查看性善主题页",
    },
    en: {
      theme: "Child's heart",
      title: "Do not lose the child's heart",
      quote: "The great man is he who does not lose his child's-heart.",
      explanation:
        "This is not praise of naivete. Mencius means an unwarped moral center that survives complexity instead of being hardened out of existence.",
      sourceCta: "Read the source passage",
      relatedCta: "Open the human nature page",
    },
  },
  {
    ref: "Mencius 4A.23",
    sourcePath: "/books/li-lou-i/4a-23",
    relatedPath: "/method",
    zh: {
      theme: "认知偏差",
      title: "人之患在好为人师",
      quote: "人之患在好为人师。",
      explanation:
        "这句并不反对教育，而是批评那种太早站上教师位置、忙于纠正别人、反而失去继续自修能力的姿态。",
      sourceCta: "回到原文与解释页",
      relatedCta: "查看读法页",
    },
    en: {
      theme: "Cognitive distortion",
      title: "The trouble with loving to teach others",
      quote: "The evil of men is that they like to be teachers of others.",
      explanation:
        "Mencius is not attacking teaching as such. He is diagnosing the posture that rushes to instruct others before it has undergone enough correction itself.",
      sourceCta: "Read the source passage",
      relatedCta: "Open the method page",
    },
  },
  {
    ref: "Mencius 4B.8",
    sourcePath: "/books/li-lou-ii/4b-8",
    relatedPath: "/principles/hao-ran-zhi-qi",
    zh: {
      theme: "行动边界",
      title: "人有不为也，而后可以有为",
      quote: "人有不为也，而后可以有为。",
      explanation:
        "孟子把真正的行动力放在边界之上。若没有绝不做的事，判断、资源和人格力量就无法稳定集中到值得做的事上。",
      sourceCta: "回到原文与解释页",
      relatedCta: "查看浩然之气主题页",
    },
    en: {
      theme: "Boundaries and action",
      title: "Refusal makes real action possible",
      quote: "Men must be decided on what they will NOT do, and then they are able to act with vigour.",
      explanation:
        "Mencius roots action in refusal. Without firm boundaries, effort and judgment scatter instead of gathering around what is worth doing.",
      sourceCta: "Read the source passage",
      relatedCta: "Open the flood-like qi page",
    },
  },
  {
    ref: "Mencius 4A.9",
    sourcePath: "/books/li-lou-i/4a-9",
    relatedPath: "/principles/ren-zheng",
    zh: {
      theme: "得民心",
      title: "得其民斯得天下",
      quote: "得天下有道：得其民斯得天下矣。得其民有道，得其心斯得民矣。",
      explanation:
        "孟子不是把“得民心”说成抽象好感，而是落实到“所欲，与之聚之；所恶，勿施尔也”的具体治理方向。",
      sourceCta: "回到原文与解释页",
      relatedCta: "查看仁政主题页",
    },
    en: {
      theme: "Winning hearts",
      title: "Get the people to get the kingdom",
      quote: "There is a way to get the kingdom: get the people, and the kingdom is got.",
      explanation:
        "For Mencius, winning hearts is not vague popularity. It means gathering what people need and not imposing what they hate, so legitimacy becomes concrete rather than sentimental.",
      sourceCta: "Read the source passage",
      relatedCta: "Open the humane government page",
    },
  },
  {
    ref: "Mencius 6B.15",
    sourcePath: "/books/gao-zi-ii/6b-15",
    relatedPath: "/principles/hao-ran-zhi-qi",
    zh: {
      theme: "忧患与成长",
      title: "生于忧患，死于安乐",
      quote: "然后知生于忧患，而死于安乐也。",
      explanation:
        "孟子不是歌颂痛苦本身，而是指出：长期安逸会削弱警觉和担当，合宜的艰难则可能逼出原本没有被锻炼出来的能力。",
      sourceCta: "回到原文与解释页",
      relatedCta: "查看浩然之气主题页",
    },
    en: {
      theme: "Adversity and growth",
      title: "Life grows from adversity",
      quote: "From these things we see how life springs from sorrow and calamity, and death from ease and pleasure.",
      explanation:
        "The line is not a cult of suffering. Mencius is arguing that prolonged ease weakens judgment and endurance, while fitting hardship can enlarge undeveloped strength.",
      sourceCta: "Read the source passage",
      relatedCta: "Open the flood-like qi page",
    },
  },
];
