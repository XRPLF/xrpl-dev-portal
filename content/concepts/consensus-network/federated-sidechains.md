---
html: federated-sidechains.html
parent: consensus-network.html
blurb: Learn about federated sidechains, which enable value in the form of XRP and other tokens (IOUs) to move efficiently between a sidechain and the XRP Ledger.
labels:
  - Blockchain
---
# Federated Sidechains

_Federated Sidechains are available as an Engineering Preview and can be used to develop and test using `rippled` 1.8.0._

A sidechain is an independent ledger with its own consensus algorithm and transaction types and rules. It acts as its own blockchain. Federation enables value in the form of XRP and other tokens to move efficiently between a sidechain and an XRP Ledger _mainchain_ (usually Mainnet, but could be [Testnet or Devnet](parallel-networks.html) for testing). Federated sidechains operate without compromising the speed, efficiency, and throughput of the public Mainnet.

Federated sidechains enable developers to launch new features and innovative applications using the foundation of XRP Ledger technology. Sidechains can customize the XRP Ledger protocol to the needs of a specific use case or project and run it as its own blockchain. Here are a few examples:

* Build a smart contract layer, powered by an engine compatible with the Ethereum Virtual Machine (EVM), web assembly, or a Move VM. 
* Build your own algorithmic stable coin with customised ledger types and transaction rules.
* Build permissioned or nearly permissionless, centralized or largely decentralized ledgers whose assets can be traded on the Mainnet [decentralized exchange](decentralized-exchange.html).
* Create private or public sidechains, and possibly make the public sidechains available to the community to leverage various use cases. For example, a [smart sidechain with Hooks](https://hooks-testnet.xrpl-labs.com/) enabled.

## How Federated Sidechains Work


A sidechain is an independent ledger with its own consensus algorithm and transaction types and rules. Each sidechain runs its own set of servers (nodes and validators) and does not rely on the validators on the Mainnet to submit transactions on the sidechain.

Each sidechain has two door accounts, one on the sidechain and one on the mainchain, that are controlled by the federators on the sidechain. The federators listen for transactions to and from both of these door accounts.

Federators, similar to validators on the mainchain but only live on the sidechain, jointly control the door accounts using the built-in multi-signature scheme available on the XRP Ledger. The door account has a signers list which consists of signing keys of all federators on the sidechain. 

When a door account receives a transaction, the federator signs the transaction and broadcasts this information to other federators on the sidechain.
Simultaneously, federators also listen for signed transactions from other federators and collect them.

A transaction is valid only when 80% of the signers on the list have signed. A quorum is reached when 80% of federators have signed and the transaction is submitted to the door account and an asset is issued to the destination.

When an asset is issued from the mainchain to the sidechain, that asset is locked up in the door account. The asset is only unlocked on the mainchain when a transaction from the sidechain to the main chain is submitted. Transactions within the sidechain are not visible to the servers on the sidechain. 


## Terminology

_Sidechain_: A sidechain is an independent ledger which provides a way to transfer assets from the XRP Ledger to the sidechain, and return assets from the sidechain back to the XRP Ledger. Each sidechain has its own consensus algorithm and transaction types and rules. 
 
_Federator_: A server on the sidechain that listens for triggering transactions on both the main chain and the side chain. Each federator has a signing key associated with it that is used to sign transactions. A transaction must be signed by a quorum of federators before it can be submitted. Federators are responsible for creating and signing valid response transactions, collecting signatures from other federators, and submitting transactions to the main chain and side chain.

_Main chain_: XRP Ledger where assets originate and where assets will be locked while being used on the side chain. For most applications, the main chain will be the XRP Ledger Devnet, Testnet, or Mainnet.

_Side chain_: Custom independent ledger where proxy assets for the locked main chain assets are issued. Side chains may have rules, transactors, and validators that are very different from the main chain. Proxy assets on the side chain can be sent back to the main chain where they will be unlocked from the control of the federators.

_Door account_: An account controlled by the federators. There are two door accounts: one on the main chain and one on the side chain. Cross chain transactions are started by users sending assets to a door account. Main chain to side chain transactions cause the balance to increase on the main chain door account and the balance to decrease on the side chain door account. It is called a "door" because it is the mechanism to move assets from one chain to another - much like going between rooms in a house requires stepping through a door.

_Triggering transaction_: A transaction that causes the federators to start the process of signing and submitting a new response transaction. For example, sending XRP to the main chain's door account is a triggering transaction that will cause the federators to submit a new transaction on the side chain.

_Response transaction_: A transaction submitted by the federators in reaction to a triggering transaction. Note that triggering transaction and response transaction depends on context. Sending XRP from a door account to a user account is a response transaction when thinking about cross chain transactions. It is a triggering transaction when thinking about how to handle failed transactions.


## How to Set Up a Federated Sidechain

Federated Sidechains are currently available as an Engineering Preview so you can experiment and explore the potential of sidechains. You can connect sidechains to the XRP Ledger Testnet, Devnet, or Mainnet as soon as network servers upgrade to XRPL 1.8.

**Caution:** You can connect sidechains to the XRP Ledger Mainnet to develop and test with small amounts; it is not recommended for production use cases until federated sidechains are available in a release. 

Setting up a sidechain involves the following high-level steps:

1. Clone the rippled sidechain branch: https://github.com/ripple/rippled/tree/sidechain.
2. Write custom transactors for your sidechain. Note that this is an important and non-trivial task. Refer to the XRP Ledger Protocol Reference for information about transaction types.
For example, the XRPL Labs Hooks project uses custom transactors. 
3. Each sidechain federator has its own configuration file that must be updated to include the following information:  
    - [sidechain] stanza - add details such as signing key, main chain account, and the main chain address (IP and port) to listen to. 
    - [sidechain_assets] stanza - define assets that can be used for cross-chain transactions (XRP or IOU), exchange rate for the assets, and optional refund penalty to discourage transactions that may default.
    - [sidechain_federators] stanza - list of federators public keys to be used for signing. This list is common for all federators on the sidechain.
4. Setup “Door” accounts to enable cross chain transactions which involves the following tasks:
    - Create and fund the door accounts. 
    - Set the signers list for the door accounts.
    - Reserve 3 tickets for error handling.
    - And finally, disable the master key to the door account to ensure that the federators jointly control the door account. 
    Note that it is important to perform this final step only after successful completion of the previous steps.


The _Sidechain Launch Kit_ is a commandline tool that simplifies setting up federated sidechains and can be used to quickly spin up a sidechain on your local machine. The launch kit also installs an interactive sidechain_shell (RiplRepl) that enables you to interact with the sidechain.

[Sidechain Launch Kit >](https://github.com/xpring-eng/sidechain-launch-kit/blob/main/README.md)


## See Also

- **Concepts:**
    - [Federated Sidechains Video](https://www.youtube.com/embed/UpVjO68tLIo)





