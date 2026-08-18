import { KNOWLEDGE_BASE, type KnowledgePassage } from "./knowledge";

const STOP_WORDS = new Set([
  "a", "an", "the", "is", "are", "was", "were", "do", "does", "did",
  "i", "you", "he", "she", "we", "they", "my", "your", "our", "their",
  "how", "what", "when", "where", "why", "which", "who", "whom",
  "can", "could", "will", "would", "should", "to", "of", "in", "on",
  "for", "and", "or", "but", "not", "this", "that", "these", "those",
  "please", "tell", "about", "want", "need", "me", "us", "it", "at",
  "from", "with", "by", "as", "if", "then", "so", "than", "into",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t));
}

export function retrievePassage(question: string, top = 1): KnowledgePassage[] {
  const qTokens = tokenize(question);
  if (qTokens.length === 0) return [];

  const scored = KNOWLEDGE_BASE.map((passage) => {
    let score = 0;
    const keywordSet = new Set(passage.keywords.map((k) => k.toLowerCase()));
    const contentTokens = new Set(tokenize(passage.content));

    for (const token of qTokens) {
      if (keywordSet.has(token)) score += 3;
      if (keywordSet.has(token.replace(/s$/, ""))) score += 2;
      if (contentTokens.has(token)) score += 1;
    }
    return { passage, score };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, top).map((s) => s.passage);
}

export function hasKnowledge(question: string): boolean {
  return retrievePassage(question).length > 0;
}

export const NO_ANSWER_RESPONSE =
  "Sorry, I couldn't find an answer to that in the platform docs. Try asking about logging in, batches, attendance, payments, or assignments.";
