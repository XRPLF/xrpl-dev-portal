---
html: configure-grpc.html
parent: configure-rippled.html
blurb: Enable and configure the gRPC API.
---
# Configure gRPC

The `rippled` server has an experimental [gRPC API](https://grpc.io/). Currently, this API provides a subset of the full [`rippled` API](rippled-api.html). You can enable the gRPC API on your server with a new configuration stanza. [New in: rippled 1.5.0][]

**Caution:** gRPC support in `rippled` v1.5.0 is experimental. Configuration settings and API formats are likely to have breaking changes in forthcoming versions.

## Prerequisites

To enable gRPC, you must meet the following prerequisites:

- You must have [installed rippled](install-rippled.html).

- Your server must be able to bind to the port you choose. The recommended port for gRPC is `50051`.

## Steps

To enable gRPC on your server, complete the following steps:

1. In your `rippled`'s config file, add a `[port_grpc]` configuration stanza.

        [port_grpc]
        port = 50051
        ip = 0.0.0.0

    The configurable fields are as follows:

    - `port` field defines the port the server listens on for gRPC connections from client applications. The recommended port is `50051`.
    - `ip` defines which interfaces the server listens on. The value `0.0.0.0` listens on all available network interfaces. To limit connections to the local loopback network (same machine), use `127.0.0.1` instead.

    {% include '_snippets/conf-file-location.md' %}<!--_ -->

2. Start (or restart) the `rippled` service.

        $ sudo systemctl restart rippled

## See Also

<!-- TODO: add gRPC quickstart, overview docs here when available -->

- **Concepts:**
    - [XRP Ledger Overview](xrp-ledger-overview.html)
    - [Software Ecosystem](software-ecosystem.html)
    - [Parallel Networks](parallel-networks.html)
- **Tutorials:**
    - [Get Started with RippleAPI for JavaScript](get-started-with-rippleapi-for-javascript.html)
    - [Reliable Transaction Submission](reliable-transaction-submission.html)
    - [Manage the rippled Server](manage-the-rippled-server.html)
- **References:**
    - [rippled API Reference](rippled-api.html)
    - [Ripple Data API v2](data-api.html)

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}
