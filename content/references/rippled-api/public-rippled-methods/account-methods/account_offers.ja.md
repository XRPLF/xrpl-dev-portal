# account_offers
[[ソース]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/AccountOffers.cpp "Source")

`account_offers`メソッドは、特定のアカウントから出されたオファーのうち、特定のレジャーバージョンで未処理であったオファーのリストを取得します。

## 要求フォーマット

要求フォーマットの例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
 "id": 2,
 "command": "account_offers",
 "account": "rpP2JgiMyTF5jR5hLG3xHCPi1knBb1v9cM"
}
```

*JSON-RPC*

```
{
   "method": "account_offers",
   "params": [
       {
           "account": "rpP2JgiMyTF5jR5hLG3xHCPi1knBb1v9cM"
       }
   ]
}
```

*コマンドライン*

```
#Syntax: account_offers account [ledger_index]
rippled account_offers r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59 current
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](websocket-api-tool.html#account_offers)

要求には以下のパラメーターを指定できます。

| `Field`        | 型                                       | 説明    |
|:---------------|:-------------------------------------------|:---------------|
| `account`      | 文字列                                     | アカウントの一意のIDであり、通常はアカウントの[アドレス][]です。 |
| `ledger`       | 符号なし整数または文字列                | （廃止予定、省略可）使用するレジャーバージョンの一意のID（レジャーのシーケンス番号、ハッシュ、「validated」などのショートカットなど）。 |
| `ledger_hash`  | 文字列                                     | _（省略可）_ 使用するレジャーバージョンを識別する20バイトの16進文字列。 |
| `ledger_index` | [レジャーインデックス][]                           | （省略可、デフォルトでは`current`）使用するレジャーのシーケンス番号、またはレジャーを動的に選択するための「current」、「closed」、「validated」のいずれか。（[レジャーの指定][]を参照してください） |
| `limit`        | 整数                                    | （省略可、デフォルト値は可変）取得するトランザクションの数を制限します。サーバーはこの値に従う必要はありません。10以上400以下の範囲で値を指定する必要があります。[新規: rippled 0.26.4][] |
| `marker`       | [マーカー][] | _（省略可）_ 以前にページネーションされた応答の値。その応答を停止した箇所からデータの取得を再開します。[新規: rippled 0.26.4][] |

以下のパラメーターは廃止予定であり、今後予告なしに削除される可能性があります。`ledger`。

## 応答フォーマット

処理が成功した応答の例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
 "id": 9,
 "status": "success",
 "type": "response",
 "result": {
   "account": "rpP2JgiMyTF5jR5hLG3xHCPi1knBb1v9cM",
   "ledger_current_index": 18539550,
   "offers": [
     {
       "flags": 0,
       "quality": "0.00000000574666765650638",
       "seq": 6577664,
       "taker_gets": "33687728098",
       "taker_pays": {
         "currency": "EUR",
         "issuer": "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
         "value": "193.5921774819578"
       }
     },
     {
       "flags": 0,
       "quality": "7989247009094510e-27",
       "seq": 6572128,
       "taker_gets": "2361918758",
       "taker_pays": {
         "currency": "XAU",
         "issuer": "rrh7rf1gV2pXAoqA8oYbpHd8TKv5ZQeo67",
         "value": "0.01886995237307572"
       }
     },
     ... trimmed for length ...
   ],
   "validated": false
 }
}
```

*JSON-RPC*

```
200 OK
{
   "result": {
       "account": "rpP2JgiMyTF5jR5hLG3xHCPi1knBb1v9cM",
       "ledger_current_index": 18539596,
       "offers": [{
           "flags": 0,
           "quality": "0.000000007599140009999998",
           "seq": 6578020,
           "taker_gets": "29740867287",
           "taker_pays": {
               "currency": "USD",
               "issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
               "value": "226.0050145327418"
           }
       }, {
           "flags": 0,
           "quality": "7989247009094510e-27",
           "seq": 6572128,
           "taker_gets": "2361918758",
           "taker_pays": {
               "currency": "XAU",
               "issuer": "rrh7rf1gV2pXAoqA8oYbpHd8TKv5ZQeo67",
               "value": "0.01886995237307572"
           }
       }, {
           "flags": 0,
           "quality": "0.00000004059594001318974",
           "seq": 6576905,
           "taker_gets": "3892952574",
           "taker_pays": {
               "currency": "CNY",
               "issuer": "rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y",
               "value": "158.0380691682966"
           }
       },

       ...

       ],
       "status": "success",
       "validated": false
   }
}
```

<!-- MULTICODE_BLOCK_END -->

この応答は[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれています。

| `Field`                | 型                                       | 説明 |
|:-----------------------|:-------------------------------------------|:-------|
| `account`              | 文字列                                     | オファーを出したアカウントを識別する一意の[アドレス][] |
| `offers`               | 配列                                      | オブジェクトの配列。各オブジェクトは、このアカウントが出したオファーの中で、レジャーバージョンが要求された時点で未処理のオファーを表します。オファーの数が多い場合は、一度に`limit`の数までのオファーが返されます。 |
| `ledger_current_index` | 整数                                    | （`ledger_hash`または`ledger_index`が指定されている場合は省略）このデータの取得時に使用したレジャーバージョンのシーケンス番号。[新規: rippled 0.26.4-sp1][] |
| `ledger_index`         | 整数                                    | （`ledger_current_index`が代わりに指定されている場合は省略）要求に指定され、このデータの取得時に使用されたレジャーバージョンのシーケンス番号。[新規: rippled 0.26.4-sp1][] |
| `ledger_hash`          | 文字列                                     | _（省略される場合があります）_ 要求に指定され、このデータの取得時に使用されたレジャーバージョンの16進数ハッシュ。[新規: rippled 0.26.4-sp1][] |
| `marker`               | [マーカー][] | _（省略される場合があります）_ 応答がページネーションされていることを示す、サーバーが定義した値。この値を次のコールに渡して、このコールで終わった箇所から再開します。この後に情報ページがない場合は省略されます。[新規: rippled 0.26.4][] |


各Offerオブジェクトのフィールドを次に示します。

| `Field`      | 型             | 説明                                |
|:-------------|:-----------------|:-------------------------------------------|
| `flags`      | 符号なし整数 | このオファーエントリに対してビットフラグとして設定されているオプション。 |
| `seq`        | 符号なし整数 | このエントリを作成したトランザクションのシーケンス番号。（トランザクションの[シーケンス番号](basic-data-types.html#アカウントシーケンス)はアカウントに関連付けられています。） |
| `taker_gets` | 文字列またはオブジェクト | オファーを受け入れるアカウントが受領する額。XRPまたは通貨指定オブジェクトの額を表す文字列として示されます。（[通貨額の指定][通貨額]を参照してください。） |
| `taker_pays` | 文字列またはオブジェクト | オファーを受け入れるアカウントが提供する額。XRPまたは通貨指定オブジェクトの額を表す文字列として示されます。（[通貨額の指定][通貨額]を参照してください。） |
| `quality`    | 文字列           | オファーの為替レート。元の`taker_pays`を元の`taker_gets`で割った比率です。オファーの実行時には、最も好ましい（最も低い）クオリティのオファーが最初に消費されます。同じクオリティのオファーは古いものから新しいものの順で実行されます。[新規: rippled 0.29.0][] |
| `expiration` | 符号なし整数 | （省略される場合があります）この時刻の経過後は、資金化されなかったオファーとみなされます（[Rippleエポック以降の経過秒数][]）。関連項目: [オファーの有効期限](offers.html#オファーの有効期限)。[新規: rippled 0.30.1][] |

## 考えられるエラー

* [汎用エラータイプ][]のすべて。
* `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。
* `actNotFound` - 要求の`account`フィールドに指定されている[アドレス][]が、レジャーのアカウントに対応していません。
* `lgrNotFound` - `ledger_hash`または`ledger_index`で指定したレジャーが存在しないか、存在してはいるもののサーバーが保有していません。
* `actMalformed` - 指定されている`marker`フィールドが受け入れられない場合。


{% include '_snippets/rippled_versions.md' %}
{% include '_snippets/rippled-api-links.md' %}
