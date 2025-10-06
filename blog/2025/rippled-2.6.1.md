---
category: 2025
date: "2025-10-06"
template: '../../@theme/templates/blogpost'
seo:
    title: Introducing XRP Ledger version 2.6.1
    description: rippled version 2.6.1 is now available. This version contains various bug fixes and minor improvements.
labels:
    - rippled Release Notes
markdown:
    editPage:
        hide: true
---
# Introducing XRP Ledger version 2.6.1

Version 2.6.1 of `rippled`, the reference server implementation of the XRP Ledger protocol, is now available. This release supersedes version 2.6.0, adding new features and bug fixes.


## Action Required

If you run an XRP Ledger server, upgrade to version 2.6.1 as soon as possible to ensure service continuity.


## Install / Upgrade

On supported platforms, see the [instructions on installing or updating `rippled`](../../docs/infrastructure/installation/index.md).

| Package | SHA-256 |
|:--------|:--------|
| [RPM for Red Hat / CentOS (x86-64)](https://repos.ripple.com/repos/rippled-rpm/stable/rippled-2.6.1-1.el9.x86_64.rpm) | `0fbbff570e962fea4df4d604cb848976fc9af9ebc34512a1002eb4866549850d` |
| [DEB for Ubuntu / Debian (x86-64)](https://repos.ripple.com/repos/rippled-deb/pool/stable/rippled_2.6.1-1_amd64.deb) | `de3bfdae5fb95d922a4b5bffa5bc9441f1bc4bac15bd7b83f77f14166c65bb7e` |

For other platforms, please [build from source](https://github.com/XRPLF/rippled/blob/master/BUILD.md). The most recent commit in the git log should be the change setting the version:

```text
commit 70d5c624e8cf732a362335642b2f5125ce4b43c1
Author: Ed Hennis <ed@ripple.com>
Date:   Tue Sep 30 16:09:11 2025 -0400

    Set version to 2.6.1
```


## Full Changelog

### Amendments

- **PermissionDelegation (XLS-75)** - A bug was discovered in `PermissionDelegation`, and the amendment was disabled. The fix for this feature will be included in a future release as `PermissionDelegationV1_1`. ([#5805](https://github.com/XRPLF/rippled/pull/5805))


### New Features

- Improved the `account_tx` method to show MPT-related transactions for an issuer. ([#5530](https://github.com/XRPLF/rippled/pull/5530))
- Added the `network_id` field to `validations` and `ledger` subscription streams. ([#5579](https://github.com/XRPLF/rippled/pull/5579))
- Added `nftoken_id`, `nftoken_ids`, and `offer_id` to the `meta` field of transaction streams from the `subscribe` method. ([#5230](https://github.com/XRPLF/rippled/pull/5230))


### Bug Fixes

- Fixed stalled consensus detection to prevent false positives in situations where there were no disputed transactions. ([#5627](https://github.com/XRPLF/rippled/pull/5627))
- Added the `allowTrustLineLocking` flag as an option for the `account_info` method. ([#5535](https://github.com/XRPLF/rippled/pull/5525))
- Removed the automatic creation of trust lines to the `Destination` account in `VaultWithdraw` transactions. ([#5572](https://github.com/XRPLF/rippled/pull/5572))
- Removed the deprecated `type` field from the `ledger` method. ([#4934](https://github.com/XRPLF/rippled/pull/4934))
- Fixed incorrect error and warning logs for AMM offer retrievals and IOU payment checks. ([#5686](https://github.com/XRPLF/rippled/pull/5686))
- Fixed a crash when trace-logging in tests. ([#5529](https://github.com/XRPLF/rippled/pull/5529))
- Removed circular includes in header files. ([#5544](https://github.com/XRPLF/rippled/pull/5544))
- Fixed Boost Library linking to be explicit. ([#5546](https://github.com/XRPLF/rippled/pull/5546))
- Silenced a dummy warning in GCC 12. ([#5554](https://github.com/XRPLF/rippled/pull/5554))
- Fixed an issue where the order of `PriceDataSeries` desynced between the time a `PriceOracle` was created and when it was updated. ([#5485](https://github.com/XRPLF/rippled/pull/5485))
- Fixed the logging logic to correctly report the specific reason (full or duplicate) for a rejected peer connection. ([#5664](https://github.com/XRPLF/rippled/pull/5664))
- Added `-Wno-deprecated-declarations` for Clang only. ([#5680](https://github.com/XRPLF/rippled/pull/5680))
- Fixed a crash due to a recurrent call to `Slot::deletePeer` when a peer is disconnected at just the wrong moment. ([#5635](https://github.com/XRPLF/rippled/pull/5635))
- Fixed a MacOS pipeline issue. ([#5585](https://github.com/XRPLF/rippled/pull/5585))


### Other Improvements

- Optimized hash performance. ([#5469](https://github.com/XRPLF/rippled/pull/5469))
- Removed release notes from the `rippled` codebase to facilitate more frequent releases. ([#5508](https://github.com/XRPLF/rippled/pull/5508))
- Removed the obsolete `OwnerPaysFee` amendment. It was never enabled. ([#5435](https://github.com/XRPLF/rippled/pull/5435), [#5550](https://github.com/XRPLF/rippled/pull/5550))
- Retired the `FlowCross` amendment. The functionality is now part of the core protocol unconditionally. ([#5562](https://github.com/XRPLF/rippled/pull/5562), [#5575](https://github.com/XRPLF/rippled/pull/5575))
- Added an `XRPL_ABANDON` macro for features that were never enabled or implemented. ([#5510](https://github.com/XRPLF/rippled/pull/5510))
- Switched some unit tests to doctests. ([#5383](https://github.com/XRPLF/rippled/pull/5383))
- Refactored `CredentialHelpers` and removed unnecessary dependencies. ([#5487](https://github.com/XRPLF/rippled/pull/5487))
- Fixed a compilation error with `clang-20`. ([#5543](https://github.com/XRPLF/rippled/pull/5543))
- Downgraded the required `CMake` version for `Antithesis` SDK. ([#5548](https://github.com/XRPLF/rippled/pull/5548))
- Removed unused headers. ([#5526](https://github.com/XRPLF/rippled/pull/5526))
- Updated the CI workflow to use Conan 2. ([#5556](https://github.com/XRPLF/rippled/pull/5556))
- Enabled unit tests regardless of an amendment's supported status. ([#5537](https://github.com/XRPLF/rippled/pull/5537))
- Updated several dependencies to their latest versions. ([#5567](https://github.com/XRPLF/rippled/pull/5567))
- Removed `include(default)` from the `libxrpl` profile. ([#5587](https://github.com/XRPLF/rippled/pull/5587))
- Refactored `rngfill` to reduce false warnings from GCC. ([#5563](https://github.com/XRPLF/rippled/pull/5563))
- Fixed the `clang-format` workflow. ([#5598](https://github.com/XRPLF/rippled/pull/5598))
- Refactored `HashRouter` flags to be type-safe. ([#5371](https://github.com/XRPLF/rippled/pull/5371))
- Renamed the `libxrpl` profile to `default`, making it more usable. ([#5599](https://github.com/XRPLF/rippled/pull/5599))
- Switched instrumentation workflow to use dependencies. ([#5607](https://github.com/XRPLF/rippled/pull/5607))
- Updated RocksDB to its latest version. ([#5568](https://github.com/XRPLF/rippled/pull/5568))
- Downgraded Boost to version 1.83.0. ([#5759](https://github.com/XRPLF/rippled/pull/5759))
- Removed old build options. ([#5581](https://github.com/XRPLF/rippled/pull/5581))
- Updated Conan dependencies to temporarily build from source. ([#5623](https://github.com/XRPLF/rippled/pull/5623))
- Added MacOS build instructions for specific versions of AppleClang. ([#5645](https://github.com/XRPLF/rippled/pull/5645))
- Decoupled `ledger` from `xrpld/app`, modularising the ledger component. ([#5492](https://github.com/XRPLF/rippled/pull/5492))
- Updated `BUILD.md` with instructions for Conan 2, Apple Clang 17, Clang 20, and CMake 4. ([#5478](https://github.com/XRPLF/rippled/pull/5478))
- Removed the patched Conan recipes from the `external` directory and updated instructions for obtaining patched recipes. ([#5643](https://github.com/XRPLF/rippled/pull/5643))
- Changed `develop` branch merge process to upload built Conan dependencies to the Conan remote. ([#5654](https://github.com/XRPLF/rippled/pull/5654))
- Switched Conan 1 commands to Conan 2 and fixed credentials. ([#5655](https://github.com/XRPLF/rippled/pull/5655))
- Cleaned up unused files from the `bin` directory. ([#5660](https://github.com/XRPLF/rippled/pull/5660))
- Updated `CONAN_REMOTE_URL` to also work with PRs from forks. ([#5662](https://github.com/XRPLF/rippled/pull/5662))
- Updated autolint behavior on all files. ([#5657](https://github.com/XRPLF/rippled/pull/5657))
- Updated test suite names to match the folder the test files are located. ([#5597](https://github.com/XRPLF/rippled/pull/5597))
- Updated `BUILD.md` for users who prefer to explicitly download recipes. ([#5676](https://github.com/XRPLF/rippled/pull/5676))
- Updated `.git-blame-ignore-revs` for [#5657](https://github.com/XRPLF/rippled/pull/5657). ([#5675](https://github.com/XRPLF/rippled/pull/5675))
- Updated the list of maintainers and common code reviewers. ([#5687](https://github.com/XRPLF/rippled/pull/5687))
- Reverted to `std::shared_mutex` from `boost::shared_mutex`. ([#5576](https://github.com/XRPLF/rippled/pull/5576))


## Credits

The following GitHub users contributed to this release:

- RippleX Engineering
- RippleX Docs
- RippleX Product
- @Afformativ
- @dangell7
- @hgandhi-perfx
- @tequdev


## Bug Bounties and Responsible Disclosures

We welcome reviews of the `rippled` code and urge researchers to responsibly disclose any issues they may find.

To report a bug, please send a detailed report to: <bugs@xrpl.org>