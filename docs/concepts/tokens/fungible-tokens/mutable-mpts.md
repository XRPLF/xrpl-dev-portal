---
seo:
    description: The DynamicMPT amendment lets issuers create an MPT with mutable properties, so they can be updated later as business needs evolve.
labels:
  - Tokens
  - MPTs
  - Multi-purpose Tokens
status: not_enabled
---
# Mutable MPTs

The [DynamicMPT amendment][] extends [Multi-Purpose Tokens (MPTs)](multi-purpose-tokens.md) by making specific properties of an MPT mutable by **default**: the on-chain metadata, the transfer fee, and the ability to enable [MPT issuance flags](../../../references/protocol/ledger-data/ledger-entry-types/mptokenissuance.md#mptokenissuance-flags). This allows issuers to update the specified properties later as business needs evolve. For example, an issuer might need to adjust the transfer fee based on market conditions, update token metadata, or enable trading functionality.

Issuers can make these properties **immutable** by explicitly declaring which of them can't be modified, either when they create the MPT issuance or later. Any of the properties not declared immutable stay mutable. All other data set at issuance, such as the asset scale and maximum amount, is fixed and can't be changed for the life of the token.

{% amendment-disclaimer name="DynamicMPT" /%}

## Modifying MPT Properties

Issuers can change mutable properties with the [MPTokenIssuanceSet transaction][], which allows them to update token metadata, change the transfer fee, and enable one or more MPT issuance flags at once.

Each MPT issuance flag adds a capability, such as allowing holders to trade the token or letting the issuer claw back tokens. Enabling an MPT issuance flag is a **one-way** operation, which means once an MPT issuance flag is enabled, no subsequent transaction can disable it.

## Making MPT Properties Immutable

To make a property immutable, the issuer declares it in the `ImmutableFlags` field. An issuer can do this when creating the MPT issuance with the [MPTokenIssuanceCreate transaction][], or at a later time with the [MPTokenIssuanceSet transaction][].

`ImmutableFlags` is additive. Each declaration adds to the properties already fixed on the issuance, never replaces them, and can never be cleared. This lets an issuer figure out a token's design in stages. For example, an issuer could make the metadata immutable once its content is final, while leaving the transfer fee open to change for longer.

The issuer can enable an MPT issuance flag and make it immutable in the same transaction. For the full list of fields and flags that can be made immutable, see [MPTokenIssuance Immutable Flags](../../../references/protocol/ledger-data/ledger-entry-types/mptokenissuance.md#mptokenissuance-immutable-flags).

## Security Considerations

A few rules govern how an MPT's properties can change:

- Only the issuer of the [MPTokenIssuance entry][] can modify its properties, enable MPT issuance flags, or declare fields and flags immutable.
- Because the `ImmutableFlags` field is never cleared, a property made immutable by an [MPTokenIssuanceSet transaction][] stays immutable regardless of who submits subsequent transactions.
- MPT issuance flags are one-way and can't be disabled once enabled. Enabling a flag and immediately making it immutable via `ImmutableFlags` in the same transaction is supported and introduces no additional risk: the flag was already permanent once enabled, so making it immutable merely records that fact rather than changing what is achievable.

## See Also

- **Concepts:**
    - [Multi-Purpose Tokens](./multi-purpose-tokens.md)
- **Tutorials:**
    - [Issue a Multi-Purpose Token](../../../tutorials/tokens/mpts/issue-a-multi-purpose-token.md)
- **References:**
    - [MPTokenIssuanceCreate transaction][]
    - [MPTokenIssuanceSet transaction][]
    - [MPTokenIssuance entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
