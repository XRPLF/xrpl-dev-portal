---
date: 2014-12-07
category: 2014
labels:
    - Advisories
    - Security
theme:
    markdown:
        editPage:
            hide: true
---
# Why the Stellar Forking Issue Does Not Affect Ripple

The Stellar Development Foundation (SDF) which maintains Stellar, a network built on a modified version of the Ripple code base, recently published a post claiming flaws in the Ripple consensus algorithm. We take any reports about possible security issues very seriously and after reviewing the information conclude that there is no threat to the continued operation of the Ripple network. We'd like to share our thoughts.

Quoting the post in question:

> **Issue 1: Sacrificing safety over liveness and fault tolerance—potential for double spends**
>
> _The Fischer Lynch Paterson impossibility result (FLP) states that a deterministic asynchronous consensus system can have at most two of the following three properties: safety (results are valid and identical at all nodes), guaranteed termination or liveness (nodes that don’t fail always produce a result), and fault tolerance (the system can survive the failure of one node at any point). This is a proven result._

This is correct.

> _Any distributed consensus system on the Internet must sacrifice one of these features._

This is potentially misleading. The FLP result shows that no system can provide those guarantees and reach consensus in bounded time. Real-world implementations of consensus like Paxos and Ripple however use probability to achieve safety, liveness and fault tolerance within a given time limit with very high likelihood.

If consensus is not achieved in this timeframe, the algorithm will retry and once again achieve consensus with very high likelihood and so on. In statistical terms, consensus will eventually be reached with [probability 1](http://en.wikipedia.org/wiki/Almost_surely), satisfying liveness under a probabilistic model. In practice, progress is usually made every round and two or more rounds are very rarely needed.

This means that distributed consensus systems like the Ripple network and Google’s Spanner database exist and can provide extremely high availability if configured correctly.

> _The existing Ripple/Stellar consensus algorithm is implemented in a way that favors fault tolerance and termination over safety._

This is incorrect. We have not reviewed Stellar's modified version of Ripple consensus, but as far as the Ripple consensus algorithm is concerned, the protocol provides safety and fault tolerance assuming the validators are configured correctly. For a detailed proof, please see our [consensus white paper](https://ripple.com/files/ripple_consensus_whitepaper.pdf).

> _This means it prioritizes ledger closes and availability over everyone actually agreeing on what the ledger is—thus opening up several potential risk scenarios._

This is incorrect. If a quorum cannot be reached, validators will retry until connectivity has been restored.

> **Issue 2: Provable correctness**
>
> _Prof. David Mazières, head of Stanford’s Secure Computing Group, reviewed the Ripple/Stellar consensus system and reached the conclusion that the existing algorithm was unlikely to be safe under all circumstances._

We look forward to reading Prof. Mazières' findings once they are published.

> _Based \[on\] these findings, we decided to create a new consensus system with provable correctness._

As mentioned before, a proof of Ripple's correctness is available in the form of the Ripple [consensus white paper](https://ripple.com/files/ripple_consensus_whitepaper.pdf).

As Ripple Labs' chief cryptographer and the original developer of Ripple consensus David Schwartz [pointed out yesterday](https://forum.ripple.com/viewtopic.php?f=1&t=8629&p=59073#p59073) _(dead link)_, there cannot be two conflicting majority sets without overlap. For bootstrapping with a small set of trusted validators, it is appropriate to use a crash-recovery fault model, meaning a simple majority such as three out of five is sufficient. In other words, it is impossible for the Ripple network to experience an unintentional ledger fork as Stellar’s did because our nodes require votes from a majority of validators. In the future, we will generally recommend a supermajority greater than two thirds to account for Byzantine faults (validators that act arbitrarily or maliciously), but otherwise the same concepts apply.

In either case, anyone wishing to join a specific set of mutually consenting validators in the Ripple topology can do so by configuring their local Ripple node appropriately. We recognize the immense task of building the world's first global consensus graph. It is a hard problem, but not an impossible one. Like the transition from Arpanet to the distributed routing topology of the modern internet, it will require time, education and a great deal of caution. But thanks to our amazing partners and colleagues, we are ready to tackle this challenge.

The Ripple network and its distributed ledger have used the Ripple consensus protocol to operate reliably for two years and currently manage $1.4 million in daily volume. We continue to invest in scaling Ripple to support the world's cross-border transactions with bank partners in the U.S. and Europe actively integrating today.
