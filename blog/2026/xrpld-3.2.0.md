---
category: 2026
date: "2026-06-15"
template: '../../@theme/templates/blogpost'
seo:
    title: Introducing XRP Ledger version 3.2.0
    description: xrpld version 3.2.0 is now available. This version retires several long-active amendments, introduces a new cleanup amendment and bug fixes, and renames the rippled binary to xrpld.
labels:
    - xrpld Release Notes
markdown:
    editPage:
        hide: true
---
# Introducing XRP Ledger version 3.2.0

Version 3.2.0 of `xrpld`, the reference server implementation of the XRP Ledger protocol, is now available.

This release is primarily a cleanup and maintenance release. It retires amendments that have been activated for over two years, continues the modularization of `libxrpl`, and renames `rippled` to `xrpld` per [XLS-0095](https://xls.xrpl.org/xls/XLS-0095-rename-rippled-to-xrpld.html). It also introduces the **fixCleanup3_2_0** amendment, which bundles bug fixes affecting Single Asset Vaults, the Lending Protocol, the permissioned DEX, Multi-Purpose Tokens, and permissioned domains.


## Action Required

If you run an XRP Ledger server, upgrade to version 3.2.0 as soon as possible to ensure service continuity. The rename from `rippled` to `xrpld` affects default configurations and database directory paths, which require additional steps to migrate. See [Migrate from rippled to xrpld](../../docs/infrastructure/installation/migrate-to-xrpld.md) for full instructions.


## Install / Upgrade

On supported platforms, see the [instructions on installing or updating `xrpld`](../../docs/infrastructure/installation/index.md).

| Package | SHA-256 |
|:--------|:--------|
| [RPM for Red Hat / CentOS (x86-64)](https://repos.ripple.com/repos/rippled-rpm/stable/xrpld-3.2.0-1.el9.x86_64.rpm) | `a6a49cb767161b646c77c105f9009992db7a33388c0f443ac40f0558c52af467` |
| [DEB for Ubuntu / Debian (x86-64)](https://repos.ripple.com/repos/rippled-deb/pool/stable/xrpld_3.2.0-1_amd64.deb) | `de3591fc92704a0a40b673b1ac37faec2bd8481523f0680450a69649b60e5de5` |

For other platforms, please [build from source](https://github.com/XRPLF/rippled/blob/release/3.2.x/BUILD.md). The most recent commit in the git log should be the change setting the version:

```text
commit 3c43f4614f87965298773279ff5b85d4c56c637b
Author: Ayaz Salikhov <mathbunnyru@users.noreply.github.com>
Date:   Mon Jun 15 22:19:38 2026 +0100

    release: Bump version to 3.2.0
```


## Full Changelog


### Amendments

- **fixCleanup3_2_0**: This amendment introduces a bundle of bug fixes for the 3.2.0 release. ([#7037](https://github.com/XRPLF/rippled/pull/7037))
    - Adds precision and rounding fixes for Single Asset Vaults and the Lending Protocol
    - Fixes the `ValidPermissionedDEX` invariant firing on a valid offer deletion
    - Validates non-canonical Multi-Purpose Token amounts
    - Adds a zero `DomainID` check for permissioned domains
    - Adds invariant `AccountRootsDeletedClean`, which checks that a deleted account doesn't leave any directly accessible artifacts behind.
- The following amendments are retired:
    - `CheckCashMakesTrustLine` ([#5974](https://github.com/XRPLF/rippled/pull/5974))
    - `Checks` ([#6055](https://github.com/XRPLF/rippled/pull/6055))
    - `CryptoConditionsSuite` ([#6036](https://github.com/XRPLF/rippled/pull/6036))
    - `DeletableAccounts` ([#6056](https://github.com/XRPLF/rippled/pull/6056))
    - `DepositAuth`, `DepositPreauth` ([#5978](https://github.com/XRPLF/rippled/pull/5978))
    - `DisallowIncoming` ([#6045](https://github.com/XRPLF/rippled/pull/6045))
    - `ExpandedSignerList`, `MultiSignReserve` ([#5981](https://github.com/XRPLF/rippled/pull/5981))
    - `Flow`, `FlowSortStrands` ([#6054](https://github.com/XRPLF/rippled/pull/6054))
    - `HardenedValidations` ([#5988](https://github.com/XRPLF/rippled/pull/5988))
    - `ImmediateOfferKilled` ([#5973](https://github.com/XRPLF/rippled/pull/5973))
    - `NegativeUNL` ([#6033](https://github.com/XRPLF/rippled/pull/6033))
    - `NonFungibleTokensV1`, `NonFungibleTokensV1_1`, `fixNFTokenDirV1`, `fixNFTokenNegOffer`, `fixNFTokenRemint`, `fixNonFungibleTokensV1_2` ([#5971](https://github.com/XRPLF/rippled/pull/5971))
    - `RequireFullyCanonicalSig` ([#6035](https://github.com/XRPLF/rippled/pull/6035))
    - `TicketBatch` ([#6032](https://github.com/XRPLF/rippled/pull/6032))
    - `fix1513` ([#5919](https://github.com/XRPLF/rippled/pull/5919))
    - `fix1515` ([#5920](https://github.com/XRPLF/rippled/pull/5920))
    - `fix1543` ([#5926](https://github.com/XRPLF/rippled/pull/5926))
    - `fix1571` ([#5925](https://github.com/XRPLF/rippled/pull/5925))
    - `fix1578` ([#5927](https://github.com/XRPLF/rippled/pull/5927))
    - `fix1623` ([#5928](https://github.com/XRPLF/rippled/pull/5928))
    - `fix1781` ([#5931](https://github.com/XRPLF/rippled/pull/5931))
    - `fixAmendmentMajorityCalc` ([#5961](https://github.com/XRPLF/rippled/pull/5961))
    - `fixCheckThreading` ([#5957](https://github.com/XRPLF/rippled/pull/5957))
    - `fixMasterKeyAsRegularKey` ([#5959](https://github.com/XRPLF/rippled/pull/5959))
    - `fixPayChanRecipientOwnerDir` ([#5946](https://github.com/XRPLF/rippled/pull/5946))
    - `fixQualityUpperBound` ([#5960](https://github.com/XRPLF/rippled/pull/5960))
    - `fixReducedOffersV1` ([#5972](https://github.com/XRPLF/rippled/pull/5972))
    - `fixRmSmallIncreasedQOffers` ([#5955](https://github.com/XRPLF/rippled/pull/5955))
    - `fixSTAmountCanonicalize` ([#5956](https://github.com/XRPLF/rippled/pull/5956))
    - `fixTakerDryOfferRemoval` ([#5958](https://github.com/XRPLF/rippled/pull/5958))
    - `fixTrustLinesToSelf` ([#5989](https://github.com/XRPLF/rippled/pull/5989))


### Features

- Added a configurable `nudb_block_size` option in the `[node_db]` config section, allowing operators to set NuDB block sizes from 4K to 32K for improved storage performance. ([#5468](https://github.com/XRPLF/rippled/pull/5468))
- Added peer public keys to log output to aid debugging while keeping IP addresses masked. ([#5678](https://github.com/XRPLF/rippled/pull/5678))
- Added `ledger_entry` API options to look up the `Amendments`, `FeeSettings`, `NegativeUNL`, and `LedgerHashes` entries by name, and made the request always return the computed index even when the object is not found. ([#5644](https://github.com/XRPLF/rippled/pull/5644))
- Added the following sections to the `server_definitions` API response: ([#6321](https://github.com/XRPLF/rippled/pull/6321))
    - `TRANSACTION_FORMATS`
    - `LEDGER_ENTRY_FORMATS`
    - `TRANSACTION_FLAGS`
    - `LEDGER_ENTRY_FLAGS`
    - `ACCOUNT_SET_FLAGS`
- Added a `--definitions` CLI flag to `xrpld` that outputs server definitions as JSON and exits without starting the server. ([#6858](https://github.com/XRPLF/rippled/pull/6858))
- Added optional TLS and mTLS support to the gRPC server. ([#6374](https://github.com/XRPLF/rippled/pull/6374))
- Added a code generator that produces typed wrapper classes for transactions and ledger entries at configure time, keeping generated code in sync with the macro definitions. ([#6443](https://github.com/XRPLF/rippled/pull/6443))
- Added a maximum 63-character limit and restricted character set on amendment/feature names. ([#5555](https://github.com/XRPLF/rippled/pull/5555))
- Set the default peering port to 2459. ([#6848](https://github.com/XRPLF/rippled/pull/6848))
- Added a mutex wrapper (ported from Clio) that binds a mutex to the data it protects. ([#6447](https://github.com/XRPLF/rippled/pull/6447))


### Breaking Changes

- Renamed the system name from `rippled` to `xrpld`. This changes the default configuration and database directory paths, as well as RPC metadata such as the server's user agent and version string. ([#6347](https://github.com/XRPLF/rippled/pull/6347))


### Bug Fixes

- Fixed a regression in ConnectAttempt. ([#5900](https://github.com/XRPLF/rippled/pull/5900))
- Removed cryptographic libs from the libxrpl Conan package. ([#6163](https://github.com/XRPLF/rippled/pull/6163))
- Stopped the embedded tests hanging forever on ARM by fixing the memory ordering issue. ([#6248](https://github.com/XRPLF/rippled/pull/6248))
- Restored config changes that broke standalone mode. ([#6301](https://github.com/XRPLF/rippled/pull/6301))
- Incremented sequence when accepting new manifests. ([#6059](https://github.com/XRPLF/rippled/pull/6059))
- Removed unneeded import and fixed log. ([#6532](https://github.com/XRPLF/rippled/pull/6532))
- Marked Single Asset Vault and Lending transactions as `NotDelegable`. ([#6489](https://github.com/XRPLF/rippled/pull/6489))
- Removed a newline from the logging statement in the `changeSpotPrice` calculation. ([#6547](https://github.com/XRPLF/rippled/pull/6547))
- Fixed memory leaks in HTTPClient. ([#6370](https://github.com/XRPLF/rippled/pull/6370))
- Switched to `boost::coroutine2`. ([#6372](https://github.com/XRPLF/rippled/pull/6372))
- Removed nonexistent `boost::coroutine2` library. ([#6561](https://github.com/XRPLF/rippled/pull/6561))
- Removed superfluous view update from credentials. ([#6545](https://github.com/XRPLF/rippled/pull/6545))
- Fixed more clang-tidy issues found after merging to develop. ([#6640](https://github.com/XRPLF/rippled/pull/6640))
- Removed unused/unreachable transactor code. ([#6612](https://github.com/XRPLF/rippled/pull/6612))
- Guarded `Coro::resume()` against completed coroutines. ([#6608](https://github.com/XRPLF/rippled/pull/6608))
- Fixed a `Workers::stop()` race between `m_allPaused` and `m_runningTaskCount`. ([#6574](https://github.com/XRPLF/rippled/pull/6574))
- Fixed a previous ledger size typo in RCLConsensus. ([#6696](https://github.com/XRPLF/rippled/pull/6696))
- Changed variable signedness and correctly handled `std::optional`. ([#6657](https://github.com/XRPLF/rippled/pull/6657))
- Made minor RPC fixes. ([#6730](https://github.com/XRPLF/rippled/pull/6730))
- Changed the AMMClawback return code to `tecNO_PERMISSION`. ([#6946](https://github.com/XRPLF/rippled/pull/6946))
- Disallowed `MPTClearRequireAuth` if domain is set. ([#6712](https://github.com/XRPLF/rippled/pull/6712))
- Fixed more clang-tidy issues. ([#6992](https://github.com/XRPLF/rippled/pull/6992))
- Made assorted Payments fixes. ([#6585](https://github.com/XRPLF/rippled/pull/6585))
- Fixed UBSan-flagged issues. ([#6151](https://github.com/XRPLF/rippled/pull/6151))
- Made assorted RPC fixes. ([#6529](https://github.com/XRPLF/rippled/pull/6529))
- Addressed code review comments regarding `boost::coroutine2`. ([#6977](https://github.com/XRPLF/rippled/pull/6977))
- Fixed regressions in `server_definitions`. ([#7008](https://github.com/XRPLF/rippled/pull/7008))
- Prevented stale `AuthAccounts` from persisting after `tfTwoAssetIfEmpty` re-initialization. ([#6996](https://github.com/XRPLF/rippled/pull/6996))
- Restored clang-tidy change to section name in config. ([#7091](https://github.com/XRPLF/rippled/pull/7091))
- Added a null check. ([#7305](https://github.com/XRPLF/rippled/pull/7305))
- Reverted graceful peer disconnection and follow-up fix. ([#7296](https://github.com/XRPLF/rippled/pull/7296))
- Added assorted MPT/DEX fixes. ([#7040](https://github.com/XRPLF/rippled/pull/7040))
- Checked if the MPT first loss cover can be sent to the broker before deleting the broker. ([#7125](https://github.com/XRPLF/rippled/pull/7125))
- Skipped deleted book directories and non-root modifications in the `ValidBookDirectory` invariant. ([#7312](https://github.com/XRPLF/rippled/pull/7312))
- Included the management-fee delta in the `doOverpayment` assertion. ([#7039](https://github.com/XRPLF/rippled/pull/7039))
- Fixed a rounding error at the `Number::maxRep` cusp. ([#7051](https://github.com/XRPLF/rippled/pull/7051))
- Improved upward rounding edge cases for `Number::operator/=`. ([#7328](https://github.com/XRPLF/rippled/pull/7328))
- Used the account ledger entry when canceling token escrows. ([#6171](https://github.com/XRPLF/rippled/pull/6171))
- Fixed wrong hybrid offer orderbook placement and updated `LedgerStateFix` to amend `ExchangeRate` meta. ([#7087](https://github.com/XRPLF/rippled/pull/7087))
- Set request size limits and differential pricing for get-object-by-hash calls. ([2728e11](https://github.com/XRPLF/rippled/commit/2728e11809b3a62fc5e17af95a8f300364691c67))
- Added a zero NFT Offer ID check for `NFTokenCancelOffer`. ([fded066](https://github.com/XRPLF/rippled/commit/fded06652ad3d85977e36af903548425e8ff8094))
- Fixed the `Number` comparison operator. ([e5785c4](https://github.com/XRPLF/rippled/commit/e5785c4fcbf45eb9fb80c87a2b19831badd791c1))
- Temporarily disabled transaction invariants for 3.2.0 due to performance regression. This is safe because all transaction invariants in 3.2.0 are no-ops. ([ed5f134](https://github.com/XRPLF/rippled/commit/ed5f13481a444380e7821d98d2ce73d316a77744))


### Refactors

- Replaced `fee().accountReserve(0)` with `fee().reserve`. ([#5843](https://github.com/XRPLF/rippled/pull/5843))
- Refactored signature autofilling for the Simulate RPC. ([#5852](https://github.com/XRPLF/rippled/pull/5852))
- Moved `server_definitions` code to its own files. ([#5890](https://github.com/XRPLF/rippled/pull/5890))
- Cleaned up `TxMeta`. ([#5845](https://github.com/XRPLF/rippled/pull/5845))
- Modularised shamap and nodestore. ([#5668](https://github.com/XRPLF/rippled/pull/5668))
- Moved API functions from `RPCHelpers.h` to `ApiVersion.h`. ([#5889](https://github.com/XRPLF/rippled/pull/5889))
- Renamed `RIPPLE_` and `RIPPLED_` definitions to `XRPL_`. ([#5821](https://github.com/XRPLF/rippled/pull/5821))
- Removed unnecessary copyright notices already covered by `LICENSE.md`. ([#5929](https://github.com/XRPLF/rippled/pull/5929))
- Split up `RPCHelpers.h` into two. ([#6047](https://github.com/XRPLF/rippled/pull/6047))
- Replaced secp256k1 source with a Conan package. ([#6089](https://github.com/XRPLF/rippled/pull/6089))
- Cleaned up `RPCHelpers`. ([#5684](https://github.com/XRPLF/rippled/pull/5684))
- Renamed `LedgerInfo` to `LedgerHeader`. ([#6136](https://github.com/XRPLF/rippled/pull/6136))
- Renamed `info()` to `header()`. ([#6138](https://github.com/XRPLF/rippled/pull/6138))
- Renamed the `rippled` binary to `xrpld`. ([#5983](https://github.com/XRPLF/rippled/pull/5983))
- Moved JobQueue and related classes into the xrpl.core module. ([#6121](https://github.com/XRPLF/rippled/pull/6121))
- Renamed the `ripple` namespace to `xrpl`. ([#5982](https://github.com/XRPLF/rippled/pull/5982))
- Removed `Json::Object` and related files/classes. ([#5894](https://github.com/XRPLF/rippled/pull/5894))
- Renamed `rippled.cfg` to `xrpld.cfg`. ([#6098](https://github.com/XRPLF/rippled/pull/6098))
- Fixed typos in comments and set up cspell. ([#6164](https://github.com/XRPLF/rippled/pull/6164))
- Fixed spelling issues in private/local variables and functions. ([#6182](https://github.com/XRPLF/rippled/pull/6182))
- Fixed spelling issues in all variables/functions. ([#6184](https://github.com/XRPLF/rippled/pull/6184))
- Removed unused credential signature hash prefix. ([#6186](https://github.com/XRPLF/rippled/pull/6186))
- Fixed lots of typos and added cspell settings. ([#5719](https://github.com/XRPLF/rippled/pull/5719))
- Cleaned up uses of `std::source_location`. ([#6272](https://github.com/XRPLF/rippled/pull/6272))
- Added ServiceRegistry to help migration. ([#6222](https://github.com/XRPLF/rippled/pull/6222))
- Replaced include guards with `#pragma once`. ([#6322](https://github.com/XRPLF/rippled/pull/6322))
- Removed unnecessary caches. ([#5439](https://github.com/XRPLF/rippled/pull/5439))
- Threads renaming follow-up. ([#6336](https://github.com/XRPLF/rippled/pull/6336))
- Modularised WalletDB and Manifest. ([#6223](https://github.com/XRPLF/rippled/pull/6223))
- Modularised RelationalDB. ([#6224](https://github.com/XRPLF/rippled/pull/6224))
- Modularised the NetworkOPs interface. ([#6225](https://github.com/XRPLF/rippled/pull/6225))
- Fixed some minor issues in the comments. ([#6346](https://github.com/XRPLF/rippled/pull/6346))
- Modularised HashRouter, Conditions, and OrderBookDB. ([#6226](https://github.com/XRPLF/rippled/pull/6226))
- Decoupled app/tx from Application and Config. ([#6227](https://github.com/XRPLF/rippled/pull/6227))
- Modularised app/tx. ([#6228](https://github.com/XRPLF/rippled/pull/6228))
- Explicitly trimmed the heap after cache sweeps. ([#6022](https://github.com/XRPLF/rippled/pull/6022))
- Used `uint256` directly as a key instead of a void pointer. ([#6313](https://github.com/XRPLF/rippled/pull/6313))
- Broke down InvariantCheck into multiple classes. ([#6440](https://github.com/XRPLF/rippled/pull/6440))
- Fixed the clang-tidy `bugprone-empty-catch` check. ([#6419](https://github.com/XRPLF/rippled/pull/6419))
- Updated the transaction folder structure. ([#6483](https://github.com/XRPLF/rippled/pull/6483))
- Split combined transactor files into individual classes. ([#6495](https://github.com/XRPLF/rippled/pull/6495))
- Removed dead code in `CreateOffer`. ([#6541](https://github.com/XRPLF/rippled/pull/6541))
- Fixed typo in `freezeHandling` parameter name. ([#6543](https://github.com/XRPLF/rippled/pull/6543))
- Simplified set/get call to use existing variable. ([#6534](https://github.com/XRPLF/rippled/pull/6534))
- Deleted the `SecretKey` compare op from the library and moved it to the tests module. ([#6503](https://github.com/XRPLF/rippled/pull/6503))
- Used `hasExpired` in `CancelCheck`. ([#6533](https://github.com/XRPLF/rippled/pull/6533))
- Added a no-ASAN macro for `Throw` statements. ([#6373](https://github.com/XRPLF/rippled/pull/6373))
- Cleaned up `getFeePayer`, `mSourceBalance`, and `mPriorBalance`. ([#6478](https://github.com/XRPLF/rippled/pull/6478))
- Made assorted small DID fixes. ([#6552](https://github.com/XRPLF/rippled/pull/6552))
- Removed dead code in escrow helper logic. ([#6553](https://github.com/XRPLF/rippled/pull/6553))
- Enabled the remaining clang-tidy `cppcoreguidelines` checks. ([#6538](https://github.com/XRPLF/rippled/pull/6538))
- Added a const qualifier to the SLE in the `verifyDepositPreauth` parameter. ([#6555](https://github.com/XRPLF/rippled/pull/6555))
- Used `ReadView` instead of `ApplyView` in `authorizedDepositPreauth()`. ([#6560](https://github.com/XRPLF/rippled/pull/6560))
- Replaced `!=`/`==` `tesSuccess` with `isTesSuccess`. ([#6409](https://github.com/XRPLF/rippled/pull/6409))
- Added simple clang-tidy readability checks. ([#6556](https://github.com/XRPLF/rippled/pull/6556))
- Renamed transactor files/classes to match the tx name. ([#6580](https://github.com/XRPLF/rippled/pull/6580))
- Moved ledger entry helper functions from `View.h`/`View.cpp` to dedicated helper files. ([#6453](https://github.com/XRPLF/rippled/pull/6453))
- Improved imports to only call the needed helpers. ([#6624](https://github.com/XRPLF/rippled/pull/6624))
- Enabled more clang-tidy readability checks. ([#6595](https://github.com/XRPLF/rippled/pull/6595))
- Modularised ledger. ([#6536](https://github.com/XRPLF/rippled/pull/6536))
- Made function naming in ServiceRegistry consistent. ([#6390](https://github.com/XRPLF/rippled/pull/6390))
- Split `LoanInvariant` into `LoanBrokerInvariant` and `LoanInvariant`. ([#6674](https://github.com/XRPLF/rippled/pull/6674))
- Addressed PR comments after the modularisation PRs. ([#6389](https://github.com/XRPLF/rippled/pull/6389))
- Reorganized RPC handler files. ([#6628](https://github.com/XRPLF/rippled/pull/6628))
- Moved more helper files into `libxrpl/ledger/helpers`. ([#6731](https://github.com/XRPLF/rippled/pull/6731))
- Renamed non-functional uses of `ripple(d)` to `xrpl(d)`. ([#6676](https://github.com/XRPLF/rippled/pull/6676))
- Combined `AMMHelpers` and `AMMUtils`. ([#6733](https://github.com/XRPLF/rippled/pull/6733))
- Removed the unused `notTooManyOffers` function from `NFTokenUtils`. ([#6737](https://github.com/XRPLF/rippled/pull/6737))
- Added transaction-specific invariant checking. ([#6551](https://github.com/XRPLF/rippled/pull/6551))
- Removed `seq` from `TMGetObjectByHash`. ([#6976](https://github.com/XRPLF/rippled/pull/6976))
- Cleaned up NetworkOPs. ([#6575](https://github.com/XRPLF/rippled/pull/6575))
- Moved `LendingHelpers` into `libxrpl/ledger/helpers`. ([#6638](https://github.com/XRPLF/rippled/pull/6638))
- Reverted certain `Throw`s by `LogicError`s. ([#7036](https://github.com/XRPLF/rippled/pull/7036))
- Enabled the clang-tidy `readability-identifier-naming` check. ([#6571](https://github.com/XRPLF/rippled/pull/6571))
- Marked empty transactor invariants as future work. ([#7080](https://github.com/XRPLF/rippled/pull/7080))
- Made more fixes for bad renames. ([#7092](https://github.com/XRPLF/rippled/pull/7092))
- Used more scoped enums. ([#7086](https://github.com/XRPLF/rippled/pull/7086))
- Used `isFlag` where possible instead of bitwise math. ([#7278](https://github.com/XRPLF/rippled/pull/7278))
- Renamed static constants. ([#7120](https://github.com/XRPLF/rippled/pull/7120))
- Cleaned up comments post-clang-tidy changes. ([#7283](https://github.com/XRPLF/rippled/pull/7283))
- Renamed `account_` to `accountID_`. ([#7284](https://github.com/XRPLF/rippled/pull/7284))
- Fixed `sfGeneric` and `sfInvalid` field names. ([#7300](https://github.com/XRPLF/rippled/pull/7300))
- Removed dead `fetchBatch` code. ([#7309](https://github.com/XRPLF/rippled/pull/7309))
- Used explicit types to help the compiler. ([9650fe8](https://github.com/XRPLF/rippled/commit/9650fe8a6ecb8344d134e183ac74c15ac58dcc44))
- Improved payment channel closing and returned error codes. ([e29dc47](https://github.com/XRPLF/rippled/commit/e29dc474b3d3eb10bb9ff3407cc378c71800124b))
- Improved tracking of book (un)subscriptions. ([f98c251](https://github.com/XRPLF/rippled/commit/f98c251011e606e13a562598f2ee974d0a35b624))
- Handled int and uint API versions separately. ([82ee5b7](https://github.com/XRPLF/rippled/commit/82ee5b7556456cf9f9b78bed91d24e1b72eeea50))
- Used rocksdb includes only when it is available. ([47b06ec](https://github.com/XRPLF/rippled/commit/47b06ecd17c3b9f2852ebd15987a85401965117e))
- Dispatched `hasInvalidAmount()` on type tag instead of `dynamic_cast`. ([781ef17](https://github.com/XRPLF/rippled/commit/781ef175c9e0826f12da0e8d9557eeb68c5c516a))
- Sorted retired amendments to reduce conflicts. ([#5966](https://github.com/XRPLF/rippled/pull/5966))
- Added `XRPL_RETIRE_FIX` and `XRPL_RETIRE_FEATURE`. ([#6014](https://github.com/XRPLF/rippled/pull/6014))
- Removed unnecessary clang-format off/on directives. ([#6682](https://github.com/XRPLF/rippled/pull/6682))


### Documentation

- Updated instructions on how to (re)generate the conan.lock file. ([#6070](https://github.com/XRPLF/rippled/pull/6070))
- Added XLS requirements to `CONTRIBUTING.md`. ([#6065](https://github.com/XRPLF/rippled/pull/6065))
- Inferred version of patched Conan dependency to export. ([#6112](https://github.com/XRPLF/rippled/pull/6112))
- Updated Ripple Bug Bounty public key. ([#6258](https://github.com/XRPLF/rippled/pull/6258))
- Updated the API changelog and added APIv2 and APIv3 version documentation. ([#6308](https://github.com/XRPLF/rippled/pull/6308))
- Improved documentation for InvariantCheck. ([#6518](https://github.com/XRPLF/rippled/pull/6518))
- Added an explanatory comment to `checkFee`. ([#6631](https://github.com/XRPLF/rippled/pull/6631))
- Added a description for the `terLOCKED` error. ([#6811](https://github.com/XRPLF/rippled/pull/6811))
- Added a note about clang-tidy installation. ([#6634](https://github.com/XRPLF/rippled/pull/6634))
- Updated `LICENSE.md` year to present. ([#6636](https://github.com/XRPLF/rippled/pull/6636))
- Rewrote conan docs for custom recipes. ([#6647](https://github.com/XRPLF/rippled/pull/6647))
- Updated bug bounty information. ([#7006](https://github.com/XRPLF/rippled/pull/7006))
- Updated hybrid offer invariant comment. ([#7007](https://github.com/XRPLF/rippled/pull/7007))
- Fixed some comments to improve readability. ([#7122](https://github.com/XRPLF/rippled/pull/7122))
- Added `--parallel` flag to cmake build commands in `BUILD.md`. ([#7302](https://github.com/XRPLF/rippled/pull/7302))


### Testing

- Cleaned up misleading comments in tests. ([#6031](https://github.com/XRPLF/rippled/pull/6031))
- Added more tests for the `ledger_entry` RPC. ([#5858](https://github.com/XRPLF/rippled/pull/5858))
- Removed `failed` string from vault test. ([#6214](https://github.com/XRPLF/rippled/pull/6214))
- Suppressed "parse failed" message in Batch tests. ([#6207](https://github.com/XRPLF/rippled/pull/6207))
- Fixed the xrpl.net unit test. ([#6241](https://github.com/XRPLF/rippled/pull/6241))
- Fixed typo in LendingHelpers unit-test. ([#6215](https://github.com/XRPLF/rippled/pull/6215))
- Added file/line to Env. ([#6276](https://github.com/XRPLF/rippled/pull/6276))
- Fixed spelling issues in tests. ([#6199](https://github.com/XRPLF/rippled/pull/6199))
- Improved stability of Subscribe tests. ([#6420](https://github.com/XRPLF/rippled/pull/6420))
- Fixed flaky subscribe tests. ([#6510](https://github.com/XRPLF/rippled/pull/6510))
- Removed `testline` JTX helper class. ([#6539](https://github.com/XRPLF/rippled/pull/6539))
- Fixed tests for the clang-tidy `bugprone-unchecked-optional-access` check. ([#6502](https://github.com/XRPLF/rippled/pull/6502))
- Handled WSClient write failure when server closes WebSocket. ([#6671](https://github.com/XRPLF/rippled/pull/6671))
- Fixed flaky CI tests. ([#7005](https://github.com/XRPLF/rippled/pull/7005))
- Created new transaction testing framework `TxTest`. ([#6537](https://github.com/XRPLF/rippled/pull/6537))
- Backported Permissioned Domains fixes. ([#7016](https://github.com/XRPLF/rippled/pull/7016))


### CI/Build

- Updated Conan dependencies: protobuf and grpc. ([#5589](https://github.com/XRPLF/rippled/pull/5589))
- Installed validator-keys. ([#5841](https://github.com/XRPLF/rippled/pull/5841))
- Updated Conan dependencies: OpenSSL. ([#5873](https://github.com/XRPLF/rippled/pull/5873))
- Downgraded OpenSSL to 3.5.4. ([#5878](https://github.com/XRPLF/rippled/pull/5878))
- Renamed cmake files and definitions. ([#5975](https://github.com/XRPLF/rippled/pull/5975))
- Removed version number in `find_dependency` for OpenSSL. ([#5985](https://github.com/XRPLF/rippled/pull/5985))
- Added sanitizers to CI builds. ([#5996](https://github.com/XRPLF/rippled/pull/5996))
- Cleaned up `.gitignore` and `.gitattributes`. ([#6001](https://github.com/XRPLF/rippled/pull/6001))
- Removed unnecessary creation of symlink in CMake install file. ([#6009](https://github.com/XRPLF/rippled/pull/6009))
- Fixed xrpld symlink renamed incorrectly. ([#6012](https://github.com/XRPLF/rippled/pull/6012))
- Updated RocksDB, SQLite, and Doctest. ([#6015](https://github.com/XRPLF/rippled/pull/6015))
- Updated nudb recipe to remove linker warnings. ([#6038](https://github.com/XRPLF/rippled/pull/6038))
- Updated lockfile. ([#6083](https://github.com/XRPLF/rippled/pull/6083))
- Made the conan generate script a script. ([#6085](https://github.com/XRPLF/rippled/pull/6085))
- Added black pre-commit hook. ([#6086](https://github.com/XRPLF/rippled/pull/6086))
- Replaced ed25519-donna source with a Conan package. ([#6088](https://github.com/XRPLF/rippled/pull/6088))
- Used ccache to cache build objects for speeding up building. ([#6104](https://github.com/XRPLF/rippled/pull/6104))
- Re-enabled Linux and macOS matrix. ([#6107](https://github.com/XRPLF/rippled/pull/6107))
- Used updated secp256k1 recipe. ([#6118](https://github.com/XRPLF/rippled/pull/6118))
- Fixed docs readme and cmake. ([#6122](https://github.com/XRPLF/rippled/pull/6122))
- Updated shared actions. ([#6147](https://github.com/XRPLF/rippled/pull/6147))
- Removed superfluous build directory creation. ([#6159](https://github.com/XRPLF/rippled/pull/6159))
- Pinned `ruamel.yaml<0.19` in pre-commit-hooks. ([#6166](https://github.com/XRPLF/rippled/pull/6166))
- Removed unnecessary version number and options in cmake `find_package`. ([#6169](https://github.com/XRPLF/rippled/pull/6169))
- Moved variable into the right place. ([#6179](https://github.com/XRPLF/rippled/pull/6179))
- Used updated XRPLF workflow and action. ([#6188](https://github.com/XRPLF/rippled/pull/6188))
- Fixed some minor issues in the comments. ([#6194](https://github.com/XRPLF/rippled/pull/6194))
- Changed `/Zi` to `/Z7` for ccache and removed debug symbols in CI. ([#6198](https://github.com/XRPLF/rippled/pull/6198))
- Pinned pre-commit hooks to commit hashes. ([#6205](https://github.com/XRPLF/rippled/pull/6205))
- Updated actions/images to use cmake 4.2.1 and conan 2.24.0. ([#6209](https://github.com/XRPLF/rippled/pull/6209))
- Updated Conan lock file with changed OpenSSL recipe. ([#6211](https://github.com/XRPLF/rippled/pull/6211))
- Used gtest instead of doctest. ([#6216](https://github.com/XRPLF/rippled/pull/6216))
- Removed 'master' branch as a trigger. ([#6234](https://github.com/XRPLF/rippled/pull/6234))
- Uploaded Conan recipe for merges into develop and commits to release. ([#6235](https://github.com/XRPLF/rippled/pull/6235))
- Detected uninitialized variables in CMake files. ([#6247](https://github.com/XRPLF/rippled/pull/6247))
- Added missing commit hash to Conan recipe version. ([#6256](https://github.com/XRPLF/rippled/pull/6256))
- Ran on-trigger and on-pr when generate-version is modified. ([#6257](https://github.com/XRPLF/rippled/pull/6257))
- Used plus instead of hyphen for Conan recipe version suffix. ([#6261](https://github.com/XRPLF/rippled/pull/6261))
- Explicitly set version when exporting the Conan recipe. ([#6264](https://github.com/XRPLF/rippled/pull/6264))
- Properly propagated Conan credentials. ([#6265](https://github.com/XRPLF/rippled/pull/6265))
- Passed missing sanitizers input to actions. ([#6266](https://github.com/XRPLF/rippled/pull/6266))
- Added cmake-format pre-commit hook. ([#6279](https://github.com/XRPLF/rippled/pull/6279))
- Updated Boost to 1.90. ([#6280](https://github.com/XRPLF/rippled/pull/6280))
- Uploaded Conan recipes for develop, release candidates, and releases. ([#6286](https://github.com/XRPLF/rippled/pull/6286))
- Set ColumnLimit to 120 in clang-format. ([#6288](https://github.com/XRPLF/rippled/pull/6288))
- Removed unnecessary `boost::system` requirement from conanfile. ([#6290](https://github.com/XRPLF/rippled/pull/6290))
- Formatted all cmake files without comments. ([#6294](https://github.com/XRPLF/rippled/pull/6294))
- Removed unity builds. ([#6300](https://github.com/XRPLF/rippled/pull/6300))
- Added nix development environment. ([#6314](https://github.com/XRPLF/rippled/pull/6314))
- Added upper-case match for ARM64. ([#6315](https://github.com/XRPLF/rippled/pull/6315))
- Updated hashes of XRPLF/actions. ([#6316](https://github.com/XRPLF/rippled/pull/6316))
- Added zed IDE to `.gitignore`. ([#6317](https://github.com/XRPLF/rippled/pull/6317))
- Replaced levelization shell script with a python script. ([#6325](https://github.com/XRPLF/rippled/pull/6325))
- Removed unnecessary script. ([#6326](https://github.com/XRPLF/rippled/pull/6326))
- Updated secp256k1 and openssl. ([#6327](https://github.com/XRPLF/rippled/pull/6327))
- Restored unity builds. ([#6328](https://github.com/XRPLF/rippled/pull/6328))
- Updated secp256k1 to 0.7.1. ([#6331](https://github.com/XRPLF/rippled/pull/6331))
- Removed @xrplf/rpc-reviewers. ([#6337](https://github.com/XRPLF/rippled/pull/6337))
- Grepped for failures in CI. ([#6339](https://github.com/XRPLF/rippled/pull/6339))
- Fixed `gcov` lib coverage build failure on macOS. ([#6350](https://github.com/XRPLF/rippled/pull/6350))
- Updated clang-format to 21.1.8. ([#6352](https://github.com/XRPLF/rippled/pull/6352))
- Added clang-tidy to CI. ([#6369](https://github.com/XRPLF/rippled/pull/6369))
- Moved sanitizer runtime options out to files. ([#6371](https://github.com/XRPLF/rippled/pull/6371))
- Added dependabot config. ([#6379](https://github.com/XRPLF/rippled/pull/6379))
- Updated default values of base and owner reserve to 1/0.2. ([#6382](https://github.com/XRPLF/rippled/pull/6382))
- Set cmake-format width to 100. ([#6386](https://github.com/XRPLF/rippled/pull/6386))
- Set clang-format width to 100. ([#6387](https://github.com/XRPLF/rippled/pull/6387))
- Bumped tj-actions/changed-files from 46.0.5 to 47.0.4. ([#6394](https://github.com/XRPLF/rippled/pull/6394))
- Bumped actions/setup-python from 5.6.0 to 6.2.0. ([#6395](https://github.com/XRPLF/rippled/pull/6395))
- Bumped actions/upload-artifact from 4.6.2 to 6.0.0. ([#6396](https://github.com/XRPLF/rippled/pull/6396))
- Bumped actions/checkout from 4.3.0 to 6.0.2. ([#6397](https://github.com/XRPLF/rippled/pull/6397))
- Bumped codecov/codecov-action from 5.4.3 to 5.5.2. ([#6398](https://github.com/XRPLF/rippled/pull/6398))
- Built docs in PRs and in private repos. ([#6400](https://github.com/XRPLF/rippled/pull/6400))
- Updated cleanup-workspace to delete old .conan2 dir on macOS. ([#6412](https://github.com/XRPLF/rippled/pull/6412))
- Enabled clang-tidy checks without issues. ([#6414](https://github.com/XRPLF/rippled/pull/6414))
- Made nix hook optional. ([#6431](https://github.com/XRPLF/rippled/pull/6431))
- Bumped actions/upload-artifact from 6.0.0 to 7.0.0. ([#6450](https://github.com/XRPLF/rippled/pull/6450))
- Enabled clang-tidy check for CRTP constructor accessibility. ([#6452](https://github.com/XRPLF/rippled/pull/6452))
- Enabled the clang-tidy `bugprone-inc-dec-in-conditions` check. ([#6455](https://github.com/XRPLF/rippled/pull/6455))
- Enabled the clang-tidy `bugprone-reserved-identifier` check. ([#6456](https://github.com/XRPLF/rippled/pull/6456))
- Enabled the clang-tidy `bugprone-move-forwarding-reference` check. ([#6457](https://github.com/XRPLF/rippled/pull/6457))
- Enabled the clang-tidy `bugprone-unused-local-non-trivial-variable` check. ([#6458](https://github.com/XRPLF/rippled/pull/6458))
- Enabled the clang-tidy `bugprone-return-const-ref-from-parameter` check. ([#6459](https://github.com/XRPLF/rippled/pull/6459))
- Updated pre-commit hooks. ([#6460](https://github.com/XRPLF/rippled/pull/6460))
- Enabled the clang-tidy `switch-missing-default-case` check. ([#6461](https://github.com/XRPLF/rippled/pull/6461))
- Added Git information compile-time info to only one file. ([#6464](https://github.com/XRPLF/rippled/pull/6464))
- Enabled the clang-tidy `bugprone-sizeof-expression` check. ([#6466](https://github.com/XRPLF/rippled/pull/6466))
- Enabled the clang-tidy `bugprone-suspicious-stringview-data-usage` check. ([#6467](https://github.com/XRPLF/rippled/pull/6467))
- Enabled the clang-tidy `bugprone-suspicious-missing-comma` check. ([#6468](https://github.com/XRPLF/rippled/pull/6468))
- Enabled the clang-tidy `bugprone-pointer-arithmetic-on-polymorphic-object` check. ([#6469](https://github.com/XRPLF/rippled/pull/6469))
- Enabled the clang-tidy `bugprone-optional-value-conversion` check. ([#6470](https://github.com/XRPLF/rippled/pull/6470))
- Enabled the clang-tidy `bugprone-too-small-loop-variable` check. ([#6473](https://github.com/XRPLF/rippled/pull/6473))
- Stopped committing generated docs to prevent repo bloat. ([#6474](https://github.com/XRPLF/rippled/pull/6474))
- Enabled the clang-tidy `bugprone-unused-return-value` check. ([#6475](https://github.com/XRPLF/rippled/pull/6475))
- Enabled the clang-tidy `bugprone-use-after-move` check. ([#6476](https://github.com/XRPLF/rippled/pull/6476))
- Built voidstar on amd64 only. ([#6481](https://github.com/XRPLF/rippled/pull/6481))
- Fixed docs deployment for pull requests. ([#6482](https://github.com/XRPLF/rippled/pull/6482))
- Used CMake components for install. ([#6485](https://github.com/XRPLF/rippled/pull/6485))
- Used gersemi instead of ancient cmake-format. ([#6486](https://github.com/XRPLF/rippled/pull/6486))
- Added custom cmake definitions for gersemi. ([#6491](https://github.com/XRPLF/rippled/pull/6491))
- Bumped tj-actions/changed-files from 47.0.4 to 47.0.5. ([#6501](https://github.com/XRPLF/rippled/pull/6501))
- Enabled the clang-tidy `bugprone-unhandled-self-assignment` check. ([#6504](https://github.com/XRPLF/rippled/pull/6504))
- Enabled the clang-tidy `bugprone-unused-raii` check. ([#6505](https://github.com/XRPLF/rippled/pull/6505))
- Used check-pr-title from XRPLF/actions. ([#6506](https://github.com/XRPLF/rippled/pull/6506))
- Updated XRPLF/actions. ([#6508](https://github.com/XRPLF/rippled/pull/6508))
- Fixed clang-tidy issues from merging `unused-local-non-trivial-variable`. ([#6509](https://github.com/XRPLF/rippled/pull/6509))
- Fixed how clang-tidy is run when `.clang-tidy` is changed. ([#6521](https://github.com/XRPLF/rippled/pull/6521))
- Moved Type of Change from PR template to CONTRIBUTING. ([#6522](https://github.com/XRPLF/rippled/pull/6522))
- Fixed rules used to determine when to upload Conan recipes. ([#6524](https://github.com/XRPLF/rippled/pull/6524))
- Added missed clang-tidy `bugprone-inc-dec-conditions` check. ([#6526](https://github.com/XRPLF/rippled/pull/6526))
- Fixed minor issues in the comments. ([#6535](https://github.com/XRPLF/rippled/pull/6535))
- Added comment explaining why `ammLPHolds` is called twice. ([#6546](https://github.com/XRPLF/rippled/pull/6546))
- Used correct format and event for workflows for release tags. ([#6554](https://github.com/XRPLF/rippled/pull/6554))
- Checked for signed commits in PR. ([#6559](https://github.com/XRPLF/rippled/pull/6559))
- Fixed build errors on Windows. ([#6562](https://github.com/XRPLF/rippled/pull/6562))
- Let required runs be triggered by merge group events. ([#6563](https://github.com/XRPLF/rippled/pull/6563))
- Updated check-pr-title action hash. ([#6572](https://github.com/XRPLF/rippled/pull/6572))
- Stopped checking PR title for drafts. ([#6573](https://github.com/XRPLF/rippled/pull/6573))
- Updated `.git-blame-ignore-revs`. ([#6577](https://github.com/XRPLF/rippled/pull/6577))
- Used external action implementation of check-pr-title. ([#6578](https://github.com/XRPLF/rippled/pull/6578))
- Addressed remaining issue after clang-tidy merge. ([#6582](https://github.com/XRPLF/rippled/pull/6582))
- Updated XRPLF/actions. ([#6594](https://github.com/XRPLF/rippled/pull/6594))
- Stopped allowing files larger than 400kb to be added to the repo. ([#6597](https://github.com/XRPLF/rippled/pull/6597))
- Bumped codecov/codecov-action from 5.5.2 to 5.5.3. ([#6615](https://github.com/XRPLF/rippled/pull/6615))
- Moved codegen venv setup into build stage. ([#6617](https://github.com/XRPLF/rippled/pull/6617))
- Showed warning message if user may need to connect to VPN. ([#6619](https://github.com/XRPLF/rippled/pull/6619))
- Updated external dependencies due to upstream merge. ([#6630](https://github.com/XRPLF/rippled/pull/6630))
- Removed the forward declarations that cause build errors when unity build is enabled. ([#6633](https://github.com/XRPLF/rippled/pull/6633))
- Added Linux package builds (DEB + RPM) to CI. ([#6639](https://github.com/XRPLF/rippled/pull/6639))
- Updated some external dependencies. ([#6642](https://github.com/XRPLF/rippled/pull/6642))
- Enabled the remaining clang-tidy `performance` checks. ([#6648](https://github.com/XRPLF/rippled/pull/6648))
- Used unpatched version of soci. ([#6649](https://github.com/XRPLF/rippled/pull/6649))
- Updated sqlite3 to 3.51.0, protobuf to 6.33.5, openssl to 3.6.1, and grpc to 1.78.1. ([#6653](https://github.com/XRPLF/rippled/pull/6653))
- Enabled clang-tidy misc checks. ([#6655](https://github.com/XRPLF/rippled/pull/6655))
- Added conflicting-pr workflow. ([#6656](https://github.com/XRPLF/rippled/pull/6656))
- Added more AI tools to `.gitignore`. ([#6658](https://github.com/XRPLF/rippled/pull/6658))
- Uploaded artifacts only in public repositories. ([#6670](https://github.com/XRPLF/rippled/pull/6670))
- Stopped publishing docs on release branches. ([#6673](https://github.com/XRPLF/rippled/pull/6673))
- Optionally ran clang-tidy via pre-commit. ([#6680](https://github.com/XRPLF/rippled/pull/6680))
- Bumped actions/deploy-pages from 4.0.5 to 5.0.0. ([#6684](https://github.com/XRPLF/rippled/pull/6684))
- Bumped codecov/codecov-action from 5.5.3 to 6.0.0. ([#6685](https://github.com/XRPLF/rippled/pull/6685))
- Fixed clang-tidy header filter. ([#6686](https://github.com/XRPLF/rippled/pull/6686))
- Published docs only in public repos. ([#6687](https://github.com/XRPLF/rippled/pull/6687))
- Used `pull_request_target` to check for signed commits. ([#6697](https://github.com/XRPLF/rippled/pull/6697))
- Enabled the clang-tidy `coreguidelines` checks. ([#6698](https://github.com/XRPLF/rippled/pull/6698))
- Used nudb recipe from the upstream. ([#6701](https://github.com/XRPLF/rippled/pull/6701))
- Allowed uploading artifacts for XRPLF org. ([#6702](https://github.com/XRPLF/rippled/pull/6702))
- Updated XRPLF/actions. ([#6713](https://github.com/XRPLF/rippled/pull/6713))
- Changed conditions for uploading artifacts in public/private/org repos. ([#6734](https://github.com/XRPLF/rippled/pull/6734))
- Bumped actions/upload-pages-artifact from 4.0.0 to 5.0.0. ([#6927](https://github.com/XRPLF/rippled/pull/6927))
- Bumped actions/upload-artifact from 7.0.0 to 7.0.1. ([#6928](https://github.com/XRPLF/rippled/pull/6928))
- Enabled most clang-tidy bugprone checks. ([#6929](https://github.com/XRPLF/rippled/pull/6929))
- Enabled clang-tidy readability checks. ([#6930](https://github.com/XRPLF/rippled/pull/6930))
- Fixed unity build for book step. ([#6942](https://github.com/XRPLF/rippled/pull/6942))
- Enabled clang-tidy include cleaner. ([#6947](https://github.com/XRPLF/rippled/pull/6947))
- Added workflow to check PR description has been filled. ([#6965](https://github.com/XRPLF/rippled/pull/6965))
- Bumped tj-actions/changed-files from 47.0.5 to 47.0.6. ([#6973](https://github.com/XRPLF/rippled/pull/6973))
- Enabled clang-tidy modernize checks. ([#6975](https://github.com/XRPLF/rippled/pull/6975))
- Removed repetitive word in multiple files. ([#6978](https://github.com/XRPLF/rippled/pull/6978))
- Fixed remaining clang-tidy unchecked optionals. ([#6979](https://github.com/XRPLF/rippled/pull/6979))
- Uploaded clang-tidy git diff. ([#6983](https://github.com/XRPLF/rippled/pull/6983))
- Removed empty `Taker.h`. ([#6984](https://github.com/XRPLF/rippled/pull/6984))
- Added `-fix` to clang-tidy invocation. ([#6990](https://github.com/XRPLF/rippled/pull/6990))
- Resolved MSVC Debug build failure in `JobQueue.h` and re-enabled `_CRTDBG_MAP_ALLOC` in CI. ([#6993](https://github.com/XRPLF/rippled/pull/6993))
- Added bashate pre-commit hook to unify bash style. ([#6994](https://github.com/XRPLF/rippled/pull/6994))
- Added pre-commit hook to fix include style. ([#6995](https://github.com/XRPLF/rippled/pull/6995))
- Enabled the clang-tidy `modernize-use-nodiscard` check. ([#7015](https://github.com/XRPLF/rippled/pull/7015))
- Enabled clang-tidy v21 new checks. ([#7031](https://github.com/XRPLF/rippled/pull/7031))
- Gated `-mcmodel` flags to x86_64 in sanitizer builds. ([#7049](https://github.com/XRPLF/rippled/pull/7049))
- Used print-env from XRPLF/actions. ([#7052](https://github.com/XRPLF/rippled/pull/7052))
- Stopped duplicating sanitizer flags. ([#7058](https://github.com/XRPLF/rippled/pull/7058))
- Renamed print-env to print-build-env. ([#7061](https://github.com/XRPLF/rippled/pull/7061))
- Rewrote clang-tidy workflow(s) in a reusable manner. ([#7062](https://github.com/XRPLF/rippled/pull/7062))
- Ignored identifier-naming update in git blame. ([#7066](https://github.com/XRPLF/rippled/pull/7066))
- Used XRPLF/create-issue. ([#7076](https://github.com/XRPLF/rippled/pull/7076))
- Ran pre-commit on diff in clang-tidy workflow. ([#7078](https://github.com/XRPLF/rippled/pull/7078))
- Upgraded Clang sanitizer to `clang-22` and switched `gcc-15` sanitizer to Release. ([#7079](https://github.com/XRPLF/rippled/pull/7079))
- Updated conan.lock. ([#7081](https://github.com/XRPLF/rippled/pull/7081))
- Implemented nix-based Dockerfile for CI. ([#7083](https://github.com/XRPLF/rippled/pull/7083))
- Updated zlib to 1.3.2, sqlite to 3.53.0, libarchive to 3.8.7, jemalloc to 5.3.1, and boost to 1.91.0. ([#7084](https://github.com/XRPLF/rippled/pull/7084))
- Added IWYU pragma for `boost::optional` to fix clang-tidy. ([#7088](https://github.com/XRPLF/rippled/pull/7088))
- Made `.clang-tidy` style a bit more consistent with Clio. ([#7096](https://github.com/XRPLF/rippled/pull/7096))
- Upgraded mako version. ([#7108](https://github.com/XRPLF/rippled/pull/7108))
- Made `Show test failure summary` work with no build dir. ([#7124](https://github.com/XRPLF/rippled/pull/7124))
- Limited nproc on Linux builds temporarily. ([#7132](https://github.com/XRPLF/rippled/pull/7132))
- Added Conan retry. ([#7147](https://github.com/XRPLF/rippled/pull/7147))
- Updated XRPLF/actions. ([#7281](https://github.com/XRPLF/rippled/pull/7281))
- Bumped actions/upload-artifact from 7.0.0 to 7.0.1. ([#7286](https://github.com/XRPLF/rippled/pull/7286))
- Did more clang-tidy identifier renaming. ([#7290](https://github.com/XRPLF/rippled/pull/7290))
- Ran reusable package only in public repos. ([#7293](https://github.com/XRPLF/rippled/pull/7293))
- Updated `clang-tidy` to include `src/tests` directory header check. ([#7307](https://github.com/XRPLF/rippled/pull/7307))
- Added clang to nix images. ([#7308](https://github.com/XRPLF/rippled/pull/7308))
- Fixed RPM prerelease ordering and started xrpld on DEB install. ([#7313](https://github.com/XRPLF/rippled/pull/7313))
- Re-enabled full nproc for Linux. ([#7315](https://github.com/XRPLF/rippled/pull/7315))
- Bumped docker/login-action from 4.1.0 to 4.2.0. ([#7318](https://github.com/XRPLF/rippled/pull/7318))
- Bumped docker/metadata-action from 6.0.0 to 6.1.0. ([#7319](https://github.com/XRPLF/rippled/pull/7319))
- Bumped docker/build-push-action from 7.1.0 to 7.2.0. ([#7320](https://github.com/XRPLF/rippled/pull/7320))
- Bumped codecov/codecov-action from 6.0.0 to 6.0.1. ([#7321](https://github.com/XRPLF/rippled/pull/7321))
- Bumped docker/setup-buildx-action from 4.0.0 to 4.1.0. ([#7322](https://github.com/XRPLF/rippled/pull/7322))
- Fixed clang-tidy pre-commit hook to locate `compile_commands.json` from repo root. ([#7325](https://github.com/XRPLF/rippled/pull/7325))
- Used shfmt instead of bashate. ([#7326](https://github.com/XRPLF/rippled/pull/7326))
- Pinned Python packages for codegen using uv. ([#7329](https://github.com/XRPLF/rippled/pull/7329))
- Pushed docker images only in XRPLF/rippled. ([#7330](https://github.com/XRPLF/rippled/pull/7330))
- Ran PR title and description checks on staging and release branches. ([#7331](https://github.com/XRPLF/rippled/pull/7331))
- Ran shfmt on workflows, actions, and markdown bash code. ([#7333](https://github.com/XRPLF/rippled/pull/7333))
- Bumped codecov/codecov-action from 6.0.1 to 7.0.0. ([#7426](https://github.com/XRPLF/rippled/pull/7426))
- Removed auto-update script and updated RPM version. ([8e3eabc](https://github.com/XRPLF/rippled/commit/8e3eabc398f1400dec1a9c4c63d9b2dabc0ad78d))
- Adjusted xrpld systemd service. ([96d0563](https://github.com/XRPLF/rippled/commit/96d0563ea644ba5bb28e08e37dc7752d05a204fb))


## Credits

The following RippleX teams and GitHub users contributed to this release:

- RippleX Engineering
- RippleX Docs
- RippleX Product
- @Bronek
- @Kassaking7
- @andrzej-neti
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

We welcome reviews of the `xrpld` code and urge researchers to responsibly disclose any issues they may find.

For more information, see:

- [Ripple's Bug Bounty Program](https://ripple.com/legal/bug-bounty/)
- [`xrpld` Security Policy](https://github.com/XRPLF/rippled/blob/develop/SECURITY.md)
