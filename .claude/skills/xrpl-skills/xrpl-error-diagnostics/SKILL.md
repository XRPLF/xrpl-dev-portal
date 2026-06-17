---
name: xrpl-error-diagnostics
description: >
  Diagnose XRPL errors with specific, numerical answers — not generic advice. Pairs
  reference files covering transaction result codes (`tec*`, `tef*`, `tel*`, `tem*`,
  `ter*`), JSON-RPC / WebSocket API errors, and "succeeded but wrong outcome" semantic
  failures with two scripts: `diagnose.py`, which
  pulls live numbers (reserves, sequence, flags, recent-tx patterns) from a real node,
  and `error_stats.py`, which ranks how frequently each `tec*` code occurs network-wide.

  Use this skill whenever a developer pastes an XRPL transaction result code,
  a failed transaction hash, an API error name, or describes a symptom like
  "my payment failed", "transaction succeeded but no funds moved", "balance
  didn't change", "why is this not working", or "I'm getting this weird error".
  Also use when the user is debugging a TrustSet, OfferCreate, EscrowFinish,
  AccountDelete, AMM, or NFT operation that returned a non-`tesSUCCESS` result.

  This skill stands alone but cross-links with **xrpl-payments** when the
  failing transaction is a payment.
---

# XRPL Errors & Diagnostics

XRPL errors are unusually diagnosable: every applied transaction (including failed
`tec*` ones) is recorded on-ledger with full metadata, and account state — reserves,
trust lines, freeze flags, signer lists, owner objects — is publicly queryable. The
problem isn't getting the data; it's knowing **which query answers which error**.

This skill turns each common error into a recipe: cause → specific lookups → computed
numbers → suggested fix. The goal is to replace "check your reserve" with "rXXX holds
N XRP against M owner objects; a new trust line needs `reserve_base + (M+1) ×
reserve_inc` — run `diagnose.py account <addr>` for the live figure and the gap."

## When to load this skill

Load this skill the moment any of these appear in a developer's message:

| Signal | Examples |
| :---- | :---- |
| **Result code** | `tecINSUFFICIENT_RESERVE`, `tefPAST_SEQ`, `temBAD_AMOUNT`, `terQUEUED`, any `tec*`/`tef*`/`tel*`/`tem*`/`ter*` |
| **Failed transaction hash** | "this tx failed: `E3FE6E…`", "why did `7B2F…` not go through" |
| **API error** | `actNotFound`, `invalidParams`, `lgrNotFound`, `amendmentBlocked`, `srcCurMalformed` |
| **Symptom phrase** | "my payment failed", "tx succeeded but no funds moved", "balance didn't change", "destination didn't receive anything", "trust line didn't create" |
| **Debugging context** | Developer is troubleshooting any non-`tesSUCCESS` outcome from `submit`, `submit_and_wait`, or `simulate` |

## What this skill covers

| Area | What it knows |
| :---- | :---- |
| **`tec*` codes** | Finalized failures (fee taken, on-ledger). See [tec-codes.md](references/tec-codes.md) |
| **`tef*`/`tel*`/`tem*`/`ter*` codes** | Pre-flight, queue, malformed, and retry codes. See [tef-tel-tem-ter-codes.md](references/tef-tel-tem-ter-codes.md) |
| **API errors** | JSON-RPC / WebSocket method errors. See [api-errors.md](references/api-errors.md) |
| **Semantic failures** | `tesSUCCESS` but wrong outcome — partial payments, missing tags, frozen lines, rippling. See [semantic-failures.md](references/semantic-failures.md) |
| **Live numbers** | `scripts/diagnose.py` queries a real node for the three things hardest to reason about conversationally: a tx's actual on-ledger result, an account's exact reserve / spendable / flag state, and recurring failure patterns across recent history. |
| **Network baselines** | `scripts/error_stats.py` ranks the most frequent on-ledger `tec*` codes across the whole network (XRPScan result metrics, **Mainnet only**) — the empirical "how common is this error?" baseline that `diagnose.py patterns` compares a single account against. |

