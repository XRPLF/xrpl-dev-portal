---
category: 2023
date: 2023-10-05
labels:
    - Advisories
    - Data API
theme:
    markdown:
        editPage:
            hide: true
---
# Data API v2 Shutdown

The Ripple Data API v2 was deprecated in 2021 with no additional support; it will be shut down on October 15, 2023.

**Note:** The [XRP Distribution endpoint](https://data.ripple.com/v2/network/xrp_distribution) will remain.

If you need information on the old Data API, see the [rippled-historical-database repository](https://github.com/ripple/rippled-historical-database).


## Alternatives

For most common operations, like requesting account balances or transaction history, you can query a self-hosted or [public XRP Ledger server](https://xrpl.org/public-servers.html) using a [WebSocket connection](https://xrpl.org/get-started-using-http-websocket-apis.html#websocket-api) or [JSON-RPC (HTTP POST)](https://xrpl.org/get-started-using-http-websocket-apis.html#json-rpc).

For a full list of available API methods, see the [Get Started Using HTTP / WebSocket APIs](https://xrpl.org/http-websocket-apis.html) page.


Additionally, you can use these alternatives:

- [XRP Ledger Foundation Data API](https://data.xrplf.org/docs/static/index.html)
- [XRPL Meta](https://xrplmeta.org/docs)
