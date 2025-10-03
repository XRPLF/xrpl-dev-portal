---
seo:
    description: A ticket, which sets aside a sequence number for use in a future transaction.
labels:
  - Transaction Sending
---
# Ticket
[[Source]](https://github.com/XRPLF/rippled/blob/f64cf9187affd69650907d0d92e097eb29693945/include/xrpl/protocol/detail/ledger_entries.macro#L124-L130 "Source")

A `Ticket` entry type represents a [Ticket](../../../../concepts/accounts/tickets.md), which tracks an account [sequence number][Sequence Number] that has been set aside for future use. You can create new tickets with a [TicketCreate transaction][].

{% amendment-disclaimer name="TicketBatch" /%}


## Example {% $frontmatter.seo.title %} JSON

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

## {% $frontmatter.seo.title %} Fields

In addition to the [common fields](../common-fields.md), {% code-page-name /%} entries have the following fields:

| Name                | JSON Type            | [Internal Type][] | Required? | Description                |
|:--------------------|:---------------------|:------------------|:----------|:---------------------------|
| `Account`           | String - [Address][] | AccountID         | Yes       | The [account](../../../../concepts/accounts/index.md) that owns this Ticket. |
| `LedgerEntryType`   | String               | UInt16            | Yes       | The value `0x0054`, mapped to the string `Ticket`, indicates that this is a {% $frontmatter.seo.title %} entry. |
| `OwnerNode`         | String - Hexadecimal | UInt64            | Yes       | A hint indicating which page of the owner directory links to this entry, in case the directory consists of multiple pages. |
| `PreviousTxnID`     | String - [Hash][]    | UInt256           | Yes       | The identifying hash of the [transaction](../../../../concepts/transactions/index.md) that most recently modified this entry. |
| `PreviousTxnLgrSeq` | Number               | UInt32            | Yes       | The [index of the ledger][Ledger Index] that contains the transaction that most recently modified this entry. |
| `TicketSequence`    | Number               | UInt32            | Yes       | The [Sequence Number][] this Ticket sets aside. |


## {% $frontmatter.seo.title %} Reserve

{% code-page-name /%} entries count as one item towards the owner reserve of the account that placed the created it, as long as the entry is in the ledger. Using the ticket frees up the reserve.


## {% $frontmatter.seo.title %} Flags

There are no flags defined for {% code-page-name /%} entries.


## {% $frontmatter.seo.title %} ID Format

The ID of a Ticket object is the SHA-512Half of the following values, concatenated in order:

* The Ticket space key (`0x0054`)
* The AccountID of the owner of the Ticket
* The `TicketSequence` number of the Ticket

## See Also

- **Transactions:**
  - [TicketCreate transaction][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
