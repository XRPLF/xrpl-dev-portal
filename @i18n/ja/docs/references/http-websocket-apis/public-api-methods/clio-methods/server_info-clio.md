---
html: server_info-clio.html
parent: clio-methods.html
seo:
    description: Clioサーバの状態を人間が読める形式で取得します。
labels:
  - コアサーバ
---
# server_info
[[ソース]](https://github.com/XRPLF/clio/blob/master/src/rpc/handlers/ServerInfo.cpp "ソース")

`server_info`コマンドは[Clioサーバ](../../../../concepts/networks-and-servers/the-clio-server.md)にクエリされるClioサーバに関する様々な情報を人間が読める形で問い合わせます。`rippled`サーバについては、代わりに[`server_info` (`rippled`)](../server-info-methods/server_info.md)をご覧ください。{% badge href="https://github.com/XRPLF/clio/releases/tag/1.0.0" %}新規: Clio v1.0.0{% /badge %}


## リクエストのフォーマット
リクエストのフォーマットの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 1,
  "command": "server_info"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "server_info",
    "params": [
        {}
    ]
}
```
{% /tab %}

{% /tabs %}

<!-- [Try it! >](websocket-api-tool.html#server_info) -->

リクエストにパラメーターは含みません。

## レスポンスのフォーマット

クライアントが`localhost`経由でClioサーバに接続すると、レスポンスには`counters`オブジェクトと`etl`オブジェクトが含まれます。クライアントが同じサーバに存在せず、`localhost`経由で接続しない場合、これらのオブジェクトはレスポンスから省略されます。

クライアントが`localhost`経由で接続した場合の成功したレスポンスの例：

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "id": 1,
    "result": {
        "info": {
            "complete_ledgers": "19499132-19977628",
            "counters": {
                "rpc": {
                    "account_objects": {
                        "started": "1",
                        "finished": "1",
                        "errored": "0",
                        "forwarded": "0",
                        "duration_us": "991"
                    },
                    "account_tx": {
                        "started": "1",
                        "finished": "1",
                        "errored": "0",
                        "forwarded": "0",
                        "duration_us": "91633"
                    },
                    "account_lines": {
                        "started": "5",
                        "finished": "5",
                        "errored": "0",
                        "forwarded": "0",
                        "duration_us": "4915159"
                    },
                    "submit_multisigned": {
                        "started": "2",
                        "finished": "2",
                        "errored": "0",
                        "forwarded": "2",
                        "duration_us": "4823"
                    },
                    "ledger_entry": {
                        "started": "1",
                        "finished": "1",
                        "errored": "0",
                        "forwarded": "0",
                        "duration_us": "17806"
                    },
                    "server_info": {
                        "started": "5",
                        "finished": "5",
                        "errored": "0",
                        "forwarded": "0",
                        "duration_us": "2375580"
                    },
                    "account_info": {
                        "started": "5",
                        "finished": "5",
                        "errored": "0",
                        "forwarded": "5",
                        "duration_us": "9256"
                    },
                    "account_currencies": {
                        "started": "4",
                        "finished": "4",
                        "errored": "0",
                        "forwarded": "0",
                        "duration_us": "517302"
                    },
                    "noripple_check": {
                        "started": "1",
                        "finished": "1",
                        "errored": "0",
                        "forwarded": "1",
                        "duration_us": "2218"
                    },
                    "tx": {
                        "started": "1",
                        "finished": "1",
                        "errored": "0",
                        "forwarded": "0",
                        "duration_us": "562"
                    },
                    "gateway_balances": {
                        "started": "6",
                        "finished": "6",
                        "errored": "0",
                        "forwarded": "0",
                        "duration_us": "1395156"
                    },
                    "channel_authorize": {
                        "started": "1",
                        "finished": "1",
                        "errored": "0",
                        "forwarded": "1",
                        "duration_us": "2017"
                    },
                    "manifest": {
                        "started": "1",
                        "finished": "1",
                        "errored": "0",
                        "forwarded": "1",
                        "duration_us": "1707"
                    },
                    "subscribe": {
                        "started": "6",
                        "finished": "6",
                        "errored": "0",
                        "forwarded": "0",
                        "duration_us": "116"
                    },
                    "random": {
                        "started": "1",
                        "finished": "1",
                        "errored": "0",
                        "forwarded": "0",
                        "duration_us": "111"
                    },
                    "ledger_data": {
                        "started": "14",
                        "finished": "3",
                        "errored": "11",
                        "forwarded": "0",
                        "duration_us": "6179145"
                    },
                    "ripple_path_find": {
                        "started": "1",
                        "finished": "1",
                        "errored": "0",
                        "forwarded": "1",
                        "duration_us": "1409563"
                    },
                    "account_channels": {
                        "started": "14",
                        "finished": "14",
                        "errored": "0",
                        "forwarded": "0",
                        "duration_us": "1062692"
                    },
                    "submit": {
                        "started": "6",
                        "finished": "6",
                        "errored": "0",
                        "forwarded": "6",
                        "duration_us": "11383"
                    },
                    "transaction_entry": {
                        "started": "8",
                        "finished": "5",
                        "errored": "3",
                        "forwarded": "0",
                        "duration_us": "494131"
                    }
                },
                "subscriptions": {
                    "ledger": 0,
                    "transactions": 0,
                    "transactions_proposed": 0,
                    "manifests": 2,
                    "validations": 2,
                    "account": 0,
                    "accounts_proposed": 0,
                    "books": 0
                }
            },
            "load_factor": 1,
            "clio_version": "0.3.0-b2",
            "validation_quorum": 8,
            "rippled_version": "1.9.1-rc1",
            "validated_ledger": {
                "age": 4,
                "hash": "4CD25FB70D45646EE5822E76E58B66D39D5AE6BA0F70491FA803DA0DA218F434",
                "seq": 19977628,
                "base_fee_xrp": 1E-5,
                "reserve_base_xrp": 1E1,
                "reserve_inc_xrp": 2E0
            }
        },
        "cache": {
            "size": 8812733,
            "is_full": true,
            "latest_ledger_seq": 19977629
        },
        "etl": {
            "etl_sources": [
                {
                    "validated_range": "19405538-19977629",
                    "is_connected": "1",
                    "ip": "52.36.182.38",
                    "ws_port": "6005",
                    "grpc_port": "50051",
                    "last_msg_age_seconds": "0"
                }
            ],
            "is_writer": true,
            "read_only": false,
            "last_publish_age_seconds": "2"
        },
        "validated": true
    },
    "status": "success",
    "type": "response",
    "warnings": [
        {
            "id": 2001,
            "message": "This is a clio server. clio only serves validated data. If you want to talk to rippled, include ledger_index:current in your request"
        },
        {
            "id": 2002,
            "message": "This server may be out of date"
        }
    ]
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
200 OK

{
    "result": {
        "info": {
            "complete_ledgers": "19499132-19977628",
            "counters": {
                "rpc": {
                    "account_objects": {
                        "started": "1",
                        "finished": "1",
                        "errored": "0",
                        "forwarded": "0",
                        "duration_us": "991"
                    },
                    "account_tx": {
                        "started": "1",
                        "finished": "1",
                        "errored": "0",
                        "forwarded": "0",
                        "duration_us": "91633"
                    },
                    "account_lines": {
                        "started": "5",
                        "finished": "5",
                        "errored": "0",
                        "forwarded": "0",
                        "duration_us": "4915159"
                    },
                    "submit_multisigned": {
                        "started": "2",
                        "finished": "2",
                        "errored": "0",
                        "forwarded": "2",
                        "duration_us": "4823"
                    },
                    "ledger_entry": {
                        "started": "1",
                        "finished": "1",
                        "errored": "0",
                        "forwarded": "0",
                        "duration_us": "17806"
                    },
                    "server_info": {
                        "started": "5",
                        "finished": "5",
                        "errored": "0",
                        "forwarded": "0",
                        "duration_us": "2375580"
                    },
                    "account_info": {
                        "started": "5",
                        "finished": "5",
                        "errored": "0",
                        "forwarded": "5",
                        "duration_us": "9256"
                    },
                    "account_currencies": {
                        "started": "4",
                        "finished": "4",
                        "errored": "0",
                        "forwarded": "0",
                        "duration_us": "517302"
                    },
                    "noripple_check": {
                        "started": "1",
                        "finished": "1",
                        "errored": "0",
                        "forwarded": "1",
                        "duration_us": "2218"
                    },
                    "tx": {
                        "started": "1",
                        "finished": "1",
                        "errored": "0",
                        "forwarded": "0",
                        "duration_us": "562"
                    },
                    "gateway_balances": {
                        "started": "6",
                        "finished": "6",
                        "errored": "0",
                        "forwarded": "0",
                        "duration_us": "1395156"
                    },
                    "channel_authorize": {
                        "started": "1",
                        "finished": "1",
                        "errored": "0",
                        "forwarded": "1",
                        "duration_us": "2017"
                    },
                    "manifest": {
                        "started": "1",
                        "finished": "1",
                        "errored": "0",
                        "forwarded": "1",
                        "duration_us": "1707"
                    },
                    "subscribe": {
                        "started": "6",
                        "finished": "6",
                        "errored": "0",
                        "forwarded": "0",
                        "duration_us": "116"
                    },
                    "random": {
                        "started": "1",
                        "finished": "1",
                        "errored": "0",
                        "forwarded": "0",
                        "duration_us": "111"
                    },
                    "ledger_data": {
                        "started": "14",
                        "finished": "3",
                        "errored": "11",
                        "forwarded": "0",
                        "duration_us": "6179145"
                    },
                    "ripple_path_find": {
                        "started": "1",
                        "finished": "1",
                        "errored": "0",
                        "forwarded": "1",
                        "duration_us": "1409563"
                    },
                    "account_channels": {
                        "started": "14",
                        "finished": "14",
                        "errored": "0",
                        "forwarded": "0",
                        "duration_us": "1062692"
                    },
                    "submit": {
                        "started": "6",
                        "finished": "6",
                        "errored": "0",
                        "forwarded": "6",
                        "duration_us": "11383"
                    },
                    "transaction_entry": {
                        "started": "8",
                        "finished": "5",
                        "errored": "3",
                        "forwarded": "0",
                        "duration_us": "494131"
                    }
                },
                "subscriptions": {
                    "ledger": 0,
                    "transactions": 0,
                    "transactions_proposed": 0,
                    "manifests": 2,
                    "validations": 2,
                    "account": 0,
                    "accounts_proposed": 0,
                    "books": 0
                }
            },
            "load_factor": 1,
            "clio_version": "0.3.0-b2",
            "validation_quorum": 8,
            "rippled_version": "1.9.1-rc1",
            "validated_ledger": {
                "age": 4,
                "hash": "4CD25FB70D45646EE5822E76E58B66D39D5AE6BA0F70491FA803DA0DA218F434",
                "seq": 19977628,
                "base_fee_xrp": 1E-5,
                "reserve_base_xrp": 1E1,
                "reserve_inc_xrp": 2E0
            }
        },
        "cache": {
            "size": 8812733,
            "is_full": true,
            "latest_ledger_seq": 19977629
        },
        "etl": {
            "etl_sources": [
                {
                    "validated_range": "19405538-19977629",
                    "is_connected": "1",
                    "ip": "52.36.182.38",
                    "ws_port": "6005",
                    "grpc_port": "50051",
                    "last_msg_age_seconds": "0"
                }
            ],
            "is_writer": true,
            "read_only": false,
            "last_publish_age_seconds": "2"
        },
        "validated": true,
    },
    "status": "success",
    "type": "response",
    "warnings": [
        {
            "id": 2001,
            "message": "This is a clio server. clio only serves validated data. If you want to talk to rippled, include ledger_index:current in your request"
        },
        {
            "id": 2002,
            "message": "This server may be out of date"
        }
    ]
}
```
{% /tab %}

