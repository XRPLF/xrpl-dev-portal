---
seo:
    description: A migration guide for issuers and integrators moving fungible tokens from trust lines to Multi-Purpose Tokens (MPTs) on the XRP Ledger.
labels:
  - Tokens
  - MPTs, Multi-Purpose Tokens
  - Migration
---
# Migrating from Trust Line Tokens to MPTs

This page walks through the process of migrating an existing trust line token (v1 fungible token standard) to a Multi-Purpose Token (v2 fungible token standard). It's aimed at **issuers** who are planning to migrate their existing tokens and **integrators** (wallets, explorers, exchanges) who need to support both standards during the transition.

The guide is structured as a planning and decision reference. It covers the migration process, contrasts the trust line and MPT equivalents, and links to the protocol references and tutorials needed for hands-on implementation.

{% admonition type="info" name="Note" %}
The information in this guide is not meant to be exhaustive, and you should refer to the references, concepts, and tutorials for further details.
{% /admonition %}

## Token Standard Comparison

The following table summarizes the key differences between trust line tokens and MPTs:

| Feature | Trust Line Tokens (v1) | Multi-Purpose Tokens (v2) |
| ---------- | ---------------------- | ------------------------- |
| Issuance | No setup step.<br><br>The token is just a currency code on the issuer's account; no ledger object defines it. | Explicit per-token setup.<br><br>`MPTokenIssuanceCreate` creates a ledger object that defines the token. |
| Holder opt-in | Per (issuer, currency) trust line.<br><br>One `TrustSet` opts the holder into that currency from that issuer. | Per-issuance authorization.<br><br>One `MPTokenAuthorize` covers a single issuance. |
| Payment references | Composite identity.<br><br>`currency` + `issuer` in the `Amount` field. | Single identifier.<br><br>`mpt_issuance_id` in the `Amount` field. |
| Operational controls | Account-wide scope.<br><br>Freeze, clawback, transfer fee, and require-auth span all the issuer's tokens. | Per-issuance scope.<br><br>Freeze, clawback, transfer fee, and require-auth are set per token. |
| Rippling behavior | ✅ Balances can ripple through a common issuer, governed by the Default Ripple and No Ripple flags. | ❌ Not supported by design.<br><br>No amendment introduces it; flows that rely on rippling become explicit payments. |
| DEX and AMM trading | ✅ Tradeable on the DEX and in AMMs today. | Requires the `MPTokensV2` amendment.<br><br>Adds MPT support to `OfferCreate`, `Payment`, `AMM`, and `Checks`. |
| Escrow support | Requires the `TokenEscrow` amendment. | Requires the `TokenEscrow` amendment.<br><br>The same amendment enables escrow for both standards. |
| Mutable properties | Account-level only.<br><br>Settings like transfer fee and flags change anytime via `AccountSet`, but apply to all the issuer's tokens. | Requires the `DynamicMPT` amendment.<br><br>Fixed at creation by default; fields marked mutable update via `MPTokenIssuanceSet`. |
| Confidential balances | ❌ Not supported.<br><br>Token amounts are public on the ledger. | Requires the `ConfidentialTransfer` amendment.<br><br>Per-account opt-in; holders convert balances via `ConfidentialMPTConvert`. |

## Migration Strategy

The central challenge of a token migration on the XRP Ledger is that the issuer can't move existing holders automatically. Each holder controls their own trust line and `MPToken`, so exchanging an old balance for a new one always involves a transaction the holder or issuer signs. The issuer creates the new issuance, runs the exchange through one of the mechanisms below, and retires the old token once it's no longer held.

The three mechanisms differ in who initiates the exchange, whether it settles atomically, and which amendments and token settings they require. An issuer can combine them, for example using a Batch for cooperative holders and clawback for unresponsive ones.

### DEX Swap

The issuer provides liquidity for the pair by placing one-to-one offers on the [DEX](../../concepts/tokens/decentralized-exchange/index.md) or seeding an [AMM](../../concepts/tokens/decentralized-exchange/automated-market-makers.md) pool. Holders trade their old token for the new MPT themselves, so the issuer never touches individual balances.

- **Requirements:** the `MPTokensV2` amendment, which adds MPT support to the DEX and AMMs, and holders who actively place the trade.
- **Trade-offs:** fully self-service, so there's no per-holder coordination, but the issuer can't force completion. Balances move only as holders choose to swap. {% amendment-disclaimer name="MPTokensV2" /%}

