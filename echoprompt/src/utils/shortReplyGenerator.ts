import type { ShortReplyStyle, SentenceType } from "../types/session";
import { getRandomSceneByStyle } from "./imageryPool";

/* ========== 三种风格的内置回复池 ========== */

const natureReplies: string[] = [
  "*雨水*在敲每扇窗，砖墙记得所有被删掉的句子。你吞回喉咙的那半句话，无非是海风在防波堤上磨出的*盐粒*。可你真的甘心让这座城市独自老去？",
  "路灯亮起不是因为夜晚，而是因为有人还在走路。*疲惫*不过是行道树在风里数落叶——世界不需要你立刻给出答案，*它只是想知道你还在听*。",
  "风把旧报纸吹到墙角，上面印着昨天的日期。你那些*没写完的句子*躺在草稿箱里，像被遗忘在站台的行李。*夜还长，灯还亮，字还可以再改*。",
  "人们总说时间能解决问题，可时间本身就是*问题*。你站在窗前看雨，雨也在看你，*你们都是过客，谁也救不了谁*。",
  "秋千在风里自己晃动，像一个*看不见的孩子还在玩*。你坐在长椅上看了很久，直到路灯亮起。*这大概就是宁静的形状*。",
  "风从海上来的路上什么都没学会，除了*不断地到达又离开*。你站在窗前，*觉得自己比风还要轻一些*。",
  "江风把你的头发吹进眼睛里。你没去拨开，*因为模糊的世界看起来更温柔一些*。船笛鸣了一声，*像这座城市在夜里叹了口气*。",
];

const pragmaticReplies: string[] = [
  "行吧，你又没有别的选择。那就把这页纸填满，哪怕只是潦草的涂鸦。*总比空白好，空白让人心慌*。",
  "你说得对，这确实没什么意思。但*有意思的事从来不会自己送上门*。你得先站起来，把椅子推回桌下，*然后再说下一步*。",
  "你把手机放下，屏幕还亮着。那些没回的消息就先不回了。*世界上没有那么多的紧急，但有那么多的重要*。而你现在只缺一杯热水。",
  "承认吧，你根本没想好。但*没想好也没关系*。这座城市的多数人都在假装知道自己在干什么。*你至少诚实地停下来了*。",
  "你以为会被质问，结果世界只是拍了拍你的肩膀说：*下次早点睡。*你愣了一下，笑了。*确实，天还没塌*。",
  "烟囱早就不冒烟了，但你还在*烧*。那些没用的热情像煤渣一样堆在墙角。行吧，至少你还有力气*把灰烬铲到一边*。",
  "柏油路在烈日下软化，留下每双脚印的*轮廓*。你以为自己没留下什么，其实*每一步都改变了地面的温度*。别说你不重要。",
];

const urbanReplies: string[] = [
  "地铁在隧道里摩擦出*火花*，像你藏了一天的情绪终于擦出响声。这座城市每天吞下上百万个未说出口的故事，*你那一句，也不过是其中一声回音*。",
  "你盯着屏幕，屏幕也在盯着你。那些短促的叹息被空调吸走，变成云。*你问意义？* 桥从不问自己为什么跨在河上。*走吧，下一个问题会烫一些*。",
  "书架之间的灰尘在下午的光线里*缓慢旋转*，像这座城市被遗忘的瞬间。你的故事夹在某两页之间，*书页泛黄，但字还在*。",
  "站牌上的末班车时间已经过了。你不知道它来过没有，还是根本不会来了。*你在路灯下站着，影子比你先到家*。",
  "你说了一句很轻的话，被地铁的风带走了。但这座城市有*回声存储系统*——每个字都被记在某面墙上，*等时间到了，墙会开口说话*。",
  "凌晨的自助洗衣房里只有你一个人。窗外的路灯把你的影子拉得很长。*你坐在塑料椅上，听着洗衣机的节奏——至少有什么东西在替你转动*。",
  "走廊的日光灯发出*均匀的嗡鸣*，像这座城市的心跳被调成了静音。你坐在塑料椅上，*手里的挂号单已经皱了*。时间在这里是另外一种流速。",
];

/* ========== 风格池 ========== */

