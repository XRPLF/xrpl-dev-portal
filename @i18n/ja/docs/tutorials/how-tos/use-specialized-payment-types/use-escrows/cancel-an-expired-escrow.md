---
html: cancel-an-expired-escrow.html
parent: use-escrows.html
seo:
    description: 有効期限切れのEscrowを取り消します。
labels:
  - Escrow
  - スマートコントラクト
---
# 有効期限切れEscrowの取消し

## 1.有効期限切れEscrowの確認

XRP LedgerのEscrowが有効期限切れとなるのは、その`CancelAfter`の時刻が検証済みレジャーの`close_time`よりも前である場合です。（Escrowに`CancelAfter`時刻が指定されていない場合は、Escrowが有効期限切れになることはありません。）最新の検証済みレジャーの閉鎖時刻は、[ledgerメソッド][]を使用して検索できます。

リクエスト:

{% tabs %}

{% tab label="Websocket" %}
{% code-snippet file="/_code-samples/escrow/websocket/ledger-request-expiration.json" language="json" /%}
{% /tab %}

{% /tabs %}

レスポンス:

{% tabs %}

{% tab label="Websocket" %}
{% code-snippet file="/_code-samples/escrow/websocket/ledger-response-expiration.json" language="json" /%}
{% /tab %}

{% /tabs %}


[account_objectsメソッド][]を使用してEscrowを検索し、`CancelAfter`の時刻と比較できます。

リクエスト:

{% tabs %}

{% tab label="Websocket" %}
{% code-snippet file="/_code-samples/escrow/websocket/account_objects-request-expiration.json" language="json" /%}
{% /tab %}

{% /tabs %}

レスポンス:

{% tabs %}

{% tab label="Websocket" %}
{% code-snippet file="/_code-samples/escrow/websocket/account_objects-response-expiration.json" language="json" /%}
{% /tab %}

{% /tabs %}

## 2.EscrowCancelトランザクションの送信

XRP Ledgerでは、[EscrowCancelトランザクション][]に[署名して送信する](../../../../concepts/transactions/index.md#トランザクションへの署名とトランザクションの送信)ことで、***誰でも***有効期限切れのEscrowを取り消すことができます。トランザクションの`Owner`フィールドを、そのEscrowを作成した`EscrowCreate`トランザクションの`Account`に設定します。`OfferSequence`フィールドを、`EscrowCreate`トランザクションの`Sequence`に設定します。

{% partial file="/@i18n/ja/docs/_snippets/secret-key-warning.md" /%} 

リクエスト:

{% tabs %}

{% tab label="Websocket" %}
{% code-snippet file="/_code-samples/escrow/websocket/submit-request-escrowcancel.json" language="json" /%}
{% /tab %}

{% /tabs %}

レスポンス:

{% tabs %}

{% tab label="Websocket" %}
{% code-snippet file="/_code-samples/escrow/websocket/submit-response-escrowcancel.json" language="json" /%}
{% /tab %}

{% /tabs %}

トランザクションの識別用`hash`値をメモしておきます。これにより、検証済みレジャーバージョンに記録されるときにその最終ステータスを確認できます。

## 3.検証の待機

{% partial file="/@i18n/ja/docs/_snippets/wait-for-validation.md" /%} 

## 4.最終結果の確認

EscrowCancelトランザクションの識別用ハッシュを指定した[txメソッド][]を使用してトランザクションの最終ステータスを確認します。トランザクションのメタデータで`LedgerEntryType`が`Escrow`である`DeletedNode`を探します。また、エスクローに預託された支払いの送金元の`ModifiedNode`（タイプが`AccountRoot`）も探します。オブジェクトの`FinalFields`に、`Balance`フィールドのXRP返金額の増分が表示されている必要があります。

リクエスト:

{% tabs %}

{% tab label="Websocket" %}
{% code-snippet file="/_code-samples/escrow/websocket/tx-request-escrowcancel.json" language="json" /%}
{% /tab %}

{% /tabs %}

レスポンス:

{% tabs %}

{% tab label="Websocket" %}
{% code-snippet file="/_code-samples/escrow/websocket/tx-response-escrowcancel.json" language="json" /%}
{% /tab %}

{% /tabs %}

上記の例では、`r3wN3v2vTUkr5qd6daqDc2xE4LSysdVjkT`がEscrowの送金元であり、`Balance`が99999**8**9990 dropから99999**9**9990 dropに増加していることから、エスクローに預託されていた10,000 XRP dropが返金されたことがわかります（drop = 0.01XRP） 。

**ヒント:** Escrowを実行する[EscrowFinishトランザクション][]で使用する`OfferSequence`が不明な場合は、Escrowの`PreviousTxnID`フィールドのトランザクションの識別用ハッシュを指定した[txメソッド][]を使用して、そのEscrowを作成したトランザクションを検索します。Escrowを終了するときには、そのトランザクションの`Sequence`の値を`OfferSequence`の値として使用します。

{% raw-partial file="/docs/_snippets/common-links.md" /%}
