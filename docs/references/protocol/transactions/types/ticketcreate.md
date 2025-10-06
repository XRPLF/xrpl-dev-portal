---
seo:
    description: Set aside one or more sequence numbers as tickets.
labels:
    - Transaction Sending
---
# TicketCreate
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/CreateTicket.cpp "Source")

Set aside one or more [sequence numbers][Sequence Number] as [tickets](../../../../concepts/accounts/tickets.md).

{% amendment-disclaimer name="TicketBatch" /%}

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

{% tx-example txid="738AEF36B48CA4A2D85C2B74910DC34DDBBCA4C83643F2DB84A58785ED5AD3E3" /%}

{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}
<!--{# fix md highlighting_ #}-->

| Field            | JSON Type        | [Internal Type][] | Description        |
|:-----------------|:-----------------|:------------------|:-------------------|
| `TicketCount`    | Number           | UInt32            | How many Tickets to create. This must be a positive number and cannot cause the account to own more than 250 Tickets after executing this transaction. |

If the transaction cannot create _all_ of the requested Tickets (either due to the 250-Ticket limit or the [owner reserve](../../../../concepts/accounts/reserves.md)), it fails and creates no Tickets. To look up how many Tickets an account currently owns, use the [account_info method][] and check the `account_data.TicketCount` field.

{% admonition type="success" name="Tip" %}This transaction increases the sending account's [sequence number][Sequence Number] by 1 _plus_ the number of tickets created (`TicketCount`). This is the only transaction that increases an account's sequence number by more than 1.{% /admonition %}

## Error Cases

Besides errors that can occur for all transactions, {% $frontmatter.seo.title %} transactions can result in the following [transaction result codes](../transaction-results/index.md):

| Error Code                | Description                                      |
|:--------------------------|:-------------------------------------------------|
| `temINVALID_COUNT`        | The `TicketCount` field is invalid. It must be an integer from 1 to 250. |
| `tecDIR_FULL`             | This transaction would cause the account to own more than the limit of 250 Tickets at a time, or more than the maximum number of ledger objects in general. |
| `tecINSUFFICIENT_RESERVE` | The sending account does not have enough XRP to meet the [owner reserve](../../../../concepts/accounts/reserves.md) of all the requested Tickets. |

## See Also

- [Ticket entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
