---
html: ledger-data-formats.html
parent: protocol-reference.html
seo:
    description: XRP Ledgerの共有状態を構成する個別のデータオブジェクトについて説明します。
metadata:
  indexPage: true
---
# レジャーのデータ型

XRP Ledgerに各レジャーバージョンは3つの要素で構成されています：

* **[レジャーヘッダー](ledger-header.md)**： このレジャーに関してメタデータです。
* **[トランザクションセット](../transactions/index.md)**： このレジャーの作成時に、直前のレジャーに適用されたトランザクション。
* **[状態データ](ledger-entry-types/index.md)**： このバージョンのレジャーの設定、残高、オブジェクトを含むすべてのレジャーオブジェクト。


## 状態データ

{% partial file="/@i18n/ja/docs/_snippets/ledger-objects-intro.md" /%}

{% child-pages /%}
