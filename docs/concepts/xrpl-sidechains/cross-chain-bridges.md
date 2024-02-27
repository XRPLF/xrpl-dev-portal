---
html: cross-chain-bridges.html
parent: xrpl-sidechains.html
seo:
    description: Cross-chain bridges for the XRP Ledger enable value in the form of XRP and other tokens (IOUs) to move efficiently between blockchains.
status: not_enabled
labels:
  - Blockchain
  - Interoperability
---
# Cross-Chain Bridges

_(Requires the [XChainBridge amendment][] {% not-enabled /%})_

Cross-chain bridges enable you to move XRP and tokens between the XRP Ledger and other blockchains. When referring to the blockchains connected by a bridge, one is the locking chain and the other the issuing chain.

A locking chain is where the digital asset originates from. These assets are locked in a trust when sent across a bridge to an issuing chain.

An issuing chain is an independent ledger with its own consensus algorithm and transaction types and rules. A wrapped version of the digital asset is minted and burned, depending on if an asset is received or sent from the locking chain.

**Note:** Bridges utilize special _door accounts_ when moving assets cross-chain. The door account on a locking chain is used to put assets into trust, and the door account on an issuing chain is used to issue wrapped assets. 

Both the locking and issuing chains operate as parallel networks with independent nodes and validators. They rely on independent [witness servers](witness-servers.md) to watch transactions between the two chains and attest that assets have moved into specifically designated accounts.


## How Do Bridges Work?

At a high-level, bridges enable cross-chain transactions through these steps:

1. Create a cross-chain claim ID on the issuing chain. A cross-chain claim ID represents one transfer of value between blockchains.
2. Submit a commit transaction on the locking chain, putting the assets in a trust. The transaction includes the cross-chain claim ID and reward for witness servers.

    **Note:** Witness servers monitor transactions on both chains. They provide attestations, or signed messages, to verify a transaction occurred. There are attestations for `XChainCommit` and `XChainAccountCreateCommit` transactions.

3. Witness servers provide attestations to the issuing chain, saying the assets were locked on the locking chain.
4. When there are enough signatures to reach quorum, the assets are released on the issuing chain to the destination account.

    **Note:** In some cases, such as deposit authorization being enabled, you'll need to submit a transaction claim for the transferred assets on the issuing chain.

5. Rewards are distributed to the witness servers' accounts on the issuing chain.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
