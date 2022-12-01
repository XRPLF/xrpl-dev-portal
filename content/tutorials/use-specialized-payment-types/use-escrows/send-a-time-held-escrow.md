---
html: send-a-time-held-escrow.html
parent: use-escrows.html
blurb: Create an escrow whose only condition for release is that a specific time has passed.
labels:
  - Escrow
  - Smart Contracts
---
# Send a Time-Held Escrow

You can configure an escrow to release funds after a specific time has passed.

## 1. Calculate release time

You must specify the release time as whole seconds since **[the Ripple Epoch][]**, which you can calculate using this formula:
(Release_Time = Date_in_Unix_Time - 946684800)
***TODO: Format this properly.***

<!-- MULTICODE_BLOCK_START -->

*JavaScript*

```js
// JavaScript Date() is natively expressed in milliseconds; convert to seconds.
const release_date_unix = Math.floor( new Date("2017-11-13T00:00:00Z") / 1000 );
const release_date_ripple = release_date_unix - 946684800;
console.log(release_date_ripple);
// 563846400
```

<!--{# //Python code works OK but we don't have full examples, so hiding it
*Python 3*

```python
import datetime
release_date_utc = datetime.datetime(2017,11,13,0,0,0,tzinfo=datetime.timezone.utc)
release_date_ripple = int(release_date_utc.timestamp()) - 946684800
print(release_date_ripple)
# 563846400
```

#}-->

<!-- MULTICODE_BLOCK_END -->

## 2. Submit EscrowCreate transaction
<!--> Note to Dennis: I'd like to remove most links taking people out of the tutorial. It breaks the flow of thought and, like you've said earlier, it forces them to think when we're supposed to be doing most of the heavy lifting here. However most of these steps are includes from other pages, so it'd requiring modifying those and I'm not sure how that will affect the other pages they're being referenced. <-->
[Sign and submit](transaction-basics.html#signing-and-submitting-transactions) an [EscrowCreate transaction][]. Set the `FinishAfter` field to the calcualted release time. Set the `Amount` to the total [XRP, in drops][], to escrow.

{% include '_snippets/secret-key-warning.md' %} <!--#{ fix md highlighting_ #}-->

Request:

<!-- MULTICODE_BLOCK_START -->

*Websocket*

```json
{% include '_code-samples/escrow/websocket/submit-request-escrowcreate-time.json' %}
```

<!-- MULTICODE_BLOCK_END -->

Response:

<!-- MULTICODE_BLOCK_START -->

*Websocket*

```json
{% include '_code-samples/escrow/websocket/submit-response-escrowcreate-time.json' %}
```

<!-- MULTICODE_BLOCK_END -->


Take note of the transaction's identifying `hash` value so you can check its final status when it is included in a validated ledger version.

## 3. Wait for validation

{% include '_snippets/wait-for-validation.md' %} <!--#{ fix md highlighting_ #}-->

## 4. Confirm that the escrow was created

Use the [tx method][] with the transaction's identifying hash to check its final status. Look for a `CreatedNode` in the transaction metadata to indicate that it created an [Escrow ledger object](escrow.html).

Request:

<!-- MULTICODE_BLOCK_START -->

*Websocket*

```json
{% include '_code-samples/escrow/websocket/tx-request-escrowcreate-time.json' %}
```

<!-- MULTICODE_BLOCK_END -->

Response:

<!-- MULTICODE_BLOCK_START -->

*Websocket*

```json
{% include '_code-samples/escrow/websocket/tx-response-escrowcreate-time.json' %}
```

<!-- MULTICODE_BLOCK_END -->

## 5. Wait for the release time

Held payments release when a ledger closes with a [`close_time` header field](ledger-header.html) that is later than the Escrow node's `FinishAfter` time.

You can check the close time of the most recently-validated ledger with the [ledger method][]:

Request:

<!-- MULTICODE_BLOCK_START -->

*Websocket*

```json
{% include '_code-samples/escrow/websocket/ledger-request.json' %}
```

<!-- MULTICODE_BLOCK_END -->

Response:

<!-- MULTICODE_BLOCK_START -->

*Websocket*

```json
{% include '_code-samples/escrow/websocket/ledger-response.json' %}
```

<!-- MULTICODE_BLOCK_END -->


## 6. Submit EscrowFinish transaction

[Sign and submit](transaction-basics.html#signing-and-submitting-transactions) an [EscrowFinish transaction][] to execute the release of the funds. Set the `Owner` field of the transaction to the `Account` address from the EscrowCreate transaction, and the `OfferSequence` to the `Sequence` number from the `EscrowCreate` transaction. The sender of this transaction can be any XRP Ledger address.

If the escrow expires, you can only [cancel the escrow](cancel-an-expired-escrow.html).

{% include '_snippets/secret-key-warning.md' %} <!--#{ fix md highlighting_ #}-->

Request:

<!-- MULTICODE_BLOCK_START -->

*Websocket*

```json
{% include '_code-samples/escrow/websocket/submit-request-escrowfinish-time.json' %}
```

<!-- MULTICODE_BLOCK_END -->

Response:

<!-- MULTICODE_BLOCK_START -->

*Websocket*

```json
{% include '_code-samples/escrow/websocket/submit-response-escrowfinish-time.json' %}
```

<!-- MULTICODE_BLOCK_END -->

Take note of the transaction's identifying `hash` value so you can check its final status when it is included in a validated ledger version.

## 7. Wait for validation

{% include '_snippets/wait-for-validation.md' %} <!--#{ fix md highlighting_ #}-->

## 8. Confirm final result

Use the [tx method][] with the EscrowFinish transaction's identifying hash to check its final status. In particular, look in the transaction metadata for a `ModifiedNode` of type `AccountRoot` for the destination of the escrowed payment. The `FinalFields` of the object should show the increase in XRP in the `Balance` field.

Request:

<!-- MULTICODE_BLOCK_START -->

*Websocket*

```json
{% include '_code-samples/escrow/websocket/tx-request-escrowfinish-time.json' %}
```

<!-- MULTICODE_BLOCK_END -->

Response:

<!-- MULTICODE_BLOCK_START -->

*Websocket*

```json
{% include '_code-samples/escrow/websocket/tx-response-escrowfinish-time.json' %}
```

<!-- MULTICODE_BLOCK_END -->


## See Also

- **Concepts:**
    - [XRP](xrp.html)
    - [Payment Types](payment-types.html)
        - [Escrow](escrow.html)
- **Tutorials:**
    - [Send XRP](send-xrp.html)
    - [Look Up Transaction Results](look-up-transaction-results.html)
    - [Reliable Transaction Submission](reliable-transaction-submission.html)
- **References:**
    - [EscrowCancel transaction][]
    - [EscrowCreate transaction][]
    - [EscrowFinish transaction][]
    - [account_objects method][]
    - [tx method][]
    - [Escrow ledger object](escrow-object.html)

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
