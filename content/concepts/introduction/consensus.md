# Consensus

_Written by Dave Cohen, David Schwartz, and Arthur Britto._

This article provides a high level overview of the XRP Ledger, the information it stores, and how [transactions](reference-transaction-format.html) result in changes to the ledger.

When building applications on the XRP Ledger, it is important to understand this process, so as not to be surprised by the behavior of XRP Ledger APIs and their effects.

**Caution:** Transactions are not applied to the XRP Ledger instantaneously; it takes some time for the effects of transactions to be applied. During this process, [`rippled` APIs](reference-rippled.html) may return provisional results that should not be mistaken for the final, immutable results of a transaction. Immutable results can only be determined by looking at validated ledgers.

## Introduction

The peer-to-peer XRP Ledger network provides a worldwide, shared ledger, which gives applications authoritative information about the state of its contents. This state information includes:

- settings for each [account](concept-accounts.html)
- balances between accounts (trust lines)
- offers in the distributed exchange
- network settings, such as [transaction costs](concept-transaction-cost.html) and [reserve](concept-reserves.html) amounts
- a time stamp

For a full, technical description of which data is included in a ledger version, see the [Ledger Format Reference](reference-ledger-format.html).

[![Figure 1: XRP Ledger Elements](img/ledger-components.png)](img/ledger-components.png)

_Figure 1: XRP Ledger Elements_

The XRP Ledger has a new ledger version every several seconds. The ledger versions that preceded it form the ledger history. Even the most recent validated ledger is part of history, as it represents the state of the network as of a short time ago. In the present, the network is evaluating transactions which may be applied and finalized in the next ledger version.

[![Figure 2: XRP Ledger Sequence and History](img/ledger-history.png)](img/ledger-history.png)

_Figure 2: XRP Ledger Sequence and History_

A ledger instance is identified by its _sequence number_ <a href="#footnote_1" id="footnote_from_1"><sup>1</sup></a>, also called a _ledger index_. Ledgers are numbered incrementally. If the last validated ledger is N, the previous was N-1 and the next is N+1. The N+1 ledger is produced by applying a set of transactions to ledger N.

User level changes to the ledger are the results of transactions. Examples of [transactions](reference-transaction-format.html) include payments, changes to account settings or trust lines, and offers to trade. Each transaction authorizes changes to the ledger and is cryptographically signed by an account owner. Transactions are the only way to authorize changes to an account.

A ledger instance also contains a set of transactions and metadata about those transactions. The transactions are those that have been applied to the prior ledger to create the new instance. The metadata records precisely the effects of the transaction on the ledger.

[![Figure 3: Transactions Applied to Ledger Version](img/ledger-changes.png)](img/ledger-changes.png)

_Figure 3: Transactions Applied to Ledger Version_

The set of transactions included in a ledger instance are recorded in that ledger and allow auditability of the XRP Ledger history. If an account balance is different in ledger N+1 than it was in ledger N, then ledger N+1 contains the transaction(s) responsible for the change.

