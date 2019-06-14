# Auto-Bridging

Any OfferCreate that would exchange two non-XRP currencies could potentially use XRP as an intermediary currency in a synthetic order book. This is because of auto-bridging, which serves to improve liquidity across all currency pairs by using XRP as a vehicle currency. This works because of XRP's nature as a native cryptocurrency to the XRP Ledger. Offer execution can use a combination of direct and auto-bridged offers to achieve the best total exchange rate.

Example: _Anita places an offer to sell GBP and buy BRL. She might find that this uncommon currency market has few offers. There is one offer with a good rate, but it has insufficient quantity to satisfy Anita's trade. However, both GBP and BRL have active, competitive markets to XRP. Auto-bridging software finds a way to complete Anita's offer by purchasing XRP with GBP from one trader, then selling the XRP to another trader to buy BRL. Anita automatically gets the best rate possible by combining the small offer in the direct GBP:BRL market with the better composite rates created by pairing GBP:XRP and XRP:BRL offers._

Auto-bridging happens automatically on any OfferCreate transaction. [Payment transactions](payment.html) _do not_ autobridge by default, but path-finding can find paths that have the same effect.

## See Also

- [Dev Blog: Introducing Autobridging](https://xrpl.org/blog/2014/introducing-offer-autobridging.html)

- [Offer Preference](offers.html#offer-preference)
