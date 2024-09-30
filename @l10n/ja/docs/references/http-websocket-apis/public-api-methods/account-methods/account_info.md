---
html: account_info.html
parent: account-methods.html
seo:
    description: アカウントとそのアクティビティおよびXRP残高についての情報を取得します。
labels:
  - アカウント
  - XRP
---
# account_info
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/AccountInfo.cpp "Source")

`account_info`コマンドは、アカウントとそのアクティビティおよびXRP残高についての情報を取得します。取得されたすべての情報は、特定バージョンのレジャーに関連付けられています。

## リクエストのフォーマット

account_infoリクエストの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 2,
  "command": "account_info",
  "account": "rG1QQv2nh2gr7RCZ1P8YYcBUKCCN633jCn",
  "ledger_index": "current",
  "queue": true
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "account_info",
    "params": [
        {
            "account": "rG1QQv2nh2gr7RCZ1P8YYcBUKCCN633jCn",
            "ledger_index": "current",
            "queue": true
        }
    ]
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
#Syntax: account_info account [ledger_index|ledger_hash]
rippled account_info rG1QQv2nh2gr7RCZ1P8YYcBUKCCN633jCn validated
```
{% /tab %}

{% /tabs %}

[試してみる>](/resources/dev-tools/websocket-api-tool#account_info)

リクエストには以下のパラメーターが含まれます。

| `Field`        | 型                         | 必須?  | 説明                    |
|:---------------|:---------------------------|:------|:-------------------------------|
| `account`      | 文字列  - [アドレス][]       | はい   | 検索するアカウント。{% badge href="https://github.com/XRPLF/rippled/releases/tag/1.11.0" %}更新: rippled 1.11.0{% /badge %} |
| `ledger_hash`  | 文字列                      | いいえ | 使用するレジャーバージョンの20バイトの16進文字列。([レジャーの指定][]をご覧ください。) |
| `ledger_index` | 文字列または整数              | いいえ | 使用するレジャーのシーケンス番号、またはレジャーを自動的に選択するためのショートカット文字列。([レジャーの指定][]をご覧ください。) |
| `queue`        | 真偽値                      | いいえ        | `true`の場合、このアカウントに関連するキューに入れられたトランザクションについてのステータスも返されます。これを使用するのは、現在のオープンレジャーのデータを問い合わせる場合のみです。 |
| `signer_lists` | 真偽値                      | いいえ        | `true`の場合、このアカウントに関連するすべての[SignerListオブジェクト](../../../protocol/ledger-data/ledger-entry-types/signerlist.md)も返されます。 |

次のフィールドは廃止予定のため、指定しないでください。`ident`、`ledger`,`strict`

## レスポンスのフォーマット

処理が成功したレスポンスの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "id": 5,
    "status": "success",
    "type": "response",
    "result": {
        "account_data": {
            "Account": "rG1QQv2nh2gr7RCZ1P8YYcBUKCCN633jCn",
            "Balance": "999999999960",
            "Flags": 8388608,
            "LedgerEntryType": "AccountRoot",
            "OwnerCount": 0,
            "PreviousTxnID": "4294BEBE5B569A18C0A2702387C9B1E7146DC3A5850C1E87204951C6FDAA4C42",
            "PreviousTxnLgrSeq": 3,
            "Sequence": 6,
            "index": "92FA6A9FC8EA6018D5D16532D7795C91BFB0831355BDFDA177E86C8BF997985F"
        },
        "ledger_current_index": 4,
        "queue_data": {
            "auth_change_queued": true,
            "highest_sequence": 10,
            "lowest_sequence": 6,
            "max_spend_drops_total": "500",
            "transactions": [
                {
                    "auth_change": false,
                    "fee": "100",
                    "fee_level": "2560",
                    "max_spend_drops": "100",
                    "seq": 6
                },
                ...(trimmed for length) ...
                {
                    "LastLedgerSequence": 10,
                    "auth_change": true,
                    "fee": "100",
                    "fee_level": "2560",
                    "max_spend_drops": "100",
                    "seq": 10
                }
            ],
            "txn_count": 5
        },
        "validated": false
    }
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "result": {
        "account_data": {
            "Account": "rG1QQv2nh2gr7RCZ1P8YYcBUKCCN633jCn",
            "Balance": "999999999960",
            "Flags": 8388608,
            "LedgerEntryType": "AccountRoot",
            "OwnerCount": 0,
            "PreviousTxnID": "4294BEBE5B569A18C0A2702387C9B1E7146DC3A5850C1E87204951C6FDAA4C42",
            "PreviousTxnLgrSeq": 3,
            "Sequence": 6,
            "index": "92FA6A9FC8EA6018D5D16532D7795C91BFB0831355BDFDA177E86C8BF997985F"
        },
        "ledger_current_index": 4,
        "queue_data": {
            "auth_change_queued": true,
            "highest_sequence": 10,
            "lowest_sequence": 6,
            "max_spend_drops_total": "500",
            "transactions": [
                {
                    "auth_change": false,
                    "fee": "100",
                    "fee_level": "2560",
                    "max_spend_drops": "100",
                    "seq": 6
                },
                ...(trimmed for length) ...
                {
                    "LastLedgerSequence": 10,
                    "auth_change": true,
                    "fee": "100",
                    "fee_level": "2560",
                    "max_spend_drops": "100",
                    "seq": 10
                }
            ],
            "txn_count": 5
        },
        "status": "success",
        "validated": false
    }
}
```
{% /tab %}

