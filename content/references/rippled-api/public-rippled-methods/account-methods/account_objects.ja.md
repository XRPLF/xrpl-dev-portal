# account_objects
[[ソース]<br>](https://github.com/ripple/rippled/blob/399c43cae6e90a428e9ce6a988123972b0f03c99/src/ripple/rpc/handlers/AccountObjects.cpp "Source")

`account_objects`コマンドは、アカウントが所有するすべてのオブジェクトの生[レジャーフォーマット][]を返します。アカウントのトラストラインと残高の概要については、[account_linesメソッド][]を参照してください。

[レジャーフォーマット]: ledger-data-formats.html

アカウントの`account_objects`応答に含まれる可能性のあるオブジェクトのタイプには以下のものがあります。

- 現在処理中、資金化されていない、または有効期限切れで削除されていないオーダーの[Offerオブジェクト](offer.html)。（詳細は、[オファーのライフサイクル](offers.html#オファーのライフサイクル)を参照してください。）
- このアカウント側がデフォルト状態にないトラストラインの[RippleStateオブジェクト](ripplestate.html)。
- アカウントの[SignerList](signerlist.html)（アカウントで[マルチ署名](multi-signing.html)が有効な場合）。
- 実行されていないかまたは取り消されていない保留中の支払いの[Escrowオブジェクト](escrow.html)。
- オープンPayment Channelの[PayChannelオブジェクト](paychannel.html)。
- 保留中のCheckの[Checkオブジェクト](check.html)。
- Deposit Preauthorizationの[DepositPreauthオブジェクト](depositpreauth-object.html)。[新規: rippled 1.1.0][]


## 要求フォーマット
要求フォーマットの例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
 "id": 1,
 "command": "account_objects",
 "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
 "ledger_index": "validated",
 "type": "state",
 "limit": 10
}
```

*JSON-RPC*

```
{
   "method": "account_objects",
   "params": [
       {
           "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
           "ledger_index": "validated",
           "limit": 10,
           "type": "state"
       }
   ]
}
```


*コマンドライン*

```
#Syntax: account_objects <account> [<ledger>]
rippled account_objects r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59 validated
```

<!-- MULTICODE_BLOCK_END -->

要求には以下のパラメーターが含まれます。

| `Field`        | 型                                       | 説明    |
|:---------------|:-------------------------------------------|:---------------|
| `account`      | 文字列                                     | アカウントの一意のIDであり、通常はアカウントのアドレスです。 |
| `type`         | 文字列                                     | _（省略可）_ 指定されている場合、結果をフィルタリングしてこのタイプのレジャーオブジェクトのみが含まれるようにします。有効なタイプは`check`、`deposit_preauth`、`escrow`、`offer`、`payment_channel`、`signer_list`、および`state`（トラストライン）です。 <!-- Author's note: Omitted types from this list that can't be owned by an account, and ticket until Tickets are enabled: https://github.com/ripple/rippled/blob/1dbc5a57e6b0e90a9da0d6e56f2f5a99e6ac1d8c/src/ripple/rpc/impl/RPCHelpers.cpp#L676-L686 --> |
| `ledger_hash`  | 文字列                                     | _（省略可）_ 使用するレジャーバージョンの20バイトの16進文字列。（[レジャーの指定][]を参照してください） |
| `ledger_index` | 文字列または符号なし整数                 | _（省略可）_ 使用するレジャーのシーケンス番号、またはレジャーを自動的に選択するためのショートカット文字列。（[レジャーの指定][]を参照してください） |
| `limit`        | 符号なし整数                           | _（省略可）_ 結果に含めることができるオブジェクトの最大数。非管理者接続では10以上400以下の範囲で値を指定する必要があります。デフォルトでは200です。 |
| `marker`       | [マーカー][] | _（省略可）_ 以前にページネーションされた応答の値。その応答を停止した箇所からデータの取得を再開します。 |

## 応答フォーマット

処理が成功した応答の例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
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

*JSON-RPC*

```
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

<!-- MULTICODE_BLOCK_END -->

この応答は[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれています。

| `Field`                | 型                                       | 説明 |
|:-----------------------|:-------------------------------------------|:-------|
| `account`              | 文字列                                     | この要求に対応するアカウントの一意の[アドレス][]。 |
| `account_objects`      | 配列                                      | このアカウントが所有するオブジェクトの配列。生[レジャーフォーマット][]の各オブジェクト。 |
| `ledger_hash`          | 文字列                                     | （省略される場合があります）この応答の生成に使用されたレジャーの識別用ハッシュ。 |
| `ledger_index`         | 数値                                     | （省略される場合があります）この応答の生成に使用されたレジャーバージョンのシーケンス番号。 |
| `ledger_current_index` | 数値                                     | （省略される場合があります）この応答の生成に使用された現在処理中のレジャーバージョンのシーケンス番号。 |
| `limit`                | 数値                                     | （省略される場合があります）この要求で使用されていた制限（制限の使用がある場合）。 |
| `marker`               | [マーカー][] | 応答がページネーションされていることを示す、サーバーが定義した値。この値を次のコールに渡して、このコールで終わった箇所から再開します。この後に追加のページがない場合は省略されます。 |
| `validated`            | ブール値                                    | このフィールドが含まれていて`true`に設定されている場合、この応答内の情報は検証済みのレジャーバージョンから取得されています。trueでない場合、情報は変更されることがあります。 |

## 考えられるエラー

* [汎用エラータイプ][]のすべて。
* `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。
* `actNotFound` - 要求の`account`フィールドに指定されている[アドレス][]が、レジャーのアカウントに対応していません。
* `lgrNotFound` - `ledger_hash`または`ledger_index`で指定したレジャーが存在しないか、存在してはいるもののサーバーが保有していません。


{% include '_snippets/rippled_versions.md' %}
{% include '_snippets/rippled-api-links.md' %}
