---
category: 2022
date: 2022-08-26
labels:
    - rippled Release Notes
theme:
    markdown:
        editPage:
            hide: true
---
# Introducing XRP Ledger version 1.9.3

Version 1.9.3 of `rippled`, the reference server implementation of the XRP Ledger protocol, is now available. This release corrects a technical flaw that could cause servers to incorrectly process stored amendment votes during startup and fixes a minor issue with with copy constructor of `PublicKey`.

<!-- BREAK -->

## Action Recommended

If you run an XRP Ledger validator, you can upgrade to 1.9.3 to load your amendment votes appropriately. Since this release does not introduce any new amendments or fix any security-sensitive bugs, you can safely continue to use version 1.9.2 on XRP Ledger networks if you do not configure explicit amendment votes.

If you are using version 1.9.1 or earlier, you must upgrade to **1.9.2 or later** as soon as possible, to ensure service continuity. The **fixNFTokenNegOffer** and **NonFungibleTokensV1_1** amendments that were introduced in 1.9.2 are open for voting and may become enabled two weeks after they gain support from a supermajority of validators according to the XRP Ledger's [amendment process](https://xrpl.org/amendments.html).

## Install / Upgrade

On supported platforms, see the [instructions on installing or updating `rippled`](https://xrpl.org/install-rippled.html).

| Package | SHA-256 |
|:--------|:--------|
| [RPM for Red Hat / CentOS (x86-64)](https://repos.ripple.com/repos/rippled-rpm/stable/rippled-1.9.3-1.el7.x86_64.rpm) | `fc8cc3bbcff02291ce5ce5a466e1b4a3f54c1515befed36dcad92ceae69dafa9` |
| [DEB for Ubuntu / Debian (x86-64)](https://repos.ripple.com/repos/rippled-deb/pool/stable/rippled_1.9.3-1_amd64.deb) | `516195120cbb8ca68e1c596a69b0b9fe1ac7e0898dcc697d6289396fadae142d` |

For other platforms, please [build from source](https://github.com/ripple/rippled/tree/master/Builds). The most recent commit in the git log should be the change setting the version:

```text
commit 47dec467ea659c1b64c7b5f4eb8a1bfa9759ff91
Author: Nik Bougalis <nikb@bougalis.net>
Date:   Fri Aug 19 14:40:53 2022 -0700

    Set version to 1.9.3
```

## Changelog

## Contributions

This releases contains the following bug fixes:

- **Change by-value to by-reference to persist vote**: A minor technical flaw, caused by use of a copy instead of a reference, resulted in operator-configured "yes" votes to not be properly loaded after a restart. ([#4256](https://github.com/XRPLF/rippled/pull/4256))
- **Properly handle self-assignment of PublicKey**: The `PublicKey` copy assignment operator mishandled the case where a `PublicKey` would be assigned to itself, and could result in undefined behavior.

### GitHub

The public source code repository for `rippled` is hosted on GitHub at <https://github.com/XRPLF/rippled>.

We welcome contributions, big and small, and invite everyone to join the community of XRP Ledger developers and help us build the Internet of Value.

### Credits

The following people contributed directly to this release:

- Howard Hinnant <howard@ripple.com>
- Crypto Brad Garlinghouse <cryptobradgarlinghouse@protonmail.com>
- Wo Jake <87929946+wojake@users.noreply.github.com>
