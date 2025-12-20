---
seo:
  description: A pseudo-account is a special type of XRPL account that holds assets on behalf of an on-chain protocol.
labels:
  - Single Asset Vault 
  - AMM
  - Lending Protocol
status: not_enabled
---

# Pseudo-Accounts

The XRP Ledger is an account-based blockchain where assets like XRP, trust line tokens, and Multi-Purpose Tokens (MPTs) are held by accounts, and are represented on-chain by an [AccountRoot](../../references/protocol/ledger-data/ledger-entry-types/accountroot) ledger entry. However, certain use cases require assets to be transferable to and from an object, which is why a pseudo-account is needed.

A pseudo-account is a special type of account that holds assets on behalf of an on-chain protocol. Use cases for pseudo-accounts include:

- **Automated Market Makers (AMM)**: The [XLS-30 amendment](../../../resources/known-amendments#amm) introduced pseudo-accounts for AMMs by adding the `AMMID` field to the `AccountRoot` ledger entry. This field links a pseudo-account to an AMM instance, allowing it to track XRP and token balances in the pool and issue `LPTokens` on behalf of the AMM instance.

- **Single Asset Vaults**: A single asset vault pseudo-account is used to store deposited funds and issue MPT shares. A new `VaultID` field is introduced in the `AccountRoot` ledger entry, which links the pseudo-account with the vault.

- **Lending Protocol**: The Lending Protocol also uses the single asset vault's pseudo-account, with each `LoanBroker` tracked in the pseudo-account's owner directory. The pseudo-account holds first-loss capital that protects vault depositors from loan defaults, as well as the loan funds themselves.

A pseudo-account has strict limitations. It cannot receive payments from other accounts, cannot send transactions since it has no signing authority, and exists solely to store or issue assets.

## Reserve Requirements

The cost of creating a pseudo-account depends on whether it is owned and controlled by another account:

- **Owned pseudo-accounts**: For objects like a `Vault` where a single account owns and controls the associated pseudo-account, the creation transaction increases the owner's XRP reserve by one [incremental owner reserve](../accounts/reserves#base-reserve-and-owner-reserve) (currently {% $env.PUBLIC_OWNER_RESERVE %}). This is in addition to any other reserve requirements of the transaction (for example, the Vault object itself).

- **Unowned pseudo-accounts**: For objects like an `AMM` that are not owned by any account, the creation transaction must charge a special, higher-than-normal transaction fee. This fee must be at least the value of one incremental owner reserve. This amount is burned, compensating for the permanent ledger space without tying the reserve to a specific owner.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
