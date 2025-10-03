---
seo:
    description: Delete a permissioned domain.
labels:
    - Compliance
    - Permissioned Domains
status: not_enabled
---
# PermissionedDomainDelete
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/PermissionedDomainDelete.cpp "Source")

Delete a [permissioned domain][] that you own.

{% amendment-disclaimer name="PermissionedDomains" /%}

## Example {% $frontmatter.seo.title %} JSON

```json
{
  "TransactionType": "PermissionedDomainDelete",
  "Account": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
  "Fee": "10",
  "Sequence": 392,
  "DomainID": "77D6234D074E505024D39C04C3F262997B773719AB29ACFA83119E4210328776"
}
```

<!-- TODO: {% tx-example txid="TODO" /%} -->

{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}

| Field      | JSON Type         | [Internal Type][] | Required? | Description |
|:-----------|:------------------|:------------------|:----------|:------------|
| `DomainID` | String - [Hash][] | UInt256           | Yes       | The ledger entry ID of the Permissioned Domain entry to delete. |

## {% $frontmatter.seo.title %} Flags

There are no flags defined for {% $frontmatter.seo.title %} transactions.

## Error Cases

Besides errors that can occur for all transactions, {% $frontmatter.seo.title %} transactions can result in the following [transaction result codes](../transaction-results/index.md):

| Error Code    | Description                                  |
|:--------------|:---------------------------------------------|
| `tecNO_ENTRY` | The permissioned domain specified in the `DomainID` field doesn't exist in the ledger. |
| `temDISABLED` | The `PermissionedDomains` amendment is not enabled. |

## See Also

- [PermissionedDomain entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
