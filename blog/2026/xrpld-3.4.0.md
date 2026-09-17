---
category: 2026
date: "2026-09-16"
template: '../../@theme/templates/blogpost'
seo:
    title: Introducing XRP Ledger version 3.4.0
    description: xrpld version 3.4.0 is now available. This version introduces the LendingProtocolV1_1 and fixCleanup3_4_0 amendments, retires the fixAMMOverflowOffer amendment, and includes assorted bug fixes.
labels:
    - xrpld Release Notes
markdown:
    editPage:
        hide: true
---
# Introducing XRP Ledger version 3.4.0

Version 3.4.0 of `xrpld`, the reference server implementation of the XRP Ledger protocol, is now available.

This release introduces two new amendments, retires an amendment, and adds various bug fixes and build improvements:

- **LendingProtocolV1_1**: Extends Single Asset Vaults and the Lending Protocol with closed-ended vaults and cash-basis accounting.
- **fixCleanup3_4_0**: Bundles amendment-gated fixes.
- **fixAMMOverflowOffer**: This amendment is retired, making it a permanent part of the protocol.

With this release, the `xrpld` DEB and RPM packages are now hosted at `packages.xrplf.org` with an XRPLF signing key. For full installation instructions, see: [Installing xrpld](https://github.com/XRPLF/rippled/blob/release/3.4.x/docs/install.md).


## Action Required

If you run an XRP Ledger server, upgrade to version 3.4.0 as soon as possible to ensure service continuity.


## Install / Upgrade

On supported platforms, see the [instructions on installing or updating `xrpld`](../../docs/infrastructure/installation/index.md).

| Package | SHA-256 |
|:--------|:--------|
| [RPM for Red Hat / CentOS (x86-64)](https://packages.xrplf.org/repository/rpm-stable/x86_64/xrpld-3.4.0-1.el9.x86_64.rpm) | `b826d5a5ab935aa20c60e9bef9c76909721f1ec3a1d556ced61bafe54f27e8c3` |
| [DEB for Ubuntu / Debian (x86-64)](https://packages.xrplf.org/repository/deb-stable/pool/x/xrpld/xrpld_3.4.0-1_amd64.deb) | `4dc40a21b12b7d21f2760b16545c1d842962a96978dd3199eb8de9aa0aff8339` |

For other platforms, please [build from source](https://github.com/XRPLF/rippled/blob/3.4.0/BUILD.md). The most recent commit in the git log should be the change setting the version:

```text
commit 4a4fded2eba11427c48ce3f24d9c1aea5e7a9d17
Author: Bart <bthomee@users.noreply.github.com>
Date:   Wed Sep 16 12:10:08 2026 -0400

    chore: Bump version to 3.4.0
```


## Full Changelog


### Amendments

- **LendingProtocolV1_1**: Extends the `LendingProtocol` and `SingleAssetVault` amendments with a new _closed-ended_ vault and _cash-basis_ accounting. Closed-ended vaults have a defined lifecycle split into three phases: subscription, investment, and redemption; these phases determine when assets can be deposited into vaults, loans can be originated, and when assets can be redeemed. After the amendment is enabled, new loan brokers can only be created against closed-ended vaults. Cash-basis accounting changes vault accounting to only realize interest as income when payments are actually made, shifting from an _instant interest recognition_ model where all scheduled interest was recognized at the time of loan origination. ([#7817](https://github.com/XRPLF/rippled/pull/7817), [#7921](https://github.com/XRPLF/rippled/pull/7921))
- **fixCleanup3_4_0**: Bundles these fixes for the 3.4.0 release:
    - Applies the `asfDisallowIncomingTrustline` blocker to `OfferCreate`, so an account without a trust line can no longer use an offer to receive tokens from an issuer that set the flag. ([#6307](https://github.com/XRPLF/rippled/pull/6307))
    - Excludes deleted domain offers from the Permissioned DEX invariant, so replacing an offer in one domain with an offer in another no longer trips `tecINVARIANT_FAILED`. ([#7387](https://github.com/XRPLF/rippled/pull/7387))
    - Prevents `AMMClawback` from silently recovering zero when integer MPT rounding floors the amount, instead of burning the holder's LP tokens for nothing. ([#7704](https://github.com/XRPLF/rippled/pull/7704))
    - Lets `AMMClawback` bypass the owner-reserve check when it must auto-create the paired asset holding, so a compliance clawback is not blocked or vetoed by reserve requirements. ([#7796](https://github.com/XRPLF/rippled/pull/7796))
    - Rejects `tfMPTUnauthorize` on an individually locked `MPToken` with `tecNO_PERMISSION`. ([#8004](https://github.com/XRPLF/rippled/pull/8004))
    - Enforces the `ValidMPTBalanceChanges` and `ValidMPTTransfer` invariants, which were previously log-only, and extends them to hold even when a transaction fails. ([#7889](https://github.com/XRPLF/rippled/pull/7889))
    - Rejects fake-XRP NFT offer amounts, exempts an IOU issuer from their own global freeze when creating an NFToken offer denominated in their own currency, and tightens permissioned DEX domain checks. ([#7749](https://github.com/XRPLF/rippled/pull/7749))
    - Recycles the escrow owner reserve in `EscrowCancel` and `EscrowFinish`, so returning IOUs to an owner at the reserve boundary no longer fails with `tecNO_LINE_INSUF_RESERVE`. ([#8142](https://github.com/XRPLF/rippled/pull/8142))
    - Adds distinct signing hash prefixes for `sfCounterpartySignature` and `sfSponsorSignature`, so a signature made for one role can no longer be replayed as another. ([#8162](https://github.com/XRPLF/rippled/pull/8162))
    - Adds precision and rounding fixes across `VaultDeposit`, `VaultWithdraw`, and `VaultClawback`, so a vault's tracked total assets, available assets, and share supply stay consistent.
    - Refines freeze, authorization, credential, and destination handling for Single Asset Vaults and the Lending Protocol; for example, exempting loan defaults from asset freeze, refusing pseudo-accounts where they cannot participate, and validating permissioned-domain withdrawal destinations.
    - Rejects `PaymentBurn` payments that cross a zero balance. ([`c8e767a`](https://github.com/XRPLF/rippled/commit/c8e767a))
- The `fixAMMOverflowOffer` amendent is retired. ([#7537](https://github.com/XRPLF/rippled/pull/7537))


### Features

- Added `nftoken_id`, `nftoken_offer_id`, and `delivered_amount` (for `AccountDelete` transactions) to `ledger` RPC transaction metadata, matching the `tx` and `account_tx` methods. ([#5706](https://github.com/XRPLF/rippled/pull/5706))
- Enforced MPT `CanTransfer` on AMM LPToken transfers, so a non-transferable pool MPT blocks LPToken movement between holders. ([#7418](https://github.com/XRPLF/rippled/pull/7418))
- Paused online deletion when there are gaps in recent ledger history, so a node stays more up to date. ([#5531](https://github.com/XRPLF/rippled/pull/5531))


### Bug Fixes

- Added a null check for account object reads in `account_objects`. ([#7717](https://github.com/XRPLF/rippled/pull/7717))
- Used consistent endianness when serializing the MPT `STIssue` sequence. ([#7429](https://github.com/XRPLF/rippled/pull/7429))
- Deduplicated oracle entries in the `get_aggregate_price` method. ([#6586](https://github.com/XRPLF/rippled/pull/6586))
- Added the missing `value_type` to JSON iterators to fix GCC 13 builds. ([#7907](https://github.com/XRPLF/rippled/pull/7907))
- Removed `explicit` from `std`/`boost` hash specialization default constructors to fix GCC 15 builds. ([#8100](https://github.com/XRPLF/rippled/pull/8100))
- Validated the buy/sell flag in NFT RPC input. ([#7725](https://github.com/XRPLF/rippled/pull/7725))
- Fixed assorted MPT and DEX issues. ([#7299](https://github.com/XRPLF/rippled/pull/7299))
- Fixed issues from the MPT/DEX audit and attackathon reports (phase 1). ([#7334](https://github.com/XRPLF/rippled/pull/7334))
- Allowed `OverrideFreeze` to bypass individual and deep freeze on AMM trust lines. ([#6959](https://github.com/XRPLF/rippled/pull/6959))
- Prevented AMM auction slots from being acquired at zero cost when the trading fee is zero. ([#7430](https://github.com/XRPLF/rippled/pull/7430))
- Fixed the `AMMClawback` exact LP token boundary case. ([#7373](https://github.com/XRPLF/rippled/pull/7373))
- Added `ValidPermissionedDEX` invariant tracking for a fully consumed offer. ([#6736](https://github.com/XRPLF/rippled/pull/6736))
- Enabled reserve checking when ending a sponsorship. ([#8044](https://github.com/XRPLF/rippled/pull/8044))
- Fixed `OfferCreate` and `Payment` never deleting expired permissioned DEX credentials. ([#6827](https://github.com/XRPLF/rippled/pull/6827))
- Validated the `account`/`ident` field type in `gateway_balances`. ([#7655](https://github.com/XRPLF/rippled/pull/7655))
- Validated the `account_lines` `peer` field type. ([#7728](https://github.com/XRPLF/rippled/pull/7728))
- Added a zero-keylet check in credential handling. ([#7971](https://github.com/XRPLF/rippled/pull/7971))
- Added an assertion for `account_info` flags. ([#7987](https://github.com/XRPLF/rippled/pull/7987))
- Rejected an inner node claimed at leaf depth in `verifyProofPath`. ([#7940](https://github.com/XRPLF/rippled/pull/7940))
- Clamped the depth used to index `selectBranch`'s key byte. ([#7941](https://github.com/XRPLF/rippled/pull/7941))
- Used a hardened hash on the `STPathElement`. ([`eae0a35`](https://github.com/XRPLF/rippled/commit/eae0a35))
- Prevented `simulate` from updating the order book database. ([`ea6226b`](https://github.com/XRPLF/rippled/commit/ea6226b))
- Trimmed unknown fields when parsing incoming peer protobuf messages. ([`0db7b76`](https://github.com/XRPLF/rippled/commit/0db7b76))
- Fixed an unbounded database seek via `TMGetLedger`. ([`6099940`](https://github.com/XRPLF/rippled/commit/6099940))
- Capped the `TMTransactions` list size and charged a fee for undeserializable transactions. ([`9aebb5e`](https://github.com/XRPLF/rippled/commit/9aebb5e))
- Made `calculateBaseFee` exception-safe. ([`3e4e56d`](https://github.com/XRPLF/rippled/commit/3e4e56d))
- Skipped the `CheckCash` limit waiver for the issuer. ([`8c594c7`](https://github.com/XRPLF/rippled/commit/8c594c7))
- Rejected variable-length prefixes the encoder cannot write. ([`00eeb0a`](https://github.com/XRPLF/rippled/commit/00eeb0a))


### Refactors

- Used `SeqProxy` instead of `uint32` for all sequence-based keylets. ([#7890](https://github.com/XRPLF/rippled/pull/7890))
- Acted on TODOs unblocked by C++23. ([#7990](https://github.com/XRPLF/rippled/pull/7990))
- Replaced `boost::lexical_cast` with existing alternatives. ([#7991](https://github.com/XRPLF/rippled/pull/7991))
- Removed `operator!=` overloads that C++20 synthesizes. ([#7994](https://github.com/XRPLF/rippled/pull/7994))
- Replaced Boost `trim` and `to_lower` with `libxrpl` helpers. ([#7995](https://github.com/XRPLF/rippled/pull/7995))
- Used `std::format` instead of `boost::format` where it fits. ([#7996](https://github.com/XRPLF/rippled/pull/7996))
- Converted `boost::beast::string_view` to `std::string_view`. ([#6306](https://github.com/XRPLF/rippled/pull/6306))
- Replaced `boost::filesystem` with `std::filesystem` across the codebase. ([#7012](https://github.com/XRPLF/rippled/pull/7012))
- Collapsed `transactions.macro` settings into a `TxSettings` struct. ([#8001](https://github.com/XRPLF/rippled/pull/8001))
- Rewrote `Transactor::operator()` to use early returns. ([#8003](https://github.com/XRPLF/rippled/pull/8003))
- Used unsigned integers for branch-related SHAMap operations. ([#7938](https://github.com/XRPLF/rippled/pull/7938))
- Added `SHAMapNodeID::isPrefixOf`. ([#7939](https://github.com/XRPLF/rippled/pull/7939))
- Removed support for peer protocol version 2.1. ([#7432](https://github.com/XRPLF/rippled/pull/7432))
- Extracted invariant invocation into a free `checkInvariants` runner. ([#7404](https://github.com/XRPLF/rippled/pull/7404))
- Replaced the node ID with node depth in `TMLedgerNode`, introducing peer protocol version 2.3. ([#6353](https://github.com/XRPLF/rippled/pull/6353))
- Optimized MPT freeze checks to reduce redundant state reads. ([#7411](https://github.com/XRPLF/rippled/pull/7411))
- Sped up `Number` addition for drastically different exponents. ([#7825](https://github.com/XRPLF/rippled/pull/7825))
- Removed the pseudo-account field filter from `isPseudoAccount`. ([#8042](https://github.com/XRPLF/rippled/pull/8042))
- Added an assertion that default fields are not explicitly set to their default value when serializing. ([#6267](https://github.com/XRPLF/rippled/pull/6267))
- Marked unreachable branches in Confidential Transfer with `UNREACHABLE`. ([#7903](https://github.com/XRPLF/rippled/pull/7903))
- Renamed CamelCase namespaces to snake_case. ([#7933](https://github.com/XRPLF/rippled/pull/7933))


### Testing

- Added a Google Benchmark dependency and migrated the `nodestore` timing test to a benchmark. ([#7317](https://github.com/XRPLF/rippled/pull/7317))
- Added an RAII class to manage the `env.parseFailureExpected` flag. ([#7669](https://github.com/XRPLF/rippled/pull/7669))
- Modularized the PeerFinder component and migrated its tests from Beast to GTest and GMock. ([#7054](https://github.com/XRPLF/rippled/pull/7054))
- Migrated `csf` and consensus Beast non-JTx tests to GTest. ([#7046](https://github.com/XRPLF/rippled/pull/7046))
- Improved the server status test to not race and randomly fail. ([#7304](https://github.com/XRPLF/rippled/pull/7304))
- Migrated `nodestore` tests from Beast to GTest. ([#7292](https://github.com/XRPLF/rippled/pull/7292))
- Resolved GTest migration follow-ups (first pass). ([#7884](https://github.com/XRPLF/rippled/pull/7884))
- Resolved GTest migration follow-ups (second pass). ([#7888](https://github.com/XRPLF/rippled/pull/7888))
- Completed trivial GTest migrations. ([#7865](https://github.com/XRPLF/rippled/pull/7865))
- Moved semantic version tests to GTest. ([#7872](https://github.com/XRPLF/rippled/pull/7872))
- Moved lexical cast tests to GTest. ([#7873](https://github.com/XRPLF/rippled/pull/7873))
- Added confidential MPT bulletproof tests. ([#7816](https://github.com/XRPLF/rippled/pull/7816))
- Made the Drop50 message drop deterministic in the `LedgerReplayer` test. ([#7964](https://github.com/XRPLF/rippled/pull/7964))
- Used `std::string::starts_with`/`ends_with` instead of Boost in tests. ([#7992](https://github.com/XRPLF/rippled/pull/7992))
- Added a `ProtocolMessage` harness for testing `TMPing`. ([`b190f2b`](https://github.com/XRPLF/rippled/commit/b190f2b))


### Documentation

- Documented a fix for `command not found: nix` on macOS. ([#7951](https://github.com/XRPLF/rippled/pull/7951))
- Rearranged and simplified the build, nix, and environment docs. ([#7985](https://github.com/XRPLF/rippled/pull/7985))
- Removed unreferenced legacy documents. ([#7989](https://github.com/XRPLF/rippled/pull/7989))
- Rewrote the install guide. ([#8048](https://github.com/XRPLF/rippled/pull/8048))
- Fixed the yum installation base URL. ([#8066](https://github.com/XRPLF/rippled/pull/8066))
- Added `AGENTS.md`/`CLAUDE.md` for AI coding agent guidance. ([#8067](https://github.com/XRPLF/rippled/pull/8067))
- Backfilled `API-CHANGELOG.md` for versions 3.1.1 through 3.3.0. ([#8159](https://github.com/XRPLF/rippled/pull/8159))


### CI/Build

- Added Rust to CI. ([#7808](https://github.com/XRPLF/rippled/pull/7808))
- Added Rust–C++ CMake and CI integration. ([#7034](https://github.com/XRPLF/rippled/pull/7034))
- Worked around Boost compiler resolution inside the Nix environment. ([#7826](https://github.com/XRPLF/rippled/pull/7826))
- Built a separate pre-commit Docker image. ([#7831](https://github.com/XRPLF/rippled/pull/7831))
- Used an in-house image for pre-commit. ([#7610](https://github.com/XRPLF/rippled/pull/7610))
- Added `CODEOWNERS` for CI-related changes. ([#7832](https://github.com/XRPLF/rippled/pull/7832))
- Improved test debuggability in CI. ([#7619](https://github.com/XRPLF/rippled/pull/7619))
- Added Doxygen to the pre-commit image. ([#7836](https://github.com/XRPLF/rippled/pull/7836))
- Added Cargo to the pre-commit image. ([#7835](https://github.com/XRPLF/rippled/pull/7835))
- Updated the pre-commit image. ([#7838](https://github.com/XRPLF/rippled/pull/7838))
- Bumped `actions/setup-python` from 6.3.0 to 7.0.0. ([#7830](https://github.com/XRPLF/rippled/pull/7830))
- Used `rust-overlay` to bring Rust into Nix. ([#7837](https://github.com/XRPLF/rippled/pull/7837))
- Created versioned compiler and tooling symlinks in Nix environments. ([#7844](https://github.com/XRPLF/rippled/pull/7844))
- Cleaned up grammar in the PR template. ([#7846](https://github.com/XRPLF/rippled/pull/7846))
- Updated `XRPLF/actions`. ([#7849](https://github.com/XRPLF/rippled/pull/7849))
- Updated the CI image. ([#7850](https://github.com/XRPLF/rippled/pull/7850), [#8121](https://github.com/XRPLF/rippled/pull/8121))
- Added `llvm-tools-preview` to the Rust toolchain. ([#7853](https://github.com/XRPLF/rippled/pull/7853))
- Used a custom libc in the dev shell by default. ([#7852](https://github.com/XRPLF/rippled/pull/7852))
- Patched the binary in the local Linux Nix environment. ([#7859](https://github.com/XRPLF/rippled/pull/7859))
- Verified tooling versions for Nix-managed environments. ([#7862](https://github.com/XRPLF/rippled/pull/7862))
- Fixed the Clang version in the dev shell. ([#7860](https://github.com/XRPLF/rippled/pull/7860))
- Bumped `actions/checkout` from 7.0.0 to 7.0.1. ([#7871](https://github.com/XRPLF/rippled/pull/7871))
- Updated the CI image and prepare-runner action. ([#7874](https://github.com/XRPLF/rippled/pull/7874))
- Grouped GitHub Actions Dependabot updates. ([#7876](https://github.com/XRPLF/rippled/pull/7876))
- Changed the `server_definitions` upload config name. ([#7878](https://github.com/XRPLF/rippled/pull/7878))
- Made clang-tidy format files using clang-format rules. ([#7880](https://github.com/XRPLF/rippled/pull/7880))
- Watched `nix/*.nix` files for direnv cache invalidation. ([#7948](https://github.com/XRPLF/rippled/pull/7948))
- Fixed the build on macOS 15 and the Nix environment. ([#7953](https://github.com/XRPLF/rippled/pull/7953))
- Ran coverage first in CI. ([#7917](https://github.com/XRPLF/rippled/pull/7917))
- Used a separate benchmark filter. ([#7919](https://github.com/XRPLF/rippled/pull/7919))
- Generated `protocol_autogen` only once in CI. ([#7918](https://github.com/XRPLF/rippled/pull/7918))
- Removed Corrosion from Nix. ([#7982](https://github.com/XRPLF/rippled/pull/7982))
- Removed protobuf dependencies from Nix. ([#7984](https://github.com/XRPLF/rippled/pull/7984))
- Installed Conan configuration and profiles inside the Nix dev shell. ([#7997](https://github.com/XRPLF/rippled/pull/7997))
- Reworked linker warnings across build scenarios. ([#7974](https://github.com/XRPLF/rippled/pull/7974))
- Fixed GCC 14 compilation. ([#7981](https://github.com/XRPLF/rippled/pull/7981))
- Respected the lld linker when it is auto-selected. ([#8011](https://github.com/XRPLF/rippled/pull/8011))
- Added curl to the packaging images. ([#8024](https://github.com/XRPLF/rippled/pull/8024))
- Fixed versioned tools for exec wrappers. ([#8027](https://github.com/XRPLF/rippled/pull/8027))
- Checked versioned tools in `check-tools` and improved its output. ([#8030](https://github.com/XRPLF/rippled/pull/8030))
- Ran Nix macOS builds in CI and denied Nix store references. ([#8023](https://github.com/XRPLF/rippled/pull/8023))
- Used AlmaLinux for the RHEL packaging image. ([#8045](https://github.com/XRPLF/rippled/pull/8045))
- Signed RPM packages. ([#8046](https://github.com/XRPLF/rippled/pull/8046))
- Published Debian and RPM packages from GitHub directly. ([#8031](https://github.com/XRPLF/rippled/pull/8031))
- Compressed the RPM payload with zstd. ([#8047](https://github.com/XRPLF/rippled/pull/8047))
- Stopped caching Cargo binaries. ([#8062](https://github.com/XRPLF/rippled/pull/8062))
- Used the Debian `any` distribution and the signed, hosted RPM repo. ([#8053](https://github.com/XRPLF/rippled/pull/8053))
- Bumped `cxx` from 1.0.198 to 1.0.199. ([#8050](https://github.com/XRPLF/rippled/pull/8050))
- Suppressed MSVC linker warning LNK4099. ([#8049](https://github.com/XRPLF/rippled/pull/8049))
- Saved the Cargo cache only from `develop` by default. ([#8063](https://github.com/XRPLF/rippled/pull/8063))
- Upgraded the Rust toolchain to 1.97.1. ([#8105](https://github.com/XRPLF/rippled/pull/8105))
- Updated the packaging images and added Python. ([#8106](https://github.com/XRPLF/rippled/pull/8106))
- Added `rust-toolchain.toml` to `.envrc`. ([#8107](https://github.com/XRPLF/rippled/pull/8107))
- Reimplemented packaging in Python. ([#8109](https://github.com/XRPLF/rippled/pull/8109))
- Renamed release channels (`unstable`→`rc`, `experimental`→`beta`). ([#8116](https://github.com/XRPLF/rippled/pull/8116))
- Made `packaging_config` part of the strategy-matrix config. ([#8115](https://github.com/XRPLF/rippled/pull/8115))
- Made packaging reusable. ([#8126](https://github.com/XRPLF/rippled/pull/8126))
- Updated `release-info` to produce a better `pkg_release`. ([#8131](https://github.com/XRPLF/rippled/pull/8131))
- Corrected and simplified Linux packaging. ([#8165](https://github.com/XRPLF/rippled/pull/8165))
- Updated the prepare-runner SHA. ([#8168](https://github.com/XRPLF/rippled/pull/8168))
- Updated the pre-commit SHA. ([#8169](https://github.com/XRPLF/rippled/pull/8169))
- Verified the glibc version was determined in the Debian package. ([#8170](https://github.com/XRPLF/rippled/pull/8170))
- Stopped using `github.workspace` to speed up gcovr. ([#8173](https://github.com/XRPLF/rippled/pull/8173))
- Used consistent heading levels in the PR template. ([#8155](https://github.com/XRPLF/rippled/pull/8155))
- Added assert-enabled builds and packages. ([`c0d0fd0`](https://github.com/XRPLF/rippled/commit/c0d0fd0))
- Fixed test installation on Debian 11 due to EOL. ([`76da5d4`](https://github.com/XRPLF/rippled/commit/76da5d4))
- Added a missing script to the Conan package. ([`ebd810b`](https://github.com/XRPLF/rippled/commit/ebd810b))



## Credits

The following RippleX teams and GitHub users contributed to this release:

- RippleX Engineering
- RippleX Docs
- RippleX Product
- @BraedonKlock
- @Kassaking7
- @andrzej-neti
- @bryanjiang1
- @dangell7
- @klemenfn
- @luisfernandomendozav
- @marek-foss-neti
- @mvanhorn
- @tyalymov


## Bug Bounties and Responsible Disclosures

We welcome reviews of the `xrpld` code and urge researchers to responsibly disclose any issues they may find.

For more information, see:

- [Ripple's Bug Bounty Program](https://ripple.com/legal/bug-bounty/)
- [`xrpld` Security Policy](https://github.com/XRPLF/rippled/blob/3.4.0/SECURITY.md)
