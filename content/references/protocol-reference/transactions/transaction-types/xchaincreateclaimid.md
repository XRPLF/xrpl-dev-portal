---
html: xchaincreateclaimid.html 
parent: transaction-types.html
blurb: Create a bridge between two chains.
labels:
  - Interoperability
status: not_enabled
---
# XChainCreateClaimID
<!-- [[Source]](https://github.com/ripple/rippled/blob/xls20/src/ripple/app/tx/impl/NFTokenMint.cpp) -->

The `XChainCreateClaimID` transaction creates a new cross-chain claim ID that is used for a cross-chain transfer. A cross-chain claim ID represents *one* cross-chain transfer of value. 

This transaction is the first step of a cross-chain transfer of value and is submitted on the destination chain, not the source chain. 

It also includes the account on the source chain that locks or burns the funds on the source chain.


## Example {{currentpage.name}} JSON


```json
{
  "TransactionType": "XChainCreateClaimID",
  "Account": "rG5r16gHYktYHrLyiWzMMbKQAFRptZe5rH",
  "XChainBridge": {
    "LockingChainDoor": "rhWQzvdmhf5vFS35vtKUSUwNZHGT53qQsg",
    "LockingChainIssue": "XRP",
    "IssuingChainDoor": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
    "IssuingChainIssue": "XRP"
  },
  "SourceAccount": "rhWQzvdmhf5vFS35vtKUSUwNZHGT53qQsg",
  "SignatureReward": 200
}
```


{% include '_snippets/tx-fields-intro.md' %}

| Field         | JSON Type           | [Internal Type][] | Description        |
|:--------------|:--------------------|:------------------|:-------------------|
| `Account`     | String | AccountID |  _Required_ The account that wants to create a new cross-chain claim ID.|
| `XChainBridge`| String |  | _Required_ the bridge for which the new cross-chain claim ID should be created. |
| `SourceAccount` | String  |   | _Required_ The account that must send the XChainCommit transaction on the other chain. |
| `SignaturesReward`  | Number  |   | _Required_ The total amount to pay the witness servers for their signatures. This must be at least the value of `SignaturesReward` in the `Bridge` ledger object.  |


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
