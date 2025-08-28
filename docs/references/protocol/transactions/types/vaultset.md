---
seo:
    description: Modifies a single asset vault that you own.
labels:
  - Transactions
  - Single Asset Vault
---

# VaultSet

[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/VaultSet.cpp "Source")

Modifies a single asset vault that you own. This transaction allows the Vault Owner to update certain mutable fields, including vault metadata and the maximum asset amount.

{% admonition type="warning" name="Warning" %}
Once a vault is created, its public or private status is permanent and cannot be changed. The [tfVaultPrivate](../../ledger-data/ledger-entry-types/vault.md#vault-flags) flag determines this status, and once set, it cannot be updated.
{% /admonition %}

_(Requires the [SingleAssetVault amendment][] {% not-enabled /%})_

## Example {% $frontmatter.seo.title %} JSON

```json
{
  "TransactionType": "VaultSet",
  "Account": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
  "Fee": "12",
  "Flags": 0,
  "LastLedgerSequence": 7108682,
  "Sequence": 8,
  "VaultID": "77D6234D074E505024D39C04C3F262997B773719AB29ACFA83119E4210328776",
  "Data": "5468697320697320617262697472617279206D657461646174612061626F757420746865207661756C742E",
  "AssetsMaximum": 5,
  "DomainID": "77D6234D074E505024D39C04C3F262997B773719AB29ACFA83119E4210328776"
}
```

## {% $frontmatter.seo.title %} Fields

In addition to the [common fields](../../../protocol/transactions/common-fields#transaction-common-fields), {% code-page-name /%} transactions use the following fields:

| Field Name        | JSON Type | [Internal Type][] | Required? | Description         |
| :---------------- | :-------- | :---------------- | :-------- | :-------------------|
| `VaultID`         | String    | Hash256           | Yes       | The unique identifier of the vault that needs to be updated. |
| `Data`            | String    | Blob              | No        | Arbitrary vault metadata, limited to 256 bytes. |
| `AssetsMaximum`   | Number    | Number            | No        | The maximum asset amount that can be held in a vault. The value cannot be lower than the current `AssetsTotal`, unless the value is 0. |
| `DomainID`        | String    | Hash256           | No        | The [PermissionedDomain](../../../../concepts/tokens/decentralized-exchange/permissioned-domains.md) object ID associated with the shares of this vault. The `DomainID` is only required when updating a private vault. |

## {% $frontmatter.seo.title %} Flags

There are no flags defined for {% code-page-name /%} transactions.

## Error Cases

Besides errors that can occur for all transactions, {% code-page-name /%} transactions can result in the following [transaction result codes](../../../protocol/transactions/transaction-results/index.md):

| Error Code            | Description                           |
| :-------------------- | :-------------------------------------|
| `tecNO_ENTRY`         | The transaction attempted to modify a vault that does not exist. Check the `VaultID` field of the transaction. |
| `tecOBJECT_NOT_FOUND` | The `PermissionedDomain` object with the provided `DomainID` does not exist. |
| `tecNO_PERMISSION`    | The account submitting the transaction is not the `Owner` of the vault, or is trying to set a `DomainID` for a public vault. |
| `temMALFORMED`        | The transaction was not validly formatted. For example, the `Data` field is larger than 256 bytes. |
| `tecLIMIT_EXCEEDED`   | The _new_ `AssetsMaximum` value is **lower** than the vault's _current_ `AssetsTotal`. |
| `temDISABLED`         | Either the Single Asset Vault amendment is not enabled, or a `DomainID` is provided and the Permissioned Domains amendment is not enabled. |

## See Also

- [Vault entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
