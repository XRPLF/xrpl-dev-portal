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

When an Offer is placed into an order book, its exchange rate is truncated based on the `TickSize` values set by the issuers of any trust line tokens involved in the Offer. Unlike tick sizes in traditional finance, the XRP Ledger's `TickSize` applies to the **exchange rate's significant digits**, not the trade amounts directly. After truncating the exchange rate, the ledger recalculates one of the amounts to match the new rate:

- **Buy offers** recalculate the `TakerGets` amount.
- **Sell offers** recalculate the `TakerPays` amount.

Because buy and sell offers adjust different sides, two offers that appear to have matching prices may not actually cross. This can be more problematic than the price discovery issues that `TickSize` is meant to solve.

{% admonition type="warning" name="Warning" %}
Consider carefully whether your use case benefits from a `TickSize`. In particular, stablecoins and other currency-like tokens may be better off without one, since they trade in narrow price ranges where precise matching matters more than preventing competitive price improvements.
{% /admonition %}

The `TickSize` that applies depends on the assets being traded:

- **XRP and a trust line token**: The `TickSize` from the trust line token's issuer applies. Either amount may be adjusted based on buy/sell direction. If the issuer has not set a tick size, the exchange rate uses its maximum precision.
- **MPT and a trust line token**: The `TickSize` from the trust line token's issuer applies. Only the trust line token amount is adjusted; MPT amounts are never adjusted for tick size. If the trust line token's issuer has not set a tick size, the exchange rate uses its maximum precision.
- **Two trust line tokens**: The smaller `TickSize` value (fewer significant digits) applies. Either amount may be adjusted based on buy/sell direction. If neither issuer has set a tick size, the exchange rate uses its maximum precision.
- **XRP/MPT or MPT/MPT**: The exchange rate always uses its maximum precision. XRP and MPTs do not support `TickSize`.

Trust line token issuers can set `TickSize` to an integer from `3` to `15` using an [AccountSet transaction][]. The exchange rate is represented as significant digits and an exponent; the `TickSize` does not affect the exponent. This allows the XRP Ledger to represent exchange rates between assets that vary greatly in value (for example, a highly inflated currency compared to a rare commodity). The lower the `TickSize` an issuer sets, the larger the increment traders must offer to be considered a higher exchange rate than the existing Offers.

The `TickSize` does not affect the part of an offer that can be executed immediately. For this reason, OfferCreate transactions with `tfImmediateOrCancel` are unaffected by `TickSize` values.

When an issuer enables, disables, or changes the `TickSize`, Offers that were placed under the previous setting are unaffected.

## See Also

- [Dev Blog: Introducing the TickSize Amendment](https://xrpl.org/blog/2017/ticksize-voting.html#ticksize-amendment-overview)
- **References:**
    - [AccountSet transaction][]
    - [book_offers method][]
    - [OfferCreate transaction][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
