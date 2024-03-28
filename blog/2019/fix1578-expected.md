---
labels:
    - Amendments
category: 2019
date: 2019-03-19
theme:
    markdown:
        editPage:
            hide: true
---
# The fix1578 and fixTakerDryOfferRemoval Amendments are Expected

The fix1578 amendment to the XRP Ledger, introduced in [`rippled` v1.2.0](https://github.com/ripple/rippled/releases/tag/1.2.0), has [gained support from a majority of trusted validators](https://xrpcharts.ripple.com/#/transactions/147C93F2D60CB7A3FEC16957B6BD64A6D5C4411DD00D82B51189B5DE9A6FC438). Currently, it is expected to become enabled on 2019-03-23.

The fixTakerDryOfferRemoval amendment to the XRP Ledger has also [gained support from a majority of trusted validators](https://xrpcharts.ripple.com/#/transactions/B6441A0F494112AD5931DB5A5E9E1F8B40B29A7FEE41CFCF8D5B11C5897A6920). Currently, it is expected to become enabled on 2019-04-02.

As long as the amendments continue to have the support of at least 80% of trusted validators continuously, they will become enabled on the expected dates.

<!-- BREAK -->

## fix1578 Summary

Changes the result codes returned by two transaction types:

- Changes the [OfferCreate transaction](https://developers.ripple.com/offercreate.html) to return a new result code, `tecKILLED`, if the offer used the `tfFillOrKill` flag and was killed. Without this amendment, the offer is killed but the transaction result is `tesSUCCESS`.
- Changes the [TrustSet transaction](https://developers.ripple.com/trustset.html) to fail with `tecNO_PERMISSION` if it tries to enable the [NoRipple flag](https://developers.ripple.com/rippling.html#the-noripple-flag) but cannot because the trust line has a negative balance. Without this amendment, the transaction does not enable the NoRipple flag, but the transaction result is `tesSUCCESS` nonetheless.


## fixTakerDryOfferRemoval Summary

Fixes a bug in [auto-bridging](https://developers.ripple.com/autobridging.html) that can leave a dry offer in the XRP Ledger. A dry offer is an offer that, if crossed, cannot yield any funds.

Without this fix, the dry offer remains on the ledger and counts toward its owner's [reserve requirement](https://developers.ripple.com/reserves.html#owner-reserves) without providing any benefit to the owner. Another offer crossing of the right type and quality can remove the dry offer. However, if the required offer crossing type and quality are rare, it may take a while for the dry offer to be removed.

With this amendment enabled, the XRP Ledger removes these dry offers when they're matched in auto-bridging.


## Action Required

- If you operate a `rippled` server, you must upgrade to version 1.2.0 (or higher) by 2019-03-23, for service continuity. The most recent version of `rippled`, version 1.2.2, is recommended.

- If you use the XRP Ledger for your business, be sure you are ready to handle the new response codes that may be returned after the amendment becomes enabled.

## Impact of Not Upgrading

If you operate a `rippled` server but don’t upgrade to version 1.2.0 (or higher) by 2019-03-23, when the fix1578 amendment is expected to become enabled, then your server will become amendment blocked, meaning that your server:

* Cannot determine the validity of a ledger
* Cannot submit or process transactions
* Does not participate in the consensus process
* Does not vote on future amendments
* Could rely on potentially invalid data

If the fix1578 amendment does not become enabled, then your server will not become amendment blocked until the fixTakerDryOfferRemoval amendment becomes enabled on 2019-04-02. If neither amendment becomes enabled, older server versions should continue to operate without becoming amendment blocked. However, it is still recommended that you update to [`rippled` version 1.2.2](https://github.com/ripple/rippled/releases/tag/1.2.2) or higher.

For instructions on upgrading `rippled` on supported platforms, see [Install `rippled`](https://developers.ripple.com/install-rippled.html).

## Learn, ask questions, and discuss
Related documentation is available in the [XRP Ledger Dev Portal](https://developers.ripple.com/), including detailed example API calls and web tools for API testing.

Other resources:

* [The Ripple Dev Blog](https://developers.ripple.com/blog/)
* Ripple Technical Services: <support@ripple.com>
* [XRP Chat Forum](http://www.xrpchat.com/)
