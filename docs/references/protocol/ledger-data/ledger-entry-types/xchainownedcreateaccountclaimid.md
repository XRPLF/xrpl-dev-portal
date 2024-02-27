---
html: xchainownedcreateaccountclaimid.html
parent: ledger-entry-types.html
seo:
    description: The `XChainOwnedCreateAccountClaimID` ledger object is used to collect attestations for creating an account via a cross-chain transfer. 
labels:
  - Interoperability
status: not_enabled
---
# XChainOwnedCreateAccountClaimID
_(Requires the [XChainBridge amendment][] {% not-enabled /%})_

[[Source]](https://github.com/seelabs/rippled/blob/xbridge/src/ripple/protocol/impl/LedgerFormats.cpp#L296-L306 "Source")

The `XChainOwnedCreateAccountClaimID` ledger object is used to collect attestations for creating an account via a cross-chain transfer.

It is created when an `XChainAddAccountCreateAttestation` transaction adds a signature attesting to a `XChainAccountCreateCommit` transaction and the `XChainAccountCreateCount` is greater than or equal to the current `XChainAccountClaimCount` on the `Bridge` ledger object.

The ledger object is destroyed when all the attestations have been received and the funds have transferred to the new account.


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
| `Account`                         | String       | Account           | Yes       | The account that owns this object. |
| `LedgerIndex`                     | String       | Hash256           | Yes       | The ledger index is a hash of a unique prefix for `XChainOwnedCreateAccountClaimID`s, the actual `XChainAccountClaimCount` value, and the fields in `XChainBridge`. |
| `XChainAccountCreateCount`        | Number       | UInt64            | Yes       | An integer that determines the order that accounts created through cross-chain transfers must be performed. Smaller numbers must execute before larger numbers. |
| `XChainBridge`                    | XChainBridge | XChain_Bridge     | Yes       | The door accounts and assets of the bridge this object correlates to. |
| `XChainCreateAccountAttestations` | Array        | Array             | Yes       | Attestations collected from the witness servers. This includes the parameters needed to recreate the message that was signed, including the amount, destination, signature reward amount, and reward account for that signature. With the exception of the reward account, all signatures must sign the message created with common parameters. |


### XChainCreateAccountAttestations Fields

| Field                         | JSON Type           | [Internal Type][] | Required | Description |
|-------------------------------|---------------------|-------------------|----------|-------------|
| `XChainCreateAccountProofSig` | Array               | Object            | Yes      | An attestation from one witness server. |
| `Amount`                      | [Currency Amount][] | Amount            | Yes      | The amount committed by the `XChainAccountCreateCommit` transaction on the source chain. |
| `AttestationRewardAccount`    | String              | Account           | Yes      | The account that should receive this signer's share of the `SignatureReward`. |
| `AttestationSignerAccount`    | String              | Account           | Yes      | The account on the door account's signer list that is signing the transaction. |
| `Destination`                 | String              | Account           | Yes      | The destination account for the funds on the destination chain. |
| `PublicKey`                   | String              | Blob              | Yes      | The public key used to verify the signature. |
| `WasLockingChainSend`         | Number              | UInt8             | Yes      | A boolean representing the chain where the event occurred. |


### XChainBridge Fields

| Field               | JSON Type | [Internal Type][] | Required? | Description     |
|:--------------------|:----------|:------------------|:----------|:----------------|
| `IssuingChainDoor`  | String    | Account           | Yes       | The door account on the issuing chain. For an XRP-XRP bridge, this must be the genesis account (the account that is created when the network is first started, which contains all of the XRP). |
| `IssuingChainIssue` | Issue     | Issue              | Yes       | The asset that is minted and burned on the issuing chain. For an IOU-IOU bridge, the issuer of the asset must be the door account on the issuing chain, to avoid supply issues. |
| `LockingChainDoor`  | String    | Account            | Yes       | The door account on the locking chain. |
| `LockingChainIssue` | Issue     | Issue              | Yes       | The asset that is locked and unlocked on the locking chain. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
