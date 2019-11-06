# submit
[[ソース]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/Submit.cpp "ソース")

`submit`メソッドは[トランザクション](transaction-formats.html)を適用し、トランザクションの確認と将来のレジャーへの記録が行われるように、ネットワークに送信します。

このコマンドには、以下の2つのモードがあります。

* 送信専用モードは、署名済みのシリアル化されたトランザクションをブロブとして取得し、そのままネットワークに送信します。署名済みのトランザクションオブジェクトは不変のものであるため、送信後は、どの部分も修正したり、自動的に内容を入力したりすることはできません。
* 署名と送信モードでは、JSONフォーマットのトランザクションオブジェクトを取得し、[signメソッド][]と同じ方法でトランザクションを完成させて署名し、署名済みのトランザクションを送信します。テストと開発に関しては、このモードのみ使用することをお勧めします。

トランザクションを可能な限り確実に送信するには、トランザクションを事前に生成して[sign][sign method]メソッドで署名し、停電発生後もアクセスできるいずれかの場所に保存した後、`tx_blob`として`submit`メソッドで送信します。送信後は、ネットワークを[txメソッド][]コマンドで監視して、トランザクションが正常に適用されたかどうかを確認します。再起動やその他の問題が発生した場合ても、`tx_blob`のトランザクションを問題なく再送信できます。シーケンス番号が以前のトランザクションと同一であるため、トランザクションが2回適用されることはありません。

## 送信専用モード

送信専用の要求では、以下のパラメーターを指定します。

| `Field`     | 型    | 説明                                          |
|:------------|:--------|:-----------------------------------------------------|
| `tx_blob`   | 文字列  | 送信する署名済みトランザクションの16進表現。[マルチ署名済みトランザクション](multi-signing.html)を送信することもできます。 |
| `fail_hard` | ブール値 | （省略可。デフォルトはfalse）trueにした場合は、トランザクションがローカルで失敗したときに再試行されず、他のサーバーにも中継されません。 |

