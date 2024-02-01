---
html: xchainaccountcreatecommit.html 
parent: transaction-types.html
seo:
    description: ブリッジが接続するチェーンの一つでアカウントを作成します。このアカウントがそのチェーンのブリッジの入り口となります。
labels:
  - 相互運用性
status: not_enabled
---
# XChainAccountCreateCommit
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/protocol/impl/TxFormats.cpp#L466-L474 "ソース")

_（[XChainBridge Amendment][] {% not-enabled /%} が必要です）_

このトランザクションはXRP-XRPブリッジにのみ使用できます。

`XChainAccountCreateCommit`トランザクションは、発行チェーンにトランザクションを送信するために、Witnessサーバ用の新しいアカウントを作成します。

**注意:** このトランザクションは、Witnessの証明書が送信先チェーンに確実に送信される場合にのみ実行されるべきです。署名が送信されない場合、証明書が受信されるまでアカウント作成はブロックされます。XRP-XRPブリッジでこのトランザクションを無効にするには、ブリッジの`MinAccountCreateAmount`フィールドを省略します。


## XChainAccountCreateCommit JSONの例

```json
{
  "Account": "rwEqJ2UaQHe7jihxGqmx6J4xdbGiiyMaGa",
  "Destination": "rD323VyRjgzzhY4bFpo44rmyh2neB5d8Mo",
  "TransactionType": "XChainAccountCreateCommit",
  "Amount": "20000000",
  "SignatureReward": "100",
  "XChainBridge": {
    "LockingChainDoor": "rMAXACCrp3Y8PpswXcg3bKggHX76V3F8M4",
    "LockingChainIssue": {
      "currency": "XRP"
    },
    "IssuingChainDoor": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
    "IssuingChainIssue": {
      "currency": "XRP"
    }
  }
}
```


## XChainAccountCreateCommitのフィールド

| フィールド          | JSONの型     | [内部の型][]   | 必須? | 説明 |
|:------------------|:-------------|:--------------|:-----| :-----------|
| `Amount`          | [通貨額][]    | Amount        | はい  | アカウント作成に使用するXRP単位の金額。これは`Bridge`レジャーオブジェクトで指定されている`MinAccountCreateAmount`以上でなければなりません。 |
| `Destination`     | 文字列        | Account       | はい  | 送信先チェーンの送信先アカウント。 |
| `SignatureReward` | [通貨額][]    | Amount        | いいえ | 署名を提供したWitnessサーバへの報酬として使用する金額。これは`Bridge`レジャーオブジェクトの金額と一致しなければなりません。 |
| `XChainBridge`    | XChainBridge | XChain_Bridge | はい  | アカウントを作成するブリッジ。 |


### XChainBridgeのフィールド

| フィールド            | JSONの型 | [内部の型][] | 必須? | 説明 |
|:--------------------|:---------|:-----------|:------|:----|
| `IssuingChainDoor`  | 文字列    | Account    | はい  | 発行チェーンのドアアカウント。XRP-XRPブリッジの場合、これはジェネシスアカウント(ネットワークが最初に開始されたときに作成されるアカウントで、すべてのXRPを含む)でなければなりません。 |
| `IssuingChainIssue` | Issue    | Issue      | はい  | 発行チェーン上で作成され、バーンされる資産。IOU-IOUブリッジの場合、供給量の問題を避けるため、資産の発行者は発行チェーンのドアアカウントでなければなりません。 |
| `LockingChainDoor`  | 文字列    | Account    | はい  | ロックチェーンのドアアカウント。 |
| `LockingChainIssue` | Issue    | Issue      | はい  | ロックチェーンでロック、アンロックされる資産。 |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
