---
category: 2022
date: 2022-09-01
labels:
    - Amendments
theme:
    markdown:
        editPage:
            hide: true
---
# Get Ready for NFTs

The **NonFungibleTokensV1_1** amendment to the XRP Ledger, introduced in [version 1.9.2](https://github.com/ripple/rippled/releases/tag/1.9.2) of the `rippled` server implementation, has [gained support from a majority of trusted validators](https://livenet.xrpl.org/transactions/AEF4E0866F3CACB0108EA926DE504CC040B3D7F38B8DB9A68649E3555DE937F1). Currently, it is expected to become enabled on 2022-09-13. As long as the NonFungibleTokensV1_1 amendment continues to have the support of over 80% of trusted validators continuously, it will become enabled on the scheduled date, adding native support for non-fungible tokens (NFTs) to the ledger, following the XLS-20 specification.

## Action Required

- If you operate an XRP Ledger server, you must upgrade to version 1.9.2 (or higher) by 2022-09-13, for service continuity.
- If you intend to mint non-fungible tokens on the XRP Ledger, review your technical implementation and monitor the status of the amendment to be ready for when it becomes enabled.

### Impact of Not Upgrading

If you operate an XRP Ledger server but don’t upgrade to version 1.9.2 (or higher) by 2022-09-13, when the NonFungibleTokensV1_1 amendment is expected to become enabled, then your server will become amendment blocked, meaning that your server:

* Cannot determine the validity of a ledger
* Cannot submit or process transactions
* Does not participate in the consensus process
* Does not vote on future amendments
* Could rely on potentially invalid data

If the NonFungibleTokensV1_1 amendment does not become enabled, then your server will not become amendment blocked and should continue to operate.

For instructions on upgrading on supported platforms, see [Install `rippled`](https://xrpl.org/install-rippled.html).

## Amendment Voting Summary

For an amendment to the XRP Ledger protocol to become enabled, it must hold **over 80% support** from trusted validators continuously for two weeks.

The exact amendment voting calculations depend on the quorum of validators that are currently online and participating in consensus, which means that the exact number of votes in favor of an amendment can fluctuate when validators go temporarily offline. If at any point its support drops below 80%, the timer resets and the amendment must wait a full two weeks again starting when it regains 80%+ support.

Previously, the threshold for amendment voting was "at least 80%" but in some cases rounding in the reference server's calculations could cause this condition to be met with slightly below 80%. The [fixAmendmentMajorityCalc amendment](https://xrpl.org/known-amendments.html#fixamendmentmajoritycalc), which activated on 2021-04-08, changed the calculation to be **strictly greater than 80%**. Since there are currently 35 validators in all three [recommended UNLs](https://xrpl.org/faq.html#validators-and-unique-node-lists), and 28/35 is _exactly_ 80%, the threshold for voting to enable an amendment when all validators are online is at least 29 votes in favor.

For a live view of amendment voting, you can use the [XRPScan Amendments Dashboard](https://xrpscan.com/amendments). For more discussion of the voting process, see [this blog by Ripple developer Nik B.](https://dev.to/ripplexdev/xrpl-amendments-to-vote-or-not-to-vote-5l3) as well as the [Amendments documentation](https://xrpl.org/amendments.html).

## NFT Functionality Summary

Non-fungible tokens, or `NFToken` objects, are a new type of object on the XRP Ledger for representing assets that are each unique. The NonFungibleTokensV1_1 amendment enables new transaction types for minting, trading, and destroying these objects, with various settings that control the detailed behavior of the NFT.

Tokens can have transfer fees that provide their creator with a share of the revenue when the NFT is bought and sold, and they can be part of a set of related NFTs that share a "taxon". Creators can also designate a broker who mints and sells the tokens on their behalf.

The [**NonFungibleTokensV1_1** amendment](https://xrpl.org/known-amendments.html#nonfungibletokensv1_1) incorporates the original [NonFungibleTokensV1 amendment](https://xrpl.org/known-amendments.html#nonfungibletokensv1) as well as two bug fixes that were added in later releases, [fixNFTokenDirV1](https://xrpl.org/known-amendments.html#fixnftokendirv1) and [fixNFTokenNegOffer](https://xrpl.org/known-amendments.html#fixnftokennegoffer).

For more information on NFTs, see the [NFT Conceptual Overview](https://xrpl.org/non-fungible-tokens.html) and related documentation.


## A Word of Caution

Since the road to enabling native NFT support has been long, some members of the community have voiced concern regarding pent-up demand for minting NFTs and converting NFTs from the deprecated XLS-14d specification. When the NFT amendment becomes enabled, the onset of NFT minting may cause a temporary increase in traffic on the XRP Ledger network. Possible effects could include:

- Outages of individual XRP Ledger servers, especially ones with older or weaker hardware
- Increased [transaction costs](https://xrpl.org/transaction-cost.html) as a result of network load
- Slower results from popular public API servers, or a higher rate of errors

While performance testing has shown that the network is capable of handling the long-term effects of NFTs, the short-term impact on the actual, decentralized Mainnet and all the infrastructure built on top of it is more complex. Alloy Networks, a founding member of the XRP Ledger Foundation, [advises minters](https://twitter.com/alloynetworks/status/1561672954299269120) to be cautious and not mint or convert large collections of NFTs all at once.

Users should also be careful not to burn more XRP than they intended on temporarily-elevated transaction costs. If you have an automated system for submitting transactions, now is a good time to review your code to make sure you [properly handle](https://xrpl.org/reliable-transaction-submission.html) `terQUEUED` and other non-final transaction results.


## Learn, ask questions, and discuss

To learn more about the XRP Ledger, non-fungible tokens, the amendment process, or other topics, see the following resources:

- [XRPL.org](https://xrpl.org) documentation
- [XRP Ledger Developers on Discord](https://discord.gg/427qqMYwHh)
- [XRP Ledger Foundation](https://foundation.xrpl.org/), on various platforms:
    - [YouTube](https://www.youtube.com/channel/UC6zTJdNCBI-TKMt5ubNc_Gg)
    - [Twitter](https://twitter.com/XRPLF/)
    - [GitHub](https://github.com/XRPLF/)
