---
date: 2017-03-17
category: 2017
labels:
    - Release Notes
theme:
    markdown:
        editPage:
            hide: true
---
# rippled Version 0.60.0

Ripple has released `rippled` version 0.60.0, which introduces several enhancements that improve the reliability and scalability of the Ripple Consensus Ledger (RCL), including [Interledger Protocol](https://interledger.org/overview.html) compatibility for ledger interoperability. Ripple recommends that all server operators upgrade to version 0.60.0 by Thursday, 2017-03-30, for service continuity.

Highlights of this release include:

* **Escrow** (previously called SusPay), which permits users to cryptographically escrow XRP on RCL with an expiration date using a [hashlock crypto-condition](https://interledgerjs.github.io/five-bells-condition/jsdoc/).

* **[Dynamic UNL Lite](https://github.com/ripple/rippled/pull/1842)**, which allows `rippled` to automatically adjust which validators it trusts based on recommended lists from trusted publishers.

Ripple expects Escrow, the [previously announced **Payment Channels**](https://developers.ripple.com/blog/2016/rippled-0.33.0.html), and the new [**fix1368** amendment](#fix1368-amendment) to be enabled via Amendments called [Escrow](https://ripple.com/build/amendments/#escrow), [PayChan](https://ripple.com/build/amendments/#paychan), and `fix1368`, respectively, on Thursday, 2017-03-30.


## Action Required

**If you operate a `rippled` server**, then you should upgrade to version 0.60.0 by Thursday, 2017-03-30, for service continuity.

## Impact of Not Upgrading

If you operate a `rippled` server but don’t upgrade to version 0.60.0 by Thursday, 2017-03-30, when Escrow and PayChan are expected to be activated via Amendment, then your server will become [amendment blocked](https://ripple.com/build/amendments/#amendment-blocked), meaning that your server:

* Cannot determine the validity of a ledger
* Cannot submit or process transactions
* Does not participate in the consensus process
* Does not vote on future amendments
* Could rely on potentially invalid data

If the **Escrow** and **PayChan** amendments do not get approved, then your server will not become amendment blocked and should continue to operate.

For instructions on updating `rippled` on supported platforms, see [Updating `rippled` on supported platforms](https://ripple.com/build/rippled-setup/#updating-rippled).

The sha256 for the rpm is: 4d2acb2a40e2d18ba1737098efdca54caa823a403ce9562c83e2dd2c9e959588

The sha256 for the source rpm is: 3437a0202e762801869f31bf798417ebdb3717e16c4381dc0e9b02fe75d23024

For other platforms, please [compile version 0.60.0 from source](https://github.com/ripple/rippled/tree/master/Builds).

The first log entry should be the change setting the version:

        commit 0df1b09a731ba0feaa5d60046e1c7dd415f5f7ed
        Author: Nik Bougalis <nikb@bougalis.net>
        Date:   Thu Mar 16 13:33:29 2017 -0700

            Set version to 0.60.0

## Network Update
The Ripple operations team plans to deploy version 0.60.0 to all `rippled` servers under its operational control, including private clusters, starting at 7:00 PM PST on Thursday, 2017-03-16. The deployment is expected to complete within 4 hours. The network should continue to operate during deployment and no outage is expected.

## Learn, ask questions, and discuss
Related documentation is available in the [Ripple Developer Portal](https://ripple.com/build/), including detailed example API calls and web tools for API testing.

Other resources:

* The Ripple Forum (_Disabled._ Formerly `forum.ripple.com`)
* [The Ripple Dev Blog](https://developers.ripple.com/blog/)
* Ripple Technical Services: <support@ripple.com>
* [XRP Chat](http://www.xrpchat.com/)

## Full Release Notes

### Escrow

The rippled version 0.60.0 release includes Escrow, (previously called SusPay), which introduces a new ledger node type and several new transaction types to the Ripple network. Escrow permits users to cryptographically escrow XRP on RCL with an expiration date using a [crypto-condition](https://tools.ietf.org/html/draft-thomas-crypto-conditions-02) called [preimage-sha-256](https://interledgerjs.github.io/five-bells-condition/jsdoc/#create-a-preimage-sha-256-condition-hashlock), commonly referred to as a hashlock. An XRP Escrow transaction on RCL can be used together with Interledger, to allow a payment to be routed without having to trust third-party intermediaries. We believe this will open a range of possibilities and use cases for XRP, particularly when sending high value, low volume payments cross-border.

### Payment Channels

The amendment for Payment Channels was originally introduced in version 0.33.0, but is now ready for Payment Channels to be enabled on the production Ripple Consensus Ledger. XRP [Payment Channels](https://ripple.com/build/amendments/#paychan) are intended for high volume, low value payments. They provide a method for scalable, intermittent, off-ledger settlement flowing in a single direction. For bidirectional payment channels, an XRP Payment Channel can be used in each direction. The recipient can claim any unpaid balance at any time before the channel closes. The owner can top off the channel as needed and must wait out a delay to close the channel to give the recipient a chance to supply any claims. The total amount paid increases monotonically as newer claims are issued.

### Dynamic UNL Lite

At the core of RCL is the [consensus process](https://ripple.com/build/ripple-ledger-consensus-process/). Through the consensus process, validating nodes agree on a specific subset of the candidate transactions to be considered for the next ledger. Consensus is an iterative process in which nodes relay proposals, or sets of candidate transactions. Nodes communicate and update proposals until a supermajority of peers agree on the same set of candidate transactions.

During consensus, each node evaluates proposals from a specific set of peers, called chosen validators. Chosen validators represent a subset of the network which, when taken collectively, is “trusted” not to collude in an attempt to defraud the node evaluating the proposals. This definition of “trust” does not require that each individual chosen validator is trusted. Rather, validators are chosen based on the expectation they will not collude in a coordinated effort to falsify data relayed to the network.

The `rippled` version 0.60.0 release introduces new [Dynamic UNL](https://github.com/ripple/rippled/pull/1842) configuration options, which allow `rippled` to update its set of trusted validators without reconfiguring and restarting. Instead of specifying a static list of trusted validators in the config or validators file, you can configure a trusted publisher key and a URI where the publisher serves signed lists of validators. `rippled` will regularly query the configured URIs for the latest recommended list of validators from the trusted publishers. Configuring the validation quorum is no longer required, as `rippled` will automatically update its quorum based on its current trusted validator set.

Dynamic UNL Lite is a progressive step towards fully automated dynamic UNLs, to which each client of the Ripple network determines its UNL through policies, rather than trusting a pre-provided list of validators.

### fix1368 Amendment

Version 0.60.0 also introduces the [fix1368 Amendment](https://github.com/ripple/rippled/pull/1936) to fix a minor bug in transaction processing that causes some payments to fail when they should be valid. Specifically, during payment processing, some payment steps that are expected to produce a certain amount of currency may produce a microscopically different amount, due to a loss of precision related to floating-point number representation. When this occurs, those payments fail because they cannot deliver the exact amount intended. The fix1368 amendment corrects transaction processing so payments can no longer fail in this manner.

These features underline Ripple’s continued support to improving RCL by making it more stable, distributed and scalable for settlement of global payments.

## Upcoming Features

We do not have an update on the [previously announced](https://developers.ripple.com/blog/2016/rippled-0.33.0.html) changes to the hash tree structure that `rippled` uses to represent a ledger, called [SHAMapV2](https://ripple.com/build/amendments/#shamapv2). At the time of activation, this amendment will require brief scheduled allowable unavailability while the changes to the hash tree structure are computed by the network. We will keep the community updated as we progress towards this date (TBA).

You can [update to the new version](https://ripple.com/build/rippled-setup/#updating-rippled) on Red Hat Enterprise Linux 7 or CentOS 7 using yum. For other platforms, please [compile the new version from source](https://github.com/ripple/rippled/tree/master/Builds).


## 0.60.0 Change Log

* Add Escrow support [(#2039)](https://github.com/ripple/rippled/pull/2039/commits/cfde591ac9deb683b9d1be8f8d4c7a14d9598507)
* Dynamize trusted validator list and quorum [(#1842)](https://github.com/ripple/rippled/pull/1842)
* Simplify fee handling during transaction submission [(#1992)](https://github.com/ripple/rippled/commit/8345475bc37a4d6bddf1e47dc06f22ef9396bbd8)
* Publish server stream when fee changes [(#2016)](https://github.com/ripple/rippled/pull/2016)
* Replace manifest with validator token [(#1975)](https://github.com/ripple/rippled/pull/1975)
* Add validator key revocations [(#2019)](https://github.com/ripple/rippled/pull/2019)
* Add SecretKey comparison operator [(#2004)](https://github.com/ripple/rippled/pull/2004/commits/a00e684bf2a088bb432b9f7c4c859ee98c730817)
* Reduce LEDGER_MIN_CONSENSUS [(#2013)](https://github.com/ripple/rippled/pull/2013)
* Update libsecp256k1 and Beast B30 [(#1983)](https://github.com/ripple/rippled/pull/1983)
* Make Config extensible via lambda [(#1993)](https://github.com/ripple/rippled/pull/1993)
* WebSocket permessage-deflate integration [(#1995)](https://github.com/ripple/rippled/pull/1995)
* Do not close socket on a foreign thread [(#2014)](https://github.com/ripple/rippled/pull/2014)
* Update build scripts to support latest boost and ubuntu distros [(#1997)](https://github.com/ripple/rippled/pull/1997)
* Handle protoc targets in scons ninja build [(#2022)](https://github.com/ripple/rippled/pull/2022)
* Specify syntax version for ripple.proto file [(#2007)](https://github.com/ripple/rippled/pull/2007)
* Eliminate protocol header dependency [(#1962)](https://github.com/ripple/rippled/pull/1962)
* Use gnu gold or clang lld linkers if available [(#2031)](https://github.com/ripple/rippled/pull/2031)
* Add tests for lookupLedger [(#1989)](https://github.com/ripple/rippled/pull/1989)
* Add unit test for get_counts RPC method [(#2011)](https://github.com/ripple/rippled/pull/2011)
* Add test for transaction_entry request [(#2017)](https://github.com/ripple/rippled/pull/2017)
* Unit tests of RPC "sign" [(#2010)](https://github.com/ripple/rippled/pull/2010)
* Add failure only unit test reporter [(#2018)](https://github.com/ripple/rippled/pull/2018)

## Bug Fixes

* Enforce rippling constraints during payments [(#2049)](https://github.com/ripple/rippled/pull/2049)
* Fix limiting step re-execute bug [(#1936)](https://github.com/ripple/rippled/pull/1936)
* Make "wss" work the same as "wss2" [(#2033)](https://github.com/ripple/rippled/pull/2033)
* Check for malformed public key on payment channel [(#2027)](https://github.com/ripple/rippled/pull/2027)
* Config test uses unique directories for each test [(#1984)](https://github.com/ripple/rippled/pull/1984)
* Send a websocket ping before timing out in server [(#2035)](https://github.com/ripple/rippled/pull/2035)
