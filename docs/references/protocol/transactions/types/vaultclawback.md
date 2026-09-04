---
seo:
    description: Allows the issuer of a trust line token or MPT to claw back funds from the vault. 
labels:
  - Transactions
  - Single Asset Vault
  - Lending Protocol
status: not_enabled
requiredAmendment: SingleAssetVault
txIcon: cancel
---

# VaultClawback

{% source-link path="src/libxrpl/tx/transactors/vault/VaultClawback.cpp" /%}

Performs a [Clawback](../../../../use-cases/tokenization/stablecoin-issuer#clawback) from the vault, exchanging the shares of an account for assets.

Under the hood, the transaction performs a [VaultWithdraw](./vaultwithdraw.md) on behalf of the account from which assets are clawed back, converting its shares into assets and transferring the funds to the asset’s issuing account. Because of this, {% code-page-name /%} must respect any applicable fees or penalties (e.g., unrealized loss).

{% admonition type="warning" name="Warning" %}
Clawbacks cannot be performed on native XRP.
{% /admonition %}

{% amendment-disclaimer name="SingleAssetVault" /%}

## Example {% $frontmatter.seo.title %} JSON

```json
{
  "TransactionType": "VaultClawback",
  "Account": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
  "Fee": "12",
  "Flags": 0,
  "LastLedgerSequence": 7108682,
  "Sequence": 8,
  "VaultID": "77D6234D074E505024D39C04C3F262997B773719AB29ACFA83119E4210328776",
  "Holder": "ruazs5h1qEsqpke88pcqnaseXdm6od2xc",
  "Amount" : "10000"
}
```

## {% $frontmatter.seo.title %} Fields

| Field Name | JSON Type           | [Internal Type][] | Required? | Description |
| :--------- | :------------------ | :---------------- | :-------- | :---------- |
| `VaultID`  | String              | Hash256           | Yes       | The unique identifier of the vault from which assets are withdrawn. |
| `Holder`   | String              | AccountID         | Yes       | The unique identifier of the account from which to claw back the assets. |
| `Amount`   | [Currency Amount][] | Amount            | No        | The asset amount to claw back. When this field is set to `0`, the transaction claws back all funds, up to the total shares the `Holder` owns. If omitted, the asset is chosen based on the account submitting the transaction; _vault owners_ target vault shares while other accounts target vault assets. |

If the requested amount exceeds the vault’s available assets, the transaction claws back only up to the vault's `AssetsAvailable` balance. Otherwise, it retrieves the exact asset amount specified in the transaction.

### Stranded-Share Burn

You can specify `Amount` as either the vault's asset or its shares. Only the asset issuer can claw back the vault asset, however the _vault owner_ can specify the shares to instead burn them. This is intended for winding down a vault when assets are gone, but shares remain outstanding and block [VaultDelete](./vaultdelete.md).

- Only the vault owner can submit a clawback transaction on vault shares, whether or not they're also the asset issuer.
- The vault's `AssetsTotal` and `AssetsAvailable` must both be `0`, and shares must still be outstanding.
- A non-zero `Amount` must equal the holder's entire share balance, or you can specify `0` to claw back everything.

## {% $frontmatter.seo.title %} Flags

There are no flags defined for {% code-page-name /%} transactions.

## Error Cases

Besides errors that can occur for all transactions, {% code-page-name /%} transactions can result in the following [transaction result codes](../../../protocol/transactions/transaction-results/index.md):

| Error Code              | Description |
| :---------------------- | :---------- |
| `tecNO_ENTRY`           | The `Vault` object with the specified `VaultID` does not exist on the ledger. |
| `tecNO_PERMISSION`      | When clawing back the vault's asset:<ul><li>The vault's asset is XRP.</li><li>The `Account` isn't the issuer of the vault's asset.</li><li>The `Account` is also the `Holder`. An issuer can't claw back from itself.</li><li>The asset is an MPT whose issuance doesn't have the **Can Clawback** flag enabled.</li><li>The asset is a trust line token whose issuer doesn't have **Allow Trust Line Clawback** enabled, or has **No Freeze** enabled.</li></ul>When clawing back the vault's shares:<ul><li>The `Account` isn't the vault owner.</li><li>The vault still holds assets, or has no shares outstanding.</li></ul> |
| `tecWRONG_ASSET`        | <li>The asset in the transaction is neither the vault's asset nor its shares.</li><li>`Amount` was omitted and the vault owner is also the issuer of the vault's asset, so the intended asset (vault asset or share) is ambiguous. In this case, explicitly specify the `Amount` field.</li> |
| `tecINSUFFICIENT_FUNDS` | The `MPToken` object for the vault share of the `Holder` account does not exist, or the `MPToken.MPTAmount` is 0. |
| `tecLIMIT_EXCEEDED`     | The vault owner is clawing back shares, but the `Amount` isn't the `Holder`'s entire share balance. Share clawback must burn all of the holder's shares. |
| `tecOBJECT_NOT_FOUND`   | The `mpt_issuance_id` doesn't match the MPT in the vault. |
| `tecPRECISION_LOSS`     | Either the `Holder` has no shares, or the requested amount is too small to convert into a whole share at the vault's `Scale`. |
| `temDISABLED`           | The Single Asset Vault amendment is not enabled.  |
| `temBAD_AMOUNT`         | The `Amount` is negative. |
| `temMALFORMED`          | The transaction was not validly formatted. For example, if the `VaultID` is not provided.  |

## See Also

- [Vault entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
