---
seo:
    description: Create or update a DID.
labels:
  - DID
---
# DIDSet

[[Source]](https://github.com/XRPLF/rippled/blob/1e01cd34f7a216092ed779f291b43324c167167a/src/xrpld/app/tx/detail/DID.cpp "Source")

Creates a new [DID ledger entry](../../ledger-data/ledger-entry-types/did.md) or updates the fields of an existing one.

_(Added by the [DID amendment][].)_

## Example {% $frontmatter.seo.title %} JSON

```json
{
  "TransactionType": "DIDSet",
  "Account": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
  "Fee": "10",
  "Sequence": 391,
  "URI": "697066733A2F2F62616679626569676479727A74357366703775646D37687537367568377932366E6634646675796C71616266336F636C67747179353566627A6469",
  "Data": "",
  "SigningPubKey":"0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020"
}
```

{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}

| Field         | JSON Type | [Internal Type][] | Required? | Description |
|:--------------|:----------|:------------------|:----------|:------------|
| `Data`        | String    | Blob              | No        | The public attestations of identity credentials associated with the DID. |
| `DIDDocument` | String    | Blob              | No        | The DID document associated with the DID. |
| `URI`         | String    | Blob              | No        | The Universal Resource Identifier associated with the DID. |

You must include either `Data`, `DIDDocument`, or `URI` when you submit the `DIDSet` transaction. If all three fields are missing, the transaction fails.

{% admonition type="info" name="Note" %}To delete the `Data`, `DIDDocument`, or `URI` field from an existing DID ledger entry, add the field as an empty string.{% /admonition %}


## Error Cases

Besides errors that can occur for all transactions, {% $frontmatter.seo.title %} transactions can result in the following [transaction result codes](../transaction-results/index.md):

| Error Code          | Description                                  |
|:--------------------|:---------------------------------------------|
| `tecEMPTY_DID`      | The transaction will create an empty DID ledger entry. Check that your updates don't remove the `Data`, `DIDDocument`, and `URI` fields. |
| `temEMPTY_DID`      | The transaction is malformed and missing any DID information. Include either the `Data`, `DIDDocument`, or `URI` fields. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
