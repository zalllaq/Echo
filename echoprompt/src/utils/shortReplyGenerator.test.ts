import { describe, it, expect } from "vitest";
import { generateShortReply, jaccardSimilarity } from "./shortReplyGenerator";

describe("generateShortReply", () => {
  it("returns a string containing asterisk emphasis", () => {
    const result = generateShortReply("有点累");
    expect(result).toMatch(/\*[^*]+\*/);
  });

  it("returns different style for pragmatic keywords", () => {
    const result = generateShortReply("工作没意思，算了");
    expect(result).toBeTruthy();
    expect(result.length).toBeGreaterThan(10);
  });

  it("returns different style for urban keywords", () => {
    const result = generateShortReply("地铁上全是人");
    expect(result).toBeTruthy();
    expect(result.length).toBeGreaterThan(10);
  });

  it("handles empty input gracefully", () => {
    const result = generateShortReply("");
    expect(result).toBeTruthy();
  });

  it("avoids repetition when recentReplies has similar content", () => {
    const similar = "雨水在敲每扇窗，砖墙记得所有被删掉的句子。";
    const result = generateShortReply("下雨了", [similar]);
    const similarity = jaccardSimilarity(result, similar);
    expect(similarity).toBeLessThan(0.8);
  });
});

describe("jaccardSimilarity", () => {
  it("returns 1 for identical strings", () => {
    expect(jaccardSimilarity("hello", "hello")).toBe(1);
  });

  it("returns 0 for completely different strings", () => {
    const sim = jaccardSimilarity("abc", "xyz");
    expect(sim).toBe(0);
  });

  it("returns a value between 0 and 1 for partially similar strings", () => {
    const sim = jaccardSimilarity("雨水敲窗", "雨水敲打窗户");
    expect(sim).toBeGreaterThan(0);
    expect(sim).toBeLessThan(1);
  });
});
