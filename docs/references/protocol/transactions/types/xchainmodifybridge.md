---
html: xchainmodifybridge.html 
parent: transaction-types.html
seo:
    description: Modify the parameters of a bridge.
labels:
  - Interoperability
status: not_enabled
---
# XChainModifyBridge
[[Source]](https://github.com/XRPLF/rippled/blob/develop/src/ripple/protocol/impl/TxFormats.cpp#L390-L397 "Source")

_(Requires the [XChainBridge amendment][] {% not-enabled /%})_

The `XChainModifyBridge` transaction allows bridge managers to modify the parameters of the bridge. They can only change the `SignatureReward` and the `MinAccountCreateAmount`.

This transaction must be sent by the door account and requires the entities that control the witness servers to coordinate and provide the signatures for this transaction. This coordination happens outside the ledger.

**Note:** You can't modify the signer list for the bridge with this transaction. The signer list is on the door account itself and is changed in the same way signer lists are changed on accounts (via a `SignerListSet` transaction).


## Example XChainModifyBridge JSON

```json
{
  "TransactionType": "XChainModifyBridge",
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


## XChainModifyBridge Fields

| Field                    | JSON Type           | [Internal Type][] | Required? | Description |
|:-------------------------|:--------------------|:------------------|:----------|-------------|
| `Flags`                  | Number              | UInt32            | Yes       | Specifies the flags for this transaction. |
| `MinAccountCreateAmount` | [Currency Amount][] | Amount            | No        | The minimum amount, in XRP, required for a `XChainAccountCreateCommit` transaction. If this is not present, the `XChainAccountCreateCommit` transaction will fail. This field can only be present on XRP-XRP bridges. |
| `SignatureReward`        | [Currency Amount][] | Amount            | No        | The signature reward split between the witnesses for submitting attestations. |
| `XChainBridge`           | XChainBridge        | XChain_Bridge     | Yes       | The bridge to modify. |


### XChainBridge Fields

| Field               | JSON Type | [Internal Type][] | Required? | Description     |
|:--------------------|:----------|:------------------|:----------|:----------------|
| `IssuingChainDoor`  | String    | Account           | Yes       | The door account on the issuing chain. For an XRP-XRP bridge, this must be the genesis account (the account that is created when the network is first started, which contains all of the XRP). |
| `IssuingChainIssue` | Issue     | Issue             | Yes       | The asset that is minted and burned on the issuing chain. For an IOU-IOU bridge, the issuer of the asset must be the door account on the issuing chain, to avoid supply issues. |
| `LockingChainDoor`  | String    | Account           | Yes       | The door account on the locking chain. |
| `LockingChainIssue` | Issue     | Issue             | Yes       | The asset that is locked and unlocked on the locking chain. |


## Transaction Flags

In addition to the universal transaction flags that are applicable to all transactions, you can specify this flag:

| Flag Name                    | Flag Value   | Description |
|------------------------------|--------------|-------------|
| `tfClearAccountCreateAmount` | `0x00010000` | Clears the `MinAccountCreateAmount` of the bridge. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
