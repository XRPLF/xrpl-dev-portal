---
html: restricting-deposits-uc.html
parent: payments-uc.html
blurb: Checks enable users to create deferred payments similar to personal paper checks.
labels:
  - Transactions
---
# Restricting Deposits

To comply with banking regulations, financial institutions must provide documentation about the sources of funds they receive. These regulations seek to prevent illicit activity by requiring institutions to track the source and destination of all payments they process. On the XRP Ledger, payments can be sent and received without any interaction from the receiver. This default behavior can be problematic, depending on your circumstances, but you can enable deposite authorization so you only receive funds you explicitly approve.

Accounts with deposit authorization enabled can only receive funds through:

  - Preauthorized Accounts
  - Escrow
  - Payment Channels
  - Checks

See: [Deposit Authorization](depositauth.md).

## Set Up Deposit Authorization

To enable deposit authorization, use the `AccountSet` transaction to set the `asfDepositAuth` flag.


## Preauthorize Accounts

When you enable deposit authorization, your account blocks all incoming transactions unless you specifically okay them. This may be what you're looking for, but it can be cumbersome if you're working with high volumes of transactions. If you have trusted vendors or accounts, you can preauthorize them so that you don't have to approve transactions from them.

Preauthorized accounts are currency-agnostic, meaning you can't specify which currencies to authorize. It's all or nothing.

See: [DepositPreauth](depositpreauth.md).


## Accepting Deposits from Unathorized Accounts

You can still work with unathorized accounts even after enabling deposit authorization. There are several payments methods that enable you to do so.


### Checks

Checks are the most straightforward, familiar, and flexible way to transfer funds when deposite authorization is enabled. Checks are a two-part payment method. The sender creates the check, and then the receiver has to cash the check. Cashing the check is your explicit approval of the deposit.

While this method is the simplest, it doesn't guarantee the funds. Checks are deferred payments, meaning funds aren't moved until the moment you try to cash the check. It's possible for the sending account to not have the necessary funds at the time the check is cashed, which can cause delays or other headaches, depending on your business.

See: [Use Checks](use-checks.md).


### Escrow

If you require a guarantee of funds at the time of deposit, another option is to have deposits made with an escrow. Like regular escrows, a sender sets aside funds on the ledger, effectively locking them up until certain conditions are met. This guarantees the funds will be available when you close the escrow to release the funds. See: [Use Escrows](use-escrows).