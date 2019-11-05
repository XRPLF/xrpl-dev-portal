# ledger
[[ソース]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/LedgerHandler.cpp "Source")

公開レジャーに関する情報を取得します。

## 要求フォーマット
要求フォーマットの例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
   "id":14,
   "command":"ledger",
   "ledger_index":"validated",
   "full": false,
   "accounts": false,
   "transactions": false,
   "expand": false,
   "owner_funds": false
}
```

*JSON-RPC*

```
{
   "method":"ledger",
   "params":[
       {
           "ledger_index":"validated",
           "accounts": false,
           "full": false,
           "transactions": false,
           "expand": false,
           "owner_funds": false
       }
   ]
}
```

*コマンドライン*

```
#Syntax: ledger ledger_index|ledger_hash [full|tx]
# "full" is equivalent to "full": true
# "tx" is equivalent to "transactions": true
rippled ledger current
```

<!-- MULTICODE_BLOCK_END -->

[試してみる >](websocket-api-tool.html#ledger)

要求には以下のパラメーターを含めることができます。

| `Field`        | 型                       | 説明                    |
|:---------------|:---------------------------|:-------------------------------|
| `ledger_hash`  | 文字列                     | _（省略可）_ 使用するレジャーバージョンの20バイトの16進文字列。（[レジャーの指定][]を参照してください） |
| `ledger_index` | 文字列または符号なし整数 | _（省略可）_ 使用するレジャーのシーケンス番号、またはレジャーを自動的に選択するためのショートカット文字列。（[レジャーの指定][]を参照してください） |
| `full`         | ブール値                    | _（省略可）_ **管理者が必要。** `true`の場合、レジャー全体に関するすべての情報が返されます。レジャーバージョンを指定しない場合は無視されます。デフォルトでは`false`です。（これは`transactions`、`accounts`、および`expand`を有効にする操作と同等です。） **注意:** 数百メガバイトのオーダーについて、非常に大量のデータが返されます。 |
| `accounts`     | ブール値                    | _（省略可）_ **管理者が必要。** `true`の場合、レジャーのアカウントに関する情報が返されます。レジャーバージョンを指定しない場合は無視されます。デフォルトでは`false`です。**注意:** 非常に大量のデータが返されます。 |
| `transactions` | ブール値                    | _（省略可）_ `true`の場合、指定されたレジャーバージョンのトランザクションに関する情報が返されます。デフォルトでは`false`です。レジャーバージョンを指定しない場合は無視されます。 |
| `expand`       | ブール値                    | _（省略可）_ ハッシュのみではなく、トランザクション/アカウントの完全な情報がJSONフォーマットで提供されます。デフォルトでは`false`です。トランザクション、アカウント、またはその両方を要求しない場合は無視されます。 |
| `owner_funds`  | ブール値                    | _（省略可）_ `true`の場合、応答のOfferCreateトランザクションのメタデータに`owner_funds`フィールドが含まれます。デフォルトでは`false`です。トランザクションが含まれておらず、`expand`がtrueではない場合には無視されます。 |
| `binary`       | ブール値                    | _（省略可）_ `true`で、かつ`transactions`と`expand`が両方とも`true`の場合、JSONフォーマットではなくバイナリフォーマット（16進文字列）でトランザクション情報が返されます。[新規: rippled 0.28.0][] |
| `queue`        | ブール値                    | _（省略可）_ `true`で、かつコマンドが`current`レジャーを要求している場合、[キューに入れらているトランザクション](transaction-cost.html#キューに入れられたトランザクション)の配列が結果に含まれます。

`ledger`フィールドは廃止予定であり、今後予告なしに削除される可能性があります。

## 応答フォーマット

処理が成功した応答の例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
 "id":4,
 "status":"success",
 "type":"response",
 "result":{
   "ledger":{
     "accepted": true,
     "account_hash":"FD2709F6C07284C3EE85EDE32AC452D9013A89D9B9E781D67D9784457E86A9BB",
     "close_flags":0,
     "close_time":508541181,
     "close_time_human":"2016-Feb-11 21:26:21",
     "close_time_resolution":10,
     "closed": true,
     "hash":"F1433E9D15F33E746B8820DEEE4879F48181704364E459332561DF8E52E4EB7E",
     "ledger_hash":"F1433E9D15F33E746B8820DEEE4879F48181704364E459332561DF8E52E4EB7E",
     "ledger_index":"18851530",
     "parent_close_time":508541180,
     "parent_hash":"8300B70AA5A865961DED7DAC5B88047028762D5946ECA887D09D32DE442E2305",
     "seqNum":"18851530",
     "totalCoins":"99998102799411646",
     "total_coins":"99998102799411646",
     "transaction_hash":"E0DB0471A1D198611E1C050ADA4AE74EEB38CEC26E0550663E0FCB1364212A3B"
   },
   "ledger_hash":"F1433E9D15F33E746B8820DEEE4879F48181704364E459332561DF8E52E4EB7E",
   "ledger_index":18851530,
   "validated": true
 }
}
```

