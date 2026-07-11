import { WEBSITE_KNOWLEDGE } from './websiteKnowledge';

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'how', 'what',
  'who', 'our', 'your', 'about', 'with', 'this', 'that', 'from', 'have', 'does',
]);

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));
}

function scoreChunk(queryTokens, chunk) {
  const searchable = [
    chunk.title,
    chunk.page,
    chunk.content,
    ...(chunk.keywords || []),
  ].join(' ').toLowerCase();

  let score = 0;
  for (const token of queryTokens) {
    if (searchable.includes(token)) {
      score += token.length > 5 ? 2 : 1;
    }
    for (const keyword of chunk.keywords || []) {
      if (keyword.includes(token) || token.includes(keyword)) {
        score += 3;
      }
    }
  }
  return score;
}

/**
 * Retrieve the most relevant website knowledge chunks for a user query (RAG).
 */
export function retrieveRelevantChunks(query, topK = 4) {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) {
    return WEBSITE_KNOWLEDGE.slice(0, topK);
  }

  return WEBSITE_KNOWLEDGE.map((chunk) => ({
    chunk,
    score: scoreChunk(queryTokens, chunk),
  }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(({ chunk }) => chunk);
}

export function buildRagContext(query) {
  const chunks = retrieveRelevantChunks(query);
  if (chunks.length === 0) {
    return WEBSITE_KNOWLEDGE.map(
      (c) => `[${c.page} — ${c.title}]\n${c.content}`
    ).join('\n\n');
  }

  return chunks
    .map((c) => `[${c.page} — ${c.title}]\n${c.content}`)
    .join('\n\n');
}
