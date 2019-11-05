# sign_for
[[ソース]<br>](https://github.com/ripple/rippled/blob/release/src/ripple/rpc/handlers/SignFor.cpp "Source")

`sign_for`コマンドは、[マルチ署名済みトランザクション](multi-signing.html)の署名を1つ提供します。

{% include '_snippets/public-signing-note.md' %}
<!--_ -->

このコマンドを使用するには、[MultiSign Amendment][]が有効になっている必要があります。[新規: rippled 0.31.0][]

## 要求フォーマット
要求フォーマットの例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
   "id":"sign_for_example",
   "command":"sign_for",
   "account":"rLFd1FzHMScFhLsXeaxStzv3UC97QHGAbM",
   "seed":"s████████████████████████████",
   "key_type":"ed25519",
   "tx_json":{
       "TransactionType":"TrustSet",
       "Account":"rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC",
       "Flags":262144,
       "LimitAmount":{
           "currency":"USD",
           "issuer":"rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
           "value":"100"
       },
       "Sequence":2,
       "SigningPubKey":"",
       "Fee":"30000"
   }
}
```

*JSON-RPC*

```
POST http://localhost:5005/
{
   "method":"sign_for",
   "params":[{
       "account":"rLFd1FzHMScFhLsXeaxStzv3UC97QHGAbM",
       "seed":"s████████████████████████████",
       "key_type":"ed25519",
       "tx_json":{
           "TransactionType":"TrustSet",
           "Account":"rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC",
           "Flags":262144,
           "LimitAmount":{
               "currency":"USD",
               "issuer":"rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
               "value":"100"
           },
           "Sequence":2,
           "SigningPubKey":"",
           "Fee":"30000"
       }
   }]
}
```

*コマンドライン*

```
#Syntax: rippled sign_for <signer_address> <signer_secret> [offline]
rippled sign_for rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW s████████████████████████████ '{
   "TransactionType":"TrustSet",
   "Account":"rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC",
   "Flags":262144,
   "LimitAmount":{
       "currency":"USD",
       "issuer":"rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
       "value":"100"
   },
   "Sequence":2,
   "SigningPubKey":"",
   "Fee":"30000"
}'
```

<!-- MULTICODE_BLOCK_END -->

要求には以下のパラメーターが含まれます。

| `Field`      | 型                   | 説明                                   |
|:-------------|:---------------------|:---------------------------------------|
| `account`    | 文字列 - [アドレス][] | 署名を提供するアドレス。 |
| `tx_json`    | オブジェクト               | 署名する[トランザクション](transaction-formats.html)。[signメソッド][]を使用する場合とは異なり、トランザクションのすべてのフィールド（`Fee`と`Sequence`を含む）を指定する必要があります。トランザクションに、空の文字列を値として指定した`SigningPubKey`フィールドを含める必要があります。このオブジェクトには、以前に収集した署名を持つ`Signers`配列を必要に応じて含めることができます。 |
| `secret`       | 文字列  | _（省略可）_ トランザクションを提供するアカウントのシークレットキー。トランザクションへの署名に使用されます。信頼できないサーバーに対して、またはセキュリティが確保されていないネットワーク接続を通じて機密情報を送信しないでください。`key_type`、`seed`、`seed_hex`、`passphrase`と同時に使用することはできません。 |
| `seed`         | 文字列  | _（省略可）_ トランザクションを提供するアカウントのシークレットキー。トランザクションへの署名に使用されます。XRP Ledgerの[base58][]フォーマットにする必要があります。指定する場合は、`key_type`も指定する必要があります。`secret`、`seed_hex`、`passphrase`と同時に使用することはできません。 |
| `seed_hex`     | 文字列  | _（省略可）_ トランザクションを提供するアカウントのシークレットキー。トランザクションへの署名に使用されます。16進フォーマットにする必要があります。指定する場合は、`key_type`も指定する必要があります。`secret`、`seed`、`passphrase`と同時に使用することはできません。 |
| `passphrase`   | 文字列  | _（省略可）_ トランザクションを提供するアカウントのシークレットキー。文字列パスフレーズとして、トランザクションへの署名に使用されます。指定する場合は、`key_type`も指定する必要があります。`secret`、`seed`、`seed_hex`と同時に使用することはできません。 |
| `key_type`     | 文字列  | _（省略可）_ この要求で提供する暗号鍵の種類。有効な種類は、`secp256k1`または`ed25519`です。デフォルトでは`secp256k1`です。`secret`と同時に使用することはできません。**注意:** Ed25519のサポートは実験的な機能です。 |

シークレットキーを指定した**1つのフィールドのみ**を指定する必要があります。次のいずれかになります。

* `secret`値を指定し、`key_type`フィールドを省略します。この値は、XRP Ledgerの[base58][]シード、RFC-1751、16進値のフォーマットで記述するか、文字列パスフレーズとして記述します（secp256k1キーのみ）。
* `key_type`値と、`seed`、`seed_hex`、または`passphrase`のいずれか1つを提供します。`secret`フィールドは省略します。（コマンドライン構文ではサポートされません。）

## 応答フォーマット

処理が成功した応答の例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
 "id":"sign_for_example",
 "status":"success",
 "type":"response",
 "result":{
   "tx_blob":"1200142200040000240000000263D5038D7EA4C680000000000000000000000000005553440000000000B5F762798A53D543A014CAF8B297CFF8F2F937E868400000000000753073008114A3780F5CB5A44D366520FC44055E8ED44D9A2270F3E0107321EDDF4ECB8F34A168143B928D48EFE625501FB8552403BBBD3FC038A5788951D7707440C3DCA3FEDE6D785398EEAB10A46B44047FF1B0863FC4313051FB292C991D1E3A9878FABB301128FE4F86F3D8BE4706D53FA97F5536DBD31AF14CD83A5ACDEB068114D96CB910955AB40A0E987EEE82BB3CEDD4441AAAE1F1",
   "tx_json":{
     "Account":"rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC",
     "Fee":"30000",
     "Flags":262144,
     "LimitAmount":{
       "currency":"USD",
       "issuer":"rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
       "value":"100"
     },
     "Sequence":2,
     "Signers":[
       {
         "Signer":{
           "Account":"rLFd1FzHMScFhLsXeaxStzv3UC97QHGAbM",
           "SigningPubKey":"EDDF4ECB8F34A168143B928D48EFE625501FB8552403BBBD3FC038A5788951D770",
           "TxnSignature":"C3DCA3FEDE6D785398EEAB10A46B44047FF1B0863FC4313051FB292C991D1E3A9878FABB301128FE4F86F3D8BE4706D53FA97F5536DBD31AF14CD83A5ACDEB06"
         }
       }
     ],
     "SigningPubKey":"",
     "TransactionType":"TrustSet",
     "hash":"5216A13A3E3CF662352F0B430C7D82B7450415B6883DD428B5EC1DF1DE45DD8C"
   }
 }
}
```

