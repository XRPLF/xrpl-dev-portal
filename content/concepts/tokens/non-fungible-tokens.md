---
html: non-fungible-tokens.html
parent: tokens.html
blurb: Introduction to XRPL NFTs.
filters:
 - include_code
labels:
 - Non-fungible Tokens, NFTs
status: not_enabled
---

# NFT Conceptual Overview
{% include '_snippets/nfts-disclaimer.md' %}

The XRP Ledger offers support for [tokens](tokens.html), also known as _IOUs_. Such assets are, primarily, fungible.

> Fun·gi·ble /ˈfənjəbəl/ (adj)
>
> 1. able to replace or be replaced by another identical item; mutually interchangeable.

Fungible tokens can be easily traded between users for XRP or other issued assets on the XRP Ledger's decentralized exchange. This makes them ideal for payments.


A good example of a fungible item might be a postage stamp. If you are standing around in 1919 and need to send a letter by airmail, you would purchase a 24-cent stamp and affix it to your envelope. If you lost that stamp, you could use a different 24-cent stamp or use 2 10-cent stamps and 2 2-cent stamps. Very fungible.

![Jenny Stamps](img/nft-concepts1.png "Jenny Stamps")

But since you are standing around in 1919, you might be offered 24-cent airmail stamps where the aeroplane on the stamp is accidentally printed upside down. These are the world famous “Inverted Jenny” stamps. Only 100 were circulated on a single sheet of stamps, making them extremely rare and sought after. The current value of each mint condition stamp is appraised at over $1.5 million dollars.

![Jenny Stamps](img/nft-concepts2.png "Jenny Stamps")

Those stamps cannot be replaced by just another other 24-cent stamp. They have become _non-fungible_.

The [NonFungibleTokensV1 amendment][] :not_enabled: adds support for non-fungible tokens (NFTs, or “nifties” in the vernacular) natively on the XRP Ledger.  Non-fungible tokens serve to encode ownership of unique physical, non-physical, or purely digital goods, such as works of art or in-game items.


## NFTs on the XRP Ledger

On the XRP Ledger, a non-fungible token is represented as a [NFToken][] object. A `NFToken` is a unique, indivisible unit that is not used for payments. Users can mint (create), hold, buy, sell, and burn (destroy) such tokens.

The ledger stores up to 32 `NFToken` objects owned by the same account in a single [NFTokenPage object][] to save space. As a result, the owner's [reserve requirement](reserves.html) for `NFToken` objects only increases when the ledger needs to make a new page to store additional tokens.

Accounts can also designate a broker, or "Authorized Minter", who can mint and sell `NFToken` objects on their behalf.

`NFToken` objects have several settings that are defined when the token is minted and cannot be changed later. These include:

- Various identifying data that uniquely defines the token.
- Whether the issuer can burn the token regardless of who currently holds it.
- Whether the holder of the token can transfer it to others. (The `NFToken` can always be sent to or from the issuer directly.)
    - If transfers are allowed, the issuer can charge a transfer fee as a percentage of the sale price.
- Whether the holder can sell the `NFToken` for [fungible token](tokens.html) amounts, or only for XRP.


## `NFToken` Lifecycle

Anyone can create a new `NFToken` using the [NFTokenMint transaction][] type. The `NFToken` lives on the [NFTokenPage object][] of the issuing account. Either the owner or an interested party can send a [NFTokenCreateOffer transaction][] to propose buying or selling the `NFToken`; the ledger tracks the proposed transfer as a [NFTokenOffer object][], and deletes the `NFTokenOffer` when either side accepts or cancels the offer. If the `NFToken` is transferable, it can be traded multiple times between accounts.

You can destroy a `NFToken` you own using the [NFTokenBurn transaction][]. If the issuer minted the token with `tfBurnable` flag enabled, the issuer can also burn the token regardless of the current owner. (This could be useful, for example, for a token that represents a ticket to an event which is used up at some point.)

![The NFT Lifecycle](img/nft-lifecycle.png "NFT Lifecycle Image")

For more info about transferring `NFToken` objects, see [Trading NFTokens on the XRP Ledger](non-fungible-token-transfers.html).


## Reference

- [NFToken][] data type
- Ledger Objects
    - [NFTokenOffer object][]
    - [NFTokenPage object][]
- Transactions
    - [NFTokenMint transaction][]
    - [NFTokenCreateOffer transaction][]
    - [NFTokenCancelOffer transaction][]
    - [NFTokenAcceptOffer transaction][]
    - [NFTokenBurn transaction][]
- API Methods
    - [account_nfts method][]
    - [nft_sell_offers method][]
    - [nft_buy_offers method][]
    - [nft_info method][] (Clio server only)

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
