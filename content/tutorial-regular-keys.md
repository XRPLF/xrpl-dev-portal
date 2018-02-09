# Working with Regular Keys

The XRP Ledger allows an account to authorize a secondary key pair, called a "regular key," to sign future transactions. If the private key of a regular key is compromised, you can remove or replace it without changing the rest of your account and re-establishing its relationships to other accounts. You can also rotate a regular key proactively. (Neither of those things is possible for the master key pair of an account, which is intrinsically linked to the account's address.)

For more information about master and regular keys, see [Understanding Master and Regular Keys](concept-keys.html).

This article provides the following tutorials:

* [Assigning a regular key](#assigning-a-regular-key)
* [Removing or changing a regular key](#removing-or-changing-a-regular-key)


## Assigning a Regular Key

This tutorial walks you through the steps required to assign a regular key to your account:

1. [Generate a key](#1-generate-a-key)
2. [Assign the key to your account as a regular key](#2-assign-the-key-to-your-account-as-a-regular-key)
3. [Submit an `AccountSet` transaction using the regular key](#3-submit-an-accountset-transaction-using-the-regular-key)
4. [Explore next steps](#4-explore-next-steps)


### 1. Generate a Key

Use the [`wallet_propose`](reference-rippled.html#wallet-propose) method to generate the key that you'll assign to your account as a regular key.

Here's an example `wallet_propose` request and response:


#### WebSocket Request

```
{
  "method": "wallet_propose"
}
```

#### WebSocket Response

```
{
  "result": {
    "account_id": "rsprUqu6BHAffAeG4HpSdjBNvnA6gdnZV7",
    "key_type": "secp256k1",
    "master_key": "KNEW BENT LYNN LED GAD BEN KENT SHAM HOBO RINK WALT ALLY",
    "master_seed": "sh8i92YRnEjJy3fpFkL8txQSCVo79",
    "master_seed_hex": "966C0F68643EFBA50D58D191D4CA8AA7",
    "public_key": "aBRNH5wUurfhZcoyR6nRwDSa95gMBkovBJ8V4cp1C1pM28H7EPL1",
    "public_key_hex": "03AEEFE1E8ED4BBC009DE996AC03A8C6B5713B1554794056C66E5B8D1753C7DD0E"
  },
  "status": "success",
  "type": "response"
}
```

In the next step, you'll use the `account_id` from this response to assign the key as a regular key to your account.


### 2. Assign the Key to Your Account as a Regular Key

Use the [`SetRegularKey`](reference-transaction-format.html#setregularkey) method to assign the key you generated in step 1 to your account as a regular key.

When assigning a regular key to your account for the first time, the `SetRegularKey` method requires signing by your account's master private key (secret). Transmitting your master private key is dangerous, so we'll complete this transaction in two steps to keep transaction signing separate from transaction submission to the network.

When you make subsequent `SetRegularKey` requests, you can sign using the existing regular key to replace or [remove itself](#removing-or-changing-a-regular-key).


#### Sign Your Transaction

The most secure way to sign a transaction is to do it offline with a signing library, such as [RippleAPI](reference-rippleapi.html#offline-functionality). Alternatively, you can sign the transaction using the [`sign`](reference-rippled.html#sign) command, but this must be done through a trusted and encrypted connection, or through a local connection, and only to a server you control.

In the transaction JSON, use your account's `account_ID` as the `Account` value, your account's `master_key`, `master_seed`, or `master_seed_hex` (master private key) as the `secret` value, and the `account_id` generated in step 1 as the `RegularKey` value.

Here's an example `sign` request and response for a `SetRegularKey` type transaction:

##### WebSocket Request:

```
{
  "command": "sign",
  "tx_json" : {
      "TransactionType" : "SetRegularKey",
      "Account" : "rUAi7pipxGpYfPNg3LtPcf2ApiS8aw9A93",
      "RegularKey" : "rsprUqu6BHAffAeG4HpSdjBNvnA6gdnZV7"
      },
   "secret" : "ssCATR7CBvn4GLd1UuU2bqqQffHki"
}
```


##### WebSocket Response:

```
{
  "result": {
    "tx_blob": "1200052280000000240000000468400000000000000A73210384CA3C528F10C75F26E0917F001338BD3C9AA1A39B9FBD583DFFFD96CF2E2D7A7446304402204BCD5663F3A2BA02D2CE374439096EC6D27273522CD6E6E0BDBFB518730EAAE402200ECD02D8D2525D6FA4642613E71E395ECCEA01C42C35A668BF092A00EB649C268114830923439D307E642CED308FD91EF701A7BAA74788141620D685FB08D81A70D0B668749CF2E130EA7540",
    "tx_json": {
      "Account": "rUAi7pipxGpYfPNg3LtPcf2ApiS8aw9A93",
      "Fee": "10",
      "Flags": 2147483648,
      "RegularKey": "rsprUqu6BHAffAeG4HpSdjBNvnA6gdnZV7",
      "Sequence": 4,
      "SigningPubKey": "0384CA3C528F10C75F26E0917F001338BD3C9AA1A39B9FBD583DFFFD96CF2E2D7A",
      "TransactionType": "SetRegularKey",
      "TxnSignature": "304402204BCD5663F3A2BA02D2CE374439096EC6D27273522CD6E6E0BDBFB518730EAAE402200ECD02D8D2525D6FA4642613E71E395ECCEA01C42C35A668BF092A00EB649C26",
      "hash": "AB73BBF7C99061678B59FB48D72CA0F5FC6DD2815B6736C6E9EB94439EC236CE"
    }
  },
  "status": "success",
  "type": "response"
}
```

The `sign` command response contains a `tx_blob` value, as shown above. The offline signing response contains a `signedTransaction` value. Both are signed binary representations (blobs) of the transaction.

Next, use the `submit` command to transmit the transaction blob (`tx_blob` or `signedTransaction`) to the network.


#### Submit Your Transaction

Take the `signedTransaction` value from the offline signing response or the `tx_blob` value from the `sign` command response and submit it as the `tx_blob` value using the [`submit`](reference-rippled.html#submit) command.

Here's an example `submit` request and response for a `SetRegularKey` type transaction.


##### WebSocket Request:

```
{
    "command": "submit",
    "tx_blob": "1200052280000000240000000468400000000000000A73210384CA3C528F10C75F26E0917F001338BD3C9AA1A39B9FBD583DFFFD96CF2E2D7A7446304402204BCD5663F3A2BA02D2CE374439096EC6D27273522CD6E6E0BDBFB518730EAAE402200ECD02D8D2525D6FA4642613E71E395ECCEA01C42C35A668BF092A00EB649C268114830923439D307E642CED308FD91EF701A7BAA74788141620D685FB08D81A70D0B668749CF2E130EA7540"
}
```


##### WebSocket Response:

```
{
  "result": {
    "engine_result": "tesSUCCESS",
    "engine_result_code": 0,
    "engine_result_message": "The transaction was applied. Only final in a validated ledger.",
    "tx_blob": "1200052280000000240000000468400000000000000A73210384CA3C528F10C75F26E0917F001338BD3C9AA1A39B9FBD583DFFFD96CF2E2D7A7446304402204BCD5663F3A2BA02D2CE374439096EC6D27273522CD6E6E0BDBFB518730EAAE402200ECD02D8D2525D6FA4642613E71E395ECCEA01C42C35A668BF092A00EB649C268114830923439D307E642CED308FD91EF701A7BAA74788141620D685FB08D81A70D0B668749CF2E130EA7540",
    "tx_json": {
      "Account": "rUAi7pipxGpYfPNg3LtPcf2ApiS8aw9A93",
      "Fee": "10",
      "Flags": 2147483648,
      "RegularKey": "rsprUqu6BHAffAeG4HpSdjBNvnA6gdnZV7",
      "Sequence": 4,
      "SigningPubKey": "0384CA3C528F10C75F26E0917F001338BD3C9AA1A39B9FBD583DFFFD96CF2E2D7A",
      "TransactionType": "SetRegularKey",
      "TxnSignature": "304402204BCD5663F3A2BA02D2CE374439096EC6D27273522CD6E6E0BDBFB518730EAAE402200ECD02D8D2525D6FA4642613E71E395ECCEA01C42C35A668BF092A00EB649C26",
      "hash": "AB73BBF7C99061678B59FB48D72CA0F5FC6DD2815B6736C6E9EB94439EC236CE"
    }
  },
  "status": "success",
  "type": "response"
}
```

Note that the response contains a `hash` of the transaction, which you can use to [look up the transaction's final outcome](reference-rippled.html#tx).


### 3. Submit an `AccountSet` Transaction Using the Regular Key

To verify that your account has the regular key set correctly, send an [`AccountSet`](reference-transaction-format.html#accountset) transaction from your account, signing it with the regular key you assigned to your account in step 2.

In the request, send your account's `account_id` as the `Account` value and the `master_key`, `master_seed`, or `master_seed_hex` (regular private key) generated in step 1 as the `secret` value.

Here's an example `AccountSet` request and response. Note that the request does not include any `AccountSet` options. This means that a successful transaction has no effect other than to confirm that the regular key is set correctly for your account (and to destroy the transaction cost).


#### WebSocket Request:

```
{
  "command": "submit",
  "tx_json" : {
    "TransactionType": "AccountSet",
    "Account" : "rUAi7pipxGpYfPNg3LtPcf2ApiS8aw9A93"
},
   "secret" : "sh8i92YRnEjJy3fpFkL8txQSCVo79"
}
```


#### WebSocket Response:

```
{
  "result": {
    "engine_result": "tesSUCCESS",
    "engine_result_code": 0,
    "engine_result_message": "The transaction was applied. Only final in a validated ledger.",
    "tx_blob": "1200032280000000240000000368400000000000000A732103AEEFE1E8ED4BBC009DE996AC03A8C6B5713B1554794056C66E5B8D1753C7DD0E744730450221008F44064A901C3A170A046673EFC8091F2C409E1DB7D78A5EF0D18E9D868AE21002207F594F3BF3821E6DF64CD283F590F6578F809DFD1CAAF654F187645A7CAB91C48114830923439D307E642CED308FD91EF701A7BAA747",
    "tx_json": {
      "Account": "rUAi7pipxGpYfPNg3LtPcf2ApiS8aw9A93",
      "Fee": "10",
      "Flags": 2147483648,
      "Sequence": 3,
      "SigningPubKey": "03AEEFE1E8ED4BBC009DE996AC03A8C6B5713B1554794056C66E5B8D1753C7DD0E",
      "TransactionType": "AccountSet",
      "TxnSignature": "30450221008F44064A901C3A170A046673EFC8091F2C409E1DB7D78A5EF0D18E9D868AE21002207F594F3BF3821E6DF64CD283F590F6578F809DFD1CAAF654F187645A7CAB91C4",
      "hash": "BED704F2A6A80DA4060446C95802F205EE41977A2F63F10B1F8952FC6D01B35B"
    }
  },
  "status": "success",
  "type": "response"
}
```


### 4. Explore Next Steps

Now that you're familiar with the benefits of assigning a regular key to an account, consider taking a look at these related topics and tutorials:

* [How to Multi-Sign](tutorial-multisign.html)
* [Issuing and Operational Addresses](concept-issuing-and-operational-addresses.html)
* [Listing XRP as an Exchange](tutorial-listing-xrp.html)


## Removing or Changing a Regular Key

If your account's regular key is compromised, or if you just want to periodically change the regular key as a security measure, use the [`SetRegularKey`](reference-transaction-format.html#setregularkey) method to remove or change the regular key for your account.

The steps to change your existing regular key are almost the same as the steps to [assign a regular key](#assigning-a-regular-key) for the first time. You generate the key and assign it to your account as a regular key, overwriting the existing regular key. However, the main difference is that when changing the existing regular key, you can use the existing regular key to replace itself, whereas when assigning a regular key to an account for the first time, you have to use the account's master key to do it.

For more information about master and regular keys, see [Understanding Master and Regular Keys](concept-keys.html).

If you want to simply remove a compromised regular key from your account, you don't need to generate a key pair first and just use the [`SetRegularKey`](reference-transaction-format.html#setregularkey) method, omitting the `RegularKey` value in the request. Note that the method fails if you don't have another way of signing for your account currently enabled (either the master key or a signer list).

Here's an example `SetRegularKey` request and response that removes an existing regular key from an account:


#### WebSocket Request:

```
{
   "command" : "submit",
   "tx_json" : {
      "TransactionType" : "SetRegularKey",
      "Account" : "rUAi7pipxGpYfPNg3LtPcf2ApiS8aw9A93"
   },
   "secret" : "sh8i92YRnEjJy3fpFkL8txQSCVo79"
}
```


#### WebSocket Response:

```
{
  "result": {
    "engine_result": "tesSUCCESS",
    "engine_result_code": 0,
    "engine_result_message": "The transaction was applied. Only final in a validated ledger.",
    "tx_blob": "1200052280000000240000000668400000000000000A732103AEEFE1E8ED4BBC009DE996AC03A8C6B5713B1554794056C66E5B8D1753C7DD0E744630440220703F4EB4D1DF90632DDEB0F3B72B41B7E85C739933C9AF55472BB154637645B202202689C22A10965DA0F0EA1D745EBB8E94E242572490FED69A059D724172E9DCFC8114830923439D307E642CED308FD91EF701A7BAA747",
    "tx_json": {
      "Account": "rUAi7pipxGpYfPNg3LtPcf2ApiS8aw9A93",
      "Fee": "10",
      "Flags": 2147483648,
      "Sequence": 6,
      "SigningPubKey": "03AEEFE1E8ED4BBC009DE996AC03A8C6B5713B1554794056C66E5B8D1753C7DD0E",
      "TransactionType": "SetRegularKey",
      "TxnSignature": "30440220703F4EB4D1DF90632DDEB0F3B72B41B7E85C739933C9AF55472BB154637645B202202689C22A10965DA0F0EA1D745EBB8E94E242572490FED69A059D724172E9DCFC",
      "hash": "15234F29930BFB8A87EB604D4E657CDEE277BAF9D670A90CDE2453A608A9A81C"
    }
  },
  "status": "success",
  "type": "response"
}
```

The way to verify that regular key removal succeeded is to confirm that you can't send a transaction using the removed regular key.

Here's an example error response for an `AccountSet` transaction signed using the regular key removed by the `SetRegularKey` transaction above.


#### WebSocket Response:

```
{
  "error": "badSecret",
  "error_code": 41,
  "error_message": "Secret does not match account.",
  "request": {
    "command": "submit",
    "secret": "sh8i92YRnEjJy3fpFkL8txQSCVo79",
    "tx_json": {
      "Account": "rUAi7pipxGpYfPNg3LtPcf2ApiS8aw9A93",
      "TransactionType": "AccountSet"
    }
  },
  "status": "error",
  "type": "response"
}
```

In some cases, you can even use the `SetRegularKey` method to send a [key reset transaction](concept-transaction-cost.html#key-reset-transaction) without paying the [transaction cost](reference-transaction-format.html#transaction-cost). With the enablement of the FeeEscalation amendment, `rippled` prioritizes key reset transactions above other transactions even though the nominal transaction cost of a key reset transaction is zero.