*JSON-RPC*

```
200 OK
{
  "result" :{
     "status" :"success",
     "tx_blob" :"1200142200040000240000000263D5038D7EA4C680000000000000000000000000005553440000000000B5F762798A53D543A014CAF8B297CFF8F2F937E868400000000000753073008114A3780F5CB5A44D366520FC44055E8ED44D9A2270F3E010732102B3EC4E5DD96029A647CFA20DA07FE1F85296505552CCAC114087E66B46BD77DF744730450221009C195DBBF7967E223D8626CA19CF02073667F2B22E206727BFE848FF42BEAC8A022048C323B0BED19A988BDBEFA974B6DE8AA9DCAE250AA82BBD1221787032A864E58114204288D2E47F8EF6C99BCC457966320D12409711E1F1",
     "tx_json" :{
        "Account" :"rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC",
        "Fee" :"30000",
        "Flags" :262144,
        "LimitAmount" :{
           "currency" :"USD",
           "issuer" :"rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
           "value" :"100"
        },
        "Sequence" :2,
        "Signers" :[
           {
              "Signer" :{
                 "Account" :"rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
                 "SigningPubKey" :"02B3EC4E5DD96029A647CFA20DA07FE1F85296505552CCAC114087E66B46BD77DF",
                 "TxnSignature" :"30450221009C195DBBF7967E223D8626CA19CF02073667F2B22E206727BFE848FF42BEAC8A022048C323B0BED19A988BDBEFA974B6DE8AA9DCAE250AA82BBD1221787032A864E5"
              }
           }
        ],
        "SigningPubKey" :"",
        "TransactionType" :"TrustSet",
        "hash" :"A94A6417D1A7AAB059822B894E13D322ED3712F7212CE9257801F96DE6C3F6AE"
     }
  }
}
```

