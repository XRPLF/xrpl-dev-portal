# Parallel Networks

There is one production XRP Ledger peer-to-peer network, and all business that takes place on the XRP Ledger occurs within the production network—the Mainnet.

To help members of the XRPL community interact with XRPL technology without affecting anything on the Mainnet, Ripple hosts two alternative networks, or altnets: the Testnet and the Devnet. Here's a breakdown of all three networks:

| Network | Upgrade Cadence | Description                                      |
|:--------|:----------------|:-------------------------------------------------|
| Mainnet | Stable releases | _The_ [XRP Ledger](xrp-ledger-overview.html), a  decentralized cryptographic ledger powered by a network of peer-to-peer servers and the home of [XRP](xrp.html). |
| Testnet | Stable releases | An "alternate universe" network that acts as a testing ground for software built on the XRP Ledger, without impacting production XRP Ledger users and without risking real money. The [amendment status](known-amendments.html) of the Testnet is intended to closely mirror the Mainnet, although slight variations in timing may occur due to the unpredictable nature of decentralized systems. |
| Devnet  | Beta releases   | A preview of coming attractions, where unstable changes to the core XRP Ledger software may be tested out. Developers can use this altnet to interact with and learn about planned new XRPL features and amendments that are not yet enabled on the Mainnet. |

Testnet and Devnet each have their own separate supply of test XRP, which Ripple [gives away for free](xrp-testnet-faucet.html) to parties interested in experimenting with the XRP Ledger and developing applications and integrations. Test XRP does not have real-world value and is lost when the network is reset.

**Caution:** Ripple makes no guarantees about the stability of altnets. These networks have been and continue to be used to test various properties of server configuration, network topology, and network performance.


## Parallel Networks and Consensus

There is no `rippled` setting that defines which network it uses. Instead, it uses the consensus of validators it trusts to know which ledger to accept as the truth. When different consensus groups of `rippled` instances only trust other members of the same group, each group continues as a parallel network. Even if malicious or misbehaving computers connect to both networks, the consensus process overrides the confusion as long as the members of each network are not configured to trust members of another network in excess of their quorum settings.

Ripple operates the main servers in the Testnet and Devnet; you can also [connect your own `rippled` server to the Testnet](connect-your-rippled-to-the-xrp-test-net.html). The Testnet and Devnet do not use diverse, censorship-resistant sets of validators. This makes it possible for Ripple to reset the Testnet or Devnet on a regular basis.


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
