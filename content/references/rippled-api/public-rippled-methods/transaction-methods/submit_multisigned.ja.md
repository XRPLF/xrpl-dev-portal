# submit_multisigned
[[ソース]<br>](https://github.com/ripple/rippled/blob/release/src/ripple/rpc/handlers/SubmitMultiSigned.cpp "Source")

`submit_multisigned`コマンドは[マルチ署名済み](multi-signing.html)トランザクションを適用し、このトランザクションをネットワークに送信して、今後のレジャーに追加します。（[`submit`コマンドを送信専用モードで](submit.html#送信専用モード)使用して、マルチ署名済みトランザクションをバイナリー形式で送信することもできます。)

このコマンドを使用するには、[MultiSign Amendment][]が有効になっている必要があります。[新規: rippled 0.31.0][]

## 要求フォーマット
要求フォーマットの例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
   "id": "submit_multisigned_example"
   "command": "submit_multisigned",
   "tx_json": {
       "Account": "rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC",
       "Fee": "30000",
       "Flags": 262144,
       "LimitAmount": {
           "currency": "USD",
           "issuer": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
           "value": "100"
       },
       "Sequence": 2,
       "Signers": [{
           "Signer": {
               "Account": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
               "SigningPubKey": "02B3EC4E5DD96029A647CFA20DA07FE1F85296505552CCAC114087E66B46BD77DF",
               "TxnSignature": "30450221009C195DBBF7967E223D8626CA19CF02073667F2B22E206727BFE848FF42BEAC8A022048C323B0BED19A988BDBEFA974B6DE8AA9DCAE250AA82BBD1221787032A864E5"
           }
       }, {
           "Signer": {
               "Account": "rUpy3eEg8rqjqfUoLeBnZkscbKbFsKXC3v",
               "SigningPubKey": "028FFB276505F9AC3F57E8D5242B386A597EF6C40A7999F37F1948636FD484E25B",
               "TxnSignature": "30440220680BBD745004E9CFB6B13A137F505FB92298AD309071D16C7B982825188FD1AE022004200B1F7E4A6A84BB0E4FC09E1E3BA2B66EBD32F0E6D121A34BA3B04AD99BC1"
           }
       }],
       "SigningPubKey": "",
       "TransactionType": "TrustSet",
       "hash": "BD636194C48FD7A100DE4C972336534C8E710FD008C0F3CF7BC5BF34DAF3C3E6"
   }
}
```

*JSON-RPC*

```
{
   "method": "submit_multisigned",
   "params": [
       {
           "tx_json": {
               "Account": "rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC",
               "Fee": "30000",
               "Flags": 262144,
               "LimitAmount": {
                   "currency": "USD",
                   "issuer": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
                   "value": "0"
               },
               "Sequence": 4,
               "Signers": [
                   {
                       "Signer": {
                           "Account": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
                           "SigningPubKey": "02B3EC4E5DD96029A647CFA20DA07FE1F85296505552CCAC114087E66B46BD77DF",
                           "TxnSignature": "3045022100CC9C56DF51251CB04BB047E5F3B5EF01A0F4A8A549D7A20A7402BF54BA744064022061EF8EF1BCCBF144F480B32508B1D10FD4271831D5303F920DE41C64671CB5B7"
                       }
                   },
                   {
                       "Signer": {
                           "Account": "raKEEVSGnKSD9Zyvxu4z6Pqpm4ABH8FS6n",
                           "SigningPubKey": "03398A4EDAE8EE009A5879113EAA5BA15C7BB0F612A87F4103E793AC919BD1E3C1",
                           "TxnSignature": "3045022100FEE8D8FA2D06CE49E9124567DCA265A21A9F5465F4A9279F075E4CE27E4430DE022042D5305777DA1A7801446780308897699412E4EDF0E1AEFDF3C8A0532BDE4D08"
                       }
                   }
               ],
               "SigningPubKey": "",
               "TransactionType": "TrustSet",
               "hash": "81A477E2A362D171BB16BE17B4120D9F809A327FA00242ABCA867283BEA2F4F8"
           }
       }
   ]
}
```

*コマンドライン*

```
#Syntax: submit_multisigned <tx_json>
rippled submit_multisigned '{
   "Account": "rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC",
   "Fee": "30000",
   "Flags": 262144,
   "LimitAmount": {
       "currency": "USD",
       "issuer": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
       "value": "0"
   },
   "Sequence": 4,
   "Signers": [
       {
           "Signer": {
               "Account": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
               "SigningPubKey": "02B3EC4E5DD96029A647CFA20DA07FE1F85296505552CCAC114087E66B46BD77DF",
               "TxnSignature": "3045022100CC9C56DF51251CB04BB047E5F3B5EF01A0F4A8A549D7A20A7402BF54BA744064022061EF8EF1BCCBF144F480B32508B1D10FD4271831D5303F920DE41C64671CB5B7"
           }
       },
       {
           "Signer": {
               "Account": "raKEEVSGnKSD9Zyvxu4z6Pqpm4ABH8FS6n",
               "SigningPubKey": "03398A4EDAE8EE009A5879113EAA5BA15C7BB0F612A87F4103E793AC919BD1E3C1",
               "TxnSignature": "3045022100FEE8D8FA2D06CE49E9124567DCA265A21A9F5465F4A9279F075E4CE27E4430DE022042D5305777DA1A7801446780308897699412E4EDF0E1AEFDF3C8A0532BDE4D08"
           }
       }
   ],
   "SigningPubKey": "",
   "TransactionType": "TrustSet",
   "hash": "81A477E2A362D171BB16BE17B4120D9F809A327FA00242ABCA867283BEA2F4F8"
}'
```

<!-- MULTICODE_BLOCK_END -->

要求には以下のパラメーターが含まれます。

| `Field`     | 型    | 説明                                          |
|:------------|:--------|:-----------------------------------------------------|
| `tx_json`   | オブジェクト  | `Signers`からなる配列が指定された[JSONフォーマットのトランザクション](transaction-formats.html)。成功させるには、署名の重みが[SignerList](signerlist.html)の定数以上でなければなりません。 |
| `fail_hard` | ブール値 | （省略可、デフォルトではfalseです）trueで、かつトランザクションがローカルで失敗する場合は、このトランザクションの再試行や、他のサーバーへのリレーは行わないでください。 |

## 応答フォーマット

処理が成功した応答の例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
 "id": "submit_multisigned_example",
 "status": "success",
 "type": "response",
 "result": {
   "engine_result": "tesSUCCESS",
   "engine_result_code": 0,
   "engine_result_message": "The transaction was applied.Only final in a validated ledger.",
   "tx_blob": "1200142200040000240000000263D5038D7EA4C680000000000000000000000000005553440000000000B5F762798A53D543A014CAF8B297CFF8F2F937E868400000000000753073008114A3780F5CB5A44D366520FC44055E8ED44D9A2270F3E010732102B3EC4E5DD96029A647CFA20DA07FE1F85296505552CCAC114087E66B46BD77DF744730450221009C195DBBF7967E223D8626CA19CF02073667F2B22E206727BFE848FF42BEAC8A022048C323B0BED19A988BDBEFA974B6DE8AA9DCAE250AA82BBD1221787032A864E58114204288D2E47F8EF6C99BCC457966320D12409711E1E0107321028FFB276505F9AC3F57E8D5242B386A597EF6C40A7999F37F1948636FD484E25B744630440220680BBD745004E9CFB6B13A137F505FB92298AD309071D16C7B982825188FD1AE022004200B1F7E4A6A84BB0E4FC09E1E3BA2B66EBD32F0E6D121A34BA3B04AD99BC181147908A7F0EDD48EA896C3580A399F0EE78611C8E3E1F1",
   "tx_json": {
     "Account": "rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC",
     "Fee": "30000",
     "Flags": 262144,
     "LimitAmount": {
       "currency": "USD",
       "issuer": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
       "value": "100"
     },
     "Sequence": 2,
     "Signers": [
       {
         "Signer": {
           "Account": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
           "SigningPubKey": "02B3EC4E5DD96029A647CFA20DA07FE1F85296505552CCAC114087E66B46BD77DF",
           "TxnSignature": "30450221009C195DBBF7967E223D8626CA19CF02073667F2B22E206727BFE848FF42BEAC8A022048C323B0BED19A988BDBEFA974B6DE8AA9DCAE250AA82BBD1221787032A864E5"
         }
       },
       {
         "Signer": {
           "Account": "rUpy3eEg8rqjqfUoLeBnZkscbKbFsKXC3v",
           "SigningPubKey": "028FFB276505F9AC3F57E8D5242B386A597EF6C40A7999F37F1948636FD484E25B",
           "TxnSignature": "30440220680BBD745004E9CFB6B13A137F505FB92298AD309071D16C7B982825188FD1AE022004200B1F7E4A6A84BB0E4FC09E1E3BA2B66EBD32F0E6D121A34BA3B04AD99BC1"
         }
       }
     ],
     "SigningPubKey": "",
     "TransactionType": "TrustSet",
     "hash": "BD636194C48FD7A100DE4C972336534C8E710FD008C0F3CF7BC5BF34DAF3C3E6"
   }
 }
}
```

