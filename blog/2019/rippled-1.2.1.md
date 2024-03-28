---
labels:
    - Release Notes
category: 2019
date: 2019-02-26
theme:
    markdown:
        editPage:
            hide: true
---
# Introducing XRP Ledger (rippled) version 1.2.1

Ripple has released **version 1.2.1 of `rippled`**, our reference implementation of the core XRP Ledger server.

Version 1.2.1 introduces several fixes including:

* A change in the information reported via the enhanced crawl functionality introduced in version 1.2.0.

* A fix for a potential race condition when processing a status message for a peer.

* A fix for a technical flaw that could cause a server to not properly detect that it had lost connectivity.

Version 1.2.1 also adds [the delivered_amount field](https://developers.ripple.com/partial-payments.html#the-delivered-amount-field) to more responses to simplify the handling of payment or check cashing transactions.

<!-- BREAK -->

## Action Required

**If you operate a XRP Ledger server,** then you should upgrade to version 1.2.1 immediately.

### Impact of Not Upgrading

Ripple expects the **MultisignReserve**, **fixTakerDryOfferRemoval** and **fix1578** Amendments to become enabled no earlier than Tuesday, 2019-03-12. When this happens, if you are not running release 1.2.0 or greater, your server will become [amendment blocked](https://developers.ripple.com/amendments.html#amendment-blocked), meaning that it:

* Cannot determine the validity of a ledger;

* Cannot submit or process transactions;

* Cannot participate in the consensus process;

* Cannot vote on future amendments; and

* Could rely on potentially invalid data.

If the **MultisignReserve**, **fixTakerDryOfferRemoval **and** fix1578** Amendments do not become enabled, then your XRP Ledger server will not become Amendment blocked and should continue to operate.

### Upgrading

For instructions on updating XRP Ledger on supported platforms, see here: <https://developers.ripple.com/install-rippled.html>.

The SHA-256 for the RPM is: `dafe6dcc93252be317c12637850bd1a1c38a7c8f5db25c4f281c079b4ac3db71`

The SHA-256 for the source RPM is: `699b4b740075ecf72d0ff0ef422e9747745552c4e17c21c28beb48fbb193ba75`

For other platforms, please compile version 1.2.1 from source.

* [Ubuntu Linux](https://developers.ripple.com/build-run-rippled-ubuntu.html)

* [macOS](https://developers.ripple.com/build-run-rippled-macos.html)

* [Other platforms](https://github.com/ripple/rippled/tree/master/Builds)

The first log entry should be the change setting the version:

```text
commit a3470c225b2cc9f33021d75757172de62dac70d6
Author: Nik Bougalis <nikb@bougalis.net>
Date:   Sat Feb 23 10:47:59 2019 -0800

    Set version to 1.2.1
```

## Network Update

The Ripple technical operations team plans to deploy version 1.2.1 to all XRP Ledger servers under its operational control, including private clusters, starting at 2:00 PM PST on Tuesday, 2019-02-26. At that time, Ripple plans to start voting in favor of the **fix1578** Amendment. The deployment is expected to complete within 4 hours. The network should continue to operate during deployment and no outage is expected.

## Learn, ask questions, and discuss

Related documentation is available in the XRP Ledger Dev Portal, including detailed example API calls and web tools for API testing: [https://developers.ripple.com/](https://developers.ripple.com/)

Other resources:

* [The Ripple Dev Blog](https://developers.ripple.com/blog/)

* Ripple Technical Services: <support@ripple.com>

* [XRP Chat Forum](http://www.xrpchat.com/)

## Other Information

### Bug Bounties and Responsible Disclosures

Ripple welcomes reviews of the **XRP Ledger** open source codebase and urge reviewers to responsibly disclose any issues that they may find. For more on Ripple's Bug Bounty program, please visit <https://ripple.com/bug-bounty>.

### Boost Compatibility

When compiling XRP Ledger from source, you must use a compatible version of the Boost library. **As of XRP Ledger version 1.2.1, Boost 1.67.0 is required for all platforms.**

## 1.2.1 Change Log

### Config Changes

* Make validators opt out of crawl ([b335adb](https://github.com/ripple/rippled/commit/b335adb674ec6042c8d52c3d50fb2e3cec6f5e79))

### Bug Fixes

* Fix a race condition during TMStatusChange handling ([9dbf849](https://github.com/ripple/rippled/commit/9dbf8495eed1f8e862fe69869bba56a694e00815))

* Properly transition state to disconnected ([2529edd](https://github.com/ripple/rippled/commit/2529edd2b6d107256170ddcc1045f69a29a0d954))

* Display validator status only in response to admin requests ([c6ab880](https://github.com/ripple/rippled/commit/c6ab880c030bb7492002b843247030e15f9b89a6))

* Add the delivered_amount to more RPC commands ([c5d215d](https://github.com/ripple/rippled/commit/c5d215d901d25b1ea18bf0e96529799b1b5158cc))

## Contributions

We welcome external contributions to the XRP Ledger codebase. Please submit a pull request with your proposed changes on the GitHub project page at <https://github.com/ripple/rippled>.

On behalf of the XRP Community, Ripple would like to thank those who have contributed to the development of the XRP Ledger (rippled) open source code, whether they did so by writing code, running the software, reporting issues, discovering bugs or offering suggestions for improvements.

The following is the list of people who made code contributions, large and small, to XRP Ledger prior to the release of 1.2.1:

Aishraj Dahal, Alex Chung, Alex Dupre, Andrey Fedorov, Arthur Britto, Bob Way, Brad Chase, Brandon Wilson, Bryce Lynch, Casey Bodley, Christian Ramseier, crazyquark, David Grogan, David Schwartz, Donovan Hide, Edward Hennis, Elliot Lee, Eric Lombrozo, Evan Hubinger, Frank Cash, Howard Hinnant, Jack Bond-Preston, jatchili, Jcar, Jed McCaleb, Jeff Trull, Joe Loser, Johanna Griffin, Josh Juran, Justin Lynn, Keaton Okkonen, Lieefu Way, Luke Cyca, Mark Travis, Markus Teufelberger, Miguel Portilla, Mike Ellery, MJK, Nicholas Dudfield, Nikolaos D. Bougalis, Niraj Pant, Patrick Dehne, Roberto Catini, Rome Reginelli, Scott Determan, Scott Schurr, S. Matthew English, Stefan Thomas, The Gitter Badger, Ties Jan Hefting, Tim Lewkow, Tom Ritchford, Torrie Fischer, Vahe Hovhannisyan, Vinnie Falco, Warren Paul Anderson, Will, wltsmrz, Wolfgang Spraul and Yana Novikova.

As XRP Ledger moves through the 1.0 series, we look forward to more external contributions and are excited to see the broader XRP Ledger community grow and thrive.
