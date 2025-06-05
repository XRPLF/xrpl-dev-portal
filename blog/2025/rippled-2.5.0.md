---
category: 2025
date: "2025-06-04"
template: '../../@theme/templates/blogpost'
seo:
    title: Introducing XRP Ledger version 2.5.0
    description: rippled version 2.5.0 is now available. This version introduces new amendments, including Token Escrow, Batch transactions, Single Asset Vaults, and Permissioned DEX functionality.
labels:
    - rippled Release Notes
markdown:
    editPage:
        hide: true
---
# Introducing XRP Ledger version 2.5.0

Version 2.5.0 of `rippled`, the reference server implementation of the XRP Ledger protocol, is now available. This release adds major new features and bug fixes, and introduces these amendments:

- `TokenEscrow`
- `Batch`
- `SingleAssetVault`
- `PermissionedDEX`
- `PermissionDelegation`
- `AMMv1_3`
- `fixNFTTrustlineInteraction`


## Notable Updates: Enhanced DeFi and Compliance Features

This release introduces several groundbreaking features that significantly expand the XRP Ledger's capabilities:

**Token Escrow (XLS-85)**: Enables secure escrow functionality for tokens, allowing parties to conditionally hold and release assets based on predetermined conditions.

**Batch Transactions (XLS-56)**: Allows multiple transactions to be grouped and executed atomically, improving efficiency and enabling complex multi-step operations.

**Single Asset Vaults (XLS-65d)**: Introduces vault functionality for secure asset custody and management, providing enhanced security features for institutional use cases.

**Permissioned DEX (XLS-81)**: Adds compliance-friendly decentralized exchange capabilities with permission controls, enabling regulated trading environments.

**Permission Delegation**: Enables account holders to delegate specific permissions to other accounts, facilitating more flexible account management and automation.

