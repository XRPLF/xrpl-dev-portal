# ledger_request
[[ソース]<br>](https://github.com/ripple/rippled/blob/e980e69eca9ea843d200773eb1f43abe3848f1a0/src/ripple/rpc/handlers/LedgerRequest.cpp "Source")

`ledger_request`コマンドは、サーバーに対し接続しているピアから特定のレジャーバージョンを取得するように指示します。これは、サーバーが直接接続しているピアの1つにそのレジャーが存在している場合にのみ機能します。場合によっては、レジャーを完全に取得するにはこのコマンドを繰り返し実行する必要があります。

*`ledger_request`要求は、権限のないユーザーは実行できない[管理メソッド](admin-rippled-methods.html)です。*

### 要求フォーマット
要求フォーマットの例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
   "id": 102,
   "command": "ledger_request",
   "ledger_index": 13800000
}
```

*コマンドライン*

```
rippled ledger_request 13800000
```

<!-- MULTICODE_BLOCK_END -->

要求には以下のパラメーターが含まれます。

| `Field`        | 型   | 説明                                        |
|:---------------|:-------|:---------------------------------------------------|
| `ledger_index` | 数値 | _（省略可）_[レジャーインデックス][]により指定されたレジャーを取得します。 |
| `ledger_hash`  | 文字列 | _（省略可）_ 識別用[ハッシュ][]により指定されたレジャーを取得します。 |

`ledger_index`または`ledger_hash`のいずれかを指定する必要がありますが、両方は指定しないでください。

### 応答フォーマット

応答は[標準フォーマット][]に従っています。ただし、_`rippled`サーバーに対してレジャーの取得開始を正常に指示できた場合でも_、指定されたレジャーがない場合には失敗を示す応答が要求から返されます。

**注記:** レジャーを取得するには、rippledサーバーのダイレクトピアの履歴にそのレジャーが含まれている必要があります。どのピアにも要求されたレジャーがない場合は、[connectメソッド][]または構成ファイルの`fixed_ips`セクションを使用して、`s2.ripple.com`にあるRippleのすべての履歴が記録されるサーバーを追加すれば、`ledger_request`要求を再度実行できます。

失敗した場合の応答には、レジャーの取得状況が示されます。成功した場合の応答には、[ledgerメソッド][]に類似したフォーマットでレジャーの情報が含まれます。

<!-- MULTICODE_BLOCK_START -->

*コマンドライン（失敗）*

```
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005
{
  "result" : {
     "acquiring" : {
        "hash" : "01DDD89B6605E20338B8EEB8EB2B0E0DD2F685A2B164F3790C4D634B5734CC26",
        "have_header" : false,
        "peers" : 2,
        "timeouts" : 0
     },
     "error" : "lgrNotFound",
     "error_code" : 20,
     "error_message" : "acquiring ledger containing requested index",
     "request" : {
        "command" : "ledger_request",
        "ledger_index" : 18851277
     },
     "status" : "error"
  }
}
```

*コマンドライン（進行中）*

```
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005
{
  "result" : {
     "hash" : "EB68B5B4F6F06BF59B6D7532BCB98BB98E2F10C2435D895217AA0AA7E910FBD5",
     "have_header" : true,
     "have_state" : false,
     "have_transactions" : false,
     "needed_state_hashes" : [
        "C46F7B9E795135447AF24BAF999AB8FC1612A997F6EAAF8B784C226FF0BD8E25",
        "E48F528E4FC2A1DC492C6264B27B420E2285B2A3ECF3A253DB480DA5BFB7F858",
        "B62CD0B2E1277F78BC279FA037F3F747587299B60D23A551C3F63DD137DC0CF8",
        "30014C55701FB8426E496A47B297BEC9E8F5BFA47763CC22DBD9024CC81D39DD",
        "7EB59A853913898FCEA7B701637F33B1054BD36C32A0B910B612EFB9CDFF6334",
        "07ECAD3066D62583883979A2FADAADC8F7D89FA07375843C8A47452639AB2421",
        "97A87E5246AF78463485CB27E08D561E22AAF33D5E2F08FE2FACAE0D05CB5478",
        "50A0525E238629B32324C9F59B4ECBEFE3C21DC726DB9AB3B6758BD1838DFF68",
        "8C541B1ED47C9282E2A28F0B7F3DDFADF06644CAB71B15A3E67D04C5FAFE9BF4",
        "2C6CC536C778D8C0F601E35DA7DD9888C288897E4F603E76357CE2F47E8A7A9F",
        "309E78DEC67D5725476A59E114850556CC693FB6D92092997ADE97E3EFF473CC",
        "8EFF61B6A636AF6B4314CAC0C08F4FED0759E1F782178A822EDE98275E5E4B10",
        "9535645E5D249AC0B6126005B79BB981CBA00286E00154D20A3BCF65743EA3CA",
        "69F5D6FCB41D1E6CEA5ADD42CBD194086B45E957D497DF7AEE62ADAD485660CE",
        "07E93A95DBB0B8A00925DE0DF6D27E41CACC77EF75055A89815006109D82EAD3",
        "7FDF25F660235DCAD649676E3E6729DF920A9B0B4B6A3B090A3C64D7BDE2FB20"
     ],
     "needed_transaction_hashes" : [
        "BA914854F2F5EDFCBD6E3E0B168E5D4CD0FC92927BEE408C6BD38D4F52505A34",
        "AE3A2DB537B01EB33BB3A677242DE52C9AE0A64BD9222EE55E52855276E7EA2A",
        "E145F737B255D93769673CBA6DEBA4F6AC7387A309DAACC72EA5B07ECF03C215",
        "073A118552AA60E1D3C6BE6F65E4AFA01C582D9C41CCC2887244C19D9BFA7741",
        "562DB8580CD3FE19AF5CEA61C2858C10091151B924DBF2AEB7CBB8722E683204",
        "437C0D1C2391057079E9539CF028823D29E6437A965284F6E54CEBF1D25C5D56",
        "1F069486AF5533883609E5C8DB907E97273D9A782DF26F5E5811F1C42ED63A3D",
        "CAA6B7DA68EBA71254C218C81A9EA029A179694BDD0D75A49FB03A7D57BCEE49"
     ],
     "peers" : 6,
     "status" : "success",
     "timeouts" : 1
  }
}
```

*コマンドライン（成功）*

```
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005
{
  "result" : {
     "ledger" : {
        "accepted" : true,
        "account_hash" : "84EBB27D9510AD5B9A3A328201921B3FD418D4A349E85D3DC69E33C7B506407F",
        "close_time" : 486691300,
        "close_time_human" : "2015-Jun-04 00:01:40",
        "close_time_resolution" : 10,
        "closed" : true,
        "hash" : "DCF5D723ECEE1EF56D2B0024CD9BDFF2D8E3DC211BD2B9460165922564ACD863",
        "ledger_hash" : "DCF5D723ECEE1EF56D2B0024CD9BDFF2D8E3DC211BD2B9460165922564ACD863",
        "ledger_index" : "13840000",
        "parent_hash" : "8A3F6FBC62C11DE4538D969F9C7966234635FE6CEB1133DDC37220978F8100A9",
        "seqNum" : "13840000",
        "totalCoins" : "99999022883526403",
        "total_coins" : "99999022883526403",
        "transaction_hash" : "3D759EF3AF1AE2F78716A8CCB2460C3030F82687E54206E883703372B9E1770C"
     },
     "ledger_index" : 13840000,
     "status" : "success"
  }
}

