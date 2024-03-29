---
labels:
    - Release Notes
category: 2019
date: 2019-02-13
theme:
    markdown:
        editPage:
            hide: true
---
# Introducing XRP Ledger (rippled) version 1.2.0

Ripple is pleased to announce the release of **XRP Ledger (`rippled`) version 1.2.0.**

The XRP Ledger version 1.2.0 release introduces the [MultisignReserve](https://developers.ripple.com/known-amendments.html#multisignreserve) Amendment, which reduces the reserve requirement associated with signer lists for [Multisign](https://developers.ripple.com/set-up-multi-signing.html). This release also includes incremental improvements to the code that handles offers in the decentralized exchange ([fixTakerDryOfferRemoval](https://developers.ripple.com/known-amendments.html#fixtakerdryofferremoval) and [fix1578](https://developers.ripple.com/known-amendments.html#fix1578) Amendments).

One of the major benefits of decentralized blockchain technologies, such as the XRP Ledger, is censorship resistance. Already highly resistant to censorship attempts, with the release of version 1.2.0 of the XRP Ledger, servers now have the ability to automatically detect transaction censorship attempts and issue warnings of increasing severity for transactions that a server believes should have been included in a closed ledger after several rounds of consensus.

<!-- BREAK -->

## Action Required

**If you operate an XRP Ledger server,** then you should upgrade to version 1.2.0 by Wednesday, 2019-02-27, to ensure service continuity.

### Impact of Not Upgrading

Ripple expects the **MultisignReserve**, **fixTakerDryOfferRemoval**, and **fix1578** amendments to become enabled no earlier than Wednesday, 2019-02-27. When this happens, if you are not running release 1.2.0 or greater, your server will become [amendment blocked](https://developers.ripple.com/amendments.html#amendment-blocked), meaning that it:

* Cannot determine the validity of a ledger;

* Cannot submit or process transactions;

* Cannot participate in the consensus process;

* Cannot vote on future amendments; and

* Could rely on potentially invalid data.

If the **MultisignReserve**, **fixTakerDryOfferRemoval**, and **fix1578** amendments do not become enabled, then your XRP Ledger server will not become amendment blocked and should continue to operate.

### Upgrading

On supported platforms, see the [instructions on updating `rippled`](https://developers.ripple.com/install-rippled.html).

- The SHA-256 for the RPM is: `a6982002a5e7c3abb0078e9c986e4c28c8310ca67defa5f74a1b3581cc9bc0a4`

- The SHA-256 for the source RPM is: `1927e5411619cc66170730342f1a7c38f6eafae8c4246d68e24cc0ad4fd62b9e`

For other platforms, please compile version 1.2.0 from source.

* [Ubuntu Linux](https://developers.ripple.com/build-run-rippled-ubuntu.html)

* [macOS](https://developers.ripple.com/build-run-rippled-macos.html)

* [Other platforms](https://github.com/ripple/rippled/tree/master/Builds)

The first log entry should be the change setting the version:

    commit 7779dcdda00ea61a976cf5f387bc1f3bb4ebbfdd
    Author: Mike Ellery <mellery451@gmail.com>
    Date:   Tue Feb 12 16:41:03 2019 -0800

        Set version to 1.2.0

## Network Update

The Ripple technical operations team plans to deploy version 1.2.0 to all XRP Ledger servers under its operational control, including private clusters, starting at 2:00 PM PST on Wednesday, 2019-02-13. At that time, Ripple plans to start voting in favor of the **fix1578** amendment. The deployment is expected to complete within 4 hours. The network should continue to operate during deployment and no outage is expected.

## Learn, ask questions, and discuss

Related documentation is available in the [XRP Ledger Dev Portal](https://developers.ripple.com/), including detailed example API calls and web tools for API testing.

Other resources:

* The Ripple Forum (_Disabled._ Formerly `forum.ripple.com`)

* Ripple Technical Services: <support@ripple.com>

* [XRP Chat Forum](http://www.xrpchat.com/)

## Other Information

### Bug Bounties and Responsible Disclosures

On behalf of the XRP Community, Ripple would like to thank Guido Vranken and Aaron Hook, for their research effortsand for responsibly disclosing the issues they discovered. As always, Ripple welcomes reviews of the **XRP Ledger** open source codebase and urge reviewers to responsibly disclose any issues that they may find. For more on Ripple's Bug Bounty program, please visit[ https://ripple.com/](https://ripple.com/bug-bounty/)[bug-bounty](https://ripple.com/bug-bounty/)[/](https://ripple.com/bug-bounty/).

### Boost Compatibility

When compiling XRP Ledger from source, you must use a compatible version of the Boost library. **As of XRP Ledger version 1.2.0, Boost 1.67.0 is required for all platforms.**

## 1.2.0 Change Log

### New and Updated Features

* Enhance /crawl API endpoint with local server information ([#2823](https://github.com/ripple/rippled/pull/2823))

* Report duration in current state ([#2772](https://github.com/ripple/rippled/pull/2772))

* Allow servers to detect transaction censorship attempts ([#2700](https://github.com/ripple/rippled/pull/2700))

* Add RPC command shard crawl ([#2697](https://github.com/ripple/rippled/pull/2697))

* Default ledger_entry by index to return JSON, not hex ([#2713](https://github.com/ripple/rippled/pull/2713))

* Add support for Ed25519 seeds encoded using ripple-lib ([#2734](https://github.com/ripple/rippled/pull/2734))

### New and Changed Amendments

* Improve error indicators on two transactions ([#2584](https://github.com/ripple/rippled/pull/2584))

* Reduce the account reserve for a Multisign SignerList ([#2649](https://github.com/ripple/rippled/pull/2649))

* fixTakerDryOfferRemoval Amendment to fix non-removal of dry offers when autobridging ([#2695](https://github.com/ripple/rippled/pull/2695))

* Retire the FeeEscalation amendment ([#2730](https://github.com/ripple/rippled/pull/2730))

### Config Changes

* Remove [ips] section from sample config (e5d6f16)

* "Add zaphod.alloy.ee to default hub config" ([#2807](https://github.com/ripple/rippled/pull/2807))

* Load validator list from file: ([#2744](https://github.com/ripple/rippled/pull/2744))

* Change conflicting example websocket port ([#2726](https://github.com/ripple/rippled/pull/2726))

* Remove outdated example configs. ([#2648](https://github.com/ripple/rippled/pull/2648))

### Bug Fixes

* Improve preferred ledger calculation ([#2784](https://github.com/ripple/rippled/pull/2784))

* Account for minimum reserve in potential spend ([#2750](https://github.com/ripple/rippled/pull/2750))

* STObject:setType() returns description of error if any ([#2753](https://github.com/ripple/rippled/pull/2753))

* Improve RPC error message for fee command ([#2704](https://github.com/ripple/rippled/pull/2704))

* Eliminate potential undefined behavior ([#2762](https://github.com/ripple/rippled/pull/2762))

* Fix memory leak in Json move assignment operator ([#2747](https://github.com/ripple/rippled/pull/2747))

* Use after move fix ([#2752](https://github.com/ripple/rippled/pull/2752))

* Use correct manifest cache when loading ValidatorList ([#2745](https://github.com/ripple/rippled/pull/2745))

### Other Improvements:

* Support for boost 1.68 ([#2652](https://github.com/ripple/rippled/pull/2652))

* Improve ssl and NIH in cmake ([#2655](https://github.com/ripple/rippled/pull/2655))

* Refine json object test for NDEBUG case ([#2656](https://github.com/ripple/rippled/pull/2656))

* Use ExternalProject for some third party deps ([#2678](https://github.com/ripple/rippled/pull/2678))

* Report fetch pack errors with shards ([#2680](https://github.com/ripple/rippled/pull/2680))

* Rollup of small changes ([#2714](https://github.com/ripple/rippled/pull/2714))

* Prefer regex to manual parsing in parseURL ([#2763](https://github.com/ripple/rippled/pull/2763))

* Remove custom terminate handler ([#2773](https://github.com/ripple/rippled/pull/2773))

* Implement missing string conversions for JSON ([#2779](https://github.com/ripple/rippled/pull/2779))

* Properly handle the `--rpc_port` command line argument ([#2777](https://github.com/ripple/rippled/pull/2777))

* Correct amount serialization comments ([#2790](https://github.com/ripple/rippled/pull/2790))

* Reserve correct vector size for fee calculations ([#2794](https://github.com/ripple/rippled/pull/2794))

* Improve crawl shard resource usage ([#2805](https://github.com/ripple/rippled/pull/2805))

* Ensure no overflow in casts between enums and integral types ([#2814](https://github.com/ripple/rippled/pull/2814))

* Upgrade sqlite to 3.26 ([#2818](https://github.com/ripple/rippled/pull/2818))

* Include more information LedgerTrie log messages ([#2826](https://github.com/ripple/rippled/pull/2826))

* Simplify strHex ([#2668](https://github.com/ripple/rippled/pull/2668))

* Add a flag that track whether we've already dispatched ([#2468](https://github.com/ripple/rippled/pull/2468))

* Add user defined literals for megabytes and kilobytes ([#2631](https://github.com/ripple/rippled/pull/2631))

* TxQ developer docs, and faster ledger size growth ([#2682](https://github.com/ripple/rippled/pull/2682))

* Add RPCCall unit tests ([#2685](https://github.com/ripple/rippled/pull/2685))

* Remove unused function in AutoSocket.h ([#2692](https://github.com/ripple/rippled/pull/2692))

* Report fetch pack errors with shards ([#2680](https://github.com/ripple/rippled/pull/2680))

* Improve codecov builds ([#2690](https://github.com/ripple/rippled/pull/2690))

* Remove beast::Journal default constructor ([#2691](https://github.com/ripple/rippled/pull/2691))

* Add dependency for NuDB ExternalProject ([#2703](https://github.com/ripple/rippled/pull/2703))

* Include entire src tree in multiconfig projects ([#2707](https://github.com/ripple/rippled/pull/2707))

* Remove unused execinfo.h header ([#2712](https://github.com/ripple/rippled/pull/2712))

* Build protobuf as ExternalProject when not found ([#2760](https://github.com/ripple/rippled/pull/2760))

* Reset the validator list fetch timer if an error occurs ([#2761](https://github.com/ripple/rippled/pull/2761))

* Remove WaitableEvent ([#2737](https://github.com/ripple/rippled/pull/2737))

* Cleanup unused Beast bits and pieces ([#2739](https://github.com/ripple/rippled/pull/2739))

* Add source filtering for coverage with option to disable ([#2742](https://github.com/ripple/rippled/pull/2742))

* Remove unused json_batchallocator.h ([#2743](https://github.com/ripple/rippled/pull/2743))

* Inline calls to cachedRead ([#2749](https://github.com/ripple/rippled/pull/2749))

* Remove the state file for the random number generator ([#2754](https://github.com/ripple/rippled/pull/2754))

* Remove duplicated include ([#2732](https://github.com/ripple/rippled/pull/2732))

* CI rpm build fix (7c96bba)

* Allow rippled to compile with C++17 ([#2718](https://github.com/ripple/rippled/pull/2718))

## Contributions

We welcome external contributions to the XRP Ledger codebase. Please submit a pull request with your proposed changes on the GitHub project page at <https://github.com/ripple/rippled>.

On behalf of the XRP Community, Ripple would like to thank those who have contributed to the development of the XRP Ledger (rippled) open source code, whether they did so by writing code, running the software, reporting issues, discovering bugs or offering suggestions for improvements.

The following is the list of people who made code contributions, large and small, to the XRP Ledger prior to the release of 1.2.0:

Aishraj Dahal, Alex Chung, Alex Dupre, Andrey Fedorov, Arthur Britto, Bob Way, Brad Chase, Brandon Wilson, Bryce Lynch, Casey Bodley, Christian Ramseier, crazyquark, David Grogan, David Schwartz, Donovan Hide, Edward Hennis, Elliot Lee, Eric Lombrozo, Evan Hubinger, Frank Cash, Howard Hinnant, Jack Bond-Preston, jatchili, Jcar, Jed McCaleb, Jeff Trull, Joe Loser, Johanna Griffin, Josh Juran, Justin Lynn, Keaton Okkonen, Lieefu Way, Luke Cyca, Mark Travis, Markus Teufelberger, Miguel Portilla, Mike Ellery, MJK, Nicholas Dudfield, Nikolaos D. Bougalis, Niraj Pant, Patrick Dehne, Roberto Catini, Rome Reginelli, Scott Determan, Scott Schurr, S. Matthew English, Stefan Thomas, The Gitter Badger, Ties Jan Hefting, Tim Lewkow, Tom Ritchford, Torrie Fischer, Vahe Hovhannisyan, Vinnie Falco, Warren Paul Anderson, Will, wltsmrz, Wolfgang Spraul and Yana Novikova.

As the XRP Ledger moves through the 1.0 series, we look forward to more external contributions and are excited to see the broader XRP Ledger community grow and thrive.
