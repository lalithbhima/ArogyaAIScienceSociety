/**
 * Converts model output to clean plain text for the chat UI.
 */
export function formatChatResponse(text) {
  if (!text) return '';

  let result = text;

  // Markdown links and images
  result = result.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1');
  result = result.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // Fenced code blocks
  result = result.replace(/```[\s\S]*?```/g, (block) =>
    block.replace(/```\w*\n?/g, '').replace(/```/g, '').trim()
  );

  // Headers (# ## ###)
  result = result.replace(/^#{1,6}\s+/gm, '');

  // Bold / italic
  result = result.replace(/\*\*\*([^*]+)\*\*\*/g, '$1');
  result = result.replace(/\*\*([^*]+)\*\*/g, '$1');
  result = result.replace(/\*([^*\n]+)\*/g, '$1');
  result = result.replace(/___([^_]+)___/g, '$1');
  result = result.replace(/__([^_]+)__/g, '$1');
  result = result.replace(/_([^_\n]+)_/g, '$1');

  // Inline code and strikethrough
  result = result.replace(/`([^`]+)`/g, '$1');
  result = result.replace(/~~([^~]+)~~/g, '$1');

  // Blockquotes and list markers
  result = result.replace(/^>\s?/gm, '');
  result = result.replace(/^[\t ]*[-*+•]\s+/gm, '');
  result = result.replace(/^[\t ]*\d+[.)]\s+/gm, '');

  // Horizontal rules
  result = result.replace(/^[\s]*[-*_]{3,}[\s]*$/gm, '');

  // Orphan markdown characters often left by models
  result = result.replace(/^\s*[*#_~`>|]+\s*$/gm, '');
  result = result.replace(/([^\s])\*+(?=\s|$)/g, '$1');
  result = result.replace(/^\*+\s*/gm, '');

  // Normalize whitespace
  result = result.replace(/\n{3,}/g, '\n\n');
  result = result.replace(/[ \t]+\n/g, '\n');

  return result.trim();
}
