---
category: 2024
date: 2024-01-29
labels:
    - rippled Release Notes
theme:
    markdown:
        editPage:
            hide: true
---
# Introducing XRP Ledger version 2.0.1

Version 2.0.1 of `rippled`, the reference server implementation of the XRP Ledger protocol, is now available. This release includes minor fixes, unit test improvements, and doc updates.

[Sign Up for Future Release Announcements](https://groups.google.com/g/ripple-server)

<!-- BREAK -->


## Action Required

If you operate an XRP Ledger server, upgrade to version 2.0.1 to take advantage of the changes included in this update. Nodes on version 1.12 should upgrade as soon as possible.


## Install / Upgrade

On supported platforms, see the [instructions on installing or updating `rippled`](https://xrpl.org/install-rippled.html).

| Package | SHA-256 |
|:--------|:--------|
| [RPM for Red Hat / CentOS (x86-64)](https://repos.ripple.com/repos/rippled-rpm/stable/rippled-2.0.1-1.el7.x86_64.rpm) | `b3e4bb6466e857b643e1cdcc03df32d318bc87af7f69d9d5f33124632c90fcf5` |
| [DEB for Ubuntu / Debian (x86-64)](https://repos.ripple.com/repos/rippled-deb/pool/stable/rippled_2.0.1-1_amd64.deb) | `55b2e15776d57f8eb405d73fa796fbb5e94b0d4ef350dece4baa675a1fb73cd6` |
| [Portable Builds (Linux x86-64)](https://github.com/XRPLF/rippled-portable-builds) | (Use signature verification) |

For other platforms, please [build from source](https://github.com/ripple/rippled/tree/master/Builds). The most recent commit in the git log should be the change setting the version:

```text
commit 22cdb5728b7eb563f6798dbd1f15c88fa1894e7c
Author: Elliot Lee <github.public@intelliot.com>
Date:   Mon Jan 29 08:36:10 2024 -0800

    Set version to 2.0.1
```


## Changelog


### Changes
(These are changes which may impact or be useful to end users. For example, you may be able to update your code/workflow to take advantage of these changes.)

- Updated the `send_queue_limit` to 500 in the default `rippled` config to handle increased transaction loads. [#4867](https://github.com/XRPLF/rippled/pull/4867)


### Bug Fixes and Performance Improvements
(These are behind-the-scenes improvements, such as internal changes to the code, which are not expected to impact end users.)

- Fixed an assertion that occurred when `rippled` was under heavy websocket client load. [#4848](https://github.com/XRPLF/rippled/pull/4848)

- Improved lifetime management of serialized type ledger entries to improve memory usage. [#4822](https://github.com/XRPLF/rippled/pull/4822)

- Fixed a clang warning about deprecated sprintf usage. [#4747](https://github.com/XRPLF/rippled/pull/4747)


### Docs and Build System

- Added `DeliverMax` to more JSONRPC tests. [#4826](https://github.com/XRPLF/rippled/pull/4826)

- Updated the pull request template to include a `Type of Change` checkbox and additional contextual questions. [#4875](https://github.com/XRPLF/rippled/pull/4875)

- Updated help messages for unit tests pattern matching. [#4846](https://github.com/XRPLF/rippled/pull/4846)

- Improved the time it take to generate coverage reports. [#4849](https://github.com/XRPLF/rippled/pull/4849)

- Fixed broken links in the Conan build docs. [#4699](https://github.com/XRPLF/rippled/pull/4699)

- Spurious codecov uploads are now retried if there's an error uploading them the first time. [#4896](https://github.com/XRPLF/rippled/pull/4896)



[Full Commit Log](https://github.com/XRPLF/rippled/compare/2.0.0...2.0.1)


### GitHub

The public source code repository for `rippled` is hosted on GitHub at <https://github.com/XRPLF/rippled>.

We welcome all contributions and invite everyone to join the community of XRP Ledger developers to help build the Internet of Value.


## Credits

The following people contributed directly to this release:

- Bronek Kozicki <brok@incorrekt.com>
- Chenna Keshava B S <21219765+ckeshava@users.noreply.github.com>
- Ed Hennis <ed@ripple.com>- 
- Elliot Lee <github.public@intelliot.com>
- Lathan Britz <jucallme@gmail.com>
- Mark Travis <mtrippled@users.noreply.github.com>
- nixer89 <pbnixer@gmail.com>

Bug Bounties and Responsible Disclosures:

We welcome reviews of the `rippled` code and urge researchers to responsibly disclose any issues they may find.

To report a bug, please send a detailed report to: <bugs@xrpl.org>
