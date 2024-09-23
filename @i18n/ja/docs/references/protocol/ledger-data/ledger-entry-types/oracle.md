# Oracle

_([PriceOracle Amendment][] {% not-enabled /%} が必要です。)_

[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/protocol/impl/LedgerFormats.cpp#L353-L366 "ソース")

Oracleのレジャーエントリには、単一資産の価格オラクルオブジェクトに関連するデータが格納されています。

{% admonition type="info" name="注記" %}

価格オラクルオブジェクトは、最大10個のトークンペアの情報を格納できます。

{% /admonition %}


## OracleのJSONの例

```json
{
  "LedgerEntryType": "Oracle",
  "Owner": "rNZ9m6AP9K7z3EVg6GhPMx36V4QmZKeWds",
  "Provider": "70726F7669646572",
  "AssetClass": "63757272656E6379",
  "PriceDataSeries": [
    {
      "PriceData": {
        "BaseAsset": "XRP",
        "QuoteAsset": "USD",
        "AssetPrice": 740,
        "Scale": 3,
      }
    },
  ],
  "LastUpdateTime": 1724871860,
  "PreviousTxnID": "C53ECF838647FA5A4C780377025FEC7999AB4182590510CA461444B207AB74A9",
  "PreviousTxnLgrSeq": 3675418
}
```


## Oracleのフィールド

| フィールド          | JSONの型  | 内部の型      | 必須?     | 説明        |
|---------------------|-----------|---------------|-----------|-------------|
| `Owner`             | 文字列    | AccountID     | はい      | オラクルの更新および削除権限を持つXRPLアカウント。このアカウントで[マルチシグ](../../../../tutorials/how-tos/manage-account-settings/set-up-multi-signing)を設定することをお勧めします。 |
| `Provider`          | 文字列    | Blob          | はい      | オラクルプロバイダーを識別する任意の値、例えば、Chainlink、Band、またはDIAなど。このフィールドは、最大256文字のASCII 16進エンコード文字(0x20-0x7E)の文字列です。 |
| `PriceDataSeries`   | 配列      | Array         | はい      | トークンペアの価格情報を表す、最大10個の`PriceData`オブジェクトの配列。`PriceData`オブジェクトが5個を超える場合、2つの所有者準備金が必要です。 |
| `LastUpdateTime`    | 数値      | UInt32        | はい      | Unix時間で表現された、データの最終更新時刻。 |
| `URI`               | 文字列    | Blob          | いいえ    | 任意で指定可能なユニバーサルリソース識別子で、チェーン外の価格データを参照します。このフィールドは256バイトに制限されています。 |
| `AssetClass`        | 文字列    | Blob          | はい      | 「通貨」、「商品」、「指数」などの資産の種類を説明します。このフィールドは、最大16文字のASCII 16進コード文字(0x20-0x7E)の文字列です。 |
| `OwnerNode`         | 文字列    | UInt64        | はい      | ディレクトリが複数のページで構成されている場合、このエントリにリンクしているオラクル所有者のオーナーディレクトリのページを示すヒント。 |
| `PreviousTxnID`     | 文字列    | UInt256       | はい      | このエントリを変更した前回のトランザクションのハッシュ値。 |
| `PreviousTxnLgrSeq` | 文字列    | UInt32        | はい      | このエントリが最後に変更または作成されたレジャーのインデックス。 |


### PriceDataのフィールド

| フィールド          | JSONの型  | 内部の型      | 必須?     | 説明        |
|---------------------|-----------|---------------|-----------|-------------|
| `BaseAsset`         | 文字列    | Currency      | はい      | 取引ペアにおける基軸となる資産。株式シンボル、債券CUSIP、通貨コードなど、有効な識別子であれば何でも使用できます。 |
| `QuoteAsset`        | 文字列    | Currency      | はい      | 取引ペアにおける見積資産。見積資産は、基軸資産の1単位の価格を示します。 |
| `AssetPrice`        | 数値      | UInt64        | いいえ    | `Scale`の精度レベルを適用した後の資産価格。最後の更新トランザクションに`BaseAsset`/`QuoteAsset`のペアが含まれていなかった場合は、含まれません。|
| `Scale`             | 数値      | UInt8         | いいえ    | 資産価格に適用するスケーリング値。例えば、`Scale`が6で元の価格が0.155の場合、スケーリング後の価格は155000となります。有効な範囲は0~10です。最後の更新トランザクションに`BaseAsset`/`QuoteAsset`のペアが含まれていない場合は、含まれません。 |


## Oracleの準備金

Oracleオブジェクトは、1~5個のPriceDataオブジェクトを含む場合は1つの[所有者準備金](../../../../concepts/accounts/reserves.md#基本準備金と所有者準備金)としてカウントされ、6~10個のPriceDataオブジェクトを含む場合は2つとしてカウントされます。

## Oracle IDのフォーマット

OracleオブジェクトのIDは、以下の値を順番に連結した[SHA-512Half][]です。

1. `Oracle`スペースキーy (`0x52`)
2. `Owner`のAccountID.
3. `OracleDocumentID`.

## Currencyの内部フォーマット

`Currency`フィールドタイプには、通貨または資産コードを表す160ビットの任意データが含まれています。データがXRPLの[通貨コード][]の標準フォーマットに一致する場合、APIはそれを"`USD`"などの文字列として表示します。一致しない場合は、40文字の16進数として表示されます。以下のJSONの例は、`912810RR9/USD`の取引ペアを表しています。`BaseAsset`はCUSIPコードの912810RR9を16進数文字列で表したものであり、`QuoteAsset`は標準の通貨コードであるUSDです。

```json
{
  "PriceData" : {
    "BaseAsset" : "3931323831305252390000000000000000000000",
    "QuoteAsset" : "USD",
    "Scale" : 1,
    "SymbolPrice" : 740
  }
}
```

{% raw-partial file="/docs/_snippets/common-links.md" /%}
