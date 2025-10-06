---
seo:
    description: Multi-Purpose Tokens (MPT) of one issuance held by a specific account.
labels:
  - Multi-purpose Tokens, MPTs, Tokens
status: not_enabled
---
# MPToken

An `MPToken` entry tracks [MPTs](../../../../concepts/tokens/fungible-tokens/multi-purpose-tokens.md) held by an account that is not the token issuer. You can create or delete an empty `MPToken` entry by sending an [MPTokenAuthorize transaction][]. You can send and receive MPTs using several other transaction types including [Payment][] and [OfferCreate][] transactions.

{% amendment-disclaimer name="MPTokensV1" /%}

## Example MPToken JSON

```json
{
    "LedgerEntryType": "MPToken",
    "Account": "rajgkBmMxmz161r8bWYH7CQAFZP5bA9oSG",
    "MPTokenIssuanceID": "000004C463C52827307480341125DA0577DEFC38405B0E3E",
    "Flags": 0,
    "MPTAmount": "100000000",
    "OwnerNode": "1"
}
```

## MPToken Fields

In addition to the [common fields](../common-fields.md), {% code-page-name /%} entries have the following fields:

| Field Name          | JSON Type            | Internal Type | Required? | Description |
|:--------------------|:---------------------|:--------------|:----------|:------------|
| `Account`           | String - [Address][] | AccountID     | Yes       | The owner (holder) of these MPTs. |
| `MPTokenIssuanceID` | String - Hexadecimal | UInt192       | Yes       | The `MPTokenIssuance` identifier. |
| `MPTAmount`         | String - Number      | UInt64        | Yes       | The amount of tokens currently held by the owner. The minimum is 0 and the maximum is 2<sup>63</sup>-1. |
| `LockedAmount`      | String - Number      | UInt64        | No        | The amount of tokens currently locked up (for example, in escrow). {% amendment-disclaimer name="TokenEscrow" /%} |
| `PreviousTxnID`     | String - [Hash][]    | UInt256       | Yes       | The identifying hash of the transaction that most recently modified this entry. |
| `PreviousTxnLgrSeq` | Number               | UInt32        | Yes       | The sequence of the ledger that contains the transaction that most recently modified this object. |
| `OwnerNode`         | String               | UInt64        | Yes       | A hint indicating which page of the owner directory links to this entry, in case the directory consists of multiple pages. |

### MPToken Flags

{% code-page-name /%} entries can have the following flags combined in the `Flags` field:

| Flag Name         | Flag Value | Description                                 |
|:------------------|:-----------|:--------------------------------------------|
| `lsfMPTLocked`     | `0x00000001`   | If enabled, indicates that the MPT owned by this account is currently locked and cannot be used in any XRP transactions other than sending value back to the issuer. |
| `lsfMPTAuthorized` | `0x00000002`   | (Only applicable for allow-listing) If set, indicates that the issuer has authorized the holder for the MPT. This flag can be set using a `MPTokenAuthorize` transaction; it can also be "un-set" using a `MPTokenAuthorize` transaction specifying the `tfMPTUnauthorize` flag. |


## MPToken ID Format

The ID of an `MPToken` entry is the [SHA-512Half][] of the following values, concatenated in order:

- The `MPToken` space key (0x0074).
- The `MPTokenIssuanceID` for the issuance being held.
- The `AccountID` of the token holder.

## See Also

- [MPTokenAuthorize transaction][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
