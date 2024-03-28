---
date: 2017-03-27
category: 2017
labels:
    - Amendments
theme:
    markdown:
        editPage:
            hide: true
---
# Escrow, PayChan, and fix1368 Will Be Available in 3 Days

A majority of `rippled` validators voted to enable the [Escrow](https://ripple.com/build/amendments/#escrow), [PayChan](https://ripple.com/build/amendments/#paychan), and [fix1368](https://ripple.com/build/amendments/#fix1368) Amendments, which are scheduled to become enabled on the network on Thursday, 2017-03-30.

* **Escrow** (previously called SusPay), designed for low volume, high value transactions, permits users to cryptographically escrow XRP on RCL with an expiration date using a [hashlock crypto-condition](https://interledgerjs.github.io/five-bells-condition/jsdoc/).

* **PayChan**, designed for high volume, low value transactions, flowing in a single direction. The scalability of these transactions is not limited by the Ripple Consensus ledger, and they do not incur the risks typically associated with delayed settlement.

* **fix1368** fixes a minor bug in transaction processing that causes some payments to fail when they should be valid.


## Action Required

**If you operate a `rippled` server**, then you should upgrade to version 0.60.0 by Thursday, 2017-03-30, for service continuity.

## Impact of Not Upgrading

If you operate a `rippled` server but don’t upgrade to version 0.60.0 by Thursday, 2017-03-30, when **Escrow, PayChan & fix1368** are expected to be activated via Amendment, then your server will become [amendment blocked](https://ripple.com/build/amendments/#amendment-blocked), meaning that your server:

* Cannot determine the validity of a ledger
* Cannot submit or process transactions
* Does not participate in the consensus process
* Does not vote on future amendments
* Could rely on potentially invalid data

If the **Escrow, PayChan & fix1368** amendments do not get approved, then your server will not become amendment blocked and should continue to operate.

For instructions on updating `rippled` on supported platforms, see [Updating `rippled` on supported platforms](https://ripple.com/build/rippled-setup/#updating-rippled).

## Learn, ask questions, and discuss
Related documentation is available in the [Ripple Developer Portal](https://ripple.com/build/), including detailed example API calls and web tools for API testing.

Other resources:

* The Ripple Forum (_Disabled._ Formerly `forum.ripple.com`)
* [The Ripple Dev Blog](https://developers.ripple.com/blog/)
* Ripple Technical Services: <support@ripple.com>
* [XRP Chat](http://www.xrpchat.com/)
