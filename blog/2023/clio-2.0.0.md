---
category: 2023
date: 2023-10-31
labels:
    - Clio Release Notes
theme:
    markdown:
        editPage:
            hide: true
---
# Introducing Clio version 2.0.0

Version 2.0.0 of Clio, an XRP Ledger API server optimized for HTTP and WebSocket API calls, is now available. This release adds new features, bug fixes, and amendment support.

## Amendment Support

Several amendments have been introduced since Clio 1.0.4 and have transaction model changes.  Clio 2.0.0 is built with `libxrpl` 1.12.0, which supports these amendments.

* [AMM](https://xrpl.org/known-amendments.html#amm)
    * Note: the `amm_info` API method is not yet supported and will be introduced in a later release
* [Clawback](https://xrpl.org/known-amendments.html#clawback)
* [XRPFees](https://xrpl.org/known-amendments.html#xrpfees)

If these amendments are enabled and you have not upgraded Clio to 2.0.0 or newer, the ETL will be amendment blocked and new ledgers will not be processed.

To check the current voting status of these amendments on Mainnet, see the [XRPScan Amendments Dashboard](https://xrpscan.com/amendments)


## Install / Upgrade

| Package | SHA-256 |
|:--------|:--------|
| [RPM for Red Hat / CentOS (x86-64)](https://github.com/XRPLF/clio/releases/download/2.0.0/clio-2.0.0-1.el7.x86_64.rpm) | `eae542dcee449b05fa821ff8fafa825e4932ac65bb12a452e578117a04c61466` |
| [Ubuntu Deb (x86_64)](https://github.com/XRPLF/clio/releases/download/2.0.0/clio_2.0.0-1_amd64.deb) | `a10edc9f849eb7fa325fa861d5148ba007033da47c7fe16e4c8c50c01ab17422` |

For other platforms, please [build from source](https://github.com/XRPLF/clio/releases/tag/2.0.0). The most recent commit in the git log should be:

```text
commit 7a1f902f421fae054599e1361b523923453342bd
Author: Alex Kremer <akremer@ripple.com>
Date:   Tue Oct 10 12:23:40 2023 +0100

    Fix http params handling discrepancy  (#913)

    Fixes #909
```

## Database Migration
If you are currently running Clio on a previous version and upgrading to 2.0.0, you must perform a database migration to properly support NFT data.  See the [Clio 2.0.0 migration instructions](https://github.com/XRPLF/clio/tree/clio_migrator%402.0.0) for details.

## What's Changed

See the [Full Changelog on GitHub](https://github.com/XRPLF/clio/compare/1.0.4...2.0.0).

To report an issue, provide feedback, or propose a new idea, please [open an issue](https://github.com/XRPLF/clio/issues).
