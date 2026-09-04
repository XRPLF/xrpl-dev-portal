---
seo:
    title: Getting Started with XRPL DEX Trading
    description: >
        Install the XRPL Trading and Agent Wallet skills for Claude, read a live
        order book, and place your first autonomous limit order on the XRP Ledger
        decentralised exchange — in under 30 minutes.
labels:
    - AI
    - Agents
    - Tutorial
    - DEX
    - Trading
---

# Getting Started with XRPL DEX Trading

This tutorial walks you through your first autonomous DEX trading session on the
XRP Ledger using Claude. You will install two XRPL skills, read a live order book,
and place a limit order on the permissionless XRPL DEX — all driven by
natural-language prompts.

**What you will build:** a live order book read, a limit order placement, and an
offer cancellation.

**Time to complete:** approximately 30 minutes.

**Prerequisite:** A funded XRPL testnet wallet. If you don't have one yet, follow
[Getting Started with Agentic Transactions](/docs/agents/getting-started-with-agentic-transactions/)
first — it takes about 15 minutes and you will reuse the wallet here.

---

## The two skills

XRPL agent skills are layered: one shared foundation, one domain skill per use
case. This tutorial uses the trading combination.

| Skill | Role | When it applies |
| :---- | :---- | :---- |
| **XRPL Agent Wallet** | Shared foundation | From the start — owns wallet creation, key loading, and the full signing ceremony (autofill → preview → confirm → sign → submit). |
| **XRPL Trading** | Domain skill | At transaction time — gives Claude accurate knowledge of XRPL DEX operations: `OfferCreate`, `OfferCancel`, order book reads, AMM interaction, fill classification, and agentic best practices. |

The Wallet skill owns the signing ceremony. The Trading skill constructs the right
transaction object for any DEX operation. Claude coordinates the handoff — you do not
need to manage it manually.

---

## Prerequisites

| Requirement | Notes |
| :---- | :---- |
| **Node.js 18+** or **Python 3.9+** | Code samples are provided in both languages. |
| **Claude Code** | Recommended for development — runs Claude in your terminal alongside your project files. |
| **A funded testnet wallet** | Follow [Getting Started with Agentic Transactions](/docs/agents/getting-started-with-agentic-transactions/) if you don't have one. |

Install the XRP Ledger SDK for your language:

{% tabs %}
{% tab label="TypeScript" %}
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

If you completed the payments getting-started guide, the Wallet skill is already
installed. Skip to installing the Trading skill.

```sh
# Wallet skill (skip if already installed)
npx skills add https://github.com/XRPLF/xrpl-dev-portal/tree/master/.claude/skills/xrpl-skills/xrpl-agent-wallet --agent claude-code

# Trading skill
npx skills add https://github.com/XRPLF/xrpl-dev-portal/tree/master/.claude/skills/xrpl-skills/xrpl-trading --agent claude-code
```

Verify both skills are loaded:

```
/skills
```

You should see:

```
Project skills (.claude/skills)
  xrpl-agent-wallet
  xrpl-trading
```

---

## Step 2: Read the order book

Order book reads are read-only — no signature or confirmation required. Ask Claude:

```
Show me the current XRP/USD order book on testnet — best bid, best ask,
mid price, and spread.
```

Claude calls `book_offers` on both sides of the pair and returns a summary:

```
Order book: XRP / USD.Bitstamp (testnet)
  Best ask : 0.512400 USD/XRP
  Best bid : 0.511200 USD/XRP
  Mid price: 0.511800 USD/XRP
  Spread   : 0.235 %
  Ask depth: 12 offers, 8,420 XRP available at mid ± 1%
```

The code behind this request:

