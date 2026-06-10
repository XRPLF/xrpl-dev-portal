# Payments, Escrow & Agentic Patterns

> **Architecture note — who submits.** In the two-skill setup, this Payments
> skill *constructs* the transaction object; the **XRPL Agent Wallet skill**
> owns the final steps — autofill, human preview, local signing, and
> `submitAndWait`. The `submit_and_wait` / `submitAndWait` (and the `autofill`
> in the simulate example) shown below are included so each snippet runs
> standalone for a developer exploring the API. In the agentic flow, stop at
> object construction and hand the object to the Wallet skill instead of calling
> `submit_and_wait` yourself. See the Wallet skill for the signing ceremony.

## The build -> hand-off flow

This is the shape of every agentic payment in the two-skill setup: this skill
builds the object and stops; the Wallet skill does everything after.

```python
# 1. This skill: construct the transaction object.
from xrpl.models.transactions import Payment
from xrpl.utils import xrp_to_drops

payment = Payment(
    account=wallet.address,
    destination="rDestinationAddress",
    amount=xrp_to_drops(25),
    source_tag=AGENT_SOURCE_TAG,
)

# 2. Hand `payment` to the XRPL Agent Wallet skill, which runs the ceremony:
#       autofill -> preview to the human -> confirm -> sign locally -> submitAndWait
#    Do NOT autofill, sign, or submit here.
```

```typescript
// 1. This skill: construct the transaction object.
import { Payment, xrpToDrops } from "xrpl";

const payment: Payment = {
  TransactionType: "Payment",
  Account: wallet.address,
  Destination: "rDestinationAddress",
  Amount: xrpToDrops("25"),
  SourceTag: AGENT_SOURCE_TAG,
};

// 2. Hand `payment` to the XRPL Agent Wallet skill, which autofills, previews,
//    signs locally, and submitAndWaits. Do NOT autofill, sign, or submit here.
```

## Account Setup

### Generate and fund a testnet wallet

```python
from xrpl.clients import JsonRpcClient
from xrpl.wallet import generate_faucet_wallet

TESTNET_URL = "https://s.altnet.rippletest.net:51234"
client = JsonRpcClient(TESTNET_URL)

wallet = generate_faucet_wallet(client, debug=True)
print(f"Address : {wallet.address}")
# Persist wallet.seed to a secret store (e.g. .env / KMS) — never print or log it.
# Wallet generation and key handling belong to the XRPL Agent Wallet skill.
```

```typescript
import { Client, Wallet } from "xrpl";

const client = new Client("wss://s.altnet.rippletest.net:51233");
await client.connect();
const { wallet } = await client.fundWallet();
console.log("Address:", wallet.address);
// Persist wallet.seed to a secret store (e.g. .env / KMS) — never print or log it.
// Wallet generation and key handling belong to the XRPL Agent Wallet skill.
await client.disconnect();
```

### Load a wallet from an environment variable

```python
import os
from xrpl.wallet import Wallet

wallet = Wallet.from_seed(os.environ["XRPL_SEED"])
```

```typescript
const wallet = Wallet.fromSeed(process.env.XRPL_SEED!);
```

### Check balance

```python
from xrpl.models.requests import AccountInfo
from xrpl.utils import drops_to_xrp

response = client.request(AccountInfo(account=wallet.address, ledger_index="validated"))
balance_xrp = drops_to_xrp(response.result["account_data"]["Balance"])
print(f"Balance: {balance_xrp} XRP")
```

```typescript
const response = await client.request({
  command: "account_info",
  account: wallet.address,
  ledger_index: "validated",
});
const balanceXRP = Number(response.result.account_data.Balance) / 1_000_000;
console.log("Balance:", balanceXRP, "XRP");
```

### Get transaction status

```python
from xrpl.models.requests import Tx

response = client.request(Tx(transaction="<tx_hash>"))
result = response.result["meta"]["TransactionResult"]
# tesSUCCESS = confirmed; anything else = failed
```

---

## XRP Payments

### Direct payment

