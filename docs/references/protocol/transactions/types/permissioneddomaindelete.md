---
seo:
    description: Delete a Permissioned Domain entry from the ledger.
labels:
  - Compliance
  - Permissioned Domains
---
# PermissionedDomainDelete
[[Source]](https://github.com/XRPLF/rippled/blob/1e01cd34f7a216092ed779f291b43324c167167a/src/xrpld/app/tx/detail/PermissionedDomainDelete.cpp "Source")

Delete a [permissioned domain][] that you own.

_(Requires the [PermissionedDomains amendment][] {% not-enabled /%})_

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

Besides errors that can occur for all transactions, {% $frontmatter.seo.title %} transactions can result in the following [transaction result codes](https://xrpl.org/docs/references/protocol/transactions/transaction-results):

| Error Code    | Description                                  |
|:--------------|:---------------------------------------------|
| `tecNO_ENTRY` | The permissioned domain specified in the `DomainID` field doesn't exist in the ledger. |
| `temDISABLED` | The `PermissionedDomains` amendment is not enabled. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