{% tabs %}
{% tab label="TypeScript" %}
```typescript
import { Client } from "xrpl";

const USD_ISSUER = "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"; // example Bitstamp issuer
const client    = new Client("wss://s.altnet.rippletest.net:51233");
await client.connect();

const [asks, bids] = await Promise.all([
  client.request({
    command:    "book_offers",
    taker_pays: { currency: "USD", issuer: USD_ISSUER },
    taker_gets: { currency: "XRP" },
    limit: 20,
  }),
  client.request({
    command:    "book_offers",
    taker_pays: { currency: "XRP" },
    taker_gets: { currency: "USD", issuer: USD_ISSUER },
    limit: 20,
  }),
]);

const askOffers = asks.result.offers;
const bidOffers = bids.result.offers;
const bestAsk   = askOffers.length ? parseFloat(askOffers[0].quality as string) : Infinity;
const bestBid   = bidOffers.length ? parseFloat(bidOffers[0].quality as string) : 0;
const midPrice  = (bestAsk + bestBid) / 2;
const spreadPct = midPrice > 0 ? ((bestAsk - bestBid) / midPrice) * 100 : null;

console.log(`Mid price: ${midPrice.toFixed(6)} USD/XRP`);
console.log(`Spread   : ${spreadPct?.toFixed(3) ?? "n/a"} %`);

await client.disconnect();
```
{% /tab %}
{% tab label="Python" %}
```python
from xrpl.clients import JsonRpcClient
from xrpl.models.requests import BookOffers

USD_ISSUER = "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
client     = JsonRpcClient("https://s.altnet.rippletest.net:51234")

asks = client.request(BookOffers(
    taker_pays={"currency": "USD", "issuer": USD_ISSUER},
    taker_gets={"currency": "XRP"},
    limit=20,
)).result.get("offers", [])

bids = client.request(BookOffers(
    taker_pays={"currency": "XRP"},
    taker_gets={"currency": "USD", "issuer": USD_ISSUER},
    limit=20,
)).result.get("offers", [])

best_ask  = float(asks[0]["quality"]) if asks else float("inf")
best_bid  = float(bids[0]["quality"]) if bids else 0.0
mid_price = (best_ask + best_bid) / 2
spread    = ((best_ask - best_bid) / mid_price * 100) if mid_price > 0 else None

print(f"Mid price: {mid_price:.6f} USD/XRP")
print(f"Spread   : {spread:.3f} %" if spread else "Spread: n/a")
```
{% /tab %}
{% /tabs %}

---

## Step 3: Place a limit order

Ask Claude to place a limit order. The Trading skill builds the transaction object
and the Wallet skill runs the signing ceremony — you will see a preview before
anything is submitted.

```
Place a limit order to sell 10 XRP and buy 5 USD at 0.5 USD/XRP,
expiring in 1 hour. Show me the order book first.
```

Claude will show you a pre-trade summary before requesting your signature:

```
Pre-trade summary
──────────────────────────────────────────────────────
Offering:     10 XRP (10,000,000 drops)
To receive:   5 USD (Bitstamp issuer)
Limit price:  0.500000 USD/XRP
Mid price:    0.511800 USD/XRP (from order book)
Est. fill:    ~60% crosses immediately at current depth
Slippage:     −2.3% vs mid (executing below mid)
Expiry:       2026-08-21T14:30:00Z (1 hour from now)
──────────────────────────────────────────────────────
Proceed to sign? (yes / no)
```

After acknowledgement, the Wallet skill displays its transaction preview:

```
─── XRPL Transaction Preview ────────────────────────────────────────
Network           : testnet
Type              : OfferCreate
From              : rYourAddress...
TakerPays         : 5 USD (issuer: rvYAfWj5...)
TakerGets         : 10 XRP (10,000,000 drops)
Fee               : 0.000012 XRP
Sequence          : 48291010
LastLedgerSequence: 48291030  (expires in ~20 ledgers, ~80 seconds)
Expiration        : 2026-08-21T14:30:00Z
Flags             : 0
─────────────────────────────────────────────────────────────────────
Sign and submit? (yes / no)
```

The code Claude generates for the transaction object:

{% tabs %}
{% tab label="TypeScript" %}
```typescript
import { OfferCreate, xrpToDrops } from "xrpl";

const XRPL_EPOCH_OFFSET = 946_684_800;
const expiryXRPL = Math.floor(Date.now() / 1000) + 3600 - XRPL_EPOCH_OFFSET;

const offer: Omit<OfferCreate, "Fee" | "Sequence" | "LastLedgerSequence"> = {
  TransactionType: "OfferCreate",
  Account:    "rYourAddress",
  TakerPays:  { currency: "USD", issuer: "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B", value: "5" },
  TakerGets:  xrpToDrops(10),      // "10000000" drops
  Expiration: expiryXRPL,
  // Fee, Sequence, LastLedgerSequence: set by Wallet skill autofill
  // SourceTag: applied by Wallet skill (20260530) automatically
};
// → hand to XRPL Agent Wallet skill
```
{% /tab %}
{% tab label="Python" %}
```python
import time
from xrpl.models.transactions import OfferCreate
from xrpl.utils import xrp_to_drops

XRPL_EPOCH_OFFSET = 946_684_800
expiry_xrpl = int(time.time()) + 3600 - XRPL_EPOCH_OFFSET

offer = OfferCreate(
    account="rYourAddress",
    taker_pays={"currency": "USD", "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B", "value": "5"},
    taker_gets=xrp_to_drops(10),   # "10000000" drops
    expiration=expiry_xrpl,
    # Fee, Sequence, LastLedgerSequence: set by Wallet skill autofill
    # source_tag: applied by Wallet skill (20260530) automatically
)
# → hand to XRPL Agent Wallet skill
```
{% /tab %}
{% /tabs %}