```python
from xrpl.models.transactions import Payment
from xrpl.utils import xrp_to_drops
from xrpl.transaction import submit_and_wait

payment = Payment(
    account=wallet.address,
    destination="rDestinationAddress",
    amount=xrp_to_drops(25),        # always use xrp_to_drops — never raw floats
    source_tag=AGENT_SOURCE_TAG,    # tag every agentic transaction
)
response = submit_and_wait(payment, client, wallet)
print(f"Result : {response.result['meta']['TransactionResult']}")
print(f"Hash   : {response.result['hash']}")
```

```typescript
import { Payment, xrpToDrops } from "xrpl";

const payment: Payment = {
  TransactionType: "Payment",
  Account: wallet.address,
  Destination: "rDestinationAddress",
  Amount: xrpToDrops("25"),
  SourceTag: AGENT_SOURCE_TAG,
};
const response = await client.submitAndWait(payment, { wallet });
console.log(response.result.meta?.TransactionResult);
```

### With a destination tag

Use `destination_tag` when the destination is a hosted wallet (exchange, payment processor) that routes by tag.

```python
payment = Payment(
    account=wallet.address,
    destination="rExchangeAddress",
    amount=xrp_to_drops(100),
    destination_tag=987654,   # required if destination has asfRequireDestTag set
    source_tag=AGENT_SOURCE_TAG,
)
```

#### Check whether a destination requires a tag

Sending to an account that has `asfRequireDestTag` set without a
`destination_tag` fails with `tecDST_TAG_NEEDED`. Detect it first by inspecting
the destination's account-root flags, and require a tag before building the
payment.

```python
from xrpl.models.requests import AccountInfo

LSF_REQUIRE_DEST_TAG = 0x00020000  # account-root flag: destination tag required

def requires_dest_tag(address: str) -> bool:
    info = client.request(AccountInfo(account=address, ledger_index="validated"))
    flags = info.result["account_data"].get("Flags", 0)
    return bool(flags & LSF_REQUIRE_DEST_TAG)

if requires_dest_tag("rExchangeAddress"):
    # Don't build the payment without a destination_tag, or it fails with
    # tecDST_TAG_NEEDED. Get the tag from the recipient (exchange memo line, etc).
    ...
```

```typescript
import { AccountRootFlags } from "xrpl";

async function requiresDestTag(address: string): Promise<boolean> {
  const info = await client.request({
    command: "account_info",
    account: address,
    ledger_index: "validated",
  });
  const flags = info.result.account_data.Flags ?? 0;
  return (flags & AccountRootFlags.lsfRequireDestTag) !== 0;
}
```

### Partial payments

Partial payments deliver *up to* the specified amount. Always read `meta.delivered_amount` — not `Amount` — to know what actually arrived.

```python
from xrpl.models.transactions import Payment
from xrpl.models.transactions.payment import PaymentFlag

payment = Payment(
    account=wallet.address,
    destination="rDestinationAddress",
    amount=xrp_to_drops(100),        # maximum to deliver
    send_max=xrp_to_drops(100),
    flags=PaymentFlag.TF_PARTIAL_PAYMENT,
    source_tag=AGENT_SOURCE_TAG,
)
response = submit_and_wait(payment, client, wallet)
delivered = response.result["meta"]["delivered_amount"]
print(f"Actually delivered: {drops_to_xrp(delivered)} XRP")
```

> **Security:** When *receiving* payments, always check `meta.delivered_amount`, not `Amount`. They differ for partial payments and cross-currency payments.

---

## RLUSD Payments

RLUSD is Ripple's USD stablecoin on the XRP Ledger. Use it for dollar-denominated agent payments.

**RLUSD constants:**

```python
# Hex-encoded currency code — "RLUSD" in ASCII padded to 40 hex chars
RLUSD_CURRENCY = "524C555344000000000000000000000000000000"

# Issuer addresses — confirm before production use
RLUSD_ISSUER_TESTNET = "rQhWct2fv4Vc4KRjRgMrxa8xPN9Zx9iLKV"
RLUSD_ISSUER_MAINNET = "rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De" # Verify at [docs.ripple.com](https://docs.ripple.com/products/stablecoin/developer-resources/rlusd-on-the-xrpl)
```

```typescript
// Hex-encoded currency code — "RLUSD" in ASCII padded to 40 hex chars
const RLUSD_CURRENCY = "524C555344000000000000000000000000000000";

// Issuer addresses — confirm before production use
const RLUSD_ISSUER_TESTNET = "rQhWct2fv4Vc4KRjRgMrxa8xPN9Zx9iLKV";
const RLUSD_ISSUER_MAINNET = "rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De"; // Verify at [docs.ripple.com](https://docs.ripple.com/products/stablecoin/developer-resources/rlusd-on-the-xrpl)
```

