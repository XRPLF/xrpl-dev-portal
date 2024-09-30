---
html: bridge.html
parent: ledger-entry-types.html
seo:
    description: Bridgeオブジェクトは、2つのブロックチェーンを接続し、価値の移動を効率的に行うための1つのクロスチェーンブリッジを表します。
labels:
  - 相互運用性
status: not_enabled
---
# Bridge
_（[XChainBridge Amendment][] {% not-enabled /%} が必要です）_

[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/protocol/impl/LedgerFormats.cpp#L286-L300 "ソース")

`Bridge`レジャーエントリは、XRP Ledgerをサイドチェーンなどの別のブロックチェーンと接続し、XRPやその他のトークン(IOU)の形で2つのブロックチェーン間を効率的に移動することを可能にする、1つのクロスチェーンブリッジを表します。


## Bridge JSONの例

```json
{
  "Account": "r3nCVTbZGGYoWvZ58BcxDmiMUU7ChMa1eC",
  "Flags": 0,
  "LedgerEntryType": "Bridge",
  "MinAccountCreateAmount": "2000000000",
  "OwnerNode": "0",
  "PreviousTxnID": "67A8A1B36C1B97BE3AAB6B19CB3A3069034877DE917FD1A71919EAE7548E5636",
  "PreviousTxnLgrSeq": 102,
  "SignatureReward": "204",
  "XChainAccountClaimCount": "0",
  "XChainAccountCreateCount": "0",
  "XChainBridge": {
    "IssuingChainDoor": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
    "IssuingChainIssue": {
      "currency": "XRP"
    },
    "LockingChainDoor": "r3nCVTbZGGYoWvZ58BcxDmiMUU7ChMa1eC",
    "LockingChainIssue": {
      "currency": "XRP"
    }
  },
  "XChainClaimID": "1",
  "index": "9F2C9E23343852036AFD323025A8506018ABF9D4DBAA746D61BF1CFB5C297D10"
}
```


## Bridgeのフィールド

[共通フィールド](../common-fields.md)に加えて、{% code-page-name /%}エントリは次のフィールドを持ちます。

| フィールド                   | JSONの型     | 内部の型       | 必須?  | 説明 |
|:---------------------------|:-------------|:--------------|:------|:----|
| `Account`                  | 文字列        | Account       | はい   | ブロックチェーン上で`XChainCreateBridge`トランザクションを送信したアカウント。 |
| `MinAccountCreateAmount`   | [通貨額][]    | Amount        | いいえ | `XChainAccountCreateCommit`トランザクションに必要な最小金額。これが存在しない場合、`XChainAccountCreateCommit`トランザクションは失敗します。このフィールドはXRP-XRPブリッジにのみ存在できます。 |
| `SignatureReward`          | [通貨額][]    | Amount        | はい   | クロスチェーン送金のために署名を提供した場合、またはクロスチェーン報酬のために署名を提供した場合に支払われる報酬の合計額(XRP単位)。この金額は署名者の間で分配されます。 |
| `XChainAccountClaimCount`  | 数値          | UInt64        | はい   | アカウント作成トランザクションの実行順序を決めるために使用されるカウンタ。`XChainAccountCreateCommit`トランザクションが送信先チェーンで"claim"されるたびにインクリメントされます。「請求(claim)」トランザクションが宛先チェーンで実行されると、`XChainAccountClaimCount`は`XChainAccountClaimCount`が送信元チェーンで実行された時の`XChainAccountCreateCount`の値と一致しなければなりません。これにより、`XChainAccountCreateCommit`トランザクションが送信元チェーンで実行されたのと同じ順序で請求が実行されるようになり、トランザクションのリプレイを防ぐことができます。 |
| `XChainAccountCreateCount` | 数値          | UInt64        | はい   | アカウント作成トランザクションの実行順序を決めるために使用されるカウンタ。XChainAccountCreateCommit`トランザクションが実行される度にインクリメントされます。 |
| `XChainBridge`             | XChainBridge | XChain_Bridge | はい   | このオブジェクトが関連するブリッジのドアアカウントと資産。 |
| `XChainClaimID`            | 数値          | UInt64        | はい   | 次に作成される`XChainClaimID`の値。 |


### XChainBridgeのフィールド

| フィールド            | JSONの型 | 内部の型  | 必須? | 説明 |
|:--------------------|:---------|:--------|:------|:----------------|
| `IssuingChainDoor`  | 文字列    | Account | はい  | 発行チェーンのドアアカウント。XRP-XRPブリッジの場合、これはジェネシスアカウント(ネットワークが最初に開始されたときに作成されるアカウントで、すべてのXRPを含む)でなければなりません。 |
| `IssuingChainIssue` | Issue    | Issue   | はい  | 発行チェーン上で作成され、バーンされる資産。IOU-IOUブリッジの場合、供給問題を避けるため、資産の発行者は発行チェーンのドアアカウントでなければなりません。 |
| `LockingChainDoor`  | 文字列    | Account | はい  | ロックチェーンのドアアカウント。 |
| `LockingChainIssue` | Issue    | Issue   | はい  | ロックチェーンでロック、アンロックされる資産。 |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
