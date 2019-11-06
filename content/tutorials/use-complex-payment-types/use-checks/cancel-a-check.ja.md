# Checkの取消し

_[Checks Amendment][]が必要です。_

このチュートリアルでは、[Check](checks.html)を取り消す手順を説明します。この手順を実行すると、送金を行わずに[レジャーのCheckオブジェクト](check.html)が削除されます。

着信したCheckが不要な場合、取り消すことができます。送信時に内容を誤って入力した場合や状況が変化した場合に、送信したCheckを取り消すこともできます。有効期限切れのCheckはレジャーから削除する必要があります。これにより、送金元に[所有者準備金](reserves.html#所有者準備金)が戻ります。

{% set cancel_n = cycler(* range(1,99)) %}

## 前提条件

このチュートリアルでCheckを取り消すには、以下が必要です。

- 現在レジャーに記録されているCheckオブジェクトのIDが必要です。
    - たとえばこのチュートリアルの例では、IDが`49647F0D748DC3FE26BDACBC57F251AADEFFF391403EC9BF87C97F67E9977FB0`のCheckを取り消しますが、この手順を自身で実行する場合は異なるIDを使用する必要があります。
- CheckCancelトランザクションを送信する資金供給のあるアカウントの**アドレス**と**シークレットキー**。Checkが有効期限切れでない限り、このアドレスは、Checkの送金元または受取人のいずれかでなければなりません。
- トランザクションに安全に署名できる手段（[RippleAPI][]や各自の[`rippled`サーバー](install-rippled.html)など）。
- `rippled`サーバーに接続できるクライアントライブラリ（[RippleAPI][]、HTTPライブラリ、またはWebSocketライブラリなど）。
    - 詳細は、[`rippled` APIの使用開始](get-started-with-the-rippled-api.html)を参照してください。


## {{cancel_n.next()}}.CheckCancelトランザクションの準備

[CheckCancelトランザクション][]のフィールドの値を決定します。以下のフィールドは必要最小限のフィールドです。その他のフィールドはオプションまたは署名時に[自動入力](transaction-common-fields.html#自動入力可能なフィールド)可能なフィールドです。

| フィールド             | 値            | 説明                           |
|:------------------|:-----------------|:--------------------------------------|
| `TransactionType` | 文字列           | Checkを取り消す場合は文字列`CheckCancel`を使用します。 |
| `Account`         | 文字列（アドレス） | Checkを取り消す送信元のアドレス。（あなたのアドレスです。） |
| `CheckID`         | 文字列           | レジャーで取り消すCheckオブジェクトのID。この情報を確認するには、[txメソッド][]を使用してCheckCreateトランザクションのメタデータを調べるか、または[account_objectsメソッド][]を使用してCheckを探します。 |

[RippleAPI](rippleapi-reference.html)を使用している場合は、`prepareCheckCancel()`ヘルパーメソッドを使用できます。

**注記:** CheckはRippleAPIバージョン0.19.0以降でサポートされています。

### CheckCancelトランザクションの準備の例

Checkを取り消す例を以下に示します。

<!-- MULTICODE_BLOCK_START -->

*JSON-RPC、WebSocket、またはコマンドライン*

```
{
 "TransactionType": "CheckCancel",
 "Account": "rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo",
 "CheckID": "49647F0D748DC3FE26BDACBC57F251AADEFFF391403EC9BF87C97F67E9977FB0",
 "Fee": "12"
}
```

*RippleAPI*

```js
{% include '_code-samples/checks/js/prepareCancel.js' %}
```

<!-- MULTICODE_BLOCK_END -->

## {{cancel_n.next()}}.CheckCancelトランザクションの署名

{% include '_snippets/tutorial-sign-step.md' %} <!--#{ fix md highlighting_ #}-->

### 要求の例

<!-- MULTICODE_BLOCK_START -->

*RippleAPI*

```js
{% include '_code-samples/checks/js/signCancel.js' %}
```

*コマンドライン*

```bash
{% include '_code-samples/checks/cli/sign-cancel-req.sh' %}
```

<!-- MULTICODE_BLOCK_END -->


### 応答の例

<!-- MULTICODE_BLOCK_START -->

*RippleAPI*

```
{% include '_code-samples/checks/js/sign-cancel-resp.txt' %}
```

*コマンドライン*

```json
{% include '_code-samples/checks/cli/sign-cancel-resp.txt' %}
```

<!-- MULTICODE_BLOCK_END -->


## {{cancel_n.next()}}.署名済みCheckCancelトランザクションの送信

{% set step_1_link = "#1checkcancelトランザクションの準備" %}
{% include '_snippets/tutorial-submit-step.md' %} <!--#{ fix md highlighting_ #}-->

### 要求の例

<!-- MULTICODE_BLOCK_START -->

*RippleAPI*

```js
{% include '_code-samples/checks/js/submitCancel.js' %}
```

*コマンドライン*

```bash
{% include '_code-samples/checks/cli/submit-cancel-req.sh' %}
```

<!-- MULTICODE_BLOCK_END -->


### 応答の例

<!-- MULTICODE_BLOCK_START -->

*RippleAPI*

```js
{% include '_code-samples/checks/js/submit-cancel-resp.txt' %}
```

*コマンドライン*

```json
{% include '_code-samples/checks/cli/submit-cancel-resp.txt' %}
```

<!-- MULTICODE_BLOCK_END -->

## {{cancel_n.next()}}.検証の待機

{% include '_snippets/wait-for-validation.md' %} <!--#{ fix md highlighting_ #}-->

## {{cancel_n.next()}}.最終結果の確認

トランザクションのステータスを確認するには、CheckCancelトランザクションの識別用ハッシュを指定した[txメソッド][]を使用します。トランザクションが成功したことを示す`"TransactionResult": "tesSUCCESS"`フィールドをトランザクションメタデータから検索し、またこの結果が最終結果であることを示す`"validated": true`フィールドを結果から検索します。

トランザクションによって[Checkレジャーオブジェクト](check.html)が削除されたことを示す`"LedgerEntryType": "Check"`を含む`DeletedNode`オブジェクトを、トランザクションメタデータから検索します。このオブジェクトの`LedgerIndex`はCheckのIDに一致している必要があります。

### 要求の例

<!-- MULTICODE_BLOCK_START -->

*RippleAPI*

```js
{% include '_code-samples/checks/js/getCancelTx.js' %}
```

*コマンドライン*

```bash
{% include '_code-samples/checks/cli/tx-cancel-req.sh' %}
```

<!-- MULTICODE_BLOCK_END -->


### 応答の例

<!-- MULTICODE_BLOCK_START -->

*RippleAPI*

```json
{% include '_code-samples/checks/js/get-cancel-tx-resp.txt' %}
```

*コマンドライン*

```json
{% include '_code-samples/checks/cli/tx-cancel-resp.txt' %}
```

<!-- MULTICODE_BLOCK_END -->

<!--{# common link defs #}-->
[RippleAPI]: rippleapi-reference.html
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
