---
category: 2026
date: "2026-09-25"
template: '../../@theme/templates/blogpost'
seo:
    description: xrpld version 3.4.1 is now available. This is an emergency release to fix security-sensitive issues in the XRPL protocol.
labels:
    - xrpld Release Notes
markdown:
    editPage:
        hide: true
---
# Introducing XRP Ledger version 3.4.1

Version 3.4.1 of `xrpld`, the reference server implementation of the XRP Ledger protocol, is now available. This is an emergency release to fix security-sensitive issues in the XRPL protocol.

This release introduces a new amendment, **fixBatchV1_2**, with the default vote set to "Yes". The amendment also contains other fixes for security and stability.

## Action Required

If you run an XRP Ledger server, upgrade to version 3.4.1 as soon as possible to ensure service continuity. The new `fixBatchV1_2` amendment has already gained support from a supermajority of validators, and is expected to become enabled on 2026-10-09.

If it maintains support and becomes enabled at that time, servers that are not updated to 3.4.1 will become amendment blocked and unable to maintain sync with the rest of the network.

## Install / Upgrade

On supported platforms, see the [instructions on installing or updating `xrpld`](../../docs/infrastructure/installation/index.md). As a reminder, the `xrpld` DEB and RPM packages are now hosted at `packages.xrplf.org` with an XRP Ledger Foundation signing key.

| Package | SHA-256 |
|:--------|:--------|
| [RPM for Red Hat / CentOS (x86-64)](https://packages.xrplf.org/repository/rpm-stable/x86_64/xrpld-3.4.1-1.el9.x86_64.rpm) | `04e9b56acecfdb11ba6274d33e2b7da7c96b3e71e8c2ed3890f1ca5f488bbb9a` |
| [DEB for Ubuntu / Debian (x86-64)](https://packages.xrplf.org/repository/deb-stable/pool/x/xrpld/xrpld_3.4.1-1_amd64.deb) | `cae8ce3b9bc9451b19975c890714ba789d2004987cdfff9cbd55522c612c6f26` |

Due to the security-sensitive nature of the fix, the source code for this release has not been published yet. It will be published along with a retrospective on a future date. The most recent commit in the git log should be the change setting the version (however, the final commit ID will change when applied to the published code branch):

```text
commit d147fccf54a500fce586522f28d6044c37fd8d29
Author: Bart <bthomee@users.noreply.github.com>
Date:   Thu Sep 24 19:22:38 2026 -0400

    chore: Bump version to 3.4.1 (#444)
    
    Release 3.4.1
```

## Full Changelog

- chore: Bump version to 3.4.1
- fix: Reject Batch inner txs with the wrong wrapper (fixBatchV1_2)
- ci: Update Nexus packaging URL
- fix: Assorted integer-arithmetic hardening in the payment engine and ledger helpers

## Credits

This release was built through the collaboration of RippleX Engineering and the XRP Ledger Foundation.

## Bug Bounties and Responsible Disclosures

We welcome reviews of the `xrpld` code and urge researchers to responsibly disclose any issues they may find.

For more information, see:

- [Ripple's Bug Bounty Program](https://ripple.com/legal/bug-bounty/)
- [`xrpld` Security Policy](https://github.com/XRPLF/rippled/blob/3.4.0/SECURITY.md)
