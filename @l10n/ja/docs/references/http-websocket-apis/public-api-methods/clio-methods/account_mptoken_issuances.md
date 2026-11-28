---
seo:
    description: 指定したレジャーの時点で、特定のアカウントが作成したMPTokenIssuanceを取得します。
labels:
  - アカウント
  - Multi-Purpose Token, MPT
---

# account_mptoken_issuances

[[ソース]](https://github.com/XRPLF/clio/blob/develop/src/rpc/handlers/AccountMPTokenIssuances.cpp "ソース")

`account_mptoken_issuances`メソッドは、アカウントが作成した[MPT](../../../../concepts/tokens/fungible-tokens/multi-purpose-tokens.md)の発行に関する情報を返します。このメソッドは大きなデータセットを返す可能性があるため、[ページネーション][Marker]を実装する必要があると考えてください。{% badge href="https://github.com/XRPLF/clio/releases/tag/2.7.0" %}新規: Clio v2.7.0{% /badge %}

このメソッドはClioでのみ利用でき、`xrpld`では利用できません。

## リクエストのフォーマット

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "command": "account_mptoken_issuances",
  "account": "rExB3uFDE92wKYP6vfjt31Lbi6tXpFobUT",
  "ledger_index": "validated"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
  "method": "account_mptoken_issuances",
  "params": [
    {
      "account": "rExB3uFDE92wKYP6vfjt31Lbi6tXpFobUT",
      "ledger_index": "validated"
    }
  ]
}
```
{% /tab %}

{% /tabs %}

{% try-it method="account_mptoken_issuances" /%}

リクエストには以下のパラメーターが含まれます。

| フィールド       | 型                       | 必須？ | 説明 |
|:---------------|:-------------------------|:------|:-----|
| `account`      | 文字列 - [アドレス][]       | はい   | このアカウントが作成したMPTの発行を検索します。 |
| `ledger_index` | [レジャーインデックス][]     | いいえ | 使用するレジャーバージョンの[レジャーインデックス][]、またはレジャーを自動的に選択するためのショートカット文字列。[レジャーの指定][]を参照してください。 |
| `ledger_hash`  | 文字列                    | いいえ | 使用するレジャーバージョンを示す32バイトの16進文字列。[レジャーの指定][]を参照してください。 |
| `marker`       | [マーカー][Marker]         | いいえ | ページネーションで、以前のクエリが中断したところから続けるために使用します。 |
| `limit`        | 数値（正の整数）            | いいえ | 返されるMPTの発行の数の上限。10以上400以下の範囲で指定する必要があります。この範囲外の正の値は、最も近い有効な値に置き換えられます。デフォルトは200です。 |

## レスポンスのフォーマット

{% tabs %}
{% tab label="WebSocket" %}
{% code-snippet file="/_api-examples/account_mptoken_issuances/ws-response.json" language="json" /%}
{% /tab %}

{% tab label="JSON-RPC" %}
{% code-snippet file="/_api-examples/account_mptoken_issuances/jsonrpc-response.json" language="json" prefix="200 OK\n\n" /%}
{% /tab %}

{% /tabs %}

このレスポンスは[標準フォーマット][]に従っており、結果に次のフィールドが含まれます。

| フィールド        | 型                    | 説明 |
|:----------------|:----------------------|:-----|
| `account`       | 文字列                 | MPTの発行を検索したアカウント。 |
| `mpt_issuances` | 配列                   | アカウントが作成した[MPT Issuanceオブジェクト](#mpt-issuanceオブジェクト)の配列。 |
| `marker`        | [マーカー][Marker]      | ページネーションで、クエリを中断したところから続けるために使用します。この結果の後にエントリがない場合は省略されます。 |
| `limit`         | 数値                   | リクエストで指定された上限。 |
| `ledger_hash`   | 文字列                 | このレスポンスの生成に使用されたレジャーバージョンのハッシュ。 |
| `ledger_index`  | [レジャーインデックス][] | このレスポンスの生成に使用されたレジャーバージョンのインデックス。 |
| `validated`     | 真偽値                 | `true`の場合、このレジャーはコンセンサスプロセスによって検証済みで、変更されることはありません。それ以外の場合、レジャーの内容は確定しておらず、変更される可能性があります。Clioは検証済みのレジャーデータを保存して返すため、Clioではこの値は _常に_ `true`です。 |

### MPT Issuanceオブジェクト

各MPT Issuanceオブジェクトには次のフィールドがあります。 _（省略される場合があります）_ と記されたフィールドは、意味のある（デフォルト以外の）値を持つ場合にのみ含まれます。

| フィールド             | 型     | 説明 |
|:---------------------|:-------|:-----|
| `mpt_issuance_id`    | 文字列  | この発行の`MPTokenIssuanceID`。 |
| `issuer`             | 文字列  | この発行を作成したアカウント。 |
| `sequence`           | 数値    | この発行を作成したトランザクションのシーケンス番号。 |
| `transfer_fee`       | 数値    | _（省略される場合があります）_ この発行のトークンが発行者以外のアカウント間で送金されるときに請求される手数料（1/100,000単位）。この発行が送金手数料を請求しない場合は省略されます。 |
| `asset_scale`        | 数値    | _（省略される場合があります）_ このトークンの額を表すために使用する小数点以下の桁数。 |
| `maximum_amount`     | 数値    | _（省略される場合があります）_ この`MPTokenIssuance`で発行できるトークンの最大数。 |
| `outstanding_amount` | 数値    | _（省略される場合があります）_ この発行のトークンのうち、現在すべての保有者が保有している数。 |
| `locked_amount`      | 数値    | _（省略される場合があります）_ この発行のトークンのうち、現在[エスクロー](../../../../concepts/payment-types/escrow.md)に預けられている数。 |
| `mptoken_metadata`   | 文字列  | _（省略される場合があります）_ この発行に関する任意のメタデータ（16進数）。 |
| `domain_id`          | 文字列  | _（省略される場合があります）_ この発行に関連付けられている`PermissionedDomainID`（存在する場合）。 |
| `mpt_locked`         | 真偽値  | _（省略される場合があります）_ この発行のすべての残高が、発行者によってフリーズされています。これは`locked_amount`とは関係ありません。 |
| `mpt_can_lock`       | 真偽値  | _（省略される場合があります）_ 発行者は、個々の残高または発行全体をフリーズできます。 |
| `mpt_require_auth`   | 真偽値  | _（省略される場合があります）_ 個々の保有者がこのトークンを保有するには、事前に発行者から認可を受ける必要があります。 |
| `mpt_can_escrow`     | 真偽値  | _（省略される場合があります）_ 保有者は、このトークンの残高を[エスクロー](../../../../concepts/payment-types/escrow.md)に預けることができます。 |
| `mpt_can_trade`      | 真偽値  | _（省略される場合があります）_ 保有者は、このトークンの残高を[分散型取引所](../../../../concepts/tokens/decentralized-exchange/index.md)で取引できます。 _（[MPTokensV2 amendment](/resources/known-amendments.md#mptokensv2)が必要です。{% not-enabled /%}）_ |
| `mpt_can_transfer`   | 真偽値  | _（省略される場合があります）_ この発行のトークンは、発行者以外のアカウント間で送金できます。 |
| `mpt_can_clawback`   | 真偽値  | _（省略される場合があります）_ 発行者は、保有者からこの発行の[トークンを回収](../../../../concepts/tokens/fungible-tokens/clawing-back-tokens.md)できます。 |

## 考えられるエラー

- いずれかの[汎用エラータイプ][]。
- `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。
- `actMalformed` - リクエストの`account`フィールドに指定されている[アドレス][]が、有効なアカウントアドレスではありません。
- `actNotFound` - リクエストの`account`フィールドに指定されている[アドレス][]が、レジャーのアカウントに対応していません。
- `lgrNotFound` - `ledger_hash`または`ledger_index`で指定したレジャーが存在しないか、存在してはいるもののサーバが保有していません。

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
