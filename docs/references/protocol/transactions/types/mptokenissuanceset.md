---
seo:
    description: Set mutable properties of a Multi-Purpose Token definition.
labels:
    - Multi-purpose Tokens, MPTs
---
# MPTokenIssuanceSet
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/MPTokenIssuanceSet.cpp "Source")

Update a mutable property of a [Multi-purpose Token (MPT)](../../../../concepts/tokens/fungible-tokens/multi-purpose-tokens.md) issuance, including locking (freezing) or unlocking the tokens globally or for an individual holder.

{% amendment-disclaimer name="MPTokensV1" /%}

## Example MPTokenIssuanceSet JSON

This example locks the balances of all holders of the specified MPT issuance.

```json
{
    "TransactionType": "MPTokenIssuanceSet",
    "Account": "rNFta7UKwcoiCpxEYbhH2v92numE3cceB6",
    "MPTokenIssuanceID": "05EECEBE97A7D635DE2393068691A015FED5A89AD203F5AA",
    "Fee": "10",
    "Flags": 1,
    "Sequence": 99536577
}
```

{% tx-example txid="5DB41F975E3AC04DD4AE9E93764AFBBABB0E4C7322B2D6F2E84B253FAA170BF3" /%}

{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}

| Field               | JSON Type            | [Internal Type][] | Required? | Description |
|:--------------------|:---------------------|:------------------|:----------|-------------|
| `DomainID`          | String - [Hash][]    | UInt256           | No        | The ledger entry ID of a permissioned domain that grants access to the MPT. An empy value or `0` will remove permissioned domain access management. Any accounts that lose access to the MPT because of `DomainID` updates--unless explicitly authorized by the MPT issuer--lose the ability to send or receive MPTs they already hold. The `tfMPTRequireAuth` flag must have been set in the `MPTokenIssuanceCreate` transaction to use permissioned domains.<br>{% amendment-disclaimer name="PermissionedDomains" /%}<br>{% amendment-disclaimer name="SingleAssetVault" /%} |
| `MPTokenIssuanceID` | String - Hexadecimal | UInt192           | Yes       | The identifier of the `MPTokenIssuance` to update. |
| `Holder`            | String - [Address][] | AccountID         | No        | An individual token holder. If provided, apply changes to the given holder's balance of the given MPT issuance. If omitted, apply to all accounts holding the given MPT issuance. |

### MPTokenIssuanceSet Flags

Transactions of the `MPTokenIssuanceSet` type support additional values in the `Flags` field, as follows:

| Flag Name          | Hex Value    | Decimal Value | Description                   |
|:-------------------|:-------------|:--------------|:------------------------------|
| `tfMPTLock`        | `0x00000001` | 1             | Enable to lock balances of this MPT issuance. |
| `tfMPTUnlock`      | `0x00000002` | 2             | Enable to unlock balances of this MPT issuance. |


## Error Cases

Besides errors that can occur for all transactions, {% $frontmatter.seo.title %} transactions can result in the following [transaction result codes](../transaction-results/index.md):

| Error Code                | Description |
|:--------------------------|:------------|
| `temDISABLED`             | The `MPTokensV1` amendment is disabled. You will also receive this error if you include a `DomainID` field in the transaction, but the `PermissionedDomains` and `SingleAssetVault` amendments are both disabled. |
| `tecNO_DST`               | The account specified in the `Holder` field doesn't exist. |
| `tecNO_PERMISSION`        | - The `lsfMPTCanLock` flag isn't enabled, but you are attempting to lock or unlock an MPT.<br>- The `SingleAssetVault` amendment is disabled and you're trying to modify a `DomainID` field. | 
| `temMALFORMED`            | - You specified a `DomainID` and `Holder` value--only one can be set in a single transaction.<br>- You specified the same account for both `Acount` and `Holder`.<br>- The transaction isn't changing anything; it must either update a flag or modify the `DomainID`. |
| `tecOBJECT_NOT_FOUND`    | The specified `MPToken`, `MPTokenIssuance`, or `PermissionedDomain` ledger entry doesn't exist. |


## See Also

- [MPTokenIssuance entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
