---
html: escrow.html
parent: payments.html
blurb: Escrow holds funds and deliver them when specified conditions are met.
labels:
  - Transactions
---
# Escrow

A traditional escrow is a contract between two parties to facilitate financial transactions. A sender delivers funds to an impartial third party to hold, guaranteeing its availability to a recipient. The third party only releases the funds to the recipient when conditions specified by the contract are met. This method ensures both parties meet their obligations.

The XRP Ledger takes escrow a step further, removing the need for a third party to hold the funds. Instead, an escrow locks up XRP on the ledger itself, which can't be used or destroyed until conditions are met.

Learn about [Escrow](escrow-uc.html) use cases.

---

## Types of Escrow

The XRP Ledger supports three types of escrow:

- **Time-based Escrow:** Escrow funds only become available after a certain amount of time passes.
- **Conditional Escrow:** This escrow is created with a corresponding condition and fulfillment. The condition serves as a lock on the funds and won't release until the correct fulfillment key is provided.
- **Combination Escrow:** This escrow combines the features of time-based and conditional escrow. The escrow is completely inaccessible until the specified time passes, after which the funds can be release by providing the correct fulfillment.

## Escrow Lifecycle

1. The sender creates an escrow using the `EscrowCreate` transaction to define:

    - An amount of XRP to lock up.
    - The conditions to release the XRP.
    - The recipient of the XRP.

2. After the transaction is processed, the XRP Ledger creates an `Escrow` object that holds the escrowed XRP.

3. When the escrow conditions are met, the funds become available.

4. The recipient sends an `EscrowFinish` transaction to actually deliver the XRP. The `Escrow` object is destroyed and the XRP credited to the recipient.
    
    **Note:** If the escrow has an expiration time and isn't successfully finished before then, the escrow becomes expired. Expired escrows remain in the ledger until an `EscrowCancel` transaction cancels it, destroying the `Escrow` object and returning the XRP to the sender.

***TODO: Are these official escrow statuses you can look up in the XRPL?***
## Escrow States

The following diagram shows the states an Escrow can progress through:

[![State diagram showing escrows going from Held → Ready/Conditionally Ready → Expired](../../../../img/escrow-states.png)](../../../../img/escrow-states.png)

The diagram shows three different cases for three possible combinations of the escrow's "finish-after" time (`FinishAfter` field), crypto-condition (`Condition` field), and expiration time (`CancelAfter` field):

- **Time-based Escrow (left):** With only a finish-after time, the escrow is created in the **Held** state. After the specified time has passed, it becomes **Ready** and anyone can finish it. If the escrow has an expiration time and no one finishes it before that time passes, then the escrow becomes **Expired**. In the expired state, an escrow cannot be finished, and anyone can cancel it. If the escrow does not have a `CancelAfter` field, it never expires and cannot be canceled.

- **Combination Escrow (center):** If the escrow specifies both a crypto-condition (`Condition` field) _and_ a "finish-after" time (`FinishAfter` field), the escrow is **Held** until its finish-after time has passed. Then it becomes **Conditionally Ready**, and can finish it if they supply the correct fulfillment to the crypto-condition. If the escrow has an expiration time (`CancelAfter` field), and no one finishes it before that time passes, then the escrow becomes **Expired**. In the expired state, an escrow cannot be finished, and anyone can cancel it. If the escrow does not have a `CancelAfter` field, it never expires and cannot be canceled.

- **Conditional Escrow (right):** If the escrow specifies a crypto-condition (`Condition` field) and not a finish-after time, the escrow becomes **Conditionally Ready** immediately when it is created. During this time, anyone can finish the escrow, but only if they supply the correct fulfillment to the crypto-condition. If no one finishes the escrow before its expiration time (`CancelAfter` field), the escrow becomes **Expired**. (An escrow without a finish-after time _must_ have an expiration time.) In the expired state, the escrow can no longer be finished, and anyone can cancel it.

## Limitations

- Escrow only works with XRP, not tokens.
- The transaction costs can make it infeasible for small amounts.
    - Escrow requires at least two transactions: one to create the escrow and one to finish or cancel it. Both parties must pay the cost of each transaction.
    - Crypto-Conditions incur a higher transaction cost than usual.
- You can't create an escrow with past time values.
- Timed releases and expirations resolve according to XRP Ledger close times. In practice, actual release and expiration times can vary by about five seconds as ledgers close.
- The only supported crypto condition type is PREIMAGE-SHA-256.

## See Also

- **Tutorials:**
    - [Use Escrows](use-escrows.html)
