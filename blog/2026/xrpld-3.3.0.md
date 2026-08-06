---
category: 2026
date: "2026-08-06"
template: '../../@theme/templates/blogpost'
seo:
    title: Introducing XRP Ledger version 3.3.0
    description: xrpld version 3.3.0 is now available. This version introduces the BatchV1_1, ConfidentialTransfer, DynamicMPT, PermissionDelegationV1_1, Sponsor, and fixCleanup3_3_0 amendments, retires several long-active amendments, and includes assorted bug fixes.
labels:
    - xrpld Release Notes
markdown:
    editPage:
        hide: true
---
# Introducing XRP Ledger version 3.3.0

Version 3.3.0 of `xrpld`, the reference server implementation of the XRP Ledger protocol, is now available.

This release introduces several new amendments alongside bug fixes and build improvements. The new amendments are:

- **BatchV1_1**: Atomic batch transactions (XLS-56).
- **ConfidentialTransfer**: Privacy-preserving Multi-Purpose Token transfers (XLS-0096).
- **DynamicMPT**: Multi-Purpose Token properties that issuers can make permanently immutable (XLS-94).
- **PermissionDelegationV1_1**: Granular account permission delegation.
- **Sponsor**: Reserve and transaction sponsoring (XLS-68).
- **fixCleanup3_3_0**: A bundle of amendment-gated bug fixes.

It also retires the long-active `Clawback`, `fixDisallowIncomingV1`, `fixInnerObjTemplate`, `fixNFTokenReserve`, and `fixUniversalNumber` amendments, making them a permanent part of the protocol.


## Action Required

If you run an XRP Ledger server, upgrade to version 3.3.0 as soon as possible to ensure service continuity.


## Install / Upgrade

On supported platforms, see the [instructions on installing or updating `xrpld`](../../docs/infrastructure/installation/index.md).

