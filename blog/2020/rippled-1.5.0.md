---
category: 2020
date: 2020-04-10
labels:
    - rippled Release Notes
theme:
    markdown:
        editPage:
            hide: true
---
# Introducing XRP Ledger version 1.5.0

**XRP Ledger (`rippled` server) version 1.5.0** has been released. The `rippled` 1.5.0 release introduces several improvements and new features, including support for gRPC API, API versioning, UNL propagation via the peer network, new RPC methods `validator_info` and `manifest`, augmented `submit` method, improved `tx` method, improved CLI parsing, improved protocol-level handshaking protocol, improved package building and various other minor bug fixes and improvements.

<!-- BREAK -->

## Action Required

This release introduces two new amendments: `fixQualityUpperBound` and `RequireFullyCanonicalSig`. These amendments are now **open for voting** according to the XRP Ledger's [amendment process](https://xrpl.org/amendments.html), which enables protocol changes following two weeks of >80% support from trusted validators.

**If you operate an XRP Ledger server,** then you should upgrade to version 1.5.0 by 2020-04-13, to ensure service continuity. The exact time that protocol changes take effect could be on that date or later, depending on the voting decisions of the decentralized network.

If you operate an XRP Ledger validator, please [learn more about these amendments](https://xrpl.org/known-amendments.html) so you can make informed decisions about if and when your validator should [support them](https://xrpl.org/amendments.html#configuring-amendment-voting). If you take no action, your validator begins voting in favor of the new amendments as soon as it has been upgraded.

### Impact of Not Upgrading

When one or both of the new amendments become enabled, any server on a version earlier than 1.5.0 will become [amendment blocked](https://xrpl.org/amendments.html#amendment-blocked), meaning that it:

* Cannot determine the validity of a ledger;
* Cannot submit or process transactions;
* Cannot participate in the consensus process;
* Cannot vote on future amendments; and
* Could rely on potentially invalid data.

If the amendments do not become enabled, then your XRP Ledger server will not become amendment blocked and should continue to operate.

### Upgrading

For instructions on updating XRP Ledger on supported platforms, see here:

- [Install `rippled`](https://xrpl.org/install-rippled.html)

The SHA-256 hashes for the official packages are as follows:

| Package | SHA-256 |
|:--------|:--------|
| [Red Hat RPM (x86-64)](https://repos.ripple.com/repos/rippled-rpm/stable/rippled-1.5.0-1.el7.x86_64.rpm) | `fe6b5ba0958fd4531a917af4ba58efecf51c951e534f06e025a684c2777aa7f8` |
| [Ubuntu DEB (x86-64)](https://repos.ripple.com/repos/rippled-deb/pool/stable/rippled_1.5.0-1_amd64.deb) | `4ed13ab7cd65fcfe95d2ea85522414509b13e49f8a1633ac51b3457974cad6c6` |

For other platforms, please compile version 1.5.0 from source.

* [Build on Ubuntu Linux](https://xrpl.org/build-run-rippled-ubuntu.html)

* [Build on macOS](https://xrpl.org/build-run-rippled-macos.html)

* [Build on other platforms](https://github.com/ripple/rippled/tree/master/Builds)

The first log entry should be the change setting the version:

```text
commit f00f263852c472938bf8e993e26c7f96f435935c
Author: Carl Hua <carlhua@gmail.com>
Date:   Mon Mar 30 13:59:28 2020 -0400

    Set version to 1.5.0
```

## Learn, ask questions, and discuss

Related documentation is available in the [XRP Ledger Dev Portal](https://xrpl.org), including detailed example API calls and web tools for API testing, at <https://xrpl.org>.

Other resources:

- [XRP Chat Forum](http://www.xrpchat.com/)
- [Xpring Forum](https://forum.xpring.io/)


## Other Information

### Bug Bounties and Responsible Disclosures

As always, Ripple welcomes reviews of the **XRP Ledger** open source codebase and urges reviewers to responsibly disclose any issues that they may find. For more on Ripple's Bug Bounty program, please visit <https://ripple.com/bug-bounty/>.

### Compilation Requirements & Compatibility

Compiling `rippled` 1.5.0 from source on any platform requires a compiler that supports the C++17 ISO standard and a compatible edition of the [Boost](https://www.boost.org/) C++ libraries. Version 1.5.0 of `rippled` is compatible with **Boost versions 1.70.0 through 1.72.0**.

## 1.5.0 Change Log

### New and Updated Features

- The `RequireFullyCanonicalSig` amendment which changes the signature requirements for the XRP Ledger protocol so that non-fully-canonical signatures are no longer valid. This protects against transaction malleability on all transactions, instead of just transactions with the tfFullyCanonicalSig flag enabled. Without this amendment, a transaction is malleable if it uses a secp256k1 signature and does not have tfFullyCanonicalSig enabled. Most signing utilities enable tfFullyCanonicalSig by default, but there are exceptions. With this amendment, no single-signed transactions are malleable. (Multi-signed transactions may still be malleable if signers provide more signatures than are necessary.) All transactions must use the fully canonical form of the signature, regardless of the tfFullyCanonicalSig flag. Signing utilities that do not create fully canonical signatures are not supported. All of Ripple's signing utilities have been providing fully-canonical signatures exclusively since at least 2014. For more information. [`ec137044a`](https://github.com/ripple/rippled/commit/ec137044a014530263cd3309d81643a5a3c1fdab)
- Native [gRPC API](https://grpc.io/) support. Currently, this API provides a subset of the full `rippled` [API](https://xrpl.org/rippled-api.html). You can enable the gRPC API on your server with a new configuration stanza. [`7d867b806`](https://github.com/ripple/rippled/commit/7d867b806d70fc41fb45e3e61b719397033b272c)
- API Versioning which allows for future breaking change of RPC methods to co-exist with existing versions. [`2aa11fa41`](https://github.com/ripple/rippled/commit/2aa11fa41d4a7849ae6a5d7a11df6f367191e3ef)
- Nodes now receive and broadcast UNLs over the peer network under various conditions. [`2c71802e3`](https://github.com/ripple/rippled/commit/2c71802e389a59118024ea0152123144c084b31c)
- Augmented `submit` method to include additional details on the status of the command. [`79e9085dd`](https://github.com/ripple/rippled/commit/79e9085dd1eb72864afe841225b78ec96e72b5ca)
- Improved `tx` method response with additional details on ledgers searched. [`47501b7f9`](https://github.com/ripple/rippled/commit/47501b7f99d4103d9ad405e399169fc251161548)
- New `validator_info` method which returns information pertaining to the current validator's keys, manifest sequence, and domain. [`3578acaf0`](https://github.com/ripple/rippled/commit/3578acaf0b5f2d27ddc33f5b4cc81d21be1903ae)
- New `manifest` method which looks up manifest information for the specified key (either master or ephemeral). [`3578acaf0`](https://github.com/ripple/rippled/commit/3578acaf0b5f2d27ddc33f5b4cc81d21be1903ae)
- Introduce handshake protocol for compression negotiation (compression is not implemented at this point) and other minor improvements. [`f6916bfd4`](https://github.com/ripple/rippled/commit/f6916bfd429ce654e017ae9686cb023d9e05408b)
- Remove various old conditionals introduced by amendments. [`(51ed7db00`](https://github.com/ripple/rippled/commit/51ed7db0027ba822739bd9de6f2613f97c1b227b), [`6e4945c56)`](https://github.com/ripple/rippled/commit/6e4945c56b1a1c063b32921d7750607587ec3063)
- Add `getRippledInfo` info gathering script to `rippled` Linux packages. [`acf4b7889`](https://github.com/ripple/rippled/commit/acf4b78892074303cb1fa22b778da5e7e7eddeda)

### Bug Fixes

- The `fixQualityUpperBound` amendment which fixes a bug in unused code for estimating the ratio of input to output of individual steps in cross-currency payments. [`9d3626fec`](https://github.com/ripple/rippled/commit/9d3626fec5b610100f401dc0d25b9ec8e4a9a362)
- `tx` method now properly fetches all historical tx if they are incorporated into a validated ledger under rules that applied at the time. [`11cf27e00`](https://github.com/ripple/rippled/commit/11cf27e00698dbfc099b23463927d1dac829ed19)
- Fix to how `fail_hard` flag is handled with the `submit` method - transactions that are submitted with the `fail_hard` flag that result in any TER code besides tesSUCCESS are neither queued nor held. [`cd9732b47`](https://github.com/ripple/rippled/commit/cd9732b47a9d4e95bcb74e048d2c76fa118b80fb)
- Remove unused `Beast` code. [`172ead822`](https://github.com/ripple/rippled/commit/172ead822159a3c1f9b73217da4316df48851ab6)
- Lag ratchet code fix to use proper ephemeral public keys instead of the long-term master public keys.[`6529d3e6f`](https://github.com/ripple/rippled/commit/6529d3e6f7333fc5226e5aa9ae65f834cb93dfe5)


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

- Carl Hua <carlhua@gmail.com>
- CJ Cobb <ccobb@ripple.com>
- Devon White <dwhite@ripple.com>
- Edward Hennis <ed@ripple.com>
- Elliot Lee <github.public@intelliot.com>
- Howard Hinnant <howard.hinnant@gmail.com>
- Jeroen Meulemeester <jeroen.meulemeester@gmail.com>
- John Freeman <jfreeman08@gmail.com>
- John Northrup <jnorthrup@ripple.com>
- Manoj doshi <mdoshi@ripple.com>
- Mark Travis <mtravis@ripple.com>
- mbhandary <mayurbhandary96@gmail.com>
- Miguel Portilla <miguelportilla@pobros.com>
- Mike Ellery <mellery451@gmail.com>
- Mo Morsi <mo@morsi.org>
- Nik Bougalis <nikb@bougalis.net>
- p2peer <dmitry@prometheanlabs.io>
- Peng Wang <pwang200@gmail.com>
- Scott Schurr <scott@ripple.com>
- seelabs <scott.determan@yahoo.com>
- ShangyanLi <shangyanli42@gmail.com>

#### Lifetime Contributors

The following is the list of people who made code contributions, large and small, to XRP Ledger prior to the release of 1.5.0:

Aishraj Dahal, Alex Chung, Alex Dupre, Alloy Networks, Andrey Fedorov, Arthur Britto, Bharath Chari, Bob Way, Brad Chase, Brandon Wilson, Bryce Lynch, Casey Bodley, Christian Ramseier, crazyquark, Crypto Brad Garlinghouse, David Grogan, David 'JoelKatz' Schwartz, Devon White, Donovan Hide, Edward Hennis, Elliot Lee, Eric Lombrozo, Ethan MacBrough, Evan Hubinger, Frank Cash, Howard Hinnant, Ian Roskam, invalidator, Jack Bond-Preston, James Fryman, jatchili, Jcar, Jed McCaleb, Jeff Trull, Jesper Wallin, Joe Loser, Johanna Griffin, John Freeman, John Northrup, Joseph Busch, Josh Juran, Justin Lynn, Keaton Okkonen, Lazaridis, Lieefu Way, Luke Cyca, Manoj Doshi, Mark Travis, Markus Teufelberger, Miguel Portilla, Mike Ellery, MJK, Mo Morsi, Nicholas Dudfield, Nikolaos D. Bougalis, Niraj Pant, Patrick Dehne, Roberto Catini, Rome Reginelli, Scott Determan, Scott Schurr, S. Matthew English, Stefan Thomas, The Gitter Badger, Ties Jan Hefting, Tim Lewkow, Tom 'Swirly' Ritchford, Torrie Fischer, Vahe Hovhannisyan, Vinnie Falco, Vishwas Patil, Warren Paul Anderson, Will, wltsmrz, Wolfgang Spraul, Yana Novikova and Yusuf Sahin HAMZA.

For a real-time view of all contributors, including links to the commits made by each, please visit the "Contributors" section of the GitHub repository: <https://github.com/ripple/rippled/graphs/contributors>.

As XRP Ledger continues to move through the 1.0 series, we look forward to more external contributions and are excited to see the broader XRP Ledger community grow and thrive.
