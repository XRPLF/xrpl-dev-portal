---
html: autobridging.html
parent: decentralized-exchange.html
seo:
    description: Auto-bridging automatically connects order books using XRP as an intermediary when it reduces costs.
labels:
  - XRP
  - Decentralized Exchange
---
# Auto-Bridging

Any [Offer](offers.md) in the XRP Ledger's [decentralized exchange](index.md) that would exchange two tokens could potentially use XRP as an intermediary currency in a synthetic order book. This is because of _auto-bridging_, which serves to improve liquidity across all asset pairs by using XRP when doing so is cheaper than trading directly. This works because of XRP's nature as a native cryptocurrency to the XRP Ledger. Offer execution can use a combination of direct and auto-bridged offers to achieve the best total exchange rate.

Example: _Anita places an offer to sell GBP and buy BRL. She might find that this uncommon market has few offers. There is one offer with a good rate, but it has insufficient quantity to satisfy Anita's trade. However, both GBP and BRL have active, competitive markets to XRP. The XRP Ledger's auto-bridging system finds a way to complete Anita's offer by purchasing XRP with GBP from one trader, then selling the XRP to another trader to buy BRL. Anita automatically gets the best rate possible by combining the small offer in the direct GBP:BRL market with the better composite rates created by pairing GBP:XRP and XRP:BRL offers._

Auto-bridging happens automatically on any [OfferCreate transaction][]. [Payment transactions](../../../references/protocol/transactions/types/payment.md) _do not_ use auto-bridging by default, but path-finding can find [paths](../fungible-tokens/paths.md) that have the same effect.

[![Diagram showing direct and synthetic orderbook combination through autobridging](/docs/img/autobridging.png)](/docs/img/autobridging.png)


## See Also

- [Dev Blog: Introducing Autobridging](https://xrpl.org/blog/2014/introducing-offer-autobridging.html) <!-- SPELLING_IGNORE: autobridging -->

- [Offer Preference](offers.md#offer-preference)

- [Payment Paths](../fungible-tokens/paths.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
