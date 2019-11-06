# account_currencies
[[ソース]<br>](https://github.com/ripple/rippled/blob/df966a9ac6dd986585ecccb206aff24452e41a30/src/ripple/rpc/handlers/AccountCurrencies.cpp "Source")

`account_currencies`コマンドは、アカウントのトラストラインに基づいてそのアカウントが送金または受領できる通貨のリストを返します。（このリストは完全に確認されたリストではありませんが、ユーザーインターフェイスへの入力に使用できます。）

## 要求フォーマット
要求フォーマットの例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
   "command": "account_currencies",
   "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
   "strict": true,
   "ledger_index": "validated"
}
```

*JSON-RPC*

```
{
   "method": "account_currencies",
   "params": [
       {
           "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
           "account_index": 0,
           "ledger_index": "validated",
           "strict": true
       }
   ]
}
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](websocket-api-tool.html#account_currencies)

要求には以下のパラメーターが含まれます。

| `Field`        | 型                       | 説明                    |
|:---------------|:---------------------------|:-------------------------------|
| `account`      | 文字列                     | アカウントの一意のIDであり、通常はアカウントの[アドレス][]です。 |
| `strict`       | ブール値                    | _（省略可）_ trueの場合は、アカウントパラメーターにアドレスまたは公開鍵だけを受け入れます。デフォルトではfalseです。 |
| `ledger_hash`  | 文字列                     | _（省略可）_ 使用するレジャーバージョンの20バイトの16進文字列。（[レジャーの指定][]を参照してください） |
| `ledger_index` | 文字列または符号なし整数 | _（省略可）_ 使用するレジャーのシーケンス番号、またはレジャーを自動的に選択するためのショートカット文字列。（[レジャーの指定][]を参照してください） |

以下のフィールドは廃止予定であるため、指定しないでください。`account_index`.

## 応答フォーマット

処理が成功した応答の例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
   "result": {
       "ledger_index": 11775844,
       "receive_currencies": [
           "BTC",
           "CNY",
           "DYM",
           "EUR",
           "JOE",
           "MXN",
           "USD",
           "015841551A748AD2C1F76FF6ECB0CCCD00000000"
       ],
       "send_currencies": [
           "ASP",
           "BTC",
           "CHF",
           "CNY",
           "DYM",
           "EUR",
           "JOE",
           "JPY",
           "MXN",
           "USD"
       ],
       "validated": true
   },
   "status": "success",
   "type": "response"
}
```

*JSON-RPC*

```
200 OK
{
   "result": {
       "ledger_index": 11775823,
       "receive_currencies": [
           "BTC",
           "CNY",
           "DYM",
           "EUR",
           "JOE",
           "MXN",
           "USD",
           "015841551A748AD2C1F76FF6ECB0CCCD00000000"
       ],
       "send_currencies": [
           "ASP",
           "BTC",
           "CHF",
           "CNY",
           "DYM",
           "EUR",
           "JOE",
           "JPY",
           "MXN",
           "USD"
       ],
       "status": "success",
       "validated": true
   }
}
```

<!-- MULTICODE_BLOCK_END -->

この応答は[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれています。

| `Field`              | 型                       | 説明              |
|:---------------------|:---------------------------|:-------------------------|
| `ledger_hash`        | 文字列 - [ハッシュ][]          | （省略される場合があります）このデータの取得に使用するレジャーバージョンの識別用ハッシュ（16進数）。 |
| `ledger_index`       | 整数 - [レジャーインデックス][] | このデータの取得に使用するレジャーバージョンのシーケンス番号。 |
| `receive_currencies` | 文字列の配列           | このアカウントが受領できる通貨の[通貨コード][]の配列。 |
| `send_currencies`    | 文字列の配列           | このアカウントが送金できる通貨の[通貨コード][]の配列。 |
| `validated`          | ブール値                    | `true`の場合、このデータは検証済みレジャーから取得されます。 |

**注記:** アカウントが送金または受領できる通貨は、アカウントのトラストラインのチェックに基づいて定義されます。アカウントに通貨のトラストラインがあり、残高を増額できる余裕がある場合、その通貨を受領できます。トラストラインの残高を減らせる場合、アカウントはその通貨を送金できます。このメソッドでは、トラストラインが[凍結](freezes.html)または承認されているかどうかは確認 _されません_ 。

## 考えられるエラー

* [汎用エラータイプ][]のすべて。
* `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。
* `actNotFound` - 要求の`account`フィールドに指定されているアドレスが、レジャーのアカウントに対応していません。
* `lgrNotFound` - `ledger_hash`または`ledger_index`で指定したレジャーが存在しないか、存在してはいるもののサーバーが保有していません。


{% include '_snippets/rippled-api-links.md' %}
