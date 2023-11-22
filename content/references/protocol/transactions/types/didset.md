---
html: didset.html
parent: transaction-types.html
blurb: Create or update a DID.
labels:
  - DID
status: not_enabled
---
# DIDSet
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/app/tx/impl/DID.cpp "Source")

_(Requires the [DID amendment][] :not_enabled:)_

Creates a new [DID ledger entry](did.html) or updates the fields of an existing one.


## Example {{currentpage.name}} JSON

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

{% include '_snippets/tx-fields-intro.md' %}

| Field         | JSON Type | [Internal Type][] | Required? | Description |
|:--------------|:----------|:------------------|:----------|:------------|
| `URI`         | String    | Blob              | No        | The Universal Resource Identifier associated with the DID. |
| `Data`        | String    | Blob              | No        | The public attestations of identity credentials associated with the DID. |
| `DIDDocument` | String    | Blob              | No        | The DID document associated with the DID. |

You must include either `URI`, `Data`, or `DIDDocument` when you submit the `DIDSet` transaction. If all three fields are missing, the transaction fails.

**Note:** To delete the `URI`, `Data`, or `DIDDocument` field from an existing DID ledger entry, add the field as an empty string.


## Error Cases

Besides errors that can occur for all transactions, {{currentpage.name}} transactions can result in the following [transaction result codes](transaction-results.html):

| Error Code          | Description                                  |
|:--------------------|:---------------------------------------------|
| `tecEMPTY_DID` | The DID doesn't have an associated `URI`, `Data`, or `DIDDocument`. Include at least one of these fields. |
| `temEMPTY_DID` | The DID doesn't have an associated `URI`, `Data`, or `DIDDocument`. Include at least one of these fields. |


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
