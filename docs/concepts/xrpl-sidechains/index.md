---
html: xrpl-sidechains.html
parent: concepts.html
seo:
    description: An XRPL sidechain is an independent ledger with its own consensus algorithm, transaction types, and rules.
labels:
  - Blockchain
  - Interoperability
---
# XRPL Sidechains

_(Requires the [XChainBridge amendment][] {% not-enabled /%})_

A sidechain is an independent ledger with its own consensus algorithm, transaction types, rules, and nodes. It acts as its own blockchain, running parallel to the mainchain (XRP Ledger), enabling value to move between the two without compromising the speed, efficiency, and throughput of the mainchain.

Sidechains can customize the XRP Ledger protocol to the needs of a specific use case or project and run it as its own blockchain. Some examples include:

* Adding a smart contract layer. See: [Xahau](https://xahau.network/)
* Adding Ethereum Virtual Machine (EVM) compatibility. See: [EVM Sidechain](https://opensource.ripple.com/docs/evm-sidechain/intro-to-evm-sidechain/).
* Building your own algorithmic stable coin with customised ledger types and transaction rules.
* Building permissioned or nearly permissionless, centralized or largely decentralized ledgers whose assets can be traded on the Mainnet [decentralized exchange](../tokens/decentralized-exchange/index.md).


**Notes:**

  - Sidechains use their own validators and require a separate UNL from the mainchain `rippled` UNL.
  - Nodes on the mainchain and sidechain have no knowledge of each other.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
