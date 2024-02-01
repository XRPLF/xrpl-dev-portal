---
html: offers.html
parent: decentralized-exchange.html
seo:
    description: Offers are the XRP Ledger's form of currency trading orders. Understand their lifecycle and properties.
labels:
  - Decentralized Exchange
---
# Offers

In the XRP Ledger's [decentralized exchange](index.md), trade orders are called "Offers". Offers can trade XRP with [tokens](../index.md), or tokens for other tokens, including tokens with the same currency code but different issuers. (Tokens with the same code but different issuers can also sometimes be exchanged through [rippling](../fungible-tokens/rippling.md).)

- To create an Offer, send an [OfferCreate transaction][].
- Offers that aren't fully filled immediately become [Offer objects](../../../references/protocol/ledger-data/ledger-entry-types/offer.md) in the ledger data. Later Offers and Payments can consume the Offer object from the ledger.
- [Cross-currency payments](../../payment-types/cross-currency-payments.md) consume Offers to provide liquidity. However, they never create Offer objects in the ledger.

## Lifecycle of an Offer

An [OfferCreate transaction][] is an instruction to conduct a trade, either between two tokens, or a token and XRP. Every such transaction contains a buy amount (`TakerPays`) and a sell amount (`TakerGets`). When the transaction is processed, it automatically consumes matching or crossing Offers to the extent possible. If that does not completely fill the new Offer, then the rest becomes an Offer object in the ledger.

The Offer object waits in the ledger until other Offers or cross-currency payments fully consume it. The account that placed the Offer is called the Offer's _owner_. You can cancel your own Offers at any time, using the dedicated [OfferCancel transaction][], or as an option of the [OfferCreate transaction][].

While you have an Offer in the ledger, it sets aside some of your XRP toward the [owner reserve](../../accounts/reserves.md). When the Offer gets removed, for any reason, that XRP is freed up again.

### Variations

- **Buy vs. Sell:** By default, Offers are "buy" Offers and are considered fully filled when you have acquired the entire "buy" (`TakerPays`) amount. (You may spend less than you expected while receiving the specified amount.) By contrast, a "Sell" Offer is only considered fully filled when you have spent the entire "sell" (`TakerGets`) amount. (You may receive more than you expected while spending the specified amount.) This is only relevant if the Offer _initially_ executes at better than its requested exchange rate: after the Offer gets placed into the ledger, it only ever executes at _exactly_ the requested exchange rate.
- An **Immediate or Cancel** Offer is not placed into the ledger, so it only trades up to the amount that matches existing, matching Offers at the time the transaction is processed.
- A **Fill or Kill** Offer is not placed into the ledger, _and_ it is canceled if the full amount is not filled when it initially executes. This is similar to "Immediate or Cancel" except it _cannot_ be partially filled.
- A **Passive** Offer does not consume matching Offers that have the exact same exchange rate (going the other direction), and instead is placed directly into the ledger. You can use this to create an exact peg between two assets. Passive Offers still consume other Offers that have a _better_ exchange rate going the other way.


### Funding Requirements

When you try to place an Offer, the transaction is rejected as "unfunded" if you don't have at least some of the asset that the trade would sell. More specifically:

**To sell a token,** you must either:

- Hold any positive amount of that token, _or_
- Be the token's issuer.

However, you don't need to hold the full amount specified in the Offer. Placing an Offer does not lock up your funds, so you can place multiple Offers to sell the same tokens (or XRP), or place an Offer and hope to get enough tokens or XRP to fully fund it later.

**To sell XRP,** you must hold enough XRP to meet all the [reserve requirements](../../accounts/reserves.md), including the reserve for the Offer object to be placed in the ledger and for the trust line to hold the token you are buying. As long as you have any XRP left over after setting aside the reserve amount, you can place the Offer.

When another Offer matches yours, both Offers execute to the extent that their owners' funds allow at the the time. If there are matching Offers and you run out of funds before yours is fully filled, the rest of your Offer is canceled. An Offer can't make your balance of a token negative, unless you are the issuer of that token. (If you are the issuer, you can use Offers to issue new tokens up to the total amount specified in your Offers; tokens you issue are represented as negative balances from your perspective.)

If you place an Offer that crosses any of your own Offers that exist in the ledger, the old, crossed Offers are automatically canceled regardless of the amounts involved.

It is possible for an Offer to become temporarily or permanently _unfunded_ in the following cases:

- If the owner no longer has any of the sell asset.
    - The Offer becomes funded again when the owner obtains more of that asset.
- If the sell asset is a token in a [frozen trust line](../fungible-tokens/freezes.md).
    - The Offer becomes funded again when the trust line is no longer frozen.
