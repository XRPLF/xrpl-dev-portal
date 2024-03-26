---
html: send-a-check.html
parent: use-checks.html
seo:
    description: 受取人が後で現金化できるCheckオブジェクトが作成されます。
labels:
  - Checks
---
# Checkの送信

Checkの送信は、指定受取人にあなたからの支払いを引き出す許可を与えることに似ています。このプロセスの結果、受取人が後で現金化できる[レジャーのCheckオブジェクト](../../../../references/protocol/ledger-data/ledger-entry-types/check.md)が作成されます。

多くの場合、Checkではなく[Payment][]が送信されます。これは、Paymentでは1つのステップで受取人に直接送金できるためです。ただし、指定受取人が[DepositAuth](../../../../concepts/accounts/depositauth.md)を使用している場合はPaymentを直接送信できないため、代替手段としてCheckが適切です。

このチュートリアルでは、架空の会社BoxSend SG（XRP LedgerアドレスはrBXsgNkPcDN2runsvWmwxk3Lh97zdgo9za）が架空の暗号資産コンサルタント会社Grand Payments（XRP LedgerアドレスはrGPnRH1EBpHeTF2QG8DCAgM7z5pb75LAis）に、コンサルティング料を支払う例を取り上げます。Grand PaymentsはXRPでの支払いを望んでいますが、税務処理と規制対応を簡素化するため、明示的に承認した支払いのみを受け入れます。

XRP Ledgerの外部でGrand PaymentsはBoxSend SGに請求書（IDは`46060241FABCF692D4D934BA2A6C4427CD4279083E38C77CBE642243E43BE291`）を送り、Grand PaymentsのXRP Ledgerアドレス（rGPnRH1EBpHeTF2QG8DCAgM7z5pb75LAis）宛てに100 XRPのCheckを送信するよう要求します。


## 前提条件

このチュートリアルでCheckを送信するには、以下が必要です。

- Checkの送信元である資金供給のあるアカウントの**アドレス**と**シークレットキー**。
    - [XRP Ledger Test Net Faucet](/resources/dev-tools/xrp-faucets)を使用して、10,000 Test Net XRPを保有する資金供給のあるアドレスおよびシークレットを取得できます。
- Checkを受領する資金供給のあるアカウントの**アドレス**。
- トランザクションに[安全に署名できる手段](../../../../concepts/transactions/secure-signing.md)。
- [クライアントライブラリ](../../../../references/client-libraries.md)またはHTTPライブラリ、WebSocketライブラリなど。

## 1. CheckCreateトランザクションの準備

