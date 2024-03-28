---
date: 2017-06-15
category: 2017
labels:
    - Release Notes
theme:
    markdown:
        editPage:
            hide: true
---
# rippled Version 0.70.0

Ripple has released `rippled` version 0.70.0, which introduces several enhancements that improve the reliability, scalability and security of the Ripple Consensus Ledger. Ripple recommends that all `rippled` server operators upgrade to version 0.70.0 by Thursday, 2017-06-29, for service continuity.

Highlights of this release include:

* The [**FlowCross** Amendment](https://ripple.com/build/amendments/#flowcross), which streamlines offer crossing and autobrigding logic by leveraging the new “Flow” payment engine in `rippled`.

* The [**EnforceInvariants** Amendment](https://ripple.com/build/amendments/#enforceinvariants), which safeguards the integrity of RCL by introducing code that executes after every transaction and ensures that the execution did not violate key protocol rules.

* [**fix1373**](https://ripple.com/build/amendments/#fix1373), which addresses an issue that would cause payments with certain path specifications to not be properly parsed.

Ripple expects the **EnforceInvariants** and **fix1373** Amendments to be enabled on Thursday, 2017-06-29. The **FlowCross** Amendment will be enabled on a future date (TBA).

## Operational Note

The algorithm that determines how many threads `rippled` uses has been changed with this release. The new logic creates more threads, allowing the server to better leverage multi-core processing units. As a result of the increase in thread count, operators may find that their `rippled` instances may now utilize more memory than in the past.

## Action Required

**If you operate a `rippled` server**, then you should upgrade to version 0.70.0 by Thursday, 2017-06-29, for service continuity.

## Impact of Not Upgrading

If you operate a `rippled` server but do not upgrade to version 0.70.0 by Thursday, 2017-06-29, when **EnforceInvariants** and **fix1373** are expected to be activated via Amendment, then your server will become [amendment blocked](https://ripple.com/build/amendments/#amendment-blocked), meaning that your server:

* Cannot determine the validity of a ledger
* Cannot submit or process transactions
* Does not participate in the consensus process
* Does not vote on future amendments
* Could rely on potentially invalid data

If the **EnforceInvariants** and **fix1373** Amendments do not get approved, then your server will not become amendment blocked and should continue to operate.

For instructions on updating `rippled` on supported platforms, see [Updating `rippled` on supported platforms](https://ripple.com/build/rippled-setup/#updating-rippled).

The sha256 for the rpm is: 5a617bce531f39c044de535b6bda2a59371829dfc1079b67876b68c9a9748834

The sha256 for the source rpm is: c51212ae374f69ddc10f967409a750834f06195cb384b2af04e4fa0c3fb81a24

For other platforms, please [compile version 0.70.0 from source](https://github.com/ripple/rippled/tree/master/Builds).

The first log entry should be the change setting the version:

        commit 7b0d48281049c3fec7fafcb7ce5cea045367ae1f
        Author: Nik Bougalis <nikb@bougalis.net>
        Date:   Thu Jun 15 07:34:17 2017 -0700

              Set version to 0.70.0

## Network Update
The Ripple operations team plans to deploy version 0.70.0 to all `rippled` servers under its operational control, including private clusters, starting at 2:00 PM PST on Thursday, 2017-06-15. The deployment is expected to complete within 4 hours. The network should continue to operate during deployment and no outage is expected.

At that time, `rippled` validators under Ripple’s operational control will begin voting for the **EnforceInvariants** and **fix1737** Amendments.

## Learn, ask questions, and discuss
Related documentation is available in the [Ripple Developer Portal](https://ripple.com/build/), including detailed example API calls and web tools for API testing.

Other resources:

* The Ripple Forum (_Disabled._ Formerly `forum.ripple.com`)
* [The Ripple Dev Blog](https://developers.ripple.com/blog/)
* Ripple Technical Services: <support@ripple.com>
* [XRP Chat](http://www.xrpchat.com/)

## Full Release Notes

### FlowCross

Currently, the offer crossing code in `rippled` is independent of the payment flow code in `rippled`. The introduction of the **FlowCross** Amendment ensures that the same logic that drives payments also drives offer crossing. This change streamlines the code base, improves test coverage and is expected to result in some marginal performance benefits in offer crossing. For more information, see [FlowCross](https://ripple.com/build/amendments/#flowcross).

### EnforceInvariants

The introduction of the **EnforceInvariants** Amendment supplements existing safeguards of RCL  integrity. Once the amendment activates, the servers will execute specialized code to check key system invariants after the execution of each transaction. If a transaction fails any of the checks, it will be considered as invalid. For more information, see [EnforceInvariants](https://ripple.com/build/amendments/#enforceinvariants).

### fix1373 Amendment

Version 0.70.0 also introduces the fix1373 Amendment to fix a minor bug in pathfinding that causes strand creation to fail. Specifically, the issue was related to paths that contain path elements where all the path elements types are set (account, currency and issuer). The fix1373 Amendment corrects the issue that caused some strand creation to fail. For more information, see [fix1373](https://ripple.com/build/amendments/#fix1373).

These features underline Ripple’s continued support to improving RCL by making it more stable, secure and efficient for settlement of global payments.

## Upcoming Features

We do not have an update on the [previously announced](https://developers.ripple.com/blog/2016/rippled-0.33.0.html) changes to the hash tree structure that `rippled` uses to represent a ledger, called [SHAMapV2](https://ripple.com/build/amendments/#shamapv2). At the time of activation, this amendment will require brief scheduled allowable unavailability while the changes to the hash tree structure are computed by the network. We will keep the community updated as we progress towards this date (TBA).

You can [update to the new version](https://ripple.com/build/rippled-setup/#updating-rippled) on Red Hat Enterprise Linux 7 or CentOS 7 using yum. For other platforms, please [compile the new version from source](https://github.com/ripple/rippled/tree/master/Builds).


## 0.70.0 Change Log

* Implement and test invariant checks for transactions [(#2054)](https://github.com/ripple/rippled/pull/2054)
* TxQ: Functionality to dump all queued transactions [(#2020)](https://github.com/ripple/rippled/pull/2020)
* Consensus refactor for simulation/cleanup [(#2040)](https://github.com/ripple/rippled/pull/2040)
* Payment flow() code should support offer crossing [(#1884)](https://github.com/ripple/rippled/pull/1884)
* Make Config init extensible via lambda [(#1993)](https://github.com/ripple/rippled/pull/1993)
* Improve Consensus Documentation [(#2064)](https://github.com/ripple/rippled/pull/2064)
* Refactor Dependencies & Unit Test Consensus [(#1941)](https://github.com/ripple/rippled/pull/1941)
* Feature RPC test [(#1988)](https://github.com/ripple/rippled/pull/1988)
* Add unit Tests for handlers/TxHistory.cpp [(#2062)](https://github.com/ripple/rippled/pull/2062)
* Add unit tests for handlers/AccountCurrenciesHandler.cpp [(#2085)](https://github.com/ripple/rippled/pull/2085)
* Add unit test for handlers/Peers.cpp [(#2060)](https://github.com/ripple/rippled/pull/2060)
* Improve logging for Transaction affects no accounts warning [(#2043)](https://github.com/ripple/rippled/pull/2043)
* Increase logging in PeerImpl fail [(#2043)](https://github.com/ripple/rippled/pull/2043)
* Allow filtering of ledger objects by type in RPC [(#2066)](https://github.com/ripple/rippled/pull/2066)
* Cleanup, refactor, and improve GetMissingNodes [(#1979)](https://github.com/ripple/rippled/pull/1979)
* Add helper to modify Env configs [(#2003)](https://github.com/ripple/rippled/pull/2003)
* Add timer start param to Application [(#2024)](https://github.com/ripple/rippled/pull/2024)
* Improve log warnings [(#2043)](https://github.com/ripple/rippled/pull/2043)
* Prevent low likelihood Database job queue crash [(#2052)](https://github.com/ripple/rippled/pull/2052)
* Remove ledger and manifest Python tools [(#2057)](https://github.com/ripple/rippled/pull/2057)

## Bug Fixes

* Fix displayed warning when generating brain wallets [(#2121)](https://github.com/ripple/rippled/pull/2121)
* Cmake build does not append '+DEBUG' to the version info for non-unity builds [(#1264)](https://github.com/ripple/rippled/pull/1264)
* Crossing tiny offers can misbehave on RCL [(#1884)](https://github.com/ripple/rippled/pull/1884)
* asfRequireAuth flag not always obeyed [(#2092)](https://github.com/ripple/rippled/pull/2092)
* Strand creating is incorrectly accepting invalid paths (No ticket)
* JobQueue occasionally crashes on shutdown [(#2025)](https://github.com/ripple/rippled/pull/2025)
* Prevent consensus from relaying/retrying rejected pseudo-transactions [(#2104)](https://github.com/ripple/rippled/pull/2104)
* Improve pseudo-transaction handling [(#2104)](https://github.com/ripple/rippled/pull/2104)
