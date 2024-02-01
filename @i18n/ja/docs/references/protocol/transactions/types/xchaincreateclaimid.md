---
html: xchaincreateclaimid.html 
parent: transaction-types.html
seo:
    description: クロスチェーン送金に使用するクロスチェーン請求IDを作成します。
labels:
  - 相互運用性
status: not_enabled
---
# XChainCreateClaimID
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/protocol/impl/TxFormats.cpp#L399-L406 "ソース")

_（[XChainBridge Amendment][] {% not-enabled /%} が必要です）_

`XChainCreateClaimID`トランザクションはクロスチェーン送金に使われる新しいクロスチェーン請求IDを作成します。クロスチェーン請求IDは*1つの*クロスチェーン送金を表します。

このトランザクションはクロスチェーン送金の最初のステップであり、送金元チェーンではなく、送金先チェーンで送信されます。

また、送金元チェーン上の資金をロックまたはバーンする送金元チェーン上のアカウントも含まれます。


## XChainCreateClaimID JSONの例

```json
{
  "Account": "rahDmoXrtPdh7sUdrPjini3gcnTVYjbjjw",
  "OtherChainSource": "rMTi57fNy2UkUb4RcdoUeJm7gjxVQvxzUo",
  "TransactionType": "XChainCreateClaimID",
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


## XChainCreateClaimIDのフィールド

| フィールド           | JSONの型     | [内部の型][]    | 必須? | 説明 |
|:-------------------|:-------------|:--------------|:------|-----|
| `OtherChainSource` | 文字列        | Account       | はい  | 送信元チェーンで`XChainCommit`トランザクションを送信するアカウント。 |
| `SignatureReward`  | 文字列        | Account       | はい  | 署名を提供したWitnessサーバへの報酬額(XRP)。これは`Bridge`レジャーオブジェクトの金額と一致しなければなりません。 |
| `XChainBridge`     | XChainBridge | XChain_Bridge | はい  | 請求IDを作成するブリッジ。 |


### XChainBridgeのフィールド

| フィールド            | JSONの型 | [内部の型][] | 必須? | 説明 |
|:--------------------|:---------|:-----------|:------|:----|
| `IssuingChainDoor`  | 文字列    | Account    | はい  | 発行チェーンのドアアカウント。XRP-XRPブリッジの場合、これはジェネシスアカウント(ネットワークが最初に開始されたときに作成されるアカウントで、すべてのXRPを含む)でなければなりません。 |
| `IssuingChainIssue` | Issue    | Issue      | はい  | 発行チェーン上で作成され、バーンされる資産。IOU-IOUブリッジの場合、供給量の問題を避けるため、資産の発行者は発行チェーンのドアアカウントでなければなりません。 |
| `LockingChainDoor`  | 文字列    | Account    | はい  | ロックチェーンのドアアカウント。 |
| `LockingChainIssue` | Issue    | Issue      | はい  | ロックチェーンでロック、アンロックされる資産。 |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
