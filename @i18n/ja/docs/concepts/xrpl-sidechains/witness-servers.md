---
html: witness-servers.html
parent: xrpl-sidechains.html
seo:
    description: Witnessサーバとは、XRP Ledgerと他のチェーン間のトランザクションの監視と署名を行うための軽量サーバです。
status: not_enabled
labels:
  - ブロックチェーン
  - 相互運用性
---
# Witnessサーバ
[[ソース]](https://github.com/seelabs/xbridge_witness "ソース")

_（[XChainBridge Amendment][] {% not-enabled /%} が必要です）_

Witnessサーバは、ロックチェーンと発行チェーン間のトランザクションの中立的な監視人として機能します。このサーバはブリッジの両側のドアアカウントをリッスンし、トランザクションが発生したことを確認する証明書に署名します。サーバは基本的に、送金元アカウントで価値がロックまたはバーンされたことを"証明"するオラクルとして機能し、これにより受取人は送金先アカウントで同等の資金を(作成またはロック解除によって)請求することができます。

ロックチェーンと発行チェーンの間のブリッジは、その設定に以下の情報を含みます。

* ブリッジ上のトランザクションを監視するWitnessサーバ。Witnessサーバは1つ以上選択できます。
* Witnessサーバのサービス料金。

誰でもWitnessサーバを運用することができます。しかし、Witnessサーバの信頼性を評価する責任は発行チェーンの参加者にあります。Witnessサーバを実行する場合、`rippled`ノードも実行し、Witnessサーバがアクセスする必要があるチェーンと同期させる必要があります。

**注記:** 発行チェーンは、最初は1台のWitnessサーバだけでブリッジを構成し、Witnessサーバ自体を実行することを選択できます。この戦略は、発行チェーンがまだマーケットで地位を確立していない初期に役立ちます。


## Witnessサーバの設定

Witnessサーバはコマンドライン引数`--conf`で指定されたJSON設定ファイルを受け取ります。


### 設定JSONの例

```json
{
  "LockingChain": {
    "Endpoint": {
      "Host": "127.0.0.1",
      "Port": 6005
    },
    "TxnSubmit": {
      "ShouldSubmit": true,
      "SigningKeySeed": "shUe3eSgGK4e6xMFuCakZnxsMN1uk",
      "SigningKeyType": "ed25519",
      "SubmittingAccount": "rpFp36UHW6FpEcZjZqq5jSJWY6UCj3k4Es"
    },
    "RewardAccount": "rpFp36UHW6FpEcZjZqq5jSJWY6UCj3k4Es"
  },
  "IssuingChain": {
    "Endpoint": {
      "Host": "127.0.0.1",
      "Port": 6007
    },
    "TxnSubmit": {
      "ShouldSubmit": true,
      "SigningKeySeed": "shUe3eSgGK4e6xMFuCakZnxsMN1uk",
      "SigningKeyType": "ed25519",
      "SubmittingAccount": "rpFp36UHW6FpEcZjZqq5jSJWY6UCj3k4Es"
    },
    "RewardAccount": "rpFp36UHW6FpEcZjZqq5jSJWY6UCj3k4Es"
  },
  "RPCEndpoint": {
    "Host": "127.0.0.1",
    "Port": 6010
  },
  "DBDir": "/var/lib/witness/witness01/db",
  "LogFile": "/var/log/witness/witness01.log",
  "SigningKeySeed": "spkHEwDKeChm8PAFApLkF1E2sDs6t",
  "SigningKeyType": "ed25519",
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
  "Admin": {
    "Username": "username01",
    "Password": "password01"
  }
}
```


### 設定のフィールド

| フィールド名       | JSONの型   | 必須? | 説明 |
|------------------|------------|-------|-----|
| `Admin`          | オブジェクト | いいえ | Witnessサーバへの特権リクエスト用の`Username`フィールドと`Password`フィールド (文字列)。**注記:** adminフィールドは両方に設定、またはどちらも設定されていない必要があります。 |
| [`IssuingChain`](#issuingchainとlockingchainのフィールド) | オブジェクト | はい   | 発行チェーンと通信するためのパラメータ。 |
| [`LockingChain`](#issuingchainとlockingchainのフィールド) | オブジェクト | はい   | ロックチェーンと通信するためのパラメータ。 |
| `RPCEndpoint`    | オブジェクト | はい   | WitnessサーバへのRPCリクエストのエンドポイント。 |
| `LogFile`        | 文字列      | はい   | ログファイルの保存場所。 | 
| `LogLevel`       | 文字列      | はい   | ログファイルに保存するログのレベル。`All`、`Trace`、`Debug`、`Info`、`Warning`、`Error`、`Fatal`、`Disabled`、`None`のいずれかを指定します。 |
| `DBDir`          | 文字列      | はい   | データベースが保存されているディレクトリの場所。 |
| `SigningKeySeed` | 文字列      | はい   | Witnessサーバが証明書に署名する際に使用するシード。 |
| `SigningKeyType` | 文字列      | はい   | `SigningKeySeed`のエンコードに使用するアルゴリズム。`secp256k1`と`ed25519`のいずれかを指定します。 |
| [`XChainBridge`](#xchainbridgeのフィールド) | XChainBridge | はい   | Witnessサーバが監視しているブリッジ。 |


#### IssuingChainとLockingChainのフィールド

| フィールド名      | JSONの型   | 必須? | 説明 |
|-----------------|------------|------|-----|
| `Endpoint`      | オブジェクト | はい | チェーンと同期した`rippled`ノードのWebSocketエンドポイント。**注記:** `rippled`ノードとWitnessサーバは同じ人が操作する必要があります。 |
| `TxnSubmit`     | オブジェクト | はい | チェーン上でトランザクションを送信するためのパラメータ。 |
| `RewardAccount` | 文字列      | はい | チェーン上で`SignatureReward`の報酬の分配を受け取るアカウント。 |


#### Endpointのフィールド

| フィールド名 | JSONの型 | 必須? | 説明 |
|------------|---------|-------|-----|
| `Host`     | 文字列   | はい   | `rippled`ノードのIPアドレス。**注記:** IPv4アドレスかURLを指定します。 |
| `Port`     | 文字列   | はい   | WebSocketエンドポイントのポート。 |


#### RPCEndpointのフィールド

| フィールド名 | JSONの型 | 必須? | 説明 |
|------------|---------|-------|-----|
| `Host`     | 文字列   | はい   | `rippled`ノードのIPアドレス。**注記:** IPv4アドレスかURLを指定します。 |
| `Port`     | 文字列   | はい   | WebSocketエンドポイントのポート。 |


#### TxnSubmitのフィールド

| フィールド名          | JSONの型 | 必須? | 説明 |
|---------------------|---------|-------|-----|
| `ShouldSubmit`      | 真偽値   | はい   | Witnessサーバがロックチェーン上でトランザクションを提出すべきかどうかを示す真偽値。 |
| `SigningKeySeed`    | 文字列   | いいえ | Witnessサーバがロックチェーン上のトランザクションに署名する際に使用するシード。これは`ShouldSubmit`が`true`の場合に必要です。 |
| `SigningKeyType`    | 文字列   | いいえ | `SigningKeySeed`のエンコードに使用するアルゴリズム。`secp256k1`と`ed25519`のいずれかを指定します。これは`ShouldSubmit`が`true`の場合に必要です。 |
| `SubmittingAccount` | 文字列   | いいえ | `XChainAddClaimAttestation`と`XChainAddAccountCreateAttestation`トランザクションを送信するアカウント。これは`ShouldSubmit`が`true`の場合に必要です。 |


#### XChainBridgeのフィールド

| フィールド            | JSONの型 | [内部の型][] | 必須? | 説明 |
|:--------------------|:---------|:-----------|:------|:----|
| `IssuingChainDoor`  | 文字列    | Account    | はい   | 発行チェーンのドアアカウント。XRP-XRPブリッジの場合、これはジェネシスアカウント(ネットワークが最初に開始されたときに作成されるアカウントで、すべてのXRPを含む)でなければなりません。 |
| `IssuingChainIssue` | Issue    | Issue      | はい   | 発行チェーン上で作成され、バーンされる資産。IOU-IOUブリッジの場合、供給量の問題を避けるため、資産の発行者は発行チェーンのドアアカウントでなければなりません。 |
| `LockingChainDoor`  | 文字列    | Account    | はい   | ロックチェーンのドアアカウント。 |
| `LockingChainIssue` | Issue    | Issue      | はい   | ロックチェーンでロック、アンロックされる資産。 |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
