---
date: 2018-05-31
category: 2018
labels:
    - Release Notes
theme:
    markdown:
        editPage:
            hide: true
---
# rippled Version 1.0.0

Today, after almost 6 years of hard work, Ripple is very pleased to announce the release of `rippled` version 1.0.0.

The `rippled` v1.0.0 release includes incremental improvements to several previously released features. v1.0.0 also symbolizes the growing maturity of the software and the increased stability of the decentralized, growing network of nodes that are running the software all around the world. Moving forward, `rippled` will continue to use [semantic versioning](https://semver.org/) (MAJOR.MINOR.PATCH), to help organize and track future releases.

Ripple recommends that all server operators upgrade to `rippled` v1.0.0 by Thursday, 2018-06-14, for service continuity.

## Action Required

**If you operate a `rippled` server**, you should upgrade to `rippled` version 1.0.0 by Thursday, 2018-06-14, for service continuity.

## Impact of Not Upgrading

* **If you operate a `rippled` server**, but do not upgrade to version 1.0.0 by Thursday, 2018-06-14--when **[fix1543](https://developers.ripple.com/known-amendments.html#fix1543)**, **[fix1571](https://developers.ripple.com/known-amendments.html#fix1571)** and **[fix1623](https://developers.ripple.com/known-amendments.html#fix1623)** are expected to be enabled via Amendment——then your `rippled` server will become amendment blocked. A server that is amendment blocked:


* Cannot determine the validity of a ledger
* Cannot submit or process transactions
* Does not participate in the consensus process
* Does not vote on future amendments
* Cannot rely on potentially invalid data

If the **fix1543**, **fix1571** and **fix1623** Amendments are not enabled, then your `rippled` server will not become amendment blocked and should continue to operate.

## Upgrading

For instructions on updating `rippled` on supported platforms, see [Updating `rippled`](https://developers.ripple.com/update-rippled.html).

The SHA-256 for the RPM is: `100376fbbfdf540264097c333a76b562c742fa5800c65f3c555d16347e23cda3`

The SHA-256 for the source RPM is: `10f472979785db537c4d28bc5a9c71c642cfeac306557368e588d72797439eda`

For other platforms, please compile v1.0.0 from source. See the [`rippled` source tree](https://github.com/ripple/rippled/tree/develop/Builds) for instructions by platform. For instructions building `rippled` from source on Ubuntu Linux, see [Install `rippled` on Ubuntu](https://developers.ripple.com/install-rippled.html#installation-on-ubuntu-with-alien).

The first log entry should be the change setting the version:

    commit f31ca2860fb5f045b618aa05d1e76c7e2e9494ec
    Author: Nikolaos D. Bougalis <nikb@bougalis.net>
    Date:   Fri May 11 10:29:41 2018 -0700
    Set version to 1.0.0


## Network Update

The Ripple technical operations team has deployed version 1.0.0 to all `rippled` servers under its operational control, including private clusters.


## Learn, ask questions, and discuss

Related documentation is available in the [XRP Ledger Developer Portal](https://developers.ripple.com/index.html), including detailed reference information, tutorials, and web tools.

Other resources:

* The Ripple Forum (_Disabled._ Formerly `forum.ripple.com`)
* [The Ripple Dev Blog](https://developers.ripple.com/blog/)
* Ripple Technical Services: <support@ripple.com>
* [XRP Chat](http://www.xrpchat.com/)

## Other Information

**Bug Bounties and Responsible Disclosures**

Ripple welcomes reviews of the `rippled` codebase and urges reviewers to responsibly disclose any issues that they may find. For more on Ripple's Bug Bounty program, please visit <https://ripple.com/bug-bounty/>.

**Boost Compatibility**

When compiling `rippled` from source, you must use a compatible version of the Boost library. Ripple recommends Boost v1.64.0 for all platforms.

For compatibility with other Boost versions, see the following table.


| Boost Version | Compatible Platforms | Incompatible Platforms |
|:-------------:|:--------:|:----------:|
| 1.67.0        | Experimental on all platforms | None |
| 1.64.0        | All platforms | None |
| 1.58.0.       | Linux, macOS (with Clang compiler version 4.0+) | Windows |




## 1.0.0 Change Log

* Improve history sharding to now use the shard store to satisfy ledger requests  

* Change permessage-deflate and compress defaults [(#2372)](https://github.com/ripple/rippled/pull/2372)

* Update validations on UNL change [(#2393)](https://github.com/ripple/rippled/pull/2393)

### Bug Fixes

* Clarify Escrow Semantics [(#2419)](https://github.com/ripple/rippled/pull/2419)

* Add check, escrow, and pay_chan to ledger_entry [(#2455)](https://github.com/ripple/rippled/pull/2455)


### `rippled` Retrospective

#### What is `rippled`?

`rippled` is the C++ reference implementation of the decentralized XRP Ledger. It is open source and permissively licensed under the ISC.

#### What is the XRP Ledger?


The **XRP Ledger** is a public decentralized cryptographic ledger powered by a global network of peer-to-peer servers. The XRP Ledger is the root ledger of XRP, a digital asset designed to bridge global currencies for payments. As a software company, Ripple contributes to the open source development of the XRP Ledger, in support of the Internet of Value: a world in which money moves the way information does today.

For more information, see [XRP Ledger Overview](https://developers.ripple.com/xrp-ledger-overview.html).

#### Consensus

Among the key benefits of the XRP Ledger is a fast and efficient consensus algorithm, which can settle transactions in 4 to 5 seconds, while processing at a throughput of up to 1,500 transactions per second.

The consensus algorithm is [censorship-resistant](https://developers.ripple.com/xrp-ledger-overview.html#censorship-resistant-transaction-processing). Because no single party decides which transactions succeed or fail, no one can "roll back" a transaction after it completes and no one has control over the consensus algorithm. Instead, individual server operators can select a list of validators that they choose to trust not to collude in an attempt to defraud the rest of the network.

For more information on how the XRP Ledger's consensus algorithm works, see [Consensus](https://developers.ripple.com/consensus.html). For background on why the XRP Ledger uses this consensus algorithm, see [Consensus Principles and Rules](https://developers.ripple.com/consensus-principles-and-rules.html).

#### Protocol Amendments

The XRP Ledger has integrated support for [amendments](https://developers.ripple.com/amendments.html), which allow for the introduction of new features to the decentralized XRP Ledger network without causing disruptions. Amendments work by utilizing the core consensus process of the network to approve any changes by showing continuous support before those changes go into effect.

#### Cryptography

The XRP Ledger relies on industry-standard digital signature systems like ECDSA using the [secp256k1 standard curve](http://www.secg.org/sec2-v2.pdf) (which is also used by Bitcoin). The XRP Ledger also supports modern, efficient algorithms like [Ed25519](https://ed25519.cr.yp.to/). The extensible nature of the XRP Ledger's software makes it possible to add and disable algorithms as the state of the art in cryptography advances.

For more information, see:

* [Cryptographic Keys](https://developers.ripple.com/cryptographic-keys.html)  
* [Multi-signing](https://developers.ripple.com/multi-signing.html)

#### Advanced Features

In addition to multi-signing, the XRP Ledger supports other advanced features, such as:

* [Escrow](https://developers.ripple.com/escrow.html)
* [Checks](https://developers.ripple.com/checks.html)
* [Deposit Authorization](https://developers.ripple.com/depositauth.html)  
* [Payment Channels](https://developers.ripple.com/payment-channels.html)  
* [Crypto-Conditions](https://tools.ietf.org/html/draft-thomas-crypto-conditions-04)

These features make it possible to implement cutting-edge financial applications or interact with the [Interledger Protocol](https://interledger.org/). This toolbox of advanced features comes with a wide range safety checks that validate all transactions against a list of invariant constraints.

#### Decentralized Exchange

The XRP Ledger also has a fully-functional accounting system for publicly tracking and trading obligations denominated in any way users want, along with a decentralized exchange built into the ledger. The XRP Ledger can settle long, cross-currency [payment paths](https://developers.ripple.com/paths.html) and [exchanges](https://developers.ripple.com/decentralized-exchange.html) of multiple currencies in atomic transactions, bridging gaps of trust with XRP.

For more information on how the decentralized exchange works, see:

* [On-Ledger Decentralized Exchange](https://developers.ripple.com/xrp-ledger-overview.html#on-ledger-decentralized-exchange)
* [Decentralized Exchange](https://developers.ripple.com/decentralized-exchange.html)  
* [Offers](https://developers.ripple.com/offers.html)
* [Become an XRP Ledger Gateway](https://developers.ripple.com/become-an-xrp-ledger-gateway.html)

#### Acknowledgements

On behalf of the XRP Community, Ripple would like the thank those who have contributed to the development of the XRP Ledger (rippled) open source code, whether they did so by writing code, running the software, reporting issues, discovering bugs or offering suggestions for improvements.

#### Contributors

The following is the list of people who made code contributions, large and small, to XRP Ledger prior to the release of 1.0.0:

Aishraj Dahal, Alex Chung, Alex Dupre, Andrey Fedorov, Arthur Britto, Bob Way, Brad Chase, Brandon Wilson, Bryce Lynch, Casey Bodley, Christian Ramseier, crazyquark, David Grogan, David Schwartz, Donovan Hide, Edward Hennis, Elliot Lee, Eric Lombrozo, Evan Hubinger, Frank Cash, Howard Hinnant, Jack Bond-Preston, jatchili, Jcar, Jed McCaleb, Jeff Trull, Jennifer Hasegawa, Joe Loser, Johanna Griffin, Josh Juran, Justin Lynn, Keaton Okkonen, Lieefu Way, Luke Cyca, Mark Travis, Markus Teufelberger, Miguel Portilla, Mike Ellery, MJK, Nicholas Dudfield, Nikolaos D. Bougalis, Niraj Pant, Patrick Dehne, Roberto Catini, Rome Reginelli, Scott Determan, Scott Schurr, S. Matthew English, Stefan Thomas, The Gitter Badger, Ties Jan Hefting, Tim Lewkow, Tom Ritchford, Torrie Fischer, Vahe Hovhannisyan, Vinnie Falco, Warren Paul Anderson, Will, wltsmrz, Wolfgang Spraul and Yana Novikova.

As `rippled` moves to the 1.x series, we look forward to more external contributions and are excited to see the broader XRP Ledger community grow and thrive.
