# Escrow Tutorials

The XRP Ledger supports held payments, or _escrows_, that can be executed only after a certain time has passed or a cryptographic condition has been fulfilled. Escrows can only send XRP, not issued currencies. You can use these simple features to build publicly-provable smart contracts. This article explains basic tasks relating to held payments.

- [Send a time-held escrow](#send-a-time-held-escrow)
- Send a conditionally-held escrow
- Look up escrows where you are the destination
- Look up escrows where you are the sender/owner

## Availability of Escrow

Held payments been enabled by the ["Escrow" Amendment](concept-amendments.html#escrow) to the XRP Ledger Consensus Protocol since 2017-03-31. A previous version of the same functionality was available on the [Ripple Test Net](https://ripple.com/build/ripple-test-net/) by the name "Suspended Payments" (SusPay) in 2016.

When testing in [stand-alone mode](concept-stand-alone-mode.html), you can force the Escrow feature to be enabled locally regardless of the amendment status. Add the following stanza to your `rippled.cfg`:

    [features]
    Escrow

You can check the status of the Escrow amendment using the [`feature` command](reference-rippled.html#feature).


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

*Python 3*

```python
import datetime
release_date_utc = datetime.datetime(2017,11,13,0,0,0,tzinfo=datetime.timezone.utc)
release_date_ripple = int(release_date_utc.timestamp()) - 946684800
print(release_date_ripple)
# 563846400
```

<!-- MULTICODE_BLOCK_END -->

### 2. Submit EscrowCreate transaction

[Sign and submit](reference-transaction-format.html#signing-and-submitting-transactions) an [EscrowCreate transaction][]. Set the `FinishAfter` field of the transaction to the time when the held payment should be released. Omit the `Condition` field to make time the only condition for releasing the held payment. Set the `Destination` to the recipient, which can be the same address as the sender.

{% include 'snippets/secret-key-warning.md' %}

    $ rippled submit shqZZy2Rzs9ZqWTCQAdqc3bKgxnYq '{
    >    "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    >    "TransactionType": "EscrowCreate",
    >    "Amount": "10000",
    >    "Destination": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
    >    "FinishAfter": 563846400
    > }'

Take note of the transaction's identifying `hash` value so you can easily check its final status when it is included in a validated ledger version.

### 3. Close the ledger

On the live network or the Ripple Test Net, you can wait 4-7 seconds for the ledger to close automatically.

If you're running `rippled` in stand-alone mode, use the [`ledger_accept` command](reference-rippled.html#ledger-accept) to manually close the ledger:

    $ rippled ledger_accept
    Loading: "/home/mduo13/.config/ripple/rippled.cfg"
    Connecting to 127.0.0.1:5005
    {
       "result" : {
          "ledger_current_index" : 6,
          "status" : "success"
       }
    }

### 4. Confirm that the escrow was created

Use the [`tx` command](reference-rippled.html#tx) with the transaction's identifying hash to check its final status. In particular, look for a `CreatedNode` in the transaction metadata to indicate that it created an [Escrow ledger object](reference-ledger-format.html#escrow).

### 5. Wait for the release time

Held payments with a `FinishAfter` time cannot be finished until a ledger has already closed with a [`close_time` header field](reference-ledger-format.html#header-format) that is later than the Escrow node's `FinishAfter` time.

You can check the close time of the most recently-closed (not yet validated) ledger with the [`ledger` command](reference-rippled.html#ledger):

<!-- MULTICODE_BLOCK_START -->

*JSON-RPC*

```
{
    "method": "ledger",
    "params": [
        {
            "ledger_index": "validated"
        }
    ]
}
```

<!-- MULTICODE_BLOCK_END -->


### 6. Submit EscrowFinish transaction

[Sign and submit](reference-transaction-format.html#signing-and-submitting-transactions) an [EscrowCreate transaction][] to execute the release of the funds after the `FinishAfter` time has passed. Set the `Owner` field of the transaction to the `Account` address from the EscrowCreate transaction, and the `OfferSequence` to the `Sequence` number from the EscrowCreate transaction. For an escrow held only by time, omit the `Condition` and `Fulfillment` fields.

**Tip:** The EscrowFinish transaction is necessary because the XRP Ledger's state can only be modified by transactions. The sender of this transaction may be the recipient of the escrow, the original sender of the escrow, or any other XRP Ledger address.

{% include 'snippets/secret-key-warning.md' %}

    $ rippled submit shqZZy2Rzs9ZqWTCQAdqc3bKgxnYq '{
    >    "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    >    "TransactionType": "EscrowFinish",
    >    "Owner": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    >    "OfferSequence": 373,
    > }'

Take note of the transaction's identifying `hash` value so you can easily check its final status when it is included in a validated ledger version.

### 7. Close the ledger

On the live network or the Ripple Test Net, you can wait 4-7 seconds for the ledger to close automatically.

If you're running `rippled` in stand-alone mode, use the [`ledger_accept` command](reference-rippled.html#ledger-accept) to manually close the ledger:

    $ rippled ledger_accept
    Loading: "/home/mduo13/.config/ripple/rippled.cfg"
    Connecting to 127.0.0.1:5005
    {
       "result" : {
          "ledger_current_index" : 6,
          "status" : "success"
       }
    }

### 8. Confirm final result

Use the [`tx` command](reference-rippled.html#tx) with the EscrowFinish transaction's identifying hash to check its final status. In particular, look in the transaction metadata for a `ModifiedNode` of type `AccountRoot` for the destination of the escrowed payment. The `FinalFields` of the object should reflect the increase in XRP in the `Balance` field.


## Send a conditionally-held escrow

### 1. Generate condition and fulfillment

XRP Ledger escrows require PREIMGE-SHA-256 [Crypto-Conditions](https://tools.ietf.org/html/draft-thomas-crypto-conditions-03). To calculate a condition and fulfillment in the proper format, you should use a Crypto-Conditions library such as [five-bells-condition](https://github.com/interledgerjs/five-bells-condition). For fulfillments, Ripple recommends using one of the following methods to generate the fulfillment:

- Use a cryptographically secure source of randomness to generate at least 32 random bytes
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

Save the condition and the fulfillment for later. Be sure to keep the fulfillment secret until you want to finish executing the held payment; anyone who knows the fulfillment can finish the escrow, releasing the held funds to their intended destination.

### 2. Submit EscrowCreate transaction

[Sign and submit](reference-transaction-format.html#signing-and-submitting-transactions) an [EscrowCreate transaction][]. Set the `Condition` field of the transaction to the time when the held payment should be released. Set the `Destination` to the recipient, which can be the same address as the sender.

{% include 'snippets/secret-key-warning.md' %}

    ***TODO: example of conditional escrowcreate***


{% include 'snippets/tx-type-links.md' %}
