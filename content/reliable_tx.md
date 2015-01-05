# Reliable Transaction Submission

Gateways and back-end applications should use the best practices described here to ensure that transactions are validated or rejected in a verifiable and timely fashion.  Transactions should be submitted to trusted (locally operated) rippled servers.

The best practices detailed in this document allow applications to submit transactions to the Ripple network while achieving:

1. [Idempotency](https://en.wikipedia.org/wiki/Idempotence) - Transactions will be processed once and only once, or not at all.
2. Verifiability - Applications can determine the final result of a transaction.

Applications which fail to implement best practices are at risk of the following errors:

1. Submitting transactions which are inadvertently never executed.
2. Mistaking provisional transaction results for their final, immutable results.
3. Failing to find authoritative results of transactions previously applied to the ledger.

These types of errors can potentially lead to serious problems.  For example, an application that fails to find a prior successful payment transaction might erroneously submit another transaction, duplicating the original payment.  This underscores the importance that applications base their actions on authoritive transaction results, using the techniques described in this document.

## Background

The Ripple protocol provides a ledger shared across all nodes in the network.  Through a process of consensus and validation, the network agrees on order in which transactions are applied to (or omitted from) the ledger.  <!--See Ripple Ledger Consensus and Validation[b] for an overview of this process.-->

Well-formed transactions submitted to trusted Ripple network nodes are usually validated or rejected in a matter of seconds.  There are cases, however, in which a well-formed transaction is neither validated nor rejected this quickly. One specific case can occur if the global [transaction fee](transactions.html#transaction-fees) increases after an application sends a transaction.  If the fee increases above what has been specified in the transaction, the transaction will not be included in the next validated ledger. If at some later date the global base fee decreases, the transaction may become viable again. If the transaction does not include expiration, there is no limit to how much later this can occur.

Applications face additional challenges, in the event of power or network loss, ascertaining the status of submitted transactions. Applications must take care both to properly submit a transaction and later to properly ascertain its authoritative results.




### Transaction Timeline

Ripple provides several APIs for submitting transactions ([rippled](rippled-apis.html), ripple-lib, [Ripple-REST](ripple-rest.html)).  Regardless of the API used, the transaction is applied to the ledger as follows.

1. A transaction is created and signed by account owner.
2. That transaction is submitted to the network as a candidate transaction.
   - Malformed or nonsensical transactions are rejected immediately.
   - Well formed transactions may provisionally succeed, then later fail.
   - Well formed transactions may provisionally fail, then later succeed.
3. Through consensus and validation, the transaction is applied to the ledger. Even some failed transactions are applied in order to claim a fee for being propagated through the network.
4. The validated ledger includes the transaction, and its effects are reflected in the ledger state.
   - Transaction results are no longer provisional, success or failure is now final and immutable.

*Note:* When submitting a transaction via rippled or ripple-lib, a successful status code returned from a submit command indicates the rippled server has received the candidate transaction, and does not indicate the transaction will be finally applied to the ledger.

Ripple APIs may return provisional results based on candidate transactions. Applications must not confuse these with the final, *immutable*, results of a transaction.  Immutable results are found only in validated ledgers.  Applications may need to query the status of a transaction repeatedly, until the ledger containing the transaction results is validated.

While applying transactions, Ripple network nodes work with the *last validated ledger*, a snapshot of the ledger state based on transactions the entire network has validated.  The process of consensus and validation apply a set of new transactions to the last validated ledger, resulting in a new validated ledger.  This new validated ledger instance and the ones that preceded it comprise the ledger history.  Each of these validated ledger instances has a sequence number, which is one greater than the sequence number of the preceding instance.




### LastLedgerSequence

[`LastLedgerSequence`](transactions.html#lastledgersequence) is an optional parameter of all transactions.  This instructs the Ripple network that a transaction must be validated on or before a specific ledger instance.  The transaction will never be included in a ledger instance with a higher sequence number.

Use the `LastLedgerSequence` parameter to prevent undesirable cases where a transaction is not promptly validated yet could become viable at some point in the future. Gateways and other back-end applications should specify the `LastLedgerSequence` parameter on every transaction. Automated processes should use a value of 4 greater than the sequence number of the last validated ledger[1] to ensure that a transaction is validated or rejected in a predictable and timely fashion.

Applications using rippled APIs should explicitly specify a `LastLedgerSequence` when submitting transactions.  When using ripple-lib or Ripple-REST, a `LastLedgerSequence` is automatically included.  Applications using those APIs are recommended to use the `LastLedgerSequence` calculated by the API.



## Best Practices


### Reliable Transactions Submission

Applications submitting transactions should employ the following practices in order to submit reliably even in the event that a process dies or other failure occurs.  Application transaction results must be verified so that applications can act on the final, validated results.

Submission and verification are two separate procedures which may be implemented using the logic described in this document.

1. Submission - The transaction is submitted to the network and a provisional result is returned.
2. Verification - The authoritative result is determined by examining validated ledgers.


### Submission

[Persist](https://en.wikipedia.org/wiki/Persistence_(computer_science%29) details of the transaction prior to submission, in case of power failure or network failure before submission completes.  On restart, the persisted values make it possible to verify the status of the transaction.

The submission process:

1. Construct and sign the transaction
   - Include `LastLedgerSequence` parameter
2. Persist the transaction details, saving:
   - Transaction hash
   - `LastLedgerSequence`
   - Account ID and sequence number
   - Application-specific data, as needed
3. Submit the transaction



### Verification

During normal operation, applications may check the status of submitted transactions by their hashes; or, depending on the API used, receive notifications when transactions have been validated (or failed).  This normal operation may be interrupted, for example by network failures or power failures.  In case of such interruption applications need to reliably verify the status of transactions which may or may not have been submitted to the network prior to the interruption.

On restart, or the determination of a new last validated ledger (pseudocode):

```
For each persisted transaction without validated result:
    Query transaction by hash
    If (result appears in validated ledger)
		Persist the final result
		If (result code is tesSUCCESS)
			Application may act based on successful transaction
		Else
			Application may act based on failure
			Maybe resubmit with new LastLedgerSequence and Fee
	Else if (LastLedgerSequence > newest validated ledger)
        Wait for more ledgers to be validated
	Else
		If (server has contiguous ledger history up to and
	        including the ledger identified by LastLedgerSequence)
			The transaction failed
			Submit a new transaction, if appropriate for application
		Else
			Repeat submission of original transaction
```



## Technical Application

In order to implement the transaction submission and verification best practices, applications need to perform the following actions.

* Determine the signing account's next sequence number
  * Each transaction has an account-specific sequence number.  This guarantees the order in which transactions signed by an account are executed and makes it safe to resubmit a transaction without danger of the transaction being applied to the ledger more than once.
* Decide on a `LastLedgerSequence`
   * A transaction's `LastLedgerSequence` is calculated from the last validated ledger sequence number.
* Construct and sign the transaction
  * The details of a signed transaction are persisted before submission.
* Submit the transaction
  * Initial results are provisional and subject to change.
* Determine the final result of a transaction
  * Final results are an immutable part of the ledger history.

An application's means of performing these actions depends on the ripple API the application uses.  These interfaces may be any of:

1. [rippled](rippled-apis.html)
2. [ripple-rest](ripple-rest.html)
3. [ripple-lib](https://github.com/ripple/ripple-lib/)


### rippled - Submitting and Verifying Transactions

#### Determine the Account Sequence

rippled provides the [account_info](rippled-apis.html#account-info) method to learn an account's sequence number in the last validated ledger.

Request:

```
{
  "method": "account_info",
  "params": [
    {
      "account": "rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W",
      "ledger": "validated"
    }
  ]
}
```

Response:

```
{
    "result": {
        "validated": true,
        "status": "success",
        "ledger_index": 10266396,
        "account_data": {
            "index": "96AB97A1BBC37F4F8A22CE28109E0D39D709689BDF412FE8EDAFB57A55E37F38",
            "Sequence": 4,
            "PreviousTxnLgrSeq": 9905632,
            "PreviousTxnID": "CAEE0E34B3DB50A7A0CA486E3A236513531DE9E52EAC47CE4C26332CC847DE26",
            "OwnerCount": 2,
            "LedgerEntryType": "AccountRoot",
            "Flags": 0,
            "Balance": "49975988",
            "Account": "rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W"
        }
    }
}
```

In this example, the account's sequence is **4** (note `"Sequence": 4`, in `"account_data"`) as of the last validated ledger (note `"ledger": "validated"` in the request, and `"validated": "true"` in the response).

If an application were to submit three transactions signed by this account, they would use sequence numbers 4, 5, and 6.  An application should keep a running account sequence number in order to submit multiple transactions without waiting for validation of each one.


#### Determine the Last Validated Ledger

`rippled` provides the [server_state](rippled-apis.html#server-state) command which returns the ledger sequence number of the last validated ledger.

Request:

```
{
  "id": "client id 1",
  "method": "server_state"
}
```

Response:

```
{
    "result": {
        "status": "success",
        "state": {
            "validation_quorum": 3,
            "validated_ledger": {
                "seq": 10268596,
                "reserve_inc": 5000000,
                "reserve_base": 20000000,
                "hash": "0E0901DA980251B8A4CCA17AB4CA6C3168FE83FA1D3F781AFC5B9B097FD209EF",
                "close_time": 470798600,
                "base_fee": 10
            },
            "server_state": "full",
            "published_ledger": 10268596,
            "pubkey_node": "n9LGg37Ya2SS9TdJ4XEuictrJmHaicdgTKiPJYi8QRSdvQd3xMnK",
            "peers": 58,
            "load_factor": 256000,
            "load_base": 256,
            "last_close": {
                "proposers": 5,
                "converge_time": 3004
            },
            "io_latency_ms": 2,
            "fetch_pack": 10121,
            "complete_ledgers": "10256331-10256382,10256412-10268596",
            "build_version": "0.26.4-sp3-private"
        }
    }
}
```

In this example the last validated ledger sequence number is 10268596 (found under `result.state.validated_ledger` in the response).  Note also this example indicates a gap in ledger history.  The server used here would not be able to provide information about the transactions applied during that gap (ledgers 10256383 through 10256411).  If configured to do so, the server will eventually retrieve that portion of the ledger history.


#### Construct the Transaction

`rippled` provides the [RPC sign](rippled-apis.html#sign) to prepare a transaction for submission.  This method requires an account secret, which should only be passed to trusted rippled instances.  This example issues 10 FOO (a made-up currency) from a gateway to another ripple account.

Request:

```
{
    "method": "sign",
    "params": [
        {
            "offline": true,
            "secret": "sssssssssssssssssssssssssssss",
            "tx_json": {
               "Account": "rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W",
                "Sequence": 4,
                "LastLedgerSequence": 10268600,
                "Fee": 10000,
                "Amount": {
                    "currency": "FOO",
                    "issuer": "rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W",
                    "value": "10"
                },
                "Destination": "rawz2WQ8i9FdTHp4KSNpBdyxgFqNpKe8fM",
                "TransactionType": "Payment"
            }
        }
    ]
}
```

Notice the application specifies the account sequence `"Sequence": 4`, learned from an earlier call to `account_info`, to avoid `tefPAST_SEQ` errors.

Notice also the `LastLedgerSequence` based on the last validated ledger our application learned from `server_state`.  The recommendation for backend applications is to use *(last validated ledger sequence + 4)*. Alternately, use a value of *(current ledger + 3)*.  If `LastLedgerSequence` is miscalculated and less than the last validated ledger, the transaction will fail with `tefMAX_LEDGER` error.

Response:

```
{
    "result": {
        "tx_json": {
            "hash": "395C313F6F11F70FEBAF3785529A6D6DE3F44C7AF679515A7EAE22B30146DE57",
            "TxnSignature": "304402202646962A21EC0516FCE62DC9280F79E7265778C571E9410D795E67BB72A2D8E402202FF4AF7B2E2160F5BCA93011CB548014626CAC7FCBEBDB81FE8193CEFF69C753",
            "TransactionType": "Payment",
            "SigningPubKey": "0267268EE0DDDEE6A862C9FF9DDAF898CF17060A673AF771B565AA2F4AE24E3FC5",
            "Sequence": 4,
            "LastLedgerSequence": 10268600,
            "Flags": 2147483648,
            "Fee": "10000",
            "Destination": "rawz2WQ8i9FdTHp4KSNpBdyxgFqNpKe8fM",
            "Amount": {
                "value": "10",
                "issuer": "rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W",
                "currency": "FOO"
            },
            "Account": "rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W"
        },
        "tx_blob": "12000022800000002400000004201B009CAFB861D4C38D7EA4C68000000000000000000000000000464F4F0000000000AC5FA3BB28A09BD2EC1AE0EED2315060E83D796A68400000000000271073210267268EE0DDDEE6A862C9FF9DDAF898CF17060A673AF771B565AA2F4AE24E3FC57446304402202646962A21EC0516FCE62DC9280F79E7265778C571E9410D795E67BB72A2D8E402202FF4AF7B2E2160F5BCA93011CB548014626CAC7FCBEBDB81FE8193CEFF69C7538114AC5FA3BB28A09BD2EC1AE0EED2315060E83D796A831438BC6F9F5A6F6C4E474DB0D59892E90C2C7CED5C",
        "status": "success"
    }
}
```

Applications should persist the transaction's hash before submitting.  The result of the `sign` method includes the hash under `tx_json`.



#### Submit the transaction

`rippled` provides the [`submit` method](rippled-apis.html#submit), allowing us to submit the signed transaction.  The `tx_blob` parameter was returned from the `sign` method.

Request:

```
{
    "method": "submit",
    "params": [
        {
        "tx_blob": "12000022800000002400000004201B009CAFB861D4C38D7EA4C68000000000000000000000000000464F4F0000000000AC5FA3BB28A09BD2EC1AE0EED2315060E83D796A68400000000000271073210267268EE0DDDEE6A862C9FF9DDAF898CF17060A673AF771B565AA2F4AE24E3FC57446304402202646962A21EC0516FCE62DC9280F79E7265778C571E9410D795E67BB72A2D8E402202FF4AF7B2E2160F5BCA93011CB548014626CAC7FCBEBDB81FE8193CEFF69C7538114AC5FA3BB28A09BD2EC1AE0EED2315060E83D796A831438BC6F9F5A6F6C4E474DB0D59892E90C2C7CED5C"
        }
    ]
}
```

Response:

```
{
    "result": {
        "tx_json": {
            "hash": "395C313F6F11F70FEBAF3785529A6D6DE3F44C7AF679515A7EAE22B30146DE57",
            "TxnSignature": "304402202646962A21EC0516FCE62DC9280F79E7265778C571E9410D795E67BB72A2D8E402202FF4AF7B2E2160F5BCA93011CB548014626CAC7FCBEBDB81FE8193CEFF69C753",
            "TransactionType": "Payment",
            "SigningPubKey": "0267268EE0DDDEE6A862C9FF9DDAF898CF17060A673AF771B565AA2F4AE24E3FC5",
            "Sequence": 4,
            "LastLedgerSequence": 10268600,
            "Flags": 2147483648,
            "Fee": "10000",
            "Destination": "rawz2WQ8i9FdTHp4KSNpBdyxgFqNpKe8fM",
            "Amount": {
                "value": "10",
                "issuer": "rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W",
                "currency": "FOO"
            },
            "Account": "rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W"
        },
        "tx_blob": "12000022800000002400000004201B009CAFB861D4C38D7EA4C68000000000000000000000000000464F4F0000000000AC5FA3BB28A09BD2EC1AE0EED2315060E83D796A68400000000000271073210267268EE0DDDEE6A862C9FF9DDAF898CF17060A673AF771B565AA2F4AE24E3FC57446304402202646962A21EC0516FCE62DC9280F79E7265778C571E9410D795E67BB72A2D8E402202FF4AF7B2E2160F5BCA93011CB548014626CAC7FCBEBDB81FE8193CEFF69C7538114AC5FA3BB28A09BD2EC1AE0EED2315060E83D796A831438BC6F9F5A6F6C4E474DB0D59892E90C2C7CED5C",
        "status": "success",
        "engine_result_message": "The transaction was applied.",
        "engine_result_code": 0,
        "engine_result": "tesSUCCESS"
    }
}
```

This a **preliminary** result.  Final results are only available from validated ledgers.  The lack of a `"validated": true` field indicates that this is **not an immutable result**.


#### Verify the Transaction

The transaction hash, generated when the transaction was signed, is passed to the [`tx` method](rippled-apis.html#tx) to retrieve the result of a transaction.

Request:

```
{
    "method": "tx",
    "params": [
        {
            "transaction": "395C313F6F11F70FEBAF3785529A6D6DE3F44C7AF679515A7EAE22B30146DE57",
            "binary": false
        }
    ]
}
```

Response:

```
{
    "result": {
        "validated": true,
        "status": "success",
        "meta": {
            "TransactionResult": "tesSUCCESS",
            "TransactionIndex": 2,
            "AffectedNodes": [...]
        },
        "ledger_index": 10268599[d],
        "inLedger": 10268599,
        "hash": "395C313F6F11F70FEBAF3785529A6D6DE3F44C7AF679515A7EAE22B30146DE57",
        "date": 470798270,
        "TxnSignature": "304402202646962A21EC0516FCE62DC9280F79E7265778C571E9410D795E67BB72A2D8E402202FF4AF7B2E2160F5BCA93011CB548014626CAC7FCBEBDB81FE8193CEFF69C753",
        "TransactionType": "Payment",
        "SigningPubKey": "0267268EE0DDDEE6A862C9FF9DDAF898CF17060A673AF771B565AA2F4AE24E3FC5",
        "Sequence": 4,
        "LastLedgerSequence": 10268600,
        "Flags": 2147483648,
        "Fee": "10000",
        "Destination": "rawz2WQ8i9FdTHp4KSNpBdyxgFqNpKe8fM",
        "Amount": {
            "value": "10",
            "issuer": "rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W",
            "currency": "FOO"
        },
        "Account": "rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W"
    }
}
```

This example response shows `"validated": true`, indicating the transaction has been included in a validated ledger and therefore the result of the transaction is immutable.  Further, the metadata includes `"TransactionResult": "tesSUCCESS"`, indicating the transaction was applied to the ledger.

If the response does not include `"validated": true`, the result is provisional and subject to change.  To retrieve a final result, applications must invoke the `tx` method again, allowing enough time for the network to validate subsequent ledger instances.  It may be necessary to wait for the ledger specified in `LastLedgerSequence` to be validated, although if the transaction is included in an earlier validated ledger the result become immutable at that time.


#### Verify Missing Transaction

Applications must handle cases where a call to the [`tx` method](rippled-apis.html#tx) returns a `txnNotFound` error.

```
{
    "result": {
        "status": "error",
        "request": {
            "transaction": "395C313F6F11F70FEBAF3785529A6D6DE3F44C7AF679515A7EAE22B30146DE56",
            "command": "tx",
            "binary": false
        },
        "error_message": "Transaction not found.",
        "error_code": 24,
        "error": "txnNotFound"
    }
}
```

The `txnNotFound` result code occurs in cases where the transaction has failed to be included in any ledger.  However, it could also occur when a rippled instance does not have a complete ledger history, or if the transaction has not yet propagated to the rippled instance.  Applications should make further queries to determine how to react.

The [`server_state` method](rippled-apis.html#server-state) (used earlier to determine the last validated ledger) indicates how complete the ledger history is, under `result.state.complete_ledgers`.

```
{
    "result": {
        "status": "success",
        "state": {
            "validation_quorum": 3,
            "validated_ledger": {
                "seq": 10269447,
                "reserve_inc": 5000000,
                "reserve_base": 20000000,
                "hash": "D05C7ECC66DD6F4FEA3A6394F209EB5D6824A76C16438F562A1749CCCE7EAFC2",
                "close_time": 470802340,
                "base_fee": 10
            },
            "server_state": "full",
            "pubkey_node": "n9LJ5eCNjeUXQpNXHCcLv9PQ8LMFYy4W8R1BdVNcpjc1oDwe6XZF",
            "peers": 84,
            "load_factor": 256000,
            "load_base": 256,
            "last_close": {
                "proposers": 5,
                "converge_time": 2002
            },
            "io_latency_ms": 1,
            "complete_ledgers": "10256331-10256382,10256412-10269447",
            "build_version": "0.26.4-sp3-private"
        }
    }
}
```

Our example transaction specified `LastLedgerSequence` 10268600, based on the last validated ledger at the time, plus four.  So to determine whether our missing transaction has permanently failed, our rippled server must have ledgers 10268597 through 10268600.  If the server has those validated ledgers in its history, **and** `tx` returns `txnNotFound`, then the transaction has failed and will never be included in any ledger.  in this case, application logic may dictate building and submitting a replacement transaction with the same account sequence and updated `LastLedgerSequence`.

The server state may indicate a last validated ledger sequence number less than the specified `LastLedgerSequence`.  If so, the `txnNotFound` indicates either (a) the submitted transaction failed to be distributed to the network, or (b) the transaction has been distributed to the network but has not yet been processed.  To handle the former case, applications may submit again the same signed transaction.  Because the transaction has a unique account sequence number, it will be processed at most once.

Finally the server state might indicate one or more gaps in the transaction history. The `completed_ledgers` field shown in the response above indicates that ledgers 10256383 through 10256411 are missing from this rippled instance.  Our example transaction can only appear in ledgers 10268597 - 10268600 (based on when it was submitted and `LastLedgerSequence`), so the gap shown here is not relevant.  However, if the gap indicated a ledger in that range was missing, then an application would need to query another rippled server (or wait for this one to retrieve the missing ledgers) in order to determine that a `txnNotFound` result is immutable.


### Ripple-REST - Submitting and Verifying Payments


The [Ripple-REST API](ripple-rest.html) provides an interface to Ripple via a [RESTful API](https://en.wikipedia.org/wiki/Representational_state_transfer).  It provides robust payment submission features, which include referencing payments by client provided identifiers, re-submitting payments in response to some errors, and automatically calculating transaction parameters such as account sequence, `LastLedgerSequence`, and fee.

This examples that follow refer to Ripple-REST API for *payments*.  The REST methods for setting trust lines and modifying account settings does not follow the same pattern.  See [RLJS-126](https://ripplelabs.atlassian.net/browse/RLJS-126) for additional details.


#### Construct the Transaction

In Ripple-REST, a GET request retrieves the path options for a payment.  The following example issues 10 FOO (a made-up currency) from one account to another.

```
GET /v1/accounts/rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W/payments/paths/rawz2WQ8i9FdTHp4KSNpBdyxgFqNpKe8fM/10+FOO+rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W
```

The response (below) indicates one payment path exists.  (The `payments[0].paths` is present, and empty, when issuing currency directly.)

```
{
    "payments": [
        {
            "no_direct_ripple": false,
            "partial_payment": false,
            "paths": "[]",
            "invoice_id": "",
            "destination_amount": {
                "issuer": "rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W",
                "currency": "FOO",
                "value": "10"
            },
            "destination_tag": "",
            "destination_account": "rawz2WQ8i9FdTHp4KSNpBdyxgFqNpKe8fM",
            "source_slippage": "0",
            "source_amount": {
                "issuer": "rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W",
                "currency": "FOO",
                "value": "10"
            },
            "source_tag": "",
            "source_account": "rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W"
        }
    ],
    "success": true
}
```



#### Submit the Payment Transaction

Applications should persist a record of a transaction before submitting it, in order to recover from a catastrophic failure such as a power outage.  Ripple-REST accepts a `client_resource_id` which allows an application to look up a transaction.  For this example, let's say the application saves the details of the transaction to its payments table with ID 42, so the application creates `client_resource_id` "payment-42".

Before submitting, applications should persist the `client_resource_id`, transaction type, and source account.

Request:

```
POST /v1/accounts/:usGate/payments
Content-Type: application/json

{
    "secret": "sssssssssssssssssssssss",
    "client_resource_id": "payment-42",
    "max_fee": ".1",
    "payment": {
        "no_direct_ripple": false,
        "partial_payment": false,
        "paths": "[]",
        "invoice_id": "",
        "destination_amount": {
            "issuer": "rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W",
            "currency": "FOO",
            "value": "10"
        },
        "destination_tag": "",
        "destination_account": "rawz2WQ8i9FdTHp4KSNpBdyxgFqNpKe8fM",
        "source_slippage": "0",
        "source_amount": {
            "issuer": "rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W",
            "currency": "FOO",
            "value": "10"
        },
        "source_tag": "",
        "source_account": "rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W"
    }
}
```

***Note: only submit your account secret to a trusted Ripple-REST server.***

Response:

```
{
  success: true,
  client_resource_id: 'payment-42',
  status_url: 'http://127.0.0.1:5990/v1/accounts/rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W/payments/payment-42' }
```

The payment result remains provisional at this point.  Ripple-REST returns a `status_url` where we can eventually learn the final result of the transaction.  The `status_url` is based on the `client_resource_id` persisted by the application before submission, so the application can construct the `status_url` even in the event of a power failure before this response is received.


#### Verify the Payment Transaction

A GET request to the transaction's `status_url` retrieves the result.

Request:

```
GET /v1/accounts/rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W/payments/payment-42
```

Response:

```
{
    "payment": {
        "destination_balance_changes": [
            {
                "issuer": "rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W",
                "currency": "FOO",
                "value": "10"
            }
        ],
        "source_balance_changes": [
            {
                "issuer": "",
                "currency": "XRP",
                "value": "-0.012"
            },
            {
                "issuer": "rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W",
                "currency": "FOO",
                "value": "-10"
            }
        ],
        "fee": "0.012",
        "timestamp": "2014-12-02T23:10:10.000Z",
        "hash": "DDF9F6E4DC64A1CB056570170FC06B2CBC2701CB500E44AC730BF8C868F6AA15",
        "ledger": "10286112",
        "result": "tesSUCCESS",
        "state": "validated",
        "direction": "outgoing",
        "partial_payment": false,
        "no_direct_ripple": false,
        "paths": "[]",
        "invoice_id": "",
        "destination_amount": {
            "value": "10",
            "issuer": "rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W",
            "currency": "FOO"
        },
        "destination_tag": "",
        "destination_account": "rawz2WQ8i9FdTHp4KSNpBdyxgFqNpKe8fM",
        "source_slippage": "0",
        "source_amount": {
            "value": "10",
            "issuer": "rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W",
            "currency": "FOO"
        },
        "source_tag": "",
        "source_account": "rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W"
    },
    "success": true
}
```

In this example, `payment.state: "validated"` indicates the transaction is in a validated ledger.  Therefore the results are final and immutable.  Any other value for `payment.state` indicates provisional results, an application must check again later to determine final results.

In the preceeding example, `payment.result: "tesSUCCESS"` (along with the `"validated"` state) indicates the payment has been delivered.  Any other result code indicates the transaction did not succeed, and application logic may dictate constructing and submitting a new transaction to perform the desired operation.


#### Verify Missing or Failed Payment Transaction

When a GET request to the transaction's `status_url` returns an error, an application must determine whether the final result of a transaction is failure.

Request:

```
GET /v1/accounts/rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W/payments/payment-42
```

Response:

```
{
    "message": "Transaction not found.",
    "error": "txnNotFound",
    "error_type": "transaction",
    "success": false
}
```

*Note:* The `txnNotFound` error shown above is the current behavior of ripple-REST, but will change in order to make it easier to determine the status of transactions in this case.  Follow [RLJS-163](https://ripplelabs.atlassian.net/browse/RLJS-163) for updates regarding this behavior.

The `txnNotFound` error in this example indicates the transaction was received by Ripple-REST, but has failed to appear in a validated ledger.  This could be caused certain transaction errors, or possibly because Ripple-REST lost power or network before submitting the transaction to the network.  Application logic may dictate constructing and submitting a replacement transaction.

Another error response:

```
{
    "message": "A transaction hash was not supplied and there were no entries matching the client_resource_id.",
    "error": "Transaction not found",
    "error_type": "invalid_request",
    "success": false
}
```

This `"Transaction not found"` error indicates the transaction was not received by Ripple-REST, and therefore never sent to the network.  Again, application logic may dictate constructing and submitting a replacement transaction.




### ripple-lib - Submitting and Verifying Transactions

[ripple-lib](https://github.com/ripple/ripple-lib) provides a Javascript API for Ripple in Node.js and web browsers.  It provides features for robust transaction submission which including automatically calculating account sequence numbers and `LastLedgerSequence`.


#### Construct the Transaction

ripple-lib provides a high level API for creating transactions.  In this example, a payment:

    var tx = remote.createTransaction('Payment', {
      account: ‘rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W',
      destination: ‘rawz2WQ8i9FdTHp4KSNpBdyxgFqNpKe8fM',
      amount: ‘10/FOO/rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W'
    });

Note that ripple-lib will automatically provide additional details before the transaction is signed and submitted.  These details include an account transaction Sequence, `LastLedgerSequence` and Fee.

Before submitting, applications should persist the transaction details, so that status may be verified in the event of a failure.  Applications have an opportunity to do this by implementing [transaction event handlers](https://github.com/ripple/ripple-lib/blob/develop/docs/REFERENCE.md#transaction-events).  The `presubmit` event handler is appropriate for saving data before a transaction is submitted to the network.  During normal operation, a `state` event is emitted whenever the transaction status changes, including final validation.

The example implementation (below) of a these event handlers simply logs some information about the transaction, in order to show some of the data available to applications.  Live applications should implement handlers to **synchronously** persist transactions details, and should throw an error if unable to save the data.

    // The 'presubmit' handler receives events before the transaction
    // is submitted to the network; also before re-submit attempts.
    tx.on('presubmit', function(data) {
      console.log('- Presubmit Event Handler -');
      // Log information about the transaction.
      console.log(this.summary());

      // Applications should persist transaction data syncronously,
      // before returning from this event handler.

    });

    // The 'state' handler receives events after any state change, including...
    tx.on('state', function(state) {
      console.log('- State Event Hander: ' + state + ' -');
      // Log information about the transaction.
      console.log(this.summary());

      // Applications should persist updated transaction state.
    });




#### Submit the Transaction

ripple-lib provides `Transaction.submit()` to both sign and submit a transaction.  In order to sign, an application must first call `Remote.setSecret(<account>, <secret>)`.  Take care to configure ripple-lib to use local signing, as secrets should only be shared with trusted ripple servers.

    tx.submit(function(err, res) {
      if (err) {
        console.log('- Transaction Submit Callback Error -');
        console.log(err);
      }
      else {
        console.log('- Transaction Submit Callback -');
        console.log(util.inspect(res));
      }
    });

ripple-lib emits events as it processes the transaction.  The presubmit event allows application to persist the transaction hash and other details before it is sent to the network.

```
- Presubmit Event Handler -
{ tx_json:
   { Flags: 2147483648,
     TransactionType: 'Payment',
     Account: 'rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W',
     Amount:
      { value: '10',
        currency: 'FOO',
        issuer: 'rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W' },
     Destination: 'rawz2WQ8i9FdTHp4KSNpBdyxgFqNpKe8fM',
     Fee: '10000',
     Sequence: 11,
     SigningPubKey: '0267268EE0DDDEE6A862C9FF9DDAF898CF17060A673AF771B565AA2F4AE24E3FC5',
     LastLedgerSequence: 10320276,
     TxnSignature: '3045022100A61FA3AF1569BC4B1D2161F0055CF9760F8AC473ED374A98FE7E77099B8C63AD02200FF2A59CE4722FC246652125D3A13928392E7D0C5AC073314A573E93BF594856' },
  clientID: undefined,
  submittedIDs: [ '2120732F77002A9138DE110408EA06C2064F032BC9D44A28C46267C607594203' ],
  submissionAttempts: 0,
  submitIndex: 10320268,
  initialSubmitIndex: 10320268,
  lastLedgerSequence: 10320276,
  state: 'unsubmitted',
  server: undefined,
  finalized: false }
```

Note in the preceeding example log output, `tx.state: 'unsubmitted'` indicates the transaction is not yet sent to the network.  `tx.submittedIDs` includes the transaction hash, a unique identifier that applications should persist in order to later verify the status of the transaction.  ripple-lib has automatically calculated `tx.tx_json.Sequence` and `tx.tx_json.LastLedgerSequence`.

ripple-lib will re-submit a transaction in response to certain errors.  Prior to each submission the `presubmit` event provides up-to-date information about the transaction, which applications should persist.

```
- Presubmit Event Handler -
{ tx_json:
   { Flags: 2147483648,
     TransactionType: 'Payment',
     Account: 'rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W',
     Amount:
      { value: '10',
        currency: 'FOO',
        issuer: 'rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W' },
     Destination: 'rawz2WQ8i9FdTHp4KSNpBdyxgFqNpKe8fM',
     Fee: '10000',
     Sequence: 11,
     SigningPubKey: '0267268EE0DDDEE6A862C9FF9DDAF898CF17060A673AF771B565AA2F4AE24E3FC5',
     LastLedgerSequence: 10320278,
     TxnSignature: '3045022100D5AC197A9EB35E86B70B4A02C19EC0120C1D6A539B1FE58C364322067E040AE102205EFE429FF40FAFAAAC58B653DCD25642D8A50E222C2D244105F43CEBAAC7DC89' },
  clientID: undefined,
  submittedIDs:
   [ 'AD070F312DE0EB8AB64DDA0C512A4A1E9ED1ACE0AEFBBE6AA1418A2D6F137D13',
     '2120732F77002A9138DE110408EA06C2064F032BC9D44A28C46267C607594203' ],
  submissionAttempts: 1,
  submitIndex: 10320270,
  initialSubmitIndex: 10320268,
  lastLedgerSequence: 10320278,
  state: 'submitted',
  server: undefined,
  finalized: false,
  result:
   { engine_result: 'telINSUF_FEE_P',
     engine_result_message: 'Fee insufficient.',
     ledger_hash: undefined,
     ledger_index: undefined,
     transaction_hash: '2120732F77002A9138DE110408EA06C2064F032BC9D44A28C46267C607594203' } }
```


The example above shows the transaction after 1 failed attempts, before a second attempt is  submitted.  Note that `tx.submittedIDs[0]` is the updated hash which applications should persist.

The `tx.result` is the **provisional** result of the **prior** submission attempt.  In this example the initial submit failed with `telINSUF_FEE_P`, which could happen if the network adjusts the fee calculated by ripple-lib immediately before the transaction is processed.




#### Verify the Transaction

During normal operation, events emitted by ripple-lib inform an application of the result of a transaction.  The `state` event will emit with `tx.state: 'pending'` with a provisional result; and finally if successful with `tx.state: 'validated'` and `tx.finalized: true`.

```
- State Event Hander: validated -
{ tx_json:
   { Flags: 2147483648,
     TransactionType: 'Payment',
     Account: 'rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W',
     Amount:
      { value: '10',
        currency: 'FOO',
        issuer: 'rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W' },
     Destination: 'rawz2WQ8i9FdTHp4KSNpBdyxgFqNpKe8fM',
     Sequence: 11,
     SigningPubKey: '0267268EE0DDDEE6A862C9FF9DDAF898CF17060A673AF771B565AA2F4AE24E3FC5',
     Fee: '12000',
     LastLedgerSequence: 10320625,
     TxnSignature: '3045022100DEFA085B88834F3C27200714AB40F3A67E7E86E726DE630A2955843F6D53010D02202592D709D5F90F9E852CEFB0D5A7F6D39AC0A99BC97A3589BF9FA47018C2CB2C' },
  clientID: undefined,
  submittedIDs: [ '0E066642EC28DA3C9840202AF4F3CD281A5A2733F2D9BEF38C69DFDC14407E12' ],
  submissionAttempts: 1,
  submitIndex: 10320617,
  initialSubmitIndex: 10320617,
  lastLedgerSequence: 10320625,
  state: 'validated',
  server: undefined,
  finalized: true,
  result:
   { engine_result: 'tesSUCCESS',
     engine_result_message: 'The transaction was applied.',
     ledger_hash: '7F936E0F37611982A434B76270C819FDA8240649D7592BDC995FC9AEE2D436AA',
     ledger_index: 10320618,
     transaction_hash: '0E066642EC28DA3C9840202AF4F3CD281A5A2733F2D9BEF38C69DFDC14407E12' } }
```

If the final state of a transaction is an error, the state event indicates `tx.state: 'failed'` and `tx.finalized: 'true'`:

```
- State Event Hander: failed -
{ tx_json:
   { Flags: 2147483648,
     TransactionType: 'Payment',
     Account: 'rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W',
     Amount:
      { value: '10',
        currency: 'FOO',
        issuer: 'rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W' },
     Destination: 'rawz2WQ8i9FdTHp4KSNpBdyxgFqNpKe8fM',
     Fee: '10000',
     Sequence: 11,
     SigningPubKey: '0267268EE0DDDEE6A862C9FF9DDAF898CF17060A673AF771B565AA2F4AE24E3FC5',
     LastLedgerSequence: 10320296,
     TxnSignature: '304402201E3D376CF7C1C99EAC19027EA3EDE15F24D8FA59D4EA90067A09267F8D927ABB0220084B8BFF7D9308CD00A5DA265776DC9BAB9F553A9E6A4ED1A75DD76DCB3B40A9' },
  clientID: undefined,
  submittedIDs:
   [ '895DA495779D51F84E4B79258AAF9A8E51404A79747DD936EE6468FE9A974AEE',
     'F14AE631317D11184DEC7066814539E9BB50AB46DF770E3F2367430810C0AE7C',
     '80F7460AD3F8172F9CDD69B638E4EA7ED9466A4D495EF8530FE98B8A0909E897',
     '23F59C223701D73C2477963E4D1FA3460DAD5A64D813FB9591AF45C4C68A339B',
     'B929D9018E842A56FFCA8EB295EDA81C62AE37804F759A19E0B1292C888C8586',
     'EC9B4D869B8B9C27F644859F203D54023B01F6C2E9FA12CD34AC8373F9BA67A5',
     '47FD42A6604D74A89E006352FBC656843A270EF46B47A3EB1D1098A31A01BC3D',
     'BD3D13C57A5FDBB9B1F88C287EC158AA92BF9B75078273678F3124C84F504ABA',
     '0B2CC389D5553FB232E4EF45EC67D149B8CD65E17C4BE7A41B5142A0D4A935BD',
     'AD070F312DE0EB8AB64DDA0C512A4A1E9ED1ACE0AEFBBE6AA1418A2D6F137D13',
     '2120732F77002A9138DE110408EA06C2064F032BC9D44A28C46267C607594203' ],
  submissionAttempts: 11,
  submitIndex: 10320288,
  initialSubmitIndex: 10320268,
  lastLedgerSequence: 10320296,
  state: 'failed',
  server: undefined,
  finalized: true,
  result:
   { engine_result: 'telINSUF_FEE_P',
     engine_result_message: 'Fee insufficient.',
     ledger_hash: undefined,
     ledger_index: undefined,
     transaction_hash: '895DA495779D51F84E4B79258AAF9A8E51404A79747DD936EE6468FE9A974AEE' } }
```


In the event of a power or network failure, an application may be interrupted before these `state` events are emitted.  In these cases, applications should retrieve the status of a transaction by its `hash`, one of the details persisted during an earlier `presubmit` event.

    var hash = 'C3306CA3ED1B372EAC8A84A84B52752A4E4912BB1A26AB883E969BC987E4D20E';
    remote.requestTransaction(hash, function(err, result) {
      if (err) {
        console.log(err);
      }
      else {
        console.log(result);
      }
    });

Result of `remote.requestTransaction(<transaction hash>)`:

```
{ Account: 'rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W',
  Amount:
   { currency: 'FOO',
     issuer: 'rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W',
     value: '10' },
  Destination: 'rawz2WQ8i9FdTHp4KSNpBdyxgFqNpKe8fM',
  Fee: '10000',
  Flags: 2147483648,
  LastLedgerSequence: 10303055,
  Sequence: 10,
  SigningPubKey: '0267268EE0DDDEE6A862C9FF9DDAF898CF17060A673AF771B565AA2F4AE24E3FC5',
  TransactionType: 'Payment',
  TxnSignature: '304402200C65A9FD9EA7000DCD87688BA92C219074858D530E9A75F32EF2DA1A9C07844E02203A72B2688412CF855306E70D9B9ED541B67BEA8A8EDB90D47B7B227B295CED9B',
  date: 470953270,
  hash: 'C3306CA3ED1B372EAC8A84A84B52752A4E4912BB1A26AB883E969BC987E4D20E',
  inLedger: 10303048,
  ledger_index: 10303048,
  meta:
   { AffectedNodes: [ [Object], [Object] ],
     TransactionIndex: 23,
     TransactionResult: 'tesSUCCESS' },
  validated: true }
```

Note the response from `requestTransaction` includes **`validated: true`**, indicating the result is in a validated ledger and is final.  Without `validated: true`, results are *provisional* and may change.  This example shows `meta.TransactionResult: 'tesSUCCESS'`, indicating the transaction was successful.


#### Verify Missing Transaction

`Remote.requestTransaction` may return `txNotFound`:

```
{ [RippleError: Remote reported an error.]
  error: 'remoteError',
  error_message: 'Remote reported an error.',
  remote:
   { error: 'txnNotFound',
     error_code: 24,
     error_message: 'Transaction not found.',
     id: 1,
     request:
      { command: 'tx',
        id: 1,
        transaction: 'F85D840B152328A1A6C11910A6FBF57E1340B6285E3602A1258B7A41EC814119' },
     status: 'error',
     type: 'response' },
  result: 'remoteError',
  engine_result: 'remoteError',
  result_message: 'Remote reported an error.',
  engine_result_message: 'Remote reported an error.',
  message: 'Remote reported an error.' }
```

In these cases an application must distinguish between a provisional result and a final result.  For this, an application needs the transaction's `initialSubmitIndex` and `LastLedgerSequence`.  This information was persisted earlier by the application's `presubmit` event handler.  In this example, `initialSubmitIndex` is 10301323 and `LastLedgerSequence` is 10301337.

A call to `Remote.requestServerInfo()` determines whether the server has final, immutable results about the transaction.

    remote.requestServerInfo(function(err, result) {
      if (err) {
        console.log(err);
      }
      else {
        console.log(result);
      }
    });

Result of `remote.requestServerInfo()`:

```
{ info:
   { build_version: '0.26.4-sp3-private',
     complete_ledgers: '32570-10302948',
     hostid: 'KNOW',
     io_latency_ms: 1,
     last_close: { converge_time_s: 2.001, proposers: 5 },
     load_factor: 1000,
     peers: 44,
     pubkey_node: 'n9MADAXTbCnaBYoUcvDzHkTqoTSjVd8VHgJE2KwMBbwRV4pM3j2a',
     server_state: 'full',
     validated_ledger:
      { age: 4,
        base_fee_xrp: 0.00001,
        hash: '47EE6EC414FC0B648869CE7108143D916DE38DAC167DADEF541F9A8CED475909',
        reserve_base_xrp: 20,
        reserve_inc_xrp: 5,
        seq: 10302948 },
     validation_quorum: 3 } }
```

In this example, `info.complete_ledgers` indicates the server has continuous ledger history up to ledger sequence 10302948.  This history includes the span of ledger where the transaction may appear, from 10301323 to 10301337.  Therefore, the `txNotFound` result is final, and the transaction has failed immutably.

If the ledger history were not complete through the `LastLedgerSequence`, the application must wait for that ledger to become validated, or the server to sync a more complete history with the network.



## Additional Resources

- [Transaction Format](transactions.html)
- [Transaction Fees](transactions.html#transaction-fees)
- Documentation of [`LastLedgerSequence`](transactions.html#lastledgersequence)
- [Overview of Ripple Ledger Consensus Process](http://ripple.com/knowledge_center/the-ripple-ledger-consensus-process/)
- [Reaching Consensus in Ripple](https://ripple.com/knowledge_center/reaching-consensus-in-ripple/)
