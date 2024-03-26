---
html: ripple_path_find.html
parent: path-and-order-book-methods.html
seo:
    description: すぐに利用できるペイメントパスを含む1つのレスポンスを返します。
labels:
  - クロスカレンシー
  - トークン
---
# ripple_path_find
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/RipplePathFind.cpp "Source")

`ripple_path_find`メソッドは、[path_findメソッド][]のシンプルなバージョンであり、すぐに利用できる[ペイメントパス](../../../../concepts/tokens/fungible-tokens/paths.md)を含む1つのレスポンスを返します。WebSocket APIとJSON-RPC APIの両方で使用できます。ただし、結果は時間の経過とともに古くなる傾向にあります。最新の状態を維持するために複数のコールを実行する代わりに、可能な場合には[path_findメソッド][]を使用して、継続的な更新をサブスクライブします。

`rippled`サーバは支払いを行うため最も安価なパスまたはパスの組み合わせを探索しますが、このメソッドで返されるパスが最良のパスであることは保証されません。

**注意:** 信頼できないサーバからのPathfindingの結果には注意してください。オペレーターの収益となるように、最良ではないパスを返すようにサーバが改ざんされる可能性があります。サーバの負荷が非常に高い場合にも不適切な結果が返される可能性があります。Pathfindingについて信頼できる独自サーバがない場合は、1つのサーバから不適切な結果が返されるリスクを最小限に抑えるため、異なる当事者が実行する複数のサーバからのPathfindingの結果を比較してください。

