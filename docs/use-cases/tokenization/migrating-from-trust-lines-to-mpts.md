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
| Escrow | ✅ Supported.<br><br>Issuers first enable the **Allow Trust Line Locking** flag on their account. | ✅ Supported.<br><br>Issuers set the **Can Escrow** flag when creating the token. Escrowing to anyone besides the issuer also requires **Can Transfer**. |
| Mutable properties | ✅ Supported.<br><br>Configuration is account-wide and applies to every token the account issues. Most account settings can be changed anytime, but some settings (for example, **No Freeze**) cannot be reversed. | ✅ Supported: {% amendment-disclaimer name="DynamicMPT" compact=true /%}<br><br>Each token has its own configuration. Metadata, transfer fee, and issuance flags are mutable by default (flags can be enabled later, never disabled). Issuers can make these properties permanently immutable at creation or later. All other properties are fixed. |
| Freeze | ✅ Supported.<br><br>Issuers can freeze tokens globally or individually. Individual freezes allow receiving but not sending. Deep Freeze blocks both. | ✅ Supported.<br><br>Issuers can lock (freeze) tokens globally or individually. Locked holders cannot send or receive except with the issuer. Requires the **Can Lock** flag. |
| Clawback | ✅ Supported.<br><br>Requires the **Allow Trust Line Clawback** setting, which must be enabled before issuing tokens and cannot be reversed. | ✅ Supported.<br><br>Issuers can claw back tokens from holders. Requires the **Can Clawback** flag set at creation or enabled later. |
| Confidential balances | ❌ Not supported. | ✅ Supported: {% amendment-disclaimer name="ConfidentialTransfer" compact=true /%}<br><br>Balances and transfer amounts can be kept confidential. Issuers and optional auditors can verify supply and balances via registered encryption keys. |
| DEX, AMM, cross-currency payments & Checks | ✅ Supported. | 🚧 Pending amendment: [MPTokensV2](/resources/known-amendments.md#mptokensv2) {% badge %}In Development: TBD{% /badge %} |
| Rippling | ✅ Supported.<br><br>[Rippling](../../concepts/tokens/fungible-tokens/rippling.md) is the indirect movement of funds through intermediary accounts. It is controlled by the **Default Ripple** and **No Ripple** flags. | ❌ Not supported.<br><br>Intentionally not supported by MPTs. |

## Why Migrate to MPTs?

Migrating is a feature decision rather than a forced upgrade. Consider migrating to MPTs when a token requires:

- **Per-token controls**: Freeze, clawback, transfer fees, and allow-listing scoped to one token, instead of to every token the account issues.
- **Simpler partner integrations**: A single `mpt_issuance_id` replaces the `(currency, issuer)` pair everywhere amounts are built, parsed, or stored.
- **On-chain metadata**: The ticker and other descriptive fields can live on the ledger in a recommended schema.
- **Protocol-level capped supply**: `MaximumAmount` enforces a ceiling that trust line tokens can't.
- **Confidential balances**: Holders can shield their amounts from public view.

Migration may not be appropriate when:

- **Your flows depend on [rippling](../../concepts/tokens/fungible-tokens/rippling.md).** MPTs do not support rippling by design. Most single-issuer tokens don't rely on rippling. You depend on it if payments route through intermediary accounts.
- **Your token needs DEX or AMM liquidity.** Until the [MPTokensV2 amendment](/resources/known-amendments.md#mptokensv2) is enabled, MPTs cannot be traded on the DEX or added to an AMM.

## Migration Steps

The following sections outline the steps to migrate from trust line tokens to MPTs.

### 1. Create the MPT Issuance

**Performed by:** Issuer

**Resources:**

- **Tutorial:** [Issue a Multi-Purpose Token](../../tutorials/tokens/mpts/issue-a-multi-purpose-token.md)
- **Transactions:** [MPTokenIssuanceCreate](../../references/protocol/transactions/types/mptokenissuancecreate.md), [MPTokenIssuanceSet](../../references/protocol/transactions/types/mptokenissuanceset.md)
- **Concepts:** [Multi-Purpose Tokens](../../concepts/tokens/fungible-tokens/multi-purpose-tokens.md), [Mutable MPTs](../../concepts/tokens/fungible-tokens/mutable-mpts.md)

---

MPTs require explicit creation. Create an MPTokenIssuance entry with an MPTokenIssuanceCreate transaction, which defines the token's configuration.

The create transaction returns the `mpt_issuance_id`, which uniquely identifies that issuance.

#### Precision and supply

MPTs introduce `AssetScale` and `MaximumAmount`, which trust line tokens don't have. Both are permanent, so choose them carefully. `TransferFee` carries over from trust lines, but moves from an account-wide setting to a per-issuance one.

- **`AssetScale`** sets how many decimal places the token divides into. Trust line balances carry up to 15 significant digits, so pick a scale that keeps the precision of the existing balances. For example, a balance of `1.005` needs an `AssetScale` of at least 3, and stores on-ledger as the integer `1005`.
- **`MaximumAmount`** sets a permanent cap on how many units can ever exist. Trust line tokens have no supply cap, so set this high enough to cover all future issuance.
- **`TransferFee`** replaces the account-wide `TransferRate`. A non-zero `TransferFee` requires the **Can Transfer** flag, and it rounds against the `AssetScale`, so a scale that's too small can round the fee on small payments down to zero.

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

{% admonition type="info" name="Note" %}
**Default Ripple** has no MPT equivalent, and this is by design. Trust line token transfers between holders move through the issuer by [rippling](../../concepts/tokens/fungible-tokens/rippling.md), while MPTs transfer directly between holders.
{% /admonition %}

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

Before a holder can receive an MPT directly, they must submit an MPTokenAuthorize transaction naming the `mpt_issuance_id`. Trust lines have no equivalent step; the holder creates a trust line with a [TrustSet transaction](../../references/protocol/transactions/types/trustset.md), or gets a trust line implicitly, such as when buying the token on the DEX.

Each holder signs their own opt-in, so you can't opt in for them or remove the requirement.

If the issuance enables [allow-listing](../../concepts/tokens/fungible-tokens/authorized-trust-lines.md#authorized-trust-lines) (**Require Auth** flag), the opt-in is two-sided. The holder authorizes the MPT first, and then you authorize the holder with your own MPTokenAuthorize transaction. You cannot pre-approve a holder before they have opted in.

### 3. Migrate the Balances

The XRP Ledger doesn't provide a transaction that converts a trust line token into an MPT. To migrate existing balances, you should use the following mechanisms:

- A DEX or AMM swap
- Claw back the existing token and send MPT as a Check
- Batch swap

#### DEX or AMM swap

**Performed by:** Issuer and holder

**Resources:**

- **Tutorials:** [Trade in the Decentralized Exchange](../../tutorials/defi/dex/trade-in-the-decentralized-exchange.md), [Create an Automated Market Maker](../../tutorials/defi/dex/create-an-automated-market-maker.md)
- **Transactions:** [OfferCreate](../../references/protocol/transactions/types/offercreate.md), [AMMCreate](../../references/protocol/transactions/types/ammcreate.md)
- **Concepts:** [Decentralized Exchange](../../concepts/tokens/decentralized-exchange/index.md), [Offers](../../concepts/tokens/decentralized-exchange/offers.md), [Automated Market Makers](../../concepts/tokens/decentralized-exchange/automated-market-makers.md)

---

_(Requires the [MPTokensV2 amendment](/resources/known-amendments.md#mptokensv2) {% badge %}In Development: TBD{% /badge %})_

This approach is best for active holders who can migrate themselves. You publish liquidity that trades the old token for the MPT at a one-to-one rate, and holders swap when they're ready.

An issuing account can't hold its own tokens, so fund a separate migration account with the old token and the MPT first. Then provide liquidity in one of two ways:

- **Standing offers on the DEX.** Submit `OfferCreate` transactions from the migration account that sell the MPT and buy the old token at a one-to-one rate. Holders take those offers with their own `OfferCreate` transaction. Refill the offers as they're consumed.
- **A one-to-one AMM pool.** Use `AMMCreate` from the migration account to fund a pool with equal amounts of the old token and the MPT, with a trading fee of zero so holders aren't charged for migrating. Holders swap against the pool at any time, and the pool keeps working without you managing individual offers.

When you set the amounts, remember that the MPT amount is in base units, so an MPT with an `AssetScale` of 6 needs 1,000,000 base units to match 1.00 of the old token. Check that any `TransferFee` on the MPT and any transfer rate on the old token don't push the effective rate away from one-to-one.

Track progress by comparing the old token's outstanding supply from the [gateway_balances](../../references/http-websocket-apis/public-api-methods/account-methods/gateway_balances.md) method against the MPT's `OutstandingAmount`.

You can't force completion, because balances move only when holders trade. Anyone can take your offers or swap against the pool, so treat this as an open market rather than a per-holder migration, and pair it with another mechanism for holders who never trade.

#### Claw back the existing token and send MPT as a Check

**Performed by:** Issuer, then holder

**Resources:**

- **Tutorials:** {% repo-link path="_code-samples/clawback/" %}Clawback code sample{% /repo-link %}, [Send a Check](../../tutorials/payments/send-a-check.md), [Cash a Check for an Exact Amount](../../tutorials/payments/cash-a-check-for-an-exact-amount.md)
- **Transactions:** [Clawback](../../references/protocol/transactions/types/clawback.md), [CheckCreate](../../references/protocol/transactions/types/checkcreate.md), [CheckCash](../../references/protocol/transactions/types/checkcash.md)
- **Concepts:** [Clawing Back Tokens](../../concepts/tokens/fungible-tokens/clawing-back-tokens.md), [Checks](../../concepts/payment-types/checks.md)

---

_(Requires the [MPTokensV2 amendment](/resources/known-amendments.md#mptokensv2) {% badge %}In Development: TBD{% /badge %})_

This path is best for recovering balances from holders who don't initiate the migration, because you start the swap instead of waiting for them.

For each holder, you submit two transactions:

1. A `Clawback` transaction that recovers the holder's old trust line balance and returns it to you.
2. A `CheckCreate` transaction that offers the holder a Check for the same value in MPT.

The holder finishes the swap with a `CheckCash` transaction. A Check moves no funds until it's cashed, so you keep the MPT until the holder claims it, and you can set an expiration to bound how long the offer stays open.

Two preconditions decide whether this path is even available to you:

- The old token's issuing account must have **Allow Trust Line Clawback** enabled, and that setting can only be enabled on an account with an empty owner directory. If you issued the old token without it, you can't claw back those balances.
- Holders must opt in to the MPT before they can cash the Check, so run [Step 2](#2-authorize-the-mpt) first.

The two steps aren't atomic. A holder can end up with neither token if the clawback succeeds and the Check expires uncashed, so watch for expired Checks and reissue them. Clawback is also a strong issuer power, so give holders notice before you use it, and check that your terms of service and jurisdiction allow it.

#### Batch swap

**Performed by:** Issuer and holder

**Resources:**

- **Tutorial:** [Send a Multi-Account Batch Transaction](../../tutorials/best-practices/transaction-sending/send-a-multi-account-batch-transaction.md)
- **Transaction:** [Batch](../../references/protocol/transactions/types/batch.md)
- **Concept:** [Batch Transactions](../../concepts/transactions/batch-transactions.md)

---

{% amendment-disclaimer name="BatchV1_1"/%}

This path is best for coordinated holder-by-holder swaps, such as institutional accounts you can reach directly. It's the only mechanism that swaps both sides atomically, so no holder is ever left holding neither token.

For each holder, you build a `Batch` transaction in `ALLORNOTHING` mode with two inner transactions:

1. A `Payment` from the holder that returns the old token to you.
2. A `Payment` from you that delivers the MPT to the holder.

Because the batch touches two accounts, both of you must sign the whole batch. The inner transactions are unsigned, each signer signs the outer transaction and the inner transaction hashes, and one of you submits the result. `ALLORNOTHING` mode means the holder can't receive the MPT without returning the old token, and vice versa.

A batch holds up to eight inner transactions, so you can pack several holders into one transaction as long as every account involved signs it.

The cost of this path is coordination. Every holder has to sign, which usually means a wallet or custodian integration that supports multi-account batches. Use it for the accounts you can coordinate with, and fall back to another mechanism for the rest.

Most migrations combine these mechanisms. For example, you might seed a one-to-one AMM pool for retail holders, run Batch swaps with accounts you can coordinate with, and use clawback and Checks only for eligible balances that remain at your deadline.

### 4. Retire the Old Token

**Performed by:** Issuer, with holders deleting their emptied trust lines

**Resources:**

- **Transactions:** [AccountSet](../../references/protocol/transactions/types/accountset.md), [TrustSet](../../references/protocol/transactions/types/trustset.md)
- **Concepts:** [Freezes](../../concepts/tokens/fungible-tokens/freezes.md)

---

You can't delete holders' trust lines, so retiring the old token is a wind-down rather than a deletion:

1. Announce a migration deadline, and keep at least one swap mechanism open until it passes.
2. Engage exchanges and custodians before the deadline. Balances in omnibus wallets migrate on the custodian's timeline, not the end user's.
3. Withdraw the liquidity you provided, such as open DEX offers and AMM positions, so no new balances accumulate on the old token.
4. Enact a **Global Freeze** (`asfGlobalFreeze` on `AccountSet`) at the deadline, so the remaining balances can't circulate.
5. Encourage holders to zero out and delete their emptied trust lines. Until then, each holder carries two owner reserve increments: one for the new `MPToken` and one for the old trust line. Deleting the emptied trust line frees the second.

{% admonition type="warning" name="No Freeze makes the freeze permanent" %}
If you enabled **No Freeze**, you can still enact a Global Freeze, but you can never lift it afterward. If there's any chance you'd want to reopen the old token after the deadline, that option is gone once the freeze is enacted. Factor this into the deadline messaging.
{% /admonition %}

## What Changes for Integrators

Wallets, exchanges, explorers, and custody systems need to handle both token standards during the migration. The main work is updating token identifiers, amount parsing, balance queries, and payment support.

| Area | What changes | What to look out for |
| :--- | :--- | :--- |
| Token identity | Trust line tokens use a `(currency, issuer)` pair. MPTs use an `mpt_issuance_id`. | Treat both identifiers as two ledger representations of the same display asset during the migration. |
| Amount format | Trust line token values are decimals with up to 15 significant digits. MPT values are integers in base units governed by `AssetScale`. | Define a rounding policy before converting balances. Prefer an `AssetScale` that makes rounding unnecessary. |
| Balance queries | Trust line balances live in `RippleState` entries and are returned by [account_lines](../../references/http-websocket-apis/public-api-methods/account-methods/account_lines.md). MPT balances live in `MPToken` entries and can be queried with [account_objects](../../references/http-websocket-apis/public-api-methods/account-methods/account_objects.md), [ledger_entry](../../references/http-websocket-apis/public-api-methods/ledger-methods/ledger_entry.md), or [mpt_holders](../../references/http-websocket-apis/public-api-methods/clio-methods/mpt_holders.md). | Deposit detection needs to handle both `RippleState` and `MPToken` metadata during the transition. |
| Holding the token | Trust line holders create trust lines. MPT holders opt in to a specific issuance. | Update onboarding and deposit flows so holders can opt in before receiving the MPT. |
| Payments | Both standards use the Payment transaction. MPT payments identify the token with `mpt_issuance_id` instead of `currency` and `issuer`. | Direct payments between non-issuer holders require the **Can Transfer** flag. |
| Pathfinding and cross-currency payments | Trust line tokens support these flows today. MPT support requires the [MPTokensV2 amendment](/resources/known-amendments.md#mptokensv2). {% badge %}In Development: TBD{% /badge %} | If your integration depends on pathfinding, DEX, AMM, cross-currency payments, or Checks, wait for MPTokensV2 before migrating that flow. |
| Display metadata | Trust line token display data usually comes from the issuer's [`xrp-ledger.toml`](../../references/xrp-ledger-toml.md) file. MPT display data can come from on-chain metadata. | Resolve both sides to the same ticker, icon, and asset record so users don't see two unrelated assets. |
| Issuer controls | Trust line controls are account-wide. MPT controls are per issuance. | Don't infer an MPT's behavior from the issuer account alone. Check the issuance flags and fields. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
