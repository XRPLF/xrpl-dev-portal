---
html: intro-to-evm-sidechain.html
parent: xrpl-interoperability.html
blurb: Introduction to the EVM compatible XRP Ledger Sidechain
labels:
  - Interoperability
status: not_enabled
---
# Introduction to EVM Compatible XRP Ledger Sidechain

The Ethereum Virtual Machine (EVM) compatible XRP Ledger sidechain is a secure and fast public blockchain that brings all kinds of web3 applications to the XRP Ledger community. 

- Explorer: [https://evm-sidechain.xrpl.org](https://evm-sidechain.xrpl.org/)
- Public RPC: [https://rpc-evm-sidechain.xrpl.org](https://rpc-evm-sidechain.xrpl.org/)


The EVM Sidechain is a powerful latest generation blockchain with the following features:

- Supports up to 1000 transactions per second, thus handling large loads and throughput.
- Has a low transaction confirmation time, on average, as a block is produced every 5 seconds. 
- Once a block is added to the chain and confirmed, it is considered final (1 block finalization time).
- Provides full Ethereum Virtual Machine (EVM) compatibility, enabling you to connect your wallet and interact or deploy smart contracts written in Solidity. <!-- STYLE_OVERRIDE: wallet -->

## Consensus

The EVM Sidechain runs on a proof-of-stake (PoS) consensus algorithm. Staking is when you pledge your coins to be used for verifying transactions. The proof-of-stake model allows you to stake cryptocurrency (also referred to as "coins") and create your own validator nodes. Your coins are locked up while you stake them, but you can unstake them if you want to trade your coins.

In a proof-of-stake blockchain, mining power depends on the amount of coins a validator is staking. Participants who stake more coins are more likely to be chosen to add new blocks.

If you are interested in staking cryptocurrency and running your own validator, see [Join EVM Sidechain Devnet](join-evm-sidechain-devnet.html) for more information.

The underlying technology for the XRP Ledger EVM Sidechain consensus is [Tendermint](https://tendermint.com/), a Byzantine-Fault Tolerant engine for building blockchains.

The blockchain uses the `cosmos-sdk` library on top of Tendermint to create and customize the blockchain using its built-in modules. The EVM sidechain uses the [Ethermint](https://github.com/evmos/ethermint) `cosmos-sdk` module, which provides EVM compatibility

## Interoperability Using the EVM Sidechain

The EVM sidechain is directly connected to XRP Ledger through the XRP Ledger bridge [https://bridge.devnet.xrpl](https://bridge.devnet.xrpl.org/). Through this bridge, you can connect to the EVM Sidechain and use its features.

## See Also

[Get Started with EVM Sidechain](get-started-evm-sidechain.html)
