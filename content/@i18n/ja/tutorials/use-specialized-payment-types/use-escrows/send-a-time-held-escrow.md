---
html: send-a-time-held-escrow.html
parent: use-escrows.html
blurb: 指定した時間が経過することがリリースの唯一の条件であるEscrowを作成します。
labels:
  - Escrow
  - スマートコントラクト
---
# 時間に基づくEscrowの送信

[EscrowCreateトランザクション][]タイプでは、リリースの唯一の条件が特定時刻を経過することであるEscrowを作成できます。このためには、`FinishAfter`フィールドを使用し、`Condition`フィールドを省略します。

## 1.リリース時刻の計算

時刻を **[Rippleエポック以降の経過秒数][]** として指定する必要があります。Rippleエポックは、UNIXエポックの946684800秒後です。たとえば、2017年11月13日の午前0時（UTC）に資金をリリースする場合、以下のようになります。

{% tabs %}

{% tab label="JavaScript" %}
```js
// JavaScript Date() is natively expressed in milliseconds; convert to seconds
const release_date_unix = Math.floor( new Date("2017-11-13T00:00:00Z") / 1000 );
const release_date_ripple = release_date_unix - 946684800;
console.log(release_date_ripple);
// 563846400
```
{% /tab %}

{% tab label="Python 3" %}
```python
import datetime
release_date_utc = datetime.datetime(2017,11,13,0,0,0,tzinfo=datetime.timezone.utc)
release_date_ripple = int(release_date_utc.timestamp()) - 946684800
print(release_date_ripple)
# 563846400
```
{% /tab %}

{% /tabs %}

**警告:** `FinishAfter`フィールドで、UNIX時刻を同等のRipple時刻に変換せずに使用すると、ロック解除時刻が30年先に設定されることになります。

## 2.EscrowCreateトランザクションの送信

[EscrowCreateトランザクション][]に[署名して送信](../../../concepts/transactions/index.md#トランザクションへの署名とトランザクションの送信)します。トランザクションの`FinishAfter`フィールドを、保留中の支払いがリリースされる時刻に設定します。`Condition`フィールドを省略して、時刻を保留中の支払いをリリースする唯一の条件とします。`Destination`を受取人に設定します。受取人と送金元のアドレスは同じでもかまいません。`Amount`を、Escrowする[XRP、drop単位][]の合計額に設定します。

{% partial file="/_snippets/secret-key-warning.md" /%} 

リクエスト:

{% tabs %}

{% tab label="Websocket" %}
{% code-snippet file="/_code-samples/escrow/websocket/submit-request-escrowcreate-time.json" language="json" /%}
{% /tab %}

{% /tabs %}

レスポンス:

{% tabs %}

{% tab label="Websocket" %}
{% code-snippet file="/_code-samples/escrow/websocket/submit-response-escrowcreate-time.json" language="json" /%}
{% /tab %}

{% /tabs %}


トランザクションの識別用`hash`値をメモしておきます。これにより、検証済みレジャーバージョンに記録されるときにその最終ステータスを確認できます。

## 3.検証の待機

{% partial file="/_snippets/wait-for-validation.md" /%} 

## 4.Escrowが作成されたことの確認

トランザクションの識別用ハッシュを指定した[txメソッド][]を使用して、トランザクションの最終ステータスを確認します。[Escrowレジャーオブジェクト](../../../concepts/payment-types/escrow.md)が作成されたことを示す`CreatedNode`をトランザクションメタデータで探します。

リクエスト:

{% tabs %}

{% tab label="Websocket" %}
{% code-snippet file="/_code-samples/escrow/websocket/tx-request-escrowcreate-time.json" language="json" /%}
{% /tab %}

{% /tabs %}

レスポンス:

{% tabs %}

{% tab label="Websocket" %}
{% code-snippet file="/_code-samples/escrow/websocket/tx-response-escrowcreate-time.json" language="json" /%}
{% /tab %}

{% /tabs %}

## 5.リリース時刻までの待機

`FinishAfter`時刻が指定されている保留中の支払いは、Escrowノードの`FinishAfter`時刻よりも後の[`close_time`ヘッダーフィールド](../../../references/protocol/ledger-data/ledger-header.md)の時刻でレジャーが閉鎖するまでは完了できません。

最新の検証済みレジャーの閉鎖時刻は、[ledgerメソッド][]を使用して検索できます。

リクエスト:

{% tabs %}

{% tab label="Websocket" %}
{% code-snippet file="/_code-samples/escrow/websocket/ledger-request.json" language="json" /%}
{% /tab %}

{% /tabs %}

レスポンス:

{% tabs %}

{% tab label="Websocket" %}
{% code-snippet file="/_code-samples/escrow/websocket/ledger-response.json" language="json" /%}
{% /tab %}

{% /tabs %}


## 6.EscrowFinishトランザクションの送信

`FinishAfter`の時刻が経過した後で資金のリリースを実行する[EscrowFinishトランザクション][]に[署名して送信](../../../concepts/transactions/index.md#トランザクションへの署名とトランザクションの送信)します。トランザクションの`Owner`フィールドにEscrowCreateトランザクションの`Account`アドレスを設定し、`OfferSequence` にEscrowCreateトランザクションの`Sequence`番号を設定します。時刻のみに基づいて保留されているEscrowの場合は、`Condition`フィールドと`Fulfillment`フィールドを省略します。

**ヒント:** XRP Ledgerの状態はトランザクションでしか変更できないため、EscrowFinishトランザクションが必要です。このトランザクションの送信者は、Escrowの受取人、Escrowの元としての送金人、またはその他のXRP Ledgerアドレスのいずれかです。

Escrowが有効期限切れの場合は、[Escrowの取消し](cancel-an-expired-escrow.md)だけが可能です。

{% partial file="/_snippets/secret-key-warning.md" /%} 

リクエスト:

{% tabs %}

{% tab label="Websocket" %}
{% code-snippet file="/_code-samples/escrow/websocket/submit-request-escrowfinish-time.json" language="json" /%}
{% /tab %}

{% /tabs %}

レスポンス:

{% tabs %}

{% tab label="Websocket" %}
{% code-snippet file="/_code-samples/escrow/websocket/submit-response-escrowfinish-time.json" language="json" /%}
{% /tab %}

{% /tabs %}

トランザクションの識別用`hash`値をメモしておきます。これにより、検証済みレジャーバージョンに記録されるときにその最終ステータスを確認できます。

## 7.検証の待機

{% partial file="/_snippets/wait-for-validation.md" /%} 

## 8.最終結果の確認

EscrowFinishトランザクションの識別用ハッシュを指定した[txメソッド][]を使用して、トランザクションの最終ステータスを確認します。特にトランザクションメタデータ内で、エスクローに預託された支払いの送金先の`ModifiedNode`（タイプが`AccountRoot`）を確認します。オブジェクトの`FinalFields`に、`Balance`フィールドのXRP返金額の増分が表示されている必要があります。

リクエスト:

{% tabs %}

{% tab label="Websocket" %}
{% code-snippet file="/_code-samples/escrow/websocket/tx-request-escrowfinish-time.json" language="json" /%}
{% /tab %}

{% /tabs %}

レスポンス:

{% tabs %}

{% tab label="Websocket" %}
{% code-snippet file="/_code-samples/escrow/websocket/tx-response-escrowfinish-time.json" language="json" /%}
{% /tab %}

{% /tabs %}

{% raw-partial file="/_snippets/common-links.md" /%}