## Operating procedure

The reference markdown files carry the per-code explanations and fixes. The script carries the live arithmetic. Use them together — never substitute one for the other.

### Steps

1. **Classify the input.**
   - **Tx hash?** Run `scripts/diagnose.py tx <hash>` for the on-ledger result code and key fields, then open the matching reference file. For a `tec*` failure, prefer `scripts/diagnose.py explain <hash>`: it also fetches the *related* ledger state the error is about (counterparty flags, trust lines, order book, AMM pool, owned objects) and prints a specific cause + fix — e.g. "source holds 0 CFH, nothing to convert" rather than a generic "no liquidity". Use the reference file to expand on what `explain` reports.
   - **Result code alone?** Read the matching reference file. If the developer can supply the account address, run `scripts/diagnose.py account <addr>` to get the live numbers (balance, reserve, flags) the fix needs.
   - **API error name?** Read [api-errors.md](references/api-errors.md).
   - **Symptom only ("payment failed", "balance didn't change")?** Read [semantic-failures.md](references/semantic-failures.md) and ask one targeted question — usually "Can you share the tx hash or the account address?".
   - **Recurring failures on one account?** Run `scripts/diagnose.py patterns <addr>` to find systemic issues (sequence churn, reserve grinding, fee volatility) the reference files can't see. To judge whether an account's failure mix is unusual, compare it against the network baseline from `scripts/error_stats.py`.
   - **"Is this error common / is something network-wide going on?"** Run `scripts/error_stats.py` for the ranked frequency of on-ledger `tec*` codes. Use it to set expectations (e.g. `tecPATH_DRY` and `tecKILLED` dominate because of DEX/AMM churn, so they rarely indicate a bug in the developer's own code).
   - **Behavior differs by network, or "is this a regression / bug"?** An error can be correct on one network and not even exist on another, depending on amendment status — so verify before declaring an error wrong. **Never assert an amendment's name, existence, or status from memory.** Confirm the amendment name against the known-amendments page (<https://xrpl.org/resources/known-amendments>), then check whether it's live on the user's network with the `feature` RPC on the *same node* (`{"method": "feature", "params": [{}]}`) — read each amendment's `enabled` field. Common cases: `tecAMM_*` needs `AMM`; `tecKILLED` from `tfImmediateOrCancel` with no fill needs `ImmediateOfferKilled` (pre-amendment that same case returned `tesSUCCESS` with zero fill); deep-freeze flags on a trust line need `DeepFreeze`.

2. **Report the cause with real numbers**, not generic advice. State the threshold, the actual value, and the gap. Cite the exact field (`OwnerCount`, `Flags`, `delivered_amount`) and which method returned it. When `diagnose.py` produced a number, relay it verbatim rather than rounding or paraphrasing.

3. **Suggest the fix** as the smallest concrete action drawn from the reference file: "fund rXXX with N XRP", "submit a TrustSet to rIssuer for currency X", "re-sign with the regular key", "raise Fee above the current open-ledger fee of N drops".

## Live diagnosis: `scripts/diagnose.py`

```bash
# What did this tx actually do on-ledger?
python scripts/diagnose.py tx <tx_hash>

# WHY did it fail? Pulls the related ledger state (counterparty flags, trust
# lines, order book, AMM, owned objects) and prints a specific cause + fix.
python scripts/diagnose.py explain <tx_hash>

# What's this account's reserve / spendable / flag state right now?
python scripts/diagnose.py account <r…>

# Are there recurring failure patterns in this account's recent history?
python scripts/diagnose.py patterns <r…>

# Pass --network before the subcommand to target testnet, devnet, local, or a custom node.
python scripts/diagnose.py --network testnet account <r…>
```

`--network` accepts `mainnet|testnet|devnet|local|<https_url>` and defaults to mainnet (`https://xrplcluster.com`). The script uses JSON-RPC over HTTPS.

The script depends on `xrpl-py`. Install or upgrade with `pip install -U xrpl-py`.

## Network baselines: `scripts/error_stats.py`

Ranks how often each `tec*` code actually occurs on-ledger, so you can tell a developer whether the error they hit is routine or rare. Data comes from XRPScan's daily result-code metrics; the window defaults to the **last 12 months**.

```bash
# Ranked tec codes for the last 12 months (default)
python scripts/error_stats.py

# Pick the window
python scripts/error_stats.py --last-days 30
python scripts/error_stats.py --since 2026-01-01 --until 2026-03-31
python scripts/error_stats.py --all            # full history (2013–present)

# Output formats: table (default) | md (paste into docs) | json (for tooling)
python scripts/error_stats.py --format md --top 10
```

Scope and caveats — state these when citing its numbers:

- **Mainnet only, by design.** XRPScan covers Mainnet, and there is no historical metrics API for the test networks. A network-wide baseline is only meaningful on Mainnet anyway — Testnet/Devnet traffic is dominated by whatever bot or amendment test is running that week, so an aggregate figure there measures the bot, not real developer patterns. **To help a developer on Testnet or Devnet, diagnose their specific transaction or account** with `diagnose.py tx|explain|account|patterns --network testnet` (or `devnet`), which query the node directly and work on every network.
- **`tec*` only.** Pre-flight rejections (`tem*`/`tef*`/`tel*`/`ter*`) and API errors are *not* recorded on-ledger, so they cannot appear here. This is a ledger-frequency view, not a developer-pain view.
- **Frequency ≠ priority.** The ranking is dominated by automated DEX/AMM traffic (`tecPATH_DRY`, `tecPATH_PARTIAL`, `tecKILLED`), which is rarely what a developer is debugging. Use it to set context, not to rank which errors matter to a given user.
- **Stdlib only** (no `xrpl-py` needed) but requires network access to `api.xrpscan.com`.

## What this skill does NOT do

- **Construct or submit transactions.** Diagnosis only. If a fix requires a new
  transaction (TrustSet, SetRegularKey, etc.), describe what's needed and hand
  off to **xrpl-payments** (for payment-shaped fixes) or the developer's own
  flow. Signing is always the **XRPL Agent Wallet** skill's job.
- **Guess at off-ledger causes.** If the data shows the on-ledger state is
  correct and the symptom is in the client (wrong network ID, stale client
  library, misconfigured WebSocket), say so explicitly and stop.
- **Read mempool/queue state on closed-source clusters.** Queue-related codes
  (`telCAN_NOT_QUEUE_*`, `terQUEUED`) need a node that exposes `fee` and
  `account_info` with `queue: true`; public clusters usually do, but not all
  custom nodes.

## Reference files

These files hold **diagnostic recipes** (which queries to run, what numbers to compute, which amendments change semantics) — not protocol definitions. For per-code definitions, numeric values, and the canonical list, defer to <https://xrpl.org/docs/references/protocol/transactions/transaction-results> and <https://xrpl.org/resources/known-amendments>.

- [tec-codes.md](references/tec-codes.md) — finalized failure codes (fee taken)
- [tef-tel-tem-ter-codes.md](references/tef-tel-tem-ter-codes.md) — pre-flight, local, malformed, retry codes
- [api-errors.md](references/api-errors.md) — JSON-RPC and WebSocket method errors
- [semantic-failures.md](references/semantic-failures.md) — `tesSUCCESS` but wrong outcome

Amendment-sensitive behavior (an error that only exists or only behaves a certain way after a given amendment) is handled inline in the files above and in the operating procedure's amendment-check step — verify status with the `feature` RPC against <https://xrpl.org/resources/known-amendments>.

## Works with

| Skill | Role |
| :---- | :---- |
| **xrpl-payments** | When the failing transaction is a payment, that skill knows the construction patterns; this one diagnoses why it failed. Cross-linked from payments' error-handling section. |
| **xrpl-agent-wallet** | If the diagnosis surfaces a fix that needs a signed transaction (re-key, trust line, fund destination), the wallet skill handles signing and submission. |
