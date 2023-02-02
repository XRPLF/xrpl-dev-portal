---
html: consensus.html
parent: validation.html
blurb: Consensus is the validation process for new entries to the XRP Ledger.
labels:
  - Ledgers
---
# Consensus

This topic describes the consensus process used to validate each ledger version as it is added to the XRP Ledger block chain.

Consensus is the most important property of any decentralized payment system. In traditional centralized payment systems, one authoritative administrator gets the final say in how and when payments occur. Decentralized systems, by definition, do not have an administrator to do that. Instead, decentralized systems like the XRP Ledger define a set of rules all participants follow. Every participant can agree on the exact same series of events and their outcome at any point in time. This set of rules is known as a _consensus protocol_.

## Consensus Process

The consensus process gathers proposed transactions on the XRP Ledger and generates a new ledger version with agreed upon changes.

The peer-to-peer XRP Ledger network includes a specialized type of server called a _validator_. Validators collaborate to propose and confirm transactions that generate a new ledger version.

Starting with the last validated ledger version, validators distribute a new ledger version based on transaction requests they have received. The proposed ledgers all have the same sequence number (previous sequence number plus one).

[![Proposed Ledgers](img/consensus1-proposed-ledgers.png)](img/consensus1-proposed-ledgers.png)

Validators then incorporate new transactions from other trusted validators, and remove transactions that are not recognized by other nodes. When 80% of the validator nodes agree on the transactions to include in the new ledger, all proposed ledger versions are dropped and a new one is created with the agreed upon transactions.

[![Proposed Ledgers](img/consensus2-agreed-transactions.png)](img/consensus2-agreed-transactions.png)

The XRP Ledger creates the new ledger version, including changes in state information based on the agreed upon transactions, the parent hash, the current available XRP, flags, and the close time. The ledger calculates the unique hash of the ledger version based on its own updated information.

[![Proposed Ledgers](img/consensus3-updates.png)](img/consensus3-updates.png)

The XRP Ledger's technology enables near real-time settlement (three to six seconds).

## Consensus Protocol Properties

The XRP Ledger Consensus Protocol, is designed with these important properties:

- Everyone who uses the XRP Ledger can agree on the current state, and which transactions  occurred in which order.
- All valid transactions are processed without needing a central operator or having a single point of failure.
- The ledger can make progress, even if some participants join, leave, or behave inappropriately.
- If too many participants are unreachable or misbehaving, the network fails to make progress, rather than diverging or confirming invalid transactions.
- Confirming transactions does not require wasteful or competitive use of resources, unlike most other blockchain systems.

These properties are sometimes summarized as the following principles, in order of priority: **Correctness, Agreement, Forward Progress**.

## Consensus Rules

The primary role of consensus is for participants in the process to agree on which transactions are to be processed as a group to resolve the double spend problem (where an account attempts to use the same funds for two separate transactions). There are four reasons this agreement is easier to achieve than might be expected:

1. If there is no reason a transaction should not be included in such a group of transactions, all honest participants agree to include it. If all participants already agree, consensus has no work to do.
2. If there is any reason at all a transaction should not be included in such a group of transactions, all honest participants are willing to exclude it. If the transaction is still valid, there is no reason not to include it in the next round, and they should all agree to include it then.
3. It is extremely rare for a participant to particularly care how the transactions were grouped. Agreement is easiest when everyone’s priority is reaching agreement and only challenging when there are diverging interests.
4. Deterministic rules can be used even to form the groupings, leading to disagreement only in edge cases. For example, if there are two conflicting transactions in a round, deterministic rules can be used to determine which is included in the next round.

Every participant’s top priority is correctness. They must first enforce the rules to be sure nothing violates the integrity of the shared ledger. For example, a transaction that is not properly signed must never be processed (even if other participants want it to be processed). However, every honest participant’s second priority is agreement. A network with possible double spends has no utility at all, so every honest participant values agreement above everything but correctness.

For more in-depth information on how consensus works, see [Consensus Structure](consensus-structure.html)

This protocol is still evolving, as is our knowledge of its limits and possible failure cases. For academic research on the protocol itself, see [Consensus Research](consensus-research.html).