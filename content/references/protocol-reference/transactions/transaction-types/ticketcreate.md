---
html: ticketcreate.html
parent: transaction-types.html
blurb: Set aside one or more sequence numbers as Tickets.
status: not_enabled
---
# TicketCreate

[[Source]](https://github.com/ripple/rippled/blob/develop/src/ripple/app/tx/impl/CreateTicket.cpp "Source")

_(Requires the [TicketBatch amendment][] :not_enabled:)_

A TicketCreate transaction sets aside one or more [sequence numbers][Sequence Number] as [Tickets](tickets.html).

## Example {{currentpage.name}} JSON

```json
{
    "TransactionType": "TicketCreate",
    "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "Fee": "10",
    "Sequence": 381,
    "TicketCount": 10
}
```

{% include '_snippets/tx-fields-intro.md' %}
<!--{# fix md highlighting_ #}-->

| Field            | JSON Type        | [Internal Type][] | Description        |
|:-----------------|:-----------------|:------------------|:-------------------|
| `TicketCount`    | Number           | UInt32            | How many Tickets to create. This must be a positive number and cannot cause the account to own more than 250 Tickets after executing this transaction. |

If the transaction cannot create _all_ of the requested Tickets (either due to the 250-Ticket limit or the [owner reserve](reserves.html)), it fails and creates no Tickets. To look up how many Tickets an account currently owns, use the [account_info method][] and check the `account_data.TicketCount` field.

**Tip:** This transaction increases the sending account's [sequence number][Sequence Number] by 1 _plus_ the number of tickets created (`TicketCount`). This is the only transaction that increases an account's sequence number by more than 1.

## Error Cases

In addition to errors that can occur for all transactions, {{currentpage.name}} transactions can result in the following [transaction result codes](transaction-results.html):

| Error Code                | Description                                      |
|:--------------------------|:-------------------------------------------------|
| `temINVALID_COUNT`        | The `TicketCount` field is invalid. It must be an integer from 1 to 250. |
| `tecDIR_FULL`             | This transaction would cause the account to own more than the limit of 250 Tickets at a time, or more than the maximum number of ledger objects in general. |
| `tecINSUFFICIENT_RESERVE` | The sending account does not have enough XRP to meet the [owner reserve](reserves.html) of all the requested Tickets. |

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
