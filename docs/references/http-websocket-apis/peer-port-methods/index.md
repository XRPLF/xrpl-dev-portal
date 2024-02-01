---
html: peer-port-methods.html
parent: http-websocket-apis.html
metadata:
  indexPage: true
seo:
    description: Special API methods for sharing network topology and status metrics, served on the XRPL Peer Protocol port.
---
# Peer Port Methods

Separate from the [WebSocket / HTTP APIs](../index.md), `rippled` servers provide a few special API methods from the same port they use for XRP Ledger [peer protocol](../../../concepts/networks-and-servers/peer-protocol.md) communications. These methods provide status information about the server itself and its connectivity to the peer-to-peer network, and are intended mainly for monitoring and administration.

**Security:** Most `rippled` servers use a self-signed TLS certificate to respond to peer port requests. By default, most tools (including web browsers) flag or block such responses for being untrusted. You must ignore the certificate checking (for example, if using cURL, add the `--insecure` flag) to display a response from those servers, or configure the server with a TLS certificate signed by a known Certificate Authority.


{% child-pages /%}
