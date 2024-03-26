---
category: 2022
date: 2022-03-22
labels:
    - Clio Release Notes
theme:
    markdown:
        editPage:
            hide: true
---
# Introducing Clio, an XRP Ledger API server, now in Beta

Today, RippleX and the XRP Ledger Foundation (XRPLF) are pleased to announce the first beta release for Clio, an XRP Ledger API server optimized for WebSocket or HTTP API calls.

<!-- BREAK -->

A Clio server does not connect to the peer-to-peer network. Instead, it extracts data from a specified `rippled` server which is connected to the P2P network. By handling API calls efficiently, Clio servers can help reduce the load on `rippled` servers running in P2P mode.

Clio stores validated historical ledger and transaction data in a space efficient format, using up to 4 times less space than `rippled`.  Clio uses Cassandra or ScyllaDB, allowing for scalable read throughput. Multiple Clio servers can share access to the same dataset, thereby enabling you to build a highly available cluster of Clio servers without the need for redundant data storage or computation.  

Clio requires access to a `rippled` server and the `rippled` need not be running on the same machine as Clio.

While Clio offers the complete `rippled` API, by default, it only returns validated data. For any requests that require access to the P2P network, Clio automatically forwards the request to the `rippled` server on the P2P network and passes the response back to the requestor.  

This beta release of Clio has been built and tested on Ubuntu 20.04 Focal Fossa.

Run the following commands to install Clio:

```sh
sudo apt-get update && sudo apt-get install -y wget gnupg2
wget -q -O - "https://repos.ripple.com/repos/api/gpg/key/public" | sudo apt-key add -
echo "deb https://repos.ripple.com/repos/rippled-deb-test-mirror focal unstable" | sudo tee /etc/apt/sources.list.d/clio.list
sudo apt-get update && sudo apt install clio
```

For more information about running Clio, check out the [README in the Clio project repository](https://github.com/XRPLF/clio).

To report an issue, provide feedback, or propose a new idea, please [open an issue](https://github.com/XRPLF/clio/issues).
