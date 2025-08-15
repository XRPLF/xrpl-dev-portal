---
seo:
    description: 指定されたOracleインスタンスの集計価格を計算します。
labels:
  - オラクル
---
# get_aggregate_price

_([PriceOracle amendment][])_

[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/GetAggregatePrice.cpp "ソース")


`get_aggregate_price`メソッドは、指定された`Oracle`オブジェクトの集計価格を取得し、平均値、中央値、整形された平均値の3つの価格情報を返します。


## リクエストフォーマット

リクエストの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "command": "get_aggregate_price",
  "ledger_index": "current",
  "base_asset": "XRP",
  "quote_asset": "USD",
  "trim": 20,
  "oracles": [
    {
      "account": "rp047ow9WcPmnNpVHMQV5A4BF6vaL9Abm6",
      "oracle_document_id": 34
    },
    {
      "account": "rp147ow9WcPmnNpVHMQV5A4BF6vaL9Abm7",
      "oracle_document_id": 56
    },
    {
      "account": "rp247ow9WcPmnNpVHMQV5A4BF6vaL9Abm8",
      "oracle_document_id": 2
    },
    {
      "account": "rp347ow9WcPmnNpVHMQV5A4BF6vaL9Abm9",
      "oracle_document_id": 7
    },
    {
      "account": "rp447ow9WcPmnNpVHMQV5A4BF6vaL9Abm0",
      "oracle_document_id": 109
    }
  ]
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
  "method": "get_aggregate_price",
  "params": [
    {
      "ledger_index": "current",
      "base_asset": "XRP",
      "quote_asset": "USD",
      "trim": 20,
      "oracles": [
        {
          "account": "rNZ9m6AP9K7z3EVg6GhPMx36V4QmZKeWds",
          "oracle_document_id": 34
        },
        {
          "account": "rMVKq8zrVsJZQFEiTARyC6WfZznhhLMcNi",
          "oracle_document_id": 100
        },
        {
          "account": "r92kJTnUbUUq15t2BBZYGYxY79RnNc7rLQ",
          "oracle_document_id": 2
        }
      ]
    }
  ]
}
```
{% /tab %}

{% /tabs %}

{% try-it method="get_aggregate_price" server="devnet" /%}

リクエストには以下のパラメータが含まれています:

| フィールド       | 型     | 必須?  | 説明 |
| ---------------- | ------ | ------ | ---- |
| `base_asset`     | 文字列 | はい   | 価格を計算する資産の通貨コード。 |
| `quote_asset`    | 文字列 | はい   | 基軸資産の価格を計算する資産の通貨コード。 |
| `trim`           | 数値   | いいえ | 外れ値を削除する割合。有効な削除範囲は1-25。削除範囲が含まれている場合、APIは整形された平均値の統計情報を返します。 |
| `trim_threshold` | 数値   | いいえ | 古い価格データをフィルタリングする秒単位の時間範囲を定義します。デフォルト値は0で、データをフィルタリングしません。 |
| `oracles`        | 配列   | はい   | Oracleを識別するオブジェクトの配列。Oracleオブジェクトは1から200のOracleの識別子をリストする必要があります。 |

`oracles`配列の各メンバーは、次のフィールドを持つOracleオブジェクトです。

| フィールド           | 型     | 必須？ | 説明                                         |
| -------------------- | ------ | ------ | -------------------------------------------- |
| `account`            | 文字列 | はい   | `Oracle`オブジェクトを制御するXRPLアカウント |
| `oracle_document_id` | 数値   | はい   | `Account`の価格Oracleの一意の識別子          |


## レスポンスフォーマット

レスポンスの例:

```json
{
  "result": {
    "entire_set": {
      "mean": "0.78",
      "size": 3,
      "standard_deviation": "0.03464101615137754"
    },
    "ledger_current_index": 3677185,
    "median": "0.8",
    "time": 1724877762,
    "trimmed_set": {
      "mean": "0.78",
      "size": 3,
      "standard_deviation": "0.03464101615137754"
    },
    "validated": false
  },
  "status": "success",
  "type": "response"
}
```

| フィールド                       | 型            | 説明 |
| -------------------------------- | ------------- | ---- |
| `entire_set`                     | オブジェクト  | 収集されたOracleの価格の統計情報。 |
| `entire_set.mean`                | 文字列 - 数値 | 単純な平均値。 |
| `entire_set.size`                | 数値          | 平均値を計算するデータセットのサイズ。 |
| `entire_set.standard_deviation`  | 文字列 - 数値 | 標準偏差。 |
| `trimmed_set`                    | オブジェクト  | 整形されたOracleの価格の統計情報。`trim`フィールドがリクエストに指定されている場合にのみ表示されます。 |
| `trimmed_set.mean`               | 文字列 - 数値 | 整形されたデータの単純な平均値。 |
| `trimmed_set.size`               | 数値          | 整形された平均値を計算するデータセットのサイズ。 |
| `trimmed_set.standard_deviation` | 文字列 - 数値 | 整形されたデータの標準偏差。 |
| `time`                           | 数値          | すべての`LastUpdateTime`値の中で最も新しいタイムスタンプ。Unix時間で表されます。 |

{% admonition type="info" name="注記" %}

- 指定されたOracleの最新の`Oracle`オブジェクトが取得されます。
- すべてのオブジェクトの中で最も新しい`LastUpdateTime`が上限時間として選択されます。
- `Oracle`オブジェクトは、指定された`base_asset`/`quote_asset`ペアを含み、`AssetPrice`フィールドを持ち、その`LastUpdateTime`が指定された時間範囲内である場合、集計データセットに含まれます。
- `Oracle`オブジェクトが指定されたトークンペアの`AssetPrice`を含まない場合、最大3つの過去の`Oracle`オブジェクトが調査され、要件を満たす最新のものが含まれます。

{% /admonition %}


## 起こりうるエラー

- すべての[汎用エラータイプ][]。
- `invalidParams` - 1つ以上のフィールドが正しく指定されていないか、1つ以上の必須フィールドが欠けています。
- `internal` - `trim_threshold`の設定によりすべての価格が削除された。
- `objectNotFound` - データセットに価格がない。
- `oracleMalformed` - `oracles`配列が不正。少なくとも1つのオブジェクトフィールドが正しく指定されていないか、オブジェクトの数が1から200の範囲外です。
- 

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
