---
html: xchainmodifybridge.html 
parent: transaction-types.html
seo:
    description: ブリッジの設定を変更します。
labels:
  - 相互運用性
status: not_enabled
---
# XChainModifyBridge
[[ソース]](https://github.com/XRPLF/rippled/blob/develop/src/ripple/protocol/impl/TxFormats.cpp#L390-L397 "ソース")

_（[XChainBridge Amendment][] {% not-enabled /%} が必要です）_

`XChainModifyBridge`トランザクションでは、ブリッジ管理者がブリッジの設定を変更することができます。変更できるのは`SignatureReward`と`MinAccountCreateAmount`だけです。

このトランザクションはドアアカウントから送信される必要があり、Witnessサーバを管理するエンティティがこのトランザクションのために協調し、署名を提供する必要があります。この調整はレジャーの外部で行われます。

**注記:** このトランザクションでブリッジの署名者リストを変更することはできません。署名者リストはドアアカウント自体にあり、署名者リストがアカウント上で変更されるのと同じ方法で変更されます（`SignerListSet`トランザクションを利用）。


## XChainModifyBridge JSONの例

```json
{
  "TransactionType": "XChainModifyBridge",
  "Account": "rhWQzvdmhf5vFS35vtKUSUwNZHGT53qQsg",
  "XChainBridge": {
    "LockingChainDoor": "rhWQzvdmhf5vFS35vtKUSUwNZHGT53qQsg",
    "LockingChainIssue": {
      "currency": "XRP"
    },
    "IssuingChainDoor": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
    "IssuingChainIssue": {
      "currency": "XRP"
    }
  },
  "SignatureReward": 200,
  "MinAccountCreateAmount": 1000000
}
```


## XChainModifyBridgeのフィールド

| フィールド                 | JSONの型     | [内部の型][]    | 必須? | 説明 |
|:-------------------------|:-------------|:-------- -----|:------|-----|
| `Flags`                  | 数値          | UInt32       | はい  | このトランザクションのフラグを指定します。 |
| `MinAccountCreateAmount` | [通貨額][]    | Amount        | いいえ | `XChainAccountCreateCommit`トランザクションに必要な最小金額。このフィールドが存在しない場合、`XChainAccountCreateCommit`トランザクションは失敗します。このフィールドはXRP-XRPブリッジにのみ存在できます。 |
| `SignatureReward`        | [通貨額][]    | Amount        | いいえ | Witnessサーバに支払う署名の報酬の合計額。この金額は署名者の間で分配されます。 |
| `XChainBridge`           | XChainBridge | XChain_Bridge | はい  | 変更するブリッジ。 |


### XChainBridgeのフィールド

| フィールド            | JSONの型 | [内部の型][] | 必須? | 説明 |
|:--------------------|:---------|:-----------|:------|:----|
| `IssuingChainDoor`  | 文字列    | Account    | はい  | 発行チェーンのドアアカウント。XRP-XRPブリッジの場合、これはジェネシスアカウント(ネットワークが最初に開始されたときに作成されるアカウントで、すべてのXRPを含む)でなければなりません。 |
| `IssuingChainIssue` | Issue    | Issue      | はい  | 発行チェーン上で作成され、バーンされる資産。IOU-IOUブリッジの場合、供給量の問題を避けるため、資産の発行者は発行チェーンのドアアカウントでなければなりません。 |
| `LockingChainDoor`  | 文字列    | Account    | はい  | ロックチェーンのドアアカウント。 |
| `LockingChainIssue` | Issue    | Issue      | はい  | ロックチェーンでロック、アンロックされる資産。 |


## トランザクションのフラグ

すべてのトランザクションで利用可能なグローバルフラグに加えて、このフラグを指定することができます。

| フラグ名                      | フラグ値       | 説明 |
|------------------------------|--------------|------|
| `tfClearAccountCreateAmount` | `0x00010000` | ブリッジの`MinAccountCreateAmount` 削除します。 |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
