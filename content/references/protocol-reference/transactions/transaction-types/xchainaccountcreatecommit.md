---
html: xchainaccountcreatecommit.html 
parent: transaction-types.html
blurb: Create an account on one of the chains that the bridge connects. This account serves as the bridge entrance for that chain.
labels:
  - Interoperability
status: not_enabled
---
# XChainAccountCreateCommit

The `XChainAccountCreateCommit` transaction defines a new cross-chain bridge entrance on one of the chains that the bridge connects. It includes information about the type of tokens being exchanged. To fully set up a bridge, this transaction must be executed on both chains, alongside setting up witness servers.

The complete production-grade setup would also include a `SignerListSet` transaction on the two door accounts for the witnesses’ signing keys, as well as disabling the door accounts’ master key. This would ensure that the funds are truly in control of the witness servers.

## Example {{currentpage.name}} JSON


```json
{
  "Account": "rwEqJ2UaQHe7jihxGqmx6J4xdbGiiyMaGa",
  "Destination": "rD323VyRjgzzhY4bFpo44rmyh2neB5d8Mo",
  "TransactionType": "XChainAccountCreateCommit",
  "Amount": "20000000",
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

| Field         | JSON Type           | [Internal Type][] | Required? | Description        |
|:--------------|:--------------------|:------------------|:----------| :------------------|
| `Destination` | String              | Object            | Yes       | The destination account on the destination chain. |
| `Amount`      | Currency Amount     | Amount            | Yes       | The amount, in XRP, to use for account creation. This must be greater than or equal to the `MinAccountCreateAmount` specified in the `Bridge` ledger object. |
| `SignatureReward` | Currency Amount | Amount            | Yes       | The total amount to pay the witness servers for their signatures. This amount must match the amount on the `Bridge` ledger object. These funds will be deducted from the sender's account. |
| `XChainBridge` | XChainBridge       | XCHAIN_BRIDGE     | Yes       | The bridge including door accounts and assets. |


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
