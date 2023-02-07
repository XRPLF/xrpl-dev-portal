# Send Partial Payments

Send partial payments with money amount less than the amount specified on 2 conditions:

- Sender has less money than the aamount specified in the payment Tx.
- Sender has the tfPartialPayment flag activated.

Other ways to specify flags are by using Hex code and decimal code.
eg. For partial payment(tfPartialPayment)
decimal ->131072, hex -> 0x00020000

For more context, see [Partial Payments](https://xrpl.org/partial-payments.html)
