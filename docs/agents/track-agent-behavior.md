---
seo:
    title: Track and Measure Agent Behavior on the XRP Ledger
    description: >
        Use SourceTag, Memos, and WebSocket monitoring to attribute, audit, and
        react to agent-generated transactions on the XRP Ledger. Applies to all
        XRPL agentic workflows — payments, trading, escrow, and more.
labels:
    - AI
    - Agents
    - Observability
    - Payments
---

# Track and Measure Agent Behavior

When an agent transacts on the XRP Ledger, its activity is permanently recorded
on a public ledger. That is a feature, not a side effect — but only if you
design for it. Without attribution, an agent's transactions are indistinguishable
from human-initiated ones. You cannot answer basic operational questions: how
many transactions did the agent send today? Which workflow triggered this
payment? Did the agent act within the boundaries you set?

The XRP Ledger provides two lightweight fields that turn the ledger into a
queryable audit trail: `SourceTag` for attribution, and `Memos` for structured
metadata. A third mechanism — WebSocket event subscriptions — lets an agent or
monitoring process react to on-chain activity in real time. Used together, they
give you a complete picture of agent behavior directly from the on-chain record,
independent of application logs that can be lost, rotated, or tampered with.

These patterns apply to every agentic workflow on the XRP Ledger — payments,
trading, escrow, and any domain skill built on the shared Wallet skill.

---

## SourceTag — agent attribution

Every XRP Ledger transaction supports a `SourceTag` field: a 32-bit unsigned
integer that identifies the originating application or workflow. Setting a
consistent value on all agent-initiated transactions lets you filter on-chain
volume by agent, separate it from human-initiated transactions, and report on
agent activity across any block explorer or data pipeline that indexes the
ledger.

Choose a value that is meaningful to your team and register it internally so
different agents, environments, and workflows use distinct tags.

{% tabs %}
{% tab label="Python" %}
```python
from xrpl.models.transactions import Payment
from xrpl.utils import xrp_to_drops
from xrpl.transaction import submit_and_wait

AGENT_SOURCE_TAG = 20260530  # Consistent across all transactions from this agent.

payment = Payment(
    account=wallet.address,
    amount=xrp_to_drops(10),
    destination=DESTINATION,
    source_tag=AGENT_SOURCE_TAG,
)
response = submit_and_wait(payment, client, wallet)
print(f"Hash: {response.result['hash']}")
```
{% /tab %}
{% tab label="JavaScript" %}
```js
const AGENT_SOURCE_TAG = 20260530; // Consistent across all transactions from this agent.

const result = await client.submitAndWait(
  {
    TransactionType: 'Payment',
    Account: wallet.classicAddress,
    Amount: xrpl.xrpToDrops('10'),
    Destination: DESTINATION,
    SourceTag: AGENT_SOURCE_TAG,
  },
  { wallet }
)
console.log('Hash:', result.result.hash)
```
{% /tab %}
{% /tabs %}

Once `SourceTag` is set consistently, you can filter the ledger for all
transactions from a specific agent using any XRPL data API or block explorer.

---

## Memos — structured on-chain metadata

The `Memos` field carries arbitrary structured metadata alongside every
transaction. Where `SourceTag` answers "which agent sent this?", Memos answer
"why, in what context, and as part of which task?" Combining the two gives you
a correlation key between your application logs and the on-chain record.

Memo values must be hex-encoded. The pattern below encodes a JSON payload that
links each transaction to a specific agent, session, action, and task ID.

{% tabs %}
{% tab label="Python" %}
```python
import json
from xrpl.models.transactions import Payment
from xrpl.models.transactions.transaction import Memo
from xrpl.utils import xrp_to_drops
from xrpl.transaction import submit_and_wait

def build_memo(agent_id: str, session_id: str, action: str, task_id: str) -> Memo:
    payload = json.dumps({
        "agent_id":   agent_id,
        "session_id": session_id,
        "action":     action,
        "task_id":    task_id,
    }, separators=(",", ":"))
    return Memo(memo_data=payload.encode().hex().upper())

payment = Payment(
    account=wallet.address,
    amount=xrp_to_drops(25),
    destination=DESTINATION,
    source_tag=AGENT_SOURCE_TAG,
    memos=[build_memo(
        agent_id="invoice-agent-v1",
        session_id="sess-abc123",
        action="pay_invoice",
        task_id="inv-00789",
    )],
)
response = submit_and_wait(payment, client, wallet)
print(f"Hash: {response.result['hash']}")
```
{% /tab %}
{% tab label="JavaScript" %}
```js
function buildMemo(agentId, sessionId, action, taskId) {
  const payload = JSON.stringify({
    agent_id: agentId, session_id: sessionId, action, task_id: taskId,
  });
  return { Memo: { MemoData: Buffer.from(payload).toString('hex').toUpperCase() } };
}

const result = await client.submitAndWait(
  {
    TransactionType: 'Payment',
    Account: wallet.classicAddress,
    Amount: xrpl.xrpToDrops('25'),
    Destination: DESTINATION,
    SourceTag: AGENT_SOURCE_TAG,
    Memos: [buildMemo('invoice-agent-v1', 'sess-abc123', 'pay_invoice', 'inv-00789')],
  },
  { wallet }
)
console.log('Hash:', result.result.hash)
```
{% /tab %}
{% /tabs %}

