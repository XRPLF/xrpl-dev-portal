---
date: 2016-12-20
labels:
    - Release Notes
category: 2016
theme:
    markdown:
        editPage:
            hide: true
---
# rippled version 0.40.0

Ripple has released `rippled` version 0.40.0, which introduces several enhancements that improve the reliability and scalability of the Ripple Consensus Ledger (RCL). Ripple recommends that all server operators upgrade to version 0.40.0 by Tuesday, 2017-01-17, for service continuity.

Highlights of this release include:

* Suspended Payments, a new transaction type on the Ripple network that functions similar to an escrow service, which permits users to cryptographically escrow XRP on RCL with an expiration date. Ripple expects Suspended Payments to be enabled via an [Amendment named “SusPay”](https://ripple.com/build/amendments/#suspay) on Tuesday, 2017-01-17. See below for details.

## Action Required

If you operate a `rippled` server, then you should upgrade to version 0.40.0 by Tuesday, 2017-01-17, for service continuity.

## Impact of Not Upgrading

If you operate a `rippled` server but don’t upgrade to version 0.40.0 by Wednesday, 2017-01-17, when SusPay is expected to be activated via Amendment, then your server will become [amendment blocked](https://ripple.com/build/amendments/#amendment-blocked), meaning that your server:

* Cannot determine the validity of a ledger
* Cannot submit or process transactions
* Does not participate in the consensus process
* Does not vote on future amendments
* Could rely on potentially invalid data

If the SusPay amendment is vetoed or does not pass via majority vote, then your server will not become amendment blocked.

For instructions on updating `rippled` on supported platforms, see [Updating `rippled` on supported platforms](https://ripple.com/build/rippled-setup/#updating-rippled).

The md5sum for the rpm is: 27d0d142f29bcde7d240d91d44b5d7dc

The md5sum for the source rpm is: b3b5ab6897f3c08b492f383ef7763c21

For other platforms, please [compile version 0.40.0 from source](https://github.com/ripple/rippled/tree/master/Builds).

The first log entry should be the change setting the version:

          commit 7fc780dd70faef819eace27a12de35dd1363c069
          Author: Nik Bougalis <nikb@bougalis.net>
          Date:   Tue Dec 20 09:20:17 2016 -0800

              Set version to 0.40.0

## Network Update
The Ripple operations team plans to deploy version 0.40.0 to a subset of rippled servers under its operational control configured with the new websocket implementation, starting at 2:00 PM PDT on Thursday, 2017-12-20. The network will continue operating during deployment and no outage is expected.

## Learn, ask questions, and discuss
Related documentation is available in the [Ripple Developer Portal](https://ripple.com/build/), including detailed example API calls and web tools for API testing.

Other resources:

* The Ripple Forum (_Disabled._ Formerly `forum.ripple.com`)
* [The Ripple Dev Blog](https://developers.ripple.com/blog/)
* Ripple Technical Services: support@ripple.com
* [XRP Chat](http://www.xrpchat.com/)

## Full Release Notes

The `rippled` 0.40.0 release includes Suspended Payments, a new transaction type on the Ripple network that functions similar to an escrow service, which permits users to lock XRP until a cryptographic condition is met or it expires. Ripple expects Suspended Payments to be enabled via an [Amendment named “SusPay”](https://ripple.com/build/amendments/#suspay) on Tuesday, 2017-01-17.

You can [update to the new version](https://ripple.com/build/rippled-setup/#updating-rippled) on Red Hat Enterprise Linux 7 or CentOS 7 using yum. For other platforms, please [compile the new version from source](https://github.com/ripple/rippled/tree/master/Builds).

**New and Updated Features**

Previously, Ripple [announced](https://developers.ripple.com/blog/2016/rippled-0.33.0.html) the introduction of Payment Channels during the release of rippled version 0.33.0, which permit scalable, off-ledger checkpoints of high volume, low value payments flowing in a single direction. This was the first step in a multi-phase effort to make RCL more scalable and to support [Interledger Protocol](https://interledger.org/interledger.pdf) (ILP). Ripple expects Payment Channels to be enabled via an [Amendment called PayChan](https://ripple.com/build/amendments/#paychan) on a future date to be determined.

In the second phase towards making RCL more scalable and compatible with ILP, Ripple is introducing Suspended Payments, a new transaction type on the Ripple network that functions similar to an escrow service, which permits users to cryptographically escrow XRP on RCL with an expiration date. Ripple expects Suspended Payments to be enabled via an [Amendment named “SusPay”](https://ripple.com/build/amendments/#suspay) on Tuesday, 2017-01-17.

A Suspended Payment can be created, which deducts the funds from the sending account. It can then be either fulfilled or canceled. It can only be fulfilled if the fulfillment transaction makes it into a ledger with a CloseTime lower than the expiry date of the transaction. It can be canceled with a transaction that makes it into a ledger with a CloseTime greater than the expiry date of the transaction.

In the third phase towards making RCL more scalable and compatible with ILP, Ripple plans to introduce additional library support for crypto-conditions, which are distributable event descriptions written in a standard format that describe how to recognize a fulfillment message without saying exactly what the fulfillment is. Fulfillments are cryptographically verifiable messages that prove an event occurred. If you transmit a fulfillment, then everyone who has the condition can agree that the condition has been met. Fulfillment requires the submission of a signature that matches the condition (message hash and public key). This format supports multiple algorithms, including different hash functions and cryptographic signing schemes. Crypto-conditions can be nested in multiple levels, with each level possibly having multiple signatures.

Lastly, we do not have an update on the [previously announced](https://developers.ripple.com/blog/2016/rippled-0.33.0.html) changes to the hash tree structure that rippled uses to represent a ledger, called [SHAMapV2](https://ripple.com/build/amendments/#shamapv2). This will require brief scheduled allowable downtime while the changes to the hash tree structure are propagated by the network. We will keep the community updated as we progress towards this date (TBA).

* Consensus refactor [(#1874)](https://github.com/ripple/rippled/pull/1874)

**Bug Fixes**

* Correct an issue in payment flow code that did not remove an unfunded offer [(#1860)](https://github.com/ripple/rippled/pull/1860)

* Sign validator manifests with both ephemeral and master keys [(#1865)](https://github.com/ripple/rippled/pull/1865)

* Correctly parse multi-buffer JSON messages [(#1862)](https://github.com/ripple/rippled/pull/1862)
