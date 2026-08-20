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
};

export function getPassageEditorialNote(ref: string, locale: Locale) {
  return passageEditorialNotes[ref]?.[locale] ?? null;
}
