# path_find
[[ソース]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/PathFind.cpp "Source")

*WebSocket APIのみ。*`path_find`メソッドは、トランザクションが実行される可能性のある[パス](paths.html)を探索し、時間の経過とともにパスが変化する場合に更新を定期的に送信します。JSON-RPCでサポートされているシンプルなバージョンについては、[ripple_path_findメソッド][]を参照してください。完全にXRPで行われる支払いの場合、XRPはどのアカウントにも直接送金できるためパスを探索する必要はありません。

path_findコマンドには3種類のモード（サブコマンド）があります。使用するモードを`subcommand`パラメーターに指定します。

* `create` - Pathfinding情報の送信を開始します
* `close` - Pathfinding情報の送信を停止します
* `status` - 現在処理中のPathfinding要求に関する情報を取得します

`rippled`サーバーは支払いを行うにあたり最も安価なパスまたはパスの組み合わせを探索しますが、このメソッドで返されるパスが最良のパスであることは保証されません。サーバーの負荷が原因で、Pathfindingで最良のパスを検出できないことがあります。また、信頼できないサーバーからのPathfindingの結果には注意する必要があります。オペレーターの収益となるように、最良ではないパスを返すようにサーバーが改ざんされる可能性があります。Pathfindingについて信頼できる独自サーバーがない場合は、1つのサーバーから不適切な結果が返されるリスクを最小限に抑えるため、異なる当事者が実行する複数のサーバーからのPathfindingの結果を比較してください。（**注記:** サーバーから最良ではない結果が返されても、必ずしも悪意のある振る舞いの証拠とはなりません。サーバーの負荷が高い場合の症状である可能性もあります。）

