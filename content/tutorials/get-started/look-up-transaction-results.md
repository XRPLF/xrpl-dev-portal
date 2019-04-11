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

**Tip:** There are other ways of querying for data on transactions from the XRP Ledger, including the [Data API](data-api.html) and other exported databases, but those interfaces are non-authoritative. This document describes how to look up data using the `rippled` API directly, for the most direct and authoritative results possible.


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

Transaction metadata describes _exactly_ how the transaction was applied to the ledger, including the following fields:

{% include '_snippets/tx-metadata-field-table.md' %} <!--_ -->

Aside from the result code, most of the interesting information is in the `AffectedNodes` array. Much of what to look for in this array depends on the type of transaction, but at a minimum, every normal transaction (that is, not a [pseudo-transaction](pseudo-transaction-types.html)) modifies the sender's [AccountRoot object](accountroot.html), to destroy the XRP [transaction cost](transaction-cost.html) and increase the [account's Sequence number](basic-data-types.html#account-sequence).

For example, the _only_ changes made by this [no-op transaction](cancel-or-skip-a-transaction.html) are to update the sender's `Sequence`, `Balance`, and [`AccountTxnID`](transaction-common-fields.html#accounttxnid):

```json
{
  "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
  "Fee": "12",
  "Flags": 2147483648,
  "LastLedgerSequence": 46447424,
  "Sequence": 376,
  "SigningPubKey": "03AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB",
  "TransactionType": "AccountSet",
  "TxnSignature": "30450221009B2910D34527F4EA1A02C375D5C38CF768386ACDE0D17CDB04C564EC819D6A2C022064F419272003AA151BB32424F42FC3DBE060C8835031A4B79B69B0275247D5F4",
  "date": 608257201,
  "hash": "017DED8F5E20F0335C6F56E3D5EE7EF5F7E83FB81D2904072E665EEA69402567",
  "inLedger": 46447423,
  "ledger_index": 46447423,
  "meta": {
    "AffectedNodes": [
      {
        "ModifiedNode": {
          "FinalFields": {
            "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
            "AccountTxnID": "017DED8F5E20F0335C6F56E3D5EE7EF5F7E83FB81D2904072E665EEA69402567",
            "Balance": "396015164",
            "Domain": "6D64756F31332E636F6D",
            "EmailHash": "98B4375E1D753E5B91627516F6D70977",
            "Flags": 8519680,
            "MessageKey": "0000000000000000000000070000000300",
            "OwnerCount": 9,
            "Sequence": 377,
            "TransferRate": 4294967295
          },
          "LedgerEntryType": "AccountRoot",
          "LedgerIndex": "13F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8",
          "PreviousFields": {
            "AccountTxnID": "E710CADE7FE9C26C51E8630138322D80926BE91E46D69BF2F36E6E4598D6D0CF",
            "Balance": "396015176",
            "Sequence": 376
          },
          "PreviousTxnID": "E710CADE7FE9C26C51E8630138322D80926BE91E46D69BF2F36E6E4598D6D0CF",
          "PreviousTxnLgrSeq": 46447387
        }
      }
    ],
    "TransactionIndex": 13,
    "TransactionResult": "tesSUCCESS"
  },
  "validated": true
}
```

**Tip:** If the transaction sends or receives XRP, those changes are combined with the transaction cost, resulting in a single change to the sending account's `Balance` field in the net amount. For example, if you sent 1 XRP (1,000,000 drops) and destroyed 10 drops for the transaction cost, the metadata shows only one change to your `Balance`, decreasing it by 1,000,010 XRP.)

***TODO***

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
