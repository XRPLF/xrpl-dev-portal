---
category: 2024
date: 2024-06-26
labels:
    - Clio Release Notes
theme:
    markdown:
        editPage:
            hide: true
---
# Introducing Clio version 2.2.0

Version 2.2.0 of Clio, an XRP Ledger API server optimized for HTTP and WebSocket API calls, is now available. This release adds new features and bug fixes.

## Notable New Features

* Price Oracle support, including `get_aggregate_price` API
* Forwarding the `feature` API method to `rippled` (A non-admin version of this method was added in `rippled` 2.2.0)
    * A Clio-native implementation of the `feature` API is planned for the future
* Improved doxygen documentation
* TLS 1.3 support
* C++23 compilers

## Amendment Support

The following amendments have been introduced since Clio 2.1.2 and have transaction model changes. Clio 2.2.0 is built with `libxrpl` 2.2.0, which supports these amendments.

* [PriceOracle](https://xrpl.org/known-amendments.html#priceoracle)

If these amendments are enabled and you have not upgraded Clio to 2.2.0 or newer, the ETL will be amendment blocked and new ledgers will not be processed.

To check the current voting status of these amendments on Mainnet, see the [XRPL Amendments Dashboard](https://livenet.xrpl.org/amendments).

## Database Migration

If you are currently running Clio 1.0.4 or earlier and upgrading, you must perform a database migration to properly support NFT data. See the [`clio_migrator` branch](https://github.com/XRPLF/clio/tree/clio_migrator%402.0.0) and its README for instructions.

## Install / Upgrade

| Package | SHA-256 |
|:--------|:--------|
| [Ubuntu Deb (x86_64)](https://github.com/XRPLF/clio/releases/download/2.2.0/clio_2.2.0-1_amd64.deb) | `e53ebc026b45962a35afea047068260567873c9508bd93a66c5180fb4645059a` |

For other platforms, please [build from source](https://github.com/XRPLF/clio/releases/tag/2.2.0). The most recent commit in the git log should be:

```text
commit 4940d463dc602c56b36bb1244186e07e11e6fde2
Author: cyan317 <120398799+cindyyan317@users.noreply.github.com>
Date:   Fri Jun 21 11:54:53 2024 +0100

    Fix empty currency (#1481)
```

## What's Changed

See the [Full Changelog on GitHub](https://github.com/XRPLF/clio/compare/2.1.2...2.2.0).

## Feedback

The Clio open-source project is seeking feedback and engagement from the XRPL community.

- To provide feedback, please [fill out this survey](https://forms.gle/fnGPTUCAdmEzkFy57).
- To report an issue or propose a new idea, please [open an issue](https://github.com/XRPLF/clio/issues).
