---
html: xchainaddclaimattestation.html 
parent: transaction-types.html
seo:
    description: Submit proof (attestation) to the destination chain that an event that happened on the source chain.
labels:
  - Interoperability
status: not_enabled
---
# XChainAddClaimAttestation
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/protocol/impl/TxFormats.cpp#L429-L445 "Source")

_(Requires the [XChainBridge amendment][] {% not-enabled /%})_

The `XChainAddClaimAttestation` transaction provides proof from a witness server, attesting to an `XChainCommit` transaction.

The signature must be from one of the keys on the door's signer list at the time the signature was provided. However, if the signature list changes between the time the signature was submitted and the quorum is reached, the new signature set is used and some of the currently collected signatures may be removed.

Any account can submit signatures.

**Note:** The reward is only sent to accounts that have keys on the current list. A quorum of signers need to agree on the `SignatureReward`, the same way they need to agree on the other data. A single witness server can't provide an incorrect value for this in an attempt to collect a larger reward.


## Example XChainAddClaimAttestation JSON

```json
{
  "TransactionType": "XChainAddClaimAttestation",
  "Account": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
  "XChainAttestationBatch": {
    "XChainBridge": {
      "IssuingChainDoor": "rKeSSvHvaMZJp9ykaxutVwkhZgWuWMLnQt",
      "IssuingChainIssue": {
        "currency": "XRP"
      },
      "LockingChainDoor": "rJvExveLEL4jNDEeLKCVdxaSCN9cEBnEQC",
      "LockingChainIssue": {
        "currency": "XRP"
      }
    },
    "XChainClaimAttestationBatch" : [
      {
        "XChainClaimAttestationBatchElement" : {
          "Account" : "rnJmYAiqEVngtnb5ckRroXLtCbWC7CRUBx",
          "Amount" : "100000000",
          "AttestationSignerAccount" : "rnJmYAiqEVngtnb5ckRroXLtCbWC7CRUBx",
          "Destination" : "r9A8UyNpW3X46FUc6P7JZqgn6WgAPjBwPg",
          "PublicKey" : "03DAB289CA36FF377F3F4304C7A7203FDE5EDCBFC209F430F6A4355361425526D0",
          "Signature" : "616263",
          "WasLockingChainSend" : 1,
          "XChainClaimID" : "0000000000000000"
        }
      }
    ],
    "XChainCreateAccountAttestationBatch": [
      {
        "XChainCreateAccountAttestationBatchElement": {
          "Account": "rnJmYAiqEVngtnb5ckRroXLtCbWC7CRUBx",
          "Amount": "1000000000",
          "AttestationSignerAccount": "rEziJZmeZzsJvGVUmpUTey7qxQLKYxaK9f",
          "Destination": "rKT9gDkaedAosiHyHZTjyZs2HvXpzuiGmC",
          "PublicKey": "03ADB44CA8E56F78A0096825E5667C450ABD5C24C34E027BC1AAF7E5BD114CB5B5",
          "Signature": "3044022036C8B90F85E8073C465F00625248A72D4714600F98EBBADBAD3B7ED226109A3A02204C5A0AE12D169CF790F66541F3DB59C289E0D9CA7511FDFE352BB601F667A26",
          "SignatureReward": "1000000",
          "WasLockingChainSend": 1,
          "XChainAccountCreateCount": "0000000000000001"
        }
      }
    ]
  }
}
```


## XChainAddClaimAttestation Fields

| Field                      | JSON Type           | [Internal Type][] | Required? | Description |
|:---------------------------|:--------------------|:------------------|:----------|-------------|
| `Amount`                   | [Currency Amount][] | Amount            | Yes       | The amount committed by the `XChainCommit` transaction on the source chain. |
| `AttestationRewardAccount` | String              | Account           | Yes       | The account that should receive this signer's share of the `SignatureReward`. |
| `AttestationSignerAccount` | String              | Account           | Yes       | The account on the door account's signer list that is signing the transaction. |
| `Destination`              | String              | Account           | No        | The destination account for the funds on the destination chain (taken from the `XChainCommit` transaction). |
| `OtherChainSource`         | String              | Account           | Yes       | The account on the source chain that submitted the `XChainCommit` transaction that triggered the event associated with the attestation. |
| `PublicKey`                | String              | Blob              | Yes       | The public key used to verify the attestation signature. |
| `Signature`                | String              | Blob              | Yes       | The signature attesting to the event on the other chain. |
| `WasLockingChainSend`      | Number              | UInt8             | Yes       | A boolean representing the chain where the event occurred. |
| `XChainBridge`             | XChainBridge        | XChain_Bridge     | Yes       | The bridge to use to transfer funds. |
| `XChainClaimID`            | String              | UInt64            | Yes       | The `XChainClaimID` associated with the transfer, which was included in the `XChainCommit` transaction. |


### XChainBridge Fields

| Field               | JSON Type | [Internal Type][] | Required? | Description     |
|:--------------------|:----------|:------------------|:----------|:----------------|
| `IssuingChainDoor`  | String    | Account           | Yes       | The door account on the issuing chain. For an XRP-XRP bridge, this must be the genesis account (the account that is created when the network is first started, which contains all of the XRP). |
| `IssuingChainIssue` | Issue     | Issue             | Yes       | The asset that is minted and burned on the issuing chain. For an IOU-IOU bridge, the issuer of the asset must be the door account on the issuing chain, to avoid supply issues. |
| `LockingChainDoor`  | String    | Account           | Yes       | The door account on the locking chain. |
| `LockingChainIssue` | Issue     | Issue             | Yes       | The asset that is locked and unlocked on the locking chain. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
