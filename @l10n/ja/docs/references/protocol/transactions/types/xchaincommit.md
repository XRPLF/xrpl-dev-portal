---
html: xchaincommit.html 
parent: transaction-types.html
seo:
    description: クロスチェーンでの価値移転を開始します。
labels:
  - 相互運用性
status: not_enabled
---
# XChainCommit
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/protocol/impl/TxFormats.cpp#L408-L416 "ソース")

_（[XChainBridge Amendment][] {% not-enabled /%} が必要です）_

`XChainCommit`はクロスチェーン送金の2番目のステップです。`XChainCommit`は発行チェーンでラップできるようにロックチェーンで資産を保管したり、ロックチェーンで返却できるように発行チェーンでラップされた資産をバーンしたりします。


## XChainCommit JSONの例

```json
{
  "Account": "rMTi57fNy2UkUb4RcdoUeJm7gjxVQvxzUo",
  "TransactionType": "XChainCommit",
  "XChainBridge": {
    "LockingChainDoor": "rMAXACCrp3Y8PpswXcg3bKggHX76V3F8M4",
    "LockingChainIssue": {
      "currency": "XRP"
    },
    "IssuingChainDoor": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
    "IssuingChainIssue": {
      "currency": "XRP"
    }
  },
  "Amount": "10000",
  "XChainClaimID": "13f"
}
```


## XChainCommitのフィールド

| フィールド                | JSONの型     | [内部の型][]    | 必須? | 説明 |
|:------------------------|:-------------|:--------------|:------|-----|
| `Amount`                | [通貨額][]    | Amount        | はい  | コミットする資産と数量。これはドアアカウントの`LockingChainIssue`(ロックチェーン上の場合)または`IssuingChainIssue`(発行チェーン上の場合)と一致しなければなりません。 |
| `OtherChainDestination` | 文字列        | Account       | いいえ | 送信先チェーンの送信先アカウント。これが指定されていない場合、`XChainCreateClaimID`トランザクションを送信したアカウントは、資金を請求するために`XChainClaim`トランザクションを送信する必要があります。 |
| `XChainBridge`          | XChainBridge | XChain_Bridge | はい  | 送金に使用するブリッジ。 |
| `XChainClaimID`         | 文字列        | UInt64        | はい  | クロスチェーン送金の一意な整数ID。これは送信先のチェーンで(`XChainCreateClaimID`トランザクションによって)取得し、このトランザクションを送信する前に検証済みのレジャーからチェックする必要があります。不正なシーケンス番号が指定された場合、資金は失われます。 |


### XChainBridgeのフィールド

| フィールド            | JSONの型 | [内部の型][] | 必須? | 説明 |
|:--------------------|:---------|:-----------|:------|:----|
| `IssuingChainDoor`  | 文字列    | Account    | はい  | 発行チェーンのドアアカウント。XRP-XRPブリッジの場合、これはジェネシスアカウント(ネットワークが最初に開始されたときに作成されるアカウントで、すべてのXRPを含む)でなければなりません。 |
| `IssuingChainIssue` | Issue    | Issue      | はい  | 発行チェーン上で作成され、バーンされる資産。IOU-IOUブリッジの場合、供給量の問題を避けるため、資産の発行者は発行チェーンのドアアカウントでなければなりません。 |
| `LockingChainDoor`  | 文字列    | Account    | はい  | ロックチェーンのドアアカウント。 |
| `LockingChainIssue` | Issue    | Issue      | はい  | ロックチェーンでロック、アンロックされる資産。 |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
