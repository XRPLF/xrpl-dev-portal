---
html: ticketcreate.html
parent: transaction-types.html
seo:
    description: Set aside one or more sequence numbers as Tickets.
labels:
  - Transaction Sending
---
# TicketCreate

[[Source]](https://github.com/XRPLF/rippled/blob/develop/src/ripple/app/tx/impl/CreateTicket.cpp "Source")

_(Added by the [TicketBatch amendment][].)_

A TicketCreate transaction sets aside one or more [sequence numbers][Sequence Number] as [Tickets](../../../../concepts/accounts/tickets.md).

## Example {% $frontmatter.seo.title %} JSON

```json
{
    "TransactionType": "TicketCreate",
    "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "Fee": "10",
    "Sequence": 381,
    "TicketCount": 10
}
```

[Query example transaction. >](/resources/dev-tools/websocket-api-tool?server=wss%3A%2F%2Fs1.ripple.com%2F&req=%7B%22id%22%3A%22example_TicketCreate%22%2C%22command%22%3A%22tx%22%2C%22transaction%22%3A%22738AEF36B48CA4A2D85C2B74910DC34DDBBCA4C83643F2DB84A58785ED5AD3E3%22%2C%22binary%22%3Afalse%7D)

{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}
<!--{# fix md highlighting_ #}-->

| Field            | JSON Type        | [Internal Type][] | Description        |
|:-----------------|:-----------------|:------------------|:-------------------|
| `TicketCount`    | Number           | UInt32            | How many Tickets to create. This must be a positive number and cannot cause the account to own more than 250 Tickets after executing this transaction. |

If the transaction cannot create _all_ of the requested Tickets (either due to the 250-Ticket limit or the [owner reserve](../../../../concepts/accounts/reserves.md)), it fails and creates no Tickets. To look up how many Tickets an account currently owns, use the [account_info method][] and check the `account_data.TicketCount` field.

**Tip:** This transaction increases the sending account's [sequence number][Sequence Number] by 1 _plus_ the number of tickets created (`TicketCount`). This is the only transaction that increases an account's sequence number by more than 1.

## Error Cases

Besides errors that can occur for all transactions, {% $frontmatter.seo.title %} transactions can result in the following [transaction result codes](../transaction-results/index.md):

| Error Code                | Description                                      |
|:--------------------------|:-------------------------------------------------|
| `temINVALID_COUNT`        | The `TicketCount` field is invalid. It must be an integer from 1 to 250. |
| `tecDIR_FULL`             | This transaction would cause the account to own more than the limit of 250 Tickets at a time, or more than the maximum number of ledger objects in general. |
| `tecINSUFFICIENT_RESERVE` | The sending account does not have enough XRP to meet the [owner reserve](../../../../concepts/accounts/reserves.md) of all the requested Tickets. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