## path_find create
[[ソース]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/PathFind.cpp#L50-L56 "Source")

`path_find`の`create`サブコマンドは、指定された特定アカウントから支払トランザクションを実行できるパスを探索する継続的な要求を作成し、別のアカウントが何らかの通貨で希望する額を受領できるようにします。初期応答には2つのアドレス間で提案されるパスが含まれています。このパスにより、希望する額を受領できます。その後サーバーは、`"type": "path_find"`で有効なパスの更新を含む追加メッセージを送信します。更新の頻度はサーバーにより決定されますが、新しいレジャーバージョンがある場合には通常、数秒間に1回です。

クライアントは一度に1つのPathfinding要求のみ実行できます。同じ接続ですでに他のPathfinding要求が実行されている場合、古い要求が自動的にクローズされ、新しい要求に置き換えられます。

### 要求フォーマット
要求フォーマットの例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
   "id":8,
   "command":"path_find",
   "subcommand":"create",
   "source_account":"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
   "destination_account":"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
   "destination_amount":{
       "value":"0.001",
       "currency":"USD",
       "issuer":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
   }
}
```

<!-- MULTICODE_BLOCK_END -->

[試してみる >](websocket-api-tool.html#path_find)

要求には以下のパラメーターが含まれます。

| `Field`               | 型             | 説明                       |
|:----------------------|:-----------------|:----------------------------------|
| `subcommand`          | 文字列           | `"create"`を使用してcreateサブコマンドを送信します。 |
| `source_account`      | 文字列           | 探索するパスの送金元アカウントの一意のアドレス。（つまり、支払いを送金するアカウントです。） |
| `destination_account` | 文字列           | 探索するパスの送金先アカウントの一意のアドレス。（つまり、支払いを受領するアカウントです。） |
| `destination_amount`  | 文字列またはオブジェクト | 送金先アカウントがトランザクションで受領する[通貨額][]。**特殊なケース:**[新規: rippled 0.30.0][]`value`フィールドには`"-1"`（XRPの場合）または-1（XRP以外の通貨の場合）を指定できます。これにより、最大限の額を送金できるパスが要求されます。ただし`send_max`が指定されている場合は、指定額を上回る額が支払われることはありません。 |
| `send_max`            | 文字列またはオブジェクト | _（省略可）_ トランザクションに使用する[通貨額][]。`source_currencies`と同時に指定することはできません。[新規: rippled 0.30.0][] |
| `paths`               | 配列            | _（省略可）_ チェックする[ペイメントパス](paths.html)を表すオブジェクトの配列。すでに判明している特定パスの変更内容を常に把握する場合や、特定パスに沿った支払いにかかる総コストを確認する場合にこのフィールドを使用できます。 |

サーバーは`source_currencies`および`bridges`フィールドも認識しますが、これらのフィールドを使用した場合の結果は保証されません。これらのフィールドは将来のために予約されているものと考えてください。

### 応答フォーマット

処理が成功した応答の例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
 "id":1,
 "status":"success",
 "type":"response",
 "result":{
   "alternatives":[
     {
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
             "issuer":"rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
             "type":48,
             "type_hex":"0000000000000030"
           },
           {
             "account":"rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
             "type":1,
             "type_hex":"0000000000000001"
           }
         ],
         [
           {
             "currency":"USD",
             "issuer":"r9vbV3EHvXWjSkeQ6CAcYVPGeq7TuiXY2X",
             "type":48,
             "type_hex":"0000000000000030"
           },
           {
             "account":"r9vbV3EHvXWjSkeQ6CAcYVPGeq7TuiXY2X",
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
           }
         ]
       ],
       "source_amount":"251686"
     },
     {
       "paths_computed":[
         [
           {
             "account":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
             "type":1,
             "type_hex":"0000000000000001"
           },
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
             "account":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
             "type":1,
             "type_hex":"0000000000000001"
           },
           {
             "currency":"USD",
             "issuer":"rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
             "type":48,
             "type_hex":"0000000000000030"
           },
           {
             "account":"rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
             "type":1,
             "type_hex":"0000000000000001"
           }
         ],
         [
           {
             "account":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
             "type":1,
             "type_hex":"0000000000000001"
           },
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
           }
         ]
       ],
       "source_amount":{
         "currency":"BTC",
         "issuer":"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
         "value":"0.000001541291269274307"
       }
     },
     {
       "paths_computed":[
         [
           {
             "account":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
             "type":1,
             "type_hex":"0000000000000001"
           },
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
         ]
       ],
       "source_amount":{
         "currency":"CHF",
         "issuer":"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
         "value":"0.0009211546262510451"
       }
     },
     {
       "paths_computed":[
         [
           {
             "account":"razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA",
             "type":1,
             "type_hex":"0000000000000001"
           },
           {
             "currency":"USD",
             "issuer":"rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
             "type":48,
             "type_hex":"0000000000000030"
           },
           {
             "account":"rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
             "type":1,
             "type_hex":"0000000000000001"
           }
         ],
         [
           {
             "account":"razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA",
             "type":1,
             "type_hex":"0000000000000001"
           },
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
         ]
       ],
       "source_amount":{
         "currency":"CNY",
         "issuer":"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
         "value":"0.006293562"
       }
     },
     {
       "paths_computed":[
         [
           {
             "account":"rGwUWgN5BEg3QGNY3RX2HfYowjUTZdid3E",
             "type":1,
             "type_hex":"0000000000000001"
           },
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
           }
         ],
         [
           {
             "account":"rGwUWgN5BEg3QGNY3RX2HfYowjUTZdid3E",
             "type":1,
             "type_hex":"0000000000000001"
           },
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
             "account":"rGwUWgN5BEg3QGNY3RX2HfYowjUTZdid3E",
             "type":1,
             "type_hex":"0000000000000001"
           },
           {
             "currency":"USD",
             "issuer":"rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
             "type":48,
             "type_hex":"0000000000000030"
           },
           {
             "account":"rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
             "type":1,
             "type_hex":"0000000000000001"
           }
         ]
       ],
       "source_amount":{
         "currency":"DYM",
         "issuer":"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
         "value":"0.0007157142857142858"
       }
     },
     {
       "paths_computed":[
         [
           {
             "account":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
             "type":1,
             "type_hex":"0000000000000001"
           },
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
             "account":"rLEsXccBGNR3UPuPu2hUXPjziKC3qKSBun",
             "type":1,
             "type_hex":"0000000000000001"
           },
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
             "account":"rLEsXccBGNR3UPuPu2hUXPjziKC3qKSBun",
             "type":1,
             "type_hex":"0000000000000001"
           },
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
           }
         ]
       ],
       "source_amount":{
         "currency":"EUR",
         "issuer":"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
         "value":"0.0007409623616236163"
       }
     },
     {
       "paths_computed":[
         [
           {
             "account":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
             "type":1,
             "type_hex":"0000000000000001"
           },
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
         ]
       ],
       "source_amount":{
         "currency":"JPY",
         "issuer":"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
         "value":"0.103412412"
       }
     }
   ],
   "destination_account":"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
   "destination_amount":{
     "currency":"USD",
     "issuer":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
     "value":"0.001"
   },
   "id":1,
   "source_account":"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
   "full_reply": false
 }
}
```

