---
html: federated-sidechains.html
parent: consensus-network.html
blurb: Learn about federated sidechains, which enable value in the form of XRP and other tokens (IOUs) to move efficiently between a sidechain and the XRP Ledger.
labels:
  - Blockchain
---
# Federated Sidechains

_Federated Sidechains are available as an Engineering Preview and can be used to develop and test using `rippled` 1.8.0._

A sidechain is an independent ledger with its own consensus algorithm and transaction types and rules. It acts as its own blockchain. Federation enables value in the form of XRP and other tokens to move efficiently between a sidechain and an XRP Ledger _mainchain_ (usually Mainnet, but could be [Testnet or Devnet](parallel-networks.html) for testing). Federated sidechains run without compromising the speed, efficiency, and throughput of the public Mainnet.

Federated sidechains enable developers to launch new features and innovative applications using the foundation of XRP Ledger technology. Sidechains can customize the XRP Ledger protocol to the needs of a specific use case or project and run it as its own blockchain. Here are a few examples:

* Build a smart contract layer, powered by an engine compatible with the Ethereum Virtual Machine (EVM), web assembly, or a Move VM. For example, a [smart sidechain with Hooks](https://hooks-testnet.xrpl-labs.com/) enabled.
* Build your own algorithmic stable coin with customised ledger types and transaction rules.
* Build permissioned or nearly permissionless, centralized or largely decentralized ledgers whose assets can be traded on the Mainnet [decentralized exchange](decentralized-exchange.html).

## How Federated Sidechains Work


A sidechain is an independent ledger with its own consensus algorithm and transaction types and rules. Each sidechain is run by its own set of servers (including validators) and does not rely on the validators on the Mainnet for transactions on the sidechain.

Each sidechain has two door accounts, one on the sidechain and one on the mainchain, that are controlled by the federators on the sidechain. The federators listen for transactions to and from both of these door accounts.

The sidechain has _federators_ who jointly control the door accounts on both networks using [multi-signing](multi-signing.html) so that 80% of federators must approve a transaction. In many cases, the federators should also be the trusted validators of the sidechain.

When a door account receives a transaction on either the sidechain or the mainchain, the federators create a mirror transaction on the other chain. (For example, if you send XRP _to_ the mainchain door account, the federators create a transaction on the sidechain to send XRP _from_ the sidechain door account to the intended recipient.) The federators sign the transaction and broadcast it to each other. Simultaneously, federators also listen for signed transactions from other federators and collect them.

When 80% of the federators have signed the transaction, they submit it to the sidechain or mainchain as appropriate. This way, assets that the mainchain door account holds can be allocated to others on the sidechain, and assets that sidechain door account receives can be sent to others on the mainchain.

Transactions within the sidechain are not visible to the servers on the mainchain. 


## Terminology

Below is an alphabetical list of terms and their definitions.

_Door account_: An account controlled by the federators. There are two door accounts: one on the mainchain and one on the sidechain. Cross chain transactions are started by users sending assets to a door account. Mainchain to sidechain transactions cause the balance to increase on the mainchain door account and the balance to decrease on the sidechain door account. It is called a "door" because it is the mechanism to move assets from one chain to another—much like going between rooms in a house requires stepping through a door.

_Federator_: A server on the sidechain that listens for triggering transactions on both the mainchain and the sidechain. Each federator has a signing key associated with it that is used to sign transactions. A transaction must be signed by a quorum of federators before it can be submitted. Federators are responsible for creating and signing valid response transactions, collecting signatures from other federators, and submitting transactions to the mainchain and sidechain.

_Mainchain_: The blockchain where assets originate and where assets are held while being used on the sidechain. For most sidechains, the mainchain is the XRP Ledger Mainnet, Testnet, or Devnet.

_Response transaction_: A transaction submitted by the federators in reaction to a triggering transaction. In most cases, the response transaction occurs on the opposite chain as the triggering transaction. However, there are some exceptions for handling failed transactions.

_Sidechain_: An XRP Ledger sidechain is another blockchain based on XRP Ledger technology. A _federated_ sidechain provides a way to transfer assets from a mainchain to the sidechain and back. A sidechain can use an exact copy of the XRP Ledger's protocol or it can make changes, including to the [consensus algorithm](consensus.html), [transaction types](transaction-types.html), and other rules. Sidechains have separate history, rules, and validators than the mainchain. Proxy assets are issued in the sidechain, with the equivalent assets held by a door account on the mainchain. Proxy assets on the sidechain can be sent back to the mainchain and unlocked from the control of the federators.
 
_Triggering transaction_: A transaction that causes the federators to start the process of signing and submitting a new response transaction. For example, sending XRP to the mainchain's door account is a triggering transaction that causes the federators to submit a new transaction on the sidechain.

## How to Set Up a Federated Sidechain

Federated Sidechains are currently available as an Engineering Preview so you can experiment and explore the potential of sidechains. You can connect sidechains to the XRP Ledger Testnet, Devnet, or Mainnet as long as [the servers](xrpl-servers.html) in the mainchain network are running version 1.8.0 or higher.

**Caution:** You can connect sidechains to the XRP Ledger Mainnet to develop and test with small amounts; it is not recommended for production use cases until federated sidechains are available in a release. 

Setting up a sidechain involves the following high-level steps:

1. Clone the `rippled` source code and check out the `sidechain` branch: https://github.com/ripple/rippled/tree/sidechain.
2. Customize the source code for your sidechain. For example, you may want to write custom [transaction types](transaction-types.html). Note that this is an important and non-trivial task.
3. Each sidechain federator has its own configuration file that must be updated to include the following information:  
    - `[sidechain]` stanza - add details such as signing key, mainchain account, and the mainchain address (IP and port) to listen to. 
    - `[sidechain_assets]` stanza - define assets that can be used for cross-chain transactions (XRP or [issued tokens](issued-currencies.html)), exchange rate for the assets, and optional refund penalty to discourage transactions that may default.
    - [sidechain_federators] stanza - list of federators public keys to be used for signing. This list is common for all federators on the sidechain.
4. Set up door accounts to enable cross chain transactions. This involves the following steps (on _both_ chains):
    - Create and fund the door accounts. 
    - [Set up the SignerList](set-up-multi-signing.html) for the door account.
    - Create three [tickets](tickets.html) for error handling.
    - And finally, [disable the master key pair](disable-master-key-pair.html) to the door account to ensure that the federators jointly control the door account. 

        Note that it is important to perform this final step only after successful completion of the previous steps.


The _Sidechain Launch Kit_ is a commandline tool that simplifies setting up federated sidechains and can be used to quickly spin up a sidechain on your local machine. The launch kit also installs an interactive Sidechain Shell that enables you to interact with the sidechain.

[Sidechain Launch Kit >](https://github.com/xpring-eng/sidechain-launch-kit)


## See Also

- **Concepts:**
    - [Federated Sidechains Video](https://www.youtube.com/embed/NhH4LM8NxgY)





