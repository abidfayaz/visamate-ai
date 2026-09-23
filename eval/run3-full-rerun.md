# Run 3 — full 22-question re-run on the current model

**Model:** `openai/gpt-oss-120b` via Groq (low reasoning effort), called through the deployed app's `/api/copilot` endpoint, so the answers include the fee grounding and system prompt exactly as users get them.
**Method:** all 22 golden questions, each as its own fresh single-turn conversation, each asked **once**. Raw answers (all three sections) are in [`run3-raw-answers.json`](run3-raw-answers.json).
**Scored:** the `verified` section only, by one rater, against the reference answers in `golden-questions.md`.
**Read this first:** only the four fee reference answers (A1–A4) have been checked against an official source (GOV.UK fee tables, 23 September 2026). **The other 18 reference answers are the reviewer's own and are unverified.** So this run measures agreement with those reference answers, not verified accuracy against GOV.UK.

## Scorecard

| Verdict | Meaning | Count |
|---|---|---|
| ✅ | Matches the reference answer, no unsupported specifics | **16** |
| ⚠️ | Directionally right, but incomplete or adds an unsupported specific | **3** (C2, D4, F2) |
| ❓ | Disagrees with the reference answer, and the reference itself is unverified | **3** (C1, D2, D3) |
| ❌ | Clearly wrong | **0** |

**All four fee rows (A1–A4), the only rows with an official reference, were correct** and matched the GOV.UK figures (£135, +£500, £1,128, no reduced child fee).
Depending on whether the three disputed rows turn out to be right or wrong on the reference side, the clean score is somewhere between **16/22 (~73%)** and **19/22 (~86%)**. I have not tried to resolve that, because doing so means checking each claim against GOV.UK.

## Row by row

| Row | Question | What the `verified` section said (abridged) | Verdict | Note |
|---|---|---|---|---|
| A1 | Standard visa cost? | £135, "checked 23 September 2026" | ✅ | Matches official figure |
| A2 | Priority extra? | +£500 on top of £135 | ✅ | Matches official figure |
| A3 | 10-year fee? | £1,128 | ✅ | Matches official figure |
| A4 | Child discount? | No reduced fee; £135 for children | ✅ | Consistent with the fee table (no separate child rate) |
| B1 | Standard processing time? | Up to 15 working days (~3 weeks) | ✅ | |
| B2 | Priority speed? | 5 working days | ✅ | |
| B3 | Decision in 24 hours? | No guarantee; Super Priority aims for next working day, £1,000, subject to availability | ✅ | £1,000 comes from the grounded fee data |
| C1 | Months of bank statements? | "Three months", attributed to official guidance | ❓ | Reference says 6 months; the app's own checklist also says 6. Neither is verified, and "GOV.UK states three months" is an unsupported attribution |
| C2 | Fixed deposits as proof of funds? | Acceptable; certificates "usually within the last 6 months" | ⚠️ | Omits the 3+ month holding-period point; the 6-month figure is unsupported |
| C3 | Legal minimum bank balance? | No legally mandated minimum; assessed case by case | ✅ | Trick question handled correctly in `verified`. See notes on invented figures below |
| C4 | Parents sponsor the trip? | Yes: sponsor letter plus evidence of their finances | ✅ | |
| D1 | Travel insurance required? | Not mandatory | ✅ | Slightly over-attributes ("Home Office advises…" that insurance helps meet the funds expectation) |
| D2 | Need income tax returns? | No explicit requirement unless requested | ❓ | Contradicts the reference and the app's own checklist (ITRs, last 2 years). Either could be wrong |
| D3 | Purpose-of-visit letter mandatory? | Not mandatory; optional | ❓ | Contradicts the reference and the app's checklist. Either could be wrong |
| D4 | Self-employed documents? | Business registration, "Self-Assessment tax returns… SA302", accounts, bank statements | ⚠️ | Right idea, but SA302 is a UK HMRC form that doesn't apply to an Indian applicant, and it is attributed to "official guidance" |
| E1 | No prior travel? | Not disqualifying; show funds, purpose, ties | ✅ | |
| E2 | Tourism plus family visit? | Yes, combined purposes allowed | ✅ | |
| E3 | Hindi employer letter? | English or certified translation | ✅ | |
| E4 | Reapply after refusal? | Any time; no mandatory waiting period; address the reasons | ✅ | |
| E5 | Self-employed can apply? | Yes, with evidence of self-employment | ✅ | |
| F1 | Most common rejection reason? | Funds, ties to home country, incomplete documents, purpose; notes no official ranking | ✅ | Good hedge |
| F2 | Lump-sum deposit before applying? | No rule against it, but source of funds may be requested | ⚠️ | Downplays the credibility risk; "bank statements covering the last 28 days" is unsupported |

## What this run shows

1. **No clear errors, and the fee grounding held on the new model.** That is the same fact type that failed on the previous model.
2. **A pattern the score hides: over-attribution.** In several `verified` answers the model attributes specific claims to "official guidance" that I can't support (C1 "three months", C2 "within 6 months", D4 "SA302", F2 "28 days"). This is what the README means by *the label is the model's own claim, not a check*. Grounding fixed the fee facts; nothing yet stops a `verified` section from stating an unsupported specific.
3. **The Copilot disagrees with the app's own Visa Search checklist on three points** (C1, D2, D3), exactly the ❓ rows. Neither side is verified. Two unverified "verified" sources contradicting each other is a real product issue, separate from the model.
4. **The `community` and `recommendation` sections contain invented specifics** that were not scored: for example "£100–£150 per day of the intended stay" and "£150 × number of days" (C3), "often 2–4 weeks" wait before reapplying (E4), and anecdotes such as "consular officers have noted…" (D1). The C3 figures are correctly kept out of `verified`, but they are still invented numbers shown to the user. This matches the README note that Community text is model-generated.

## Limits

- One run per question, one rater. Model output varies between runs, so a second run could score differently.
- 18 of 22 reference answers are unverified, so ✅ means "agrees with the reviewer's expectation", not "confirmed by GOV.UK".
- Only the `verified` section was scored.
- Not comparable like-for-like with Runs 1–2: different model, single questions instead of combined turns, and corrected fee references.
- Manual and single-question, so not an automated regression suite or a benchmark.
