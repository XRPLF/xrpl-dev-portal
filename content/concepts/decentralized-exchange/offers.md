---
html: offers.html
parent: decentralized-exchange.html
blurb: Offers are the XRP Ledger's form of currency trading orders. Understand their lifecycle and properties.
labels:
  - Decentralized Exchange
---
# Offers

In the XRP Ledger's [decentralized exchange](decentralized-exchange.html), trade orders are called "Offers". Offers can trade XRP with [tokens](tokens.html), or tokens for other tokens, including tokens with the same currency code but different issuers. (Tokens with the same code but different issuers can also sometimes be exchanged through [rippling](rippling.html).)

- To create an Offer, send an [OfferCreate transaction][].
- Offers that aren't fully filled immediately become [Offer objects](offer.html) in the ledger data. Later Offers and Payments can consume the Offer object from the ledger.
- [Cross-currency payments](cross-currency-payments.html) consume Offers to provide liquidity. However, they never create Offer objects in the ledger.

## Lifecycle of an Offer

An [OfferCreate transaction][] is an instruction to conduct a trade, either between two tokens, or a token and XRP. Every such transaction contains a buy amount (`TakerPays`) and a sell amount (`TakerGets`). When the transaction is processed, it automatically consumes matching or crossing Offers to the extent possible. If that does not completely fill the new Offer, then the remainder becomes an Offer object in the ledger.

The Offer object waits in the ledger until other Offers or cross-currency payments fully consume it. You can cancel your own Offers at any time, using the dedicated [OfferCancel transaction][], or as an option of the [OfferCreate transaction][].

While you have an Offer in the ledger, it sets aside some of your XRP toward the [owner reserve](reserves.html). When the Offer gets removed, for any reason, that XRP is freed up again.

### Variations

- **Buy vs. Sell:** By default, Offers are "buy" Offers and are considered fully filled when you have acquired the entire "buy" (`TakerPays`) amount. (You may spend less than you expected while receiving the specified amount.) By contrast, a "Sell" Offer is only considered fully filled when you have spent the entire "sell" (`TakerGets`) amount. (You may receive more than you expected while spending the specified amount.) This is only relevant if the Offer _initially_ executes at better than its requested exchange rate: after the Offer gets placed into the ledger, it only ever executes at _exactly_ the requested exchange rate.
- An **Immediate or Cancel** Offer is not placed into the ledger, so it only trades up to the amount that matches existing, matching Offers.
- A **Fill or Kill** Offer is not placed into the ledger, _and_ it is canceled if the full amount is not filled when it initially executes. This is similar to "Immediate or Cancel" except it _cannot_ be partially filled.
- A **Passive** Offer does not consume matching Offers that have the exact same exchange rate (going the other direction), and instead is placed directly into the ledger. You can use this to create an exact peg between two assets. Passive Offers still consume other Offers that have a _better_ exchange rate going the other way.


## Funding Requirements
To sell a token, you must either:

- Hold any positive amount of that token, _or_
- be the token's issuer.

However, you don't need to hold the full amount specified in the Offer. Placing an Offer does not lock up your funds, so you can place multiple Offers to sell the same tokens (or XRP), or place an Offer and hope to get enough tokens or XRP to fully fund it later.

When another Offer matches yours, both Offers execute to the extent that their owners' funds permit at the the time. If you run out of the  before your Offer is fully filled and deletes the remainder of the Offer if you run out of funds first. An Offer can't make your balance of a token negative, unless you are the issuer of that token.

If you place an Offer that crosses any of your own Offers that exist in the ledger, the old Offers are automatically canceled regardless of the amounts involved.

It is possible for an Offer to become temporarily or permanently _unfunded_:

- If the owner no longer has any of the sell asset.
    - The Offer becomes funded again when the owner obtains more of that asset.
- If the sell asset is a token in a [frozen trust line](freezes.html).
    - The Offer becomes funded again when the trust line is no longer frozen.
