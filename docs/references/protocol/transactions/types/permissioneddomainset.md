---
seo:
    description: Create or update a permissioned domain.
labels:
    - Compliance
    - Permissioned Domains
status: not_enabled
---
# PermissionedDomainSet
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/PermissionedDomainSet.cpp "Source")

Create a [permissioned domain][], or modify one that you own.

{% amendment-disclaimer name="PermissionedDomains" /%}

## Example {% $frontmatter.seo.title %} JSON

```json
{
  "TransactionType": "PermissionedDomainSet",
  "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
  "Fee": "10",
  "Sequence": 390,
  "AcceptedCredentials": [
    {
        "Credential": {
            "Issuer": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
            "CredentialType": "6D795F63726564656E7469616C"
        }
    }
  ]
}
```

<!-- TODO: {% tx-example txid="TODO" /%} -->

{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}

| Field                 | JSON Type         | [Internal Type][] | Required? | Description |
|:----------------------|:------------------|:------------------|:----------|:------------|
| `DomainID`            | String - [Hash][] | UInt256           | No        | The ledger entry ID of an existing permissioned domain to modify. If omitted, creates a new permissioned domain. |
| `AcceptedCredentials` | Array             | Array             | Yes       | A list of 1 to 10 [**Accepted Credentials objects**](#accepted-credentials-objects) that grant access to this domain. The list does not need to be sorted, but it cannot contain duplicates. When modifying an existing domain, this list replaces the existing list. |

### AcceptedCredentials Objects

{% raw-partial file="/docs/_snippets/accepted-credentials-objects.md" /%}

## {% $frontmatter.seo.title %} Flags

There are no flags defined for {% $frontmatter.seo.title %} transactions.

## Error Cases

Besides errors that can occur for all transactions, {% $frontmatter.seo.title %} transactions can result in the following [transaction result codes](../transaction-results/index.md):

| Error Code                | Description |
|:--------------------------|:------------|
| `tecDIR_FULL`             | The transaction would create a new PermissionedDomain, but the sender's owner directory is full. |
| `tecINSUFFICIENT_RESERVE` | The transaction would create a new PermissionedDomain, but the sender does not have enough XRP to meet the increased owner reserve. |
| `tecNO_ENTRY`             | The transaction attempted to modify a Domain that does not exist. Check the `DomainID` field of the transaction. |
| `tecNO_ISSUER`            | At least one of the issuers specified in the `AcceptedCredentials` field is does not exist in the XRP Ledger. Check the `Issuer` field of each member of the array. |
| `tecNO_PERMISSION`        | The transaction attempted to modify an existing Domain, but the sender of the transaction is not the owner of the specified Domain. |
| `temDISABLED`             | Either the `PermissionedDomains` amendment is not enabled, or the `Credentials` amendment is not enabled. |

## See Also

- [PermissionedDomain entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
