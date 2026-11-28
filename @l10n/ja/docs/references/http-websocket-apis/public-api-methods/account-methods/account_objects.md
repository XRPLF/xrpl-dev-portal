---
seo:
    description: アカウントが所有するすべてのレジャーオブジェクトを取得します。
labels:
  - アカウント
  - データ保持
---
# account_objects
{% source-link path="src/xrpld/rpc/handlers/account/AccountObjects.cpp" /%}

`account_objects`コマンドは、アカウントが所有する _すべての_ レジャーエントリを、生の[レジャーフォーマット][]で返します。

特定の種類のレジャーエントリを取得するための専用のAPIメソッドもあります。例えば、トラストラインには[account_linesメソッド][]、オファーには[account_offersメソッド][]があります。これらのメソッドは、一般的なユースケースにより適した、処理済みのデータを提供します。専用のメソッドがない種類のレジャーエントリを取得したい場合や、エントリを正規のフォーマットで取得したい場合は、`account_objects`を使用してください。


## リクエストのフォーマット
リクエストのフォーマットの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": "example_account_objects",
  "command": "account_objects",
  "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
  "ledger_index": "validated",
  "type": "state",
  "deletion_blockers_only": false,
  "limit": 10
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "account_objects",
    "params": [
        {
            "account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
            "ledger_index": "validated",
            "type": "state",
            "deletion_blockers_only": false,
            "limit": 10
        }
    ]
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
#Syntax: account_objects <account> [<ledger>]
xrpld account_objects r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59 validated
```
{% /tab %}

{% /tabs %}

{% try-it method="account_objects" /%}

リクエストには以下のパラメーターが含まれます。

| フィールド                 | 型                     | 必須？ | 説明 |
|:-------------------------|:-----------------------|:------|:-----|
| `account`                | 文字列 - [アドレス][]     | はい   | このアカウントに関連付けられたレジャーエントリを取得します。 |
| `deletion_blockers_only` | 真偽値                  | いいえ | `true`の場合、このアカウントの[削除](../../../../concepts/accounts/deleting-accounts.md)をブロックするレジャーエントリのみを返します。デフォルトは`false`です。 |
| `ledger_hash`            | [ハッシュ][]             | いいえ | 使用するレジャーバージョンの一意のハッシュ。（[レジャーの指定][]を参照してください） |
| `ledger_index`           | [レジャーインデックス][]   | いいえ | 使用するレジャーの[レジャーインデックス][]、またはレジャーを自動的に選択するためのショートカット文字列。（[レジャーの指定][]を参照してください） |
| `limit`                  | 数値                    | いいえ | 結果に含めるレジャーエントリの最大数。管理者以外の接続では、`10`以上`400`以下の範囲で指定する必要があります。デフォルトは`200`です。 |
| `marker`                 | [マーカー][Marker]       | いいえ | 以前のページネーションされたレスポンスの値。そのレスポンスが中断したところからデータの取得を再開します。 |
| `sponsored`              | 真偽値                  | いいえ | `true`の場合、スポンサー付きのレジャーエントリ（`Sponsor`、`HighSponsor`、`LowSponsor`のいずれかのフィールドを持つエントリ）のみを返します。`false`の場合、スポンサー付きでないエントリのみを返します。省略した場合は、スポンサーの有無にかかわらずエントリを返します。{% amendment-disclaimer name="Sponsor" /%} |
| `type`                   | 文字列                  | いいえ | 結果を特定の種類のレジャーエントリに絞り込みます。このフィールドには、[レジャーエントリタイプ](../../../protocol/ledger-data/ledger-entry-types/index.md)の正規の名前（大文字と小文字は区別されません）または[短縮名](../../api-conventions/ledger-entry-short-names.md)を指定できます。所有者ディレクトリに含まれることのないレジャーエントリタイプは指定できません。省略した場合は、すべての種類のレジャーエントリを返します。 |

{% admonition type="info" name="注記" %}`account_objects`コマンドのコマンドラインインターフェイスは`type`フィールドを受け付けません。代わりに[jsonメソッド][]を使用して、コマンドラインからJSON-RPC形式のリクエストを送信してください。{% /admonition %}

## レスポンスのフォーマット

処理が成功したレスポンスの例:

{% tabs %}

{% tab label="WebSocket" %}
{% code-snippet file="/_api-examples/account_objects/ws-response.json" language="json" /%}
{% /tab %}

{% tab label="JSON-RPC" %}
{% code-snippet file="/_api-examples/account_objects/jsonrpc-response.json" language="json" prefix="200 OK\n\n" /%}
{% /tab %}

{% tab label="コマンドライン" %}
{% code-snippet file="/_api-examples/account_objects/jsonrpc-response.json" language="json" prefix="Loading: \"/etc/xrpld/xrpld.cfg\"\n2025-Aug-14 19:51:30.882061715 UTC HTTPClient:NFO Connecting to 127.0.0.1:5005\n\n" /%}
{% /tab %}

{% /tabs %}

このレスポンスは[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれます。

| フィールド               | 型                          | 説明 |
|:-----------------------|:----------------------------|:-----|
| `account`              | 文字列 - [アドレス][]          | このリクエストに対応するアカウント。 |
| `account_objects`      | 配列                         | このアカウントの所有者ディレクトリにあるレジャーエントリの配列。これには、このアカウントが所有するエントリと、このアカウントにリンクされているものの他のアカウントが所有するエントリ（このアカウントが宛先であるエスクローなど）が含まれます。各要素は、生の[レジャーフォーマット][]のレジャーエントリです。`limit`フィールドで指定した最大数よりも少ない数のエントリが含まれる場合があります。 |
| `ledger_hash`          | 文字列                       | _（省略される場合があります）_ このレスポンスの生成に使用されたレジャーの識別用ハッシュ。 |
| `ledger_index`         | 数値 - [レジャーインデックス][] | _（省略される場合があります）_ このレスポンスの生成に使用されたレジャーのレジャーインデックス。 |
| `ledger_current_index` | 数値 - [レジャーインデックス][] | _（省略される場合があります）_ このレスポンスの生成に使用されたオープンレジャーのレジャーインデックス。 |
| `limit`                | 数値                         | _（省略される場合があります）_ このリクエストで使用された上限（指定されている場合）。 |
| `marker`               | [マーカー][Marker]            | _（省略される場合があります）_ レスポンスがページネーションされていることを示す、サーバが定義した値。この値を次の呼び出しに渡すと、この呼び出しが終わったところから再開します。この後に追加のページがない場合は省略されます。 |
| `validated`            | 真偽値                       | _（省略される場合があります）_ `true`の場合、このレスポンスの情報は検証済みのレジャーバージョンから取得されています。それ以外の場合、情報は変更される可能性があります。 |

{% admonition type="warning" name="注意" %}
取得するレジャーエントリがまだ残っている場合でも、`account_objects`の配列が空になることがあります。これは、`type`を使用してレジャーエントリタイプを絞り込んでいる場合に特によく起こります。レスポンスに`marker`フィールドが含まれている場合は、データの続きのページがあります。レスポンスに`marker`が含まれていない場合は、これがデータの最後です。この動作は、APIメソッドがアカウントの所有者ディレクトリを順にたどる方法によるもので、リクエストがサーバに過度な負荷をかけないようにするための予防措置でもあります。
{% /admonition %}

## 考えられるエラー

* いずれかの[汎用エラータイプ][]。
* `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。
* `actNotFound` - リクエストの`account`フィールドに指定されている[アドレス][]が、レジャーのアカウントに対応していません。
* `lgrNotFound` - `ledger_hash`または`ledger_index`で指定したレジャーが存在しないか、存在してはいるもののサーバが保有していません。

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
