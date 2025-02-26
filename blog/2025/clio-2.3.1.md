---
category: 2025
date: 2025-02-12
seo:
    title: Introducing Clio version 2.3.1
    description: Version 2.3.1 of Clio, an XRP Ledger API server optimized for HTTP and WebSocket API calls, is now available. This release adds bug fixes.
labels:
    - Clio Release Notes
markdown:
    editPage:
        hide: true
---

## Introducing Clio version 2.3.1

Version 2.3.1 of Clio, an XRP Ledger API server optimized for HTTP and WebSocket API calls, is now available. This release adds bug fixes.

## Bug fixes

- Update `libxrpl` to 2.3.1 by @kuznetsss in [#1866](https://github.com/XRPLF/clio/pull/1866).
- Remove `InvalidHotWallet` error from `gateway_balances` RPC handler by @nkramer44 in [#1830](https://github.com/XRPLF/clio/pull/1830).
- Fix `gateway_balance` discrepancy by @cindyyan317 in [#1839](https://github.com/XRPLF/clio/pull/1839)

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

See the [Full Changelog on GitHub](https://github.com/XRPLF/clio/compare/2.3.0...2.3.1)

## Feedback

The Clio open-source project is seeking feedback and engagement from the XRPL community.

- To provide feedback, please [fill out this survey](https://forms.gle/fnGPTUCAdmEzkFy57).
- To report an issue or propose a new idea, please [open an issue](https://github.com/XRPLF/clio/issues).