## リクエストのフォーマット
リクエストのフォーマットの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
   "id":8,
   "command":"ripple_path_find",
   "source_account":"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
   "source_currencies":[
       {
           "currency":"XRP"
       },
       {
           "currency":"USD"
       }
   ],
   "destination_account":"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
   "destination_amount":{
       "value":"0.001",
       "currency":"USD",
       "issuer":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
   }
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
   "method":"ripple_path_find",
   "params":[
       {
           "destination_account":"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
           "destination_amount":{
               "currency":"USD",
               "issuer":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
               "value":"0.001"
           },
           "source_account":"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
           "source_currencies":[
               {
                   "currency":"XRP"
               },
               {
                   "currency":"USD"
               }
           ]
       }
   ]
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
#Syntax ripple_path_find json ledger_index|ledger_hash
rippled ripple_path_find '{"source_account":"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59", "source_currencies":[ { "currency":"XRP" }, { "currency":"USD" } ], "destination_account":"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59", "destination_amount":{ "value":"0.001", "currency":"USD", "issuer":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B" } }'
```
{% /tab %}

{% /tabs %}

[試してみる >](/resources/dev-tools/websocket-api-tool#ripple_path_find)

リクエストには以下のパラメーターが含まれます。

| `Field`               | 型                       | 説明             |
|:----------------------|:---------------------------|:------------------------|
| `source_account`      | 文字列                     | トランザクションで資金を送金するアカウントの一意のアドレス。 |
| `destination_account` | 文字列                     | トランザクションで資金を受領するアカウントの一意のアドレス。 |
| `destination_amount`  | 文字列またはオブジェクト           | 送金先アカウントがトランザクションで受領する[通貨額][]。**特殊なケース:** {% badge href="https://github.com/XRPLF/rippled/releases/tag/0.30.0" %}新規: rippled 0.30.0{% /badge %}`value`フィールドには`"-1"`（XRPの場合）または-1（XRP以外の通貨の場合）を指定できます。これにより、最大限の額を送金できるパスがリクエストされます。ただし`send_max`が指定されている場合は、指定されている額を上回る額が支払われることはありません。 |
| `send_max`            | 文字列またはオブジェクト           | _（省略可）_ トランザクションで使用する[通貨額][]。`source_currencies`と同時に使用することはできません。{% badge href="https://github.com/XRPLF/rippled/releases/tag/0.30.0" %}新規: rippled 0.30.0{% /badge %} |
| `source_currencies`   | 配列                      | _（省略可）_ 送信元アカウントが使用する通貨の配列。この配列の各エントリは、必須の`currency`フィールドとオプションの`issuer`フィールドを有するJSONオブジェクトです（[通貨額][]の指定方法と同様）。指定できる送金元通貨は**18**種類以下です。デフォルトでは、あらゆる送金元通貨を使用し、最大で**88**の異なる通貨/イシュアーペアに使用できます。 |
| `ledger_hash`         | 文字列                     | _（省略可）_ 使用するレジャーバージョンの20バイトの16進文字列。（[レジャーの指定][]をご覧ください） |
| `ledger_index`        | 文字列または符号なし整数 | _（省略可）_ 使用するレジャーのシーケンス番号、またはレジャーを自動的に選択するためのショートカット文字列。（[レジャーの指定][]をご覧ください） |

## レスポンスのフォーマット

処理が成功したレスポンスの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
   "id":8,
   "status":"success",
   "type":"response",
   "result":{
       "alternatives":[
           {
               "paths_canonical":[],
               "paths_computed":[
                   [
                       {
                           "currency":"USD",
                           "issuer":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                           "type":48,
                           "type_hex":"0000000000000030"
                       },
                       {
                           "account":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                           "type":1,
                           "type_hex":"0000000000000001"
                       }
                   ],
                   [
                       {
                           "currency":"USD",
                           "issuer":"rrpNnNLKrartuEqfJGpqyDwPj1AFPg9vn1",
                           "type":48,
                           "type_hex":"0000000000000030"
                       },
                       {
                           "account":"rrpNnNLKrartuEqfJGpqyDwPj1AFPg9vn1",
                           "type":1,
                           "type_hex":"0000000000000001"
                       },
                       {
                           "account":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                           "type":1,
                           "type_hex":"0000000000000001"
                       }
                   ],
                   [
                       {
                           "currency":"USD",
                           "issuer":"rrpNnNLKrartuEqfJGpqyDwPj1AFPg9vn1",
                           "type":48,
                           "type_hex":"0000000000000030"
                       },
                       {
                           "account":"rrpNnNLKrartuEqfJGpqyDwPj1AFPg9vn1",
                           "type":1,
                           "type_hex":"0000000000000001"
                       },
                       {
                           "account":"rLpq4LgabRfm1xEX5dpWfJovYBH6g7z99q",
                           "type":1,
                           "type_hex":"0000000000000001"
                       },
                       {
                           "account":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                           "type":1,
                           "type_hex":"0000000000000001"
                       }
                   ],
                   [
                       {
                           "currency":"USD",
                           "issuer":"rrpNnNLKrartuEqfJGpqyDwPj1AFPg9vn1",
                           "type":48,
                           "type_hex":"0000000000000030"
                       },
                       {
                           "account":"rrpNnNLKrartuEqfJGpqyDwPj1AFPg9vn1",
                           "type":1,
                           "type_hex":"0000000000000001"
                       },
                       {
                           "account":"rPuBoajMjFoDjweJBrtZEBwUMkyruxpwwV",
                           "type":1,
                           "type_hex":"0000000000000001"
                       },
                       {
                           "account":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                           "type":1,
                           "type_hex":"0000000000000001"
                       }
                   ]
               ],
               "source_amount":"256987"
           }
       ],
       "destination_account":"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
       "destination_currencies":[
           "015841551A748AD2C1F76FF6ECB0CCCD00000000",
           "JOE",
           "DYM",
           "EUR",
           "CNY",
           "MXN",
           "BTC",
           "USD",
           "XRP"
       ]
   }
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
200 OK

{
   "result":{
       "alternatives":[
           {
               "paths_canonical":[],
               "paths_computed":[
                   [
                       {
                           "currency":"USD",
                           "issuer":"rpDMez6pm6dBve2TJsmDpv7Yae6V5Pyvy2",
                           "type":48,
                           "type_hex":"0000000000000030"
                       },
                       {
                           "account":"rpDMez6pm6dBve2TJsmDpv7Yae6V5Pyvy2",
                           "type":1,
                           "type_hex":"0000000000000001"
                       },
                       {
                           "account":"rfDeu7TPUmyvUrffexjMjq3mMcSQHZSYyA",
                           "type":1,
                           "type_hex":"0000000000000001"
                       },
                       {
                           "account":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                           "type":1,
                           "type_hex":"0000000000000001"
                       }
                   ],
                   [
                       {
                           "currency":"USD",
                           "issuer":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                           "type":48,
                           "type_hex":"0000000000000030"
                       },
                       {
                           "account":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                           "type":1,
                           "type_hex":"0000000000000001"
                       }
                   ],
                   [
                       {
                           "currency":"USD",
                           "issuer":"rLEsXccBGNR3UPuPu2hUXPjziKC3qKSBun",
                           "type":48,
                           "type_hex":"0000000000000030"
                       },
                       {
                           "account":"rLEsXccBGNR3UPuPu2hUXPjziKC3qKSBun",
                           "type":1,
                           "type_hex":"0000000000000001"
                       },
                       {
                           "account":"raspZSGNiTKi5jmvFxUYCuYXPv1V8WhL5g",
                           "type":1,
                           "type_hex":"0000000000000001"
                       },
                       {
                           "account":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                           "type":1,
                           "type_hex":"0000000000000001"
                       }
                   ],
                   [
                       {
                           "currency":"USD",
                           "issuer":"rpHgehzdpfWRXKvSv6duKvVuo1aZVimdaT",
                           "type":48,
                           "type_hex":"0000000000000030"
                       },
                       {
                           "account":"rpHgehzdpfWRXKvSv6duKvVuo1aZVimdaT",
                           "type":1,
                           "type_hex":"0000000000000001"
                       },
                       {
                           "account":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                           "type":1,
                           "type_hex":"0000000000000001"
                       }
                   ]
               ],
               "source_amount":"207414"
           }
       ],
       "destination_account":"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
       "destination_currencies":[
           "USD",
           "JOE",
           "BTC",
           "DYM",
           "CNY",
           "EUR",
           "015841551A748AD2C1F76FF6ECB0CCCD00000000",
           "MXN",
           "XRP"
       ],
       "status":"success"
   }
}
```
{% /tab %}

