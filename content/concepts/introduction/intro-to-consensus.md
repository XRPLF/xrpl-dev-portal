# Introduction to Consensus

_Consensus_ is the most important property of any decentralized payment system. In traditional centralized payment systems, one authoritative administrator gets the final say in how and when payments occur. Decentralized systems, by definition, don't have an administrator to do that. Instead, decentralized systems like the XRP Ledger define a set of rules all participants follow, so every participant can agree on the exact same series of events and their outcome at any point in time. We call this set of rules a _consensus protocol_.


## Consensus Protocol Properties

The XRP Ledger uses a consensus protocol unlike any digital asset that came before it. This protocol, known as the XRP Ledger Consensus Protocol, is designed to have the following important properties:

- Everyone who uses the XRP Ledger can agree on the latest state, and which transactions have occurred in which order.
- All valid transactions are processed without needing a central operator or having a single point of failure.
- The ledger can make progress even if some participants join, leave, or behave inappropriately.
- If too many participants are unreachable or misbehaving, the network fails to make progress rather than diverging or confirming invalid transactions.
- Confirming transactions does not require wasteful or competitive use of resources, unlike most other blockchain systems.

These properties are sometimes summarized as the following principles, in order of priority: **Correctness, Agreement, Forward Progress**.

This protocol is still evolving, as is our knowledge of its limits and possible failure cases. For academic research on the protocol itself, see [Consensus Research](consensus-research.html).

## Background

Consensus protocols are a solution to the _double-spend problem_: the challenge of preventing someone from successfully spending the same digital money twice. The hardest part about this problem is putting transactions in order: without a central authority, it can be difficult to resolve disputes about which transaction comes first when you have two or more mutually-exclusive transactions sent around the same time. For a detailed analysis of the double-spend problem, how the XRP Ledger Consensus Protocol solves this problem, and the tradeoffs and limitations involved, see [Consensus Principles and Rules](consensus-principles-and-rules.html).


## Ledger History

The XRP Ledger processes transactions in blocks called "ledger versions", or "ledgers" for short. Each ledger version contains three pieces:

- The current state of all balances and objects stored in the ledger.
- The set of transactions that have been applied to the previous ledger to result in this one.
- Metadata about the current ledger version, such as its ledger index, a [cryptographic hash](https://en.wikipedia.org/wiki/Cryptographic_hash_function) that uniquely identifies its contents, and information about the parent ledger that was used as a basis for building this one.

[![Figure 1: Anatomy of a ledger version, which includes transactions, state, and metadata](img/anatomy-of-a-ledger-simplified.png)](img/anatomy-of-a-ledger-simplified.png)
<!--{# Diagram source: https://docs.google.com/presentation/d/1mg2jZQwgfLCIhOU8Mr5aOiYpIgbIgk3ymBoDb2hh7_s/ #}-->

Each ledger version is numbered with a _ledger index_ and builds on a previous ledger version whose index is one less, going all the way back to a starting point called the _genesis ledger_ with ledger index 1.[¹](#footnote-1) Like Bitcoin and other blockchain technologies, this forms a public history of all transactions and their results. Unlike many blockchain technologies, each new "block" in the XRP Ledger contains the entirety of the current state, so you don't need to collect the entire history to know what's happening now.[²](#footnote-2)

The main job of the XRP Ledger Consensus Protocol is to agree on a set of transactions to apply to the previous ledger, apply them in a well-defined order, then confirm that everyone got the same results. When this happens successfully, a ledger version is considered _validated_, and final. From there, the process continues by building the next ledger version.


## Trust-Based Validation

The core principle behind the XRP Ledger's consensus mechanism is that a little trust goes a long way. Each participant in the network chooses a set of _validators_, servers [specifically configured to participate actively in consensus](run-a-rippled-validator.html), run by different parties who are expected to behave honestly most of the time. More importantly, the set of chosen validators should not be likely to collude with one another to break the rules in the exact same way. This list is sometimes called a _Unique Node List_, or UNL.

As the network progresses, each server listens to its trusted validators[³](#footnote-3); as long as a large enough percentage of them agree that a set of transactions should occur and that a given ledger is the result, the server declares a consensus. If they don't agree, validators modify their proposals to more closely match the other validators they trust, repeating the process in several rounds until they reach a consensus.

[![Figure 2: Consensus rounds. Validators revise their proposals to match other validators they trust](img/consensus-rounds.png)](img/consensus-rounds.png)

It's OK if a small proportion of validators don't operate properly all the time. As long as fewer than 20% of trusted validators are faulty, consensus can continue unimpeded; and confirming an invalid transaction would require over 80% of trusted validators to collude. If more than 20% but less than 80% of trusted validators are faulty, the network simply stops making progress.

For a longer exploration of how the XRP Ledger Consensus Protocol responds to various challenges, attacks, and failure cases, see [Consensus Protections Against Attacks and Failure Modes](consensus-protections.html).


## See Also

- [Consensus Network Concepts](consensus-network.html) for several articles describing the mechanics of the XRP Ledger Consensus Protocol in greater depth.
- [Run `rippled` as a Validator](run-rippled-as-a-validator.html) for instructions on running your own validator.
- [Decentralization Strategy Update (Ripple Dev Blog)](https://xrpl.org/blog/2017/decent-strategy-update.html) for a description of Ripple's goals and plans for decentralizing the XRP Ledger.

<!--{# TODO: Replace the Decent Strategy Update w/ a newer article when we have one #}-->

----

## Footnotes

1. <a id="footnote-1"></a> Due to a mishap early in the XRP Ledger's history, [ledgers 1 through 32569 were lost](http://web.archive.org/web/20171211225452/https://forum.ripple.com/viewtopic.php?f=2&t=3613). (This loss represents approximately the first week of ledger history.) Thus, ledger #32570 is the earliest ledger available anywhere. Because the XRP Ledger's state is recorded in every ledger version, the ledger can continue without the missing history. New test networks still start with ledger index 1.

2. <a id="footnote-2"></a> In Bitcoin, the current state is sometimes called the set of "UTXOs" (unspent transaction outputs). Unlike the XRP Ledger, a Bitcoin server must download the entire transaction history to know the full set of UTXOs and process new transactions. As of 2018, there have been some proposals to modify Bitcoin's consensus mechanism to periodically summarize the latest UTXOs so new servers would not need to do this. Ethereum uses a similar approach to the XRP Ledger, with a summary of the current state (called a _state root_) in each block, but syncing takes longer because Ethereum stores a large amount of state data.

3. <a id="footnote-3"></a> A server does not need a direct connection to its trusted validators to hear from them. The XRP Ledger peer-to-peer network uses a _gossip protocol_ where servers identify each other by public keys and relay digitally-signed messages from others.