### Step 1: Set up the trust line (one-time per wallet)

A wallet must set a trust line to the RLUSD issuer before it can hold or receive RLUSD. Do this once per wallet. The transaction fails with `tecNO_LINE` if you skip it.

```python
from xrpl.models.transactions import TrustSet
from xrpl.models.amounts import IssuedCurrencyAmount

trust_set = TrustSet(
    account=wallet.address,
    limit_amount=IssuedCurrencyAmount(
        currency=RLUSD_CURRENCY,
        issuer=RLUSD_ISSUER_TESTNET,
        value="10000",   # max RLUSD this wallet will hold
    ),
)
result = submit_and_wait(trust_set, client, wallet)
print(f"Trust line: {result.result['meta']['TransactionResult']}")
```

```typescript
import { TrustSet } from "xrpl";

const trustSet: TrustSet = {
  TransactionType: "TrustSet",
  Account: wallet.address,
  LimitAmount: {
    currency: RLUSD_CURRENCY,
    issuer: RLUSD_ISSUER_TESTNET,
    value: "10000",
  },
};
await client.submitAndWait(trustSet, { wallet });
```

### Step 2: Send RLUSD

```python
from xrpl.models.transactions import Payment
from xrpl.models.amounts import IssuedCurrencyAmount

payment = Payment(
    account=wallet.address,
    destination="rDestinationAddress",
    amount=IssuedCurrencyAmount(
        currency=RLUSD_CURRENCY,
        issuer=RLUSD_ISSUER_TESTNET,
        value="250",     # 250 RLUSD
    ),
    source_tag=AGENT_SOURCE_TAG,
)
response = submit_and_wait(payment, client, wallet)
print(f"Result : {response.result['meta']['TransactionResult']}")
print(f"Hash   : {response.result['hash']}")
```

```typescript
const payment: Payment = {
  TransactionType: "Payment",
  Account: wallet.address,
  Destination: "rDestinationAddress",
  Amount: {
    currency: RLUSD_CURRENCY,
    issuer: RLUSD_ISSUER_TESTNET,
    value: "250",
  },
  SourceTag: AGENT_SOURCE_TAG,
};
const response = await client.submitAndWait(payment, { wallet });
```

> **Note:** The destination wallet must also have an RLUSD trust line, or the payment fails with `tecNO_LINE`. The exception is the issuer itself.

### Check RLUSD balance

```python
from xrpl.models.requests import AccountLines

response = client.request(AccountLines(
    account=wallet.address,
    ledger_index="validated",
))
for line in response.result["lines"]:
    if line["currency"] == RLUSD_CURRENCY and line["account"] == RLUSD_ISSUER_TESTNET:
        print(f"RLUSD balance: {line['balance']}")
```

---

## Generic IOU Token Payments

The same pattern applies for any IOU token, not just RLUSD. Replace the currency code and issuer.

```python
payment = Payment(
    account=wallet.address,
    destination="rDestinationAddress",
    amount=IssuedCurrencyAmount(
        currency="USD",          # 3-char ASCII or 40-char hex
        issuer="rIssuerAddress",
        value="100",
    ),
    source_tag=AGENT_SOURCE_TAG,
)
```

---

## Cross-Currency Payments

Send one currency; the destination receives another. The XRP Ledger's built-in DEX handles the conversion atomically — no external swap or bridge needed.

```python
from xrpl.models.transactions import Payment
from xrpl.models.amounts import IssuedCurrencyAmount
from xrpl.utils import xrp_to_drops

# Spend up to 15 XRP; destination receives exactly 10 RLUSD.
payment = Payment(
    account=wallet.address,
    destination="rDestinationAddress",
    amount=IssuedCurrencyAmount(        # what the destination receives
        currency=RLUSD_CURRENCY,
        issuer=RLUSD_ISSUER_TESTNET,
        value="10",
    ),
    send_max=xrp_to_drops(15),          # maximum you'll spend
    source_tag=AGENT_SOURCE_TAG,
)
response = submit_and_wait(payment, client, wallet)
```

