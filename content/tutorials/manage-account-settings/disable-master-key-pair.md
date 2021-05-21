---
html: disable-master-key-pair.html
parent: manage-account-settings.html
blurb: Disable the master key that is mathematically associated with an address.
---
# Disable Master Key Pair

This page describes how to disable the [master key pair](cryptographic-keys.html) that is mathematically associated with an [account](accounts.html)'s address. You should do this if your account's master key pair may have been compromised, or if you want to make [multi-signing](multi-signing.html) the _only_ way to submit transactions from your account.

**Warning:** Disabling the master key pair removes one method of [authorizing transactions](transaction-basics.html#authorizing-transactions). You should be sure you can use one of the other ways of authorizing transactions, such as with a regular key or by multi-signing, before you disable the master key pair. (For example, if you [assigned a regular key pair](assign-a-regular-key-pair.html), make sure that you can successfully submit transactions with that regular key.) Due to the decentralized nature of the XRP Ledger, no one can restore access to your account if you cannot use the remaining ways of authorizing transactions.

**To disable the master key pair, you must use the master key pair.** However, you can _re-enable_ the master key pair using any other method of authorizing transactions.

## Prerequisites

To disable the master key pair for an account, you must meet the following prerequisites:

- You must have an XRP Ledger [account](accounts.html) and you must be able to sign and submit transactions from that account using the master key pair. See also: [Set Up Secure Signing](set-up-secure-signing.html). Two common ways this can work are:
    - You know the account's master seed value. A seed value is commonly represented as a [base58][] value starting with "s", such as `sn3nxiW7v8KXzPzAqzyHXbSSKNuN9`.
    - Or, you use a [dedicated signing device](set-up-secure-signing.html#use-a-dedicated-signing-device) that stores the seed value securely, so you don't need to know it.
- Your account must have at least one method of authorizing transactions other than the master key pair. In other words, you must do one or both of the following:
    - [Assign a Regular Key Pair](assign-a-regular-key-pair.html).
    - [Set Up Multi-Signing](set-up-multi-signing.html).

## Steps

{% set n = cycler(* range(1,99)) %}

### {{n.next()}}. Construct Transaction JSON

Prepare an [AccountSet transaction][] from your account with the field `"SetValue": 4`. This is the value for the AccountSet flag "Disable Master" (`asfDisableMaster`). The only other required fields for this transaction are the required [common fields](transaction-common-fields.html). For example, if you leave off the [auto-fillable fields](transaction-common-fields.html#auto-fillable-fields), the following transaction instructions are enough:

```json
{
  "TransactionType": "AccountSet",
  "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
  "SetFlag": 4
}
```

**Tip:** It is strongly recommended to also provide the `LastLedgerSequence` field so that you can [reliably get the outcome of the transaction in a predictable amount of time](reliable-transaction-submission.html).

### {{n.next()}}. Sign Transaction

You must use the **master key pair** to sign the transaction.

**Warning:** Do not submit your secret to a server you don't control, and do not transmit it over the network unencrypted. These examples assume you are using a [local `rippled` server](set-up-secure-signing.html#run-rippled-locally). You should adapt these instructions if you are using another [secure signing configuration](set-up-secure-signing.html).

#### Example Request

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "command": "sign",
  "tx_json": {
    "TransactionType": "AccountSet",
    "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "SetFlag": 4
  },
  "secret": "s████████████████████████████"
}
```

*JSON-RPC*

```json
{
   "method": "sign",
   "params": [
      {
         "tx_json": {
           "TransactionType": "AccountSet",
           "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
           "SetFlag": 4
         },
         "secret": "s████████████████████████████"
      }
   ]
}
```

*Commandline*

```sh
$ rippled sign s████████████████████████████ '{"TransactionType":"AccountSet",
    "Account":"rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn", "SetFlag":4}'
```

<!-- MULTICODE_BLOCK_END -->

#### Example Response

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "result": {
    "deprecated": "This command has been deprecated and will be removed in a future version of the server. Please migrate to a standalone signing tool.",
    "tx_blob": "1200032280000000240000017C20210000000468400000000000000A732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB7446304402204457A890BC06F48061F8D61042975702B57EBEF3EA2C7C484DFE38CFD42EA11102202505A7C62FF41E68FDE10271BADD75BD66D54B2F96A326BE487A2728A352442D81144B4E9C06F24296074F7BC48F92A97916C6DC5EA9",
    "tx_json": {
      "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "Fee": "10",
      "Flags": 2147483648,
      "Sequence": 380,
      "SetFlag": 4,
      "SigningPubKey": "03AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB",
      "TransactionType": "AccountSet",
      "TxnSignature": "304402204457A890BC06F48061F8D61042975702B57EBEF3EA2C7C484DFE38CFD42EA11102202505A7C62FF41E68FDE10271BADD75BD66D54B2F96A326BE487A2728A352442D",
      "hash": "327FD263132A4D08170E1B01FE1BB2E21D0126CE58165C97A9173CA9551BCD70"
    }
  },
  "status": "success",
  "type": "response"
}
```

*JSON-RPC*

```json
{
    "result": {
        "deprecated": "This command has been deprecated and will be removed in a future version of the server. Please migrate to a standalone signing tool.",
        "status": "success",
        "tx_blob": "1200032280000000240000017C20210000000468400000000000000A732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB7446304402204457A890BC06F48061F8D61042975702B57EBEF3EA2C7C484DFE38CFD42EA11102202505A7C62FF41E68FDE10271BADD75BD66D54B2F96A326BE487A2728A352442D81144B4E9C06F24296074F7BC48F92A97916C6DC5EA9",
        "tx_json": {
            "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
            "Fee": "10",
            "Flags": 2147483648,
            "Sequence": 380,
            "SetFlag": 4,
            "SigningPubKey": "03AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB",
            "TransactionType": "AccountSet",
            "TxnSignature": "304402204457A890BC06F48061F8D61042975702B57EBEF3EA2C7C484DFE38CFD42EA11102202505A7C62FF41E68FDE10271BADD75BD66D54B2F96A326BE487A2728A352442D",
            "hash": "327FD263132A4D08170E1B01FE1BB2E21D0126CE58165C97A9173CA9551BCD70"
        }
    }
}

```

*Commandline*

```sh
Loading: "/etc/opt/ripple/rippled.cfg"
2020-Feb-13 00:13:24.783570867 HTTPClient:NFO Connecting to 127.0.0.1:5005

{
   "result" : {
      "deprecated" : "This command has been deprecated and will be removed in a future version of the server. Please migrate to a standalone signing tool.",
      "status" : "success",
      "tx_blob" : "1200032280000000240000017C20210000000468400000000000000A732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB7446304402204457A890BC06F48061F8D61042975702B57EBEF3EA2C7C484DFE38CFD42EA11102202505A7C62FF41E68FDE10271BADD75BD66D54B2F96A326BE487A2728A352442D81144B4E9C06F24296074F7BC48F92A97916C6DC5EA9",
      "tx_json" : {
         "Account" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
         "Fee" : "10",
         "Flags" : 2147483648,
         "Sequence" : 380,
         "SetFlag" : 4,
         "SigningPubKey" : "03AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB",
         "TransactionType" : "AccountSet",
         "TxnSignature" : "304402204457A890BC06F48061F8D61042975702B57EBEF3EA2C7C484DFE38CFD42EA11102202505A7C62FF41E68FDE10271BADD75BD66D54B2F96A326BE487A2728A352442D",
         "hash" : "327FD263132A4D08170E1B01FE1BB2E21D0126CE58165C97A9173CA9551BCD70"
      }
   }
}
```

<!-- MULTICODE_BLOCK_END -->

Look for `"status": "success"` to indicate that the server successfully signed the transaction. If you get `"status": "error"` instead, check the `error` and `error_message` fields for more information. Some common possibilities include:

- `"error": "badSecret"` usually means you made a typo in the `secret` of the request.
- `"error": "masterDisabled"` means this address's master key pair is _already_ disabled.

Take note of the `tx_blob` value from the response. This is a signed transaction binary you can submit to the network.

### {{n.next()}}. Submit Transaction

Submit the signed transaction blob from the previous step to the XRP Ledger.

#### Example Request

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
    "command": "submit",
    "tx_blob": "1200032280000000240000017C20210000000468400000000000000A732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB7446304402204457A890BC06F48061F8D61042975702B57EBEF3EA2C7C484DFE38CFD42EA11102202505A7C62FF41E68FDE10271BADD75BD66D54B2F96A326BE487A2728A352442D81144B4E9C06F24296074F7BC48F92A97916C6DC5EA9"
}
```

*JSON-RPC*

```json
{
   "method":"submit",
   "params": [
      {
         "tx_blob": "1200032280000000240000017C20210000000468400000000000000A732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB7446304402204457A890BC06F48061F8D61042975702B57EBEF3EA2C7C484DFE38CFD42EA11102202505A7C62FF41E68FDE10271BADD75BD66D54B2F96A326BE487A2728A352442D81144B4E9C06F24296074F7BC48F92A97916C6DC5EA9"
      }
   ]
}
```

*Commandline*

```
$ rippled submit 1200032280000000240000017C20210000000468400000000000000A732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB7446304402204457A890BC06F48061F8D61042975702B57EBEF3EA2C7C484DFE38CFD42EA11102202505A7C62FF41E68FDE10271BADD75BD66D54B2F96A326BE487A2728A352442D81144B4E9C06F24296074F7BC48F92A97916C6DC5EA9
```

<!-- MULTICODE_BLOCK_END -->

#### Example Response

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "result": {
    "engine_result" : "tesSUCCESS",
    "engine_result_code" : 0,
    "engine_result_message" : "The transaction was applied. Only final in a validated ledger.",
    "tx_blob" : "1200032280000000240000017C20210000000468400000000000000A732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB7446304402204457A890BC06F48061F8D61042975702B57EBEF3EA2C7C484DFE38CFD42EA11102202505A7C62FF41E68FDE10271BADD75BD66D54B2F96A326BE487A2728A352442D81144B4E9C06F24296074F7BC48F92A97916C6DC5EA9",
    "tx_json" : {
      "Account" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "Fee" : "10",
      "Flags" : 2147483648,
      "Sequence" : 380,
      "SetFlag" : 4,
      "SigningPubKey" : "03AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB",
      "TransactionType" : "AccountSet",
      "TxnSignature" : "304402204457A890BC06F48061F8D61042975702B57EBEF3EA2C7C484DFE38CFD42EA11102202505A7C62FF41E68FDE10271BADD75BD66D54B2F96A326BE487A2728A352442D",
      "hash" : "327FD263132A4D08170E1B01FE1BB2E21D0126CE58165C97A9173CA9551BCD70"
    }
  },
  "status": "success",
  "type": "response"
}
```

