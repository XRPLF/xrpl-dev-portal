---
html: look-up-escrows.html
parent: use-escrows.html
seo:
    description: 送金元または送金先のアドレスを使って保留中のEscrowを検索します。
labels:
  - Escrow
  - スマートコントラクト
---
# Escrowの検索

保留中のEscrowはすべて[Escrowオブジェクト](../../../../concepts/payment-types/escrow.md)としてレジャーに保管されます。

Escrowオブジェクトを検索するには、[account_objectsメソッド][]で[送金元のアドレス](#送金元のアドレスによるescrowの検索)または[送金先のアドレス](#送金先のアドレスによるescrowの検索)を使用して検索します。

## 送金元のアドレスによるEscrowの検索

[account_objectsメソッド][]を使用して、送金元アドレスからEscrowオブジェクトを検索できます。

たとえば、送金元アドレスが`rfztBskAVszuS3s5Kq7zDS74QtHrw893fm`である保留中のEscrowオブジェクトをすべて検索するとします。以下のリクエストの例に従ってこの検索を実行できます。この例では送金元アドレスは`account`の値です。

リクエスト:

{% tabs %}

{% tab label="Websocket" %}
{% code-snippet file="/_code-samples/escrow/websocket/account_objects-request.json" language="json" /%}
{% /tab %}

{% /tabs %}


レスポンスは以下の例のようになります。このレスポンスには、送金元アドレスまたは送金先アドレスが`rfztBskAVszuS3s5Kq7zDS74QtHrw893fm`である保留中のEscrowオブジェクトがすべて含まれています。送金元アドレスは`Account`の値であり、送金先アドレスは`Destination`の値です。

この例では、2番目と4番目のEscrowオブジェクトが検索条件に一致しています。これは、これらのオブジェクトの`Account`（送金元のアドレス）の値が`rfztBskAVszuS3s5Kq7zDS74QtHrw893fm`に設定されているためです。

レスポンス:

{% tabs %}

{% tab label="Websocket" %}
{% code-snippet file="/_code-samples/escrow/websocket/account_objects-response.json" language="json" /%}
{% /tab %}

{% /tabs %}

## 送金先のアドレスによるEscrowの検索

[account_objectsメソッド][]を使用して、送金先アドレスからEscrowオブジェクトを検索できます。

**注記:** 送金先のアドレスによる保留中のEscrowオブジェクトの検索は、[fix1523 Amendment][]が2017/11/14に有効化された後に作成されたEscrowについてのみ行うことができます。

たとえば、送金先アドレスが`rfztBskAVszuS3s5Kq7zDS74QtHrw893fm`である保留中のEscrowオブジェクトをすべて検索するとします。以下のリクエストの例に従ってこの検索を実行できます。この例では送金先アドレスは`account`の値です。

リクエスト:

{% tabs %}

{% tab label="Websocket" %}
{% code-snippet file="/_code-samples/escrow/websocket/account_objects-request.json" language="json" /%}
{% /tab %}

{% /tabs %}


レスポンスは以下の例のようになります。レスポンスには送金先アドレスまたは送金元アドレスが`rfztBskAVszuS3s5Kq7zDS74QtHrw893fm`である保留中のEscrowオブジェクトがすべて含まれています。送金先アドレスは`Destination`の値であり、送金元アドレスは`Account`の値です。

この例では、1番目と3番目のEscrowオブジェクトが検索条件に一致しています。これは、これらのオブジェクトの`Destination`（送金先のアドレス）の値が`rfztBskAVszuS3s5Kq7zDS74QtHrw893fm`に設定されているためです。

レスポンス:

{% tabs %}

{% tab label="Websocket" %}
{% code-snippet file="/_code-samples/escrow/websocket/account_objects-response.json" language="json" /%}
{% /tab %}

{% /tabs %}

{% raw-partial file="/docs/_snippets/common-links.md" /%}
