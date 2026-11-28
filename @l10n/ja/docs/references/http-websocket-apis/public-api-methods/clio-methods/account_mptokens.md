---
seo:
    description: 指定したレジャーの時点で、特定のアカウントが保有しているMPTokenを取得します。
labels:
  - アカウント
  - Multi-Purpose Token, MPT
---

# account_mptokens

[[ソース]](https://github.com/XRPLF/clio/blob/develop/src/rpc/handlers/AccountMPTokens.cpp "ソース")

`account_mptokens`メソッドは、アカウントが保有している[MPT](../../../../concepts/tokens/fungible-tokens/multi-purpose-tokens.md)に関する情報を、その残高も含めて返します。このメソッドは大きなデータセットを返す可能性があるため、[ページネーション][Marker]を実装する必要があると考えてください。{% badge href="https://github.com/XRPLF/clio/releases/tag/2.7.0" %}新規: Clio v2.7.0{% /badge %}

このメソッドはClioでのみ利用でき、`xrpld`では利用できません。

## リクエストのフォーマット

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "command": "account_mptokens",
  "account": "rLEw4taUYTNLs3ZCv3vyXGmct8PagQ9GcF",
  "ledger_index": "validated"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
  "method": "account_mptokens",
  "params": [
    {
      "account": "rLEw4taUYTNLs3ZCv3vyXGmct8PagQ9GcF",
      "ledger_index": "validated"
    }
  ]
}
```
{% /tab %}

{% /tabs %}

{% try-it method="account_mptokens" /%}

リクエストには以下のパラメーターが含まれます。

| フィールド       | 型                       | 必須？ | 説明 |
|:---------------|:-------------------------|:------|:-----|
| `account`      | 文字列 - [アドレス][]       | はい   | このアカウントが保有しているMPTを検索します。 |
| `ledger_index` | [レジャーインデックス][]     | いいえ | 使用するレジャーの[レジャーインデックス][]、またはレジャーを自動的に選択するためのショートカット文字列。[レジャーの指定][]を参照してください。 |
| `ledger_hash`  | 文字列                    | いいえ | 使用するレジャーバージョンを示す32バイトの16進文字列。[レジャーの指定][]を参照してください。 |
| `marker`       | [マーカー][Marker]         | いいえ | ページネーションで、以前のクエリが中断したところから続けるために使用します。 |
| `limit`        | 数値（正の整数）            | いいえ | 返されるMPTの数の上限。10以上400以下の範囲で指定する必要があります。この範囲外の正の値は、最も近い有効な値に置き換えられます。デフォルトは200です。 |

## レスポンスのフォーマット

{% tabs %}
{% tab label="WebSocket" %}
{% code-snippet file="/_api-examples/account_mptokens/ws-response.json" language="json" /%}
{% /tab %}

{% tab label="JSON-RPC" %}
{% code-snippet file="/_api-examples/account_mptokens/jsonrpc-response.json" language="json" prefix="200 OK\n\n" /%}
{% /tab %}

{% /tabs %}

このレスポンスは[標準フォーマット][]に従っており、結果に次のフィールドが含まれます。

| フィールド       | 型                    | 説明 |
|:---------------|:----------------------|:-----|
| `account`      | [アドレス][]           | MPTokenを検索したアカウント。 |
| `mptokens`     | 配列                   | アカウントが保有している[MPTオブジェクト](#mptオブジェクト)の配列。 |
| `marker`       | [マーカー][Marker]      | ページネーションで、クエリを中断したところから続けるために使用します。この結果の後にエントリがない場合は省略されます。 |
| `limit`        | 数値                   | リクエストで指定された上限。 |
| `ledger_hash`  | [ハッシュ][]           | このレスポンスの生成に使用されたレジャーバージョンのハッシュ。 |
| `ledger_index` | [レジャーインデックス][] | このレスポンスの生成に使用されたレジャーバージョンのインデックス。 |
| `validated`    | 真偽値                 | `true`の場合、このレジャーはコンセンサスプロセスによって検証済みで、変更されることはありません。それ以外の場合、レジャーの内容は確定しておらず、変更される可能性があります。Clioは検証済みのレジャーデータを保存して返すため、Clioではこの値は _常に_ `true`です。 |

### MPTオブジェクト

各MPTオブジェクトには次のフィールドがあります。

| フィールド          | 型            | 説明 |
|:------------------|:--------------|:-----|
| `mpt_id`          | 文字列         | このMPTに対応する`MPToken`レジャーエントリの[レジャーエントリID](../../../protocol/ledger-data/common-fields.md#ledger-entry-id)。 |
| `account`         | [アドレス][]   | このMPTの保有者。 |
| `mpt_issuance_id` | 文字列         | この`MPToken`が関連付けられている[MPTokenIssuanceエントリ][]の192ビットの`MPTokenIssuanceID`（16進数）。 |
| `mpt_amount`      | 数値           | この発行について、アカウントが現在保有しているトークンの額。 |
| `locked_amount`   | 数値           | _（省略される場合があります）_ 現在[エスクロー](../../../../concepts/payment-types/escrow.md)に預けられているトークンの額。`MPToken`にエスクローされた残高がない場合は省略されます。 |
| `mpt_locked`      | 真偽値         | _（省略される場合があります）_ `true`の場合、発行者がこのトークンの保有者の残高をフリーズしているため、保有者はトークンを送信できません。これは`locked_amount`とは関係ありません。フリーズされていない場合は省略されます。 |
| `mpt_authorized`  | 真偽値         | _（省略される場合があります）_ `true`の場合、保有者はこのトークンの保有を認可されています。認可されていない場合は省略されます。 |

## 考えられるエラー

- いずれかの[汎用エラータイプ][]。
- `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。
- `actMalformed` - リクエストの`account`フィールドに指定されている[アドレス][]が、有効なアカウントアドレスではありません。
- `actNotFound` - リクエストの`account`フィールドに指定されている[アドレス][]が、レジャーのアカウントに対応していません。
- `lgrNotFound` - `ledger_hash`または`ledger_index`で指定したレジャーが存在しないか、存在してはいるもののサーバが保有していません。

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
