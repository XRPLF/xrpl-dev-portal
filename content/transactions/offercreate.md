## OfferCreate

[[Source]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/app/tx/impl/CreateOffer.cpp "Source")

An OfferCreate transaction is effectively a [limit order](http://en.wikipedia.org/wiki/limit_order). It defines an intent to exchange currencies, and creates an Offer object in the XRP Ledger if not completely fulfilled when placed. Offers can be partially fulfilled.

```
{
    "TransactionType": "OfferCreate",
    "Account": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
    "Fee": "12",
    "Flags": 0,
    "LastLedgerSequence": 7108682,
    "Sequence": 8,
    "TakerGets": "6000000",
    "TakerPays": {
      "currency": "GKO",
      "issuer": "ruazs5h1qEsqpke88pcqnaseXdm6od2xc",
      "value": "2"
    }
}
```

| Field                     | JSON Type           | [Internal Type][] | Description |
|:--------------------------|:--------------------|:------------------|:-------|
| [Expiration](#expiration) | Unsigned Integer    | UInt32            | _(Optional)_ Time after which the offer is no longer active, in [seconds since the Ripple Epoch](reference-rippled.html#specifying-time). |
| OfferSequence             | Unsigned Integer    | UInt32            | _(Optional)_ An offer to delete first, specified in the same way as [OfferCancel][]. |
| TakerGets                 | [Currency Amount][] | Amount            | The amount and type of currency being provided by the offer creator. |
| TakerPays                 | [Currency Amount][] | Amount            | The amount and type of currency being requested by the offer creator. |

### Lifecycle of an Offer

When an OfferCreate transaction is processed, it automatically consumes matching or crossing offers to the extent possible. (If existing offers provide a better rate than requested, the offer creator could pay less than the full `TakerGets` amount to receive the entire `TakerPays` amount.) If that does not completely fulfill the `TakerPays` amount, then the offer becomes an Offer object in the ledger. (You can use [OfferCreate Flags](#offercreate-flags) to modify this behavior.)

An offer in the ledger can be fulfilled either by additional OfferCreate transactions that match up with the existing offers, or by [Payments](#payment) that use the offer to connect the payment path. Offers can be partially fulfilled and partially funded. A single transaction can consume up to 850 Offers from the ledger. (Any more than that, and the metadata becomes too large, resulting in [`tecOVERSIZE`](#tec-codes).)

You can create an offer so long as you have at least some (any positive, nonzero amount) of the currency specified by the `TakerGets` parameter of the offer. The offer sells as much of the currency as you have, up to the `TakerGets` amount, until the `TakerPays` amount is satisfied. An offer cannot place anyone in debt.

It is possible for an offer to become temporarily or permanently _unfunded_:

* If the creator no longer has any of the `TakerGets` currency.
    * The offer becomes funded again when the creator obtains more of that currency.
* If the currency required to fund the offer is held in a [frozen trust line](concept-freeze.html).
    * The offer becomes funded again when the trust line is no longer frozen.
* If the creator does not have enough XRP for the reserve amount of a new trust line required by the offer. (See [Offers and Trust](#offers-and-trust).)
    * The offer becomes funded again when the creator obtains more XRP, or the reserve requirements decrease.
* If the Expiration time included in the offer is before the close time of the most recently-closed ledger. (See [Expiration](#expiration).)

An unfunded offer can stay on the ledger indefinitely, but it does not have any effect. The only ways an offer can be *permanently* removed from the ledger are:

* It becomes fully claimed by a Payment or a matching OfferCreate transaction.
* An OfferCancel or OfferCreate transaction explicitly cancels the offer.
* An OfferCreate transaction from the same account crosses the earlier offer. (In this case, the older offer is automatically canceled.)
* An offer is found to be unfunded during transaction processing, typically because it was at the tip of the orderbook.
    * This includes cases where one side or the other of an offer is found to be closer to 0 than `rippled`'s precision supports.

#### Tracking Unfunded Offers

Tracking the funding status of all offers can be computationally taxing. In particular, addresses that are actively trading may have a large number of offers open. A single balance can affect the funding status of many offers to buy different currencies. Because of this, `rippled` does not proactively find and remove offers.

A client application can locally track the funding status of offers. To do this, first retreive an order book using the [`book_offers` command](reference-rippled.html#book-offers) and check the `taker_gets_funded` field of offers. Then,  [subscribe](reference-rippled.html#subscribe) to the `transactions` stream and watch the transaction metadata to see which offers are modified.


### Offers and Trust

The limit values of trust lines (See [TrustSet](#trustset)) do not affect offers. In other words, you can use an offer to acquire more than the maximum amount you trust an issuer to redeem.

However, holding non-XRP balances still requires a trust line to the address issuing those balances. When an offer is taken, it automatically creates any necessary trust lines, setting their limits to 0. Because [trust lines increase the reserve an account must hold](concept-reserves.html), any offers that would require a new trust line also require the address to have enough XRP to meet the reserve for that trust line.

A trust line indicates an issuer you trust enough to accept their issuances as payment, within limits. Offers are explicit instructions to acquire certain issuances, so they are allowed to go beyond those limits.

### Offer Preference

Existing offers are grouped by exchange rate (sometimes called "offer quality"), which is measured as the ratio between `TakerGets` and `TakerPays`. Offers with a higher exchange rate are taken preferentially. (That is, the person accepting the offer receives as much as possible for the amount of currency they pay out.) Offers with the same exchange rate are taken on the basis of which offer was placed in the earliest ledger version.

When offers of the same exchange rate are placed in the same ledger version, the order in which they are taken is determined by the [canonical order](https://github.com/ripple/rippled/blob/release/src/ripple/app/misc/CanonicalTXSet.cpp "Source: Transaction ordering") in which the transactions were [applied to the ledger](https://github.com/ripple/rippled/blob/5425a90f160711e46b2c1f1c93d68e5941e4bfb6/src/ripple/app/consensus/LedgerConsensus.cpp#L1435-L1538 "Source: Applying transactions"). This behavior is designed to be deterministic, efficient, and hard to game.

#### TickSize

_Requires the [TickSize amendment](reference-amendments.html#ticksize)._

When an Offer is placed into an order book, its exchange rate is truncated based on the `TickSize` values set by the issuers of the currencies involved in the Offer. When a trader offers to exchange XRP and an issued currency, the `TickSize` from the issuer of the currency applies. When a trader offers to exchange two issued currencies, the offer uses the smaller `TickSize` value (that is, the one with fewer significant digits). If neither currency has a `TickSize` set, the default behavior applies.

The `TickSize` value truncates the number of _significant digits_ in the exchange rate of an offer when it gets placed in an order book. Issuers can set `TickSize` to an integer from `3` to `15` using an [AccountSet transaction][]. The exchange rate is represented as significant digits and an exponent; the `TickSize` does not affect the exponent. This allows the XRP Ledger to represent exchange rates between assets that vary greatly in value (for example, a hyperinflated currency compared to a rare commodity). The lower the `TickSize` an issuer sets, the larger the increment traders must offer to be considered a higher exchange rate than the existing Offers.

The `TickSize` does not affect the part of an Offer that can be executed immediately. (For that reason, OfferCreate transactions with `tfImmediateOrCancel` are unaffected by `TickSize` values.) If the Offer cannot be fully executed, the transaction processing engine calculates the exchange rate and truncates it based on `TickSize`. Then, the engine rounds the remaining amount of the Offer from the "less important" side to match the truncated exchange rate. For a default OfferCreate transaction (a "buy" Offer), the `TakerPays` amount (the amount being bought) gets rounded. If the `tfSell` flag is enabled (a "sell" Offer) the `TakerGets` amount (the amount being sold) gets rounded.

When an issuer enables, disables, or changes the `TickSize`, Offers that were placed under the previous setting are unaffected.


### Expiration

Since transactions can take time to propagate and confirm, the timestamp of a ledger is used to determine offer validity. An offer only expires when its Expiration time is before the most-recently validated ledger. In other words, an offer with an `Expiration` field is still considered "active" if its expiration time is later than the timestamp of the most-recently validated ledger, regardless of what your local clock says.

You can determine the final disposition of an offer with an `Expiration` as soon as you see a fully-validated ledger with a close time equal to or greater than the expiration time.

**Note:** Since only new transactions can modify the ledger, an expired offer can stay on the ledger after it becomes inactive. The offer is treated as unfunded and has no effect, but it can continue to appear in results (for example, from the [ledger_entry](reference-rippled.html#ledger-entry) command). Later on, the expired offer can get finally deleted as a result of another transaction (such as another OfferCreate) if the server finds it while processing.

If an OfferCreate transaction has an `Expiration` time that has already passed when the transaction first gets included in a ledger, the transaction does not execute the offer. The result code of such a transaction depends on whether the [Checks amendment](reference-amendments.html#checks) is enabled. With the Checks amendment enabled, the transaction has the `tecEXPIRED` result code. Otherwise, the transaction has the `tesSUCCESS` transaction code. In either case, if the OfferCreate transaction includes an `OfferSequence` parameter, it can still successfully cancel a previous offer.

### Auto-Bridging

Any OfferCreate that would exchange two non-XRP currencies could potentially use XRP as an intermediary currency in a synthetic order book. This is because of auto-bridging, which serves to improve liquidity across all currency pairs by using XRP as a vehicle currency. This works because of XRP's nature as a native cryptocurrency to the XRP Ledger. Offer execution can use a combination of direct and auto-bridged offers to achieve the best total exchange rate.

Example: _Anita places an offer to sell GBP and buy BRL. She might find that this uncommon currency market has few offers. There is one offer with a good rate, but it has insufficient quantity to satisfy Anita's trade. However, both GBP and BRL have active, competitive markets to XRP. Auto-bridging software finds a way to complete Anita's offer by purchasing XRP with GBP from one trader, then selling the XRP to another trader to buy BRL. Anita automatically gets the best rate possible by combining the small offer in the direct GBP:BRL market with the better composite rates created by pairing GBP:XRP and XRP:BRL offers._

Auto-bridging happens automatically on any OfferCreate transaction. [Payment transactions](#payment) _do not_ autobridge by default, but path-finding can find paths that have the same effect.


### OfferCreate Flags

Transactions of the OfferCreate type support additional values in the [`Flags` field](#flags), as follows:

| Flag Name           | Hex Value  | Decimal Value | Description               |
|:--------------------|:-----------|:--------------|:--------------------------|
| tfPassive           | 0x00010000 | 65536         | If enabled, the offer does not consume offers that exactly match it, and instead becomes an Offer object in the ledger. It still consumes offers that cross it. |
| tfImmediateOrCancel | 0x00020000 | 131072        | Treat the offer as an [Immediate or Cancel order](http://en.wikipedia.org/wiki/Immediate_or_cancel). If enabled, the offer never becomes a ledger object: it only tries to match existing offers in the ledger. |
| tfFillOrKill        | 0x00040000 | 262144        | Treat the offer as a [Fill or Kill order](http://en.wikipedia.org/wiki/Fill_or_kill). Only try to match existing offers in the ledger, and only do so if the entire `TakerPays` quantity can be obtained. |
| tfSell              | 0x00080000 | 524288        | Exchange the entire `TakerGets` amount, even if it means obtaining more than the `TakerPays` amount in exchange. |

The following invalid flag combination prompts a `temINVALID_FLAG` error:

* tfImmediateOrCancel and tfFillOrKill

**Note:** When an OfferCreate uses tfImmediateOrCancel or tfFillOrKill and the offer cannot be executed when placed, the transaction may conclude "successfully" without trading any currency or having any effect on the order books. In this case, the transaction has the [result code](#result-categories) `tesSUCCESS`, it pays the [transaction cost](concept-transaction-cost.html) and uses up a `Sequence` number, but has no other effect.
