# gateway_balances
[[ソース]<br>](https://github.com/ripple/rippled/blob/9111ad1a9dc37d49d085aa317712625e635197c0/src/ripple/rpc/handlers/GatewayBalances.cpp "Source")

`gateway_balances`コマンドは、特定のアカウントから発行された残高の合計を計算します。オプションで、[運用アドレス](issuing-and-operational-addresses.html)が保有する額を除外できます。[新規: rippled 0.28.2][]

## 要求フォーマット
要求フォーマットの例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
   "id": "example_gateway_balances_1",
   "command": "gateway_balances",
   "account": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
   "strict": true,
   "hotwallet": ["rKm4uWpg9tfwbVSeATv4KxDe6mpE9yPkgJ","ra7JkEzrgeKHdzKgo4EUUVBnxggY4z37kt"],
   "ledger_index": "validated"
}
```

*JSON-RPC*

```
{
   "method": "gateway_balances",
   "params": [
       {
           "account": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
           "hotwallet": [
               "rKm4uWpg9tfwbVSeATv4KxDe6mpE9yPkgJ",
               "ra7JkEzrgeKHdzKgo4EUUVBnxggY4z37kt"
           ],
           "ledger_index": "validated",
           "strict": true
       }
   ]
}
```

<!-- MULTICODE_BLOCK_END -->

要求には以下のパラメーターが含まれます。

| `Field`        | 型                       | 説明                    |
|:---------------|:---------------------------|:-------------------------------|
| `account`      | 文字列                     | チェックする[アドレス][]。[発行アドレス](issuing-and-operational-addresses.html)である必要があります。 |
| `strict`       | ブール値                    | _（省略可）_ trueの場合は、アカウントパラメーターにアドレスまたは公開鍵だけを受け入れます。デフォルトではfalseです。 |
| `hotwallet`    | 文字列または配列            | _（省略可）_ 発行済み残高から除外する[運用アドレス](issuing-and-operational-addresses.html)、またはそのようなアドレスの配列。 |
| `ledger_hash`  | 文字列                     | _（省略可）_ 使用するレジャーバージョンの20バイトの16進文字列。（[レジャーの指定][]を参照してください） |
| `ledger_index` | 文字列または符号なし整数 | _（省略可）_ 使用するレジャーバージョンのシーケンス番号、またはレジャーを自動的に選択するショートカット文字列。（[レジャーの指定][]を参照してください） |

## 応答フォーマット

処理が成功した応答の例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
 "id": 3,
 "status": "success",
 "type": "response",
 "result": {
   "account": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
   "assets": {
     "r9F6wk8HkXrgYWoJ7fsv4VrUBVoqDVtzkH": [
       {
         "currency": "BTC",
         "value": "5444166510000000e-26"
       }
     ],
     "rPFLkxQk6xUGdGYEykqe7PR25Gr7mLHDc8": [
       {
         "currency": "EUR",
         "value": "4000000000000000e-27"
       }
     ],
     "rPU6VbckqCLW4kb51CWqZdxvYyQrQVsnSj": [
       {
         "currency": "BTC",
         "value": "1029900000000000e-26"
       }
     ],
     "rpR95n1iFkTqpoy1e878f4Z1pVHVtWKMNQ": [
       {
         "currency": "BTC",
         "value": "4000000000000000e-30"
       }
     ],
     "rwmUaXsWtXU4Z843xSYwgt1is97bgY8yj6": [
       {
         "currency": "BTC",
         "value": "8700000000000000e-30"
       }
     ]
   },
   "balances": {
     "rKm4uWpg9tfwbVSeATv4KxDe6mpE9yPkgJ": [
       {
         "currency": "EUR",
         "value": "29826.1965999999"
       }
     ],
     "ra7JkEzrgeKHdzKgo4EUUVBnxggY4z37kt": [
       {
         "currency": "USD",
         "value": "13857.70416"
       }
     ]
   },
   "ledger_hash": "61DDBF304AF6E8101576BF161D447CA8E4F0170DDFBEAFFD993DC9383D443388",
   "ledger_index": 14483195,
   "obligations": {
     "BTC": "5908.324927635318",
     "EUR": "992471.7419793958",
     "GBP": "4991.38706013193",
     "USD": "1997134.20229482"
   },
   "validated": true
 }
}
```