Transactions that appear in a validated ledger may have succeeded in changing the ledger, or may have been processed without doing the requested action. Successful transactions have the **tesSUCCESS** [result code](reference-transaction-format.html#transaction-results) which indicates the requested changes are applied to the ledger and a fee was claimed. Other transactions in the ledger have **tec** class result codes, which indicate transactions that only claim a fee and perform no other changes <a href="#footnote_2" id="footnote_from_2"><sup>2</sup></a>.

Transactions of the **tec** class are included with the ledger because they change an account balance when claiming a fee.

In addition to the **tes** and **tec** class result codes, there are **ter**, **tef** and **tem** class codes. The latter three indicate provisional failures returned by API calls. Only **tes** and **tec** codes appear in ledgers.

When working with [`rippled` APIs](reference-rippled.html), applications must distinguish between candidate transactions proposed for inclusion in a ledger versus validated transactions which are included in a validated ledger. Only transaction results found in a validated ledger are immutable. A candidate transaction may or may not ever be included in a validated ledger.

Important: Some [`rippled` APIs](reference-rippled.html) provide provisional results, based on candidate transactions <a href="#footnote_3" id="footnote_from_3"><sup>3</sup></a>. Applications should never rely on provisional results to determine the final outcome of a transaction. The only way to know with certainty that a transaction finally succeeded is to check the status of the transaction until it is both in a validated ledger and has result code tesSUCCESS. If the transaction is in a validated ledger with any other result code, it has failed. If the ledger specified in a transaction’s [`LastLedgerSequence`](reference-transaction-format.html#lastledgersequence) has been validated, yet the transaction does not appear in that ledger or any before it, then that transaction has failed and can never appear in any ledger. An outcome is final only for transactions that appear in a validated ledger or can never appear because of `LastLedgerSequence` restrictions as explained later in this document.

## The XRP Ledger Protocol – Consensus and Validation

The peer-to-peer XRP Ledger network consists of many distributed servers, called nodes, that accept and process transactions. Client applications sign and send transactions to nodes, which relay these candidate transactions throughout the network for processing. Examples of client applications include mobile and web wallets, gateways to financial institutions, and electronic trading platforms.

[![Figure 4: Participants in the XRP Ledger Protocol](img/xrp-ledger-network.png)](img/xrp-ledger-network.png)

_Figure 4: Participants in the XRP Ledger Protocol_

The nodes that receive, relay and process transactions may be either tracking nodes or validating nodes. Tracking nodes’ primary functions include distributing transactions from clients and responding to queries about the ledger. Validating nodes perform the same functions as tracking nodes and additionally contribute to advancing the ledger sequence <a href="#footnote_4" id="footnote_from_4"><sup>4</sup></a>.

While accepting transactions submitted by client applications, each tracking node uses the last validated ledger as a starting point. The accepted transactions are candidates. The nodes relay their candidate transactions to their peers, allowing the candidate transactions to propagate throughout the network. Ideally, each candidate transaction would be known to all nodes, allowing each to consider the same set of transactions to apply to the last validated ledger. As transactions take time to propagate however, the nodes do not work with the same set of candidate transactions at all times. To account for this, the XRP Ledger uses a process called consensus to ensure that the same transactions are processed and validated ledgers are consistent across the peer-to-peer XRP Ledger network.

### Consensus

The nodes on the network share information about candidate transactions. Through the consensus process, validating nodes agree on a specific subset of the candidate transactions to be considered for the next ledger. Consensus is an iterative process in which nodes relay proposals, or sets of candidate transactions. Nodes communicate and update proposals until a supermajority <a href="#footnote_5" id="footnote_from_5"><sup>5</sup></a> of peers agree on the same set of candidate transactions.

During consensus, each node evaluates proposals from a specific set of peers, called chosen validators <a href="#footnote_6" id="footnote_from_6"><sup>6</sup></a>. Chosen validators represent a subset of the network which, when taken collectively, is "trusted" not to collude in an attempt to defraud the node evaluating the proposals. This definition of "trust" does not require that each individual chosen validator is trusted. Rather, validators are chosen based on the expectation they will not collude in a coordinated effort to falsify data relayed to the network <a href="#footnote_7" id="footnote_from_7"><sup>7</sup></a>. <!-- STYLE_OVERRIDE: will -->

[![Figure 5: Validators Propose Transaction Sets](img/consensus-candidate-transaction-sets.png)](img/consensus-candidate-transaction-sets.png)

_Figure 5: Validators Propose Transaction Sets — At the start of consensus, nodes work with different sets of transactions. Rounds of proposals determine which transactions to apply to the ledger, and which must wait for a later round of consensus._

Candidate transactions which fail to be included in the agreed-upon proposal remain candidate transactions. They may be considered again in the next round of consensus.

[![Figure 6: Through Consensus, Nodes Agree on Transaction Set](img/consensus-agreed-transaction-set.png)](img/consensus-agreed-transaction-set.png)

_Figure 6: Through Consensus, Nodes Agree On Transaction Set — Nodes apply the agreed-upon set of transactions (shown in green) to the last validated ledger. Transactions not in the set (in red) may be agreed upon in the next round._

Typically, a transaction which does not pass one round of consensus succeeds in the following round. However, in some circumstances, a transaction could fail to pass consensus indefinitely. One such circumstance is if the network increases the base fee to a value higher than the transaction provides. The transaction could potentially succeed if the fees are lowered at some point in the future.

The [`LastLedgerSequence` transaction field](reference-transaction-format.html#lastledgersequence) is a mechanism to expire such a transaction if it does not execute in a reasonable time frame. Applications should include a `LastLedgerSequence` parameter with each transaction. This ensures a transaction either succeeds or fails on or before the specified ledger sequence number, thus limiting the amount of time an application must wait before obtaining a definitive transaction result. For more information, see [Reliable Transaction Submission](tutorial-reliable-transaction-submission.html).

### Validation

When a round of consensus completes, each node computes a new ledger by applying the candidate transactions in the consensus transaction set to the last validated ledger.

[![Figure 7: A Network Node Calculates a Ledger Validation](img/consensus-calculate-validation.png)](img/consensus-calculate-validation.png)

_Figure 7: A Network Node Calculates a Ledger Validation — Each tracking node applies agreed-upon transactions to the last validated ledger. Validating nodes send their results to the entire network._

The validating nodes calculate a new version of the ledger and relay their results to the network, each sending a signed hash of the ledger it calculated based on the candidate transactions proposed during consensus. These signed hashes, called validations, allow each node to compare the ledger it computed with those of its peers.

[![Figure 8: Ledger is Validated When Supermajority of Peers Calculate the Same Result Result](img/consensus-declare-validation.png)](img/consensus-declare-validation.png)

_Figure 8: Ledger is Validated When Supermajority of Peers Calculate the Same Result — Nodes compare their calculated ledger with the hashes received from chosen validators. If not in agreement, the node must re-calculate or retrieve the correct ledger._

Nodes of the network recognize a ledger instance as validated when a supermajority of the peers have signed and broadcast the same validation hash <a href="#footnote_8" id="footnote_from_8"><sup>8</sup></a>. Going forward, transactions are applied to this updated and now validated ledger with sequence number N+1.

In cases where a node is in the minority, having computed a ledger that differs from its peers, the node disregards the ledger it computed <a href="#footnote_9" id="footnote_from_9"><sup>9</sup></a>. It recomputes the correct ledger, or retrieves the correct ledger as needed.

If the network fails to achieve supermajority agreement on validations, this implies that transaction volume was too high or network latency too great for the consensus process to produce consistent proposals. In this case, the nodes repeat the consensus process. As time passes since consensus began, it becomes increasingly likely that a majority of the nodes have received the same set of candidate transactions, as each consensus round reduces disagreement. The XRP Ledger dynamically adjusts [transaction costs](concept-transaction-cost.html) and the time to wait for consensus in response to these conditions.

[![Figure 9: Network Recognizes a New Validated Ledger Version](img/consensus-validated-ledger.png)](img/consensus-validated-ledger.png)

_Figure 9: Network Recognises the New Validated Ledger Version — At the end of a round of the consensus process, nodes have an updated validated ledger._

Once they reach supermajority agreement on validations, the nodes work with the new validated ledger, sequence number N+1. The consensus and validation process repeats <a href="#footnote_10" id="footnote_from_10"><sup>10</sup></a>, considering candidate transactions that were not included in the last round along with new transactions submitted in the meantime.

## Key Takeaways

Transactions submitted to the XRP Ledger are not processed instantaneously. For a period of time, each transaction remains a candidate.

The lifecycle of a single transaction is as follows:

- A transaction is created and signed by an account owner.
- The transaction is submitted to the network.
    - Badly formed transactions may be rejected immediately.
    - Well formed transactions may provisionally succeed, then later fail.
    - Well formed transactions may provisionally fail, then later succeed.
- During consensus, the transaction is included in the ledger.
    - The result of a successful consensus round is a validated ledger.
    - If a consensus round fails, the consensus process repeats until it succeeds.
- The validated ledger includes the transaction and its effects on the ledger state.

Applications should only rely on information in validated ledgers, not on the provisional results of candidate transactions. Some [`rippled` APIs](reference-rippled.html) initially return provisional results for transactions. The results of a transaction become immutable only when that transaction is included in a validated ledger, or the transaction includes `LastLedgerSequence` and does not appear in any validated ledger with that sequence number or lower.

Best practices for applications submitting transactions include:

- Use the `LastLedgerSequence` parameter to ensure that transactions validate or fail in a deterministic and prompt fashion.
- Check the results of transactions in validated ledgers.
    - Until a ledger containing the transaction is validated, or `LastLedgerSequence` has passed, results are provisional.
    - Transactions with result code **tesSUCCESS** and `"validated": true` have immutably succeeded.
    - Transactions with other result codes and `"validated": true` have immutably failed.
    - Transactions that fail to appear in any validated ledger up to and including the validated ledger identified by the transaction’s `LastLedgerSequence` have immutably failed.
        - Take care to use a node with a continuous ledger history to detect this case <a href="#footnote_11" id="footnote_from_11"><sup>11</sup></a>.
    - It may be necessary to check the status of a transaction repeatedly until the ledger identified by `LastLedgerSequence` is validated.

## Further Resources

- [Consensus White Paper](https://ripple.com/files/ripple_consensus_whitepaper.pdf)
- [Ledger Format Reference](reference-ledger-format.html)
- [Ripple Consensus Video](https://www.youtube.com/watch?v=pj1QVb1vlC0)
- [Reliable Transaction Submission](tutorial-reliable-transaction-submission.html)



## End Notes

<a href="#footnote_from_1" id="footnote_1"><sup>1</sup></a> – A ledger instance can also be uniquely identified by its hash, which is a digital fingerprint of its contents.

<a href="#footnote_from_2" id="footnote_2"><sup>2</sup></a> – Transactions with **tec** result codes are included in ledgers and not do the requested action. The rationale for this is that multiple transactions may be submitted in sequence, with the order of processing determined by a sequence number associated with an account (not to be confused with the ledger sequence number). To prevent a hold on account sequence numbers which would block later transactions, the transaction is processed to consume the sequence number. Additionally, transactions which are distributed to the network must claim a fee to prevent network abuse.

<a href="#footnote_from_3" id="footnote_3"><sup>3</sup></a> – For example, consider a scenario where Alice has $100, and sends all of it to Bob. If an application first submits that payment transaction, then immediately after checks Alice’s balance, the API returns $0. This value is based on the provisional result of a candidate transaction. There are circumstances in which the payment fails and Alice’s balance remains $100 (or, due to other transactions, become some other amount). The only way to know with certainty that Alice’s payment to Bob succeeded is to check the status of the transaction until it is both in a validated ledger and has result code **tesSUCCESS**. If the transaction is in a validated ledger with any other result code, the payment has failed.

<a href="#footnote_from_4" id="footnote_4"><sup>4</sup></a> – Strictly speaking, validating nodes are a subset of tracking nodes. They provide the same features and additionally create "validations." Tracking nodes may be further categorized by whether they keep full vs. partial ledger history.

<a href="#footnote_from_5" id="footnote_5"><sup>5</sup></a> – Transactions fail to pass a round of consensus when the percentage of peers recognizing the transaction falls below a threshold. Each round is an iterative process. At the start of the first round, at least 50% of peers must agree. The final threshold for a consensus round is 80% agreement. These specific values are subject to change

<a href="#footnote_from_6" id="footnote_6"><sup>6</sup></a> – Sometimes referred to as a Unique Node List (UNL).

<a href="#footnote_from_7" id="footnote_7"><sup>7</sup></a> – If proposals from all validators were evaluated, instead of exclusively from the validators chosen not to collude, a malicious attacker could spin up enough validating nodes to form a colluding supermajority to introduce invalid transactions or omit valid transactions from proposals. The chosen validator list defends against Sybil attacks.

<a href="#footnote_from_8" id="footnote_8"><sup>8</sup></a> – The supermajority threshold, as of November 2014, requires that at least 80% of peers must agree for a ledger to be validated. This happens to be the same percentage required by a round of consensus. Both thresholds are subject to change and need not be equal.

<a href="#footnote_from_9" id="footnote_9"><sup>9</sup></a> – In practice, the node detects that it is in the minority before receiving validations from all peers. It knows when it receives non-matching validations from over 20% of peers that its validation cannot meet the 80% threshold. At that point, it can begin to recalculate a ledger.

<a href="#footnote_from_10" id="footnote_10"><sup>10</sup></a> – In practice, the XRP Ledger runs more efficiently by starting a new round of consensus concurrently, before validation has completed.

<a href="#footnote_from_11" id="footnote_11"><sup>11</sup></a> – A `rippled` server can respond to API requests even without a complete ledger history. Interruptions in service or network connectivity can lead to missing ledgers, or gaps, in the node’s ledger history. Over time, if configured to, `rippled` fills in gaps in its history. When testing for missing transactions, it is important to verify against a node with continuous complete ledgers from the time the transaction was submitted until its LastLedgerSequence. Use the RPC server_state to determine which complete_ledgers are available to a particular node.
