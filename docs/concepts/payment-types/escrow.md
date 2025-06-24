---
html: escrow.html
parent: payment-types.html
seo:
    description: Escrow holds funds until specified conditions are met.
labels:
  - Escrow
---
# Escrow

Traditionally, an escrow is a contract between two parties to facilitate financial transactions. An impartial third party receives and holds funds, and only releases them to the intended recipient when conditions specified by the contract are met. This method ensures both parties meet their obligations.

The XRP Ledger takes escrow a step further, replacing the third party with an automated system built into the ledger. An escrow locks up XRP or fungible tokens, which can't be used or destroyed until conditions are met.

## Types of Escrow

The XRP Ledger supports three types of escrow:

- **Time-based Escrow:** Funds only become available after a certain amount of time passes.
- **Conditional Escrow:** This escrow is created with a corresponding condition and fulfillment. The condition serves as a lock on the funds and won't release until the correct fulfillment key is provided.
- **Combination Escrow:** This escrow combines the features of time-based and conditional escrow. The escrow is completely inaccessible until the specified time passes, after which the funds can be release by providing the correct fulfillment.

## Escrow Lifecycle

1. The sender creates an escrow using the `EscrowCreate` transaction. This transaction defines:

    - An number of XRP or fungible tokens to lock up.
    - The conditions to release the XRP or fungible tokens.
    - The recipient of the XRP or fungible tokens.

2. When the transaction is processed, the XRP Ledger creates an `Escrow` object that holds the escrowed XRP or fungible token.

3. The recipient sends an `EscrowFinish` transaction to deliver the XRP or fungible tokens. If the conditions have been met, this destroys the `Escrow` object and delivers the XRP or fungible tokens to the recipient.

    {% admonition type="info" name="Note" %}If the escrow has an expiration time and isn't successfully finished before then, the escrow becomes expired. An expired escrow remains in the ledger until an `EscrowCancel` transaction cancels it, destroying the `Escrow` object and returning the escrowed XRP or fungible tokens to the sender.{% /admonition %}

## Escrow States

The following diagram shows the states an Escrow can progress through:

[![State diagram showing escrows going from Held → Ready/Conditionally Ready → Expired](/docs/img/escrow-states.png)](/docs/img/escrow-states.png)

The diagram shows three different cases for three possible combinations of the escrow's "finish-after" time (`FinishAfter` field), crypto-condition (`Condition` field), and expiration time (`CancelAfter` field):

- **Time-based Escrow (left):** With only a finish-after time, the escrow is created in the **Held** state. After the specified time has passed, it becomes **Ready** and anyone can finish it. If the escrow has an expiration time and no one finishes it before that time passes, then the escrow becomes **Expired**. In the expired state, an escrow cannot be finished, and anyone can cancel it. If the escrow does not have a `CancelAfter` field, it never expires and cannot be canceled.

- **Combination Escrow (center):** If the escrow specifies both a crypto-condition (`Condition` field) _and_ a "finish-after" time (`FinishAfter` field), the escrow is **Held** until its finish-after time has passed. Then it becomes **Conditionally Ready**, and can finish it if they supply the correct fulfillment to the crypto-condition. If the escrow has an expiration time (`CancelAfter` field), and no one finishes it before that time passes, then the escrow becomes **Expired**. In the expired state, an escrow cannot be finished, and anyone can cancel it. If the escrow does not have a `CancelAfter` field, it never expires and cannot be canceled.

- **Conditional Escrow (right):** If the escrow specifies a crypto-condition (`Condition` field) and not a finish-after time, the escrow becomes **Conditionally Ready** immediately when it is created. During this time, anyone can finish the escrow, but only if they supply the correct fulfillment to the crypto-condition. If no one finishes the escrow before its expiration time (`CancelAfter` field), the escrow becomes **Expired**. (An escrow without a finish-after time _must_ have an expiration time.) In the expired state, the escrow can no longer be finished, and anyone can cancel it.


## Limitations

- The costs can make it infeasible for small amounts.
    - Escrow requires two transactions: one to create the escrow, and one to finish or cancel it. Crypto-Conditions incur a higher [transaction cost](../transactions/transaction-cost.md) than usual.
    - While the escrow is incomplete, the sender is responsible for the [reserve requirement](../accounts/reserves.md) of the `Escrow` object.
- You can't create an escrow with past time values.
- Timed releases and expirations resolve according to [ledger close times](../ledgers/ledger-close-times.md). In practice, actual release and expiration times can vary by about five seconds as ledgers close.
- The only supported crypto-condition type is PREIMAGE-SHA-256.


## EscrowFinish Transaction Cost

When using crypto-conditions, the EscrowFinish transaction must pay a [higher transaction cost](../transactions/transaction-cost.md#special-transaction-costs) because of the higher processing load involved in verifying the crypto-condition fulfillment.

The additional transaction cost required is proportional to the size of the fulfillment. If the transaction is [multi-signed](../accounts/multi-signing.md), the cost of multi-signing is added to the cost of the fulfillment.

Currently, an EscrowFinish with a fulfillment requires a minimum transaction cost of **330 [drops of XRP](../../references/protocol/data-types/basic-data-types.md#specifying-currency-amounts)** plus 10 drops per 16 bytes in the size of the fulfillment**.

{% admonition type="info" name="Note" %}The above formula is based on the assumption that the reference cost of a transaction is 10 drops of XRP.{% /admonition %}

If [Fee Voting](../consensus-protocol/fee-voting.md) changes the `reference_fee` value, the formula scales based on the new reference cost. The generalized formula for an EscrowFinish transaction with a fulfillment is as follows:

```
reference_fee * (signer_count + 33 + (fulfillment_bytes / 16))
```



## See Also

For more information about Escrow in the XRP Ledger, see the following:

- [Escrow Tutorials](../../tutorials/how-tos/use-specialized-payment-types/use-escrows/index.md)
- [Transaction Reference](../../references/protocol/transactions/index.md)
    - [EscrowCreate transaction][]
    - [EscrowFinish transaction][]
    - [EscrowCancel transaction][]
- [Ledger Reference](../../references/protocol/ledger-data/index.md)
    - [Escrow object](../../references/protocol/ledger-data/ledger-entry-types/escrow.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