| Package | SHA-256 |
|:--------|:--------|
| [RPM for Red Hat / CentOS (x86-64)](https://repos.ripple.com/repos/rippled-rpm/stable/xrpld-3.3.0-1.el9.x86_64.rpm) | `TODO` |
| [DEB for Ubuntu / Debian (x86-64)](https://repos.ripple.com/repos/rippled-deb/pool/stable/xrpld_3.3.0-1_amd64.deb) | `TODO` |

For other platforms, please [build from source](https://github.com/XRPLF/rippled/blob/release/3.3.x/BUILD.md). The most recent commit in the git log should be the change setting the version:

```text
commit 8dce2d03ffd7aca9740f3945b12049141e1a9312
Author: Ayaz Salikhov <asalikhov@ripple.com>
Date:   Thu Aug 6 15:34:59 2026 +0100

    chore: Bump version to 3.3.0
```


## Full Changelog


### Amendments

- **BatchV1_1**: Adds the `Batch` transaction (XLS-56), which lets an account submit up to 8 inner transactions that apply atomically as a single unit, enabling patterns such as atomic swaps. This is the bug-fixed replacement for the `Batch` amendment disabled in v3.1.1: signer signatures are now bound to the outer account and sequence, the `tfInnerBatchTxn` flag is rejected from the network regardless of amendment state, batch signers must be strictly ascending and unique, and the raw-transaction array is bounded before hashing. ([#6446](https://github.com/XRPLF/rippled/pull/6446), enabled by [#7698](https://github.com/XRPLF/rippled/pull/7698))
- **ConfidentialTransfer**: Adds privacy-preserving transfers for Multi-Purpose Tokens (XLS-0096), including the `ConfidentialMPTConvert`, `ConfidentialMPTSend`, `ConfidentialMPTMergeInbox`, `ConfidentialMPTConvertBack`, and `ConfidentialMPTClawback` transactions, encrypted balances, and on-chain cryptographic proof verification (Pedersen commitments, range proofs, and equality proofs) via the `mpt-crypto` library. `ConfidentialMPTConvert` cannot be delegated; the other confidential MPT transactions can. ([#5860](https://github.com/XRPLF/rippled/pull/5860), enabled by [#7698](https://github.com/XRPLF/rippled/pull/7698))
- **DynamicMPT**: Lets Multi-Purpose Token issuers make selected properties permanently immutable (XLS-94), either when creating the issuance or later with an `MPTokenIssuanceSet` transaction. The `ImmutableFlags` field is additive: each declaration adds to the properties already fixed on the issuance and can never be cleared, so an issuer can finalize a token's design in stages. ([#7439](https://github.com/XRPLF/rippled/pull/7439))
- **PermissionDelegationV1_1**: Enforces a granular permission template for each delegated transaction, so that only specific fields or flags may appear under a granular permission. This is the fixed replacement for the previously disabled permission delegation amendment. ([#6613](https://github.com/XRPLF/rippled/pull/6613))
- **Sponsor**: Introduces fee and reserve sponsoring (XLS-68), letting one account pre-fund another account's transaction costs and reserve requirements. Adds the `SponsorshipSet` and `SponsorshipTransfer` transactions, the `Sponsorship` ledger entry that holds a sponsor's pre-funded budget for a given sponsee, and the `Sponsor`, `SponsorFlags`, and `SponsorSignature` common fields for drawing on that budget. Sponsored ledger entries record their sponsor, so the reserve counts against the sponsor rather than the owner. A `Payment` that creates an account can also sponsor the new account's reserve directly with the `tfSponsorCreatedAccount` flag. `SponsorshipSet` specifies its budgets as deltas, using the `FeeAmountDelta` and `RemainingOwnerCountDelta` fields, so you can top up or draw down a pool without reading its current values first. ([#5887](https://github.com/XRPLF/rippled/pull/5887))
- **fixCleanup3_3_0**: Bundles amendment-gated bug fixes for the 3.3.0 release.
    - Unifies freeze checks across pseudo-account-backed transactors (Vaults, AMMs, and LoanBrokers) so deposits and withdrawals apply consistent regular-freeze and deep-freeze semantics, and returns the correct error codes. ([#7382](https://github.com/XRPLF/rippled/pull/7382))
    - Rejects an all-zero `CheckID` in `CheckCash` and `CheckCancel` at preflight with `temMALFORMED` instead of failing later with `tecNO_ENTRY`. ([#7685](https://github.com/XRPLF/rippled/pull/7685))
    - Keeps hybrid offers in the open order book when the account that placed them loses access to the permissioned domain. ([#6843](https://github.com/XRPLF/rippled/pull/6843))
    - Stops Automated Market Maker liquidity being included in quality estimates for permissioned DEX order books. ([#6853](https://github.com/XRPLF/rippled/pull/6853))
    - Returns `tecAMM_FAILED` from `AMMWithdraw` instead of dividing by zero when the withdrawal specifies an `EPrice`. ([#6989](https://github.com/XRPLF/rippled/pull/6989))
    - Adds a precision loss check to `AMMDeposit`, `AMMWithdraw`, and `AMMClawback` when the `fixAMMv1_3` amendment is also enabled.
    - Changes the `ValidAMM` invariant so an AMM can only be deleted by an `AMMWithdraw`, `AMMClawback`, or `AMMDelete` transaction. ([#7295](https://github.com/XRPLF/rippled/pull/7295))
    - Adds the `ObjectHasPseudoAccount` invariant, which checks that deleting a ledger entry backed by a pseudo-account also deletes that pseudo-account. ([#7445](https://github.com/XRPLF/rippled/pull/7445))
    - Adds further precision and rounding fixes for Single Asset Vaults and the Lending Protocol.
    - Changes transactions signed by a pseudo-account to fail with `tefBAD_AUTH`. This check also takes effect if the `LendingProtocol` or `BatchV1_1` amendment is enabled.
    - Rejects a [pseudo-account](../../docs/concepts/accounts/pseudo-accounts.md) named in a role it cannot fill, returning `tecPSEUDO_ACCOUNT` where the transaction previously succeeded or returned `tecNO_PERMISSION`. This affects `CredentialCreate`, `DepositPreauth`, `DelegateSet`, and `SponsorshipSet`.
- The following amendments are retired:
    - `Clawback` ([#7353](https://github.com/XRPLF/rippled/pull/7353))
    - `fixDisallowIncomingV1` ([#7364](https://github.com/XRPLF/rippled/pull/7364))
    - `fixInnerObjTemplate` ([#7368](https://github.com/XRPLF/rippled/pull/7368))
    - `fixNFTokenReserve` ([#7367](https://github.com/XRPLF/rippled/pull/7367))
    - `fixUniversalNumber` ([#5962](https://github.com/XRPLF/rippled/pull/5962))


### Features

- Added a `delegate` filter parameter to the `account_tx` method. ([#6126](https://github.com/XRPLF/rippled/pull/6126))
- Packaged `validator-keys` inside the server distribution.


### Bug Fixes

- Added a zero NFT offer ID check for `NFTokenCancelOffer`. ([#7391](https://github.com/XRPLF/rippled/pull/7391))
- Disabled AMM creation using vault shares as a pool asset. ([#7666](https://github.com/XRPLF/rippled/pull/7666))
- Rejected delegating permissions to pseudo-accounts. ([#7597](https://github.com/XRPLF/rippled/pull/7597))
- Blocked delegated transactions from being queued. ([#7640](https://github.com/XRPLF/rippled/pull/7640))
- Used trust line balance direction to validate IOU `PaymentMint`/`PaymentBurn`. ([#7584](https://github.com/XRPLF/rippled/pull/7584))
- Strengthened `Clawback` invariant checks for MPT balances. ([#7285](https://github.com/XRPLF/rippled/pull/7285))
- Moved `AMMInvariant` `weakInvariantCheck` logic into the transaction. ([#7032](https://github.com/XRPLF/rippled/pull/7032))
- Added RPC validation checks on the `amm_info` `account` and `amm_account` fields. ([#7324](https://github.com/XRPLF/rippled/pull/7324))
- Added an amendment sponsor for the `AccountRootsDeletedClean` invariant. ([#7801](https://github.com/XRPLF/rippled/pull/7801))
- Documented and asserted that `after` is never null in invariants. ([#7354](https://github.com/XRPLF/rippled/pull/7354))
- Handled rounding just above `kMaxRep` more accurately. ([#7389](https://github.com/XRPLF/rippled/pull/7389))
- Improved `Number` addition and subtraction rounding. ([#7369](https://github.com/XRPLF/rippled/pull/7369))
- Fixed the `Number` comparison operator. ([#7406](https://github.com/XRPLF/rippled/pull/7406))
- Refactored `Batch` transaction IDs. ([#7736](https://github.com/XRPLF/rippled/pull/7736))
- Capped the number of untrusted validator manifests accepted per message and dropped oversized ones. This is the fix released in version 3.2.1. ([#7925](https://github.com/XRPLF/rippled/pull/7925))
- Increased the validator manifest protocol message size cap and corrected manifest relay.
<!-- TODO: security team to approve wording/level of detail for the hardening entry below before this post is published -->
- Hardened peer protocol and RPC request handling against oversized and malformed messages, and bounded several per-connection caches, reducing the memory and processing resources an untrusted peer can consume.
- Corrected the transaction type check performed before reading `RawTransactions`.
- Used a weighted median when aggregating close-time offsets.
- Handled malformed ledger replay responses.
- Improved lookup performance when assembling ledger deltas.
- Re-stored nodes missing from both backends during `online_delete` rotation. ([#7763](https://github.com/XRPLF/rippled/pull/7763))
- Allocated `TaggedCache::getKeys()` memory outside of the lock. ([#7567](https://github.com/XRPLF/rippled/pull/7567))
- Always charged the peer on the strand. ([#7422](https://github.com/XRPLF/rippled/pull/7422))
- Stopped creating a data directory for in-memory databases. ([#7323](https://github.com/XRPLF/rippled/pull/7323))
- Disabled transaction invariants. ([#7409](https://github.com/XRPLF/rippled/pull/7409))
- Added `[[maybe_unused]]` to `fix320Enabled` for `assert=OFF` builds. ([#7446](https://github.com/XRPLF/rippled/pull/7446))
- Adjusted the `xrpld` systemd service to allow up to five minutes for graceful shutdown, restart only on failure, and reduced the auto-update randomized delay. ([#7374](https://github.com/XRPLF/rippled/pull/7374))
- Ensured `xrpld` service directories exist at startup. ([#7565](https://github.com/XRPLF/rippled/pull/7565))


### Refactors

- Used `STLedgerEntry` type aliases instead of `std::shared_ptr`. ([#7282](https://github.com/XRPLF/rippled/pull/7282))
- Replaced `intr_ptr::SharedPtr<SHAMapTreeNode>` with `SHAMapTreeNodePtr`. ([#7396](https://github.com/XRPLF/rippled/pull/7396))
- Used const function arguments where possible. ([#7423](https://github.com/XRPLF/rippled/pull/7423))
- Used `std::move` and `std::string_view` where possible. ([#7424](https://github.com/XRPLF/rippled/pull/7424))
- Used `std::ranges` where possible. ([#7634](https://github.com/XRPLF/rippled/pull/7634))
- Used `std::from_chars`/`std::to_chars` for JSON double parsing and formatting. ([#7735](https://github.com/XRPLF/rippled/pull/7735))
- Changed config section and key string literals into constants. ([#7095](https://github.com/XRPLF/rippled/pull/7095))
- Introduced `XRPL_ASSERT_IF` for amendment-gated assertions. ([#7378](https://github.com/XRPLF/rippled/pull/7378))
- Cleaned up `tec` object deletion logic. ([#6588](https://github.com/XRPLF/rippled/pull/6588))
- Used dispatch instead of post. ([#7438](https://github.com/XRPLF/rippled/pull/7438))
- Removed the `const_cast` in `TaggedCache::canonicalize_replace_cache`. ([#5638](https://github.com/XRPLF/rippled/pull/5638))
- Renamed keylet functions to more closely match the docs. ([#7059](https://github.com/XRPLF/rippled/pull/7059))
- Unified the style for all Doxygen comments. ([#7776](https://github.com/XRPLF/rippled/pull/7776))
- Removed redundant enable checks in confidential MPT transactions. ([#7809](https://github.com/XRPLF/rippled/pull/7809))
- Moved the `jss.h` include out of `Indexes.h`. ([#7799](https://github.com/XRPLF/rippled/pull/7799))
- Deleted dead code. ([#7718](https://github.com/XRPLF/rippled/pull/7718))
- Explicitly trimmed the heap after cache sweeps. ([#6022](https://github.com/XRPLF/rippled/pull/6022))
- Dispatched `hasInvalidAmount()` on type tag instead of `dynamic_cast`. ([#7402](https://github.com/XRPLF/rippled/pull/7402))


### Documentation

- Rewrote the build environment docs. ([#7533](https://github.com/XRPLF/rippled/pull/7533))
- Fixed some comments to improve readability. ([#7405](https://github.com/XRPLF/rippled/pull/7405))
- Added more information about pre-commit hooks and how to set them up. ([#7802](https://github.com/XRPLF/rippled/pull/7802))


### Testing

- Migrated resource and shamap Beast tests to GTest. ([#7133](https://github.com/XRPLF/rippled/pull/7133))
- Migrated basics Beast tests to GTest. ([#7136](https://github.com/XRPLF/rippled/pull/7136))
- Added a null-check unit test for `Oracle::aggregatePrice`. ([#7306](https://github.com/XRPLF/rippled/pull/7306))
- Added a test for the permissioned domain sequence fix. ([#7591](https://github.com/XRPLF/rippled/pull/7591))
- Added tests for `TMProofPathResponse` and `TMReplayDeltaResponse` invalid hash and key sizes. ([#7593](https://github.com/XRPLF/rippled/pull/7593))
- Added unit tests for IP address related functions. ([#7744](https://github.com/XRPLF/rippled/pull/7744))
- Added JSON array size tests. ([#7592](https://github.com/XRPLF/rippled/pull/7592))
- Added tests for the doxygen style check. ([#7795](https://github.com/XRPLF/rippled/pull/7795))
- Published test changes held back from 3.1.3. ([#7570](https://github.com/XRPLF/rippled/pull/7570))
- Suppressed invariant-failure logs in Vault and LoanBroker bug-regression tests. ([#7379](https://github.com/XRPLF/rippled/pull/7379))
- Fixed `LCOV_EXCL_END` to `LCOV_EXCL_STOP`. ([#7407](https://github.com/XRPLF/rippled/pull/7407))


### CI/Build

- Adopted the C++23 standard. ([#7431](https://github.com/XRPLF/rippled/pull/7431))
- Created a single test binary, `xrpl_tests`. ([#7327](https://github.com/XRPLF/rippled/pull/7327))
- Added a `verify-headers` target to clean up headers. ([#7670](https://github.com/XRPLF/rippled/pull/7670))
- Added a pragma-once checker. ([#7580](https://github.com/XRPLF/rippled/pull/7580))
- Aligned `xrpld` RPM packaging with the DEB package. ([#7529](https://github.com/XRPLF/rippled/pull/7529))
- Updated workflows and conan to use VS2026 and grpc 1.81.0. ([#7550](https://github.com/XRPLF/rippled/pull/7550))
- Updated `mpt-crypto` to 1.0.2.
- Uploaded codecov results for the whole XRPLF organization.
- Marked secp256k1 and mpt-crypto as transitive headers. ([#7658](https://github.com/XRPLF/rippled/pull/7658))
- Switched to a new conan XRPLF remote. ([#7622](https://github.com/XRPLF/rippled/pull/7622))
- Switched to a new conan XRPLF remote, again. ([#7638](https://github.com/XRPLF/rippled/pull/7638))
- Stopped reusing binaries between different C++ versions. ([#7681](https://github.com/XRPLF/rippled/pull/7681))
- Fixed the unity build. ([#7730](https://github.com/XRPLF/rippled/pull/7730))
- Disabled assertions on Release builds. ([#7443](https://github.com/XRPLF/rippled/pull/7443))
- Ran sanitizers on release builds too. ([#7527](https://github.com/XRPLF/rippled/pull/7527))
- Silenced UBSan diagnostics in the ubsan build config. ([#7531](https://github.com/XRPLF/rippled/pull/7531))
- Made sanitizer flags a list in the profile instead of a string. ([#7449](https://github.com/XRPLF/rippled/pull/7449))
- Redesigned the matrix configuration based on nix images. ([#7385](https://github.com/XRPLF/rippled/pull/7385))
- Refactored build-related nix, docker, and workflow files. ([#7408](https://github.com/XRPLF/rippled/pull/7408))
- Checked binaries separately from building them. ([#7355](https://github.com/XRPLF/rippled/pull/7355))
- Patched binaries in nix-based images and tested in every distro. ([#7376](https://github.com/XRPLF/rippled/pull/7376))
- Patched nix binaries in CMake. ([#7539](https://github.com/XRPLF/rippled/pull/7539))
- Patched the conan recipe for nix so it can be used on macOS. ([#7532](https://github.com/XRPLF/rippled/pull/7532))
- Removed the conan patch in nix. ([#7534](https://github.com/XRPLF/rippled/pull/7534))
- Updated `flake.lock` to allow conan with clang-22 support. ([#7390](https://github.com/XRPLF/rippled/pull/7390))
- Installed gcov, nettools, and cacert in nix images. ([#7398](https://github.com/XRPLF/rippled/pull/7398))
- Fixed clang ASan include dirs in nix images and added curl and gnupg. ([#7400](https://github.com/XRPLF/rippled/pull/7400))
- Improved sanitizer libs and added doxygen, dpkg, and rpm in nix. ([#7403](https://github.com/XRPLF/rippled/pull/7403))
- Added `gh` and `file` to nix packages. ([#7444](https://github.com/XRPLF/rippled/pull/7444))
- Added ClangBuildAnalyzer to nix. ([#7538](https://github.com/XRPLF/rippled/pull/7538))
- Added zip to nix images. ([#7551](https://github.com/XRPLF/rippled/pull/7551))
- Added git-lfs to nix images. ([#7561](https://github.com/XRPLF/rippled/pull/7561))
- Added graphviz to nix images. ([#7566](https://github.com/XRPLF/rippled/pull/7566))
- Added protobuf dependencies to nix. ([#7706](https://github.com/XRPLF/rippled/pull/7706))
- Added Rust to the nix docker image. ([#7571](https://github.com/XRPLF/rippled/pull/7571))
- Added an `.envrc` for automatic devshell switching via direnv. ([#7756](https://github.com/XRPLF/rippled/pull/7756))
- Used the same compiler in the nix devshell as in CI. ([#7751](https://github.com/XRPLF/rippled/pull/7751))
- Used new packaging images and stopped canceling develop builds. ([#7417](https://github.com/XRPLF/rippled/pull/7417))
- Used the XRPLF/actions `build-multiarch-image` workflow. ([#7428](https://github.com/XRPLF/rippled/pull/7428))
- Built and pushed docker images in forks too. ([#7588](https://github.com/XRPLF/rippled/pull/7588))
- Launched `upload-conan-deps` on profile change. ([#7442](https://github.com/XRPLF/rippled/pull/7442))
- Made configurations launch on certain event types. ([#7447](https://github.com/XRPLF/rippled/pull/7447))
- Ran the full matrix only on `Ready to merge` or `Full CI build` labeled PRs. ([#7689](https://github.com/XRPLF/rippled/pull/7689))
- Fixed workflow launch on matrix-unrelated labels. ([#7812](https://github.com/XRPLF/rippled/pull/7812))
- Stopped running the conflict checker when a label is applied. ([#7774](https://github.com/XRPLF/rippled/pull/7774))
- Checked that more tools are available. ([#7600](https://github.com/XRPLF/rippled/pull/7600))
- Used macOS 26 Tahoe with apple-clang 21. ([#7601](https://github.com/XRPLF/rippled/pull/7601))
- Updated clang-tidy to nix-based v22. ([#7412](https://github.com/XRPLF/rippled/pull/7412))
- Used clang-tidy v22 new features. ([#7427](https://github.com/XRPLF/rippled/pull/7427))
- Better determined when a full clang-tidy run is needed. ([#7635](https://github.com/XRPLF/rippled/pull/7635))
- Made clang-tidy workflow adjustments to stay in sync with Clio. ([#7563](https://github.com/XRPLF/rippled/pull/7563))
- Added a script to format clang-tidy output. ([#7650](https://github.com/XRPLF/rippled/pull/7650))
- Ran `clang_tidy_check` with `pass_filenames: false` from pre-commit. ([#7800](https://github.com/XRPLF/rippled/pull/7800))
- Made clang-tidy happy on macOS. ([#7701](https://github.com/XRPLF/rippled/pull/7701))
- Enabled groups of clang-tidy checks by default. ([#7637](https://github.com/XRPLF/rippled/pull/7637))
- Enabled most bugprone clang-tidy checks. ([#7643](https://github.com/XRPLF/rippled/pull/7643))
- Enabled most modernize clang-tidy checks. ([#7664](https://github.com/XRPLF/rippled/pull/7664))
- Enabled most misc clang-tidy checks. ([#7663](https://github.com/XRPLF/rippled/pull/7663))
- Enabled most cppcoreguidelines clang-tidy checks. ([#7660](https://github.com/XRPLF/rippled/pull/7660))
- Enabled most performance clang-tidy checks. ([#7727](https://github.com/XRPLF/rippled/pull/7727))
- Enabled most readability clang-tidy checks. ([#7772](https://github.com/XRPLF/rippled/pull/7772))
- Enabled the `modernize-unary-static-assert` clang-tidy check. ([#7705](https://github.com/XRPLF/rippled/pull/7705))
- Enabled the `modernize-use-auto` clang-tidy check. ([#7707](https://github.com/XRPLF/rippled/pull/7707))
- Enabled the `modernize-avoid-bind` clang-tidy check. ([#7711](https://github.com/XRPLF/rippled/pull/7711))
- Enabled the `modernize-use-constraints` clang-tidy check. ([#7715](https://github.com/XRPLF/rippled/pull/7715))
- Improved pre-commit hooks. ([#7702](https://github.com/XRPLF/rippled/pull/7702))
- Added a pre-commit hook to check doxygen style. ([#7794](https://github.com/XRPLF/rippled/pull/7794))
- Updated pre-commit hooks and actions. ([#7686](https://github.com/XRPLF/rippled/pull/7686))
- Used multiple directories in the dependabot config. ([#7413](https://github.com/XRPLF/rippled/pull/7413))
- Bumped `eps1lon/actions-label-merge-conflict` from 3.0.3 to 3.1.0. ([#7375](https://github.com/XRPLF/rippled/pull/7375))
- Bumped `actions/checkout` from 6.0.2 to 6.0.3. ([#7414](https://github.com/XRPLF/rippled/pull/7414))
- Bumped `actions/checkout` from 6.0.3 to 7.0.0. ([#7585](https://github.com/XRPLF/rippled/pull/7585))
- Bumped `actions/setup-python` from 6.2.0 to 6.3.0. ([#7657](https://github.com/XRPLF/rippled/pull/7657))
- Bumped `codecov/codecov-action` from 6.0.1 to 7.0.0. ([#7426](https://github.com/XRPLF/rippled/pull/7426))


## Credits

The following RippleX teams and GitHub users contributed to this release:

- RippleX Engineering
- RippleX Docs
- RippleX Product
- @Kassaking7
- @TimothyBanks
- @dangell7
- @marek-foss-neti
- @solunolab


## Bug Bounties and Responsible Disclosures

We welcome reviews of the `xrpld` code and urge researchers to responsibly disclose any issues they may find.

For more information, see:

- [Ripple's Bug Bounty Program](https://ripple.com/legal/bug-bounty/)
- [`xrpld` Security Policy](https://github.com/XRPLF/rippled/blob/develop/SECURITY.md)