*JSON-RPC*

```
200 OK
{
   "result": {
       "engine_result": "tesSUCCESS",
       "engine_result_code": 0,
       "engine_result_message": "The transaction was applied.Only final in a validated ledger.",
       "status": "success",
       "tx_blob": "120014220004000024000000046380000000000000000000000000000000000000005553440000000000B5F762798A53D543A014CAF8B297CFF8F2F937E868400000000000753073008114A3780F5CB5A44D366520FC44055E8ED44D9A2270F3E010732102B3EC4E5DD96029A647CFA20DA07FE1F85296505552CCAC114087E66B46BD77DF74473045022100CC9C56DF51251CB04BB047E5F3B5EF01A0F4A8A549D7A20A7402BF54BA744064022061EF8EF1BCCBF144F480B32508B1D10FD4271831D5303F920DE41C64671CB5B78114204288D2E47F8EF6C99BCC457966320D12409711E1E010732103398A4EDAE8EE009A5879113EAA5BA15C7BB0F612A87F4103E793AC919BD1E3C174473045022100FEE8D8FA2D06CE49E9124567DCA265A21A9F5465F4A9279F075E4CE27E4430DE022042D5305777DA1A7801446780308897699412E4EDF0E1AEFDF3C8A0532BDE4D0881143A4C02EA95AD6AC3BED92FA036E0BBFB712C030CE1F1",
       "tx_json": {
           "Account": "rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC",
           "Fee": "30000",
           "Flags": 262144,
           "LimitAmount": {
               "currency": "USD",
               "issuer": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
               "value": "0"
           },
           "Sequence": 4,
           "Signers": [
               {
                   "Signer": {
                       "Account": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
                       "SigningPubKey": "02B3EC4E5DD96029A647CFA20DA07FE1F85296505552CCAC114087E66B46BD77DF",
                       "TxnSignature": "3045022100CC9C56DF51251CB04BB047E5F3B5EF01A0F4A8A549D7A20A7402BF54BA744064022061EF8EF1BCCBF144F480B32508B1D10FD4271831D5303F920DE41C64671CB5B7"
                   }
               },
               {
                   "Signer": {
                       "Account": "raKEEVSGnKSD9Zyvxu4z6Pqpm4ABH8FS6n",
                       "SigningPubKey": "03398A4EDAE8EE009A5879113EAA5BA15C7BB0F612A87F4103E793AC919BD1E3C1",
                       "TxnSignature": "3045022100FEE8D8FA2D06CE49E9124567DCA265A21A9F5465F4A9279F075E4CE27E4430DE022042D5305777DA1A7801446780308897699412E4EDF0E1AEFDF3C8A0532BDE4D08"
                   }
               }
           ],
           "SigningPubKey": "",
           "TransactionType": "TrustSet",
           "hash": "81A477E2A362D171BB16BE17B4120D9F809A327FA00242ABCA867283BEA2F4F8"
       }
   }
}
```

<!-- MULTICODE_BLOCK_END -->

応答は[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれています。

| `Field`                 | 型    | 説明                              |
|:------------------------|:--------|:-----------------------------------------|
| `engine_result`         | 文字列  | 以下は、トランザクションの暫定的な結果を示すコードの例です。 `tesSUCCESS` |
| `engine_result_code`    | 整数 | トランザクションの暫定的な結果を示し、`engine_result`と直接の相関関係にある数値コード |
| `engine_result_message` | 文字列  | 人間が読み取れる形式の暫定的なトランザクション結果の説明 |
| `tx_blob`               | 文字列  | [トランザクション](transaction-formats.html)全体の16進文字列表現 |
| `tx_json`               | オブジェクト  | [トランザクション](transaction-formats.html)全体のJSON表現 |

## 考えられるエラー

* [汎用エラータイプ][]のすべて。
* `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。
* `srcActMalformed` - `tx_json`の`Account`フィールドが無効または欠落していました。
* `internal` - 内部エラーが発生しました。これには、指定されているトランザクションJSONに対して署名が無効な場合も含まれます。


{% include '_snippets/rippled_versions.md' %}
{% include '_snippets/rippled-api-links.md' %}
