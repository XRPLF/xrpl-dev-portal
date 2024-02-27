---
html: xchainownedcreateaccountclaimid.html
parent: ledger-entry-types.html
seo:
    description: XChainOwnedCreateAccountClaimIDレジャーオブジェクトは、クロスチェーン送金でアカウントを作成するための証明を収集するために使用されます。
labels:
  - 相互運用性
status: not_enabled
---
# XChainOwnedCreateAccountClaimID
_（[XChainBridge Amendment][] {% not-enabled /%} が必要です）_

[[ソース]](https://github.com/seelabs/rippled/blob/xbridge/src/ripple/protocol/impl/LedgerFormats.cpp#L296-L306 "ソース")

`XChainOwnedCreateAccountClaimID`レジャーオブジェクトは、クロスチェーン送金でアカウントを作成するための証明を収集するために使用されます。

`XChainAddAccountCreateAttestation`トランザクションが`XChainAccountCreateCommit`トランザクションを証明する署名を追加し、`XChainAccountCreateCount`が`Bridge`レジャーオブジェクトの現在の`XChainAccountClaimCount`以上である場合にアカウントが作成されます。

すべての証明を受け取り、新しいアカウントに資金が移動すると、レジャーオブジェクトは破棄されます。


## XChainOwnedCreateAccountClaimID JSONの例

```json
{
  "LedgerEntryType": "XChainOwnedCreateAccountClaimID",
  "LedgerIndex": "5A92F6ED33FDA68FB4B9FD140EA38C056CD2BA9673ECA5B4CEF40F2166BB6F0C",
  "Account": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
  "XChainAccountCreateCount": "66",
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
  "XChainCreateAccountAttestations": [
    {
      "XChainCreateAccountProofSig": {
        "Amount": "20000000",
        "AttestationRewardAccount": "rMtYb1vNdeMDpD9tA5qSFm8WXEBdEoKKVw",
        "AttestationSignerAccount": "rL8qTrAvZ8Q1o1H9H9Ahpj3xjgmRvFLvJ3",
        "Destination": "rBW1U7J9mEhEdk6dMHEFUjqQ7HW7WpaEMi",
        "PublicKey": "021F7CC4033EFBE5E8214B04D1BAAEC14808DC6C02F4ACE930A8EF0F5909B0C438",
        "SignatureReward": "100",
        "WasLockingChainSend": 1
      }
    }
  ]
}
```


## XChainOwnedCreateAccountClaimIDのフィールド

| フィールド                          | JSONの型     | [内部の型][]    | 必須? | 説明 |
|:----------------------------------|:-------------|:--------------|:------|:------------|
| `Account`                         | 文字列        | Account       | はい  | このオブジェクトを所有するアカウント。 |
| `LedgerIndex`                     | 文字列        | Hash256       | はい  | レジャーインデックスは、`XChainOwnedCreateAccountClaimID`の一意な接頭辞、`XChainAccountClaimCount`の実際の値、`XChainBridge`のフィールドのハッシュです。 |
| `XChainAccountCreateCount`        | 数値          | UInt64        | はい  | クロスチェーン送金で作成されたアカウントの実行順序を決める整数。小さい数字は大きい数字より先に実行されなければなりません。 |
| `XChainBridge`                    | XChainBridge | XChain_Bridge | はい  | このオブジェクトに紐づくブリッジのドアアカウントと資産。 |
| `XChainCreateAccountAttestations` | 配列          | Array         | はい  | Witnessサーバから収集された証明。これには、署名されたメッセージの再作成に必要なパラメータが含まれます。これには、その署名の量、どのチェーン（ロックまたは発行）、任意の宛先、報酬アカウントなどが含まれます。 |


### XChainCreateAccountAttestationsのフィールド

| フィールド                      | JSONの型   | [内部の型][] | 必須? | 説明 |
|-------------------------------|-----------|-------------|-------|-----|
| `XChainCreateAccountProofSig` | 配列       | Object      | はい  | Witnessサーバ1台からの証明書。 |
| `Amount`                      | [通貨額][] | Amount      | はい  | 送信先チェーンの`XChainAccountCreateCommit`トランザクションで請求する金額。 |
| `AttestationRewardAccount`    | 文字列     | Account     | はい  | 署名者に分配される`SignatureReward`を受け取るアカウント。 |
| `AttestationSignerAccount`    | 文字列     | Account     | はい  | ドアアカウントの署名者リストにある、トランザクションに署名するアカウント。 |
| `Destination`                 | 文字列     | Account     | はい  | 送金先チェーン上の資金の送金先アカウント。 |
| `PublicKey`                   | 文字列     | Blob        | はい  | 署名の検証に使用する公開鍵。 |
| `WasLockingChainSend`         | 数値       | UInt8       | はい  | イベントが発生したチェーンを表す真偽値。 |


### XChainBridgeのフィールド

| フィールド            | JSONの型 | [内部の型][] | 必須? | 説明 |
|:--------------------|:---------|:-----------|:------|:----------------|
| `IssuingChainDoor`  | 文字列    | Account    | はい  | 発行チェーンのドアアカウント。XRP-XRPブリッジの場合、これはジェネシスアカウント(ネットワークが最初に開始されたときに作成されるアカウントで、すべてのXRPを含む)でなければなりません。 |
| `IssuingChainIssue` | Issue    | Issue      | はい  | 発行チェーン上で作成され、バーンされる資産。IOU-IOUブリッジの場合、供給問題を避けるため、資産の発行者は発行チェーンのドアアカウントでなければなりません。 |
| `LockingChainDoor`  | 文字列    | Account    | はい  | ロックチェーンのドアアカウント。 |
| `LockingChainIssue` | Issue    | Issue      | はい  | ロックチェーンでロック、アンロックされる資産。 |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
