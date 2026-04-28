import type { WorldviewPipeline, WorldviewContext } from "../types/session";

/* ========== 情感词库 ========== */

const emotionLexicon: Record<string, string> = {
  平静: "平静",
  焦虑: "焦虑",
  害怕: "恐惧",
  孤独: "孤独",
  疲惫: "疲惫",
  累: "疲惫",
  快乐: "雀跃",
  开心: "雀跃",
  悲伤: "哀伤",
  伤心: "哀伤",
  难过: "哀伤",
  愤怒: "愤怒",
  生气: "愤怒",
  好奇: "好奇",
  迷茫: "迷茫",
  不知道: "迷茫",
  期待: "期待",
  希望: "希冀",
  绝望: "绝望",
  温暖: "温暖",
  冷: "冰冷",
};

const locationLexicon: string[] = [
  "城市",
  "海",
  "山",
  "森林",
  "沙漠",
  "街道",
  "房间",
  "天台",
  "车站",
  "桥",
  "河",
  "图书馆",
  "废墟",
  "教堂",
  "公园",
];

/* ========== 流水线第一关：提取结构化数据 ========== */

export function extractPipeline(answer: string): WorldviewPipeline {
  const keywords = extractKeywords(answer);
  const emotion = extractEmotion(answer);
  const location = extractLocation(answer, keywords);
  const conflict = extractConflict(answer);
  const action = extractAction(answer);

  return { emotion, location, conflict, action, keywords };
}

function extractKeywords(text: string): string[] {
  const knownNouns = [
    "雨",
    "城市",
    "风",
    "孤独",
    "海",
    "夜",
    "光",
    "梦",
    "路",
    "云",
    "时间",
    "记忆",
    "影子",
    "火",
    "水",
    "石",
    "树",
    "声音",
    "沉默",
    "星辰",
    "门",
    "窗",
    "桥",
    "墙",
    "灯",
    "烟",
    "灰",
    "铁",
    "纸",
    "线",
  ];
  const matched = knownNouns.filter((noun) => text.includes(noun));
  if (matched.length >= 2) return matched.slice(0, 2);

  const words = text
    .split(/[\s，。！？、,.\s!?]+/)
    .filter((w) => w.length > 1 && w.length <= 4);
  const unique = [...new Set(words)];
  if (unique.length >= 2) return unique.slice(0, 2);
  if (unique.length === 1) return [unique[0], "回声"];

  return ["回声", "星辰"];
}

function extractEmotion(text: string): string {
  for (const [word, emotion] of Object.entries(emotionLexicon)) {
    if (text.includes(word)) return emotion;
  }
  const tones = ["平静", "低沉", "恍惚", "躁动"];
  return tones[Math.floor(Math.random() * tones.length)];
}

function extractLocation(text: string, keywords: string[]): string {
  for (const loc of locationLexicon) {
    if (text.includes(loc)) return loc;
  }
  const fromKeywords = keywords.find((k) => locationLexicon.includes(k));
  return fromKeywords ?? "无名之地";
}

function extractConflict(text: string): string {
  const conflictPatterns = [
    { match: /不/, phrase: "内心的抵抗" },
    { match: /想/, phrase: "未尽的渴望" },
    { match: /怕/, phrase: "隐伏的恐惧" },
    { match: /但|却|可/, phrase: "两难的选择" },
    { match: /等/, phrase: "漫长的等待" },
  ];
  for (const p of conflictPatterns) {
    if (p.match.test(text)) return p.phrase;
  }
  const conflicts = [
    "沉默的对抗",
    "无形的隔阂",
    "时间的磨损",
    "记忆的偏差",
  ];
  return conflicts[Math.floor(Math.random() * conflicts.length)];
}

function extractAction(text: string): string {
  const verbs = text.match(/[一-鿿]{1,3}(?:了|着|过|下去|起来)/g);
  if (verbs && verbs.length > 0) return verbs[0];
  return "驻足";
}

/* ========== 流水线第二关：构建世界观 JSON ========== */

interface WorldviewJSON {
  title: string;
  atmosphere: string;
  location: string;
  conflict: string;
  presence: string;
  continuation: string;
}

