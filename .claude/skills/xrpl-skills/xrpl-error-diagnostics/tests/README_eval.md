# Behavioral eval for the xrpl-error-diagnostics skill

`skill_eval.yaml` tests **skill lift** — does loading the skill make Claude
answer better than the base model does on its own? That's a different question
from "does `diagnose.py` parse correctly" (unit tests, separate concern) and
from the live demo in `try_examples.sh`.

## The one rule that makes this a test and not a vibe

**Every case runs twice: skill OFF, then skill ON.** A case only means anything
if the two answers *diverge* and the skill-on answer is the better one against
the rubric. If skill-off already passes, the case is measuring the base model,
not the skill — mark it `keep: false` with the reason (see `temBAD_FEE-plain`).

## Protocol

For each `keep: true` case:

1. **Skill OFF.** In a session where the skill is *not* loaded, paste the
   `prompt`. Save the answer.
2. **Skill ON.** In a session with the skill loaded, paste the same `prompt`.
   Save the answer.
3. **Grade.** Score each answer against `must_contain` / `must_not_contain`.
   Then record one of:
   - `LIFT` — skill-on passes, skill-off fails or hand-waves. (The win.)
   - `TIE-PASS` — both pass. The case isn't discriminating → demote to
     `keep: false` and note it.
   - `TIE-FAIL` — both fail. That's a **skill gap**, not a test failure — the
     skill isn't covering this. File it.
   - `REGRESSION` — skill-on does *worse*. Highest-priority bug.

## Grading: pick one

- **LLM-as-judge (re-runnable).** Hand the judge the `prompt`, both answers, and
  that case's `must_contain` / `must_not_contain` / `baseline_note`. Ask it to
  classify (LIFT / TIE-PASS / TIE-FAIL / REGRESSION) with a one-line reason. Use
  a *separate* model instance from the one under test. Cheap enough to re-run on
  every edit to SKILL.md or the reference files.
- **Manual.** For ~10 cases, just read the pairs yourself. Higher signal, doesn't
  scale.

## What each category is for

- **discriminating** — the skill's core promise: specific, computed numbers and
  fetch-first discipline instead of generic advice. Graded on *resolution*
  ("run diagnose.py account, here's the exact gap") vs *recall* ("you need more
  reserve").
- **routing** — symptom/error → correct `references/*.md` and correct error
  *class* (API method error vs tx result code vs semantic). Often near-binary,
  so cheap to grade.
- **adversarial-negative** — the failure mode that makes a skill *worse* than no
  skill: confidently fabricating an on-ledger cause for a client misconfig, a
  fake code, a queue state, or an amendment difference. These are weighted
  highest. A REGRESSION here is a release blocker.

## Maintaining the set

- When a case grades `TIE-PASS`, flip `keep: false` and write why. Don't delete
  it — the marker stops it being re-added.
- When you find a `TIE-FAIL`, that's the signal to add coverage to the skill,
  then the case becomes a `LIFT`.
- Add new adversarial-negatives whenever you catch the skill (or base model)
  confabulating in real use — those are the highest-value additions.

## Not in scope here

- `diagnose.py` / `error_stats.py` correctness → unit tests (canned JSON, no
  network, CI-able).
- "Do the scripts still run against mainnet?" → `try_examples.sh` (live smoke).
