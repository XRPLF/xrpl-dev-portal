# server_state
[[ソース]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/ServerState.cpp "Source")

`server_state`コマンドは、サーバーに対し`rippled`サーバーの現在の状態に関するさまざまな機械可読の情報を問い合わせます。応答は[server_infoメソッド][]の場合とほぼ同じですが、読み取りやすい単位ではなく処理しやすい単位を使用します。（たとえば、XRP値は科学的記数法や10進数値の代わりに整数のdrop数で示され、時刻は秒単位ではなくミリ秒単位で示されます。）

## 要求フォーマット
要求フォーマットの例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
 "id": 2,
 "command": "server_state"
}
```

*JSON-RPC*

```
{
   "method": "server_state",
   "params": [
       {}
   ]
}
```

*コマンドライン*

```
#Syntax: server_state
rippled server_state
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](websocket-api-tool.html#server_state)

要求はパラメーターをとりません。

## 応答フォーマット

処理が成功した応答の例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
 "id": 2,
 "status": "success",
 "type": "response",
 "result": {
   "state": {
     "build_version": "0.30.1-rc3",
     "complete_ledgers": "18611104-18615049",
     "io_latency_ms": 1,
     "last_close": {
       "converge_time": 3003,
       "proposers": 5
     },
     "load": {
       "job_types": [
         {
           "job_type": "untrustedProposal",
           "peak_time": 1,
           "per_second": 3
         },
         {
           "in_progress": 1,
           "job_type": "clientCommand"
         },
         {
           "avg_time": 12,
           "job_type": "writeObjects",
           "peak_time": 345,
           "per_second": 2
         },
         {
           "job_type": "trustedProposal",
           "per_second": 1
         },
         {
           "job_type": "peerCommand",
           "per_second": 64
         },
         {
           "avg_time": 33,
           "job_type": "diskAccess",
           "peak_time": 526
         },
         {
           "job_type": "WriteNode",
           "per_second": 55
         }
       ],
       "threads": 6
     },
     "load_base": 256,
     "load_factor": 256000,
     "peers": 10,
     "pubkey_node": "n94UE1ukbq6pfZY9j54sv2A1UrEeHZXLbns3xK5CzU9NbNREytaa",
     "pubkey_validator": "n9KM73uq5BM3Fc6cxG3k5TruvbLc8Ffq17JZBmWC4uP4csL4rFST",
     "server_state": "proposing",
     "server_state_duration_us": 92762334,
     "state_accounting": {
       "connected": {
         "duration_us": "150510079",
         "transitions": 1
       },
       "disconnected": {
         "duration_us": "1827731",
         "transitions": 1
       },
       "full": {
         "duration_us": "168295542987",
         "transitions": 1865
       },
       "syncing": {
         "duration_us": "6294237352",
         "transitions": 1866
       },
       "tracking": {
         "duration_us": "13035524",
         "transitions": 1866
       }
     },
     "uptime": 174748,
     "validated_ledger": {
       "base_fee": 10,
       "close_time": 507693650,
       "hash": "FEB17B15FB64E3AF8D371E6AAFCFD8B92775BB80AB953803BD73EA8EC75ECA34",
       "reserve_base": 20000000,
       "reserve_inc": 5000000,
       "seq": 18615049
     },
     "validation_quorum": 4,
     "validator_list_expires": 561139596
   }
 }
}
```

*JSON-RPC*

```
200 OK
{
  "result" : {
     "state" : {
        "build_version" : "0.30.1-rc3",
        "complete_ledgers" : "18611104-18615037",
        "io_latency_ms" : 1,
        "last_close" : {
           "converge_time" : 2001,
           "proposers" : 5
        },
        "load" : {
           "job_types" : [
              {
                 "job_type" : "untrustedProposal",
                 "per_second" : 2
              },
              {
                 "in_progress" : 1,
                 "job_type" : "clientCommand"
              },
              {
                 "job_type" : "writeObjects",
                 "per_second" : 2
              },
              {
                 "avg_time" : 2,
                 "job_type" : "acceptLedger",
                 "peak_time" : 6
              },
              {
                 "job_type" : "trustedProposal",
                 "per_second" : 1
              },
              {
                 "job_type" : "peerCommand",
                 "per_second" : 80
              },
              {
                 "job_type" : "diskAccess",
                 "per_second" : 1
              },
              {
                 "job_type" : "WriteNode",
                 "per_second" : 91
              }
           ],
           "threads" : 6
        },
        "load_base" : 256,
        "load_factor" : 256000,
        "peers" : 10,
        "pubkey_node" : "n94UE1ukbq6pfZY9j54sv2A1UrEeHZXLbns3xK5CzU9NbNREytaa",
        "pubkey_validator" : "n9KM73uq5BM3Fc6cxG3k5TruvbLc8Ffq17JZBmWC4uP4csL4rFST",
        "server_state" : "proposing",
        "server_state_duration_us": 708078257,
        "state_accounting" : {
           "connected" : {
              "duration_us" : "150510079",
              "transitions" : 1
           },
           "disconnected" : {
              "duration_us" : "1827731",
              "transitions" : 1
           },
           "full" : {
              "duration_us" : "168241260112",
              "transitions" : 1865
           },
           "syncing" : {
              "duration_us" : "6294237352",
              "transitions" : 1866
           },
           "tracking" : {
              "duration_us" : "13035524",
              "transitions" : 1866
           }
        },
        "uptime" : 174693,
        "validated_ledger" : {
           "base_fee" : 10,
           "close_time" : 507693592,
           "hash" : "1C26209AE593C7EB5123363B3152D86514845FBD42CC6B05111D57F62D02B113",
           "reserve_base" : 20000000,
           "reserve_inc" : 5000000,
           "seq" : 18615037
        },
        "validation_quorum" : 4,
        "validator_list_expires" : 561139596
     },
     "status" : "success"
  }
}

