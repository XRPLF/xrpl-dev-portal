---
html: witness-server.html
parent: xrpl-interoperability.html
blurb: A witness server is a light-weight server that witnesses and signs transactions between the XRP Ledger and another chain. 
---
# Witness Server

The _witness server_ is a light-weight server that is aware the locking and issuing chains in a bridging solution between blockchains. The witness server witnesses and signs transactions between [a locking chain and an issuing chain](cross-chain-bridges.md) when assets are moved to designation addresses, thus enabling cross-chain transactions. 

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
* Websocket endpoints for the locking chain and the issuing chain.
* Port that clients can use to connect to this server ("RPCENdpoint").
* Directory to store the SQL database
* Secret key used to sign attestations
* Information about door accounts on the locking and issuing chains.

Here is an example configuration file for a witness server:

```json
{
  "LockingChainEndpoint": {
    "IP": "127.0.0.1",
    "Port": 6005
  },
  "IssuingChainEndpoint": {
    "IP": "127.0.0.2",
    "Port": 6007
  },
  "RPCEndpoint": {
    "IP": "127.0.0.3",
    "Port": 6010
  },
  "DBDir": "/home/swd/data/witness/witness0/db",
  "SigningKeySeed": "snwitEjg9Mr8n65cnqhATKcd1dQmv",
  "SigningKeyType": "ed25519",
  "LockingChainRewardAccount": "rhWQzvdmhf5vFS35vtKUSUwNZHGT53qQsg",
  "IssuingChainRewardAccount": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
  "XChainBridge": {
    "LockingChainDoor": "rhWQzvdmhf5vFS35vtKUSUwNZHGT53qQsg",
    "LockingChainIssue": "XRP",
    "IssuingChainDoor": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
    "IssuingChainIssue": "XRP"
  }
}
```

