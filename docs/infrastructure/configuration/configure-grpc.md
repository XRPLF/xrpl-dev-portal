---
html: configure-grpc.html
parent: configure-rippled.html
seo:
    description: Enable and configure the gRPC API.
labels:
  - Core Server
---
# Configure gRPC

The `rippled` server has a limited [gRPC API](https://grpc.io/) which [P2P mode servers](../../concepts/networks-and-servers/rippled-server-modes.md) can provide. Reporting mode servers use this API to retrieve data about the latest validated ledgers and transactions. You can enable the gRPC API on your server with a new configuration stanza.

**Caution:** gRPC support is intended specifically for providing data to reporting mode servers from P2P mode servers. Breaking changes to the gRPC API may occur without warning or it may be removed entirely in future versions of the server.

## Prerequisites

To enable gRPC, you must meet the following prerequisites:

- You must have [installed rippled](../installation/index.md).

- Your server must be able to bind to the port you choose.

## Steps

To enable gRPC on your server, complete the following steps:

1. Ensure the `[port_grpc]` stanza is in your `rippled` config file.

    ```
    [port_grpc]
    port = 50051
    ip = 127.0.0.1
    ```

    - `port` defines the port the server listens on for gRPC connections from client applications. The recommended port is `50051`.
    - `ip` defines which interfaces the server listens on. `127.0.0.1` limits connections to the local loopback network (same machine) and is enabled by default. Changing the value to `0.0.0.0` listens on all available network interfaces.

    {% partial file="/docs/_snippets/conf-file-location.md" /%}

2. Start (or restart) the `rippled` service.

    ```
    sudo systemctl restart rippled
    ```

## See Also

- **Concepts:**
    - [XRP Ledger Overview](/about/)
    - [`rippled` Server Modes](../../concepts/networks-and-servers/rippled-server-modes.md)
- **Tutorials:**
    - [Get Started Using HTTP / WebSocket APIs](../../tutorials/http-websocket-apis/build-apps/get-started.md)
    - [Reliable Transaction Submission](../../concepts/transactions/reliable-transaction-submission.md)
    - [Manage the rippled Server](../installation/install-rippled-on-ubuntu.md)
- **References:**
    - [HTTP / WebSocket API Reference](../../references/http-websocket-apis/index.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
