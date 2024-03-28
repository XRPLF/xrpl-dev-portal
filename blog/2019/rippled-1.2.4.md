---
labels:
    - Release Notes
category: 2019
date: 2019-04-17
theme:
    markdown:
        editPage:
            hide: true
---
# Introducing XRP Ledger (rippled) version 1.2.4

Ripple has released **version 1.2.4 of rippled**, the reference implementation of the core XRP Ledger protocol.

Version 1.2.4 improves the verification and routing of shard crawl requests and imposes a 20 second timeout onto the component that checks for an updated validator list to prevent it from becoming blocked for an indefinite amount of time.

<!-- BREAK -->

## Action Required

If you operate an XRP Ledger server, then you should **upgrade to version 1.2.4 immediately.**

### Impact of Not Upgrading

If you operate a rippled server, but do not upgrade to 1.2.4 immediately, then your server may experience restarts or outages and may be unable to retrieve updated validator lists from the publishers that you have configured.

Additionally, if you are not already running [release 1.2.0](https://developers.ripple.com/blog/2019/rippled-1.2.0.html) or greater, then your server is [amendment blocked](https://developers.ripple.com/amendments.html#amendment-blocked), meaning that it:

* Cannot determine the validity of a ledger;

* Cannot submit or process transactions;

* Cannot participate in the consensus process;

* Cannot vote on future amendments; and

* Could rely on potentially invalid data.

### Upgrading

For instructions on updating XRP Ledger on supported platforms, see [Install rippled](https://developers.ripple.com/install-rippled.html).

The SHA-256 for the RPM is: `63f33ca0fbd089a4d1bf5ca4f5c925087bb33209ccc0f29eba04a8e5de0c501a`

The SHA-256 for the source RPM is: `9b38ee937d19c57d6461d7ed47ae477893ed7d9e23bfc4d867291d5e3b86b7cb`

For other platforms, please compile version 1.2.4 from source.

* [Ubuntu Linux](https://developers.ripple.com/build-run-rippled-ubuntu.html)

* [macOS](https://developers.ripple.com/build-run-rippled-macos.html)

* [Other platforms](https://github.com/ripple/rippled/tree/master/Builds)

The first log entry should be the change setting the version:

    commit 834f545498c0ff8fe22eb4648fe4534dea2ab965
    Author: Nik Bougalis <nikb@bougalis.net>
    Date:   Mon Apr 15 12:38:52 2019 -0700
        Set version to 1.2.4


## Network Update

The Ripple technical operations has deployed version 1.2.4 to all XRP Ledger servers under its operational control, including private clusters.


## Learn, ask questions, and discuss

Related documentation is available in the [XRP Ledger Dev Portal](https://developers.ripple.com/), including detailed example API calls and web tools for API testing.

Other resources:

* The Ripple Forum (_Disabled._ Formerly `forum.ripple.com`)

* [The Ripple Dev Blog](https://developers.ripple.com/blog/)

* Ripple Technical Services: <support@ripple.com>

* [XRP Chat Forum](http://www.xrpchat.com/)

## Other Information

### Bug Bounties and Responsible Disclosures

Ripple welcomes reviews of the **XRP Ledger** open source codebase and urge reviewers to responsibly disclose any issues that they may find. For more on Ripple's Bug Bounty program, please visit <https://ripple.com/bug-bounty/>.

### Boost Compatibility

When compiling XRP Ledger from source, you must use a compatible version of the Boost library. **For XRP Ledger version 1.2.4, Boost 1.67.0 is required for all platforms.** (This is unchanged from versions 1.2.0 through 1.2.3.)

## 1.2.4 Change Log

### Bug Fixes

- Corrects a technical flaw that improves the way that shard crawl requests are verified and routed
- Fixes an issue where the component that would check for updated validator list could become blocked for an indefinite amount of time by imposing a 20 second timeout


## Contributions

We welcome external contributions to the XRP Ledger codebase. Please submit a pull request with your proposed changes on the GitHub project page at <https://github.com/ripple/rippled>.

On behalf of the XRP Community, Ripple would like to thank those who have contributed to the development of the XRP Ledger (rippled) open source code, whether they did so by writing code, running the software, reporting issues, discovering bugs or offering suggestions for improvements.

The following is the list of people who made code contributions, large and small, to XRP Ledger prior to the release of 1.2.4:

Aishraj Dahal, Alex Chung, Alex Dupre, Andrey Fedorov, Arthur Britto, Bob Way, Brad Chase, Brandon Wilson, Bryce Lynch, Casey Bodley, Christian Ramseier, crazyquark, David Grogan, David Schwartz, Donovan Hide, Edward Hennis, Elliot Lee, Eric Lombrozo, Evan Hubinger, Frank Cash, Howard Hinnant, Jack Bond-Preston, jatchili, Jcar, Jed McCaleb, Jeff Trull, Joe Loser, Johanna Griffin, Josh Juran, Justin Lynn, Keaton Okkonen, Lieefu Way, Luke Cyca, Mark Travis, Markus Teufelberger, Miguel Portilla, Mike Ellery, MJK, Nicholas Dudfield, Nikolaos D. Bougalis, Niraj Pant, Patrick Dehne, Roberto Catini, Rome Reginelli, Scott Determan, Scott Schurr, S. Matthew English, Stefan Thomas, The Gitter Badger, Ties Jan Hefting, Tim Lewkow, Tom Ritchford, Torrie Fischer, Vahe Hovhannisyan, Vinnie Falco, Warren Paul Anderson, Will, wltsmrz, Wolfgang Spraul and Yana Novikova.

As XRP Ledger moves through the 1.0 series, we look forward to more external contributions and are excited to see the broader XRP Ledger community grow and thrive.
