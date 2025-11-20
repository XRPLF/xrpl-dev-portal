---
category: 2025
date: "2025-11-19"
template: '../../@theme/templates/blogpost'
seo:
    title: Introducing XRP Ledger version 2.6.2
    description: rippled version 2.6.2 is now available. This version contains a new amendment and critical bug fix.
labels:
    - rippled Release Notes
markdown:
    editPage:
        hide: true
---
# Introducing XRP Ledger version 2.6.2

Version 2.6.2 of `rippled`, the reference server implementation of the XRP Ledger protocol, is now available. This release adds a new `fixDirectoryLimit` amendment and a critical bug fix.


## Action Required

If you run an XRP Ledger server, upgrade to version 2.6.2 as soon as possible to ensure service continuity.


## Install / Upgrade

On supported platforms, see the [instructions on installing or updating `rippled`](../../docs/infrastructure/installation/index.md).

| Package | SHA-256 |
|:--------|:--------|
| [RPM for Red Hat / CentOS (x86-64)](https://repos.ripple.com/repos/rippled-rpm/stable/rippled-2.6.2-1.el9.x86_64.rpm) | `e3b041906a75c3c52cc6423219d7ba9c199a5d736d2e3978a5ce0ac5ef693fdf` |
| [DEB for Ubuntu / Debian (x86-64)](https://repos.ripple.com/repos/rippled-deb/pool/stable/rippled_2.6.2-1_amd64.deb) | `0887b5a77c43c362ea7680b83df40b955a5748b712924acf2212b2de29e3373b` |

For other platforms, please [build from source](https://github.com/XRPLF/rippled/blob/master/BUILD.md). The most recent commit in the git log should be the change setting the version:

```text
commit df24ee077438e03673a9c6661c41e8f070b90cd9
Author: Vladislav Vysokikh <vvysokikh@gmail.com>
Date:   Tue Nov 18 09:28:59 2025 +0000

    Version 2.6.2
```


## Full Changelog

### Amendments

The following amendment is open for voting with this release:

- **fixDirectoryLimit** - Removes directory page limits. Object reserve requirements provide enough incentive to avoid creating unnecessary objects on the XRP Ledger. ([#5935](https://github.com/XRPLF/rippled/pull/5935))

### Bug Fixes

- Fixed an assertion failure when all the inner transactions of a `Batch` transaction were invalid. ([#5670](https://github.com/XRPLF/rippled/pull/5670))


## Credits

The following GitHub users contributed to this release:

- RippleX Engineering
- RippleX Docs
- RippleX Product


## Bug Bounties and Responsible Disclosures

We welcome reviews of the `rippled` code and urge researchers to responsibly disclose any issues they may find.

To report a bug, please send a detailed report to: <bugs@xrpl.org>