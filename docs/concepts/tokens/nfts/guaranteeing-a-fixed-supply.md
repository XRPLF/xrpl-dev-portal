---
html: nft-fixed-supply.html
parent: non-fungible-tokens.html
seo:
    description: Use a new account to mint a fixed number of NFTs, then black hole the account.
labels:
  - Non-fungible Tokens, NFTs
---
# Guaranteeing a Fixed Supply of NFTs

For some projects, you might want to guarantee that no more than a fixed number of NFTs are minted from an issuing account.

To guarantee a fixed number of NFTs:

1. Create and fund a new account, the _Issuer_. This account is the issuer of the tokens within the collection. See [Creating Accounts](../../accounts/index.md#creating-accounts).
1. Use `AccountSet` to assign your operational wallet as an authorized minter for the issuer. See [Authorizing Another Account to Mint Your NFTs](authorizing-another-minter.md).
1. Use your operational account to mint the tokens using `NFTokenMint`. The operational wallet holds all of the tokens minted for the Issuer. See [Batch Minting](batch-minting.md).
1.  Use `AccountSet` to remove your operational wallet as an authorized minter for the Issuer.
1. “Blackhole” the Issuer account. See [Disable Master Key Pair](../../../tutorials/how-tos/manage-account-settings/disable-master-key-pair.md).

At this point, it is impossible for any new tokens to be minted with the issuer’s address as the issuing account.

**Caution** Once you "blackhole" the account, no one, including you, receives transfer fees for future sales of the NFTs.
