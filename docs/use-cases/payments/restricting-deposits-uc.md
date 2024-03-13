---
html: restricting-deposits-uc.html
parent: payments-uc.html
seo:
    description: Checks enable users to create deferred payments similar to personal paper checks.
labels:
  - Transactions
---
# Restricting Deposits

To comply with banking regulations, financial institutions must provide documentation about the sources of funds they receive. These regulations seek to prevent illicit activity by requiring institutions to track the source and destination of all payments they process. On the XRP Ledger, payments can be sent and received without any interaction from the receiver. This default behavior can be problematic, but you can enable deposit authorization so you only receive funds you explicitly approve.

Accounts with deposit authorization enabled can only receive funds through:

  - Preauthorized Accounts
  - Checks
  - Escrow
<!-- - Payment Channels -->


## Set Up Deposit Authorization

To enable deposit authorization, use the `AccountSet` transaction to set the `asfDepositAuth` flag. See: [Deposit Authorization](../../concepts/accounts/depositauth.md).

## Preauthorized Accounts

When you enable deposit authorization, your account blocks all incoming transactions unless you specifically _okay_ them. This may be what you're looking for, but it can be cumbersome if you're working with high volumes of transactions. If you have trusted vendors or accounts, you can preauthorize them so that you don't have to approve transactions from them.

Preauthorized accounts are currency-agnostic, meaning you can't specify which currencies to authorize. It's all or nothing.

See: [DepositPreauth](../../references/protocol/transactions/types/depositpreauth.md).


## Accepting Deposits from Unauthorized Accounts

You can still work with unauthorized accounts, even after enabling deposit authorization. There are several payment methods that enable you to do so.


### Checks

Checks are a straightforward, familiar, and flexible way to transfer funds when deposit authorization is enabled. Checks are a two-part payment method. The sender creates the check, and then the receiver has to cash the check. Cashing the check is your explicit approval of the deposit.

While this method is the simplest, it doesn't guarantee the funds. Checks are deferred payments, meaning funds aren't moved until the moment you try to cash the check. It's possible for the sending account to not have the necessary funds at the time the check is cashed, which can cause delays or other headaches, depending on your business.

See: [Use Checks](../../tutorials/how-tos/use-specialized-payment-types/use-checks/use-checks.md).


### Escrow

If you require a guarantee of funds at the time of deposit, another option is to have deposits made with an escrow. Like regular escrows, a sender sets aside funds on the ledger, effectively locking them up until certain conditions are met. This guarantees the funds will be available when you close the escrow to release the funds.

See: [Use Escrows](../../tutorials/how-tos/use-specialized-payment-types/use-escrows/index.md).


<!-- Need a better understanding of Payment Channels use cases.

### Payment Channels

Payment Channels are an advanced feature for sending asynchronous XRP payments that can be divided into very small increments and settled later.

The XRP for a payment channel is set aside temporarily. The sender creates _Claims_ against the channel, which the recipient verifies without sending an XRP Ledger transaction or waiting for a new ledger version to be approved by consensus. (This is an _asynchronous_ process because it happens separate from the usual pattern of getting transactions approved by consensus.) At any time, the recipient can _redeem_ a Claim to receive an amount of XRP authorized by that Claim. Settling a Claim like this uses a standard XRP Ledger transaction, as part of the usual consensus process. This single transaction can encompass any number of transactions guaranteed by smaller Claims.

Because Claims can be verified individually but settled in bulk later, payment channels make it possible to conduct transactions at a rate only limited by the participants' ability to create and verify the digital signatures of those Claims. This limit is primarily based on the speed of the participants' hardware and the complexity of the signature algorithms. For maximum speed, use Ed25519 signatures, which are faster than the XRP Ledger's default secp256k1 ECDSA signatures. Research has demonstrated the ability to create over Ed25519 100,000 signatures per second and to verify over [70,000 per second](https://ed25519.cr.yp.to/ed25519-20110926.pdf) on commodity hardware in 2011.

Learn about [Payment Channels](payment-channels.html) on the XRP Ledger.

you may have circumstances where you want to go into contract with a contractor, but don't know the exact amount. This is common in situations such as home improvement projects where an estimate can be provided, but unforeseen circumstances can increase the final amount due. In these situations you can create a payment channel, which allocates (currently only XRP) to a payment channel. This amount would be the estimate the contractor gives you and can serve as their budget for the project. Each item they require payment for, you would submit a claim to the payment channel.

Repeating this process, you would eventually settle on the final amount due, where the contractor (payee) claims the final amount from the payment channel. This method of payment serves as a great way to track invdividual items payed for in large projects.

-->
