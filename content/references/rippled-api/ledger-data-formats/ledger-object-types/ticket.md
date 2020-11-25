---
html: ticket.html
funnel: Build
doc_type: References
supercategory: rippled API
category: Ledger Data Formats
subcategory: Ledger Object Types
blurb: A Ticket tracks an account sequence number that has been set aside for future use.
parent: ledger-object-types.html
---
# Ticket

[[Source]](https://github.com/ripple/rippled/blob/76a6956138c4ecd156c5c408f136ed3d6ab7d0c1/src/ripple/protocol/impl/LedgerFormats.cpp#L155-L164)

_(Requires the [TicketBatch amendment][] :not_enabled:)_

The `Ticket` object type represents a [Ticket](tickets.html), which tracks an account [sequence number][Sequence Number] that has been set aside for future use. You can create new tickets with a [TicketCreate transaction][]. [New in: rippled 1.7.0][]

## Example {{currentpage.name}} JSON

<!-- TODO: this example is synthetic. Replace with a real example when possible -->

```json
{
  "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
  "Flags": 0,
  "LedgerEntryType": "Ticket",
  "OwnerNode": "0000000000000000",
  "PreviousTxnID": "F0AB71E777B2DA54B86231E19B82554EF1F8211F92ECA473121C655BFC5329BF",
  "PreviousTxnLgrSeq": 14524914,
  "TicketSequence": 381
}
```

## {{currentpage.name}} Fields

A `Ticket` object has the following fields:

| Name                | JSON Type | Internal Type | Description                |
|:--------------------|:----------|:--------------|:---------------------------|
| `LedgerEntryType`   | String    | UInt16        | The value `0x0054`, mapped to the string `Ticket`, indicates that this object is a {{currentpage.name}} object. |
| `Account`           | String    | AccountID     | The [account](accounts.html) that owns this Ticket. |
| `Flags`             | Number    | UInt32        | A bit-map of Boolean flags enabled for this Ticket. Currently, there are no flags defined for Tickets. |
| `OwnerNode`         | String    | UInt64        | A hint indicating which page of the owner directory links to this object, in case the directory consists of multiple pages. **Note:** The object does not contain a direct link to the owner directory containing it, since that value can be derived from the `Account`. |
| `PreviousTxnID`     | String    | Hash256       | The identifying hash of the [transaction](transaction-basics.html) that most recently modified this object. |
| `PreviousTxnLgrSeq` | Number    | UInt32        | The [index of the ledger][Ledger Index] that contains the transaction that most recently modified this object. |
| `TicketSequence`    | Number    | UInt32        | The [Sequence Number][] this Ticket sets aside. |

## {{currentpage.name}} ID Format

The ID of a Ticket object is the SHA-512Half of the following values, concatenated in order:

* The Ticket space key (`0x0054`)
* The AccountID of the owner of the Ticket
* The `TicketSequence` number of the Ticket