These features position the XRP Ledger as a more comprehensive platform for both DeFi applications and enterprise use cases requiring compliance and advanced asset management.


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
Date:   Wed Jun 4 11:48:16 2025 -0800

    Set version to 2.5.0-rc1 (#5472)
```


## Full Changelog

### Amendments

The following amendments are open for voting with this release:

- **TokenEscrow (XLS-85)** - Introduces token escrow functionality, enabling secure conditional holding and release of assets based on predetermined conditions. ([#5185](https://github.com/XRPLF/rippled/pull/5185))
- **Batch (XLS-56)** - Adds the ability to group multiple transactions and execute them atomically, improving efficiency and enabling complex multi-step operations. ([#5060](https://github.com/XRPLF/rippled/pull/5060))
- **SingleAssetVault (XLS-65d)** - Introduces vault functionality for secure asset custody and management with enhanced security features. ([#5224](https://github.com/XRPLF/rippled/pull/5224))
- **PermissionedDEX (XLS-81)** - Adds compliance-friendly decentralized exchange capabilities with permission controls for regulated trading environments. ([#5404](https://github.com/XRPLF/rippled/pull/5404))
- **PermissionDelegation** - Enables account holders to delegate specific permissions to other accounts for flexible account management and automation. ([#5354](https://github.com/XRPLF/rippled/pull/5354))
- **AMMv1_3** - Updates to the Automated Market Maker functionality with bug fixes and performance improvements. ([#5203](https://github.com/XRPLF/rippled/pull/5203))
- **fixNFTTrustlineInteraction** - Fixes issues with NFT interactions with trustlines to ensure proper behavior. ([#5297](https://github.com/XRPLF/rippled/pull/5297))


### New Features

- Improved squelching configuration to better manage network message propagation and reduce redundant traffic. ([#5438](https://github.com/XRPLF/rippled/pull/5438))
- Increased network I/O capacity to handle higher transaction loads and improve overall network performance. ([#5464](https://github.com/XRPLF/rippled/pull/5464))
- Enhanced transaction relay logic for more efficient propagation of transactions across the network. ([#4985](https://github.com/XRPLF/rippled/pull/4985))
- Enabled passive squelching to optimize validation and proposal message handling. ([#5358](https://github.com/XRPLF/rippled/pull/5358))
- Improved handling of expired credentials in `VaultDeposit` operations. ([#5452](https://github.com/XRPLF/rippled/pull/5452))
- Added `tecNO_DELEGATE_PERMISSION` error code and fixed transaction flags validation. ([#5465](https://github.com/XRPLF/rippled/pull/5465))
- Updated validators-example.txt to fix XRPLF example URL configuration. ([#5384](https://github.com/XRPLF/rippled/pull/5384))


### API Changes

- **Breaking Change**: `channel_authorize` RPC method is now disabled if `signing_support` is not enabled in the server configuration.
- Improved error handling and validation across various RPC methods.
- Enhanced metadata handling in test environments. ([#5457](https://github.com/XRPLF/rippled/pull/5457))


### Bug Fixes

- Fixed pseudo-account ID calculation to ensure correct account address generation. ([#5447](https://github.com/XRPLF/rippled/pull/5447))
- Fixed unit build errors that prevented compilation in certain environments. ([#5459](https://github.com/XRPLF/rippled/pull/5459))
- Fixed initializer list initialization issues for GCC-15 compatibility. ([#5443](https://github.com/XRPLF/rippled/pull/5443))
- Resolved slow test performance issues on macOS pipeline. ([#5392](https://github.com/XRPLF/rippled/pull/5392))
- Fixed endpoint resolution to use sequential rather than random selection for better reliability. ([#5365](https://github.com/XRPLF/rippled/pull/5365))
- Enabled LedgerStateFix for delegation functionality. ([#5427](https://github.com/XRPLF/rippled/pull/5427))
- Fixed coverage file generation to ensure atomic operations. ([#5426](https://github.com/XRPLF/rippled/pull/5426))


### Other Improvements

- Updated CPP reference source for improved code documentation. ([#5453](https://github.com/XRPLF/rippled/pull/5453))
- Added codecov badge and raised coverage thresholds for better test coverage monitoring. ([#5428](https://github.com/XRPLF/rippled/pull/5428))
- Refactored codebase to use east const convention for improved code consistency. ([#5409](https://github.com/XRPLF/rippled/pull/5409))
- Updated build instructions for Ubuntu 22.04+ with improved documentation. ([#5292](https://github.com/XRPLF/rippled/pull/5292))
- Added parallel build instructions to BUILD.md for faster compilation. ([#5288](https://github.com/XRPLF/rippled/pull/5288))
- Updated security documentation with corrected keyserver host information. ([#5460](https://github.com/XRPLF/rippled/pull/5460))
- Fixed transitive_headers specification when building with Conan 2. ([#5462](https://github.com/XRPLF/rippled/pull/5462))
- Configured CODEOWNERS for better code review management of RPC changes. ([#5266](https://github.com/XRPLF/rippled/pull/5266))
- Updated CODEOWNERS path configuration. ([#5440](https://github.com/XRPLF/rippled/pull/5440))
- Renamed documentation CI job for clarity. ([#5398](https://github.com/XRPLF/rippled/pull/5398))
- Small clarification to lsfDefaultRipple comment for better code documentation. ([#5410](https://github.com/XRPLF/rippled/pull/5410))


## Credits

The following people contributed directly to this release:

- Bronek Kozicki <brok@incorrekt.com>
- dangell7 <dangell7@users.noreply.github.com>
- David Fuelling <fuelling@ripple.com>
- Ed Hennis <ed@ripple.com>
- Greg Tatcam <gregtatcam@users.noreply.github.com>
- Mark Travis <7728157+mtrippled@users.noreply.github.com>
- Mayukha Vadari <mvadari@gmail.com>
- Michael Legleux <mlegleux@ripple.com>
- Oleksandr <115580134+oleks-rip@users.noreply.github.com>
- Shawn Xie <shawnxie920@gmail.com>
- Tapanito <Tapanito@users.noreply.github.com>
- The John Freeman <thejohnfreeman@users.noreply.github.com>
- Vladislav Vysokikh <vvysokikh@gmail.com>
- Xun Zhao <xzhao@ripple.com>
- yinyiqian1 <yinyiqian1@users.noreply.github.com>
- Bart Thomee <11445373+bthomee@users.noreply.github.com>
- brettmollin <brettmollin@users.noreply.github.com>
- Elliot Lee <github.public@intelliot.com>
- mankins <mankins@users.noreply.github.com>
- mathbunnyru <mathbunnyru@users.noreply.github.com>
- vlntb <vlntb@users.noreply.github.com>
- ximinez <ximinez@users.noreply.github.com>
- a1q123456 <a1q123456@users.noreply.github.com>


## Bug Bounties and Responsible Disclosures

We welcome reviews of the `rippled` code and urge researchers to responsibly disclose any issues they may find.

To report a bug, please send a detailed report to: <bugs@xrpl.org>
