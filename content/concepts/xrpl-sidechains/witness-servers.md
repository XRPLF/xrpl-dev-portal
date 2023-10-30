---
html: witness-servers.html
parent: xrpl-sidechains.html
blurb: A witness server is a light-weight server that witnesses and signs transactions between the XRP Ledger and another chain.
status: not_enabled
labels:
  - Blockchain
  - Interoperability
---
# Witness Servers

_(Requires the [XChainBridge amendment][] :not_enabled:)_

A _witness server_ acts as a neutral witness for transactions between a locking chain and an issuing chain. It listens to the door accounts on both sides of a bridge and signs attestations that confirm a transaction occurred. They are essentially acting as an oracle to “prove” that value was locked or burned on a source account, which allows the recipient to then claim (via minting or unlocking) the equivalent funds on the destination account.

The bridge between the locking chain and the issuing chain includes the following information in its configuration: 

* Witness servers that monitor transactions on the bridge. You can choose one or more witness servers. 
* Fee for witness servers for their service.
 
Anyone can run a witness server. However, the burden is on the participants of the issuing chain to evaluate the reliability of witness servers. If you run a witness server, you must also run a `rippled` node and sync it to the chain the witness server needs access to.

**Note:** Issuing chains may choose to configure a bridge with only one witness server initially and run the witness server itself. This strategy is helpful in the initial period, when the issuing chain hasn't established itself yet in the marketplace.


## Witness Server Configuration

The witness server takes a JSON configuration file, specified using the `--conf` command-line argument.


### Example Configuration JSON

```json
{
  "LockingChain": {
    "Endpoint": {
      "Host": "127.0.0.1",
      "Port": 6005
    },
    "TxnSubmit": {
      "ShouldSubmit": true,
      "SigningKeySeed": "shUe3eSgGK4e6xMFuCakZnxsMN1uk",
      "SigningKeyType": "ed25519",
      "SubmittingAccount": "rpFp36UHW6FpEcZjZqq5jSJWY6UCj3k4Es"
    },
    "RewardAccount": "rpFp36UHW6FpEcZjZqq5jSJWY6UCj3k4Es"
  },
  "IssuingChain": {
    "Endpoint": {
      "Host": "127.0.0.1",
      "Port": 6007
    },
    "TxnSubmit": {
      "ShouldSubmit": true,
      "SigningKeySeed": "shUe3eSgGK4e6xMFuCakZnxsMN1uk",
      "SigningKeyType": "ed25519",
      "SubmittingAccount": "rpFp36UHW6FpEcZjZqq5jSJWY6UCj3k4Es"
    },
    "RewardAccount": "rpFp36UHW6FpEcZjZqq5jSJWY6UCj3k4Es"
  },
  "RPCEndpoint": {
    "Host": "127.0.0.1",
    "Port": 6010
  },
  "DBDir": "/var/lib/witness/witness01/db",
  "LogFile": "/var/log/witness/witness01.log",
  "SigningKeySeed": "spkHEwDKeChm8PAFApLkF1E2sDs6t",
  "SigningKeyType": "ed25519",
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
  "Admin": {
    "Username": "username01",
    "Password": "password01"
  }
}
```


### Configuration Fields

| Field Name       | JSON Type      | Required? | Description |
|------------------|----------------|-----------|-------------|
| `Admin`          | `object`       | No        | The `Username` and `Password` fields (as strings) for privileged requests to the witness server. **Note:** Both or none of the admin fields must be set. |
| `IssuingChain`   | `object`       | Yes       | The parameters for interacting with the issuing chain. |
| `LockingChain`   | `object`       | Yes       | The parameters for interacting with the locking chain. |
| `RPCEndpoint`    | `object`       | Yes       | The endpoint for RPC requests to the witness server. |
| `LogFile`        | `string`       | Yes       | The location of the log file. | 
| `LogLevel`       | `string`       | Yes       | The level of logs to store in the log file. The options are ["All", "Trace", "Debug", "Info", "Warning", "Error", "Fatal", "Disabled","None"]. |
| `DBDir`          | `string`       | Yes       | The location of the directory where the databases are stored. |
| `SigningKeySeed` | `string`       | Yes       | The seed that the witness server should use to sign its attestations. |
| `SigningKeyType` | `string`       | Yes       | The algorithm used to encode the `SigningKeySeed`. The options are `secp256k1` and `ed25519`. |
| `XChainBridge`   | `XChainBridge` | Yes       | The bridge that the witness server is monitoring. |


#### IssuingChain and LockingChain Fields

| Field Name      | JSON Type | Required? | Description |
|-----------------|-----------|-----------|-------------|
| `Endpoint`      | `object`  | Yes       | The websocket endpoint of a `rippled` node synced with the chain. **Note:** This must be a node you run. |
| `TxnSubmit`     | `object`  | Yes       | The parameters for transaction submission on the chain. |
| `RewardAccount` | `string`  | Yes       | The account that should receive the witness's share of the `SignatureReward` on the chain. |


#### Endpoint Fields

| Field Name | JSON Type | Required? | Description |
|------------|-----------|-----------|-------------|
| `Host`     | `string`  | Yes       | The IP address of the `rippled` node. **Note:** This doesn't accept URLs |
| `Port`     | `string`  | Yes       | The port used for the websocket endpoint. |


#### RPCEndpoint Fields

| Field Name | JSON Type | Required? | Description |
|------------|-----------|-----------|-------------|
| `Host`     | `string`  | Yes       | The IP address of the witness server for RPC requests. **Note:** This doesn't accept URLs |
| `Port`     | `string`  | Yes       | The port used for the websocket endpoint. |


#### TxnSubmit Fields

| Field Name          | JSON Type | Required? | Description |
|---------------------|-----------|-----------|-------------|
| `ShouldSubmit`      | `boolean` | Yes       | A boolean indicating whether or not the witness server should submit transactions on the locking chain. |
| `SigningKeySeed`    | `string`  | No        | The seed that the witness server should use to sign its transactions on the locking chain. This is required if `ShouldSubmit` is `true`. |
| `SigningKeyType`    | `string`  | No        | The algorithm used to encode the `SigningKeySeed`. The options are `secp256k1` and `ed25519`. This is required if `ShouldSubmit` is `true`. |
| `SubmittingAccount` | `string`  | No        | The account from which the `XChainAddClaimAttestation` and `XChainAddAccountCreateAttestation` transactions should be sent. This is required if `ShouldSubmit` is `true`. |


#### XChainBridge Fields

| Field               | JSON Type | [Internal Type][] | Required? | Description     |
|:--------------------|:----------|:------------------|:----------|:----------------|
| `IssuingChainDoor`  | `string`  | `ACCOUNT`         | Yes       | The door account on the issuing chain. For an XRP-XRP bridge, this must be the genesis account (the account that is created when the network is first started, which contains all of the XRP). |
| `IssuingChainIssue` | `Issue`   | `ISSUE`           | Yes       | The asset that is minted and burned on the issuing chain. For an IOU-IOU bridge, the issuer of the asset must be the door account on the issuing chain, to avoid supply issues. |
| `LockingChainDoor`  | `string`  | `ACCOUNT`         | Yes       | The door account on the locking chain. |
| `LockingChainIssue` | `Issue`   | `ISSUE`           | Yes       | The asset that is locked and unlocked on the locking chain. |

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}