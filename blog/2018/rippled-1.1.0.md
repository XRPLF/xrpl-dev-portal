---
date: 2018-09-17
category: 2018
labels:
    - Release Notes
theme:
    markdown:
        editPage:
            hide: true
---
# Introducing XRP Ledger (rippled) version 1.1.0

Ripple is pleased to announce the release of **XRP Ledger (`rippled`) version 1.1.0.**

The XRP Ledger version 1.1.0 release includes the [DepositPreAuth](https://developers.ripple.com/known-amendments.html#depositpreauth) Amendment, which, combined with the previously released [DepositAuth](https://developers.ripple.com/known-amendments.html#depositauth) Amendment, allows users to pre-authorize incoming transactions to accounts, by whitelisting sender addresses. XRP Ledger version 1.1.0 release also includes incremental improvements to several previously released features ([fix1515](https://developers.ripple.com/known-amendments.html#fix1515) Amendment), deprecates support for the sign and sign_for commands from the rippled API and improves invariant checking for enhanced security.

Ripple recommends that all server operators upgrade to XRP Ledger version 1.1.0 by Thursday, 2018-09-27, to ensure service continuity.

## Action Required

**If you operate a XRP Ledger server, you should upgrade to XRP Ledger version 1.1.0 by Thursday, 2018-09-27, to ensure service continuity.**

### Impact of Not Upgrading

Ripple expects the **DepositPreAuth** or **fix1515** amendments to become enabled on or after Thursday, 2018-09-27. When this happens, if you are not running release 1.1.0 or greater, your server will become [amendment blocked](https://ripple.com/build/amendments/#amendment-blocked), meaning that it:

* Cannot determine the validity of a ledger;

* Cannot be able to submit or process transactions;

* Cannot participate in the consensus process;

* Cannot vote on future amendments; and

* Could rely on potentially invalid data.

If the **DepositPreAuth** and **fix1515** Amendments do not become enabled, then your XRP Ledger server will not become Amendment blocked and should continue to operate.

### Upgrading

For instructions on updating the XRP Ledger server on supported platforms, see here: [Updating `rippled` on Supported Platforms](https://developers.ripple.com/update-rippled.html).

- The SHA-256 for the RPM is: `ec50f3cec7dcbea8aaa2eb9d97c3c1fc02d44ce62203557b4cd213cf1b0fe4b5`

- The SHA-256 for the source RPM is: `936844990e70615183681c41884ea96804ee4130d6f9ec32242fb3a16120824f`

For other platforms, please compile version 1.1.0 from source. See [`rippled` build instructions by platform](https://github.com/ripple/rippled/tree/master/Builds), or [Build and Run `rippled` on Ubuntu Linux](https://ripple.com/build/build-run-rippled-ubuntu/) for further instructions.

The first log entry should be the change setting the version:

    commit 3e22a1e9e8f2de450eded6ca4c2db6411e329b2a
    Author: Nik Bougalis <nikb@bougalis.net>
    Date:   Wed Sep 5 18:34:43 2018 -0700

        Set version to 1.1.0

## Network Update

The Ripple technical operations has deployed version 1.1.0 to all XRP Ledger servers under its operational control, including private clusters, as of Thursday, 2018-09-13.

## Learn, ask questions, and discuss

Related documentation is available in the XRP Ledger Dev Portal, including detailed example API calls and web tools for API testing: [https://developers.ripple.com/](https://developers.ripple.com/)

Other resources:

* The Ripple Forum (_Disabled._ Formerly `forum.ripple.com`)
* The Ripple Dev Blog: <https://developers.ripple.com/blog/>
* Ripple Technical Services: <support@ripple.com>
* XRP Chat: <http://www.xrpchat.com/>

## Other Information

### Bug Bounties and Responsible Disclosures

On behalf of the XRP Community, Ripple would like to thank Guido Vranken, for responsibly disclosing several issues related to some of the encoder / decoder logic in rippled. As always, Ripple welcomes reviews of the **XRP Ledger** open source codebase and urge reviewers to responsibly disclose any issues that they may find. For more on Ripple's Bug Bounty program, please visit[ https://ripple.com/](https://ripple.com/bug-bounty/)[bug-bounty](https://ripple.com/bug-bounty/)[/](https://ripple.com/bug-bounty/).

### Boost Compatibility

When compiling XRP Ledger from source, you must use a compatible version of the Boost library. **As of XRP Ledger version 1.1.0, Boost 1.67.0 is required for all platforms.**

## 1.1.0 Change Log

* Add DepositPreAuth ledger type and transaction ([#2513](https://github.com/ripple/rippled/pull/2513))  

* Increase fault tolerance and raise validation quorum to 80%, which fixes issue [2604](https://github.com/ripple/rippled/issues/2604) ([#2613](https://github.com/ripple/rippled/pull/2613))

* Support ipv6 for peer and RPC comms ([#2321](https://github.com/ripple/rippled/pull/2321))

* Refactor ledger replay logic ([#2477](https://github.com/ripple/rippled/pull/2477))

* Improve Invariant Checking ([#2532](https://github.com/ripple/rippled/pull/2532/commits/2ac1c2b433b8825b9a6f203f1ee65a126e20620c))

* Expand SQLite potential storage capacity ([#2650](https://github.com/ripple/rippled/pull/2650/commits/04745b11a888cea412f410d0036a0db23574d61c))

* Replace UptimeTimer with UptimeClock ([#2532](https://github.com/ripple/rippled/pull/2532/commits/7d163a45dcd2c5cca0fc45eb8775f169575995c1))

* Don’t read Amount field if it is not present ([#2566](https://github.com/ripple/rippled/pull/2566/commits/34d3f93868b87f33fdf76a5b6c8b376956346a16))

* Remove Transactor:: mFeeDue member variable ([#2586](https://github.com/ripple/rippled/pull/2586/commits/5b733fb4857ff1076d2e106afeb9931fca198d51))

* Remove conditional check for using Boost.Process ([#2586](https://github.com/ripple/rippled/pull/2586/commits/06d0ff6e5281ca237d358e953fe8069d16a6926a))

* Improve charge handling in NoRippleCheckLimits test ([#2629](https://github.com/ripple/rippled/pull/2629/commits/49bcdda41881f6cac140879a236be6ac1a7a734d))

* Migrate more code into the chrono type system ([#2629](https://github.com/ripple/rippled/pull/2629/commits/d257d1b2c9e0a50f6cef2d1fc977573944408723))

* Supply ConsensusTimer with milliseconds for finer precision ([#2629](https://github.com/ripple/rippled/pull/2629/commits/d98c4992dd82090bb6d4f7593768624f6e109b32))

* Refactor / modernize Cmake ([#2629](https://github.com/ripple/rippled/pull/2629/commits/37d9544ef722730d34899754654b71e84d9f7851))

* Add delimiter when appending to cmake_cxx_flags ([#2650](https://github.com/ripple/rippled/pull/2650/commits/4aa0bc37c0fdfb871f5929e7bd544f787db412af))

* Remove using namespace declarations at namespace scope in headers ([#2650](https://github.com/ripple/rippled/pull/2650/commits/2901577be73fc2e6f2fd71d693258660c2f5f724))

### Bug Fixes

* Deprecate the ‘sign’ and ‘sign_for’ APIs ([#2657](https://github.com/ripple/rippled/pull/2657))

* Use liquidity from strands that consume too many offers, which will be enabled on [fix1515](https://developers.ripple.com/known-amendments.html#fix1515) Amendment ([#2546](https://github.com/ripple/rippled/pull/2546))

* Fix a corner case when decoding base64 ([#2605](https://github.com/ripple/rippled/pull/2605/commits/0439dcfa7a5215cc74a8e254a28eadace6a524b7))

* Trim space in Endpoint::from_string ([#2593](https://github.com/ripple/rippled/pull/2593))

* Correctly suppress sent messages ([#2564](https://github.com/ripple/rippled/pull/2564))

* Detect when a unit test child process crashes ([#2415](https://github.com/ripple/rippled/pull/2415))

* Add missing virtual destructors ([#2532](https://github.com/ripple/rippled/pull/2532/commits/717f874767f2a431294244c0b532b00e508705ca))

* Improve JSON exception handling ([#2605](https://github.com/ripple/rippled/pull/2605/commits/00df097e5f2f533b81038b2c350bb2d896febd2e))

* Handle WebSocket construction exceptions ([#2629](https://github.com/ripple/rippled/pull/2629/commits/d89ff1b63d6792a25af872746013387001ebb72b))

## Contributions

We welcome external contributions to the XRP Ledger codebase. Please submit a pull request with your proposed changes on the GitHub project page at [https://github.com/ripple/rippled](https://github.com/ripple/rippled).

On behalf of the XRP Community, Ripple would like to thank those who have contributed to the development of the XRP Ledger (rippled) open source code, whether they did so by writing code, running the software, reporting issues, discovering bugs or offering suggestions for improvements.

The following is the list of people who made code contributions, large and small, to XRP Ledger prior to the release of 1.1.0:

Aishraj Dahal, Alex Chung, Alex Dupre, Andrey Fedorov, Arthur Britto, Bob Way, Brad Chase, Brandon Wilson, Bryce Lynch, Casey Bodley, Christian Ramseier, crazyquark, David Grogan, David Schwartz, Donovan Hide, Edward Hennis, Elliot Lee, Eric Lombrozo, Evan Hubinger, Frank Cash, Howard Hinnant, Jack Bond-Preston, jatchili, Jcar, Jed McCaleb, Jeff Trull, Joe Loser, Johanna Griffin, Josh Juran, Justin Lynn, Keaton Okkonen, Lieefu Way, Luke Cyca, Mark Travis, Markus Teufelberger, Miguel Portilla, Mike Ellery, MJK, Nicholas Dudfield, Nikolaos D. Bougalis, Niraj Pant, Patrick Dehne, Roberto Catini, Rome Reginelli, Scott Determan, Scott Schurr, S. Matthew English, Stefan Thomas, The Gitter Badger, Ties Jan Hefting, Tim Lewkow, Tom Ritchford, Torrie Fischer, Vahe Hovhannisyan, Vinnie Falco, Warren Paul Anderson, Will, wltsmrz, Wolfgang Spraul and Yana Novikova.

As XRP Ledger moves to the 1.0 series, we look forward to more external contributions and are excited to see the broader XRP Ledger community grow and thrive.
