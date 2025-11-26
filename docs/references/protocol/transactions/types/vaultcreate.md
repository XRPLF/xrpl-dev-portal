---
seo:
    description: Creates a new vault object in the ledger.
labels:
  - Transactions
  - Single Asset Vault
---

# VaultCreate

[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/VaultCreate.cpp "Source")

Creates a new `Vault` ledger entry, an `MPTokenIssuance` ledger entry for the vault’s shares, and an `AccountRoot` for the vault’s [pseudo-account](../../../../concepts/accounts/pseudo-accounts.md).

Only the Vault Owner can initiate this transaction.

{% admonition type="info" name="Note" %}
Currently, the same account that creates the vault must also create other protocols, though this may change in the future.
{% /admonition %}

_(Requires the [SingleAssetVault amendment][] {% not-enabled /%})_

## Example {% $frontmatter.seo.title %} JSON

```json
{
  "TransactionType": "VaultCreate",
  "Account": "rNGHoQwNG753zyfDrib4qDvvswbrtmV8Es",
  "Asset": {
    "currency": "USD",
    "issuer": "rXJSJiZMxaLuH3kQBUV5DLipnYtrE6iVb"
  },
  "AssetsMaximum": "1000000",
  "Data": "5661756C74206D65746164617461",
  "Fee": "5000000",
  "Flags": 0,
  "MPTokenMetadata": "7B2274223A225473745368617265222C226E223A2254657374205661756C74205368617265222C2264223A22412074657374207661756C742073686172652E222C2269223A226578616D706C652E6F72672F73686172652D69636F6E2E706E67222C226163223A22727761222C226173223A22657175697479222C22696E223A224D53205465737420497373756572222C227573223A5B7B2275223A226578616D706C657969656C642E636F2F7473747368617265222C2263223A2277656273697465222C2274223A2250726F647563742050616765227D2C7B2275223A226578616D706C657969656C642E636F2F646F6373222C2263223A22646F6373222C2274223A225969656C6420546F6B656E20446F6373227D5D2C226169223A7B22766F6C6174696C697479223A226C6F77227D7D",
  "Scale": 6,
  "Sequence": 200370,
  "WithdrawalPolicy": 1
}
```

## {% $frontmatter.seo.title %} Fields

In addition to the [common fields](../../../../references/protocol/transactions/common-fields#transaction-common-fields), {% code-page-name /%} transactions use the following fields:

| Field Name         | JSON Type     | [Internal Type][] | Required? |Description        |
|:-------------------|:--------------|:------------------|:----------|:------------------|
| `Data`             | String        | Blob              | No        | Arbitrary vault metadata, in hex format, limited to 256 bytes. |
| `Asset`            | Object        | Issue             | Yes       | The asset to be held in the vault. This can be XRP, a trust line token, or an MPT. If the asset is a trust line token, the transaction creates a [trust line](../../../../concepts/tokens/fungible-tokens/trust-line-tokens.md#structure) between the vault's pseudo-account and the issuer of the asset. If the asset is an MPT, the transaction creates an `MPToken` object for the vault's pseudo-account.  |
| `AssetsMaximum`     | Number       | UInt64            | No        | The maximum asset amount that can be held in a vault. |
| `MPTokenMetadata`  | String        | Blob              | No        | Arbitrary metadata about the share `MPToken`, in hex format, limited to 1024 bytes. |
| `WithdrawalPolicy` | Number        | UInt8             | No        | Indicates the withdrawal strategy used by the vault. The default value is `0x0001`, mapped to the string `vaultStrategyFirstComeFirstServe`. See [WithdrawalPolicy](#withdrawalpolicy). |
| `DomainID`         | String        | Hash256           | No        | The [PermissionedDomain](../../../../concepts/tokens/decentralized-exchange/permissioned-domains.md) object ID associated with the shares of this vault. If provided, the transaction creates a private vault, which restricts access to accounts with [credentials](../../../../concepts/decentralized-storage/credentials.md) in the specified Permissioned Domain. |
| `Scale`             | Number       | UInt8            | No       | _(Trust line tokens only)_ Specifies decimal precision for share calculations. Assets are multiplied by 10<sup>Scale</sup > to convert fractional amounts into whole number shares. For example, with a `Scale` of `6`, depositing 20.3 units creates 20,300,000 shares (20.3 × 10<sup>Scale</sup >). For **trust line tokens** this can be configured at vault creation, and valid values are between 0-18, with the default being `6`. For **XRP** and **MPTs**, this is fixed at `0`.|

## {% $frontmatter.seo.title %} Flags

{% code-page-name /%} transactions support additional values in the `Flags` field, as follows:

| Flag Name                     | Value        | Description              |
| :---------------------------- | :------------| -------------------------|
| `tfVaultPrivate`              | `0x00010000` | Indicates that the vault is private. This flag can only be set when _creating_ the vault. |
| `tfVaultShareNonTransferable` | `0x00020000` | Indicates the vault share is non-transferable. This flag can only be set when _creating_ the vault. |

## WithdrawalPolicy

A `WithdrawalPolicy` defines the strategy for processing withdrawal requests from a vault. This policy governs how liquidity is removed. Currently, only one strategy is supported:

| Policy Name                        | Value    | Description              |
| :--------------------------------- | :------- | -------------------------|
| `vaultStrategyFirstComeFirstServe` | `0x0001` | Requests are processed on a first-come, first-served basis. With this strategy, a depositor can redeem any amount of assets, provided they hold a sufficient number of shares. |

## Transaction Cost

Since the {% code-page-name /%} transaction creates a new `AccountRoot` object for a vault’s pseudo-account, it incurs a higher than usual [transaction cost](../../../../concepts/transactions/transaction-cost) to deter ledger spam. Instead of the standard minimum of 0.00001 XRP, {% code-page-name /%} must destroy an [incremental owner reserve](../../../../concepts/accounts/reserves#base-reserve-and-owner-reserve), currently 0.2 XRP.

## Error Cases

Besides errors that can occur for all transactions, {% code-page-name /%} transactions can result in the following [transaction result codes](../transaction-results/index.md):

| Error Code                | Description                        |
| :------------------------ | :----------------------------------|
| `tecNO_AUTH`              | The asset is an MPT and the `lsfMPTCanTransfer` flag is not set in the `MPTokenIssuance` object, meaning the vault cannot be created with a non-transferable MPT. |
| `tecLOCKED`               | The asset is an MPT and the `lsfMPTLocked` flag is  set in the `MPTokenIssuance` object, meaning the asset is locked. |
| `tecFROZEN`               | The issuer has frozen the asset to be held in the vault. |
| `tecOBJECT_NOT_FOUND`     | A ledger entry specified in the transaction does not exist. For example, the provided `DomainID` does not exist. |
| `temMALFORMED`            | The transaction was not validly formatted. For example, the `Data` field is larger than 256 bytes.  |
| `tecINSUFFICIENT_RESERVE` | There is insufficient `AccountRoot.Balance` for the Owner Reserve. |
| `terNO_RIPPLE`            | The issuer of the asset has not enabled the [Default Ripple flag](../../../../concepts/tokens/fungible-tokens/stablecoins/configuration#default-ripple). |
| `terNO_ACCOUNT`           | The issuer account of the vault's asset does not exist. |
| `temDISABLED`             | Either the Single Asset Vault amendment is not enabled, a `DomainID` is provided and the Permissioned Domains amendment is not enabled, or the MPTokensV1 amendment is not enabled. |

## See Also

- [Vault entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