### 要求フォーマット

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
    "id": 3,
    "command": "submit",
    "tx_blob": "1200002280000000240000001E61D4838D7EA4C6800000000000000000000000000055534400000000004B4E9C06F24296074F7BC48F92A97916C6DC5EA968400000000000000B732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB7447304502210095D23D8AF107DF50651F266259CC7139D0CD0C64ABBA3A958156352A0D95A21E02207FCF9B77D7510380E49FF250C21B57169E14E9B4ACFD314CEDC79DDD0A38B8A681144B4E9C06F24296074F7BC48F92A97916C6DC5EA983143E9D4A2B8AA0780F682D136F7A56D6724EF53754"
}
```

*JSON-RPC*

```
{
    "method": "submit",
    "params": [
        {
            "tx_blob": "1200002280000000240000000361D4838D7EA4C6800000000000000000000000000055534400000000004B4E9C06F24296074F7BC48F92A97916C6DC5EA968400000000000000A732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB74473045022100D184EB4AE5956FF600E7536EE459345C7BBCF097A84CC61A93B9AF7197EDB98702201CEA8009B7BEEBAA2AACC0359B41C427C1C5B550A4CA4B80CF2174AF2D6D5DCE81144B4E9C06F24296074F7BC48F92A97916C6DC5EA983143E9D4A2B8AA0780F682D136F7A56D6724EF53754"
        }
    ]
}
```

*コマンドライン*

```
#Syntax: submit tx_blob
submit 1200002280000000240000000361D4838D7EA4C6800000000000000000000000000055534400000000004B4E9C06F24296074F7BC48F92A97916C6DC5EA968400000000000000A732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB74473045022100D184EB4AE5956FF600E7536EE459345C7BBCF097A84CC61A93B9AF7197EDB98702201CEA8009B7BEEBAA2AACC0359B41C427C1C5B550A4CA4B80CF2174AF2D6D5DCE81144B4E9C06F24296074F7BC48F92A97916C6DC5EA983143E9D4A2B8AA0780F682D136F7A56D6724EF53754
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](websocket-api-tool.html#submit)


## 署名と送信モード

このモードでは、トランザクションに署名してただちに送信します。このモードは、テストで使用することを目的としています。[マルチ署名済みトランザクション](multi-signing.html)には使用できません。

 _デフォルトでは、署名と送信モードは[管理者専用](admin-rippled-methods.html)です。_ サーバーで[パブリック署名が有効になっている](enable-public-signing.html)場合は、パブリックメソッドとして使用できます。

トランザクションの署名に使用するシークレットキーは、以下の方法で提供できます。

* `secret`値を指定し、`key_type`フィールドを省略します。この値は、XRP Ledgerの[base58][]シード、RFC-1751、16進値のフォーマットで記述するか、文字列パスフレーズとして記述します（secp256k1キーのみ）。
* `key_type`値と、`seed`、`seed_hex`、または`passphrase`のいずれか1つを提供します。`secret`フィールドは省略します（コマンドライン構文ではサポートされません）。

要求には以下のパラメーターが含まれます。

| `Field`        | 型    | 説明                                       |
|:---------------|:--------|:--------------------------------------------------|
| `tx_json`      | オブジェクト  | JSONフォーマットの[トランザクション定義](transaction-formats.html)。自動入力可能なフィールドについては、省略することも可能です。 |
| `secret`       | 文字列  |  _（省略可）_ トランザクションを提供するアカウントのシークレットキー。トランザクションへの署名に使用されます。信頼できないサーバーに対して、またはセキュリティが確保されていないネットワーク接続を通じて機密情報を送信しないでください。`key_type`、`seed`、`seed_hex`、`passphrase`と同時に使用することはできません。 |
| `seed`         | 文字列  |  _（省略可）_ トランザクションを提供するアカウントのシークレットキー。トランザクションへの署名に使用されます。XRP Ledgerの[base58][]フォーマットにする必要があります。指定する場合は、`key_type`も指定する必要があります。`secret`、`seed_hex`、`passphrase`と同時に使用することはできません。 |
| `seed_hex`     | 文字列  |  _（省略可）_ トランザクションを提供するアカウントのシークレットキー。トランザクションへの署名に使用されます。16進フォーマットにする必要があります。指定する場合は、`key_type`も指定する必要があります。`secret`、`seed`、`passphrase`と同時に使用することはできません。 |
| `passphrase`   | 文字列  |  _（省略可）_ トランザクションを提供するアカウントのシークレットキー。文字列パスフレーズとして、トランザクションへの署名に使用されます。指定する場合は、`key_type`も指定する必要があります。`secret`、`seed`、`seed_hex`と同時に使用することはできません。 |
| `key_type`     | 文字列  |  _（省略可）_ この要求で提供する暗号鍵の種類。有効な種類は、`secp256k1`または`ed25519`です。デフォルトは`secp256k1`です。`secret`と同時に使用することはできません。**注意:** Ed25519のサポートは実験的な機能です。 |
| `fail_hard`    | ブール値 | （省略可。デフォルトはfalse）trueにした場合は、トランザクションがローカルで失敗したときに再試行されず、他のサーバーにも中継されません。 |
| `offline`      | ブール値 | （省略可。デフォルトはfalse）trueにする場合は、トランザクションの生成時に、値を自動で入力または検証しようとしないでください。 |
| `build_path`   | ブール値 |  _（省略可）_ Payment型のトランザクションに対して指定した場合、署名前に`Paths`フィールドが自動で入力されます。トランザクションがXRP間の直接移動である場合は、このフィールドを省略してください。**注意:** サーバーは、このフィールドの値ではなく、このフィールドが存在するかどうかを調べます。この動作は変更される可能性があります。 |
| `fee_mult_max` | 整数 | （省略可。デフォルトは10、推奨値は1000）`Fee`パラメーターを省略する場合は、自動的に提供される`Fee`値が長期の基本トランザクションコストとこの値の積以下になるよう、このフィールドで制限します。 |
| `fee_div_max`  | 整数 | （省略可。デフォルトは1）`fee_mult_max`と併用して、制限に使用される分数の乗数を作成します。具体的には、サーバーは基本[トランザクションコスト](transaction-cost.html)を`fee_mult_max`で乗算した後、この値で除算して上限値（整数値に丸められます）を割り出します。自動的に提供される`Fee`値が上限値を超えている場合、submitコマンドは失敗します。[新規: rippled 0.30.1][] |

サーバーによって特定のフィールドにどのように値が自動入力されるかについては、[signメソッド][]を参照してください。

### 要求フォーマット
要求フォーマットの例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
  "id": 2,
  "command": "submit",
  "tx_json" : {
      "TransactionType" : "Payment",
      "Account" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "Destination" : "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
      "Amount" : {
         "currency" : "USD",
         "value" : "1",
         "issuer" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
      }
   },
   "secret" : "s████████████████████████████",
   "offline": false,
   "fee_mult_max": 1000
}
```

*JSON-RPC*

```
{
    "method": "submit",
    "params": [
        {
            "offline": false,
            "secret": "s████████████████████████████",
            "tx_json": {
                "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                "Amount": {
                    "currency": "USD",
                    "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                    "value": "1"
                },
                "Destination": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
                "TransactionType": "Payment"
            },
            "fee_mult_max": 1000
        }
    ]
}
```

*コマンドライン*

```
#Syntax: submit secret json [offline]
rippled submit s████████████████████████████ '{"Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn", "Amount": { "currency": "USD", "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn", "value": "1" }, "Destination": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX", "TransactionType": "Payment", "Fee": "10000"}'
```

<!-- MULTICODE_BLOCK_END -->

[試してみる>](websocket-api-tool.html#submit)

## 応答フォーマット

処理が成功した応答の例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
  "id": 1,
  "status": "success",
  "type": "response",
  "result": {
    "engine_result": "tesSUCCESS",
    "engine_result_code": 0,
    "engine_result_message": "The transaction was applied.Only final in a validated ledger.",
    "tx_blob": "1200002280000000240000016861D4838D7EA4C6800000000000000000000000000055534400000000004B4E9C06F24296074F7BC48F92A97916C6DC5EA9684000000000002710732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB7446304402200E5C2DD81FDF0BE9AB2A8D797885ED49E804DBF28E806604D878756410CA98B102203349581946B0DDA06B36B35DBC20EDA27552C1F167BCF5C6ECFF49C6A46F858081144B4E9C06F24296074F7BC48F92A97916C6DC5EA983143E9D4A2B8AA0780F682D136F7A56D6724EF53754",
    "tx_json": {
      "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "Amount": {
        "currency": "USD",
        "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
        "value": "1"
      },
      "Destination": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
      "Fee": "10000",
      "Flags": 2147483648,
      "Sequence": 360,
      "SigningPubKey": "03AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB",
      "TransactionType": "Payment",
      "TxnSignature": "304402200E5C2DD81FDF0BE9AB2A8D797885ED49E804DBF28E806604D878756410CA98B102203349581946B0DDA06B36B35DBC20EDA27552C1F167BCF5C6ECFF49C6A46F8580",
      "hash": "4D5D90890F8D49519E4151938601EF3D0B30B16CD6A519D9C99102C9FA77F7E0"
    }
  }
}
```

