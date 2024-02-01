---
html: install-clio-on-ubuntu.html
parent: install-rippled.html
seo:
    description: Install a precompiled Clio binary on Ubuntu Linux.
labels:
  - Clio Server
---
# Install Clio on Ubuntu Linux

This page describes the recommended instructions for installing the latest stable version of Clio on **Ubuntu Linux 20.04 or higher** using the [`apt`](https://ubuntu.com/server/docs) utility.

These instructions install a binary that has been compiled by Ripple. For instructions on how to build Clio from source, see the [Clio source code repository](https://github.com/XRPLF/clio).


## Prerequisites

Before you install Clio, you must meet the following requirements.

- Ensure that your system meets the [system requirements](system-requirements.md).

    **Note:** Clio has the same system requirements as the `rippled` server, except Clio needs less disk space to store the same amount of ledger history.

-  You need compatible versions of CMake and Boost. Clio requires C++20 and Boost 1.75.0 or higher.

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

    **Tip:** If you have already installed an up-to-date version of `rippled` on the same machine, you can skip the following steps for adding Ripple's package repository and signing key, which are the same as in the `rippled` install process. Resume from step 5, "Fetch the Ripple repository."

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
    pub   rsa3072 2019-02-14 [SC] [expires: 2026-02-17]
        C0010EC205B35A3310DC90DE395F97FFCCAFD9A2
    uid           TechOps Team at Ripple <techops+rippled@ripple.com>
    sub   rsa3072 2019-02-14 [E] [expires: 2026-02-17]
    ```


    In particular, make sure that the fingerprint matches. (In the above example, the fingerprint is on the third line, starting with `C001`.)

4. Add the appropriate Ripple repository for your operating system version:

    ```
    echo "deb [signed-by=/usr/local/share/keyrings/ripple-key.gpg] https://repos.ripple.com/repos/rippled-deb focal stable" | \
        sudo tee -a /etc/apt/sources.list.d/ripple.list
    ```

    The above example is appropriate for **Ubuntu 20.04 Focal Fossa**.

5. Fetch the Ripple repository.

    ```
    sudo apt -y update
    ```

6. Install the Clio software package. There are two options:

    - To run `rippled` on the same machine, install the `clio` package, which sets up both servers:

        ```
        sudo apt -y install clio
        ```

    - To run Clio on a separate machine from `rippled`, install the `clio-server` package, which sets up Clio only:

        ```
        sudo apt -y install clio-server
        ```

7. If you are running `rippled` on a separate machine, modify your Clio config file to point to it. You can skip this step if you used the `clio` package to install both on the same machine.



    1. Edit the Clio server's config file to modify the connection information for the `rippled` server. The package installs this file at `/opt/clio/etc/config.json`.

        ```
        "etl_sources":
        [
            {
                "ip":"127.0.0.1",
                "ws_port":"6006",
                "grpc_port":"50051"
            }
        ]
        ```

        This includes:

        - The IP of `rippled` server.
        - The port where `rippled` accepts unencrypted WebSocket connections.
        - The port where `rippled` accepts gRPC requests.

        **Note** You can use multiple `rippled` servers as a data source by add more entries to the `etl_sources` section. If you do, Clio load balances requests across all the servers in the list, and can keep up with the network as long as at least one of the `rippled` servers is synced.

        The [example config file](https://github.com/XRPLF/clio/blob/develop/example-config.json) accesses the `rippled` server running on the local loopback network (127.0.0.1), with the WebSocket (WS) on port 6006 and gRPC on port 50051.

    2. Update the `rippled` server's config file to allow the Clio server to connect to it. The package installs this file at `/etc/opt/ripple/rippled.cfg`.

        * Open a port to accept unencrypted WebSocket connections.

            ```
            [port_ws_public]
            port = 6005
            ip = 0.0.0.0
            protocol = ws
            ```

        * Open a port to handle gRPC requests and specify the IP(s) of Clio server(s) in the `secure_gateway` entry.

            ```
            [port_grpc]
            port = 50051
            ip = 0.0.0.0
            secure_gateway = 127.0.0.1
            ```

            **Tip:** If you are not running Clio on the same machine as `rippled`, change the `secure_gateway` in the example stanza to use the IP address of the Clio server.

8. Enable and start the Clio systemd service.

    ```
    sudo systemctl enable clio
    ```

9. Start the `rippled` and Clio servers.

    ```
    sudo systemctl start rippled
    sudo systemctl start clio
    ```

    If you are starting with a fresh database, Clio needs to download the full ledger. This can take some time. If you are starting both servers for the first time, it can take even longer because Clio waits for `rippled` to sync before extracting ledgers.





## See Also

- **Concepts:**
    - [The Clio Server](../../concepts/networks-and-servers/the-clio-server.md)
