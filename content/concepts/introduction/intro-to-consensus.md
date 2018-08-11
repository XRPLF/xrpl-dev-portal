# Introduction to Consensus

_Consensus_ is the most important property of any decentralized payment system. In traditional centralized payment systems, one authoritative administrator gets the final say in how and when payments occur. Decentralized systems, by definition, don't have an operator to do that. Instead, decentralized systems like the XRP Ledger define a set of rules all participants follow, so every participant can agree on the exact same series of events and their outcome at any point in time. We call this set of rules a _consensus protocol_.

## Consensus Protocol Properties

The XRP Ledger uses a consensus protocol unlike any digital asset that came before it. This protocol, known as the XRP Ledger Consensus Protocol, is designed to have the following important properties:

- Everyone who uses the XRP Ledger can agree on the latest state, and which transactions have occurred in which order.
- All valid transactions are processed without needing a central operator or having a single point of failure.
- The ledger can make progress even if some participants join, leave, or behave inappropriately.
- If too many participants are unreachable or misbehaving, the network fails to make progress rather than diverging or confirming invalid transactions.
- Confirming transactions does not require wasteful or competitive use of resources, unlike most blockchain systems.

This protocol is still evolving, as is our knowledge of its limits and possible failure cases. For academic research on the protocol itself, see [Consensus Research](consensus-research.html).

## Background

Consensus protocols are a solution to the _double-spend problem_: the challenge to prevent someone from successfully spending the same digital money in two places. For a detailed analysis of the double-spend problem, how the XRP Ledger Consensus Protocol solves this problem, and the tradeoffs and limitations involved, see [Consensus Principles and Rules](consensus-principles-and-rules.html).


## Ledger History

The XRP Ledger processes transactions in blocks called "ledger versions", or "ledgers" for short. Each ledger version is numbered with a _ledger index_ and builds on a previous ledger version whose index is one less. This goes all the way back to a starting point called the _genesis ledger_ with ledger index 1.

<!-- TODO: diagram(s) of ledger, ledger history -->

Each ledger version contains three pieces:

- The current state of all balances and objects stored in the ledger.
- The set of transactions applied to the previous ledger to result in this one.
- Metadata about the current ledger version, such as its ledger index, a [cryptographic hash](https://en.wikipedia.org/wiki/Cryptographic_hash_function) that uniquely identifies its contents, and information on the parent ledger was used as a basis for building this one.

Like Bitcoin and other blockchain technologies, this forms a public history of all transactions and their results. Unlike most blockchain technologies, each new "block" in the XRP Ledger contains the entirety of the current state, so you don't need to collect the entire history to know what's happening now.[¹](#footnote-1)

The main job of the XRP Ledger Consensus Protocol is to agree on set of transactions to apply to the previous ledger, apply them in a well-defined order, then confirm that everyone got the same results. When this happens successfully, a ledger version is considered _validated_, and final. From there, the process continues by building the next ledger version.


## Trust-Based Validation

The core principle behind the XRP Ledger's consensus mechanism is that a little trust goes a long way. Each participant in the network chooses a set of _validators_, servers [specifically configured to participate actively in consensus](run-a-rippled-validator.html), run by different parties who are expected to behave honestly most of the time. More importantly, the set of chosen validators should not be likely to collude with one another to break the rules in the exact same way.

As the network progresses, each server listens to its trusted validators[²](#footnote-2); as long as a large percentage of them agree that a set of transactions should occur and that a given ledger is the result, the server declares a consensus. If they don't agree, validators modify their suggestions to more closely match the other validators they trust, repeating the process in several rounds until they reach a consensus.

It's OK if a small proportion of validators don't operate properly all the time. As long as fewer than 20% of trusted validators are faulty, consensus can continue unimpeded; and confirming an invalid transaction would require over 80% of trusted validators to collude. (Anywhere in between, and the network simply stops making progress.)

For a longer exploration of how the XRP Ledger Consensus Protocol responds to various challenges, attacks, and failure cases, see [Consensus Protections Against Attacks and Failure Modes](consensus-protections.html).


## Footnotes

1. <a id="footnote-1"></a> In Bitcoin, the current state is sometimes called the set of "UTXOs" (unspent transaction outputs). Despite proposals that Bitcoin's consensus mechanism could vouch for the latest UTXOs to save new servers the effort of collecting state going back to the beginning of the network, it currently (as of 2018) does not do this.

2. <a id="footnote-2"></a> A server does not need a direct connection to its trusted validators to hear from them. The XRP Ledger peer-to-peer network uses a _gossip protocol_ where servers identify each other by public keys and relay digitally-signed messages from others.
