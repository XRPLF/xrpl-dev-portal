# log_level
[[ソース]<br>](https://github.com/ripple/rippled/blob/155fcdbcd0b4927152892c8c8be01d9cf62bed68/src/ripple/rpc/handlers/LogLevel.cpp "Source")

`log_level`コマンドは`rippled`サーバーのログ詳細レベルを変更するか、各ログメッセージカテゴリー（_パーティション_）の現在のログレベルを返します。

_`log_level`メソッドは、権限のないユーザーは実行できない[管理メソッド](admin-rippled-methods.html)です。_

### 要求フォーマット
要求フォーマットの例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
   "id": "ll1",
   "command": "log_level",
   "severity": "debug",
   "partition": "PathRequest"
}
```

*コマンドライン*

```
#Syntax: log_level [[partition] severity]
rippled log_level PathRequest debug
```

<!-- MULTICODE_BLOCK_END -->

要求には以下のパラメーターが含まれます。

| `Field`     | 型   | 説明                                           |
|:------------|:-------|:------------------------------------------------------|
| `severity`  | 文字列 | _（省略可）_ 設定するログの詳細レベル。以下に、有効な値を詳細レベルの低いものから順に示します。`fatal`、`error`、`warn`、`info`、`debug`、および`trace`。省略すると、すべてのカテゴリーの現在のログ詳細レベルが返されます。 |
| `partition` | 文字列 | _（省略可）_`severity`が指定されていない場合は無視されます。変更するログカテゴリー。省略されている場合、または`base`の値が指定されている場合は、すべてのカテゴリーのログレベルを設定します。 |

### 応答フォーマット

成功した場合の応答例:

<!-- MULTICODE_BLOCK_START -->

*コマンドライン（ログレベルの設定）*

```
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005
{
  "result" : {
     "status" : "success"
  }
}
```

*コマンドライン（ログレベルの確認）*

```
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005
{
  "result" : {
     "levels" : {
        "AmendmentTable" : "Error",
        "Application" : "Error",
        "CancelOffer" : "Error",
        "Collector" : "Error",
        "CreateOffer" : "Error",
        "DeferredCredits" : "Error",
        "FeeVote" : "Error",
        "InboundLedger" : "Error",
        "JobQueue" : "Error",
        "Ledger" : "Error",
        "LedgerCleaner" : "Error",
        "LedgerConsensus" : "Error",
        "LedgerEntrySet" : "Error",
        "LedgerMaster" : "Error",
        "LedgerTiming" : "Error",
        "LoadManager" : "Error",
        "LoadMonitor" : "Error",
        "NetworkOPs" : "Error",
        "NodeObject" : "Error",
        "OrderBookDB" : "Error",
        "Overlay" : "Error",
        "PathRequest" : "Debug",
        "Payment" : "Error",
        "Peer" : "Error",
        "PeerFinder" : "Error",
        "Protocol" : "Error",
        "RPC" : "Error",
        "RPCErr" : "Error",
        "RPCHandler" : "Error",
        "RPCManager" : "Error",
        "Resolver" : "Error",
        "Resource" : "Error",
        "RippleCalc" : "Error",
        "SHAMap" : "Error",
        "SHAMapStore" : "Error",
        "SNTPClient" : "Error",
        "STAmount" : "Error",
        "SerializedLedger" : "Error",
        "Server" : "Error",
        "SetAccount" : "Error",
        "SetTrust" : "Error",
        "TaggedCache" : "Error",
        "TransactionAcquire" : "Error",
        "TransactionEngine" : "Error",
        "UVL" : "Error",
        "UniqueNodeList" : "Error",
        "Validations" : "Error",
        "WALCheckpointer" : "Error",
        "WebSocket" : "Trace",
        "base" : "Error"
     },
     "status" : "success"
  }
}
```

<!-- MULTICODE_BLOCK_END -->

応答は[標準フォーマット][]に従っています。応答フォーマットは、要求に`severity`が指定されているかどうかに応じて異なります。指定されていた場合はログレベルが変更され、成功した場合の結果には追加フィールドが含まれません。

それ以外の場合、要求には以下のフィールドが含まれます。

| `Field` | 型   | 説明                                               |
|:--------|:-------|:----------------------------------------------------------|
| `level` | オブジェクト | 各カテゴリーの現在のログレベル。このカテゴリーリストは、今後のリリースで予告なく変更される場合があります。このコマンドに対する要求で、フィールド名を`partition`の値として使用できます。 |

### 考えられるエラー

* [汎用エラータイプ][]のすべて。
* `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
