---
html: txn-and-requests.html
parent: intro-to-xrpl.html
seo:
    description: レジャーとのやりとりは、すべてトランザクションかリクエストで行われます。
labels:
  - ブロックチェーン
---

# トランザクションとリクエスト

XRP Ledgerとのすべてのやり取りは、レジャーに変更を加えるトランザクションを送信するか、レジャーの情報を求めるリクエストを送信するかのいずれかとなっています。

## トランザクションの仕組み

トランザクションを実行するには、RESTコマンドをXRP Ledgerに送信し、そのレスポンスを待ちます。コマンドの構文は、すべてのトランザクションで常に共通です。

トランザクションを行う _Account_ の _TransactionType_ とパブリックアドレスを常に提供する必要があります。

2つの必須のフィールドは、トランザクションの _Fee_ と、アカウントからのトランザクションの順番を決定する _Sequence_ 番号です。これらのフィールドは、トランザクションを送信する際に、レジャーサーバによって自動的に入力することができます。

特定のトランザクションには、トランザクションの種類に応じた必須項目も存在します。例えば、 _Payment_ トランザクションでは、 _Amount_ 値（単位は _drops_ または100万分の1XRP）と _Destination_ パブリックアドレスが必要となります。

以下は、JSON形式のトランザクションのサンプルです。このトランザクションは、アカウント _rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn_ から宛先アカウント _ra5nK24KXen9AHvsdFTKHSANinZseWnPcX_ へ1XRPを送金しています。

```json
{
  "TransactionType": "Payment",
  "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
  "Amount": 1000000,
  "Destination": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX"
}
```

省略可能なフィールドはすべてのトランザクションで利用可能であり、特定のトランザクションでは追加のフィールドを利用することができます。必要な数だけ省略可能なフィールドを含めることができますが、すべてのトランザクションにすべてのフィールドを含める必要はありません。

JavaScript、Python、コマンドライン、または互換性のあるサービスから、RESTfulコマンドとしてトランザクションをレジャーに送信します。rippledサーバは、トランザクションをレジャーに提案します。

![トランザクションの提案](/docs/img/introduction17-gather-txns.png)

バリデータの80%超が提案された現在のトランザクションを承認すると、その取引は永久的にレジャーの一部として記録されます。rippledサーバは、送信したトランザクションの結果を返します。

トランザクションについてのより詳しい解説は、[トランザクション](../concepts/transactions/index.md)をご覧ください。

## リクエストの仕組み

リクエストはレジャーから情報を取得するために使用されますが、レジャーに変更を加えることはありません。情報は誰でも自由に確認できるため、アカウント情報でサインインする必要はありません。

送信するフィールドは、リクエストの種類によって異なります。通常、いくつかの任意フィールドがありますが、必須フィールドは数個だけです。

リクエストを送信すると、rippledサーバまたはClioサーバ(リクエストに対応する専用のサーバ)で処理されます。

![Clioサーバ](/docs/img/introduction19-clio.png)

ClioサーバはXRPL上の他のrippledサーバの負荷の一部を軽減し、処理速度と信頼性を向上させます。

これはJSON形式のリクエストのサンプルです。このリクエストは、指定したアカウントの現在のアカウント情報を取得します。

```json
{
  "command": "account_info",
  "account": "rG1QQv2nh2gr7RCZ1P8YYcBUKCCN633jCn"
}
```

リクエストは、リクエストに使用した言語に適したフォーマットで豊富な情報を返します。以下は、アカウント情報のリクエストに対するJSON形式でのレスポンスの例です。

```json
{
    "result": {
        "account_data": {
            "Account": "rG1QQv2nh2gr7RCZ1P8YYcBUKCCN633jCn",
            "Balance": "999999999960",
            "Flags": 8388608,
            "LedgerEntryType": "AccountRoot",
            "OwnerCount": 0,
            "PreviousTxnID": "4294BEBE5B569A18C0A2702387C9B1E7146DC3A5850C1E87204951C6FDAA4C42",
            "PreviousTxnLgrSeq": 3,
            "Sequence": 6,
            "index": "92FA6A9FC8EA6018D5D16532D7795C91BFB0831355BDFDA177E86C8BF997985F"
        },
        "ledger_current_index": 4,
        "queue_data": {
            "auth_change_queued": true,
            "highest_sequence": 10,
            "lowest_sequence": 6,
            "max_spend_drops_total": "500",
            "transactions": [
                {
                    "auth_change": false,
                    "fee": "100",
                    "fee_level": "2560",
                    "max_spend_drops": "100",
                    "seq": 6
                },
                ... (trimmed for length) ...
                {
                    "LastLedgerSequence": 10,
                    "auth_change": true,
                    "fee": "100",
                    "fee_level": "2560",
                    "max_spend_drops": "100",
                    "seq": 10
                }
            ],
            "txn_count": 5
        },
        "status": "success",
        "validated": false
    }
}
```
Accountのフィールドについては、[アカウント](../concepts/accounts/index.md)をご覧ください。

次のページ: [ソフトウェアエコシステム](software-ecosystem.md)
