---
category: 2022
date: 2022-01-13
labels:
    - rippled Release Notes
theme:
    markdown:
        editPage:
            hide: true
---
# Introducing XRP Ledger version 1.8.4

Version 1.8.4 of `rippled`, the reference server implementation of the XRP Ledger protocol, is now available. This release improves syncing performance including a new "fast load" setting, adds countermeasures for a security vulnerability in LZ4, and adjusts some tuning parameters to improve resource usage. Notably, this release limits pathfinding API methods to fewer and shorter paths because the previous pathfinding settings were causing excessive memory usage as a result of the overall size of the XRP Ledger Mainnet data.

This release supersedes version 1.8.3, and fixes an issue that was discovered during the release cycle.

<!-- BREAK -->

## Action Required

**If you operate an XRP Ledger server,** then you should upgrade to version 1.8.4 at your earliest convenience to take advantage of the changes included in this hotfix.

## Install / Upgrade

On supported platforms, see the [instructions on installing or updating `rippled`](https://xrpl.org/install-rippled.html).

| Package | SHA-256 |
|:--------|:--------|
| [RPM for Red Hat / CentOS (x86-64)](https://repos.ripple.com/repos/rippled-rpm/stable/rippled-1.8.4-1.el7.x86_64.rpm) | `b47fae21505a8dfe88ffc315d6bebb5fb5204bc74a9b8439bb9b8d1b8ffe45ee` |
| [DEB for Ubuntu / Debian (x86-64)](https://repos.ripple.com/repos/rippled-deb/pool/stable/rippled_1.8.4-1_amd64.deb) | `e7f642a4b7f4790c99a0e92d4d48d167ed33b030363a79d1d5f9404cb0fef31c` |

For other platforms, please [build from source](https://github.com/ripple/rippled/tree/master/Builds). The most recent commit in the git log should be the change setting the version:

```text
commit d49b4862244d9359c046bd04d48237591516cb6a
Author: Nik Bougalis <nikb@bougalis.net>
Date:   Wed Jan 12 14:54:48 2022 -0800

    Set version to 1.8.4
```

## Syncing Improvements

Syncing to the shared network state when starting the server has been an area of focus for core XRP Ledger developers over the past few months, especially as increased network usage and larger state data have highlighted the shortcomings of the existing code. Version 1.8.4 has several fixes that improve the syncing process for all servers. These include:

- **Provide sensible default values for nodestore cache:**: The nodestore includes a built-in cache to reduce the disk I/O load but, by default, this cache was not initialized unless it was explicitly configured by the server operator. This release introduces sensible defaults based on the server's configured node size.
- **Adjust the number of concurrent ledger data jobs**: Processing a large amount of data at once can effectively bottleneck a server's I/O subsystem. This release helps optimize I/O performance by controlling how many jobs can concurrently process ledger data.
- **Two small SHAMapSync improvements**: This release makes minor changes to optimize the way memory is used to control the amount of background I/O performed when attempting to fetch missing `SHAMap` nodes.

### Fast Loading

In addition to the above improvements, version 1.8.4 adds a "fast load" setting which dramatically speeds up the process of syncing to the network on servers that already hold a large amount of data, such as full history servers. On some servers, fast load has been shown to decrease sync time from multiple days to under an hour.

This setting is not enabled by default because it requires high performance disks; otherwise, the setting actually slows down the initial sync. To enable fast load, add the line `fast_load=1` to the `[node_db]` stanza in your server's config file, such as in the following example:

```
[node_db]
type=NuDB
path=/var/lib/rippled/db/nudb
fast_load=1
```

**Caution:** When the server is 'fast loading' data, it does not open JSON-RPC and WebSocket interfaces until after the initial load is completed. Because of this, it may appear unresponsive or down.

## Security Fixes

This release adds several countermeasures to defend against vulnerability [CVE-2021-3520](https://nvd.nist.gov/vuln/detail/CVE-2021-3520), which affects the LZ4 compression algorithm used in the server. In particular, the code is able to detect and avoid LZ4 payloads that may result in out-of-bounds memory accesses.

## Changelog

- Adjust pathfinding configuration defaults ([417cfc2](https://github.com/ripple/rippled/pull/4061/commits/417cfc2fb049dada484d196225cbfe49e54ad411))
- Adjust mutex scope in walkMapParallel ([febbe14](https://github.com/ripple/rippled/pull/4061/commits/febbe14e6ddb92a6d80d2393cced4d85901c7f93))
- Provide sensible default values for nodestore cache ([dc77853](https://github.com/ripple/rippled/pull/4061/commits/dc778536edc1fa12e7fbb7b7c6760e16c4bb8e57))
- Adjust number of concurrent ledger data jobs ([18584ef](https://github.com/ripple/rippled/pull/4061/commits/18584ef2fdb846f2bfdbaa90da2ab0f74b1e28d4))
- Detect CVE-2021-3520 when decompressing using LZ4 ([416ce35](https://github.com/ripple/rippled/pull/4061/commits/416ce35d7340572531f9658ed1917d1bfc29c524))
- Parallel ledger loader & I/O performance improvements ([7c12f01](https://github.com/ripple/rippled/pull/4061/commits/7c12f0135897361398917ad2c8cda888249d42ae))
- Two small SHAMapSync improvements ([5a4654a](https://github.com/ripple/rippled/pull/4061/commits/5a4654a0da67cfe1cf8c00c52e9ad204c61c3571))
