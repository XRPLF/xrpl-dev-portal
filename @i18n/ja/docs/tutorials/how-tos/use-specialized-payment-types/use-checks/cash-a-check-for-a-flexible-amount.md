---
html: cash-a-check-for-a-flexible-amount.html
parent: use-checks.html
seo:
    description: Checkから可能な限りの額を受領します。
labels:
  - Checks
---
# Checkの変動金額での換金

_[Checks Amendment][]により追加されました。_

Checkがレジャーに記録されており有効期限切れではない場合は、指定受取人は`DeliverMin`フィールドを指定した[CheckCashトランザクション][]を送信することで、Checkを変動金額で換金して受領できます。この方法でCheckを換金すると、受取人は送金を最大限受領でき、Checkの送金元からは、Checkの`SendMax`の全額が引き落とされるか、または可能な限りの額が引き落とされます。Checkの受取人に`DeliverMin`以上の額を送金できない場合は換金が失敗します。

Checkから可能な限りの額を受領したい場合には、変動金額でCheckを換金できます。

指定受取人は、[Checkを正確な金額で換金する](cash-a-check-for-a-flexible-amount.md)こともできます。


## 前提条件

{% partial file="/@i18n/ja/docs/_snippets/checkcash-prereqs.md" /%}

## 1. CheckCashトランザクションの準備

