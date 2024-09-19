---
category: 2024
date: 2024-07-30
seo:
    title: Introducing XRP Ledger version 2.2.1
    description: Rippled version 2.2.1 is now available, addressing a critical bug when handling some types of RPC requests. Learn more about this release.
labels:
    - rippled Release Notes
theme:
    markdown:
        editPage:
            hide: true
---
# Introducing XRP Ledger version 2.2.1

Version 2.2.1 of `rippled`, the reference server implementation of the XRP Ledger protocol, is now available. This release fixes a critical bug, introduced in 2.2.0, when handling some types of RPC requests. It does not introduce any new amendments.

<!-- BREAK -->

## Action Required

Five amendments introduced in version 2.2.0 are open for voting according to the XRP Ledger's [amendment process](https://xrpl.org/amendments.html), which enables protocol changes following two weeks of >80% support from trusted validators.

If you operate an XRP Ledger server version 2.2.0, upgrade to version 2.2.1 as soon as possible to ensure service continuity.

If you operate an XRP Ledger server older than version 2.2.0, upgrade to version 2.2.1 by August 14, 2024 to ensure service continuity. The exact time that protocol changes take effect depends on the voting decisions of the decentralized network.

## Install / Upgrade

On supported platforms, see the [instructions on installing or updating `rippled`](../../docs/infrastructure/installation/index.md).

| Package | SHA-256 |
|:--------|:--------|
| [RPM for Red Hat / CentOS (x86-64)](https://repos.ripple.com/repos/rippled-rpm/stable/rippled-2.2.1-1.el7.x86_64.rpm) | `32312c90ac4c685f11b168c5b9ec75aee8f4b2d7bef5dc11b42232679d0cd1f4` |
| [DEB for Ubuntu / Debian (x86-64)](https://repos.ripple.com/repos/rippled-deb/pool/stable/rippled_2.2.1-1_amd64.deb) | `f696e6898ad64e73d75bb9a1f50fb325b9675b168ffaeeacfce53fbd9e35bbee` |
| [Portable Builds (Linux x86-64)](https://github.com/XRPLF/rippled-portable-builds) | (Use signature verification) |

For other platforms, please [build from source](https://github.com/ripple/rippled/tree/master/Builds). The most recent commit in the git log should be the change setting the version:

```text
commit e6ef0fc26cb8d4db25075eaa1fe21fcc7f984751
Author: Ed Hennis <ed@ripple.com>
Date:   Mon Jul 22 18:08:16 2024 -0400

    Set version to 2.2.1
```


## Full Changelog

### Amendments

- None

### Bug fixes

- Improve error handling in some RPC commands. [#5078](https://github.com/XRPLF/rippled/pull/5078)
- Use error codes throughout fast Base58 implementation. [#5078](https://github.com/XRPLF/rippled/pull/5078)


## Contact and More Information

[Sign Up for Future Release Announcements](https://groups.google.com/g/ripple-server)

The public source code repository for `rippled` is hosted on GitHub at <https://github.com/XRPLF/rippled>.

We welcome all contributions and invite everyone to join the community of XRP Ledger developers to help build the Internet of Value. 

#### Bug Bounties and Responsible Disclosures:

We welcome reviews of the `rippled` code and urge researchers to responsibly disclose any issues they may find.

To report a bug, please send a detailed report to: <bugs@xrpl.org>


