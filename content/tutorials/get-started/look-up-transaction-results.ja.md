# トランザクションの結果の確認

トランザクションの最終結果を確認するには、[txメソッド][]または[account_txメソッド][]を使用するか、`rippled`の他の応答を使用します。コンセンサスにより検証されたレジャーバージョンがこの応答に使用されていることを示す`"validated": true`を検索します。

| フィールド                  | 値   | 説明                               |
|:-----------------------|:--------|:------------------------------------------|
| meta.TransactionResult | 文字列  | 結果を以下のように分類するコード（`tecPATH_DRY`など） |
| validated              | ブール値 | この結果が検証済みレジャーの結果であるかどうか。`false`の場合、結果は暫定的です。`true`の場合、結果は最終結果です。 |

```json
   "hash": "E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7",
   "meta": {
     ...
     "TransactionResult": "tesSUCCESS"
   },
   "validated": true
```

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
