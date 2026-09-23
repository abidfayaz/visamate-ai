// Serverless proxy for the AI Copilot (a Vercel Function).
//
// The Groq key is read from the GROQ_API_KEY environment variable on the
// server only — it is never sent to, or bundled into, the browser. The browser
// sends just the conversation history; the model, system prompt and fee
// grounding are fixed here, so this endpoint can't be used as a general-purpose
// Groq relay.

import { UK_VISA_DATA } from '../src/data/visaData.js'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
// Groq retires models regularly (llama-3.3-70b-versatile was shut down for free
// and developer tiers on 16 Aug 2026). If the Copilot starts failing with a
// generic "unavailable" message, check the Vercel function logs for the Groq
// error code, then https://console.groq.com/docs/deprecations.
const GROQ_MODEL = 'openai/gpt-oss-120b'
const UPSTREAM_TIMEOUT_MS = 25000

// gpt-oss-120b is a reasoning model: reasoning tokens count against the output
// budget, so keep effort low and leave headroom or the JSON reply can be cut off.
const REASONING_EFFORT = 'low'
const MAX_COMPLETION_TOKENS = 1536

// Input limits keep the endpoint from being used to run up token spend, and keep
// each request within Groq's free-tier limit of 8,000 tokens per minute.
const MAX_MESSAGES = 10
const MAX_USER_CHARS = 1000
const MAX_ASSISTANT_CHARS = 6000

// Fee grounding: a manual eval found the model stating wrong fee figures with
// full confidence (every failure was a fee question). The fee figures — checked
// against the GOV.UK fee tables — are injected into the prompt from the same
// data object that renders the Visa Search page, so the Copilot quotes them
// instead of recalling them. This covers fees only: every other answer still
// relies on the model's own knowledge (see README, "Known limitations"), and
// the figures are a dated snapshot, not a live feed.
const { standard, priority, longTerm, childDiscount, superPriority } = UK_VISA_DATA.feeTable
const FEE_GROUNDING = `VERIFIED FEE DATA (checked against the GOV.UK Home Office fee tables on ${UK_VISA_DATA.feesCheckedOn}) — use these exact figures for any fee question. Do not use your own memory of UK visa fees, which may be out of date. If asked, say the figures were checked on that date and may change:
- Standard application fee: ${standard}
- Priority Visa Service: ${priority}
- Long-term multi-entry visa fees: ${longTerm.twoYear} (2-year), ${longTerm.fiveYear} (5-year), ${longTerm.tenYear} (10-year)
- Super Priority Service: ${superPriority}
- Children's fees: ${childDiscount}`

export const SYSTEM_PROMPT = `You are VisaMate AI, an expert visa guidance assistant specialising in UK Standard Visitor Visas for Indian passport holders.

You must always respond in valid JSON with exactly this structure — no preamble, no markdown fences, no explanation outside the JSON:

{
  "verified": "Official information from GOV.UK, UK Home Office, or VFS Global. Be specific about requirements, amounts, and rules. If uncertain about an official fact, say so clearly.",
  "community": "Practical observations from real applicants — what travellers typically experience, common patterns, tips that aren't in official guidance. Keep this distinct from official rules.",
  "recommendation": "A personalised, actionable next step or recommendation for this specific question. Be direct and helpful."
}

${FEE_GROUNDING}

Rules:
- Never invent visa fees, processing times, or requirements you are not certain about — use the VERIFIED FEE DATA above for any fee question, never your own recollection
- If you cannot find a verified answer, say "I could not find verified official information on this — please check GOV.UK directly."
- Keep each section to 2–4 sentences
- Focus exclusively on UK Standard Visitor Visa for Indian passport holders
- The "verified" section must only contain information attributable to official sources
- Never blend official and community information within a single section`

/** Returns a cleaned copy of the history, or null if the input is not acceptable. */
function validateMessages(input) {
  if (!Array.isArray(input) || input.length === 0 || input.length > MAX_MESSAGES) return null
  const cleaned = []
  for (const message of input) {
    if (!message || typeof message.content !== 'string') return null
    const { role, content } = message
    if (role !== 'user' && role !== 'assistant') return null
    const limit = role === 'user' ? MAX_USER_CHARS : MAX_ASSISTANT_CHARS
    if (content.length === 0 || content.length > limit) return null
    cleaned.push({ role, content })
  }
  return cleaned
}

function parseBody(body) {
  if (typeof body === 'string') {
    try {
      return JSON.parse(body)
    } catch {
      return null
    }
  }
  return body ?? null
}

// Every failure returns the same generic body — no stack traces, provider
// messages or configuration details ever reach the browser.
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'method_not_allowed' })
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey || apiKey === 'your_key_here') {
    console.error('GROQ_API_KEY is not configured')
    return res.status(503).json({ error: 'unavailable' })
  }

  const messages = validateMessages(parseBody(req.body)?.messages)
  if (!messages) {
    return res.status(400).json({ error: 'bad_request' })
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS)
  try {
    const upstream = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        max_completion_tokens: MAX_COMPLETION_TOKENS,
        reasoning_effort: REASONING_EFFORT,
        response_format: { type: 'json_object' },
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      }),
      signal: controller.signal,
    })

    if (!upstream.ok) {
      // Server-side log only: HTTP status plus Groq's error code/type (e.g.
      // "model_decommissioned"), never the message text, key or request body.
      const detail = await upstream.json().catch(() => null)
      const code = detail?.error?.code ?? detail?.error?.type ?? 'unknown'
      console.error('Groq responded with HTTP', upstream.status, String(code).slice(0, 80))
      return res.status(upstream.status === 429 ? 429 : 502).json({ error: 'unavailable' })
    }

    const data = await upstream.json()
    const content = data?.choices?.[0]?.message?.content
    if (typeof content !== 'string' || content.length === 0) {
      console.error('Groq returned an empty completion')
      return res.status(502).json({ error: 'unavailable' })
    }
    return res.status(200).json({ content })
  } catch (err) {
    console.error('Copilot request failed:', err?.name ?? 'unknown error')
    return res.status(502).json({ error: 'unavailable' })
  } finally {
    clearTimeout(timer)
  }
}
