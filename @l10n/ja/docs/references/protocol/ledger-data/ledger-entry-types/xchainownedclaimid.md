---
html: xchainownedclaimid.html
parent: ledger-entry-types.html
seo:
    description: XChainOwnedClaimIDオブジェクトは、クロスチェーンでの価値の移動の*1つ*を表します。
labels:
  - 相互運用性
status: not_enabled
---
# XChainOwnedClaimID
_（[XChainBridge Amendment][] {% not-enabled /%} が必要です）_

[[ソース]](https://github.com/seelabs/rippled/blob/xbridge/src/ripple/protocol/impl/LedgerFormats.cpp#L281-L293 "ソース")

`XChainOwnedClaimID`オブジェクトはクロスチェーンでの価値の移転の*1つ*を表し、送金元チェーン上の資金をロックまたはバーンする送金元チェーン上のアカウントの情報を含みます。

`XChainOwnedClaimID`オブジェクトは送信元チェーンで`XChainCommit`を送信する前に送信先チェーンで取得する必要があります。このオブジェクトの目的はトランザクションのリプレイ攻撃を防ぐことであり、Witnessサーバから証明書を収集する場所としても使用されます。

`XChainCreateClaimID`トランザクションは新しい`XChainOwnedClaimID`を作成するために使われます。このレジャーオブジェクトは、資金が送金先のチェーンで請求に成功すると削除されます。


## XChainOwnedClaimID JSONの例

```json
{
  "Account": "rBW1U7J9mEhEdk6dMHEFUjqQ7HW7WpaEMi",
  "Flags": 0,
  "OtherChainSource": "r9oXrvBX5aDoyMGkoYvzazxDhYoWFUjz8p",
  "OwnerNode": "0",
  "PreviousTxnID": "1CFD80E9CF232B8EED62A52857DE97438D12230C06496932A81DEFA6E66070A6",
  "PreviousTxnLgrSeq": 58673,
  "SignatureReward": "100",
  "XChainBridge": {
    "IssuingChainDoor": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
    "IssuingChainIssue": {
      "currency": "XRP"
    },
    "LockingChainDoor": "rMAXACCrp3Y8PpswXcg3bKggHX76V3F8M4",
    "LockingChainIssue": {
      "currency": "XRP"
    }
  },
  "XChainClaimAttestations": [
    {
      "XChainClaimProofSig": {
        "Amount": "1000000",
        "AttestationRewardAccount": "rfgjrgEJGDxfUY2U8VEDs7BnB1jiH3ofu6",
        "AttestationSignerAccount": "rfsxNxZ6xB1nTPhTMwQajNnkCxWG8B714n",
        "Destination": "rBW1U7J9mEhEdk6dMHEFUjqQ7HW7WpaEMi",
        "PublicKey": "025CA526EF20567A50FEC504589F949E0E3401C13EF76DD5FD1CC2850FA485BD7B",
        "WasLockingChainSend": 1
      }
    },
    {
      "XChainClaimProofSig": {
        "Amount": "1000000",
        "AttestationRewardAccount": "rUUL1tP523M8KimERqVS7sxb1tLLmpndyv",
        "AttestationSignerAccount": "rEg5sHxZVTNwRL3BAdMwJatkmWDzHMmzDF",
        "Destination": "rBW1U7J9mEhEdk6dMHEFUjqQ7HW7WpaEMi",
        "PublicKey": "03D40434A6843638681E2F215310EBC4131AFB12EA85985DA073183B732525F7C9",
        "WasLockingChainSend": 1
      },
    }
  ],
  "XChainClaimID": "b5",
  "LedgerEntryType": "XChainOwnedClaimID",
  "LedgerIndex": "20B136D7BF6D2E3D610E28E3E6BE09F5C8F4F0241BBF6E2D072AE1BACB1388F5"
}
```


## XChainOwnedClaimIDのフィールド

| フィールド                  | JSONの型     | [内部の型][]    | 必須? | 説明 |
|:--------------------------|:-------------|:--------------|:-----|:----|
| `Account`                 | 文字列        | Account       | はい  | このオブジェクトを所有するアカウント。 |
| `LedgerIndex`             | 文字列        | Hash256       | はい  | レジャーインデックスは、`XChainOwnedClaimID`の一意な接頭辞、`XChainClaimID`の実際の値、`XChainBridge`のフィールドのハッシュです。 |
| `OtherChainSource`        | 文字列        | Account       | はい  | 送信元チェーンで対応する`XChainCommit`を送信する必要があるアカウント。つまり、`OtherChainSource`が指定されていないと、別のアカウントが別の送信先を指定して資金を盗もうとする可能性があるということです。また、どのアカウントが`XChainCommit`トランザクションを送信するのかが分かるので、単一の署名セットのみを追跡することもできます。 |
| `SignatureReward`         | [通貨額][]    | Amount        | はい  | Witnessサーバに支払う署名報酬の合計額。`Bridge`レジャー帳オブジェクトの`SignatureReward`の値以上でなければなりません。 |
| `XChainBridge`            | XChainBridge | XChain_Bridge | はい  | このオブジェクトに紐づくブリッジのドアアカウントと資産。 |
| `XChainClaimAttestations` | 配列          | Array         | はい  | Witnessサーバから収集された証明。これには、署名されたメッセージの再作成に必要なパラメータが含まれます。これには、その署名の量、どのチェーン（ロックまたは発行）、任意の宛先、報酬アカウントなどが含まれます。 |
| `XChainClaimID`           | 文字列        | UInt64        | はい  | クロスチェーン送金の一意のシーケンス番号。 |


### XChainClaimAttestationsのフィールド

| フィールド                      | JSONの型  | [内部の型][] | 必須? | 説明 |
|:------------------------------|:----------|:-----------|:------|:----|
| `XChainClaimProofSig`         | 配列       | Object     | はい  | Witnessサーバ1台からの証明書。 |
| `Amount`                      | [通貨額][] | Amount     | はい  | 送信先チェーンの`XChainCommit`トランザクションで請求する金額。 |
| `AttestationRewardAccount`    | 文字列     | Account    | はい  | 署名者に分配される`SignatureReward`を受け取るアカウント。 |
| `AttestationSignerAccount`    | 文字列     | Account    | はい  | ドアアカウントの署名者リストにある、トランザクションに署名するアカウント。 |
| `Destination`                 | 文字列     | Account    | いいえ | 送金先チェーン上の資金の送金先アカウント。 |
| `PublicKey`                   | 文字列     | Blob       | はい  | 署名の検証に使用する公開鍵。 |
| `WasLockingChainSend`         | 数値       | UInt8      | はい  | イベントが発生したチェーンを表す真偽値。 |


### XChainBridgeのフィールド

| フィールド            | JSONの型 | [内部の型][] | 必須? | 説明 |
|:--------------------|:---------|:-----------|:------|:----------------|
| `IssuingChainDoor`  | 文字列    | Account    | はい  | 発行チェーンのドアアカウント。XRP-XRPブリッジの場合、これはジェネシスアカウント(ネットワークが最初に開始されたときに作成されるアカウントで、すべてのXRPを含む)でなければなりません。 |
| `IssuingChainIssue` | Issue    | Issue      | はい  | 発行チェーン上で作成され、バーンされる資産。IOU-IOUブリッジの場合、供給問題を避けるため、資産の発行者は発行チェーンのドアアカウントでなければなりません。 |
| `LockingChainDoor`  | 文字列    | Account    | はい  | ロックチェーンのドアアカウント。 |
| `LockingChainIssue` | Issue    | Issue      | はい  | ロックチェーンでロック、アンロックされる資産。 |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
