---
category: 2025
date: 2025-01-29
seo:
    title: Introducing XRP Ledger version 2.3.1
    description: rippled version 2.3.1 is now available. This version introduces new features and stability fixes.
labels:
    - rippled Release Notes
markdown:
    editPage:
        hide: true
---
# Introducing XRP Ledger version 2.3.1

Version 2.3.1 of `rippled`, the reference server implementation of the XRP Ledger protocol, is now available. This release includes bug fixes and updates for peer charges.

## Action Required

If you run an XRP Ledger server, upgrade to version 2.3.1 as soon as possible to ensure service continuity.

## Install / Upgrade

On supported platforms, see the [instructions on installing or updating `rippled`](../../docs/infrastructure/installation/index.md).

| Package | SHA-256 |
|:--------|:--------|
| [RPM for Red Hat / CentOS (x86-64)](https://repos.ripple.com/repos/rippled-rpm/stable/rippled-2.3.1-1.el7.x86_64.rpm) | `fb74f401e5ba121bbc37e6188aa064488ad78ffef549a1e19bc8b71316d08031` |
| [DEB for Ubuntu / Debian (x86-64)](https://repos.ripple.com/repos/rippled-deb/pool/stable/rippled_2.3.1-1_amd64.deb) | `5d616d53218b47a2f0803c1d37d410f72d19b57cdb9cabdf77b1cf0134cce3ca` |
| [Portable Builds (Linux x86-64)](https://github.com/XRPLF/rippled-portable-builds) | (Use signature verification) |

For other platforms, please [build from source](https://github.com/XRPLF/rippled/blob/master/BUILD.md). The most recent commit in the git log should be the change setting the version:

```text
commit f64cf9187affd69650907d0d92e097eb29693945
Author: Elliot Lee <github.public@intelliot.com>
Date:   Mon Nov 25 12:27:17 2024 -0800

    Set version to 2.3.0
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

