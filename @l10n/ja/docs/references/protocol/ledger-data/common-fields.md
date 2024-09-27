---
html: ledger-entry-common-fields.html
seo:
    description: これらの共通フィールドは、すべてのレジャーエントリの一部です。
---
# Ledger Entryの共通フィールド
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/protocol/impl/LedgerFormats.cpp)

[レジャー](../../../concepts/ledgers/index.md)の状態データの各エントリは、同じ共通フィールドのセットと、[レジャーエントリのタイプ](ledger-entry-types/index.md)に基づく追加フィールドを持ちます。フィールド名は大文字と小文字を区別します。すべてのレジャーエントリの共通フィールドは以下の通りです。

| `Field`                  | JSONの型 | [内部の型][] | 必須?  | 説明 |
|:-------------------------|:--------|:------------|:------|:------------|
| `index` or `LedgerIndex` | 文字列   | Hash256     | いいえ | このレジャーエントリの一意のID。JSONでは、このフィールドはコンテキストやAPIメソッドによって異なる名前で表現されます。(コード上では"任意(optional)"と指定されていますが、XRP Ledgerの歴史のごく初期からのレガシーデータでない限り、すべてのレジャーエントリは一意であるべきです)。 |
| `LedgerEntryType`        | 文字列   | UInt16      | はい   | レジャーエントリのタイプ。有効な[レジャーエントリのタイプ](ledger-entry-types/index.md)には`AccountRoot`、`Offer`、`RippleState`などがあります。 |
| `Flags`                  | 数値     | UInt32      | はい   | このレジャーエントリのビットフラグのセット。 |

**注意:** JSONでは、レジャーエントリIDは`index`または`LedgerIndex`フィールドになります。これは`ledger_index`フィールドの[レジャーインデックス][]とは異なります。


## Ledger Entry ID

[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/protocol/impl/Indexes.cpp)

各レジャーエントリには一意のIDがあります。IDは、エントリの重要な内容と[名前空間識別子](https://github.com/XRPLF/rippled/blob/master/src/ripple/protocol/LedgerFormats.h)をハッシュすることで得られます。[レジャーエントリのタイプ](ledger-entry-types/index.md)は、使用する名前空間識別子と、ハッシュに含めるコンテンツを決定します。これにより、すべてのIDが一意になります。ハッシュ関数は[SHA-512Half][]です。

一般的に、レジャーエントリのIDはJSONの`index`フィールドとして、オブジェクトの内容と同じレベルで返されます。[トランザクションのメタデータ](../transactions/metadata.md)では、JSONにおけるレジャーオブジェクトのIDは`LedgerIndex`です。

オファーディレクトリには特別なIDがあり、ハッシュの一部がそのディレクトリ内のオファーの取引レートに置き換えられます。

[{% inline-svg file="/docs/img/ledger-object-ids.ja.svg" /%}](/docs/img/ledger-object-ids.ja.svg "図: 異なるタイプのレジャーエントリのID計算。スペースキーは、異なるタイプのIDが衝突するのを防ぎます。")


## フラグ

フラグはオン/オフ設定で、ビットOR演算を使用して1つの数値に結合されるバイナリ値として表されます。レジャーエントリのフラグのビット値は、トランザクションでそれらのフラグを有効または無効にするために使用される値とは異なります。レジャーの状態フラグには、**`lsf`**で始まる名前があります。

フラグフィールドに指定できる値は、レジャーエントリのタイプによって異なります。一部のレジャーエントリのタイプでは、フラグが定義されていません。このような場合、`Flags`フィールドは常に値`0`になります。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
