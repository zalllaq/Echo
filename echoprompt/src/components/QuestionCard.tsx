import { useSession } from "../contexts/SessionContext";

export function QuestionCard() {
  const {
    state,
    newQuestion,
    continueWorld,
    resetWorld,
    regenerateWorldview,
    canContinueWorld,
    canRegenerateWorldview,
  } = useSession();

  const hasWorldview =
    state.worldview !== null && state.worldview.turns.length > 0;

  return (
    <div className="flex flex-col gap-4">
      {/* 世界观面包屑 */}
      {hasWorldview && (
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
          <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
            {state.worldview!.initialImagery}
          </span>
          <span className="text-gray-300 dark:text-gray-600">/</span>
          <span>第 {state.worldview!.turns.length} 层</span>
        </div>
      )}

      {/* 初始氛围 */}
      {state.worldview && state.worldview.turns.length === 0 && (
        <div className="rounded-2xl border border-gray-200 bg-gray-50/60 p-4 text-sm italic leading-relaxed text-gray-500 dark:border-gray-700 dark:bg-gray-800/30 dark:text-gray-400">
          {state.worldview.atmosphere}
        </div>
      )}

      {/* 当前问题 */}
      <h2 className="font-serif text-[1.75rem] leading-relaxed tracking-tight text-gray-900 dark:text-gray-100">
        {state.currentQuestion}
      </h2>

      {/* 操作按钮 */}
      <div className="flex flex-wrap gap-2">
        {canContinueWorld && (
          <button
            onClick={continueWorld}
            className="rounded-full border border-amber-300 bg-amber-50/50 px-4 py-1.5 text-sm text-amber-700 transition-all duration-100 hover:scale-105 hover:border-amber-400 hover:bg-amber-100/50 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-300 dark:hover:border-amber-600 dark:hover:bg-amber-900/30"
          >
            继续探索这个世界
          </button>
        )}

        {canRegenerateWorldview && (
          <button
            onClick={regenerateWorldview}
            className="rounded-full border border-gray-300 px-4 py-1.5 text-sm text-gray-500 transition-all duration-100 hover:scale-105 hover:border-amber-300 hover:text-amber-600 dark:border-gray-600 dark:text-gray-400 dark:hover:border-amber-600 dark:hover:text-amber-400"
          >
            换一个角度
          </button>
        )}

        <button
          onClick={newQuestion}
          className="rounded-full border border-gray-300 px-4 py-1.5 text-sm text-gray-500 transition-all duration-100 hover:scale-105 hover:border-gray-400 hover:text-gray-700 dark:border-gray-600 dark:text-gray-400 dark:hover:border-gray-500 dark:hover:text-gray-200"
        >
          换一个问题
        </button>

        {hasWorldview && (
          <button
            onClick={resetWorld}
            className="rounded-full border border-gray-200 px-4 py-1.5 text-sm text-gray-400 transition-all duration-100 hover:scale-105 hover:border-red-300 hover:text-red-500 dark:border-gray-700 dark:text-gray-500 dark:hover:border-red-700 dark:hover:text-red-400"
          >
            开启新世界
          </button>
        )}
      </div>
    </div>
  );
}