*JSON-RPC*

```json
{
  "result" : {
    "engine_result" : "tesSUCCESS",
    "engine_result_code" : 0,
    "engine_result_message" : "The transaction was applied. Only final in a validated ledger.",
    "status" : "success",
    "tx_blob" : "1200032280000000240000017C20210000000468400000000000000A732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB7446304402204457A890BC06F48061F8D61042975702B57EBEF3EA2C7C484DFE38CFD42EA11102202505A7C62FF41E68FDE10271BADD75BD66D54B2F96A326BE487A2728A352442D81144B4E9C06F24296074F7BC48F92A97916C6DC5EA9",
    "tx_json" : {
      "Account" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "Fee" : "10",
      "Flags" : 2147483648,
      "Sequence" : 380,
      "SetFlag" : 4,
      "SigningPubKey" : "03AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB",
      "TransactionType" : "AccountSet",
      "TxnSignature" : "304402204457A890BC06F48061F8D61042975702B57EBEF3EA2C7C484DFE38CFD42EA11102202505A7C62FF41E68FDE10271BADD75BD66D54B2F96A326BE487A2728A352442D",
      "hash" : "327FD263132A4D08170E1B01FE1BB2E21D0126CE58165C97A9173CA9551BCD70"
    }
  }
}
```

*Commandline*

