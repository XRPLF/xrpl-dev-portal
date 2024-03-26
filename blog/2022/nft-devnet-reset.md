---
category: 2022
date: 2022-03-01
labels:
    - Advisories
theme:
    markdown:
        editPage:
            hide: true
---
# The NFT-Devnet Has Been Reset

The "NFT-Devnet" is a test network running experimental code to support Non-Fungible Tokens (NFTs) natively on the XRP Ledger (per the [XLS-20](https://github.com/XRPLF/XRPL-Standards/discussions/46) draft standard). Ripple has reset the NFT-Devnet while upgrading it to the latest version of the preview code.

<!-- BREAK -->

## Action Necessary
All accounts funded, NFTs minted, and other data in the NFT-Devnet have been discarded as part of the reset. If you use the NFT-Devnet for development, you should use the [XRP Faucets](https://xrpl.org/xrp-testnet-faucet.html) to fund new accounts and re-create your settings as necessary.

## Further Reading

- For more information about NFTs on the XRP Ledger, see [NFT Conceptual Overview](https://xrpl.org/nft-conceptual-overview.html).
- For information about XRP Ledger test networks, see [Parallel Networks](https://xrpl.org/parallel-networks.html).
- To see and provide feedback on the source code for NFT support, see [PR #4101](https://github.com/ripple/rippled/pull/4101).
