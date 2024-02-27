---
html: transaction-formats.html
parent: protocol-reference.html
seo:
    description: Definitions for all the protocol's transaction types and their results.
metadata:
  indexPage: true
---
# Transaction Reference

A _Transaction_ is the only way to cause changes in the XRP Ledger. Transactions' outcomes are only [final](../../../concepts/transactions/finality-of-results/index.md) if signed, submitted, and accepted into a validated ledger version following the [consensus process](../../../concepts/consensus-protocol/index.md). Some ledger rules also generate _[pseudo-transactions](pseudo-transaction-types/pseudo-transaction-types.md)_, which aren't signed or submitted, but still must be accepted by consensus. Transactions that fail are also included in ledgers because they modify balances of XRP to pay for the anti-spam [transaction cost][].

{% raw-partial file="/docs/_snippets/common-links.md" /%}


{% child-pages /%}
