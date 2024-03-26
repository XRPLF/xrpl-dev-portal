---
category: 2021
theme:
    markdown:
        editPage:
            hide: true
date: 2021-08-27
labels:
    - rippled Release Notes
---
# Introducing XRP Ledger version 1.7.3

Version 1.7.3 of `rippled`, the reference server implementation of the XRP Ledger protocol, is now available. This release addresses an out-of-bounds memory read identified by Guido Vranken, as well as an unrelated issue identified by the Ripple C++ team that could result in incorrect use of internal data structures. By [community demand](https://github.com/ripple/rippled/issues/3898), this version also introduces the NegativeUNL amendment, which corresponds to the feature which was introduced in [the 1.6.0 release](https://xrpl.org/blog/2020/rippled-1.6.0.html).

<!-- BREAK -->

## Action Required

If you operate an XRP Ledger server, then you should upgrade to version 1.7.3 at your earliest convenience to mitigate the issues addressed in this hotfix.

Additionally, this release introduces a new amendment to the XRP Ledger protocol: [NegativeUNL](https://xrpl.org/negative-unl.html). This amendment is now **open for voting** according to the XRP Ledger's [amendment process](https://xrpl.org/amendments.html), which enables protocol changes following two weeks of >80% support from trusted validators. If the NegativeUNL amendment activates, servers running previous versions of `rippled` will become [amendment blocked](https://xrpl.org/amendments.html#amendment-blocked).

If you operate an XRP Ledger validator, please [learn more about this amendment](https://xrpl.org/known-amendments.html) so you can make informed decisions about [how your validator votes](https://xrpl.org/configure-amendment-voting.html). If you take no action, your validator begins voting in favor of any new amendments as soon as it has been upgraded.

## Install / Upgrade

On supported platforms, see the [instructions on installing or updating `rippled`](https://xrpl.org/install-rippled.html).

| Package | SHA-256 |
|:--------|:--------|
| [RPM for Red Hat / CentOS (x86-64)](https://repos.ripple.com/repos/rippled-rpm/stable/rippled-1.7.3-1.el7.x86_64.rpm) | `d994543be11edeb9c1256cd7e35c6bd7f5b53f23f97b8bdf380302b24269d47e` |
| [DEB for Ubuntu / Debian (x86-64)](https://repos.ripple.com/repos/rippled-deb/pool/stable/rippled_1.7.3-1_amd64.deb) | `5d13b32ac00796a50266030de5de40e85c310c762a88e72d435e5c8c2e30becb` |

For other platforms, please [build from source](https://github.com/ripple/rippled/tree/master/Builds). The most recent commit in the git log should be the change setting the version:

```text
commit 96bbabbd2ece106779bb544aa0e4ce174e99fdf6
Author: Nik Bougalis <nikb@bougalis.net>
Date:   Wed Aug 4 10:52:58 2021 -0700

    Set version to 1.7.3
```


## Changelog

- Improve SLE (Serialized Ledger Entry) usage in check cashing: Fixes a situation which could result in the incorrect use of SLEs.
- Address OOB in base58 decoder: Corrects a technical flaw that could allow an out-of-bounds memory read in the Base58 decoder.
- Add NegativeUNL as a supported amendment: Adds an amendment to enable the Negative UNL feature introduced in version 1.6.0.
