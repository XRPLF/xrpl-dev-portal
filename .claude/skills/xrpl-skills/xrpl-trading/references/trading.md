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
    # SourceTag: applied by Wallet skill (OWS) automatically
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
    issuer: "rHivis7NKi5nrSBUMmJRGFMNwMdyB9rpQ6",  // example EUR issuer
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
        "issuer": "rHivis7NKi5nrSBUMmJRGFMNwMdyB9rpQ6",
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

**⚠ Trust line check required:** Before constructing any offer with an IOU side,
verify the signing account holds an active trust line to the relevant issuer. A
missing trust line causes `tecNO_LINE` on submission (fee charged, no fill).

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

`tfPassive`: posts to the order book without crossing against existing offers,
even if a crossing opportunity exists at the time of submission. Use for maker-only
strategies.

```typescript
Flags: OfferCreateFlags.tfPassive,
```

```python
flags=OfferCreateFlag.TF_PASSIVE,
```

**Never set `tfPassive` by default.** Only set when the user explicitly requests
"post only" or "maker only" behaviour.

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
```

### 3.3 Computing mid price and slippage

```typescript
import { dropsToXrp } from "xrpl";

// Each offer in book_offers has `quality` = taker_pays / taker_gets (as decimal string)
const askOffers = asks.result.offers;
const bidOffers = bids.result.offers;

const bestAsk = askOffers.length ? parseFloat(askOffers[0].quality) : Infinity;
const bestBid = bidOffers.length  ? parseFloat(bidOffers[0].quality)  : 0;
const midPrice = (bestAsk + bestBid) / 2;
const spreadPct = midPrice > 0 ? ((bestAsk - bestBid) / midPrice) * 100 : null;
```

```python
# Each offer in book_offers has "quality" = taker_pays / taker_gets (decimal string)
def compute_mid_spread(ask_offers: list, bid_offers: list):
    best_ask = float(ask_offers[0]["quality"]) if ask_offers else float("inf")
    best_bid = float(bid_offers[0]["quality"]) if bid_offers else 0.0
    mid_price = (best_ask + best_bid) / 2
    spread_pct = ((best_ask - best_bid) / mid_price * 100) if mid_price > 0 else None
    return mid_price, spread_pct
```

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

XRPL AMM pools (introduced in the Clawback amendment) are integrated directly
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

The XRPL Agent Wallet skill (OWS) applies `SourceTag = 20260530` to every
transaction automatically. This tags all agent-originated transactions on-chain
for attribution and volume tracking. Override by setting `SourceTag` on the
transaction object before handoff; the Wallet skill respects any value already
present.

Do not omit `SourceTag`. Untagged agent transactions cannot be attributed in
ledger history or monitoring.

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
from xrpl.models.transactions.types import Memo, MemoWrapper

offer = OfferCreate(
    account="rYourAddress",
    taker_pays={ ... },
    taker_gets=xrp_to_drops(100),
    memos=[
        MemoWrapper(memo=Memo(
            memo_type=str_to_hex("agent/trade"),
            memo_data=str_to_hex('{"skill":"xrpl-trading","reason":"user-requested"}'),
        ))
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
  if (tx.transaction.TransactionType === "OfferCreate") {
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
from xrpl.models.requests import SimulateTransaction  # xrpl-py ≥ 4.x

# Build raw tx (no Fee/Sequence)
raw_offer = OfferCreate(
    account="rYourAddress",
    taker_pays={ ... },
    taker_gets=xrp_to_drops(100),
)

sim_result = client.request(SimulateTransaction(tx_blob=raw_offer.to_xrpl()))
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
| `tecUNFUNDED_OFFER` | Yes | Account XRP balance insufficient to fund the offer | Check balance. Account needs XRP ≥ offer value + fee + reserve buffer. |
| `tecEXPIRED` | Yes | `Expiration` already passed when ledger closed | Reject at construction. If boundary race, re-offer with future expiry. |
| `tecKILLED` | Yes | `tfFillOrKill` offer could not fill completely | Do not retry. Ask user to retry with `tfImmediateOrCancel` or adjusted price. |
| `tecNO_LINE` | Yes | No trust line for an IOU in the offer | User must establish trust line (`TrustSet`) before retrying. |
| `tecINSUF_RESERVE_OFFER` | Yes | Insufficient XRP reserve to create new offer object | Each resting offer requires 2 XRP owner reserve. Cancel existing offers or fund account. |
| `tecDIR_FULL` | Yes | Offer directory is full (too many offers from this account) | Cancel some existing offers before creating new ones. |
| `temBAD_OFFER` | No | Malformed transaction (zero amounts, invalid fields, bad flags) | Fix construction and re-simulate. |
| `temBAD_EXPIRATION` | No | `Expiration` field value is invalid | Recompute using `XRPL_epoch = Unix_s − 946,684,800`. |
| `temINVALID_FLAG` | No | Invalid flag combination (`tfImmediateOrCancel` + `tfFillOrKill`) | Reject at construction. |
| `temREDUNDANT` | No | `TakerPays` == `TakerGets` after quality normalization | Adjust amounts. |

**`tec*` vs no-fee results:** Any `tec*` code means the transaction was included
in the ledger and the fee was charged, even though no fill occurred. Always
inform the user when a fee was consumed without a successful outcome.

---

## 9. Reserve requirements

The XRPL base reserve is **1 XRP**. Each owner reserve (per object in account's
ownership) is **0.2 XRP** (current values — verify at `/server_info`).

| Object | Owner reserve cost |
| :---- | :---- |
| Resting offer on the book | 1 owner reserve (0.2 XRP) |
| Trust line (each) | 1 owner reserve (0.2 XRP) |

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