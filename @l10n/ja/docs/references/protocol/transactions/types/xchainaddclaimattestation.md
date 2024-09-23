---
html: xchainaddclaimattestation.html 
parent: transaction-types.html
seo:
    description: 送信元チェーンで発生したイベントを、送信先チェーンに証明(アテスト)します。
labels:
  - 相互運用性
status: not_enabled
---
# XChainAddClaimAttestation
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/protocol/impl/TxFormats.cpp#L429-L445 "ソース")

_（[XChainBridge Amendment][] {% not-enabled /%} が必要です）_

`XChainAddClaimAttestation`トランザクションは`XChainCommit`トランザクションを証明するWitnessサーバの署名を提供します。

この署名は、署名が提出された時点のドアの署名者リストにある鍵の一つでなければなりません。ただし、署名が提出されてから定足数に達するまでの間に署名者リストが変更された場合は、新しい署名セットが使用され、現在収集されている署名の一部が削除されることがあります。

どのアカウントでも署名を提出できます。

**注記:** 報酬は現在のリストにある鍵を持っているアカウントにのみ送られます。署名者の定足数は`SignatureReward`に一致する必要があります。より大きな報酬を得ようとして、一つのWitnessサーバがこの値に不正な値を指定することはできません。


## XChainAddClaimAttestation JSONの例

```json
{
  "TransactionType": "XChainAddClaimAttestation",
  "Account": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
  "XChainAttestationBatch": {
    "XChainBridge": {
      "IssuingChainDoor": "rKeSSvHvaMZJp9ykaxutVwkhZgWuWMLnQt",
      "IssuingChainIssue": {
        "currency": "XRP"
      },
      "LockingChainDoor": "rJvExveLEL4jNDEeLKCVdxaSCN9cEBnEQC",
      "LockingChainIssue": {
        "currency": "XRP"
      }
    },
    "XChainClaimAttestationBatch" : [
      {
        "XChainClaimAttestationBatchElement" : {
          "Account" : "rnJmYAiqEVngtnb5ckRroXLtCbWC7CRUBx",
          "Amount" : "100000000",
          "AttestationSignerAccount" : "rnJmYAiqEVngtnb5ckRroXLtCbWC7CRUBx",
          "Destination" : "r9A8UyNpW3X46FUc6P7JZqgn6WgAPjBwPg",
          "PublicKey" : "03DAB289CA36FF377F3F4304C7A7203FDE5EDCBFC209F430F6A4355361425526D0",
          "Signature" : "616263",
          "WasLockingChainSend" : 1,
          "XChainClaimID" : "0000000000000000"
        }
      }
    ],
    "XChainCreateAccountAttestationBatch": [
      {
        "XChainCreateAccountAttestationBatchElement": {
          "Account": "rnJmYAiqEVngtnb5ckRroXLtCbWC7CRUBx",
          "Amount": "1000000000",
          "AttestationSignerAccount": "rEziJZmeZzsJvGVUmpUTey7qxQLKYxaK9f",
          "Destination": "rKT9gDkaedAosiHyHZTjyZs2HvXpzuiGmC",
          "PublicKey": "03ADB44CA8E56F78A0096825E5667C450ABD5C24C34E027BC1AAF7E5BD114CB5B5",
          "Signature": "3044022036C8B90F85E8073C465F00625248A72D4714600F98EBBADBAD3B7ED226109A3A02204C5A0AE12D169CF790F66541F3DB59C289E0D9CA7511FDFE352BB601F667A26",
          "SignatureReward": "1000000",
          "WasLockingChainSend": 1,
          "XChainAccountCreateCount": "0000000000000001"
        }
      }
    ]
  }
}
```


## XChainAddClaimAttestationのフィールド

| フィールド                   | JSONの型     | [内部の型][]    | 必須? | 説明 |
|:---------------------------|:-------------|:--------------|:------|-----|
| `Amount`                   | [通貨額][]    | Amount        | はい  | `XChainCommit`トランザクションが送信元チェーンでCommitした金額。 |
| `AttestationRewardAccount` | 文字列        | Account       | はい  | この署名者の`SignatureReward`を受け取るアカウント。 |
| `AttestationSignerAccount` | 文字列        | Account       | はい  | ドアアカウントの署名者リストにある、トランザクションに署名したアカウント。 |
| `Destination`              | 文字列        | Account       | いいえ | 送信先チェーン上の資金の送金先アカウント。 (`XChainCommit` トランザクションから取得)。 |
| `OtherChainSource`         | 文字列        | Account       | はい  | 証明に紐づくイベントをトリガーした`XChainCommit`トランザクションを送信した送信元チェーン上のアカウント。 |
| `PublicKey`                | 文字列        | Blob          | はい  | 署名の検証に使用する公開鍵。 |
| `Signature`                | 文字列        | Blob          | はい  | もう一方のチェーン上のイベントを証明する署名。 |
| `WasLockingChainSend`      | 数値          | UInt8         | はい  | イベントが発生したチェーンを表す真偽値。 |
| `XChainBridge`             | XChainBridge | XChain_Bridge | はい  | 資金の移動に使用するブリッジ。 |
| `XChainClaimID`            | 文字列        | UInt64        | はい  | `XChainCommit` トランザクションに含まれる、送金に紐づく`XChainClaimID`。 |


### XChainBridgeのフィールド

| フィールド            | JSONの型 | [内部の型][] | 必須? | 説明 |
|:--------------------|:---------|:-----------|:------|:----|
| `IssuingChainDoor`  | 文字列    | Account    | はい  | 発行チェーンのドアアカウント。XRP-XRPブリッジの場合、これはジェネシスアカウント(ネットワークが最初に開始されたときに作成されるアカウントで、すべてのXRPを含む)でなければなりません。 |
| `IssuingChainIssue` | Issue    | Issue      | はい  | 発行チェーン上で作成され、バーンされる資産。IOU-IOUブリッジの場合、供給量の問題を避けるため、資産の発行者は発行チェーンのドアアカウントでなければなりません。 |
| `LockingChainDoor`  | 文字列    | Account    | はい  | ロックチェーンのドアアカウント。 |
| `LockingChainIssue` | Issue    | Issue      | はい  | ロックチェーンでロック、アンロックされる資産。 |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
