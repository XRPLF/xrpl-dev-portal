---
html: validation.html
parent: ledgers.html
blurb: The XRP Ledger's consensus mechanism facilitates approval of ledgers by trusted validators.
labels:
  - Ledgers
---
# Validation

Each participant in the XRP Ledger network chooses a set of _validators_, servers specifically configured to participate actively in consensus. The validators are run by different parties who are expected to behave honestly. More importantly, you choose that are not likely to collude with one another to break the rules. This list is sometimes called a _Unique Node List_, or UNL.

As the network progresses, each server listens to its trusted validators. When a large enough percentage of them agree that a set of transactions should occur, the server declares a consensus. If they do not agree, validators modify their proposals to more closely match the other trusted validators, repeating the process in several rounds until they reach consensus.

[![Validation Rounds](img/consensus-rounds.svg)](img/consensus-rounds.svg)

It does not matter if a small proportion of validators do not work properly every time. As long as fewer than 20% of trusted validators are faulty, consensus can continue unimpeded; confirming an invalid transaction would require over 80% of trusted validators to collude. If more than 20% but less than 80% of trusted validators are faulty, the network stops making progress.

For more information on how consensus works, see [Consensus](consensus.html).

For a longer exploration of how the XRP Ledger Consensus Protocol responds to various challenges, attacks, and failure cases, see [Consensus Protections](consensus-protections.html).