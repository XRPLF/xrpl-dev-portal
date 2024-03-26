---
category: 2024
date: 2024-01-09
labels:
    - rippled Release Notes
    - Amendments
theme:
    markdown:
        editPage:
            hide: true
---
# Introducing XRP Ledger version 2.0.0

Version 2.0.0 of `rippled`, the reference server implementation of the XRP Ledger protocol, is now available. This release adds new features and bug fixes, and introduces these amendments:

- `DID`
- `XChainBridge`
- `fixDisallowIncomingV1`
- `fixFillOrKill`

[Sign Up for Future Release Announcements](https://groups.google.com/g/ripple-server)

<!-- BREAK -->


## Action Required

Four new amendments are now open for voting according to the XRP Ledger's [amendment process](https://xrpl.org/amendments.html), which enables protocol changes following two weeks of >80% support from trusted validators.

If you operate an XRP Ledger server, upgrade to version 2.0.0 by January 22, 2024 to ensure service continuity. The exact time that protocol changes take effect depends on the voting decisions of the decentralized network.


## Install / Upgrade

On supported platforms, see the [instructions on installing or updating `rippled`](https://xrpl.org/install-rippled.html).

| Package | SHA-256 |
|:--------|:--------|
| [RPM for Red Hat / CentOS (x86-64)](https://repos.ripple.com/repos/rippled-rpm/stable/rippled-2.0.0-1.el7.x86_64.rpm) | `4f765d2f38c2b2ef4825fb715b1dfcbb8ecaef0063ef99005f54252c90a29cab` |
| [DEB for Ubuntu / Debian (x86-64)](https://repos.ripple.com/repos/rippled-deb/pool/stable/rippled_2.0.0-1_amd64.deb) | `69568c467a5291b441ce6f1385bd20cdfaf02e4496ca9043441fdb842d9975dc` |
| [Portable Builds (Linux x86-64)](https://github.com/XRPLF/rippled-portable-builds) | (Use signature verification) |

For other platforms, please [build from source](https://github.com/ripple/rippled/tree/master/Builds). The most recent commit in the git log should be the change setting the version:

```text
commit 2b0313d60c4226cc98ad39fe8eb659deca48f32a
Author: Elliot Lee <github.public@intelliot.com>
Date:   Mon Jan 8 13:13:37 2024 -0800

    Set version to 2.0.0
```


## Changelog


### Amendments, New Features, and Changes
(These are changes which may impact or be useful to end users. For example, you may be able to update your code/workflow to take advantage of these changes.)

- **XChainBridge**: Introduces cross-chain bridges, enabling interoperability between the XRP Ledger and sidechains. [#4292](https://github.com/XRPLF/rippled/pull/4292)

- **DID**: Introduces decentralized identifiers. [#4636](https://github.com/XRPLF/rippled/pull/4636)

- **fixDisallowIncomingV1**: Fixes an issue that occurs when users try to authorize a trustline while the `lsfDisallowIncomingTrustline` flag is enabled on their account. [#4721](https://github.com/XRPLF/rippled/pull/4721)

- **fixFillOrKill**: Fixes an issue introduced in the `flowCross` amendment. The `tfFillOrKill` and `tfSell` flags are now properly handled to allow offers to cross in certain scenarios. [#4694](https://github.com/XRPLF/rippled/pull/4694)

- **API v2 released with these changes:**

    - Bumped API support to v2, but kept the command-line interface for `rippled` and unit tests at v1. [#4803](https://github.com/XRPLF/rippled/pull/4803)
    - Accepts currency codes in ASCII, using the full alphabet. [#4566](https://github.com/XRPLF/rippled/pull/4566)
    - Added test to verify the `check` field is a string. [#4630](https://github.com/XRPLF/rippled/pull/4630)
    - Added errors for malformed `account_tx` and `noripple_check` fields. [#4620](https://github.com/XRPLF/rippled/pull/4620)
    - Added errors for malformed `gateway_balances` and `channel_authorize` requests. [#4618](https://github.com/XRPLF/rippled/pull/4618)
    - Added a `DeliverMax` alias to `Amount` and removed `Amount`. [#4733](https://github.com/XRPLF/rippled/pull/4733)
    - Removed `tx_history` and `ledger_header` methods. Also updated `RPC::Handler` to allow for version-specific methods. [#4759](https://github.com/XRPLF/rippled/pull/4759)
    - Standardized the JSON serialization format of transactions. [#4727](https://github.com/XRPLF/rippled/issues/4727)
    - Standardized `ledger_index` to return as a number. [#4820](https://github.com/XRPLF/rippled/pull/4820)

- Added a `server_definitions` command that returns an SDK-compatible `definitions.json` file, generated from the `rippled` instance currently running. [#4703](https://github.com/XRPLF/rippled/pull/4703)

- Improved unit test command line input and run times. [#4634](https://github.com/XRPLF/rippled/pull/4634)

- Added the link compression setting to the the `rippled-example.cfg` file. [#4753](https://github.com/XRPLF/rippled/pull/4753)

- Changed the reserved hook error code name from `tecHOOK_ERROR` to `tecHOOK_REJECTED`. [#4559](https://github.com/XRPLF/rippled/pull/4559)


### Bug Fixes and Performance Improvements
(These are behind-the-scenes improvements, such as internal changes to the code, which are not expected to impact end users.)

- Simplified `TxFormats` common fields logic. [#4637](https://github.com/XRPLF/rippled/pull/4637)

- Improved transaction throughput by asynchronously writing batches to *NuDB*. [#4503](https://github.com/XRPLF/rippled/pull/4503)

- Removed 2 unused functions. [#4708](https://github.com/XRPLF/rippled/pull/4708)

- Removed an unused variable that caused clang 14 build errors. [#4672](https://github.com/XRPLF/rippled/pull/4672)

- Fixed comment about return value of `LedgerHistory::fixIndex`. [#4574](https://github.com/XRPLF/rippled/pull/4574)

- Updated `secp256k1` to 0.3.2. [#4653](https://github.com/XRPLF/rippled/pull/4653)

- Removed built-in SNTP clock issues. [#4628](https://github.com/XRPLF/rippled/pull/4628)

- Fixed amendment flapping. This issue usually occurred when an amendment was on the verge of gaining majority, but a validator not in favor of the amendment went offline. [#4410](https://github.com/XRPLF/rippled/pull/4410)

- Fixed asan stack-use-after-scope issue. [#4676](https://github.com/XRPLF/rippled/pull/4676)

- Transactions and pseudo-transactions share the same `commonFields` again. [#4715](https://github.com/XRPLF/rippled/pull/4715)

- Reduced boilerplate in `applySteps.cpp`. When a new transactor is added, only one function needs to be modified now. [#4710](https://github.com/XRPLF/rippled/pull/4710)

- Removed an incorrect assert. [#4743](https://github.com/XRPLF/rippled/pull/4743)

- Replaced some asserts in `PeerFinder::Logic` with `LogicError` to better indicate the nature of server crashes. [#4562](https://github.com/XRPLF/rippled/pull/4562)

- Fixed an issue with enabling new amendments on a network with an ID greater than 1024. [#4737](https://github.com/XRPLF/rippled/pull/4737)


### Docs and Build System

- Updated `rippled-example.cfg` docs to clarify usage of *ssl_cert* vs *ssl_chain*. [#4667](https://github.com/XRPLF/rippled/pull/4667)

- Updated `SECURITY.md`:
    - Clarified bug bounty program info. [#4338](https://github.com/XRPLF/rippled/pull/4338)
    - Fixed typo. [#4662](https://github.com/XRPLF/rippled/pull/4662)

- Updated `BUILD.md`:
    - Made the `environment.md` link easier to find. Also made it easier to find platform-specific info. [#4507](https://github.com/XRPLF/rippled/pull/4507)
    - Fixed typo. [#4718](https://github.com/XRPLF/rippled/pull/4718)
    - Updated the minimum compiler requirements. [#4700](https://github.com/XRPLF/rippled/pull/4700)
    - Added note about enabling `XRPFees`. [#4741](https://github.com/XRPLF/rippled/pull/4741)

- Updated `RELEASENOTES.md` to match 1.12.0 release notes to the dev blog.

- Updated `API-CHANGELOG.md`:
    - Explained API v2 is releasing with `rippled` 2.0.0. [#4633](https://github.com/XRPLF/rippled/pull/4633)
    - Clarified the location of the `signer_lists` field in the `account_info` response for API v2. [#4724](https://github.com/XRPLF/rippled/pull/4724)
    - Added documentation for the new `DeliverMax` field. [#4784](https://github.com/XRPLF/rippled/pull/4784)
    - Removed references to API v2 being "in progress" and "in beta". [#4828](https://github.com/XRPLF/rippled/pull/4828)
    - Clarified that all breaking API changes will now occur in API v3 or later. [#4773](https://github.com/XRPLF/rippled/pull/4773)

- Fixed a mistake in the overlay README. [#4635](https://github.com/XRPLF/rippled/pull/4635)

- Fixed an early return from `RippledRelease.cmake` that prevented targets from being created during packaging. [#4707](https://github.com/XRPLF/rippled/pull/4707)

- Fixed a build error with Intel Macs. [#4632](https://github.com/XRPLF/rippled/pull/4632)

- Added `.build` to `.gitignore`. [#4722](https://github.com/XRPLF/rippled/pull/4722)

- Fixed a `uint is not universally defined` Windows build error. [#4731](https://github.com/XRPLF/rippled/pull/4731)

- Reenabled Windows CI build with Artifactory support. [#4596](https://github.com/XRPLF/rippled/pull/4596)

- Fixed output of remote step in Nix workflow. [#4746](https://github.com/XRPLF/rippled/pull/4746)

- Fixed a broken link in `conan.md`. [#4740](https://github.com/XRPLF/rippled/pull/4740)

- Added a `python` call to fix the `pip` upgrade command in Windows CI. [#4768](https://github.com/XRPLF/rippled/pull/4768)

- Added an API Impact section to `pull_request_template.md`. [#4757](https://github.com/XRPLF/rippled/pull/4757)

- Set permissions for the Doxygen workflow. [#4756](https://github.com/XRPLF/rippled/pull/4756)

- Switched to Unity builds to speed up Windows CI. [#4780](https://github.com/XRPLF/rippled/pull/4780)

- Clarified what makes concensus healthy in `FeeEscalation.md`. [#4729](https://github.com/XRPLF/rippled/pull/4729)

- Removed a dependency on the `<ranges>` header for unit tests. [#4788](https://github.com/XRPLF/rippled/pull/4788)

- Fixed a clang `unused-but-set-variable` warning. [#4677](https://github.com/XRPLF/rippled/pull/4677)

- Removed an unused Dockerfile. [#4791](https://github.com/XRPLF/rippled/pull/4791)

- Fixed unit tests to work with API v2. [#4785](https://github.com/XRPLF/rippled/pull/4785)

- Added support for the mold linker on Linux. [#4807](https://github.com/XRPLF/rippled/pull/4807)

- Updated Linux distribtuions `rippled` smoke tests run on. [#4813](https://github.com/XRPLF/rippled/pull/4813)

- Added codename `bookworm` to the distribution matrix during Artifactory uploads, enabling Debian 12 clients to install `rippled` packages. [#4836](https://github.com/XRPLF/rippled/pull/4836)

- Added a workaround for compilation errors with GCC 13 and other compilers relying on libstdc++ version 13. [#4817](https://github.com/XRPLF/rippled/pull/4817)

- Fixed a minor typo in the code comments of `AMMCreate.h`. [4821](https://github.com/XRPLF/rippled/pull/4821)


[Full Commit Log](https://github.com/XRPLF/rippled/compare/1.12.0...2.0.0)


### GitHub

The public source code repository for `rippled` is hosted on GitHub at <https://github.com/XRPLF/rippled>.

We welcome all contributions and invite everyone to join the community of XRP Ledger developers to help build the Internet of Value.


## Credits

The following people contributed directly to this release:

- Bronek Kozicki <brok@incorrekt.com>
- Chenna Keshava B S <21219765+ckeshava@users.noreply.github.com>
- Denis Angell <dangell@transia.co>
- Ed Hennis <ed@ripple.com>
- Elliot Lee <github.public@intelliot.com>
- Florent <36513774+florent-uzio@users.noreply.github.com>
- ForwardSlashBack <142098649+ForwardSlashBack@users.noreply.github.com>
- Gregory Tsipenyuk <gregtatcam@users.noreply.github.com>
- Howard Hinnant <howard.hinnant@gmail.com>
- Hussein Badakhchani <husseinb01@gmail.com>
- Jackson Mills <aim4math@gmail.com>
- John Freeman <jfreeman08@gmail.com>
- Manoj Doshi <mdoshi@ripple.com>
- Mark Pevec <mark.pevec@gmail.com>
- Mark Travis <mtrippled@users.noreply.github.com>
- Mayukha Vadari <mvadari@gmail.com>
- Michael Legleux <legleux@users.noreply.github.com>
- Nik Bougalis <nikb@bougalis.net>
- Peter Chen <34582813+PeterChen13579@users.noreply.github.com>
- Rome Reginelli <rome@ripple.com>
- Scott Determan <scott.determan@yahoo.com>
- Scott Schurr <scott@ripple.com>
- Sophia Xie <106177003+sophiax851@users.noreply.github.com>
- Stefan van Kessel <van_kessel@freenet.de>
- pwang200 <354723+pwang200@users.noreply.github.com>
- shichengsg002 <147461171+shichengsg002@users.noreply.github.com>
- sokkaofthewatertribe <140777955+sokkaofthewatertribe@users.noreply.github.com>

Bug Bounties and Responsible Disclosures:

We welcome reviews of the `rippled` code and urge researchers to responsibly disclose any issues they may find.

To report a bug, please send a detailed report to: <bugs@xrpl.org>
