# レギュラーキーペアの変更または削除

XRP Ledgerでは、アカウントはその後のトランザクションには _レギュラーキーペア_ と呼ばれるセカンダリキーペアで署名することができます。アカウントのレギュラーキーペアが漏えいした場合、またはセキュリティ対策としてレギュラーキーペアを定期的に変更する必要がある場合は、[SetRegularKeyトランザクション][]を使用してアカウントレギュラーキーペアを削除または変更します。

マスターキーペアとレギュラーキーペアの詳細は、[暗号鍵](cryptographic-keys.html)を参照してください。


## レギュラーキーペアの変更

既存のレギュラーキーペアを変更する手順は、初めて[レギュラーキーを割り当てる](assign-a-regular-key-pair.html)手順とほぼ同じです。キーペアを生成し、レギュラーキーペアとしてアカウントに割り当てます。これにより既存のレギュラーキーペアが上書きされます。ただし大きく異なる点は、既存のレギュラーキーペアを変更するときには既存のレギュラー秘密鍵を使用して秘密鍵自体を置き換えることができますが、レギュラーキーペアをアカウントに初めて割り当てるときにはアカウントのマスター秘密鍵を使用する必要があることです。

マスターキーペアとレギュラーキーペアの詳細は、[暗号鍵](cryptographic-keys.html)を参照してください。


## レギュラーキーペアの削除

漏えいしたレギュラーキーペアを単にアカウントから削除する場合は、キーペアを最初に生成する必要はありません。`RegularKey`フィールドを省略した[SetRegularKeyトランザクション][]を使用します。アカウントの別の署名手段（マスターキーペアまたは[署名者リスト](multi-signing.html)）が現在有効になっていない場合は、トランザクションが失敗することに注意してください。


アカウントのレギュラーキーペアを削除する場合、`SetRegularKey`トランザクションでは、アカウントのマスター秘密鍵（シークレット）または既存のレギュラーキーペアによる署名が必要です。マスター秘密鍵またはレギュラー秘密鍵の送信は危険であるため、トランザクションの署名とネットワークへのトランザクションの送信を切り離した2段階方式でこのトランザクションを実行します。

### トランザクションの署名

{% include '_snippets/tutorial-sign-step.md' %}
<!--{#_ #}-->

要求フィールドに以下の値を指定します。

| 要求フィールド | 値                                                        |
|:--------------|:-------------------------------------------------------------|
| `Account`     | アカウントのアドレス。                                 |
| `secret`      | アカウントの`master_key`、`master_seed`、または`master_seed_hex`（マスター秘密鍵またはレギュラー秘密鍵） |


#### 要求フォーマット

要求フォーマットの例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
 "command":"sign",
 "tx_json":{
     "TransactionType":"SetRegularKey",
     "Account":"r9xQZdFGwbwTB3g9ncKByWZ3du6Skm7gQ8"
     },
  "secret":"snoPBrXtMeMyMHUVTgbuqAfg1SUTb"
}
```

*JSON-RPC*

```
{
   "method":"sign",
   "params":[
    	{
    	"secret" :"snoPBrXtMeMyMHUVTgbuqAfg1SUTb",
		"tx_json" :{
    		"TransactionType" :"SetRegularKey",
    		"Account" :"r9xQZdFGwbwTB3g9ncKByWZ3du6Skm7gQ8"
			}
		}
	]
}
```

*コマンドライン*

```
#Syntax: sign secret tx_json
rippled sign snoPBrXtMeMyMHUVTgbuqAfg1SUTb '{"TransactionType":"SetRegularKey", "Account":"rUAi7pipxGpYfPNg3LtPcf2ApiS8aw9A93"}'
```

<!-- MULTICODE_BLOCK_END -->


#### 応答フォーマット

処理が成功した応答の例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
 "result":{
   "tx_blob":"1200052280000000240000000268400000000000000A73210330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD02074473045022100CAB9A6F84026D57B05760D5E2395FB7BE86BF39F10DC6E2E69DC91238EE0970B022058EC36A8EF9EE65F5D0D8CAC4E88C8C19FEF39E40F53D4CCECBB59701D6D1E838114623B8DA4A0BFB3B61AB423391A182DC693DC159E",
   "tx_json":{
     "Account":"r9xQZdFGwbwTB3g9ncKByWZ3du6Skm7gQ8",
     "Fee":"10",
     "Flags":2147483648,
     "Sequence":2,
     "SigningPubKey":"0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020",
     "TransactionType":"SetRegularKey",
     "TxnSignature":"3045022100CAB9A6F84026D57B05760D5E2395FB7BE86BF39F10DC6E2E69DC91238EE0970B022058EC36A8EF9EE65F5D0D8CAC4E88C8C19FEF39E40F53D4CCECBB59701D6D1E83",
     "hash":"59BCAB8E5B9D4597D6A7BFF22F6C555D0F41420599A2E126035B6AF19261AD97"
   }
 },
 "status":"success",
 "type":"response"
}
```

