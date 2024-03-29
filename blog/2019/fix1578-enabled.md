---
labels:
    - Amendments
category: 2019
date: 2019-03-23
theme:
    markdown:
        editPage:
            hide: true
---
# fix1578 is Now Available

[As previously announced](https://developers.ripple.com/blog/2019/fix1578-expected.html), the fix1578 amendment [became enabled on the XRP Ledger](https://xrpcharts.ripple.com/#/transactions/7A80C87F59BCE6973CBDCA91E4DBDB0FC5461D3599A8BC8EAD02FA590A50005D) on 2019-03-23.

## Action Required

- If you operate a `rippled` server, you should upgrade to version 1.2.0 (or higher) immediately. Version 1.2.2 is recommended.

For instructions on upgrading `rippled` on supported platforms, see [Install `rippled`](https://developers.ripple.com/install-rippled.html).


## Impact of Not Upgrading

If you operate a `rippled` server on a version older than 1.2.0, then your server is now amendment blocked, meaning that your server:

* Cannot determine the validity of a ledger
* Cannot submit or process transactions
* Does not participate in the consensus process
* Does not vote on future amendments
* Could rely on potentially invalid data

## fix1578 Summary

Changes the result codes returned by two transaction types:

- Changes the [OfferCreate transaction](https://developers.ripple.com/offercreate.html) to return a new result code, `tecKILLED`, if the offer used the `tfFillOrKill` flag and was killed. Without this amendment, the offer is killed but the transaction result is `tesSUCCESS`.
- Changes the [TrustSet transaction](https://developers.ripple.com/trustset.html) to fail with `tecNO_PERMISSION` if it tries to enable the [NoRipple flag](https://developers.ripple.com/rippling.html#the-noripple-flag) but cannot because the trust line has a negative balance. Without this amendment, the transaction does not enable the NoRipple flag, but the transaction result is `tesSUCCESS` nonetheless.

## Learn, ask questions, and discuss
Related documentation is available in the [XRP Ledger Dev Portal](https://developers.ripple.com/), including detailed example API calls and web tools for API testing.

Other resources:

* The Ripple Forum (_Disabled._ Formerly `forum.ripple.com`)
* [The Ripple Dev Blog](https://developers.ripple.com/blog/)
* Ripple Technical Services: <support@ripple.com>
* [XRP Chat Forum](http://www.xrpchat.com/)
