---
seo:
    title: The XRPL Trading Skill
    description: >
        The XRPL Trading skill gives Claude accurate, up-to-date knowledge of
        XRP Ledger DEX operations — permissionless limit orders, offer cancellation,
        order book reads, AMM interaction, cross-currency exchange, and agentic
        best practices. Works with the XRPL Agent Wallet skill to sign and submit.
labels:
    - AI
    - Agents
    - DEX
    - Trading
---

# XRPL Trading

The XRPL DEX is a fully on-ledger, permissionless exchange — no intermediary, no off-chain matching engine, no custody transfer. Every offer is a ledger object. Crossing happens atomically during transaction processing in the order determined by ledger consensus. The same properties that make it reliable for institutional settlement make it well-suited for AI agents: **3–5 second deterministic finality**, predictable fees, and no ambiguous pending state.

The XRPL Trading skill is the domain knowledge layer for DEX operations on the XRP Ledger. It gives Claude accurate, up-to-date knowledge of XRPL offer semantics so it can construct the right transaction object for any trading task — limit orders, cancellations, order book reads, cross-currency exchange, and AMM interaction — and hand that object to the **XRPL Agent Wallet skill** for signing and submission.

Both skills are required for a complete agentic trading workflow.

## What this Skill covers

| Area | What it knows |
| :---- | :---- |
| **Offer semantics** | TakerPays / TakerGets from the creator's perspective, fill outcomes (filled / partial / resting), offer quality and priority |
| **OfferCreate** | Limit orders, immediate-or-cancel (market-equivalent), fill-or-kill, passive (post-only), atomic offer replacement, offer expiry |
| **OfferCancel** | Cancelling resting offers by sequence number, verifying ownership before cancelling |
| **Order book** | `book_offers` RPC, bid/ask spread, depth calculation, estimated fill and slippage |
| **Amount handling** | XRP in drops, IOU `{currency, issuer, value}` objects, XRPL epoch conversion for expiry |
| **Trust lines** | Pre-flight trust line verification for IOU offers, `tecNO_LINE` prevention |
| **AMM interaction** | Implicit AMM liquidity via OfferCreate — no separate transaction type needed |
| **Agentic best practices** | SourceTag for agent attribution, Memos for on-chain audit trail, pre-trade summary, WebSocket monitoring for resting offer fills |
| **Error handling** | `tec*` codes (`tecUNFUNDED_OFFER`, `tecKILLED`, `tecNO_LINE`, `tecINSUF_RESERVE_OFFER`), fee-charged vs no-fee result classification |
| **Security** | Key management deferred to Wallet skill. Inline pre-flight guardrails (reserve check, trust line check, expiry validation, flag-conflict detection) run before every handoff. |

---

## Works with

| Skill | Role |
| :---- | :---- |
| **XRPL Agent Wallet** | Required — handles wallet creation, key loading, and signs and submits every transaction this skill constructs. Supports env-var (development), external signer (HSM/KMS), and OWS (Open Wallet Standard) signing paths. |

The Trading skill is one of a growing set of XRPL domain skills. All domain skills
pair with the same shared Wallet skill. See
[AI Tooling](/resources/dev-tools/ai-tools) for the full list.

**Need a wallet first?** If the user doesn't have an XRPL wallet yet, load the
**XRPL Agent Wallet skill** — it handles wallet generation, writes the seed safely to
`.env`, and never shows it in chat. Return here once the wallet is ready.

---

## Default behavior and stack decisions

