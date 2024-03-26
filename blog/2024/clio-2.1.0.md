---
category: 2024
date: 2024-02-14
labels:
    - Clio Release Notes
theme:
    markdown:
        editPage:
            hide: true
---

# Introducing Clio version 2.1.0

Version 2.1.0 of Clio, an XRP Ledger API server optimized for HTTP and WebSocket API calls, is now available. This release adds new features, bug fixes, and amendment support.

## Notable New Features

- [Prometheus metrics collection](https://github.com/XRPLF/clio?tab=readme-ov-file#prometheus-metrics-collection)
- [Admin password configuration for admin rights](https://github.com/XRPLF/clio?tab=readme-ov-file#admin-rights-for-requests)
- [New subscription manager](https://github.com/XRPLF/clio/pull/1071)
- [amm_info API](https://xrpl.org/amm_info.html#amm_info)
  - Version 2.0.0 of Clio supported [AMM](https://xrpl.org/known-amendments.html#amm) amendment transaction model changes but did not include this API
  - If the [AMM](https://xrpl.org/known-amendments.html#amm) amendment is enabled and you have not upgraded Clio to 2.1.0 or newer, this API would not be supported

## Amendment Support

The following amendments have been introduced since Clio 2.0.0 and have transaction model changes.  Clio 2.1.0 is built with `libxrpl` 2.0.0, which supports these amendments.

- [XChainBridge](https://xrpl.org/known-amendments.html#xchainbridge)
- [DID](https://xrpl.org/known-amendments.html#did)

If these amendments are enabled and you have not upgraded Clio to 2.1.0 or newer, the ETL will be amendment blocked and new ledgers will not be processed.

To check the current voting status of these amendments on Mainnet, see the [XRPScan Amendments Dashboard](https://xrpscan.com/amendments).

## Database Migration

If you are currently running Clio 1.0.4 or earlier and upgrading, you must perform a database migration to properly support NFT data. Instructions for the migration are described [here](https://github.com/XRPLF/clio/tree/clio_migrator%402.0.0).

## Install / Upgrade

| Package | SHA-256 |
|:--------|:--------|
| [Ubuntu Deb (x86_64)](https://github.com/XRPLF/clio/releases/download/2.1.0/clio_2.1.0-1_amd64.deb) | `7a145b6685f1126dcbb540142453f6d24fa4edb9d017f3083f159c1dcabf2691` |

For other platforms, please [build from source](https://github.com/XRPLF/clio/releases/tag/2.1.0). The most recent commit in the git log should be:

```text
commit 8575f786a8ba279a19a8dfb0b5b4641d3496bc63
Author: Sergey Kuznetsov <skuznetsov@ripple.com>
Date:   Wed Feb 7 15:57:50 2024 +0000

    Comment out macOS CI (#1164)
```

## What's Changed

See the [Full Changelog on GitHub](https://github.com/XRPLF/clio/compare/2.0.0...2.1.0).

To report an issue, provide feedback, or propose a new idea, please [open an issue](https://github.com/XRPLF/clio/issues).
