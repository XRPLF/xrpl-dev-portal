---
category: 2024
date: 2024-06-04
labels:
    - rippled Release Notes
theme:
    markdown:
        editPage:
            hide: true
---
# Introducing XRP Ledger version 2.2.0

Version 2.2.0 of `rippled`, the reference server implementation of the XRP Ledger protocol, is now available. This release adds performance optimizations, several bug fixes, and introduces the `featurePriceOracle`, `fixEmptyDID`, `fixXChainRewardRounding`, `fixPreviousTxnID`, and `fixAMMv1_1` amendments.

[Sign Up for Future Release Announcements](https://groups.google.com/g/ripple-server)

<!-- BREAK -->

## Action Required

Five new amendments are now open for voting according to the XRP Ledger's [amendment process](https://xrpl.org/amendments.html), which enables protocol changes following two weeks of >80% support from trusted validators.

If you operate an XRP Ledger server, upgrade to version 2.2.0 by June 17, 2024 to ensure service continuity. The exact time that protocol changes take effect depends on the voting decisions of the decentralized network.

If you operate a Clio server, Clio needs to be updated to 2.1.2 before updating to rippled 2.2.0. Clio will be blocked if it is not updated.

## Install / Upgrade

On supported platforms, see the [instructions on installing or updating `rippled`](../../docs/infrastructure/installation/index.md).

| Package | SHA-256 |
|:--------|:--------|
| [RPM for Red Hat / CentOS (x86-64)](https://repos.ripple.com/repos/rippled-rpm/stable/rippled-2.2.0-1.el7.x86_64.rpm) | `aeee54f2cafb651c42d12791ea62ebd20786b94165723ae5f405a089f7eec80a` |
| [DEB for Ubuntu / Debian (x86-64)](https://repos.ripple.com/repos/rippled-deb/pool/stable/rippled_2.2.0-1_amd64.deb) | `1bd26cea8e289e40368542eb370cec95b42905855f9ada8ece361a43134834c9` |
| [Portable Builds (Linux x86-64)](https://github.com/XRPLF/rippled-portable-builds) | (Use signature verification) |

For other platforms, please [build from source](https://github.com/ripple/rippled/tree/master/Builds). The most recent commit in the git log should be the change setting the version:

```text
commit 2df635693d54b8c17c428faf6ef99da2f14a9382
Author: seelabs <scott.determan@yahoo.com>
Date:   Mon Jun 3 21:48:05 2024 -0400

    Set version to 2.2.0
```


## Changelog

### Amendments and New Features
(These are changes which may impact or be useful to end users. For example, you may be able to update your code/workflow to take advantage of these changes.)

- **featurePriceOracle** amendment: Implements a price oracle as defined in the [XLS-47](https://github.com/XRPLF/XRPL-Standards/blob/master/XLS-47d-PriceOracles/README.md) spec. A Price Oracle is used to bring real-world data, such as market prices, onto the blockchain, enabling dApps to access and utilize information that resides outside the blockchain. [#4789](https://github.com/XRPLF/rippled/pull/4789) 

- **fixEmptyDID** amendment: Modifies the behavior of the DID amendment: adds an additional check to ensure that DIDs are non-empty when created, and returns a `tecEMPTY_DID` error if the DID would be empty. [#4950](https://github.com/XRPLF/rippled/pull/4950)

- **fixXChainRewardRounding** amendment: Modifies the behavior of the XChainBridge amendment: fixes rounding so reward shares are always rounded down, even when the `fixUniversalNumber` amendment is active. [#4933](https://github.com/XRPLF/rippled/pull/4933)

- **fixPreviousTxnID** amendment: Adds `PreviousTxnID` and `PreviousTxnLgrSequence` as fields to all ledger entries that did not already have them included (`DirectoryNode`, `Amendments`, `FeeSettings`, `NegativeUNL`, and `AMM`). Existing ledger entries will gain the fields whenever transactions modify those entries. [#4751](https://github.com/XRPLF/rippled/pull/4751). 

- **fixAMMv1_1** amendment: Fixes AMM offer rounding and low quality order book offers from blocking the AMM. [#4983](https://github.com/XRPLF/rippled/pull/4983)

- Add a non-admin version of `feature` API method. [#4781](https://github.com/XRPLF/rippled/pull/4781)

### Bug Fixes and Performance Improvements
(These are behind-the-scenes improvements, such as internal changes to the code, which are not expected to impact end users.)

- Optimize the base58 encoder and decoder. The algorithm is now about 10 times faster for encoding and 15 times faster for decoding. [#4327](https://github.com/XRPLF/rippled/pull/4327)

- Optimize the `account_tx` SQL query. [#4955](https://github.com/XRPLF/rippled/pull/4955)

- Don't reach consensus as quickly if no other proposals are seen. [#4763](https://github.com/XRPLF/rippled/pull/4763)

- Fix a potential deadlock in the database module. [#4989](https://github.com/XRPLF/rippled/pull/4989)

- Enforce no duplicate slots from incoming connections. [#4944](https://github.com/XRPLF/rippled/pull/4944)

- Fix an order book update variable swap. [#4890](https://github.com/XRPLF/rippled/pull/4890)

### Docs and Build System

- Add unit test to raise the test coverage of the AMM. [#4971](https://github.com/XRPLF/rippled/pull/4971)

- Improve test coverage reporting. [#4977](https://github.com/XRPLF/rippled/pull/4977)

### GitHub

The public source code repository for `rippled` is [hosted on GitHub](https://github.com/XRPLF/rippled).

We welcome all contributions and invite everyone to join the community of XRP Ledger developers to help build the Internet of Value.


## Credits

The following people contributed directly to this release:

- Alex Kremer <akremer@ripple.com>
- Alloy Networks <45832257+alloynetworks@users.noreply.github.com>
- Bronek Kozicki <brok@incorrekt.com>
- Chenna Keshava <ckeshavabs@gmail.com>
- Denis Angell <dangell@transia.co>
- Ed Hennis <ed@ripple.com>
- Gregory Tsipenyuk <gtsipenyuk@ripple.com>
- Howard Hinnant <howard.hinnant@gmail.com>
- John Freeman <jfreeman08@gmail.com>
- Mark Travis <mtrippled@users.noreply.github.com>
- Mayukha Vadari <mvadari@gmail.com>
- Michael Legleux <mlegleux@ripple.com>
- Nik Bougalis <nikb@bougalis.net>
- Olek <115580134+oleks-rip@users.noreply.github.com>
- Scott Determan <scott.determan@yahoo.com>
- Snoppy <michaleli@foxmail.com>

### Bug Bounties and Responsible Disclosures:

We welcome reviews of the `rippled` code and urge researchers to responsibly disclose any issues they may find.

To report a bug, please send a detailed report to: <bugs@xrpl.org>.
