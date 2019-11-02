# validators
[[ソース]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/Validators.cpp "Source")

`validators`コマンドは、サーバーが使用する公開済みの信頼できるバリデータの最新リストに関する情報を、人間が読み取れる形式で返します。[新規: rippled 0.80.1][]

*`validators`要求は、権限のないユーザーは実行できない[管理メソッド](admin-rippled-methods.html)です。*

### 要求フォーマット
要求フォーマットの例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
   "id": 1,
   "command": "validators"
}
```

*JSON-RPC*

```
{
   "method": "validators",
   "params": [
       {}
   ]
}
```

*コマンドライン*

```
#Syntax: validators
rippled validators
```

<!-- MULTICODE_BLOCK_END -->

要求にはパラメーターが含まれていません。

### 応答フォーマット

処理が成功した応答の例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
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
                   "n9Ltz6ZxPRWTkqwBbpvgbaXPgm6GYCxCJRqFgNXhWVUebgezo28H",
                   "n94D73ZKSUaTDCnUqYW5ugJ9fHPNxda9GQVoWA6BGtcKuuhozrD1"
               ],
               "pubkey_publisher":"ED58ED4AA543B524F16771F6E1367BAA220D99DCF22CD8CF7A11309E9EAB1B647B",
               "seq":1,
               "version":1
           }
       ],
       "signing_keys":{},
       "status":"success",
       "trusted_validator_keys":[
           "n94D73ZKSUaTDCnUqYW5ugJ9fHPNxda9GQVoWA6BGtcKuuhozrD1",
           "n9Ltz6ZxPRWTkqwBbpvgbaXPgm6GYCxCJRqFgNXhWVUebgezo28H"
       ],
       "validation_quorum":2,
       "validator_list_expires":"2017-Oct-13 14:56:00"
   }
}
```

*JSON-RPC*

```
200 OK
{
   "result":{
       "local_static_keys": [],
       "publisher_lists":[
           {
               "available":true,
               "expiration":"2017-Oct-13 14:56:00",
               "list":[
                   "n9Ltz6ZxPRWTkqwBbpvgbaXPgm6GYCxCJRqFgNXhWVUebgezo28H",
                   "n94D73ZKSUaTDCnUqYW5ugJ9fHPNxda9GQVoWA6BGtcKuuhozrD1"
               ],
               "pubkey_publisher":"ED58ED4AA543B524F16771F6E1367BAA220D99DCF22CD8CF7A11309E9EAB1B647B",
               "seq":1,
               "version":1
           }
       ],
       "signing_keys":{},
       "status":"success",
       "trusted_validator_keys":[
           "n94D73ZKSUaTDCnUqYW5ugJ9fHPNxda9GQVoWA6BGtcKuuhozrD1",
           "n9Ltz6ZxPRWTkqwBbpvgbaXPgm6GYCxCJRqFgNXhWVUebgezo28H"
       ],
       "validation_quorum":2,
       "validator_list_expires":"2017-Oct-13 14:56:00"
   },
   "status":"success"
}
```

*コマンドライン*

```
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
                   "n9Ltz6ZxPRWTkqwBbpvgbaXPgm6GYCxCJRqFgNXhWVUebgezo28H",
                   "n94D73ZKSUaTDCnUqYW5ugJ9fHPNxda9GQVoWA6BGtcKuuhozrD1"
               ],
               "pubkey_publisher":"ED58ED4AA543B524F16771F6E1367BAA220D99DCF22CD8CF7A11309E9EAB1B647B",
               "seq":1,
               "version":1
           }
       ],
       "signing_keys":{},
       "status":"success",
       "trusted_validator_keys":[
           "n94D73ZKSUaTDCnUqYW5ugJ9fHPNxda9GQVoWA6BGtcKuuhozrD1",
           "n9Ltz6ZxPRWTkqwBbpvgbaXPgm6GYCxCJRqFgNXhWVUebgezo28H"
       ],
       "validation_quorum":2,
       "validator_list_expires":"2017-Oct-13 14:56:00"
   },
   "status":"success"
}
```

<!-- MULTICODE_BLOCK_END -->

応答は[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれています。

| `Field`                  | 型   | 説明                              |
|:-------------------------|:-------|:-----------------------------------------|
| `listed_static_keys`     | 配列  | 信頼リストに常に追加可能なバリデータの公開鍵の配列。 |
| `publisher_lists`        | 配列  | パブリッシャーリストオブジェクトの配列。         |
| `signing_keys`           | オブジェクト | バリデータマニフェストを使用している登録済みバリデータのマスター公開鍵から、現在の署名キーへのマッピング。 |
| `trusted_validator_keys` | 配列  | 現在信頼されているバリデータの公開鍵の配列。 |
| `validation_quorum`      | 数値 | 1つのレジャーバージョンの検証に最低限必要となる信頼できる検証の数。状況によっては、サーバーがさらに検証を要求する場合があります。 |
| `validator_list_expires` | 文字列 | 人間が読み取れる形式での現在のバリデータリストの有効期限、文字列`unknown`（サーバーが公開済みバリデータリストを読み込む必要がある場合）、または文字列`never`（サーバーが静的なバリデータリストを使用している場合）のいずれか。 |

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

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}