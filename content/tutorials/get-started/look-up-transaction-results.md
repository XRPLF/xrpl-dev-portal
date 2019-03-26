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


## 1. Understanding Success or Failure

Knowing whether a transaction succeeded or failed is a two-part question:

- Was the transaction included in a validated ledger?
- If so, what changes to the ledger state occurred as a result?





########### TODO INCORPORATE OLD STUFF

To see the final result of a transaction, use the [tx method][], [account_tx method][], or other response from `rippled`. Look for `"validated": true` to indicate that this response uses a ledger version that has been validated by consensus.

| Field                  | Value   | Description                               |
|:-----------------------|:--------|:------------------------------------------|
| meta.TransactionResult | String  | A code that categorizes the result, such as `tecPATH_DRY` |
| validated              | Boolean | Whether or not this result comes from a validated ledger. If `false`, then the result is provisional. If `true`, then the result is final. |

```json
    "hash": "E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7",
    "meta": {
      ...
      "TransactionResult": "tesSUCCESS"
    },
    "validated": true
```

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
