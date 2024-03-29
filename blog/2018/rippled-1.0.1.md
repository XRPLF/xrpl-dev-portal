---
date: 2018-06-14
category: 2018
labels:
    - Release Notes
theme:
    markdown:
        editPage:
            hide: true
---
# rippled Version 1.0.1

Ripple has released `rippled` version 1.0.1, which includes fixes for issues identified by Ripple engineers and reported by external security researchers. These issues, when exploited, could cause a `rippled` instance to restart or, in some circumstances, stop executing.

While these issues can result in a denial of service attack, none affect the integrity of the XRP Ledger and no user funds, including XRP, are at risk.

## Action Required

**If you operate a `rippled` server**, then you should upgrade to `rippled` version 1.0.1 as soon as possible.

## Impact of Not Upgrading

* **If you operate a `rippled` server**, but do not upgrade to version 1.0.1 as soon as possible, then your server may experience restarts or outages.

## Upgrading

For instructions on updating `rippled` on supported platforms, see [Updating `rippled`](https://developers.ripple.com/update-rippled.html).

The SHA-256 for the RPM is: `4bfa27b0e1e1979f2bc042edb9dd11ae4119dac6be087813dadcc67572877189`

The SHA-256 for the source RPM is: `60279abc65476b0a96ddedcd23338ce1c6fb5481ab94fe8b8c856448044e3ebe`

For other platforms, please compile v1.0.1 from source. See the [`rippled` source tree](https://github.com/ripple/rippled/tree/develop/Builds) for instructions by platform. For instructions building `rippled` from source on Ubuntu Linux, see [Install `rippled` on Ubuntu](https://developers.ripple.com/install-rippled.html#installation-on-ubuntu-with-alien).

The first log entry should be the change setting the version:

    commit 8429dd67e60ba360da591bfa905b58a35638fda1
    Author: Nik Bougalis <nikb@bougalis.net>
    Date:   Mon Jun 4 16:36:22 2018 -0700

          Set version to 1.0.1

## Network Update

The Ripple operations team plans to deploy version 1.0.1 to all `rippled` servers under its operational control, including private clusters, starting at 3:00 PM PST on Thursday, 2018-06-14. The deployment is expected to complete within 5 hours. The network should continue to operate during deployment and no outage is expected.

## Other Information

**Acknowledgements**

Ripple thanks Guido Vranken for discovering and responsibly disclosing an off-by-one error in the base64 decoder logic when handling malformed input.

**Bug Bounties and Responsible Disclosures**

Ripple welcomes reviews of the `rippled` codebase and urges reviewers to responsibly disclose any issues that they may find. For more on Ripple's Bug Bounty program, please visit <https://ripple.com/bug-bounty/>.

**Boost Compatibility**

When compiling `rippled` from source, you must use a compatible version of the Boost library. Ripple recommends Boost 1.64.0 for all platforms.

Other compatible versions differ by platform. Boost 1.58.0 is compatible on Linux but not on Windows. On macOS, Boost 1.58.0 is not compatible with the Clang compiler version 4.0+.

## Learn, ask questions, and discuss

Related documentation is available in the [XRP Ledger Developer Portal](https://developers.ripple.com/index.html), including detailed reference information, tutorials, and web tools.

Other resources:

* The Ripple Forum (_Disabled._ Formerly `forum.ripple.com`)
* [The Ripple Dev Blog](https://developers.ripple.com/blog/)
* Ripple Technical Services: <support@ripple.com>
* [XRP Chat](http://www.xrpchat.com/)


## Upcoming Features

The previously [introduced](https://developers.ripple.com/blog/2018/rippled-1.0.0.html) [fix1543](https://developers.ripple.com/known-amendments.html#fix1543), [fix1571](https://developers.ripple.com/known-amendments.html#fix1571) and [fix1623](https://developers.ripple.com/known-amendments.html#fix1623) Amendments in XRP Ledger version 1.0.0 are now open for voting. Ripple expects these amendments to become enabled on Tuesday, 2018-06-19.

An upcoming version of `rippled` will switch to using the **Boost.Beast** library instead of the **Beast** library from the `rippled` source code. As part of this change, the minimum supported version of Boost will change to be a version incorporating Boost.Beast.

Ripple does not expect to enable the **SHAMapV2**, **Tickets**, or **OwnerPaysFee** Amendments before the next release of `rippled`. These Amendments have been disabled in the source code so `rippled` version 1.0.1 will not show them as available. Ripple plans to re-introduce some or all of these amendments in a future version of `rippled`.


## 1.0.1 Change Log

### Bug Fixes

* Improve JSON exception handling

* Fix a corner case when decoding base64: Under some corner cases, the base64 decoder would not allocate enough memory, which could result in spurious errors.
