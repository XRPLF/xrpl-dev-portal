# unsubscribe
[[ソース]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/Unsubscribe.cpp "Source")

`unsubscribe`コマンドはサーバーに対して、特定のサブスクリプションまたは一連のサブスクリプションへのメッセージ送信の停止を指示します。

## 要求フォーマット
要求フォーマットの例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
   "id":"Unsubscribe a lot of stuff",
   "command":"unsubscribe",
   "streams":["ledger","server","transactions","transactions_proposed"],
   "accounts":["rrpNnNLKrartuEqfJGpqyDwPj1AFPg9vn1"],
   "accounts_proposed":["rrpNnNLKrartuEqfJGpqyDwPj1AFPg9vn1"],
   "books":[
       {
           "taker_pays":{
               "currency":"XRP"
           },
           "taker_gets":{
               "currency":"USD",
               "issuer":"rUQTpMqAF5jhykj4FExVeXakrZpiKF6cQV"
           },
           "both": true
       }
   ]
}
```

<!-- MULTICODE_BLOCK_END -->

[試してみる >](websocket-api-tool.html#unsubscribe)

この要求のパラメーターは、[subscribeメソッド][]のパラメーターとほぼ同様の方法で指定されますが、終了するサブスクリプションを定義するために使用される点が異なります。これらのパラメーターを以下に示します。

| `Field`             | 型  | 説明                                    |
|:--------------------|:------|:-----------------------------------------------|
| `streams`           | 配列 | _（省略可）_ サブスクライブを解除する汎用ストリームの文字列名の配列（`ledger`、`server`、`transactions`、`transactions_proposed`など）。 |
| `accounts`          | 配列 | _（省略可）_ 更新の受信を停止する一意のアカウントアドレスの配列（XRP Ledgerの[base58][]フォーマット）。（以前にこれらのアカウントをサブスクライブしていた場合にのみ、メッセージが停止されます。一般のトランザクションストリームからアカウントを除外する目的では使用できません。） |
| `accounts_proposed` | 配列 | _（省略可）_`accounts`と同様ですが、未検証のトランザクションを含む`accounts_proposed`サブスクリプションを対象としています。 |
| `books`             | 配列 | _（省略可）_ 以下に説明するように、サブスクライブ解除するオーダーブックを定義するオブジェクトの配列。 |

`rt_accounts`パラメーター、`url`パラメーター、`rt_transactions`ストリーム名は廃止予定であり、今後予告なしに削除される可能性があります。

`books`配列のオブジェクトは、subscribeのオブジェクトと同様に定義されますが、一部のフィールドが含まれていない点が異なります。このオブジェクトのフィールドを次に示します。

| `Field`      | 型    | 説明                                         |
|:-------------|:--------|:----------------------------------------------------|
| `taker_gets` | オブジェクト  | オファーを受諾するアカウントが受け取る通貨を、[通貨額][]と同様、`currency`フィールドと`issuer`フィールドを持つオブジェクトとして指定します（XRPの場合はissuerを省略）。 |
| `taker_pays` | オブジェクト  | オファーを受諾するアカウントが支払う通貨を、[通貨額][]と同様、`currency`フィールドと`issuer`フィールドを持つオブジェクトとして指定します（XRPの場合はissuerを省略）。 |
| `both`       | ブール値 | （省略可、デフォルトではfalse）trueの場合は、オーダーブックの両サイドからサブスクリプションを削除します。 |

## 応答フォーマット

処理が成功した応答の例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
   "id":"Unsubscribe a lot of stuff",
   "result":{},
   "status":"success",
   "type":"response"
}
```

<!-- MULTICODE_BLOCK_END -->

この応答は[標準フォーマット][]に従っており、正常に完了した場合は結果にフィールドが含まれません。

## 考えられるエラー

* [汎用エラータイプ][]のすべて。
* `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。
* `noPermission` - 要求に`url`フィールドが指定されていますが、管理者として接続していません。
* `malformedStream` - 要求の`streams`フィールドのフォーマットが適切ではありません。
* `malformedAccount` - 要求の`accounts`または`accounts_proposed`フィールドのアドレスの1つが、適切なフォーマットのXRP Ledgerアドレスではありません。
    * **注記:** グローバルレジャーにエントリーがまだ作成されていないアドレスのストリームをサブスクライブ _できます_ 。このようにサブスクライブして、そのアドレスに資金が供給されたらメッセージを受け取ることができます。
* `srcCurMalformed` - 要求の`books`フィールドの1つ以上の`taker_pays`サブフィールドのフォーマットが適切ではありません。
* `dstAmtMalformed` - 要求の`books`フィールドの1つ以上の`taker_gets`サブフィールドのフォーマットが適切ではありません。
* `srcIsrMalformed` - 要求の`books`フィールドの1つ以上の`taker_pays`サブフィールドの`issuer`フィールドが無効です。
* `dstIsrMalformed` - 要求の`books`フィールドの1つ以上の`taker_gets`サブフィールドの`issuer`フィールドが無効です。
* `badMarket` - `books` フィールドに指定されている1つ以上のオーダーブックが存在していません（ある通貨をその通貨自体と交換するオファーなど）。


{% include '_snippets/rippled_versions.md' %}
{% include '_snippets/rippled-api-links.md' %}
