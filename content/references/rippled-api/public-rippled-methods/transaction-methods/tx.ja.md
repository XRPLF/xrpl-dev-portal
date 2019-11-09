# tx
[[ソース]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/Tx.cpp "Source")

`tx`メソッドは1つのトランザクションに関する情報を取得します。

## 要求フォーマット

要求フォーマットの例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
 "id": 1,
 "command": "tx",
 "transaction": "E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7",
 "binary": false
}
```
*JSON-RPC*

```
{
   "method": "tx",
   "params": [
       {
           "transaction": "E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7",
           "binary": false
       }
   ]
}
```
*コマンドライン*

```
#Syntax: tx transaction [binary]
rippled tx E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7 false
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](websocket-api-tool.html#tx)

要求には以下のパラメーターが含まれます。

| `Field`       | 型    | 説明                                        |
|:--------------|:--------|:---------------------------------------------------|
| `transaction` | 文字列  | トランザクションの256ビットハッシュ（16進数）。       |
| `binary`      | ブール値 | （省略可、デフォルトではfalseです）trueの場合、トランザクションデータとメタデータがJSONではなく16進文字列として返されます。 |

## 応答フォーマット

処理が成功した応答の例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
   "id": 1,
   "result": {
       "Account": "r3PDtZSa5LiYp1Ysn1vMuMzB59RzV3W9QH",
       "Amount": {
           "currency": "USD",
           "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
           "value": "1"
       },
       "Destination": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
       "Fee": "10",
       "Flags": 0,
       "Paths": [
           [
               {
                   "account": "r3kmLJN5D28dHuH8vZNUZpMC43pEHpaocV",
                   "currency": "USD",
                   "issuer": "r3kmLJN5D28dHuH8vZNUZpMC43pEHpaocV",
                   "type": 49,
                   "type_hex": "0000000000000031"
               }
           ],
           [
               {
                   "account": "rD1jovjQeEpvaDwn9wKaYokkXXrqo4D23x",
                   "currency": "USD",
                   "issuer": "rD1jovjQeEpvaDwn9wKaYokkXXrqo4D23x",
                   "type": 49,
                   "type_hex": "0000000000000031"
               },
               {
                   "account": "rB5TihdPbKgMrkFqrqUC3yLdE8hhv4BdeY",
                   "currency": "USD",
                   "issuer": "rB5TihdPbKgMrkFqrqUC3yLdE8hhv4BdeY",
                   "type": 49,
                   "type_hex": "0000000000000031"
               },
               {
                   "account": "r3kmLJN5D28dHuH8vZNUZpMC43pEHpaocV",
                   "currency": "USD",
                   "issuer": "r3kmLJN5D28dHuH8vZNUZpMC43pEHpaocV",
                   "type": 49,
                   "type_hex": "0000000000000031"
               }
           ]
       ],
       "SendMax": {
           "currency": "USD",
           "issuer": "r3PDtZSa5LiYp1Ysn1vMuMzB59RzV3W9QH",
           "value": "1.01"
       },
       "Sequence": 88,
       "SigningPubKey": "02EAE5DAB54DD8E1C49641D848D5B97D1B29149106174322EDF98A1B2CCE5D7F8E",
       "TransactionType": "Payment",
       "TxnSignature": "30440220791B6A3E036ECEFFE99E8D4957564E8C84D1548C8C3E80A87ED1AA646ECCFB16022037C5CAC97E34E3021EBB426479F2ACF3ACA75DB91DCC48D1BCFB4CF547CFEAA0",
       "hash": "E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7",
       "inLedger": 348734,
       "ledger_index": 348734,
       "meta": {
           "AffectedNodes": [
               {
                   "ModifiedNode": {
                       "FinalFields": {
                           "Account": "r3PDtZSa5LiYp1Ysn1vMuMzB59RzV3W9QH",
                           "Balance": "59328999119",
                           "Flags": 0,
                           "OwnerCount": 11,
                           "Sequence": 89
                       },
                       "LedgerEntryType": "AccountRoot",
                       "LedgerIndex": "E0D7BDE68B468FF0B8D948FD865576517DA987569833A05374ADB9A72E870A06",
                       "PreviousFields": {
                           "Balance": "59328999129",
                           "Sequence": 88
                       },
                       "PreviousTxnID": "C26AA6B4F7C3B9F55E17CD0D11F12032A1C7AD2757229FFD277C9447A8815E6E",
                       "PreviousTxnLgrSeq": 348700
                   }
               },
               {
                   "ModifiedNode": {
                       "FinalFields": {
                           "Balance": {
                               "currency": "USD",
                               "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                               "value": "-1"
                           },
                           "Flags": 131072,
                           "HighLimit": {
                               "currency": "USD",
                               "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
                               "value": "100"
                           },
                           "HighNode": "0000000000000000",
                           "LowLimit": {
                               "currency": "USD",
                               "issuer": "r3PDtZSa5LiYp1Ysn1vMuMzB59RzV3W9QH",
                               "value": "0"
                           },
                           "LowNode": "0000000000000000"
                       },
                       "LedgerEntryType": "RippleState",
                       "LedgerIndex": "EA4BF03B4700123CDFFB6EB09DC1D6E28D5CEB7F680FB00FC24BC1C3BB2DB959",
                       "PreviousFields": {
                           "Balance": {
                               "currency": "USD",
                               "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                               "value": "0"
                           }
                       },
                       "PreviousTxnID": "53354D84BAE8FDFC3F4DA879D984D24B929E7FEB9100D2AD9EFCD2E126BCCDC8",
                       "PreviousTxnLgrSeq": 343570
                   }
               }
           ],
           "TransactionIndex": 0,
           "TransactionResult": "tesSUCCESS"
       },
       "validated": true
   },
   "status": "success",
   "type": "response"
}
```

<!-- MULTICODE_BLOCK_END -->

この応答は[標準フォーマット][]に従っており、正常に完了した場合は結果に[Transactionオブジェクト](transaction-formats.html)フィールドと以下の追加のフィールドが含まれています。

| `Field`        | 型             | 説明                              |
|:---------------|:-----------------|:-----------------------------------------|
| `hash`         | 文字列           | トランザクションのSHA-512ハッシュ      |
| `inLedger`     | 符号なし整数 | （廃止予定）`ledger_index`のエイリアス。   |
| `ledger_index` | 符号なし整数 | このトランザクションが記録されているレジャーのシーケンス番号。 |
| `meta`         | オブジェクト           | トランザクションに関する各種メタデータ。  |
| `validated`    | ブール値          | このデータが検証済みレジャーバージョンのデータである場合はtrue。省略されている場合またはfalseに設定されている場合は、このデータは最終データではありません。 |
| （各種）      | （各種）        | [Transactionオブジェクト](transaction-formats.html)のその他のフィールド |

## 考えられるエラー

* [汎用エラータイプ][]のすべて。
* `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。
* `txnNotFound` - トランザクションが存在しないか、または`rippled`で使用できない古いレジャーバージョンのトランザクションです。


{% include '_snippets/rippled_versions.md' %}
{% include '_snippets/rippled-api-links.md' %}