### Clawback and Check

The issuer claws back the old trust line balance, then delivers the equivalent MPT as a [Check](../../references/protocol/transactions/types/checkcash.md) the holder cashes. Because cashing a Check for an MPT can create the holder's `MPToken`, the holder can accept the new token without opting in first.

This mechanism is conditional:

- **Clawback must already be enabled.** [Allow Trust Line Clawback](../../concepts/tokens/fungible-tokens/clawing-back-tokens.md) can only be set on an account with an empty owner directory, before any trust lines or other objects exist. An issuer that didn't enable it at account setup can't claw back an already-circulating token. It's also mutually exclusive with **No Freeze**.
- **The MPT must not use Require Auth.** Cashing a Check still enforces authorization, so the no-opt-in benefit only holds when the issuance has Require Auth off. With Require Auth on, the issuer must authorize the holder first.
- **Requirements:** the conditions above, plus the `MPTokensV2` amendment for MPT support in Checks.
- **Trade-offs:** issuer-driven, so it doesn't depend on the holder initiating, but the narrow preconditions make it an edge-case path rather than a general one. {% amendment-disclaimer name="MPTokensV2" /%}

### Batch Transaction

The holder returns the old balance and the issuer delivers the MPT as inner transactions of a single multi-account [Batch](../../references/protocol/transactions/types/batch.md) in `tfAllOrNothing` mode, so both legs settle together or not at all. The holder signs their inner transaction; the issuer signs and submits the outer transaction.

- **Requirements:** the `Batch` amendment, and the holder's signature on their leg of the exchange.
- **Trade-offs:** the cleanest option, since the exchange is atomic with no window where a holder has given up the old token but not received the new one. It still needs holder cooperation per exchange and the amendment enabled. {% amendment-disclaimer name="Batch" /%}

## Migration Steps

Each step is tagged with who performs it: the **issuer** who controls the token, an **integrator** who builds software that handles it, or the **holder** the issuer and integrator facilitate.

### 1. Issuance Setup

**Performed by:** Issuer

**Resources**

- **Tutorial:** [Issue a Multi-Purpose Token](../../tutorials/tokens/mpts/issue-a-multi-purpose-token.md)
- **Transactions:** [MPTokenIssuanceCreate transaction][], [MPTokenIssuanceSet transaction][]
- **Ledger Entries:** [MPTokenIssuance entry][], [MPToken entry][]

---

With trust lines, there's no creation step. A token exists implicitly as a currency code the moment it's paid out. MPTs work the other way around. The issuer explicitly creates the token by submitting an `MPTokenIssuanceCreate` transaction, which creates an issuance ledger object with a unique `mpt_issuance_id`.

```json
{
  "TransactionType": "MPTokenIssuanceCreate",
  "Account": "rNFta7UKwcoiCpxEYbhH2v92numE3cceB6",
  "AssetScale": 4,
  "TransferFee": 0,
  "MaximumAmount": "50000000",
  "Flags": 122,
  "MPTokenMetadata": "7B2274223A2254 ... 7D"
}
```

{% admonition type="warning" name="Caution" %}
The properties set here are permanent for the issuance's lifetime, so validate the configuration on a test network before production. The only way to change them is to destroy the issuance and reissue, which is possible only when every holder's balance is zero.
{% /admonition %}

The new `MPTokenIssuance` object adds one owner reserve increment ({% $env.PUBLIC_OWNER_RESERVE %}) to the issuer's account, a cost trust line tokens don't have because they have no ledger object. See [Reserves](../../concepts/accounts/reserves.md).

#### Precision and supply

MPTs add two permanent settings that trust lines didn't have. Neither one can be changed after creation, so choose both carefully.

- **`AssetScale`** fixes the number of decimal places the token subdivides into. Trust line balances are arbitrary-precision, so choose a scale that preserves the precision of the existing balances.
- **`MaximumAmount`** sets a permanent cap on the total units that can ever be issued. Trust line tokens have no protocol-level supply cap, so set this high enough to cover all future issuance.

#### Flags

