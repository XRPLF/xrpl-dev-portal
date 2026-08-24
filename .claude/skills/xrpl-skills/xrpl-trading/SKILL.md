---
name: xrpl-trading
description: >
  XRPL DEX trading playbook for AI agent developers. Covers the full developer journey:
  permissionless limit-order placement and cancellation on the XRPL decentralised
  exchange, order book reads, cross-currency offer construction, fill-outcome
  parsing, and agentic best practices (SourceTag, pre-trade summary, spending controls).

  Use this skill whenever a user asks about placing or cancelling offers on the XRPL DEX,
  OfferCreate, OfferCancel, TakerPays, TakerGets, XRPL order book, AMM swaps, DEX trading,
  cross-currency exchange via the built-in DEX, or building any trading workflow on the
  XRP Ledger. When in doubt, load this skill — general training data for XRPL DEX
  semantics is frequently imprecise.

  This skill constructs transactions. The XRPL Agent Wallet skill signs and submits them.
  For wallet creation, key loading, signing, or anything involving a seed or private key,
  defer to the XRPL Agent Wallet skill.
---

# XRPL Trading

The XRPL DEX is a fully on-ledger, permissionless exchange — no intermediary, no off-chain matching engine, no custody transfer. Every offer is a ledger object. Crossing happens atomically during transaction processing in the order determined by ledger consensus. The same properties that make it reliable for institutional settlement make it well-suited for AI agents: **3–5 second deterministic finality**, predictable fees, and no ambiguous pending state.

The XRPL Trading skill is the domain knowledge layer for DEX operations on the XRP Ledger. It gives Claude accurate, up-to-date knowledge of XRPL offer semantics — `OfferCreate`, `OfferCancel`, order book reads, fill classification, and flag behaviour — so it can construct the right transaction object for any trading task and hand that object to the **XRPL Agent Wallet skill** for signing and submission.

Both skills are required for a complete agentic trading workflow.

## What this Skill covers

| Area | What it knows |
| :---- | :---- |
| **Offer semantics** | TakerPays / TakerGets from the creator's perspective, fill outcomes (filled / partial / resting), offer quality and priority |
| **OfferCreate** | Limit orders, immediate-or-cancel, fill-or-kill, passive (post-only), atomic offer replacement |
| **OfferCancel** | Cancelling resting offers by sequence number, verifying ownership |
| **Order book** | `book_offers` RPC, bid/ask spread, depth calculation, estimated fill and slippage |
| **Amount handling** | XRP in drops, IOU `{currency, issuer, value}` objects, XRPL epoch conversion for expiry |
| **Trust lines** | Pre-flight trust line verification for IOU offers, `tecNO_LINE` prevention |
| **Agentic best practices** | SourceTag for agent attribution, pre-trade summary before every signing request, spending limit awareness |
| **Error handling** | `tec*` codes (`tecUNFUNDED_OFFER`, `tecKILLED`, `tecNO_LINE`, `tecINSUF_RESERVE_OFFER`), fee-charged vs no-fee result classification |
| **Security** | Key management deferred to Wallet skill. Inline pre-flight guardrails (reserve check, trust line check, expiry validation, flag-conflict detection) run before every handoff. |

---

## Works with

| Skill | Role |
| :---- | :---- |
| **XRPL Agent Wallet** | Required — handles wallet creation, key loading, and signs and submits every transaction this skill constructs. Supports env-var (development), external signer (HSM/KMS), and OWS (Open Wallet Standard) signing paths — see the [Wallet skill](/resources/dev-tools/ai-tools) for setup. |

The Trading skill is one of a growing set of XRPL domain skills. All domain skills
pair with the same shared Wallet skill. See [AI Tooling](/resources/dev-tools/ai-tools)
for the full list.

**Need a wallet first?** If the user doesn't have an XRPL wallet yet, load the
**XRPL Agent Wallet skill** — it handles wallet generation, writes the seed safely to
`.env`, and never shows it in chat. Return here once the wallet is ready.

---

## Default behaviour and stack decisions