- **Languages:** Python (`xrpl-py`) and TypeScript/JavaScript (`xrpl.js`) are both first-class. Use whichever the developer's project already uses; if there is no existing codebase, ask. Code examples in the [skill reference files](https://github.com/XRPLF/xrpl-dev-portal/tree/master/.claude/skills/xrpl-skills/xrpl-trading) cover both.
- **Transaction submission:** Handled entirely by the XRPL Agent Wallet skill. This skill builds transaction objects; it does not call `submit_and_wait` or `submitAndWait` directly.
- **Signing path:** Determined by the XRPL Agent Wallet skill configuration — env-var (development), external signer (HSM/KMS), or OWS (Open Wallet Standard). See [The XRPL Agent Wallet Skill](/docs/agents/xrpl-agent-wallet-skill/) for setup.
- **Amount handling:** XRP amounts are always strings in drops — use `xrp_to_drops()` / `xrpToDrops()`. Never pass floats or raw XRP values. IOU amounts use `{currency, issuer, value}` objects with `value` as a decimal string.
- **Source tag:** The XRPL Agent Wallet skill automatically applies `SourceTag = 20260530` to every transaction that passes through the signing ceremony. Override by setting `SourceTag` on the transaction object before handoff. Do not omit `SourceTag` — it is required for on-chain attribution.
- **Network:** Testnet (`https://s.altnet.rippletest.net:51234`) by default. Switching to Mainnet is a one-line URL change.
- **Simulate before handoff:** For new trading flows or unfamiliar currency pairs, call `simulate` on the raw transaction object before handing to the Wallet skill. This catches malformed offers, missing trust lines, and reserve errors without spending fees.

---

## Operating procedure

1. **Identify the operation** — `create_offer`, `cancel_offer`, or `get_order_book`. Check the [trading.md reference](https://github.com/XRPLF/xrpl-dev-portal/tree/master/.claude/skills/xrpl-skills/xrpl-trading/references/trading.md) for full patterns and edge cases.
2. **Check prerequisites** — Trust line exists for IOU side of offer? Account has sufficient balance including fees and reserve for a new resting offer? Expiry is in the future?
3. **Show pre-trade summary** — For `create_offer`, always show offer details, mid price, estimated fill, and slippage. Collect user acknowledgement before proceeding.
4. **Build** — Construct the transaction object. Do not set `Fee`, `Sequence`, or `LastLedgerSequence` — the Wallet skill's autofill populates these from the live node.
5. **Run built-in guardrails** — Before handing off, the skill applies pre-flight checks: reserve adequacy, trust line existence, expiry sanity, and flag conflicts. Stop and surface a clear error if any check fails.
6. **Hand off to the Wallet skill** — Pass the transaction object to the XRPL Agent Wallet skill. It will autofill, preview, sign, and submit via `submitAndWait`.
7. **Parse and surface result** — Classify the fill outcome (filled / partial / resting). Surface the offer sequence when a remainder exists on the book. Handle `tec*` errors explicitly — every `tec*` code means a fee was charged with no fill.

---

## What this skill does not do

- **Create wallets or handle keys.** Wallet generation, seed storage, key loading, signing, and all key management belong to the XRPL Agent Wallet skill.
- **Sign or submit transactions.** That is the Wallet skill's responsibility. This skill never calls `submit_and_wait`, `submitAndWait`, or any equivalent directly.
- **Construct non-trading transactions on its own initiative.** The skill responds to developer and user instructions; it does not propose offers unprompted.
- **Retry automatically.** Any `tec*` failure or user cancellation requires explicit user instruction before retrying.

---

## Reference files

The trading skill references these files for full transaction patterns and edge cases:

- [trading.md](https://github.com/XRPLF/xrpl-dev-portal/tree/master/.claude/skills/xrpl-skills/xrpl-trading/references/trading.md) — OfferCreate, OfferCancel, order book patterns, AMM integration, cross-currency flows, agentic patterns, error codes, reserves

---

## Where to go next

- [Getting Started with XRPL Trading](/docs/agents/getting-started-with-xrpl-trading/) — Install the Trading skill and place your first limit order on the XRPL DEX.
- [The XRPL Agent Wallet Skill](/docs/agents/xrpl-agent-wallet-skill/) — Security model, signing ceremony, and key handling patterns including OWS.
- [Decentralized Exchange](/docs/concepts/tokens/decentralized-exchange/) — XRPL DEX concepts: offer matching, quality, and the order book.
- [View AI Tooling](/resources/dev-tools/ai-tools) — The full set of XRPL skills and MCP servers for Claude agents.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
