---
category: 2023
date: 2023-08-07
labels:
    - Amendments
theme:
    markdown:
        editPage:
            hide: true
---
# DisallowIncoming and Others Expected 2023-08-21

Five amendments to the XRP Ledger protocol, all introduced in [`rippled` v1.10.0](https://github.com/ripple/rippled/releases/tag/1.10.0), have gained support from a majority of validators:

- DisallowIncoming [Expected 2023-08-21](https://livenet.xrpl.org/transactions/0233A777FBE622D7168BF6471F26348068FFAA71998988E04F14C68FE681A243).
- fixNonFungibleTokensV1_2 [Expected 2023-08-21](https://livenet.xrpl.org/transactions/DF62EBD98507C1BEBC9DE3F893BB5FC1FC7CBA519A6D5AC8D9B31A0484F1E91B).
- fixTrustLinesToSelf [Expected 2023-08-21](https://livenet.xrpl.org/transactions/24BA5B9EFE6235868B701E57D2E2DF7A6043FA5EFD1A1F8685A29F99E9D9A106).
- fixUniversalNumber [Expected 2023-08-21](https://livenet.xrpl.org/transactions/2D6414605922894483E52513A244A1DC0F86ECB958A395F0902FF9AA6595682F).
- ImmediateOfferKilled [Expected 2023-08-21](https://livenet.xrpl.org/transactions/9D63D5C4216AA36FC17995982DBB1ADE203F39F2A2BE414E1BA708E5E7D0F467).

Each amendment that maintains greater than 80% support continuously will become enabled on the expected date.

<!-- BREAK -->

## Action Required

- If you operate a `rippled` server, you must upgrade to version 1.10.0 or higher by 2023-08-21, for service continuity. **[Version 1.11.0](https://xrpl.org/blog/2023/rippled-1.11.0.html) is recommended.**
- If you use the XRP Ledger for your business, review the details of the amendments to make sure your software continues to function as expected after the amendments are in effect.

## Impact of Not Upgrading

If you operate a `rippled` server but don’t upgrade by 2023-08-21, when these amendments are expected to become enabled, then your server will become amendment blocked, meaning that your server:

* Cannot determine the validity of a ledger
* Cannot submit or process transactions
* Does not participate in the consensus process
* Does not vote on future amendments
* Could rely on potentially invalid data

If none of the amendments become enabled, then your server will not become amendment blocked and should continue to operate.

For instructions on upgrading `rippled` on supported platforms, see [Install `rippled`](https://xrpl.org/install-rippled.html).


## Amendment Summaries

### DisallowIncoming

Provides options to categorically block incoming checks, payment channels, NFT offers, and trust lines from reaching your account. When an account has these options enabled, other accounts cannot create those types of ledger entries with the account as the destination.

Adds 4 new AccountSet Flags and modifies the AccountSet transaction to allow enabling and disabling them:

- asfDisallowIncomingCheck
- asfDisallowIncomingPayChan
- asfDisallowIncomingNFTOffer
- asfDisallowIncomingTrustline

Changes transaction processing to check the status of those flags before creating the corresponding type of entry. If the destination account has the flag enabled, the transaction fails with the error code `tecNO_PERMISSION`.

Without this amendment, any account can create these entries with any destination; while this is usually harmless, it can block an account from later being deleted, and may also be used as part of scams.

### fixNonFungibleTokensV1_2

This amendment is a combination of bug fixes to NFT functionality:

- Fix an issue where NFTs could not be burned if there were over 500 offers to buy/sell that NFT. Change NFTokenBurn transactions to remove 500 offers if there are too many, so you can try again and eventually successfully burn the NFT. ([PR 4346](https://github.com/XRPLF/rippled/pull/4346))
- Fix issues around accepting NFT trade offers. ([PR 4380](https://github.com/XRPLF/rippled/pull/4380)) These include:
    - Fix a bug where brokering a trade could incorrectly result in an insufficient funds error.
    - Fix a bug that could debit the buyer for more than their (fungible token) balance when they have exactly enough to pay the buy price but not the transfer fee.
    - Fix a bug that prevented fungible token issuers from buying NFTs using their own tokens. Allow issuers to pay for an NFT by issuing new fungible tokens.
- Fix an issue where, in certain circumstances, brokers could sell an NFT to an account that already owns it. ([Issue 4374](https://github.com/XRPLF/rippled/issues/4374))
- Fix a bug that allowed anyone to broker an NFT offer with a fixed destination, instead of only the specified destination. ([Issue 4373](https://github.com/XRPLF/rippled/issues/4373))


### fixTrustLinesToSelf

This amendment removes two trust lines from an account to itself that were created due to an old bug (both on 2013-05-07). When the amendment becomes enabled, it deletes trust lines with the IDs `2F8F21EFCAFD7ACFB07D5BB04F0D2E18587820C7611305BB674A64EAB0FA71E1` and `326035D5C0560A9DA8636545DD5A1B0DFCFF63E68D491B5522B767BB00564B1A` if they exist.

This amendment has no further effect.

### fixUniversalNumber

Simplifies and unifies the code for decimal floating point math. In some cases, this provides slightly better accuracy than the previous code, resulting in calculations whose least significant digits are different than when calculated with the previous code. The different results may cause other edge case differences where precise calculations are used, such as ranking of offers or processing of payments that use several different paths.

Without this amendment, the code continues to use separate calculations for `STAmount` and `IOUAmount` objects.

### ImmediateOfferKilled

Changes OfferCreate transactions so that if an offer uses `tfImmediateOrCancel` and transaction processing kills the offer without moving any funds, the transaction uses the result code `tecKILLED` instead of `tesSUCCESS`. If the offer exchanges any amount of funds, even a small amount, the transaction still uses `tesSUCCESS`. There are no other changes to the processing of the transaction (for example, in terms of whether it cleans up expired and unfunded offers that were encountered in the ledger during transaction processing).

Without this amendment, "Immediate or Cancel" offers that failed to move any funds returned a `tesSUCCESS` result code, which could be confusing because the transaction effectively did nothing.

## Learn, ask questions, and discuss

To learn more about the XRP Ledger, the amendment process, or other topics, see the following resources:

- [XRPL.org](https://xrpl.org) documentation
- [XRP Ledger Developers on Discord](https://xrpldevs.org/)
- [XRP Ledger Foundation](https://foundation.xrpl.org/), on various platforms:
    - [YouTube](https://www.youtube.com/channel/UC6zTJdNCBI-TKMt5ubNc_Gg)
    - [X / Twitter](https://twitter.com/XRPLF/)
    - [GitHub](https://github.com/XRPLF/)
