---
seo:
    description: Delete a Multi-Purpose Token definition.
labels:
 - Multi-purpose Tokens, MPTs
status: not_enabled
---
# MPTokenIssuanceDestroy
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/MPTokenIssuanceDestroy.cpp "Source")

The `MPTokenIssuanceDestroy` transaction is used to remove an `MPTokenIssuance` object from the directory node in which it is being held, effectively removing the token from the ledger ("destroying" it).

If this operation succeeds, the corresponding `MPTokenIssuance` is removed and the owner’s reserve requirement is reduced by one. This operation must fail if there are any holders of the MPT in question.

{% amendment-disclaimer name="MPTokensV1" /%}

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

## See Also

- [MPTokenIssuance entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
