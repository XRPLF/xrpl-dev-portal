---
labels:
    - Release Notes
category: 2019
date: 2019-07-25
theme:
    markdown:
        editPage:
            hide: true
---
# Introducing XRP Ledger (rippled) version 1.3.1

Ripple has released **version 1.3.1 of `rippled`**, the reference implementation of the core XRP Ledger protocol. To learn more about how to build and run a `rippled` server, see [Manage the Rippled Server](https://xrpl.org/manage-the-rippled-server.html).

This release supersedes version 1.3.0. Version 1.3.1 addresses deadlock conditions reported by some users late in the release cycle for 1.3.0.

<!-- BREAK -->


## Installing or Updating `rippled`
The installation instructions on supported platforms have changed for `rippled` 1.3.x.

- For all new installs, see [Install `rippled`](https://xrpl.org/install-rippled.html).
- On Red Hat Enterprise Linux 7 or CentOS 7, if you have **automatic updates** enabled, the updates should work successfully. For more information or for manual update instructions, see the [Migration Instructions for RHEL 7 / CentOS](https://xrpl.org/rippled-1-3-migration-instructions.html#migration-on-centos-or-red-hat-enterprise-linux-rhel).
- On Ubuntu Linux (16.04, 18.04, or newer), native (APT) packages are now available. If you already have `rippled` installed using the previous method (installing RPMs with Alien), see [Migration Instructions for Ubuntu Linux](https://xrpl.org/rippled-1-3-migration-instructions.html#migration-on-ubuntu-linux) for steps to migrate to the new, native packages. Additionally, it is now possible to enable [automatic updates](https://xrpl.org/update-rippled-automatically-on-linux.html) on Ubuntu.
- Debian 9 Stretch is now a supported operating system. See [Installation on Ubuntu or Debian Linux](https://xrpl.org/install-rippled-on-ubuntu.html) for instructions.
- For other platforms, please [compile from source](https://github.com/ripple/rippled/tree/develop/Builds/).
    - Step-by-step instructions for compiling `rippled` are also available for [macOS](https://xrpl.org/build-run-rippled-macos.html) and [Ubuntu](https://xrpl.org/build-run-rippled-ubuntu.html).


## Summary of Changes

The `rippled` 1.3.1 release introduces several new features and overall improvements to the codebase, including the `fixMasterKeyAsRegularKey` amendment, code to adjust the timing of the consensus process and support for decentralized validator domain verification. The release also includes miscellaneous improvements including in the transaction censorship detection code, transaction validation code, manifest parsing code, config file parsing code, log file rotation code, and in the build, continuous integration, testing and package building pipelines.

**New and Updated Features**

- The `fixMasterKeyAsRegularKey` amendment which, if enabled, will correct a technical flaw that allowed setting an account's regular key to the account's master key.
- Code that allows validators to adjust the timing of the consensus process in near-real-time to account for connection delays.
- Support for decentralized validator domain verification by adding support for a "domain" field in manifests.

**Bug Fixes**

- Improve ledger trie ancestry tracking to reduce unnecessary error messages.
- More efficient detection of dry paths in the payment engine. Although not a transaction-breaking change, this should reduces spurious error messages in the log files.
- Improved handling of deadlock conditions.

### Test Net

This release is currently live on the [XRP Ledger Test Net](https://xrpl.org/xrp-test-net-faucet.html), with the `fixMasterKeyAsRegularKey` amendment active. To connect your server to the test net, please upgrade to version 1.3.1 immediately.

## Upgrading

On supported platforms, see the [instructions on updating rippled](https://xrpl.org/install-rippled.html).

| Package Type | Platform      | Link | SHA-256 |
|--------------|---------------|------|:-------:|
| RPM          | Linux x86-64  | [rippled-1.3.1-1.el7.x86_64.rpm](https://repos.ripple.com/repos/rippled-rpm/stable/rippled-1.3.1-1.el7.x86_64.rpm) | `98ffea13716c3b37472d75cbb25870bfb6a7ee2360fe89a2b86833774174b370`  |
| DEB          | Linux x86-64  | [rippled_1.3.1-1_amd64.deb](https://repos.ripple.com/repos/rippled-deb/pool/stable/rippled_1.3.1-1_amd64.deb) | `3ecd391ba12f69060851952cef8ee1079a6f5e22ecb784bf05f50ef8f294aa92`  |

### Git commit

When compiling from source, the first log entry should be the change setting the version:

```text
commit e1adbd7ddd5dfa9f2a9791aa3c0fcc1fdb4e8236
Author: Manoj doshi <mdoshi@ripple.com>
Date:   Wed Jul 24 15:21:56 2019 -0700

    Set version to 1.3.1
```

### Commits

- [`e1adbd7dd`](https://github.com/ripple/rippled/commit/e1adbd7ddd5dfa9f2a9791aa3c0fcc1fdb4e8236) Set version to 1.3.1
- [`355a7b04a`](https://github.com/ripple/rippled/commit/355a7b04a8e8abeea108af82246449859ea9fb7e) Add a LogicError when a deadlock is detected
- [`d3ee0df93`](https://github.com/ripple/rippled/commit/d3ee0df93ad5d2f12e44af9f652cc39939f7445e) Add links to in-repo build-instructions
- [`7c24f7b17`](https://github.com/ripple/rippled/commit/7c24f7b1706dd464152ca3551c5775f90430f3e8) Improve logging during process startup.
- [`a3060516c`](https://github.com/ripple/rippled/commit/a3060516c6ffedb2ca6e4e129bd40a26068f1371) Improve package build pipeline
- [`caa5c9e22`](https://github.com/ripple/rippled/commit/caa5c9e2232ff1eee1d0c61907283649e48e6fbc) Set version to 1.3.0
- [`846538304`](https://github.com/ripple/rippled/commit/846538304fa9ddee17e9baa196c98d6649f06b13) Set version to 1.3.0-rc2
- [`7b7e3b675`](https://github.com/ripple/rippled/commit/7b7e3b6750028d25bdfd390150d5bbe4743b36ef) Return WS error on closure when balance threshold exceeds
- [`a988b3224`](https://github.com/ripple/rippled/commit/a988b3224fa898523e94769b4b518e808aa1eb90) Use NuDB context with backends
- [`89b3bf079`](https://github.com/ripple/rippled/commit/89b3bf07960a0980ee5de448333290f33bdb5871) Stabilize RPC error code values:
- [`6d8988b78`](https://github.com/ripple/rippled/commit/6d8988b78a0b07030d833a10e46f373810a26944) Improve handling of revoked manifests:
- [`3acbd84f1`](https://github.com/ripple/rippled/commit/3acbd84f1ddeed747e7518c4c48787f6918a8f84) Set proper system openssldir in package build
- [`45403b877`](https://github.com/ripple/rippled/commit/45403b877f876dfc8daf496be0e1c74d8adbbcd4) Set version to 1.3.0-rc1
- [`f17d9bc42`](https://github.com/ripple/rippled/commit/f17d9bc42143e9ae0c7bc1fb171a4a00290a0299) Set version to 1.3.0-b6
- [`ba2714fa2`](https://github.com/ripple/rippled/commit/ba2714fa22efdd7101afacf47f07e16281c1895f) Make protocol message counters more granular:
- [`2c4b3d515`](https://github.com/ripple/rippled/commit/2c4b3d515d6aa3a4ae91986196f15e0cd212c4df) Trim whitespace for all config lines
- [`59973a435`](https://github.com/ripple/rippled/commit/59973a435ec01e1740b71ac2e21d94a5f80f5fc6) Add beast/cxx17 to install set
- [`93232ec7d`](https://github.com/ripple/rippled/commit/93232ec7dfb4d47ba8552ad01d2f18cab63c53d8) Add logrotate config to rpm/deb pkgs
- [`efa926676`](https://github.com/ripple/rippled/commit/efa926676c1b63fddb88f7686fb3e6edc26b169c) Set version to 1.3.0-b5
- [`dc24748c2`](https://github.com/ripple/rippled/commit/dc24748c24cc2ca8412735a895c3d517bd97a7f5) Improve locking of PeerImp member variables
- [`f8365f500`](https://github.com/ripple/rippled/commit/f8365f5009c1c5b49ab3cb499bc3eb08156bc515) Add JsonOptions enum class to contain options passed to getJSON methods
- [`c2138c4e8`](https://github.com/ripple/rippled/commit/c2138c4e8814b563d37c3f4fcc998be8f25c9208) Fix Docker error about "FROM" macro usage
- [`bfad96dbb`](https://github.com/ripple/rippled/commit/bfad96dbb99fffd8dde01a4db40f6f148fbd9b47) Force snappy compression for RocksDB (remove option):
- [`0ef6d9f9a`](https://github.com/ripple/rippled/commit/0ef6d9f9a0cb192a260ba94fb6e4240c662664bb) Add slack notify for approvals, remove old RPM build
- [`c1a1cfe55`](https://github.com/ripple/rippled/commit/c1a1cfe5500deec742d2cf17d6d2ce3afe3e868a) Pkgbld - Make approval blocking, add slack summary message
- [`773dcd1d4`](https://github.com/ripple/rippled/commit/773dcd1d488bf70c205196176a216e0e49ca636e) Modernize base_uint:
- [`de99e79bf`](https://github.com/ripple/rippled/commit/de99e79bf1e55f198fd03fc5a0cfa6c13c45ca4a) Fix SNTPClock shutdown
- [`e83d367f4`](https://github.com/ripple/rippled/commit/e83d367f49cceb4b5f28830fb1965a5978744450) Set version to 1.3.0-b4
- [`aa76b382a`](https://github.com/ripple/rippled/commit/aa76b382afce98927e122cac8ed77f1b3a67563e) Document IPv6 usage in sample config:
- [`595b7b194`](https://github.com/ripple/rippled/commit/595b7b194c0f587b2f3007017875026c761818f7) Improve locking:
- [`5f908ba87`](https://github.com/ripple/rippled/commit/5f908ba870446f19f9f78ad84008a146f93dca41) Make some locks more granular:
- [`adc1b8a36`](https://github.com/ripple/rippled/commit/adc1b8a36b723e5be30e6fe7b4a61b07f4a59fb6) Update package build env to boost 1.70
- [`73c6e47e8`](https://github.com/ripple/rippled/commit/73c6e47e8a56f643e7e2c5cb1b9fe6efd8d1294c) Use local rippled core lib during pkg build
- [`3a780f80f`](https://github.com/ripple/rippled/commit/3a780f80f17429928e5305516662f260a12c534b) Remove repo package check from update script
- [`c78404e23`](https://github.com/ripple/rippled/commit/c78404e233268d4983e41b7ceefaec101accdf5a) Pause for lagging validators.
- [`79a0cb096`](https://github.com/ripple/rippled/commit/79a0cb096b1ec86fe40367e6ccb61f4a42fa15db) Payment paths with a zero output step are dry (RIPD-1749):
- [`6f9e8dc72`](https://github.com/ripple/rippled/commit/6f9e8dc72033a2f92c68f9c9c0dcf5657b8b40e1) Support Boost 1.70:
- [`b39b0fef3`](https://github.com/ripple/rippled/commit/b39b0fef395d5851b3df4e0e74e939f06bf5fddc) Get names of transactions and ledger types from jss
- [`be139d9bd`](https://github.com/ripple/rippled/commit/be139d9bde99b62ba483aa8ead05e572b5577b77) Add some missing items to help command list:
- [`c6d82c722`](https://github.com/ripple/rippled/commit/c6d82c722b0d2bc66ce9c40f0e0158ac84176b75) Configure build+test matrix for GitLab CI:
- [`0c20e2eb8`](https://github.com/ripple/rippled/commit/0c20e2eb8b33e45b35628ff0a721c609624c6719) Refine parseUrl regular expression (RIPD-1708):
- [`63eeb8d73`](https://github.com/ripple/rippled/commit/63eeb8d7342065098eb701659493eea87b303b84) Use recursive remove and clean for apt (OPS-508)
- [`5214b3c1b`](https://github.com/ripple/rippled/commit/5214b3c1b09749420ed0682a2e49fbbd759741e5) Set version to 1.3.0-b3
- [`5f7a61f04`](https://github.com/ripple/rippled/commit/5f7a61f040546057935fcf6222ebf0ba0609584f) Report a peer's public key and IP address in log messages (fixes #2675)
- [`c5a938de5`](https://github.com/ripple/rippled/commit/c5a938de551b24d5df505d4276120e480fb7d828) Disallow using the master key as the regular key:
- [`9372a587e`](https://github.com/ripple/rippled/commit/9372a587e431293e491a2ec1939e4e6ce9cd65e1) Request RocksDB PORTABLE build option
- [`948e724df`](https://github.com/ripple/rippled/commit/948e724dff5e05d1168de47296a0af3d3c37e4c5) Improvements to pkg CI pipeline:
- [`06faf2bd5`](https://github.com/ripple/rippled/commit/06faf2bd5b58ad0f6f5e1ec3d7127b439aab5fe5) Improve exit and test failure handling in CI
- [`1dd81c04f`](https://github.com/ripple/rippled/commit/1dd81c04f33436dbf823dfc764c727a06023ba75) Improve jemalloc build config:
- [`56dbf70c3`](https://github.com/ripple/rippled/commit/56dbf70c3c43c2b50091da76c3578430266991cc) Improve windows build README
- [`f8a4ac6ad`](https://github.com/ripple/rippled/commit/f8a4ac6ad7db5824941e5d710c19fc55aab977d5) Use optimized OpenSSL implementations when possible
- [`61bd06177`](https://github.com/ripple/rippled/commit/61bd06177ffe425184f4a3514094555817944cdb) Reserve memory before inserting into a flat set
- [`80e535a13`](https://github.com/ripple/rippled/commit/80e535a13c8d988fd8fa438e7ea038540a6c0fb5) Arguments passed to jtx Env::operator() must be invocable:
- [`64b55c0f8`](https://github.com/ripple/rippled/commit/64b55c0f888d6be1e07849563f567f80c487e003) Rename JsonFields.h to jss.h:
- [`afcc4ff29`](https://github.com/ripple/rippled/commit/afcc4ff296546fb59775bae4a6b3ee64cd6b9472) Reduce likelihood of malformed SOTemplate:
- [`57fe197d3`](https://github.com/ripple/rippled/commit/57fe197d3ee63793cbc078bdb444a0a857f7ab04) Remove runtime inference of unrecognized SFields
- [`9279a3fee`](https://github.com/ripple/rippled/commit/9279a3fee7747deb3c41ef37735d6d0b73cae1db) Refactor SField construction:
- [`b6363289b`](https://github.com/ripple/rippled/commit/b6363289bfb57a6674d7d37e7b3790bdf414303d) Use Json::StaticString for field names
- [`8c1123edc`](https://github.com/ripple/rippled/commit/8c1123edc6206c54e6092dbfd78a1e5eb49ca6d8) Merge master (1.2.4) into develop (1.3.0-b2)
- [`fa5785947`](https://github.com/ripple/rippled/commit/fa57859477441b60914e6239382c6fba286a0c26) Set version to 1.3.0-b2
- [`88cb0e592`](https://github.com/ripple/rippled/commit/88cb0e5928510d684a894ddf8a4ccc379c09d8fe) Allow manifests to include an optional 'domain' field:
- [`e239eed6d`](https://github.com/ripple/rippled/commit/e239eed6de4e9f557558b0eb8933e5bb6872b24f) Remove obsolete code
- [`504b3441d`](https://github.com/ripple/rippled/commit/504b3441ddd87da6f612ba066a105d52bb650580) Apply resource limits to proxied clients:
- [`872478d96`](https://github.com/ripple/rippled/commit/872478d96502f708bd8893d8acf4b61e592a1c7a) Construct ErrorCodes lookup table at compile time
- [`185f2baf7`](https://github.com/ripple/rippled/commit/185f2baf76e5971ccfe6fbce8de44c3f934ab995) Remove unused RPC error codes:
- [`36d675894`](https://github.com/ripple/rippled/commit/36d6758945954fab757b024b2afc8c3a5ad76919) Disallow both single- and multi-signing in RPC (RIPD-1713):
- [`d8c450d27`](https://github.com/ripple/rippled/commit/d8c450d272c8aa41401416c449639dbeff3aa5bb) Remove incorrectly defaulted functions:
- [`8ef5b9bab`](https://github.com/ripple/rippled/commit/8ef5b9bab4c21c23a644add2a8c94b64bc16e600) Make LedgerTrie remove work for truncated history
- [`e6370a648`](https://github.com/ripple/rippled/commit/e6370a6482e5888e79f9528943fbb41952cdc44b) Add dpkg/rpm building capability:
- [`b2170d016`](https://github.com/ripple/rippled/commit/b2170d016a7ece31ca6b12228b2fac9929f11d6c) Update travis dist/tools
- [`5c124f11c`](https://github.com/ripple/rippled/commit/5c124f11c259f19346d2949a2f6dd32b558eb639) Remove the 'rocksdb' subtree
- [`2aed24a55`](https://github.com/ripple/rippled/commit/2aed24a5525b6634a94c2c182c633f59a3c9d734) Build RocksDB by ExternalProject
- [`296469f5f`](https://github.com/ripple/rippled/commit/296469f5fe768b111ae991f54130bd58cdfa91a4) Reduce memory allocations for RCLCensorshipDetector
- [`08371ba2c`](https://github.com/ripple/rippled/commit/08371ba2c4b55541fc8764b75131660632b43876) Improve shard downloader status reporting
- [`56bc2a2ad`](https://github.com/ripple/rippled/commit/56bc2a2adebdee58be61cdaeeb2f8e806eedfc71) Improve SSLHTTPDownloader:
- [`1084dc6dd`](https://github.com/ripple/rippled/commit/1084dc6dd3cb51062632327559aa5c8ce5bc19dc) Set version to 1.3.0-b1
- [`8023caaa9`](https://github.com/ripple/rippled/commit/8023caaa9742bd32eb18e2b28cdc7849793f298f) Correct example configuration file:
- [`8b9746628`](https://github.com/ripple/rippled/commit/8b97466285255e1da55a2196af5b3b6cd60db6a3) Always use UTC to be timezone-neutral (RIPD-1659)
- [`de1d10253`](https://github.com/ripple/rippled/commit/de1d1025353a41ad8375574b23d3820527705c1e) Allow build to support XCode 10.2
- [`1e1e8c254`](https://github.com/ripple/rippled/commit/1e1e8c2547a322b8d425f1f982f384374d1953d4) Remove assert that accesses object post-dtor (RIPD-1704)
- [`aa49be65a`](https://github.com/ripple/rippled/commit/aa49be65a12685041b5c235a4c8f1bba6924ae54) Remove conditional check for feature introduced in 0.28.1-b7
- [`cd820b377`](https://github.com/ripple/rippled/commit/cd820b37779cf2cf5559f1b6087ca65999822c84) Improve the server's PING/PONG logic
- [`8d59ed5b2`](https://github.com/ripple/rippled/commit/8d59ed5b2aefd443d68b862893b865b33223fca7) Remove STValidation::isValid overload
- [`e03efdbe0`](https://github.com/ripple/rippled/commit/e03efdbe0b50522f8fb5e318c8601f070cfa4a26) Remove use of beast's detail::sec_ws_key_type
- [`4f52c2989`](https://github.com/ripple/rippled/commit/4f52c2989c88242d72f1ef439f91aa6df8ac1701) Remove use of beast::detail::is_invocable trait
- [`3fb13233a`](https://github.com/ripple/rippled/commit/3fb13233a985121a122d8ef96ac834737c1a2caf) Provide patch for FindBoost and apply it
- [`9695fd44b`](https://github.com/ripple/rippled/commit/9695fd44bae802e6ad9a6f9a2011e4693e2e5ac4) Support boost 1.69
- [`1bb32134f`](https://github.com/ripple/rippled/commit/1bb32134f881846bba9b032837c680ad7a036f2d) Remove censorshipMaxWarnings

## Contributions

### GitHub
[![GitHub: Stars](https://img.shields.io/github/stars/ripple/rippled.svg)](https://img.shields.io/github/stars/ripple/rippled.svg)
[![GitHub: Watchers](https://img.shields.io/github/watchers/ripple/rippled.svg)](https://img.shields.io/github/watchers/ripple/rippled.svg)

The public git repository for `rippled` is hosted on GitHub at <https://github.com/ripple/rippled>.

We welcome contributions, big and small, and invite everyone to join the community
of XRP Ledger developers and help us build the Internet of Value.

### Credits
The following people contributed directly to this release:

- [Crypto Brad Garlinghouse](https://github.com/cryptobrad) (cryptobradgarlinghouse@protonmail.com)
- [Ethan MacBrough](https://github.com/ChronusZ) (chronuszed@gmail.com)
- [Edward Hennis](https://github.com/ximinez) (ed@ripple.com)
- [Elliot Lee](https://github.com/intelliot) (github.public@intelliot.com)
- [Howard Hinnant](https://github.com/HowardHinnant) (howard.hinnant@gmail.com)
- [invalidator](https://github.com/invalidator) (9765843+invalidator@users.noreply.github.com)
- [James Fryman](https://github.com/jfryman) (jfryman@ripple.com)
- [Jesper Wallin](https://github.com/zelest) (jesper@ifconfig.se)
- [Joseph Busch](https://github.com/jwbusch) (jbusch@ripple.com)
- [David Scwhartz](https://github.com/JoelKatz) (DavidJoelSchwartz@GMail.com)
- [John Freeman](https://github.com/thejohnfreeman) (jfreeman08@gmail.com)
- Lazaridis (49013958+lazaridiscom@users.noreply.github.com)
- [Manoj Doshi](https://github.com/manojsdoshi) (manoj.s.doshi@gmail.com, mdoshi@ripple.com)
- [Mark Travis](https://github.com/mtrippled) (mtravis@ripple.com)
- [Miguel Portilla](https://github.com/miguelportilla) (miguelportilla@pobros.com)
- [Mike Ellery](https://github.com/mellery451) (mellery451@gmail.com)
- [Mo Morsi](https://github.com/movitto) (mo@morsi.org)
- [Nik Bougalis](https://github.com/nbougalis) (nikb@bougalis.net)
- [Scott Schurr](https://github.com/scottschurr) (scott@ripple.com)
- [Scott Determan](https://github.com/seelabs) (scott.determan@yahoo.com)
