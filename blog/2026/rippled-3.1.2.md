---
category: 2026
date: "2026-03-12"
template: '../../@theme/templates/blogpost'
seo:
    description: rippled version 3.1.2 is now available. This version contains important security updates.
labels:
    - rippled Release Notes
markdown:
    editPage:
        hide: true
---
# Introducing XRP Ledger version 3.1.2

Version 3.1.2 of `rippled`, the reference server implementation of the XRP Ledger protocol, is now available. This release contains fixes for security issues that, in the worst case scenario, could cause servers to crash or restart. There are no new features or amendments in this release.

## Action Required

**If you operate a `rippled` server**, then you should update to version 3.1.2 as soon as possible to ensure service continuity.

### Impact of Not Upgrading

If you do not upgrade, your server may experience restarts or outages.

### Install / Upgrade

On supported platforms, see the [instructions on installing or updating `rippled`](../../docs/infrastructure/installation/index.md).

| Package | SHA-256 |
|:--------|:--------|
| [RPM for Red Hat / CentOS (x86-64)](https://repos.ripple.com/repos/rippled-rpm/stable/rippled-3.1.2-1.el9.x86_64.rpm) | `a51905bbffe97e714d0c66566e705704dea2783913a54c0fd62253f422d94713` |
| [DEB for Ubuntu / Debian (x86-64)](https://repos.ripple.com/repos/rippled-deb/pool/stable/rippled_3.1.2-1_amd64.deb) | `0d162a2778f7e1bcd8611bbfd23b9cb6d466a7dd752494a6640a909145446494` |

For other platforms, please [build from source](https://github.com/XRPLF/rippled/blob/release-3.1/BUILD.md). The most recent commit in the git log should be the change setting the version:

```text
commit 3ba3fcff4c4898a96a57838bb7c67a44a3d2ec5c
Author: Mayukha Vadari <mvadari@gmail.com>
Date:   Thu Mar 12 15:01:01 2026 -0400

    release: Bump version to 3.1.2
```

## Full Changelog

- refactor: Improve exception handling ([#6540](https://github.com/XRPLF/rippled/pull/6540))

## Credits

Thanks to the members of XRPL Commons who found and responsibly reported the issue: Luc Bocahut, Romain Thépaut, and Thomas Hussenet.

The fix was developed in collaboration with the team at RippleX.

## Bug Bounties and Responsible Disclosures

We welcome reviews of the `rippled` code and urge researchers to responsibly disclose any issues they may find.

For more information, see:

- [Ripple's Bug Bounty Program](https://ripple.com/legal/bug-bounty/)
- [`rippled` Security Policy](https://github.com/XRPLF/rippled/blob/develop/SECURITY.md)
