---
html: configure-amendment-voting.html
parent: configure-rippled.html
blurb: プロトコル修正に伴うサーバーの投票を設定する。
labels:
  - コアサーバー
  - ブロックチェーン
---
# Amendment投票機能の設定

バリデーターとして設定されたサーバーは、[feature メソッド][]を使ってXRP Ledgerプロトコルの[Amendment](amendments.html)に投票することができます。(この方法には[管理者アクセス](get-started-using-http-websocket-apis.html#管理者アクセス権限)が必要です).

例えば、「SHAMapV2」Amendmentに反対票を投じるには、以下のコマンドを実行します。

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": "any_id_here",
  "command": "feature",
  "feature": "SHAMapV2",
  "vetoed": true
}
```

*JSON-RPC*

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

*コマンドライン*

```sh
rippled feature SHAMapV2 reject
```

<!-- MULTICODE_BLOCK_END -->

**注記:** Amendmentの省略名は大文字と小文字が区別されます。また、AmendmentのIDを16進数で指定することもできますが、この場合は大文字と小文字が区別されません。

## 設定ファイルを使用する

もし、Amendmentの設定に設定ファイルを使いたい場合は、`[rpc_startup]` 節に行を追加して、起動時に各明示票のために自動的にコマンドを実行させることができます。例えば

```
[rpc_startup]
{ "command": "feature", "feature": "SHAMapV2", "vetoed": true }
```

変更を有効にするには、必ずサーバーを再起動してください。

**注意事項:** `[rpc_startup]` 節にあるコマンドは、サーバが起動するたびに実行され、サーバが動作している間に構成された投票設定を上書きすることができます。

## 関連項目

- [Amendment](amendments.html)
    - [既知のAmendment](known-amendments.html)
- [feature メソッド][]

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