```sh
Loading: "/etc/opt/ripple/rippled.cfg"
2020-Feb-13 00:25:49.361743460 HTTPClient:NFO Connecting to 127.0.0.1:5005

{
   "result" : {
      "engine_result" : "tesSUCCESS",
      "engine_result_code" : 0,
      "engine_result_message" : "The transaction was applied. Only final in a validated ledger.",
      "status" : "success",
      "tx_blob" : "1200032280000000240000017C20210000000468400000000000000A732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB7446304402204457A890BC06F48061F8D61042975702B57EBEF3EA2C7C484DFE38CFD42EA11102202505A7C62FF41E68FDE10271BADD75BD66D54B2F96A326BE487A2728A352442D81144B4E9C06F24296074F7BC48F92A97916C6DC5EA9",
      "tx_json" : {
         "Account" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
         "Fee" : "10",
         "Flags" : 2147483648,
         "Sequence" : 380,
         "SetFlag" : 4,
         "SigningPubKey" : "03AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB",
         "TransactionType" : "AccountSet",
         "TxnSignature" : "304402204457A890BC06F48061F8D61042975702B57EBEF3EA2C7C484DFE38CFD42EA11102202505A7C62FF41E68FDE10271BADD75BD66D54B2F96A326BE487A2728A352442D",
         "hash" : "327FD263132A4D08170E1B01FE1BB2E21D0126CE58165C97A9173CA9551BCD70"
      }
   }
}
```

