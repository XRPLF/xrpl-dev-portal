# Consensus Principles and Rules

The XRP Ledger is a universal payment system enabling users to transfer funds across national boundaries as seamlessly as sending an email. Like other peer-to-peer payment networks such as Bitcoin, the XRP Ledger enables peer-to-peer transaction settlement across a decentralized network of computers. Unlike other digital currency protocols, the XRP Ledger allows users to denominate their transactions with any currency they prefer, including fiat currencies, digital currencies and other forms of value, in addition to XRP (the native asset of the XRP Ledger).

The XRP Ledger's technology enables near real-time settlement (three to six seconds) and contains a decentralized exchange, where payments automatically use the cheapest currency trade orders available to bridge currencies.

## Background

### Mechanics

At the core, the XRP Ledger is a shared database that records information such as accounts, balances, and offers to trade assets. Signed instructions called "transactions" cause changes such as creating accounts, making payments, and trading assets.

As a cryptographic system, the owners of XRP Ledger accounts are identified by _cryptographic identities_, which correspond to public/private key pairs. Transactions are authorized by cryptographic signatures matching these identities. Every server processes every transaction according to the same deterministic, known rules. Ultimately, the goal is for every server in the network to have a complete copy of the exact same ledger state, without needing a single central authority to arbitrate transactions.


### The Double Spend Problem

The "double spend" problem is a fundamental challenge to operating any sort of payment system. The problem comes from the requirement that when money is spent in one place, it can't also be spent in another place. More generally, the problem occurs when you have any two transactions such that either one is valid but not both together.

Suppose Alice, Bob, and Charlie are using a payment system, and Alice has a balance of $10. For the payment system to be useful, Alice must be able to send her $10 to Bob, or to Charlie. However, if Alice tries to send $10 to Bob and also send $10 to Charlie at the same time, that's where the double spend problem comes in.

If Alice can send the "same" $10 to both Charlie and Bob, the payment system ceases to be useful. The payment system needs a way to choose which transaction should succeed and which should fail, in such a way that all participants agree on which transaction has happened. Either of those two transactions is equally valid on its own. However, different participants in the payment system may have a different view of which transaction came first.

Conventionally, payment systems solve the double spend problem by having a central authority track and approve transactions. For example, a bank decides to clear a check based on the issuer's available balance, of which the bank is the sole custodian. In such a system, all participants follow the central authority's decisions.

Distributed ledger technologies, like the XRP Ledger, have no central authority. They must solve the double spend problem in some other way.


## How Consensus Works

### Simplifying the Problem

Much of the double spend problem can be solved by well-known rules such as prohibiting an account from spending funds it does not have. In fact, the double spend problem can be reduced to putting transactions in order.

Consider the example of Alice trying to send the same $10 to both Bob and Charlie. If the payment to Bob is known to be first, then everyone can agree that she has the funds to pay Bob. If the payment to Charlie is known to be second, then everyone can agree that she cannot send those funds to Charlie because the money has already been sent to Bob.

We can also order transactions by deterministic rules. Because transactions are collections of digital information, it's trivial for a computer to sort them.

This would be enough to solve the double spend problem without a central authority, but it would require us to have every transaction that would ever occur (so that we could sort them) before we could be certain of the results of any transaction. Obviously, this is impractical. <!-- STYLE_OVERRIDE: obviously -->

If we could collect transactions into groups and agree on those groupings, we could sort the transactions within that group. As long as every participant agrees on which transactions are to be processed as a unit, they can use deterministic rules to solve the double spend problem without any need for a central authority. The participants each sort the transactions and apply them in a deterministic way following the known rules. The XRP Ledger solves the double-spend problem in exactly this way.

The XRP Ledger allows multiple conflicting transactions to be in the agreed group. The group of transactions is executed according to deterministic rules, so whichever transaction comes first according to the sorting rules succeeds and whichever conflicting transaction comes second fails.

### Consensus Rules

The primary role of consensus is for participants in the process to agree on which transactions are to be processed as a group to resolve the double spend problem. There are four reasons this agreement is easier to achieve than might be expected:

1. If there is no reason a transaction should not be included in such a group of transactions, all honest participants agree to include it. If all participants already agree, consensus has no work to do.
2. If there is any reason at all a transaction should not be included in such a group of transactions, all honest participants are willing to exclude it. If the transaction is still valid, there is no reason not to include it in the next round, and they should all agree to include it then.
3. It is extremely rare for a participant to particularly care how the transactions were grouped. Agreement is easiest when everyone’s priority is reaching agreement and only challenging when there are diverging interests.
4. Deterministic rules can be used even to form the groupings, leading to disagreement only in edge cases. For example, if there are two conflicting transactions in a round, deterministic rules can be used to determine which is included in the next round.

Every participant’s top priority is correctness. They must first enforce the rules to be sure nothing violates the integrity of the shared ledger. For example, a transaction that is not properly signed must never be processed (even if other participants want to be processed). However, every honest participant’s second priority is agreement. A network with possible double spends has no utility at all. Agreement is facilitated by the fact that every honest participant values it above everything but correctness.

### Consensus Rounds

A consensus round is an attempt to agree on a group of transactions so they can be processed. A consensus round starts with each participant who wishes to do so taking an initial position. This is the set of valid transactions they have seen.

