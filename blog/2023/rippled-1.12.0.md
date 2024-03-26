---
category: 2023
date: 2023-09-06
labels:
    - rippled Release Notes
    - Amendments
theme:
    markdown:
        editPage:
            hide: true
---
# Introducing XRP Ledger version 1.12.0

Version 1.12.0 of `rippled`, the reference server implementation of the XRP Ledger protocol, is now available. This release adds new features and bug fixes, and introduces these amendments:

- `AMM`
- `Clawback`
- `fixReducedOffersV1`

[Sign Up for Future Release Announcements](https://groups.google.com/g/ripple-server)

<!-- BREAK -->


## Action Required

Three new amendments are now open for voting according to the XRP Ledger's [amendment process](https://xrpl.org/amendments.html), which enables protocol changes following two weeks of >80% support from trusted validators.

If you operate an XRP Ledger server, upgrade to version 1.12.0 by September 20, 2023 to ensure service continuity. The exact time that protocol changes take effect depends on the voting decisions of the decentralized network.


## Install / Upgrade

On supported platforms, see the [instructions on installing or updating `rippled`](https://xrpl.org/install-rippled.html).

| Package | SHA-256 |
|:--------|:--------|
| [RPM for Red Hat / CentOS (x86-64)](https://repos.ripple.com/repos/rippled-rpm/stable/rippled-1.12.0-1.el7.x86_64.rpm) | `9907ee871f3a42e3fb5bde7cfc41d9fd82f495f8a8f85135086a5624c29c74de` |
| [DEB for Ubuntu / Debian (x86-64)](https://repos.ripple.com/repos/rippled-deb/pool/stable/rippled_1.12.0-1_amd64.deb) | `cf7b7b2130b8255d8c13fc18b3a4a0ec251d88386b69ec2e60c34b31df310f91` |
| [Portable Builds (Linux x86-64)](https://github.com/XRPLF/rippled-portable-builds) | (Use signature verification) |

For other platforms, please [build from source](https://github.com/ripple/rippled/tree/master/Builds). The most recent commit in the git log should be the change setting the version:

```text
commit 89780c8e4fd4d140fcb912cf2d0c01c1b260539e
Author: Manoj Doshi <mdoshi@ripple.com>
Date:   Wed Sep 6 13:09:04 2023 -0700

    Set version to 1.12.0
```


## Changelog


### Amendments, New Features, and Changes
(These are changes which may impact or be useful to end users. For example, you may be able to update your code/workflow to take advantage of these changes.)

- **`AMM`**: Introduces an automated market maker (AMM) protocol to the XRP Ledger's decentralized exchange, enabling you to trade assets without a counterparty. For more information about AMMs, see: [Automated Market Maker](https://opensource.ripple.com/docs/xls-30d-amm/amm-uc/). [#4294](https://github.com/XRPLF/rippled/pull/4294)

- **`Clawback`**: Adds a setting, *Allow Clawback*, which lets an issuer recover, or _claw back_, tokens that they previously issued. Issuers cannot enable this setting if they have issued tokens already. For additional documentation on this feature, see: [#4553](https://github.com/XRPLF/rippled/pull/4553).

- **`fixReducedOffersV1`**: Reduces the occurrence of order books that are blocked by reduced offers. [#4512](https://github.com/XRPLF/rippled/pull/4512)

- Added WebSocket and RPC port info to `server_info` responses. [#4427](https://github.com/XRPLF/rippled/pull/4427)

- Removed the deprecated `accepted`, `seqNum`, `hash`, and `totalCoins` fields from the `ledger` method. [#4244](https://github.com/XRPLF/rippled/pull/4244)


### Bug Fixes and Performance Improvements
(These are behind-the-scenes improvements, such as internal changes to the code, which are not expected to impact end users.)

- Added a pre-commit hook that runs the clang-format linter locally before committing changes. To install this feature, see: [CONTRIBUTING](https://github.com/XRPLF/xrpl-dev-portal/blob/master/CONTRIBUTING.md). [#4599](https://github.com/XRPLF/rippled/pull/4599)

- In order to make it more straightforward to catch and handle overflows: changed the output type of the `mulDiv()` function from `std::pair<bool, uint64_t>` to `std::optional`. [#4243](https://github.com/XRPLF/rippled/pull/4243)

- Updated `Handler::Condition` enum values to make the code less brittle. [#4239](https://github.com/XRPLF/rippled/pull/4239)

- Renamed `ServerHandlerImp` to `ServerHandler`. [#4516](https://github.com/XRPLF/rippled/pull/4516), [#4592](https://github.com/XRPLF/rippled/pull/4592)

- Replaced hand-rolled code with `std::from_chars` for better maintainability. [#4473](https://github.com/XRPLF/rippled/pull/4473)

- Removed an unused `TypedField` move constructor. [#4567](https://github.com/XRPLF/rippled/pull/4567)


### Docs and Build System

- Updated checkout versions to resolve warnings during GitHub jobs. [#4598](https://github.com/XRPLF/rippled/pull/4598)

- Fixed an issue with the Debian package build. [#4591](https://github.com/XRPLF/rippled/pull/4591)

- Updated build instructions with additional steps to take after updating dependencies. [#4623](https://github.com/XRPLF/rippled/pull/4623)

- Updated contributing doc to clarify that beta releases should also be pushed to the `release` branch. [#4589](https://github.com/XRPLF/rippled/pull/4589)

- Enabled the `BETA_RPC_API` flag in the default unit tests config, making the API v2 (beta) available to unit tests. [#4573](https://github.com/XRPLF/rippled/pull/4573)

- Conan dependency management.
  - Fixed package definitions for Conan. [#4485](https://github.com/XRPLF/rippled/pull/4485)
  - Updated build dependencies to the most recent versions in Conan Center. [#4595](https://github.com/XRPLF/rippled/pull/4595)
  - Updated Conan recipe for NuDB. [#4615](https://github.com/XRPLF/rippled/pull/4615)

- Added binary hardening and linker flags to enhance security during the build process. [#4603](https://github.com/XRPLF/rippled/pull/4603)

- Added an Artifactory to the `nix` workflow to improve build times. [#4556](https://github.com/XRPLF/rippled/pull/4556)

- Added quality-of-life improvements to workflows, using new [concurrency control](https://docs.github.com/en/actions/using-jobs/using-concurrency) features. [#4597](https://github.com/XRPLF/rippled/pull/4597)


[Full Commit Log](https://github.com/XRPLF/rippled/compare/1.11.0...1.12.0)


### GitHub

The public source code repository for `rippled` is hosted on GitHub at <https://github.com/XRPLF/rippled>.

We welcome all contributions and invite everyone to join the community of XRP Ledger developers to help build the Internet of Value.


## Credits

The following people contributed directly to this release:

- Alphonse N. Mousse <39067955+a-noni-mousse@users.noreply.github.com>
- Arihant Kothari <arihantkothari17@gmail.com>
- Chenna Keshava B S <21219765+ckeshava@users.noreply.github.com>
- Denis Angell <dangell@transia.co>
- Ed Hennis <ed@ripple.com>
- Elliot Lee <github.public@intelliot.com>
- Gregory Tsipenyuk <gregtatcam@users.noreply.github.com>
- Howard Hinnant <howard.hinnant@gmail.com>
- Ikko Eltociear Ashimine <eltociear@gmail.com>
- John Freeman <jfreeman08@gmail.com>
- Manoj Doshi <mdoshi@ripple.com>
- Mark Travis <mtravis@ripple.com>
- Mayukha Vadari <mvadari@gmail.com>
- Michael Legleux <legleux@users.noreply.github.com>
- Peter Chen <34582813+PeterChen13579@users.noreply.github.com>
- RichardAH <richard.holland@starstone.co.nz>
- Rome Reginelli <rome@ripple.com>
- Scott Schurr <scott@ripple.com>
- Shawn Xie <35279399+shawnxie999@users.noreply.github.com>
- drlongle <drlongle@gmail.com>

Bug Bounties and Responsible Disclosures:

We welcome reviews of the rippled code and urge researchers to responsibly disclose any issues they may find.

To report a bug, please send a detailed report to: <bugs@xrpl.org>
