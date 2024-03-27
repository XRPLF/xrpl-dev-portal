---
category: 2024
date: 2024-03-27
labels:
    - rippled Release Notes
theme:
    markdown:
        editPage:
            hide: true
---
# Introducing XRP Ledger version 2.1.1

Version 2.1.1 of `rippled`, the reference server implementation of the XRP Ledger protocol, is now available. This release introduces the **fixAMMOverflowOffer** amendment, which fixes a critical bug in the integration of AMMs with the payment engine.

<!-- BREAK -->

## Action Required

The new **fixAMMOverflowOffer** amendment is now open for voting according to the XRP Ledger's [amendment process](../../docs/concepts/networks-and-servers/amendments.md), which enables protocol changes following two weeks of >80% support from trusted validators. 

Due to the importance of this fix, the default vote in the source code has been set to YES. For information on how to configure your validator's amendment voting, see [Configure Amendment Voting](../../docs/infrastructure/configuration/configure-amendment-voting.md).

If you operate an XRP Ledger server, upgrade to version 2.1.1 by April 8, 2024 to ensure service continuity. The exact time that protocol changes take effect depends on the voting decisions of the decentralized network.

## Install / Upgrade

On supported platforms, see the [instructions on installing or updating `rippled`](../../docs/infrastructure/installation/index.md).

| Package | SHA-256 |
|:--------|:--------|
| [RPM for Red Hat / CentOS (x86-64)](https://repos.ripple.com/repos/rippled-rpm/stable/rippled-2.1.1-1.el7.x86_64.rpm) | `65f1e69171907f912b458f256c623f2e59d83846424a00ba52a2d151228fe391` |
| [DEB for Ubuntu / Debian (x86-64)](https://repos.ripple.com/repos/rippled-deb/pool/stable/rippled_2.1.1-1_amd64.deb) | `dee7759d8562c8cc1f98fef4645c3e9c29030b0f1eb4adc4346bcb44e11b22de` |
| [Portable Builds (Linux x86-64)](https://github.com/XRPLF/rippled-portable-builds) | (Use signature verification) |

For other platforms, please [build from source](https://github.com/ripple/rippled/tree/master/Builds). The most recent commit in the git log should be the change setting the version:

```text
commit 2d1854f354ff8bb2b5671fd51252c5acd837c433
Author: seelabs <scott.determan@yahoo.com>
Date:   Tue Mar 26 18:13:57 2024 -0400

    Set version to 2.1.1
```


## Full Changelog

### Amendments

- **fixAMMOverflowOffer**: Fix improper handling of a large synthetic AMM offers in the payment engine.


## Contact and More Information

[Sign Up for Future Release Announcements](https://groups.google.com/g/ripple-server)

The public source code repository for `rippled` is hosted on GitHub at <https://github.com/XRPLF/rippled>.

We welcome all contributions and invite everyone to join the community of XRP Ledger developers to help build the Internet of Value. 

#### Bug Bounties and Responsible Disclosures:

We welcome reviews of the `rippled` code and urge researchers to responsibly disclose any issues they may find.

To report a bug, please send a detailed report to: <bugs@xrpl.org>


