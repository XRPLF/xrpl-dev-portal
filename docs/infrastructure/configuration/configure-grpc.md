---
seo:
    description: Enable and configure the gRPC API.
labels:
  - Core Server
---
# Configure gRPC

The `xrpld` server has a limited [gRPC API](https://grpc.io/) it can provide. Clio servers use this API to retrieve data about the latest validated ledgers and transactions. You can enable the gRPC API on your server with a new configuration stanza.

{% admonition type="warning" name="Caution" %}gRPC support is intended specifically for providing data to Clio servers. Breaking changes to the gRPC API may occur without warning or it may be removed entirely in future versions of the server.{% /admonition %}

## Prerequisites

To enable gRPC, you must meet the following prerequisites:

- You must have [installed xrpld](../installation/index.md).

- Your server must be able to bind to the port you choose.

## Steps

To enable gRPC on your server, complete the following steps:

1. Ensure the `[port_grpc]` stanza is in your `xrpld` config file. The packaged config already has it, listening on the loopback address.

    ```
    [port_grpc]
    port = 50051
    ip = 127.0.0.1
    secure_gateway = 127.0.0.1
    ```

    - `port` defines the port the server listens on for gRPC connections from client applications. The recommended port is `50051`.
    - `ip` defines which interfaces the server listens on. `127.0.0.1` limits connections to the local loopback network (same machine) and is enabled by default. Changing the value to `0.0.0.0` listens on all available network interfaces. gRPC has no login, so if you listen beyond loopback, limit the port to your Clio hosts with a firewall, or use TLS with `ssl_client_ca` (step 2).
    - `secure_gateway` is a comma-separated list of client addresses you trust, such as your Clio server. A request from one of these addresses that names a user is treated as an identified client, which lifts the usage limits that apply to anonymous clients. Without it, Clio is limited like any other caller. If Clio runs on another machine, add its address here.

    {% partial file="/docs/_snippets/conf-file-location.md" /%}

2. _(Optional)_ To secure gRPC connections with TLS, add the following settings to the `[port_grpc]` stanza. All certificate and key files must be in PEM format.

    ```
    [port_grpc]
    port = 50051
    ip = 127.0.0.1
    secure_gateway = 127.0.0.1
    ssl_cert = /etc/ssl/certs/grpc-server.crt
    ssl_key = /etc/ssl/private/grpc-server.key
    ssl_cert_chain = /etc/ssl/certs/grpc-intermediate-ca.crt
    ssl_client_ca = /etc/ssl/certs/grpc-client-ca.crt
    ```

    - `ssl_cert` and `ssl_key` define the paths to the server's TLS certificate and private key. Set both to enable TLS.
    - `ssl_cert_chain` _(optional)_ defines the path to a file of intermediate CA certificates.
    - `ssl_client_ca` _(optional)_ defines the path to a CA certificate used to verify client certificates, enabling mutual TLS (mTLS).

3. Start (or restart) the `xrpld` service.

    ```
    sudo systemctl restart xrpld
    ```

## See Also

- **Concepts:**
    - [XRP Ledger Overview](/about/)
    - [`xrpld` Server Modes](../../concepts/networks-and-servers/xrpld-server-modes.md)
- **Tutorials:**
    - [Get Started Using HTTP / WebSocket APIs](../../tutorials/get-started/get-started-http-websocket-apis.md)
    - [Reliable Transaction Submission](../../concepts/transactions/reliable-transaction-submission.md)
    - [Manage the xrpld Server](../installation/install-xrpld-on-ubuntu.md)
- **References:**
    - [HTTP / WebSocket API Reference](../../references/http-websocket-apis/index.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
