---
seo:
    description: オーダーブック情報の変更をサブスクライブします。
labels:
  - 分散型取引所
  - クロスカレンシー
---
# book_changes
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/BookChanges.h "ソース")

{% code-page-name /%} メソッドは、[分散型取引所（DEX）](../../../../concepts/tokens/decentralized-exchange/index.md) のオーダーブックの変更に関する情報を、以前のレジャーバージョンと比較して提供します。これは「ローソク足」チャートの作成に役立つ場合があります。

### リクエストのフォーマット

リクエストの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "id": "example_book_changes",
    "command": "{% $frontmatter.seo.title %}",
    "ledger_index": 88530953
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "{% $frontmatter.seo.title %}",
    "params": [{
      "ledger_index": 88530953
    }]
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
#Syntax: book_changes [<ledger hash|id>]
rippled book_changes 88530953
```
{% /tab %}

{% /tabs %}

{% try-it method="book_changes" /%}

リクエストには以下のパラメーターが含まれます。

| フィールド     | 型                       | 必須?  | 説明 |
|:---------------|:-------------------------|:-------|------|
| `ledger_hash`  | [ハッシュ][]             | いいえ | 使用するレジャーバージョンの32バイトの16進文字列。(詳しくは[レジャーの指定][]をご覧ください。) |
| `ledger_index` | [レジャーインデックス][] | いいえ | 使用するレジャーの[レジャーインデックス][]、または自動的にレジャーを選択するためのショートカット文字列。([レジャーの指定][]) |

{% admonition type="warning" name="既知の問題" %}
`rippled`のこのメソッドにいくつかの既知の問題があります。

- デフォルトまたはショートカット文字列を使用する代わりに、`ledger_index`または`ledger_hash`を明示的に指定する必要があります。([Issue #5034](https://github.com/XRPLF/rippled/issues/5034))
- JSON-RPC APIのレスポンスは、検証済みのレジャーをクエリする場合でも`validated`フィールドが欠落する可能性があります。([#5035](https://github.com/XRPLF/rippled/issues/5035))
- 最近閉じたレジャーをクエリする場合、成功したレスポンスが意図したデータの代わりにレジャーリクエストオブジェクトを返すことがあります。([#5033](https://github.com/XRPLF/rippled/issues/5033))
- 古いレジャーからデータをクエリする場合、サーバーが長時間（30秒以上）応答しない可能性があります。([#5036](https://github.com/XRPLF/rippled/issues/5036))

これらのバグはClioサーバーには適用されません。
{% /admonition %}

## レスポンスのフォーマット

成功したレスポンスの例:

{% tabs %}

{% tab label="WebSocket" %}
{% code-snippet file="/_api-examples/book_changes/ws-response.json" language="json" /%}
{% /tab %}

{% tab label="JSON-RPC" %}
{% code-snippet file="/_api-examples/book_changes/jsonrpc-response.json" language="json" prefix="200 OK\n\n" /%}
{% /tab %}

{% tab label="コマンドライン" %}
{% code-snippet file="/_api-examples/book_changes/jsonrpc-response.json" language="json" prefix="Loading: \"/etc/opt/ripple/rippled.cfg\"\n2024-Jun-07 18:41:45.257772761 UTC HTTPClient:NFO Connecting to 127.0.0.1:5005\n\n" /%}
{% /tab %}

{% /tabs %}

このレスポンスは[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれます。

| フィールド     | 型                       | 説明             |
|:---------------|:-------------------------|:-----------------|
| `changes`      | 配列                     | このレジャーバージョンで更新された各オーダーブックの[Book Updateオブジェクト](#book-updateオブジェクト)のリスト。オーダーブックが更新されなかった場合、配列は空になります。 |
| `ledger_hash`  | [ハッシュ][]             | このデータを取得する際に使用されたレジャーバージョンの識別ハッシュ。 |
| `ledger_index` | [レジャーインデックス][] | このデータを取得する際に使用されたレジャーバージョンのレジャーインデックス。 |
| `ledger_time`  | 数値                     | このデータを取得する際に使用されたレジャーバージョンの公式クローズ時間。[リップルエポックからの秒数][]で表されます。 |
| `type`         | 文字列                   | 文字列`bookChanges`。これはオーダーブック更新メッセージであることを示します。 |
| `validated`    | 真偽値                    | _(省略可)_ `true`の場合、検証済みのレジャーバージョンから取得されたことを表します。 |

### Book Updateオブジェクト

Book Updateオブジェクトは、1つのレジャーバージョンにおける1つのオーダーブックの変更を表し、次のフィールドを含みます。

| フィールド          | 型             | 説明             |
|:---------------|:-----------------|:------------------------|
| `currency_a`   | 文字列 | オーダーブック内の2つの通貨のうちの最初の通貨の識別子。XRPの場合、これは文字列`XRP_drops`です。[トークン](../../../../concepts/tokens/index.md)の場合、[base58][]で表された発行者のアドレスの後にスラッシュ(`/`)が続き、その後に[通貨コード][]が続きます。これは3文字の標準コードまたは20文字の16進コードになります。 |
| `currency_b`   | 文字列 | オーダーブック内の2つの通貨のうちの2番目の通貨の識別子。これは`currency_a`と同じ形式ですが、`currency_b`はXRPになることはありません。 |
| `volume_a`     | 文字列 - 数値 | このレジャーバージョンでこのオーダーブックの取引を通じて移動した最初の通貨（つまり`currency_a`）の総量、または _取引高_。 |
| `volume_b`     | 文字列 - 数値 | このレジャーバージョンでこのオーダーブックの取引を通じて移動した2番目の通貨（つまり`currency_b`）の取引高。 |
| `high`         | 文字列 - 数値 | このレジャーバージョンでこのオーダーブックの取引を通じてマッチしたすべてのオファーの中で最も高い取引レート。最初の通貨と2番目の通貨の比率として表されます。（つまり、`currency_a : currency_b`。） |
| `low`          | 文字列 - 数値 | このレジャーバージョンでこのオーダーブックの取引を通じてマッチしたすべてのオファーの中で最も低い取引レート。最初の通貨と2番目の通貨の比率として表されます。 |
| `open`         | 文字列 - 数値 | このレジャーバージョンでこのオーダーブックの取引を処理する前のオーダーブックの最初の取引の取引レート。最初の通貨と2番目の通貨の比率として表されます。 |
| `close`        | 文字列 - 数値 | このレジャーバージョンでこのオーダーブックの取引を処理した後のオーダーブックの最初の取引の取引レート。最初の通貨と2番目の通貨の比率として表されます。 |

XRP-トークンのオーダーブックでは、XRPは常に`currency_a`で表されます。トークン-トークンのオーダーブックでは、発行者と通貨コードでアルファベット順に並べ替えられます。

XRPに関する取引レートは常に[XRPのdrop数][]を使用して計算されます。例えば、XRPからFOOへのレートが1.0 XRP に対して 1 FOOの場合、APIによって報告されたレートは`1000000`（1 FOOあたり100万ドロップのXRP）になります。

## 考えられるエラー

* いずれかの[汎用エラータイプ][]。
* `lgrNotFound` - `ledger_hash`または`ledger_index`で指定したレジャーが存在しないか、存在してはいるもののサーバが保有していません。
* `invalidParams` - 1つ以上のフィールドの指定が正しくないか、1つ以上の必須フィールドが指定されていません。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
