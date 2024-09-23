---
html: xchainaddaccountcreateattestation.html
parent: transaction-types.html
seo:
    description: XChainAddAccountCreateAttestationトランザクションは他のチェーンでXChainAccountCreateCommitトランザクションが発生した証明をWitnessサーバから提示します。
labels:
  - 相互運用性
status: not_enabled
---
# XChainAddAccountCreateAttestation
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/protocol/impl/TxFormats.cpp#L447-L464 "ソース")

_（[XChainBridge Amendment][] {% not-enabled /%} が必要です）_

`XChainAddAccountCreateAttestation`トランザクションは、`XChainAccountCreateCommit`トランザクションがもう一方のチェーンで発生したというWitnessサーバからの証明を提示します。

この署名は署名が提供された時点のドアの署名者リストにある鍵の一つでなければなりません。署名が提出されてから定足数に達するまでの間に署名者リストが変更された場合、新しい署名セットが使用され、現在収集されている署名の一部が削除される可能性があります。

どのアカウントでも署名を提出することができます。

**注記:** 報酬は現在のリストにある鍵を持っているアカウントにのみ送られます。署名者の定足数は`SignatureReward`に一致する必要があります。より大きな報酬を得ようとして、一つのWitnessサーバがこの値に不正な値を指定することはできません。


## XChainAddAccountCreateAttestation JSONの例

```json
{
  "Account": "rDr5okqGKmMpn44Bbhe5WAfDQx8e9XquEv",
  "TransactionType": "XChainAddAccountCreateAttestation",
  "OtherChainSource": "rUzB7yg1LcFa7m3q1hfrjr5w53vcWzNh3U",
  "Destination": "rJMfWNVbyjcCtds8kpoEjEbYQ41J5B6MUd",
  "Amount": "2000000000",
  "PublicKey": "EDF7C3F9C80C102AF6D241752B37356E91ED454F26A35C567CF6F8477960F66614",
  "Signature": "F95675BA8FDA21030DE1B687937A79E8491CE51832D6BEEBC071484FA5AF5B8A0E9AFF11A4AA46F09ECFFB04C6A8DAE8284AF3ED8128C7D0046D842448478500",
  "WasLockingChainSend": 1,
  "AttestationRewardAccount": "rpFp36UHW6FpEcZjZqq5jSJWY6UCj3k4Es",
  "AttestationSignerAccount": "rpWLegmW9WrFBzHUj7brhQNZzrxgLj9oxw",
  "XChainAccountCreateCount": "2",
  "SignatureReward": "204",
  "XChainBridge": {
    "LockingChainDoor": "r3nCVTbZGGYoWvZ58BcxDmiMUU7ChMa1eC",
    "LockingChainIssue": {
      "currency": "XRP"
    },
    "IssuingChainDoor": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
    "IssuingChainIssue": {
      "currency": "XRP"
    }
  },
  "Fee": "20"
}
```


## XChainAddAccountCreateAttestationのフィールド

| フィールド                   | JSONの型     | [内部の型][]    | 必須? | 説明 |
|:---------------------------|:-------------|:--------------|:------|:----|
| `Amount`                   | [通貨額][]    | Amount        | はい  | `XChainAccountCreateCommit`トランザクションが送信元チェーンでCommitした金額。 |
| `AttestationRewardAccount` | 文字列        | Account       | はい  | この署名者の`SignatureReward`を受け取るアカウント。 |
| `AttestationSignerAccount` | 文字列        | Account       | はい  | ドアアカウントの署名者リストにある、トランザクションに署名したアカウント。 |
| `Destination`              | 文字列        | Account       | はい  | 送信先チェーン上の資金の送金先アカウント。 |
| `OtherChainSource`         | 文字列        | Account       | はい  | 証明に紐づくイベントをトリガーした`XChainAccountCreateCommit`トランザクションを送信した送信元チェーン上のアカウント。 |
| `PublicKey`                | 文字列        | Blob          | はい  | 署名の検証に使用する公開鍵。 |
| `Signature`                | 文字列        | Blob          | はい  | もう一方のチェーン上のイベントを証明する署名。 |
| `SignatureReward`          | [通貨額][]    | Amount        | はい  | `XChainAccountCreateCommit`トランザクションで支払われた署名の報酬。 |
| `WasLockingChainSend`      | 数値         | UInt8          | はい  | イベントが発生したチェーンを表す真偽値。 |
| `XChainAccountCreateCount` | 文字列        | UInt64        | はい  | 請求(Claim)が処理される順序を表すカウンタ。 |
| `XChainBridge`             | XChainBridge | XChain_Bridge | はい  | 証明に紐づくブリッジ。 |


### XChainBridgeのフィールド

| フィールド            | JSONの型 | [内部の型][] | 必須? | 説明 |
|:--------------------|:---------|:-----------|:------|:----|
| `IssuingChainDoor`  | 文字列    | Account    | はい  | 発行チェーンのドアアカウント。XRP-XRPブリッジの場合、これはジェネシスアカウント(ネットワークが最初に開始されたときに作成されるアカウントで、すべてのXRPを含む)でなければなりません。 |
| `IssuingChainIssue` | Issue    | Issue      | はい  | 発行チェーン上で作成され、バーンされる資産。IOU-IOUブリッジの場合、供給量の問題を避けるため、資産の発行者は発行チェーンのドアアカウントでなければなりません。 |
| `LockingChainDoor`  | 文字列    | Account    | はい  | ロックチェーンのドアアカウント。 |
| `LockingChainIssue` | Issue    | Issue      | はい  | ロックチェーンでロック、アンロックされる資産。 |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
