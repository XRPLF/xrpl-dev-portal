---
category: 2022
date: 2022-05-23
labels:
    - rippled Release Notes
theme:
    markdown:
        editPage:
            hide: true
---
# Introducing XRP Ledger version 1.9.1

Version 1.9.1 of `rippled`, the reference server implementation of the XRP Ledger protocol, is now available. This release includes several important fixes, including a fix for a syncing issue from 1.9.0, a new fix amendment to correct a bug in the new Non-Fungible Tokens (NFTs) code, and a new amendment to allow multi-signing by up to 32 signers.

<!-- BREAK -->


## Action Required

This release introduces two new amendments to the XRP Ledger protocol. These amendments are now open for voting according to the XRP Ledger's [amendment process](https://xrpl.org/amendments.html), which enables protocol changes following two weeks of >80% support from trusted validators.

If you operate an XRP Ledger server, then you should upgrade to version 1.9.1 within two weeks, to ensure service continuity. The exact time that protocol changes take effect depends on the voting decisions of the decentralized network.

The **fixNFTokenDirV1** amendment fixes a bug in code associated with the **NonFungibleTokensV1** amendment, so the fixNFTokenDirV1 amendment should be enabled first. All validator operators are encouraged to [configure amendment voting](https://xrpl.org/configure-amendment-voting.html) to oppose the NonFungibleTokensV1 amendment until _after_ the fixNFTokenDirV1 amendment has become enabled. For more information about NFTs on the XRP Ledger, see [NFT Conceptual Overview](https://xrpl.org/nft-conceptual-overview.html).

The **ExpandedSignerList** amendment extends the ledger's built-in multi-signing functionality so that each list can contain up to 32 entries instead of the current limit of 8. Additionally, this amendment allows each signer to have an arbitrary 256-bit data field associated with it. This data can be used to identify the signer or provide other metadata that is useful for organizations, smart contracts, or other purposes.

## Install / Upgrade

On supported platforms, see the [instructions on installing or updating `rippled`](https://xrpl.org/install-rippled.html).

| Package | SHA-256 |
|:--------|:--------|
| [RPM for Red Hat / CentOS (x86-64)](https://repos.ripple.com/repos/rippled-rpm/stable/rippled-1.9.1-1.el7.x86_64.rpm) | `c7885668f1cc47a86a12b73a37f1b060ed9cb08acb9d512804cbea23dd08ea2f` |
| [DEB for Ubuntu / Debian (x86-64)](https://repos.ripple.com/repos/rippled-deb/pool/stable/rippled_1.9.1-1_amd64.deb) | `5e233e89e61271d2a6c0a282d303a9726896c20d64886b22f698598982fe399b` |

For other platforms, please [build from source](https://github.com/ripple/rippled/tree/master/Builds). The most recent commit in the git log should be the change setting the version:

```text
commit e32bc674aa2a035ea0f05fe43d2f301b203f1827
Author: manojsdoshi <mdoshi@ripple.com>
Date:   Sun May 22 13:18:09 2022 -0700

    Set version to 1.9.1
```

## Changelog

This release contains the following features and improvements.

## New Features and Amendments

- **Introduce fixNFTokenDirV1 Amendment** - This amendment fixes an off-by-one error that occurred in some corner cases when determining which `NFTokenPage` an `NFToken` object belongs on. It also adjusts the constraints of `NFTokenPage` invariant checks, so that certain error cases fail with a suitable error code such as `tecNO_SUITABLE_TOKEN_PAGE` instead of failing with a `tecINVARIANT_FAILED` error code. ([#4155](https://github.com/ripple/rippled/pull/4155))

- **Introduce ExpandedSignerList Amendment** - This amendment expands the maximum signer list size to 32 entries and allows each signer to have an optional 256-bit `WalletLocator` field containing arbitrary data. ([#4097](https://github.com/ripple/rippled/pull/4097))

- **Pause online deletion rather than canceling it if the server fails health check** - The server stops performing online deletion of old ledger history if the server fails its internal health check during this time. Online deletion can now resume after the server recovers, rather than having to start over. ([#4139](https://github.com/ripple/rippled/pull/4139))


## Bug Fixes and Performance Improvements

- **Fix performance issues introduced in 1.9.0** - Readjusts some parameters of the ledger acquisition engine to revert some changes introduced in 1.9.0 that had adverse effects on some systems, including causing some systems to fail to sync to the network. ([#4152](https://github.com/ripple/rippled/pull/4152))

- **Improve Memory Efficiency of Path Finding** - Finding paths for cross-currency payments is a resource-intensive operation. While that remains true, this fix improves memory usage of pathfinding by discarding trust line results that cannot be used before those results are fully loaded or cached. ([#4111](https://github.com/ripple/rippled/pull/4111))

- **Fix incorrect CMake behavior on Windows when platform is unspecified or x64** - Fixes handling of platform selection when using the cmake-gui tool to build on Windows. The generator expects `Win64` but the GUI only provides `x64` as an option, which raises an error. This fix only raises an error if the platform is `Win32` instead, allowing the generation of solution files to succeed. ([#4150](https://github.com/ripple/rippled/pull/4150))

- **Fix test failures with newer MSVC compilers on Windows** - Fixes some cases where the API handler code used string pointer comparisons, which may not work correctly with some versions of the MSVC compiler. ([#4149](https://github.com/ripple/rippled/pull/4149))

- **Update minimum Boost version to 1.71.0** - This release is compatible with Boost library versions 1.71.0 through 1.77.0. The build configuration and documentation have been updated to reflect this. ([#4134](https://github.com/ripple/rippled/pull/4134))

- **Fix unit test failures for DatabaseDownloader** - Increases a timeout in the `DatabaseDownloader` code and adjusts unit tests so that the code does not return spurious failures, and more data is logged if it does fail. ([#4021](https://github.com/ripple/rippled/pull/4021))

- **Refactor relational database interface** - Improves code comments, naming, and organization of the module that interfaces with relational databases (such as the SQLite database used for tracking transaction history). ([#3965](https://github.com/ripple/rippled/pull/3965))


## Contributions

### GitHub

The public source code repository for `rippled` is hosted on GitHub at <https://github.com/ripple/rippled>.

We welcome contributions, big and small, and invite everyone to join the community of XRP Ledger developers and help us build the Internet of Value.


### Credits

The following people contributed directly to this release:

- Devon White <dwhite@ripple.com>
- Ed Hennis <ed@ripple.com>
- Gregory Popovitch <greg7mdp@gmail.com>
- Mark Travis <mtravis@ripple.com>
- Manoj Doshi <mdoshi@ripple.com>
- Nik Bougalis <nikb@bougalis.net>
- Richard Holland <richard.holland@starstone.co.nz>
- Scott Schurr <scott@ripple.com>

For a real-time view of all lifetime contributors, including links to the commits made by each, please visit the "Contributors" section of the GitHub repository: <https://github.com/ripple/rippled/graphs/contributors>.

We welcome external contributions and are excited to see the broader XRP Ledger community continue to grow and thrive.
