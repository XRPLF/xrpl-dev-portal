---
html: data-api.html
parent: references.html
blurb: (DEPRECATED) RESTful interface to XRP Ledger analytics and historical data.
status: removed
nav_omit: true
---
# Ripple Data API v2

**Warning:** The Ripple Data API v2 is deprecated with no ongoing support. Please use the native [XRP Ledger HTTP APIs](rippled-api.html) instead.

For information on the old Data API, see the [rippled-historical-database repository](https://github.com/ripple/rippled-historical-database).

## Alternatives

For most common operations, like requesting account balances or transaction history, you can query a self-hosted or [public XRP Ledger server](public-servers.html) using a [WebSocket connection](get-started-using-http-websocket-apis.html#websocket-api) or [JSON-RPC (HTTP POST)](get-started-using-http-websocket-apis.html#json-rpc).

See the [Get Started Using HTTP / WebSocket APIs](get-started-using-http-websocket-apis.html) page for more information.

[The XRP Intel API](https://xrpintel.com/api) run by Dev Null Productions provides many of the same data which the Ripple Data API v2 used to, including account, gateways, and more; derived directly from the XRP Ledger.
