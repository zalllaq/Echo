import type { ReactNode } from "react";
import { useSession } from "../contexts/SessionContext";

function renderAsteriskEmphasis(text: string): ReactNode {
  const parts = text.split(/(\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("*") && part.endsWith("*") && part.length > 1) {
      const inner = part.slice(1, -1);
      return (
        <em key={i} className="italic text-amber-600 dark:text-amber-400">
          {inner}
        </em>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function ResponseDisplay() {
  const { state } = useSession();

  if (!state.currentResponse) return null;

  const isWorldview = state.currentAnswer.trim().length > 30;

  return (
    <div className="flex flex-col gap-4">
      {isWorldview && state.worldview && state.worldview.turns.length > 0 && (
        <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-4 dark:border-amber-900/30 dark:bg-amber-900/10">
          <span className="mb-3 inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
            世界观累积
          </span>
          <div className="flex flex-col gap-3">
            {state.worldview.turns.map((turn, i) => (
              <div key={i} className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                <div className="mb-1 flex items-center gap-2">
                  <span className="rounded bg-amber-100/60 px-1.5 py-0.5 text-[10px] font-medium text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                    第 {i + 1} 章
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Q: {turn.question.slice(0, 40)}…
                  </p>
                  <div className="text-gray-600 dark:text-gray-400">
                    {renderAsteriskEmphasis(turn.narrative.replace(/\n\n/g, " / ").slice(0, 120))}…
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 当前回复 */}
      <div
        className="animate-fade-in-up rounded-2xl bg-gray-100/80 p-5 dark:bg-gray-800/60"
        role="region"
        aria-live="polite"
      >
        {isWorldview && (
          <span className="mb-3 inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
            世界观设定
          </span>
        )}
        <div className="whitespace-pre-line text-base leading-relaxed text-gray-700 dark:text-gray-300">
          {renderAsteriskEmphasis(state.currentResponse)}
        </div>
      </div>
    </div>
  );
}
