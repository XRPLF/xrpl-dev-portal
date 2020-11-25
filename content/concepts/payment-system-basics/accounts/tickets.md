---
html: reserves.html
funnel: Build
doc_type: Concepts
category: Payment System Basics
subcategory: Accounts
blurb: Send transactions in non-sequential order.
status: not_enabled
---
# Tickets

_(Requires the [TicketBatch amendment][] :not_enabled:)_

A Ticket in the XRP Ledger is a way of setting aside a [sequence number][Sequence Number] for a transaction without sending it right away. Tickets allow transactions to be sent outside of the normal sequence order. One use case for this is to allow for [multi-signed transactions](multi-signing.html) where it may take a while to collect the necessary signatures: while collecting signatures for a transaction that uses a Ticket, you can still send other transactions.

## Background

[Transactions](transaction-basics.html) have sequence numbers so that any given transaction can execute no more than once. Sequence numbers also make sure any given transaction is unique: if you send the exact same amount of money to the same person multiple times, the Sequence Number is one detail that is guaranteed to be different each time. Finally, Sequence Numbers provide an elegant way to put transactions in a consistent order, even if some of them to arrive out of order when sent throughout the network.

However, there are some situations where sequence numbers are too limiting. Some possible situations include:

- Two or more users share access to an account, each with the ability to send transactions independently. If these users try to send transactions around the same time without coordinating first, they may each try to use the same Sequence number for different transactions, and only one can succeed.
- You may want to prepare and sign a transaction in advance, then save it in some secure storage so that it can be executed at any future point if certain events occur. However, if you want to continue using your account as normal in the meantime, you don't know what Sequence number the set-aside transaction will need.
- When [multiple people must sign a transaction](multi-signing.html) to make it valid, it can be difficult to plan more than one transaction at a time. If you number the transactions with separate sequence numbers, you can't send the later-numbered transactions until everyone has signed the previous transactions; but if you use the same sequence number for each pending transactions, only one of them can succeed.

Tickets provide a solution to all of these problems by setting aside sequence numbers that can be used later, outside of their usual order, but still no more than once each.


## Tickets Are Reserved Sequence Numbers

A Ticket is a record that a sequence number has been set aside to be used later. An account first sends a [TicketCreate transaction][] to set aside one or more sequence numbers as Tickets; this puts a record in the ledger's state data, in the form of a [Ticket object][], for each sequence number reserved. Later, the account can use a specific Ticket instead of a sequence number; doing so removes the corresponding Ticket from the ledger's state data.

Tickets are numbered using the sequence numbers that were set aside to create them. For example, if your account's current sequence number is 101 and you create 3 Tickets, those Tickets have Ticket Sequence numbers 101, 102, and 103. Doing so increases your account's sequence number to 104. After this point, you can send a transaction normally using sequence number 104, or you can send a transaction using any of the three Tickets you just created. Suppose you send a transaction using Ticket 102; doing so deletes Ticket 102 from the ledger. Your next transaction after that can use sequence number 104, Ticket 101, or Ticket 103.

**Tip:** When you create Tickets, your account's sequence number increases by the number of Tickets you created. When you use a Ticket, your account's sequence number does not change, but the ledger deletes the Ticket you used.

As with sequence numbers, sending a transaction uses up the Ticket _if and only if_ the transaction is confirmed by [consensus](consensus.html). However, transactions that fail to do what they were intended to do can still be confirmed by consensus with [`tec`-class result codes](tec-codes.html).

***TODO: diagram depicting creating and using Tickets***



<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
