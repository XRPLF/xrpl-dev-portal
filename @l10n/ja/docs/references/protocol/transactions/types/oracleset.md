---
seo:
    description: 価格オラクルを作成または更新します。
labels:
  - オラクル
---
# OracleSet
_([PriceOracle Amendment][])_

[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/SetOracle.cpp "ソース")

Oracle Document ID を使用して、新しい`Oracle`レジャーエントリを作成するか、既存のフィールドを更新します。


## OracleSetのJSONの例

```json
{
  "TransactionType": "OracleSet",
  "Account": "rNZ9m6AP9K7z3EVg6GhPMx36V4QmZKeWds",
  "OracleDocumentID": 34,
  "Provider": "70726F7669646572",
  "LastUpdateTime": 1724871860,
  "AssetClass": "63757272656E6379",
  "PriceDataSeries": [
    {
      "PriceData": {
        "BaseAsset": "XRP",
        "QuoteAsset": "USD",
        "AssetPrice": 740,
        "Scale": 3
      }
    }
  ]
}
```


## OracleSetのフィールド

| フィールド         | JSONの型  | 内部の型      | 必須?  | 説明 |
|--------------------|-----------|---------------|--------|-------------|
| `Account`          | 文字列    | AccountID     | はい   | このアカウントは、`Oracle`オブジェクトの`Owner`フィールドのアカウントと一致する必要があります。 |
| `OracleDocumentID` | Number    | UInt32        | はい   | `Account`の価格オラクルのユニークな識別子。 |
| `Provider`         | 文字列    | Blob          | 可変   | Oracleプロバイダを識別する任意の値、例えばChainlink、Band、またはDIAなど。このフィールドは文字列で、ASCII 16進コード化文字(0x20~0x7E)を最大256文字まで使用できます。このフィールドは、新しい`Oracle`レジャーエントリを作成する際に必須ですが、更新の場合は任意です。 |
| `URI`              | 文字列    | Blob          | いいえ | 任意で指定可能なユニバーサルリソース識別子で、チェーン外の価格データを参照します。このフィールドは256バイトに制限されています。 |
| `LastUpdateTime`   | Number    | UInt32        | はい   | データが最後に更新された時刻を、Unix時間で表します。 |
| `AssetClass`       | 文字列    | Blob          | 可変   | 「通貨」、「商品」、「指数」などの資産の種類を指定します。このフィールドは、最大16文字のASCII 16進コード文字(0x20~0x7E)の文字列です。このフィールドは、新しい`Oracle`レジャーエントリを新規作成する際に必須ですが、更新の場合は任意です。 |
| `PriceDataSeries`  | Array     | Array         | はい   | トークンペアの価格情報を表す、最大10個の`PriceData`オブジェクトの配列。`PriceData`が5個を超える場合は、2つの所有者準備金が必要です。 |


### PriceDataのフィールド

| フィールド          | JSONの型  | 内部の型      | 必須?  | 説明        |
|---------------------|-----------|---------------|--------|-------------|
| `BaseAsset`         | 文字列    | Currency      | はい   | 取引ペアにおける基軸資産。 株式シンボル、債券CUSIP、通貨コードなど、有効な識別子であれば何でも使用できます。 例えば、BTC/USDペアではBTCが基軸資産であり、912810RR9/BTCでは912810RR9が基軸資産です。 |
| `QuoteAsset`        | 文字列    | Currency      | はい   | 取引ペアにおける見積資産。見積資産は、ベース資産の1単位の価格を示します。例えば、BTC/USDペアでは、USDが見積資産です。912810RR9/BTCでは、BTCが見積資産です。 |
| `AssetPrice`        | 数値      | UInt64        | いいえ | `Scale`レベルを適用した後の資産価格。含まれていない場合、対応するPriceDataは削除されます。 |
| `Scale`             | 数値      | UInt8         | いいえ | 資産価格に適用するスケーリング値。例えば、`Scale`が6で元の価格が 0.155 の場合、スケーリング後の価格は155000となります。有効なスケール範囲は0~10です。デフォルト値は0です。 |

`PriceData`は、以下のルールに従って作成または更新されます。

- トランザクション内の新しいトークンペアがオブジェクトに追加されます。
- トランザクション内のトークンペアが、オブジェクト内の対応するトークンペアを上書きします。
- `AssetPrice` フィールドが存在しないトランザクションのトークンペアは、オブジェクト内の対応するトークンペアを削除します。
- オブジェクトのみに存在するトークンペアは、価格が古くなっていることを示すために、`AssetPrice`と`Scale`が削除されます。

{% admonition type="info" name="注記" %}
トランザクション内のトークンペアの順序は重要ではありません。なぜなら、各トークンペアは`PriceDataSeries`内の`PriceData`オブジェクトの場所を一意に識別するからです。
{% /admonition %}


## エラーケース

すべてのトランザクションで発生しうるエラーの他に、`OracleSet`トランザクションでは以下のトランザクション結果コードが発生する可能性があります。

| エラーコード              | 説明 |
|---------------------------|-------------|
| `temARRAY_EMPTY`          | `PriceDataSeries`に`PriceData`オブジェクトがありません。 |
| `tecARRAY_TOO_LARGE`      | `PriceDataSeries`が10個の`PriceData`オブジェクトの制限を超えています。 |
| `tecINVALID_UPDATE_TIME`  | `Oracle`オブジェクトに有効な`LastUpdateTime`値がありません。 |
| `tecTOKEN_PAIR_NOT_FOUND` | 削除しようとしているトークンペアが`Oracle`オブジェクトに存在しません。 |
| `tecARRAY_EMPTY`          | `PriceDataSeries`に`PriceData`オブジェクトがありません。 |
| `temARRAY_TOO_LARGE`      | `PriceDataSeries`が10個の`PriceData`オブジェクトの制限を超えています。 |

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
