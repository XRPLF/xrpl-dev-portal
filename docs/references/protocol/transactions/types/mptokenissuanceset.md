---
html: mptokenissuanceset.html
parent: transaction-types.html
blurb: Set mutable properties for an MPT.
labels:
 - Multi-purpose Tokens, MPTs
---
# MPTokenIssuanceSet
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/MPTokenIssuanceSet.cpp "Source")

_(Requires the [MPTokensV1 amendment][] {% not-enabled /%})_

Use this transaction to update a mutable property for a Multi-purpose Token.

## Example

```json 
{
      "TransactionType": "MPTokenIssuanceSet",
      "Fee": "10",
      "MPTokenIssuanceID": "00070C4495F14B0E44F78A264E41713C64B5F89242540EE255534400000000000000",
      "Flags": 1
}
```

<!-- ## MPTokenIssuanceSet Fields -->

{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}

| Field              | JSON Type           | [Internal Type][] | Description        |
|:-------------------|:--------------------|:------------------|:-------------------|
| `TransactionType`  | string              | UInt16            | Indicates the new transaction type `MPTokenIssuanceSet`. |
| `MPTokenIssuanceID`| string              | UInt192           | The `MPTokenIssuance` identifier. |
| `Holder`    | string              | AccountID         | (Optional) XRPL Address of an individual token holder balance to lock/unlock. If omitted, this transaction applies to all any accounts holding MPTs. |
| `Flag`             | number               | UInt64           | Specifies flags for this transaction. See [MPTokenIssuanceSet Flags](#mptokenissuanceset-flags). |

### MPTokenIssuanceSet Flags

Transactions of the `MPTokenIssuanceSet` type support additional values in the `Flags` field, as follows:

| Flag Name          | Hex Value    | Decimal Value | Description                   |
|:-------------------|:-------------|:--------------|:------------------------------|
| `tfMPTLock`        | `0x00000001`     | 1             | If set, indicates that all MPT balances for this asset should be locked. |
| `tfMPTUnlock`      | `0x00000002`     | 2             | If set, indicates that all MPT balances for this asset should be unlocked. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
