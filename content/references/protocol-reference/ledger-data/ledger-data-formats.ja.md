---
html: ledger-data-formats.html
parent: protocol-reference.html
blurb: XRP Ledgerの共有状態を構成する個別のデータオブジェクトについて説明します。
---
# レジャーのデータ型

XRP Ledgerに各レジャーバージョンは3つの要素で構成されています：

* **[レジャーヘッダー](ledger-header.html)**： このレジャーに関してメタデータです。
* **[トランザクションセット](transaction-formats.html)**： このレジャーの作成時に、直前のレジャーに適用されたトランザクション。
* **[状態データ](ledger-object-types.html)**： このバージョンのレジャーの設定、残高、オブジェクトを含むすべてのレジャーオブジェクト。


## 状態データ

{% include '_snippets/ledger-objects-intro.ja.md' %}

{% from '_snippets/macros/page-children.md' import page_children with context %}
{{ page_children(pages|selectattr("html", "eq", "ledger-object-types.html")|first, 1, 1, True) }}
