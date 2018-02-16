# Working with a Regular Key Pair

The XRP Ledger allows an account to authorize a secondary key pair, called a _regular key pair_, to sign future transactions. If the private key of a regular key pair is compromised, you can remove or replace it without changing the rest of your account and re-establishing its relationships to other accounts. You can also rotate a regular key pair proactively. (Neither of those things is possible for the master key pair of an account, which is intrinsically linked to the account's address.)

For more information about master and regular key pairs, see [Cryptographic Keys](cryptographic-keys.html).

This article provides the following tutorials:

* [Assigning a regular key pair](#assigning-a-regular-key-pair)
* [Changing or removing a regular key pair](#changing-or-removing-a-regular-key-pair)


## Assigning a Regular Key Pair

This tutorial walks you through the steps required to assign a regular key pair to your account:

1. [Generate a key pair](#1-generate-a-key-pair)
2. [Assign the key pair to your account as a regular key pair](#2-assign-the-key-pair-to-your-account-as-a-regular-key-pair)
3. [Verify the regular key pair](#3-verify-the-regular-key-pair)
4. [Explore next steps](#4-explore-next-steps)


### 1. Generate a Key Pair

Use the [`wallet_propose`](reference-rippled.html#wallet-propose) method to generate the key pair that you'll assign to your account as a regular key pair.

#### Request Format

An example of the request format:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
  "command": "wallet_propose"
}
```

*JSON-RPC*

```
{
  "method": "wallet_propose"
}
```

*Commandline*

```
#Syntax: wallet_propose
rippled wallet_propose
```

<!-- MULTICODE_BLOCK_END -->


#### Response Format

An example of a successful response:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

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

*JSON-RPC*

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
        "status": "success"
    }
}
```

*Commandline*

```
{
   "result" : {
      "account_id" : "rsprUqu6BHAffAeG4HpSdjBNvnA6gdnZV7",
      "key_type" : "secp256k1",
      "master_key" : "KNEW BENT LYNN LED GAD BEN KENT SHAM HOBO RINK WALT ALLY",
      "master_seed" : "sh8i92YRnEjJy3fpFkL8txQSCVo79",
      "master_seed_hex" : "966C0F68643EFBA50D58D191D4CA8AA7",
      "public_key" : "aBRNH5wUurfhZcoyR6nRwDSa95gMBkovBJ8V4cp1C1pM28H7EPL1",
      "public_key_hex" : "03AEEFE1E8ED4BBC009DE996AC03A8C6B5713B1554794056C66E5B8D1753C7DD0E",
      "status" : "success"
   }
}
```

<!-- MULTICODE_BLOCK_END -->

In the next step, you'll use the `account_id` from this response to assign the key pair as a regular key pair to your account. Also, save the `master_seed` value somewhere securely. (Everything else, you can forget about.)


### 2. Assign the Key Pair to Your Account as a Regular Key Pair

Use the [`SetRegularKey`](reference-transaction-format.html#setregularkey) method to assign the key pair you generated in step 1 to your account as a regular key pair.

When assigning a regular key pair to your account for the first time, the `SetRegularKey` method requires signing by your account's master private key (secret). Transmitting your master private key is dangerous, so we'll complete this transaction in two steps to keep transaction signing separate from transaction submission to the network.

When you make subsequent `SetRegularKey` requests, you can sign using the existing regular private key to replace or [remove itself](#changing-or-removing-a-regular-key-pair). Note that you should still not submit your regular private key across the network.


#### Sign Your Transaction

The most secure way to sign a transaction is to do it offline with a signing library, such as [RippleAPI](reference-rippleapi.html#offline-functionality). Alternatively, you can sign the transaction using the [`sign`](reference-rippled.html#sign) command, but this must be done through a trusted and encrypted connection, or through a local connection, and only to a server you control.

Populate the request fields with the following values:

| Request Field | Value                                                        |
|:--------------|:-------------------------------------------------------------|
| `Account`     | The address of your account.                                 |
| `RegularKey`  | `account_id` generated in step 1.                            |
| `secret`      | `master_key`, `master_seed`, or `master_seed_hex` (master private key) for your account. |


##### Request Format

An example of the request format:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
  "command": "sign",
  "tx_json": {
      "TransactionType": "SetRegularKey",
      "Account": "rUAi7pipxGpYfPNg3LtPcf2ApiS8aw9A93",
      "RegularKey": "rsprUqu6BHAffAeG4HpSdjBNvnA6gdnZV7"
      },
   "secret": "ssCATR7CBvn4GLd1UuU2bqqQffHki"
}
```

*JSON-RPC*

```
{
   "method": "sign",
   "params": [
      {
         "tx_json": {
            "TransactionType": "SetRegularKey",
            "Account": "rUAi7pipxGpYfPNg3LtPcf2ApiS8aw9A93",
            "RegularKey": "rsprUqu6BHAffAeG4HpSdjBNvnA6gdnZV7"
         },
         "secret": "ssCATR7CBvn4GLd1UuU2bqqQffHki"
      }
   ]
}
```

*Commandline*

```
#Syntax: sign secret tx_json
rippled sign ssCATR7CBvn4GLd1UuU2bqqQffHki '{"TransactionType": "SetRegularKey", "Account": "rUAi7pipxGpYfPNg3LtPcf2ApiS8aw9A93", "RegularKey": "rsprUqu6BHAffAeG4HpSdjBNvnA6gdnZV7"}'
```

<!-- MULTICODE_BLOCK_END -->


##### Response Format

An example of a successful response:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

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

*JSON-RPC*

```
{
    "result": {
        "status": "success",
        "tx_blob": "1200052280000000240000000768400000000000000A73210384CA3C528F10C75F26E0917F001338BD3C9AA1A39B9FBD583DFFFD96CF2E2D7A7446304402201453CA3D4D17F0EE3828B9E3D6ACF65327F5D4FC2BA30953CACF6CBCB4145E3502202F2154BED1D7462CAC1E3DBB31864E48C3BA0B3133ACA5E37EC54F0D0C339E2D8114830923439D307E642CED308FD91EF701A7BAA74788141620D685FB08D81A70D0B668749CF2E130EA7540",
        "tx_json": {
            "Account": "rUAi7pipxGpYfPNg3LtPcf2ApiS8aw9A93",
            "Fee": "10",
            "Flags": 2147483648,
            "RegularKey": "rsprUqu6BHAffAeG4HpSdjBNvnA6gdnZV7",
            "Sequence": 4,
            "SigningPubKey": "0384CA3C528F10C75F26E0917F001338BD3C9AA1A39B9FBD583DFFFD96CF2E2D7A",
            "TransactionType": "SetRegularKey",
            "TxnSignature": "304402201453CA3D4D17F0EE3828B9E3D6ACF65327F5D4FC2BA30953CACF6CBCB4145E3502202F2154BED1D7462CAC1E3DBB31864E48C3BA0B3133ACA5E37EC54F0D0C339E2D",
            "hash": "AB73BBF7C99061678B59FB48D72CA0F5FC6DD2815B6736C6E9EB94439EC236CE"
        }
    }
}
```

*Commandline*

```
{
   "result" : {
      "status" : "success",
      "tx_blob" : "1200052280000000240000000768400000000000000A73210384CA3C528F10C75F26E0917F001338BD3C9AA1A39B9FBD583DFFFD96CF2E2D7A7446304402201453CA3D4D17F0EE3828B9E3D6ACF65327F5D4FC2BA30953CACF6CBCB4145E3502202F2154BED1D7462CAC1E3DBB31864E48C3BA0B3133ACA5E37EC54F0D0C339E2D8114830923439D307E642CED308FD91EF701A7BAA74788141620D685FB08D81A70D0B668749CF2E130EA7540",
      "tx_json" : {
         "Account" : "rUAi7pipxGpYfPNg3LtPcf2ApiS8aw9A93",
         "Fee" : "10",
         "Flags" : 2147483648,
         "RegularKey" : "rsprUqu6BHAffAeG4HpSdjBNvnA6gdnZV7",
         "Sequence" : 4,
         "SigningPubKey" : "0384CA3C528F10C75F26E0917F001338BD3C9AA1A39B9FBD583DFFFD96CF2E2D7A",
         "TransactionType" : "SetRegularKey",
         "TxnSignature" : "304402201453CA3D4D17F0EE3828B9E3D6ACF65327F5D4FC2BA30953CACF6CBCB4145E3502202F2154BED1D7462CAC1E3DBB31864E48C3BA0B3133ACA5E37EC54F0D0C339E2D",
         "hash" : "AB73BBF7C99061678B59FB48D72CA0F5FC6DD2815B6736C6E9EB94439EC236CE"
      }
   }
}
```

<!-- MULTICODE_BLOCK_END -->

The `sign` command response contains a `tx_blob` value, as shown above. The offline signing response contains a `signedTransaction` value. Both are signed binary representations (blobs) of the transaction.

Next, use the `submit` command to transmit the transaction blob (`tx_blob` or `signedTransaction`) to the network.


#### Submit Your Transaction

Take the `signedTransaction` value from the offline signing response or the `tx_blob` value from the `sign` command response and submit it as the `tx_blob` value using the [`submit`](reference-rippled.html#submit) command.

##### Request Format

An example of the request format:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
    "command": "submit",
    "tx_blob": "1200052280000000240000000468400000000000000A73210384CA3C528F10C75F26E0917F001338BD3C9AA1A39B9FBD583DFFFD96CF2E2D7A7446304402204BCD5663F3A2BA02D2CE374439096EC6D27273522CD6E6E0BDBFB518730EAAE402200ECD02D8D2525D6FA4642613E71E395ECCEA01C42C35A668BF092A00EB649C268114830923439D307E642CED308FD91EF701A7BAA74788141620D685FB08D81A70D0B668749CF2E130EA7540"
}
```

*JSON-RPC*

```
{
   "method":"submit",
   "params": [
      {
         "tx_blob": "1200052280000000240000000468400000000000000A73210384CA3C528F10C75F26E0917F001338BD3C9AA1A39B9FBD583DFFFD96CF2E2D7A7446304402204BCD5663F3A2BA02D2CE374439096EC6D27273522CD6E6E0BDBFB518730EAAE402200ECD02D8D2525D6FA4642613E71E395ECCEA01C42C35A668BF092A00EB649C268114830923439D307E642CED308FD91EF701A7BAA74788141620D685FB08D81A70D0B668749CF2E130EA7540"
      }
   ]
}
```

*Commandline*

```
#Syntax: submit tx_blob
rippled submit 1200052280000000240000000468400000000000000A73210384CA3C528F10C75F26E0917F001338BD3C9AA1A39B9FBD583DFFFD96CF2E2D7A7446304402204BCD5663F3A2BA02D2CE374439096EC6D27273522CD6E6E0BDBFB518730EAAE402200ECD02D8D2525D6FA4642613E71E395ECCEA01C42C35A668BF092A00EB649C268114830923439D307E642CED308FD91EF701A7BAA74788141620D685FB08D81A70D0B668749CF2E130EA7540
```

<!-- MULTICODE_BLOCK_END -->


##### Response Format

An example of a successful response:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

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

*JSON-RPC*

```
{
    "result": {
       "engine_result": "tesSUCCESS",
       "engine_result_code": 0,
       "engine_result_message": "The transaction was applied. Only final in a validated ledger.",
        "status": "success",
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
    }
}
```

*Commandline*

```
{
   "result" : {
      "engine_result" : "tesSUCCESS",
      "engine_result_code" : 0,
      "engine_result_message" : "The transaction was applied. Only final in a validated ledger.",
      "status" : "success",
      "tx_blob" : "1200052280000000240000000468400000000000000A73210384CA3C528F10C75F26E0917F001338BD3C9AA1A39B9FBD583DFFFD96CF2E2D7A7446304402204BCD5663F3A2BA02D2CE374439096EC6D27273522CD6E6E0BDBFB518730EAAE402200ECD02D8D2525D6FA4642613E71E395ECCEA01C42C35A668BF092A00EB649C268114830923439D307E642CED308FD91EF701A7BAA74788141620D685FB08D81A70D0B668749CF2E130EA7540",
      "tx_json" : {
         "Account" : "rUAi7pipxGpYfPNg3LtPcf2ApiS8aw9A93",
         "Fee" : "10",
         "Flags" : 2147483648,
         "RegularKey" : "rsprUqu6BHAffAeG4HpSdjBNvnA6gdnZV7",
         "Sequence" : 4,
         "SigningPubKey" : "0384CA3C528F10C75F26E0917F001338BD3C9AA1A39B9FBD583DFFFD96CF2E2D7A",
         "TransactionType" : "SetRegularKey",
         "TxnSignature" : "304402204BCD5663F3A2BA02D2CE374439096EC6D27273522CD6E6E0BDBFB518730EAAE402200ECD02D8D2525D6FA4642613E71E395ECCEA01C42C35A668BF092A00EB649C26",
         "hash" : "AB73BBF7C99061678B59FB48D72CA0F5FC6DD2815B6736C6E9EB94439EC236CE"
      }
   }
}
```

<!-- MULTICODE_BLOCK_END -->


Note that the response contains a `hash` of the transaction, which you can use to [look up the transaction's final outcome](reference-rippled.html#tx).


### 3. Verify the Regular Key Pair

To verify that your account has the regular key pair set correctly, submit an [`AccountSet`](reference-transaction-format.html#accountset) transaction from your account, signing it with the regular private key you assigned to your account in step 2.

As discussed in step 2, transmitting your master private key is dangerous. It is equally risky to transmit your regular private key, though the consequences of being comprised might be less severe. Therefore, we'll complete this transaction in two steps to keep transaction signing separate from transaction submission to the network.


#### Sign Your Transaction

The most secure way to sign a transaction is to do it offline with a signing library, such as [RippleAPI](reference-rippleapi.html#offline-functionality). Alternatively, you can sign the transaction using the [`sign`](reference-rippled.html#sign) command, but this must be done through a trusted and encrypted connection, or through a local connection, and only to a server you control.

Populate the request fields with the following values:

| Request Field | Value                                                        |
|:--------------|:-------------------------------------------------------------|
| `Account`     | The address of your account.                               |
| `secret`      | `master_key`, `master_seed`, or `master_seed_hex` (regular private key) generated in step 1 and assigned to your account in step 2. |


##### Request Format

Here's an example of the request format. Note that the request does not include any `AccountSet` options. This means that a successful transaction has no effect other than to confirm that the regular key pair is set correctly for your account (and to destroy the transaction cost).


<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
  "command": "sign",
  "tx_json": {
      "TransactionType": "AccountSet",
      "Account": "rUAi7pipxGpYfPNg3LtPcf2ApiS8aw9A93"
      },
   "secret": "sh8i92YRnEjJy3fpFkL8txQSCVo79"
}
```

*JSON-RPC*

```
{
   "method": "sign",
   "params": [
      {
         "tx_json": {
            "TransactionType": "AccountSet",
            "Account": "rUAi7pipxGpYfPNg3LtPcf2ApiS8aw9A93"
         },
         "secret": "sh8i92YRnEjJy3fpFkL8txQSCVo79"
      }
   ]
}
```

*Commandline*

```
#Syntax: sign secret tx_json
rippled sign sh8i92YRnEjJy3fpFkL8txQSCVo79 '{"TransactionType": "AccountSet", "Account": "rUAi7pipxGpYfPNg3LtPcf2ApiS8aw9A93"}'
```

<!-- MULTICODE_BLOCK_END -->


##### Response Format

An example of a successful response:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
  "result": {
    "tx_blob": "1200032280000000240000000468400000000000000A73210330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD02074473045022100A50E867D3B1B5A39F23F1ABCA5C7C3EC755442FDAA357EFD897B865ACA7686DB02206077BF459BCE39BCCBFE1A128DA986D1E00CBEC5F0D6B0E11710F60BE2976FB88114623B8DA4A0BFB3B61AB423391A182DC693DC159E",
    "tx_json": {
      "Account": "rUAi7pipxGpYfPNg3LtPcf2ApiS8aw9A93",
      "Fee": "10",
      "Flags": 2147483648,
      "Sequence": 4,
      "SigningPubKey": "0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020",
      "TransactionType": "AccountSet",
      "TxnSignature": "3045022100A50E867D3B1B5A39F23F1ABCA5C7C3EC755442FDAA357EFD897B865ACA7686DB02206077BF459BCE39BCCBFE1A128DA986D1E00CBEC5F0D6B0E11710F60BE2976FB8",
      "hash": "D9B305CB6E861D0994A5CDD4726129D91AC4277111DC444DE4CEE44AD4674A9F"
    }
  },
  "status": "success",
  "type": "response"
}
```

*JSON-RPC*

```
{
    "result": {
        "status": "success",
        "tx_blob": "1200032280000000240000000468400000000000000A73210330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD02074473045022100A50E867D3B1B5A39F23F1ABCA5C7C3EC755442FDAA357EFD897B865ACA7686DB02206077BF459BCE39BCCBFE1A128DA986D1E00CBEC5F0D6B0E11710F60BE2976FB88114623B8DA4A0BFB3B61AB423391A182DC693DC159E",
        "tx_json": {
            "Account": "rUAi7pipxGpYfPNg3LtPcf2ApiS8aw9A93",
            "Fee": "10",
            "Flags": 2147483648,
            "Sequence": 4,
            "SigningPubKey": "0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020",
            "TransactionType": "AccountSet",
            "TxnSignature": "3045022100A50E867D3B1B5A39F23F1ABCA5C7C3EC755442FDAA357EFD897B865ACA7686DB02206077BF459BCE39BCCBFE1A128DA986D1E00CBEC5F0D6B0E11710F60BE2976FB8",
            "hash": "D9B305CB6E861D0994A5CDD4726129D91AC4277111DC444DE4CEE44AD4674A9F"
        }
    }
}
```

*Commandline*

```
{
   "result" : {
      "status" : "success",
      "tx_blob" : "1200032280000000240000000468400000000000000A73210330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD02074473045022100A50E867D3B1B5A39F23F1ABCA5C7C3EC755442FDAA357EFD897B865ACA7686DB02206077BF459BCE39BCCBFE1A128DA986D1E00CBEC5F0D6B0E11710F60BE2976FB88114623B8DA4A0BFB3B61AB423391A182DC693DC159E",
      "tx_json" : {
         "Account" : "rUAi7pipxGpYfPNg3LtPcf2ApiS8aw9A93",
         "Fee" : "10",
         "Flags" : 2147483648,
         "Sequence" : 4,
         "SigningPubKey" : "0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020",
         "TransactionType" : "AccountSet",
         "TxnSignature" : "3045022100A50E867D3B1B5A39F23F1ABCA5C7C3EC755442FDAA357EFD897B865ACA7686DB02206077BF459BCE39BCCBFE1A128DA986D1E00CBEC5F0D6B0E11710F60BE2976FB8",
         "hash" : "D9B305CB6E861D0994A5CDD4726129D91AC4277111DC444DE4CEE44AD4674A9F"
      }
   }
}
```

<!-- MULTICODE_BLOCK_END -->

The `sign` command response contains a `tx_blob` value, as shown above. The offline signing response contains a `signedTransaction` value. Both are signed binary representations (blobs) of the transaction.

Next, use the `submit` command to transmit the transaction blob (`tx_blob` or `signedTransaction`) to the network.


#### Submit Your Transaction

Take the `signedTransaction` value from the offline signing response or the `tx_blob` value from the `sign` command response and submit it as the `tx_blob` value using the [`submit`](reference-rippled.html#submit) command.

##### Request Format

An example of the request format:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
    "command": "submit",
    "tx_blob": "1200032280000000240000000468400000000000000A73210330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD02074473045022100A50E867D3B1B5A39F23F1ABCA5C7C3EC755442FDAA357EFD897B865ACA7686DB02206077BF459BCE39BCCBFE1A128DA986D1E00CBEC5F0D6B0E11710F60BE2976FB88114623B8DA4A0BFB3B61AB423391A182DC693DC159E"
}
```

*JSON-RPC*

```
{
   "method":"submit",
   "params": [
      {
         "tx_blob": "1200032280000000240000000468400000000000000A73210330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD02074473045022100A50E867D3B1B5A39F23F1ABCA5C7C3EC755442FDAA357EFD897B865ACA7686DB02206077BF459BCE39BCCBFE1A128DA986D1E00CBEC5F0D6B0E11710F60BE2976FB88114623B8DA4A0BFB3B61AB423391A182DC693DC159E"
      }
   ]
}
```

*Commandline*

```
#Syntax: submit tx_blob
rippled submit 1200032280000000240000000468400000000000000A73210330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD02074473045022100A50E867D3B1B5A39F23F1ABCA5C7C3EC755442FDAA357EFD897B865ACA7686DB02206077BF459BCE39BCCBFE1A128DA986D1E00CBEC5F0D6B0E11710F60BE2976FB88114623B8DA4A0BFB3B61AB423391A182DC693DC159E
```

<!-- MULTICODE_BLOCK_END -->


##### Response Format

An example of a successful response:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
  "result": {
    "engine_result": "tesSUCCESS",
    "engine_result_code": 0,
    "engine_result_message": "The transaction was applied. Only final in a validated ledger.",
    "tx_blob": "1200032280000000240000000468400000000000000A73210330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD02074473045022100A50E867D3B1B5A39F23F1ABCA5C7C3EC755442FDAA357EFD897B865ACA7686DB02206077BF459BCE39BCCBFE1A128DA986D1E00CBEC5F0D6B0E11710F60BE2976FB88114623B8DA4A0BFB3B61AB423391A182DC693DC159E",
    "tx_json": {
      "Account": "rUAi7pipxGpYfPNg3LtPcf2ApiS8aw9A93",
      "Fee": "10",
      "Flags": 2147483648,
      "Sequence": 4,
      "SigningPubKey": "0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020",
      "TransactionType": "AccountSet",
      "TxnSignature": "3045022100A50E867D3B1B5A39F23F1ABCA5C7C3EC755442FDAA357EFD897B865ACA7686DB02206077BF459BCE39BCCBFE1A128DA986D1E00CBEC5F0D6B0E11710F60BE2976FB8",
      "hash": "D9B305CB6E861D0994A5CDD4726129D91AC4277111DC444DE4CEE44AD4674A9F"
    }
  },
  "status": "success",
  "type": "response"
}
```

*JSON-RPC*

```
{
    "result": {
        "engine_result": "tesSUCCESS",
        "engine_result_code": 0,
        "engine_result_message": "The transaction was applied. Only final in a validated ledger.",
        "status": "success",
        "tx_blob": "1200032280000000240000000468400000000000000A73210330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD02074473045022100A50E867D3B1B5A39F23F1ABCA5C7C3EC755442FDAA357EFD897B865ACA7686DB02206077BF459BCE39BCCBFE1A128DA986D1E00CBEC5F0D6B0E11710F60BE2976FB88114623B8DA4A0BFB3B61AB423391A182DC693DC159E",
        "tx_json": {
            "Account": "rUAi7pipxGpYfPNg3LtPcf2ApiS8aw9A93",
            "Fee": "10",
            "Flags": 2147483648,
            "Sequence": 4,
            "SigningPubKey": "0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020",
            "TransactionType": "AccountSet",
            "TxnSignature": "3045022100A50E867D3B1B5A39F23F1ABCA5C7C3EC755442FDAA357EFD897B865ACA7686DB02206077BF459BCE39BCCBFE1A128DA986D1E00CBEC5F0D6B0E11710F60BE2976FB8",
            "hash": "D9B305CB6E861D0994A5CDD4726129D91AC4277111DC444DE4CEE44AD4674A9F"
        }
    }
}
```

*Commandline*

```
{
   "result" : {
      "engine_result" : "tesSUCCESS",
      "engine_result_code" : 0,
      "engine_result_message" : "The transaction was applied. Only final in a validated ledger.",
      "status" : "success",
      "tx_blob" : "1200032280000000240000000468400000000000000A73210330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD02074473045022100A50E867D3B1B5A39F23F1ABCA5C7C3EC755442FDAA357EFD897B865ACA7686DB02206077BF459BCE39BCCBFE1A128DA986D1E00CBEC5F0D6B0E11710F60BE2976FB88114623B8DA4A0BFB3B61AB423391A182DC693DC159E",
      "tx_json" : {
         "Account" : "rUAi7pipxGpYfPNg3LtPcf2ApiS8aw9A93",
         "Fee" : "10",
         "Flags" : 2147483648,
         "Sequence" : 4,
         "SigningPubKey" : "0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020",
         "TransactionType" : "AccountSet",
         "TxnSignature" : "3045022100A50E867D3B1B5A39F23F1ABCA5C7C3EC755442FDAA357EFD897B865ACA7686DB02206077BF459BCE39BCCBFE1A128DA986D1E00CBEC5F0D6B0E11710F60BE2976FB8",
         "hash" : "D9B305CB6E861D0994A5CDD4726129D91AC4277111DC444DE4CEE44AD4674A9F"
      }
   }
}
```

<!-- MULTICODE_BLOCK_END -->


### 4. Explore Next Steps

Now that you're familiar with the benefits of assigning a regular key pair to an account, consider taking a look at these related topics and tutorials:

* [How to Multi-Sign](tutorial-multisign.html)
* [Issuing and Operational Addresses](concept-issuing-and-operational-addresses.html)
* [Listing XRP as an Exchange](tutorial-listing-xrp.html)


## Changing or Removing a Regular Key Pair

If your account's regular key pair is compromised, or if you just want to periodically change the regular key pair as a security measure, use the [`SetRegularKey`](reference-transaction-format.html#setregularkey) method to remove or change the regular key pair for your account.


### Changing a Regular Key Pair

The steps to change your existing regular key pair are almost the same as the steps to [assign a regular key](#assigning-a-regular-key-pair) for the first time. You generate the key pair and assign it to your account as a regular key pair, overwriting the existing regular key pair. However, the main difference is that when changing the existing regular key pair, you can use the existing regular private key to replace itself, whereas when assigning a regular key pair to an account for the first time, you have to use the account's master private key to do it.

For more information about master and regular key pairs, see [Cryptographic Keys](cryptographic-keys.html).


### Removing a Regular Key Pair

If you want to simply remove a compromised regular key pair from your account, you don't need to generate a key pair first. Just use the [`SetRegularKey`](reference-transaction-format.html#setregularkey) method, omitting the `RegularKey` value in the request. Note that the method fails if you don't have another way of signing for your account currently enabled (either the master key pair or a [signer list](reference-transaction-format.html#multi-signing)).


When removing a regular key pair to your account, the `SetRegularKey` method requires signing by your account's master private key (secret) or existing regular key pair. Transmitting your master or regular private key is dangerous, so we'll complete this transaction in two steps to keep transaction signing separate from transaction submission to the network.

#### Sign Your Transaction

The most secure way to sign a transaction is to do it offline with a signing library, such as [RippleAPI](reference-rippleapi.html#offline-functionality). Alternatively, you can sign the transaction using the [`sign`](reference-rippled.html#sign) command, but this must be done through a trusted and encrypted connection, or through a local connection, and only to a server you control.

Populate the request fields with the following values:

| Request Field | Value                                                        |
|:--------------|:-------------------------------------------------------------|
| `Account`     | The address of your account.                                 |
| `secret`      | `master_key`, `master_seed`, or `master_seed_hex` (master or regular private key) for your account. |


##### Request Format

An example of the request format:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
  "command": "sign",
  "tx_json": {
      "TransactionType": "SetRegularKey",
      "Account": "r9xQZdFGwbwTB3g9ncKByWZ3du6Skm7gQ8"
      },
   "secret": "snoPBrXtMeMyMHUVTgbuqAfg1SUTb"
}
```

*JSON-RPC*

```
{
    "method": "sign",
    "params": [
    	{
    	"secret" : "snoPBrXtMeMyMHUVTgbuqAfg1SUTb",
		"tx_json" : {
    		"TransactionType" : "SetRegularKey",
    		"Account" : "r9xQZdFGwbwTB3g9ncKByWZ3du6Skm7gQ8"
			}
		}
	]
}
```

*Commandline*

```
#Syntax: sign secret tx_json
rippled sign snoPBrXtMeMyMHUVTgbuqAfg1SUTb '{"TransactionType": "SetRegularKey", "Account": "rUAi7pipxGpYfPNg3LtPcf2ApiS8aw9A93"}'
```

<!-- MULTICODE_BLOCK_END -->


##### Response Format

An example of a successful response:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
  "result": {
    "tx_blob": "1200052280000000240000000268400000000000000A73210330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD02074473045022100CAB9A6F84026D57B05760D5E2395FB7BE86BF39F10DC6E2E69DC91238EE0970B022058EC36A8EF9EE65F5D0D8CAC4E88C8C19FEF39E40F53D4CCECBB59701D6D1E838114623B8DA4A0BFB3B61AB423391A182DC693DC159E",
    "tx_json": {
      "Account": "r9xQZdFGwbwTB3g9ncKByWZ3du6Skm7gQ8",
      "Fee": "10",
      "Flags": 2147483648,
      "Sequence": 2,
      "SigningPubKey": "0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020",
      "TransactionType": "SetRegularKey",
      "TxnSignature": "3045022100CAB9A6F84026D57B05760D5E2395FB7BE86BF39F10DC6E2E69DC91238EE0970B022058EC36A8EF9EE65F5D0D8CAC4E88C8C19FEF39E40F53D4CCECBB59701D6D1E83",
      "hash": "59BCAB8E5B9D4597D6A7BFF22F6C555D0F41420599A2E126035B6AF19261AD97"
    }
  },
  "status": "success",
  "type": "response"
}
```

*JSON-RPC*

```
{NEWWWWWWWWWWWW
    "result": {
        "status": "success",
        "tx_blob": "1200052280000000240000000268400000000000000A73210330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD02074473045022100CAB9A6F84026D57B05760D5E2395FB7BE86BF39F10DC6E2E69DC91238EE0970B022058EC36A8EF9EE65F5D0D8CAC4E88C8C19FEF39E40F53D4CCECBB59701D6D1E838114623B8DA4A0BFB3B61AB423391A182DC693DC159E",
        "tx_json": {
            "Account": "r9xQZdFGwbwTB3g9ncKByWZ3du6Skm7gQ8",
            "Fee": "10",
            "Flags": 2147483648,
            "Sequence": 2,
            "SigningPubKey": "0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020",
            "TransactionType": "SetRegularKey",
            "TxnSignature": "3045022100CAB9A6F84026D57B05760D5E2395FB7BE86BF39F10DC6E2E69DC91238EE0970B022058EC36A8EF9EE65F5D0D8CAC4E88C8C19FEF39E40F53D4CCECBB59701D6D1E83",
            "hash": "59BCAB8E5B9D4597D6A7BFF22F6C555D0F41420599A2E126035B6AF19261AD97"
        }
    }
}
```

*Commandline*

```
{
   "result" : {
      "status" : "success",
      "tx_blob" : "1200052280000000240000000268400000000000000A73210330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD02074473045022100CAB9A6F84026D57B05760D5E2395FB7BE86BF39F10DC6E2E69DC91238EE0970B022058EC36A8EF9EE65F5D0D8CAC4E88C8C19FEF39E40F53D4CCECBB59701D6D1E838114623B8DA4A0BFB3B61AB423391A182DC693DC159E",
      "tx_json" : {
         "Account" : "r9xQZdFGwbwTB3g9ncKByWZ3du6Skm7gQ8",
         "Fee" : "10",
         "Flags" : 2147483648,
         "Sequence" : 2,
         "SigningPubKey" : "0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020",
         "TransactionType" : "SetRegularKey",
         "TxnSignature" : "3045022100CAB9A6F84026D57B05760D5E2395FB7BE86BF39F10DC6E2E69DC91238EE0970B022058EC36A8EF9EE65F5D0D8CAC4E88C8C19FEF39E40F53D4CCECBB59701D6D1E83",
         "hash" : "59BCAB8E5B9D4597D6A7BFF22F6C555D0F41420599A2E126035B6AF19261AD97"
      }
   }
}
```

<!-- MULTICODE_BLOCK_END -->

The `sign` command response contains a `tx_blob` value, as shown above. The offline signing response contains a `signedTransaction` value. Both are signed binary representations (blobs) of the transaction.

Next, use the `submit` command to transmit the transaction blob (`tx_blob` or `signedTransaction`) to the network.


#### Submit Your Transaction

Take the `signedTransaction` value from the offline signing response or the `tx_blob` value from the `sign` command response and submit it as the `tx_blob` value using the [`submit`](reference-rippled.html#submit) command.

##### Request Format

An example of the request format:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
    "command": "submit",
    "tx_blob": "1200052280000000240000000268400000000000000A73210330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD02074473045022100CAB9A6F84026D57B05760D5E2395FB7BE86BF39F10DC6E2E69DC91238EE0970B022058EC36A8EF9EE65F5D0D8CAC4E88C8C19FEF39E40F53D4CCECBB59701D6D1E838114623B8DA4A0BFB3B61AB423391A182DC693DC159E"
}
```

*JSON-RPC*

```
{
   "method":"submit",
   "params":[
      {
         "tx_blob":"1200052280000000240000000268400000000000000A73210330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD02074473045022100CAB9A6F84026D57B05760D5E2395FB7BE86BF39F10DC6E2E69DC91238EE0970B022058EC36A8EF9EE65F5D0D8CAC4E88C8C19FEF39E40F53D4CCECBB59701D6D1E838114623B8DA4A0BFB3B61AB423391A182DC693DC159E"
      }
   ]
}
```

*Commandline*

```
#Syntax: submit tx_blob
rippled submit 1200052280000000240000000268400000000000000A73210330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD02074473045022100CAB9A6F84026D57B05760D5E2395FB7BE86BF39F10DC6E2E69DC91238EE0970B022058EC36A8EF9EE65F5D0D8CAC4E88C8C19FEF39E40F53D4CCECBB59701D6D1E838114623B8DA4A0BFB3B61AB423391A182DC693DC159E
```

<!-- MULTICODE_BLOCK_END -->


##### Response Format

An example of a successful response:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
  "result": {
    "engine_result": "tesSUCCESS",
    "engine_result_code": 0,
    "engine_result_message": "The transaction was applied. Only final in a validated ledger.",
    "tx_blob": "1200052280000000240000000268400000000000000A73210330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD02074473045022100CAB9A6F84026D57B05760D5E2395FB7BE86BF39F10DC6E2E69DC91238EE0970B022058EC36A8EF9EE65F5D0D8CAC4E88C8C19FEF39E40F53D4CCECBB59701D6D1E838114623B8DA4A0BFB3B61AB423391A182DC693DC159E",
    "tx_json": {
      "Account": "r9xQZdFGwbwTB3g9ncKByWZ3du6Skm7gQ8",
      "Fee": "10",
      "Flags": 2147483648,
      "Sequence": 2,
      "SigningPubKey": "0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020",
      "TransactionType": "SetRegularKey",
      "TxnSignature": "3045022100CAB9A6F84026D57B05760D5E2395FB7BE86BF39F10DC6E2E69DC91238EE0970B022058EC36A8EF9EE65F5D0D8CAC4E88C8C19FEF39E40F53D4CCECBB59701D6D1E83",
      "hash": "59BCAB8E5B9D4597D6A7BFF22F6C555D0F41420599A2E126035B6AF19261AD97"
    }
  },
  "status": "success",
  "type": "response"
}
```

*JSON-RPC*

```
{
    "result": {
        "engine_result": "tesSUCCESS",
        "engine_result_code": 0,
        "engine_result_message": "The transaction was applied. Only final in a validated ledger.",
        "status": "success",
        "tx_blob": "1200052280000000240000000268400000000000000A73210330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD02074473045022100CAB9A6F84026D57B05760D5E2395FB7BE86BF39F10DC6E2E69DC91238EE0970B022058EC36A8EF9EE65F5D0D8CAC4E88C8C19FEF39E40F53D4CCECBB59701D6D1E838114623B8DA4A0BFB3B61AB423391A182DC693DC159E",
        "tx_json": {
            "Account": "r9xQZdFGwbwTB3g9ncKByWZ3du6Skm7gQ8",
            "Fee": "10",
            "Flags": 2147483648,
            "Sequence": 2,
            "SigningPubKey": "0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020",
            "TransactionType": "SetRegularKey",
            "TxnSignature": "3045022100CAB9A6F84026D57B05760D5E2395FB7BE86BF39F10DC6E2E69DC91238EE0970B022058EC36A8EF9EE65F5D0D8CAC4E88C8C19FEF39E40F53D4CCECBB59701D6D1E83",
            "hash": "59BCAB8E5B9D4597D6A7BFF22F6C555D0F41420599A2E126035B6AF19261AD97"
        }
    }
}
```

*Commandline*

```
{
   "result" : {
      "engine_result" : "tesSUCCESS",
      "engine_result_code" : 0,
      "engine_result_message" : "The transaction was applied. Only final in a validated ledger.",
      "status" : "success",
      "tx_blob" : "1200052280000000240000000268400000000000000A73210330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD02074473045022100CAB9A6F84026D57B05760D5E2395FB7BE86BF39F10DC6E2E69DC91238EE0970B022058EC36A8EF9EE65F5D0D8CAC4E88C8C19FEF39E40F53D4CCECBB59701D6D1E838114623B8DA4A0BFB3B61AB423391A182DC693DC159E",
      "tx_json" : {
         "Account" : "r9xQZdFGwbwTB3g9ncKByWZ3du6Skm7gQ8",
         "Fee" : "10",
         "Flags" : 2147483648,
         "Sequence" : 2,
         "SigningPubKey" : "0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020",
         "TransactionType" : "SetRegularKey",
         "TxnSignature" : "3045022100CAB9A6F84026D57B05760D5E2395FB7BE86BF39F10DC6E2E69DC91238EE0970B022058EC36A8EF9EE65F5D0D8CAC4E88C8C19FEF39E40F53D4CCECBB59701D6D1E83",
         "hash" : "59BCAB8E5B9D4597D6A7BFF22F6C555D0F41420599A2E126035B6AF19261AD97"
      }
   }
}
```

<!-- MULTICODE_BLOCK_END -->

The way to verify that regular key pair removal succeeded is to confirm that you can't send a transaction using the removed regular private key.

Here's an example error response for an [`AccountSet`](reference-transaction-format.html#accountset) transaction signed using the regular private key removed by the `SetRegularKey` transaction above.


#### Response Format

An example of a successful response:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
  "error": "badSecret",
  "error_code": 41,
  "error_message": "Secret does not match account.",
  "request": {
    "command": "submit",
    "secret": "snoPBrXtMeMyMHUVTgbuqAfg1SUTb",
    "tx_json": {
      "Account": "r9xQZdFGwbwTB3g9ncKByWZ3du6Skm7gQ8",
      "TransactionType": "AccountSet"
    }
  },
  "status": "error",
  "type": "response"
}
```

*JSON-RPC*

```
{NEWWWWWWWWWWWW
    "result": {
        "error": "badSecret",
        "error_code": 41,
        "error_message": "Secret does not match account.",
        "request": {
            "command": "submit",
            "secret": "snoPBrXtMeMyMHUVTgbuqAfg1SUTb",
            "tx_json": {
                "Account": "r9xQZdFGwbwTB3g9ncKByWZ3du6Skm7gQ8",
                "TransactionType": "AccountSet"
            }
        },
        "status": "error"
    }
}
```

*Commandline*

```
{
   "result" : {
      "error" : "badSecret",
      "error_code" : 41,
      "error_message" : "Secret does not match account.",
      "request" : {
         "command" : "submit",
         "secret" : "snoPBrXtMeMyMHUVTgbuqAfg1SUTb",
         "tx_json" : {
            "Account" : "r9xQZdFGwbwTB3g9ncKByWZ3du6Skm7gQ8",
            "TransactionType" : "AccountSet"
         }
      },
      "status" : "error"
   }
}
```

<!-- MULTICODE_BLOCK_END -->

In some cases, you can even use the `SetRegularKey` method to send a [key reset transaction](concept-transaction-cost.html#key-reset-transaction) without paying the [transaction cost](reference-transaction-format.html#transaction-cost). With the enablement of the FeeEscalation amendment, `rippled` prioritizes key reset transactions above other transactions even though the nominal transaction cost of a key reset transaction is zero.
