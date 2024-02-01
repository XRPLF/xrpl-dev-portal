---
html: parallel-networks.html
parent: networks-and-servers.html
seo:
    description: Understand how test networks and alternate ledger chains relate to the production XRP Ledger.
labels:
  - Blockchain
---
# Parallel Networks

There is one production XRP Ledger peer-to-peer network, and all business that takes place on the XRP Ledger occurs within the production network—the Mainnet.

To help members of the XRP Ledger community interact with XRP Ledger technology without affecting anything on the Mainnet, there are alternative networks, or altnets. Here's a breakdown of some public altnets:

| Network | Upgrade Cadence | Description                                      |
|:--------|:----------------|:-------------------------------------------------|
| Mainnet | Stable releases | _The_ [XRP Ledger](/about/), a  decentralized cryptographic ledger powered by a network of peer-to-peer servers and the home of [XRP](../../introduction/what-is-xrp.md). |
| Testnet | Stable releases | An "alternate universe" network that acts as a testing ground for software built on the XRP Ledger, without impacting production XRP Ledger users and without risking real money. The [amendment status](/resources/known-amendments.md) of the Testnet is intended to closely mirror the Mainnet, although slight variations in timing may occur due to the unpredictable nature of decentralized systems. |
| Devnet  | Beta releases   | A preview of coming attractions, where unstable changes to the core XRP Ledger software may be tested out. Developers can use this altnet to interact with and learn about planned new XRP Ledger features and amendments that are not yet enabled on the Mainnet. |
| [Hooks V3 Testnet](https://hooks-testnet-v3.xrpl-labs.com/) | [Hooks server](https://github.com/XRPL-Labs/xrpld-hooks) | A preview of on-chain smart contract functionality using [hooks](https://xrpl-hooks.readme.io/). |
| Sidechain-Devnet | Beta releases | A sidechain to test cross-chain bridge features. Devnet is treated as the locking chain and this sidechain is the issuing chain.<br>Library support:<br>- [xrpl.js 2.12.0](https://www.npmjs.com/package/xrpl/v/2.12.0)<br>- [xrpl-py 2.4.0](https://pypi.org/project/xrpl-py/2.4.0/)<br>**Note**: You can also use the [`xbridge-cli`](https://github.com/XRPLF/xbridge-cli) commandline tool to set up a cross-chain bridge on your local machine. |

Each altnet has its own separate supply of test XRP, which is [given away for free](/resources/dev-tools/xrp-faucets) to parties interested in experimenting with the XRP Ledger and developing applications and integrations. Test XRP does not have real-world value and is lost when the network is reset.

**Caution:** Unlike the XRP Ledger Mainnet, test networks are usually _centralized_ and there are no guarantees about the stability and availability of these networks. They have been and continue to be used to test various properties of server configuration, network topology, and network performance.


## Parallel Networks and Consensus

The main factor in determining which network a server follows is its configured UNL—the list of validators it trusts not to collude. Each server uses its configured UNL to know which ledger to accept as the truth. When different consensus groups of `rippled` instances only trust other members of the same group, each group continues as a parallel network. Even if malicious or misbehaving computers connect to both networks, the consensus process avoids confusion as long as the members of each network are not configured to trust members of another network in excess of their quorum settings.

Ripple runs the main servers in the Testnet and Devnet; you can also [connect your own `rippled` server to these networks](../../infrastructure/configuration/connect-your-rippled-to-the-xrp-test-net.md). The Testnet and Devnet do not use diverse, censorship-resistant sets of validators. This makes it possible for Ripple to reset the Testnet or Devnet at any time.


## See Also

- **Tools:**
    - [XRP Testnet Faucet](/resources/dev-tools/xrp-faucets)
- **Concepts:**
    - [Consensus](../consensus-protocol/index.md)
    - [Amendments](amendments.md)
- **Tutorials:**
    - [Connect Your `rippled` to the XRP Testnet](../../infrastructure/configuration/connect-your-rippled-to-the-xrp-test-net.md)
    - [Use rippled in Stand-Alone Mode](../../infrastructure/testing-and-auditing/index.md)
- **References:**
    - [server_info method][]
    - [consensus_info method][]
    - [validator_list_sites method][]
    - [validators method][]
    - [Daemon Mode Options](../../infrastructure/commandline-usage.md#daemon-mode-options)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