*コマンドライン*

```
Loading:"/etc/rippled.cfg"
Connecting to 127.0.0.1:5005
{
  "result" :{
     "status" :"success",
     "tx_blob" :"1200142200040000240000000263D5038D7EA4C680000000000000000000000000005553440000000000B5F762798A53D543A014CAF8B297CFF8F2F937E868400000000000753073008114A3780F5CB5A44D366520FC44055E8ED44D9A2270F3E010732102B3EC4E5DD96029A647CFA20DA07FE1F85296505552CCAC114087E66B46BD77DF744730450221009C195DBBF7967E223D8626CA19CF02073667F2B22E206727BFE848FF42BEAC8A022048C323B0BED19A988BDBEFA974B6DE8AA9DCAE250AA82BBD1221787032A864E58114204288D2E47F8EF6C99BCC457966320D12409711E1F1",
     "tx_json" :{
        "Account" :"rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC",
        "Fee" :"30000",
        "Flags" :262144,
        "LimitAmount" :{
           "currency" :"USD",
           "issuer" :"rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
           "value" :"100"
        },
        "Sequence" :2,
        "Signers" :[
           {
              "Signer" :{
                 "Account" :"rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
                 "SigningPubKey" :"02B3EC4E5DD96029A647CFA20DA07FE1F85296505552CCAC114087E66B46BD77DF",
                 "TxnSignature" :"30450221009C195DBBF7967E223D8626CA19CF02073667F2B22E206727BFE848FF42BEAC8A022048C323B0BED19A988BDBEFA974B6DE8AA9DCAE250AA82BBD1221787032A864E5"
              }
           }
        ],
        "SigningPubKey" :"",
        "TransactionType" :"TrustSet",
        "hash" :"A94A6417D1A7AAB059822B894E13D322ED3712F7212CE9257801F96DE6C3F6AE"
     }
  }
}
```

<!-- MULTICODE_BLOCK_END -->

この応答は[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれます。

| `Field`   | 型     | 説明                                                    |
|:----------|:-------|:--------------------------------------------------------|
| `tx_blob` | 文字列 | 新規に追加した署名を含む署名済みトランザクションの16進数表記。トランザクションに十分な数の署名がある場合には、[`submit`メソッドを使用してこの文字列を送信](submit.html#送信専用モード)できます。 |
| `tx_json` | オブジェクト | 新規に追加された署名を含む`Signers`配列を持つ[トランザクションの指定](transaction-formats.html)（JSONフォーマット） 。トランザクションに十分な数の署名がある場合には、[submit_multisignedメソッド][]を使用してこのオブジェクトを送信できます。 |

## 考えられるエラー

* [汎用エラータイプ][]のすべて。
* `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。
* `srcActNotFound` - トランザクションの`Account`が、レジャーの資金供給のあるアドレスではない場合。
* `srcActMalformed` - 要求の署名アドレス（`account`フィールド）の形式が無効である場合。
* `badSeed` - 指定されたシード値のフォーマットが正しくありません。
* `badSecret` - 指定されたシークレット値のフォーマットが正しくありません。


{% include '_snippets/rippled_versions.md' %}
{% include '_snippets/rippled-api-links.md' %}
