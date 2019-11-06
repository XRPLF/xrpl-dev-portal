# Payment Channelの使用

Payment Channelは、少額の単位に分割可能な「非同期」のXRPペイメントを送信し、後日決済する高度な機能です。このチュートリアルでは、全体的な[Payment Channel](payment-channels.html)の使用方法を、ローカル`rippled`サーバーの[JSON-RPC API](rippled-api.html)を使用する例を使って説明します。

このチュートリアルを進めるにあたって[資金供給されているXRP Ledgerアカウント](accounts.html)を所有するユーザーが2名いれば理想的です。ただし、2つのXRP Ledgerアドレスを管理する1名のユーザーとしてこのチュートリアルを進めることもできます。

## サンプルの値

このチュートリアルでは、例として以下のアドレスを使用します。

| | |
|--|--|
| **支払人のアドレス** | rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH |
| **Channelに使用する公開鍵（XRP Ledgerの[base58][]エンコード文字列フォーマット）** | aB44YfzW24VDEJQ2UuLPV2PvqcPCSoLnL7y5M1EzhdW4LnK5xMS3
| **Channelに使用する公開鍵（16進数）** | 023693F15967AE357D0327974AD46FE3C127113B1110D6044FD41E723689F81CC6 |
| **受取人のアドレス** | rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn |

**ヒント:** この例では、Channelの公開鍵は支払人のマスターキーペアの公開鍵です。これは完全に安全であり有効です。また、支払人のみが異なるキーペアの公開鍵と秘密鍵を把握している場合に限り、そのキーペアを使用することも完全に安全であり有効です。 <!-- Editor's note: We don't have a good page to link to explain key pairs as of time of this writing. -->

また、トランザクションの送信先`rippled`サーバーも必要です。このチュートリアルの例では、`rippled`サーバーがテストマシン（`localhost`）で稼働しており、このテストマシンはポート**5005**で非暗号化JSON-RPC APIエンドポイントに接続しています。

実際のXRPを送金せずにテストを実施するには、Test Net XRPを保有する[XRP Ledger Testnet](xrp-testnet-faucet.html)のアドレスを使用できます。XRP Ledger Test Netを使用する場合、`http://localhost:5005/`ではなく`https://api.altnet.rippletest.net:51234`に接続することで、Test NetサーバーのJSON-RPC APIを使用できます。

Payment Channelに使用できるXRPの額に制限はありません。このチュートリアルで使用されているサンプルの値では、Payment Channelで100 XRP（`100000000` drop）が少なくとも1日間は確保されます。

## フローチャート
[フローチャート]: #フローチャート

次の図は、Payment Channelのライフサイクルの概要を示します。

[![Payment Channelフローチャート](img/paychan-flow.ja.png)](img/paychan-flow.ja.png)

この図のステップの番号は、このチュートリアルのステップの番号に対応しています。