*JSON-RPC*

```
{
    "result": {
        "engine_result": "tesSUCCESS",
        "engine_result_code": 0,
        "engine_result_message": "The transaction was applied.Only final in a validated ledger.",
        "status": "success",
        "tx_blob": "1200002280000000240000016961D4838D7EA4C6800000000000000000000000000055534400000000004B4E9C06F24296074F7BC48F92A97916C6DC5EA9684000000000002710732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB74473045022100A7CCD11455E47547FF617D5BFC15D120D9053DFD0536B044F10CA3631CD609E502203B61DEE4AC027C5743A1B56AF568D1E2B8E79BB9E9E14744AC87F38375C3C2F181144B4E9C06F24296074F7BC48F92A97916C6DC5EA983143E9D4A2B8AA0780F682D136F7A56D6724EF53754",
        "tx_json": {
            "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
            "Amount": {
                "currency": "USD",
                "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                "value": "1"
            },
            "Destination": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
            "Fee": "10000",
            "Flags": 2147483648,
            "Sequence": 361,
            "SigningPubKey": "03AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB",
            "TransactionType": "Payment",
            "TxnSignature": "3045022100A7CCD11455E47547FF617D5BFC15D120D9053DFD0536B044F10CA3631CD609E502203B61DEE4AC027C5743A1B56AF568D1E2B8E79BB9E9E14744AC87F38375C3C2F1",
            "hash": "5B31A7518DC304D5327B4887CD1F7DC2C38D5F684170097020C7C9758B973847"
        }
    }
}
```

*コマンドライン*

```
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005
{
   "result" : {
      "engine_result" : "tesSUCCESS",
      "engine_result_code" : 0,
      "engine_result_message" : "The transaction was applied.Only final in a validated ledger.",
      "status" : "success",
      "tx_blob" : "1200002280000000240000016A61D4838D7EA4C6800000000000000000000000000055534400000000004B4E9C06F24296074F7BC48F92A97916C6DC5EA9684000000000002710732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB74473045022100FBBF74057359EC31C3647AD3B33D8954730E9879C35034374858A76B7CFA643102200EAA08C61071396E9CF0987FBEA16CF113CBD8068AA221214D165F151285EECD81144B4E9C06F24296074F7BC48F92A97916C6DC5EA983143E9D4A2B8AA0780F682D136F7A56D6724EF53754",
      "tx_json" : {
         "Account" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
         "Amount" : {
            "currency" : "USD",
            "issuer" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
            "value" : "1"
         },
         "Destination" : "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
         "Fee" : "10000",
         "Flags" : 2147483648,
         "Sequence" : 362,
         "SigningPubKey" : "03AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB",
         "TransactionType" : "Payment",
         "TxnSignature" : "3045022100FBBF74057359EC31C3647AD3B33D8954730E9879C35034374858A76B7CFA643102200EAA08C61071396E9CF0987FBEA16CF113CBD8068AA221214D165F151285EECD",
         "hash" : "CB98A6FA1FAC47F9FCC6A233EB46F8F9AF59CC69BD69AE6D06F298F6FF52162A"
      }
   }
}
```

