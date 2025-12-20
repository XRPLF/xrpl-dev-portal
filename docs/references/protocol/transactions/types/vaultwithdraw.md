---
seo:
    description: Redeem vault shares for assets.
labels:
  - Transactions
  - Single Asset Vault
---

# VaultWithdraw

[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/VaultWithdraw.cpp "Source")

Redeem vault shares for assets. The amount of assets received depends on the [exchange rate](../../../../concepts/tokens/single-asset-vault.md#exchange-algorithm), which adjusts based on the vault’s total assets and any [unrealized losses](../../../../concepts/tokens/single-asset-vault.md#unrealized-loss).

{% admonition type="info" name="Note" %}
The `VaultWithdraw` transaction does not respect the Permissioned Domain rules. In other words, any account that holds the shares of the vault can redeem them. This is to avoid a situation where a depositor deposits assets to a private vault to then have their access revoked by invalidating their credentials, and thus losing access to their funds.
{% /admonition %}

A depositor cannot redeem liquidity if the trust line between the pseudo-account and the issuer of the vault asset is frozen, or the `MPToken` is locked.

_(Requires the [SingleAssetVault amendment][] {% not-enabled /%})_

## Example {% $frontmatter.seo.title %} JSON

```json
{
  "TransactionType": "VaultWithdraw",
  "Account": "rGFBE8WA2ZKfqGGB7CFkLusVt7hsVT4r8H",
  "Amount": {
    "mpt_issuance_id": "000000016E1417CA9DFD23400B05E43FDE5BB8D8FFA817CA",
    "value": "5"
  },
  "Destination": "rGFBE8WA2ZKfqGGB7CFkLusVt7hsVT4r8H",
  "Fee": "12",
  "Flags": 0,
  "Sequence": 200380,
  "VaultID": "A7B7B3ED3F5BD8E58C9064278EB29519CD6475D87A4517707DE108E65AE9C08C",
}
```

## {% $frontmatter.seo.title %} Fields

In addition to the [common fields](../../../protocol/transactions/common-fields#transaction-common-fields), {% code-page-name /%} transactions use the following fields:

| Field Name              | JSON Type     | [Internal Type][] | Required? | Description         |
| :-----------------------| :------------ | :---------------- | :-------- | :-------------------|
| `VaultID`               | String        | Hash256           | Yes       | The unique identifier of the vault to which the assets are deposited. |
| `Amount`                | Number        | Amount            | Yes       | The exact amount of vault asset to withdraw or vault share to redeem. |
| `Destination`           | String        | AccountID         | No        | An account to receive the assets. This account must be able to receive the vault asset or the transaction fails.                   |
| `DestinationTag`        | Number        | UInt32            | No        | Arbitrary tag identifying the reason for the withdrawal to the destination. |

There are two ways to specify the transaction `Amount` field:

<!-- Added extra column to avoid first column text from being automatically bolded -->
|     |Specify Assets  | Specify Shares  |
|:--- |:-------------- |:--------------- |
|     |<ul><li>If the `Amount` field specifies an **asset amount** (e.g., 100 XRP), the transaction burns the necessary number of shares to provide the requested amount.</li><li>If the vault has an **unrealized loss**, withdrawing the same amount of assets requires burning more shares.</li></ul> | <ul><li>If the `Amount` field specifies a **share amount** (e.g., 500 vault shares), the transaction converts those shares into the corresponding amount of assets.</li><li>If the vault has an **unrealized loss**, each share is worth less, meaning fewer assets are received.</li></ul> |

## {% $frontmatter.seo.title %} Flags

There are no flags defined for {% code-page-name /%} transactions.

## Transfer Fees

A single asset vault does not apply the [transfer fee](../../../../concepts/tokens/fungible-tokens/transfer-fees) to {% code-page-name /%} transactions. Additionally, whenever a protocol moves assets from or to a vault, the Transfer Fee must not be charged.

## Error Cases

Besides errors that can occur for all transactions, {% code-page-name /%} transactions can result in the following [transaction result codes](../../../protocol/transactions/transaction-results/index.md):

| Error Code              | Description                        |
| :---------------------- | :----------------------------------|
| `tecNO_ENTRY`           | The `Vault` object with the provided `VaultID` does not exist on the ledger. |
| `tecOBJECT_NOT_FOUND`   | A ledger entry specified in the transaction does not exist. |
| `tecNO_PERMISSION`      | The destination account specified does not have permission to receive the asset. |
| `tecWRONG_ASSET`        | The unit of `Amount` is neither a share or asset of the vault. |
| `tecINSUFFICIENT_FUNDS` | There is insufficient liquidity in the vault to fill the request. |
| `tecFROZEN`             | Either the trust line between the issuer and the destination account is frozen, or the asset is globally frozen.  |
| `tecLOCKED`             | The MPT asset is locked for the depositor, destination account, or if the asset is globally locked. |
| `temMALFORMED`          | The transaction is not validly formatted. For example, the `VaultID` is not provided.  |
| `temDISABLED`           | The Single Asset Vault amendment is not enabled.  |
| `temBAD_AMOUNT`         | The `Amount` field of the transaction is invalid. For example, the provided amount is set to 0. |
| `tecNO_AUTH`            | The asset is a non-transferable MPT. |

## See Also

- [Vault entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
