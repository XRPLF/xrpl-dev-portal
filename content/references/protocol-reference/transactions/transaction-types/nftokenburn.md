---
html: nftokenburn.html
parent: transaction-types.html
blurb: Use TokenBurn to permanently destroy NFTs.
labels:
  - Non-fungible Tokens, NFTs
status: not_enabled
---
# NFTokenBurn
{% include '_snippets/nfts-disclaimer.md' %}

The `NFTokenBurn` transaction is used to remove a `NFToken` object from the `NFTokenPage` in which it is being held, effectively removing the token from the ledger (_burning_ it).

The sender of this transaction must be the owner of the `NFToken` to burn; or, if the `NFToken` has the `lsfBurnable` flag enabled, can be the issuer or the issuer's authorized `NFTokenMinter` account instead.

If this operation succeeds, the corresponding `NFToken` is removed. If this operation empties the `NFTokenPage` holding the `NFToken` or results in consolidation, thus removing a `NFTokenPage`, the owner’s reserve requirement is reduced by one.


## Example {{currentpage.name}} JSON

```json
{
  "TransactionType": "NFTokenBurn",
  "Account": "rNCFjv8Ek5oDrNiMJ3pw6eLLFtMjZLJnf2",
  "Owner": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
  "Fee": "10",
  "NFTokenID": "000B013A95F14B0044F78A264E41713C64B5F89242540EE208C3098E00000D65"
}
```

{% include '_snippets/tx-fields-intro.md' %}

| Field             | JSON Type | [Internal Type][] | Description              |
|:------------------|:----------|:------------------|:-------------------------|
| `NFTokenID`       | String    | Hash256           | The `NFToken` to be removed by this transaction. |
| `Owner`           | String    | AccountID         | _(Optional)_ The owner of the `NFToken` to burn. Only used if that owner is different than the account sending this transaction. The issuer or authorized minter can use this field to burn NFTs that have the `lsfBurnable` flag enabled. |


## Error Cases

In addition to errors that can occur for all transactions, {{currentpage.name}} transactions can result in the following [transaction result codes](transaction-results.html):

| Error Code         | Description                                             |
|:-------------------|:--------------------------------------------------------|
| `temDISABLED`      | The [NonFungibleTokensV1 amendment][] is not enabled. |
| `tecNO_ENTRY`      | The specified `TokenID` was not found.                  |
| `tecNO_PERMISSION` | The account does not have permission to burn the token. |

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
