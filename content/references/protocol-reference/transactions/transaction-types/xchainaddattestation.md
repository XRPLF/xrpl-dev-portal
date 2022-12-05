---
html: xchainaddattestation.html 
parent: transaction-types.html
blurb: Create a bridge between two chains.
labels:
  - Interoperability
status: not_enabled
---
# XChainAddAttestation

The `XChainAddAddestation` transaction is submitted on the destination chain, by the witness server or anyone with access to the signatures from the witness server. It is a proof that an event (essentially just a locking/burning of funds) happened on the source chain.

When enough witnesses have submitted their proofs on the destination chain that an event has occurred, the funds will be released to the destination account in the XChainCommit transaction, if specified. Otherwise, the claim ID owner must submit an XChainClaim transaction to determine where the funds will go on the destination chain.

## Example {{currentpage.name}} JSON


```json
{
  "TransactionType": "XChainAddAttestation",
  "Account": "rhWQzvdmhf5vFS35vtKUSUwNZHGT53qQsg",
  "XChainBridge": {
    "LockingChainDoor": "rhWQzvdmhf5vFS35vtKUSUwNZHGT53qQsg",
    "LockingChainIssue": "XRP",
    "IssuingChainDoor": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
    "IssuingChainIssue": "XRP"
  },
  "SignatureReward": 200,
  "MinAccountCreateAmount": 1000000
}
```


{% include '_snippets/tx-fields-intro.md' %}

| Field         | JSON Type           | [Internal Type][] | Description        |
|:--------------|:--------------------|:------------------|:-------------------|
| `Account`     | String | AccountID |  |
| `XChainBridge`| String |  |  |
| `LockingChainDoor` | String |  |  |
| `LockingChainIssue` |  |  |  |
| `IssuingChainDoor` | String  |   |   |
| `SignatureReward`  | Number  |   |   |
| `MinAccountCreateAmount`  | Number  |   |   |



<!-- ## Error Cases

In addition to errors that can occur for all transactions, {{currentpage.name}} transactions can result in the following [transaction result codes](transaction-results.html):

| Error Code                    | Description                                  |
|:------------------------------|:---------------------------------------------|
| `temDISABLED`                 | The [NonFungibleTokensV1 amendment][] is not enabled. |
-->


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
