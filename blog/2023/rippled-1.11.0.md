---
category: 2023
date: 2023-06-21
labels:
    - rippled Release Notes
    - Amendments
theme:
    markdown:
        editPage:
            hide: true
---
# Introducing XRP Ledger version 1.11.0

Version 1.11.0 of `rippled`, the reference server implementation of the XRP Ledger protocol, is now available. This release reduces memory usage, introduces the `fixNFTokenRemint` amendment, and adds other features and bug fixes.

[Sign Up for Future Release Announcements](https://groups.google.com/g/ripple-server)

<!-- BREAK -->

## Action Required

The `fixNFTokenRemint` amendment is now open for voting according to the XRP Ledger's amendment process, which enables protocol changes following two weeks of >80% support from trusted validators.

If you operate an XRP Ledger server, upgrade to version 1.11.0 by July 5 to ensure service continuity. The exact time that protocol changes take effect depends on the voting decisions of the decentralized network.


## Install / Upgrade

On supported platforms, see the [instructions on installing or updating `rippled`](https://xrpl.org/install-rippled.html).

| Package | SHA-256 |
|:--------|:--------|
| [RPM for Red Hat / CentOS (x86-64)](https://repos.ripple.com/repos/rippled-rpm/stable/rippled-1.11.0-1.el7.x86_64.rpm) | `f986d28aed370bc747bff013834f4e9ed54e28885296467a5f465b32f04bebf0` |
| [DEB for Ubuntu / Debian (x86-64)](https://repos.ripple.com/repos/rippled-deb/pool/stable/rippled_1.11.0-1_amd64.deb) | `15fd0e7dd44b74cd8c8174db73f5cdbccfb2da1624db9b91c559dff62e651d4f` |
| [Portable Builds (Linux x86-64)](https://github.com/XRPLF/rippled-portable-builds) | (Use signature verification) |

For other platforms, please [build from source](https://github.com/ripple/rippled/tree/master/Builds). The most recent commit in the git log should be the change setting the version:

```text
commit 264280edd79b7f764536e02459f33f66a59c0531
Author: Elliot Lee <github.public@intelliot.com>
Date:   Tue Jun 20 11:40:11 2023 -0700

    Set version to 1.11.0
    
    * Add release notes
```


## New Amendment

**`fixNFTokenRemint`**: Prevents an NFT with the same ID from being reminted. [#4406](https://github.com/XRPLF/rippled/pull/4406)


## Changelog


### New Features and Improvements

- Node operators can now specify ports using a colon or space. [#4328](https://github.com/XRPLF/rippled/pull/4328)

- Eliminated memory allocation from a critical path. [#4353](https://github.com/XRPLF/rippled/pull/4353)

- Made it easier for projects to depend on `libxrpl`. [#4449](https://github.com/XRPLF/rippled/pull/4449)

- Added the ability to mark amendments as obsolete. [#4291](https://github.com/XRPLF/rippled/pull/4291)

- The `FeeSettings` object is now always created in genesis ledgers. [#4319](https://github.com/XRPLF/rippled/pull/4319)

- Added log exception messages. [#4400](https://github.com/XRPLF/rippled/pull/4400)

- Added an `account_flags` object to the `account_info` method response. [#4459](https://github.com/XRPLF/rippled/pull/4459)

- Added `NFTokenPages` to the `account_objects` RPC. [#4352](https://github.com/XRPLF/rippled/pull/4352)

- Added JSS fields used by the Clio `nft_info` command. [#4320](https://github.com/XRPLF/rippled/pull/4320)

- Introduced a slab-based memory allocator and optimized `SHAMapItem`. [#4218](https://github.com/XRPLF/rippled/pull/4218)

- Added the `NetworkID` field to transactions to help prevent replay attacks on and from sidechains. [#4370](https://github.com/XRPLF/rippled/pull/4370)

- Administrators can now set the quorom from the command-line. [#4489](https://github.com/XRPLF/rippled/pull/4489)

- The API now won't accept seeds or public keys in place of accounts IDs. [#4404](https://github.com/XRPLF/rippled/pull/4404)

- Added `nftoken_id`, `nftoken_ids` and `offer_id` meta fields into NFT `Tx` responses. [#4447](https://github.com/XRPLF/rippled/pull/4447)


### Bug Fixes

- Fixed a bug in the sum totaling for `gateway_balances`. [#4355](https://github.com/XRPLF/rippled/pull/4355)

- Fixed a rare null pointer dereference in timeout. [#4420](https://github.com/XRPLF/rippled/pull/4420)

- Fixed `marker` returned from the `account_lines` command not working on subsequent commands. [#4361](https://github.com/XRPLF/rippled/pull/4361)

- Fixed a case where `ripple::Expected` returned a JSON array instead of a value. [#4401](https://github.com/XRPLF/rippled/pull/4401)

- Fixed ledger data returning an empty list instead of `null` when all entries are filtered out. [#4398](https://github.com/XRPLF/rippled/pull/4398)

- Fixed the `ripple.app.LedgerData` unit test. [#4484](https://github.com/XRPLF/rippled/pull/4484)

- Fixed the fix for `std::result_of`. [#4496](https://github.com/XRPLF/rippled/pull/4496)

- Fixed errors for Clang 16. [#4501](https://github.com/XRPLF/rippled/pull/4501)

- Fixed an issue that caused switchover variables to initialize in an incorrect state. [#4527](https://github.com/XRPLF/rippled/pull/4527)

- Moveed a faulty assert. [#4533](https://github.com/XRPLF/rippled/pull/4533)

- Fixed unaligned load and stores. [#4531](https://github.com/XRPLF/rippled/pull/4531)

- Fixed node size estimation. [#4536](https://github.com/XRPLF/rippled/pull/4536)


### Code Cleanup and Testing

- Removed redundant uses of `std::move`. [#4564](https://github.com/XRPLF/rippled/pull/4565)

- Replaced `compare()` with the three-way comparison operator in `base_uint`, `Issue`, and `Book `. [#4411](https://github.com/XRPLF/rippled/pull/4411)

- Rectified the import paths of `boost::function_output_iterator`. [#4293](https://github.com/XRPLF/rippled/pull/4293)

- Expanded Linux test matrix. [#4454](https://github.com/XRPLF/rippled/pull/4454)

- Added patched recipe for SOCI. [#4510](https://github.com/XRPLF/rippled/pull/4510)

- Switched to self-hosted runners for macOS. [#4511](https://github.com/XRPLF/rippled/pull/4511)

- Added missing headers. [#4555](https://github.com/XRPLF/rippled/pull/4555)


### Docs

- Added refactor build instructions. [#4381](https://github.com/XRPLF/rippled/pull/4381)

- Added install instructions for package managers. [#4472](https://github.com/XRPLF/rippled/pull/4472)

- Fixed a typo in `SECURITY.md`. [#4508](https://github.com/XRPLF/rippled/pull/4508)

- Updated `environment.md`. [#4498](https://github.com/XRPLF/rippled/pull/4498)

- Updated `BUILD.md` for clarity. [#4514](https://github.com/XRPLF/rippled/pull/4514)

- Added comments for NFToken-related invariants. [#4558](https://github.com/XRPLF/rippled/pull/4558)


[Full Commit Log](https://github.com/XRPLF/rippled/compare/1.10.0...1.11.0)


### GitHub

The public source code repository for `rippled` is hosted on GitHub at <https://github.com/XRPLF/rippled>.

We welcome all contributions and invite everyone to join the community of XRP Ledger developers to help build the Internet of Value.


## Credits

The following people contributed directly to this release:

- Alloy Networks <45832257+alloynetworks@users.noreply.github.com>
- Brandon Wilson <brandon@coil.com>
- Chenna Keshava B S <21219765+ckeshava@users.noreply.github.com>
- Denis Angell <dangell@transia.co>
- Ed Hennis <ed@ripple.com>
- Elliot Lee <github.public@intelliot.com>
- John Freeman <jfreeman08@gmail.com>
- Mark Travis <mtrippled@users.noreply.github.com>
- Nik Bougalis <nikb@bougalis.net>
- RichardAH <richard.holland@starstone.co.nz>
- Scott Determan <scott.determan@yahoo.com>
- Scott Schurr <scott@ripple.com>
- Shawn Xie <35279399+shawnxie999@users.noreply.github.com>
- ledhed2222 <ledhed2222@users.noreply.github.com>
- solmsted <steven.olm@gmail.com>

New Contributors:

- Chenna Keshava
- David Fuelling <sappenin@gmail.com>
- drlongle <drlongle@gmail.com>
- oeggert <117319296+oeggert@users.noreply.github.com>
- solmsted <steven.olm@gmail.com>

Bug Bounties and Responsible Disclosures:

We welcome reviews of the rippled code and urge researchers to responsibly disclose any issues they may find.

To report a bug, please send a detailed report to: <bugs@xrpl.org>
