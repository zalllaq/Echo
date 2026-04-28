import { useState } from "react";
import { useSession } from "../contexts/SessionContext";

export function HistoryPanel() {
  const { state, storageFailed } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-4 top-4 z-40 rounded-full border border-gray-200 bg-white/80 px-3 py-1.5 text-xs text-gray-500 backdrop-blur transition-all hover:scale-105 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800/80 dark:text-gray-400"
        aria-label={isOpen ? "关闭历史记录" : "打开历史记录"}
      >
        {isOpen ? "关闭" : "历史"}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/10 dark:bg-black/40"
            onClick={() => setIsOpen(false)}
          />
          <aside
            className={`fixed right-0 top-0 z-40 h-full w-80 overflow-y-auto border-l border-gray-200 bg-white/95 p-5 backdrop-blur transition-transform dark:border-gray-700 dark:bg-gray-900/95 ${
              isOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                历史记录
              </h3>
              {storageFailed && (
                <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
                  未保存
                </span>
              )}
            </div>

            {state.history.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-gray-500">
                还没有记录
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {[...state.history].reverse().map((entry) => (
                  <li
                    key={entry.id}
                    className="rounded-xl bg-gray-50 p-3 transition-colors hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-800"
                  >
                    <p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                      {entry.question.slice(0, 20)}
                      {entry.question.length > 20 ? "…" : ""}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {entry.userAnswer.slice(0, 30)}
                      {entry.userAnswer.length > 30 ? "…" : ""}
                    </p>
                    <span className="mt-1 inline-block rounded-full bg-gray-200 px-1.5 py-0.5 text-[10px] text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                      {entry.answerLength}字
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </>
      )}
    </>
  );
}
