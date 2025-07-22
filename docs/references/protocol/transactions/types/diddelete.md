---
html: diddelete.html
parent: transaction-types.html
seo:
    description: Delete a DID.
labels:
  - DID
---
# DIDDelete

[[Source]](https://github.com/XRPLF/rippled/blob/1e01cd34f7a216092ed779f291b43324c167167a/src/xrpld/app/tx/detail/DID.cpp "Source")

Delete the [DID ledger entry](../../ledger-data/ledger-entry-types/did.md) associated with the specified `Account` field.

{% admonition type="info" name="Note" %}This transaction only uses the [common fields][].{% /admonition %}

_(Added by the [DID amendment][].)_


## Example {% $frontmatter.seo.title %} JSON

```json
{
    "TransactionType": "DIDDelete",
    "Account": "rp4pqYgrTAtdPHuZd1ZQWxrzx45jxYcZex",
    "Fee": "12",
    "Sequence": 391,
    "SigningPubKey":"0293A815C095DBA82FAC597A6BB9D338674DB93168156D84D18417AD509FFF5904",
    "TxnSignature":"3044022011E9A7EE3C7AE9D202848390522E6840F7F3ED098CD13E..."
}
```


## Error Cases

Besides errors that can occur for all transactions, {% $frontmatter.seo.title %} transactions can result in the following [transaction result codes](../transaction-results/index.md):

| Error Code          | Description                                  |
|:--------------------|:---------------------------------------------|
| `tecNO_ENTRY`       | The account doesn't have a DID.              |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
