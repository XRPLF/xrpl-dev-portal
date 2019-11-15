# Ripple Data API v2

Ripple Data API v2を使用すると、XRP Ledgerの変更に関する情報（トランザクション履歴や処理済みの分析データなど）にアクセスできます。このような情報は専用データベースに保管されるので、`rippled`サーバーで保持する必要のある履歴レジャーバージョンの数が少なくなります。Data API v2は[XRP Charts](https://xrpcharts.ripple.com/)や[ripple.com](https://www.ripple.com)などのアプリケーションのデータソースとしても機能します。

Rippleは可能な限り完全なトランザクションレコードが含まれているData APIのライブインスタンスを以下のアドレスで公開しています。

[**https://data.ripple.com**](https://data.ripple.com)


## 詳細情報
Ripple Data API v2はHistorical Database v1および[Charts API](https://github.com/ripple/ripple-data-api/)を置き換えます。

* [APIメソッド](#apiメソッドリファレンス)
* [APIの規則](#apiの規則)
* [ソースコード（Github）](https://github.com/ripple/rippled-historical-database)
* [リリースノート](https://github.com/ripple/rippled-historical-database/releases)

[v2.0.4]: https://github.com/ripple/rippled-historical-database/releases/tag/v2.0.4
[v2.0.5]: https://github.com/ripple/rippled-historical-database/releases/tag/v2.0.5
[v2.0.6]: https://github.com/ripple/rippled-historical-database/releases/tag/v2.0.6
[v2.0.7]: https://github.com/ripple/rippled-historical-database/releases/tag/v2.0.7
[v2.0.8]: https://github.com/ripple/rippled-historical-database/releases/tag/v2.0.8
[v2.1.0]: https://github.com/ripple/rippled-historical-database/releases/tag/v2.1.0
[v2.2.0]: https://github.com/ripple/rippled-historical-database/releases/tag/v2.2.0
[v2.3.0]: https://github.com/ripple/rippled-historical-database/releases/tag/v2.3.0
[v2.3.2]: https://github.com/ripple/rippled-historical-database/releases/tag/v2.3.2
[v2.3.5]: https://github.com/ripple/rippled-historical-database/releases/tag/v2.3.5
[v2.3.7]: https://github.com/ripple/rippled-historical-database/releases/tag/v2.3.7
[v2.4.0]: https://github.com/ripple/rippled-historical-database/releases/tag/v2.4.0


# APIメソッドリファレンス

Data API v2は、以下のメソッドを備えたREST APIです。

レジャーコンテンツメソッド:

* [Get Ledger - `GET /v2/ledgers/{ledger_identifier}`](#get-ledger)
* [Get Transaction - `GET /v2/transactions/{hash}`](#get-transaction)
* [Get Transactions - `GET /v2/transactions/`](#get-transactions)
* [Get Payments - `GET /v2/payments/{currency}`](#get-payments)
* [Get Exchanges - `GET /v2/exchanges/{base}/{counter}`](#get-exchanges)
* [Get Exchange Rates - `GET /v2/exchange_rates/{base}/{counter}`](#get-exchange-rates)
* [Normalize - `GET /v2/normalize`](#normalize)
* [Get Daily Reports - `GET /v2/reports/`](#get-daily-reports)
* [Get Stats - `GET /v2/stats/`](#get-stats)
* [Get Active Accounts - `GET /v2/active_accounts/{base}/{counter}`](#get-active-accounts)
* [Get Exchange Volume - `GET /v2/network/exchange_volume`](#get-exchange-volume)
* [Get Payment Volume - `GET /v2/network/payment_volume`](#get-payment-volume)
* [Get External Markets - `GET /v2/network/external_markets`](#get-external-markets)
* [Get XRP Distribution - `GET /v2/network/xrp_distribution`](#get-xrp-distribution)
* [Get Top Currencies - `GET /v2/network/top_currencies`](#get-top-currencies)
* [Get Top Markets - `GET /v2/network/top_markets`](#get-top-markets)

アカウントメソッド:

* [Get Account - `GET /v2/accounts/{address}`](#get-account)
* [Get Accounts - `GET /v2/accounts`](#get-accounts)
* [Get Account Balances - `GET /v2/accounts/{address}/balances`](#get-account-balances)
* [Get Account Orders - `GET /v2/accounts/{address}/orders`](#get-account-orders)
* [Get Account Transaction History - `GET /v2/accounts/{address}/transactions`](#get-account-transaction-history)
* [Get Transaction By Account and Sequence - `GET /v2/accounts/{address}/transactions/{sequence}`](#get-transaction-by-account-and-sequence)
* [Get Account Payments - `GET /v2/accounts/{address}/payments`](#get-account-payments)
* [Get Account Exchanges - `GET /v2/accounts/{address}/exchanges`](#get-account-exchanges)
* [Get Account Balance Changes - `GET /v2/accounts/{address}/balance_changes`](#get-account-balance-changes)
* [Get Account Reports - `GET /v2/accounts/{address}/reports`](#get-account-reports)
* [Get Account Transaction Stats - `GET /v2/accounts/{address}/stats/transactions`](#get-account-transaction-stats)
* [Get Account Value Stats - `GET /v2/accounts/{address}/stats/value`](#get-account-value-stats)

外部情報メソッド:

* [Get All Gateways - `GET /v2/gateways`](#get-all-gateways)
* [Get Gateway - `GET /v2/gateways/{gateway}`](#get-gateway)
* [Get Currency Image - `GET /v2/currencies/{currencyimage}`](#get-currency-image)

検証ネットワークメソッド:

* [Get Transaction Costs - `GET /v2/network/fees`](#get-transaction-costs)
* [Get Fee Stats - `GET /v2/network/fee_stats`](#get-fee-stats)
* [Get Ledger Validations - `GET /v2/ledger/{hash}/validations`](#get-ledger-validations)
* [Get Ledger Validation - `GET /v2/ledger/{hash}/validations/{pubkey}`](#get-ledger-validation)
* [Get Topology - `GET /v2/network/topology`](#get-topology)
* [Get Topology Nodes - `GET /v2/network/topology/nodes`](#get-topology-nodes)
* [Get Topology Node - `GET /v2/network/topology/nodes/{pubkey}`](#get-topology-node)
* [Get Topology Links - `GET /v2/network/topology/links`](#get-topology-links)
* [Get Validator  - `GET /v2/network/validators/{pubkey}`](#get-validator)
* [Get Validators  - `GET /v2/network/validators`](#get-validators)
* [Get Validator Manifests - `GET /v2/network/validators/{pubkey}/manifests`](#get-validator-manifests)
* [Get Single Validator Reports - `GET /v2/network/validators/{pubkey}/reports`](#get-single-validator-reports)
* [Get Daily Validator Reports - `GET /v2/network/validator_reports`](#get-daily-validator-reports)
* [Get `rippled` Versions - `GET /v2/network/rippled_versions`](#get-rippled-versions)

健全性チェック:

* [API Health Check - `GET /v2/health/api`](#health-check-api)
* [Importer Health Check - `GET /v2/health/importer`](#health-check-ledger-importer)
* [Nodes ETL Health Check - `GET /v2/health/nodes_etl`](#health-check-nodes-etl)
* [Validations ETL Health Check - `GET /v2/health/validations_etl`](#health-check-validations-etl)


## Get Ledger
[[ソース]<br>](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/getLedger.js "Source")

ハッシュ、インデックス、または日付を指定して特定のレジャーを取得するか、または最新の検証済みレジャーを取得します。

#### 要求フォーマット

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/ledgers/{identifier}
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](data-api-v2-tool.html#get-ledger)

このメソッドには以下のURLパラメーターを指定する必要があります。

| フィールド               | 値                                               | 説明 |
|:--------------------|:----------------------------------------------------|:--|
| `ledger_identifier` | レジャー[ハッシュ][]、[レジャーインデックス][]、または[タイムスタンプ][] | _（省略可）_ 取得するレジャーのID。16進数のハッシュ全体、整数のシーケンス番号、または日時のいずれかです。日時を指定すると、その指定した日時の時点で最新であった閉鎖済みレジャーが取得されます。省略すると、最新の検証済みレジャーが取得されます。 |

オプションで、以下のクエリーパラメーターを指定できます。

| フィールド          | 値   | 説明                                       |
|:---------------|:--------|:--------------------------------------------------|
| `transactions` | ブール値 | `true`の場合は、このレジャーに含まれるすべてのトランザクションの識別用ハッシュが含まれます。 |
| `binary`       | ブール値 | `true`の場合は、このレジャーのすべてのトランザクションが16進フォーマットのバイナリデータとして含まれます。（このフィールドが指定されている場合、`transactions`をオーバーライドします。） |
| `expand`       | ブール値 | `true`の場合、このレジャーのすべてのトランザクションが入れ子のJSONオブジェクトとして含まれます。（このフィールドが指定されている場合は、`binary`と`transactions`をオーバーライドします。） |

#### 応答フォーマット

成功した場合の応答では、HTTPコード**200 OK**と以下の内容のJSON本文が返されます。

| フィールド    | 値                            | 説明                    |
|:---------|:---------------------------------|:-------------------------------|
| `result` | 文字列                           | 値が`success`の場合は、成功した場合の応答であることを示します。 |
| `ledger` | [レジャーオブジェクト](#レジャーオブジェクト) | 要求されたレジャー。          |

#### 例

要求:

```
GET /v2/ledgers/3170DA37CE2B7F045F889594CBC323D88686D2E90E8FFD2BBCD9BAD12E416DB5
```

応答:

```
200 OK
{
   "result": "success",
   "ledger": {
       "ledger_hash": "3170da37ce2b7f045f889594cbc323d88686d2e90e8ffd2bbcd9bad12e416db5",
       "ledger_index": 8317037,
       "parent_hash": "aff6e04f07f441abc6b4133f8c50c65935b817a85b895f06dba098b3fbc1be90",
       "total_coins": 99999980165594400,
       "close_time_res": 10,
       "accounts_hash": "8ad73e49a34d8b9c31bc13b8a97c56981e45ee70225ef4892e8b198fec5a1f7d",
       "transactions_hash": "33e0b9c5fd7766343e67854aed4222f5ed9c9507e0ec0d7ae7d54d0f17adb98e",
       "close_time": 1408047740,
       "close_time_human": "2014-08-14T20:22:20+00:00"
   }
}
```



## Get Ledger Validations
[[ソース]<br>](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/getLedger.js "Source")

特定のレジャーハッシュについて記録されたすべての検証を取得します。このデータセットには、検証済みレジャーチェーン外部のレジャーバージョンが含まれます。_（新規: [v2.2.0][]）_

**注記:** Data APIは、すべてのバリデーションを網羅する包括的な記録を持っていません。応答には、Data APIに記録されているデータのみが含まれています。一部のレジャーバージョン、特に古いレジャーは、コンセンサスによって検証済みであっても検証が取得できないことがあります。

#### 要求フォーマット

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/ledgers/{ledger_hash}/validations
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](data-api-v2-tool.html#get-ledger-validations)

このメソッドには以下のURLパラメーターを指定する必要があります。

| フィールド         | 値    | 説明                              |
|:--------------|:---------|:-----------------------------------------|
| `ledger_hash` | [ハッシュ][] | 検証を取得するレジャーのハッシュ。 |

オプションで、以下のクエリーパラメーターを指定できます。

| フィールド    | 値   | 説明                                             |
|:---------|:--------|:--------------------------------------------------------|
| `limit`  | 整数 | ページあたりの最大結果件数。デフォルトは200です。1000を超える値は指定できません。 |
| `marker` | 文字列  | 前に返された応答の[ページネーション](#ページネーション)キー。 |
| `format` | 文字列  | 返される結果のフォーマットは`csv`または`json`です。デフォルトは`json`です。 |

#### 応答フォーマット

成功した場合の応答では、HTTPコード**200 OK**と以下の内容のJSON本文が返されます。

| フィールド         | 値                           | 説明                |
|:--------------|:--------------------------------|:---------------------------|
| `result`      | 文字列 - `success`              | 本文が成功した場合の応答を表しています。 |
| `ledger_hash` | 文字列 - [ハッシュ][]               | 要求したレジャーバージョンの識別用ハッシュ。 |
| `count`       | 整数                         | 返された検証の数。 |
| `marker`      | 文字列                          | （省略される場合があります）[ページネーション](#ページネーション)マーカー。 |
| `validations` | [検証オブジェクト][]の配列 | このレジャーバージョンのすべての既知の検証投票。 |


#### 例

要求:

```
GET /v2/ledgers/A10E9E338BA365D2B768814EC8B0A9A2D8322C0040735E20624AF711C5A593E7/validations?limit=2
```

応答:

```
200 OK
{
 "result": "success",
 "ledger_hash": "A10E9E338BA365D2B768814EC8B0A9A2D8322C0040735E20624AF711C5A593E7",
 "count": 2,
 "marker": "A10E9E338BA365D2B768814EC8B0A9A2D8322C0040735E20624AF711C5A593E7|n9KDJnMxfjH5Ez8DeWzWoE9ath3PnsmkUy3GAHiVjE7tn7Q7KhQ2|20160608001732",
 "validations": [
   {
     "count": 27,
     "first_datetime": "2016-06-08T00:17:32.352Z",
     "last_datetime": "2016-06-08T00:17:32.463Z",
     "ledger_hash": "A10E9E338BA365D2B768814EC8B0A9A2D8322C0040735E20624AF711C5A593E7",
     "reporter_public_key": "n9KJb7NMxGySRcjCqh69xEPMUhwJx22qntYYXsnUqYgjsJhNoW7g",
     "signature": "304402204C751D0033070EBC008786F0ECCA8E29195FD7DD8D22498EB6E4E732905FC7090220091F458976904E7AE4633A1EC405175E6A126798E4896DD452853B887B1E6359",
     "validation_public_key": "n949f75evCHwgyP4fPVgaHqNHxUVN15PsJEZ3B3HnXPcPjcZAoy7"
   },
   {
     "count": 3,
     "first_datetime": "2016-06-08T00:17:32.653Z",
     "last_datetime": "2016-06-08T00:17:32.673Z",
     "ledger_hash": "A10E9E338BA365D2B768814EC8B0A9A2D8322C0040735E20624AF711C5A593E7",
     "reporter_public_key": "n9JCK5AML7Ejv3TcJmnvJk5qeYhf7Q9YwScjz5PhtUbtWCKH3NAm",
     "signature": "3045022100A48E5AF6EA9D0ACA6FDE18536081A7D2182535579EA580C3D0B0F18C2556C5D30220521615A3D677376069F8F3E608B59F14482DDE4CD2A304DE578B6CCE2F5E8D54",
     "validation_public_key": "n9K6YbD1y9dWSAG2tbdFwVCtcuvUeNkBwoy9Z6BmeMra9ZxsMTuo"
   }
 ]
}
```



## Get Ledger Validation
[[ソース]<br>](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/getLedger.js "Source")

特定のバリデータの特定のレジャーハッシュについて記録された検証投票を取得します。このデータセットには、検証済みレジャーチェーン外部のレジャーバージョンが含まれます。_（新規: [v2.2.0][]）_

**注記:** Data APIは、すべてのバリデーションを網羅する包括的な記録を持っていません。応答には、Data APIに記録されているデータのみが含まれています。一部のレジャーバージョン、特に古いレジャーは、コンセンサスによって検証済みであっても検証が取得できないことがあります。

#### 要求フォーマット

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/ledgers/{ledger_hash}/validations/{pubkey}
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](data-api-v2-tool.html#get-ledger-validation)

このメソッドには以下のURLパラメーターを指定する必要があります。

| フィールド         | 値                           | 説明                |
|:--------------|:--------------------------------|:---------------------------|
| `ledger_hash` | [ハッシュ][]                        | 検証を取得するレジャーのハッシュ。 |
| `pubkey`      | 文字列 - Base-58 [公開鍵][] | バリデータの公開鍵。      |

この要求はクエリーパラメーターをとりません。

#### 応答フォーマット

成功した場合の応答では、HTTPコード**200 OK**と、以下の追加フィールドを持つ **[検証オブジェクト][]** を含むJSON本文が返されます。

| フィールド    | 値  | 説明                                              |
|:---------|:-------|:---------------------------------------------------------|
| `result` | 文字列 | 値が`success`の場合は、成功した場合の応答であることを示します。 |

#### 例

要求:

```
GET /v2/ledgers/A10E9E338BA365D2B768814EC8B0A9A2D8322C0040735E20624AF711C5A593E7/validations/n949f75evCHwgyP4fPVgaHqNHxUVN15PsJEZ3B3HnXPcPjcZAoy7
```

応答:

```
200 OK
{
 "count": 27,
 "first_datetime": "2016-06-08T00:17:32.352Z",
 "last_datetime": "2016-06-08T00:17:32.463Z",
 "ledger_hash": "A10E9E338BA365D2B768814EC8B0A9A2D8322C0040735E20624AF711C5A593E7",
 "reporter_public_key": "n9KJb7NMxGySRcjCqh69xEPMUhwJx22qntYYXsnUqYgjsJhNoW7g",
 "signature": "304402204C751D0033070EBC008786F0ECCA8E29195FD7DD8D22498EB6E4E732905FC7090220091F458976904E7AE4633A1EC405175E6A126798E4896DD452853B887B1E6359",
 "validation_public_key": "n949f75evCHwgyP4fPVgaHqNHxUVN15PsJEZ3B3HnXPcPjcZAoy7",
 "result": "success"
}
```



## Get Transaction
[[ソース]<br>](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/getTransactions.js "Source")

識別用ハッシュに基づいて特定のトランザクションを取得します。

#### 要求フォーマット

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/transactions/{hash}
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](data-api-v2-tool.html#get-transaction)

このメソッドには以下のURLパラメーターを指定する必要があります。

| フィールド  | 値             | 説明                              |
|:-------|:------------------|:-----------------------------------------|
| `hash` | 文字列 - [ハッシュ][] | トランザクションの識別用ハッシュ。 |

オプションで、以下のクエリーパラメーターを指定できます。

| フィールド    | 値   | 説明                                             |
|:---------|:--------|:--------------------------------------------------------|
| `binary` | ブール値 | `true`の場合、バイナリフォーマットのトランザクションデータを16進文字列として返します。それ以外の場合、トランザクションデータを入れ子のJSONとして返します。デフォルトは`false`です。 |

#### 応答フォーマット

成功した場合の応答では、HTTPコード**200 OK**と以下の内容のJSON本文が返されます。

| フィールド         | 値                  | 説明                         |
|:--------------|:-----------------------|:------------------------------------|
| `result`      | 文字列                 | 値が`success`の場合は、成功した場合の応答であることを示します。 |
| `transaction` | [トランザクションオブジェクト][] | 要求されたトランザクション。          |

[トランザクションオブジェクト]: #トランザクションオブジェクト

#### 例

要求:

```
GET /v2/transactions/03EDF724397D2DEE70E49D512AECD619E9EA536BE6CFD48ED167AE2596055C9A
```

応答（サイズが大きいため一部省略）:

```js
200 OK
{
   "result": "success",
   "transaction": {
       "ledger_index": 8317037,
       "date": "2014-08-14T20:22:20+00:00",
       "hash": "03EDF724397D2DEE70E49D512AECD619E9EA536BE6CFD48ED167AE2596055C9A",
       "tx": {
           "TransactionType": "OfferCreate",
           "Flags": 131072,
           "Sequence": 159244,
           "TakerPays": {
               "value": "0.001567373",
               "currency": "BTC",
               "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
           },
           "TakerGets": "146348921",
           "Fee": "64",
           "SigningPubKey": "02279DDA900BC53575FC5DFA217113A5B21C1ACB2BB2AEFDD60EA478A074E9E264",
           "TxnSignature": "3045022100D81FFECC36A3DEF0922EB5D16F1AA5AA0804C30A18ED3B512093A75E87C81AD602206B221E22A4E3158785C109E7508624AD3DE5C0E06108D34FA709FCC9575C9441",
           "Account": "r2d2iZiCcJmNL6vhUGFjs8U8BuUq6BnmT"
       },
       "meta": {
           "TransactionIndex": 0,
           "AffectedNodes": [
               {
                   "ModifiedNode": {
                       "LedgerEntryType": "AccountRoot",
                       "PreviousTxnLgrSeq": 8317036,
                       "PreviousTxnID": "A56793D47925BED682BFF754806121E3C0281E63C24B62ADF7078EF86CC2AA53",
                       "LedgerIndex": "2880A9B4FB90A306B576C2D532BFE390AB3904642647DCF739492AA244EF46D1",
                       "PreviousFields": {
                           "Balance": "275716601760"
                       },
                       "FinalFields": {
                           "Flags": 0,
                           "Sequence": 326323,
                           "OwnerCount": 27,
                           "Balance": "275862935331",
                           "Account": "rfCFLzNJYvvnoGHWQYACmJpTgkLUaugLEw",
                           "RegularKey": "rfYqosNivHQFJ6KpArouxoci3QE3huKNYe"
                       }
                   }
               },

               ...
           ],
           "TransactionResult": "tesSUCCESS"
       }
   }
}
```





## Get Transactions
[[ソース]<br>](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/getTransactions.js "Source")

時刻に基づいて複数のトランザクションを取得します。

#### 要求フォーマット

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/transactions/
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](data-api-v2-tool.html#get-transactions)

オプションで、以下のクエリーパラメーターを指定できます。

| フィールド        | 値                  | 説明                          |
|:-------------|:-----------------------|:-------------------------------------|
| `start`      | 文字列 - [タイムスタンプ][] | この時刻以降の結果に絞り込みます。 |
| `end`        | 文字列 - [タイムスタンプ][] | この時刻以前の結果に絞り込みます。 |
| `descending` | ブール値                | `true`の場合、結果が逆時系列で返されます。デフォルトは`false`です。 |
| `type`       | 文字列                 | 特定の[トランザクションタイプ](transaction-types.html)にトランザクションを絞り込みます。 |
| `result`     | 文字列                 | 特定の[トランザクション結果](transaction-results.html)でトランザクションを絞り込みます。 |
| `binary`     | ブール値                | `true`の場合、トランザクションをバイナリフォーマットで返します。デフォルトは`false`です。 |
| `limit`      | 整数                | ページあたりの最大結果件数。デフォルトは20です。100を超える値は指定できません。 |
| `marker`     | 文字列                 | 前の応答の[ページネーション](#ページネーション)マーカー。 |

#### 応答フォーマット
成功した場合の応答では、HTTPコード**200 OK**と以下の内容のJSON本文が返されます。

| フィールド          | 値                            | 説明              |
|:---------------|:---------------------------------|:-------------------------|
| `result`       | 文字列                           | 値が`success`の場合は、成功した場合の応答であることを示します。 |
| `count`        | 整数                          | 返されたトランザクションの数。 |
| `marker`       | 文字列                           | （省略される場合があります）ページネーションマーカー。 |
| `transactions` | [トランザクションオブジェクト][]の配列。 | 要求されたトランザクション。 |

[トランザクションオブジェクト]: #トランザクションオブジェクト

#### 例

要求:

```
GET /v2/transactions/?result=tecPATH_DRY&limit=2&type=Payment
```

応答:

```
200 OK
{
 "result": "success",
 "count": 2,
 "marker": "20130106022000|000000053869|00000",
 "transactions": [
   {
     "hash": "B8E4335A94438EC8209135A4E861A4C88F988C651B819DDAF2E8C55F9B41E589",
     "date": "2013-01-02T20:13:40+00:00",
     "ledger_index": 40752,
     "ledger_hash": "55A900C2BA9483DC83F8FC065DE7789570662365BDE98EB75C5F4CE4F9B43214",
     "tx": {
       "TransactionType": "Payment",
       "Flags": 0,
       "Sequence": 61,
       "Amount": {
         "value": "96",
         "currency": "USD",
         "issuer": "rJ6VE6L87yaVmdyxa9jZFXSAdEFSoTGPbE"
       },
       "Fee": "10",
       "SigningPubKey": "02082622E4DA1DC6EA6B38A48956D816881E000ACF0C5F5B52863B9F698799D474",
       "TxnSignature": "304402200A0746192EBC7BC3C1B9D657F42B6345A49D75FE23EF340CB6F0427254C139D00220446BF9169C94AEDC87F56D01DB011866E2A67E2AADDCC45C4D11422550D044CB",
       "Account": "rB5TihdPbKgMrkFqrqUC3yLdE8hhv4BdeY",
       "Destination": "rJ6VE6L87yaVmdyxa9jZFXSAdEFSoTGPbE"
     },
     "meta": {
       "TransactionIndex": 0,
       "AffectedNodes": [
         {
           "ModifiedNode": {
             "LedgerEntryType": "AccountRoot",
             "PreviousTxnLgrSeq": 40212,
             "PreviousTxnID": "F491DC8B5E51045D4420297293199039D5AE1EA0C6D62CAD9A973E3C89E40CD6",
             "LedgerIndex": "9B242A0D59328CE964FFFBFF7D3BBF8B024F9CB1A212923727B42F24ADC93930",
             "PreviousFields": {
               "Sequence": 61,
               "Balance": "8178999999999400"
             },
             "FinalFields": {
               "Flags": 0,
               "Sequence": 62,
               "OwnerCount": 6,
               "Balance": "8178999999999390",
               "Account": "rB5TihdPbKgMrkFqrqUC3yLdE8hhv4BdeY"
             }
           }
         }
       ],
       "TransactionResult": "tecPATH_DRY"
     }
   },
   {
     "hash": "1E1C14BF5E61682F3DC9D035D9908816497B8E8843E05C0EE98E06DFDDDAE920",
     "date": "2013-01-05T08:43:10+00:00",
     "ledger_index": 51819,
     "ledger_hash": "88ED10E4E31FC7580285CF173B264690B0E8688A3FC9F5F9C62F1A295B96269D",
     "tx": {
       "TransactionType": "Payment",
       "Flags": 0,
       "Sequence": 10,
       "Amount": {
         "value": "2",
         "currency": "EUR",
         "issuer": "rfitr7nL7MX85LLKJce7E3ATQjSiyUPDfj"
       },
       "Fee": "10",
       "SigningPubKey": "03FDDCD97668B686100E60653FD1E5210A8310616669AACB3A1FCC6D2C090CCB32",
       "TxnSignature": "304402204F9BB7E37C14A3A3762E2A7DADB9A28D1AFFB3797521229B6FB98BA666B5491B02204F69AAEAFAC8FA473E52042FF06035AB3618A54E0B76C9852766D55184E98598",
       "Account": "rhdAw3LiEfWWmSrbnZG3udsN7PoWKT56Qo",
       "Destination": "rfitr7nL7MX85LLKJce7E3ATQjSiyUPDfj"
     },
     "meta": {
       "TransactionIndex": 0,
       "AffectedNodes": [
         {
           "ModifiedNode": {
             "LedgerEntryType": "AccountRoot",
             "PreviousTxnLgrSeq": 51814,
             "PreviousTxnID": "5EC1C179996BD87E2EB11FE60A37ADD0FB2229ADC7D13B204FAB04FABED8A38D",
             "LedgerIndex": "AC1B67084F84839A3158A4E38618218BF9016047B1EE435AECD4B02226AB2105",
             "PreviousFields": {
               "Sequence": 10,
               "Balance": "10000999910"
             },
             "FinalFields": {
               "Flags": 0,
               "Sequence": 11,
               "OwnerCount": 2,
               "Balance": "10000999900",
               "Account": "rhdAw3LiEfWWmSrbnZG3udsN7PoWKT56Qo"
             }
           }
         }
       ],
       "TransactionResult": "tecPATH_DRY"
     }
   }
 ]
}
```



## Get Payments
[[ソース]<br>](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/getPayments.js "Source")

Paymentを経時的に取得します。Paymentは、トランザクションの送金元が同時に送金先ではない`Payment`タイプのトランザクションと定義されます。_（新規: [v2.0.4][]）_

結果は個別のペイメントとして返されるか、または通貨とイシュアーが指定されている場合には特定の間隔でリストに集約されます。

#### 要求フォーマット

<!-- MULTICODE_BLOCK_START -->

*REST - 全通貨*

```
GET /v2/payments/
```

*REST - 特定の通貨*

```
GET /v2/payments/{currency}
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](data-api-v2-tool.html#get-payments)

このメソッドでは以下のURLパラメーターを使用します。

| フィールド      | 値  | 説明                                            |
|:-----------|:-------|:-------------------------------------------------------|
| `currency` | 文字列 | _（省略可）_ 通貨コード、`+`、相手側アドレスの順。（あるいは`XRP`のみ（相手側なし）。）省略すると、全通貨のペイメントが返されます。 |

オプションで、以下のクエリーパラメーターを指定できます。

| フィールド        | 値                  | 説明                          |
|:-------------|:-----------------------|:-------------------------------------|
| `start`      | 文字列 - [タイムスタンプ][] | この時刻以降の結果に絞り込みます。 |
| `end`        | 文字列 - [タイムスタンプ][] | この時刻以前の結果に絞り込みます。 |
| `descending` | ブール値                | `true`の場合、結果が逆時系列で返されます。デフォルトは`false`です。 |
| `limit`      | 整数                | ページあたりの最大結果件数。デフォルトは200です。1000を超える値は指定できません。 |
| `marker`     | 文字列                 | 前に返された応答の[ページネーション](#ページネーション)キー。 |
| `format`     | 文字列                 | 返される結果のフォーマットは`csv`または`json`です。デフォルトは`json`です。 |

結果を集計するための`interval`パラメーターは、[v2.3.5][]で削除されました。

#### 応答フォーマット

成功した場合の応答では、HTTPコード**200 OK**と以下の内容のJSON本文が返されます。

| フィールド      | 値                        | 説明                      |
|:-----------|:-----------------------------|:---------------------------------|
| `result`   | 文字列                       | 値が`success`の場合は、成功した場合の応答であることを示します。 |
| `count`    | 整数                      | 返されたペイメントの件数。     |
| `marker`   | 文字列                       | （省略される場合があります）[ページネーション](#ページネーション)マーカー。 |
| `payments` | [ペイメントオブジェクト][]の配列 | 要求されたペイメント。          |


#### 例

要求:

```
GET /v2/payments/BTC+rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q?limit=2
```

応答:

```
200 OK
{
 "result": "success",
 "count": 2,
 "marker": "20131124004240|000003504935|00002",
 "payments": [
   {
     "amount": "100.0",
     "delivered_amount": "100.0",
     "destination_balance_changes": [
       {
         "counterparty": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
         "currency": "BTC",
         "value": "100"
       }
     ],
     "transaction_cost": "1.0E-5",
     "source_balance_changes": [
       {
         "counterparty": "rwm98fCBS8tV1YB8CGho8zUPW5J7N41th2",
         "currency": "BTC",
         "value": "-100"
       }
     ],
     "tx_index": 3,
     "currency": "BTC",
     "destination": "rwm98fCBS8tV1YB8CGho8zUPW5J7N41th2",
     "executed_time": "2013-09-27T04:03:00Z",
     "issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
     "ledger_index": 2424349,
     "source": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
     "source_currency": "BTC",
     "tx_hash": "EDDE2601C38F886E1183B5E7E1BFD936105C76E3648E3FAD2A6C55E90BABDB47"
   },
   {
     "amount": "0.2",
     "delivered_amount": "0.2",
     "destination_balance_changes": [
       {
         "counterparty": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
         "currency": "BTC",
         "value": "0.2"
       }
     ],
     "transaction_cost": "1.5E-5",
     "max_amount": "0.202",
     "source_balance_changes": [
       {
         "counterparty": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
         "currency": "BTC",
         "value": "-0.2"
       }
     ],
     "tx_index": 1,
     "currency": "BTC",
     "destination": "rHfcNvcg8pBqBxtSvD9Ma8gF17uxauB31o",
     "executed_time": "2013-11-20T23:52:30Z",
     "issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
     "ledger_index": 3445885,
     "source": "rwm98fCBS8tV1YB8CGho8zUPW5J7N41th2",
     "source_currency": "BTC",
     "tx_hash": "F30D6CED4B0C37660F6DD741C9CA49F0BCB2D2648CDB8FC8AD6CFD86A86384E2"
   }
 ]
}
```





## Get Exchanges
[[ソース]<br>](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/getExchanges.js "Source")

特定の通貨ペアの取引を経時的に取得します。結果は取引ごとに個別に返されるか、または特定の間隔でリストにまとめられます。

#### 要求フォーマット

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/exchanges/{base}/{counter}
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](data-api-v2-tool.html#get-exchanges)

このメソッドには以下のURLパラメーターを指定する必要があります。

| フィールド     | 値  | 説明                                             |
|:----------|:-------|:--------------------------------------------------------|
| `base`    | 文字列 | ペアのベース通貨。[通貨コード][]、`+`、イシュアーの[アドレス][]の順で指定します（ただし、ベース通貨がXRPの場合を除く）。 |
| `counter` | 文字列 | ペアのクオート通貨。[通貨コード][]、`+`、イシュアーの[アドレス][]の順で指定します（ただし、クオート通貨がXRPの場合を除く）。 |

オプションで、以下のクエリーパラメーターを指定できます。

| フィールド         | 値                  | 説明                         |
|:--------------|:-----------------------|:------------------------------------|
| `start`       | 文字列 - [タイムスタンプ][] | この時刻以降の結果に絞り込みます。 |
| `end`         | 文字列 - [タイムスタンプ][] | この時刻以前の結果に絞り込みます。 |
| `interval`    | 文字列                 | 収集間隔: `1minute`、`5minute`、`15minute`、`30minute`、`1hour`、`2hour`、`4hour`、`1day`、`3day`、`7day`、または`1month`。デフォルトでは結果は収集されません。 |
| `descending`  | ブール値                | `true`の場合、結果が逆時系列で返されます。 |
| `reduce`      | ブール値                | `true`の場合、個々の結果がすべてまとめられます。デフォルトは`false`です。 |
| `limit`       | 整数                | ページあたりの最大結果件数。デフォルトは200です。`reduce`がtrueの場合、指定できる最大値は20,000です。それ以外の場合は、指定できる最大値は1,000です。 |
| `marker`      | 文字列                 | 前に返された応答の[ページネーション](#ページネーション)キー。 |
| `autobridged` | ブール値                | `true`の場合は、オートブリッジングされた取引のみに結果が絞り込まれます。 |
| `format`      | 文字列                 | 返される結果のフォーマットは`csv`または`json`です。デフォルトは`json`です。 |

#### 応答フォーマット
成功した場合の応答では、HTTPコード**200 OK**と以下の内容のJSON本文が返されます。

| フィールド       | 値                         | 説明                    |
|:------------|:------------------------------|:-------------------------------|
| `result`    | 文字列                        | 値が`success`の場合は、成功した場合の応答であることを示します。 |
| `count`     | 整数                       | 返されたトランザクションの数。 |
| `marker`    | 文字列                        | （省略される場合があります）[ページネーション](#ページネーション)マーカー。 |
| `exchanges` | [取引オブジェクト][]の配列 | 要求された取引。       |

#### 例

要求:

```
GET /v2/exchanges/USD+rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q/XRP?descending=true&limit=3&result=tesSUCCESS&type=OfferCreate
```

応答:

```
200 OK
{
   "result": "success",
   "count": 3,
   "marker": "USD|rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q|XRP||20151021222220|000016612683|00017|00000",
   "exchanges": [
       {
           "base_amount": 4.98954834453577,
           "counter_amount": 1047.806201,
           "node_index": 9,
           "rate": 210.00021000021,
           "tx_index": 0,
           "buyer": "rpP2JgiMyTF5jR5hLG3xHCPi1knBb1v9cM",
           "executed_time": "2015-10-21T23:09:50",
           "ledger_index": 16613308,
           "offer_sequence": 1010056,
           "provider": "rpP2JgiMyTF5jR5hLG3xHCPi1knBb1v9cM",
           "seller": "rK2o63evRPdRoMT2ZaW72wsHsFzcjnRLLq",
           "taker": "rK2o63evRPdRoMT2ZaW72wsHsFzcjnRLLq",
           "tx_hash": "25600A10E5395D45A9D514E1EC3D98C341C5451FD21C48FA9D104C310EC29D6B",
           "tx_type": "Payment",
           "base_currency": "USD",
           "base_issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
           "counter_currency": "XRP"
       },
       {
           "base_amount": 0.0004716155440678037,
           "counter_amount": 0.1,
           "node_index": 3,
           "rate": 212.03711637126,
           "tx_index": 0,
           "buyer": "rfh3pFHkCXv3TgzsEJgyCzF1CduZHCLi9o",
           "executed_time": "2015-10-21T23:09:50",
           "ledger_index": 16613308,
           "offer_sequence": 158081,
           "provider": "rfh3pFHkCXv3TgzsEJgyCzF1CduZHCLi9o",
           "seller": "rK2o63evRPdRoMT2ZaW72wsHsFzcjnRLLq",
           "taker": "rK2o63evRPdRoMT2ZaW72wsHsFzcjnRLLq",
           "tx_hash": "25600A10E5395D45A9D514E1EC3D98C341C5451FD21C48FA9D104C310EC29D6B",
           "tx_type": "Payment",
           "base_currency": "USD",
           "base_issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
           "counter_currency": "XRP"
       },
       {
           "base_amount": 0.0004714169229390923,
           "counter_amount": 0.1,
           "node_index": 3,
           "rate": 212.1264535361624,
           "tx_index": 17,
           "autobridged_currency": "USD",
           "autobridged_issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
           "buyer": "rfh3pFHkCXv3TgzsEJgyCzF1CduZHCLi9o",
           "executed_time": "2015-10-21T22:22:20",
           "ledger_index": 16612683,
           "offer_sequence": 158059,
           "provider": "rfh3pFHkCXv3TgzsEJgyCzF1CduZHCLi9o",
           "seller": "rpP2JgiMyTF5jR5hLG3xHCPi1knBb1v9cM",
           "taker": "rpP2JgiMyTF5jR5hLG3xHCPi1knBb1v9cM",
           "tx_hash": "F05F670B06D641D7F6FE18E450DDB2C7A4DDF76D580C34C820939DC22AD9F582",
           "tx_type": "OfferCreate",
           "base_currency": "USD",
           "base_issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
           "counter_currency": "XRP"
       }
   ]
}
```



## Get Exchange Rates
[[ソース]<br>](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/getExchangeRate.js "Source")

指定された通貨ペアの特定の時点での為替レートを取得します。

#### 要求フォーマット

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/exchange_rates/{base}/{counter}
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](data-api-v2-tool.html#get-exchange-rates)

このメソッドには以下のURLパラメーターを指定する必要があります。

| フィールド     | 値  | 説明                                             |
|:----------|:-------|:--------------------------------------------------------|
| `base`    | 文字列 | ペアのベース通貨を、[通貨コード][]、`+`、イシュアーの[アドレス][]の順で指定します。XRPの場合は`+`とイシュアーを省略します。 |
| `counter` | 文字列 | ペアのクオート通貨。[通貨コード][]、`+`、イシュアーの[アドレス][]の順で指定します。XRPの場合は`+`とイシュアーを省略します。 |


オプションで、以下のクエリーパラメーターを指定できます。

| フィールド    | 値                  | 説明                              |
|:---------|:-----------------------|:-----------------------------------------|
| `date`   | 文字列 - [タイムスタンプ][] | 指定された時点の為替レートを返します。デフォルトは現行時刻です。 |
| `strict` | ブール値                | `false`の場合、10件未満の取引からレートを導出できます。デフォルトは`true`です。 |


#### 応答フォーマット
成功した場合の応答では、HTTPコード**200 OK**と以下の内容のJSON本文が返されます。

| フィールド    | 値  | 説明                                              |
|:---------|:-------|:---------------------------------------------------------|
| `result` | 文字列 | 値が`success`の場合は、成功した場合の応答であることを示します。 |
| `rate`   | 数値 | 要求された為替レート。為替レートを判別できなかった場合は`0` です。 |

すべての為替レートは、ベース通貨とクオート通貨をXRPに変換して算出されます。

レートは指定されたカレンダー日の出来高加重平均から導出されます。過去14日間における最新50件の取引の加重平均です。

#### 例

要求:

```
GET /v2/exchange_rates/USD+rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q/XRP?date=2015-11-13T00:00:00Z
```

応答:

```
200 OK
{
 "result": "success",
 "rate": "224.65709"
}
```




## Normalize
[[ソース]<br>](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/normalize.js "Source")

ネットワークの為替レートを使用して、ある通貨とイシュアーからの額を別の通貨とイシュアーの額へ交換します。

#### 要求フォーマット

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/normalize
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](data-api-v2-tool.html#normalize)

少なくとも以下のクエリーパラメーターのいくつかを指定する必要があります。

| フィールド               | 値                      | 説明               |
|:--------------------|:---------------------------|:--------------------------|
| `amount`            | 数値                     | （必須）正規化する通貨の額。 |
| `currency`          | 文字列 - [通貨コード][] | 交換前の`amount`の通貨コード。デフォルトはXRPです。 |
| `issuer`            | 文字列 - [アドレス][]       | 交換前の通貨のイシュアー。（`currency`がXRP以外の場合には必須です。） |
| `exchange_currency` | 文字列 - [通貨コード][] | 交換後の通貨。デフォルトはXRPです。 |
| `exchange_issuer`   | 文字列 - [アドレス][]       | 交換後の通貨のイシュアー。（`exchange_currency`がXRP以外の場合には必須です。） |
| `date`              | 文字列 - [タイムスタンプ][]     | この時点の為替レートに基づいて変換します。デフォルトは現行時刻です。 |
| `strict`            | ブール値                    | `true`の場合は、10件未満の取引から判別された為替レートは使用されません。デフォルトは`true`です。 |


#### 応答フォーマット
成功した場合の応答では、HTTPコード**200 OK**と以下の内容のJSON本文が返されます。

| フィールド       | 値  | 説明                                           |
|:------------|:-------|:------------------------------------------------------|
| `result`    | 文字列 | 値が`success`の場合は、成功した場合の応答であることを示します。 |
| `amount`    | 数値 | 要求に指定されている交換前の額。       |
| `converted` | 数値 | 交換後の`exchange_currency`の額。為替レートを判別できなかった場合は`0`です。 |
| `rate`      | 数値 | 交換の計算に使用された為替レート。為替レートを判別できなかった場合は`0`です。 |

為替レートはすべて、両方の通貨をXRPに交換することで算出されます。

#### 例

要求:

```
GET /v2/normalize?amount=100&currency=XRP&exchange_currency=USD&exchange_issuer=rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q
```

応答:

```
200 OK
{
 "result": "success",
 "amount": "100",
 "converted": "0.4267798022744489",
 "rate": "0.0042677980"
}
```




## Get Daily Reports
[[ソース]<br>](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/reports.js "Source")

1日あたりのアカウント別に集計されたペイメントのサマリーを取得します。

#### 要求フォーマット

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/reports/{date}
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](data-api-v2-tool.html#get-daily-reports)

このメソッドでは以下のURLパラメーターを使用します。

| フィールド  | 値  | 説明                                                   |
|:-------|:-------|:--------------------------------------------------------------|
| `date` | 文字列 | _（省略可）_ クエリー実行日（UTC）。省略すると現在の日付が使用されます。 |

オプションで、以下のクエリーパラメーターを指定できます。

| フィールド      | 値   | 説明                                           |
|:-----------|:--------|:------------------------------------------------------|
| `accounts` | ブール値 | `true`の場合は、相手側アカウントのリストが含まれます。デフォルトは`false`です。 |
| `payments` | ブール値 | `true`の場合は、個々のペイメントのリストが含まれます。デフォルトは`false`です。 |
| `format`   | 文字列  | 返される結果のフォーマットは`csv`または`json`です。デフォルトは`json`です。 |
| `limit`    | 整数 | ページあたりの最大結果件数。デフォルトは200です。1000を超える値は指定できません。 |
| `marker`   | 文字列  | 前に返された応答の[ページネーション](#ページネーション)キー。 |

#### 応答フォーマット

成功した場合の応答では、HTTPコード**200 OK**と以下の内容のJSON本文が返されます。

| フィールド     | 値                        | 説明                       |
|:----------|:-----------------------------|:----------------------------------|
| `result`  | 文字列                       | 値が`success`の場合は、成功した場合の応答であることを示します。 |
| `date`    | 文字列 - [タイムスタンプ][]       | このレポートが適用される日付。 |
| `count`   | 整数                      | 返されたレポートの数。       |
| `marker`  | 文字列                       | （省略される場合があります）[ページネーション](#ページネーション)マーカー。 |
| `reports` | [レポートオブジェクト][]の配列 | 要求されたレポート。各レポートは1つのアカウントに関連します。 |

**注意:** このメソッドでは非常に大量のデータ（1 MB以上）が返されることがあり、クライアントアプリケーションのパフォーマンスを低下させる可能性があります。

#### 例

要求:

```
GET /v2/reports/2015-08-19T00:00:00Z?accounts=true&payments=true
```

応答（サイズが大きいため一部省略）:

```
{
   "result": "success",
   "date": "2015-08-19T00:00:00Z",
   "count": 2,
   "marker": "20150819000000|r2nt4zXDP6Be5FNrLsiuuTEBETbGR9RFw",
   "reports": [
       {
           "account": "r2LXq2rZWSgQ1thhKiEytzi1smg6oEn8A",
           "date": "2015-08-19T00:00:00Z",
           "high_value_received": "7000",
           "high_value_sent": "3400",
           "payments": [
               {
                   "tx_hash": "A032EFBB219B1102BBD9BCCB91EDC6EAA8185509574FA476A2D3FE6BA79B04EF",
                   "amount": "1700",
                   "type": "received"
               },
               {
                   "tx_hash": "8B059360DC83777CDCABA84824C169651AFD6A7AB44E8742A3B8C6BC2AAF7384",
                   "amount": "40",
                   "type": "received"
               },

               ...(additional results trimmed)...

               {
                   "tx_hash": "76041BD6546389B5EC2CDBAA543200CF7B8D300F34F908BA5CA8523B0CA158C8",
                   "amount": "1400",
                   "type": "sent"
               }
           ],
           "payments_received": 155,
           "payments_sent": 49,
           "receiving_counterparties": [
               "rDMFJrKg2jyoNG6WDWJknXDEKZ6ywNFGwD",
               "r4XXHxraHLuCiLmLMw96FTPXXywZSnWSyR",

               ...(additional results trimmed)...


               "rp1C4Ld6uGjurFpempUJ8q5hPSWhak5EQf"
           ],
           "sending_counterparties": [
               "rwxcJVWZSEgN2DmLZYYjyagHjMx5jQ7BAa",

               ...(additional results trimmed)...


               "rBK1rLjbWsSU9EuST1cAz9RsiYdJPVGXXA"
           ],
           "total_value": "210940",
           "total_value_received": "100540",
           "total_value_sent": "110400"
       },
       {
           "account": "r2adXWaWFJt9mHeoWN77iHJozDz2FDAPA",
           "date": "2015-08-19T00:00:00Z",
           "high_value_received": "7400",
           "high_value_sent": "15900",
           "payments": [
               {
                   "tx_hash": "9C7EA76D467AE58E6AEFAAC7994D42FB4E7FA72BFA22F90260937386D76BDB64",
                   "amount": "900",
                   "type": "sent"
               },

               ...(additional results trimmed)...


               {
                   "tx_hash": "EC25427964419394BB5D06343BC74235C33655C1F70523C688F9A201957D65BA",
                   "amount": "100",
                   "type": "sent"
               }
           ],
           "payments_received": 43,
           "payments_sent": 62,
           "receiving_counterparties": [
               "rB4cyZxrBrTmJcWZSBc8YoW2t3bafiKRp",

               ...(additional results trimmed)...


               "rKybkw3Pu74VfJfrWr7QJbVPJNarnKP2EJ"
           ],
           "sending_counterparties": [
               "rNRCXw8PQRjvTwMDDLZVvuLHSKqqXUXQHv",
               "r7CLMVEuNvK2yXTPLPnkWMqzkkXuopWeL",

               ...(additional results trimmed)...


               "ranyeoYRhvwiFABzDvxSVyqQKp1bMkFsaX"
           ],
           "total_value": "117600",
           "total_value_received": "54700",
           "total_value_sent": "62900"
       }
   ]
}
```



## Get Stats
[[ソース]<br>](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/stats.js "Source")

XRP Ledgerでのトランザクションアクティビティの統計情報を、さまざまな時間間隔で取得します。

#### 要求フォーマット

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/stats
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](data-api-v2-tool.html#get-stats)

オプションで、以下のクエリーパラメーターを指定できます。

| フィールド        | 値                  | 説明                          |
|:-------------|:-----------------------|:-------------------------------------|
| `family`     | 文字列                 | 指定されている場合は、結果が`type`、`result`、または`metric`のいずれか1つの統計ファミリーに絞り込まれます。デフォルトでは、すべてのファミリーのすべての統計情報が返されます。 |
| `metrics`    | 文字列                 | 結果を1つ以上のメトリック（カンマ区切りリスト）に絞り込みます。メトリックの`family`を指定する必要があります。デフォルトでは、当該ファミリーのすべてのメトリックが返されます。 |
| `start`      | 文字列 - [タイムスタンプ][] | この時刻以降の結果に絞り込みます。 |
| `end`        | 文字列 - [タイムスタンプ][] | この時刻以前の結果に絞り込みます。 |
| `interval`   | 文字列                 | 収集間隔（`hour`、`day`、または`week`）。デフォルトは`day`です。 |
| `limit`      | 整数                | ページあたりの最大結果件数。デフォルトは200です。1000を超える値は指定できません。 |
| `marker`     | 文字列                 | 前に返された応答の[ページネーション](#ページネーション)キー。 |
| `descending` | ブール値                | `true`の場合、結果が逆時系列で返されます。デフォルトは`false`です。 |
| `format`     | 文字列                 | 返される結果のフォーマットは`csv`または`json`です。デフォルトは`json`です。 |

##### ファミリーとメトリクス

クエリーパラメーター`family`と`metrics`を使用すると、任意の間隔ですべてのトランザクションに適用できるあらゆるメトリクスの特定のサブセットに結果を絞り込むことができます。各メトリクスは以下のように特定のファミリーに関連付けられています。

| ファミリー   | 含まれるメトリクス | 意味 |
|:---------|:-----------------|:--------|
| `type`   | XRP Ledgerのすべての[トランザクションタイプ](transaction-formats.html)（`Payment`、`AccountSet`、`OfferCreate`など）。 | 所定の間隔内に発生した、指定されたタイプのトランザクションの数。 |
| `result` | `tesSUCCESS`、`tecPATH_DRY`などを含む、すべての[トランザクション結果コード](transaction-results.html)（数値コードではなく文字列コード）。 | 所定の間隔内に指定された結果コードを取得したトランザクションの数。 |
| `metric` | Data-API定義の特殊トランザクションメトリクス。 | （場合により異なる） |

##### 特殊トランザクションメトリクス

Data APIは各間隔ごとに以下の値を導出します。これらのメトリクスは`metric`ファミリーの一部です。

| フィールド              | 値  | 説明                                    |
|:-------------------|:-------|:-----------------------------------------------|
| `accounts_created` | 数値 | この間隔内に資金供給を受けた新しいアカウントの数。 |
| `exchanges_count`  | 数値 | この間隔内に発生した通貨取引の数。 |
| `ledger_count`     | 数値 | この間隔内に閉鎖されたレジャーの数。 |
| `ledger_interval`  | 数値 | この間隔内におけるレジャーの平均閉鎖間隔（秒数）。 |
| `payments_count`   | 数値 | この間隔におけるアカウント間決済数。 |
| `tx_per_ledger`    | 数値 | この間隔におけるレジャーあたりの平均トランザクション数。 |

値が0のメトリクスは結果から省略されます。

#### 応答フォーマット
成功した場合の応答では、HTTPコード**200 OK**と以下の内容のJSON本文が返されます。

| フィールド    | 値                  | 説明                              |
|:---------|:-----------------------|:-----------------------------------------|
| `result` | 文字列                 | 値が`success`の場合は、成功した場合の応答であることを示します。 |
| `count`  | 整数                | 返されたレポートの数。              |
| `marker` | 文字列                 | （省略される場合があります）[ページネーション](#ページネーション)マーカー。 |
| `stats`  | 統計情報オブジェクトの配列 | 要求された統計情報。値が0のメトリクスと、0以外のメトリクスのない間隔は省略されます。 |

#### 例

要求:

```
GET /v2/stats/?start=2015-08-30&end=2015-08-31&interval=day&family=metric&metrics=accounts_created,exchanges_count,ledger_count,payments_count
```

応答:

```
200 OK
{
 "result": "success",
 "count": 2,
 "stats": [
   {
     "accounts_created": 15,
     "exchanges_count": 19368,
     "ledger_count": 20307,
     "payments_count": 24763,
     "date": "2015-08-30T00:00:00Z"
   },
   {
     "accounts_created": 18,
     "exchanges_count": 17192,
     "ledger_count": 19971,
     "payments_count": 30894,
     "date": "2015-08-31T00:00:00Z"
   }
 ]
}
```



## Get Active Accounts
[[ソース]<br>](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/activeAccounts.js "Source")

特定の通貨ペアの取引を実際に行っているアカウントに関する情報を取得します。_（新規: [v2.0.4][]）_

#### 要求フォーマット

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/active_accounts/{base}/{counter}
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](data-api-v2-tool.html#get-active-accounts)

このメソッドには以下のURLパラメーターを指定する必要があります。

| フィールド     | 値  | 説明                                             |
|:----------|:-------|:--------------------------------------------------------|
| `base`    | 文字列 | ペアのベース通貨。[通貨コード][]、`+`、イシュアーの[アドレス][]の順で指定します（ベース通貨がXRPの場合を除く）。 |
| `counter` | 文字列 | ペアのクオート通貨。[通貨コード][]、`+`、イシュアーの[アドレス][]の順で指定します（ただし、クオート通貨がXRPの場合を除く）。 |

オプションで、以下のクエリーパラメーターを指定できます。

| フィールド               | 値   | 説明                                  |
|:--------------------|:--------|:---------------------------------------------|
| `period`            | 文字列  | 選択した期間中の取引アクティビティの結果を取得します。有効期間は`1day`、`3day`、`7day`です。デフォルトは`1day`です。 |
| `date`              | 文字列  | この日に始まる期間の結果を取得します。デフォルトは、直近の期間です。 |
| `include_exchanges` | ブール値 | 各アカウントの個々の取引を結果に含めます。 |
| `format`            | 文字列  | 返される結果のフォーマットは`csv`または`json`です。デフォルトは`json`です。 |

#### 応答フォーマット
成功した場合の応答では、HTTPコード**200 OK**と以下の内容のJSON本文が返されます。

| フィールド             | 値                                   | 説明    |
|:------------------|:----------------------------------------|:---------------|
| `result`          | 文字列                                  | 値が`success`の場合は、成功した場合の応答であることを示します。 |
| `count`           | 整数                                 | 返されたアカウントの数。 |
| `exchanges_count` | 整数                                 | 当該期間の取引の合計数。 |
| `accounts`        | アクティブなアカウント取引オブジェクトの配列。 | 当該期間のアクティブな取引アカウント。 |

各**アカウント取引オブジェクト**は、当該期間における1つのアカウントのアクティビティを表し、以下のフィールドが含まれています。

| フィールド                 | 値                | 説明                   |
|:----------------------|:---------------------|:------------------------------|
| `buy`                 | オブジェクト               | ベース通貨を購入する通貨取引のサマリー。 |
| `buy.base_volume`     | 数値               | このアカウントが当該期間に購入したベース通貨の額。 |
| `buy.counter_volume`  | 数値               | このアカウントが当該期間に売却したクオート通貨の額。 |
| `buy.count`           | 数値               | 当該期間にベース通貨を購入した取引の数。 |
| `sell`                | オブジェクト               | ベース通貨を売却する通貨取引のサマリー。 |
| `sell.base_volume`    | 数値               | このアカウントが当該期間に売却したベース通貨の額。 |
| `sell.counter_volume` | 数値               | このアカウントが当該期間に購入したクオート通貨の額。 |
| `sell.count`          | 数値               | 当該期間にベース通貨を売却した取引の数。 |
| `account`             | 文字列 - [アドレス][] | このオブジェクトが表すアクティビティのアドレス。 |
| `base_volume`         | 数値               | このアカウントが当該期間中に売買したベース通貨の総額。 |
| `counter_volume`      | 数値               | このアカウントが当該期間中に売買したクオート通貨の総額。 |
| `count`               | 数値               | このアカウントが当該期間中に行った取引の合計数。 |

#### 例

要求:

```
GET /v2/active_accounts/XRP/USD+rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q
```

応答:

```
200 OK
{
   "result": "success",
   "count": 12,
   "exchanges_count": 11,
   "accounts": [
       {
           "buy": {
               "base_volume": 0,
               "counter_volume": 0,
               "count": 0
           },
           "sell": {
               "base_volume": 13084.822874,
               "counter_volume": 54.499328645454604,
               "count": 4
           },
           "account": "rGBQhB8EH5DmqMmfKPLchpqr3MR19pv6zN",
           "base_volume": 13084.822874,
           "counter_volume": 54.499328645454604,
           "count": 4
       },
       {
           "buy": {
               "base_volume": 12597.822874,
               "counter_volume": 52.4909286454546,
               "count": 1
           },
           "sell": {
               "base_volume": 0,
               "counter_volume": 0,
               "count": 0
           },
           "account": "rQE5Z3FgVnRMbVfS6xiVQFgB4J3X162FVD",
           "base_volume": 12597.822874,
           "counter_volume": 52.4909286454546,
           "count": 1
       },

       ...(additional results trimmed)...

       {
           "buy": {
               "base_volume": 1.996007,
               "counter_volume": 0.008782427920595,
               "count": 1
           },
           "sell": {
               "base_volume": 0,
               "counter_volume": 0,
               "count": 0
           },
           "account": "rD8LigXE7165r3VWhSQ4FwzJy7PNrTMwUq",
           "base_volume": 1.996007,
           "counter_volume": 0.008782427920595,
           "count": 1
       },
       {
           "buy": {
               "base_volume": 0,
               "counter_volume": 0,
               "count": 0
           },
           "sell": {
               "base_volume": 0.1,
               "counter_volume": 0.0004821658905462904,
               "count": 1
           },
           "account": "rfh3pFHkCXv3TgzsEJgyCzF1CduZHCLi9o",
           "base_volume": 0.1,
           "counter_volume": 0.0004821658905462904,
           "count": 1
       }
   ]
}
```



## Get Exchange Volume
[[ソース]<br>](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/network/getMetric.js "Source")

指定された期間における取引量の合計を取得します。_（新規: [v2.0.4][]）_

APIは、結果を複数の種類の通貨ではなく1つの _表示通貨_ 単位で返します。XRPと他の通貨の取引には、標準レートが使用されます。

#### 要求フォーマット

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/network/exchange_volume
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](data-api-v2-tool.html#get-exchange-volume)

オプションで、以下のクエリーパラメーターを指定できます。

| フィールド               | 値                      | 説明               |
|:--------------------|:---------------------------|:--------------------------|
| `live`              | 文字列                     | この時間の長さのライブローリングウィンドウを返します。有効な値は`day`、`hour`、`minute`です。_（新規: [v2.3.0][]）_ |
| `exchange_currency` | 文字列 - [通貨コード][] | すべての額を正規化し、この通貨を表示通貨として使用します。XRP以外の場合は`exchange_issuer`も必要です。デフォルトはXRPです。 |
| `exchange_issuer`   | 文字列 - [アドレス][]       | 結果を、このイシュアーが発行した特定の`currency`に正規化します。 |
| `format`            | 文字列                     | 返される結果のフォーマットは`csv`または`json`です。デフォルトは`json`です。 |

`start`、`end`、`interval`、`limit`、および`marker`パラメーターは[v2.3.5][]で削除されました。

#### 応答フォーマット
成功した場合の応答では、HTTPコード**200 OK**と以下の内容のJSON本文が返されます。

| フィールド    | 値                                | 説明                |
|:---------|:-------------------------------------|:---------------------------|
| `result` | 文字列                               | 値が`success`の場合は、成功した場合の応答であることを示します。 |
| `count`  | 整数                              | 返された結果の数。 |
| `rows`   | 取引[取引量オブジェクト][]の配列。 | 要求された期間における各間隔の取引量。（デフォルトでは、この配列には直近の完全な間隔だけが含まれます。`live`が指定されており`interval`が指定されていない場合は、この配列には指定されたローリングウィンドウが含まれます。） |

取引量オブジェクトの`components`配列内の各オブジェクトは、2種類の通貨間のマーケットにおける取引量を表し、以下のフィールドが含まれています。

| フィールド              | 値  | 説明                                    |
|:-------------------|:-------|:-----------------------------------------------|
| `count`            | 数値 | この間隔内にこのマーケットで行われた取引の件数。 |
| `rate`             | 数値 | ベース通貨から表示通貨への為替レート。 |
| `amount`           | 数値 | このマーケットにおける取引量（ベース通貨単位）。 |
| `base`             | オブジェクト | このマーケットにおけるベース通貨の`currency`と`issuer`。XRPの場合は`issuer`はありません。 |
| `counter`          | オブジェクト | このマーケットにおけるクオート通貨の`currency`と`issuer`。XRPの場合は`issuer`はありません。 |
| `converted_amount` | 数値 | このマーケットにおける合計取引量（表示通貨に変換）。_（[v2.1.0][]より古いバージョンでは、これは`convertedAmount`でした。）_ |

#### 例

要求:

```
GET /v2/network/exchange_volume?exchange_currency=USD&exchange_issuer=rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B
```


応答:

```
200 OK
{
   "result": "success",
   "count": 1,
   "rows": [
       {
           "components": [
               {
                   "count": 1711,
                   "rate": 5.514373809662552e-8,
                   "amount": 333.7038784107369,
                   "base": {
                       "currency": "BTC",
                       "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
                   },
                   "counter": {
                       "currency": "XRP"
                   },
                   "converted_amount": 117720.99268355068
               },
               {
                   "count": 1977,
                   "rate": 0.000019601413454357618,
                   "amount": 74567.72531650064,
                   "base": {
                       "currency": "USD",
                       "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
                   },
                   "counter": {
                       "currency": "XRP"
                   },
                   "converted_amount": 74003.51871932109
               },

               ...(additional results trimmed) ...

               {
                   "count": 3,
                   "rate": 0.022999083584408355,
                   "amount": 85.40728674708998,
                   "base": {
                       "currency": "CNY",
                       "issuer": "razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA"
                   },
                   "counter": {
                       "currency": "USD",
                       "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
                   },
                   "converted_amount": 12.72863756671683
               },
               {
                   "count": 3,
                   "rate": 1.7749889023209692e-7,
                   "amount": 570.687912196755,
                   "base": {
                       "currency": "JPY",
                       "issuer": "r94s8px6kSw1uZ1MV98dhSRTvc6VMPoPcN"
                   },
                   "counter": {
                       "currency": "BTC",
                       "issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q"
                   },
                   "converted_amount": 4.4137945368632545
               }
           ],
           "count": 11105,
           "endTime": "2015-09-11T19:58:58+00:00",
           "exchange": {
               "currency": "USD",
               "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
           },
           "exchangeRate": 0.004410567085248279,
           "startTime": "2015-11-10T00:06:04+00:00",
           "total": 442442.5974313684
       }
   ]
}
```





## Get Payment Volume
[[ソース]<br>](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/network/getMetric.js "Source")

指定された期間のペイメントの合計取引量を取得します。_（新規: [v2.0.4][]）_

APIは、結果を複数の種類の通貨ではなく1つの _表示通貨_ 単位で返します。XRPと他の通貨の取引には、標準レートが使用されます。

#### 要求フォーマット

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/network/payment_volume
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](data-api-v2-tool.html#get-payment-volume)

オプションで、以下のクエリーパラメーターを指定できます。

| フィールド               | 値                      | 説明               |
|:--------------------|:---------------------------|:--------------------------|
| `live`              | 文字列                     | この時間の長さのライブローリングウィンドウを返します。有効な値は`day`、`hour`、`minute`です。_（新規: [v2.3.0][]）_ |
| `exchange_currency` | 文字列 - [通貨コード][] | すべての額を正規化し、この通貨を表示通貨として使用します。XRP以外の場合は`exchange_issuer`も必要です。デフォルトはXRPです。 |
| `exchange_issuer`   | 文字列 - [アドレス][]       | 結果を、このイシュアーが発行した特定の`currency`に正規化します。 |
| `format`            | 文字列                     | 返される結果のフォーマットは`csv`または`json`です。デフォルトは`json`です。 |

`start`、`end`、`interval`、`limit`、および`marker`パラメーターは[v2.3.5][]で削除されました。

#### 応答フォーマット
成功した場合の応答では、HTTPコード**200 OK**と以下の内容のJSON本文が返されます。

| フィールド    | 値                               | 説明                 |
|:---------|:------------------------------------|:----------------------------|
| `result` | 文字列                              | 値が`success`の場合は、成功した場合の応答であることを示します。 |
| `count`  | 整数                             | 返された結果の数。 |
| `rows`   | ペイメントの[取引量オブジェクト][]の配列。 | 要求された期間における各間隔のペイメントの取引量。（デフォルトでは、この配列には最新の間隔だけが含まれます。`live`が指定されており`interval`が指定されていない場合は、この配列には指定されたローリングウィンドウが含まれます。） |

取引量オブジェクトの`components`配列の各オブジェクトは、1つの通貨とイシュアーのペイメントの取引量を表し、以下のフィールドが含まれています。

| フィールド              | 値                      | 説明                |
|:-------------------|:---------------------------|:---------------------------|
| `currency`         | 文字列 - [通貨コード][] | このペイメントの取引量オブジェクトの通貨。 |
| `issuer`           | 文字列 - [アドレス][]       | （XRPの場合は省略）このペイメントの取引量オブジェクトのイシュアー。 |
| `amount`           | 数値                     | 当該間隔内におけるこの通貨でのペイメントの合計額（当該通貨単位）。 |
| `count`            | 数値                     | この通貨でのペイメントの合計件数。 |
| `rate`             | 数値                     | この通貨と表示通貨間の為替レート。 |
| `converted_amount` | 数値                     | この通貨のペイメントの合計額（表示通貨に変換）。_（[v2.1.0][]より古いバージョンでは、これは`convertedAmount`でした。）_ |

#### 例

要求:

```
GET /v2/network/payment_volume
```

応答:

```
200 OK
{
   "result": "success",
   "count": 1,
   "rows": [
       {
           "components": [
               {
                   "currency": "USD",
                   "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                   "amount": 87279.59029136538,
                   "count": 331,
                   "rate": 0.004412045860957953,
                   "converted_amount": 19782113.1153009
               },
               {
                   "currency": "USD",
                   "issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
                   "amount": 0,
                   "count": 0,
                   "rate": 0.00451165816091143,
                   "converted_amount": 0
               },
               {
                   "currency": "BTC",
                   "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                   "amount": 279.03077460240354,
                   "count": 107,
                   "rate": 0.000013312520335244644,
                   "converted_amount": 20960026.169024874
               },

               ...(additional results trimmed) ...

               {
                   "currency": "MXN",
                   "issuer": "rG6FZ31hDHN1K5Dkbma3PSB5uVCuVVRzfn",
                   "amount": 49263.13280138676,
                   "count": 19,
                   "rate": 0.07640584677247926,
                   "converted_amount": 644756.0609868265
               },
               {
                   "currency": "XRP",
                   "amount": 296246369.30089426,
                   "count": 8691,
                   "rate": 1,
                   "converted_amount": 296246369.30089426
               }
           ],
           "count": 9388,
           "endTime": "2015-09-11T19:58:59+00:00",
           "exchange": {
               "currency": "XRP"
           },
           "exchangeRate": 1,
           "startTime": "2015-11-10T00:19:04+00:00",
           "total": 390754174.7837752
       }
   ]
}
```



## Get External Markets
[[ソース]<br>](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/network/externalMarkets.js "Source")

指定のローリング間隔におけるレジャー外の取引のリストから、取引量の合計を取得します。

APIは、結果を複数の種類の通貨ではなく1つの _表示通貨_ 単位で返します。XRPと他の通貨の取引には、標準レートが使用されます。

#### 要求フォーマット ####

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/network/external_markets
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](data-api-v2-tool.html#get-external-markets)

オプションで、以下のクエリーパラメーターを指定できます。

| フィールド               | 値                      | 説明               |
|:--------------------|:---------------------------|:--------------------------|
| `period`            | 文字列                     | 集約期間 - 有効な間隔は`1hour`、`1day`、`3day`、`7day`、`30day`です。デフォルトは`1day`です。 |
| `exchange_currency` | 文字列 - [通貨コード][] | すべての額を正規化し、この通貨を表示通貨として使用します。XRP以外の場合は`exchange_issuer`も必要です。デフォルトはXRPです。 |
| `exchange_issuer`   | 文字列 - [アドレス][]       | 結果を、このイシュアーが発行した特定の`currency`に正規化します。 |


#### 応答フォーマット ####
成功した場合の応答では、HTTPコード**200 OK**と以下の内容のJSON本文が返されます。

| フィールド         | 値  | 説明                                         |
|:--------------|:-------|:----------------------------------------------------|
| `result`      | 文字列 | 値が`success`の場合は、成功した場合の応答であることを示します。 |
| `data`        | オブジェクト | 指定の期間のデータが含まれています。             |
| `data.date`   | 文字列 | この期間が計算された日付。           |
| `data.total`  | 数値 | 当該期間に取引されたXRPの合計額。       |
| `data.period` | 文字列 | 照会された期間の名前。                         |

取引量オブジェクトの`components`配列の各オブジェクトは、1つの外部マーケットの取引量を表します。マーケットによってはすべてのフィールドが表示されるわけではありません。

| フィールド              | 値  | 説明                                    |
|:-------------------|:-------|:-----------------------------------------------|
| `source`           | 文字列 | 特定の外部マーケットのドメイン名。   |
| `base_volume`      | 数値 | ベース通貨（XRP）単位での取引量。 |
| `counter_volume`   | 数値 | クオート通貨単位での取引量。 |
| `base_currecy`     | 文字列 | マーケットペアのベース通貨。              |
| `counter_currency` | 文字列 | マーケットペアのクオート通貨。           |
| `rate`             | 数値 | 為替レート。                                 |

#### 例 ####

要求:

```
GET /v2/network/external_markets
```


応答:

```
200 OK

{
 "result": "success",
 "data": {
   "components": [
     {
       "base_volume": "52847221.256202064",
       "counter_volume": "619.8111371100003",
       "source": "poloniex.com",
       "base_currency": "XRP",
       "counter_currency": "BTC",
       "rate": "0.0000117284"
     },
     {
       "base_volume": "389955.29648717004",
       "counter_volume": "3212.07137265",
       "source": "poloniex.com",
       "base_currency": "XRP",
       "counter_currency": "USD",
       "rate": "0.00823702"
     },
     {
       "base_volume": "6025268.09143092",
       "counter_volume": "70.57870572291264",
       "count": 250,
       "source": "kraken.com",
       "base_currency": "XRP",
       "counter_currency": "BTC",
       "rate": "0.0000117138"
     },
     {
       "base_volume": "4141962.161763998",
       "source": "btc38.com",
       "base_currency": "XRP",
       "counter_currency": "CNY"
     },
     {
       "base_volume": "303505",
       "source": "btc38.com",
       "base_currency": "XRP",
       "counter_currency": "BTC"
     },
     {
       "base_volume": "1275008.2922999999",
       "source": "jubi.com",
       "base_currency": "XRP",
       "counter_currency": "CNY"
     }
   ],
   "date": "2016-10-31T20:45:20Z",
   "period": "1day",
   "total": "64982920.098184146"
 }
}
```



## Get XRP Distribution
[[ソース]<br>](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/network/xrpDistribution.js "Source")

現存し、流通しているXRPの合計額に関する情報を週単位で取得します。_（新規: [v2.2.0][]）_

#### 要求フォーマット

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/network/xrp_distribution
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](data-api-v2-tool.html#get-xrp-distribution)

オプションで、以下のクエリーパラメーターを指定できます。

| フィールド        | 値                  | 説明                          |
|:-------------|:-----------------------|:-------------------------------------|
| `start`      | 文字列 - [タイムスタンプ][] | 照会範囲の開始時刻。デフォルトは、最新間隔の開始時刻です。 |
| `end`        | 文字列 - [タイムスタンプ][] | 照会範囲の終了時刻。デフォルトは、最新間隔の終了時刻です。 |
| `limit`      | 整数                | ページあたりの最大結果件数。デフォルトは200です。1000を超える値は指定できません。 |
| `marker`     | 文字列                 | 前に返された応答の[ページネーション](#ページネーション)キー。 |
| `descending` | ブール値                | `true`の場合、結果が逆時系列で返されます。デフォルトは`false`です。 |
| `format`     | 文字列                 | 返される結果のフォーマットは`csv`または`json`です。デフォルトは`json`です。 |

#### 応答フォーマット

成功した場合の応答では、HTTPコード**200 OK**と以下の内容のJSON本文が返されます。

| フィールド    | 値                         | 説明                       |
|:---------|:------------------------------|:----------------------------------|
| `result` | 文字列                        | 値が`success`の場合、本文は成功した場合の応答を表しています。 |
| `count`  | 整数                       | 返された行の数。          |
| `rows`   | 流通量オブジェクトの配列 | XRP流通量の週次スナップショット。 |

各流通量オブジェクトのフィールドを次に示します。

| フィールド           | 値                  | 説明                       |
|:----------------|:-----------------------|:----------------------------------|
| `date`          | 文字列 - [タイムスタンプ][] | このスナップショットの時刻。        |
| `total`         | 文字列                 | 現存するXRPの合計。           |
| `undistributed` | 文字列                 | Ripple（企業）が保有するXRPの総額。 |
| `distributed`   | 文字列                 | Ripple以外が保有するXRPの総額。 |

#### 例

要求:

```
GET /v2/network/xrp_distribution
```

応答:

```
200 OK
{
 "result": "success",
 "count": 171,
 "rows": [
   {
     "date": "2016-04-10T00:00:00Z",
     "distributed": "34918644255.77274",
     "total": "99997725821.25714",
     "undistributed": "65079081565.4844"
   },
   ...
 ]
}
```



## Get Top Currencies
[[ソース]<br>](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/network/topCurrencies.js "Source")

XRP Ledgerの上位通貨を、ランクが高いものから順に返します。このランクは、トランザクションの額と件数、および一意の取引相手の数に基づいて決定します。デフォルトでは、現在の日付で終了する30日間ローリングウィンドウの結果が返されます。結果を取得する30日間ローリングウィンドウの最終日の日付を指定できます。_（新規: [v2.1.0][]）_


#### 要求フォーマット

<!-- MULTICODE_BLOCK_START -->

*最新*

```
GET /v2/network/top_currencies
```

*日付指定*

```
GET /v2/network/top_currencies/{date}
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](data-api-v2-tool.html#get-top-currencies)

このメソッドでは以下のURLパラメーターを使用します。

| フィールド  | 値                  | 説明                                |
|:-------|:-----------------------|:-------------------------------------------|
| `date` | 文字列 - ISO 8601の日付 | _（省略可）_ 照会する過去の日付。省略すると、利用可能な最新の日付が使用されます。 |

オプションで、以下のクエリーパラメーターを指定できます。

| フィールド    | 値   | 説明                                             |
|:---------|:--------|:--------------------------------------------------------|
| `limit`  | 整数 | ページあたりの最大結果件数。デフォルトは1000です。1000を超える値は指定できません。 |
| `format` | 文字列  | 返される結果のフォーマットは`csv`または`json`です。デフォルトは`json`です。 |

#### 応答フォーマット

成功した場合の応答では、HTTPコード**200 OK**と以下の内容のJSON本文が返されます。

| フィールド        | 値                         | 説明                   |
|:-------------|:------------------------------|:------------------------------|
| `result`     | 文字列                        | 値が`success`の場合は、成功した場合の応答であることを示します。 |
| `date`       | 文字列 - [タイムスタンプ][]        | このデータが測定された時点。  |
| `count`      | 整数                       | `currencies`フィールドに含まれているオブジェクトの数。 |
| `currencies` | 上位通貨オブジェクトの配列 | このデータサンプルの上位通貨。各メンバーは1つの通貨を通貨コードとイシュアーで表します。 |

各上位通貨オブジェクトのフィールドを次に示します。

| フィールド                 | 値                      | 説明             |
|:----------------------|:---------------------------|:------------------------|
| `currency`            | 文字列 - [通貨コード][] | このオブジェクトが表す通貨。 |
| `issuer`              | 文字列 - [アドレス][]       | この通貨を発行するXRP Ledgerアドレス。 |
| `avg_exchange_count`  | [文字列 - 数値][]        | 1日あたりの平均[取引](#取引オブジェクト)件数。 |
| `avg_exchange_volume` | [文字列 - 数値][]        | 1日あたりの平均取引量（XRPに正規化）。 |
| `avg_payment_count`   | [文字列 - 数値][]        | 1日あたりの平均[ペイメント](#ペイメントオブジェクト)件数。 |
| `avg_payment_volume`  | [文字列 - 数値][]        | 1日あたりの平均ペイメント取引量（XRPに正規化）。 |
| `issued_value`        | [文字列 - 数値][]        | このイシュアーが発行したこの通貨の合計額（XRPに正規化）。 |

#### 例

要求:

```
GET /v2/network/top_currencies/2016-04-14?limit=2
```

応答:

```
200 OK
{
 "result": "success",
 "date": "2016-04-14T00:00:00Z",
 "count": 2,
 "currencies": [
   {
     "avg_exchange_count": "8099.967741935484",
     "avg_exchange_volume": "3.5952068085531615E7",
     "avg_payment_count": "624.28125",
     "avg_payment_volume": "3910190.139488101",
     "issued_value": "1.5276205395328993E8",
     "currency": "CNY",
     "issuer": "rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y"
   },
   {
     "avg_exchange_count": "3003.2258064516127",
     "avg_exchange_volume": "3.430482029838605E7",
     "avg_payment_count": "257.4375",
     "avg_payment_volume": "501442.0789529095",
     "issued_value": "2.6289124450524995E8",
     "currency": "USD",
     "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
   }
 ]
}
```



## Get Top Markets
[[ソース]<br>](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/network/topMarkets.js "Source")

XRP Ledgerの上位マーケットを、ランクが高いものから順に返します。このランクは、取引の数と量、および参加取引相手の数に基づいて決定します。デフォルトでは、現在の日付で終わる30日間ローリングウィンドウにおける上位のマーケットが返されます。結果を取得する30日間ローリングウィンドウの最終日の日付を指定できます。_（新規: [v2.1.0][]）_

#### 要求フォーマット

<!-- MULTICODE_BLOCK_START -->

*最新*

```
GET /v2/network/top_markets
```

*日付指定*

```
GET /v2/network/top_markets/{date}
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](data-api-v2-tool.html#get-top-markets)

このメソッドでは以下のURLパラメーターを使用します。

| フィールド  | 値                  | 説明                                |
|:-------|:-----------------------|:-------------------------------------------|
| `date` | 文字列 - ISO 8601の日付 | _（省略可）_ 照会する過去の日付。省略すると、利用可能な最新の日付が使用されます。 |

オプションで、以下のクエリーパラメーターを指定できます。

| フィールド    | 値   | 説明                                             |
|:---------|:--------|:--------------------------------------------------------|
| `limit`  | 整数 | ページあたりの最大結果件数。デフォルトは1000です。1000を超える値は指定できません。 |
| `format` | 文字列  | 返される結果のフォーマットは`csv`または`json`です。デフォルトは`json`です。 |

#### 応答フォーマット

成功した場合の応答では、HTTPコード**200 OK**と以下の内容のJSON本文が返されます。

| フィールド     | 値                       | 説明                        |
|:----------|:----------------------------|:-----------------------------------|
| `result`  | 文字列                      | 値が`success`の場合は、成功した場合の応答であることを示します。 |
| `date`    | 文字列 - [タイムスタンプ][]      | このデータの計算対象であるローリングウィンドウの終了時刻。 |
| `count`   | 整数                     | `markets`フィールドに含まれている結果の数。 |
| `markets` | 上位マーケットオブジェクトの配列 | このデータサンプルの上位マーケット。各メンバーは通貨ペアを表します。 |

各上位マーケットオブジェクトのフィールドを次に示します。

| フィールド                | 値                      | 説明              |
|:---------------------|:---------------------------|:-------------------------|
| `base_currency`      | 文字列 - [通貨コード][] | このマーケットのベース通貨。 |
| `base_issuer`        | 文字列 - [アドレス][]       | （`base_currency`がXRPの場合は省略）ベース通貨を発行するXRP Ledgerアドレス。 |
| `counter_currency`   | 文字列 - [通貨コード][] | このマーケットのクオート通貨。 |
| `counter_issuer`     | 文字列 - [アドレス][]       | （`counter_currency`がXRPの場合は省略）クオート通貨を発行するXRP Ledgerアドレス。 |
| `avg_base_volume`    | 文字列                     | 1日あたりのベース通貨単位での平均取引量。 |
| `avg_counter_volume` | 文字列                     | 1日あたりのクオート通貨単位での平均取引量。 |
| `avg_exchange_count` | 文字列                     | 1日あたりの平均[取引](#取引オブジェクト)件数。 |
| `avg_volume`         | 文字列                     | 1日あたりの平均取引量（XRPに正規化）。 |

#### 例

要求:

```
GET /v2/network/top_markets/2015-12-31
```

応答:

```
200 OK
{
 "result": "success",
 "date": "2015-12-31T00:00:00Z",
 "count": 58,
 "markets": [
   {
     "avg_base_volume": "116180.98607935428",
     "avg_counter_volume": "1.6657039295476614E7",
     "avg_exchange_count": "1521.4603174603174",
     "avg_volume": "1.6657039295476614E7",
     "base_currency": "USD",
     "base_issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
     "counter_currency": "XRP"
   },
   {
     "avg_base_volume": "410510.0286920887",
     "avg_counter_volume": "9117398.719214212",
     "avg_exchange_count": "1902.1587301587301",
     "avg_volume": "9117398.719214212",
     "base_currency": "CNY",
     "base_issuer": "rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y",
     "counter_currency": "XRP"
   },
   ...
 ]
}
```



## Get Transaction Costs
[[ソース]<br>](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/network/getFees.js "Source")

レジャー、時間、または日ごとに[トランザクションコスト](transaction-cost.html)の統計情報を返します。このデータは、特定の間隔またはレジャーで支払われたトランザクションコストの最小値、最大値、および合計を示します。_（新規: [v2.2.0][]）_

#### 要求フォーマット

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/network/fees
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](data-api-v2-tool.html#get-transaction-costs)

オプションで、以下のクエリーパラメーターを指定できます。

| フィールド        | 値                  | 説明                          |
|:-------------|:-----------------------|:-------------------------------------|
| `start`      | 文字列 - [タイムスタンプ][] | 照会範囲の開始時刻。デフォルトでは、利用可能な最も古いデータから開始します。 |
| `end`        | 文字列 - [タイムスタンプ][] | 照会範囲の終了時刻。デフォルトでは、利用可能な最も新しいデータから開始します。 |
| `interval`   | 文字列                 | 収集間隔 - 有効な間隔は`ledger`、`hour`、`day`です。デフォルトは`ledger`です。 |
| `descending` | ブール値                | `true`の場合は、結果が最新のものから順にソートされます。デフォルトでは、結果が最も古いものから順にソートされます。 |
| `limit`      | 整数                | ページあたりの最大結果件数。デフォルトは200です。1000を超える値は指定できません。 |
| `marker`     | 文字列                 | 前に返された応答の[ページネーション](#ページネーション)キー。 |
| `format`     | 文字列                 | 返される結果のフォーマットは`csv`または`json`です。デフォルトは`json`です。 |

#### 応答フォーマット

成功した場合の応答では、HTTPコード**200 OK**と以下の内容のJSON本文が返されます。

| フィールド    | 値                        | 説明                        |
|:---------|:-----------------------------|:-----------------------------------|
| `result` | 文字列                       | 値が`success`の場合は、成功した場合の応答であることを示します。 |
| `marker` | 文字列                       | （省略される場合があります）[ページネーション](#ページネーション)マーカー。 |
| `count`  | 整数                      | `markets`フィールドに含まれている結果の数。 |
| `rows`   | 手数料サマリーオブジェクトの配列 | 各間隔のトランザクションコストの統計情報。 |

各手数料サマリーオブジェクトのフィールドを次に示します。

| フィールド          | 値                      | 説明                    |
|:---------------|:---------------------------|:-------------------------------|
| `avg`          | 数値                     | この間隔内に支払われたトランザクションコストの平均。 |
| `min`          | 数値                     | この間隔内に支払われたトランザクションコストの最小額。 |
| `max`          | 数値                     | この間隔内に支払われたトランザクションコストの最大額。 |
| `total`        | 数値                     | トランザクションコストにより消却されたXRPの合計。 |
| `tx_count`     | 数値                     | この間隔のトランザクションの数。 |
| `date`         | 文字列 - [タイムスタンプ][]     | この間隔の開始時刻（時間間隔）とこのレジャーの閉鎖時刻（`ledger`間隔）。 |
| `ledger_index` | 整数 - [レジャーインデックス][] | （`ledger`間隔の場合にのみ含まれます）このオブジェクトが表すレジャー。 |

#### 例

要求:

```
GET /v2/network/fees?interval=day&limit=3&descending=true
```

応答:

```
200 OK
{
 "result": "success",
 "marker": "day|20160603000000",
 "count": 3,
 "rows": [
   {
     "avg": 0.011829,
     "max": 15,
     "min": 0.01,
     "total": 6682.15335,
     "tx_count": 564918,
     "date": "2016-06-06T00:00:00Z"
   },
   {
     "avg": 0.011822,
     "max": 4.963071,
     "min": 0.01,
     "total": 5350.832025,
     "tx_count": 452609,
     "date": "2016-06-05T00:00:00Z"
   },
   {
     "avg": 0.012128,
     "max": 15,
     "min": 0.01,
     "total": 5405.126404,
     "tx_count": 445689,
     "date": "2016-06-04T00:00:00Z"
   }
 ]
}
```




## Get Fee Stats
[[ソース]<br>](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/network/getFeeStats.js "Source")

`rippled`の[`fee`コマンド](fee.html)から導出されたメトリクスのスナップショットを返します。_（新規: [v2.3.2][]）_

#### 要求フォーマット

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/network/fee_stats
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](data-api-v2-tool.html#get-fee-stats)

オプションで、以下のクエリーパラメーターを指定できます。

| フィールド        | 値                  | 説明                          |
|:-------------|:-----------------------|:-------------------------------------|
| `start`      | 文字列 - [タイムスタンプ][] | 照会範囲の開始時刻。デフォルトでは、利用可能な最も古いデータから開始します。 |
| `end`        | 文字列 - [タイムスタンプ][] | 照会範囲の終了時刻。デフォルトでは、利用可能な最新データで終了します。 |
| `interval`   | 文字列                 | スナップショットの間隔。有効な間隔は`minute`、`hour`、`day`です。デフォルトの間隔は5秒です。 |
| `descending` | ブール値                | `true`の場合は、結果が最新のものから順にソートされます。デフォルトでは、結果が最も古いものから順にソートされます。 |
| `limit`      | 整数                | ページあたりの最大結果件数。デフォルトは200です。1000を超える値は指定できません。 |
| `marker`     | 文字列                 | 前に返された応答の[ページネーション](#ページネーション)キー。 |
| `format`     | 文字列                 | 返される結果のフォーマットは`csv`または`json`です。デフォルトは`json`です。 |

#### 応答フォーマット

成功した場合の応答では、HTTPコード**200 OK**と以下の内容のJSON本文が返されます。

| フィールド    | 値                        | 説明                        |
|:---------|:-----------------------------|:-----------------------------------|
| `result` | 文字列                       | 値が`success`の場合は、成功した場合の応答であることを示します。 |
| `marker` | 文字列                       | （省略される場合があります）[ページネーション](#ページネーション)マーカー。 |
| `count`  | 整数                      | `markets`フィールドに含まれている結果の数。 |
| `rows`   | 手数料サマリーオブジェクトの配列 | 各間隔のトランザクションコストの統計情報。 |

各**手数料サマリーオブジェクト**のフィールドを次に示します。

| フィールド                  | 値                  | 説明                |
|:-----------------------|:-----------------------|:---------------------------|
| `date`                 | 文字列 - [タイムスタンプ][] | スナップショットの取得日時。 |
| `current_ledger_size`  | 数値                 | 指定時刻での現行レジャーのトランザクション数。 |
| `expected_ledger_size` | 数値                 | 指定時刻に次のレジャーで予想されるトランザクションの数。 |
| `current_queue_size`   | 数値                 | 将来のレジャーに追加されるようキューに入れられているトランザクションの数。 |
| `pct_max_queue_size`   | 数値                 | 現在のキューサイズ（最大キューサイズに対する割合で表されます）。 |
| `median_fee`           | 数値                 | 現行レジャーのトランザクションの手数料の中央値。 |
| `minimum_fee`          | 数値                 | 任意のレジャーに追加する際の最小手数料。 |
| `open_ledger_fee`      | 数値                 | スナップショットの取得時点でオープンしていたレジャーに追加するコストのしきい値。 |

#### 例

要求:

```
GET /v2/network/fee_stats
```

応答:

```
200 OK
{
 result: "success",
 marker: "raw|20160701032100",
 count: 200,
 rows: [
   {
     current_ledger_size: 39,
     current_queue_size: 0,
     date: "2016-07-01T00:00:00Z",
     expected_ledger_size: 59,
     median_fee: 0.005,
     minimum_fee: 0.00001,
     open_ledger_fee: 0.00001,
     pct_max_queue_size: 0
   },
   {
     current_ledger_size: 33,
     current_queue_size: 0,
     date: "2016-07-01T00:01:00Z",
     expected_ledger_size: 59,
     median_fee: 0.00543,
     minimum_fee: 0.00001,
     open_ledger_fee: 0.00001,
     pct_max_queue_size: 0
   },
   ...
 ]
}
```




## Get Topology
[[ソース]<br>](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/network/getTopology.js "Source")

既知の`rippled`サーバーと、これらのサーバー間のピアツーピア接続を取得します。_（新規: [v2.2.0][]）_


#### 要求フォーマット

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/network/topology
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](data-api-v2-tool.html#get-topology)

オプションで、以下のクエリーパラメーターを指定できます。

| フィールド     | 値                  | 説明                             |
|:----------|:-----------------------|:----------------------------------------|
| `date`    | 文字列 - [タイムスタンプ][] | 過去のクエリーの日時。デフォルトでは、利用可能な最新のデータが使用されます。 |
| `verbose` | ブール値                | `true`の場合、各サーバーに関する追加の詳細情報が含まれます（使用可能な場合）。デフォルトは`false`です。 |

#### 応答フォーマット

成功した場合の応答では、HTTPコード**200 OK**と以下の内容のJSON本文が返されます。

| フィールド        | 値                       | 説明                     |
|:-------------|:----------------------------|:--------------------------------|
| `result`     | 文字列                      | 値が`success`の場合、本文は成功した場合の応答を表しています。 |
| `date`       | 文字列 - [タイムスタンプ][]      | この測定の時刻。   |
| `node_count` | 整数                     | トポロジー内の`rippled`サーバーの数。 |
| `link_count` | 整数                     | トポロジー内のリンクの数。 |
| `nodes`      | [サーバーオブジェクト][]の配列 | ピアツーピアネットワーク内の`rippled`サーバーの詳細。 |
| `links`      | [リンクオブジェクト][]の配列   | ピアツーピアネットワーク内の`rippled`サーバー間のネットワーク接続。 |

#### 例

要求:

```
GET /v2/network/topology
```

応答:

```
200 OK
{
 "result": "success",
 "date": "2016-06-06T23:51:04Z",
 "node_count": 115,
 "link_count": 1913,
 "nodes": [
   {
     "node_public_key": "n94fDXS3ta92gRSi7DKngh47S7Rg4z1FuNsahvbiakFEg51dLeVa",
     "version": "rippled-0.31.0-rc1",
     "uptime": 266431,
     "inbound_count": 24,
     "last_updated": "2016-06-03T21:50:57Z"
   },
   {
     "node_public_key": "n94h5KNspwUGLaGcdHGxruYNmExWHjPkLcMvwsNrivR9czRp6Lor",
     "ip": "104.247.221.178",
     "port": 51235,
     "version": "rippled-0.31.0",
     "uptime": 608382,
     "inbound_count": 10,
     "outbound_count": 11,
     "city": "Atlanta",
     "country": "United States",
     "country_code": "US",
     "isp": "QuickPacket, LLC",
     "last_updated": "2016-05-28T06:29:43Z",
     "lat": "-84.3846",
     "long": "33.8379",
     "postal_code": "30305",
     "region": "Georgia",
     "region_code": "GA",
     "timezone": "America/New_York"
   },

   ...
 ],
 "links": [
   {
     "source": "n94Extku8HiQVY8fcgxeot4bY7JqK2pNYfmdnhgf6UbcmgucHFY8",
     "target": "n9KcFAX2bCuwF4vGF8gZZcpQQ6nyqm44e5TUygb3zvdZEpiJE5As"
   },
   {
     "source": "n94Extku8HiQVY8fcgxeot4bY7JqK2pNYfmdnhgf6UbcmgucHFY8",
     "target": "n9LGAj7PjvfTmEGQ75JaRKba6GQmVwFCnJTSHgX2HDXzxm6d2JpM"
   },

   ...
 ]
}
```



## Get Topology Nodes
[[ソース]<br>](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/network/getNodes.js "Source")

既知の`rippled`ノードを取得します。（これは[Get Topologyメソッド](#get-topology)で返されるデータのサブセットです。）_（新規: [v2.2.0][]）_

#### 要求フォーマット

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/network/topology/nodes
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](data-api-v2-tool.html#get-topology-nodes)

オプションで、以下のクエリーパラメーターを指定できます。

| フィールド     | 値                  | 説明                             |
|:----------|:-----------------------|:----------------------------------------|
| `date`    | 文字列 - [タイムスタンプ][] | 過去のクエリーの日時。デフォルトは最新データです。 |
| `verbose` | ブール値                | `true`の場合は、各サーバーのすべての詳細が返されます。デフォルトは`false`です。 |
| `format`  | 文字列                 | 返される結果のフォーマットは`csv`または`json`です。デフォルトは`json`です。 |

#### 応答フォーマット

成功した場合の応答では、HTTPコード**200 OK**と以下の内容のJSON本文が返されます。

| フィールド    | 値                       | 説明                         |
|:---------|:----------------------------|:------------------------------------|
| `result` | 文字列                      | 値が`success`の場合、本文は成功した場合の応答を表しています。 |
| `date`   | 文字列 - [タイムスタンプ][]      | このデータが測定された時点。    |
| `count`  | 整数                     | 記述される`rippled`サーバーの数。 |
| `nodes`  | [サーバーオブジェクト][]の配列 | トポロジー内の`rippled`サーバーの詳細。 |

#### 例

要求:

```
GET /v2/network/topology/nodes
```

応答:

```
200 OK
{
 "result": "success",
 "date": "2016-06-08T00:36:53Z",
 "count": 116,
 "nodes": [
   {
     "node_public_key": "n94BuARkPiYLrMuAVZqMQFhTAGpo12dqUPiH3yrzEnhaEcXfLAnV",
     "version": "rippled-0.30.1",
     "uptime": 122424,
     "inbound_count": 10,
     "last_updated": "2016-06-06T14:36:52Z"
   },
   {
     "node_public_key": "n94h5KNspwUGLaGcdHGxruYNmExWHjPkLcMvwsNrivR9czRp6Lor",
     "ip": "104.247.221.178",
     "port": 51235,
     "version": "rippled-0.31.2",
     "uptime": 38649,
     "inbound_count": 10,
     "outbound_count": 11,
     "city": "Atlanta",
     "country": "United States",
     "country_code": "US",
     "isp": "QuickPacket, LLC",
     "last_updated": "2016-06-07T13:53:12Z",
     "lat": "-84.3846",
     "long": "33.8379",
     "postal_code": "30305",
     "region": "Georgia",
     "region_code": "GA",
     "timezone": "America/New_York"
   },

   ...

 ]
}
```



## Get Topology Node
[[ソース]<br>](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/network/getNodes.js "Source")

1つの`rippled`サーバーに関する情報を、そのバリデータの公開鍵ではなく[ノードの公開鍵](#公開鍵)に基づいて取得します。_（新規: [v2.2.0][]）_

#### 要求フォーマット

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/network/topology/nodes/{pubkey}
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](data-api-v2-tool.html#get-topology-node)

このメソッドには以下のURLパラメーターを指定する必要があります。

| フィールド    | 値                           | 説明                     |
|:---------|:--------------------------------|:--------------------------------|
| `pubkey` | 文字列 - Base-58 [公開鍵][] | 検索するサーバーのノードの公開鍵。 |

このメソッドはクエリーパラメーターをとりません。

#### 応答フォーマット

成功した場合の応答では、HTTPコード**200 OK**と、以下の追加フィールドが含まれる **[サーバーオブジェクト][]** を含むJSON本文が返されます。

| フィールド    | 値  | 説明                                              |
|:---------|:-------|:---------------------------------------------------------|
| `result` | 文字列 | 値が`success`の場合は、成功した場合の応答であることを示します。 |

#### 例

要求:

```
GET /v2/network/topology/nodes/n94h5KNspwUGLaGcdHGxruYNmExWHjPkLcMvwsNrivR9czRp6Lor
```

応答:

```
200 OK
{
 "node_public_key": "n94h5KNspwUGLaGcdHGxruYNmExWHjPkLcMvwsNrivR9czRp6Lor",
 "ip": "104.247.221.178",
 "port": 51235,
 "version": "rippled-0.31.2",
 "uptime": 43342,
 "inbound_count": 10,
 "outbound_count": 11,
 "city": "Atlanta",
 "country": "United States",
 "country_code": "US",
 "isp": "QuickPacket, LLC",
 "last_updated": "2016-06-07T13:53:12Z",
 "lat": "-84.3846",
 "long": "33.8379",
 "postal_code": "30305",
 "region": "Georgia",
 "region_code": "GA",
 "timezone": "America/New_York",
 "result": "success"
}
```



## Get Topology Links
[[ソース]<br>](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/network/getLinks.js "Source")

`rippled`サーバー間のピアツーピア接続に関する情報を取得します。（これは[Get Topologyメソッド](#get-topology)で返されるデータのサブセットです。）_（新規: [v2.2.0][]）_

#### 要求フォーマット

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/network/topology/links
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](data-api-v2-tool.html#get-topology-links)

オプションで、以下のクエリーパラメーターを指定できます。

| フィールド    | 値                  | 説明                              |
|:---------|:-----------------------|:-----------------------------------------|
| `date`   | 文字列 - [タイムスタンプ][] | 過去のクエリーの日時。デフォルトは、使用可能な最新データです。 |
| `format` | 文字列                 | 返される結果のフォーマットは`csv`または`json`です。デフォルトは`json`です。 |

#### 応答フォーマット

成功した場合の応答では、HTTPコード**200 OK**と以下の内容のJSON本文が返されます。

| フィールド    | 値                     | 説明                           |
|:---------|:--------------------------|:--------------------------------------|
| `result` | 文字列                    | 値が`success`の場合、本文は成功した場合の応答を表しています。 |
| `date`   | 文字列 - [タイムスタンプ][]    | このデータが測定された時点。          |
| `count`  | 整数                   | 返されたリンクの数。             |
| `links`  | [リンクオブジェクト][]の配列 | `rippled`サーバー間のリンク。      |

#### 例

要求:

```
GET /v2/network/topology/links
```

応答:

```
200 OK
{
 result: "success",
 date: "2016-03-21T16:38:52Z",
 count: 1632,
 links: [
   {
     source: "n94Extku8HiQVY8fcgxeot4bY7JqK2pNYfmdnhgf6UbcmgucHFY8",
     target: "n9JccBLfrDJBLBF2X5N7bUW8251riCwSf9e3VQ3P5fK4gYr5LBu4"
   },
   ...
 ]
}
```



## Get Validator
[[ソース]<br>](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/network/getValidators.js "Source")

[コンセンサスネットワーク](consensus.html)内の1つのバリデータに関する詳細を取得します。_（更新: [v2.4.0][]）_


#### 要求フォーマット

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/network/validators/{pubkey}
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](data-api-v2-tool.html#get-validator)

このメソッドには以下のURLパラメーターを指定する必要があります。

| フィールド    | 値                           | 説明           |
|:---------|:--------------------------------|:----------------------|
| `pubkey` | 文字列 - Base-58 [公開鍵][] | バリデータの公開鍵。 |

オプションで、以下のクエリーパラメーターを指定できます。

| フィールド    | 値  | 説明                                              |
|:---------|:-------|:---------------------------------------------------------|
| `format` | 文字列 | 返される結果のフォーマットは`csv`または`json`です。デフォルトは`json`です。 |

#### 応答フォーマット

成功した場合の応答では、HTTPコード**200 OK**と以下の内容のJSON本文が返されます。

| フィールド                   | 値                           | 説明      |
|:------------------------|:--------------------------------|:-----------------|
| `result`                | 文字列                          | 値が`success`の場合、本文は成功した場合の応答を表しています。 |
| `validation_public_key` | 文字列 - Base-58 [公開鍵][] | このバリデータのバリデータ公開鍵。 |
| `domain`                | 文字列                          | （省略される場合があります）このバリデータに関連付けられているDNSドメイン。 |
| `chain`                 | 文字列                          | このバリデータが現在フォローしているレジャーハッシュチェーン。値が`main`の場合はメインネットワークを示し、`altnet`の場合はXRP Test Networkを示します。その他のフォークの名前は`chain.{NUMBER}`で、`{NUMBER}`は各フォークの一意の番号です。 |
| `unl`                   | ブール値                            | Trueの場合、バリデータはレジャーチェーンの推奨UNLの一部です。 |
| `current_index`         | 数値                          | 最新の検証済みレジャーのレジャーインデックス。 |
| `partial`               | ブール値                            | Trueの場合、最新の検証は部分的な検証です。 |
| `agreement_1h`          | 合意オブジェクト                | 直近1時間の合意の状況を含むオブジェクト。 |
| `agreement_24h`         | 合意オブジェクト                | 直近24時間の合意の状況を含むオブジェクト。 |

#### 合意オブジェクト

| フィールド                   | 値                           | 説明      |
|:------------------------|:--------------------------------|:-----------------|
| `score`                 | 文字列                          | フォロー対象のレジャーチェーンとの合意のスコア。 |
| `missed`                | 整数                         | 当該期間内に検証されなかったレジャーの数。 |
| `total`                 | 整数                         | 当該期間内に検証されたレジャーの数。 |
| `incomplete`            | ブール値                            | Trueの場合は、当該期間全体のデータはカバーされていません。 |

#### 例

要求:

```
GET /v2/network/validators/nHBidG3pZK11zQD6kpNDoAhDxH6WLGui6ZxSbUx7LSqLHsgzMPec
```

応答:

```
200 OK
{
 "validation_public_key": "nHBidG3pZK11zQD6kpNDoAhDxH6WLGui6ZxSbUx7LSqLHsgzMPec",
 "domain": "bitso.com",
 "chain": "main",
 "current_index": 42279525,
 "agreement_1h": {
   "missed": 0,
   "total": 981,
   "score": "1.0000",
   "incomplete": false
 },
 "agreement_24h": {
   "missed": 0,
   "total": 23519,
   "score": "1.0000",
   "incomplete": false
 },
 "partial": false,
 "unl": true,
 "result": "success"
}
```



## Get Validators
[[ソース]<br>](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/network/getValidators.js "Source")

直近24時間にアクティブであった既知のバリデータのリストを取得します。_（更新: [v2.4.0][]）_


#### 要求フォーマット

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/network/validators
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](data-api-v2-tool.html#get-validators)

オプションで、以下のクエリーパラメーターを指定できます。

| フィールド    | 値  | 説明                                              |
|:---------|:-------|:---------------------------------------------------------|
| `format` | 文字列 | 返される結果のフォーマットは`csv`または`json`です。デフォルトは`json`です。 |

#### 応答フォーマット

成功した場合の応答では、HTTPコード**200 OK**と以下の内容のJSON本文が返されます。

| フィールド                   | 値                           | 説明      |
|:------------------------|:--------------------------------|:-----------------|
| `result`                | 文字列                          | 値が`success`の場合、本文は成功した場合の応答を表しています。 |
| `count`                 | 整数                         | 返されたバリデータの数。 |
| `validators`            | [バリデータオブジェクト][]の配列  | 直近24時間にアクティブであったバリデータのリスト。 |

#### バリデータオブジェクト
[バリデータオブジェクト]: #バリデータオブジェクト

| フィールド                   | 値                           | 説明      |
|:------------------------|:--------------------------------|:-----------------|
| `validation_public_key` | 文字列 - Base-58 [公開鍵][] | このバリデータのバリデータ公開鍵。 |
| `domain`                | 文字列                          | （省略される場合があります）このバリデータに関連付けられているDNSドメイン。 |
| `chain`                 | 文字列                          | このバリデータが現在フォローしているレジャーハッシュチェーン。値が`main`の場合はメインネットワークを示し、`altnet`の場合はXRP Test Networkを示します。その他のフォークの名前は`chain.{NUMBER}`で、`{NUMBER}`は各フォークの一意の番号です。 |
| `unl`                   | ブール値                            | Trueの場合、バリデータはレジャーチェーンの推奨UNLの一部です。 |
| `current_index`         | 数値                          | 最新の検証済みレジャーのレジャーインデックス。 |
| `partial`               | ブール値                            | Trueの場合、最新の検証は部分的な検証です。 |
| `agreement_1h`          | 合意オブジェクト                | 直近1時間の合意の状況を含むオブジェクト。 |
| `agreement_24h`        | 合意オブジェクト                | 直近24時間の合意の状況を含むオブジェクト。 |

#### 合意オブジェクト

| フィールド                   | 値                           | 説明      |
|:------------------------|:--------------------------------|:-----------------|
| `score`                 | 文字列                          | フォロー対象のレジャーチェーンとの合意のスコア。 |
| `missed`                | 整数                         | 当該期間内に検証されなかったレジャーの数。 |
| `total`                 | 整数                         | 当該期間内に検証されたレジャーの数。 |
| `incomplete`            | ブール値                            | Trueの場合は、当該期間全体のデータはカバーされていません。 |

#### 例

要求:

```
GET /v2/network/validators/
```

応答:

```
200 OK
{
 "result": "success",
 "count": 141,
 "validators": [
   {
     "validation_public_key": "nHBidG3pZK11zQD6kpNDoAhDxH6WLGui6ZxSbUx7LSqLHsgzMPec",
     "domain: "bitso.com",
     "chain": "main",
     "current_index": 42281151,
     "agreement_1h": {
       "missed": 0,
       "total": 1029,
       "score": "1.0000",
       "incomplete": false
     },
     "agreement_24h": {
       "missed": 0,
       "total": 23585,
       "score": "1.0000",
       "incomplete": false
     },
     "partial": false,
     "unl": true
   },
   {
     "validation_public_key": "nHUStq4qu3NXaL6T42wbtpR8mare8gWMVYrUzek227c6QeUn6QGN",
     "domain": "blockchain.korea.ac.kr",
     "chain": "main",
     "current_index": 42860792,
     "agreement_1h": {
       "missed": 0,
       "total": 995,
       "score": "1.0000",
       "incomplete": false
     },
     "agreement_24h": {
       "missed": 0,
       "total": 23478,
       "score": "1.0000",
       "incomplete": false
     },
     "partial": false,
     "unl": true
   },

   ...
 ]
}
```



## Get Validator Manifests
[[ソース]<br>](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/network/getManifests.js "Source")

指定されたバリデータにより署名されたマニフェストを取得します。（マニフェストは _サブキー認証_ とも呼ばれ、バリデータが提案と検証の署名に使用する一時的なキーを指します。）_（新規: [v2.3.7][]）_

**注記:** Data APIは、すべてのマニフェストを網羅する包括的な記録を持っていません。応答には、Data APIに記録されているデータのみが含まれています。

#### 要求フォーマット

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/network/validators/{pubkey}/manifests
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](data-api-v2-tool.html#get-validator-manifests)

このメソッドには以下のURLパラメーターを指定する必要があります。

| フィールド     | 値                           | 説明           |
|:----------|:--------------------------------|:----------------------|
| `pubkey`  | 文字列 - Base-58 [公開鍵][] | バリデータの公開鍵。 |

オプションで、以下のクエリーパラメーターを指定できます。

| フィールド    | 値   | 説明                                             |
|:---------|:--------|:--------------------------------------------------------|
| `limit`  | 整数 | ページあたりの最大結果件数。デフォルトは200です。1000を超える値は指定できません。 |
| `marker` | 文字列  | 前に返された応答の[ページネーション](#ページネーション)キー。 |
| `format` | 文字列  | 返される結果のフォーマットは`csv`または`json`です。デフォルトは`json`です。 |

#### 応答フォーマット

成功した場合の応答では、HTTPコード**200 OK**と以下の内容のJSON本文が返されます。

| フィールド       | 値                         | 説明                    |
|:------------|:------------------------------|:-------------------------------|
| `result`    | 文字列                        | 値が`success`の場合、本文は成功した場合の応答を表しています。 |
| `count`     | 整数                       | 返されたマニフェストの数。  |
| `marker`    | 文字列                        | （省略される場合があります）[ページネーション](#ページネーション)マーカー。 |
| `manifests` | [マニフェストオブジェクト][]の配列 | 要求されたマニフェスト。       |

#### マニフェストオブジェクト
[マニフェストオブジェクト]: #マニフェストオブジェクト

各マニフェストオブジェクトのフィールドを次に示します。

| フィールド                  | 値                           | 説明       |
|:-----------------------|:--------------------------------|:------------------|
| `count`                | 数値                          | Data APIがこのマニフェストを参照した回数。この数値が小さいほど、マニフェストが新しいものであることを意味します。 |
| `ephemeral_public_key` | 文字列 - Base-58 [公開鍵][] | このマニフェストでエンコードされているこのバリデータの一時公開鍵。 |
| `first_datetime`       | 文字列 - [タイムスタンプ][]          | Data APIがこのマニフェストを最初に参照した時刻。 |
| `last_datetime`        | 文字列 - [タイムスタンプ][]          | Data APIがこのマニフェストを最後に参照した時刻。 |
| `master_public_key`    | 文字列 - Base-58 [公開鍵][] | このバリデータを識別するマスター公開鍵。 |
| `master_signature`     | 文字列 - 16進数            | このマニフェストを承認するバリデータのマスターキーの署名。 |
| `sequence`             | 数値                          | このマニフェストのシーケンス番号。大きなシーケンス番号のマニフェストは古いマニフェストを置き換え、一時キーをローテーションします。 |
| `signature`            | 文字列 - 16進数            | このマニフェストにより承認された一時キーによる署名。 |

#### 例

要求:

```
GET /v2/network/validator/nHDEmQKb2nbcewdQ1fqCTGcPTcePhJ2Rh6MRftsCaf6UNRQLv7pB/manifests
```

応答:

```
200 OK
{
 "result": "success",
 "count": 2,
 "manifests": [
   {
     "count": 1,
     "ephemeral_public_key": "nHUvPMeNsrwdJd7d65eaYGkKx6bPEcxJGudjVDqwCybtEfrSUE8w",
     "first_datetime": "2018-09-06T20:20:08.353Z",
     "last_datetime": "2018-09-06T20:20:08.353Z",
     "master_public_key": "nHDEmQKb2nbcewdQ1fqCTGcPTcePhJ2Rh6MRftsCaf6UNRQLv7pB",
     "master_signature":
       "D8E78AD2C10ADA5A91D673C2EA66045926D3ED3D4C77DE4350AAA076379F69B8D0EC492A626EA9228964F694EED9EC63394D051001BA432EC57F2B6031204806",
     "sequence": "1",
     "signature":
       "C794C3D1159932FF8EE7360074E7D17CB59F6646B227EF35D439892C00832648C46FD1958714E153AF4BD0540A7B27011B7F58D357B68B87DCBF5CA81874480C"
   },
   {
     "count": 1,
     "ephemeral_public_key": "n9M7mktkbZCnKWa41LFkZsfXemBGdYsFT6fqJBXa4xupV8X8px7W",
     "first_datetime": "2018-09-06T20:20:08.357Z",
     "last_datetime": "2018-09-06T20:20:08.357Z",
     "master_public_key": "nHDEmQKb2nbcewdQ1fqCTGcPTcePhJ2Rh6MRftsCaf6UNRQLv7pB",
     "master_signature":
       "F7ECCB90F84ED3FC5E0DE1A6B0B7E835A8D2A94C8E985A74932DE30CD2EDCB46936FD14C39A5AA1BB3583CF888C869167979FEE068C6C34B9B63AB922850090E",
     "sequence": "2",
     "signature":
       "3044022055ED7EFF1245DE21D3C28C57D19301291F0D617CA3A6D3D4CFDF8692D9E0E68502200276215BA986BA61834E0AC71E8590706C851B8F55F0B80A44EECE868F71415F"
   }
 ]
}
```


## Get Single Validator Reports
[[ソース]<br>](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/network/getValidatorReports.js "Source")

24時間間隔で1つのバリデータの検証投票の状況を取得します。_（更新: [v2.4.0][]）_

#### 要求フォーマット

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/network/validators/{pubkey}/reports
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](data-api-v2-tool.html#get-single-validator-reports)

このメソッドには以下のURLパラメーターを指定する必要があります。

| フィールド    | 値  | 説明           |
|:---------|:-------|:----------------------|
| `pubkey` | 文字列 | バリデータの公開鍵。 |

オプションで、以下のクエリーパラメーターを指定できます。

| フィールド    | 値                  | 説明                              |
|:---------|:-----------------------|:-----------------------------------------|
| `start`      | 文字列 - [タイムスタンプ][] | 過去のクエリーの開始日時。デフォルトでは、開始日は現在の日付の200日前です。 |
| `end`        | 文字列 - [タイムスタンプ][] | 過去のクエリーの終了日時。デフォルトでは、使用可能な最新データで終了します。 |
| `descending` | ブール値                   | 結果を逆の順序で返します。 |
| `format`     | 文字列                 | 返される結果のフォーマットは`csv`または`json`です。デフォルトは`json`です。 |

#### 応答フォーマット

成功した場合の応答では、HTTPコード**200 OK**と以下の内容のJSON本文が返されます。

| フィールド        | 値                                    | 説明        |
|:-------------|:-----------------------------------------|:-------------------|
| `result`     | 文字列                                   | 値が`success`の場合、本文は成功した場合の応答を表しています。 |
| `count`      | 整数                                  | 返されたバリデータの日次レポートの数。 |
| `reports`    | [シングルバリデータレポートオブジェクト][]の配列。 | 当該日の各バリデータのパフォーマンスに関する日次レポート。 |

##### シングルバリデータレポートオブジェクト
[シングルバリデータレポートオブジェクト]: #シングルバリデータレポートオブジェクト

各シングルバリデータレポートオブジェクトは、特定日のバリデータのパフォーマンスを表し、以下のフィールドが含まれています。

| フィールド                | 値                           | 説明                  |
|:---------------------|:--------------------------------|:-----------------------------|
| `validation_public_key` | 文字列 - Base-58 [公開鍵][] | バリデータの公開鍵。 |
| `date`               | 文字列 - [タイムスタンプ][]          | このオブジェクトが表す日付の開始時刻。 |
| `chain`              | 文字列                          | このバリデータが現在フォローしているレジャーハッシュチェーン。値が`main`の場合はメインネットワークを示し、`altnet`の場合はXRP Test Networkを示します。その他のフォークの名前は`chain.{NUMBER}`で、`{NUMBER}`は各フォークの一意の番号です。 |
| `score`              | 文字列                          | フォロー対象のレジャーチェーンとの合意のスコア。 |
| `missed`             | 整数                         | 当該期間内に検証されなかったレジャーの数。 |
| `total`              | 整数                         | 当該期間内に検証されたレジャーの数。 |
| `incomplete`         | ブール値                            | Trueの場合は、当該期間全体のデータはカバーされていません。 |

#### 例

要求:

```
GET /v2/network/validators/n949f75evCHwgyP4fPVgaHqNHxUVN15PsJEZ3B3HnXPcPjcZAoy7/reports
```

応答:

```
200 OK
{
 "result": "success",
 "count": 198,
 "reports": [
   {
     "date": "2015-11-20T00:00:00Z",
     "total_ledgers": 19601,
     "main_net_agreement": "1.0",
     "main_net_ledgers": 19601,
     "alt_net_agreement": "0.0",
     "alt_net_ledgers": 0,
     "other_ledgers": 0
   },
   {
     "date": "2015-11-21T00:00:00Z",
     "total_ledgers": 19876,
     "main_net_agreement": "1.0",
     "main_net_ledgers": 19876,
     "alt_net_agreement": "0.0",
     "alt_net_ledgers": 0,
     "other_ledgers": 0
   },

   ...
 ]
}
```


## Get Daily Validator Reports
[[ソース]<br>](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/network/getValidatorReports.js "Source")

24時間ですべての既知のバリデータの検証投票の状況とバリデータ情報を取得します。

#### 要求フォーマット

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/network/validator_reports
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](data-api-v2-tool.html#get-daily-validator-reports)

オプションで、以下のクエリーパラメーターを指定できます。

| フィールド    | 値                  | 説明                              |
|:---------|:-----------------------|:-----------------------------------------|
| `date`   | 文字列 - [タイムスタンプ][] | 照会する日時。デフォルトでは、利用可能な最新のデータが使用されます。 |
| `format` | 文字列                 | 返される結果のフォーマットは`csv`または`json`です。デフォルトは`json`です。 |

#### 応答フォーマット

成功した場合の応答では、HTTPコード**200 OK**と以下の内容のJSON本文が返されます。

| フィールド     | 値                                   | 説明            |
|:----------|:----------------------------------------|:-----------------------|
| `result`  | 文字列                                  | 値が`success`の場合、本文は成功した場合の応答を表しています。 |
| `count`   | 整数                                 | 返されたレポートの数。 |
| `reports` | [日次バリデータレポートオブジェクト][]の配列。 | この期間中にアクティブであった各バリデータのバリデータパフォーマンスの日次サマリー。 |

#### 日次バリデータレポートオブジェクト
[日次バリデータレポートオブジェクト]: #日次バリデータレポートオブジェクト

`reports`配列の各メンバーは、当該日のバリデータのパフォーマンスを表し、以下のフィールドが含まれています。

| フィールド                | 値                           | 説明                  |
|:---------------------|:--------------------------------|:-----------------------------|
| `validation_public_key` | 文字列 - Base-58 [公開鍵][] | バリデータの公開鍵。 |
| `date`               | 文字列 - [タイムスタンプ][]          | このオブジェクトが表す日付の開始時刻。 |
| `chain`              | 文字列                          | このバリデータが現在フォローしているレジャーハッシュチェーン。値が`main`の場合はメインネットワークを示し、`altnet`の場合はXRP Test Networkを示します。その他のフォークの名前は`chain.{NUMBER}`で、`{NUMBER}`は各フォークの一意の番号です。 |
| `score`              | 文字列                          | フォロー対象のレジャーチェーンとの合意のスコア。 |
| `missed`             | 整数                         | 当該期間内に検証されなかったレジャーの数。 |
| `total`              | 整数                         | 当該期間内に検証されたレジャーの数。 |
| `incomplete`         | ブール値 - 省略可                 | Trueの場合は、当該期間全体のデータはカバーされていません。 |

#### 例

要求:

```
GET /v2/network/validator_reports
```

応答:

```
200 OK
{
 "result": "success",
 "count": 27,
 "reports": [
   {
     "validation_public_key": "n9J2N3FfiUFC4rBX5UBob8JzgDGsYqUou1cwKdsaymS44mZDfnYe",
     "date": "2018-10-15T00:00:00Z",
     "chain": "main",
     "score": "0.6909",
     "total": "16127",
     "missed": "7216"
   }
 ]
}
```


## Get rippled Versions
[[ソース]<br>](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/network/getVersions.js "Source")

公式Ripple Yumリポジトリから入手可能な`rippled`の最新バージョンを報告します。_（新規: [v2.3.0][]）_

#### 要求フォーマット

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/network/rippled_versions
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](data-api-v2-tool.html#get-rippled-versions)


#### 応答フォーマット

成功した場合の応答では、HTTPコード**200 OK**と以下の内容のJSON本文が返されます。

| フィールド    | 値                    | 説明                            |
|:---------|:-------------------------|:---------------------------------------|
| `result` | 文字列                   | 値が`success`の場合、本文は成功した場合の応答を表しています。 |
| `count`  | 整数                  | 返された行の数。               |
| `rows`   | バージョンオブジェクトの配列 | 各リポジトリの最新`rippled`バージョンの説明。 |

各バージョンオブジェクトのフィールドを次に示します。

| フィールド     | 値                  | 説明                             |
|:----------|:-----------------------|:----------------------------------------|
| `date`    | 文字列 - [タイムスタンプ][] | この`rippled`バージョンのリリース日。 |
| `repo`    | 文字列                 | この`rippled`が入手可能なYumリポジトリ。`stable`リポジトリに最新の本番環境バージョンがあります。その他のバージョンは開発テスト用です。 |
| `version` | 文字列                 | この`rippled`バージョンを示すバージョン文字列。 |

#### 例

要求:

```
GET /v2/network/rippled_versions
```

応答:

```
200 OK
{
 "result": "success",
 "count": 3,
 "rows": [
   {
     "date": "2016-06-24T00:00:00Z",
     "repo": "nightly",
     "version": "0.32.0-rc2"
   },
   {
     "date": "2016-06-24T00:00:00Z",
     "repo": "stable",
     "version": "0.32.0"
   },
   {
     "date": "2016-06-24T00:00:00Z",
     "repo": "unstable",
     "version": "0.32.0-rc1"
   }
 ]
}
```



## Get All Gateways
[[ソース]<br>](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/gateways.js "Source")

[既知のゲートウェイ](https://github.com/ripple/rippled-historical-database/blob/v2.0.4/api/gateways/gateways.json)に関する情報を取得します。_（新規: [v2.0.4][]）_

#### 要求フォーマット

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/gateways/
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](data-api-v2-tool.html#get-all-gateways)

このメソッドはクエリーパラメーターをとりません。

#### 応答フォーマット

成功した場合の応答では、HTTPコード**200 OK**とJSON本文が返されます。

上位JSONオブジェクトの各フィールドは[通貨コード][]です。各フィールドの内容は、当該通貨を発行するゲートウェイを表すオブジェクトの配列です。各オブジェクトのフィールドを次に示します。

| フィールド      | 値                | 説明                              |
|:-----------|:---------------------|:-----------------------------------------|
| `name`     | 文字列               | 人間が読み取れる形式のゲートウェイの名前。 |
| `account`  | 文字列 - [アドレス][] | この通貨の[発行アドレス](issuing-and-operational-addresses.html)。 |
| `featured` | ブール値              | このゲートウェイが通貨の「主要」イシュアーとして見なされるかどうか。Rippleは、責任あるビジネスプラクティスや取引量などの評価基準に基づいて主要とするゲートウェイを決定します。 |
| `label`    | 文字列               | （省略される場合があります）[通貨コード][]が40文字の16進値である場合にのみ出力されます。これは、このゲートウェイが発行した通貨の人間が読める形式の別名です。 |
| `assets`   | 文字列の配列     | このゲートウェイに対して利用可能なグラフィックスファイル名（存在する場合）。（ほとんどの場合、XRP Chartsで使用されるロゴのグラフィックスファイル名となります。） |

#### 例

要求:

```
GET /v2/gateways/
```

応答:

```
200 OK
{
   "AUD": [
       {
           "name": "Bitstamp",
           "account": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
           "featured": false,
           "assets": [
               "logo.grayscale.svg",
               "logo.svg"
           ]
       },
       {
           "name": "Coinex",
           "account": "rsP3mgGb2tcYUrxiLFiHJiQXhsziegtwBc",
           "featured": false,
           "assets": []
       }
   ],

...(additional results trimmed) ...

   "0158415500000000C1F76FF6ECB0BAC600000000": [
       {
           "name": "GBI",
           "account": "rrh7rf1gV2pXAoqA8oYbpHd8TKv5ZQeo67",
           "featured": false,
           "label": "XAU (-0.5pa)",
           "assets": []
       }
   ],
   "KRW": [
       {
           "name": "EXRP",
           "account": "rPxU6acYni7FcXzPCMeaPSwKcuS2GTtNVN",
           "featured": true,
           "assets": []
       },
       {
           "name": "Pax Moneta",
           "account": "rUkMKjQitpgAM5WTGk79xpjT38DEJY283d",
           "featured": false,
           "assets": []
       }
   ]
}
```



## Get Gateway
[[ソース]<br>](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/gateways.js "Source")

<!-- STYLE_OVERRIDE: gateway, gateways -->
[Data APIの既知のゲートウェイのリスト](https://github.com/ripple/rippled-historical-database/blob/v2.0.4/api/gateways/gateways.json)から、特定のゲートウェイに関する情報を取得します。_（新規: [v2.0.4][]）_

#### 要求フォーマット

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/gateways/{gateway}
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](data-api-v2-tool.html#get-gateway)

このメソッドには以下のURLパラメーターを指定する必要があります。

| フィールド     | 値  | 説明                                             |
|:----------|:-------|:--------------------------------------------------------|
| `gateway` | 文字列 | ゲートウェイの発行[アドレス][]、[URLエンコード名](https://en.wikipedia.org/wiki/Percent-encoding)、または正規化された名前です。 |

このメソッドはクエリーパラメーターをとりません。

#### 応答フォーマット

成功した場合の応答では、HTTPコード**200 OK**と以下の内容のJSON本文が返されます。

| フィールド        | 値                  | 説明                          |
|:-------------|:-----------------------|:-------------------------------------|
| `name`       | 文字列                 | 人間が読み取れる形式のゲートウェイの名前。  |
| `start_date` | 文字列 - [タイムスタンプ][] | レジャーに記録されているこのゲートウェイの通貨の初回取引のおおよその日付。 |
| `accounts`   | 配列                  | このゲートウェイが使用する[発行アドレス](issuing-and-operational-addresses.html)のリスト。（ゲートウェイは、異なる通貨に異なる発行アカウントを使用することがあります。） |
| `hotwallets` | [アドレス][]の配列 | このゲートウェイの[運用アドレス](issuing-and-operational-addresses.html)。 |
| `domain`     | 文字列                 | このゲートウェイのビジネス用ドメイン名。 |
| `normalized` | 文字列                 | URLに組み込むことができる`name`フィールドの正規化バージョン。 |
| `assets`     | 文字列の配列       | このゲートウェイに対して利用可能なグラフィックスファイル名（存在する場合）。（ほとんどの場合、XRP Chartsで使用されるロゴのグラフィックスファイル名となります。） |

`accounts`フィールド配列の各オブジェクトには以下のフィールドが含まれています。

| フィールド        | 値  | 説明                                          |
|:-------------|:-------|:-----------------------------------------------------|
| `address`    | 文字列 | このゲートウェイが使用する[発行アドレス](issuing-and-operational-addresses.html)。 |
| `currencies` | オブジェクト | このオブジェクトの各フィールドは、このアドレスが発行する通貨に対応した[通貨コード][]です。各値は、その通貨が主要通貨であるかどうかを示す`featured` ブール値を含むオブジェクトです。Rippleは、責任あるビジネスプラクティスや取引量などの評価基準に基づいて主要とする通貨とゲートウェイを決定します。 |

#### 例

要求:

```
GET /v2/gateways/Gatehub
```

応答:

```
200 OK
{
   "name": "Gatehub",
   "start_date": "2015-02-15T00:00:00Z",
   "accounts": [
       {
           "address": "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
           "currencies": {
               "EUR": {
                   "featured": true
               },
               "USD": {
                   "featured": true
               }
           }
       }
   ],
   "hotwallets": [
       "rhotcWYdfn6qxhVMbPKGDF3XCKqwXar5J4"
   ],
   "domain": "gatehub.net",
   "normalized": "gatehub",
   "assets": [
       "logo.grayscale.svg",
       "logo.svg"
   ]
}
```




## Get Currency Image

[[ソース]<br>](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/gateways.js#L199 "Source")

各種通貨のベクターアイコンを取得します。_（新規: [v2.0.4][]）_

#### 要求フォーマット

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/currencies/{currencyimage}
```

<!-- MULTICODE_BLOCK_END -->

このメソッドには以下のURLパラメーターを指定する必要があります。

| フィールド           | 値  | 説明                                       |
|:----------------|:-------|:--------------------------------------------------|
| `currencyimage` | 文字列 | 通貨のイメージファイル（`xrp.svg`など）。利用可能なイメージのリストについては[ソースコード](https://github.com/ripple/rippled-historical-database/tree/develop/api/gateways/currencyAssets)を参照してください。 |

#### 応答フォーマット
成功した場合の応答にはHTTPコード **200 OK**が含まれており、**Content-Type**ヘッダーは`image/svg+xml`です。これは、コンテンツが[SVGフォーマット](https://en.wikipedia.org/wiki/Scalable_Vector_Graphics)のファイルを表すXMLであることを示しています。

#### 例

要求:

```
GET /v2/currencies/mxn.svg
```

応答

```
200 OK
Content-Type: image/svg+xml
<?xml version="1.0" encoding="utf-8"?>
<!-- Generator: Adobe Illustrator 18.1.1, SVG Export Plug-In .SVG Version: 6.00 Build 0)  -->
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
  width="200px" height="200px" viewBox="0 0 200 200" enable-background="new 0 0 200 200" xml:space="preserve">
<g>
 <path fill="#FC6E74" d="M105.1,181.5c-12.2,0-24-2.1-35.1-6.2c-11.1-4.1-21.6-10.5-31.1-19.1l-1.3-1.2l18.8-22.3l1.4,1.2
   c7.4,6.4,14.9,11.3,22.4,14.7c7.4,3.4,16,5.1,25.5,5.1c8,0,14.4-1.7,19-5c4.5-3.2,6.7-7.3,6.7-12.7c0-3-0.4-5.2-1.3-7.1
   c-0.8-1.8-2.4-3.6-4.8-5.4c-2.4-1.8-5.9-3.5-10.2-5.1c-4.5-1.6-10.3-3.2-17.5-4.8c-8.3-1.9-15.8-4.1-22.4-6.6
   c-6.6-2.5-12.3-5.6-16.8-9.2C54,94.3,50.4,89.8,48,84.5c-2.4-5.2-3.6-11.6-3.6-18.9c0-7.4,1.4-13.8,4.1-19.5
   c2.7-5.8,6.6-10.7,11.4-14.8c4.8-4.1,10.6-7.3,17.3-9.5c6.7-2.3,14-3.4,21.9-3.4c11.6,0,22.2,1.7,31.4,5.1
   c9.3,3.4,18.1,8.4,26.2,14.8l1.4,1.1l-16.8,23.6l-1.5-1.1c-6.9-5-13.9-9-20.7-11.6c-6.7-2.6-13.6-4-20.4-4
   c-7.5,0-13.4,1.6-17.5,4.9c-4,3.2-6,7-6,11.6c0,3.1,0.5,5.5,1.4,7.5c0.9,2,2.6,3.8,5,5.4c2.6,1.8,6.3,3.4,10.9,5
   c4.8,1.6,10.9,3.3,18.2,5c8.3,2.1,15.7,4.4,22,7c6.5,2.6,12,5.8,16.3,9.5c4.3,3.8,7.7,8.3,9.9,13.3c2.2,5,3.4,10.9,3.4,17.5
   c0,7.9-1.4,14.7-4.2,20.7c-2.8,6-6.8,11.1-11.9,15.3c-5,4.1-11.1,7.3-18.1,9.4C121.2,180.5,113.4,181.5,105.1,181.5z"/>
 <rect x="86.7" y="0" fill="#FC6E74" width="26.5" height="40.1"/>
 <rect x="86.5" y="159.2" fill="#FC6E74" width="27" height="40.8"/>
</g>
</svg>
```



## Get Accounts
[[ソース]<br>](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/accounts.js "Source")

XRP Ledgerでの新しいアカウントの作成に関する情報を取得します。

#### 要求フォーマット

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/accounts
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](data-api-v2-tool.html#get-accounts)

オプションで、以下のクエリーパラメーターを指定できます。

| フィールド        | 値                  | 説明                          |
|:-------------|:-----------------------|:-------------------------------------|
| `start`      | 文字列 - [タイムスタンプ][] | 照会範囲の開始時刻。           |
| `end`        | 文字列 - [タイムスタンプ][] | 照会範囲の終了時刻。             |
| `limit`      | 整数                | ページあたりの最大結果件数。デフォルトは200です。1,000を超える値は指定できません。 |
| `marker`     | 文字列                 | 前に返された応答の[ページネーション](#ページネーション)キー。 |
| `descending` | ブール値                | `true`の場合、結果が逆時系列で返されます。デフォルトは`false`です。 |
| `parent`     | 文字列                 | 指定された親アカウントの子に結果を絞り込みます。`interval`パラメーターとともに指定することはできません。 |
| `format`     | 文字列                 | 返される結果のフォーマットは`csv`または`json`です。デフォルトは`json`です。 |

`interval`および`reduce`パラメーターは[v2.3.5][]で除去されました。

#### 応答フォーマット
成功した場合の応答では、HTTPコード**200 OK**と以下の内容のJSON本文が返されます。

| フィールド      | 値   | 説明                                           |
|:-----------|:--------|:------------------------------------------------------|
| `result`   | 文字列  | 値が`success`の場合は、成功した場合の応答であることを示します。 |
| `count`    | 整数 | 返されたアカウントの数。                          |
| `marker`   | 文字列  | （省略される場合があります）[ページネーション](#ページネーション)マーカー。    |
| `accounts` | 配列   |[アカウント作成オブジェクト](#アカウント作成オブジェクト)の配列。 |

#### 例

要求:

```
GET /v1/accounts?parent=rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn
```

応答:

```
200 OK
{
 "result": "success",
 "count": 3,
 "accounts": [
   {
     "balance": "20.0",
     "account": "raKEEVSGnKSD9Zyvxu4z6Pqpm4ABH8FS6n",
     "executed_time": "2015-02-09T23:31:40+00:00",
     "ledger_index": 11620700,
     "parent": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
     "tx_hash": "1D381C0FCA00E8C34A6D4D3A91DAC9F3697B4E66BC49ED3D9B2D6F57D7F15E2E"
   },
   {
     "balance": "30",
     "account": "rUpy3eEg8rqjqfUoLeBnZkscbKbFsKXC3v",
     "executed_time": "2015-06-16T21:15:40+00:00",
     "ledger_index": 14090928,
     "parent": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
     "tx_hash": "60B614622FC67DFCA8D796D7F6AF0B7AEC5E59BB268EA032F810395407DDF8D5"
   },
   {
     "balance": "50",
     "account": "rLFd1FzHMScFhLsXeaxStzv3UC97QHGAbM",
     "executed_time": "2015-09-23T23:05:20+00:00",
     "ledger_index": 16061430,
     "parent": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
     "tx_hash": "FAE331A6D5CB83BCE832E7EBEDBD807EDEFFAF39AB241683EE81A0326A1A6748"
   }
 ]
}
```


## Get Account
[[ソース]<br>](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/getAccount.js "Source")

特定のrippleアカウントの作成に関する情報を取得します。

#### 要求フォーマット


<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/accounts/{address}
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](data-api-v2-tool.html#get-account)

このメソッドには以下のURLパラメーターを指定する必要があります。

| フィールド     | 値  | 説明                  |
|:----------|:-------|:-----------------------------|
| `address` | 文字列 | 照会するXRP Ledgerアドレス。 |

#### 応答フォーマット

成功した場合の応答では、HTTPコード**200 OK**と以下の内容のJSON本文が返されます。

| フィールド     | 値                                                  | 説明 |
|:----------|:-------------------------------------------------------|:--------|
| `result`  | 文字列                                                 | 値が`success`の場合は、成功した場合の応答であることを示します。 |
| `account` | オブジェクト - [アカウント作成](#アカウント作成オブジェクト) | 要求されたアカウント。 |

#### 例

要求:

```
GET /v2/accounts/rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn
```

応答:

```
200 OK
{
   "result": "success",
   "account": {
       "address": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
       "parent": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
       "initial_balance": "100.0",
       "inception": "2014-05-29T17:05:20+00:00",
       "ledger_index": 6902264,
       "tx_hash": "074415C5DC6DB0029E815EA6FC2629FBC29A2C9D479F5D040AFF94ED58ECC820"
   }
}
```



## Get Account Balances
[[ソース]<br>](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/accountBalances.js "Source")

特定のXRP Ledgerアカウントが保有または支払い義務のあるすべての残高を取得します。

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/accounts/{address}/balances
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](data-api-v2-tool.html#get-account-balances)

このメソッドには以下のURLパラメーターを指定する必要があります。

| フィールド     | 値  | 説明                  |
|:----------|:-------|:-----------------------------|
| `address` | 文字列 | 照会するXRP Ledgerアドレス。 |

オプションで、以下のクエリーパラメーターを指定できます。

| フィールド          | 値   | 説明                                       |
|:---------------|:--------|:--------------------------------------------------|
| `ledger_index` | 整数 | 過去の残高のレジャーのインデックス。          |
| `ledger_hash`  | 文字列  | 過去の残高のレジャーハッシュ。              |
| `date`         | 文字列  | 過去の残高の日付（UTC）。                 |
| `currency`     | 文字列  | 指定された通貨に結果を制限します。           |
| `counterparty` | 文字列  | 指定された取引相手/イシュアーに結果を制限します。 |
| `limit`        | 整数 | ページあたりの最大結果件数。デフォルトは200です。400よりも大きい値は指定できませんが、値`all` を使用すればすべての結果を返せます。（注意: 非常に大量の結果を取得する際にlimit=allを指定すると、要求がタイムアウトになる可能性があります。大規模なイシュアーの場合は、結果が数万件にのぼることがあります。） |
| `format`       | 文字列  | 返される結果のフォーマットは`csv`または`json`です。デフォルトは`json`です。 |

#### 応答フォーマット
成功した場合の応答では、HTTPコード**200 OK**と以下の内容のJSON本文が返されます。

| フィールド          | 値                        | 説明                  |
|:---------------|:-----------------------------|:-----------------------------|
| `result`       | 文字列                       | 値が`success`の場合は、成功した場合の応答であることを示します。 |
| `ledger_index` | 整数                      | 残高クエリーのレジャーインデックス。 |
| `close_time`   | 文字列                       | レジャーの閉鎖時刻。    |
| `limit`        | 文字列                       | 制限を超えた場合に返された結果の数。 |
| `marker`       | 文字列                       | （省略される場合があります）[ページネーション](#ページネーション)マーカー。 |
| `balances`     | [残高オブジェクト][]の配列。 | 要求された残高。      |

#### 例

要求:

```
GET /v2/accounts/rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn/balances?currency=USD&date=2015-01-01T00:00:00Z&limit=3
```

応答:

```
200 OK
{
 "result": "success",
 "ledger_index": 10852618,
 "close_time": "2015-01-01T00:00:00Z",
 "limit": 3,
 "balances": [
   {
     "currency": "USD",
     "counterparty": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
     "value": "-11.0301"
   },
   {
     "currency": "USD",
     "counterparty": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
     "value": "0.0001"
   },
   {
     "currency": "USD",
     "counterparty": "rweYz56rfmQ98cAdRaeTxQS9wVMGnrdsFp",
     "value": "0"
   }
 ]
}
```


## Get Account Orders
[[ソース]<br>](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/accountOrders.js "Source")

オーダーブックで特定のアカウントが発注したオーダーを取得します。すでに処理されたオーダーは返されません。

#### 要求フォーマット

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/account/{address}/orders
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](data-api-v2-tool.html#get-account-orders)

このメソッドには以下のURLパラメーターを指定する必要があります。

| フィールド     | 値                | 説明                  |
|:----------|:---------------------|:-----------------------------|
| `address` | 文字列 - [アドレス][] | 照会するXRP Ledgerアドレス。 |

オプションで、以下のクエリーパラメーターを指定できます。

| フィールド          | 値                  | 説明                        |
|:---------------|:-----------------------|:-----------------------------------|
| `ledger_index` | 整数                | このレジャーの時点でのオーダーを取得します。`ledger_hash`または`date`と同時に指定することはできません。 |
| `ledger_hash`  | 文字列                 | このレジャーの時点でのオーダーを取得します。`ledger_index`または`date`と同時に指定することはできません。 |
| `date`         | 文字列 - [タイムスタンプ][] | この時刻でのオーダーを取得します。`ledger_index`または`ledger_hash`と同時に指定することはできません。 |
| `limit`        | 整数                | ページあたりの最大結果件数。デフォルトは200です。400を超える値は指定できません。 |
| `format`       | 文字列                 | 返される結果のフォーマットは`csv`または`json`です。デフォルトは`json`です。 |

`ledger_index`、`ledger_hash`、`date`のいずれも指定されていない場合、APIは利用可能な最新データを使用します。

#### 応答フォーマット
成功した場合の応答では、HTTPコード**200 OK**と以下の内容のJSON本文が返されます。

| フィールド          | 値                  | 説明                        |
|:---------------|:-----------------------|:-----------------------------------|
| `result`       | 文字列                 | 値が`success`の場合は、成功した場合の応答であることを示します。 |
| `ledger_index` | 整数                | 使用するレジャーバージョンの`ledger_index`。 |
| `close_time`   | 文字列                 | 使用するレジャーバージョンの閉鎖時刻。 |
| `limit`        | 文字列                 | 要求に指定されていた`limit`。      |
| `orders`       | オーダーオブジェクトの配列 | 要求されたオーダー。              |

各オーダーオブジェクトのフィールドを次に示します。

| フィールド                          | 値                | 説明          |
|:-------------------------------|:---------------------|:---------------------|
| `specification`                | オブジェクト               | このオーダーの現在の状態の詳細。 |
| `specification.direction`      | 文字列               | `buy`または`sell`。 |
| `specification.quantity`       | [残高オブジェクト][]   | このオーダーで（方向に応じて）売却または購入するベース通貨の最大額。オーダーが部分的に約定するとこの値が減少します。 |
| `specification.totalPrice`     | [残高オブジェクト][]   | ベース通貨の購入または売却のためにオーダーで支出または獲得できるクオート通貨の最大額。オーダーが部分的に約定するとこの値が減少します。 |
| `properties`                   | オブジェクト               | オーダーの発注方法の詳細。 |
| `properties.maker`             | 文字列 - [アドレス][] | オーダーを発注したXRP Ledgerアカウント。 |
| `properties.sequence`          | 数値               | このオーダーを発注したトランザクションのシーケンス番号。 |
| `properties.makerExchangeRate` | [文字列 - 数値][]  | オーダーを送信したアカウントの側から見た為替レート。 |

#### 例

要求:

```
GET /v2/accounts/rK5j9n8baXfL4gzUoZsfxBvvsv97P5swaV/orders?limit=2&date=2015-11-11T00:00:00Z
```

応答:

```
200 OK
{
 "result": "success",
 "ledger_index": 17007855,
 "close_time": "2015-11-11T00:00:00Z",
 "limit": 2,
 "orders": [
   {
     "specification": {
       "direction": "buy",
       "quantity": {
         "currency": "JPY",
         "value": "56798.00687665813",
         "counterparty": "r94s8px6kSw1uZ1MV98dhSRTvc6VMPoPcN"
       },
       "totalPrice": {
         "currency": "USD",
         "value": "433.792841227449",
         "counterparty": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
       }
     },
     "properties": {
       "maker": "rK5j9n8baXfL4gzUoZsfxBvvsv97P5swaV",
       "sequence": 7418286,
       "makerExchangeRate": "130.9334813270407"
     }
   },
   {
     "specification": {
       "direction": "buy",
       "quantity": {
         "currency": "JPY",
         "value": "11557.02705273459",
         "counterparty": "r94s8px6kSw1uZ1MV98dhSRTvc6VMPoPcN"
       },
       "totalPrice": {
         "currency": "USD",
         "value": "87.570156003591",
         "counterparty": "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq"
       }
     },
     "properties": {
       "maker": "rK5j9n8baXfL4gzUoZsfxBvvsv97P5swaV",
       "sequence": 7418322,
       "makerExchangeRate": "131.9744942815983"
     }
   }
 ]
}
```




## Get Account Transaction History
[[ソース]<br>](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/accountTransactions.js "Source")

特定のアカウントに影響を及ぼしたトランザクションの履歴を取得します。これには、そのアカウントから送信されたすべてのトランザクション、アカウントが受領したペイメント、アカウントを通じてRipplingされたペイメントが含まれます。

#### 要求フォーマット

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/accounts/{address}/transactions
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](data-api-v2-tool.html#get-account-transaction-history)

このメソッドには以下のURLパラメーターを指定する必要があります。

| フィールド     | 値                | 説明                  |
|:----------|:---------------------|:-----------------------------|
| `address` | 文字列 - [アドレス][] | 照会するXRP Ledgerアドレス。 |


オプションで、以下のクエリーパラメーターを指定できます。

| フィールド          | 値                  | 説明                        |
|:---------------|:-----------------------|:-----------------------------------|
| `start`        | 文字列 - [タイムスタンプ][] | 照会範囲の開始時刻。デフォルトは、利用可能な最も古い日付です。 |
| `end`          | 文字列 - [タイムスタンプ][] | 照会範囲の終了時刻。デフォルトは現在の日付です。 |
| `min_sequence` | 文字列                 | 照会対象の最小シーケンス番号。  |
| `max_sequence` | 文字列                 | 照会対象の最大シーケンス番号。      |
| `type`         | 文字列                 | 指定された[トランザクションタイプ](transaction-types.html)に結果を制限します。 |
| `result`       | 文字列                 | 指定された[トランザクションの結果](transaction-results.html)に結果を制限します。 |
| `binary`       | ブール値                | 結果をバイナリフォーマットで返します。   |
| `descending`   | ブール値                | `true`の場合、結果が逆時系列で返されます。デフォルトは`false`です。 |
| `limit`        | 整数                | ページあたりの最大結果件数。デフォルトは20です。1,000を超える値は指定できません。 |
| `marker`       | 文字列                 | 前に返された応答の[ページネーション](#ページネーション)キー。 |

**注記:** このメソッドはCSVフォーマットを返すことができません。生XRP LdgerトランザクションではJSONの結果だけがサポートされています。


#### 応答フォーマット

成功した場合の応答では、HTTPコード**200 OK**と以下の内容のJSON本文が返されます。

| フィールド          | 値                                                | 説明 |
|:---------------|:-----------------------------------------------------|:-----|
| `result`       | 文字列                                               | 値が`success`の場合は、成功した場合の応答であることを示します。 |
| `count`        | 整数                                              | `transactions`フィールドに含まれているオブジェクトの数。 |
| `marker`       | 文字列                                               | （省略される場合があります）[ページネーション](#ページネーション)マーカー。 |
| `transactions` | [トランザクションオブジェクト](#トランザクションオブジェクト)の配列。 | 要求に一致するすべてのトランザクション。 |

#### 例

要求:

```
GET /v2/accounts/rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn/transactions?type=Payment&result=tesSUCCESS&limit=1
```

応答:

```
200 OK
{
 "result": "success",
 "count": 1,
 "marker": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn|20140602224750|000006979192|00001",
 "transactions": [
   {
     "hash": "074415C5DC6DB0029E815EA6FC2629FBC29A2C9D479F5D040AFF94ED58ECC820",
     "date": "2014-05-29T17:05:20+00:00",
     "ledger_index": 6902264,
     "tx": {
       "TransactionType": "Payment",
       "Flags": 0,
       "Sequence": 1,
       "LastLedgerSequence": 6902266,
       "Amount": "100000000",
       "Fee": "12",
       "SigningPubKey": "032ECFCC409F02057D8556988B89E17D48ECFC8373965036C6BA294AA2B7972971",
       "TxnSignature": "30450221008D8E251DA5EA17A29CC9192717860F3B4047E74DF005127A65D9140CAE870C0902201C8E4548D2D3BA11B3E13CE8A167EBC076920E2B1C38547275CAA75FEC436EB9",
       "Account": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
       "Destination": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
     },
     "meta": {
       "TransactionIndex": 1,
       "AffectedNodes": [
         {
           "CreatedNode": {
             "LedgerEntryType": "AccountRoot",
             "LedgerIndex": "13F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8",
             "NewFields": {
               "Sequence": 1,
               "Balance": "100000000",
               "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
             }
           }
         },
         {
           "ModifiedNode": {
             "LedgerEntryType": "AccountRoot",
             "PreviousTxnLgrSeq": 6486567,
             "PreviousTxnID": "FF9BFF3C200B475CA7EE54F9A98EAB7E92BBDBD2DBE95AC854405D8A85C9D535",
             "LedgerIndex": "43EA78783A089B137D5E87610DF3BD4129F989EDD02EFAF6C265924D3A0EF8CE",
             "PreviousFields": {
               "Sequence": 1,
               "Balance": "1000000000"
             },
             "FinalFields": {
               "Flags": 0,
               "Sequence": 2,
               "OwnerCount": 0,
               "Balance": "899999988",
               "Account": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX"
             }
           }
         }
       ],
       "TransactionResult": "tesSUCCESS"
     }
   }
 ]
}
```




## Get Transaction By Account And Sequence
[[ソース]<br>](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/accountTxSeq.js "Source")

指定されたアカウントから送信された特定のトランザクションを取得します。

#### 要求フォーマット

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/accounts/{address}/transactions/{sequence}
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](data-api-v2-tool.html#get-transaction-by-account-and-sequence)

このメソッドには以下のURLパラメーターを指定する必要があります。

| フィールド      | 値   | 説明                  |
|:-----------|:--------|:-----------------------------|
| `address`  | 文字列  | 照会するXRP Ledgerアドレス。 |
| `sequence` | 整数 | トランザクションのシーケンス番号。 |


オプションで、以下のクエリーパラメーターを指定できます。

| フィールド    | 値   | 説明                                             |
|:---------|:--------|:--------------------------------------------------------|
| `binary` | ブール値 | `true`の場合、トランザクションをバイナリフォーマットで返します。デフォルトは`false`です。 |


#### 応答フォーマット

成功した場合の応答では、HTTPコード**200 OK**と以下の内容のJSON本文が返されます。

| フィールド         | 値                                      | 説明     |
|:--------------|:-------------------------------------------|:----------------|
| `result`      | 文字列                                     | 値が`success`の場合は、成功した場合の応答であることを示します。 |
| `transaction` | [トランザクションオブジェクト](#トランザクションオブジェクト) | 要求されたトランザクション。 |

#### 例

要求:

```
GET /v2/accounts/rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn/transactions/10?binary=true
```

応答:

```
200 OK
{
 "result": "success",
 "transaction": {
   "hash": "4BFFBB86C12659B6C5BB88F0EB859356DE3433EBACBFD9F50F6E70B2C05CCFE0",
   "date": "2014-09-15T19:59:10+00:00",
   "ledger_index": 8889812,
   "tx": "1200052200000000240000000A68400000000000000A732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB74473045022100AA4AF08726FCF0F28AA4A841C45F975C3BF1545648F6907DCB33F6E3DD7E85D6022037365B80AB1972BF8A4280009A0DBCF16A1D562ED0489B155750E48CC939039981144B4E9C06F24296074F7BC48F92A97916C6DC5EA9",
   "meta": "201C00000003F8E5110061250087A5C555CBCA96F4C42E0EBC0E75C5AD84B3403FEDF824A7DAFA45ADCA6ECB66AA143C1B5613F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8E6240000000A62400000000DB5852F8814D3484B9ED2556DCE16A3B928B438BA6EE0FF0989E1E72200010000240000000B2D0000000062400000000DB5852572110000000000000000000000070000000300770A6D64756F31332E636F6D81144B4E9C06F24296074F7BC48F92A97916C6DC5EA9E1E1F1031000"
 }
}
```



## Get Account Payments
[[ソース]<br>](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/accountPayments.js "Source")

指定されたアカウントのペイメントを取得します。

#### 要求フォーマット

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/accounts/{address}/payments
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](data-api-v2-tool.html#get-account-payments)

このメソッドには以下のURLパラメーターを指定する必要があります。

| フィールド     | 値  | 説明                  |
|:----------|:-------|:-----------------------------|
| `address` | 文字列 | 照会するXRP Ledgerアドレス。 |


オプションで、以下のクエリーパラメーターを指定できます。

| フィールド             | 値                      | 説明                 |
|:------------------|:---------------------------|:----------------------------|
| `start`           | 文字列 - [タイムスタンプ][]     | この時刻以降の結果に絞り込みます。 |
| `end`             | 文字列 - [タイムスタンプ][]     | この時刻以前の結果に絞り込みます。 |
| `type`            | 文字列                     | ペイメントタイプ - `sent`または`received`。 |
| `currency`        | 文字列 - [通貨コード][] | 指定された通貨に結果を絞り込みます。 |
| `issuer`          | 文字列 - [アドレス][]       | 指定されたイシュアーに結果を絞り込みます。 |
| `source_tag`      | 整数                    | 指定された送金元タグに結果を絞り込みます。 |
| `destination_tag` | 整数                    | 指定された送金先タグに結果を絞り込みます。 |
| `limit`           | 整数                    | ページあたりの最大結果件数。デフォルトは200です。1,000を超える値は指定できません。 |
| `marker`          | 文字列                     | 前に返された応答の[ページネーション](#ページネーション)キー。 |
| `format`          | 文字列                     | 返される結果のフォーマットは`csv`または`json`です。デフォルトは`json`です。 |


#### 応答フォーマット

成功した場合の応答では、HTTPコード**200 OK**と以下の内容のJSON本文が返されます。

| フィールド      | 値                        | 説明                      |
|:-----------|:-----------------------------|:---------------------------------|
| `result`   | 文字列                       | 値が`success`の場合は、成功した場合の応答であることを示します。 |
| `count`    | 整数                      | `payments`フィールドに含まれているオブジェクトの数。 |
| `marker`   | 文字列                       | （省略される場合があります）[ページネーション](#ページネーション)マーカー。 |
| `payments` | [ペイメントオブジェクト][]の配列 | 要求に一致するすべてのペイメント。最も古いものから順にソートされています。 |

#### 例

要求:

```
GET /v2/accounts/rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn/payments?currency=USD&limit=1
```

応答:

```
200 OK
{
 "result": "success",
 "count": 1,
 "marker": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn|20140604191650|000007013674|00000",
 "payments": [
   {
     "amount": "1.0",
     "delivered_amount": "1.0",
     "destination_balance_changes": [
       {
         "counterparty": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
         "currency": "USD",
         "value": "1"
       }
     ],
     "source_balance_changes": [
       {
         "counterparty": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
         "currency": "USD",
         "value": "-1"
       }
     ],
     "tx_index": 1,
     "currency": "USD",
     "destination": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
     "executed_time": "2014-06-02T22:47:50Z",
     "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
     "ledger_index": 6979192,
     "source": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
     "source_currency": "USD",
     "tx_hash": "7BF105CFE4EFE78ADB63FE4E03A851440551FE189FD4B51CAAD9279C9F534F0E",
     "transaction_cost": "1.0E-5"
   }
 ]
}
```




## Get Account Exchanges
[[ソース]<br>](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/accountExchanges.js "Source")

指定されたアカウントの取引を経時的に取得します。

#### 要求フォーマット

このメソッドには2種類のバリエーションがあります。

<!-- MULTICODE_BLOCK_START -->

*REST - すべての取引*

```
GET /v2/accounts/{address}/exchanges/
```

*REST - 特定の通貨ペア*

```
GET /v2/accounts/{address}/exchanges/{base}/{counter}
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](data-api-v2-tool.html#get-account-exchanges-all)

このメソッドには以下のURLパラメーターを指定する必要があります。

| フィールド     | 値  | 説明                                             |
|:----------|:-------|:--------------------------------------------------------|
| `address` | 文字列 | 照会するXRP Ledgerアドレス。                            |
| `base`    | 文字列 | ペアのベース通貨。[通貨コード][]、`+`、イシュアーの[アドレス][]の順で指定します（ベース通貨がXRPの場合を除く）。 |
| `counter` | 文字列 | ペアのクオート通貨。[通貨コード][]、`+`、イシュアーの[アドレス][]の順で指定します（ベース通貨がXRPの場合を除く）。 |


オプションで、以下のクエリーパラメーターを指定できます。

| フィールド        | 値                  | 説明                          |
|:-------------|:-----------------------|:-------------------------------------|
| `start`      | 文字列 - [タイムスタンプ][] | この時刻以降の結果に絞り込みます。 |
| `end`        | 文字列 - [タイムスタンプ][] | この時刻以前の結果に絞り込みます。 |
| `descending` | ブール値                | `true`の場合、結果が逆時系列で返されます。デフォルトは`false`です。 |
| `limit`      | 整数                | ページあたりの最大結果件数。デフォルトは200です。1000を超える値は指定できません。 |
| `marker`     | 文字列                 | 前に返された応答の[ページネーション](#ページネーション)キー。 |
| `format`     | 文字列                 | 返される結果のフォーマットは`csv`または`json`です。デフォルトは`json`です。 |


#### 応答フォーマット
成功した場合の応答では、HTTPコード**200 OK**と以下の内容のJSON本文が返されます。

| フィールド       | 値                         | 説明                    |
|:------------|:------------------------------|:-------------------------------|
| `result`    | 文字列                        | 値が`success`の場合は、成功した場合の応答であることを示します。 |
| `count`     | 整数                       | 返された取引の数。  |
| `marker`    | 文字列                        | （省略される場合があります）[ページネーション](#ページネーション)マーカー。 |
| `exchanges` | [取引オブジェクト][]の配列 | 要求された取引。       |

#### 例

要求:

```
GET /v2/accounts/rsyDrDi9Emy6vPU78qdxovmNpmj5Qh4NKw/exchanges/KRW+rUkMKjQitpgAM5WTGk79xpjT38DEJY283d/XRP?start=2015-08-08T00:00:00Z&end=2015-08-31T00:00:00Z&limit=2

```

応答:

```
200 OK
{
   "result": "success",
   "count": 2,
   "marker": "rsyDrDi9Emy6vPU78qdxovmNpmj5Qh4NKw|20150810014200|000015162386|00013|00003",
   "exchanges": [
       {
           "base_amount": 209.3501241148,
           "counter_amount": 20.424402,
           "rate": 0.097560973925,
           "autobridged_currency": "USD",
           "autobridged_issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
           "base_currency": "KRW",
           "base_issuer": "rUkMKjQitpgAM5WTGk79xpjT38DEJY283d",
           "buyer": "rnAqwsu2BEbCjacoZmsXrpViqd3miZhHbT",
           "counter_currency": "XRP",
           "executed_time": "2015-08-08T02:57:40",
           "ledger_index": 15122851,
           "offer_sequence": "1738",
           "provider": "rsyDrDi9Emy6vPU78qdxovmNpmj5Qh4NKw",
           "seller": "rsyDrDi9Emy6vPU78qdxovmNpmj5Qh4NKw",
           "taker": "rnAqwsu2BEbCjacoZmsXrpViqd3miZhHbT",
           "tx_hash": "506D109A609A5E0778276CCBB125A4AA7B78428059F069A2CB4F739B861C0C49",
           "tx_type": "OfferCreate"
       },
       {
           "base_amount": 86355.6498758851,
           "counter_amount": 8424.941452,
           "rate": 0.097560975618,
           "base_currency": "KRW",
           "base_issuer": "rUkMKjQitpgAM5WTGk79xpjT38DEJY283d",
           "buyer": "r9xQi5YT8jqVM3wZhbiV94ZKKvGHaVeSDj",
           "client": "rt1.1-26-gbeb68ab",
           "counter_currency": "XRP",
           "executed_time": "2015-08-08T07:15:00",
           "ledger_index": 15126536,
           "offer_sequence": "1738",
           "provider": "rsyDrDi9Emy6vPU78qdxovmNpmj5Qh4NKw",
           "seller": "rsyDrDi9Emy6vPU78qdxovmNpmj5Qh4NKw",
           "taker": "r9xQi5YT8jqVM3wZhbiV94ZKKvGHaVeSDj",
           "tx_hash": "C897A595DED16ADF5AD52E6FD9CE5DE65C78A93CCAA62A85248DC3015A78F5C4",
           "tx_type": "Payment"
       }
   ]
}
```




## Get Account Balance Changes
[[ソース]<br>](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/accountBalanceChanges.js "Source")

指定されたアカウントの残高変更を経時的に取得します。

#### 要求フォーマット

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/accounts/{address}/balance_changes/
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](data-api-v2-tool.html#get-account-balance-changes)

このメソッドには以下のURLパラメーターを指定する必要があります。

| フィールド     | 値  | 説明                  |
|:----------|:-------|:-----------------------------|
| `address` | 文字列 | 照会するXRP Ledgerアドレス。 |


オプションで、以下のクエリーパラメーターを指定できます。

| フィールド          | 値                  | 説明                        |
|:---------------|:-----------------------|:-----------------------------------|
| `currency`     | 文字列                 | 指定された通貨に結果を制限します。 |
| `counterparty` | 文字列                 | 指定された取引相手/イシュアーに結果を制限します。 |
| `start`        | 文字列 - [タイムスタンプ][] | 照会範囲の開始時刻。         |
| `end`          | 文字列 - [タイムスタンプ][] | 照会範囲の終了時刻。           |
| `descending`   | ブール値                | `true`の場合、結果が逆時系列で返されます。デフォルトは`false`です。 |
| `limit`        | 整数                | ページあたりの最大結果件数。デフォルトは200です。1000を超える値は指定できません。 |
| `marker`       | 文字列                 | 前に返された応答の[ページネーション](#ページネーション)キー。 |
| `format`       | 文字列                 | 返される結果のフォーマットは`csv`または`json`。デフォルトは`json`です。 |


#### 応答フォーマット
成功した場合の応答では、HTTPコード**200 OK**と以下の内容のJSON本文が返されます。

| フィールド       | 値                                   | 説明          |
|:------------|:----------------------------------------|:---------------------|
| `result`    | 文字列                                  | 値が`success`の場合は、成功した場合の応答であることを示します。 |
| `count`     | 整数                                 | 返された残高変更の数。 |
| `marker`    | 文字列                                  | （省略される場合があります）[ページネーション](#ページネーション)マーカー。 |
| `exchanges` | [残高変更記述][]の配列。 | 要求された残高変更。 |

#### 例

要求:

```
GET /v2/accounts/rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn/balance_changes?descending=true&limit=3
```

応答:

```
200 OK
{
 "result": "success",
 "count": 3,
 "marker": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn|20160122235211|000018425487|00010|00001",
 "balance_changes": [
   {
     "amount_change": "-0.012",
     "final_balance": "75.169663",
     "tx_index": 7,
     "change_type": "transaction_cost",
     "currency": "XRP",
     "executed_time": "2016-01-29T22:57:20Z",
     "ledger_index": 18555460,
     "tx_hash": "2B44EBE00728D04658E597A85EC4F71D20503B31ABBF556764AD8F7A80BA72F6"
   },
   {
     "amount_change": "-25.0",
     "final_balance": "75.181663",
     "node_index": 1,
     "tx_index": 4,
     "change_type": "payment_source",
     "currency": "XRP",
     "executed_time": "2016-01-26T08:32:20Z",
     "ledger_index": 18489336,
     "tx_hash": "E5C6DD25B2DCF534056D98A2EFE3B7CFAE4EBC624854DE3FA436F733A56D8BD9"
   },
   {
     "amount_change": "-0.01",
     "final_balance": "100.181663",
     "tx_index": 4,
     "change_type": "transaction_cost",
     "currency": "XRP",
     "executed_time": "2016-01-26T08:32:20Z",
     "ledger_index": 18489336,
     "tx_hash": "E5C6DD25B2DCF534056D98A2EFE3B7CFAE4EBC624854DE3FA436F733A56D8BD9"
   }
 ]
}
```




## Get Account Reports
[[ソース]<br>](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/accountReports.js "Source")

アカウントのペイメントアクティビティの日次サマリーを取得します。

<!-- MULTICODE_BLOCK_START -->

*REST - 日付を省略*

```
GET /v2/accounts/{address}/reports/
```

*REST - 日付を指定*

```
GET /v2/accounts/{address}/reports/{date}
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](data-api-v2-tool.html#get-account-reports-by-day)

このメソッドには以下のURLパラメーターを指定する必要があります。

| フィールド     | 値  | 説明                                             |
|:----------|:-------|:--------------------------------------------------------|
| `address` | 文字列 | 照会するXRP Ledgerアドレス。                            |
| `date`    | 文字列 | _（省略可）_ 1つのレポートの日付（UTC）。省略すると、`start`および`end`クエリーパラメーターが使用されます。 |


オプションで、以下のクエリーパラメーターを指定できます。

| フィールド        | 値                  | 説明                          |
|:-------------|:-----------------------|:-------------------------------------|
| `start`      | 文字列 - [タイムスタンプ][] | 照会範囲の開始時刻。デフォルトは、現在の日付の開始時刻です。`date`が指定されている場合は無視されます。 |
| `end`        | 文字列 - [タイムスタンプ][] | 照会範囲の終了時刻。デフォルトは、現在の日付の終了時刻です。`date`が指定されている場合は無視されます。 |
| `accounts`   | ブール値                | `true`の場合、すべての`sending_counterparties`および`receiving_counterparties`のアドレスのリストが結果に含まれます。それ以外の場合、送金側取引相手と受取側取引相手の数のみが返されます。デフォルトは`false`です。 |
| `payments`   | ブール値                | [ペイメントサマリーオブジェクト][]を各間隔の`payments`フィールドに指定します。このオブジェクトには、当該間隔で発生したペイメントが含まれています。 |
| `descending` | ブール値                | `true`の場合は、結果が最新のものから順にソートされます。デフォルトでは、結果が最も古いものから順にソートされます。 |
| `format`     | 文字列                 | 返される結果のフォーマットは`csv`または`json`です。デフォルトは`json`です。 |


#### 応答フォーマット
成功した場合の応答では、HTTPコード**200 OK**と以下の内容のJSON本文が返されます。

| フィールド     | 値                        | 説明                       |
|:----------|:-----------------------------|:----------------------------------|
| `result`  | 文字列                       | 値が`success`の場合は、成功した場合の応答であることを示します。 |
| `count`   | 整数                      | `reports`フィールドに含まれているレポートの数。 |
| `reports` | [レポートオブジェクト][]の配列 | 指定のアカウントと日付範囲のアカウントアクティビティの日次サマリー。 |

#### 例

要求:

```
GET /v2/accounts/rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q/reports?start=2015-08-28T00:00:00&end=2015-08-28T00:00:00&accounts=true&payments=true&descending=true
```

応答:

```
200 OK
{
 "result": "success",
 "count": 1,
 "reports": [
   {
     "account": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
     "date": "2015-08-28T00:00:00+00:00",
     "high_value_received": 89500.74142547617,
     "high_value_sent": 0,
     "payments": [
       {
         "tx_hash": "F2323EE7494384E77ABB18F31981FEE8C31767BBD27515B55FC3BD6792C4E408",
         "amount": 2.7,
         "currency": "BTC",
         "issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
         "type": "received"
       },
       {
         "tx_hash": "FEAD462738EE430E154FF3122D3EE2DD27DDD8BEFBA080A60FE91B78E8865365",
         "amount": 3,
         "currency": "BTC",
         "issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
         "type": "received"
       },
       {
         "tx_hash": "383B1D1EABB646AB2EFBBF9E8967FE279BFE5EF86A3B6BCD5BDA287210053116",
         "amount": 0.14,
         "currency": "BTC",
         "issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
         "type": "received"
       }
     ],
     "payments_received": 3,
     "payments_sent": 0,
     "receiving_counterparties": [],
     "sending_counterparties": [
       "rhi4zZdCeFdfTokzek8D7p9bUWmtEFCZAe",
       "rP1hkW1LCiVos6FpzU7itmm9Tk29yqvyk5"
     ],
     "total_value": 174019.58324753598,
     "total_value_received": 174019.58324753598,
     "total_value_sent": 0
   }
 ]
}
```



## Get Account Transaction Stats
[[ソース]<br>](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/accountStats.js "Source")

アカウントのトランザクションアクティビティの日次サマリーを取得します。_（新規: [v2.1.0][]）_

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/accounts/{address}/stats/transactions
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](data-api-v2-tool.html#get-account-transaction-stats)

このメソッドには以下のURLパラメーターを指定する必要があります。

| フィールド     | 値  | 説明                  |
|:----------|:-------|:-----------------------------|
| `address` | 文字列 | 照会するXRP Ledgerアドレス。 |


オプションで、以下のクエリーパラメーターを指定できます。

| フィールド        | 値                  | 説明                          |
|:-------------|:-----------------------|:-------------------------------------|
| `start`      | 文字列 - [タイムスタンプ][] | 照会範囲の開始時刻。デフォルトは、利用可能な最も古い日付です。 |
| `end`        | 文字列 - [タイムスタンプ][] | 照会範囲の終了時刻。デフォルトは現在の日付です。 |
| `limit`      | 整数                | ページあたりの最大結果件数。デフォルトは200です。1000を超える値は指定できません。 |
| `descending` | ブール値                | `true`の場合は、結果が最新のものから順にソートされます。デフォルトでは、結果が最も古いものから順にソートされます。 |
| `marker`     | 文字列                 | 前に返された応答の[ページネーション](#ページネーション)キー。 |
| `format`     | 文字列                 | 返される結果のフォーマットは`csv`または`json`です。デフォルトは`json`です。 |


#### 応答フォーマット
成功した場合の応答では、HTTPコード**200 OK**と以下の内容のJSON本文が返されます。

| フィールド    | 値                              | 説明                  |
|:---------|:-----------------------------------|:-----------------------------|
| `result` | 文字列                             | 値が`success`の場合は、成功した場合の応答であることを示します。 |
| `count`  | 整数                            | `rows`フィールドに含まれているトランザクション統計情報オブジェクトの数。 |
| `rows`   | トランザクション統計情報オブジェクトの配列。 | 指定されたアカウントのアカウントアクティビティの日次サマリー。 |

各トランザクション状況オブジェクトのフィールドを次に示します。

| フィールド               | 値                  | 説明                   |
|:--------------------|:-----------------------|:------------------------------|
| `date`              | 文字列 - [タイムスタンプ][] | このオブジェクトは、当該日付のアクティビティを表します。 |
| `transaction_count` | 整数                | アカウントが当該日付に送信したトランザクションの合計数。 |
| `result`            | オブジェクト                 | 当該日付でこのアカウントが送信したトランザクションで発生した各結果コードの数を示す[トランザクション結果コード](transaction-results.html)のマップ。 |
| `type`              | オブジェクト                 | アカウントが当該日付に送信した各トランザクションタイプの数を示す[トランザクションタイプ](transaction-formats.html)のマップ。 |

#### 例

要求:

```
GET /v2/accounts/rGFuMiw48HdbnrUbkRYuitXTmfrDBNTCnX/stats/transactions?start=2015-01-01&limit=2
```

応答:

```
200 OK
{
 "result": "success",
 "count": 2,
 "marker": "rGFuMiw48HdbnrUbkRYuitXTmfrDBNTCnX|20150116000000",
 "rows": [
   {
     "date": "2015-01-14T00:00:00Z",
     "transaction_count": 44,
     "result": {
       "tecUNFUNDED_PAYMENT": 1,
       "tesSUCCESS": 43
     },
     "type": {
       "Payment": 42,
       "TrustSet": 2
     }
   },
   {
     "date": "2015-01-15T00:00:00Z",
     "transaction_count": 116,
     "result": {
       "tesSUCCESS": 116
     },
     "type": {
       "Payment": 116
     }
   }
 ]
}
```



## Get Account Value Stats
[[ソース]<br>](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/accountStats.js "Source")

アカウントのトランザクションアクティビティの日次サマリーを取得します。_（新規: [v2.1.0][]）_

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/accounts/{address}/stats/value
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](data-api-v2-tool.html#get-account-value-stats)

このメソッドには以下のURLパラメーターを指定する必要があります。

| フィールド     | 値  | 説明                  |
|:----------|:-------|:-----------------------------|
| `address` | 文字列 | 照会するXRP Ledgerアドレス。 |


オプションで、以下のクエリーパラメーターを指定できます。

| フィールド        | 値                  | 説明                          |
|:-------------|:-----------------------|:-------------------------------------|
| `start`      | 文字列 - [タイムスタンプ][] | 照会範囲の開始時刻。デフォルトは、最新間隔の開始時刻です。 |
| `end`        | 文字列 - [タイムスタンプ][] | 照会範囲の終了時刻。デフォルトは、最新間隔の終了時刻です。 |
| `limit`      | 整数                | ページあたりの最大結果件数。デフォルトは200です。1000を超える値は指定できません。 |
| `marker`     | 文字列                 | 前に返された応答の[ページネーション](#ページネーション)キー。 |
| `descending` | ブール値                | `true`の場合は、結果が最新のものから順にソートされます。デフォルトでは、結果が最も古いものから順にソートされます。 |
| `format`     | 文字列                 | 返される結果のフォーマットは`csv`または`json`です。デフォルトは`json`です。 |


#### 応答フォーマット
成功した場合の応答では、HTTPコード**200 OK**と以下の内容のJSON本文が返されます。

| フィールド    | 値                        | 説明                        |
|:---------|:-----------------------------|:-----------------------------------|
| `result` | 文字列                       | 値が`success`の場合は、成功した場合の応答であることを示します。 |
| `count`  | 整数                      | `rows`フィールドに含まれている価値統計情報オブジェクトの数。 |
| `rows`   | 価値統計情報オブジェクトの配列。 | 指定されたアカウントのアカウント価値の日次サマリー。 |

各価値統計情報オブジェクトのフィールドを次に示します。

| フィールド                  | 値                  | 説明                |
|:-----------------------|:-----------------------|:---------------------------|
| `date`                 | 文字列 - [タイムスタンプ][] | このオブジェクトは、当該日付のアクティビティを表します。 |
| `value`                | [文字列 - 数値][]    | このアカウントが保有しているすべての通貨の合計額（XRPに正規化）。 |
| `balance_change_count` | 数値                 | 当該日付でアカウントの残高が変更された回数。 |

#### 例

要求:

```
GET /v2/accounts/rGFuMiw48HdbnrUbkRYuitXTmfrDBNTCnX/stats/value?limit=2&descending=true
```

応答:

```
200 OK
{
 "result": "success",
 "count": 2,
 "marker": "rGFuMiw48HdbnrUbkRYuitXTmfrDBNTCnX|20160412000000",
 "rows": [
   {
     "date": "2016-04-14T00:00:00Z",
     "account_value": "7.666658705139822E7",
     "balance_change_count": 58
   },
   {
     "date": "2016-04-13T00:00:00Z",
     "account_value": "1.0022208004947332E8",
     "balance_change_count": 184
   }
 ]
}
```




## Health Check - API
[[ソース]<br>](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/checkHealth.js "Source")

APIサービスの健全性をチェックします。

<!-- MULTICODE_BLOCK_START -->

*REST*

```
GET /v2/health/api
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](data-api-v2-tool.html#api-health-check)

オプションで、以下のクエリーパラメーターを指定できます。

| フィールド       | 値   | 説明                                          |
|:------------|:--------|:-----------------------------------------------------|
| `threshold` | 整数 | データベースがこの期間（秒単位）内に応答しない場合、APIが正常ではないと見なされます。デフォルトは5秒です。 |
| `verbose`   | ブール値 | `true`の場合は、データポイントが含まれているJSON応答が返されます。デフォルトでは整数値のみが返されます。 |

#### 応答フォーマット

成功した場合の応答では、HTTPコード**200 OK**が返されます。デフォルトでは、応答本文には**整数の正常値のみ**が含まれます。

正常値`0`は常に、正常な状況を示します。その他の正常値の定義を次に示します。

| 値 | 意味                                                              |
|:------|:---------------------------------------------------------------------|
| `0`   | APIサービスが稼働しており、HBaseに対する応答時間は要求の`threshold`値未満である。 |
| `1`   | APIサービスが稼働しており、HBaseに対する応答時間は要求の`threshold`値を超えている。 |

要求のクエリーパラメーターに`verbose=true`が指定されている場合、応答本文は以下のフィールドを含むJSONオブジェクトです。

| フィールド                     | 値                        | 説明       |
|:--------------------------|:-----------------------------|:------------------|
| `score`                   | 0-1                          | 前述のように定義される正常値。 |
| `response_time`           | 文字列 - 人間が読める形式の時間 | データベースの実際の応答時間。 |
| `response_time_threshold` | 文字列 - 人間が読める形式の時間 | 正常と見なされる最大応答時間。 |

#### 例

要求:

```
GET /v2/health/api?verbose=true
```

応答:

```
200 OK
{
 "score": 0,
 "response_time": "0.014s",
 "response_time_threshold": "5s"
}
```


## Health Check - Ledger Importer
[[ソース]<br>](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/checkHealth.js "Source")

Ledger Importer Serviceの健全性をチェックします。

<!-- MULTICODE_BLOCK_START -->

*REST - Importerの健全性*

```
GET /v2/health/importer
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](data-api-v2-tool.html#importer-health-check)

オプションで、以下のクエリーパラメーターを指定できます。

| フィールド        | 値   | 説明                                         |
|:-------------|:--------|:----------------------------------------------------|
| `threshold`  | 整数 | 最新の検証済みレジャーのインポート後に経過時間がこの時間（秒単位）を超えると、Importerは正常ではないと見なされます。デフォルトは300秒です。 |
| `threshold2` | 整数 | あらゆる種類の最新レジャーのインポート後に経過時間がこの時間（秒単位）を超えると、Importerは正常ではないと見なされます。デフォルトは60秒です。 |
| `verbose`    | ブール値 | `true`の場合は、データポイントが含まれているJSON応答が返されます。デフォルトでは整数値のみが返されます。 |

#### 応答フォーマット

成功した場合の応答では、HTTPコード**200 OK**が返されます。デフォルトでは、応答本文には**整数の正常値のみ**が含まれます。

正常値`0`は常に、正常な状況を示します。その他の正常値の定義を次に示します。

| 値 | 意味                                                              |
|:------|:---------------------------------------------------------------------|
| `0`   | 最後にインポートされたレジャーの経過時間が`threshold2` （デフォルト: 60）秒よりも短く、最新の検証済みレジャーの経過時間が`threshold` 秒よりも短い。 |
| `1`   | 最後にインポートされたレジャーの経過時間が`threshold2` （デフォルト: 60）秒よりも短く、最新の検証済みレジャーの経過時間が`threshold` 秒よりも長い。 |
| `2`   | 最後にインポートされたレジャーの経過時間が`threshold2` 秒よりも長い。 |

要求のクエリーパラメーターに`verbose=true`が指定されている場合、応答本文は以下のフィールドを含むJSONオブジェクトです。

| フィールド                      | 値                        | 説明      |
|:---------------------------|:-----------------------------|:-----------------|
| `score`                    | 0-2                          | 前述のように定義される正常値。 |
| `response_time`            | 文字列                       | データベースの実際の応答時間。 |
| `ledger_gap`               | 文字列 - 人間が読める形式の時間 | 最後に保存されたレジャーの閉鎖時刻と現在の時刻の差。 |
| `ledger_gap_threshold`     | 文字列 - 人間が読める形式の時間 | 正常と見なされる最大レジャーギャップ。 |
| `valildation_gap`          | 文字列 - 人間が読める形式の時間 | 最後にインポートされた検証済みレジャーの閉鎖時刻と現在の時刻の差。 |
| `validation_gap_threshold` | 文字列 - 人間が読める形式の時間 | 正常と見なされる最大検証ギャップ。 |

#### 例

要求:

```
GET /v2/health/importer?verbose=true
```

応答:

```
200 OK
{
   "score": 0,
   "response_time": "0.081s",
   "ledger_gap": "1.891s",
   "ledger_gap_threshold": "5.00m",
   "validation_gap": "29.894s",
   "validation_gap_threshold": "15.00m"
}
```



## Health Check - Nodes ETL
[[ソース]<br>](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/checkHealth.js "Source")

Topology Nodes Extract, Transform, Load（ETL）Serviceの健全性をチェックします。

<!-- MULTICODE_BLOCK_START -->

*REST - Nodes ETLの健全性*

```
GET /v2/health/nodes_etl
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](data-api-v2-tool.html#nodes-etl-health-check)

オプションで、以下のクエリーパラメーターを指定できます。

| フィールド       | 値   | 説明                                          |
|:------------|:--------|:-----------------------------------------------------|
| `threshold` | 整数 | 最新データインポート後の経過時間がこの時間（秒単位）を超えると、このサービスは正常でないと見なされます。デフォルトは120秒です。 |
| `verbose`   | ブール値 | `true`の場合は、データポイントが含まれているJSON応答が返されます。デフォルトでは整数値のみが返されます。 |

#### 応答フォーマット

成功した場合の応答では、HTTPコード**200 OK**が返されます。デフォルトでは、応答本文には**整数の正常値のみ**が含まれます。

正常値`0`は常に、正常な状況を示します。その他の正常値の定義を次に示します。

| 値 | 意味                                                              |
|:------|:---------------------------------------------------------------------|
| `0`   | 最後のトポロジーデータインポート後の経過時間が`threshold` の秒数（デフォルト: 120）よりも短い。 |
| `1`   | 最後のトポロジーデータインポート後の経過時間が`threshold`の秒数よりも長い。 |


要求のクエリーパラメーターに`verbose=true`が指定されている場合、応答本文は以下のフィールドを含むJSONオブジェクトです。

| フィールド           | 値                        | 説明                 |
|:----------------|:-----------------------------|:----------------------------|
| `score`         | 0-1                          | 前述のように定義される正常値。 |
| `gap`           | 文字列 - 人間が読める形式の時間 | データが最後にインポートされた時点と現在の時刻の差。 |
| `gap_threshold` | 文字列 - 人間が読める形式の時間 | 正常と見なされる最大ギャップ。 |
| `message`       | 文字列                       | ゼロ以外のスコアの理由の説明（該当する場合）。 |

#### 例

要求:

```
GET /v2/health/nodes_etl?verbose=true
```

応答:

```
200 OK
{
 "score": 0,
 "gap": "1.891s",
 "gap_threshold": "2.00m",
}
```



## Health Check - Validations ETL
[[ソース]<br>](https://github.com/ripple/rippled-historical-database/blob/master/api/routes/checkHealth.js "Source")

Validations Extract, Transform, Load（ETL）Serviceの健全性をチェックします。

<!-- MULTICODE_BLOCK_START -->

*REST - Validations ETLの健全性*

```
GET /v2/health/validations_etl
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](data-api-v2-tool.html#validations-etl-health-check)

オプションで、以下のクエリーパラメーターを指定できます。

| フィールド       | 値   | 説明                                          |
|:------------|:--------|:-----------------------------------------------------|
| `threshold` | 整数 | 最新データインポート後の経過時間がこの時間（秒単位）を超えると、このサービスは正常でないと見なされます。デフォルトは120秒です。 |
| `verbose`   | ブール値 | `true`の場合は、データポイントが含まれているJSON応答が返されます。デフォルトでは整数値のみが返されます。 |

#### 応答フォーマット

成功した場合の応答では、HTTPコード**200 OK**が返されます。デフォルトでは、応答本文には**整数の正常値のみ**が含まれます。

正常値`0`は常に、正常な状況を示します。その他の正常値の定義を次に示します。

| 値 | 意味                                                              |
|:------|:---------------------------------------------------------------------|
| `0`   | 最後のトポロジーデータインポート後の経過時間が`threshold` の秒数（デフォルト: 120）よりも短い。 |
| `1`   | 最後のトポロジーデータインポート後の経過時間が`threshold`の秒数よりも長い。 |

要求のクエリーパラメーターに`verbose=true`が指定されている場合、応答本文は以下のフィールドを含むJSONオブジェクトです。

| フィールド           | 値                        | 説明                 |
|:----------------|:-----------------------------|:----------------------------|
| `score`         | 0-1                          | 前述のように定義される正常値。 |
| `gap`           | 文字列 - 人間が読める形式の時間 | データが最後にインポートされた時点と現在の時刻の差。 |
| `gap_threshold` | 文字列 - 人間が読める形式の時間 | 正常と見なされる最大ギャップ。 |
| `message`       | 文字列                       | ゼロ以外のスコアの理由の説明（該当する場合）。 |

#### 例

要求:

```
GET /v2/health/nodes_etl?verbose=true
```

応答:

```
200 OK
{
 "score": 0,
 "gap": "1.891s",
 "gap_threshold": "2.00m",
}
```




# APIの規則

## 基本的なデータ型

REST APIであるData API v2では[JSON](http://json.org/)のネイティブデータ型を使用してAPIフィールドが表されます（特殊なケースがいくつかあります）。

### 数値と精度
[文字列 - 数値]: #数値と精度

{% include '_snippets/string-number-formatting.md' %}

XRP Ledgerでの**XRP以外の通貨**の額の精度は次のようになります。

* 非ゼロの最小絶対値: `1000000000000000e-96`
* 最大値: `9999999999999999e80`
* 最小値: `-9999999999999999e80`
* 10進15桁の精度

**XRP**の内部表現は異なり、その精度も異なります。

* 最小値: `0`
* 最大値: `100000000000`（`1e11`）
* `0.000001`（`1e-6`）に近い精度。

つまりXRPの精度は、64ビット符号なし整数と同等であり、各単位は0.000001 XRPに相当します。

### アドレス
[アドレス]: #アドレス

{% include '_snippets/data_types/address.md' %}


### 公開鍵
[公開鍵]: #公開鍵

{% include '_snippets/data_types/public_key.md' %}


### ハッシュ
[ハッシュ]: #ハッシュ

{% include '_snippets/data_types/hash.md' %}


### タイムスタンプ
[タイムスタンプ]: #タイムスタンプ

すべての日付と時刻はISO 8601 Timestamp Formatで記述され、UTCを使用しています。このフォーマットをまとめると次のようになります。

`YYYY-MM-DDThh:mm:ssZ`

* 4桁の年
* 2桁の月
* 2桁の日
* データ部分と時間部分が文字`T`で区切られています。
* 2桁の時間（24時間制）
* 2桁の分
* UTCからのゼロオフセットを示す文字`Z` 。

（[v2.0.4][]の時点では、オフセット`+00:00`は使用されていません。）

### レジャーインデックス
[レジャーインデックス]: #レジャーインデックス

{% include '_snippets/data_types/ledger_index.md' %}

### アカウントシーケンス
[シーケンス番号]: #アカウントシーケンス

{% include '_snippets/data_types/account_sequence.md' %}

### 通貨コード
[通貨コード]: #通貨コード

{% include '_snippets/data_types/currency_code.md' %}

## ページネーション

多くのクエリーは、1つのHTTP応答で返すのに適量を上回る大量のデータを返します。Data APIでは、1つの応答（ページ）で返すデータの量を制御し、追加の内容を照会する「制限とマーカー」システムが採用されています。

多くの要求の`limit`クエリーパラメーターは、応答に含まれる結果の数を特定の数に限定します。結果の型とデフォルト値はメソッドに応じて異なります。ほとんどのメソッドでは、`limit`のデフォルト値は**200**で、最大で**1000**まで設定できます。この最大値を超える`limit`値を指定しても、APIはこの最大値を使用します。

現在の応答に含まれていない追加オブジェクトがクエリーに含まれている場合、JSON応答には、追加の結果を取得できることを示す最上位フィールド`marker`が含まれます。このためには、`marker`フィールドの前の値を`marker`クエリーパラメーターとして指定した複数の要求を追加で実行します。個々の追加要求では、1番目の要求と同じパラメーター（`marker`を除く）を使用します。応答にて`marker`パラメーターが省略されている場合は、照会可能なデータの最後に達したことを示しています。

`marker`が含まれている場合は、応答の[`Link`ヘッダー](https://tools.ietf.org/html/rfc5988#section-5)に`rel="next"`が指定されています。これは、次の結果ページの完全なURLです。応答が`json`ではなく`csv`フォーマットである場合は、これを使用して結果をページネーションできます。_（新規: [v2.0.4][]）_

## トランザクションオブジェクト

トランザクションには、簡潔な「バイナリ」フォーマットと拡張フォーマットの2種類があります。バイナリフォーマットでは、トランザクションを定義するフィールドが16進文字列としてエンコードされており、拡張フォーマットではトランザクションを定義するフィールドが完全なJSONオブジェクトとして入れ子になっています。

### 完全なJSONフォーマット

| フィールド          | 値                     | 説明                     |
|:---------------|:--------------------------|:--------------------------------|
| `hash`         | 文字列 - [ハッシュ][]         | このトランザクションに固有の識別用ハッシュ値（16進文字列）。 |
| `date`         | 文字列 - [タイムスタンプ][]    | トランザクションが検証済みレジャーに追加された時刻。 |
| `ledger_index` | 数値 - [レジャーインデックス][] | このレジャーが含まれているレジャーのシーケンス番号。 |
| `tx`           | オブジェクト                    | このトランザクションオブジェクトのフィールド。[トランザクションのフォーマット](transaction-formats.html)により定義されます。 |
| `meta`         | オブジェクト                    | このトランザクションの結果に関するメタデータ。 |

### バイナリフォーマット

| フィールド          | 値                     | 説明                     |
|:---------------|:--------------------------|:--------------------------------|
| `hash`         | 文字列 - [ハッシュ][]         | このトランザクションに固有の識別用ハッシュ値（16進文字列）。 |
| `date`         | 文字列 - [タイムスタンプ][]    | トランザクションが検証済みレジャーに追加された時刻。 |
| `ledger_index` | 数値 - [レジャーインデックス][] | このレジャーが含まれているレジャーのシーケンス番号。 |
| `tx`           | 文字列                    | このトランザクションを表すバイナリデータ（16進文字列）。 |
| `meta`         | 文字列                    | このトランザクションのメタデータを表すバイナリデータ（16進文字列）。 |

## レジャーオブジェクト

「レジャー」とは、共有グローバルレジャーの1バージョンです。各レジャーオブジェクトのフィールドを次に示します。

| フィールド               | 値                     | 説明                |
|:--------------------|:--------------------------|:---------------------------|
| `ledger_hash`       | 文字列 - [ハッシュ][]         | このレジャーに固有の識別用ハッシュ値（16進文字列）。 |
| `ledger_index`      | 数値 - [レジャーインデックス][] | このレジャーのシーケンス番号。新しいレジャーのレジャーインデックスは、その直前のレジャーに1を加算した値になります。 |
| `parent_hash`       | 文字列 - [ハッシュ][]         | 前のレジャーの識別用ハッシュ。 |
| `total_coins`       | [文字列 - 数値][]       | このレジャーの時点で存在していたXRPのdrops数の合計。（1 XRPは1,000,000 dropに相当します。） |
| `close_time_res`    | 数値                    | レジャー閉鎖時刻はこの秒数で丸められます。 |
| `accounts_hash`     | 文字列 - [ハッシュ][]         | このレジャーに含まれているアカウント情報のハッシュ（16進数）。 |
| `transactions_hash` | 文字列 - [ハッシュ][]         | このレジャーに含まれているトランザクション情報のハッシュ（16進数）。 |
| `close_time`        | 数値                    | UNIX時間でのこのレジャーの閉鎖時刻。 |
| `close_time_human`  | 文字列 - [タイムスタンプ][]    | このレジャーが閉鎖された時刻。 |

**注記:** レジャーの閉鎖時刻はおおよその時刻であり、通常10秒単位で丸められます。2つのレジャーの実際の閉鎖時刻の差が数秒程度の場合、それらの`close_time`の値が同一となることがあります。レジャーのシーケンス番号（`ledger_index`）により、どのレジャーが最初に閉鎖したのかが明確になります。

### ジェネシスレジャー

XRP Ledgerの運用開始当初に起きた事故により、1～32569番目までのレジャーが失われました。このため、現存する一番最初のレジャーは番号32570のレジャーです。Data API v2の目的上、番号32570のレジャーは _ジェネシスレジャー_ と見なされます。

## アカウント作成オブジェクト

アカウント作成オブジェクトは、XRP Ledgerでのアカウント作成アクションを表します。アカウントがレジャー32570（最も古いレジャー）にすでに含まれていたかどうかに応じて、2種類のバリエーションがあります。レジャー32570にすでに含まれていたアカウントは _ジェネシスアカウント_ と呼ばれます。

| フィールド             | 値                        | 説明               |
|:------------------|:-----------------------------|:--------------------------|
| `address`         | 文字列 - [アドレス][]         | このアカウントの識別用アドレス（base-58）。 |
| `inception`       | 文字列 - [タイムスタンプ][]       | このアドレスに資金が供給された時点のUTCタイムスタンプ。ジェネシスアカウントの場合、これはレジャー32570のタイムスタンプです。 |
| `ledger_index`    | 数値 - [レジャーインデックス][]    | アカウントが作成された時点でのレジャーのシーケンス番号。ジェネシスアカウントの場合は32570です。 |
| `parent`          | 文字列 - [アドレス][]         | （ジェネシスアカウントの場合は省略）このアドレスに資金供給するためにXRPを提供したアドレス。 |
| `tx_hash`         | 文字列 - [ハッシュ][]            | （ジェネシスアカウントの場合は省略）このアカウントに資金供給したトランザクションの識別用ハッシュ。 |
| `initial_balance` | [文字列 - 数値][]          | （ジェネシスアカウントの場合は省略）このアカウントに供給されたXRPの額。 |
| `genesis_balance` | [文字列 - 数値][]          | （ジェネシスアカウントのみ）レジャー番号32570の時点でこのアカウントが保有していたXRPの額。 |
| `genesis_index`   | 数値 - [シーケンス番号][] | （ジェネシスアカウントのみ）レジャー番号32570の時点でのこのアカウントのトランザクションシーケンス番号。 |


## 取引オブジェクト
[取引オブジェクト]: #取引オブジェクト

取引オブジェクトは、実際の通貨取引を表します。この取引は、OfferCreateトランザクションまたはPaymentトランザクションを実行した結果として、XRP Ledgerで発生します。通貨が実際に取引されるには、OfferCreateトランザクションを使用してレジャーで以前に発注され、約定しなかったオファーが存在している必要があります。

1つのトランザクションで複数の取引を実行できます。この場合、どの取引においてもトランザクションの送信者がTakerとなりますが、プロバイダーと通貨ペアのいずれかまたはその両方は取引ごとに異なります。

| フィールド                  | 値                        | 説明          |
|:-----------------------|:-----------------------------|:---------------------|
| `base_amount`          | 数値                       | 取引されたベース通貨の額。 |
| `counter_amount`       | 数値                       | 取引されたクオート通貨の額。 |
| `rate`                 | 数値                       | ベース通貨1単位で獲得できるクオート通貨の額。 |
| `autobridged_currency` | 文字列 - [通貨コード][]   | （省略される場合があります）オファーがオートブリッジングされていた場合（XRPオーダーブックを使用して2つのXRP以外の通貨がブリッジングされていた場合）、この取引を実行したオファーのもう一方の通貨です。 |
| `autobridged_issuer`   | 文字列 - [アドレス][]         | （省略される場合があります）オファーがオートブリッジングされていた場合（XRPオーダーブックを使用して2つのXRP以外の通貨がブリッジングされていた場合）、この取引を実行したオファーのもう一方のイシュアーです。 |
| `base_currency`        | 文字列 - [通貨コード][]   | ベース通貨。   |
| `base_issuer`          | 文字列 - [アドレス][]         | （XRPの場合は省略）ベース通貨を発行したアカウント。 |
| `buyer`                | 文字列 - [アドレス][]         | ベース通貨を獲得したアカウント。 |
| `client`               | 文字列                       | （省略される場合があります）トランザクションに、クライアントアプリケーションが送信したメモが含まれている場合、これはメモの内容です。 |
| `counter_currency`     | 文字列 - [通貨コード][]   | クオート通貨。 |
| `counter_issuer`       | 文字列 - [アドレス][]         | （XRPの場合は省略）クオート通貨を発行したアカウント。 |
| `executed_time`        | 文字列 - [タイムスタンプ][]       | 取引が発生した時刻。 |
| `ledger_index`         | 数値 - [レジャーインデックス][]    | このトランザクションが含まれているレジャーのシーケンス番号。 |
| `offer_sequence`       | 数値 - [シーケンス番号][] | このレジャーに含まれている`provider`の既存のオファーのシーケンス番号。 |
| `provider`             | 文字列 - [アドレス][]         | レジャーに既存のオファーが含まれているアカウント。 |
| `seller`               | 文字列 - [アドレス][]         | クオート通貨を獲得したアカウント。 |
| `taker`                | 文字列 - [アドレス][]         | この取引を実行したトランザクションを送信したアカウント。 |
| `tx_hash`              | 文字列 - [ハッシュ][]            | この取引を実行したトランザクションの識別用ハッシュ。（**注記:** この取引は、1つのトランザクションで実行された複数の取引の1つである場合があります。） |
| `tx_type`              | 文字列                       | この取引を実行したトランザクションのタイプ（`Payment`または`OfferCreate`）。 |


## レポートオブジェクト
[レポートオブジェクト]: #レポートオブジェクト

レポートオブジェクトは、特定の間隔（通常は1日）における特定アカウントのアクティビティを示します。レポートには次のフィールドがあります。

| フィールド                      | 値                                | 説明 |
|:---------------------------|:-------------------------------------|:---------|
| `account`                  | 文字列 - [アドレス][]                 | このレポートに関連するアカウントのアドレス。 |
| `date`                     | 文字列 - [タイムスタンプ][]               | このレポートに関連する間隔の開始時刻。 |
| `high_value_received`      | [文字列 - 数値][]                  | 1回のトランザクションで受領した最大額（XRPに正規化、可能な限り近い値）これにはペイメントと取引が含まれます。 |
| `high_value_sent`          | [文字列 - 数値][]                  | 1回のトランザクションで送金した最大額（XRPに正規化、可能な限り近い値）。 |
| `payments`                 | [ペイメントサマリーオブジェクト][]の配列 | （省略される場合があります）この間隔でアカウントが送金または受領した各ペイメントに関する情報の配列。 |
| `payments_received`        | 数値                               | このアカウントに送金されたペイメントの件数。（これには、このアカウントが送金先であるペイメントのみが含まれます。アカウントを通じてRipplingされたペイメントや、アカウントのオファーで消費されたペイメントは含まれません。） |
| `payments_sent`            | 数値                               | このアカウントが送金したペイメントの件数。 |
| `receiving_counterparties` | 配列または数値                      | アカウントリストが要求された場合は、このアカウントからのペイメントを受取ったアドレスの配列。それ以外の場合は、このアカウントからペイメントを受取ったさまざまなアカウントの数。 |
| `sending_counterparties`   | 配列または数値                      | アカウントリストが要求された場合は、このアカウントにペイメントを送信したアドレスの配列。それ以外の場合は、このアカウントにペイメントを送信したさまざまなアカウントの数。 |
| `total_value`              | [文字列 - 数値][]                  | ペイメントで受領および送金された合計額（XRPに正規化、可能な限り近い値）。 |
| `total_value_received`     | [文字列 - 数値][]                  | このアカウントへのすべてのペイメントの合計額（XRPに正規化、可能な限り近い値）。 |
| `total_value_sent`         | [文字列 - 数値][]                  | このアカウントからのすべてのペイメントの合計額（XRPに正規化、可能な限り近い値）。 |

## ペイメントサマリーオブジェクト
[ペイメントサマリーオブジェクト]: #ペイメントサマリーオブジェクト

ペイメントサマリーオブジェクトには、ペイメントの送金元または受取人から見た1つのペイメントに関する限られた量の情報が含まれています。

| フィールド              | 値                      | 説明                |
|:-------------------|:---------------------------|:---------------------------|
| `tx_hash`          | 文字列 - [ハッシュ][]          | このペイメントを発生させたトランザクションの識別用ハッシュ。 |
| `delivered_amount` | [文字列 - 数値][]        | 実際に送金先アカウントが受領した送金先`currency`の額。 |
| `currency`         | 文字列 - [通貨コード][] | トランザクションの受取人に送金された通貨。 |
| `issuer`           | 文字列 - [アドレス][]       | 通貨を発行するゲートウェイ。XRPの場合は空のストリング。 |
| `type`             | 文字列                     | `sent`または`received`のいずれか。これは、パースペクティブアカウントがトランザクションの送金元または受取人のいずれであるかを示します。 |


## ペイメントオブジェクト
[ペイメントオブジェクト]: #ペイメントオブジェクト

Data APIでは、ペイメントオブジェクトはアカウント間で価値が移動したイベントを表します。これはほとんどの場合、`Payment` [トランザクションタイプ](transaction-types.html)のXRP Ledgerトランザクションに対応します。ただし Data APIでは、送金元`Account` と`Destination`アカウントが同一である場合、またはトランザクションが失敗した場合には、トランザクションはペイメントとして見なされません。

ペイメントオブジェクトのフィールドを次に示します。

| フィールド                         | 値                      | 説明     |
|:------------------------------|:---------------------------|:----------------|
| `amount`                      | [文字列 - 数値][]        | トランザクションに対し送金指示があった送金先`currency`の額。Partial Paymentsでは、この額は「最大」額です。 |
| `delivered_amount`            | [文字列 - 数値][]        | 実際に送金先アカウントが受領した送金先`currency`の額。 |
| `destination_balance_changes` | 配列                      | [残高変更オブジェクト][]の配列。このオブジェクトは、`destination`アカウントの残高に対して行われたすべての変更を示します。 |
| `source_balance_changes`      | 配列                      | [残高変更オブジェクト][]の配列。このオブジェクトは、`source`アカウントの残高に対して行われたすべての変更を示します（XRPトランザクションコストを除く）。 |
| `transaction_cost`            | [文字列 - 数値][]        | トランザクションコストに対して`source`アカウントが支払ったXRPの額。（[v2.0.4][]より前のバージョンでは、このパラメーターは`fee`でした。） |
| `destination_tag`             | 整数                    | （省略される場合があります）このペイメントに指定された[送金先タグ](become-an-xrp-ledger-gateway.html#source-and-destination-tags)。 |
| `source_tag`                  | 整数                    | （省略される場合があります）このペイメントに指定された[送金元タグ](become-an-xrp-ledger-gateway.html#source-and-destination-tags)。 |
| `currency`                    | 文字列 - [通貨コード][] | `destination`アカウントが受領した通貨。 |
| `destination`                 | 文字列 - [アドレス][]       | ペイメントを受領したアカウント。 |
| `executed_time`               | 文字列 - [タイムスタンプ][]     | このペイメントが含まれているレジャーが閉鎖した時刻。 |
| `ledger_index`                | 数値 - [レジャーインデックス][]  | このペイメントが含まれているレジャーのシーケンス番号。 |
| `source`                      | 文字列 - [アドレス][]       | ペイメントを送金したアカウント。 |
| `source_currency`             | 文字列 - [通貨コード][] | `source`アカウントが支払った通貨。 |
| `tx_hash`                     | 文字列 - [ハッシュ][]          | このペイメントを発生させたトランザクションの識別用ハッシュ。 |


## 残高オブジェクトと残高変更オブジェクト
[残高変更オブジェクト]: #残高オブジェクトと残高変更オブジェクト
[残高オブジェクト]: #残高オブジェクトと残高変更オブジェクト

残高オブジェクトは、特定時点での特定の相手側に対する特定通貨でのXRP Ledgerアカウントの残高です。残高変更オブジェクトは、トランザクションの実行時に発生するこのような残高に対する変更を表します。

1つのXRP Ledgerトランザクションで、複数の相手側に対する残高の変更と、XRPの変更が行われることがあります。

残高オブジェクトと残高変更オブジェクトのフォーマットは同一であり、これらのオブジェクトには次のフィールドが含まれています。

| フィールド          | 値                      | 説明                    |
|:---------------|:---------------------------|:-------------------------------|
| `counterparty` | 文字列 - [アドレス][]       | `currency`の取引相手またはイシュアー。XRPの場合これは空の文字列です。 |
| `currency`     | 文字列 - [通貨コード][] | この残高が変更された通貨。 |
| `value`        | [文字列 - 数値][]        | 関連付けられているアカウントが獲得または喪失した`currency`の額。残高変更オブジェクトでは、この値がプラスの場合（獲得した額）とマイナスの場合（喪失した額）があります。残高オブジェクトでは、この値がプラスの場合（このアカウントに対して相手側が支払う義務のある額）とマイナスの場合（相手側に対して支払う義務のある額）があります。 |


## 残高変更記述
[残高変更記述]: #残高変更記述

残高変更記述は、トランザクションの実行時に発生する1つの残高変更を記述、分析するオブジェクトです。[残高変更オブジェクト][]と同じイベントを表しますが、残高変更オブジェクトよりも詳細です。

残高変更記述のフィールドを次に示します。

| フィールド           | 値                      | 説明                   |
|:----------------|:---------------------------|:------------------------------|
| `amount_change` | [文字列 - 数値][]        | この変更前後での保有通貨額の差。_（[v2.0.6][]より前のバージョンでは、このフィールドは`change`でした。）_ |
| `final_balance` | [文字列 - 数値][]        | 変更後の残高。 |
| `node_index`    | 数値（または`null`）         | この残高変更は、残高変更を実行したトランザクションのメタデータセクション内にて、ModifiedNodes配列のこのインデックスの位置にあるエントリーで表されます。**注記:** トランザクションコストがXRP残高に対する他の変更と結合されている場合、トランザクションコストの`node_index`は**null**になります。 |
| `tx_index`      | 数値                     | この残高変更を実行したトランザクションは、トランザクションが記録されているレジャーのトランザクション配列のこのインデックスにあります。 |
| `change_type`   | 文字列                     | この残高変更が発生した原因を示すさまざまな[](#変更タイプ)のうちの1つ。 |
| `currency`      | 文字列 - [通貨コード][] | この通貨に影響する変更。 |
| `executed_time` | 文字列 - [タイムスタンプ][]     | 変更が発生した時刻。（変更を実行したトランザクションが記録されているレジャーの閉鎖時間に基づいています。） |
| `counterparty`  | 文字列 - [アドレス][]       | （XRPの場合は省略）`currency`はこのアカウントとの間のトラストラインに保有されています。_（[v2.0.6][]より前のバージョンでは、このフィールドは`issuer`でした。）_ |
| `ledger_index`  | 数値 - [レジャーインデックス][]  | この残高変更を実行したトランザクションを含むレジャーのシーケンス番号。 |
| `tx_hash`       | 文字列 - [ハッシュ][]          | この残高変更を実行したトランザクションの識別用ハッシュ。 |

### 変更タイプ

残高変更記述の`change_type`フィールドで有効な値を以下に示します。

| 値                 | 意味                                              |
|:----------------------|:-----------------------------------------------------|
| `transaction_cost`    | これは、トランザクションの中継時にXRPが消却されたことによる残高変更を表します。_（[v2.0.4][]より前では、これは`network fee`でした。）_ |
| `payment_destination` | これは、ペイメントとして通貨を受領したことによる残高変更を表します。 |
| `payment_source`      | これは、ペイメントとして通貨を支払ったことによる残高変更を表します。 |
| `exchange`            | これは、他の通貨への取引や、別のイシュア―との同一通貨での取引による残高変更を表します。これは、オファーにより発生するだけでなく、ペイメント実行中にも発生する可能性があります。 |

## 取引量オブジェクト
[取引量オブジェクト]: #取引量オブジェクト

取引量オブジェクトは、特定の期間にペイメントや取引により移動した資金の合計取引量を表します。

| フィールド           | 値                  | 説明                       |
|:----------------|:-----------------------|:----------------------------------|
| `components`    | オブジェクトの配列       | この合計の計算に使用されたデータ。ペイメント取引量の場合、各オブジェクトは特定の通貨およびイシュアーでのペイメントを表します。取引量の場合、各オブジェクトは2通貨間のマーケットを表します。 |
| `count`         | 数値                 | この期間における取引の合計件数。 |
| `end_time`      | 文字列 - [タイムスタンプ][] | この間隔の終了時刻。    |
| `exchange`      | オブジェクト                 | `currency`および（XRPの場合を除く） `issuer`フィールドと同様、使用される表示通貨を示します。すべての額は、最初にXRPに交換され、その後要求で指定されている表示通貨に変換されることで正規化されます。 |
| `exchange_rate` | 数値                 | XRPから表示通貨への為替レート。 |
| `start_time`    | 文字列 - [タイムスタンプ][] | この期間の開始時刻。         |
| `total`         | 数値                 | 当該期間に記録されたすべての取引の合計取引量。 |


## サーバーオブジェクト
[サーバーオブジェクト]: #サーバーオブジェクト
[サーバーオブジェクト]: #サーバーオブジェクト

「サーバーオブジェクト」は、XRP Ledgerピアツーピアネットワークの1つの`rippled`サーバーを表します。サーバーオブジェクトは[Get Topology](#get-topology)、[Get Toplogy Nodes](#get-topology-nodes)、および[Get Topology Node](#get-topology-node)メソッドで返されます。Data APIは、[ピアクローラー](peer-crawler.html)を使用して、報告されるネットワークトポロジーを約30秒間隔で収集します。

サーバーオブジェクトのフィールドを次に示します。一部のフィールドは、要求で応答がverboseであることが指定されている場合にのみ表示されます。

| フィールド              | 値                           | 説明           |
|:-------------------|:--------------------------------|:----------------------|
| `node_public_key`  | 文字列 - Base-58 [公開鍵][] | このサーバーがピアツーピア通信に署名するときに使用する公開鍵（検証は含まれません）。 |
| `version`          | 文字列                          | 最後に照会された時点でのこのサーバーの`rippled`バージョン。 |
| `uptime`           | 整数                         | このサーバーがネットワークに接続していた秒数。 |
| `ip`               | 文字列                          | （省略される場合があります）ノードのIPアドレス。 |
| `port`             | 整数                         | （省略される場合があります）このサーバーが[`rippled`ピアプロトコル](peer-protocol.html)を使用するポート。 |
| `inbound_count`    | 整数                         | （省略される場合があります）このサーバーへの着信ピアツーピア接続の数。 |
| `inbound_added`    | 文字列                          | （省略される場合があります）最終測定以降に追加された新規着信ピアツーピア接続の数。 |
| `inbound_dropped`  | 文字列                          | （省略される場合があります）最終測定以降に削除された着信ピアツーピア接続の数。 |
| `outbound_count`   | 整数                         | （省略される場合があります）このサーバーへの発信ピアツーピア接続の数。 |
| `outbound_added`   | 文字列                          | （省略される場合があります）最終測定以降に削除された新規発信ピアツーピア接続の数。 |
| `outbound_dropped` | 文字列                          | （省略される場合があります）最終測定以降に削除された発信ピアツーピア接続の数。 |
| `city`             | 文字列                          | （verboseが設定されている場合のみ）IP位置情報に基づくこのサーバーの所在地の市町村。 |
| `region`           | 文字列                          | （verboseが設定されている場合のみ）IP位置情報に基づくこのサーバーの所在地の地域。 |
| `country`          | 文字列                          | （verboseが設定されている場合のみ）IP位置情報に基づくこのサーバーの所在地の国。 |
| `region_code`      | 文字列                          | （verboseが設定されている場合のみ）IP位置情報に基づくこのサーバーの所在地の地域のISOコード。 |
| `country_code`     | 文字列                          | （verboseが設定されている場合のみ）IP位置情報に基づくこのサーバーの所在地の国のISOコード。 |
| `postal_code`      | 文字列                          | （verboseが設定されている場合のみ）IP位置情報に基づくこのサーバーの所在地の郵便番号。 |
| `timezone`         | 文字列                          | （verboseが設定されている場合のみ）IP位置情報に基づくこのサーバーの所在地のISOタイムゾーン。 |
| `lat`              | 文字列                          | （verboseが設定されている場合のみ）IP位置情報に基づくこのサーバーの所在地の緯度。 |
| `long`             | 文字列                          | （verboseが設定されている場合のみ）IP位置情報に基づくこのサーバーの所在地の経度。 |
| `isp`              | 文字列                          | （verboseが設定されている場合のみ）このサーバーのパブリックIPアドレスをホストするインターネットサービスプロバイダー。 |
| `org`              | 文字列                          | （verboseが設定されている場合のみ）このサーバーのパブリックIPアドレスを所有する組織。 |


## リンクオブジェクト
[リンクオブジェクト]: #リンクオブジェクト
[リンクオブジェクト]: #リンクオブジェクト

リンクオブジェクトは、2つの`rippled`サーバー間のピアツーピアネットワーク接続を表します。次のフィールドが含まれています。

| フィールド    | 値                           | 説明                     |
|:---------|:--------------------------------|:--------------------------------|
| `source` | 文字列 - Base-58 [公開鍵][] | 発信接続を行う`rippled`のノード公開鍵。 |
| `target` | 文字列 - Base-58 [公開鍵][] | 着信接続を受け取る`rippled`のノード公開鍵。 |


## 検証オブジェクト
[検証オブジェクト]: #検証オブジェクト
[検証オブジェクト]: #検証オブジェクト

検証オブジェクトは、レジャーバージョンを検証済みにするためにバリデータが投じる1票を表します。（レジャーは、同一のレジャーバージョンに対して投票した信頼できるバリデータの数が定数に達した場合に、コンセンサスプロセスによってのみ検証済みになります。）

**注記:** Data APIは検証投票データを6か月間だけ保持します。

検証オブジェクトのフィールドを次に示します。

| フィールド                   | 値                           | 説明      |
|:------------------------|:--------------------------------|:-----------------|
| `count`                 | 整数                         | （省略される場合があります）この検証を参照した旨を報告した`rippled`サーバーの数。古いデータでは使用できません。 |
| `ledger_hash`           | 文字列 - [ハッシュ][]               | この検証投票が適用されるレジャーバージョンのハッシュ。 |
| `reporter_public_key`   | 文字列 - Base-58 [公開鍵][] | 最初にこの検証を報告した`rippled`サーバーの公開鍵（base-58）。 |
| `validation_public_key` | 文字列 - Base-58 [公開鍵][] | この検証の署名に使用されたバリデータの公開鍵（base-58）。 |
| `signature`             | 文字列                          | 検証内容についてのバリデータの署名（16進数）。 |
| `first_datetime`        | 文字列 - [タイムスタンプ][]          | この検証の最初の報告の日時。 |
| `last_datetime`         | 文字列 - [タイムスタンプ][]          | この検証の最終報告の日時。 |




<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