{% tab label="Commandline" %}
```json
{
   "result" : {
      "account_data" : {
         "Account" : "rG1QQv2nh2gr7RCZ1P8YYcBUKCCN633jCn",
         "Balance" : "9986",
         "Flags" : 1114112,
         "LedgerEntryType" : "AccountRoot",
         "OwnerCount" : 0,
         "PreviousTxnID" : "0705FE3F52057924C288296EF0EBF668E0C1A3646FBA8FAF9B73DCC0A797B4B2",
         "PreviousTxnLgrSeq" : 51948740,
         "RegularKey" : "rhLkGGNZdjSpnHJw4XAFw1Jy7PD8TqxoET",
         "Sequence" : 192220,
         "index" : "92FA6A9FC8EA6018D5D16532D7795C91BFB0831355BDFDA177E86C8BF997985F"
      },
      "ledger_hash" : "8169428EDF7F046F817CE44F5F1DF23AD9FAEFFA2CBA7645C3254D66AA79B46E",
      "ledger_index" : 56843712,
      "status" : "success",
      "validated" : true
   }
}
```
{% /tab %}

{% /tabs %}

レスポンスは[標準フォーマット][]に従い、リクエストされたアカウントとそのデータ、アカウントの適用先レジャーが結果として表示されます。以下のフィールドが含まれます。

