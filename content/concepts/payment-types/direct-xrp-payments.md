---
html: direct-xrp-payments.html
parent: payment-types.html
blurb: Direct XRP payments are the simplest way to send value in the XRP Ledger.
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

    - If the receiving address is funded, the engine makes additional checks based on their settings, such as [Deposit Authorization](depositauth.html).
    - If the receiving address isn't funded, it checks if the payment will deliver enough XRP to meet the minimum [account reserve](reserves.html) requirement. If the reserve is met, a new account is created for the address and its starting balance is the amount received.

4. The ledger debits and credits the corresponding accounts.
    
    **Note:** The sender is also debited the XRP [transaction cost](transaction-cost.html).
    

## See Also

- **Tutorials:**
    - [Send XRP (Interactive Tutorial)](send-xrp.html)
    - [Monitor Incoming Payments with WebSocket](monitor-incoming-payments-with-websocket.html)
- **References:**
    - [Payment transaction][]
    - [Transaction Results](transaction-results.html)
    - [account_info method][] - for checking XRP balances


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
