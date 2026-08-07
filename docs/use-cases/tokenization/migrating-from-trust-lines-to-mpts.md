---
seo:
    description: A migration guide for issuers and integrators moving fungible tokens from trust lines to Multi-Purpose Tokens (MPTs) on the XRP Ledger.
labels:
  - Tokens
  - MPTs, Multi-Purpose Tokens
  - Migration
---
# Migrating from Trust Line Tokens to MPTs

This page is a planning and decision reference for migrating an existing [Trust Line Token](../../concepts/tokens/fungible-tokens/trust-line-tokens.md) to a [Multi-Purpose Token (MPT)](../../concepts/tokens/fungible-tokens/multi-purpose-tokens.md) on the XRP Ledger. It's aimed at **issuers** planning a migration and **integrators** (wallets, explorers, exchanges) supporting both token types during the transition.

Trust line tokens and MPTs are distinct fungible token standards that coexist. MPTs are newer, but trust line tokens are fully supported and not deprecated. This guide contrasts the two and links to the references and tutorials you'll need to implement a migration.

{% admonition type="info" name="Note" %}
This guide is not exhaustive. Refer to the linked references, concepts, and tutorials for full details.
{% /admonition %}

## Token Standard Comparison

The following table compares trust line tokens and MPTs, capability by capability.

| Capability | Trust Line Token | Multi-Purpose Token (MPT) |
| ---------- | ---------------- | ------------------------- |
| Issuing & direct payments | ✅ Supported. | ✅ Supported. |
| Escrow | ✅ Supported.<br><br>Issuers first enable the **Allow Trust Line Locking** flag on their account. | ✅ Supported.<br><br>Issuers set the **Can Escrow** flag when creating the token. Escrowing to anyone besides the issuer also requires **Can Transfer**. |
| Mutable properties | ✅ Supported.<br><br>Settings apply to every token the account issues. Most can be changed anytime with `AccountSet`, though a few, like **No Freeze**, are one-way. | 🚧 Pending amendment: {% amendment-disclaimer name="DynamicMPT" compact=true /%}<br><br>Each token has its own settings. They're fixed when the token is created, unless marked as mutable so they can be updated later with `MPTokenIssuanceSet`. |
| Confidential balances | ❌ Not supported.<br><br>Trust line balances are always visible on the ledger. | 🚧 Pending amendment: {% amendment-disclaimer name="ConfidentialTransfer" compact=true /%}<br><br>Holders can choose to keep their balance private, using `ConfidentialMPTConvert`. |
| DEX, AMM & cross-currency payments | ✅ Supported. | 🚧 Pending amendment: {% amendment-disclaimer name="MPTokensV2" compact=true /%}<br><br>Adds MPT support to trading and payment transactions, including offers, cross-currency payments, AMMs, and Checks. |
| Rippling | ✅ Supported.<br><br>Controlled by the Default Ripple / No Ripple flags. | ❌ Not supported.<br><br>Intentionally not supported by MPTs. |

## Deciding Whether to Migrate

Trust line tokens remain fully supported, with no deprecation planned. Migrating is a feature decision rather than a forced upgrade, so weigh what MPTs add against what your token depends on today.

MPTs are worth the move when your token benefits from:

- **Per-token controls**: Freeze, clawback, transfer fees, and allow-listing scoped to one token, instead of to every token the account issues.
- **Simpler integration**: A single `mpt_issuance_id` replaces the `(currency, issuer)` pair everywhere amounts are built, parsed, or stored.
- **On-chain metadata**: The ticker and other descriptive fields live on the ledger in a defined schema.
- **A protocol-level supply cap**: `MaximumAmount` enforces a ceiling that trust line tokens can't.
- **Confidential balances**: Holders can shield their amounts from public view. {% amendment-disclaimer name="ConfidentialTransfer" /%}

Hold off, or don't migrate at all, when:

