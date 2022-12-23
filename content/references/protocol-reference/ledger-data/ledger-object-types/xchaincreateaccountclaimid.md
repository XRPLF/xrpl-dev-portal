html: xchaincreateaccountclaimid.html
parent: ledger-object-types.html
blurb: A bridge connects and enables value to move efficiently between two blockchains. 
labels:
  - Interoperability
status: not_enabled
---
# XChainCreateAccountClaimID
[[Source]](https://github.com/seelabs/rippled/blob/xchain/src/ripple/protocol/impl/LedgerFormats.cpp#L297-L308 "Source")

 _(Added by the in-development Sidechains feature)_ :not_enabled:


## Example {{currentpage.name}} JSON

```json

```

## {{currentpage.name}} Fields



An `XChainCreateAccountClaimID` object has the following fields:

| Field               | JSON Type        | [Internal Type][] | Required? | Description     |
|:--------------------|:-----------------|:------------------|:----------|:----------------|
| `Account`           | String           | Account           | Yes       | The account that serves as a bridge entrance on one chain. |
| `XChainBridge`      | String           | XCHAIN_BRIDGE     | Yes       | The bridge for which the witness is attesting transactions. |
| `XChainAccountCreateCount` | String    | UInt64            | Yes       |   |
| `XChainCreateAccountAttestations` | String | Account       | Yes       |   |
| `OwnerNode`         | String           | UInt64            | Yes       | Internal bookkeeping, indicating the page inside the owner directory where this object is being tracked. |
| `PreviousTxnID`     | String           | UInt256           | Yes       | The identifying hash of the transaction that most recently modified this object. |
| `PreviousTxnLgrSeq` | String           | UInt32            | Yes       | The [index of the ledger][Ledger Index] that contains the transaction that most recently modified this object. |