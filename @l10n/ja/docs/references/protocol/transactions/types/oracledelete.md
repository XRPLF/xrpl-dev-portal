---
seo:
    description: 既存の価格オラクルを削除します。
labels:
  - オラクル
---
# OracleDelete
_([PriceOracle Amendment][])_

[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/DeleteOracle.cpp "ソース")

既存の`Oracle`レジャーエントリを削除します。


## OracleDeleteのJSONの例

```json
{
  "TransactionType": "OracleDelete",
  "Account": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
  "OracleDocumentID": 34
}
```


## OracleDeleteのフィールド

| フィールド         | JSONの型  | 内部の型      | 必須?     | 説明 |
|--------------------|-----------|---------------|-----------|-------------|
| `Account`          | 文字列    | AccountID     | はい      | このアカウントは、`Oracle`オブジェクトの`Owner`フィールドのアカウントと一致する必要があります。 |
| `OracleDocumentID` | 文字列    | UInt32        | はい      | `Account`の価格オラクルの一意の識別子。 |


## エラーのケース

すべてのトランザクションで発生するエラーに加えて、`OracleDelete`トランザクションでは次のトランザクション結果コードが発生する可能性があります。

| エラーコード  | 説明        |
|---------------|-------------|
| `tecNO_ENTRY` | `Oracle`オブジェクトが存在しません。 |

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
