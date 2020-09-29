---
html: negative-unl.html
funnel: Build
doc_type: Concepts
category: Consensus Network
blurb: Understand how Negative UNL improves the ledger's resilience during partial outages.
---
# Negative UNL

_The Negative UNL feature has a preliminary implementation in `rippled` 1.6.0 so that it can be used in test networks, but is not yet available as an [amendment](amendments.html) to the XRP Ledger protocol. The `NegativeUNL` amendment :not_enabled: may be included in a future XRP Ledger based on acceptance testing of the preliminary implementation._

_Negative UNL_ is a feature of the XRP Ledger [consensus protocol](consensus.html) that improves _liveness_, the network's ability to make forward progress during a partial outage. Negative UNL adjusts the _quorum requirements_ based on which validators are currently online and operational, so that a new [ledger version](ledgers.html) can be declared _validated_ even if several trusted validators are offline.

## Background

Each server in the XRP Ledger protocol has its own UNL (Unique Node List), a list of validators it trusts not to collude, and each server independently decides when a ledger version is validated based on the consensus when enough of its trusted validators agree on a new ledger version. (The default configuration uses a recommended UNL, signed by Ripple, consisting of validators Ripple considers to be sufficiently unique, reliable, and independent.) The standard quorum requirement is at least 80% of trusted validators must agree.

## Tracking Offline Validators

When one or more validators appear to be offline or nonfunctional, the remaining validators can vote to add that validator to the "negative UNL," a list of trusted validators who appear not to be participating in the consensus process. To take effect, the vote must achieve a consensus in the same way that other [pseudo-transactions](pseudo-transaction-types.html) do. The Negative UNL is tracked in the [TODO ledger object](TODO) in the ledger's state data.

When a validator on the negative UNL appears to come back online, validators vote to remove it from the negative UNL by the same process. Validators also vote to remove untrusted entries from the shared Negative UNL.


## Quorum Adjustments

When calculating the quorum for a potential ledger version, any offline validators in the previous ledger's Negative UNL don't count toward a server's total number of trusted validators. This can lower the quorum requirement to a smaller number. Trusted validators always count towards the total when they _do_ provide validation votes, regardless of whether they are in the negative UNL.

For example:

1. Suppose your server's UNL consists of 38 trusted validators, so an 80% quorum is at least 31 of 38 trusted validators.
2. Imagine 2 of those validators, named MissingA and UnsteadyB, appear to have gone offline. During the consensus process for ledger _N_, many of the remaining validators propose adding MissingA and UnsteadyB to the negative UNL. The motion passes via a quorum of at least 31 of the remaining validators, and ledger _N_ becomes validated.
3. For ledger _N+1_, both MissingA and UnsteadyB continue to be offline. Neither one provides a validation vote, so both are subtracted from the total 38 validators. The adjusted quorum requirement is therefore 80% of 36 = 28.8; so, ledger _N+1_ can be validated by a quorum of as few as 29 validators.
4. For ledger _N+2_, UnsteadyB comes back and provides a validation vote. Therefore, it counts toward the total number of trusted validators. MissingA is still offline, so the working quorum is 80% of 37 validators = 29.6. Ledger _N+2_ can be validated with a quorum of 30 validators or more.
5. After UnsteadyB has been back online for a while, the validators vote to remove it from the Negative UNL.
6. Eventually, you decide that MissingA is probably not coming back, so you remove it from your server's UNL. Your server no longer consider's MissingA's vote for validating new ledger versions.
7. As validator operators remove MissingA from their UNLs, their validators vote to also remove MissingA from the Negative UNL. When enough validators have done so, the pseudo-transaction to remove MissingA achieves a consensus and becomes validated.
