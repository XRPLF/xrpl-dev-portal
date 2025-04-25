---
category: 2025
date: "2025-02-12"
template: '../../@theme/templates/blogpost'
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

| Package  |
| :------- |
| [Clio Server Linux Release (GCC)](https://github.com/XRPLF/clio/releases/download/2.3.1/clio_server_Linux_Release_gcc.zip) |
| [Clio Server macOS Release (Apple Clang 15)](https://github.com/XRPLF/clio/releases/download/2.3.1/clio_server_macOS_Release_apple_clang_15.zip) |

For other platforms, please [build from source](https://github.com/XRPLF/clio/releases/tag/2.3.1). The most recent commit in the git log should be:

```text
Merge: 47c0a6a2 8a418bfe
Author: Sergey Kuznetsov <skuznetsov@ripple.com>
Date:   Tue Feb 4 17:10:12 2025 +0000

    fix: gateway_balance discrepancy  (#1839) (#1874)

    Port of #1839 into 2.3.1.
    Fixes #1832.

    rippled code:


    https://github.com/XRPLF/rippled/blob/develop/src/xrpld/rpc/handlers/GatewayBalances.cpp#L129
```

## What's Changed

See the [Full Changelog on GitHub](https://github.com/XRPLF/clio/compare/2.3.0...2.3.1).

## Feedback

The Clio open-source project is seeking feedback and engagement from the XRPL community.

- To provide feedback, please [fill out this survey](https://forms.gle/fnGPTUCAdmEzkFy57).
- To report an issue or propose a new idea, please [open an issue](https://github.com/XRPLF/clio/issues).
