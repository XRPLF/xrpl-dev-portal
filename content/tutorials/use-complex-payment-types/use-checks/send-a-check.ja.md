# Checkの送信

_[Checks Amendment][]が必要です。_

Checkの送信は、指定受取人にあなたからの支払いを引き出す許可を与えることに似ています。このプロセスの結果、受取人が後で現金化できる[レジャーのCheckオブジェクト](check.html)が作成されます。

多くの場合、Checkではなく[Payment][]が送信されます。これは、Paymentでは1つのステップで受取人に直接送金できるためです。ただし、指定受取人が[DepositAuth](depositauth.html)を使用している場合はPaymentを直接送信できないため、代替手段としてCheckが適切です。

このチュートリアルでは、架空の会社BoxSend SG（XRP LedgerアドレスはrBXsgNkPcDN2runsvWmwxk3Lh97zdgo9za）が架空の暗号資産コンサルタント会社Grand Payments（XRP LedgerアドレスはrGPnRH1EBpHeTF2QG8DCAgM7z5pb75LAis）に、コンサルティング料を支払う例を取り上げます。Grand PaymentsはXRPでの支払いを望んでいますが、税務処理と規制対応を簡素化するため、明示的に承認した支払いのみを受け入れます。

XRP Ledgerの外部でGrand PaymentsはBoxSend SGに請求書（IDは`46060241FABCF692D4D934BA2A6C4427CD4279083E38C77CBE642243E43BE291`）を送り、Grand PaymentsのXRP Ledgerアドレス（rGPnRH1EBpHeTF2QG8DCAgM7z5pb75LAis）宛てに100 XRPのCheckを送信するよう要求します。

{% set send_n = cycler(* range(1,99)) %}

## 前提条件

このチュートリアルでCheckを送信するには、以下が必要です。

- Checkの送信元である資金供給のあるアカウントの**アドレス**と**シークレットキー**。
    - [XRP Ledger Test Net Faucet](xrp-test-net-faucet.html)を使用して、10,000 Test Net XRPを保有する資金供給のあるアドレスおよびシークレットを取得できます。
- Checkを受領する資金供給のあるアカウントの**アドレス**。
- トランザクションに安全に署名できる手段（[RippleAPI][]や各自の[`rippled`サーバー](install-rippled.html)など）。
- `rippled`サーバーに接続できるクライアントライブラリ（[RippleAPI][]、HTTPライブラリ、またはWebSocketライブラリなど）。
    - 詳細は、[`rippled` APIの使用開始](get-started-with-the-rippled-api.html)を参照してください。

## {{send_n.next()}}.CheckCreateトランザクションの準備

