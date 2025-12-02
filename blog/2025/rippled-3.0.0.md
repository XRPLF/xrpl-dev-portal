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

- Fixed escrow creation with tokens to properly handle token amounts. ([#5571](https://github.com/XRPLF/rippled/pull/5571))
- Added fix amendment to include missing keylet fields in ledger objects, including sequence for Escrow and PayChannel, owner for SignerList, and oracle document ID for Oracle. ([#5646](https://github.com/XRPLF/rippled/pull/5646))
- Added fix amendment for PermissionDelegation V1.1. ([#5650](https://github.com/XRPLF/rippled/pull/5650))
- Added Scale field to SingleAssetVault ledger objects. ([#5652](https://github.com/XRPLF/rippled/pull/5652))
- Added DynamicMPT amendment (XLS-94d) allowing issuers to mutate Multi-Purpose Token properties after creation, including metadata, transfer fees, and permission flags. ([#5705](https://github.com/XRPLF/rippled/pull/5705))
- Enabled fixPriceOracleOrder amendment to allow validator voting on fixing PriceDataSeries order during PriceOracle creation. ([#5749](https://github.com/XRPLF/rippled/pull/5749))
- Enabled fixAMMClawbackRounding amendment to fix AMM LP token clawback rounding issues. ([#5750](https://github.com/XRPLF/rippled/pull/5750))
- Enabled fixIncludeKeyletFields amendment to allow validator voting. ([#5819](https://github.com/XRPLF/rippled/pull/5819))
- Renamed DynamicMPT flags to align with XLS-94d specification. ([#5820](https://github.com/XRPLF/rippled/pull/5820))
- Enabled MPTDeliveredAmount amendment to Supported::yes. ([#5833](https://github.com/XRPLF/rippled/pull/5833))

### Features/API Improvements

- Added support for additional metadata in simulate RPC response including delivered amount and transaction result. ([#5754](https://github.com/XRPLF/rippled/pull/5754))
- Fixed HTTP header case sensitivity issue in HttpClient to properly handle Content-Length header variations. ([#5767](https://github.com/XRPLF/rippled/pull/5767))

### Bug Fixes

- Fixed consensus stall detection to not flag prematurely. ([#5658](https://github.com/XRPLF/rippled/pull/5658))
- Added graceful peer disconnection using proper asynchronous TLS shutdown procedures. ([#5669](https://github.com/XRPLF/rippled/pull/5669))
- Added vault invariants to ensure proper validation of SingleAssetVault transactions. ([#5518](https://github.com/XRPLF/rippled/pull/5518))
- Fixed assertion failure in NetworkOP when all transactions in batch processing list are marked as invalid. ([#5670](https://github.com/XRPLF/rippled/pull/5670))
- Added additional logging to differentiate why peer connections were refused. ([#5690](https://github.com/XRPLF/rippled/pull/5690))
- Fixed code coverage error by properly configuring coverage flags in RippledInterface.cmake and CodeCoverage.cmake. ([#5765](https://github.com/XRPLF/rippled/pull/5765))
- Improved ValidatorList invalid UNL manifest logging by raising severity to WARN and changing error code for invalid format. ([#5804](https://github.com/XRPLF/rippled/pull/5804))
- Added pre-emptive file descriptor/handle guarding with exponential backoff to prevent resource exhaustion. ([#5823](https://github.com/XRPLF/rippled/pull/5823))
- Fixed release build errors by removing unused variables. ([#5864](https://github.com/XRPLF/rippled/pull/5864))
- Fixed invariant error in VaultWithdraw when transaction amount equals fee. ([#5876](https://github.com/XRPLF/rippled/pull/5876))
- Enforced reserve requirement when creating trust lines or MPToken in VaultWithdraw transactions. ([#5857](https://github.com/XRPLF/rippled/pull/5857))
- Removed directory size limit as part of unlimited directory support. ([#5935](https://github.com/XRPLF/rippled/pull/5935))
- Applied object reserve requirements for Vault pseudo-account to ensure proper reserve handling. ([#5954](https://github.com/XRPLF/rippled/pull/5954))
- Fixed JSON parsing of negative STNumber and STAmount values. ([#5990](https://github.com/XRPLF/rippled/pull/5990))
- Fixed floating point representation errors in vault transactions. ([#5997](https://github.com/XRPLF/rippled/pull/5997))

### Refactor

- Major refactor of ledger_entry source code and tests, improving readability and maintainability. ([#5237](https://github.com/XRPLF/rippled/pull/5237))
- Decoupled net module from xrpld and moved RPC related classes to the rpc folder. ([#5477](https://github.com/XRPLF/rippled/pull/5477))
- Moved ledger module to libxrpl as part of modularization effort. ([#5493](https://github.com/XRPLF/rippled/pull/5493))
- Refactored STParsedJSON to improve code organization. ([#5591](https://github.com/XRPLF/rippled/pull/5591))
- Restructured Transactor::preflight to reduce boilerplate code in derived classes. ([#5592](https://github.com/XRPLF/rippled/pull/5592))
- Added extra signing support to Transactor preflight functions. ([#5594](https://github.com/XRPLF/rippled/pull/5594))
- Refactored lending protocol baseline with miscellaneous improvements including new helper functions and invariants. ([#5590](https://github.com/XRPLF/rippled/pull/5590))
- Revamped CI workflows to leverage new Docker images and improve testing automation. ([#5661](https://github.com/XRPLF/rippled/pull/5661))
- Cleaned up CTID.h code for improved readability and maintainability. ([#5681](https://github.com/XRPLF/rippled/pull/5681))
- Added STInt32 as a new SType to support 32-bit integer fields in protocol. ([#5788](https://github.com/XRPLF/rippled/pull/5788))
- Renamed mutable flags for DynamicMPT to align with XLS-94d specification changes. ([#5797](https://github.com/XRPLF/rippled/pull/5797))
- Fixed transaction signature checking functions to accept only required parameters instead of full PreclaimContext. ([#5829](https://github.com/XRPLF/rippled/pull/5829))
- Added support for extra transaction signature validation in preflight functions. ([#5851](https://github.com/XRPLF/rippled/pull/5851))
- Replaced boost::lexical_cast with to_string in tests for cleaner code. ([#5883](https://github.com/XRPLF/rippled/pull/5883))
- Replaced JSON LastLedgerSequence strings with last_ledger_seq helper in tests. ([#5884](https://github.com/XRPLF/rippled/pull/5884))
- Refactored payment channel namespace and updated related tests. ([#5840](https://github.com/XRPLF/rippled/pull/5840))
- Changed Credential sfSubjectNode from required to optional in object template. ([#5936](https://github.com/XRPLF/rippled/pull/5936))
- Improved and refactored transaction set handling code for better performance and maintainability. ([#5951](https://github.com/XRPLF/rippled/pull/5951))

### Documentation

- Updated README.md with improved descriptions of XRP Ledger features and capabilities. ([#4701](https://github.com/XRPLF/rippled/pull/4701))
- Added warning comment about std::counting_semaphore usage considerations. ([#5595](https://github.com/XRPLF/rippled/pull/5595))
- Removed redundant word in code comment for improved clarity. ([#5752](https://github.com/XRPLF/rippled/pull/5752))
- Added remote parameter to conan lock create command in build documentation. ([#5770](https://github.com/XRPLF/rippled/pull/5770))
- Fixed typo in JSON writer documentation. ([#5881](https://github.com/XRPLF/rippled/pull/5881))
- Fixed a large number of spelling issues across the codebase. ([#6002](https://github.com/XRPLF/rippled/pull/6002))
- Fixed typos in code comments. ([#6040](https://github.com/XRPLF/rippled/pull/6040))
- Cleaned up copyright notice comment in NetworkOps_test.cpp. ([#6066](https://github.com/XRPLF/rippled/pull/6066))
- Improved VaultWithdraw transaction documentation. ([#6068](https://github.com/XRPLF/rippled/pull/6068))

### Testing

- Migrated json unit tests to use doctest framework. ([#5533](https://github.com/XRPLF/rippled/pull/5533))
- Added basic tests for STInteger and STParsedJSON, and improved test error handling for null metadata. ([#5726](https://github.com/XRPLF/rippled/pull/5726))
- Fixed test framework to handle null metadata for unvalidated transactions in Env::meta. ([#5715](https://github.com/XRPLF/rippled/pull/5715))
- Added comprehensive tests for FeeVote module to improve coverage of fee voting flows. ([#5746](https://github.com/XRPLF/rippled/pull/5746))
- Added additional tests for Simulate RPC metadata to verify values in tx_json metadata fields. ([#5827](https://github.com/XRPLF/rippled/pull/5827))
- Replaced string JSONs with Json::Value in tests for better code readability. ([#5886](https://github.com/XRPLF/rippled/pull/5886))
- Added crashed test suite count to unit test summary output. ([#5924](https://github.com/XRPLF/rippled/pull/5924))
- Fixed CI to upload all test binaries including .pdb and .exe files. ([#5932](https://github.com/XRPLF/rippled/pull/5932))

### CI/Build Improvements

- Updated Boost library from 1.83 to 1.88 to fix ASAN false positives. ([#5570](https://github.com/XRPLF/rippled/pull/5570))
- Updated OpenSSL from 1.1.1w to 3.5.2 with Conan 2 dependency management. ([#5617](https://github.com/XRPLF/rippled/pull/5617))
- Modified GitHub Actions jobs to use '>>' instead of 'tee' for GITHUB_OUTPUT to prevent output overwriting. ([#5699](https://github.com/XRPLF/rippled/pull/5699))
- Adjusted CI workflows to fix issues with required status checks and workflow inputs. ([#5700](https://github.com/XRPLF/rippled/pull/5700))
- Fixed build_only conditional check to correctly determine whether to run tests. ([#5708](https://github.com/XRPLF/rippled/pull/5708))
- Updated clang-format and prettier with pre-commit hooks for better code formatting consistency. ([#5709](https://github.com/XRPLF/rippled/pull/5709))
- Reverted formatting changes to external files and added formatting for proto files. ([#5711](https://github.com/XRPLF/rippled/pull/5711))
- Fixed notify-clio job to skip when running in forks, and reordered config fields for better job name visibility. ([#5712](https://github.com/XRPLF/rippled/pull/5712))
- Added workaround for CI build errors on arm64 with clang-20. ([#5717](https://github.com/XRPLF/rippled/pull/5717))
- Fixed file formatting to comply with clang-format and prettier standards. ([#5718](https://github.com/XRPLF/rippled/pull/5718))
- Removed codecov token check to support tokenless uploads from forks. ([#5722](https://github.com/XRPLF/rippled/pull/5722))
- Reverted PR pipeline trigger rules to fix unintended job skipping behavior. ([#5727](https://github.com/XRPLF/rippled/pull/5727))
- Replaced 'on: pull_request: paths' with 'changed-files' action for better CI control. ([#5728](https://github.com/XRPLF/rippled/pull/5728))
- Added support for merge_group event in GitHub CI to enable merge queues. ([#5734](https://github.com/XRPLF/rippled/pull/5734))
- Added codecov token to trigger workflow for coverage reporting. ([#5736](https://github.com/XRPLF/rippled/pull/5736))
- Modified CI test jobs to run if files changed or PR has "Ready to merge" label. ([#5739](https://github.com/XRPLF/rippled/pull/5739))
- Used XRPLF/prepare-runner action to fix CONAN_HOME issues on Windows and macOS, and clean up CMake code. ([#5740](https://github.com/XRPLF/rippled/pull/5740))
- Removed extraneous LCOV_EXCL_START marker to fix code coverage reporting. ([#5744](https://github.com/XRPLF/rippled/pull/5744))
- Used conan lockfile for better dependency management and reproducible builds. ([#5751](https://github.com/XRPLF/rippled/pull/5751))
- Used tooling provided by pre-commit for clang-format and prettier instead of separate installations. ([#5753](https://github.com/XRPLF/rippled/pull/5753))
- Added required disable_ccache option to workflow for proper cache control. ([#5756](https://github.com/XRPLF/rippled/pull/5756))
- Fixed coverage parameter in CI configuration. ([#5760](https://github.com/XRPLF/rippled/pull/5760))
- Fixed notify-clio workflow by adding missing user field and renaming pr to pr_number. ([#5761](https://github.com/XRPLF/rippled/pull/5761))
- Implemented separate upload workflow for better artifact management. ([#5762](https://github.com/XRPLF/rippled/pull/5762))
- Used cleanup-workspace action to properly clean workspace before builds. ([#5763](https://github.com/XRPLF/rippled/pull/5763))
- Added conan.lock to workflow file checks to trigger CI when dependencies change. ([#5769](https://github.com/XRPLF/rippled/pull/5769))
- Removed extra @ symbol in notify-clio.yml workflow configuration. ([#5771](https://github.com/XRPLF/rippled/pull/5771))
- Used pre-commit reusable workflow to simplify CI configuration. ([#5772](https://github.com/XRPLF/rippled/pull/5772))
- Switched on-trigger workflow to minimal build to reduce CI execution time. ([#5773](https://github.com/XRPLF/rippled/pull/5773))
- Fixed "passed" job to properly fail when any dependent jobs fail instead of being skipped. ([#5776](https://github.com/XRPLF/rippled/pull/5776))
- Added should-run filtering back to build-test and notify-clio workflows. ([#5777](https://github.com/XRPLF/rippled/pull/5777))
- Switched CI pipeline bookworm:gcc-13 from arm64 to amd64 architecture. ([#5779](https://github.com/XRPLF/rippled/pull/5779))
- Used self-hosted Windows runners to shorten build times. ([#5780](https://github.com/XRPLF/rippled/pull/5780))
- Limited upload-conan-deps to 10 parallel instances using max-parallel to reduce resource contention. ([#5781](https://github.com/XRPLF/rippled/pull/5781))
- Changed when upload-conan-deps workflow runs to avoid unnecessary execution on PRs. ([#5782](https://github.com/XRPLF/rippled/pull/5782))
- Added missing dependencies to workflow paths for better CI triggering. ([#5783](https://github.com/XRPLF/rippled/pull/5783))
- Used default conan install format instead of JSON for simpler dependency management. ([#5784](https://github.com/XRPLF/rippled/pull/5784))
- Fixed secrets and variables in upload-conan-deps workflow for proper authentication. ([#5785](https://github.com/XRPLF/rippled/pull/5785))
- Modified notify-clio to only run for PRs targeting release and master branches. ([#5794](https://github.com/XRPLF/rippled/pull/5794))
- Wrapped all GitHub CI conditionals in curly braces for consistency. ([#5796](https://github.com/XRPLF/rippled/pull/5796))
- Limited CI build and test parallelism to 10 concurrent jobs to reduce resource contention. ([#5799](https://github.com/XRPLF/rippled/pull/5799))
- Enabled building and testing all configurations for daily scheduled CI runs. ([#5801](https://github.com/XRPLF/rippled/pull/5801))
- Added unit tests directory to code coverage excludes for more accurate reporting. ([#5803](https://github.com/XRPLF/rippled/pull/5803))
- Reverted Conan OpenSSL dependency update due to compatibility issues. ([#5807](https://github.com/XRPLF/rippled/pull/5807))
- Pinned all CI Docker image tags to latest versions for reproducible builds. ([#5813](https://github.com/XRPLF/rippled/pull/5813))
- Implemented separate upload workflow for artifacts during build and test phases. ([#5817](https://github.com/XRPLF/rippled/pull/5817))
- Renamed all reusable workflows to include "reusable" in their names for clarity. ([#5818](https://github.com/XRPLF/rippled/pull/5818))
- Set free-form CI inputs as environment variables to prevent injection attacks. ([#5822](https://github.com/XRPLF/rippled/pull/5822))
- Removed bogus coverage warning from CI. ([#5838](https://github.com/XRPLF/rippled/pull/5838))
- Excluded UNREACHABLE blocks from codecov to improve coverage accuracy. ([#5846](https://github.com/XRPLF/rippled/pull/5846))
- Excluded old unreachable transaction code from codecov for better coverage reporting. ([#5847](https://github.com/XRPLF/rippled/pull/5847))
- Reverted graceful peer disconnection due to insufficient testing time before release 3.0.0. ([#5855](https://github.com/XRPLF/rippled/pull/5855))
- Updated CI strategy matrix to use new RHEL 9 and RHEL 10 Docker images. ([#5856](https://github.com/XRPLF/rippled/pull/5856))
- Set version to 3.0.0-b1 for beta release. ([#5859](https://github.com/XRPLF/rippled/pull/5859))
- Fixed Windows build log size issue by setting log verbosity to quiet. ([#5865](https://github.com/XRPLF/rippled/pull/5865))
- Added support for CMake 4 without workarounds. ([#5866](https://github.com/XRPLF/rippled/pull/5866))
- Reverted FD/handle guarding due to insufficient testing time before release 3.0.0. ([#5869](https://github.com/XRPLF/rippled/pull/5869))
- Reverted Boost 1.88 update due to compatibility issues. ([#5872](https://github.com/XRPLF/rippled/pull/5872))
- Added wildcard to release branch to support triggering release pipeline for branches like release-X.Y. ([#5879](https://github.com/XRPLF/rippled/pull/5879))
- Added support for RHEL 8 in CI matrix. ([#5880](https://github.com/XRPLF/rippled/pull/5880))
- Updated pre-commit workflow to latest version. ([#5902](https://github.com/XRPLF/rippled/pull/5902))
- Updated tools-rippled Docker image SHAs for pre-commit and documentation images. ([#5896](https://github.com/XRPLF/rippled/pull/5896))
- Set fail-fast to false except for merge queue to allow all CI jobs to complete. ([#5897](https://github.com/XRPLF/rippled/pull/5897))
- Sanitized CI inputs by setting them as environment variables and adjusted CPU count for builds. ([#5903](https://github.com/XRPLF/rippled/pull/5903))
- Set explicit timeouts for build and test jobs to prevent hanging CI jobs. ([#5912](https://github.com/XRPLF/rippled/pull/5912))
- Removed unnecessary LCOV_EXCL_LINE marker in Escrow.cpp. ([#5913](https://github.com/XRPLF/rippled/pull/5913))
- Used "${ENVVAR}" instead of ${{ env.ENVVAR }} syntax in GitHub Actions for better security. ([#5923](https://github.com/XRPLF/rippled/pull/5923))
- Cleaned up build profile options including -Wno-missing-template-arg-list-after-template-kw flag. ([#5934](https://github.com/XRPLF/rippled/pull/5934))
- Added network info output to CI test job to help diagnose port exhaustion issues. ([#5938](https://github.com/XRPLF/rippled/pull/5938))
- Used nproc-2 (number of cores minus 2) to set parallelism for builds and tests to reduce resource contention. ([#5939](https://github.com/XRPLF/rippled/pull/5939))
- Updated pre-commit failure message with new GitHub Actions workflow. ([#5940](https://github.com/XRPLF/rippled/pull/5940))
- Fixed CI to only run .exe files during test phase on Windows. ([#5947](https://github.com/XRPLF/rippled/pull/5947))
- Used commit hash for CI concurrency group on develop branch to prevent canceling workflows when merging multiple PRs. ([#5950](https://github.com/XRPLF/rippled/pull/5950))
- Changed Conan remote login to only occur when uploading packages. ([#5952](https://github.com/XRPLF/rippled/pull/5952))
- Updated CI to only upload codecov reports in the original XRPLF repository, not in forks. ([#5953](https://github.com/XRPLF/rippled/pull/5953))
- Used new prepare-runner action for improved runner setup across platforms. ([#5970](https://github.com/XRPLF/rippled/pull/5970))
- Updated CI image hashes to use netstat package. ([#5987](https://github.com/XRPLF/rippled/pull/5987))
- Made CMake improvements including removing superfluous module imports and cleaning up configuration. ([#6010](https://github.com/XRPLF/rippled/pull/6010))
- Unified build and test jobs into a single job and added ctest to coverage reporting. ([#6013](https://github.com/XRPLF/rippled/pull/6013))
- Moved running of unit tests out of coverage target for cleaner separation. ([#6018](https://github.com/XRPLF/rippled/pull/6018))
- Updated Conan to version 2.22.2. ([#6019](https://github.com/XRPLF/rippled/pull/6019))
- Specified bash as default shell in GitHub workflows for consistency. ([#6021](https://github.com/XRPLF/rippled/pull/6021))
- Cleaned up workspace on Windows self-hosted runners to prevent remnants from previous jobs. ([#6024](https://github.com/XRPLF/rippled/pull/6024))
- Used new Debian Trixie CI images. ([#6034](https://github.com/XRPLF/rippled/pull/6034))
- Fixed filtering out of Clang 20+ on ARM architecture. ([#6046](https://github.com/XRPLF/rippled/pull/6046))
- Updated CI to only upload artifacts when running in XRPLF repository to prevent excessive artifact uploads in forks. ([#6060](https://github.com/XRPLF/rippled/pull/6060))
- Removed missing commits check workflow as it's no longer needed with new release model. ([#6077](https://github.com/XRPLF/rippled/pull/6077))
- Updated CI to trigger Clio pipeline on PRs targeting release branches in addition to master. ([#6080](https://github.com/XRPLF/rippled/pull/6080))


## Credits

The following GitHub users contributed to this release:

- RippleX Engineering
- RippleX Docs
- RippleX Product


## Bug Bounties and Responsible Disclosures

We welcome reviews of the `rippled` code and urge researchers to responsibly disclose any issues they may find.

To report a bug, please send a detailed report to: <bugs@xrpl.org>