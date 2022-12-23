html: xchainclaimid.html
parent: ledger-object-types.html
blurb: An `XChainClaimID` object represents *one* cross-chain transfer of value. 
labels:
  - Interoperability
status: not_enabled
---
# XChainClaimID
[[Source]](https://github.com/seelabs/rippled/blob/xchain/src/ripple/protocol/impl/LedgerFormats.cpp#L282-L295 "Source")

 _(Added by the in-development Sidechains feature)_ :not_enabled:

An `XChainClaimID` object represents *one* cross-chain transfer of value and includes information of the account on the source chain that locks or burns the funds on the source chain.

## Example {{currentpage.name}} JSON

```json
{
  "Account": "rahDmoXrtPdh7sUdrPjini3gcnTVYjbjjw",
  "OtherChainSource": "rMTi57fNy2UkUb4RcdoUeJm7gjxVQvxzUo",
  "TransactionType": "XChainCreateClaimID",
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

## {{currentpage.name}} Fields



An `XChainClaimID` object has the following fields:

| Field               | JSON Type        | [Internal Type][] | Required? | Description     |
|:--------------------|:-----------------|:------------------|:----------|:----------------|
| `Account`           | String           | Account           | Yes       | The account that serves as a bridge entrance on one chain. |
| `XChainBridge`      | String           | XCHAIN_BRIDGE     | Yes       | The bridge for which the witness is attesting transactions. |
| `XChainClaimID`     | String           | UInt64            | Yes       | The cross-chain claim ID that is used for a cross-chain transfer. A cross-chain claim ID represents *one* cross-chain transfer of value.  |
| `OtherChainSource`  | String           | Account           | Yes       | The account that serves as a bridge entrance on the other chain. |
| `XChainClaimAttestations` | String     | Amount            | Yes       |  |
| `SignatureReward`   | String           | Amount            | Yes       | The total amount, in XRP, to be rewarded for providing a signature for cross-chain transfer or for signing for the cross-chain reward. This amount will be split among the signers. |
| `OwnerNode`         | String           | UInt64            | Yes       | Internal bookkeeping, indicating the page inside the owner directory where this object is being tracked. |
| `PreviousTxnID`     | String           | UInt256           | Yes       | The identifying hash of the transaction that most recently modified this object. |
| `PreviousTxnLgrSeq` | String           | UInt32            | Yes       | The [index of the ledger][Ledger Index] that contains the transaction that most recently modified this object. |