---
html: diddelete.html
parent: transaction-types.html
seo:
    description: Delete a DID.
labels:
  - DID
status: not_enabled
---
# DIDDelete

[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/app/tx/impl/DID.cpp "Source")

_(Requires the [DID amendment][] {% not-enabled /%})_

Delete the [DID ledger entry](../../ledger-data/ledger-entry-types/did.md) associated with the specified `Account` field.

**Note:** This transaction only uses the [common fields][].


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
