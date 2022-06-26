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

7. Check the status of the Clio service:

        systemctl status rippled.service

    The `rippled` service should start automatically. If not, you can start it manually:

        sudo systemctl start rippled.service

    To configure it to start automatically on boot:

        sudo systemctl enable rippled.service

8. Optional: allow `rippled` to bind to privileged ports.

    This allows you to serve incoming API requests on port 80 or 443. (If you want to do so, you must also update the config file's port settings.)

        sudo setcap 'cap_net_bind_service=+ep' /opt/ripple/bin/rippled



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