*JSON-RPC*

```
{NEWWWWWWWWWWWW
   "result":{
       "status":"success",
       "tx_blob":"1200052280000000240000000268400000000000000A73210330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD02074473045022100CAB9A6F84026D57B05760D5E2395FB7BE86BF39F10DC6E2E69DC91238EE0970B022058EC36A8EF9EE65F5D0D8CAC4E88C8C19FEF39E40F53D4CCECBB59701D6D1E838114623B8DA4A0BFB3B61AB423391A182DC693DC159E",
       "tx_json":{
           "Account":"r9xQZdFGwbwTB3g9ncKByWZ3du6Skm7gQ8",
           "Fee":"10",
           "Flags":2147483648,
           "Sequence":2,
           "SigningPubKey":"0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020",
           "TransactionType":"SetRegularKey",
           "TxnSignature":"3045022100CAB9A6F84026D57B05760D5E2395FB7BE86BF39F10DC6E2E69DC91238EE0970B022058EC36A8EF9EE65F5D0D8CAC4E88C8C19FEF39E40F53D4CCECBB59701D6D1E83",
           "hash":"59BCAB8E5B9D4597D6A7BFF22F6C555D0F41420599A2E126035B6AF19261AD97"
       }
   }
}
```

*コマンドライン*

```
{
  "result" :{
     "status" :"success",
     "tx_blob" :"1200052280000000240000000268400000000000000A73210330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD02074473045022100CAB9A6F84026D57B05760D5E2395FB7BE86BF39F10DC6E2E69DC91238EE0970B022058EC36A8EF9EE65F5D0D8CAC4E88C8C19FEF39E40F53D4CCECBB59701D6D1E838114623B8DA4A0BFB3B61AB423391A182DC693DC159E",
     "tx_json" :{
        "Account" :"r9xQZdFGwbwTB3g9ncKByWZ3du6Skm7gQ8",
        "Fee" :"10",
        "Flags" :2147483648,
        "Sequence" :2,
        "SigningPubKey" :"0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020",
        "TransactionType" :"SetRegularKey",
        "TxnSignature" :"3045022100CAB9A6F84026D57B05760D5E2395FB7BE86BF39F10DC6E2E69DC91238EE0970B022058EC36A8EF9EE65F5D0D8CAC4E88C8C19FEF39E40F53D4CCECBB59701D6D1E83",
        "hash" :"59BCAB8E5B9D4597D6A7BFF22F6C555D0F41420599A2E126035B6AF19261AD97"
     }
  }
}
```

<!-- MULTICODE_BLOCK_END -->

`sign`コマンドの応答には上記のような`tx_blob`値が含まれています。オフライン署名応答には`signedTransaction`値が含まれています。いずれもトランザクションの署名済みバイナリ表現（ブロブ）です。

次に`submit`コマンドを使用して、トランザクションブロブ（`tx_blob`または`signedTransaction`）をネットワークに送信します。


### トランザクションの送信

オフライン署名応答の`signedTransaction`値、または`sign`コマンド応答の`tx_blob`値をとり、[submitメソッド][]を使用して`tx_blob`として送信します。

#### 要求フォーマット

