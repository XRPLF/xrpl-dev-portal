# Escrow Tutorials

The XRP Ledger supports held payments, or _escrows_, that can be executed only after a certain time has passed or a cryptographic condition has been fulfilled. Escrows can only send XRP, not issued currencies. You can use these features to build publicly-provable smart contracts. This article explains basic tasks relating to held payments.

- [Send a time-held escrow](#send-a-time-held-escrow)
- [Send a conditionally-held escrow](#send-a-conditionally-held-escrow)
- [Look up escrows by sender](#look-up-escrows-by-sender)
<!-- {# Doesn't work yet:- Look up escrows by destination #}-->


## Send a Time-Held Escrow

The [EscrowCreate transaction][] type can create an escrow whose only condition for release is that a specific time has passed. To do this, use the `FinishAfter` field and omit the `Condition` field.

### 1. Calculate release time

You must [specify the time](reference-rippled.html#specifying-time) as whole **seconds since the Ripple Epoch**, which is 946684800 seconds after the UNIX epoch. For example, to release funds at midnight UTC on November 13, 2017:

<!-- MULTICODE_BLOCK_START -->

*JavaScript*

```js
// JavaScript Date() is natively expressed in milliseconds; convert to seconds
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

**Warning:** If you use a UNIX time in the `FinishAfter` field without converting to the equivalent Ripple time first, that sets the unlock time to an extra **30 years** in the future!

### 2. Submit EscrowCreate transaction

[Sign and submit](reference-transaction-format.html#signing-and-submitting-transactions) an [EscrowCreate transaction][]. Set the `FinishAfter` field of the transaction to the time when the held payment should be released. Omit the `Condition` field to make time the only condition for releasing the held payment. Set the `Destination` to the recipient, which may be the same address as the sender. Set the `Amount` to the total amount of [XRP, in drops](reference-rippled.html#specifying-currency-amounts), to escrow.

{% include 'snippets/secret-key-warning.md' %}

Request:

<!-- MULTICODE_BLOCK_START -->

*Websocket*

```json
{% include 'code_samples/escrow/websocket/submit-request-escrowcreate-time.json' %}
```

<!-- MULTICODE_BLOCK_END -->

Response:

<!-- MULTICODE_BLOCK_START -->

*Websocket*

```json
{% include 'code_samples/escrow/websocket/submit-response-escrowcreate-time.json' %}
```

<!-- MULTICODE_BLOCK_END -->


Take note of the transaction's identifying `hash` value so you can check its final status when it is included in a validated ledger version.

### 3. Wait for validation

{% include 'snippets/wait-for-validation.md' %}

### 4. Confirm that the escrow was created

Use the [`tx` command](reference-rippled.html#tx) with the transaction's identifying hash to check its final status. Look for a `CreatedNode` in the transaction metadata to indicate that it created an [Escrow ledger object](reference-ledger-format.html#escrow).

Request:

<!-- MULTICODE_BLOCK_START -->

*Websocket*

```json
{% include 'code_samples/escrow/websocket/tx-request-escrowcreate-time.json' %}
```

<!-- MULTICODE_BLOCK_END -->

Response:

<!-- MULTICODE_BLOCK_START -->

*Websocket*

```json
{% include 'code_samples/escrow/websocket/tx-response-escrowcreate-time.json' %}
```

<!-- MULTICODE_BLOCK_END -->

### 5. Wait for the release time

Held payments with a `FinishAfter` time cannot be finished until a ledger has already closed with a [`close_time` header field](reference-ledger-format.html#header-format) that is later than the Escrow node's `FinishAfter` time.

You can check the close time of the most recently-validated ledger with the [`ledger` command](reference-rippled.html#ledger):

Request:

<!-- MULTICODE_BLOCK_START -->

*Websocket*

```json
{% include 'code_samples/escrow/websocket/ledger-request.json' %}
```

<!-- MULTICODE_BLOCK_END -->

Response:

<!-- MULTICODE_BLOCK_START -->

*Websocket*

```json
{% include 'code_samples/escrow/websocket/ledger-response.json' %}
```

<!-- MULTICODE_BLOCK_END -->


### 6. Submit EscrowFinish transaction

[Sign and submit](reference-transaction-format.html#signing-and-submitting-transactions) an [EscrowFinish transaction][] to execute the release of the funds after the `FinishAfter` time has passed. Set the `Owner` field of the transaction to the `Account` address from the EscrowCreate transaction, and the `OfferSequence` to the `Sequence` number from the EscrowCreate transaction. For an escrow held only by time, omit the `Condition` and `Fulfillment` fields.

**Tip:** The EscrowFinish transaction is necessary because the XRP Ledger's state can only be modified by transactions. The sender of this transaction may be the recipient of the escrow, the original sender of the escrow, or any other XRP Ledger address.

{% include 'snippets/secret-key-warning.md' %}

Request:

<!-- MULTICODE_BLOCK_START -->

*Websocket*

```json
{% include 'code_samples/escrow/websocket/submit-request-escrowfinish-time.json' %}
```

<!-- MULTICODE_BLOCK_END -->

Response:

<!-- MULTICODE_BLOCK_START -->

*Websocket*

```json
{% include 'code_samples/escrow/websocket/submit-response-escrowfinish-time.json' %}
```

<!-- MULTICODE_BLOCK_END -->

Take note of the transaction's identifying `hash` value so you can check its final status when it is included in a validated ledger version.

### 7. Wait for validation

{% include 'snippets/wait-for-validation.md' %}

### 8. Confirm final result

Use the [`tx` command](reference-rippled.html#tx) with the EscrowFinish transaction's identifying hash to check its final status. In particular, look in the transaction metadata for a `ModifiedNode` of type `AccountRoot` for the destination of the escrowed payment. The `FinalFields` of the object should reflect the increase in XRP in the `Balance` field.

Request:

<!-- MULTICODE_BLOCK_START -->

*Websocket*

```json
{% include 'code_samples/escrow/websocket/tx-request-escrowfinish-time.json' %}
```

<!-- MULTICODE_BLOCK_END -->

Response:

<!-- MULTICODE_BLOCK_START -->

*Websocket*

```json
{% include 'code_samples/escrow/websocket/tx-response-escrowfinish-time.json' %}
```

<!-- MULTICODE_BLOCK_END -->


## Send a conditionally-held escrow

### 1. Generate condition and fulfillment

XRP Ledger escrows require PREIMAGE-SHA-256 [Crypto-Conditions](https://tools.ietf.org/html/draft-thomas-crypto-conditions-03). To calculate a condition and fulfillment in the proper format, you should use a Crypto-Conditions library such as [five-bells-condition](https://github.com/interledgerjs/five-bells-condition). For fulfillments, Ripple recommends using one of the following methods to generate the fulfillment:

- Use a cryptographically secure source of randomness to generate at least 32 random bytes.
- Follow Interledger Protocol's [PSK specification](https://github.com/interledger/rfcs/blob/master/0016-pre-shared-key/0016-pre-shared-key.md) and use an HMAC-SHA-256 of the ILP packet as the fulfillment.

Example JavaScript code for a random fulfillment and condition:

```js
cc = require('five-bells-condition');

const fulfillment_bytes = crypto.randomBytes(32);
const myFulfillment = new cc.PreimageSha256();
myFulfillment.setPreimage(fulfillment_bytes);
console.log(myFulfillment.serializeBinary().toString('hex'));
// (Random hexadecimal, 72 chars in length)
console.log(myFulfillment.getConditionBinary().toString('hex'));
// (Random hexadecimal, 78 chars in length)
```

Save the condition and the fulfillment for later. Be sure to keep the fulfillment secret until you want to finish executing the held payment. Anyone who knows the fulfillment can finish the escrow, releasing the held funds to their intended destination.


### 2. Calculate release or cancel time

A Conditional `Escrow` transaction must contain either a `CancelAfter` or `FinishAfter` field, or both. The `CancelAfter` field lets the XRP revert to the sender if the condition is not fulfilled before the specified time. The `FinishAfter` field specifies a time before which the escrow cannot execute, even if someone sends the correct fulfillment. Whichever field you provide, the time it specifies must be in the future.

Example for setting a `CancelAfter` time of 24 hours in the future:

<!-- MULTICODE_BLOCK_START -->

_JavaScript_

```js
const rippleOffset = 946684800;
const CancelAfter = Math.floor(Date.now() / 1000) + (24*60*60) - rippleOffset;
console.log(CancelAfter);
// Example: 556927412
```

<!--{# Striking Python example for now since we don't have full examples
_Python 2/3_

```python
from time import time
ripple_offset = 946684800
cancel_after = int(time()) + (24*60*60) - 946684800
print(cancel_after)
# Example: 556927412
```

#}-->

<!-- MULTICODE_BLOCK_END -->

**Warning:** In the XRP Ledger, you must specify time as **seconds since the Ripple Epoch** (2000-01-01T00:00:00Z). If you use a UNIX time in the `CancelAfter` or `FinishAfter` field without converting to the equivalent Ripple time first, that sets the unlock time to an extra **30 years** in the future!

### 3. Submit EscrowCreate transaction

[Sign and submit](reference-transaction-format.html#signing-and-submitting-transactions) an [EscrowCreate transaction][]. Set the `Condition` field of the transaction to the time when the held payment should be released. Set the `Destination` to the recipient, which can be the same address as the sender. Include the `CancelAfter` or `FinishAfter` time you calculated in the previous step. Set the `Amount` to the total amount of [XRP, in drops](reference-rippled.html#specifying-currency-amounts), to escrow.

{% include 'snippets/secret-key-warning.md' %}

Request:

<!-- MULTICODE_BLOCK_START -->

*Websocket*

```json
{% include 'code_samples/escrow/websocket/submit-request-escrowcreate-condition.json' %}
```

<!-- MULTICODE_BLOCK_END -->

Response:

<!-- MULTICODE_BLOCK_START -->

*Websocket*

```json
{% include 'code_samples/escrow/websocket/submit-response-escrowcreate-condition.json' %}
```

<!-- MULTICODE_BLOCK_END -->

### 4. Wait for validation

{% include 'snippets/wait-for-validation.md' %}

### 5. Confirm that the escrow was created

Use the [`tx` command](reference-rippled.html#tx) with the transaction's identifying hash to check its final status. In particular, look for a `CreatedNode` in the transaction metadata to indicate that it created an [Escrow ledger object](reference-ledger-format.html#escrow).

Request:

<!-- MULTICODE_BLOCK_START -->

*Websocket*

```json
{% include 'code_samples/escrow/websocket/tx-request-escrowcreate-condition.json' %}
```

<!-- MULTICODE_BLOCK_END -->

Response:

<!-- MULTICODE_BLOCK_START -->

*Websocket*

```json
{% include 'code_samples/escrow/websocket/tx-response-escrowcreate-condition.json' %}
```

<!-- MULTICODE_BLOCK_END -->

### 6. Submit EscrowFinish transaction

[Sign and submit](reference-transaction-format.html#signing-and-submitting-transactions) an [EscrowFinish transaction][] to execute the release of the funds after the `FinishAfter` time has passed. Set the `Owner` field of the transaction to the `Account` address from the EscrowCreate transaction, and the `OfferSequence` to the `Sequence` number from the EscrowCreate transaction. Set the `Condition` and `Fulfillment` fields to the condition and fulfillment values, in hexadecimal, that you generated in step 1. Set the `Fee` ([transaction cost](concept-transaction-cost.html)) value based on the size of the fulfillment in bytes: a conditional EscrowFinish requires at least 330 drops of XRP plus 10 drops per 16 bytes in the size of the fulfillment.

**Note:** If you included a `FinishAfter` field in the EscrowCreate transaction, you cannot execute it before that time has passed, even if you provide the correct fulfillment for the Escrow's condition. The EscrowFinish transaction fails with the [result code](reference-transaction-format.html#transaction-results) `tecNO_PERMISSION` if the previously-closed ledger's close time is before the `FinishAfter` time.

{% include 'snippets/secret-key-warning.md' %}

<!-- MULTICODE_BLOCK_START -->

_Websocket_

```json
{% include 'code_samples/escrow/websocket/submit-request-escrowfinish-condition.json' %}
```

<!-- MULTICODE_BLOCK_END -->

Response:

<!-- MULTICODE_BLOCK_START -->

_Websocket_

```json
{% include 'code_samples/escrow/websocket/submit-response-escrowfinish-condition.json' %}
```

<!-- MULTICODE_BLOCK_END -->

Take note of the transaction's identifying `hash` value so you can check its final status when it is included in a validated ledger version.

### 7. Wait for validation

{% include 'snippets/wait-for-validation.md' %}

### 8. Confirm final result

Use the [`tx` command](reference-rippled.html#tx) with the EscrowFinish transaction's identifying hash to check its final status. In particular, look in the transaction metadata for a `ModifiedNode` of type `AccountRoot` for the destination of the escrowed payment. The `FinalFields` of the object should reflect the increase in XRP in the `Balance` field.

Request:

```json
{% include 'code_samples/escrow/websocket/tx-request-escrowfinish-condition.json' %}
```

Response:

```json
{% include 'code_samples/escrow/websocket/tx-response-escrowfinish-condition.json' %}
```


## Look up escrows by sender

All pending escrows are stored in the ledger as [Escrow objects](reference-ledger-format.html#escrow). You can look up escrow nodes owned by your address using the [`account_objects` method](reference-rippled.html#account-objects).

Request:

<!-- MULTICODE_BLOCK_START -->

_Websocket_

```json
{% include 'code_samples/escrow/websocket/account_objects-request-sender.json' %}
```

<!-- MULTICODE_BLOCK_END -->

Response:

<!-- MULTICODE_BLOCK_START -->

_Websocket_

```json
{% include 'code_samples/escrow/websocket/account_objects-response-sender.json' %}
```

<!-- MULTICODE_BLOCK_END -->

**Tip:** If you don't know what `OfferSequence` to use in the [EscrowFinish transaction][] to execute an escrow, use the [`tx` method](reference-rippled.html) to look up the transaction that created the escrow, using the identifying hash of the transaction in the Escrow's `PreviousTxnID` field. Use the `Sequence` value of that transaction as the `OfferSequence` value when finishing the escrow.

{% include 'snippets/tx-type-links.md' %}
