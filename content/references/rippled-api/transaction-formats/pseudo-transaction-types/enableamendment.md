# EnableAmendment

Tracks the progress of the [amendment process](amendments.html#amendment-process) for changes in transaction processing. This can indicate that a proposed amendment gained or lost majority approval, or that an amendment has been enabled.

**Note:** You cannot send a pseudo-transaction, but you may find one when processing ledgers.

| Field          | JSON Type | [Internal Type][] | Description                 |
|:---------------|:----------|:------------------|:----------------------------|
| Amendment      | String    | Hash256           | A unique identifier for the amendment. This is not intended to be a human-readable name. See [Amendments](amendments.html) for a list of known amendments. |
| LedgerSequence | Number    | UInt32            | The index of the ledger version where this amendment appears. This distinguishes the pseudo-transaction from other occurrences of the same change. |

## EnableAmendment Flags

The `Flags` value of the EnableAmendment pseudo-transaction indicates the status of the amendment at the time of the ledger including the pseudo-transaction.

A `Flags` value of `0` (no flags) indicates that the amendment has been enabled, and applies to all ledgers afterward. Other `Flags` values are as follows:

| Flag Name      | Hex Value  | Decimal Value | Description                    |
|:---------------|:-----------|:--------------|:-------------------------------|
| tfGotMajority  | 0x00010000 | 65536         | Support for this amendment increased to at least 80% of trusted validators starting with this ledger version. |
| tfLostMajority | 0x00020000 | 131072        | Support for this amendment decreased to less than 80% of trusted validators starting with this ledger version. |

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
