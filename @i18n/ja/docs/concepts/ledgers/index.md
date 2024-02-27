---
html: ledgers.html
parent: concepts.html
seo:
    description: XRP Ledgerは、rippledによって内部データベースに保持されている一連の個別レジャー(レジャーバージョン)で構成されています。これらのレジャーの構造と内容について説明します。
labels:
  - ブロックチェーン
  - データ保持
---
# レジャー

XRP Ledgerは、誰にでも開かれた共有のグローバル台帳(レジャー)です。個々の参加者は、単一の機関に台帳の管理を任せることなく、台帳の正当性を信頼することができます。XRP Ledgerプロトコルは、非常に特殊なルールに従ってのみ更新可能な台帳データベースを管理することで、これを実現しています。ピアツーピアネットワークのサーバは台帳データベースの完全なコピーを保持し、ネットワークは候補となるトランザクションを配信し、[コンセンサスプロセス](../consensus-protocol/index.md)に従ってブロック単位で適用されます。

[{% inline-svg file="/docs/img/ledger-changes.svg" /%}](/docs/img/ledger-changes.svg "図: 各レジャーは、その前のレジャーバージョンにトランザクションを適用して生成されます")

共有グローバル台帳は、レジャーバージョンまたは単に _レジャー_ と呼ばれる一連のブロックから構成されます。すべてのレジャーバージョンには、台帳の正しい順序を識別する[レジャーインデックス][]があります。永続的にクローズされる各台帳には、固有の識別ハッシュ値も存在します。

各XRP Ledgerサーバは常に、進行中の _オープン_ レジャー、保留中の _閉鎖済み_ レジャー、そして確定済みの _検証済み_ レジャーの履歴を持っており、これらは変更不可(immutable)です。

1つのレジャーバージョンはいくつかの要素から構成されています。

[{% inline-svg file="/docs/img/anatomy-of-a-ledger-simplified.svg" /%}](/docs/img/anatomy-of-a-ledger-simplified.svg "レジャーにはトランザクション、状態ツリー、閉鎖時刻、検証情報を含むヘッダーが含まれています。")

* **ヘッダー** - [レジャーインデックス][]、レジャーのその他のコンテンツのハッシュ、その他のメタデータ。
* **トランザクションツリー** - このレジャーの作成時に、直前のレジャーに適用された[トランザクション](../../references/protocol/transactions/index.md)。トランザクションは、レジャーの変更を可能にする _唯一の_ 手段です。
* **状態ツリー** - このレジャーの設定、残高などを含むすべての[レジャーエントリ](../../references/protocol/ledger-data/ledger-entry-types/index.md)。



## 関連項目

- レジャーヘッダー、レジャーオブジェクトID、レジャーオブジェクトタイプの詳細については、[レジャーのデータ型](../../references/protocol/ledger-data/index.md)をご覧ください。
- レジャーの状態の変更履歴を追跡する方法については、[レジャーの履歴](../networks-and-servers/ledger-history.md)をご覧ください。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
