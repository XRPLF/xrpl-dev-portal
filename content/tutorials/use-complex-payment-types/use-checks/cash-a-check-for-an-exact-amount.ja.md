# Checkの正確な金額での換金

_[Checks Amendment][]が必要です。_

Checkがレジャーに含まれており有効期限切れではない場合は、指定の受取人は`Amount`フィールドを指定した[CheckCashトランザクション][]を送信することで、Checkを換金し、Checkに指定されている額までの正確な額を受領できます。請求書の額面通りの金額を回収したい場合など、特定の金額の受領を希望する際には、この方法でCheckを換金できます。

指定の受取人は、[Checkを変動金額で換金する](cash-a-check-for-a-flexible-amount.html)こともできます。

{% set cash_exact_n = cycler(* range(1,99)) %}

## 前提条件

{% include '_snippets/checkcash-prereqs.md' %} <!--#{ fix md highlighting_ #}-->

## {{cash_exact_n.next()}}.CheckCashトランザクションの準備

[CheckCashトランザクション][]のフィールドの値を決定します。Checkを正確な金額で換金する場合、以下のフィールドが最低限必要です。それ以外のフィールドはオプションまたは署名時に[自動入力](transaction-common-fields.html#自動入力可能なフィールド)可能なフィールドです。

| フィールド             | 値                     | 説明                  |
|:------------------|:--------------------------|:-----------------------------|
| `TransactionType` | 文字列                    | 値が`CheckCash`の場合、これはCheckCashトランザクションです。 |
| `Account`         | 文字列（アドレス）          | Checkを換金する送信者のアドレス。（あなたのアドレスです。） |
| `CheckID`         | 文字列                    | レジャーで換金するCheckオブジェクトのID。この情報を確認するには、[txメソッド][]を使用してCheckCreateトランザクションのメタデータを調べるか、または[account_objectsメソッド][]を使用してCheckを探します。 |
| `Amount`          | 文字列またはオブジェクト（額） | Checkから精算する額。XRPの場合、XRPのdrop数を示す文字列でなければなりません。発行済み通貨の場合、これは`currency`、`issuer`、および`value` フィールドを持つオブジェクトです。`currency`フィールドと`issuer`フィールドは、Checkオブジェクトの対応するフィールドに一致しており、`value`はCheckオブジェクトの額以下でなければなりません。（送金手数料のかかる通貨の場合、`SendMax`で送金手数料を支払えるように、`SendMax`よりも低い額を換金する必要があります。）この額を受領できない場合はCheckの換金が失敗し、Checkがレジャーに残るので、後で換金を再試行できます。詳細は、[通貨額の指定][]を参照してください。 |


### 正確な金額で換金するCheckCashトランザクションの準備の例

Checkを正確な金額で換金するためのトランザクションを準備する手順を以下の例に示します。

<!-- MULTICODE_BLOCK_START -->

*JSON-RPC、WebSocket、またはコマンドライン*

```
{
 "Account": "rfkE1aSy9G8Upk4JssnwBxhEv5p4mn2KTy",
 "TransactionType": "CheckCash",
 "Amount": "100000000",
 "CheckID": "838766BA2B995C00744175F69A1B11E32C3DBC40E64801A4056FCBD657F57334",
 "Fee": "12"
}
```

*RippleAPI*

```js
{% include '_code-samples/checks/js/prepareCashExact.js' %}
```

<!-- MULTICODE_BLOCK_END -->

## {{cash_exact_n.next()}}.CheckCashトランザクションの署名

{% include '_snippets/tutorial-sign-step.md' %} <!--#{ fix md highlighting_ #}-->

### 要求の例

<!-- MULTICODE_BLOCK_START -->

*コマンドライン*

```bash
{% include '_code-samples/checks/cli/sign-cash-exact-req.sh' %}
```

<!-- MULTICODE_BLOCK_END -->


### 応答の例

<!-- MULTICODE_BLOCK_START -->

*コマンドライン*

```json
{% include '_code-samples/checks/cli/sign-cash-exact-resp.txt' %}
```

<!-- MULTICODE_BLOCK_END -->


## {{cash_exact_n.next()}}.署名済みCheckCashトランザクションの送信

{% set step_1_link = "#1checkcashトランザクションの準備" %}
{% include '_snippets/tutorial-submit-step.md' %} <!--#{ fix md highlighting_ #}-->

### 要求の例

<!-- MULTICODE_BLOCK_START -->

*コマンドライン*

```bash
{% include '_code-samples/checks/cli/submit-cash-exact-req.sh' %}
```

<!-- MULTICODE_BLOCK_END -->


### 応答の例

<!-- MULTICODE_BLOCK_START -->

*コマンドライン*

```json
{% include '_code-samples/checks/cli/submit-cash-exact-resp.txt' %}
```

<!-- MULTICODE_BLOCK_END -->

## {{cash_exact_n.next()}}.検証の待機

{% include '_snippets/wait-for-validation.md' %} <!--#{ fix md highlighting_ #}-->

## {{cash_exact_n.next()}}.最終結果の確認

トランザクションのステータスを確認するには、CheckCashトランザクションの識別用ハッシュを指定した[txメソッド][]を使用します。トランザクションが成功したことを示す`"TransactionResult": "tesSUCCESS"`フィールドをトランザクションメタデータから検索し、またこの結果が最終結果であることを示す`"validated": true`フィールドを結果から検索します。

Checkが正確な`Amount`で換金された場合は、受取人に対し正確な額が入金されたと想定できます（発行済み通貨の金額が極めて大きい場合や小さい場合は、金額が丸められることがあります）。

Checkを換金できない場合、Checkはレジャーに残るため、後日換金を再試行できます。代わりに[Checkを変動金額で換金する](cash-a-check-for-a-flexible-amount.html)ことができます。

### 要求の例

<!-- MULTICODE_BLOCK_START -->

*コマンドライン*

```bash
{% include '_code-samples/checks/cli/tx-cash-exact-req.sh' %}
```

<!-- MULTICODE_BLOCK_END -->


### 応答の例

<!-- MULTICODE_BLOCK_START -->

*コマンドライン*

```json
{% include '_code-samples/checks/cli/tx-cash-exact-resp.txt' %}
```

<!-- MULTICODE_BLOCK_END -->

<!--{# common links #}-->
[RippleAPI]: rippleapi-reference.html
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled-api-links.md' %}
