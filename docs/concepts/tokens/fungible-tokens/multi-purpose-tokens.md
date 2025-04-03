---
blurb: Multi-purpose tokens offer a more compact, flexible token type than trust lines.
labels:
  - Tokens
  - MPTs
  - Multi-purpose Tokens
status: not_enabled
---
# Multi-purpose Tokens

_(Requires the [MPToken amendment][] {% not-enabled /%})_

Multi-purpose tokens (MPTs) are a more compact and flexible type of fungible token.

MPTs let you take advantage of ready-to-use tokenization features with a few lines of code. You can create many token experiences from one token program itself. Notable features include:

- MPTs store their metadata directly on the XRPL blockchain.
- A 1024-byte URI field provides a metadata pointer that allows you to use an off-chain source for metadata in addition to the on-chain source. This lets your application access necessary information directly from the chain, prompting higher interoperability for tokens, without losing the ability to attach additional information. 
- MPTs can have a fixed token supply where you set a cap on the maximum number of tokens that can be minted. 
- You can define MPTs as non-transferable, tokens that can only be transferred back to the issuer, but not among tokenholders. Useful for cases such as issuing airline credits or loyalty rewards.
- Issuers can set transfer fees to collect on-chain revenue each time the token is traded among tokenholders. 
- MPTs also have advanced compliance features: 
    - The ability to lock tokens held by a tokenholder to support compliance requirements.
    - The ability to set a global lock for all MPT balances across all tokenholders.
    - The issuer can configure MPTs that can be clawed back from tokenholder wallets, either to revoke them, or to reassign them in the case of lost wallet keys. 
    - An opt-in feature can allow only wallets authorized by the issuer to hold issued tokens.

## MPTs versus Trust Lines

Unlike trust lines, MPTs do not represent bidirectional debt relationships. Instead, MPTs function more like a unidirectional trust line with only one balance. This reduces the overhead to support common tokenization requirements, including non-monetary use cases such as tracking reputation points in an online game.

MPTs offer a less complicated conceptual model than trust lines. 

MPTs require significantly less space than trust lines. They require roughly 52 bytes for each MPT held by a token holder, compared to at least 234 bytes for every new trust line.

They reduce the long-term infrastructure and storage burdens for node operators, increasing network resiliency.

MPTs also improve node perfomance when processing large volumes of transactions.

MPTs are unidirectional. While trust lines use "balance netting," MPTs have only a single balance.

An account can issue a maximum of 32 unique MPT issuances. If an issuer wants to support more than this number of MPTs, they can open additional accounts.

Since token holders will not acquire an MPT without first making an off-ledger trust decision, MPTs have no trust limits. For example, a common use case for an MPT is a fiat-backed stablecoin, where a token holder wouldn't purchase more stablecoins than they would feel comfortable holding.

Unlike some existing capabilities of the ledger, MPTs are not subject to rippling, and  do not require configurability settings related to that functionality.

## MPTs versus IOUs

On a technical level, MPTs provide a fundamentally different way to represent fungible tokens on the ledger.  While IOUs are represented by trustlines and have bilateral debt relationships, MPTs use a simpler, unilateral relationship captured by an MPToken object. This results in substantial space savings on the ledger. The representation of a fungible token as a token object instead of a trustline makes it easier to enable functionality for real-world financial assets on-chain, such as token-level metadata, fixed supply, and fixed-point balance.

On a usage level, MPTs provide a straightforward conceptual model compared to trustlines and rippling. Developers can more easily build web3 applications around `MPToken` and `MPTokenIssuance` objects, with some similarities to the conceptual model of XLS-20 NFTs.  It is also simpler for ordinary users to understand what tokens are available, what tokens they have issued, and what they hold in their wallet.  For both issuers and holders of MPTs, there will typically be a smaller XRP reserve compared to the equivalent representations with IOU trustlines.

MPTs are intended to be complementary to IOUs.  While there might be use cases where either MPTs or IOUs might be suitable, there will likely be a need for both over the long term.  There will be use cases such as credit lines for lending and borrowing that might be better represented by IOUs long term.  The MPT feature set should evolve in an incremental manner to unlock more common use cases first and deliver additional feature support at a later time. During the MPT development period, some cases might still be better represented by an IOU, then later be better supported with MPTs.

## See Also
 
- **Use Case**

[Creating an Asset-backed Multi-purpose Token](../../../use-cases/tokenization/creating-an-asset-backed-multi-purpose-token.md)

- **Tutorial**

[Sending MPTs](../../../tutorials/javascript/send-payments/sending-mpts.md)

- **References:**
    - [MPToken](../../../references/protocol/ledger-data/ledger-entry-types/mptoken.md)
    - [MPTokenIssuance](../../../references/protocol/ledger-data/ledger-entry-types/mptokenissuance.md)
    - [MPTokenAuthorize](../../../references/protocol/transactions/types/mptokenauthorize.md)
    - [MPTokenIssuanceCreate](../../../references/protocol/transactions/types/mptokenissuancecreate.md)
    - [MPTokenIssuanceDestroy](../../../references/protocol/transactions/types/mptokenissuancedestroy.md)
    - [MPTokenIssuanceSet](../../../references/protocol/transactions/types/mptokenissuanceset.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
