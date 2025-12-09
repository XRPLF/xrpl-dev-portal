---
category: 2025
date: "2025-12-08"
template: '../../@theme/templates/blogpost'
seo:
    title: Introducing XRP Ledger version 3.0.0
    description: rippled version 3.0.0 is now available. This version introduces new amendments and bug fixes.
labels:
    - rippled Release Notes
markdown:
    editPage:
        hide: true
---
# Introducing XRP Ledger version 3.0.0

Version 3.0.0 of `rippled`, the reference server implementation of the XRP Ledger protocol, is now available. This release introduces new amendments and bug fixes.


## Action Required

If you run an XRP Ledger server, upgrade to version 3.0.0 as soon as possible to ensure service continuity.


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

- **fixTokenEscrowV1**: Fixes an accounting error in MPT escrows. Specifically, when an escrow unlocks MPTs that have a transfer fee, the system incorrectly reduces the MPT issuer's locked token balance by the gross amount (without fees) rather than the net amount (with fees). This leads to discrepancies in the token's total supply accounting. ([#5571](https://github.com/XRPLF/rippled/pull/5571))
- **fixIncludeKeyletFields**: Adds missing keylet fields to these ledger entries:
    - `Sequence` to `Escrow` and `PayChannel`.
    - `Owner` to `SignerList`.
    - `OracleDocumentID` to `Oracle`. ([#5646](https://github.com/XRPLF/rippled/pull/5646))
- **fixPriceOracleOrder**: Fixes an issue where the order of asset pair data is different from when a price oracle is created versus when it is updated. ([#5485](https://github.com/XRPLF/rippled/pull/5485))
- **fixAMMClawbackRounding**: Fixes a rounding error that can occur in the `LPTokenBalance` of an AMM when performing an `AMMClawback` transaction. ([#5750](https://github.com/XRPLF/rippled/pull/5750))
- **fixMPTDeliveredAmount**: This amendment adds missing `DeliveredAmount` and `delivered_amount` metadata fields from direct MPT `Payment` transactions. ([#5569](https://github.com/XRPLF/rippled/pull/5569))


### Features

- Added `delivered_amount`, `nftoken_id`, `nftoken_ids`, `offer_id`, and `mpt_issuance_id` metadata fields to the `simulate` API method. ([#5754](https://github.com/XRPLF/rippled/pull/5754))
- Added `STInt32` as a new `SType` to support negative 32-bit integer fields. ([#5788](https://github.com/XRPLF/rippled/pull/5788))


### Breaking Changes

- Updated the `ledger_entry` API method to return an `invalidParams` error if you specify multiple entries. Previously, the method would return information for only one entry selected at random. This change enforces a single entry lookup per request. ([#5237](https://github.com/XRPLF/rippled/pull/5237))


### Bug Fixes

- Fixed consensus stall detection to not flag prematurely. ([#5658](https://github.com/XRPLF/rippled/pull/5658))
- Added additional logging to differentiate why peer connections were refused. ([#5690](https://github.com/XRPLF/rippled/pull/5690))
- Fixed a code coverage error. ([#5765](https://github.com/XRPLF/rippled/pull/5765))
- Raised severity of unexpected/invalid keys when handling UNL manifest from `INFO` to `WARN`. Also changed internal error code for invalid UNL manifest formats from `untrusted` to `invalid`. ([#5804](https://github.com/XRPLF/rippled/pull/5804))
- Fixed release build errors with GCC 15.2. ([#5864](https://github.com/XRPLF/rippled/pull/5864))
- Fixed JSON parsing of negative integers in `STNumber` and `STAmount`. ([#5990](https://github.com/XRPLF/rippled/pull/5990))
- Fixed HTTP header case sensitivity issue in `HttpClient.cpp`. ([#5767](https://github.com/XRPLF/rippled/pull/5767))
- Fixed transaction signature checking functions to accept only required parameters instead of full `PreclaimContext`. ([#5829](https://github.com/XRPLF/rippled/pull/5829))
- Fixed an issue where the `sfSubjectNode` wasn't populated by the `CredentialCreate` transaction for self-issued credentials. ([#5936](https://github.com/XRPLF/rippled/pull/5936))
- Fixed domain order books not populating during node startup. ([#5998](https://github.com/XRPLF/rippled/pull/5998))


### Refactors

- Decoupled net module from xrpld and moved RPC related classes to the rpc folder. ([#5477](https://github.com/XRPLF/rippled/pull/5477))
- Moved ledger component to `libxrpl` as part of modularization effort. ([#5493](https://github.com/XRPLF/rippled/pull/5493))
- Refactored code in preparation for `LendingProtocol`. ([#5590](https://github.com/XRPLF/rippled/pull/5590))
- Refactored `parseLeaf` to separate the handlers for `STI_UINT16` and `STI_UINT32` into separate helper functions. ([#5591](https://github.com/XRPLF/rippled/pull/5591))
- Restructured `Transactor::preflight` to remove boilerplate code in derived classes' implementations of `preflight`. ([#5592](https://github.com/XRPLF/rippled/pull/5592))
- Restructured `Transactor` signature checking code to be able to handle a `sigObject`, which may be the full transaction or a field containing a separate transaction. ([#5594](https://github.com/XRPLF/rippled/pull/5594))
- Revamped CI workflows to leverage new Docker images and improve testing automation. ([#5661](https://github.com/XRPLF/rippled/pull/5661))
- Cleaned up `CTID.h` code for improved readability and maintainability. ([#5681](https://github.com/XRPLF/rippled/pull/5681))
- Added support for extra transaction signature validation. ([#5851](https://github.com/XRPLF/rippled/pull/5851))
- Replaced JSON `LastLedgerSequence` with `last_ledger_seq` to make tests simpler and easier to read. ([#5884](https://github.com/XRPLF/rippled/pull/5884))
- Replaced `boost::lexical_cast<std::string>` with `to_string` in tests. ([#5883](https://github.com/XRPLF/rippled/pull/5883))
- Replaced tests that write out JSONs as strings instead of using the `Json::Value` library. ([#5886](https://github.com/XRPLF/rippled/pull/5886))
- Added a `paychan` namespace to the TestHelpers and implementation files, improving organization and clarity. ([#5840](https://github.com/XRPLF/rippled/pull/5840))
- Improved and refactored txset handling. ([#5951](https://github.com/XRPLF/rippled/pull/5951))


### Documentation

- Updated old links and descriptions in `README.md`. ([#4701](https://github.com/XRPLF/rippled/pull/4701))
- Added compiler warning for `std::counting_semaphore` usage. ([#5595](https://github.com/XRPLF/rippled/pull/5595))
- Removed redundant word in code comment. ([#5752](https://github.com/XRPLF/rippled/pull/5752))
- Added remote to `conan lock create` command. ([#5770](https://github.com/XRPLF/rippled/pull/5770))
- Fixed typo in JSON writer documentation. ([#5881](https://github.com/XRPLF/rippled/pull/5881))
- Fixed spelling issues across the codebase. ([#6002](https://github.com/XRPLF/rippled/pull/6002))
- Fixed typos in code comments. ([#6040](https://github.com/XRPLF/rippled/pull/6040))
- Removed accidental copyright notice from `NetworkOps_test.cpp`. ([#6066](https://github.com/XRPLF/rippled/pull/6066))


### Testing

- Migrated json unit tests to use doctest framework. ([#5533](https://github.com/XRPLF/rippled/pull/5533))
- Added basic tests for `STInteger` and `STParsedJSON`. ([#5726](https://github.com/XRPLF/rippled/pull/5726))
- Fixed test framework to handle null metadata for unvalidated transactions in `env.meta`. ([#5715](https://github.com/XRPLF/rippled/pull/5715))
- Added more comprehensive tests for the `FeeVote` module. ([#5746](https://github.com/XRPLF/rippled/pull/5746))
- Added additional tests for `simulate` RPC metadata. ([#5827](https://github.com/XRPLF/rippled/pull/5827))
- Updated unit test summary to count crashed tests as failures. ([#5924](https://github.com/XRPLF/rippled/pull/5924))
- Fixed CI to upload all test binaries. ([#5932](https://github.com/XRPLF/rippled/pull/5932))


### CI/Build

- Modified GitHub Actions jobs to use `>>` instead of `tee` for `${GITHUB_OUTPUT}` to prevent output overwriting. ([#5699](https://github.com/XRPLF/rippled/pull/5699))
- Fixed CI workflow issues and reduced separate OS jobs into one by using a strategy matrix. ([#5700](https://github.com/XRPLF/rippled/pull/5700))
- Fixed `build_only` conditional check to correctly determine whether to run tests. ([#5708](https://github.com/XRPLF/rippled/pull/5708))
- Updated `clang-format` and added `prettier` to the `pre-commit`. Also added proto file formatting. ([#5709](https://github.com/XRPLF/rippled/pull/5709))
- Reverted formatting changes to external files and added formatting for proto files. ([#5711](https://github.com/XRPLF/rippled/pull/5711))
- Fixed `notify-clio` job to skip when running in forks, and reordered config fields for better job name visibility. ([#5712](https://github.com/XRPLF/rippled/pull/5712))
- Added workaround for CI build errors on arm64 with Clang 20. ([#5717](https://github.com/XRPLF/rippled/pull/5717))
- Fixed file formatting in anticipation of enabling additional `clang-format-hooks`. ([#5718](https://github.com/XRPLF/rippled/pull/5718))
- Removed codecov token check to support tokenless uploads from forks. ([#5722](https://github.com/XRPLF/rippled/pull/5722))
- Reverted PR pipeline trigger rules to fix unintended job skipping behavior. ([#5727](https://github.com/XRPLF/rippled/pull/5727))
- Replaced `on: pull_request: paths` with `changed-files` action for better CI control. ([#5728](https://github.com/XRPLF/rippled/pull/5728))
- Added support for `merge_group` event in GitHub CI to enable merge queues. ([#5734](https://github.com/XRPLF/rippled/pull/5734))
- Added codecov token to the `on-trigger` workflow to enable report uploading. ([#5736](https://github.com/XRPLF/rippled/pull/5736))
- Modified CI test jobs to run if files changed or PR has "Ready to merge" label. ([#5739](https://github.com/XRPLF/rippled/pull/5739))
- Used `XRPLF/prepare-runner` action to fix `CONAN_HOME` issues on macOS. Also removed old CMake code. ([#5740](https://github.com/XRPLF/rippled/pull/5740))
- Removed extraneous `LCOV_EXCL_START` marker from coverage reporting. ([#5744](https://github.com/XRPLF/rippled/pull/5744))
- Added conan lockfile for better dependency management and reproducible builds. ([#5751](https://github.com/XRPLF/rippled/pull/5751))
- Updated pre-commit to manage tools on its own. ([#5753](https://github.com/XRPLF/rippled/pull/5753))
- Added required `disable_ccache` option to workflow. ([#5756](https://github.com/XRPLF/rippled/pull/5756))
- Fixed coverage parameter in Cmake file. ([#5760](https://github.com/XRPLF/rippled/pull/5760))
- Added additional info to `notify-clio` workflow. ([#5761](https://github.com/XRPLF/rippled/pull/5761))
- Implemented separate upload workflow. ([#5762](https://github.com/XRPLF/rippled/pull/5762))
- Added `cleanup-workspace` action to clean workspace before builds. ([#5763](https://github.com/XRPLF/rippled/pull/5763))
- Added `conan.lock` to workflow file checks. ([#5769](https://github.com/XRPLF/rippled/pull/5769))
- Removed extra @ symbol in `notify-clio.yml`. ([#5771](https://github.com/XRPLF/rippled/pull/5771))
- Fixed `pre-commit` workflows. ([#5772](https://github.com/XRPLF/rippled/pull/5772))
- Switched `on-trigger` workflow to minimal build to reduce the number of builds. ([#5773](https://github.com/XRPLF/rippled/pull/5773))
- Fixed `passed` jobs to properly pass if all its dependencies passed or were skipped. ([#5776](https://github.com/XRPLF/rippled/pull/5776))
- Added `should-run` filtering back to `build-test` and `notify-clio` workflows. ([#5777](https://github.com/XRPLF/rippled/pull/5777))
- Switched CI pipeline `bookworm:gcc-13` from arm64 to amd64 architecture. ([#5779](https://github.com/XRPLF/rippled/pull/5779))
- Updated to self-hosted Windows runners to shorten build times. ([#5780](https://github.com/XRPLF/rippled/pull/5780))
- Limited `upload-conan-deps` to 10 parallel instances when using `max-parallel`. ([#5781](https://github.com/XRPLF/rippled/pull/5781))
- Changed when `upload-conan-deps` workflows run to avoid unnecessary execution on PRs. ([#5782](https://github.com/XRPLF/rippled/pull/5782))
- Added missing dependencies to workflows. ([#5783](https://github.com/XRPLF/rippled/pull/5783))
- Updated to use default conan install without `--format json`. ([#5784](https://github.com/XRPLF/rippled/pull/5784))
- Fixed secrets and variables in `upload-conan-deps` workflow. ([#5785](https://github.com/XRPLF/rippled/pull/5785))
- Modified Clio notifications to only happen when a PR targets the release or master branch. ([#5794](https://github.com/XRPLF/rippled/pull/5794))
- Wrapped all GitHub CI conditionals in curly braces for consistency. ([#5796](https://github.com/XRPLF/rippled/pull/5796))
- Limited CI build and test parallelism to 10 concurrent jobs. ([#5799](https://github.com/XRPLF/rippled/pull/5799))
- Enabled building and testing all configurations for daily scheduled runs. ([#5801](https://github.com/XRPLF/rippled/pull/5801))
- Excluded unit tests from code coverage reporting. ([#5803](https://github.com/XRPLF/rippled/pull/5803))
- Pinned all CI Docker image tags to latest versions in the XRPLF/CI repo. ([#5813](https://github.com/XRPLF/rippled/pull/5813))
- Implemented separate upload workflow for artifacts during build and test phases. ([#5817](https://github.com/XRPLF/rippled/pull/5817))
- Renamed all reusable workflows to include "reusable" in their names for clarity. ([#5818](https://github.com/XRPLF/rippled/pull/5818))
- Set free-form CI inputs as environment variables to prevent injection attacks. ([#5822](https://github.com/XRPLF/rippled/pull/5822))
- Removed extraneous coverage warnings. ([#5838](https://github.com/XRPLF/rippled/pull/5838))
- Excluded `UNREACHABLE` blocks from codecov to improve coverage accuracy. ([#5846](https://github.com/XRPLF/rippled/pull/5846))
- Excluded old, unreachable transaction code from codecov for better coverage reporting. ([#5847](https://github.com/XRPLF/rippled/pull/5847))
- Updated CI strategy matrix to use new RHEL 9 and RHEL 10 Docker images. ([#5856](https://github.com/XRPLF/rippled/pull/5856))
- Fixed Windows build log size issue by setting log verbosity to quiet. ([#5865](https://github.com/XRPLF/rippled/pull/5865))
- Added support for CMake 4 without workarounds. ([#5866](https://github.com/XRPLF/rippled/pull/5866))
- Added wildcard to support triggering for release pipelines. ([#5879](https://github.com/XRPLF/rippled/pull/5879))
- Added support for RHEL 8. ([#5880](https://github.com/XRPLF/rippled/pull/5880))
- Updated pre-commit workflow to latest version. ([#5902](https://github.com/XRPLF/rippled/pull/5902))
- Updated the Docker image hashes for `tools-rippled`. ([#5896](https://github.com/XRPLF/rippled/pull/5896))
- Set fail-fast to false unless it is run by a merge group. ([#5897](https://github.com/XRPLF/rippled/pull/5897))
- Cleaned up Conan variables in CI. ([#5903](https://github.com/XRPLF/rippled/pull/5903))
- Set explicit timeouts for build and test jobs. ([#5912](https://github.com/XRPLF/rippled/pull/5912))
- Removed unnecessary `LCOV_EXCL_LINE` marker in `Escrow.cpp`. ([#5913](https://github.com/XRPLF/rippled/pull/5913))
- Updated `${{ env.ENVVAR }}` syntax to `${ENVVAR}` in GitHub Actions. ([#5923](https://github.com/XRPLF/rippled/pull/5923))
- Cleaned up build profile options. ([#5934](https://github.com/XRPLF/rippled/pull/5934))
- Added network info output to CI test job to help diagnose port exhaustion issues. ([#5938](https://github.com/XRPLF/rippled/pull/5938))
- Reduced the number of cores used to build and test by two. ([#5939](https://github.com/XRPLF/rippled/pull/5939))
- Updated pre-commit failure message. ([#5940](https://github.com/XRPLF/rippled/pull/5940))
- Fixed CI to only run .exe files during test phase on Windows. ([#5947](https://github.com/XRPLF/rippled/pull/5947))
- Changed the CI concurrency group for pushes to the `develop` branch to use the commit hash instead of the target branch. ([#5950](https://github.com/XRPLF/rippled/pull/5950))
- Changed Conan remote login to only occur when uploading packages. ([#5952](https://github.com/XRPLF/rippled/pull/5952))
- Updated CI to only upload codecov reports in the original repo, not in forks. ([#5953](https://github.com/XRPLF/rippled/pull/5953))
- Updated CI to use new `prepare-runner` action. ([#5970](https://github.com/XRPLF/rippled/pull/5970))
- Updated CI image hashes to use netstat. ([#5987](https://github.com/XRPLF/rippled/pull/5987))
- Made CMake improvements, including removing unused definitions, moving variable definitions, and updating the minimum GCC and Clang versions required. ([#6010](https://github.com/XRPLF/rippled/pull/6010))
- Unified build and test jobs into a single job and added `ctest` to coverage reporting. ([#6013](https://github.com/XRPLF/rippled/pull/6013))
- Moved running of unit tests out of coverage target. ([#6018](https://github.com/XRPLF/rippled/pull/6018))
- Updated Conan to version 2.22.2. ([#6019](https://github.com/XRPLF/rippled/pull/6019))
- Specified bash as default shell in workflows. ([#6021](https://github.com/XRPLF/rippled/pull/6021))
- Updated the `cleanup-workspace` action to its latest version to add support for Windows. ([#6024](https://github.com/XRPLF/rippled/pull/6024))
- Added new Debian Trixie CI images to build and test with. ([#6034](https://github.com/XRPLF/rippled/pull/6034))
- Changed strategy matrix check to filter out Clang 20+ on ARM. ([#6046](https://github.com/XRPLF/rippled/pull/6046))
- Updated CI to only upload artifacts in XRPLF repo. ([#6060](https://github.com/XRPLF/rippled/pull/6060))
- Removed missing commits check. ([#6077](https://github.com/XRPLF/rippled/pull/6077))
- Updated CI to trigger Clio pipeline on PRs targeting any `release` branches. ([#6080](https://github.com/XRPLF/rippled/pull/6080))


## Credits

The following GitHub users contributed to this release:

- RippleX Engineering
- RippleX Docs
- RippleX Product
- @dangell7
- @tequdev
- @tzchenxixi
- @wojake


## Bug Bounties and Responsible Disclosures

We welcome reviews of the `rippled` code and urge researchers to responsibly disclose any issues they may find.

To report a bug, please send a detailed report to: <bugs@xrpl.org>