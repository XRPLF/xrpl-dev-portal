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

<!-- RELEASE GATE: the xrpl-trading path 404s on `master` until this branch merges.
     Verify both URLs resolve before publishing this tutorial. -->

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

## Step 2: Get a tradeable Testnet pair

**Testnet has almost no real liquidity.** The well-known Mainnet issuers (Bitstamp,
GateHub, and so on) either do not exist on Testnet or have no usable order book there, so
you cannot simply point at `USD.Bitstamp` and expect a market. Before you can place a
meaningful trade you need a pair that actually has an offer on the other side.

You have two options.

**Option A — trade against a one-sided book (fastest).** Place a limit order that does not
cross, let it rest, then cancel it. This exercises the full `OfferCreate` → verify →
`OfferCancel` → verify loop and needs no counterparty. Skip to Step 3; just expect
"one-sided book" when you read prices, and expect your order to rest rather than fill.

**Option B — create your own pair (needed to see a real fill).** Issue a test token from a
second wallet and place a maker offer against it. Four transactions:

{% tabs %}
{% tab label="TypeScript" %}
```typescript
import { Client, Wallet, xrpToDrops, AccountSetAsfFlags } from "xrpl";

const client = new Client("wss://s.altnet.rippletest.net:51233");
await client.connect();

// Two throwaway Testnet wallets: an issuer and a market maker.
const { wallet: issuer } = await client.fundWallet();
const { wallet: maker  } = await client.fundWallet();

const submit = async (w: Wallet, tx: any) =>
  client.submitAndWait((w.sign(await client.autofill(tx))).tx_blob);

// 1. The issuer must allow its token to move between holders.
await submit(issuer, { TransactionType: "AccountSet", Account: issuer.classicAddress,
                       SetFlag: AccountSetAsfFlags.asfDefaultRipple });

// 2. The maker trusts the issuer for TST.
await submit(maker, { TransactionType: "TrustSet", Account: maker.classicAddress,
                      LimitAmount: { currency: "TST", issuer: issuer.classicAddress, value: "1000" } });

// 3. The issuer sends the maker 100 TST.
await submit(issuer, { TransactionType: "Payment", Account: issuer.classicAddress,
                       Destination: maker.classicAddress,
                       Amount: { currency: "TST", issuer: issuer.classicAddress, value: "100" } });

// 4. The maker posts liquidity: sell 20 TST for 4 XRP (0.2 XRP/TST).
await submit(maker, { TransactionType: "OfferCreate", Account: maker.classicAddress,
                      TakerPays: xrpToDrops(4),
                      TakerGets: { currency: "TST", issuer: issuer.classicAddress, value: "20" } });

console.log("Tradeable pair ready. Issuer:", issuer.classicAddress);
await client.disconnect();
```
{% /tab %}
{% tab label="Python" %}
```python
from xrpl.clients import JsonRpcClient
from xrpl.wallet import generate_faucet_wallet
from xrpl.transaction import submit_and_wait
from xrpl.utils import xrp_to_drops
from xrpl.models.transactions import AccountSet, TrustSet, Payment, OfferCreate
from xrpl.models.transactions.account_set import AccountSetAsfFlag

client = JsonRpcClient("https://s.altnet.rippletest.net:51234")
issuer = generate_faucet_wallet(client)
maker  = generate_faucet_wallet(client)

# 1. Allow the token to move between holders.
submit_and_wait(AccountSet(account=issuer.classic_address,
                           set_flag=AccountSetAsfFlag.ASF_DEFAULT_RIPPLE), client, issuer)

# 2. The maker trusts the issuer for TST.
submit_and_wait(TrustSet(account=maker.classic_address,
    limit_amount={"currency": "TST", "issuer": issuer.classic_address, "value": "1000"}),
    client, maker)

# 3. The issuer sends the maker 100 TST.
submit_and_wait(Payment(account=issuer.classic_address, destination=maker.classic_address,
    amount={"currency": "TST", "issuer": issuer.classic_address, "value": "100"}),
    client, issuer)

# 4. The maker posts liquidity: sell 20 TST for 4 XRP (0.2 XRP/TST).
submit_and_wait(OfferCreate(account=maker.classic_address, taker_pays=xrp_to_drops(4),
    taker_gets={"currency": "TST", "issuer": issuer.classic_address, "value": "20"}),
    client, maker)

print("Tradeable pair ready. Issuer:", issuer.classic_address)
```
{% /tab %}
{% /tabs %}

Note the issuer address that gets printed — the rest of this tutorial uses it wherever
`TEST_ISSUER` appears. Your trading wallet needs **no** trust line to it: the ledger creates
one automatically the first time you receive TST. Budget 0.2 XRP of owner reserve for it.

---

## Step 3: Read the order book

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
import { Client, dropsToXrp } from "xrpl";

// NOTE: rvYAfWj5... is Bitstamp's MAINNET issuer. It has no meaningful book on
// Testnet. Substitute an issuer that is actually active on Testnet, or issue your
// own test token and trade against it.
const USD_ISSUER = process.env.TEST_ISSUER!;   // a Testnet issuer you control
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

