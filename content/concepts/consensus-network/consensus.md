# Consensus

_Written by Dave Cohen, David Schwartz, and Arthur Britto._

This article provides a high level overview of the XRP Ledger, the information it stores, and how [transactions](transaction-formats.html) result in changes to the ledger.

When building applications on the XRP Ledger, it is important to understand this process, so as not to be surprised by the behavior of XRP Ledger APIs and their effects.


## Introduction

The peer-to-peer XRP Ledger network provides a worldwide, shared ledger, which gives applications authoritative information about the state of its contents. This state information includes:

- settings for each [account](accounts.html)
- balances of XRP and [issued currencies](issued-currencies.html)
- offers in the distributed exchange
- network settings, such as [transaction costs](transaction-cost.html) and [reserve](reserves.html) amounts
- a timestamp

For a full, technical description of which data is included in a ledger version, see the [Ledger Format Reference](ledger-data-formats.html).

[![Figure 1: XRP Ledger Elements](img/anatomy-of-a-ledger-complete.png)](img/anatomy-of-a-ledger-complete.png)

_Figure 1: XRP Ledger Elements_

The XRP Ledger has a new ledger version every several seconds. When the network agrees on the contents of a ledger version, that ledger version is _validated_, and its contents can never change. The validated ledger versions that preceded it form the ledger history. Even the most recent validated ledger is part of history, as it represents the state of the network as of a short time ago. In the present, the network is evaluating transactions which may be applied and finalized in the next ledger version. While this evaluation is happening, the network has candidate ledger versions that are not yet validated.

[![Figure 2: XRP Ledger History](img/ledger-history.png)](img/ledger-history.png)

_Figure 2: XRP Ledger History_

A ledger version has two identifiers. One identifier is its _ledger index_. Ledger versions are numbered incrementally. For example, if the current ledger version has ledger index of 100, the previous has ledger index 99 and the next has ledger index 101. The other identifier is a _ledger hash_, which is a digital fingerprint of the ledger's contents.

As servers propose transactions to apply to the ledger, they may create several candidate ledger versions with slightly different contents. These candidate ledger versions have the same ledger index but different ledger hashes. Of the many candidates, only one can become validated. All the other candidate ledger versions are discarded. Thus, there is exactly one validated ledger hash for each ledger index in history.

User level changes to the ledger are the results of transactions. Examples of [transactions](transaction-formats.html) include payments, changes to account settings or trust lines, and offers to trade. Each transaction authorizes one or more changes to the ledger, and is cryptographically signed by an account owner. Transactions are the only way to authorize changes to an account, or to change anything else in the ledger.

Each ledger version also contains a set of transactions and metadata about those transactions. The transactions it includes are only the ones that have been applied to the previous ledger version to create the new ledger version. The metadata records the exact effects of the transaction on the ledger's state data.

[![Figure 3: Transactions Applied to Ledger Version](img/ledger-changes.png)](img/ledger-changes.png)

_Figure 3: Transactions Applied to Ledger Version_

The set of transactions included in a ledger instance are recorded in that ledger and allow auditability of the XRP Ledger history. If an account balance is different in ledger N+1 than it was in ledger N, then ledger N+1 contains the transaction(s) responsible for the change.

Transactions that appear in a validated ledger may have succeeded in changing the ledger, or may have been processed without doing the requested action. Successful transactions have the **tesSUCCESS** [result code](transaction-results.html) which indicates the requested changes are applied to the ledger. Failed transactions in the ledger have **tec** class result codes.<a href="#footnote_1" id="from_footnote_1"><sup>1</sup></a>

All transactions included in a ledger destroy some XRP as a [transaction cost](transaction-cost.html), regardless of whether they had a **tes** or **tec** code. The exact amount of XRP to destroy is defined by the signed transaction instructions.

In addition to the **tes** and **tec** class result codes, there are **ter**, **tef** and **tem** class codes. The latter three indicate provisional failures returned by API calls. Only **tes** and **tec** codes appear in ledgers. Transactions that are not included in ledgers cannot have any effect on the ledger state (including XRP balances), but transitions that provisionally failed may still end up succeeding.

When working with [`rippled` APIs](rippled-api.html), applications must distinguish between candidate transactions proposed for inclusion in a ledger versus validated transactions which are included in a validated ledger. Only transaction results found in a validated ledger are immutable. A candidate transaction may or may not ever be included in a validated ledger.