<!-- MULTICODE_BLOCK_END -->

If the transaction fails with the result `tecNO_ALTERNATIVE_KEY`, your account does not have another method of authorizing transactions currently enabled. You must [assign a regular key pair](assign-a-regular-key-pair.html) or [set up multi-signing](set-up-multi-signing.html), then try again to disable the master key pair.


### {{n.next()}}. Wait for validation

{% include '_snippets/wait-for-validation.md' %} <!--#{ fix md highlighting_ #}-->

### {{n.next()}}. Confirm Account Flags

Confirm that your account's master key is disabled using the [account_info method][]. Be sure to specify the following parameters:

| Field          | Value                                                       |
|:---------------|:------------------------------------------------------------|
| `account`      | The address of your account.                                |
| `ledger_index` | `"validated"` to get results from the latest validated ledger version. |

#### Example Request

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "command": "account_info",
  "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
  "ledger_index": "validated"
}
```

*JSON-RPC*

```json
{
    "method": "account_info",
    "params": [{
        "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
        "ledger_index": "validated"
    }]
}
```

*Commandline*

```sh
rippled account_info rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn validated
```

<!-- MULTICODE_BLOCK_END -->


#### Example Response

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "result": {
    "account_data": {
      "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "AccountTxnID": "327FD263132A4D08170E1B01FE1BB2E21D0126CE58165C97A9173CA9551BCD70",
      "Balance": "423013688",
      "Domain": "6D64756F31332E636F6D",
      "EmailHash": "98B4375E1D753E5B91627516F6D70977",
      "Flags": 9633792,
      "LedgerEntryType": "AccountRoot",
      "MessageKey": "0000000000000000000000070000000300",
      "OwnerCount": 9,
      "PreviousTxnID": "327FD263132A4D08170E1B01FE1BB2E21D0126CE58165C97A9173CA9551BCD70",
      "PreviousTxnLgrSeq": 53391321,
      "RegularKey": "rD9iJmieYHn8jTtPjwwkW2Wm9sVDvPXLoJ",
      "Sequence": 381,
      "TransferRate": 4294967295,
      "index": "13F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8",
      "urlgravatar": "http://www.gravatar.com/avatar/98b4375e1d753e5b91627516f6d70977"
    },
    "ledger_hash": "A90CEBD4AEDA24470AAC5CD307B6D26267ACE79C03669A0A0B8C41ACAEDAA6F0",
    "ledger_index": 53391576,
    "validated": true
  },
  "status": "success",
  "type": "response"
}
```

*JSON-RPC*

