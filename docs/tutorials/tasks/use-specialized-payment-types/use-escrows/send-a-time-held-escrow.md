---
html: send-a-time-held-escrow.html
parent: use-escrows.html
seo:
    description: Create an escrow whose only condition for release is that a specific time has passed.
labels:
  - Escrow
  - Smart Contracts
---
# Send a Time-Held Escrow

The [EscrowCreate transaction][] type can create an escrow whose only condition for release is that a specific time has passed. To do this, use the `FinishAfter` field and omit the `Condition` field.

## 1. Calculate release time

You must specify the time as whole **[seconds since the Ripple Epoch][]**, which is 946684800 seconds after the UNIX epoch. For example, to release funds at midnight UTC on November 13, 2017:

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

**Warning:** If you use a UNIX time in the `FinishAfter` field without converting to the equivalent Ripple time first, that sets the unlock time to an extra **30 years** in the future!

## 2. Submit EscrowCreate transaction

[Sign and submit](../../../../concepts/transactions/index.md#signing-and-submitting-transactions) an [EscrowCreate transaction][]. Set the `FinishAfter` field of the transaction to the time when the held payment should be released. Omit the `Condition` field to make time the only condition for releasing the held payment. Set the `Destination` to the recipient, which may be the same address as the sender. Set the `Amount` to the total amount of [XRP, in drops][], to escrow.

{% partial file="/docs/_snippets/secret-key-warning.md" /%} 

Request:

{% tabs %}

{% tab label="Websocket" %}
{% code-snippet file="/_code-samples/escrow/websocket/submit-request-escrowcreate-time.json" language="json" /%}
{% /tab %}

{% /tabs %}

Response:

{% tabs %}

{% tab label="Websocket" %}
{% code-snippet file="/_code-samples/escrow/websocket/submit-response-escrowcreate-time.json" language="json" /%}
{% /tab %}

{% /tabs %}


Take note of the transaction's identifying `hash` value so you can check its final status when it is included in a validated ledger version.

## 3. Wait for validation

{% partial file="/docs/_snippets/wait-for-validation.md" /%} 

## 4. Confirm that the escrow was created

Use the [tx method][] with the transaction's identifying hash to check its final status. Look for a `CreatedNode` in the transaction metadata to indicate that it created an [Escrow ledger object](../../../../concepts/payment-types/escrow.md).

Request:

{% tabs %}

{% tab label="Websocket" %}
{% code-snippet file="/_code-samples/escrow/websocket/tx-request-escrowcreate-time.json" language="json" /%}
{% /tab %}

{% /tabs %}

Response:

{% tabs %}

{% tab label="Websocket" %}
{% code-snippet file="/_code-samples/escrow/websocket/tx-response-escrowcreate-time.json" language="json" /%}
{% /tab %}

{% /tabs %}

## 5. Wait for the release time

Held payments with a `FinishAfter` time cannot be finished until a ledger has already closed with a [`close_time` header field](../../../../references/protocol/ledger-data/ledger-header.md) that is later than the Escrow node's `FinishAfter` time.

You can check the close time of the most recently-validated ledger with the [ledger method][]:

Request:

{% tabs %}

{% tab label="Websocket" %}
{% code-snippet file="/_code-samples/escrow/websocket/ledger-request.json" language="json" /%}
{% /tab %}

{% /tabs %}

Response:

{% tabs %}

{% tab label="Websocket" %}
{% code-snippet file="/_code-samples/escrow/websocket/ledger-response.json" language="json" /%}
{% /tab %}

{% /tabs %}


## 6. Submit EscrowFinish transaction

[Sign and submit](../../../../concepts/transactions/index.md#signing-and-submitting-transactions) an [EscrowFinish transaction][] to execute the release of the funds after the `FinishAfter` time has passed. Set the `Owner` field of the transaction to the `Account` address from the EscrowCreate transaction, and the `OfferSequence` to the `Sequence` number from the EscrowCreate transaction. For an escrow held only by time, omit the `Condition` and `Fulfillment` fields.

***TODO: First half of this statement is covered by concept info already. It's also reiterated in escrow.md. The second portion about potential recipients should remain.***
**Tip:** The EscrowFinish transaction is necessary because the XRP Ledger's state can only be modified by transactions. The sender of this transaction may be the recipient of the escrow, the original sender of the escrow, or any other XRP Ledger address.

If the escrow has expired, you can only [cancel the escrow](cancel-an-expired-escrow.md) instead.

{% partial file="/docs/_snippets/secret-key-warning.md" /%} 

Request:

{% tabs %}

{% tab label="Websocket" %}
{% code-snippet file="/_code-samples/escrow/websocket/submit-request-escrowfinish-time.json" language="json" /%}
{% /tab %}

{% /tabs %}

Response:

{% tabs %}

{% tab label="Websocket" %}
{% code-snippet file="/_code-samples/escrow/websocket/submit-response-escrowfinish-time.json" language="json" /%}
{% /tab %}

{% /tabs %}

Take note of the transaction's identifying `hash` value so you can check its final status when it is included in a validated ledger version.

## 7. Wait for validation

{% partial file="/docs/_snippets/wait-for-validation.md" /%} 

## 8. Confirm final result

Use the [tx method][] with the EscrowFinish transaction's identifying hash to check its final status. In particular, look in the transaction metadata for a `ModifiedNode` of type `AccountRoot` for the destination of the escrowed payment. The `FinalFields` of the object should show the increase in XRP in the `Balance` field.

Request:

{% tabs %}

{% tab label="Websocket" %}
{% code-snippet file="/_code-samples/escrow/websocket/tx-request-escrowfinish-time.json" language="json" /%}
{% /tab %}

{% /tabs %}

Response:

{% tabs %}

{% tab label="Websocket" %}
{% code-snippet file="/_code-samples/escrow/websocket/tx-response-escrowfinish-time.json" language="json" /%}
{% /tab %}

{% /tabs %}


## See Also

- **Concepts:**
    - [What is XRP?](../../../../introduction/what-is-xrp.md)
    - [Payment Types](../../../../concepts/payment-types/index.md)
        - [Escrow](../../../../concepts/payment-types/escrow.md)
- **Tutorials:**
    - [Send XRP](../../send-xrp.md)
    - [Look Up Transaction Results](../../../../concepts/transactions/finality-of-results/look-up-transaction-results.md)
    - [Reliable Transaction Submission](../../../../concepts/transactions/reliable-transaction-submission.md)
- **References:**
    - [EscrowCancel transaction][]
    - [EscrowCreate transaction][]
    - [EscrowFinish transaction][]
    - [account_objects method][]
    - [tx method][]
    - [Escrow ledger object](../../../../references/protocol/ledger-data/ledger-entry-types/escrow.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
