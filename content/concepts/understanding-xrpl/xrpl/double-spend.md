---
html: double-spend.html
parent: consensus.html
blurb: Consensus protocols are a solution to the double-spend problem.
labels:
  - Ledgers
---
# The Double-spend Problem

Consensus protocols are a solution to the _double-spend problem_: the challenge of preventing someone from successfully spending the same digital money twice. The hardest part about this problem is putting transactions in order: without a central authority, it can be difficult to resolve disputes about which transaction comes first when you have two or more mutually exclusive transactions sent around the same time.

The double-spend problem is a fundamental challenge to operating any sort of payment system. The problem comes from the requirement that when money is spent in one place, it can't also be spent in another place. More generally, the problem occurs when you have any two transactions such that either one is valid but not both together.

Suppose Alice, Bob, and Charlie are using a payment system, and Alice has a balance of $10. For the payment system to be useful, Alice must be able to send her $10 to Bob, or to Charlie. However, if Alice tries to send $10 to Bob and also send $10 to Charlie at the same time, that's where the double spend problem comes in.

If Alice can send the "same" $10 to both Charlie and Bob, the payment system ceases to be useful. The payment system needs a way to choose which transaction should succeed and which should fail, in such a way that all participants agree on which transaction has happened. Either of those two transactions is equally valid on its own. However, different participants in the payment system may have a different view of which transaction came first.

Conventionally, payment systems solve the double spend problem by having a central authority track and approve transactions. For example, a bank decides to clear a check based on the issuer's available balance, of which the bank is the sole custodian. In such a system, all participants follow the central authority's decisions.

Distributed ledger technologies, like the XRP Ledger, have no central authority. They must solve the double spend problem using a consensus protocol.

## Simplifying the Problem

Much of the double spend problem can be solved by well known rules such as prohibiting an account from spending funds it does not have. In fact, the double spend problem can be reduced to putting transactions in order.

Consider the example of Alice trying to send the same $10 to both Bob and Charlie. If the payment to Bob is known to be first, then everyone can agree that she has the funds to pay Bob. If the payment to Charlie is known to be second, then everyone can agree that she cannot send those funds to Charlie because the money has already been sent to Bob.

We can also order transactions by deterministic rules. Because transactions are collections of digital information, it's trivial for a computer to sort them.

This would be enough to solve the double spend problem without a central authority, but it would require us to have every transaction that would ever occur (so that we could sort them) before we could be certain of the results of any transaction. Of course, that would be impractical.

If we could collect transactions into groups and agree on those groupings, we could sort the transactions within that group. As long as every participant agrees on which transactions are to be processed as a unit, they can use deterministic rules to solve the double spend problem without any need for a central authority. The participants each sort the transactions and apply them in a deterministic way following the known rules. The XRP Ledger solves the double-spend problem in exactly this way.

The XRP Ledger allows multiple conflicting transactions to be in the agreed group. The group of transactions is executed according to deterministic rules, so whichever transaction comes first according to the sorting rules succeeds and whichever conflicting transaction comes second fails.