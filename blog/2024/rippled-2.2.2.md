---
category: 2024
date: 2024-09-03
labels:
    - rippled Release Notes
theme:
    markdown:
        editPage:
            hide: true
---
# Introducing XRP Ledger version 2.2.2

Version 2.2.2 of `rippled`, the reference server implementation of the XRP Ledger protocol, is now available. This release fixes an ongoing issue on Mainnet where a majority of UNL validators will stall during consensus processing due to lock contention, preventing ledgers from being validated for up to two minutes. It does not introduce any new amendments.

<!-- BREAK -->

## Action Required

Five amendments introduced in version 2.2.0 are open for voting according to the XRP Ledger's [amendment process](https://livenet.xrpl.org/amendments.html), which enables protocol changes following two weeks of >80% support from trusted validators.

If you operate an XRP Ledger server, upgrade to version 2.2.2 by September 17, 2024 to ensure service continuity. The exact time that protocol changes take effect depends on the voting decisions of the decentralized network.

## Install / Upgrade

On supported platforms, see the [instructions on installing or updating `rippled`](../../docs/infrastructure/installation/index.md).

| Package | SHA-256 |
|:--------|:--------|
| [RPM for Red Hat / CentOS
(x86-64)](https://repos.ripple.com/repos/rippled-rpm/stable/rippled-2.2.2-1.el7.x86_64.rpm)
| `<add hash here>` |
| [DEB for Ubuntu / Debian
(x86-64)](https://repos.ripple.com/repos/rippled-deb/pool/stable/rippled_2.2.2-1_amd64.deb)
| `<add hash here>` |
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

- Track latencies of certain code blocks, and log if they take too long [#5115](https://github.com/XRPLF/rippled/pull/5115)
- Allow only 1 job queue slot for acquiring inbound ledger. [#5115](https://github.com/XRPLF/rippled/pull/5115)
- Allow only 1 job queue slot for each validation ledger check [#5115](https://github.com/XRPLF/rippled/pull/5115)

## Contact and More Information

[Sign Up for Future Release Announcements](https://groups.google.com/g/ripple-server)

The public source code repository for `rippled` is hosted on GitHub at <https://github.com/XRPLF/rippled>.

We welcome all contributions and invite everyone to join the community of XRP Ledger developers to help build the Internet of Value. 

#### Bug Bounties and Responsible Disclosures:

We welcome reviews of the `rippled` code and urge researchers to responsibly disclose any issues they may find.

To report a bug, please send a detailed report to: <bugs@xrpl.org>


