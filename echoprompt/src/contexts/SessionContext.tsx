import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { v4 as uuidv4 } from "uuid";
import type {
  SessionState,
  SessionAction,
  ConversationEntry,
  WorldviewContext,
  WorldviewTurn,
} from "../types/session";
import { getRandomQuestion } from "../utils/questionPool";
import { generateResponse, generateProgressionQuestion, generateWorldviewPipeline } from "../utils/responseGenerator";
import { loadHistory, saveHistory } from "../utils/storage";
import { imageryOptions } from "../utils/imageryPool";

const initialState: SessionState = {
  phase: "selecting-imagery",
  currentQuestion: "",
  currentAnswer: "",
  currentResponse: null,
  isSubmitting: false,
  error: null,
  history: [],
  theme: "light",
  worldview: null,
  lastUserAnswer: null,
  recentShortReplies: [],
};

function sessionReducer(
  state: SessionState,
  action: SessionAction,
): SessionState {
  switch (action.type) {
    case "SET_PHASE":
      return { ...state, phase: action.payload };
    case "SET_QUESTION":
      return { ...state, currentQuestion: action.payload };
    case "SET_ANSWER":
      return { ...state, currentAnswer: action.payload };
    case "SET_RESPONSE":
      return { ...state, currentResponse: action.payload };
    case "SET_SUBMITTING":
      return { ...state, isSubmitting: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "ADD_HISTORY": {
      const newHistory = [...state.history, action.payload];
      saveHistory(newHistory);
      return { ...state, history: newHistory };
    }
    case "LOAD_HISTORY":
      return { ...state, history: action.payload };
    case "TOGGLE_THEME":
      return { ...state, theme: state.theme === "light" ? "dark" : "light" };
    case "NEW_QUESTION":
      return {
        ...state,
        currentQuestion: action.payload,
        currentAnswer: "",
        currentResponse: null,
        error: null,
      };
    case "SET_WORLDVIEW":
      return { ...state, worldview: action.payload };
    case "ADD_WORLDVIEW_TURN": {
      const current = state.worldview;
      if (!current) return state;
      return {
        ...state,
        worldview: {
          ...current,
          turns: [...current.turns, action.payload],
        },
      };
    }
    case "CLEAR_WORLDVIEW":
      return {
        ...state,
        worldview: null,
        phase: "selecting-imagery",
        currentQuestion: "",
        currentAnswer: "",
        currentResponse: null,
      };
    case "SET_LAST_ANSWER":
      return { ...state, lastUserAnswer: action.payload };
    case "ADD_RECENT_REPLY": {
      const updated = [...state.recentShortReplies, action.payload].slice(-5);
      return { ...state, recentShortReplies: updated };
    }
    case "CLEAR_RECENT_REPLIES":
      return { ...state, recentShortReplies: [] };
    default:
      return state;
  }
}

interface SessionContextValue {
  state: SessionState;
  dispatch: React.Dispatch<SessionAction>;
  submitAnswer: () => void;
  newQuestion: () => void;
  selectImagery: (imageryId: string) => void;
  continueWorld: () => void;
  resetWorld: () => void;
  regenerateWorldview: () => void;
  canContinueWorld: boolean;
  canRegenerateWorldview: boolean;
  storageFailed: boolean;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(sessionReducer, initialState);
  const [storageFailed, setStorageFailed] = useState(false);

  useEffect(() => {
    const { history, failed } = loadHistory();
    dispatch({ type: "LOAD_HISTORY", payload: history });
    setStorageFailed(failed);
  }, []);

  const selectImagery = useCallback((imageryId: string) => {
    const option = imageryOptions.find((o) => o.id === imageryId);
    if (!option) return;

    const newWorldview: WorldviewContext = {
      id: uuidv4(),
      initialImagery: option.label,
      atmosphere: option.atmosphere,
      turns: [],
    };

    dispatch({ type: "SET_WORLDVIEW", payload: newWorldview });
    dispatch({ type: "SET_PHASE", payload: "playing" });
    dispatch({ type: "SET_QUESTION", payload: option.firstQuestion });
    dispatch({ type: "SET_ANSWER", payload: "" });
    dispatch({ type: "SET_RESPONSE", payload: null });
    dispatch({ type: "SET_ERROR", payload: null });
  }, []);

  const submitAnswer = useCallback(() => {
    const trimmed = state.currentAnswer.trim();
    if (trimmed.length === 0) {
      dispatch({ type: "SET_ERROR", payload: "回答不能为空" });
      return;
    }

    dispatch({ type: "SET_SUBMITTING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const result = generateResponse(trimmed, state.recentShortReplies);
      dispatch({ type: "SET_RESPONSE", payload: result.text });

      const entry: ConversationEntry = {
        id: uuidv4(),
        timestamp: Date.now(),
        question: state.currentQuestion,
        userAnswer: trimmed,
        response: result.text,
        answerLength: trimmed.length,
      };
      dispatch({ type: "ADD_HISTORY", payload: entry });

      if (trimmed.length > 30) {
        // 长回答：记录最后回答用于"换一个角度"重生
        dispatch({ type: "SET_LAST_ANSWER", payload: trimmed });

        if (result.pipeline && state.worldview) {
          const turn: WorldviewTurn = {
            question: state.currentQuestion,
            answer: trimmed,
            narrative: result.text,
            pipeline: result.pipeline,
          };
          dispatch({ type: "ADD_WORLDVIEW_TURN", payload: turn });
        }
      } else {
        // 短回答：记录到最近回复列表用于防重复
        dispatch({ type: "ADD_RECENT_REPLY", payload: result.text });
      }
    } catch {
      dispatch({
        type: "SET_RESPONSE",
        payload: "世界打了一个嗝，再试试？",
      });
    } finally {
      setTimeout(() => {
        dispatch({ type: "SET_SUBMITTING", payload: false });
      }, 1000);
    }
  }, [state.currentAnswer, state.currentQuestion, state.worldview, state.recentShortReplies]);

  const newQuestion = useCallback(() => {
    dispatch({ type: "NEW_QUESTION", payload: getRandomQuestion() });
  }, []);

  const continueWorld = useCallback(() => {
    if (!state.worldview || state.worldview.turns.length === 0) return;
    const nextQuestion = generateProgressionQuestion(state.worldview);
    dispatch({ type: "NEW_QUESTION", payload: nextQuestion });
  }, [state.worldview]);

  const resetWorld = useCallback(() => {
    dispatch({ type: "CLEAR_WORLDVIEW" });
  }, []);

  const regenerateWorldview = useCallback(() => {
    if (!state.lastUserAnswer) return;
    dispatch({ type: "SET_SUBMITTING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const result = generateWorldviewPipeline(state.lastUserAnswer);
      dispatch({ type: "SET_RESPONSE", payload: result.text });
    } catch {
      dispatch({
        type: "SET_RESPONSE",
        payload: "世界打了一个嗝，再试试？",
      });
    } finally {
      setTimeout(() => {
        dispatch({ type: "SET_SUBMITTING", payload: false });
      }, 1000);
    }
  }, [state.lastUserAnswer]);

  const canContinueWorld =
    state.worldview !== null &&
    state.worldview.turns.length > 0 &&
    state.currentResponse !== null &&
    state.currentAnswer.trim().length > 30;

  const canRegenerateWorldview =
    state.lastUserAnswer !== null &&
    state.currentResponse !== null &&
    state.worldview !== null;

  return (
    <SessionContext.Provider
      value={{
        state,
        dispatch,
        submitAnswer,
        newQuestion,
        selectImagery,
        continueWorld,
        resetWorld,
        regenerateWorldview,
        canContinueWorld,
        canRegenerateWorldview,
        storageFailed,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession must be used within SessionProvider");
  }
  return ctx;
}
