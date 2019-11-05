# SetRegularKey

[[ソース]<br>](https://github.com/ripple/rippled/blob/4239880acb5e559446d2067f00dabb31cf102a23/src/ripple/app/transactors/SetRegularKey.cpp "Source")

`SetRegularKey`トランザクションは、アカウントに関連付けられているレギュラーキーペアの割り当て、変更、削除を行います。

アカウントを保護するには、レギュラーキーペアをアカウントに割り当て、トランザクションに署名するときに、可能な場合には常にマスターキーペアの代わりにレギュラーキーペアを使用します。レギュラーキーペアが漏えいしても、マスターキーペアが漏えいしていない場合は、`SetRegularKey`トランザクションを使用してアカウントの制御を取り戻すことができます。

## {{currentpage.name}} JSONの例

```json
{
   "Flags": 0,
   "TransactionType": "SetRegularKey",
   "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
   "Fee": "12",
   "RegularKey": "rAR8rR8sUkBoCZFawhkWzY4Y5YoyuznwD"
}
```

{% include '_snippets/tx-fields-intro.md' %}
<!--{# fix md highlighting_ #}-->

| フィールド        | JSONの型 | [内部の型][] | 説明                   |
|:-------------|:----------|:------------------|:------------------------------|
| `RegularKey` | 文字列    | AccountID         | _（省略可）_ アカウントに割り当てるレギュラーキーペアを示すbase-58エンコード[アドレス][]。省略されている場合は、アカウントから既存のレギュラーキーペアが削除されます。 |

## 関連項目

レギュラーキーペアとマスターキーペアの詳細については、[暗号鍵](cryptographic-keys.html)を参照してください。

アカウントへのレギュラーキーペアの割り当てについてのチュートリアルは、[レギュラーキーペアの操作](assign-a-regular-key-pair.html)を参照してください。

セキュリティを強化するために[マルチ署名](multi-signing.html)を使用できますが、マルチ署名を使用する場合には[トランザクションコスト][]および[準備金](reserves.html)に追加のXRPが必要となります。

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
