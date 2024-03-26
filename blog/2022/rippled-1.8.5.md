---
category: 2022
date: 2022-02-08
labels:
    - rippled Release Notes
theme:
    markdown:
        editPage:
            hide: true
---
# Introducing XRP Ledger version 1.8.5

Version 1.8.5 of `rippled`, the reference server implementation of the XRP Ledger protocol, is now available. This release includes fixes and updates for stability and security, and improvements to build scripts, including the ability to compile natively on Apple's M1 chips. There are no user-facing API or protocol changes in this release.

<!-- BREAK -->

## Action Required

**If you operate an XRP Ledger server,** then you should upgrade to version 1.8.5 at your earliest convenience to take advantage of the changes included in this hotfix.

## Install / Upgrade

On supported platforms, see the [instructions on installing or updating `rippled`](https://xrpl.org/install-rippled.html).

| Package | SHA-256 |
|:--------|:--------|
| [RPM for Red Hat / CentOS (x86-64)](https://repos.ripple.com/repos/rippled-rpm/stable/rippled-1.8.5-1.el7.x86_64.rpm) | `c3a84dbf7c4b253f86a85369bf8ab92198cbc8b42c37dd17b62c88b7b5b986bf` |
| [DEB for Ubuntu / Debian (x86-64)](https://repos.ripple.com/repos/rippled-deb/pool/stable/rippled_1.8.5-1_amd64.deb) | `b63b786de318677a8b179c2712466846f5541566a10c66763b6d9b0ac9738154` |

For other platforms, please [build from source](https://github.com/ripple/rippled/tree/master/Builds). The most recent commit in the git log should be the change setting the version:

```text
commit 72377e7bf25c4eaee5174186d2db3c6b4210946f
Author: Nik Bougalis <nikb@bougalis.net>
Date:   Fri Jan 21 18:08:02 2022 -0800

    Set version to 1.8.5
```

## Changelog

This release contains the following bug fixes and under-the-hood improvements:

- **Correct TaggedPointer move constructor:** Fixes a bug in unused code for the TaggedPointer class. The old code would fail if a caller explicitly tried to remove a child that is not actually part of the node. ([61389a8](https://github.com/ripple/rippled/commit/61389a8befd79104534f32275394ffb953196741))

- **Ensure protocol buffer prerequisites are present:** The build scripts and packages now properly handle Protobuf packages and various packages. Prior to this change, building on Ubuntu 21.10 Impish Indri would fail unless the `libprotoc-dev` package was installed. ([b7e0306](https://github.com/ripple/rippled/commit/b7e0306d0a69427055d33fe8b75a982b24f7f2f4))

- **Improve handling of endpoints during peer discovery.** This hardens and improves handling of incoming messages on the peer protocol. ([289bc0a](https://github.com/ripple/rippled/commit/289bc0afd928ce45dd919115c65ea7290f59eecd))

- **Run tests on updated linux distros:** Test builds now run on Rocky Linux 8, Fedora 34 and 35, Ubuntu 18, 20, and 22, and Debian 9, 10, and 11. ([a9ee802](https://github.com/ripple/rippled/commit/a9ee802240e92954d021caedde5ef749253d1a36))

- **Avoid dereferencing empty optional in ReportingETL:** Fixes a bug in Reporting Mode that could dereference an empty optional value when throwing an error. ([5b085a7](https://github.com/ripple/rippled/commit/5b085a75fd4f2a28804f15f6559a5ecd4d862d81))

- **Correctly add GIT_COMMIT_HASH into version string:** When building the server from a non-tagged release, the build files now add the commit ID in a way that follows the semantic-versioning standard, and correctly handle the case where the commit hash ID cannot be retrieved. ([d23d37f](https://github.com/ripple/rippled/commit/d23d37fcfd8a1126bedb033f4f07089488720d29))

- **Update RocksDB to version 6.27.3:** Updates the version of RocksDB included in the server from 6.7.3 (which was released on 2020-03-18) to 6.27.3 (released 2021-12-10). ([c5dc00a](https://github.com/ripple/rippled/commit/c5dc00af74eb22132b74570d7274360642dc7599))
