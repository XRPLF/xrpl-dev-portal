---
html: locking-and-issuing-chains.html
parent: consensus-network.html
blurb: Learn about locking and issuing chains which enable value in the form of XRP and other tokens (IOUs) to move efficiently between the XRP Ledger and another chain, also known as a sidechain.
labels:
  - Blockchain
---
# Locking and Issuing Chains

Locking and issuing chains together represent a bridging solution between blockchains that enables the transfer of value from a locking chain to an issuing chain, for example the XRP Ledger (locking chain) and its sidechain(issuing chain).

A bridging solution between blockchains should support the following primitives:

* Put assets into trust on the locking chain.
* Issue wrapped assets on the issuing chain.
* Return or destroy wrapped assets on the issuing chain.
* Prove to an issuing chain that assets were put into trust on the locking chain.
* Prove to an issuing chain that assets were returned or destroyed on the locking chain.
* Prevent assets from being wrapped multiple times and prevent transaction replay.

A locking chain is a blockchain that holds assets that are then put into trust when a bridge to an issuing chain is created.

An issuing chain is an independent ledger with its own consensus algorithm and transaction types and rules. It acts as its own blockchain.

Both the locking and issuing chains operate as parllel networks with independent nodes and validators. They rely on independent [witness servers](witness-servers.md) to watch transactions between the two chains and attest that assets have moved into specifically designated accounts.

## How Do Cross-Chain Transactions Work?

Consider an example where Alice wants to send XRP from her account on the XRP Ledger mainchain (locking chain) to her account sAlice on a sidechain (issuing chain).

Before Alice can initiate a transaction, a bridge that transfers XRP between the XRP Ledger mainchain and the sidechain must be set up with XChainDoorCreate and witness servers must be running.

<!-- Add image of just the bridge created-->

![Cross-chain Transactions](img/xrpl-bridging-solution.png "Cross-chain transactions")

sAlice first checks out a sequence number with XChainSeqNumCreate on the sidechain, specifying the above bridge. She retrieves the sequence number from the transaction metadata or the TBD RPC call.

Alice then takes the cross-chain sequence number from sAlice’s XChainSeqNumCreate transaction and submits a XChainTransfer transaction on the mainchain with that sequence number, locking up a specified amount of XRP.

Alice then submits a witness request to the witness servers for the attestations of her XChainTransfer transaction on the mainchain.

sAlice takes the signatures from the witness servers and submits it as a part of a XChainClaim transaction on the sidechain, specifying her account as the destination. Assuming that she has enough attestations to reach quorum and the attestations are correct, this then releases the XRP on the sidechain to sAlice’s account.
