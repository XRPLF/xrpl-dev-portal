---
seo:
    description: Start a cross-chain transfer of value.
labels:
    - Interoperability
status: not_enabled
---
# XChainCommit
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/XChainBridge.cpp "Source")

Do the second step in a [cross-chain transfer](../../../../concepts/xrpl-sidechains/cross-chain-bridges.md). This transaciton has two modes:

- Put assets into trust on the locking chain so that they can be wrapped on the issuing chain.
- Burns wrapped assets on the issuing chain so that they can be returned on the locking chain.

{% amendment-disclaimer name="XChainBridge" /%}

## Example XChainCommit JSON

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


{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}

| Field                   | JSON Type           | [Internal Type][] | Required? | Description |
|:------------------------|:--------------------|:------------------|:----------|-------------|
| `Amount`                | [Currency Amount][] | Amount            | Yes       | The asset to commit, and the quantity. This must match the door account's `LockingChainIssue` (if on the locking chain) or the door account's `IssuingChainIssue` (if on the issuing chain). |
| `OtherChainDestination` | String              | AccountID         | No        | The destination account on the destination chain. If this is not specified, the account that submitted the `XChainCreateClaimID` transaction on the destination chain will need to submit a `XChainClaim` transaction to claim the funds. |
| `XChainBridge`          | XChainBridge        | XChainBridge      | Yes       | The bridge to use to transfer funds. |
| `XChainClaimID`         | String              | UInt64            | Yes       | The unique integer ID for a cross-chain transfer. This must be acquired on the destination chain (via a `XChainCreateClaimID` transaction) and checked from a validated ledger before submitting this transaction. If an incorrect sequence number is specified, the funds will be lost. |


### XChainBridge Fields

| Field               | JSON Type | [Internal Type][] | Required? | Description     |
|:--------------------|:----------|:------------------|:----------|:----------------|
| `IssuingChainDoor`  | String    | AccountID         | Yes       | The door account on the issuing chain. For an XRP-XRP bridge, this must be the genesis account (the account that is created when the network is first started, which contains all of the XRP). |
| `IssuingChainIssue` | Issue     | Issue             | Yes       | The asset that is minted and burned on the issuing chain. For an IOU-IOU bridge, the issuer of the asset must be the door account on the issuing chain, to avoid supply issues. |
| `LockingChainDoor`  | String    | AccountID         | Yes       | The door account on the locking chain. |
| `LockingChainIssue` | Issue     | Issue             | Yes       | The asset that is locked and unlocked on the locking chain. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
