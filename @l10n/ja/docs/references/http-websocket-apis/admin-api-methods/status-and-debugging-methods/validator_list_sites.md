---
html: validator_list_sites.html
parent: status-and-debugging-methods.html
seo:
    description: バリデータリストを処理するサイトのステータス情報を返します。
labels:
  - ブロックチェーン
  - コアサーバ
---
# validator_list_sites
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/ValidatorListSites.cpp "Source")

`validator_list_sites`コマンドは、バリデータリストを処理するサイトのステータス情報を返します。{% badge href="https://github.com/XRPLF/rippled/releases/tag/0.80.1" %}新規: rippled 0.80.1{% /badge %}

*`validator_list_sites`リクエストは、権限のないユーザは実行できない[管理メソッド](../index.md)です。*

### リクエストのフォーマット
リクエストのフォーマットの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
   "id": 1,
   "command": "validator_list_sites"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
   "method": "validator_list_sites",
   "params": [
       {}
   ]
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
#Syntax: validator_list_sites
rippled validator_list_sites
```
{% /tab %}

{% /tabs %}

リクエストにはパラメーターが含まれていません。

### レスポンスのフォーマット

処理が成功したレスポンスの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
   "id":5,
   "status":"success",
   "type":"response",
   "result": {
       "validator_sites": [
           {
               "last_refresh_status": "accepted",
               "last_refresh_time": "2017-Oct-13 21:26:37",
               "refresh_interval_min": 5,
               "uri": "http://127.0.0.1:51447/validators"
           }
       ]
   }
}
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
200 OK

{
   "result": {
       "status": "success",
       "validator_sites": [
           {
               "last_refresh_status": "accepted",
               "last_refresh_time": "2017-Oct-13 21:26:37",
               "refresh_interval_min": 5,
               "uri": "http://127.0.0.1:51447/validators"
           }
       ]
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
       "status": "success",
       "validator_sites": [
           {
               "last_refresh_status": "accepted",
               "last_refresh_time": "2017-Oct-13 21:26:37",
               "refresh_interval_min": 5,
               "uri": "http://127.0.0.1:51447/validators"
           }
       ]
   }
}
```
{% /tab %}

{% /tabs %}

レスポンスは[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれています。

| `Field`           | 型  | 説明                      |
|:------------------|:------|----------------------------------|
| `validator_sites` | 配列 | バリデータサイトオブジェクトからなる配列。 |

`validator_sites`フィールドの配列の各メンバーは、次のフィールドを有するオブジェクトです。

| `Field`                | 型             | 説明                     |
|:-----------------------|:-----------------|:--------------------------------|
| `last_refresh_status`  | 文字列           | 存在する場合は、サイトの最終更新の[`ListDisposition`](https://github.com/XRPLF/rippled/blob/master/src/ripple/app/misc/ValidatorList.h)です。存在しない場合は、サイトに対するクエリーがまだ成功していません。 |
| `last_refresh_time`    | 文字列           | サイトの最終照会時刻を人間が読み取れる形式で表示します。存在しない場合は、サイトに対するクエリーがまだ成功していません。 |
| `refresh_interval_min` | 符号なし整数 | 更新試行間隔の分数。 |
| `uri`                  | 文字列           | サイトのURI。 |

### 考えられるエラー

* [汎用エラータイプ][]のすべて。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
