# account_info
[[ソース]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/AccountInfo.cpp "Source")

`account_info`コマンドは、アカウントとそのアクティビティおよびXRP残高についての情報を取得します。取得されたすべての情報は、特定バージョンのレジャーに関連付けられています。

## 要求フォーマット

account_info要求の例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
  "id": 2,
  "command": "account_info",
  "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
  "strict": true,
  "ledger_index": "current",
  "queue": true
}
```

*JSON-RPC*

```
{
    "method": "account_info",
    "params": [
        {
            "account": "rG1QQv2nh2gr7RCZ1P8YYcBUKCCN633jCn",
            "strict": true,
            "ledger_index": "current",
            "queue": true
        }
    ]
}
```

*コマンドライン*

```
#Syntax: account_info account [ledger_index|ledger_hash] [strict]
rippled account_info r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59 true
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](websocket-api-tool.html#account_info)

要求には以下のパラメーターが含まれます。

| `Field`        | 型                       | 説明                    |
|:---------------|:---------------------------|:-------------------------------|
| `account`      | 文字列                     | アカウントの一意のIDであり、最もよく使用されるのはアカウントの[アドレス][]です。 |
| `strict`       | ブール値                    | （省略可能、デフォルトはFalse）Trueに設定すると、`account`フィールドに指定できる項目は公開鍵またはXRP Ledgerアドレスのみになります。 |
| `ledger_hash`  | 文字列                     |  _（省略可能）_ 使用するレジャーバージョンの20バイトの16進文字列。（[レジャーの指定][]を参照してください。) |
| `ledger_index` | 文字列または符号なし整数 |  _（省略可能）_ 使用するレジャーのシーケンス番号、またはレジャーを自動的に選択するためのショートカット文字列。（[レジャーの指定][]を参照してください。) |
| `queue`        | ブール値                    |  _（省略可能）_ `true`にして[FeeEscalation Amendment][]を有効にすると、このアカウントに関連するキューに入れられたトランザクションについてのステータスも返されます。これを使用できるのは、現在開いているレジャーのデータを問い合わせる場合のみです。[新規: rippled 0.33.0][] |
| `signer_lists` | ブール値                    | _（省略可能）_`true`にして[MultiSign Amendment][]を有効にすると、このアカウントに関連するすべての[SignerListオブジェクト](signerlist.html)も返されます。[新規: rippled 0.31.0][] |

次のフィールドは廃止予定のため、指定しないでください。`ident`、`ledger`。

## 応答フォーマット

処理が成功した応答の例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
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

*JSON-RPC*

```
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

<!-- MULTICODE_BLOCK_END -->

応答は[標準フォーマット][]に従い、要求されたアカウントとそのデータ、アカウントの適用先レジャーが結果として表示されます。以下のフィールドが含まれます。

| `Field`                | 型    | 説明                               |
|:-----------------------|:--------|:------------------------------------------|
| `account_data`         | オブジェクト  | このアカウントの情報を含む[AccountRootレジャーオブジェクト](accountroot.html)がレジャーに保管されているとおりに表示されます。 |
| `signer_lists`         | 配列   | （要求に`signer_lists`が指定されていて、少なくとも1つのSignerListがアカウントに関連する場合を除いて省略されます。）[マルチ署名](multi-signing.html)用にアカウントに関連付けられた[SignerListレジャーオブジェクト](signerlist.html)の配列。アカウントが所有できるSignerListは最大1つであるため、この配列のメンバーは存在するとすれば、1メンバーのみです。[新規: rippled 0.31.0][] |
| `ledger_current_index` | 整数 | （`ledger_index`が代わりに指定されている場合は省略されます。）この情報を取得したときに使用されていた最新のレジャーのシーケンス番号。この情報には、これより新しいレジャーの変更は一切含まれません。 |
| `ledger_index`         | 整数 | （`ledger_current_index`が代わりに指定されている場合は省略されます。）この情報を取得したときに使用されていたレジャーのシーケンス番号。この情報には、これより新しいレジャーの変更は一切含まれません。 |
| `queue_data`           | オブジェクト  | （`queue`が`true`と指定され、現在開いているレジャーを問い合わせている場合を除いて省略されます。）このアカウントによって送信された[キューに入れられたトランザクション](transaction-cost.html#キューに入れられたトランザクション)についての情報。この情報にはローカル`rippled`サーバーの状態が示されますが、コンセンサスネットワーク内の他のサーバーとは異なる場合があります。示される値はキューイングメカニズムによって「大まかに」計算されるため、一部のフィールドは省略される場合があります。 |
| `validated`            | ブール値 | このデータが検証済みのレジャーバージョンのものである場合はTrueです。省略されているかFalseが設定されている場合、このデータは最終のものではありません。[新規: rippled 0.26.0][] |

`queue_data`パラメーターが存在する場合、以下のフィールドが含まれます。

| `Field`                 | 型    | 説明                              |
|:------------------------|:--------|:-----------------------------------------|
| `txn_count`             | 整数 | このアドレスからキューに入れられたトランザクションの数。 |
| `auth_change_queued`    | ブール値 | （省略される場合があります）キュー内のトランザクションがこのアドレスの[トランザクションの承認方法](transaction-basics.html#取引の承認)を変更するかどうかを示します。`true`の場合、トランザクションが実行されているかキューから除外されるまで、このアドレスはトランザクションをこれ以上キューに入れることができません。 |
| `lowest_sequence`       | 整数 | （省略される場合があります）このアドレスによってキューに入れられたトランザクションのうち最も低い[シーケンス番号][]。 |
| `highest_sequence`      | 整数 | （省略される場合があります）このアドレスによってキューに入れられたトランザクションのうち最も高い[シーケンス番号][]。 |
| `max_spend_drops_total` | 文字列  | （省略される場合があります）キュー内のすべてのトランザクションが利用可能なXRPを最大限消費する場合に、このアドレスから差し引くことができる[XRPのdrop数][]を示す整数の金額。 |
| `transactions`          | 配列   | （省略される場合があります）このアドレスからキューに入れられた各トランザクションについての情報。 |

`transactions`配列内の各オブジェクト（存在する場合）には、以下のフィールドのいずれかまたはすべてが含まれます。

| `Field`           | 型    | 説明                                    |
|:------------------|:--------|:-----------------------------------------------|
| `auth_change`     | ブール値 | このトランザクションがこのアドレスの[トランザクション承認の方法](transaction-basics.html#取引の承認)を変更するかどうかを示します。 |
| `fee`             | 文字列  | このトランザクションの[トランザクションコスト](transaction-cost.html)（[XRPのdrop数][]）。 |
| `fee_level`       | 文字列  | このタイプのトランザクションの最少コストと比較した、このトランザクションのトランザクションコスト（[手数料レベル][]）。 |
| `max_spend_drops` | 文字列  | このトランザクションで送信または消却できる[XRPのdrop数][]の最高額。 |
| `seq`             | 整数 | このトランザクションの[シーケンス番号][]。   |

## 考えられるエラー

* いずれかの[汎用エラータイプ][]。
* `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。例えば、要求で`queue`を`true`と指定したが、現在開いているレジャーではない`ledger_index`を指定した場合です。
* `actNotFound` - 要求の`account`フィールドに指定したアドレスが、レジャー内のアカウントに対応していません。
* `lgrNotFound` - `ledger_hash`または`ledger_index`で指定したレジャーが存在しないか、存在してはいるもののサーバーが保有していません。

[手数料レベル]: transaction-cost.html#手数料レベル
{% include '_snippets/rippled_versions.md' %}
{% include '_snippets/rippled-api-links.md' %}
