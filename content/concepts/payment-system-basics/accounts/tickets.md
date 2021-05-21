---
html: tickets.html
parent: accounts.html
blurb: Send transactions in non-sequential order.
status: not_enabled
---
# Tickets

_(Requires the [TicketBatch amendment][] :not_enabled:)_

A Ticket in the XRP Ledger is a way of setting aside a [sequence number][Sequence Number] for a transaction without sending it right away. Tickets allow transactions to be sent outside of the normal sequence order. One use case for this is to allow for [multi-signed transactions](multi-signing.html) where it may take a while to collect the necessary signatures: while collecting signatures for a transaction that uses a Ticket, you can still send other transactions.

## Background

[Transactions](transaction-basics.html) have sequence numbers so that any given transaction can execute no more than once. Sequence numbers also make sure any given transaction is unique: if you send the exact same amount of money to the same person multiple times, the Sequence Number is one detail that is guaranteed to be different each time. Finally, Sequence Numbers provide an elegant way to put transactions in a consistent order, even if some of them to arrive out of order when sent throughout the network.

However, there are some situations where sequence numbers are too limiting. For example:

- Two or more users share access to an account, each with the ability to send transactions independently. If these users try to send transactions around the same time without coordinating first, they may each try to use the same Sequence number for different transactions, and only one can succeed.
- You may want to prepare and sign a transaction in advance, then save it in some secure storage so that it can be executed at any future point if certain events occur. However, if you want to continue using your account as normal in the meantime, you don't know what Sequence number the set-aside transaction will need.
- When [multiple people must sign a transaction](multi-signing.html) to make it valid, it can be difficult to plan more than one transaction at a time. If you number the transactions with separate sequence numbers, you can't send the later-numbered transactions until everyone has signed the previous transactions; but if you use the same sequence number for each pending transactions, only one of them can succeed.

Tickets provide a solution to all of these problems by setting aside sequence numbers that can be used later, outside of their usual order, but still no more than once each.


## Tickets Are Reserved Sequence Numbers

A Ticket is a record that a sequence number has been set aside to be used later. An account first sends a [TicketCreate transaction][] to set aside one or more sequence numbers as Tickets; this puts a record in the [ledger's state data](ledgers.html), in the form of a [Ticket object][], for each sequence number reserved.

Tickets are numbered using the sequence numbers that were set aside to create them. For example, if your account's current sequence number is 101 and you create 3 Tickets, those Tickets have Ticket Sequence numbers 102, 103, and 104. Doing so increases your account's sequence number to 105.

{{ include_svg("img/ticket-creation.svg", "Diagram: Creating three Tickets") }}

Later, you can send a transaction using a specific Ticket instead of a sequence number; doing so removes the corresponding Ticket from the ledger's state data and does not change your account's normal sequence number. You can also still send transactions using normal sequence numbers without using Tickets. You can use any of your available Tickets in any order at any time, but each Ticket can only be used once.

{{ include_svg("img/ticket-usage.svg", "Diagram: Using Ticket 103.") }}

Continuing the above example, you can send a transaction using sequence number 105 or any of the three Tickets you created. If you send a transaction using Ticket 103, doing so deletes Ticket 103 from the ledger. Your next transaction after that can use sequence number 105, Ticket 102, or Ticket 104.

**Caution:** Each Ticket counts as a separate item for the [owner reserve](reserves.html), so you must set aside 5 XRP for each Ticket. (The XRP becomes available again after you use the Ticket.) This cost can add up quickly if you create a large number of Tickets at once.

As with sequence numbers, sending a transaction uses up the Ticket _if and only if_ the transaction is confirmed by [consensus](consensus.html). However, transactions that fail to do what they were intended to do can still be confirmed by consensus with [`tec`-class result codes](tec-codes.html).

To look up what Tickets an account has available, use the [account_objects method][].

## Limitations

Any account can create and use Tickets on any type of transaction. However, some restrictions apply:

- Each Ticket can only be used once. It is possible to have multiple different candidate transactions that would use the same Ticket Sequence, but only one of those candidates can be validated by consensus.
- Each account cannot have more than 250 Tickets in the ledger at a time. Therefore, you cannot create more than 250 Tickets at a time, either.
- You _can_ use a Ticket to create more Tickets. If you do, the Ticket you used does not count towards the total number of Tickets you can have at once.
- Each Ticket counts toward the [owner reserve](reserves.html), so you must set aside 5 XRP for each Ticket you have not used yet. The XRP becomes available for you to use again after the Ticket is used.
- Within an individual ledger, transactions that use Tickets execute after other transactions from the same sender. If an account has multiple transactions using Tickets in the same ledger version, those Tickets execute in order from lowest Ticket Sequence to highest. (For more information, see the documentation on consensus's [canonical order](consensus.html#calculate-and-share-validations).)
- To "cancel" a Ticket, use the Ticket to [perform a no-op](about-canceling-a-transaction.html) [AccountSet transaction][]. This deletes the Ticket so that you don't have to meet its reserve requirement.

## See Also

<!-- TODO: add a tutorial for creating & using a Ticket -->

- **Concepts:**
    - [Multi-Signing](multi-signing.html)
- **References:**
    - [TicketCreate transaction][]
    - [Transaction Common Fields](transaction-common-fields.html)
    - [Ticket object](ticket.html)
    - [account_objects method][]

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
