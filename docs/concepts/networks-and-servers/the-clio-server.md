---
html: the-clio-server.html
parent: networks-and-servers.html
seo:
    description: Clio is an XRP Ledger server optimized for API calls.
---
# The Clio Server

Clio is an XRP Ledger API server optimized for WebSocket or HTTP API calls for validated ledger data.

A Clio server does not connect to the peer-to-peer network. Instead, it extracts data from a specified `rippled` server which is connected to the P2P network. By handling API calls efficiently, Clio servers can help reduce the load on `rippled` servers running in P2P mode.

Clio stores validated historical ledger and transaction data in a space efficient format, using up to 4 times less space than `rippled`.  Clio uses Cassandra or ScyllaDB, allowing for scalable read throughput. Multiple Clio servers can share access to the same dataset, thereby enabling you to build a highly available cluster of Clio servers without the need for redundant data storage or computation.  

Clio requires access to a `rippled` server, which can run on the same machine as Clio or separately.

While Clio offers the complete [HTTP / WebSocket APIs](../../references/http-websocket-apis/index.md), by default, it only returns validated data. For any requests that require access to the P2P network, Clio automatically forwards the request to the `rippled` server on the P2P network and passes the response back.  

## Why Should I Run a Clio Server?

There are lots of reasons you might want to run your own Clio server, but most of them can be summarized as: reduced load on `rippled` server(s) connected to the P2P network, lower memory usage and storage overhead, easier horizontal scaling, and higher throughput for API requests.   

* Reduced load on `rippled` server(s) - A Clio server does not connect to the peer-to-peer network. It uses gRPC to get validated data from one or more trusted `rippled` servers that are connected to the P2P network. Thus, a Clio server handles requests more efficiently and reduces the load on `rippled` servers running in P2P mode.

* Lower memory usage and storage overhead - Clio uses Cassandra as a database and stores data in a space efficient format, using up to 4 times less space than `rippled`.

* Easier horizontal scaling - Multiple Clio servers can share access to the same dataset, thus enabling you to build a highly available cluster of Clio servers.

* Higher throughput for API requests - A Clio server extracts validated data from one or more trusted `rippled` servers and stores this data efficiently. Thus, handling API calls efficiently, resulting in a higher throughput and in some cases, lower latency as well.


## How does a Clio Server Work?

[{% inline-svg file="/docs/img/clio-basic-architecture.svg" /%}](/docs/img/clio-basic-architecture.svg "Figure 1: How does a Clio server work?")

A Clio server stores validated ledger data such as transaction metadata, account states, and ledger headers in a persistent datastore.

When a Clio server receives an API request, it looks up data from these data stores. For requests that require data from the P2P network, the Clio server forwards the request to a P2P server, and then passes the response back to the client.

Clio will **always** forward to `rippled` if any of the following is true:

- `ledger_index` is set to `current` or `closed`.
- `accounts`, `queue` or `full` are set to `true` for the `ledger` API.
- `queue` is set to `true` for the `account_info` API.
- Requested API method (`"command"`) is `submit`, `submit_multisigned`, `fee`, `ledger_closed`, `ledger_current`, `ripple_path_find`, `manifest`, `channel_authorize` or `channel_verify`.

## See Also

- [Clio source code](https://github.com/XRPLF/clio)
- **Tutorials:**
    - [Install Clio server on Ubuntu](../../infrastructure/installation/install-clio-on-ubuntu.md)
