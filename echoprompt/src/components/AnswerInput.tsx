import { useSession } from "../contexts/SessionContext";
import { useCharacterCount } from "../hooks/useCharacterCount";

export function AnswerInput() {
  const { state, dispatch, submitAnswer } = useSession();
  const charCount = useCharacterCount(state.currentAnswer);
  const isOverThreshold = charCount > 30;

  const canSubmit =
    state.currentAnswer.trim().length > 0 && !state.isSubmitting;

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <textarea
          value={state.currentAnswer}
          onChange={(e) =>
            dispatch({ type: "SET_ANSWER", payload: e.target.value })
          }
          placeholder="写下你的想法……"
          rows={4}
          className="w-full resize-none rounded-2xl border border-gray-200 bg-white/80 p-4 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200/50 dark:border-gray-700 dark:bg-gray-800/80 dark:text-gray-200 dark:placeholder-gray-500 dark:focus:border-amber-600 dark:focus:ring-amber-700/50"
        />
        <span
          className={`absolute bottom-3 right-3 text-xs tabular-nums ${
            isOverThreshold
              ? "text-green-500 dark:text-green-400"
              : "text-orange-400 dark:text-orange-300"
          }`}
        >
          {charCount}
        </span>
      </div>
      {state.error && (
        <p className="text-sm text-red-500 dark:text-red-400">
          {state.error}
        </p>
      )}
      <button
        onClick={submitAnswer}
        disabled={!canSubmit}
        className={`self-end rounded-full px-6 py-2 text-sm font-medium transition-all duration-100 ${
          canSubmit
            ? "bg-gray-900 text-white hover:scale-105 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
            : "cursor-not-allowed bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500"
        }`}
      >
        {state.isSubmitting ? "提交中…" : "提交回答"}
      </button>
    </div>
  );
}
