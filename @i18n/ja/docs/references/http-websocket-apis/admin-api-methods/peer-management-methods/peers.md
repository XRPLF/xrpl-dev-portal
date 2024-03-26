---
html: peers.html
parent: peer-management-methods.html
seo:
    description: ピアプロトコルでこのサーバに現在接続されているその他のすべてのrippledサーバのリストを返します。
labels:
  - コアサーバ
---
# peers
[[ソース]](https://github.com/XRPLF/rippled/blob/52f298f150fc1530d201d3140c80d3eaf781cb5f/src/ripple/rpc/handlers/Peers.cpp "Source")

`peers`コマンドは、[ピアプロトコル](../../../../concepts/networks-and-servers/peer-protocol.md)でこのサーバに現在接続されているその他のすべての`rippled`サーバのリスト（各サーバの接続状況と同期状況を含む）を返します。

*`peers`リクエストは、権限のないユーザは実行できない[管理メソッド](../index.md)です。*

### リクエストのフォーマット
リクエストのフォーマットの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
   "id": 2,
   "command": "peers"
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```
rippled peers
```
{% /tab %}

{% /tabs %}

このリクエストには追加パラメーターはありません。

### レスポンスのフォーマット

処理が成功したレスポンスの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
 "id": 2,
 "status": "success",
 "type": "response",
 "result": {
   "cluster": {},
   "peers": [
     {
       "address": "184.172.237.226:51235",
       "complete_ledgers": "14534883 - 18828973",
       "latency": 117,
       "ledger": "50A2577CE6EB8A92847C443BDA45F5C5F0A22B9C6F4B47DBA0C12BDA75001D01",
       "load": 54,
       "public_key": "n9KNYm52mgcUQ7R2RA4kyw9Nk1yc6S35PaiuyqjYsy6UjhCXpw12",
       "uptime": 55036,
       "version": "rippled-0.30.0-hf1"
     },
     {
       "address": "54.186.248.91:51235",
       "complete_ledgers": "18827949 - 18828973",
       "latency": 91,
       "ledger": "50A2577CE6EB8A92847C443BDA45F5C5F0A22B9C6F4B47DBA0C12BDA75001D01",
       "load": 62,
       "public_key": "n9MT5EjnV912KGuBUqPs4tpdhzMPGcnDBrTuWkD9sWQHJ1kDcUcz",
       "uptime": 83814,
       "version": "rippled-0.30.1"
     },
     {
       "address": "54.84.21.230:51235",
       "complete_ledgers": "18827949 - 18828973",
       "latency": 202,
       "ledger": "50A2577CE6EB8A92847C443BDA45F5C5F0A22B9C6F4B47DBA0C12BDA75001D01",
       "load": 60,
       "public_key": "n9KJb7NMxGySRcjCqh69xEPMUhwJx22qntYYXsnUqYgjsJhNoW7g",
       "uptime": 99625,
       "version": "rippled-0.30.1"
     },
     {
       "address": "72.251.233.162:51235",
       "complete_ledgers": "18827949 - 18828973",
       "latency": 36,
       "ledger": "50A2577CE6EB8A92847C443BDA45F5C5F0A22B9C6F4B47DBA0C12BDA75001D01",
       "load": 66,
       "public_key": "n9M8RSk6hrvXZKFQ6CxPbJsjt73xW1xsnjn7G69VAMbE2j4sBQNQ",
       "uptime": 99619,
       "version": "rippled-0.30.1"
     },
     {
       "address": "162.217.98.136:51235",
       "complete_ledgers": "32570 - 18828973",
       "latency": 118,
       "ledger": "50A2577CE6EB8A92847C443BDA45F5C5F0A22B9C6F4B47DBA0C12BDA75001D01",
       "load": 69,
       "public_key": "n944PcXEoZaiEHnwFD92xA4bxsS7jjYb27WcdDQwkHYyk1MWTEsX",
       "uptime": 99625,
       "version": "rippled-0.30.1"
     },
     {
       "address": "72.251.233.163:51235",
       "complete_ledgers": "18827949 - 18828973",
       "latency": 51,
       "ledger": "50A2577CE6EB8A92847C443BDA45F5C5F0A22B9C6F4B47DBA0C12BDA75001D01",
       "load": 61,
       "public_key": "n94ne2Z5dX8qcJNa8cPtAbtn21gEaCoEduS8TwdGAhi1iLfCUMDm",
       "uptime": 99625,
       "version": "rippled-0.30.1"
     },
     {
       "address": "54.186.73.52:51235",
       "complete_ledgers": "18827949 - 18828973",
       "latency": 72,
       "ledger": "50A2577CE6EB8A92847C443BDA45F5C5F0A22B9C6F4B47DBA0C12BDA75001D01",
       "load": 60,
       "public_key": "n9JySgyBVcQKvyDoeRKg7s2Mm6ZcFHk22vUZb3o1HSosWxcj9xPt",
       "uptime": 99625,
       "version": "rippled-0.30.1"
     },
     {
       "address": "72.251.233.165:51235",
       "complete_ledgers": "18827949 - 18828973",
       "latency": 40,
       "ledger": "50A2577CE6EB8A92847C443BDA45F5C5F0A22B9C6F4B47DBA0C12BDA75001D01",
       "load": 63,
       "public_key": "n9M77Uc9CSaSFZqt5V7sxPR4kFwbha7hwUFBD5v5kZt2SQjBeoDs",
       "uptime": 99625,
       "version": "rippled-0.30.1"
     },
     {
       "address": "72.251.232.173:51235",
       "complete_ledgers": "32570 - 18828973",
       "latency": 40,
       "ledger": "50A2577CE6EB8A92847C443BDA45F5C5F0A22B9C6F4B47DBA0C12BDA75001D01",
       "load": 71,
       "public_key": "n9JveA1hHDGjZECaYC7KM4JP8NXXzNXAxixbzcLTGnrsFZsA9AD1",
       "uptime": 99625,
       "version": "rippled-0.31.0-b6"
     },
     {
       "address": "98.167.120.212:51235",
       "complete_ledgers": "18828845 - 18828973",
       "latency": 99,
       "ledger": "50A2577CE6EB8A92847C443BDA45F5C5F0A22B9C6F4B47DBA0C12BDA75001D01",
       "load": 60,
       "public_key": "n9LDBRoqPYY7RdkNXbX1dqZXVtUKcSqzs2CZPhTH7ymA9X7Xzmpj",
       "uptime": 99625,
       "version": "rippled-0.30.1-rc4"
     }
   ]
 }
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
  "result" : {
     "cluster" : {},
     "peers" : [
        {
           "address" : "184.172.237.226:51235",
           "complete_ledgers" : "14535005 - 18828957",
           "latency" : 114,
           "ledger" : "80FCB89BC5B90D2B9C2CE33786738809796F04FB9CB1E5EEE768DD9A9C399FB0",
           "load" : 47,
           "public_key" : "n9KNYm52mgcUQ7R2RA4kyw9Nk1yc6S35PaiuyqjYsy6UjhCXpw12",
           "uptime" : 54976,
           "version" : "rippled-0.30.0-hf1"
        },
        {
           "address" : "54.186.248.91:51235",
           "complete_ledgers" : "18827934 - 18828958",
           "latency" : 68,
           "ledger" : "9447480E351221123B1A454356435A66C188D9794B0197A060637E19F074B421",
           "load" : 56,
           "public_key" : "n9MT5EjnV912KGuBUqPs4tpdhzMPGcnDBrTuWkD9sWQHJ1kDcUcz",
           "uptime" : 83754,
           "version" : "rippled-0.30.1"
        },
        {
           "address" : "54.84.21.230:51235",
           "complete_ledgers" : "18827934 - 18828958",
           "latency" : 135,
           "ledger" : "9447480E351221123B1A454356435A66C188D9794B0197A060637E19F074B421",
           "load" : 54,
           "public_key" : "n9KJb7NMxGySRcjCqh69xEPMUhwJx22qntYYXsnUqYgjsJhNoW7g",
           "uptime" : 99565,
           "version" : "rippled-0.30.1"
        },
        {
           "address" : "72.251.233.162:51235",
           "complete_ledgers" : "18827934 - 18828958",
           "latency" : 24,
           "ledger" : "9447480E351221123B1A454356435A66C188D9794B0197A060637E19F074B421",
           "load" : 61,
           "public_key" : "n9M8RSk6hrvXZKFQ6CxPbJsjt73xW1xsnjn7G69VAMbE2j4sBQNQ",
           "uptime" : 99560,
           "version" : "rippled-0.30.1"
        },
        {
           "address" : "162.217.98.136:51235",
           "complete_ledgers" : "32570 - 18828958",
           "latency" : 88,
           "ledger" : "9447480E351221123B1A454356435A66C188D9794B0197A060637E19F074B421",
           "load" : 55,
           "public_key" : "n944PcXEoZaiEHnwFD92xA4bxsS7jjYb27WcdDQwkHYyk1MWTEsX",
           "uptime" : 99566,
           "version" : "rippled-0.30.1"
        },
        {
           "address" : "72.251.233.163:51235",
           "complete_ledgers" : "18827934 - 18828958",
           "latency" : 24,
           "ledger" : "9447480E351221123B1A454356435A66C188D9794B0197A060637E19F074B421",
           "load" : 56,
           "public_key" : "n94ne2Z5dX8qcJNa8cPtAbtn21gEaCoEduS8TwdGAhi1iLfCUMDm",
           "uptime" : 99566,
           "version" : "rippled-0.30.1"
        },
        {
           "address" : "54.186.73.52:51235",
           "complete_ledgers" : "18827934 - 18828958",
           "latency" : 51,
           "ledger" : "9447480E351221123B1A454356435A66C188D9794B0197A060637E19F074B421",
           "load" : 56,
           "public_key" : "n9JySgyBVcQKvyDoeRKg7s2Mm6ZcFHk22vUZb3o1HSosWxcj9xPt",
           "uptime" : 99566,
           "version" : "rippled-0.30.1"
        },
        {
           "address" : "72.251.233.165:51235",
           "complete_ledgers" : "18827934 - 18828958",
           "latency" : 25,
           "ledger" : "9447480E351221123B1A454356435A66C188D9794B0197A060637E19F074B421",
           "load" : 56,
           "public_key" : "n9M77Uc9CSaSFZqt5V7sxPR4kFwbha7hwUFBD5v5kZt2SQjBeoDs",
           "uptime" : 99566,
           "version" : "rippled-0.30.1"
        },
        {
           "address" : "72.251.232.173:51235",
           "complete_ledgers" : "32570 - 18828958",
           "latency" : 24,
           "ledger" : "9447480E351221123B1A454356435A66C188D9794B0197A060637E19F074B421",
           "load" : 81,
           "public_key" : "n9JveA1hHDGjZECaYC7KM4JP8NXXzNXAxixbzcLTGnrsFZsA9AD1",
           "uptime" : 99566,
           "version" : "rippled-0.31.0-b6"
        },
        {
           "address" : "98.167.120.212:51235",
           "complete_ledgers" : "18828830 - 18828957",
           "latency" : 137,
           "ledger" : "9447480E351221123B1A454356435A66C188D9794B0197A060637E19F074B421",
           "load" : 54,
           "public_key" : "n9LDBRoqPYY7RdkNXbX1dqZXVtUKcSqzs2CZPhTH7ymA9X7Xzmpj",
           "uptime" : 99566,
           "version" : "rippled-0.30.1-rc4"
        }
     ],
     "status" : "success"
  }
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```json
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005

{
  "result" : {
     "cluster" : {},
     "peers" : [
        {
           "address" : "72.251.232.173:51235",
           "complete_ledgers" : "32570 - 18851276",
           "latency" : 22,
           "ledger" : "592C723DDBB1C5119F0D8288894060C83C8C2975A061D7C9971427D6798098F5",
           "load" : 20,
           "public_key" : "n9JveA1hHDGjZECaYC7KM4JP8NXXzNXAxixbzcLTGnrsFZsA9AD1",
           "uptime" : 26,
           "version" : "rippled-0.31.0-b6"
        },
        {
           "address" : "169.53.155.36:51235",
           "complete_ledgers" : "12920801 - 18851275",
           "latency" : 127,
           "load" : 16,
           "public_key" : "n9L42gouyppsmsMXXUdByXnVDUZv1eu6KLZUWUkNHsukzv3pr7po",
           "uptime" : 18,
           "version" : "rippled-0.30.0-hf1"
        },
        {
           "address" : "169.53.155.44:51235",
           "complete_ledgers" : "12920779 - 18851276",
           "latency" : 20,
           "ledger" : "592C723DDBB1C5119F0D8288894060C83C8C2975A061D7C9971427D6798098F5",
           "load" : 49,
           "public_key" : "n94BpoEqEf1PxpAv3Bmyy2WoKHyeMpHPH4tcj6P9NW98zdzEyRhi",
           "uptime" : 50,
           "version" : "rippled-0.30.0-hf1"
        },
        {
           "address" : "192.170.145.77:51235",
           "complete_ledgers" : "32570 - 18851277",
           "latency" : 145,
           "ledger" : "592C723DDBB1C5119F0D8288894060C83C8C2975A061D7C9971427D6798098F5",
           "load" : 29,
           "public_key" : "n9LwcmtjDAJQz4u8DZCMGQ9GXHuMEV4Cf8KpPL9NgqAV2puxdYc2",
           "uptime" : 51,
           "version" : "rippled-0.30.1"
        },
        {
           "address" : "162.217.98.136:51235",
           "complete_ledgers" : "32570 - 18851277",
           "latency" : 83,
           "ledger" : "592C723DDBB1C5119F0D8288894060C83C8C2975A061D7C9971427D6798098F5",
           "load" : 30,
           "public_key" : "n944PcXEoZaiEHnwFD92xA4bxsS7jjYb27WcdDQwkHYyk1MWTEsX",
           "uptime" : 50,
           "version" : "rippled-0.30.1"
        },
        {
           "address" : "184.172.237.241:51235",
           "complete_ledgers" : "14153089 - 18851277",
           "latency" : 104,
           "ledger" : "592C723DDBB1C5119F0D8288894060C83C8C2975A061D7C9971427D6798098F5",
           "load" : 29,
           "public_key" : "n9L3LdCTVYUhCKtQtxiHrQ5ocNXVqZFiEJpF5pX9DXahYLrvi5R7",
           "uptime" : 51,
           "version" : "rippled-0.30.0-hf1"
        },
        {
           "address" : "99.110.49.91:51301",
           "complete_ledgers" : "32570 - 18851277",
           "latency" : 152,
           "ledger" : "592C723DDBB1C5119F0D8288894060C83C8C2975A061D7C9971427D6798098F5",
           "load" : 55,
           "public_key" : "n9LGv3xKVqhxq6vcTfmJZhxyhjywsZbvJvpFbZRXzzz5uQ64xTLy",
           "uptime" : 51,
           "version" : "rippled-0.31.0-b6"
        },
        {
           "address" : "169.53.155.45:51235",
           "complete_ledgers" : "12920779 - 18851277",
           "latency" : 15,
           "ledger" : "592C723DDBB1C5119F0D8288894060C83C8C2975A061D7C9971427D6798098F5",
           "load" : 30,
           "public_key" : "n9MRiHyMk43YpqATWeT8Zyu4HJq1btb5oNKmnHTkLJKQg9LQQq3v",
           "uptime" : 51,
           "version" : "rippled-0.30.0-hf1"
        },
        {
           "address" : "54.186.248.91:51235",
           "complete_ledgers" : "18850253 - 18851277",
           "latency" : 63,
           "ledger" : "592C723DDBB1C5119F0D8288894060C83C8C2975A061D7C9971427D6798098F5",
           "load" : 36,
           "public_key" : "n9MT5EjnV912KGuBUqPs4tpdhzMPGcnDBrTuWkD9sWQHJ1kDcUcz",
           "uptime" : 51,
           "version" : "rippled-0.30.1"
        }
     ],
     "status" : "success"
  }
}

```
{% /tab %}

{% /tabs %}

レスポンスは[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドからなるJSONオブジェクトが含まれます。

| `Field`   | 型   | 説明                                             |
|:----------|:-------|:--------------------------------------------------------|
| `cluster` | オブジェクト | [クラスターとして構成されている](../../../../concepts/networks-and-servers/clustering.md)場合は、同じクラスター内の他の`rippled`サーバの概要。{% badge href="https://github.com/XRPLF/rippled/releases/tag/0.30.1" %}新規: rippled 0.30.1{% /badge %} |
| `peers`   | 配列  | peerオブジェクトからなる配列。                                  |

`cluster`オブジェクトの各フィールドは、該当する`rippled`サーバの識別用キーペアの公開鍵です。（これは、[server_infoメソッド][]で当該サーバから`pubkey_node`として返される値と同じです。）そのフィールドの内容は、以下のフィールドを持つオブジェクトです。

| `Field` | 型   | 説明                                               |
|:--------|:-------|:----------------------------------------------------------|
| `tag`   | 文字列 | 構成ファイルで定義されているこのクラスターメンバーの表示名。 |
| `fee`   | 数値 | （省略される場合があります）このクラスターメンバーが[トランザクションコスト](../../../../concepts/transactions/transaction-cost.md)に適用する負荷乗数。 |
| `age`   | 数値 | このクラスターメンバーからの最終クラスターレポート以降の経過秒数。 |

`peers`配列の各メンバーは、以下のフィールドを持つpeerオブジェクトです。

| `Field`            | 型    | 説明                                   |
|:-------------------|:--------|:----------------------------------------------|
| `address`          | 文字列  | このピアが接続しているIPアドレスとポート。 |
| `cluster`          | ブール値 | （省略される場合があります）`true`の場合、現在のサーバとピアサーバは同じ`rippled`クラスターに含まれています。 |
| `name`             | 文字列  | （省略される場合があります）ピアが同じクラスターに含まれている場合、この名前は構成ファイルで定義されているそのピアサーバの表示名です。 |
| `complete_ledgers` | 文字列  | ピア`rippled`で利用可能なレジャーバージョンのシーケンス番号を示す範囲式 |
| `inbound`          | ブール値 | （省略される場合があります）`true`の場合は、ピアはローカルサーバに接続しています。 |
| `latency`          | 数値  | ピアへのネットワーク遅延（ミリ秒単位） |
| `ledger`           | 文字列  | 最後に閉鎖されたピアのレジャーのハッシュ。 |
| `load`             | 数値  | ピアサーバによるローカルサーバへの負荷の測定値。この数値が大きいほど負荷が高くなります。（負荷の測定単位は正式には定義されていません。） |
| `protocol`         | 文字列  | （省略される場合があります）ピアが使用しているプロトコルバージョン（ローカルサーバのプロトコルバージョンと異なる場合）。 |
| `public_key`       | 文字列  | （省略される場合があります）ピアのメッセージの整合性の検証に使用できる公開鍵。これは、検証に使用する公開鍵とは異なりますが、フォーマットは同じです。 |
| `sanity`           | 文字列  | （省略される場合があります）このピアが現行サーバと同じルールとレジャーシーケンスに従っているかどうか。値が`insane`の場合、ピアは並列ネットワークの一部である可能性があります。値が`unknown`の場合、現行サーバはピアに互換性があるかどうかを把握していません。 <!-- STYLE_OVERRIDE: insane --> |
| `status`           | 文字列  | （省略される場合があります）ピアからの最新のステータスメッセージ。`connecting`、`connected`、`monitoring`、`validating`、`shutting`のいずれかです。 |
| `uptime`           | 数値  | `rippled`サーバがこのピアに継続して接続していた秒数。{% badge href="https://github.com/XRPLF/rippled/releases/tag/0.30.1" %}新規: rippled 0.30.1{% /badge %} |
| `version`          | 文字列  | （省略される場合があります）ピアサーバの`rippled`バージョン番号 |

### 考えられるエラー

* [汎用エラータイプ][]のすべて。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