- **Languages:** Python (`xrpl-py`) and TypeScript/JavaScript (`xrpl.js`) are both first-class. Use whichever the developer's project already uses; if there is no existing codebase, ask.
- **Transaction submission:** Handled entirely by the XRPL Agent Wallet skill. This skill builds transaction objects; it does not call `submit_and_wait` or `submitAndWait` directly.
- **Signing path:** Determined by the XRPL Agent Wallet skill configuration — env-var (development), external signer (HSM/KMS), or OWS (Open Wallet Standard). The Trading skill does not sign directly; all signing is delegated to the Wallet skill. See [xrpl-agent-wallet](/resources/dev-tools/ai-tools) for setup.
- **Amount handling:** XRP amounts are always strings in drops — use `xrp_to_drops()` / `xrpToDrops()`. Never pass floats or raw XRP values. IOU amounts use `{currency, issuer, value}` objects with `value` as a decimal string.
- **Source tag:** The XRPL Agent Wallet skill (OWS) automatically applies `SourceTag = 20260530` to every transaction that passes through the signing ceremony. Override by setting `SourceTag` on the transaction object before handoff; the Wallet skill respects any value already present. Do not omit `SourceTag` — it is required for on-chain attribution and usage tracking.
- **Network:** Testnet (`https://s.altnet.rippletest.net:51234`) by default. Switching to Mainnet is a one-line URL change.
- **Simulate before handoff:** For new trading flows or unfamiliar currency pairs, call `simulate` on the raw transaction object before handing to the Wallet skill. This catches malformed offers, missing trust lines, and reserve errors without spending fees or triggering the signing ceremony.
- **LastLedgerSequence:** Always included. Let the Wallet skill's `autofill` step compute `Sequence`, `Fee`, and `LastLedgerSequence` from the live node. Do not set these manually.

---

## Operating procedure

