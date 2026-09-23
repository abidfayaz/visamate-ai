// Client for the AI Copilot. The browser never talks to Groq directly: it calls
// this app's own /api/copilot endpoint (see api/copilot.js), which holds the
// API key server-side and fixes the model and system prompt.

export const COPILOT_UNAVAILABLE_MESSAGE =
  'The AI service is temporarily unavailable. Please try again shortly.'

/**
 * Send the conversation history ({ role, content } objects) and return the raw
 * reply text. Any failure — missing server key, rate limit, quota, network —
 * throws, and the caller shows COPILOT_UNAVAILABLE_MESSAGE.
 */
export async function askCopilot(history) {
  const response = await fetch('/api/copilot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: history }),
  })
  if (!response.ok) throw new Error('copilot_unavailable')
  const data = await response.json()
  return typeof data.content === 'string' ? data.content : ''
}

/**
 * Parse the model's JSON reply into { verified, community, recommendation }.
 * Falls back to extracting the first JSON object if the reply has stray text
 * or code fences. Returns null when nothing parseable is found.
 */
export function parseCopilotResponse(text) {
  const candidates = [text]
  const match = text.match(/\{[\s\S]*\}/)
  if (match) candidates.push(match[0])
  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate)
      if (parsed && typeof parsed === 'object') return parsed
    } catch {
      // try the next candidate
    }
  }
  return null
}