{% /tabs %}

このレスポンスは[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれます。

| `Field`                  | 型   | 説明                              |
|:-------------------------|:-------|:-----------------------------------------|
| `alternatives`           | 配列  | 使用可能なパスを持つオブジェクトの配列。以下に説明します。空の場合、送金元アカウントと送金先アカウントを結ぶパスがありません。 |
| `destination_account`    | 文字列 | 支払トランザクションを受信するアカウントの一意のアドレス。 |
| `destination_currencies` | 配列  | 送金先が受領する通貨を表す文字列の配列。この文字列は、3文字コード（`"USD"`など）または40文字の16進文字列（`"015841551A748AD2C1F76FF6ECB0CCCD00000000"`など）です。 |

`alternatives`配列の各要素は、1つの送金元通貨（開始アカウントが保有）から送金先アカウントへのパスと通貨を表すオブジェクトです。このオブジェクトのフィールドを次に示します。

| `Field`          | 型             | 説明                            |
|:-----------------|:-----------------|:---------------------------------------|
| `paths_computed` | 配列            | （省略可）[ペイメントパス](../../../../concepts/tokens/fungible-tokens/paths.md)を定義するオブジェクトの配列。 |
| `source_amount`  | 文字列またはオブジェクト | 送金先が希望額を受領できるよう、送金元がこのパスで送金する必要のある[通貨額][]。 |

次のフィールドは廃止予定のため、省略される可能性があります。`paths_canonical`および`paths_expanded`。出力される場合は無視してください。

## 考えられるエラー

* [汎用エラータイプ][]のすべて。
* `tooBusy` - サーバの負荷が高すぎるため、パスを計算できません。管理者として接続している場合は、このエラーが返されることはありません。
* `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。
* `srcActMissing` - `source_account`フィールドがリクエストで省略されています。
* `srcActMalformed` - リクエストの`source_account`フィールドのフォーマットが適切ではありません。
* `dstActMissing` - `destination_account`フィールドがリクエストで省略されています。
* `dstActMalformed` - リクエストの`destination_account`フィールドのフォーマットが適切ではありません。
* `srcCurMalformed` - `source_currencies`フィールドのフォーマットが適切ではありません。
* `srcIsrMalformed` - リクエストの1つ以上の通貨オブジェクトの`issuer`フィールドが有効ではありません。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
