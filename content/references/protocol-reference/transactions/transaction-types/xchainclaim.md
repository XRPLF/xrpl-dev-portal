---
html: xchainclaim.html 
parent: transaction-types.html
blurb: Create a bridge between two chains.
labels:
  - Interoperability
status: not_enabled
---
# XChainClaim

The `XChainClaim` transaction completes a cross-chain transfer of value. It allows a user to claim the value on the destination chain - the equivalent of the value locked on the source chain. A user can only claim the value if they own the cross-chain claim ID associated with the value locked on the source chain (the Account field). The user can send the funds to anyone (the Destination field). This transaction is only needed if an OtherChainDestination is not specified in the XChainCommit transaction, or if something goes wrong with the automatic transfer of funds.


## Example {{currentpage.name}} JSON


```json
{
  "TransactionType": "XChainClaim",
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