<!-- MULTICODE_BLOCK_END -->

この応答は[標準フォーマット][]に従っており、結果が正しい場合、以下のフィールドが含まれます。

| `Field`                 | 型    | 説明                              |
|:------------------------|:--------|:-----------------------------------------|
| `engine_result`         | 文字列  | トランザクションの暫定的な結果を示すコード。例: `tesSUCCESS` |
| `engine_result_code`    | 整数 | トランザクションの暫定的な結果を示し、`engine_result`と直接の相関関係にある数値コード |
| `engine_result_message` | 文字列  | 人間が読める形式の、トランザクションの暫定的な結果の説明 |
| `tx_blob`               | 文字列  | トランザクション全体の16進文字列表現 |
| `tx_json`               | オブジェクト  | トランザクション全体のJSON表現  |

**注意:** WebSocketの応答に`"status":"success"`が含まれていても、これはコマンドが正常に受け付けられたことを示すものであり、トランザクションが正常に実行されたことを示しているわけでは _ありません_ 。トランザクションは、さまざまな状況で正常に処理されない可能性があります。例えば、ペイメントの2つのアカウントを接続するトラストラインの欠落や、トランザクション生成後のレジャーの状態の変化などです。問題が特にない場合も、トランザクションが含まれているバージョンのレジャーを閉鎖し検証するまでに数秒かかることがあります。詳細は、[トランザクションの応答の完全なリスト](transaction-results.html)を参照してください。トランザクションの結果は、検証済みバージョンのレジャーにトランザクションが表示されるまで、最終的なものと考えないでください。

**注意:** このコマンドの結果としてエラーメッセージが表示された場合、要求から取得されたシークレットキーがメッセージの中に記述されている可能性があります。（要求に含まれているものが署名済みのtx_blobである場合は問題ありません）。これらのエラーが他者から見えない状態であることを確認してください。

* シークレットキーが記述されているエラーは、複数の人物が参照できるログファイルに書き込まないでください。
* シークレットキーが記述されているエラーは、誰でも参照できる場所にデバッグを目的として貼り付けないでください。
* シークレットキーが記述されているエラーメッセージは、誤ってWebサイトに表示しないようにしてください。


## 考えられるエラー

* いずれかの[汎用エラータイプ][]。
* `amendmentBlocked` - `rippled`サーバーでの[修正がブロックされている](amendments.html#amendment-blocked)ため、トランザクションをネットワークに送信できません。
* `highFee` - `fee_mult_max`パラメーターが指定されましたが、サーバーの現在の手数料の乗数が指定値を超えています（署名と送信モードのみ）。
* `internalJson` - トランザクションをJSONへとシリアル化するときに、内部エラーが発生しました。このエラーは、無効な署名や一部フィールドの形式の誤りなど、トランザクションのさまざまな側面が原因となって発生する可能性があります。
* `internalSubmit` - トランザクションを送信するときに内部エラーが発生しました。このエラーは、無効な署名や一部フィールドの形式の誤りなど、トランザクションのさまざまな側面が原因となって発生する可能性があります。
* `internalTransaction` - トランザクションを処理するときに内部エラーが発生しました。このエラーは、無効な署名や一部フィールドの形式の誤りなど、トランザクションのさまざまな側面が原因となって発生する可能性があります。
* `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。
* `invalidTransaction` - トランザクションの形式が誤っているか、その他の理由で無効なものになっています。
* `noPath` - トランザクションにパスが含まれておらず、サーバーは、このペイメントの発生経路となるパスを検出できませんでした。（署名と送信モードのみ）。
* `tooBusy` - トランザクションにパスが含まれていませんが、サーバーがビジーであるため、パス検出処理をすぐに実行できません。管理者として接続している場合は発生しません。（署名と送信モードのみ）。


{% include '_snippets/rippled_versions.md' %}
{% include '_snippets/rippled-api-links.md' %}
