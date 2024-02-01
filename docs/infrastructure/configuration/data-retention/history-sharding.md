---
html: history-sharding.html
parent: data-retention.html
seo:
    description: History sharding divides the work of keeping historical ledger data among rippled servers.
labels:
  - Data Retention
  - Core Server
---
# History Sharding

{% badge href="https://github.com/XRPLF/rippled/releases/tag/0.90.0" %}Introduced in: rippled 0.90.0{% /badge %}

As XRP Ledger servers run, they naturally produce a database containing data about the ledgers they built or acquired during network runtime. Each server stores that ledger data in its _ledger store_, but [online deletion](online-deletion.md) removes old ledgers' data automatically over time. History sharding provides a separate storage system for older ledger history so that the network can divide up the work of recording the entire (multiple terabyte) history of the XRP Ledger.

Historical sharding distributes the transaction history of the XRP Ledger into segments, called shards, across servers in the XRP Ledger network. A shard is a range of ledgers. A server uses mostly the same format for ledgers in both the ledger store and the shard store, but the two stores are separate.

[![XRP Ledger Network: Ledger Store and Shard Store Diagram](/docs/img/xrp-ledger-network-ledger-store-and-shard-store.png)](/docs/img/xrp-ledger-network-ledger-store-and-shard-store.png)

<!-- Diagram source: https://docs.google.com/presentation/d/1mg2jZQwgfLCIhOU8Mr5aOiYpIgbIgk3ymBoDb2hh7_s/edit#slide=id.g417450e8da_0_316 -->

## Acquiring and Sharing History Shards

Servers acquire and store history shards only if configured to do so. Acquiring shards begins after synchronizing with the network and backfilling ledger history to the configured number of recent ledgers. During this time of lower network activity, a server set to maintain a shard database randomly chooses a shard to add to its shard store. To increase the probability for an even distribution of the network ledger history, shards are randomly selected for acquisition, and the most recent shard is given no special consideration.

Once a shard is selected, the ledger acquire process begins by fetching the sequence of the last ledger in the shard and working backwards toward the first. The retrieval process begins with the server checking for the data locally. For data that is not available, the server requests data from its peers. Those servers that have the data available for the requested period respond with their history. The requesting server combines those responses to create the shard. The shard is complete when it contains all the ledgers in a specific range.

The server selects and downloads additional shards until it reaches the maximum number of shards it is configured to store. If a server runs out of space before completely acquiring a shard, it stops its retrieval process until it has space available to continue.

## XRP Ledger Network Data Integrity

The history of all ledgers is shared by servers agreeing to keep particular ranges of historical ledgers. This makes it possible for servers to confirm that they have all the data they agreed to maintain, and produce "proof trees" or "ledger deltas" which shows how each ledger in the blockchain's history was the result of applying transactions to the previous state. Since servers that are configured with history sharding randomly select the shards that they store, the entire history of all closed ledgers is stored in a normal distribution curve, increasing the probability that the XRP Ledger Network evenly maintains the history.

History shards are recorded in a deterministic format, so that any two servers assembling the same shard produce the exact same binary data no matter what order they acquired the data and where they got it from. This makes it possible to compare checksums or cryptographic hashes of the shard data to verify the integrity of the data, and it is possible to share and import history shards through other formats. (For example, you could download shard data using Bittorrent or acquire physical media with the shard data pre-loaded on it, and verify that it matches the data that can be downloaded from the network.) {% badge href="https://github.com/XRPLF/rippled/releases/tag/1.8.1" %}New in: rippled 1.8.1{% /badge %}


## See Also

- **Concepts:**
    - [Ledgers](../../../concepts/ledgers/index.md)
    - [Consensus](../../../concepts/consensus-protocol/index.md)
- **Tutorials:**
    - [Capacity Planning](../../installation/capacity-planning.md)
    - [Configure `rippled`](../index.md)
        - [Configure History Sharding](configure-history-sharding.md)
- **References:**
    - [crawl_shards method][]
    - [download_shard method][]
    - [Peer Crawler](../../../references/http-websocket-apis/peer-port-methods/peer-crawler.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
