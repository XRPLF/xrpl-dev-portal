---
html: configure-amendment-voting.html
parent: configure-rippled.html
seo:
    description: プロトコル修正に伴うサーバの投票を設定する。
labels:
  - コアサーバ
  - ブロックチェーン
---
# Amendment投票機能の設定

バリデータとして設定されたサーバは、[feature メソッド][]を使ってXRP Ledgerプロトコルの[Amendment](../../concepts/networks-and-servers/amendments.md)に投票することができます。(この方法には[管理者アクセス](../../tutorials/http-websocket-apis/build-apps/get-started.md#管理者アクセス権限)が必要です).

例えば、「SHAMapV2」Amendmentに反対票を投じるには、以下のコマンドを実行します。

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": "any_id_here",
  "command": "feature",
  "feature": "SHAMapV2",
  "vetoed": true
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "feature",
    "params": [
        {
            "feature": "SHAMapV2",
            "vetoed": true
        }
    ]
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
rippled feature SHAMapV2 reject
```
{% /tab %}

{% /tabs %}

**注記:** Amendmentの省略名は大文字と小文字が区別されます。また、AmendmentのIDを16進数で指定することもできますが、この場合は大文字と小文字が区別されません。

## 設定ファイルを使用する

もし、Amendmentの設定に設定ファイルを使いたい場合は、`[rpc_startup]` 節に行を追加して、起動時に各明示票のために自動的にコマンドを実行させることができます。例えば

```
[rpc_startup]
{ "command": "feature", "feature": "SHAMapV2", "vetoed": true }
```

変更を有効にするには、必ずサーバを再起動してください。

**注意事項:** `[rpc_startup]` 節にあるコマンドは、サーバが起動するたびに実行され、サーバが動作している間に構成された投票設定を上書きすることができます。

## 関連項目

- [Amendment](../../concepts/networks-and-servers/amendments.md)
    - [既知のAmendment](/resources/known-amendments.md)
- [feature メソッド][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
