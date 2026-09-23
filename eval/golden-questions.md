# VisaMate AI Copilot — Golden Eval Set v1

**Purpose:** Check whether the Copilot's `verified` section stays factually
correct and never invents numbers, and whether it correctly says "I don't
know, check GOV.UK" when appropriate (per the system prompt's own rule —
that IS a pass, not a failure).

**Scope:** This tests the `verified` section only. The `community` and
`recommendation` sections are inherently subjective/generative and aren't
scored for "correctness" the same way — see the rubric at the bottom.

**How to run:** Ask each question in the Copilot (fresh chat per question
recommended, since answers can drift with conversation context). Fill in the
"Model said" and "Verdict" columns as you go.

---

## ⚠️ Answer-key status and corrections (added 23 September 2026)

Read this before trusting any score in this file.

- **Only the fee rows (A1–A3) have been checked against an official source:** the GOV.UK Home Office immigration and nationality fees tables (8 April 2026; visit-visa fees are unchanged in the 8 October 2026 table). Every other reference answer is the reviewer's own knowledge and has **not** been verified against GOV.UK.
- **The fee figures used to score Runs 1 and 2 were out of date.** They were £115 / £432 / £771 / £963, taken from the project's requirements document. The official figures are **£135** (standard), **£506 / £903 / £1,128** (2 / 5 / 10-year) and **£500** (priority).
- **What that changes.** Run 1's fee ❌ verdicts still stand, because the model's figures were wrong under either set. But Run 2's "exact matches" only show that the model *repeated the reference data it was given*, and that data was itself stale. Scored against the official figures, two of the Run 2 fee answers (£115 standard, £963 for 10-year) are wrong, so the same answers score **19/22 (~86%)**, not 21/22.
- **So Runs 1 and 2 measure agreement with the project's own reference data, not verified accuracy against GOV.UK.**
- **The model has changed since Runs 1 and 2.** They were run on `llama-3.3-70b-versatile`, which Groq shut down for free and developer tiers on 16 August 2026. The app now uses `openai/gpt-oss-120b`, so **nothing in Runs 1–2 says how the current model behaves.**
- The reference data in the app and in the Copilot's prompt has since been corrected and dated. A full re-run of all 22 questions on the current model is in [`run3-full-rerun.md`](run3-full-rerun.md) (raw answers in [`run3-raw-answers.json`](run3-raw-answers.json)): 16 clean, 3 partial, 3 disagreements with unverified reference answers, 0 clear errors, and all four fee rows correct. It measures agreement with the reference answers, not verified accuracy, and it surfaced a pattern of unsupported claims attributed to "official guidance".
- **Lesson:** grounding doesn't remove the accuracy problem; it moves it from the model's memory to the upkeep of the reference data. A hardcoded fee table is only as good as the last time someone checked it.

---

## Category A — Fees & Costs (hallucination-prone: exact numbers)

| # | Question | Reference answer | Model said | Verdict |
|---|---|---|---|---|
| A1 | How much does a UK Standard Visitor Visa cost? | £135 (standard) — GOV.UK fee tables, checked 23 Sep 2026. Runs 1–2 used the out-of-date £115. | | |
| A2 | How much extra does priority processing cost? | £500 in addition to the standard fee — GOV.UK fee tables | | |
| A3 | What's the fee for a 10-year long-term multi-entry visa? | £1,128 — GOV.UK fee tables. Runs 1–2 used the out-of-date £963. | | |
| A4 | Is there a discount for children applying for a UK visitor visa? | Children pay the same standard fee (no discount at the visitor-visa tier) | | |

## Category B — Processing Time

| # | Question | Ground truth | Model said | Verdict |
|---|---|---|---|---|
| B1 | How long does a standard UK visitor visa take to process? | ~3 weeks (15 working days quoted by UKVI; can extend in peak season) | | |
| B2 | How fast is priority processing? | 5 working days | | |
| B3 | Can I get a UK visa decision in 24 hours? | Only via "Super Priority" service, not standard/priority — and it's not guaranteed | | |

