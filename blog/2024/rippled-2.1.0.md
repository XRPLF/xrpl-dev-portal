---
category: 2024
date: 2024-02-20
labels:
    - rippled Release Notes
theme:
    markdown:
        editPage:
            hide: true
---
# Introducing XRP Ledger version 2.1.0

Version 2.1.0 of `rippled`, the reference server implementation of the XRP Ledger protocol, is now available. This release adds a bug fix, build improvements, and introduces the `fixNFTokenReserve` and `fixInnerObjTemplate` amendments.

[Sign Up for Future Release Announcements](https://groups.google.com/g/ripple-server)

<!-- BREAK -->


## Action Required

Two new amendments are now open for voting according to the XRP Ledger's [amendment process](https://xrpl.org/amendments.html), which enables protocol changes following two weeks of >80% support from trusted validators.

If you operate an XRP Ledger server, upgrade to version 2.1.0 by March 5, 2024 to ensure service continuity. The exact time that protocol changes take effect depends on the voting decisions of the decentralized network.


## Install / Upgrade

On supported platforms, see the [instructions on installing or updating `rippled`](https://xrpl.org/install-rippled.html).

| Package | SHA-256 |
|:--------|:--------|
| [RPM for Red Hat / CentOS (x86-64)](https://repos.ripple.com/repos/rippled-rpm/stable/rippled-2.1.0-1.el7.x86_64.rpm) | `d5af80c0301950fee1d2af311258dfa41f08d96916a273d314eef62d44147208` |
| [DEB for Ubuntu / Debian (x86-64)](https://repos.ripple.com/repos/rippled-deb/pool/stable/rippled_2.1.0-1_amd64.deb) | `42ff780d692b82744c37320a138750a108f1915aad7d7e4c23f64fa4e5059889` |
| [Portable Builds (Linux x86-64)](https://github.com/XRPLF/rippled-portable-builds) | (Use signature verification) |

For other platforms, please [build from source](https://github.com/XRPLF/rippled/blob/master/BUILD.md). The most recent commit in the git log should be the change setting the version:

```text
commit d7d15a922a93593eecdaa77dbac177293344aebf
Author: seelabs <scott.determan@yahoo.com>
Date:   Fri Feb 16 16:42:08 2024 -0500

    Set version to 2.1.0
```


## Changelog

### Amendments
(These are changes which may impact or be useful to end users. For example, you may be able to update your code/workflow to take advantage of these changes.)

- **fixNFTokenReserve**: Adds a check to the `NFTokenAcceptOffer` transactor to see if the `OwnerCount` changed. If it did, it checks that the reserve requirement is met. [#4767](https://github.com/XRPLF/rippled/pull/4767)

- **fixInnerObjTemplate**: Adds an `STObject` constructor overload that includes an additional boolean argument to set the inner object template; currently, the inner object template isn't set upon object creation. In some circumstances, this causes a `tefEXCEPTION` error when trying to access the AMM `sfTradingFee` and `sfDiscountedFee` fields in the inner objects of `sfVoteEntry` and `sfAuctionSlot`. [#4906](https://github.com/XRPLF/rippled/pull/4906)


### Bug Fixes and Performance Improvements
(These are behind-the-scenes improvements, such as internal changes to the code, which are not expected to impact end users.)

- Fixed a bug that prevented the gRPC port info from being specified in the `rippled` config file. [#4728](https://github.com/XRPLF/rippled/pull/4728)


### Docs and Build System

- Added unit tests to check that payees and payers aren't the same account. [#4860](https://github.com/XRPLF/rippled/pull/4860)

- Removed a workaround that bypassed Windows CI unit test failures. [#4871](https://github.com/XRPLF/rippled/pull/4871)

- Updated library names to be platform-agnostic in Conan recipes. [#4831](https://github.com/XRPLF/rippled/pull/4831)

- Added headers required in the Conan package to build xbridge witness servers. [#4885](https://github.com/XRPLF/rippled/pull/4885)

- Improved object lifetime management when creating a temporary `Rules` object, fixing a crash in Windows unit tests. [#4917](https://github.com/XRPLF/rippled/pull/4917)


[Full Commit Log](https://github.com/XRPLF/rippled/compare/2.0.1...2.1.0)


### GitHub

The public source code repository for `rippled` is hosted on GitHub at <https://github.com/XRPLF/rippled>.

We welcome all contributions and invite everyone to join the community of XRP Ledger developers to help build the Internet of Value.


## Credits

The following people contributed directly to this release:

- Bronek Kozicki <brok@incorrekt.com>
- CJ Cobb <cj@axelar.network>
- Chenna Keshava B S <21219765+ckeshava@users.noreply.github.com>
- Ed Hennis <ed@ripple.com>
- Elliot Lee <github.public@intelliot.com>
- Gregory Tsipenyuk <gregtatcam@users.noreply.github.com>
- John Freeman <jfreeman08@gmail.com>
- Michael Legleux <legleux@users.noreply.github.com>
- Ryan Molley
- Shawn Xie <35279399+shawnxie999@users.noreply.github.com>


Bug Bounties and Responsible Disclosures:

We welcome reviews of the `rippled` code and urge researchers to responsibly disclose any issues they may find.

To report a bug, please send a detailed report to: <bugs@xrpl.org>
