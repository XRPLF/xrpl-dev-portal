# book_offers
[[ソース]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/BookOffers.cpp "Source")

`book_offers`メソッドは、[オーダーブック](http://www.investopedia.com/terms/o/order-book.asp)と呼ばれる、2つの通貨間のオファーのリストを取得します。結果が非常に大きい場合、結果の一部がマーカー付きで返されます。これにより、その後の要求は前回の要求で終わった箇所から再開できます。

## 要求フォーマット
要求フォーマットの例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
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

*JSON-RPC*

```
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

*コマンドライン*

```
#Syntax: book_offers taker_pays taker_gets [taker [ledger [limit] ] ]
rippled book_offers 'USD/rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B' 'EUR/rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B'
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](websocket-api-tool.html#book_offers)

要求には以下のパラメーターが含まれます。

| `Field`        | 型                                       | 説明                    |
|:---------------|:-------------------------------------------|:-------------------------------|
| `ledger_hash`  | 文字列                                     | _（省略可）_ 使用するレジャーバージョンの20バイトの16進数文字列。（[レジャーの指定][]を参照してください。) |
| `ledger_index` | 文字列または符号なし整数                 | _（省略可）_ 使用するレジャーのシーケンス番号、またはレジャーを自動的に選択するためのショートカット文字列。（[レジャーの指定][]を参照してください。) |
| `limit`        | 符号なし整数                           | _（省略可）_ 指定されている場合、サーバーはこの制限を超える数のオファーを結果に含めません。資金供給のないオファーはサーバーにより省略されるため、返される結果の総数はこの制限よりも少ないことがあります。 |
| `marker`       | [マーカー][] | _（省略可）_ 以前にページネーションされた応答の値。その応答で終わった箇所からデータの取得を再開します。 |
| `taker`        | 文字列                                     | _（省略可）_ パースペクティブとして使用するアカウントの[アドレス][]。このアカウントが発行した[資金供給のないオファー](offers.html#オファーのライフサイクル)は常に応答に含まれます。（これを使用して、キャンセルしたい各自のオーダーを検索できます。） |
| `taker_gets`   | オブジェクト                                     | オファーを受諾するアカウントが受け取る通貨を、[通貨額][]と同様に、`currency`フィールドと`issuer`フィールドを持つオブジェクトとして指定します（XRPの場合はissuerを省略）。 |
| `taker_pays`   | オブジェクト                                     | オファーを受諾するアカウントが支払う通貨を、[通貨額][]と同様に、`currency`フィールドと`issuer`フィールドを持つオブジェクトとして指定します（XRPの場合はissuerを省略）。 |

## 応答フォーマット

処理が成功した応答の例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
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

*JSON-RPC*

```
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

<!-- MULTICODE_BLOCK_END -->

応答は[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれています。

| `Field`                | 型                                       | 説明                               |
|:-----------------------|:-------------------------------------------|:------------------------------------------|
| `ledger_current_index` | 整数                                    | （レジャーバージョンが指定されている場合は省略）このデータの取得時に使用したレジャーバージョンのシーケンス番号。 |
| `ledger_index`         | 整数                                    | （ledger\_current\_indexが代わりに指定されている場合は省略）要求で指定される、このデータの取得時に使用されたレジャーバージョンのシーケンス番号。 |
| `ledger_hash`          | 文字列                                     | （省略される場合があります）要求で指定される、このデータの取得時に使用されたレジャーバージョンの16進数ハッシュ。 |
| `marker`               | [マーカー][] | （省略される場合があります）応答がページネーションされていることを示す、サーバーが定義した値。この値を次のコールに渡して、このコールで終わった箇所から再開します。この後に情報ページがない場合は省略されます。 |
| `offers`               | 配列                                      | Offerオブジェクトの配列。各オブジェクトには[Offer オブジェクト](offer.html)のフィールドが含まれています。 |

`offers`配列の要素には、Offerの標準フィールドの他に以下のフィールドが含まれます。

| `Field`             | 型                             | 説明         |
|:--------------------|:---------------------------------|:--------------------|
| `owner_funds`       | 文字列                           | オファーの発行元が保有する取引可能なTakerGets通貨の金額。（XRPはdrop単位で表されます。その他のすべての通貨は10進数値として表されます。）1人のトレーダーの複数のオファーが同一のブックに含まれている場合、このフィールドは最高順位のオファーにのみ含まれます。 |
| `taker_gets_funded` | 文字列（XRP）またはオブジェクト（XRP以外） | （部分的に資金供給されているオファーのみに含まれます）オファーの資金供給ステータスが指定されている場合に、受取人が受領できる最大通貨額。 |
| `taker_pays_funded` | 文字列（XRP）またはオブジェクト（XRP以外） | （部分的に資金供給されているオファーのみに含まれます）オファーの資金供給ステータスが指定されている場合に、受取人が支払う最大通貨額。 |
| `quality`           | 文字列                           | 為替レート（`taker_pays`を`taker_gets`で割った比率）。公正を期すため、同じクオリティのオファーは先入れ先出しで自動的に受諾されます。（つまり、複数の人々が通貨を同じレートで取引するオファーを出した場合、最も古いオファーが最初に受諾されます。） |

## 考えられるエラー

* [汎用エラータイプ][]のすべて。
* `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。
* `lgrNotFound` - `ledger_hash`または`ledger_index`に指定されているレジャーが存在しないか、存在しているがサーバーにはありません。
* `srcCurMalformed` - 要求の`taker_pays`フィールドのフォーマットが適切ではありません。
* `dstAmtMalformed` - 要求の`taker_gets`フィールドのフォーマットが適切ではありません。
* `srcIsrMalformed` - 要求の`taker_pays`フィールドの`issuer`フィールドが無効です。
* `dstIsrMalformed` - 要求の`taker_gets`フィールドの`issuer`フィールドが無効です。
* `badMarket` - 必要なオーダーブックが存在していません（ある通貨をその通貨自体と交換するオファーなど）。


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
