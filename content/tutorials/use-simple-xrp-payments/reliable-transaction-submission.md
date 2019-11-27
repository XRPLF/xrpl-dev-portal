# Reliable Transaction Submission

Financial institutions and other services using the XRP Ledger should use the best practices described here to make sure that transactions are validated or rejected in a verifiable and prompt way.  You should submit transactions to trusted (locally operated) `rippled` servers.

The best practices detailed in this document allow applications to submit transactions to the XRP Ledger while achieving:

1. [Idempotency](https://en.wikipedia.org/wiki/Idempotence) - Transactions should be processed once and only once, or not at all.
2. Verifiability - Applications can determine the final result of a transaction.

Applications which fail to implement best practices are at risk of the following errors:

1. Submitting transactions which are inadvertently never executed.
2. Mistaking provisional transaction results for their final, immutable results.
3. Failing to find authoritative results of transactions previously applied to the ledger.

These types of errors can potentially lead to serious problems.  For example, an application that fails to find a prior successful payment transaction might erroneously submit another transaction, duplicating the original payment.  This underscores the importance that applications base their actions on authoritative transaction results, using the techniques described in this document.

## Background

The XRP Ledger protocol provides a ledger shared across all servers in the network.  Through a [process of consensus and validation](consensus.html), the network agrees on the order in which transactions are applied to (or omitted from) the ledger.

Well-formed transactions submitted to trusted XRP Ledger servers are usually validated or rejected in a matter of seconds.  There are cases, however, in which a well-formed transaction is neither validated nor rejected this quickly. One specific case can occur if the global [transaction cost](transaction-cost.html) increases after an application sends a transaction.  If the transaction cost increases above what has been specified in the transaction, the transaction is not included in the next validated ledger. If at some later date the global transaction cost decreases, the transaction could be included in a later ledger. If the transaction does not specify an expiration, there is no limit to how much later this can occur.

If a power or network outage occurs, applications face more challenges finding the status of submitted transactions. Applications must take care both to properly submit a transaction and later to properly get authoritative results.




### Transaction Timeline

The XRP Ledger provides several APIs for submitting transactions, including [`rippled` API](rippled-api.html), and [RippleAPI](rippleapi-reference.html).  Regardless of the API used, the transaction is applied to the ledger as follows.

1. An account owner creates and signs a transaction.
2. The owner submits the transaction to the network as a candidate transaction.
    - Malformed or nonsensical transactions are rejected immediately.
    - Well-formed transactions may provisionally succeed, then later fail.
    - Well-formed transactions may provisionally fail, then later succeed.
    - Well-formed transactions may provisionally succeed, and then later succeed in a slightly different way. (For example, by consuming a different offer and achieving a better or worse exchange rate than the provisional execution.)
3. Through consensus and validation, the transaction is applied to the ledger. Even some failed transactions are applied, to enforce a cost for being propagated through the network.
4. The validated ledger includes the transaction, and its effects are reflected in the ledger state.
    - Transaction results are no longer provisional, success or failure is now final and immutable.

**Note:** When submitting a transaction via `rippled`, a successful status code returned from a submit command indicates the `rippled` server has received the candidate transaction. The transaction may or may not be applied to a validated ledger.

APIs may return provisional results based on the result of applying candidate transactions to the current, in-progress ledger. Applications must not confuse these with the final, *immutable*, results of a transaction.  Immutable results are found only in validated ledgers.  Applications may need to query the status of a transaction repeatedly, until the ledger containing the transaction results is validated.

While applying transactions, `rippled` servers use the *last validated ledger*, a snapshot of the ledger state based on transactions the entire network has validated.  The process of consensus and validation apply a set of new transactions to the last validated ledger in canonical order, resulting in a new validated ledger.  This new validated ledger version and the ones that preceded it form the ledger history.

Each validated ledger version has a ledger index, which is 1 greater than the ledger index of the previous ledger version. Each ledger also has an identifying hash value, which is uniquely determined from its contents. There may be many different versions of in-progress ledgers, which have the same ledger index but different hash values. Only one version can ever be validated.

Each validated ledger has a canonical order in which transactions apply. This order is deterministic based on the final transaction set of the ledger. In contrast, each `rippled` server's in-progress ledger is calculated incrementally, as transactions are received. The order in which transactions execute provisionally is usually not the same as the order in which transactions execute to build a new validated ledger. This is one reason why the provisional outcome of a transaction may be different than the final result. For example, a payment may achieve a different final exchange rate depending on whether it executes before or after another payment that would consume the same offer.



### LastLedgerSequence

`LastLedgerSequence` is an optional [parameter of all transactions](transaction-common-fields.html).  This instructs the XRP Ledger that a transaction must be validated on or before a specific ledger version.  The XRP Ledger never includes a transaction in a ledger version whose ledger index is higher than the transaction's `LastLedgerSequence` parameter.

Use the `LastLedgerSequence` parameter to prevent undesirable cases where a transaction is not confirmed promptly but could be included in a future ledger.  You should specify the `LastLedgerSequence` parameter on every transaction.  Automated processes should use a value of 4 greater than the last validated ledger index to make sure that a transaction is validated or rejected in a predictable and prompt way.

Applications using `rippled` APIs should explicitly specify a `LastLedgerSequence` when submitting transactions.

RippleAPI uses the `maxLedgerVersion` field of [Transaction Instructions](rippleapi-reference.html#transaction-instructions) to specify the `LastLedgerSequence`.  RippleAPI automatically provides an appropriate value by default.  You can specify `maxLedgerVersion` as `null` to intentionally omit `LastLedgerSequence`, in case you want a transaction that can be executed after an unlimited amount of time (this is strongly discouraged).



## Best Practices

The following diagram summarizes the recommended flow for submitting a transaction and determining its outcome:

[![Reliable transaction submission flowchart](img/reliable-tx-submission.svg)](img/reliable-tx-submission.svg)


### Reliable Transactions Submission

Applications submitting transactions should use the following practices to submit reliably even in the event that a process dies or other failure occurs.  Application transaction results must be verified so that applications can act on the final, validated results.

Submission and verification are two separate procedures which may be implemented using the logic described in this document.

1. Submission - The transaction is submitted to the network and a provisional result is returned.
2. Verification - The authoritative result is determined by examining validated ledgers.


### Submission

[Persist](https://en.wikipedia.org/wiki/Persistence_%28computer_science%29) details of the transaction before submission, in case of power failure or network failure before submission completes.  On restart, the persisted values make it possible to verify the status of the transaction.

The submission process:

1. Construct and sign the transaction
    - Include `LastLedgerSequence` parameter
2. Persist the transaction details, saving:
    - Transaction hash
    - `LastLedgerSequence`
    - Sender address and sequence number
    - Latest validated ledger index at the time of submission
    - Application-specific data, as needed
3. Submit the transaction



### Verification

During normal operation, applications may check the status of submitted transactions by their hashes; or, depending on the API used, receive notifications when transactions have been validated (or failed).  This normal operation may be interrupted, for example by network failures or power failures.  In case of such interruption applications need to reliably verify the status of transactions which may or may not have been submitted to the network before the interruption.

On restart, or the determination of a new last validated ledger (pseudocode):

```
For each persisted transaction without validated result:
    Query transaction by hash
    If (result appears in any validated ledger)
        # Outcome is final
        Persist the final result
        If (result code is tesSUCCESS)
            Application may act based on successful transaction
        Else
            The transaction failed (1)
            If appropriate for the application and failure type, submit with
                new LastLedgerSequence and Fee

    Else if (LastLedgerSequence > newest validated ledger)
        # Outcome is not yet final
        Wait for more ledgers to be validated

    Else
        If (server has continuous ledger history from the ledger when the
              transaction was submitted up to and including the ledger
              identified by LastLedgerSequence)

            # Sanity check
            If (sender account sequence > transaction sequence)
                A different transaction with this sequence has a final outcome.
                Manual intervention suggested (3)
            Else
                The transaction failed (2)

        Else
            # Outcome is final, but not known due to a ledger gap
            Wait to acquire continuous ledger history
```

#### Failure Cases

The difference between the two transaction failure cases (labeled (1) and (2) in the pseudo-code) is whether the transaction was included in a validated ledger. In both cases, you should decide carefully how to process the failure.

- In failure case (1), the transaction was included in a ledger and destroyed the [XRP transaction cost](transaction-cost.html), but did nothing else. This could be caused by a lack of liquidity, improperly specified [paths](paths.html), or other circumstances. For many such failures, immediately retrying with a similar transaction is likely to have the same result. You may get different results if you wait for circumstances to change.

- In failure case (2), the transaction was not included in a validated ledger, so it did nothing at all, not even destroy the transaction cost. This could be the result of the transaction cost being too low for the current load on the XRP Ledger, the `LastLedgerSequence` being too soon, or it could be due to other conditions such as an unstable network connection.

    - In contrast to failure case (1), it is more likely that a new transaction is likely to succeed if you change only the `LastLedgerSequence` and possibly the `Fee` and submit again. Use the same `Sequence` number as the original transaction.

    - It is also possible that the transaction could not succeed due to the state of the ledger, for example because the sending address disabled the key pair used to sign the transaction. If the transaction's provisional result was a [`tef`-class code](tef-codes.html), the transaction is less likely to succeed without further modification.

- Failure case (3) represents an unexpected state. When a transaction is not processed, you should check the  `Sequence` number of the sending account in the most recent validated ledger. (You can use the [account_info method][] to do so.) If the account's `Sequence` value in the latest validated ledger is higher than the transaction's `Sequence` value, then a different transaction with the same `Sequence` value has been included in a validated ledger. If your system is not aware of the other transaction, you are in an unexpected state and should stop processing until you have determined why that has happened; otherwise, your system might send multiple transactions to accomplish the same goal. The steps you should take depend on specifically what caused it. Some possibilities include:

    - The previously-sent transaction was [malleable](transaction-malleability.html) and it actually was included in a validated ledger, but with a different hash than you expected. This can happen if you specify a set of flags that do not include the `tfFullyCanonicalSig` flag or if the transaction is multi-signed by more signers than necessary. If this is the case, save the different hash and the final outcome of the transaction, then resume normal activities.

    - You [canceled](cancel-or-skip-a-transaction.html) and replaced the transaction, and the replacement transaction was processed instead. If you are recovering from an outage, it's possible you may have lost record of the replacement transaction. If this is the case, the transaction you were originally looking up has failed permanently, and the final outcome of the replacement transaction is recorded in a validated ledger version. Save both final outcomes, check for any other missing or replaced transactions, then resume normal activities.

    - If you have two or more transaction-sending systems in an active/passive failover configuration, it's possible that the passive system mistakenly believes the active system has failed, and has become active while the original active system is still also sending transactions. Check the connectivity between the systems and ensure that at most one of them is active. Check your account's transaction history (for example, with the [account_tx method][]) and record the final outcome of all transactions that were included in validated ledgers. Any different transactions with the same `Sequence` numbers have failed permanently; save those final outcomes as well. When you have finished reconciling the differences from all the systems and have resolved the issues that made the systems activate simultaneously, resume normal activities.

        **Tip:** The [`AccountTxnID` field](transaction-common-fields.html#accounttxnid) can help prevent redundant transactions from succeeding in this situation.

    - A malicious actor may have used your secret key to send a transaction. If this is the case, [rotate your key pair](change-or-remove-a-regular-key-pair.html) if you can, and check for other transactions sent. You should also audit your network to determine if the secret key was part of a larger intrusion or security leak. When you successfully rotate your key pair and are certain that the malicious actor no longer has access to your accounts and systems, you can resume normal activities.


#### Ledger Gaps

If your server does not have continuous ledger history from when the transaction was originally submitted up to and including the ledger identified by `LastLedgerSequence`, you may not know the final outcome of the transaction. (If it was included in one of the ledger versions your server is missing, you do not know whether it succeeded or failed.)

Your `rippled` server should automatically acquire the missing ledger versions when it has spare resources (CPU/RAM/disk IO) to do so, unless the ledgers are older than its [configured amount of history to store](ledger-history.html). Depending on the size of the gap and the resource usage of your server, acquiring missing ledgers should take a few minutes. You can request your server to acquire historical ledger versions using the [ledger_request method][], but even so you may not be able to look up transaction outcomes from ledger versions that are outside of your server's configured history range.

Alternatively, you can look up the status of the transaction using a different `rippled` server that already has the needed ledger history, such as Ripple's full-history servers at `s2.ripple.com`. Only use a server you trust for this purpose. A malicious server could be programmed to provide false information about the status and outcome of a transaction.


## Technical Application

To implement the transaction submission and verification best practices, applications need to do the following:

1. Determine the signing account's next sequence number
    * Each transaction has an account-specific [sequence number](basic-data-types.html#account-sequence).  This guarantees the order in which transactions signed by an account are executed and makes it safe to resubmit a transaction without danger of the transaction being applied to the ledger more than once.
3. Decide on a `LastLedgerSequence`
     * A transaction's `LastLedgerSequence` is calculated from the last validated ledger index.
3. Construct and sign the transaction
    * Persist the details of a signed transaction before submission.
4. Submit the transaction
    * Initial results are provisional and subject to change.
5. Determine the final result of a transaction
    * Final results are an immutable part of the ledger history.

How the application does these actions depends on the API the application uses.  An application may use any of the following interfaces:

1. The [`rippled` API](rippled-api.html)
2. [RippleAPI](rippleapi-reference.html)
3. Any number of other software APIs layered on top of `rippled`


### rippled - Submitting and Verifying Transactions

#### Determine the Account Sequence

`rippled` provides the [account_info method][] to learn an account's sequence number in the last validated ledger.

JSON-RPC Request:

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

Response body:

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

If an application were to submit three transactions signed by this account, they would use sequence numbers 4, 5, and 6.  To submit multiple transactions without waiting for validation of each, an application should keep a running account sequence number.


#### Determine the Last Validated Ledger

The [server_state method][] returns the ledger index of the last validated ledger.

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

In this example the last validated ledger index is 10268596 (found under `result.state.validated_ledger` in the response).  Note also this example indicates a gap in ledger history.  The server used here would not be able to provide information about the transactions applied during that gap (ledgers 10256383 through 10256411).  If configured to do so, the server eventually retrieves that part of the ledger history.


#### Construct the Transaction

`rippled` provides the [sign method][] to prepare a transaction for submission.  This method requires an account secret, which should only be passed to trusted `rippled` instances.  This example issues 10 FOO (a made-up currency) to another XRP Ledger address.

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

Notice also the `LastLedgerSequence` based on the last validated ledger our application learned from `server_state`.  The recommendation for backend applications is to use *(last validated ledger index + 4)*. Alternately, use a value of *(current ledger + 3)*.  If `LastLedgerSequence` is miscalculated and less than the last validated ledger, the transaction fails with `tefMAX_LEDGER` error.

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

`rippled` provides the [submit method][], allowing us to submit the signed transaction.  This uses the `tx_blob` parameter that was returned by the `sign` method.

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

The transaction hash, generated when the transaction was signed, is passed to the [tx method][] to retrieve the result of a transaction.

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

This example response shows `"validated": true`, indicating the transaction has been included in a validated ledger, so the result of the transaction is immutable.  Further, the metadata includes `"TransactionResult": "tesSUCCESS"`, indicating the transaction was applied to the ledger.

If the response does not include `"validated": true`, the result is provisional and subject to change.  To retrieve a final result, applications must invoke the `tx` method again, allowing enough time for the network to validate more ledger versions.  It may be necessary to wait for the ledger specified in `LastLedgerSequence` to be validated, although if the transaction is included in an earlier validated ledger the result becomes immutable at that time.


#### Verify Missing Transaction

Applications must handle cases where a call to the [tx method][] returns a `txnNotFound` error.

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

The `txnNotFound` result code occurs in cases where the transaction is not included in any ledger.  However, it could also occur when a `rippled` instance does not have a complete ledger history, or if the transaction has not yet propagated to the `rippled` instance.  Applications should make further queries to determine how to react.

The [server_state method][] (used earlier to determine the last validated ledger) indicates how complete the ledger history is, under `result.state.complete_ledgers`.

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

Our example transaction specified `LastLedgerSequence` 10268600, based on the last validated ledger at the time, plus four.  To determine whether our missing transaction has permanently failed, our `rippled` server must have ledgers 10268597 through 10268600.  If the server has those validated ledgers in its history, **and** `tx` returns `txnNotFound`, then the transaction has failed and cannot be included in any future ledger.  In this case, application logic may dictate building and submitting a replacement transaction with the same account sequence and updated `LastLedgerSequence`.

The server may report a last validated ledger index less than the specified `LastLedgerSequence`.  If so, the `txnNotFound` indicates either (a) the submitted transaction has not been distributed to the network, or (b) the transaction has been distributed to the network but has not yet been processed.  To handle the former case, applications may submit again the same signed transaction.  Because the transaction has a unique account sequence number, it can be processed at most once.

Finally the server may show one or more gaps in the transaction history. The `completed_ledgers` field shown in the response above indicates that ledgers 10256383 through 10256411 are missing from this rippled instance.  Our example transaction can only appear in ledgers 10268597 - 10268600 (based on when it was submitted and `LastLedgerSequence`), so the gap shown here is not relevant.  However, if the gap indicated a ledger in that range was missing, then an application would need to query another rippled server (or wait for this one to retrieve the missing ledgers) to determine that a `txnNotFound` result is immutable.


## Additional Resources

- [Transaction Formats](transaction-formats.html)
- [Transaction Cost](transaction-cost.html)
- [Transaction Malleability](transaction-malleability.html)
- [Overview of XRP Ledger Consensus Process](consensus.html)
- [Consensus Principles and Rules](consensus-principles-and-rules.html)

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
