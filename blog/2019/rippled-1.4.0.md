---
labels:
    - Release Notes
category: 2019
date: 2019-12-02
theme:
    markdown:
        editPage:
            hide: true
---
# Introducing XRP Ledger version 1.4.0

**XRP Ledger (`rippled` server) version 1.4.0** has been released. The XRP Ledger version 1.4.0 introduces several new features and overall improvements to the codebase, including the **DeletableAccounts** Amendment, which allows users to delete XRP Ledger accounts and recover some of their account base [reserve](https://xrpl.org/reserves.html) in the process.

The 1.4.0 release also includes improved peer slot management, improved CI integration and package building and support for [C++17](https://en.wikipedia.org/wiki/C%2B%2B17) and [Boost 1.71](https://www.boost.org/users/history/version_1_71_0.html).

Finally, the 1.4.0 release removes the code for the  **SHAMapV2** Amendment, which failed to gain majority support and has been made obsolete by other improvements.

## Action Required

**If you operate an XRP Ledger server,** then you should upgrade to XRP Ledger version 1.4.0 by Monday, 2019-12-16, to ensure service continuity.

### Impact of Not Upgrading

Ripple expects the **DeletableAccounts** Amendment to become enabled no earlier than Monday, 2019-12-16. When this happens, if you are not running release 1.4.0 or greater, your server will become [amendment blocked](https://xrpl.org/amendments.html#amendment-blocked), meaning that it:

* Cannot determine the validity of a ledger;
* Cannot submit or process transactions;
* Cannot participate in the consensus process;
* Cannot vote on future amendments; and
* Could rely on potentially invalid data.

If the **DeletableAccounts** Amendment does not become enabled, then your XRP Ledger server will not become Amendment blocked and should continue to operate.

### Upgrading

For instructions on updating XRP Ledger on supported platforms, see here:

- [Install `rippled`](https://xrpl.org/install-rippled.html)

The SHA-256 hashes for the official packages are as follows:

| Package | SHA-256 |
|:--------|:--------|
| [Red Hat RPM (x86-64)](https://repos.ripple.com/repos/rippled-deb/pool/stable/rippled_1.4.0-1_amd64.deb) | `0a06914cca3b24ace8ab893fbf3af003df9e308501376f86b043e672024f044b`
| [Ubuntu DEB (x86-64)](https://repos.ripple.com/repos/rippled-rpm/stable/rippled-1.4.0-1.el7.x86_64.rpm) | `0ed0f6e80610ccf786cd35132a32a891cd648d37daab113bebda8c004fd9e881` |

For other platforms, please compile version 1.4.0 from source.

* [Build on Ubuntu Linux](https://xrpl.org/build-run-rippled-ubuntu.html)

* [Build on macOS](https://xrpl.org/build-run-rippled-macos.html)

* [Build on other platforms](https://github.com/ripple/rippled/tree/master/Builds)

The first log entry should be the change setting the version:

```text
commit 06c371544acc3b488b9d9c057cee4e51f6bef7a2
Author: Nik Bougalis <nikb@bougalis.net>
Date:   Mon Nov 25 22:58:03 2019 -0800
    Set version to 1.4.0
```

## Network Update

The Ripple technical operations team plans to deploy version 1.4.0 to all XRP Ledger servers under its operational control, including private clusters, starting on Monday, 2019-12-02. At that time, Ripple plans to start voting in favor of the **DeletableAccounts** amendment. The deployment is expected to complete within 4 hours. The network should continue to operate during deployment and no outage is expected.

## Learn, ask questions, and discuss

Related documentation is available in the XRP Ledger Dev Portal, including detailed example API calls and web tools for API testing: [https://xrpl.org](https://xrpl.org)

Other resources:

* [XRP Chat Forum](http://www.xrpchat.com/)


## Other Information

### Bug Bounties and Responsible Disclosures

As always, Ripple welcomes reviews of the **XRP Ledger** open source codebase and urges reviewers to responsibly disclose any issues that they may find. For more on Ripple's Bug Bounty program, please visit <https://ripple.com/bug-bounty/>.

### Compilation Requirements & Compatibility

Starting with version **1.4.0**, compiling the codebase from source on any platform requires a compiler that supports the C++17 ISO standard and version 1.70.0 of the **[Boost](https://www.boost.org/)** C++ libraries.

## 1.4.0 Change Log

### New and Updated Features

* The **DeletableAccounts** amendment which, if enabled, allow users to delete their XRP Ledger accounts and recover some of their base reserve.

* Support for improved management of peer slots and the ability to add and remove reserved connections without requiring a restart of the server.

* Tracking and reporting of cumulative and instantaneous peer bandwidth usage.

* Preliminary support for post-processing historical shards after downloading to index their contents.

* Reporting the master public key alongside the ephemeral public key in the validation stream [subscriptions](https://xrpl.org/subscribe.html).

* Reporting consensus phase changes in the server stream [subscription](https://xrpl.org/subscribe.html).

### Bug Fixes

* The **fixPayChanRecipientOwnerDir** Amendment which corrects a minor technical flaw that would cause a payment channel to not appear in the recipient's owner directory, which made it unnecessarily difficult for users to enumerate all their payment channels.

* The **fixCheckThreading** Amendment which corrects a minor technical flaw that caused checks to not be properly threaded against the account of the check's recipient.

* Respect the `ssl_verify` configuration option in the `SSLHTTPDownloader` and `HTTPClient` classes.

* Properly update the `server_state` when a server detects a disagreement between itself and the network.

* Allow Ed25519 keys to be used with the `channel_authorize` command.

### List of Commits:

* Use signed artifacts in pkg pipeline ([22ca0041b](https://github.com/ripple/rippled/commit/22ca0041b847c38dd34e67faced7c6b296401619))

* Document the minimum GCC version as 7 ([4e8486874](https://github.com/ripple/rippled/commit/4e848687474242580e3770d8a3fd02b15b678b08))

* GPG Sign DEB and RPM packages generated by build pipeline ([9e1ccb900](https://github.com/ripple/rippled/commit/9e1ccb900ec72641a86a88e1169ead3f80dfb029))

* Ensure permissions for initial config ([e720a6607](https://github.com/ripple/rippled/commit/e720a660769ba58935619981795103167d7fe123))

* Make the HTTP response size const ([7be7343e0](https://github.com/ripple/rippled/commit/7be7343e05c685e30ceb45b1f1f66b49fe8c875e))

* Reject overlong encodings earlier ([e26dd7bdf](https://github.com/ripple/rippled/commit/e26dd7bdfee46d780452dcd8743802fe5e1e854a))

* Don't use set in AccountObjects test ([906b9ae00](https://github.com/ripple/rippled/commit/906b9ae00b5bb7ed9bce0e894ee2a849fdc9e495))

* Report consensus phase changes in the server subscription stream ([15c5f9c11](https://github.com/ripple/rippled/commit/15c5f9c1111eeea0743dbd9d9b0028756ff72ade))

* Make Env::AppBundle constructor exception safe ([726dd69ab](https://github.com/ripple/rippled/commit/726dd69ab920d0ba6bf84cc30100f54f2f081f6c))

* Relax STTx test failure criterion ([cd01502d1](https://github.com/ripple/rippled/commit/cd01502d17d6b674bccad5e0f74f2ac0e00e8c78))

* Omit downloader resolve test when it won't fail ([b2317f8b4](https://github.com/ripple/rippled/commit/b2317f8b41e1a61c74117db827d88ff9e1c9e80e))

* Allow channel_authorize to use Ed25519 keys ([113167acf](https://github.com/ripple/rippled/commit/113167acf4ec49a6b986f09036dde49153a8d1b1))

* Introduce support for deletable accounts ([a3a9dc26b](https://github.com/ripple/rippled/commit/a3a9dc26b4d4f049cf87fb7152f1fcef6697e505))

* Add deletion_blockers_only param to account_objects RPC command ([7e7664c29](https://github.com/ripple/rippled/commit/7e7664c29a616da308c13fc9f4aadaf300488fc2))

* Switch deadlock detector to steady_clock ([3f45b8c3b](https://github.com/ripple/rippled/commit/3f45b8c3bd97c9cdc9083edd2f27855460b36ffc))

* Support for boost 1.71 ([ca6d5798e](https://github.com/ripple/rippled/commit/ca6d5798e9de8d20eacc89bbe6f4a851ac016132))

* Add omitted unit tests, cleanup old files ([2110b2409](https://github.com/ripple/rippled/commit/2110b240902dc0a105f4ed80062ef062b1033ea2))

* Add option to enable -Wextra for gcc/clang. ([82484e26f](https://github.com/ripple/rippled/commit/82484e26f57719199f67870dc21f10dcf82adb14))

* Small bug fixes in BuildLedger.cpp ([ca47583a3](https://github.com/ripple/rippled/commit/ca47583a3bc22c6d088ed0e1269759219ce553eb))

* Add metrics for PeerImp to track bandwidth usage ([f4d6b0e1c](https://github.com/ripple/rippled/commit/f4d6b0e1c49fc008932a85df99b404c66e46ab1e))

* Include validator's master public key in validation stream ([9196d954](https://github.com/ripple/rippled/commit/9196d9541ae196785df29191865c7244876ecd58))

* CI: remove boost from MacOS / Hombrew ([9a5911f94](https://github.com/ripple/rippled/commit/9a5911f94c1ff2f8375ff647ee3ebfa2530b80f6))

* Fix startup error with --import ([80acc85e5](https://github.com/ripple/rippled/commit/80acc85e59618f59c4f4ef8210fae93a19153da7))

* Fix VS2019 debug build ([8ce1c189f](https://github.com/ripple/rippled/commit/8ce1c189f7c9fd24a24f321cc794d51e4b2381cc))

* Remove SHAMap V2 ([7228b2e06](https://github.com/ripple/rippled/commit/7228b2e068b21968acd2723139da1b7060bca036))

* Automatically update NodeDB path if changed ([33ab0cd7b](https://github.com/ripple/rippled/commit/33ab0cd7bd1eec167f931134bd2b07de0fc31c20))

* Add PayChan to recipient's owner directory ([e33ac1d45](https://github.com/ripple/rippled/commit/e33ac1d45090891bbb38ad96817a96f6106c8583))

* Clarify Linux build instructions for configuring ([826cbbc3b](https://github.com/ripple/rippled/commit/826cbbc3bfaab8327d91ac322503600f1ea7ee0a))

* Cleanup usage of ScopedUnlock ([d9bb78c8b](https://github.com/ripple/rippled/commit/d9bb78c8b8ca293468aefa653f41b7ac07d44ae1))

* Modularize cmake build config ([905f631b7](https://github.com/ripple/rippled/commit/905f631b716d1bbc91caad48b207c8d2e76e5c5b))

* Honor SSL config settings for ValidatorSites ([9213c49ca](https://github.com/ripple/rippled/commit/9213c49ca1ac8f0f5acb11ba2a105b15a2f8121f))

* Clarify online delete data error message ([a6944be5c](https://github.com/ripple/rippled/commit/a6944be5cfade694df96953fad09e83a55177fbc))

* Update operating mode upon network disagreement ([e5b61c9ac](https://github.com/ripple/rippled/commit/e5b61c9ac939342bf30293d6db1c6f56a6d6d88a))

* Add Destination to Check threading ([a9a4e2c8f](https://github.com/ripple/rippled/commit/a9a4e2c8fb7f5da0e6770c0f9f3d810dbfb25495))

* Fix rand_int assert in shard store ([56eac5c9a](https://github.com/ripple/rippled/commit/56eac5c9a1b1bab95185095fab56ee3368916262))

* Log database connection error ([4b1970afa](https://github.com/ripple/rippled/commit/4b1970afa9cad952a90990618ccd1c6dbb8ad39d))

* Add shard thread safety ([22c9de487](https://github.com/ripple/rippled/commit/22c9de487a6171c4ed8a48850b328d87c8a3c6bb))

* Implement Shard SQLite support ([66fad62e6](https://github.com/ripple/rippled/commit/66fad62e661bc8b8739d109e78c18c8d5002c6e9))

* Improve CI and packaging ([008fc515](https://github.com/ripple/rippled/commit/008fc5155af34d832aec4953415f79118eaccc1f))

* Disable shadow warning ([06219f115](https://github.com/ripple/rippled/commit/06219f11517e802d625efed49a1becae24ccbe00))

* Simplify code using if constexpr ([c2d2ba9f4](https://github.com/ripple/rippled/commit/c2d2ba9f45380afd03ed1359b917e2041794787b))

* Replace `from_string_checked` pair return type with `optional<Endpoint>` ([1eb3753f2](https://github.com/ripple/rippled/commit/1eb3753f262924879ce79774051f3fbf9582fc5a))

* Replace `strUnHex` pair return type with `optional<Blob>` ([0a256247a](https://github.com/ripple/rippled/commit/0a256247a039c5ca3a2927f1809d362e4b0225e3))

* Use structured bindings in some places ([7912ee6f7](https://github.com/ripple/rippled/commit/7912ee6f7b51527e0ff981acc6aebd081e4c7b08))

* Replace unordered_map::emplace with insert_or_assign ([9c58f23cf](https://github.com/ripple/rippled/commit/9c58f23cf8419091e34dc622a4221313e3dbd1ba))

* Use std::gcd to implement lowestTerms ([9245b0b66](https://github.com/ripple/rippled/commit/9245b0b666a4f1fc4a2524a6872cacfeb9476eb7))

* Use [[fallthrough]] in some switch statements ([92925a0af](https://github.com/ripple/rippled/commit/92925a0af6cad2a02a65001985c02e8712e08447))

* remove make_Amounts ([70c2e1b41](https://github.com/ripple/rippled/commit/70c2e1b4192aeb64931dd4f12b264c67f117240d))

* Use class template argument deduction for locks ([5d1728cc9](https://github.com/ripple/rippled/commit/5d1728cc962be658c423f38df05567a2e168644f))

* Replace for_each_arg trick with fold expressions ([4076b6d92](https://github.com/ripple/rippled/commit/4076b6d92e098f0eabfe62aea08502dabc934084))

* Fix shadowing variables ([b9e73b485](https://github.com/ripple/rippled/commit/b9e73b4852ad4763b28c230de6153cb1a9fd43d5))

* Remove unused member variable ([014df67fe](https://github.com/ripple/rippled/commit/014df67fed72cf83651a3589729da7840641e408))

* Build packages with gcc-8 ([014ec021b](https://github.com/ripple/rippled/commit/014ec021bb8365917daadcb96339ff8dc5cc44df))

* Fix jenkins/travis CI ([7fa9b91d2](https://github.com/ripple/rippled/commit/7fa9b91d23a76ee9f7cce7083e7fbd00ea81bae4))

* Add "sahyadri.isrdc.in" to list of bootstrap nodes ([c04c00d27](https://github.com/ripple/rippled/commit/c04c00d279af8e52decbcbce649ccfd0e4c824a1))

* Update README.md ([ef139e8b3](https://github.com/ripple/rippled/commit/ef139e8b3ce23d3965224e67c54923a6ae7f7728))

* Warn if the update script is not executed as root ([45c1c3899](https://github.com/ripple/rippled/commit/45c1c38993c3ce19efd6e9f98ddf8512e7471394))

* Modernize code and clean up out-of-date or obsolete comments ([1942fee58](https://github.com/ripple/rippled/commit/1942fee58139c6499bb217236c67c584528c629d))

* Remove unused TER code from StrandResult ([b3c85e270](https://github.com/ripple/rippled/commit/b3c85e270987edd9683df035c04547880dcbd40d))

* Use enums for some parameters in payments ([561942da2](https://github.com/ripple/rippled/commit/561942da23e518cc7e7df218bc46b3d32d6f8cb9))

* Enable C++17 ([c217baa36](https://github.com/ripple/rippled/commit/c217baa367a65724808c5df9d157b9a22eb6f563))

* Fix incorrect snapShot unsharing ([c699864c8](https://github.com/ripple/rippled/commit/c699864c85664056db0ae2b347130e959966ea3e))

* Remove unneeded and unused base classes in insight ([4ff0f482c](https://github.com/ripple/rippled/commit/4ff0f482c34b7a970b8cdac6317b30096bda4b4b))

* Enhance AccountTx unit test ([28b942b18](https://github.com/ripple/rippled/commit/28b942b186fcd1fa6ff5dc75a12b676c353d5ec4))

* Update appveyor dependencies for boost 1.70 ([4900e3081](https://github.com/ripple/rippled/commit/4900e3081d99768d0218a22cdffc3c8cf9dba647))

* Add policy check to FindBoost ([145326c00](https://github.com/ripple/rippled/commit/145326c00c8642d1736d917cad22d5269673102e))

* Update to current SOCI HEAD ([c7d90bfdd](https://github.com/ripple/rippled/commit/c7d90bfddd684d38076f9c3b04c713e70e624e36))

* Fix io_latency_probe test on CI environments ([bfa84cfca](https://github.com/ripple/rippled/commit/bfa84cfca56c8f7a88ed963ecbeb539185569566))

* Set minimum versions for gcc/clang ([cbc6e500b](https://github.com/ripple/rippled/commit/cbc6e500b676849d554b04d992e7226ef903ce76))

* Travis CI improvements ([13a4fefe3](https://github.com/ripple/rippled/commit/13a4fefe3466b413d273526c4b0c4d393793ff02))

* Add support for reserved peer slots ([87e9ee5ce](https://github.com/ripple/rippled/commit/87e9ee5ce93088d95ffbfa6d8ce01a88fd7491f0))

* Fix GitLab CI ([20cc5df5f](https://github.com/ripple/rippled/commit/20cc5df5fe8b0cadb1e6a24767f796b54418fedb))

* Fix shard path detection ([9e117b7b3](https://github.com/ripple/rippled/commit/9e117b7b384b541ba083fed5a9b390d8d965e82b))

* Move shard store init to Application ([a02d91409](https://github.com/ripple/rippled/commit/a02d91409319b6b924659ce08217f75eb6301c6f))

* Remove SQLite Validations table ([c5a95f1eb](https://github.com/ripple/rippled/commit/c5a95f1eb5a5eedc7ece46ad26505209c1703486))

## Contributions

### GitHub

The public git repository for `rippled` is hosted on GitHub: [https://github.com/ripple/rippled](https://github.com/ripple/rippled)

We welcome contributions, big and small, and invite everyone to join the community of XRP Ledger developers and help us build the Internet of Value.

### Credits

The following people contributed directly to this release:

* Alloy Networks 45832257+alloyxrp@users.noreply.github.com

* Devon White devon@prometheanlabs.io

* Edward Hennis ed@ripple.com

* Elliot Lee github.public@intelliot.com

* Howard Hinnant howard.hinnant@gmail.com

* John Freeman jfreeman08@gmail.com

* John Northrup jnorthrup@ripple.com

* Joseph Busch jbusch@ripple.com

* Manoj Doshi mdoshi@ripple.com

* Mark Travis mtravis@ripple.com

* Miguel Portilla miguelportilla@pobros.com

* Mike Ellery mellery451@gmail.com

* Mo Morsi mo@morsi.org

* Nik Bougalis nikb@bougalis.net

* Rome Reginelli rome@ripple.com

* Scott Schurr scott@ripple.com

* seelabs scott.determan@yahoo.com

* Vishwas Patil ivishwas@gmail.com

* Yusuf Sahin HAMZA yusufsahinhamza@gmail.com

#### Lifetime Contributors

The following is the list of people who made code contributions, large and small, to XRP Ledger prior to the release of 1.4.0:

Aishraj Dahal, Alex Chung, Alex Dupre, Alloy Networks, Andrey Fedorov, Arthur Britto, Bharath Chari, Bob Way, Brad Chase, Brandon Wilson, Bryce Lynch, Casey Bodley, Christian Ramseier, crazyquark, Crypto Brad Garlinghouse, David Grogan, David 'JoelKatz' Schwartz, Devon White, Donovan Hide, Edward Hennis, Elliot Lee, Eric Lombrozo, Ethan MacBrough, Evan Hubinger, Frank Cash, Howard Hinnant, Ian Roskam, invalidator, Jack Bond-Preston, James Fryman, jatchili, Jcar, Jed McCaleb, Jeff Trull, Jesper Wallin, Joe Loser, Johanna Griffin, John Freeman, John Northrup, Joseph Busch, Josh Juran, Justin Lynn, Keaton Okkonen, Lazaridis, Lieefu Way, Luke Cyca, Manoj Doshi, Mark Travis, Markus Teufelberger, Miguel Portilla, Mike Ellery, MJK, Mo Morsi, Nicholas Dudfield, Nikolaos D. Bougalis, Niraj Pant, Patrick Dehne, Roberto Catini, Rome Reginelli, Scott Determan, Scott Schurr, S. Matthew English, Stefan Thomas, The Gitter Badger, Ties Jan Hefting, Tim Lewkow, Tom 'Swirly' Ritchford, Torrie Fischer, Vahe Hovhannisyan, Vinnie Falco, Vishwas Patil, Warren Paul Anderson, Will, wltsmrz, Wolfgang Spraul, Yana Novikova and Yusuf Sahin HAMZA.

For a real-time view of all contributors, including links to the commits made by each, please visit the "Contributors" section of the GitHub repository: <https://github.com/ripple/rippled/graphs/contributors>.

As XRP Ledger continues to move through the 1.0 series, we look forward to more external contributions and are excited to see the broader XRP Ledger community grow and thrive.
