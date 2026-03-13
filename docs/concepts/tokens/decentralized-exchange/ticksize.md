---
html: ticksize.html
parent: decentralized-exchange.html
seo:
    description: Issuers can set custom tick sizes for currencies to reduce churn in order books over miniscule differences in exchange rates.
labels:
  - Decentralized Exchange
  - Tokens
---
# Tick Size

When an Offer is placed into an order book, its exchange rate is truncated based on the `TickSize` values set by the issuers of the Trust Line Tokens involved in the Offer.
The `TickSize` that applies depends on the assets being traded:

- **XRP and a Trust Line Token**, or **MPT and a Trust Line Token**: The `TickSize` from the Trust Line Token's issuer applies, and the Trust Line Token amount is adjusted.
- **Two Trust Line Tokens**: The smaller `TickSize` value (fewer significant digits) is used.
- **Neither token has a `TickSize` set**: No truncation occurs and the exchange rate is used at full precision.

The `TickSize` value truncates the number of _significant digits_ in the exchange rate of an offer when it gets placed in an order book. Trust Line Token issuers can set `TickSize` to an integer from `3` to `15` using an [AccountSet transaction][]. The exchange rate is represented as significant digits and an exponent; the `TickSize` does not affect the exponent. This allows the XRP Ledger to represent exchange rates between assets that vary greatly in value (for example, a highly inflated currency compared to a rare commodity). The lower the `TickSize` an issuer sets, the larger the increment traders must offer to be considered a higher exchange rate than the existing Offers.

The `TickSize` does not affect the part of an Offer that can be executed immediately. (For that reason, OfferCreate transactions with `tfImmediateOrCancel` are unaffected by `TickSize` values.) If the Offer cannot be fully executed, the transaction processing engine calculates the exchange rate and truncates it based on `TickSize`. Then, the engine rounds the remaining amount of the Offer from the "less important" side to match the truncated exchange rate. For a default OfferCreate transaction (a "buy" Offer), the `TakerPays` amount (the amount being bought) gets rounded. If the `tfSell` flag is enabled (a "sell" Offer) the `TakerGets` amount (the amount being sold) gets rounded.

When an issuer enables, disables, or changes the `TickSize`, Offers that were placed under the previous setting are unaffected.

## See Also

- [Dev Blog: Introducing the TickSize Amendment](https://xrpl.org/blog/2017/ticksize-voting.html#ticksize-amendment-overview)
- **References:**
    - [AccountSet transaction][]
    - [book_offers method][]
    - [OfferCreate transaction][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