Important: Some [`rippled` APIs](rippled-api.html) provide provisional results, based on candidate transactions <a href="#footnote_2" id="from_footnote_2"><sup>2</sup></a>. Applications should never rely on provisional results to determine the final outcome of a transaction. The only way to know with certainty that a transaction finally succeeded is to check the status of the transaction until it is both in a validated ledger and has result code tesSUCCESS. If the transaction is in a validated ledger with any other result code, it has failed. If the ledger specified in a transaction’s [`LastLedgerSequence`](transaction-common-fields.html) has been validated, yet the transaction does not appear in that ledger or any before it, then that transaction has failed and can never appear in any ledger. An outcome is final only for transactions that appear in a validated ledger or can never appear because of `LastLedgerSequence` restrictions as explained later in this document.

## The XRP Ledger Protocol – Consensus and Validation

The peer-to-peer XRP Ledger network consists of many independent XRP Ledger servers (typically running [`rippled`](the-rippled-server.html)) that accept and process transactions. Client applications sign and send transactions to XRP Ledger servers, which relay these candidate transactions throughout the network for processing. Examples of client applications include mobile and web wallets, gateways to financial institutions, and electronic trading platforms.

[![Figure 4: Participants in the XRP Ledger Protocol](img/xrp-ledger-network.png)](img/xrp-ledger-network.png)

_Figure 4: Participants in the XRP Ledger Protocol_

The servers that receive, relay and process transactions may be either tracking servers or validators. The major functions of tracking servers include distributing transactions from clients and responding to queries about the ledger. Validating servers perform the same functions as tracking servers and also contribute to advancing the ledger history. <a href="#footnote_3" id="from_footnote_3"><sup>3</sup></a>.

While accepting transactions submitted by client applications, each tracking server uses the last validated ledger as a starting point. The accepted transactions are candidates. The servers relay their candidate transactions to their peers, allowing the candidate transactions to propagate throughout the network. Ideally, each candidate transaction would be known to all servers, allowing each to consider the same set of transactions to apply to the last validated ledger. As transactions take time to propagate however, the servers do not work with the same set of candidate transactions at all times. To account for this, the XRP Ledger uses a process called consensus to ensure that the same transactions are processed and validated ledgers are consistent across the peer-to-peer XRP Ledger network.

### Consensus

The servers on the network share information about candidate transactions. Through the consensus process, validators agree on a specific subset of the candidate transactions to be considered for the next ledger. Consensus is an iterative process in which servers relay proposals, or sets of candidate transactions. Servers communicate and update proposals until a supermajority <a href="#footnote_4" id="from_footnote_4"><sup>4</sup></a> of chosen validators agree on the same set of candidate transactions.

During consensus, each server evaluates proposals from a specific set of servers, known as that server's trusted validators, or _Unique Node List (UNL)_.<a href="#footnote_5" id="from_footnote_5"><sup>5</sup></a> Trusted validators represent a subset of the network which, when taken collectively, is "trusted" not to collude in an attempt to defraud the server evaluating the proposals. This definition of "trust" does not require that each individual chosen validator is trusted. Rather, validators are chosen based on the expectation they will not collude in a coordinated effort to falsify data relayed to the network <a href="#footnote_6" id="from_footnote_6"><sup>6</sup></a>. <!-- STYLE_OVERRIDE: will -->

[![Figure 5: Validators Propose and Revise Transaction Sets](img/consensus-rounds.png)](img/consensus-rounds.png)

_Figure 5: Validators Propose and Revise Transaction Sets — At the start of consensus, validators may have different sets of transactions. In later rounds, servers modify their proposals to match what their trusted validators proposed. This process determines which transactions they should apply to the ledger version currently being discussed, and which they should postpone for later ledger versions._

Candidate transactions that are not included in the agreed-upon proposal remain candidate transactions. They may be considered again in for the next ledger version. Typically, a transaction which is omitted from one ledger version is included in the next ledger version.

In some circumstances, a transaction could fail to achieve consensus indefinitely. One such circumstance is if the network increases the required [transaction cost](transaction-cost.html) to a value higher than the transaction provides. The transaction could potentially succeed if the fees are lowered at some point in the future. To ensure that a transaction either succeeds or fails within a limited amount of time, transactions can be set to expire if they are not processed by a certain ledger index. For more information, see [Reliable Transaction Submission](reliable-transaction-submission.html).

### Validation

