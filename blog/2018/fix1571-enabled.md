---
date: 2018-06-20
category: 2018
labels:
    - Amendments
theme:
    markdown:
        editPage:
            hide: true
---
# fix1571 is Now Available

As previously announced, the fix1571 amendment [became enabled on the XRP Ledger](https://xrpcharts.ripple.com/#/transactions/920AA493E57D991414B614FB3C1D1E2F863211B48129D09BC8CB74C9813C38FC) on 2018-06-19. Furthermore, the fix1623 amendment is expected to become enabled on 2018-06-20, followed by the fix1543 amendment on 2018-06-21.

## Action Required

- If you operate a `rippled` server, you should upgrade to [version 1.0.1](https://developers.ripple.com/blog/2018/rippled-1.0.1.html) (or higher) immediately.

For instructions on upgrading `rippled` on supported platforms, see [Updating `rippled` on supported platforms](https://developers.ripple.com/update-rippled.html).

## Impact of Not Upgrading

If you operate a `rippled` server on a version older than 1.0.0, then your server is now amendment blocked, meaning that your server:

* Cannot determine the validity of a ledger
* Cannot submit or process transactions
* Does not participate in the consensus process
* Does not vote on future amendments
* Could rely on potentially invalid data

## fix1571 Summary

Changes Escrow to fix the following issues:

- Changes the [EscrowCreate transaction](https://developers.ripple.com/escrowcreate.html) to require the `Condition` or `FinishAfter` field (or both). Escrows with neither `Condition` nor `FinishAfter` that were created before this amendment can be finished by anyone at any time before their `CancelAfter` time.
- Fixes a flaw that incorrectly prevents time-based Escrows from being finished in some circumstances.

## Learn More
Related documentation is available in the [XRP Ledger Dev Portal](https://developers.ripple.com/), including detailed example API calls and web tools for API testing.

Other resources:

* The Ripple Forum (_Disabled._ Formerly `forum.ripple.com`)
* [The Ripple Dev Blog](https://developers.ripple.com/blog/)
* Ripple Technical Services: <support@ripple.com>
* [XRP Chat](http://www.xrpchat.com/)