要求フォーマットの例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
   "command":"submit",
   "tx_blob":"1200052280000000240000000268400000000000000A73210330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD02074473045022100CAB9A6F84026D57B05760D5E2395FB7BE86BF39F10DC6E2E69DC91238EE0970B022058EC36A8EF9EE65F5D0D8CAC4E88C8C19FEF39E40F53D4CCECBB59701D6D1E838114623B8DA4A0BFB3B61AB423391A182DC693DC159E"
}
```

*JSON-RPC*

```
{
  "method":"submit",
  "params":[
     {
        "tx_blob":"1200052280000000240000000268400000000000000A73210330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD02074473045022100CAB9A6F84026D57B05760D5E2395FB7BE86BF39F10DC6E2E69DC91238EE0970B022058EC36A8EF9EE65F5D0D8CAC4E88C8C19FEF39E40F53D4CCECBB59701D6D1E838114623B8DA4A0BFB3B61AB423391A182DC693DC159E"
     }
  ]
}
```

*コマンドライン*

```
#Syntax: submit tx_blob
rippled submit 1200052280000000240000000268400000000000000A73210330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD02074473045022100CAB9A6F84026D57B05760D5E2395FB7BE86BF39F10DC6E2E69DC91238EE0970B022058EC36A8EF9EE65F5D0D8CAC4E88C8C19FEF39E40F53D4CCECBB59701D6D1E838114623B8DA4A0BFB3B61AB423391A182DC693DC159E
```

<!-- MULTICODE_BLOCK_END -->


#### 応答フォーマット

処理が成功した応答の例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
 "result":{
   "engine_result":"tesSUCCESS",
   "engine_result_code":0,
   "engine_result_message":"The transaction was applied.Only final in a validated ledger.",
   "tx_blob":"1200052280000000240000000268400000000000000A73210330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD02074473045022100CAB9A6F84026D57B05760D5E2395FB7BE86BF39F10DC6E2E69DC91238EE0970B022058EC36A8EF9EE65F5D0D8CAC4E88C8C19FEF39E40F53D4CCECBB59701D6D1E838114623B8DA4A0BFB3B61AB423391A182DC693DC159E",
   "tx_json":{
     "Account":"r9xQZdFGwbwTB3g9ncKByWZ3du6Skm7gQ8",
     "Fee":"10",
     "Flags":2147483648,
     "Sequence":2,
     "SigningPubKey":"0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020",
     "TransactionType":"SetRegularKey",
     "TxnSignature":"3045022100CAB9A6F84026D57B05760D5E2395FB7BE86BF39F10DC6E2E69DC91238EE0970B022058EC36A8EF9EE65F5D0D8CAC4E88C8C19FEF39E40F53D4CCECBB59701D6D1E83",
     "hash":"59BCAB8E5B9D4597D6A7BFF22F6C555D0F41420599A2E126035B6AF19261AD97"
   }
 },
 "status":"success",
 "type":"response"
}
```

*JSON-RPC*

```
{
   "result":{
       "engine_result":"tesSUCCESS",
       "engine_result_code":0,
       "engine_result_message":"The transaction was applied.Only final in a validated ledger.",
       "status":"success",
       "tx_blob":"1200052280000000240000000268400000000000000A73210330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD02074473045022100CAB9A6F84026D57B05760D5E2395FB7BE86BF39F10DC6E2E69DC91238EE0970B022058EC36A8EF9EE65F5D0D8CAC4E88C8C19FEF39E40F53D4CCECBB59701D6D1E838114623B8DA4A0BFB3B61AB423391A182DC693DC159E",
       "tx_json":{
           "Account":"r9xQZdFGwbwTB3g9ncKByWZ3du6Skm7gQ8",
           "Fee":"10",
           "Flags":2147483648,
           "Sequence":2,
           "SigningPubKey":"0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020",
           "TransactionType":"SetRegularKey",
           "TxnSignature":"3045022100CAB9A6F84026D57B05760D5E2395FB7BE86BF39F10DC6E2E69DC91238EE0970B022058EC36A8EF9EE65F5D0D8CAC4E88C8C19FEF39E40F53D4CCECBB59701D6D1E83",
           "hash":"59BCAB8E5B9D4597D6A7BFF22F6C555D0F41420599A2E126035B6AF19261AD97"
       }
   }
}
```

