---
labels:
    - Release Notes
category: 2019
date: 2019-03-06
theme:
    markdown:
        editPage:
            hide: true
---
# Introducing XRP Ledger (rippled) version 1.2.2

Ripple has released **version 1.2.2 of rippled**, our reference implementation of the core XRP Ledger server.

Version 1.2.2 corrects a technical flaw in the fee escalation engine which could cause some fee metrics to be calculated incorrectly. In some circumstances this can potentially cause the server to crash.

<!-- BREAK -->

## Action Required

**If you operate a XRP Ledger server,** then you should upgrade to version 1.2.2 immediately.

### Impact of Not Upgrading

If you operate a rippled server, but do not upgrade to 1.2.2 as soon as possible, then your server may experience restarts or outages.

Additionally, the **MultisignReserve**, **fixTakerDryOfferRemoval** and **fix1578** Amendments are expected to become enabled no earlier than Wednesday, 2019-03-20. When this happens, if you are not running [release 1.2.0](https://developers.ripple.com/blog/2019/rippled-1.2.0.html) or greater, your server will become [amendment blocked](https://developers.ripple.com/amendments.html#amendment-blocked), meaning that it:

* Cannot determine the validity of a ledger;

* Cannot submit or process transactions;

* Cannot participate in the consensus process;

* Cannot vote on future amendments; and

* Could rely on potentially invalid data.

If the **MultisignReserve**, **fixTakerDryOfferRemoval** and **fix1578** Amendments do not become enabled, then your XRP Ledger server will not become amendment blocked.

### Upgrading

For instructions on updating XRP Ledger on supported platforms, see here: [Install `rippled`](https://developers.ripple.com/install-rippled.html)

The SHA-256 for the RPM is: `e846e864c273593fcfbc9b1f21c7f2cf236454fd88ab8624446f446e9df0a447`

The SHA-256 for the source RPM is: `c8a67054d81fc5d7dfba5b4ebe630f44507886da418c5ba6fb7a245e9d78cd01`

For other platforms, please compile version 1.2.2 from source.

* [Ubuntu Linux](https://developers.ripple.com/build-run-rippled-ubuntu.html)

* [macOS](https://developers.ripple.com/build-run-rippled-macos.html)

* [Other platforms](https://github.com/ripple/rippled/tree/master/Builds)

The first log entry should be the change setting the version:

    commit 0ebed961424d9757f5d26ce7e8b3e5e8d83eb239
    Author: seelabs <scott.determan@yahoo.com>
    Date:   Mon Mar 4 11:45:12 2019 -0500

        Set version to 1.2.2

## Network Update

The Ripple technical operations team plans to deploy version 1.2.2 to all XRP Ledger servers under its operational control, including private clusters, starting at 2:00 PM PST on Wednesday, 2019-03-06. At that time, Ripple plans to start voting in favor of the **fix1578** Amendment. The deployment is expected to complete within 4 hours. The network should continue to operate during deployment and no outage is expected.

## Learn, ask questions, and discuss

Related documentation is available in the [XRP Ledger Dev Portal](https://developers.ripple.com/), including detailed example API calls and web tools for API testing.

Other resources:

* The Ripple Forum (_Disabled._ Formerly `forum.ripple.com`)

* [The Ripple Dev Blog](https://developers.ripple.com/blog/)

* Ripple Technical Services: <support@ripple.com>

* [XRP Chat Forum](http://www.xrpchat.com/)

## Other Information

### Bug Bounties and Responsible Disclosures

Ripple welcomes reviews of the **XRP Ledger** open source codebase and urge reviewers to responsibly disclose any issues that they may find. For more on Ripple's Bug Bounty program, please visit[ https://ripple.com/](https://ripple.com/bug-bounty/)[bug-bounty](https://ripple.com/bug-bounty/)[/](https://ripple.com/bug-bounty/).

### Boost Compatibility

When compiling XRP Ledger from source, you must use a compatible version of the Boost library. **As of XRP Ledger version 1.2.2, Boost 1.67.0 is required for all platforms.**

## 1.2.2 Change Log

### Bug Fixes

* Fix a technical flaw in the fee escalation engine which could cause some fee metrics to be calculated incorrectly. ([4c03b3f](https://github.com/ripple/rippled/commit/4c06b3f86fdca59cc1fb14d0730c6de14662bcff))

## Contributions

We welcome external contributions to the XRP Ledger codebase. Please submit a pull request with your proposed changes on the GitHub project page at <https://github.com/ripple/rippled>.

On behalf of the XRP Community, Ripple would like to thank those who have contributed to the development of the XRP Ledger (`rippled`) open source code, whether they did so by writing code, running the software, reporting issues, discovering bugs or offering suggestions for improvements.

The following is the list of people who made code contributions, large and small, to XRP Ledger prior to the release of 1.2.2:

Aishraj Dahal, Alex Chung, Alex Dupre, Andrey Fedorov, Arthur Britto, Bob Way, Brad Chase, Brandon Wilson, Bryce Lynch, Casey Bodley, Christian Ramseier, crazyquark, David Grogan, David Schwartz, Donovan Hide, Edward Hennis, Elliot Lee, Eric Lombrozo, Evan Hubinger, Frank Cash, Howard Hinnant, Jack Bond-Preston, jatchili, Jcar, Jed McCaleb, Jeff Trull, Joe Loser, Johanna Griffin, Josh Juran, Justin Lynn, Keaton Okkonen, Lieefu Way, Luke Cyca, Mark Travis, Markus Teufelberger, Miguel Portilla, Mike Ellery, MJK, Nicholas Dudfield, Nikolaos D. Bougalis, Niraj Pant, Patrick Dehne, Roberto Catini, Rome Reginelli, Scott Determan, Scott Schurr, S. Matthew English, Stefan Thomas, The Gitter Badger, Ties Jan Hefting, Tim Lewkow, Tom Ritchford, Torrie Fischer, Vahe Hovhannisyan, Vinnie Falco, Warren Paul Anderson, Will, wltsmrz, Wolfgang Spraul and Yana Novikova.

As XRP Ledger moves through the 1.0 series, we look forward to more external contributions and are excited to see the broader XRP Ledger community grow and thrive.
