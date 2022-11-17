---
html: parallel-networks.html
parent: consensus-network.html
blurb: Understand how test networks and alternate ledger chains relate to the production XRP Ledger.
labels:
  - Blockchain
---
# Parallel Networks

There is one production XRP Ledger peer-to-peer network, and all business that takes place on the XRP Ledger occurs within the production network—the Mainnet.

To help members of the XRP Ledger community interact with XRP Ledger technology without affecting anything on the Mainnet, there are alternative networks, or altnets. Here's a breakdown of some public altnets:

| Network | Upgrade Cadence | Description                                      |
|:--------|:----------------|:-------------------------------------------------|
| Mainnet | Stable releases | _The_ [XRP Ledger](xrp-ledger-overview.html), a  decentralized cryptographic ledger powered by a network of peer-to-peer servers and the home of [XRP](xrp.html). |
| Testnet | Stable releases | An "alternate universe" network that acts as a testing ground for software built on the XRP Ledger, without impacting production XRP Ledger users and without risking real money. The [amendment status](known-amendments.html) of the Testnet is intended to closely mirror the Mainnet, although slight variations in timing may occur due to the unpredictable nature of decentralized systems. |
| Devnet  | Beta releases   | A preview of coming attractions, where unstable changes to the core XRP Ledger software may be tested out. Developers can use this altnet to interact with and learn about planned new XRP Ledger features and amendments that are not yet enabled on the Mainnet. |
| NFT-Devnet | [XLS-20 pre-release](https://github.com/ripple/rippled/tree/xls20) | A preview of the [XLS-20d](https://github.com/XRPLF/XRPL-Standards/discussions/46) standard for non-fungible tokens on the XRP Ledger. |
| [Hooks Testnet V2](https://hooks-testnet-v2.xrpl-labs.com/) | [Hooks server](https://github.com/XRPL-Labs/xrpld-hooks) | A preview of on-chain smart contract functionality using [hooks](https://write.as/xumm/xrpl-labs-is-working-on-the-transaction-hooks-amendment-for-the-xrp-ledger). |

Each altnet has its own separate supply of test XRP, which is [given away for free](xrp-testnet-faucet.html) to parties interested in experimenting with the XRP Ledger and developing applications and integrations. Test XRP does not have real-world value and is lost when the network is reset.

**Caution:** Unlike the XRP Ledger Mainnet, test networks are usually _centralized_ and there are no guarantees about the stability and availability of these networks. They have been and continue to be used to test various properties of server configuration, network topology, and network performance.


## Parallel Networks and Consensus

The main factor in determining which network a server follows is its configured UNL—the list of validators it trusts not to collude. Each server uses its configured UNL to know which ledger to accept as the truth. When different consensus groups of `rippled` instances only trust other members of the same group, each group continues as a parallel network. Even if malicious or misbehaving computers connect to both networks, the consensus process avoids confusion as long as the members of each network are not configured to trust members of another network in excess of their quorum settings.

Ripple runs the main servers in the Testnet, Devnet, and NFT-Devnet; you can also [connect your own `rippled` server to these networks](connect-your-rippled-to-the-xrp-test-net.html). The Testnet and Devnet do not use diverse, censorship-resistant sets of validators. This makes it possible for Ripple to reset the Testnet or Devnet at any time.


## See Also

- **Tools:**
    - [XRP Testnet Faucet](xrp-test-net-faucet.html)
- **Concepts:**
    - [Introduction to Consensus](intro-to-consensus.html)
    - [Amendments](amendments.html)
- **Tutorials:**
    - [Connect Your `rippled` to the XRP Testnet](connect-your-rippled-to-the-xrp-test-net.html)
    - [Use rippled in Stand-Alone Mode](use-stand-alone-mode.html)
- **References:**
    - [server_info method][]
    - [consensus_info method][]
    - [validator_list_sites method][]
    - [validators method][]
    - [Daemon Mode Options](commandline-usage.html#daemon-mode-options)


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
