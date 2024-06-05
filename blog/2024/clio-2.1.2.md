---
category: 2024
date: 2024-06-05
labels:
    - Clio Release Notes
theme:
    markdown:
        editPage:
            hide: true
---

# Introducing Clio version 2.1.2

Version 2.1.2 of Clio, an XRP Ledger API server optimized for HTTP and WebSocket API calls, is now available. This release adds a new feature.

## rippled Dependency on Clio

Clio needs to be updated to 2.1.2 or later before updating to rippled 2.2.0.  Clio will be blocked if it is not updated first.

## Database Migration

If you are currently running Clio 1.0.4 or earlier and upgrading, you must perform a database migration to properly support NFT data. Instructions for the migration are described [here](https://github.com/XRPLF/clio/tree/clio_migrator%402.0.0).

## Install / Upgrade

| Package | SHA-256 |
|:--------|:--------|
| [Ubuntu Deb (x86_64)](https://github.com/XRPLF/clio/releases/download/2.1.2/clio_2.1.2_amd64.deb) | `3cc864837a2e194cb9dc68e0cdb617149ab466b4512614ec18879792fdb41571` |

For other platforms, please [build from source](https://github.com/XRPLF/clio/releases/tag/2.1.2). The most recent commit in the git log should be:

```text
commit c1037785a11d5079ab6b8a72f1585a0e9ff2810a
Author: Sergey Kuznetsov <skuznetsov@ripple.com>
Date:   Tue Jun 4 16:02:28 2024 +0100

    Upgrade xrpl to 2.2.0 (#1443)
```

## What's Changed

* Upgrade xrpl to 2.2.0 by @kuznetsss in https://github.com/XRPLF/clio/pull/1443

See the [Full Changelog on GitHub](https://github.com/XRPLF/clio/compare/2.1.1...2.1.2).

To report an issue, provide feedback, or propose a new idea, please [open an issue](https://github.com/XRPLF/clio/issues).
