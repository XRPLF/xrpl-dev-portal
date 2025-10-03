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

## Example

```json 
{
    "TransactionType": "MPTokenIssuanceSet",
    "Fee": "10",
    "MPTokenIssuanceID": "00070C4495F14B0E44F78A264E41713C64B5F89242540EE255534400000000000000",
    "Flags": 1
}
```

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
