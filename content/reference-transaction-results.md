# Transaction Results

This page describes the possible outcomes of transactions in the XRP Ledger, including:

- [Looking Up Transaction Results](#looking-up-transaction-results)
- [Finality of Transaction Results](#finality-of-results)
- [Full Transaction Response List](#full-transaction-response-list)

**See also:**

- For more information on how transactions work, see [Transactions Overview](concept-transactions.html).
- For a reference on transaction instructions, see [Transaction Format Reference](reference-transaction-format.html).

## Immediate Response

The response from the [`submit` command](reference-rippled-api-public.html#submit) contains a provisional result from the `rippled` server indicating what happened during local processing of the transaction.

The response from `submit` contains the following fields:

| Field                   | Value          | Description                       |
|:------------------------|:---------------|:----------------------------------|
| `engine_result`         | String         | A code that categorizes the result, such as `tecPATH_DRY` |
| `engine_result_code`    | Signed Integer | A number that corresponds to the `engine_result`, although exact values are subject to change. |
| `engine_result_message` | String         | A human-readable message explaining what happened. This message is intended for developers to diagnose problems, and is subject to change without notice. |

If nothing went wrong when submitting and applying the transaction locally, the response looks like this:

```js
    "engine_result": "tesSUCCESS",
    "engine_result_code": 0,
    "engine_result_message": "The transaction was applied. Only final in a validated ledger."
```

**Note:** A successful result at this stage does not indicate that the transaction has completely succeeded; only that it was successfully applied to the provisional version of the ledger kept by the local server. Failed results at this stage are also provisional and may change. See [Finality of Results](#finality-of-results) for details.

## Looking up Transaction Results

To see the final result of a transaction, use the [`tx` command](reference-rippled-api-public.html#tx), [`account_tx` command](reference-rippled-api-public.html#account-tx), or other response from `rippled`. Look for `"validated": true` to indicate that this response uses a ledger version that has been validated by consensus.

| Field                  | Value   | Description                               |
|:-----------------------|:--------|:------------------------------------------|
| meta.TransactionResult | String  | A code that categorizes the result, such as `tecPATH_DRY` |
| validated              | Boolean | Whether or not this result comes from a validated ledger. If `false`, then the result is provisional. If `true`, then the result is final. |

```js
    "hash": "E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7",
    "meta": {
      ...
      "TransactionResult": "tesSUCCESS"
    },
    "validated": true
```

## Result Categories

Both the `engine_result` and the `meta.TransactionResult` use standard codes to identify the results of transactions, as follows:

| Category              | Prefix              | Description                    |
|:----------------------|:--------------------|:-------------------------------|
| Local error           | [tel](#tel-codes)   | The rippled server had an error due to local conditions, such as high load. You may get a different response if you resubmit to a different server or at a different time. |
| Malformed transaction | [tem](#tem-codes)   | The transaction was not valid, due to improper syntax, conflicting options, a bad signature, or something else. |
| Failure               | [tef](#tef-codes)   | The transaction cannot be applied to the server's current (in-progress) ledger or any later one. It may have already been applied, or the condition of the ledger makes it impossible to apply in the future. |
| Retry                 | [ter](#ter-codes)   | The transaction could not be applied, but it might be possible to apply later. |
| Success               | [tes](#tes-success) | (Not an error) The transaction succeeded. This result only final in a validated ledger. |
| Claimed cost only     | [tec](#tec-codes)   | The transaction did not achieve its intended purpose, but the [transaction cost](concept-transaction-cost.html) was destroyed. This result is only final in a validated ledger. |

The distinction between a local error (`tel`) and a malformed transaction (`tem`) is a matter of protocol-level rules. For example, the protocol sets no limit on the maximum number of paths that can be included in a transaction. However, a server may define a finite limit of paths it can process. If two different servers are configured differently, then one of them may return a `tel` error for a transaction with many paths, while the other server could successfully process the transaction. If enough servers are able to process the transaction that it survives consensus, then it can still be included in a validated ledger.

By contrast, a `tem` error implies that no server anywhere can apply the transaction, regardless of settings. Either the transaction breaks the rules of the protocol, it is unacceptably ambiguous, or it is completely nonsensical. The only way a malformed transaction could become valid is through changes in the protocol; for example, if a new feature is adopted, then transactions using that feature could be considered malformed by servers that are running older software which predates that feature.

## Claimed Cost Justification

Although it may seem unfair to charge a [transaction cost](concept-transaction-cost.html) for a failed transaction, the `tec` class of errors exists for good reasons:

* Transactions submitted after the failed one do not have to have their Sequence values renumbered. Incorporating the failed transaction into a ledger uses up the transaction's sequence number, preserving the expected sequence.
* Distributing the transaction throughout the network increases network load. Enforcing a cost makes it harder for attackers to abuse the network with failed transactions.
* The transaction cost is generally very small in real-world value, so it should not harm users unless they are sending large quantities of transactions.

## Finality of Results

The order in which transactions apply to the consensus ledger is not final until a ledger is closed and the exact transaction set is approved by the consensus process. A transaction that succeeded initially could still fail, and a transaction that failed initially could still succeed. Additionally, a transaction that was rejected by the consensus process in one round could achieve consensus in a later round.

A validated ledger can include successful transactions (`tes` result codes) as well as failed transactions (`tec` result codes). No transaction with any other result is included in a ledger.

For any other result code, it can be difficult to determine if the result is final. The following table summarizes when a transaction's outcome is final, based on the result code from submitting the transaction:

| Error Code      | Finality                                                   |
|:----------------|:-----------------------------------------------------------|
| `tesSUCCESS`    | Final when included in a validated ledger                  |
| Any `tec` code  | Final when included in a validated ledger                  |
| Any `tem` code  | Final unless the protocol changes to make the transaction valid |
| `tefPAST_SEQ`   | Final when another transaction with the same sequence number is included in a validated ledger |
| `tefMAX_LEDGER` | Final when a validated ledger has a sequence number higher than the transaction's `LastLedgerSequence` field, and no validated ledger includes the transaction |

Any other transaction result is potentially not final. In that case, the transaction could still succeed or fail later, especially if conditions change such that the transaction is no longer prevented from applying. For example, trying to send a non-XRP currency to an account that does not exist yet would fail, but it could succeed if another transaction sends enough XRP to create the destination account. A server might even store a temporarily-failed, signed transaction and then successfully apply it later without asking first.



## Understanding Transaction Metadata

The metadata section of a transaction includes detailed information about all the changes to the shared XRP Ledger that the transaction caused. This is true of any transaction that gets included in a ledger, whether or not it is successful. Naturally, the changes are only final if the transaction is validated.

Some fields that may appear in transaction metadata include:

| Field                                 | Value               | Description    |
|:--------------------------------------|:--------------------|:---------------|
| `AffectedNodes`                       | Array               | List of [ledger objects](reference-ledger-format.html#ledger-object-types) that were created, deleted, or modified by this transaction, and specific changes to each. |
| `DeliveredAmount`                     | [Currency Amount][] | **DEPRECATED.** Replaced by `delivered_amount`. Omitted if not a partial payment. |
| `TransactionIndex`                    | Unsigned Integer    | The transaction's position within the ledger that included it. (For example, the value `2` means it was the 2nd transaction in that ledger.) |
| `TransactionResult`                   | String              | A [result code](#result-categories) indicating whether the transaction succeeded or how it failed. |
| [`delivered_amount`](#delivered-amount) | [Currency Amount][] | The [Currency Amount][] actually received by the `Destination` account. Use this field to determine how much was delivered, regardless of whether the transaction is a [partial payment](concept-partial-payments.html). [New in: rippled 0.27.0][] |

### delivered_amount

The `Amount` of a [Payment transaction][] indicates the amount to deliver to the `Destination`, so if the transaction was successful, then the destination received that much -- **except if the transaction was a [partial payment](concept-partial-payments.html)**. (In that case, any positive amount up to `Amount` might have arrived.) Rather than choosing whether or not to trust the `Amount` field, you should use the `delivered_amount` field of the metadata to see how much actually reached its destination.

The `delivered_amount` field of transaction metadata is included in all successful Payment transactions, and is formatted like a normal currency amount. However, the delivered amount is not available for transactions that meet both of the following criteria:

* Is a partial payment, and
* Included in a validated ledger before 2014-01-20

If both conditions are true, then `delivered_amount` contains the string value `unavailable` instead of an actual amount. If this happens, you can only figure out the actual delivered amount by reading the AffectedNodes in the transaction's metadata.

See also: [Partial Payments](concept-partial-payments.html)

## Full Transaction Response List

[[Source]<br>](https://github.com/ripple/rippled/blob/develop/src/ripple/protocol/TER.h "Source")


### tel Codes

These codes indicate an error in the local server processing the transaction; it is possible that another server with a different configuration or load level could process the transaction successfully. They have numerical values in the range -399 to -300. The exact code for any given error is subject to change, so don't rely on it.

**Caution:** Transactions with `tel` codes are not applied to ledgers and cannot cause any changes to the XRP Ledger state. However, a transaction that provisionally failed may still succeed or fail with a different code after being reapplied. For more information, see [Finality of Results](#finality-of-results) and [Reliable Transaction Submission](tutorial-reliable-transaction-submission.html).

| Code                  | Explanation                                          |
|:----------------------|:-----------------------------------------------------|
| `telBAD_DOMAIN`        | The transaction specified a domain value (for example, the `Domain` field of an [AccountSet transaction][]) that cannot be used, probably because it is too long to store in the ledger. |
| `telBAD_PATH_COUNT`    | The transaction contains too many paths for the local server to process. |
| `telBAD_PUBLIC_KEY`   | The transaction specified a public key value (for example, as the `MessageKey` field of an [AccountSet transaction][]) that cannot be used, probably because it is too long. |
| `telCAN_NOT_QUEUE`    | The transaction did not meet the [open ledger cost](concept-transaction-cost.html), but this server did not queue this transaction because it did not meet the [queuing restrictions](concept-transaction-cost.html#queuing-restrictions). For example, a transaction returns this code when the sender already has 10 other transactions in the queue. You can try again later or sign and submit a replacement transaction with a higher transaction cost in the `Fee` field. |
| `telCAN_NOT_QUEUE_BALANCE` | The transaction did not meet the [open ledger cost](concept-transaction-cost.html) and also was not added to the transaction queue because the sum of potential XRP costs of already-queued transactions is greater than the expected balance of the account. You can try again later, or try submitting to a different server. [New in: rippled 0.70.2][] |
| `telCAN_NOT_QUEUE_BLOCKS` | The transaction did not meet the [open ledger cost](concept-transaction-cost.html) and also was not added to the transaction queue. This transaction could not replace an existing transaction in the queue because it would block already-queued transactions from the same sender by changing authorization methods. (This includes all [SetRegularKey][] and [SignerListSet][] transactions, as well as [AccountSet][] transactions that change the RequireAuth/OptionalAuth, DisableMaster, or AccountTxnID flags.) You can try again later, or try submitting to a different server. [New in: rippled 0.70.2][] |
| `telCAN_NOT_QUEUE_BLOCKED` | The transaction did not meet the [open ledger cost](concept-transaction-cost.html) and also was not added to the transaction queue because a transaction queued ahead of it from the same sender blocks it. (This includes all [SetRegularKey][] and [SignerListSet][] transactions, as well as [AccountSet][] transactions that change the RequireAuth/OptionalAuth, DisableMaster, or AccountTxnID flags.) You can try again later, or try submitting to a different server. [New in: rippled 0.70.2][] |
| `telCAN_NOT_QUEUE_FEE` | The transaction did not meet the [open ledger cost](concept-transaction-cost.html) and also was not added to the transaction queue. This code occurs when a transaction with the same sender and sequence number already exists in the queue and the new one does not pay a large enough transaction cost to replace the existing transaction. To replace a transaction in the queue, the new transaction must have a `Fee` value that is at least 25% more, as measured in [fee levels](concept-transaction-cost.html#fee-levels). You can increase the `Fee` and try again, send this with a higher `Sequence` number so it doesn't replace an existing transaction, or try sending to another server. [New in: rippled 0.70.2][] |
| `telCAN_NOT_QUEUE_FULL` | The transaction did not meet the [open ledger cost](concept-transaction-cost.html) and the server did not queue this transaction because this server's transaction queue is full. You could increase the `Fee` and try again, try again later, or try submitting to a different server. The new transaction must have a higher transaction cost, as measured in [fee levels](concept-transaction-cost.html#fee-levels), than the transaction in the queue with the smallest transaction cost. [New in: rippled 0.70.2][] |
| `telFAILED_PROCESSING` | An unspecified error occurred when processing the transaction. |
| `telINSUF_FEE_P`       | The `Fee` from the transaction is not high enough to meet the server's current [transaction cost](concept-transaction-cost.html) requirement, which is derived from its load level. |
| `telLOCAL_ERROR`        | Unspecified local error.                             |
| `telNO_DST`_`PARTIAL`   | The transaction is an XRP payment that would fund a new account, but the [tfPartialPayment flag](reference-transaction-format.html#partial-payments) was enabled. This is disallowed. |

### tem Codes

These codes indicate that the transaction was malformed, and cannot succeed according to the XRP Ledger protocol. They have numerical values in the range -299 to -200. The exact code for any given error is subject to change, so don't rely on it.

**Tip:** Transactions with `tem` codes are not applied to ledgers, and cannot cause any changes to XRP Ledger state. A `tem` result is final unless the rules for a valid transaction change. (For example, using functionality from an [Amendment](concept-amendments.html) before that amendment is enabled results in `temDISABLED`; such a transaction could succeed later if it becomes valid when the amendment is enabled.)

| Code                         | Explanation                                   |
|:-----------------------------|:----------------------------------------------|
| `temBAD_AMOUNT`               | An amount specified by the transaction (for example the destination `Amount` or `SendMax` values of a [Payment transaction][]) was invalid, possibly because it was a negative number. |
| `temBAD_AUTH_MASTER`         | The key used to sign this transaction does not match the master key for the account sending it, and the account does not have a [Regular Key Pair](concept-cryptographic-keys.html#regular-key-pair) set. |
| `temBAD_CURRENCY`             | The transaction improperly specified a currency field. See [Specifying Currency Amounts][Currency Amount] for the correct format. |
| `temBAD_EXPIRATION`           | The transaction improperly specified an expiration value, for example as part of an [OfferCreate transaction][]. Alternatively, the transaction did not specify a required expiration value, for example as part of an [EscrowCreate transaction][]. |
| `temBAD_FEE`                  | The transaction improperly specified its `Fee` value, for example by listing a non-XRP currency or some negative amount of XRP. |
| `temBAD_ISSUER`               | The transaction improperly specified the `issuer` field of some currency included in the request. |
| `temBAD_LIMIT`                | The [TrustSet transaction][] improperly specified the `LimitAmount` value of a trustline. |
| `temBAD_OFFER`                | The [OfferCreate transaction][] specifies an invalid offer, such as offering to trade XRP for itself, or offering a negative amount. |
| `temBAD_PATH`                 | The [Payment transaction][] specifies one or more [Paths](reference-transaction-format.html#paths) improperly, for example including an issuer for XRP, or specifying an account differently. |
| `temBAD_PATH_LOOP`           | One of the [Paths](reference-transaction-format.html#paths) in the [Payment transaction][] was flagged as a loop, so it cannot be processed in a bounded amount of time. |
| `temBAD_SEND_XRP_LIMIT`     | The [Payment transaction][] used the [tfLimitQuality](reference-transaction-format.html#limit-quality) flag in a direct XRP-to-XRP payment, even though XRP-to-XRP payments do not involve any conversions. |
| `temBAD_SEND_XRP_MAX`       | The [Payment transaction][] included a `SendMax` field in a direct XRP-to-XRP payment, even though sending XRP should never require SendMax. (XRP is only valid in SendMax if the destination `Amount` is not XRP.) |
| `temBAD_SEND_XRP_NO_DIRECT` | The [Payment transaction][] used the [tfNoDirectRipple](reference-transaction-format.html#payment-flags) flag for a direct XRP-to-XRP payment, even though XRP-to-XRP payments are always direct. |
| `temBAD_SEND_XRP_PARTIAL`   | The [Payment transaction][] used the [tfPartialPayment](reference-transaction-format.html#partial-payments) flag for a direct XRP-to-XRP payment, even though XRP-to-XRP payments should always deliver the full amount. |
| `temBAD_SEND_XRP_PATHS`     | The [Payment transaction][] included `Paths` while sending XRP, even though XRP-to-XRP payments should always be direct. |
| `temBAD_SEQUENCE`             | The transaction is references a sequence number that is higher than its own `Sequence` number, for example trying to cancel an offer that would have to be placed after the transaction that cancels it. |
| `temBAD_SIGNATURE`            | The signature to authorize this transaction is either missing, or formed in a way that is not a properly-formed signature. (See [tecNO_PERMISSION](#tec-codes) for the case where the signature is properly formed, but not authorized for this account.) |
| `temBAD_SRC_ACCOUNT`         | The `Account` on whose behalf this transaction is being sent (the "source account") is not a properly-formed [account](concept-accounts.html) address. |
| `temBAD_TRANSFER_RATE`       | The [`TransferRate` field of an AccountSet transaction](reference-transaction-format.html#transferrate) is not properly formatted or out of the acceptable range. |
| `temDST_IS_SRC`              | The [TrustSet transaction][] improperly specified the destination of the trust line (the `issuer` field of `LimitAmount`) as the `Account` sending the transaction. You cannot extend a trust line to yourself. (In the future, this code could also apply to other cases where the destination of a transaction is not allowed to be the account sending it.) |
| `temDST_NEEDED`               | The transaction improperly omitted a destination. This could be the `Destination` field of a [Payment transaction][], or the `issuer` sub-field of the `LimitAmount` field fo a `TrustSet` transaction. |
| `temINVALID`                   | The transaction is otherwise invalid. For example, the transaction ID may not be the right format, the signature may not be formed properly, or something else went wrong in understanding the transaction. |
| `temINVALID_FLAG`             | The transaction includes a [Flag](reference-transaction-format.html#flags) that does not exist, or includes a contradictory combination of flags. |
| `temMALFORMED`                 | Unspecified problem with the format of the transaction. |
| `temREDUNDANT`                 | The transaction would do nothing; for example, it is sending a payment directly to the sending account, or creating an offer to buy and sell the same currency from the same issuer. |
| `temREDUNDANT_SEND_MAX`      | [Removed in: rippled 0.28.0][] |
| `temRIPPLE_EMPTY`             | The [Payment transaction][] includes an empty `Paths` field, but paths are necessary to complete this payment. |
| `temBAD_WEIGHT`                | The [SignerListSet transaction][] includes a `SignerWeight` that is invalid, for example a zero or negative value. |
| `temBAD_SIGNER`                | The [SignerListSet transaction][] includes a signer who is invalid. For example, there may be duplicate entries, or the owner of the SignerList may also be a member. |
| `temBAD_QUORUM`                | The [SignerListSet transaction][] has an invalid `SignerQuorum` value. Either the value is not greater than zero, or it is more than the sum of all signers in the list. |
| `temUNCERTAIN`                 | Used internally only. This code should never be returned. |
| `temUNKNOWN`                   | Used internally only. This code should never be returned. |
| `temDISABLED`                  | The transaction requires logic that is disabled. Typically this means you are trying to use an [amendment](concept-amendments.html) that is not enabled for the current ledger. |


### tef Codes

These codes indicate that the transaction failed and was not included in a ledger, but the transaction could have succeeded in some theoretical ledger. Typically this means that the transaction can no longer succeed in any future ledger. They have numerical values in the range -199 to -100. The exact code for any given error is subject to change, so don't rely on it.

**Caution:** Transactions with `tef` codes are not applied to ledgers and cannot cause any changes to the XRP Ledger state. However, a transaction that provisionally failed may still succeed or fail with a different code after being reapplied. For more information, see [Finality of Results](#finality-of-results) and [Reliable Transaction Submission](tutorial-reliable-transaction-submission.html).

| Code                   | Explanation                                         |
|:-----------------------|:----------------------------------------------------|
| `tefALREADY`             | The same exact transaction has already been applied. |
| `tefBAD_ADD_AUTH`      | **DEPRECATED.**                                     |
| `tefBAD_AUTH`           | The key used to sign this account is not authorized to modify this account. (It could be authorized if the account had that key set as the [Regular Key Pair](concept-cryptographic-keys.html#regular-key-pair).) |
| `tefBAD_AUTH_MASTER`   | The single signature provided to authorize this transaction does not match the master key, but no regular key is associated with this address. |
| `tefBAD_LEDGER`         | While processing the transaction, the ledger was discovered in an unexpected state. If you can reproduce this error, please [report an issue](https://github.com/ripple/rippled/issues) to get it fixed. |
| `tefBAD_QUORUM`         | The transaction was [multi-signed](concept-transactions.html#multi-signing), but the total weights of all included signatures did not meet the quorum. |
| `tefBAD_SIGNATURE`      | The transaction was [multi-signed](concept-transactions.html#multi-signing), but contained a signature for an address not part of a SignerList associated with the sending account. |
| `tefCREATED`             | **DEPRECATED.**                                     |
| `tefEXCEPTION`           | While processing the transaction, the server entered an unexpected state. This may be caused by unexpected inputs, for example if the binary data for the transaction is grossly malformed. If you can reproduce this error, please [report an issue](https://github.com/ripple/rippled/issues) to get it fixed. |
| `tefFAILURE`             | Unspecified failure in applying the transaction.    |
| `tefINTERNAL`            | When trying to apply the transaction, the server entered an unexpected state. If you can reproduce this error, please [report an issue](https://github.com/ripple/rippled/issues) to get it fixed. |
| `tefINVARIANT_FAILED`   | An invariant check failed when trying to claim the [transaction cost](concept-transaction-cost.html). Requires the [EnforceInvariants amendment](reference-amendments.html#enforceinvariants). If you can reproduce this error, please [report an issue](https://github.com/ripple/rippled/issues). |
| `tefMASTER_DISABLED`    | The transaction was signed with the account's master key, but the account has the `lsfDisableMaster` field set. |
| `tefMAX_LEDGER`         | The transaction included a [`LastLedgerSequence`](reference-transaction-format.html#lastledgersequence) parameter, but the current ledger's sequence number is already higher than the specified value. |
| `tefNO_AUTH_REQUIRED`  | The [TrustSet transaction][] tried to mark a trustline as authorized, but the `lsfRequireAuth` flag is not enabled for the corresponding account, so authorization is not necessary. |
| `tefNOT_MULTI_SIGNING` | The transaction was [multi-signed](concept-transactions.html#multi-signing), but the sending account has no SignerList defined. |
| `tefPAST_SEQ`           | The sequence number of the transaction is lower than the current sequence number of the account sending the transaction. |
| `tefWRONG_PRIOR`        | The transaction contained an `AccountTxnID` field (or the deprecated `PreviousTxnID` field), but the transaction specified there does not match the account's previous transaction. |

### ter Codes

These codes indicate that the transaction failed, but it could apply successfully in the future, usually if some other hypothetical transaction applies first. They have numerical values in the range -99 to -1. The exact code for any given error is subject to change, so don't rely on it.

**Caution:** Transactions with `ter` codes are not applied to ledgers and cannot cause any changes to the XRP Ledger state. However, a transaction that provisionally failed may still succeed or fail with a different code after being reapplied. For more information, see [Finality of Results](#finality-of-results) and [Reliable Transaction Submission](tutorial-reliable-transaction-submission.html).

| Code             | Explanation                                               |
|:-----------------|:----------------------------------------------------------|
| `terFUNDS_SPENT`  | **DEPRECATED.**                                           |
| `terINSUF_FEE_B` | The account sending the transaction does not have enough XRP to pay the `Fee` specified in the transaction. |
| `terLAST`          | Used internally only. This code should never be returned. |
| `terNO_ACCOUNT`   | The address sending the transaction is not funded in the ledger (yet). |
| `terNO_AUTH`      | The transaction would involve adding currency issued by an account with `lsfRequireAuth` enabled to a trust line that is not authorized. For example, you placed an offer to buy a currency you aren't authorized to hold. |
| `terNO_LINE`      | Used internally only. This code should never be returned. |
| `terNO_RIPPLE`    | Used internally only. This code should never be returned. |
| `terOWNERS`        | The transaction requires that account sending it has a nonzero "owners count", so the transaction cannot succeed. For example, an account cannot enable the [`lsfRequireAuth`](reference-transaction-format.html#accountset-flags) flag if it has any trust lines or available offers. |
| `terPRE_SEQ`      | The `Sequence` number of the current transaction is higher than the current sequence number of the account sending the transaction. |
| `terRETRY`         | Unspecified retriable error.                              |
| `terQUEUED`        | The transaction met the load-scaled [transaction cost](concept-transaction-cost.html) but did not meet the open ledger requirement, so the transaction has been queued for a future ledger. |

### tes Success

The code `tesSUCCESS` is the only code that indicates a transaction succeeded. This does not always mean it accomplished what you expected it to do. (For example, an [OfferCancel][] can "succeed" even if there is no offer for it to cancel.) The `tesSUCCESS` result uses the numerical value 0.

| Code       | Explanation                                                     |
|:-----------|:----------------------------------------------------------------|
| `tesSUCCESS` | The transaction was applied and forwarded to other servers. If this appears in a validated ledger, then the transaction's success is final. |

### tec Codes

These codes indicate that the transaction failed, but it was applied to a ledger to apply the [transaction cost](concept-transaction-cost.html). They have numerical values in the range 100 to 199. Ripple recommends using the text code, not the numeric value.

For the most part, transactions with `tec` codes take no action other than to destroy the XRP paid as a [transaction cost](concept-transaction-cost.html), but there are some exceptions. As an exception, a transaction that results in `tecOVERSIZE` still cleans up some [unfunded offers](reference-transaction-format.html#lifecycle-of-an-offer). Always look at the [transaction metadata](reference-transaction-results.html#understanding-transaction-metadata) to see precisely what a transaction did.

**Caution:** A transaction that provisionally failed with a `tec` code may still succeed or fail with a different code after being reapplied. The result is final when it appears in a validated ledger version. For more information, see [Finality of Results](#finality-of-results) and [Reliable Transaction Submission](tutorial-reliable-transaction-submission.html).

| Code                       | Value | Explanation                             |
|:---------------------------|:------|:----------------------------------------|
| `tecCLAIM`                 | 100   | Unspecified failure, with transaction cost destroyed. |
| `tecCRYPTOCONDITION_ERROR` | 146   | This [EscrowCreate][] or [EscrowFinish][] transaction contained a malformed or mismatched crypto-condition. |
| `tecDIR_FULL`              | 121   | The transaction tried to add an object (such as a trust line, Check, Escrow, or Payment Channel) to an account's owner directory, but that account cannot own any more objects in the ledger. |
| `tecDST_TAG_NEEDED`        | 143   | The [Payment transaction][] omitted a destination tag, but the destination account has the `lsfRequireDestTag` flag enabled. [New in: rippled 0.28.0][] |
| `tecEXPIRED`               | 148   | The transaction tried to create an object (such as an Offer or a Check) whose provided Expiration time has already passed. |
| `tecFAILED_PROCESSING`     | 105   | An unspecified error occurred when processing the transaction. |
| `tecFROZEN`                | 137   | The [OfferCreate transaction][] failed because one or both of the assets involved are subject to a [global freeze](concept-freeze.html). |
| `tecINSUF_RESERVE_LINE`    | 122   | The transaction failed because the sending account does not have enough XRP to create a new trust line. (See: [Reserves](concept-reserves.html)) This error occurs when the counterparty already has a trust line in a non-default state to the sending account for the same currency. (See `tecNO_LINE_INSUF_RESERVE` for the other case.) |
| `tecINSUF_RESERVE_OFFER`   | 123   | The transaction failed because the sending account does not have enough XRP to create a new Offer. (See: [Reserves](concept-reserves.html)) |
| `tecINSUFFICIENT_RESERVE`  | 141   | The transaction would increase the [reserve requirement](concept-reserves.html) higher than the sending account's balance. [SignerListSet][], [PaymentChannelCreate][], [PaymentChannelFund][], and [EscrowCreate][] can return this error code. See [SignerLists and Reserves](reference-ledger-format.html#signerlists-and-reserves) for more information. |
| `tecINTERNAL`              | 144   | Unspecified internal error, with transaction cost applied. This error code should not normally be returned. If you can reproduce this error, please [report an issue](https://github.com/ripple/rippled/issues). |
| `tecINVARIANT_FAILED`      | 147   | An invariant check failed when trying to execute this transaction. Requires the [EnforceInvariants amendment](reference-amendments.html#enforceinvariants). If you can reproduce this error, please [report an issue](https://github.com/ripple/rippled/issues). |
| `tecNEED_MASTER_KEY`       | 142   | This transaction tried to cause changes that require the master key, such as [disabling the master key or giving up the ability to freeze balances](concept-freeze.html). [New in: rippled 0.28.0][] |
| `tecNO_ALTERNATIVE_KEY`    | 130   | The transaction tried to remove the only available method of [authorizing transactions](concept-transactions.html#authorizing-transactions). This could be a [SetRegularKey transaction][] to remove the regular key, a [SignerListSet transaction][] to delete a SignerList, or an [AccountSet transaction][] to disable the master key. (Prior to `rippled` 0.30.0, this was called `tecMASTER_DISABLED`.) |
| `tecNO_AUTH`               | 134   | The transaction failed because it needs to add a balance on a trust line to an account with the `lsfRequireAuth` flag enabled, and that trust line has not been authorized. If the trust line does not exist at all, `tecNO_LINE` occurs instead. |
| `tecNO_DST`                | 124   | The account on the receiving end of the transaction does not exist. This includes Payment and TrustSet transaction types. (It could be created if it received enough XRP.) |
| `tecNO_DST_INSUF_XRP`      | 125   | The account on the receiving end of the transaction does not exist, and the transaction is not sending enough XRP to create it. |
| `tecNO_ENTRY`              | 140   | Reserved for future use.                |
| `tecNO_ISSUER`             | 133   | The account specified in the `issuer` field of a currency amount does not exist. |
| `tecNO_LINE`               | 135   | The `TakerPays` field of the [OfferCreate transaction][] specifies an asset whose issuer has `lsfRequireAuth` enabled, and the account making the offer does not have a trust line for that asset. (Normally, making an offer implicitly creates a trust line if necessary, but in this case it does not bother because you cannot hold the asset without authorization.) If the trust line exists, but is not authorized, `tecNO_AUTH` occurs instead. |
| `tecNO_LINE_INSUF_RESERVE` | 126   | The transaction failed because the sending account does not have enough XRP to create a new trust line. (See: [Reserves](concept-reserves.html)) This error occurs when the counterparty does not have a trust line to this account for the same currency. (See `tecINSUF_RESERVE_LINE` for the other case.) |
| `tecNO_LINE_REDUNDANT`     | 127   | The transaction failed because it tried to set a trust line to its default state, but the trust line did not exist. |
| `tecNO_PERMISSION`         | 139   | The sender does not have permission to do this operation. For example, the [EscrowFinish transaction][] tried to release a held payment before its `FinishAfter` time, someone tried to use [PaymentChannelFund][] on a channel the sender does not own, or a [Payment][] tried to deliver funds to an account with the "DepositAuth" flag enabled. |
| `tecNO_REGULAR_KEY`        | 131   | The [AccountSet transaction][] tried to disable the master key, but the account does not have another way to [authorize transactions](concept-transactions.html#authorizing-transactions). If [multi-signing](concept-transactions.html#multi-signing) is enabled, this code is deprecated and `tecNO_ALTERNATIVE_KEY` is used instead. |
| `tecNO_TARGET`             | 138   | The transaction referenced an Escrow or PayChannel ledger object that doesn't exist, either because it never existed or it has already been deleted. (For example, another [EscrowFinish transaction][] has already executed the held payment.) Alternatively, the destination account has `asfDisallowXRP` set so it cannot be the destination of this [PaymentChannelCreate][] or [EscrowCreate][] transaction. |
| `tecOVERSIZE`              | 145   | This transaction could not be processed, because the server created an excessively large amount of metadata when it tried to apply the transaction. [New in: rippled 0.29.0-hf1][] |
| `tecOWNERS`                | 132   | The transaction requires that account sending it has a nonzero "owners count", so the transaction cannot succeed. For example, an account cannot enable the [`lsfRequireAuth`](reference-transaction-format.html#accountset-flags) flag if it has any trust lines or available offers. |
| `tecPATH_DRY`              | 128   | The transaction failed because the provided paths did not have enough liquidity to send anything at all. This could mean that the source and destination accounts are not linked by trust lines. |
| `tecPATH_PARTIAL`          | 101   | The transaction failed because the provided paths did not have enough liquidity to send the full amount. |
| `tecUNFUNDED`              | 129   | The transaction failed because the account does not hold enough XRP to pay the amount in the transaction _and_ satisfy the additional reserve necessary to execute this transaction. (See: [Reserves](concept-reserves.html)) |
| `tecUNFUNDED_ADD`          | 102   | **DEPRECATED.**                         |
| `tecUNFUNDED_PAYMENT`      | 104   | The transaction failed because the sending account is trying to send more XRP than it holds, not counting the reserve. (See: [Reserves](concept-reserves.html)) |
| `tecUNFUNDED_OFFER`        | 103   | The [OfferCreate transaction][] failed because the account creating the offer does not have any of the `TakerGets` currency. |



<!--{# Common Links #}-->
{% include 'snippets/rippled_versions.md' %}
{% include 'snippets/tx-type-links.md' %}
{% include 'snippets/rippled-api-links.md' %}
