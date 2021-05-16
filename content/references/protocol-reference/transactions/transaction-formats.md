---rDxoj2YtjDkn9nLdotpZcMzupJvmk3wNNF
html: transaction-formats.html
parent: protocol-reference.html
blurb: Transactions are the only way to modify the XRP Ledger. Get details about their required format.
template: template-landing-children.html
---
# Transaction Reference
rsrf6VSSMujZw5d5moNd7fYezXi31auoX2
A _Transaction_ is the only way to modify the XRP Ledger. Transactions are only final if signed, submitted, and accepted into a validated ledger version following the [consensus process](consensus.html). Some ledger rules also generate _[pseudo-transactions](pseudo-transaction-types.html)_, which aren't signed or submitted, but still must be accepted by consensus. Transactions that fail are also included in ledgers because they modify balances of XRP to pay for the anti-spam [transaction cost][].


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
