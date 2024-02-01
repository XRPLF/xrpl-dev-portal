---
html: xchaincreatebridge.html 
parent: transaction-types.html
seo:
    description: Create a bridge between two chains.
labels:
  - Interoperability
status: not_enabled
---
# XChainCreateBridge
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/protocol/impl/TxFormats.cpp#L381-L388 "Source")

_(Requires the [XChainBridge amendment][] {% not-enabled /%})_

The `XChainCreateBridge` transaction creates a new `Bridge` ledger object and defines a new cross-chain bridge entrance on the chain that the transaction is submitted on. It includes information about door accounts and assets for the bridge. 

The transaction must be submitted first by the locking chain door account. To set up a valid bridge, door accounts on both chains must submit this transaction, in addition to setting up witness servers.

The complete production-grade setup would also include a `SignerListSet` transaction on the two door accounts for the witnesses’ signing keys, as well as disabling the door accounts’ master key. This ensures that the witness servers are truly in control of the funds.

**Note:** Each door account can only have one bridge. This prevents the creation of duplicate bridges for the same asset, which can cause asset imbalances on either chain.


## Example XChainCreateBridge JSON

```json
{
  "TransactionType": "XChainCreateBridge",
  "Account": "rhWQzvdmhf5vFS35vtKUSUwNZHGT53qQsg",
  "XChainBridge": {
    "LockingChainDoor": "rhWQzvdmhf5vFS35vtKUSUwNZHGT53qQsg",
    "LockingChainIssue": {
      "currency": "XRP"
    },
    "IssuingChainDoor": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
    "IssuingChainIssue": {
      "currency": "XRP"
    }
  },
  "SignatureReward": 200,
  "MinAccountCreateAmount": 1000000
}
```


## XChainCreateBridge Fields

| Field                    | JSON Type           | [Internal Type][] | Required? | Description |
|:-------------------------|:--------------------|:------------------|:----------|:------------|
| `MinAccountCreateAmount` | [Currency Amount][] | Amount            | No        | The minimum amount, in XRP, required for a `XChainAccountCreateCommit` transaction. If this isn't present, the `XChainAccountCreateCommit` transaction will fail. This field can only be present on XRP-XRP bridges. |
| `SignatureReward`        | [Currency Amount][] | Amount            | Yes       | The total amount to pay the witness servers for their signatures. This amount will be split among the signers. |
| `XChainBridge`           | XChainBridge        | XChain_Bridge     | Yes       | The bridge (door accounts and assets) to create. |


### XChainBridge Fields

| Field               | JSON Type | [Internal Type][] | Required? | Description     |
|:--------------------|:----------|:------------------|:----------|:----------------|
| `IssuingChainDoor`  | String    | Account           | Yes       | The door account on the issuing chain. For an XRP-XRP bridge, this must be the genesis account (the account that is created when the network is first started, which contains all of the XRP). |
| `IssuingChainIssue` | Issue     | Issue             | Yes       | The asset that is minted and burned on the issuing chain. For an IOU-IOU bridge, the issuer of the asset must be the door account on the issuing chain, to avoid supply issues. |
| `LockingChainDoor`  | String    | Account           | Yes       | The door account on the locking chain. |
| `LockingChainIssue` | Issue     | Issue             | Yes       | The asset that is locked and unlocked on the locking chain. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
