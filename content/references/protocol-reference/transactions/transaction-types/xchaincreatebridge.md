---
html: xchaincreatebridge.html 
parent: transaction-types.html
blurb: Create a bridge between two chains.
labels:
  - Interoperability
status: not_enabled
---
# XChainCreateBridge

The `XChainCreateBridge` transaction defines a new cross-chain bridge entrance on one of the chains that the bridge connects. It includes information about the type of tokens being exchanged. To fully set up a bridge, this transaction must be executed on both chains, alongside setting up witness servers.

The complete production-grade setup would also include a `SignerListSet` transaction on the two door accounts for the witnesses’ signing keys, as well as disabling the door accounts’ master key. This would ensure that the funds are truly in control of the witness servers.


## Example {{currentpage.name}} JSON


```json
{
  "TransactionType": "XChainCreateBridge",
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
| `Account`     | String | AccountID | _Required_ The door account used for the bridge. |
| `XChainBridge`| String | Object | _Required_ The XChainBridge stanza represents the bridge for which the witness is attesting transactions. |
| `LockingChainDoor` | String | AccountID | The door account on this chain. |
| `LockingChainIssue` | String | Token | The token that is bridged on this chain. |
| `IssuingChainDoor` | String  |  AccountID | The door account on the other chain. |
| `SignatureReward`  | Number  |   |  _Required_ The total amount, in XRP, to be rewarded for providing a signature for cross-chain transfer or for signing for the cross-chain reward. This amount will be split among the signers. |
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
