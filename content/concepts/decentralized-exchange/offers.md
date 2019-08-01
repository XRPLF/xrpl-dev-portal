# Offers

In the XRP Ledger's decentralized exchange, orders to trade currency are called "Offers". Offers can trade XRP with issued currencies, or issued currencies with each other, including issued currencies with the same currency code but different issuers. (Currencies with the same code but different issuers can also sometimes be exchanged through [rippling](rippling.html).)

- To create an Offer, send an [OfferCreate transaction][].
- Offers that aren't fully filled immediately become [Offer objects](offer.html) in the ledger data. Later Offers and Payments can consume the Offer object from the ledger.
- [Cross-currency payments](cross-currency-payments.html) consume offers to provide liquidity.


## Lifecycle of an Offer

When an OfferCreate transaction is processed, it automatically consumes matching or crossing offers to the extent possible. (If existing offers provide a better rate than requested, the offer creator could pay less than the full `TakerGets` amount to receive the entire `TakerPays` amount.) If that does not completely fulfill the `TakerPays` amount, then the offer becomes an Offer object in the ledger. (You can use [OfferCreate Flags](offercreate.html#offercreate-flags) to modify this behavior.)

An offer in the ledger can be fulfilled either by additional OfferCreate transactions that match up with the existing offers, or by [Payment transactions][] that use the offer to connect the payment path. Offers can be partially fulfilled and partially funded. A single transaction can consume up to 850 Offers from the ledger. (Any more than that, and the metadata becomes too large, resulting in [`tecOVERSIZE`](tec-codes.html).)

You can create an offer so long as you have at least some (any positive, nonzero amount) of the currency specified by the `TakerGets` parameter of the offer. The offer sells as much of the currency as you have, up to the `TakerGets` amount, until the `TakerPays` amount is satisfied. An offer cannot place anyone in debt.

If you place an offer that crosses any offers you have existing in the ledger, the old offers are automatically canceled regardless of the amounts involved.

It is possible for an offer to become temporarily or permanently _unfunded_:

* If the creator no longer has any of the `TakerGets` currency.
    * The offer becomes funded again when the creator obtains more of that currency.
* If the currency required to fund the offer is held in a [frozen trust line](freezes.html).
    * The offer becomes funded again when the trust line is no longer frozen.
* If the creator does not have enough XRP for the reserve amount of a new trust line required by the offer. (See [Offers and Trust](#offers-and-trust).)
    * The offer becomes funded again when the creator obtains more XRP, or the reserve requirements decrease.
* If the Expiration time included in the offer is before the close time of the most recently-closed ledger. (See [Offer Expiration](#offer-expiration).)

An unfunded offer can stay on the ledger indefinitely, but it does not have any effect. The only ways an offer can be *permanently* removed from the ledger are:

* It becomes fully claimed by a Payment or a matching OfferCreate transaction.
* An OfferCancel or OfferCreate transaction explicitly cancels the offer.
* An OfferCreate transaction from the same account crosses the earlier offer. (In this case, the older offer is automatically canceled.)
* An offer is found to be unfunded during transaction processing, typically because it was at the tip of the orderbook.
    * This includes cases where one side or the other of an offer is found to be closer to 0 than `rippled`'s precision supports.

### Tracking Unfunded Offers

Tracking the funding status of all offers can be computationally taxing. In particular, addresses that are actively trading may have a large number of offers open. A single balance can affect the funding status of many offers to buy different currencies. Because of this, `rippled` does not proactively find and remove offers.

A client application can locally track the funding status of offers. To do this, first retreive an order book using the [book_offers method][] and check the `taker_gets_funded` field of offers. Then, [subscribe](subscribe.html) to the `transactions` stream and watch the transaction metadata to see which offers are modified.


## Offers and Trust

The limit values of trust lines (See [TrustSet](trustset.html)) do not affect offers. In other words, you can use an offer to acquire more than the maximum amount you trust an issuer to redeem.

However, holding non-XRP balances still requires a trust line to the address issuing those balances. When an offer is taken, it automatically creates any necessary trust lines, setting their limits to 0. Because [trust lines increase the reserve an account must hold](reserves.html), any offers that would require a new trust line also require the address to have enough XRP to meet the reserve for that trust line.

A trust line indicates an issuer you trust enough to accept their issuances as payment, within limits. Offers are explicit instructions to acquire certain issuances, so they are allowed to go beyond those limits.


## Offer Preference

Existing offers are grouped by exchange rate (sometimes called "offer quality"), which is measured as the ratio between `TakerGets` and `TakerPays`. Offers with a higher exchange rate are taken preferentially. (That is, the person accepting the offer receives as much as possible for the amount of currency they pay out.) Offers with the same exchange rate are taken on the basis of which offer was placed in the earliest ledger version.

When offers of the same exchange rate are placed in the same ledger version, the order in which they are taken is determined by the [canonical order](https://github.com/ripple/rippled/blob/release/src/ripple/app/misc/CanonicalTXSet.cpp "Source: Transaction ordering") in which the transactions were [applied to the ledger](https://github.com/ripple/rippled/blob/5425a90f160711e46b2c1f1c93d68e5941e4bfb6/src/ripple/app/consensus/LedgerConsensus.cpp#L1435-L1538 "Source: Applying transactions"). This behavior is designed to be deterministic, efficient, and hard to game.


## Offer Expiration

Since transactions can take time to propagate and confirm, the timestamp of a ledger is used to determine offer validity. An offer only expires when its Expiration time is before the most-recently validated ledger. In other words, an offer with an `Expiration` field is still considered "active" if its expiration time is later than the timestamp of the most-recently validated ledger, regardless of what your local clock says.

You can determine the final disposition of an offer with an `Expiration` as soon as you see a fully-validated ledger with a close time equal to or greater than the expiration time.

**Note:** Since only new transactions can modify the ledger, an expired offer can stay on the ledger after it becomes inactive. The offer is treated as unfunded and has no effect, but it can continue to appear in results (for example, from the [ledger_entry](ledger_entry.html) command). Later on, the expired offer can get finally deleted as a result of another transaction (such as another OfferCreate) if the server finds it while processing.

If an OfferCreate transaction has an `Expiration` time that has already passed when the transaction first gets included in a ledger, the transaction does not execute the offer. The result code of such a transaction depends on whether the [Checks amendment][]:not_enabled: is enabled. With the Checks amendment enabled, the transaction has the `tecEXPIRED` result code. Otherwise, the transaction has the `tesSUCCESS` transaction code. In either case, the transaction has no effect except to destroy the XRP paid as a [transaction cost](transaction-cost.html).

## See Also

- **Concepts:**
    - [Issued Currencies Overview](issued-currencies-overview.html)
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
