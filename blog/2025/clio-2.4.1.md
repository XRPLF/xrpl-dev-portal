---
category: 2025
date: "2025-05-27"
template: '../../@theme/templates/blogpost'
seo:
    title: Introducing Clio version 2.4.1
    description: Version 2.4.1 of Clio, an XRP Ledger API server optimized for HTTP and WebSocket API calls, is now available. This release adds bug fixes.
labels:
    - Clio Release Notes
markdown:
    editPage:
        hide: true
---
# Introducing Clio version 2.4.1

Version 2.4.1 of Clio, an XRP Ledger API server optimized for HTTP and WebSocket API calls, is now available. This release adds bug fixes.

## What's Changed

See the [Full Changelog on GitHub](https://github.com/XRPLF/clio/compare/2.4.0...2.4.1).

### Features

- Experimental dosguard API weights ([#2082](https://github.com/XRPLF/clio/pull/2082)) by [@kuznetsss](https://github.com/kuznetsss)

- Forwarding metrics ([#2128](https://github.com/XRPLF/clio/pull/2128)) by [@kuznetsss](https://github.com/kuznetsss)

### Bug Fixes

- Fix ssl in new webserver ([#1981](https://github.com/XRPLF/clio/pull/1981)) by [@kuznetsss](https://github.com/kuznetsss)
- Incorrect set `HighDeepFreeze` flag ([#1978](https://github.com/XRPLF/clio/pull/1978)) by [@PeterChen13579](https://github.com/PeterChen13579)
- Fix incorrect requests logging ([#2005](https://github.com/XRPLF/clio/pull/2005)) by [@kuznetsss](https://github.com/kuznetsss)
- Guarantee async behavior of `WsBase::send` ([#2100](https://github.com/XRPLF/clio/pull/2100)) by [@godexsoft](https://github.com/godexsoft)

## Testing Credits

- Thanks to [@mounikakun](https://github.com/mounikakun) and others for testing this release.

## Install / Upgrade

| Package  |
| :------- |
| [Clio Server Linux Release (GCC)](https://github.com/XRPLF/clio/releases/download/2.4.1/clio_server_Linux_Release_gcc_2.4.1.zip) |
| [Clio Server macOS Release (Apple Clang 16)](https://github.com/XRPLF/clio/releases/download/2.4.1/clio_server_macOS_Release_apple_clang_16_2.4.1.zip) |

For other platforms, please [build from source](https://github.com/XRPLF/clio/releases/tag/2.4.1). The most recent commit in the git log should be:

```text
Merge: 317b3e23 8d76a05d
Author: Sergey Kuznetsov <skuznetsov@ripple.com>
Date:   Tue May 20 16:58:50 2025 +0100

    chore: Revert extra commits for 2.4.1 (#2133)
```

## Feedback

To report an issue or propose a new idea, please [open an issue](https://github.com/XRPLF/clio/issues).
