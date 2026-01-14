---
seo:
    description: Create an account on another chain to serve as a door account for a cross-chain bridge.
labels:
    - Interoperability
status: not_enabled
---
# XChainAccountCreateCommit
[[Source]](https://github.com/XRPLF/rippled/blob/70d5c624e8cf732a362335642b2f5125ce4b43c1/src/xrpld/app/tx/detail/XChainBridge.h#L235 "Source")

Create a new account for a [witness server](../../../../concepts/xrpl-sidechains/witness-servers.md) to submit transactions on an issuing chain. This transaction can only be used for XRP-XRP bridges.

{% admonition type="danger" name="Warning" %}This transaction should only be executed if the witness attestations will be reliably delivered to the destination chain. If the signatures aren't delivered, then account creation will be blocked until attestations are received. This can be used maliciously; to disable this transaction on XRP-XRP bridges, omit the bridge's `MinAccountCreateAmount` field.{% /admonition %}


{% amendment-disclaimer name="XChainBridge" /%}

## Example XChainAccountCreateCommit JSON

```json
{
  "Account": "rwEqJ2UaQHe7jihxGqmx6J4xdbGiiyMaGa",
  "Destination": "rD323VyRjgzzhY4bFpo44rmyh2neB5d8Mo",
  "TransactionType": "XChainAccountCreateCommit",
  "Amount": "20000000",
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


{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}

| Field             | JSON Type           | [Internal Type][] | Required? | Description |
|:------------------|:--------------------|:------------------|:----------| :-----------|
| `Amount`          | [Currency Amount][] | Amount            | Yes       | The amount, in XRP, to use for account creation. This must be greater than or equal to the `MinAccountCreateAmount` specified in the `Bridge` ledger object. |
| `Destination`     | String              | AccountID         | Yes       | The destination account on the destination chain. |
| `SignatureReward` | [Currency Amount][] | Amount            | No        | The amount, in XRP, to be used to reward the witness servers for providing signatures. This must match the amount on the `Bridge` ledger object. |
| `XChainBridge`    | XChainBridge        | XChain_Bridge     | Yes       | The bridge to create accounts for. |


### XChainBridge Fields

| Field               | JSON Type | [Internal Type][] | Required? | Description     |
|:--------------------|:----------|:------------------|:----------|:----------------|
| `IssuingChainDoor`  | String    | AccountID         | Yes       | The door account on the issuing chain. For an XRP-XRP bridge, this must be the genesis account (the account that is created when the network is first started, which contains all of the XRP). |
| `IssuingChainIssue` | Issue     | Issue             | Yes       | The asset that is minted and burned on the issuing chain. For an IOU-IOU bridge, the issuer of the asset must be the door account on the issuing chain, to avoid supply issues. |
| `LockingChainDoor`  | String    | AccountID         | Yes       | The door account on the locking chain. |
| `LockingChainIssue` | Issue     | Issue             | Yes       | The asset that is locked and unlocked on the locking chain. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
