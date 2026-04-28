import { generateWorldviewPipeline, generateProgressionQuestion } from "./worldviewGenerator";
import { generateShortReply } from "./shortReplyGenerator";
export function generateResponse(
  answer: string,
  recentReplies?: string[],
): {
  text: string;
  pipeline?: { emotion: string; location: string; conflict: string; action: string; keywords: string[] };
} {
  const trimmed = answer.trim();
  if (trimmed.length > 30) {
    const result = generateWorldviewPipeline(trimmed);
    return { text: result.text, pipeline: result.pipeline };
  }
  return { text: generateShortReply(trimmed, recentReplies ?? []) };
}

export { generateWorldviewPipeline, generateProgressionQuestion };
export { generateShortReply };
