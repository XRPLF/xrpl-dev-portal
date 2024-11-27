---
category: 2024
date: 2024-11-25
seo:
    title: Introducing XRP Ledger version 2.3.0
    description: rippled version 2.3.0 is now available. This version introduces new features and stability fixes.
labels:
    - rippled Release Notes
markdown:
    editPage:
        hide: true
---
# Introducing XRP Ledger version 2.3.0

Version 2.3.0 of `rippled`, the reference server implementation of the XRP Ledger protocol, is now available. This release includes 8 new amendments, including Multi-Purpose Tokens (MPTs), Credentials, Clawback support for AMMs, and the ability to make offers as part of minting NFTs. Additionally, this release includes important fixes for stability, so server operators are encouraged to upgrade as soon as possible.


## Action Required

If you run an XRP Ledger server, upgrade to version 2.3.0 as soon as possible to ensure service continuity.

Additionally, new amendments are now open for voting according to the XRP Ledger's [amendment process](../../docs/concepts/networks-and-servers/amendments.md), which enables protocol changes following two weeks of >80% support from trusted validators. The exact time that protocol changes take effect depends on the voting decisions of the decentralized network.

## Install / Upgrade

On supported platforms, see the [instructions on installing or updating `rippled`](../../docs/infrastructure/installation/index.md).

