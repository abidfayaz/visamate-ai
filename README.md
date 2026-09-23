# VisaMate AI — UK Edition

> **This is a portfolio prototype and not official visa advice.**
> It is for product/UX demonstration. Not all flows are connected to live visa systems. Always check requirements on [GOV.UK](https://www.gov.uk/standard-visitor-visa) and with VFS Global before applying.

- **Source code:** https://github.com/abidfayaz/visamate-ai
- **Live demo:** https://visamate-ai.vercel.app

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

## My role

I owned the **product problem, scope, trust model, requirements, evaluation design and iteration decisions**.

AI coding tools were used to accelerate implementation. The important product choices here — separating evidence types, narrowing Phase 1 to one visa journey, grounding a failing factual category, keeping readiness scoring out of scope, and adding visible safety boundaries — were PM decisions that I defined and tested.

## Key product decisions

- **Trust model before feature breadth.** Verified facts, community-style context and AI interpretation are shown separately instead of blended into one authoritative-looking answer.
- **UK-only for Phase 1.** The prototype stays narrow so the trust and knowledge-quality problem can be tested before adding countries.
- **Diagnose failure before changing models.** Three outright errors in the original evaluation clustered in visa fees, so I grounded that category first rather than assuming a larger model was the fix.
- **Source freshness is part of accuracy.** A later GOV.UK check showed the project's own fee reference data was stale. The fee data was corrected and dated, making the maintenance problem explicit.
- **Readiness scoring remains unbuilt.** A percentage-like "chance of approval" or readiness score could create false confidence without stronger evidence and guardrails.

## Validation

The original 22-question manual evaluation was useful for finding a concentrated failure pattern, but its answer key was not fully authoritative.

- Original run: **18/22** correct by the project's then-current reference set; all 3 outright errors were fee-related and 1 answer was partial.
- After fee grounding, the app repeated the injected reference figures as intended — but a later GOV.UK check showed some of those reference figures were stale.
- Scoring those same answers against the corrected official fee figures gives **19/22**, not 21/22.
- On the current model, a **6/6 targeted smoke check** passed in the Verified section for fees, minimum-bank-balance and travel-insurance questions. This is not a full re-run.

The key lesson was not "grounding solved accuracy." It was that **grounding moves the accuracy burden from model memory to the quality and freshness of the reference data**.

## What's live and what's demo

| Area | Status |
|---|---|
| Visa Search, Home, Community Insights | **Prototype data** — hardcoded in `src/data/visaData.js`, not connected to any live system |
| Visit-visa **fee figures** | Checked against the GOV.UK Home Office fee tables on **23 September 2026** (a dated snapshot, not a live feed) |
| Everything else in that data file (documents, processing times, validity, rejection reasons, community insights, updates) | **Not re-verified** — treat as illustrative |
| AI Copilot | **Live** — calls Groq (`openai/gpt-oss-120b`) through a small server-side function |
| Readiness Check, Application Workspace | Not built — shown greyed out as "Coming Soon" |

## Tech stack

React 19 · Vite · plain CSS · Groq API (`openai/gpt-oss-120b`) · one serverless function (`api/copilot.js`, Vercel)

**A note on the model:** the prototype originally used `llama-3.3-70b-versatile`, which Groq shut down for free and developer tiers on 16 August 2026. It now uses `openai/gpt-oss-120b`, a reasoning model, run at low reasoning effort. Groq retires models regularly. If the Copilot starts showing "temporarily unavailable", check the Vercel function logs for Groq's error code and the [Groq deprecations page](https://console.groq.com/docs/deprecations), then change `GROQ_MODEL` in `api/copilot.js`. The evaluation results in `eval/` were measured on the old model (see the notes in that file).

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
- **The Copilot's "Community Experience" text is model-generated, not drawn from real applicant posts.** It is the model's synthesis of what applicants "typically" report, and in a live check it included an unsupported claim (that travel insurance helps with NHS surcharge exemptions). Treat it as illustrative, not as evidence of what applicants actually experience. The fee figures are the only content that has been checked against an official source.
- **Community content and "Recent Updates" are static demo content**, not live feeds. "Most Helpful (demo order)" is a curated order, not real helpfulness data.
- **Evaluation is small and manual.** See [`eval/golden-questions.md`](eval/golden-questions.md): 22 questions, one rater, mostly unverified reference answers, no automated regression suite. It is not a benchmark. Read the correction block at the top of that file — an earlier version of the fee reference answers was found to be out of date.
- **Narrow scope.** UK Standard Visitor Visa, Indian passport holders only.
- **Free-tier AI service.** Groq's free tier allows about 8,000 tokens per minute for this model, so a few quick questions in a row can be rate-limited; the app then shows a generic "temporarily unavailable" message. Groq can also retire models with little notice.
- **Short chat memory.** Only the last 10 messages are sent to the model, to stay within that token budget.
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