- If the Offer needs to create a new trust line, but the owner does not have enough XRP for the increased [reserve](reserves.html). (See [Offers and Trust](#offers-and-trust).)
    - The offer becomes funded again when the owner obtains more XRP, or the reserve requirements decrease.
- If the Offer is expired. (See [Offer Expiration](#offer-expiration).)

An unfunded Offer stays on the ledger until a transaction removes it. Ways that an Offer can be removed from the ledger include:

- A matching Offer or [Cross-currency payment](cross-currency-payments.html) fully consumes the Offer.
- The owner explicitly cancels the Offer.
- The owner implicitly cancels the Offer by sending a new Offer that crosses it.
- The Offer is found to be unfunded or expired during transaction processing. Typically this means that another Offer tried to consume it and could not.
    - This includes cases where the remaining amount that can be paid out by the Offer rounds down to zero.

### Tracking Unfunded Offers

Tracking the funding status of all Offers can be computationally taxing. In particular, addresses that are actively trading may have a large number of Offers open. A single balance can affect the funding status of many Offers. Because of this, the XRP Ledger does not _proactively_ find and remove unfunded or expired Offers.

A client application can locally track the funding status of Offers. To do this, first retrieve an order book using the [book_offers method][] and check the `taker_gets_funded` field of Offers. Then, [subscribe](subscribe.html) to the `transactions` stream and watch the transaction metadata to see which Offers are modified.


## Offers and Trust

The limit values of [trust lines](trust-lines-and-issuing.html) do not affect Offers. In other words, you can use an Offer to acquire more than the maximum amount you trust an issuer for.

However, holding tokens still requires a trust line to the issuer. When an Offer is consumed, it automatically creates any necessary trust lines, setting their limits to 0. Because [trust lines increase the reserve an account must hold](reserves.html), any Offers that would require a new trust line also require the address to have enough XRP to meet the reserve for that trust line.

Trust lines limits protect you from receiving more of a token as payment than you want. Offers can go beyond those limits because they are an explicit statement of how much of the token you want.


## Offer Preference

Existing Offers are grouped by exchange rate, which is measured as the ratio between `TakerGets` and `TakerPays`. Offers with a higher exchange rate are taken preferentially. (That is, the person accepting the offer receives as much as possible for the amount of currency they pay out.) Offers with the same exchange rate are taken on the basis of which offer was placed first.

When Offers execute in the same ledger block, the order in which they execute is determined by the [canonical order](https://github.com/ripple/rippled/blob/release/src/ripple/app/misc/CanonicalTXSet.cpp "Source: Transaction ordering") in which the transactions were [applied to the ledger](https://github.com/ripple/rippled/blob/5425a90f160711e46b2c1f1c93d68e5941e4bfb6/src/ripple/app/consensus/LedgerConsensus.cpp#L1435-L1538 "Source: Applying transactions"). This behavior is designed to be deterministic, efficient, and hard to game.


## Offer Expiration

Since transactions can take time to propagate and confirm, the timestamp of a ledger is used to determine offer validity. An offer only expires when its Expiration time is before the most-recently validated ledger. In other words, an offer with an `Expiration` field is still considered "active" if its expiration time is later than the timestamp of the most-recently validated ledger, regardless of what your local clock says.

You can determine the final disposition of an offer with an `Expiration` as soon as you see a fully-validated ledger with a close time equal to or greater than the expiration time.

**Note:** Since only new transactions can modify the ledger, an expired offer can stay on the ledger after it becomes inactive. The offer is treated as unfunded and has no effect, but it can continue to appear in results (for example, from the [ledger_entry](ledger_entry.html) command). Later on, the expired offer can get finally deleted as a result of another transaction (such as another OfferCreate) if the server finds it while processing.

If an OfferCreate transaction has an `Expiration` time that has already passed when the transaction first gets included in a ledger, the transaction does not execute the offer. The result code of such a transaction depends on whether the [Checks amendment][] is enabled. With the Checks amendment enabled, the transaction has the `tecEXPIRED` result code. Otherwise, the transaction has the `tesSUCCESS` transaction code. In either case, the transaction has no effect except to destroy the XRP paid as a [transaction cost](transaction-cost.html).

## See Also

- **Concepts:**
    - [Tokens](tokens.html)
    - [Paths](paths.html)
- **Tutorials:**
    - [List Your Exchange on XRP Charts](list-your-exchange-on-xrp-charts.html) - for off-ledger exchanges
- **References:**
    - [account_offers method][]
    - [book_offers method][]
    - [OfferCreate transaction][]
    - [Offer object](offer.html)

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
