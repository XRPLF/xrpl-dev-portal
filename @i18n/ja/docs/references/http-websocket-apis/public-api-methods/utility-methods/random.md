---
html: random.html
parent: utility-methods.html
seo:
    description: クライアントが乱数生成のエントロピー生成源として使用する乱数を提供します。
labels:
  - コアサーバ
---
# random
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/Random.cpp "Source")

`random`コマンドは、クライアントが乱数生成のエントロピー生成源として使用する乱数を提供します。

## リクエストのフォーマット
リクエストのフォーマットの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
   "id":1,
   "command":"random"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
   "method":"random",
   "params":[
       {}
   ]
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
#Syntax: random
rippled random
```
{% /tab %}

{% /tabs %}

リクエストにはパラメーターが含まれていません。

## レスポンスのフォーマット

処理が成功したレスポンスの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
   "id":1,
   "result":{
       "random":"8ED765AEBBD6767603C2C9375B2679AEC76E6A8133EF59F04F9FC1AAA70E41AF"
   },
   "status":"success",
   "type":"response"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
200 OK

{
   "result":{
       "random":"4E57146AA47BC6E88FDFE8BAA235B900126C916B6CC521550996F590487B837A",
       "status":"success"
   }
}
```
{% /tab %}

{% /tabs %}

レスポンスは[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれています。

| `Field`  | 型   | 説明               |
|:---------|:-------|:--------------------------|
| `random` | 文字列 | ランダムな256ビット16進値。 |

## 考えられるエラー

* [汎用エラータイプ][]のすべて。
* `internal` - 乱数生成機能に関連している可能性がある内部エラーが発生しました。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
