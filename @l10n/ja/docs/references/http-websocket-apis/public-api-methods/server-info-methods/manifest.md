---
html: manifest.html
parent: server-info-methods.html
seo:
    description: 既知のバリデータに関する公開情報を調べます。
labels:
  - ブロックチェーン
---
# manifest
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/Manifest.cpp "ソース")

{% code-page-name /%}メソッドは、指定したバリデータ公開鍵の現在の"マニフェスト"情報を報告します。"マニフェスト"は、バリデータのマスターキーペアから署名付きの公開鍵(ephemeral signing key)を認証するためのデータブロックです。{% badge href="https://github.com/XRPLF/rippled/releases/tag/1.7.0" %}更新: rippled 1.7.0{% /badge %}.


### リクエストのフォーマット

リクエストのフォーマットの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "command": "{% $frontmatter.seo.title %}",
    "public_key": "nHUFE9prPXPrHcG3SkwP1UzAQbSphqyQkQK9ATXLZsfkezhhda3p"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "{% $frontmatter.seo.title %}",
    "params": [{
        "public_key":"nHUFE9prPXPrHcG3SkwP1UzAQbSphqyQkQK9ATXLZsfkezhhda3p"
    }]
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
#Syntax: {% $frontmatter.seo.title %} public_key
rippled {% $frontmatter.seo.title %} nHUFE9prPXPrHcG3SkwP1UzAQbSphqyQkQK9ATXLZsfkezhhda3p
```
{% /tab %}

{% /tabs %}

リクエストには以下のパラメータが含まれます。

| `Field`      | 型   　| 説明                               |
|:-------------|:------|:-----------------------------------|
| `public_key` | 文字列 | 検索するバリデータの[base58][]エンコードされた公開鍵。マスター公開鍵あるいはエフェメラル公開鍵を指定します。 |


### レスポンスのフォーマット

成功したレスポンスの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "result": {
    "details": {
      "domain": "",
      "ephemeral_key": "n9J67zk4B7GpbQV5jRQntbgdKf7TW6894QuG7qq1rE5gvjCu6snA",
      "master_key": "nHUFE9prPXPrHcG3SkwP1UzAQbSphqyQkQK9ATXLZsfkezhhda3p",
      "seq": 1
    },
    "manifest": "JAAAAAFxIe3AkJgOyqs3y+UuiAI27Ff3Mrfbt8e7mjdo06bnGEp5XnMhAhRmvCZmWZXlwShVE9qXs2AVCvhVuA/WGYkTX/vVGBGwdkYwRAIgGnYpIGufURojN2cTXakAM7Vwa0GR7o3osdVlZShroXQCIH9R/Lx1v9rdb4YY2n5nrxdnhSSof3U6V/wIHJmeao5ucBJA9D1iAMo7YFCpb245N3Czc0L1R2Xac0YwQ6XdGT+cZ7yw2n8JbdC3hH8Xu9OUqc867Ee6JmlXtyDHzBdY/hdJCQ==",
    "requested": "nHUFE9prPXPrHcG3SkwP1UzAQbSphqyQkQK9ATXLZsfkezhhda3p"
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
    "details": {
      "domain": "",
      "ephemeral_key": "n9J67zk4B7GpbQV5jRQntbgdKf7TW6894QuG7qq1rE5gvjCu6snA",
      "master_key": "nHUFE9prPXPrHcG3SkwP1UzAQbSphqyQkQK9ATXLZsfkezhhda3p",
      "seq": 1
    },
    "manifest": "JAAAAAFxIe3AkJgOyqs3y+UuiAI27Ff3Mrfbt8e7mjdo06bnGEp5XnMhAhRmvCZmWZXlwShVE9qXs2AVCvhVuA/WGYkTX/vVGBGwdkYwRAIgGnYpIGufURojN2cTXakAM7Vwa0GR7o3osdVlZShroXQCIH9R/Lx1v9rdb4YY2n5nrxdnhSSof3U6V/wIHJmeao5ucBJA9D1iAMo7YFCpb245N3Czc0L1R2Xac0YwQ6XdGT+cZ7yw2n8JbdC3hH8Xu9OUqc867Ee6JmlXtyDHzBdY/hdJCQ==",
    "requested": "nHUFE9prPXPrHcG3SkwP1UzAQbSphqyQkQK9ATXLZsfkezhhda3p",
    "status": "success"
  }
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```json
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005