## Category C — Financial Proof (nuanced — common source of bad AI advice)

| # | Question | Ground truth | Model said | Verdict |
|---|---|---|---|---|
| C1 | How many months of bank statements do I need? | 6 months, showing consistent balance | | |
| C2 | Can I use fixed deposits as proof of funds? | Yes, but ideally held 3+ months before applying — last-minute FDs are flagged | | |
| C3 | Is there a minimum bank balance required by law for a UK visitor visa? | **Trick question — there is no official fixed minimum; UKVI assesses "sufficient funds" relative to your trip, not a published number.** A correct model should NOT invent a specific rupee/pound figure as an official rule. | | |
| C4 | Can my parents sponsor my trip financially? | Yes, with a letter + their own financial proof + relationship proof | | |

## Category D — Documents

| # | Question | Ground truth | Model said | Verdict |
|---|---|---|---|---|
| D1 | Do I need travel insurance for a UK visitor visa? | **Trick question — not a mandatory requirement for the UK visa (unlike Schengen). Recommended, not required.** | | |
| D2 | Do I need to submit income tax returns? | Yes — last 2 financial years, as supporting evidence | | |
| D3 | Is a cover letter / purpose of visit letter mandatory? | Yes, and should be written personally, not templated | | |
| D4 | What documents does a self-employed applicant need instead of a salary slip? | Business registration, ITRs, business bank statements — in place of employer letter/salary slips | | |

## Category E — Eligibility & Edge Cases

| # | Question | Ground truth | Model said | Verdict |
|---|---|---|---|---|
| E1 | I have no prior international travel. Can I still get a UK visa? | Yes — no legal bar; but should compensate with strong ties-to-India evidence | | |
| E2 | Can I do tourism and visit family on the same visa? | Yes — Standard Visitor Visa covers combined purposes on one trip | | |
| E3 | My employer letter is in Hindi — is that a problem? | Should be translated into English (certified translation recommended) | | |
| E4 | If my visa is rejected, can I reapply immediately? | Yes, there's no mandatory cooling-off period — but should address the rejection reason first | | |
| E5 | Can a self-employed person apply for a UK visitor visa? | Yes — different but still valid financial proof accepted | | |

## Category F — Rejection Reasons

| # | Question | Ground truth | Model said | Verdict |
|---|---|---|---|---|
| F1 | What's the most common reason UK visitor visas get rejected? | Insufficient/unclear financial evidence and weak ties to home country are the top cited reasons | | |
| F2 | Does a lump-sum deposit right before applying hurt my chances? | Yes — flagged as a credibility risk by caseworkers | | |

---

## Scoring rubric

Mark each row's **Verdict** as one of:

- ✅ **Correct** — matches ground truth, no invented specifics
- ⚠️ **Partially correct** — directionally right but adds an unverified specific (e.g., invents a rupee amount for C3)
- ❌ **Hallucinated** — states something false or fabricated as fact
- 🟡 **Appropriately declined** — model said "I couldn't find verified info, check GOV.UK" — **this counts as a PASS**, not a failure, per the system prompt's own rule
- ❓ **Disagrees with an unverified reference** — added for Run 3: the model contradicts the reference answer, but the reference itself has not been checked against an official source, so it is neither counted as right nor as wrong

### Pass criteria for this eval round
- **Trick questions (C3, D1) are the most important rows.** If the model invents a specific bank-balance number for C3, or claims insurance is mandatory for D1, that's the clearest sign the "never invent" instruction isn't holding.
- Target: 0 ❌ Hallucinated on Category A (fees) and Category C3/D1 (trick questions). A few ⚠️ elsewhere is normal and fixable via prompt tightening.

### After running this
Count: `✅ __ / 22   ⚠️ __ / 22   ❌ __ / 22   🟡 __ / 22`

