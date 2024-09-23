---
html: health-check.html
parent: peer-port-methods.html
seo:
    description: サーバの状態を報告するための特別なAPIメソッドです。
labels:
  - コアサーバ
---
# ヘルスチェック
[[ソース]](https://github.com/XRPLF/rippled/blob/de0c52738785de8bf837f9124da65c7905e7bb5a/src/ripple/overlay/impl/OverlayImpl.cpp#L1084-L1168 "ソース")

ヘルスチェックは、個々の`rippled`サーバの状態を報告するための特別な[peer portメソッド](index.md)です。このメソッドは、自動化された監視において、機能停止を認識し、サーバの再起動のような自動または手動による介入を促すために使用することを意図しています。{% badge href="https://github.com/XRPLF/rippled/releases/tag/1.6.0" %}新規: rippled 1.6.0{% /badge %}

このメソッドは、複数の情報をチェックして、一般に正常とみなされる範囲にあるかどうかを確認します。すべての情報が正常な範囲にある場合、このメソッドは、サーバが正常であることを報告します。いずれかの情報が正常な範囲外の場合、このメソッドは、サーバが正常でないことを報告し、正常でない情報を報告します。

情報によっては、急速に正常範囲から外れる情報もあるため、ヘルスチェックが複数回連続して失敗しない限り、アラートを発生させないようにしてください。

**注記:** ヘルスチェックは[peer portメソッド](index.md)であるため、[スタンドアロンモード][]でサーバをテストしているときは利用できません。


## リクエストのフォーマット

ヘルスチェック情報をリクエストするには、以下のHTTPリクエストを行ってください。

- **プロトコル:** https
- **HTTPメソッド:** GET
- **ホスト:** (任意の`rippled`サーバ(ホスト名またはIPアドレスによる))
- **ポート:** (`rippled`サーバがピアプロトコルを使用するポート番号、通常は51235です。)
- **パス:** `/health`
- **セキュリティ:** ほとんどの`rippled`サーバはリクエストにレスポンスするために自己署名証明書を使います。デフォルトでは、(Webブラウザを含む)ほとんどのツールは、そのようなレスポンスは信頼できないとしてフラグを立てたりブロックしたりします。これらのサーバからのレスポンスを表示するには、証明書のチェックを無視しなければなりません (たとえば、cURLを使用している場合は`--insecure`フラグを追加します)。

<!-- TODO: link a tutorial for how to run rippled with a non-self-signed TLS cert -->

## レスポンスの例

{% tabs %}

{% tab label="Healthy" %}
```json
HTTP/1.1 200 OK
Server: rippled-1.6.0-b8
Content-Type: application/json
Connection: close
Transfer-Encoding: chunked

{
  "info": {}
}
```
{% /tab %}

{% tab label="Warning" %}
```json
HTTP/1.1 503 Service Unavailable
Server: rippled-1.6.0
Content-Type: application/json
Connection: close
Transfer-Encoding: chunked

{
  "info": {
    "server_state": "connected",
    "validated_ledger": -1
  }
}
```
{% /tab %}

{% tab label="Critical" %}
```json
HTTP/1.1 500 Internal Server Error
Server: rippled-1.6.0
Content-Type: application/json
Connection: close
Transfer-Encoding: chunked

{
  "info": {
    "peers": 0,
    "server_state": "disconnected",
    "validated_ledger":-1
  }
}
```
{% /tab %}

{% /tabs %}

## レスポンスのフォーマット

レスポンスのHTTPステータスコードは、サーバの状態を示します。

| ステータスコード                 | 現在の状態     | 説明                          |
|:------------------------------|:--------------|:-----------------------------|
| **200 OK**                    | Healthy       | すべての指標は許容範囲内です。 |
| **503 Service Unavailable**   | Warning       | 1つ以上の指標が警告範囲にあります。手動介入が必要な場合と不要な場合があります。 |
| **500 Internal Server Error** | Critical      | 1つ以上のメトリクスが深刻な範囲にあります。おそらく手動による修正が必要な深刻な問題があります。 |

レスポンスボディは JSON オブジェクトで、トップレベルに `info`オブジェクトが 1 つあります。`info`オブジェクトには、warningまたはcriticalの範囲にある指標ごとの値が含まれます。正常な範囲にある指標は省略されるため、完全に正常なサーバは空のオブジェクトを持ちます。

`info`オブジェクトは以下のフィールドを含むことができます。

| `Field`             | 値    | 説明                                          |
|:--------------------|:------|:---------------------------------------------|
| `amendment_blocked` | 真偽値 | _(省略される場合があります)_ `true`の場合、サーバは[amendmentブロック](../../../concepts/networks-and-servers/amendments.md#amendment-blocked-servers)状態で、ネットワークとの同期を維持するためにアップグレードする必要があります。この状態は非常に重要です。サーバがAmendmentブロックされていない場合、このフィールドは省略されます。 |
| `load_factor`       | 数値   | _(省略される場合があります)_ サーバが受けている全体的な負荷の指標。I/O、CPU、メモリの制限が反映されます。負荷率が100以上の場合はwarning、1000以上の場合はcriticalです。 |
| `peers`             | 数値   | _(省略される場合があります)_ このサーバが接続している[ピアサーバ](../../../concepts/networks-and-servers/peer-protocol.md)の数。7つ以下のピアに接続されている場合はwarning、0つのピアに接続されている場合はcriticalです。 |
| `server_state`      | 文字列 | _(省略される場合があります)_ 現在の[サーバの状態](../api-conventions/rippled-server-states.md)。サーバの状態が`tracking`、`syncing`、`connected`の場合はwarningです。サーバが`disconnected`状態の場合はcriticalです。 |
| `validated_ledger`  | 数値   | _(省略される場合があります)_ レジャーが最後に[コンセンサス](../../../concepts/consensus-protocol/index.md)によって検証されてから何秒経ったかを表します。検証されたレジャーがない場合([サーバ起動時の初期同期期間](../../../infrastructure/troubleshooting/server-doesnt-sync.md#normal-syncing-behavior))、この値は`-1`となり、warningとみなされます。また、最後に検証されたレジャーが少なくとも7秒前であればwarningとなり、最後に検証されたレジャーが少なくとも20秒前であればcriticalとなります。 |

## 関連項目

ヘルスチェックの結果を判断するガイダンスについては、[ヘルスチェックの導入](../../../infrastructure/troubleshooting/health-check-interventions.md)をご覧ください。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
