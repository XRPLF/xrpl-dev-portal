---
html: transaction-formats.html
parent: protocol-reference.html
blurb: Definitions for all the protocol's transaction types and their results.
template: pagetype-category.html.jinja
---
# Transaction Reference

A _Transaction_ is the only way to cause changes in the XRP Ledger. Transactions' outcomes are only final if signed, submitted, and accepted into a validated ledger version following the consensus process. Some ledger rules also generate _pseudo-transactions_, which aren't signed or submitted, but still must be accepted by consensus. Transactions that fail are also included in ledgers because they modify balances of XRP to pay for the anti-spam [transaction cost][]. See [Pseudo Transactions](pseudo-transaction-types.html).


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
