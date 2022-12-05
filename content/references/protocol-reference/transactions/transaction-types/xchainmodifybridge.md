---
html: xchainmodifybridge.html 
parent: transaction-types.html
blurb: Modify a bridge object on one of the chains that the bridge connects.
labels:
  - Interoperability
status: not_enabled
---
# XChainModifyBridge

The `XChainModifyBridge` transaction modifies a `Bridge` ledger object on one of the chains that the bridge connects. You can only change the `SignaturesReward` or `MinAccountCreateAmount` values, because changing the bridge itself (either door account or either currency) would essentially render all cross-chain funds useless - you’d be better off creating another bridge instead. This transaction must be sent by the door account, and correctly signed using whatever signer list set it has.

## Example {{currentpage.name}} JSON


```json
{
  "TransactionType": "XChainModifyBridge",
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
| `Account`     | String | AccountID | _Required_ The door account that wants to modify the bridge. |
| `XChainBridge`| String | Object | _Required_ The bridge that you want to modify. |
| `LockingChainDoor` | String | Account ID  |  |
| `LockingChainIssue` |  |  |  |
| `IssuingChainDoor` | String  |   |   |
| `SignatureReward`  | Number  |   | _Optional_ The total amount, in XRP, to be rewarded for providing a signature for a cross-chain transfer or for signing for the cross-chain reward. This will be split among the signers. Note that you must specify one of `SignatureReward`, `MinAccountCreateAmount`, or both. |
| `MinAccountCreateAmount`  | Number  |   |  _Optional_ The minimum amount, in XRP, required for a `XChainCreateAccountCommit` transaction. Note that you must specify one of `SignatureReward`, `MinAccountCreateAmount`, or both. |

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
