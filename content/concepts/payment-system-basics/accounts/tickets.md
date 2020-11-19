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

A Ticket in the XRP Ledger is a way of setting aside a [Sequence Number][] for a transaction without sending it right away. Tickets allow transactions to be sent outside of the normal sequence order. One use case for this is to allow for [multi-signed transactions](multi-signing.html) where it may take a while to collect the necessary signatures: while collecting signatures for one transaction that uses a ticket, you can still send and confirm other transactions, including other multi-signed transactions using other tickets.

## Background

The reason accounts have Sequence Numbers in the first place is to be sure that, for any given transaction, it can execute no more than once.

***TODO***

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
