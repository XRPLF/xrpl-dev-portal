---
html: cancel-a-check.html
parent: use-checks.html
seo:
    description: 送金を行わずにCheckを取り消す。
labels:
  - Checks
---
# Checkの取消し

_[Checks Amendment][]により追加されました。_

このチュートリアルでは、[Check](../../../../concepts/payment-types/checks.md)を取り消す手順を説明します。この手順を実行すると、送金を行わずに[レジャーのCheckオブジェクト](../../../../references/protocol/ledger-data/ledger-entry-types/check.md)が削除されます。

着信したCheckが不要な場合、取り消すことができます。送信時に内容を誤って入力した場合や状況が変化した場合に、送信したCheckを取り消すこともできます。有効期限切れのCheckはレジャーから削除する必要があります。これにより、送金元に[所有者準備金](../../../../concepts/accounts/reserves.md#所有者準備金)が戻ります。

## 前提条件

このチュートリアルでCheckを取り消すには、以下が必要です。

- 現在レジャーに記録されているCheckオブジェクトのIDが必要です。
    - たとえばこのチュートリアルの例では、IDが`49647F0D748DC3FE26BDACBC57F251AADEFFF391403EC9BF87C97F67E9977FB0`のCheckを取り消しますが、この手順を自身で実行する場合は異なるIDを使用する必要があります。
- CheckCancelトランザクションを送信する資金供給のあるアカウントの**アドレス**と**シークレットキー**。Checkが有効期限切れでない限り、このアドレスは、Checkの送金元または受取人のいずれかでなければなりません。
- トランザクションに[安全に署名できる手段](../../../../concepts/transactions/secure-signing.md)。
- [クライアントライブラリ](../../../../references/client-libraries.md)またはHTTPライブラリ、WebSocketライブラリなど。


## 1. CheckCancelトランザクションの準備

[CheckCancelトランザクション][]のフィールドの値を決定します。以下のフィールドは必要最小限のフィールドです。その他のフィールドはオプションまたは署名時に[自動入力](../../../../references/protocol/transactions/common-fields.md#自動入力可能なフィールド)可能なフィールドです。

| フィールド             | 値            | 説明                           |
|:------------------|:-----------------|:--------------------------------------|
| `TransactionType` | 文字列           | Checkを取り消す場合は文字列`CheckCancel`を使用します。 |
| `Account`         | 文字列（アドレス） | Checkを取り消す送信元のアドレス。（あなたのアドレスです。） |
| `CheckID`         | 文字列           | レジャーで取り消すCheckオブジェクトのID。この情報を確認するには、[txメソッド][]を使用してCheckCreateトランザクションのメタデータを調べるか、または[account_objectsメソッド][]を使用してCheckを探します。 |

### CheckCancelトランザクションの準備の例

Checkを取り消す例を以下に示します。

{% tabs %}

{% tab label="JSON-RPC、WebSocket、またはコマンドライン" %}
```json
{
 "TransactionType": "CheckCancel",
 "Account": "rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo",
 "CheckID": "49647F0D748DC3FE26BDACBC57F251AADEFFF391403EC9BF87C97F67E9977FB0",
 "Fee": "12"
}
```
{% /tab %}

{% tab label="ripple-lib 1.x" %}
{% code-snippet file="/_code-samples/checks/js/prepareCancel.js" language="js" /%}
{% /tab %}

{% /tabs %}

## 2. CheckCancelトランザクションの署名

{% partial file="/@i18n/ja/docs/_snippets/tutorial-sign-step.md" /%} 

### リクエストの例

{% tabs %}

{% tab label="ripple-lib 1.x" %}
{% code-snippet file="/_code-samples/checks/js/signCancel.js" language="js" /%}
{% /tab %}

{% tab label="コマンドライン" %}
{% code-snippet file="/_code-samples/checks/cli/sign-cancel-req.sh" language="bash" /%}
{% /tab %}

{% /tabs %}


### レスポンスの例

{% tabs %}

{% tab label="ripple-lib 1.x" %}
{% code-snippet file="/_code-samples/checks/js/sign-cancel-resp.txt" language="" /%}
{% /tab %}

{% tab label="コマンドライン" %}
{% code-snippet file="/_code-samples/checks/cli/sign-cancel-resp.txt" language="json" /%}
{% /tab %}

{% /tabs %}


## 3. 署名済みCheckCancelトランザクションの送信

{% partial file="/@i18n/ja/docs/_snippets/tutorial-submit-step.md" /%} 

### リクエストの例

{% tabs %}

{% tab label="ripple-lib 1.x" %}
{% code-snippet file="/_code-samples/checks/js/submitCancel.js" language="js" /%}
{% /tab %}

{% tab label="コマンドライン" %}
{% code-snippet file="/_code-samples/checks/cli/submit-cancel-req.sh" language="bash" /%}
{% /tab %}

{% /tabs %}


### レスポンスの例

{% tabs %}

{% tab label="ripple-lib 1.x" %}
{% code-snippet file="/_code-samples/checks/js/submit-cancel-resp.txt" language="js" /%}
{% /tab %}

{% tab label="コマンドライン" %}
{% code-snippet file="/_code-samples/checks/cli/submit-cancel-resp.txt" language="json" /%}
{% /tab %}

{% /tabs %}

## 4. 検証の待機

{% partial file="/@i18n/ja/docs/_snippets/wait-for-validation.md" /%} 

## 5. 最終結果の確認

トランザクションのステータスを確認するには、CheckCancelトランザクションの識別用ハッシュを指定した[txメソッド][]を使用します。トランザクションが成功したことを示す`"TransactionResult": "tesSUCCESS"`フィールドをトランザクションメタデータから検索し、またこの結果が最終結果であることを示す`"validated": true`フィールドを結果から検索します。

トランザクションによって[Checkレジャーオブジェクト](../../../../references/protocol/ledger-data/ledger-entry-types/check.md)が削除されたことを示す`"LedgerEntryType": "Check"`を含む`DeletedNode`オブジェクトを、トランザクションメタデータから検索します。このオブジェクトの`LedgerIndex`はCheckのIDに一致している必要があります。

### リクエストの例

{% tabs %}

{% tab label="ripple-lib 1.x" %}
{% code-snippet file="/_code-samples/checks/js/getCancelTx.js" language="js" /%}
{% /tab %}

{% tab label="コマンドライン" %}
{% code-snippet file="/_code-samples/checks/cli/tx-cancel-req.sh" language="bash" /%}
{% /tab %}

{% /tabs %}


### レスポンスの例

{% tabs %}

{% tab label="ripple-lib 1.x" %}
{% code-snippet file="/_code-samples/checks/js/get-cancel-tx-resp.txt" language="json" /%}
{% /tab %}

{% tab label="コマンドライン" %}
{% code-snippet file="/_code-samples/checks/cli/tx-cancel-resp.txt" language="json" /%}
{% /tab %}

{% /tabs %}

{% raw-partial file="/docs/_snippets/common-links.md" /%}
