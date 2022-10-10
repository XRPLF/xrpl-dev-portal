---
html: xchaincreateclaimid.html 
parent: transaction-types.html
blurb: Create a bridge between two chains.
labels:
  - Interoperability
status: not_enabled
---
# XChainCreateBridge
<!-- [[Source]](https://github.com/ripple/rippled/blob/xls20/src/ripple/app/tx/impl/NFTokenMint.cpp) -->

The `XChainCreateBridge` transaction defines a new cross-chain bridge entrance on one of the chains that the bridge connects. It includes information about the type of tokens being exchanged. To fully set up a bridge, this transaction must be executed on both chains, alongside setting up witness servers.

The complete production-grade setup would also include a `SignerListSet` transaction on the two door accounts for the witnesses’ signing keys, as well as disabling the door accounts’ master key. This would ensure that the funds are truly in control of the witness servers.

The `XChainCreateClaimID` transaction checks out a cross-chain claim ID that is used for a cross-chain transfer. It is submitted on the destination chain, not the source chain. This is the first step of a cross-chain transfer of value. 

A cross-chain claim ID essentially represents one cross-chain transfer of value. 

This transaction also includes the account on the source chain that locks/burns the funds on the source chain.


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
