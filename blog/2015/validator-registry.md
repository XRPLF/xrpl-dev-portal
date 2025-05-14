---
date: "2015-08-18"
template: '../../@theme/templates/blogpost'
category: 2015
labels:
    - Features
markdown:
    editPage:
        hide: true
---
# Validator Registry

At Ripple Labs, our goal is to expand the size and diversity of the Ripple consensus network by enabling people to easily run rippled validators and understand how those validators perform. We aim to create a network where validating participants are well known and respected by gathering and publicizing identity information of validators in addition to performance statistics.

Today, we are excited to announce the launch of the Ripple Validator Registry at `xrpcharts.ripple.com/#/validators`. The Validator Registry gathers and publishes data for all network validators, enabling rippled operators to determine which validators to trust. An http-based API is also available for dynamically constructing rippled configurations. _[2025 Update: See <https://livenet.xrpl.org/network/validators> for the modern equivalent of the validator registry.]_


## Build a UNL
Running rippled involves selecting a UNL - a unique node list of trusted validators. There are two primary factors in determining validator trustworthiness: performance and operator identity.

### Performance
The Validator Registry provides several metrics for each validator based on uptime and network agreement:

- agreement - the percentage of ledgers that passed consensus that were validated by the validator
- disagreement - the percentage of ledgers validated by the validator that did not pass consensus

### Identity
Network participants are unlikely to trust validators without knowing who is operating them. To address this concern, validator operators can associate their validator with a web domain that they operate by following the steps for [Domain Verification](https://xrpl.org/docs/references/xrp-ledger-toml#domain-verification). The Validator Registry verifies these domains and lists them with the validators.

As the consensus network continues to grow, we hope the Validator Registry plays a key role in decentralizing and strengthening the network through open data.
