---
html: what-is-the-xrp-ledger.html
parent: introduction.html
seo:
    description: Learn about the XRP Ledger (XRPL) blockchain.
labels:
  - Blockchain
---
# What is the XRP Ledger?

The XRP Ledger is a decentralized blockchain that uses its own digital currency to process and record financial transactions.

## What Is a Blockchain?

A blockchain is a continuously growing list of records. The blockchain starts with a block of data. A group of trusted validator nodes reach consensus that the data is valid. Each validator node gets its own copy of the data block. There is no single central authority. All copies are equally valid.

<div align="center">

![Validators with valid copies](/docs/img/validators-valid-copies.svg)

</div>

The block is uniquely identified with a very elaborate, complicated, computer-generated, cryptographic Hash number that is 64 hexadecimal characters long. It is also identified by a timestamp with its creation time.

Each block contains a hash pointer as a link to the previous block. It also has a timestamp, new data, and its own unique hash number.

<div align="center">

![Anatomy of a blockchain block](/docs/img/blockchain-block-anatomy.svg)

</div>

Using this structure, each block has a clear position in the chain, linking back to the previous data block. This creates an immutable chain of blocks. You can always verify all current information on the chain by tracing back through the previous blocks.

<div align="center">

![Three data blocks](/docs/img/blockchain-three-blocks.svg)

</div>

By design, blockchains are resistant to modification of the data. Every ledger node gets an exact copy of the blockchain.

This creates an open, distributed ledger that records transactions between parties efficiently and in a verifiable and permanent way.

Once recorded, the data in any given block cannot be altered retroactively, unless a majority of the validators agree to the change. If so, all subsequent blocks are changed in the same way (a very rare and extreme occurrence).

### How Does the Federated Consensus Process Work?

Most of the xrpld servers in the XRPL monitor or propose transactions. An important subset of servers are run as validators. These trusted servers accumulate lists of new transactions into a new possible ledger instance (a new block in the block chain).

<div align="center">

![Validators reach consensus and record a new block](/docs/img/federated-consensus.svg)

</div>

They share their lists with all of the other validators. The validators incorporate proposed changes from one another and distribute a new version of the ledger proposal.

When 80% of the validators agree on a set of transactions, they create a new ledger instance at the end of the chain and start the process again. This consensus process takes 4-6 seconds. You can monitor as ledger instances are created in real time by visiting [https://livenet.xrpl.org/](https://livenet.xrpl.org/).

### What Networks Are Available?

The XRPL is open to anyone who wants to set up their own instance of the xrpld server and connect. The node can monitor the network, perform transactions, or become a validator. The active XRPL network is typically referred to as _Mainnet_.

For developers or new users who want to try out the features of XRPL without investing their own funds, there are two developer environments, _Testnet_ and _Devnet_. Users can create an account funded with 1,000 (fake) XRP and connect to either environment to interact with the XRPL.

Next: [What is XRP?](what-is-xrp.md)
