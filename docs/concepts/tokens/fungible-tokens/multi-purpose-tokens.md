---
seo:
    description: Learn about multi-purpose tokens (MPTs) on XRP Ledger. MPTs are a flexible way to issue fungible tokens with built-in metadata, compliance, and transfer controls. 
labels:
  - Tokens
  - MPTs
  - Multi-purpose Tokens
status: not_enabled
---
# Multi-Purpose Tokens

Multi-Purpose Tokens (MPTs) are a form of [fungible token](./index.md) on the XRP Ledger. They have been designed for greater efficiency and ease of use based on lessons learned from [trust line tokens](./trust-line-tokens.md) on the XRP Ledger.

MPTs let you take advantage of ready-to-use tokenization features with a few lines of code. You can create many token experiences from one integration, while the code of the XRP Ledger blockchain does the heavy lifting.

{% amendment-disclaimer name="MPTokensV1" /%}

## Core Properties of MPTs on XRPL

The following properties are inherent to all fungible tokens on the XRP Ledger, including MPTs:

- **Anyone can be an issuer.** Every account has the capability to be a token issuer, and you can issue a very large quantity and variety of tokens from one account. Issuers can mint new units of any of their issuances at any time, subject to configurable limits, by sending [Payment transactions][].
- **Issuers are separate from holders.** An issuer cannot hold their own tokens. If you send tokens to the issuer, those tokens are automatically burned. Issuers should use separate [operational accounts](../../accounts/account-types.md)—also called hot wallets—if they want to hold their own tokens.
- **You can't force someone to hold tokens.** Holders must send a transaction that indicates their willingness to hold a token before they can receive it.

Unlike trust line tokens, each MPT issuance is uniquely identified by an **MPT Issuance ID**, which is a 192-bit number not intended for display to humans, for example `00070C4495F14B0E44F78A264E41713C64B5F89242540EE255534400000000000000`. MPTs can be configured with metadata that affects how they are displayed, but there are no hard guarantees about the presence or uniqueness of currency codes.

## Key Features of MPTs on XRPL

MPTs are designed for decentralized finance, so they are ready to go with settings and features for institutional use cases:

- **On-Chain Metadata:** Each MPT issuance has key properties defined on the ledger, so everyone can look up its data on-chain and the ledger's transaction engine can automatically enforce specific rules. Since MPT settings are defined per issuance, you don't have to set up separate accounts to issue tokens with different settings, which also helps minimize your exposure to cyberattacks.
- **Transferability controls:** MPTs can be made non-transferable, or holdable only by approved users.
- **Supply cap:** MPTs can be configured with a maximum issued quantity, so that the amount in circulation is never more than this number.
- **Transfer fees:** The issuer can charge a percentage fee for users to transfer the tokens among themselves.
- **Compliance controls:** The issuer can freeze holders' balances or claw back the tokens, or they can configure an MPT issuance so that those tokens can't be frozen or clawed back.
- **Simpler conceptual model:** MPTs are unidirectional, with no balance netting and an explicit separation between holder and issuer. Additionally, they intentionally lack features like rippling which introduce more tricky edge cases.

### On-Chain Metadata

Every MPT issuance has a set of key properties defined in the ledger as an [MPTokenIssuance entry][]. This object contains both _functional_ and _non-functional_ data about the MPT:

- Functional data includes settings such as the MPT's transfer fee and maximum quantity, if any. There are also on-off flags to control properties such as the transferability of the token.
- Non-functional data includes the asset scale (how much the asset can be subdivided—that is, where to put the decimal point) and up to 1024 bytes of arbitrary metadata. By convention, the metadata should be JSON data that conforms to the schema defined in [XLS-89](https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0089-multi-purpose-token-metadata-schema).

After the MPT is issued, the on-chain data cannot be changed. However, the proposed [XLS-94: Dynamic MPT standard](https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0094-dynamic-MPT) {% not-enabled /%} would allow fields to be marked as mutable during creation, so that those fields can be changed later.

### Transferability Controls

MPTs can be configured with different levels of transferability controls by adjusting the following flags:

- **Can Transfer:** If this flag is enabled, holders can transfer the token to each other. Otherwise, the MPT is non-transferable, meaning it can only be sent directly back to the issuer.
- **Require Auth:** If this flag is enabled, holders must get explicit approval from the issuer before they can hold this token—in other words, it uses allow-listing. Otherwise, anyone can hold the token if they are willing.
- **Can Trade:** If this flag is enabled, holders are allowed to trade the token in the decentralized exchange. However, trading MPTs in the DEX is not currently implemented.
- **Can Escrow:** If this flag is enabled, holders are allowed to place the token in escrow. Otherwise, the token cannot be escrowed. {% amendment-disclaimer name="TokenEscrow" /%}

