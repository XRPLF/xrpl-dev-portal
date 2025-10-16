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
| `MPTokenIssuanceID` | String - Hexadecimal | UInt192           | Yes       | The identifier of the `MPTokenIssuance` to update. |
| `Holder`            | String - [Address][] | AccountID         | No        | An individual token holder. If provided, apply changes to the given holder's balance of the given MPT issuance. If omitted, apply to all accounts holding the given MPT issuance. |

### MPTokenIssuanceSet Flags

Transactions of the `MPTokenIssuanceSet` type support additional values in the `Flags` field, as follows:

| Flag Name          | Hex Value    | Decimal Value | Description                   |
|:-------------------|:-------------|:--------------|:------------------------------|
| `tfMPTLock`        | `0x00000001` | 1             | Enable to lock balances of this MPT issuance. |
| `tfMPTUnlock`      | `0x00000002` | 2             | Enable to unlock balances of this MPT issuance. |

## See Also

- [MPTokenIssuance entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
