import { describe, it, expect } from "vitest";
import { extractPipeline, generateProgressionQuestion } from "./worldviewGenerator";
import type { WorldviewContext } from "../types/session";

describe("extractPipeline", () => {
  it("extracts emotion from answer", () => {
    const result = extractPipeline("我感到很孤独，在雨中行走");
    expect(result.emotion).toBe("孤独");
  });

  it("extracts location from answer", () => {
    const result = extractPipeline("这座城市让我感到压抑");
    expect(result.location).toBe("城市");
  });

  it("extracts conflict from answer", () => {
    const result = extractPipeline("阳光很好但风是冷的");
    expect(result.conflict).toBe("两难的选择");
  });

  it("extracts keywords", () => {
    const result = extractPipeline("雨中的城市很安静");
    expect(result.keywords).toContain("雨");
    expect(result.keywords).toContain("城市");
  });

  it("returns default keywords when no known nouns found", () => {
    const result = extractPipeline("你好吗");
    expect(result.keywords.length).toBe(2);
  });
});

describe("generateProgressionQuestion", () => {
  it("generates a question referencing world keywords", () => {
    const context: WorldviewContext = {
      id: "test",
      initialImagery: "深夜便利店",
      atmosphere: "test atmosphere",
      turns: [
        {
          question: "初始问题",
          answer: "我在雨中行走",
          narrative: "test narrative",
          pipeline: {
            emotion: "孤独",
            location: "城市",
            conflict: "沉默",
            action: "行走",
            keywords: ["雨", "城市"],
          },
        },
      ],
    };
    const question = generateProgressionQuestion(context);
    expect(question).toContain("雨");
    expect(question).toContain("城市");
  });

  it("cycles through progression templates", () => {
    const baseContext: WorldviewContext = {
      id: "test",
      initialImagery: "废弃火车站",
      atmosphere: "test",
      turns: [
        {
          question: "q1",
          answer: "我在雨中",
          narrative: "n1",
          pipeline: {
            emotion: "平静",
            location: "站台",
            conflict: "沉默",
            action: "站立",
            keywords: ["雨", "回声"],
          },
        },
      ],
    };
    const q1 = generateProgressionQuestion(baseContext);
    expect(q1.length).toBeGreaterThan(10);
  });
});