*JSON-RPC*

```
200 OK
{
   "result": {
       "account": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
       "assets": {
           "r9F6wk8HkXrgYWoJ7fsv4VrUBVoqDVtzkH": [
               {
                   "currency": "BTC",
                   "value": "5444166510000000e-26"
               }
           ],
           "rPFLkxQk6xUGdGYEykqe7PR25Gr7mLHDc8": [
               {
                   "currency": "EUR",
                   "value": "4000000000000000e-27"
               }
           ],
           "rPU6VbckqCLW4kb51CWqZdxvYyQrQVsnSj": [
               {
                   "currency": "BTC",
                   "value": "1029900000000000e-26"
               }
           ],
           "rpR95n1iFkTqpoy1e878f4Z1pVHVtWKMNQ": [
               {
                   "currency": "BTC",
                   "value": "4000000000000000e-30"
               }
           ],
           "rwmUaXsWtXU4Z843xSYwgt1is97bgY8yj6": [
               {
                   "currency": "BTC",
                   "value": "8700000000000000e-30"
               }
           ]
       },
       "balances": {
           "rKm4uWpg9tfwbVSeATv4KxDe6mpE9yPkgJ": [
               {
                   "currency": "EUR",
                   "value": "29826.1965999999"
               }
           ],
           "ra7JkEzrgeKHdzKgo4EUUVBnxggY4z37kt": [
               {
                   "currency": "USD",
                   "value": "13857.70416"
               }
           ]
       },
       "ledger_hash": "980FECF48CA4BFDEC896692C31A50D484BDFE865EC101B00259C413AA3DBD672",
       "ledger_index": 14483212,
       "obligations": {
           "BTC": "5908.324927635318",
           "EUR": "992471.7419793958",
           "GBP": "4991.38706013193",
           "USD": "1997134.20229482"
       },
       "status": "success",
       "validated": true
   }
}
```

<!-- MULTICODE_BLOCK_END -->

**注記:** このメソッドのコマンドライン構文はありません。コマンドラインからアクセスするには[jsonメソッド][]を使用してください。

この応答は[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれています。

| `Field`                | 型   | 説明                                |
|:-----------------------|:-------|:-------------------------------------------|
| `account`              | 文字列 | 残高を発行したアカウントを識別する一意の[アドレス][]。 |
| `obligations`          | オブジェクト | （空の場合は省略）除外されていないアドレスに発行された額の合計。発行された価値の合計に対する通貨のマップとして示されます。 |
| `balances`             | オブジェクト | （空の場合は省略）要求から`hotwallet`アドレスに発行された額。キーはアドレスであり、値はアドレスが保有する通貨額の配列です。 |
| `assets`               | オブジェクト | （空の場合は省略）他から発行された保有額の合計。推奨される構成では、[発行アドレス](issuing-and-operational-addresses.html)の保有額はありません。 |
| `ledger_hash`          | 文字列 | （省略される場合があります）この応答の生成に使用されたレジャーの識別用ハッシュ。 |
| `ledger_index`         | 数値 | （省略される場合があります）この応答の生成に使用されたレジャーバージョンのシーケンス番号。 |
| `ledger_current_index` | 数値 | （省略される場合があります）この応答の生成に使用された現在処理中のレジャーバージョンのシーケンス番号。 |

## 考えられるエラー

* [汎用エラータイプ][]のすべて。
* `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。
* `invalidHotWallet` - `hotwallet`フィールドに指定されている1つ以上のアドレスが、要求に指定されているアカウントが発行した通貨を保有しているアカウントの[アドレス][]ではありません。
* `actNotFound` - 要求の`account`フィールドに指定されている[アドレス][]が、レジャーのアカウントに対応していません。
* `lgrNotFound` - `ledger_hash`または`ledger_index`で指定したレジャーが存在しないか、存在してはいるもののサーバーが保有していません。


{% include '_snippets/rippled_versions.md' %}
{% include '_snippets/rippled-api-links.md' %}
