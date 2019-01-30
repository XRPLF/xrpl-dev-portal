# Transaction Censorship Detection

The XRP Ledger is designed to be [censorship resistant](xrp-ledger-overview.html#censorship-resistant-transaction-processing). Any attempt to censor transactions requires coordinated action by a majority of the XRP Ledger network's validators.

XRP Ledger provides an automated transaction censorship detector that is available on all `rippled` servers, enabling all participants to see if censorship is affecting the network.

While a `rippled` server is in sync with the network, the detector tracks all transactions that, in the view of the `rippled` server, should have been accepted in the last round of [consensus](intro-to-consensus.html) and included in the last validated ledger. The detector issues log messages of increasing severity for transactions that have not been included in a validated ledger after several rounds of consensus.

A `rippled` server is considered to be in sync if it meets the following criteria: ***TODO: Is this info useful or overkill?***

- It has a `server_state` of `full` or `proposing`.
- It has the network's last fully validated ledger.
- It has good connectivity.
- It is tracking the current consensus round.

At a high-level, here’s how the transaction censorship detector works:

1. The detector adds all transactions in a `rippled` server's initial consensus proposal to the tracker.

2. At the close of the consensus round, the detector removes all transactions included in the resulting validated ledger from the tracker.

3. The detector issues a [warning message](#example-warning-message) in the log for any transaction that remains in the tracker for 15 ledgers, surfacing it as a potentially censored transaction. The transaction's presence in the tracker at this time means that is has not been included in a validated ledger after 15 rounds of consensus. If the transaction remains in the tracker for another 15 ledgers, the detector issues another warning message in the log.

    For as long as the transaction remains in the tracker, the detector continues to issue a warning message in the log every 15 ledgers, for up to five warning messages. After the fifth warning message, the detector issues a final [error message](#example-error-message) in the log and then stops issuing warning and error messages.

    If you see these messages in your `rippled` server log, you may want to investigate, off-ledger, why other `rippled` servers are failing to include the transaction.



## Example Warning Message

This is an example warning message issued by the transaction censorship detector after transaction E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7 remained in the tracker for 15 ledgers, from ledger 18851530 to ledger 18851545.

        Potential Censorship: Eligible tx E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7, which we are tracking since ledger 18851530 has not been included as of ledger 18851545.



## Example Error Message

This is an example error message issued by the transaction censorship detector after transaction E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7 remained in the tracker for 75 ledgers (5 sets of 15 ledgers), from ledger 18851530 to ledger 18851605.

        Potential Censorship: Eligible tx E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7, which we are tracking since ledger 18851530 has not been included as of ledger 18851605. Additional warnings suppressed.
