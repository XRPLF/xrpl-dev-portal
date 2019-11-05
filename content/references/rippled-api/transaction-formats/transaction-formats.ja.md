# トランザクションのフォーマット

 _トランザクション_ は、XRP Ledgerを変更する唯一の方法です。[コンセンサスプロセス](consensus.html)に従って署名され、送信され、検証済みのレジャーバージョンに承認された場合にのみ、トランザクションは最終的なものになります。レジャーのルールによっては、 _[疑似トランザクション](pseudo-transaction-types.html)_ も生成されます。このトランザクションは署名も送信もされませんが、コンセンサスによって承認されなければならないことは同様です。失敗したトランザクションも、スパム対策の[トランザクションコスト][]を支払うためにXRPの残高が変更されることから、レジャーに含まれます。


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
