---
date: 2018-11-07
category: 2018
labels:
    - Release Notes
theme:
    markdown:
        editPage:
            hide: true
---
# Introducing XRP Ledger (rippled) version 1.1.2

Ripple is proud to announce the release of **XRP Ledger** (`rippled`) version 1.1.2.

The XRP Ledger version 1.1.2 release includes a fix for a technical issue in the consensus "preferred ledger by branch" code, which could cause a validator to fail to settle on a single preferred branch of unconfirmed ledger history.  While this is not entirely unexpected and the code is designed to handle it, this issue exposed a corner case where the stringent safety guarantees of the consensus algorithm, as outlined in the recent [Analysis of the XRP Ledger Consensus Protocol](https://arxiv.org/abs/1802.07242) paper, make it difficult for the entire network to efficiently recover from this condition.

<!-- BREAK -->

## Action Required

**If you operate a XRP Ledger validator server,** then you should upgrade to XRP Ledger version 1.1.2 as soon as possible.

### Impact of Not Upgrading

If you are not running release 1.1.2 or greater, then your validator server can potentially fail to settle on a single preferred ledger branch during consensus and resort to issuing partial validations, until it can resync with the network.

### Upgrading

For instructions on updating `rippled` on supported platforms, see [Installing rippled](https://developers.ripple.com/install-rippled.html).

The SHA-256 for the RPM is: `989a679bef72e827f204b394abd3d385f1baae6ad7a94eaf9b759a032bcd0f7e`

The SHA-256 for the source RPM is: `091b60dcf38aea4f9ec252d7b1b72d95ca4f45b3a831fbe97ce8f806f2907cae`

For other platforms, please compile version 1.1.2 from source.

- [Build and Run `rippled` on Ubuntu Linux](https://developers.ripple.com/build-run-rippled-ubuntu.html)
- [Build and run `rippled` on macOS](https://developers.ripple.com/build-run-rippled-macos.html)
- See <https://github.com/ripple/rippled/tree/master/Builds> for instructions by platform.

The first log entry should be the change setting the version:

```text
commit 4f3a76dec00c0c7ea28e78e625c68499debbbbf3
Author: Nik Bougalis <nikb@bougalis.net>
Date:   Thu Nov 29 21:49:10 2018 -0800
	Set version to 1.1.2
```

## Network Update

Ripple plans to deploy version 1.1.2 to all XRP Ledger servers under its operational control, including private clusters, on Tuesday, 2018-12-11 at 22:00:00 UTC.

## Learn, ask questions, and discuss

Related documentation is available in the [XRP Ledger Dev Portal](https://developers.ripple.com/), including detailed example API calls and web tools for API testing: <https://developers.ripple.com/>

Other resources:

* The Ripple Forum (_Disabled._ Formerly `forum.ripple.com`)

* Ripple Technical Services: <support@ripple.com>

* [XRP Chat Forum](http://www.xrpchat.com/)

## Other Information

### Bug Bounties and Responsible Disclosures

On behalf of the XRP Community, Ripple welcomes reviews of the **XRP Ledger** open source codebase and urge reviewers to responsibly disclose any issues that they may find. For more on Ripple's Bug Bounty program, please visit <https://ripple.com/bug-bounty/>.

### Boost Compatibility

When compiling XRP Ledger from source, you must use a compatible version of the Boost library. **As of XRP Ledger version 1.1.2, Boost 1.67.0 is required for all platforms.**

## 1.1.2 Change Log

### Bug Fixes

* Improve preferred ledger calculation ([#2797](https://github.com/ripple/rippled/pull/2797/commits/bd2a38f5844ce824c02cce1ed97e9cf0cd04c019))

* Properly bypass connection limits for cluster peers ([#2795](https://github.com/ripple/rippled/pull/2797/commits/61f443e3bbf3bf1f6e13f3ef25bb5fc60fe85078))

## Contributions

**We welcome external contributions to the XRP Ledger codebase. Please submit a pull request with your proposed changes on the GitHub project page at <https://github.com/ripple/rippled>.**

On behalf of the XRP Community, Ripple would like to thank those who have contributed to the development of the XRP Ledger (`rippled`) open source code, whether they did so by writing code, running the software, reporting issues, discovering bugs or offering suggestions for improvements.

The following is the list of people who made code contributions, large and small, to rippled prior to the release of 1.1.2:

Aishraj Dahal, Alex Chung, Alex Dupre, Andrey Fedorov, Arthur Britto, Bob Way, Brad Chase, Brandon Wilson, Bryce Lynch, Casey Bodley, Christian Ramseier, crazyquark, David Grogan, David Schwartz, Donovan Hide, Edward Hennis, Elliot Lee, Eric Lombrozo, Evan Hubinger, Frank Cash, Howard Hinnant, Iroskam, Jack Bond-Preston, jatchili, Jcar, Jed McCaleb, Jeff Trull, Joe Loser, Johanna Griffin, Josh Juran, Justin Lynn, Keaton Okkonen, Lieefu Way, Luke Cyca, Mark Travis, Markus Teufelberger, Miguel Portilla, Mike Ellery, MJK, Nicholas Dudfield, Nikolaos D. Bougalis, Niraj Pant, Patrick Dehne, Roberto Catini, Rome Reginelli, Scott Determan, Scott Schurr, S. Matthew English, Stefan Thomas, The Gitter Badger, Ties Jan Hefting, Tim Lewkow, Tom Ritchford, Torrie Fischer, Vahe Hovhannisyan, Vinnie Falco, Warren Paul Anderson, Will, wltsmrz, Wolfgang Spraul and Yana Novikova.

As XRP Ledger progresses through the 1.0 series, we look forward to more external contributions and are excited to see the broader XRP Ledger community grow and thrive.
