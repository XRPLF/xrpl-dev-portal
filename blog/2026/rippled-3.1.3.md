---
category: 2026
date: "2026-05-07"
template: '../../@theme/templates/blogpost'
seo:
    title: Introducing XRP Ledger version 3.1.3
    description: rippled version 3.1.3 introduces a new amendment and various bug fixes.
labels:
    - rippled Release Notes
markdown:
    editPage:
        hide: true
---
# Introducing XRP Ledger version 3.1.3

Version 3.1.3 of `rippled`, the reference server implementation of the XRP Ledger protocol, is now available. This release introduces the `fixCleanup3_1_3` amendment, which contains a collection of fixes for NFTs, Permissioned Domains, Vaults, and the Lending Protocol. Due to the importance of the included fixes, the default vote is set to **Yes**.

This release also adds a `verify_endpoints` parameter to the `rippled` configuration file for local peer network development, as well as various bug fixes and refactors.


## Action Required

If you run an XRP Ledger server, upgrade to version 3.1.3 as soon as possible to ensure service continuity.


## Install / Upgrade

On supported platforms, see the [instructions on installing or updating `rippled`](../../docs/infrastructure/installation/index.md).

| Package | SHA-256 |
|:--------|:--------|
| [RPM for Red Hat / CentOS (x86-64)](https://repos.ripple.com/repos/rippled-rpm/stable/rippled-3.1.3-1.el9.x86_64.rpm) | `85549e28750a29bb817bc271996f721fcc80d85ae15fc6a97beeb094260bc4e2` |
| [DEB for Ubuntu / Debian (x86-64)](https://repos.ripple.com/repos/rippled-deb/pool/stable/rippled_3.1.3-1_amd64.deb) | `2d7bcca6c8148c395d827681870a5e033521719c2d2c34b64d2cf923af3aa07c` |

For other platforms, please [build from source](https://github.com/XRPLF/rippled/blob/master/BUILD.md). The most recent commit in the git log should be the change setting the version:

```text
commit 46b241ace8b30d9c9775d60ffba7d24b21903896
Author: Ed Hennis <ed@ripple.com>
Date:   Wed May 6 15:37:35 2026 -0400

    Set version to 3.1.3
```


## Full Changelog


### Amendments

- **fixCleanup3_1_3**: This amendment is a collection of fixes for NFTs, Permissioned Domains, Vaults, and the Lending Protocol. [`4539bb0`](https://github.com/XRPLF/rippled/commit/4539bb07)
  - Fixes an issue with expired `NFTokenOffer` entries remaining on the ledger. With this amendment enabled, using the `NFTokenAcceptOffer` transaction on an expired `NFTokenOffer` now deletes it as part of transaction processing.
  - Adds an invariant check to ensure Permissioned Domains aren't modified by failed transactions.
  - Fixes a trust line token limit check that was skipped when withdrawing vault assets. With this amendment enabled, `VaultWithdraw` transactions that specify either vault shares or vault assets will respect the trust line token limit of the destination address.
  - Fixes loan accounting information not updating in its associated `Loan`, `LoanBroker`, and `Vault` entries if the loan was defaulted, impaired, or unimpaired. 
  - Changes a `LoanPay` error to return `tecNO_PERMISSION` instead of `temINVALID_FLAG` when attempting to overpay on a loan that doesn't permit overpayments.
  - Adds an additional check for `LoanBroker` invariants to ensure the listed `CoverAvailable` exactly matches the assets held in the associated pseudo-account.


### Features

- Added a `verify_endpoints` parameter to the `rippled` config file. The default value is `1`, which configures the server to validate endpoint addresses received from peers. If set to `0`, the server skips validation, allowing addresses that are not publicly routable or have a port of `0`. This is useful for local peer network development, but should never be disabled when on Mainnet. ([`f511eeb`](https://github.com/XRPLF/rippled/commit/f511eeb2))


### Breaking Changes

- Updated the `port` field in the Peer Crawler API to consistently return an integer for both inbound and outbound peers. Previously, outbound peers returned `port` as a string while inbound peers returned it as an integer. ([#6318](https://github.com/XRPLF/rippled/pull/6318))


### Bug Fixes

- Improved loan invariant message. ([#6668](https://github.com/XRPLF/rippled/pull/6668))
- Enforced aggregate `MaximumAmount` in multi-send MPT. ([#6644](https://github.com/XRPLF/rippled/pull/6644))
- Fixed `account_tx` limit parameter validation for malformed values. ([#5891](https://github.com/XRPLF/rippled/pull/5891))
- Fixed array size check. ([#6030](https://github.com/XRPLF/rippled/pull/6030))
- Corrected index for limit in `book_offers` CLI. ([#6043](https://github.com/XRPLF/rippled/pull/6043))
- Fixed nullptr resolving when there is no DB config. ([#6029](https://github.com/XRPLF/rippled/pull/6029))
- Truncated thread name on Linux. ([#5758](https://github.com/XRPLF/rippled/pull/5758))
- Limited reply size on `TMGetObjectByHash` queries. ([#6110](https://github.com/XRPLF/rippled/pull/6110))
- Fixed tautological assert. ([#6393](https://github.com/XRPLF/rippled/pull/6393))
- Fixed gateway balance with MPT. ([#6143](https://github.com/XRPLF/rippled/pull/6143))
- Made assorted NFT fixes. ([#6566](https://github.com/XRPLF/rippled/pull/6566))
- Made assorted Oracle fixes. ([#6570](https://github.com/XRPLF/rippled/pull/6570))
- Made assorted Vault fixes. ([#6607](https://github.com/XRPLF/rippled/pull/6607))
- Made assorted Permissioned Domain fixes. ([#6587](https://github.com/XRPLF/rippled/pull/6587))
- Removed fatal assertion on Linux thread name truncation. ([#6690](https://github.com/XRPLF/rippled/pull/6690))
- Changed `Tuning::bookOffers` minimum limit to 1. ([#6812](https://github.com/XRPLF/rippled/pull/6812))
- Prevented deletion of MPTokens with active escrow. ([#6635](https://github.com/XRPLF/rippled/pull/6635))
- Checked trustline limits for share-denominated vault withdrawals. ([#6645](https://github.com/XRPLF/rippled/pull/6645))
- Clamped `VaultClawback` to `assetsAvailable` for zero-amount clawback. ([#6646](https://github.com/XRPLF/rippled/pull/6646))
- Added assorted Lending Protocol fixes. ([#6678](https://github.com/XRPLF/rippled/pull/6678))
- Fixed touchy "funds are conserved" assertion in `LoanPay`. ([#6231](https://github.com/XRPLF/rippled/pull/6231))
- Added rounding to Vault invariants. ([#6217](https://github.com/XRPLF/rippled/pull/6217))
- Stopped tx processing if failed to delete expired credentials. ([#6715](https://github.com/XRPLF/rippled/pull/6715))
- Checked for empty `sfAdditionalBooks` array in hybrid offer invariant. ([#6716](https://github.com/XRPLF/rippled/pull/6716))
- Prevented overwriting a bool value in an invariant. ([#6609](https://github.com/XRPLF/rippled/pull/6609))
- Capped the base fee for `LoanPay`. ([#6969](https://github.com/XRPLF/rippled/pull/6969))
- Checked network ID in `transactionSignFor`. ([`2ddef8c`](https://github.com/XRPLF/rippled/commit/2ddef8c8))
- Improved JSON parsing of currency issuers. ([`af7e5ef`](https://github.com/XRPLF/rippled/commit/af7e5ef9))
- Used transaction sequence numbers in permissioned domains. ([`dde7ca9`](https://github.com/XRPLF/rippled/commit/dde7ca9f))


### Refactors

- Updated `PermissionedDomainDelete` to use keylet for SLE access. ([#6063](https://github.com/XRPLF/rippled/pull/6063))
- Enforced 15-char limit and simplified thread naming labels. ([#6212](https://github.com/XRPLF/rippled/pull/6212))
- Improved RPC variable naming and handling. ([`56a9d69`](https://github.com/XRPLF/rippled/commit/56a9d69b))
- Removed erroneous `base_uint` constructor from container. ([`5aa3d5e`](https://github.com/XRPLF/rippled/commit/5aa3d5e2))
- Limited JSON array size. ([`377b155`](https://github.com/XRPLF/rippled/commit/377b155d))
- Filled `txJson` based on `apiVersion`. ([`066e395`](https://github.com/XRPLF/rippled/commit/066e3956))
- Used named constant for leaf item size. ([`bc16845`](https://github.com/XRPLF/rippled/commit/bc168453))
- Improved `Forwarded` header field parsing. ([`024c9c5`](https://github.com/XRPLF/rippled/commit/024c9c57))
- Moved unhex lookup table out of function. ([`406b534`](https://github.com/XRPLF/rippled/commit/406b5346))
- Prevented dry-run transactions from being queued. ([`3004e04`](https://github.com/XRPLF/rippled/commit/3004e049))


### CI/Build

- Only uploaded artifacts in the `XRPLF/rippled` repository. ([#6523](https://github.com/XRPLF/rippled/pull/6523))
- Used latest version of publish-docs workflow. ([#6824](https://github.com/XRPLF/rippled/pull/6824))
- Made pre-commit line ending conversions work on Windows. ([#6832](https://github.com/XRPLF/rippled/pull/6832))
- Shortened job names to stay within Linux 15-char thread limit. ([#6669](https://github.com/XRPLF/rippled/pull/6669))


## Credits

The following RippleX teams and GitHub users contributed to this release:

- RippleX Engineering
- RippleX Docs
- RippleX Product
- @Copilot
- @Kassaking7
- @janibakin
- @tequdev


## Bug Bounties and Responsible Disclosures

We welcome reviews of the `rippled` code and urge researchers to responsibly disclose any issues they may find.

For more information, see:

- [Ripple's Bug Bounty Program](https://ripple.com/legal/bug-bounty/)
- [`rippled` Security Policy](https://github.com/XRPLF/rippled/blob/develop/SECURITY.md)