```json
{
  "result": {
    "account_data": {
      "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "AccountTxnID": "327FD263132A4D08170E1B01FE1BB2E21D0126CE58165C97A9173CA9551BCD70",
      "Balance": "423013688",
      "Domain": "6D64756F31332E636F6D",
      "EmailHash": "98B4375E1D753E5B91627516F6D70977",
      "Flags": 9633792,
      "LedgerEntryType": "AccountRoot",
      "MessageKey": "0000000000000000000000070000000300",
      "OwnerCount": 9,
      "PreviousTxnID": "327FD263132A4D08170E1B01FE1BB2E21D0126CE58165C97A9173CA9551BCD70",
      "PreviousTxnLgrSeq": 53391321,
      "RegularKey": "rD9iJmieYHn8jTtPjwwkW2Wm9sVDvPXLoJ",
      "Sequence": 381,
      "TransferRate": 4294967295,
      "index": "13F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8",
      "urlgravatar": "http://www.gravatar.com/avatar/98b4375e1d753e5b91627516f6d70977"
    },
    "ledger_hash": "4C4AC95149B13B539369998675FE6860C52695E83658366F18872181C9F1AEBF",
    "ledger_index": 53391589,
    "status": "success",
    "validated": true
  }
}
```

*Commandline*

```sh
Loading: "/etc/opt/ripple/rippled.cfg"
2020-Feb-13 00:41:38.642710734 HTTPClient:NFO Connecting to 127.0.0.1:5005

{
   "result" : {
      "account_data" : {
         "Account" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
         "AccountTxnID" : "327FD263132A4D08170E1B01FE1BB2E21D0126CE58165C97A9173CA9551BCD70",
         "Balance" : "423013688",
         "Domain" : "6D64756F31332E636F6D",
         "EmailHash" : "98B4375E1D753E5B91627516F6D70977",
         "Flags" : 9633792,
         "LedgerEntryType" : "AccountRoot",
         "MessageKey" : "0000000000000000000000070000000300",
         "OwnerCount" : 9,
         "PreviousTxnID" : "327FD263132A4D08170E1B01FE1BB2E21D0126CE58165C97A9173CA9551BCD70",
         "PreviousTxnLgrSeq" : 53391321,
         "RegularKey" : "rD9iJmieYHn8jTtPjwwkW2Wm9sVDvPXLoJ",
         "Sequence" : 381,
         "TransferRate" : 4294967295,
         "index" : "13F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8",
         "urlgravatar" : "http://www.gravatar.com/avatar/98b4375e1d753e5b91627516f6d70977"
      },
      "ledger_hash" : "BBA4034FB5D5D89987E0987A9491E7B62B16708EECFF04CDB0367BD4D28EB1B5",
      "ledger_index" : 53391568,
      "status" : "success",
      "validated" : true
   }
}
```

<!-- MULTICODE_BLOCK_END -->


In the response's `account_data` object, compare the `Flags` field with the `lsfDisableMaster` flag value (`0x00100000` in hex, or `1048576` in decimal) using bitwise-AND (the `&` operator in most common programming languages).

Example code:

<!-- MULTICODE_BLOCK_START -->

*JavaScript*

```js
// Assuming the JSON-RPC response above is saved as account_info_response
const lsfDisableMaster = 0x00100000;
let acct_flags = account_info_response.result.account_data.Flags;
if ((lsfDisableMaster & acct_flags) === lsfDisableMaster) {
  console.log("Master key pair is DISABLED");
} else {
  console.log("Master key pair is available for use");
}
```

*Python*

```python
# Assuming the JSON-RPC response above is parsed from JSON
#  and saved as the variable account_info_response
lsfDisableMaster = 0x00100000
acct_flags = account_info_response["result"]["account_data"]["Flags"]
if lsfDisableMaster & acct_flags == lsfDisableMaster:
    print("Master key pair is DISABLED")
else:
    print("Master key pair is available for use")
```

<!-- MULTICODE_BLOCK_END -->

This operation has only two possible outcomes:

- A nonzero result, equal to the `lsfDisableMaster` value, indicates **the master key has been successfully disabled**.
- A zero result indicates the account's master key is not disabled.

If the result does not match your expectations, check whether the transaction you sent in the previous steps has executed successfully. It should be the most recent entry in the account's transaction history ([account_tx method][]) and it should have the result code `tesSUCCESS`. If you see any other [result code](transaction-results.html), the transaction was not executed successfully. Depending on the cause of the error, you may want to restart these steps from the beginning.



<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
