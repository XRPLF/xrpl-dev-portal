---
html: setregularkey.html
parent: transaction-types.html
seo:
    description: アカウントに関連付けられているレギュラーキーペアの割り当て、変更、削除を行います。
labels:
  - セキュリティ
---
# SetRegularKey

[[ソース]](https://github.com/XRPLF/rippled/blob/4239880acb5e559446d2067f00dabb31cf102a23/src/ripple/app/transactors/SetRegularKey.cpp "Source")

`SetRegularKey`トランザクションは、アカウントに関連付けられているレギュラーキーペアの割り当て、変更、削除を行います。

アカウントを保護するには、レギュラーキーペアをアカウントに割り当て、トランザクションに署名するときに、可能な場合には常にマスターキーペアの代わりにレギュラーキーペアを使用します。レギュラーキーペアが漏えいしても、マスターキーペアが漏えいしていない場合は、`SetRegularKey`トランザクションを使用してアカウントの制御を取り戻すことができます。

## {% $frontmatter.seo.title %} JSONの例

```json
{
    "Flags": 0,
    "TransactionType": "SetRegularKey",
    "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "Fee": "12",
    "RegularKey": "rAR8rR8sUkBoCZFawhkWzY4Y5YoyuznwD"
}
```

{% raw-partial file="/@i18n/ja/docs/_snippets/tx-fields-intro.md" /%}
<!--{# fix md highlighting_ #}-->

| フィールド    | JSONの型  | [内部の型][]       | 説明                          |
|:-------------|:----------|:------------------|:------------------------------|
| `RegularKey` | 文字列 | AccountID | _（省略可）_ アカウントに割り当てるレギュラーキーペアを示すbase-58エンコード[アドレス][]。省略されている場合は、アカウントから既存のレギュラーキーペアが削除されます。アドレスのマスターキーペアと一致してはなりません。 |

## 関連項目

レギュラーキーペアとマスターキーペアの詳細は、[暗号鍵](../../../../concepts/accounts/cryptographic-keys.md)をご覧ください。

アカウントへのレギュラーキーペアの割り当てについてのチュートリアルは、[レギュラーキーペアの操作](../../../../tutorials/how-tos/manage-account-settings/assign-a-regular-key-pair.md)をご覧ください。

セキュリティを強化するために[マルチシグ](../../../../concepts/accounts/multi-signing.md)を使用できますが、マルチシグを使用する場合には[トランザクションコスト][]および[準備金](../../../../concepts/accounts/reserves.md)に追加のXRPが必要となります。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