### Supply Cap

MPTs can be configured with a supply cap, such that the number of tokens in circulation is never larger than this number.

Note that this is not a cap on the total number of tokens issued over time. If holders "burn" tokens by sending them back to the issuer, then the issuer can issue more tokens until the number in circulation is at the cap.

Even though issuers can't hold their own tokens, you can view the amount of tokens held by the issuer to be equal to the supply cap minus the number of tokens currently in circulation, since burning the tokens is the same as returning them to the issuer.

### Transfer Fees

MPTs can be configured with a transfer fee, so that holders must pay a percentage fee to transfer the tokens among themselves. The transfer fee does not apply when sending directly to the issuer, and non-transferable tokens cannot have a transfer fee.

MPTs' transfer fees have a range from **0** to **50.000%** in increments of **0.0001%**. The transfer fee is charged on top of the amount delivered, and is paid by burning the tokens. For example, to deliver $100.00 with a transfer fee of 0.5%, the sender would pay $100.50, the receiver would get $100.00, and the remaining $0.50 would be burned.

### Compliance Controls

MPTs can be configured with different controls for managing the tokens, in addition to the [transferability controls](#transferability-controls). These controls include:

- The issuer can lock and unlock a specific token holder's balance; while locked, it cannot increase or decrease except in payments directly to the issuer. This is functionally equivalent to [deep freeze](./deep-freeze.md) on trust line tokens.
- The issuer can also globally lock (freeze) all MPTs of a particular issuance.
- The issuer can claw back funds from a particular holder. This can be used to revoke them, or to reassign the tokens in case the holder lost the keys to their account.

The power to perform these actions is controlled by two flags on the MPT issuance:

- **Can Lock:** If enabled, the issuer can lock MPTs individually or globally. Otherwise, the MPTs cannot be locked/frozen in any way.
- **Can Clawback:** If enabled, the issuer can claw back tokens from holders. Otherwise, the MPTs cannot be clawed back.

### Simpler Conceptual Model

The bidirectional model of trust line tokens, where two users could swap roles between issuer and holder in the middle of processing a transaction, is a source of complexity and tricky edge cases that is intentionally omitted from the MPT design.

Each MPT issuance is totally separate and there is no rippling between tokens, only transferring between holders. MPT balances are always positive and use fixed-precision integers instead of floating-point math.

MPTs _do_ still support [partial payments](../../payment-types/partial-payments.md), so it is still necessary to avoid the related pitfalls when processing MPT payments.


## Limits on Issuing

There is not intended to be a limit on how many MPT issuances you can create, but the technology does impose some hard and soft limits indirectly:

- The ledger entry that defines an MPT issuance counts as one object towards the issuer's [owner reserve](../../accounts/reserves.md#owner-reserves), so the issuer needs to set aside {% $env.PUBLIC_OWNER_RESERVE %} per MPT issuance.
- Each holder's balance of MPTs is tracked in both the holder's and issuer's [owner directories](/docs/references/protocol/ledger-data/ledger-entry-types/directorynode). The maximum number of items that can be in an owner directory is very large, but finite, which places a hard cap on how many MPT issuances you can issue.

The data type that holds MPT balances has a valid range of **0** to **2<sup>63</sup>-1** (inclusive) in integer increments, so no more than that amount can exist in any one place. However, it is possible for multiple holders to each hold up to that amount at the same time, so that the total amount in circulation is higher. An MPT issuance's supply cap, if configured, is also limited by this range.


## See Also
 
- **Use Case**

    - [Creating an Asset-backed Multi-purpose Token](../../../use-cases/tokenization/creating-an-asset-backed-multi-purpose-token.md)

- **Tutorial**

    - [Sending MPTs](../../../tutorials/javascript/send-payments/sending-mpts.md)

- **References:**
    - [MPToken](../../../references/protocol/ledger-data/ledger-entry-types/mptoken.md)
    - [MPTokenIssuance](../../../references/protocol/ledger-data/ledger-entry-types/mptokenissuance.md)
    - [MPTokenAuthorize](../../../references/protocol/transactions/types/mptokenauthorize.md)
    - [MPTokenIssuanceCreate](../../../references/protocol/transactions/types/mptokenissuancecreate.md)
    - [MPTokenIssuanceDestroy](../../../references/protocol/transactions/types/mptokenissuancedestroy.md)
    - [MPTokenIssuanceSet](../../../references/protocol/transactions/types/mptokenissuanceset.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