<!-- MULTICODE_BLOCK_END -->

この初期応答は[標準フォーマット](response-formatting.html)に従っており、正常に完了した場合は次のフィールドが含まれています。

| `Field`               | 型             | 説明                       |
|:----------------------|:-----------------|:----------------------------------|
| `alternatives`        | 配列            | 以下に説明する、提案される[パス](paths.html)のオブジェクトの配列。空の場合、送金元アカウントと送金先アカウントを結ぶパスが見つかりませんでした。 |
| `destination_account` | 文字列           | トランザクションを受信するアカウントの一意のアドレス。 |
| `destination_amount`  | 文字列またはオブジェクト | 送金先がトランザクションで受領する[通貨額][]。 |
| `id`                  | （各種）        | （WebSocketのみ）WebSocket要求に指定されているIDが再びこのレベルで含まれます。 |
| `source_account`      | 文字列           | トランザクションを送信するアカウントの一意のアドレス。 |
| `full_reply`          | ブール値          | `false`の場合、これは不完全な検索の結果です。これ以降の応答に、より適切なパスが含まれている可能性があります。`true`の場合、これは検出された最良のパスです。（理論上、これよりも優れたパスが存在している可能性がありますが`rippled`では検出されません。）Pathfinding要求をクローズするまで、`rippled`は引き続き、新しいレジャーが閉鎖されるたびに更新を送信します。[新規: rippled 0.29.0][] |

`alternatives`配列の各要素は、1つの送金元通貨（開始アカウントが保有）から送金先アカウントへのパスと通貨を表すオブジェクトです。このオブジェクトのフィールドを次に示します。

| `Field`          | 型             | 説明                            |
|:-----------------|:-----------------|:---------------------------------------|
| `paths_computed` | 配列            | [ペイメントパス](paths.html)を定義するオブジェクトの配列。 |
| `source_amount`  | 文字列またはオブジェクト | 送金先が必要な額を受領するために、送金元がこのパスで送金する必要がある[通貨額][]。 |

### 考えられるエラー

* [汎用エラータイプ][]のすべて。
* `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。
* `noEvents` - 非同期コールバックをサポートしていないプロトコル（JSON-RPCなど）を使用しています。（JSON-RPCと互換性が_ある_Pathfindingメソッドについては、[ripple_path_findメソッド][]を参照してください。）

### 非同期フォローアップ

サーバーからは初期応答の他に、時間の経過にともなう[ペイメントパス](paths.html)のステータスを更新するため類似したフォーマットでさらにメッセージが送信されます。これらのメッセージには、元のWebSocket要求の`id`が含まれているので、どの要求からメッセージが送信されたかを確認できます。また、最上位レベルの`"type": "path_find"`フィールドは、追加応答であることを示します。その他のフィールドは、初期応答と同じ方法で定義されます。

フォローアップに`"full_reply": true`が含まれている場合、これは現行レジャーの時点でrippledが検出できる最良のパスです。

path_find create要求からの非同期フォローアップの例を次に示します。

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
   "id":1,
   "type":"path_find",
   "alternatives":[
       /* paths omitted from this example; same format as the initial response */
   ],
   "destination_account":"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
   "destination_amount":{
       "currency":"USD",
       "issuer":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
       "value":"0.001"
   },
   "source_account":"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59"
}
```