Validation is the second stage of the overall consensus process, which verifies that the servers got the same results and declares a ledger version final. In rare cases, the first stage of [consensus can fail](consensus-principles-and-rules.html#consensus-can-fail); validation provides a confirmation afterward so that servers can recognize this and act accordingly.

Validation can be broken up into roughly two parts:

- Calculating the resulting ledger version from an agreed-upon transaction set.
- Comparing results and declaring the ledger version validated if enough trusted validators agree.

#### Calculate and Share Validations

When the consensus process completes, each server independently computes a new ledger from the agreed-upon set of transactions. Each server calculates the results by following the same rules, which can be summarized as follows:

1. Start with the previous validated ledger.

2. Place the agreed-upon transaction set in _canonical order_ so that every server processes them the same way.

    [Canonical order](https://github.com/ripple/rippled/blob/8429dd67e60ba360da591bfa905b58a35638fda1/src/ripple/app/misc/CanonicalTXSet.cpp#L25-L36) is not the order the transactions were received, because servers may receive the same transactions in different order. To prevent participants from competing over transaction ordering, canonical order is hard to manipulate.

3. Process each transaction according to its instructions, in order. Update the ledger's state data accordingly.

    If the transaction cannot be successfully executed, include the transaction with a [`tec`-class result code](tec-codes.html).<a href="#footnote_1" id="from_footnote_1"><sup>1</sup></a>

    For certain "retriable" transaction failures, instead move the transaction to the end of the canonical order to be retried after other transactions in the same ledger version have executed.

4. Update the ledger header with the appropriate metadata.

    This includes data such as the ledger index, the identifying hash of the previous validated ledger (this one's "parent"), this ledger version's approximate close time, and the cryptographic hashes of this ledger's contents.

5. Calculate the identifying hash of the new ledger version.


[![Figure 7: An XRP Ledger Server Calculates a Ledger Validation](img/consensus-calculate-validation.png)](img/consensus-calculate-validation.png)

_Figure 7: An XRP Ledger Server Calculates a Ledger Validation — Each server applies agreed-upon transactions to the previous validated ledger. Validators send their results to the entire network._

#### Compare Results

Validators each relay their results in the form of a signed message containing the hash of the ledger version they calculated. These messages, called _validations_, allow each server to compare the ledger it computed with those of its peers.

[![Figure 8: Ledger is Validated When Supermajority of Peers Calculate the Same Result Result](img/consensus-declare-validation.png)](img/consensus-declare-validation.png)

_Figure 8: Ledger is Validated When Supermajority of Peers Calculate the Same Result — Each server compares its calculated ledger with the hashes received from its chosen validators. If not in agreement, the server must recalculate or retrieve the correct ledger._

Servers in the network recognize a ledger instance as validated when a supermajority of the peers have signed and broadcast the same validation hash <a href="#footnote_7" id="from_footnote_7"><sup>7</sup></a>. Going forward, transactions are applied to this updated and now validated ledger with ledger index N+1.

In cases where a server is in the minority, having computed a ledger that differs from its peers, the server disregards the ledger it computed <a href="#footnote_8" id="from_footnote_8"><sup>8</sup></a>. It recomputes the correct ledger, or retrieves the correct ledger as needed.

If the network fails to achieve supermajority agreement on validations, this implies that transaction volume was too high or network latency too great for the consensus process to produce consistent proposals. In this case, the servers repeat the consensus process. As time passes since consensus began, it becomes increasingly likely that a majority of the servers have received the same set of candidate transactions, as each consensus round reduces disagreement. The XRP Ledger dynamically adjusts [transaction costs](transaction-cost.html) and the time to wait for consensus in response to these conditions.

Once they reach supermajority agreement on validations, the servers work with the new validated ledger, ledger index N+1. The consensus and validation process repeats <a href="#footnote_9" id="from_footnote_9"><sup>9</sup></a>, considering candidate transactions that were not included in the last round along with new transactions submitted in the meantime.


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

Applications should only rely on information in validated ledgers, not on the provisional results of candidate transactions. Some [`rippled` APIs](rippled-api.html) initially return provisional results for transactions. The results of a transaction become immutable only when that transaction is included in a validated ledger, or the transaction includes `LastLedgerSequence` and does not appear in any validated ledger with that ledger index or lower.

Best practices for applications submitting transactions include:

- Use the `LastLedgerSequence` parameter to ensure that transactions validate or fail in a deterministic and prompt fashion.
- Check the results of transactions in validated ledgers.
    - Until a ledger containing the transaction is validated, or `LastLedgerSequence` has passed, results are provisional.
    - Transactions with result code **tesSUCCESS** and `"validated": true` have immutably succeeded.
    - Transactions with other result codes and `"validated": true` have immutably failed.
    - Transactions that fail to appear in any validated ledger up to and including the validated ledger identified by the transaction’s `LastLedgerSequence` have immutably failed.
        - Take care to use a server with a continuous ledger history to detect this case <a href="#footnote_10" id="from_footnote_10"><sup>10</sup></a>.
    - It may be necessary to check the status of a transaction repeatedly until the ledger identified by `LastLedgerSequence` is validated.

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





## Footnotes

<a href="#from_footnote_1" id="footnote_1"><sup>1</sup></a> – Transactions with [**tec** result codes](tec-codes.html) do not perform the requested action, but do have effects on the ledger. To prevent abuse of the network and to pay for the cost of distributing the transaction, they destroy the XRP [transaction cost](transaction-cost.html). To not block other transactions submitted by the same sender around the same time, they increment the sending account's [sequence number](basic-data-types.html#account-sequence). Transactions with `tec`-class results sometimes also perform maintenance such as deleting expired objects or unfunded trade offers.

<a href="#from_footnote_2" id="footnote_2"><sup>2</sup></a> – For example, consider a scenario where Alice has $100, and sends all of it to Bob. If an application first submits that payment transaction, then immediately after checks Alice’s balance, the API returns $0. This value is based on the provisional result of a candidate transaction. There are circumstances in which the payment fails and Alice’s balance remains $100 (or, due to other transactions, become some other amount). The only way to know with certainty that Alice’s payment to Bob succeeded is to check the status of the transaction until it is both in a validated ledger and has result code **tesSUCCESS**. If the transaction is in a validated ledger with any other result code, the payment has failed.

<a href="#from_footnote_3" id="footnote_3"><sup>3</sup></a> – Strictly speaking, validators are a subset of tracking servers. They provide the same features and additionally send "validation" messages. Tracking servers may be further categorized by whether they keep full vs. partial ledger history.

<a href="#from_footnote_4" id="footnote_4"><sup>4</sup></a> – Transactions fail to pass a round of consensus when the percentage of peers recognizing the transaction falls below a threshold. Each round is an iterative process. At the start of the first round, at least 50% of peers must agree. The final threshold for a consensus round is 80% agreement. These specific values are subject to change

<a href="#from_footnote_5" id="footnote_5"><sup>5</sup></a> – Each server defines its own trusted validators, but the consistency of the network depends on different servers choosing lists that have a high degree of overlap. For this reason, Ripple publishes a list of recommended validators.

<a href="#from_footnote_6" id="footnote_6"><sup>6</sup></a> – If proposals from all validators were evaluated, instead of exclusively from the validators chosen not to collude, a malicious attacker could run more validators to gain disproportionate power over the validation process, so they could introduce invalid transactions or omit valid transactions from proposals. The chosen validator list [defends against Sybil attacks](consensus-protections.html#sybil-attacks).

<a href="#from_footnote_7" id="footnote_7"><sup>7</sup></a> – The supermajority threshold, as of November 2014, requires that at least 80% of peers must agree for a ledger to be validated. This happens to be the same percentage required by a round of consensus. Both thresholds are subject to change and need not be equal.

<a href="#from_footnote_8" id="footnote_8"><sup>8</sup></a> – In practice, the server detects that it is in the minority before receiving validations from all peers. It knows when it receives non-matching validations from over 20% of peers that its validation cannot meet the 80% threshold. At that point, it can begin to recalculate a ledger.

<a href="#from_footnote_9" id="footnote_9"><sup>9</sup></a> – In practice, the XRP Ledger runs more efficiently by starting a new round of consensus concurrently, before validation has completed.

<a href="#from_footnote_10" id="footnote_10"><sup>10</sup></a> – A `rippled` server can respond to API requests even without a complete ledger history. Interruptions in service or network connectivity can lead to missing ledgers, or gaps, in the server’s ledger history. Over time, if configured to, `rippled` fills in gaps in its history. When testing for missing transactions, it is important to verify against a server with continuous complete ledgers from the time the transaction was submitted until its LastLedgerSequence. Use the RPC server_state to determine which complete_ledgers are available to a particular server.


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
