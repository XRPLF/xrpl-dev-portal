---
seo:
    description: A migration guide for issuers and integrators moving from trust line tokens to Multi-Purpose Tokens (MPTs) on the XRP Ledger.
labels:
  - Tokens
  - MPTs, Multi-Purpose Tokens
  - Migration
---
# Migrating from Trust Line Tokens to MPTs

This page is a planning and decision reference for migrating an existing [Trust Line Token](../../concepts/tokens/fungible-tokens/trust-line-tokens.md) to a [Multi-Purpose Token (MPT)](../../concepts/tokens/fungible-tokens/multi-purpose-tokens.md) on the XRP Ledger. It's aimed at **issuers** planning a migration and **integrators** (wallets, explorers, exchanges) supporting both token types during the transition.

Trust line tokens and MPTs are distinct fungible token standards that coexist. MPTs are newer, but trust line tokens are fully supported and not deprecated. This guide contrasts the two and links to the references and tutorials you'll need to migrate.

{% admonition type="info" name="Note" %}
This is not an exhaustive guide. Refer to the linked references, concepts, and tutorials for full details.
{% /admonition %}

## Token Standard Comparison

The following table compares features for the two token standards at a high level:

| Capability | Trust Line Token | Multi-Purpose Token (MPT) |
| ---------- | ---------------- | ------------------------- |
| Issuing & direct payments | ✅ Supported. | ✅ Supported. |
| Escrow | ✅ Supported.<br><br>Requires **Allow Trust Line Locking**. | ✅ Supported.<br><br>Requires **Can Escrow**. Escrowing to a non-issuer also requires **Can Transfer**. |
| On-chain Metadata | ❌ Not supported. <br><br>Only the currency code is stored on-ledger. Descriptive fields live off-chain, typically in a `xrp-ledger.toml` file. | ✅ Supported.<br><br>The `MPTokenMetadata` field stores up to 1024 bytes of  on-chain JSON metadata such as ticker, name and icon. |
| Mutable properties | ⚠️ Limited.<br><br>Account-wide. **Require Auth** and **Allow Trust Line Clawback** can only be enabled before trust lines exist, and Clawback and **No Freeze** can never be disabled once set. Other flags toggle freely. | ✅ Supported: {% amendment-disclaimer name="DynamicMPT" compact=true /%}<br><br>Per-issuance. Metadata and transfer fee are mutable by default. Flags can only be enabled, never disabled, unless made permanently immutable. |
| Freeze | ✅ Supported.<br><br>Block one trust line with **Freeze**, or all of them with **Global Freeze**. Add **Deep Freeze** to also block receiving. | ✅ Supported.<br><br>Requires **Can Lock**. You can lock an MPT globally, or target a single holder. |
| Clawback | ✅ Supported.<br><br>Requires **Allow Trust Line Clawback**, set before issuing and irreversible. | ✅ Supported.<br><br>Requires **Can Clawback**, set at creation or enabled later. |
| Confidential balances | ❌ Not supported. | ✅ Supported: {% amendment-disclaimer name="ConfidentialTransfer" compact=true /%}<br><br>Individual balances and transfer amounts are encrypted, but total supply stays public. Issuers and optional auditors can decrypt individual balances via registered keys. |
| DEX, AMM, cross-currency payments & Checks | ✅ Supported. | 🚧 Pending amendment: [MPTokensV2](/resources/known-amendments.md#mptokensv2) {% badge %}In Development: TBD{% /badge %} |
| Rippling | ✅ Supported.<br><br>Controlled by **Default Ripple**/**No Ripple**. See [Rippling](../../concepts/tokens/fungible-tokens/rippling.md) to learn more. | ❌ Not supported by design. |

## Why Migrate to MPTs?

Migrating is a feature decision rather than a forced upgrade. Consider migrating to MPTs when a token requires:

- **Per-token controls**: Freeze, clawback, transfer fees, and allow-listing scoped to one token, instead of to every token the account issues.
- **On-chain metadata**: The ticker and other descriptive fields can live on the ledger in a recommended schema.
- **Protocol-level capped supply**: `MaximumAmount` enforces a ceiling that trust line tokens can't.
- **Confidential balances**: Holders can keep their balances and transfer amounts private using EC-ElGamal encryption and Zero-Knowledge Proofs (ZKPs).

Migration may not be appropriate when:

- **Your flows depend on rippling**: MPTs do not support [rippling](../../concepts/tokens/fungible-tokens/rippling.md) by design, and transfer directly between holders once you enable the **Can Transfer** flag. If anything in your flows relies on rippling, migrating changes that behavior.
- **Your token needs DEX or AMM liquidity**: Until the [MPTokensV2 amendment](/resources/known-amendments.md#mptokensv2) is enabled, MPTs cannot be traded on the DEX or added to an AMM.

## Migration Steps

The following sections outline the steps to migrate from trust line tokens to MPTs. Migration is per-asset: if your account issues multiple trust line tokens, run these steps separately for each one you migrate.

### 1. Create the MPT Issuance

**Performed by:** Issuer

**Resources:**

- **Tutorial:** [Issue a Multi-Purpose Token](../../tutorials/tokens/mpts/issue-a-multi-purpose-token.md)
- **Transactions:** [MPTokenIssuanceCreate](../../references/protocol/transactions/types/mptokenissuancecreate.md), [MPTokenIssuanceSet](../../references/protocol/transactions/types/mptokenissuanceset.md)
- **Concepts:** [Multi-Purpose Tokens](../../concepts/tokens/fungible-tokens/multi-purpose-tokens.md), [Mutable MPTs](../../concepts/tokens/fungible-tokens/mutable-mpts.md)

---

MPTs require explicit creation of the token issuance, so you must submit an MPTokenIssuanceCreate transaction, where you can define the token's configuration (for example, the token's precision, supply cap, and transfer fee).

The create transaction returns the `mpt_issuance_id`, which uniquely identifies that issuance.

#### Amounts and fees

These three fields control how token amounts are represented and capped, and what fee is charged on transfers: 

- **`AssetScale`** sets how many decimal places the token divides into. Trust line balances carry up to 15 significant digits, so pick a scale that keeps the precision of the existing balances. For example, a balance of `1.005` needs an `AssetScale` of at least 3, and stores on-ledger as the integer `1005`.
- **`MaximumAmount`** sets a permanent cap on `OutstandingAmount`, the field that tracks how many units non-issuers currently hold. Trust line tokens have no such cap, so set `MaximumAmount` high enough to cover your expected circulating supply.
- **`TransferFee`** replaces the account-wide `TransferRate`. A non-zero `TransferFee` requires the **Can Transfer** flag. The fee truncates down to a whole unit, so a small `AssetScale` can round the fee on small payments down to zero. Like `TransferRate`, a non-zero `TransferFee` means a Payment between two holders must include `SendMax` covering the fee, or it fails with `tecPATH_PARTIAL`.

`AssetScale` and `MaximumAmount` can't be changed after creation, so think carefully about what you set them to. `TransferFee` can be adjusted later if necessary.

See [MPTokenIssuance fields](../../references/protocol/ledger-data/ledger-entry-types/mptokenissuance.md#mptokenissuance-fields) to learn more.

#### Flags

With trust lines, capability settings apply to every token you issue. MPTs move that control to the token itself. Each issuance has its own flags, which you enable when creating the token or later with MPTokenIssuanceSet.

To match your existing token's behavior, map the relevant account flags to the MPT flags:

| [MPT flag](../../references/protocol/transactions/types/mptokenissuancecreate.md#mptokenissuancecreate-flags) | [Account flag](../../references/protocol/transactions/types/accountset.md#accountset-flags) |
| :--- | :--- |
| **Can Clawback** (`tfMPTCanClawback`) | **Allow Trust Line Clawback** (`asfAllowTrustLineClawback`) |
| **Can Escrow** (`tfMPTCanEscrow`) | **Allow Trust Line Locking** (`asfAllowTrustLineLocking`) |
| **Can Hold Confidential Balance** (`tfMPTCanHoldConfidentialBalance`) | Not supported for trust line tokens. |
| **Can Lock** (`tfMPTCanLock`) | Trust line freezing is enabled by default. |
| **Can Trade** (`tfMPTCanTrade`) | Trust line tokens trade on the DEX by default. |
| **Can Transfer** (`tfMPTCanTransfer`) | Trust line tokens are transferable by default. |
| **Require Auth** (`tfMPTRequireAuth`) | **Require Auth** (`asfRequireAuth`) |

You don't have to configure every flag at creation. You can enable these later as your needs change. See [Mutable MPTs](../../concepts/tokens/fungible-tokens/mutable-mpts.md) to learn more.

#### Metadata

For a trust line token, the only on-ledger identifier is the `(currency, issuer)` pair. The currency code doubles as the ticker, but the ledger holds no name, icon, or other descriptive fields. That information lives off-chain in the issuer's [`xrp-ledger.toml`](../../references/xrp-ledger-toml.md) file.

An MPT carries this metadata on-chain instead. The `MPTokenMetadata` field stores up to 1024 bytes of arbitrary data as hex. By convention it decodes to JSON following a recommended schema, which defines fields like ticker, name, and icon.

See [On-Chain Metadata](../../concepts/tokens/fungible-tokens/multi-purpose-tokens.md#on-chain-metadata) to learn more.

### 2. Authorize the MPT

**Performed by:** Holder, and Issuer if **Require Auth** is enabled.

**Resources:**

- **Tutorial:** [Send an MPT](../../tutorials/payments/send-an-mpt.md#3-authorize-the-receiving-account)
- **Transactions:** [MPTokenAuthorize](../../references/protocol/transactions/types/mptokenauthorize.md)
- **Concepts:** [Multi-Purpose Tokens](../../concepts/tokens/fungible-tokens/multi-purpose-tokens.md)

---

Before a holder can receive or send an MPT, they must submit an MPTokenAuthorize transaction with the relevant `mpt_issuance_id` to opt in to holding that token. Trust lines have no equivalent step; the holder creates a trust line with a [TrustSet transaction](../../references/protocol/transactions/types/trustset.md), or gets a trust line implicitly, such as when buying the token on the DEX.

Each MPT holder signs their own opt-in, so you can't opt in for them or remove the requirement.

If the issuance enables [allow-listing](../../concepts/tokens/fungible-tokens/authorized-trust-lines.md#authorized-trust-lines) (**Require Auth** flag), the opt-in is two-sided. The holder authorizes the MPT first, and then you authorize the holder with your own MPTokenAuthorize transaction. You cannot pre-approve a holder before they have opted in.

### 3. Migrate the Balances

The XRP Ledger doesn't provide a transaction that converts a trust line token into an MPT. To migrate existing balances, you can use the following mechanisms:

- [A DEX or AMM swap](#dex-or-amm-swap)
- [Clawback and Check swap](#clawback-and-check-swap)
- [Batch swap](#batch-swap)

You don't have to pick just one mechanism. For example, you might seed a one-to-one AMM pool for retail holders, run batch swaps with accounts you can coordinate with, and use clawback and checks only for eligible balances that still haven't swapped by your deadline.

#### DEX or AMM swap

**Performed by:** Issuer and Holder

**Resources:**

- **Tutorials:** [Trade in the Decentralized Exchange](../../tutorials/defi/dex/trade-in-the-decentralized-exchange.md), [Create an Automated Market Maker](../../tutorials/defi/dex/create-an-automated-market-maker.md)
- **Transactions:** [OfferCreate](../../references/protocol/transactions/types/offercreate.md), [AMMCreate](../../references/protocol/transactions/types/ammcreate.md)
- **Concepts:** [Decentralized Exchange](../../concepts/tokens/decentralized-exchange/index.md), [Offers](../../concepts/tokens/decentralized-exchange/offers.md), [Automated Market Makers](../../concepts/tokens/decentralized-exchange/automated-market-makers.md)

---

_(Requires the [MPTokensV2 amendment](/resources/known-amendments.md#mptokensv2) {% badge %}In Development: TBD{% /badge %})_

This approach is best for active holders who can migrate themselves. You publish liquidity that trades the old token for the MPT at a one-to-one rate, and holders swap when they're ready.

Trading or pooling the MPT this way requires both **Can Trade** and **Can Transfer** enabled on the issuance.

An issuing account can't hold its own tokens, so fund a separate migration account with the old token and the MPT first. Then provide liquidity in one of two ways:

- **Standing offers on the DEX.** Submit OfferCreate transactions from the migration account that sell the MPT and buy the old token at a one-to-one rate. Holders take those offers with their own OfferCreate transaction. Refill the offers as they're consumed.
- **A one-to-one AMM pool.** Use AMMCreate from the migration account to fund a pool with equal amounts of the old token and the MPT, with a trading fee of zero so holders aren't charged for migrating. Holders swap against the pool at any time, and the pool keeps working without you managing individual offers.

Convert the old token's decimal balance to the MPT's base units when you set the offer or pool amounts, and check that any `TransferFee` on the MPT or `TransferRate` on the old token doesn't push the effective rate away from one-to-one.

You can track the migration progress by comparing the old token's outstanding supply from the [gateway_balances](../../references/http-websocket-apis/public-api-methods/account-methods/gateway_balances.md) method against the MPT's `OutstandingAmount`.

#### Clawback and Check swap

**Performed by:** Issuer and Holder

**Resources:**

- **Tutorials:** {% repo-link path="_code-samples/clawback/" %}Clawback code sample{% /repo-link %}, [Send a Check](../../tutorials/payments/send-a-check.md), [Cash a Check for an Exact Amount](../../tutorials/payments/cash-a-check-for-an-exact-amount.md)
- **Transactions:** [Clawback](../../references/protocol/transactions/types/clawback.md), [CheckCreate](../../references/protocol/transactions/types/checkcreate.md), [CheckCash](../../references/protocol/transactions/types/checkcash.md)
- **Concepts:** [Clawing Back Tokens](../../concepts/tokens/fungible-tokens/clawing-back-tokens.md), [Checks](../../concepts/payment-types/checks.md)

---

This path is best for recovering balances from holders who don't initiate the migration, because you start the swap instead of waiting for them.

For each holder, you submit two transactions:

1. A **Clawback** transaction that recovers the holder's old trust line balance and returns it to you.
2. A **CheckCreate** transaction that offers the holder a check for the same value in MPT.
_(Requires the [MPTokensV2 amendment](/resources/known-amendments.md#mptokensv2) {% badge %}In Development: TBD{% /badge %})_

The holder finishes the swap with a CheckCash transaction. A check doesn't move funds until it's cashed, so you keep the MPT until the holder claims it, and you can set an expiration to control how long the offer stays open.

Two preconditions decide whether this path is even available to you:

- The old token's issuing account must have **Allow Trust Line Clawback** enabled, and you can only turn that setting on before the account owns any trust lines or other ledger objects. If you issued the old token without it, you can't claw back those balances.
- If the issuance requires allow-listing (**Require Auth** flag), you must authorize MPT holders before they can cash the check, so run [Step 2](#2-authorize-the-mpt) first.

This swap isn't atomic end to end. Once the clawback succeeds, the holder can end up with neither token if the check expires before they cash it, so watch for expired checks and reissue them.

#### Batch swap

**Performed by:** Issuer and Holder

**Resources:**

- **Tutorial:** [Send a Multi-Account Batch Transaction](../../tutorials/best-practices/transaction-sending/send-a-multi-account-batch-transaction.md)
- **Transaction:** [Batch](../../references/protocol/transactions/types/batch.md)
- **Concepts:** [Batch Transactions](../../concepts/transactions/batch-transactions.md)

---

{% amendment-disclaimer name="BatchV1_1"/%}

This path is best for coordinated holder-by-holder swaps, such as institutional accounts you can reach directly. It's the only mechanism that swaps both sides atomically, so no holder is ever left holding neither token.

For each holder, you build a Batch transaction in `ALLORNOTHING` mode with two inner transactions:

1. A **Payment** from the holder that returns the old token to you.
2. A **Payment** from you that delivers the MPT to the holder.

Because this swap involves two accounts, both of you must sign the whole batch. The inner transactions are unsigned. Each participant signs the outer transaction's account, sequence, and flags, plus the hashes of both inner transactions, and one of you submits the result. `ALLORNOTHING` mode means the holder can't receive the MPT without returning the old token, and vice versa.

A batch holds up to eight inner transactions, so you can combine several holders into one transaction as long as every account involved signs it.

### 4. Retire the Old Token

**Performed by:** Issuer and Holder

**Resources:**

- **Tutorials:** [Enact Global Freeze](../../tutorials/tokens/fungible-tokens/enact-global-freeze.md), [Freeze a Trust Line](../../tutorials/tokens/fungible-tokens/freeze-a-trust-line.md)
- **Transactions:** [AccountSet](../../references/protocol/transactions/types/accountset.md), [TrustSet](../../references/protocol/transactions/types/trustset.md)
- **Concepts:** [Freezes](../../concepts/tokens/fungible-tokens/freezes.md)

---

You can't delete holders' trust lines, so retiring the old token is a wind-down rather than a deletion:

1. Announce a migration deadline, and keep at least one of the swap mechanisms open until it passes, so holders who wait until the last minute can still swap voluntarily.
2. Engage exchanges and custodians before the deadline. They control their customers' balances, so migration happens on their timeline, not the end user's.
3. Withdraw the liquidity you provided, such as open DEX offers and AMM positions, so no new balances accumulate on the old token.
4. Enact a **Global Freeze** (`asfGlobalFreeze` on AccountSet) at the deadline, so the remaining balances can't circulate. A Global Freeze is account-wide, freezing every token issued, not just the one you're retiring. If you issue other live tokens from the same account, freeze the old token's trust lines individually instead. Then, clear each freeze (`tfClearFreeze`) so holders can delete their line and reclaim their reserve.
    {% admonition type="danger" name="Warning" %}
    If you enabled **No Freeze**, a Global Freeze becomes irreversible. You can't lift it to reactivate the old token later.
    {% /admonition %}
5. Encourage holders to offload their old token balance, reset their trust line to the default settings, and delete it. Until then, each holder carries two owner reserve increments: one for the new `MPToken` and one for the old trust line.

Offloading the balance and resetting the trust line's limit isn't always enough to delete it. Deletion also requires the holder's **No Ripple** flag to match their own **Default Ripple** setting, which a plain TrustSet transaction doesn't set. Have holders submit a final TrustSet with `tfSetNoRipple` before they try to delete the line.

## What Changes for Integrators

Wallets, exchanges, explorers, and custody systems that already support MPTs still need to reconcile any token that migrates. The old trust line and the new MPT are two separate ledger objects representing one asset, so balance totals, deposit detection, and displayed tickers must resolve them as the same thing.

| Topic | What changes | What to look out for |
| :--- | :--- | :--- |
| Token identity | Trust line tokens use a `(currency, issuer)` pair. MPTs use an `mpt_issuance_id`. | Treat both identifiers as two ledger representations of the same display asset during the migration. |
| Amount format | Trust line token values are decimals with up to 15 significant digits. MPT values are integers in base units governed by `AssetScale`. | A holder's balance can be split across both formats during the transition. Convert both to a common precision before combining them into one displayed total. |
| Balance queries | Trust line balances live in `RippleState` entries and are returned by [account_lines](../../references/http-websocket-apis/public-api-methods/account-methods/account_lines.md). MPT balances live in `MPToken` entries and can be queried with [account_objects](../../references/http-websocket-apis/public-api-methods/account-methods/account_objects.md). | Deposit detection needs to handle both `RippleState` and `MPToken` entries during the transition. |
| Deposit detection | A trust line deposit's `meta.delivered_amount` is shaped `{currency, issuer, value}`. An MPT deposit's is shaped `{mpt_issuance_id, value}`. | Key deposit detection off `meta.delivered_amount` and branch on its shape to classify a deposit as a trust line token or an MPT. |
| Holding the token | Trust line holders create trust lines. MPT holders opt in to a specific issuance. | Existing holders who already have a trust line still need to submit a new opt-in before they can receive the same asset as an MPT. |
| Pathfinding and cross-currency payments | Trust line tokens support these flows today. MPT support requires the [MPTokensV2 amendment](/resources/known-amendments.md#mptokensv2) {% badge %}In Development: TBD{% /badge %} | If your integration depends on pathfinding, DEX, AMM, cross-currency payments, or Checks, wait for MPTokensV2 before migrating that flow. |
| Display metadata | Trust line token display data usually comes from the issuer's [`xrp-ledger.toml`](../../references/xrp-ledger-toml.md) file. MPT display data can come from on-chain metadata. | Resolve both sides to the same ticker, icon, and asset record so users don't see two unrelated assets. |
| Issuer controls | Trust line controls are account-wide. MPT controls are per issuance. | Don't assume a migrated MPT inherits the trust line's freeze, clawback, or other settings. Check the new issuance's own flags instead. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
