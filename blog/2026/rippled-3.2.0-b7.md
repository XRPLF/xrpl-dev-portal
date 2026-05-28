---
category: 2026
date: "2026-05-27"
template: '../../@theme/templates/blogpost'
seo:
    title: Introducing XRP Ledger version 3.2.0-b7
    description: This beta release retires many old amendments, enables the fixCleanup3_2_0 amendment, and includes a wide range of refactors, bug fixes, and build improvements.
labels:
    - rippled Release Notes
markdown:
    editPage:
        hide: true
---
# Introducing XRP Ledger version 3.2.0-b7

Version 3.2.0-b7 of `rippled`, the reference server implementation of the XRP Ledger protocol, is now available. This beta release retires a large number of long-activated amendments and enables the `fixCleanup3_2_0` amendment, which bundles stabilization fixes. It also introduces sweeping refactors as part of the ongoing modularization and `rippled` → `xrpld` renaming effort, plus a broad set of bug fixes, build system improvements, and dependency updates.


## Action Required

If you run an XRP Ledger server, upgrade to version 3.2.0-b7 as soon as possible to ensure service continuity.


## Install / Upgrade

On supported platforms, see the [instructions on installing or updating `rippled`](../../docs/infrastructure/installation/index.md).

| Package | SHA-256 |
|:--------|:--------|
| [RPM for Red Hat / CentOS (x86-64)](https://repos.ripple.com/repos/rippled-rpm/stable/rippled-3.2.0-b7-1.el9.x86_64.rpm) | `TODO` |
| [DEB for Ubuntu / Debian (x86-64)](https://repos.ripple.com/repos/rippled-deb/pool/stable/rippled_3.2.0-b7-1_amd64.deb) | `TODO` |

For other platforms, please [build from source](https://github.com/XRPLF/rippled/blob/master/BUILD.md). The most recent commit in the git log should be the change setting the version:

```text
commit dfb9b8ed9a0ad04c1da00c9957fe3c7454930835
Author: Bart <bthomee@users.noreply.github.com>
Date:   Fri May 22 20:32:12 2026 +0100

    release: Bump version to 3.2.0-b7 (#7316)
```


## Full Changelog


### Amendments

- **CheckCashMakesTrustLine**: Retires the amendment, which has been activated for more than two years. ([#5974](https://github.com/XRPLF/rippled/pull/5974))
- **Checks**: Retires the amendment, which has been activated for more than two years. ([#6055](https://github.com/XRPLF/rippled/pull/6055))
- **CryptoConditionsSuite**: Retires the amendment, which has been activated for more than two years. ([#6036](https://github.com/XRPLF/rippled/pull/6036))
- **DeletableAccounts**: Retires the amendment, which has been activated for more than two years. ([#6056](https://github.com/XRPLF/rippled/pull/6056))
- **DepositAuth**, **DepositPreauth**: Retires both amendments, which have been activated for more than two years. ([#5978](https://github.com/XRPLF/rippled/pull/5978))
- **DisallowIncoming**: Retires the amendment, which has been activated for more than two years. ([#6045](https://github.com/XRPLF/rippled/pull/6045))
- **ExpandedSignerList**, **MultiSignReserve**: Retires both amendments, which have been activated for more than two years. ([#5981](https://github.com/XRPLF/rippled/pull/5981))
- **fix1513**: Retires the amendment, which has been activated for more than two years. ([#5919](https://github.com/XRPLF/rippled/pull/5919))
- **fix1515**: Retires the amendment, which has been activated for more than two years. ([#5920](https://github.com/XRPLF/rippled/pull/5920))
- **fix1543**: Retires the amendment, which has been activated for more than two years. ([#5926](https://github.com/XRPLF/rippled/pull/5926))
- **fix1571**: Retires the amendment, which has been activated for more than two years. ([#5925](https://github.com/XRPLF/rippled/pull/5925))
- **fix1578**: Retires the amendment, which has been activated for more than two years. ([#5927](https://github.com/XRPLF/rippled/pull/5927))
- **fix1623**: Retires the amendment, which has been activated for more than two years. ([#5928](https://github.com/XRPLF/rippled/pull/5928))
- **fix1781**: Retires the amendment, which has been activated for more than two years. ([#5931](https://github.com/XRPLF/rippled/pull/5931))
- **fixAmendmentMajorityCalc**: Retires the amendment, which has been activated for more than two years. ([#5961](https://github.com/XRPLF/rippled/pull/5961))
- **fixCheckThreading**: Retires the amendment, which has been activated for more than two years. ([#5957](https://github.com/XRPLF/rippled/pull/5957))
- **fixMasterKeyAsRegularKey**: Retires the amendment, which has been activated for more than two years. ([#5959](https://github.com/XRPLF/rippled/pull/5959))
- **fixPayChanRecipientOwnerDir**: Retires the amendment, which has been activated for more than two years. ([#5946](https://github.com/XRPLF/rippled/pull/5946))
- **fixQualityUpperBound**: Retires the amendment, which has been activated for more than two years. ([#5960](https://github.com/XRPLF/rippled/pull/5960))
- **fixReducedOffersV1**: Retires the amendment, which has been activated for more than two years. ([#5972](https://github.com/XRPLF/rippled/pull/5972))
- **fixRmSmallIncreasedQOffers**: Retires the amendment, which has been activated for more than two years. ([#5955](https://github.com/XRPLF/rippled/pull/5955))
- **fixSTAmountCanonicalize**: Retires the amendment, which has been activated for more than two years. ([#5956](https://github.com/XRPLF/rippled/pull/5956))
- **fixTakerDryOfferRemoval**: Retires the amendment, which has been activated for more than two years. ([#5958](https://github.com/XRPLF/rippled/pull/5958))
- **fixTrustLinesToSelf**: Retires the amendment, which has been activated for more than two years. ([#5989](https://github.com/XRPLF/rippled/pull/5989))
- **Flow**, **FlowSortStrands**: Retires both amendments, which have been activated for more than two years. ([#6054](https://github.com/XRPLF/rippled/pull/6054))
- **HardenedValidations**: Retires the amendment, which has been activated for more than two years. ([#5988](https://github.com/XRPLF/rippled/pull/5988))
- **ImmediateOfferKilled**: Retires the amendment, which has been activated for more than two years. ([#5973](https://github.com/XRPLF/rippled/pull/5973))
- **NegativeUNL**: Retires the amendment, which has been activated for more than two years. ([#6033](https://github.com/XRPLF/rippled/pull/6033))
- **NonFungibleTokensV1**, **NonFungibleTokensV1_1**, **fixNFTokenDirV1**, **fixNFTokenNegOffer**, **fixNFTokenRemint**, **fixNonFungibleTokensV1_2**: Retires the older NFT amendments, all activated for more than two years. ([#5971](https://github.com/XRPLF/rippled/pull/5971))
- **RequireFullyCanonicalSig**: Retires the amendment, which has been activated for more than two years. ([#6035](https://github.com/XRPLF/rippled/pull/6035))
- **TicketBatch**: Retires the amendment, which has been activated for more than two years. ([#6032](https://github.com/XRPLF/rippled/pull/6032))


### Features

- Installed validator-keys as a CMake install target. ([#5841](https://github.com/XRPLF/rippled/pull/5841))
- Added configurable NuDB block size feature. ([#5468](https://github.com/XRPLF/rippled/pull/5468))
- Logged public key in addition to IP address. ([#5678](https://github.com/XRPLF/rippled/pull/5678))
- Added `ledger_entry` options for fee, amendments, NUNL, and hashes. ([#5644](https://github.com/XRPLF/rippled/pull/5644))
- Enforced feature name lengths and character set. ([#5555](https://github.com/XRPLF/rippled/pull/5555))
- Added Formats and Flags to `server_definitions`. ([#6321](https://github.com/XRPLF/rippled/pull/6321))
- Added a code generator for transactions and ledger entries. ([#6443](https://github.com/XRPLF/rippled/pull/6443))
- Added a mutex wrapper from Clio. ([#6447](https://github.com/XRPLF/rippled/pull/6447))
- Added GRPC TLS support. ([#6374](https://github.com/XRPLF/rippled/pull/6374))
- Added `--definitions` flag and artifact. ([#6858](https://github.com/XRPLF/rippled/pull/6858))


### Bug Fixes

- Fixed the `xrpld` symlink that was renamed incorrectly. ([#6012](https://github.com/XRPLF/rippled/pull/6012))
- Removed cryptographic libs from libxrpl Conan package. ([#6163](https://github.com/XRPLF/rippled/pull/6163))
- Incremented sequence when accepting new manifests. ([#6059](https://github.com/XRPLF/rippled/pull/6059))
- Stopped the embedded tests hanging forever on ARM by fixing the memory ordering issue. ([#6248](https://github.com/XRPLF/rippled/pull/6248))
- Restored config changes that broke standalone mode. ([#6301](https://github.com/XRPLF/rippled/pull/6301))
- Removed unneeded import and fixed log statement. ([#6532](https://github.com/XRPLF/rippled/pull/6532))
- Marked SAV and Lending transactions as `NotDelegable`. ([#6489](https://github.com/XRPLF/rippled/pull/6489))
- Removed a newline from logging statement in `changeSpotPrice` calculation. ([#6547](https://github.com/XRPLF/rippled/pull/6547))
- Fixed memory leaks in HTTPClient. ([#6370](https://github.com/XRPLF/rippled/pull/6370))
- Switched to `boost::coroutine2`. ([#6372](https://github.com/XRPLF/rippled/pull/6372))
- Removed nonexistent `boost::coroutine2` library reference. ([#6561](https://github.com/XRPLF/rippled/pull/6561))
- Disallowed empty permission list when Delegate object is absent. ([#6542](https://github.com/XRPLF/rippled/pull/6542))
- Removed superfluous view update from credentials. ([#6545](https://github.com/XRPLF/rippled/pull/6545))
- Decoupled reserve from fee in delegate payment. ([#6568](https://github.com/XRPLF/rippled/pull/6568))
- Backported Permissioned Domains fixes. ([#7016](https://github.com/XRPLF/rippled/pull/7016))
- Used account ledger entry when canceling token escrows. ([#6171](https://github.com/XRPLF/rippled/pull/6171))
- Changed variable signedness and correctly handled `std::optional`. ([#6657](https://github.com/XRPLF/rippled/pull/6657))
- Applied minor RPC fixes. ([#6730](https://github.com/XRPLF/rippled/pull/6730))
- Handled WSClient write failure when server closes WebSocket. ([#6671](https://github.com/XRPLF/rippled/pull/6671))
- Added description for `terLOCKED` error. ([#6811](https://github.com/XRPLF/rippled/pull/6811))
- Changed AMMClawback return code to `tecNO_PERMISSION` on AllowTrustLineClawback and NoFreeze check. ([#6946](https://github.com/XRPLF/rippled/pull/6946))
- Disallowed MPTClearRequireAuth if a domain is set. ([#6712](https://github.com/XRPLF/rippled/pull/6712))
- Made assorted Payments fixes. ([#6585](https://github.com/XRPLF/rippled/pull/6585))
- Made assorted RPC fixes. ([#6529](https://github.com/XRPLF/rippled/pull/6529))
- Fixed `Workers::stop()` race between `m_allPaused` and `m_runningTaskCount`. ([#6574](https://github.com/XRPLF/rippled/pull/6574))
- Fixed previous ledger size typo in RCLConsensus. ([#6696](https://github.com/XRPLF/rippled/pull/6696))
- Guarded `Coro::resume()` against completed coroutines. ([#6608](https://github.com/XRPLF/rippled/pull/6608))
- Fixed ubsan flagged issues. ([#6151](https://github.com/XRPLF/rippled/pull/6151))
- Numerically-stable `(1+r)^n-1` in `computePaymentFactor`. ([#7033](https://github.com/XRPLF/rippled/pull/7033))
- Prevented stale AuthAccounts from persisting after `tfTwoAssetIfEmpty` re-initialization. ([#6996](https://github.com/XRPLF/rippled/pull/6996))
- Fixed regressions in `server_definitions`. ([#7008](https://github.com/XRPLF/rippled/pull/7008))
- Set default peering port to 2459. ([#6848](https://github.com/XRPLF/rippled/pull/6848))
- Fixed multisign and signfor to check for delegate. ([#7064](https://github.com/XRPLF/rippled/pull/7064))
- Added a missing null check after `txRead()` in `iteratePriceData()`. ([#7305](https://github.com/XRPLF/rippled/pull/7305))
- Reverted graceful peer disconnection and follow-up fix. ([#7296](https://github.com/XRPLF/rippled/pull/7296))
- Added assorted MPT/DEX fixes. ([#7040](https://github.com/XRPLF/rippled/pull/7040))
- Checked if the MPT first loss cover can be sent to the broker before deleting the broker. ([#7125](https://github.com/XRPLF/rippled/pull/7125))
- Stored `Delegate` object in delegating and authorized account directories for proper deletion. ([#6681](https://github.com/XRPLF/rippled/pull/6681))


### Refactors

- Replaced `fee().accountReserve(0)` with `fee().reserve`. ([#5843](https://github.com/XRPLF/rippled/pull/5843))
- Refactored signature autofilling for Simulate RPC. ([#5852](https://github.com/XRPLF/rippled/pull/5852))
- Moved `server_definitions` code to its own files. ([#5890](https://github.com/XRPLF/rippled/pull/5890))
- Cleaned up `TxMeta`. ([#5845](https://github.com/XRPLF/rippled/pull/5845))
- Modularised shamap and nodestore. ([#5668](https://github.com/XRPLF/rippled/pull/5668))
- Moved API functions from `RPCHelpers.h` to `ApiVersion.h`. ([#5889](https://github.com/XRPLF/rippled/pull/5889))
- Renamed `RIPPLE_` and `RIPPLED_` definitions to `XRPL_`. ([#5821](https://github.com/XRPLF/rippled/pull/5821))
- Removed unnecessary copyright notices already covered by LICENSE.md. ([#5929](https://github.com/XRPLF/rippled/pull/5929))
- Renamed cmake files and definitions. ([#5975](https://github.com/XRPLF/rippled/pull/5975))
- Split up `RPCHelpers.h` into two. ([#6047](https://github.com/XRPLF/rippled/pull/6047))
- Cleaned up `RPCHelpers`. ([#5684](https://github.com/XRPLF/rippled/pull/5684))
- Renamed `LedgerInfo` to `LedgerHeader`. ([#6136](https://github.com/XRPLF/rippled/pull/6136))
- Renamed `info()` to `header()`. ([#6138](https://github.com/XRPLF/rippled/pull/6138))
- Renamed `rippled` binary to `xrpld`. ([#5983](https://github.com/XRPLF/rippled/pull/5983))
- Moved JobQueue and related classes into xrpl.core module. ([#6121](https://github.com/XRPLF/rippled/pull/6121))
- Renamed `ripple` namespace to `xrpl`. ([#5982](https://github.com/XRPLF/rippled/pull/5982))
- Removed `Json::Object` and related files/classes. ([#5894](https://github.com/XRPLF/rippled/pull/5894))
- Renamed `rippled.cfg` to `xrpld.cfg`. ([#6098](https://github.com/XRPLF/rippled/pull/6098))
- Fixed typos in comments and set up cspell. ([#6164](https://github.com/XRPLF/rippled/pull/6164))
- Fixed spelling issues in private/local variables and functions. ([#6182](https://github.com/XRPLF/rippled/pull/6182))
- Fixed spelling issues in all variables/functions. ([#6184](https://github.com/XRPLF/rippled/pull/6184))
- Removed unused credential signature hash prefix. ([#6186](https://github.com/XRPLF/rippled/pull/6186))
- Fixed lots of typos and added cspell settings. ([#5719](https://github.com/XRPLF/rippled/pull/5719))
- Cleaned up uses of `std::source_location`. ([#6272](https://github.com/XRPLF/rippled/pull/6272))
- Updated Boost to 1.90. ([#6280](https://github.com/XRPLF/rippled/pull/6280))
- Added ServiceRegistry to help migration. ([#6222](https://github.com/XRPLF/rippled/pull/6222))
- Replaced include guards with `#pragma once`. ([#6322](https://github.com/XRPLF/rippled/pull/6322))
- Removed unnecessary caches. ([#5439](https://github.com/XRPLF/rippled/pull/5439))
- Followed up on threads renaming. ([#6336](https://github.com/XRPLF/rippled/pull/6336))
- Modularised WalletDB and Manifest. ([#6223](https://github.com/XRPLF/rippled/pull/6223))
- Modularised RelationalDB. ([#6224](https://github.com/XRPLF/rippled/pull/6224))
- Modularised the NetworkOPs interface. ([#6225](https://github.com/XRPLF/rippled/pull/6225))
- Modularised HashRouter, Conditions, and OrderBookDB. ([#6226](https://github.com/XRPLF/rippled/pull/6226))
- Decoupled app/tx from Application and Config. ([#6227](https://github.com/XRPLF/rippled/pull/6227))
- Modularised app/tx. ([#6228](https://github.com/XRPLF/rippled/pull/6228))
- Explicitly trimmed the heap after cache sweeps. ([#6022](https://github.com/XRPLF/rippled/pull/6022))
- Used `uint256` directly as key instead of void pointer. ([#6313](https://github.com/XRPLF/rippled/pull/6313))
- Broke down InvariantCheck to multiple classes. ([#6440](https://github.com/XRPLF/rippled/pull/6440))
- Fixed clang-tidy `bugprone-empty-catch` check. ([#6419](https://github.com/XRPLF/rippled/pull/6419))
- Added Git information compile-time info to only one file. ([#6464](https://github.com/XRPLF/rippled/pull/6464))
- Updated transaction folder structure. ([#6483](https://github.com/XRPLF/rippled/pull/6483))
- Split combined transactor files into individual classes. ([#6495](https://github.com/XRPLF/rippled/pull/6495))
- Removed dead code in `CreateOffer`. ([#6541](https://github.com/XRPLF/rippled/pull/6541))
- Fixed typo in `freezeHandling` parameter name. ([#6543](https://github.com/XRPLF/rippled/pull/6543))
- Simplified set/get call to use existing variable. ([#6534](https://github.com/XRPLF/rippled/pull/6534))
- Deleted SecretKey compare op from library and moved it to tests module. ([#6503](https://github.com/XRPLF/rippled/pull/6503))
- Used `hasExpired` in `CancelCheck`. ([#6533](https://github.com/XRPLF/rippled/pull/6533))
- Renamed system name from 'ripple' to 'xrpld'. ([#6347](https://github.com/XRPLF/rippled/pull/6347))
- Added no-ASAN macro for Throw statements. ([#6373](https://github.com/XRPLF/rippled/pull/6373))
- Cleaned up `getFeePayer`, `mSourceBalance`, and `mPriorBalance`. ([#6478](https://github.com/XRPLF/rippled/pull/6478))
- Applied assorted small DID fixes. ([#6552](https://github.com/XRPLF/rippled/pull/6552))
- Removed dead code in escrow helper logic. ([#6553](https://github.com/XRPLF/rippled/pull/6553))
- Added const qualifier to SLE in `verifyDepositPreauth` parameter. ([#6555](https://github.com/XRPLF/rippled/pull/6555))
- Used ReadView instead of ApplyView in `authorizedDepositPreauth()`. ([#6560](https://github.com/XRPLF/rippled/pull/6560))
- Replaced `!=`/`==` `tesSuccess` with `isTesSuccess`. ([#6409](https://github.com/XRPLF/rippled/pull/6409))
- Renamed transactor files/classes to match the tx name. ([#6580](https://github.com/XRPLF/rippled/pull/6580))
- Addressed remaining issue after clang-tidy merge. ([#6582](https://github.com/XRPLF/rippled/pull/6582))
- Moved ledger entry helper functions from `View.h`/`View.cpp` to dedicated helper files. ([#6453](https://github.com/XRPLF/rippled/pull/6453))
- Improved imports to only call the needed helpers. ([#6624](https://github.com/XRPLF/rippled/pull/6624))
- Fixed more clang-tidy issues found after merging to develop. ([#6640](https://github.com/XRPLF/rippled/pull/6640))
- Removed unused/unreachable `transactor` code. ([#6612](https://github.com/XRPLF/rippled/pull/6612))
- Modularised ledger. ([#6536](https://github.com/XRPLF/rippled/pull/6536))
- Made function naming in ServiceRegistry consistent. ([#6390](https://github.com/XRPLF/rippled/pull/6390))
- Split LoanInvariant into LoanBrokerInvariant and LoanInvariant. ([#6674](https://github.com/XRPLF/rippled/pull/6674))
- Addressed PR comments after the modularisation PRs. ([#6389](https://github.com/XRPLF/rippled/pull/6389))
- Reorganized RPC handler files. ([#6628](https://github.com/XRPLF/rippled/pull/6628))
- Moved more helper files into `libxrpl/ledger/helpers`. ([#6731](https://github.com/XRPLF/rippled/pull/6731))
- Renamed non-functional uses of `ripple(d)` to `xrpl(d)`. ([#6676](https://github.com/XRPLF/rippled/pull/6676))
- Combined `AMMHelpers` and `AMMUtils`. ([#6733](https://github.com/XRPLF/rippled/pull/6733))
- Removed unused `notTooManyOffers` function from NFTokenUtils. ([#6737](https://github.com/XRPLF/rippled/pull/6737))
- Removed empty `Taker.h`. ([#6984](https://github.com/XRPLF/rippled/pull/6984))
- Added transaction-specific invariant checking. ([#6551](https://github.com/XRPLF/rippled/pull/6551))
- Fixed more clang-tidy issues. ([#6992](https://github.com/XRPLF/rippled/pull/6992))
- Removed seq from TMGetObjectByHash. ([#6976](https://github.com/XRPLF/rippled/pull/6976))
- Resolved remaining clang-tidy unchecked optionals. ([#6979](https://github.com/XRPLF/rippled/pull/6979))
- Cleaned up NetworkOPs. ([#6575](https://github.com/XRPLF/rippled/pull/6575))
- Addressed code review comments regarding `boost::coroutine2`. ([#6977](https://github.com/XRPLF/rippled/pull/6977))
- Reverted certain `Throw`s by `LogicError`s. ([#7036](https://github.com/XRPLF/rippled/pull/7036))
- Added IWYU pragma for `boost::optional` to fix clang-tidy. ([#7088](https://github.com/XRPLF/rippled/pull/7088))
- Applied more fixes for bad renames. ([#7092](https://github.com/XRPLF/rippled/pull/7092))
- Used more scoped enums. ([#7086](https://github.com/XRPLF/rippled/pull/7086))
- Used `isFlag` where possible instead of bitwise math. ([#7278](https://github.com/XRPLF/rippled/pull/7278))
- Renamed static constants. ([#7120](https://github.com/XRPLF/rippled/pull/7120))
- Cleaned up comments post-clang-tidy changes. ([#7283](https://github.com/XRPLF/rippled/pull/7283))
- Renamed `account_` to `accountID_`. ([#7284](https://github.com/XRPLF/rippled/pull/7284))
- Fixed `sfGeneric` and `sfInvalid` field names. ([#7300](https://github.com/XRPLF/rippled/pull/7300))
- Removed dead `fetchBatch` code. ([#7309](https://github.com/XRPLF/rippled/pull/7309))
- Updated default values of base and owner reserve to 1/0.2. ([#6382](https://github.com/XRPLF/rippled/pull/6382))
- Sorted retired amendments to reduce conflicts. ([#5966](https://github.com/XRPLF/rippled/pull/5966))
- Added `XRPL_RETIRE_FIX` and `XRPL_RETIRE_FEATURE`. ([#6014](https://github.com/XRPLF/rippled/pull/6014))
- Removed unnecessary clang-format off/on directives. ([#6682](https://github.com/XRPLF/rippled/pull/6682))


### Documentation

- Cleaned up misleading comments. ([#6031](https://github.com/XRPLF/rippled/pull/6031))
- Updated instructions on how to (re)generate the `conan.lock` file. ([#6070](https://github.com/XRPLF/rippled/pull/6070))
- Added XLS requirements to `CONTRIBUTING.md`. ([#6065](https://github.com/XRPLF/rippled/pull/6065))
- Inferred version of patched Conan dependency to export. ([#6112](https://github.com/XRPLF/rippled/pull/6112))
- Fixed docs README and cmake. ([#6122](https://github.com/XRPLF/rippled/pull/6122))
- Fixed some minor issues in the comments. ([#6194](https://github.com/XRPLF/rippled/pull/6194))
- Updated Ripple Bug Bounty public key. ([#6258](https://github.com/XRPLF/rippled/pull/6258))
- Updated API changelog and added APIv2+APIv3 version documentation. ([#6308](https://github.com/XRPLF/rippled/pull/6308))
- Fixed more minor issues in the comments. ([#6346](https://github.com/XRPLF/rippled/pull/6346))
- Improved documentation for InvariantCheck. ([#6518](https://github.com/XRPLF/rippled/pull/6518))
- Fixed minor issues in the comments. ([#6535](https://github.com/XRPLF/rippled/pull/6535))
- Added a comment explaining why `ammLPHolds` is called twice. ([#6546](https://github.com/XRPLF/rippled/pull/6546))
- Added a note about `clang-tidy` installation. ([#6634](https://github.com/XRPLF/rippled/pull/6634))
- Updated LICENSE.md year to present. ([#6636](https://github.com/XRPLF/rippled/pull/6636))
- Rewrote conan docs for custom recipes. ([#6647](https://github.com/XRPLF/rippled/pull/6647))
- Marked empty transactor invariants as future work. ([#7080](https://github.com/XRPLF/rippled/pull/7080))
- Updated bug bounty information. ([#7006](https://github.com/XRPLF/rippled/pull/7006))
- Updated hybrid offer invariant comment. ([#7007](https://github.com/XRPLF/rippled/pull/7007))
- Added explanatory comment to checkFee. ([#6631](https://github.com/XRPLF/rippled/pull/6631))
- Removed repetitive word in multiple files. ([#6978](https://github.com/XRPLF/rippled/pull/6978))
- Fixed some comments to improve readability. ([#7122](https://github.com/XRPLF/rippled/pull/7122))
- Added `--parallel` flag to cmake build commands in `BUILD.md`. ([#7302](https://github.com/XRPLF/rippled/pull/7302))


### Testing

- Added more tests for `ledger_entry` RPC. ([#5858](https://github.com/XRPLF/rippled/pull/5858))
- Removed `failed` string from vault test. ([#6214](https://github.com/XRPLF/rippled/pull/6214))
- Suppressed "parse failed" message in Batch tests. ([#6207](https://github.com/XRPLF/rippled/pull/6207))
- Fixed the `xrpl.net` unit test. ([#6241](https://github.com/XRPLF/rippled/pull/6241))
- Fixed typo in LendingHelpers unit-test. ([#6215](https://github.com/XRPLF/rippled/pull/6215))
- Added file/line to `Env`. ([#6276](https://github.com/XRPLF/rippled/pull/6276))
- Fixed spelling issues in tests. ([#6199](https://github.com/XRPLF/rippled/pull/6199))
- Improved stability of Subscribe tests. ([#6420](https://github.com/XRPLF/rippled/pull/6420))
- Fixed flaky subscribe tests. ([#6510](https://github.com/XRPLF/rippled/pull/6510))
- Removed testline JTX helper class. ([#6539](https://github.com/XRPLF/rippled/pull/6539))
- Fixed tests for clang-tidy `bugprone-unchecked-optional-access` check. ([#6502](https://github.com/XRPLF/rippled/pull/6502))
- Created new transaction testing framework `TxTest`. ([#6537](https://github.com/XRPLF/rippled/pull/6537))
- Fixed flaky CI tests. ([#7005](https://github.com/XRPLF/rippled/pull/7005))


### CI/Build

- Updated Conan dependencies: OpenSSL. ([#5873](https://github.com/XRPLF/rippled/pull/5873))
- Downgraded OpenSSL to 3.5.4. ([#5878](https://github.com/XRPLF/rippled/pull/5878))
- Removed version number in `find_dependency` for OpenSSL. ([#5985](https://github.com/XRPLF/rippled/pull/5985))
- Removed unnecessary creation of symlink in CMake install file. ([#6009](https://github.com/XRPLF/rippled/pull/6009))
- Updated RocksDB, SQLite, Doctest. ([#6015](https://github.com/XRPLF/rippled/pull/6015))
- Set version on develop to 3.1.0-b0. ([#5986](https://github.com/XRPLF/rippled/pull/5986))
- Updated nudb recipe to remove linker warnings. ([#6038](https://github.com/XRPLF/rippled/pull/6038))
- Updated lockfile. ([#6083](https://github.com/XRPLF/rippled/pull/6083))
- Made conan generate script a script. ([#6085](https://github.com/XRPLF/rippled/pull/6085))
- Added black pre-commit hook. ([#6086](https://github.com/XRPLF/rippled/pull/6086))
- Replaced `ed25519-donna` source with Conan package. ([#6088](https://github.com/XRPLF/rippled/pull/6088))
- Replaced `secp256k1` source with Conan package. ([#6089](https://github.com/XRPLF/rippled/pull/6089))
- Re-enabled linux and macos matrix. ([#6107](https://github.com/XRPLF/rippled/pull/6107))
- Updated Conan dependencies: protobuf and grpc. ([#5589](https://github.com/XRPLF/rippled/pull/5589))
- Used updated secp256k1 recipe. ([#6118](https://github.com/XRPLF/rippled/pull/6118))
- Cleaned up `.gitignore` and `.gitattributes`. ([#6001](https://github.com/XRPLF/rippled/pull/6001))
- Updated shared actions. ([#6147](https://github.com/XRPLF/rippled/pull/6147))
- Removed superfluous build directory creation. ([#6159](https://github.com/XRPLF/rippled/pull/6159))
- Pinned `ruamel.yaml<0.19` in pre-commit-hooks. ([#6166](https://github.com/XRPLF/rippled/pull/6166))
- Used ccache to cache build objects for speeding up building. ([#6104](https://github.com/XRPLF/rippled/pull/6104))
- Moved variable into right place. ([#6179](https://github.com/XRPLF/rippled/pull/6179))
- Used updated XRPLF workflow and action. ([#6188](https://github.com/XRPLF/rippled/pull/6188))
- Changed `/Zi` to `/Z7` for ccache and removed debug symbols in CI. ([#6198](https://github.com/XRPLF/rippled/pull/6198))
- Pinned pre-commit hooks to commit hashes. ([#6205](https://github.com/XRPLF/rippled/pull/6205))
- Removed unnecessary version number and options in cmake `find_package`. ([#6169](https://github.com/XRPLF/rippled/pull/6169))
- Updated actions/images to use cmake 4.2.1 and conan 2.24.0. ([#6209](https://github.com/XRPLF/rippled/pull/6209))
- Updated Conan lock file with changed OpenSSL recipe. ([#6211](https://github.com/XRPLF/rippled/pull/6211))
- Used gtest instead of doctest. ([#6216](https://github.com/XRPLF/rippled/pull/6216))
- Added sanitizers to CI builds. ([#5996](https://github.com/XRPLF/rippled/pull/5996))
- Removed 'master' branch as a trigger. ([#6234](https://github.com/XRPLF/rippled/pull/6234))
- Uploaded Conan recipe for merges into develop and commits to release. ([#6235](https://github.com/XRPLF/rippled/pull/6235))
- Added missing commit hash to Conan recipe version. ([#6256](https://github.com/XRPLF/rippled/pull/6256))
- Ran on-trigger and on-pr when generate-version is modified. ([#6257](https://github.com/XRPLF/rippled/pull/6257))
- Detected uninitialized variables in CMake files. ([#6247](https://github.com/XRPLF/rippled/pull/6247))
- Used plus instead of hyphen for Conan recipe version suffix. ([#6261](https://github.com/XRPLF/rippled/pull/6261))
- Explicitly set version when exporting the Conan recipe. ([#6264](https://github.com/XRPLF/rippled/pull/6264))
- Properly propagated Conan credentials. ([#6265](https://github.com/XRPLF/rippled/pull/6265))
- Passed missing sanitizers input to actions. ([#6266](https://github.com/XRPLF/rippled/pull/6266))
- Uploaded Conan recipes for develop, release candidates, and releases. ([#6286](https://github.com/XRPLF/rippled/pull/6286))
- Set ColumnLimit to 120 in clang-format. ([#6288](https://github.com/XRPLF/rippled/pull/6288))
- Removed unnecessary `boost::system` requirement from conanfile. ([#6290](https://github.com/XRPLF/rippled/pull/6290))
- Added cmake-format pre-commit hook. ([#6279](https://github.com/XRPLF/rippled/pull/6279))
- Formatted all cmake files without comments. ([#6294](https://github.com/XRPLF/rippled/pull/6294))
- Updated hashes of XRPLF/actions. ([#6316](https://github.com/XRPLF/rippled/pull/6316))
- Added upper-case match for ARM64. ([#6315](https://github.com/XRPLF/rippled/pull/6315))
- Added Zed IDE to `.gitignore`. ([#6317](https://github.com/XRPLF/rippled/pull/6317))
- Removed unity builds. ([#6300](https://github.com/XRPLF/rippled/pull/6300))
- Removed unnecessary script. ([#6326](https://github.com/XRPLF/rippled/pull/6326))
- Updated secp256k1 and openssl. ([#6327](https://github.com/XRPLF/rippled/pull/6327))
- Updated secp256k1 to 0.7.1. ([#6331](https://github.com/XRPLF/rippled/pull/6331))
- Restored unity builds. ([#6328](https://github.com/XRPLF/rippled/pull/6328))
- Removed `@xrplf/rpc-reviewers`. ([#6337](https://github.com/XRPLF/rippled/pull/6337))
- Fixed `gcov` lib coverage build failure on macOS. ([#6350](https://github.com/XRPLF/rippled/pull/6350))
- Updated clang-format to 21.1.8. ([#6352](https://github.com/XRPLF/rippled/pull/6352))
- Added clang-tidy to CI. ([#6369](https://github.com/XRPLF/rippled/pull/6369))
- Set cmake-format width to 100. ([#6386](https://github.com/XRPLF/rippled/pull/6386))
- Set clang-format width to 100. ([#6387](https://github.com/XRPLF/rippled/pull/6387))
- Added dependabot config. ([#6379](https://github.com/XRPLF/rippled/pull/6379))
- Built docs in PRs and in private repos. ([#6400](https://github.com/XRPLF/rippled/pull/6400))
- Bumped `codecov/codecov-action` from 5.4.3 to 5.5.2. ([#6398](https://github.com/XRPLF/rippled/pull/6398))
- Bumped `tj-actions/changed-files` from 46.0.5 to 47.0.4. ([#6394](https://github.com/XRPLF/rippled/pull/6394))
- Bumped `actions/setup-python` from 5.6.0 to 6.2.0. ([#6395](https://github.com/XRPLF/rippled/pull/6395))
- Bumped `actions/checkout` from 4.3.0 to 6.0.2. ([#6397](https://github.com/XRPLF/rippled/pull/6397))
- Bumped `actions/upload-artifact` from 4.6.2 to 6.0.0. ([#6396](https://github.com/XRPLF/rippled/pull/6396))
- Added nix development environment. ([#6314](https://github.com/XRPLF/rippled/pull/6314))
- Updated cleanup-workspace to delete old `.conan2` dir on macOS. ([#6412](https://github.com/XRPLF/rippled/pull/6412))
- Enabled clang-tidy checks without issues. ([#6414](https://github.com/XRPLF/rippled/pull/6414))
- Grepped for failures in CI. ([#6339](https://github.com/XRPLF/rippled/pull/6339))
- Made nix hook optional. ([#6431](https://github.com/XRPLF/rippled/pull/6431))
- Bumped `actions/upload-artifact` from 6.0.0 to 7.0.0. ([#6450](https://github.com/XRPLF/rippled/pull/6450))
- Updated pre-commit hooks. ([#6460](https://github.com/XRPLF/rippled/pull/6460))
- Enabled clang-tidy `bugprone-move-forwarding-reference` check. ([#6457](https://github.com/XRPLF/rippled/pull/6457))
- Enabled clang-tidy `bugprone-return-const-ref-from-parameter` check. ([#6459](https://github.com/XRPLF/rippled/pull/6459))
- Enabled clang-tidy `bugprone-sizeof-expression` check. ([#6466](https://github.com/XRPLF/rippled/pull/6466))
- Stopped committing generated docs to prevent repo bloat. ([#6474](https://github.com/XRPLF/rippled/pull/6474))
- Fixed docs deployment for pull requests. ([#6482](https://github.com/XRPLF/rippled/pull/6482))
- Used `gersemi` instead of ancient cmake-format. ([#6486](https://github.com/XRPLF/rippled/pull/6486))
- Added custom cmake definitions for gersemi. ([#6491](https://github.com/XRPLF/rippled/pull/6491))
- Bumped `tj-actions/changed-files` from 47.0.4 to 47.0.5. ([#6501](https://github.com/XRPLF/rippled/pull/6501))
- Enabled clang-tidy `bugprone-unused-local-non-trivial-variable` check. ([#6458](https://github.com/XRPLF/rippled/pull/6458))
- Enabled clang-tidy `bugprone-suspicious-missing-comma` check. ([#6468](https://github.com/XRPLF/rippled/pull/6468))
- Used check-pr-title from XRPLF/actions. ([#6506](https://github.com/XRPLF/rippled/pull/6506))
- Fixed clang-tidy issues from merging `unused-local-non-trivial-variable`. ([#6509](https://github.com/XRPLF/rippled/pull/6509))
- Enabled clang-tidy `bugprone-pointer-arithmetic-on-polymorphic-object` check. ([#6469](https://github.com/XRPLF/rippled/pull/6469))
- Updated XRPLF/actions. ([#6508](https://github.com/XRPLF/rippled/pull/6508))
- Enabled clang-tidy `bugprone-suspicious-stringview-data-usage` check. ([#6467](https://github.com/XRPLF/rippled/pull/6467))
- Enabled clang-tidy `bugprone-too-small-loop-variable` check. ([#6473](https://github.com/XRPLF/rippled/pull/6473))
- Enabled clang-tidy `bugprone-reserved-identifier` check. ([#6456](https://github.com/XRPLF/rippled/pull/6456))
- Enabled clang-tidy `bugprone-optional-value-conversion` check. ([#6470](https://github.com/XRPLF/rippled/pull/6470))
- Enabled clang-tidy `bugprone-unhandled-self-assignment` check. ([#6504](https://github.com/XRPLF/rippled/pull/6504))
- Enabled clang-tidy `bugprone-unused-raii` check. ([#6505](https://github.com/XRPLF/rippled/pull/6505))
- Enabled clang-tidy `bugprone-inc-dec-in-conditions` check. ([#6455](https://github.com/XRPLF/rippled/pull/6455))
- Used CMake components for install. ([#6485](https://github.com/XRPLF/rippled/pull/6485))
- Built voidstar on amd64 only. ([#6481](https://github.com/XRPLF/rippled/pull/6481))
- Fixed rules used to determine when to upload Conan recipes. ([#6524](https://github.com/XRPLF/rippled/pull/6524))
- Fixed how clang-tidy is run when `.clang-tidy` is changed. ([#6521](https://github.com/XRPLF/rippled/pull/6521))
- Added missed clang-tidy `bugprone-inc-dec-conditions` check. ([#6526](https://github.com/XRPLF/rippled/pull/6526))
- Moved Type of Change from PR template to CONTRIBUTING. ([#6522](https://github.com/XRPLF/rippled/pull/6522))
- Replaced levelization shell script with python script. ([#6325](https://github.com/XRPLF/rippled/pull/6325))
- Enabled clang-tidy `bugprone-unused-return-value` check. ([#6475](https://github.com/XRPLF/rippled/pull/6475))
- Enabled clang-tidy check for CRTP constructor accessibility. ([#6452](https://github.com/XRPLF/rippled/pull/6452))
- Enabled clang-tidy `switch-missing-default-case` check. ([#6461](https://github.com/XRPLF/rippled/pull/6461))
- Moved sanitizer runtime options out to files. ([#6371](https://github.com/XRPLF/rippled/pull/6371))
- Fixed build errors on windows. ([#6562](https://github.com/XRPLF/rippled/pull/6562))
- Enabled remaining clang-tidy `cppcoreguidelines` checks. ([#6538](https://github.com/XRPLF/rippled/pull/6538))
- Let required runs be triggered by merge group events. ([#6563](https://github.com/XRPLF/rippled/pull/6563))
- Updated check-pr-title action hash. ([#6572](https://github.com/XRPLF/rippled/pull/6572))
- Enabled clang-tidy `bugprone-use-after-move` check. ([#6476](https://github.com/XRPLF/rippled/pull/6476))
- Added simple clang-tidy readability checks. ([#6556](https://github.com/XRPLF/rippled/pull/6556))
- Didn't check PR title for drafts. ([#6573](https://github.com/XRPLF/rippled/pull/6573))
- Used external action implementation of check-pr-title. ([#6578](https://github.com/XRPLF/rippled/pull/6578))
- Used correct format and event for workflows for release tags. ([#6554](https://github.com/XRPLF/rippled/pull/6554))
- Updated XRPLF/actions. ([#6594](https://github.com/XRPLF/rippled/pull/6594))
- Checked for signed commits in PR. ([#6559](https://github.com/XRPLF/rippled/pull/6559))
- Disallowed files more than 400kb to be added to the repo. ([#6597](https://github.com/XRPLF/rippled/pull/6597))
- Updated `.git-blame-ignore-revs`. ([#6577](https://github.com/XRPLF/rippled/pull/6577))
- Bumped `codecov/codecov-action` from 5.5.2 to 5.5.3. ([#6615](https://github.com/XRPLF/rippled/pull/6615))
- Enabled more clang-tidy readability checks. ([#6595](https://github.com/XRPLF/rippled/pull/6595))
- Removed the forward declarations that cause build errors when unity build is enabled. ([#6633](https://github.com/XRPLF/rippled/pull/6633))
- Updated external dependencies due to upstream merge. ([#6630](https://github.com/XRPLF/rippled/pull/6630))
- Updated some external dependencies. ([#6642](https://github.com/XRPLF/rippled/pull/6642))
- Used unpatched version of soci. ([#6649](https://github.com/XRPLF/rippled/pull/6649))
- Updated sqlite3 to 3.51.0, protobuf to 6.33.5, openssl to 3.6.1, grpc to 1.78.1. ([#6653](https://github.com/XRPLF/rippled/pull/6653))
- Showed warning message if user may need to connect to VPN. ([#6619](https://github.com/XRPLF/rippled/pull/6619))
- Added more AI tools to `.gitignore`. ([#6658](https://github.com/XRPLF/rippled/pull/6658))
- Added conflicting-pr workflow. ([#6656](https://github.com/XRPLF/rippled/pull/6656))
- Uploaded artifacts only in public repositories. ([#6670](https://github.com/XRPLF/rippled/pull/6670))
- Didn't publish docs on release branches. ([#6673](https://github.com/XRPLF/rippled/pull/6673))
- Bumped `codecov/codecov-action` from 5.5.3 to 6.0.0. ([#6685](https://github.com/XRPLF/rippled/pull/6685))
- Bumped `actions/deploy-pages` from 4.0.5 to 5.0.0. ([#6684](https://github.com/XRPLF/rippled/pull/6684))
- Fixed clang-tidy header filter. ([#6686](https://github.com/XRPLF/rippled/pull/6686))
- Enabled remaining clang-tidy `performance` checks. ([#6648](https://github.com/XRPLF/rippled/pull/6648))
- Only published docs in public repos. ([#6687](https://github.com/XRPLF/rippled/pull/6687))
- Used `pull_request_target` to check for signed commits. ([#6697](https://github.com/XRPLF/rippled/pull/6697))
- Enabled clang-tidy misc checks. ([#6655](https://github.com/XRPLF/rippled/pull/6655))
- Used nudb recipe from the upstream. ([#6701](https://github.com/XRPLF/rippled/pull/6701))
- Allowed uploading artifacts for XRPLF org. ([#6702](https://github.com/XRPLF/rippled/pull/6702))
- Enabled clang-tidy `coreguidelines` checks. ([#6698](https://github.com/XRPLF/rippled/pull/6698))
- Updated XRPLF/actions. ([#6713](https://github.com/XRPLF/rippled/pull/6713))
- Changed conditions for uploading artifacts in public/private/org repos. ([#6734](https://github.com/XRPLF/rippled/pull/6734))
- Enabled most clang-tidy bugprone checks. ([#6929](https://github.com/XRPLF/rippled/pull/6929))
- Moved codegen venv setup into build stage. ([#6617](https://github.com/XRPLF/rippled/pull/6617))
- Fixed unity build for book step. ([#6942](https://github.com/XRPLF/rippled/pull/6942))
- Enabled clang-tidy readability checks. ([#6930](https://github.com/XRPLF/rippled/pull/6930))
- Bumped `actions/upload-artifact` from 7.0.0 to 7.0.1. ([#6928](https://github.com/XRPLF/rippled/pull/6928))
- Bumped `actions/upload-pages-artifact` from 4.0.0 to 5.0.0. ([#6927](https://github.com/XRPLF/rippled/pull/6927))
- Enabled clang-tidy include cleaner. ([#6947](https://github.com/XRPLF/rippled/pull/6947))
- Bumped `tj-actions/changed-files` from 47.0.5 to 47.0.6. ([#6973](https://github.com/XRPLF/rippled/pull/6973))
- Added workflow to check PR description has been filled. ([#6965](https://github.com/XRPLF/rippled/pull/6965))
- Uploaded clang-tidy git diff. ([#6983](https://github.com/XRPLF/rippled/pull/6983))
- Enabled clang-tidy modernize checks. ([#6975](https://github.com/XRPLF/rippled/pull/6975))
- Added `-fix` to clang-tidy invocation. ([#6990](https://github.com/XRPLF/rippled/pull/6990))
- Added bashate pre-commit hook to unify bash style. ([#6994](https://github.com/XRPLF/rippled/pull/6994))
- Optionally ran clang-tidy via pre-commit. ([#6680](https://github.com/XRPLF/rippled/pull/6680))
- Added pre-commit hook to fix include style. ([#6995](https://github.com/XRPLF/rippled/pull/6995))
- Resolved MSVC Debug build failure in `JobQueue.h` and re-enabled `_CRTDBG_MAP_ALLOC` in CI. ([#6993](https://github.com/XRPLF/rippled/pull/6993))
- Enabled clang-tidy `modernize-use-nodiscard` check. ([#7015](https://github.com/XRPLF/rippled/pull/7015))
- Enabled clang-tidy v21 new checks. ([#7031](https://github.com/XRPLF/rippled/pull/7031))
- Used `print-env` from XRPLF/actions. ([#7052](https://github.com/XRPLF/rippled/pull/7052))
- Gated `-mcmodel` flags to x86_64 in sanitizer builds. ([#7049](https://github.com/XRPLF/rippled/pull/7049))
- Renamed `print-env` to `print-build-env`. ([#7061](https://github.com/XRPLF/rippled/pull/7061))
- Enabled clang-tidy `readability-identifier-naming` check. ([#6571](https://github.com/XRPLF/rippled/pull/6571))
- Ignored identifier-naming update in git blame. ([#7066](https://github.com/XRPLF/rippled/pull/7066))
- Rewrote clang-tidy workflow(s) in a reusable manner. ([#7062](https://github.com/XRPLF/rippled/pull/7062))
- Used `XRPLF/create-issue`. ([#7076](https://github.com/XRPLF/rippled/pull/7076))
- Ran pre-commit on diff in clang-tidy workflow. ([#7078](https://github.com/XRPLF/rippled/pull/7078))
- Did not duplicate sanitizer flags. ([#7058](https://github.com/XRPLF/rippled/pull/7058))
- Updated `conan.lock`. ([#7081](https://github.com/XRPLF/rippled/pull/7081))
- Updated zlib to 1.3.2, sqlite to 3.53.0, libarchive to 3.8.7, jemalloc to 5.3.1, and boost to 1.91.0. ([#7084](https://github.com/XRPLF/rippled/pull/7084))
- Restored clang-tidy change to section name in config. ([#7091](https://github.com/XRPLF/rippled/pull/7091))
- Upgraded Clang sanitizer to clang-22 and switched gcc-15 sanitizer to Release. ([#7079](https://github.com/XRPLF/rippled/pull/7079))
- Made `.clang-tidy` style a bit more consistent with Clio. ([#7096](https://github.com/XRPLF/rippled/pull/7096))
- Upgraded mako version. ([#7108](https://github.com/XRPLF/rippled/pull/7108))
- Made `Show test failure summary` work with no build dir. ([#7124](https://github.com/XRPLF/rippled/pull/7124))
- Limited nproc on Linux builds temporarily. ([#7132](https://github.com/XRPLF/rippled/pull/7132))
- Implemented nix-based Dockerfile for CI. ([#7083](https://github.com/XRPLF/rippled/pull/7083))
- Added Conan retry. ([#7147](https://github.com/XRPLF/rippled/pull/7147))
- Updated XRPLF/actions. ([#7281](https://github.com/XRPLF/rippled/pull/7281))
- Set version to 3.3.0-b0. ([#7280](https://github.com/XRPLF/rippled/pull/7280))
- Added Linux package builds (DEB + RPM) to CI. ([#6639](https://github.com/XRPLF/rippled/pull/6639))
- Only ran reusable package in public repos. ([#7293](https://github.com/XRPLF/rippled/pull/7293))
- Bumped `actions/upload-artifact` from 7.0.0 to 7.0.1. ([#7286](https://github.com/XRPLF/rippled/pull/7286))
- Applied more clang-tidy identifier renaming. ([#7290](https://github.com/XRPLF/rippled/pull/7290))
- Re-enabled full nproc for Linux. ([#7315](https://github.com/XRPLF/rippled/pull/7315))
- Fixed RPM prerelease ordering and started xrpld on DEB install. ([#7313](https://github.com/XRPLF/rippled/pull/7313))


## Credits

The following RippleX teams and GitHub users contributed to this release:

- RippleX Engineering
- RippleX Docs
- RippleX Product
- @Bronek
- @Kassaking7
- @box4wangjing
- @chuanshanjida
- @dangell7
- @nuxtreact
- @oncecelll
- @ricky122-5
- @shortthefomo
- @sublimator
- @tequdev
- @treeol
- @tsinglua
- @xVet


## Bug Bounties and Responsible Disclosures

We welcome reviews of the `rippled` code and urge researchers to responsibly disclose any issues they may find.

For more information, see:

- [Ripple's Bug Bounty Program](https://ripple.com/legal/bug-bounty/)
- [`rippled` Security Policy](https://github.com/XRPLF/rippled/blob/develop/SECURITY.md)