[CheckCashトランザクション][]のフィールドの値を決定します。Checkを変動金額で換金する場合、以下のフィールドは必要最小限です。それ以外のフィールドはオプションまたは署名時に[自動入力](../../../../references/protocol/transactions/common-fields.md#自動入力可能なフィールド)可能なフィールドです。

| フィールド             | 値                     | 説明                  |
|:------------------|:--------------------------|:-----------------------------|
| `TransactionType` | 文字列                    | 値が`CheckCash`の場合、これはCheckCashトランザクションです。 |
| `Account`         | 文字列（アドレス）          | Checkを換金する送信者のアドレス。（あなたのアドレスです。） |
| `CheckID`         | 文字列                    | レジャーで換金するCheckオブジェクトのID。この情報を確認するには、[txメソッド][]を使用してCheckCreateトランザクションのメタデータを調べるか、または[account_objectsメソッド][]を使用してCheckを探します。 |
| `DeliverMin`      | 文字列またはオブジェクト（額） | Checkから受領する最小額。この額を受領できない場合はCheckの換金が失敗し、Checkがレジャーに残るので、後で換金を再試行できます。XRPの場合、XRPのdrop数を示す文字列でなければなりません。トークンの場合、これは`currency`、`issuer`、および`value` フィールドを持つオブジェクトです。`currency`フィールドと`issuer`フィールドは、Checkオブジェクトの対応するフィールドに一致しており、`value`はCheckオブジェクトの額以下でなければなりません。詳細は、[通貨額の指定][]をご覧ください。 |

### 変動金額で換金するCheckCashトランザクションの準備の例

Checkを変動金額で換金するためのトランザクションを準備する手順を以下の例に示します。

{% tabs %}

{% tab label="JSON-RPC、WebSocket、またはコマンドライン" %}
```json
{
 "Account": "rGPnRH1EBpHeTF2QG8DCAgM7z5pb75LAis",
 "TransactionType": "CheckCash",
 "DeliverMin": "95000000",
 "CheckID": "2E0AD0740B79BE0AAE5EDD1D5FC79E3C5C221D23C6A7F771D85569B5B91195C2"
}
```
{% /tab %}

{% tab label="ripple-lib 1.x" %}
{% code-snippet file="/_code-samples/checks/js/prepareCashFlex.js" language="js" /%}
{% /tab %}

{% /tabs %}

## 2. CheckCashトランザクションの署名

{% partial file="/@i18n/ja/docs/_snippets/tutorial-sign-step.md" /%} 

### リクエストの例

{% tabs %}

{% tab label="コマンドライン" %}
{% code-snippet file="/_code-samples/checks/cli/sign-cash-flex-req.sh" language="bash" /%}
{% /tab %}

{% /tabs %}


### レスポンスの例

{% tabs %}

{% tab label="コマンドライン" %}
{% code-snippet file="/_code-samples/checks/cli/sign-cash-flex-resp.txt" language="json" /%}
{% /tab %}

{% /tabs %}


## 3. 署名済みCheckCashトランザクションの送信

{% partial file="/@i18n/ja/docs/_snippets/tutorial-submit-step.md" /%} 

### リクエストの例

{% tabs %}

{% tab label="コマンドライン" %}
{% code-snippet file="/_code-samples/checks/cli/submit-cash-flex-req.sh" language="bash" /%}
{% /tab %}

{% /tabs %}


### レスポンスの例

{% tabs %}

{% tab label="コマンドライン" %}
{% code-snippet file="/_code-samples/checks/cli/submit-cash-flex-resp.txt" language="json" /%}
{% /tab %}

{% /tabs %}

## 4. 検証の待機

{% partial file="/@i18n/ja/docs/_snippets/wait-for-validation.md" /%} 

## 5. 最終結果の確認

トランザクションのステータスを確認するには、CheckCashトランザクションの識別用ハッシュを指定した[txメソッド][]を使用します。トランザクションが成功したことを示す`"TransactionResult": "tesSUCCESS"`フィールドをトランザクションメタデータから検索し、またこの結果が最終結果であることを示す`"validated": true`フィールドを結果から検索します。

### リクエストの例

{% tabs %}

{% tab label="コマンドライン" %}
{% code-snippet file="/_code-samples/checks/cli/tx-cash-flex-req.sh" language="bash" /%}
{% /tab %}

{% /tabs %}


### レスポンスの例

{% tabs %}

{% tab label="コマンドライン" %}
{% code-snippet file="/_code-samples/checks/cli/tx-cash-flex-resp.txt" language="json" /%}
{% /tab %}

{% /tabs %}

### エラー処理

[](../../../../references/protocol/transactions/transaction-results/index.md)Checkの換金が`tec`クラスコードで失敗した場合は、[すべてのトランザクションレスポンスのリスト](../../../../references/protocol/transactions/transaction-results/index.md)でコードを確認し、適切に対処してください。CheckCashトランザクションでよく返される結果コードの一部を次に示します。

| 結果コード | 意味 | 対処 |
|-------------|---------|----------------|
| `tecEXPIRED` | Checkが有効期限切れです。 | Checkを取り消して、以前より長い有効期限を設定して新しいCheckを作成するように送金元に依頼します。 |
| `tecNO_ENTRY` | Check IDが存在していません。 | CheckCashトランザクションの`CheckID`が正しいことを確認してください。Checkがまだ取り消されていないこと、または正常に換金されていないことを確認してください。 |
| `tecNO_LINE` | 受取人がCheckの通貨のトラストラインを所有していません。 | このイシュアーからのこの通貨を保有するには、指定された通貨とイシュアーのトラストラインを作成し、[TrustSetトランザクション][]を使用してこのトラストラインに適切な限度額を設定してから、Checkの換金を再試行します。 |
| `tecNO_PERMISSION` | CheckCashトランザクションの送信者はCheckの`Destination`ではありません。 | Checkの`Destination`を再度確認します。 |
| `tecNO_AUTH` | このCheckの通貨のイシュアーは[Authorized Trust Line](../../../../concepts/tokens/fungible-tokens/authorized-trust-lines.md)を使用していますが、受取人からイシュアーへのトラストラインが承認されていません。 | このトラストラインを承認するようイシュアーに依頼し、承認されたらCheckの換金を再試行します。 |
| `tecPATH_PARTIAL` | トラストラインの限度額、または送金元に送金通貨の残高（イシュアーの[送金手数料](../../../../concepts/tokens/transfer-fees.md)がある場合はこの手数料を含む）が十分になかったことが原因で、Checkでは十分なトークンを送金できませんでした。 | 原因がトラストラインの限度額である場合は、（希望する場合には）限度額を引き上げる[TrustSetトランザクション][]を送信するか、または通貨の一部を消費して残高を減らしてから、Checkの換金を再試行します。原因が送金元の残高である場合は、送金元にCheckの通貨が積み増しされるまで待つか、または以前よりも低い額でCheckの換金を再試行します。 |
| `tecUNFUNDED_PAYMENT` | Checkで十分なXRPを送金できませんでした。 | 送金元にXRPが積み増しされるまで待つか、または以前よりも低い額でCheckの換金を再試行します。 |

## 6. 送金された額の確認

Checkが変動する`DeliverMin`の額で換金された場合は、Checkは少なくとも`DeliverMin`の額で換金されたと想定できます。送金された額を正確に得るには、トランザクションメタデータを調べます。<!--{# TODO: Update if RIPD-1623 adds a delivered_amount field. #}-->メタデータの`AffectedNodes`配列には、通貨のタイプに応じて、Checkの換金による残高の変更を反映した1～2つのオブジェクトが含まれています。

- XRPの場合、Checkの送金元の`AccountRoot`オブジェクトのXRP `Balance` フィールドから引き落しが行われます。Checkの受取人（CheckCashトランザクションを送信したユーザ）の`AccountRoot`オブジェクトでは、最低でもCheckCashトランザクションの`DeliverMin`から、トランザクションの送信にかかる[トランザクションコスト](../../../../concepts/transactions/transaction-cost.md)を差し引いた額が、XRP `Balance`に入金されます。

    たとえば以下の`ModifiedNode`は、アカウントrGPnRH1EBpHeTF2QG8DCAgM7z5pb75LAis（Checkの受取人でありこのCheckCashトランザクションの送信者）のXRP残高が`9999999970` dropから`10099999960` dropに変更されています。つまり、このトランザクションを処理した結果として、受取人に対し _正味_ 99.99999 XRPが入金されています。

    ```
    {
      "ModifiedNode": {
        "FinalFields": {
           "Account": "rGPnRH1EBpHeTF2QG8DCAgM7z5pb75LAis",
           "Balance": "10099999960",
           "Flags": 0,
           "OwnerCount": 2,
           "Sequence": 5
        },
        "LedgerEntryType": "AccountRoot",
        "LedgerIndex": "7939126A732EBBDEC715FD3CCB056EB31E65228CA17E3B2901E7D30B90FD03D3",
        "PreviousFields": {
           "Balance": "9999999970",
           "Sequence": 4
        },
        "PreviousTxnID": "0283465F0D21BE6B1E91ABDE17266C24C1B4915BAAA9A88CC098A98D5ECD3E9E",
        "PreviousTxnLgrSeq": 8005334
      }
    }
    ```

    正味金額99.99999 XRPは、このCheckCashトランザクションを送信するにあたり、トランザクションコストを支払うために消却された額を差し引いた後の金額です。以下のトランザクション指示（抜粋）は、トランザクションコスト（`Fee`フィールド）がXRPの10 dropであることを示しています。これを正味残高の変更に追加することで、このCheckの換金のために受取人rGPnRH1EBpHeTF2QG8DCAgM7z5pb75LAisに _総額_ 100 XRPが入金されます。

    ```
    "Account" : "rGPnRH1EBpHeTF2QG8DCAgM7z5pb75LAis",
    "TransactionType" : "CheckCash",
    "DeliverMin" : "95000000",
    "Fee" : "10",
    ```

- Checkの送金元または受取人がイシュアーであるトークンの場合、これらのアカウント間のトラストラインを表す`RippleState`オブジェクトでは、`Balance`がCheckの受取人に有利な方法で調整されています。

- イシュアーが第三者であるトークンの場合、2つの`RippleState`（送金元からイシュアーへのトラストラインとイシュアーから受取人へのトラストライン）に対する変更があります。Checkの送金元とイシュアーの関係を表す`RippleState`オブジェクトではその`Balance`がイシュアーに有利に変更され、イシュアーと受取人の間の関係を表す`RippleState`オブジェクトではその`Balance`が受取人に有利に変更されます。

    - トークンに[送金手数料](../../../../concepts/tokens/transfer-fees.md)がある場合、受取人への入金額を上回る額がCheckの送金元から引き落とされます。（この差額が送金手数料であり、これがイシュアーに戻されることによりイシュアーの正味の債務は減少します。）

{% raw-partial file="/docs/_snippets/common-links.md" /%}
