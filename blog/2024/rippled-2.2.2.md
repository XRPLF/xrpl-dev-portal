---
category: 2024
date: 2024-09-03
seo:
    title: Introducing XRP Ledger version 2.2.2
    description: Rippled version 2.2.2 is now available, addressing a Mainnet issue that caused validators to stall during consensus. Learn more about this release.
labels:
    - rippled Release Notes
theme:
    markdown:
        editPage:
            hide: true
---
# Introducing XRP Ledger version 2.2.2

Version 2.2.2 of `rippled`, the reference server implementation of the XRP Ledger protocol, is now available. This release fixes an ongoing issue with Mainnet where validators can stall during consensus processing due to lock contention, preventing ledgers from being validated for up to two minutes. There are no new amendments in this release.

<!-- BREAK -->


## Action Required

If you run an XRP Ledger validator, upgrade to version 2.2.2 as soon as possible to ensure stable and uninterrupted network behavior.

Additionally, five amendments introduced in version 2.2.0 are open for voting according to the XRP Ledger's [amendment process](https://xrpl.org/amendments.html), which enables protocol changes following two weeks of >80% support from trusted validators. If you operate an XRP Ledger server older than version 2.2.0, upgrade by September 17, 2024 to ensure service continuity. The exact time that protocol changes take effect depends on the voting decisions of the decentralized network. Version 2.2.2 is recommended because of known bugs affecting stability of versions 2.2.0 and 2.2.1.


## Install / Upgrade

On supported platforms, see the [instructions on installing or updating `rippled`](../../docs/infrastructure/installation/index.md).

| Package | SHA-256 |
|:--------|:--------|
| [RPM for Red Hat / CentOS (x86-64)](https://repos.ripple.com/repos/rippled-rpm/stable/rippled-2.2.2-1.el7.x86_64.rpm) | `d17d2dfc52a776015ba71a93bdd70cca5d57e51ba2c27ab0bb01afe6b645d3f0` |
| [DEB for Ubuntu / Debian (x86-64)](https://repos.ripple.com/repos/rippled-deb/pool/stable/rippled_2.2.2-1_amd64.deb) | `9e0734966089d9cfde40d1a3551ae1e219faaadfe9fdc69eb900c6cb5024d658` |
| [Portable Builds (Linux x86-64)](https://github.com/XRPLF/rippled-portable-builds) | (Use signature verification) |

For other platforms, please [build from source](https://github.com/ripple/rippled/tree/master/Builds). The most recent commit in the git log should be the change setting the version:

```text
commit 85214bdf811e1ff11a02977211fe59b07619b856
Author: Ed Hennis <ed@ripple.com>
Date:   Fri Aug 23 17:19:52 2024 -0400

    Set version to 2.2.2
```


## Full Changelog

### Amendments

- None

### Bug fixes

- Allow only 1 job queue slot for acquiring inbound ledger ([7741483](https://github.com/XRPLF/rippled/commit/774148389467781aca7c01bac90af2fba870570c))
- Allow only 1 job queue slot for each validation ledger check ([fbbea9e](https://github.com/XRPLF/rippled/commit/fbbea9e6e25795a8a6bd1bf64b780771933a9579))

### Other Improvements

-  Track latencies of certain code blocks, and log if they take too long ([00ed7c9](https://github.com/XRPLF/rippled/commit/00ed7c942436f02644a13169002b5123f4e2a116))
