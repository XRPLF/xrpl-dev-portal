---
category: 2022
date: 2022-06-29
labels:
    - Clio Release Notes
theme:
    markdown:
        editPage:
            hide: true
---
# Introducing Clio version 1.0.0

Today, RippleX and the XRP Ledger Foundation (XRPLF) are pleased to announce the 1.0 release of Clio—an XRP Ledger API server optimized for HTTP and WebSocket API calls.

<!-- BREAK -->

As noted in the [Beta announcement](https://xrpl.org/blog/2022/introducing-clio.html), the main reasons to run a Clio server include: higher throughput for API requests, lower memory usage and storage overhead, as well as easier horizontal scaling.

A Clio server does not connect to the peer-to-peer (P2P) network. Instead, it extracts data from a specified `rippled` server which is connected to the P2P network. By handling API calls efficiently, Clio servers help reduce the load on `rippled` servers running in P2P mode.

Clio stores validated historical ledger and transaction data in a space efficient format, using up to 4 times less space than `rippled`. Clio uses Cassandra or ScyllaDB, allowing for scalable read throughput. Multiple Clio servers can share access to the same dataset, thereby enabling you to build a highly available cluster of Clio servers without the need for redundant data storage or computation.

Clio offers the complete HTTP / WebSocket APIs. By default it uses the latest validated ledger to serve requests. For any requests that require access to the P2P network, Clio automatically forwards the request to a P2P server and passes the response back.

This release of Clio has been built and tested on Ubuntu 20.04 Focal Fossa.

To get started with Clio, read the [conceptual document](https://xrpl.org/the-clio-server.html), follow the tutorial to [install Clio using a prebuilt package](https://xrpl.org/install-clio-on-ubuntu.html), or check out the [README in the Clio project repository](https://github.com/XRPLF/clio) for instructions on building from source.

The SHA-256 hash for the official package is as follows:

| Package | SHA-256 |
|:--------|:--------|
| [Ubuntu Deb (x86_64)](https://repos.ripple.com/repos/rippled-deb/pool/stable/clio-server_1.0.0-1_amd64.deb) | `4a7acdeb9629c3bbeed4d95df67368b27e6e487715b2d442ac3e1d2530ad19f9` |

When building from source, the first log entry should be the commit setting the version:

```text
commit 1e7645419f0362436a088186903cb56d4f76481e
Author: Nathan Nichols <natenichols@cox.net>
Date:   Wed Jun 29 15:38:07 2022 -0700

    set version to 1.0.0 (#202)
```

To report an issue, provide feedback, or propose a new idea, please [open an issue](https://github.com/XRPLF/clio/issues).
