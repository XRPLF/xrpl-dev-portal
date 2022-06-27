---
html: the-clio-server.html
parent: concepts.html
template: pagetype-category.html.jinja
blurb: Clio is an XRP Ledger API server optimized for WebSocket or HTTP API calls.
---
# Clio - the XRP Ledger API Server

Clio is an XRP Ledger API server optimized for WebSocket or HTTP API calls for validated ledger data. 

A Clio server does not connect to the peer-to-peer network. Instead, it extracts data from a specified `rippled` server which is connected to the P2P network. By handling API calls efficiently, Clio servers can help reduce the load on `rippled` servers running in P2P mode.

Clio stores validated historical ledger and transaction data in a space efficient format, using up to 4 times less space than `rippled`.  Clio uses Cassandra or ScyllaDB, allowing for scalable read throughput. Multiple Clio servers can share access to the same dataset, thereby enabling you to build a highly available cluster of Clio servers without the need for redundant data storage or computation.  

Clio requires access to a `rippled` server and the `rippled` need not be running on the same machine as Clio.

While Clio offers the complete `rippled` API, by default, it only returns validated data. For any requests that require access to the P2P network, Clio automatically forwards the request to the `rippled` server on the P2P network and passes the response back to the requestor.  

## Why Should I Run a Clio Server?

There are two main reasons to run a Clio server: lower latency for API requests and lower memory usage.  

A Clio server does not connect to the peer-to-peer network. Instead, it uses gRPC to get validated data from one or more trusted servers that are connected to the P2P network and stores it in a persistent data store. As a result, a Clio server handles requests more efficiently with a lower latency and reduces the load on `rippled` servers running in P2P mode.


By using Cassandra or ScyllaDB as the database, the disk requirements for a Clio server are lower as the data is not stored on your local disk.

## How does a Clio Server Work?

{{ include_svg("img/clio-basic-architecture.svg", "Figure 1: How does a Clio server work?") }}

A Clio server stores validated ledger data such as transaction metadata, account states, and ledger headers in a persistent datastore. 

When a Clio server receives an API request, it looks up data from these data stores. For requests that require data from the P2P network, the Clio server forwards the request to a P2P server, and then passes the response back to the client.


## See Also

- **References:**
    - [Commandline Usage Reference](commandline-usage.html) - Detailed information on command-line options for all `rippled` server modes and Clio nodes.
    - [server_info][clio-server-info.html] - API method to retrieve the status of the Clio server.
- **Tutorials:**
    - [Build and Run a Clio node](build-run-clio-node.html)
    - [Install Clio server on Ubuntu](install-clio-on-ubuntu.html)
