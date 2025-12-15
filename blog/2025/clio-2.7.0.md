---
category: 2025
date: "2025-12-15"
template: '../../@theme/templates/blogpost'
seo:
    title: Introducing Clio version 2.7.0
    description: Version 2.7.0 of Clio, an XRP Ledger API server optimized for HTTP and WebSocket API calls, is now available. This release adds new features and bug fixes.
labels:
    - Clio Release Notes
markdown:
    editPage:
        hide: true
---
# Introducing Clio version 2.7.0

Version 2.7.0 of Clio, an XRP Ledger API server optimized for HTTP and WebSocket API calls, is now available. This release adds new features and bug fixes.

## Install / Upgrade

| Package  |
| :------- |
| [Clio Server Linux Release (GCC)](https://github.com/XRPLF/clio/releases/download/2.7.0/clio_server_Linux_Release_gcc.zip) |
| [Clio Server macOS Release (Apple Clang 17)](https://github.com/XRPLF/clio/releases/download/2.7.0/clio_server_macOS_Release_apple-clang.zip) |

For other platforms, please [build from source](https://github.com/XRPLF/clio/releases/tag/2.7.0). The most recent commit in the git log should be:

```text
TBD
```

## What's Changed

See the [Full Changelog on GitHub](https://github.com/XRPLF/clio/compare/2.6.0...2.7.0).

### Features

- Adds `account_mptoken_issuances` API method to retrieve all `MPTokenIssuances` created by a specified account, and `account_mptokens` API method to retrieve all `MPTokens` held by a specified account ([#2680](https://github.com/XRPLF/clio/pull/2680)).
- Enables new ETL (ETLng) by default and removes old ETL implementation ([#2752](https://github.com/XRPLF/clio/pull/2752)).
- Adds DynamicMPT support to `account_mptoken_issuances` handler ([#2820](https://github.com/XRPLF/clio/pull/2820)).

### Improvements

- Added async framework `submit` method for running one-shot tasks on strand/context without requiring a handle to retrieve results ([#2751](https://github.com/XRPLF/clio/pull/2751)).
- Updated the Ledger Publisher to use async framework instead of directly using `io_context` ([#2756](https://github.com/XRPLF/clio/pull/2756)).
- Added normal/high priority support to `WorkQueue` ([#2721](https://github.com/XRPLF/clio/pull/2721)).
- Added ability to read and write `LedgerCache` to file ([#2761](https://github.com/XRPLF/clio/pull/2761)).
- Added graceful shutdown for old web server ([#2786](https://github.com/XRPLF/clio/pull/2786)).
- Prometheus requests are now handled in `WorkQueue` ([#2790](https://github.com/XRPLF/clio/pull/2790)).
- Added observable value utility to enable reactive approach across the codebase ([#2831](https://github.com/XRPLF/clio/pull/2831)).

### Bug Fixes

- Fixed an issue where `account_info` was omitting the `signer_lists` field when requested for accounts with no signer lists. An empty array is now returned. ([#2746](https://github.com/XRPLF/clio/pull/2746)).
- Matched `ledger_entry` error codes with `rippled` ([#2549](https://github.com/XRPLF/clio/pull/2549)).
- Enhanced cache saving error to include more information ([#2794](https://github.com/XRPLF/clio/pull/2794)).

### Refactor

- Refactored duplicate `ledger_index` pattern in RPC handlers into a common function ([#2755](https://github.com/XRPLF/clio/pull/2755)).
- Refactored `getLedgerIndex` to return `std::expected` instead of throwing exceptions ([#2788](https://github.com/XRPLF/clio/pull/2788)).

### Documentation

- Removed `logging.md` from README ([#2710](https://github.com/XRPLF/clio/pull/2710)).
- Fixed `graceful_period` description ([#2791](https://github.com/XRPLF/clio/pull/2791)).

### Styling

- Fixed pre-commit style issues ([#2743](https://github.com/XRPLF/clio/pull/2743)).
- Fixed comment in `pre-commit-autoupdate.yml` ([#2750](https://github.com/XRPLF/clio/pull/2750)).
- Fixed hadolint issues ([#2777](https://github.com/XRPLF/clio/pull/2777)).
- Added black pre-commit hook ([#2811](https://github.com/XRPLF/clio/pull/2811)).
- Updated pre-commit hooks ([#2825](https://github.com/XRPLF/clio/pull/2825)).
- Used shfmt for shell scripts ([#2841](https://github.com/XRPLF/clio/pull/2841)).

### Testing

- Fixed flaky `DeadlineIsHandledCorrectly` test ([#2716](https://github.com/XRPLF/clio/pull/2716)).
- Fixed flaky test ([#2729](https://github.com/XRPLF/clio/pull/2729)).

### Miscellaneous Tasks

- Pinned all GitHub actions ([#2712](https://github.com/XRPLF/clio/pull/2712)).
- Used intermediate environment variables for improved security ([#2713](https://github.com/XRPLF/clio/pull/2713)).
- Saved full logs for failed sanitized tests ([#2715](https://github.com/XRPLF/clio/pull/2715)).
- Enabled clang asan builds ([#2717](https://github.com/XRPLF/clio/pull/2717)).
- Improved pre-commit failure message ([#2720](https://github.com/XRPLF/clio/pull/2720)).
- Used XRPLF/get-nproc ([#2727](https://github.com/XRPLF/clio/pull/2727)).
- Released nightly with date ([#2731](https://github.com/XRPLF/clio/pull/2731)).
- Fixed nightly commits link ([#2738](https://github.com/XRPLF/clio/pull/2738)).
- Used new prepare-runner ([#2742](https://github.com/XRPLF/clio/pull/2742)).
- Updated tooling in Docker images ([#2737](https://github.com/XRPLF/clio/pull/2737)).
- Installed pre-commit in the main CI image as well ([#2744](https://github.com/XRPLF/clio/pull/2744)).
- Updated docker images ([#2745](https://github.com/XRPLF/clio/pull/2745)).
- Added date to nightly release title ([#2748](https://github.com/XRPLF/clio/pull/2748)).
- Updated prepare-runner to fix ccache on macOS ([#2749](https://github.com/XRPLF/clio/pull/2749)).
- Removed backticks from release date ([#2754](https://github.com/XRPLF/clio/pull/2754)).
- Specified apple-clang 17.0 in conan profile ([#2757](https://github.com/XRPLF/clio/pull/2757)).
- Fixed pre commit hook failing on empty file ([#2766](https://github.com/XRPLF/clio/pull/2766)).
- Changed default `max_queue_size` to 1000 ([#2771](https://github.com/XRPLF/clio/pull/2771)).
- Specified bash as default shell in workflows ([#2772](https://github.com/XRPLF/clio/pull/2772)).
- Forced ucontext in ASAN builds ([#2775](https://github.com/XRPLF/clio/pull/2775)).
- Started using xrpl/3.0.0-rc1 ([#2776](https://github.com/XRPLF/clio/pull/2776)).
- Used ucontext with ASAN ([#2774](https://github.com/XRPLF/clio/pull/2774)).
- Removed redundant silencing of ASAN errors in CI ([#2779](https://github.com/XRPLF/clio/pull/2779)).
- Used env vars instead of input ([#2781](https://github.com/XRPLF/clio/pull/2781)).
- Improved cache implementation ([#2780](https://github.com/XRPLF/clio/pull/2780)).
- Updated nudb recipe to remove linker warnings ([#2787](https://github.com/XRPLF/clio/pull/2787)).
- Used env vars instead of input in cache-key ([#2789](https://github.com/XRPLF/clio/pull/2789)).
- Added defines for asan/tsan to conan profile ([#2784](https://github.com/XRPLF/clio/pull/2784)).
- Enabled TSAN in CI ([#2785](https://github.com/XRPLF/clio/pull/2785)).
- Stopped downloading ccache on develop branch ([#2792](https://github.com/XRPLF/clio/pull/2792)).
- Always uploaded cache on develop ([#2793](https://github.com/XRPLF/clio/pull/2793)).
- Updated spdlog and fmt libraries ([#2804](https://github.com/XRPLF/clio/pull/2804)).
- Ran clang-tidy 3 times to make sure we don't have to fix again ([#2803](https://github.com/XRPLF/clio/pull/2803)).
- Fixed repeat-based tests TSAN issues ([#2810](https://github.com/XRPLF/clio/pull/2810)).
- Fixed WebServerAdminTestsSuit TSAN issues ([#2809](https://github.com/XRPLF/clio/pull/2809)).
- Used boost::asio::ssl::stream instead of boost::beast::ssl_stream ([#2814](https://github.com/XRPLF/clio/pull/2814)).
- Installed latest Ninja in images ([#2813](https://github.com/XRPLF/clio/pull/2813)).
- Updated images to use latest Ninja ([#2817](https://github.com/XRPLF/clio/pull/2817)).
- Updated lockfile ([#2818](https://github.com/XRPLF/clio/pull/2818)).
- Added mathbunnyru to maintainers ([#2823](https://github.com/XRPLF/clio/pull/2823)).
- Fixed TSAN async-signal-unsafe issue ([#2824](https://github.com/XRPLF/clio/pull/2824)).
- Reduced delay in ETL taskman ([#2802](https://github.com/XRPLF/clio/pull/2802)).
- Added systemd file to the debian package ([#2844](https://github.com/XRPLF/clio/pull/2844)).
- Switched to xrpl/3.0.0 ([#2843](https://github.com/XRPLF/clio/pull/2843)).
- Multiple Dependabot updates for GitHub actions and Docker components.

## Contributors

The following people contributed directly to this release:

- [@godexsoft](https://github.com/godexsoft)
- [@mathbunnyru](https://github.com/mathbunnyru)
- [@kuznetsss](https://github.com/kuznetsss)
- [@yinyiqian1](https://github.com/yinyiqian1)
- [@emreariyurek](https://github.com/emreariyurek)
- [@PeterChen13579](https://github.com/PeterChen13579)

## Feedback

To report an issue or propose a new idea, please [open an issue](https://github.com/XRPLF/clio/issues).
