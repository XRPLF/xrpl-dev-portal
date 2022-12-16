---
html: witness-server.html
parent: xrpl-interoperability.html
blurb: A witness server is a light-weight server that witnesses and signs transactions between the XRP Ledger and another chain. 
---
# Witness Server

The _witness server_ is a light-weight server that is aware of the locking and issuing chains in a bridging solution between blockchains. The witness server witnesses and signs transactions between [a locking chain and an issuing chain](cross-chain-bridges.html) when assets are moved to designated addresses, thus enabling cross-chain transactions. 

The witness server is an independent server that has similar responsibilities as that of a validator server on the XRP Ledger's peer-to-peer network and helps avoid double-spend and collusion. 

The witness server serves as a neutral witness for transactions between a locking chain and an issuing chain. 
It listens to the door accounts on both sides of the bridge and signs attestations for cross-chain transfer transactions, essentially affirming that a transaction on the source account happened, so the value can be claimed on the destination account. They are essentially acting as an oracle, to “prove” that the value was locked/burned on the source account, which allows the recipient to then claim (via minting/ unlocking) the equivalent funds on the destination account.

The bridge between the locking chain and the issuing chain includes the following information in its configuration: 

* Witness servers that monitor transactions on the bridge. You can choose one or more witness servers. 
* Fee for witness servers for their service.
 
Anyone can run a witness server. However, the burden is on the participants of the issuing chain to evaluate the reliability of witness servers. 

Note that an issuing chain may choose to configure a bridge with only one witness server initially and run the witness server itself. This strategy may be helpful in the initial period when the issuing chain is yet to establish itself in the marketplace.


## Witness Server Configuration

The witness server takes a JSON configuration file, specified using the `--conf` command-line argument.

The configuration file contains the following information:

* For both locking and issuing chains (`LockingChain` and `IssuingChain`):
    * Websocket endpoints (`Endpoint`)
    * Information on how witness servers can submit `XChainAddAttestation` transactions to the relevant chain (`TxnSubmit`).
        * `ShouldSubmit` defines whether the attestations should be submitted at all. The server operator can instead submit them by hand, or via other means.
        * The seed that the witness server uses to derive keys to sign its attestations (`SigningKeySeed`), and the key type used to interpret it (`SigningKeyKeyType`).
        * Account that the witness server uses to submit its transactions (`SubmittingAccount`).
        * Account that receives the signature rewards for this witness’s attestations (`RewardAccount`).
* IP and port number that clients can use to connect to this witness server (`RPCEndpoint`).
* Directory to store the witness server's SQL database (`DBDir`).
* The seed that the witness server uses to derive keys to sign its attestations (`SigningKeySeed`), and the key type used to interpret it (`SigningKeyKeyType`).
* Log file for the witness server (`LogFile`)
* Reward accounts on both chains (`LockingChainRewardAccount` and `IssuingChainRewardAccount`).
* Information about the cross-chain bridge (`XChainBridge`) for which the witness server is attesting transactions, including door accounts and assets on both chains.

Here is an example configuration file for a witness server:

```json
{
  "LockingChain": {
    "Endpoint": {
      "IP": "127.0.0.1",
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
      "IP": "127.0.0.1",
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
    "IP": "127.0.0.1",
    "Port": 6010
  },
  "DBDir": "/var/lib/witness0/db",
  "LogFile": "/var/log/witness/witness0.log",
  "SigningKeySeed": "spkHEwDKeChm8PAFApLkF1E2sDs6t",
  "SigningKeyType": "ed25519",
  "XChainBridge": {
    "LockingChainDoor": "r3nCVTbZGGYoWvZ58BcxDmiMUU7ChMa1eC",
    "LockingChainIssue": {"currency": "XRP"},
    "IssuingChainDoor": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
    "IssuingChainIssue": {"currency": "XRP"}
  }
}
```

