import type { Locale } from "./site";

type RelatedLink = {
  path: string;
  label: string;
};

type PassageEditorialNoteContent = {
  seoTitle: string;
  seoDescription: string;
  readingQuestion: string;
  directAnswer: string;
  firstPrinciple: string;
  whyItMatters: string;
  citationAngle: string;
  relatedLinks: RelatedLink[];
};

type PassageEditorialNote = Record<Locale, PassageEditorialNoteContent>;

const passageEditorialNotes: Record<string, PassageEditorialNote> = {
  "孟子 1A.1": {
    zh: {
      seoTitle: "《孟子·梁惠王上》1A.1：何必曰利与义利之辨",
      seoDescription: "孟子在 1A.1 把国家问题从“如何获利”拉回“如何守住仁义”，说明一旦上下争利，政治秩序会先从内部崩坏。",
      readingQuestion: "孟子为什么一开口就反对梁惠王用“利”来定义政治？",
      directAnswer: "因为一旦国君、大夫、士庶都把“利”当共同语言，制度中的每个位置都会开始相互争夺，最后连最基本的忠诚和亲亲秩序也会被侵蚀。",
      firstPrinciple: "政治不是先解决资源分配，再补充道德口号；政治首先要回答什么东西不能拿来交易。孟子把“仁义”放在这里作为国家秩序的底板。",
      whyItMatters: "这是理解孟子政治哲学的总入口。后面关于王道、民生、仁政的讨论，都是在解释为什么国家不能先用逐利逻辑组织自己。",
      citationAngle: "引用这一章时，最好同时保留“上下交征利而国危矣”一段，避免把“何必曰利”误读成反商业口号。",
      relatedLinks: [
        { path: "/principles/ren-zheng", label: "仁政：政治从保护百姓开始" },
        { path: "/books/liang-hui-wang-i/1a-7", label: "《孟子》1A.7：以羊易牛与王道" },
      ],
    },
    en: {
      seoTitle: "Mencius 1A.1: why profit cannot be the language of rule",
      seoDescription: "In 1A.1 Mencius pulls statecraft back from profit to benevolence and righteousness, arguing that once every level competes for gain, political order decays from within.",
      readingQuestion: "Why does Mencius immediately resist King Hui's language of profit?",
      directAnswer: "Because when ruler, ministers, and commoners all learn to speak in terms of gain, each office starts preying on the others. The political fabric breaks before material gain can stabilize it.",
      firstPrinciple: "Politics does not first solve incentives and then add morality later. It must first decide what may not be reduced to transaction. For Mencius, benevolence and righteousness supply that base layer.",
      whyItMatters: "This is the master doorway into Mencius's political thought. His later claims about humane rule and the people's livelihood all depend on this refusal to organize a state around profit-seeking.",
      citationAngle: "When citing this passage, keep the line about everyone contending for profit and the state becoming endangered. It shows that the target is political logic, not commerce as such.",
      relatedLinks: [
        { path: "/principles/ren-zheng", label: "Humane government" },
        { path: "/books/liang-hui-wang-i/1a-7", label: "Mencius 1A.7: the ox, the sheep, and kingly rule" },
      ],
    },
  },
  "孟子 1A.7": {
    zh: {
      seoTitle: "《孟子·梁惠王上》1A.7：以羊易牛与王道的心理根据",
      seoDescription: "孟子借“以羊易牛”说明齐宣王已经有不忍之心，问题不在有没有仁，而在能否把这颗心扩充到百姓身上。",
      readingQuestion: "为什么孟子要抓住“以羊易牛”这个细节来谈王道？",
      directAnswer: "因为它显示君主并非全无仁心。孟子要证明的不是“你应该凭空变善”，而是“你已经有这颗心，只是还没有把它推到治国尺度”。",
      firstPrinciple: "王道不是从抽象制度突然降临，而是把已经存在的恻隐之心，通过判断与扩充，变成对百姓的稳定保护。",
      whyItMatters: "这章把心理事实和政治秩序接起来，是“仁政如何可能”最直观的论证，也解释了为什么孟子总从人心而不是从技术细节开始谈政治。",
      citationAngle: "如果只引用“不忍其觳觫”而不连到“是心足以王矣”，就会丢掉孟子最关键的一步：从情感到政治扩充。",
      relatedLinks: [
        { path: "/principles/ren-zheng", label: "仁政：政治从保护百姓开始" },
        { path: "/books/gong-sun-chou-i/2a-6", label: "《孟子》2A.6：孺子将入于井与四端" },
      ],
    },
    en: {
      seoTitle: "Mencius 1A.7: the ox, the sheep, and the basis of kingly rule",
      seoDescription: "Mencius uses the story of replacing the ox with a sheep to show that King Xuan already has a heart of compassion; the real question is whether he can extend it to the people.",
      readingQuestion: "Why does Mencius build the case for kingly rule from the detail of replacing the ox?",
      directAnswer: "Because the detail proves the king is not empty of compassion. Mencius does not argue that the ruler must create goodness from nothing, but that he must extend an already existing humane response to public life.",
      firstPrinciple: "Humane government does not appear by institutional magic. It begins by expanding a real moral response already present in the ruler's heart.",
      whyItMatters: "This is one of Mencius's clearest bridges between moral psychology and political order. It explains why he treats the heart as the starting point of government rather than an optional ornament.",
      citationAngle: "Do not quote the pity for the trembling ox without the line 'this heart is enough to rule.' The argument is about extension from feeling to political responsibility.",
      relatedLinks: [
        { path: "/principles/ren-zheng", label: "Humane government" },
        { path: "/books/gong-sun-chou-i/2a-6", label: "Mencius 2A.6: the child at the well and the four beginnings" },
      ],
    },
  },
  "孟子 2A.2": {
    zh: {
      seoTitle: "《孟子·公孙丑上》2A.2：四十不动心与浩然之气",
      seoDescription: "孟子在 2A.2 讨论不动心、勇敢与浩然之气，指出真正的定力不是硬撑，而是长期合义之后形成的稳定精神力量。",
      readingQuestion: "孟子的“不动心”为什么不是情绪压抑或逞强？",
      directAnswer: "因为他讨论的不是把恐惧压下去，而是让判断、行动与义长期一致，于是关键时刻不需要靠意志硬顶，心自然能站住。",
      firstPrinciple: "精神力量不是额外外挂，而是长期行为与价值判断不冲突时自然积累出来的结果。",
      whyItMatters: "这章是理解浩然之气的入口。它把“勇敢”从人格标签改写成可培养的结构，也解释了为什么孟子把修身看成公共行动的前提。",
      citationAngle: "引用“不动心”时，最好连到后文养气与知言的讨论，否则容易把它误读成单纯的心理训练技巧。",
      relatedLinks: [
        { path: "/principles/hao-ran-zhi-qi", label: "浩然之气" },
        { path: "/books/gong-sun-chou-i/2a-6", label: "《孟子》2A.6：孺子将入于井与四端" },
      ],
    },
    en: {
      seoTitle: "Mencius 2A.2: an unmoved heart and flood-like qi",
      seoDescription: "In 2A.2 Mencius explains that an unmoved heart is not brute suppression but the steadiness that grows when action and righteousness stay aligned over time.",
      readingQuestion: "Why is Mencius's 'unmoved heart' not mere emotional suppression or bravado?",
      directAnswer: "Because he is not describing the trick of pushing fear down. He is describing a state in which judgment, conduct, and righteousness have been aligned long enough that the heart can stand firm without strain.",
      firstPrinciple: "Moral force is not an extra attachment. It accumulates when conduct does not repeatedly betray judgment.",
      whyItMatters: "This is the entry point for flood-like qi. It turns courage from a personality label into a cultivable structure and shows why self-cultivation matters for public action.",
      citationAngle: "When citing the 'unmoved heart,' connect it to the surrounding discussion of nourishing qi and understanding words, or it will sound like a generic mental-performance slogan.",
      relatedLinks: [
        { path: "/principles/hao-ran-zhi-qi", label: "Flood-like qi" },
        { path: "/books/gong-sun-chou-i/2a-6", label: "Mencius 2A.6: the child at the well and the four beginnings" },
      ],
    },
  },
  "孟子 2A.6": {
    zh: {
      seoTitle: "《孟子·公孙丑上》2A.6：孺子将入于井与四端",
      seoDescription: "孟子用“孺子将入于井”证明同情不是表演出来的社会姿态，而是人人本有的四端开端，也是仁政的心理根据。",
      readingQuestion: "为什么孟子要用“孺子将入于井”的场景来论证人性？",
      directAnswer: "因为这个瞬间能尽量排除利益、名声和关系计算。如果人仍会先起怵惕恻隐之心，就说明仁的开端先于外部奖惩存在。",
      firstPrinciple: "若道德完全来自外部塑造，就找不到这种不经计算的同情反应；孟子正是抓住这一点，建立性善与仁政的共同起点。",
      whyItMatters: "2A.6 同时支撑性善、四端和仁政三条主线，是整站最关键的原典锚点之一，也是最值得被搜索和 AI 精确引用的页面。",
      citationAngle: "引用时最好连同“四端”与“有是四端而自谓不能者”一段一起使用，不要只截取“孺子将入于井”作为空泛金句。",
      relatedLinks: [
        { path: "/principles/si-duan", label: "四端" },
        { path: "/principles/xing-shan", label: "性善" },
        { path: "/books/gao-zi-i/6a-6", label: "《孟子》6A.6：为什么孟子坚持性善" },
      ],
    },
    en: {
      seoTitle: "Mencius 2A.6: the child at the well and the four beginnings",
      seoDescription: "Mencius uses the scene of a child about to fall into a well to argue that compassion is not social performance but one of the moral beginnings already present in every person.",
      readingQuestion: "Why does Mencius use the child-at-the-well scene to argue about human nature?",
      directAnswer: "Because the scene strips away advantage, reputation, and relationship strategy. If a person still recoils in alarm and compassion, then the beginning of humaneness exists prior to external reward and punishment.",
      firstPrinciple: "If morality were only installed from the outside, there would be no such immediate response. Mencius uses that response as the shared starting point of human goodness and humane government.",
      whyItMatters: "2A.6 anchors three major lines at once: human nature is good, the four beginnings, and humane rule. It is one of the most important citation pages on the site.",
      citationAngle: "Quote it with the passage on the four beginnings and the warning against saying one cannot extend them. Otherwise the child-at-the-well image gets flattened into a vague inspirational line.",
      relatedLinks: [
        { path: "/principles/si-duan", label: "The four beginnings" },
        { path: "/principles/xing-shan", label: "Human nature is good" },
        { path: "/books/gao-zi-i/6a-6", label: "Mencius 6A.6: why Mencius insists on human goodness" },
      ],
    },
  },
  "孟子 6A.1": {
    zh: {
      seoTitle: "《孟子·告子上》6A.1：杞柳与杯棬，仁义不是硬雕出来的",
      seoDescription: "面对告子把人性比作杞柳、把仁义比作杯棬，孟子指出这种说法把德性误解成对人性的破坏性加工。",
      readingQuestion: "孟子为什么反对把仁义说成从人性上加工出来的器物？",
      directAnswer: "因为那样等于承认人成德必须先被扭曲、切削、损伤。孟子要维护的是：德性成长应当顺着人之所以为人的内在可能，而不是先伤其性再成其器。",
      firstPrinciple: "教育和制度若总把人成德理解成外部塑形，就会把人当材料；孟子坚持人不是原料，而是本来带着善端的生命。",
      whyItMatters: "这章是性善论的反面切口。它说明孟子不仅在说“人有善端”，也在拒绝一种把道德当控制工程的理解方式。",
      citationAngle: "引用时不要只停在器物比喻本身，要把“戕贼人以为仁义”一层保留下来，这才是孟子真正反击的重点。",
      relatedLinks: [
        { path: "/principles/xing-shan", label: "性善" },
        { path: "/books/gao-zi-i/6a-6", label: "《孟子》6A.6：为什么孟子坚持性善" },
      ],
    },
    en: {
      seoTitle: "Mencius 6A.1: virtue is not carved out of damaged human nature",
      seoDescription: "Against Gaozi's image of human nature as willow and righteousness as cups and bowls, Mencius argues that virtue cannot be formed by first violating what a human being is.",
      readingQuestion: "Why does Mencius reject the analogy that righteousness is shaped out of human nature like bowls from willow wood?",
      directAnswer: "Because the analogy implies that becoming virtuous requires twisting, cutting, and damaging what a person already is. Mencius wants to protect the idea that moral growth should unfold from human potential, not from injury to it.",
      firstPrinciple: "Any ethics that treats persons as raw material will tend toward control. Mencius insists that a person is not mere material but a being already carrying moral beginnings.",
      whyItMatters: "This passage is a crucial negative entry into human goodness. It shows that Mencius is resisting not only one thesis about nature, but an entire engineering view of morality.",
      citationAngle: "Do not stop with the willow-and-bowls metaphor. Keep the line about 'doing violence to people in order to make benevolence and righteousness' because that is the real target of Mencius's reply.",
      relatedLinks: [
        { path: "/principles/xing-shan", label: "Human nature is good" },
        { path: "/books/gao-zi-i/6a-6", label: "Mencius 6A.6: why Mencius insists on human goodness" },
      ],
    },
  },
  "孟子 6A.6": {
    zh: {
      seoTitle: "《孟子·告子上》6A.6：为什么孟子坚持性善",
      seoDescription: "面对“性无善无不善”等不同说法，孟子把讨论重新拉回人的真实情状：恻隐、羞恶、恭敬、是非都不是外加装配，而是本有的能力。",
      readingQuestion: "面对众多关于人性的说法，孟子为什么仍坚持“性善”？",
      directAnswer: "因为他把判断标准放在人的真实情状上：只要恻隐、羞恶、恭敬、是非这些能力普遍存在，就说明善的根据在人的内部，而不是后来才被塞进去。",
      firstPrinciple: "判断人性，不是先看少数极端人物，而是先看一个正常人作为人时最基本、最普遍的能力结构。",
      whyItMatters: "6A.6 是性善论最完整的辩护页之一，也是当前站点最有实际搜索流量潜力的章句页面，直接对应“human nature is good / 性善”等检索意图。",
      citationAngle: "引用时要保留“若夫为不善，非才之罪也”和“仁义礼智，非由外铄我也”两层，否则会把性善误读成“人不会作恶”。",
      relatedLinks: [
        { path: "/principles/xing-shan", label: "性善" },
        { path: "/books/gong-sun-chou-i/2a-6", label: "《孟子》2A.6：孺子将入于井与四端" },
        { path: "/books/gao-zi-i/6a-15", label: "《孟子》6A.15：大人、小人与心之官" },
      ],
    },
    en: {
      seoTitle: "Mencius 6A.6: why Mencius insists that human nature is good",
      seoDescription: "Against claims that human nature is neutral or mixed, Mencius returns to the ordinary structure of human feeling and judgment to argue that moral capacity is internal, not externally installed.",
      readingQuestion: "Why does Mencius keep insisting that human nature is good when so many alternative views exist?",
      directAnswer: "Because he tests the issue against normal human capacities. If compassion, shame, respect, and moral discernment are generally present, then goodness has an internal ground rather than arriving as an outside addition.",
      firstPrinciple: "To judge human nature, Mencius starts not from exceptional monsters or sages, but from the ordinary structure that makes a person recognizably human.",
      whyItMatters: "6A.6 is one of the most complete defenses of human goodness in the text. It also maps directly onto the site's strongest current search opportunity around 'human nature is good' and related queries.",
      citationAngle: "Keep both the line 'doing evil is not the fault of one's capacities' and the claim that benevolence, righteousness, ritual, and wisdom are not hammered into us from outside. Without both, the argument gets oversimplified.",
      relatedLinks: [
        { path: "/principles/xing-shan", label: "Human nature is good" },
        { path: "/books/gong-sun-chou-i/2a-6", label: "Mencius 2A.6: the child at the well and the four beginnings" },
        { path: "/books/gao-zi-i/6a-15", label: "Mencius 6A.15: the great person, the little person, and the ruling heart" },
      ],
    },
  },
  "孟子 6A.12": {
    zh: {
      seoTitle: "《孟子·告子上》6A.12：无名指譬喻与道德自省",
      seoDescription: "孟子用“弯曲的无名指”说明人会在身体小缺陷上用心，却常对心不如人失去羞耻，这正是不知轻重、不知类比。",
      readingQuestion: "为什么孟子用弯曲的手指来讲心的修养问题？",
      directAnswer: "因为人对外形小缺陷往往立刻在意，却能长期容忍判断和德性上的缺陷。孟子借此逼人承认：心不如人，其实比手指不如人更该着急。",
      firstPrinciple: "真正的自省，不是只修补看得见的问题，而是重新排列什么才值得优先修复。",
      whyItMatters: "这章把性善论落到修养层面：既然心有可长之处，那么忽视它本身就是一种判断失序。",
      citationAngle: "引用这个譬喻时，关键不是手指的怪异感，而是最后一句“此之谓不知类也”，也就是不知道该如何比较轻重。",
      relatedLinks: [
        { path: "/principles/xing-shan", label: "性善" },
        { path: "/books/gao-zi-i/6a-15", label: "《孟子》6A.15：大人、小人与心之官" },
      ],
    },
    en: {
      seoTitle: "Mencius 6A.12: the bent finger and moral self-examination",
      seoDescription: "Mencius compares a bent fourth finger with a deficient heart to show that people often rush to fix visible defects while tolerating deeper failures of judgment.",
      readingQuestion: "Why does Mencius use a bent finger to talk about cultivating the heart?",
      directAnswer: "Because people quickly care about minor visible defects, yet may tolerate serious defects of judgment and character for years. The analogy exposes a disordered sense of priority.",
      firstPrinciple: "Real self-examination is not only about fixing what can be seen. It is about reordering what deserves urgent repair.",
      whyItMatters: "This passage carries the doctrine of human goodness into the level of practice: if the heart can be made better, then neglecting it is already a failure of judgment.",
      citationAngle: "The key line is not the finger itself but the final charge of 'not knowing how to classify.' The passage is about moral priority, not anatomical oddity.",
      relatedLinks: [
        { path: "/principles/xing-shan", label: "Human nature is good" },
        { path: "/books/gao-zi-i/6a-15", label: "Mencius 6A.15: the great person, the little person, and the ruling heart" },
      ],
    },
  },
  "孟子 6A.15": {
    zh: {
      seoTitle: "《孟子·告子上》6A.15：大人小人之分与心之官",
      seoDescription: "孟子在 6A.15 用“大体 / 小体”说明人格差异不在出身，而在谁做主：是耳目被外物牵着走，还是心之官真正开始思。",
      readingQuestion: "孟子为什么说“大人”和“小人”的差别在于从大体还是从小体？",
      directAnswer: "因为他要把人格高下从身份转回主导权问题。若耳目一直被外物拖着走，人就只能被即时刺激牵引；只有让心之官去思，人才可能站住更大的判断。",
      firstPrinciple: "人的问题常不在有没有感官欲望，而在有没有建立一个能统摄欲望、重新排序轻重的中心。",
      whyItMatters: "这章把性善与修身接起来：既然心之官本可思，就能解释为什么人成为“大人”不是天赋标签，而是持续选择的结果。",
      citationAngle: "引用时不要把“大人 / 小人”当道德辱骂，重点在“心之官则思；思则得之”，也就是主导结构而不是情绪评价。",
      relatedLinks: [
        { path: "/principles/xing-shan", label: "性善" },
        { path: "/principles/hao-ran-zhi-qi", label: "浩然之气" },
        { path: "/books/gao-zi-i/6a-12", label: "《孟子》6A.12：无名指譬喻与道德自省" },
      ],
    },
    en: {
      seoTitle: "Mencius 6A.15: the great person, the little person, and the ruling heart",
      seoDescription: "In 6A.15 Mencius explains that the difference between a great person and a little person is not birth but which part governs: the thinking heart or the senses pulled by external things.",
      readingQuestion: "Why does Mencius define the difference between a great person and a little person through the greater and lesser parts of the self?",
      directAnswer: "Because he wants to relocate moral rank from social status to governing structure. If the senses are always dragged by external objects, a person stays reactive; if the heart thinks and leads, larger judgment becomes possible.",
      firstPrinciple: "The problem is not that humans have desires. The problem is whether there is a center capable of ordering them instead of being ruled by them.",
      whyItMatters: "This passage ties human goodness to cultivation. If the heart is by nature capable of thinking, then becoming a 'great person' is not a label fixed at birth but a matter of sustained direction.",
      citationAngle: "Do not read 'great person' and 'little person' as mere insult language. The decisive line is that the heart thinks and thereby attains, which makes the passage structural rather than emotional.",
      relatedLinks: [
        { path: "/principles/xing-shan", label: "Human nature is good" },
        { path: "/principles/hao-ran-zhi-qi", label: "Flood-like qi" },
        { path: "/books/gao-zi-i/6a-12", label: "Mencius 6A.12: the bent finger and moral self-examination" },
      ],
    },
  },
  "孟子 2B.1": {
    zh: {
      seoTitle: "《孟子·公孙丑下》2B.1：天时不如地利，地利不如人和",
      seoDescription: "孟子用攻城守城的例子说明，决定政治成败的最高因素不是天时和地势，而是人心是否真正同向。",
      readingQuestion: "为什么孟子把“人和”放在天时、地利之上？",
      directAnswer: "因为再好的时机和地势，如果内部离心，终究守不住；反过来，真正得道而多助时，政治力量会从人心里不断长出来。",
      firstPrinciple: "秩序的最后基础不是环境优势，而是参与者愿不愿意把自己放进同一套正当关系里。",
      whyItMatters: "这章把孟子政治思想从个人德性推进到集体秩序，适合承接关于国家治理、团队协同和社会信任的搜索意图。",
      citationAngle: "引用“人和”时，最好连同“得道者多助，失道者寡助”一起出现，否则容易把它误读成单纯的人情和气氛。",
      relatedLinks: [
        { path: "/principles/ren-zheng", label: "仁政：政治从保护百姓开始" },
        { path: "/books/liang-hui-wang-i/1a-1", label: "《孟子》1A.1：何必曰利与义利之辨" },
      ],
    },
    en: {
      seoTitle: "Mencius 2B.1: favorable weather is not as good as human harmony",
      seoDescription: "Mencius argues through siege imagery that the deepest source of political strength is not timing or terrain, but whether people are truly aligned in heart.",
      readingQuestion: "Why does Mencius rank human harmony above favorable timing and geography?",
      directAnswer: "Because even excellent conditions collapse when a polity is inwardly divided, while moral legitimacy keeps generating strength when people actually support the order they live under.",
      firstPrinciple: "The final basis of order is not circumstance but whether participants are willing to stand inside the same legitimate relationship.",
      whyItMatters: "This passage scales Mencius from individual virtue to collective order. It speaks directly to search intent around social trust, political legitimacy, and durable coordination.",
      citationAngle: "Quote it with 'those who have the Way receive much support.' Otherwise 'human harmony' gets flattened into mere friendliness or soft sentiment.",
      relatedLinks: [
        { path: "/principles/ren-zheng", label: "Humane government" },
        { path: "/books/liang-hui-wang-i/1a-1", label: "Mencius 1A.1: why profit cannot be the language of rule" },
      ],
    },
  },
  "孟子 4A.4": {
    zh: {
      seoTitle: "《孟子·离娄上》4A.4：行有不得，反求诸己",
      seoDescription: "孟子把“爱人不亲、治人不治、礼人不答”都拉回自我检验：遇到关系失灵，先反求诸己，而不是先把责任全部外抛。",
      readingQuestion: "孟子为什么在关系受挫时强调“反求诸己”？",
      directAnswer: "因为真正可控制、可修复的第一环总在自己身上。先检查仁、智、敬是否到位，才能分清到底是自己失正，还是对方失道。",
      firstPrinciple: "修身不是自责成瘾，而是优先处理自己真正能改动的变量。",
      whyItMatters: "这章能把孟子从抽象德性拉回到日常关系治理，适合承接“反求诸己”“自我反省”“如何处理不被回应”等搜索意图。",
      citationAngle: "不要把“反求诸己”读成无限内耗。它的前提是先校正自身，再判断世界，而不是取消对外部事实的辨认。",
      relatedLinks: [
        { path: "/principles/xing-shan", label: "性善" },
        { path: "/books/gao-zi-i/6a-15", label: "《孟子》6A.15：大人小人与心之官" },
      ],
    },
    en: {
      seoTitle: "Mencius 4A.4: when things fail, turn the inquiry back on yourself",
      seoDescription: "Mencius treats failed love, failed governance, and failed courtesy as occasions to examine oneself first rather than exporting all blame outward.",
      readingQuestion: "Why does Mencius insist on self-examination when relationships break down?",
      directAnswer: "Because the first variables one can actually repair are internal. By testing one's own benevolence, intelligence, and respect first, one can distinguish self-failure from external disorder.",
      firstPrinciple: "Cultivation is not compulsive self-blame. It is the discipline of starting with the factors one can genuinely alter.",
      whyItMatters: "This passage turns Mencius into a guide for everyday relationship governance and fits search intent around reflection, accountability, and interpersonal repair.",
      citationAngle: "Do not read 'turn back on yourself' as endless self-reproach. The point is to calibrate oneself first, not to deny reality outside oneself.",
      relatedLinks: [
        { path: "/principles/xing-shan", label: "Human nature is good" },
        { path: "/books/gao-zi-i/6a-15", label: "Mencius 6A.15: the great person, the little person, and the ruling heart" },
      ],
    },
  },
  "孟子 4A.17": {
    zh: {
      seoTitle: "《孟子·离娄上》4A.17：嫂溺援之以手与权变",
      seoDescription: "孟子用“嫂溺援之以手”说明礼不是死规矩。原则不变，但在极端情境中，真正合义的做法可能需要权变。",
      readingQuestion: "为什么孟子用“嫂溺援之以手”来讲礼与权变？",
      directAnswer: "因为他要证明礼的目的不是把人困死在形式里，而是在守住根本关系的前提下，知道何时该用非常之举救急。",
      firstPrinciple: "原则与规则不是一回事。原则给方向，规则给通常做法；当通常做法会伤害原则时，就必须回到原则本身。",
      whyItMatters: "这是理解孟子如何处理“原则”与“变通”的关键章句，能承接关于伦理困境、应急判断和规则边界的搜索意图。",
      citationAngle: "引用时重点应放在“礼也 / 权也”的区分，而不是把这章当成一条为任何破例背书的万能条款。",
      relatedLinks: [
        { path: "/principles/ren-zheng", label: "仁政" },
        { path: "/books/li-lou-i/4a-4", label: "《孟子》4A.4：行有不得，反求诸己" },
      ],
    },
    en: {
      seoTitle: "Mencius 4A.17: rescuing the drowning sister-in-law and moral discretion",
      seoDescription: "Mencius uses the drowning sister-in-law case to show that ritual is not rigid formalism. The principle stays fixed, but fitting action in emergencies may require discretion.",
      readingQuestion: "Why does Mencius use the drowning sister-in-law case to discuss ritual and flexibility?",
      directAnswer: "Because he wants to show that ritual does not exist to trap people inside form. When an emergency threatens the very goods ritual serves, one must return to the principle and act accordingly.",
      firstPrinciple: "Principles and rules are not identical. Principles orient; rules govern normal cases. When the normal rule would violate the principle, one must move back to the principle itself.",
      whyItMatters: "This is a core Mencian passage on the relation between moral rule and discretionary judgment, with clear relevance to ethical dilemmas and edge cases.",
      citationAngle: "The key distinction is between ritual and discretion, not a blanket permission slip for exceptions. Without that distinction, the passage gets abused.",
      relatedLinks: [
        { path: "/principles/ren-zheng", label: "Humane government" },
        { path: "/books/li-lou-i/4a-4", label: "Mencius 4A.4: when things fail, turn the inquiry back on yourself" },
      ],
    },
  },
  "孟子 4B.1": {
    zh: {
      seoTitle: "《孟子·离娄下》4B.1：先圣后圣，其揆一也",
      seoDescription: "孟子把舜和文王并举，说明圣人的地域、时代和出身可以不同，但真正合道的判断尺度并不分裂。",
      readingQuestion: "孟子为什么强调“先圣后圣，其揆一也”？",
      directAnswer: "因为他要说明道并不是地方风俗或时代偏见的产物。真正的正当秩序，在不同人物和时空里会呈现出可以互相印证的同一尺度。",
      firstPrinciple: "若一个原则只能在某一地某一时成立，它就还没有触及根本；能跨时空重复成立，才更接近道。",
      whyItMatters: "这章有助于说明为什么孟子思想可以被重新翻译到今天，而不是只能被封存在古代中国的特殊语境里。",
      citationAngle: "不要把“一”理解成表面做法完全相同。孟子说的是判断尺度同一，不是历史表现形式没有差异。",
      relatedLinks: [
        { path: "/en/about", label: "About mengtzu.com" },
        { path: "/books/jin-xin-i/7a-1", label: "《孟子》7A.1：尽其心者，知其性也" },
      ],
    },
    en: {
      seoTitle: "Mencius 4B.1: the earlier sage and the later sage share one measure",
      seoDescription: "By pairing Shun and King Wen, Mencius argues that region, era, and origin may differ, but the true measure of the Way does not split apart.",
      readingQuestion: "Why does Mencius say that earlier and later sages share one standard?",
      directAnswer: "Because he wants to deny that the Way is merely local custom or historical prejudice. A genuinely right order can be recognized across distance and time.",
      firstPrinciple: "If a principle holds only in one place and one period, it has not yet touched the root. What approaches the Way should be able to recur under different conditions.",
      whyItMatters: "This passage helps justify translating Mencius into contemporary problems instead of locking him inside a single ancient context.",
      citationAngle: "The point is sameness of measure, not identical surface behavior. Mencius is not erasing historical difference.",
      relatedLinks: [
        { path: "/en/about", label: "About mengtzu.com" },
        { path: "/books/jin-xin-i/7a-1", label: "Mencius 7A.1: exhausting the heart and knowing Heaven" },
      ],
    },
  },
  "孟子 4B.8": {
    zh: {
      seoTitle: "《孟子·离娄下》4B.8：人有不为也，而后可以有为",
      seoDescription: "孟子用极短一句话指出，真正的行动力不是事事都做，而是先明确哪些事绝不能做，由此才形成可靠的作为。",
      readingQuestion: "为什么孟子说“人有不为也，而后可以有为”？",
      directAnswer: "因为没有边界的行动，不会形成稳定方向。先确定哪些事不可做，才能让资源、判断和人格力量真正集中到值得做的事上。",
      firstPrinciple: "选择的力量，不只来自能做什么，更来自知道什么不该做。",
      whyItMatters: "这句简短却很适合现代搜索意图，能承接“如何取舍”“如何建立原则边界”“怎么聚焦行动力”等问题。",
      citationAngle: "不要把它读成消极保守。孟子强调的是先立禁区，再形成有效作为，而不是把不作为当成美德。",
      relatedLinks: [
        { path: "/principles/hao-ran-zhi-qi", label: "浩然之气" },
        { path: "/books/gao-zi-i/6a-15", label: "《孟子》6A.15：大人小人与心之官" },
      ],
    },
    en: {
      seoTitle: "Mencius 4B.8: only by refusing some things can one truly act",
      seoDescription: "Mencius compresses a major moral insight into one line: effective action does not begin with doing everything, but with first deciding what must not be done.",
      readingQuestion: "Why does Mencius say that a person must have things they will not do before they can really act?",
      directAnswer: "Because action without boundaries has no durable direction. Only when some lines are firmly refused can judgment, effort, and character gather around worthwhile action.",
      firstPrinciple: "The power of choice comes not only from what one can do, but from knowing what one should never do.",
      whyItMatters: "This brief line connects naturally to modern search intent around focus, boundaries, and principled action.",
      citationAngle: "It is not a slogan for passivity. The point is that refusal creates the conditions for trustworthy action.",
      relatedLinks: [
        { path: "/principles/hao-ran-zhi-qi", label: "Flood-like qi" },
        { path: "/books/gao-zi-i/6a-15", label: "Mencius 6A.15: the great person, the little person, and the ruling heart" },
      ],
    },
  },
  "孟子 4B.12": {
    zh: {
      seoTitle: "《孟子·离娄下》4B.12：大人者，不失其赤子之心",
      seoDescription: "孟子用“赤子之心”说明伟大并不是老于世故，而是在复杂世界里仍能保存未被扭曲的根本心性。",
      readingQuestion: "孟子为什么把“大人”定义为不失赤子之心的人？",
      directAnswer: "因为真正成熟不是把心磨硬，而是在经历世事之后，仍不丢掉最初那份清明、真诚和可感受善恶的能力。",
      firstPrinciple: "成长若以丧失本心为代价，就不是成全，而是耗损。",
      whyItMatters: "这是最容易被广泛引用的孟子名句之一，适合承接“赤子之心”“child's heart”“如何在复杂世界里保持初心”等搜索问题。",
      citationAngle: "不要把“赤子之心”浪漫化成幼稚。孟子说的不是无知，而是未被扭曲的根本心性仍在。",
      relatedLinks: [
        { path: "/principles/xing-shan", label: "性善" },
        { path: "/books/gao-zi-i/6a-11", label: "《孟子》6A.11：求其放心而已矣" },
      ],
    },
    en: {
      seoTitle: "Mencius 4B.12: the great person does not lose the child's heart",
      seoDescription: "For Mencius, greatness is not hardened worldliness but the preservation of an uncorrupted moral heart in the midst of complexity.",
      readingQuestion: "Why does Mencius define the great person as one who does not lose the child's heart?",
      directAnswer: "Because true maturity is not a heart made numb. It is the ability to pass through worldly complexity without losing the original clarity by which one still feels and judges well.",
      firstPrinciple: "If growth costs the loss of the original heart, it is damage rather than fulfillment.",
      whyItMatters: "This is one of Mencius's most quotable lines and naturally serves search intent around innocence, integrity, and preserving the heart in a hard world.",
      citationAngle: "Do not romanticize the child's heart as childish ignorance. Mencius means an unwarped moral center, not naivete.",
      relatedLinks: [
        { path: "/principles/xing-shan", label: "Human nature is good" },
        { path: "/books/gao-zi-i/6a-11", label: "Mencius 6A.11: seeking the lost heart" },
      ],
    },
  },
  "孟子 4B.28": {
    zh: {
      seoTitle: "《孟子·离娄下》4B.28：君子所以异于人者，以其存心也",
      seoDescription: "孟子把君子之所以不同，不归到外在身份，而归到“存心”：有没有让仁与礼持续留在心里，成为稳定的反应结构。",
      readingQuestion: "孟子为什么说君子之异，不在身份，而在“存心”？",
      directAnswer: "因为外在位置可以偶然获得，只有内在保存仁心与礼心，才会在冲突、逆境和误解中表现出真正不同的行为方向。",
      firstPrinciple: "人最终会在反复情境中，暴露自己平时到底把什么存放在心里。",
      whyItMatters: "这章把人格差异从标签转回心性结构，很适合承接“君子是什么”“如何保持仁心礼心”等搜索意图。",
      citationAngle: "引用时不要只停在“君子所以异于人者”，后面关于自反与终身之忧的展开，才说明这不是气质口号。",
      relatedLinks: [
        { path: "/principles/hao-ran-zhi-qi", label: "浩然之气" },
        { path: "/books/li-lou-i/4a-4", label: "《孟子》4A.4：行有不得，反求诸己" },
      ],
    },
    en: {
      seoTitle: "Mencius 4B.28: the noble person differs by what is kept in the heart",
      seoDescription: "Mencius grounds the difference of the noble person not in status but in what is preserved within: benevolence and ritual held long enough to become a stable moral structure.",
      readingQuestion: "Why does Mencius say the noble person differs from others by what is kept in the heart?",
      directAnswer: "Because external position can be accidental. What truly distinguishes a person is whether benevolence and ritual have been preserved deeply enough to guide conduct under strain, conflict, and misunderstanding.",
      firstPrinciple: "Across repeated situations, people eventually reveal what they have been storing in the heart all along.",
      whyItMatters: "This passage relocates moral difference from labels to inner structure and fits search intent around what a junzi is and how character is preserved.",
      citationAngle: "Do not stop at the opening line. The later movement into self-reflection and lifelong concern shows that this is not a personality slogan.",
      relatedLinks: [
        { path: "/principles/hao-ran-zhi-qi", label: "Flood-like qi" },
        { path: "/books/li-lou-i/4a-4", label: "Mencius 4A.4: when things fail, turn the inquiry back on yourself" },
      ],
    },
  },
  "孟子 6A.10": {
    zh: {
      seoTitle: "《孟子·告子上》6A.10：舍生取义与鱼熊掌譬喻",
      seoDescription: "孟子借“鱼与熊掌”说明生命并不是最高值。当义与生不可兼得时，人之所以为人，正在于知道何者更重。",
      readingQuestion: "为什么孟子要用鱼和熊掌来讲“舍生取义”？",
      directAnswer: "因为他要把抽象义理变成每个人都能理解的取舍结构：当两个都想要的东西不能兼得时，真正的问题是你心中到底把什么排在更高的位置。",
      firstPrinciple: "价值排序决定行动边界；没有高于生存本能的尺度，道德就无法成立。",
      whyItMatters: "这是最著名的孟子名句之一，直接对应“舍生取义”“鱼与熊掌”“Mencius righteousness”之类的搜索入口。",
      citationAngle: "不要只截取“舍生取义”四字，后面关于“贤者能勿丧耳”的说明，才解释为何这不是英雄神话，而是人人本有之心。",
      relatedLinks: [
        { path: "/principles/xing-shan", label: "性善" },
        { path: "/books/gao-zi-i/6a-6", label: "《孟子》6A.6：为什么孟子坚持性善" },
      ],
    },
    en: {
      seoTitle: "Mencius 6A.10: choosing righteousness over life",
      seoDescription: "Through the image of fish and bear's paws, Mencius argues that life is not the highest value; what makes morality possible is knowing when righteousness outranks survival.",
      readingQuestion: "Why does Mencius use fish and bear's paws to explain choosing righteousness over life?",
      directAnswer: "Because he wants to translate abstract morality into a familiar structure of preference. When two desired goods cannot both be kept, the decisive issue is what stands highest in one's actual order of value.",
      firstPrinciple: "Value hierarchy shapes the boundary of action. Without a standard higher than survival, morality cannot hold.",
      whyItMatters: "This is one of Mencius's most famous passages and directly serves search intent around righteousness, sacrifice, and the fish-and-bear's-paws analogy.",
      citationAngle: "Do not quote only the heroic phrase about choosing righteousness over life. The later line about the wise not losing this heart shows that the capacity is humanly shared, not mythic.",
      relatedLinks: [
        { path: "/principles/xing-shan", label: "Human nature is good" },
        { path: "/books/gao-zi-i/6a-6", label: "Mencius 6A.6: why Mencius insists that human nature is good" },
      ],
    },
  },
  "孟子 6A.11": {
    zh: {
      seoTitle: "《孟子·告子上》6A.11：学问之道无他，求其放心而已矣",
      seoDescription: "孟子把学习的核心定义成“求放心”：仁与义本来就在心里，难处不是制造它们，而是在失散之后把心找回来。",
      readingQuestion: "为什么孟子说学问之道无他，只是“求其放心”？",
      directAnswer: "因为如果人心本来就有向善能力，那么学习的核心就不是外加一套陌生东西，而是把放失的心重新找回、安顿、守住。",
      firstPrinciple: "教育若只是填充，而不是找回和保存本心，就容易变成知识堆积而不是人格生长。",
      whyItMatters: "这章很适合承接“学习的本质”“如何找回本心”“Mencius lost heart”之类的搜索意图，也能直接服务站内方法论定位。",
      citationAngle: "不要把“放心”误读成放松心情。孟子说的是放失、散乱、偏离正路的心，需要被找回而不是被安慰。",
      relatedLinks: [
        { path: "/principles/xing-shan", label: "性善" },
        { path: "/method", label: "读法：从第一性原理重读《孟子》" },
      ],
    },
    en: {
      seoTitle: "Mencius 6A.11: learning is nothing other than seeking the lost heart",
      seoDescription: "Mencius defines learning as seeking back the heart that has gone astray. The difficulty is not manufacturing goodness, but recovering and preserving it.",
      readingQuestion: "Why does Mencius say that learning is simply the work of seeking the lost heart?",
      directAnswer: "Because if moral capacity is already present, then education does not mainly import something alien. It recalls, steadies, and preserves a heart that has wandered away.",
      firstPrinciple: "When education is only accumulation and not recovery of the heart, knowledge grows while the person fragments.",
      whyItMatters: "This passage aligns strongly with search intent around the meaning of learning, recovering the self, and Mencius's moral psychology.",
      citationAngle: "Do not mistake 'lost heart' for relaxation or mood. Mencius means a heart that has gone astray and must be found again.",
      relatedLinks: [
        { path: "/principles/xing-shan", label: "Human nature is good" },
        { path: "/method", label: "Method: reading the Mencius from first principles" },
      ],
    },
  },
  "孟子 6B.15": {
    zh: {
      seoTitle: "《孟子·告子下》6B.15：生于忧患，死于安乐",
      seoDescription: "孟子用舜、傅说等人的经历说明，真正能承担大任的人，往往先在压力、阻碍和艰难中被锻炼出来。",
      readingQuestion: "孟子为什么说“生于忧患，死于安乐”？",
      directAnswer: "因为人和国家若长期处在过度安逸里，警觉、判断和承担能力会一起退化；相反，合宜的艰难会逼出原本还没被激活的力量。",
      firstPrinciple: "成长并不来自痛苦本身，而来自痛苦迫使人重新排列判断、忍受训练并拓展本来不足的能力。",
      whyItMatters: "这是最广为流传的孟子句子之一，直接承接“生于忧患死于安乐”的搜索流量，也能服务组织、个人成长和危机管理场景。",
      citationAngle: "不要把它读成歌颂痛苦。孟子强调的是艰难如何锻炼能力，不是苦难本身越多越好。",
      relatedLinks: [
        { path: "/principles/hao-ran-zhi-qi", label: "浩然之气" },
        { path: "/books/gong-sun-chou-i/2a-2", label: "《孟子》2A.2：四十不动心与浩然之气" },
      ],
    },
    en: {
      seoTitle: "Mencius 6B.15: life grows from adversity, death from ease",
      seoDescription: "By recalling Shun, Fu Yue, and others, Mencius argues that those capable of great responsibility are often formed through pressure, obstruction, and difficulty rather than comfort.",
      readingQuestion: "Why does Mencius say that life comes from adversity and death from ease?",
      directAnswer: "Because prolonged ease erodes alertness, judgment, and endurance in both persons and states, while fitting hardship can awaken capacities that would otherwise remain undeveloped.",
      firstPrinciple: "Growth does not come from suffering as such, but from how hardship forces a person to reorder judgment, endure training, and enlarge insufficient ability.",
      whyItMatters: "This is one of the most widely circulated lines in Mencius and clearly serves search intent around adversity, resilience, and growth under pressure.",
      citationAngle: "Do not turn it into a celebration of pain. Mencius is explaining the formative role of difficulty, not saying that more suffering is automatically better.",
      relatedLinks: [
        { path: "/principles/hao-ran-zhi-qi", label: "Flood-like qi" },
        { path: "/books/gong-sun-chou-i/2a-2", label: "Mencius 2A.2: an unmoved heart and flood-like qi" },
      ],
    },
  },
  "孟子 7A.1": {
    zh: {
      seoTitle: "《孟子·尽心上》7A.1：尽其心者，知其性也",
      seoDescription: "孟子把“知性”“知天”“立命”连成一条线：把心的能力走到尽头，人才真正知道自己是什么，也知道天所给予的尺度。",
      readingQuestion: "为什么孟子说尽其心，就能知其性、知天？",
      directAnswer: "因为人若从未把心的能力真正走到底，就只能停在零碎经验里；只有把心性充分展开，才能看到自己与更大秩序之间的关系。",
      firstPrinciple: "认识不是离开心而额外获得的信息，而是把已有能力推到充分之后，对自身结构与天道的同时发现。",
      whyItMatters: "这是《尽心》开篇，也是孟子宇宙论、修身论和命运理解的总入口，适合承接“知性知天”“Mencius Heaven and nature”之类搜索意图。",
      citationAngle: "不要把“知天”神秘化。孟子这里说的是通过充分展开人之所以为人的能力，理解天所赋予的秩序。",
      relatedLinks: [
        { path: "/principles/xing-shan", label: "性善" },
        { path: "/books/gao-zi-i/6a-15", label: "《孟子》6A.15：大人小人与心之官" },
      ],
    },
    en: {
      seoTitle: "Mencius 7A.1: exhausting the heart, knowing nature, and knowing Heaven",
      seoDescription: "Mencius binds together knowing nature, knowing Heaven, and establishing destiny: only by carrying the capacities of the heart to completion can a person grasp both self and order.",
      readingQuestion: "Why does Mencius say that exhausting the heart leads to knowing nature and Heaven?",
      directAnswer: "Because a person who never fully develops the heart remains trapped in fragments. Only when the heart's capacities are brought to completion can one perceive both oneself and the larger order one belongs to.",
      firstPrinciple: "Knowledge is not extra information acquired from outside the heart, but a discovery that occurs when one's given capacities are fully unfolded.",
      whyItMatters: "This opening passage of Jin Xin is a gateway into Mencius's view of cultivation, Heaven, and destiny, with clear relevance to search intent around nature and transcendence.",
      citationAngle: "Do not make 'knowing Heaven' mystical too quickly. Mencius is describing the order disclosed when human capacities are fully realized.",
      relatedLinks: [
        { path: "/principles/xing-shan", label: "Human nature is good" },
        { path: "/books/gao-zi-i/6a-15", label: "Mencius 6A.15: the great person, the little person, and the ruling heart" },
      ],
    },
  },
  "孟子 7A.9": {
    zh: {
      seoTitle: "《孟子·尽心上》7A.9：穷则独善其身，达则兼善天下",
      seoDescription: "孟子在 7A.9 区分不得志与得志时的责任：不得志先修身守义，得志则把善扩到更大范围，而不是只求自保。",
      readingQuestion: "为什么孟子把“独善其身”和“兼善天下”放在同一条路上？",
      directAnswer: "因为两者不是对立选项，而是同一个原则在不同处境下的展开：失位时不失义，得位时不离道，于是个人善与公共善才连得起来。",
      firstPrinciple: "境遇改变的是责任半径，不改变判断尺度。",
      whyItMatters: "这是最常见的孟子名句之一，直接服务“独善其身”“兼善天下”“个人修养与公共责任”这些搜索问题。",
      citationAngle: "不要把“独善其身”理解成自私退场。孟子说的是在不得志时先守住义，而不是把公共责任彻底取消。",
      relatedLinks: [
        { path: "/principles/ren-zheng", label: "仁政" },
        { path: "/books/li-lou-ii/4b-28", label: "《孟子》4B.28：君子所以异于人者，以其存心也" },
      ],
    },
    en: {
      seoTitle: "Mencius 7A.9: cultivate yourself when constrained, benefit the world when effective",
      seoDescription: "Mencius distinguishes responsibilities under frustration and success: when blocked, preserve yourself in righteousness; when effective, extend goodness outward rather than merely protecting the self.",
      readingQuestion: "Why does Mencius place self-cultivation and benefiting the world on the same line?",
      directAnswer: "Because they are not opposing options. They are the same principle unfolding under different conditions: keep righteousness when unrecognized, and extend goodness when power becomes available.",
      firstPrinciple: "Circumstance changes the radius of responsibility, not the standard of judgment.",
      whyItMatters: "This is one of Mencius's most quoted lines and serves search intent around self-cultivation, public responsibility, and the relation between personal and civic ethics.",
      citationAngle: "Do not read 'cultivate yourself alone' as selfish withdrawal. Mencius means holding to righteousness when blocked, not abandoning the public forever.",
      relatedLinks: [
        { path: "/principles/ren-zheng", label: "Humane government" },
        { path: "/books/li-lou-ii/4b-28", label: "Mencius 4B.28: the noble person differs by what is kept in the heart" },
      ],
    },
  },
  "孟子 7B.14": {
    zh: {
      seoTitle: "《孟子·尽心下》7B.14：民为贵，社稷次之，君为轻",
      seoDescription: "孟子把政治秩序的轻重次第说得极明白：人民最重，制度祭器次之，君主最轻，君的正当性来自是否真正得民。",
      readingQuestion: "为什么孟子说“民为贵，社稷次之，君为轻”？",
      directAnswer: "因为政治存在的目的不是供奉君主，而是安顿人民。制度和君位都只是服务这一目的的结构，若反过来压倒人民，本末就倒置了。",
      firstPrinciple: "权力不是目的本身；它之所以正当，只因为它应当服务比自己更高的对象。",
      whyItMatters: "这是最强烈体现孟子民本思想的章句之一，直接对应“people are the most important element in a nation”“民本思想”等搜索意图。",
      citationAngle: "引用时不要把它简单塞进现代民主口号。孟子是在自己的王道框架里重排政治正当性的次序，既可对话现代，也不能被直接等同。",
      relatedLinks: [
        { path: "/principles/ren-zheng", label: "仁政" },
        { path: "/books/liang-hui-wang-i/1a-7", label: "《孟子》1A.7：以羊易牛与王道的心理根据" },
      ],
    },
    en: {
      seoTitle: "Mencius 7B.14: the people are weightiest, the ruler is lightest",
      seoDescription: "Mencius states the order of political importance plainly: the people come first, the altars of state next, and the ruler last; legitimacy depends on truly securing the people.",
      readingQuestion: "Why does Mencius say that the people are most important and the ruler least?",
      directAnswer: "Because the point of political order is not to glorify the ruler but to settle the people well. Institutions and rulers are justified only as structures serving that higher end.",
      firstPrinciple: "Power is not self-justifying. It is legitimate only insofar as it serves something higher than itself.",
      whyItMatters: "This is one of the clearest statements of Mencius's people-centered political thought and maps directly to search intent around legitimacy and the value of the people.",
      citationAngle: "Do not flatten it into a generic modern slogan. Mencius is reordering political legitimacy within his own kingly-way framework, which can speak to modern concerns without collapsing into them.",
      relatedLinks: [
        { path: "/principles/ren-zheng", label: "Humane government" },
        { path: "/books/liang-hui-wang-i/1a-7", label: "Mencius 1A.7: the ox, the sheep, and the basis of kingly rule" },
      ],
    },
  },
};

export function getPassageEditorialNote(ref: string, locale: Locale) {
  return passageEditorialNotes[ref]?.[locale] ?? null;
}
