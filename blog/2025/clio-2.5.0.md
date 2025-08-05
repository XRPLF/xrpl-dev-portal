---
category: 2025
date: "2025-07-24"
template: '../../@theme/templates/blogpost'
seo:
    title: Introducing Clio version 2.5.0
    description: Version 2.5.0 of Clio, an XRP Ledger API server optimized for HTTP and WebSocket API calls, is now available. This release adds new features and bug fixes.
labels:
    - Clio Release Notes
markdown:
    editPage:
        hide: true
---
# Introducing Clio version 2.5.0

Version 2.5.0 of Clio, an XRP Ledger API server optimized for HTTP and WebSocket API calls, is now available. This release adds new features and bug fixes.

## Amendment Support

The following amendments have been introduced since Clio 2.4.1 and have transaction model changes. Clio 2.5.0 is built with `libxrpl` 2.5.0, which supports these amendments.

- [Batch](https://xrpl.org/resources/known-amendments#batch)
- [PermissionDelegation](https://xrpl.org/resources/known-amendments#permissiondelegation)
- [PermissionedDEX](https://xrpl.org/resources/known-amendments#permissioneddex)
- [TokenEscrow](https://xrpl.org/resources/known-amendments#tokenescrow)

If these amendments are enabled and you have not upgraded Clio to 2.5.0 or newer, the ETL will be amendment blocked and new ledgers will not be processed.

To check the current voting status of these amendments on Mainnet, see the [XRPL Amendments Dashboard](https://livenet.xrpl.org/amendments).

## Install / Upgrade

| Package  |
| :------- |
| [Clio Server Linux Release (GCC)](https://github.com/XRPLF/clio/releases/download/2.5.0/clio_server_Linux_Release_gcc.zip) |
| [Clio Server macOS Release (Apple Clang 16)](https://github.com/XRPLF/clio/releases/download/2.5.0/clio_server_macOS_Release_apple-clang.zip) |

For other platforms, please [build from source](https://github.com/XRPLF/clio/releases/tag/2.5.0). The most recent commit in the git log should be:

```text
Merge: d83be17d 00333a8d
Author: Sergey Kuznetsov <skuznetsov@ripple.com>
Date:   Tue Jul 22 11:43:18 2025 +0100

    chore: Commits for 2.5.0 (#2352)
```

## What's Changed

See the [Full Changelog on GitHub](https://github.com/XRPLF/clio/compare/2.4.1...2.5.0).

### Features

- Implements snapshot import feature ([#1970](https://github.com/XRPLF/clio/pull/1970))
- Adds ability for nodes to share information or status via the database ([#1976](https://github.com/XRPLF/clio/pull/1976))
- Adds experimental support for Dosguard API weights ([#2082](https://github.com/XRPLF/clio/pull/2082))
- Adds account permission support ([#2145](https://github.com/XRPLF/clio/pull/2145))
- Adds get range functionality to export tool ([#2131](https://github.com/XRPLF/clio/pull/2131))
- Adds support for Batch transactions ([#2162](https://github.com/XRPLF/clio/pull/2162))
- Adds support for Permissioned DEX ([#2152](https://github.com/XRPLF/clio/pull/2152))
- Adds support for Token Escrow ([#2252](https://github.com/XRPLF/clio/pull/2252))
- Adds support for Single Asset Vault ([#1979](https://github.com/XRPLF/clio/pull/1979))

### Bug Fixes

- Updated `ripple_flag` logic in account lines to match `rippled` implementation ([#1969](https://github.com/XRPLF/clio/pull/1969))
- Fixed issue with SSL in new webserver ([#1981](https://github.com/XRPLF/clio/pull/1981))
- Fixed incorrect `HighDeepFreeze` flag setting ([#1978](https://github.com/XRPLF/clio/pull/1978))
- Fixed CTID issue ([#2001](https://github.com/XRPLF/clio/pull/2001))
- Fixed incorrect requests logging ([#2005](https://github.com/XRPLF/clio/pull/2005))
- Pinned cmake version in CI Dockerfile to fix nightly release failure ([#2036](https://github.com/XRPLF/clio/pull/2036))
- Added CTID to all RPC's that include transactions to fix mismatch with `rippled` ([#2011](https://github.com/XRPLF/clio/pull/2011))
- Added missing paths to `update_docker_ci.yml` ([#2044](https://github.com/XRPLF/clio/pull/2044))
- Used ytanikin/pr-conventional-commits action for conventional commits check ([#2049](https://github.com/XRPLF/clio/pull/2049))
- Removed Mac CMake installation error ([#2040](https://github.com/XRPLF/clio/pull/2040))
- Stopped using `steps.conan.outputs.conan_profile` as it doesn't exist anymore ([#2056](https://github.com/XRPLF/clio/pull/2056))
- Added missing quotes to release title in Github release workflow ([#2064](https://github.com/XRPLF/clio/pull/2064))
- Fixed flaky test in ETLng ([#2077](https://github.com/XRPLF/clio/pull/2077))
- Added fix to pass `secrets.CODECOV_TOKEN` explicitly for reusable Github workflows ([#2079](https://github.com/XRPLF/clio/pull/2079))
- Made ctors/dtors public in tests ([#2089](https://github.com/XRPLF/clio/pull/2089))
- Made `fix-local-includes.sh` work on file-basis ([#2099](https://github.com/XRPLF/clio/pull/2099))
- Caught exception in `ClusterCommunicationService` ([#2093](https://github.com/XRPLF/clio/pull/2093))
- Made `fix-local-includes.sh` work with multiple files ([#2102](https://github.com/XRPLF/clio/pull/2102))
- Guaranteed async behavior of `WsBase::send` ([#2100](https://github.com/XRPLF/clio/pull/2100))
- Updated `clang-tidy` Github workflow to run `clang-format` after tidy ([#2108](https://github.com/XRPLF/clio/pull/2108))
- Fixed `fix-local-includes.sh` to not rewrite original file if it hasn't changed ([#2109](https://github.com/XRPLF/clio/pull/2109))
- Fixed issue with building with sanitizers ([#2118](https://github.com/XRPLF/clio/pull/2118))
- Used `git lfs install` and `fix verify-commits` hook ([#2129](https://github.com/XRPLF/clio/pull/2129))
- Fixed some Doxygen docs errors ([#2130](https://github.com/XRPLF/clio/pull/2130))
- Added `Delegate` to Ledger types ([#2151](https://github.com/XRPLF/clio/pull/2151))
- Used `UniformRandomGenerator` class to prevent threading issue ([#2165](https://github.com/XRPLF/clio/pull/2165))
- Added style to the name of pre-commit autoupdate PR title ([#2177](https://github.com/XRPLF/clio/pull/2177))
- Added README to docker/compilers ([#2188](https://github.com/XRPLF/clio/pull/2188))
- Analyzed build time on clang ([#2195](https://github.com/XRPLF/clio/pull/2195))
- Set compile flag to grpc only ([#2204](https://github.com/XRPLF/clio/pull/2204))
- Made GHCR lowercase ([#2218](https://github.com/XRPLF/clio/pull/2218))
- Updated docs to use Conan v2 dirs and commands ([#2219](https://github.com/XRPLF/clio/pull/2219))
- Updated `upload_conan_deps.yml` Github workflow to run on `conan.lock` changes ([#2227](https://github.com/XRPLF/clio/pull/2227))
- Ensured that `domainMalformed` is returned when domain is invalid ([#2228](https://github.com/XRPLF/clio/pull/2228))
- Added domain to `book_changes` ([#2229](https://github.com/XRPLF/clio/pull/2229))
- Updated CI image to provide `global.conf` for sanitizers to affect `package_id` ([#2233](https://github.com/XRPLF/clio/pull/2233))
- Used new CI image with `global.conf` for sanitizers to affect `package_id` ([#2234](https://github.com/XRPLF/clio/pull/2234))
- Forced reupload of new artifacts ([#2236](https://github.com/XRPLF/clio/pull/2236))
- Made `update-libxrpl-version` work with lockfile ([#2249](https://github.com/XRPLF/clio/pull/2249))
- Disabled conan uploads on schedule ([#2253](https://github.com/XRPLF/clio/pull/2253))
- Ensured that CI image builds are not cancelled ([#2259](https://github.com/XRPLF/clio/pull/2259))
- Pinned `lxml` dependency to version <6.0.0 ([#2269](https://github.com/XRPLF/clio/pull/2269))
- Ensured that command injection is not allowed in GitHub workflows ([#2270](https://github.com/XRPLF/clio/pull/2270)) 
- Ensured that `package_id:confs` can only be set for sanitized builds ([#2261](https://github.com/XRPLF/clio/pull/2261))
- Used `.contains()` method where available ([#2277](https://github.com/XRPLF/clio/pull/2277))
- Cleaned up `fmt` headers ([#2285](https://github.com/XRPLF/clio/pull/2285))
- Updated `pre-commit-autoupdate` Github workflow to import a GPG key ([#2287](https://github.com/XRPLF/clio/pull/2287))
- Made pre-commit autoupdate PRs verified ([#2289](https://github.com/XRPLF/clio/pull/2289))
- Temporarily disabled Docker Hub description update ([#2298](https://github.com/XRPLF/clio/pull/2298))
- Updated RPC module to use preferred compiler flags ([#2305](https://github.com/XRPLF/clio/pull/2305))
- Fixed ASAN stack-buffer-overflow in `NFTHelpersTest_NFTDataFromLedgerObject` ([#2306](https://github.com/XRPLF/clio/pull/2306))
- Added sending queue to ng web server ([#2273](https://github.com/XRPLF/clio/pull/2273))
- Fixed ASAN heap-buffer-overflow issue in `DBHelpers` ([#2310](https://github.com/XRPLF/clio/pull/2310))
- Explicitly linked with boost libraries ([#2313](https://github.com/XRPLF/clio/pull/2313))
- Marked tags with dash as pre-release ([#2319](https://github.com/XRPLF/clio/pull/2319))
- Added step to prepare runner in docs Github workflow ([#2325](https://github.com/XRPLF/clio/pull/2325))
- Fixed writing into dead variables in `BlockingCache` ([#2333](https://github.com/XRPLF/clio/pull/2333))
- Handled logger exceptions ([#2349](https://github.com/XRPLF/clio/pull/2349))

### Refactor

- Compared `error_code` with enum values, not hardcoded ints ([#2023](https://github.com/XRPLF/clio/pull/2023))
- Added `str()` method to `BaseTagDecorator` ([#2020](https://github.com/XRPLF/clio/pull/2020))
- Improved load balancer forwarding metrics ([#2103](https://github.com/XRPLF/clio/pull/2103))
- Removed old config ([#2097](https://github.com/XRPLF/clio/pull/2097))
- Used `std::expected` instead of `std::variant` for errors ([#2160](https://github.com/XRPLF/clio/pull/2160))
- Simplified `check_config` implementation ([#2247](https://github.com/XRPLF/clio/pull/2247))
- Refactored GCC image to make upgrades easier ([#2246](https://github.com/XRPLF/clio/pull/2246))
- Simplified CMakeLists.txt for sanitizers ([#2297](https://github.com/XRPLF/clio/pull/2297))
- Refactored GCC image to make upgrades easier ([#2246](https://github.com/XRPLF/clio/pull/2246))
- Added extensions for ETLng ([#1967](https://github.com/XRPLF/clio/pull/1967))
- Added ETLng integration ([#1986](https://github.com/XRPLF/clio/pull/1986))
- Added ETLng MPT support ([#2154](https://github.com/XRPLF/clio/pull/2154))
- Refactored ETLng publisher and service ([#2138](https://github.com/XRPLF/clio/pull/2138))
- Added read-write switching in ETLng ([#2199](https://github.com/XRPLF/clio/pull/2199))
- Added start and finish sequence support in ETLng ([#2226](https://github.com/XRPLF/clio/pull/2226))
- Added graceful shutdown and cleanup for ETLng ([#2232](https://github.com/XRPLF/clio/pull/2232))
- Updated forwarding cache to queue similar requests during entry updates ([#1997](https://github.com/XRPLF/clio/pull/1997))
- Implemented `FetchLedgerBySeq` caching to address uneven DB shard access ([#2014](https://github.com/XRPLF/clio/pull/2014))
- Implemented load balancer metrics in ETLng ([#2119](https://github.com/XRPLF/clio/pull/2119))

### Documentation

- Verified/reviewed config descriptions ([#1960](https://github.com/XRPLF/clio/pull/1960))
- Improved wording in docs ([#2095](https://github.com/XRPLF/clio/pull/2095))
- Added information about `global.conf` ([#2238](https://github.com/XRPLF/clio/pull/2238))

### Styling

- Used pre-commit tool and add simple config ([#2029](https://github.com/XRPLF/clio/pull/2029))
- Added prettier pre-commit hook ([#2031](https://github.com/XRPLF/clio/pull/2031))
- Applied `go fmt` to Go code ([#2046](https://github.com/XRPLF/clio/pull/2046))
- Added markdownlint pre-commit hook ([#2038](https://github.com/XRPLF/clio/pull/2038))
- Added typos pre-commit hook ([#2041](https://github.com/XRPLF/clio/pull/2041))
- Added C++ pre-commit hooks ([#2039](https://github.com/XRPLF/clio/pull/2039))
- Improved actions and workflows style ([#2060](https://github.com/XRPLF/clio/pull/2060))
- Used `codespell` instead of `typos` pre-commit hook ([#2104](https://github.com/XRPLF/clio/pull/2104))
- Marked JSON literal strings with R"JSON ([#2169](https://github.com/XRPLF/clio/pull/2169))
- Beautified installation lists in Dockerfile ([#2172](https://github.com/XRPLF/clio/pull/2172))
- Added static keyword before type ([#2231](https://github.com/XRPLF/clio/pull/2231))
- Fixed JSON style in C++ code ([#2262](https://github.com/XRPLF/clio/pull/2262))
- Added pre-commit hook to fix JSON style in C++ code ([#2266](https://github.com/XRPLF/clio/pull/2266))
- Updated pre-commit hooks ([#2290](https://github.com/XRPLF/clio/pull/2290))

### Testing

- Added `build_and_test` reusable workflow ([#2048](https://github.com/XRPLF/clio/pull/2048))
- Removed `SetUp` and `TearDown` methods in tests ([#2086](https://github.com/XRPLF/clio/pull/2086))
- Increased Cassandra timeouts in tests ([#2127](https://github.com/XRPLF/clio/pull/2127))
- Ensured that undefined sanitizer does not ignore errors when running ([#2134](https://github.com/XRPLF/clio/pull/2134))
- Skipped slow DB sleep-based test on Mac ([#2148](https://github.com/XRPLF/clio/pull/2148))

### Miscellaneous Tasks

- Added git-cliff config ([#1965](https://github.com/XRPLF/clio/pull/1965))
- Pinned cmake 3.31.6 for macOS runners ([#1983](https://github.com/XRPLF/clio/pull/1983))
- Updated maintainers ([#1987](https://github.com/XRPLF/clio/pull/1987))
- Updated workflow notification settings ([#1990](https://github.com/XRPLF/clio/pull/1990))
- Fixed clang-tidy 'fixes' ([#1996](https://github.com/XRPLF/clio/pull/1996))
- Ensured that Dependabot runs for all local actions ([#2018](https://github.com/XRPLF/clio/pull/2018))
- Pinned external actions using hashes ([#2019](https://github.com/XRPLF/clio/pull/2019))
- Fixed FiD time field to be a string in Dependabot config ([#2024](https://github.com/XRPLF/clio/pull/2024))
- [DEPENDABOT] bumped docker/build-push-action from 5.4.0 to 6.15.0 in /.github/actions/build_docker_image ([#2027](https://github.com/XRPLF/clio/pull/2027))
- Removed dead code related to centos ([#2028](https://github.com/XRPLF/clio/pull/2028))
- [DEPENDABOT] bumped docker/build-push-action from 6.15.0 to 6.16.0 in /.github/actions/build_docker_image ([#2030](https://github.com/XRPLF/clio/pull/2030))
- Specified Conan profile explicitly and stopped overriding it ([#2042](https://github.com/XRPLF/clio/pull/2042))
- Capitalized Dockerfile to add support of tools ([#2045](https://github.com/XRPLF/clio/pull/2045))
- Stopped using wandalen/wretry.action and updated to codecov/codecov-action ([#2050](https://github.com/XRPLF/clio/pull/2050))
- Disabled `add_label` for conventional commits ([#2054](https://github.com/XRPLF/clio/pull/2054))
- Attempted to push Docker images to ghcr.io ([#2051](https://github.com/XRPLF/clio/pull/2051))
- Used ghcr.io/xrplf/clio-ci Docker image ([#2055](https://github.com/XRPLF/clio/pull/2055))
- Ensured that only pre-commit hooks are used in `clang-tidy.yml` ([#2057](https://github.com/XRPLF/clio/pull/2057))
- Specified concurrency for Github workflows ([#2059](https://github.com/XRPLF/clio/pull/2059))
- Refactored how code coverage is run ([#2065](https://github.com/XRPLF/clio/pull/2065))
- Stopped using concurrency with `workflow_call` ([#2069](https://github.com/XRPLF/clio/pull/2069))
- Installed `ClangBuildAnalyzer` in the CI image ([#2071](https://github.com/XRPLF/clio/pull/2071))
- Moved clang build analyzer to nightly ([#2074](https://github.com/XRPLF/clio/pull/2074))
- Updated CI to fail if codecov upload fails ([#2078](https://github.com/XRPLF/clio/pull/2078))
- Ensured pre-commit workflow runs on heavy runner to make Doxygen work ([#2085](https://github.com/XRPLF/clio/pull/2085))
- Used XRPLF/clio-dev-team in dependabot ([#2081](https://github.com/XRPLF/clio/pull/2081))
- Fixed double quotes for all workflows and actions ([#2090](https://github.com/XRPLF/clio/pull/2090))
- Ensured that integration tests run on macOS ([#2080](https://github.com/XRPLF/clio/pull/2080))
- Attempted to remove whitespace to fix sanitizer build ([#2105](https://github.com/XRPLF/clio/pull/2105))
- Froze pre-commit hooks ([#2114](https://github.com/XRPLF/clio/pull/2114))
- Used XRPLF/clio-dev-team as team-reviewers, and updated assignees ([#2113](https://github.com/XRPLF/clio/pull/2113))
- Stopped using team-reviewers because creating PAT was too difficult ([#2117](https://github.com/XRPLF/clio/pull/2117))
- Explicitly specified workflow dependencies ([#2110](https://github.com/XRPLF/clio/pull/2110))
- Ensured that sanitizers run on script change ([#2122](https://github.com/XRPLF/clio/pull/2122))
- Installed git-cliff to generate changelog ([#2136](https://github.com/XRPLF/clio/pull/2136))
- [DEPENDABOT] bumped docker/build-push-action from 6.16.0 to 6.17.0 in /.github/actions/build_docker_image ([#2142](https://github.com/XRPLF/clio/pull/2142))
- [DEPENDABOT] bumped codecov/codecov-action from 5.4.2 to 5.4.3 ([#2141](https://github.com/XRPLF/clio/pull/2141))
- Fixed nagetive -> negative in RPC handler tests ([#2156](https://github.com/XRPLF/clio/pull/2156))
- Added missing workflow dependencies ([#2155](https://github.com/XRPLF/clio/pull/2155))
- [DEPENDABOT] bumped docker/build-push-action from 6.17.0 to 6.18.0 in /.github/actions/build_docker_image ([#2175](https://github.com/XRPLF/clio/pull/2175))
- Installed zip in Dockerfile ([#2176](https://github.com/XRPLF/clio/pull/2176))
- Added cancellable coroutines support ([#2180](https://github.com/XRPLF/clio/pull/2180))
- Reverted "feat: Use new web server by default ([#2182](https://github.com/XRPLF/clio/pull/2182))" ([#2187](https://github.com/XRPLF/clio/pull/2187))
- Updated Dockerfile to use gcc from Docker Hub ([#2194](https://github.com/XRPLF/clio/pull/2194))
- Updated libxrpl ([#2186](https://github.com/XRPLF/clio/pull/2186))
- Updated CI image to use Conan 2 ([#2178](https://github.com/XRPLF/clio/pull/2178))
- Removed flex and bison installation from CI image ([#2210](https://github.com/XRPLF/clio/pull/2210))
- Added `-Wunreachable-code` compiler flag ([#2216](https://github.com/XRPLF/clio/pull/2216))
- Uploaded conan deps for all profiles ([#2217](https://github.com/XRPLF/clio/pull/2217))
- [DEPENDABOT] bumped docker/setup-buildx-action from 3.10.0 to 3.11.0 in /.github/actions/build_docker_image ([#2235](https://github.com/XRPLF/clio/pull/2235))
- Stopped using save/restore cache for conan, and switched to artifactory ([#2230](https://github.com/XRPLF/clio/pull/2230))
- Ensured that full build of conan dependencies happens only on schedule ([#2241](https://github.com/XRPLF/clio/pull/2241))
- Silence brew warnings ([#2255](https://github.com/XRPLF/clio/pull/2255))
- Cleaned up conanfile ([#2243](https://github.com/XRPLF/clio/pull/2243))
- Stopped using self-hosted runner tag ([#2248](https://github.com/XRPLF/clio/pull/2248))
- Stopped using dynamic names when not needed ([#2251](https://github.com/XRPLF/clio/pull/2251))
- Updated `conan.lock` ([#2250](https://github.com/XRPLF/clio/pull/2250))
- [DEPENDABOT] bumped docker/setup-buildx-action from 3.11.0 to 3.11.1 in /.github/actions/build_docker_image ([#2256](https://github.com/XRPLF/clio/pull/2256))
- Updated `fmt` to version 11.2.0 ([#2281](https://github.com/XRPLF/clio/pull/2281))
- Updated LLVM tools to v20 ([#2278](https://github.com/XRPLF/clio/pull/2278))
- Stopped hardcoding versions in Dockerfiles and workflows ([#2291](https://github.com/XRPLF/clio/pull/2291))
- Added mold to tools image ([#2301](https://github.com/XRPLF/clio/pull/2301)) 
- Built tools image separately for different architectures ([#2302](https://github.com/XRPLF/clio/pull/2302))
- Bumped tools docker image version ([#2303](https://github.com/XRPLF/clio/pull/2303)) 
- Updated conan revisions ([#2308](https://github.com/XRPLF/clio/pull/2308))
- Removed redundant words in comment ([#2309](https://github.com/XRPLF/clio/pull/2309))
- Unified how branches are dealt with ([#2320](https://github.com/XRPLF/clio/pull/2320))
- Removed usage of BlockingCache due to a bug ([#2328](https://github.com/XRPLF/clio/pull/2328)) 
- Added trufflehog security tool ([#2334](https://github.com/XRPLF/clio/pull/2334))
- Stopped hardcoding xrplf repo when building docker images ([#2336](https://github.com/XRPLF/clio/pull/2336))
- Stopped hardcoding gcc version in ci/Dockerfile ([#2337](https://github.com/XRPLF/clio/pull/2337))
- Stopped hardcoding python filename in gcc Dockerfile ([#2340](https://github.com/XRPLF/clio/pull/2340))
- Installed apple-clang 17 locally ([#2342](https://github.com/XRPLF/clio/pull/2342))
- Updated build to skip tsan unit tests ([#2347](https://github.com/XRPLF/clio/pull/2347))
- Ensured that `upload_conan_deps` workflow runs on necessary changes in `.github/scripts/conan/` ([#2348](https://github.com/XRPLF/clio/pull/2348))
- Updated Clio to use the new web server by default ([#2182](https://github.com/XRPLF/clio/pull/2182))
- Added load balancer prometheus metrics ([#2096](https://github.com/XRPLF/clio/pull/2096))
- Introduced `release_impl.yml` workflow to automatically create releases ([#2043](https://github.com/XRPLF/clio/pull/2043))
- Implemented clang build analyzer ([#2072](https://github.com/XRPLF/clio/pull/2072))
- Added hadolint Docker pre-commit hook ([#2135](https://github.com/XRPLF/clio/pull/2135))
- Added ability to create releases in CI ([#2168](https://github.com/XRPLF/clio/pull/2168))
- Added new Docker images structure, tools image ([#2185](https://github.com/XRPLF/clio/pull/2185))
- Added ubsan build to nightly release ([#2190](https://github.com/XRPLF/clio/pull/2190))
- Ensured Conan 2 always builds with native architecture ([#2201](https://github.com/XRPLF/clio/pull/2201))
- Added ability to pass sanitizer as part of `conan_profile` ([#2189](https://github.com/XRPLF/clio/pull/2189))
- Added flags to deps for sanitizer builds ([#2205](https://github.com/XRPLF/clio/pull/2205))
- Implemented native GCC build with subsequent image merge ([#2212](https://github.com/XRPLF/clio/pull/2212))
- Added Conan lockfile ([#2220](https://github.com/XRPLF/clio/pull/2220))
- Ensured that all possible Conan configurations are built in CI ([#2225](https://github.com/XRPLF/clio/pull/2225))
- Added sanitizer support for macOS dependency builds([#2240](https://github.com/XRPLF/clio/pull/2240))
- Ensured that sanitizers are built with Clang ([#2239](https://github.com/XRPLF/clio/pull/2239))
- Added `init_conan script` ([#2242](https://github.com/XRPLF/clio/pull/2242))
- Added parallel download and upload for Conan packages ([#2254](https://github.com/XRPLF/clio/pull/2254))
- Switched Clio to use Conan v2 ([#2179](https://github.com/XRPLF/clio/pull/2179))
- Switched to xrpl/2.5.0 release ([#2267](https://github.com/XRPLF/clio/pull/2267))
- Updated to Clang 19 ([#2293](https://github.com/XRPLF/clio/pull/2293))
- Added ability to run sanitizers for Debug builds ([#2296](https://github.com/XRPLF/clio/pull/2296))
- Added script to rebuild conan dependencies ([#2311](https://github.com/XRPLF/clio/pull/2311))
- Ensured that the Clio version from tag is always used if available ([#2322](https://github.com/XRPLF/clio/pull/2322))
- Updated to GCC version 14.3 ([#2344](https://github.com/XRPLF/clio/pull/2344))

## Testing Credits

- Thanks to [@mounikakun](https://githuddb.com/mounikakun) and others for testing this release.

## Contributors

The following people contributed directly to this release:

- [@godexsoft](https://github.com/godexsoft)
- [@mathbunnyru](https://github.com/mathbunnyru)
- [@maria-robobug](https://github.com/maria-robobug)
- [@kuznetsss](https://github.com/kuznetsss)
- [@dependabot](https://github.com/dependabot)
- [@PeterChen13579](https://github.com/PeterChen13579)
- [@mounikakun](https://github.com/mounikakun)
- [@cindyyan317](https://github.com/cindyyan317)

## Feedback

To report an issue or propose a new idea, please [open an issue](https://github.com/XRPLF/clio/issues).