{
  "result": {
    "details": {
      "domain": "",
      "ephemeral_key": "n9J67zk4B7GpbQV5jRQntbgdKf7TW6894QuG7qq1rE5gvjCu6snA",
      "master_key": "nHUFE9prPXPrHcG3SkwP1UzAQbSphqyQkQK9ATXLZsfkezhhda3p",
      "seq": 1
    },
    "manifest": "JAAAAAFxIe3AkJgOyqs3y+UuiAI27Ff3Mrfbt8e7mjdo06bnGEp5XnMhAhRmvCZmWZXlwShVE9qXs2AVCvhVuA/WGYkTX/vVGBGwdkYwRAIgGnYpIGufURojN2cTXakAM7Vwa0GR7o3osdVlZShroXQCIH9R/Lx1v9rdb4YY2n5nrxdnhSSof3U6V/wIHJmeao5ucBJA9D1iAMo7YFCpb245N3Czc0L1R2Xac0YwQ6XdGT+cZ7yw2n8JbdC3hH8Xu9OUqc867Ee6JmlXtyDHzBdY/hdJCQ==",
    "requested": "nHUFE9prPXPrHcG3SkwP1UzAQbSphqyQkQK9ATXLZsfkezhhda3p",
    "status": "success"
  }
}
```
{% /tab %}

{% /tabs %}

<!-- Note, the CLI response above is mocked up to compensate for https://github.com/XRPLF/rippled/issues/3317 -->

レスポンスは[標準フォーマット][]に従い、成功した結果には以下のフィールドが含まれます。

| `Field`     | 型         | 説明                                                   |
|:------------|:-----------|:------------------------------------------------------|
| `details`   | オブジェクト | _(省略される場合があります)_ このマニフェストに含まれるデータ。サーバがリクエストからの`public_key`に対するマニフェストを持っていない場合は省略されます。その内容の完全な説明については、以下の **オブジェクトの詳細** をご覧ください。 |
| `manifest`  | 文字列      | _(省略される場合があります)_ base64形式の完全なマニフェストデータ。このデータは[シリアライズ](../../../protocol/binary-format.md)され、base64エンコードされる前にバイナリになります。サーバがリクエストからの`public_key`に対するマニフェストを持っていない場合は省略されます。 |
| `requested` | 文字列      | リクエストの`public_key`。                               |

#### オブジェクトの詳細

もし指定された場合、`details`オブジェクトは以下のフィールドを含みます。

| `Field`         | 型    | 説明                                       |
|:----------------|:------|:--------------------------------------------------|
| `domain`        | 文字列 | このバリデータが関連していると示すドメイン名。マニフェストにドメインが含まれていない場合、これは空文字列になります。 |
| `ephemeral_key` | 文字列 | このバリデータのエフェメラル公開鍵を、[base58][]で指定します。 |
| `master_key`    | 文字列 | このバリデータのマスター公開鍵を、[base58][]で指定します。 |
| `seq`           | 数値   | このマニフェストのシーケンス番号。この番号は、バリデータのオペレータがバリデータのトークンを更新してエフェメラルキーをローテーションしたり、設定を変更したりするたびに増加します。 |


## 考えられるエラー

* いずれかの[汎用エラータイプ][]。
- `invalidParams` - `public_key`フィールドが見つからないか、正しく指定されていません。
- `reportingUnsupported` - ([レポートモード][]サーバのみ) このメソッドはレポートモードでは使用できません。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
