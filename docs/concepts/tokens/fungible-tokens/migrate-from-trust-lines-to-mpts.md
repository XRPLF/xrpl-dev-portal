---
seo:
    description: A migration guide for issuers and integrators moving fungible tokens from trust lines to Multi-Purpose Tokens (MPTs) on the XRP Ledger. Walks through the migration sequence step-by-step, with side-by-side transaction shapes for each migration task.
labels:
  - Tokens
  - MPTs, Multi-Purpose Tokens
  - Migration
---
# Migrating from Trust Line Tokens to MPTs

This page walks through migrating an existing trust line token to Multi-Purpose Tokens (MPTs). It is for developers and integrators at issuers, custodians, exchanges, and wallet providers.

If you are choosing between the two standards for a new token rather than migrating, start with [Which Fungible Token Type to Use](index.md#which-fungible-token-type-to-use).

## Migration Sequence at a Glance

{% admonition type="warning" name="If you have a token in production" %}Read [Dual-Issuance Pattern](#dual-issuance-pattern) and [Migrating CEX-Listed Balances](#migrating-cex-listed-balances) before writing code. Both are strategic decisions that affect every step below.{% /admonition %}

| # | Step | Who does this | Decisions locked at Step 1 |
|---|------|---------------|----------------------------|
| 1 | [**Define the MPT issuance.**](#step-1-define-your-mpt-issuance) Pick initial properties and declare which fields are mutable later. | Issuer | — |
| 2 | [**Onboard holders.**](#step-2-onboard-holders) Replace `TrustSet` with `MPTokenAuthorize` against your issuance ID. | Holders, wallets, custodians; also issuer when **Require Auth** is set | `tfMPTRequireAuth` |
| 3 | [**Migrate payment flows.**](#step-3-migrate-payment-flows) `Payment` keeps its shape; only the `Amount` encoding changes. | Anyone sending the token | `tfMPTCanTransfer` |
| 4 | [**Migrate operational controls.**](#step-4-migrate-operational-controls) Re-implement freeze, clawback, allowlisting, and transfer fees using MPT flags. | Issuer | `tfMPTCanLock`, `tfMPTCanClawback`, `tfMPTRequireAuth`, `TransferFee` |
| 5 | [**Enable DEX, AMM, and cross-asset flows.**](#step-5-enable-dex-amm-and-cross-asset-flows) Same transactions, MPT amount encoding. | Market makers, DEX/AMM integrators | `tfMPTCanTrade` |
| 6 | [**Add lifecycle features.**](#step-6-add-lifecycle-features) Escrow, batch transactions, permission delegation, sponsored fees, dynamic properties. | Varies by feature | `tfMPTCanEscrow` (escrow), `MutableFlags` (dynamic properties); batch, permission delegation, and sponsored fees do not depend on Step 1 |
| 7 | [**Enable confidential transfers**](#step-7-add-confidentiality) *(optional).* MPT-only; no trust line equivalent. | Issuer (issuance flag); holders (per-account opt-in via `ConfidentialMPTConvert`) | **Can Confidential Amount** flag (settable at creation or later via `MPTokenIssuanceSet`) |

Most capabilities in steps 4–7 depend on flags set at creation that cannot be added later, so Step 1 is the highest-stakes decision on this page.

## What Changes Conceptually

The structural shift becomes obvious from the side-by-side JSON in Steps 1–3. The differences worth knowing up front:

- **Per-account flags become per-issuance properties.** Trust line token settings such as No Freeze and Transfer Fee live on the issuer's account and apply to every token they issue. MPT settings live on the MPT issuance itself, so each MPT from the same issuer can have different properties.
- **Hot/cold wallet pattern is obsolete.** MPTs do not need separate operational and issuing accounts to manage exposure.
- **Fixed-point amounts.** MPT amounts use fixed-point integers; trust line tokens use floating-point. Audit any code that handles very large or very small amounts.

MPTs also do not support [rippling](rippling.md), so tokens with the same name from different issuers do not atomically rebalance against each other.

## Step 1: Define Your MPT Issuance

Where you previously configured an issuing account with `AccountSet` flags and waited for holders to create trust lines, you now submit a single [MPTokenIssuanceCreate](../../../references/protocol/transactions/types/mptokenissuancecreate.md) that defines the token and bakes its properties in:

```json
{
  "TransactionType": "MPTokenIssuanceCreate",
  "Account": "rNFta7UKwcoiCpxEYbhH2v92numE3cceB6",
  "AssetScale": 4,
  "TransferFee": 0,
  "MaximumAmount": "50000000",
  "Flags": 122,
  "MPTokenMetadata": "7B2274223A22 ... }"
}
```

**Issuance flags at a glance:**

| Flag | What it enables |
|------|----------------|
| **Can Lock** | The issuer can lock balances per-holder or globally via `MPTokenIssuanceSet` |
| **Require Auth** | Holders must be authorized by the issuer before they can receive (MPT equivalent of authorized trust lines) |
| **Can Escrow** | Holders can place balances into escrow |
| **Can Trade** | Holders can trade balances on the XRPL DEX |
| **Can Transfer** | Holders can transfer to non-issuer accounts |
| **Can Clawback** | The issuer can claw back from holders via `Clawback` |

Decide which of these flags to enable at creation time, along with `AssetScale` and `MaximumAmount`. If you might need to toggle one of these flags later, also mark it as mutable via the `MutableFlags` field on `MPTokenIssuanceCreate`. `MutableFlags` lets you mark any of the six control flags above, plus `TransferFee` and `MPTokenMetadata`, as updatable via [MPTokenIssuanceSet](../../../references/protocol/transactions/types/mptokenissuanceset.md). The choice of which fields are mutable cannot itself be changed once the issuance is created. See [XLS-94 Dynamic MPTs](https://opensource.ripple.com/docs/xls-94-dynamic-mpts/) for the corresponding mutable flag names (`tmfMPTCanMutateCanLock`, `tmfMPTCanMutateMetadata`, and so on).

Encode token metadata (name, ticker, description, links, asset class) as a hex blob in `MPTokenMetadata`. Capture the resulting `MPTokenIssuanceID` from the transaction result. Every holder and payment transaction needs it.

## Step 2: Onboard Holders

Before, a holder created a trust line with a `LimitAmount`:

```json
{
  "TransactionType": "TrustSet",
  "Account": "rsNw23ygZatXv7h8QVSgAE4jktY2uW1iZP",
  "LimitAmount": {
    "currency": "USD",
    "issuer": "rNFta7UKwcoiCpxEYbhH2v92numE3cceB6",
    "value": "100000"
  }
}
```

Now, the holder submits [MPTokenAuthorize](../../../references/protocol/transactions/types/mptokenauthorize.md) against the issuance ID:

```json
{
  "TransactionType": "MPTokenAuthorize",
  "Account": "rsNw23ygZatXv7h8QVSgAE4jktY2uW1iZP",
  "MPTokenIssuanceID": "05EECEBE97A7D635DE2393068691A015FED5A89AD203F5AA"
}
```

Distribute your `MPTokenIssuanceID` the way you'd distribute an issuer address and currency code today. If you set **Require Auth** on the issuance, the issuer also submits `MPTokenAuthorize` with the holder's address in the `Holder` field to allow each holder. This is the MPT equivalent of [authorized trust lines](authorized-trust-lines.md). Holders revoke by sending `MPTokenAuthorize` again with the **Unauthorize** flag (balance must be zero). Update any onboarding code (wallets, custodians, KYC/KYT flows) to call `MPTokenAuthorize` instead of `TrustSet`.

## Step 3: Migrate Payment Flows

`Payment` keeps the same transaction type and the same `Account` and `Destination` fields. Only the `Amount` encoding changes.

Before:

```json
"Amount": {
  "currency": "USD",
  "issuer": "rNFta7UKwcoiCpxEYbhH2v92numE3cceB6",
  "value": "100"
}
```

Now:

```json
"Amount": {
  "mpt_issuance_id": "006419063CEBEB49FC20032206CE0F203138BFC59F1AC578",
  "value": "100"
}
```

Apply the same swap to `SendMax` and `DeliverMax`. Audit any code that parses `Amount` from tx history. It now branches on whether `mpt_issuance_id` or `currency`/`issuer` is present. Verify amount math handles fixed-point versus floating-point correctly.

**What stays the same:** memos and destination/source tags carry over unchanged. Cross-currency conversion, partial payments, multi-hop, and pathfinding for MPT depend on XLS-82 (see [Step 5](#step-5-enable-dex-amm-and-cross-asset-flows)); they do not apply to direct MPT-to-MPT payments under MPTokensV1 alone.

## Step 4: Migrate Operational Controls

| Control | Trust line tokens | MPTs |
|---------|------------------|------|
| Freeze a single holder | `TrustSet` with the **Set Freeze** flag | `MPTokenIssuanceSet` with the **Lock** flag and the `Holder` field (requires **Can Lock** on the issuance) |
| Global freeze | `AccountSet` with **Global Freeze** | `MPTokenIssuanceSet` with the **Lock** flag and no `Holder` field |
| Clawback | `Clawback` (requires **Allow Trust Line Clawback** on the issuer account) | `Clawback` with the `Holder` field (requires **Can Clawback** set **at issuance**) |
| Allowlisting | [Authorized trust lines](authorized-trust-lines.md), via `TrustSet` with the **Auth** flag | **Require Auth** at issuance plus issuer-side `MPTokenAuthorize` per holder |
| Transfer fee | `AccountSet TransferRate` (applies to every IOU the issuer issues) | `TransferFee` on `MPTokenIssuanceCreate` (per-issuance; mutable if declared) |

Decide every operational control you'll ever need before creating the issuance. By default, the control flags above are immutable after issuance; to allow toggling a flag later, you must declare it as mutable via the `MutableFlags` field on `MPTokenIssuanceCreate` at creation time. If you didn't declare a flag as mutable and your compliance posture later requires changing it, you'll need to retire the affected issuance and create a new one.

## Step 5: Enable DEX, AMM, and Cross-Asset Flows

XLS-82 extends the XRPL DEX, AMM, cross-currency payments, and Checks to accept MPTs as a tradeable asset class. Wherever a trust line token would appear today as `{currency, issuer, value}`, an MPT appears as `{mpt_issuance_id, value}` from Step 3. The affected fields:

- `OfferCreate`: `TakerGets` and `TakerPays`.
- `AMMCreate`: `Amount` and `Amount2`.
- `AMMDeposit` / `AMMWithdraw`: `Asset` and `Asset2` to identify the pool, and `Amount` / `Amount2` for the deposit or withdrawal value.
- `Payment`: cross-currency and pathfinding flows return MPT-denominated paths via `ripple_path_find` and `path_find`.
- `CheckCreate` / `CheckCash`: `SendMax` and `Amount`.

For the canonical post-amendment transaction shapes for each of the above, see the [XLS-82 MPT DEX](https://opensource.ripple.com/docs/xls-82-mpt-dex/) spec.

**What stays the same:** offer expiration, the `tfPassive`, `tfFillOrKill`, and `tfImmediateOrCancel` flags, and the underlying offer-matching semantics. For institutional issuers, plan AMM and order-book liquidity migration in stages. See [Dual-Issuance Pattern](#dual-issuance-pattern). Spec: [XLS-82 MPT DEX](https://opensource.ripple.com/docs/xls-82-mpt-dex/).

## Step 6: Add Lifecycle Features

Layer these on as your use case requires. Each is configured the same way for MPTs as for trust line tokens (where applicable).

- **Escrow:** `EscrowCreate` accepts MPTs in the `Amount` field (the issuance must have both **Can Escrow** and **Can Transfer** enabled). `EscrowFinish` and `EscrowCancel` reference the existing escrow by `OfferSequence` or `EscrowID`, so they don't need an `Amount`. Useful for deferred settlement, conditional payments, and time-locked treasury ops. See [XLS-85 Token Escrow](https://opensource.ripple.com/docs/xls-85-token-escrow/).
  {% amendment-disclaimer name="TokenEscrow" /%}
- **Batch transactions:** atomically bundle multiple transactions. Useful for multi-step settlements or coupling authorization with an immediate payment. See [XLS-56 Batch Transactions](https://opensource.ripple.com/docs/xls-56-batch-transactions/).
- **Permission delegation:** let one account act for another on MPT issuances. Useful for custodian-operated treasury workflows. See [XLS-75 Permission Delegation](https://opensource.ripple.com/docs/xls-75-permission-delegation/).
- **Sponsored fees and reserves:** third parties cover fees and reserves on MPT operations. Useful for onboarding low-balance holders. See [XLS-68 Sponsored Fees and Reserves](https://opensource.ripple.com/docs/xls-68-sponsored-fees-and-reserves/).
- **Dynamic MPT properties:** update fields you declared mutable at issuance. Useful when fees or metadata need to evolve without retiring and reissuing. See [XLS-94 Dynamic MPTs](https://opensource.ripple.com/docs/xls-94-dynamic-mpts/).

## Step 7: Add Confidentiality

MPTs support confidential transfers, with no trust line equivalent. For many institutional issuers, this is the strongest reason to migrate.

The issuer enables confidentiality by setting the **Can Confidential Amount** flag on the issuance, either at creation or later via `MPTokenIssuanceSet`. Holders opt in per account by submitting `ConfidentialMPTConvert`, which registers their ElGamal public key. Balances and transfer amounts are then encrypted using EC-ElGamal and zero-knowledge proofs, while total supply remains auditable.

For selective disclosure, the issuer either registers an auditor's ElGamal public key on the issuance (so each balance is also encrypted under that key) or shares their own ElGamal private key with the auditor.

Wallet and custody integrations need to add ElGamal key generation, ciphertext handling, and ZK proof construction. Coordinate with your custody, KYT, and compliance vendors early. Spec: [XLS-96 Confidential Transfers](https://opensource.ripple.com/docs/xls-96-confidential-transfers/).

## Dual-Issuance Pattern

If you have an existing trust line token in production, most migrations run both standards in parallel for some period. The same underlying asset is represented in two on-ledger forms, with a swap path between them. This lets you migrate holders gradually, keep existing DEX liquidity live on the trust line side while new flows route to MPT, and coordinate exchange listings without disrupting the existing one.

Common approaches:

- **Cap MPT issuance** to track outstanding trust line supply, with off-ledger reconciliation between the two.
- **Provide an explicit swap mechanism**, either an off-ledger redeem-and-reissue flow operated by the issuer or an on-ledger AMM pairing the two representations.
- **Coordinate with exchange listings** so a new MPT listing does not fragment liquidity from an existing trust line listing. Most CEX integrations need a custody partner ready first.

A reference dual-issuance pattern with concrete swap mechanics is in development; this section will be expanded when that work is published.

## Migrating CEX-Listed Balances

For centralized exchanges with users holding IOU-denominated balances, migrating to MPT involves more than swapping a transaction encoding. The user-visible balance, the deposit and withdrawal flow, the custody stack, and the compliance integrations all need MPT support. The operational playbook (internal reconciliation, user communication, swap-window mechanics, regulatory notification) is in development; the most useful first steps are to verify vendor readiness and engage the issuer about swap-parity mechanics.

**What CEXes need in place:**

- **Custody support for MPTs.** Your cold-wallet and key-management provider must track MPT issuance IDs as a supported asset, sign MPT transactions, and surface MPT balances. Confirm timelines with your provider before committing to MPT support.
- **Hot-wallet authorization.** Deposit-receiving accounts must submit `MPTokenAuthorize` against each MPT issuance the exchange supports, or the ledger rejects incoming MPT payments.
- **Deposit and withdrawal flow updates.** Deposit pipelines must parse `Amount` for `mpt_issuance_id` and credit the right balance; withdrawal flows pick between IOU and MPT encoding per user policy.
- **Compliance and KYT integration.** Your transaction-monitoring vendor must recognize MPT issuance IDs and parse MPT-denominated transactions. Coordinate timelines.

**Internal balance model.** The biggest design decision is whether to present IOU and MPT balances of the same underlying asset as one balance (cleaner UX, harder reconciliation) or as separate listings such as "USDC.IOU" and "USDC.MPT" (easier accounting, two of the same thing). Issuers ease the unified-balance approach by offering a coordinated swap mechanism (see [Dual-Issuance Pattern](#dual-issuance-pattern)) so the exchange has a reliable conversion path.

## See Also

- **Concepts:**
    - [Multi-Purpose Tokens](multi-purpose-tokens.md)
    - [Trust Line Tokens](trust-line-tokens.md)
    - [Fungible Tokens overview](index.md)
    - [Stablecoin issuer guidance](stablecoins/index.md)
- **Tutorials:**
    - [Issue a Multi-Purpose Token](../../../tutorials/tokens/mpts/issue-a-multi-purpose-token.md)
    - [Sending MPTs in JavaScript](../../../tutorials/tokens/mpts/sending-mpts-in-javascript.md)
- **Specifications:**
    - [XLS-33 Multi-Purpose Tokens (umbrella spec)](https://opensource.ripple.com/docs/xls-33-multi-purpose-tokens/)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
