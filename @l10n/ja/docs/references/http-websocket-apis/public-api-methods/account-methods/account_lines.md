---
html: account_lines.html
parent: account-methods.html
seo:
    description: アカウントのトラストラインに関する情報を取得します。
labels:
  - トークン
---
# account_lines

{% source-link path="src/xrpld/rpc/handlers/account/AccountLines.cpp" /%}

`account_lines`メソッドは、アカウントのトラストラインに関する情報を返します。トラストラインには、XRP以外のすべての通貨と資産の残高が含まれます。取得される情報はすべて、特定のバージョンのレジャーを基準としたものです。

## リクエストのフォーマット

リクエストのフォーマットの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": "example_account_lines",
  "command": "account_lines",
  "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
  "api_version": 2
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "account_lines",
    "params": [
        {
            "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
            "api_version": 2
        }
    ]
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
#Syntax: account_lines <account> [<peer>] [<ledger_index>|<ledger_hash>]
xrpld account_lines r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59
```
{% /tab %}

{% /tabs %}

{% try-it method="account_lines" /%}

リクエストには以下のパラメーターを指定できます。

| フィールド         | 型                     | 必須？ | 説明 |
|:-----------------|:-----------------------|:------|:-----|
| `account`        | 文字列 - [アドレス][]     | はい   | このアカウントに接続されているトラストラインを、このアカウントの視点から検索します。 |
| `ignore_default` | 真偽値                  | いいえ | `true`の場合、このアカウント側がデフォルトの状態にあるトラストラインを返しません。デフォルトは`false`です。 |
| `ledger_hash`    | 文字列 - [ハッシュ][]     | いいえ | 使用するレジャーバージョンの一意のハッシュ。（[レジャーの指定][]を参照してください） |
| `ledger_index`   | [レジャーインデックス][]   | いいえ | 使用するレジャーの[レジャーインデックス][]、またはレジャーを自動的に選択するためのショートカット文字列。（[レジャーの指定][]を参照してください） |
| `limit`          | 数値                    | いいえ | 取得するトラストラインの数を制限します。結果にまだ続きのページがある場合でも、サーバは指定された上限より少ない数を返すことがあります。10以上400以下の範囲で指定する必要があります。この範囲外の正の値は、最も近い有効な値に置き換えられます。デフォルトは200です。 |
| `marker`         | [マーカー][Marker]       | いいえ | 以前のページネーションされたレスポンスの値。そのレスポンスが中断したところからデータの取得を再開します。 |
| `peer`           | 文字列 - [アドレス][]     | いいえ | 2つ目のアカウント。指定した場合、2つのアカウントを結ぶトラストラインだけに結果を絞り込みます。 |

以下のパラメーターは廃止予定であり、今後予告なしに削除される可能性があります: `ledger`、`peer_index`。

## レスポンスのフォーマット

処理が成功したレスポンスの例:

{% tabs %}

{% tab label="WebSocket" %}
{% code-snippet file="/_api-examples/account_lines/ws-response.json" language="json" /%}
{% /tab %}

{% tab label="JSON-RPC" %}
{% code-snippet file="/_api-examples/account_lines/jsonrpc-response.json" language="json" prefix="200 OK\n\n" /%}
{% /tab %}

{% tab label="コマンドライン" %}
{% code-snippet file="/_api-examples/account_lines/jsonrpc-response.json" language="json" prefix="Loading: \"/etc/xrpld/xrpld.cfg\"\n2025-Apr-09 21:10:16.085500844 UTC HTTPClient:NFO Connecting to 127.0.0.1:5005\n\n" /%}
{% /tab %}

{% /tabs %}

このレスポンスは[標準フォーマット][]に従っており、正常に完了した場合は、アカウントのアドレスとトラストラインオブジェクトの配列が結果に含まれます。具体的には、結果オブジェクトには次のフィールドが含まれます。

| フィールド               | 型                     | 必須？ | 説明 |
|:-----------------------|:-----------------------|:------|:-----|
| `account`              | 文字列                  | はい   | このリクエストに対応するアカウントの一意の[アドレス][]。トラストラインの「パースペクティブアカウント」（視点となるアカウント）です。 |
| `lines`                | 配列                    | はい   | トラストラインオブジェクトの配列。以下で説明します。トラストラインの数が多い場合は、一度に`limit`の数までのトラストラインが返されます。 |
| `ledger_current_index` | [レジャーインデックス][]   | いいえ | このデータの取得時に使用されたレジャーインデックス。このフィールドは、オープンレジャーのバージョンを使用した場合にのみ含まれます。 |
| `ledger_index`         | [レジャーインデックス][]   | いいえ | このデータの取得時に使用されたレジャーインデックス。このフィールドは、閉鎖済みのレジャーのバージョンを使用した場合にのみ含まれます。 |
| `ledger_hash`          | 文字列 - [ハッシュ][]     | いいえ | このデータの取得時に使用されたレジャーバージョンの識別用ハッシュ。このフィールドは、閉鎖済みのレジャーのバージョンを使用した場合にのみ含まれます。 |
| `marker`               | [マーカー][Marker]       | いいえ | レスポンスがページネーションされていることを示す、サーバが定義した値。この値を次の呼び出しに渡すと、この呼び出しが終わったところから再開します。この後に追加のページがない場合は省略されます。 |
| `limit`                | 数値                    | いいえ | 取得したトラストラインの最大数。結果がまだある場合でも、サーバは指定された上限より少ない数を返すことがあります。リクエストで上限を指定しなかった場合は、デフォルトの上限である200を使用します。 |

各トラストラインオブジェクトには、以下のフィールドの組み合わせが含まれます。

| フィールド          | 型                                                                            | 必須？ | 説明 |
|:------------------|:------------------------------------------------------------------------------|:------|:-----|
| `account`         | 文字列 - [アドレス][]                                                            | はい   | このトラストラインの相手側。 |
| `balance`         | [文字列の数値](../../../protocol/data-types/currency-formats.md#文字列フォーマット) | はい   | 現在このトラストラインで保有されている残高を数値で表したもの。残高がプラスの場合はパースペクティブアカウントが価値を保有しており、マイナスの場合はパースペクティブアカウントが価値を借りています。 |
| `currency`        | 文字列 - [通貨コード][]                                                           | はい   | このトラストラインが保有できるトークンの通貨コード。 |
| `limit`           | [文字列の数値](../../../protocol/data-types/currency-formats.md#文字列フォーマット) | はい   | このアカウントが相手側のアカウントに対して負ってもよいとする、この通貨の最大額。 |
| `limit_peer`      | [文字列の数値](../../../protocol/data-types/currency-formats.md#文字列フォーマット) | はい   | 相手側のアカウントがパースペクティブアカウントに対して負ってもよいとする、この通貨の最大額。 |
| `quality_in`      | 数値                                                                           | はい   | このアカウントが、このトラストラインの入金時残高を評価する際のレート（この値対10億単位の比率）。（例えば、5億の値は0.5:1の比率を表します。）特殊なケースとして、0は1:1の比率として扱われます。 |
| `quality_out`     | 数値                                                                           | はい   | このアカウントが、このトラストラインの出金時残高を評価する際のレート（この値対10億単位の比率）。（例えば、5億の値は0.5:1の比率を表します。）特殊なケースとして、0は1:1の比率として扱われます。 |
| `no_ripple`       | 真偽値                                                                          | いいえ | `true`の場合、このアカウントはこのトラストラインで[No Rippleフラグ](../../../../concepts/tokens/fungible-tokens/rippling.md)を有効にしています。このフィールドがあって`false`の場合、このアカウントはNo Rippleフラグを無効にしていますが、Default Rippleフラグも無効にしているため、[デフォルトの状態](../../../protocol/ledger-data/ledger-entry-types/ripplestate.md#contributing-to-the-owner-reserve)とはみなされません。省略されている場合、このアカウントはこのトラストラインのNo Rippleフラグを無効にしており、Default Rippleを有効にしています。 |
| `no_ripple_peer`  | 真偽値                                                                          | いいえ | `true`の場合、相手側のアカウントはこのトラストラインで[No Rippleフラグ](../../../../concepts/tokens/fungible-tokens/rippling.md)を有効にしています。このフィールドがあって`false`の場合、このアカウントはNo Rippleフラグを無効にしていますが、Default Rippleフラグも無効にしているため、[デフォルトの状態](../../../protocol/ledger-data/ledger-entry-types/ripplestate.md#contributing-to-the-owner-reserve)とはみなされません。省略されている場合、このアカウントはこのトラストラインのNo Rippleフラグを無効にしており、Default Rippleを有効にしています。 |
| `authorized`      | 真偽値                                                                          | いいえ | `true`の場合、パースペクティブアカウントは[このトラストラインを認可](../../../../concepts/tokens/fungible-tokens/authorized-trust-lines.md)しています。デフォルトは`false`です。 |
| `peer_authorized` | 真偽値                                                                          | いいえ | `true`の場合、相手側は[このトラストラインを認可](../../../../concepts/tokens/fungible-tokens/authorized-trust-lines.md)しています。デフォルトは`false`です。 |
| `freeze`          | 真偽値                                                                          | いいえ | `true`の場合、パースペクティブアカウントはこのトラストラインを[フリーズ](../../../../concepts/tokens/fungible-tokens/freezes.md)しています。デフォルトは`false`です。 |
| `freeze_peer`     | 真偽値                                                                          | いいえ | `true`の場合、相手側はこのトラストラインを[フリーズ](../../../../concepts/tokens/fungible-tokens/freezes.md)しています。デフォルトは`false`です。 |

## 考えられるエラー

* いずれかの[汎用エラータイプ][]。
* `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。
* `actNotFound` - リクエストの`account`フィールドに指定されている[アドレス][]が、レジャーのアカウントに対応していません。
* `lgrNotFound` - `ledger_hash`または`ledger_index`で指定したレジャーが存在しないか、存在してはいるもののサーバが保有していません。
* `actMalformed` - 指定された`marker`フィールドが受け入れられない場合。

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
