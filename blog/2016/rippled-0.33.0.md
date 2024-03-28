---
date: 2016-09-29
labels:
    - Release Notes
category: 2016
theme:
    markdown:
        editPage:
            hide: true
---
# rippled version 0.33.0

Ripple has released `rippled` version 0.33.0, which introduces several new enhancements that improve the reliability and scalability of the Ripple Consensus Ledger (RCL). Ripple recommends that all server operators upgrade to version 0.33.0 by Wednesday, 2016-10-20, for service continuity.

Highlights of this release include:

* An improved version of the payment code, which Ripple expects to be available via an [Amendment named "Flow"](https://ripple.com/build/amendments/#flow) on Wednesday, 2016-10-20. See below for details.
* Payment Channels that permit scalable, off-ledger checkpoints for high volume, low value payments flowing in a single direction, which Ripple expects to be activated via an [Amendment named “PayChan”](https://ripple.com/build/amendments/#paychan) on a future date TBA. See below for details.
* SHAMapV2 changes the hash tree structure that rippled uses to represent a ledger, which Ripple expects to be activated via an [Amendment named SHAMapV2](https://ripple.com/build/amendments/#shamapv2) on a future date TBA. See below for details.

## Action Required

**If you operate a `rippled` server, then you should upgrade to version 0.33.0 by Wednesday, 2016-10-20, for service continuity.**

## Impact of Not Upgrading

The Flow amendment is expected to be activated on Wednesday, 2016-10-20. If you operate a rippled server but don't upgrade to version 0.33.0 by that time, then your server will become amendment blocked, which means that your server:

* Cannot determine the validity of a ledger
* Cannot submit or process transactions
* Does not participate in the consensus process
* Does not vote on future amendments

If the Flow amendment is vetoed or does not pass via majority vote, then your server will not become amendment blocked and should continue to operate.

For instructions on updating `rippled` on supported platforms, see [Updating `rippled` on supported platforms](https://ripple.com/build/rippled-setup/#updating-rippled).

The md5sum for the rpm is: 5ad8fa43e9acf645a76d0a383eb5600a

The md5sum for the source rpm is: 38fe8c022e2fe5086f71fb9623a18064

For other platforms, please [compile version 0.33.0 from source](https://github.com/ripple/rippled/tree/master/Builds).

The first log entry should be the change setting the version:

      commit f05321d501002cd7b8e7fba3ef361834689b3c26
      Author: Nik Bougalis <nikb@bougalis.net>
      Date:   Thu Sep 29 09:25:46 2016 -0700

      Set version to 0.33.0

## Network Update
The Ripple operations team plans to deploy version 0.33.0 to all rippled servers under its operational control, including private clusters, starting at 2:00 PM PDT on Thursday, 2016-09-29. The deployment is expected to complete within 4 hours. The network should continue to operate during deployment and no outage is expected.

## Learn, ask questions, and discuss
Related documentation is available in the [Ripple Developer Portal](https://ripple.com/build/), including detailed example API calls and web tools for API testing.

Other resources:

* The Ripple Forum (_Disabled._ Formerly `forum.ripple.com`)
* [The Ripple Dev Blog](https://developers.ripple.com/blog/)
* Ripple Technical Services: support@ripple.com
* [XRP Chat](http://www.xrpchat.com/)

## Full Release Notes

The `rippled` 0.33.0 release includes:

* The  ["Flow"](https://ripple.com/build/amendments/#flow) amendment. Ripple expects this amendment to be on Wednesday, 2016-10-20. 

* XRP Payment Channels. Payment channels are a new structure in the ledger designed to support [Interledger Protocol](https://interledger.org/) trust lines as balances get substantial. Ripple expects to be activated via Amendment on a future date (TBA) with the name [“PayChan”](https://ripple.com/build/amendments/#paychan).

* Changes to the hash tree structure, which `rippled` uses hash trees to represent a ledger. Ripple expects these changes expect to be available via Amendment on a future date (TBA) with the name [SHAMapV2](https://ripple.com/build/amendments/#shamapv2).

You can [update to the new version](https://ripple.com/build/rippled-setup/#updating-rippled) on Red Hat Enterprise Linux 7 or CentOS 7 using yum. For other platforms, please [compile the new version from source](https://github.com/ripple/rippled/tree/master/Builds).

**New and Updated Features**

A fixed version of the new payment processing engine, which Ripple initially [announced on Friday, 2016-07-29](https://developers.ripple.com/blog/2016/rippled-0.32.1.html), is expected to be available via Amendment on Wednesday, 2016-10-20 with the name ["Flow"](https://ripple.com/build/amendments/#flow). The new payments code adds no new features, but improves efficiency and robustness in payment handling.

Ripple will be introducing changes to the hash tree structure that rippled uses to represent a ledger. Ripple expects these changes to be activated via Amendment on a future date (TBA) with the name [SHAMapV2](https://ripple.com/build/amendments/#shamapv2). The new structure is more compact and efficient than the previous version. This affects how ledger hashes are calculated, but has no other user-facing consequences. The activation of the SHAMapV2 amendment will require brief scheduled allowable downtime, while the changes to the hash tree structure are propagated by the network. Ripple will keep the community updated as we progress towards this date (TBA).

In an effort to make RCL more scalable and to support [Interledger Protocol](https://interledger.org/) (ILP) trust lines as balances get more substantial, Ripple is introducing XRP Payment Channels, a new structure in the ledger, which we expect to be available via Amendment on a future date (TBA) with the name [“PayChan”](https://ripple.com/build/amendments/#paychan).

XRP Payment Channels permit scalable, intermittent, off-ledger settlement of ILP trust lines for high volume, low value payments flowing in a single direction. For bidirectional channels, an XRP Payment Channel can be used in each direction. The recipient can claim any unpaid balance at any time. The owner can top off the channel as needed. The owner must wait out a delay to close the channel to give the recipient a chance to supply any claims. The total amount paid increases monotonically as newer claims are issued.

The initial concept behind payment channels was discussed as [early as 2011](https://bitcointalk.org/index.php?topic=25786.0) and the first implementation was done by Mike Hearn [in bitcoinj](https://bitcoinj.github.io/working-with-micropayments). Recent work being done by [Lightning Network](https://en.bitcoin.it/wiki/Lightning_Network) has showcased examples of the many use cases for payment channels. The introduction of XRP Payment Channels allows for a more efficient integration between RCL and ILP to further support enterprise use cases for high volume, low value payments.

* The account_info command can now return information about queued transactions - [RIPD-1205]
* Automatically-provided sequence numbers now consider the transaction queue - [RIPD-1206]
* The server_info and server_state commands now include the queue-related escalated fee factor in the load_factor field of the response - [RIPD-1207]
* A transaction with a high transaction cost can now cause transactions from the same sender queued in front of it to get into the open ledger if the transaction costs are high enough on average across all such transactions. - [RIPD-1246]
* Reorganization: Move LoadFeeTrack to app/tx and clean up functions - [RIPD-956]
* Reorganization: unit test source files -  [RIPD-1132]
* Reorganization: NuDB stand-alone repository - [RIPD-1163]
* Reorganization: Add BEAST_EXPECT to Beast - [RIPD-1243]
* Reorganization: Beast 64-bit CMake/Bjam target on Windows - [RIPD-1262]

**Bug Fixes**

Correct an issue with PaymentSandbox::balanceHook that can return the wrong issuer, which could cause the transfer fee to be incorrectly by-passed in rare circumstances. [(#1827)](https://github.com/ripple/rippled/commit/cf8b6be494c3537f3d6eeeb0a23d5454402688b1)

Correct an issue with the new websocket implementation, which could cause concurrent writes on a single websocket connection. This could result in sporadic crashes when the server was under high load. [(#1806)](https://github.com/ripple/rippled/commit/e8a7ad47487aba3490bb63359ff17cfe584cd58c)

Add HTTP status page for new websocket implementation. [(#1855)](https://github.com/ripple/rippled/commit/b2499c8fa015ac0121b81dcf8f1a92d9e1fd6a4b)
