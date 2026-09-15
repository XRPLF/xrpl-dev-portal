---
seo:
    title: Getting Started with Agentic Transactions on the XRP Ledger
    description: >
        Install the XRPL Agent Wallet and Payments skills for Claude, create a
        funded testnet wallet, and send your first autonomous XRP payment — in
        under 30 minutes.
labels:
    - AI
    - Agents
    - Tutorial
    - Payments
---

# Getting Started with Agentic Transactions on the XRP Ledger

This tutorial walks you through your first autonomous payment session on the XRP
Ledger using Claude. You will install two XRPL skills, create and fund a testnet
wallet, and send a payment — all driven by natural-language prompts.

**What you will build:** a funded testnet wallet and a confirmed XRP payment.

**Time to complete:** approximately 30 minutes.

---

## The two skills

XRPL agent skills are layered: one shared foundation, one domain skill per use
case. This tutorial uses the payments combination.

| Skill | Role | When it applies |
| :---- | :---- | :---- |
| **XRPL Agent Wallet** | Shared foundation | From the start — owns wallet creation, key loading, and the full signing ceremony (autofill → preview → confirm → sign → submit). Installed first. |
| **XRPL Payments** | Domain skill | At transaction time — gives Claude accurate knowledge of XRPL payment operations: XRP and token payments, trust lines, escrow, agentic best practices, and error handling. |

The Wallet skill owns the wallet from day one, including first-time setup. The
Payments skill constructs the right transaction object; the Wallet skill signs
and submits it. Claude coordinates the handoff — you do not need to manage it
manually.

**Domain skills are interchangeable.** Every one of them pairs with the same
Wallet skill and hands off at the same boundary, so once you have completed this
tutorial you can add another without redoing any wallet setup. The
[XRPL Trading skill](/docs/agents/xrpl-trading-skill/) is the other one
available today — see [Getting Started with XRPL DEX Trading](/docs/agents/getting-started-with-xrpl-trading/),
which reuses the wallet you are about to create.

**Evaluating before you build?** Read [The XRPL Agent Wallet Skill](/docs/agents/xrpl-agent-wallet-skill/) first — it covers the security model and the eight guarantees the skill enforces on every transaction.

---

## Prerequisites

