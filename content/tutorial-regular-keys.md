# Working with Regular Keys

Assign regular keys to your account to enable you to sign most transactions with regular keys, while keeping your master keys offline and safe from malicious actors. A master key compromise can be difficult to recover from, while removing or changing compromised regular keys is a simpler task.

For more information about master and regular keys, see [Understanding Master and Regular Keys](concept-keys.html).

This article provides the following tutorials:

* [Assigning Regular Keys](#assigning-regular-keys)
* [Removing or Changing Regular Keys](#removing-or-changing-regular-keys)


## Assigning Regular Keys

This tutorial walks you through the steps required to assign regular keys to your account:

***TODO: I removed the steps to create an account and fund an account. These are prereqs that introduce confusion when included in this flow. The overview of keys talks about the `account_id` returned by `wallet_propose` and makes the point that an actual account does not exist until it is funded by a payment that meets the reserve requirement. Do we need a tutorial on creating an account?***

1. [Generate keys](#1-generate-keys)
2. [Assign the keys to your account as regular keys](#2-assign-keys-to-your-account-as-regular-keys)
3. [Submit a test payment using regular keys](#3-submit-a-test-payment-using-regular-keys)
4. [Explore next steps](#4-explore-next-steps)


### 1. Generate Keys

Use the [`wallet_propose`](reference-rippled.html#wallet-propose) method to generate the keys that you'll assign to your account as regular keys.

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
   "account_id": "rf9vUoqa83foreMr6CYFCEPTZUFagZv83c",
   "key_type": "secp256k1",
   "master_key": "REG ULAR PRIV ATE KEY RFC 1751 XXX XXXX XXX XXXX XXX",
   "master_seed": "RegularPrivateKeyXXXXXXXXXXXX",
   "master_seed_hex": "RegularPrivateKeyHexXXXXXXXXXXXX",
   "public_key": "aBR9dmoHfrfU24q1cbjdehNsFiuV9k5PrrQTLiH42qxhWr5ybc1K",
   "public_key_hex": "03A45E8E4BFECA7473F932839B982C33CD2FB7B788932A21DCDD8536AE63A1614C"
 },
 "status": "success",
 "type": "response"
}
```

In the next step, you'll use the `account_id` from this response to assign the keys as regular keys to your account.


### 2. Assign Keys to Your Account as Regular Keys

Use the [`SetRegularKey`](reference-transaction-format.html#setregularkey) method to assign the keys you generated in step 1 to your account as regular keys.

In the request, send your account's `account_ID` as the `account` value, your account's `master_key`, `master_seed`, or `master_seed_hex` (master private key) as the `secret` value, and the `account_id` generated in step 1 as the `RegularKey` value.

Here's an example `SetRegularKey` request and response.


#### WebSocket Request:

**Note:** This request format uses the `submit` command and a `tx_json` object to sign and submit this transaction all at once. This practice is recommended for **testing and development purposes only**. Transmitting your account secret is dangerous, so you should do this only from within a trusted and encrypted connection, or through a local connection, and only to a server you control.

***TODO: Question: Should this tutorial walk folks through the process of offline signing and then submission? It feels weird to say that they should keep their master keys offline and then have them send their secret in the request below. Is our approach to tutorials that they should show a user how something works for test and dev purposes? Just to show results quickly? Or is it to illustrate best practices for how a task should be performed day-to-day? If yes, then I think I need to get ripple-lib setup to do offline signing and a submit here in the tutorial. https://ripple.com/build/rippleapi/#offline-functionality -- this offline signing is not working for me right off the bat. Errors are not being returned, so I can't troubleshoot. I am sure that I'm missing a few steps -- will require research.***

```
{
   "command" : "submit",
   "tx_json" : {
      "TransactionType" : "SetRegularKey",
      "Account" : "rM8oJwkKtgEU2HZkCHsJScLHqegWpgBRxt",
      "RegularKey" : "rf9vUoqa83foreMr6CYFCEPTZUFagZv83c"
   },
   "secret" : "MasterPrivateKeyXXXXXXXXXXXXX"
}
```


#### WebSocket Response:

```
{
  "result": {
    "engine_result": "tesSUCCESS",
    "engine_result_code": 0,
    "engine_result_message": "The transaction was applied. Only final in a validated ledger.",
    "tx_blob": "1200052280000000240000000168400000000000000A7321032D911AE9887278110A8FE25169546D4E95A82AF5EFA25525FC3FDFFDC5A8B604744730450221008EBFA6ABE01BB31A772816FF8560DA78273FA4DC982D0C85A6A516A9188AD70A02205CE1E9E3A685D4D29C62C9DA334BC8BB16468AAA11B572320AD2E98AE1B551BB8114E40BE141DFE3544627F98879C9A600974C4C37B3881443807E97EA8BCB97F4032DEFB4AC9208A359493E",
    "tx_json": {
      "Account": "rM8oJwkKtgEU2HZkCHsJScLHqegWpgBRxt",
      "Fee": "10",
      "Flags": 2147483648,
      "RegularKey": "rf9vUoqa83foreMr6CYFCEPTZUFagZv83c",
      "Sequence": 1,
      "SigningPubKey": "032D911AE9887278110A8FE25169546D4E95A82AF5EFA25525FC3FDFFDC5A8B604",
      "TransactionType": "SetRegularKey",
      "TxnSignature": "30450221008EBFA6ABE01BB31A772816FF8560DA78273FA4DC982D0C85A6A516A9188AD70A02205CE1E9E3A685D4D29C62C9DA334BC8BB16468AAA11B572320AD2E98AE1B551BB",
      "hash": "A9EE659DC08E6589F3454186C1D846763E55DEEF5525A8AE1F3D87B53EF5B86A"
    }
  },
  "status": "success",
  "type": "response"
}
```

This response contains a `SigningPubKey` field, which is the public key of the sending account in hex format. For more information about signatures, see [Understanding Signatures](concept-signatures.html)


### 3. Submit a Test Payment Using Regular Keys

To verify that the regular keys are set correctly on your account, send a test [`Payment`](reference-transaction-format.html#payment) transaction from your account, signing it with the regular keys you assigned to your account in step 2.

***TODO: Question: I keep referring to "keys" plural. Is that correct? When you sign a transaction, you send a single key value -- but in reality, multiple keys are being used, even if indirectly, to actually sign the transaction, is that right? Is that why using "keys" plural is accurate?***

In the request, send your account's `account_id` as the `Account` value and the `master_key`, `master_seed`, or `master_seed_hex` (regular private key) generated in step 1 as the `secret` value.

Here's an example `Payment` request and response.


#### WebSocket Request:

**Note:** This request format uses the `submit` command and a `tx_json` object to sign and submit this transaction all at once. This practice is recommended for **testing and development purposes only**. Transmitting your account secret is dangerous, so you should do this only from within a trusted and encrypted connection, or through a local connection, and only to a server you control.

***TODO: Question: What do we recommend here - even if we have set a regular key, do we still recommend signing offline to keep the secret/regular private key offline?***

```
{
   "method":"submit",
   "secret":"RegularPrivateKeyXXXXXXXXXXXX",
   "tx_json": {
         "Account":"rf9vUoqa83foreMr6CYFCEPTZUFagZv83c",
         "Fee":"10",
         "Amount":"10000000",
         "Destination":"rM8oJwkKtgEU2HZkCHsJScLHqegWpgBRxt",
         "TransactionType":"Payment"
      }
}
```


#### WebSocket Response:

```
{
  "result": {
    "engine_result": "tesSUCCESS",
    "engine_result_code": 0,
    "engine_result_message": "The transaction was applied. Only final in a validated ledger.",
    "tx_blob": "1200002280000000240000000361400000000098968068400000000000000A732103A45E8E4BFECA7473F932839B982C33CD2FB7B788932A21DCDD8536AE63A1614C74463044022037DC86BEE1D0E1F394273B80E4072A35B2E221880879CC2C47FE0AD152B3E2120220511A6555B8A524321E962164EC830A83267AF97E9FDF24CCEC7B38944E2CC95C8114E40BE141DFE3544627F98879C9A600974C4C37B38314F779A56C00EF101471C8ADED9343532063E73AFE",
    "tx_json": {
      "Account": "rM8oJwkKtgEU2HZkCHsJScLHqegWpgBRxt",
      "Amount": "10000000",
      "Destination": "rPZXdWPxSXCBfnSXGnnBhXjhJ8V5K7oB5s",
      "Fee": "10",
      "Flags": 2147483648,
      "Sequence": 3,
      "SigningPubKey": "03A45E8E4BFECA7473F932839B982C33CD2FB7B788932A21DCDD8536AE63A1614C",
      "TransactionType": "Payment",
      "TxnSignature": "3044022037DC86BEE1D0E1F394273B80E4072A35B2E221880879CC2C47FE0AD152B3E2120220511A6555B8A524321E962164EC830A83267AF97E9FDF24CCEC7B38944E2CC95C",
      "hash": "A8C3D091245794A664A5C1F0D275D1DB9A9349F1F873AABAD7AD1E43E8A117FB"
    }
  },
  "status": "success",
  "type": "response"
}
```

This response contains a `SigningPubKey` field, which is the public key of the sending account in hex format. For more information about signatures, see [Understanding Signatures](concept-signatures.html)


### 4. Explore Next Steps

Now that you're familiar with the benefits of assigning regular keys to an account, consider taking a look at these related topics and tutorials:

* [How to Multi-Sign](tutorial-multisign.html)
* [Issuing and Operational Addresses](concept-issuing-and-operational-addresses.html)
* [Listing XRP as an Exchange](tutorial-listing-xrp.html)


## Removing or Changing Regular keys

If your regular keys are compromised, or if you just want to periodically change regular keys as a security measure, use the [`SetRegularKey`](reference-transaction-format.html#setregularkey) method to remove or change the regular keys for your account. ***TODO: I believe the first if is valid. How about the second if? Is this something that someone might want to do?***

The steps to change your regular keys are the same as the steps to [assign regular keys](#assigning-regular-keys). You generate keys and assign them to your account as regular keys, overwriting any existing regular keys.

If you want to simply remove compromised regular keys from your account, use the [`SetRegularKey`](reference-transaction-format.html#setregularkey) method and omit the `RegularKey` value in the request.

***TODO: Is it valid to treat these as two separate flows - change vs remove? If you are doing security maintenance, it may be  convenient to change them. If the keys are compromised, you may want to just quickly remove the keys, and generate and assign new keys later, or not at all. Valid?***

Here's an example `SetRegularKey` request and response that removes any existing regular keys from an account:


#### WebSocket Request:

**Note:** This request format uses the `submit` command and a `tx_json` object to sign and submit this transaction all at once. This practice is recommended for **testing and development purposes only**. Transmitting your account secret is dangerous, so you should do this only from within a trusted and encrypted connection, or through a local connection, and only to a server you control.

```
{
   "command" : "submit",
   "tx_json" : {
      "TransactionType" : "SetRegularKey",
      "Account" : "rM8oJwkKtgEU2HZkCHsJScLHqegWpgBRxt"
   },
   "secret" : "MasterPrivateKeyXXXXXXXXXXXXX"
}
```


#### WebSocket Response:

```
{
  "result": {
    "engine_result": "tesSUCCESS",
    "engine_result_code": 0,
    "engine_result_message": "The transaction was applied. Only final in a validated ledger.",
    "tx_blob": "1200052280000000240000000468400000000000000A7321032D911AE9887278110A8FE25169546D4E95A82AF5EFA25525FC3FDFFDC5A8B60474463044022035B3076FED158D1CBFE2898521BDB068C6A2BE5C1BEA111D7F8611B1A35A10C302204CD5F547A7538C70404A5A157F5C1D4607B1F739C6C70D33895012E5B83E301E8114E40BE141DFE3544627F98879C9A600974C4C37B3",
    "tx_json": {
      "Account": "rM8oJwkKtgEU2HZkCHsJScLHqegWpgBRxt",
      "Fee": "10",
      "Flags": 2147483648,
      "Sequence": 4,
      "SigningPubKey": "032D911AE9887278110A8FE25169546D4E95A82AF5EFA25525FC3FDFFDC5A8B604",
      "TransactionType": "SetRegularKey",
      "TxnSignature": "3044022035B3076FED158D1CBFE2898521BDB068C6A2BE5C1BEA111D7F8611B1A35A10C302204CD5F547A7538C70404A5A157F5C1D4607B1F739C6C70D33895012E5B83E301E",
      "hash": "81F8D1D892D2A18814337470B02DD7AFA123CDDF85150DCE333674435254D046"
    }
  },
  "status": "success",
  "type": "response"
}
```

Here's an example error response for a `Payment` transaction signed using an invalid regular key.

#### WebSocket Response:

```
{
  "error": "badSecret",
  "error_code": 41,
  "error_message": "Secret does not match account.",
  "request": {
    "method": "submit",
    "secret": "RegularPrivateKeyXXXXXXXXXXXX",
    "tx_json": {
      "Account": "rM8oJwkKtgEU2HZkCHsJScLHqegWpgBRxt",
      "Amount": "10000000",
      "Destination": "rPZXdWPxSXCBfnSXGnnBhXjhJ8V5K7oB5s",
      "Fee": "10",
      "TransactionType": "Payment"
    }
  },
  "status": "error",
  "type": "response"
}
```

In some cases, you can even send a [key reset transaction](concept-transaction-cost.html#key-reset-transaction) without paying the [transaction cost](reference-transaction-format.html#transaction-cost).

***TODO: I don't understand how this key reset transaction mentioned above works. Is it different from sending a SetRegularKey transaction that omits or changes the RegularKey value assigned to an account? Is the difference that the transaction cost can be 0? Does this mean that I can send a SetRegularKey transaction that omits or changes the RegularKey value assigned to an account and includes `Fee : 0` - as long as the `lsfPasswordSpent` flag is disabled? When I send such a transaction to a newly funded account that has had no activity on it other than one payment to fund it and one SetRegularKeys transaction for a `Fee : 10`, I get a response that says: `Fee insufficient`.***

***TODO: I understand that the account's `lsfPasswordSpent` flag must be disabled and that it starts out disabled. We say: "As a special case, an account can send a SetRegularKey transaction with a transaction cost of 0, as long as the account's lsfPasswordSpent flag is disabled. This transaction must be signed by the account's master key pair. Sending this transaction enables the lsfPasswordSpent flag. The lsfPasswordSpent flag starts out disabled. It gets enabled when you send a SetRegularKey transaction signed by the master key pair. It gets disabled again when the account receives a Payment of XRP." When we say that sending the transaction enables the flag - this means that it started off as disabled, fulfilled the `Fee : 0` key reset, and then enabled the flag to deny any further SetRegularKey with `Fee : 0` transaction requests? And it will continue to deny these requests until the account receives a payment? This means that if you are afraid that your account balance is close to 0, you should use your one SetRegularKey with `Fee : 0` to change your RegularKey value and not just remove it. If you remove it, then you won't be able to pay for the transaction to set a new value, correct?***

***TODO: This piece of info is important -- but until I understand the key reset transaction, it is difficult to explain how/when this prioritization will happen: "When the FeeEscalation amendment is enabled, rippled prioritizes key reset transactions above other transactions even though the nominal transaction cost of a key reset transaction is zero.***
