---
seo:
    description: オーダーブックと呼ばれる、2つの通貨間のオファーのリストを取得します。
labels:
  - 分散型取引所
  - クロスカレンシー
---
# book_offers
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/BookOffers.cpp "Source")

`book_offers`メソッドは、2つの通貨間の[オファー](../../../../concepts/tokens/decentralized-exchange/offers.md)のリストを取得します。これは、_オーダーブック_ とも呼ばれます。レスポンスは、[資金供給のないオファー](../../../../concepts/tokens/decentralized-exchange/offers.md#オファーのライフサイクル)を省略し、残りの各オファーの合計に対して資金供給されている割合を報告します。

## リクエストのフォーマット
リクエストのフォーマットの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 4,
  "command": "book_offers",
  "taker": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
  "taker_gets": {
    "currency": "XRP"
  },
  "taker_pays": {
    "currency": "USD",
    "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
  },
  "limit": 10
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "book_offers",
    "params": [
        {
            "taker": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
            "taker_gets": {
                "currency": "XRP"
            },
            "taker_pays": {
                "currency": "USD",
                "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
            },
            "limit": 10
        }
    ]
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
#Syntax: book_offers taker_pays taker_gets [taker [ledger [limit] ] ]
rippled book_offers 'USD/rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B' 'EUR/rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B'
```
{% /tab %}

{% /tabs %}

{% try-it method="book_offers" /%}

リクエストには以下のパラメーターが含まれます。

| フィールド     | 型                       | 必須?  | 説明                           |
|:---------------|:-------------------------|:-------|:-------------------------------|
| `taker_gets`   | オブジェクト             | はい   | オファーを受諾するアカウントが受け取る通貨を、[通貨額][通貨額]と同様に、`currency`フィールドと`issuer`フィールドを持つオブジェクトとして指定します（XRPの場合はissuerを省略）。 |
| `taker_pays`   | オブジェクト             | はい   | オファーを受諾するアカウントが支払う通貨を、[通貨額][通貨額]と同様に、`currency`フィールドと`issuer`フィールドを持つオブジェクトとして指定します（XRPの場合はissuerを省略）。 |
| `domain`       | [ハッシュ][]             | いいえ | 許可型ドメインのレジャーエントリID。指定された場合、オープンDEXの代わりに、対応する[許可型DEX](../../../../concepts/tokens/decentralized-exchange/permissioned-dexes.md)からオファーを返します。 _([PermissionedDEX amendment][]が必要です。 {% not-enabled /%})_ |
| `ledger_hash`  | [ハッシュ][]             | いいえ | 使用するレジャーバージョンの20バイトの16進文字列。（[レジャーの指定][]をご覧ください） |
| `ledger_index` | [レジャーインデックス][] | いいえ | 使用するレジャーの[レジャーインデックス][]、またはレジャーを自動的に選択するためのショートカット文字列。（[レジャーの指定][]をご覧ください） |
| `limit`        | 整数                     | いいえ | 指定されている場合、サーバはこの制限を超える数のオファーを結果に含めません。資金供給のないオファーはサーバにより省略されるため、返される結果の総数はこの制限よりも少ないことがあります。 |
| `taker`        | 文字列                   | いいえ | パースペクティブとして使用するアカウントの[アドレス][]。このアカウントが発行した[資金供給のないオファー](../../../../concepts/tokens/decentralized-exchange/offers.md#オファーのライフサイクル)は常にレスポンスに含まれます。（これを使用して、キャンセルしたい各自のオーダーを検索できます。） |


## レスポンスのフォーマット

処理が成功したレスポンスの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 11,
  "status": "success",
  "type": "response",
  "result": {
    "ledger_current_index": 7035305,
    "offers": [
      {
        "Account": "rM3X3QSr8icjTGpaF52dozhbT2BZSXJQYM",
        "BookDirectory": "7E5F614417C2D0A7CEFEB73C4AA773ED5B078DE2B5771F6D55055E4C405218EB",
        "BookNode": "0000000000000000",
        "Flags": 0,
        "LedgerEntryType": "Offer",
        "OwnerNode": "0000000000000AE0",
        "PreviousTxnID": "6956221794397C25A53647182E5C78A439766D600724074C99D78982E37599F1",
        "PreviousTxnLgrSeq": 7022646,
        "Sequence": 264542,
        "TakerGets": {
          "currency": "EUR",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "17.90363633316433"
        },
        "TakerPays": {
          "currency": "USD",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "27.05340557506234"
        },
        "index": "96A9104BF3137131FF8310B9174F3B37170E2144C813CA2A1695DF2C5677E811",
        "quality": "1.511056473200875"
      },
      {
        "Account": "rhsxKNyN99q6vyYCTHNTC1TqWCeHr7PNgp",
        "BookDirectory": "7E5F614417C2D0A7CEFEB73C4AA773ED5B078DE2B5771F6D5505DCAA8FE12000",
        "BookNode": "0000000000000000",
        "Flags": 131072,
        "LedgerEntryType": "Offer",
        "OwnerNode": "0000000000000001",
        "PreviousTxnID": "8AD748CD489F7FF34FCD4FB73F77F1901E27A6EFA52CCBB0CCDAAB934E5E754D",
        "PreviousTxnLgrSeq": 7007546,
        "Sequence": 265,
        "TakerGets": {
          "currency": "EUR",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "2.542743233917848"
        },
        "TakerPays": {
          "currency": "USD",
          "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          "value": "4.19552633596446"
        },
        "index": "7001797678E886E22D6DE11AF90DF1E08F4ADC21D763FAFB36AF66894D695235",
        "quality": "1.65"
      }
    ]
  }
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
200 OK

{
    "result": {
        "ledger_current_index": 8696243,
        "offers": [],
        "status": "success",
        "validated": false
    }
}
```
{% /tab %}

{% tab label="Commandline" %}
```json
{
   "result" : {
      "ledger_current_index" : 56867201,
      "offers" : [
         {
            "Account" : "rnixnrMHHvR7ejMpJMRCWkaNrq3qREwMDu",
            "BookDirectory" : "7E5F614417C2D0A7CEFEB73C4AA773ED5B078DE2B5771F6D56038D7EA4C68000",
            "BookNode" : "0000000000000000",
            "Flags" : 131072,
            "LedgerEntryType" : "Offer",
            "OwnerNode" : "0000000000000000",
            "PreviousTxnID" : "E43ADD1BD4AC2049E0D9DE6BC279B7FD95A99C8DE2C4694A4A7623F6D9AAAE29",
            "PreviousTxnLgrSeq" : 47926685,
            "Sequence" : 219,
            "TakerGets" : {
               "currency" : "EUR",
               "issuer" : "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
               "value" : "2.459108753792364"
            },
            "TakerPays" : {
               "currency" : "USD",
               "issuer" : "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
               "value" : "24.59108753792364"
            },
            "index" : "3087B4828C6B5D8595EA325D69C0F396C57452893647799493A38F2C164990AB",
            "owner_funds" : "2.872409153061363",
            "quality" : "10"
         },
         {
            "Account" : "rKwjWCKBaASEvtHCxtvReNd2i9n8DxSihk",
            "BookDirectory" : "7E5F614417C2D0A7CEFEB73C4AA773ED5B078DE2B5771F6D56038D7EA4C68000",
            "BookNode" : "0000000000000000",
            "Flags" : 131072,
            "LedgerEntryType" : "Offer",
            "OwnerNode" : "0000000000000000",
            "PreviousTxnID" : "B63B2ECD124FE6B02BC2998929517266BD221A02FEE51DDE4992C1BCB7E86CD3",
            "PreviousTxnLgrSeq" : 43166305,
            "Sequence" : 19,
            "TakerGets" : {
               "currency" : "EUR",
               "issuer" : "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
               "value" : "3.52"
            },
            "TakerPays" : {
               "currency" : "USD",
               "issuer" : "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
               "value" : "35.2"
            },
            "index" : "89865F2C70D1140796D9D249AC2ED765AE2D007A52DEC6D6D64CCB1A77A6EB7F",
            "owner_funds" : "3.523192614770459",
            "quality" : "10",
            "taker_gets_funded" : {
               "currency" : "EUR",
               "issuer" : "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
               "value" : "3.516160294182094"
            },
            "taker_pays_funded" : {
               "currency" : "USD",
               "issuer" : "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
               "value" : "35.16160294182094"
            }
         }
      ],
      "status" : "success",
      "validated" : false
   }
}
```
{% /tab %}

{% /tabs %}

このレスポンスは[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれます。

| フィールド             | 型                       | 説明                    |
|:-----------------------|:-------------------------|:------------------------|
| `ledger_current_index` | [レジャーインデックス][] | _(`ledger_current_index`が指定されている場合は省略)_ この情報の取得時に使用した、現在処理中のレジャーバージョンの[レジャーインデックス][]。 |
| `ledger_index`         | [レジャーインデックス][] | _(`ledger_current_index`が指定されている場合は省略)_ リクエストに従って、このデータの取得時に使用されたレジャーバージョンのレジャーインデックス。 |
| `ledger_hash`          | [ハッシュ][]             | _（省略される場合があります）_ リクエストに従って、このデータの取得時に使用されたレジャーバージョンの識別用ハッシュ。 |
| `offers`               | 配列                     | Offerオブジェクトの配列。詳細は下記にて。 |

`offers`配列の各要素には、[Offerエントリ][]の標準フィールドの他に、以下の追加フィールドが含まれます。

| フィールド          | 型         | 説明                |
|:--------------------|:-----------|:--------------------|
| `owner_funds`       | 文字列     | オファーの発行元が保有する取引可能なTakerGets通貨の金額。(XRPはdrop単位で表されます。その他のすべての通貨は10進数値として表されます。)1人のトレーダーの複数のオファーが同一のブックに含まれている場合、このフィールドは最高順位のオファーにのみ含まれます。 |
| `taker_gets_funded` | [通貨額][] | (部分的に資金供給されているオファーのみに含まれます) オファーの資金供給ステータスが指定されている場合に、受取人が受領できる最大通貨額。 |
| `taker_pays_funded` | [通貨額][] | (部分的に資金供給されているオファーのみに含まれます) オファーの資金供給ステータスが指定されている場合に、受取人が支払う最大通貨額。 |
| `quality`           | 文字列     | 為替レート(`taker_pays`を`taker_gets`で割った比率)。公正を期すため、同じクオリティのオファーは先入れ先出しで自動的に約定されます。(つまり、複数の人々が通貨を同じレートで取引するオファーを出した場合、最も古いオファーが最初に受諾されます。) |

## 考えられるエラー

* いずれかの[汎用エラータイプ][]。
* `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。
* `lgrNotFound` - `ledger_hash`または`ledger_index`で指定したレジャーが存在しないか、存在してはいるもののサーバが保有していません。
* `srcCurMalformed` - リクエストの`taker_pays`フィールドのフォーマットが適切ではありません。
* `dstAmtMalformed` - リクエストの`taker_gets`フィールドのフォーマットが適切ではありません。
* `srcIsrMalformed` - リクエストの`taker_pays`フィールドの`issuer`フィールドが無効です。
* `dstIsrMalformed` - リクエストの`taker_gets`フィールドの`issuer`フィールドが無効です。
* `badMarket` - 必要なオーダーブックが存在していません（ある通貨をその通貨自体と交換するオファーなど）。

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
