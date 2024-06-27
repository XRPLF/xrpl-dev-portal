---
html: account_objects.html
parent: account-methods.html
seo:
    description: アカウントが所有するすべてのオブジェクトを返します。
labels:
  - アカウント
  - データ保持
---
# account_objects
[[ソース]](https://github.com/XRPLF/rippled/blob/399c43cae6e90a428e9ce6a988123972b0f03c99/src/ripple/rpc/handlers/AccountObjects.cpp "Source")

`account_objects`コマンドは、アカウントが所有するすべてのレジャーエントリの生[レジャーフォーマット][]を返します。アカウントのトラストラインと残高の概要については、[account_linesメソッド][]をご覧ください。

アカウントの`account_objects`レスポンスに含まれる可能性のあるオブジェクトのタイプには以下のものがあります。

- [Bridgeエントリ](../../../protocol/ledger-data/ledger-entry-types/bridge.md): クロスチェーンブリッジ向けs. _([XChainBridge amendment][]が必要です {% not-enabled /%})_
- [Checkエントリ](../../../protocol/ledger-data/ledger-entry-types/check.md): 保留中のCheck。
- [DepositPreauthエントリ](../../../protocol/ledger-data/ledger-entry-types/depositpreauth.md): 入金の事前承認。
- [Escrowエントリ](../../../../concepts/payment-types/escrow.md): 実行されていないかまたはキャンセルされていない保留中の支払い。
- [NFTokenOfferエントリ](../../../protocol/ledger-data/ledger-entry-types/nftokenoffer.md): NFTを購入・売却するためのオファー。
- [NFTokenPageエントリ](../../../protocol/ledger-data/ledger-entry-types/nftokenpage.md): NFTの集合。 {% badge href="https://github.com/XRPLF/rippled/releases/tag/1.11.0" %}新規: rippled 1.11.0{% /badge %}
- [Offerエントリ](../../../protocol/ledger-data/ledger-entry-types/offer.md): 現在処理中であり、資金化されていない、または有効期限切れで削除されていない注文情報。（詳細は、[オファーのライフサイクル](../../../../concepts/tokens/decentralized-exchange/offers.md#オファーのライフサイクル)をご覧ください。）
- [PayChannelエントリ](../../../protocol/ledger-data/ledger-entry-types/paychannel.md): 現在開いているペイメントチャネル。
- [RippleStateエントリ](../../../protocol/ledger-data/ledger-entry-types/ripplestate.md): このアカウント側がデフォルト状態にないトラストライン。
- アカウントの[SignerList](../../../protocol/ledger-data/ledger-entry-types/signerlist.md): アカウントで[マルチシグ](../../../../concepts/accounts/multi-signing.md)が有効な場合。
- [Ticketエントリ](../../../../concepts/accounts/tickets.md): Ticket情報。


## リクエストのフォーマット
リクエストのフォーマットの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 1,
  "command": "account_objects",
  "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
  "ledger_index": "validated",
  "type": "state",
  "deletion_blockers_only": false,
  "limit": 10
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "account_objects",
    "params": [
        {
            "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
            "ledger_index": "validated",
            "type": "state",
            "deletion_blockers_only": false,
            "limit": 10
        }
    ]
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
#Syntax: account_objects <account> [<ledger>]
rippled account_objects r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59 validated
```
{% /tab %}

{% /tabs %}

リクエストには以下のパラメーターが含まれます。

| `Field`                  | 型                    | 必須? | 説明           |
|:-------------------------|:----------------------|:-----|:---------------|
| `account`                | 文字列                 | はい  | アカウントの一意のIDであり、最も一般的にはアカウントのアドレスが使用されます。 |
| `deletion_blockers_only` | Boolean               | いいえ | `true`の場合、このアカウントが[削除](../../../../concepts/accounts/deleting-accounts.md)されるのをブロックするオブジェクトのみをレスポンスに含めます。デフォルトは`false`です。 {% badge href="https://github.com/XRPLF/rippled/releases/tag/1.4.0" %}新規: rippled 1.4.0{% /badge %} |
| `ledger_hash`            | [ハッシュ][]           | いいえ | 使用するレジャーバージョンの20バイトの16進文字列。（[レジャーの指定][]をご覧ください） |
| `ledger_index`           | [レジャーインデックス][] | いいえ | 使用するレジャーの[レジャーインデックス][]、またはレジャーを自動的に選択するためのショートカット文字列。（[レジャーの指定][]ををご覧ください） |
| `limit`                  | 符号なし整数            | いいえ | 結果に含めることができるオブジェクトの最大数。非管理者接続では10以上400以下の範囲で値を指定する必要があります。デフォルトでは200です。 |
| `marker`                 | [マーカー][]           | いいえ | 以前にページネーションされたレスポンスの値。そのレスポンスを停止した箇所からデータの取得を再開します。 |
| `type`                   | 文字列                 | いいえ | 指定されている場合、結果をフィルタリングしてこのタイプのレジャーオブジェクトのみが含まれるようにします。有効なタイプは`bridge`, `check`、`deposit_preauth`、`escrow`、`nft_offer`, `nft_page`, `offer`、`payment_channel`、`signer_list`、`state`（トラストライン）そして`ticket`です。 |

**注記:** `account_objects`コマンドのコマンドラインインタフェースは`type`フィールドを受け付けません。代わりにコマンドラインでJSON-RPC形式のリクエストを送信するには[jsonメソッド][]を使用してください。

## レスポンスのフォーマット

処理が成功したレスポンスの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "id": 8,
    "status": "success",
    "type": "response",
    "result": {
        "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
        "account_objects": [
            {
                "Balance": {
                    "currency": "ASP",
                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                    "value": "0"
                },
                "Flags": 65536,
                "HighLimit": {
                    "currency": "ASP",
                    "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                    "value": "0"
                },
                "HighNode": "0000000000000000",
                "LedgerEntryType": "RippleState",
                "LowLimit": {
                    "currency": "ASP",
                    "issuer": "r3vi7mWxru9rJCxETCyA1CHvzL96eZWx5z",
                    "value": "10"
                },
                "LowNode": "0000000000000000",
                "PreviousTxnID": "BF7555B0F018E3C5E2A3FF9437A1A5092F32903BE246202F988181B9CED0D862",
                "PreviousTxnLgrSeq": 1438879,
                "index": "2243B0B630EA6F7330B654EFA53E27A7609D9484E535AB11B7F946DF3D247CE9"
            },
            {
                "Balance": {
                    "currency": "XAU",
                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                    "value": "0"
                },
                "Flags": 3342336,
                "HighLimit": {
                    "currency": "XAU",
                    "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                    "value": "0"
                },
                "HighNode": "0000000000000000",
                "LedgerEntryType": "RippleState",
                "LowLimit": {
                    "currency": "XAU",
                    "issuer": "r3vi7mWxru9rJCxETCyA1CHvzL96eZWx5z",
                    "value": "0"
                },
                "LowNode": "0000000000000000",
                "PreviousTxnID": "79B26D7D34B950AC2C2F91A299A6888FABB376DD76CFF79D56E805BF439F6942",
                "PreviousTxnLgrSeq": 5982530,
                "index": "9ED4406351B7A511A012A9B5E7FE4059FA2F7650621379C0013492C315E25B97"
            },
            {
                "Balance": {
                    "currency": "USD",
                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                    "value": "0"
                },
                "Flags": 1114112,
                "HighLimit": {
                    "currency": "USD",
                    "issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
                    "value": "0"
                },
                "HighNode": "0000000000000000",
                "LedgerEntryType": "RippleState",
                "LowLimit": {
                    "currency": "USD",
                    "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                    "value": "5"
                },
                "LowNode": "0000000000000000",
                "PreviousTxnID": "6FE8C824364FB1195BCFEDCB368DFEE3980F7F78D3BF4DC4174BB4C86CF8C5CE",
                "PreviousTxnLgrSeq": 10555014,
                "index": "2DECFAC23B77D5AEA6116C15F5C6D4669EBAEE9E7EE050A40FE2B1E47B6A9419"
            },
            {
                "Balance": {
                    "currency": "MXN",
                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                    "value": "481.992867407479"
                },
                "Flags": 65536,
                "HighLimit": {
                    "currency": "MXN",
                    "issuer": "rHpXfibHgSb64n8kK9QWDpdbfqSpYbM9a4",
                    "value": "0"
                },
                "HighNode": "0000000000000000",
                "LedgerEntryType": "RippleState",
                "LowLimit": {
                    "currency": "MXN",
                    "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                    "value": "1000"
                },
                "LowNode": "0000000000000000",
                "PreviousTxnID": "A467BACE5F183CDE1F075F72435FE86BAD8626ED1048EDEFF7562A4CC76FD1C5",
                "PreviousTxnLgrSeq": 3316170,
                "index": "EC8B9B6B364AF6CB6393A423FDD2DDBA96375EC772E6B50A3581E53BFBDFDD9A"
            },
            {
                "Balance": {
                    "currency": "EUR",
                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                    "value": "0.793598266778297"
                },
                "Flags": 1114112,
                "HighLimit": {
                    "currency": "EUR",
                    "issuer": "rLEsXccBGNR3UPuPu2hUXPjziKC3qKSBun",
                    "value": "0"
                },
                "HighNode": "0000000000000000",
                "LedgerEntryType": "RippleState",
                "LowLimit": {
                    "currency": "EUR",
                    "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                    "value": "1"
                },
                "LowNode": "0000000000000000",
                "PreviousTxnID": "E9345D44433EA368CFE1E00D84809C8E695C87FED18859248E13662D46A0EC46",
                "PreviousTxnLgrSeq": 5447146,
                "index": "4513749B30F4AF8DA11F077C448128D6486BF12854B760E4E5808714588AA915"
            },
            {
                "Balance": {
                    "currency": "CNY",
                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                    "value": "0"
                },
                "Flags": 2228224,
                "HighLimit": {
                    "currency": "CNY",
                    "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                    "value": "3"
                },
                "HighNode": "0000000000000000",
                "LedgerEntryType": "RippleState",
                "LowLimit": {
                    "currency": "CNY",
                    "issuer": "rnuF96W4SZoCJmbHYBFoJZpR8eCaxNvekK",
                    "value": "0"
                },
                "LowNode": "0000000000000008",
                "PreviousTxnID": "2FDDC81F4394695B01A47913BEC4281AC9A283CC8F903C14ADEA970F60E57FCF",
                "PreviousTxnLgrSeq": 5949673,
                "index": "578C327DA8944BDE2E10C9BA36AFA2F43E06C8D1E8819FB225D266CBBCFDE5CE"
            },
            {
                "Balance": {
                    "currency": "DYM",
                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                    "value": "1.336889190631542"
                },
                "Flags": 65536,
                "HighLimit": {
                    "currency": "DYM",
                    "issuer": "rGwUWgN5BEg3QGNY3RX2HfYowjUTZdid3E",
                    "value": "0"
                },
                "HighNode": "0000000000000000",
                "LedgerEntryType": "RippleState",
                "LowLimit": {
                    "currency": "DYM",
                    "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                    "value": "3"
                },
                "LowNode": "0000000000000000",
                "PreviousTxnID": "6DA2BD02DFB83FA4DAFC2651860B60071156171E9C021D9E0372A61A477FFBB1",
                "PreviousTxnLgrSeq": 8818732,
                "index": "5A2A5FF12E71AEE57564E624117BBA68DEF78CD564EF6259F92A011693E027C7"
            },
            {
                "Balance": {
                    "currency": "CHF",
                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                    "value": "-0.3488146605801446"
                },
                "Flags": 131072,
                "HighLimit": {
                    "currency": "CHF",
                    "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                    "value": "0"
                },
                "HighNode": "0000000000000000",
                "LedgerEntryType": "RippleState",
                "LowLimit": {
                    "currency": "CHF",
                    "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                    "value": "0"
                },
                "LowNode": "000000000000008C",
                "PreviousTxnID": "722394372525A13D1EAAB005642F50F05A93CF63F7F472E0F91CDD6D38EB5869",
                "PreviousTxnLgrSeq": 2687590,
                "index": "F2DBAD20072527F6AD02CE7F5A450DBC72BE2ABB91741A8A3ADD30D5AD7A99FB"
            },
            {
                "Balance": {
                    "currency": "BTC",
                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                    "value": "0"
                },
                "Flags": 131072,
                "HighLimit": {
                    "currency": "BTC",
                    "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                    "value": "3"
                },
                "HighNode": "0000000000000000",
                "LedgerEntryType": "RippleState",
                "LowLimit": {
                    "currency": "BTC",
                    "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                    "value": "0"
                },
                "LowNode": "0000000000000043",
                "PreviousTxnID": "03EDF724397D2DEE70E49D512AECD619E9EA536BE6CFD48ED167AE2596055C9A",
                "PreviousTxnLgrSeq": 8317037,
                "index": "767C12AF647CDF5FEB9019B37018748A79C50EDAF87E8D4C7F39F78AA7CA9765"
            },
            {
                "Balance": {
                    "currency": "USD",
                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                    "value": "-16.00534471983042"
                },
                "Flags": 131072,
                "HighLimit": {
                    "currency": "USD",
                    "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                    "value": "5000"
                },
                "HighNode": "0000000000000000",
                "LedgerEntryType": "RippleState",
                "LowLimit": {
                    "currency": "USD",
                    "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                    "value": "0"
                },
                "LowNode": "000000000000004A",
                "PreviousTxnID": "CFFF5CFE623C9543308C6529782B6A6532207D819795AAFE85555DB8BF390FE7",
                "PreviousTxnLgrSeq": 14365854,
                "index": "826CF5BFD28F3934B518D0BDF3231259CBD3FD0946E3C3CA0C97D2C75D2D1A09"
            }
        ],
        "ledger_hash": "053DF17D2289D1C4971C22F235BC1FCA7D4B3AE966F842E5819D0749E0B8ECD3",
        "ledger_index": 14378733,
        "limit": 10,
        "marker": "F60ADF645E78B69857D2E4AEC8B7742FEABC8431BD8611D099B428C3E816DF93,94A9F05FEF9A153229E2E997E64919FD75AAE2028C8153E8EBDB4440BD3ECBB5",
        "validated": true
    }
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
200 OK
{
    "result": {
        "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
        "account_objects": [
            {
                "Balance": {
                    "currency": "ASP",
                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                    "value": "0"
                },
                "Flags": 65536,
                "HighLimit": {
                    "currency": "ASP",
                    "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                    "value": "0"
                },
                "HighNode": "0000000000000000",
                "LedgerEntryType": "RippleState",
                "LowLimit": {
                    "currency": "ASP",
                    "issuer": "r3vi7mWxru9rJCxETCyA1CHvzL96eZWx5z",
                    "value": "10"
                },
                "LowNode": "0000000000000000",
                "PreviousTxnID": "BF7555B0F018E3C5E2A3FF9437A1A5092F32903BE246202F988181B9CED0D862",
                "PreviousTxnLgrSeq": 1438879,
                "index": "2243B0B630EA6F7330B654EFA53E27A7609D9484E535AB11B7F946DF3D247CE9"
            },
            {
                "Balance": {
                    "currency": "XAU",
                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                    "value": "0"
                },
                "Flags": 3342336,
                "HighLimit": {
                    "currency": "XAU",
                    "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                    "value": "0"
                },
                "HighNode": "0000000000000000",
                "LedgerEntryType": "RippleState",
                "LowLimit": {
                    "currency": "XAU",
                    "issuer": "r3vi7mWxru9rJCxETCyA1CHvzL96eZWx5z",
                    "value": "0"
                },
                "LowNode": "0000000000000000",
                "PreviousTxnID": "79B26D7D34B950AC2C2F91A299A6888FABB376DD76CFF79D56E805BF439F6942",
                "PreviousTxnLgrSeq": 5982530,
                "index": "9ED4406351B7A511A012A9B5E7FE4059FA2F7650621379C0013492C315E25B97"
            },
            {
                "Balance": {
                    "currency": "USD",
                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                    "value": "0"
                },
                "Flags": 1114112,
                "HighLimit": {
                    "currency": "USD",
                    "issuer": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
                    "value": "0"
                },
                "HighNode": "0000000000000000",
                "LedgerEntryType": "RippleState",
                "LowLimit": {
                    "currency": "USD",
                    "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                    "value": "5"
                },
                "LowNode": "0000000000000000",
                "PreviousTxnID": "6FE8C824364FB1195BCFEDCB368DFEE3980F7F78D3BF4DC4174BB4C86CF8C5CE",
                "PreviousTxnLgrSeq": 10555014,
                "index": "2DECFAC23B77D5AEA6116C15F5C6D4669EBAEE9E7EE050A40FE2B1E47B6A9419"
            },
            {
                "Balance": {
                    "currency": "MXN",
                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                    "value": "481.992867407479"
                },
                "Flags": 65536,
                "HighLimit": {
                    "currency": "MXN",
                    "issuer": "rHpXfibHgSb64n8kK9QWDpdbfqSpYbM9a4",
                    "value": "0"
                },
                "HighNode": "0000000000000000",
                "LedgerEntryType": "RippleState",
                "LowLimit": {
                    "currency": "MXN",
                    "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                    "value": "1000"
                },
                "LowNode": "0000000000000000",
                "PreviousTxnID": "A467BACE5F183CDE1F075F72435FE86BAD8626ED1048EDEFF7562A4CC76FD1C5",
                "PreviousTxnLgrSeq": 3316170,
                "index": "EC8B9B6B364AF6CB6393A423FDD2DDBA96375EC772E6B50A3581E53BFBDFDD9A"
            },
            {
                "Balance": {
                    "currency": "EUR",
                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                    "value": "0.793598266778297"
                },
                "Flags": 1114112,
                "HighLimit": {
                    "currency": "EUR",
                    "issuer": "rLEsXccBGNR3UPuPu2hUXPjziKC3qKSBun",
                    "value": "0"
                },
                "HighNode": "0000000000000000",
                "LedgerEntryType": "RippleState",
                "LowLimit": {
                    "currency": "EUR",
                    "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                    "value": "1"
                },
                "LowNode": "0000000000000000",
                "PreviousTxnID": "E9345D44433EA368CFE1E00D84809C8E695C87FED18859248E13662D46A0EC46",
                "PreviousTxnLgrSeq": 5447146,
                "index": "4513749B30F4AF8DA11F077C448128D6486BF12854B760E4E5808714588AA915"
            },
            {
                "Balance": {
                    "currency": "CNY",
                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                    "value": "0"
                },
                "Flags": 2228224,
                "HighLimit": {
                    "currency": "CNY",
                    "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                    "value": "3"
                },
                "HighNode": "0000000000000000",
                "LedgerEntryType": "RippleState",
                "LowLimit": {
                    "currency": "CNY",
                    "issuer": "rnuF96W4SZoCJmbHYBFoJZpR8eCaxNvekK",
                    "value": "0"
                },
                "LowNode": "0000000000000008",
                "PreviousTxnID": "2FDDC81F4394695B01A47913BEC4281AC9A283CC8F903C14ADEA970F60E57FCF",
                "PreviousTxnLgrSeq": 5949673,
                "index": "578C327DA8944BDE2E10C9BA36AFA2F43E06C8D1E8819FB225D266CBBCFDE5CE"
            },
            {
                "Balance": {
                    "currency": "DYM",
                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                    "value": "1.336889190631542"
                },
                "Flags": 65536,
                "HighLimit": {
                    "currency": "DYM",
                    "issuer": "rGwUWgN5BEg3QGNY3RX2HfYowjUTZdid3E",
                    "value": "0"
                },
                "HighNode": "0000000000000000",
                "LedgerEntryType": "RippleState",
                "LowLimit": {
                    "currency": "DYM",
                    "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                    "value": "3"
                },
                "LowNode": "0000000000000000",
                "PreviousTxnID": "6DA2BD02DFB83FA4DAFC2651860B60071156171E9C021D9E0372A61A477FFBB1",
                "PreviousTxnLgrSeq": 8818732,
                "index": "5A2A5FF12E71AEE57564E624117BBA68DEF78CD564EF6259F92A011693E027C7"
            },
            {
                "Balance": {
                    "currency": "CHF",
                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                    "value": "-0.3488146605801446"
                },
                "Flags": 131072,
                "HighLimit": {
                    "currency": "CHF",
                    "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                    "value": "0"
                },
                "HighNode": "0000000000000000",
                "LedgerEntryType": "RippleState",
                "LowLimit": {
                    "currency": "CHF",
                    "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                    "value": "0"
                },
                "LowNode": "000000000000008C",
                "PreviousTxnID": "722394372525A13D1EAAB005642F50F05A93CF63F7F472E0F91CDD6D38EB5869",
                "PreviousTxnLgrSeq": 2687590,
                "index": "F2DBAD20072527F6AD02CE7F5A450DBC72BE2ABB91741A8A3ADD30D5AD7A99FB"
            },
            {
                "Balance": {
                    "currency": "BTC",
                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                    "value": "0"
                },
                "Flags": 131072,
                "HighLimit": {
                    "currency": "BTC",
                    "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                    "value": "3"
                },
                "HighNode": "0000000000000000",
                "LedgerEntryType": "RippleState",
                "LowLimit": {
                    "currency": "BTC",
                    "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                    "value": "0"
                },
                "LowNode": "0000000000000043",
                "PreviousTxnID": "03EDF724397D2DEE70E49D512AECD619E9EA536BE6CFD48ED167AE2596055C9A",
                "PreviousTxnLgrSeq": 8317037,
                "index": "767C12AF647CDF5FEB9019B37018748A79C50EDAF87E8D4C7F39F78AA7CA9765"
            },
            {
                "Balance": {
                    "currency": "USD",
                    "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                    "value": "-16.00534471983042"
                },
                "Flags": 131072,
                "HighLimit": {
                    "currency": "USD",
                    "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                    "value": "5000"
                },
                "HighNode": "0000000000000000",
                "LedgerEntryType": "RippleState",
                "LowLimit": {
                    "currency": "USD",
                    "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                    "value": "0"
                },
                "LowNode": "000000000000004A",
                "PreviousTxnID": "CFFF5CFE623C9543308C6529782B6A6532207D819795AAFE85555DB8BF390FE7",
                "PreviousTxnLgrSeq": 14365854,
                "index": "826CF5BFD28F3934B518D0BDF3231259CBD3FD0946E3C3CA0C97D2C75D2D1A09"
            }
        ],
        "ledger_hash": "4C99E5F63C0D0B1C2283B4F5DCE2239F80CE92E8B1A6AED1E110C198FC96E659",
        "ledger_index": 14380380,
        "limit": 10,
        "marker": "F60ADF645E78B69857D2E4AEC8B7742FEABC8431BD8611D099B428C3E816DF93,94A9F05FEF9A153229E2E997E64919FD75AAE2028C8153E8EBDB4440BD3ECBB5",
        "status": "success",
        "validated": true
    }
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```json
{
   "result" : {
      "account" : "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
      "account_objects" : [
         {
            "Balance" : {
               "currency" : "ASP",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "0"
            },
            "Flags" : 65536,
            "HighLimit" : {
               "currency" : "ASP",
               "issuer" : "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
               "value" : "0"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "ASP",
               "issuer" : "r3vi7mWxru9rJCxETCyA1CHvzL96eZWx5z",
               "value" : "10"
            },
            "LowNode" : "0000000000000000",
            "PreviousTxnID" : "BF7555B0F018E3C5E2A3FF9437A1A5092F32903BE246202F988181B9CED0D862",
            "PreviousTxnLgrSeq" : 1438879,
            "index" : "2243B0B630EA6F7330B654EFA53E27A7609D9484E535AB11B7F946DF3D247CE9"
         },
         {
            "Balance" : {
               "currency" : "XAU",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "0"
            },
            "Flags" : 3342336,
            "HighLimit" : {
               "currency" : "XAU",
               "issuer" : "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
               "value" : "0"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "XAU",
               "issuer" : "r3vi7mWxru9rJCxETCyA1CHvzL96eZWx5z",
               "value" : "0"
            },
            "LowNode" : "0000000000000000",
            "PreviousTxnID" : "79B26D7D34B950AC2C2F91A299A6888FABB376DD76CFF79D56E805BF439F6942",
            "PreviousTxnLgrSeq" : 5982530,
            "index" : "9ED4406351B7A511A012A9B5E7FE4059FA2F7650621379C0013492C315E25B97"
         },
         {
            "Balance" : {
               "currency" : "USD",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "5"
            },
            "Flags" : 1114112,
            "HighLimit" : {
               "currency" : "USD",
               "issuer" : "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
               "value" : "0"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "USD",
               "issuer" : "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
               "value" : "5"
            },
            "LowNode" : "0000000000000000",
            "PreviousTxnID" : "2A5C5D95880A254A2C57BB5332558205BC33B9F2B38D359A170283CB4CBD080A",
            "PreviousTxnLgrSeq" : 39498567,
            "index" : "2DECFAC23B77D5AEA6116C15F5C6D4669EBAEE9E7EE050A40FE2B1E47B6A9419"
         },
         {
            "Balance" : {
               "currency" : "MXN",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "481.992867407479"
            },
            "Flags" : 65536,
            "HighLimit" : {
               "currency" : "MXN",
               "issuer" : "rHpXfibHgSb64n8kK9QWDpdbfqSpYbM9a4",
               "value" : "0"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "MXN",
               "issuer" : "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
               "value" : "1000"
            },
            "LowNode" : "0000000000000000",
            "PreviousTxnID" : "A467BACE5F183CDE1F075F72435FE86BAD8626ED1048EDEFF7562A4CC76FD1C5",
            "PreviousTxnLgrSeq" : 3316170,
            "index" : "EC8B9B6B364AF6CB6393A423FDD2DDBA96375EC772E6B50A3581E53BFBDFDD9A"
         },
         {
            "Balance" : {
               "currency" : "EUR",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "0.793598266778297"
            },
            "Flags" : 1114112,
            "HighLimit" : {
               "currency" : "EUR",
               "issuer" : "rLEsXccBGNR3UPuPu2hUXPjziKC3qKSBun",
               "value" : "0"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "EUR",
               "issuer" : "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
               "value" : "1"
            },
            "LowNode" : "0000000000000000",
            "PreviousTxnID" : "E9345D44433EA368CFE1E00D84809C8E695C87FED18859248E13662D46A0EC46",
            "PreviousTxnLgrSeq" : 5447146,
            "index" : "4513749B30F4AF8DA11F077C448128D6486BF12854B760E4E5808714588AA915"
         },
         {
            "Balance" : {
               "currency" : "CNY",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "0"
            },
            "Flags" : 2228224,
            "HighLimit" : {
               "currency" : "CNY",
               "issuer" : "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
               "value" : "3"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "CNY",
               "issuer" : "rnuF96W4SZoCJmbHYBFoJZpR8eCaxNvekK",
               "value" : "0"
            },
            "LowNode" : "0000000000000008",
            "PreviousTxnID" : "2FDDC81F4394695B01A47913BEC4281AC9A283CC8F903C14ADEA970F60E57FCF",
            "PreviousTxnLgrSeq" : 5949673,
            "index" : "578C327DA8944BDE2E10C9BA36AFA2F43E06C8D1E8819FB225D266CBBCFDE5CE"
         },
         {
            "Balance" : {
               "currency" : "DYM",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "1.336889190631542"
            },
            "Flags" : 65536,
            "HighLimit" : {
               "currency" : "DYM",
               "issuer" : "rGwUWgN5BEg3QGNY3RX2HfYowjUTZdid3E",
               "value" : "0"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "DYM",
               "issuer" : "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
               "value" : "3"
            },
            "LowNode" : "0000000000000000",
            "PreviousTxnID" : "6DA2BD02DFB83FA4DAFC2651860B60071156171E9C021D9E0372A61A477FFBB1",
            "PreviousTxnLgrSeq" : 8818732,
            "index" : "5A2A5FF12E71AEE57564E624117BBA68DEF78CD564EF6259F92A011693E027C7"
         },
         {
            "Balance" : {
               "currency" : "CHF",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "-0.3488146605801446"
            },
            "Flags" : 131072,
            "HighLimit" : {
               "currency" : "CHF",
               "issuer" : "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
               "value" : "0"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "CHF",
               "issuer" : "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
               "value" : "0"
            },
            "LowNode" : "000000000000008C",
            "PreviousTxnID" : "722394372525A13D1EAAB005642F50F05A93CF63F7F472E0F91CDD6D38EB5869",
            "PreviousTxnLgrSeq" : 2687590,
            "index" : "F2DBAD20072527F6AD02CE7F5A450DBC72BE2ABB91741A8A3ADD30D5AD7A99FB"
         },
         {
            "Balance" : {
               "currency" : "BTC",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "0"
            },
            "Flags" : 131072,
            "HighLimit" : {
               "currency" : "BTC",
               "issuer" : "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
               "value" : "3"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "BTC",
               "issuer" : "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
               "value" : "0"
            },
            "LowNode" : "0000000000000043",
            "PreviousTxnID" : "03EDF724397D2DEE70E49D512AECD619E9EA536BE6CFD48ED167AE2596055C9A",
            "PreviousTxnLgrSeq" : 8317037,
            "index" : "767C12AF647CDF5FEB9019B37018748A79C50EDAF87E8D4C7F39F78AA7CA9765"
         },
         {
            "Balance" : {
               "currency" : "USD",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "-11.68225001668339"
            },
            "Flags" : 131072,
            "HighLimit" : {
               "currency" : "USD",
               "issuer" : "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
               "value" : "5000"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "USD",
               "issuer" : "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
               "value" : "0"
            },
            "LowNode" : "000000000000004A",
            "PreviousTxnID" : "8C55AFC2A2AA42B5CE624AEECDB3ACFDD1E5379D4E5BF74A8460C5E97EF8706B",
            "PreviousTxnLgrSeq" : 43251698,
            "index" : "826CF5BFD28F3934B518D0BDF3231259CBD3FD0946E3C3CA0C97D2C75D2D1A09"
         },
         {
            "Balance" : {
               "currency" : "BTC",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "0.00111"
            },
            "Flags" : 65536,
            "HighLimit" : {
               "currency" : "BTC",
               "issuer" : "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
               "value" : "0"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "BTC",
               "issuer" : "rpgKWEmNqSDAGFhy5WDnsyPqfQxbWxKeVd",
               "value" : "10"
            },
            "LowNode" : "0000000000000000",
            "PreviousTxnID" : "74F2F2A731C1350492FA03F8C67AF6C05EEC391160AACC04BF99329D9EAB0052",
            "PreviousTxnLgrSeq" : 585437,
            "index" : "94A9F05FEF9A153229E2E997E64919FD75AAE2028C8153E8EBDB4440BD3ECBB5"
         },
         {
            "Balance" : {
               "currency" : "BTC",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "-0.0008744482690504699"
            },
            "Flags" : 131072,
            "HighLimit" : {
               "currency" : "BTC",
               "issuer" : "rBJ3YjwXi2MGbg7GVLuTXUWQ8DjL7tDXh4",
               "value" : "10"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "BTC",
               "issuer" : "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
               "value" : "0"
            },
            "LowNode" : "0000000000000000",
            "PreviousTxnID" : "95221CD154317176B5748202A2E820D7A336597816E9787C27E3E4F25576877F",
            "PreviousTxnLgrSeq" : 8208104,
            "index" : "BC2AC65D7F9AD5CDAD131DEFE248727CA8A0FC219A33A3264E6202F50B4733C0"
         },
         {
            "Balance" : {
               "currency" : "USD",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "0"
            },
            "Flags" : 65536,
            "HighLimit" : {
               "currency" : "USD",
               "issuer" : "rLEsXccBGNR3UPuPu2hUXPjziKC3qKSBun",
               "value" : "0"
            },
            "HighNode" : "0000000000000002",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "USD",
               "issuer" : "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
               "value" : "1"
            },
            "LowNode" : "0000000000000000",
            "PreviousTxnID" : "8C55AFC2A2AA42B5CE624AEECDB3ACFDD1E5379D4E5BF74A8460C5E97EF8706B",
            "PreviousTxnLgrSeq" : 43251698,
            "index" : "C493ABA2619D0FC6355BA862BC8312DF8266FBE76AFBA9636E857F7EAC874A99"
         },
         {
            "Balance" : {
               "currency" : "CNY",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "-9.07619790068559"
            },
            "Flags" : 2228224,
            "HighLimit" : {
               "currency" : "CNY",
               "issuer" : "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
               "value" : "100"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "CNY",
               "issuer" : "razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA",
               "value" : "0"
            },
            "LowNode" : "0000000000000005",
            "PreviousTxnID" : "8EFE067DA1B2D57C485EFFCF875604548BA990EA00D019B466313D4CEE1E4668",
            "PreviousTxnLgrSeq" : 8284705,
            "index" : "C8554E6CE903505F631703E73D22D2D4D0662FDA9F524290997DF6B4D760C495"
         },
         {
            "Balance" : {
               "currency" : "JPY",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "-7.292695098901099"
            },
            "Flags" : 2228224,
            "HighLimit" : {
               "currency" : "JPY",
               "issuer" : "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
               "value" : "0"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "JPY",
               "issuer" : "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
               "value" : "0"
            },
            "LowNode" : "0000000000000076",
            "PreviousTxnID" : "CE460D85F9AD93752E8EC8BCF4DFFE91DDF08B8C988836D64CB51EB7B447F672",
            "PreviousTxnLgrSeq" : 5100078,
            "index" : "CB1565898F19916A5EE49CC537B1D43CA075B9B96E82C6892E16EF6DFDEE7865"
         },
         {
            "Balance" : {
               "currency" : "AUX",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "0"
            },
            "Flags" : 3342336,
            "HighLimit" : {
               "currency" : "AUX",
               "issuer" : "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
               "value" : "0"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "AUX",
               "issuer" : "r3vi7mWxru9rJCxETCyA1CHvzL96eZWx5z",
               "value" : "0"
            },
            "LowNode" : "0000000000000000",
            "PreviousTxnID" : "A6964735A14272742E7E10EB5AB5A7CE693473BBB4DAFA488971A15E181132CF",
            "PreviousTxnLgrSeq" : 5982528,
            "index" : "C61E113C767A9E7B27CD944162FB63EAA24C38C8664E984759821C3ADFFE097E"
         },
         {
            "Balance" : {
               "currency" : "USD",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "0.0004557360418801623"
            },
            "Flags" : 1114112,
            "HighLimit" : {
               "currency" : "USD",
               "issuer" : "r9vbV3EHvXWjSkeQ6CAcYVPGeq7TuiXY2X",
               "value" : "0"
            },
            "HighNode" : "0000000000000003",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "USD",
               "issuer" : "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
               "value" : "1"
            },
            "LowNode" : "0000000000000000",
            "PreviousTxnID" : "F8F178712C0C3DA013A774A598B2A004BE6BA3D4542B8448D221A60D8A0D409A",
            "PreviousTxnLgrSeq" : 38837233,
            "index" : "D43180D7B2EEBB285C9D296590C4D5E5580C814F3026FC4D41FFDF3049FB547F"
         },
         {
            "Balance" : {
               "currency" : "EUR",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "-12.41688780720394"
            },
            "Flags" : 2228224,
            "HighLimit" : {
               "currency" : "EUR",
               "issuer" : "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
               "value" : "100"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "EUR",
               "issuer" : "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
               "value" : "0"
            },
            "LowNode" : "000000000000008F",
            "PreviousTxnID" : "1F0436C0688A8156EE2D7745B02C3F39C477A43F6BAD5D46C25A08949EF41739",
            "PreviousTxnLgrSeq" : 5449071,
            "index" : "F6B22B4D6A83B13A7F16E6A4A6EA8D3E26739C9D86C23DAC21C18E74B5E2C8CC"
         },
         {
            "Balance" : {
               "currency" : "USD",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "-35"
            },
            "Flags" : 2228224,
            "HighLimit" : {
               "currency" : "USD",
               "issuer" : "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
               "value" : "500"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "USD",
               "issuer" : "rfF3PNkwkq1DygW2wum2HK3RGfgkJjdPVD",
               "value" : "0"
            },
            "LowNode" : "0000000000000000",
            "PreviousTxnID" : "99CB3C30FAEC301621951B944059C3C2EB78FDE7ED2E124A79901B6F2600E868",
            "PreviousTxnLgrSeq" : 4339260,
            "index" : "D23CF25053AC6A5106E9162A20AF52818EDC672CA77AD1625C0407A71D37102F"
         },
         {
            "Balance" : {
               "currency" : "JOE",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "-5"
            },
            "Flags" : 2228224,
            "HighLimit" : {
               "currency" : "JOE",
               "issuer" : "rwUVoVMSURqNyvocPCcvLu3ygJzZyw8qwp",
               "value" : "50"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "JOE",
               "issuer" : "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
               "value" : "0"
            },
            "LowNode" : "0000000000000000",
            "PreviousTxnID" : "F5B48F7631779C6562AF07DC79E0E4E25A0696C38823417BF811DF27C5D88168",
            "PreviousTxnLgrSeq" : 5736288,
            "index" : "FEECE8973F75156412E1604C52B8B9C6BC9EF21FA4A0FAA8B779AC416D039B34"
         },
         {
            "Balance" : {
               "currency" : "USD",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "0"
            },
            "Flags" : 2228224,
            "HighLimit" : {
               "currency" : "USD",
               "issuer" : "rE6R3DWF9fBD7CyiQciePF9SqK58Ubp8o2",
               "value" : "100"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "USD",
               "issuer" : "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
               "value" : "0"
            },
            "LowNode" : "0000000000000000",
            "PreviousTxnID" : "B1A7405C4A698E6A371E5B02836E779A942936AB754865FE82141E5280F09D1B",
            "PreviousTxnLgrSeq" : 5718137,
            "index" : "8DF1456AAB7470A760F6A095C156B457FF1038D43E6B11FD8011C2DF714E4FA1"
         },
         {
            "Balance" : {
               "currency" : "JOE",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "0"
            },
            "Flags" : 2228224,
            "HighLimit" : {
               "currency" : "JOE",
               "issuer" : "rE6R3DWF9fBD7CyiQciePF9SqK58Ubp8o2",
               "value" : "100"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "JOE",
               "issuer" : "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
               "value" : "0"
            },
            "LowNode" : "0000000000000000",
            "PreviousTxnID" : "8E488B0E939D4DACD62102A5BFA2FDC63679EFCC56F2FDA2FDF45283674BB711",
            "PreviousTxnLgrSeq" : 5989200,
            "index" : "273BD42DD72E7D84416ED759CEC92DACCD12A4502287E50BECF816233C021ED1"
         },
         {
            "Balance" : {
               "currency" : "015841551A748AD2C1F76FF6ECB0CCCD00000000",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "0"
            },
            "Flags" : 2228224,
            "HighLimit" : {
               "currency" : "015841551A748AD2C1F76FF6ECB0CCCD00000000",
               "issuer" : "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
               "value" : "10.01037626125837"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "015841551A748AD2C1F76FF6ECB0CCCD00000000",
               "issuer" : "rs9M85karFkCRjvc6KMWn8Coigm9cbcgcx",
               "value" : "0"
            },
            "LowNode" : "0000000000000000",
            "PreviousTxnID" : "2B3E313FBDE15988425AACA1EA2EAEBBBCB8020E4FBAA7159BA678E1C4F6B4C3",
            "PreviousTxnLgrSeq" : 5982458,
            "index" : "BA92A0B9EB8A75E84C5463BA1A055F2B1C1B7CC20BFDA7B027C685F75E06629D"
         },
         {
            "Balance" : {
               "currency" : "USD",
               "issuer" : "rrrrrrrrrrrrrrrrrrrrBZbvji",
               "value" : "0"
            },
            "Flags" : 131072,
            "HighLimit" : {
               "currency" : "USD",
               "issuer" : "rEhDDUUNxpXgEHVJtC2cjXAgyx5VCFxdMF",
               "value" : "1"
            },
            "HighNode" : "0000000000000000",
            "LedgerEntryType" : "RippleState",
            "LowLimit" : {
               "currency" : "USD",
               "issuer" : "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
               "value" : "0"
            },
            "LowNode" : "0000000000000000",
            "PreviousTxnID" : "B6B410172C0B65575D89E464AF5B99937CC568822929ABF87DA75CBD11911932",
            "PreviousTxnLgrSeq" : 6592159,
            "index" : "2CC2B211F6D1159B5CFD07AF8717A9C51C985E2497B2875C192EE87266AB0F81"
         }
      ],
      "ledger_hash" : "06BF4DBE7D57FBFEAFD70D4CA7B00ED6EF404B94C446767063A0EF58A937FC4E",
      "ledger_index" : 56843766,
      "status" : "success",
      "validated" : true
   }
}
```
{% /tab %}

{% /tabs %}

このレスポンスは[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれます。

| `Field`                | 型                          | 説明                    |
|:-----------------------|:----------------------------|:------------------------|
| `account`              | 文字列                       | このリクエストに対応するアカウントの一意の[アドレス][]。 |
| `account_objects`      | 配列                         | このアカウントが所有するオブジェクトの配列。各オブジェクトは、生[レジャーフォーマット][]です。 |
| `ledger_hash`          | 文字列                       | （省略される場合があります）このレスポンスの生成に使用されたレジャーの識別用ハッシュ。 |
| `ledger_index`         | 数値 - [レジャーインデックス][] | _（省略される場合があります）_ このレスポンスの生成に使用されたレジャーバージョンのレジャーインデックス。 |
| `ledger_current_index` | 数値 - [レジャーインデックス][] | _（省略される場合があります）_ このレスポンスの生成に使用された現在処理中のレジャーバージョンのレジャーインデックス。 |
| `limit`                | 数値                         | _（省略される場合があります）_ このリクエストで使用されていた制限（制限の使用がある場合）。 |
| `marker`               | [マーカー][]                  | レスポンスがページネーションされていることを示す、サーバが定義した値。この値を次のコールに渡して、このコールで終わった箇所から再開します。この後に追加のページがない場合は省略されます。 |
| `validated`            | 真偽値                        | このフィールドが含まれていて`true`に設定されている場合、このレスポンス内の情報は検証済みのレジャーバージョンから取得されています。そうでない場合、情報は変更されることがあります。 |

## 考えられるエラー

* いずれかの[汎用エラータイプ][]。
* `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。
* `actNotFound` - リクエストの`account`フィールドに指定されている[アドレス][]が、レジャーのアカウントに対応していません。
* `lgrNotFound` - `ledger_hash`または`ledger_index`で指定したレジャーが存在しないか、存在してはいるもののサーバが保有していません。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
