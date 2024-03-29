---
date: 2017-10-17
category: 2017
labels:
    - Features
theme:
    markdown:
        editPage:
            hide: true
---
# Decentralization Strategy Update

As Ripple progresses towards further decentralizing the XRP Ledger, we want to make server operators and members of the XRP Ledger community aware of a few upcoming changes to help ensure the reliability and stability of the network as it transitions to a distributed architecture with fully decentralized validators.

## Background

The XRP Ledger (formerly called the Ripple Consensus Ledger) was created in 2012, as a trust-based alternative to the proof-of-work consensus mechanism originated by Bitcoin. So far, most of that trust has relied upon validators owned and controlled by Ripple, the company leading development of the XRP Ledger.

Ripple chose deliberately to be the most trusted validator operator in the network during the initial stages of development of the XRP Ledger. This decision involved trade-offs to prioritize security and scalability ahead of decentralization.

Since inception, the XRP Ledger has closed over 33 million ledgers, processed over 600 million transactions amounting to more than $15 billion in transaction volume, with no major issues or network forks.

At present, the XRP Ledger can natively scale to 1,500 transactions per second. With Payment Channels, XRP can theoretically scale to tens of thousands of transactions per second—throughput levels comparable to VISA.  

With the security, stability, and throughput of the XRP Ledger thoroughly proven, Ripple feels that now is the time for a crucial next step in decentralization, while continuing to improve all aspects of the XRP Ledger software.

## Strategy

To meet the growing needs of customers, and further increase resiliency and stability of the XRP Ledger, Ripple is in a great position to fully execute on its [decentralization strategy](https://ripple.com/insights/how-we-are-further-decentralizing-the-ripple-consensus-ledger-rcl-to-bolster-robustness-for-enterprise-use/), which has been an ongoing process since 2012.

Phase one includes the diversification of validators by identity, location, hardware and software, in an effort to further mitigate the risk of a single point of failure. At the time of the announcement, 25 validator nodes were running with 5 trusted validators owned and managed by Ripple. Currently, [over 70 validator nodes](https://xrpcharts.ripple.com/#/validators) are running globally. During this phase Ripple will be adding 16 more trusted validators, in preparation for phase two.

During the second phase, for every two of the most reliable, reputable, stable, secure and attested validators added to the recommended list of trusted nodes, one validator node currently controlled by Ripple will be removed, until no entity operates a majority of recommended trusted nodes on the XRP Ledger.

The validator operators on this recommended list of trusted nodes believe in the long term vision of XRP and want to participate in the consensus process, which involves voting on proposed amendments, modifying fees and validating transactions.

## Changes

Before Ripple can progress to phase two, a few changes have to be made to ensure a safe transition.

With the 0.80.0 release, Ripple will transition its recommended validator list to a new hosted site. This involves a change in the default `rippled` configuration file. The `[validators]` field with its static list of trusted validators will be replaced with `[validator_list_keys]` and `[validator_list_sites]` fields containing the key Ripple will use to sign its newly recommended validator list as well as the URLs where the dynamic list can be found.

These changes will allow new validators to be safely added to the recommended validator list for phase two without requiring every `rippled` operator to manually update their configuration with each new addition.

It is important to note that, for operators who already use the recommended validator list, no further trust in Ripple is required during phase 1, despite the significant increase of validators under Ripple’s operational control. The validator list currently recommended by Ripple contains 5 validators operated by Ripple, and at the end of phase 1, the list will contain 16 such validators.

During phases 1 and 2, Ripple strongly recommends that operators use only the default Ripple-provided validator list. Consistent with this recommendation, the next scheduled release of `rippled`, version 0.81.0, will ship with a default configuration file using that list by default.

During phase 2, Ripple will begin decommissioning one validator under its operational control for every two third-party validators that demonstrate a strong reputation for stability, security and reliability. Ripple will also be working with other entities to establish independent providers of validator lists.

## Conclusion

Ripple remains committed to decentralizing the XRP Ledger and divesting itself of operational control. This multi-phase approach does that, but is intentionally conservative and has been devised with a single goal in mind: to ensure the reliability and stability of the network during the transition period to a fully decentralized and distributed architecture.
