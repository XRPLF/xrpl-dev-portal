---
seo:
    title: The XRPL Payments Skill
    description: >
        The XRPL Payments skill gives Claude accurate, up-to-date knowledge of
        XRP Ledger payment operations — XRP and RLUSD payments, trust lines,
        cross-currency payments, escrow, agentic best practices, and error
        handling. Works with the XRPL Agent Wallet skill to sign and submit.
labels:
    - AI
    - Agents
    - Payments
---

# The XRPL Payments Skill

The XRPL Payments skill is the domain knowledge layer for payment operations on
the XRP Ledger. It gives Claude accurate, up-to-date knowledge of XRPL payment
patterns so it can construct the right transaction object for any payment task —
XRP transfers, RLUSD, cross-currency, escrow, and more.

The skill constructs transactions. The
[XRPL Agent Wallet skill](/docs/agents/xrpl-agent-wallet-skill/)
signs and submits them. Both are required for a complete agentic payment
workflow.

---

## What the skill covers

| Area | What it knows |
| :---- | :---- |
| **Account setup** | Wallet generation, faucet funding, balance checks, loading from environment variables |
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
| **XRPL Agent Wallet** | Required — signs and submits every transaction the Payments skill constructs |

The Payments skill is one of a growing set of XRPL domain skills. All domain
skills pair with the same shared Wallet skill. See
[AI Tooling](/resources/dev-tools/ai-tools) for the full list.

---

## Default behaviour

- **Primary language:** Python (`xrpl-py`). JavaScript (`xrpl.js`) equivalents
  are included throughout.
- **Submission:** Always `submit_and_wait` / `submitAndWait` — never bare
  `submit`.
- **Amount handling:** Always `xrp_to_drops()` / `xrpToDrops()`. Raw XRP
  floats are never passed to the ledger.
- **Network:** Testnet by default. Switching to Mainnet is a one-line URL
  change.
- **Agent tagging:** `SourceTag` is set on every agent-initiated transaction.
  This enables on-chain volume tracking and separates agentic activity from
  human-initiated transactions.
- **Simulate before submit:** For new payment flows, the skill calls `simulate`
  before spending fees. This catches malformed transactions, missing trust
  lines, and reserve errors without touching the ledger.

---

## What this skill does not do

- **Sign or submit transactions.** That is the Wallet skill's responsibility.
- **Construct non-payment transactions on its own initiative.** The skill
  responds to developer and user instructions; it does not propose transactions
  unprompted.
- **Guarantee RLUSD issuer addresses are current.** Issuer addresses are
  included as a reference but should be confirmed at
  [xrpl.org/docs](https://xrpl.org/docs) before production use.

---

## Where to go next

- [Get Started with Agentic Transactions](/docs/agents/getting-started-with-agentic-transactions/) —
  Install both skills, create a wallet, and send your first payment.
- [The XRPL Agent Wallet Skill](/docs/agents/xrpl-agent-wallet-skill/) —
  The shared signing layer that pairs with this skill.
- [Agentic Payments with X402](/docs/agents/agentic-payments-x402/) —
  Use the Payments skill to build an X402 machine-to-machine payment flow.
- [AI Tooling](/resources/dev-tools/ai-tools) —
  All available XRPL skills and MCP servers for Claude agents.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
