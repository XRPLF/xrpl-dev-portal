---
date: 2018-06-08
category: 2018
labels:
    - Amendments
theme:
    markdown:
        editPage:
            hide: true
---
# fix1543, fix1571 & fix1623 Amendments Open for Voting

Previously [introduced in `rippled` version 1.0.0](https://developers.ripple.com/blog/2018/rippled-1.0.0.html), the [fix1543](https://developers.ripple.com/known-amendments.html#fix1543), [fix1571](https://developers.ripple.com/known-amendments.html#fix1571) and [fix1623](https://developers.ripple.com/known-amendments.html#fix1623) amendments are now open for voting.

* The `fix1543` amendment enforces reserved flag ranges on escrow, payment channel, and ticket transactions.
* The `fix1571` amendment changes the EscrowCreate transaction to require the Condition or FinishAfter field (or both) and also fixes a flaw that incorrectly prevents time-based Escrows from being finished in some circumstances.
* The `fix1623` amendment adds delivered amount metadata to CheckCash transactions that cash a check for a flexible amount.

## Action Required

**If you operate a `rippled` server**, then you should upgrade to version 1.0.0 by Tuesday, 2018-06-19 00:00:00 UTC, for service continuity.

## Impact of Not Upgrading

If you operate a `rippled` server but don’t upgrade to version 1.0.0 by Tuesday, 2018-06-19, when the [fix1543](https://developers.ripple.com/known-amendments.html#fix1543), [fix1571](https://developers.ripple.com/known-amendments.html#fix1571) and [fix1623](https://developers.ripple.com/known-amendments.html#fix1623) amendments are expected to become enabled on the network, then your server will become [amendment blocked](https://developers.ripple.com/amendments.html#amendment-blocked), meaning that your server:

* Cannot determine the validity of a ledger
* Cannot submit or process transactions
* Does not participate in the consensus process
* Does not vote on future amendments
* Could rely on potentially invalid data

If the [fix1543](https://developers.ripple.com/known-amendments.html#fix1543), [fix1571](https://developers.ripple.com/known-amendments.html#fix1571) and [fix1623](https://developers.ripple.com/known-amendments.html#fix1623) amendments do not become enabled, then your server will not become amendment blocked and should continue to operate.

## Learn, ask questions, and discuss
Related documentation is available in the [XRP Ledger Dev Portal](https://developers.ripple.com/), including detailed example API calls and web tools for API testing.

Other resources:

* The Ripple Forum (_Disabled._ Formerly `forum.ripple.com`)
* [The Ripple Dev Blog](https://developers.ripple.com/blog/)
* Ripple Technical Services: <support@ripple.com>
* [XRP Chat](http://www.xrpchat.com/)

To continue receiving updates about the `rippled` server, please subscribe to the Ripple Server Google Group: <https://groups.google.com/forum/#!forum/ripple-server>
