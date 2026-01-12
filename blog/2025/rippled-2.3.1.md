---
category: 2025
date: '2025-01-30'
template: '../../@theme/templates/blogpost'
seo:
  title: Introducing XRP Ledger version 2.3.1
  description: rippled version 2.3.1 is now available. This version includes stability fixes.
labels:
  - rippled Release Notes
markdown:
  editPage:
    hide: true
---

# Introducing XRP Ledger version 2.3.1

Version 2.3.1 of `rippled`, the reference server implementation of the XRP Ledger protocol, is now available.

This release fixes an ongoing issue where normal peer traffic is charged incorrectly, causing peers to be disconnected inappropriately during normal operations. This affects network connectivity and the ability of some UNL validators to reach consensus with the others.

## Action Recommended

If you run an XRP Ledger server, upgrade to version 2.3.1 as soon as possible to ensure service continuity.

## Install / Upgrade

On supported platforms, see the [instructions on installing or updating `rippled`](../../docs/infrastructure/installation/index.md).

| Package                                                                                                               | SHA-256                                                            |
| :-------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------- |
| [RPM for Red Hat / CentOS (x86-64)](https://repos.ripple.com/repos/rippled-rpm/stable/rippled-2.3.1-1.el7.x86_64.rpm) | `db3ad27d3b61675caad0e0f74e66b2e2004c7d7ee97b5decd297168d27e48a25` |
| [DEB for Ubuntu / Debian (x86-64)](https://repos.ripple.com/repos/rippled-deb/pool/stable/rippled_2.3.1-1_amd64.deb)  | `21931aa5fbf8cd2cf3fb4dc71a3b593bff754e4a804ba712891dea5ed48357e9` |

For other platforms, please [build from source](https://github.com/XRPLF/rippled/blob/master/BUILD.md). The most recent commit in the git log should be the change setting the version:

```text
commit 8458233a31c98cbb13cfae212189ce3d8a1095d4
Author: Ed Hennis <ed@ripple.com>
Date:   Wed Jan 29 09:26:27 2025 -0500

    Set version to 2.3.1
```

## Full Changelog

### Amendments and New Features

- None

### Bug Fixes and Updates

- Reduce peer charges for well-behaved peers. ([#5243](https://github.com/XRPLF/rippled/pull/5243))
  - Fix an erroneous high fee penalty that some peers could incur for sending older transactions.
  - Update the fees charged for imposing a load on the server.
  - Fix to prevent interal pseudo-transactions from relaying. Previously, pseudo-transcations received from a peer failed the signature check because they had no signature--even if they were requested using `TMGetObjectByHash`. This caused the peer to be charged for an invalid signature. This fix places pseudo-transactions only in the global cache (TransactionMaster). If the transaction is not part of a `TMTransactions` batch, the peer is charged an unwanted data fee. These fees won't be a problem in the normal course of operations, but should dissuade peers from sending many unwanted transactions.
  - Improve logging to specify the reason for fees charged to a peer.

## Credits

The following people contributed directly to this release:

- Ed Hennis <ed@ripple.com>
- JoelKatz <DavidJoelSchwartz@GMail.com>
- Sophia Xie <106177003+sophiax851@users.noreply.github.com>
- Valentin Balaschenko <13349202+vlntb@users.noreply.github.com>

## Bug Bounties and Responsible Disclosures

We welcome reviews of the `rippled` code and urge researchers to responsibly disclose any issues they may find.

To report a bug, please send a detailed report to: <bugs@xrpl.org>
