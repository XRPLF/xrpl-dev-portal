---
category: 2025
date: "2025-07-10"
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
Merge: b8b82e5d 8fcc2dfa
Author: Sergey Kuznetsov <skuznetsov@ripple.com>
Date:   Mon Jun 30 11:32:26 2025 +0100

    chore: Commits for 2.5.0 (#2268)
```

### What's Changed

See the [Full Changelog on GitHub](https://github.com/XRPLF/clio/compare/2.4.1...2.5.0).

### Features

- Add extensions for ETLng ([#1967](https://github.com/XRPLF/clio/pull/1967)) by [@godexsoft](https://github.com/godexsoft)
- Implement snapshot import feature ([#1970](https://github.com/XRPLF/clio/pull/1970)) by [@cindyyan317](https://github.com/cindyyan317)
- Add ETLng integration ([#1986](https://github.com/XRPLF/clio/pull/1986)) by [@godexsoft](https://github.com/godexsoft)
- Add ability for nodes to share information or status via the database ([#1976](https://github.com/XRPLF/clio/pull/1976)) by [@kuznetsss](https://github.com/kuznetsss)
- Update forwarding cache to queue similar requests during entry updates ([#1997](https://github.com/XRPLF/clio/pull/1997)) by [@kuznetsss](https://github.com/kuznetsss)
- Introduce `release_impl.yml` workflow to automatically create releases ([#2043](https://github.com/XRPLF/clio/pull/2043)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Implement clang build analyzer ([#2072](https://github.com/XRPLF/clio/pull/2072)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Add load balancer prometheus metrics ([#2096](https://github.com/XRPLF/clio/pull/2096)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Implement `FetchLedgerBySeq` caching to address uneven DB shard access ([#2014](https://github.com/XRPLF/clio/pull/2014)) by [@PeterChen13579](https://github.com/PeterChen13579)
- Add support for Dosguard API weights ([#2082](https://github.com/XRPLF/clio/pull/2082)) by [@kuznetsss](https://github.com/kuznetsss)
- Implement load balancer metrics in ETLng ([#2119](https://github.com/XRPLF/clio/pull/2119)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Add hadolint Docker pre-commit hook ([#2135](https://github.com/XRPLF/clio/pull/2135)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Add account permission support ([#2145](https://github.com/XRPLF/clio/pull/2145)) by [@kuznetsss](https://github.com/kuznetsss)
- Add get range functionality to export tool ([#2131](https://github.com/XRPLF/clio/pull/2131)) by [@PeterChen13579](https://github.com/PeterChen13579)
- Refactor ETLng publisher and service ([#2138](https://github.com/XRPLF/clio/pull/2138)) by [@godexsoft](https://github.com/godexsoft)
- Add ETLng MPT support ([#2154](https://github.com/XRPLF/clio/pull/2154)) by [@godexsoft](https://github.com/godexsoft)
- Add support for Batch transactions ([#2162](https://github.com/XRPLF/clio/pull/2162)) by [@PeterChen13579](https://github.com/PeterChen13579)
- Update Clio to use the new web server by default ([#2182](https://github.com/XRPLF/clio/pull/2182)) by [@kuznetsss](https://github.com/kuznetsss)
- Add ability to create releases in CI ([#2168](https://github.com/XRPLF/clio/pull/2168)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Add new Docker images structure, tools image ([#2185](https://github.com/XRPLF/clio/pull/2185)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Add ubsan build to nightly release ([#2190](https://github.com/XRPLF/clio/pull/2190)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Add support for Permissioned DEX ([#2152](https://github.com/XRPLF/clio/pull/2152)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Switch Clio to use Conan v2 ([#2179](https://github.com/XRPLF/clio/pull/2179)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Always build with native arch in Conan 2 ([#2201](https://github.com/XRPLF/clio/pull/2201)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Pass sanitizer as part of `conan_profile` ([#2189](https://github.com/XRPLF/clio/pull/2189)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Add flags to deps for sanitizer builds ([#2205](https://github.com/XRPLF/clio/pull/2205)) by [@godexsoft](https://github.com/godexsoft)
- Add read-write switching in ETLng ([#2199](https://github.com/XRPLF/clio/pull/2199)) by [@godexsoft](https://github.com/godexsoft)
- Build GCC natively and then merge the image ([#2212](https://github.com/XRPLF/clio/pull/2212)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Add Conan lockfile ([#2220](https://github.com/XRPLF/clio/pull/2220)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Build all possible Conan configurations in CI ([#2225](https://github.com/XRPLF/clio/pull/2225)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Add start and finish sequence support in ETLng ([#2226](https://github.com/XRPLF/clio/pull/2226)) by [@godexsoft](https://github.com/godexsoft)
- Add sanitizer support for macOS dependency builds([#2240](https://github.com/XRPLF/clio/pull/2240)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Add graceful shutdown and cleanup for ETLng ([#2232](https://github.com/XRPLF/clio/pull/2232)) by [@godexsoft](https://github.com/godexsoft)
- Build sanitizers with Clang ([#2239](https://github.com/XRPLF/clio/pull/2239)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Add parallel download and upload for Conan packages ([#2254](https://github.com/XRPLF/clio/pull/2254)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Add `init_conan script` ([#2242](https://github.com/XRPLF/clio/pull/2242)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Add support for Token Escrow ([#2252](https://github.com/XRPLF/clio/pull/2252)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Add support for Single Asset Vault ([#1979](https://github.com/XRPLF/clio/pull/1979)) by [@PeterChen13579](https://github.com/PeterChen13579)
- Switch to xrpl/2.5.0 release ([#2267](https://github.com/XRPLF/clio/pull/2267)) by [@mathbunnyru](https://github.com/mathbunnyru)

### Bug Fixes

- Update `ripple_flag` logic in account lines to match `rippled` implementation ([#1969](https://github.com/XRPLF/clio/pull/1969)) by [@PeterChen13579](https://github.com/PeterChen13579)
- Fix issue with SSL in new webserver ([#1981](https://github.com/XRPLF/clio/pull/1981)) by [@kuznetsss](https://github.com/kuznetsss)
- Fix incorrect `HighDeepFreeze` flag setting ([#1978](https://github.com/XRPLF/clio/pull/1978)) by [@PeterChen13579](https://github.com/PeterChen13579)
- Fix CTID issue ([#2001](https://github.com/XRPLF/clio/pull/2001)) by [@PeterChen13579](https://github.com/PeterChen13579)
- Fix incorrect requests logging ([#2005](https://github.com/XRPLF/clio/pull/2005)) by [@kuznetsss](https://github.com/kuznetsss)
- Pin cmake version in CI Dockerfile ([#2036](https://github.com/XRPLF/clio/pull/2036)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Add CTID to all RPC's that include transactions ([#2011](https://github.com/XRPLF/clio/pull/2011)) by [@PeterChen13579](https://github.com/PeterChen13579)
- Add missing paths to `update_docker_ci.yml` ([#2044](https://github.com/XRPLF/clio/pull/2044)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Use ytanikin/pr-conventional-commits action for conventional commits check ([#2049](https://github.com/XRPLF/clio/pull/2049)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Remove Mac CMake installation error ([#2040](https://github.com/XRPLF/clio/pull/2040)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Don't use `steps.conan.outputs.conan_profile` as it doesn't exist anymore ([#2056](https://github.com/XRPLF/clio/pull/2056)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Quote release title ([#2064](https://github.com/XRPLF/clio/pull/2064)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Fix flaky test in ETLng ([#2077](https://github.com/XRPLF/clio/pull/2077)) by [@godexsoft](https://github.com/godexsoft)
- Pass `secrets.CODECOV_TOKEN` explicitly ([#2079](https://github.com/XRPLF/clio/pull/2079)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Make ctors/dtors public in tests ([#2089](https://github.com/XRPLF/clio/pull/2089)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Make `fix-local-includes.sh` work on file-basis ([#2099](https://github.com/XRPLF/clio/pull/2099)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Catch exception in `ClusterCommunicationService` ([#2093](https://github.com/XRPLF/clio/pull/2093)) by [@kuznetsss](https://github.com/kuznetsss)
- Make `fix-local-includes.sh` work with multiple files ([#2102](https://github.com/XRPLF/clio/pull/2102)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Guarantee async behavior of `WsBase::send` ([#2100](https://github.com/XRPLF/clio/pull/2100)) by [@godexsoft](https://github.com/godexsoft)
- Run `clang-format` after tidy ([#2108](https://github.com/XRPLF/clio/pull/2108)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Do not rewrite original file if it hasn't changed in `fix-local-includes.sh` ([#2109](https://github.com/XRPLF/clio/pull/2109)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Fix build with sanitizers ([#2118](https://github.com/XRPLF/clio/pull/2118)) by [@kuznetsss](https://github.com/kuznetsss)
- Use `git lfs install` and `fix verify-commits` hook ([#2129](https://github.com/XRPLF/clio/pull/2129)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Fixe some Doxygen docs errors ([#2130](https://github.com/XRPLF/clio/pull/2130)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Add `Delegate` to Ledger types ([#2151](https://github.com/XRPLF/clio/pull/2151)) by [@kuznetsss](https://github.com/kuznetsss)
- Use `UniformRandomGenerator` class to prevent threading issue ([#2165](https://github.com/XRPLF/clio/pull/2165)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Add style to the name of pre-commit autoupdate PR title ([#2177](https://github.com/XRPLF/clio/pull/2177)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Add README to docker/compilers ([#2188](https://github.com/XRPLF/clio/pull/2188)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Analyze build time on clang as well ([#2195](https://github.com/XRPLF/clio/pull/2195)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Only set compile flag for grpc ([#2204](https://github.com/XRPLF/clio/pull/2204)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Make GHCR lowercase ([#2218](https://github.com/XRPLF/clio/pull/2218)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Use Conan v2 dirs and commands in docs ([#2219](https://github.com/XRPLF/clio/pull/2219)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Run `upload_conan_deps.yml` on `conan.lock` changes ([#2227](https://github.com/XRPLF/clio/pull/2227)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Return `domainMalformed` when domain is malformed ([#2228](https://github.com/XRPLF/clio/pull/2228)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Add domain to `book_changes` ([#2229](https://github.com/XRPLF/clio/pull/2229)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Update CI image to provide `global.conf` for sanitizers to affect `package_id` ([#2233](https://github.com/XRPLF/clio/pull/2233)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Use new CI image with `global.conf` for sanitizers to affect `package_id` ([#2234](https://github.com/XRPLF/clio/pull/2234)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Force reupload new artifacts ([#2236](https://github.com/XRPLF/clio/pull/2236)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Make `update-libxrpl-version` work with lockfile ([#2249](https://github.com/XRPLF/clio/pull/2249)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Disable conan uploads on schedule ([#2253](https://github.com/XRPLF/clio/pull/2253)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Don't cancel CI image builds ([#2259](https://github.com/XRPLF/clio/pull/2259)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Pin `lxml` dependency to version <6.0.0 ([#2269](https://github.com/XRPLF/clio/pull/2269)) by [@mathbunnyru](https://github.com/mathbunnyru)

### Refactor

- Compare `error_code` with enum values, not hardcoded ints ([#2023](https://github.com/XRPLF/clio/pull/2023)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Add `str()` method to `BaseTagDecorator` ([#2020](https://github.com/XRPLF/clio/pull/2020)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Improve load balancer forwarding metrics ([#2103](https://github.com/XRPLF/clio/pull/2103)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Remove old config ([#2097](https://github.com/XRPLF/clio/pull/2097)) by [@PeterChen13579](https://github.com/PeterChen13579)
- Use `std::expected` instead of `std::variant` for errors ([#2160](https://github.com/XRPLF/clio/pull/2160)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Simplify `check_config` implementation ([#2247](https://github.com/XRPLF/clio/pull/2247)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Refactor GCC image to make upgrades easier ([#2246](https://github.com/XRPLF/clio/pull/2246)) by [@mathbunnyru](https://github.com/mathbunnyru)

### Documentation

- Verify/review config descriptions ([#1960](https://github.com/XRPLF/clio/pull/1960)) by [@maria-robobug](https://github.com/maria-robobug)
- Improve wording in docs ([#2095](https://github.com/XRPLF/clio/pull/2095)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Add information about `global.conf` ([#2238](https://github.com/XRPLF/clio/pull/2238)) by [@mathbunnyru](https://github.com/mathbunnyru)

### Styling

- Use pre-commit tool and add simple config ([#2029](https://github.com/XRPLF/clio/pull/2029)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Add prettier pre-commit hook ([#2031](https://github.com/XRPLF/clio/pull/2031)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Apply `go fmt` to Go code ([#2046](https://github.com/XRPLF/clio/pull/2046)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Add markdownlint pre-commit hook ([#2038](https://github.com/XRPLF/clio/pull/2038)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Add typos pre-commit hook ([#2041](https://github.com/XRPLF/clio/pull/2041)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Add C++ pre-commit hooks ([#2039](https://github.com/XRPLF/clio/pull/2039)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Improve actions and workflows style ([#2060](https://github.com/XRPLF/clio/pull/2060)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Use `codespell` instead of `typos` pre-commit hook ([#2104](https://github.com/XRPLF/clio/pull/2104)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Mark JSON literal strings with R"JSON ([#2169](https://github.com/XRPLF/clio/pull/2169)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Beautify installation lists in Dockerfile ([#2172](https://github.com/XRPLF/clio/pull/2172)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Put static before type ([#2231](https://github.com/XRPLF/clio/pull/2231)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Fix JSON style in C++ code ([#2262](https://github.com/XRPLF/clio/pull/2262)) by [@mathbunnyru](https://github.com/mathbunnyru)

### Testing

- Add `build_and_test` reusable workflow ([#2048](https://github.com/XRPLF/clio/pull/2048)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Remove `SetUp` and `TearDown` methods in tests ([#2086](https://github.com/XRPLF/clio/pull/2086)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Increase Cassandra timeouts in tests ([#2127](https://github.com/XRPLF/clio/pull/2127)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Run undefined sanitizer without ignoring errors ([#2134](https://github.com/XRPLF/clio/pull/2134)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Skip slow DB sleep-based test on Mac ([#2148](https://github.com/XRPLF/clio/pull/2148)) by [@mathbunnyru](https://github.com/mathbunnyru)

### Miscellaneous Tasks

- Add git-cliff config ([#1965](https://github.com/XRPLF/clio/pull/1965)) by [@kuznetsss](https://github.com/kuznetsss)
- Pin cmake 3.31.6 for macOS runners ([#1983](https://github.com/XRPLF/clio/pull/1983)) by [@kuznetsss](https://github.com/kuznetsss)
- Update maintainers ([#1987](https://github.com/XRPLF/clio/pull/1987)) by [@godexsoft](https://github.com/godexsoft)
- Update workflow notification settings ([#1990](https://github.com/XRPLF/clio/pull/1990)) by [@godexsoft](https://github.com/godexsoft)
- Fix clang-tidy 'fixes' ([#1996](https://github.com/XRPLF/clio/pull/1996)) by [@godexsoft](https://github.com/godexsoft)
- Run Dependabot for all local actions ([#2018](https://github.com/XRPLF/clio/pull/2018)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Pin external actions using hashes ([#2019](https://github.com/XRPLF/clio/pull/2019)) by [@mathbunnyru](https://github.com/mathbunnyru)
- FiD time field to be string in Dependabot config ([#2024](https://github.com/XRPLF/clio/pull/2024)) by [@mathbunnyru](https://github.com/mathbunnyru)
- [DEPENDABOT] bump docker/build-push-action from 5.4.0 to 6.15.0 in /.github/actions/build_docker_image ([#2027](https://github.com/XRPLF/clio/pull/2027)) by [@dependabot](https://github.com/dependabot)[bot]
- Remove dead code related to centos ([#2028](https://github.com/XRPLF/clio/pull/2028)) by [@mathbunnyru](https://github.com/mathbunnyru)
- [DEPENDABOT] bump docker/build-push-action from 6.15.0 to 6.16.0 in /.github/actions/build_docker_image ([#2030](https://github.com/XRPLF/clio/pull/2030)) by [@dependabot](https://github.com/dependabot)[bot]
- Specify Conan profile explicitly and don't override it ([#2042](https://github.com/XRPLF/clio/pull/2042)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Capitalize Dockerfile to add support of tools ([#2045](https://github.com/XRPLF/clio/pull/2045)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Don't use wandalen/wretry.action and update codecov/codecov-action ([#2050](https://github.com/XRPLF/clio/pull/2050)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Disable `add_label` for conventional commits ([#2054](https://github.com/XRPLF/clio/pull/2054)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Try to push to ghcr.io ([#2051](https://github.com/XRPLF/clio/pull/2051)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Use ghcr.io/xrplf/clio-ci Docker image ([#2055](https://github.com/XRPLF/clio/pull/2055)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Use only pre-commit hooks ([#2057](https://github.com/XRPLF/clio/pull/2057)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Specify concurrency for Github workflows ([#2059](https://github.com/XRPLF/clio/pull/2059)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Refactor how we run code coverage ([#2065](https://github.com/XRPLF/clio/pull/2065)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Don't use concurrency with workflow_call ([#2069](https://github.com/XRPLF/clio/pull/2069)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Install `ClangBuildAnalyzer` in the ci image ([#2071](https://github.com/XRPLF/clio/pull/2071)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Move clang build analyzer to nightly ([#2074](https://github.com/XRPLF/clio/pull/2074)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Fail CI if codecov upload fails ([#2078](https://github.com/XRPLF/clio/pull/2078)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Run pre-commit workflow on heavy runner to make doxygen work ([#2085](https://github.com/XRPLF/clio/pull/2085)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Use XRPLF/clio-dev-team in dependabot ([#2081](https://github.com/XRPLF/clio/pull/2081)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Fix double quotes for all workflows and actions ([#2090](https://github.com/XRPLF/clio/pull/2090)) by [@godexsoft](https://github.com/godexsoft)
- Run integration tests on macOS ([#2080](https://github.com/XRPLF/clio/pull/2080)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Attempt to remove whitespace to fix sanitizer build ([#2105](https://github.com/XRPLF/clio/pull/2105)) by [@godexsoft](https://github.com/godexsoft)
- Freeze pre-commit hooks ([#2114](https://github.com/XRPLF/clio/pull/2114)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Use XRPLF/clio-dev-team as team-reviewers, update assignees ([#2113](https://github.com/XRPLF/clio/pull/2113)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Don't use team-reviewers because creating PAT is too difficult ([#2117](https://github.com/XRPLF/clio/pull/2117)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Explicitly specify workflow dependencies ([#2110](https://github.com/XRPLF/clio/pull/2110)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Run sanitizers on script change ([#2122](https://github.com/XRPLF/clio/pull/2122)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Install git-cliff to generate changelog ([#2136](https://github.com/XRPLF/clio/pull/2136)) by [@mathbunnyru](https://github.com/mathbunnyru)
- [DEPENDABOT] bump docker/build-push-action from 6.16.0 to 6.17.0 in /.github/actions/build_docker_image ([#2142](https://github.com/XRPLF/clio/pull/2142)) by [@dependabot](https://github.com/dependabot)[bot]
- [DEPENDABOT] bump codecov/codecov-action from 5.4.2 to 5.4.3 ([#2141](https://github.com/XRPLF/clio/pull/2141)) by [@dependabot](https://github.com/dependabot)[bot]
- Fix: nagetive -> negative ([#2156](https://github.com/XRPLF/clio/pull/2156)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Add missing workflow dependencies ([#2155](https://github.com/XRPLF/clio/pull/2155)) by [@mathbunnyru](https://github.com/mathbunnyru)
- [DEPENDABOT] bump docker/build-push-action from 6.17.0 to 6.18.0 in /.github/actions/build_docker_image ([#2175](https://github.com/XRPLF/clio/pull/2175)) by [@dependabot](https://github.com/dependabot)[bot]
- Install zip in Dockerfile ([#2176](https://github.com/XRPLF/clio/pull/2176)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Cancellable coroutines ([#2180](https://github.com/XRPLF/clio/pull/2180)) by [@kuznetsss](https://github.com/kuznetsss)
- Revert "feat: Use new web server by default ([#2182](https://github.com/XRPLF/clio/pull/2182))" ([#2187](https://github.com/XRPLF/clio/pull/2187)) by [@kuznetsss](https://github.com/kuznetsss)
- Use gcc from Docker Hub for now ([#2194](https://github.com/XRPLF/clio/pull/2194)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Update libxrpl ([#2186](https://github.com/XRPLF/clio/pull/2186)) by [@PeterChen13579](https://github.com/PeterChen13579)
- Update CI image to use Conan 2 ([#2178](https://github.com/XRPLF/clio/pull/2178)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Don't flex and don't install bison in CI image ([#2210](https://github.com/XRPLF/clio/pull/2210)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Unreachable code is error ([#2216](https://github.com/XRPLF/clio/pull/2216)) by [@godexsoft](https://github.com/godexsoft)
- Upload conan deps for all profiles ([#2217](https://github.com/XRPLF/clio/pull/2217)) by [@mathbunnyru](https://github.com/mathbunnyru)
- [DEPENDABOT] bump docker/setup-buildx-action from 3.10.0 to 3.11.0 in /.github/actions/build_docker_image ([#2235](https://github.com/XRPLF/clio/pull/2235)) by [@dependabot](https://github.com/dependabot)[bot]
- Don't use save/restore cache for conan; use artifactory ([#2230](https://github.com/XRPLF/clio/pull/2230)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Full build conan dependencies only on schedule ([#2241](https://github.com/XRPLF/clio/pull/2241)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Silence brew warnings ([#2255](https://github.com/XRPLF/clio/pull/2255)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Cleanup conanfile ([#2243](https://github.com/XRPLF/clio/pull/2243)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Don't use self-hosted runner tag ([#2248](https://github.com/XRPLF/clio/pull/2248)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Don't use dynamic names when they are not needed ([#2251](https://github.com/XRPLF/clio/pull/2251)) by [@mathbunnyru](https://github.com/mathbunnyru)
- Update `conan.lock` ([#2250](https://github.com/XRPLF/clio/pull/2250)) by [@mathbunnyru](https://github.com/mathbunnyru)
- [DEPENDABOT] bump docker/setup-buildx-action from 3.11.0 to 3.11.1 in /.github/actions/build_docker_image ([#2256](https://github.com/XRPLF/clio/pull/2256)) by [@dependabot](https://github.com/dependabot)[bot] 

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