```

<!-- MULTICODE_BLOCK_END -->

3つの応答フォーマットは次のとおりです。

1. `lgrNotFound`エラーが返された場合、応答の`acquiring`フィールドには、ピアツーピアネットワークからのレジャー取得状況を示す[レジャー要求オブジェクト](#レジャー要求オブジェクト)が指定されています。
2. サーバーが現在データを取得中であると応答に示される場合、その結果の本文として、ピアツーピアネットワークからのレジャー取得状況を示す[レジャー要求オブジェクト](#レジャー要求オブジェクト)が表示されます。
3. レジャーが完全に利用可能な場合、応答には[レジャーヘッダー](ledger-header.html)が表示されます。

### レジャー要求オブジェクト

サーバーでレジャーの取得操作が進行中であり、まだ完了していない場合は、`rippled`サーバーはレジャー取得状況を示すレジャー要求オブジェクトを返します。このオブジェクトのフィールドを次に示します。

| `Field`                     | 型             | 説明                 |
|:----------------------------|:-----------------|:----------------------------|
| `hash`                      | 文字列           | （省略される場合があります）要求されるレジャーの[ハッシュ][]（サーバーがこのハッシュを認識している場合）。 |
| `have_header`               | ブール値          | 要求されたレジャーのヘッダーセクションがサーバーにあるかどうか。 |
| `have_state`                | ブール値          | （省略される場合があります）要求されたレジャーの[アカウント状態セクション](ledgers.html#ツリーの形式)がサーバーにあるかどうか。 |
| `have_transactions`         | ブール値          | （省略される場合があります）要求されたレジャーのトランザクションセクションがサーバーにあるかどうか。 |
| `needed_state_hashes`       | 文字列の配列 | （省略される場合があります）サーバーが取得する必要がある[状態ツリー](ledgers.html#ツリーの形式)内のオブジェクトのハッシュ（最大16個）。 |
| `needed_transaction_hashes` | 文字列の配列 | （省略される場合があります）サーバーが取得する必要があるトランザクションツリー内のオブジェクトのハッシュ（最大16個）。 |
| `peers`                     | 数値           | このレジャーを見つけるためにサーバーが照会するピアの数。 |
| `timeouts`                  | 数値           | これまでにこのレジャーの取得操作がタイムアウトした回数。 |

### 考えられるエラー

* [汎用エラータイプ][]のすべて。
* `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。このエラーは、指定したレジャーインデックスが現在進行中のレジャーのインデックス以上である場合にも発生します。
* `lgrNotFound` - レジャーがまだ利用可能ではない場合。これは、サーバーがレジャーの取得を開始していますが、要求されたレジャーが接続されたどのピアにもない場合には失敗する可能性があることを意味します。（以前はこのエラーにはコード`ledgerNotFound`が使用されていました。）[更新: rippled 0.30.1][新規: rippled 0.30.1]

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
