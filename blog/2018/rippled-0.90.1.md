---
date: 2018-03-22
category: 2018
labels:
    - Release Notes
theme:
    markdown:
        editPage:
            hide: true
---
# rippled version 0.90.1

Ripple has released `rippled` version 0.90.1, which includes fixes for issues reported by external security researchers. These issues, when exploited, could cause a `rippled` instance to restart or, in some circumstances, stop executing.

While these issues can result in a denial of service attack, none affect the integrity of the XRP Ledger and no user funds, including XRP, are at risk.

## Action Required

**If you operate a `rippled` server, then you should upgrade to `rippled` version 0.90.1 as soon as possible.**

### Impact of Not Upgrading

If you operate a `rippled` server but do not upgrade to version 0.90.1, your server may experience restarts or outages.

### Upgrading

For instructions on updating `rippled` on supported platforms, see here: [Updating rippled](https://ripple.com/build/rippled-setup/#updating-rippled)

The SHA-256 for the rpm is: a22aff93d3de98ac3e1d775612e75e0e81aa7e6c18187db01efed485f854bab0

The SHA-256 for the source rpm is: abaaaba2039c8cd93218fd6a23c79b32bfb6eba92a465b7f9c0716b37fb45795

For other platforms, please compile version 0.90.1 from source. See [rippled Builds](https://github.com/ripple/rippled/tree/master/Builds) for instructions by platform. For instructions building `rippled` from source on Ubuntu Linux, see [Build and Run `rippled` on Ubuntu](https://ripple.com/build/build-run-rippled-ubuntu/).

The first log entry should be the change setting the version:

    commit 067dbf299c297a8361e83e2ceaf7b0822ff9a3f5
    Author: Nikolaos D. Bougalis <nikb@bougalis.net>
    Date:   Tue Mar 6 16:38:02 2018 -0800
    	Set version to 0.90.1

## Network Update

The Ripple operations team plans to deploy version 0.90.1 to all `rippled` servers under its operational control, including private clusters, starting at 5:00 PM PST on Thursday, 2018-03-22. The deployment is expected to complete within 4 hours. The network should continue to operate during deployment and no outage is expected.

## Other Information

### Acknowledgements

Ripple thanks Guido Vranken for responsibly disclosing a potential out-of-bounds memory access in the base58 encoder/decoder, a vulnerability in the parsing code handling nested serialized objects and a codepath where untrusted public input involving public keys was used without first being properly validated. These issues could be exploited to mount a denial of service attack.

### Bug Bounties and Responsible Disclosures

We welcome reviews of the `rippled` codebase and urge reviewers to responsibly disclose any issues that they may find. For more on Ripple's Bug Bounty program, please visit <https://ripple.com/bug-bounty/>.

### Boost Compatibility

When compiling `rippled` from source, you must use a compatible version of the Boost library. Ripple recommends Boost 1.64.0 for all platforms.

Other compatible versions differ by platform. Boost 1.58.0 is compatible on Linux but not on Windows. On macOS, Boost 1.58.0 is not compatible with the Clang compiler version 4.0+. On all platforms, Boost 1.66.0 compatibility in `rippled` 0.90.1 is experimental.

## Learn, ask questions, and discuss

Related documentation is available in the [Ripple Developer Portal](https://ripple.com/build/), including detailed example API calls and web tools for API testing.

Other resources:

* The Ripple Forum (_Disabled._ Formerly `forum.ripple.com`)

* The Ripple Dev Blog: <https://developers.ripple.com/blog/>

* Ripple Technical Services: <support@ripple.com>

* XRP Chat: <http://www.xrpchat.com/>

### Upcoming Features

The previously announced DepositAuth, Checks and fix1513 amendments are now open for voting on the XRP Ledger. The DepositAuth Amendment lets an account strictly reject any incoming money from transactions sent by other accounts. The Checks Amendment allows users to create a deferred payment that can be cancelled or cashed by its intended recipient. The fix1513 amendment fixes a minor bug in rounding calculations. Ripple expects the **DepositAuth**, **Checks**, and **fix1513** amendments to be enabled on Thursday, 2018-04-05.

The [previously announced](https://developers.ripple.com/blog/2017/rippled-0.70.0.html) **FlowCross** Amendment will be enabled on a future date (TBA).

Compiling `rippled` with scons is deprecated. Starting in `rippled` version 1.0, the only supported build will be using CMake.

An upcoming version of `rippled` will switch to using the Boost.Beast library instead of the Beast library from the `rippled` source code. As part of this change, the minimum supported version of Boost will change to be a version incorporating Boost.Beast.

Ripple does not expect to enable the **SHAMapV2**, **Tickets**, or **OwnerPaysFee** amendments before the next release of rippled. These amendments have been disabled in the source code so `rippled` 0.90.1 will not show them as available. Ripple plans to re-introduce some or all of these amendments in a future version of rippled.

## 0.90.1 Change Log

### Bug Fixes

* Address issues identified by external review

    * Verify serialized public keys more strictly before using them (RIPD-1617, RIPD-1619, RIPD-1621)

    * Eliminate a potential out-of-bounds memory access in the base58 encoding/decoder logic. (RIPD-1618)

    * Avoid invoking undefined behavior in memcpy (RIPD-1616)

* Limit STVar recursion during deserialization (RIPD-1603)

* Use lock when creating a peer shard rangeset