Participants then “avalanche” to consensus: If a particular transaction does not have majority support, participants agree to defer that transaction. If a particular transaction does have majority support, participants agree to include the transaction. Thus slight majorities rapidly become full support and slight minorities rapidly become universal rejection from the current round.

To prevent consensus from stalling near 50% and to reduce the overlap required for reliable convergence, the required threshold to include a transaction increases over time. Initially, participants continue to agree to include a transaction if 50% or more of other participants agree. If participants disagree, they increase this threshold, first to 60% and then even higher, until all disputed transactions are removed from the current set. Any transactions removed this way are deferred to the next ledger version.

When a participant sees a supermajority that agrees on the set of transactions to next be processed, it declares a consensus to have been reached.

### Consensus Can Fail

It is not practical to develop a consensus algorithm that never fails to achieve perfect consensus. To understand why, consider how the consensus process finishes. At some point, each participant must declare that a consensus has been reached and that some set of transactions is known to be the result of the process. This declaration commits that participant irrevocably to some particular set of transactions as the result of the consensus process.

Some participant must do this first or no participant will ever do it, and they will never reach a consensus. Now, consider the participant that does this first. When this participant decides that consensus is finished, other participants have not yet made that decision. If they were incapable of changing the agreed set from their point of view, they would have already decided consensus was finished. So they must be still capable of changing their agreed set. <!-- STYLE_OVERRIDE: will -->

In other words, for the consensus process to ever finish, some participant must declare that consensus has been reached on a set of transactions even though every other participant is theoretically still capable of changing the agreed upon set of transactions.

Imagine a group of people in a room trying to agree which door they should use to exit. No matter how much the participants discuss, at some point, _someone_ has to be the first one to walk out of a door, even though the people behind that person could still change their minds and leave through the other door.

The probability of this kind of failure can be made very low, but it cannot be reduced to zero. The engineering tradeoffs are such that driving this probability down below about one in a thousand makes consensus significantly slower, and less able to tolerate network and endpoint failures.

### How the XRP Ledger Handles Consensus Failure

After a consensus round completes, each participant applies the set of transactions that they believe were agreed to. This results in constructing what they believe the next state of the ledger should be.

Participants that are also validators then publish a cryptographic fingerprint of this next ledger. We call this fingerprint a “validation vote”. If the consensus round succeeded, the vast majority of honest validators should be publishing the same fingerprint.

Participants then collect these validation votes. From the validation votes, they can determine whether the previous consensus round resulted in a supermajority of participants agreeing on a set of transactions or not.

Participants then find themselves in one of three cases, in order of probability:

1. They built the same ledger a supermajority agreed to. In this case, they can consider that ledger fully validated and rely on its contents.
2. They built a different ledger than a supermajority agreed on. In this case, they must build and accept the supermajority ledger. This typically indicates that they declared a consensus early and many other participants changed after that. They must “jump” to the super-majority ledger to resume operation.
3. No supermajority is clear from the received validations. In this case, the previous consensus round was wasted and a new round must occur before any ledger can be validated.

Of course, case 1 is the most common. Case 2 does no harm to the network whatsoever. A small percentage of the participants could even fall into case 2 every round, and the network would work with no issues. Even those participants can recognize that they did not build the same ledger as the supermajority, so they know not to report their results as final until they are in agreement with the supermajority.

Case 3 results in the network losing a few seconds in which it could have made forward progress, but is extremely rare. In this case, the next consensus round is much less likely to fail because disagreements are resolved in the consensus process and only remaining disagreements can cause a failure.

On rare occasions, the network as a whole fails to make forward progress for a few seconds. In exchange, average transaction confirmation times are low.

## Philosophy

One form of reliability is the ability of a system to provide results even under conditions where some components have failed, some participants are malicious, and so on. While this is important, there is another form of reliability that is much more important in cryptographic payment systems — the ability of a system to produce results that can be relied upon. That is, when a system reports a result to us as reliable, we should be able to rely on that result.

Real-world systems, however, face operational conditions in which both kinds of reliability can be compromised. These include hardware failures, communication failures, and even dishonest participants. Part of the XRP Ledger's design philosophy is to detect conditions where the reliability of results are impaired and report them, rather than providing results that must not be relied on.

The XRP Ledger's consensus algorithm provides a robust alternative to proof of work systems, without consuming computational resources needlessly. Byzantine failures are possible, and do happen, but the consequence is only minor delays. In all cases, the XRP Ledger's consensus algorithm reports results as reliable only when they in fact are.

## See Also

- **Concepts:**
    - [Introduction to Consensus](intro-to-consensus.html)
    - [Consensus Research](consensus-research.html)
    - [Ripple Consensus Video](https://www.youtube.com/watch?v=pj1QVb1vlC0)
- **Tutorials:**
    - [Reliable Transaction Submission](reliable-transaction-submission.html)
    - [Run `rippled` as a Validator](run-rippled-as-a-validator.html)
- **References:**
    - [Ledger Format Reference](ledger-data-formats.html)
    - [Transaction Format Reference](transaction-formats.html)
    - [consensus_info method][]
    - [validator_list_sites method][]
    - [validators method][]
    - [consensus_info method][]


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
