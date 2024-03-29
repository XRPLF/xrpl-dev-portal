---
date: 2017-01-27
category: 2017
labels:
    - Release Notes
theme:
    markdown:
        editPage:
            hide: true
---
# rippled version 0.50.0

Ripple has released `rippled` version 0.50.0, which introduces several enhancements that improve the reliability and scalability of the Ripple Consensus Ledger (RCL). Ripple recommends that all server operators upgrade to version 0.50.0 by Tuesday, 2017-02-21, for service continuity.

Highlights of this release include:

* **TickSize**, which allows gateways to set a "tick size" for assets they issue to help promote faster price discovery and deeper liquidity, as well as reduce transaction spam and ledger churn on RCL. Ripple expects **TickSize** to be enabled via an [Amendment named “TickSize”](https://ripple.com/build/amendments/#ticksize) on Tuesday, 2017-02-21. See below for details.

## Action Required

**1. If you operate a `rippled` server, then you should upgrade to version 0.50.0 by Tuesday, 2017-02-21, for service continuity.**

**2. If you are a gateway issuer, then please review forthcoming documentation for the TickSize amendment to determine what tick size is appropriate for your issuing asset.**

**3. If you are a market maker and have algorithmic trading bots, then please review forthcoming documentation for the TickSize amendment to update your trading system to check the tick size for a given issuer.**

**4. If you have backend software which constructs and submits transactions related to the issuing of assets on the Ripple network, then please review forthcoming documentation for the TickSize amendment to adapt it for correct usage.**

## Impact of Not Upgrading

If you operate a `rippled` server but don’t upgrade to version 0.50.0 by Tuesday, 2017-02-21, when **TickSize** is expected to be activated via Amendment, then your server will become amendment blocked, meaning that your server:

* Cannot determine the validity of a ledger
* Cannot submit or process transactions
* Does not participate in the consensus process
* Does not vote on future amendments
* Could rely on potentially invalid data

If the **TickSize** amendment is vetoed or does not pass, then your server will not become amendment blocked and should continue to operate.

For instructions on updating `rippled` on supported platforms, see [Updating `rippled` on supported platforms](https://ripple.com/build/rippled-setup/#updating-rippled).

The md5sum for the rpm is: 82eb29f7e464e44eb24e3c891a021041

The md5sum for the source rpm is: 7bf25c86f018daf82c5d5f8ab621153a

For other platforms, please [compile version 0.50.0 from source](https://github.com/ripple/rippled/tree/master/Builds).

The first log entry should be the change setting the version:

      commit 77999579b535373872d8cce7ddc8b12cdcc39d84
      Author: Nik Bougalis <nikb@bougalis.net>
      Date:   Thu Jan 26 13:26:03 2017 -0800

          Set version to 0.50.0

## Network Update
The Ripple operations team plans to deploy version 0.50.0 to all `rippled` servers under its operational control, including private clusters, starting at 11:00 AM PDT on Friday, 2017-01-27. The deployment is expected to complete within 4 hours. The network should continue to operate during deployment and no outage is expected.

## Learn, ask questions, and discuss
Related documentation is available in the [Ripple Developer Portal](https://ripple.com/build/), including detailed example API calls and web tools for API testing.

Other resources:

* The Ripple Forum (_Disabled._ Formerly `forum.ripple.com`)
* [The Ripple Dev Blog](https://developers.ripple.com/blog/)
* Ripple Technical Services: support@ripple.com
* [XRP Chat](http://www.xrpchat.com/)

## Full Release Notes

The `rippled` 0.50.0 release includes **TickSize**, which allows gateways to set a "tick size" for assets they issue to to help promote faster price discovery and deeper liquidity, as well as reduce transaction spam and ledger churn on RCL. Ripple expects TickSize to be enabled via an Amendment called **TickSize** on Tuesday, 2017-02-21. This feature underlines Ripple’s continued support to improving RCL and making it even better suited for settlement of global payments.

You can [update to the new version](https://ripple.com/build/rippled-setup/#updating-rippled) on Red Hat Enterprise Linux 7 or CentOS 7 using yum. For other platforms, please [compile the new version from source](https://github.com/ripple/rippled/tree/master/Builds).

**New and Updated Features**

**Problem & Solution**

Currently, offers on RCL can differ by as little as one part in a quadrillion. This means that there is essentially no value to placing an offer early, as an offer placed later at a microscopically better price gets priority over it. The **TickSize** Amendment solves this problem by introducing a minimum tick size that a price must move for an offer to be considered to be at a better price. The tick size is controlled by the issuers of the assets involved.

When you place a buy offer, the amount of currency you will buy is respected. When you place a sell offer, the amount of currency you will sell is respected. If a tick size is in force, the other side of the offer will be rounded (in your favor) such that the ratio is rounded to the tick size before the offer is placed on the books.

**TickSize** does not affect the size of an offer. A trader can still trade microscopic amounts of an asset. It just affects the prices (ratio of in to out) at which offers can be placed on the books. For asset pairs with XRP, the tick size imposed, if any, is the tick size of the issuer of the non-XRP asset. For asset pairs without XRP, the tick size imposed, if any, is the smaller of the two issuer's configured tick sizes.

The tick size is imposed by rounding the offer quality down to the nearest tick and recomputing the non-critical side of the offer. For a buy, the amount offered is rounded down. For a sell, the amount charged is rounded up.

**Effects of TickSize Change**

This change lets issuers quantize the exchange rates of offers to use a specified number of significant digits. Gateways must enable a TickSize on their account for this feature to benefit them. A single AccountSet transaction may set a "TickSize" parameter. Legal values are 0 and 3-15 inclusive. Zero removes the setting. 3-15 allow that many decimal digits of precision in the pricing of offers for assets issued by this account. It will still be possible to place an offer to buy or sell any amount of an asset and the offer will still keep that amount as exactly as it does now. If an offer involves two assets that each have a tick size, the smaller number of significant figures (larger ticks) controls.

**Benefits of TickSize Change**

The primary expected benefits of the TickSize amendment is the reduction of bots fighting over the tip of the order book, which means:

* Quicker price discovery
* Traders can't be outbid by a microscopic amount
* More offers left on the books
* A reduction in offer creation and cancellation spam

We also expect larger tick sizes to benefit market makers in the following ways:

* They increase the delta between the fair market value and the trade price, ultimately reducing spreads
* They prevent market makers from consuming each other's offers due to slight changes in perceived fair market value, which promotes liquidity
* They promote faster price discovery since traders have to adjust their prices in financially distinct increments
* They reduce transaction spam by reducing fighting over the tip of the order book and reducing the need to change offers due to slight price changes
* They reduce ledger churn and metadata sizes by reducing the number of indexes each order book must have
* They allow the order book as presented to traders to better reflect the actual book since these presentations are inevitably aggregated into ticks

**Hardened TLS configuration**

This release updates the default TLS configuration for `rippled`. The new release supports only 2048-bit DH parameters and defines a new default set of modern ciphers to use, removing support for ciphers and hash functions that are no longer considered secure.

Server administrators who wish to have different settings can configure custom global and per-port cipher suites in the configuration file using the ssl_ciphers directive.

## 0.50.0 Change Log

* Remove websocketpp support [(#1910)](https://github.com/ripple/rippled/pull/1910)
* Increase OpenSSL requirements & harden default TLS cipher suites [(#1913)](https://github.com/ripple/rippled/pull/1913)
* Move test support sources out of ripple directory [(#1916)](https://github.com/ripple/rippled/pull/1916)
* Enhance ledger header RPC commands [(#1918)](https://github.com/ripple/rippled/pull/1918)
* Add support for tick sizes [(#1922)](https://github.com/ripple/rippled/pull/1922)
* Port discrepancy-test.coffee to c++ [(#1930)](https://github.com/ripple/rippled/pull/1930)
* Remove redundant call to clearNeedNetworkLedger [(#1931)](https://github.com/ripple/rippled/pull/1931)
* Port freeze-test.coffee to C++ unit test. [(#1934)](https://github.com/ripple/rippled/pull/1934)
* Fix CMake docs target to work if BOOST_ROOT is not set [(#1937)](https://github.com/ripple/rippled/pull/1937)
* Improve setup for account_tx paging test [(#1942)](https://github.com/ripple/rippled/pull/1942)
* Eliminate npm tests [(#1943)](https://github.com/ripple/rippled/pull/1943)
* Port uniport js test to cpp [(#1944)](https://github.com/ripple/rippled/pull/1944)
* Enable amendments in genesis ledger [(#1944)](https://github.com/ripple/rippled/pull/1944)
* Trim ledger data in Discrepancy_test [(#1948)](https://github.com/ripple/rippled/pull/1948)
* Add "current_ledger" field to "fee" result [(#1949)](https://github.com/ripple/rippled/pull/1949)
* Cleanup unit test support code [(#1953)](https://github.com/ripple/rippled/pull/1953)
* Add ledger save / load tests [(#1955)](https://github.com/ripple/rippled/pull/1955)
* Remove unused websocket files [(#1957)](https://github.com/ripple/rippled/pull/1957)
* Update RPC handler role/usage [(#1966)](https://github.com/ripple/rippled/pull/1966)

**Bug Fixes**

* Validator's manifest not forwarded beyond directly connected peers [(#1919)](https://github.com/ripple/rippled/pull/1919)

## Upcoming Features

We expect the [previously](https://developers.ripple.com/blog/2016/rippled-0.40.0.html) announced Suspended Payments feature, which introduces new transaction types to the Ripple protocol that will permit users to cryptographically escrow XRP on RCL, to be enabled via the [“SusPay”](https://ripple.com/build/amendments/#suspay) Amendment on Tuesday, 2017-02-21.

Also, we expect support for [crypto-conditions](https://tools.ietf.org/html/draft-thomas-crypto-conditions-02), which are signature-like structures that can be used with suspended payments to support ILP integration, to be included in the next `rippled` release scheduled for March.

Lastly, we do not have an update on the [previously announced](https://developers.ripple.com/blog/2016/rippled-0.33.0.html) changes to the hash tree structure that `rippled` uses to represent a ledger, called [SHAMapV2](https://ripple.com/build/amendments/#shamapv2). At the time of activation, this amendment will require brief scheduled allowable unavailability while the changes to the hash tree structure are computed by the network. We will keep the community updated as we progress towards this date (TBA).