{% /tabs %}

クライアントが`localhost`経由で接続しなかった場合の成功レスポンスの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "id": 1,
    "result": {
        "info": {
            "complete_ledgers":"32570-73737719",
            "load_factor":1,
            "clio_version":"1.0.2",
            "validation_quorum":28,
            "rippled_version":"1.9.1",
            "validated_ledger": {
                "age":7,
                "hash":"4ECDEAF9E6F8B37EFDE297953168AAB42DEED1082A565639EBB2D29E047341B4",
                "seq":73737719,
                "base_fee_xrp":1E-5,
                "reserve_base_xrp":1E1,
                "reserve_inc_xrp":2E0
            },
            "cache": {
                "size":15258947,
                "is_full":true,
                "latest_ledger_seq":73737719
            }
        },
        "validated":true,
        "status":"success"
    },
    "warnings": [
        {
            "id":2001,
            "message":"This is a clio server. clio only serves validated data. If you want to talk to rippled, include 'ledger_index':'current' in your request"
        }
    ]
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
200 OK

{
    "result": {
        "info": {
            "complete_ledgers":"32570-73737719",
            "load_factor":1,
            "clio_version":"1.0.2",
            "validation_quorum":28,
            "rippled_version":"1.9.1",
            "validated_ledger": {
                "age":7,
                "hash":"4ECDEAF9E6F8B37EFDE297953168AAB42DEED1082A565639EBB2D29E047341B4",
                "seq":73737719,
                "base_fee_xrp":1E-5,
                "reserve_base_xrp":1E1,
                "reserve_inc_xrp":2E0
            },
            "cache": {
                "size":15258947,
                "is_full":true,
                "latest_ledger_seq":73737719
            }
        },
        "validated":true,
        "status":"success"
    },
    "warnings": [
        {
            "id":2001,
            "message":"This is a clio server. clio only serves validated data. If you want to talk to rippled, include 'ledger_index':'current' in your request"
        }
    ]
}
```
{% /tab %}

{% /tabs %}

レスポンスは[標準フォーマット][]に従い、結果が正常な場合`info`オブジェクトが唯一のフィールドとして含まれます。

`info`オブジェクトは以下のフィールドを含むことがあります。

| `Field`                                | 型            | 説明          |
|:---------------------------------------|:--------------|:---------------------|
| `complete_ledgers`                     | 文字列         | ローカル`rippled`がデータベース内に有するレジャーのバージョンのシーケンス番号の範囲を示す表現。例えば、`24900901-24900984,24901116-24901158`のように、互いに素なシーケンスの場合があります。サーバに完全なレジャーがない場合（例えば、ネットワークとの同期を始めたばかりの場合）、文字列`empty`になります。 |
| `counters`                             | オブジェクト    | _(省略される場合があります)_ サーバ起動以降に処理されたAPIコールの統計。クライアントが`localhost`経由でClioサーバに接続した場合のみ表示されます。
| `rpc`                                  | オブジェクト    | _(省略される場合があります)_ 起動時からClioサーバが処理した各API呼び出しの統計情報。これは`counters`オブジェクトの中にネストされているので、クライアントが`localhost`経由でClioサーバに接続した場合のみ存在します。 |
| `rpc.*.started`                        | 数値           | Clioサーバが起動後に処理を開始した、このタイプのAPIコールの数。 |
| `rpc.*.finished`                       | 数値           | Clioサーバが起動以降に処理を終了した、このタイプのAPIコールの数。 |
| `rpc.*.errored`                        | 数値           | 起動後に何らかのエラーが発生した、このタイプのAPIコールの数。  |
| `rpc.*.forwarded`                      | 数値           | 起動してからClioサーバが`rippled`P2Pサーバに転送したAPI呼び出しの数。 |
| `rpc.*.duration_us`                    | 数値           | 起動時からこのタイプのAPIコールの処理に費やされたマイクロ秒数の合計。 |
| `subscriptions`                        | オブジェクト    | _(省略される場合があります)_ 各ストリームタイプの現在の接続者数。これは`counters`オブジェクトの中にネストされているので、クライアントが`localhost`経由でClioサーバに接続した場合のみ存在します。 |
| `subscriptions.ledger`                 |               |   |
| `subscriptions.transactions`           |               |   |
| `subscriptions.transactions_proposed`  |               |   |
| `subscriptions.manifests`              |               |   |
| `subscriptions.validations`            |               |   |
| `subscriptions.account`                |               |   |
| `subscriptions.accounts_proposed`      |               |   |
| `subscriptions.books`                  |               |   |
| `time`                                 | 文字列         | サーバの時計によるUTCでの現在時刻。{% badge href="https://github.com/XRPLF/clio/releases/tag/2.0.0" %}新規: Clio v2.0{% /badge %} |
| `uptime`                               | 数値           | サーバが連続して稼働している秒数。{% badge href="https://github.com/XRPLF/clio/releases/tag/2.0.0" %}新規: Clio v2.0{% /badge %} |
| `amendment_blocked`                    | 真偽値         | _(省略される場合があります)_ Clioサーバが[Amendmentブロック](../../../../concepts/networks-and-servers/amendments.md#amendment-blocked-clio-servers)がされているかどうか。{% badge href="https://github.com/XRPLF/clio/releases/tag/2.0.0" %}新規: Clio v2.0{% /badge %} |
| `load_factor`                          | 数値           | サーバが現在実行中の、負荷スケーリングされたオープンレジャートランザクションコストを、基本トランザクションコストに適用される乗数として示したもの。例えば、負荷係数`1000`でリファレンストランザクションコストが10 dropである場合、負荷スケーリングされたトランザクションコストは10,000 drop（0.01 XRP）です。負荷係数は、[個々のサーバの負荷係数](../../../../concepts/transactions/transaction-cost.md#ローカル負荷コスト)の最高値、クラスターの負荷係数、[オープンレジャーコスト](../../../../concepts/transactions/transaction-cost.md#オープンレジャーコスト)、ネットワーク全体の負荷係数によって決まります。 |
| `clio_version`                         | 文字列         | 実行中のClioサーバのバージョン番号。 |
| `libxrpl_version`                      | 文字列         | このClioサーバがビルドされた`libxrpl`ライブラリのバージョン番号。{% badge href="https://github.com/XRPLF/clio/releases/tag/2.0.0" %}新規: Clio v2.0{% /badge %} |
| `validation_quorum`                    | 数値           | _(省略される場合があります)_ レジャーバージョンを検証するために必要な、信頼できる検証の最小数。状況によっては、サーバがより多くの検証をリクエストすることもあります。この値は`rippled`から取得します。何らかの理由でClioサーバが`rippled`に接続できない場合、このフィールドはレスポンスから省略されることがあります。 |
| `rippled_version`                      | 文字列         | _(省略される場合があります)_ Clioサーバが接続している`rippled`サーバのバージョン番号。何らかの理由でClioサーバが`rippled`に接続できない場合、このフィールドはレスポンスから省略されることがあります。 |
| `network_id`                           | 文字列         | _(省略される場合があります)_ このClioサーバが接続している`rippled`が動作しているネットワークのネットワークID。何らかの理由でClioサーバが`rippled`に接続できない場合、このフィールドはレスポンスから省略されることがあります。{% badge href="https://github.com/XRPLF/clio/releases/tag/2.0.0" %}新規: Clio v2.0{% /badge %} |
| `validated_ledger`                     | オブジェクト    | _(省略される場合があります)_ 完全に検証された最新のレジャーに関する情報。検証済みの最新のレジャーがない場合、レスポンスではこのフィールドは省略され、代わりに`closed_ledger`が含まれます。 |
| `validated_ledger`                     | オブジェクト    | （省略される場合があります）完全に検証された最新のレジャーについての情報。最新の検証済みレジャーが使用できない場合、このフィールドはレスポンスにて省略され、代わりに`closed_ledger`が含まれます。 |
| `validated_ledger.age`                 | 数値           | レジャーの閉鎖以降の秒数。 |
| `validated_ledger.base_fee_xrp`        | 数値           | XRP単位の基本手数料。0.00005の場合は、`1e-05`などの科学的記数法で表すことができます。 |
| `validated_ledger.hash`                | 文字列         | 16進数で表された、レジャーの一意のハッシュ |
| `validated_ledger.reserve_base_xrp`    | 数値           | すべてのアカウントで準備金として保有しておく必要があるXRPの最少額（drop数ではありません） |
| `validated_ledger.reserve_inc_xrp`     | 数値           | アカウントがレジャー内に保有するオブジェクトごとのアカウント準備金に追加するXRP額（drop数ではありません） |
| `validated_ledger.seq`                 | 数値           | 最新の検証済みレジャーのレジャーインデックス |
| `validation_quorum`                    | 数値           | レジャーバージョンの検証に、最低限必要となる信頼できる検証の数。場合によっては、サーバがさらに検証をリクエストする場合があります。 |
| `validator_list_expires`               | 文字列         |  _（管理者のみ）_ 現在のバリデータリストの有効期限が切れるタイミングを人間が読み取れる時間でを表示、または、サーバが発行済みのバリデータリストをロードしていない場合は文字列`unknown`、サーバが静的なバリデータリストを使用する場合は文字列`never`のいずれかを表示します。 |
| `cache`                                | オブジェクト    | Clioの状態データのキャッシュに関する情報。 |
| `cache.size`                           | 数値           | 現在キャッシュ内にある状態データオブジェクトの数。 |
| `cache.is_full`                        | 真偽値         | キャッシュに特定のレジャーのすべての状態データが含まれている場合はtrue、そうでない場合はfalse。[book_offersメソッド][] などの一部の API 呼び出しは、キャッシュが完全な場合、より高速に処理されます。 |
| `cache.latest_ledger_seq`              | 数値           | キャッシュに保存されている、検証済みの最新のレジャーの[レジャーインデックス][]。 |
| `etl`                                  | オブジェクト    | Clioサーバが接続している`rippled`ソース(ETLソース)。クライアントが`localhost`経由で Clioサーバに接続した場合のみ表示されます。 |
| `etl.etl_sources`                      | オブジェクト配列 | Clioサーバが接続され、データを抽出する`rippled`ソース(ETLソース)を表示します。 |
| `etl.etl_sources.validated_range`      | 文字列         | P2Pの`rippled`サーバから取得した有効なレジャーの範囲。 |
| `etl.etl_sources.is_connected`         | 真偽値         | ClioがWebSocket経由でこのソースに接続されていればTrue、そうでなければFalse。ここでfalseが指定された場合は、ネットワークの問題や `rippled`が実行されていないことなどが考えられます。 |
| `etl.etl_sources.ip`                   | 数値           | `rippled`サーバのIP。 |
| `etl.etl_sources.ws_port`              | 数値           | `rippled`サーバのWebSocketポート。 |
| `etl.etl_sources.grpc_port`            | 数値           | Clioサーバが接続しているP2P`rippled`サーバのgRPC接続ポート。 |
| `etl.etl_sources.last_msg_age_seconds` | 数値           | Clioが最後に`rippled`から何かを取得してからの経過秒数の合計。これは8より大きくなってはいけません。 |
| `etl.is_writer`                        | 真偽値         | このClioサーバが現在データベースにデータを書き込んでいる場合はtrue、そうでない場合はfalse。|
| `etl.read_only`                        | 真偽値         | このClioサーバが読み込み専用モードで設定されている場合はtrue、そうでない場合はfalse。 |
| `etl.last_publish_age_seconds`         | 数値           | このClioサーバが最後にレジャーを公開してからの経過時間(秒)。これは8以上であってはなりません。 |
| `validated`                            | 真偽値         | Trueの場合、レスポンスがコンセンサスによって検証されたレジャーバージョンを使用していることを示します。Clioでは、検証済みのレジャーデータを保存して返すため、これは常にtrueです。リクエストが`rippled`に転送され、サーバが現在のデータを返した場合、値がないかfalseの場合は、このレジャーのデータが確定でないことを示します。 |
| `status`                               | 文字列         | APIリクエストのステータスを返します。リクエストが正常に完了した場合は`success`を返します。 |


## 考えられるエラー

* いずれかの[汎用エラータイプ][]。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
