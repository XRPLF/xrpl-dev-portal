# EnableAmendment

トランザクション処理を変更する[Amendmentプロセス](amendments.html#amendmentプロセス)の進行状況を追跡します。この疑似トランザクションは、提案されたAmendmentが多数の承認を獲得したか否かや、Amendmentの有効化の状況を示します。

**注記:** 疑似トランザクションは送信できませんが、レジャーの処理時に疑似トランザクションが見つかることがあります。

| フィールド          | JSONの型 | [内部の型][] | 説明                 |
|:---------------|:----------|:------------------|:----------------------------|
| Amendment      | 文字列    | Hash256           | Amendmentの一意のID。人間が読み取れる形式の名前ではありません。既知のAmendmentのリストについては、[Amendment](amendments.html)を参照してください。 |
| LedgerSequence | 数値    | UInt32            | Amendmentが含まれているレジャーバージョンのインデックス。これにより、この疑似トランザクションと別途発生する同様の変更が区別されます。 |

## EnableAmendment Flags

EnableAmendment疑似トランザクションの`Flags`の値は、この疑似トランザクションが記録されているレジャーでのAmendmentのステータスを示します。

`Flags`の値が`0`（フラグなし）の場合、Amendmentは有効化されており、これ以降のすべてのレジャーに適用されます。`Flags`のその他の値を以下に示します。

| フラグ名      | 16進値  | 10進値 | 説明                    |
|:---------------|:-----------|:--------------|:-------------------------------|
| tfGotMajority  | 0x00010000 | 65536         | このレジャーバージョン以降、信頼できるバリデータのAmendment支持率は80%以上に増加しました。 |
| tfLostMajority | 0x00020000 | 131072        | このレジャーバージョン以降、信頼できるバリデータのAmendment支持率が80%未満に減少しました。 |

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