```typescript
const payment: Payment = {
  TransactionType: "Payment",
  Account: wallet.address,
  Destination: "rDestinationAddress",
  Amount: { currency: RLUSD_CURRENCY, issuer: RLUSD_ISSUER_TESTNET, value: "10" },
  SendMax: xrpToDrops("15"),
  SourceTag: AGENT_SOURCE_TAG,
};
```

> When reading cross-currency payment results, check `meta.delivered_amount` for the actual amount delivered.

---

## Escrow

Escrows lock XRP until a time condition or cryptographic condition is met. Useful for staged agent payments and conditional disbursements.

### Time-based escrow

```python
import time
from xrpl.models.transactions import EscrowCreate, EscrowFinish, EscrowCancel

RIPPLE_EPOCH_OFFSET = 946684800  # seconds between Unix epoch and Ripple epoch

def unix_to_ripple_time(unix_ts: float) -> int:
    return int(unix_ts) - RIPPLE_EPOCH_OFFSET

# Create: lock 50 XRP, claimable after 24 h, cancellable after 7 days
escrow_create = EscrowCreate(
    account=wallet.address,
    destination="rRecipientAddress",
    amount=xrp_to_drops(50),
    finish_after=unix_to_ripple_time(time.time() + 86400),    # 24 hours
    cancel_after=unix_to_ripple_time(time.time() + 604800),   # 7 days
)
result = submit_and_wait(escrow_create, client, wallet)
escrow_sequence = result.result["Sequence"]

# Finish: recipient (or anyone) claims after FinishAfter
escrow_finish = EscrowFinish(
    account="rRecipientAddress",
    owner=wallet.address,
    offer_sequence=escrow_sequence,
)
submit_and_wait(escrow_finish, client, recipient_wallet)

# Cancel: sender reclaims after CancelAfter
escrow_cancel = EscrowCancel(
    account=wallet.address,
    owner=wallet.address,
    offer_sequence=escrow_sequence,
)
submit_and_wait(escrow_cancel, client, wallet)
```

### Conditional escrow (crypto-conditions)

```python
from xrpl.models.transactions import EscrowCreate, EscrowFinish

escrow_create = EscrowCreate(
    account=wallet.address,
    destination="rRecipientAddress",
    amount=xrp_to_drops(50),
    condition="A0258020...",   # PREIMAGE-SHA-256 hex condition
    cancel_after=unix_to_ripple_time(time.time() + 604800),
)
result = submit_and_wait(escrow_create, client, wallet)

escrow_finish = EscrowFinish(
    account="rRecipientAddress",
    owner=wallet.address,
    offer_sequence=result.result["Sequence"],
    condition="A0258020...",
    fulfillment="A0228020...",   # preimage that satisfies the condition
)
submit_and_wait(escrow_finish, client, recipient_wallet)
```

---

## Agentic Best Practices

### SourceTag — tracking agent-generated volume

Set a consistent 32-bit unsigned integer on every transaction your agent submits. This lets you filter on-chain volume by agent, report on agentic activity, and separate it from human-initiated transactions.

```python
AGENT_SOURCE_TAG = 20260530  

payment = Payment(
    account=wallet.address,
    destination="rDestinationAddress",
    amount=xrp_to_drops(10),
    source_tag=AGENT_SOURCE_TAG,
)
```

```typescript
const payment: Payment = {
  TransactionType: "Payment",
  Account: wallet.address,
  Destination: "rDestinationAddress",
  Amount: xrpToDrops("10"),
  SourceTag: AGENT_SOURCE_TAG,
};
```

### Memos — on-chain audit trail

Embed structured metadata in every agent transaction to correlate on-chain activity with your application logs. Memo values must be hex-encoded.

```python
import json, base64
from xrpl.models.transactions.transaction import Memo

def build_memo(agent_id: str, session_id: str, action: str, task_id: str) -> Memo:
    payload = json.dumps({
        "agent_id":   agent_id,
        "session_id": session_id,
        "action":     action,
        "task_id":    task_id,
    }, separators=(",", ":"))
    return Memo(memo_data=base64.b16encode(payload.encode()).decode())

payment = Payment(
    account=wallet.address,
    destination="rDestinationAddress",
    amount=xrp_to_drops(25),
    source_tag=AGENT_SOURCE_TAG,
    memos=[build_memo("invoice-agent-v1", "sess-abc123", "pay_invoice", "inv-00789")],
)
response = submit_and_wait(payment, client, wallet)
```

