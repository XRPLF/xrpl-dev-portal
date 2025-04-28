---
category: 2025
date: "2025-03-18"
template: '../../@theme/templates/blogpost'
seo:
    title: Introducing Clio version 2.4.0
    description: Version 2.4.0 of Clio, an XRP Ledger API server optimized for HTTP and WebSocket API calls, is now available. This release adds bug fixes.
labels:
    - Clio Release Notes
markdown:
    editPage:
        hide: true
---
# Introducing Clio version 2.4.0

Version 2.4.0 of Clio, an XRP Ledger API server optimized for HTTP and WebSocket API calls, is now available. This release adds bug fixes.

## Notable New Features

- [Refactor of Clio config and generation of config descriptions](https://github.com/XRPLF/clio/blob/develop/docs/configure-clio.md)
- [Snapshot exporting tool](https://github.com/XRPLF/clio/pull/1877)
- [Expose ledger cache full and disabled to prometheus](https://github.com/XRPLF/clio/pull/1957)

## Amendment Support

The following amendments have been introduced since Clio 2.3.1 and have transaction model changes. Clio 2.4.0 is built with `libxrpl` 2.4.0, which supports these amendments.

- [DynamicNFT](https://xrpl.org/resources/known-amendments#dynamicnft)
- [PermissionedDomains](https://xrpl.org/resources/known-amendments#permissioneddomains)
- [DeepFreeze](https://xrpl.org/resources/known-amendments#deepfreeze)
- [fixFrozenLPTokenTransfer](https://xrpl.org/resources/known-amendments#fixfrozenlptokentransfer)

If these amendments are enabled and you have not upgraded Clio to 2.4.0 or newer, the ETL will be amendment blocked and new ledgers will not be processed.

To check the current voting status of these amendments on Mainnet, see the [XRPL Amendments Dashboard](https://livenet.xrpl.org/amendments).

## What's Changed

See the [Full Changelog on GitHub](https://github.com/XRPLF/clio/compare/2.3.1...2.4.0).

### Features

- Add Conan profiles for common Sanitizers to docker ci image ([#1856](https://github.com/XRPLF/clio/pull/1856)) by [@godexsoft](https://github.com/godexsoft)
- ETLng task manager ([#1843](https://github.com/XRPLF/clio/pull/1843)) by [@godexsoft](https://github.com/godexsoft)
- Support Dynamic NFT ([#1525](https://github.com/XRPLF/clio/pull/1525)) by [@cindyyan317](https://github.com/cindyyan317)
- Permissioned domains ([#1841](https://github.com/XRPLF/clio/pull/1841)) by [@kuznetsss](https://github.com/kuznetsss)
- Run tests with sanitizers in CI ([#1879](https://github.com/XRPLF/clio/pull/1879)) by [@godexsoft](https://github.com/godexsoft)
- Generate config descriptions ([#1842](https://github.com/XRPLF/clio/pull/1842)) by [@PeterChen13579](https://github.com/PeterChen13579)
- Support Simulate ([#1891](https://github.com/XRPLF/clio/pull/1891)) by [@PeterChen13579](https://github.com/PeterChen13579)
- Snapshot exporting tool ([#1877](https://github.com/XRPLF/clio/pull/1877)) by [@cindyyan317](https://github.com/cindyyan317)
- ETLng monitor ([#1898](https://github.com/XRPLF/clio/pull/1898)) by [@godexsoft](https://github.com/godexsoft)
- LPT freeze ([#1840](https://github.com/XRPLF/clio/pull/1840)) by [@shawnxie999](https://github.com/shawnxie999)
- Add workflow to check config description ([#1894](https://github.com/XRPLF/clio/pull/1894)) by [@PeterChen13579](https://github.com/PeterChen13579)
- Add support for deep freeze ([#1875](https://github.com/XRPLF/clio/pull/1875)) by [@PeterChen13579](https://github.com/PeterChen13579)
- Implement and use LedgerCacheInterface ([#1955](https://github.com/XRPLF/clio/pull/1955)) by [@godexsoft](https://github.com/godexsoft)
- Expose ledger cache full and disabled to prometheus ([#1957](https://github.com/XRPLF/clio/pull/1957)) by [@kuznetsss](https://github.com/kuznetsss)

### Bug Fixes

- CacheLoader causes crash when no cache is used ([#1853](https://github.com/XRPLF/clio/pull/1853)) by [@kuznetsss](https://github.com/kuznetsss)
- Re-add account_tx max limit ([#1855](https://github.com/XRPLF/clio/pull/1855)) by [@godexsoft](https://github.com/godexsoft)
- Array parsing in new config ([#1884](https://github.com/XRPLF/clio/pull/1884)) by [@kuznetsss](https://github.com/kuznetsss)
- Array parsing in new config ([#1896](https://github.com/XRPLF/clio/pull/1896)) by [@kuznetsss](https://github.com/kuznetsss)
- Better errors on logger init failure ([#1857](https://github.com/XRPLF/clio/pull/1857)) by [@kuznetsss](https://github.com/kuznetsss)
- Fix backtrace usage ([#1932](https://github.com/XRPLF/clio/pull/1932)) by [@kuznetsss](https://github.com/kuznetsss)
- Data race in new webserver ([#1926](https://github.com/XRPLF/clio/pull/1926)) by [@kuznetsss](https://github.com/kuznetsss)
- Fix dangling reference in new web server ([#1938](https://github.com/XRPLF/clio/pull/1938)) by [@kuznetsss](https://github.com/kuznetsss)
- Change math/rand to crypto/rand ([#1941](https://github.com/XRPLF/clio/pull/1941)) by [@PeterChen13579](https://github.com/PeterChen13579)
- Improve error message when starting read only mode with empty DB ([#1946](https://github.com/XRPLF/clio/pull/1946)) by [@kuznetsss](https://github.com/kuznetsss)
- Fix url check in config ([#1953](https://github.com/XRPLF/clio/pull/1953)) by [@kuznetsss](https://github.com/kuznetsss)

### Refactor

- Use mutex from utils ([#1851](https://github.com/XRPLF/clio/pull/1851)) by [@kuznetsss](https://github.com/kuznetsss)
- Remove boost filesystem ([#1859](https://github.com/XRPLF/clio/pull/1859)) by [@PeterChen13579](https://github.com/PeterChen13579)

### Documentation

- Move metrics and static analysis docs ([#1864](https://github.com/XRPLF/clio/pull/1864)) by [@maria-robobug](https://github.com/maria-robobug)

### Styling

- Use error code instead of exception when parsing json ([#1942](https://github.com/XRPLF/clio/pull/1942)) by [@kuznetsss](https://github.com/kuznetsss)

### Testing

- Add non-admin test for simulate ([#1893](https://github.com/XRPLF/clio/pull/1893)) by [@PeterChen13579](https://github.com/PeterChen13579)
- Add assert mock to avoid death tests ([#1947](https://github.com/XRPLF/clio/pull/1947)) by [@kuznetsss](https://github.com/kuznetsss)

### Miscellaneous Tasks

- Fix issue found by clang-tidy ([#1849](https://github.com/XRPLF/clio/pull/1849)) by [@kuznetsss](https://github.com/kuznetsss)
- Fix error in grafana dashboard example ([#1878](https://github.com/XRPLF/clio/pull/1878)) by [@kuznetsss](https://github.com/kuznetsss)
- Revert workflow names ([#1890](https://github.com/XRPLF/clio/pull/1890)) by [@godexsoft](https://github.com/godexsoft)
- Upload cache only for develop branch ([#1897](https://github.com/XRPLF/clio/pull/1897)) by [@kuznetsss](https://github.com/kuznetsss)
- Use ubuntu latest for some ci jobs ([#1939](https://github.com/XRPLF/clio/pull/1939)) by [@kuznetsss](https://github.com/kuznetsss)
- Update libxrpl ([#1943](https://github.com/XRPLF/clio/pull/1943)) by [@PeterChen13579](https://github.com/PeterChen13579)
- Upgrade libxrpl to 2.4.0 ([#1961](https://github.com/XRPLF/clio/pull/1961)) by [@kuznetsss](https://github.com/kuznetsss)

## Install / Upgrade

| Package  |
| :------- |
| [Clio Server Linux Release (GCC)](https://github.com/XRPLF/clio/releases/download/2.4.0/clio_server_Linux_Release_gcc_2.4.0.zip) |
| [Clio Server macOS Release (Apple Clang 16)](https://github.com/XRPLF/clio/releases/download/2.4.0/clio_server_macOS_Release_apple_clang_16_2.4.0.zip) |

For other platforms, please [build from source](https://github.com/XRPLF/clio/releases/tag/2.4.0). The most recent commit in the git log should be:

```text
Merge: 5e7ff66b 67e451ec
Author: Sergey Kuznetsov <skuznetsov@ripple.com>
Date:   Thu Mar 13 17:02:52 2025 +0000

    chore: Commits for 2.4.0-rc2 (#1964)
```

## Feedback

To report an issue or propose a new idea, please [open an issue](https://github.com/XRPLF/clio/issues).
