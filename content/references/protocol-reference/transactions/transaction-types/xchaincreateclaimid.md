---
html: xchaincreateclaimid.html 
parent: transaction-types.html
blurb: Create a cross-chain claim ID that is used for a cross-chain transfer.
labels:
  - Interoperability
status: not_enabled
---
# XChainCreateClaimID

The `XChainCreateClaimID` transaction creates a new cross-chain claim ID that is used for a cross-chain transfer. A cross-chain claim ID represents *one* cross-chain transfer of value. 

This transaction is the first step of a cross-chain transfer of value and is submitted on the destination chain, not the source chain. 

It also includes the account on the source chain that locks or burns the funds on the source chain.


## Example {{currentpage.name}} JSON


```json
{
  "Account": "rahDmoXrtPdh7sUdrPjini3gcnTVYjbjjw",
  "OtherChainSource": "rMTi57fNy2UkUb4RcdoUeJm7gjxVQvxzUo",
  "TransactionType": "XChainCreateClaimID",
  "SignatureReward": "100",
  "XChainBridge": {
    "LockingChainDoor": "rMAXACCrp3Y8PpswXcg3bKggHX76V3F8M4",
    "LockingChainIssue": {
      "currency": "XRP"
    },
    "IssuingChainDoor": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
    "IssuingChainIssue": {
      "currency": "XRP"
    }
  }
}
```


{% include '_snippets/tx-fields-intro.md' %}

| Field         | JSON Type           | [Internal Type][] | Description        |
|:--------------|:--------------------|:------------------|:-------------------|
| `OtherChainSource` | String | AccountID | The source account on the other chain. |
| `SignatureReward`  | Number  | Token |  _Required_ The total amount, in XRP, to be rewarded for providing a signature for cross-chain transfer or for signing for the cross-chain reward. This amount will be split among the signers. This must be at least the value of `SignaturesReward` in the `Bridge` ledger object. |
| `XChainBridge`| String | Object | _Required_ The XChainBridge stanza represents the bridge for which the witness is attesting transactions. |
| `LockingChainDoor` | String | AccountID | The door account on the locking chain. |
| `LockingChainIssue` | String | Token | The token that is bridged on the locking chain. |
| `IssuingChainDoor` | String  |  AccountID | The door account on the issuing chain. |
| `IssuingChainIssue` | String | Token | The token that is bridged on the issuing chain. |
| `MinAccountCreateAmount`  | Number  |   |  _Optional_ The minimum amount, in XRP, required for a `XChainCreateAccountCommit` transaction. This is only applicable for XRP-XRP bridges and transactions fail if this field is not present. |


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
