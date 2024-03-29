---
category: 2020
date: 2021-02-07
labels:
    - Features
theme:
    markdown:
        editPage:
            hide: true
author: Mayur Bhandary
---
# Running an XRP Ledger Validator

Validators are the lifeblood of the XRP Ledger. This post seeks to explain the function and importance of validators on the XRP Ledger network.

<!-- BREAK -->

## Background

Like all decentralized ledgers, the XRP Ledger is a program that lives on a distributed set of servers. These servers run a program called [`rippled`](https://github.com/ripple/rippled). Every server can follow the network with a local copy of the ledger and submit transactions to the network. A smaller subset of servers contribute to the consensus process that helps to maintain forward progress of the network. These servers are called validators. Any server that runs rippled can operate as a validator by [enabling validation](https://xrpl.org/run-rippled-as-a-validator.html).

Validators agree on the set of the candidate transactions to be considered for the next ledger through the [consensus process](https://xrpl.org/consensus.html). Each validator evaluates transaction proposals from a specific set of trusted validators called a Unique Node List (UNL). Validators that appear on a UNL are "trusted" not to collude in an attempt to defraud the server evaluating the proposals. In each round of consensus, validators add transactions to their proposals if a threshold number of trusted validators also propose those transactions. The threshold is increased until a supermajority of validators propose the same set of transactions.

Finally, every rippled server independently computes a new ledger version with the new set of transactions. Validators broadcast the hash of the new ledger version to all rippled servers, and if a supermajority of a server’s trusted validators computes the same hash, then the ledger version is considered fully validated.


## Why Run a Validator

Those who operate validators do so because they have a demonstrated interest in the long term health of the network. For example, individuals and entities that rely on XRP for their business operations, all stand to benefit from the continued reliability, stability and performance of the XRP Ledger.

For those more familiar with crypto, the rationale for running a validator is similar to why someone would run a [Bitcoin Full Node](https://bitcoin.org/en/full-node): by contributing to the ecosystem, one hopes that it will continue to thrive and grow.

Validator operators that appear on a UNL also partake in the governance of the XRP Ledger through voting on fees and amendments, which are proposed changes to the protocol.


## Being a Good Validator

The characteristics of a good validator include high availability, agreement with the network, timeliness, and identification. In order to achieve these properties, it is important to adhere to the [recommended system specifications](https://xrpl.org/system-requirements.html#recommended-specifications) for production servers and [properly configure](https://xrpl.org/run-rippled-as-a-validator.html) the validator.

Beyond the administrative elements of running a validator, it is important for validator operators to be involved in the XRP community by announcing potential downtime or maintenance work ahead of time. Validators that appear on a UNL have the opportunity to vote on amendments and fees, thereby having a voice in the evolution of the network. Therefore, it is imperative that validator operators stay abreast of the [latest updates](https://xrpl.org/blog/) coming to the XRP Ledger.


## No Incentive: A Design Decision

Unlike other decentralized ledgers, the XRP Ledger does not provide a direct economic incentive for contributing to the consensus process by running a validator. Other blockchains offer direct incentives such as rewards from mining and staking or trading advantages. Instead, the lack of direct incentives for XRP Ledger validators attracts natural stakeholders.

If you want to learn more about natural stakeholders and the design decision behind no incentive, then we invite you to attend a talk by David Schwartz, Chief Architect of the XRP Ledger and CTO of Ripple, titled “The Best Incentive is No Incentive” at [Stanford Blockchain Conference](https://cbr.stanford.edu/sbc20/).
