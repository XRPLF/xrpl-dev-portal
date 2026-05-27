---
name: xrpl-payments
description: >
  XRPL payments playbook for AI agent developers. Covers the full developer journey:
  wallet setup, XRP payments, RLUSD and IOU token payments, cross-currency payments, escrow,
  agentic best practices (SourceTag, Memos, audit trail), and testnet-to-mainnet migration.
  Use this skill whenever a user asks about sending XRP or RLUSD, trust lines, xrpl-py,
  xrpl.js, wallet setup on XRPL, agentic transactions, SourceTag, the XRPL AI Starter Kit,
  X402 payments on XRPL, or building any payment workflow on the XRP Ledger. When in doubt,
  load this skill — general training data for XRPL is often outdated or imprecise.
---

# XRPL Payments

The XRP Ledger is purpose-built for fast, reliable value transfer. The same properties that make it reliable for institutional payments make it well-suited for AI agents: **3–5 second deterministic finality**, predictable fees, and no ambiguous pending state — a transaction either confirms (`tesSUCCESS`) or expires. No retry loops required.

## What this Skill covers

| Task | Description |
|------|-------------|
| Account setup | Generate wallets, fund from faucet, check balance, load from env |
| XRP payments | Direct payments, destination tags, partial payments |
| RLUSD payments | Trust line setup, RLUSD sends, issuer addresses |
| IOU token payments | Generic trust-line tokens |
| Cross-currency payments | Single-transaction currency conversion via built-in DEX |
| Escrow | Time-based and conditional escrow create/finish/cancel |
| Agentic patterns | SourceTag, Memos, audit trail, WebSocket monitoring |
| Error handling | Transaction result codes, common failure modes |
| Security | Key management, spending controls, reserve awareness |

## Default stack decisions

- **Primary SDK:** `xrpl-py` (Python). JS/TS equivalent: `xrpl.js`. Both are covered in the reference.
- **Transaction submission:** Always `submit_and_wait` — never bare `submit`. It blocks until the tx confirms or expires.
- **Amount handling:** Always `xrp_to_drops()` / `drops_to_xrp()` from `xrpl.utils`. Never pass raw XRP floats to the ledger.
- **Network:** Start on testnet (`https://s.altnet.rippletest.net:51234`). Switching to mainnet is a one-line URL change.
- **Key storage:** Env vars for development, KMS/HSM for production. Never hardcode seeds.
- **Agent tagging:** Set `source_tag` on every agentic transaction (32-bit uint). Enables on-chain volume tracking.

## Operating procedure

1. **Identify the payment type** — XRP, RLUSD, IOU, or cross-currency. Check [payments.md](references/payments.md).
2. **Check prerequisites** — Trust line set up? Destination has reserve? Sufficient balance including fees?
3. **Build** — Construct the transaction object. Set `source_tag` and `Memos` on every agent-initiated transaction.
4. **Simulate** — Call `simulate` before spending fees. Catches malformed transactions, missing trust lines, and reserve errors without touching the ledger. See simulate pattern in [payments.md](references/payments.md).
5. **Submit** — Use `submit_and_wait`. Check `meta.TransactionResult == "tesSUCCESS"`.
6. **Handle errors explicitly** — `tec*` codes indicate a fee was charged. `tef*`/`tem*` indicate no fee was charged. See error table in [payments.md](references/payments.md).

## Reference files

Read these when you need full transaction patterns and edge cases:

- [payments.md](references/payments.md) — XRP, RLUSD, IOU, cross-currency, escrow, payment channels, agentic patterns, error codes, reserves