- **Your flows depend on rippling.** MPTs don't support rippling by design, so if your token depends on the rippling feature, don't migrate.
- **Your token needs DEX or AMM liquidity.** Until the [MPTokensV2 amendment](/resources/known-amendments.md#mptokensv2) is enabled, MPTs can't be traded on the DEX or added to an AMM.

Migration also carries risks. Most issuance settings are permanent unless marked mutable at creation, holders who don't act keep the old token, and liquidity splits across both tokens until the old one is retired. Make sure to test your new token on a [test network (Testnet/Devnet)](../../concepts/networks-and-servers/parallel-networks.md) with the required amendments before you proceed to Mainnet.

## Migration Steps

The following sections outline the steps to migrate from trust line tokens to MPTs.

### 1. Create the MPT Issuance

**Performed by:** Issuer

**Resources:**

- **Tutorial:** [Issue a Multi-Purpose Token](../../tutorials/tokens/mpts/issue-a-multi-purpose-token.md)
- **Transactions:** [MPTokenIssuanceCreate transaction][], [MPTokenIssuanceSet transaction][]
- **Ledger Entries:** [MPTokenIssuance entry][], [MPToken entry][]

---

With trust lines, there's no creation step. The token is just a currency code, and it first exists on-ledger when the issuer pays it out.

MPTs work the other way around. The issuer explicitly creates the token by submitting an `MPTokenIssuanceCreate` transaction, which creates an issuance ledger entry with a unique `mpt_issuance_id`.

#### Precision and supply

MPTs add two permanent settings that trust lines don't have. Neither one can be changed after creation, so choose both carefully.

- **`AssetScale`** fixes the number of decimal places the token subdivides into. Trust line balances carry up to 15 significant digits of precision, so choose a scale that preserves the precision of the existing balances.
- **`MaximumAmount`** sets a permanent cap on the total units that can ever be issued. Trust line tokens have no protocol-level supply cap, so set this high enough to cover all future issuance.

#### Flags

Trust line tokens have no creation step, so there are no token-level flags to set. The settings that control their behavior are configured on the issuer's account with `AccountSet` and apply to every token it issues.

MPTs have a creation step, and the issuer sets each token's own control flags at that point, such as **Can Lock**, **Require Auth**, or **Can Escrow**. See the [flags reference](../../references/protocol/transactions/types/mptokenissuancecreate.md#mptokenissuancecreate-flags) for what each flag enables.

Two flag choices affect the migration directly:

- **Can Transfer** (`tfMPTCanTransfer`) allows holders to send the token to each other. Without it, the token can only move directly to and from the issuer, so leaving it off makes the new token redeem-only.
- **Can Trade** (`tfMPTCanTrade`) enables trading on the [DEX](../../concepts/tokens/decentralized-exchange/index.md) and in [AMMs](../../concepts/tokens/decentralized-exchange/automated-market-makers.md) under the `MPTokensV2` amendment, and with it the [DEX Swap](#dex-swap) exchange mechanism, so decide up front whether the token will ever need to trade.

Each flag is permanent unless the issuer marks it mutable at creation. Mutability for flags is one-way, in that the issuer can enable the capability later with the [MPTokenIssuanceSet transaction][], but not disable it again. The metadata and transfer fee fields can also be marked mutable and updated freely. {% amendment-disclaimer name="DynamicMPT" /%}

#### Metadata

MPTs store on-chain metadata as a hex blob in the `MPTokenMetadata` field, following a defined schema. This is where the token's **ticker** symbol lives. For a trust line token the ticker is the [currency code][Currency Code]. 

See [On-Chain Metadata](../../concepts/tokens/fungible-tokens/multi-purpose-tokens.md#on-chain-metadata) for more information on the metadata schema.

### 2. Holder Opts In

**Performed by:** Holder.
{% admonition type="info" name="Note" %}
If the issuance requires allow-listing (the **Require Auth** flag), the issuer must also approve the holder.
{% /admonition %}

**Resources**

- **Tutorial:** [Send an MPT](../../tutorials/payments/send-an-mpt.md)
- **Transactions:** [MPTokenAuthorize transaction][]

---

Both token standards require holders to opt in before they can receive a token, but through different transactions. Where a holder once used the [TrustSet transaction][] to open a trust line, they now submit an `MPTokenAuthorize` naming the `mpt_issuance_id`. This creates a zero-balance `MPToken` entry on their account and is a prerequisite to receive any payment of the token.

The [DEX Swap](#dex-swap) and [Clawback and Check](#clawback-and-check) migration mechanisms can create the `MPToken` automatically as part of the exchange, but a direct payment of the token always requires the opt-in first.

The opt-in is also more granular. A trust line is identified by the two accounts it connects and a currency code, so an issuer reusing that code across reissuances keeps holders' existing trust lines valid. An `MPToken` entry names a specific issuance by its unique `mpt_issuance_id`, so each new issuance carries a new ID that every holder must authorize again, even for the same underlying asset.

Each holder must sign their own `MPTokenAuthorize`, so the issuer can't opt in for them. The issuer could [sponsor the transaction cost and owner reserve](https://opensource.ripple.com/docs/xls-68-sponsored-fees-and-reserves/concepts/sponsored-fees-and-reserves) to make opting in free and reduce it to a single action in the issuer's app, but can't remove the opt-in itself. {% amendment-disclaimer name="Sponsor" /%}

#### Require Auth

If the issuance uses allow-listing (**Require Auth**), the opt-in is two-sided. The holder must submit `MPTokenAuthorize` first, then the issuer authorizes each holder by submitting their own `MPTokenAuthorize` naming the holder's address. The issuer cannot pre-approve a holder before they have opted in. See [Operational controls](#operational-controls) for how that flag's scope narrows from account-wide to per issuance.

### 3. Run the Exchange

**Performed by:** Issuer and holder together, one exchange per holder

**Resources**

- **Transactions:** [OfferCreate transaction][], [AMMCreate transaction][], [CheckCash transaction][], [Batch transaction][], [Clawback transaction][]
- **Concepts:** [Decentralized Exchange](../../concepts/tokens/decentralized-exchange/index.md), [Automated Market Makers](../../concepts/tokens/decentralized-exchange/automated-market-makers.md)

---

The three mechanisms below differ in who initiates the exchange, whether it settles atomically, and which amendments and token settings they require:

| | DEX Swap | Clawback and Check | Batch Transaction |
| --- | --- | --- | --- |
| Who initiates | Holder | Issuer | Both sign, issuer submits |
| Atomic exchange | ✅ Each trade settles atomically. | ❌ The holder holds neither token between the clawback and cashing the Check. | ✅ Both legs settle together or not at all. |
| Holder action | Place the trade | Cash the Check | Sign their leg of the Batch |
| Preconditions | **Can Trade** enabled on the issuance | **Allow Trust Line Clawback** already set on the issuer account, and **Require Auth** off on the issuance | A wallet or tool that supports Batch signing |
| Gating amendment | `MPTokensV2` | `MPTokensV2` | `Batch` (to be replaced by `BatchV1_1`) |
| Best for | Self-service migration of active holders | Recovering balances from unresponsive holders | Coordinated, all-or-nothing exchanges |

An issuer can combine them. For example, an issuer with 10,000 holders might run Batch exchanges for the institutional accounts it can reach directly, seed a one-to-one AMM pool so retail holders migrate themselves, and claw back the remaining balances at the deadline.

If the new issuance uses **Require Auth**, the options narrow. Batch and DEX Swap both work only after the two-sided authorization described in [Holders Opt In](#2-holders-opt-in) is complete for each holder, and Clawback and Check loses its no-opt-in benefit entirely, because cashing a Check still enforces authorization.

Balances held by exchanges and custodians migrate on the custodian's timeline, not the end user's. An omnibus wallet often holds a large share of the supply, so engage those partners before opening the exchange window.

{% admonition type="info" name="What a migration costs" %}
The issuer pays one owner reserve increment for the `MPTokenIssuance` entry, plus transaction costs for its side of each exchange. Each holder pays one owner reserve increment for their `MPToken` entry and carries both it and the old trust line reserve until the emptied trust line is deleted. The issuer can [sponsor holders' costs](https://opensource.ripple.com/docs/xls-68-sponsored-fees-and-reserves/concepts/sponsored-fees-and-reserves) to absorb both. In practice, coordination is the dominant cost, because every holder has to be reached and act.
{% /admonition %}

#### DEX Swap

The issuer provides liquidity for the pair by placing one-to-one offers on the [DEX](../../concepts/tokens/decentralized-exchange/index.md) or seeding an [AMM](../../concepts/tokens/decentralized-exchange/automated-market-makers.md) pool. Holders trade their old token for the new MPT themselves, so the issuer never touches individual balances.

Holders don't need to opt in before trading. A consumed offer creates and authorizes the holder's `MPToken` automatically, unless the issuance uses **Require Auth**, in which case the issuer must authorize each holder first ([XLS-82: MPT DEX Integration](https://opensource.ripple.com/docs/xls-82-mpt-dex)). Price the one-to-one offers in the issuance's base units, and pick an `AssetScale` that preserves every balance's precision so the swap doesn't shave value (see [Precision and supply](#precision-and-supply)).

Because MPT trading is amendment-gated, sequence the migration around it. If the token must stay tradeable throughout, don't move holders onto the MPT until MPTokensV2 is enabled, or you risk stranding liquidity on the trust line side.

- **Requirements:** the MPTokensV2 amendment, which adds MPT support to the DEX and AMMs, and holders who actively place the trade.
- **Trade-offs:** fully self-service, so there's no per-holder coordination, but the issuer can't force completion. Balances move only as holders choose to swap. {% amendment-disclaimer name="MPTokensV2" /%}

#### Clawback and Check

The issuer claws back the old trust line balance, then delivers the equivalent MPT as a [Check](../../references/protocol/transactions/types/checkcash.md) the holder cashes. Because cashing a Check for an MPT creates and authorizes the holder's `MPToken` if it doesn't exist ([XLS-82: MPT DEX Integration](https://opensource.ripple.com/docs/xls-82-mpt-dex)), the holder can accept the new token without opting in first.

This mechanism is conditional:

- **Clawback must already be enabled.** [Allow Trust Line Clawback](../../concepts/tokens/fungible-tokens/clawing-back-tokens.md) can only be set on an account with an empty owner directory, before any trust lines or other objects exist. An issuer that didn't enable it at account setup can't claw back an already-circulating token. It's also mutually exclusive with **No Freeze**.
- **The MPT must not use Require Auth.** Cashing a Check still enforces authorization, so the no-opt-in benefit only holds when the issuance has Require Auth off. With Require Auth on, the issuer must authorize the holder first.
- **Requirements:** the conditions above, plus the `MPTokensV2` amendment for MPT support in Checks.
- **Trade-offs:** issuer-driven, so it doesn't depend on the holder initiating, but the narrow preconditions make it an edge-case path rather than a general one. The exchange also isn't atomic. Between the clawback and cashing the Check the holder holds neither token, and an uncashed Check can expire, leaving the issuer to reissue it. {% amendment-disclaimer name="MPTokensV2" /%}

#### Batch Transaction

The holder returns the old balance and the issuer delivers the MPT as inner transactions of a single multi-account [Batch](../../references/protocol/transactions/types/batch.md) in `tfAllOrNothing` mode, so both legs settle together or not at all. The inner transactions themselves are unsigned. The holder instead authorizes the exchange by signing a `BatchSigners` entry that covers the batch flags and the hashes of **all** inner transactions, so their signature commits to the entire atomic exchange, and the issuer signs and submits the outer transaction.

- **Requirements:** the `Batch` amendment, and the holder's `BatchSigners` signature, which requires a wallet or SDK that supports multi-account Batch signing.
- **Trade-offs:** the cleanest option, since the exchange is atomic with no window where a holder has given up the old token but not received the new one. It still needs holder cooperation per exchange and the amendment enabled. {% amendment-disclaimer name="Batch" /%}

{% admonition type="warning" name="Amendment status" %}
The original `Batch` amendment was disabled in `rippled` v3.1.1 due to a bug, and is due to be replaced by `BatchV1_1` in a future release. Check the [amendment status](/resources/known-amendments.md#batch) before planning a migration around this mechanism.
{% /admonition %}

### 4. Retire the Old Token

**Performed by:** Issuer, with holders deleting their emptied trust lines

**Resources**

- **Transactions:** [AccountSet transaction][], [TrustSet transaction][]
- **Concepts:** [Freezes](../../concepts/tokens/fungible-tokens/freezes.md)

---

The issuer can't delete holders' trust lines, so retiring the old token is a wind-down rather than a deletion:

1. Announce a migration deadline, and keep at least one exchange mechanism open until it passes.
2. Withdraw issuer-provided liquidity, such as open DEX offers and AMM positions, so no new balances accumulate on the old token.
3. Enact a **Global Freeze** (`asfGlobalFreeze` on `AccountSet`) at the deadline, so the remaining balances can't circulate.
4. Encourage holders to zero out and delete their emptied trust lines, which frees one owner reserve increment on each holder's account.

{% admonition type="warning" name="No Freeze makes the freeze permanent" %}
An issuer that enabled **No Freeze** can still enact a Global Freeze, but can never lift it afterward. If there's any chance you'd want to reopen the old token after the deadline, that option is gone once the freeze is enacted. Factor this into the deadline messaging.
{% /admonition %}

## What Changes for Integrators

Integrator work runs in parallel with the migration path rather than as a step in it. The sections below cover what wallets, exchanges, and explorers need to change, and how the issuer's day-to-day controls shift shape after the move.

### Payment references

**Resources**

- **Tutorial:** [Send an MPT](../../tutorials/payments/send-an-mpt.md)
- **Transactions:** [Payment][]
- **API Methods:** [account_lines method][], [account_objects method][], [ledger_entry method][], [mpt_holders](../../references/http-websocket-apis/public-api-methods/clio-methods/mpt_holders.md)

---

Both standards send tokens with the same [Payment][] transaction, but the `Amount` field identifies the token differently. Any code that builds, parses, or stores token amounts is the part of the integration most affected by the migration.

With a trust line token, the `Amount` is a composite object. The `currency` code and `issuer` address together identify the token, alongside the `value`.

An MPT replaces that pair with a single `mpt_issuance_id`. The issuance already encodes its issuer, so the `currency` and `issuer` sub-fields are gone.

{% tabs %}

{% tab label="Trust Line Token" %}
```json
"Amount": {
  "currency": "USD",
  "issuer": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
  "value": "100"
}
```
{% /tab %}

{% tab label="MPT" %}
```json
"Amount": {
  "mpt_issuance_id": "05EECEBE97A7D635DE2393068691A015FED5A89AD203F5AA",
  "value": "100"
}
```
{% /tab %}

{% /tabs %}

At the field level this is a one-for-one swap, but it affects anything that uses the `(currency, issuer)` pair as an identifier. Internal balance records, ledger queries, and display logic all need to switch to the `mpt_issuance_id`.

The read path changes with it. Trust line balances come from the [account_lines method][], while MPT balances live in `MPToken` entries queried with the [account_objects method][] or [ledger_entry method][], and the [mpt_holders](../../references/http-websocket-apis/public-api-methods/clio-methods/mpt_holders.md) method enumerates an issuance's holders. Incoming MPT payments appear in transaction metadata as changes to `MPToken` entries rather than `RippleState` entries, so deposit detection needs to handle both shapes during the transition.

{% admonition type="info" name="Note" %}
An MPT `value` is an integer amount in the issuance's base units, governed by its `AssetScale`. A trust line `value` is a decimal with up to 15 significant digits. Define a rounding policy before converting existing balances, and prefer an `AssetScale` that makes rounding unnecessary, because converting customer balances is an auditable event.
{% /admonition %}

#### Payment constraints

MPTs support direct payments between two accounts, including partial payments. Direct payments between two non-issuer holders also require the issuance's **Can Transfer** flag (see [Flags](#flags)). Support for pathfinding and cross-currency payments requires {% amendment-disclaimer name="MPTokensV2" compact=true /%}. If either of those flows is in use, plan for the amendment to be enabled before migrating them. See the [Token Standard Comparison](#token-standard-comparison) for the full feature matrix.

### Supporting both standards

During the transition, an integrator lists the same asset in two forms. Treat the trust line's `(currency, issuer)` pair and the MPT's `mpt_issuance_id` as two keys that map to one display asset, and accept deposits on both rails until the issuer retires the old token.

The ticker also lives in a different place on each side. For the trust line token it's the [currency code][Currency Code], while for the MPT it's a field inside the on-chain metadata (see [Metadata](#metadata)). Resolve both to the same display symbol so users don't see two unrelated assets.

Plan the cutover around the issuer's signals, such as the announced migration deadline and the old token's outstanding supply approaching zero.

### Operational controls

**Resources**

- **Transactions:** [MPTokenIssuanceCreate transaction][], [MPTokenIssuanceSet transaction][], [Clawback transaction][], [AccountSet transaction][]

---

The biggest conceptual shift is scope. With trust lines, the issuer's controls are account-wide settings toggled with [AccountSet][AccountSet transaction], so a change applies to every token the account issues. With MPTs, each control is a flag or field on the individual issuance, so two issuances from the same account can carry entirely different policies. Most MPT controls are also decided at creation and permanent unless the issuer marks them mutable. {% amendment-disclaimer name="DynamicMPT" compact=true /%}

#### Freeze

Both standards can freeze balances globally (every holder of the token at once) or individually (a single holder). They differ in how the capability is gated and how an individual freeze behaves.

For trust lines, freezing is available by default. The issuer freezes every holder of a currency with **Global Freeze** (`asfGlobalFreeze` on `AccountSet`), or a single trust line with an **individual freeze** (`tfSetFreeze` on `TrustSet`). An individual freeze blocks the holder from sending the token to anyone except the issuer, but they can still receive it. A **deep freeze** (`tfSetDeepFreeze`) additionally blocks the frozen holder from receiving the token. With **No Freeze** (`asfNoFreeze`), the issuer permanently gives up individual freezes and the ability to end a Global Freeze. Enacting a Global Freeze remains possible, but it can never be lifted.

For an MPT, locking (the MPT equivalent of a freeze) is opt-in. The issuer must enable **Can Lock** (`tfMPTCanLock`) at creation, or the issuance can never be locked. When it's enabled, the issuer locks or unlocks with `MPTokenIssuanceSet` using the `tfMPTLock` and `tfMPTUnlock` flags, applying to the whole issuance by default or to a single account by naming a `Holder`. An individual MPT lock always behaves like a trust line deep freeze. The locked holder can neither send nor receive the token, except in direct payments with the issuer.

#### Require Auth (allow-listing)

For trust lines, **Require Auth** is the account-wide `asfRequireAuth` setting, which can only be enabled while the account owns no trust lines or other ledger entries.

For an MPT, it's the per-issuance **Require Auth** flag (`tfMPTRequireAuth`), chosen at creation. As covered in [Holders Opt In](#2-holders-opt-in), this is what makes the opt-in two-sided.

#### Transfer fee

For trust lines, the transfer fee is the account-wide `TransferRate`, which applies to all tokens the account issues.

For an MPT, it's the per-issuance `TransferFee` field, fixed at creation and requiring **Can Transfer** (`tfMPTCanTransfer`). Different issuances from the same account can charge different fees.

#### Clawback

For trust lines, clawback is the account-wide **Allow Trust Line Clawback** setting, which must be enabled before issuing any tokens and can never be reversed.

For an MPT, clawback is the per-issuance **Can Clawback** flag (`tfMPTCanClawback`), chosen at creation. When it's enabled, the issuer claws back with the [Clawback][Clawback transaction] transaction, which for MPTs requires a `Holder` field naming the account to claw back from.

The trust-line side of this is also what gates the [Clawback and Check](#clawback-and-check) migration mechanism, which reclaims the old balance with a clawback before delivering the MPT. That path therefore depends on **Allow Trust Line Clawback** already being set on the issuer's account. The per-issuance **Can Clawback** flag governs the new token but isn't required to claw back the old one.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
