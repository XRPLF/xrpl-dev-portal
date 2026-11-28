---
html: server_info.html
parent: server-info-methods.html
seo:
    description: サーバについての各種情報を、人間が読めるフォーマットでサーバにリクエストします。
labels:
  - コアサーバ
---
# server_info (xrpld)
{% source-link path="src/xrpld/rpc/handlers/server_info/ServerInfo.cpp" /%}

`server_info`コマンドは、問い合わせ先の[`xrpld`サーバ](../../../../concepts/networks-and-servers/index.md)に関する各種情報を、人間が読めるフォーマットでサーバにリクエストします。[Clioサーバ](../../../../concepts/networks-and-servers/the-clio-server.md)については、代わりに[`server_info` (Clio)](../clio-methods/server_info-clio.md)を参照してください。

## リクエストのフォーマット
リクエストのフォーマットの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 1,
  "command": "server_info",
  "counters": false
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "server_info",
    "params": [
        {"counters" : false}
    ]
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
#Syntax: server_info [counters]
# countersは省略可能な真偽値で、パフォーマンスの指標を表示するために使用します
xrpld server_info
```
{% /tab %}

{% /tabs %}

{% try-it method="server_info" server="xrplcluster" /%}

リクエストには以下のパラメーターが含まれます。

| フィールド              | 型     | 必須？ | 説明 |
|:----------------------|:-------|:------|------|
| `counters`            | 真偽値  | いいえ | `true`の場合、ジョブキュー、レジャーストア、APIメソッドの動作に関する指標を返します。デフォルトは`false`です。 |

## レスポンスのフォーマット

処理が成功したレスポンスの例:

{% tabs %}

{% tab label="WebSocket" %}
{% code-snippet file="/_api-examples/server_info/ws-response.json" language="json" /%}
{% /tab %}

{% tab label="JSON-RPC" %}
{% code-snippet file="/_api-examples/server_info/jsonrpc-response.json" language="json" prefix="200 OK\n\n" /%}
{% /tab %}

{% tab label="コマンドライン" %}
{% code-snippet file="/_api-examples/server_info/jsonrpc-response.json" language="json" prefix="Loading: \"/etc/xrpld/xrpld.cfg\"\n2023-Sep-13 22:19:39.404596100 UTC HTTPClient:NFO Connecting to 127.0.0.1:5005\n\n" /%}
{% /tab %}

{% /tabs %}

レスポンスは[標準フォーマット][]に従い、結果が正常な場合`info`オブジェクトが唯一のフィールドとして含まれます。

`info`オブジェクトは以下のフィールドを含むことがあります。

| `Field`                             | 型         | 説明 |
|:------------------------------------|:-----------|:-----------|
| `amendment_blocked`                 | 真偽値      | _（省略される場合があります）_`true`の場合、このサーバは[Amendmentブロック](../../../../concepts/networks-and-servers/amendments.md#amendment-blocked)の状態です。サーバがAmendmentブロックの状態でない場合、このフィールドはレスポンスから省略されます。 |
| `build_version`                     | 文字列      | 実行中の`xrpld`のバージョン番号。 |
| `closed_ledger`                     | オブジェクト | （省略される場合があります）コンセンサスによってまだ検証されていない、直近に閉鎖されたレジャーに関する情報で、[サーバレジャーオブジェクト](#サーバレジャーオブジェクト)の形式です。最新の検証済みレジャーが使用可能な場合、このフィールドはレスポンスから省略され、代わりに`validated_ledger`が含まれます。 |
| `complete_ledgers`                  | 文字列      | ローカル`xrpld`がデータベース内に有するレジャーのバージョンのシーケンス番号の範囲を示す表現。例えば、`24900901-24900984,24901116-24901158`のように、互いに素なシーケンスの場合があります。サーバに完全なレジャーがない場合（例えば、ネットワークとの同期を始めたばかりの場合）、文字列`empty`になります。 |
| `git`                               | オブジェクト | _（管理者のみ）_ `xrpld`のビルドのGitの詳細。 |
| `git.branch`                        | 文字列      | _（管理者のみ）_ 使用している`xrpld`のバージョンのビルドに使われたGitブランチ。 |
| `git.hash`                          | 文字列      | _（管理者のみ）_ 使用している`xrpld`のバージョンのビルドに使われたコミットのGitハッシュ。 |
| `hostid`                            | 文字列      | adminリクエストの場合、`xrpld`インスタンスを実行しているサーバのホスト名を返します。それ以外の場合は、[ノード公開鍵](../../../../concepts/networks-and-servers/peer-protocol.md#ノードキーペア)に基づく[RFC-1751][]の単語を1つ返します。 |
| `io_latency_ms`                     | 数値        | I/O処理の待ち時間（ミリ秒単位）。この数値がそれほど低くない場合、`xrpld`サーバは深刻な負荷の問題を抱えている可能性があります。 |
| `jq_trans_overflow`                 | 文字列-数値  | このサーバが一度に処理待ちのトランザクションが250回を超えた回数（起動以来）。この数値が大きい場合、サーバがXRP Ledgerネットワークのトランザクション負荷に対応できていない可能性があります。将来を見据えたサーバの詳細な推奨仕様については、[容量の計画](../../../../infrastructure/installation/capacity-planning.md)をご覧ください。 |
| `last_close`                        | オブジェクト | サーバが最後にレジャーを閉鎖したときの情報。これには、コンセンサスの取得に要した時間や、参加した信頼できるバリデータ（検証者）の数が含まれます。 |
| `last_close.converge_time_s`        | 数値        | 直近で検証されたレジャーバージョンでコンセンサスに達するまでにかかった時間(秒)。 |
| `last_close.proposers`              | 数値        | 直近に検証されたレジャーバージョンのコンセンサスプロセスで、サーバが考慮した信頼できるバリデータの数（バリデータとして設定されている場合は自分自身を含む）。 |
| `load`                              | オブジェクト |  _（管理者のみ）_ サーバの現在の負荷状態についての詳細な情報。 |
| `load.job_types`                    | 配列        |  _（管理者のみ）_ サーバが実行している各種ジョブのレートや、各ジョブにかかる時間についての情報。 |
| `load.threads`                      | 数値        |  _（管理者のみ）_ サーバの主要なジョブプール内のスレッドの数。 |
| `load_factor`                       | 数値        | サーバが現在適用している[トランザクションコスト][]の乗数。例えば、負荷係数が`1000`でリファレンストランザクションコストが10 dropの場合、負荷スケーリングされたトランザクションコストは10,000 drop（0.01 XRP）です。負荷係数は、[個々のサーバの負荷係数](../../../../concepts/transactions/transaction-cost.md#ローカル負荷コスト)、クラスターの負荷係数、[オープンレジャーコスト](../../../../concepts/transactions/transaction-cost.md#オープンレジャーコスト)、ネットワーク全体の負荷係数のうち、最も高いものによって決まります。 |
| `load_factor_local`                 | 数値        | （省略される場合があります）このサーバに対する負荷に基づく、[トランザクションコスト][]に適用される現在の乗数。 |
| `load_factor_net`                   | 数値        | （省略される場合があります）ネットワークのその他の部分で使用されている、[トランザクションコスト][]に適用される現在の乗数（他のサーバから報告された負荷値から推定します）。 |
| `load_factor_cluster`               | 数値        | （省略される場合があります）[このクラスター](../../../../concepts/networks-and-servers/clustering.md)内のサーバに対する負荷に基づく、[トランザクションコスト][]に適用される現在の乗数。 |
| `load_factor_fee_escalation`        | 数値        | （省略される場合があります）オープンレジャーに入るために取引が支払う必要がある[トランザクションコスト][]に適用される現在の乗数。 |
| `load_factor_fee_queue`             | 数値        | （省略される場合があります）キューが一杯になっている場合に、キューに入るために取引が支払う必要がある[トランザクションコスト][]に適用される現在の乗数。 |
| `load_factor_server`                | 数値        | （省略される場合があります）サーバ、クラスター、ネットワークへの負荷に基づく、[トランザクションコスト][]に適用される現在の乗数。[オープンレジャーコスト](../../../../concepts/transactions/transaction-cost.md#オープンレジャーコスト)は考慮されません。 |
| `network_ledger`                    | 文字列      | （省略される場合があります）[`--net`パラメーターを指定してサーバを起動](../../../../infrastructure/commandline-usage.md)した場合、サーバがネットワークと同期している間、このフィールドには文字列`waiting`が入ります。それ以外の場合、このフィールドは省略されます。 |
| `peers`                             | 数値        | このサーバが現在接続している、他の`xrpld`サーバの数。 |
| `ports`                             | 配列        | サーバがAPIコマンドを待ち受けているポートの一覧。配列の各エントリは[ポート記述子オブジェクト](#ポート記述子オブジェクト) となります。 {% badge href="https://github.com/XRPLF/rippled/releases/tag/1.12.0" %}新規: rippled 1.12.0{% /badge %} |
| `pubkey_node`                       | 文字列      | ピアツーピア通信の中でこのサーバを検証するために使用する公開鍵。この[_ノードキーペア_](../../../../concepts/networks-and-servers/peer-protocol.md#ノードキーペア)は、サーバを初めて起動すると自動的に生成されます。（削除された場合、サーバは新たなキーペアを作成できます。）構成ファイルにて`[node_seed]`設定オプションを使用すると、永続値を設定できます。これは[クラスター化](../../../../concepts/networks-and-servers/clustering.md)に便利です。 |
| `pubkey_validator`                  | 文字列      |  _（管理者のみ）_ このノードがレジャーの検証の署名に使用する公開鍵。この _検証キーペア_ は、`[validator_token]`または`[validation_seed]`設定フィールドにて生成されます。 |
| `server_state`                      | 文字列      | サーバのネットワークへの参加の度合いを示す文字列。詳細は、[考えられるサーバの状態](../../api-conventions/xrpld-server-states.md)を参照してください。 |
| `server_state_duration_us`          | 数値        | サーバが現在の状態になってから経過したマイクロ秒数。 |
| `state_accounting`                  | オブジェクト | 各種[サーバ状態](../../api-conventions/xrpld-server-states.md)のマップと、サーバが各状態に費やした時間についての情報。これは、サーバのネットワーク接続について長期的な健全性を追跡するのに便利です。このフィールドの内容は[State Accountingオブジェクト](#state-accountingオブジェクト)の形式です。 |
| `time`                              | 文字列      | サーバの時計によるUTCでの現在時刻。 |
| `uptime`                            | 数値        | サーバが連続して稼働している秒数。 |
| `validated_ledger`                  | オブジェクト | （省略される場合があります）完全に検証された最新のレジャーに関する情報で、[サーバレジャーオブジェクト](#サーバレジャーオブジェクト)の形式です。最新の検証済みレジャーが使用できない場合、このフィールドはレスポンスから省略され、代わりに`closed_ledger`が含まれます。 |
| `validation_quorum`                 | 数値        | レジャーバージョンの検証に、最低限必要となる信頼できる検証の数。場合によっては、サーバがさらに検証をリクエストする場合があります。 |
| `validator_list_expires`            | 文字列      |  _（管理者のみ）_ 現在のバリデータリストの有効期限が切れる日時を人間が読める形式のUTCで表示します。サーバが発行済みのバリデータリストをまだロードしていない場合は文字列`unknown`、サーバが静的なバリデータリストを使用する場合は文字列`never`を表示します。 |
| `counters`                          | オブジェクト | RPC呼び出し（実行中の呼び出しと完了した呼び出し）とJobQueueに関するパフォーマンスの指標を含むオブジェクト。また、`node_writes`、`node_reads_total`、`node_reads_hit`など、ノードストアの詳細も含まれます。 |
| `current_activity`                  | オブジェクト | ジョブキューで現在実行中の項目の一覧。`jobs`と`methods`の2つの配列を含みます。 |

{% partial file="/@l10n/ja/docs/_snippets/port-descriptor-object.md" /%}

{% partial file="/@l10n/ja/docs/_snippets/state-accounting-object.md" /%}

### サーバレジャーオブジェクト

レスポンスには、`validated_ledger`フィールドまたは`closed_ledger`フィールドのいずれかが含まれます。どちらのフィールドにも、次のフィールドを持つオブジェクトが入ります。

| フィールド            | 値                   | 説明 |
|--------------------|---------------------|------|
| `age`              | 数値                 | レジャーが閉鎖されてからの経過時間（秒）。 |
| `base_fee_xrp`     | 数値                 | XRP単位（drop単位ではありません）の基本手数料。0.00001を`1e-05`と表すように、科学的記数法で表される場合があります。 |
| `hash`             | 文字列 - [ハッシュ][] | 16進数で表した、レジャーの一意のハッシュ。 |
| `reserve_base_xrp` | 数値                 | すべてのアカウントが準備金として保有しておく必要があるXRPの最小額（drop単位ではありません）。 |
| `reserve_inc_xrp`  | 数値                 | アカウントがレジャー内に所有するオブジェクトごとに、アカウント準備金に追加されるXRPの額（drop単位ではありません）。 |
| `seq`              | 数値                 | 最新の検証済みレジャーの[レジャーインデックス][]。 |

[server_stateメソッド][]も同様のオブジェクトを返しますが、フォーマットが少し異なります（たとえば、10進数のXRPではなくXRPのdrop数を使用します）。

{% admonition type="info" name="注記" %}`closed_ledger`フィールドがあり、`seq`の値が小さい（8桁未満）場合、`xrpld`には現在、ピアツーピアネットワークから取得した検証済みレジャーのコピーがないことを表しています。これは、サーバが現在も同期中である可能性を示しています。接続速度とハードウェア仕様にもよりますが、ネットワークとの同期には通常最大15分かかります。トラブルシューティングについては、[xrpldサーバが同期しない](../../../../infrastructure/troubleshooting/server-doesnt-sync.md)を参照してください。{% /admonition %}

## 考えられるエラー

* いずれかの[汎用エラータイプ][]。

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
