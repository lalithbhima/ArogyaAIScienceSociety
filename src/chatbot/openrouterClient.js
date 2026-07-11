import {
  OPENROUTER_API_KEY,
  OPENROUTER_MODEL,
  OPENROUTER_SITE_URL,
  OPENROUTER_SITE_NAME,
} from '../config/openrouter.key.js';
import { buildRagContext } from './rag';
import { formatChatResponse } from './formatChatResponse';

const PLACEHOLDER_KEY = 'YOUR_OPENROUTER_API_KEY_HERE';

export function isApiKeyConfigured() {
  return Boolean(OPENROUTER_API_KEY && OPENROUTER_API_KEY !== PLACEHOLDER_KEY);
}

function buildSystemPrompt(ragContext) {
  return `You are the ArogyaAI Assistant, the official chatbot for ArogyaAI Science Society's website.

Your role:
- Answer questions about the organization, mission, team, projects, ethical AI, and how to get involved.
- Be friendly, concise, and helpful. Use 2–4 short paragraphs max unless the user asks for detail.
- Use plain text only. Do not use markdown, asterisks, hashtags, bullet symbols, or other formatting characters.
- Only answer using the WEBSITE KNOWLEDGE below. If something is not covered, say you don't have that information and suggest visiting the Contact page or emailing arogyaaisciencesociety@gmail.com.
- When relevant, tell users which website page to visit (Home, About Us, Our Work, Get Involved, Ethical AI, Contact).
- Never make up facts, team members, projects, or contact details not in the knowledge base.

WEBSITE KNOWLEDGE (retrieved for this question):
${ragContext}`;
}

export async function sendChatMessage(userMessage, conversationHistory = []) {
  if (!isApiKeyConfigured()) {
    throw new Error(
      'OpenRouter API key not configured. Add your key in src/config/openrouter.key.js'
    );
  }

  const ragContext = buildRagContext(userMessage);

  const messages = [
    { role: 'system', content: buildSystemPrompt(ragContext) },
    ...conversationHistory.map(({ sender, text }) => ({
      role: sender === 'user' ? 'user' : 'assistant',
      content: text,
    })),
    { role: 'user', content: userMessage },
  ];

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': OPENROUTER_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : ''),
      'X-Title': OPENROUTER_SITE_NAME || 'ArogyaAI Science Society',
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages,
      temperature: 0.4,
      max_tokens: 600,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenRouter error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  const reply = data?.choices?.[0]?.message?.content;

  if (!reply) {
    throw new Error('No response received from the AI model.');
  }

  return formatChatResponse(reply.trim());
}
