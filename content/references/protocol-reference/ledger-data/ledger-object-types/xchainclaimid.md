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

The `XChainClaimID` object must be acquired on the destination chain before submitting a `XChainCommit` on the source chain. Its purpose is to prevent transaction replay attacks and is also used as a place to collect attestations from witness servers.

A `XChainCreateClaimID` transaction is used to create a new `XChainClaimID`. It is destroyed when the funds are successfully claimed on the destination chain.

<!--
## Example {{currentpage.name}} JSON

```json

```
-->

## {{currentpage.name}} Fields



An `XChainClaimID` object has the following fields:

| Field               | JSON Type        | [Internal Type][] | Required? | Description     |
|:--------------------|:-----------------|:------------------|:----------|:----------------|
| `LedgerIndex`       | String           | Hash256           | Yes       | The ledger index is a hash of a unique prefix for `XChainClaimID`s, the actual `XChainClaimID` value, and the fields in `XChainBridge`. |
| `XChainBridge`      | XChainBridge     | XCHAIN_BRIDGE     | Yes       | The bridge that this object correlates to. |
| `OtherChainSource`  | String           | Account           | Yes       | The account that must send the corresponding `XChainCommit` on the source chain. Since the destination may be specified in the `XChainCommit` transaction, if the `SourceAccount` wasn't specified, another account could try to specify a different destination and steal the funds. This also allows tracking only a single set of signatures, since we know which account will send the `XChainCommit` transaction. |
| `SignatureReward`   | Currency Amount  | Amount            | Yes       | The total amount to pay the witness servers for their signatures. It must be at least the value of `SignatureReward` in the `Bridge` ledger object. |
| `XChainClaimAttestations` | Array      | Array            | Yes       | Attestations collected from the witness servers. This includes the parameters needed to recreate the message that was signed, including the amount, which chain (locking or issuing), optional destination, and reward account for that signature. |
| `XChainClaimID`     | String           | UInt64            | Yes       | The unique sequence number for a cross-chain transfer. |