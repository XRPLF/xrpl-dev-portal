---
category: 2020
date: 2020-08-19
labels:
    - rippled Release Notes
theme:
    markdown:
        editPage:
            hide: true
---
# Introducing XRP Ledger version 1.6.0

**XRP Ledger (`rippled` server) version 1.6.0** has been released. This release introduces several new features including changes to the XRP Ledger's consensus mechanism to make it even more robust in adverse conditions, as well as numerous bug fixes and optimizations. _(This post has been updated with recommendations for upgrading.)_

<!-- BREAK -->

## Action Required

This release introduces three new amendments to the XRP Ledger protocol: fixAmendmentMajorityCalc, HardenedValidations, and fix1781. These amendments are now **open for voting** according to the XRP Ledger's [amendment process](https://xrpl.org/amendments.html), which enables protocol changes following two weeks of >80% support from trusted validators.

**If you operate an XRP Ledger server,** then you should upgrade to version 1.6.0 by 2020-09-02, to ensure service continuity. The exact time that protocol changes take effect could be on that date or later, depending on the voting decisions of the decentralized network.

If you operate an XRP Ledger validator, please [learn more about these amendments](https://xrpl.org/known-amendments.html) so you can make informed decisions about if and when your validator should [support them](https://xrpl.org/amendments.html#configuring-amendment-voting). If you take no action, your validator begins voting in favor of the new amendments as soon as it has been upgraded.

### Upgrading

For instructions on updating XRP Ledger on supported platforms, see here:

- [Install `rippled`](https://xrpl.org/install-rippled.html)

The SHA-256 hashes for the official packages are as follows:

| Package | SHA-256 |
|:--------|:--------|
| [RPM for Red Hat / CentOS (x86-64)](https://repos.ripple.com/repos/rippled-rpm/stable/rippled-1.6.0-1.el7.x86_64.rpm) | `894d1a7a4713bfbf16264dbef9e0958a25572e0f1fce588d5a8c00452fb68115` |
| [DEB for Ubuntu / Debian (x86-64)](https://repos.ripple.com/repos/rippled-deb/pool/stable/rippled_1.6.0-1_amd64.deb) | `1d29124623bd81ba6eaf8a74bf7e14a18c511312d29213bfa6dc3351d30eedba` |

For other platforms, please compile version 1.6.0 from source.

* [Build on Ubuntu Linux](https://xrpl.org/build-run-rippled-ubuntu.html)

* [Build on macOS](https://xrpl.org/build-run-rippled-macos.html)

* [Build on other platforms](https://github.com/ripple/rippled/tree/master/Builds)

The first log entry should be the change setting the version:

```text
commit 01bd5a2646cda78ee09d2067c287c8f89872736d
Author: manojsdoshi <mdoshi@ripple.com>
Date:   Tue Aug 18 15:32:50 2020 -0700

    Set version to 1.6.0
```

## Change Summary

### New and Improved Features

- **Initial implementation of Negative UNL functionality:** This change can improve the liveness of the network during periods of network instability, by allowing servers to track which validators are temporarily offline and to adjust quorum calculations to match. This change requires an amendment, but the amendment is not in the **1.6.0** release. Ripple expects to run extensive public testing for Negative UNL functionality on the Devnet in the coming weeks. If public testing satisfies all requirements across security, reliability, stability, and performance, then the amendment could be included in a version 2.0 release. [[#3380](https://github.com/ripple/rippled/pull/3380)]

- **Validation Hardening:** This change allows servers to detect accidental misconfiguration of validators, as well as potentially Byzantine behavior by malicious validators. Servers can now log a message to notify operators if they detect a single validator issuing validations for multiple, incompatible ledger versions, or validations from multiple servers sharing a key. As part of this update, validators report the version of `rippled` they are using, as well as the hash of the last ledger they consider to be fully validated, in validation messages. [[#3291](https://github.com/ripple/rippled/pull/3291)] ![Amendment: Required](https://img.shields.io/badge/Amendment-Required-red)

- **Software Upgrade Monitoring & Notification:** After the `HardenedValidations` amendment is enabled and the validators begin reporting the versions of `rippled` they are running, a server can check how many of the validators on its UNL run a newer version of the software than itself. If more than 60% of a server's validators are running a newer version, the server writes a message to notify the operator to consider upgrading their software. [[#3447](https://github.com/ripple/rippled/pull/3447)]

- **Link Compression:** Beginning with **1.6.0**, server operators can enable support for compressing peer-to-peer messages. This can save bandwidth at a cost of higher CPU usage, which should prove useful for servers with a large number of peers. This support is disabled by default and can be enabled in your server's config file. [[#3287](https://github.com/ripple/rippled/pull/3287)]

- **Unconditionalize Amendments that were enabled in 2017:** This change removes legacy code which the network has not used since 2017. This change limits the ability to [replay](https://github.com/xrp-community/standards-drafts/issues/14) ledgers that rely on the pre-2017 behavior. [[#3292](https://github.com/ripple/rippled/pull/3292)]

- **New Health Check Method:** Perform a simple HTTP request to get a summary of the health of the server: Healthy, Warning, or Critical. [[#3365](https://github.com/ripple/rippled/pull/3365)]

- **Start work on API version 2.** Version 2 of the API will be part of a future release. The first breaking change will be to consolidate several closely related error messages that can occur when the server is not synced into a single "notSynced" error message. [[#3269](https://github.com/ripple/rippled/pull/3269)]

- **Improved shard concurrency:** Improvements to the shard engine have helped reduce the lock scope on all public functions, increasing the concurrency of the code. [[#3251](https://github.com/ripple/rippled/pull/3251)]

- **Default Port:** In the config file, the `[ips_fixed]` and `[ips]` stanzas now use the [IANA-assigned port](https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml?search=2459) for the XRP Ledger protocol (2459) when no port is specified. The `connect` API method also uses the same port by default. [[#2861](https://github.com/ripple/rippled/pull/2861)].

- **Improve proposal and validation relaying**. The peer-to-peer protocol always relays trusted proposals and validations (as part of the [consensus process](https://xrpl.org/consensus.html)), but only relays _untrusted_ proposals and validations in certain circumstances. This update adds configuration options so server operators can fine-tune how their server handles untrusted proposals and validations, and changes the default behavior to prioritize untrusted validations higher than untrusted proposals.  [[#3391](https://github.com/ripple/rippled/pull/3391)]

- **Various Build and CI Improvements** including updates to RocksDB 6.7.3 [[#3356](https://github.com/ripple/rippled/pull/3356)], NuDB 2.0.3 [[#3437](https://github.com/ripple/rippled/pull/3437)], adjusting CMake settings so that rippled can be built as a submodule [[#3449](https://github.com/ripple/rippled/pull/3449)], and adding Travis CI settings for Ubuntu Bionic Beaver [[#3319](https://github.com/ripple/rippled/pull/3319)].

- **Better documentation in the config file** for online deletion and database tuning. [[#3429](https://github.com/ripple/rippled/pull/3429)]


### Bug Fixes

- Fix the 14 day timer to enable amendment to start at the correct quorum size [[#3396](https://github.com/ripple/rippled/pull/3396)]
- Improve online delete backend lock which addresses a possibility in the online delete process where one or more backend shared pointer references may become invalid during rotation. [[#3342](https://github.com/ripple/rippled/pull/3342)]
- Address an issue that can occur during the loading of validator tokens, where a deliberately malformed token could cause the server to crash during startup. [[#3326](https://github.com/ripple/rippled/pull/3326)]
- Add delivered amount to GetAccountTransactionHistory. The delivered_amount field was not being populated when calling GetAccountTransactionHistory. In contrast, the delivered_amount field was being populated when calling GetTransaction. This change populates delivered_amount in the response to GetAccountTransactionHistory, and adds a unit test to make sure the results delivered by GetTransaction and GetAccountTransactionHistory match each other. [[#3370](https://github.com/ripple/rippled/pull/3370)]
- Fix build issues for GCC 10 [[#3393](https://github.com/ripple/rippled/pull/3393)]
- Fix historical ledger acquisition - this fixes an issue where historical ledgers were acquired only since the last online deletion interval instead of the configured value to allow deletion.[[#3369](https://github.com/ripple/rippled/pull/3369)]
- Fix build issue with Docker [#3416](https://github.com/ripple/rippled/pull/3416)]
- Add Shard family. The App Family utilizes a single shared Tree Node and Full Below cache for all history shards. This can create a problem when acquiring a shard that shares an account state node that was recently cached from another shard operation. The new Shard Family class solves this issue by managing separate Tree Node and Full Below caches for each shard. [#3448](https://github.com/ripple/rippled/pull/3448)]
- Amendment table clean up which fixes a calculation issue with majority. [#3428](https://github.com/ripple/rippled/pull/3428)]
- Add the `ledger_cleaner` command to rippled command line help [[#3305](https://github.com/ripple/rippled/pull/3305)]
- Various typo and comments fixes.




## New Commits in This Release

- [`2b4486837`](https://github.com/ripple/rippled/commit/2b448683736398faa4e58d8f386c32356ad1d3c2)  Set version to 1.6.0-rc3
- [`f79a4a8cd`](https://github.com/ripple/rippled/commit/f79a4a8cdb6ede5dea2753129586fb78307a5f80) Revert "Remove CryptoConditionsSuite stub amendment:"
- [`7bb6b75f3`](https://github.com/ripple/rippled/commit/7bb6b75f3c8b31d00b4800b880c90ce63c287f54) Use the correct root hash for the tx tree
- [`e5d17a945`](https://github.com/ripple/rippled/commit/e5d17a945213eb154912cfe4d8ea2417ea87f03a) Set version to 1.6.0-rc2
- [`dbd5f0073`](https://github.com/ripple/rippled/commit/dbd5f0073e34bdead616ab30ae4db413363d9c4e) Revert support for deterministic shards:
- [`12c0e8148`](https://github.com/ripple/rippled/commit/12c0e8148bf1d3726bdd2d072f23c769bbe1a607) Improve naming of fields associated with the NegativeUNL
- [`72a9a2bdb`](https://github.com/ripple/rippled/commit/72a9a2bdbb82354446bd0a14d45fd42a35c70ba2) Reorder the Travis build:
- [`80860fa8f`](https://github.com/ripple/rippled/commit/80860fa8f574dba6ed2a3daeff1efaf402ca3ccf) Add preliminary support for Boost 1.74
- [`8cf542abb`](https://github.com/ripple/rippled/commit/8cf542abb04bdb58932adb7b67a6d7969b2fd789) Fix memory management issues with checkpointers:
- [`a931b020b`](https://github.com/ripple/rippled/commit/a931b020b5e8ed8ecc109e93c077554d68537f83) Switch to updated date library exception handling:
- [`d317060ae`](https://github.com/ripple/rippled/commit/d317060ae455dd31251bfe5d7d391c9c72420cd3) Fix a race condition with TrustedPublisherServer:
- [`eee07a4f9`](https://github.com/ripple/rippled/commit/eee07a4f96255296d418a8e24cafeb93116b3342) Add missing cstdint include
- [`7b048b423`](https://github.com/ripple/rippled/commit/7b048b423e8ae08a54018a89231d050b9f562855) Set version to 1.6.0-rc1
- [`a45920684`](https://github.com/ripple/rippled/commit/a459206848e8019d892b24e7c63fe4afef4a0ca4) Set version to 1.6.0-b9
- [`3a3b0b4c1`](https://github.com/ripple/rippled/commit/3a3b0b4c14af67209dcf6fc757c0f488e5412344) Modify health check API
- [`de0c52738`](https://github.com/ripple/rippled/commit/de0c52738785de8bf837f9124da65c7905e7bb5a) Set version to 1.6.0-b8
- [`b54453d1a`](https://github.com/ripple/rippled/commit/b54453d1a7f173e921c194c659264015568578d0) Fix a build issue caused by pip3 being unavailable
- [`706ca874b`](https://github.com/ripple/rippled/commit/706ca874b01d12a995dd8f914a713634878f1583) Implement negative UNL functionality:
- [`51bd4626b`](https://github.com/ripple/rippled/commit/51bd4626b191da7bd7ffea2a0ff08631fe41eae7) Implement version upgrade warning:
- [`cf6f40ea8`](https://github.com/ripple/rippled/commit/cf6f40ea8f4ddda2986d656d9ddeeb4904fe765d) Deprecate unused/obsolete error codes:
- [`d3798f629`](https://github.com/ripple/rippled/commit/d3798f62903df1bd24a5eb00a221963bf28f45f0) Remove CryptoConditionsSuite stub amendment:
- [`4e33a1abf`](https://github.com/ripple/rippled/commit/4e33a1abf72da95ce3e6f861c87c5f3719d70792) crawl_shards comment fix
- [`86e8f2e23`](https://github.com/ripple/rippled/commit/86e8f2e2324c79856bdb57e3af1fc81734163fe6) Add Shard Family
- [`91e857874`](https://github.com/ripple/rippled/commit/91e857874fdac6cf9dfee9f980ecdd7c0641921e) Improve LedgerMaster shard acquisition
- [`8f50fd051`](https://github.com/ripple/rippled/commit/8f50fd051e17c910d2d8026245d21ba35cda8f37) Use NuDB version 2.0.3
- [`94e8e9475`](https://github.com/ripple/rippled/commit/94e8e94750e0b308b3ab2e342275d47a846618f1) Add support for deterministic database shards (#2688):
- [`54ece72b6`](https://github.com/ripple/rippled/commit/54ece72b621610d3b0975ab6a63688c2232d423e) Update cmake so that rippled can build as a submodule
- [`4702c8b59`](https://github.com/ripple/rippled/commit/4702c8b591ad2681eac402371a24cb824797f1fa) Improve online_delete configuration and DB tuning:
- [`00702f28c`](https://github.com/ripple/rippled/commit/00702f28c2f56f4f5a9d1a3dd60fdb7cf9d9c96f) Improve reporting of ledger age in server_info
- [`df29e98ea`](https://github.com/ripple/rippled/commit/df29e98ea51e762491ef8549e0e9b1932e16eea0) Improve amendment processing and activation logic:
- [`fe9922d65`](https://github.com/ripple/rippled/commit/fe9922d65428136508bd6e2f62ebe787029581b3) Improve compression support:
- [`362a017ee`](https://github.com/ripple/rippled/commit/362a017eee942a36e8ab8e44c7ff1c86bebe3456) Cleanup SHAMap and simplify interfaces:
- [`e8f352522`](https://github.com/ripple/rippled/commit/e8f35252262b9efd14c84909f29c81a1434a4451) Improve Slice:
- [`1067086f7`](https://github.com/ripple/rippled/commit/1067086f71b56d58b29aaa60884495721432d4ad) Consolidate "Not Synced" error messages:
- [`0214d83aa`](https://github.com/ripple/rippled/commit/0214d83aa5fd53bae81d9e66ddb30609d0055b76) Improve handling of empty buffer in varint parsing (RIPD-1683)
- [`d69a90287`](https://github.com/ripple/rippled/commit/d69a902876e72e958bb78ea078e396d6a5f88c4d) Add comments to protobuf files
- [`f43aeda49`](https://github.com/ripple/rippled/commit/f43aeda49c5362dc83c66507cae2ec71cfa7bfdf) Set version to 1.6.0-b7
- [`27484f78a`](https://github.com/ripple/rippled/commit/27484f78a95aa8697dbaa9b898c86be941574dc7) Use libarchive version 3.4.3
- [`93bf77bde`](https://github.com/ripple/rippled/commit/93bf77bdec1321d99a52042bb53cced186421d83) Unit tests for database shards
- [`728651b5d`](https://github.com/ripple/rippled/commit/728651b5d57d8b2c6c7e7c5dbbd5768f8d3a8556) Use LZ4_decompress_safe
- [`fb74eefa9`](https://github.com/ripple/rippled/commit/fb74eefa9edff66d002beb00fce07fcbf740f32d) Update LZ4 library to 1.9.2
- [`853c96419`](https://github.com/ripple/rippled/commit/853c964194eab29781827100a0d05541b66df73e) Fix a build issue caused by the latest Docker version:  * The latest docker version is not supported by    artifactory causing the package build to fail.    Setting the docker version to 19.03.8 to fix the build.
- [`645c06764`](https://github.com/ripple/rippled/commit/645c06764b84b8c02ea0449c92e9e2ead15f18d5) Update the default port for [ips] and [ips_fixed]:
- [`2d23e7bd1`](https://github.com/ripple/rippled/commit/2d23e7bd18f179844b838b01783307994f603a85) Use std::size in place of std::extent
- [`0290d0b82`](https://github.com/ripple/rippled/commit/0290d0b82c3dcd190d2ce9dad4985ee33d1f845a) Create health_check rpc
- [`3d86b49da`](https://github.com/ripple/rippled/commit/3d86b49dae8173344b39deb75e53170a9b6c5284) Set version to 1.6.0-b6
- [`0b9e93580`](https://github.com/ripple/rippled/commit/0b9e935806e76e66b6c22cbd434d0ea49b54cf07) Find date::date in CMake package configuration file
- [`17412d17e`](https://github.com/ripple/rippled/commit/17412d17e205c860af1d28bb9fc7ee0e101c5145) Fix historical ledger acquisition when using online deletion:
- [`99f519369`](https://github.com/ripple/rippled/commit/99f5193699485f357721df9ae81fe0bd4bfabed7) Disable formatting operator&:
- [`328e42ad4`](https://github.com/ripple/rippled/commit/328e42ad4256597f5b448179aeb86dbb7ded130d) Minor cleanups:
- [`6d28f2a8d`](https://github.com/ripple/rippled/commit/6d28f2a8d9038715201915844007f40f63ed249f) Cleanup code using move semantics
- [`421417ab0`](https://github.com/ripple/rippled/commit/421417ab07757c5b417a971ad03cd79bd70f4cb5) Fixes for gcc 10
- [`68494a308`](https://github.com/ripple/rippled/commit/68494a308e15c679af368afaebf96c15095470d1) AmendmentTable improvements
- [`16f79d160`](https://github.com/ripple/rippled/commit/16f79d160ac65cb6e4977571548475e1866f23a4) Add delivered amount to GetAccountTransactionHistory responses
- [`8f984042f`](https://github.com/ripple/rippled/commit/8f984042f42fc7f6f5f6427a77507ea8a4706d09) Try to fix usage of pkg-config for static linking
- [`eb1a699c5`](https://github.com/ripple/rippled/commit/eb1a699c5afb5f90d44b1ab0a8047c79538ea905) Fix typo in error message
- [`ac766ec0e`](https://github.com/ripple/rippled/commit/ac766ec0eb19e0e4345c4177f3f99aa285a916f2) Introduce ShardArchiveHandler improvements:
- [`21340a1c1`](https://github.com/ripple/rippled/commit/21340a1c1e092b6f444b6dda7cc0bb284dcd534d) Validate LastLedgerHash for downloaded shards:
- [`c594f3b0c`](https://github.com/ripple/rippled/commit/c594f3b0cf3833f97d307e76ef39199b2480927b) Reduce visibility of retired amendment identifiers:
- [`268e28a27`](https://github.com/ripple/rippled/commit/268e28a278b717a227e2e5398f69cb3628e04b73) Tune relaying of untrusted proposals & validations:
- [`ca664b17d`](https://github.com/ripple/rippled/commit/ca664b17d39ca747b619970f9b148127c73001bf) Improve handling of sfLedgerSequence field:
- [`3936110c8`](https://github.com/ripple/rippled/commit/3936110c8d93b48bdca7eca7ae6019d438d44260) Use boost::circular_buffer:
- [`9f91870b1`](https://github.com/ripple/rippled/commit/9f91870b1cd6b0c164f9073e1bec7cbdd218868b) Adjust frequency of mtENDPOINTS messages
- [`97712107b`](https://github.com/ripple/rippled/commit/97712107b71a8e2089d2e3fcef9ebf5362951110) Set version to 1.6.0-b5
- [`d9fa14868`](https://github.com/ripple/rippled/commit/d9fa148688f468f7773219320d5d641852189fbe) Revert "Add PR automation for project boards"
- [`d88a7c73b`](https://github.com/ripple/rippled/commit/d88a7c73b48b895df27bf8fb8c9e081e798a68e4) Improve online delete backend locking
- [`894d3463c`](https://github.com/ripple/rippled/commit/894d3463ce95122b137d838d82380a9a4bbfe0ed) Extend unit testing of account_tx with deleted account:
- [`5b5226d51`](https://github.com/ripple/rippled/commit/5b5226d518aee7fd128053a71fd70ca0257f7453) Cleanup the 'PeerSet' hierarchy:
- [`d025f3fb2`](https://github.com/ripple/rippled/commit/d025f3fb2890296620ba2b1f19570cc5a9e3d466) Add descriptive comments to 'getRippledInfo.sh':
- [`11be30dd4`](https://github.com/ripple/rippled/commit/11be30dd40f2d9a177b340aa1de167f130fdeced) Correct typo in comment
- [`4fad421c8`](https://github.com/ripple/rippled/commit/4fad421c8af28de2de12e49e0f1897f9ea62824a) Correct typos in SECURITY.md
- [`57b3543e7`](https://github.com/ripple/rippled/commit/57b3543e7bad88885279784149e27e9084bbc6e8) Support boost 1.73
- [`a00543b6b`](https://github.com/ripple/rippled/commit/a00543b6bc6255daf2c406f91c2a37d6de2cfbca) Fix docs about misconfigured neighbor port
- [`dbd25f0e3`](https://github.com/ripple/rippled/commit/dbd25f0e327f11a862a80a137e316a8871044c26) Remove excessive redirect call on PeerManager
- [`62a3f33d7`](https://github.com/ripple/rippled/commit/62a3f33d729dd50b91af81b4da81464d7aad2029) Remove the built-in "sustain" watchdog:
- [`74f9edef0`](https://github.com/ripple/rippled/commit/74f9edef079b8682969e3cd16715ad91334127a3) Prefer keylets instead of naked hashes:
- [`dbee3f01b`](https://github.com/ripple/rippled/commit/dbee3f01b7bde4b0b662cff454fc5e2fcc27beab) Clean up and modernize code:
- [`6c72d5cf7`](https://github.com/ripple/rippled/commit/6c72d5cf7e3b7afd7534df99781a1559857fd9f2) Improve loading of validator tokens (RIPD-1687):
- [`2827de4d6`](https://github.com/ripple/rippled/commit/2827de4d63d5f591addb1a16b87c1ecc23d102ba) Report the server version in published validations:
- [`381606aba`](https://github.com/ripple/rippled/commit/381606aba2efcd179517f2497dc6e8c2770c679e) Harden validations:
- [`567e42e07`](https://github.com/ripple/rippled/commit/567e42e071662720e15ed3d543f0a0341a2ac422) Deprecate 'Time to Live' fields
- [`2bf3b194f`](https://github.com/ripple/rippled/commit/2bf3b194faa23fab4c3f4c9ff263a84893269f78) Set version to 1.6.0-b4
- [`444ea5618`](https://github.com/ripple/rippled/commit/444ea5618275a6f42806fe086a240c0294da8b28) Adding support to build rippled packages for ubuntu 20.04
- [`d79758916`](https://github.com/ripple/rippled/commit/d79758916418e429f27ae6e150e098c0318baf51) Add README for gRPC protobuf folder
- [`1577c775b`](https://github.com/ripple/rippled/commit/1577c775b3011db9ffb80b4d2dbab5174b6965d3) Close download socket before result is passed to the callback:
- [`3bf0b724a`](https://github.com/ripple/rippled/commit/3bf0b724a3a9cc137a10279b8a4233779b8d31fb) Adjust timeouts in Validator Site tests:
- [`bd8dbb87b`](https://github.com/ripple/rippled/commit/bd8dbb87b6fbc5dd17563b475d65ac4efb1b0aad) Update to RocksBD 6.7.3
- [`cd78ce311`](https://github.com/ripple/rippled/commit/cd78ce3118be1275efe7c306da92c74a35388aab) Add PR automation for project boards
- [`023f5704d`](https://github.com/ripple/rippled/commit/023f5704d07d09e70091f38a0d4e5df213a3144b) Set version to 1.6.0-b3
- [`123e94c60`](https://github.com/ripple/rippled/commit/123e94c6039f854a5184957027c66e70965fd85a) Fix a build issue involving Ubuntu Docker containers:
- [`156dc2ec4`](https://github.com/ripple/rippled/commit/156dc2ec4c03c7e38882e9c915d38ccb2853c572) Add GitHub Action for checking w/ clang-format-10
- [`b7b7e098b`](https://github.com/ripple/rippled/commit/b7b7e098bea6e39e05302707e90782cb938b6f3a) Add .git-blame-ignore-revs (requires Git >= 2.24)
- [`50760c693`](https://github.com/ripple/rippled/commit/50760c693510894ca368e90369b0cc2dabfd07f3) Format first-party source according to .clang-format
- [`65dfc5d19`](https://github.com/ripple/rippled/commit/65dfc5d19e80b398e8780c42bc2f951e88059b43) Prepare code for formatting
- [`020b28580`](https://github.com/ripple/rippled/commit/020b28580816a295185aef8832a8fe07ecc40de2) Set version to 1.6.0-b2
- [`bdd22e4d5`](https://github.com/ripple/rippled/commit/bdd22e4d513d91071945204952a499e2478f926c) Improve reporting of missing node exceptions
- [`b7631d2a2`](https://github.com/ripple/rippled/commit/b7631d2a280cbb1a4e512181c7dd3b061f806a3c) Correct a typo that could result in a nullptr dereference
- [`284ed3847`](https://github.com/ripple/rippled/commit/284ed38471c0e1c26dc217b4d88c3736c8c77faf) Reduce calls to std::random_device:
- [`b96ef6adb`](https://github.com/ripple/rippled/commit/b96ef6adb8e68b922e3912bc5918417ebc08a716) Add SECURITY.md to the repository
- [`ce6b42720`](https://github.com/ripple/rippled/commit/ce6b4272021bfc85c256ab064deaf25dcfa2381e) Fix a build issue involving Ubuntu Docker containers:
- [`858e93c7f`](https://github.com/ripple/rippled/commit/858e93c7f8e8c891f1e98fbcf683181fae016960) Improve the Doxygen Workflow
- [`6477bdf3e`](https://github.com/ripple/rippled/commit/6477bdf3e85e027b489bc7e744894326a8ca6f92) Fix division by zero with shards file stats
- [`ce5f24055`](https://github.com/ripple/rippled/commit/ce5f240551a2802cb74bef678107cc5f28a696b4) Fix invalid shard removal
- [`1c3c69f8b`](https://github.com/ripple/rippled/commit/1c3c69f8b5d4c97f1e410db8458dc2da88814e5f) Update Travis to bionic
- [`be2652544`](https://github.com/ripple/rippled/commit/be2652544b4ed899ba1012398f470142ed969583) Add ledger_cleaner command to rippled cmd line help
- [`f155eaff4`](https://github.com/ripple/rippled/commit/f155eaff4bd3029c294985560bf2575528380e9e) Unit test for memo
- [`67981f002`](https://github.com/ripple/rippled/commit/67981f002fae229cbd54e01440740b4b130f91e1) Reduce strand re-execute log message severity to warning:
- [`0d8322344`](https://github.com/ripple/rippled/commit/0d83223445086ad5ff91911d8045e3a07c1f6007) Remove conditionals for fix1201 enabled 14Nov2017
- [`9f8d64851`](https://github.com/ripple/rippled/commit/9f8d648514128c58798bb0c8fb85de317b750722) Remove conditionals for fix1512 enabled 14Nov2017
- [`3d3b6d85c`](https://github.com/ripple/rippled/commit/3d3b6d85cd499865edf3999b0ca916ca4d773baa) Remove conditionals for fix1523 enabled 14Nov2017
- [`8cf7c9548`](https://github.com/ripple/rippled/commit/8cf7c9548a06944fc128d88f01d213aec3d1102f) Remove conditionals for fix1528 enabled 14Nov2017
- [`323dbc796`](https://github.com/ripple/rippled/commit/323dbc79623184f7cb44d3095957b5fce7cb983d) Remove conditionals for featureSortedDirectories enabled 14Nov2017
- [`46a76fb31`](https://github.com/ripple/rippled/commit/46a76fb3188f5cebcf875010750bd805c5a6c102) Remove conditionals for featureEnforceInvariants enabled 07Jul2017
- [`a6246b0ba`](https://github.com/ripple/rippled/commit/a6246b0baaf33dc522fe8ef0079b0f4e09bd19c8) Remove conditionals for fix1373 enabled 07Jul2017
- [`c8282795e`](https://github.com/ripple/rippled/commit/c8282795ef9404b83e4d4c4d6f27f1127c5fad8d) Remove conditionals for featureEscrow enabled 31Mar2017
- [`e93a44fe9`](https://github.com/ripple/rippled/commit/e93a44fe9bd44f3b4d6b886831b0cc7f061e9cbf) Remove conditionals for fix1368 enabled 31Mar2017
- [`3e870866e`](https://github.com/ripple/rippled/commit/3e870866e0c89e315580aa4478d1401f60da19d0) Remove conditionals for featurePayChan enabled 31Mar2017
- [`78d771af3`](https://github.com/ripple/rippled/commit/78d771af3670438089730af591bb5adaed386c30) Remove conditionals for featureTickSize enabled 21Feb2017
- [`6bb9dd22e`](https://github.com/ripple/rippled/commit/6bb9dd22e06a627b75b45cdd9bd78c6592a7d910) Remove conditionals for featureCryptoConditions enabled 03Jan2017
- [`1661c84af`](https://github.com/ripple/rippled/commit/1661c84af6776ad3146474d891b272f1a0d8561c) Remove unused featureCompareFlowV1V2
- [`4f422f6f3`](https://github.com/ripple/rippled/commit/4f422f6f393b12d5aaba11fb65c33b7885891906) Setting version to 1.6.0-b1
- [`393ca8757`](https://github.com/ripple/rippled/commit/393ca87572ef46bd7ee34b3cbf205afde4c25f38) Change the location for the project signer public keys:
- [`f4c56cbd5`](https://github.com/ripple/rippled/commit/f4c56cbd53b8352a4ec4633102af08019be959a3) Update SHAMap Documentation
- [`9470558ec`](https://github.com/ripple/rippled/commit/9470558ecc5fd1a33810e6ff9a0084e9a3c0e7fa) Remove all uses of the name scoped_lock
- [`f22fcb3b2`](https://github.com/ripple/rippled/commit/f22fcb3b2a510d6ae982834cc43c137ced31e6fe) Rename canonicalize into two functions:
- [`e257a226f`](https://github.com/ripple/rippled/commit/e257a226f367b8ad5c706512d39578194c9b7dc2) Maintain history back to the earliest persisted ledger:
- [`a4e987879`](https://github.com/ripple/rippled/commit/a4e9878790c4c2153dde7b37e3f32ad71aa6edb8) Document the 'devnet' network identifier setting:
- [`25b13978e`](https://github.com/ripple/rippled/commit/25b13978e78fe58219d6e7647ba3661b9289c4de) Fix unity build
- [`3e9cff928`](https://github.com/ripple/rippled/commit/3e9cff92873003c5b98b1c137d6914394b0c6ed1) Fix Doxygen build
- [`758a3792e`](https://github.com/ripple/rippled/commit/758a3792ebcd877a42f87f8f81a4d14fd68aad68) Add protocol message compression support:
- [`ade5eb71c`](https://github.com/ripple/rippled/commit/ade5eb71cf7e2d0316dfe2f1723206bd152915ca) Fix unneeded copies in range some range for loops:
- [`d097819c5`](https://github.com/ripple/rippled/commit/d097819c528da21791388ba80a8cf399adf38eb3) Check XRP endpoints for circular paths (RIPD-1781):
- [`905a97e0a`](https://github.com/ripple/rippled/commit/905a97e0aa02d0c6e1cf198e78c03ff66e282f4f) Make ShardArchiveHandler downloads more resilient:
- [`cc452dfa9`](https://github.com/ripple/rippled/commit/cc452dfa9b636e0656f327db72db70f1b2c46c23) Improve shard concurrency:

## Contributions

### GitHub
[![GitHub: Stars](https://img.shields.io/github/stars/ripple/rippled.svg)](https://img.shields.io/github/stars/ripple/rippled.svg)
[![GitHub: Watchers](https://img.shields.io/github/watchers/ripple/rippled.svg)](https://img.shields.io/github/watchers/ripple/rippled.svg)

The public git repository for `rippled` is hosted on GitHub:

<https://github.com/ripple/rippled>

We welcome contributions, big and small, and invite everyone to join the community
of XRP Ledger developers and help us build the Internet of Value.

### Credits

The following people contributed directly to this release:

- Alloy Networks <info@alloy.ee>
- Carl Hua <carlhua@gmail.com>
- CJ Cobb <ccobb@ripple.com>
- Devon White <dwhite@ripple.com>
- Edward Hennis <ed@ripple.com>
- Elliot Lee <github.public@intelliot.com>
- Gábor Lipták <gliptak@gmail.com>
- Gregory Tsipenyuk <gtsipenyuk@ripple.com>
- Howard Hinnant <howard.hinnant@gmail.com>
- John Freeman <jfreeman08@gmail.com>
- Kirill Fomichev <fanatid@ya.ru>
- Manoj Doshi <mdoshi@ripple.com>
- Mark Travis <mtravis@ripple.com>
- Markus Alvila
- Miguel Portilla <miguelportilla@pobros.com>
- Mo Morsi <mo@morsi.org>
- Nik Bougalis <nikb@bougalis.net>
- p2peer <dcherukhin@ripple.com>
- Peng Wang <pwang200@gmail.com>
- rabbit (Rabbit Kick Club)
- Rome Reginelli <rome@ripple.com>
- Scott Schurr <scott@ripple.com>
- Scott Determan <scott.determan@yahoo.com>
- Yusuf Sahin HAMZA <yusufsahinhamza@gmail.com>

#### Lifetime Contributors

The following is the list of people who made code contributions, large and small, to XRP Ledger prior to the release of 1.6.0:

Aishraj Dahal, Alex Chung, Alex Dupre, Alloy Networks, Andrey Fedorov, Arthur Britto, Bharath Chari, Bob Way, Brad Chase, Brandon Wilson, Bryce Lynch, Carl Hua, Casey Bodley, Christian Ramseier, CJ Cobb, crazyquark, Crypto Brad Garlinghouse, David Grogan, David 'JoelKatz' Schwartz, Devon White, Donovan Hide, Edward Hennis, Elliot Lee, Eric Lombrozo, Ethan MacBrough, Evan Hubinger, Frank Cash, Gábor Lipták, Gregory Tsipenyuk, Howard Hinnant, Ian Roskam, invalidator, Jack Bond-Preston, James Fryman, jatchili, Jcar, Jed McCaleb, Jeff Trull, Jeroen Meulemeester, Jesper Wallin, Joe Loser, Johanna Griffin, John Freeman, John Northrup, Joseph Busch, Josh Juran, Justin Lynn, Keaton Okkonen, Kirill Fomichev, Lazaridis, Lieefu Way, Luke Cyca, Manoj Doshi, Mark Travis, Markus Alvila, Markus Teufelberger, Mayur Bhandary, Miguel Portilla, Mike Ellery, MJK, Mo Morsi, Nicholas Dudfield, Nikolaos D. Bougalis, Niraj Pant, p2peer, Patrick Dehne, Peng Wang, Roberto Catini, Rome Reginelli, Scott Determan, Scott Schurr, S. Matthew English, Stefan Thomas, ShangyanLi, The Gitter Badger, Ties Jan Hefting, Tim Lewkow, Tom 'Swirly' Ritchford, Torrie Fischer, Vahe Hovhannisyan, Vinnie Falco, Vishwas Patil, Warren Paul Anderson, Will, wltsmrz, Wolfgang Spraul, Yana Novikova and Yusuf Sahin HAMZA.

For a real-time view of all contributors, including links to the commits made by each, please visit the "Contributors" section of the GitHub repository: <https://github.com/ripple/rippled/graphs/contributors>.

As XRP Ledger continues to move through the 1.0 series, we look forward to more external contributions and are excited to see the broader XRP Ledger community grow and thrive.
