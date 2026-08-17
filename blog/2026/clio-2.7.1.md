---
category: 2026
date: "2026-07-20"
template: '../../@theme/templates/blogpost'
seo:
    title: Introducing Clio version 2.7.1
    description: Version 2.7.1 of Clio, an XRP Ledger API server optimized for HTTP and WebSocket API calls, is now available. This release adds support for the fixCleanup3_2_0 amendment and bug fixes.
labels:
    - Clio Release Notes
markdown:
    editPage:
        hide: true
---
# Introducing Clio version 2.7.1

Version 2.7.1 of Clio, an XRP Ledger API server optimized for HTTP and WebSocket API calls, is now available. This release updates Clio to `libxrpl` 3.2.0, adding support for the `fixCleanup3_2_0` amendment, and includes bug fixes.

## Amendment Support

The [fixCleanup3_2_0](https://xrpl.org/resources/known-amendments#fixcleanup3_2_0) amendment has been introduced since Clio 2.7.0 and has transaction model changes. Clio 2.7.1 is built with `libxrpl` 3.2.0, which supports this amendment.

If this amendment is enabled and you have not upgraded Clio to 2.7.1 or newer, the ETL will be amendment blocked and new ledgers will not be processed.

To check the current voting status of this amendment on Mainnet, see the [XRPL Amendments Dashboard](https://livenet.xrpl.org/amendments).

## Install / Upgrade

| Package  |
| :------- |
| [Clio Server Linux Release (GCC)](https://github.com/XRPLF/clio/releases/download/2.7.1/clio_server_Linux_Release_gcc.zip) |
| [Clio Server Linux Debian Release (amd64)](https://github.com/XRPLF/clio/releases/download/2.7.1/clio_2.7.1_amd64.deb) |
| [Clio Server macOS Release (Apple Clang 17)](https://github.com/XRPLF/clio/releases/download/2.7.1/clio_server_macOS_Release_apple-clang.zip) |

For other platforms, please [build from source](https://github.com/XRPLF/clio/releases/tag/2.7.1). The most recent commit in the git log should be:

```text
Author: Alex Kremer <akremer@ripple.com>
Date:   Wed Jul 8 12:12:40 2026 +0000

    ci: Pin scylladb docker to fix integration tests (#3140)
```

## What's Changed

See the [Full Changelog on GitHub](https://github.com/XRPLF/clio/compare/2.7.0...2.7.1).

### Bug Fixes

- Fixed an issue where client IP addresses weren't resolved correctly behind a proxy. ([#3103](https://github.com/XRPLF/clio/pull/3103))
- Fixed an issue where the SSL context was unnecessarily recreated for each connection instead of being created once and shared. ([#3138](https://github.com/XRPLF/clio/pull/3138))

### Miscellaneous Tasks

- Updated `libxrpl` to version 3.2.0. ([#3095](https://github.com/XRPLF/clio/pull/3095), [#3105](https://github.com/XRPLF/clio/pull/3105))
- Updated CI Ubuntu version to 22.04. ([#3090](https://github.com/XRPLF/clio/pull/3090))
- Fixed the Docker update CI workflow. ([#3092](https://github.com/XRPLF/clio/pull/3092))
- Updated Docker actions and fixed the LLVM repo. ([#3093](https://github.com/XRPLF/clio/pull/3093))
- Removed ARM builds from CI workflow. ([#3094](https://github.com/XRPLF/clio/pull/3094))
- Updated the Conan profile to use a specific `glibc` version. ([#3099](https://github.com/XRPLF/clio/pull/3099))
- Updated Docker images with the `glibc` version in Conan. ([#3100](https://github.com/XRPLF/clio/pull/3100))
- Pinned the ScyllaDB Docker image version to fix integration tests. ([#3140](https://github.com/XRPLF/clio/pull/3140))

## Contributors

The following people contributed directly to this release:

- [@kuznetsss](https://github.com/kuznetsss)
- [@godexsoft](https://github.com/godexsoft)

## Feedback

To report an issue or propose a new idea, please [open an issue](https://github.com/XRPLF/clio/issues).
