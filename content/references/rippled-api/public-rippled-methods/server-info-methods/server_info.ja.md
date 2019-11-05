# server_info
[[ソース]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/ServerInfo.cpp "Source")

`server_info`コマンドは、問い合わせ中の`rippled`サーバーについての各種情報を、人間が読めるフォーマットでサーバーに要求します。

## 要求フォーマット
要求フォーマットの例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
  "id": 1,
  "command": "server_info"
}
```

*JSON-RPC*

```
{
    "method": "server_info",
    "params": [
        {}
    ]
}
```

*コマンドライン*

```
#Syntax: server_info
rippled server_info
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](websocket-api-tool.html#server_info)

要求にパラメーターは何も含まれません。

## 応答フォーマット

処理が成功した応答の例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
  "id": 1,
  "status": "success",
  "type": "response",
  "result": {
    "info": {
      "build_version": "0.30.1-rc3",
      "complete_ledgers": "18611104-18614732",
      "hostid": "trace",
      "io_latency_ms": 1,
      "last_close": {
        "converge_time_s": 4.003,
        "proposers": 5
      },
      "load": {
        "job_types": [
          {
            "job_type": "untrustedProposal",
            "per_second": 2
          },
          {
            "in_progress": 1,
            "job_type": "clientCommand"
          },
          {
            "job_type": "transaction",
            "per_second": 4
          },
          {
            "job_type": "batch",
            "per_second": 3
          },
          {
            "job_type": "writeObjects",
            "per_second": 2
          },
          {
            "job_type": "trustedProposal",
            "per_second": 1
          },
          {
            "job_type": "peerCommand",
            "per_second": 108
          },
          {
            "job_type": "diskAccess",
            "per_second": 1
          },
          {
            "job_type": "processTransaction",
            "per_second": 4
          },
          {
            "job_type": "WriteNode",
            "per_second": 63
          }
        ],
        "threads": 6
      },
      "load_factor": 1000,
      "load_factor_net": 1000,
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
          "duration_us": "166972201508",
          "transitions": 1853
        },
        "syncing": {
          "duration_us": "6249156726",
          "transitions": 1854
        },
        "tracking": {
          "duration_us": "13035222",
          "transitions": 1854
        }
      },
      "uptime": 173379,
      "validated_ledger": {
        "age": 3,
        "base_fee_xrp": 0.00001,
        "hash": "04F7CF4EACC57140C8088F6BFDC8A824BB3ED5717C3DAA6642101F9FB446226C",
        "reserve_base_xrp": 20,
        "reserve_inc_xrp": 5,
        "seq": 18614732
      },
      "validation_quorum": 4,
      "validator_list_expires" : "2017-Oct-12 16:06:36"
    }
  }
}
```

*JSON-RPC*

```
200 OK
{
   "result" : {
      "info" : {
         "build_version" : "0.33.0-hf1",
         "complete_ledgers" : "24900901-24900984,24901116-24901158",
         "hostid" : "trace",
         "io_latency_ms" : 1,
         "last_close" : {
            "converge_time_s" : 2.001,
            "proposers" : 5
         },
         "load" : {
            "job_types" : [
               {
                  "in_progress" : 1,
                  "job_type" : "clientCommand"
               },
               {
                  "job_type" : "transaction",
                  "per_second" : 6
               },
               {
                  "job_type" : "batch",
                  "per_second" : 6
               },
               {
                  "in_progress" : 1,
                  "job_type" : "advanceLedger"
               },
               {
                  "job_type" : "trustedValidation",
                  "per_second" : 1
               },
               {
                  "avg_time" : 77,
                  "job_type" : "writeObjects",
                  "over_target" : true,
                  "peak_time" : 2990,
                  "per_second" : 2
               },
               {
                  "job_type" : "trustedProposal",
                  "per_second" : 2
               },
               {
                  "job_type" : "peerCommand",
                  "per_second" : 205
               },
               {
                  "avg_time" : 771,
                  "job_type" : "diskAccess",
                  "over_target" : true,
                  "peak_time" : 1934
               },
               {
                  "job_type" : "processTransaction",
                  "per_second" : 6
               },
               {
                  "job_type" : "SyncReadNode",
                  "per_second" : 4
               },
               {
                  "job_type" : "WriteNode",
                  "per_second" : 235
               }
            ],
            "threads" : 6
         },
         "load_factor" : 4.765625,
         "load_factor_local" : 4.765625,
         "peers" : 10,
         "pubkey_node" : "n9McNsnzzXQPbg96PEUrrQ6z3wrvgtU4M7c97tncMpSoDzaQvPar",
         "pubkey_validator" : "n9KM73uq5BM3Fc6cxG3k5TruvbLc8Ffq17JZBmWC4uP4csL4rFST",
         "published_ledger" : 24901158,
         "server_state" : "proposing",
         "server_state_duration_us": 708078257,
         "state_accounting" : {
            "connected" : {
               "duration_us" : "854824665",
               "transitions" : 2
            },
            "disconnected" : {
               "duration_us" : "2183055",
               "transitions" : 1
            },
            "full" : {
               "duration_us" : "944104343",
               "transitions" : 2
            },
            "syncing" : {
               "duration_us" : "9233178",
               "transitions" : 1
            },
            "tracking" : {
               "duration_us" : "0",
               "transitions" : 2
            }
         },
         "uptime" : 1792,
         "validated_ledger" : {
            "age" : 1,
            "base_fee_xrp" : 1e-05,
            "hash" : "D2C122281EB72E64D19B9654A8D3D0FC4207373D3FE5D91AE516685A58874621",
            "reserve_base_xrp" : 20,
            "reserve_inc_xrp" : 5,
            "seq" : 24901185
         },
         "validation_quorum" : 4,
         "validator_list_expires" : "2017-Oct-12 16:06:36"
      },
      "status" : "success"
   }
}
```

<!-- MULTICODE_BLOCK_END -->

応答は[標準フォーマット][]に従い、結果が正常な場合`info`オブジェクトが唯一のフィールドとして含まれます。

`info`オブジェクトには、以下のフィールドがいくつか配置される場合があります。

| `Field`                             | 型                      | 説明 |
|:------------------------------------|:--------------------------|:-----------|
| `amendment_blocked`                 | ブール値                   | _（省略される場合があります）_`true`の場合、このサーバーは[Amendment blocked](amendments.html#amendment-blocked)の状態です。サーバーがAmendment blockedの状態でない場合、このフィールドは応答から省略されます。[新規: rippled 0.80.0][] |
| `build_version`                     | 文字列                    | 実行中の`rippled`バージョンのバージョン番号。 |
| `closed_ledger`                     | オブジェクト                    | （省略される場合があります）コンセンサスによってまだ検証されていない、最も最近更新を閉鎖したレジャーについての情報。最新の検証済みレジャーが使用可能な場合、このフィールドは応答で省略され、代わりに`validated_ledger`が含まれます。メンバーフィールドは`validated_ledger`フィールドと同じです。 |
| `complete_ledgers`                  | 文字列                    | ローカル`rippled`がデータベース内に有するレジャーのバージョンのシーケンス番号の範囲を示す表現。例えば、`24900901-24900984,24901116-24901158`のように、互いに素なシーケンスの場合があります。サーバーに完全なレジャーがない場合（例えば、ネットワークとの同期を始めたばかりの場合）、文字列`empty`になります。 |
| `hostid`                            | 文字列                    | admin要求の場合、`rippled`インスタンスを実行するサーバーのホスト名が返されます。それ以外の要求の場合、一意の4文字の単語が返されます。 |
| `io_latency_ms`                     | 数値                    | I/O処理の待ち時間（ミリ秒単位）。この数値がそれほど低くない場合、`rippled`サーバーは深刻な負荷の問題を抱えている可能性があります。 |
| `last_close`                        | オブジェクト                    | サーバーが最後にレジャーを閉鎖したときの情報。これには、コンセンサスの取得に要した時間や、参加した信頼できるバリデータ（検証者）の数が含まれます。 |
| `load`                              | オブジェクト                    |  _（管理者のみ）_ サーバーの現在の負荷状態についての詳細な情報。 |
| `load.job_types`                    | 配列                     |  _（管理者のみ）_ サーバーが実行している各種ジョブのレートや、各ジョブにかかる時間についての情報。 |
| `load.threads`                      | 数値                    |  _（管理者のみ）_ サーバーの主要なジョブプール内のスレッドの数。 |
| `load_factor`                       | 数値                    | サーバーが現在施行中の、負荷スケーリングされたオープンレジャートランザクションコストを、基本トランザクションコストに適用される乗数として示したもの。例えば、負荷係数`1000`でリファレンストランザクションコストがXRP 10 dropである場合、負荷スケーリングされたトランザクションコストは10,000 drop（0.01 XRP）です。負荷係数は、[個々のサーバーの負荷係数](transaction-cost.html#ローカル負荷コスト)の最高値、クラスターの負荷係数、[オープンレジャーコスト](transaction-cost.html#オープンレジャーコスト)、ネットワーク全体の負荷係数によって決まります。[更新: rippled 0.33.0][新規: rippled 0.33.0] |
| `load_factor_local`                 | 数値                    | （省略される場合があります）このサーバーに対する負荷に基づく、[トランザクションコスト][]に適用される現在の乗数。 |
| `load_factor_net`                   | 数値                    | （省略される場合があります）ネットワークのその他の部分で使用されている、[トランザクションコスト][]に適用される現在の乗数（他のサーバーから報告された負荷値から推定します）。 |
| `load_factor_cluster`               | 数値                    | （省略される場合があります）[このクラスター](clustering.html)内のサーバーに対する負荷に基づく、[トランザクションコスト][]に適用される現在の乗数。 |
| `load_factor_fee_escalation`        | 数値                    | （省略される場合があります）オープンレジャーに入るために取引が支払う必要がある[トランザクションコスト][]に適用される現在の乗数。[新規: rippled 0.32.0][] |
| `load_factor_fee_queue`             | 数値                    | （省略される場合があります）キューが一杯になっている場合に、キューに入るために取引が支払う必要がある[トランザクションコスト][]に適用される現在の乗数。[新規: rippled 0.32.0][] |
| `load_factor_server`                | 数値                    | （省略される場合があります）サーバーが実施中の負荷係数。[オープンレジャーコスト](transaction-cost.html#オープンレジャーコスト)は含まれません。[新規: rippled 0.33.0][] |
| `peers`                             | 数値                    | このサーバーが現在接続している、他の`rippled`サーバーの数。 |
| `pubkey_node`                       | 文字列                    | ピアツーピア通信の中でこのサーバーを検証するために使用する公開鍵。この_ノードのキーペア_は、サーバーを初めて起動すると自動的に生成されます。（削除された場合、サーバーは新たなキーペアを作成できます。）構成ファイルにて`[node_seed]`設定オプションを使用すると、永続値を設定できます。これは[クラスター化](clustering.html)に便利です。 |
| `pubkey_validator`                  | 文字列                    |  _（管理者のみ）_ このノードがレジャーの検証の署名に使用する公開鍵。この_検証キーペア_は、`[validator_token]`または`[validation_seed]`設定フィールドにて生成されます。 |
| `server_state`                      | 文字列                    | サーバーのネットワークへの参加の度合いを示す文字列。詳細は、[考えられるサーバーの状態](rippled-server-states.html)を参照してください。 |
| `server_state_duration_us` | 数値 | サーバーが現在の状態になってから経過したマイクロ秒数。[新規: rippled 1.2.0][] |
| `state_accounting`                  | オブジェクト                    | 各種[サーバー状態](rippled-server-states.html)のマップと、サーバーが各状態に費やした時間についての情報。これは、サーバーのネットワーク接続について長期的な健全性を追跡するのに便利です。[新規: rippled 0.30.1][] |
| `state_accounting.*.duration_us`    | 文字列                    | サーバーがこの状態になってから費やしたマイクロ秒数。（サーバーが別の状態に移行するたびに更新されます。）[新規: rippled 0.30.1][] |
| `state_accounting.*.transitions`    | 数値                    | サーバーがこの状態に移行した回数。[新規: rippled 0.30.1][] |
| `uptime`                            | 数値                    | サーバーが連続して稼働している秒数。[新規: rippled 0.30.1][] |
| `validated_ledger`                  | オブジェクト                    | （省略される場合があります）完全に検証された最新のレジャーについての情報。最新の検証済みレジャーが使用できない場合、このフィールドは応答にて省略され、代わりに`closed_ledger`が含まれます。 |
| `validated_ledger.age`              | 数値                    | レジャーの閉鎖以降の秒数。 |
| `validated_ledger.base_fee_xrp`     | 数値                    | XRP単位の基本手数料。0.00005の場合は、`1e-05`などの科学的記数法で表すことができます。 |
| `validated_ledger.hash`             | 文字列                    | 16進数で表された、レジャーの一意のハッシュ |
| `validated_ledger.reserve_base_xrp` | 符号なし整数          | すべてのアカウントで準備金として保有しておく必要があるXRPの最少額（drop数ではありません） |
| `validated_ledger.reserve_inc_xrp`  | 符号なし整数          | アカウントがレジャー内に保有するオブジェクトごとのアカウント準備金に追加するXRP額（drop数ではありません） |
| `validated_ledger.seq`              | 数値 - [レジャーインデックス][] | 最新の検証済みレジャーのレジャーインデックス |
| `validation_quorum`                 | 数値                    | レジャーバージョンの検証に、最低限必要となる信頼できる検証の数。場合によっては、サーバーがさらに検証を要求する場合があります。 |
| `validator_list_expires`            | 文字列                    |  _（管理者のみ）_ 現在のバリデータリストの有効期限が切れるタイミングを人間が読み取れる時間でを表示、または、サーバーが発行済みのバリデータリストをロードしていない場合は文字列`unknown`、サーバーが静的なバリデータリストを使用する場合は文字列`never`のいずれかを表示します。[新規: rippled 0.80.1][] |

**注記:** `closed_ledger`フィールドがあり、`seq`の値が小さい（8桁未満）場合、`rippled`には現在、ピアツーピアネットワークから取得した検証済みレジャーのコピーがないことを表しています。これは、サーバーが現在も同期中である可能性を示しています。接続速度とハードウェア仕様にもよりますが、通常はネットワークとの同期に約5分かかります。

[トランザクションコスト]: transaction-cost.html

## 考えられるエラー

* いずれかの[汎用エラータイプ][]。


{% include '_snippets/rippled_versions.md' %}
{% include '_snippets/rippled-api-links.md' %}
