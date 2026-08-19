---
category: 2026
date: "2026-07-31"
template: '../../@theme/templates/blogpost'
seo:
    title: Introducing XRP Ledger version 3.2.1
    description: xrpld version 3.2.1 is now available. This version contains fixes for security issues in validator manifest propagation. There are no new features or amendments.
labels:
    - xrpld Release Notes
markdown:
    editPage:
        hide: true
---
# Introducing XRP Ledger version 3.2.1

Version 3.2.1 of `xrpld`, the reference server implementation of the XRP Ledger protocol, is now available.

This release contains fixes for security issues in validator manifest propagation that, in the worst case, could cause a server to use excessive memory and processing resources. There are no new features or amendments in this release.


## Action Required

If you run an XRP Ledger server, upgrade to version 3.2.1 as soon as possible to ensure service continuity.


## Install / Upgrade

On supported platforms, see the [instructions on installing or updating `xrpld`](../../docs/infrastructure/installation/index.md).

| Package | SHA-256 |
|:--------|:--------|
| [RPM for Red Hat / CentOS (x86-64)](https://repos.ripple.com/repos/rippled-rpm/stable/xrpld-3.2.1-1.el9.x86_64.rpm) | `0349682e4ae99206543dae4861a4af534d12607ece24ffdf9e5c96ba7e0d239c` |
| [DEB for Ubuntu / Debian (x86-64)](https://repos.ripple.com/repos/rippled-deb/pool/stable/xrpld_3.2.1-1_amd64.deb) | `b0cd5762a739feaa9c2c7b0d0d61abbb6cad382c7dc73bddff6af63a5156075e` |

For other platforms, please [build from source](https://github.com/XRPLF/rippled/blob/release/3.2.x/BUILD.md). The most recent commit in the git log should be the change setting the version:

```text
commit d4c1359921f34a4e96c5c8483119e59f0e30e4df
Author: Ed Hennis <ed@ripple.com>
Date:   Fri Jul 31 19:46:17 2026 -0400

    chore: Bump version to 3.2.1
```


## Full Changelog


### Bug Fixes

- Fixed a problem with validator manifest propagation that could cause a server to use excessive memory and processing resources. ([#7925](https://github.com/XRPLF/rippled/pull/7925))


## Credits

The following RippleX teams and GitHub users contributed to this release:

- RippleX Engineering
- RippleX Docs
- RippleX Product


## Bug Bounties and Responsible Disclosures

We welcome reviews of the `xrpld` code and urge researchers to responsibly disclose any issues they may find.

For more information, see:

- [Ripple's Bug Bounty Program](https://ripple.com/legal/bug-bounty/)
- [`xrpld` Security Policy](https://github.com/XRPLF/rippled/blob/develop/SECURITY.md)
