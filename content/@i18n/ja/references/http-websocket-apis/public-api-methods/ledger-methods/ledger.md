---
html: ledger.html # Watch carefully for clashes w/ this filename
parent: ledger-methods.html
blurb: 公開レジャーに関する情報を取得します。
label:
  - ブロックチェーン
---
# ledger
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/LedgerHandler.cpp "Source")

公開レジャーに関する情報を取得します。

## 要求フォーマット
要求フォーマットの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
   "id":14,
   "command":"ledger",
   "ledger_index":"validated",
   "transactions": false,
   "expand": false,
   "owner_funds": false
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
   "method":"ledger",
   "params":[
       {
           "ledger_index":"validated",
           "transactions": false,
           "expand": false,
           "owner_funds": false
       }
   ]
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
#Syntax: ledger ledger_index|ledger_hash [full|tx]
# "full" is equivalent to "full": true
# "tx" is equivalent to "transactions": true
rippled ledger current
```
{% /tab %}

{% /tabs %}

[試してみる >](/resources/dev-tools/websocket-api-tool#ledger)

要求には以下のパラメーターを含めることができます。

| `Field`        | 型                    | 必須? | 説明                    |
|:---------------|:---------------------|:------|:-------------------------------|
| `ledger_hash`  | [ハッシュ](../../../protocol/data-types/basic-data-types.md#ハッシュ)           | いいえ | 使用するレジャーバージョンの20バイトの16進文字列。([レジャーの指定](../../../protocol/data-types/basic-data-types.md#レジャーの指定)ご覧ください。) |
| `ledger_index` | [レジャーインデックス](../../../protocol/data-types/basic-data-types.md#レジャーインデックス) | いいえ | 使用するレジャーの[レジャーインデックス](../../../protocol/data-types/basic-data-types.md#レジャーインデックス)、またはレジャーを自動的に選択するためのショートカット文字列。([レジャーの指定](../../../protocol/data-types/basic-data-types.md#レジャーの指定)をご覧ください) |
| `transactions` | 真偽値                 | いいえ | `true`の場合、指定されたレジャーバージョンのトランザクションに関する情報が返されます。デフォルトでは`false`です。レジャーバージョンを指定しない場合は無視されます。 |
| `expand`       | 真偽値                 | いいえ | ハッシュのみではなく、トランザクション/アカウントの完全な情報がJSONフォーマットで提供されます。デフォルトでは`false`です。トランザクション、アカウント、またはその両方を要求しない場合は無視されます。 |
| `owner_funds`  | 真偽値                 | いいえ | `true`の場合、応答のOfferCreateトランザクションのメタデータに`owner_funds`フィールドが含まれます。デフォルトでは`false`です。トランザクションが含まれておらず、`expand`がtrueではない場合には無視されます。 |
| `binary`       | 真偽値                 | いいえ | `true`で、かつ`transactions`と`expand`が両方とも`true`の場合、JSONフォーマットではなくバイナリフォーマット（16進文字列）でトランザクション情報が返されます。 |
| `queue`        | 真偽値                 | いいえ | `true`で、かつコマンドが`current`レジャーを要求している場合、[キューに入れらているトランザクション](../../../../concepts/transactions/transaction-cost.md#キューに入れられたトランザクション)の配列が結果に含まれます。


`ledger`フィールドは廃止予定であり、今後予告なしに削除される可能性があります。`full`、`accounts`、`type`フィールド(管理者専用)も非推奨です。

## 応答フォーマット

処理が成功した応答の例:

{% tabs %}

{% tab label="WebSocket" %}
{% code-snippet file="/_api-examples/ledger/ws-response.json" language="json" /%}
{% /tab %}

{% tab label="JSON-RPC" %}
{% code-snippet file="/_api-examples/ledger/jsonrpc-response.json" language="json" prefix="200 OK\n\n" /%}
{% /tab %}

{% tab label="コマンドライン" %}
{% code-snippet file="/_api-examples/ledger/jsonrpc-response.json" language="json" prefix="Loading: \"/etc/opt/ripple/rippled.cfg\"\n2023-Nov-01 21:38:14.638871262 UTC HTTPClient:NFO Connecting to 127.0.0.1:5005\n\n" /%}
{% /tab %}

{% /tabs %}

応答は[標準フォーマット](../../api-conventions/response-formatting.md)に従っており、正常に完了した場合は結果にレジャーに関する情報を表す次のフィールドが含まれています。

| `Field`                        | 型          | 説明                       |
|:-------------------------------|:------------|:--------------------------|
| `ledger`                       | オブジェクト  | このレジャーの完全な[レジャーヘッダのデータ](../../../protocol/ledger-data/ledger-header.md)で、便宜上いくつかのフィールドが追加されています。 |
| `ledger.account_hash`          | 文字列       | このレジャーのすべてのアカウント状態情報の[ハッシュ](../../../protocol/data-types/basic-data-types.md#ハッシュ)(16進数) |
| `ledger.accountState`          | 配列         | このレジャーのすべての[アカウント状態情報](../../../protocol/ledger-data/index.md)(16進数)。 |
| `ledger.close_flags`           | 整数         | このレジャーの[クローズに関するフラグ](ledger-header.html#close-flags)のビットマップ。 |
| `ledger.close_time`            | 整数         | レジャーが閉鎖された時刻（[Rippleエポック以降の経過秒数](../../../protocol/data-types/basic-data-types.md#時間の指定)）。 |
| `ledger.close_time_human`      | 文字列       | 人間が読めるフォーマットでのこのレジャーが閉鎖された時刻。常にUTCタイムゾーンを使用します。 |
| `ledger.close_time_resolution` | 整数         | レジャー閉鎖時刻が丸められる秒数の範囲。 |
| `ledger.closed`                | 真偽値       | このレジャーが閉鎖されているかどうか。 |
| `ledger.ledger_hash`           | 文字列       | レジャー全体の一意の識別用ハッシュ。 |
| `ledger.ledger_index`          | 文字列       | このレジャーの[レジャーインデックス](../../../protocol/data-types/basic-data-types.md#レジャーインデックス)。整数を引用符で囲んだ形式で示されます。 |
| `ledger.parent_close_time`     | 整数         | 前のレジャーが閉鎖された時刻。 |
| `ledger.parent_hash`           | 文字列       | このレジャーの直前のレジャーの一意の識別用ハッシュ。 |
| `ledger.total_coins`           | 文字列       | ネットワークのXRPの合計（drop数）。整数を引用符で囲んだ形式で示されます。（トランザクションコストによりXRPが焼却されると、この値は減少します。） |
| `ledger.transaction_hash`      | 文字列       | このレジャーに記録されているトランザクション情報のハッシュ（16進数） |
| `ledger.transactions`          | 配列         | （要求されていない場合は省略）このレジャーバージョンで適用されたトランザクション。デフォルトでは、メンバーはトランザクションの識別用[ハッシュ](../../../protocol/data-types/basic-data-types.md#ハッシュ)文字列です。要求で`expand`がtrueとして指定されている場合は、メンバーはJSONフォーマットまたはバイナリフォーマットでのトランザクションの完全な表現です。フォーマットは、要求で`binary`がtrueとして指定されていたかどうかに応じて決まります。 |
| `ledger_hash`                  | 文字列       | レジャー全体の一意の識別用ハッシュ。 |
| `ledger_index`                 | 数値         | このレジャーの[レジャーインデックス](../../../protocol/data-types/basic-data-types.md#レジャーインデックス)。 |
| `queue_data`                   | 配列         | （`queue`パラメーターで要求されている場合を除いて省略）キューに入れられたトランザクションをキューと同じ順序で記述するオブジェクトの配列。要求で`expand`がtrueに指定されている場合は、メンバーにはJSONフォーマットまたはバイナリフォーマットでのトランザクションの完全な表現が含まれています。フォーマットは、要求で`binary`がtrueとして指定されていたかどうかによって決まります。 |

`ledger.accountState`フィールド（`"full": true`または`"accounts": true`で要求されない限り省略）は廃止予定です。

次のフィールドは廃止予定であり、今後予告なしに削除される可能性があります。`accepted`、`hash`（代わりに`ledger_hash`を使用）、`seqNum`（代わりに`ledger_index`を使用）、`totalCoins`（代わりに`total_coins`を使用）。[更新: rippled 1.12.0](https://github.com/XRPLF/rippled/releases/tag/1.12.0 "BADGE_BLUE")

`queue_data`配列の各メンバーは、キュー内の1つのトランザクションを表します。このオブジェクトの一部フィールドは、まだ計算されていないために省略されることがあります。このオブジェクトのフィールドを次に示します。

| フィールド            | 値                   | 説明                         |
|:--------------------|:---------------------|:------------------------------------|
| `account`           | 文字列                | このキューに入れられたトランザクションの送信者の[アドレス](../../../protocol/data-types/basic-data-types.md#アドレス)。 |
| `tx`                | 文字列またはオブジェクト | デフォルトでは、これはトランザクションの[識別用ハッシュ](../../../protocol/data-types/basic-data-types.md#ハッシュ)を含む文字列です。トランザクションがバイナリフォーマットで展開されている場合、これは`tx_blob`が唯一のフィールドであるオブジェクトであり、バイナリー形式のトランザクションが10進文字列として含まれています。トランザクションがJSONフォーマットで展開されている場合、これは`hash`フィールドにトランザクションの識別用ハッシュが指定されている[トランザクションオブジェクト](../../../protocol/transactions/index.md)を含むオブジェクトです。 |
| `retries_remaining` | 数値                  | このトランザクションの再試行可能回数。この回数を超えるとトランザクションが除外されます。 |
| `preflight_result`  | 文字列                | 初期トランザクションチェックの一時的な結果。これは常に`tesSUCCESS`です。 |
| `last_result`       | 文字列                | _（省略される場合があります）_[再試行可能な(`ter`)の結果](../../../protocol/transactions/transaction-results/ter-codes.md)を取得した後でこのトランザクションがキューに残っている場合、これは取得した正確な`ter`結果コードです。 |
| `auth_change`       | 真偽値                | _（省略される場合があります）_ このトランザクションがこのアドレスの[トランザクション承認方法](../../../../concepts/transactions/index.md#トランザクションの承認)を変更するかどうかを示します。 |
| `fee`               | 文字列                | _（省略される場合があります）_ このトランザクションの[トランザクションコスト](../../../../concepts/transactions/transaction-cost.md)（[XRPのdrop数](../../../protocol/data-types/basic-data-types.md#通貨額の指定)）。 |
| `fee_level`         | 文字列                | _（省略される場合があります）_ このタイプのトランザクションの最少コストと比較した、このトランザクションのトランザクションコスト（[手数料レベル][]）。 |
| `max_spend_drops`   | 文字列                | _（省略される場合があります）_ このトランザクションで送信または消却できる[XRP、drop単位](../../../protocol/data-types/basic-data-types.md#通貨額の指定)の最高額。 |

要求に`"owner_funds": true`が指定されておりトランザクションが展開されている場合、応答には、各[OfferCreateトランザクション][]の`metaData`オブジェクトの`owner_funds`フィールドが含まれています。このフィールドの目的は、新しい検証済みレジャーごとに[オファーの資金化ステータス](../../../../concepts/tokens/decentralized-exchange/offers.md#オファーのライフサイクル)を容易に追跡できるようにすることです。このフィールドの定義は、[オーダーブックサブスクリプションストリーム](../subscription-methods/subscribe.md#オーダーブックストリーム)でのこのフィールドのバージョンとはわずかに異なります。

| `Field`       | 値  | 説明                                         |
|:--------------|:-------|:----------------------------------------------------|
| `owner_funds` | 文字列 | このレジャーのすべてのトランザクションの実行後に、このOfferCreateトランザクションを送信する`Account`が保有する`TakerGets`通貨の額。この通貨額が[凍結](../../../../concepts/tokens/fungible-tokens/freezes.md)されているかどうかはチェックされません。 |

## 考えられるエラー

* [汎用エラータイプ](../../api-conventions/error-formatting.md#汎用エラー)のすべて。
* `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。
* `lgrNotFound` - `ledger_hash`または`ledger_index`で指定したレジャーが存在しないか、存在してはいるもののサーバーが保有していません。
* `noPermission` - `full`または`accounts`をtrueとして指定したが、管理者としてサーバーに接続していない場合（通常、管理者はローカルポートで接続する必要があります）。


<!-- TODO: we should add this fee levels link to rippled-api-links.md. server_state.md is also including this as a one-off.-->
[手数料レベル]: ../../../../concepts/transactions/transaction-cost.md#手数料レベル
