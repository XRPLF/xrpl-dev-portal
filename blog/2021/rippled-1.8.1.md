---
category: 2021
theme:
    markdown:
        editPage:
            hide: true
date: 2021-12-02
labels:
    - rippled Release Notes
---
# Introducing XRP Ledger version 1.8.1

Version 1.8.1 of `rippled`, the reference server implementation of the XRP Ledger protocol, is now available. This release contains several improvements and optimizations to improve stability and performance under load, along with other features and fixes including deterministic history shards, default amendment votes, and the CheckCashMakesTrustLine amendment.

This release supersedes version 1.8.0. Version 1.8.1 makes additional changes to database tuning parameters to optimize start-up and syncing time. It is **highly recommended that operators upgrade to 1.8.1 as soon as possible** because the optimizations in this release should help alleviate some of the [pressure on the network from increased usage](https://dev.to/ripplexdev/update-on-the-xrpl-5f3e).

<!-- BREAK -->

## Action Recommended

This release introduces a new amendment to the XRP Ledger protocol: CheckCashMakesTrustLine. This amendment is now **open for voting** according to the XRP Ledger's [amendment process](https://xrpl.org/amendments.html), which enables protocol changes following two weeks of >80% support from trusted validators.

**If you operate an XRP Ledger server,** then you should upgrade to version 1.8.1 within two weeks, to ensure service continuity. The exact time that protocol changes take effect depends on the voting decisions of the decentralized network.

Additionally, version 1.8.1 is highly recommended because the performance optimizations should improve the speed and stability of the server when the network is under high load. Increased network traffic and ledger size in recent months have made it difficult for machines with lower hardware specs to stay synced with the XRP Ledger Mainnet. The optimizations in 1.8.1 mitigate some of the effects of these trends.

If you issue currency in the XRP Ledger, you can use this new behavior to simplify the process of issuing tokens after the amendment becomes enabled. See the [CheckCashMakesTrustLine description](https://xrpl.org/known-amendments.html#checkcashmakestrustline) for details.


## Install / Upgrade

On supported platforms, see the [instructions on installing or updating `rippled`](https://xrpl.org/install-rippled.html).

| Package | SHA-256 |
|:--------|:--------|
| [RPM for Red Hat / CentOS (x86-64)](https://repos.ripple.com/repos/rippled-rpm/stable/rippled-1.8.1-1.el7.x86_64.rpm) | `be092bcb02f8118121f6303ede4f109601f797cd02a1ddaf237604fd54e0237b` |
| [DEB for Ubuntu / Debian (x86-64)](https://repos.ripple.com/repos/rippled-deb/pool/stable/rippled_1.8.1-1_amd64.deb) | `b95772f59cfcd0fb2318ad908ab00421bcbd46c430c12371c0fc9d6003ed06b3` |

For other platforms, please [build from source](https://github.com/ripple/rippled/tree/master/Builds). The most recent commit in the git log should be the change setting the version:

```text
commit fbedfb25aefc609aff2c6090b19c419c224a8ab2
Author: manojsdoshi <mdoshi@ripple.com>
Date:   Wed Nov 24 10:32:25 2021 -0800

    Set version to 1.8.1
```

### Automatic Updates After This Version

Starting _after_ this version, new `rippled` packages _do not_ automatically restart the server after performing an [automatic upgrade](https://xrpl.org/update-rippled-automatically-on-linux.html). The server continues to run the old version even after upgrading, until it is restarted. The server automatically switches to the new server after a reboot or if you manually restart the service, for example:

```sh
sudo systemctl restart rippled.service
```

This change is intended to decrease the chances that multiple important servers (including validators, hubs, and public API servers) go offline to restart and re-sync at the same time. However, automatic upgrades _to_ version 1.8.1 still restart the server automatically (after a randomized delay).


## Changelog

### New and Improved Features

- **Improve History Sharding**: Shards of ledger history are now assembled in a deterministic way so that any server can make a binary-identical shard for a given range of ledgers. This makes it possible to retrieve a shard from multiple sources in parallel, then verify its integrity by comparing checksums with peers' checksums for the same shard. Additionally, there's a new admin RPC command to import ledger history from the shard store, and the crawl_shards command has been expanded with more info. ([#2688](https://github.com/ripple/rippled/issues/2688), [#3726](https://github.com/ripple/rippled/pull/3726), [#3875](https://github.com/ripple/rippled/pull/3875))
- **New CheckCashMakesTrustLine Amendment**: If enabled, this amendment will change the CheckCash transaction type so that cashing a Check for an issued token automatically creates a trust line to hold the token, similar to how purchasing a token in the decentralized exchange creates a trust line to hold the token. This change provides a way for issuers to send tokens to a user before that user has set up a trust line, but without forcing anyone to hold tokens they don't want. ([#3823](https://github.com/ripple/rippled/pull/3823))
- **Automatically determine the node size**: The server now selects an appropriate `[node_size]` configuration value by default if it is not explicitly specified. This parameter tunes various settings to the specs of the hardware that the server is running on, especially the amount of RAM and the number of CPU threads available in the system. Previously the server always chose the smallest value by default. ([#3820](https://github.com/ripple/rippled/pull/3820))
- **Improve transaction relaying logic**: Previously, the server relayed every transaction to all its peers (except the one that it received the transaction from). To reduce redundant messages, the server now relays transactions to a subset of peers using a randomized algorithm. Peers can determine whether there are transactions they have not seen and can request them from a peer that has them. It is expected that this feature will further reduce the bandwidth needed to operate a server. ([#3618](https://github.com/ripple/rippled/pull/3618))
- **Improve the Byzantine validator detector**: This expands the detection capabilities of the Byzantine validation detector. Previously, the server only monitored validators on its own UNL. Now, the server monitors for Byzantine behavior in all validations it sees. ([#3778](https://github.com/ripple/rippled/pull/3778))
- **Experimental tx stream with history for sidechains**: Adds an experimental subscription stream for sidechain federators to track messages on the main chain in canonical order. This stream is expected to change or be replaced in future versions as work on sidechains matures.
- **Support Debian 11 Bullseye**: This is the first release that is compatible with Debian Linux version 11.x, "Bullseye." The .deb packages now use absolute paths only, for compatibility with Bullseye's stricter package requirements. ([#3909](https://github.com/ripple/rippled/pull/3909))
- **Improve Cache Performance**: The server uses a new storage structure for several in-memory caches for greatly improved overall performance. The process of purging old data from these caches, called "sweeping", was time-consuming and blocked other important activities necessary for maintaining ledger state and participating in consensus. The new structure divides the caches into smaller partitions that can be swept in parallel. ([19018e8](https://github.com/ripple/rippled/commit/19018e895905adfe70030f6c03e7ec8d03f81aef))
- **Amendment default votes:** Introduces variable default votes per amendment. Previously the server always voted "yes" on any new amendment unless an admin explicitly configured a voting preference for that amendment. Now the server's default vote can be "yes" or "no" in the source code. This should allow a safer, more gradual roll-out of new amendments, as new releases can be configured to understand a new amendment but not vote for it by default. ([#3877](https://github.com/ripple/rippled/pull/3877))
- **More fields in the `validations` stream:** The `validations` subscription stream in the API now reports additional fields that were added to validation messages by the HardenedValidations amendment. These fields make it easier to detect misconfigurations such as multiple servers sharing a validation key pair. ([#3865](https://github.com/ripple/rippled/pull/3865))
- **Reporting mode supports `validations` and `manifests` streams:** In the API it is now possible to connect to these streams when connected to a servers running in reporting. Previously, attempting to subscribe to these streams on a reporting server failed with the error `reportingUnsupported`. ([#3905](https://github.com/ripple/rippled/pull/3905))

### Bug Fixes

- **Clarify the safety of NetClock::time_point arithmetic**: `NetClock::rep` is uint32_t and can be error-prone when used with subtraction. Fixes [#3656](https://github.com/ripple/rippled/pull/3656)
- **Fix out-of-bounds reserve, and some minor optimizations**
- **Fix nested locks in ValidatorSite**
- **Fix clang warnings about copies vs references**
- **Fix reporting mode build issue**
- **Fix potential deadlock in Validator sites**
- **Use libsecp256k1 instead of OpenSSL for key derivation**: The deterministic key derivation code was still using calls to OpenSSL. This replaces the OpenSSL-based routines with new libsecp256k1-based implementations
- **Improve NodeStore to ShardStore imports**: This runs the import process in a background thread while preventing online_delete from removing ledgers pending import
- **Simplify SHAMapItem construction**: The existing class offered several constructors which were mostly unnecessary. This eliminates all existing constructors and introduces a single new one, taking a `Slice`. The internal buffer is switched from `std::vector` to `Buffer` to save a minimum of 8 bytes (plus the buffer slack that is inherent in `std::vector`) per SHAMapItem instance.
- **Redesign stoppable objects**: Stoppable is no longer an abstract base class, but a pattern, modeled after the well-understood `std::thread`. The immediate benefits are less code, less synchronization, less runtime work, and (subjectively) more readable code. The end goal is to adhere to RAII in our object design, and this is one necessary step on that path.
