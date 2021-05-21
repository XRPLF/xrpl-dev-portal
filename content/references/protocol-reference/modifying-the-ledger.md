---
html: modifying-the-ledger.html
parent: protocol-reference.html
blurb: Why and how only transactions can modify the ledger.
---
# Modifying the Ledger

All changes to the XRP Ledger happen as the result of [transactions](transaction-formats.html), and all changes apply permanently _only_ if the transactions are approved by the [consensus process](consensus.html). No matter what interface you use to access the XRP Ledger, no API method ever change the contents of the XRP Ledger, except by submitting a transaction.

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