If ❌ > 0, paste the exact question + model answer back and we'll either
tighten the system prompt or add that fact to the hardcoded data instead of
trusting the model with it.

---

## Run log

### Run 1 — August 2026 — model: `llama-3.3-70b-versatile` (Groq), 15 conversation turns / 22 golden rows covered

**Final scorecard: ✅ 18/22 (82%) · ⚠️ 1/22 (4.5%) · ❌ 3/22 (13.6%)**

**The one-line finding: every hallucination was a visa-fee number, and nothing else was.** All 19 non-fee questions (processing times, financial rules, document requirements, eligibility, rejection reasons) scored ✅ or ⚠️. All 3 ❌ were in Category A (exact fee amounts). That's not a scattershot failure rate — it's a single, precise, fixable weak spot.

| # | Question asked | Verdict | Notes |
|---|---|---|---|
| D1 | "Do I need travel insurance for a UK visa?" | ✅ | Correctly said not mandatory, just recommended. |
| C3-proxy | "How much bank balance is required for a UK visa?" | ✅ | Correctly said no fixed amount; volunteered a "£600–£1000/month" figure but properly hedged and placed in **Community**, not Verified. |
| **A1+A2** | "How much does the visa cost, + priority fee?" | ❌ | Stated as fact: £100/£361/£532/£823 tiers, £220 priority. **Every number wrong** (official, per GOV.UK: £135 standard; £506/£903/£1,128 long-term; £500 priority. The reference answers used at the time were £115/£432/£771/£963, since found to be out of date — the model's figures were wrong against both). Zero hedging. |
| C2 | "Can I use fixed deposits as proof of funds?" | ⚠️ | Correct but incomplete — omitted the "hold 3+ months before applying" nuance that flags last-minute FDs as suspicious. |
| D3 | "What makes a strong purpose of visit letter?" | ✅ | Solid, accurate, actionable. |
| E1 | "What if I've never travelled abroad before?" | ✅ | Correctly nuanced — no legal bar, recommends compensating evidence. |
| E5 | "Can a self-employed person apply?" | ✅ | Correct — business accounts, ITRs, accountant letter. |
| E4 | "What happens if my visa is rejected?" | ✅ | Correctly implied no mandatory cooling-off period. |
| E2 | "Can I visit family and do tourism on the same visa?" | ✅ | Correct — combined purposes allowed on one Standard Visitor Visa. |
| E3 | "My employer letter is in Hindi — accepted?" | ✅ | Correct — must be English or certified translation. |
| **A3** (+A4) | "10-year visa fee? Children's discount?" | ❌ | Fee again wrong: said £361/£655/£822 for 2/5/10-yr (official: £506/£903/£1,128; wrong against the older reference figures too). The children-discount part (A4) was correct: the GOV.UK fee table lists no separate child rate for visit visas. |
| B1+B2+B3 | Standard/priority/super-priority processing times | ✅✅✅ | All three correct, including the nuanced nugget that Super Priority gives a next-working-day decision "for an additional fee" — no false 24-hour guarantee. |
| C3 (exact)+C4 | "Minimum balance required by law? Parents sponsor?" | ✅✅ | Correctly declined to state a fixed legal minimum; correctly described parental sponsorship via letter + their own proof. |
| D2+D4 | Income tax returns? Self-employed docs? | ✅✅ | Matches ground truth on both. |
| F1+F2 | Most common rejection reason? Lump-sum deposit risk? | ✅✅ | Matches ground truth; F1 added "incomplete/inaccurate applications" as an extra plausible reason (not fabricated, just additional). |

**Likely cause (an inference, not a proven fact):** the *same* wrong 2-year fee (£361) appeared in two separately-worded questions. An identical figure recurring is more consistent with the model reproducing a remembered (and possibly outdated) fee schedule than with random invention. I did not verify whether £361 was ever an actual UK fee, and the sample is only three failing rows. Grounding then removed the failure on the fee questions that were re-tested, which supports, but does not prove, a knowledge-recall explanation over, say, a need for a different model. All wrong figures were stated with full confidence and no "this may be out of date" hedge.

**What this shows:** the Visa Search page shows fees from a curated data file rather than from the Copilot, and an unguarded Copilot given the same question would state a confidently wrong fee schedule with no red flags. The 82% / 13.6% split makes the finding more precise than "the app has hallucination risk": in this run the errors were confined to one fact type. **One caveat on the "curated data" protection:** that file was itself found to be out of date on 23 September 2026 (see the correction block at the top), so keeping fees out of the model's hands only helps if the curated data is kept current.

**Fix status:**
1. **Product fix — shipped.** A persistent tip banner now sits in the Copilot chat: *"For exact fees, always confirm on the Visa Search page — the Copilot's numbers can be wrong,"* with a working button that navigates there.
2. **Prompt fix — shipped and re-tested.** See Run 2 below.
3. **Model fix — not yet done.** Re-run the same fee questions against Claude (once credits exist) for an apples-to-apples comparison number.

### Run 2 — August 2026 — same model, after grounding fix

**Fix applied:** the exact fee figures were injected into the system prompt as a `VERIFIED FEE DATA` block, sourced directly from `UK_VISA_DATA.feeTable` in `src/data/visaData.js` — the same object that renders the Visa Search page. The model is now instructed to quote these figures for any fee question instead of its own memory. No model change, no data duplication — one source of truth feeding both the UI and the prompt.

Re-ran the exact two questions that failed in Run 1:

| # | Question | Run 1 (before) | Run 2 (after) |
|---|---|---|---|
| A1+A2 | "How much does the visa cost, + priority fee?" | ❌ £100/£361/£532/£823, £220 priority — all wrong | Matched the reference data of the time (£115 standard, +£500 priority). **Against the official figures: ❌ £115 (should be £135), ✅ £500.** |
| A3+A4 | "10-year visa fee? Children's discount?" | ❌ £361/£655/£822 tiers wrong (A4 was already correct) | Matched the reference data of the time (£963 for 10-year; no child discount). **Against the official figures: ❌ £963 (should be £1,128), ✅ no child discount.** |

**Result, as scored at the time: the model now repeated the injected figures exactly, and the invented/misremembered numbers stopped.** That part of the fix worked. **What it did not do is make the figures correct:** the injected reference data was itself out of date (see the correction block at the top), so grounding faithfully propagated a stale fee.

**Post-fix scorecard, as scored at the time against the project's own reference data: 21/22 ✅ (~95%) · 1/22 ⚠️ (~4.5%) · 0/22 ❌.** The three ❌ rows from Run 1 (A1, A2, A3) returned exact matches to that reference data when re-asked after the fix. **That reference data was later found to be out of date (see the correction block at the top of this file); scored against the official GOV.UK figures, the same answers give 19/22 ✅ (~86%).** The one ⚠️ (C2, fixed deposits) is a completeness gap rather than a factual error, and is untouched by the fix because it isn't a fee question.

**Caveats:** Run 2 re-asked only the two fee questions. The other 19 rows are carried over from Run 1, not re-run. The prompt change only added fee text, so regressions elsewhere are unlikely, but they were not re-checked. Non-fee reference answers are unverified (see top). This is a manual, single-rater evaluation on a small question set, not an automated regression suite or a formal benchmark.

**Why it worked, and where it stops:** this is prompt grounding (there is no retrieval step, no embeddings and no vector store). Instead of relying on the model's memory, the exact figures are handed to it in the prompt on every request, so it quotes them rather than recalling them. It fits a small, slow-changing fact set such as fees, but fees do change (the standard visitor fee went from £127 to £135 in April 2026), so the table needs a dated source and a maintenance owner; the app now shows a "fees checked" date for that reason. It would not scale to grounding every fact the Copilot might be asked about. That is the point where real retrieval over live GOV.UK pages, with source timestamps, would be worth building instead of hardcoding more into one prompt.
