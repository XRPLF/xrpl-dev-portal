---
html: transaction-formats.html
parent: protocol-reference.html
seo:
    description: プロトコルのすべてのトランザクションタイプとその結果を説明します。
metadata:
  indexPage: true
---
# トランザクションリファレンス

 _トランザクション_ は、XRP Ledgerを変更する唯一の方法です。[コンセンサスプロセス](../../../concepts/consensus-protocol/index.md)に従って署名され、送信され、検証済みのレジャーバージョンに承認された場合にのみ、トランザクションは[最終](../../../concepts/transactions/finality-of-results/index.md)的なものになります。レジャーのルールによっては、 _[疑似トランザクション](pseudo-transaction-types/pseudo-transaction-types.md)_ も生成されます。このトランザクションは署名も送信もされませんが、コンセンサスによって承認されなければならないことは同様です。失敗したトランザクションも、スパム対策の[トランザクションコスト][]を支払うためにXRPの残高が変更されることから、レジャーに含まれます。

{% raw-partial file="/docs/_snippets/common-links.md" /%}


{% child-pages /%}
