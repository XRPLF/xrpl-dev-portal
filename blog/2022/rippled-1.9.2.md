---
category: 2022
date: 2022-07-26
labels:
    - rippled Release Notes
theme:
    markdown:
        editPage:
            hide: true
---
# Introducing XRP Ledger version 1.9.2

Version 1.9.2 of `rippled`, the reference server implementation of the XRP Ledger protocol, is now available. This release includes several fixes and improvements, including a second new fix amendment to correct a bug in Non-Fungible Tokens (NFTs) code, a new API method for order book changes, less noisy logging, and other small fixes.

<!-- BREAK -->


## Action Required

This release introduces a two new amendments to the XRP Ledger protocol. The first, **fixNFTokenNegOffer**, fixes a bug in code associated with the **NonFungibleTokensV1** amendment, originally introduced in [version 1.9.0](https://xrpl.org/blog/2022/rippled-1.9.0.html). The second, **NonFungibleTokensV1_1**, is a "roll-up" amendment that enables the **NonFungibleTokensV1** feature plus the two fix amendments associated with it, **fixNFTokenDirV1** and **fixNFTokenNegOffer**.

If you want to enable NFT code on the XRP Ledger Mainnet, you can vote in favor of only the **NonFungibleTokensV1_1** amendment to support enabling the feature and fixes together, without risk that the unfixed NFT code may become enabled first.

These amendments are now open for voting according to the XRP Ledger's [amendment process](https://xrpl.org/amendments.html), which enables protocol changes following two weeks of >80% support from trusted validators.

If you operate an XRP Ledger server, then you should upgrade to version 1.9.2 within two weeks, to ensure service continuity. The exact time that protocol changes take effect depends on the voting decisions of the decentralized network.

For more information about NFTs on the XRP Ledger, see [NFT Conceptual Overview](https://xrpl.org/nft-conceptual-overview.html).

## Install / Upgrade

On supported platforms, see the [instructions on installing or updating `rippled`](https://xrpl.org/install-rippled.html).

| Package | SHA-256 |
|:--------|:--------|
| [RPM for Red Hat / CentOS (x86-64)](https://repos.ripple.com/repos/rippled-rpm/stable/rippled-1.9.2-1.el7.x86_64.rpm) | `a377802fd25f92d8be8cca9b63a0e9b586e9fc52527ed17e73608bf6a96a6ac4` |
| [DEB for Ubuntu / Debian (x86-64)](https://repos.ripple.com/repos/rippled-deb/pool/stable/rippled_1.9.2-1_amd64.deb) | `d558bf5f769a20d2e6c639fb814f4f05e9650385f0f1a182a2a219c56c889624` |

For other platforms, please [build from source](https://github.com/ripple/rippled/tree/master/Builds). The most recent commit in the git log should be the change setting the version:

```text
commit e5275b857752c2d6078cb8774edbb7e60f179d72
Author: manojsdoshi <mdoshi@ripple.com>
Date:   Mon Jul 25 13:30:46 2022 -0700

    Set version to 1.9.2
```

## Changelog

This release contains the following features and improvements.

- **Introduce fixNFTokenNegOffer amendment.** This amendment fixes a bug in the Non-Fungible Tokens (NFTs) functionality provided by the NonFungibleTokensV1 amendment (not currently enabled on Mainnet). The bug allowed users to place offers to buy tokens for negative amounts of money when using Brokered Mode. Anyone who accepted such an offer would transfer the token _and_ pay money. This amendment explicitly disallows offers to buy or sell NFTs for negative amounts of money, and returns an appropriate error code. This also corrects the error code returned when placing offers to buy or sell NFTs for negative amounts in Direct Mode. ([8266d9d](https://github.com/XRPLF/rippled/commit/8266d9d598d19f05e1155956b30ca443c27e119e))
- **Introduce `NonFungibleTokensV1_1` amendment.** This amendment encompasses three NFT-related amendments: the original NonFungibleTokensV1 amendment (from version 1.9.0), the fixNFTokenDirV1 amendment (from version 1.9.1), and the new fixNFTokenNegOffer amendment from this release. This amendment contains no changes other than enabling those three amendments together; this allows validators to vote in favor of _only_ enabling the feature and fixes at the same time. ([59326bb](https://github.com/XRPLF/rippled/commit/59326bbbc552287e44b3a0d7b8afbb1ddddb3e3b))
- **Handle invalid port numbers.** If the user specifies a URL with an invalid port number, the server would silently attempt to use port 0 instead. Now it raises an error instead. This affects admin API methods and config file parameters for downloading history shards and specifying validator list sites. ([#4213](https://github.com/XRPLF/rippled/pull/4213))
- **Reduce log noisiness.** Decreased the severity of benign log messages in several places: "addPathsForType" messages during regular operation, expected errors during unit tests, and missing optional documentation components when compiling from source. ([#4178](https://github.com/XRPLF/rippled/pull/4178), [#4166](https://github.com/XRPLF/rippled/pull/4166), [#4180](https://github.com/XRPLF/rippled/pull/4180))
- **Fix race condition in history shard implementation and support clang's ThreadSafetyAnalysis tool.**  Added build settings so that developers can use this feature of the clang compiler to analyze the code for correctness, and fix an error found by this tool, which was the source of rare crashes in unit tests. ([#4188](https://github.com/XRPLF/rippled/pull/4188))
- **Prevent crash when rotating a database with missing data.** When rotating databases, a missing entry could cause the server to crash. While there should never be a missing database entry, this change keeps the server running by aborting database rotation. ([#4182](https://github.com/XRPLF/rippled/pull/4182))
- **Fix bitwise comparison in OfferCreate.** Fixed an expression that incorrectly used a bitwise comparison for two boolean values rather than a true boolean comparison. The outcome of the two comparisons is equivalent, so this is not a transaction processing change, but the bitwise comparison relied on compilers to implicitly fix the expression. ([#4183](https://github.com/XRPLF/rippled/pull/4183))
- **Disable cluster timer when not in a cluster.** Disabled a timer that was unused on servers not running in clustered mode. The functionality of clustered servers is unchanged. ([#4173](https://github.com/XRPLF/rippled/pull/4173))
- **Limit how often to process peer discovery messages.** In the peer-to-peer network, servers periodically share IP addresses of their peers with each other to facilitate peer discovery. It is not necessary to process these types of messages too often; previously, the code tracked whether it needed to process new messages of this type but always processed them anyway. With this change, the server no longer processes peer discovery messages if it has done so recently. ([#4202](https://github.com/XRPLF/rippled/pull/4202))
- **Improve STVector256 deserialization.** Optimized the processing of this data type in protocol messages. This data type is used in several types of ledger entry that are important for bookkeeping, including directory pages that track other ledger types, amendments tracking, and the ledger hashes history. ([#4204](https://github.com/XRPLF/rippled/pull/4204))
- **Fix and refactor spinlock code.** The spinlock code, which protects the `SHAMapInnerNode` child lists, had a mistake that allowed the same child to be repeatedly locked under some circumstances. Fixed this bug and improved the spinlock code to make it easier to use correctly and easier to verify that the code works correctly. ([#4201](https://github.com/XRPLF/rippled/pull/4201))
- **Improve comments and contributor documentation.** Various minor documentation changes including some to reflect the fact that the source code repository is now owned by the XRP Ledger Foundation. ([#4214](https://github.com/XRPLF/rippled/pull/4214), [#4179](https://github.com/XRPLF/rippled/pull/4179), [#4222](https://github.com/XRPLF/rippled/pull/4222))

## Contributions

### GitHub

The public source code repository for `rippled` is hosted on GitHub at <https://github.com/ripple/rippled>.

We welcome contributions, big and small, and invite everyone to join the community of XRP Ledger developers and help us build the Internet of Value.

### Credits

The following people contributed directly to this release:

- Chenna Keshava B S <ckbs.keshava56@gmail.com>
- Ed Hennis <ed@ripple.com>
- Ikko Ashimine <eltociear@gmail.com>
- Nik Bougalis <nikb@bougalis.net>
- Richard Holland <richard.holland@starstone.co.nz>
- Scott Schurr <scott@ripple.com>
- Scott Determan <scott.determan@yahoo.com>

For a real-time view of all lifetime contributors, including links to the commits made by each, please visit the "Contributors" section of the GitHub repository: <https://github.com/ripple/rippled/graphs/contributors>.