// `quality` is TakerPays/TakerGets in PROTOCOL units — XRP is in drops, so an
// XRP-denominated quality is 1,000,000x off and the two book sides are inverted.
// Always derive the price from the amounts instead.
const amt = (a: any) => typeof a === "string" ? Number(dropsToXrp(a)) : Number(a.value);
const price = (o: any, getsBase: boolean) =>
  getsBase ? amt(o.TakerPays) / amt(o.TakerGets) : amt(o.TakerGets) / amt(o.TakerPays);

// `book_offers` also returns offers their owner cannot currently fund — including
// completely unfunded ones, which carry a real-looking price and size. Tradeable
// size is `taker_gets_funded` when present; drop anything that resolves to 0.
const fundedGets  = (o: any) => o.taker_gets_funded ?? o.TakerGets;
const liveOffers  = (os: any[]) => os.filter(o => amt(fundedGets(o)) > 0);

const askOffers = liveOffers(asks.result.offers);   // taker_gets = XRP -> getsBase = true
const bidOffers = liveOffers(bids.result.offers);   // taker_pays = XRP -> getsBase = false
const bestAsk   = askOffers.length ? price(askOffers[0], true)  : null;
const bestBid   = bidOffers.length ? price(bidOffers[0], false) : null;

// A one-sided book has no mid price and no spread. Report that honestly.
if (bestAsk === null || bestBid === null) {
  console.log("One-sided book — mid price and spread are undefined.");
} else {
  const midPrice  = (bestAsk + bestBid) / 2;
  const spreadPct = ((bestAsk - bestBid) / midPrice) * 100;
  console.log(`Mid price: ${midPrice.toFixed(6)} USD/XRP`);
  console.log(`Spread   : ${spreadPct.toFixed(3)} %`);
}

await client.disconnect();
```
{% /tab %}
{% tab label="Python" %}
```python
from xrpl.clients import JsonRpcClient
from xrpl.models.requests import BookOffers
from xrpl.utils import drops_to_xrp

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

# `quality` is in PROTOCOL units (XRP as drops) and the two book sides are
# inverted — derive the price from the amounts instead.
def _amt(a):
    return float(drops_to_xrp(a)) if isinstance(a, str) else float(a["value"])

def _price(o, gets_base):
    return (_amt(o["TakerPays"]) / _amt(o["TakerGets"])) if gets_base \
        else (_amt(o["TakerGets"]) / _amt(o["TakerPays"]))

# `book_offers` also returns offers their owner cannot currently fund - including
# completely unfunded ones, which carry a real-looking price and size. Tradeable
# size is `taker_gets_funded` when present; drop anything that resolves to 0.
def _live(offers):
    return [o for o in offers
            if _amt(o.get("taker_gets_funded", o["TakerGets"])) > 0]

asks, bids = _live(asks), _live(bids)

best_ask = _price(asks[0], True)  if asks else None
best_bid = _price(bids[0], False) if bids else None

if best_ask is None or best_bid is None:
    print("One-sided book - mid price and spread are undefined.")
else:
    mid_price = (best_ask + best_bid) / 2
    print(f"Mid price: {mid_price:.6f} USD/XRP")
    print(f"Spread   : {(best_ask - best_bid) / mid_price * 100:.3f} %")
```
{% /tab %}
{% /tabs %}

---

## Step 4: Place a limit order

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
Limit price:  0.500000 USD/XRP  (minimum you will accept)
Mid price:    0.511800 USD/XRP  (from order book)
Est. fill:    100% — your limit is below the best bid, so the whole order crosses
Exec. price:  0.511200 USD/XRP  (you receive the better book price, not your limit)
Slippage:     0.00% vs best bid — depth exceeds order size
Expiry:       2026-08-21T14:30:00Z (1 hour from now)
──────────────────────────────────────────────────────
Proceed to sign? (yes / no)
```

After acknowledgement, the Wallet skill displays its transaction preview:

```
─── XRPL Transaction Preview ────────────────────────────────────────
Network           : testnet
Type              : OfferCreate
From              : rYourFullAddressShownInFullNoTruncation
To                : —
Amount            : —
Fee               : 0.000012 XRP
Sequence          : 48291010
LastLedgerSequence: 48291030  (expires in ~20 ledgers, ~80 seconds)
Flags             : 0
Memos             : —
TakerGets         : 10 XRP (10,000,000 drops)
TakerPays         : 5 USD  issuer rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B
Other fields      : Expiration 2026-08-21T14:30:00Z
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
Fill status:    partial (remainder resting)
Amount filled:  6 of 10 XRP sold (60%), 3.07 USD received
Remaining:      4 XRP / 2 USD resting on the book
Offer sequence: 48291010  ← save this to cancel later
Fee paid:       12 drops (0.000012 XRP)
Tx hash:        A3F9B2...
```

**Save the offer sequence.** You will need it to cancel the resting portion.

---

## Step 5: Cancel the resting offer

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
