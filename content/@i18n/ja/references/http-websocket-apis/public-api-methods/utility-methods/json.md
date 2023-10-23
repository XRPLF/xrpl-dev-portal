---
html: json.html
parent: utility-methods.html
blurb: コマンドのパラメーターをJSON値として受け入れ、他のコマンドを実行します。
labels:
  - コアサーバー
---
# json

`json`メソッドは、プロキシとして他のコマンドを実行し、コマンドのパラメーターをJSON値として受け入れます。これは*コマンドラインクライアント専用*であり、パラメーターを指定するコマンドライン構文が不十分であるかまたは望ましくない場合に使用されるものです。

## 要求フォーマット
要求フォーマットの例:

<!-- MULTICODE_BLOCK_START -->

*コマンドライン*

```sh
# Syntax: json method json_stanza
rippled -q json ledger_closed '{}'
```

<!-- MULTICODE_BLOCK_END -->

## 応答フォーマット

処理が成功した応答の例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "result" :{
     "ledger_hash" :"8047C3ECF1FA66326C1E57694F6814A1C32867C04D3D68A851367EE2F89BBEF3",
     "ledger_index" :390308,
     "status" :"success"
  }
}
```

<!-- MULTICODE_BLOCK_END -->

応答は[標準フォーマット][]に従っており、実行されたコマンドのタイプに対して適切なフィールドが含まれています。


{% include '_snippets/rippled_versions.md' %}
{% include '_snippets/rippled-api-links.md' %}
