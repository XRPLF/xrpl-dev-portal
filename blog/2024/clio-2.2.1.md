---
category: 2024
date: 2024-07-08
labels:
    - Clio Release Notes
theme:
    markdown:
        editPage:
            hide: true
---
# Introducing Clio version 2.2.1

Version 2.2.1 of Clio, an XRP Ledger API server optimized for HTTP and WebSocket API calls, is now available. This release adds a bug fix.

## Bug fixes

* Fix extra bracket in warnings by @kuznetsss in https://github.com/XRPLF/clio/issues/1518

## Database Migration

If you are currently running Clio 1.0.4 or earlier and upgrading, you must perform a database migration to properly support NFT data. See the [`clio_migrator` branch](https://github.com/XRPLF/clio/tree/clio_migrator%402.0.0) and its README for instructions.

## Install / Upgrade

| Package | SHA-256 |
|:--------|:--------|
| [Ubuntu Deb (x86_64)](https://github.com/XRPLF/clio/releases/download/2.2.1/clio_2.2.1-1_amd64.deb) | `a027eb6cc0a6dcb5805a60501cdb34b3a9b364f9235c0d2152bc24112c729e7c` |

For other platforms, please [build from source](https://github.com/XRPLF/clio/releases/tag/2.2.1). The most recent commit in the git log should be:

```text
commit 7b18e28c4772f390368363c7d3c0a129ced3f3c3
Author: Sergey Kuznetsov <skuznetsov@ripple.com>
Date:   Fri Jul 5 12:03:22 2024 +0100

    fix: Fix extra brackets in warnings (#1519)
    
    Fixes #1518
```

## What's Changed

See the [Full Changelog on GitHub](https://github.com/XRPLF/clio/compare/2.2.0...2.2.1)

## Feedback

The Clio open-source project is seeking feedback and engagement from the XRPL community.

- To provide feedback, please [fill out this survey](https://forms.gle/fnGPTUCAdmEzkFy57).
- To report an issue or propose a new idea, please [open an issue](https://github.com/XRPLF/clio/issues).