- If the Offer needs to create a new trust line, but the owner does not have enough XRP for the increased [reserve](../../accounts/reserves.md). (See [Offers and Trust](#offers-and-trust).)
    - The offer becomes funded again when the owner obtains more XRP, or the reserve requirements decrease.
- If the Offer is expired. (See [Offer Expiration](#offer-expiration).)

An unfunded Offer stays on the ledger until a transaction removes it. Ways that an Offer can be removed from the ledger include:

- A matching Offer or [Cross-currency payment](../../payment-types/cross-currency-payments.md) fully consumes the Offer.
- The owner explicitly cancels the Offer.
- The owner implicitly cancels the Offer by sending a new Offer that crosses it.
- The Offer is found to be unfunded or expired during transaction processing. Typically this means that another Offer tried to consume it and could not.
    - This includes cases where the remaining amount that can be paid out by the Offer rounds down to zero.

### Tracking Unfunded Offers

Tracking the funding status of all Offers can be computationally taxing. In particular, addresses that are actively trading may have a large number of Offers open. A single balance can affect the funding status of many Offers. Because of this, the XRP Ledger does not _proactively_ find and remove unfunded or expired Offers.

A client application can locally track the funding status of Offers. To do this, first retrieve an order book using the [book_offers method][] and check the `taker_gets_funded` field of Offers. Then, [subscribe](../../../references/http-websocket-apis/public-api-methods/subscription-methods/subscribe.md) to the `transactions` stream and watch the transaction metadata to see which Offers are modified.


## Offers and Trust

The limit values of [trust lines](../fungible-tokens/index.md) do not affect Offers. In other words, you can use an Offer to acquire more than the maximum amount you trust an issuer for.

However, holding tokens still requires a trust line to the issuer. When an Offer is consumed, it automatically creates any necessary trust lines, setting their limits to 0. Because [trust lines increase the reserve an account must hold](../../accounts/reserves.md), any Offers that would require a new trust line also require the address to have enough XRP to meet the reserve for that trust line.

Trust line limits protect you from receiving more of a token as payment than you want. Offers can go beyond those limits because they are an explicit statement of how much of the token you want.


## Offer Preference

Existing Offers are grouped by exchange rate, which is measured as the ratio between `TakerGets` and `TakerPays`. Offers with a higher exchange rate are taken preferentially. (That is, the person accepting the offer receives as much as possible for the amount of currency they pay out.) Offers with the same exchange rate are taken on the basis of which offer was placed first.

When Offers execute in the same ledger block, the order in which they execute is determined by the [canonical order](https://github.com/XRPLF/rippled/blob/release/src/ripple/app/misc/CanonicalTXSet.cpp "Source code: Transaction ordering") in which the transactions were [applied to the ledger](https://github.com/XRPLF/rippled/blob/5425a90f160711e46b2c1f1c93d68e5941e4bfb6/src/ripple/app/consensus/LedgerConsensus.cpp#L1435-L1538 "Source code: Applying transactions"). This behavior is designed to be deterministic, efficient, and hard to game.


## Offer Expiration

When you place an Offer, you can optionally add an expiration time to it. By default, Offers don't expire. You can't create a new Offer that is already expired.

Expiration times are specified down to the second, but the exact, real-world time when an Offer expires is less precise. An Offer is expired if it has an expiration time that is _earlier than or equal to_ the close time of the previous ledger. Otherwise, the Offer can still execute, even if the real-world time is later than the Offer's expiration. In other words, an Offer is still "active" if its expiration time is later than the close time of the latest validated ledger, regardless of what your clock says.

This is a consequence of how the network reaches agreement. For the entire peer-to-peer network to reach a consensus, all servers must agree which Offers are expired when executing transactions. Individual servers may have slight differences in their internal clock settings, so they might not reach the same conclusions about which Offers were expired if they each used the "current" time. The close time of a ledger is not known until after the transactions in that ledger have been executed, so servers use the official close time of the _previous_ ledger instead. The [close times of ledgers are rounded](../../ledgers/ledger-close-times.md), which further increases the potential difference between real-world time and the time used to determine if an Offer is expired.

**Note:** Expired Offers remain in the ledger data until a transaction removes them. Until then, they can continue to appear in data retrieved from the API (for example, using the [ledger_entry method][]). Transactions automatically delete any expired and unfunded Offers they find, usually while executing Offers or cross-currency payments that would have matched or canceled them. The owner reserve associated with an Offer is only made available again when the Offer is actually deleted.


## See Also

- **Concepts:**
    - [Tokens](../index.md)
    - [Paths](../fungible-tokens/paths.md)
- **References:**
    - [account_offers method][]
    - [book_offers method][]
    - [OfferCreate transaction][]
    - [OfferCancel transaction][]
    - [Offer object](../../../references/protocol/ledger-data/ledger-entry-types/offer.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