Because trust lines have no creation step, there are no token-level flags to set. An MPT instead carries its own control flags, which the issuer chooses at creation, such as **Can Lock**, **Require Auth**, or **Can Escrow**. See the [flags reference](../../references/protocol/transactions/types/mptokenissuancecreate.md#mptokenissuancecreate-flags) for what each flag enables.

One of these flags also gates a [migration mechanism](#migration-mechanisms) and so must be decided here, at creation: **Can Trade** (`tfMPTCanTrade`) is what enables the [DEX Swap](#dex-swap) path covered in [Step 5](#5-dex-and-amm-trading).

Each flag is permanent unless the issuer marks it mutable in `MutableFlags` at creation, which then allows updating it later with `MPTokenIssuanceSet`. {% amendment-disclaimer name="DynamicMPT" /%}

#### Metadata

MPTs store on-chain metadata as a hex blob in the `MPTokenMetadata` field, following a defined schema. This is where the token's **ticker** symbol lives. For a trust line token the ticker is the [currency code][Currency Code]; for an MPT it's simply a field inside the metadata blob. See [On-Chain Metadata](../../concepts/tokens/fungible-tokens/multi-purpose-tokens.md#on-chain-metadata) for more information on the metadata schema.

### 2. Holder Opt-In

**Performed by:** Holder, with the issuer authorizing each holder when Require Auth is enabled

**Resources**

- **Tutorial:** [Send an MPT](../../tutorials/payments/send-an-mpt.md)
- **Transactions:** [MPTokenAuthorize transaction][]

---

Both token standards require holders to opt in before they can receive a token, but through different transactions. Where a holder once used the [TrustSet transaction][] to open a trust line, they now submit an `MPTokenAuthorize` naming the `mpt_issuance_id`, which creates a zero-balance `MPToken` entry on their account and is a prerequisite to receive any payment of the token.

```json
{
  "TransactionType": "MPTokenAuthorize",
  "Account": "rsNw23ygZatXv7h8QVSgAE4jktY2uW1iZP",
  "MPTokenIssuanceID": "05EECEBE97A7D635DE2393068691A015FED5A89AD203F5AA",
  "Flags": 0
}
```

The opt-in is also more granular. A trust line is keyed by a currency code, so reusing that code across reissuances keeps the existing trust line valid. An MPT authorization is keyed by the unique `mpt_issuance_id`, so each new issuance carries a new ID that every holder must authorize again, even for the same underlying asset.

One rule carries over unchanged. Each holder must sign their own `MPTokenAuthorize`, so the issuer can't opt in for them.

The issuer could [sponsor the transaction cost](https://opensource.ripple.com/docs/xls-68-sponsored-fees-and-reserves/concepts/sponsored-fees-and-reserves) to make it free and reduce it to a single action in the issuer's app, but can't remove the opt-in itself. {% amendment-disclaimer name="Sponsor" /%}

If the issuance uses allow-listing (**Require Auth**), the opt-in is two-sided. The holder must submit `MPTokenAuthorize` first, then the issuer authorizes each holder by submitting their own `MPTokenAuthorize` naming the holder's address. The issuer cannot pre-approve a holder before they have opted in. See [Step 4: Operational Controls](#4-operational-controls) for how that flag's scope narrows from account-wide to per issuance.

### 3. Payment References

**Performed by:** Integrator

**Resources**

- **Tutorial:** [Send an MPT](../../tutorials/payments/send-an-mpt.md)
- **Transactions:** [Payment][]

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

At the field level this is a one-for-one swap, but it ripples through anything keyed on the `(currency, issuer)` pair. Internal balance records, ledger queries, and display logic all need to switch to keying on the `mpt_issuance_id`.

{% admonition type="info" name="Note" %}
An MPT `value` is an integer amount in the issuance's base units, governed by its `AssetScale`. A trust line `value` is an arbitrary-precision decimal. Account for this difference when converting existing balances.
{% /admonition %}

#### Payment constraints

MPTs support direct payments between two accounts. Support for pathfinding, cross-currency, and partial payments requires {% amendment-disclaimer name="MPTokensV2" compact=true /%}, which extends `OfferCreate`, `Payment`, `AMM`, and `Checks` to MPTs. If any of those flows are in use, plan for the amendment to be enabled before migrating them. See the [Token Standard Comparison](#token-standard-comparison) for the full feature matrix.

### 4. Operational Controls

**Performed by:** Issuer

**Resources**

- **Transactions:** [MPTokenIssuanceCreate transaction][], [MPTokenIssuanceSet transaction][], [Clawback transaction][], [AccountSet transaction][]

---

The biggest conceptual shift is scope. With trust lines, the issuer's controls are account-wide settings toggled with [AccountSet][AccountSet transaction], so a change applies to every token the account issues. With MPTs, each control is a flag or field on the individual issuance, so two issuances from the same account can carry entirely different policies. Most MPT controls are also decided at creation and permanent unless the issuer marks them mutable. {% amendment-disclaimer name="DynamicMPT" compact=true /%}

#### Freeze

Both standards can freeze balances globally (every holder of the token at once) or individually (a single holder). They differ in how the capability is gated and how an individual freeze behaves.

For trust lines, freezing is available by default. The issuer freezes every holder of a currency with **Global Freeze** (`asfGlobalFreeze` on `AccountSet`), or a single trust line with an **individual freeze** (`tfSetFreeze` on `TrustSet`). A **deep freeze** (`tfSetDeepFreeze`) additionally blocks the frozen holder from sending the token. The issuer can permanently surrender all of these with **No Freeze** (`asfNoFreeze`).

For an MPT, locking (the MPT equivalent of a freeze) is opt-in: the issuer must enable **Can Lock** (`tfMPTCanLock`) at creation, or the issuance can never be locked. When it's enabled, the issuer locks or unlocks with `MPTokenIssuanceSet` using the `tfMPTLock` and `tfMPTUnlock` flags, applying to the whole issuance by default or to a single account by naming a `Holder`. An individual MPT lock always behaves like a trust line deep freeze: the locked holder can neither send nor receive the token.

#### Require Auth (allow-listing)

For trust lines, **Require Auth** is the account-wide `asfRequireAuth` setting, which the issuer must enable before creating any trust lines.

For an MPT, it's the per-issuance **Require Auth** flag (`tfMPTRequireAuth`), chosen at creation. As covered in [Holder Opt-In](#2-holder-opt-in), this is what makes the opt-in two-sided.

#### Transfer fee

For trust lines, the transfer fee is the account-wide `TransferRate`, which applies to all tokens the account issues.

For an MPT, it's the per-issuance `TransferFee` field, fixed at creation and requiring **Can Transfer** (`tfMPTCanTransfer`). Different issuances from the same account can charge different fees.

#### Clawback

For trust lines, clawback is the account-wide **Allow Trust Line Clawback** setting, which must be enabled before issuing any tokens and can never be reversed.

For an MPT, clawback is the per-issuance **Can Clawback** flag (`tfMPTCanClawback`), chosen at creation. When it's enabled, the issuer claws back with the [Clawback][Clawback transaction] transaction, which for MPTs requires a `Holder` field naming the account to claw back from.

The trust-line side of this is also what gates the [Clawback and Check](#clawback-and-check) migration mechanism, which reclaims the old balance with a clawback before delivering the MPT. That path therefore depends on **Allow Trust Line Clawback** already being set on the issuer's account; the per-issuance **Can Clawback** flag governs the new token but isn't required to claw back the old one.

### 5. DEX and AMM Trading

**Performed by:** Issuer (enables trading at creation) and integrator (builds trading flows)

**Resources**

- **Transactions:** [OfferCreate transaction][], [AMMCreate transaction][], [Payment transaction][]
- **Concepts:** [Decentralized Exchange](../../concepts/tokens/decentralized-exchange/index.md), [Automated Market Makers](../../concepts/tokens/decentralized-exchange/automated-market-makers.md)

---

{% amendment-disclaimer name="MPTokensV2" /%}

Trust line tokens can be traded on the [DEX](../../concepts/tokens/decentralized-exchange/index.md) and pooled in [AMMs](../../concepts/tokens/decentralized-exchange/automated-market-makers.md) today. Under MPTokensV2, the same becomes true for MPTs: the amendment extends `OfferCreate`, `Payment`, `AMM`, and `Checks` to accept the `mpt_issuance_id`.

To make an issuance tradeable, enable **Can Trade** (`tfMPTCanTrade`) at creation. Like other control flags, it's permanent once the issuance exists unless the issuer marked it mutable (see [Issuance Setup](#1-issuance-setup)), so decide up-front whether the token will ever need to trade.

Enabling trading is what arms the [DEX Swap](#dex-swap) migration mechanism, where holders trade the old token for the new MPT through issuer-provided offers or an AMM pool. Because the capability is amendment-gated, the issuer sequences the migration around it: if the token must stay tradeable throughout, don't move holders onto an MPT until MPTokensV2 is enabled, or risk stranding liquidity on the trust line side.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