| Requirement | Notes |
| :---- | :---- |
| **Node.js 18+** or **Python 3.9+** | Code samples are provided in both languages. |
| **Claude Code** | Recommended for development — runs Claude in your terminal alongside your project files. |
| **An Anthropic account** | Free tier available at [claude.ai](https://claude.ai). |

Install the XRP Ledger SDK for your language:

{% tabs %}
{% tab label="JavaScript" %}
```sh
npm install xrpl
```
{% /tab %}
{% tab label="Python" %}
```sh
pip install xrpl-py
```
{% /tab %}
{% /tabs %}

---

## Step 1: Install the Wallet skill

Install the Wallet skill first. It owns wallet setup and security from the
start — including generating your first wallet without exposing the seed.

Note: `npx` is an open source command-line tool by Vercel that acts as the "package manager" for the open AI Agent Skills ecosystem.

```sh
npx skills add https://github.com/XRPLF/xrpl-dev-portal/tree/master/.claude/skills/xrpl-skills/xrpl-agent-wallet --agent claude-code
```

---

## Step 2: Generate and secure your wallet

Ask Claude to create a wallet. The Wallet skill writes the seed directly to
`.env` — it never appears in chat.

```
Generate a new XRPL testnet wallet and save the seed securely.
```

Claude will confirm:

```
✓ Wallet created.
Address : rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh
Seed    : saved to .env as XRPL_SEED — never shown in chat
```

The skill also adds `.env` to `.gitignore` automatically if a git repo is
detected. Your address is public and safe to share. The seed never leaves
`.env`.

**If you already have a wallet**, add the seed to `.env` manually:

```sh
echo 'XRPL_SEED="sYourExistingSeedHere"' > .env
echo ".env" >> .gitignore
```

**For production**, do not keep the seed in an environment variable. The Wallet
skill supports two alternatives: an **external signer**, where a KMS, HSM, or
hardware wallet holds the key and it never enters the agent's process memory;
and **OWS** (Open Wallet Standard), a local policy-gated vault that evaluates
revocable, scoped agent credentials before it decrypts anything — macOS and
Linux only. See [The XRPL Agent Wallet Skill](/docs/agents/xrpl-agent-wallet-skill/)
for the full external-signer interface and the decision guide between all three
signing paths.

---

## Step 3: Install the Payments skill

With your wallet secured, add the Payments skill for XRPL transaction knowledge:

```sh
npx skills add https://github.com/XRPLF/xrpl-dev-portal/tree/master/.claude/skills/xrpl-skills/xrpl-payments --agent claude-code
```

Verify that your skill has been installed correctly by asking Claude to list skills: 

```
/skills
```

You should see both the skills listed along with any other skills you may have installed previously.

```
Project skills (.claude/skills)                                
  xrpl-agent-wallet                                                                      
  xrpl-payments 
```

Verify both skills are loaded:

```
What XRPL network are you targeting by default, and what is the base
reserve for a new account?
```

Claude should confirm the Testnet endpoint, the 1 XRP base reserve, and that
it will preview all transactions before signing. If the response is vague,
re-run the install commands.

---

## Step 4: Fund your wallet

Ask Claude to fund your account from the Testnet faucet and verify the balance:

```
Fund the testnet account rYourAddressHere from the faucet, then check
the balance.
```

{% tabs %}
{% tab label="JavaScript" %}
```js
const xrpl = require('xrpl')
async function main() {
  const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
  await client.connect()
  const wallet = xrpl.Wallet.fromSeed(process.env.XRPL_SEED)
  const { balance } = await client.fundWallet(wallet)
  console.log('Balance:', balance, 'XRP')
  await client.disconnect()
}
main()
```
{% /tab %}
{% tab label="Python" %}
```python
import os
from xrpl.clients import JsonRpcClient
from xrpl.wallet import Wallet, generate_faucet_wallet
from xrpl.account import get_balance

client = JsonRpcClient("https://s.altnet.rippletest.net:51234")

# Load the wallet you saved to .env, then fund that existing account.
wallet = Wallet.from_seed(os.environ["XRPL_SEED"])
generate_faucet_wallet(client, wallet=wallet)

balance_drops = get_balance(wallet.address, client)
print(f"Address : {wallet.address}")
print(f"Balance : {balance_drops / 1_000_000} XRP")
```
{% /tab %}
{% /tabs %}

The account is now active on the ledger. An XRPL account requires a minimum
balance of 1 XRP (the base reserve) to exist — the faucet covers this.

---

## Step 5: Send a payment

Create a second account and send a payment between them. This is where the
Wallet skill's signing ceremony comes into play.

```
Create a second funded testnet account, then send 10 XRP from my first
account to it. Show the transaction hash and confirm the result.
```

Before Claude signs anything, the Wallet skill displays a preview:

```
─── XRPL Transaction Preview ────────────────────────────────────────
Network           : testnet
Type              : Payment
From              : rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh
To                : rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe
Amount            : 10 XRP (10,000,000 drops)
Fee               : 0.000012 XRP (12 drops)
Sequence          : 48291003
LastLedgerSequence: 48291023  (expires in ~20 ledgers, ~80 seconds)
Flags             : 0
Memos             : —
Other fields      : —
─────────────────────────────────────────────────────────────────────
Sign and submit? (yes / no)
```

Review the destination address and amount carefully, then type **yes**.

The transaction object the Payments skill hands over — note that it sets no
`Fee`, `Sequence`, `LastLedgerSequence`, or `SourceTag`, because the Wallet skill
fills those in during the ceremony:

{% tabs %}
{% tab label="JavaScript" %}
```js
const payment = {
  TransactionType: 'Payment',
  Account:     'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',   // your funded account from Step 4
  Destination: 'rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe',   // the second account Claude created
  Amount:      xrpl.xrpToDrops('10'),                  // "10000000" drops
  // Fee, Sequence, LastLedgerSequence: set by Wallet skill autofill
  // SourceTag: applied by Wallet skill (20260530) automatically
}
// → hand to XRPL Agent Wallet skill
```
{% /tab %}
{% tab label="Python" %}
```python
from xrpl.models.transactions import Payment
from xrpl.utils import xrp_to_drops

payment = Payment(
    account="rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",      # your funded account from Step 4
    destination="rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe",  # the second account Claude created
    amount=xrp_to_drops(10),                           # "10000000" drops
    # Fee, Sequence, LastLedgerSequence: set by Wallet skill autofill
    # source_tag: applied by Wallet skill (20260530) automatically
)
# → hand to XRPL Agent Wallet skill
```
{% /tab %}
{% /tabs %}

You never call `submitAndWait` yourself. The Wallet skill autofills the
transaction, shows you the preview above, signs after your confirmation, records
the hash *before* submitting, and then submits — so a crashed process can be
reconciled against the ledger instead of paying the fee twice.

After signing, Claude reports the result:

```
Result  : tesSUCCESS
Hash    : A3F9B2C1D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D2E3F4A5B6C7D8E9F0A1
Ledger  : 48291024 (validated)
Fee paid: 12 drops (0.000012 XRP)
```

`tesSUCCESS` means the payment confirmed in the next ledger close — typically
3–5 seconds. Paste the hash into the
[Testnet explorer](https://testnet.xrpl.org) to see the full record.

### Enabling auto-sign for automated workflows

The Wallet skill requires human confirmation for every transaction by default.
For automated agent runs, activate auto-sign with an explicit, scoped
instruction — typed directly in chat (not through a file or memo):

```
Auto-sign Payment transactions to rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe
under 50 XRP on testnet for the next hour.
```

Claude echoes the scope back and waits for confirmation before applying it.
Auto-sign skips the interactive yes/no step only — autofill, preview, hash
capture, and `submitAndWait` all still run on every transaction.

---

## Where to go next

**Skill reference**

- [The XRPL Agent Wallet Skill](/docs/agents/xrpl-agent-wallet-skill/) —
  Security model, signing ceremony, key handling patterns, and production setup including OWS.
- [The XRPL Payments Skill](/docs/agents/xrpl-payments-skill/) —
  Full reference for payment patterns, RLUSD, trust lines, escrow, and agentic best practices.
- [The XRPL Trading Skill](/docs/agents/xrpl-trading-skill/) —
  Offer semantics, flag behaviour, AMM interaction, fill classification, and error codes.

**Use case guides**

- [Getting Started with XRPL DEX Trading](/docs/agents/getting-started-with-xrpl-trading/) — Reuse the wallet you just created to place your first autonomous limit order on the XRPL DEX.
- [Agentic Payments with X402](/docs/agents/agentic-payments-x402/) — Enable your agent to pay for and monetize HTTP-based services autonomously.
- [Track and Measure Agent Behavior](/docs/agents/track-agent-behavior/) — Use SourceTag, Memos, and WebSocket monitoring to attribute and audit every agent transaction.

**Go deeper on XRPL features**

- [Escrow](/docs/concepts/payment-types/escrow/) — Lock XRP or tokens until a time
  or cryptographic condition is met.
- [Decentralized Exchange](/docs/concepts/tokens/decentralized-exchange/) — Trade
  tokens natively on-chain.
- [Payment Channels](/docs/concepts/payment-types/payment-channels/) —
  High-throughput micropayment streams with on-chain settlement.

**SDK references**

- [xrpl.js documentation](https://js.xrpl.org/)
- [xrpl-py documentation](https://xrpl-py.readthedocs.io/)

{% raw-partial file="/docs/_snippets/common-links.md" /%}