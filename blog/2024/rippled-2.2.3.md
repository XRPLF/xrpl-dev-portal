---
category: 2024
date: 2024-09-14
seo:
    title: Introducing XRP Ledger version 2.2.3
    description: Rippled version 2.2.3 is now available, addressing an issue that could cause full-history servers to run out of space in their SQLite databases. Learn more about this release.
labels:
    - rippled Release Notes
theme:
    markdown:
        editPage:
            hide: true
---
# Introducing XRP Ledger version 2.2.3

Version 2.2.3 of `rippled`, the reference server implementation of the XRP Ledger protocol, is now available. This release fixes a problem that can cause full-history servers to run out of space in their SQLite databases, depending on configuration. There are no new amendments in this release.

<!-- BREAK -->

[Sign Up for Future Release Announcements](https://groups.google.com/g/ripple-server)

## Background

The `rippled` server uses a SQLite database for tracking transactions, in addition to the main data store (usually NuDB) for ledger data. In servers keeping a large amount of history, this database can run out of space based on the configured number and size of database pages, even if the machine has disk space available. Based on the size of full history on Mainnet, servers with the default SQLite page size of 4096 may now run out of space if they store full history. In this case, your server may shut down with an error such as the following:

```text
Free SQLite space for transaction db is less than 512MB. To fix this, rippled
  must be executed with the vacuum <sqlitetmpdir> parameter before restarting.
  Note that this activity can take multiple days, depending on database size.
```

The exact timing of when a server runs out of space can vary based on a few factors. Server operators who encountered a similar problem in 2018 and followed steps to [increase the SQLite transaction database page size issue](../../../docs/infrastructure/troubleshooting/fix-sqlite-tx-db-page-size-issue) may not encounter this problem at all. The `--vacuum` commandline option to `rippled` from that time may work to free up space in the database, but requires extended downtime.

Version 2.2.3 of `rippled` reconfigures the maximum number of SQLite pages so that the database capacity is doubled. With the default page size or 4096, the database capacity is roughly 17.5 TB.

Clio servers providing full history are not affected by this issue.


## Action Required

If you run a full-history XRP Ledger Mainnet server, upgrade to version 2.2.3 as soon as possible to ensure service continuity. Other servers may not need to update immediately, but the update is safe regardless.

Additionally, three amendments from version 2.2.0 currently have support from a supermajority of trusted validators and are expected to become enabled in less than two weeks. The following table shows when the amendments are expected to become enabled if they maintain support continuously:

| Amendment | Expected on | Amendment Summary |
|---|---|---|
| `fixAMMv1_1` | 2024-09-24 | Fixes AMM offer rounding and low quality order book offers from blocking the AMM. |
| `fixEmptyDID` | 2024-09-27 | Fixes a bug in the (not yet enabled) [DID Amendment](https://xrpl.org/resources/known-amendments#did). |
| `fixPreviousTxnID` | 2024-09-27 | Adds history-tracking fields to several types of ledger entry that didn't previously have them. |

If you are running a server older than 2.2.0 when any of these amendments becomes enabled, your server will become amendment blocked, which means it:

* Cannot determine the validity of a ledger
* Cannot submit or process transactions
* Does not participate in the consensus process
* Does not vote on future amendments
* Could rely on potentially invalid data

If you are not sure if you need to upgrade, the following table shows the minimum recommended server version by configuration.

| Version | Notes |
|---|---|
| Older than 2.2.0 | May become amendment blocked on 2024-09-24. |
| 2.2.0 | Has a known issue with handling certain RPC commands. **Not recommended** for any servers. |
| 2.2.1 | Not recommended for validators or full-history servers due to known issues. Acceptable for tracking servers. |
| 2.2.2 | Not recommended for full-history servers unless you've reconfigured the page size from the default (as recommended in 2018). Acceptable for stock servers or validators. |
| 2.2.3 | Recommended for all servers. |

## Install / Upgrade

On supported platforms, see the [instructions on installing or updating `rippled`](../../docs/infrastructure/installation/index.md).

| Package | SHA-256 |
|:--------|:--------|
| [RPM for Red Hat / CentOS (x86-64)](https://repos.ripple.com/repos/rippled-rpm/stable/rippled-2.2.3-1.el7.x86_64.rpm) | `fb90f8f78799c24dd1f6286e96aa31afd0586bf21d32bc711ccc3dc868977da5` |
| [DEB for Ubuntu / Debian (x86-64)](https://repos.ripple.com/repos/rippled-deb/pool/stable/rippled_2.2.3-1_amd64.deb) | `e6a77cbe32228f9d68a8545c3b4e9a25d098ab30ea01852658ee5efe3371b9f1` |
| [Portable Builds (Linux x86-64)](https://github.com/XRPLF/rippled-portable-builds) | (Use signature verification) |

For other platforms, please [build from source](https://github.com/ripple/rippled/tree/master/Builds). The most recent commit in the git log should be the change setting the version:

```text
commit 68e1be3cf544bc8f50283b0bfecba60f8370dbf2
Author: Elliot Lee <github.public@intelliot.com>
Date:   Sat Sep 14 13:08:18 2024 -0700

    Set version to 2.2.3
```

## Full Changelog

### Amendments

- None

### Bug fixes

- Update SQLite3 max_page_count to match current defaults ([#5114](https://github.com/XRPLF/rippled/pull/5114))


## Credits

The following people contributed directly to this release:

J. Scott Branson <the@rabbitkick.club>


## Bug Bounties and Responsible Disclosures

We welcome reviews of the `rippled` code and urge researchers to responsibly disclose any issues they may find.

To report a bug, please send a detailed report to: <bugs@xrpl.org>
