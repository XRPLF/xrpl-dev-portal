---
html: install-clio-on-ubuntu.html
parent: install-rippled.html
seo:
    description: Install a precompiled Clio binary on Ubuntu Linux.
labels:
  - Clio Server
---
# Install Clio on Ubuntu Linux

This page describes the recommended instructions for installing the latest stable version of Clio on **Ubuntu Linux 22.04 or higher** using the [`apt`](https://ubuntu.com/server/docs) utility.

These instructions install an Ubuntu package that has been compiled and published by Ripple. You can also:

- Download binaries, including for nightly and preview builds, from the [Clio releases page on GitHub](https://github.com/XRPLF/clio/releases/). (Expand the **Assets** section and choose the appropriate version for your OS.)
- [Build Clio from source](https://github.com/XRPLF/clio/blob/develop/docs/build-clio.md).
- Use a [Clio Docker Image](https://hub.docker.com/r/rippleci/clio).


## Prerequisites

Before you install Clio, you must meet the following requirements.

- Ensure that your system meets the [system requirements](system-requirements.md).

    {% admonition type="info" name="Note" %}
    Clio has the same system requirements as the `rippled` server, except Clio needs less disk space to store the same amount of ledger history.
    {% /admonition %}

- Access to a Cassandra cluster that is running locally or remote. You can choose to install and configure a Cassandra cluster manually by following the [Cassandra installation instructions](https://cassandra.apache.org/doc/latest/cassandra/getting_started/installing.html), or run Cassandra on a Docker container using one of the following commands.

    -  If you choose to persist Clio data, run Cassandra in a Docker container and specify an empty directory to store Clio data:

        ```
        docker run --rm -it --network=host --name cassandra  -v $PWD/cassandra_data:/var/lib/
        cassandra cassandra:4.0.4
        ```

    - If you do not wish to persist Clio data, run the following command:

        ```
        docker run --rm -it --network=host --name cassandra cassandra:4.0.4
        ```

- You need gRPC access to one or more `rippled` servers in P2P mode. The `rippled` servers can either be local or remote, but you must trust them. The most reliable way to do this is to [install `rippled` yourself](index.md).


## Installation Steps

1. Update repositories:

    ```
    sudo apt -y update
    ```

    {% admonition type="success" name="Tip" %}
    If you have already installed an up-to-date version of `rippled` on the same machine, you can skip the following steps for adding Ripple's package repository and signing key, which are the same as in the `rippled` install process. Resume from step 6, "Fetch the Ripple repository."
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
    uid   TechOps Team at Ripple <techops+rippled@ripple.com>
    sub   ed25519 2026-02-16 [S] [expires: 2029-02-15]
    ```


    In particular, make sure that the fingerprint matches. (In the above example, the fingerprint is on the third line, starting with `C001`.)

5. Add the appropriate Ripple repository for your operating system version:

    ```
    echo "deb [signed-by=/usr/local/share/keyrings/ripple-key.gpg] https://repos.ripple.com/repos/rippled-deb noble stable" | \
        sudo tee -a /etc/apt/sources.list.d/ripple.list
    ```

    The above example is appropriate for **Ubuntu 24.04 Noble Numbat**.

    If you want access to development or pre-release versions, use one of the following instead of `stable`:

    - `unstable` - Pre-release builds such as betas or release candidates
    - `nightly` - Nightly development builds based on the [`develop` branch](https://github.com/XRPLF/Clio/tree/develop))

6. Fetch the Ripple repository.

    ```
    sudo apt -y update
    ```

7. Install the Clio software package.

    ```
    sudo apt -y install clio
    ```

8. Modify your config files so that Clio can connect to your `rippled` server(s).

    1. Edit the Clio server's config file to modify the connection information for the `rippled` server. The package installs this file at `/opt/clio/etc/config.json`.

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
        | `ip`        | String | The IP address of the `rippled` server. |
        | `ws_port`   | String | The port where `rippled` accepts unencrypted (non-admin) WebSocket connections. The Clio server forwards some types of API requests to this port. |
        | `grpc_port` | String | The port where `rippled` accepts gRPC requests. |

        {% admonition type="info" name="Note" %}
        You can use multiple `rippled` servers as a data source by adding more entries to the `etl_sources` section. If you do, Clio load balances requests across all the servers in the list, and can keep up with the network as long as at least one of the `rippled` servers is synced.
        {% /admonition %}

        The [example config file](https://github.com/XRPLF/clio/blob/develop/docs/examples/config/example-config.json) accesses the `rippled` server running on the local loopback network (127.0.0.1), with the WebSocket (WS) on port 6005 and gRPC on port 50051.

    2. Update the `rippled` server's config file to allow the Clio server to connect to it. The package installs this file at `/etc/opt/ripple/rippled.cfg`.

        * Open a port to accept unencrypted, non-admin WebSocket connections.

            ```
            [port_ws_public]
            port = 6005
            ip = 0.0.0.0
            protocol = ws
            ```

            {% admonition type="warning" name="Caution" %}
            Make sure your network firewall is configured not to forward outside requests on this port to your `rippled` server unless you intend to serve API requests to the general public.
            {% /admonition %}

        * Open a port to handle gRPC requests and specify the IP(s) of Clio server(s) in the `secure_gateway` entry.

            ```
            [port_grpc]
            port = 50051
            ip = 0.0.0.0
            secure_gateway = 127.0.0.1
            ```

            {% admonition type="warning" name="Caution" %}
            If you are not running Clio on the same machine as `rippled`, change the `secure_gateway` in the example stanza to use the IP address of the Clio server.
            {% /admonition %}

9. Enable and start the Clio systemd service.

    ```
    sudo systemctl enable clio
    ```

10. Start the `rippled` and Clio servers.

    ```
    sudo systemctl start rippled
    sudo systemctl start clio
    ```

    If you are starting with a fresh database, Clio needs to download the full ledger. This can take some time. If you are starting both servers for the first time, it can take even longer because Clio waits for `rippled` to sync before extracting ledgers.





## See Also

- **Concepts:**
    - [The Clio Server](../../concepts/networks-and-servers/the-clio-server.md)
