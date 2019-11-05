# account_channels
[[ソース]<br>](https://github.com/ripple/rippled/blob/release/src/ripple/rpc/handlers/AccountChannels.cpp "Source")

_（[PayChan Amendment][]が有効になっている必要があります。[新規: rippled 0.33.0][]）_

`account_channels`メソッドは、アカウントのPayment Channelに関する情報を返します。指定されたアカウントがChannelの送金元であり、送金先ではないChannelのみが含まれます。（Channelの「送金元」と「所有者」は同一です。）取得された情報はすべて、特定バージョンのレジャーに関連付けられています。

## 要求フォーマット
要求フォーマットの例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
 "id": 1,
 "command": "account_channels",
 "account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
 "destination_account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
 "ledger_index": "validated"
}
```

*JSON-RPC*

```json
{
   "method": "account_channels",
   "params": [{
       "account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
       "destination_account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
       "ledger_index": "validated"
   }]
}
```

*コマンドライン*

```bash
#Syntax: account_channels <account> [<destination_account>] [<ledger>]
rippled account_channels rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn validated
```

<!-- MULTICODE_BLOCK_END -->

要求には以下のパラメーターが含まれます。

| フィールド                 | 型                                       | 説明 |
|:----------------------|:-------------------------------------------|:--------|
| `account`             | 文字列                                     | アカウントの一意のID。通常はアカウントの[アドレス][]です。要求は、このアカウントがChannelの所有者/送金元であるChannelを返します。 |
| `destination_account` | 文字列                                     | _（省略可）_ アカウントの一意のID。通常はアカウントの[アドレス][]です。指定されている場合、フィルタリングによりこのアカウントを送金先とするPayment Channelに絞り込まれます。 |
| `ledger_hash`         | 文字列                                     | _（省略可）_ 使用するレジャーバージョンの20バイトの16進文字列。（[レジャーの指定][]を参照してください） |
| `ledger_index`        | 文字列または符号なし整数                 | _（省略可）_ 使用するレジャーのシーケンス番号、またはレジャーを自動的に選択するためのショートカット文字列。（[レジャーの指定][]を参照してください） |
| `limit`               | 整数                                    | _（省略可）_ 取得するトランザクション数を制限します。サーバーはこの値に従う必要はありません。10以上400以下の範囲で値を指定する必要があります。デフォルトでは200です。 |
| `marker`              | [マーカー][] | _（省略可）_ 以前にページネーションされた応答の値。その応答を停止した箇所からデータの取得を再開します。 |

## 応答フォーマット

処理が成功した応答の例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
 "id": 2,
 "status": "success",
 "type": "response",
 "result": {
   "account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
   "channels": [
     {
       "account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
       "amount": "100000000",
       "balance": "1000000",
       "channel_id": "5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3",
       "destination_account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
       "destination_tag": 20170428,
       "expiration": 547073182,
       "public_key": "aB44YfzW24VDEJQ2UuLPV2PvqcPCSoLnL7y5M1EzhdW4LnK5xMS3",
       "public_key_hex": "023693F15967AE357D0327974AD46FE3C127113B1110D6044FD41E723689F81CC6",
       "settle_delay": 86400
     }
   ],
   "ledger_hash": "F168208EECDAA57DDAC32780CDD8330FA3E89F0E84D27A9052AA2F88681EBD08",
   "ledger_index": 37230642,
   "validated": true
 }
}
```

*JSON-RPC*

```json
200 OK

{
   "result": {
       "account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
       "channels": [{
           "account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
           "amount": "100000000",
           "balance": "0",
           "channel_id": "5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3",
           "destination_account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
           "destination_tag": 20170428,
           "public_key": "aB44YfzW24VDEJQ2UuLPV2PvqcPCSoLnL7y5M1EzhdW4LnK5xMS3",
           "public_key_hex": "023693F15967AE357D0327974AD46FE3C127113B1110D6044FD41E723689F81CC6",
           "settle_delay": 86400
       }],
       "ledger_hash": "B9D3D80EDF4083A06B2D51202E0BFB63C46FC0985E015D06767C21A62853BF6D",
       "ledger_index": 37230600,
       "status": "success",
       "validated": true
   }
}
```

*コマンドライン*

```json
200 OK

{
   "result": {
       "account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
       "channels": [{
           "account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
           "amount": "100000000",
           "balance": "0",
           "channel_id": "5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3",
           "destination_account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
           "destination_tag": 20170428,
           "public_key": "aB44YfzW24VDEJQ2UuLPV2PvqcPCSoLnL7y5M1EzhdW4LnK5xMS3",
           "public_key_hex": "023693F15967AE357D0327974AD46FE3C127113B1110D6044FD41E723689F81CC6",
           "settle_delay": 86400
       }],
       "ledger_hash": "B9D3D80EDF4083A06B2D51202E0BFB63C46FC0985E015D06767C21A62853BF6D",
       "ledger_index": 37230600,
       "status": "success",
       "validated": true
   }
}
```

