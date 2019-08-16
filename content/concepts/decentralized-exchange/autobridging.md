# Auto-Bridging

Any [Offer](offers.html) in the XRP Ledger's [decentralized exchange](decentralized-exchange.html) that would exchange two non-XRP currencies could potentially use [XRP](xrp.html) as an intermediary currency in a synthetic order book. This is because of _auto-bridging_, which serves to improve liquidity across all currency pairs by using XRP when doing so is cheaper than trading those currencies directly. This works because of XRP's nature as a native cryptocurrency to the XRP Ledger. Offer execution can use a combination of direct and auto-bridged offers to achieve the best total exchange rate.

Example: _Anita places an offer to sell GBP and buy BRL. She might find that this uncommon currency market has few offers. There is one offer with a good rate, but it has insufficient quantity to satisfy Anita's trade. However, both GBP and BRL have active, competitive markets to XRP. The XRP Ledger's auto-bridging system finds a way to complete Anita's offer by purchasing XRP with GBP from one trader, then selling the XRP to another trader to buy BRL. Anita automatically gets the best rate possible by combining the small offer in the direct GBP:BRL market with the better composite rates created by pairing GBP:XRP and XRP:BRL offers._

Auto-bridging happens automatically on any [OfferCreate transaction][]. [Payment transactions](payment.html) _do not_ autobridge by default, but path-finding can find [paths](paths.html) that have the same effect.

## See Also

- [Dev Blog: Introducing Autobridging](https://xrpl.org/blog/2014/introducing-offer-autobridging.html)

- [Offer Preference](offers.html#offer-preference)

- [Payment Paths](paths.html)


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
