# tes Success

`tesSUCCESS`コードは、トランザクションが成功したことを示す唯一のコードです。このコードは、必ずしも処理が期待どおりに終了したことを示すものではありません。（たとえば[OfferCancel][]は、キャンセルするオファーがない場合でも「正常に終了」できます。）`tesSUCCESS`の結果には数値0が使用されます。

| コード       | 説明                                                     |
|:-----------|:----------------------------------------------------------------|
| `tesSUCCESS` | トランザクションが適用され、他のサーバーに転送されました。検証済みレジャーにこのコードが記録されている場合は、トランザクションの成功が最終的な結果となります。 |

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
