---
html: cancel-an-expired-escrow.html
parent: use-escrows.html
blurb: Cancel an expired escrow.
labels:
  - Escrow
  - Smart Contracts
---
# Cancel an Expired Escrow

An escrow in the XRP Ledger is expired when its `CancelAfter` time is lower than the `close_time` of the latest validated ledger. Escrows without a `CancelAfter` time never expire.

## 1. Get the latest validated ledger

Use the [ledger method](../../../references/http-websocket-apis/public-api-methods/ledger-methods/ledger.md) to look up the latest validated ledger and get the `close_time` value.

Request:

{% tabs %}

{% tab label="Websocket" %}
{% code-snippet file="/_code-samples/escrow/websocket/ledger-request-expiration.json" language="json" /%}
{% /tab %}

{% /tabs %}

Response:

{% tabs %}

{% tab label="Websocket" %}
{% code-snippet file="/_code-samples/escrow/websocket/ledger-response-expiration.json" language="json" /%}
{% /tab %}

{% /tabs %}

## 2. Look up the escrow

Use the [account_objects method](../../../references/http-websocket-apis/public-api-methods/account-methods/account_objects.md) and compare `CancelAfter` to `close_time`:

Request:

{% tabs %}

{% tab label="Websocket" %}
{% code-snippet file="/_code-samples/escrow/websocket/account_objects-request-expiration.json" language="json" /%}
{% /tab %}

{% /tabs %}

Response:

{% tabs %}

{% tab label="Websocket" %}
{% code-snippet file="/_code-samples/escrow/websocket/account_objects-response-expiration.json" language="json" /%}
{% /tab %}

{% /tabs %}

## 3. Submit EscrowCancel transaction

***Anyone*** can cancel an expired escrow in the XRP Ledger by sending an [EscrowCancel transaction](../../../references/protocol/transactions/types/escrowcancel.md). Set the `Owner` field of the transaction to the `Account` of the `EscrowCreate` transaction that created this escrow. Set the `OfferSequence` field to the `Sequence` of the `EscrowCreate` transaction.

**Tip:** If you don't know what `OfferSequence` to use, you can look up the transaction that created the Escrow: call the [tx method](../../../references/http-websocket-apis/public-api-methods/transaction-methods/tx.md) with the value of the Escrow's `PreviousTxnID` field. In `tx` response, use the `Sequence` value of that transaction as the `OfferSequence` value of the EscrowCancel transaction.

{% partial file="/_snippets/secret-key-warning.md" /%} <!--#{ fix md highlighting_ #}-->

Request:

{% tabs %}

{% tab label="Websocket" %}
{% code-snippet file="/_code-samples/escrow/websocket/submit-request-escrowcancel.json" language="json" /%}
{% /tab %}

{% /tabs %}

Response:

{% tabs %}

{% tab label="Websocket" %}
{% code-snippet file="/_code-samples/escrow/websocket/submit-response-escrowcancel.json" language="json" /%}
{% /tab %}

{% /tabs %}

Take note of the transaction's identifying `hash` value so you can check its final status when it is included in a validated ledger version.

## 4. Wait for validation

{% partial file="/_snippets/wait-for-validation.md" /%} <!--#{ fix md highlighting_ #}-->

## 5. Confirm final result

Use the [tx method](../../../references/http-websocket-apis/public-api-methods/transaction-methods/tx.md) with the `EscrowCancel` transaction's identifying hash to check its final status. Look in the transaction metadata for a `DeletedNode` with `LedgerEntryType` of `Escrow`. Also look for a `ModifiedNode` of type `AccountRoot` for the sender of the escrowed payment. The `FinalFields` of the object should show the increase in XRP in the `Balance` field for the returned XRP.

Request:

{% tabs %}

{% tab label="Websocket" %}
{% code-snippet file="/_code-samples/escrow/websocket/tx-request-escrowcancel.json" language="json" /%}
{% /tab %}

{% /tabs %}

Response:

{% tabs %}

{% tab label="Websocket" %}
{% code-snippet file="/_code-samples/escrow/websocket/tx-response-escrowcancel.json" language="json" /%}
{% /tab %}

{% /tabs %}

In the above example, `r3wN3v2vTUkr5qd6daqDc2xE4LSysdVjkT` is the sender of the escrow, and the increase in `Balance` from 99999**8**9990 drops to 99999**9**9990 drops represents the return of the escrowed 10,000 drops of XRP (0.01 XRP).


## See Also

- **Concepts:**
    - [What is XRP?](../../../introduction/what-is-xrp.md)
    - [Payment Types](../../../concepts/payment-types/index.md)
        - [Escrow](../../../concepts/payment-types/escrow.md)
- **Tutorials:**
    - [Send XRP](../../get-started/send-xrp.md)
    - [Look Up Transaction Results](../../../concepts/transactions/finality-of-results/look-up-transaction-results.md)
    - [Reliable Transaction Submission](../../../concepts/transactions/reliable-transaction-submission.md)
- **References:**
    - [EscrowCancel transaction](../../../references/protocol/transactions/types/escrowcancel.md)
    - [EscrowCreate transaction](../../../references/protocol/transactions/types/escrowcreate.md)
    - [EscrowFinish transaction](../../../references/protocol/transactions/types/escrowfinish.md)
    - [account_objects method](../../../references/http-websocket-apis/public-api-methods/account-methods/account_objects.md)
    - [tx method](../../../references/http-websocket-apis/public-api-methods/transaction-methods/tx.md)
    - [Escrow ledger object](../../../references/protocol/ledger-data/ledger-entry-types/escrow.md)