function buildWorldviewJSON(
  pipeline: WorldviewPipeline,
): WorldviewJSON {
  const k1 = pipeline.keywords[0];
  const k2 = pipeline.keywords[1] ?? "回声";

  const titleTemplates = [
    `${k1}与${k2}的褶皱带`,
    `${k1}沉默指南`,
    `${k2}之上的${k1}`,
    `${pipeline.location}的${pipeline.emotion}剖面`,
  ];

  const atmosphereTemplates = [
    `${k1}在${pipeline.location}的每个角落缓慢沉积。空气里悬浮着微小的${k2}颗粒，每一次呼吸都在体内留下${pipeline.emotion}的痕迹。`,
    `${pipeline.location}的${k1}正以肉眼不可见的速度改变形态。${k2}在边缘处发出低频的嗡鸣，像这座城市在哼一首跑调的摇篮曲。`,
  ];

  const conflictTemplates = [
    `这里的${pipeline.conflict}像一条裂缝，${k1}和${k2}从两侧渗入，在中间交汇成第三种颜色。`,
    `${pipeline.conflict}悬在${pipeline.location}的上空，像一面永远不会落下的旗帜。${k1}在旗帜下穿行，${k2}在旗帜上写满看不懂的铭文。`,
  ];

  const presenceTemplates = [
    `你站在这里，${pipeline.action}。你的${pipeline.emotion}像一块石头落入${k1}之中，激起${k2}形状的涟漪。*这个世界因为你的存在而微微变形*。`,
    `你的${pipeline.action}被记录在${pipeline.location}的档案里。${k1}在你的脚印上覆盖了一层薄薄的${k2}。*你走之后，这�的的重量分布发生了永久的改变*。`,
  ];

  const continuationTemplates = [
    `远处，${k1}与${k2}的交界处有光在闪烁。不是求救信号，也不是灯塔——*那是这个世界在回应你的存在*。`,
    `在${k1}的尽头，${k2}开始生长。*如果你继续走，或许能在天亮之前抵达另一种可能*。`,
  ];

  const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  return {
    title: pick(titleTemplates),
    atmosphere: pick(atmosphereTemplates),
    location: pipeline.location,
    conflict: pick(conflictTemplates),
    presence: pick(presenceTemplates),
    continuation: pick(continuationTemplates),
  };
}

/* ========== 天人感应风格短句池 ========== */

const styleSentences: string[] = [
  "天不言，而四时行焉。你的脚印落在地面，*大地便记住了你的重量*。",
  "风过疏竹，风去而竹不留声。但你走过之后，*空气里留下了你体温的余韵*。",
  "静坐观心，心无所住。你不是走进这个世界，*你是让这个世界从你体内穿过*。",
  "天地不仁，以万物为刍狗。但此刻，*星光偏爱你这一瞬的呼吸*。",
  "水流不争先，争的是滔滔不绝。你那些说不出口的话，*早已汇入地下暗河，从未消失*。",
  "山不让尘，川不辞盈。*你的渺小正是与世界平等对话的资格*。",
  "万物并作，吾以观复。你看见的不是世界，*是世界终于愿意让你看见的那一面*。",
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function injectStyleSentence(json: WorldviewJSON): string | null {
  if (Math.random() >= 0.4) return null;

  const location = json.location;
  const matchTerms = [location, ...json.atmosphere.match(/[一-鿿]{2,4}/g) ?? []];
  const sentence = pickRandom(styleSentences);

  // 尝试替换句子中提到的关键词
  const term = matchTerms.find((t) => t.length >= 2 && sentence.includes(t));
  if (term) return sentence;

  return sentence;
}

/* ========== 流水线第三关：渲染为自然语言 ========== */

function renderWorldviewJSON(json: WorldviewJSON): string {
  const parts = [
    `《${json.title}》`,
    json.atmosphere,
    json.conflict,
    json.presence,
    json.continuation,
  ];
  let text = parts.join("\n\n");

  const extra = injectStyleSentence(json);
  if (extra) {
    text += "\n\n" + extra;
  }

  return text;
}

/* ========== 世界观上下文→下一个问题 ========== */

const progressionTemplates: string[] = [
  "在【key1】与【key2】交织的世界中，你发现了一扇之前不曾注意的门。门上刻着一段模糊的文字，似乎只有你才能读懂。*你会推开它吗？*",
  "【key1】在你周围悄然变化，像是一个古老的存在正在回应你的到来。有人说，如果你继续深入，就能找到【key2】的源头。*你选择前进，还是绕道？*",
  "这个世界的记忆开始渗透进你的意识。你看到了【key1】背后的景象——一座被【key2】覆盖的图书馆，里面的书全是空白的。*你会在一本空白书上写下什么？*",
  "一阵风从【key1】的方向吹来，带着不属于这个季节的温度。在【key2】的低语中，你听到了一个名字——那似乎是你明天会遇见的人。*你记住了这个名字吗？*",
  "世界的褶皱在你脚下展开。前方，一条由【key2】铺成的小径通向密林深处。有人说路的尽头有一个*只回答真心问题的回声壁*。*你要去吗？*",
  "你在这个世界留下的痕迹开始*反向书写你*——你的记忆中出现了一个不属于你的画面：一座被【key1】环绕的塔，塔顶的窗户亮着灯。*那是你曾经去过的地方，还是将要到达的地方？*",
];

export function generateProgressionQuestion(context: WorldviewContext): string {
  const lastTurn = context.turns[context.turns.length - 1];
  const k1 = lastTurn.pipeline.keywords[0];
  const k2 = lastTurn.pipeline.keywords[1] ?? "回声";

  const template =
    progressionTemplates[
      context.turns.length % progressionTemplates.length
    ];
  return template.replace("【key1】", k1).replace("【key2】", k2);
}

/* ========== 主函数：完整流水线 ========== */

export function generateWorldviewPipeline(
  answer: string,
): { text: string; pipeline: WorldviewPipeline } {
  const pipeline = extractPipeline(answer);
  const json = buildWorldviewJSON(pipeline);
  const text = renderWorldviewJSON(json);

  return {
    text: text.length > 500 ? text.slice(0, 497) + "..." : text,
    pipeline,
  };
}
