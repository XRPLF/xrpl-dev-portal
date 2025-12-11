---
seo:
    description: Deposits a specified number of assets into a vault in exchange for shares.
labels:
  - Transactions
  - Single Asset Vault
---

# VaultDeposit

[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/VaultDeposit.cpp "Source")

Deposits a specified number of assets into a vault in exchange for shares.

For private vaults, the depositor must be authorized to interact with the vault’s shares and have [Credentials](../../../../concepts/decentralized-storage/credentials.md) in the [Permissioned Domain](../../../../concepts/tokens/decentralized-exchange/permissioned-domains.md) of the share.

Public vaults require no authorization, and anyone can deposit as long as they meet the asset type requirement and have sufficient funds.

{% admonition type="warning" name="Warning" %}
A depositor cannot deposit assets into the vault if:

- The asset is frozen for the depositor.
- The trust line between the pseudo-account and the issuer is frozen, or the `MPToken` is locked.
- The vault is private and the depositor's credentials have expired.
{% /admonition %}

If successful, the transaction moves the assets from the depositor's account to the vault's pseudo-account, issues the corresponding vault shares, and updates the vault’s balance.

_(Requires the [SingleAssetVault amendment][] {% not-enabled /%})_

## Example {% $frontmatter.seo.title %} JSON

```json
{
  "TransactionType": "VaultDeposit",
  "Account": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
  "Fee": "12",
  "Flags": 0,
  "LastLedgerSequence": 7108682,
  "Sequence": 8,
  "VaultID": "77D6234D074E505024D39C04C3F262997B773719AB29ACFA83119E4210328776",
  "Amount" : {
    "currency" : "TST",
    "issuer" : "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd",
    "value" : "2.5"
  }
}
```

## {% $frontmatter.seo.title %} Fields

In addition to the [common fields](../../../protocol/transactions/common-fields#transaction-common-fields), {% code-page-name /%} transactions use the following fields:

| Field Name              | JSON Type     | [Internal Type][] | Required? | Description         |
| :-----------------------| :------------ | :---------------- | :-------- | :-------------------|
| `VaultID`               | String        | Hash256           | Yes       | The unique identifier of the vault to which the asset is deposited. |
| `Amount`                | Object        | Amount            | Yes       | The asset and quantity to be deposited into the vault.|

The deposited asset must match the vault’s designated asset for the transaction to succeed. Depending on the asset type, the following changes occur:

- **XRP**: The vault’s pseudo-account balance increases, and the depositor’s balance decreases.
- **Trust line token**: The [trust line](../../../../concepts/tokens/fungible-tokens/trust-line-tokens.md#structure) balance between the vault's pseudo-account and the asset issuer is adjusted.
- **MPT**: The `MPToken.MPTAmount` of both the depositor and the vault's pseudo-account is updated.

## {% $frontmatter.seo.title %} Flags

There are no flags defined for {% code-page-name /%} transactions.

## Transfer Fees

A single asset vault does not apply the [transfer fee](../../../../concepts/tokens/fungible-tokens/transfer-fees) to {% code-page-name /%} transactions. Additionally, whenever a protocol moves assets from or to a vault, the transfer fee isn't charged.

## Error Cases

Besides errors that can occur for all transactions, {% code-page-name /%} transactions can result in the following [transaction result codes](../../../protocol/transactions/transaction-results/index.md):

| Error Code              | Description                        |
| :---------------------- | :----------------------------------|
| `tecNO_ENTRY`           | The `Vault` object with the provided `VaultID` does not exist on the ledger. |
| `tecOBJECT_NOT_FOUND`   | A ledger entry specified in the transaction does not exist. |
| `tecWRONG_ASSET`        | The asset of the vault does not match the asset being deposited. |
| `tecINSUFFICIENT_FUNDS` | The depositor does not have sufficient funds to make a deposit. |
| `tecLIMIT_EXCEEDED`     | Adding the provided `Amount` to the `AssetsTotal` exceeds the `AssetsMaximum` value. |
| `tecNO_AUTH`            | Either the vault is private and the depositing account does not have credentials in the share's Permissioned Domain, or the asset is a non-transferable MPT. |
| `tecFROZEN`             | Either the trust line between the issuer and the depositor is frozen, or the asset is globally frozen.  |
| `tecLOCKED`             | Either the MPT asset is locked for the depositor, or if the asset is globally locked. |
| `temMALFORMED`          | The transaction was not validly formatted. For example, if the `VaultID` is not provided.  |
| `temDISABLED`           | The Single Asset Vault amendment is not enabled.  |
| `temBAD_AMOUNT`         | The `Amount` field of the transaction is invalid. |

## See Also

- [Vault entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
