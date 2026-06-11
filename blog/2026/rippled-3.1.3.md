---
category: 2026
date: "2026-05-14"
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

Version 3.1.3 of `rippled`, the reference server implementation of the XRP Ledger protocol, is now available. This release introduced the `fixCleanup3_1_3` amendment, which contained a collection of fixes for NFTs, Permissioned Domains, Vaults, the Lending Protocol, and MPTs.

Due to the severity of the bugs, development took place in both the public `rippled` repo and a private repo to keep the details of the issues confidential and prevent malicious actors from exploiting them before fixes shipped. To address all of the issues quickly, they were bundled under a single `fixCleanup3_1_3` amendment, and UNL validators were contacted to update immediately. The amendment shipped with a default vote of **Yes**, so validators upgrading their software automatically cast a yes vote to speed up applying the fixes.

In addition to the fix amendment, this release also added a `verify_endpoints` parameter to the `rippled` configuration file for local peer network development, less-severe bug fixes, and refactors.


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

**fixCleanup3_1_3**: This amendment introduced a collection of fixes for NFTs, Permissioned Domains, Vaults, the Lending Protocol, MPTs, and miscellaneous issues:
  - **NFTs**
    - Fixed an issue with expired `NFTokenOffer` entries remaining on the ledger. The `NFTokenAcceptOffer` transaction now deletes expired offers as part of transaction processing. ([#5707](https://github.com/XRPLF/rippled/pull/5707))
  - **Permissioned Domains**
    - Fixed a keylet collision crash when using permissioned domains with ticketed transactions. ([#7129](https://github.com/XRPLF/rippled/pull/7129))
    - Added an invariant check to ensure Permissioned Domains aren't modified by failed transactions. ([#6134](https://github.com/XRPLF/rippled/pull/6134))
  - **Single Asset Vaults**
    - Clamped `VaultClawback` to `assetsAvailable` for zero-amount ("all") clawbacks, fixing a bug that allowed clawing back more assets than were available on outstanding loans. ([#6646](https://github.com/XRPLF/rippled/pull/6646))
    - Fixed a trust line token limit check that was skipped when withdrawing vault assets. `VaultWithdraw` transactions that specify either vault shares or vault assets now respect the trust line token limit of the destination address. ([#6645](https://github.com/XRPLF/rippled/pull/6645))
  - **Lending Protocol**
    - Fixed a fee calculation issue by capping the base fee for `LoanPay`. ([#6969](https://github.com/XRPLF/rippled/pull/6969))
    - Fixed an inaccurate assertion in `LoanPay` transactions by improving IOU rounding accuracy. ([#6231](https://github.com/XRPLF/rippled/pull/6231))
    - Added several Lending Protocol fixes. ([#6678](https://github.com/XRPLF/rippled/pull/6678))
      - Fixed loan accounting information not updating in its associated `Loan`, `LoanBroker`, and `Vault` entries when the loan was defaulted, impaired, or unimpaired.
      - Changed a `LoanPay` error to return `tecNO_PERMISSION` instead of `temINVALID_FLAG` when attempting to overpay on a loan that doesn't permit overpayments.
      - Added an additional check for `LoanBroker` invariants to ensure the listed `CoverAvailable` exactly matches the assets held in the associated pseudo-account.
  - **MPTs**
    - Prevented the deletion of MPTs with an active escrow. ([#6635](https://github.com/XRPLF/rippled/pull/6635))
    - Enforced aggregate `MaximumAmount` checks in multi-send MPT transactions. ([#6644](https://github.com/XRPLF/rippled/pull/6644))
  - **Miscellaneous Issues**
    - Fixed a bug where boolean results could be overwritten by multiple calls to `visitEntry`. ([#6609](https://github.com/XRPLF/rippled/pull/6609))
    - Added a check for empty `sfAdditionalBooks` arrays in hybrid offer invariants. ([#6716](https://github.com/XRPLF/rippled/pull/6716))
    - Stopped transaction processing and returned an error code when deleting expired credentials failed. ([#6715](https://github.com/XRPLF/rippled/pull/6715))


### Features

- Added a `verify_endpoints` parameter to the `rippled` config file. The default value is `1`, which configures the server to validate endpoint addresses received from peers. If set to `0`, the server skips validation, allowing addresses that are not publicly routable or have a port of `0`. This is useful for local peer network development, but should never be disabled when on Mainnet. ([`f511eeb`](https://github.com/XRPLF/rippled/commit/f511eeb2))


### Breaking Changes

- Updated the `port` field in the Peer Crawler API to consistently return an integer for both inbound and outbound peers. Previously, outbound peers returned `port` as a string while inbound peers returned it as an integer. ([#6318](https://github.com/XRPLF/rippled/pull/6318))


### Bug Fixes

- Improved loan invariant message. ([#6668](https://github.com/XRPLF/rippled/pull/6668))
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
- Added rounding to Vault invariants. ([#6217](https://github.com/XRPLF/rippled/pull/6217))
- Capped the base fee for `LoanPay`. ([#6969](https://github.com/XRPLF/rippled/pull/6969))
- Checked network ID in `transactionSignFor`. ([`2ddef8c`](https://github.com/XRPLF/rippled/commit/2ddef8c8))
- Improved JSON parsing of currency issuers. ([#7110](https://github.com/XRPLF/rippled/pull/7110))


### Refactors

- Updated `PermissionedDomainDelete` to use keylet for SLE access. ([#6063](https://github.com/XRPLF/rippled/pull/6063))
- Enforced 15-char limit and simplified thread naming labels. ([#6212](https://github.com/XRPLF/rippled/pull/6212))
- Improved RPC variable naming and handling. ([`56a9d69`](https://github.com/XRPLF/rippled/commit/56a9d69b))
- Removed erroneous `base_uint` constructor from container. ([`5aa3d5e`](https://github.com/XRPLF/rippled/commit/5aa3d5e2))
- Limited JSON array size. ([#7112](https://github.com/XRPLF/rippled/pull/7112))
- Filled `txJson` based on `apiVersion`. ([#7109](https://github.com/XRPLF/rippled/pull/7109))
- Used named constant for leaf item size. ([#7130](https://github.com/XRPLF/rippled/pull/7130))
- Improved `Forwarded` header field parsing. ([#7126](https://github.com/XRPLF/rippled/pull/7126))
- Moved unhex lookup table out of function. ([#7104](https://github.com/XRPLF/rippled/pull/7104))
- Prevented dry-run transactions from being queued. ([#7131](https://github.com/XRPLF/rippled/pull/7131))


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
- @Kassaking7
- @janibakin
- @tequdev


## Bug Bounties and Responsible Disclosures

We welcome reviews of the `rippled` code and urge researchers to responsibly disclose any issues they may find.

For more information, see:

- [Ripple's Bug Bounty Program](https://ripple.com/legal/bug-bounty/)
- [`rippled` Security Policy](https://github.com/XRPLF/rippled/blob/develop/SECURITY.md)
