---
seo:
    title: Getting Started with Agentic Transactions on the XRP Ledger
    description: >
        Install the XRPL Agentic Wallet and Payment skills for Claude, create a testnet
        wallet, and send your first autonomous XRP payment — all in under 30 minutes.
        Step-by-step tutorial with JavaScript (xrpl.js) and Python (xrpl-py) code
        samples and key management guidance.
labels:
    - AI
    - Agents
    - Tutorial
    - Payments
---

# Getting Started with Agentic Transactions on the XRP Ledger

This tutorial walks you through your first autonomous payment session on the XRP Ledger
using Claude. You will install two XRPL skills, create and fund a testnet wallet, send
a payment, and issue a token — all using natural-language prompts, with Claude handling
the blockchain-specific code.

**What you will build:**

- A funded testnet wallet with secure key management
- A confirmed XRP payment between two accounts
- A token (Multi-Purpose Token or trust-line IOU)

**Time to complete:** approximately 30 minutes.

---

## The two skills

Two Claude skills work together to make agentic transactions on the XRP Ledger safe and
straightforward.

| Skill | What it does |
| :---- | :---- |
| **XRPL Agentic Wallet skill** | Handles secure key loading, the signing ceremony, and reliable transaction submission. Every transaction goes through an autofill → preview → confirm → sign → submit flow. The key never leaves its safe place. |
| **XRPL Payment skill** | Gives Claude typed, agent-callable knowledge of XRPL operations: payments, balance checks, account creation, token issuance, trust lines, and more. Without this skill, Claude draws on general training data which may be outdated or imprecise for XRPL-specific tasks. |

These skills are designed to work together. The Payment skill constructs the right
transaction object; the Wallet skill signs and submits it safely. You do not need to
coordinate them manually — Claude handles the handoff.

---

## Step 0: Prerequisites

