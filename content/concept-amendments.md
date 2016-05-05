# Amendments #

_(New in [version 0.31.0](https://wiki.ripple.com/Rippled-0.31.0))_

The Amendments system provides a means of introducing new features to the decentralized Ripple consensus network without causing disruptions. The amendments system works by utilizing the core consensus process of the network to approve any changes by showing continuous support before those changes go into effect. An amendment normally requires **80% support for two weeks** before it can apply.

When an Amendment has been enabled, it applies permanently to all ledger versions after the one that included it. You cannot disable an Amendment, unless you introduce a new Amendment to do so.


## Background ##

Any changes to transaction processing could cause servers to build a different ledger with the same set of transactions. If only a portion of _validators_ (`rippled` servers [participating in consensus](tutorial-rippled-setup.html#reasons-to-run-a-validator)) have upgraded to a new version of the software, this could cause anything from minor inconveniences to full outages. In the minor case, a minority of servers spend more time and bandwidth fetching the actual consensus ledger because they cannot build it using the transaction processing rules they already know. In the worst case, [the consensus process](https://ripple.com/knowledge_center/the-ripple-ledger-consensus-process/) might be unable to validate new ledger versions because servers with different rules could not reach a consensus on the exact ledger to build.

Amendments provide a solution to this problem, so that new features can be enabled only when enough validators support those features.

Users and businesses who rely on the Ripple Consensus Ledger can also use Amendments to provide advance notice of changes in transaction processing that might affect their business. However, API changes that do not impact transaction processing or [the consensus process](https://ripple.com/knowledge_center/the-ripple-ledger-consensus-process/) do not require Amendments.


## About Amendments ##

An amendment is a fully-functional feature or change, waiting to be enabled by the peer-to-peer network as a part of the consensus process. A `rippled` server that wants to use an amendment has code for two modes: without the amendment (previous behavior) and with the amendment (new behavior).

Every amendment has a unique identifying hex value and a short name. The short name is for human use, and is not used in the amendment process. Two servers can support the same amendment ID while using different names to describe it. An amendment's name is not guaranteed to be unique.

See also: [Known Amendments](#known-amendments)

## Amendment Process ##

Every 256th ledger is called a "flag" ledger. The process of approving an amendment starts in the ledger version immediately before the flag ledger. When `rippled` validator servers send validation messages for that ledger, those servers also submit votes in favor of specific amendments. ([Fee Voting](concept-fee-voting.html) also occurs around flag ledgers.)

The flag ledger itself has no special contents. However, during that time, the servers look at the votes of the validators they trust, and decide whether to insert an [`EnableAmendment` pseudo-transaction](reference-transaction-format.html#enableamendment) into the following ledger. The flags of an EnableAmendment pseudo-transaction indicate what the server thinks happened:

* The `tfGotMajority` flag means that support for the amendment has increased to at least 80% of trusted validators.
* The `tfLostMajority` flag means that support for the amendment has decreased to less than 80% of trusted validators.
* An EnableAmendment pseudo-transaction with no flags means that support for the amendment has been enabled. (The change in transaction processing applies to every ledger after this one.)

A server only inserts the pseudo-transaction to enable an amendment if all of the following conditions are met:

* The amendment has not already been enabled.
* A previous ledger includes an EnableAmendment pseudo-transaction for this amendment with the `tfGotMajority` flag enabled.
* The previous ledger in question is an ancestor of the current ledger.
* The previous ledger in question has a close time that is at least **two weeks** before the close time of the latest flag ledger.
* There are no EnableAmendment pseudo-transactions for this amendment with the `tfLostMajority` flag enabled in the consensus ledgers between the `tfGotMajority` pseudo-transaction and the current ledger.

It is theoretically possible (but extremely unlikely) that a `tfLostMajority` EnableAmendment pseudo-transaction could be included in the same ledger as the pseudo-transaction to enable an amendment. In this case, the pseudo-transaction with the `tfLostMajority` pseudo-transaction has no effect.

## Amendment Voting ##

Operators of `rippled` validators can choose which amendments to support or reject using the [`feature` command](reference-rippled.html#feature). This decides which amendments the validator votes for in the [amendment process](#amendment-process). By default, `rippled` votes in favor of every amendment it knows about.

The operator of a `rippled` validator can "veto" an amendment. In this case, that validator never sends a vote in favor of the amendment. If enough servers veto an amendment, that prevents it from reaching consistent 80% support, so the amendment does not apply.

As with all aspects of the consensus process, amendment votes are only taken into account by servers that trust the validators sending those votes. Currently, Ripple (the company) recommends only trusting the 5 default validators that Ripple (the company) operates. For now, trusting only those validators is sufficient to coordinate with Ripple (the company) on releasing new features.

### Configuring Amendment Voting ###

You can temporarily configure an amendment using the [`feature` command](reference-rippled.html#feature). To make a persistent change to your server's support for an amendment, modify your server's `rippled.cfg` file.

Use the `[veto_amendments]` stanza to list amendments you do not want the server to vote for. Each line should contain one amendment's unique ID, optionally followed by the short name for the amendment. For example:

```
[veto_amendments]
C1B8D934087225F509BEB5A8EC24447854713EE447D277F69545ABFA0E0FD490 Tickets
DA1BD556B42D85EA9C84066D028D355B52416734D3283F85E216EA5DA6DB7E13 SusPay
```

Use the `[amendments]` stanza to list amendments you want to vote for. (Even if you do not list them here, by default a server votes for all the amendments it knows how to apply.) Each line should contain one amendment's unique ID, optionally followed by the short name for the amendment. For example:

```
[amendments]
4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373 MultiSign
42426C4D4F1009EE67080A9B7965B44656D7714D104A72F9B4369F97ABF044EE FeeEscalation
```


## Testing Amendments ##

If you want to see how `rippled` behaves with an amendment enabled, before that amendment gets enabled on the production network, you can run use `rippled`'s configuration file to forcibly enable a feature. This is intended for development purposes only.

Because other members of the consensus network probably do not have the feature enabled, you should not use this feature while connecting to the production network. While testing with features forcibly enabled, you should run `rippled` in [Stand-Alone Mode](concept-stand-alone-mode.html).

To forcibly enable a feature, add a `[features]` stanza to your `rippled.cfg` file. In this stanza, add the short names of the features to enable, one per line. For example:

```
[features]
MultiSign
TrustSetAuth
```



# Known Amendments #

The following is a comprehensive list of all known amendments and their status on the production Ripple Consensus Ledger:

| Name                            | Introduced | Enabled |
|---------------------------------|------------|---------|
| [Tickets](#tickets)             | v0.31.0    | TBD |
| [SusPay](#suspay)               | v0.31.0    | TBD |
| [TrustSetAuth](#trustsetauth)   | v0.30.0    | TBD |
| [MultiSign](#multisign)         | v0.31.0    | Expected 2016-06-01 |
| [FeeEscalation](#feeescalation) | v0.31.0    | Expected 2016-05-18 |

**Note:** In many cases, an incomplete version of the code for an amendment is present in previous versions of the software. The "Introduced" version in the table above is the first stable version.

## FeeEscalation ##

| Amendment ID |
|--------------|
| 42426C4D4F1009EE67080A9B7965B44656D7714D104A72F9B4369F97ABF044EE |

Changes the way the [transaction cost](concept-transaction-cost.html) applies to proposed transactions. Modifies the consensus process to prioritize transactions that pay a higher transaction cost.

This amendment introduces a fixed-size transaction queue for transactions that were not able to be included in the previous consensus round. If the `rippled` servers in the consensus network are under heavy load, they queue the transactions with the lowest transaction cost for later ledgers. Each consensus round prioritizes transactions from the queue with the largest transaction cost (`Fee` value), and includes as many transactions as the consensus network can process. If the transaction queue is full, transactions drop from the queue entirely, starting with the ones that have the lowest transaction cost.

While the consensus network is under heavy load, legitimate users can pay a higher transaction cost to make sure their transactions get processed. The situation persists until the entire backlog of cheap transactions is processed or discarded.

A transaction remains in the queue until one of the following happens:

* It gets applied to a validated ledger (regardless of success or failure)
* It becomes invalid (for example, the [`LastLedgerSequence`](reference-transaction-format.html#lastledgersequence) causes it to expire)
* It gets dropped because there are too many transactions in the queue with a higher transaction cost.

## MultiSign ##

| Amendment ID |
|--------------|
| 4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373 |

Introduces simple [multi-signing](reference-transaction-format.html#multi-signing) as a way to authorize transactions. Creates the [`SignerList` ledger node type](reference-ledger-format.html#signerlist) and the [`SignerListSet` transaction type](reference-transaction-format.html#signerlistset). Adds the optional `Signers` field to all transaction types. Modifies some transaction result codes.

This amendment allows addresses to have a list of signers who can authorize transactions from that address in a multi-signature. The list has a quorum and 1 to 8 weighted signers. This allows various configurations, such as "any 3-of-5" or "signature from A plus any other two signatures."

Signers can be funded or unfunded addresses. Funded addresses in a signer list can sign using a regular key (if defined) or master key (unless disabled). Unfunded addresses can sign with a master key. Multi-signed transactions have the same permissions as transactions signed with a regular key.

An address with a SignerList can disable the master key even if a regular key is not defined. An address with a SignerList can also remove a regular key even if the master key is disabled. Therefore, the `tecMASTER_DISABLED` transaction result code is renamed `tecNO_ALTERNATIVE_KEY`. The `tecNO_REGULAR_KEY` transaction result is retired and replaced with `tecNO_ALTERNATIVE_KEY`. Additionally, this amendment adds the following new [transaction result codes](reference-transaction-format.html#result-categories):

* `temBAD_SIGNER`
* `temBAD_QUORUM`
* `temBAD_WEIGHT`
* `tefBAD_SIGNATURE`
* `tefBAD_QUORUM`
* `tefNOT_MULTI_SIGNING`
* `tefBAD_AUTH_MASTER`

## SusPay ##

| Amendment ID |
|--------------|
| DA1BD556B42D85EA9C84066D028D355B52416734D3283F85E216EA5DA6DB7E13 |

Provides "Suspended Payments" for XRP as a means of escrow within the Ripple Consensus Ledger. Creates the `SuspendedPayment` ledger node type and the new transaction types `SuspendedPaymentCreate`, `SuspendedPaymentFinish`, and `SuspendedPaymentCancel`.

This amendment is still in development. The current version is enabled on the [Ripple Test Net](https://ripple.com/build/ripple-test-net/).

## TrustSetAuth ##

| Amendment ID |
|--------------|
| 6781F8368C4771B83E8B821D88F580202BCB4228075297B19E4FDC5233F1EFDC |

Allows pre-authorization of accounting relationships (zero-balance trust lines) when using [Authorized Accounts](tutorial-gateway-guide.html#authorized-accounts).

With this amendment enabled, a `TrustSet` transaction with [`tfSetfAuth` enabled](reference-transaction-format.html#trustset-flags) can create a new [`RippleState` ledger node](reference-ledger-format.html#ripplestate) even if it keeps all the other values of the `RippleState` node in their default state. The new `RippleState` node has the [`lsfLowAuth` or `lsfHighAuth` flag](reference-ledger-format.html#ripplestate-flags) enabled accordingly. The sender of the transaction must have [`lsfRequireAuth` enabled](reference-ledger-format.html#accountroot-flags).

## Tickets ##

| Amendment ID |
|--------------|
| C1B8D934087225F509BEB5A8EC24447854713EE447D277F69545ABFA0E0FD490 |

Introduces Tickets as a way to reserve a transaction sequence number for later execution. Creates the `Ticket` ledger node type and the transaction types `TicketCreate` and `TicketCancel`.

This amendment is still in development.