Checkの額と、Checkを現金化できる当事者を決定します。[CheckCreateトランザクション][]のフィールドの値を決定します。以下のフィールドは必要最小限のフィールドです。その他のフィールドはオプションまたは署名時に[自動入力](transaction-common-fields.html#自動入力可能なフィールド)できるフィールドです。

| フィールド             | 値                     | 説明                  |
|:------------------|:--------------------------|:-----------------------------|
| `TransactionType` | 文字列                    | このフィールドには文字列`CheckCreate`を使用します。 |
| `Account`         | 文字列（アドレス）          | Checkを作成する送金元のアドレス。（あなたのアドレスです。） |
| `Destination`     | 文字列（アドレス）          | Checkを換金できる指定受取人のアドレス。 |
| `SendMax`         | 文字列またはオブジェクト（額） | Checkが現金化されるときに送金元から引き出される最大額。XRPの場合、XRPのdrop数を示す文字列を使用します。発行済み通貨の場合、`currency`、`issuer`、および`value` フィールドを含むオブジェクトを使用します。詳細は、[通貨額の指定][]を参照してください。受取人がXRP以外の通貨で正確な額のCheckを換金できるようにし、かつ[送金手数料](transfer-fees.html)を含めるには、送金手数料分の追加パーセンテージを必ず指定してください。（たとえば受取人が送金手数料2%でCheckをイシュアーからの100 CADに現金化できるようにするには、`SendMax`をイシュアーからの102 CADに設定する必要があります。） |

[RippleAPI](rippleapi-reference.html)を使用している場合は、`prepareCheckCreate()`ヘルパーメソッドを使用できます。

**注記:** ChecksはRippleAPIバージョン0.19.0以上でサポートされています。

### CheckCreateトランザクションの準備の例

以下の例は、BoxSend SG（rBXsgNkPcDN2runsvWmwxk3Lh97zdgo9za）がGrand Payments（rGPnRH1EBpHeTF2QG8DCAgM7z5pb75LAis）宛てに作成した100 XRPのCheckです。追加（オプション）のメタデータとして、BoxSend SGはGrand Paymentsの請求書のIDを追加しています。これによりGrand PaymentsはこのCheckがどの請求書に対する支払いかを確認できます。

<!-- MULTICODE_BLOCK_START -->

*JSON-RPC、WebSocket、またはコマンドライン*

```
{
 "TransactionType":"CheckCreate",
 "Account":"rBXsgNkPcDN2runsvWmwxk3Lh97zdgo9za",
 "Destination":"rGPnRH1EBpHeTF2QG8DCAgM7z5pb75LAis",
 "SendMax":"100000000",
 "InvoiceID":"46060241FABCF692D4D934BA2A6C4427CD4279083E38C77CBE642243E43BE291"
}
```

*RippleAPI*

```js
{% include '_code-samples/checks/js/prepareCreate.js' %}
```

<!-- MULTICODE_BLOCK_END -->

## {{send_n.next()}}.CheckCreateトランザクションへの署名

{% include '_snippets/tutorial-sign-step.md' %}
<!--{#_ #}-->

### 要求の例

<!-- MULTICODE_BLOCK_START -->

*RippleAPI*

```js
{% include '_code-samples/checks/js/signCreate.js' %}
```

*WebSocket*

```json
{% include '_code-samples/checks/websocket/sign-create-req.json' %}
```

*コマンドライン*

```bash
{% include '_code-samples/checks/cli/sign-create-req.sh' %}
```

<!-- MULTICODE_BLOCK_END -->

#### 応答の例

<!-- MULTICODE_BLOCK_START -->

*RippleAPI*

```js
{% include '_code-samples/checks/js/sign-create-resp.txt' %}
```

*WebSocket*

```json
{% include '_code-samples/checks/websocket/sign-create-resp.json' %}
```

*コマンドライン*

```json
{% include '_code-samples/checks/cli/sign-create-resp.txt' %}
```

<!-- MULTICODE_BLOCK_END -->

## {{send_n.next()}}.署名済みトランザクションの送信

{% set step_1_link = "#1checkcreateトランザクションの準備" %}
{% include '_snippets/tutorial-submit-step.md' %}
<!--{#_ #}-->

### 要求の例

<!-- MULTICODE_BLOCK_START -->

*RippleAPI*

```js
{% include '_code-samples/checks/js/submitCreate.js' %}
```

*WebSocket*

```json
{% include '_code-samples/checks/websocket/submit-create-req.json' %}
```

*コマンドライン*

```bash
{% include '_code-samples/checks/cli/submit-create-req.sh' %}
```

<!-- MULTICODE_BLOCK_END -->

### 応答の例

<!-- MULTICODE_BLOCK_START -->

*RippleAPI*

```js
{% include '_code-samples/checks/js/submit-create-resp.txt' %}
```

*WebSocket*

```json
{% include '_code-samples/checks/websocket/submit-create-resp.json' %}
```

*コマンドライン*

```json
{% include '_code-samples/checks/cli/submit-create-resp.txt' %}
```

<!-- MULTICODE_BLOCK_END -->


## {{send_n.next()}}.検証の待機

{% include '_snippets/wait-for-validation.md' %}
<!--{#_ #}-->

## {{send_n.next()}}.最終結果の確認

トランザクションのステータスを確認するには、CheckCreateトランザクションの識別用ハッシュを指定した[txメソッド][]を使用します。トランザクションメタデータで、トランザクションが成功したことを示す`"TransactionResult": "tesSUCCESS"`フィールドを探し、またこの結果が最終結果であることを示す`"validated": true`フィールドを結果で探します。

トランザクションのメタデータで、`LedgerEntryType`が `"Check"`の`CreatedNode`オブジェクトを探します。これは、トランザクションにより[Checkレジャーオブジェクト](check.html)が作成されたことを示します。このオブジェクトの`LedgerIndex` がCheckのIDです。以下の例ではCheckのIDは`84C61BE9B39B2C4A2267F67504404F1EC76678806C1B901EA781D1E3B4CE0CD9`です。

**注記:** RippleAPIでは、CheckCreateトランザクションの検索時にCheckのIDが報告されません。この回避策として、以下のRippleAPIコードの例に示すように[Check IDフォーマット](check.html#check-idのフォーマット)からCheckのIDを計算することができます。 <!--{# TODO: Remove this and update the code samples if ripple-lib #876 gets fixed. #}-->

### 要求の例

<!-- MULTICODE_BLOCK_START -->

*RippleAPI*

```
{% include '_code-samples/checks/js/getCreateTx.js' %}
```

*WebSocket*

```json
{% include '_code-samples/checks/websocket/tx-create-req.json' %}
```

*コマンドライン*

```bash
{% include '_code-samples/checks/cli/tx-create-req.sh' %}
```

<!-- MULTICODE_BLOCK_END -->

### 応答の例

<!-- MULTICODE_BLOCK_START -->

*RippleAPI*

```
{% include '_code-samples/checks/js/get-create-tx-resp.txt' %}
```

*WebSocket*

```json
{% include '_code-samples/checks/websocket/tx-create-resp.json' %}
```

*コマンドライン*

```json
{% include '_code-samples/checks/cli/tx-create-resp.txt' %}
```

<!-- MULTICODE_BLOCK_END -->

<!--{# common link defs #}-->
[RippleAPI]: rippleapi-reference.html
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
