export interface ConversationEntry {
  id: string;
  timestamp: number;
  question: string;
  userAnswer: string;
  response: string;
  answerLength: number;
}

export type History = ConversationEntry[];

export interface WorldviewPipeline {
  emotion: string;
  location: string;
  conflict: string;
  action: string;
  keywords: string[];
}

export interface WorldviewTurn {
  question: string;
  answer: string;
  narrative: string;
  pipeline: WorldviewPipeline;
}

export interface WorldviewContext {
  id: string;
  initialImagery: string;
  atmosphere: string;
  turns: WorldviewTurn[];
}

export type AppPhase = "selecting-imagery" | "playing";

export type ShortReplyStyle = "nature" | "pragmatic" | "urban";

/** A/B/C 句式结构类型 */
export type SentenceType = "image-first" | "you-first" | "pure-monologue";

export interface ImageryOption {
  id: string;
  label: string;
  emoji: string;
  atmosphere: string;
  firstQuestion: string;
  keywords: string[];
}

export interface SessionState {
  phase: AppPhase;
  currentQuestion: string;
  currentAnswer: string;
  currentResponse: string | null;
  isSubmitting: boolean;
  error: string | null;
  history: History;
  theme: "light" | "dark";
  worldview: WorldviewContext | null;
  lastUserAnswer: string | null;       // 用于"换一个角度"重新生成
  recentShortReplies: string[];         // 最近5条短句，防重复
}

export type SessionAction =
  | { type: "SET_PHASE"; payload: AppPhase }
  | { type: "SET_QUESTION"; payload: string }
  | { type: "SET_ANSWER"; payload: string }
  | { type: "SET_RESPONSE"; payload: string | null }
  | { type: "SET_SUBMITTING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "ADD_HISTORY"; payload: ConversationEntry }
  | { type: "LOAD_HISTORY"; payload: History }
  | { type: "TOGGLE_THEME" }
  | { type: "NEW_QUESTION"; payload: string }
  | { type: "SET_WORLDVIEW"; payload: WorldviewContext }
  | { type: "ADD_WORLDVIEW_TURN"; payload: WorldviewTurn }
  | { type: "CLEAR_WORLDVIEW" }
  | { type: "SET_LAST_ANSWER"; payload: string | null }
  | { type: "ADD_RECENT_REPLY"; payload: string }
  | { type: "CLEAR_RECENT_REPLIES" };