*コマンドライン*

```
{
  "result" :{
     "engine_result" :"tesSUCCESS",
     "engine_result_code" :0,
     "engine_result_message" :"The transaction was applied.Only final in a validated ledger.",
     "status" :"success",
     "tx_blob" :"1200052280000000240000000268400000000000000A73210330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD02074473045022100CAB9A6F84026D57B05760D5E2395FB7BE86BF39F10DC6E2E69DC91238EE0970B022058EC36A8EF9EE65F5D0D8CAC4E88C8C19FEF39E40F53D4CCECBB59701D6D1E838114623B8DA4A0BFB3B61AB423391A182DC693DC159E",
     "tx_json" :{
        "Account" :"r9xQZdFGwbwTB3g9ncKByWZ3du6Skm7gQ8",
        "Fee" :"10",
        "Flags" :2147483648,
        "Sequence" :2,
        "SigningPubKey" :"0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020",
        "TransactionType" :"SetRegularKey",
        "TxnSignature" :"3045022100CAB9A6F84026D57B05760D5E2395FB7BE86BF39F10DC6E2E69DC91238EE0970B022058EC36A8EF9EE65F5D0D8CAC4E88C8C19FEF39E40F53D4CCECBB59701D6D1E83",
        "hash" :"59BCAB8E5B9D4597D6A7BFF22F6C555D0F41420599A2E126035B6AF19261AD97"
     }
  }
}
```

<!-- MULTICODE_BLOCK_END -->

レギュラーキーペアの削除が成功したかどうかを確認するには、削除したレギュラー秘密鍵を使用してトランザクションを送信できないことを確認します。

前述の`SetRegularKey`トランザクションにより削除されたレギュラー秘密鍵を使用して[AccountSetトランザクション][]に署名した際のエラー応答の例を以下に示します。


### 応答フォーマット

処理が成功した応答の例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
 "error":"badSecret",
 "error_code":41,
 "error_message":"Secret does not match account.",
 "request":{
   "command":"submit",
   "secret":"snoPBrXtMeMyMHUVTgbuqAfg1SUTb",
   "tx_json":{
     "Account":"r9xQZdFGwbwTB3g9ncKByWZ3du6Skm7gQ8",
     "TransactionType":"AccountSet"
   }
 },
 "status":"error",
 "type":"response"
}
```

*JSON-RPC*

```
{NEWWWWWWWWWWWW
   "result":{
       "error":"badSecret",
       "error_code":41,
       "error_message":"Secret does not match account.",
       "request":{
           "command":"submit",
           "secret":"snoPBrXtMeMyMHUVTgbuqAfg1SUTb",
           "tx_json":{
               "Account":"r9xQZdFGwbwTB3g9ncKByWZ3du6Skm7gQ8",
               "TransactionType":"AccountSet"
           }
       },
       "status":"error"
   }
}
```

*コマンドライン*

```
{
  "result" :{
     "error" :"badSecret",
     "error_code" :41,
     "error_message" :"Secret does not match account.",
     "request" :{
        "command" :"submit",
        "secret" :"snoPBrXtMeMyMHUVTgbuqAfg1SUTb",
        "tx_json" :{
           "Account" :"r9xQZdFGwbwTB3g9ncKByWZ3du6Skm7gQ8",
           "TransactionType" :"AccountSet"
        }
     },
     "status" :"error"
  }
}
```

<!-- MULTICODE_BLOCK_END -->

場合によっては、`SetRegularKey`トランザクションを使用して、[トランザクションコスト](transaction-cost.html)を支払わずに[Key Resetトランザクション](transaction-cost.html#key-resetトランザクション)を送信できます。FeeEscalation Amendmentを有効にすると、Key Resetトランザクションの名目トランザクションコストがゼロであっても、`rippled`は他のトランザクションよりもKey Resetトランザクションを優先します。

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
