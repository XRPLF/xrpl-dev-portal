# Transaction Censorship Detection

[New in: rippled 1.2.0][]

The XRP Ledger is designed to be [censorship resistant](xrp-ledger-overview.html#censorship-resistant-transaction-processing). In support of this design, the XRP Ledger provides an automated transaction censorship detector that is available on all `rippled` servers, enabling all participants to see if censorship is affecting the network.

While a `rippled` server is in sync with the network, the detector tracks all transactions that, in the view of the `rippled` server, should have been accepted in the last round of [consensus](intro-to-consensus.html) and included in the last validated ledger. The detector issues log messages of increasing severity for transactions that have not been included in a validated ledger after several rounds of consensus.



## How It Works

At a high-level, here’s how the transaction censorship detector works:

1. The detector adds all transactions in a `rippled` server's initial consensus proposal to the tracker.

2. At the close of the consensus round, the detector removes all transactions included in the resulting validated ledger from the tracker.

3. The detector issues a [warning message](#example-warning-message) in the log for any transaction that remains in the tracker for 15 ledgers, surfacing it as a potentially censored transaction. The transaction's presence in the tracker at this time means that is has not been included in a validated ledger after 15 rounds of consensus. If the transaction remains in the tracker for another 15 ledgers, the detector issues another warning message in the log.

    For as long as the transaction remains in the tracker, the detector continues to issue a warning message in the log every 15 ledgers, for up to five warning messages. After the fifth warning message, the detector issues a final [error message](#example-error-message) in the log and then stops issuing warning and error messages.

    If you see these messages in your `rippled` server log, you should investigate why other servers are failing to include the transaction, starting with the assumption that the cause is more likely to be a [false positive](#potential-false-positives) (innocent bug) than malicious censorship.



## Example Warning Message

This is an example warning message issued by the transaction censorship detector after transaction E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7 remained in the tracker for 15 ledgers, from ledger 18851530 to ledger 18851545.

```text
LedgerConsensus:WRN Potential Censorship: Eligible tx E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7, which we are tracking since ledger 18851530 has not been included as of ledger 18851545.
```


## Example Error Message

This is an example error message issued by the transaction censorship detector after transaction E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7 remained in the tracker for 75 ledgers (5 sets of 15 ledgers), from ledger 18851530 to ledger 18851605.

```text
LedgerConsensus:ERR Potential Censorship: Eligible tx E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7, which we are tracking since ledger 18851530 has not been included as of ledger 18851605. Additional warnings suppressed.
```


## Potential False Positives

The transaction censorship detector may issue false positives in certain scenarios. In this case, a false positive means that the detector has flagged a transaction that has remained in the tracker for 15 ledgers or more, but for innocent reasons.

Here are some scenarios that could cause the detector to issue false positive messages:

- Your `rippled` server is running a build with code that is different from the rest of the network. This may cause your `rippled` server to apply transactions differently, resulting in false positives. While this type of false positive is unlikely, in general, it is crucial that you run the correct version of `rippled`.

- Your `rippled` server is out of sync with the network and has not yet realized it.

- `rippled` servers in the network, including possibly your own server, are being impacted by a class of bug that causes `rippled` servers to inconsistently relay transactions to other `rippled` servers in the network.

    Currently, there are no known bugs that cause this unexpected behavior. However, if you see the impact of what you suspect is a bug, consider reporting it to the [Ripple Bug Bounty](https://ripple.com/bug-bounty/) program.


## See Also

- **Concepts:**
    - [Consensus Principles and Rules](consensus-principles-and-rules.html)
    - [Transaction Queue](transaction-queue.html)
- **Tutorials:**
    - [Reliable Transaction Submission](reliable-transaction-submission.html)
    - [Understanding Log Messages](understanding-log-messages.html)
- **References:**
    - [Transaction Results](transaction-results.html)


{% include '_snippets/rippled_versions.md' %}
