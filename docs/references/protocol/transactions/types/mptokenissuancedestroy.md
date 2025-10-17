---
seo:
    description: Delete a Multi-Purpose Token definition.
labels:
    - Multi-purpose Tokens, MPTs
---
# MPTokenIssuanceDestroy
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/MPTokenIssuanceDestroy.cpp "Source")

Delete a [Multi-purpose Token (MPT)](../../../../concepts/tokens/fungible-tokens/multi-purpose-tokens.md) issuance. Only the issuer can delete an MPT issuance, and only if there are no holders of the MPT.

{% amendment-disclaimer name="MPTokensV1" /%}

## Example MPTokenIssuanceDestroy JSON

```json
{
    "TransactionType": "MPTokenIssuanceDestroy",
    "Account": "rNFta7UKwcoiCpxEYbhH2v92numE3cceB6",
    "MPTokenIssuanceID": "05EECEBC97A7D635DE2393068691A015FED5A89AD203F5AA",
    "Fee": "10",
    "Flags": 0,
    "Sequence": 99536573
}
```

{% tx-example txid="B270DEE7D229D626699935B7B3CC37A1BAD3E832044CE5129722C2965D3EB228" /%}

{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}

| Field               | JSON Type           | [Internal Type][] | Description        |
|:--------------------|:--------------------|:------------------|:-------------------|
| `MPTokenIssuanceID` | String              | UInt192           | Identifies the `MPTokenIssuance` object to be removed by the transaction. |

## See Also

- [MPTokenIssuance entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
