# Tick Size

_(Requires the [TickSize amendment][].)_

When an Offer is placed into an order book, its exchange rate is truncated based on the `TickSize` values set by the issuers of the currencies involved in the Offer. When a trader offers to exchange XRP and an issued currency, the `TickSize` from the issuer of the currency applies. When a trader offers to exchange two issued currencies, the offer uses the smaller `TickSize` value (that is, the one with fewer significant digits). If neither currency has a `TickSize` set, the default behavior applies.

The `TickSize` value truncates the number of _significant digits_ in the exchange rate of an offer when it gets placed in an order book. Issuers can set `TickSize` to an integer from `3` to `15` using an [AccountSet transaction][]. The exchange rate is represented as significant digits and an exponent; the `TickSize` does not affect the exponent. This allows the XRP Ledger to represent exchange rates between assets that vary greatly in value (for example, a hyperinflated currency compared to a rare commodity). The lower the `TickSize` an issuer sets, the larger the increment traders must offer to be considered a higher exchange rate than the existing Offers.

The `TickSize` does not affect the part of an Offer that can be executed immediately. (For that reason, OfferCreate transactions with `tfImmediateOrCancel` are unaffected by `TickSize` values.) If the Offer cannot be fully executed, the transaction processing engine calculates the exchange rate and truncates it based on `TickSize`. Then, the engine rounds the remaining amount of the Offer from the "less important" side to match the truncated exchange rate. For a default OfferCreate transaction (a "buy" Offer), the `TakerPays` amount (the amount being bought) gets rounded. If the `tfSell` flag is enabled (a "sell" Offer) the `TakerGets` amount (the amount being sold) gets rounded.

When an issuer enables, disables, or changes the `TickSize`, Offers that were placed under the previous setting are unaffected.

## See Also

- [Dev Blog: Introducing the TickSize Amendment](https://xrpl.org/blog/2017/ticksize-voting.html#ticksize-amendment-overview)
- **References:**
    - [AccountSet transaction][]
    - [book_offers method][]
    - [OfferCreate transaction][]



<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
