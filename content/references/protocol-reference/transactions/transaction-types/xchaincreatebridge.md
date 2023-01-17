---
html: xchaincreatebridge.html 
parent: transaction-types.html
blurb: Create a bridge between two chains.
labels:
  - Interoperability
status: not_enabled
---
# XChainCreateBridge

The `XChainCreateBridge` transaction creates a new `Bridge` ledger object and defines a new cross-chain bridge entrance on the chain that the transaction is submitted on. It includes information about door accounts and assets for the bridge. 

The transaction must be submitted by the door account. To set up a valid bridge, door accounts on both chains must submit this transaction, in addition to setting up witness servers.

The complete production-grade setup would also include a `SignerListSet` transaction on the two door accounts for the witnesses’ signing keys, as well as disabling the door accounts’ master key. This ensures that the witness servers are truly in control of the funds.

CAUTION: Ensure that you do not create a duplicate bridge with different set of door accounts for an existing asset. Doing so can cause an imbalance of available wrapped XRP on the issuing chain. 

To mitigate the possibility of creating a duplicate bridge, ensure the following:

* The issuing chain door account should only issue tokens for a single bridge. Do not create two(2) bridges with the same issuing asset on the same issuing chain. 
* Do not create two (2) bridges with the same locking asset in the same door account. You can create them with different door accounts. 

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

| Field         | JSON Type           | [Internal Type][] | Required? | Description        |
|:--------------|:--------------------|:------------------|:----------|:-------------------|
| `XChainBridge`| XChainBridge        | XCHAIN_BRIDGE     | Yes       | The bridge (door accounts and assets) to create. |
| `SignatureReward` | Currency Amount | Amount            | Yes       | The total amount to pay the witness servers for their signatures. This amount will be split among the signers. |
| `MinAccountCreateAmount` | Currency Amount | Amount     |  No       | The minimum amount, in XRP, required for a `XChainCreateAccountCommit` transaction. This is only applicable for XRP-XRP bridges and transactions fail if this field is not present. |

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
