---
seo:
  description: A pseudo-account is a special type of XRPL account that holds assets on behalf of an on-chain protocol.
labels:
  - Single Asset Vault 
status: not_enabled
---

# Pseudo-Accounts

The XRP Ledger is an account-based blockchain where assets like XRP, Fungible Tokens, and Multi-Purpose Tokens (MPTs) are held by accounts, and are represented on-chain by an [AccountRoot](https://xrpl.org/docs/references/protocol/ledger-data/ledger-entry-types/accountroot) ledger entry. However, certain use cases require assets to be transferable to and from an object, which is why a pseudo-account is needed.

A pseudo-account is a special type of account that holds assets on behalf of an on-chain protocol, and is used in the following use cases:

- **Automated Market Makers (AMM)**: The [XLS-30 amendment](https://xrpl.org/resources/known-amendments#amm) introduced pseudo-accounts for AMMs by adding the `AMMID` field to the `AccountRoot` ledger entry. This field links a pseudo-account to an AMM instance, allowing it to track XRP and token balances in the pool and issue `LPTokens` on behalf of the AMM instance.

- **Single Asset Vaults**: A single asset vault pseudo-account is used to store deposited funds and issue MPT shares. A new `VaultID` field is introduced in the `AccountRoot` ledger entry, which links the pseudo-account with the vault.

- **Lending Protocol**: While still in development, this protocol is expected to use pseudo-accounts to hold loan funds.

A pseudo-account has strict limitations. It cannot receive payments from other accounts, cannot send transactions since it has no signing authority, and exists solely to store or issue assets.

## Transaction Cost

A transaction that creates a pseudo-account incurs a higher than usual [transaction cost](https://xrpl.org/docs/concepts/transactions/transaction-cost) to deter ledger spam. Instead of the standard minimum of 0.00001 XRP, the transaction must destroy an [incremental owner reserve](https://xrpl.org/docs/concepts/accounts/reserves#base-reserve-and-owner-reserve), currently 0.2 XRP.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
