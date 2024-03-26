---
html: feature.html
parent: status-and-debugging-methods.html
seo:
    description: Amendmentに関してこのサーバが認識している情報を返します。
labels:
  - ブロックチェーン
  - コアサーバ
---
# feature
[[ソース]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/Feature1.cpp "Source")

`feature`コマンドは、[Amendment](../../../../concepts/networks-and-servers/amendments.md)に関してこのサーバが認識している情報（Amendmentが有効であるかどうか、サーバが[Amendmentプロセス](../../../../concepts/networks-and-servers/amendments.md#amendmentプロセス)でこれらのAmendmentに賛成票を投じたかどうかなど）を返します。{% badge href="https://github.com/XRPLF/rippled/releases/tag/0.31.0" %}新規: rippled 0.31.0{% /badge %}

`feature`コマンドを使用して、Amendmentへの賛成票または反対票を投じるようにサーバを一時的に設定できます。この変更は、サーバの再起動後も保持されます。{% badge href="https://github.com/XRPLF/rippled/releases/tag/1.7.0" %}更新: rippled 1.7.0{% /badge %}

_`feature`メソッドは、権限のないユーザは実行できない[管理メソッド](../index.md)です。_

### リクエストのフォーマット
リクエストのフォーマットの例:

{% tabs %}

{% tab label="WebSocket - すべてリスト" %}
```json
{
 "id": "list_all_features",
 "command": "feature"
}
```
{% /tab %}

{% tab label="WebSocket - 拒否" %}
```json
{
 "id": "reject_multi_sign",
 "command": "feature",
 "feature": "4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373",
 "vetoed": true
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
   "method": "feature",
   "params": [
       {
           "feature": "4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373",
           "vetoed": false
       }
   ]
}
```
{% /tab %}

{% tab label="コマンドライン" %}
```sh
#Syntax: feature [<feature_id> [accept|reject]]
rippled feature 4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373 accept
```
{% /tab %}

{% /tabs %}

リクエストには以下のパラメーターが含まれます。

| `Field`   | 型    | 説明                                            |
|:----------|:--------|:-------------------------------------------------------|
| `feature` | 文字列  | _（省略可）_ Amendmentの一意のID（16進数）またはAmendmentの短い名前。指定されている場合は、レスポンスが1つのAmendmentに限定されます。それ以外の場合はレスポンスにすべてのAmendmentのリストが表示されます。 |
| `vetoed`  | ブール値 | （省略可、`feature`が指定されていない場合は無視されます）trueの場合、サーバに対し`feature`で指定されたAmendmentに反対票を投じるように指示します。falseの場合、サーバに対しAmendmentに賛成票を投じるように指示します。 |

**注記:** サーバが新しいAmendmentの適用方法を現在認識していない場合でも、`feature`フィールドにAmendment IDを指定すれば、新しいAmendmentに賛成票を投じるようにサーバを設定できます。たとえば、Amendmentをサポートする新しい`rippled`バージョンに _確実に_ アップグレードする予定がある場合などにこのように設定できます。

### レスポンスのフォーマット

処理が成功したレスポンスの例:

{% tabs %}

{% tab label="WebSocket - すべてリスト" %}
```json
{
 "id": "list_all_features",
 "status": "success",
 "type": "response",
 "result": {
   "features": {
     "42426C4D4F1009EE67080A9B7965B44656D7714D104A72F9B4369F97ABF044EE": {
       "enabled": false,
       "name": "FeeEscalation",
       "supported": true,
       "vetoed": false
     },
     "4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373": {
       "enabled": false,
       "name": "MultiSign",
       "supported": true,
       "vetoed": false
     },
     "6781F8368C4771B83E8B821D88F580202BCB4228075297B19E4FDC5233F1EFDC": {
       "enabled": false,
       "name": "TrustSetAuth",
       "supported": true,
       "vetoed": false
     },
     "C1B8D934087225F509BEB5A8EC24447854713EE447D277F69545ABFA0E0FD490": {
       "enabled": false,
       "name": "Tickets",
       "supported": true,
       "vetoed": false
     },
     "DA1BD556B42D85EA9C84066D028D355B52416734D3283F85E216EA5DA6DB7E13": {
       "enabled": false,
       "name": "SusPay",
       "supported": true,
       "vetoed": false
     }
   }
 }
}
```
{% /tab %}

{% tab label="WebSocket - 拒否" %}
```json
{
   "id": "reject_multi_sign",
   "status": "success",
   "type": "response",
   "result": {
       "features": {
           "4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373": {
               "enabled": false,
               "name": "MultiSign",
               "supported": true,
               "vetoed": true
           }
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
       "4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373": {
           "enabled": false,
           "name": "MultiSign",
           "supported": true,
           "vetoed": false
       },
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
       "4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373": {
           "enabled": false,
           "name": "MultiSign",
           "supported": true,
           "vetoed": false
       },
       "status": "success"
   }
}
```
{% /tab %}

{% /tabs %}

レスポンスは[標準フォーマット][]に従っており、正常に完了した場合は結果に**Amendmentのマップ**がJSONプロジェクトとして含まれています。オブジェクトのキーはAmendment IDです。各キーの値は、そのIDのAmendmentのステータスを記述した _Amendmentオブジェクト_ です。リクエストに`feature`が指定されいる場合、リクエストによる変更の適用後には、リクエストされたAmendmentオブジェクトだけがマップに含まれます。各Amendmentオブジェクトのフィールドを次に示します。

| `Field`     | 型    | 説明                                          |
|:------------|:--------|:-----------------------------------------------------|
| `enabled`   | ブール値 | 最新レジャーでこのAmendmentが現在有効であるかどうか。 |
| `name`      | 文字列  | （省略される場合があります）このAmendmentの人間が読める形式の名前（判明している場合）。 |
| `supported` | ブール値 | サーバがこのAmendmentの適用方法を認識しているかどうか。このフィールドが`false`（サーバがこのAmendmentの適用方法を認識していない）に設定されており、`enabled`が`true`（このAmendmentが最新レジャーで有効である）に設定されている場合、このAmendmentによりサーバが[Amendmentブロック](../../../../concepts/networks-and-servers/amendments.md#amendment-blocked)される可能性があります。 |
| `vetoed`    | ブール値 または 文字列 | ほとんどのAmendmentにおいて、これはサーバがこのAmendmentに反対票を投じるように指示されているかどうかを示すブール値です。コードの中で廃止とマークされているAmendmentについては、代わりに`Obsolete`という文字列を指定します。{% badge href="https://github.com/XRPLF/rippled/releases/tag/1.11.0" %}更新: rippled 1.11.0{% /badge %}. |

**注意:** Amendmentの`name`は、Amendmentの内容を厳密に示すものではありません。サーバ間でこの名前が一意であることや整合性があることは保証されません。

### 考えられるエラー

* [汎用エラータイプ][]のすべて。
* `badFeature` - 指定されている`feature`のフォーマットが正しくないか、サーバがその名前のAmendmentを認識していません。
- `reportingUnsupported` - ([レポートモード][]サーバのみ) このメソッドはレポートモードでは使用できません。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
