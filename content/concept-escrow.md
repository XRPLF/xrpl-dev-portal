# Escrow

Escrow is a feature of the XRP Ledger that provides held payments, called _escrows_, that set aside XRP and deliver it later when certain conditions are met. Conditions to successfully finish an escrow include time-based unlocks and [crypto-conditions](https://tools.ietf.org/html/draft-thomas-crypto-conditions-03); escrows can also be set to expire if not finished in time. Conditional held payments are a key feature for full [Interledger Protocol](https://interledger.org/) support, which enables chains of payments to cross any number of ledgers.

The XRP set aside in an escrow is locked up. No one can use or destroy the XRP until the escrow has been successfully finished or canceled. Before the expiration time, only the intended receiver can get the XRP

## Limitations

Escrow is designed as a feature to enable XRP Ledger to be used in the Interledger Protocol and with other smart contracts. The current version has a modest scope to avoid unneeded complexity.

- Escrow only works with XRP, not issued currencies.
- Escrow requires sending at least two transactions: one to create the escrow, and one to finish or cancel it.
- All escrows must have a "finish-after" time, an expiration time, or both. Neither time can be in the past when the transaction to create the escrow executes.
