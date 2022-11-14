---
html: what-is-xrpl.html
parent: intro-to-xrpl.html
blurb: Learn about the XRP Ledger blockchain.
labels:
  - Blockchain
---

# What is the XRP Ledger?

The XRP Ledger is a _blockchain_ that records transactions of XRP and other tokens.

## What Is a Blockchain?

A blockchain is a continuously growing list of records. The blockchain starts with a block of data. 

A group of trusted validator nodes reach consensus that the data is valid.

The block is uniquely identified with a very elaborate, complicated, computer-generated, cryptographic Hash number that is 64 hexadecimal characters long, 

The block is also identified by a timestamp with its creation time.

Each validator node gets its own copy of the data block. There is no single central authority. All copies are equally valid.

Each block contains a hash pointer as a link to the previous block. It also has a timestamp, new data, and its own unique hash number.

Using this structure, each block has a clear position in the chain, linking back to the previous data block. This creates an immutable chain of blocks. You can always verify all current information on the chain by tracing back through the previous blocks. 

By design, blockchains are resistant to modification of the data. Every ledger node gets an exact copy of the blockchain.

This creates an open, distributed ledger that records transactions between parties efficiently and in a verifiable and permanent way.

Once recorded, the data in any given block cannot be altered retroactively, unless a majority of the validators agree to the change. If so, all subsequent blocks are changed in the same way (a very rare and extreme occurrence).


## What Is the XRPL?

The XRP Ledger (XRPL) is the blockchain on which XRP currency is based and exchanged. All accounts on the XRPL can transfer XRP between one another and must hold a minimum amount of XRP as a reserve.


### What Is In the XRPL Ecosystem?

The basis of the XRP Ledger is a peer-to-peer network of always-on rippled (pronounced _ripple-d_) servers sharing transactions, engaging in the consensus process, and processing transactions. Everything else in the XRP Ledger ecosystem is directly or indirectly built on top of this peer-to-peer network.

Programming Libraries exist in higher level software, where they are imported directly into program code, and contain methods to access the XRP Ledger.

Middleware provides indirect access to XRP Ledger data. Applications in this layer often have their own data storage and processing.

Apps and Services provide user-level interaction with the XRP Ledger, or provide a basis for even higher-level apps and services.

### How Does the Federated Consensus Process Work?

Most of the rippled servers in the XRPL monitor or propose transactions. An important subset of servers are run as validators. These trusted servers accumulate lists of new transactions into a new possible ledger instance (a new block in the block chain). They share their lists with all of the other validators. The validators incorporate proposed changes from one another and distribute a new version of the ledger proposal. When 80% of the validators agree on a set of transactions, they create a new ledger instance at the end of the chain and start the process again. This consensus process takes 4-6 seconds. You can monitor as ledger instances are created in real time by visiting [https://livenet.xrpl.org/](https://livenet.xrpl.org/).

### What Networks Are Available?

The XRPL is open to anyone who wants to set up their own instance of the rippled server and connect. The node can monitor the network, perform transactions, or become a validator.

For developers or new users who want to try out the features of XRPL without investing their own funds, there are two developer environments, _Testnet_ and _Devnet_. Users can create an account funded with 10,000 (fake) XRP and connect to either environment to interact with the XRPL. 