| Package | SHA-256 |
|:--------|:--------|
| [RPM for Red Hat / CentOS (x86-64)](https://repos.ripple.com/repos/rippled-rpm/stable/rippled-2.3.0-1.el7.x86_64.rpm) | `fb74f401e5ba121bbc37e6188aa064488ad78ffef549a1e19bc8b71316d08031` |
| [DEB for Ubuntu / Debian (x86-64)](https://repos.ripple.com/repos/rippled-deb/pool/stable/rippled_2.3.0-1_amd64.deb) | `5d616d53218b47a2f0803c1d37d410f72d19b57cdb9cabdf77b1cf0134cce3ca` |
| [Portable Builds (Linux x86-64)](https://github.com/XRPLF/rippled-portable-builds) | (Use signature verification) |

{% admonition type="info" name="Note" %}
The packages in the stable repository were accidentally overwritten with a slightly different build from the same source code. This post has been updated with the new package hashes based on the packages currently available in the stable branch of each repository. The previous package hashes, below, are also acceptable, and represent the same release:

| Package | SHA-256 |
|:--------|:--------|
| RPM for Red Hat / CentOS (x86-64) | `980547fc8eea56e4010f294305166df00f8962219e91493c4f687e9eed67d47a` |
| DEB for Ubuntu / Debian (x86-64) | `c773c9e33cb0e661cc8805bd55bf1e28b36c399107a562bae1d2291515ef9838` |
{% /admonition %}

For other platforms, please [build from source](https://github.com/XRPLF/rippled/blob/master/BUILD.md). The most recent commit in the git log should be the change setting the version:

```text
commit f64cf9187affd69650907d0d92e097eb29693945
Author: Elliot Lee <github.public@intelliot.com>
Date:   Mon Nov 25 12:27:17 2024 -0800

    Set version to 2.3.0
```


## Full Changelog

### Amendments

The following amendments are open for voting with this release:

- **XLS-70 Credentials** - Introduces the ability to issue Credentials on the ledger and use these Credentials to pre-approve incoming payments when using Deposit Authorization instead of individually approving payers. ([#5103](https://github.com/XRPLF/rippled/pull/5103))
    - related fix: #5189 (https://github.com/XRPLF/rippled/pull/5189)
- **XLS-33 Multi-Purpose Tokens** - Introduces a new type of fungible token optimized for institutional DeFi including stablecoins. ([#5143](https://github.com/XRPLF/rippled/pull/5143))
- **XLS-37 AMM Clawback** - Allows clawback-enabled tokens to be used in AMMs, with appropriate guardrails. ([#5142](https://github.com/XRPLF/rippled/pull/5142))
- **XLS-52 NFTokenMintOffer** - Allows creating an NFT sell offer as part of minting a new NFT. ([#4845](https://github.com/XRPLF/rippled/pull/4845))
- **fixAMMv1_2** - Fixes two bugs in Automated Market Maker (AMM) transaction processing. ([#5176](https://github.com/XRPLF/rippled/pull/5176))
- **fixNFTokenPageLinks** - Fixes a bug that can cause NFT directories to have missing links, and introduces a transaction to repair corrupted ledger state. ([#4945](https://github.com/XRPLF/rippled/pull/4945))
- **fixEnforceNFTokenTrustline** - Fixes two bugs in the interaction between NFT offers and trust lines. ([#4946](https://github.com/XRPLF/rippled/pull/4946))
- **fixInnerObjTemplate2** - Standardizes the way inner objects are enforced across all transaction and ledger data. ([#5047](https://github.com/XRPLF/rippled/pull/5047))

The following amendment is partially implemented but not open for voting:

- **InvariantsV1_1** - Adds new invariants to ensure transactions process as intended, starting with an invariant to ensure that ledger entries owned by an account are deleted when the account is deleted. ([#4663](https://github.com/XRPLF/rippled/pull/4663))

### New Features

- Allow configuration of SQLite database page size. ([#5135](https://github.com/XRPLF/rippled/pull/5135), [#5140](https://github.com/XRPLF/rippled/pull/5140))
- In the `libxrpl` C++ library, provide a list of known amendments. ([#5026](https://github.com/XRPLF/rippled/pull/5026)) 

### Deprecations

- History Shards are removed. ([#5066](https://github.com/XRPLF/rippled/pull/5066))
- Reporting mode is removed. ([#5092](https://github.com/XRPLF/rippled/pull/5092))

If you want to store more ledger history, it is recommended that you run a [Clio server](../../docs/concepts/networks-and-servers/the-clio-server.md) instead.

### Bug fixes

- Fix a crash in debug builds when amm_info request contains an invalid AMM account ID. ([#5188](https://github.com/XRPLF/rippled/pull/5188))
- Fix a crash caused by a race condition in peer-to-peer code. ([#5071](https://github.com/XRPLF/rippled/pull/5071))
- Fix several bugs in the book_changes API method. ([#5096](https://github.com/XRPLF/rippled/pull/5096))
- Fix bug triggered by providing an invalid marker to the account_nfts API method. ([#5045](https://github.com/XRPLF/rippled/pull/5045))
- Accept lower-case hexadecimal in compact transaction identifier (CTID) parameters in API methods. ([#5049](https://github.com/XRPLF/rippled/pull/5049))
- Disallow filtering by types that an account can't own in the account_objects API method. ([#5056](https://github.com/XRPLF/rippled/pull/5056))
- Fix error code returned by the feature API method when providing an invalid parameter. ([#5063](https://github.com/XRPLF/rippled/pull/5063))
- (API v3) Fix error code returned by amm_info when providing invalid parameters. ([#4924](https://github.com/XRPLF/rippled/pull/4924))

### Other Improvements

- Adds a new default hub, hubs.xrpkuwait.com, to the config file and bootstrapping code. ([#5169](https://github.com/XRPLF/rippled/pull/5169))
- Improve error message when commandline interface fails with `rpcInternal` because there was no response from the server. ([#4959](https://github.com/XRPLF/rippled/pull/4959))
- Add tools for debugging specific transactions via replay. ([#5027](https://github.com/XRPLF/rippled/pull/5027), [#5087](https://github.com/XRPLF/rippled/pull/5087))
- Major reorganization of source code files. ([#4997](https://github.com/XRPLF/rippled/pull/4997))
- Add new unit tests. ([#4886](https://github.com/XRPLF/rippled/pull/4886))
- Various improvements to build tools and contributor documentation. ([#5001](https://github.com/XRPLF/rippled/pull/5001), [#5028](https://github.com/XRPLF/rippled/pull/5028), [#5052](https://github.com/XRPLF/rippled/pull/5052), [#5091](https://github.com/XRPLF/rippled/pull/5091), [#5084](https://github.com/XRPLF/rippled/pull/5084), [#5120](https://github.com/XRPLF/rippled/pull/5120), [#5010](https://github.com/XRPLF/rippled/pull/5010). [#5055](https://github.com/XRPLF/rippled/pull/5055), [#5067](https://github.com/XRPLF/rippled/pull/5067), [#5061](https://github.com/XRPLF/rippled/pull/5061), [#5072](https://github.com/XRPLF/rippled/pull/5072), [#5044](https://github.com/XRPLF/rippled/pull/5044) )
- Various code cleanup and refactoring. ([#4509](https://github.com/XRPLF/rippled/pull/4509), [#4521](https://github.com/XRPLF/rippled/pull/4521), [#4856](https://github.com/XRPLF/rippled/pull/4856), [#5190](https://github.com/XRPLF/rippled/pull/5190), [#5081](https://github.com/XRPLF/rippled/pull/5081), [#5053](https://github.com/XRPLF/rippled/pull/5053), [#5058](https://github.com/XRPLF/rippled/pull/5058), [#5122](https://github.com/XRPLF/rippled/pull/5122), [#5059](https://github.com/XRPLF/rippled/pull/5059), [#5041](https://github.com/XRPLF/rippled/pull/5041))
