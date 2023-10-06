---
html: cross-currency-payments.html
parent: payment-types.html
blurb: Cross-currency payments atomically deliver a different currency than they send by converting through paths and order books.
labels:
  - Cross-Currency
  - Payments
---
# Cross-Currency Payments

The XRP Ledger enables you to make cross-currency payments of XRP and tokens. Cross-currency payments within the XRP Ledger are fully atomic, meaning the payment fully executes or no part of the payment executes at all.

By default, cross-currency payments deliver a fixed amount to their destination at a variable cost to their source. Cross-currency payments can also be [partial payments](partial-payments.html) that deliver a variable amount within a set sending limit.


## Prerequisites

- By definition, a cross-currency payment involves at least two currencies, which means that at least one currency involved must be a non-XRP [token](tokens.html).
- There must be at least one [Path](paths.html) between the sender and receiver, and the total liquidity across all paths must be enough to execute the payment. Cross-currency payments convert from one currency to another by consuming [Offers](offers.html) in the XRP Ledger's [decentralized exchange](decentralized-exchange.html).


## Auto-Bridging

Cross-currency payments that exchange one token for another token can automatically use XRP to bridge the tokens, when it decreases the cost of the payment. For example, a payment sending from USD to MXN automatically converts USD to XRP and then XRP to MXN if doing so is cheaper than converting USD to MXN directly. Larger trades can use a combination of direct (USD-MXN) and auto-bridged (USD-XRP-MXN) conversions.

For more information, see [Auto-Bridging](autobridging.html).


## See Also

- **Concepts:**
    - [Tokens](tokens.html)
    - [Decentralized Exchange](decentralized-exchange.html)
    - [Paths](paths.html)
- **References:**
    - [Payment transaction type][Payment transaction]
    - [path_find method][]
    - [ripple_path_find method][]
    - [Interpreting Metadata of Cross-Currency Payments](look-up-transaction-results.html#token-payments)

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
