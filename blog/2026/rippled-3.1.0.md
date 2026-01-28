---
category: 2026
date: "2026-01-28"
template: '../../@theme/templates/blogpost'
seo:
    title: Introducing XRP Ledger version 3.1.0
    description: rippled version 3.1.0 is now available. This version introduces new amendments and bug fixes.
labels:
    - rippled Release Notes
markdown:
    editPage:
        hide: true
---
# Introducing XRP Ledger version 3.1.0

Version 3.1.0 of `rippled`, the reference server implementation of the XRP Ledger protocol, is now available. This release introduces Single Asset Vaults, the Lending Protocol, and bug fixes.


## Action Required

If you run an XRP Ledger server, upgrade to version 3.1.0 as soon as possible to ensure service continuity.


## Install / Upgrade

On supported platforms, see the [instructions on installing or updating `rippled`](../../docs/infrastructure/installation/index.md).

| Package | SHA-256 |
|:--------|:--------|
| [RPM for Red Hat / CentOS (x86-64)](https://repos.ripple.com/repos/rippled-rpm/stable/rippled-3.1.0-1.el9.x86_64.rpm) | `8ac8c529718566e6ebef3cb177d170fda1efc81ee08c4ea99d7e8fa3db0a2c70` |
| [DEB for Ubuntu / Debian (x86-64)](https://repos.ripple.com/repos/rippled-deb/pool/stable/rippled_3.1.0-1_amd64.deb) | `58574a2299db2edf567e09efa25504677cdc66e4fa26f8a84322ab05f3a02996` |

For other platforms, please [build from source](https://github.com/XRPLF/rippled/blob/master/BUILD.md). The most recent commit in the git log should be the change setting the version:

```text
commit d325f20c76fa798d0286d25e80b126ec0a2ee679
Author: Ed Hennis <ed@ripple.com>
Date:   Tue Jan 27 21:13:06 2026 -0400

    Set version to 3.1.0 (#6284)
```


## Full Changelog


### Amendments

- **SingleAssetVault**: Adds vaults, which pool a single asset for use with the Lending Protocol. ([#5632](https://github.com/XRPLF/rippled/pull/5632))
- **LendingProtocol**: Adds the ability to create loans on the XRP Ledger. Loan brokers can create fixed-term, uncollateralized loans using the pooled funds from a Single Asset Vault. The protocol is highly configurable, enabling loan brokers to tune risk appetite, depostitor protections, and economic incentives. ([#5632](https://github.com/XRPLF/rippled/pull/5632))
- **fixBatchInnerSigs**: Fixes an issue where inner transactions of a `Batch` transaction would be flagged as having valid signatures. Inner transactions never have valid signatures. ([#6069](https://github.com/XRPLF/rippled/pull/6069))


### Bug Fixes

- Expand `Number` to support full integer range. ([#6192](https://github.com/XRPLF/rippled/pull/6192))
- fix: Reorder Batch Preflight Errors. ([#6176](https://github.com/XRPLF/rippled/pull/6176))
- Fix dependencies so clio can use libxrpl. ([#6251](https://github.com/XRPLF/rippled/pull/6251))
- fix: Remove DEFAULT fields that change to the default in associateAsset (was Add Vault creation tests for showing valid range for AssetsMaximum). ([#6259](https://github.com/XRPLF/rippled/pull/6259))


## Credits

The following RippleX teams and GitHub users contributed to this release:

- RippleX Engineering
- RippleX Docs
- RippleX Product
- @dangell7


## Bug Bounties and Responsible Disclosures

We welcome reviews of the `rippled` code and urge researchers to responsibly disclose any issues they may find.

To report a bug, please send a detailed report to: <bugs@xrpl.org>