import { useEffect, type ReactNode } from "react";
import { SessionProvider, useSession } from "./contexts/SessionContext";
import { ImagerySelector } from "./components/ImagerySelector";
import { QuestionCard } from "./components/QuestionCard";
import { AnswerInput } from "./components/AnswerInput";
import { ResponseDisplay } from "./components/ResponseDisplay";
import { HistoryPanel } from "./components/HistoryPanel";
import { ErrorBoundary } from "./components/ErrorBoundary";

function ThemeToggle() {
  const { state, dispatch } = useSession();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", state.theme === "dark");
  }, [state.theme]);

  return (
    <button
      onClick={() => dispatch({ type: "TOGGLE_THEME" })}
      className="fixed left-4 top-4 z-40 rounded-full border border-gray-200 bg-white/80 px-3 py-1.5 text-xs text-gray-500 backdrop-blur transition-all hover:scale-105 dark:border-gray-700 dark:bg-gray-800/80 dark:text-gray-400"
      aria-label="切换主题"
    >
      {state.theme === "light" ? "暗" : "明"}
    </button>
  );
}

function MainCard({ children }: { children: ReactNode }) {
  return (
    <div className="w-full rounded-[32px] bg-white/70 p-8 shadow-lg shadow-black/5 backdrop-blur-sm transition-colors dark:bg-gray-900/70 dark:shadow-black/20 sm:p-10">
      {children}
    </div>
  );
}

function PlayingView() {
  return (
    <MainCard>
      <div className="flex flex-col gap-8">
        <QuestionCard />
        <AnswerInput />
        <ResponseDisplay />
      </div>
    </MainCard>
  );
}

function AppContent() {
  const { state } = useSession();

  return (
    <div className="min-h-screen bg-cream text-gray-900 transition-colors dark:bg-charcoal dark:text-gray-100">
      <ThemeToggle />
      <HistoryPanel />

      <main className="mx-auto flex min-h-screen max-w-[720px] items-center justify-center px-4 py-12">
        {state.phase === "selecting-imagery" ? (
          <MainCard>
            <ImagerySelector />
          </MainCard>
        ) : (
          <PlayingView />
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <SessionProvider>
        <AppContent />
      </SessionProvider>
    </ErrorBoundary>
  );
}
