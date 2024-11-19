---
html: xchainclaim.html 
parent: transaction-types.html
seo:
    description: 送信先チェーンで金額を請求することで、クロスチェーンでの価値移転を完了させます。
labels:
  - 相互運用性
status: not_enabled
---
# XChainClaim
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/protocol/impl/TxFormats.cpp#L418-L427 "ソース")

_（[XChainBridge Amendment][] {% not-enabled /%} が必要です）_

`XChainClaim`トランザクションはクロスチェーンでの価値の移転を完了させます。`XChainClaim`トランザクションにより、ユーザは送信元チェーンでロックされた価値と同等の価値を送信先チェーンで請求することができます。ユーザは、送金元チェーンでロックされた価値に関連付けられたクロスチェーン請求ID（`Account`フィールド）を所有している場合にのみ、その価値を請求することができます。ユーザは誰にでも資金を送ることができます(`Destination`フィールド)。このトランザクションが必要になるのは`XChainCommit`トランザクションで`OtherChainDestination`が指定されていない場合、または自動送金で何か問題が発生した場合のみです。

トランザクションによって送金に成功すると、対象の`XChainOwnedClaimID`レジャーオブジェクトは削除されます。これはトランザクションのリプレイを防ぎます。トランザクションが失敗した場合、`XChainOwnedClaimID`は削除されず、異なるパラメータでトランザクションを再実行できます。


## XChainClaim JSONの例

```json
{
  "Account": "rahDmoXrtPdh7sUdrPjini3gcnTVYjbjjw",
  "Amount": "10000",
  "TransactionType": "XChainClaim",
  "XChainClaimID": "13f",
  "Destination": "rahDmoXrtPdh7sUdrPjini3gcnTVYjbjjw",
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


## XChainClaimのフィールド

| フィールド                | JSONの型     | [内部の型][]    | 必須? | 説明 |
|:------------------------|:-------------|:--------------|:------|-----|
| `Amount`                | [通貨額][]    | Amount        | はい  | 送信先チェーンで請求する金額。これは、この`XChainClaimID`に関連付けられた証明書で証明された金額と一致しなければなりません。 |
| `Destination`           | 文字列        | Account       | はい  | 送信先チェーンの送信先アカウント。存在しなければトランザクションは失敗します。しかし、この場合トランザクションが失敗しても、シーケンス番号と収集された署名は破棄されないので、別の送信先でトランザクションを再実行することができます。 |
| `DestinationTag`        | 数値          | UInt32        | いいえ | 整数値の宛先タグ。 |
| `XChainBridge`          | XChainBridge | XChain_Bridge | はい  | 送金に使用するブリッジ。 |
| `XChainClaimID`         | 文字列        | UInt64        | はい  | 対応する`XChainCommit`トランザクションで参照されたクロスチェーン送金の一意な整数ID。 |


### XChainBridgeのフィールド

| フィールド            | JSONの型 | [内部の型][] | 必須? | 説明 |
|:--------------------|:---------|:-----------|:------|:----|
| `IssuingChainDoor`  | 文字列    | Account    | はい  | 発行チェーンのドアアカウント。XRP-XRPブリッジの場合、これはジェネシスアカウント(ネットワークが最初に開始されたときに作成されるアカウントで、すべてのXRPを含む)でなければなりません。 |
| `IssuingChainIssue` | Issue    | Issue      | はい  | 発行チェーン上で作成され、バーンされる資産。IOU-IOUブリッジの場合、供給量の問題を避けるため、資産の発行者は発行チェーンのドアアカウントでなければなりません。 |
| `LockingChainDoor`  | 文字列    | Account    | はい  | ロックチェーンのドアアカウント。 |
| `LockingChainIssue` | Issue    | Issue      | はい  | ロックチェーンでロック、アンロックされる資産。 |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
