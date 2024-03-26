---
category: 2022
date: 2022-10-13
labels:
    - Amendments
theme:
    markdown:
        editPage:
            hide: true
---
# ExpandedSignerList Enabled and NFTs Approaching

The ExpandedSignerList amendment [became enabled on the XRP Ledger](https://livenet.xrpl.org/transactions/802E2446547BB86397217E32A78CB9857F21B048B91C81BCC6EF837BE9C72C87) on 2022-10-13, allowing multi-signing lists to support up to 32 entries (up from 8) and additional metadata on each signer. Additionally, the fixRemoveNFTokenAutoTrustLine amendment has gained support from over 80% of trusted validators, which puts XLS-20 Non-Fungible Token (NFT) support on track for becoming enabled on the XRP Ledger Mainnet in the near future. All XRP Ledger users should upgrade to [**version 1.9.4**](https://xrpl.org/blog/2022/rippled-1.9.4.html) of the core XRP Ledger server for service continuity.

## Action Required

- If you operate a `rippled` server, you MUST upgrade to version 1.9.1 or higher immediately to maintain sync with the network.
- If the fixRemoveNFTokenAutoTrustLine amendment becomes enabled, **version 1.9.4** will be required. This may happen as soon as 2022-10-27 (UTC).

For instructions on upgrading `rippled` on supported platforms, see [Install `rippled`](https://xrpl.org/install-rippled.html).


## Impact of Not Upgrading

If you operate a `rippled` server on a version older than 1.9.1, then your server is now amendment blocked, meaning that your server:

* Cannot determine the validity of a ledger
* Cannot submit or process transactions
* Does not participate in the consensus process
* Does not vote on future amendments
* Could rely on potentially invalid data

After 2022-10-27, if the fixRemoveNFTokenAutoTrustLine amendment becomes enabled as expected, server versions 1.9.1, 1.9.2, and 1.9.3 will also become amendment blocked. If it does not, these versions should continue to be compatible with the XRP Ledger Mainnet. The exact time that protocol changes take effect depends on the voting decisions of the decentralized network, following the [amendment process](https://xrpl.org/amendments.html).

All operators are encouraged to **[upgrade as soon as possible](https://xrpl.org/install-rippled.html) to version 1.9.4** which is compatible with all released amendments and has several other minor improvements.


## ExpandedSignerList Summary

This amendment expands on the XRP Ledger's [multi-signing](https://xrpl.org/multi-signing.html) feature, increasing the maximum signer list size from 8 to 32. It also allows you to associate additional, optional data with each signer when you set up a multi-signing list. The additional data can be used to identify the signer, which may be useful for smart contracts, or for identifying who controls a key in a large organization: for example, you could store an IPv6 address or the identifier of a Hardware Security Module (HSM).

Without this amendment, the maximum signer list size is 8 entries, and each entry has exactly two fields, `Account` and `SignerWeight`.

With this amendment, the maximum signer list size is 32 entries. Additionally, each entry can contain an optional 256-bit (32-byte) `WalletLocator` field containing arbitrary data. This amendment changes the [SignerListSet transaction](https://xrpl.org/signerlist.html) accordingly.

### Library Support

To use the new features added by the ExpandedSignerList amendment, you must update your client libraries. The following releases include support for the feature:

- [xrpl.js 2.5.0](https://github.com/XRPLF/xrpl.js/releases/tag/xrpl%402.5.0) for JavaScript and TypeScript
- [xrpl-py 1.7.0](https://github.com/XRPLF/xrpl-py/releases/tag/v1.7.0) for Python
- xrpl4j support for Java is forthcoming. (Current releases support more than 8 signers and signatures, but don't support additional data in the `WalletLocator` field)


## fixRemoveNFTokenAutoTrustLine and NFT Status

The **fixRemoveNFTokenAutoTrustLine** amendment disables a minor feature from the original XLS-20 specification for Non-Fungible Tokens on the XRP Ledger because it was demonstrated that the feature in question could be abused to perform a denial-of-service attack on NFT issuers. This amendment does nothing on its own, since it modifies the functionality of the **NonFungibleTokensV1_1** amendment. However, the fixRemoveNFTokenAutoTrustLine is a pre-requisite to safely enabling Non-Fungible Tokens support on the XRP Ledger.

The **NonFungibleTokensV1_1** amendment remains open for voting, and can be enabled following two weeks of >80% support from trusted validators, which can be concurrent with the support period for fixRemoveNFTokenAutoTrustLine. The actual time when Non-Fungible Tokens become enabled on the network is still dependent on the voting decisions of the network: if trusted validators start voting in favor of NonFungibleTokensV1_1 now that fixRemoveNFTokenAutoTrustLine is on track to be enabled, NFT support could become enabled on the XRP Ledger Mainnet in just over two weeks. If validators instead wait for fixRemoveNFTokenAutoTrustLine to become enabled before voting in favor of NonFungibleTokensV1_1, it could take a total of four weeks or more.

For more information about Non-Fungible Tokens, see the [NFT Conceptual Overview](https://xrpl.org/non-fungible-tokens.html).


## Learn, ask questions, and discuss

To learn more about the XRP Ledger, non-fungible tokens, the amendment process, or other topics, see the following resources:

- [XRPL.org](https://xrpl.org) documentation
- [XRP Ledger Developers on Discord](https://discord.gg/427qqMYwHh)
- [XRP Ledger Foundation](https://foundation.xrpl.org/), on various platforms:
    - [YouTube](https://www.youtube.com/channel/UC6zTJdNCBI-TKMt5ubNc_Gg)
    - [Twitter](https://twitter.com/XRPLF/)
    - [GitHub](https://github.com/XRPLF/)
