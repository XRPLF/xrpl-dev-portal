html: bridge.html
parent: ledger-object-types.html
blurb: A bridge connects and enables value to move efficiently between two blockchains. 
labels:
  - Interoperability
status: not_enabled
---
# Bridge
[[Source]](https://github.com/seelabs/rippled/blob/xchain/src/ripple/protocol/impl/LedgerFormats.cpp#L265-L279 "Source")

 _(Added by the in-development Sidechains feature)_ :not_enabled:

A bridge connects and enables value to move efficiently between two blockchains. A bridge connects the XRP Ledger with another blockchain, such as its sidechain, and enables value in the form of XRP and other tokens (IOUs) to move efficiently between the two blockchains.


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

## {{currentpage.name}} Fields



A `Bridge` object has the following fields:

| Field               | JSON Type        | [Internal Type][] | Required? | Description     |
|:--------------------|:-----------------|:------------------|:----------|:----------------|
| `Account`           | String           | Account           | Yes       |  |
| `Balance`           | String           | Amount            | Yes       | Balance in the sender's account. |
| `SignatureReward`   | String           | Amount            | Yes       | The total amount, in XRP, to be rewarded for providing a signature for cross-chain transfer or for signing for the cross-chain reward. This amount will be split among the signers. |
| `MinAccountCreateAmount` | String      | Amount            | No        | The minimum amount, in XRP, required for a `XChainCreateAccountCommit` transaction. This is only applicable for XRP-XRP bridges and transactions fail if this field is not present.  |
| `XChainBridge`      | String           | XCHAIN_BRIDGE     | Yes       | The bridge for which the witness is attesting transactions. |
| `XChainClaimID`     | String           | UInt64            | Yes       | The cross-chain claim ID that is used for a cross-chain transfer. A cross-chain claim ID represents *one* cross-chain transfer of value.  |
| `XChainAccountCreateCount` | String    | UInt64            | Yes       |  |
| `XChainAccountClaimCount` | String     | UInt64            | Yes       |  |
| `OwnerNode`         | String           | UInt64            | Yes       | Internal bookkeeping, indicating the page inside the owner directory where this object is being tracked. |
| `PreviousTxnID`     | String           | UInt256           | Yes       | The identifying hash of the transaction that most recently modified this object. |
| `PreviousTxnLgrSeq` | String           | UInt32            | Yes       | The [index of the ledger][Ledger Index] that contains the transaction that most recently modified this object. |