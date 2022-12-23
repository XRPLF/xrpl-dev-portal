---
html: xchaincommit.html 
parent: transaction-types.html
blurb: Initiate a cross-chain transfer of value.
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
  "Account": "rMTi57fNy2UkUb4RcdoUeJm7gjxVQvxzUo",
  "TransactionType": "XChainCommit",
  "XChainBridge": {
    "LockingChainDoor": "rMAXACCrp3Y8PpswXcg3bKggHX76V3F8M4",
    "LockingChainIssue": {
      "currency": "XRP"
    },
    "IssuingChainDoor": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
    "IssuingChainIssue": {
      "currency": "XRP"
    }
  },
  "Amount": "10000",
  "XChainClaimID": "13f"
}
```


{% include '_snippets/tx-fields-intro.md' %}

| Field         | JSON Type           | [Internal Type][] | Description        |
|:--------------|:--------------------|:------------------|:-------------------|
| `Account` | String | AccountID | The account that has initiated the transaction and wants to commit funds. Funds will be deducted from this account. |
| `XChainBridge`| String | Object | _Required_ The bridge for which the witness is attesting transactions. |
| `LockingChainDoor` | String | AccountID | The door account on the locking chain. |
| `LockingChainIssue` | String | Token | The token that is bridged on the locking chain. |
| `IssuingChainDoor` | String  |  AccountID | The door account on the issuing chain. |
| `IssuingChainIssue` | String | Token | The token that is bridged on the issuing chain. |
| `Amount`  | Number  | Token |  _Required_ The total amount that the account wants to transfer. |
| `XChainClaimID` | String | ID | The cross-chain claim ID from the `XChainCreateClaimID` transaction. |



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
