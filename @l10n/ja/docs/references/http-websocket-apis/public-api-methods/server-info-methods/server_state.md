---
html: server_state.html
parent: server-info-methods.html
seo:
    description: サーバの現在の状態に関するさまざまなマシンが読み取り可能な情報を問い合わせます。
labels:
  - コアサーバ
---
# server_state

{% source-link path="src/xrpld/rpc/handlers/server_info/ServerState.cpp" /%}

`server_state`コマンドは、サーバに対し`xrpld`サーバの現在の状態に関するさまざまな機械可読の情報を問い合わせます。レスポンスは[server_infoメソッド][]の場合とほぼ同じですが、読み取りやすい単位ではなく処理しやすい単位を使用します。（たとえば、XRP値は科学的記数法や10進数値の代わりに整数のdrop数で示され、時刻は秒単位ではなくミリ秒単位で示されます。）

[Clioサーバ](../../../../concepts/networks-and-servers/the-clio-server.md)は`server_state`を直接サポートしていませんが、Clioが接続している`xrpld`サーバの`server_state`を問い合わせることはできます。その場合は、`"ledger_index": "current"`（WebSocket）または`"params": [{"ledger_index": "current"}]`（JSON-RPC）を指定してください。

## リクエストのフォーマット
リクエストのフォーマットの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 2,
  "command": "server_state",
  "ledger_index": "current"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
  "method": "server_state",
  "params": [
    {"ledger_index": "current"}
  ]
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
#Syntax: server_state
xrpld server_state
```
{% /tab %}

{% /tabs %}

{% try-it method="server_state" server="xrplcluster" /%}

リクエストはパラメーターをとりません。

## レスポンスのフォーマット

処理が成功したレスポンスの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 1,
  "result": {
    "state": {
      "build_version": "1.7.2",
      "complete_ledgers": "64572720-65887201",
      "io_latency_ms": 1,
      "jq_trans_overflow": "0",
      "last_close": {
        "converge_time": 3005,
        "proposers": 41
      },
      "load_base": 256,
      "load_factor": 256,
      "load_factor_fee_escalation": 256,
      "load_factor_fee_queue": 256,
      "load_factor_fee_reference": 256,
      "load_factor_server": 256,
      "peer_disconnects": "365006",
      "peer_disconnects_resources": "336",
      "peers": 216,
      "pubkey_node": "n9MozjnGB3tpULewtTsVtuudg5JqYFyV3QFdAtVLzJaxHcBaxuXD",
      "server_state": "full",
      "server_state_duration_us": "3588969453592",
      "state_accounting": {
        "connected": {
          "duration_us": "301410595",
          "transitions": "2"
        },
        "disconnected": {
          "duration_us": "1207534",
          "transitions": "2"
        },
        "full": {
          "duration_us": "3589171798767",
          "transitions": "2"
        },
        "syncing": {
          "duration_us": "6182323",
          "transitions": "2"
        },
        "tracking": {
          "duration_us": "43",
          "transitions": "2"
        }
      },
      "time": "2021-Aug-24 20:44:43.466048 UTC",
      "uptime": 3589480,
      "validated_ledger": {
        "base_fee": 10,
        "close_time": 683153081,
        "hash": "B52AC3876412A152FE9C0442801E685D148D05448D0238587DBA256330A98FD3",
        "reserve_base": 20000000,
        "reserve_inc": 5000000,
        "seq": 65887201
      },
      "validation_quorum": 33
    }
  },
  "status": "success",
  "type": "response"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
200 OK

Headers

{
  "result": {
    "state": {
      "build_version": "1.7.2",
      "complete_ledgers": "65844785-65887184",
      "io_latency_ms": 3,
      "jq_trans_overflow": "580",
      "last_close": {
        "converge_time": 3012,
        "proposers": 41
      },
      "load_base": 256,
      "load_factor": 134022,
      "load_factor_fee_escalation": 134022,
      "load_factor_fee_queue": 256,
      "load_factor_fee_reference": 256,
      "load_factor_server": 256,
      "peer_disconnects": "792367",
      "peer_disconnects_resources": "7273",
      "peers": 72,
      "pubkey_node": "n9LNvsFiYfFf8va6pma2PHGJKVLSyZweN1iBAkJQSeHw4GjM8gvN",
      "server_state": "full",
      "server_state_duration_us": "422128665555",
      "state_accounting": {
        "connected": {
          "duration_us": "172799714",
          "transitions": "1"
        },
        "disconnected": {
          "duration_us": "309059",
          "transitions": "1"
        },
        "full": {
          "duration_us": "6020429212246",
          "transitions": "143"
        },
        "syncing": {
          "duration_us": "413813232",
          "transitions": "152"
        },
        "tracking": {
          "duration_us": "266553605",
          "transitions": "152"
        }
      },
      "time": "2021-Aug-24 20:43:43.043406 UTC",
      "uptime": 6021282,
      "validated_ledger": {
        "base_fee": 10,
        "close_time": 683153020,
        "hash": "ABEF3D24015E8B6B7184B4ABCEDC0E0E3AA4F0677FAB91C40B1E500707C1F3E5",
        "reserve_base": 20000000,
        "reserve_inc": 5000000,
        "seq": 65887184
      },
      "validation_quorum": 33
    },
    "status": "success"
  }
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```json
Loading: "/etc/xrpld/xrpld.cfg"
2020-Mar-24 01:30:08.646201720 UTC HTTPClient:NFO Connecting to 127.0.0.1:5005

