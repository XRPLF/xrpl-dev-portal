# Escrow Tutorials

The XRP Ledger supports held payments, or _escrows_, that can be executed only after a certain time has passed or a cryptographic condition has been fulfilled. Escrows can only send XRP, not issued currencies. You can use these simple features to build publicly-provable smart contracts. This article explains basic tasks relating to held payments.

- [Send a time-held escrow](#send-a-time-held-escrow)
- [Send a conditionally-held escrow](#send-a-conditionally-held-escrow)
- [Look up escrows where you are the sender](#look-up-escrows-where-you-are-the-sender)
- Look up escrows where you are the destination

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

**Warning:** If you use a UNIX time in the `FinishAfter` field without converting to the equivalent Ripple time first, that sets the unlock time to an extra **30 years** in the future!

### 2. Submit EscrowCreate transaction

[Sign and submit](reference-transaction-format.html#signing-and-submitting-transactions) an [EscrowCreate transaction][]. Set the `FinishAfter` field of the transaction to the time when the held payment should be released. Omit the `Condition` field to make time the only condition for releasing the held payment. Set the `Destination` to the recipient, which can be the same address as the sender.

{% include 'snippets/secret-key-warning.md' %}

    $ rippled submit s████████████████████████████ '{
    >    "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    >    "TransactionType": "EscrowCreate",
    >    "Amount": "10000",
    >    "Destination": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
    >    "FinishAfter": 563846400
    > }'

Take note of the transaction's identifying `hash` value so you can easily check its final status when it is included in a validated ledger version.

### 3. Wait for validation

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

    $ rippled submit s████████████████████████████ '{
    >    "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    >    "TransactionType": "EscrowFinish",
    >    "Owner": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    >    "OfferSequence": 373,
    > }'

Take note of the transaction's identifying `hash` value so you can easily check its final status when it is included in a validated ledger version.

### 7. Wait for validation

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


### 2. Calculate release or cancel time

A Conditional `Escrow` transaction must contain either a `CancelAfter` or `FinishAfter` field, or both. The `CancelAfter` field lets the XRP revert to the sender if the condition is not fulfilled before the specified time. The `FinishAfter` field specifies a time before which the escrow cannot execute, even if someone sends the correct fulfillment. Whichever field you provide, the time it specifies must be in the future.

Example for setting a `CancelAfter` time of 24 hours in the future:

<!-- MULTICODE_BLOCK_START -->

_JavaScript_

```js
const rippleOffset = 946684800;
const CancelAfter = Math.floor(Date.now() / 1000) + (24*60*60) - rippleOffset;
// Example: 556927412
```

_Python 2/3_

```python
from time import time
ripple_offset = 946684800
cancel_after = int(time()) + (24*60*60) - 946684800
# Example: 556927412
```

<!-- MULTICODE_BLOCK_END -->

**Warning:** In the XRP Ledger, you must specify time as seconds since the Ripple Epoch (2000-01-01T00:00:00Z). If you use a UNIX time in the `CancelAfter` or `FinishAfter` field without converting to the equivalent Ripple time first, that sets the unlock time to an extra **30 years** in the future!

### 3. Submit EscrowCreate transaction

[Sign and submit](reference-transaction-format.html#signing-and-submitting-transactions) an [EscrowCreate transaction][]. Set the `Condition` field of the transaction to the time when the held payment should be released. Set the `Destination` to the recipient, which can be the same address as the sender. Include the `CancelAfter` or `FinishAfter` time you calculated in the previous step.

{% include 'snippets/secret-key-warning.md' %}

Request:

<!-- MULTICODE_BLOCK_START -->

*Websocket*

```json
{
  "command": "submit",
  "secret": "s████████████████████████████",
  "tx_json": {
    "Account": "rEhw9vD98ZrkY4tZPvkZst5H18RysqFdaB",
    "TransactionType": "EscrowCreate",
    "Amount": "100000",
    "Destination": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "Condition": "A0258020E24D9E1473D4DF774F6D8E089067282034E4FA7ECACA2AD2E547953B2C113CBD810120",
    "CancelAfter": 556927412
  }
}
```

<!-- MULTICODE_BLOCK_END -->

Response:

<!-- MULTICODE_BLOCK_START -->

*Websocket*

```json
{
  "id": 1,
  "status": "success",
  "type": "response",
  "result": {
    "engine_result": "tesSUCCESS",
    "engine_result_code": 0,
    "engine_result_message": "The transaction was applied. Only final in a validated ledger.",
    "tx_blob": "120001228000000024000000052024213209B46140000000000186A068400000000000000A732103E498E35BC1E109C5995BD3AB0A6D4FFAB61B853C8F6010FABC5DABAF34478B61744730450221008AC8BDC2151D5EF956197F0E6E89A4F49DEADC1AC38367870E444B1EA8D88D97022075E31427B455DFF87F0F22B849C71FC3987A91C19D63B6D0242E808347EC8A8F701127A0258020E24D9E1473D4DF774F6D8E089067282034E4FA7ECACA2AD2E547953B2C113CBD81012081149A2AA667E1517EFA8A6B552AB2EDB859A99F26B283144B4E9C06F24296074F7BC48F92A97916C6DC5EA9",
    "tx_json": {
      "Account": "rEhw9vD98ZrkY4tZPvkZst5H18RysqFdaB",
      "Amount": "100000",
      "CancelAfter": 556927412,
      "Condition": "A0258020E24D9E1473D4DF774F6D8E089067282034E4FA7ECACA2AD2E547953B2C113CBD810120",
      "Destination": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "Fee": "10",
      "Flags": 2147483648,
      "Sequence": 5,
      "SigningPubKey": "03E498E35BC1E109C5995BD3AB0A6D4FFAB61B853C8F6010FABC5DABAF34478B61",
      "TransactionType": "EscrowCreate",
      "TxnSignature": "30450221008AC8BDC2151D5EF956197F0E6E89A4F49DEADC1AC38367870E444B1EA8D88D97022075E31427B455DFF87F0F22B849C71FC3987A91C19D63B6D0242E808347EC8A8F",
      "hash": "E22D1F6EB006CAD35E0DBD3B4F3748427055E4C143EBE95AA6603823AEEAD324"
    }
  }
}
```

<!-- MULTICODE_BLOCK_END -->

### 4. Wait for validation

On the live network or the Ripple Test Net, you can wait 4-7 seconds for the ledger to close automatically.

If you're running `rippled` in stand-alone mode, use the [`ledger_accept` command](reference-rippled.html#ledger-accept) to manually close the ledger:

    $ rippled ledger_accept
    Loading: "/home/mduo13/.config/ripple/rippled.cfg"
    Connecting to 127.0.0.1:5005
    {
       "result" : {
          "ledger_current_index" : 7,
          "status" : "success"
       }
    }

### 5. Confirm that the escrow was created

Use the [`tx` command](reference-rippled.html#tx) with the transaction's identifying hash to check its final status. In particular, look for a `CreatedNode` in the transaction metadata to indicate that it created an [Escrow ledger object](reference-ledger-format.html#escrow).

Request:

<!-- MULTICODE_BLOCK_START -->

*Websocket*

```json
{
  "command": "tx",
  "transaction": "E22D1F6EB006CAD35E0DBD3B4F3748427055E4C143EBE95AA6603823AEEAD324"
}
```

<!-- MULTICODE_BLOCK_END -->

Response:

<!-- MULTICODE_BLOCK_START -->

*Websocket*

```json
{
  "id": 3,
  "status": "success",
  "type": "response",
  "result": {
    "Account": "rEhw9vD98ZrkY4tZPvkZst5H18RysqFdaB",
    "Amount": "100000",
    "CancelAfter": 556927412,
    "Condition": "A0258020E24D9E1473D4DF774F6D8E089067282034E4FA7ECACA2AD2E547953B2C113CBD810120",
    "Destination": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "Fee": "10",
    "Flags": 2147483648,
    "Sequence": 5,
    "SigningPubKey": "03E498E35BC1E109C5995BD3AB0A6D4FFAB61B853C8F6010FABC5DABAF34478B61",
    "TransactionType": "EscrowCreate",
    "TxnSignature": "30450221008AC8BDC2151D5EF956197F0E6E89A4F49DEADC1AC38367870E444B1EA8D88D97022075E31427B455DFF87F0F22B849C71FC3987A91C19D63B6D0242E808347EC8A8F",
    "date": 556841101,
    "hash": "E22D1F6EB006CAD35E0DBD3B4F3748427055E4C143EBE95AA6603823AEEAD324",
    "inLedger": 1772019,
    "ledger_index": 1772019,
    "meta": {
      "AffectedNodes": [
        {
          "ModifiedNode": {
            "LedgerEntryType": "AccountRoot",
            "LedgerIndex": "13F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8",
            "PreviousTxnID": "52C4F626FE6F33699B6BE8ADF362836DDCE9B0B1294BFAA15D65D61501350BE6",
            "PreviousTxnLgrSeq": 1771204
          }
        },
        {
          "ModifiedNode": {
            "FinalFields": {
              "Flags": 0,
              "Owner": "rEhw9vD98ZrkY4tZPvkZst5H18RysqFdaB",
              "RootIndex": "4B4EBB6D8563075813D47491CC325865DFD3DC2E94889F0F39D59D9C059DD81F"
            },
            "LedgerEntryType": "DirectoryNode",
            "LedgerIndex": "4B4EBB6D8563075813D47491CC325865DFD3DC2E94889F0F39D59D9C059DD81F"
          }
        },
        {
          "ModifiedNode": {
            "FinalFields": {
              "Account": "rEhw9vD98ZrkY4tZPvkZst5H18RysqFdaB",
              "Balance": "9999798970",
              "Flags": 0,
              "OwnerCount": 1,
              "Sequence": 6
            },
            "LedgerEntryType": "AccountRoot",
            "LedgerIndex": "5F3B7107F4B524367A173A2B0EAB66E8CC4D2178C1B0C0528CB2F73A8B6BF254",
            "PreviousFields": {
              "Balance": "9999898980",
              "OwnerCount": 0,
              "Sequence": 5
            },
            "PreviousTxnID": "52C4F626FE6F33699B6BE8ADF362836DDCE9B0B1294BFAA15D65D61501350BE6",
            "PreviousTxnLgrSeq": 1771204
          }
        },
        {
          "CreatedNode": {
            "LedgerEntryType": "Escrow",
            "LedgerIndex": "E2CF730A31FD419382350C9DBD8DB7CD775BA5AA9B97A9BE9AB07304AA217A75",
            "NewFields": {
              "Account": "rEhw9vD98ZrkY4tZPvkZst5H18RysqFdaB",
              "Amount": "100000",
              "CancelAfter": 556927412,
              "Condition": "A0258020E24D9E1473D4DF774F6D8E089067282034E4FA7ECACA2AD2E547953B2C113CBD810120",
              "Destination": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
            }
          }
        }
      ],
      "TransactionIndex": 0,
      "TransactionResult": "tesSUCCESS"
    },
    "validated": true
  }
}
```

<!-- MULTICODE_BLOCK_END -->

### 6. Submit EscrowFinish transaction

[Sign and submit](reference-transaction-format.html#signing-and-submitting-transactions) an [EscrowCreate transaction][] to execute the release of the funds after the `FinishAfter` time has passed. Set the `Owner` field of the transaction to the `Account` address from the EscrowCreate transaction, and the `OfferSequence` to the `Sequence` number from the EscrowCreate transaction. Set the `Condition` and `Fulfillment` fields to the condition and fulfillment values, in hexadecimal, that you generated in step 1.

**Note:** If you included a `FinishAfter` field in the EscrowCreate transaction, you cannot execute it before that time has passed, even if you provide the correct fulfillment for the Escrow's condition. The EscrowFinish transaction fails with the [result code](reference-transactions.html#transaction-results) `tecNO_PERMISSION` if the previously-closed ledger's close time is before the `FinishAfter` time.

{% include 'snippets/secret-key-warning.md' %}

<!-- MULTICODE_BLOCK_START -->

_Websocket_

```json
{
  "command": "submit",
  "secret": "s████████████████████████████",
    "tx_json": {
    "Account": "rEhw9vD98ZrkY4tZPvkZst5H18RysqFdaB",
    "TransactionType": "EscrowFinish",
    "Owner": "rEhw9vD98ZrkY4tZPvkZst5H18RysqFdaB",
    "OfferSequence": 5,
    "Condition": "A0258020E24D9E1473D4DF774F6D8E089067282034E4FA7ECACA2AD2E547953B2C113CBD810120",
    "Fulfillment": "A0228020D280D1A02BAD0D2EBC0528B92E9BF37AC3E2530832C2C52620307135156F1048",
    "Fee": "500"
  }
}
```

<!-- MULTICODE_BLOCK_END -->

Response:

<!-- MULTICODE_BLOCK_START -->

_Websocket_

```json
{
  "id": 4,
  "status": "success",
  "type": "response",
  "result": {
    "engine_result": "tesSUCCESS",
    "engine_result_code": 0,
    "engine_result_message": "The transaction was applied. Only final in a validated ledger.",
    "tx_blob": "120002228000000024000000062019000000056840000000000001F4732103E498E35BC1E109C5995BD3AB0A6D4FFAB61B853C8F6010FABC5DABAF34478B617446304402207DE4EA9C8655E75BA01F96345B3F62074313EB42C15D9C4871E30F02202D2BA50220070E52AD308A31AC71E33BA342F31B68D1D1B2A7A3A3ED6E8552CA3DCF14FBB2701024A0228020D280D1A02BAD0D2EBC0528B92E9BF37AC3E2530832C2C52620307135156F1048701127A0258020E24D9E1473D4DF774F6D8E089067282034E4FA7ECACA2AD2E547953B2C113CBD81012081149A2AA667E1517EFA8A6B552AB2EDB859A99F26B282149A2AA667E1517EFA8A6B552AB2EDB859A99F26B2",
    "tx_json": {
      "Account": "rEhw9vD98ZrkY4tZPvkZst5H18RysqFdaB",
      "Condition": "A0258020E24D9E1473D4DF774F6D8E089067282034E4FA7ECACA2AD2E547953B2C113CBD810120",
      "Fee": "500",
      "Flags": 2147483648,
      "Fulfillment": "A0228020D280D1A02BAD0D2EBC0528B92E9BF37AC3E2530832C2C52620307135156F1048",
      "OfferSequence": 5,
      "Owner": "rEhw9vD98ZrkY4tZPvkZst5H18RysqFdaB",
      "Sequence": 6,
      "SigningPubKey": "03E498E35BC1E109C5995BD3AB0A6D4FFAB61B853C8F6010FABC5DABAF34478B61",
      "TransactionType": "EscrowFinish",
      "TxnSignature": "304402207DE4EA9C8655E75BA01F96345B3F62074313EB42C15D9C4871E30F02202D2BA50220070E52AD308A31AC71E33BA342F31B68D1D1B2A7A3A3ED6E8552CA3DCF14FBB2",
      "hash": "0E88368CAFC69A722ED829FAE6E2DD3575AE9C192691E60B5ACDF706E219B2BF"
    }
  }
}
```

<!-- MULTICODE_BLOCK_END -->

Take note of the transaction's identifying `hash` value so you can easily check its final status when it is included in a validated ledger version.

### 7. Wait for validation

On the live network or the Ripple Test Net, you can wait 4-7 seconds for the ledger to close automatically.

If you're running `rippled` in stand-alone mode, use the [`ledger_accept` command](reference-rippled.html#ledger-accept) to manually close the ledger:

    $ rippled ledger_accept
    Loading: "/home/mduo13/.config/ripple/rippled.cfg"
    Connecting to 127.0.0.1:5005
    {
       "result" : {
          "ledger_current_index" : 8,
          "status" : "success"
       }
    }

### 8. Confirm final result

Use the [`tx` command](reference-rippled.html#tx) with the EscrowFinish transaction's identifying hash to check its final status. In particular, look in the transaction metadata for a `ModifiedNode` of type `AccountRoot` for the destination of the escrowed payment. The `FinalFields` of the object should reflect the increase in XRP in the `Balance` field.

Request:

```json
{
  "id": 20,
  "command": "tx",
  "transaction": "52C4F626FE6F33699B6BE8ADF362836DDCE9B0B1294BFAA15D65D61501350BE6"
}
```

Response:

```json
{
  "id": 20,
  "status": "success",
  "type": "response",
  "result": {
    "Account": "rEhw9vD98ZrkY4tZPvkZst5H18RysqFdaB",
    "Condition": "A0258020E24D9E1473D4DF774F6D8E089067282034E4FA7ECACA2AD2E547953B2C113CBD810120",
    "Fee": "500",
    "Flags": 2147483648,
    "Fulfillment": "A0228020D280D1A02BAD0D2EBC0528B92E9BF37AC3E2530832C2C52620307135156F1048",
    "OfferSequence": 2,
    "Owner": "rEhw9vD98ZrkY4tZPvkZst5H18RysqFdaB",
    "Sequence": 4,
    "SigningPubKey": "03E498E35BC1E109C5995BD3AB0A6D4FFAB61B853C8F6010FABC5DABAF34478B61",
    "TransactionType": "EscrowFinish",
    "TxnSignature": "3045022100925FEBE21C2E57F81C472A4E5869CAB1D0164C472A46532F39F6F9F7ED6846D002202CF9D9063ADC4CC0ADF4C4692B7EE165C5D124CAA855649389E245D993F41D4D",
    "date": 556838610,
    "hash": "52C4F626FE6F33699B6BE8ADF362836DDCE9B0B1294BFAA15D65D61501350BE6",
    "inLedger": 1771204,
    "ledger_index": 1771204,
    "meta": {
      "AffectedNodes": [
        {
          "ModifiedNode": {
            "FinalFields": {
              "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
              "Balance": "400100000",
              "Flags": 0,
              "OwnerCount": 0,
              "Sequence": 1
            },
            "LedgerEntryType": "AccountRoot",
            "LedgerIndex": "13F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8",
            "PreviousFields": {
              "Balance": "400000000"
            },
            "PreviousTxnID": "795CBC8AFAAB9DC7BD9944C7FAEABF9BB0802A84520BC649213AD6A2C3256C95",
            "PreviousTxnLgrSeq": 1770775
          }
        },
        {
          "ModifiedNode": {
            "FinalFields": {
              "Flags": 0,
              "Owner": "rEhw9vD98ZrkY4tZPvkZst5H18RysqFdaB",
              "RootIndex": "4B4EBB6D8563075813D47491CC325865DFD3DC2E94889F0F39D59D9C059DD81F"
            },
            "LedgerEntryType": "DirectoryNode",
            "LedgerIndex": "4B4EBB6D8563075813D47491CC325865DFD3DC2E94889F0F39D59D9C059DD81F"
          }
        },
        {
          "ModifiedNode": {
            "FinalFields": {
              "Account": "rEhw9vD98ZrkY4tZPvkZst5H18RysqFdaB",
              "Balance": "9999898980",
              "Flags": 0,
              "OwnerCount": 0,
              "Sequence": 5
            },
            "LedgerEntryType": "AccountRoot",
            "LedgerIndex": "5F3B7107F4B524367A173A2B0EAB66E8CC4D2178C1B0C0528CB2F73A8B6BF254",
            "PreviousFields": {
              "Balance": "9999899480",
              "OwnerCount": 1,
              "Sequence": 4
            },
            "PreviousTxnID": "5C2A1E7B209A7404D3722A010D331A8C1C853109A47DDF620DE5E3D59F026581",
            "PreviousTxnLgrSeq": 1771042
          }
        },
        {
          "DeletedNode": {
            "FinalFields": {
              "Account": "rEhw9vD98ZrkY4tZPvkZst5H18RysqFdaB",
              "Amount": "100000",
              "Condition": "A0258020E24D9E1473D4DF774F6D8E089067282034E4FA7ECACA2AD2E547953B2C113CBD810120",
              "Destination": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
              "FinishAfter": 556838185,
              "Flags": 0,
              "OwnerNode": "0000000000000000",
              "PreviousTxnID": "795CBC8AFAAB9DC7BD9944C7FAEABF9BB0802A84520BC649213AD6A2C3256C95",
              "PreviousTxnLgrSeq": 1770775
            },
            "LedgerEntryType": "Escrow",
            "LedgerIndex": "DC524D17B3F650E7A215B332F418E54AE59B0DFC5392E74958B0037AFDFE8C8D"
          }
        }
      ],
      "TransactionIndex": 1,
      "TransactionResult": "tesSUCCESS"
    },
    "validated": true
  }
}
```


## Look up escrows where you are the sender

All pending escrows are stored in the ledger as [Escrow objects](reference-ledger-format.html#escrow). You can look up escrow nodes owned by your address using the [`account_objects` method](reference-rippled.html#account-objects).

Request:

<!-- MULTICODE_BLOCK_START -->

_Websocket_

```json
{
  "id": 5,
  "command": "account_objects",
  "account": "rEhw9vD98ZrkY4tZPvkZst5H18RysqFdaB",
  "ledger_index": "validated",
  "type": "escrow"
}
```

<!-- MULTICODE_BLOCK_END -->

Response:

<!-- MULTICODE_BLOCK_START -->

_Websocket_

```json
{
  "id": 5,
  "status": "success",
  "type": "response",
  "result": {
    "account": "rEhw9vD98ZrkY4tZPvkZst5H18RysqFdaB",
    "account_objects": [
      {
        "Account": "rEhw9vD98ZrkY4tZPvkZst5H18RysqFdaB",
        "Amount": "100000",
        "CancelAfter": 556927412,
        "Condition": "A0258020E24D9E1473D4DF774F6D8E089067282034E4FA7ECACA2AD2E547953B2C113CBD810120",
        "Destination": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
        "Flags": 0,
        "LedgerEntryType": "Escrow",
        "OwnerNode": "0000000000000000",
        "PreviousTxnID": "E22D1F6EB006CAD35E0DBD3B4F3748427055E4C143EBE95AA6603823AEEAD324",
        "PreviousTxnLgrSeq": 1772019,
        "index": "E2CF730A31FD419382350C9DBD8DB7CD775BA5AA9B97A9BE9AB07304AA217A75"
      }
    ],
    "ledger_hash": "F2ABEA175F4AB871845B01CB51E4324DBA2C2553EC34448D4AB1EB0A3F2D8EFB",
    "ledger_index": 1772020,
    "validated": true
  }
}
```

<!-- MULTICODE_BLOCK_END -->

**Tip:** If you don't know what `OfferSequence` to use in the [EscrowFinish transaction][] to execute an escrow, use the [`tx` method](reference-rippled.html) to look up the transaction that created the escrow, using the identifying hash of the transaction in the Escrow's `PreviousTxnID` field. Use the `Sequence` value of that transaction as the `OfferSequence` value when finishing the escrow.

{% include 'snippets/tx-type-links.md' %}