*JSON-RPC*

```
200 OK
{
   "result":{
       "ledger":{
           "accepted": true,
           "account_hash":"B089E7CD4F5167249951611AAEC863D4BF84FF098500E9CB50561F1A89EED825",
           "close_flags":0,
           "close_time":508541222,
           "close_time_human":"2016-Feb-11 21:27:02",
           "close_time_resolution":10,
           "closed": true,
           "hash":"85E6D422F1A3AE0BEA315C4F09CD0B45022312A4BBF0D308246E901536B61157",
           "ledger_hash":"85E6D422F1A3AE0BEA315C4F09CD0B45022312A4BBF0D308246E901536B61157",
           "ledger_index":"18851543",
           "parent_close_time":508541221,
           "parent_hash":"C382DB117F2D5AAECFBFB43EA509F8E56D6E1D1297CE00C0D02A3EE695ABB78F",
           "seqNum":"18851543",
           "totalCoins":"99998102795090646",
           "total_coins":"99998102795090646",
           "transaction_hash":"BEC71A3CAD11BFC4E4013CD109F220E0850E9A3808B15FAA6DAE4D898970EFAF"
       },
       "ledger_hash":"85E6D422F1A3AE0BEA315C4F09CD0B45022312A4BBF0D308246E901536B61157",
       "ledger_index":18851543,
       "status":"success",
       "validated": true
   }
}
```

<!-- MULTICODE_BLOCK_END -->

応答は[標準フォーマット][]に従っており、正常に完了した場合は結果にレジャーに関する情報を表す次のフィールドが含まれています。

| `Field`                        | 型    | 説明                       |
|:-------------------------------|:--------|:----------------------------------|
| `ledger`                       | オブジェクト  | このレジャーの完全なヘッダーデータ。 |
| `ledger.account_hash`          | 文字列  | このレジャーのすべてのアカウント状態情報のハッシュ（16進数） |
| `ledger.accountState`          | 配列   | （要求されていない場合は省略）このレジャーのすべての[アカウント状態情報](ledger-data-formats.html)。 |
| `ledger.close_flags`           | 整数 | このレジャーの閉鎖に関連するフラグのビットマップ。現在、レジャーでは1つのフラグだけが`close_flags`として定義されています（**sLCF_NoConsensusTime**（値1））。このフラグが有効な場合、レジャーの正確な閉鎖時刻についてバリデータの間で意見が対立しましたが、作成しているレジャーは同一のものであるため、バリデータは閉鎖時刻について「合意をしないことに合意する」とした上でコンセンサスを宣言しました。この場合、コンセンサスレジャーの`close_time`の値は直前のバージョンの閉鎖時刻の1秒後です。（この場合、正式な閉鎖時刻がありませんが、実際の閉鎖時刻はおそらく指定されている`close_time`の3～6秒後です。） |
| `ledger.close_time`            | 整数 | レジャーが閉鎖された時刻（[Rippleエポック以降の経過秒数][]） |
| `ledger.close_time_human`      | 文字列  | 人間が読めるフォーマットでのこのレジャーが閉鎖された時刻 |
| `ledger.close_time_resolution` | 整数 | レジャー閉鎖時刻はこの秒数の範囲内で丸めらます。 |
| `ledger.closed`                | ブール値 | このレジャーが閉鎖されているかどうか。 |
| `ledger.ledger_hash`           | 文字列  | レジャー全体の一意の識別用ハッシュ。 |
| `ledger.ledger_index`          | 文字列  | このレジャーの[レジャーインデックス][]。整数を引用符で囲んだ形式で示されます。 |
| `ledger.parent_close_time`     | 整数 | 前のレジャーが閉鎖された時刻。 |
| `ledger.parent_hash`           | 文字列  | このレジャーの直前のレジャーの一意の識別用ハッシュ。 |
| `ledger.total_coins`           | 文字列  | ネットワークのXRPの合計（drop数）。整数を引用符で囲んだ形式で示されます。（トランザクションコストによりXRPが消却されると、この値は減少します。） |
| `ledger.transaction_hash`      | 文字列  | このレジャーに記録されているトランザクション情報のハッシュ（16進数） |
| `ledger.transactions`          | 配列   | （要求されていない場合は省略）このレジャーバージョンで適用されたトランザクション。デフォルトでは、メンバーはトランザクションの識別用[ハッシュ][]文字列です。要求で`expand`がtrueとして指定されている場合は、メンバーはJSONフォーマットまたはバイナリフォーマットでのトランザクションの完全な表現です。フォーマットは、要求で`binary`がtrueとして指定されていたかどうかに応じて決まります。 |
| `ledger_hash`                  | 文字列  | レジャー全体の一意の識別用ハッシュ。 |
| `ledger_index`                 | 数値  | このレジャーの[レジャーインデックス][]。 |
| `queue_data`                   | 配列   | （`queue`パラメーターで要求されている場合を除いて省略）キューに入れられたトランザクションをキューと同じ順序で記述するオブジェクトの配列。要求で`expand`がtrueに指定されている場合は、メンバーにはJSONフォーマットまたはバイナリフォーマットでのトランザクションの完全な表現が含まれています。フォーマットは、要求で`binary`がtrueとして指定されていたかどうかによって決まります。[FeeEscalation Amendment][]が必要です。[新規: rippled 0.70.0][] |

