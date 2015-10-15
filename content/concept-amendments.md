# Amendments #

The Amendments system provides a means of introducing new features to the decentralized Ripple consensus network without causing disruptions. The amendments system works by utilizing the core consensus process of the network to approve any changes by showing continuous support for two weeks before they go into effect.

## Background ##

Any changes to transaction processing could cause servers to build a different ledger with the same set of transactions. This could cause anything from minor inconveniences (a minority of servers spend more time and bandwidth fetching the actual consensus ledger because they cannot rely on their own) to serious problems: consensus might halt from validating ledgers because servers are unable to reach a majority who agree on the same result.

In theory, this could prompt a situation where the Ripple Consensus Ledger ceases to function because only a portion of validators have upgraded to a new version of the software.

Amendments fix that problem while also providing advance notice of when any transaction processing changes will go into effect, so that any users and businesses who rely on the behavior of the Ripple Consensus Ledger have fair warning in advance. API changes that do not impact the Consensus process do not require Amendments.

## Amendment Lifecycle ##

An amendment is a fully-functional feature or change, ready to apply as soon as a consensus of servers can handle it. A server that wants to use an amendment must have functional code for two modes: without the amendment (previous behavior) and with the amendment (new behavior). Every amendment has a unique identifying string, which should indicate who developed it, in order to avoid potential overlap.

Every 256th ledger is called a "flag" ledger. The process of approving an amendment starts in the ledger version immediately before the flag ledger: at this time, `rippled` validator servers submit votes in favor of specific amendments alongside their validations for that ledger.

In the flag ledger itself, there is nothing unusual. However, during that time, the servers look at the votes of the validators they trust, and decide whether to insert an `Amendment` pseudo-transaction into the following ledger, with flags to indicate what it thinks happened:

* The `tfGotMajority` flag means that support for a feature has increased across the threshold of 80% of trusted validators.
* The `tfLostMajority` flag means that support for a feature has decreased across the threshold of 80% of trusted validators.
* An Amendment pseudo-transaction with no flags means that support for a feature has been enabled. This is called the _"Enabled"_ Amendment.

A server only inserts the "Enabled" Amendment if there is a validated ledger which closed at least two weeks prior to the current flag ledger, with a Got-Majority Amendment psuedo-transaction, and no Lost-Majority Amendment psuedo-transactions for the same feature in the validated ledgers in between.
