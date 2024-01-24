---
html: assign-a-regular-key-pair.html
parent: manage-account-settings.html
seo:
    description: アカウントからトランザクションに署名できるように第2キーペアを承認します。このキーペアは後から変更や削除が可能です。
labels:
  - セキュリティ
  - アカウント
---
# レギュラーキーペアの割り当て

XRP Ledgerでは、アカウントはその後のトランザクションには _レギュラーキーペア_ と呼ばれるセカンダリキーペアで署名することができます。レギュラーキーペアの秘密鍵が漏えいした場合は、秘密鍵を削除または交換できます。その際に、アカウントの秘密鍵以外の設定を変更したり、他のアカウントとの関係を再設定する必要はありません。レギュラーキーペアを積極的にローテーションすることも可能です。（アカウントのアドレスに固有に関連付けられているアカウントのマスターキーペアでは、このような操作は実行できません。）

マスターキーペアとレギュラーキーペアの詳細は、[暗号鍵](../../concepts/accounts/cryptographic-keys.md)を参照してください。

このチュートリアルでは、レギュラーキーペアをアカウントに割り当てるために必要な手順を説明します。

1. [キーペアの生成](#1-キーペアの生成)
2. [生成したキーペアをレギュラーキーペアとしてアカウントに割り当てる](#2-生成したキーペアをレギュラーキーペアとしてアカウントに割り当てる)
3. [レギュラーキーペアの検証](#3-レギュラーキーペアの検証)
4. [次のステップ](#4-次のステップ)


## 1. キーペアの生成

[wallet_proposeメソッド][]を使用して、アカウントにレギュラーキーペアとして割り当てるキーペアを生成します。

### リクエストのフォーマット

リクエストのフォーマットの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
 "command":"wallet_propose"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
 "method":"wallet_propose"
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
#Syntax: wallet_propose
rippled wallet_propose
```
{% /tab %}

{% /tabs %}


### レスポンスのフォーマット

処理が成功したレスポンスの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
 "result":{
   "account_id":"rsprUqu6BHAffAeG4HpSdjBNvnA6gdnZV7",
   "key_type":"secp256k1",
   "master_key":"KNEW BENT LYNN LED GAD BEN KENT SHAM HOBO RINK WALT ALLY",
   "master_seed":"sh8i92YRnEjJy3fpFkL8txQSCVo79",
   "master_seed_hex":"966C0F68643EFBA50D58D191D4CA8AA7",
   "public_key":"aBRNH5wUurfhZcoyR6nRwDSa95gMBkovBJ8V4cp1C1pM28H7EPL1",
   "public_key_hex":"03AEEFE1E8ED4BBC009DE996AC03A8C6B5713B1554794056C66E5B8D1753C7DD0E"
 },
 "status":"success",
 "type":"response"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
   "result":{
       "account_id":"rsprUqu6BHAffAeG4HpSdjBNvnA6gdnZV7",
       "key_type":"secp256k1",
       "master_key":"KNEW BENT LYNN LED GAD BEN KENT SHAM HOBO RINK WALT ALLY",
       "master_seed":"sh8i92YRnEjJy3fpFkL8txQSCVo79",
       "master_seed_hex":"966C0F68643EFBA50D58D191D4CA8AA7",
       "public_key":"aBRNH5wUurfhZcoyR6nRwDSa95gMBkovBJ8V4cp1C1pM28H7EPL1",
       "public_key_hex":"03AEEFE1E8ED4BBC009DE996AC03A8C6B5713B1554794056C66E5B8D1753C7DD0E"
       "status":"success"
   }
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```json
{
  "result" :{
     "account_id" :"rsprUqu6BHAffAeG4HpSdjBNvnA6gdnZV7",
     "key_type" :"secp256k1",
     "master_key" :"KNEW BENT LYNN LED GAD BEN KENT SHAM HOBO RINK WALT ALLY",
     "master_seed" :"sh8i92YRnEjJy3fpFkL8txQSCVo79",
     "master_seed_hex" :"966C0F68643EFBA50D58D191D4CA8AA7",
     "public_key" :"aBRNH5wUurfhZcoyR6nRwDSa95gMBkovBJ8V4cp1C1pM28H7EPL1",
     "public_key_hex" :"03AEEFE1E8ED4BBC009DE996AC03A8C6B5713B1554794056C66E5B8D1753C7DD0E",
     "status" :"success"
  }
}
```
{% /tab %}

{% /tabs %}

次のステップでは、このレスポンスの`account_id`を使用してキーペアをレギュラーキーペアとしてアカウントに割り当てます。また、`master_seed`値を安全な場所に保管してください。（この値以外は特に覚えておく必要はありません。）


## 2. 生成したキーペアをレギュラーキーペアとしてアカウントに割り当てる

[SetRegularKeyトランザクション][]を使用して、ステップ1で生成したキーペアをレギュラーキーペアとしてアカウントに割り当てます。

SetRegularKeyトランザクションでレギュラーキーペアを初めてアカウントに割り当てる際には、アカウントのマスター秘密鍵（シークレット）による署名が必要です。マスター秘密鍵の送信は危険であるため、トランザクションの署名とネットワークへのトランザクション送信を切り離した2段階方式でこのトランザクションを実行します。

それ以降のSetRegularKeyトランザクションの送信時には、既存のレギュラー秘密鍵で署名し、レギュラー秘密鍵自体を置換または[削除](change-or-remove-a-regular-key-pair.md)できます。ネットワーク上でレギュラー秘密鍵を送信してはならないことに注意してください。


### トランザクションの署名

{% partial file="/_snippets/tutorial-sign-step.md" /%}


リクエストフィールドに以下の値を指定します。

| リクエストフィールド | 値                                                        |
|:--------------|:-------------------------------------------------------------|
| `Account`     | アカウントのアドレス。                                 |
| `RegularKey`  | ステップ1で生成された`account_id`。                           |
| `secret`      | アカウントの`master_key`、`master_seed`、または`master_seed_hex`（マスター秘密鍵）。|


#### リクエストのフォーマット

リクエストのフォーマットの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
 "command":"sign",
 "tx_json":{
     "TransactionType":"SetRegularKey",
     "Account":"rUAi7pipxGpYfPNg3LtPcf2ApiS8aw9A93",
     "RegularKey":"rsprUqu6BHAffAeG4HpSdjBNvnA6gdnZV7"
     },
  "secret":"ssCATR7CBvn4GLd1UuU2bqqQffHki"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
  "method":"sign",
  "params":[
     {
        "tx_json":{
           "TransactionType":"SetRegularKey",
           "Account":"rUAi7pipxGpYfPNg3LtPcf2ApiS8aw9A93",
           "RegularKey":"rsprUqu6BHAffAeG4HpSdjBNvnA6gdnZV7"
        },
        "secret":"ssCATR7CBvn4GLd1UuU2bqqQffHki"
     }
  ]
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
#Syntax: sign secret tx_json
rippled sign ssCATR7CBvn4GLd1UuU2bqqQffHki '{"TransactionType":"SetRegularKey", "Account":"rUAi7pipxGpYfPNg3LtPcf2ApiS8aw9A93", "RegularKey":"rsprUqu6BHAffAeG4HpSdjBNvnA6gdnZV7"}'
```
{% /tab %}

{% /tabs %}


#### レスポンスのフォーマット

処理が成功したレスポンスの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
 "result":{
   "tx_blob":"1200052280000000240000000468400000000000000A73210384CA3C528F10C75F26E0917F001338BD3C9AA1A39B9FBD583DFFFD96CF2E2D7A7446304402204BCD5663F3A2BA02D2CE374439096EC6D27273522CD6E6E0BDBFB518730EAAE402200ECD02D8D2525D6FA4642613E71E395ECCEA01C42C35A668BF092A00EB649C268114830923439D307E642CED308FD91EF701A7BAA74788141620D685FB08D81A70D0B668749CF2E130EA7540",
   "tx_json":{
     "Account":"rUAi7pipxGpYfPNg3LtPcf2ApiS8aw9A93",
     "Fee":"10",
     "Flags":2147483648,
     "RegularKey":"rsprUqu6BHAffAeG4HpSdjBNvnA6gdnZV7",
     "Sequence":4,
     "SigningPubKey":"0384CA3C528F10C75F26E0917F001338BD3C9AA1A39B9FBD583DFFFD96CF2E2D7A",
     "TransactionType":"SetRegularKey",
     "TxnSignature":"304402204BCD5663F3A2BA02D2CE374439096EC6D27273522CD6E6E0BDBFB518730EAAE402200ECD02D8D2525D6FA4642613E71E395ECCEA01C42C35A668BF092A00EB649C26",
     "hash":"AB73BBF7C99061678B59FB48D72CA0F5FC6DD2815B6736C6E9EB94439EC236CE"
   }
 },
 "status":"success",
 "type":"response"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
   "result":{
       "status":"success",
       "tx_blob":"1200052280000000240000000768400000000000000A73210384CA3C528F10C75F26E0917F001338BD3C9AA1A39B9FBD583DFFFD96CF2E2D7A7446304402201453CA3D4D17F0EE3828B9E3D6ACF65327F5D4FC2BA30953CACF6CBCB4145E3502202F2154BED1D7462CAC1E3DBB31864E48C3BA0B3133ACA5E37EC54F0D0C339E2D8114830923439D307E642CED308FD91EF701A7BAA74788141620D685FB08D81A70D0B668749CF2E130EA7540",
       "tx_json":{
           "Account":"rUAi7pipxGpYfPNg3LtPcf2ApiS8aw9A93",
           "Fee":"10",
           "Flags":2147483648,
           "RegularKey":"rsprUqu6BHAffAeG4HpSdjBNvnA6gdnZV7",
           "Sequence":4,
           "SigningPubKey":"0384CA3C528F10C75F26E0917F001338BD3C9AA1A39B9FBD583DFFFD96CF2E2D7A",
           "TransactionType":"SetRegularKey",
           "TxnSignature":"304402201453CA3D4D17F0EE3828B9E3D6ACF65327F5D4FC2BA30953CACF6CBCB4145E3502202F2154BED1D7462CAC1E3DBB31864E48C3BA0B3133ACA5E37EC54F0D0C339E2D",
           "hash":"AB73BBF7C99061678B59FB48D72CA0F5FC6DD2815B6736C6E9EB94439EC236CE"
       }
   }
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```json
{
  "result" :{
     "status" :"success",
     "tx_blob" :"1200052280000000240000000768400000000000000A73210384CA3C528F10C75F26E0917F001338BD3C9AA1A39B9FBD583DFFFD96CF2E2D7A7446304402201453CA3D4D17F0EE3828B9E3D6ACF65327F5D4FC2BA30953CACF6CBCB4145E3502202F2154BED1D7462CAC1E3DBB31864E48C3BA0B3133ACA5E37EC54F0D0C339E2D8114830923439D307E642CED308FD91EF701A7BAA74788141620D685FB08D81A70D0B668749CF2E130EA7540",
     "tx_json" :{
        "Account" :"rUAi7pipxGpYfPNg3LtPcf2ApiS8aw9A93",
        "Fee" :"10",
        "Flags" :2147483648,
        "RegularKey" :"rsprUqu6BHAffAeG4HpSdjBNvnA6gdnZV7",
        "Sequence" :4,
        "SigningPubKey" :"0384CA3C528F10C75F26E0917F001338BD3C9AA1A39B9FBD583DFFFD96CF2E2D7A",
        "TransactionType" :"SetRegularKey",
        "TxnSignature" :"304402201453CA3D4D17F0EE3828B9E3D6ACF65327F5D4FC2BA30953CACF6CBCB4145E3502202F2154BED1D7462CAC1E3DBB31864E48C3BA0B3133ACA5E37EC54F0D0C339E2D",
        "hash" :"AB73BBF7C99061678B59FB48D72CA0F5FC6DD2815B6736C6E9EB94439EC236CE"
     }
  }
}
```
{% /tab %}

{% /tabs %}

`sign`コマンドのレスポンスには上記のような`tx_blob`値が含まれています。オフライン署名レスポンスには`signedTransaction`値が含まれています。いずれもトランザクションの署名済みバイナリ表現（ブロブ）です。

次に`submit`コマンドを使用して、トランザクションブロブ（`tx_blob`または`signedTransaction`）をネットワークに送信します。


### トランザクションの送信

オフライン署名レスポンスの`signedTransaction`値、または`sign`コマンドレスポンスの`tx_blob`値をとり、[submitメソッド][]を使用して`tx_blob`として値として送信します。

#### リクエストのフォーマット

リクエストのフォーマットの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
   "command":"submit",
   "tx_blob":"1200052280000000240000000468400000000000000A73210384CA3C528F10C75F26E0917F001338BD3C9AA1A39B9FBD583DFFFD96CF2E2D7A7446304402204BCD5663F3A2BA02D2CE374439096EC6D27273522CD6E6E0BDBFB518730EAAE402200ECD02D8D2525D6FA4642613E71E395ECCEA01C42C35A668BF092A00EB649C268114830923439D307E642CED308FD91EF701A7BAA74788141620D685FB08D81A70D0B668749CF2E130EA7540"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
  "method":"submit",
  "params":[
     {
        "tx_blob":"1200052280000000240000000468400000000000000A73210384CA3C528F10C75F26E0917F001338BD3C9AA1A39B9FBD583DFFFD96CF2E2D7A7446304402204BCD5663F3A2BA02D2CE374439096EC6D27273522CD6E6E0BDBFB518730EAAE402200ECD02D8D2525D6FA4642613E71E395ECCEA01C42C35A668BF092A00EB649C268114830923439D307E642CED308FD91EF701A7BAA74788141620D685FB08D81A70D0B668749CF2E130EA7540"
     }
  ]
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
#Syntax: submit tx_blob
rippled submit 1200052280000000240000000468400000000000000A73210384CA3C528F10C75F26E0917F001338BD3C9AA1A39B9FBD583DFFFD96CF2E2D7A7446304402204BCD5663F3A2BA02D2CE374439096EC6D27273522CD6E6E0BDBFB518730EAAE402200ECD02D8D2525D6FA4642613E71E395ECCEA01C42C35A668BF092A00EB649C268114830923439D307E642CED308FD91EF701A7BAA74788141620D685FB08D81A70D0B668749CF2E130EA7540
```
{% /tab %}

{% /tabs %}


#### レスポンスのフォーマット

処理が成功したレスポンスの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
 "result":{
   "engine_result":"tesSUCCESS",
   "engine_result_code":0,
   "engine_result_message":"The transaction was applied.Only final in a validated ledger.",
   "tx_blob":"1200052280000000240000000468400000000000000A73210384CA3C528F10C75F26E0917F001338BD3C9AA1A39B9FBD583DFFFD96CF2E2D7A7446304402204BCD5663F3A2BA02D2CE374439096EC6D27273522CD6E6E0BDBFB518730EAAE402200ECD02D8D2525D6FA4642613E71E395ECCEA01C42C35A668BF092A00EB649C268114830923439D307E642CED308FD91EF701A7BAA74788141620D685FB08D81A70D0B668749CF2E130EA7540",
   "tx_json":{
     "Account":"rUAi7pipxGpYfPNg3LtPcf2ApiS8aw9A93",
     "Fee":"10",
     "Flags":2147483648,
     "RegularKey":"rsprUqu6BHAffAeG4HpSdjBNvnA6gdnZV7",
     "Sequence":4,
     "SigningPubKey":"0384CA3C528F10C75F26E0917F001338BD3C9AA1A39B9FBD583DFFFD96CF2E2D7A",
     "TransactionType":"SetRegularKey",
     "TxnSignature":"304402204BCD5663F3A2BA02D2CE374439096EC6D27273522CD6E6E0BDBFB518730EAAE402200ECD02D8D2525D6FA4642613E71E395ECCEA01C42C35A668BF092A00EB649C26",
     "hash":"AB73BBF7C99061678B59FB48D72CA0F5FC6DD2815B6736C6E9EB94439EC236CE"
   }
 },
 "status":"success",
 "type":"response"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
   "result":{
      "engine_result":"tesSUCCESS",
      "engine_result_code":0,
      "engine_result_message":"The transaction was applied.Only final in a validated ledger.",
       "status":"success",
       "tx_blob":"1200052280000000240000000468400000000000000A73210384CA3C528F10C75F26E0917F001338BD3C9AA1A39B9FBD583DFFFD96CF2E2D7A7446304402204BCD5663F3A2BA02D2CE374439096EC6D27273522CD6E6E0BDBFB518730EAAE402200ECD02D8D2525D6FA4642613E71E395ECCEA01C42C35A668BF092A00EB649C268114830923439D307E642CED308FD91EF701A7BAA74788141620D685FB08D81A70D0B668749CF2E130EA7540",
       "tx_json":{
           "Account":"rUAi7pipxGpYfPNg3LtPcf2ApiS8aw9A93",
           "Fee":"10",
           "Flags":2147483648,
           "RegularKey":"rsprUqu6BHAffAeG4HpSdjBNvnA6gdnZV7",
           "Sequence":4,
           "SigningPubKey":"0384CA3C528F10C75F26E0917F001338BD3C9AA1A39B9FBD583DFFFD96CF2E2D7A",
           "TransactionType":"SetRegularKey",
           "TxnSignature":"304402204BCD5663F3A2BA02D2CE374439096EC6D27273522CD6E6E0BDBFB518730EAAE402200ECD02D8D2525D6FA4642613E71E395ECCEA01C42C35A668BF092A00EB649C26",
           "hash":"AB73BBF7C99061678B59FB48D72CA0F5FC6DD2815B6736C6E9EB94439EC236CE"
       }
   }
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```json
{
  "result" :{
     "engine_result" :"tesSUCCESS",
     "engine_result_code" :0,
     "engine_result_message" :"The transaction was applied.Only final in a validated ledger.",
     "status" :"success",
     "tx_blob" :"1200052280000000240000000468400000000000000A73210384CA3C528F10C75F26E0917F001338BD3C9AA1A39B9FBD583DFFFD96CF2E2D7A7446304402204BCD5663F3A2BA02D2CE374439096EC6D27273522CD6E6E0BDBFB518730EAAE402200ECD02D8D2525D6FA4642613E71E395ECCEA01C42C35A668BF092A00EB649C268114830923439D307E642CED308FD91EF701A7BAA74788141620D685FB08D81A70D0B668749CF2E130EA7540",
     "tx_json" :{
        "Account" :"rUAi7pipxGpYfPNg3LtPcf2ApiS8aw9A93",
        "Fee" :"10",
        "Flags" :2147483648,
        "RegularKey" :"rsprUqu6BHAffAeG4HpSdjBNvnA6gdnZV7",
        "Sequence" :4,
        "SigningPubKey" :"0384CA3C528F10C75F26E0917F001338BD3C9AA1A39B9FBD583DFFFD96CF2E2D7A",
        "TransactionType" :"SetRegularKey",
        "TxnSignature" :"304402204BCD5663F3A2BA02D2CE374439096EC6D27273522CD6E6E0BDBFB518730EAAE402200ECD02D8D2525D6FA4642613E71E395ECCEA01C42C35A668BF092A00EB649C26",
        "hash" :"AB73BBF7C99061678B59FB48D72CA0F5FC6DD2815B6736C6E9EB94439EC236CE"
     }
  }
}
```
{% /tab %}

{% /tabs %}


レスポンスに含まれるトランザクションの`hash`は、[トランザクションの最終結果を検索する](../../references/http-websocket-apis/public-api-methods/transaction-methods/tx.md)ときに使用できることに注意してください。


## 3. レギュラーキーペアの検証

アカウントにレギュラーキーペアが正しく設定されていることを検証するため、ステップ2でアカウントに割り当てたレギュラー秘密鍵で[AccountSetトランザクション][]に署名し、アカウントからこのトランザクションを送信します。

ステップ2で説明したように、マスター秘密鍵の送信は危険です。レギュラー秘密鍵の送信も同様に危険です。そのため、トランザクションの署名とネットワークへのトランザクションの送信を切り離した2段階方式でこのトランザクションを実行します。


### トランザクションの署名

{% partial file="/_snippets/tutorial-sign-step.md" /%}


リクエストフィールドに以下の値を指定します。

| リクエストフィールド | 値                                                        |
|:--------------|:-------------------------------------------------------------|
| `Account`     | アカウントのアドレス。                               |
| `secret`      | ステップ1で生成し、ステップ2でアカウントに割り当てた`master_key`、`master_seed`、または`master_seed_hex`（レギュラー秘密鍵）。 |


#### リクエストのフォーマット

リクエストのフォーマットの例を示します。このリクエストには`AccountSet`オプションが含まれていないことに注意してください。つまり、トランザクションの成功による影響は、アカウントのレギュラーキーペアが正しく設定されていることを確認する（およびトランザクションコストを消却する）こと以外に何もありません。


{% tabs %}

{% tab label="WebSocket" %}
```json
{
 "command":"sign",
 "tx_json":{
     "TransactionType":"AccountSet",
     "Account":"rUAi7pipxGpYfPNg3LtPcf2ApiS8aw9A93"
     },
  "secret":"sh8i92YRnEjJy3fpFkL8txQSCVo79"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
  "method":"sign",
  "params":[
     {
        "tx_json":{
           "TransactionType":"AccountSet",
           "Account":"rUAi7pipxGpYfPNg3LtPcf2ApiS8aw9A93"
        },
        "secret":"sh8i92YRnEjJy3fpFkL8txQSCVo79"
     }
  ]
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
#Syntax: sign secret tx_json
rippled sign sh8i92YRnEjJy3fpFkL8txQSCVo79 '{"TransactionType":"AccountSet", "Account":"rUAi7pipxGpYfPNg3LtPcf2ApiS8aw9A93"}'
```
{% /tab %}

{% /tabs %}


#### レスポンスのフォーマット

処理が成功したレスポンスの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
 "result":{
   "tx_blob":"1200032280000000240000000468400000000000000A73210330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD02074473045022100A50E867D3B1B5A39F23F1ABCA5C7C3EC755442FDAA357EFD897B865ACA7686DB02206077BF459BCE39BCCBFE1A128DA986D1E00CBEC5F0D6B0E11710F60BE2976FB88114623B8DA4A0BFB3B61AB423391A182DC693DC159E",
   "tx_json":{
     "Account":"rUAi7pipxGpYfPNg3LtPcf2ApiS8aw9A93",
     "Fee":"10",
     "Flags":2147483648,
     "Sequence":4,
     "SigningPubKey":"0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020",
     "TransactionType":"AccountSet",
     "TxnSignature":"3045022100A50E867D3B1B5A39F23F1ABCA5C7C3EC755442FDAA357EFD897B865ACA7686DB02206077BF459BCE39BCCBFE1A128DA986D1E00CBEC5F0D6B0E11710F60BE2976FB8",
     "hash":"D9B305CB6E861D0994A5CDD4726129D91AC4277111DC444DE4CEE44AD4674A9F"
   }
 },
 "status":"success",
 "type":"response"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
   "result":{
       "status":"success",
       "tx_blob":"1200032280000000240000000468400000000000000A73210330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD02074473045022100A50E867D3B1B5A39F23F1ABCA5C7C3EC755442FDAA357EFD897B865ACA7686DB02206077BF459BCE39BCCBFE1A128DA986D1E00CBEC5F0D6B0E11710F60BE2976FB88114623B8DA4A0BFB3B61AB423391A182DC693DC159E",
       "tx_json":{
           "Account":"rUAi7pipxGpYfPNg3LtPcf2ApiS8aw9A93",
           "Fee":"10",
           "Flags":2147483648,
           "Sequence":4,
           "SigningPubKey":"0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020",
           "TransactionType":"AccountSet",
           "TxnSignature":"3045022100A50E867D3B1B5A39F23F1ABCA5C7C3EC755442FDAA357EFD897B865ACA7686DB02206077BF459BCE39BCCBFE1A128DA986D1E00CBEC5F0D6B0E11710F60BE2976FB8",
           "hash":"D9B305CB6E861D0994A5CDD4726129D91AC4277111DC444DE4CEE44AD4674A9F"
       }
   }
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```json
{
  "result" :{
     "status" :"success",
     "tx_blob" :"1200032280000000240000000468400000000000000A73210330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD02074473045022100A50E867D3B1B5A39F23F1ABCA5C7C3EC755442FDAA357EFD897B865ACA7686DB02206077BF459BCE39BCCBFE1A128DA986D1E00CBEC5F0D6B0E11710F60BE2976FB88114623B8DA4A0BFB3B61AB423391A182DC693DC159E",
     "tx_json" :{
        "Account" :"rUAi7pipxGpYfPNg3LtPcf2ApiS8aw9A93",
        "Fee" :"10",
        "Flags" :2147483648,
        "Sequence" :4,
        "SigningPubKey" :"0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020",
        "TransactionType" :"AccountSet",
        "TxnSignature" :"3045022100A50E867D3B1B5A39F23F1ABCA5C7C3EC755442FDAA357EFD897B865ACA7686DB02206077BF459BCE39BCCBFE1A128DA986D1E00CBEC5F0D6B0E11710F60BE2976FB8",
        "hash" :"D9B305CB6E861D0994A5CDD4726129D91AC4277111DC444DE4CEE44AD4674A9F"
     }
  }
}
```
{% /tab %}

{% /tabs %}

`sign`コマンドのレスポンスには上記のような`tx_blob`値が含まれています。オフライン署名レスポンスには`signedTransaction`値が含まれています。いずれもトランザクションの署名済みバイナリ表現（ブロブ）です。

次に`submit`コマンドを使用して、トランザクションブロブ（`tx_blob`または`signedTransaction`）をネットワークに送信します。


### トランザクションの送信

オフライン署名レスポンスの`signedTransaction`値、または`sign`コマンドレスポンスの`tx_blob`値をとり、[submitメソッド][]を使用して`tx_blob`値として送信します。

#### リクエストのフォーマット

リクエストのフォーマットの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
   "command":"submit",
   "tx_blob":"1200032280000000240000000468400000000000000A73210330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD02074473045022100A50E867D3B1B5A39F23F1ABCA5C7C3EC755442FDAA357EFD897B865ACA7686DB02206077BF459BCE39BCCBFE1A128DA986D1E00CBEC5F0D6B0E11710F60BE2976FB88114623B8DA4A0BFB3B61AB423391A182DC693DC159E"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
  "method":"submit",
  "params":[
     {
        "tx_blob":"1200032280000000240000000468400000000000000A73210330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD02074473045022100A50E867D3B1B5A39F23F1ABCA5C7C3EC755442FDAA357EFD897B865ACA7686DB02206077BF459BCE39BCCBFE1A128DA986D1E00CBEC5F0D6B0E11710F60BE2976FB88114623B8DA4A0BFB3B61AB423391A182DC693DC159E"
     }
  ]
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
#Syntax: submit tx_blob
rippled submit 1200032280000000240000000468400000000000000A73210330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD02074473045022100A50E867D3B1B5A39F23F1ABCA5C7C3EC755442FDAA357EFD897B865ACA7686DB02206077BF459BCE39BCCBFE1A128DA986D1E00CBEC5F0D6B0E11710F60BE2976FB88114623B8DA4A0BFB3B61AB423391A182DC693DC159E
```
{% /tab %}

{% /tabs %}


#### レスポンスのフォーマット

処理が成功したレスポンスの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
 "result":{
   "engine_result":"tesSUCCESS",
   "engine_result_code":0,
   "engine_result_message":"The transaction was applied.Only final in a validated ledger.",
   "tx_blob":"1200032280000000240000000468400000000000000A73210330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD02074473045022100A50E867D3B1B5A39F23F1ABCA5C7C3EC755442FDAA357EFD897B865ACA7686DB02206077BF459BCE39BCCBFE1A128DA986D1E00CBEC5F0D6B0E11710F60BE2976FB88114623B8DA4A0BFB3B61AB423391A182DC693DC159E",
   "tx_json":{
     "Account":"rUAi7pipxGpYfPNg3LtPcf2ApiS8aw9A93",
     "Fee":"10",
     "Flags":2147483648,
     "Sequence":4,
     "SigningPubKey":"0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020",
     "TransactionType":"AccountSet",
     "TxnSignature":"3045022100A50E867D3B1B5A39F23F1ABCA5C7C3EC755442FDAA357EFD897B865ACA7686DB02206077BF459BCE39BCCBFE1A128DA986D1E00CBEC5F0D6B0E11710F60BE2976FB8",
     "hash":"D9B305CB6E861D0994A5CDD4726129D91AC4277111DC444DE4CEE44AD4674A9F"
   }
 },
 "status":"success",
 "type":"response"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
   "result":{
       "engine_result":"tesSUCCESS",
       "engine_result_code":0,
       "engine_result_message":"The transaction was applied.Only final in a validated ledger.",
       "status":"success",
       "tx_blob":"1200032280000000240000000468400000000000000A73210330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD02074473045022100A50E867D3B1B5A39F23F1ABCA5C7C3EC755442FDAA357EFD897B865ACA7686DB02206077BF459BCE39BCCBFE1A128DA986D1E00CBEC5F0D6B0E11710F60BE2976FB88114623B8DA4A0BFB3B61AB423391A182DC693DC159E",
       "tx_json":{
           "Account":"rUAi7pipxGpYfPNg3LtPcf2ApiS8aw9A93",
           "Fee":"10",
           "Flags":2147483648,
           "Sequence":4,
           "SigningPubKey":"0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020",
           "TransactionType":"AccountSet",
           "TxnSignature":"3045022100A50E867D3B1B5A39F23F1ABCA5C7C3EC755442FDAA357EFD897B865ACA7686DB02206077BF459BCE39BCCBFE1A128DA986D1E00CBEC5F0D6B0E11710F60BE2976FB8",
           "hash":"D9B305CB6E861D0994A5CDD4726129D91AC4277111DC444DE4CEE44AD4674A9F"
       }
   }
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```json
{
  "result" :{
     "engine_result" :"tesSUCCESS",
     "engine_result_code" :0,
     "engine_result_message" :"The transaction was applied.Only final in a validated ledger.",
     "status" :"success",
     "tx_blob" :"1200032280000000240000000468400000000000000A73210330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD02074473045022100A50E867D3B1B5A39F23F1ABCA5C7C3EC755442FDAA357EFD897B865ACA7686DB02206077BF459BCE39BCCBFE1A128DA986D1E00CBEC5F0D6B0E11710F60BE2976FB88114623B8DA4A0BFB3B61AB423391A182DC693DC159E",
     "tx_json" :{
        "Account" :"rUAi7pipxGpYfPNg3LtPcf2ApiS8aw9A93",
        "Fee" :"10",
        "Flags" :2147483648,
        "Sequence" :4,
        "SigningPubKey" :"0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020",
        "TransactionType" :"AccountSet",
        "TxnSignature" :"3045022100A50E867D3B1B5A39F23F1ABCA5C7C3EC755442FDAA357EFD897B865ACA7686DB02206077BF459BCE39BCCBFE1A128DA986D1E00CBEC5F0D6B0E11710F60BE2976FB8",
        "hash" :"D9B305CB6E861D0994A5CDD4726129D91AC4277111DC444DE4CEE44AD4674A9F"
     }
  }
}
```
{% /tab %}

{% /tabs %}


## 4. 次のステップ

これで、レギュラーキーペアをアカウントに割り当てるメリットについて理解しました。次に以下の関連トピックとチュートリアルを参照してください。

- [レギュラーキーペアの変更または削除](change-or-remove-a-regular-key-pair.md)
- [マルチシグの設定](set-up-multi-signing.md)
- [発行アドレスと運用アドレス](../../concepts/accounts/account-types.md)
- [取引所としてのXRPの上場](../../use-cases/defi/list-xrp-as-an-exchange.md)

{% raw-partial file="/_snippets/common-links.md" /%}
