---
html: ticket.html
parent: ledger-entry-types.html
blurb: A Ticket tracks an account sequence number that has been set aside for future use.
labels:
  - Transaction Sending
---
# Ticket

[[Source]](https://github.com/XRPLF/rippled/blob/76a6956138c4ecd156c5c408f136ed3d6ab7d0c1/src/ripple/protocol/impl/LedgerFormats.cpp#L155-L164)

_(Added by the [TicketBatch amendment][].)_

A `Ticket` entry type represents a [Ticket](tickets.html), which tracks an account [sequence number][Sequence Number] that has been set aside for future use. You can create new tickets with a [TicketCreate transaction][].

## Example {{currentpage.name}} JSON

```json
{
  "Account": "rEhxGqkqPPSxQ3P25J66ft5TwpzV14k2de",
  "Flags": 0,
  "LedgerEntryType": "Ticket",
  "OwnerNode": "0000000000000000",
  "PreviousTxnID": "F19AD4577212D3BEACA0F75FE1BA1644F2E854D46E8D62E9C95D18E9708CBFB1",
  "PreviousTxnLgrSeq": 4,
  "TicketSequence": 3
}
```

## {{currentpage.name}} Fields

In addition to the [common fields](ledger-entry-common-fields.html), `{{currentpage.name}}` entries have the following fields:

| Name                | JSON Type | Internal Type | Required? | Description                |
|:--------------------|:----------|:--------------|:----------|:---------------------------|
| `Account`           | String    | AccountID     | Yes       | The [account](accounts.html) that owns this Ticket. |
| `LedgerEntryType`   | String    | UInt16        | Yes       | The value `0x0054`, mapped to the string `Ticket`, indicates that this is a {{currentpage.name}} entry. |
| `OwnerNode`         | String    | UInt64        | Yes       | A hint indicating which page of the owner directory links to this entry, in case the directory consists of multiple pages. |
| `PreviousTxnID`     | String    | Hash256       | Yes       | The identifying hash of the [transaction](transactions.html) that most recently modified this entry. |
| `PreviousTxnLgrSeq` | Number    | UInt32        | Yes       | The [index of the ledger][Ledger Index] that contains the transaction that most recently modified this entry. |
| `TicketSequence`    | Number    | UInt32        | Yes       | The [Sequence Number][] this Ticket sets aside. |


## {{currentpage.name}} Reserve

`{{currentpage.name}}` entries count as one item towards the owner reserve of the account that placed the created it, as long as the entry is in the ledger. Using the ticket frees up the reserve.


## {{currentpage.name}} Flags

There are no flags defined for `{{currentpage.name}}` entries.


## {{currentpage.name}} ID Format

The ID of a Ticket object is the SHA-512Half of the following values, concatenated in order:

* The Ticket space key (`0x0054`)
* The AccountID of the owner of the Ticket
* The `TicketSequence` number of the Ticket

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
