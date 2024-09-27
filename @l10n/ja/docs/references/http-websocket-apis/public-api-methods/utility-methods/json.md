---
html: json.html
parent: utility-methods.html
seo:
    description: コマンドのパラメーターをJSON値として受け入れ、他のコマンドを実行します。
labels:
  - コアサーバ
---
# json

`json`メソッドは、プロキシとして他のコマンドを実行し、コマンドのパラメーターをJSON値として受け入れます。これは*コマンドラインクライアント専用*であり、パラメーターを指定するコマンドライン構文が不十分であるかまたは望ましくない場合に使用されるものです。

## リクエストのフォーマット
リクエストのフォーマットの例:

{% tabs %}

{% tab label="コマンドライン" %}
```sh
# Syntax: json method json_stanza
rippled -q json ledger_closed '{}'
```
{% /tab %}

{% /tabs %}

## レスポンスのフォーマット

処理が成功したレスポンスの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "result" :{
     "ledger_hash" :"8047C3ECF1FA66326C1E57694F6814A1C32867C04D3D68A851367EE2F89BBEF3",
     "ledger_index" :390308,
     "status" :"success"
  }
}
```
{% /tab %}

{% /tabs %}

レスポンスは[標準フォーマット][]に従っており、実行されたコマンドのタイプに対して適切なフィールドが含まれています。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
