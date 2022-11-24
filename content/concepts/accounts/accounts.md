---
html: accounts.html
parent: concepts.html
blurb: The XRP Ledger is a blockchain that records transactions of XRP and other tokens between accounts.
labels:
  - Accounts
---
# Accounts

An "Account" in the XRP Ledger represents a holder of XRP and a sender of transactions.

An account consists of an address, an XRP balance, a sequence number, and a history of its transactions. (See [Account Structure](account-structure.html)) for details.

## Creating Accounts

There is not a dedicated "create account" transaction. The `Payment` transaction automatically creates a new account if a payment sends XRP equal to or greater than the account reserve to a mathematically valid address that does not already have an account. This is called _funding_ an account, and creates an AccountRoot object in the ledger. No other transaction can create an account.

The typical way to get an account in the XRP Ledger is as follows:

1. Generate a key pair from a strong source of randomness and calculate the address of that key pair. (For example, you can use the `wallet_propose` method to do this.)

2. Have someone who already has an account in the XRP Ledger send XRP to the address you generate. For example, you can buy XRP in a private exchange, then withdraw XRP from the exchange to the address you specify.
        
**Caution:** Funding an account _does not_ give you any special privileges over that account. Whoever has the secret key corresponding to the account's address has full control over the account and all XRP it contains. For some addresses, it is possible that no one has the secret key, in which case the account is a black hole and the XRP is lost forever.

**Caution:** The first time you receive XRP at your own XRP Ledger address, you must pay the account reserve (currently 10 XRP), which locks up that amount of XRP indefinitely. In contrast, private exchanges usually hold all their customers' XRP in a few shared XRP Ledger accounts, so customers do not have to pay the reserve for individual accounts at the exchange. Before withdrawing, consider whether having your own account directly on the XRP Ledger is worth the price.      