```typescript
function buildMemo(agentId: string, sessionId: string, action: string, taskId: string) {
  const payload = JSON.stringify({ agent_id: agentId, session_id: sessionId, action, task_id: taskId });
  return { Memo: { MemoData: Buffer.from(payload).toString("hex").toUpperCase() } };
}

const payment: Payment = {
  TransactionType: "Payment",
  Account: wallet.address,
  Destination: "rDestinationAddress",
  Amount: xrpToDrops("25"),
  SourceTag: AGENT_SOURCE_TAG,
  Memos: [buildMemo("invoice-agent-v1", "sess-abc123", "pay_invoice", "inv-00789")],
};
```

### Decoding memos (for log correlation)

```python
import json, binascii

def decode_memo(memo_hex: str) -> dict:
    return json.loads(binascii.unhexlify(memo_hex).decode("utf-8"))

# From a fetched transaction:
tx_memos = response.result.get("Memos", [])
for entry in tx_memos:
    data = decode_memo(entry["Memo"]["MemoData"])
    print(data)  # {"agent_id": ..., "session_id": ..., "action": ..., "task_id": ...}
```

### WebSocket monitoring — trigger agent steps on incoming transactions

```python
import asyncio, json, websockets

TESTNET_WS = "wss://s.altnet.rippletest.net:51233"

async def monitor_account(address: str):
    async with websockets.connect(TESTNET_WS) as ws:
        await ws.send(json.dumps({"command": "subscribe", "accounts": [address]}))
        async for message in ws:
            event = json.loads(message)
            if event.get("type") == "transaction":
                tx = event.get("transaction", {})
                meta = event.get("meta", {})
                if meta.get("TransactionResult") == "tesSUCCESS":
                    print(f"Confirmed: {tx.get('TransactionType')} | {tx.get('hash')}")
                    # trigger next agent step here

asyncio.run(monitor_account(wallet.address))
```

---

## Spending Controls (Institutional / Production)

| Control | How to set | What it does |
|---------|-----------|--------------|
| **Escrow** | `EscrowCreate` | Locks XRP until a time or crypto condition — staged disbursements |
| **Multi-sig** | `SignerListSet` | Requires M-of-N keys — human-in-the-loop for high-value transfers |
| **DepositAuth** | `AccountSet` with `asfDepositAuth` | Blocks unsolicited incoming payments to the agent wallet |
| **Trust lines** | `TrustSet` with low limit | Caps token exposure to a defined maximum |
| **Freeze** | Issuer sets `TrustSet` freeze flag | Issuer can freeze an individual trust line |

**DepositAuth example:**

```python
from xrpl.models.transactions import AccountSet, AccountSetAsfFlag

account_set = AccountSet(
    account=wallet.address,
    set_flag=AccountSetAsfFlag.ASF_DEPOSIT_AUTH,
)
submit_and_wait(account_set, client, wallet)
# Now only pre-authorized senders can pay this wallet
```

---

## Simulate Before Submit

Use `simulate` to dry-run a transaction before spending fees. The ledger evaluates the transaction and returns what the result *would* be — including which errors it would hit — without actually executing it or charging a fee.

```python
from xrpl.models.requests import Simulate
from xrpl.transaction import autofill, submit_and_wait

payment = Payment(
    account=wallet.address,
    destination="rDestinationAddress",
    amount=xrp_to_drops(25),
    source_tag=AGENT_SOURCE_TAG,
)
filled = autofill(payment, client)

# Simulate the autofilled (unsigned) transaction — no fee charged, no ledger state changed
sim_response = client.request(Simulate(transaction=filled))
sim_result = sim_response.result["meta"]["TransactionResult"]

if sim_result != "tesSUCCESS":
    raise RuntimeError(f"Simulation failed: {sim_result} — fix before submitting")

# Safe to submit — submit_and_wait handles signing internally
response = submit_and_wait(payment, client, wallet)
```

