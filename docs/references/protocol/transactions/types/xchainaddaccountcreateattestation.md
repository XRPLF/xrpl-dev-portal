---
html: xchainaddaccountcreateattestation.html
parent: transaction-types.html
seo:
    description: The `XChainAddAccountCreateAttestation` transaction provides an attestation from a witness server that a `XChainAccountCreateCommit` transaction occurred on the other chain.
labels:
  - Interoperability
status: not_enabled
---
# XChainAddAccountCreateAttestation
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/protocol/impl/TxFormats.cpp#L447-L464 "Source")

_(Requires the [XChainBridge amendment][] {% not-enabled /%})_

The `XChainAddAccountCreateAttestation` transaction provides an attestation from a witness server that an `XChainAccountCreateCommit` transaction occurred on the other chain.

The signature must be from one of the keys on the door's signer list at the time the signature was provided. If the signature list changes between the time the signature was submitted and the quorum is reached, the new signature set is used and some of the currently collected signatures may be removed.

Any account can submit signatures.

**Note:** The reward is only sent to accounts that have keys on the current list. A quorum of signers need to agree on the `SignatureReward`, the same way they need to agree on the other data. A single witness server can't provide an incorrect value for this in an attempt to collect a larger reward.


## Example XChainAddAccountCreateAttestation JSON

```json
{
  "Account": "rDr5okqGKmMpn44Bbhe5WAfDQx8e9XquEv",
  "TransactionType": "XChainAddAccountCreateAttestation",
  "OtherChainSource": "rUzB7yg1LcFa7m3q1hfrjr5w53vcWzNh3U",
  "Destination": "rJMfWNVbyjcCtds8kpoEjEbYQ41J5B6MUd",
  "Amount": "2000000000",
  "PublicKey": "EDF7C3F9C80C102AF6D241752B37356E91ED454F26A35C567CF6F8477960F66614",
  "Signature": "F95675BA8FDA21030DE1B687937A79E8491CE51832D6BEEBC071484FA5AF5B8A0E9AFF11A4AA46F09ECFFB04C6A8DAE8284AF3ED8128C7D0046D842448478500",
  "WasLockingChainSend": 1,
  "AttestationRewardAccount": "rpFp36UHW6FpEcZjZqq5jSJWY6UCj3k4Es",
  "AttestationSignerAccount": "rpWLegmW9WrFBzHUj7brhQNZzrxgLj9oxw",
  "XChainAccountCreateCount": "2",
  "SignatureReward": "204",
  "XChainBridge": {
    "LockingChainDoor": "r3nCVTbZGGYoWvZ58BcxDmiMUU7ChMa1eC",
    "LockingChainIssue": {
      "currency": "XRP"
    },
    "IssuingChainDoor": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
    "IssuingChainIssue": {
      "currency": "XRP"
    }
  },
  "Fee": "20"
}
```


## XChainAddAccountCreateAttestation Fields

| Field                      | JSON Type           | [Internal Type][] | Required? | Description |
|:---------------------------|:--------------------|:------------------|:----------|:------------|
| `Amount`                   | [Currency Amount][] | Amount            | Yes       | The amount committed by the `XChainAccountCreateCommit` transaction on the source chain. |
| `AttestationRewardAccount` | String              | Account           | Yes       | The account that should receive this signer's share of the `SignatureReward`. |
| `AttestationSignerAccount` | String              | Account           | Yes       | The account on the door account's signer list that is signing the transaction. |
| `Destination`              | String              | Account           | Yes       | The destination account for the funds on the destination chain. |
| `OtherChainSource`         | String              | Account           | Yes       | The account on the source chain that submitted the `XChainAccountCreateCommit` transaction that triggered the event associated with the attestation. |
| `PublicKey`                | String              | Blob              | Yes       | The public key used to verify the signature. |
| `Signature`                | String              | Blob              | Yes       | The signature attesting to the event on the other chain. |
| `SignatureReward`          | [Currency Amount][] | Amount            | Yes       | The signature reward paid in the `XChainAccountCreateCommit` transaction. |
| `WasLockingChainSend`      | Number              | UInt8             | Yes       | A boolean representing the chain where the event occurred. |
| `XChainAccountCreateCount` | String              | UInt64            | Yes       | The counter that represents the order that the claims must be processed in. |
| `XChainBridge`             | XChainBridge        | XChain_Bridge     | Yes       | The bridge associated with the attestation. |


### XChainBridge Fields

| Field               | JSON Type | [Internal Type][] | Required? | Description     |
|:--------------------|:----------|:------------------|:----------|:----------------|
| `IssuingChainDoor`  | String    | Account           | Yes       | The door account on the issuing chain. For an XRP-XRP bridge, this must be the genesis account (the account that is created when the network is first started, which contains all of the XRP). |
| `IssuingChainIssue` | Issue     | Issue             | Yes       | The asset that is minted and burned on the issuing chain. For an IOU-IOU bridge, the issuer of the asset must be the door account on the issuing chain, to avoid supply issues. |
| `LockingChainDoor`  | String    | Account           | Yes       | The door account on the locking chain. |
| `LockingChainIssue` | Issue     | Issue             | Yes       | The asset that is locked and unlocked on the locking chain. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
