---
html: account_channels.html
parent: account-methods.html
seo:
    description: アカウントのPayment Channelに関する情報を返します。
labels:
  - Payment Channel
---
# account_channels
[[ソース]](https://github.com/XRPLF/rippled/blob/release/src/ripple/rpc/handlers/AccountChannels.cpp "Source")

_（[PayChan Amendment][]が有効になっている必要があります。{% badge href="https://github.com/XRPLF/rippled/releases/tag/0.33.0" %}新規: rippled 0.33.0{% /badge %}）_

`account_channels`メソッドは、アカウントのPayment Channelに関する情報を返します。指定されたアカウントがChannelの送金元であり、送金先ではないChannelのみが含まれます。（Channelの「送金元」と「所有者」は同一です。）取得された情報はすべて、特定バージョンのレジャーに関連付けられています。

## リクエストのフォーマット
リクエストのフォーマットの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 1,
  "command": "account_channels",
  "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
  "destination_account": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
  "ledger_index": "validated"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "account_channels",
    "params": [{
        "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
        "destination_account": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
        "ledger_index": "validated"
    }]
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```bash
#Syntax: account_channels <account> [<destination_account>] [<ledger>]
rippled account_channels rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn ra5nK24KXen9AHvsdFTKHSANinZseWnPcX validated
```
{% /tab %}

{% /tabs %}

[試してみる>](/resources/dev-tools/websocket-api-tool#account_channels)


リクエストには以下のパラメーターが含まれます。

| フィールド                 | 型                                       | 説明 |
|:----------------------|:-------------------------------------------|:--------|
| `account`             | 文字列                                     | アカウントの一意のID。通常はアカウントの[アドレス][]です。リクエストは、このアカウントがChannelの所有者/送金元であるChannelを返します。 |
| `destination_account` | 文字列                                     | _（省略可）_ アカウントの一意のID。通常はアカウントの[アドレス][]です。指定されている場合、フィルタリングによりこのアカウントを送金先とするPayment Channelに絞り込まれます。 |
| `ledger_hash`         | 文字列                                     | _（省略可）_ 使用するレジャーバージョンの20バイトの16進文字列。（[レジャーの指定][]をご覧ください） |
| `ledger_index`        | 文字列または符号なし整数                 | _（省略可）_ 使用する[レジャーインデックス][]、またはレジャーを自動的に選択するためのショートカット文字列。（[レジャーの指定][]をご覧ください） |
| `limit`               | 整数                                    | _（省略可）_ 取得するトランザクション数を制限します。サーバはこの値に従う必要はありません。10以上400以下の範囲で値を指定する必要があります。デフォルトでは200です。 |
| `marker`              | [マーカー][] | _（省略可）_ 以前にページネーションされたレスポンスの値。そのレスポンスを停止した箇所からデータの取得を再開します。 |

## レスポンスのフォーマット

処理が成功したレスポンスの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 1,
  "result": {
    "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "channels": [
      {
        "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
        "amount": "1000",
        "balance": "0",
        "channel_id": "C7F634794B79DB40E87179A9D1BF05D05797AE7E92DF8E93FD6656E8C4BE3AE7",
        "destination_account": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
        "public_key": "aBR7mdD75Ycs8DRhMgQ4EMUEmBArF8SEh1hfjrT2V9DQTLNbJVqw",
        "public_key_hex": "03CFD18E689434F032A4E84C63E2A3A6472D684EAF4FD52CA67742F3E24BAE81B2",
        "settle_delay": 60
      }
    ],
    "ledger_hash": "1EDBBA3C793863366DF5B31C2174B6B5E6DF6DB89A7212B86838489148E2A581",
    "ledger_index": 71766314,
    "validated": true
  },
  "status": "success",
  "type": "response"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
200 OK

{
  "result": {
    "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "channels": [
      {
        "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
        "amount": "1000",
        "balance": "0",
        "channel_id": "C7F634794B79DB40E87179A9D1BF05D05797AE7E92DF8E93FD6656E8C4BE3AE7",
        "destination_account": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
        "public_key": "aBR7mdD75Ycs8DRhMgQ4EMUEmBArF8SEh1hfjrT2V9DQTLNbJVqw",
        "public_key_hex": "03CFD18E689434F032A4E84C63E2A3A6472D684EAF4FD52CA67742F3E24BAE81B2",
        "settle_delay": 60
      }
    ],
    "ledger_hash": "27F530E5C93ED5C13994812787C1ED073C822BAEC7597964608F2C049C2ACD2D",
    "ledger_index": 71766343,
    "status": "success",
    "validated": true
  }
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```json
200 OK

{
  "result": {
    "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "channels": [
      {
        "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
        "amount": "1000",
        "balance": "0",
        "channel_id": "C7F634794B79DB40E87179A9D1BF05D05797AE7E92DF8E93FD6656E8C4BE3AE7",
        "destination_account": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
        "public_key": "aBR7mdD75Ycs8DRhMgQ4EMUEmBArF8SEh1hfjrT2V9DQTLNbJVqw",
        "public_key_hex": "03CFD18E689434F032A4E84C63E2A3A6472D684EAF4FD52CA67742F3E24BAE81B2",
        "settle_delay": 60
      }
    ],
    "ledger_hash": "27F530E5C93ED5C13994812787C1ED073C822BAEC7597964608F2C049C2ACD2D",
    "ledger_index": 71766343,
    "status": "success",
    "validated": true
  }
}
```
{% /tab %}

{% /tabs %}

このレスポンスは[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれています。

| フィールド      | 型                                       | 説明        |
|:-----------|:-------------------------------------------|:-------------------|
| `account`  | 文字列                                     | Payment Channelの送金元/所有者のアドレス。これはリクエストの`account`フィールドに対応しています。 |
| `channels` | channelオブジェクトの配列                   | この`account`が所有するPayment Channel。 |
| `ledger_hash` | 文字列                                  | このレスポンスの生成に使用されたレジャーバージョンの識別用[ハッシュ][]。{% badge href="https://github.com/XRPLF/rippled/releases/tag/0.90.0" %}新規: rippled 0.90.0{% /badge %} |
| `ledger_index` | 数値                                 | このレスポンスの生成に使用されたレジャーバージョンの[レジャーインデックス][]。{% badge href="https://github.com/XRPLF/rippled/releases/tag/0.90.0" %}新規: rippled 0.90.0{% /badge %} |
| `validated` | ブール値                                   | _（省略される場合があります）_`true`の場合、このレスポンスの情報は検証済みレジャーバージョンから取り込まれます。trueでない場合、情報は変更されることがあります。{% badge href="https://github.com/XRPLF/rippled/releases/tag/0.90.0" %}新規: rippled 0.90.0{% /badge %} |
| `limit`    | 数値                                     | _（省略される場合があります）_ このリクエストから実際に返されるchannelオブジェクトの数の制限。 |
| `marker`   | [マーカー][] | _（省略される場合があります）_ ページネーションのサーバ定義の値。この値を次のコールに渡して、このコールで終わった箇所から結果の取得を再開します。この後に追加のページがない場合は省略されます。 |

各Channelオブジェクトのフィールドは次のとおりです。

| フィールド | 型 | 説明 |
|-------|------|-------------|
| `account` | 文字列 | Channelの所有者（[アドレス][]として）。 |
| `amount` | 文字列 | このChannelに割り当てられる[XRP、drop単位][]の合計額。 |
| `balance` | 文字列 | 使用されているレジャーバージョンにおいて、このChannelから支払われた[XRP、drop単位][]の合計額。（Channelに残っているXRPの額を計算するには、`balance`を`amount`から差し引きます。） |
| `channel_id` | 文字列 | このChannelの一意のID（64文字の16進数文字列）。レジャーの状態データの[channelオブジェクトのID](../../../protocol/ledger-data/ledger-entry-types/paychannel.md#paychannel-idのフォーマット)でもあります。 |
| `destination_account` | 文字列 | Channelの送金先アカウント（[アドレス][]として）。このアカウントだけが、Channelがオープンしている間にXRPを受領できます。 |
| `public_key` | 文字列 | _（省略される場合があります）_ XRP Ledgerの[base58][]フォーマットのPayment Channelの公開鍵。このChannelに対する署名付きクレームは、一致するキーペアを使用して清算する必要があります。 |
| `public_key_hex` | 文字列 | _（省略される場合があります）_ Payment Channel作成時にChannelの公開鍵を指定している場合はその公開鍵（16進数フォーマット）。このChannelに対する署名付きクレームは、一致するキーペアを使用して清算する必要があります。 |
| `settle_delay` | 符号なし整数 | Payment Channelの所有者がChannel閉鎖を依頼した後に、そのChannelが開いている必要がある秒数。 |
| `expiration` | 符号なし整数 | _（省略される場合があります）_ このChannelに設定された有効期限（[Rippleエポック以降の経過秒数][]）。この有効期限の日付は変更可能です。これが最新の検証済みレジャーの閉鎖時刻よりも前の場合、Channelは有効期限切れです。 |
| `cancel_after` | 符号なし整数 | _（省略される場合があります）_ このChannelの変更不可能な有効期限がChannel作成時に指定されている場合はその有効期限（[Rippleエポック以降の経過秒数][]）。これが最新の検証済みレジャーの閉鎖時刻よりも前の場合、Channelは有効期限切れです。 |
| `source_tag` | 符号なし整数 | _（省略される場合があります）_ このPayment Channelを通じた支払いの[送金元タグ](../../../../concepts/transactions/source-and-destination-tags.md)として使用される32ビット符号なし整数（Channel作成時に指定されている場合）。送金元アカウントでのPayment Channelの送金人またはその他の目的を示します。通常、このChannelからの支払いを差し戻す場合、返金の`DestinationTag`にこの値を指定する必要があります。 |
| `destination_tag` | 符号なし整数 | _（省略される場合があります）_ このChannelを通じた支払いの[送金先タグ](../../../../concepts/transactions/source-and-destination-tags.md)として使用される32ビット符号なし整数（Channel作成時に指定されている場合）。送金先アカウントでのPayment Channelの受取人またはその他の目的を示します。 |

## 考えられるエラー

* [汎用エラータイプ][]のすべて。
* `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。
* `actNotFound` - リクエストの`account`フィールドに指定されているアドレスが、レジャーのアカウントに対応していません。
* `lgrNotFound` - `ledger_hash`または`ledger_index`で指定したレジャーが存在しないか、存在してはいるもののサーバが保有していません。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