After signing, Claude classifies the result:

```
Fill status:    partial
Amount filled:  6 XRP sold, 3.07 USD received (immediate crosses)
Remaining:      4 XRP / 2 USD resting on the book
Offer sequence: 48291010  ← save this to cancel later
Fee paid:       12 drops (0.000012 XRP)
Tx hash:        A3F9B2...
```

**Save the offer sequence.** You will need it to cancel the resting portion.

---

## Step 4: Cancel the resting offer

If the offer doesn't fill completely, cancel it with:

```
Cancel my resting offer at sequence 48291010.
```

Claude verifies the offer exists, shows a cancellation summary, and presents the
Wallet skill's preview before submitting:

```
Cancelling offer sequence: 48291010
You are giving up:         4 XRP (remaining TakerGets)
You would have received:   2 USD (remaining TakerPays)
Network fee:               12 drops
```

The `OfferCancel` transaction:

{% tabs %}
{% tab label="TypeScript" %}
```typescript
import { OfferCancel } from "xrpl";

const cancel: Omit<OfferCancel, "Fee" | "Sequence" | "LastLedgerSequence"> = {
  TransactionType: "OfferCancel",
  Account:        "rYourAddress",
  OfferSequence:  48291010,   // Sequence of the original OfferCreate
};
// → hand to XRPL Agent Wallet skill
```
{% /tab %}
{% tab label="Python" %}
```python
from xrpl.models.transactions import OfferCancel

cancel = OfferCancel(
    account="rYourAddress",
    offer_sequence=48291010,   # Sequence of the original OfferCreate
)
# → hand to XRPL Agent Wallet skill
```
{% /tab %}
{% /tabs %}

A successful cancellation returns `tesSUCCESS` with the offer in `meta.AffectedNodes`
as a `DeletedNode`. If the offer was already filled, the cancel still succeeds but
does nothing — and the fee is still charged. Always verify offer existence before
cancelling.

---

## Common flag combinations

| Goal | Flag to set | Notes |
| :---- | :---- | :---- |
| Standard limit order (rests if unfilled) | None | Default |
| Market order (fill what you can, cancel rest) | `tfImmediateOrCancel` | Draws on AMM + order book |
| Must fill completely or cancel | `tfFillOrKill` | `tecKILLED` on failure — fee charged |
| Post-only (never cross, always rest) | `tfPassive` | Use for maker strategies |

**Never combine `tfImmediateOrCancel` and `tfFillOrKill`.** The Trading skill rejects
this combination at construction.

---

## Where to go next

**Skill reference**

- [The XRPL Trading Skill](/docs/agents/xrpl-trading-skill/) —
  Full reference for offer semantics, flag behaviour, AMM interaction, fill classification, and error codes.
- [The XRPL Agent Wallet Skill](/docs/agents/xrpl-agent-wallet-skill/) —
  Security model, signing ceremony, key handling patterns, and production setup including OWS.

**Use case guides**

- [Agentic Payments with X402](/docs/agents/agentic-payments-x402/) — Pay for HTTP services autonomously using XRPL payments.
- [Track and Measure Agent Behavior](/docs/agents/track-agent-behavior/) — Use SourceTag, Memos, and WebSocket monitoring to attribute and audit every agent transaction.

**Go deeper on XRPL features**

- [Decentralized Exchange](/docs/concepts/tokens/decentralized-exchange/) — XRPL DEX concepts: offer matching, quality, and the order book.
- [Automated Market Maker](/docs/concepts/tokens/decentralized-exchange/automated-market-makers/) — AMM pools and how they interact with the DEX order book.

**SDK references**

- [xrpl.js documentation](https://js.xrpl.org/)
- [xrpl-py documentation](https://xrpl-py.readthedocs.io/)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
