---
html: witness-server.html
parent: xrpl-servers.html
blurb: A witness server is a light-weight server that witnesses and signs transactions between the XRP Ledger and another chain. 
---
# Witness Server

The _witness server_ is a light-weight server that is aware the locking and issuing chains in a bridging solution between blockchains. The witness server witnesses and signs transactions between [a locking chain and an issuing chain](locking-and-issuing-chains.html) when assets are moved to designation addresses, thus enabling cross-chain transactions. 

The witness server is an independent server that has similar responsibilities as that of a validator server on the XRP Ledger's peer-to-peer network and helps avoid double-spend and collusion. 

The witness server serves as a neutral witness for transactions between a locking chain and an issuing chain. 

The bridge between the locking chain and the issuing chain includes the following information in its configuration: 

* Witness servers that monitor transactions on the bridge. You can choose one or more witness servers. 
* Fee for witness servers for their service.
 
Anyone can run a witness server. However, the burden is on the participants of the issuing chain to evaluate the reliability of witness servers. 

Note that an issuing chain may choose to configure a bridge with only one witness server initially and run the witness server itself. This strategy may be helpful in the initial period when the issuing chain is yet to establish itself in the marketplace.


## Witness Server Configuration

The witness server takes a JSON configuration file with the `--config` file.

```json
{
  "mainchain_endpoint": {
    "ip": "127.0.0.1",
    "port": 6005
  },
  "sidechain_endpoint": {
    "ip": "127.0.0.2",
    "port": 6007
  },
  "rpc_endpoint": {
    "ip": "127.0.0.3",
    "port": 6010
  },
  "db_dir": "/home/swd/data/witness/witness0/db",
  "signing_key_seed": "snwitEjg9Mr8n65cnqhATKcd1dQmv",
  "sidechain": {
    "src_chain_door": "rhWQzvdmhf5vFS35vtKUSUwNZHGT53qQsg",
    "src_chain_issue": {
        "currency": "USD",
        "issuer": "rhczJR49YsdxwtYTPvxeSc1Jjr7R748cHv"
      },
    "dst_chain_door": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
    "dst_chain_issue": "XRP"
  }
}
```