以下のフィールドは廃止予定であり、今後予告なしに削除される可能性があります。`accepted`、`hash`（代わりに`ledger_hash`を使用）、`seqNum`（代わりに`ledger_index`を使用）、`totalCoins`（代わりに`total_coins`を使用）。

`queue_data`配列の各メンバーは、キュー内の1つのトランザクションを表します。このオブジェクトの一部フィールドは、まだ計算されていないために省略されることがあります。このオブジェクトのフィールドを次に示します。

| フィールド               | 値            | 説明                         |
|:--------------------|:-----------------|:------------------------------------|
| `account`           | 文字列           | このキューに入れられたトランザクションの送信者の[アドレス][]。 |
| `tx`                | 文字列またはオブジェクト | デフォルトでは、これはトランザクションの[識別用ハッシュ](basic-data-types.html#ハッシュ)を含む文字列です。トランザクションがバイナリフォーマットで展開されている場合、これは`tx_blob`が唯一のフィールドであるオブジェクトであり、バイナリー形式のトランザクションが10進文字列として含まれています。トランザクションがJSONフォーマットで展開されている場合、これは`hash`フィールドにトランザクションの識別用ハッシュが指定されている[トランザクションオブジェクト](transaction-formats.html)を含むオブジェクトです。 |
| `retries_remaining` | 数値           | このトランザクションの再試行可能回数。この回数を超えるとトランザクションが除外されます。 |
| `preflight_result`  | 文字列           | 初期トランザクションチェックの一時的な結果。これは常に`tesSUCCESS`です。 |
| `last_result`       | 文字列           | _（省略される場合があります）_[再試行可能な (`ter`) の結果](ter-codes.html)を取得した後でこのトランザクションがキューに残っている場合、これは取得した正確な`ter`結果コードです。 |
| `auth_change`       | ブール値          | _（省略される場合があります）_ このトランザクションがこのアドレスの[トランザクション承認方法](transaction-basics.html#取引の承認)を変更するかどうかを示します。 |
| `fee`               | 文字列           | _（省略される場合があります）_ このトランザクションの[トランザクションコスト](transaction-cost.html)（[XRPのdrop数][]）。 |
| `fee_level`         | 文字列           | _（省略される場合があります）_ このタイプのトランザクションの最少コストと比較した、このトランザクションのトランザクションコスト（[手数料レベル][]）。 |
| `max_spend_drops`   | 文字列           | _（省略される場合があります）_ このトランザクションで送信または消却できる[XRP、drop単位][]の最高額。 |

要求に`"owner_funds": true`が指定されておりトランザクションが展開されている場合、応答には、各[OfferCreateトランザクション][]の`metaData`オブジェクトの`owner_funds`フィールドが含まれています。このフィールドの目的は、新しい検証済みレジャーごとに[オファーの資金化ステータス](offers.html#オファーのライフサイクル)を容易に追跡できるようにすることです。このフィールドの定義は、[オーダーブックサブスクリプションストリーム](subscribe.html#オーダーブックストリーム)でのこのフィールドのバージョンとはわずかに異なります。

| `Field`       | 値  | 説明                                         |
|:--------------|:-------|:----------------------------------------------------|
| `owner_funds` | 文字列 | このレジャーのすべてのトランザクションの実行後に、このOfferCreateトランザクションを送信する`Account`が保有する`TakerGets`通貨の額。この通貨額が[凍結](freezes.html)されているかどうかはチェックされません。 |

## 考えられるエラー

* [汎用エラータイプ][]のすべて。
* `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。
* `lgrNotFound` - `ledger_hash`または`ledger_index`で指定したレジャーが存在しないか、存在してはいるもののサーバーが保有していません。
* `noPermission` - `full`または`accounts`をtrueとして指定したが、管理者としてサーバーに接続していない場合（通常、管理者はローカルポートで接続する必要があります）。


<!-- TODO: we should add this fee levels link to rippled-api-links.md. server_state.md is also including this as a one-off.-->
[手数料レベル]: transaction-cost.html#手数料レベル
<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
