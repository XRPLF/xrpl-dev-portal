# XRPL Trading — Reference

Full transaction patterns, code examples, edge cases, error codes, and agentic
guidance for DEX operations on the XRP Ledger.

> **Scope:** OfferCreate, OfferCancel, order book reads, cross-currency via DEX,
> AMM interaction, agentic patterns, error codes, reserve requirements.  
> **Signing:** All code examples produce an unsigned transaction object. Pass the
> object to the XRPL Agent Wallet skill for autofill, OWS signing, and submission.

---

## Contents

1. [OfferCreate patterns](#1-offercreate-patterns)
2. [OfferCancel patterns](#2-offercancel-patterns)
3. [Order book reads](#3-order-book-reads)
4. [Cross-currency flows via DEX](#4-cross-currency-flows-via-dex)
5. [AMM interaction](#5-amm-interaction)
6. [Agentic patterns](#6-agentic-patterns)
7. [Simulate before handoff](#7-simulate-before-handoff)
8. [Error codes](#8-error-codes)
9. [Reserve requirements](#9-reserve-requirements)

---

## 1. OfferCreate patterns

### 1.1 Basic limit order — sell XRP, buy IOU

**Python (xrpl-py):**
```python
from xrpl.models.transactions import OfferCreate
from xrpl.utils import xrp_to_drops

# Sell 100 XRP, buy 50 USD (Bitstamp issuer)
# TakerPays = what creator wants to receive
# TakerGets = what creator is giving away
offer = OfferCreate(
    account="rYourAddress",
    taker_pays={
        "currency": "USD",
        "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
        "value": "50",
    },
    taker_gets=xrp_to_drops(100),   # "100000000"
    # Fee, Sequence, LastLedgerSequence: set by Wallet skill autofill
    # SourceTag: applied by Wallet skill automatically
)
# → hand to XRPL Agent Wallet skill
```

**TypeScript (xrpl.js):**
```typescript
import { OfferCreate, xrpToDrops } from "xrpl";

const offer: Omit<OfferCreate, "Fee" | "Sequence" | "LastLedgerSequence" | "SourceTag"> = {
  TransactionType: "OfferCreate",
  Account: "rYourAddress",
  TakerPays: {
    currency: "USD",
    issuer: "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
    value: "50",
  },
  TakerGets: xrpToDrops(100),  // "100000000"
};
// → hand to XRPL Agent Wallet skill
```

### 1.2 Limit order — sell IOU, buy IOU

```typescript
// Sell 50 USD.Bitstamp, buy 45 EUR.Bitstamp
const offer: OfferCreate = {
  TransactionType: "OfferCreate",
  Account: "rYourAddress",
  TakerPays: {
    currency: "EUR",
    issuer: "rEXAMPLEeurIssuerAddressGoesHere00",  // replace with a real issuer address
    value: "45",
  },
  TakerGets: {
    currency: "USD",
    issuer: "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
    value: "50",
  },
};
```

```python
# Sell 50 USD.Bitstamp, buy 45 EUR.Bitstamp
offer = OfferCreate(
    account="rYourAddress",
    taker_pays={
        "currency": "EUR",
        "issuer": "rEXAMPLEeurIssuerAddressGoesHere00",  # replace with a real issuer address
        "value": "45",
    },
    taker_gets={
        "currency": "USD",
        "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
        "value": "50",
    },
)
# → hand to XRPL Agent Wallet skill
```

**⚠ Trust lines are required on the sell side only.** Verify a *funded* trust line
only for an IOU in `TakerGets` (what you are giving away) — selling an IOU you do
not hold fails with `tecUNFUNDED_OFFER`. An IOU in `TakerPays` (what you are
buying) needs **no** pre-existing trust line: the ledger auto-creates one with
limit `0` when the offer executes. Budget one extra owner reserve for that
auto-created line (see §9). Do not block an offer for a missing `TakerPays`
trust line — doing so rejects the most common agent trade.

### 1.3 Immediate-or-cancel (market-equivalent)

`tfImmediateOrCancel`: crosses against the book at submission; any unfilled
remainder is cancelled immediately. Never rests on the book.

```typescript
import { OfferCreateFlags } from "xrpl";

const offer: OfferCreate = {
  TransactionType: "OfferCreate",
  Account: "rYourAddress",
  TakerPays: { currency: "USD", issuer: "rvYAfWj5...", value: "50" },
  TakerGets: xrpToDrops(100),
  Flags: OfferCreateFlags.tfImmediateOrCancel,
};
```

```python
from xrpl.models.transactions.offer_create import OfferCreateFlag

offer = OfferCreate(
    account="rYourAddress",
    taker_pays={"currency": "USD", "issuer": "rvYAfWj5...", "value": "50"},
    taker_gets=xrp_to_drops(100),
    flags=OfferCreateFlag.TF_IMMEDIATE_OR_CANCEL,
)
# → hand to XRPL Agent Wallet skill
```

### 1.4 Fill-or-kill

`tfFillOrKill`: must fill completely or the entire transaction is cancelled
(`tecKILLED`). Fee is charged even on `tecKILLED`.

```typescript
Flags: OfferCreateFlags.tfFillOrKill,
```

```python
flags=OfferCreateFlag.TF_FILL_OR_KILL,
```

**Never combine `tfImmediateOrCancel` and `tfFillOrKill`.** Reject at construction.

### 1.5 Post-only (passive)

`tfPassive`: does not consume offers whose rate exactly matches this offer's
limit rate. It will consume offers priced better than the limit rate, so the
offer can execute immediately on submission. Use it to add liquidity at a specific
rate without removing existing liquidity at that same rate.

```typescript
Flags: OfferCreateFlags.tfPassive,
```

```python
flags=OfferCreateFlag.TF_PASSIVE,
```

**Never set `tfPassive` by default.** Only set when the user explicitly requests "post only" or "maker only" behavior.

`tfPassive` is not necessarily strict "post-only": true post-only rejects any order that would immediately execute, while passive may allow execution at a price better than the limit.

### 1.6 Offer with expiry

```typescript
const XRPL_EPOCH_OFFSET = 946_684_800; // seconds between Unix epoch and XRPL epoch

// Expire the offer in 1 hour
const expiryUnixSec = Math.floor(Date.now() / 1000) + 3600;
const expiryXRPL    = expiryUnixSec - XRPL_EPOCH_OFFSET;

const offer: OfferCreate = {
  TransactionType: "OfferCreate",
  Account: "rYourAddress",
  TakerPays: { /* ... */ },
  TakerGets: xrpToDrops(100),
  Expiration: expiryXRPL,
};
```

```python
import time

XRPL_EPOCH_OFFSET = 946_684_800
expiry_xrpl = int(time.time()) + 3600 - XRPL_EPOCH_OFFSET

offer = OfferCreate(
    account="rYourAddress",
    taker_pays={ ... },
    taker_gets=xrp_to_drops(100),
    expiration=expiry_xrpl,
)
```

**Always reject expiry values ≤ current XRPL ledger time at construction.** The
offer will fail with `tecEXPIRED` if the expiry has already passed when the
transaction is processed (race condition possible even with future-dated expiry
near the boundary).

### 1.7 Atomic offer replacement

Replace an existing resting offer in a single transaction by setting `OfferSequence`
on a new `OfferCreate`. The old offer is cancelled atomically before the new one
is created, regardless of whether the new one fills or rests.

```typescript
const offer: OfferCreate = {
  TransactionType: "OfferCreate",
  Account: "rYourAddress",
  TakerPays: { /* new amounts */ },
  TakerGets: xrpToDrops(120),
  OfferSequence: 42,   // cancel existing offer #42 atomically
};
```

```python
offer = OfferCreate(
    account="rYourAddress",
    taker_pays={ ... },           # new amounts
    taker_gets=xrp_to_drops(120),
    offer_sequence=42,            # cancel existing offer #42 atomically
)
# → hand to XRPL Agent Wallet skill
```

---

## 2. OfferCancel patterns

### 2.1 Cancel a single resting offer

```typescript
import { OfferCancel } from "xrpl";

const cancel: Omit<OfferCancel, "Fee" | "Sequence" | "LastLedgerSequence" | "SourceTag"> = {
  TransactionType: "OfferCancel",
  Account: "rYourAddress",
  OfferSequence: 42,   // the Sequence of the OfferCreate that created this offer
};
// → hand to XRPL Agent Wallet skill
```

```python
from xrpl.models.transactions import OfferCancel

cancel = OfferCancel(
    account="rYourAddress",
    offer_sequence=42,
)
```

**Important:** `OfferSequence` is the `Sequence` of the **original `OfferCreate`
transaction**, not the sequence of the `OfferCancel`. If no matching offer is
found (already filled or never existed), the cancel succeeds (`tesSUCCESS`) but
does nothing — the fee is still charged. Always verify offer existence via
`account_offers` before submitting.

### 2.2 Verify ownership before cancelling

```python
from xrpl.models.requests import AccountOffers

offers_request = AccountOffers(account="rYourAddress")
# send via xrpl-py client, check result.result["offers"]
# filter for {"seq": target_sequence}
```

```typescript
const result = await client.request({
  command: "account_offers",
  account: "rYourAddress",
});
const target = result.result.offers.find(o => o.seq === targetSequence);
if (!target) { /* inform user — offer not found */ }
```

---

## 3. Order book reads

### 3.0 Funding: `book_offers` can advertise more than it can deliver

**`book_offers` can return offers the owner cannot currently fund, and they look
identical to real ones unless you check.** An offer's `TakerGets`/`TakerPays`
are the amounts it was *created* with. What it can actually deliver depends
on the owner's present balance.

When an offer is not fully funded, `xrpld` adds two fields alongside the
originals:

| Field | Meaning |
| :---- | :---- |
| `taker_gets_funded` | What the taker can actually get from this offer now |
| `taker_pays_funded` | What the taker would actually pay |
| `owner_funds` | The owner's spendable balance of the `TakerGets` currency. Only on the owner's **highest-ranked** offer in this book. |

Two properties matter, and both are easy to get wrong:

1. **`taker_gets_funded` can be `0`.** A completely unfunded offer is still
   returned, with a real-looking price and size. It is a phantom price level.
2. **An owner's offers share one balance.** `xrpld` allocates the owner's funds
   to their best-ranked offer and returns the rest as `0` — so summing
   `taker_gets_funded` across a book is safe and never double-counts.

**Rule: always resolve the funded amount before using an offer for anything.**

```typescript
/** What this offer can actually deliver right now. */
const fundedGets = (o: any) => o.taker_gets_funded ?? o.TakerGets;
const fundedPays = (o: any) => o.taker_pays_funded ?? o.TakerPays;

/** Offers that can actually trade. Drop the phantoms. */
const liveOffers = (offers: any[]) => offers.filter(o => amt(fundedGets(o)) > 0);
```

```python
def funded_gets(o): return o.get("taker_gets_funded", o["TakerGets"])
def funded_pays(o): return o.get("taker_pays_funded", o["TakerPays"])

def live_offers(offers):
    return [o for o in offers if _amt(funded_gets(o)) > 0]
```

An offer's *price* is always `TakerPays / TakerGets` — the original amounts.
Funding changes the **size** available at that price, never the price itself.
Use the original amounts for price, the funded amounts for size.

### 3.1 `book_offers` — asks side (offers to sell base)

```python
from xrpl.models.requests import BookOffers

# XRP/USD order book — asks (selling XRP for USD)
request = BookOffers(
    taker_pays={"currency": "USD", "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"},
    taker_gets={"currency": "XRP"},
    limit=20,
)
```

```typescript
const asks = await client.request({
  command: "book_offers",
  taker_pays: { currency: "USD", issuer: "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B" },
  taker_gets: { currency: "XRP" },
  limit: 20,
});
```

### 3.2 Both sides of the book in parallel

```typescript
const [asks, bids] = await Promise.all([
  client.request({
    command: "book_offers",
    taker_pays: { currency: "USD", issuer: "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B" },
    taker_gets: { currency: "XRP" },
    limit: 20,
  }),
  client.request({
    command: "book_offers",
    taker_pays: { currency: "XRP" },
    taker_gets: { currency: "USD", issuer: "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B" },
    limit: 20,
  }),
]);
```

```python
import asyncio
from xrpl.asyncio.clients import AsyncJsonRpcClient

async def get_both_sides(client: AsyncJsonRpcClient, issuer: str):
    asks_req = BookOffers(
        taker_pays={"currency": "USD", "issuer": issuer},
        taker_gets={"currency": "XRP"},
        limit=20,
    )
    bids_req = BookOffers(
        taker_pays={"currency": "XRP"},
        taker_gets={"currency": "USD", "issuer": issuer},
        limit=20,
    )
    asks, bids = await asyncio.gather(
        client.request(asks_req),
        client.request(bids_req),
    )
    return asks.result["offers"], bids.result["offers"]


# Bind the names the next section consumes:
ask_offers, bid_offers = await get_both_sides(client, issuer)
```

### 3.3 Computing mid price and slippage

Each order book reports the quality of an offer as `TakerPays / TakerGets`. Never compare the two sides of a market using their quality values as-is. `TakerPays` and `TakerGets` swap places depending on which book you read, so the two values are reciprocals of each other.

Before calculating mid price or spread, decide on a base asset, then invert one book so both bid and ask are expressed in the same base unit.

```typescript
import { dropsToXrp } from "xrpl";

const isXRP = (a: unknown): a is string => typeof a === "string";
const amt   = (a: any) => isXRP(a) ? Number(dropsToXrp(a)) : Number(a.value);

/** Price of BASE denominated in QUOTE.
 *  bookGetsBase = true when the book was queried with taker_gets = base. */
const offerPrice = (o: any, bookGetsBase: boolean) =>
  bookGetsBase ? amt(o.TakerPays) / amt(o.TakerGets)
               : amt(o.TakerGets) / amt(o.TakerPays);

// Drop unfunded phantoms FIRST (see 3.0) — offers[0] may not be tradeable.
const askOffers = liveOffers(asks.result.offers);   // taker_gets = XRP  -> bookGetsBase = true
const bidOffers = liveOffers(bids.result.offers);   // taker_pays = XRP  -> bookGetsBase = false

const bestAsk = askOffers.length ? offerPrice(askOffers[0], true)  : null;
const bestBid = bidOffers.length ? offerPrice(bidOffers[0], false) : null;

// A one-sided book has NO mid price and NO spread. Say so; do not invent one.
const midPrice  = bestAsk !== null && bestBid !== null ? (bestAsk + bestBid) / 2 : null;
const spreadPct = midPrice !== null ? ((bestAsk! - bestBid!) / midPrice) * 100 : null;
```

```python
from xrpl.utils import drops_to_xrp

def _amt(a):
    return float(drops_to_xrp(a)) if isinstance(a, str) else float(a["value"])

def _offer_price(o, book_gets_base: bool) -> float:
    return (_amt(o["TakerPays"]) / _amt(o["TakerGets"])) if book_gets_base \
        else (_amt(o["TakerGets"]) / _amt(o["TakerPays"]))

def compute_mid_spread(ask_offers: list, bid_offers: list):
    # Drop unfunded phantoms FIRST (see 3.0) — offers[0] may not be tradeable.
    ask_offers = live_offers(ask_offers)
    bid_offers = live_offers(bid_offers)
    best_ask = _offer_price(ask_offers[0], True)  if ask_offers else None
    best_bid = _offer_price(bid_offers[0], False) if bid_offers else None
    if best_ask is None or best_bid is None:
        return None, None          # one-sided book: undefined, not zero/infinity
    mid = (best_ask + best_bid) / 2
    return mid, (best_ask - best_bid) / mid * 100


# Call site, continuing from §3.2:
mid_price, spread_pct = compute_mid_spread(ask_offers, bid_offers)
if mid_price is None:
    print("One-sided book - mid price and spread are undefined.")
else:
    print(f"Mid price: {mid_price:.6f}  Spread: {spread_pct:.3f} %")
```

### 3.4 Estimated fill and slippage — walk the book by funded size

The pre-trade summary's `Est. fill` and `Slippage` must be computed from **funded**
amounts. Walking raw `TakerGets` overstates available liquidity.

Two things determine correctness, and both are easy to get wrong:

1. **Base-side capacity lives on a different field per book.** The base sits on
   `TakerGets` for an ask book but on `TakerPays` for a bid book. Reading
   `taker_gets_funded` on a bid book compares *quote* units against a *base*
   order size.
2. **The walk must stop at the limit price.** Levels beyond the limit cannot
   cross, so counting them reports fill the order will never get.

Walk offers in book order, taking the funded base-side size of each until the
order is filled, the limit price is passed, or the book runs out. Anything left
over does not cross.

```typescript
/** Estimate execution against a live book.
 *  wantBase   — how much BASE to trade, in human units.
 *  limitPrice — QUOTE per BASE. Omit for a market-style estimate.
 *  midPrice   — from §3.3, for the mid-relative slippage the summary requires. */
function estimateFill(
  offers: any[], wantBase: number, bookGetsBase: boolean,
  limitPrice?: number, midPrice?: number,
) {
  let remaining = wantBase, quote = 0, base = 0, bestCrossing: number | null = null;

  for (const o of offers) {
    // Base-side capacity: TakerGets on an ask book, TakerPays on a bid book.
    const avail = bookGetsBase ? amt(fundedGets(o)) : amt(fundedPays(o));
    if (!(avail > 0)) continue;                      // phantom level — skip

    const price = offerPrice(o, bookGetsBase);        // price from ORIGINAL amounts
    if (!Number.isFinite(price) || price <= 0) continue;

    // Buying base: pay no more than the limit. Selling base: receive no less.
    if (limitPrice !== undefined &&
        (bookGetsBase ? price > limitPrice : price < limitPrice)) break;

    if (bestCrossing === null) bestCrossing = price;
    const take = Math.min(remaining, avail);
    base += take;
    quote += take * price;
    remaining -= take;
    if (remaining <= 1e-12) break;
  }

  if (base === 0) {
    return { fillable: 0, avgPrice: null, slippageVsBestPct: null, slippageVsMidPct: null };
  }
  const avgPrice = quote / base;
  return {
    fillable: base / wantBase,                                        // 0..1
    avgPrice,
    slippageVsBestPct: ((avgPrice - bestCrossing!) / bestCrossing!) * 100,
    slippageVsMidPct: midPrice ? ((avgPrice - midPrice) / midPrice) * 100 : null,
  };
}
```

```python
def estimate_fill(offers, want_base: float, book_gets_base: bool,
                  limit_price: float | None = None, mid_price: float | None = None):
    remaining, quote, base, best_crossing = want_base, 0.0, 0.0, None

    for o in offers:
        # Base-side capacity: TakerGets on an ask book, TakerPays on a bid book.
        avail = _amt(funded_gets(o)) if book_gets_base else _amt(funded_pays(o))
        if not avail > 0:                    # phantom level - skip
            continue

        price = _offer_price(o, book_gets_base)   # price from ORIGINAL amounts
        if price <= 0:
            continue

        # Buying base: pay no more than the limit. Selling base: receive no less.
        if limit_price is not None and (
                price > limit_price if book_gets_base else price < limit_price):
            break

        if best_crossing is None:
            best_crossing = price
        take = min(remaining, avail)
        base += take
        quote += take * price
        remaining -= take
        if remaining <= 1e-12:
            break

    if base == 0:
        return {"fillable": 0.0, "avg_price": None,
                "slippage_vs_best_pct": None, "slippage_vs_mid_pct": None}

    avg = quote / base
    return {
        "fillable": base / want_base,
        "avg_price": avg,
        "slippage_vs_best_pct": (avg - best_crossing) / best_crossing * 100,
        "slippage_vs_mid_pct": ((avg - mid_price) / mid_price * 100) if mid_price else None,
    }
```

Report `slippage_vs_mid_pct` in the pre-trade summary. `slippage_vs_best_pct`
isolates depth impact from the spread and is useful for diagnostics. A negative
value means later levels priced better than the first one that crossed.

If `fillable` is `0`, nothing crosses at the limit price — say so, rather than
reporting a slippage figure. If `fillable` is less than `1`, the remainder will
rest on the book (or be cancelled, with `tfImmediateOrCancel`).

---

## 4. Cross-currency flows via DEX

On XRPL, cross-currency payments route through the DEX automatically. There are
two patterns:

### 4.1 Cross-currency `Payment` (single-step, user receives exact amount)

Use when the user wants to deliver an exact amount of a target currency, paying
whatever the DEX rate requires (up to `SendMax`). Path-finding is handled by the
ledger; no manual path construction needed for common pairs.

```typescript
import { Payment, xrpToDrops } from "xrpl";

// Pay exactly 50 USD.Bitstamp; spend at most 110 XRP to do it
const payment: Payment = {
  TransactionType: "Payment",
  Account: "rSenderAddress",
  Destination: "rRecipientAddress",
  Amount: {
    currency: "USD",
    issuer: "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
    value: "50",
  },
  SendMax: xrpToDrops(110),   // slippage ceiling
};
```

```python
from xrpl.models.transactions import Payment
from xrpl.models.amounts import IssuedCurrencyAmount

payment = Payment(
    account="rSenderAddress",
    destination="rRecipientAddress",
    amount=IssuedCurrencyAmount(
        currency="USD",
        issuer="rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
        value="50",
    ),
    send_max=xrp_to_drops(110),
)
```

**Note:** Cross-currency `Payment` is handled by the XRPL Payments skill. The
Trading skill handles `OfferCreate`-based limit orders. For agent flows that need
explicit limit prices, use `OfferCreate`. For flows that need exact delivery
amounts (e.g. x402 payments), use `Payment` with `SendMax`.

### 4.2 OfferCreate as a limit-priced currency exchange

Use `OfferCreate` when the agent needs to exchange currencies at a specific limit
price. The offer will cross against the book immediately; any remainder rests.
This is a limit-order exchange, not an exact-delivery payment.

The TakerPays/TakerGets encoding implicitly defines the limit price:
```
limit_rate = TakerPays / TakerGets
```

```typescript
// Sell exactly 100 XRP at a limit rate of 0.5 USD/XRP (receive at least 50 USD)
const offer: OfferCreate = {
  TransactionType: "OfferCreate",
  Account: "rYourAddress",
  TakerPays: { currency: "USD", issuer: "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B", value: "50" },
  TakerGets: xrpToDrops(100),
  // No flags: remainder rests on the book if not immediately crossed
};
```

```python
# Sell exactly 100 XRP at a limit rate of 0.5 USD/XRP (receive at least 50 USD)
offer = OfferCreate(
    account="rYourAddress",
    taker_pays={
        "currency": "USD",
        "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
        "value": "50",
    },
    taker_gets=xrp_to_drops(100),
    # No flags: remainder rests on the book if not immediately crossed
)
# → hand to XRPL Agent Wallet skill
```

---

## 5. AMM interaction

XRPL AMM pools (introduced in the AMM amendment) are integrated directly
into the DEX. **There is no separate `AMMSwap` transaction type.** AMM liquidity
is consumed automatically when the DEX path-finder routes `OfferCreate` or
cross-currency `Payment` transactions — the AMM competes with order book offers
for the best price.

### 5.1 Swapping via AMM (implicit)

No special transaction construction is needed. A standard `OfferCreate` or
cross-currency `Payment` will draw on AMM liquidity if the AMM offers a better
rate than the order book. The ledger selects the best available combination.

```typescript
// This OfferCreate will cross against order book AND AMM liquidity if AMM is deeper
const offer: OfferCreate = {
  TransactionType: "OfferCreate",
  Account: "rYourAddress",
  TakerPays: { currency: "USD", issuer: "rvYAfWj5...", value: "50" },
  TakerGets: xrpToDrops(100),
  Flags: OfferCreateFlags.tfImmediateOrCancel,  // treat as market swap
};
```

```python
# This OfferCreate will cross against order book AND AMM liquidity if AMM is deeper
offer = OfferCreate(
    account="rYourAddress",
    taker_pays={"currency": "USD", "issuer": "rvYAfWj5...", "value": "50"},
    taker_gets=xrp_to_drops(100),
    flags=OfferCreateFlag.TF_IMMEDIATE_OR_CANCEL,   # treat as market swap
)
# → hand to XRPL Agent Wallet skill
```

### 5.2 AMM pool management transactions

These are provided for completeness. Agent trading flows should generally not
manage AMM pools without explicit user instruction.

| Transaction | Purpose |
| :---- | :---- |
| `AMMCreate` | Create a new AMM pool for a currency pair |
| `AMMDeposit` | Add liquidity to an existing pool; receive LP tokens |
| `AMMWithdraw` | Remove liquidity; redeem LP tokens |
| `AMMBid` | Bid for the auction slot (reduces trading fees for the winner) |
| `AMMVote` | Vote on the AMM trading fee (weighted by LP token holdings) |

---

## 6. Agentic patterns

### 6.1 Source tag

The XRPL Agent Wallet skill applies `SourceTag = 20260530` to every transaction
automatically, on every signing path (env-var, external signer and OWS alike). This tags all agent-originated transactions on-chain
for attribution and volume tracking. Override by setting `SourceTag` on the
transaction object before handoff; the Wallet skill respects any value already
present.

You do not need to set `SourceTag` — the Wallet skill applies it. Set it only for
a deliberate custom tag, or `0` to opt out; the Wallet skill respects any value
already present. Note that a transaction submitted outside the signing ceremony
is untagged, and no error is raised.

### 6.2 Memos for on-chain audit trail

Add a `Memos` field to every agent-initiated transaction to provide a human-
readable audit record on-chain. Memo data must be hex-encoded.

```typescript
import { convertStringToHex } from "xrpl";

const offer: OfferCreate = {
  TransactionType: "OfferCreate",
  Account: "rYourAddress",
  TakerPays: { /* ... */ },
  TakerGets: xrpToDrops(100),
  Memos: [
    {
      Memo: {
        MemoType: convertStringToHex("agent/trade"),
        MemoData: convertStringToHex(JSON.stringify({
          skill:   "xrpl-trading",
          reason:  "user-requested limit order",
          ts:      new Date().toISOString(),
        })),
      },
    },
  ],
};
```

```python
from xrpl.utils import str_to_hex
from xrpl.models.transactions import Memo

offer = OfferCreate(
    account="rYourAddress",
    taker_pays={ ... },
    taker_gets=xrp_to_drops(100),
    memos=[
        Memo(
            memo_type=str_to_hex("agent/trade"),
            memo_data=str_to_hex('{"skill":"xrpl-trading","reason":"user-requested"}'),
        )
    ],
)
```

**Memo limits:** Total transaction size (including memos) cannot exceed 1232 bytes.
Keep memo payloads short.

### 6.3 Monitoring resting offers via WebSocket

After an offer rests on the book, subscribe to `transaction` stream to detect
fills asynchronously.

```typescript
await client.request({
  command: "subscribe",
  accounts: ["rYourAddress"],
});

client.on("transaction", (tx) => {
  if (tx.tx_json.TransactionType === "OfferCreate") {
    // Check meta.AffectedNodes for DeletedNode on your resting offer
    const nodes = tx.meta?.AffectedNodes ?? [];
    const deleted = nodes.find(
      n => n.DeletedNode?.LedgerEntryType === "Offer" &&
           n.DeletedNode?.FinalFields?.Account === "rYourAddress" &&
           n.DeletedNode?.FinalFields?.Sequence === yourOfferSequence
    );
    if (deleted) console.log("Offer filled by counterparty.");
  }
});
```

---

## 7. Simulate before handoff

Use `simulate` on the raw transaction object (before `autofill`) to catch errors
without spending fees or triggering the signing ceremony. This is especially
important for new currency pairs, first-time trust line interactions, or large
offers.

```python
from xrpl.models.requests import Simulate

# Build raw tx (no Fee/Sequence)
raw_offer = OfferCreate(
    account="rYourAddress",
    taker_pays={ ... },
    taker_gets=xrp_to_drops(100),
)

sim_result = client.request(Simulate(transaction=raw_offer))
# inspect sim_result.result["engine_result"] and sim_result.result["meta"]
```

```typescript
// xrpl.js: use the simulate request (available from rippled 2.x)
const simResult = await client.request({
  command: "simulate",
  tx_blob: encode(rawOffer),  // encode without autofill
});
// inspect simResult.result.engine_result
```

**If simulate returns a `tec*` or `tem*` code, do not proceed.** Fix the
transaction and simulate again before handing to the Wallet skill.

---

## 8. Error codes

| Engine result | Fee charged? | Meaning | Resolution |
| :---- | :---- | :---- | :---- |
| `tesSUCCESS` | Yes | Transaction accepted and applied | Parse fill status from `meta.AffectedNodes` |
| `tecUNFUNDED_OFFER` | Yes | Account XRP or IOU balance insufficient to fund the offer | Check balance. Account needs XRP ≥ offer value + fee + reserve buffer, or IOU ≥ offer value. |
| `tecEXPIRED` | Yes | `Expiration` already passed when ledger closed | Reject at construction. If boundary race, re-offer with future expiry. |
| `tecKILLED` | Yes | `tfFillOrKill` could not fill completely, **or** `tfImmediateOrCancel` matched nothing at all | Do not retry. Ask user to retry with an adjusted price. |
| `tecUNFUNDED_OFFER` (IOU sell side) | Yes | Account does not hold the IOU in `TakerGets`; includes the no-trust-line case | Account must actually hold the asset. A `TrustSet` alone does not fund the offer. Buying an IOU needs no trust line. |
| `tecINSUF_RESERVE_OFFER` | Yes | Insufficient XRP reserve to create new offer object | Each resting offer requires 0.2 XRP owner reserve. Cancel existing offers or fund account. |
| `tecDIR_FULL` | Yes | The owner owns too many ledger items, or the order book already holds too many offers at this exact exchange rate | Cancel existing offers, or adjust the price slightly. Effectively impossible once the `fixDirectoryLimit` amendment is enabled. |
| `tecFROZEN` | Yes | The **`TakerPays`** token has been **deep-frozen** by its issuer. A regular freeze does not produce this, and neither does a freeze on the sell side | Do not retry until the issuer lifts the deep freeze. See §8.1 for the full freeze matrix. |
| `tecNO_AUTH` | Yes | The issuer uses [Authorized Trust Lines][] and the trust line that would receive the token exists but is **not authorized** | The issuer must authorize the line. Do not retry until then. |
| `tecNO_ISSUER` | Yes | The `issuer` in one of the amounts is not a funded account in the ledger | Check the issuer address. Frequently a typo or a token that does not exist. |
| `tecNO_LINE` | Yes | The issuer uses [Authorized Trust Lines][] and the required trust line **does not exist** | Create the trust line (and get it authorized) first. Only occurs for `RequireAuth` issuers — see the note below. |
| `tecNO_PERMISSION` | Yes | The transaction sets a `DomainID` but the sender is not a member of that domain | Permissioned DEX only. Sender must join the domain. |
| `temBAD_CURRENCY` | No | A token is specified incorrectly, e.g. currency code `"XRP"` on an issued amount | Fix construction. **xrpl.js rejects this client-side before signing**, so it usually surfaces as an SDK error, not a ledger result. |
| `temBAD_EXPIRATION` | No | `Expiration` field value is invalid | Recompute using `XRPL_epoch = Unix_s − 946,684,800`. |
| `temBAD_ISSUER` | No | The `issuer` field of a token is malformed | Fix construction. |
| `temBAD_OFFER` | No | The offer trades XRP for XRP, or an invalid/negative token amount | Fix construction and re-simulate. |
| `temBAD_SEQUENCE` | No | `OfferSequence` is malformed, or is **higher than the transaction's own `Sequence`** | Fix construction. Never enters a ledger, so no fee is charged. |
| `temINVALID_FLAG` | No | Invalid flag combination (`tfImmediateOrCancel` + `tfFillOrKill`), or `tfHybrid` without `DomainID` | Reject at construction. |
| `temREDUNDANT` | No | The transaction would trade a token for the same token (same issuer and currency code). | Adjust token. |

**`tec*` vs no-fee results:** Any `tec*` code means the transaction was included
in the ledger and the fee was charged, even though no fill occurred. Always
inform the user when a fee was consumed without a successful outcome. `tem*`
codes are rejected before the transaction enters a ledger and cost nothing.

### 8.1 Trust-line errors depend on the issuer and the side

These four are easy to confuse. All were reproduced on Testnet.

| Situation | Result |
| :---- | :---- |
| **Sell** an IOU you do not hold (ordinary issuer) | `tecUNFUNDED_OFFER` |
| **Buy** an IOU, ordinary issuer, no trust line | `tesSUCCESS` — the ledger auto-creates the line (costs 1 owner reserve) |
| **Buy** an IOU from a `RequireAuth` issuer, no trust line | `tecNO_LINE` |
| **Buy** an IOU from a `RequireAuth` issuer, line exists but unauthorized | `tecNO_AUTH` |

So a missing `TakerPays` trust line is harmless for ordinary issuers and fatal
for `RequireAuth` issuers. Detect the difference before building the offer:

```typescript
const info = await client.request({ command: "account_info", account: issuer });
const requiresAuth = (info.result.account_data.Flags & 0x00040000) !== 0; // lsfRequireAuth
```

Freeze is asymmetric in the same way, and the *kind* of freeze matters. All four
combinations reproduced on Testnet:

| Freeze on the line | Sell that token | Buy that token |
| :---- | :---- | :---- |
| Regular (`tfSetFreeze`) | `tecUNFUNDED_OFFER` | `tesSUCCESS` — **not blocked** |
| Deep (`tfSetDeepFreeze`) | `tecUNFUNDED_OFFER` | `tecFROZEN` |

So `tecFROZEN` appears only on the **buy** side of a **deep**-frozen line. Every
other frozen combination that fails does so as `tecUNFUNDED_OFFER`. Detect freeze
state from `account_lines` — `freeze_peer` for a regular freeze by the issuer,
`deep_freeze_peer` for a deep freeze.

### 8.2 OfferCancel

The protocol reference does not document error cases for `OfferCancel`. These
were reproduced on Testnet:

| Engine result | Fee charged? | Cause |
| :---- | :---- | :---- |
| `tesSUCCESS` | Yes | Normal — **also returned when the offer does not exist.** The fee is charged and nothing happens. Verify with `account_offers` first. |
| `temBAD_SEQUENCE` | No | `OfferSequence` is `0`, or is greater than the transaction's own `Sequence`. |

[Authorized Trust Lines]: /docs/concepts/tokens/fungible-tokens/authorized-trust-lines/

---

## 9. Reserve requirements

The XRPL base reserve is **1 XRP**. Each owner reserve (per object in account's
ownership) is **0.2 XRP** (current values — verify at `/server_info`).

| Object | Owner reserve cost |
| :---- | :---- |
| Resting offer on the book | 1 owner reserve (0.2 XRP) |
| Trust line (each) | 1 owner reserve (0.2 XRP) |
| Trust line **auto-created** when you buy an IOU you had no line for | 1 owner reserve (0.2 XRP) |

Read the live values from `server_info` (`validated_ledger.reserve_base_xrp`,
`reserve_inc_xrp`) rather than hard-coding them — they are governance-adjustable.

**Practical rule:** Before allowing an offer to rest on the book, verify:

```
available_xrp = balance - base_reserve - (owner_count × owner_reserve)
```

A resting offer that would drop `available_xrp` below 0 will fail with
`tecINSUF_RESERVE_OFFER`.

```python
from xrpl.models.requests import AccountInfo

info = client.request(AccountInfo(account="rYourAddress", ledger_index="current"))
data          = info.result["account_data"]
balance_drops = int(data["Balance"])
owner_count   = data["OwnerCount"]

BASE_RESERVE_DROPS  = 1_000_000   # 1 XRP — verify from server_info
OWNER_RESERVE_DROPS =   200_000   # 0.2 XRP — verify from server_info

available_drops = balance_drops - BASE_RESERVE_DROPS - (owner_count * OWNER_RESERVE_DROPS)
```

```typescript
const info = await client.request({ command: "account_info", account: "rYourAddress", ledger_index: "current" });
const data = info.result.account_data;
const available = Number(data.Balance)
  - 1_000_000
  - (data.OwnerCount * 200_000);
```

Always check `available_drops` ≥ the XRP amount in `TakerGets` (if XRP is being
sold) plus enough for the new offer's owner reserve before submitting.