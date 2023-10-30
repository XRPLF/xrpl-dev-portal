---
html: xrpl-sidechains.html
parent: concepts.html
blurb: An XRPL sidechain is an independent ledger with its own consensus algorithm, transaction types, and rules.
labels:
  - Blockchain
  - Interoperability
---
# XRPL Sidechains

_(Requires the [XChainBridge amendment][] :not_enabled:)_

A sidechain is an independent ledger with its own consensus algorithm, transaction types, rules, and nodes. It acts as its own blockchain, running parallel to the mainchain (XRP Ledger), enabling value to move between the two without compromising the speed, efficiency, and throughput of the mainchain.

Sidechains can customize the XRP Ledger protocol to the needs of a specific use case or project and run it as its own blockchain. Some examples include:

* Adding a smart contract layer, powered by an engine compatible with the Ethereum Virtual Machine (EVM), web assembly, or a Move VM. For an example, see: [Hooks](https://hooks-testnet.xrpl-labs.com/).
* Building your own algorithmic stable coin with customised ledger types and transaction rules.
* Building permissioned or nearly permissionless, centralized or largely decentralized ledgers whose assets can be traded on the Mainnet [decentralized exchange](decentralized-exchange.html).


**Notes:**

  - Sidechains use their own validators and require a separate UNL from the mainchain `rippled` UNL.
  - Nodes on the mainchain and sidechain have no knowledge of each other.


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}