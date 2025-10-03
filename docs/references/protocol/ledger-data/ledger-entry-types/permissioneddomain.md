---
seo:
    description: A permissioned domain, which is used to limit access to other features.
labels:
  - Compliance
  - Permissioned Domains
status: not_enabled
---
# PermissionedDomain
[[Source]](https://github.com/XRPLF/rippled/blob/master/include/xrpl/protocol/detail/ledger_entries.macro#L451-L461 "Source")

A `PermissionedDomain` ledger entry describes a single [permissioned domain][] instance. You can create a permissioned domain by sending a [PermissionedDomainSet transaction][].

{% amendment-disclaimer name="PermissionedDomains" /%}


## Example {% $frontmatter.seo.title %} JSON

```json
{
  "LedgerEntryType": "PermissionedDomain",
  "Fee": "10",
  "Flags": 0,
  "Owner": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
  "OwnerNode": "0000000000000000",
  "Sequence": 390,
  "AcceptedCredentials": [
    {
        "Credential": {
            "Issuer": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
            "CredentialType": "6D795F63726564656E7469616C"
        }
    }
  ],
  "PreviousTxnID": "E7E3F2BBAAF48CF893896E48DC4A02BDA0C747B198D5AE18BC3D7567EE64B904",
  "PreviousTxnLgrSeq": 8734523,
  "index": "3DFA1DDEA27AF7E466DE395CCB16158E07ECA6BC4EB5580F75EBD39DE833645F"
}
```

<!-- TODO: use a real example above -->

## {% $frontmatter.seo.title %} Fields

In addition to the [common fields](../common-fields.md), {% code-page-name /%} entries have the following fields:

| Field                 | JSON Type            | [Internal Type][] | Required? | Description  |
|:----------------------|:---------------------|:------------------|:----------|--------------|
| `AcceptedCredentials` | Array                | Array             | Yes       | A list of 1 to 10 [Credential](#acceptedcredentials-objects) objects that grant access to this domain. The array is stored sorted by issuer. |
| `Owner`               | String - [Address][] | AccountID         | Yes       | The address of the account that owns this domain. |
| `OwnerNode`           | String               | UInt64            | Yes       | A hint indicating which page of the owner directory links to this entry, in case the directory consists of multiple pages. |
| `PreviousTxnID`       | String - [Hash][]    | UInt256           | Yes       | The identifying hash of the transaction that most recently modified this entry. |
| `PreviousTxnLgrSeq`   | Number               | UInt32            | Yes       | The [index of the ledger][Ledger Index] that contains the transaction that most recently modified this object. |
| `Sequence`            | Number               | UInt32            | Yes       | The `Sequence` value of the transaction that created this entry. |

### AcceptedCredentials Objects

{% raw-partial file="/docs/_snippets/accepted-credentials-objects.md" /%}


## {% $frontmatter.seo.title %} Flags

There are no flags defined for {% code-page-name /%} entries.


## {% $frontmatter.seo.title %} Reserve

Each {% code-page-name /%} entry counts as 1 item toward its owner's reserve requirement.

A {% code-page-name /%} entry is a deletion blocker, meaning an account cannot be deleted if it owns any {% code-page-name /%} entries.


## {% $frontmatter.seo.title %} ID Format

The ID of a {% code-page-name /%} entry is the [SHA-512Half][] of the following values, concatenated in order:

1. The {% code-page-name /%} space key (`0x0082`).
0. The AccountID of the {% code-page-name /%}'s owner.
0. The Sequence number of the transaction that created the {% code-page-name /%}.

## See Also

- **Transactions:**
  - [PermissionedDomainDelete transaction][]
  - [PermissionedDomainSet transaction][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
