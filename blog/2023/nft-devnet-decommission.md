---
category: 2023
date: 2022-01-27
labels:
    - Advisories
theme:
    markdown:
        editPage:
            hide: true
---
# The NFT-Devnet Decommissioned on January 31, 2023

The "NFT-Devnet" was a test network running experimental code to support Non-Fungible Tokens (NFTs) natively on the XRP Ledger (per the XLS-20 standard).

The NFT-Devnet server has been down for unrelated reasons since January 16th, 2023. Given that there have been no inquiries from developers, it is likely all users have reconfigured their sample applications to use the XRP Testnet. We encourage you to move to the XRP Testnet at your earliest convenience.

The "NFT-Devnet" preview server is now decommissioned and will not return to service.

<!-- BREAK -->

## Action Necessary

To avoid interruption of your development and testing activities for NFT applications, update your URL to use the XRP Testnet or XRP Devnet at your earliest convenience.

To move your application to XRP Testnet, change the NFT-Devnet URLs you are using to XRP Testnet URLs. 

| Type      | From NFT-Devnet URL                           | To XRP Testnet URL                       |  
|:----------|:----------------------------------------------|:-----------------------------------------|
| WebSocket | `wss://xls20-sandbox.rippletest.net:51233/`   | `wss://s.altnet.rippletest.net:51233/`   |
| JSON-RPC  | `https://xls20-sandbox.rippletest.net:51234/` | `https://s.altnet.rippletest.net:51234/` |


## Further Reading

- For more information about NFTs on the XRP Ledger, see [NFT Conceptual Overview](https://xrpl.org/nft-conceptual-overview.html).
- For information about XRP Ledger test networks, see [Parallel Networks](https://xrpl.org/parallel-networks.html).
