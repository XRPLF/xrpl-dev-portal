---
html: xchaincommit.html 
parent: transaction-types.html
blurb: Create a bridge between two chains.
labels:
  - Interoperability
status: not_enabled
---
# XChainCommit

The `XChainCommit` transaction initiates a cross-chain transfer of value. This is done on the source chain, and locks/burns the value (“commits” the value), so that the equivalent amount can be minted/unlocked on the destination chain. Essentially, it tells the witness servers that the value was locked/burned. This value is tied to a specific cross-chain claim ID (which is included in the transaction).

The account that owns the cross-chain claim ID on the destination chain is the account that controls the funds on the other end of the bridge. The funds go to the destination account specified in the XChainCommit transaction, if specified. If the destination account is not specified, then the claim ID owner must submit an XChainClaim transaction to determine where the funds will go on the destination chain.


## Example {{currentpage.name}} JSON


```json
{
  "TransactionType": "XChainCommit",
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
