---
seo:
    description: Permanently destroy an NFT.
labels:
    - Non-fungible Tokens, NFTs
---
# NFTokenBurn
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/NFTokenBurn.cpp "Source")

Burn (destroy) a [non-fungible token (NFT)](../../../../concepts/tokens/nfts/index.md). The NFT's current holder can always burn it, and if the token's **Burnable** flag is enabled, the issuer and their authorized minter (if they have one) can also burn the NFT.

If the transaction succeeds, it removes the corresponding [NFToken][] object from the [NFTokenPage entry][] that was storing it. This can cause the pages of an NFT directory to be consolidated.

{% amendment-disclaimer name="NonFungibleTokensV1_1" /%}


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

{% tx-example txid="7B9EFDFDC801C58F2B61B89AA2751634F49CE2A93923671FF0F4F099C7EE17FF" /%}

{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}

| Field             | JSON Type | [Internal Type][] | Description              |
|:------------------|:----------|:------------------|:-------------------------|
| `NFTokenID`       | String    | UInt256           | The `NFToken` to be removed by this transaction. |
| `Owner`           | String    | AccountID         | _(Optional)_ The owner of the `NFToken` to burn. Only used if that owner is different than the account sending this transaction. The issuer or authorized minter can use this field to burn NFTs that have the `lsfBurnable` flag enabled. |


## Error Cases

Besides errors that can occur for all transactions, {% $frontmatter.seo.title %} transactions can result in the following [transaction result codes](../transaction-results/index.md):

| Error Code         | Description                                             |
|:-------------------|:--------------------------------------------------------|
| `temDISABLED`      | The [NonFungibleTokensV1 amendment][] is not enabled. |
| `tecNO_ENTRY`      | The specified `TokenID` was not found.                  |
| `tecNO_PERMISSION` | The account does not have permission to burn the token. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
