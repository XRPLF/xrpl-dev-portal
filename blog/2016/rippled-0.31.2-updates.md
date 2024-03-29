---
date: 2016-06-10
labels:
    - Release Notes
category: 2016
theme:
    markdown:
        editPage:
            hide: true
---
# rippled 0.31.2 and Other Updates

The `rippled` team is proud to announce a bundle of related news items:

* [`rippled` release 0.31.2](#rippled-0312)
* [Amendments system](#amendments-system)
* [Transaction cost changes](#transaction-cost-changes)
* [Multi-signing](#multi-signing)

## rippled 0.31.2 ##

`rippled` 0.31 introduced several new features, including Amendments, Multi-Signing, a transaction queue, and changes to transaction cost escalation. Version 0.31.2 includes important fixes for security, stability, and compatibility with the official validators run by Ripple (the company).

We recommend all users, especially validators, upgrade as soon as possible:

* For Red Hat Enterprise Linux 7 or CentOS, you can [update to the new version using `yum`](https://ripple.com/build/rippled-setup/#updating-rippled).
* For other platforms, please [compile the new version from source](https://github.com/ripple/rippled/tree/master/Builds).
* For more information, see the `rippled` [0.31.2 release notes](https://github.com/ripple/rippled/releases/tag/0.31.2) and [0.31.0 release notes](https://github.com/ripple/rippled/releases/tag/0.31.0) on GitHub.

## Amendments System ##

Amendments are a new feature introduced in `rippled` 0.31.0. The Amendments system provides a means of introducing new features to the decentralized Ripple consensus network without causing disruptions. The first amendment, FeeEscalation, is already live, having been approved on 2016-05-05. This amendment provides improvements to the handling of transactions when the network is under load.

The next amendment, MultiSign, introduces a way to authorize transactions using multiple signatures, for greater security and flexibility.

For more information, see [Amendments in the Ripple Developer Center](https://ripple.com/build/amendments/).

## Transaction Cost Changes ##

We have brought two significant changes to [transaction costs](https://ripple.com/build/transaction-cost/) in the `rippled` 0.31 releases. First, the FeeEscalation amendment changed the way the network escalates transaction costs under load. Second, `rippled` 0.31.2 has decreased the minimum transaction cost back to its previous value of 0.00001 XRP (10 drops).

Previously, transaction costs tended to spike rapidly when the network was under load and drop quickly when the backlog was processed, causing network volatility. As a temporary fix, Ripple configured the official validating servers to always report a load multiplier of 1000 or more. This effectively increased transaction costs from 0.00001 XRP to 0.01 XRP.

The FeeEscalation amendment, introduced in `rippled` 0.31.0 and approved by consensus on 2016-05-05, fixes this problem. The new algorithm dynamically adjusts the transaction cost based on the number of unconfirmed transactions relative to the number the network is able to confirm each round. The new algorithm reduces volatility and gives users more control over the XRP costs they pay for transactions.

An integral part of the new transaction cost algorithm is a transaction queue. If transaction costs rise because of high network load, users can submit low priority, legitimate transactions to the transaction queue to be considered for future ledgers when load decreases and transaction costs drop. The queue also makes transactions submitted during high traffic periods more likely to succeed.

With the new algorithm in place, the transaction cost escalation actually works better without the load multiplier artificially increased. Consequently, `rippled` version 0.31.2 removes the 1000× minimum from the load multiplier. Effective immediately, the minimum transaction cost is back to 0.00001 XRP. When load on the consensus network is higher, you can queue a transaction for a later ledger by paying this cost, or pay a higher XRP cost to get into the current open ledger. (How much higher depends on how large the transaction backlog is.)

## Multi-signing ##

The `rippled` team is excited to announce that the next feature to be enabled by Amendment is the ability to multi-sign transactions. Multi-signing is a new way of authorizing transactions for the Ripple Consensus Ledger, using multiple secret keys. After setting up multi-signing for an account, you can put the master secret in cold storage, or even disable the master key entirely. With multiple secret keys required to authorize a multi-signature, you can improve security in many ways.

Ripple plans to configure its validators to start voting in favor of the MultiSign amendment on 2016-06-13. If the feature maintains a majority for two weeks after that, multi-signing will become an active part of the protocol starting **2016-06-27**.

For more information, see the following articles in the Ripple Developer Center:

* [MultiSign Amendment](https://ripple.com/build/amendments/#multisign)
* [Multi-Signing transaction reference](https://ripple.com/build/transactions/#multi-signing)
* [How to Multi-Sign Tutorial](https://ripple.com/build/how-to-multi-sign/)
