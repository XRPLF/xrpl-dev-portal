---
html: install-clio-on-ubuntu.html
parent: install-clio.html
blurb: Install a precompiled Clio binary on Ubuntu Linux.
labels:
  - Clio Server
---
# Install Clio on Ubuntu Linux

This page describes the recommended instructions for installing the latest stable version of Clio on **Ubuntu Linux 20.04 or higher** using the [`apt`](https://ubuntu.com/server/docs) utility.

These instructions install a binary that has been compiled by Ripple.


## Prerequisites

Before you install Clio, you must meet the following requirements.

1. Ensure that your system meets the [system requirements](system-requirements.html).

    **Note:** Clio uses Cassandra as the database and the disk requirements for Clio are lower than the requirements for `rippled` as the data will not be stored on your local disk.  

2.  A compatible version of CMake must be installed. Clio requires C++20 and Boost 1.75.0 or higher.

3. Access to a Cassandra cluster that is running locally or remote. You can choose to install and configure a Cassandra cluster manually by following the installation instructions, or run Cassandra on a Docker container using the following commands.

    1.  If you choose to persist Clio data, run Cassandra in a Docker container and specify an empty directory to store Clio data: 
            
            docker run --rm -it --network=host --name cassandra  -v $PWD/cassandra_data:/var/lib/
            cassandra cassandra:4.0.4

    2. If you do not wish to persist Clio data, run the following command:

            docker run --rm -it --network=host --name cassandra cassandra:4.0.4 

5. In order to run Clio, you also need to run one or more `rippled` servers in [P2P mode](install-rippled.html). The `rippled` servers can either be local or remote. Ensure that you have at least one `rippled` server running in P2P mode.


## Installation Steps

1. Update repositories:

        sudo apt -y update

2. Install utilities:

        sudo apt -y install apt-transport-https ca-certificates wget gnupg

3. Add Ripple's package-signing GPG key to your list of trusted keys:

        sudo mkdir /usr/local/share/keyrings/
        wget -q -O - "https://repos.ripple.com/repos/api/gpg/key/public" | gpg --dearmor > ripple-key.gpg
        sudo mv ripple-key.gpg /usr/local/share/keyrings


4. Check the fingerprint of the newly-added key:

        gpg /usr/local/share/keyrings/ripple-key.gpg

    The output should include an entry for Ripple such as the following:

        gpg: WARNING: no command supplied.  Trying to guess what you mean ...
        pub   rsa3072 2019-02-14 [SC] [expires: 2026-02-17]
            C0010EC205B35A3310DC90DE395F97FFCCAFD9A2
        uid           TechOps Team at Ripple <techops+rippled@ripple.com>
        sub   rsa3072 2019-02-14 [E] [expires: 2026-02-17]


    In particular, make sure that the fingerprint matches. (In the above example, the fingerprint is on the third line, starting with `C001`.)

4. Add the appropriate Ripple repository for your operating system version:

        echo "deb [signed-by=/usr/local/share/keyrings/ripple-key.gpg] https://repos.ripple.com/repos/rippled-deb focal stable" | \
            sudo tee -a /etc/apt/sources.list.d/ripple.list

    The above example is appropriate for **Ubuntu 20.04 Focal Fossa**. 


5. Fetch the Ripple repository.

        sudo apt -y update

6. Install the Clio software package:

        sudo apt -y install rippled

7. Run `./clio_server config.json`.

8. A Clio server needs to access a `rippled` server to run succesfully. To enable communication between the servers, the config files of Clio and `rippled` need to share the following information.

    1. Update the Clio server's config file with the following information:
        
        * The IP of `rippled` server.
        * The port on which `rippled` is accepting unencrypted WebSocket connections.
        * The port on which `rippled` is handling gRPC requests.

                    "etl_sources":
                    [
                        {
                            "ip":"127.0.0.1",
                            "ws_port":"6006",
                            "grpc_port":"50051"
                        }
                    ]

        **Note** You can use multiple `rippled` servers as a data source by add more entries to the `etl_sources` section. Clio will load balance requests across the servers specified in the list. As long as one `rippled` server is up and synced, Clio will continue to extract validated ledgers.

    2. Update the `rippled` server's config file with the following information:
        
        * Open a port to accept unencrypted websocket connections. 
        * Open a port to handle gRPC requests and specify the IP(s) of Clio server(s) in the `secure_gateway` entry.

                "server":{
                    "ip":"0.0.0.0",
                    "port":51233
                }

9. Start the `rippled` and Clio servers. 

    Clio waits for `rippled` to sync before extracting ledgers. If you are starting the servers for the first time, 
    
    If you are starting with a fresh database, Clio needs to download the full ledger. This can take some time.


<!--_ -->


## See Also

- **Concepts:**
    - [The Clio Server](the-clio-server.html)
- **Tutorials:**
    - [Build and Run Clio Server](build-run-clio-ubuntu.html)
- **References:**
    - [rippled and Clio API Reference](rippled-api.html)


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}

{
    "database":
    {
        "type":"cassandra",
        "cassandra":
        {
            "contact_points":"127.0.0.1",
            "port":9042,
            "keyspace":"clio",
            "replication_factor":1,
            "table_prefix":"",
            "max_requests_outstanding":25000,
            "threads":8
        }
    },
    "etl_sources":
    [
        {
            "ip":"127.0.0.1",
            "ws_port":"6006",
            "grpc_port":"50051"
        }
    ],
    "dos_guard":
    {
        "whitelist":["127.0.0.1"]
    },
    "server":{
        "ip":"0.0.0.0",
        "port":51233
    },
    "log_level":"debug",
    "log_to_console": true,
    "log_to_file": true,
    "log_directory":"./clio_log",
    "log_rotation_size": 2048,
    "log_directory_max_size": 51200,
    "log_rotation_hour_interval": 12,
    "online_delete":0,
    "extractor_threads":8,
    "read_only":false
}