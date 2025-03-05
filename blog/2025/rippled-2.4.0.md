---
category: 2025
date: 2025-03-05
seo:
    title: Introducing XRP Ledger version 2.4.0
    description: rippled version 2.4.0 is now available. This version introduces new features and stability fixes.
labels:
    - rippled Release Notes
markdown:
    editPage:
        hide: true
---
# Introducing XRP Ledger version 2.4.0

Version 2.4.0 of `rippled`, the reference server implementation of the XRP Ledger protocol, is now available. This release adds new features and bug fixes, and introduces these amendments:

- `PermissionedDomains`
- `DeepFreeze`
- `DynamicNFT`
- `fixFrozenLPTokenTransfer`
- `fixInvalidTxFlags`


## Notable Updates: New Public Key Provided by the new XRPL Foundation

Following the recent announcement regarding the [move to the new XRPL Foundation](./move-to-the-new-xrpl-foundation-commences.md), the XRPL Foundation members have been working diligently to facilitate a smooth transition of the Unique Node List (UNL) from the old XRPL Foundation to the new XRPL Foundation.

There are two key goals driving this transition:
- Ensure continued network participation and avoid potential downtime.
- Allow for a staged migration with minimal impact on validators and node operators.

Keeping these goals in mind, a new subdomain, **unl.xrplf.org**, has been introduced alongside the existing https://vl.xrplf.org/. This approach allows for a staged migration without modifying the key for the current UNL list. Eventually, vl.xrplf.org will be fully deprecated and replaced by unl.xrplf.org.

In `rippled` release 2.4.0, the validators-example.txt has been updated to include the new public key published by the new XRPL Foundation.

Further information on the transition will be shared by the XRPL Foundation in the near future.


## Action Required

If you run an XRP Ledger server, upgrade to version 2.4.0 as soon as possible to ensure service continuity.

Additionally, new amendments are now open for voting according to the XRP Ledger's [amendment process](../../docs/concepts/networks-and-servers/amendments.md), which enables protocol changes following two weeks of >80% support from trusted validators. The exact time that protocol changes take effect depends on the voting decisions of the decentralized network.

## Install / Upgrade

**TODO: Update package and SHA-256**

On supported platforms, see the [instructions on installing or updating `rippled`](../../docs/infrastructure/installation/index.md).

