---
seo:
    description: Delete a Multi-Purpose Token definition.
labels:
    - MPTs
---
# MPTokenIssuanceDestroy
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/MPTokenIssuanceDestroy.cpp "Source")

Delete a [Multi-purpose Token (MPT)](../../../../concepts/tokens/fungible-tokens/multi-purpose-tokens.md) issuance. Only the issuer can delete an MPT issuance, and only if there are no holders of the MPT.

{% amendment-disclaimer name="MPTokensV1" /%}

## Example MPTokenIssuanceDestroy JSON

```json
{
    "TransactionType": "MPTokenIssuanceDestroy",
    "Fee": "10",
    "MPTokenIssuanceID": "00070C4495F14B0E44F78A264E41713C64B5F89242540EE255534400000000000000"
}
```


{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}

| Field               | JSON Type           | [Internal Type][] | Description        |
|:--------------------|:--------------------|:------------------|:-------------------|
| `MPTokenIssuanceID` | String              | UInt192           | Identifies the `MPTokenIssuance` object to be removed by the transaction. |

## See Also

- [MPTokenIssuance entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