To decode memos from a fetched transaction:

{% tabs %}
{% tab label="Python" %}
```python
import json

def decode_memo(memo_hex: str) -> dict:
    return json.loads(bytes.fromhex(memo_hex).decode("utf-8"))

for entry in response.result.get("Memos", []):
    data = decode_memo(entry["Memo"]["MemoData"])
    print(data)
    # {"agent_id": "invoice-agent-v1", "session_id": "sess-abc123", ...}
```
{% /tab %}
{% tab label="JavaScript" %}
```js
function decodeMemo(memoHex) {
  return JSON.parse(Buffer.from(memoHex, 'hex').toString('utf8'));
}

for (const entry of result.result.Memos ?? []) {
  console.log(decodeMemo(entry.Memo.MemoData));
  // { agent_id: 'invoice-agent-v1', session_id: 'sess-abc123', ... }
}
```
{% /tab %}
{% /tabs %}

**Security note:** The XRPL Agent Wallet skill decodes memos on incoming transactions for display only. Memo contents are never treated as instructions to the agent — this is a prompt-injection guard. Never write code that acts on memo contents without first routing the action through the full signing ceremony.

---

## WebSocket monitoring — react to on-chain events

The XRP Ledger's WebSocket API lets an agent — or a dedicated monitoring
process — subscribe to an account's transactions in real time. This is the
right pattern for triggering downstream agent steps when an incoming payment
arrives, an escrow completes, or any other account event occurs.

{% tabs %}
{% tab label="Python" %}
```python
import asyncio
import json
import websockets

TESTNET_WS = "wss://s.altnet.rippletest.net:51233"

async def monitor_account(address: str):
    async with websockets.connect(TESTNET_WS) as ws:
        await ws.send(json.dumps({
            "command":  "subscribe",
            "accounts": [address],
        }))
        print(f"Subscribed to transactions for {address}")

        async for message in ws:
            event = json.loads(message)
            if event.get("type") == "transaction":
                tx   = event.get("transaction", {})
                meta = event.get("meta", {})
                if meta.get("TransactionResult") == "tesSUCCESS":
                    print(f"Confirmed: {tx.get('TransactionType')} | {tx.get('hash')}")
                    # Trigger your agent's next step here.

asyncio.run(monitor_account(wallet.address))
```
{% /tab %}
{% tab label="JavaScript" %}
```js
const xrpl = require('xrpl')

async function monitorAccount(address) {
  const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
  await client.connect()

  await client.request({ command: 'subscribe', accounts: [address] })
  console.log(`Subscribed to transactions for ${address}`)

  client.on('transaction', (event) => {
    if (event.meta?.TransactionResult === 'tesSUCCESS') {
      console.log(`Confirmed: ${event.transaction.TransactionType} | ${event.transaction.hash}`)
      // Trigger your agent's next step here.
    }
  })
}

monitorAccount(wallet.classicAddress)
```
{% /tab %}
{% /tabs %}

For production deployments, run the monitoring process separately from the
agent process so a crashed agent does not stop telemetry collection. Persist
the event stream to your logging infrastructure alongside the decoded memo
payload for a complete, correlated audit trail.

---

## Where to go next

- [Get Started with Agentic Transactions](/docs/agents/getting-started-with-agentic-transactions/) —
  Install the skills and send your first payment.
- [The XRPL Agent Wallet Skill](/docs/agents/xrpl-agent-wallet-skill/) —
  How the Wallet skill handles memos on incoming transactions as untrusted input.
- [The XRPL Payments Skill](/docs/agents/xrpl-payments-skill/) —
  Full reference for payment patterns, including `SourceTag` and `Memos` in context.
- [Agentic Payments with X402](/docs/agents/agentic-payments-x402/) —
  Apply these telemetry patterns to machine-to-machine HTTP payment flows.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