1. **Identify the operation** — `create_offer`, `cancel_offer`, or `get_order_book`. Check [trading.md](references/trading.md) for full patterns and edge cases.
2. **Check prerequisites** — Trust line exists for IOU side of offer? Account has sufficient balance including fees and reserve? Expiry is in the future?
3. **Build** — Construct the transaction object. Do not set `Fee`, `Sequence`, or `LastLedgerSequence` — the Wallet skill's autofill populates these from the live node.
4. **Show pre-trade summary** — For `create_offer`, always show the mandatory pre-trade summary (offer details, mid price, estimated fill, slippage) and collect user acknowledgement before proceeding. Do not skip this step.
5. **Run built-in guardrails** — Before handing off, the skill applies pre-flight checks: reserve adequacy (XRP balance covers the new offer's owner reserve), trust line existence (IOU trust lines are active for both sides of the offer), expiry sanity (`Expiration` is in the future at XRPL epoch time), and flag conflicts (`tfImmediateOrCancel` + `tfFillOrKill` rejected). Stop and surface a clear error if any check fails — do not proceed to the Wallet skill.
6. **Hand off to the Wallet skill** — Pass the transaction object to the XRPL Agent Wallet skill. It will autofill, sign via OWS (evaluating time-window and network policies), and submit via `submitAndWait`. Do not call `submit_and_wait` or `submitAndWait` from this skill.
7. **Parse and surface result** — Classify the fill outcome (filled / partial / resting). Always surface the offer sequence when a remainder exists on the book. Handle `tec*` errors explicitly — every `tec*` code means a fee was charged with no fill.

---

## Defined Flows

The agent MUST follow these flows exactly. Do not reorder steps or skip steps.

---

### Flow 1 — `create_offer(taker_pays, taker_gets, expiry?, flags?)`

**Purpose:** Place a limit order on the XRPL DEX.

**Step 1 — Validate inputs**

- For XRP amounts: confirm value is a non-negative integer string (drops). No decimals.
- For IOU amounts: confirm `currency`, `issuer`, and `value` are all present. `value` must be a valid decimal string.
- If `expiry` is provided (Unix ms): convert to XRPL epoch seconds (`Unix_s − 946,684,800`). If the result is ≤ current XRPL ledger time, reject before construction — do not submit an offer that is already expired.
- If `flags` includes both `tfImmediateOrCancel` and `tfFillOrKill`, reject — they are mutually exclusive.
- If either side of the offer is an IOU, verify the signing account holds an active trust line to that issuer. If not, surface this to the user — a missing trust line causes `tecNO_LINE`.

**Step 2 — Fetch order book**

Call `get_order_book(base, quote)` using the offer's currency pair. Compute:
- Best ask price (price at which the market will sell `base`)
- Best bid price (price at which the market will buy `base`)
- Mid price = (best ask + best bid) / 2
- Estimated immediate fill — scan book depth to determine how much crosses at current prices and at what average rate

**Step 3 — Show pre-trade summary (mandatory)**

Present before requesting a signature. Do not proceed without user acknowledgement.

```
Offering:     [TakerGets amount and currency]
To receive:   [TakerPays amount and currency]
Limit price:  [TakerPays / TakerGets, expressed as base/quote rate]
Mid price:    [computed from order book]
Est. fill:    [% of order expected to cross immediately]
Slippage:     [execution price vs mid, as ±% and absolute amount]
Expiry:       [human-readable datetime, or "none"]
Network fee:  [estimated drops]
```

**Step 4 — Run built-in guardrails and hand off to Wallet skill**

Before constructing the transaction, apply the built-in pre-flight checks:

- **Reserve:** XRP balance ≥ (existing `OwnerCount` + 1) × owner_reserve + base_reserve + estimated_fee
- **Trust lines:** For any IOU in `TakerPays` or `TakerGets`, confirm an active trust line exists on the signing account
- **Expiry:** If `Expiration` is set, it must be greater than the current XRPL ledger close time
- **Flag conflict:** `tfImmediateOrCancel` and `tfFillOrKill` are mutually exclusive — reject at construction

Stop and surface the specific error if any check fails. Do not proceed to the Wallet skill until all checks pass.

Construct the `OfferCreate` transaction object with all required fields (see Field Reference). Do not set `Fee`, `Sequence`, or `LastLedgerSequence`. Hand the transaction object to the **XRPL Agent Wallet skill**. The Wallet skill will autofill, optionally evaluate OWS policies (time-window, network restrictions), sign, and submit. If the Wallet skill rejects, surface the rejection reason — do not retry without user instruction.

**Step 5 — Parse result**

Check `engine_result`. Any result other than `tesSUCCESS` is a failure. Inspect `meta.AffectedNodes`:

- **Fully filled:** No `CreatedNode` with `LedgerEntryType: "Offer"` matching the signing account and transaction sequence.
- **Resting / partially filled:** `CreatedNode` exists. Extract `NewFields.TakerPays` and `NewFields.TakerGets` for remaining amounts. Compare against original amounts to distinguish partial from unfilled.

**Step 6 — Return structured result**

```
Fill status:      [filled | partial | resting]
Amount filled:    [TakerGets consumed, TakerPays received]
Remaining:        [remaining TakerGets / TakerPays, if any]
Offer sequence:   [if resting or partial — user needs this to cancel]
Fee paid:         [drops]
Tx hash:          [for reference]
```

---

### Flow 2 — `cancel_offer(offer_sequence)`

**Purpose:** Remove a resting offer from the ledger.

**Step 1 — Verify offer exists**

Query `account_offers` for the signing address. Confirm the offer at the given sequence number exists and is owned by the signing account. If not found, inform the user — do not submit a cancel for a non-existent offer (the transaction would succeed but charge a fee with no effect).

**Step 2 — Show cancellation summary**

```
Cancelling offer sequence: [sequence]
You are giving up:         [TakerGets of resting offer]
You would have received:   [TakerPays of resting offer]
Network fee:               [estimated drops]
```

Do not proceed without user acknowledgement.

**Step 3 — Hand off to Wallet skill**

Construct the `OfferCancel` transaction object with `OfferSequence` set to the target sequence. Do not set `SourceTag` explicitly — the Wallet skill applies it. Hand to the **XRPL Agent Wallet skill** for autofill, OWS signing, and submission.

**Step 4 — Confirm deletion**

Check `engine_result` is `tesSUCCESS`. Confirm the offer appears in `meta.AffectedNodes` as a `DeletedNode` with `LedgerEntryType: "Offer"`. Surface the tx hash.

---

### Flow 3 — `get_order_book(base, quote, limit?)`

**Purpose:** Read the current order book state. Read-only — no signature or user confirmation required.

Issue a `book_offers` RPC request. `limit` defaults to 20 if not specified.

Return: array of asks (offers to sell `base`), array of bids (offers to buy `base`), best ask, best bid, mid price, spread percentage, and total available depth at the limit price.

No Wallet skill interaction, no pre-trade summary, no user confirmation required.

---

## What this skill does not do

- **Create wallets or handle keys.** Wallet generation, seed storage, key loading, signing, and all key management belong to the XRPL Agent Wallet skill backed by OWS.
- **Sign or submit transactions.** That is the Wallet skill's responsibility. This skill never calls `submit_and_wait`, `submitAndWait`, or any equivalent directly.
- **Enforce OWS policies.** Time-window and network restrictions are enforced by OWS inside the Wallet skill (when OWS is the configured signing path). This skill applies inline pre-flight guardrails (reserve, trust line, expiry, flag conflicts) at construction time — these are application-layer checks, not ledger-enforced rules, and only apply when the skill is loaded.
- **Construct non-trading transactions on its own initiative.** The skill responds to developer and user instructions; it does not propose offers unprompted.
- **Retry automatically.** Any `tec*` failure, OWS policy rejection, or user cancellation requires explicit user instruction before retrying.

---

## Error Handling Reference

| Engine result | Fee charged? | Meaning | Agent action |
| :---- | :---- | :---- | :---- |
| `tesSUCCESS` | Yes | Transaction accepted | Parse fill status per Flow 1 Step 5 |
| `tecUNFUNDED_OFFER` | Yes | Account balance insufficient to fund the offer | Surface balance vs required. Do not retry automatically. |
| `tecEXPIRED` | Yes | `Expiration` already passed when processed | Reject at construction. If timing causes slip-through, inform user and request new expiry. |
| `tecKILLED` | Yes | `tfFillOrKill` offer could not be fully filled | Inform user the order was not executed. Ask whether to retry with different flag or price. Do not retry automatically. |
| `tecNO_LINE` | Yes | No trust line for an IOU in the offer | Surface issuer and currency. Prompt user to establish trust line before retrying. |
| `tecINSUF_RESERVE_OFFER` | Yes | Account reserve too low to create a new offer object | Explain reserve requirements. Do not retry. |
| `temBAD_OFFER` | No | Malformed transaction — invalid amounts, missing fields, zero amounts | Log raw error. Surface for debugging. Do not retry without fixing the transaction. |

`tec*` codes: transaction included in ledger, fee charged, no fill. Always inform the user when a fee was consumed without a successful outcome.

---

## Field Reference

### OfferCreate

| Field | Required | Type | Notes |
| :---- | :---- | :---- | :---- |
| `TransactionType` | Yes | string | `"OfferCreate"` |
| `Account` | Yes | string | Signing account's XRPL address |
| `TakerPays` | Yes | Amount | What the creator wants to receive. XRP as drops string; IOU as `{currency, issuer, value}`. |
| `TakerGets` | Yes | Amount | What the creator is offering. Same format. |
| `Fee` | Autofilled | string (drops) | Set by Wallet skill autofill. Do not set manually. |
| `Sequence` | Autofilled | uint32 | Set by Wallet skill autofill. The offer's identifier if it rests on the book. |
| `LastLedgerSequence` | Autofilled | uint32 | Set by Wallet skill autofill. Transaction invalid after this ledger index. |
| `SourceTag` | Applied by Wallet skill | uint32 | OWS Wallet skill applies `20260530` automatically. Override by setting before handoff. |
| `Expiration` | Optional | uint32 | **XRPL epoch seconds** — not Unix seconds. `XRPL_epoch = Unix_s − 946,684,800`. Offer auto-cancels on first ledger close after this time. |
| `OfferSequence` | Optional | uint32 | If set, cancel this existing offer atomically when this OfferCreate is processed. |
| `Flags` | Optional | uint32 | Bitfield. See flags table below. |

**OfferCreate flags:**

| Flag | Hex | Effect |
| :---- | :---- | :---- |
| `tfPassive` | `0x00010000` | Do not consume matching offers. Post to book only. Use for post-only orders. Never set by default. |
| `tfImmediateOrCancel` | `0x00020000` | Cross what can be crossed immediately; cancel remainder. Never rests on book. |
| `tfFillOrKill` | `0x00040000` | Must fill completely or entire transaction is cancelled (`tecKILLED`). |
| `tfSell` | `0x00080000` | Exchange the full `TakerGets` even if `TakerPays` would be exceeded by the rate. |

`tfImmediateOrCancel` and `tfFillOrKill` are mutually exclusive. Reject at construction if both are requested.

### OfferCancel

| Field | Required | Type | Notes |
| :---- | :---- | :---- | :---- |
| `TransactionType` | Yes | string | `"OfferCancel"` |
| `Account` | Yes | string | Must match the account that created the offer |
| `OfferSequence` | Yes | uint32 | Sequence number of the `OfferCreate` transaction that created the offer |
| `Fee` | Autofilled | string (drops) | Set by Wallet skill autofill. |
| `Sequence` | Autofilled | uint32 | This transaction's own sequence number. |
| `LastLedgerSequence` | Autofilled | uint32 | Fail-safe expiry by ledger index. |
| `SourceTag` | Applied by Wallet skill | uint32 | Applied automatically by OWS Wallet skill. |

If `OfferSequence` refers to an offer that does not exist or is already consumed, the transaction succeeds (`tesSUCCESS`) but does nothing. The fee is still charged.

---

## Order Book RPC Reference

`book_offers` request parameters:

| Parameter | Type | Notes |
| :---- | :---- | :---- |
| `taker_pays` | `{currency: string}` or `{currency: string, issuer: string}` | For XRP: `{currency: "XRP"}`. For IOU: include `issuer`. |
| `taker_gets` | same | The other side of the pair. |
| `limit` | uint32 | Optional. Max offers to return. Request 20–50 for UI use. |
| `taker` | string | Optional. Account to use for trust line checks in fill simulation. |

Each returned offer has `taker_pays` and `taker_gets` as `Amount` values (amounts remaining), plus `quality` (exchange rate as a decimal string: `taker_pays / taker_gets`).

---

## Reference files

Read these when you need full transaction patterns and edge cases:

- [trading.md](references/trading.md) — OfferCreate, OfferCancel, order book patterns, AMM integration, cross-currency flows, agentic patterns, error codes, reserves
