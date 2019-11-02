# random
[[ソース]<br>](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/Random.cpp "Source")

`random`コマンドは、クライアントが乱数生成のエントロピー生成源として使用する乱数を提供します。

## 要求フォーマット
要求フォーマットの例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
   "id":1,
   "command":"random"
}
```

*JSON-RPC*

```
{
   "method":"random",
   "params":[
       {}
   ]
}
```

*コマンドライン*

```
#Syntax: random
rippled random
```

<!-- MULTICODE_BLOCK_END -->

要求にはパラメーターが含まれていません。

## 応答フォーマット

処理が成功した応答の例:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
   "id":1,
   "result":{
       "random":"8ED765AEBBD6767603C2C9375B2679AEC76E6A8133EF59F04F9FC1AAA70E41AF"
   },
   "status":"success",
   "type":"response"
}
```

*JSON-RPC*

```
200 OK
{
   "result":{
       "random":"4E57146AA47BC6E88FDFE8BAA235B900126C916B6CC521550996F590487B837A",
       "status":"success"
   }
}
```

<!-- MULTICODE_BLOCK_END -->

応答は[標準フォーマット][]に従っており、正常に完了した場合は結果に次のフィールドが含まれています。

| `Field`  | 型   | 説明               |
|:---------|:-------|:--------------------------|
| `random` | 文字列 | ランダムな256ビット16進値。 |

## 考えられるエラー

* [汎用エラータイプ][]のすべて。
* `internal` - 乱数生成機能に関連している可能性がある内部エラーが発生しました。

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
