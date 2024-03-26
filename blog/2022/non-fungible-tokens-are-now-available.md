---
category: 2022
date: 2022-11-01
labels:
    - Amendments
theme:
    markdown:
        editPage:
            hide: true
---
# Non-Fungible Tokens Are Now Available

[As previously announced](https://xrpl.org/blog/2022/expandedsignerlist-enabled-and-nfts-approaching.html), the **NonFungibleTokensV1_1** amendment [became enabled on the XRP Ledger](https://livenet.xrpl.org/transactions/251242639A640CD9287A14A476E7F7C20BA009FDE410570926BAAF29AA05CEDE) on 2022-10-31 following the [fixRemoveNFTokenAutoTrustLine amendment](https://livenet.xrpl.org/transactions/2A67DB4AC65D688281B76334C4B52038FD56931694A6DD873B5CCD9B970AD57C) on 2022-10-27. As a result, native Non-Fungible Tokens (per the [XLS-20 spec](https://github.com/XRPLF/XRPL-Standards/discussions/46)) can now be minted and used on the XRP Ledger Mainnet.

<!-- BREAK -->

## Action Required

- If you operate a `rippled` server, you should upgrade to **version 1.9.4** immediately.

For instructions on upgrading `rippled` on supported platforms, see [Install `rippled`](https://xrpl.org/install-rippled.html).


## Impact of Not Upgrading

If you operate a `rippled` server on a version older than 1.9.4, then your server is now [amendment blocked](https://xrpl.org/amendments.html#amendment-blocked), meaning that your server:

* Cannot determine the validity of a ledger
* Cannot submit or process transactions
* Does not participate in the consensus process
* Does not vote on future amendments
* Could rely on potentially invalid data


## About Non-Fungible Tokens

Non-fungible tokens, or `NFToken` objects, are a new type of object on the XRP Ledger for representing assets that are each unique. There are new transaction types for minting, trading, and destroying these objects, with various settings that control the detailed behavior of the NFT.

Tokens can have transfer fees that provide their creator with a share of the revenue when the NFT is bought and sold, and they can be part of a set of related NFTs that share a "taxon". Creators can also designate a broker who mints and sells the tokens on their behalf.

The [**NonFungibleTokensV1_1** amendment](https://xrpl.org/known-amendments.html#nonfungibletokensv1_1) incorporates the original [NonFungibleTokensV1 amendment](https://xrpl.org/known-amendments.html#nonfungibletokensv1) as well as two bug fixes that were added in later releases, [fixNFTokenDirV1](https://xrpl.org/known-amendments.html#fixnftokendirv1) and [fixNFTokenNegOffer](https://xrpl.org/known-amendments.html#fixnftokennegoffer). The [fixRemoveNFTokenAutoTrustLine amendment](https://xrpl.org/known-amendments.html#fixremovenftokenautotrustline) is a third fix that went into effect, as a precaution, on 2022-10-27.

For more information on NFTs, see the [NFT Conceptual Overview](https://xrpl.org/non-fungible-tokens.html) and related documentation.

The [first successful minting](https://livenet.xrpl.org/transactions/465A6EAC412E32CDD6C3D21537AD1C5919987EE162D606480133E1E43FBD14A7/) of a `NFToken` on the XRP Ledger Mainnet has already been followed by over 30,000 more. You can check this and other stats live on [Bithomp's NFT statistics page](https://bithomp.com/nft-statistics).


## Network Stability

Previously, the XRP Ledger community [requested patience and caution](https://xrpl.org/blog/2022/get-ready-for-nfts.html#a-word-of-caution) regarding the launch of NFT functionality on the XRP Ledger Mainnet, in case the network load from initial NFT minting causes temporarily elevated transaction costs, or partial outages of services connected to the XRP Ledger. Experts from the XRP Ledger Foundation and Ripple are monitoring the status of the network and related infrastructure. So far, the increase in network load from NFTs has been measurable but within tolerances and everything appears to be operating normally.

If you are minting or plan to mint NFTs on the XRP Ledger, please continue to go about your business with an appropriate amount of care, and keep an eye on result codes for failures so that you don't repeatedly burn XRP on failed transactions due to software bugs or insufficient XRP [reserves](https://xrpl.org/reserves.html).


## Learn, ask questions, and discuss

To learn more about the XRP Ledger, non-fungible tokens, the amendment process, or other topics, see the following resources:

- [XRPL.org](https://xrpl.org) documentation
- [XRP Ledger Developers on Discord](https://discord.gg/427qqMYwHh)
- [XRP Ledger Foundation](https://foundation.xrpl.org/), on various platforms:
    - [YouTube](https://www.youtube.com/channel/UC6zTJdNCBI-TKMt5ubNc_Gg)
    - [Twitter](https://twitter.com/XRPLF/)
    - [GitHub](https://github.com/XRPLF/)
