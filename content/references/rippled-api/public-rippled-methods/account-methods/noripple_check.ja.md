# noripple_check
[[ソース]<br>](https://github.com/ripple/rippled/blob/9111ad1a9dc37d49d085aa317712625e635197c0/src/ripple/rpc/handlers/NoRippleCheck.cpp "Source")

`noripple_check`コマンドを使用すると、[アカウントのDefaultRippleフィールドとそのトラストラインのNoRippleフラグ](rippling.html)の状態を、推奨される設定と比較して迅速にチェックできます。

## 要求フォーマット
要求フォーマットの例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
   "id": 0,
   "command": "noripple_check",
   "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
   "role": "gateway",
   "ledger_index": "current",
   "limit": 2,
   "transactions": true
}
```

*JSON-RPC*

```
{
   "method": "noripple_check",
   "params": [
       {
           "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
           "ledger_index": "current",
           "limit": 2,
           "role": "gateway",
           "transactions": true
       }
   ]
}
```

<!-- MULTICODE_BLOCK_END -->

**注記:** このメソッドのコマンドライン構文はありません。コマンドラインからアクセスするには[jsonメソッド][]を使用してください。

要求には以下のパラメーターが含まれます。

| `Field`        | 型                       | 説明                    |
|:---------------|:---------------------------|:-------------------------------|
| `account`      | 文字列                     | アカウントの一意のIDであり、通常はアカウントのアドレスです。 |
| `role`         | 文字列                     | アドレスが`gateway`と`user`のいずれを指しているか。推奨事項はアカウントの役割に応じて異なります。イシュアーのDefaultRippleを有効にし、すべてのトラストラインでNoRippleを無効にする必要があります。ユーザーのDefaultRippleを無効にし、すべてのトラストラインでNoRippleを有効にする必要があります。 |
| `transactions` | ブール値                    | _（省略可）_ `true`の場合、提案される[トランザクション](transaction-formats.html)（JSONオブジェクト）の配列を指定します。問題を修正するために、これらのトランザクションに署名して送信することができます。デフォルトではfalseです。 |
| `limit`        | 符号なし整数           | _（省略可）_ 結果に含めることができるトラストライン問題の最大数。デフォルトでは300です。 |
| `ledger_hash`  | 文字列                     | _（省略可）_ 使用するレジャーバージョンの20バイトの16進数文字列。（[レジャーの指定][]を参照してください。) |
| `ledger_index` | 文字列または符号なし整数 | _（省略可）_ 使用するレジャーのシーケンス番号、またはレジャーを自動的に選択するためのショートカット文字列。（[レジャーの指定][]を参照してください。) |

## 応答フォーマット

処理が成功した応答の例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
 "id": 0,
 "status": "success",
 "type": "response",
 "result": {
   "ledger_current_index": 14342939,
   "problems": [
     "You should immediately set your default ripple flag",
     "You should clear the no ripple flag on your XAU line to r3vi7mWxru9rJCxETCyA1CHvzL96eZWx5z",
     "You should clear the no ripple flag on your USD line to rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q"
   ],
   "transactions": [
     {
       "Account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
       "Fee": 10000,
       "Sequence": 1406,
       "SetFlag": 8,
       "TransactionType": "AccountSet"
     },
     {
       "Account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
       "Fee": 10000,
       "Flags": 262144,
       "LimitAmount": {
         "currency": "XAU",
         "issuer": "r3vi7mWxru9rJCxETCyA1CHvzL96eZWx5z",
         "value": "0"
       },
       "Sequence": 1407,
       "TransactionType": "TrustSet"
     },
     {
       "Account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
       "Fee": 10000,
       "Flags": 262144,
       "LimitAmount": {
         "currency": "USD",
         "issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
         "value": "5"
       },
       "Sequence": 1408,
       "TransactionType": "TrustSet"
     }
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
       "ledger_current_index": 14380381,
       "problems": [
           "You should immediately set your default ripple flag",
           "You should clear the no ripple flag on your XAU line to r3vi7mWxru9rJCxETCyA1CHvzL96eZWx5z",
           "You should clear the no ripple flag on your USD line to rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q"
       ],
       "status": "success",
       "transactions": [
           {
               "Account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
               "Fee": 10000,
               "Sequence": 1406,
               "SetFlag": 8,
               "TransactionType": "AccountSet"
           },
           {
               "Account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
               "Fee": 10000,
               "Flags": 262144,
               "LimitAmount": {
                   "currency": "XAU",
                   "issuer": "r3vi7mWxru9rJCxETCyA1CHvzL96eZWx5z",
                   "value": "0"
               },
               "Sequence": 1407,
               "TransactionType": "TrustSet"
           },
           {
               "Account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
               "Fee": 10000,
               "Flags": 262144,
               "LimitAmount": {
                   "currency": "USD",
                   "issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
                   "value": "5"
               },
               "Sequence": 1408,
               "TransactionType": "TrustSet"
           }
       ],
       "validated": false
   }
}
```

<!-- MULTICODE_BLOCK_END -->

応答は[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれています。

| `Field`                | 型   | 説明                                |
|:-----------------------|:-------|:-------------------------------------------|
| `ledger_current_index` | 数値 | これらの結果の計算に使用するレジャーのシーケンス番号。 |
| `problems`             | 配列  | 人間が読み取ることができる形式の問題の記述が含まれている文字列の配列。アカウントのDefaultRipple設定が推奨に従っていない場合は、最大1つのエントリーが含まれます。加えて、NoRipple設定が推奨に従っていないトラストラインのエントリー（最大で`limit`に指定されている数）も含まれます。 |
| `transactions`         | 配列  | （省略される場合があります）要求で`transactions`が`true`に指定されている場合、これはJSONオブジェクトの配列です。各JSONオブジェクトは、JSON形式の[トランザクション](transaction-formats.html)で、記述されている問題の1つを修正します。この配列の長さは`problems`配列と同じであり、各エントリーは、その配列の同じインデックスで記述されている問題の修正を目的としています。 |

## 考えられるエラー

* [汎用エラータイプ][]のすべて。
* `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。
* `actNotFound` - 要求の`account`フィールドに指定されている[アドレス][]が、レジャーのアカウントに対応していません。
* `lgrNotFound` - `ledger_hash`または`ledger_index`に指定されているレジャーが存在しないか、存在しているがサーバーにはありません。


{% include '_snippets/rippled_versions.md' %}
{% include '_snippets/rippled-api-links.md' %}
