---
html: send-a-conditionally-held-escrow.html
parent: use-escrows.html
seo:
    description: Create an escrow whose release is based on a condition being fulfilled.
labels:
  - Escrow
  - Smart Contracts
---
# Send a Conditionally-Held Escrow

## 1. Generate condition and fulfillment

XRP Ledger escrows require PREIMAGE-SHA-256 [crypto-conditions][]. To calculate a condition and fulfillment in the proper format, you should use a crypto-conditions library such as [five-bells-condition](https://github.com/interledgerjs/five-bells-condition). To generate the fulfillment:

- Use a cryptographically secure source of randomness to generate at least 32 random bytes.
- Follow Interledger Protocol's [PSK specification](https://github.com/interledger/rfcs/blob/master/deprecated/0016-pre-shared-key/0016-pre-shared-key.md) and use an HMAC-SHA-256 of the ILP packet as the fulfillment. <!-- SPELLING_IGNORE: psk -->

Example code for a random fulfillment and condition:

{% tabs %}

{% tab label="JavaScript" %}
```js
const cc = require('five-bells-condition')
const crypto = require('crypto')

const preimageData = crypto.randomBytes(32)
const fulfillment = new cc.PreimageSha256()
fulfillment.setPreimage(preimageData)

const condition = fulfillment.getConditionBinary().toString('hex').toUpperCase()
console.log('Condition:', condition)

// Keep secret until you want to finish the escrow
const fulfillment_hex = fulfillment.serializeBinary().toString('hex').toUpperCase()
console.log('Fulfillment:', fulfillment_hex)
```
{% /tab %}

{% tab label="Python" %}
```py
from os import urandom
from cryptoconditions import PreimageSha256

secret = urandom(32)

fulfillment = PreimageSha256(preimage=secret)

print("Condition", fulfillment.condition_binary.hex().upper())

# Keep secret until you want to finish the escrow
print("Fulfillment", fulfillment.serialize_binary().hex().upper())
```
{% /tab %}

{% /tabs %}

Save the condition and the fulfillment for later. Be sure to keep the fulfillment secret until you want to finish executing the held payment. Anyone who knows the fulfillment can finish the escrow, releasing the held funds to their intended destination.


## 2. Calculate release or cancel time

A Conditional `Escrow` transaction must contain either a `CancelAfter` or `FinishAfter` field, or both. The `CancelAfter` field lets the XRP revert to the sender if the condition is not fulfilled before the specified time. The `FinishAfter` field specifies a time before which the escrow cannot execute, even if someone sends the correct fulfillment. Whichever field you provide, the time it specifies must be in the future.

Example for setting a `CancelAfter` time of 24 hours in the future:

{% tabs %}

{% tab label="JavaScript" %}
```js
const rippleOffset = 946684800
const CancelAfter = Math.floor(Date.now() / 1000) + (24*60*60) - rippleOffset
console.log(CancelAfter)
// Example: 556927412
```
{% /tab %}

{% tab label="Python 2/3" %}
```python
from time import time
ripple_offset = 946684800
cancel_after = int(time()) + (24*60*60) - 946684800
print(cancel_after)
# Example: 556927412
```
{% /tab %}

{% /tabs %}

**Warning:** In the XRP Ledger, you must specify time as **[seconds since the Ripple Epoch][]**. If you use a UNIX time in the `CancelAfter` or `FinishAfter` field without converting it, that sets the unlock time to an extra **30 years** in the future!

## 3. Submit EscrowCreate transaction

[Sign and submit](../../../../concepts/transactions/index.md#signing-and-submitting-transactions) an [EscrowCreate transaction][]. Set the `Condition` field of the transaction to the time when the held payment should be released. Set the `Destination` to the recipient, which can be the same address as the sender. Include the `CancelAfter` or `FinishAfter` time you calculated in the previous step. Set the `Amount` to the total amount of [XRP, in drops][], to escrow.

{% partial file="/docs/_snippets/secret-key-warning.md" /%} 

Request:

{% tabs %}

{% tab label="Websocket" %}
{% code-snippet file="/_code-samples/escrow/websocket/submit-request-escrowcreate-condition.json" language="json" /%}
{% /tab %}

{% /tabs %}

Response:

{% tabs %}

{% tab label="Websocket" %}
{% code-snippet file="/_code-samples/escrow/websocket/submit-response-escrowcreate-condition.json" language="json" /%}
{% /tab %}

{% /tabs %}

## 4. Wait for validation

{% partial file="/docs/_snippets/wait-for-validation.md" /%} 

## 5. Confirm that the escrow was created

Use the [tx method][] with the transaction's identifying hash to check its final status. In particular, look for a `CreatedNode` in the transaction metadata to indicate that it created an [Escrow ledger object](../../../../concepts/payment-types/escrow.md).

Request:

{% tabs %}

{% tab label="Websocket" %}
{% code-snippet file="/_code-samples/escrow/websocket/tx-request-escrowcreate-condition.json" language="json" /%}
{% /tab %}

{% /tabs %}

Response:

{% tabs %}

{% tab label="Websocket" %}
{% code-snippet file="/_code-samples/escrow/websocket/tx-response-escrowcreate-condition.json" language="json" /%}
{% /tab %}

{% /tabs %}

## 6. Submit EscrowFinish transaction

[Sign and submit](../../../../concepts/transactions/index.md#signing-and-submitting-transactions) an [EscrowFinish transaction][] to execute the release of the funds after the `FinishAfter` time has passed. Set the `Owner` field of the transaction to the `Account` address from the EscrowCreate transaction, and the `OfferSequence` to the `Sequence` number from the EscrowCreate transaction. Set the `Condition` and `Fulfillment` fields to the condition and fulfillment values, in hexadecimal, that you generated in step 1. Set the `Fee` ([transaction cost](../../../../concepts/transactions/transaction-cost.md)) value based on the size of the fulfillment in bytes: a conditional EscrowFinish requires at least 330 drops of XRP plus 10 drops per 16 bytes in the size of the fulfillment.

**Note:** If you included a `FinishAfter` field in the EscrowCreate transaction, you cannot execute it before that time has passed, even if you provide the correct fulfillment for the Escrow's condition. The EscrowFinish transaction fails with the [result code](../../../../references/protocol/transactions/transaction-results/index.md) `tecNO_PERMISSION` if the previously-closed ledger's close time is before the `FinishAfter` time.

If the escrow has expired, you can only [cancel the escrow](cancel-an-expired-escrow.md) instead.

{% partial file="/docs/_snippets/secret-key-warning.md" /%} 

{% tabs %}

{% tab label="Websocket" %}
{% code-snippet file="/_code-samples/escrow/websocket/submit-request-escrowfinish-condition.json" language="json" /%}
{% /tab %}

{% /tabs %}

Response:

{% tabs %}

{% tab label="Websocket" %}
{% code-snippet file="/_code-samples/escrow/websocket/submit-response-escrowfinish-condition.json" language="json" /%}
{% /tab %}

{% /tabs %}

Take note of the transaction's identifying `hash` value so you can check its final status when it is included in a validated ledger version.

## 7. Wait for validation

{% partial file="/docs/_snippets/wait-for-validation.md" /%} 

## 8. Confirm final result

Use the [tx method][] with the EscrowFinish transaction's identifying hash to check its final status. In particular, look in the transaction metadata for a `ModifiedNode` of type `AccountRoot` for the destination of the escrowed payment. The `FinalFields` of the object should show the increase in XRP in the `Balance` field.

Request:

{% code-snippet file="/_code-samples/escrow/websocket/tx-request-escrowfinish-condition.json" language="json" /%}

Response:

{% code-snippet file="/_code-samples/escrow/websocket/tx-response-escrowfinish-condition.json" language="json" /%}



## See Also

- [Crypto-Conditions Specification][]
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
