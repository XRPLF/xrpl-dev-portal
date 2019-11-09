# fee
[[ソース]<br>](https://github.com/ripple/rippled/blob/release/src/ripple/rpc/handlers/Fee1.cpp "Source")

`fee`コマンドは、[トランザクションコスト](transaction-cost.html)に関するオープンレジャーの要件の現在の状態を報告します。このコマンドを使用するには、[FeeEscalation Amendment][]が有効になっている必要があります。[新規: rippled 0.31.0][]

これは権限のないユーザーが使用できるパブリックコマンドです。[更新: rippled 0.32.0][新規: rippled 0.32.0]

## 要求フォーマット
要求フォーマットの例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
 "id":"fee_websocket_example",
 "command":"fee"
}
```

*JSON-RPC*

```
{
   "method":"fee",
   "params":[{}]
}
```

*コマンドライン*

```
#Syntax: fee
rippled fee
```

<!-- MULTICODE_BLOCK_END -->

要求にはパラメーターは含まれていません。

## 応答フォーマット

処理が成功した応答の例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
 "id":"fee_websocket_example",
 "status":"success",
 "type":"response",
 "result":{
   "current_ledger_size":"14",
   "current_queue_size":"0",
   "drops":{
     "base_fee":"10",
     "median_fee":"11000",
     "minimum_fee":"10",
     "open_ledger_fee":"10"
   },
   "expected_ledger_size":"24",
   "ledger_current_index":26575101,
   "levels":{
     "median_level":"281600",
     "minimum_level":"256",
     "open_ledger_level":"256",
     "reference_level":"256"
   },
   "max_queue_size":"480"
 }
}
```

*JSON-RPC*

```
200 OK
{
   "result":{
       "current_ledger_size":"56",
       "current_queue_size":"11",
       "drops":{
           "base_fee":"10",
           "median_fee":"10000",
           "minimum_fee":"10",
           "open_ledger_fee":"2653937"
       },
       "expected_ledger_size":"55",
       "ledger_current_index":26575101,
       "levels":{
           "median_level":"256000",
           "minimum_level":"256",
           "open_ledger_level":"67940792",
           "reference_level":"256"
       },
       "max_queue_size":"1100",
       "status":"success"
   }
}
```

*コマンドライン*

```
Loading:"/etc/rippled.cfg"
Connecting to 127.0.0.1:5005
{
  "result" :{
     "current_ledger_size" :"16",
     "current_queue_size" :"2",
     "drops" :{
        "base_fee" :"10",
        "median_fee" :"11000",
        "minimum_fee" :"10",
        "open_ledger_fee" :"3203982"
     },
     "expected_ledger_size" :"15",
     "ledger_current_index":26575101,
     "levels" :{
        "median_level" :"281600",
        "minimum_level" :"256",
        "open_ledger_level" :"82021944",
        "reference_level" :"256"
     },
     "max_queue_size" :"300",
     "status" :"success"
  }
}
```

<!-- MULTICODE_BLOCK_END -->

この応答は[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれます。

| `Field`                    | 型             | 説明                  |
|:---------------------------|:-----------------|:-----------------------------|
| `current_ledger_size`      | 文字列（整数） | 進行中のレジャーに暫定的に含まれているトランザクションの数。 |
| `current_queue_size`       | 文字列（整数） | 次のレジャーに追加するためにキューに入れられたトランザクションの数。 |
| `drops`                    | オブジェクト           | [XRPのdrop数][]で表されるトランザクションコスト（トランザクションの`Fee`フィールド）に関するさまざまな情報 。 |
| `drops.base_fee`           | 文字列（整数） | 最小限の負荷でレジャーに[リファレンストランザクション](transaction-cost.html#referenceトランザクションコスト)を追加するのに必要なトランザクションコスト（XRPのdrop数）。 |
| `drops.median_fee`         | 文字列（整数） | 前の検証済みレジャーに含まれているトランザクションのトランザクションコストのおおよその中央値（XRPのdrop数）。 |
| `drops.minimum_fee`        | 文字列（整数） | 後のレジャーのキューに[リファレンストランザクション](transaction-cost.html#referenceトランザクションコスト)を入れる際の最少トランザクションコスト（XRPのdrop数）。`base_fee`より大きい場合、トランザクションキューは一杯になっています。 |
| `drops.open_ledger_fee`    | 文字列（整数） | 現在のオープンレジャーに[リファレンストランザクション](transaction-cost.html#referenceトランザクションコスト)を追加する際に支払う必要がある最少トランザクションコスト（XRPのdrop数）。 |
| `expected_ledger_size`     | 文字列（整数） | 現行レジャーへ追加される見込みのトランザクションの概数。これは前のレジャーのトランザクション数に基づいています。 |
| `ledger_current_index`     | 数値           | これらのステータスにより示される現行オープンレジャーの[レジャーインデックス][]。[新規: rippled 0.50.0][] |
| `levels`                   | オブジェクト           | トランザクションコスト（[手数料レベル][]）に関するさまざまな情報。手数料レベルの比率は、その特定トランザクションの最少コストを基準にすべてのトランザクションに適用されます。 |
| `levels.median_level`      | 文字列（整数） | 前の検証済みレジャーに含まれているトランザクションのトランザクションコストの中央値（[手数料レベル][]）。 |
| `levels.minimum_level`     | 文字列（整数） | 今後のレジャーのキューに入れるのに必要となる最少トランザクションコスト（[手数料レベル][]）。 |
| `levels.open_ledger_level` | 文字列（整数） | 現行オープンレジャーにトランザクションを追加するのに必要な最少トランザクションコスト（[手数料レベル][]）。 |
| `levels.reference_level`   | 文字列（整数） | 最少トランザクションコストに相当します（[手数料レベル][]で表現されます）。 |
| `max_queue_size`           | 文字列（整数） | [トランザクションキュー](transaction-cost.html#キューに入れられたトランザクション)で現在保持できるトランザクションの最大数。 |

## 考えられるエラー

* [汎用エラータイプ][]のすべて。


<!-- TODO: fee levels link to rippled-api-links.md - it is being used one off in a couple of files -->
[手数料レベル]: transaction-cost.html#手数料レベル
{% include '_snippets/rippled_versions.md' %}
{% include '_snippets/rippled-api-links.md' %}
