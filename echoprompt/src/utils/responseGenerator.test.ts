import { describe, it, expect } from "vitest";
import { generateResponse, generateWorldviewPipeline, generateShortReply } from "./responseGenerator";

describe("generateWorldviewPipeline", () => {
  it("returns a text and pipeline for long input", () => {
    const input = "我最近在雨中散步，感受到了一种久违的平静，仿佛整座城市都在呼吸。";
    const result = generateWorldviewPipeline(input);
    expect(result.text).toBeTruthy();
    expect(result.pipeline.emotion).toBeTruthy();
    expect(result.pipeline.keywords).toHaveLength(2);
  });

  it("pipeline contains emotion, location, conflict, action, keywords", () => {
    const input = "雨中的城市让我想起很多往事";
    const result = generateWorldviewPipeline(input);
    const p = result.pipeline;
    expect(p).toHaveProperty("emotion");
    expect(p).toHaveProperty("location");
    expect(p).toHaveProperty("conflict");
    expect(p).toHaveProperty("action");
    expect(p).toHaveProperty("keywords");
  });

  it("does not throw on short input", () => {
    expect(() => generateWorldviewPipeline("a")).not.toThrow();
  });
});

describe("generateShortReply", () => {
  it("returns a string containing at least one asterisk pair", () => {
    const result = generateShortReply("有点累");
    expect(result).toMatch(/\*[^*]+\*/);
  });

  it("returns a short reply within reasonable length", () => {
    const result = generateShortReply("没意思");
    expect(result.length).toBeGreaterThan(10);
    expect(result.length).toBeLessThan(250);
  });
});

describe("generateResponse", () => {
  it("returns object with text for answers > 30 chars", () => {
    const longAnswer = "我今天在雨中的城市里散步，感受到了一种久违的平静与自由。";
    const result = generateResponse(longAnswer);
    expect(result.text).toBeTruthy();
    expect(result.text.length).toBeGreaterThan(50);
  });

  it("returns object with text for answers <= 30 chars", () => {
    const shortAnswer = "有点累。";
    const result = generateResponse(shortAnswer);
    expect(result.text).toMatch(/\*[^*]+\*/);
  });

  it("handles empty input gracefully", () => {
    const result = generateResponse("");
    expect(result.text).toBeTruthy();
  });

  it("returns pipeline data for long answers", () => {
    const longAnswer = "我在深夜的海边独自漫步，孤独让我感到一种奇怪的自由，但海风实在太冷了，吹得我睁不开眼睛。";
    const result = generateResponse(longAnswer);
    expect(result.pipeline).toBeDefined();
    expect(result.pipeline!.keywords.length).toBeGreaterThanOrEqual(1);
  });

  it("passes recentReplies to avoid short reply repetition", () => {
    const similar = "*雨水*在敲每扇窗，砖墙记得所有被删掉的句子。你吞回喉咙的那半句话，无非是海风在防波堤上磨出的*盐粒*。可你真的甘心让这座城市独自老去？";
    const result = generateResponse("下雨了", [similar]);
    expect(result.text).not.toBe(similar);
  });
});
