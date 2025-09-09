---
category: 2025
date: "2025-09-08"
template: '../../@theme/templates/blogpost'
seo:
    title: Introducing XRP Ledger version 2.5.1
    description: rippled version 2.5.1 is now available. This version fixes an issue with stalled consensus rounds.
labels:
    - rippled Release Notes
markdown:
    editPage:
        hide: true
---
# Introducing XRP Ledger version 2.5.1

Version 2.5.1 of `rippled`, the reference server implementation of the XRP Ledger protocol, is now available. This release was rolled back from version 2.6.0 after issues were discovered, but retains an important fix for stalled consensus rounds.


## Action Required

If you run an XRP Ledger server, upgrade to version 2.5.1 as soon as possible to ensure service continuity.


## Install / Upgrade

On supported platforms, see the [instructions on installing or updating `rippled`](../../docs/infrastructure/installation/index.md).

| Package | SHA-256 |
|:--------|:--------|
| [RPM for Red Hat / CentOS (x86-64)](https://repos.ripple.com/repos/rippled-rpm/stable/rippled-2.5.1-1.el7.x86_64.rpm) | `f16da245b417d616033e8fac8190425f1f8778f61c62fd23986e2e496c4fabf4` |
| [DEB for Ubuntu / Debian (x86-64)](https://repos.ripple.com/repos/rippled-deb/pool/stable/rippled_2.5.1-1_amd64.deb) | `1d3cd06fc08911c5efd1b9a6b1b7d06f42e806e0628df9f0552c9e71daee0af6` |

For other platforms, please [build from source](https://github.com/XRPLF/rippled/blob/master/BUILD.md). The most recent commit in the git log should be the change setting the version:

```text
commit 16c2ff97ccc5e78fe450bd92c431322de75aa94e
Author: Ed Hennis <ed@ripple.com>
Date:   Wed Sep 3 10:19:38 2025 -0400

    Set version to 2.5.1
```


## Full Changelog

### Bug Fixes

- Fixed stalled consensus detection to prevent false positives in situations where there were no disputed transactions. ([#5658](https://github.com/XRPLF/rippled/pull/5658))


## Credits

The following GitHub users contributed to this release:

- @ximinez


## Bug Bounties and Responsible Disclosures

We welcome reviews of the `rippled` code and urge researchers to responsibly disclose any issues they may find.

To report a bug, please send a detailed report to: <bugs@xrpl.org>