---
html: require-destination-tags.html
parent: manage-account-settings.html
seo:
    description: ユーザがあなたのアドレスに送金するときに宛先タグを必ず指定しなければならないようにします。
labels:
  - アカウント
---
# 宛先タグの必須化

`RequireDest`設定は、送金先を識別する[宛先タグ](../../../concepts/transactions/source-and-destination-tags.md)を顧客が付け忘れている場合にあなたのアドレスに[送金](../../../concepts/payment-types/index.md)できないようにするためのものです。有効にすると、XRP Ledgerは宛先タグが付いていないあなたのアドレスへの送金を拒否します。

以下は、ローカルでホストされている`rippled`の[submitメソッド][]を使用して、`RequireDest`フラグを有効にする[AccountSetトランザクション][]を送信する例です。

リクエスト:

{% tabs %}

{% tab label="JSON-RPC" %}
```json
POST http://localhost:5005/
Content-Type: application/json

{
    "method": "submit",
    "params": [
        {
            "secret": "sn3nxiW7v8KXzPzAqzyHXbSSKNuN9",
            "tx_json": {
                "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                "Fee": "15000",
                "Flags": 0,
                "SetFlag": 1,
                "TransactionType": "AccountSet"
            }
        }
    ]
}
```
{% /tab %}

{% /tabs %}

レスポンス:

{% tabs %}

{% tab label="JSON-RPC" %}
```json
200 OK

{
   "result" : {
      "deprecated" : "Signing support in the 'submit' command has been deprecated and will be removed in a future version of the server. Please migrate to a standalone signing tool.",
      "engine_result" : "tesSUCCESS",
      "engine_result_code" : 0,
      "engine_result_message" : "The transaction was applied. Only final in a validated ledger.",
      "status" : "success",
      "tx_blob" : "12000322000000002400000179202100000001684000000000003A98732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB7446304402201C430B4C29D0A0AB94286AE55FB9981B00F84C7985AF4BD44570782C5E0C5E290220363B68B81580231B32176F8C477B822ECB9EC673B84237BEF15BE6F59108B97D81144B4E9C06F24296074F7BC48F92A97916C6DC5EA9",
      "tx_json" : {
         "Account" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
         "Fee" : "15000",
         "Flags" : 0,
         "Sequence" : 377,
         "SetFlag" : 1,
         "SigningPubKey" : "03AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB",
         "TransactionType" : "AccountSet",
         "TxnSignature" : "304402201C430B4C29D0A0AB94286AE55FB9981B00F84C7985AF4BD44570782C5E0C5E290220363B68B81580231B32176F8C477B822ECB9EC673B84237BEF15BE6F59108B97D",
         "hash" : "3F2B233907BE9EC51AE1C822EC0B6BB0965EFD2400B218BE988DDA9529F53CA4"
      }
   }
}
```
{% /tab %}

{% /tabs %}


## 関連項目

- **コンセプト:**
  - [アカウント](../../../concepts/accounts/index.md)
  - [送信元と宛先タグ](../../../concepts/transactions/source-and-destination-tags.md)
  - [トランザクションコスト](../../../concepts/transactions/transaction-cost.md)
  - [支払いタイプ](../../../concepts/payment-types/index.md)
- **リファレンス:**
  - [account_infoメソッド][]
  - [AccountSetトランザクション][]
  - [AccountRootのフラグ](../../../references/protocol/ledger-data/ledger-entry-types/accountroot.md#accountrootのフラグ)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
