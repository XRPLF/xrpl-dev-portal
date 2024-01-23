# Introducing XRP Ledger (rippled) version 1.2.3

Ripple has released **version 1.2.3 of rippled**, the reference implementation of the core XRP Ledger protocol.

Version 1.2.3 corrects a technical flaw that could, in rare circumstances, cause the server to [dereference a null pointer](https://www.owasp.org/index.php/Null_Dereference), which could result in the server process being terminated by the operating system.

<!-- BREAK -->

## Action Required

If you operate an XRP Ledger server, then you should **upgrade to version 1.2.3 immediately.**

### Impact of Not Upgrading

If you operate a rippled server, but do not upgrade to 1.2.3 immediately, then your server may experience restarts or outages.

Additionally, if you are not already running [release 1.2.0](https://developers.ripple.com/blog/2019/rippled-1.2.0.html) or greater, then your server is [amendment blocked](https://developers.ripple.com/amendments.html#amendment-blocked), meaning that it:

* Cannot determine the validity of a ledger;

* Cannot submit or process transactions;

* Cannot participate in the consensus process;

* Cannot vote on future amendments; and

* Could rely on potentially invalid data.

### Upgrading

For instructions on updating XRP Ledger on supported platforms, see [Install rippled](https://developers.ripple.com/install-rippled.html).

The SHA-256 for the RPM is: `8e6c5727c359d0c1d8a7235a149b18ddbad63d18de127b9370c335b1e4bc6775`

The SHA-256 for the source RPM is: `b2664e7e47af0ceefbea3619505f37426f026146690a13565f381c8cb7ca25a6`

For other platforms, please compile version 1.2.3 from source.

* [Ubuntu Linux](https://developers.ripple.com/build-run-rippled-ubuntu.html)

* [macOS](https://developers.ripple.com/build-run-rippled-macos.html)

* [Other platforms](https://github.com/ripple/rippled/tree/master/Builds)

The first log entry should be the change setting the version:

    commit 0329ee236ffe2d7658bbdd1d970bb2af6337a941
    Author: seelabs <scott.determan@yahoo.com>
    Date:   Thu Mar 28 16:38:43 2019 -0400

    	Set version to 1.2.3

## Network Update

The Ripple technical operations team plans to deploy version 1.2.3 to all XRP Ledger servers under its operational control, including private clusters, starting at 2:00 PM PST on Tuesday, 2019-04-02. At that time, Ripple plans to also start voting in favor of the **MultisignReserve** Amendment. The deployment is expected to complete within 4 hours. The network should continue to operate during deployment and no outage is expected.

## Known Issues

Version 1.2.3 has a bug that can cause the server to stop checking for updates to its configured validator list sites. If this happens, your server may lose sync with the network when its current validator list file expires. You can restore sync by restarting the rippled service. (This issue is related to the issues fixed in the [version 1.1.1 release](https://developers.ripple.com/blog/2018/rippled-1.1.1.html).) A fix for this issue is forthcoming.

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

When compiling XRP Ledger from source, you must use a compatible version of the Boost library. **For XRP Ledger version 1.2.3, Boost 1.67.0 is required for all platforms.** (This is unchanged from versions 1.2.0, 1.2.1, and 1.2.2.)

## 1.2.3 Change Log

### Bug Fixes

* Better error checking in CachedViewImpl::read ([b347afcc5b](https://github.com/ripple/rippled/commit/b347afcc5b4c5228a425508d96e99b85cac7a1d7))

## Contributions

We welcome external contributions to the XRP Ledger codebase. Please submit a pull request with your proposed changes on the GitHub project page at <https://github.com/ripple/rippled>.

On behalf of the XRP Community, Ripple would like to thank those who have contributed to the development of the XRP Ledger (rippled) open source code, whether they did so by writing code, running the software, reporting issues, discovering bugs or offering suggestions for improvements.

The following is the list of people who made code contributions, large and small, to XRP Ledger prior to the release of 1.2.3:

Aishraj Dahal, Alex Chung, Alex Dupre, Andrey Fedorov, Arthur Britto, Bob Way, Brad Chase, Brandon Wilson, Bryce Lynch, Casey Bodley, Christian Ramseier, crazyquark, David Grogan, David Schwartz, Donovan Hide, Edward Hennis, Elliot Lee, Eric Lombrozo, Evan Hubinger, Frank Cash, Howard Hinnant, Jack Bond-Preston, jatchili, Jcar, Jed McCaleb, Jeff Trull, Joe Loser, Johanna Griffin, Josh Juran, Justin Lynn, Keaton Okkonen, Lieefu Way, Luke Cyca, Mark Travis, Markus Teufelberger, Miguel Portilla, Mike Ellery, MJK, Nicholas Dudfield, Nikolaos D. Bougalis, Niraj Pant, Patrick Dehne, Roberto Catini, Rome Reginelli, Scott Determan, Scott Schurr, S. Matthew English, Stefan Thomas, The Gitter Badger, Ties Jan Hefting, Tim Lewkow, Tom Ritchford, Torrie Fischer, Vahe Hovhannisyan, Vinnie Falco, Warren Paul Anderson, Will, wltsmrz, Wolfgang Spraul and Yana Novikova.

As XRP Ledger moves through the 1.0 series, we look forward to more external contributions and are excited to see the broader XRP Ledger community grow and thrive.
