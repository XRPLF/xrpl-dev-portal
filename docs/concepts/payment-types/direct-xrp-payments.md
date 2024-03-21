---
html: direct-xrp-payments.html
parent: payment-types.html
seo:
    title: Direct XRP Payments
    description: Direct XRP payments are the quickest and simplest way to send value on the XRP Ledger. Learn the basics of the direct XRP payment lifecycle now.
labels:
  - XRP
  - Payments
---
# Direct XRP Payments

The basis of any financial system is transferring value. The quickest and simplest method on the XRP Ledger is a direct XRP payment from one account to another. Unlike other payment methods that require multiple transactions to complete, a direct XRP payment executes in one transaction with no intermediaries, and typically completes in 8 seconds or less. You can only make direct payments when XRP is the currency sent and received.



## Direct XRP Payment Lifecycle

1. The sender creates a [Payment transaction][], which defines the parameters of the payment. The transaction is a direct XRP payment if XRP is the currency sent and received.

2. Transaction processing checks the parameters and circumstances of the transaction; if any check fails, the payment fails.

    - All fields are formatted correctly.
    - The sending address is a funded account in the XRP Ledger.
    - All provided signatures are valid for the sending address.
    - The destination address is different than the sending address.
    - The sender has a high enough XRP balance to send the payment.

2. Transaction processing checks the receiving address; if any check fails, the payment fails.

    - If the receiving address is funded, the engine makes additional checks based on their settings, such as [Deposit Authorization](../accounts/depositauth.md).
    - If the receiving address isn't funded, it checks if the payment will deliver enough XRP to meet the minimum [account reserve](../accounts/reserves.md) requirement. If the reserve is met, a new account is created for the address and its starting balance is the amount received.

4. The ledger debits and credits the corresponding accounts.
    
    **Note:** The sender is also debited the XRP [transaction cost](../transactions/transaction-cost.md).
    

## See Also

- **Tutorials:**
    - [Send XRP (Interactive Tutorial)](../../tutorials/how-tos/send-xrp.md)
    - [Monitor Incoming Payments with WebSocket](../../tutorials/http-websocket-apis/build-apps/monitor-incoming-payments-with-websocket.md)
- **References:**
    - [Payment transaction][]
    - [Transaction Results](../../references/protocol/transactions/transaction-results/index.md)
    - [account_info method][] - for checking XRP balances

{% raw-partial file="/docs/_snippets/common-links.md" /%}
