---
html: cross-chain-bridges.html
parent: xrpl-sidechains.html
blurb: Cross-chain bridges for the XRP Ledger enable value in the form of XRP and other tokens (IOUs) to move efficiently between blockchains.
status: not_enabled
labels:
  - Blockchain
  - Interoperability
---
# Cross-Chain Bridges

_(Requires the [XChainBridge amendment][] :not_enabled:)_

Cross-chain bridges enable you to move XRP and tokens between the XRP Ledger and other blockchains.

A locking chain is a blockchain that holds assets that are then put into trust when a bridge to an issuing chain is created.

An issuing chain is an independent ledger with its own consensus algorithm and transaction types and rules. It acts as its own blockchain.

Both the locking and issuing chains operate as parallel networks with independent nodes and validators. They rely on independent [witness servers](witness-servers.html) to watch transactions between the two chains and attest that assets have moved into specifically designated accounts.


## Terminology

- **Bridge**: A method of moving assets/value from one blockchain to another.

- **Locking Chain**: The chain on which the bridge locks and unlocks assets.

- **Issuing Chain**: The chain on which the bridge mints and burns assets.

- **Witness**: Independent servers that are aware of the locking and issuing chains. See [witness servers](witness-servers.html) for more information.

- **Attestation**: A message signed by a witness server, verifying a transaction occurred on a chain. There are attestations for `XChainCommit` and `XChainAccountCreateCommit` transactions.

- **Cross-chain transfer**: A transfer of assets from one chain to another.

- **Source chain**: The chain that a cross-chain transfer begins from. The transfer is from the source chain and to the destination chain.

- **Destination chain**: The chain that a cross-chain transfer ends at. The transfer is from the source chain and to the destination chain.

- **Door account**: A special type of account that is used to move assets from one chain to another. The door account on a locking chain is used to put assets into trust, and the door account on an issuing chain used to issue wrapped assets. 

- **Cross-chain claim ID**: A special identifier used for cross-chain transfers. A cross-chain claim ID represents *one* cross-chain transfer of value.


## How Do Cross-Chain Transactions Work?
 
At a high-level, cross-chain transactions involve the following steps: 

1. Claim a cross-chain claim ID on the issuing chain.
2. Submit a commit transaction on the locking chain, attaching the claimed cross-chain claim ID and include a reward for the witness servers. This locks the asset on the locking chain.
3. Obtain the attestations from the witness servers that the transaction occurred on the issuing chain.
4. When there are enough signatures to reach quorum, the XRP is automatically released on the issuing chain to the destination account. In some cases, for example a trustline is not set up properly, or a deposit auth is set up, you need to submit a transaction claim for the transferred value on the issuing chain, attaching the attestation as proof that the value was indeed transferred.
5. The rewards are then distributed to the witness servers' accounts on the issuing chain.


## Test Cross-Chain Transactions


### Client Library Support (Beta)

- **JavaScript:** xrpl.js 2.7.0-beta.3
  - **Binary Codec:** ripple-binary-codec 1.5.0-beta.3
- **Python:** xrpl-py 1.8.0b2


### XBridge-CLI

The [`xbridge-cli`](https://github.com/XRPLF/xbridge-cli) is a commandline tool that simplifies setting up a cross-chain bridge on your local machine.

Follow the [tutorial](https://github.com/XRPLF/xbridge-cli/blob/main/scripts/tutorial.sh) to walk through the steps of creating a bridge and completing your first cross-chain transaction.


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
