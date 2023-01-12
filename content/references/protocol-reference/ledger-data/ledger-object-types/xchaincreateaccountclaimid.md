html: xchaincreateaccountclaimid.html
parent: ledger-object-types.html
blurb: An `XChainCreateAccountClaimID` object describes an account to be created on the issuing chain. 
labels:
  - Interoperability
status: not_enabled
---
# XChainCreateAccountClaimID
[[Source]](https://github.com/seelabs/rippled/blob/xchain/src/ripple/protocol/impl/LedgerFormats.cpp#L297-L308 "Source")

 _(Added by the in-development Sidechains feature)_ :not_enabled:


<!--
## Example {{currentpage.name}} JSON

```json

```
-->

## {{currentpage.name}} Fields



An `XChainCreateAccountClaimID` object has the following fields:

| Field               | JSON Type        | [Internal Type][] | Required? | Description     |
|:--------------------|:-----------------|:------------------|:----------|:----------------|
| `LedgerIndex`       | String           | Hash256           | Yes       | The ledger index is a hash of a unique prefix for `XChainCreateAccountClaimID`s, the `XChainAccountCreateCount`, and the fields in `XChainBridge`. |
| `XChainBridge`      | XChainBridge     | XCHAIN_BRIDGE     | Yes       | The bridge including door accounts and assets. |
| `XChainAccountCreateCount` | Number    | UInt64            | Yes       | An integer that determines the order that accounts created through cross-chain transfers must be performed. Smaller numbers must execute before larger numbers.  |
| `XChainCreateAccountAttestations` | Array | Array          | Yes       | Attestations collected from the witness servers. This includes the parameters needed to recreate the message that was signed, including the amount, destination, signature reward amount, and reward account for that signature. With the exception of the reward account, all signatures must sign the message created with common parameters. |