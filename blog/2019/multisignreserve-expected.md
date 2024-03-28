---
labels:
    - Amendments
category: 2019
date: 2019-04-04
theme:
    markdown:
        editPage:
            hide: true
---
# The MultiSignReserve Amendment is Expected 2019-04-17

The MultiSignReserve amendment to the XRP Ledger, introduced in [`rippled` v1.2.0](https://github.com/ripple/rippled/releases/tag/1.2.0), has [gained support from a majority of trusted validators](https://xrpcharts.ripple.com/#/transactions/E394F1DA552936FD26E5BBE6BF57B27869CA897EB4AF082AD22FFE7A259FED2B). Currently, it is expected to become enabled on 2019-04-17. As long as the MultiSignReserve amendment continues to have the support of at least 80% of trusted validators continuously, it will become enabled on the scheduled date.

## MultiSignReserve Summary

Reduces the [owner reserve](https://developers.ripple.com/reserves.html#owner-reserves) counted against your XRP Ledger account when it owns a [multi-signing](https://developers.ripple.com/multi-signing.html) SignerList.

Without this amendment, the owner reserve for a SignerList ranges from 15 to 50 XRP, depending on the number of signers in the list.

With this amendment enabled, the owner reserve for a new SignerList is 5 XRP, regardless of the number of signers. The reserve requirement for previously-created SignerList objects remains unchanged. To reduce the reserve requirement of SignerList objects created before this amendment was enabled, use a [SignerListSet transaction](https://developers.ripple.com/signerlistset.html) to replace the SignerList after this amendment has been enabled. (The replacement can be identical to the previous version.)

## No Action Required

The MultiSignReserve amendment is supported by `rippled` versions 1.2.0 and later, which have been required on the production XRP Ledger since [fix1578 became enabled](https://developers.ripple.com/blog/2019/fix1578-enabled.html) on 2019-03-23. [Version 1.2.3](https://developers.ripple.com/blog/2019/rippled-1.2.3.html) is recommended.

If you are already using multi-signing in production, no changes are necessary to continue to use multi-signing after this amendment becomes enabled. If the amendment becomes enabled, you can benefit from the lowered reserve requirement for your account's SignerList by updating or replacing the SignerList. (The replacement can be identical to the previous version.)

## Learn, ask questions, and discuss

Related documentation is available in the [XRP Ledger Dev Portal](https://developers.ripple.com/), including detailed example API calls and web tools for API testing.

Other resources:

* The Ripple Forum (_Disabled._ Formerly `forum.ripple.com`)
* [The Ripple Dev Blog](https://ripple.com/dev-blog/)
* Ripple Technical Services: <support@ripple.com>
* [XRP Chat Forum](http://www.xrpchat.com/)