```typescript
const payment: Payment = {
  TransactionType: "Payment",
  Account: wallet.address,
  Destination: "rDestinationAddress",
  Amount: xrpToDrops("25"),
  SourceTag: AGENT_SOURCE_TAG,
};

const filled = await client.autofill(payment);

const simResponse = await client.request({
  command: "simulate",
  tx_json: filled,
});
const simResult = simResponse.result.meta?.TransactionResult;

if (simResult !== "tesSUCCESS") {
  throw new Error(`Simulation failed: ${simResult}`);
}

const response = await client.submitAndWait(payment, { wallet });
```

> **When to skip simulation:** High-frequency agents with stable, pre-validated payment paths can skip simulation for speed. Always simulate during development and when building new payment flows.

---

## Transaction Result Codes

| Prefix | Fee charged? | Meaning | Common examples |
|--------|-------------|---------|-----------------|
| `tesSUCCESS` | Yes | Transaction confirmed | — |
| `tec...` | Yes | Executed but failed | `tecNO_LINE` (no trust line), `tecINSUF_RESERVE_LINE` (not enough XRP for reserve), `tecUNFUNDED_PAYMENT` (insufficient balance) |
| `tef...` | No | Failed before executing | `tefBAD_AUTH` (wrong signing key), `tefPAST_SEQ` (sequence already used) |
| `tel...` | No | Local error (not broadcast) | `telINSUF_FEE_P` (fee too low) |
| `tem...` | No | Malformed transaction | `temBAD_AMOUNT`, `temBAD_CURRENCY` |
| `ter...` | No | Retry — transient error | `terQUEUED` (transaction queued) |

**Checking results in code:**

```python
result_code = response.result["meta"]["TransactionResult"]
if result_code == "tesSUCCESS":
    tx_hash = response.result["hash"]
elif result_code.startswith("tec"):
    # Fee was charged. Log and handle gracefully.
    raise RuntimeError(f"Transaction failed (fee charged): {result_code}")
else:
    # No fee charged. Safe to retry after fixing the issue.
    raise RuntimeError(f"Transaction rejected: {result_code}")
```

---

## Reserve Requirements

Every XRPL account must maintain a minimum XRP balance (the base reserve) plus an incremental reserve per ledger object it owns. Agents must account for this or risk `tecINSUF_RESERVE_LINE` and `tecUNFUNDED_PAYMENT` errors.

| Object | Reserve cost |
|--------|-------------|
| Account activation | 1 XRP base reserve |
| Each trust line | +0.2 XRP owner reserve |
| Each escrow | +0.2 XRP owner reserve |
| Each open offer (DEX) | +0.2 XRP owner reserve |
| Each payment channel | +0.2 XRP owner reserve |

```python
# Check spendable balance (total minus locked reserves)
response = client.request(AccountInfo(account=wallet.address, ledger_index="validated"))
data = response.result["account_data"]
total_drops = int(data["Balance"])
owner_count = int(data["OwnerCount"])

BASE_RESERVE_DROPS   = 1_000_000   # 1 XRP
OWNER_RESERVE_DROPS  =  200_000   # 0.2 XRP per object

locked_drops    = BASE_RESERVE_DROPS + (owner_count * OWNER_RESERVE_DROPS)
spendable_drops = total_drops - locked_drops
print(f"Spendable: {drops_to_xrp(str(spendable_drops))} XRP")
```

---

## Testnet -> Mainnet Checklist

- [ ] Replace testnet URL with `https://xrplcluster.com` (RPC) or `wss://xrplcluster.com` (WS)
- [ ] Use a funded mainnet wallet — not a faucet wallet
- [ ] Confirm canonical RLUSD issuer address for mainnet
- [ ] Set `source_tag` to your registered agent tag
- [ ] Move signing keys to KMS/HSM (AWS KMS, GCP KMS, HashiCorp Vault)
- [ ] Validate full agent behavior on testnet first — identical API surface, no real funds at risk
- [ ] Test edge cases: transaction expiry, insufficient funds, no trust line, destination requires tag

---

## Network Endpoints

| Network | RPC | WebSocket |
|---------|-----|-----------|
| Testnet | `https://s.altnet.rippletest.net:51234` | `wss://s.altnet.rippletest.net:51233` |
| Mainnet | `https://xrplcluster.com` | `wss://xrplcluster.com` |
| Devnet  | `https://s.devnet.rippletest.net:51234` | `wss://s.devnet.rippletest.net:51233` |