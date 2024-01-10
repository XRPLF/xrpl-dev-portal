---
html: xchainaccountcreatecommit.html 
parent: transaction-types.html
blurb: Create an account on one of the chains that the bridge connects. This account serves as the bridge entrance for that chain.
labels:
  - Interoperability
status: not_enabled
---
# XChainAccountCreateCommit
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/protocol/impl/TxFormats.cpp#L466-L474 "Source")

_(Requires the [XChainBridge amendment][] :not_enabled:)_

This transaction can only be used for XRP-XRP bridges.

The `XChainAccountCreateCommit` transaction creates a new account for a witness server to submit transactions on an issuing chain.

**Warning:** This transaction should only be executed if the witness attestations will be reliably delivered to the destination chain. If the signatures aren't delivered, then account creation will be blocked until attestations are received. This can be used maliciously; to disable this transaction on XRP-XRP bridges, omit the bridge's `MinAccountCreateAmount` field.


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


## XChainAccountCreateCommit Fields

| Field             | JSON Type         | Internal Type | Required? | Description |
|:------------------|:------------------|:------------------|:----------| :-----------|
| `Amount`          | `Currency Amount` | `AMOUNT`          | Yes       | The amount, in XRP, to use for account creation. This must be greater than or equal to the `MinAccountCreateAmount` specified in the `Bridge` ledger object. |
| `Destination`     | `string`          | `ACCOUNT`         | Yes       | The destination account on the destination chain. |
| `SignatureReward` | `Currency Amount` | `AMOUNT`          | No        | The amount, in XRP, to be used to reward the witness servers for providing signatures. This must match the amount on the `Bridge` ledger object. |
| `XChainBridge`    | `XChainBridge`    | `XCHAIN_BRIDGE`   | Yes       | The bridge to create accounts for. |


### XChainBridge Fields

| Field               | JSON Type | Internal Type     | Required? | Description     |
|:--------------------|:----------|:------------------|:----------|:----------------|
| `IssuingChainDoor`  | `string`  | `ACCOUNT`         | Yes       | The door account on the issuing chain. For an XRP-XRP bridge, this must be the genesis account (the account that is created when the network is first started, which contains all of the XRP). |
| `IssuingChainIssue` | `Issue`   | `ISSUE`           | Yes       | The asset that is minted and burned on the issuing chain. For an IOU-IOU bridge, the issuer of the asset must be the door account on the issuing chain, to avoid supply issues. |
| `LockingChainDoor`  | `string`  | `ACCOUNT`         | Yes       | The door account on the locking chain. |
| `LockingChainIssue` | `Issue`   | `ISSUE`           | Yes       | The asset that is locked and unlocked on the locking chain. |

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}