<!-- MULTICODE_BLOCK_END -->

この応答は[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれています。

| フィールド      | 型                                       | 説明        |
|:-----------|:-------------------------------------------|:-------------------|
| `account`  | 文字列                                     | Payment Channelの送金元/所有者のアドレス。これは要求の`account`フィールドに対応しています。 |
| `channels` | channelオブジェクトの配列                   | この`account`が所有するPayment Channel。 |
| `ledger_hash` | 文字列                                  | この応答の生成に使用されたレジャーバージョンの識別用[ハッシュ][]。[新規: rippled 0.90.0][] |
| `ledger_index` | 数値                                 | この応答の生成に使用されたレジャーバージョンの[レジャーインデックス][]。[新規: rippled 0.90.0][] |
| `validated` | ブール値                                   | _（省略される場合があります）_`true`の場合、この応答の情報は検証済みレジャーバージョンから取り込まれます。trueでない場合、情報は変更されることがあります。[新規: rippled 0.90.0][] |
| `limit`    | 数値                                     | _（省略される場合があります）_ この要求から実際に返されるchannelオブジェクトの数の制限。 |
| `marker`   | [マーカー][] | _（省略される場合があります）_ ページネーションのサーバー定義の値。この値を次のコールに渡して、このコールで終わった箇所から結果の取得を再開します。この後に追加のページがない場合は省略されます。 |

各Channelオブジェクトのフィールドは次のとおりです。

| フィールド | 型 | 説明 |
|-------|------|-------------|
| `account` | 文字列 | Channelの所有者（[アドレス][]として）。 |
| `amount` | 文字列 | このChannelに割り当てられる[XRP、drop単位][]の合計額。 |
| `balance` | 文字列 | 使用されているレジャーバージョンにおいて、このChannelから支払われた[XRP、drop単位][]の合計額。（Channelに残っているXRPの額を計算するには、`balance`を`amount`から差し引きます。） |
| `channel_id` | 文字列 | このChannelの一意のID（64文字の16進数文字列）。レジャーの状態データの[channelオブジェクトのID](paychannel.html#paychannel-idのフォーマット)でもあります。 |
| `destination_account` | 文字列 | Channelの送金先アカウント（[アドレス][]として）。このアカウントだけが、Channelがオープンしている間にXRPを受領できます。 |
| `public_key` | 文字列 | _（省略される場合があります）_ XRP Ledgerの[base58][]フォーマットのPayment Channelの公開鍵。このChannelに対する署名付きクレームは、一致するキーペアを使用して清算する必要があります。 |
| `public_key_hex` | 文字列 | _（省略される場合があります）_ Payment Channel作成時にChannelの公開鍵を指定している場合はその公開鍵（16進数フォーマット）。このChannelに対する署名付きクレームは、一致するキーペアを使用して清算する必要があります。 |
| `settle_delay` | 符号なし整数 | Payment Channelの所有者がChannel閉鎖を依頼した後に、そのChannelが開いている必要がある秒数。 |
| `expiration` | 符号なし整数 | _（省略される場合があります）_ このChannelに設定された有効期限（[Rippleエポック以降の経過秒数][]）。この有効期限の日付は変更可能です。これが最新の検証済みレジャーの閉鎖時刻よりも前の場合、Channelは有効期限切れです。 |
| `cancel_after` | 符号なし整数 | _（省略される場合があります）_ このChannelの変更不可能な有効期限がChannel作成時に指定されている場合はその有効期限（[Rippleエポック以降の経過秒数][]）。これが最新の検証済みレジャーの閉鎖時刻よりも前の場合、Channelは有効期限切れです。 |
| `source_tag` | 符号なし整数 | _（省略される場合があります）_ このPayment Channelを通じた支払いの[送金元タグ](become-an-xrp-ledger-gateway.html#source-and-destination-tags)として使用される32ビット符号なし整数（Channel作成時に指定されている場合）。送金元アカウントでのPayment Channelの送金人またはその他の目的を示します。通常、このChannelからの支払いを差し戻す場合、返金の`DestinationTag`にこの値を指定する必要があります。 |
| `destination_tag` | 符号なし整数 | _（省略される場合があります）_ このChannelを通じた支払いの[送金先タグ](become-an-xrp-ledger-gateway.html#source-and-destination-tags)として使用される32ビット符号なし整数（Channel作成時に指定されている場合）。送金先アカウントでのPayment Channelの受取人またはその他の目的を示します。 |

## 考えられるエラー

* [汎用エラータイプ][]のすべて。
* `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。
* `actNotFound` - 要求の`account`フィールドに指定されているアドレスが、レジャーのアカウントに対応していません。
* `lgrNotFound` - `ledger_hash`または`ledger_index`で指定したレジャーが存在しないか、存在してはいるもののサーバーが保有していません。


{% include '_snippets/rippled_versions.md' %}
{% include '_snippets/rippled-api-links.md' %}
