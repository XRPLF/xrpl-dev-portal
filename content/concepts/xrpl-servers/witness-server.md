---
html: witness-server.html
parent: xrpl-servers.html
blurb: A witness server is a light-weight server that witnesses and signs transactions between the XRP Ledger and another chain. 
---
# Witness Server

The _witness server_ is a light-weight server that witnesses and signs transactions between [a locking chain and an issuing chain](locking-and-issuing-chains.html), thus enabling cross-chain transactions between the XRP Ledger and another chain. 

The witness server is an independent server that has similar responsibilities as that of a validator server on the peer-to-peer network and helps avoid double-spend and collusion. 

The witness server serves as a neutral witness for transactions between a locking chain and an issuing chain. 

The bridge between the locking chain and the issuing chain includes the following information in its configuration: 

* Witness servers that monitor transactions on the bridge. You can choose one or more witness servers. 
* Fee for witness servers for their service.
 
Anyone can run a witness server. However, the burden is on the participants of the locking chain to evaluate the reliability of witness servers. 

Note that a locking chain may choose to configure a bridge with only one witness server initially and run the witness server itself. This strategy may be helpful in the initial period when the locking chain is yet to establish itself in the marketplace.


