# VisaMate AI — UK Edition

> **This is a portfolio prototype and not official visa advice.**
> It is for product/UX demonstration. Not all flows are connected to live visa systems. Always check requirements on [GOV.UK](https://www.gov.uk/standard-visitor-visa) and with VFS Global before applying.

- **Source code:** https://github.com/abidfayaz/visamate-ai
- **Live demo:** _added after deployment_

## What is VisaMate?

VisaMate is a prototype that explores one question: *how should AI help someone prepare for a UK Standard Visitor Visa (Indian passport holders) without giving them false certainty?*

Its central idea is a **three-layer trust model**. Every piece of information is visibly labelled as one of:

| Label | Meaning |
|---|---|
| ✓ **Verified Requirement** | Attributed to official sources (GOV.UK / Home Office / VFS Global) |
| ⚠ **Community Experience** | Anecdotal applicant experience, not official policy |
| 🤖 **AI Recommendation** | AI-generated interpretation or guidance |

**How the labels are actually produced (be aware of this):**
- On the static pages (Home, Visa Search, Community Insights) the labels are **written by hand into the data file**. Nothing checks them at runtime.
- In the AI Copilot the model is **prompted** to return `verified` / `community` / `recommendation` sections, and the UI renders each with its badge. The label is the model's own self-classification. There is **no independent verification** that a "Verified" answer really comes from an official source, and answers do not cite specific pages.

## What's live and what's demo

| Area | Status |
|---|---|
| Visa Search, Home, Community Insights | **Prototype data** — hardcoded in `src/data/visaData.js`, not connected to any live system |
| Visit-visa **fee figures** | Checked against the GOV.UK Home Office fee tables on **23 September 2026** (a dated snapshot, not a live feed) |
| Everything else in that data file (documents, processing times, validity, rejection reasons, community insights, updates) | **Not re-verified** — treat as illustrative |
| AI Copilot | **Live** — calls Groq (`llama-3.3-70b-versatile`) through a small server-side function |
| Readiness Check, Application Workspace | Not built — shown greyed out as "Coming Soon" |

## Tech stack

React 19 · Vite · plain CSS · Groq API (`llama-3.3-70b-versatile`) · one serverless function (`api/copilot.js`, Vercel)

The browser never sees the Groq key. It calls this app's own `/api/copilot` endpoint, which holds the key, the model and the system prompt on the server, and limits input size.

## Run it locally

**Requirements:** Node.js 20 or newer (built and tested on Node 24). No Python is needed — this is a Node project.

```bash
git clone https://github.com/abidfayaz/visamate-ai.git
cd visamate-ai
npm install
cp .env.example .env      # then edit .env and add your Groq key
npm run dev
```

Open the URL Vite prints (default http://localhost:5173).

**Environment variables**

| Variable | Required | Notes |
|---|---|---|
| `GROQ_API_KEY` | For the AI Copilot only | Free key from https://console.groq.com/keys. Server-side only — it has no `VITE_` prefix, so it is never bundled into the browser code. Never commit `.env`. |

Without a key the app still runs; asking the Copilot shows *"The AI service is temporarily unavailable. Please try again shortly."* and everything else works.

`npm run dev` serves `/api/copilot` through the same handler used in production, so no extra tooling is needed locally.

## Deploy (Vercel)

1. Import this GitHub repo at https://vercel.com/new (the Vite preset is detected automatically).
2. Under **Environment Variables**, add `GROQ_API_KEY` with your Groq key (Production and Preview).
3. Deploy. If you add or change the key later, redeploy so the function picks it up.

## Known limitations

- **Not official visa advice.** Prototype for UX/product demonstration only.
- **Data is a snapshot.** Only the visit-visa fee figures were checked against official GOV.UK tables (23 Sep 2026); there is no update mechanism, so they will go stale. All other content is unverified prototype data.
- **Grounding covers fees only.** The Copilot's prompt is given the fee figures directly; every other answer relies on the model's own knowledge and can be wrong, including confidently. There is no retrieval, no embeddings and no live GOV.UK lookup.
- **Self-declared labels.** In the Copilot, the "Verified / Community / AI" split is produced by the model following a prompt, and is not independently checked. Answers carry no per-claim source citations.
- **Community content and "Recent Updates" are static demo content**, not live feeds. "Most Helpful (demo order)" is a curated order, not real helpfulness data.
- **Evaluation is small and manual.** See [`eval/golden-questions.md`](eval/golden-questions.md): 22 questions, one rater, mostly unverified reference answers, no automated regression suite. It is not a benchmark. Read the correction block at the top of that file — an earlier version of the fee reference answers was found to be out of date.
- **Narrow scope.** UK Standard Visitor Visa, Indian passport holders only.
- **Free-tier AI service.** Groq may be rate-limited or unavailable; the app then shows a generic "temporarily unavailable" message.
- **Light abuse protection only.** The endpoint caps message count and length, but there is no rate limiting.
- **No accounts or persistence.** Chat history lives in the browser tab and is lost on refresh.

## Project layout

```
api/copilot.js        serverless proxy: Groq key, model, system prompt, fee grounding
src/data/visaData.js  all prototype data (single source of truth for UI and fee prompt)
src/pages/            Home, Visa Search, AI Copilot, Community Insights
src/components/       shell (sidebar, banners), TrustBadge, TrustLegend
eval/                 manual evaluation set and run log
```

## Disclaimer

This is a portfolio prototype and not official visa advice. Do not rely on it for a real application.
