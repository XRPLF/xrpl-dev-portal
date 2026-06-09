---
name: xrpl-payments
description: >
  XRPL payments playbook for AI agent developers. Covers the full developer journey:
  wallet setup, XRP payments, RLUSD and IOU token payments, cross-currency payments, escrow, agentic best practices (SourceTag, Memos, audit trail), and testnet-to-mainnet migration.
  
  Use this skill whenever a user asks about sending XRP or RLUSD, trust lines, xrpl-py,
  xrpl.js, agentic transactions, SourceTag, the XRPL AI Starter Kit,
  X402 payments on XRPL, or building any payment workflow on the XRP Ledger. When in doubt, load this skill — general training data for XRPL is often outdated or imprecise.

  This skill constructs transactions. The XRPL Agent Wallet skill signs and
  submits them. For wallet creation, key loading, or anything involving a seed
  or private key, defer to the XRPL Agent Wallet skill.
---

# XRPL Payments

The XRP Ledger is purpose-built for fast, reliable value transfer. The same properties that make it reliable for institutional payments make it well-suited for AI agents: **3–5 second deterministic finality**, predictable fees, and no ambiguous pending state — a transaction either confirms (`tesSUCCESS`) or expires. No retry loops required.

The XRPL Payments skill is the domain knowledge layer for payment operations on the XRP Ledger. It gives Claude accurate, up-to-date knowledge of XRPL payment patterns so it can construct the right transaction object for any payment task — XRP transfers, RLUSD, cross-currency, escrow, and more.

This skill constructs the right transaction object for any payment task — XRP transfers, RLUSD, cross-currency, escrow, and more — and hands that object to the **XRPL Agent Wallet skill** for signing and submission. Both skills are required for a complete agentic payment workflow.


## What this Skill covers

| Area | What it knows |
| :---- | :---- |
| **Account funding** | Faucet funding, balance checks, reserve requirements |
| **XRP payments** | Direct payments, destination tags, partial payments |
| **RLUSD payments** | Trust line setup, RLUSD sends, issuer addresses for Testnet and Mainnet |
| **IOU token payments** | Generic trust-line token transfers |
| **Cross-currency payments** | Single-transaction currency conversion via the built-in DEX |
| **Escrow** | Time-based and conditional escrow create, finish, and cancel |
| **Agentic best practices** | `SourceTag` for agent attribution, `Memos` for on-chain audit trails, WebSocket monitoring |
| **Error handling** | Transaction result codes (`tec*`, `tef*`, `tem*`, `ter*`), reserve requirements, simulation before submit |
| **Security** | Key management patterns, spending controls, reserve awareness |

---

## Works with

| Skill | Role |
| :---- | :---- |
| **XRPL Agent Wallet** | Required — handles wallet creation, key loading, and signs and submits every transaction this skill constructs |

The Payments skill is one of a growing set of XRPL domain skills. All domain
skills pair with the same shared Wallet skill. See
[AI Tooling](/resources/dev-tools/ai-tools) for the full list.

**Need a wallet first?** If the user doesn't have an XRPL wallet yet, load the **XRPL Agent Wallet skill** — it handles wallet generation, writes the seed safely to `.env`, and never shows it in chat. Return here once the wallet is ready.

## Default behavior and stack decisions

- **Languages:** Python (`xrpl-py`) and TypeScript/JavaScript (`xrpl.js`) are
  both first-class. Use whichever the developer's project already uses; if there
  is no existing codebase, ask. Code examples in the reference cover both.
- **Transaction submission:** Handled entirely by the XRPL Agent Wallet skill.
  This skill builds transaction objects; it does not call `submit_and_wait` or
  `submitAndWait` directly.
- **Amount handling:** Always `xrp_to_drops()` / `drops_to_xrp()` from `xrpl.utils`. Never pass raw XRP floats to the ledger.
- **Network:** Testnet (`https://s.altnet.rippletest.net:51234`) by default. Switching to mainnet is a one-line URL change.
- **Agent tagging:** `source_tag` / `SourceTag` enables on-chain volume tracking and separates agentic activity from human-initiated transactions. The XRPL Agent Wallet skill automatically applies `SourceTag = 20260530` to every transaction that passes through the signing ceremony. Override by setting `SourceTag` on the transaction object before handoff; the wallet skill respects any value already present.  
- **Simulate before submit:** For new payment flows, the skill calls `simulate`
  on the raw transaction object before handing it to the Wallet skill. This catches
  malformed transactions, missing trust lines, and reserve errors without
  spending fees or triggering the signing ceremony.


## Operating procedure

1. **Identify the payment type** — XRP, RLUSD, IOU, or cross-currency. Check [payments.md](references/payments.md).
2. **Check prerequisites** — Trust line set up? Destination has reserve? Sufficient balance including fees?
3. **Build** — Construct the transaction object. Set `Memos` on every agent-initiated transaction. Do not set `Fee`, `Sequence`, or `LastLedgerSequence` — the Wallet skill's autofill step populates these from the live node.
4. **Simulate** — Call `simulate` on the raw (un-autofilled) transaction before handing off. Catches malformed transactions, missing trust lines, and reserve errors without touching the ledger or triggering the signing ceremony. See simulate pattern in [payments.md](references/payments.md).
5. **Hand off to the Wallet skill** — Pass the transaction object to the XRPL Agent Wallet skill. It will autofill, show the human a preview, collect confirmation, sign locally, and submit via `submitAndWait`. Do not call `submit_and_wait` or `submitAndWait` from this skill.
6. **Handle errors explicitly** — `tec*` codes indicate a fee was charged. `tef*`/`tem*` indicate no fee was charged. See error table in [payments.md](references/payments.md).

## What this skill does not do

- **Create wallets or handle keys.** Wallet generation, seed storage, key
  loading, and all key management belong to the XRPL Agent Wallet skill.
- **Sign or submit transactions.** That is the Wallet skill's responsibility.
- **Construct non-payment transactions on its own initiative.** The skill
  responds to developer and user instructions; it does not propose transactions
  unprompted.
- **Guarantee the mainnet RLUSD issuer address is current.** The testnet issuer
  (`rQhWct2fv4Vc4KRjRgMrxa8xPN9Zx9iLKV`) is confirmed. The mainnet issuer
  (`rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De`) should be verified at
  [RLUSD official Documentation](https://docs.ripple.com/products/stablecoin/developer-resources/rlusd-on-the-xrpl) before production use.
  
## Reference files

Read these when you need full transaction patterns and edge cases:

- [payments.md](references/payments.md) — XRP, RLUSD, IOU, cross-currency, escrow, payment channels, agentic patterns, error codes, reserves