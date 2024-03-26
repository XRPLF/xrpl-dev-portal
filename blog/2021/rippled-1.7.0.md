---
category: 2021
theme:
    markdown:
        editPage:
            hide: true
date: 2021-02-24
labels:
    - rippled Release Notes
---
# Introducing XRP Ledger version 1.7.0

Ripple has released version 1.7.0 of `rippled`, the reference server implementation of the XRP Ledger protocol. This release [significantly improves memory usage](https://blog.ripplex.io/how-ripples-c-team-cut-rippleds-memory-footprint-down-to-size/), introduces a protocol amendment to allow out-of-order transaction execution with Tickets, and brings several other features and improvements.

## Upgrading (SPECIAL ACTION REQUIRED)

If you use the precompiled binaries of `rippled` that Ripple publishes for supported platforms, please note that Ripple has renewed the GPG key used to sign these packages. If you are upgrading from a previous install, you must download and trust the renewed key. **Automatic upgrades will not work** until you have re-trusted the key.

### Red Hat Enterprise Linux / CentOS

_(These instructions have been updated.)_ First, re-add the repository to get the updated key.

```
cat << REPOFILE | sudo tee /etc/yum.repos.d/ripple.repo
[ripple-stable]
name=XRP Ledger Packages
enabled=1
gpgcheck=0
repo_gpgcheck=1
baseurl=https://repos.ripple.com/repos/rippled-rpm/stable
gpgkey=https://repos.ripple.com/repos/rippled-rpm/stable/repodata/repomd.xml.key
REPOFILE
```

Then perform a [manual upgrade](https://xrpl.org/update-rippled-manually-on-centos-rhel.html). When prompted, confirm that the key's fingerprint matches the following example, then press `y` to accept the updated key:

```sh
$ sudo yum install rippled
Loaded plugins: fastestmirror
Loading mirror speeds from cached hostfile
* base: mirror.web-ster.com
* epel: mirrors.syringanetworks.net
* extras: ftp.osuosl.org
* updates: mirrors.vcea.wsu.edu
ripple-nightly/signature
|  650 B  00:00:00    
Retrieving key from https://repos.ripple.com/repos/rippled-rpm/nightly/repodata/repomd.xml.key
Importing GPG key 0xCCAFD9A2:
Userid     : "TechOps Team at Ripple <techops+rippled@ripple.com>"
Fingerprint: c001 0ec2 05b3 5a33 10dc 90de 395f 97ff ccaf d9a2
From       : https://repos.ripple.com/repos/rippled-rpm/nightly/repodata/repomd.xml.key
Is this ok [y/N]: y
```

### Ubuntu / Debian

Download and trust the updated public key, then perform a [manual upgrade](https://xrpl.org/update-rippled-manually-on-ubuntu.html) as follows:

```bash
$ wget -q -O - "https://repos.ripple.com/repos/api/gpg/key/public" | \
    sudo apt-key add -
$ sudo apt -y update
$ sudo apt -y install rippled
```

## Installation

On supported platforms, see the [instructions on updating rippled](https://xrpl.org/install-rippled.html).

| Package | SHA-256 |
|:--------|:--------|
| [RPM for Red Hat / CentOS (x86-64)](https://repos.ripple.com/repos/rippled-rpm/stable/rippled-1.7.0-1.el7.x86_64.rpm) | `da32137d460c6c2ce5b7035d82b637f71138fa92564f7ab1fdf04d1e59be8f2a` |
| [DEB for Ubuntu / Debian (x86-64)](https://repos.ripple.com/repos/rippled-deb/pool/stable/rippled_1.7.0-1_amd64.deb) | `1920881caab4fac02a4a99a67bb4f2746b89f7b99f2c28e83832039a2dd5d8a5` |

For other platforms, please [build from source](https://github.com/ripple/rippled/tree/master/Builds). The most recent commit in the git log should be the change setting the version:

```text
commit c0a0b79d2d483b318ce1d82e526bd53df83a4a2c
Author: manojsdoshi <mdoshi@ripple.com>
Date:   Tue Feb 23 12:51:11 2021 -0800

     Set version to 1.7.0
```

## Change Log

### New and Improved Features

- **Rework deferred node logic and async fetch behavior:** This change significantly improves ledger sync and fetch times while reducing memory consumption. (More information on the [RippleX blog](https://blog.ripplex.io/how-ripples-c-team-cut-rippleds-memory-footprint-down-to-size/))

- **New Ticket feature:** Tickets are a mechanism to prepare and send certain transactions outside of the normal sequence order. This version reworks and completes the implementation for Tickets after more than 6 years of development. This feature is now open for voting as the newly-introduced `TicketBatch` amendment, which replaces the previously-proposed `Tickets` amendment. The specification for this change can be found at: [xrp-community/standards-drafts#16](https://github.com/xrp-community/standards-drafts/issues/16)

- **Add Reporting Mode:** The server can be compiled to operate in a new mode that serves API requests for validated ledger data without connecting directly to the peer-to-peer network. (The server needs a gRPC connection to another server that is on the peer-to-peer network.) Reporting Mode servers can share access to ledger data via Apache Cassandra and PostgreSQL to more efficiently serve API requests while peer-to-peer servers specialize in broadcasting and processing transactions. ([#3609](https://github.com/ripple/rippled/pull/3609))

- **Optimize relaying of validation and proposal messages:** Servers typically receive multiple copies of any given message from directly connected peers; in particular, consensus proposal and validation messages are often relayed with extremely high redundancy. For servers with several peers, this can cause redundant work. This commit introduces experimental code that attempts to optimize the relaying of proposals and validations by allowing servers to instruct their peers to "squelch" delivery of selected proposals and validations. This change is considered experimental at this time and is disabled by default because the functioning of the consensus network depends on messages propagating with high reliability through the constantly-changing peer-to-peer network. Server operators who wish to test the optimized code can enable it in their server config file. ([#3412](https://github.com/ripple/rippled/pull/3412))

- **Report server domain to other servers:** Server operators now have the option to configure a domain name to be associated with their servers. The value is communicated to other servers and is also reported via the `server_info` API. The value is meant for third-party applications and tools to group servers together. For example, a tool that visualizes the network's topology can show how many servers are operated by different stakeholders. An operator can claim any domain, so tools should use the [xrp-ledger.toml file](https://xrpl.org/xrp-ledger-toml.html) to confirm that the domain also claims ownership of the servers. ([#3597](https://github.com/ripple/rippled/pull/3597))

- **Improve handling of peers that aren't synced:** When evaluating the fitness and usefulness of an outbound peer, the code would incorrectly calculate the amount of time that the peer spent in a non-useful state. This release fixes the calculation, and server operators can now configure the timeout values in the `[overlay]` stanza of the config file. ([#3603](https://github.com/ripple/rippled/pull/3603))

- **Persist API-configured voting settings:** Previously, the amendments that a server would vote in support of or against could be configured both via the configuration file and via the ["feature" API method](https://xrpl.org/feature.html). Changes made in the configuration file were only loaded at server startup; changes made via the command line take effect immediately but were not persisted across restarts. Starting with this release, changes made via the API are saved to the `wallet.db` database file so that they persist even if the server is restarted. ([#3617](https://github.com/ripple/rippled/pull/3617))

    Amendment voting in the config file is deprecated. The first time the server starts with v1.7.0 or higher, it reads any amendment voting settings in the config file and saves the settings to the database; on later restarts the server prints a warning message and ignores the `[amendments]` and `[veto_amendments]` stanzas of the config file.

    Going forward, use the [feature method](https://xrpl.org/feature.html) to view and configure amendment votes. If you want to use the config file to configure amendment votes, add a line to the `[rpc_startup]` stanza such as the following:

        [rpc_startup]
        { "command": "feature", "feature": "FlowSortStrands", "vetoed": true }

- **Support UNLs with future effective dates:** Updates the format for the recommended validator list file format, allowing publishers to pre-publish the next recommended UNL while the current one is still valid. The server is still backwards compatible with the previous format, but the new format removes some uncertainty during the transition from one list to the next. Also, starting with this release, the server locks down and reports an error if it has no valid validator list. You can clear the error by loading a validator list from a file or by configuring a different UNL and restarting; the error also goes away on its own if the server is able to obtain a trusted validator list from the network (for example, after an network outage resolves itself). ([#3619](https://github.com/ripple/rippled/pull/3619))

- **Improve manifest relaying:** Servers now propagate change messages for validators' ephemeral public keys ("manifests") on a best-effort basis, to make manifests more available throughout the peer-to-peer network. Previously, the server would only relay manifests from validators it trusts locally, which made it difficult to detect and track validators that are not broadly trusted. ([#3722](https://github.com/ripple/rippled/pull/3722))

- **Implement ledger forward replay feature:** The server can now sync up to the network by "playing forward" transactions from a previously saved ledger until it catches up to the network. Compared with the default behavior of fetching the latest state and working backwards, forward replay can save time and bandwidth by reconstructing previous ledgers' state data rather than downloading the pre-calculated results from the network. As an added bonus, forward replay confirms that the rest of the network followed the same transaction processing rules as the local server when processing the intervening ledgers. This feature is considered experimental this time and can be enabled with an option in the config file. ([#3659](https://github.com/ripple/rippled/pull/3659))

- **Make the transaction job queue limit adjustable:** The server uses a job queue to manage tasks, with limits on how many jobs of a particular type can be queued. The previously hard-coded limit associated with transactions is now configurable. Server operators can increase the number of transactions their server is able to queue, which may be useful if your server has a large memory capacity or you expect an influx of transactions. ([#3556](https://github.com/ripple/rippled/issues/3556))

- **Add public_key to the Validator List method response:** The [Validator List method](https://xrpl.org/validator-list.html) can be used to request a recommended validator list from a `rippled` instance. The response now includes the public key of the requested list. ([#3392](https://github.com/ripple/rippled/issues/3392))

- **Server operators can now configure maximum inbound and outbound peers separately:** The new `peers_in_max` and `peers_out_max` config options allow server operators to independently control the maximum number of inbound and outbound peers the server allows. ([#3616](https://github.com/ripple/rippled/pull/3616))

- **Improvements to shard downloading:** Previously the `download_shard` command could only load shards over HTTPS. Compressed shards can now also be downloaded over plain HTTP. The server fully checks the data for integrity and consistency, so the encryption is not strictly necessary. When initiating multiple shard downloads, the server now returns an error if there is not enough space to store all the shards currently being downloaded. ([#3578](https://github.com/ripple/rippled/pull/3578), [#3604](https://github.com/ripple/rippled/pull/3604))

- **The `manifest` command is now public:** The manifest API method returns public information about a given validator. The required permissions have been changed so it is now part of the public API. ([#3612](https://github.com/ripple/rippled/pull/3612))


### Bug Fixes

- **Implement sticky DNS resolution for validator list retrieval:** When attempting to load a validator list from a configured site, attempt to reuse the last IP that was successfully used if that IP is still present in the DNS response. ([#3494](https://github.com/ripple/rippled/issues/3494))

- **Improve handling of RPC ledger_index argument:** You can now provide the `ledger_index` as a numeric string. This allows you to copy and use the numeric string `ledger_index` value returned by certain RPC commands. Previously you could only send native JSON numbers or shortcut strings such as "validated" in the `ledger_index` field. ([#3533](https://github.com/ripple/rippled/issues/3533))

- **Fix improper promotion of bool on return**  ([6968da1](https://github.com/ripple/rippled/commit/6968da1))

- **Fix ledger sequence on copynode** ([#3643](https://github.com/ripple/rippled/pull/3643))

-  **Fix parsing of node public keys in `manifest` CLI:** The previous code attempts to validate the provided node public key using a function that assumes that the encoded public key is for an account. This causes the parsing to fail. The caller can now specify the type of the public key being checked. ([#3317](https://github.com/ripple/rippled/issues/3317))

- **Fix idle peer timer:** Fixes a bug where a function to remove idle peers was called every second instead of every 4 seconds. ([#3754](https://github.com/ripple/rippled/issues/3754))

- **Add database counters:** Fix bug where `DatabaseRotateImp::getBackend` and `::sync` utilized the writable backend without a lock. `::getBackend` was replaced with `::getCounters`. ([#3755](https://github.com/ripple/rippled/pull/3755))

- **Improve online_delete configuration and DB tuning** ([#3321](https://github.com/ripple/rippled/issues/3321))

- **Improve handling of burst writes in NuDB database** ([#3662](https://github.com/ripple/rippled/pull/3662))

- **Fix excessive logging after disabling history shards.** Previously if you configured the server with a shard store, then disabled it, the server output excessive warning messages about the shard limit being exceeded. ([#3620](https://github.com/ripple/rippled/pull/3620))

- **Fixed some issues with negotiating link compression.** ([#3705](https://github.com/ripple/rippled/pull/3705))

- **Fixed a potential thread deadlock with history sharding.** ([#3683](https://github.com/ripple/rippled/pull/3683))

- **Various fixes to typos and comments, refactoring, and build system improvements**

### Amendments introduced in 1.7

**fixSTAmountCanonicalize:** Fix a rare bug in deserializing currency amounts.
**FlowSortStrands:** Improve efficiency of cross-currency payment execution.
**TicketBatch:** Add Tickets feature for executing transactions outside of the typical sequence order.
For more information on these and other protocol amendments, please see [Known Amendments](https://xrpl.org/known-amendments.html).


## Contributions

### GitHub

The public git repository for `rippled` is hosted on GitHub at <https://github.com/ripple/rippled>.

We welcome contributions, big and small, and invite everyone to join the community
of XRP Ledger developers and help us build the Internet of Value.


### Credits
The following people contributed directly to this release:


- CJ Cobb <ccobb@ripple.com>
- Carl Hua <carlhua@gmail.com>
- Crypto Brad Garlinghouse <cryptobradgarlinghouse@protonmail.com>
- Danil Nemirovsky <danil.nemirovsky@gmail.com>
- Devon White <dwhite@ripple.com>
- Edward Hennis <ed@ripple.com>
- Elliot Lee <github.public@intelliot.com>
- Gregory Tsipenyuk <gtsipenyuk@ripple.com>
- Howard Hinnant <howard.hinnant@gmail.com>
- Ikko Ashimine <eltociear@gmail.com>
- David 'JoelKatz' Schwartz <DavidJoelSchwartz@GMail.com>
- John Freeman <jfreeman08@gmail.com>
- John Northrup <jnorthrup@ripple.com>
- Mark Travis <mtravis@ripple.com>
- Miguel Portilla <miguelportilla@pobros.com>
- Nathan Nichols <natenichols@cox.net>
- Nik Bougalis <nikb@bougalis.net>
- Peng Wang <pwang200@gmail.com>
- Richard Holland <richard.holland@starstone.co.nz>
- Scott Schurr <scott@ripple.com>
- Wietse Wind <w.wind@ipublications.net>
- cdy20 <dcherukhin@ripple.com>
- Rome Reginelli <rome@ripple.com>
- Manoj Doshi <mdoshi@ripple.com>
- Scott Determan <scott.determan@yahoo.com>

#### Lifetime Contributors

The following is the list of people who made code contributions, large and small, to XRP Ledger prior to the release of 1.7.0:

Aishraj Dahal, Alex Chung, Alex Dupre, Alloy Networks, Andrey Fedorov, Arthur Britto, Bharath Chari, Bob Way, Brad Chase, Brandon Wilson, Bryce Lynch, Carl Hua, Casey Bodley, Christian Ramseier, CJ Cobb, crazyquark, Crypto Brad Garlinghouse, David Grogan, David 'JoelKatz' Schwartz, Devon White, Donovan Hide, Edward Hennis, Elliot Lee, Eric Lombrozo, Ethan MacBrough, Evan Hubinger, Frank Cash, Gábor Lipták, Gregory Tsipenyuk, Howard Hinnant, Ian Roskam, invalidator, Jack Bond-Preston, James Fryman, jatchili, Jcar, Jed McCaleb, Jeff Trull, Jeroen Meulemeester, Jesper Wallin, Joe Loser, Johanna Griffin, John Freeman, John Northrup, Joseph Busch, Josh Juran, Justin Lynn, Keaton Okkonen, Kirill Fomichev, Lazaridis, Lieefu Way, Luke Cyca, Manoj Doshi, Mark Travis, Markus Alvila, Markus Teufelberger, Mayur Bhandary, Miguel Portilla, Mike Ellery, MJK, Mo Morsi, Nicholas Dudfield, Nikolaos D. Bougalis, Niraj Pant, p2peer, Patrick Dehne, Peng Wang, Roberto Catini, Rome Reginelli, Scott Determan, Scott Schurr, S. Matthew English, Stefan Thomas, ShangyanLi, The Gitter Badger, Ties Jan Hefting, Tim Lewkow, Tom 'Swirly' Ritchford, Torrie Fischer, Vahe Hovhannisyan, Vinnie Falco, Vishwas Patil, Warren Paul Anderson, Will, wltsmrz, Wolfgang Spraul, Yana Novikova and Yusuf Sahin HAMZA.

For a real-time view of all contributors, including links to the commits made by each, please visit the "Contributors" section of the GitHub repository: <https://github.com/ripple/rippled/graphs/contributors>.

We welcome external contributions and are excited to see the broader XRP Ledger community continue to grow and thrive.
