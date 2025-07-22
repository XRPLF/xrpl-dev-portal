---
seo:
    description: The `XChainOwnedCreateAccountClaimID` ledger object is used to collect attestations for creating an account via a cross-chain transfer. 
labels:
  - Interoperability
status: not_enabled
---
# XChainOwnedCreateAccountClaimID
[[Source]](https://github.com/XRPLF/rippled/blob/1e01cd34f7a216092ed779f291b43324c167167a/include/xrpl/protocol/detail/ledger_entries.macro#L330-L338 "Source")

An `XChainOwnedCreateAccountClaimID` ledger entry collects attestations for creating an account via a cross-chain transfer.

You can create a new `XChainOwnedCreateAccountClaimID` entry by sending an [XChainAddAccountCreateAttestation transaction][] with a signed attestation of a relevant transaction occurring on another chain.

An `XChainOwnedCreateAccountClaimID` ledger entry is destroyed when all the attestations have been received and the funds have transferred to the new account.

_(Requires the [XChainBridge amendment][] {% not-enabled /%})_


## Example XChainOwnedCreateAccountClaimID JSON

```json
{
  "LedgerEntryType": "XChainOwnedCreateAccountClaimID",
  "LedgerIndex": "5A92F6ED33FDA68FB4B9FD140EA38C056CD2BA9673ECA5B4CEF40F2166BB6F0C",
  "Account": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
  "XChainAccountCreateCount": "66",
  "XChainBridge": {
    "IssuingChainDoor": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
    "IssuingChainIssue": {
      "currency": "XRP"
    },
    "LockingChainDoor": "rMAXACCrp3Y8PpswXcg3bKggHX76V3F8M4",
    "LockingChainIssue": {
      "currency": "XRP"
    }
  },
  "XChainCreateAccountAttestations": [
    {
      "XChainCreateAccountProofSig": {
        "Amount": "20000000",
        "AttestationRewardAccount": "rMtYb1vNdeMDpD9tA5qSFm8WXEBdEoKKVw",
        "AttestationSignerAccount": "rL8qTrAvZ8Q1o1H9H9Ahpj3xjgmRvFLvJ3",
        "Destination": "rBW1U7J9mEhEdk6dMHEFUjqQ7HW7WpaEMi",
        "PublicKey": "021F7CC4033EFBE5E8214B04D1BAAEC14808DC6C02F4ACE930A8EF0F5909B0C438",
        "SignatureReward": "100",
        "WasLockingChainSend": 1
      }
    }
  ]
}
```


## XChainOwnedCreateAccountClaimID Fields

| Field                             | JSON Type    | [Internal Type][] | Required? | Description |
|:----------------------------------|:-------------|:------------------|:----------|:------------|
| `Account`                         | String       | AccountID         | Yes       | The account that owns this object. |
| `LedgerIndex`                     | String       | UInt256           | Yes       | The ledger index is a hash of a unique prefix for `XChainOwnedCreateAccountClaimID`s, the actual `XChainAccountClaimCount` value, and the fields in `XChainBridge`. |
| `XChainAccountCreateCount`        | Number       | UInt64            | Yes       | An integer that determines the order that accounts created through cross-chain transfers must be performed. Smaller numbers must execute before larger numbers. |
| `XChainBridge`                    | XChainBridge | XChainBridge      | Yes       | The door accounts and assets of the bridge this object correlates to. |
| `XChainCreateAccountAttestations` | Array        | Array             | Yes       | Attestations collected from the witness servers. This includes the parameters needed to recreate the message that was signed, including the amount, destination, signature reward amount, and reward account for that signature. With the exception of the reward account, all signatures must sign the message created with common parameters. |


### XChainCreateAccountAttestations Fields

| Field                         | JSON Type           | [Internal Type][] | Required | Description |
|-------------------------------|---------------------|-------------------|----------|-------------|
| `XChainCreateAccountProofSig` | Array               | Object            | Yes      | An attestation from one witness server. |
| `Amount`                      | [Currency Amount][] | Amount            | Yes      | The amount committed by the `XChainAccountCreateCommit` transaction on the source chain. |
| `AttestationRewardAccount`    | String              | AccountID         | Yes      | The account that should receive this signer's share of the `SignatureReward`. |
| `AttestationSignerAccount`    | String              | AccountID         | Yes      | The account on the door account's signer list that is signing the transaction. |
| `Destination`                 | String              | AccountID         | Yes      | The destination account for the funds on the destination chain. |
| `PublicKey`                   | String              | Blob              | Yes      | The public key used to verify the signature. |
| `WasLockingChainSend`         | Number              | UInt8             | Yes      | A boolean representing the chain where the event occurred. |


### XChainBridge Fields

| Field               | JSON Type | [Internal Type][] | Required? | Description     |
|:--------------------|:----------|:------------------|:----------|:----------------|
| `IssuingChainDoor`  | String    | AccountID         | Yes       | The door account on the issuing chain. For an XRP-XRP bridge, this must be the genesis account (the account that is created when the network is first started, which contains all of the XRP). |
| `IssuingChainIssue` | Issue     | Issue             | Yes       | The asset that is minted and burned on the issuing chain. For an IOU-IOU bridge, the issuer of the asset must be the door account on the issuing chain, to avoid supply issues. |
| `LockingChainDoor`  | String    | AccountID         | Yes       | The door account on the locking chain. |
| `LockingChainIssue` | Issue     | Issue             | Yes       | The asset that is locked and unlocked on the locking chain. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