Checkの額と、Checkを現金化できる当事者を決定します。[CheckCreateトランザクション][]のフィールドの値を決定します。以下のフィールドは必要最小限のフィールドです。その他のフィールドはオプションまたは署名時に[自動入力](../../../../references/protocol/transactions/common-fields.md#自動入力可能なフィールド)できるフィールドです。

| フィールド             | 値                     | 説明                  |
|:------------------|:--------------------------|:-----------------------------|
| `TransactionType` | 文字列                    | このフィールドには文字列`CheckCreate`を使用します。 |
| `Account`         | 文字列（アドレス）          | Checkを作成する送金元のアドレス。（あなたのアドレスです。） |
| `Destination`     | 文字列（アドレス）          | Checkを換金できる指定受取人のアドレス。 |
| `SendMax`         | 文字列またはオブジェクト（額） | Checkが現金化されるときに送金元から引き出される最大額。XRPの場合、XRPのdrop数を示す文字列を使用します。トークンの場合、`currency`、`issuer`、および`value` フィールドを含むオブジェクトを使用します。詳細は、[通貨額の指定][]をご覧ください。受取人がXRP以外の通貨で正確な額のCheckを換金できるようにし、かつ[送金手数料](../../../../concepts/tokens/transfer-fees.md)を含めるには、送金手数料分の追加パーセンテージを必ず指定してください。（たとえば受取人が送金手数料2%でCheckをイシュアーからの100 CADに現金化できるようにするには、`SendMax`をイシュアーからの102 CADに設定する必要があります。） |

### CheckCreateトランザクションの準備の例

以下の例は、BoxSend SG（`rBXsgNkPcDN2runsvWmwxk3Lh97zdgo9za`）がGrand Payments（`rGPnRH1EBpHeTF2QG8DCAgM7z5pb75LAis`）宛てに作成した100 XRPのCheckです。追加（オプション）のメタデータとして、BoxSend SGはGrand Paymentsの請求書のIDを追加しています。これによりGrand PaymentsはこのCheckがどの請求書に対する支払いかを確認できます。

{% tabs %}

{% tab label="ripple-lib 1.x" %}
{% code-snippet file="/_code-samples/checks/js/prepareCreate.js" language="js" /%}
{% /tab %}

{% tab label="JSON-RPC、WebSocket、またはコマンドライン" %}
```json
{
 "TransactionType":"CheckCreate",
 "Account":"rBXsgNkPcDN2runsvWmwxk3Lh97zdgo9za",
 "Destination":"rGPnRH1EBpHeTF2QG8DCAgM7z5pb75LAis",
 "SendMax":"100000000",
 "InvoiceID":"46060241FABCF692D4D934BA2A6C4427CD4279083E38C77CBE642243E43BE291"
}
```
{% /tab %}

{% /tabs %}

## 2. CheckCreateトランザクションへの署名

{% partial file="/@i18n/ja/docs/_snippets/tutorial-sign-step.md" /%}


### リクエストの例

{% tabs %}

{% tab label="ripple-lib 1.x" %}
{% code-snippet file="/_code-samples/checks/js/signCreate.js" language="js" /%}
{% /tab %}

{% tab label="WebSocket" %}
{% code-snippet file="/_code-samples/checks/websocket/sign-create-req.json" language="json" /%}
{% /tab %}

{% tab label="コマンドライン" %}
{% code-snippet file="/_code-samples/checks/cli/sign-create-req.sh" language="bash" /%}
{% /tab %}

{% /tabs %}

#### レスポンスの例

{% tabs %}

{% tab label="ripple-lib 1.x" %}
{% code-snippet file="/_code-samples/checks/js/sign-create-resp.txt" language="js" /%}
{% /tab %}

{% tab label="WebSocket" %}
{% code-snippet file="/_code-samples/checks/websocket/sign-create-resp.json" language="json" /%}
{% /tab %}

{% tab label="コマンドライン" %}
{% code-snippet file="/_code-samples/checks/cli/sign-create-resp.txt" language="json" /%}
{% /tab %}

{% /tabs %}

## 3.署名済みトランザクションの送信

{% partial file="/@i18n/ja/docs/_snippets/tutorial-submit-step.md" /%}


### リクエストの例

{% tabs %}

{% tab label="ripple-lib 1.x" %}
{% code-snippet file="/_code-samples/checks/js/submitCreate.js" language="js" /%}
{% /tab %}

{% tab label="WebSocket" %}
{% code-snippet file="/_code-samples/checks/websocket/submit-create-req.json" language="json" /%}
{% /tab %}

{% tab label="コマンドライン" %}
{% code-snippet file="/_code-samples/checks/cli/submit-create-req.sh" language="bash" /%}
{% /tab %}

{% /tabs %}

### レスポンスの例

{% tabs %}

{% tab label="ripple-lib 1.x" %}
{% code-snippet file="/_code-samples/checks/js/submit-create-resp.txt" language="js" /%}
{% /tab %}

{% tab label="WebSocket" %}
{% code-snippet file="/_code-samples/checks/websocket/submit-create-resp.json" language="json" /%}
{% /tab %}

{% tab label="コマンドライン" %}
{% code-snippet file="/_code-samples/checks/cli/submit-create-resp.txt" language="json" /%}
{% /tab %}

{% /tabs %}


## 4.検証の待機

{% partial file="/@i18n/ja/docs/_snippets/wait-for-validation.md" /%}


## 5.最終結果の確認

トランザクションのステータスを確認するには、CheckCreateトランザクションの識別用ハッシュを指定した[txメソッド][]を使用します。トランザクションメタデータで、トランザクションが成功したことを示す`"TransactionResult": "tesSUCCESS"`フィールドを探し、またこの結果が最終結果であることを示す`"validated": true`フィールドを結果で探します。

トランザクションのメタデータで、`LedgerEntryType`が `"Check"`の`CreatedNode`オブジェクトを探します。これは、トランザクションにより[Checkレジャーオブジェクト](../../../../references/protocol/ledger-data/ledger-entry-types/check.md)が作成されたことを示します。このオブジェクトの`LedgerIndex` がCheckのIDです。以下の例ではCheckのIDは`84C61BE9B39B2C4A2267F67504404F1EC76678806C1B901EA781D1E3B4CE0CD9`です。

### リクエストの例

{% tabs %}

{% tab label="ripple-lib 1.x" %}
{% code-snippet file="/_code-samples/checks/js/getCreateTx.js" language="" /%}
{% /tab %}

{% tab label="WebSocket" %}
{% code-snippet file="/_code-samples/checks/websocket/tx-create-req.json" language="json" /%}
{% /tab %}

{% tab label="コマンドライン" %}
{% code-snippet file="/_code-samples/checks/cli/tx-create-req.sh" language="bash" /%}
{% /tab %}

{% /tabs %}

### レスポンスの例

{% tabs %}

{% tab label="ripple-lib 1.x" %}
{% code-snippet file="/_code-samples/checks/js/get-create-tx-resp.txt" language="" /%}
{% /tab %}

{% tab label="WebSocket" %}
{% code-snippet file="/_code-samples/checks/websocket/tx-create-resp.json" language="json" /%}
{% /tab %}

{% tab label="コマンドライン" %}
{% code-snippet file="/_code-samples/checks/cli/tx-create-resp.txt" language="json" /%}
{% /tab %}

{% /tabs %}

{% raw-partial file="/docs/_snippets/common-links.md" /%}