| `Field`                | 型         | 説明                               |
|:-----------------------|:-----------|:------------------------------------------|
| `account_data`         | オブジェクト | このアカウントの情報を含む[AccountRootレジャーオブジェクト](../../../protocol/ledger-data/ledger-entry-types/accountroot.md)がレジャーに保管されているとおりに表示されます。 |
| `account_flags`        | オブジェクト | アカウントの`Flags`フィールドに基づく、アカウントのフラグ情報(下記参照)。 {% badge href="https://github.com/XRPLF/rippled/releases/tag/1.11.0" %}新規: rippled 1.11.0{% /badge %} |
| `signer_lists`         | 配列        | (リクエストに`signer_lists`が指定されていて、少なくとも1つのSignerListがアカウントに関連する場合を除いて省略)[マルチシグ](../../../../concepts/accounts/multi-signing.md)用にアカウントに関連付けられた[SignerListレジャーオブジェクト](../../../protocol/ledger-data/ledger-entry-types/signerlist.md)の配列。アカウントが所有できるSignerListは最大1つであるため、この配列のメンバーは存在するとすれば、1メンバーのみです。 |
| `ledger_current_index` | 整数        | (`ledger_index`が代わりに指定されている場合は省略) この情報を取得したときに使用されていた最新のレジャーのシーケンス番号。この情報には、これより新しいレジャーの変更は一切含まれません。 |
| `ledger_index`         | 整数        | (`ledger_current_index`が代わりに指定されている場合は省略) この情報を取得したときに使用されていたレジャーのシーケンス番号。この情報には、これより新しいレジャーの変更は一切含まれません。 |
| `queue_data`           | オブジェクト  | (`queue`が`true`と指定され、現在開いているレジャーを問い合わせている場合を除いて省略) このアカウントによって送信された[キューに入れられたトランザクション](../../../../concepts/transactions/transaction-cost.md#キューに入れられたトランザクション)についての情報。この情報にはローカル`rippled`サーバの状態が示されますが、コンセンサスネットワーク内の他のサーバとは異なる場合があります。示される値はキューメカニズムによって「大まかに」計算されるため、一部のフィールドは省略される場合があります。 |
| `validated`            | 真偽値       | このデータが検証済みのレジャーバージョンのものである場合はTrueです。省略されているかFalseが設定されている場合、このデータは最終のものではありません。{% badge href="https://github.com/XRPLF/rippled/releases/tag/0.26.0" %}新規: rippled 0.26.0{% /badge %} |

`account_flags`フィールドは以下のネストしたフィールドを含みます：

| `Field`                | 型    | 説明                               |
|:-----------------------|:--------|:------------------------------------------|
| `defaultRipple`        | 真偽値 | `true`の場合、アカウントはデフォルトでトラストラインの[rippling](../../../../concepts/tokens/fungible-tokens/rippling.md)を許可します。 |
| `depositAuth`          | 真偽値 | `true`の場合、このアカウントは[Deposit Authorization](../../../../concepts/accounts/depositauth.md)を使用しており、未知の第三者からの入金を受け付けていません。 |
| `disableMasterKey`     | 真偽値 | `true`の場合、アカウントの[マスターキーペア](../../../../concepts/accounts/cryptographic-keys.md)が無効になっています。 |
| `disallowIncomingCheck` | 真偽値 | `true`の場合、このアカウントは第三者からの[Check](../../../../concepts/payment-types/checks.md)の送信を許可してません。 _([DisallowIncoming amendment][]が必要です)_ |
| `disallowIncomingNFTokenOffer` | 真偽値 | `true`の場合、このアカウントは第三者からの[NFT売買オファー](../../../../concepts/tokens/nfts/trading.md)の作成を許可してません。 _([DisallowIncoming amendment][]が必要です)_ |
| `disallowIncomingPayChan` | 真偽値 | `true`の場合、このアカウントは第三者からの[ペイメントチャンネル](../../../../concepts/payment-types/payment-channels.md)の作成を許可していません。 _([DisallowIncoming amendment][]が必要です)_ |
| `disallowIncomingTrustline` | 真偽値 | `true`の場合、このアカウントは第三者が[トラストライン](../../../../concepts/tokens/fungible-tokens/index.md)を作ることを許可していません。 _([DisallowIncoming amendment][]が必要です)_ |
| `disallowIncomingXRP`  | 真偽値 | `true`の場合、このアカウントは他者からXRPを受け取りたくありません。(これは参考情報であり、プロトコルレベルでは強制されません) |
| `globalFreeze`         | 真偽値 | `true`の場合、このアカウントによって発行されたすべてのトークンは現在凍結されています。 |
| `noFreeze`             | 真偽値 | `true`の場合、このアカウントは個々のトラストラインを凍結したり、グローバル凍結を行う機能を永久に放棄しています。詳細は[No Freeze](../../../../concepts/tokens/fungible-tokens/freezes.md#no-freeze)をご覧ください。 |
| `passwordSpent`        | 真偽値 | `false`の場合、このアカウントはトランザクションコスト0の特別な[キーリセットトランザクション](../../../../concepts/transactions/transaction-cost.md#key-resetトランザクション)を送信できます。プロトコルはこのフラグを自動的にオン/オフします。 |
| `requireAuthorization` | 真偽値 | `true`の場合、このアカウントは[認可トラストライン](../../../../concepts/tokens/fungible-tokens/authorized-trust-lines.md)を使って、発行するトークンを保持できる人を制限しています。 |
| `requireDestinationTag` | 真偽値 | `true`の場合、このアカウントは受け取るすべての支払いに[宛先タグ](../../../../tutorials/how-tos/manage-account-settings/require-destination-tags.md)をリクエストしています。 |

`queue_data`パラメーターが存在する場合、以下のフィールドが含まれます。

| `Field`                 | 型      | 説明                              |
|:------------------------|:--------|:-----------------------------------------|
| `txn_count`             | 整数     | このアドレスからキューに入れられたトランザクションの数。 |
| `auth_change_queued`    | 真偽値   | （省略される場合があります）キュー内のトランザクションがこのアドレスの[トランザクションの承認方法](../../../../concepts/transactions/index.md#トランザクションの承認)を変更するかどうかを示します。`true`の場合、トランザクションが実行されているかキューから除外されるまで、このアドレスはトランザクションをこれ以上キューに入れることができません。 |
| `lowest_sequence`       | 整数     | （省略される場合があります）このアドレスによってキューに入れられたトランザクションのうち最も低い[シーケンス番号][]。 |
| `highest_sequence`      | 整数     | （省略される場合があります）このアドレスによってキューに入れられたトランザクションのうち最も高い[シーケンス番号][]。 |
| `max_spend_drops_total` | 文字列   | （省略される場合があります）キュー内のすべてのトランザクションが利用可能なXRPを最大限消費する場合に、このアドレスから差し引くことができる[XRPのdrop数][]を示す整数の金額。 |
| `transactions`          | 配列     | （省略される場合があります）このアドレスからキューに入れられた各トランザクションについての情報。 |

`queue_data`の`transactions`配列内の各オブジェクト（存在する場合）には、以下のフィールドのいずれかまたはすべてが含まれます。

| `Field`           | 型      | 説明                                    |
|:------------------|:--------|:-----------------------------------------------|
| `auth_change`     | 真偽値   | このトランザクションがこのアドレスの[トランザクション承認の方法](../../../../concepts/transactions/index.md#トランザクションの承認)を変更するかどうかを示します。 |
| `fee`             | 文字列   | このトランザクションの[トランザクションコスト](../../../../concepts/transactions/transaction-cost.md)（[XRPのdrop数][]）。 |
| `fee_level`       | 文字列   | このタイプのトランザクションの最少コストと比較した、このトランザクションのトランザクションコスト（[手数料レベル][]）。 |
| `max_spend_drops` | 文字列   | このトランザクションで送信または消却できる[XRPのdrop数][]の最高額。 |
| `seq`             | 整数     | このトランザクションの[シーケンス番号][]。   |

## 考えられるエラー

* いずれかの[汎用エラータイプ][]。
* `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。例えば、リクエストで`queue`を`true`と指定したが、現在開いているレジャーではない`ledger_index`を指定した場合です。
* `actNotFound` - リクエストの`account`フィールドに指定したアドレスが、レジャー内のアカウントに対応していません。
* `lgrNotFound` - `ledger_hash`または`ledger_index`で指定したレジャーが存在しないか、存在してはいるもののサーバが保有していません。

[手数料レベル]: ../../../../concepts/transactions/transaction-cost.md#手数料レベル

{% raw-partial file="/docs/_snippets/common-links.md" /%}
