# 送金元に基づくCheckの検索

_[Checks Amendment][]が必要です。_

このチュートリアルでは、[Check](checks.html)をその送金元で検索する方法を説明します。[Checkを受取人で検索する](look-up-checks-by-recipient.html)こともできます。

## 1. 特定のアドレスのすべてのCheckの検索

<!--{# TODO: Update if https://github.com/ripple/rippled/issues/2443 gets done #}-->

特定のアドレスで受信および送信されるすべてのCheckのリストを取得するには、送金元アカウントのアドレスを指定した`account_objects`コマンドを実行し、要求の`type` フィールドを`checks`に設定します。

**注記:**`account_objects`コマンドのコマンドラインインターフェイスでは`type`フィールドは受け入れられません。代わりに[jsonメソッド][]を使用してコマンドラインからJSON-RPCフォーマットの要求を送信できます。

**注意:** RippleAPIには、`account_objects`メソッドの組み込みサポートはありません。`api.connection.request(websocket_request_json)`メソッドを使用して、Webフォーマットで未加工の要求を作成できます。このメソッドに対する応答のフォーマットは`rippled` APIフォーマットです。（たとえばXRPは小数ではなく整数の「drop数」で指定します。）

### 要求の例

<!-- MULTICODE_BLOCK_START -->

*RippleAPI*

```js
{% include '_code-samples/checks/js/getChecks.js' %}
```

*JSON-RPC*

```json
{% include '_code-samples/checks/json-rpc/account_objects-req.json' %}
```

<!-- MULTICODE_BLOCK_END -->

### 応答の例

<!-- MULTICODE_BLOCK_START -->

*RippleAPI*

```
{% include '_code-samples/checks/js/get-checks-resp.txt' %}
```

*JSON-RPC*

```json
200 OK

{% include '_code-samples/checks/json-rpc/account_objects-resp.json' %}
```

<!-- MULTICODE_BLOCK_END -->

## 2. 送金元に基づく応答の絞り込み

応答には、要求のアカウントが送金元であるCheckと、アカウントが受取人であるCheckが含まれていることがあります。応答の`account_objects`配列の各メンバーは1つのCheckを表します。これらの各Checkオブジェクトでは、`Account`のアドレスはそのCheckの送金元のアドレスです。

以下の疑似コードに、送金元で応答を絞り込む方法を示します。

```js
sender_address = "rBXsgNkPcDN2runsvWmwxk3Lh97zdgo9za"
account_objects_response = get_account_objects({
   account: sender_address,
   ledger_index: "validated",
   type: "check"
})

for (i=0; i < account_objects_response.account_objects.length; i++) {
 check_object = account_objects_response.account_objects[i]
 if (check_object.Account == sender_address) {
   log("Check from sender:", check_object)
 }
}
```

<!--{# common links #}-->
[RippleAPI]: rippleapi-reference.html
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled-api-links.md' %}
