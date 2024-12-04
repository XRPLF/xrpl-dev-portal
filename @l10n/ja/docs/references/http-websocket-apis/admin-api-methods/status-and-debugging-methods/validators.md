---
html: validators.html
parent: status-and-debugging-methods.html
seo:
    description: サーバが使用する公開済みの信頼できるバリデータの最新リストに関する情報を返します。
labels:
  - ブロックチェーン
  - コアサーバ
---
# validators
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/Validators.cpp "Source")

`validators`コマンドは、サーバが使用する公開済みの信頼できるバリデータの最新リストに関する情報を、人間が読み取れる形式で返します。{% badge href="https://github.com/XRPLF/rippled/releases/tag/0.80.1" %}新規: rippled 0.80.1{% /badge %}

*`validators`リクエストは、権限のないユーザは実行できない[管理メソッド](../index.md)です。*

### リクエストのフォーマット
リクエストのフォーマットの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
   "id": 1,
   "command": "validators"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
   "method": "validators",
   "params": [
       {}
   ]
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
#Syntax: validators
rippled validators
```
{% /tab %}

{% /tabs %}

リクエストにはパラメーターが含まれていません。

### レスポンスのフォーマット

処理が成功したレスポンスの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
   "id":5,
   "status":"success",
   "type":"response",
   "result":{
       "local_static_keys": [],
       "publisher_lists":[
           {
               "available":true,
               "expiration":"2017-Oct-13 14:56:00",
               "list":[
                   "nHBtBkHGfL4NpB54H1AwBaaSJkSJLUSPvnUNAcuNpuffYB51VjH6",
                   "nHBe4vqSAzjpPRLKwSFzRFtmvzXaf5wPPmuVrQCAoJoS1zskgDA4"
               ],
               "pubkey_publisher":"ED58ED4AA543B524F16771F6E1367BAA220D99DCF22CD8CF7A11309E9EAB1B647B",
               "seq":1,
               "version":1
           }
       ],
       "signing_keys":{},
       "status":"success",
       "trusted_validator_keys":[
           "nHBe4vqSAzjpPRLKwSFzRFtmvzXaf5wPPmuVrQCAoJoS1zskgDA4",
           "nHBtBkHGfL4NpB54H1AwBaaSJkSJLUSPvnUNAcuNpuffYB51VjH6"
       ],
       "validation_quorum":2,
       "validator_list_expires":"2017-Oct-13 14:56:00"
   }
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
200 OK

{
   "result":{
       "local_static_keys": [],
       "publisher_lists":[
           {
               "available":true,
               "expiration":"2017-Oct-13 14:56:00",
               "list":[
                   "nHBtBkHGfL4NpB54H1AwBaaSJkSJLUSPvnUNAcuNpuffYB51VjH6",
                   "nHBe4vqSAzjpPRLKwSFzRFtmvzXaf5wPPmuVrQCAoJoS1zskgDA4"
               ],
               "pubkey_publisher":"ED58ED4AA543B524F16771F6E1367BAA220D99DCF22CD8CF7A11309E9EAB1B647B",
               "seq":1,
               "version":1
           }
       ],
       "signing_keys":{},
       "status":"success",
       "trusted_validator_keys":[
           "nHBe4vqSAzjpPRLKwSFzRFtmvzXaf5wPPmuVrQCAoJoS1zskgDA4",
           "nHBtBkHGfL4NpB54H1AwBaaSJkSJLUSPvnUNAcuNpuffYB51VjH6"
       ],
       "validation_quorum":2,
       "validator_list_expires":"2017-Oct-13 14:56:00"
   },
   "status":"success"
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```json
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005

{
   "result":{
       "local_static_keys": [],
       "publisher_lists":[
           {
               "available":true,
               "expiration":"2017-Oct-13 14:56:00",
               "list":[
                   "nHBtBkHGfL4NpB54H1AwBaaSJkSJLUSPvnUNAcuNpuffYB51VjH6",
                   "nHBe4vqSAzjpPRLKwSFzRFtmvzXaf5wPPmuVrQCAoJoS1zskgDA4"
               ],
               "pubkey_publisher":"ED58ED4AA543B524F16771F6E1367BAA220D99DCF22CD8CF7A11309E9EAB1B647B",
               "seq":1,
               "version":1
           }
       ],
       "signing_keys":{},
       "status":"success",
       "trusted_validator_keys":[
           "nHBe4vqSAzjpPRLKwSFzRFtmvzXaf5wPPmuVrQCAoJoS1zskgDA4",
           "nHBtBkHGfL4NpB54H1AwBaaSJkSJLUSPvnUNAcuNpuffYB51VjH6"
       ],
       "validation_quorum":2,
       "validator_list_expires":"2017-Oct-13 14:56:00"
   },
   "status":"success"
}
```
{% /tab %}

{% /tabs %}

レスポンスは[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれています。

| `Field`                  | 型   | 説明                              |
|:-------------------------|:-------|:-----------------------------------------|
| `listed_static_keys`     | 配列  | 信頼リストに常に追加可能なバリデータの公開鍵の配列。 |
| `publisher_lists`        | 配列  | パブリッシャーリストオブジェクトの配列。         |
| `signing_keys`           | オブジェクト | バリデータマニフェストを使用している登録済みバリデータのマスター公開鍵から、現在の署名キーへのマッピング。 |
| `trusted_validator_keys` | 配列  | 現在信頼されているバリデータの公開鍵の配列。 |
| `validation_quorum`      | 数値 | 1つのレジャーバージョンの検証に最低限必要となる信頼できる検証の数。状況によっては、サーバがさらに検証をリクエストする場合があります。 |
| `validator_list_expires` | 文字列 | 人間が読み取れる形式での現在のバリデータリストの有効期限、文字列`unknown`（サーバが公開済みバリデータリストを読み込む必要がある場合）、または文字列`never`（サーバが静的なバリデータリストを使用している場合）のいずれか。 |

`publisher_lists`配列の各メンバーは、以下のフィールドを有するオブジェクトです。

| `Field`            | 型             | 説明                          |
|:-------------------|:-----------------|:-------------------------------------|
| `available`        | ブール値          | `false`の場合、`list`内のバリデータキーはこのパブリッシャーによりサポートされていない可能性があります。 |
| `expiration`       | 文字列           | この公開済みリストの有効期限を人間が読み取れる形式で示します。 |
| `list`             | 配列            | 公開済みバリデータキーからなる配列。   |
| `pubkey_publisher` | 文字列           | リストパブリッシャーのEd25519またはECDSA公開鍵（16進数）。 |
| `seq`              | 符号なし整数 | 公開済みリストのシーケンス番号。 |
| `version`          | 符号なし整数 | リストフォーマットのバージョン。      |

### 考えられるエラー

* [汎用エラータイプ][]のすべて。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
