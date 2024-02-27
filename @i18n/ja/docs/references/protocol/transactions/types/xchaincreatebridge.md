---
html: xchaincreatebridge.html 
parent: transaction-types.html
seo:
    description: 2つのチェーン間にブリッジを作成します。
labels:
  - 相互運用性
status: not_enabled
---
# XChainCreateBridge
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/protocol/impl/TxFormats.cpp#L381-L388 "ソース")

_（[XChainBridge Amendment][] {% not-enabled /%} が必要です）_

`XChainCreateBridge`トランザクションは新しい`Bridge`レジャーオブジェクトを作成し、トランザクショ ンが送信されたチェーン上に新しいクロスチェーンブリッジの入り口を定義します。これにはブリッジのドアアカウントと資産に関する情報が含まれます。

このトランザクションは、ロックチェーンのドアアカウントが最初に送信する必要があります。有効なブリッジをセットアップするには、Witnessサーバのセットアップに加えて、両チェーンのドアアカウントがこのトランザクションを送信しなければなりません。

完全な本番環境のセットアップには、Witnessの署名鍵用に2つのドアアカウントで`SignerListSet`トランザクションを実行することと、ドアアカウントのマスターキーを無効にすることも含まれます。これにより、Witnessサーバが資金を完全に管理できるようになります。

**注記:** 各ドアアカウントは1つのブリッジしか持つことができません。これにより、同じ資産に対して複数のブリッジが作成され、いずれかのチェーンで資産が不一致となるのを防ぐことができます。


## XChainCreateBridge JSONの例

```json
{
  "TransactionType": "XChainCreateBridge",
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


## XChainCreateBridgeのフィールド

| フィールド                 | JSONの型      | [内部の型][]   | 必須? | 説明 |
|:-------------------------|:-------------|:--------------|:----------|:------------|
| `MinAccountCreateAmount` | [通貨額][]    | Amount        | いいえ | `XChainAccountCreateCommit`トランザクションに必要な最小金額。このフィールドが存在しない場合、`XChainAccountCreateCommit`トランザクションは失敗します。このフィールドはXRP-XRPブリッジにのみ存在できます。 |
| `SignatureReward`        | [通貨額][]    | Amount        | はい  | Witnessサーバに支払う署名の報酬の合計額。この金額は署名者の間で分配されます。|
| `XChainBridge`           | XChainBridge | XChain_Bridge | はい  | 作成するブリッジ(ドアアカウントと資産)。 |


### XChainBridgeのフィールド

| フィールド            | JSONの型 | [内部の型][] | 必須? | 説明 |
|:--------------------|:---------|:-----------|:------|:----|
| `IssuingChainDoor`  | 文字列    | Account    | はい  | 発行チェーンのドアアカウント。XRP-XRPブリッジの場合、これはジェネシスアカウント(ネットワークが最初に開始されたときに作成されるアカウントで、すべてのXRPを含む)でなければなりません。 |
| `IssuingChainIssue` | Issue    | Issue      | はい  | 発行チェーン上で作成され、バーンされる資産。IOU-IOUブリッジの場合、供給量の問題を避けるため、資産の発行者は発行チェーンのドアアカウントでなければなりません。 |
| `LockingChainDoor`  | 文字列    | Account    | はい  | ロックチェーンのドアアカウント。 |
| `LockingChainIssue` | Issue    | Issue      | はい  | ロックチェーンでロック、アンロックされる資産。 |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
