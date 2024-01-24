---
html: witness-servers.html
parent: xrpl-sidechains.html
seo:
    description: A witness server is a light-weight server that witnesses and signs transactions between the XRP Ledger and another chain.
status: not_enabled
labels:
  - Blockchain
  - Interoperability
---
# Witness Servers
[[Source]](https://github.com/seelabs/xbridge_witness "Source")

_(Requires the [XChainBridge amendment][] {% not-enabled /%})_

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
| `Admin`          | Object         | No        | The `Username` and `Password` fields (as strings) for privileged requests to the witness server. **Note:** Both or none of the admin fields must be set. |
| [`IssuingChain`](#issuingchain-and-lockingchain-fields) | Object         | Yes       | The parameters for interacting with the issuing chain. |
| [`LockingChain`](#issuingchain-and-lockingchain-fields) | Object         | Yes       | The parameters for interacting with the locking chain. |
| `RPCEndpoint`    | Object         | Yes       | The endpoint for RPC requests to the witness server. |
| `LogFile`        | String         | Yes       | The location of the log file. | 
| `LogLevel`       | String         | Yes       | The level of logs to store in the log file. The options are `All`, `Trace`, `Debug`, `Info`, `Warning`, `Error`, `Fatal`, `Disabled`, and `None`. |
| `DBDir`          | String         | Yes       | The location of the directory where the databases are stored. |
| `SigningKeySeed` | String         | Yes       | The seed that the witness server should use to sign its attestations. |
| `SigningKeyType` | String         | Yes       | The algorithm used to encode the `SigningKeySeed`. The options are `secp256k1` and `ed25519`. |
| [`XChainBridge`](#xchainbridge-fields) | XChainBridge   | Yes       | The bridge that the witness server is monitoring. |


#### IssuingChain and LockingChain Fields

| Field Name      | JSON Type | Required? | Description |
|-----------------|-----------|-----------|-------------|
| `Endpoint`      | Object    | Yes       | The websocket endpoint of a `rippled` node synced with the chain. **Note:** The same person needs to control the `rippled` node and witness server. |
| `TxnSubmit`     | Object    | Yes       | The parameters for transaction submission on the chain. |
| `RewardAccount` | String    | Yes       | The account that should receive the witness's share of the `SignatureReward` on the chain. |


#### Endpoint Fields

| Field Name | JSON Type | Required? | Description |
|------------|-----------|-----------|-------------|
| `Host`     | String    | Yes       | The IP address of the `rippled` node. **Note:** This accepts an IPv4 address or URL. |
| `Port`     | String    | Yes       | The port used for the websocket endpoint. |


#### RPCEndpoint Fields

| Field Name | JSON Type | Required? | Description |
|------------|-----------|-----------|-------------|
| `Host`     | String    | Yes       | The IP address of the witness server for RPC requests. **Note:** This accepts an IPv4 address or URL. |
| `Port`     | String    | Yes       | The port used for the websocket endpoint. |


#### TxnSubmit Fields

| Field Name          | JSON Type | Required? | Description |
|---------------------|-----------|-----------|-------------|
| `ShouldSubmit`      | Boolean   | Yes       | A boolean indicating whether or not the witness server should submit transactions on the locking chain. |
| `SigningKeySeed`    | String    | No        | The seed that the witness server should use to sign its transactions on the locking chain. This is required if `ShouldSubmit` is `true`. |
| `SigningKeyType`    | String    | No        | The algorithm used to encode the `SigningKeySeed`. The options are `secp256k1` and `ed25519`. This is required if `ShouldSubmit` is `true`. |
| `SubmittingAccount` | String    | No        | The account from which the `XChainAddClaimAttestation` and `XChainAddAccountCreateAttestation` transactions should be sent. This is required if `ShouldSubmit` is `true`. |


#### XChainBridge Fields

| Field               | JSON Type | [Internal Type][] | Required? | Description     |
|:--------------------|:----------|:------------------|:----------|:----------------|
| `IssuingChainDoor`  | String    | Account           | Yes       | The door account on the issuing chain. For an XRP-XRP bridge, this must be the genesis account (the account that is created when the network is first started, which contains all of the XRP). |
| `IssuingChainIssue` | Issue     | Issue             | Yes       | The asset that is minted and burned on the issuing chain. For an IOU-IOU bridge, the issuer of the asset must be the door account on the issuing chain, to avoid supply issues. |
| `LockingChainDoor`  | String    | Account           | Yes       | The door account on the locking chain. |
| `LockingChainIssue` | Issue     | Issue             | Yes       | The asset that is locked and unlocked on the locking chain. |

{% raw-partial file="/_snippets/common-links.md" /%}
