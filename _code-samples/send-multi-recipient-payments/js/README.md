# Send Multi-Recipient XRP Payments

This code sample demonstrates how to send XRP payments to multiple recipients
from a single sender account using sequential Payment transactions with
[xrpl.js](https://js.xrpl.org/).

## Background

The XRP Ledger's [Batch amendment (XLS-56)](https://xrpl.org/docs/concepts/transactions/batch-transactions)
enables atomic multi-transaction batches, but is not yet active on Mainnet as
of March 2026. This sample shows the recommended alternative: build individual
Payment transactions with sequential `Sequence` numbers, sign them, and submit
them in order. Each payment settles in ~3–4 seconds, making this practical for
up to dozens of recipients.

## What It Does

1. Connects to the XRP Ledger Testnet.
2. Funds a sender account from the Testnet faucet.
3. Funds multiple recipient accounts from the faucet.
4. Looks up the sender's current `Sequence` number and the latest validated
   ledger index.
5. Builds one `Payment` transaction per recipient, each with:
   - An incremented `Sequence` number.
   - An optional `DestinationTag`.
   - An optional `Memo`.
   - A `LastLedgerSequence` to expire the transaction if not validated promptly.
6. Signs and submits each transaction in order.
7. Verifies that every payment was validated on-ledger.

## How to Run

The sample runs on the **XRP Ledger Testnet** and uses faucet-funded accounts,
so no real XRP is needed.

### Node.js

```bash
npm install xrpl
node send-multi-recipient-payments.js
```

### Browser

Open `demo.html` in a web browser and watch the console output.

## Files

| File | Description |
|------|-------------|
| `send-multi-recipient-payments.js` | Standalone Node.js / browser script |
| `demo.html` | Browser wrapper that loads and runs the script |
| `README.md` | This file |

## Key Concepts

- **Sequential Sequence Numbers**: Each transaction from the same account must
  use the next `Sequence` value. Submitting out of order causes `tefPAST_SEQ`
  or `terPRE_SEQ` errors.
- **LastLedgerSequence**: Prevents transactions from lingering indefinitely.
  Set it to the current validated ledger index plus a buffer (e.g. +20 ledgers
  ≈ 80 seconds).
- **Reliable Transaction Submission**: After submitting, wait for the
  transaction to appear in a validated ledger or for `LastLedgerSequence` to
  pass. See [Reliable Transaction Submission](https://xrpl.org/docs/concepts/transactions/reliable-transaction-submission)
  for details.
- **Destination Tags**: Use `DestinationTag` when sending to an exchange or
  hosted wallet that requires one.

## Upgrading to Batch Transactions

When the `BatchV1_1` amendment activates on Mainnet, you can upgrade to
[Batch Transactions](https://xrpl.org/docs/concepts/transactions/batch-transactions)
for atomic execution of up to 8 payments in a single transaction. The
sequential approach in this sample remains valid for larger recipient lists or
as a fallback.

## License

MIT. See https://github.com/XRPLF/xrpl-dev-portal/blob/master/LICENSE
