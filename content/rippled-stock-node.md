The purpose of this document is to describe the steps one must perform to run a rippled node.

# Vocabulary

- rippled node - A single running instance of rippled

# Binary installation

This document assumes that you are using Ubuntu 14.04.

1. Install the ripple apt archive

        $ sudo apt-get install software-properties-common
        $ sudo apt-add-repository 'deb http://mirrors.ripple.com/ubuntu/ trusty stable contrib'
        $ sudo apt-get update

2. Install rippled:

        $ sudo apt-get install rippled

3. Configure rippled in `/etc/rippled/rippled.cfg`

        [server]
        port_peer
        port_rpc
        port_ws

        [port_peer]
        port = 51235
        ip = 0.0.0.0
        protocol = peer

        [port_rpc]
        port = 51234
        ip = 0.0.0.0
        admin = allow
        protocol = http

        [port_ws]
        port = 51233
        ip = 0.0.0.0
        admin = allow
        protocol = ws

        [peer_private]
        1

        [ledger_history]
        full

        [ssl_verify]
        0

        [sntp_servers]
        time.windows.com
        time.apple.com
        time.nist.gov
        pool.ntp.org

        [rpc_allow_remote]
        1

        [node_db]
        type=nudb
        path=/mnt/rippled/db/nudb

        [database_path]
        /mnt/rippled/db

        [rpc_startup]
        {"command": "log_level", "severity": "warning"}

   See [here](https://github.com/ripple/rippled/blob/develop/doc/rippled-example.cfg) for additional configuration options.

4. Give rippled permission to mount

        $ sudo mkdir /mnt/rippled
        $ sudo chown rippled:rippled -R /mnt/rippled

5. Start rippled node

        $ sudo service rippled start

See [Configuring rippled to validate ledgers](rippled-validator.html) to learn how to turn your node into a validator.
