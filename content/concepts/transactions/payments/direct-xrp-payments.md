---
html: direct-xrp-payments.html
parent: payments.html
blurb: Direct XRP payments are the quintessential type of payment for the XRPL.
labels:
  - Transactions
---
# Direct XRP Payments

The basis of any financial system is transferring value. The quickest and simplest method on the XRP Ledger are direct XRP payments from one account to another. Unlike other payment methods that require multiple transactions to complete, direct XRP payments require only one and can complete in 8 seconds or less.

**Note:** You can only make direct payments when XRP is the currency sent and received.

Learn about [Direct XRP Payments](direct-xrp-payments-uc.html) use cases.

---

## Direct XRP Payment Lifecycle

1. The sender creates a `Payment` transaction to define the parameters of the payment. The ledger detects the transaction as a direct XRP payment if XRP is the currency sent and received.

2. The ledger validate the parameters of the `Payment` transaction; the payment fails if it doesn't pass any checks. Validation checks include:

    - Checking that all fields are formatted correctly.
    - Checking that the sending address is a funded account in the XRP Ledger.
    - Checking that all provided signatures are valid for the sending address.
    - Confirming that the destination address is different than the sender address.
    - Confirming that the sender has a high enough XRP balance to send the payment.

3. The ledger checks the receiving address; the payment fails if it doesn't pass any checks.

    - If the receiving address is funded, the engine makes additional checks for receiving payments, such as deposit authorization or source and destination tags.
    - If the receiving address isn't funded, it checks if the payment will deliver enough XRP to meet the minimum account reserve requirement. If the reserve is met, a new account is created for the address and its starting balance is the amount received.

4. The ledger debits and credits the corresponding accounts.
    
    **Note:** The sender is also debited the XRP transaction fee.
    
<!--
## See Also

- **Concepts:**
    - [Payment System Basics](payment-system-basics.html)
- **Tutorials:**
    - [Send XRP (Interactive Tutorial)](send-xrp.html)
    - [Monitor Incoming Payments with WebSocket](monitor-incoming-payments-with-websocket.html)
- **References:**
    - [Payment transaction][]
    - [Transaction Results](transaction-results.html)
    - [account_info method][] - for checking XRP balances
-->