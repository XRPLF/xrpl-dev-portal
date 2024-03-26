---
html: disable-master-key-pair.html
parent: manage-account-settings.html
seo:
    description: アドレスに数学的に関連付けられたマスターキーを無効にする。
labels:
  - セキュリティ
  - アカウント
---
# マスターキーペアの無効化

このページでは、[アカウント](../../../concepts/accounts/index.md)のアドレスに数学的に関連付けられた[マスターキーペア](../../../concepts/accounts/cryptographic-keys.md)を無効化する方法について説明します。あなたのアカウントのマスターキーペアが漏洩した可能性がある場合、または[マルチシグ](../../../concepts/accounts/multi-signing.md)をあなたのアカウントからトランザクションを送信する _唯一_ の方法としたい場合、これを行う必要があります。

**注意:** マスターキーペアを無効にすると、[トランザクションの承認](../../../concepts/transactions/index.md#トランザクションの承認)の方法の1つが削除されます。マスターキーペアを無効にする前に、レギュラーキーやマルチ・サインなど、他のトランザクションの承認方法のいずれかを使用できることを確認する必要があります。(例えば、[レギュラーキーペアを割り当てた場合](assign-a-regular-key-pair.md)は、そのレギュラーキーで正常にトランザクションを送信できることを確認してください)。XRP Ledgerは分散型であるため、残りの取引承認方法を使用できない場合、誰もあなたのアカウントへのアクセスを回復することができません。

**マスターキーペアを無効にするには、マスターキーペアを使用する必要があります。**
ただし、他のトランザクションの認証方法を使用してマスターキーペアを _再有効化_ することは可能です。

## 前提条件

アカウントのマスターキーペアを無効にするには、次の前提条件を満たしている必要があります。

- XRP Ledger[アカウント](../../../concepts/accounts/index.md)を持ち、そのアカウントからマスターキーペアを用いてトランザクションの署名と提出ができることが必要です。[安全な署名の設定](../../../concepts/transactions/secure-signing.md) をご覧ください。これには2つの一般的な方法があります。
    - アカウントのマスターシード値を知っている。シード値は一般的に `sn3nxiW7v8KXzPzAqzyHXbSSKNuN9`のような "s" で始まる [base58][] 値で表されます。
    - あるいは、シード値を知る必要がなく、安全に保存する[専用の署名デバイス](../../../concepts/transactions/secure-signing.md#専用の署名デバイスを使用する) を使用します
- あなたのアカウントには、マスターキーペア以外のトランザクションを認証する方法が少なくとも1つ必要です。つまり、以下のいずれか、または両方を行う必要があります。
    - [レギュラーキーペアを割り当てる](assign-a-regular-key-pair.md).
    - [マルチシグの設定](set-up-multi-signing.md).

## 手順

### 1. トランザクションJSONの作成

アカウントから、`"SetValue": 4`のフィールドを持つ[AccountSet トランザクション][]を準備します。これは AccountSet フラグ "Disable Master" (`asfDisableMaster`) に対応する値です。このトランザクションの他の必須フィールドは、必須の[共通フィールド](../../../references/protocol/transactions/common-fields.md)のみです。例えば、[自動入力可能なフィールド](../../../references/protocol/transactions/common-fields.md#自動入力可能なフィールド) を省けば、以下のトランザクション指示で十分である。

```json
{
  "TransactionType": "AccountSet",
  "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
  "SetFlag": 4
}
```

**ヒント:** [予測可能な時間内にトランザクションの結果を確実に得る](../../../concepts/transactions/reliable-transaction-submission.md)ために、`LastLedgerSequence`フィールドも提供することが強く推奨されています。

### 2. トランザクションへの署名

トランザクションの署名には、**マスターキーペア**を使用する必要があります。

**注意:** 自分が管理していないサーバに秘密鍵を提出したり、暗号化されていない状態でネットワーク上に送信したりしないでください。これらの例は、[ローカルの `rippled` サーバ](../../../concepts/transactions/secure-signing.md#ローカルでrippledを実行する) を使っていることを前提にしています。他の[安全な署名方法](../../../concepts/transactions/secure-signing.md)を使っている場合は、これらの手順を変更する必要があります。

#### リクエストの例

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "command": "sign",
  "tx_json": {
    "TransactionType": "AccountSet",
    "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "SetFlag": 4
  },
  "secret": "s████████████████████████████"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
   "method": "sign",
   "params": [
      {
         "tx_json": {
           "TransactionType": "AccountSet",
           "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
           "SetFlag": 4
         },
         "secret": "s████████████████████████████"
      }
   ]
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
$ rippled sign s████████████████████████████ '{"TransactionType":"AccountSet",
    "Account":"rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn", "SetFlag":4}'
```
{% /tab %}

{% /tabs %}

#### レスポンスの例

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "result": {
    "deprecated": "This command has been deprecated and will be removed in a future version of the server. Please migrate to a standalone signing tool.",
    "tx_blob": "1200032280000000240000017C20210000000468400000000000000A732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB7446304402204457A890BC06F48061F8D61042975702B57EBEF3EA2C7C484DFE38CFD42EA11102202505A7C62FF41E68FDE10271BADD75BD66D54B2F96A326BE487A2728A352442D81144B4E9C06F24296074F7BC48F92A97916C6DC5EA9",
    "tx_json": {
      "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "Fee": "10",
      "Flags": 2147483648,
      "Sequence": 380,
      "SetFlag": 4,
      "SigningPubKey": "03AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB",
      "TransactionType": "AccountSet",
      "TxnSignature": "304402204457A890BC06F48061F8D61042975702B57EBEF3EA2C7C484DFE38CFD42EA11102202505A7C62FF41E68FDE10271BADD75BD66D54B2F96A326BE487A2728A352442D",
      "hash": "327FD263132A4D08170E1B01FE1BB2E21D0126CE58165C97A9173CA9551BCD70"
    }
  },
  "status": "success",
  "type": "response"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "result": {
        "deprecated": "This command has been deprecated and will be removed in a future version of the server. Please migrate to a standalone signing tool.",
        "status": "success",
        "tx_blob": "1200032280000000240000017C20210000000468400000000000000A732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB7446304402204457A890BC06F48061F8D61042975702B57EBEF3EA2C7C484DFE38CFD42EA11102202505A7C62FF41E68FDE10271BADD75BD66D54B2F96A326BE487A2728A352442D81144B4E9C06F24296074F7BC48F92A97916C6DC5EA9",
        "tx_json": {
            "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
            "Fee": "10",
            "Flags": 2147483648,
            "Sequence": 380,
            "SetFlag": 4,
            "SigningPubKey": "03AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB",
            "TransactionType": "AccountSet",
            "TxnSignature": "304402204457A890BC06F48061F8D61042975702B57EBEF3EA2C7C484DFE38CFD42EA11102202505A7C62FF41E68FDE10271BADD75BD66D54B2F96A326BE487A2728A352442D",
            "hash": "327FD263132A4D08170E1B01FE1BB2E21D0126CE58165C97A9173CA9551BCD70"
        }
    }
}

```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
Loading: "/etc/opt/ripple/rippled.cfg"
2020-Feb-13 00:13:24.783570867 HTTPClient:NFO Connecting to 127.0.0.1:5005

{
   "result" : {
      "deprecated" : "This command has been deprecated and will be removed in a future version of the server. Please migrate to a standalone signing tool.",
      "status" : "success",
      "tx_blob" : "1200032280000000240000017C20210000000468400000000000000A732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB7446304402204457A890BC06F48061F8D61042975702B57EBEF3EA2C7C484DFE38CFD42EA11102202505A7C62FF41E68FDE10271BADD75BD66D54B2F96A326BE487A2728A352442D81144B4E9C06F24296074F7BC48F92A97916C6DC5EA9",
      "tx_json" : {
         "Account" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
         "Fee" : "10",
         "Flags" : 2147483648,
         "Sequence" : 380,
         "SetFlag" : 4,
         "SigningPubKey" : "03AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB",
         "TransactionType" : "AccountSet",
         "TxnSignature" : "304402204457A890BC06F48061F8D61042975702B57EBEF3EA2C7C484DFE38CFD42EA11102202505A7C62FF41E68FDE10271BADD75BD66D54B2F96A326BE487A2728A352442D",
         "hash" : "327FD263132A4D08170E1B01FE1BB2E21D0126CE58165C97A9173CA9551BCD70"
      }
   }
}
```
{% /tab %}

{% /tabs %}

サーバがトランザクションに正常に署名したことを示す `"status": "success"` を探してください。代わりに `"status": "error"` が表示された場合は、 `error` と `error_message` フィールドをチェックして、より詳しい情報を確認してください。よくある可能性としては、以下のようなものがあります。

- `"error": "badSecret"` は通常、リクエストの`secret`にタイプミスがあったことを意味します。
- `"error": "masterDisabled"` は、このアドレスのマスターキーペアが _既に_ 無効であることを意味します。

レスポンスに含まれる `tx_blob` の値をメモしておきます。これはネットワークに送信できる署名済みトランザクションバイナリである。

### 3. トランザクションの送信

前のステップで署名されたトランザクションblobをXRP Ledgerに提出します。

#### リクエストの例

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "command": "submit",
    "tx_blob": "1200032280000000240000017C20210000000468400000000000000A732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB7446304402204457A890BC06F48061F8D61042975702B57EBEF3EA2C7C484DFE38CFD42EA11102202505A7C62FF41E68FDE10271BADD75BD66D54B2F96A326BE487A2728A352442D81144B4E9C06F24296074F7BC48F92A97916C6DC5EA9"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
   "method":"submit",
   "params": [
      {
         "tx_blob": "1200032280000000240000017C20210000000468400000000000000A732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB7446304402204457A890BC06F48061F8D61042975702B57EBEF3EA2C7C484DFE38CFD42EA11102202505A7C62FF41E68FDE10271BADD75BD66D54B2F96A326BE487A2728A352442D81144B4E9C06F24296074F7BC48F92A97916C6DC5EA9"
      }
   ]
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```
$ rippled submit 1200032280000000240000017C20210000000468400000000000000A732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB7446304402204457A890BC06F48061F8D61042975702B57EBEF3EA2C7C484DFE38CFD42EA11102202505A7C62FF41E68FDE10271BADD75BD66D54B2F96A326BE487A2728A352442D81144B4E9C06F24296074F7BC48F92A97916C6DC5EA9
```
{% /tab %}

{% /tabs %}

#### レスポンスの例

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "result": {
    "engine_result" : "tesSUCCESS",
    "engine_result_code" : 0,
    "engine_result_message" : "The transaction was applied. Only final in a validated ledger.",
    "tx_blob" : "1200032280000000240000017C20210000000468400000000000000A732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB7446304402204457A890BC06F48061F8D61042975702B57EBEF3EA2C7C484DFE38CFD42EA11102202505A7C62FF41E68FDE10271BADD75BD66D54B2F96A326BE487A2728A352442D81144B4E9C06F24296074F7BC48F92A97916C6DC5EA9",
    "tx_json" : {
      "Account" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "Fee" : "10",
      "Flags" : 2147483648,
      "Sequence" : 380,
      "SetFlag" : 4,
      "SigningPubKey" : "03AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB",
      "TransactionType" : "AccountSet",
      "TxnSignature" : "304402204457A890BC06F48061F8D61042975702B57EBEF3EA2C7C484DFE38CFD42EA11102202505A7C62FF41E68FDE10271BADD75BD66D54B2F96A326BE487A2728A352442D",
      "hash" : "327FD263132A4D08170E1B01FE1BB2E21D0126CE58165C97A9173CA9551BCD70"
    }
  },
  "status": "success",
  "type": "response"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
  "result" : {
    "engine_result" : "tesSUCCESS",
    "engine_result_code" : 0,
    "engine_result_message" : "The transaction was applied. Only final in a validated ledger.",
    "status" : "success",
    "tx_blob" : "1200032280000000240000017C20210000000468400000000000000A732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB7446304402204457A890BC06F48061F8D61042975702B57EBEF3EA2C7C484DFE38CFD42EA11102202505A7C62FF41E68FDE10271BADD75BD66D54B2F96A326BE487A2728A352442D81144B4E9C06F24296074F7BC48F92A97916C6DC5EA9",
    "tx_json" : {
      "Account" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "Fee" : "10",
      "Flags" : 2147483648,
      "Sequence" : 380,
      "SetFlag" : 4,
      "SigningPubKey" : "03AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB",
      "TransactionType" : "AccountSet",
      "TxnSignature" : "304402204457A890BC06F48061F8D61042975702B57EBEF3EA2C7C484DFE38CFD42EA11102202505A7C62FF41E68FDE10271BADD75BD66D54B2F96A326BE487A2728A352442D",
      "hash" : "327FD263132A4D08170E1B01FE1BB2E21D0126CE58165C97A9173CA9551BCD70"
    }
  }
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
Loading: "/etc/opt/ripple/rippled.cfg"
2020-Feb-13 00:25:49.361743460 HTTPClient:NFO Connecting to 127.0.0.1:5005

{
   "result" : {
      "engine_result" : "tesSUCCESS",
      "engine_result_code" : 0,
      "engine_result_message" : "The transaction was applied. Only final in a validated ledger.",
      "status" : "success",
      "tx_blob" : "1200032280000000240000017C20210000000468400000000000000A732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB7446304402204457A890BC06F48061F8D61042975702B57EBEF3EA2C7C484DFE38CFD42EA11102202505A7C62FF41E68FDE10271BADD75BD66D54B2F96A326BE487A2728A352442D81144B4E9C06F24296074F7BC48F92A97916C6DC5EA9",
      "tx_json" : {
         "Account" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
         "Fee" : "10",
         "Flags" : 2147483648,
         "Sequence" : 380,
         "SetFlag" : 4,
         "SigningPubKey" : "03AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB",
         "TransactionType" : "AccountSet",
         "TxnSignature" : "304402204457A890BC06F48061F8D61042975702B57EBEF3EA2C7C484DFE38CFD42EA11102202505A7C62FF41E68FDE10271BADD75BD66D54B2F96A326BE487A2728A352442D",
         "hash" : "327FD263132A4D08170E1B01FE1BB2E21D0126CE58165C97A9173CA9551BCD70"
      }
   }
}
```
{% /tab %}

{% /tabs %}

トランザクションが `tecNO_ALTERNATIVE_KEY` という結果で失敗した場合、あなたのアカウントでは現在トランザクションを認証するための別の方法が有効になっていません。[レギュラーキーペアを割り当てる](assign-a-regular-key-pair.md)か [マルチシグを設定](set-up-multi-signing.md) した後、再度マスターキーペアの無効化を試してみてください。


### 4. 検証の待機

{% partial file="/@i18n/ja/docs/_snippets/wait-for-validation.md" /%} 

### 5. アカウントフラグの確認

[account_infoメソッド][]で、アカウントのマスターキーが無効になっていることを確認します。以下のパラメータを必ず指定してください。

| フィールド       | 値                                                                           |
|:---------------|:-----------------------------------------------------------------------------|
| `account`      | アカウントのアドレス                                                            |
| `ledger_index` | `"validated"` とすると、検証済みの最新バージョンのレジャーから結果を得ることができます。 |

#### リクエストの例

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "command": "account_info",
  "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
  "ledger_index": "validated"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "account_info",
    "params": [{
        "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
        "ledger_index": "validated"
    }]
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
rippled account_info rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn validated
```
{% /tab %}

{% /tabs %}


#### レスポンスの例

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "result": {
    "account_data": {
      "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "AccountTxnID": "327FD263132A4D08170E1B01FE1BB2E21D0126CE58165C97A9173CA9551BCD70",
      "Balance": "423013688",
      "Domain": "6D64756F31332E636F6D",
      "EmailHash": "98B4375E1D753E5B91627516F6D70977",
      "Flags": 9633792,
      "LedgerEntryType": "AccountRoot",
      "MessageKey": "0000000000000000000000070000000300",
      "OwnerCount": 9,
      "PreviousTxnID": "327FD263132A4D08170E1B01FE1BB2E21D0126CE58165C97A9173CA9551BCD70",
      "PreviousTxnLgrSeq": 53391321,
      "RegularKey": "rD9iJmieYHn8jTtPjwwkW2Wm9sVDvPXLoJ",
      "Sequence": 381,
      "TransferRate": 4294967295,
      "index": "13F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8",
      "urlgravatar": "http://www.gravatar.com/avatar/98b4375e1d753e5b91627516f6d70977"
    },
    "ledger_hash": "A90CEBD4AEDA24470AAC5CD307B6D26267ACE79C03669A0A0B8C41ACAEDAA6F0",
    "ledger_index": 53391576,
    "validated": true
  },
  "status": "success",
  "type": "response"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
  "result": {
    "account_data": {
      "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "AccountTxnID": "327FD263132A4D08170E1B01FE1BB2E21D0126CE58165C97A9173CA9551BCD70",
      "Balance": "423013688",
      "Domain": "6D64756F31332E636F6D",
      "EmailHash": "98B4375E1D753E5B91627516F6D70977",
      "Flags": 9633792,
      "LedgerEntryType": "AccountRoot",
      "MessageKey": "0000000000000000000000070000000300",
      "OwnerCount": 9,
      "PreviousTxnID": "327FD263132A4D08170E1B01FE1BB2E21D0126CE58165C97A9173CA9551BCD70",
      "PreviousTxnLgrSeq": 53391321,
      "RegularKey": "rD9iJmieYHn8jTtPjwwkW2Wm9sVDvPXLoJ",
      "Sequence": 381,
      "TransferRate": 4294967295,
      "index": "13F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8",
      "urlgravatar": "http://www.gravatar.com/avatar/98b4375e1d753e5b91627516f6d70977"
    },
    "ledger_hash": "4C4AC95149B13B539369998675FE6860C52695E83658366F18872181C9F1AEBF",
    "ledger_index": 53391589,
    "status": "success",
    "validated": true
  }
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
Loading: "/etc/opt/ripple/rippled.cfg"
2020-Feb-13 00:41:38.642710734 HTTPClient:NFO Connecting to 127.0.0.1:5005

{
   "result" : {
      "account_data" : {
         "Account" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
         "AccountTxnID" : "327FD263132A4D08170E1B01FE1BB2E21D0126CE58165C97A9173CA9551BCD70",
         "Balance" : "423013688",
         "Domain" : "6D64756F31332E636F6D",
         "EmailHash" : "98B4375E1D753E5B91627516F6D70977",
         "Flags" : 9633792,
         "LedgerEntryType" : "AccountRoot",
         "MessageKey" : "0000000000000000000000070000000300",
         "OwnerCount" : 9,
         "PreviousTxnID" : "327FD263132A4D08170E1B01FE1BB2E21D0126CE58165C97A9173CA9551BCD70",
         "PreviousTxnLgrSeq" : 53391321,
         "RegularKey" : "rD9iJmieYHn8jTtPjwwkW2Wm9sVDvPXLoJ",
         "Sequence" : 381,
         "TransferRate" : 4294967295,
         "index" : "13F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8",
         "urlgravatar" : "http://www.gravatar.com/avatar/98b4375e1d753e5b91627516f6d70977"
      },
      "ledger_hash" : "BBA4034FB5D5D89987E0987A9491E7B62B16708EECFF04CDB0367BD4D28EB1B5",
      "ledger_index" : 53391568,
      "status" : "success",
      "validated" : true
   }
}
```
{% /tab %}

{% /tabs %}


レスポンスの `account_data` オブジェクトで、 `Flags` フィールドと `lsfDisableMaster` フラグの値 (16 進数では `0x00100000`、10 進数では `1048576`) を ビット論理積 (ほとんどのプログラミング言語では `&` オペレーター) で比較します。

コード例:

{% tabs %}

{% tab label="JavaScript" %}
```js
// 上記のJSON-RPCレスポンスがaccount_info_responseとして保存されていると仮定します。
const lsfDisableMaster = 0x00100000;
let acct_flags = account_info_response.result.account_data.Flags;
if ((lsfDisableMaster & acct_flags) === lsfDisableMaster) {
  console.log("マスターキーペアが無効化されています");
} else {
  console.log("マスターキーペアが使用可能です");
}
```
{% /tab %}

{% tab label="Python" %}
```python
# 上記のJSON-RPCレスポンスがJSONから解析され、
# 変数account_info_responseとして保存されたと仮定すると、以下のようになります。
lsfDisableMaster = 0x00100000
acct_flags = account_info_response["result"]["account_data"]["Flags"]
if lsfDisableMaster & acct_flags == lsfDisableMaster:
  console.log("マスターキーペアが無効化されています");
else:
  console.log("マスターキーペアが使用可能です");
```
{% /tab %}

{% /tabs %}

この操作の結果は次の2つしかありません。

- 結果が0でない場合は `lsfDisableMaster` の値と等しく、 **マスターキーが正常に無効化されたこと** を示します。
- 結果が0の場合は、そのアカウントのマスターキーが無効になっていないことを示します。

結果が予想と異なる場合は、前の手順で送信したトランザクションが正常に実行されたかどうかを確認してください。それは、その口座のトランザクション履歴（[account_tx メソッド][]）の中で最も新しいもので、結果コード `tesSUCCESS` がついているはずです。それ以外の[結果コード](../../../references/protocol/transactions/transaction-results/index.md)が表示された場合、そのトランザクションは正常に実行されませんでした。エラーの原因によっては、これらの手順を最初からやり直した方がよいかもしれません。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