| Requirement | Notes |
| :---- | :---- |
| **Node.js 18+** or **Python 3.9+** | Code examples are provided in both languages. JavaScript uses xrpl.js; Python uses xrpl-py. |
| **A terminal** | macOS Terminal, iTerm2, Windows Terminal, or VS Code's integrated terminal all work. |
| **An Anthropic account** | Required for Claude.ai and the Claude desktop app. Claude Code can authenticate separately. A free tier is available at [claude.ai](https://claude.ai). |

No prior blockchain experience is required. Install the XRP Ledger SDK for your chosen
language before starting the code steps:

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

<!-- ⚠️ FOLLOW-UP: Confirm minimum xrpl.js version required for MPT support
(Step 7 Option A). Add a version callout if a specific version is needed. -->

---

## Step 1: Set up Claude

Choose the surface that fits how you want to work.

### Option A: Claude Code (recommended for development)

Claude Code runs Claude directly in your terminal alongside your project files. It can
read and write code, run commands, and iterate on your implementation — the best surface
for building and debugging.

Install Claude Code:

```sh
npm install -g @anthropic-ai/claude-code
```

Verify the installation, then authenticate:

```sh
claude --version
claude
```

Follow the prompts to connect your Anthropic account.

<!-- ⚠️ FOLLOW-UP: Confirm the exact install command and minimum Node version with
Anthropic documentation before publishing. Link to the official Claude Code install
guide rather than citing the command standalone. -->

### Option B: Claude.ai or the Claude desktop app

[Claude.ai](https://claude.ai) and the Claude desktop app are better suited for
exploration and one-off questions. You can install skills and run all the prompts in
this tutorial from either surface — you just will not have Claude directly editing files
in your project directory.

<!-- ⚠️ FOLLOW-UP: Confirm whether both XRPL skills are available on Claude.ai and the
desktop app at launch (May 30), or Claude Code only. -->

---

## Step 2: Install the XRPL skills

Install both skills. The Wallet skill is the security layer; the Payment skill is the
knowledge layer. Both are needed for the full tutorial.

```sh
npx skills add xrpl/xrpl-agent-wallet
npx skills add xrpl/xrpl-starter-kit
```

<!-- ⚠️ FOLLOW-UP: Confirm the exact install commands and registry paths for both skills.
The names and paths above are placeholders — replace with confirmed commands before
publishing. Also confirm whether the same commands work for Claude.ai / desktop app,
or whether those surfaces use a settings UI for skill installation. -->

You should see confirmation that each skill loaded. If you see an error, check that you
are running a supported version of Claude Code and that your authentication is current.

---

## Step 2.5: Verify the skills are loaded

Run a quick sanity check before diving into real work. Ask Claude:

```
What XRP Ledger network are you targeting by default, and what is the
base reserve requirement for a new account?
```

If both skills are loaded, Claude should respond with the correct Testnet endpoint and
current base reserve (10 XRP). It should also confirm that it will preview all
transactions before signing.

If Claude gives a vague or incorrect answer, re-run the install commands and try again.

<!-- ⚠️ FOLLOW-UP: Confirm the exact expected output once both Phase 1 skill files are
finalized. Update the sample response to match what the skills actually instruct
Claude to say. -->

---

## Step 3: Generate an account

Ask Claude to create a new XRP Ledger account for testnet. This generates a key pair
and a classic address — no transaction is required yet.

```
Generate a new XRP Ledger testnet account. Show me the classic address and the seed.
```

Claude will produce output similar to the following. If the SDK is not installed, it
will tell you to run the install command first.

{% tabs %}

{% tab label="JavaScript" %}

```js
const xrpl = require('xrpl')

const wallet = xrpl.Wallet.generate()
console.log('Classic address:', wallet.classicAddress)
console.log('Seed           :', wallet.seed) // Store securely — never hardcode in production.
```

{% /tab %}

{% tab label="Python" %}

```python
from xrpl.wallet import Wallet

wallet = Wallet.create()
print(f"Classic address : {wallet.classic_address}")
print(f"Seed            : {wallet.seed}")  # Store securely — never hardcode in production.
```

{% /tab %}

{% /tabs %}

Sample output:

```
Classic address : rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh
Seed            : sEdTM1uX8pu2do5XvTnutH6HsouMaM2
```

Your address and seed will be different. The address is public — safe to share. The
seed is the master secret for this wallet. Treat it accordingly before you continue.

---

## Step 4: Securely store your keys

The XRPL Agentic Wallet skill enforces a key rule: the seed must never appear in code,
logs, chat output, or error messages. Store it before you fund or use the wallet.

### Development: environment variables

For local development, an environment variable is acceptable:

```sh
export XRPL_SEED="sEdTM1uX8pu2do5XvTnutH6HsouMaM2"
```

Read it in code — never hardcode it:

{% tabs %}

{% tab label="JavaScript" %}

```js
const xrpl = require('xrpl')

const wallet = xrpl.Wallet.fromSeed(process.env.XRPL_SEED)
console.log('Loaded address:', wallet.classicAddress)
```

{% /tab %}

{% tab label="Python" %}

```python
import os
from xrpl.wallet import Wallet

wallet = Wallet.from_seed(os.environ["XRPL_SEED"])
print(f"Loaded address: {wallet.classic_address}")
```

{% /tab %}

{% /tabs %}

### Production: a secrets manager or HSM

For anything beyond local experimentation, use a hardware security module (HSM) or a
key management service (KMS) — AWS KMS, Google Cloud KMS, or HashiCorp Vault are common
choices. These provide access controls, audit logs, and rotation support that environment
variables alone do not.

The XRPL Agentic Wallet skill supports an external-signer pattern where the signing key
is held entirely outside the agent process. In this model, a `sign(tx)` method is
provided to the skill; the key never enters your application's memory. Ask Claude to
generate a wallet adapter for your KMS of choice:

```
Generate an XRPL external signer adapter for AWS KMS. The adapter
should implement sign(tx) → { tx_blob, hash } and use secp256k1.
```

For agent wallets that need programmatic spending limits and custody-controlled signing
at the wallet layer, see [AI Tooling](/resources/dev-tools/ai-tools) for recommendations.


**Hard rules — no exceptions:**

- Never commit a seed or private key to a git repository, even a private one.
  Add `.env` and any secrets files to `.gitignore` before your first commit.
- Never paste a seed into Claude, a shared chat, a Slack message, or a support ticket.
  Treat it the same as a password.
- Use testnet accounts for learning. The accounts you create in this tutorial have no
  real-world value. If you later move to Mainnet, generate fresh keys — do not reuse
  testnet seeds.

<!-- ⚠️ FOLLOW-UP: Review this guidance with the security team before publishing. -->


## Step 5: Fund the account from the testnet faucet

Your new account exists as a key pair but is not yet active on the XRP Ledger. An
account becomes active once it receives its base reserve (10 XRP on both Testnet and
Mainnet; the Testnet faucet provides this for free).

Ask Claude to fund your account and verify the balance:

```
Fund the testnet account rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh using the
testnet faucet. Then check the balance.
```

Replace the address with your own. Claude should generate:

{% tabs %}

{% tab label="JavaScript" %}

```js
const xrpl = require('xrpl')

async function main() {
  const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
  await client.connect()

  const wallet = xrpl.Wallet.fromSeed(process.env.XRPL_SEED)

  // client.fundWallet() calls the testnet faucet and returns the funded balance.
  const { balance } = await client.fundWallet(wallet)
  console.log('Address:', wallet.classicAddress)
  console.log('Balance:', balance, 'XRP')

  await client.disconnect()
}
main()
```

{% /tab %}

{% tab label="Python" %}

```python
import requests
from xrpl.clients import JsonRpcClient
from xrpl.models.requests import AccountInfo
from xrpl.utils import drops_to_xrp

TESTNET_URL = "https://s.altnet.rippletest.net:51234"
client = JsonRpcClient(TESTNET_URL)

address = "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh"  # Replace with your address.

faucet_response = requests.post(
    "https://faucet.altnet.rippletest.net/accounts",
    json={"destination": address},
)
print(f"Faucet: {faucet_response.json()}")

response = client.request(AccountInfo(account=address, ledger_index="validated"))
balance = drops_to_xrp(response.result["account_data"]["Balance"])
print(f"Balance: {balance} XRP")
```

{% /tab %}

{% /tabs %}

Sample output:

```
Address : rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh
Balance : 1000 XRP
```

<!-- ⚠️ FOLLOW-UP: Confirm the canonical XRPL testnet explorer URL and add a direct
link to https://testnet.xrpl.org -->


## Step 6: Send a test payment

Create a second account and send a payment between them. This is the core agentic
payment pattern — and the first place the Wallet skill's signing ceremony comes into
play.

```
Create a second testnet account and fund it from the faucet. Then send
10 XRP from my first account (rHb9...) to the new account. Show the
transaction hash and verify the result.
```

Before Claude signs the transaction, the Wallet skill will display a preview:

```
─── XRPL Transaction Preview ───
Network:            testnet
Type:               Payment
From:               rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh
To:                 rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe
Amount:             10 XRP  (10,000,000 drops)
Fee:                0.000012 XRP
Sequence:           48291003
LastLedgerSequence: 48291023  (expires in ~20 ledgers / ~80 seconds)
Memos:              —
─────────────────────────────────
Sign and submit? (yes / no)
```

Review the preview — especially the destination address and amount — before confirming.
After you confirm, Claude signs locally and submits:

{% tabs %}

{% tab label="JavaScript" %}

```js
const xrpl = require('xrpl')

async function main() {
  const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
  await client.connect()

  const sender = xrpl.Wallet.fromSeed(process.env.XRPL_SEED)

  // Create and fund a receiver wallet via the testnet faucet.
  const { wallet: receiver } = await client.fundWallet()
  console.log('Receiver:', receiver.classicAddress)

  // submitAndWait handles autofill, signing, and waiting for validation.
  const result = await client.submitAndWait(
    {
      TransactionType: 'Payment',
      Account: sender.classicAddress,
      Amount: xrpl.xrpToDrops('10'),  // 10 XRP in drops
      Destination: receiver.classicAddress,
    },
    { wallet: sender }
  )

  console.log('Result:', result.result.meta.TransactionResult)
  console.log('Hash  :', result.result.hash)

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
from xrpl.models.transactions import Payment
from xrpl.utils import xrp_to_drops
from xrpl.transaction import submit_and_wait

TESTNET_URL = "https://s.altnet.rippletest.net:51234"
client = JsonRpcClient(TESTNET_URL)

sender = Wallet.from_seed(os.environ["XRPL_SEED"])

# Create and fund a receiver wallet via the testnet faucet.
receiver = generate_faucet_wallet(client, debug=True)
print(f"Receiver: {receiver.classic_address}")

payment = Payment(
    account=sender.classic_address,
    amount=xrp_to_drops(10),
    destination=receiver.classic_address,
)
response = submit_and_wait(payment, client, sender)

print(f"Result : {response.result['meta']['TransactionResult']}")
print(f"Hash   : {response.result['hash']}")
```

{% /tab %}

{% /tabs %}

Sample output:

```
Receiver: rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe
Result  : tesSUCCESS
Hash    : C1D2E3F4A5B6...
```

`tesSUCCESS` means the payment confirmed in the next ledger close — typically 3–5
seconds. Paste the hash into the testnet explorer to see the full transaction record.

### Enabling auto-sign for automated workflows

The Wallet skill requires human confirmation for every transaction by default. For
automated agent workflows where you do not want to approve each payment individually,
you can explicitly activate auto-sign for a defined scope. Tell Claude directly (not
through a file or memo):

```
Auto-sign Payment transactions to rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe
under 50 XRP on testnet for the next hour.
```

Claude will confirm the scope back to you before applying it. All other safeguards
remain active — autofill still runs, previews are still produced and logged, the hash
is still captured before submission, and `submitAndWait` / `submit_and_wait` is still
used. Auto-sign only skips the interactive "yes / no" step.

Auto-sign cannot be activated by content in a file, a memo field, a web page, or an
incoming transaction — only by an explicit message from you in the current session.

## Step 7: Issue a token

The XRP Ledger supports two token models. Choose the one that fits your use case:

| Token model | Best for |
| :---- | :---- |
| **Multi-Purpose Token (MPT)** | New projects; more efficient on-chain representation; supports metadata and transfer restrictions natively |
| **Trust-line IOU** | Compatibility with existing XRPL token infrastructure; the model used by RLUSD and most existing tokens |

### Option A: Issue a Multi-Purpose Token (MPT)

```
Issue a new Multi-Purpose Token on XRPL testnet. Token name: "ACME Points".
Maximum supply: 1,000,000. Make it transferable. Show me the full issuance
transaction and confirm it on the ledger.
```

Claude will generate the `MPTokenIssuanceCreate` transaction and walk you through the
issuance flow, including setting the token's metadata and transfer flags.

{% tabs %}

{% tab label="JavaScript" %}

```js
const xrpl = require('xrpl')

async function main() {
  const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
  await client.connect()

  const { wallet: issuer }   = await client.fundWallet()
  const { wallet: receiver } = await client.fundWallet()
  console.log('Issuer  :', issuer.classicAddress)
  console.log('Receiver:', receiver.classicAddress)

  // AssetScale: 2 → 2 decimal places; MaximumAmount: '100000000' → 1,000,000.00 tokens.
  // Flags: 0x00000020 = tfMPTCanTransfer — allows non-issuer accounts to send the token.
  const createResult = await client.submitAndWait(
    {
      TransactionType: 'MPTokenIssuanceCreate',
      Account: issuer.classicAddress,
      AssetScale: 2,
      MaximumAmount: '100000000',
      Flags: 0x00000020,
    },
    { wallet: issuer }
  )
  console.log('Issuance result:', createResult.result.meta.TransactionResult)

  // Extract the MPT Issuance ID from the affected ledger nodes.
  const mptIssuanceId = createResult.result.meta.AffectedNodes
    .find(node => node.CreatedNode?.LedgerEntryType === 'MPTokenIssuance')
    ?.CreatedNode?.NewFields?.MPTokenIssuanceID
  console.log('MPT Issuance ID:', mptIssuanceId)

  // Send 100.00 tokens (stored as '10000' at scale 2).
  const payResult = await client.submitAndWait(
    {
      TransactionType: 'Payment',
      Account: issuer.classicAddress,
      Destination: receiver.classicAddress,
      Amount: { mpt_issuance_id: mptIssuanceId, value: '10000' },
    },
    { wallet: issuer }
  )
  console.log('Payment result:', payResult.result.meta.TransactionResult)
  console.log('Hash          :', payResult.result.hash)

  await client.disconnect()
}
main()
```

<!-- ⚠️ FOLLOW-UP: Confirm minimum xrpl.js version required for MPTokenIssuanceCreate
and the MPT Payment amount shape above. Update the install note in Step 0 if a specific
version or flag is needed. -->

{% /tab %}

{% tab label="Python" %}

```python
from xrpl.clients import JsonRpcClient
from xrpl.wallet import generate_faucet_wallet
from xrpl.models.transactions import MPTokenIssuanceCreate, Payment
from xrpl.transaction import submit_and_wait

TESTNET_URL = "https://s.altnet.rippletest.net:51234"
client = JsonRpcClient(TESTNET_URL)

issuer   = generate_faucet_wallet(client, debug=True)
receiver = generate_faucet_wallet(client, debug=True)
print(f"Issuer   : {issuer.classic_address}")
print(f"Receiver : {receiver.classic_address}")

# asset_scale=2 → 2 decimal places; maximum_amount="100000000" → 1,000,000.00 tokens.
# tfMPTCanTransfer (0x00000020) allows non-issuer accounts to send the token.
mpt_create = MPTokenIssuanceCreate(
    account=issuer.classic_address,
    asset_scale=2,
    maximum_amount="100000000",
    flags=0x00000020,
)
response = submit_and_wait(mpt_create, client, issuer)
print(f"Issuance result : {response.result['meta']['TransactionResult']}")

# Extract the MPT Issuance ID from the affected ledger nodes.
nodes = response.result["meta"]["AffectedNodes"]
mpt_issuance_id = next(
    node["CreatedNode"]["NewFields"]["MPTokenIssuanceID"]
    for node in nodes
    if node.get("CreatedNode", {}).get("LedgerEntryType") == "MPTokenIssuance"
)
print(f"MPT Issuance ID : {mpt_issuance_id}")

# Send 100.00 tokens (stored as "10000" at scale 2).
payment = Payment(
    account=issuer.classic_address,
    destination=receiver.classic_address,
    amount={"mpt_issuance_id": mpt_issuance_id, "value": "10000"},
)
response = submit_and_wait(payment, client, issuer)
print(f"Payment result  : {response.result['meta']['TransactionResult']}")
print(f"Hash            : {response.result['hash']}")
```

{% /tab %}

{% /tabs %}

Sample output:

```
Issuer   : rNXEkKCxvchQtt4JkMPBHFjhFLQUbYEwzJ
Receiver : rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe
Issuance result : tesSUCCESS
MPT Issuance ID : 000000025B812C9D57731E27A2DA8B9F27B877C1BCD50A
Payment result  : tesSUCCESS
Hash            : E5F6A1B2C3D4...
```

Note that MPT trading on the XRP Ledger DEX is still in development — your token can be
transferred, but it cannot yet be listed or traded on the built-in DEX.

### Option B: Issue a trust-line IOU

```
Set up a new token issuer account on XRPL testnet. Issue a token called
"ACME" with currency code "ACM". Create a trust line from a second account
to accept up to 10,000 ACM. Then send 100 ACM from the issuer to the
second account.
```

{% tabs %}

{% tab label="JavaScript" %}

```js
const xrpl = require('xrpl')

async function main() {
  const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
  await client.connect()

  const { wallet: issuer }   = await client.fundWallet()
  const { wallet: receiver } = await client.fundWallet()
  console.log('Issuer  :', issuer.classicAddress)
  console.log('Receiver:', receiver.classicAddress)

  const CURRENCY = 'ACM'

  // Receiver sets up a trust line to accept ACM from the issuer.
  await client.submitAndWait(
    {
      TransactionType: 'TrustSet',
      Account: receiver.classicAddress,
      LimitAmount: {
        currency: CURRENCY,
        issuer: issuer.classicAddress,
        value: '10000',
      },
    },
    { wallet: receiver }
  )
  console.log('Trust line established.')

  // Issuer sends 100 ACM to the receiver.
  const result = await client.submitAndWait(
    {
      TransactionType: 'Payment',
      Account: issuer.classicAddress,
      Destination: receiver.classicAddress,
      Amount: {
        currency: CURRENCY,
        issuer: issuer.classicAddress,
        value: '100',
      },
    },
    { wallet: issuer }
  )
  console.log('Result:', result.result.meta.TransactionResult)
  console.log('Hash  :', result.result.hash)

  await client.disconnect()
}
main()
```

{% /tab %}

{% tab label="Python" %}

```python
from xrpl.clients import JsonRpcClient
from xrpl.wallet import generate_faucet_wallet
from xrpl.models.transactions import TrustSet, Payment
from xrpl.models.amounts import IssuedCurrencyAmount
from xrpl.transaction import submit_and_wait

TESTNET_URL = "https://s.altnet.rippletest.net:51234"
client = JsonRpcClient(TESTNET_URL)

issuer   = generate_faucet_wallet(client, debug=True)
receiver = generate_faucet_wallet(client, debug=True)
print(f"Issuer   : {issuer.classic_address}")
print(f"Receiver : {receiver.classic_address}")

CURRENCY = "ACM"

trust_set = TrustSet(
    account=receiver.classic_address,
    limit_amount=IssuedCurrencyAmount(
        currency=CURRENCY,
        issuer=issuer.classic_address,
        value="10000",
    ),
)
submit_and_wait(trust_set, client, receiver)
print("Trust line established.")

payment = Payment(
    account=issuer.classic_address,
    amount=IssuedCurrencyAmount(
        currency=CURRENCY,
        issuer=issuer.classic_address,
        value="100",
    ),
    destination=receiver.classic_address,
)
response = submit_and_wait(payment, client, issuer)
print(f"Result : {response.result['meta']['TransactionResult']}")
print(f"Hash   : {response.result['hash']}")
```

{% /tab %}

{% /tabs %}

Sample output:

```
Issuer   : rNXEkKCxvchQtt4JkMPBHFjhFLQUbYEwzJ
Receiver : rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe
Trust line established.
Result   : tesSUCCESS
Hash     : D4E5F6A1B2C3...
```

## Where to go next

You have created an account, funded it, sent a payment, and issued a token — the
foundational primitives for building on the XRP Ledger with an LLM agent.

**Use case guides:**

- [Agentic Payments with X402](/docs/agents/agentic-payments-x402.md) —
  Enable your agent to pay for and monetize HTTP-based services using the X402 protocol
  on the XRP Ledger.

**AI tooling reference:**

- [XRPL Skill Reference](https://github.com/XRPLF/xrpl-dev-portal/tree/master/.claude/skills) — Full reference for the XRPL skills: every function,
  parameter, and convention.
- [AI Tooling](/resources/dev-tools/ai-tools) — MCP servers, Skills files, and other
  AI tools for the XRP Ledger.
- [Agentic Transactions on the XRP Ledger](agentic-transactions.tsx) —
  The canonical page for the Agentic Transactions on XRPL including an overview and the broader architecture.

**Go deeper on XRP Ledger features:**

- [Decentralized Exchange (DEX)](/docs/concepts/tokens/decentralized-exchange/) — Trade
  fungible tokens (IOU) natively on the XRP Ledger. Note: MPT trading on the DEX is
  still in development.
- [Escrow](/docs/concepts/payment-types/escrow/) — Lock XRP or tokens until a time
  condition or cryptographic condition is met.
- [Automated Market Maker (AMM)](/docs/concepts/tokens/decentralized-exchange/automated-market-makers/) —
  Provide liquidity and earn fees on the built-in AMM.
- [Payment Channels](/docs/concepts/payment-types/payment-channels/) — High-throughput
  micropayment streams with on-chain settlement.

**SDK references:**

- [xrpl.js documentation](https://js.xrpl.org/) — JavaScript/TypeScript SDK reference.
- [xrpl-py documentation](https://xrpl-py.readthedocs.io/) — Python SDK reference.

{% raw-partial file="/docs/_snippets/common-links.md" /%}