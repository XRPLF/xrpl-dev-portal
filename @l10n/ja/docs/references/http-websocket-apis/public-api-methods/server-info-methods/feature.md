---
seo:
    description: プロトコルのAmendmentに関する情報を取得します。
labels:
  - ブロックチェーン
  - コアサーバ
---

# feature

{% source-link path="src/xrpld/rpc/handlers/server_info/Feature.cpp" /%}<br/>

`feature`コマンドは、xrpldサーバが認識している[Amendment](../../../../concepts/networks-and-servers/amendments.md)に関する情報（各Amendmentが有効であるかどうか、サーバがその適用方法を認識しているかどうかなど）を返します。

このページで説明する`feature`はパブリックメソッドです。[管理メソッド版の`feature`](../../admin-api-methods/status-and-debugging-methods/feature.md)と同じフォーマットに従いますが、機密情報が含まれる可能性のあるデータは表示されません。

{% badge href="https://github.com/XRPLF/rippled/releases/tag/2.2.0" %}新規: rippled 2.2.0{% /badge %}

## リクエストのフォーマット

リクエストのフォーマットの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "command": "feature",
  "feature": "4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "feature",
    "params": [
        {
            "feature": "4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373"
        }
    ]
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
#Syntax: feature [<feature_id>]
xrpld feature 4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373
```
{% /tab %}

{% /tabs %}

{% try-it method="feature" /%}

リクエストには以下のパラメーターが含まれます。

| `Field`   | 型      | 説明                                                   |
|:----------|:--------|:-------------------------------------------------------|
| `feature` | 文字列  | _（省略可）_ Amendmentの一意のID（16進数）、またはAmendmentの短縮名。指定した場合、レスポンスは1つのAmendmentに限定されます。指定しない場合、レスポンスにはすべてのAmendmentが列挙されます。 |

## レスポンスのフォーマット

処理が成功したレスポンスの例:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "result": {
    "4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373": {
      "enabled": false,
      "name": "MultiSign",
      "supported": true
    }
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
        "4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373": {
            "enabled": false,
            "name": "MultiSign",
            "supported": true
        },
        "status": "success"
    }
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```json
Loading: "/etc/xrpld.cfg"
Connecting to 127.0.0.1:5005

{
    "result": {
        "4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373": {
            "enabled": false,
            "name": "MultiSign",
            "supported": true
        },
        "status": "success"
    }
}
```
{% /tab %}

{% /tabs %}

レスポンスは[標準フォーマット][]に従っており、正常に完了した場合は結果に**Amendmentのマップ**がJSONオブジェクトとして含まれています。オブジェクトのキーはAmendment IDです。各キーの値は、そのIDのAmendmentのステータスを記述した _Amendmentオブジェクト_ です。リクエストに`feature`が指定されている場合、リクエストによる変更の適用後には、リクエストされたAmendmentオブジェクトだけがマップに含まれます。各Amendmentオブジェクトのフィールドを次に示します。

| `Field`     | 型       | 説明                                                 |
|:------------|:---------|:-----------------------------------------------------|
| `enabled`   | ブール値 | 最新レジャーでこのAmendmentが現在有効であるかどうか。 |
| `name`      | 文字列   | （省略される場合があります）このAmendmentの人間が読める形式の名前（判明している場合）。 |
| `supported` | ブール値 | サーバがこのAmendmentの適用方法を認識しているかどうか。このフィールドが`false`（サーバがこのAmendmentの適用方法を認識していない）に設定されており、`enabled`が`true`（このAmendmentが最新レジャーで有効である）に設定されている場合、このAmendmentによりサーバが[Amendmentブロック](../../../../concepts/networks-and-servers/amendments.md#amendment-blocked)される可能性があります。 |

{% admonition type="warning" name="注意" %}Amendmentの`name`は、Amendmentの内容を厳密に示すものではありません。サーバ間でこの名前が一意であることや整合性があることは保証されません。{% /admonition %}

## 考えられるエラー

- いずれかの[汎用エラータイプ][]。
- `badFeature` - 指定されている`feature`のフォーマットが正しくないか、サーバがその名前のAmendmentを認識していません。
- `noPermission` - サーバには、指定されたコマンドを実行する権限がありません。たとえば、`vetoed`リクエストパラメーターのような、許可されていない管理者専用フィールドがリクエストに含まれている場合に発生します。

{% raw-partial file="/@l10n/ja/docs/_snippets/common-links.md" /%}
