---
category: 2025
date: "2025-06-04"
template: '../../@theme/templates/blogpost'
seo:
    title: Introducing XRP Ledger version 2.5.0
    description: rippled version 2.5.0 is now available. This version introduces new features and bug fixes.
labels:
    - rippled Release Notes
markdown:
    editPage:
        hide: true
---
# Introducing XRP Ledger version 2.5.0

Version 2.5.0 of `rippled`, the reference server implementation of the XRP Ledger protocol, is now available. This release adds new features and bug fixes, and introduces these amendments:

- `TokenEscrow`
- `Batch`
- `PermissionedDEX`
- `PermissionDelegation`
- `AMMv1_3`
- `EnforceNFTokenTrustlineV2`


## Action Required

If you run an XRP Ledger server, upgrade to version 2.5.0 as soon as possible to ensure service continuity.

Additionally, new amendments are now open for voting according to the XRP Ledger's [amendment process](../../docs/concepts/networks-and-servers/amendments.md), which enables protocol changes following two weeks of >80% support from trusted validators. The exact time that protocol changes take effect depends on the voting decisions of the decentralized network.


## Install / Upgrade

On supported platforms, see the [instructions on installing or updating `rippled`](../../docs/infrastructure/installation/index.md).

| Package | SHA-256 |
|:--------|:--------|
| [RPM for Red Hat / CentOS (x86-64)](https://repos.ripple.com/repos/rippled-rpm/stable/rippled-2.5.0-1.el7.x86_64.rpm) | `TBD` |
| [DEB for Ubuntu / Debian (x86-64)](https://repos.ripple.com/repos/rippled-deb/pool/stable/rippled_2.5.0-1_amd64.deb) | `TBD` |
| [Portable Builds (Linux x86-64)](https://github.com/XRPLF/rippled-portable-builds) | (Use signature verification) |

For other platforms, please [build from source](https://github.com/XRPLF/rippled/blob/master/BUILD.md). The most recent commit in the git log should be the change setting the version:

```text
commit 11edaa441db07d527fe16c300b822239de7d7012
Author: Michael Legleux <mlegleux@ripple.com>
Date:   Wed Jun 4 10:55:23 2025 -0700

    Set version to 2.5.0-rc1
```

{% admonition type="info" name="Note" %} After this release, we will no longer support GCC versions older than 12, Clang (including Apple Clang) versions older than 16, or Conan 1. {% /admonition %}


## Full Changelog

### Amendments

The following amendments are open for voting with this release:

- **TokenEscrow (XLS-85)** - Enhances escrow functionality by enabling escrows to interact with trustline-based tokens (IOUs) and multi-purpose tokens (MPTs). ([#5185](https://github.com/XRPLF/rippled/pull/5185))
- **Batch (XLS-56)** - Adds the ability to group multiple transactions and execute them atomically, improving efficiency and enabling complex multistep operations. ([#5060](https://github.com/XRPLF/rippled/pull/5060))
- **PermissionedDEX (XLS-81)** - Adds permissioned decentralized exchanges that control who can participate, ensuring compliance with financial regulations. ([#5404](https://github.com/XRPLF/rippled/pull/5404))
- **PermissionDelegation (XLS-75)** - Enables account holders to delegate specific permissions to other accounts for flexible account management and automation. ([#5354](https://github.com/XRPLF/rippled/pull/5354))
- **AMMv1_3** - Adds invariant checking to AMM-related transactions. ([#5203](https://github.com/XRPLF/rippled/pull/5203))
- **EnforceNFTokenTrustlineV2** - Fixes issues with NFT interactions bypassing the trustline authorization requirement. ([#5297](https://github.com/XRPLF/rippled/pull/5297))


### New Features

- Increased network I/O capacity to handle higher transaction loads. ([#5464](https://github.com/XRPLF/rippled/pull/5464))
- Enhanced transaction relay logic. ([#4985](https://github.com/XRPLF/rippled/pull/4985))
- Added XRPL Commons as a new Bootstrap Cluster in the `rippled` configuration. ([#5263](https://github.com/XRPLF/rippled/pull/5263))
- Improved how the `simulate` method handles transactions submitted from a multi-signing account. Also fixed an issue that allowed transactions when both single-signed and multi-signed keys were provided. ([#5479](https://github.com/XRPLF/rippled/pull/5479))
- Updated code reviewers for RPC changes. ([#5266](https://github.com/XRPLF/rippled/pull/5266))


### Bug Fixes

- Fixed pseudo-account ID calculation to ensure correct account address generation. ([#5447](https://github.com/XRPLF/rippled/pull/5447))
- Fixed a unity build error. ([#5459](https://github.com/XRPLF/rippled/pull/5459))
- Fixed initializer list initialization issues for GCC-15 compatibility. ([#5443](https://github.com/XRPLF/rippled/pull/5443))
- Resolved slow test performance issues on macOS pipeline. ([#5392](https://github.com/XRPLF/rippled/pull/5392))
- Replaced the custom endpoint selection logic with sequential attempts to connect to available endpoints until one succeeds or all fail. ([#5365](https://github.com/XRPLF/rippled/pull/5365))
- Fixed coverage file generation to ensure atomic generation. ([#5426](https://github.com/XRPLF/rippled/pull/5426))
- Renamed _deadlock_ crash error to _stall_ in the event of severe CPU starvation. ([#5341](https://github.com/XRPLF/rippled/pull/5341))
- Fixed an inaccurate error message in the `ledger_entry` RPC method when the account specified is not a string. ([#5344](https://github.com/XRPLF/rippled/pull/5344))
- Fixed a crash that could occur when handling an invalid marker parameter in a gRPC call. ([#5317](https://github.com/XRPLF/rippled/pull/5317))
- Fixed an issue with trust lines setting behavior around the `lsfDefaultRipple` flag. ([#5345](https://github.com/XRPLF/rippled/pull/5345))
- Removed undefined behavior from `LogicError` to guarantee a stacktrace. ([#5338](https://github.com/XRPLF/rippled/pull/5338))
- Updated links to the ripple binary codec definitions. ([#5355](https://github.com/XRPLF/rippled/pull/5355))
- Fixed the consensus logic to prevent a consensus round taking too long to complete. ([#5277](https://github.com/XRPLF/rippled/pull/5277))
- Fixed `undefined uint128_t` type on non-unity `Windows` builds. ([#5377](https://github.com/XRPLF/rippled/pull/5377))
- Fixed a `uin128` issue that broke MacOS unity builds. ([#5386](https://github.com/XRPLF/rippled/pull/5386))
- Fixed a memory ordering assertion failure. ([#5381](https://github.com/XRPLF/rippled/pull/5381))
- Disabled `channel_authorize` when `signing_support` is disabled. ([#5385](https://github.com/XRPLF/rippled/pull/5385))
- Fixed a webhook issue when using the `subscribe` admin RPC. ([#5163](https://github.com/XRPLF/rippled/pull/5163))
- Fixed issues with CTID. ([#4738](https://github.com/XRPLF/rippled/pull/4738))
- Temporarily disabled unit tests on macOS to investigate delays. ([#5397](https://github.com/XRPLF/rippled/pull/5397))
- Fixed CTID to use the correct `ledger_index`. ([#5408](https://github.com/XRPLF/rippled/pull/5408))
- Updated CODEOWNERS path configuration. ([#5440](https://github.com/XRPLF/rippled/pull/5440))
- Removed unused code. ([#5475](https://github.com/XRPLF/rippled/pull/5475))


### Other Improvements

- Enabled passive squelching for validators to accept squelch messages from untrusted validators, reducing duplicate traffic they generate. ([#5358](https://github.com/XRPLF/rippled/pull/5358))
- Improved squelching configuration. ([#5438](https://github.com/XRPLF/rippled/pull/5438))
- Updated CPP reference source. ([#5453](https://github.com/XRPLF/rippled/pull/5453))
- Added codecov badge and raised coverage thresholds. ([#5428](https://github.com/XRPLF/rippled/pull/5428))
- Refactored codebase to use east const convention for code consistency. ([#5409](https://github.com/XRPLF/rippled/pull/5409))
- Updated build instructions for Ubuntu 22.04+. ([#5292](https://github.com/XRPLF/rippled/pull/5292))
- Updated build instructions to improve build times. ([#5288](https://github.com/XRPLF/rippled/pull/5288))
- Updated example keyserver host in `SECURITY.md`. ([#5460](https://github.com/XRPLF/rippled/pull/5460))
- Implemented `transitive_headers` when building with Conan 2. ([#5462](https://github.com/XRPLF/rippled/pull/5462))
- Renamed documentation CI job for clarity. ([#5398](https://github.com/XRPLF/rippled/pull/5398))
- Clarified the `lsfDefaultRipple` comment for better code documentation. ([#5410](https://github.com/XRPLF/rippled/pull/5410))
- Cleaned up missing and unused headers. ([#5293](https://github.com/XRPLF/rippled/pull/5293))
- Refactored code to update `numFeatures` automatically. ([#5324](https://github.com/XRPLF/rippled/pull/5324))
- Improved ordering of headers with clang format. ([#5343](https://github.com/XRPLF/rippled/pull/5343))
- Updated Conan dependencies. ([#5335](https://github.com/XRPLF/rippled/pull/5335))
- Added PR numbers to the payload of `libXRPL` compatibility check workflows. ([#5310](https://github.com/XRPLF/rippled/pull/5310))
- Updated TxQ unit tests to work with variable reference fees. ([#5118](https://github.com/XRPLF/rippled/pull/5118), [#5145](https://github.com/XRPLF/rippled/pull/5145))
- Optimized SHAMap smart pointers for efficient memory use and lock-free synchronization. ([#5152](https://github.com/XRPLF/rippled/pull/5152))
- Moved integration tests to another folder to make their purpose clear. ([#5367](https://github.com/XRPLF/rippled/pull/5367))
- Enabled compile time parameter to change the reference fee value. ([#5159](https://github.com/XRPLF/rippled/pull/5159))
- Cleaned up test logging messages to make it easier to search. ([#5396](https://github.com/XRPLF/rippled/pull/5396))
- Improved CI jobs to only run on PRs that have a `DraftRunCI` label. ([#5400](https://github.com/XRPLF/rippled/pull/5400))
- Updated `validators-example.txt` to fix XRPLF example URL configuration. ([#5384](https://github.com/XRPLF/rippled/pull/5384))
- Changed ledger close in `env.meta` to be conditionally on, making it easier to debug issues if you closed the ledger outside of the `meta` function. ([#5457](https://github.com/XRPLF/rippled/pull/5457))
- Collapsed log messages for easier readability. ([#5347](https://github.com/XRPLF/rippled/pull/5347))


## Credits

The following people contributed directly to this release:

- Alex Kremer <akremer@ripple.com>
- Ayaz Salikhov <asalikhov@ripple.com>
- Bart Thomee <bthomee@users.noreply.github.com>
- Brett Mollin <brett@ripple.com>
- Bronek Kozicki <brok@incorrekt.com>
- Cindy Yan <120398799+cindyyan317@users.noreply.github.com>
- Darius Tumas <Tokeiito@users.noreply.github.com>
- David Fuelling <fuelling@ripple.com>
- Denis Angell <dangell@transia.co>
- Ed Hennis <ed@ripple.com>
- Elliot Lee <github.public@intelliot.com>
- Gregory Tsipenyuk <gtsipenyuk@ripple.com>
- Jingchen Wu <jingchenw@ripple.com>
- Luc des Trois Maisons <lmaisons@ripple.com>
- Mani Mounika Kunasani <mkunasani@ripple.com>
- Mark Travis <mtrippled@users.noreply.github.com>
- Matt Mankins <mankins@gmail.com>
- Mayukha Vadari <mvadari@gmail.com>
- Michael Legleux <mlegleux@ripple.com>
- Oleksandr Pidskopnyi <opidskopnyi@ripple.com>
- Ramkumar SG <rgunasegharan@ripple.com>
- Scott Determan <scott.determan@yahoo.com>
- Sergey Kuznetsov <skuznetsov@ripple.com>
- Sophia Xie <sxie@ripple.com>
- Shawn Xie <shawnxie@ripple.com>
- Valentin Balaschenko <vbalaschenko@ripple.com>
- Vito Tumas <vtumas@ripple.com>
- Vladislav Vysokikh <vvysokikh@gmail.com>
- Wietse Wind <w.wind@ipublications.net>
- Xun Zhao <xzhao@ripple.com>
- Yinyi Qian <yqian@ripple.com>


## Bug Bounties and Responsible Disclosures

We welcome reviews of the `rippled` code and urge researchers to responsibly disclose any issues they may find.

To report a bug, please send a detailed report to: <bugs@xrpl.org>
