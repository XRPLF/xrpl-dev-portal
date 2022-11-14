# Cross-Currency Payments

In the XRP Ledger, you can send cross-currency payments that exchange tokens, XRP, or both. Like [direct XRP payments](direct-xrp-payments.md), these payments use the `Payment transaction` type. Cross-currency payments within the XRP Ledger are fully atomic, meaning that either the payment fully executes or no part of it executes.

By default, cross-currency payments deliver a fixed amount to their destination at a variable cost to their source. Cross-currency payments can also be [partial payments](partial-payments.md), which deliver a variable amount to the destination within a fixed sending limit.


## Prerequisites

- By definition, a cross-currency payment involves at least two currencies, which means that at least one currency involved must be a non-XRP [token](../../tokens/tokens.md).
- There must be at least one [path](../../tokens/paths.md) between the sender and receiver, and the total liquidity across all paths must be enough to execute the payment. Cross-currency payments convert from one currency to another by consuming offers in the XRP Ledger's decentralized exchange.

<!-- [Offers](offers.html) in the XRP Ledger's [decentralized exchange](decentralized-exchange.html). -->


## Auto-Bridging

Cross-currency payments that exchange one token for another token can automatically use XRP to bridge the tokens, when it decreases the cost of the payment. For example, a payment sending from USD to MXN automatically converts USD to XRP and then XRP to MXN if doing so is cheaper than converting USD to MXN directly. Larger trades can use a combination of direct (USD-MXN) and auto-bridged (USD-XRP-MXN) conversions.

<!--
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
    - [Interpreting Metadata of Cross-Currency Payments](look-up-transaction-results.html#token-payments) -->