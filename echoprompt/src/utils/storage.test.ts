import { describe, it, expect, beforeEach } from "vitest";
import { loadHistory, saveHistory } from "./storage";

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns empty history when nothing is stored", () => {
    const { history, failed } = loadHistory();
    expect(history).toEqual([]);
    expect(failed).toBe(false);
  });

  it("saves and loads history correctly", () => {
    const entry = {
      id: "test-id",
      timestamp: 123,
      question: "测试问题？",
      userAnswer: "测试回答",
      response: "测试回复",
      answerLength: 4,
    };
    const saved = saveHistory([entry]);
    expect(saved).toBe(true);

    const { history, failed } = loadHistory();
    expect(history).toHaveLength(1);
    expect(history[0].id).toBe("test-id");
    expect(failed).toBe(false);
  });

  it("limits history to 50 entries", () => {
    const entries = Array.from({ length: 60 }, (_, i) => ({
      id: `id-${i}`,
      timestamp: i,
      question: "问题",
      userAnswer: "回答",
      response: "回复",
      answerLength: 2,
    }));
    saveHistory(entries);

    const { history } = loadHistory();
    expect(history.length).toBe(50);
  });

  it("handles corrupted localStorage gracefully", () => {
    localStorage.setItem("echoprompt_history", "not-json");
    const { history } = loadHistory();
    expect(history).toEqual([]);
  });
});
