---
html: ledger-data-formats.html
parent: protocol-reference.html
blurb: XRP Ledgerの共有状態を構成する個別のデータオブジェクトについて説明します。
---
# レジャーのデータ型

XRP Ledgerに各レジャーバージョンは3つの要素で構成されています：

* **[レジャーヘッダー](ledger-header.md)**： このレジャーに関してメタデータです。
* **[トランザクションセット](../transactions/index.md)**： このレジャーの作成時に、直前のレジャーに適用されたトランザクション。
* **[状態データ](ledger-entry-types/index.md)**： このバージョンのレジャーの設定、残高、オブジェクトを含むすべてのレジャーオブジェクト。


## 状態データ

{% partial file="/_snippets/ledger-objects-intro.md" /%}

{% from '_snippets/macros/page-children.md' import page_children with context %}
{{ page_children(pages|selectattr("html", "eq", "ledger-object-types.html")|first, 1, 1, True) }}
