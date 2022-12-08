---
html: escrow.html
parent: payment-types.html
blurb: Escrow holds funds until specified conditions are met.
labels:
  - Escrow
  - Smart Contracts
---
# Escrow

Traditionally, an escrow is a contract between two parties to facilitate risky financial transactions. An impartial third party receives and holds funds, and only releases them to the intended recipient when conditions specified by the contract are met. This method ensures both parties meet their obligations.

The XRP Ledger takes escrow a step further, replacing the third party with an automated system built into the ledger. An escrow locks up XRP, which can't be used or destroyed until conditions are met. You can set an escrow to release:

- When a certain amount of time passes.
- After meeting cryptographic conditions.
- After a combination of both.

## Escrow Lifecycle

1. The sender creates an escrow using the `EscrowCreate` transaction. This transaction defines:

    - An amount of XRP to lock up.
    - The conditions to release the XRP.
    - The recipient of the XRP.

2. When the transaction is processed, the XRP Ledger creates an `Escrow` object that holds the escrowed XRP.

3. The recipient sends an `EscrowFinish` transaction to deliver the XRP. If the conditions have been met, this destroys the `Escrow` object and delivers the XRP to the recipient.

    **Note:** If the escrow has an expiration time and isn't successfully finished before then, the escrow becomes expired. An expired escrow remains in the ledger until an `EscrowCancel` transaction cancels it, destroying the `Escrow` object and returning the XRP to the sender.

## Escrow States

The following diagram shows the states an Escrow can progress through:

[![State diagram showing escrows going from Held → Ready/Conditionally Ready → Expired](img/escrow-states.png)](img/escrow-states.png)

The diagram shows three different cases for three possible combinations of the escrow's "finish-after" time (`FinishAfter` field), crypto-condition (`Condition` field), and expiration time (`CancelAfter` field):

- **Time-based Escrow (left):** With only a finish-after time, the escrow is created in the **Held** state. After the specified time has passed, it becomes **Ready** and anyone can finish it. If the escrow has an expiration time and no one finishes it before that time passes, then the escrow becomes **Expired**. In the expired state, an escrow cannot be finished, and anyone can cancel it. If the escrow does not have a `CancelAfter` field, it never expires and cannot be canceled.

- **Combination Escrow (center):** If the escrow specifies both a crypto-condition (`Condition` field) _and_ a "finish-after" time (`FinishAfter` field), the escrow is **Held** until its finish-after time has passed. Then it becomes **Conditionally Ready**, and can finish it if they supply the correct fulfillment to the crypto-condition. If the escrow has an expiration time (`CancelAfter` field), and no one finishes it before that time passes, then the escrow becomes **Expired**. In the expired state, an escrow cannot be finished, and anyone can cancel it. If the escrow does not have a `CancelAfter` field, it never expires and cannot be canceled.

- **Conditional Escrow (right):** If the escrow specifies a crypto-condition (`Condition` field) and not a finish-after time, the escrow becomes **Conditionally Ready** immediately when it is created. During this time, anyone can finish the escrow, but only if they supply the correct fulfillment to the crypto-condition. If no one finishes the escrow before its expiration time (`CancelAfter` field), the escrow becomes **Expired**. (An escrow without a finish-after time _must_ have an expiration time.) In the expired state, the escrow can no longer be finished, and anyone can cancel it.


## Limitations

- Escrow only works with XRP, not tokens.
- The costs can make it infeasible for small amounts.
    - Escrow requires two transactions: one to create the escrow, and one to finish or cancel it. Crypto-Conditions incur a higher [transaction cost](transaction-cost.html) than usual.
    - While the escrow is incomplete, the sender is responsible for the [reserve requirement](reserves.html) of the `Escrow` object.
