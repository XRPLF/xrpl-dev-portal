---
html: get_counts.html
parent: status-and-debugging-methods.html
seo:
    description: サーバの健全性に関するさまざまな統計情報を提供します。
labels:
  - コアサーバ
---
# get_counts
[[ソース]](https://github.com/XRPLF/rippled/blob/c7118a183a660648aa88a3546a6b2c5bce858440/src/ripple/rpc/handlers/GetCounts.cpp "Source")

`get_counts`コマンドは、サーバの健全性に関するさまざまな統計情報を提供します。そのほとんどは、現在メモリーに格納されている各種オブジェクトの数です。

_`get_counts`メソッドは、権限のないユーザは実行できない[管理メソッド](../index.md)です。_

### リクエストのフォーマット
リクエストのフォーマットの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
   "id": 90,
   "command": "get_counts",
   "min_count": 100
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
   "method": "get_counts",
   "params": [
       {
           "min_count": 100
       }
   ]
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
#Syntax: get_counts [min_count]
rippled get_counts 100
```
{% /tab %}

{% /tabs %}

リクエストには以下のパラメーターが含まれます。

| `Field`     | 型                      | 説明                        |
|:------------|:--------------------------|:-----------------------------------|
| `min_count` | 数値（符号なし整数） | この値以上の値を含むフィールドのみを返します。 |

### レスポンスのフォーマット

処理が成功したレスポンスの例:

{% tabs %}

{% tab label="JSON-RPC" %}
```json
{
  "result" : {
     "AL_hit_rate" : 48.36725616455078,
     "HashRouterEntry" : 3048,
     "Ledger" : 46,
     "NodeObject" : 10417,
     "SLE_hit_rate" : 64.62035369873047,
     "STArray" : 1299,
     "STLedgerEntry" : 646,
     "STObject" : 6987,
     "STTx" : 4104,
     "STValidation" : 610,
     "Transaction" : 4069,
     "dbKBLedger" : 10733,
     "dbKBTotal" : 39069,
     "dbKBTransaction" : 26982,
     "fullbelow_size" : 0,
     "historical_perminute" : 0,
     "ledger_hit_rate" : 71.0565185546875,
     "node_hit_rate" : 3.808214902877808,
     "node_read_bytes" : 393611911,
     "node_reads_hit" : 1283098,
     "node_reads_total" : 679410,
     "node_writes" : 1744285,
     "node_written_bytes" : 794368909,
     "status" : "success",
     "treenode_cache_size" : 6650,
     "treenode_track_size" : 598631,
     "uptime" : "3 hours, 50 minutes, 27 seconds",
     "write_load" : 0
  }
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```json
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005

{
  "result" : {
     "AL_hit_rate" : 48.36725616455078,
     "HashRouterEntry" : 3048,
     "Ledger" : 46,
     "NodeObject" : 10417,
     "SLE_hit_rate" : 64.62035369873047,
     "STArray" : 1299,
     "STLedgerEntry" : 646,
     "STObject" : 6987,
     "STTx" : 4104,
     "STValidation" : 610,
     "Transaction" : 4069,
     "dbKBLedger" : 10733,
     "dbKBTotal" : 39069,
     "dbKBTransaction" : 26982,
     "fullbelow_size" : 0,
     "historical_perminute" : 0,
     "ledger_hit_rate" : 71.0565185546875,
     "node_hit_rate" : 3.808214902877808,
     "node_read_bytes" : 393611911,
     "node_reads_hit" : 1283098,
     "node_reads_total" : 679410,
     "node_writes" : 1744285,
     "node_written_bytes" : 794368909,
     "status" : "success",
     "treenode_cache_size" : 6650,
     "treenode_track_size" : 598631,
     "uptime" : "3 hours, 50 minutes, 27 seconds",
     "write_load" : 0
  }
}
```
{% /tab %}

{% /tabs %}

レスポンスは[標準フォーマット][]に従っています。結果に含まれるフィールドのリストは、予告なく変更される可能性がありますが、（特に）以下のいずれかが含まれます。

| `Field`       | 型   | 説明                                         |
|:--------------|:-------|:----------------------------------------------------|
| `Transaction` | 数値 | メモリー内の`Transaction`オブジェクトの数       |
| `Ledger`      | 数値 | メモリー内のレジャーの数                     |
| `uptime`      | 文字列 | このサーバの連続稼働時間。 |

その他のほとんどのエントリでは、値はメモリー内に現在保持されている当該タイプのオブジェクトの数を示します。

### 考えられるエラー

* [汎用エラータイプ][]のすべて。
* `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
