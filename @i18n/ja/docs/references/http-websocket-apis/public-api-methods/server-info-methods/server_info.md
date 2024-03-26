---
html: server_info.html
parent: server-info-methods.html
seo:
    description: サーバについての各種情報を、人間が読めるフォーマットでサーバにリクエストします。
labels:
  - コアサーバ
---
# server_info (rippled)
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/ServerInfo.cpp "Source")

`server_info`コマンドは、問い合わせ中の`rippled`サーバについての各種情報を、人間が読めるフォーマットでサーバにリクエストします。[Clioサーバ](../../../../concepts/networks-and-servers/the-clio-server.md)については、[`server_info` (Clio)](../clio-methods/server_info-clio.md)をご覧ください。

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

{% tab label="コマンドライン" %}
```sh
#Syntax: server_info
rippled server_info
```
{% /tab %}

{% /tabs %}

[試してみる>](/resources/dev-tools/websocket-api-tool#server_info)

リクエストにパラメーターは何も含まれません。

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
{% code-snippet file="/_api-examples/server_info/jsonrpc-response.json" language="json" prefix="Loading: \"/etc/opt/ripple/rippled.cfg\"\n2023-Sep-13 22:19:39.404596100 UTC HTTPClient:NFO Connecting to 127.0.0.1:5005\n\n" /%}
{% /tab %}

{% /tabs %}

レスポンスは[標準フォーマット][]に従い、結果が正常な場合`info`オブジェクトが唯一のフィールドとして含まれます。

`info`オブジェクトは以下のフィールドを含むことがあります。

| `Field`                             | 型         | 説明 |
|:------------------------------------|:-----------|:-----------|
| `amendment_blocked`                 | 真偽値      | _（省略される場合があります）_`true`の場合、このサーバは[Amendmentブロック](../../../../concepts/networks-and-servers/amendments.md#amendment-blocked)の状態です。サーバがAmendmentブロックの状態でない場合、このフィールドはレスポンスから省略されます。 |
| `build_version`                     | 文字列      | 実行中の`rippled`のバージョン番号。 |
| `closed_ledger`                     | オブジェクト | （省略される場合があります）コンセンサスによってまだ検証されていない、最も最近更新を閉鎖したレジャーについての情報。最新の検証済みレジャーが使用可能な場合、このフィールドはレスポンスで省略され、代わりに`validated_ledger`が含まれます。メンバーフィールドは`validated_ledger`フィールドと同じです。 |
| `complete_ledgers`                  | 文字列      | ローカル`rippled`がデータベース内に有するレジャーのバージョンのシーケンス番号の範囲を示す表現。例えば、`24900901-24900984,24901116-24901158`のように、互いに素なシーケンスの場合があります。サーバに完全なレジャーがない場合（例えば、ネットワークとの同期を始めたばかりの場合）、文字列`empty`になります。 |
| `hostid`                            | 文字列      | adminリクエストの場合、`rippled`インスタンスを実行するサーバのホスト名が返されます。それ以外のリクエストの場合、一意の4文字の単語が返されます。 |
| `io_latency_ms`                     | 数値        | I/O処理の待ち時間（ミリ秒単位）。この数値がそれほど低くない場合、`rippled`サーバは深刻な負荷の問題を抱えている可能性があります。 |
| `jq_trans_overflow`                 | 文字列-数値  | このサーバが一度に処理待ちのトランザクションが250回を超えた回数（起動以来）。この数値が大きい場合、サーバがXRP Ledgerネットワークのトランザクション負荷に対応できていない可能性があります。将来を見据えたサーバの詳細な推奨仕様については、[容量の計画](../../../../infrastructure/installation/capacity-planning.md)をご覧ください。 |
| `last_close`                        | オブジェクト | サーバが最後にレジャーを閉鎖したときの情報。これには、コンセンサスの取得に要した時間や、参加した信頼できるバリデータ（検証者）の数が含まれます。 |
| `last_close.converge_time_s`        | 数値        | 直近で検証されたレジャーバージョンでコンセンサスに達するまでにかかった時間(秒)。 |
| `last_close.proposers`              | 数値        | 直近に検証されたレジャーバージョンのコンセンサスプロセスで、サーバが考慮した信頼できるバリデータの数（バリデータとして設定されている場合は自分自身を含む）。 |
| `load`                              | オブジェクト |  _（管理者のみ）_ サーバの現在の負荷状態についての詳細な情報。 |
| `load.job_types`                    | 配列        |  _（管理者のみ）_ サーバが実行している各種ジョブのレートや、各ジョブにかかる時間についての情報。 |
| `load.threads`                      | 数値        |  _（管理者のみ）_ サーバの主要なジョブプール内のスレッドの数。 |
| `load_factor`                       | 数値        | サーバが現在実行中の、負荷スケーリングされたオープンレジャートランザクションコストを、基本トランザクションコストに適用される乗数として示したもの。例えば、負荷係数`1000`でリファレンストランザクションコストが10 dropである場合、負荷スケーリングされたトランザクションコストは10,000 drop（0.01 XRP）です。負荷係数は、[個々のサーバの負荷係数](../../../../concepts/transactions/transaction-cost.md#ローカル負荷コスト)の最高値、クラスターの負荷係数、[オープンレジャーコスト](../../../../concepts/transactions/transaction-cost.md#オープンレジャーコスト)、ネットワーク全体の負荷係数によって決まります。 |
| `load_factor_local`                 | 数値        | （省略される場合があります）このサーバに対する負荷に基づく、[トランザクションコスト][]に適用される現在の乗数。 |
| `load_factor_net`                   | 数値        | （省略される場合があります）ネットワークのその他の部分で使用されている、[トランザクションコスト][]に適用される現在の乗数（他のサーバから報告された負荷値から推定します）。 |
| `load_factor_cluster`               | 数値        | （省略される場合があります）[このクラスター](../../../../concepts/networks-and-servers/clustering.md)内のサーバに対する負荷に基づく、[トランザクションコスト][]に適用される現在の乗数。 |
| `load_factor_fee_escalation`        | 数値        | （省略される場合があります）オープンレジャーに入るために取引が支払う必要がある[トランザクションコスト][]に適用される現在の乗数。 |
| `load_factor_fee_queue`             | 数値        | （省略される場合があります）キューが一杯になっている場合に、キューに入るために取引が支払う必要がある[トランザクションコスト][]に適用される現在の乗数。 |
| `load_factor_server`                | 数値        | （省略される場合があります）サーバが実施中の負荷係数。[オープンレジャーコスト](../../../../concepts/transactions/transaction-cost.md#オープンレジャーコスト)は含まれません。 |
| `peers`                             | 数値        | このサーバが現在接続している、他の`rippled`サーバの数。 |
| `ports`                             | 配列        | サーバがAPIコマンドを待ち受けているポートの一覧。配列の各エントリは[ポート記述子オブジェクト](#ポート記述子オブジェクト) となります。 {% badge href="https://github.com/XRPLF/rippled/releases/tag/1.12.0" %}新規: rippled 1.12.0{% /badge %} |
| `pubkey_node`                       | 文字列      | ピアツーピア通信の中でこのサーバを検証するために使用する公開鍵。この _ノードのキーペア_ は、サーバを初めて起動すると自動的に生成されます。（削除された場合、サーバは新たなキーペアを作成できます。）構成ファイルにて`[node_seed]`設定オプションを使用すると、永続値を設定できます。これは[クラスター化](../../../../concepts/networks-and-servers/clustering.md)に便利です。 |
| `pubkey_validator`                  | 文字列      |  _（管理者のみ）_ このノードがレジャーの検証の署名に使用する公開鍵。この _検証キーペア_ は、`[validator_token]`または`[validation_seed]`設定フィールドにて生成されます。 |
| `reporting`                         | オブジェクト | _([レポートモード](../../../../concepts/networks-and-servers/rippled-server-modes.md)サーバのみ)_ このサーバのレポートモード固有の設定に関する情報。 |
| `reporting.etl_sources`             | 配列        | _([レポートモード](../../../../concepts/networks-and-servers/rippled-server-modes.md)サーバのみ)_ このレポートモードがデータを取得するP2Pモードサーバのリスト。この配列の各エントリは[ETLソースオブジェクト](#etlソースオブジェクト)です。 |
| `reporting.is_writer`               | 真偽値      | _([レポートモード](../../../../concepts/networks-and-servers/rippled-server-modes.md)サーバのみ)_  `true`の場合、このサーバは外部データベースにレジャーデータを書き込んでいます。`false`の場合、他のレポートモードサーバが共有データベースにデータを書き込んでいるか、読み取り専用に設定されているため、現在は書き込んでいません。 |
| `reporting.last_publish_time`       | 文字列      | _([レポートモード](../../../../concepts/networks-and-servers/rippled-server-modes.md)サーバのみ)_このサーバが最後に有効なレジャーを[サブスクリプションストリーム](../subscription-methods/subscribe.md)に公開した日時を示すISO 8601タイムスタンプ。 |
| `server_state`                      | 文字列      | サーバのネットワークへの参加の度合いを示す文字列。詳細は、[考えられるサーバの状態](../../api-conventions/rippled-server-states.md)をご覧ください。 |
| `server_state_duration_us`          | 数値        | サーバが現在の状態になってから経過したマイクロ秒数。 |
| `state_accounting`                  | オブジェクト | 各種[サーバ状態](../../api-conventions/rippled-server-states.md)のマップと、サーバが各状態に費やした時間についての情報。これは、サーバのネットワーク接続について長期的な健全性を追跡するのに便利です。 |
| `state_accounting.*.duration_us`    | 文字列      | サーバがこの状態になってから費やしたマイクロ秒数。（サーバが別の状態に移行するたびに更新されます。） |
| `state_accounting.*.transitions`    | 文字列      | サーバがこの状態に移行した回数。 |
| `time`                              | 文字列      | サーバの時計によるUTCでの現在時刻。 |
| `uptime`                            | 数値        | サーバが連続して稼働している秒数。 |
| `validated_ledger`                  | オブジェクト | （省略される場合があります）完全に検証された最新のレジャーについての情報。最新の検証済みレジャーが使用できない場合、このフィールドはレスポンスにて省略され、代わりに`closed_ledger`が含まれます。 |
| `validated_ledger.age`              | 数値        | レジャーの閉鎖以降の秒数。 |
| `validated_ledger.base_fee_xrp`     | 数値        | XRP単位の基本手数料。0.00005の場合は、`1e-05`などの科学的記数法で表すことができます。 |
| `validated_ledger.hash`             | 文字列      | 16進数で表された、レジャーの一意のハッシュ |
| `validated_ledger.reserve_base_xrp` | 符号なし整数 | すべてのアカウントで準備金として保有しておく必要があるXRPの最少額（drop数ではありません） |
| `validated_ledger.reserve_inc_xrp`  | 符号なし整数 | アカウントがレジャー内に保有するオブジェクトごとのアカウント準備金に追加するXRP額（drop数ではありません） |
| `validated_ledger.seq`              | 数値        | 最新の検証済みレジャーのレジャーインデックス |
| `validation_quorum`                 | 数値        | レジャーバージョンの検証に、最低限必要となる信頼できる検証の数。場合によっては、サーバがさらに検証をリクエストする場合があります。 |
| `validator_list_expires`            | 文字列      |  _（管理者のみ）_ 現在のバリデータリストの有効期限が切れるタイミングを人間が読み取れる時間でを表示、または、サーバが発行済みのバリデータリストをロードしていない場合は文字列`unknown`、サーバが静的なバリデータリストを使用する場合は文字列`never`のいずれかを表示します。 |

**注記:** `closed_ledger`フィールドがあり、`seq`の値が小さい（8桁未満）場合、`rippled`には現在、ピアツーピアネットワークから取得した検証済みレジャーのコピーがないことを表しています。これは、サーバが現在も同期中である可能性を示しています。接続速度とハードウェア仕様にもよりますが、通常はネットワークとの同期に約5分かかります。

{% partial file="/@i18n/ja/docs/_snippets/etl-source-object.md" /%}

{% partial file="/@i18n/ja/docs/_snippets/port-descriptor-object.md" /%}

## 考えられるエラー

* いずれかの[汎用エラータイプ][]。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
