import type { History } from "../types/session";

const STORAGE_KEY = "echoprompt_history";
const MAX_ENTRIES = 50;
const FALLBACK_KEY = "echoprompt_history_fallback";

let memoryStorage: History | null = null;
let storageFailed = false;

export function loadHistory(): { history: History; failed: boolean } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { history: [], failed: false };
    const parsed = JSON.parse(raw) as History;
    if (!Array.isArray(parsed)) return { history: [], failed: false };
    return { history: parsed, failed: false };
  } catch {
    console.warn("localStorage read failed, trying fallback...");
    return loadFallback();
  }
}

function loadFallback(): { history: History; failed: boolean } {
  try {
    if (memoryStorage) return { history: memoryStorage, failed: true };
    const raw = sessionStorage.getItem(FALLBACK_KEY);
    if (raw) {
      memoryStorage = JSON.parse(raw) as History;
    }
    return { history: memoryStorage ?? [], failed: true };
  } catch {
    memoryStorage = [];
    return { history: [], failed: true };
  }
}

export function saveHistory(history: History): boolean {
  try {
    const trimmed = history.slice(-MAX_ENTRIES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    storageFailed = false;
    return true;
  } catch {
    console.warn("localStorage write failed, using fallback storage");
    storageFailed = true;
    return saveFallback(history);
  }
}

function saveFallback(history: History): boolean {
  try {
    const trimmed = history.slice(-MAX_ENTRIES);
    memoryStorage = trimmed;
    sessionStorage.setItem(FALLBACK_KEY, JSON.stringify(trimmed));
    return false;
  } catch {
    memoryStorage = history.slice(-MAX_ENTRIES);
    return false;
  }
}

export function isStorageFailed(): boolean {
  return storageFailed;
}
