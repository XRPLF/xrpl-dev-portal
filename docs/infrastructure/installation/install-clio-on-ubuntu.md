---
html: install-clio-on-ubuntu.html
parent: install-xrpld.html
seo:
    description: Install a precompiled Clio binary on Ubuntu Linux.
labels:
  - Clio Server
---
# Install Clio on Ubuntu Linux

This page describes the recommended instructions for installing the latest stable version of Clio on **Ubuntu Linux 22.04 or higher** using the [`apt`](https://ubuntu.com/server/docs) utility.

Before you install, decide whether you need Clio at all and what it is for: see [Clio](../configuration/server-modes/clio.md) for who should run it, the writer and reader architecture, and the start-ledger decision that can't be undone later, and [Clio System Requirements](../prerequisites/system-requirements/clio.md) for what the database cluster behind it costs.

These instructions install an Ubuntu package that has been compiled and published by Ripple. You can also:

- Download binaries, including for nightly and preview builds, from the [Clio releases page on GitHub](https://github.com/XRPLF/clio/releases/). (Expand the **Assets** section and choose the appropriate version for your OS.)
- [Build Clio from source](https://github.com/XRPLF/clio/blob/develop/docs/build-clio.md).
- Use a [Clio Docker Image](https://hub.docker.com/r/rippleci/clio).


## Prerequisites

Before you install Clio, you must meet the following requirements.

- Ensure that your system meets the [Clio System Requirements](../prerequisites/system-requirements/clio.md).

    {% admonition type="info" name="Note" %}
    Clio itself is a light process. The database cluster behind it is what you size, and Clio System Requirements covers that. To check the current disk usage of a running cluster, use `nodetool tablestats` or `du` on the Cassandra data directory. Since full history continuously grows, don't rely on a fixed estimate.
    {% /admonition %}

- Access to a Cassandra cluster that is running locally or remote. You can choose to install and configure a Cassandra cluster manually by following the [Cassandra installation instructions](https://cassandra.apache.org/doc/latest/cassandra/installing/installing.html), or run Cassandra on a Docker container using one of the following commands.

    -  If you choose to persist Clio data, run Cassandra in a Docker container and specify an empty directory to store Clio data:

        ```
        docker run --rm -it --network=host --name cassandra -v $PWD/cassandra_data:/var/lib/cassandra cassandra:4.0.4
        ```

    - If you don't wish to persist Clio data, run the following command:

        ```
        docker run --rm -it --network=host --name cassandra cassandra:4.0.4
        ```

- You need gRPC access to one or more `xrpld` servers in P2P mode. The `xrpld` servers can either be local or remote, but you must trust them. The most reliable way to do this is to [install `xrpld` yourself](index.md).


## Installation Steps

1. Update repositories:

    ```
    sudo apt -y update
    ```

    {% admonition type="success" name="Tip" %}
    The `xrpld` install guide now uses the XRP Ledger Foundation's repository and key at `packages.xrplf.org`, whose stable channel doesn't carry Clio. Add Ripple's repository and signing key here even if `xrpld` is already installed on the same machine. If you already have `/etc/apt/sources.list.d/ripple.list` from an older install, you can resume from step 6, "Fetch the Ripple repository."
    {% /admonition %}

2. Install utilities:

    ```
    sudo apt -y install apt-transport-https ca-certificates wget gnupg
    ```

3. Add Ripple's package-signing GPG key to your list of trusted keys:

    ```
    sudo mkdir /usr/local/share/keyrings/
    wget -q -O - "https://repos.ripple.com/repos/api/gpg/key/public" | gpg --dearmor > ripple-key.gpg
    sudo mv ripple-key.gpg /usr/local/share/keyrings
    ```

4. Check the fingerprint of the newly-added key:

    ```
    gpg /usr/local/share/keyrings/ripple-key.gpg
    ```

    The output should include an entry for Ripple such as the following:

    ```
    gpg: WARNING: no command supplied.  Trying to guess what you mean ...
    pub   ed25519 2026-02-16 [SC] [expires: 2033-02-14]
        E057C1CF72B0DF1A4559E8577DEE9236AB06FAA6
    uid   TechOps Team at Ripple <techops+xrpld@ripple.com>
    sub   ed25519 2026-02-16 [S] [expires: 2029-02-15]
    ```


    In particular, make sure that the fingerprint matches. (In the above example, the fingerprint is on the third line, starting with `E057`.)

5. Add the appropriate Ripple repository for your operating system version:

    ```
    echo "deb [signed-by=/usr/local/share/keyrings/ripple-key.gpg] https://repos.ripple.com/repos/rippled-deb noble stable" | \
        sudo tee /etc/apt/sources.list.d/ripple.list
    ```

    The above example is appropriate for **Ubuntu 24.04 Noble Numbat**.

    If you want access to development or pre-release versions, use one of the following instead of `stable`:

    - `unstable` - Pre-release builds such as betas or release candidates
    - `nightly` - Nightly development builds

    {% admonition type="danger" name="Warning" %}Unstable and nightly builds may be broken at any time. Don't use these builds for production servers.{% /admonition %}

6. Fetch the Ripple repository.

    ```
    sudo apt -y update
    ```

7. Install the Clio software package.

    ```
    sudo apt -y install clio
    ```

8. Modify your config files so that Clio can connect to your `xrpld` server(s).

    1. Edit the Clio server's config file to modify the connection information for the `xrpld` server. The package installs this file at `/opt/clio/etc/config.json`. If you want history older than the current ledger, also add `start_sequence` at the top level of this file before the first start (see [Choose the start ledger before you fill anything](../configuration/server-modes/clio.md#choose-the-start-ledger-before-you-fill-anything) in Clio).

        ```
        "etl_sources":
        [
            {
                "ip":"127.0.0.1",
                "ws_port":"6005",
                "grpc_port":"50051"
            }
        ]
        ```

        Each entry in the `etl_sources` JSON array should contain the following fields:

        | Field       | Type   | Description |
        |-------------|--------|-------------|
        | `ip`        | String | The IP address or hostname of the `xrpld` server. |
        | `ws_port`   | String | The port where `xrpld` accepts (non-admin) WebSocket connections. Clio subscribes to the ledger stream on this port to learn which ledgers are validated, so extraction depends on it, and forwards some API requests to it. Clio uses TLS on this connection if the port offers it. |
        | `grpc_port` | String | The port where `xrpld` accepts gRPC requests. |

        {% admonition type="info" name="Note" %}
        You can use multiple `xrpld` servers as a data source by adding more entries to the `etl_sources` section. If you do, Clio load balances requests across all the servers in the list, and can keep up with the network as long as at least one of the `xrpld` servers is synced.
        {% /admonition %}

        The [example config file](https://github.com/XRPLF/clio/blob/develop/docs/examples/config/example-config.json) accesses the `xrpld` server running on the local loopback network (127.0.0.1), with the WebSocket (WS) on port 6005 and gRPC on port 50051.

    2. Update the `xrpld` server's config file to allow the Clio server to connect to it. The package installs this file at `/etc/xrpld/xrpld.cfg`.

        * Open a port to accept unencrypted, non-admin WebSocket connections. In the `[server]` section, uncomment the `port_ws_public` line, then uncomment and edit the `[port_ws_public]` section further down:

            ```
            [port_ws_public]
            port = 6005
            ip = 0.0.0.0
            protocol = ws
            ```

            {% admonition type="warning" name="Caution" %}
            Make sure your network firewall is configured not to forward outside requests on this port to your `xrpld` server unless you intend to serve API requests to the general public.
            {% /admonition %}

        * The packaged config already has a `[port_grpc]` section that listens on `127.0.0.1` with `secure_gateway = 127.0.0.1`. That is enough when Clio runs on the same machine. If Clio runs elsewhere, edit that section (don't add a second one): set `ip` to an address Clio can reach, and `secure_gateway` to the IP of the Clio server.

9. Enable and start the Clio systemd service.

    ```
    sudo systemctl enable clio
    ```

10. Start the `xrpld` and Clio servers.

    ```
    sudo systemctl start xrpld
    sudo systemctl start clio
    ```

    Start `xrpld` first and wait until its WebSocket port answers before starting Clio: Clio exits at startup if it can't reach any `etl_sources` entry. If you are starting with a fresh database, Clio needs to download the full ledger. This can take some time. If you are starting both servers for the first time, it can take even longer because, once connected, Clio waits for `xrpld` to sync before extracting ledgers.





## See Also

- **Concepts:**
    - [The Clio Server](../../concepts/networks-and-servers/the-clio-server.md)
- **Tutorials:**
    - [Clio](../configuration/server-modes/clio.md)
    - [Clio System Requirements](../prerequisites/system-requirements/clio.md)
    - [Clio Best Practices](../configuration/best-practices/clio.md)
    - [Clio Security](../configuration/security/clio.md)
