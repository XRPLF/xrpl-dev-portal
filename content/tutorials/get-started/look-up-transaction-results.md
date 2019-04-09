# Look up Transaction Results

To use the XRP Ledger effectively, you need to be able to understand transaction outcomes: did the transaction succeed? What did it accomplish? If it failed, why?

The XRP Ledger is a shared system, with all data recorded publicly and carefully, securely updated with each new [ledger version](ledgers.html). Anyone can look up the exact outcome of any transaction and read the [transaction metadata](transaction-metadata.html) to see what it did.

This document describes, at a low level, how to know why a transaction reached the outcome it did. For an end-user, it is easier to look at a processed view of a transaction. For example,  you can [use XRP Charts to get an English-language description of any recorded transaction](https://xrpcharts.ripple.com/#/transactions/).

## Prerequisites

To understand the outcome of a transaction as described in these instructions, you must:

- Know which transaction you want to understand. If you know the transaction's [identifying hash](transaction-basics.html#identifying-transactions), you can look it up that way. You can also look at transactions that executed in a recent ledger or the transactions that most recently affected a given account.
- Have access to a `rippled` server that provides reliable information and has the necessary history for when the transaction was submitted.
    - For looking up the outcomes of transactions you've recently submitted, the server you submitted through should be sufficient, as long as it maintains sync with the network during tha time.
    - For outcomes of older transactions, you may want to use a [full-history server](ledger-history.html#full-history).


## 1. Get Transaction Status

Knowing whether a transaction succeeded or failed is a two-part question:

1. Was the transaction included in a validated ledger?
2. If so, what changes to the ledger state occurred as a result?

To know whether a transaction was included in a validated ledger, you usually need access to all the ledgers it could possibly be in. The simplest, most foolproof way to do this is to look up the transaction on a [full history server](ledger-history.html#full-history). Use the [tx method][], [account_tx method][], or other response from `rippled`. Look for `"validated": true` to indicate that this response uses a ledger version that has been validated by consensus.

- If the result does not have `"validated": true`, then the result may be tentative and you must wait for the ledger to be validated to know if the transaction's outcome is final.
- If the result does not contain the transaction in question, or returns the error `txnNotFound`, then the transaction is not in any ledger that the server has in its available history. This may or may not mean that the transaction failed, depending on whether the transaction could be in a validated ledger version that the server does not have and whether it could be included in a future validated ledger. You can constrain the range of ledgers a transaction can be in by knowing:
    - The earliest ledger the transaction could be in, which is the **first ledger to be validated _after_ the transaction was first submitted**.
    - The last ledger the transaction could be in, which is defined by the transaction's `LastLedgerSequence` field.


### Case: Not Included in a Validated Ledger

**If a transaction is not included in a validated ledger, it cannot possibly have had _any_ effect on the shared XRP Ledger state.** If the transaction's failure to be included in a ledger is [_final_](finality-of-results.html), then it cannot have any future effect, either.

If the transaction's failure is not final, it may still become included in a _future_ validated ledger. You can use the provisional results of applying the transaction to the current open ledger as a preview of the likely effects the transaction may have in a final ledger, but those results can change due to [numerous factors](finality-of-results.html#how-can-non-final-results-change).


### Case: Included in a Validated Ledger

If the transaction _is_ included in a validated ledger, then the [transaction metadata](transaction-metadata.html) contains a full report of all changes that were made to the ledger state as a result of processing the transaction. The metadata's `TransactionResult` field contains a [transaction result code](transaction-results.html) that summarizes the outcome:

- The code `tesSUCCESS` indicates that the transaction was, more or less, successful.
- A `tec`-class code indicates that the transaction failed, and its only effects on the ledger state are to destroy the XRP [transaction cost](transaction-cost.html) and possibly perform some bookkeeping like removing [expired offers](ffers.html#offer-expiration) and [closed payment channels](payment-channels.html#payment-channel-lifecycle).
- (No other code can appear in any ledger.)

The result code is only a summary of the transaction's outcome. To understand in more detail what the transaction did, you must read the rest of the metadata in context of the transaction's instructions and the ledger state before the transaction executed.


## 2. Interpret Metadata


***TODO***

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