| Package | SHA-256 |
|:--------|:--------|
| [RPM for Red Hat / CentOS (x86-64)](https://repos.ripple.com/repos/rippled-rpm/stable/rippled-2.3.0-1.el7.x86_64.rpm) | `fb74f401e5ba121bbc37e6188aa064488ad78ffef549a1e19bc8b71316d08031` |
| [DEB for Ubuntu / Debian (x86-64)](https://repos.ripple.com/repos/rippled-deb/pool/stable/rippled_2.3.0-1_amd64.deb) | `5d616d53218b47a2f0803c1d37d410f72d19b57cdb9cabdf77b1cf0134cce3ca` |
| [Portable Builds (Linux x86-64)](https://github.com/XRPLF/rippled-portable-builds) | (Use signature verification) |

For other platforms, please [build from source](https://github.com/XRPLF/rippled/blob/master/BUILD.md). The most recent commit in the git log should be the change setting the version:

```text
commit f64cf9187affd69650907d0d92e097eb29693945
Author: Elliot Lee <github.public@intelliot.com>
Date:   Mon Nov 25 12:27:17 2024 -0800

    Set version to 2.3.0
```


## Full Changelog

### Amendments

The following amendments are open for voting with this release:


- **XLS-46 DynamicNFT** - Adds the ability to update the URI of `NFToken` objects. ([#5048](https://github.com/XRPLF/rippled/pull/5048))
- **XLS-80 Permissioned Domains** - Adds Permissioned Domains, which act as part of broader systems on the XRP Ledger to restrict access to satisfy compliance rules. ([#5161](https://github.com/XRPLF/rippled/pull/5161))
- **XLS-77 Deep Freeze** - Adds the ability to deep freeze trust lines, enabling token issuers to block the transfer of assets for holders who have been deep frozen. ([#5187](https://github.com/XRPLF/rippled/pull/5187))
- **fixFrozenLPTokenTransfer** - Prohibits the transfer of LP tokens when the associated liquidity pool contains at least one frozen asset. ([#5227](https://github.com/XRPLF/rippled/pull/5227))
- **fixInvalidTxFlags** - Adds transaction flag checking for `CredentialCreate`, `CredentialAccept`, and `CredentialDelete` transactions. ([#5250](https://github.com/XRPLF/rippled/pull/5250))


### New Features

- Added a new `simulate` API method to execute dry runs of transactions and see the simulated metadata. ([#5069](https://github.com/XRPLF/rippled/pull/5069), [#5265](https://github.com/XRPLF/rippled/pull/5265))
- Added the ability to specify MPTs when defining assets in transactions. ([#5200](https://github.com/XRPLF/rippled/pull/5200))
- Refactored `LedgerEntry.cpp` to make it easier to read. Also added a `state` alias for `ripple_state` in the `ledger_entry` API method. ([#5199](https://github.com/XRPLF/rippled/pull/5199))
- Improved UNL security by enabling validators to set a minimum number of UNL publishers to agree on validators. ([#5112](https://github.com/XRPLF/rippled/pull/5112))
- Updated the XRPL Foundation UNL keys. ([#5289](https://github.com/XRPLF/rippled/pull/5289))
- Added a new XRPL Foundation subdomain to enable a staged migration without modifying the key for the current UNL list. ([#5326](https://github.com/XRPLF/rippled/pull/5326))
- Added support to filter ledger entry types by their canonical names in the `ledger`, `ledger_data`, and `account_objects` API methods. ([#5271](https://github.com/XRPLF/rippled/pull/5271))
- Added detailed logging for each validation and proposal received from the network. ([#5291](https://github.com/XRPLF/rippled/pull/5291))
- Improved git commit hash lookups when checking the version of a `rippled` debug build. Also added git commit hash info when using the `server_info` API method on an admin connection. ([#5225](https://github.com/XRPLF/rippled/pull/5225))


### Bug fixes

- Fixed an issue with overlapping data types in the `Expected` class. ([#5218](https://github.com/XRPLF/rippled/pull/5218))
- Fixed an issue that prevented `rippled` from building on Windows with VS2022. ([#5197](https://github.com/XRPLF/rippled/pull/5197))
- Fixed `server_definitions` prefixes. ([#5231](https://github.com/XRPLF/rippled/pull/5231))
- Added missing dependency installations for generic MasOS runners. ([#5233](https://github.com/XRPLF/rippled/pull/5233))
- Updated deprecated Github actions. ([#5241](https://github.com/XRPLF/rippled/pull/5241))
- Fixed a failing assert scenario when submitting the `connect` admin RPC. ([#5235](https://github.com/XRPLF/rippled/pull/5235))
- Fixed the levelization script to ignore single-line comments during dependency analysis. ([#5194](https://github.com/XRPLF/rippled/pull/5194))
- Fixed the assert name used in `PermissionedDomainDelete`. ([#5245](https://github.com/XRPLF/rippled/pull/5245))
- Fixed MacOS unit tests. ([#5196](https://github.com/XRPLF/rippled/pull/5196))
- Fixed an issue with validators not accurately reflecting amendment votes. Also added debug logging of amendment votes. ([#5173](https://github.com/XRPLF/rippled/pull/5173), [#5312](https://github.com/XRPLF/rippled/pull/5312))
- Fixed a potential issue with double-charging fees. ([#5269](https://github.com/XRPLF/rippled/pull/5269))
- Removed the `new parent hash` assert and replaced it with a log message. ([#5313](https://github.com/XRPLF/rippled/pull/5313))
- Fixed an issue that prevented previously-failed inbound ledgers to not be acquired if a new trusted proposal arrived. ([#5318](https://github.com/XRPLF/rippled/pull/5318))


### Other Improvements

- Added unit tests for `AccountID` handling. ([#5174](https://github.com/XRPLF/rippled/pull/5174))
- Added enforced levelization in `libxrpl` with CMake. ([#5199](https://github.com/XRPLF/rippled/pull/5111))
- Updated `libxrpl` and all submodules to use the same compiler options. ([#5228](https://github.com/XRPLF/rippled/pull/5228))
- Added Antithesis instrumentation. ([#5042](https://github.com/XRPLF/rippled/pull/5042), [#5213](https://github.com/XRPLF/rippled/pull/5213))
- Added `rpcName` to the `LEDGER_ENTRY` macro to help prevent future bugs. ([#5202](https://github.com/XRPLF/rippled/pull/5202))
- Updated the contribution guidelines to introduce a new workflow that avoids code freezes. Also added scripts that can be used by maintainers in branch management, and a CI job to check that code is consistent across the three main branches: `master`, `release`, and `develop`. ([#5215](https://github.com/XRPLF/rippled/pull/5215))
- Added unit tests to check for caching issues fixed in `rippled 2.3.0`. ([#5242](https://github.com/XRPLF/rippled/pull/5242))
- Cleaned up the API changelog. ([#5207](https://github.com/XRPLF/rippled/pull/5207))
- Improved logs readability. ([#5251](https://github.com/XRPLF/rippled/pull/5251))
- Updated Visual Studio CI to VS 2022, and added VS Debug builds. ([#5240](https://github.com/XRPLF/rippled/pull/5240))
- Updated the `secp256k1` library to version 0.6.0. ([#5254](https://github.com/XRPLF/rippled/pull/5254))
- Changed the `[port_peer]` parameter in `rippled` example config back to `51235`; also added the recommendation to use the default port of `2459` for new deployments. ([#5290](https://github.com/XRPLF/rippled/pull/5290), [#5299](https://github.com/XRPLF/rippled/pull/5299))
- Improved CI management. ([#5268](https://github.com/XRPLF/rippled/pull/5268))
- Updated the git commit message rules for contributors. ([#5283](https://github.com/XRPLF/rippled/pull/5283))
- Fixed unnecessary `setCurrentThreadName` calls. ([#5280](https://github.com/XRPLF/rippled/pull/5280))
- Added a check to prevent permissioned domains from being created in the event the Permissioned Domains amendement is enabled before the Credentials amendement. ([#5275](https://github.com/XRPLF/rippled/pull/5275))
- Updated Conan dependencies. ([#5256](https://github.com/XRPLF/rippled/pull/5256))
- Fixed minor typos in code comments. ([#5279](https://github.com/XRPLF/rippled/pull/5279))
- Fixed incorrect build instructions. ([#5274](https://github.com/XRPLF/rippled/pull/5274))
- Refactored `rotateWithLock()` to not hold a lock during callbacks. ([#5276](https://github.com/XRPLF/rippled/pull/5276))
- Cleaned up debug logging by combining multiple data points into a single message. ([#5302](https://github.com/XRPLF/rippled/pull/5302))
- Updated build flags to fix performance regressions. ([#5325](https://github.com/XRPLF/rippled/pull/5325))


## Credits

The following people contributed directly to this release:

- Aanchal Malhotra <amalhotra@ripple.com>
- Bart Thomee <11445373+bthomee@users.noreply.github.com>
- Bronek Kozicki <brok@incorrekt.com>
- code0xff <ian.jungyong.um@gmail.com>
- Darius Tumas <tokeiito@tokeiito.eu>
- David Fuelling <fuelling@ripple.com>
- Donovan Hide <donovanhide@gmail.com>
- Ed Hennis <ed@ripple.com>
- Elliot Lee <github.public@intelliot.com>
- Kenny Lei <klei@ripple.com>
- Mark Travis <7728157+mtrippled@users.noreply.github.com>
- Mayukha Vadari <mvadari@gmail.com>
- Michael Legleux <mlegleux@ripple.com>
- Oleksandr <115580134+oleks-rip@users.noreply.github.com>
- Qi Zhao <qzhao@ripple.com>
- Ramkumar Srirengaram Gunasegharan <rgunasegharan@ripple.com>
- Shae Wang <swang@ripple.com>
- Shawn Xie <shawnxie920@gmail.com>
- Sophia Xie <sxie@ripple.com>
- Vijay Khanna Raviraj <vraviraj@ripple.com>
- Vladislav Vysokikh <vvysokikh@gmail.com>


## Bug Bounties and Responsible Disclosures

We welcome reviews of the `rippled` code and urge researchers to responsibly disclose any issues they may find.

To report a bug, please send a detailed report to: <bugs@xrpl.org>
