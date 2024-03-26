---
category: 2022
date: 2022-09-20
labels:
    - rippled Release Notes
    - Amendments
theme:
    markdown:
        editPage:
            hide: true
---
# Introducing XRP Ledger version 1.9.4

Version 1.9.4 of `rippled`, the reference server implementation of the XRP Ledger protocol, is now available. This release introduces a new amendment to the XRP Ledger protocol, **fixRemoveNFTokenAutoTrustLine**, to mitigate a potential denial-of-service attack against non-fungible token (NFT) issuers.

<!-- BREAK -->

## Action Required

The new amendment is open for voting according to the XRP Ledger's [amendment process](/docs/concepts/networks-and-servers/amendments/), which enables protocol changes following two weeks of >80% support from trusted validators.

If you operate an XRP Ledger server, then you should upgrade to version 1.9.4 within two weeks, to ensure service continuity. The exact time that protocol changes take effect depends on the voting decisions of the decentralized network.

## NFT Status

Previously, the **NonFungibleTokensV1_1** amendment [was on track to become enabled 2022-09-13](/blog/2022/get-ready-for-nfts), but a new [bug report](https://github.com/XRPLF/rippled/issues/4300) on 2022-09-11 described an exploit where malicious users could perform a denial of service attack on a token issuer by abusing the `tfTrustLine` feature of the XLS-20 standard. Following this report, several validators changed their votes on the NonFungibleTokensV1_1 amendment, causing its support to decrease below 80% and not become enabled.

The **fixRemoveNFTokenAutoTrustLine** amendment disables the problematic feature. For non-fungible tokens to become enabled on the XRP Ledger Mainnet, both the new amendment and the **NonFungibleTokensV1_1** amendment require a new period of two weeks' uninterrupted support from over 80% of trusted validators. The voting period for these amendments can be concurrent, but the **fixRemoveNFTokenAutoTrustLine** amendment should be enabled first or at the same time as the NonFungibleTokensV1_1 amendment.


## Install / Upgrade

On supported platforms, see the [instructions on installing or updating `rippled`](/docs/infrastructure/installation/).


| Package | SHA-256 |
|:--------|:--------|
| [RPM for Red Hat / CentOS (x86-64)](https://repos.ripple.com/repos/rippled-rpm/stable/rippled-1.9.4-1.el7.x86_64.rpm) | `fa6bbcda7781c6b3680e56849566f27d46df4cce16b1d9ff6432262f634f2970` |
| [DEB for Ubuntu / Debian (x86-64)](https://repos.ripple.com/repos/rippled-deb/pool/stable/rippled_1.9.4-1_amd64.deb) | `2d23b897bc0bd235f2f74cd52eab8d0ac52b416c0294a02112385192285c0169` |

For other platforms, please [build from source](https://github.com/ripple/rippled/tree/master/Builds). The most recent commit in the git log should be the change setting the version:

```text
commit ba3c0e51455a88d76d90b996f20c0f102ac3f5a0
Author: Nik Bougalis <nikb@bougalis.net>
Date:   Wed Sep 14 15:52:05 2022 -0700

    Set version to 1.9.4
```

## fixRemoveNFTokenAutoTrustLine

The `tfTrustLine` feature was designed to allow NFT issuers to collect transfer fees for sales denominated in all possible fungible tokens. If an issuer enabled this setting on an NFT, the protocol would automatically create trust lines as needed to hold the transfer fees when the NFT was bought or sold. However, as the bug report pointed out, an attacker could create new, meaningless fungible tokens and sell an NFT back and forth for those tokens, creating numerous useless trust lines tied to the issuer. Since these trust lines would hold a positive balance, the issuer would be responsible for the [reserve requirement](https://xrpl.org/reserves.html) of each of trust lines.

The **fixRemoveNFTokenAutoTrustLine** changes the [NFTokenMint transaction](https://xrpl.org/nftokenmint.html) to make the `tfTrustLine` flag invalid. This prevents new `NFToken` objects from being minted with the flag enabled. However, the amendment does not change the code for `NFToken` objects that have already been minted. On test networks that already have NonFungibleTokensV1_1 enabled, this means that issuers who have already minted NFTokens with the `tfTrustLine` flag enabled are still vulnerable to the exploit even after the fixRemoveNFTokenAutoTrustLine amendment. On Mainnet, this means that fixRemoveNFTokenAutoTrustLine should be enabled _before_ NonFungibleTokensV1_1 to protect issuers.

For more information about NFTs on the XRP Ledger, see [NFT Conceptual Overview](https://xrpl.org/non-fungible-tokens.html).


## Changelog

This release includes the following changes:

- Introduce the [`fixRemoveNFTokenAutoTrustLine` amendment](#fixremovenftokenautotrustline), which disables the `tfTrustLine` flag. ([#4301](https://github.com/XRPLF/rippled/4301))
- Remove use of deprecated `std::iterator` (non-functional code cleanup) ([#4276](https://github.com/XRPLF/rippled/pull/4276))
- Fix errors when compiling with gcc 12 on platforms including Manjaro Linux ([#4298](https://github.com/XRPLF/rippled/pull/4298))
- Pin various Reporting Mode dependencies to stable versions ([#4278](https://github.com/XRPLF/rippled/pull/4278))
- Fix a typo in comments ([#4283](https://github.com/XRPLF/rippled/pull/4283))


### GitHub

The public source code repository for `rippled` is hosted on GitHub at <https://github.com/XRPLF/rippled>.

We welcome all contributions and invite everyone to join the community of XRP Ledger developers and help us build the Internet of Value.

### Credits

The following people contributed directly to this release:

- Howard Hinnant <howard@ripple.com>
- Ikko Ashimine <eltociear@gmail.com>
- Michael Legleux <mlegleux@ripple.com>
- Scott Determan <scott.determan@yahoo.com>
- Scott Schurr <scott@ripple.com>
