---
blurb: Remove a Multi-purpose Token from the ledger.
labels:
 - Multi-purpose Tokens, MPTs
---
# MPTokenIssuanceDestroy
[[Source]](https://github.com/XRPLF/rippled/blob/1e01cd34f7a216092ed779f291b43324c167167a/src/xrpld/app/tx/detail/MPTokenIssuanceDestroy.cpp "Source")

The `MPTokenIssuanceDestroy` transaction is used to remove an `MPTokenIssuance` object from the directory node in which it is being held, effectively removing the token from the ledger ("destroying" it).

If this operation succeeds, the corresponding `MPTokenIssuance` is removed and the owner’s reserve requirement is reduced by one. This operation must fail if there are any holders of the MPT in question.

_(Requires the [MPTokensV1 amendment][] {% not-enabled /%}.)_

## Example MPTokenIssuanceDestroy JSON

```json 
{
    "TransactionType": "MPTokenIssuanceDestroy",
    "Fee": "10",
    "MPTokenIssuanceID": "00070C4495F14B0E44F78A264E41713C64B5F89242540EE255534400000000000000"
}
```

<!-- ## MPTokenIssuanceDestroy Fields -->

{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}

| Field               | JSON Type           | [Internal Type][] | Description        |
|:--------------------|:--------------------|:------------------|:-------------------|
| `MPTokenIssuanceID` | String              | UInt192           | Identifies the `MPTokenIssuance` object to be removed by the transaction. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
