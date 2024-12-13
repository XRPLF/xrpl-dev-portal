---
blurb: Describes the XRPL multi-purpose token object.
labels:
  - Multi-purpose Tokens, MPTs, Tokens
---
# MPToken

{% partial file="/docs/_snippets/mpts-disclaimer.md" /%}

The `MPToken` object represents a number of tokens held by an account that is not the token issuer. MPTs are acquired via ordinary payment or DEX transactions, and can optionally be redeemed or exchanged using these same types of transactions. The object key of the MPToken is derived from hashing the space key, the holder's address, and the `MPTokenIssuanceID`.

<!-- _(Added by the [MPTokenV1_1 amendment][].)_ -->

## Example MPToken JSON

```json
{
    "LedgerEntryType": "MPToken",
    "Account": "rajgkBmMxmz161r8bWYH7CQAFZP5bA9oSG",
    "MPTokenIssuanceID": "000004C463C52827307480341125DA0577DEFC38405B0E3E",
    "Flags": 0,
    "MPTAmount": "100000000",
    "OwnerNode": 1
}
```

## MPTokenID

The `MPTokenID` is the result of SHA512-Half of the following values, concatenated in order:

- The `MPToken` space key (0x0074).
- The `MPTokenIssuanceID` for the issuance being held.
- The `AccountID` of the token holder.

## MPToken Fields

`MPToken` objects have the following fields.

| Field Name        | JSON Type | Internal Type | Description |
|:------------------|:----------|:--------------|:------------|
| `LedgerEntryType`   | number    | UInt16        | The value 0x007F, mapped to the string `MPToken`, indicates that this object describes an individual account's holding of an MPT. |
| `Account`           | string    | AccountID     | The owner of the MPT. |
| `MPTokenIssuanceID` | string    | UInt192       | The `MPTokenIssuance` identifier. |
| `MPTAmount`         | string    | UInt64        | This value specifies a positive amount of tokens currently held by the owner. Valid values for this field are between 0x0 and 0x7FFFFFFFFFFFFFFF. |
| `Flags`             | number    | UInt32        | (Default) See [MPToken Flags](#mptoken-flags) |
| `PreviousTxnID`     | string    | Hash256       | Transaction ID of the transaction that most recently modified this object. |
| `PreviousTxnLgrSeq` | number    | UInt32        | The sequence of the ledger that contains the transaction that most recently modified this object. |
| `OwnerNode`         | number    | UInt64        | (Default) The page in the owner's directory where this item is referenced. |

### MPToken Flags

Flags are properties or other options associated with the `MPToken` object.


| Flag Name         | Flag Value | Description                                 |
|:------------------|:-----------|:--------------------------------------------|
| `lsfMPTLocked`     | `0x00000001`   | If enabled, indicates that the MPT owned by this account is currently locked and cannot be used in any XRP transactions other than sending value back to the issuer. |
| `lsfMPTAuthorized` | `0x00000002`   | (Only applicable for allow-listing) If set, indicates that the issuer has authorized the holder for the MPT. This flag can be set using a `MPTokenAuthorize` transaction; it can also be "un-set" using a `MPTokenAuthorize` transaction specifying the `tfMPTUnauthorize` flag. |

<!--{# common link defs #}-->
<!-- Uncomment for xrpl.org
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %} -->
