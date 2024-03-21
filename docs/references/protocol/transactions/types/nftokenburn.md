---
html: nftokenburn.html
parent: transaction-types.html
seo:
    description: Use TokenBurn to permanently destroy NFTs.
labels:
  - Non-fungible Tokens, NFTs
---
# NFTokenBurn
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/app/tx/impl/NFTokenBurn.cpp "Source")

The `NFTokenBurn` transaction is used to remove a `NFToken` object from the `NFTokenPage` in which it is being held, effectively removing the token from the ledger (_burning_ it).

The sender of this transaction must be the owner of the `NFToken` to burn; or, if the `NFToken` has the `lsfBurnable` flag enabled, can be the issuer or the issuer's authorized `NFTokenMinter` account instead.

If this operation succeeds, the corresponding `NFToken` is removed. If this operation empties the `NFTokenPage` holding the `NFToken` or results in consolidation, thus removing a `NFTokenPage`, the owner’s reserve requirement is reduced by one.

_(Added by the [NonFungibleTokensV1_1 amendment][].)_


## Example {% $frontmatter.seo.title %} JSON

```json
{
  "TransactionType": "NFTokenBurn",
  "Account": "rNCFjv8Ek5oDrNiMJ3pw6eLLFtMjZLJnf2",
  "Owner": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
  "Fee": "10",
  "NFTokenID": "000B013A95F14B0044F78A264E41713C64B5F89242540EE208C3098E00000D65"
}
```

[Query example transaction. >](/resources/dev-tools/websocket-api-tool?server=wss%3A%2F%2Fs1.ripple.com%2F&req=%7B%22id%22%3A%22example_NFTokenBurn%22%2C%22command%22%3A%22tx%22%2C%22transaction%22%3A%227B9EFDFDC801C58F2B61B89AA2751634F49CE2A93923671FF0F4F099C7EE17FF%22%2C%22binary%22%3Afalse%7D)

{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}

| Field             | JSON Type | [Internal Type][] | Description              |
|:------------------|:----------|:------------------|:-------------------------|
| `NFTokenID`       | String    | Hash256           | The `NFToken` to be removed by this transaction. |
| `Owner`           | String    | AccountID         | _(Optional)_ The owner of the `NFToken` to burn. Only used if that owner is different than the account sending this transaction. The issuer or authorized minter can use this field to burn NFTs that have the `lsfBurnable` flag enabled. |


## Error Cases

Besides errors that can occur for all transactions, {% $frontmatter.seo.title %} transactions can result in the following [transaction result codes](../transaction-results/index.md):

| Error Code         | Description                                             |
|:-------------------|:--------------------------------------------------------|
| `temDISABLED`      | The [NonFungibleTokensV1 amendment][] is not enabled. |
| `tecNO_ENTRY`      | The specified `TokenID` was not found.                  |
| `tecNO_PERMISSION` | The account does not have permission to burn the token. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
