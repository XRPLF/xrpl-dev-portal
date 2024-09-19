---
category: 2024
date: 2024-07-22
seo:
    title: Introducing Clio version 2.2.2
    description: Version 2.2.2 of Clio, the XRP Ledger API server optimized for HTTP and WebSocket calls, is now available. Learn more about this update and bug fixes.
labels:
    - Clio Release Notes
theme:
    markdown:
        editPage:
            hide: true
---
# Introducing Clio version 2.2.2

Version 2.2.2 of Clio, an XRP Ledger API server optimized for HTTP and WebSocket API calls, is now available. This release adds bug fixes.

## Bug fixes

* Relax error when `full` or `accounts` set to `false` by @godexsoft in https://github.com/XRPLF/clio/issues/1537
* Add more account check by @cindyyan317 in https://github.com/XRPLF/clio/pull/1543

## Database Migration

If you are currently running Clio 1.0.4 or earlier and upgrading, you must perform a database migration to properly support NFT data. See the [`clio_migrator` branch](https://github.com/XRPLF/clio/tree/clio_migrator%402.0.0) and its README for instructions.

## Install / Upgrade

| Package | SHA-256 |
|:--------|:--------|
| [Ubuntu Deb (x86_64)](https://github.com/XRPLF/clio/releases/download/2.2.2/clio_2.2.2-1_amd64.deb) | `c18d6c8aefa20dbe74561dc01cd893ec7e9df93f68c0f4a5c7b5e279a37e4272` |

For other platforms, please [build from source](https://github.com/XRPLF/clio/releases/tag/2.2.2). The most recent commit in the git log should be:

```text
commit 665fab183a967bb886c68734544ec7e80bea4903
Author: cyan317 <120398799+cindyyan317@users.noreply.github.com>
Date:   Mon Jul 15 16:42:12 2024 +0100

    fix: Add more account check   (#1543)
    
    Make sure all char is alphanumeric for account
```

## What's Changed

See the [Full Changelog on GitHub](https://github.com/XRPLF/clio/compare/2.2.1...2.2.2)

## Feedback

The Clio open-source project is seeking feedback and engagement from the XRPL community.

- To provide feedback, please [fill out this survey](https://forms.gle/fnGPTUCAdmEzkFy57).
- To report an issue or propose a new idea, please [open an issue](https://github.com/XRPLF/clio/issues).
