---
date: 2017-02-14
category: 2017
labels:
    - Amendments
theme:
    markdown:
        editPage:
            hide: true
---
# TickSize Will Be Available in 7 Days

This notice is for all validator operators, and may be useful for gateways that intend to use tick sizes.

A majority of trusted validators [voted to enable the TickSize amendment](https://developers.ripple.com/blog/2017/ticksize-voting.html), which is scheduled to become active on the protocol on Tuesday, 2017-02-21. The amendment changes the way RCL offers are ranked in order books, so that currency issuers can configure how many significant digits are taken into account when ranking offers by exchange rate.

For a detailed look into the TickSize feature, see the [original TickSize announcement](https://developers.ripple.com/blog/2017/ticksize-voting.html).


## Action Required

1. **If you operate a `rippled` server and accept secure client connections**, then you should upgrade to `rippled` version 0.50.2 immediately. If you operate a `rippled` server but do not accept secure client connections, then you should upgrade to version 0.50.0 by Tuesday, 2017-02-21, for service continuity.

2. **If you are a gateway issuer**, then please review [documentation](https://ripple.com/build/transactions/#offer-preference) for the TickSize amendment to determine what tick size is appropriate for your issuing asset.

3. **If you are a market maker** and have algorithmic trading bots, then please review [documentation](https://ripple.com/build/transactions/#offer-preference) for the TickSize amendment to update your trading system to check the tick size for a given issuer.

4. **If you have backend software**, which constructs and submits transactions related to the issuing of assets on the Ripple network, then please review [documentation](https://ripple.com/build/transactions/#offer-preference) for the TickSize amendment to adapt it for correct usage.


## Learn More

For more information, see the following articles in the [Ripple Developer Portal](https://ripple.com/build/):

- [Offer Preference](https://ripple.com/build/transactions/#offer-preference) - How offers are ranked with and without TickSize.
- [AccountSet transaction](https://ripple.com/build/transactions/#accountset) - How to configure a TickSize.

To continue receiving updates about the rippled server, please subscribe to the Ripple Server Google Group: <https://groups.google.com/forum/#!forum/ripple-server>
