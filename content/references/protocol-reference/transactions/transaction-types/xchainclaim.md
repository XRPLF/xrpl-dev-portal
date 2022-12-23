---
html: xchainclaim.html 
parent: transaction-types.html
blurb: Complete a cross-chain transfer of value by claiming the value on the destination chain.
labels:
  - Interoperability
status: not_enabled
---
# XChainClaim

The `XChainClaim` transaction completes a cross-chain transfer of value. It allows a user to claim the value on the destination chain - the equivalent of the value locked on the source chain. A user can only claim the value if they own the cross-chain claim ID associated with the value locked on the source chain (the `Account` field). The user can send the funds to anyone (the `Destination` field). This transaction is only needed if an `OtherChainDestination` is not specified in the XChainCommit transaction, or if something goes wrong with the automatic transfer of funds.


## Example {{currentpage.name}} JSON


```json
{
  "Account": "rahDmoXrtPdh7sUdrPjini3gcnTVYjbjjw",
  "Amount": "10000",
  "TransactionType": "XChainClaim",
  "XChainClaimID": "13f",
  "Destination": "rahDmoXrtPdh7sUdrPjini3gcnTVYjbjjw",
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
| `XChainBridge`| String | Object | _Required_ The XChainBridge stanza represents the bridge for which the witness is attesting transactions. |
| `LockingChainDoor` | String | AccountID | The door account on the locking chain. |
| `LockingChainIssue` | String | Token | The token that is bridged on the locking chain. |
| `IssuingChainDoor` | String  |  AccountID | The door account on the issuing chain. |
| `IssuingChainIssue` | String | Token | The token that is bridged on the issuing chain. |
| `SignatureReward`  | Number  | Token |  _Required_ The total amount, in XRP, to be rewarded for providing a signature for cross-chain transfer or for signing for the cross-chain reward. This amount will be split among the signers. |
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
