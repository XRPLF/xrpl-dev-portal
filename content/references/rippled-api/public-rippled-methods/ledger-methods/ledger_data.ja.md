# ledger_data
[[ソース]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/LedgerData.cpp "Source")

`ledger_data`メソッドは指定されたレジャーの内容を取得します。1つのレジャーバージョンの内容全体を取得するため、複数のコールを繰り返し実行できます。

## 要求フォーマット
要求フォーマットの例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
  "id":2,
  "ledger_hash":"842B57C1CC0613299A686D3E9F310EC0422C84D3911E5056389AA7E5808A93C8",
  "command":"ledger_data",
  "limit":5,
  "binary": true
}
```

*JSON-RPC*

```
{
   "method":"ledger_data",
   "params":[
       {
           "binary": true,
           "ledger_hash":"842B57C1CC0613299A686D3E9F310EC0422C84D3911E5056389AA7E5808A93C8",
           "limit":5
       }
   ]
}
```

<!-- MULTICODE_BLOCK_END -->

**注記:**`ledger_data`のコマンドライン構文はありません。代わりに[jsonメソッド][]を使用してコマンドラインからこのメソッドにアクセスできます。

要求には以下のフィールドが含まれます。

| `Field`        | 型                                       | 説明    |
|:---------------|:-------------------------------------------|:---------------|
| `id`           | （任意）                                | （WebSocketのみ）応答が遅延して順不同になる場合にこの要求を他の要求と区別するためのID。 |
| `ledger_hash`  | 文字列                                     | _（省略可）_ 使用するレジャーバージョンの20バイトの16進文字列。（[レジャーの指定][]を参照してください） |
| `ledger_index` | 文字列または符号なし整数                 | _（省略可）_ 使用するレジャーのシーケンス番号、またはレジャーを自動的に選択するためのショートカット文字列。（[レジャーの指定][]を参照してください） |
| `binary`       | ブール値                                    | （省略可、デフォルトではfalseです）trueに設定すると、レジャーオブジェクトがJSONではなくハッシュされた16進文字列として返されます。 |
| `limit`        | 整数                                    | （省略可、デフォルト値は可変）取得するレジャーオブジェクトの数を制限します。サーバーはこの値に従う必要はありません。 |
| `marker`       | [マーカー][] | 以前にページネーションされた応答の値。その応答を停止した箇所からデータの取得を再開します。 |

`ledger`フィールドは廃止予定であり、今後予告なしに削除される可能性があります。

## 応答フォーマット

処理が成功した応答の例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket (binary:true)*

```
{
   "id":2,
   "result":{
       "ledger_hash":"842B57C1CC0613299A686D3E9F310EC0422C84D3911E5056389AA7E5808A93C8",
       "ledger_index":"6885842",
       "marker":"0002A590029B53BE7857EFF9985F770EC792CE483720EB5E963C4D6A607D43DF",
       "state":[
           {
               "data":"11006122000000002400000001250062FEA42D0000000055C204A65CF2542946289A3358C67D991B5E135FABFA89F271DBA7A150C08CA0466240000000354540208114C909F42250CFE8F12A7A1A0DFBD3CBD20F32CD79",
               "index":"00001A2969BE1FC85F1D7A55282FA2E6D95C71D2E4B9C0FDD3D9994F3C00FF8F"
           },
           {
               "data":"11006F22000000002400000003250035788533000000000000000034000000000000000055555B93628BF3EC318892BB7C7CDCB6732FF53D12B6EEC4FAF60DD1AEE1C6101F501071633D7DE1B6AEB32F87F1A73258B13FC8CC32942D53A66D4F038D7EA4C6800064D4838D7EA4C68000000000000000000000000000425443000000000035DD7DF146893456296BF4061FBE68735D28F3286540000000000F42408114A4B8F5F7B644AEDC3447F9459C132EEB016A133B",
               "index":"000037C6659BB98F8D09F2F4CFEB27DE8EFEAFE54DD9E1C13AECDF5794B0C0F5"
           },
           {
               "data":"11006F2200020000240000000A250067395C33000000000000000034000000000000000055A160BC41A45B6BB118DF23D77E4FF23C723431B917F50DCB41319ECC2821F34C5010DFA3B6DDAB58C7E8E5D944E736DA4B7046C30E4F460FD9DE4C1AA535D3D0C00064D554C88B43EFA00000000000000000000000000055534400000000000A20B3C85F482532A9578DBB3950B85CA06594D165400000B59B9F780081148366FB9ACD2A0FD822E31112D2EB6F98C317C2C1",
               "index":"0000A8791F78CC9B39200E12A9BDAACCF40A72A512FA815525CFC9BA772990F7"
           },
           {
               "data":"1100612200000000240000000125003E742F2D0000000055286498B513710CFEB2D723A554C7557983D1952DF4DEE342C40DCB43067C9A21624000000306DC42008114225BAB89C4A4B94624BB069D6DB3C819F934991C",
               "index":"0000B717320558E2DE1A3B9FDB24E9A695BF05D1A44E4A4683212BB1DD0FBA23"
           },
           {
               "data":"110072220002000025000B65783700000000000000003800000000000000005587591A63051645F37B85D1FBA55EE69B1C96BFF16904F5C99F03FB93D42D03756280000000000000000000000000000000000000004254430000000000000000000000000000000000000000000000000166800000000000000000000000000000000000000042544300000000000A20B3C85F482532A9578DBB3950B85CA06594D167D4C38D7EA4C680000000000000000000000000004254430000000000C795FDF8A637BCAAEDAD1C434033506236C82A2D",
               "index":"000103996A3BAD918657F86E12A67D693E8FC8A814DA4B958A244B5F14D93E58"
           }
       ]
   },
   "status":"success",
   "type":"response"
}
```

*WebSocket (binary:false)*

```
{
   "id":2,
   "result":{
       "ledger_hash":"842B57C1CC0613299A686D3E9F310EC0422C84D3911E5056389AA7E5808A93C8",
       "ledger_index":"6885842",
       "marker":"0002A590029B53BE7857EFF9985F770EC792CE483720EB5E963C4D6A607D43DF",
       "state":[
           {
               "Account":"rKKzk9ghA2iuy3imqMXUHJqdRPMtNDGf4c",
               "Balance":"893730848",
               "Flags":0,
               "LedgerEntryType":"AccountRoot",
               "OwnerCount":0,
               "PreviousTxnID":"C204A65CF2542946289A3358C67D991B5E135FABFA89F271DBA7A150C08CA046",
               "PreviousTxnLgrSeq":6487716,
               "Sequence":1,
               "index":"00001A2969BE1FC85F1D7A55282FA2E6D95C71D2E4B9C0FDD3D9994F3C00FF8F"
           },
           {
               "Account":"rGryPmNWFognBgMtr9k4quqPbbEcCrhNmD",
               "BookDirectory":"71633D7DE1B6AEB32F87F1A73258B13FC8CC32942D53A66D4F038D7EA4C68000",
               "BookNode":"0000000000000000",
               "Flags":0,
               "LedgerEntryType":"Offer",
               "OwnerNode":"0000000000000000",
               "PreviousTxnID":"555B93628BF3EC318892BB7C7CDCB6732FF53D12B6EEC4FAF60DD1AEE1C6101F",
               "PreviousTxnLgrSeq":3504261,
               "Sequence":3,
               "TakerGets":"1000000",
               "TakerPays":{
                   "currency":"BTC",
                   "issuer":"rnuF96W4SZoCJmbHYBFoJZpR8eCaxNvekK",
                   "value":"1"
               },
               "index":"000037C6659BB98F8D09F2F4CFEB27DE8EFEAFE54DD9E1C13AECDF5794B0C0F5"
           },
           {
               "Account":"rUy8tW38MW9ma7kSjRgB2GHtTkQAFRyrN8",
               "BookDirectory":"DFA3B6DDAB58C7E8E5D944E736DA4B7046C30E4F460FD9DE4C1AA535D3D0C000",
               "BookNode":"0000000000000000",
               "Flags":131072,
               "LedgerEntryType":"Offer",
               "OwnerNode":"0000000000000000",
               "PreviousTxnID":"A160BC41A45B6BB118DF23D77E4FF23C723431B917F50DCB41319ECC2821F34C",
               "PreviousTxnLgrSeq":6764892,
               "Sequence":10,
               "TakerGets":"780000000000",
               "TakerPays":{
                   "currency":"USD",
                   "issuer":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                   "value":"5850"
               },
               "index":"0000A8791F78CC9B39200E12A9BDAACCF40A72A512FA815525CFC9BA772990F7"
           },
           {
               "Account":"rh3C81VfNDhhWPQWCU8ZGgknvdgNUvRtM9",
               "Balance":"13000000000",
               "Flags":0,
               "LedgerEntryType":"AccountRoot",
               "OwnerCount":0,
               "PreviousTxnID":"286498B513710CFEB2D723A554C7557983D1952DF4DEE342C40DCB43067C9A21",
               "PreviousTxnLgrSeq":4092975,
               "Sequence":1,
               "index":"0000B717320558E2DE1A3B9FDB24E9A695BF05D1A44E4A4683212BB1DD0FBA23"
           },
           {
               "Balance":{
                   "currency":"BTC",
                   "issuer":"rrrrrrrrrrrrrrrrrrrrBZbvji",
                   "value":"0"
               },
               "Flags":131072,
               "HighLimit":{
                   "currency":"BTC",
                   "issuer":"rKUK9omZqVEnraCipKNFb5q4tuNTeqEDZS",
                   "value":"10"
               },
               "HighNode":"0000000000000000",
               "LedgerEntryType":"RippleState",
               "LowLimit":{
                   "currency":"BTC",
                   "issuer":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
                   "value":"0"
               },
               "LowNode":"0000000000000000",
               "PreviousTxnID":"87591A63051645F37B85D1FBA55EE69B1C96BFF16904F5C99F03FB93D42D0375",
               "PreviousTxnLgrSeq":746872,
               "index":"000103996A3BAD918657F86E12A67D693E8FC8A814DA4B958A244B5F14D93E58"
           }
       ]
   },
   "status":"success",
   "type":"response"
}
```

*JSON-RPC (binary:true)*

```
200 OK
{
   "result":{
       "ledger_hash":"842B57C1CC0613299A686D3E9F310EC0422C84D3911E5056389AA7E5808A93C8",
       "ledger_index":"6885842",
       "marker":"0002A590029B53BE7857EFF9985F770EC792CE483720EB5E963C4D6A607D43DF",
       "state":[
           {
               "data":"11006122000000002400000001250062FEA42D0000000055C204A65CF2542946289A3358C67D991B5E135FABFA89F271DBA7A150C08CA0466240000000354540208114C909F42250CFE8F12A7A1A0DFBD3CBD20F32CD79",
               "index":"00001A2969BE1FC85F1D7A55282FA2E6D95C71D2E4B9C0FDD3D9994F3C00FF8F"
           },
           {
               "data":"11006F22000000002400000003250035788533000000000000000034000000000000000055555B93628BF3EC318892BB7C7CDCB6732FF53D12B6EEC4FAF60DD1AEE1C6101F501071633D7DE1B6AEB32F87F1A73258B13FC8CC32942D53A66D4F038D7EA4C6800064D4838D7EA4C68000000000000000000000000000425443000000000035DD7DF146893456296BF4061FBE68735D28F3286540000000000F42408114A4B8F5F7B644AEDC3447F9459C132EEB016A133B",
               "index":"000037C6659BB98F8D09F2F4CFEB27DE8EFEAFE54DD9E1C13AECDF5794B0C0F5"
           },
           {
               "data":"11006F2200020000240000000A250067395C33000000000000000034000000000000000055A160BC41A45B6BB118DF23D77E4FF23C723431B917F50DCB41319ECC2821F34C5010DFA3B6DDAB58C7E8E5D944E736DA4B7046C30E4F460FD9DE4C1AA535D3D0C00064D554C88B43EFA00000000000000000000000000055534400000000000A20B3C85F482532A9578DBB3950B85CA06594D165400000B59B9F780081148366FB9ACD2A0FD822E31112D2EB6F98C317C2C1",
               "index":"0000A8791F78CC9B39200E12A9BDAACCF40A72A512FA815525CFC9BA772990F7"
           },
           {
               "data":"1100612200000000240000000125003E742F2D0000000055286498B513710CFEB2D723A554C7557983D1952DF4DEE342C40DCB43067C9A21624000000306DC42008114225BAB89C4A4B94624BB069D6DB3C819F934991C",
               "index":"0000B717320558E2DE1A3B9FDB24E9A695BF05D1A44E4A4683212BB1DD0FBA23"
           },
           {
               "data":"110072220002000025000B65783700000000000000003800000000000000005587591A63051645F37B85D1FBA55EE69B1C96BFF16904F5C99F03FB93D42D03756280000000000000000000000000000000000000004254430000000000000000000000000000000000000000000000000166800000000000000000000000000000000000000042544300000000000A20B3C85F482532A9578DBB3950B85CA06594D167D4C38D7EA4C680000000000000000000000000004254430000000000C795FDF8A637BCAAEDAD1C434033506236C82A2D",
               "index":"000103996A3BAD918657F86E12A67D693E8FC8A814DA4B958A244B5F14D93E58"
           }
       ],
       "status":"success"
   }
}
```

<!-- MULTICODE_BLOCK_END -->

この応答は[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれます。

| `Field`        | 型                                       | 説明    |
|:---------------|:-------------------------------------------|:---------------|
| `ledger_index` | 符号なし整数                           | このレジャーのシーケンス番号 |
| `ledger_hash`  | 文字列                                     | レジャー全体の一意の識別用ハッシュ。 |
| `state`        | 配列                                      | ツリーのデータが含まれているJSONオブジェクトの配列。以下のように定義されています。 |
| `marker`       | [マーカー][] | 応答がページネーションされていることを示す、サーバーが定義した値。この値を次のコールに渡して、このコールで終わった箇所から再開します。 |

`state`配列の各オブジェクトのフォーマットは、要求で`binary`がtrueに設定されているかどうかによって異なります。各`state`オブジェクトには以下のフィールドが含まれます。

| `Field`             | 型      | 説明                                |
|:--------------------|:----------|:-------------------------------------------|
| `data`              | 文字列    | （`"binary":true`の場合にのみ含まれる）要求されたデータの16進表現。 |
| `LedgerEntryType`   | 文字列    | （`"binary":false`の場合にのみ含まれる）このオブジェクトが表すレジャーオブジェクトの型を示す文字列。詳細なリストについては[レジャーデータフォーマット](ledger-data-formats.html)を参照してください。 |
| （追加のフィールド） | （各種） | （`"binary":false`の場合にのみ含まれる）このオブジェクトを記述する追加フィールド。オブジェクトのLedgerEntryTypeに応じて異なります。 |
| `index`             | 文字列    | このレジャーエントリの一意のID（16進数） |

## 考えられるエラー

* [汎用エラータイプ][]のすべて。
* `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。
* `lgrNotFound` - `ledger_hash`または`ledger_index`で指定したレジャーが存在しないか、存在してはいるもののサーバーが保有していません。


{% include '_snippets/rippled_versions.md' %}
{% include '_snippets/rippled-api-links.md' %}
