---
html: non-fungible-tokens.html
parent: tokens.html
seo:
    description: Introduction to XRPL NFTs.
labels:
 - Non-fungible Tokens, NFTs
---

# Non-Fungible Tokens

The XRP Ledger natively supports non-fungible tokens (NFTs, or “nifties” in the vernacular).  Non-fungible tokens serve to encode ownership of unique physical, non-physical, or purely digital goods, such as works of art or in-game items.

_(Added by the [NonFungibleTokensV1_1 amendment][].)_

To represent digital assets similar to these, use the XRP Ledger's Non-Fungible Tokens feature (sometimes referred to by its standards draft number, [XLS-20](https://github.com/XRPLF/XRPL-Standards/discussions/46)).

## NFTs on the XRP Ledger

On the XRP Ledger, an NFT is represented as a [NFToken][] object. An NFT is a unique, indivisible unit that is not used for payments. Users can mint (create), hold, buy, sell, and burn (destroy) NFTs.

The ledger stores up to 32 NFTs owned by the same account in a single [NFTokenPage object][] to save space. As a result, the owner's [reserve requirement](../../accounts/reserves.md) for NFTs only increases when the ledger needs to make a new page to store additional tokens.

Accounts can also name a _Broker_ or an _Authorized Minter_ who can sell or mint NFTs on their behalf.

NFTs have several immutable settings that are defined when the token is minted. These include:

- Identifying data that uniquely defines the token.
- Whether the issuer can burn the token, regardless of who currently holds it.
- Whether the holder of the token can transfer it to others. (An NFT can always be sent to or from the issuer directly.)
- If transfers are allowed, the issuer can charge a transfer fee as a percentage of the sale price.
- Whether the holder can sell the NFT for [fungible token](../fungible-tokens/index.md) amounts, or only for XRP.

## NFT Lifecycle

Anyone can create a new NFT using the [NFTokenMint transaction][]. The NFT lives on the [NFTokenPage object][] of the issuing account. Either the owner or an interested party can send a [NFTokenCreateOffer transaction][] to propose buying or selling the NFT; the ledger tracks the proposed transfer as a [NFTokenOffer object][], and deletes the `NFTokenOffer` when either side accepts or cancels the offer. If the NFT is transferable, it can be traded multiple times between accounts.

You can destroy an NFT you own using the [NFTokenBurn transaction][]. If the issuer minted the token with the `tfBurnable` flag enabled, the issuer can also burn the token, regardless of the current owner. (This could be useful, for example, for a token that represents a ticket to an event that is used up at some point.)

![The NFT Lifecycle](/docs/img/nft-lifecycle.png "NFT Lifecycle Image")

For more info about transferring NFTs, see [Trading NFTs on the XRP Ledger](trading.md).

{% raw-partial file="/docs/_snippets/common-links.md" /%}
