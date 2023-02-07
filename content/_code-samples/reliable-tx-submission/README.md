# Implement Reliable Transaction Submission

Send a transaction and see its validation response. For the implementation in this example, we have made the following decisions:

- We allow the autofill function as a part of submitAndWait to fill up the account sequence, LastLedgerSequence and Fee. Payments are defined upfront, and idempotency is not needed. If the script is run a second time, duplicate payments will result.
- We will rely on the submitAndWait function to get us the transaction submission result after the wait time.
- Transactions will not be automatically retried. Transactions are limited to XRP-to-XRP payments and cannot "succeed" in an unexpected way.

For more context, see [Reliable Transaction Submission](https://xrpl.org/reliable-transaction-submission.html)