Headers

{
  "result": {
    "state": {
      "build_version": "1.7.2",
      "complete_ledgers": "65844785-65887184",
      "io_latency_ms": 3,
      "jq_trans_overflow": "580",
      "last_close": {
        "converge_time": 3012,
        "proposers": 41
      },
      "load_base": 256,
      "load_factor": 134022,
      "load_factor_fee_escalation": 134022,
      "load_factor_fee_queue": 256,
      "load_factor_fee_reference": 256,
      "load_factor_server": 256,
      "peer_disconnects": "792367",
      "peer_disconnects_resources": "7273",
      "peers": 72,
      "pubkey_node": "n9LNvsFiYfFf8va6pma2PHGJKVLSyZweN1iBAkJQSeHw4GjM8gvN",
      "server_state": "full",
      "server_state_duration_us": "422128665555",
      "state_accounting": {
        "connected": {
          "duration_us": "172799714",
          "transitions": "1"
        },
        "disconnected": {
          "duration_us": "309059",
          "transitions": "1"
        },
        "full": {
          "duration_us": "6020429212246",
          "transitions": "143"
        },
        "syncing": {
          "duration_us": "413813232",
          "transitions": "152"
        },
        "tracking": {
          "duration_us": "266553605",
          "transitions": "152"
        }
      },
      "time": "2021-Aug-24 20:43:43.043406 UTC",
      "uptime": 6021282,
      "validated_ledger": {
        "base_fee": 10,
        "close_time": 683153020,
        "hash": "ABEF3D24015E8B6B7184B4ABCEDC0E0E3AA4F0677FAB91C40B1E500707C1F3E5",
        "reserve_base": 20000000,
        "reserve_inc": 5000000,
        "seq": 65887184
      },
      "validation_quorum": 33
    },
    "status": "success"
  }
}
```
{% /tab %}

{% /tabs %}

レスポンスは[標準フォーマット][]に従っており、正常に完了した場合は、結果に唯一のフィールドとして`state`オブジェクトが含まれています。

`state`オブジェクトには、以下のフィールドが含まれています。

| `Field`                          | 型         | 説明            |
|:---------------------------------|:-----------|:-----------------------|
| `amendment_blocked`              | 真偽値      | _（省略される場合があります）_`true`の場合、このサーバは[Amendmentブロック](../../../../concepts/networks-and-servers/amendments.md#amendment-blocked)の状態です。サーバがAmendmentブロックではない場合、レスポンスではこのフィールドが省略されます。 |
| `build_version`                  | 文字列      | 実行中の`xrpld`バージョンのバージョン番号。 |
| `complete_ledgers`               | 文字列      | ローカルの`xrpld`がデータベース内に有するレジャーバージョンのシーケンス番号の範囲を示す表現。例えば、「2500-5000,32570-7695432」のように互いに素なシーケンスの場合があります。サーバに完全なレジャーがない場合（例えば、ネットワークとの同期を始めたばかりの場合）、文字列`empty`になります。 |
| `closed_ledger`                  | オブジェクト | （省略される場合があります）コンセンサスによって検証されていない、最新の閉鎖済みレジャーに関する情報で、[サーバレジャーオブジェクト](#サーバレジャーオブジェクト)の形式です。最新の検証済みレジャーが使用可能な場合、レスポンスではこのフィールドは省略され、代わりに`validated_ledger`が含まれます。 |
| `io_latency_ms`                  | 数値        | I/O処理の待機に費やされた時間数（ミリ秒単位）。この数値が極端に低くない場合、`xrpld`サーバでは深刻な負荷の問題が発生している可能性があります。 |
| `jq_trans_overflow`              | 文字列-数値 | Tこのサーバが一度に処理待ちのトランザクションが250回を超えた回数（起動以来）。この数値が大きい場合、サーバがXRP Ledgerネットワークのトランザクション負荷に対応できていない可能性があります。将来を見据えたサーバの詳細な推奨仕様については、[容量の計画](../../../../infrastructure/installation/capacity-planning.md)をご覧ください |
| `last_close`                     | オブジェクト | サーバが最後にレジャーを閉鎖したときの情報。これには、コンセンサスの取得に要した時間や、参加した信頼できるバリデータ（検証者）の数が含まれます。 |
| `last_close.converge_time`       | 数値        | 直近で検証されたレジャーバージョンでコンセンサスに達するまでにかかった時間(ミリ秒)。 |
| `last_close.proposers`           | 数値        | 直近に検証されたレジャーバージョンのコンセンサスプロセスで、サーバが考慮した信頼できるバリデータの数（バリデータとして設定されている場合は自分自身を含む）。 |
| `load`                           | オブジェクト | _（管理者専用）_ サーバの現在の負荷状態についての詳細な情報。 |
| `load.job_types`                 | 配列        | _（管理者専用）_ サーバが実行している各種ジョブのレートや、各ジョブに要する時間についての情報。 |
| `load.threads`                   | 数値        | _（管理者専用）_ サーバの主要なジョブプール内のスレッド数。 |
| `load_base`                      | 数値        | [トランザクションコスト](../../../../concepts/transactions/transaction-cost.md)の計算で使用されるサーバ負荷のベースライン量です。`load_factor`が`load_base`と同等の場合、基本トランザクションコストのみが適用されます。`load_factor`が`load_base`よりも大きい場合、トランザクションコストにそれらの値の比率が乗算されます。たとえば`load_factor`が`load_base`の2倍である場合、トランザクションコストは2倍になります。 |
| `load_factor`                    | 数値           | サーバが現在適用している負荷係数。トランザクションコストの乗数は、この値と`load_base`の比率によって決まります。負荷係数は、個別サーバの最も高い負荷係数、クラスターの負荷係数、[オープンレジャーコスト](../../../../concepts/transactions/transaction-cost.md#オープンレジャーコスト)、およびネットワーク全体の負荷係数によって決定します。 |
| `load_factor_fee_escalation`     | 数値        | （省略される場合があります）オープンレジャーに入るときに[トランザクションコスト][]に適用される現在の乗数（[手数料レベル][]）。 |
| `load_factor_fee_queue`          | 数値        | （省略される場合があります）キューが一杯になっている場合に、キューへ入るときに[トランザクションコスト][]に適用される現在の乗数（[手数料レベル][]）。 |
| `load_factor_fee_reference`      | 数値        | （省略される場合があります）負荷スケーリングのない[トランザクションコスト][]（[手数料レベル][]）。 |
| `load_factor_server`             | 数値        | （省略される場合があります）サーバ、クラスター、ネットワークへの負荷に基づいてサーバが適用している負荷係数。[オープンレジャーコスト](../../../../concepts/transactions/transaction-cost.md#オープンレジャーコスト)は考慮されません。 |
| `network_ledger`                 | 文字列      | （省略される場合があります）[`--net`パラメーターを指定してサーバを起動](../../../../infrastructure/commandline-usage.md)した場合、サーバがネットワークと同期している間、このフィールドには文字列`waiting`が入ります。それ以外の場合、このフィールドは省略されます。 |
| `peers`                          | 数値        | このサーバが現在接続している他の`xrpld`サーバの数。 |
| `ports`                          | 配列        | サーバがAPIコマンドを待ち受けているポートの一覧。配列の各エントリは[ポート記述子オブジェクト](#ポート記述子オブジェクト) となります。 {% badge href="https://github.com/XRPLF/rippled/releases/tag/1.12.0" %}新規: rippled 1.12.0{% /badge %} |
| `pubkey_node`                    | 文字列      | ピアツーピア通信のためにこのサーバを検証する際に使用される公開鍵。サーバを初めて起動すると、サーバにより _ノードキーペア_ が自動的に生成されます。（キーペアが削除されている場合、サーバは新しいキーペアを作成できます。）`[node_seed]`構成オプションを使用して構成ファイルの永続値を設定できます。これは[クラスター化](../../../../concepts/networks-and-servers/clustering.md)で便利です。 |
| `pubkey_validator`               | 文字列      | _（管理者専用）_ このノードがレジャー検証の署名に使用する公開鍵。_検証キーペア_ は、`[validator_token]`構成フィールドまたは`[validation_seed]`構成フィールドから生成されます。 |
| `server_state`                   | 文字列      | サーバのネットワークへの参加度を示す文字列。詳細は、[考えられるサーバの状態](../../api-conventions/xrpld-server-states.md)を参照してください。 |
| `server_state_duration_us`       | 数値        | サーバが現在の状態になってから経過した連続マイクロ秒数。 |
| `state_accounting`               | オブジェクト | 各種[サーバ状態](../../api-conventions/xrpld-server-states.md)のマップと、サーバが各状態に費やした時間についての情報。これは、サーバのネットワーク接続性の健全性を長期的に追跡するのに便利です。このフィールドの内容は[State Accountingオブジェクト](#state-accountingオブジェクト)の形式です。 |
| `time`                           | 文字列      | サーバの時計によるUTCでの現在時刻。 |
| `uptime`                         | 数値        | サーバが連続稼働している秒数。 |
| `validated_ledger`               | オブジェクト | （省略される場合があります）完全に検証された最新のレジャーに関する情報で、[サーバレジャーオブジェクト](#サーバレジャーオブジェクト)の形式です。最新の検証済みレジャーが使用できない場合、このフィールドはレスポンスで省略され、代わりに`closed_ledger`が含まれます。 |
| `validation_quorum`              | 数値        | 1つのレジャーバージョンの検証に最低限必要となる信頼できる検証の数。状況によっては、サーバがさらに検証をリクエストする場合があります。 |
| `validator_list_expires`         | 数値        | _（管理者専用）_ 現在のバリデータリストが期限切れになる時点（[Rippleエポック以降の経過秒数][]）。サーバが発行済みのバリデータリストをロードしていない場合は0。 |

{% partial file="/@l10n/ja/docs/_snippets/port-descriptor-object.md" /%}

{% partial file="/@l10n/ja/docs/_snippets/state-accounting-object.md" /%}

### サーバレジャーオブジェクト

レスポンスには、`validated_ledger`フィールドまたは`closed_ledger`フィールドのいずれかが含まれます。どちらのフィールドにも、次のフィールドを持つオブジェクトが入ります。

| フィールド        | 値                   | 説明 |
|-----------------|---------------------|------|
| `base_fee`      | 数値                 | このレジャーバージョン時点での、トランザクションをネットワークに伝播させるための基本手数料（XRPのdrop数）。 |
| `close_time`    | 数値                 | このレジャーバージョンの公式の閉鎖時刻（[Rippleエポック以降の経過秒数][]）。この値は丸められています。詳細は、[レジャーの閉鎖時刻](../../../../concepts/ledgers/ledger-close-times.md)を参照してください。 |
| `hash`          | 文字列 - [ハッシュ][] | 16進数で表した、このレジャーバージョンの一意のハッシュ。 |
| `reserve_base`  | 数値                 | 最新の検証済みレジャーバージョン時点での、最小の[アカウント準備金](../../../../concepts/accounts/reserves.md)。 |
| `reserve_inc`   | 数値                 | 最新の検証済みレジャーバージョン時点での、アカウントが所有するアイテムごとの[所有者準備金](../../../../concepts/accounts/reserves.md)。 |
| `seq`           | 数値                 | このレジャーバージョンの[レジャーインデックス][]。 |

[server_infoメソッド][]も同様のオブジェクトを返しますが、フォーマットが少し異なります（たとえば、XRPのdrop数ではなく10進数のXRPを使用します）。

## 考えられるエラー

* [汎用エラータイプ][]のすべて。

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