<!-- MULTICODE_BLOCK_END -->

## path_find close
[[ソース]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/PathFind.cpp#L58-L67 "Source")

`path_find`の`close`サブコマンドは、サーバーに対して現在実行中のPathfinding要求に関する情報の送信を停止するように指示します。

### 要求フォーマット
要求フォーマットの例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
 "id":57,
 "command":"path_find",
 "subcommand":"close"
}
```

<!-- MULTICODE_BLOCK_END -->

要求には以下のパラメーターが含まれます。

| `Field`      | 型   | 説明                                |
|:-------------|:-------|:-------------------------------------------|
| `subcommand` | 文字列 | closeサブコマンドを送信するため`"close"`を使用します。 |

### 応答フォーマット

Pathfinding要求が正常にクローズされた場合、応答は[`path_find create`](#path_find-create)に対する初期応答と同じフォーマットであり、されに以下のフィールドが含まれます。

| `Field`  | 型    | 説明                                             |
|:---------|:--------|:--------------------------------------------------------|
| `closed` | ブール値 | 値が`true`の場合、これは`path_find close`コマンドに対する応答です。 |

未処理のPathfinding要求がない場合はエラーが返されます。

### 考えられるエラー

* [汎用エラータイプ][]のすべて。
* `invalidParams` - フィールドの指定が正しくないか、必須フィールドが指定されていません。
* `noEvents` - 非同期コールバックをサポートしていないプロトコル（JSON-RPCなど）でこのメソッドを使用しようとしました。（JSON-RPCと互換性が_ある_Pathfindingメソッドについては、[ripple_path_findメソッド][]を参照してください。）
* `noPathRequest` - Pathfinding要求をクローズしようとしましたが、実行中の要求がありませんでした。

## path_find status
[[ソース]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/PathFind.cpp#L69-L77 "Source")

`path_find`の`status`サブコマンドは、現在実行中のクライアントのPathfinding要求の即時更新を要求します。

### 要求フォーマット
要求フォーマットの例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
 "id":58,
 "command":"path_find",
 "subcommand":"status"
}
```

<!-- MULTICODE_BLOCK_END -->

要求には以下のパラメーターが含まれます。

| `Field`      | 型   | 説明                                  |
|:-------------|:-------|:---------------------------------------------|
| `subcommand` | 文字列 | `"status"`を使用して、statusサブコマンドを送信します。 |

### 応答フォーマット

Pathfinding要求が実行中の場合、応答は[`path_find create`](#path_find-create)に対する初期応答と同じフォーマットであるのに加えて、以下のフィールドがあります。

| `Field`  | 型    | 説明                                             |
|:---------|:--------|:--------------------------------------------------------|
| `status` | ブール値 | 値が`true`の場合、これは`path_find status`コマンドに対する応答です。 |

未処理のPathfinding要求がない場合はエラーが返されます。

### 考えられるエラー

* [汎用エラータイプ][]のすべて。
* `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。
* `noEvents` - 非同期コールバックをサポートしていないプロトコル（JSON-RPCなど）を使用しています。（JSON-RPCと互換性が_ある_Pathfindingメソッドについては、[ripple_path_findメソッド][]を参照してください。）
* `noPathRequest` - Pathfinding要求のステータスを確認しようとしましたが、処理中の要求がありませんでした。


{% include '_snippets/rippled_versions.md' %}
{% include '_snippets/rippled-api-links.md' %}
