---
seo:
    description: Multi-Purpose Tokenを削除します。
labels:
 - Multi-Purpose Token, MPT
---
# MPTokenIssuanceDestroy
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/MPTokenIssuanceDestroy.cpp "ソース")

{% partial file="/@l10n/ja/docs/_snippets/mpts-disclaimer.md" /%}

`MPTokenIssuanceDestroy`トランザクションは、`MPTokenIssuance`オブジェクトをそれが保持されているディレクトリノードから削除するために使用され、実質的にレジャーからトークンを削除(「破棄」)します。

この操作が成功すると、対応する`MPTokenIssuance`が削除され、所有者の準備金要件が1つ減少します。対象のMPTの保有者が存在する場合、この操作は失敗しなければなりません。

## MPTokenIssuanceDestroyのJSONの例

```json 
{
    "TransactionType": "MPTokenIssuanceDestroy",
    "Fee": "10",
    "MPTokenIssuanceID": "00070C4495F14B0E44F78A264E41713C64B5F89242540EE255534400000000000000"
}
```

<!-- ## MPTokenIssuanceDestroyのフィールド -->

{% raw-partial file="/@l10n/ja/docs/_snippets/tx-fields-intro.md" /%}

| フィールド          | JSONの型            | [内部の型][] | 説明              |
|:--------------------|:--------------------|:-------------|:------------------|
| `TransactionType`   | 文字列              | UInt16       | 新しいトランザクションタイプMPTokenIssuanceDestroyを示します。 |
| `MPTokenIssuanceID` | 文字列              | UInt192      | トランザクションによって削除される`MPTokenIssuance`オブジェクトの識別子。 |

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
