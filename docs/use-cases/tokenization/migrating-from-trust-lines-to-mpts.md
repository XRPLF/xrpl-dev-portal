---
seo:
    description: A migration guide for issuers and integrators moving fungible tokens from trust lines to Multi-Purpose Tokens (MPTs) on the XRP Ledger.
labels:
  - Tokens
  - MPTs, Multi-Purpose Tokens
  - Migration
---
# Migrating from Trust Line Tokens to MPTs

This page walks through the process of migrating an existing trust line token (v1 fungible token standard) to a Multi-Purpose Token (v2 fungible token standard). It's aimed at issuers and integrators planning a migration.

The guide is structured as a planning and decision reference. Each step explains what changes conceptually, contrasts the trust line and MPT equivalents, and links to the protocol references and tutorials you need for hands-on implementation.

{% admonition type="info" name="Note" %}
The information in this guide is not exhaustive and you should refer to the protocol references and tutorials for further details.
{% /admonition %}

## Token Standard Comparison

Before you proceed with the migration, its reccomended that you familiarize yourself with the key differences between trust line tokens and MPTs so you can see at a glance how the two standards compare.

| Capability | Trust Line Tokens (v1) | Multi-Purpose Tokens (v2) |
| ---------- | ---------------------- | ------------------------- |
| [Issuance setup](#step-1-issuance-setup) | No setup step.<br><br>The token is just a currency code on your account; no ledger object defines it. | Explicit per-token setup.<br><br>`MPTokenIssuanceCreate` creates a ledger object that defines the token. |
| [Holder opt-in](#step-2-holder-opt-in) | Per (issuer, currency) trust line.<br><br>One `TrustSet` opts the holder into that currency from that issuer. | Per-issuance authorization.<br><br>One `MPTokenAuthorize` covers a single issuance. |
| [Payment references](#step-3-payment-references) | Composite identity.<br><br>`currency` + `issuer` in the `Amount` field. | Single identifier.<br><br>`mpt_issuance_id` in the `Amount` field. |
| [Operational controls](#step-4-operational-controls) | Account-wide scope.<br><br>Freeze, clawback, transfer fee, and require-auth span all the issuer's tokens. | Per-issuance scope.<br><br>Freeze, clawback, transfer fee, and require-auth are set per token. |
| [DEX and AMM trading](#step-5-trading-and-pooling) | ✅ Supported. | ✅ Supported. |
| [Rippling](#step-5-trading-and-pooling) | ✅ Balances can ripple through the issuer. | ❌ MPTs do not support rippling. |
| [Escrow, batch, delegation, sponsorship](#step-6-lifecycle-features) | ✅ Supported. | ✅ Supported. |
| [Mutable properties](#step-6-lifecycle-features) | ❌ No per-token object to update.<br><br>Account-level settings change via `AccountSet`. | ✅ Declared fields update via `MPTokenIssuanceSet`, if marked mutable. |
| [Confidentiality](#step-7-confidentiality) *(optional)* | ❌ Not supported.<br><br>Token amounts are public on the ledger. | ✅ Per-account opt-in.<br><br>Holders convert balances via `ConfidentialMPTConvert`. |

<!--
## Partner Coordination

Whichever pattern you choose, you depend on the ecosystem to support MPTs before you can execute. Confirm readiness with each partner (custodians, exchanges, KYT vendors, market makers) and budget their integration work into your timeline.

- **Custody and key management.** Your custody provider must track MPT issuance IDs as a supported asset, sign MPT transactions, and surface MPT balances. Typically the long-pole dependency.
- **Hot-wallet authorization.** Any account that receives MPTs (exchange hot wallets, redemption addresses, market-maker accounts) must submit `MPTokenAuthorize` against each issuance, or the ledger rejects incoming payments.
- **Deposit and balance-display flows.** Partner code that parses `Amount` from transaction history must branch on `mpt_issuance_id` versus `currency`/`issuer`. Each partner also decides whether to present trust line token and MPT balances of the same underlying asset as a unified balance (cleaner UX, harder reconciliation) or as separate listings such as "USDC (trust line)" and "USDC (MPT)" (easier accounting, two listings for the same thing).
- **Compliance and KYT integration.** Transaction-monitoring vendors must recognize MPT issuance IDs and parse MPT-denominated transactions.
- **Exchange listings.** A new MPT listing alongside an existing trust line listing fragments liquidity unless the exchange offers a unified balance or a swap path. Coordinate listing timing with custody readiness.
-->

## Migration Steps

The following steps walk through each capability in the comparison table and the key changes required to migrate from trust line tokens to MPTs.

### Step 1: Issuance Setup

**Resources**

- **Tutorial:** [Issue a Multi-Purpose Token](../../tutorials/tokens/mpts/issue-a-multi-purpose-token.md)
- **Transactions:** [`MPTokenIssuanceCreate`](../../references/protocol/transactions/types/mptokenissuancecreate.md), [`MPTokenIssuanceSet`](../../references/protocol/transactions/types/mptokenissuanceset.md)

---

With trust lines, there's no creation step. A token exists implicitly as a currency code the moment you pay it out. MPTs work the other way around. As the issuer, you explicitly create the token by submitting a single `MPTokenIssuanceCreate`, which adds a ledger object that defines it and assigns a permanent `mpt_issuance_id`. There's no currency code to choose, because the ledger assigns this identifier for you. The following properties are set at creation:

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
The properties you set here are permanent for the issuance's lifetime, so validate your configuration on a test network before production. The only way to change them is to destroy the issuance and reissue, which is possible only when every holder's balance is zero.
{% /admonition %}

The new `MPTokenIssuance` object adds one owner reserve increment ({% $env.PUBLIC_OWNER_RESERVE %}) to your account, a cost trust line tokens don't have because they have no ledger object. See [Reserves](../../concepts/accounts/reserves.md).

#### Precision and supply

MPTs add two permanent settings that trust lines didn't have. You can't change either one after creation, so choose both carefully.

- **`AssetScale`** fixes the number of decimal places the token subdivides into. Trust line balances are arbitrary-precision, so choose a scale that preserves the precision of your existing balances.
- **`MaximumAmount`** sets a permanent cap on the total units that can ever be issued. Trust line tokens have no protocol-level supply cap, so set this high enough to cover all future issuance.

#### Flags

Because trust lines have no creation step, there are no token-level flags to set. An MPT instead carries its own control flags, which you choose at creation, such as **Can Lock**, **Require Auth**, or **Can Escrow**. See the [flags reference](../../references/protocol/transactions/types/mptokenissuancecreate.md#mptokenissuancecreate-flags) for what each flag enables.

Each flag is permanent unless you mark it mutable in `MutableFlags` at creation, which then lets you update it later with `MPTokenIssuanceSet`. {% amendment-disclaimer name="DynamicMPT" /%}

#### Metadata

MPTs store on-chain metadata as a hex blob in the `MPTokenMetadata` field, following a defined schema. This is where your token's **ticker** symbol lives. For a trust line token the ticker is the [currency code][Currency Code]; for an MPT it's simply a field inside the metadata blob. See [On-Chain Metadata](../../concepts/tokens/fungible-tokens/multi-purpose-tokens.md#on-chain-metadata) for more information on the metadata schema.

### Step 2: Holder Opt-In

**Resources**

- **Tutorial:** [Sending MPTs in JavaScript](../../tutorials/tokens/mpts/sending-mpts-in-javascript.md)
- **Transactions:** [`MPTokenAuthorize`](../../references/protocol/transactions/types/mptokenauthorize.md)

---

Both token standards require holders to opt-in before they can receive a token, but through different transactions. Where a holder once used the [TrustSet transaction][] to open a trust line, they now submit an `MPTokenAuthorize` naming the `mpt_issuance_id`, which creates a zero-balance `MPToken` entry on their account and is a prerequisite to receive any payment of the token.

```json
{
  "TransactionType": "MPTokenAuthorize",
  "Account": "rsNw23ygZatXv7h8QVSgAE4jktY2uW1iZP",
  "MPTokenIssuanceID": "05EECEBE97A7D635DE2393068691A015FED5A89AD203F5AA",
  "Flags": 0
}
```

The opt-in is also more granular. A trust line is keyed by a currency code, so reusing that code across reissuances keeps the existing trust line valid. An MPT authorization is keyed by the unique `mpt_issuance_id`, so each new issuance carries a new ID that every holder must authorize again, even for the same underlying asset.

One rule carries over unchanged. Each holder must sign their own `MPTokenAuthorize`, so you can't opt in for them.

As the issuer, you could [sponsor the fee](https://opensource.ripple.com/docs/xls-68-sponsored-fees-and-reserves/concepts/sponsored-fees-and-reserves) to make it free and reduce it to a single action in your app, but you can't remove the opt-in itself. {% amendment-disclaimer name="Sponsor" /%}

If your issuance uses allow-listing (**Require Auth**), the opt-in is two-sided. Each holder authorizes the issuance and you authorize each holder, the same as trust lines under Require Auth. See [Step 4: Operational Controls](#step-4-operational-controls) for how that flag's scope narrows from account-wide to per issuance.


{% raw-partial file="/docs/_snippets/common-links.md" /%}
