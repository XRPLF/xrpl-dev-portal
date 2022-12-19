---
html: cross-chain-bridges.html
parent: xrpl-interoperability.html
blurb: Cross-chain bridges for the XRP Ledger enable value in the form of XRP and other tokens (IOUs) to move efficiently between blockchains.
labels:
  - Blockchain
---
# Cross-Chain Bridges

Cross-chain bridges for the XRP Ledger enable value in the form of XRP and other tokens (IOUs) to move efficiently between blockchains such as the XRP Ledger and its sidechains.

A locking chain is a blockchain that holds assets that are then put into trust when a bridge to an issuing chain is created.

An issuing chain is an independent ledger with its own consensus algorithm and transaction types and rules. It acts as its own blockchain.

Both the locking and issuing chains operate as parallel networks with independent nodes and validators. They rely on independent [witness servers](witness-server.html) to watch transactions between the two chains and attest that assets have moved into specifically designated accounts.

## Terminology

* *Bridge*: A method of moving assets/value from one blockchain to another.

* *Witness*: Independent servers that are aware of the locking and issuing chains. See [witness servers](witness-server.html) for more information.

* *Cross-chain transfer*: A transfer of assets from one chain to another.

* *Source chain*: The chain that a cross-chain transfer begins from. The transfer is from the source chain and to the destination chain.

* *Destination chain*: The chain that a cross-chain transfer ends at. The transfer is from the source chain and to the destination chain.

* *Locking chain*: The chain on which the bridge locks and unlocks assets.

* *Issuing chain*: The chain on which the bridge mints and burns assets.

* *Door account*: A special type of account that is used to move assets from one chain to another. The door account on a locking chain is used to put assets into trust, and the door account on an issuing chain used to issue wrapped assets. 

* *Cross-chain claim ID*: A special identifier used for cross-chain transfers. A cross-chain claim ID represents *one* cross-chain transfer of value.

## How Do Cross-Chain Transactions Work?

### Prerequisites

Ensure that the following are set up and running before initiating cross-chain transactions. 

* The locking and issuing chains are both up and running.
* The witness server(s) are up and running.
* Set up a bridge between the two chains, including a _door account_ on each chain. On one chain, the asset is locked and unlocked, hence the name "locking chain", and on the other chain, assets are minted and burned, or issued and reclaimed, hence the name "issuing chain".
* Enable the `XChainBridge` amendment in the `rippled.cfg` configuration file on the locking chain and the issuing chain. 

### How Do Cross-Chain Transactions Work ?
 
At a high-level, cross-chain transactions involve the following steps: 

1. Claim a cross-chain claim ID on the issuing chain.
2. Submit a commit transaction on the locking chain, attaching the claimed cross-chain claim ID and include a reward for the witness servers. This locks the asset on the locking chain.
3. Obtain the attestations from the witness servers that the transaction occurred on the issuing chain.
4. When there are enough signatures to reach quorum, the XRP is automatically released on the issuing chain to the destination account. In some cases, for example a trustline is not set up properly, or a deposit auth is set up, you need to submit a transaction claim for the transferred value on the issuing chain, attaching the attestation as proof that the value was indeed transferred.
6. The rewards are then distributed to the witness servers' accounts on the issuing chain.

Consider an example where Alice wants to send XRP from her account on the XRP Ledger Mainnet to her account sAlice on a sidechain. In this example. the XRP Ledger Mainnet is the locking chain and the sidechain is the issuing chain. 

For the sake of this example, let's assume that the following prerequisites have been met.

* The sidechain has been configured with validators and is up and running.
* A bridge that transfers XRP between the locking chain and the issuing chain has been set up with `XChainCreateBridge`.
* Witness servers are up and running.
* Alice has already run a `XChainCreateAccountCommit` transaction and has an account on the sidechain.

<!-- Add image of just the bridge created-->

![Cross-chain Transactions](img/xrpl-bridging-solution.png "Cross-chain transactions")

1. sAlice first checks out a claim ID with `XChainCreateClaimID` on the sidechain, specifying the above bridge. She retrieves the claim ID from the transaction metadata or the `xchaincreateclaimid` RPC call.

2. Alice then takes the cross-chain claim ID from sAlice’s `XChainCreateClaimID` transaction and submits a `XChainCommit` transaction on the XRP Ledger Mainnet with that claim ID, locking up a specified amount of XRP. She specifies sAlice’s account in the `OtherChainDestination` field.

3. The witnesses then take note of the `XChainCommit` transaction and submit `XChainAddAttestation` transactions on the sidechain, attesting to the fact that the `XChainCommit` transaction did in fact occur on the Mainnet.

4. When there are enough `XChainAddAttestation` signatures to reach quorum, the XRP is automatically released on the sidechain to sAlice’s account.

5. If the XRP is not automatically released, for whatever reason (such as Alice forgetting to specify sAlice’s account in the `OtherChainDestination` field), then sAlice submits a `XChainClaim` transaction on the sidechain, specifying her account as the destination. This then releases the XRP on the sidechain to sAlice’s account.

## How to Set Up a Sidechain? 

The [`xrpl-sidechain-cli`](https://github.com/XRPLF/sidechain-cli) is a commandline tool that simplifies setting up a cross-chain bridge and issuing chains on your local machine. 

Follow the [tutorial](https://github.com/XRPLF/sidechain-cli/blob/main/scripts/tutorial.sh) to walk through the steps of creating a bridge and completing your first cross-chain transaction. 


## XRPL Custom Network Explorer 

The XRP Ledger Explorer provides a way to look up historical transactions, accounts, ledgers, fees, exchange rates, timestamps, sequence numbers, node uptime, IP addresses, topology, versions and peers for the XRP Ledger mainchain. 

Similarly, you can use the [XRP Ledger Custom Network Explorer](https://custom.xrpl.org/) to connect an XRP Ledger Sidechain (_issuing chain_) and look up network information. 


## See Also

- [Witness Server](witness-server.html)
- [Tutorial](https://github.com/XRPLF/sidechain-cli/blob/main/scripts/tutorial.sh)
- [Transaction Reference](transaction-types.html)
    - [xchainaccountcreatecommit](xchainaccountcreatecommit.html)
    - [xchaincreatebridge](xchaincreatebridge.html)
    - [xchaincreateclaimid](xchaincreateclaimid.html)
    - [xchaincommit](xchaincommit.html)
    - [xchainaddattestation](xchainaddattestation.html)
    - [xchainclaim](xchainclaim.html)
    - [xchainmodifybridge](xchainmodifybridge.html)



