import { describe, it, expect } from "vitest";
import { questionPool, getRandomQuestion } from "./questionPool";

describe("questionPool", () => {
  it("contains exactly 30 questions", () => {
    expect(questionPool.length).toBe(30);
  });

  it("all questions are non-empty strings", () => {
    for (const q of questionPool) {
      expect(typeof q).toBe("string");
      expect(q.trim().length).toBeGreaterThan(0);
    }
  });
});

describe("getRandomQuestion", () => {
  it("returns a string from the pool", () => {
    const question = getRandomQuestion();
    expect(questionPool).toContain(question);
  });

  it("returns different questions on multiple calls (probabilistic)", () => {
    const results = new Set(Array.from({ length: 20 }, () => getRandomQuestion()));
    expect(results.size).toBeGreaterThan(1);
  });

  it("never throws", () => {
    for (let i = 0; i < 100; i++) {
      expect(() => getRandomQuestion()).not.toThrow();
    }
  });
});