- You can't create an escrow with past time values.
- Timed releases and expirations resolve according to [ledger close times](ledgers.html#ledger-close-times). In practice, actual release and expiration times can vary by about five seconds as ledgers close.
- The only supported [crypto-condition][] type is PREIMAGE-SHA-256.


## EscrowFinish Transaction Cost

When using [crypto-conditions][], the EscrowFinish transaction must pay a [higher transaction cost](transaction-cost.html#special-transaction-costs) because of the higher processing load involved in verifying the crypto-condition fulfillment.

If the escrow is purely time-locked with no crypto-condition, the EscrowFinish costs only the standard [transaction cost](transaction-cost.html) for a reference transaction.

The additional transaction cost required is proportional to the size of the fulfillment. Currently, an EscrowFinish with a fulfillment requires a minimum transaction cost of **330 [drops of XRP](basic-data-types.html#specifying-currency-amounts) plus 10 drops per 16 bytes in the size of the fulfillment**. If the transaction is [multi-signed](multi-signing.html), the cost of multi-signing is added to the cost of the fulfillment.

**Note:** The above formula is based on the assumption that the reference cost of a transaction is 10 drops of XRP.

If [Fee Voting](fee-voting.html) changes the `reference_fee` value, the formula scales based on the new reference cost. The generalized formula for an EscrowFinish transaction with a fulfillment is as follows:

```
reference_fee * (signer_count + 33 + (fulfillment_bytes / 16))
```


## Why Escrow?

The age-old practice of [Escrow](https://en.wikipedia.org/wiki/Escrow) enables many kinds of financial transactions that would be considered risky otherwise, especially online. By letting a trusted third party hold the money while a transaction or evaluation period is underway, both sides can be assured that the other must hold up their end of the bargain.

The Escrow feature takes this idea further by replacing the third party with an automated system built into the XRP Ledger, so that the lock up and release of funds is impartial and can be automated.

Fully automated escrow, backed by the integrity of the XRP Ledger itself, solves important problems for Ripple, and we think there are many other use cases that escrow enables. Ripple encourages the industry to find new and unique ways to put escrow to use.

### Use Case: Time-based Lock-Up

**Background:** Ripple holds a large amount of the total XRP, which it sells methodically as a way to fund and incentivize the healthy development of the XRP Ledger and related technologies. At the same time, owning such a large chunk of XRP causes problems for the company, such as:

- Individuals and businesses who use the XRP Ledger worry that their investments in XRP could be diluted or devalued if Ripple were to flood the market by selling at a higher rate than usual.
    - Although flooding the market would be a long-term loss for Ripple, the possibility that the company could do so exerts downward pressure over the price of XRP, and thus decreases the value of the company's assets.
- Ripple must carefully manage ownership of its accounts to protect against digital theft and other forms of malicious behavior, even by insiders.

**Solution:** By placing 55 billion XRP into time-based escrows, Ripple ensures that the supply of XRP in circulation is predictable and increases at a slow but steady rate. Others who hold XRP know that Ripple cannot flood the market, even if the company's priorities or strategy changes.

Placing the money into escrow does not directly protect Ripple's holdings from malicious actors, but it sharply reduces the amount of XRP that can be quickly stolen or redirected if a malicious actor gains temporary control over Ripple's XRP accounts. This reduces the risk of catastrophic losses of XRP and increases the time for Ripple to detect, prevent, and track down unintended uses of Ripple's XRP assets.

### Use Case: Interledger Payments

**Background:** In the quickly-developing world of financial technology, one of the core challenges is coordinating activities that cross multiple digital money systems, or ledgers. Many proposed solutions to this problem (including early views of the XRP Ledger!) can be reduced to creating "one ledger to rule them all." Ripple believes no single system can meet the needs of everyone in the world: in fact, some desirable features are mutually exclusive. Instead, Ripple believes that an interconnected network of ledgers—an _interledger_—is the true future of financial technology. The [Interledger Protocol][] defines standards for making as many systems as possible connect securely and smoothly.

The most fundamental principle of inter-ledger payments is _conditional transfers_. Multi-hop payments have a risk problem: the more hops in the middle, the more places the payment can fail. Interledger solves this with the financial equivalent of a "[two-phase commit](https://en.wikipedia.org/wiki/Two-phase_commit_protocol)", where the two steps are (1) prepare conditional transfers, then (2) fulfill the conditions to execute the transfers. The Interledger project defined a [crypto-conditions][] specification to standardize automated ways to define and verify conditions, and settled on SHA-256 hashes as a "common denominator" of such conditions.

**Solution:** The Escrow feature makes the XRP Ledger ideal for bridging multi-hop payments using the Interledger Protocol, because it natively supports transfers that deliver XRP based on PREIMAGE-SHA-256 crypto-conditions, and it executes those transfers within seconds of being presented with the matching fulfillment.


## See Also

For more information about Escrow in the XRP Ledger, see the following:

- [Escrow Tutorials](use-escrows.html)
    - [Send a Time-Held Escrow](send-a-time-held-escrow.html)
    - [Send a conditionally-held escrow](send-a-conditionally-held-escrow.html)
    - [Look up escrows by sender or receiver](look-up-escrows.html)
- [Transaction Reference](transaction-formats.html)
    - [EscrowCreate transaction][]
    - [EscrowFinish transaction][]
    - [EscrowCancel transaction][]
- [Ledger Reference](ledger-data-formats.html)
    - [Escrow object](escrow-object.html)

For more information on Interledger and how conditional transfers enable secure payments across multiple ledgers, see [Interledger Architecture](https://interledger.org/rfcs/0001-interledger-architecture/).

For more information on Ripple's 55-billion XRP lock-up, see [Ripple's Insights Blog](https://ripple.com/insights/ripple-to-place-55-billion-xrp-in-escrow-to-ensure-certainty-into-total-xrp-supply/).

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
