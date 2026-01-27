---
category: 2026
date: "2026-01-22"
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
| [Clio Server Linux Debian Release (amd64)](https://github.com/XRPLF/clio/releases/download/2.7.0/clio_2.7.0_amd64.deb) |
| [Clio Server macOS Release (Apple Clang 17)](https://github.com/XRPLF/clio/releases/download/2.7.0/clio_server_macOS_Release_apple-clang.zip) |

For other platforms, please [build from source](https://github.com/XRPLF/clio/releases/tag/2.7.0). The most recent commit in the git log should be:

```text
Author: Ayaz Salikhov <mathbunnyru@users.noreply.github.com>
Date:   Thu Jan 15 19:03:47 2026 +0000

    ci: Restart colima on macOS (#2923)
```

## What's Changed

See the [Full Changelog on GitHub](https://github.com/XRPLF/clio/compare/2.6.0...2.7.0).

### Features

- Adds `account_mptoken_issuances` API method to retrieve all `MPTokenIssuances` created by a specified account, and `account_mptokens` API method to retrieve all `MPTokens` held by a specified account. ([#2680](https://github.com/XRPLF/clio/pull/2680))
- Adds DynamicMPT support to `account_mptoken_issuances` handler. ([#2820](https://github.com/XRPLF/clio/pull/2820))

### Improvements

- Removed old ETL implementation and enabled ETLng by default. ([#2752](https://github.com/XRPLF/clio/pull/2752))
- Added async framework `submit` method for running one-shot tasks that don't require a handle to retrieve the result. ([#2751](https://github.com/XRPLF/clio/pull/2751))
- Updated the Ledger Publisher to use async framework instead of directly using `io_context`. ([#2756](https://github.com/XRPLF/clio/pull/2756))
- Added support for normal/high priority to `WorkQueue`. ([#2721](https://github.com/XRPLF/clio/pull/2721))
- Added ability to read and write `LedgerCache` to file. ([#2761](https://github.com/XRPLF/clio/pull/2761))
- Added graceful shutdown for old web server. ([#2786](https://github.com/XRPLF/clio/pull/2786))
- Prometheus requests are now handled in `WorkQueue`. ([#2790](https://github.com/XRPLF/clio/pull/2790))
- Added observable value utility to enable reactive approach across the codebase. ([#2831](https://github.com/XRPLF/clio/pull/2831))
- Added option to save cache asynchronously. ([#2883](https://github.com/XRPLF/clio/pull/2883))
- Added basic support for channels. ([#2859](https://github.com/XRPLF/clio/pull/2859))
- Added build information to `clio_server --version` command. ([#2893](https://github.com/XRPLF/clio/pull/2893))

### Bug Fixes

- Fixed an issue where `account_info` was omitting the `signer_lists` field when requested for accounts with no signer lists. ([#2746](https://github.com/XRPLF/clio/pull/2746))
- Fixed an issue where `ledger_entry` error codes didn't match with `rippled`. ([#2549](https://github.com/XRPLF/clio/pull/2549))
- Enhanced cache saving error to include more information. ([#2794](https://github.com/XRPLF/clio/pull/2794))
- Fixed `WorkQueue` contention issues. ([#2866](https://github.com/XRPLF/clio/pull/2866))
- Fixed issue where failed asserts in tests produced no output. ([#2905](https://github.com/XRPLF/clio/pull/2905))
- Added workaround for an edge case exception in `AmendmentCenter`. ([#2897](https://github.com/XRPLF/clio/pull/2897))
- Fixed `WorkQueue` performance. ([#2887](https://github.com/XRPLF/clio/pull/2887))

### Refactor

- Refactored duplicate `ledger_index` pattern in RPC handlers into a common function. ([#2755](https://github.com/XRPLF/clio/pull/2755))
- Refactored `getLedgerIndex` to return `std::expected` instead of throwing exceptions. ([#2788](https://github.com/XRPLF/clio/pull/2788))
- Added writing command to `etl::SystemState`. ([#2842](https://github.com/XRPLF/clio/pull/2842))

### Documentation

- Removed `logging.md` from README. ([#2710](https://github.com/XRPLF/clio/pull/2710))
- Fixed `graceful_period` description. ([#2791](https://github.com/XRPLF/clio/pull/2791))

### Styling

- Fixed pre-commit style issues. ([#2743](https://github.com/XRPLF/clio/pull/2743))
- Fixed comment in `pre-commit-autoupdate.yml`. ([#2750](https://github.com/XRPLF/clio/pull/2750))
- Fixed hadolint issues. ([#2777](https://github.com/XRPLF/clio/pull/2777))
- Added black pre-commit hook. ([#2811](https://github.com/XRPLF/clio/pull/2811))
- Updated pre-commit hooks. ([#2825](https://github.com/XRPLF/clio/pull/2825), [#2875](https://github.com/XRPLF/clio/pull/2875))
- Used `shfmt` for shell scripts. ([#2841](https://github.com/XRPLF/clio/pull/2841))
- Fixed clang-tidy error. ([#2901](https://github.com/XRPLF/clio/pull/2901))

### Testing

- Fixed flaky `DeadlineIsHandledCorrectly` test. ([#2716](https://github.com/XRPLF/clio/pull/2716))
- Fixed flaky test. ([#2729](https://github.com/XRPLF/clio/pull/2729))

### Miscellaneous Tasks

- Pinned all GitHub actions. ([#2712](https://github.com/XRPLF/clio/pull/2712))
- Updated CI to use intermediate environment variables for improved security. ([#2713](https://github.com/XRPLF/clio/pull/2713))
- Updated CI to save full logs for failed sanitizer tests. ([#2715](https://github.com/XRPLF/clio/pull/2715))
- Enabled clang asan builds. ([#2717](https://github.com/XRPLF/clio/pull/2717))
- [DEPENDABOT] bump actions/upload-artifact from 4.6.2 to 5.0.0. ([#2722](https://github.com/XRPLF/clio/pull/2722))
- [DEPENDABOT] bump actions/upload-artifact from 4.6.2 to 5.0.0 in /.github/actions/code-coverage. ([#2725](https://github.com/XRPLF/clio/pull/2725))
- [DEPENDABOT] bump actions/download-artifact from 5.0.0 to 6.0.0. ([#2723](https://github.com/XRPLF/clio/pull/2723))
- Improved pre-commit failure message. ([#2720](https://github.com/XRPLF/clio/pull/2720))
- Updated CI to use XRPLF/get-nproc Github action. ([#2727](https://github.com/XRPLF/clio/pull/2727))
- [DEPENDABOT] bump actions/checkout from 4.3.0 to 5.0.0. ([#2724](https://github.com/XRPLF/clio/pull/2724))
- Added date to nightly release version. ([#2731](https://github.com/XRPLF/clio/pull/2731))
- Fixed nightly commits link. ([#2738](https://github.com/XRPLF/clio/pull/2738))
- Updated CI to use new prepare-runner. ([#2742](https://github.com/XRPLF/clio/pull/2742))
- Updated tooling in Docker images. ([#2737](https://github.com/XRPLF/clio/pull/2737))
- Installed pre-commit in the main CI image. ([#2744](https://github.com/XRPLF/clio/pull/2744))
- Updated docker images. ([#2745](https://github.com/XRPLF/clio/pull/2745))
- Added date to nightly release title. ([#2748](https://github.com/XRPLF/clio/pull/2748))
- Updated prepare-runner to fix `ccache` on macOS. ([#2749](https://github.com/XRPLF/clio/pull/2749))
- Removed backticks from release date. ([#2754](https://github.com/XRPLF/clio/pull/2754))
- Specified apple-clang 17.0 in Conan profile. ([#2757](https://github.com/XRPLF/clio/pull/2757))
- Fixed pre-commit hook failing on empty file. ([#2766](https://github.com/XRPLF/clio/pull/2766))
- [DEPENDABOT] bump docker/setup-qemu-action from 3.6.0 to 3.7.0 in /.github/actions/build-docker-image. ([#2763](https://github.com/XRPLF/clio/pull/2763))
- [DEPENDABOT] bump docker/metadata-action from 5.8.0 to 5.9.0 in /.github/actions/build-docker-image. ([#2762](https://github.com/XRPLF/clio/pull/2762))
- Changed default `max_queue_size` to 1000. ([#2771](https://github.com/XRPLF/clio/pull/2771))
- Specified bash as default shell in Github workflows. ([#2772](https://github.com/XRPLF/clio/pull/2772))
- Updated CI to use `ucontext` in ASAN builds. ([#2775](https://github.com/XRPLF/clio/pull/2775))
- Updated `xrpl` version to 3.0.0-rc1. ([#2776](https://github.com/XRPLF/clio/pull/2776))
- Forced usage of `ucontext` with ASAN. ([#2774](https://github.com/XRPLF/clio/pull/2774))
- Removed redundant silencing of ASAN errors in CI. ([#2779](https://github.com/XRPLF/clio/pull/2779))
- Updated CI to use environment variables instead of input. ([#2781](https://github.com/XRPLF/clio/pull/2781))
- Improved cache implementation. ([#2780](https://github.com/XRPLF/clio/pull/2780))
- Updated nudb recipe to remove linker warnings. ([#2787](https://github.com/XRPLF/clio/pull/2787))
- Updated CI to use environment variables instead of input in cache-key. ([#2789](https://github.com/XRPLF/clio/pull/2789))
- Added defines for asan/tsan to Conan profile. ([#2784](https://github.com/XRPLF/clio/pull/2784))
- Enabled TSAN in CI. ([#2785](https://github.com/XRPLF/clio/pull/2785))
- Updated CI to stop downloading `ccache` on develop branch. ([#2792](https://github.com/XRPLF/clio/pull/2792))
- Updated CI to always upload cache on develop. ([#2793](https://github.com/XRPLF/clio/pull/2793))
- [DEPENDABOT] bump peter-evans/create-pull-request from 7.0.8 to 7.0.9. ([#2805](https://github.com/XRPLF/clio/pull/2805))
- [DEPENDABOT] bump actions/checkout from 5.0.0 to 6.0.0. ([#2806](https://github.com/XRPLF/clio/pull/2806))
- Updated `spdlog` and `fmt` libraries. ([#2804](https://github.com/XRPLF/clio/pull/2804))
- Ran clang-tidy multiple times to ensure all issues were resolved. ([#2803](https://github.com/XRPLF/clio/pull/2803))
- Fixed Repeat-based tests TSAN issues. ([#2810](https://github.com/XRPLF/clio/pull/2810))
- Fixed `WebServerAdminTestsSuit` TSAN issues. ([#2809](https://github.com/XRPLF/clio/pull/2809))
- Used `boost::asio::ssl::stream` instead of `boost::beast::ssl_stream`. ([#2814](https://github.com/XRPLF/clio/pull/2814))
- Installed latest Ninja in images. ([#2813](https://github.com/XRPLF/clio/pull/2813))
- Updated images to use latest Ninja. ([#2817](https://github.com/XRPLF/clio/pull/2817))
- Updated lockfile. ([#2818](https://github.com/XRPLF/clio/pull/2818))
- Added mathbunnyru to maintainers. ([#2823](https://github.com/XRPLF/clio/pull/2823))
- Fixed TSAN async-signal-unsafe issue. ([#2824](https://github.com/XRPLF/clio/pull/2824))
- [DEPENDABOT] bump docker/metadata-action from 5.9.0 to 5.10.0 in /.github/actions/build-docker-image. ([#2826](https://github.com/XRPLF/clio/pull/2826))
- [DEPENDABOT] bump actions/checkout from 6.0.0 to 6.0.1. ([#2837](https://github.com/XRPLF/clio/pull/2837))
- [DEPENDABOT] bump peter-evans/create-pull-request from 7.0.9 to 7.0.11. ([#2836](https://github.com/XRPLF/clio/pull/2836))
- [DEPENDABOT] bump ytanikin/pr-conventional-commits from 1.4.2 to 1.5.1. ([#2835](https://github.com/XRPLF/clio/pull/2835))
- Reduced delay in ETL taskman. ([#2802](https://github.com/XRPLF/clio/pull/2802))
- Added systemd file to the Debian package. ([#2844](https://github.com/XRPLF/clio/pull/2844))
- Switched to `xrpl` version 3.0.0. ([#2843](https://github.com/XRPLF/clio/pull/2843))
- Added a Debian package to the Github release. ([#2850](https://github.com/XRPLF/clio/pull/2850))
- Added a script to regenerate the Conan lockfile. ([#2849](https://github.com/XRPLF/clio/pull/2849))
- [DEPENDABOT] bump tj-actions/changed-files from 46.0.5 to 47.0.1. ([#2853](https://github.com/XRPLF/clio/pull/2853))
- [DEPENDABOT] bump peter-evans/create-pull-request from 7.0.11 to 8.0.0. ([#2854](https://github.com/XRPLF/clio/pull/2854))
- [DEPENDABOT] bump actions/download-artifact from 6.0.0 to 7.0.0. ([#2855](https://github.com/XRPLF/clio/pull/2855))
- [DEPENDABOT] bump actions/upload-artifact from 5.0.0 to 6.0.0. ([#2856](https://github.com/XRPLF/clio/pull/2856))
- [DEPENDABOT] bump codecov/codecov-action from 5.5.1 to 5.5.2. ([#2857](https://github.com/XRPLF/clio/pull/2857))
- [DEPENDABOT] bump actions/upload-artifact from 5.0.0 to 6.0.0 in /.github/actions/code-coverage. ([#2858](https://github.com/XRPLF/clio/pull/2858))
- Updated shared Github actions. ([#2852](https://github.com/XRPLF/clio/pull/2852))
- Removed unnecessary creation of build directory in CI. ([#2867](https://github.com/XRPLF/clio/pull/2867))
- [DEPENDABOT] bump docker/setup-buildx-action from 3.11.1 to 3.12.0 in /.github/actions/build-docker-image. ([#2872](https://github.com/XRPLF/clio/pull/2872))
- [DEPENDABOT] bump docker/setup-buildx-action from 3.11.1 to 3.12.0. ([#2870](https://github.com/XRPLF/clio/pull/2870))
- [DEPENDABOT] bump actions/cache from 4.3.0 to 5.0.1. ([#2871](https://github.com/XRPLF/clio/pull/2871))
- Updated prepare-runner in Github actions and workflows. ([#2889](https://github.com/XRPLF/clio/pull/2889))
- Fixed branch name and commit SHA for GitHub PRs. ([#2888](https://github.com/XRPLF/clio/pull/2888))
- Updated CI to show `ccache` stats. ([#2902](https://github.com/XRPLF/clio/pull/2902))
- Changed build process to pass version explicitly instead of relying on tags. ([#2904](https://github.com/XRPLF/clio/pull/2904))
- Updated `gtest` and `spdlog`. ([#2908](https://github.com/XRPLF/clio/pull/2908))
- Updated tooling in Docker images. ([#2907](https://github.com/XRPLF/clio/pull/2907))
- Updated CI workflows to use new Docker images and GitHub actions. ([#2909](https://github.com/XRPLF/clio/pull/2909))
- Updated CI to use actual build date instead of date of last commit. ([#2911](https://github.com/XRPLF/clio/pull/2911))
- Updated CI to use environment variable for `BUILD_TYPE` in `reusable-build.yml`. ([#2913](https://github.com/XRPLF/clio/pull/2913))
- Changed build date format. ([#2914](https://github.com/XRPLF/clio/pull/2914))
- Updated CI to restart colima on macOS. ([#2923](https://github.com/XRPLF/clio/pull/2923))
- Reverted "refactor: Add writing command to etl::SystemState". ([#2860](https://github.com/XRPLF/clio/pull/2860))

## Contributors

The following people contributed directly to this release:

- [@godexsoft](https://github.com/godexsoft)
- [@mathbunnyru](https://github.com/mathbunnyru)
- [@kuznetsss](https://github.com/kuznetsss)
- [@yinyiqian1](https://github.com/yinyiqian1)
- [@emreariyurek](https://github.com/emreariyurek)
- [@PeterChen13579](https://github.com/PeterChen13579)
- [@bthomee](https://github.com/bthomee)

## Feedback

To report an issue or propose a new idea, please [open an issue](https://github.com/XRPLF/clio/issues).
