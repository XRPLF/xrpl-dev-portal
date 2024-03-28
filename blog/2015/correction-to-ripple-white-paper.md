---
date: 2015-09-02
category: 2015
labels:
    - Advisories
theme:
    markdown:
        editPage:
            hide: true
---
# Correction to Ripple White Paper

We've recently been made aware of a [paper](http://www.ghassankarame.com/ripple.pdf) discussing the possibility of forks in the Ripple system. We agree with the authors' conclusion that a fork is not possible given that the UNL overlap is greater than 40%. Unfortunately, this is different than the 20% figure stated in our [2014 white paper](https://ripple.com/consensus-whitepaper/). We apologize for the oversight and are issuing a corrected version.

We'd like to point out that our validators are in fact configured with an overlap of 100%, which is also our current recommendation to partners. In other words, these new findings confirm our understanding that the live Ripple network has been and continues to be safe from forks.

In the paper the authors reference “several forks” in distributed ledger protocols, citing two sources. The first one is a blog post about [a fork in the Bitcoin network](https://bitcoinmagazine.com/3668/bitcoin-network-shaken-by-blockchain-fork/). The second is a blog post about [a fork in the Stellar network](https://www.stellar.org/blog/safety_liveness_and_fault_tolerance_consensus_choice/). We’d like to point out that neither of these systems use the Ripple consensus protocol in conjunction with our recommended configuration. There has been no such incident on the Ripple network after nearly three years of operation and more than 15 million ledger closes.

We're excited to see increased interest from the academic community in Ripple consensus. As we work to diversify validator sets, we are also increasing our own efforts to contribute to consensus research. Our 2014 white paper was the first formal description of Ripple-style consensus and there’s a lot more to explore. We're working to provide more detailed descriptions of Byzantine fault tolerance in Ripple and the safety of certain topologies of validators.

If you are currently in academia studying consensus or graph problems, please reach out to us at <research@ripple.com>.