const stylePools: Record<ShortReplyStyle, string[]> = {
  nature: natureReplies,
  pragmatic: pragmaticReplies,
  urban: urbanReplies,
};

/* ========== 关键词→风格匹配 ========== */

const styleKeywords: Record<ShortReplyStyle, string[]> = {
  nature: ["雨", "风", "海", "夜", "孤独", "安静", "自然", "树", "天空", "云", "冷", "累"],
  pragmatic: ["工作", "钱", "累", "没意思", "算了", "行吧", "生活", "现实", "无所谓", "随便", "烦"],
  urban: ["城市", "地铁", "街", "灯", "人", "声音", "手机", "屏幕", "忙", "路", "楼"],
};

function matchStyle(answer: string): ShortReplyStyle {
  const scores = (Object.entries(styleKeywords) as [ShortReplyStyle, string[]][]).map(
    ([style, keywords]) => ({
      style,
      score: keywords.reduce((s, kw) => s + (answer.includes(kw) ? 1 : 0), 0),
    }),
  );
  scores.sort((a, b) => b.score - a.score);
  if (scores[0].score > 0) return scores[0].style;
  const styles: ShortReplyStyle[] = ["nature", "pragmatic", "urban"];
  return styles[Math.floor(Math.random() * styles.length)];
}

/* ========== A/B/C 句式结构模板 ========== */

const sentenceTypes: SentenceType[] = ["image-first", "you-first", "pure-monologue"];

function applySentenceType(text: string, type: SentenceType): string {
  switch (type) {
    case "image-first":
      // 意象开头：不修改，天然以意象起始
      return text;
    case "you-first":
      // 第二人称开头：如不以"你"开头，追加"你"起始
      if (/^[你]/.test(text)) return text;
      return text.replace(/^(\*?[^*]+\*?)/, "你看见$1");
    case "pure-monologue":
      // 纯意象独白：移除第二人称，转为客观描述
      return text
        .replace(/你的/g, "它的")
        .replace(/你/g, "")
        .replace(/^，/, "")
        .trim();
  }
}

/* ========== Jaccard 相似度（基于字符 bigram） ========== */

function charBigrams(s: string): Set<string> {
  const set = new Set<string>();
  for (let i = 0; i < s.length - 1; i++) {
    set.add(s.slice(i, i + 2));
  }
  return set;
}

export function jaccardSimilarity(a: string, b: string): number {
  const bigramsA = charBigrams(a);
  const bigramsB = charBigrams(b);
  if (bigramsA.size === 0 && bigramsB.size === 0) return 1;
  let intersection = 0;
  for (const bg of bigramsA) {
    if (bigramsB.has(bg)) intersection++;
  }
  const union = bigramsA.size + bigramsB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

/* ========== 主函数 ========== */

export function generateShortReply(
  answer: string,
  recentReplies: string[] = [],
): string {
  const style = matchStyle(answer);
  const sentenceType = sentenceTypes[Math.floor(Math.random() * sentenceTypes.length)];

  const maxAttempts = 3;
  const threshold = 0.8;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    let raw: string;

    // 30% 概率从意象场景取，70% 从风格池取
    const useScene = Math.random() < 0.3;
    if (useScene) {
      const scene = getRandomSceneByStyle(style);
      const fragments = scene.fragments;
      raw = fragments[Math.floor(Math.random() * fragments.length)];
    } else {
      const pool = stylePools[style];
      const matchedIndex = pool.findIndex((reply) => {
        const terms = answer.match(/[一-鿿]{1,2}/g);
        return terms && terms.some((t) => reply.includes(t));
      });
      raw = matchedIndex !== -1 ? pool[matchedIndex] : pool[Math.floor(Math.random() * pool.length)];
    }

    const result = applySentenceType(raw, sentenceType);

    // 防重复检查
    const isDuplicate = recentReplies.some(
      (prev) => jaccardSimilarity(prev, result) > threshold,
    );

    if (!isDuplicate) return result;
  }

  // 尝试了 maxAttempts 次还没通过，返回一个风格池条目（不经结构转换）
  const pool = stylePools[style];
  return pool[Math.floor(Math.random() * pool.length)];
}
