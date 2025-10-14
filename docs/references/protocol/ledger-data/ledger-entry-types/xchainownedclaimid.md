---
seo:
    description: A cross-chain transfer of value.
labels:
  - Sidechains
status: not_enabled
---
# XChainOwnedClaimID
[[Source]](https://github.com/XRPLF/rippled/blob/f64cf9187affd69650907d0d92e097eb29693945/include/xrpl/protocol/detail/ledger_entries.macro#L259-L269 "Source")

An `XChainOwnedClaimID` entry represents *one* cross-chain transfer of value and includes information of the account on the source chain that locks or burns the funds on the source chain.

The `XChainOwnedClaimID` entry must be acquired on the destination chain before submitting a `XChainCommit` on the source chain. Its purpose is to prevent transaction replay attacks. It is also used as a place to collect attestations from witness servers.

You can create a new `XChainOwnedClaimID` by sending an [XChainCreateClaimID transaction][]. An `XChainOwnedClaimID` is destroyed when the funds are successfully claimed on the destination chain.

{% amendment-disclaimer name="XChainBridge" /%}


## Example XChainOwnedClaimID JSON

```json
{
  "Account": "rBW1U7J9mEhEdk6dMHEFUjqQ7HW7WpaEMi",
  "Flags": 0,
  "OtherChainSource": "r9oXrvBX5aDoyMGkoYvzazxDhYoWFUjz8p",
  "OwnerNode": "0",
  "PreviousTxnID": "1CFD80E9CF232B8EED62A52857DE97438D12230C06496932A81DEFA6E66070A6",
  "PreviousTxnLgrSeq": 58673,
  "SignatureReward": "100",
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
  "XChainClaimAttestations": [
    {
      "XChainClaimProofSig": {
        "Amount": "1000000",
        "AttestationRewardAccount": "rfgjrgEJGDxfUY2U8VEDs7BnB1jiH3ofu6",
        "AttestationSignerAccount": "rfsxNxZ6xB1nTPhTMwQajNnkCxWG8B714n",
        "Destination": "rBW1U7J9mEhEdk6dMHEFUjqQ7HW7WpaEMi",
        "PublicKey": "025CA526EF20567A50FEC504589F949E0E3401C13EF76DD5FD1CC2850FA485BD7B",
        "WasLockingChainSend": 1
      }
    },
    {
      "XChainClaimProofSig": {
        "Amount": "1000000",
        "AttestationRewardAccount": "rUUL1tP523M8KimERqVS7sxb1tLLmpndyv",
        "AttestationSignerAccount": "rEg5sHxZVTNwRL3BAdMwJatkmWDzHMmzDF",
        "Destination": "rBW1U7J9mEhEdk6dMHEFUjqQ7HW7WpaEMi",
        "PublicKey": "03D40434A6843638681E2F215310EBC4131AFB12EA85985DA073183B732525F7C9",
        "WasLockingChainSend": 1
      },
    }
  ],
  "XChainClaimID": "b5",
  "LedgerEntryType": "XChainOwnedClaimID",
  "LedgerIndex": "20B136D7BF6D2E3D610E28E3E6BE09F5C8F4F0241BBF6E2D072AE1BACB1388F5"
}
```


## XChainOwnedClaimID Fields

| Field                     | JSON Type           | [Internal Type][] | Required? | Description     |
|:--------------------------|:--------------------|:------------------|:----------|:----------------|
| `Account`                 | String - [Address][]| AccountID         | Yes       | The account that owns this object. |
| `LedgerIndex`             | String              | UInt256           | Yes       | The ledger index is a hash of a unique prefix for `XChainOwnedClaimID`s, the actual `XChainClaimID` value, and the fields in `XChainBridge`. |
| `OtherChainSource`        | String              | AccountID         | Yes       | The account that must send the corresponding `XChainCommit` on the source chain. The destination may be specified in the `XChainCommit` transaction, which means that if the `OtherChainSource` isn't specified, another account can try to specify a different destination and steal the funds. This also allows tracking only a single set of signatures, since we know which account will send the `XChainCommit` transaction. |
| `SignatureReward`         | [Currency Amount][] | Amount            | Yes       | The total amount to pay the witness servers for their signatures. It must be at least the value of `SignatureReward` in the `Bridge` ledger object. |
| `XChainBridge`            | XChainBridge        | XChainBridge      | Yes       | The door accounts and assets of the bridge this object correlates to. |
| `XChainClaimAttestations` | Array               | Array             | Yes       | Attestations collected from the witness servers. This includes the parameters needed to recreate the message that was signed, including the amount, which chain (locking or issuing), optional destination, and reward account for that signature. |
| `XChainClaimID`           | String              | UInt64            | Yes       | The unique sequence number for a cross-chain transfer. |


### XChainClaimAttestations Fields

| Field                         | JSON Type           | [Internal Type][] | Required | Description |
|-------------------------------|---------------------|-------------------|----------|-------------|
| `XChainClaimProofSig`         | Array               | Object            | Yes      | An attestation from one witness server. |
| `Amount`                      | [Currency Amount][] | Amount            | Yes      | The amount to claim in the `XChainCommit` transaction on the destination chain. |
| `AttestationRewardAccount`    | String              | AccountID         | Yes      | The account that should receive this signer's share of the `SignatureReward`. |
| `AttestationSignerAccount`    | String              | AccountID         | Yes      | The account on the door account's signer list that is signing the transaction. |
| `Destination`                 | String              | AccountID         | No       | The destination account for the funds on the destination chain. |
| `PublicKey`                   | String              | Blob              | Yes      | The public key used to verify the signature. |
| `WasLockingChainSend`         | Number              | UInt8             | Yes      | A boolean representing the chain where the event occurred. |


### XChainBridge Fields

| Field               | JSON Type | [Internal Type][] | Required? | Description     |
|:--------------------|:----------|:------------------|:----------|:----------------|
| `IssuingChainDoor`  | String    | AccountID         | Yes       | The door account on the issuing chain. For an XRP-XRP bridge, this must be the genesis account (the account that is created when the network is first started, which contains all of the XRP). |
| `IssuingChainIssue` | Issue     | Issue             | Yes       | The asset that is minted and burned on the issuing chain. For an IOU-IOU bridge, the issuer of the asset must be the door account on the issuing chain, to avoid supply issues. |
| `LockingChainDoor`  | String    | AccountID         | Yes       | The door account on the locking chain. |
| `LockingChainIssue` | Issue     | Issue             | Yes       | The asset that is locked and unlocked on the locking chain. |

## See Also

- **Transactions:**
  - [XChainCreateClaimID transaction][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
