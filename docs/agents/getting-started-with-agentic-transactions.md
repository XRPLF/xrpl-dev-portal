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

| Skill | Role | What it does |
| :---- | :---- | :---- |
| **XRPL Agent Wallet** | Shared foundation | Handles key loading, the signing ceremony (autofill → preview → confirm → sign → submit), and reliable submission. Used by every XRPL agent skill. |
| **XRPL Payments** | Domain skill | Gives Claude accurate, up-to-date knowledge of XRPL payment operations: XRP and token payments, trust lines, escrow, agentic best practices, and error handling. |

The Payments skill constructs the right transaction object; the Wallet skill
signs and submits it safely. Claude coordinates the handoff — you do not need to
manage it manually. Other domain skills (trading, and more) follow the same
pattern and work with the same Wallet skill.

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

## Step 1: Install the skills

`npx` is an open source command-line tool by Vercel that acts as the "package manager" for the open AI Agent Skills ecosystem.

```sh
npx skills add https://github.com/XRPLF/xrpl-dev-portal/tree/master/.claude/skills/xrpl-skills/xrpl-agent-wallet --agent claude-code
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

You can also verify that both skills are loaded by asking Claude:

```
What XRPL network are you targeting by default, and what is the base
reserve for a new account?
```

Claude should confirm the Testnet endpoint, the 1 XRP base reserve, and that
it will preview all transactions before signing. If the response is vague,
re-run the install commands.

---

## Step 2: Generate an account

```
Generate a new XRP Ledger testnet account. Show me the classic address and
the seed.
```

{% tabs %}
{% tab label="JavaScript" %}
```js
const xrpl = require('xrpl')
const wallet = xrpl.Wallet.generate()
console.log('Address:', wallet.classicAddress)
console.log('Seed   :', wallet.seed)  // Store securely — see Step 3.
```
{% /tab %}
{% tab label="Python" %}
```python
from xrpl.wallet import Wallet
wallet = Wallet.create()
print(f"Address : {wallet.classic_address}")
print(f"Seed    : {wallet.seed}")  # Store securely — see Step 3.
```
{% /tab %}
{% /tabs %}

Your address is public — safe to share. Your seed is the master secret for this
wallet. Store it before you continue.

---

## Step 3: Secure your keys

The XRPL Agent Wallet skill enforces one rule without exception: the seed must
never appear in code, logs, chat output, or error messages.

**For local development**, store the seed in a `.env` file and load it with
`dotenv`:

```sh
# .env  — never commit this file
XRPL_SEED="sYourSeedHere"
```

Create the file and add it to `.gitignore` before your first commit:

```sh
echo "XRPL_SEED=" > .env
echo ".env" >> .gitignore
```

Then load it at runtime:

```sh
# Terminal (one-time, for the current shell session)
export $(cat .env | xargs)
```

{% tabs %}
{% tab label="JavaScript" %}
```js
const wallet = xrpl.Wallet.fromSeed(process.env.XRPL_SEED)
```
{% /tab %}
{% tab label="Python" %}
```python
import os
from xrpl.wallet import Wallet
wallet = Wallet.from_seed(os.environ["XRPL_SEED"])
```
{% /tab %}
{% /tabs %}

**For production**, use a KMS or HSM (AWS KMS, GCP KMS, HashiCorp Vault). The
Wallet skill supports an external-signer pattern where the key never enters the
agent's process memory at all. See
[The XRPL Agent Wallet Skill](/docs/agents/xrpl-agent-wallet-skill/)
for the full external-signer interface.

**Hard rules — no exceptions:**

- Never commit a seed to a git repository, even a private one. Add `.env` to
  `.gitignore` before your first commit.
- Never paste a seed into Claude, a Slack message, or a support ticket.
- Use testnet accounts for learning. If you later move to Mainnet, generate
  fresh keys — never reuse testnet seeds on Mainnet.

---

## Step 4: Fund the account

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
from xrpl.clients import JsonRpcClient
from xrpl.wallet import generate_faucet_wallet

client = JsonRpcClient("https://s.altnet.rippletest.net:51234")
wallet = generate_faucet_wallet(client, wallet, debug=True)
print(f"Address : {wallet.classic_address}")
print(f"Balance : { balance } XRP")  # Testnet faucet provides 1000 XRP
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
─────────────────────────────────────────────────────────────────────
Sign and submit? (yes / no)
```

Review the destination address and amount carefully, then type **yes**. After
confirmation:

{% tabs %}
{% tab label="JavaScript" %}
```js
const result = await client.submitAndWait(
  {
    TransactionType: 'Payment',
    Account: sender.classicAddress,
    Amount: xrpl.xrpToDrops('10'),
    Destination: receiver.classicAddress,
    SourceTag: 20260530,  // tag every agentic transaction for on-chain tracking
  },
  { wallet: sender }
)
console.log('Result:', result.result.meta.TransactionResult)
console.log('Hash  :', result.result.hash)
```
{% /tab %}
{% tab label="Python" %}
```python
from xrpl.models.transactions import Payment
from xrpl.utils import xrp_to_drops
from xrpl.transaction import submit_and_wait

payment = Payment(
    account=sender.classic_address,
    destination=receiver.classic_address,
    amount=xrp_to_drops(10),
    source_tag=20260530,  # tag every agentic transaction for on-chain tracking
)
response = submit_and_wait(payment, client, sender)
print(f"Result : {response.result['meta']['TransactionResult']}")
print(f"Hash   : {response.result['hash']}")
```
{% /tab %}
{% /tabs %}

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
  Security model, signing ceremony, key handling patterns, and production setup.
- [The XRPL Payments Skill](/docs/agents/xrpl-payments-skill/) —
  Full reference for payment patterns, RLUSD, trust lines, escrow, and agentic best practices.

**Use case guides**

- [Agentic Payments with X402](/docs/agents/agentic-payments-x402/) —
  Enable your agent to pay for and monetize HTTP-based services autonomously.

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