```

<!-- MULTICODE_BLOCK_END -->

応答は[標準フォーマット][]に従っており、正常に完了した場合は、結果に唯一のフィールドとして`state`オブジェクトが含まれています。

`state`オブジェクトには、以下のフィールドが含まれています。

| `Field`                          | 型             | 説明            |
|:---------------------------------|:-----------------|:-----------------------|
| `amendment_blocked`              | ブール値          | _（省略される場合があります）_`true`の場合、このサーバーは[Amendment blocked](amendments.html#amendment-blocked)の状態です。サーバーがAmendment blockedではない場合、応答ではこのフィールドが省略されます。[新規: rippled 0.80.0][] |
| `build_version`                  | 文字列           | 実行中の`rippled`バージョンのバージョン番号。 |
| `complete_ledgers`               | 文字列           | ローカルの`rippled`がデータベース内に有するレジャーバージョンのシーケンス番号の範囲を示す表現。例えば、「2500-5000,32570-7695432」のように互いに素なシーケンスの場合があります。サーバーに完全なレジャーがない場合（例えば、ネットワークとの同期を始めたばかりの場合）、文字列`empty`になります。 |
| `closed_ledger`                  | オブジェクト           | （省略される場合があります）コンセンサスによって検証されていない、最新の閉鎖済みレジャーに関する情報。最新の検証済みレジャーが使用可能な場合、応答ではこのフィールドは省略され、代わりに`validated_ledger`が含まれます。メンバーフィールドは`validated_ledger`フィールドと同じです。 |
| `io_latency_ms`                  | 数値           | I/O処理の待機に費やされた時間数（ミリ秒単位）。この数値が極端に低くない場合、`rippled`サーバーでは深刻な負荷の問題が発生している可能性があります。 |
| `load`                           | オブジェクト           | _（管理者専用）_ サーバーの現在の負荷状態についての詳細な情報。 |
| `load.job_types`                 | 配列            | _（管理者専用）_ サーバーが実行している各種ジョブのレートや、各ジョブに要する時間についての情報。 |
| `load.threads`                   | 数値           | _（管理者専用）_ サーバーの主要なジョブプール内のスレッド数。 |
| `load_base`                      | 整数          | [トランザクションコスト](transaction-cost.html)の計算で使用されるサーバー負荷のベースライン量です。`load_factor`が`load_base`と同等の場合、基本トランザクションコストのみが適用されます。`load_factor`が`load_base`よりも大きい場合、トランザクションコストにそれらの値の比率が乗算されます。たとえば`load_factor`が`load_base`の2倍である場合、トランザクションコストは2倍になります。 |
| `load_factor`                    | 数値           | サーバーが現在適用している負荷係数。トランザクションコストの乗数は、この値と`load_base`の比率によって決まります。負荷係数は、個別サーバーの最も高い負荷係数、クラスターの負荷係数、[オープンレジャーコスト](transaction-cost.html#オープンレジャーコスト)、およびネットワーク全体の負荷係数によって決定します。[更新: rippled 0.33.0][新規: rippled 0.33.0] |
| `load_factor_fee_escalation`     | 整数          | （省略される場合があります）オープンレジャーに入るときに[トランザクションコスト][]に適用される現在の乗数（[手数料レベル][]）。[新規: rippled 0.32.0][] |
| `load_factor_fee_queue`          | 整数          | （省略される場合があります）キューが一杯になっている場合に、キューへ入るときに[トランザクションコスト][]に適用される現在の乗数（[手数料レベル][]）。[新規: rippled 0.32.0][] |
| `load_factor_fee_reference`      | 整数          | （省略される場合があります）負荷スケーリングのない[トランザクションコスト][]（[手数料レベル][]）。[新規: rippled 0.32.0][] |
| `load_factor_server`             | 数値           | （省略される場合があります）サーバーが適用している負荷係数。[オープンレジャーコスト](transaction-cost.html#オープンレジャーコスト)は含まれません。[新規: rippled 0.33.0][] |
| `peers`                          | 数値           | このサーバーが現在接続している他の`rippled`サーバーの数。 |
| `pubkey_node`                    | 文字列           | ピアツーピア通信のためにこのサーバーを検証する際に使用される公開鍵。サーバーを初めて起動すると、サーバーにより _ノードキーペア_ が自動的に生成されます。（キーペアが削除されている場合、サーバーは新しいキーペアを作成できます。）`[node_seed]`構成オプションを使用して構成ファイルの永続値を設定できます。これは[クラスター化](clustering.html)で便利です。 |
| `pubkey_validator`               | 文字列           | _（管理者専用）_ このノードがレジャー検証の署名に使用する公開鍵。_検証キーペア_ は、`[validator_token]`構成フィールドまたは`[validation_seed]`構成フィールドから生成されます。 |
| `server_state`                   | 文字列           | サーバーのネットワークへの参加度を示す文字列。詳細は、[考えられるサーバーの状態](rippled-server-states.html)を参照してください。 |
| `server_state_duration_us` | 数値 | サーバーが現在の状態になってから経過した連続マイクロ秒数。[新規: rippled 1.2.0][] |
| `state_accounting`               | オブジェクト           | 各種[サーバー状態](rippled-server-states.html)のマップと、サーバーが各状態に費やした時間についての情報。これは、サーバーのネットワーク接続性の健全性を長期的に追跡するのに便利です。[新規: rippled 0.30.1][] |
| `state_accounting.*.duration_us` | 文字列           | サーバーがこの状態になってから経過したマイクロ秒数。（サーバーが別の状態に移行するたびに更新されます。）[新規: rippled 0.30.1][] |
| `state_accounting.*.transitions` | 数値           | サーバーがこの状態に移行した回数。[新規: rippled 0.30.1][] |
| `uptime`                         | 数値           | サーバーが連続稼働している秒数。[新規: rippled 0.30.1][] |
| `validated_ledger`               | オブジェクト           | （省略される場合があります）完全に検証された最新のレジャーについての情報。最新の検証済みレジャーが使用できない場合、このフィールドは応答で省略され、代わりに`closed_ledger`が含まれます。 |
| `validated_ledger.base_fee`      | 符号なし整数 | ネットワークへのトランザクション伝達にかかる基本手数料（XRPのdrop数）。 |
| `validated_ledger.close_time`    | 数値           | レジャーが閉鎖された時刻（[Rippleエポック以降の経過秒数][]） |
| `validated_ledger.hash`          | 文字列           | 当該レジャーバージョンの一意のハッシュ（16進数） |
| `validated_ledger.reserve_base`  | 符号なし整数 | すべてのアカウントで準備金として保有する必要がある最小額（XRPのdrop数） |
| `validated_ledger.reserve_inc`   | 符号なし整数 | アカウントがレジャー内に保有する各アイテムのアカウント準備金に追加する額（XRPのdrop数）。 |
| `validated_ledger.seq`           | 符号なし整数 | このレジャーの一意のシーケンス番号 |
| `validation_quorum`              | 数値           | 1つのレジャーバージョンの検証に最低限必要となる信頼できる検証の数。状況によっては、サーバーがさらに検証を要求する場合があります。 |
| `validator_list_expires`         | 数値           | _（管理者専用）_ 現在のバリデータリストが期限切れになる時点（[Rippleエポック以降の経過秒数][]）。サーバーが発行済みのバリデータリストをロードしていない場合は0。[新規: rippled 0.80.1][] |


## 考えられるエラー

* [汎用エラータイプ][]のすべて。

<!-- TODO: add fee levels and transaction cost to rippled-api-links.md. multiple files are including them one-off, as below -->
[手数料レベル]: transaction-cost.html#手数料レベル
[トランザクションコスト]: transaction-cost.html
{% include '_snippets/rippled_versions.md' %}
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
