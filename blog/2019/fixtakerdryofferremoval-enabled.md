---
labels:
    - Amendments
category: 2019
date: 2019-04-02
theme:
    markdown:
        editPage:
            hide: true
---
# fixTakerDryOfferRemoval is Now Available

[As previously announced](./fix1578-expected.md), the fixTakerDryOfferRemoval amendment [became enabled on the XRP Ledger](https://xrpcharts.ripple.com/#/transactions/C42335E95F1BD2009A2C090EA57BD7FB026AD285B4B85BE15F669BA4F70D11AF) on 2019-04-02.

## Action Required

- If you operate a `rippled` server, you should upgrade to version 1.2.0 (or higher) immediately. [Version 1.2.3](https://developers.ripple.com/blog/2019/rippled-1.2.3.html) is recommended.

For instructions on upgrading `rippled` on supported platforms, see [Install `rippled`](https://developers.ripple.com/install-rippled.html).


## Impact of Not Upgrading

If you operate a `rippled` server on a version older than 1.2.0, then your server has been [amendment blocked](https://developers.ripple.com/amendments.html#amendment-blocked) since 2019-03-23, when the [fix1578 amendment became enabled](https://developers.ripple.com/blog/2019/fix1578-enabled.html). If your server is amendment blocked, that means it:

* Cannot determine the validity of a ledger
* Cannot submit or process transactions
* Does not participate in the consensus process
* Does not vote on future amendments
* Could rely on potentially invalid data


## fixTakerDryOfferRemoval Summary

Fixes a bug in [auto-bridging](http://developers.ripple.com/autobridging.html) that can leave a dry offer in the XRP Ledger. A dry offer is an offer that, if crossed, cannot yield any funds.

Without this fix, the dry offer remains on the ledger and counts toward its owner's [reserve requirement](http://developers.ripple.com/reserves.html#owner-reserves) without providing any benefit to the owner. Another offer crossing of the right type and quality can remove the dry offer. However, if the required offer crossing type and quality are rare, it may take a while for the dry offer to be removed.

With this amendment enabled, the XRP Ledger removes these dry offers when they're matched in auto-bridging.


## Learn, ask questions, and discuss

Related documentation is available in the [XRP Ledger Dev Portal](https://developers.ripple.com/), including detailed example API calls and web tools for API testing.

Other resources:

* The Ripple Forum (_Disabled._ Formerly `forum.ripple.com`)
* [The Ripple Dev Blog](https://developers.ripple.com/blog/)
* Ripple Technical Services: <support@ripple.com>
* [XRP Chat Forum](http://www.xrpchat.com/)
