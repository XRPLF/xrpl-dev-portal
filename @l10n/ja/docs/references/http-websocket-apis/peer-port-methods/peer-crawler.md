---
html: peer-crawler.html
parent: peer-port-methods.html
seo:
    description: ネットワークの情報とステータスの統計を共有するための特別なAPIメソッドです。
labels:
  - コアサーバ
  - ブロックチェーン
---
# ピアクローラ

ピアクローラは、ピアツーピアネットワークの健全性と統計情報を報告するための特別な[peer portメソッド](index.md)です。このAPIメソッドは、デフォルトでは[ピアプロトコル](../../../concepts/networks-and-servers/peer-protocol.md)のポートを通して非rootベースで利用可能で、コンセンサスやレジャーの履歴、その他の必要な情報についての`rippled`サーバのピアツーピア通信にも使用されます。

ピアクローラによって報告された情報は事実上公開され、XRP Ledgerのネットワーク全体やその健全性、統計情報について報告するために使用することができます。

## リクエストのフォーマット

ピアクローラ情報をリクエストするには、以下のHTTPリクエストを送信します。

- **プロトコル:** https
- **HTTPメソッド:** GET
- **ホスト:** (任意の`rippled`サーバ(ホスト名またはIPアドレス))
- **ポート:** (`rippled`サーバがピアプロトコルを使用するポート番号、通常は51235です。)
- **パス:** `/crawl`
- **セキュリティ:** ほとんどの`rippled`サーバはリクエストにレスポンスするために自己署名証明書を使います。デフォルトでは、(ウェブブラウザを含む)ほとんどのツールは、そのようなレスポンスは信頼できないとしてフラグを立てたりブロックしたりします。これらのサーバからのレスポンスを表示するには、証明書のチェックを無視しなければなりません(たとえば、cURLを使用している場合は`--insecure`フラグを追加します)。


## レスポンスのフォーマット

レスポンスにはステータスコード**200 OK**とメッセージ本文にJSONオブジェクトがあります。

JSONオブジェクトは次のフィールドを含んでいます。

| `フィールド`       | 値         | 説明                                              |
|:-----------------|:-----------|:-------------------------------------------------|
| `counts`         | オブジェクト | _(省略可)_ [get_countsメソッド][]のレスポンスと同じように、このサーバの状態に関する統計情報を返します。デフォルトの設定では、このフィールドは報告されません。報告される情報には、レジャーデータベースとトランザクションデータベースのサイズ、アプリケーション内キャッシュのキャッシュヒット率、さまざまな種類のオブジェクトがメモリにキャッシュされている数などがあります。メモリに保存されるオブジェクトの種類には、レジャー(`Ledger`)、トランザクション(`STTx`)、検証メッセージ (`STValidation`)などがあります。 |
| `overlay`        | オブジェクト | _(省略可)_ [peersメソッド][]のレスポンスに似ています。`active`というフィールドがあり、これはオブジェクトの配列です(下記参照)。 |
| `server`         | オブジェクト | _(省略可)_ このサーバに関する情報。[server_stateメソッド][]の公開フィールドを含みます。どの`rippled`バージョン(`build_version`)か、どの[レジャーバージョン](../../../concepts/networks-and-servers/ledger-history.md)が利用可能か(`complete_ledgers`)、サーバの負荷量などです。{% badge href="https://github.com/XRPLF/rippled/releases/tag/1.2.1" %}更新: rippled 1.2.1{% /badge %}. |
| `unl`            | オブジェクト | _(省略可)_ [validatorsメソッド][]や[validator_list_sitesメソッド][]のレスポンスと同様です。{% badge href="https://github.com/XRPLF/rippled/releases/tag/1.2.1" %}更新: rippled 1.2.1{% /badge %}. |
| `version`        | 数値        | このピアクローラのレスポンスのフォーマットのバージョンを示します。現在のピアクローラのバージョン番号は`2`です。{% badge href="https://github.com/XRPLF/rippled/releases/tag/1.2.1" %}更新: rippled 1.2.1{% /badge %}. |

`overlay.active`配列の各メンバーは、次のフィールドを持つオブジェクトです。

| `Field`            | 値                     | 説明                                |
|:-------------------|:-----------------------|:-----------------------------------|
| `complete_ledgers` | 文字列                  | このピアで利用可能な[レジャーバージョン](../../../concepts/networks-and-servers/ledger-history.md)の範囲。 |
| `complete_shards`  | 文字列                  | _(省略可)_ このピアが利用可能な[レジャー履歴シャード](../../../infrastructure/configuration/data-retention/history-sharding.md)の範囲。 |
| `ip`               | 文字列 (IPv4アドレス)    | _(省略可)_この接続ピアの IPアドレス。ピアがバリデータまたは[プライベートピア](../../../concepts/networks-and-servers/peer-protocol.md#プライベートピア)として設定されている場合は省略されます。{% badge href="https://github.com/XRPLF/rippled/releases/tag/1.2.1" %}更新: rippled 1.2.1{% /badge %}. |
| `port`             | 文字列 (数値)            | _(省略可)_ RTXPを提供するピアサーバのポート番号。通常は`51235`。ピアがバリデータまたは[プライベートピア](../../../concepts/networks-and-servers/peer-protocol.md#プライベートピア)として設定されている場合は省略されます。{% badge href="https://github.com/XRPLF/rippled/releases/tag/1.2.1" %}更新: rippled 1.2.1{% /badge %}. |
| `public_key`       | 文字列 (Base64エンコード) | このピアがRTXPメッセージに署名するために使用するECDSA鍵ペアの公開鍵。(これはピアサーバの[server_infoメソッド][]で報告される`pubkey_node`と同じデータです)。 |
| `type`             | 文字列                  | `in`または`out`の値で、ピアへのTCP接続が着信か発信かを示します。 |
| `uptime`           | 数値                    | サーバがこのピアに接続している秒数。 |
| `version`          | 文字列                  | 相手が使用していると報告した`rippled`バージョン番号。 |

#### 例

リクエスト:

{% tabs %}

{% tab label="HTTP" %}
```
GET https://localhost:51235/crawl
```
{% /tab %}

{% tab label="cURL" %}
```
curl --insecure https://localhost:51235/crawl
```
{% /tab %}

{% /tabs %}

レスポンス:

{% code-snippet file="/_api-examples/peer-crawler/crawl.json" language="json" prefix="200 OK\n\n" /%}


## 関連項目

- [ピアプロトコル](../../../concepts/networks-and-servers/peer-protocol.md)
- [ピアクローラの設定](../../../infrastructure/configuration/peering/configure-the-peer-crawler.md)
- [Validator History Service](https://github.com/ripple/validator-history-service)は、検証関連データの取り込み、集計、保存、配布にピアクローラを使用するサービスの一例です。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
