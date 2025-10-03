---
seo:
    description: A record of which permissions have been granted to another account.
labels:
  - Accounts
  - Permissions
status: not_enabled
---
# Delegate
[[Source]](https://github.com/XRPLF/rippled/blob/1e01cd34f7a216092ed779f291b43324c167167a/include/xrpl/protocol/detail/ledger_entries.macro#L475-L482 "Source")

A `Delegate` ledger entry stores a set of permissions that an account has delegated to another account. You create a `Delegate` entry by sending a [DelegateSet transaction][].

{% amendment-disclaimer name="PermissionDelegation" /%}

## Example {% $frontmatter.seo.title %} JSON

```json
{
  "Account": "rG8uoRH9uA6AJ6NRj8P4cJG1HNfYcnMPrt",
  "Authorize": "r9GAKojMTyexqvy8DXFWYq63Mod5k5wnkT",
  "Flags": 0,
  "LedgerEntryType": "Delegate",
  "OwnerNode": "0",
  "Permissions": [
    {
      "Permission": {
        "PermissionValue": "AccountDomainSet"
      }
    }
  ],
  "PreviousTxnID": "08DB1BD6ECFC9E8CBD8D954F4EFF6EFD155A392C5060D767B5621CE18951983A",
  "PreviousTxnLgrSeq": 4748731,
  "index": "749D3DCDF9F032DDDB8AC49641BACBFDD398C4B6C231C4AB325B7755962329A2"
}
```

## {% $frontmatter.seo.title %} Fields

In addition to the [common fields](../common-fields.md), {% code-page-name /%} entries have the following fields:

| Field               | JSON Type            | [Internal Type][] | Required? | Description  |
|:--------------------|:---------------------|:------------------|:----------|:-------------|
| `Account`           | String - [Address][] | AccountID         | Yes       | The account delegating permissions to another, also called the _delegating account_. |
| `Authorize`         | String - [Address][] | AccountID         | Yes       | The account receiving permissions, also called the _delegate_. |
| `Permissions`       | Array                | Array             | Yes       | A list of permissions granted, with at least 1 and at most 10 items. Each item in the list is a [Permission Object](#permission-objects). |
| `OwnerNode`         | String - Hexadecimal | UInt64            | Yes       | A hint indicating which page of the delegating account's owner directory links to this object, in case the directory consists of multiple pages. 
| `PreviousTxnID`     | String - Hexadecimal | UInt256           | Yes       | The identifying hash of the transaction that most recently modified this object. |
| `PreviousTxnLgrSeq` | Number               | UInt32            | Yes       |The [index of the ledger][Ledger Index] that contains the transaction that most recently modified this object. |

### Permission Objects

Each item in the `Permissions` array is an inner object with the following nested field:

| Field             | JSON Type            | [Internal Type][] | Required? | Description     |
|:------------------|:---------------------|:------------------|:----------|:----------------|
| `PermissionValue` | String or Number     | UInt32            | Yes       | A permission that has been granted to the delegate, which can be either a transaction type or a granular permission. See [Permission Values](../../data-types/permission-values.md) for a full list. |

## {% $frontmatter.seo.title %} Flags

There are no flags defined for {% code-page-name /%} entries.

## {% $frontmatter.seo.title %} Reserve

{% code-page-name /%} entries count as one item towards the owner reserve of the delegating account, as long as the entry is in the ledger, regardless of how many permissions are delegating. Removing all permissions deletes the entry and frees up the reserve.

{% code-page-name /%} entries are not deletion blockers. If the owner (delegating) account is deleted, all such ledger entries are deleted along with them. However, the `Authorize`

## See Also

- **Transactions:**
  - [DelegateSet transaction][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
