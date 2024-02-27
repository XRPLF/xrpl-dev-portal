---
html: look-up-checks-by-sender.html
parent: use-checks.html
seo:
    description: 特定のアドレスで送信されるすべてのCheckのリストを取得する。
labels:
  - Checks
---
# 送金元に基づくCheckの検索

_[Checks Amendment][]により追加されました。_

このチュートリアルでは、[Check](../../../../concepts/payment-types/checks.md)をその送金元で検索する方法を説明します。[Checkを受取人で検索する](look-up-checks-by-recipient.md)こともできます。

## 1. 特定のアドレスのすべてのCheckの検索

特定のアドレスで受信および送信されるすべてのCheckのリストを取得するには、送金元アカウントのアドレスを指定した`account_objects`コマンドを実行し、リクエストの`type` フィールドを`checks`に設定します。

**注記:**`account_objects`コマンドのコマンドラインインターフェイスでは`type`フィールドは受け入れられません。代わりに[jsonメソッド][]を使用してコマンドラインからJSON-RPCフォーマットのリクエストを送信できます。

### リクエストの例

{% tabs %}

{% tab label="RippleAPI" %}
{% code-snippet file="/_code-samples/checks/js/getChecks.js" language="js" /%}
{% /tab %}

{% tab label="JSON-RPC" %}
{% code-snippet file="/_code-samples/checks/json-rpc/account_objects-req.json" language="json" /%}
{% /tab %}

{% /tabs %}

### レスポンスの例

{% tabs %}

{% tab label="RippleAPI" %}
{% code-snippet file="/_code-samples/checks/js/get-checks-resp.txt" language="" /%}
{% /tab %}

{% tab label="JSON-RPC" %}
{% code-snippet file="/_code-samples/checks/json-rpc/account_objects-resp.json" language="json" prefix="200 OK\n\n" /%}
{% /tab %}

{% /tabs %}

## 2. 送金元に基づくレスポンスの絞り込み

レスポンスには、リクエストのアカウントが送金元であるCheckと、アカウントが受取人であるCheckが含まれていることがあります。レスポンスの`account_objects`配列の各メンバーは1つのCheckを表します。これらの各Checkオブジェクトでは、`Account`のアドレスはそのCheckの送金元のアドレスです。

以下の疑似コードに、送金元でレスポンスを絞り込む方法を示します。

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

{% raw-partial file="/docs/_snippets/common-links.md" /%}