1. [支払人: Channelの作成](#1-支払人が特定の受取人へのpayment-channelを作成します)
2. [受取人: Channelの確認](#2-受取人がpayment-channelの特性を確認します)
3. [支払人: クレームへの署名](#3-支払人がchannelのxrpに対して1つ以上の署名付き-クレーム-を作成します)
4. [支払人: 受取人へのクレームの送信](#4-支払人が商品またはサービスに対する支払いとしてクレームを受取人に送信します)
5. [受取人: クレームの検証](#5-受取人がクレームを検証します)
6. [受取人: 商品またはサービスの提供](#6-受取人が商品またはサービスを提供します)
7. [必要に応じてステップ3～6を繰り返す](#7-必要に応じてステップ36を繰り返します)
8. [受取人: クレームの清算](#8-準備が完了すれば受取人は承認された額のクレームを清算します)
9. [支払人: Channel閉鎖の要求](#9-支払人と受取人の取引完了後支払人はchannelの閉鎖を要求します)
10. [支払人（またはその他の担当者）: 有効期限切れChannelの閉鎖](#10-有効期限切れのchannelは誰でも閉鎖できます)

## 1. 支払人が特定の受取人へのPayment Channelを作成します。

これは[PaymentChannelCreateトランザクション][]です。このプロセスでは、支払人がChannelの特定の特性（有効期限、決済遅延など、Channelのクレームに関する保証に影響する特性）を設定します。支払人は、Channelに対するクレームの検証に使用する公開鍵も設定します。 <!-- STYLE_OVERRIDE: will -->

**ヒント:** 「決済遅延」の設定だけが決済を遅延するわけでわありません。レジャーバージョンが閉鎖すると即時に決済が遅延されます（3～5秒）。「決済遅延」とは、Channel閉鎖の強制的な遅延です。これにより、受取人が決済を完了できるようになります。

以下の例は、JSON-RPC APIを使用してローカル`rippled`サーバーへ[送信](submit.html#署名と送信モード)することでPayment Channelを作成する方法を示しています。Payment Channelは、決済を1日遅らせて[サンプルの支払人](#サンプルの値)（rN7n7...）から[サンプルの受取人](#サンプルの値)（rf1Bi...）に100 XRPを割り当てます。公開鍵はサンプルの支払人のマスター公開鍵（16進数）です。

**注記:** Payment Channelは1つのオブジェクトとして支払人の[所有者準備金](reserves.html#所有者準備金)に反映されます。所有者は少なくとも、Payment Channelに割り当てられたXRPを差引き後に、準備金を維持するのに十分なXRPを保有している必要があります。

要求:

    POST http://localhost:5005/
    Content-Type: application/json

    {
        "method": "submit",
        "params": [{
            "secret": "s████████████████████████████",
            "tx_json": {
                "Account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
                "TransactionType": "PaymentChannelCreate",
                "Amount": "100000000",
                "Destination": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                "SettleDelay": 86400,
                "PublicKey": "023693F15967AE357D0327974AD46FE3C127113B1110D6044FD41E723689F81CC6",
                "DestinationTag": 20170428
            },
            "fee_mult_max": 1000
        }]
    }

応答:

    200 OK

    {
        "result": {
            "engine_result": "tesSUCCESS",
            "engine_result_code": 0,
            "engine_result_message": "The transaction was applied.Only final in a validated ledger.",
            ...
            "tx_json": {
                ...
                "TransactionType": "PaymentChannelCreate",
                "hash": "3F93C482C0BC2A1387D9E67DF60BECBB76CC2160AE98522C77AF0074D548F67D"
            }
        }
    }


`submit`要求に対する直接の応答には、トランザクションを識別する`hash`値を含む _暫定的な_ 結果が含まれています。支払人は、検証済みレジャーでトランザクションの _最終_ 結果を確認し、メタデータからChannel IDを取得する必要があります。この処理は`tx`コマンドを使用して実行できます。

要求:

    POST http://localhost:5005/
    Content-Type: application/json

    {
        "method": "tx",
        "params": [{
            "transaction": "3F93C482C0BC2A1387D9E67DF60BECBB76CC2160AE98522C77AF0074D548F67D"
        }]
    }

応答:

    200 OK

    {
        "result": {
            "Account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
            "Amount": "100000000",
            "Destination": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
            ...
            "TransactionType": "PaymentChannelCreate",
            ...
            "hash": "3F93C482C0BC2A1387D9E67DF60BECBB76CC2160AE98522C77AF0074D548F67D",
            "inLedger": 29380080,
            "ledger_index": 29380080,
            "meta": {
                "AffectedNodes": [
                    ...
                    {
                        "CreatedNode": {
                            "LedgerEntryType": "PayChannel",
                            "LedgerIndex": "5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3",
                            "NewFields": {
                                "Account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
                                "Amount": "100000000",
                                "Destination": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                                "DestinationTag": 20170428,
                                "PublicKey": "023693F15967AE357D0327974AD46FE3C127113B1110D6044FD41E723689F81CC6",
                                "SettleDelay": 86400
                            }
                        }
                    },
                    ...
                ],
                "TransactionIndex": 16,
                "TransactionResult": "tesSUCCESS"
            },
            "status": "success",
            "validated": true
        }
    }

支払人はJSON-RPCからの応答で以下を確認する必要があります。

- トランザクションの`meta`フィールドで、`TransactionResult`が`tesSUCCESS`であることを確認します。
- データが検証済みレジャーのデータであることを示す`"validated":true`が応答に含まれていることを確認します。（結果`tesSUCCESS`は、検証済みレジャーバージョンに記録されている場合にのみ[最終的な](finality-of-results.html)結果です。）
- トランザクションの`meta`フィールドの`AffectedNodes`配列で、`LedgerEntryType`が`PayChannel`である`CreatedNode`オブジェクトを検索します。`CreatedNode`オブジェクトの`LedgerIndex`フィールドはChannel IDを示します。（上記の例では、これは「5DB0...」で始まる16進文字列です。）Channel IDは、後でクレームに署名する際に必要です。
    PayChannelレジャーオブジェクトタイプの詳細については、[PayChannelレジャーオブジェクト](paychannel.html)を参照してください。


## 2. 受取人がPayment Channelの特性を確認します。

Payment Channelを見つけるには、以下の例（JSON-RPC APIを使用）に示すようにChannelの支払人を指定した[account_channelsメソッド][]を使用します。

要求:

    POST http://localhost:5005/
    Content-Type: application/json

    {
        "method": "account_channels",
        "params": [{
            "account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
            "destination_account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
            "ledger_index": "validated"
        }]
    }

応答:

    200 OK

    {
        "result": {
            "account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
            "channels": [{
                "account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
                "amount": "100000000",
                "balance": "0",
                "channel_id": "5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3",
                "destination_account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                "destination_tag": 20170428,
                "public_key": "aB44YfzW24VDEJQ2UuLPV2PvqcPCSoLnL7y5M1EzhdW4LnK5xMS3",
                "public_key_hex": "023693F15967AE357D0327974AD46FE3C127113B1110D6044FD41E723689F81CC6",
                "settle_delay": 86400
            }],
            "status": "success"
        }
    }

受取人は、以下のすべての点を含め、Payment Channelのパラメーターが特定のユースケースに適していることを確認します。

- `destination_account`フィールドに受取人の正しいアドレスが指定されていることを確認します。
- `settle_delay`フィールドに、受取人が未処理のクレームを清算するのに十分な決済遅延期間が秒単位で指定されていることを確認します。
- `cancel_after`（変更できない有効期限）フィールドと`expiration`（変更できる有効期限）フィールドが含まれている場合は、これらのフィールドの値が早過ぎないことを確認します。受取人はこれらの時刻をメモして、それらの時刻より前にクレームを清算できるようにします。
- `public_key`フィールドと`channel_id`フィールドをメモします。これらのフィールドは、後でクレームを検証、清算する際に必要です。
- _（省略可）_`destination_tag`フィールドが存在しており、必要な宛先タグが指定されていることを確認します。

2名の当事者間に複数のChannelが存在している可能性があるため、受取人が正しいChannelのクオリティを確認することが重要です。混乱する場合は、使用するChannelのChannel ID（`channel_id`）を支払人が明確にする必要があります。


## 3. 支払人がChannelのXRPに対して1つ以上の署名付き _クレーム_ を作成します。

これらのクレームの額は、支払人が購入する具体的な商品またはサービスに応じて異なります。

各クレームの額は累計額でなければなりません。つまり、2つのアイテムをそれぞれ10 XRPで購入する場合、1番目のクレームの額は10 XRPで、2番目のクレームの額は20 XRPである必要があります。クレームは、Channelに割り当てられているXRPの合計額を超えることはありません。（[PaymentChannelFund][]トランザクションでは、Channelに割り当てられるXRPの合計額を増加できます。）

[channel_authorizeメソッド][]を使用してクレームを作成できます。以下の例では、Channelから1 XRPが承認されます。

要求:

    POST http://localhost:5005/
    Content-Type: application/json

    {
        "method": "channel_authorize",
        "params": [{
            "channel_id": "5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3",
            "secret": "s████████████████████████████",
            "amount": "1000000"
        }]
    }

応答:

    {
        "result": {
            "signature": "304402204EF0AFB78AC23ED1C472E74F4299C0C21F1B21D07EFC0A3838A420F76D783A400220154FB11B6F54320666E4C36CA7F686C16A3A0456800BBC43746F34AF50290064",
            "status": "success"
        }
    }


## 4. 支払人が、商品またはサービスに対する支払いとしてクレームを受取人に送信します。

この通信は、支払人と受取人が合意できる通信システムで「レジャー外」で行われます。これには安全な通信を使用する必要がありますが、必須ではありません。Channelの支払人または受取人がそのChannelに対するクレームを清算できます。

クレームで以下の情報が伝達される限り、クレームの厳密なフォーマットは重要ではありません。

| フィールド                   | 例                                            |
|:------------------------|:---------------------------------------------------|
| Channel ID              | `5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3` |
| XRPの額（drop単位） | `1000000`                                          |
| 署名               | `304402204EF0AFB78AC23ED1C472E74F4299C0C21F1B21D07EFC0A3838A420F76D783A` <br/> `400220154FB11B6F54320666E4C36CA7F686C16A3A0456800BBC43746F34AF50290064` _（注記: この長い文字列は1行に収まるように改行されています）_ |

受取人は、Channelに関連付けられている公開鍵も把握する必要があります。この鍵は、Channelの存続期間中変更されることはありません。

## 5. 受取人がクレームを検証します。

[channel_verifyメソッド][]を使用してクレームを検証できます。受取人は、クレームの額が提供した商品およびサービスの合計価格以上であることを確認する必要があります。（金額は累計額であるため、これまでに購入されたすべての商品およびサービスの合計価格です。）

JSON-RPC APIで`channel_verify`を使用する例:

要求:

    POST http://localhost:5005/
    Content-Type: application/json

    {
        "method": "channel_verify",
        "params": [{
            "channel_id": "5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3",
            "signature": "304402204EF0AFB78AC23ED1C472E74F4299C0C21F1B21D07EFC0A3838A420F76D783A400220154FB11B6F54320666E4C36CA7F686C16A3A0456800BBC43746F34AF50290064",
            "public_key": "aB44YfzW24VDEJQ2UuLPV2PvqcPCSoLnL7y5M1EzhdW4LnK5xMS3",
            "amount": "1000000"
        }]
    }

応答:

    200 OK

    {
        "result": {
            "signature_verified":true,
            "status":"success"
        }
    }

応答に`"signature_verified": true`が含まれている場合、クレームの署名は真正です。受取人は、クレームを換金できる十分なXRPがChannelにあること**も**確認する必要があります。このためには、受取人は[account_channelsメソッド][]を使用して、Payment Channelの最新の検証済み状態を確認します。

要求:

    POST http://localhost:5005/
    Content-Type: application/json

    {
        "method": "account_channels",
        "params": [{
            "account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
            "destination_account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
            "ledger_index": "validated"
        }]
    }

応答:

    200 OK

    {
        "result": {
            "account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
            "channels": [{
                "account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
                "amount": "100000000",
                "balance": "0",
                "channel_id": "5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3",
                "destination_account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                "destination_tag": 20170428,
                "public_key": "aB44YfzW24VDEJQ2UuLPV2PvqcPCSoLnL7y5M1EzhdW4LnK5xMS3",
                "public_key_hex": "023693F15967AE357D0327974AD46FE3C127113B1110D6044FD41E723689F81CC6",
                "settle_delay": 86400
            }],
            "status": "success"
        }
    }

受取人は以下の点を確認する必要があります:

- `channel_id`がクレームのChannel IDと一致する`channels`配列のオブジェクトを見つけます。同一の当事者間であっても複数のPayment Channelが存在していることがありますが、クレームはIDが一致するChannelでのみ清算できます。
- Channelの`expiration`（変更可能な有効期限）がある場合は、この期限が早過ぎないことを確認します。受取人はこの期限の前にクレームを清算する必要があります。
- クレームの`amount`がChannelの`amount`以下であることを確認します。クレームの`amount`の方が大きい場合、支払人が[PaymentChannelFundトランザクション][]を使用してChannelで使用可能なXRPの合計額を増加しない限り、クレームを清算できません。
- Channelの`balance`が、受取人がすでにChannelから受領していると予測している額と一致していることを確認します。これらの金額が一致しない場合、受取人はChannelのトランザクション履歴を再度確認する必要があります。不一致の原因として以下のものが考えられます。
    - 支払人が[PaymentChannelClaim][]トランザクションを使用してChannelから受取人にXRPを送金したところ、受取人がこれに気付かず、着信トランザクションを記録していなかった。
    - 受取人のレコードに、「処理中」のトランザクションや、最新の検証済みレジャーバージョンにはまだ記録されていないトランザクションが含まれていた。受取人は[txメソッド][]を使用して個々のトランザクションの状態を調べ、この点を確認できます。
    - `account_channels`要求に正しいレジャーバージョンが指定されていなかった。（最新の検証済みバージョンを確認するには、`"ledger_index":"validated”`を使用します）
    - 受取人は以前にXRPを清算したものの、記録し忘れていた。
    - 受取人がXRPの清算を試行し、暫定的な結果を記録したが、トランザクションの最終的な検証済みの結果がこれとは異なり、受取人はこの最終検証済み結果を記録し忘れていた。
    - 受取人が照会した`rippled`サーバーが、ネットワークの他の部分と同期していない状態であったか、または不明なバグが発生した。サーバーの状態を確認するには、[server_infoメソッド][]を使用します。（この状況を再現できる場合は、[問題を報告してください](https://github.com/ripple/rippled/issues/)。）

受取人がPayment Channelの署名と現行状態の両方を確認した後で、XRPをまだ受領していない場合、XRPを清算するトランザクションがChannelの有効期限より前に処理される限り、XRPを確実に清算 _できます_ 。


## 6. 受取人が商品またはサービスを提供します。

この時点で受取人は支払がすでに保証されていることを把握しているので、商品またはサービスを支払人に提供できます。

このチュートリアルに関して、受取人は支払人に「商品およびサービス」としてハイタッチまたは同等のオンラインメッセージを送信できます。


## 7. 必要に応じてステップ3～6を繰り返します。

支払人と受取人はXRP Ledger自体を待つことなく、ステップ3～6（商品およびサービスと交換するクレームの作成、送信、検証）を必要な回数と間隔で繰り返すことができます。この処理に関する2つの主な制限を以下に示します。

- Payment ChannelのXRPの額。（支払人は必要に応じて[PaymentChannelFundトランザクション][]を送信し、Channelで使用可能なXRPの合計額を増加できます。）

- Payment Channelの変更可能な有効期限（設定されている場合）。（これは[account_channelsメソッド][]に対する応答の`cancel_after`フィールドに表示されます。）


## 8. 準備が完了すれば、受取人は承認された額のクレームを清算します。

この時点で受取人は最終的にChannelからXRPを受領します。

これは、`Balance`、`Amount`、`Signature`、および`PublicKey`フィールドが指定された[PaymentChannelClaimトランザクション][]です。クレームの値は累計額であるため、受取人は最も高額な（最新の）クレームを清算するだけで全額を受領できます。受取人は、承認済みの額全額をクレームで清算する必要はありません。

受取人は必要に応じて、取引継続中にこの手順を繰り返し実行して、一部の額を決済することができます。

ChannelからXRPを清算する例:

要求:

    POST http://localhost:5005/
    Content-Type: application/json

    {
        "method": "submit",
        "params": [{
                "secret": "s████████████████████████████",
                "tx_json": {
                    "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                    "TransactionType": "PaymentChannelClaim",
                    "Amount": "1000000",
                    "Balance": "1000000",
                    "Channel": "5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3",
                    "PublicKey": "023693F15967AE357D0327974AD46FE3C127113B1110D6044FD41E723689F81CC6",
                    "Signature": "304402204EF0AFB78AC23ED1C472E74F4299C0C21F1B21D07EFC0A3838A420F76D783A400220154FB11B6F54320666E4C36CA7F686C16A3A0456800BBC43746F34AF50290064"
                },
                "fee_mult_max": 1000
            }]
    }

応答:

    200 OK

    {
        "result": {
            "engine_result": "tesSUCCESS",
            "engine_result_code": 0,
            "engine_result_message": "The transaction was applied.Only final in a validated ledger.",
            "status": "success",
            "tx_blob": "12000F2280000000240000017450165DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB36140000000000F42406240000000000F424068400000000000000A7121023693F15967AE357D0327974AD46FE3C127113B1110D6044FD41E723689F81CC6732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB7447304502210096B933BC24DA77D8C4057B4780B282BA66C668DFE1ACF4EEC063AD6661725797022037C8823669CE91AACA8CC754C9F041359F85B0B32384AEA141EBC3603798A24C7646304402204EF0AFB78AC23ED1C472E74F4299C0C21F1B21D07EFC0A3838A420F76D783A400220154FB11B6F54320666E4C36CA7F686C16A3A0456800BBC43746F34AF5029006481144B4E9C06F24296074F7BC48F92A97916C6DC5EA9",
            "tx_json": {
                "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                "Amount": "1000000",
                "Balance": "1000000",
                "Channel": "5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3",
                "Fee": "10",
                "Flags": 2147483648,
                "PublicKey": "023693F15967AE357D0327974AD46FE3C127113B1110D6044FD41E723689F81CC6",
                "Sequence": 372,
                "Signature": "304402204EF0AFB78AC23ED1C472E74F4299C0C21F1B21D07EFC0A3838A420F76D783A400220154FB11B6F54320666E4C36CA7F686C16A3A0456800BBC43746F34AF50290064",
                "SigningPubKey": "03AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB",
                "TransactionType": "PaymentChannelClaim",
                "TxnSignature": "304502210096B933BC24DA77D8C4057B4780B282BA66C668DFE1ACF4EEC063AD6661725797022037C8823669CE91AACA8CC754C9F041359F85B0B32384AEA141EBC3603798A24C",
                "hash": "C9FE08FC88CF76C3B06622ADAA47AE99CABB3380E4D195E7751274CFD87910EB"
            }
        }
    }

受取人は検証済みレジャーでこのトランザクションが正常に処理されたことを確認します。詳細は、[確実なトランザクションの送信](reliable-transaction-submission.html)を参照してください。

## 9. 支払人と受取人の取引完了後、支払人はChannelの閉鎖を要求します。

これは、`tfClose`フラグを設定した[PaymentChannelClaimトランザクション][]、または`Expiration`フィールドを設定した[PaymentChannelFundトランザクション][]です。_（[フローチャート][]の9a）_。

支払人がChannelの閉鎖を要求した時点でChannelにXRPが残っていない場合は、Channelは即時に閉鎖されます。

ChannelにXRPが _残っている_ 場合は、このChannelの閉鎖要求は、受取人に対し未処理のクレームを速やかに清算することを求める最終警告となります。Channelの閉鎖までに、少なくとも決済遅延期間相当の時間が受取人に残されています。正確な秒数は、レジャーの閉鎖時刻に応じて多少異なります。

また、受取人はクレームの処理完了直後にPayment Channelを閉鎖できます _（[フローチャート][]の9b）_。

Channelの閉鎖を要求する[トランザクションを送信する](submit.html#署名と送信モード)例:

    {
        "method": "submit",
        "params": [{
            "secret": "s████████████████████████████",
            "tx_json": {
                "Account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
                "TransactionType": "PaymentChannelClaim",
                "Channel": "5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3",
                "Flags": 2147614720
            },
            "fee_mult_max": 1000
        }]
    }

トランザクションが検証済みレジャーに記録されたら、いずれの当事者も[account_channelsメソッド][]を使用して現在スケジュールされているChannelの有効期限を確認できます。最新の検証済みレジャーバージョンからデータを取得するには、`"ledger_index": "validated"`を必ず指定してください。

`account_channels`応答の例:

    {
        "result": {
            "account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
            "channels": [
                {
                    "account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
                    "amount": "100000000",
                    "balance": "1000000",
                    "channel_id": "5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3",
                    "destination_account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                    "destination_tag": 20170428,
                    "expiration": 547073182,
                    "public_key": "aB44YfzW24VDEJQ2UuLPV2PvqcPCSoLnL7y5M1EzhdW4LnK5xMS3",
                    "public_key_hex": "023693F15967AE357D0327974AD46FE3C127113B1110D6044FD41E723689F81CC6",
                    "settle_delay": 86400
                }
            ],
            "status": "success"
        }
    }

この例に示されている`expiration`の値547073182（[Rippleエポック以降の経過秒数][]） は2017-05-02T20:46:22Zに対応しています。このため、この時刻までに決済されなかったクレームはすべて無効になります。

## 10. 有効期限切れのChannelは誰でも閉鎖できます。

決済遅延が経過するか、またはChannelが予定されている有効期限に達したら、Channelは有効期限切れになります。それ以降に行われるこのChannelに影響するトランザクションはすべて、Channelを閉鎖するだけであり、未請求のXRPは支払人に返金されます。

Channelは期限切れ状態で永久にレジャーに残ることがあります。これは、レジャーはトランザクションの結果によってのみ変わるので、_誰かが_ 有効期限切れのChannelを閉鎖するトランザクションを送信する必要があるためです。Channelがレジャーに残っている限り、そのChannelは[所有者準備金](reserves.html#所有者準備金)の点から支払人が所有するオブジェクトと見なされます。

このため、支払人には`tfClose`フラグを指定した2番目の[PaymentChannelClaimトランザクション][]を送信することが推奨されます。ただしその他のアカウント（Payment Channelに関与するアカウントを含む）は有効期限切れのChannelを閉鎖できません。

このトランザクションを送信するコマンドは、Channelの有効期限切れを要求する前述の例と同じです。（ただしコマンドの実行結果である[自動入力](transaction-common-fields.html#自動入力可能なフィールド) `Sequence`番号、署名、識別用ハッシュは一意です。）

有効期限切れのChannelを閉鎖するトランザクションを[送信する](submit.html#署名と送信モード)例:

    {
        "method": "submit",
        "params": [{
            "secret": "s████████████████████████████",
            "tx_json": {
                "Account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
                "TransactionType": "PaymentChannelClaim",
                "Channel": "5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3",
                "Flags": 2147614720
            },
            "fee_mult_max": 1000
        }]
    }

トランザクションが検証済みレジャーに記録されたら、そのトランザクションのメタデータを調べて、Channelが削除され、XRPが送金元に返金されたことを確認できます。

このステップのトランザクションを検索する[txメソッド][]を使用した場合の応答の例:

    {
        "result": {
            "Account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
            "Channel": "5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3",
            "Fee": "5606",
            "Flags": 2147614720,
            "Sequence": 41,
            "SigningPubKey": "023693F15967AE357D0327974AD46FE3C127113B1110D6044FD41E723689F81CC6",
            "TransactionType": "PaymentChannelClaim",
            "TxnSignature": "3044022008922FEB6F7D35D42006685BCBB007103D2A40AFAA69A7CFC10DF529F94BB6A402205D67816F50BBAEE0A2709AA3A93707304EC21133550FD2FF7436AD0C3CA6CE27",
            "date": 547091262,
            "hash": "9C0CAAC3DD1A74461132DA4451F9E53BDF4C93DFDBEFCE1B10021EC569013B33",
            "inLedger": 29480670,
            "ledger_index": 29480670,
            "meta": {
                "AffectedNodes": [
                    {
                        "ModifiedNode": {
                            "LedgerEntryType": "AccountRoot",
                            "LedgerIndex": "13F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8",
                            "PreviousTxnID": "C9FE08FC88CF76C3B06622ADAA47AE99CABB3380E4D195E7751274CFD87910EB",
                            "PreviousTxnLgrSeq": 29385089
                        }
                    },
                    {
                        "DeletedNode": {
                            "FinalFields": {
                                "Account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
                                "Amount": "100000000",
                                "Balance": "1000000",
                                "Destination": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                                "DestinationTag": 20170428,
                                "Expiration": 547073182,
                                "Flags": 0,
                                "OwnerNode": "0000000000000000",
                                "PreviousTxnID": "C5C70B2BCC515165B7F62ACC8126F8F8B655EB6E1D949A49B2358262BDA986B4",
                                "PreviousTxnLgrSeq": 29451256,
                                "PublicKey": "023693F15967AE357D0327974AD46FE3C127113B1110D6044FD41E723689F81CC6",
                                "SettleDelay": 86400
                            },
                            "LedgerEntryType": "PayChannel",
                            "LedgerIndex": "5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3"
                        }
                    },
                    {
                        "ModifiedNode": {
                            "FinalFields": {
                                "Account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
                                "Balance": "1041862844",
                                "Flags": 0,
                                "OwnerCount": 2,
                                "Sequence": 42
                            },
                            "LedgerEntryType": "AccountRoot",
                            "LedgerIndex": "B1CB040A17F9469BC00376EC8719535655824AD16CB5F539DD5765FEA88FDBE3",
                            "PreviousFields": {
                                "Balance": "942868450",
                                "OwnerCount": 3,
                                "Sequence": 41
                            },
                            "PreviousTxnID": "C5C70B2BCC515165B7F62ACC8126F8F8B655EB6E1D949A49B2358262BDA986B4",
                            "PreviousTxnLgrSeq": 29451256
                        }
                    },
                    {
                        "ModifiedNode": {
                            "FinalFields": {
                                "Flags": 0,
                                "Owner": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
                                "RootIndex": "E590FC40B4F24D18341569BD3702A2D4E07E7BC04D11CE63608B67979E67030C"
                            },
                            "LedgerEntryType": "DirectoryNode",
                            "LedgerIndex": "E590FC40B4F24D18341569BD3702A2D4E07E7BC04D11CE63608B67979E67030C"
                        }
                    }
                ],
                "TransactionIndex": 7,
                "TransactionResult": "tesSUCCESS"
            },
            "status": "success",
            "validated": true
        }
    }

トランザクションメタデータで以下のエントリを検索します。

- `"LedgerEntryType": "PayChannel"`が指定された`DeletedNode`。`LedgerIndex`フィールドはChannel IDと一致している必要があります。これはChannelが削除されたことを示します。
- `"LedgerEntryType": "AccountRoot"`が指定された`ModifiedNode`。`PreviousFields`と`FinalFields`の`Balance`フィールドの変化は、支払人に返金される未使用のXRPを反映しています。

これらのフィールドは、Payment Channelが閉鎖したことを示しています。


## 結論

これでPayment Channelの使用法のチュートリアルを終了します。ユーザーが、Payment Channelのスピードと利便性を最大限に活用できる独特で興味深い用途を考えることが推奨されます。



<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
