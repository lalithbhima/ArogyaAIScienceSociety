import { APPS_SCRIPT_WEB_APP_URL } from '../config/appsScript.url.js';
import { OPENROUTER_MODEL } from '../config/openrouter.js';
import { buildRagContext } from './rag';
import { formatChatResponse } from './formatChatResponse';

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

export function isChatAvailable() {
  return Boolean(APPS_SCRIPT_WEB_APP_URL);
}

export async function sendChatMessage(userMessage, conversationHistory = []) {
  if (!isChatAvailable()) {
    throw new Error('Chat proxy URL is not configured.');
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

  const response = await fetch(APPS_SCRIPT_WEB_APP_URL, {
    method: 'POST',
    mode: 'cors',
    redirect: 'follow',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({
      type: 'chat',
      model: OPENROUTER_MODEL,
      messages,
    }),
  });

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('Could not read response from chat service.');
  }

  if (!data.success) {
    throw new Error(data.error || 'Chat request failed.');
  }

  if (!data.reply) {
    throw new Error('No response received from the AI model.');
  }

  return formatChatResponse(data.reply.trim());
}
