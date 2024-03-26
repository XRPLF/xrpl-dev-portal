---
category: 2023
date: 2023-03-14
labels:
    - rippled Release Notes
    - Amendments
theme:
    markdown:
        editPage:
            hide: true
---
# Introducing XRP Ledger version 1.10.0

Version 1.10.0 of `rippled`, the reference server implementation of the XRP Ledger protocol, is now available. This release introduces six new amendments and cleans up code to improve performance.

[Sign Up for Future Release Announcements](https://groups.google.com/g/ripple-server)

<!-- BREAK -->

## Action Required

Six new amendments are now open for voting according to the XRP Ledger's [amendment process](https://xrpl.org/amendments.html), which enables protocol changes following two weeks of >80% support from trusted validators.

If you operate an XRP Ledger server, upgrade to version 1.10.0 by March 28 to ensure service continuity. The exact time that protocol changes take effect depends on the voting decisions of the decentralized network.


## Install / Upgrade

On supported platforms, see the [instructions on installing or updating `rippled`](https://xrpl.org/install-rippled.html).

| Package | SHA-256 |
|:--------|:--------|
| [RPM for Red Hat / CentOS (x86-64)](https://repos.ripple.com/repos/rippled-rpm/stable/rippled-1.10.0-1.el7.x86_64.rpm) | `568ee33b4560be0505a0be0966f9ca1f477444a60c2632eff8ab71864c6b020b` |
| [DEB for Ubuntu / Debian (x86-64)](https://repos.ripple.com/repos/rippled-deb/pool/stable/rippled_1.10.0-1_amd64.deb) | `5015efad92743a57cfdba573cf968b740b2418360034c6c6e8d3a514d60b6a89` |

For other platforms, please [build from source](https://github.com/ripple/rippled/tree/master/Builds). The most recent commit in the git log should be the change setting the version:

```text
commit 07f047b1e260e5b937af28e8f8da9c360ea832b9
Author: Elliot Lee <github.public@intelliot.com>
Date:   Tue Mar 14 09:30:22 2023 -0700

    Set version to 1.10.0
    
    Merge #4451
```


## New Amendments

- **`featureImmediateOfferKilled`**: Changes the response code of an `OfferCreate` transaction with the `tfImmediateOrCancel` flag to return `tecKILLED` when no funds are moved. The previous return code of `tecSUCCESS` was unintuitive. [#4157](https://github.com/XRPLF/rippled/pull/4157)

- **`featureDisallowIncoming`**: Enables an account to block incoming checks, payment channels, NFToken offers, and trust lines. [#4336](https://github.com/XRPLF/rippled/pull/4336)

- **`featureXRPFees`**: Simplifies transaction cost calculations to use XRP directly, rather than calculating indirectly in "fee units" and translating the results to XRP. Updates all instances of "fee units" in the protocol and ledger data to be drops of XRP instead. [#4247](https://github.com/XRPLF/rippled/pull/4247) 

- **`fixUniversalNumber`**: Simplifies and unifies the code for decimal floating point math. In some cases, this provides slightly better accuracy than the previous code, resulting in calculations whose least significant digits are different than when calculated with the previous code. The different results may cause other edge case differences where precise calculations are used, such as ranking of offers or processing of payments that use several different paths. [#4192](https://github.com/XRPLF/rippled/pull/4192)

- **`fixNonFungibleTokensV1_2`**: This amendment is a combination of NFToken fixes. [#4417](https://github.com/XRPLF/rippled/pull/4417)
    - Fixes unburnable NFTokens when it has over 500 offers. [#4346](https://github.com/XRPLF/rippled/pull/4346)
    - Fixes 3 NFToken offer acceptance issues. [#4380](https://github.com/XRPLF/rippled/pull/4380)
    - Prevents brokered sales of NFTokens to owners. [#4403](https://github.com/XRPLF/rippled/pull/4403)
    - Only allows the destination to settle NFToken offers through brokerage. [#4399](https://github.com/XRPLF/rippled/pull/4399)

- **`fixTrustLinesToSelf`**: Trust lines must be between two different accounts, but two exceptions exist because of a bug that briefly existed. This amendment removes those trust lines. [69bb2be](https://github.com/XRPLF/rippled/pull/4270/commits/69bb2be446e3cc24c694c0835b48bd2ecd3d119e)


## Changelog


### New Features and Improvements

- **Improve Handshake in the peer protocol**: Switched to using a cryptographically secure PRNG for the Instance Cookie. `rippled` now uses hex encoding for the `Closed-Ledger` and `Previous-Ledger` fields in the Handshake. Also added `--newnodeid` and `--nodeid` command line options. [5a15229](https://github.com/XRPLF/rippled/pull/4270/commits/5a15229eeb13b69c8adf1f653b88a8f8b9480546)

- **RPC tooBusy response now has 503 HTTP status code**: Added ripplerpc 3.0, enabling RPC tooBusy responses to return relevant HTTP status codes. This is a non-breaking change that only applies to JSON-RPC when you include `"ripplerpc": "3.0"` in the request. [#4143](https://github.com/XRPLF/rippled/pull/4143)

- **Use the Conan package manager**: Added a `conanfile.py` and Conan recipe for Snappy. Removed the RocksDB recipe from the repo; you can now get it from Conan Center. [#4367](https://github.com/XRPLF/rippled/pull/4367), [c2b03fe](https://github.com/XRPLF/rippled/commit/c2b03fecca19a304b37467b01fa78593d3dce3fb)

- **Update Build Instructions**: Updated the build instructions to build with the Conan package manager and restructured info for easier comprehension. [#4376](https://github.com/XRPLF/rippled/pull/4376), [#4383](https://github.com/XRPLF/rippled/pull/4383)

- **Revise CONTRIBUTING**: Updated code contribution guidelines. `rippled` is an open source project and contributions are very welcome. [#4382](https://github.com/XRPLF/rippled/pull/4382)

- **Update documented pathfinding configuration defaults**: `417cfc2` changed the default Path Finding configuration values, but missed updating the values documented in rippled-example.cfg. Updated those defaults and added recommended values for nodes that want to support advanced pathfinding. [#4409](https://github.com/XRPLF/rippled/pull/4409)

- **Remove gRPC code previously used for the Xpring SDK**: Removed gRPC code used for the Xpring SDK. The gRPC API is also enabled locally by default in `rippled-example.cfg`. This API is used for [Reporting Mode](https://xrpl.org/build-run-rippled-in-reporting-mode.html) and [Clio](https://github.com/XRPLF/clio). [28f4cc7](https://github.com/XRPLF/rippled/pull/4321/commits/28f4cc7817c2e477f0d7e9ade8f07a45ff2b81f1)

- **Switch from C++17 to C++20**: Updated `rippled` to use C++20. [92d35e5](https://github.com/XRPLF/rippled/pull/4270/commits/92d35e54c7de6bbe44ff6c7c52cc0765b3f78258)

- **Support for Boost 1.80.0:**: [04ef885](https://github.com/XRPLF/rippled/pull/4321/commits/04ef8851081f6ee9176783ad3725960b8a931ebb)

- **Reduce default reserves to 10/2**: Updated the hard-coded default reserves to match the current settings on Mainnet. [#4329](https://github.com/XRPLF/rippled/pull/4329)

- **Improve self-signed certificate generation**: Improved speed and security of TLS certificate generation on fresh startup. [0ecfc7c](https://github.com/XRPLF/rippled/pull/4270/commits/0ecfc7cb1a958b731e5f184876ea89ae2d4214ee)


### Bug Fixes

- **Update command-line usage help message**: Added `manifest` and `validator_info` to the `rippled` CLI usage statement. [b88ed5a](https://github.com/XRPLF/rippled/pull/4270/commits/b88ed5a8ec2a0735031ca23dc6569d54787dc2f2)

- **Work around gdb bug by changing a template parameter**: Added a workaround for a bug in gdb, where unsigned template parameters caused issues with RTTI. [#4332](https://github.com/XRPLF/rippled/pull/4332)

- **Fix clang 15 warnings**: [#4325](https://github.com/XRPLF/rippled/pull/4325)

- **Catch transaction deserialization error in doLedgerGrpc**: Fixed an issue in the gRPC API, so `Clio` can extract ledger headers and state objects from specific transactions that can't be deserialized by `rippled` code. [#4323](https://github.com/XRPLF/rippled/pull/4323)

- **Update dependency: gRPC**: New Conan recipes broke the old version of gRPC, so the dependency was updated. [#4407](https://github.com/XRPLF/rippled/pull/4407)

- **Fix Doxygen workflow**: Added options to build documentation that don't depend on the library dependencies of `rippled`. [#4372](https://github.com/XRPLF/rippled/pull/4372)

- **Don't try to read SLE with key 0 from the ledger**: Fixed the `preclaim` function to check for 0 in `NFTokenSellOffer` and `NFTokenBuyOffer` before calling `Ledger::read`. This issue only affected debug builds. [#4351](https://github.com/XRPLF/rippled/pull/4351)

- **Update broken link to hosted Doxygen content**: [5e1cb09](https://github.com/XRPLF/rippled/pull/4270/commits/5e1cb09b8892e650f6c34a66521b6b1673bd6b65)


### Code Cleanup

- **Prevent unnecessary `shared_ptr` copies by accepting a value in `SHAMapInnerNode::setChild`**: [#4266](https://github.com/XRPLF/rippled/pull/4266)

- **Release TaggedCache object memory outside the lock**: [3726f8b](https://github.com/XRPLF/rippled/pull/4321/commits/3726f8bf31b3eab8bab39dce139656fd705ae9a0)

- **Rename SHAMapStoreImp::stopping() to healthWait()**: [7e9e910](https://github.com/XRPLF/rippled/pull/4321/commits/7e9e9104eabbf0391a0837de5630af17a788e233)

- **Improve wrapper around OpenSSL RAND**: [7b3507b](https://github.com/XRPLF/rippled/pull/4270/commits/7b3507bb873495a974db33c57a888221ddabcacc)

- **Improve AccountID string conversion caching**: Improved memory cache usage. [e2eed96](https://github.com/XRPLF/rippled/pull/4270/commits/e2eed966b0ecb6445027e6a023b48d702c5f4832)

- **Build the command map at compile time**: [9aaa0df](https://github.com/XRPLF/rippled/pull/4270/commits/9aaa0dff5fd422e5f6880df8e20a1fd5ad3b4424)

- **Avoid unnecessary copying and dynamic memory allocations**: [d318ab6](https://github.com/XRPLF/rippled/pull/4270/commits/d318ab612adc86f1fd8527a50af232f377ca89ef)

- **Use constexpr to check memo validity**: [e67f905](https://github.com/XRPLF/rippled/pull/4270/commits/e67f90588a9050162881389d7e7d1d0fb31066b0)

- **Remove charUnHex**: [83ac141](https://github.com/XRPLF/rippled/pull/4270/commits/83ac141f656b1a95b5661853951ebd95b3ffba99)

- **Remove deprecated AccountTxOld.cpp**: [ce64f7a](https://github.com/XRPLF/rippled/pull/4270/commits/ce64f7a90f99c6b5e68d3c3d913443023de061a6)

- **Remove const_cast usage**: [23ce431](https://github.com/XRPLF/rippled/pull/4321/commits/23ce4318768b718c82e01004d23f1abc9a9549ff)

- **Remove inaccessible code paths and outdated data format wchar_t**: [95fabd5](https://github.com/XRPLF/rippled/pull/4321/commits/95fabd5762a4917753c06268192e4d4e4baef8e4)

- **Improve move semantics in Expected**: [#4326](https://github.com/XRPLF/rippled/pull/4326)


[Full Commit Log](https://github.com/XRPLF/rippled/compare/1.9.4...1.10.0)


### GitHub

The public source code repository for `rippled` is hosted on GitHub at <https://github.com/XRPLF/rippled>.

We welcome all contributions and invite everyone to join the community of XRP Ledger developers to help build the Internet of Value.

### Credits

The following people contributed directly to this release:

- Alexander Kremer <akremer@ripple.com>
- Alloy Networks <45832257+alloynetworks@users.noreply.github.com>
- CJ Cobb <46455409+cjcobb23@users.noreply.github.com>
- Chenna Keshava B S <ckbs.keshava56@gmail.com>
- Crypto Brad Garlinghouse <cryptobradgarlinghouse@protonmail.com>
- Denis Angell <dangell@transia.co>
- Ed Hennis <ed@ripple.com>
- Elliot Lee <github.public@intelliot.com>
- Gregory Popovitch <greg7mdp@gmail.com>
- Howard Hinnant <howard.hinnant@gmail.com>
- J. Scott Branson <18340247+crypticrabbit@users.noreply.github.com>
- John Freeman <jfreeman08@gmail.com>
- ledhed2222 <ledhed2222@users.noreply.github.com>
- Levin Winter <33220502+levinwinter@users.noreply.github.com>
- manojsdoshi <mdoshi@ripple.com>
- Nik Bougalis <nikb@bougalis.net>
- RichardAH <richard.holland@starstone.co.nz>
- Scott Determan <scott.determan@yahoo.com>
- Scott Schurr <scott@ripple.com>
- Shawn Xie <35279399+shawnxie999@users.noreply.github.com>

Security Bug Bounty Acknowledgements:

- Aaron Hook
- Levin Winter

Bug Bounties and Responsible Disclosures:

We welcome reviews of the `rippled` code and urge researchers to responsibly disclose any issues they may find.

To report a bug, please send a detailed report to: <bugs@xrpl.org>
