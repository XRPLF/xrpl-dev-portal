# Operating rippled Servers

The core server of the XRP Ledger peer-to-peer network is [`rippled`](the-rippled-server.html). Anyone can run their own `rippled` server that follows the network and keeps a complete copy of the XRP Ledger. You can even have your server take part in the consensus process.

This page contains instructions for:

* [Capacity Planning for `rippled`](#capacity-planning)
* [Installing `rippled`](#installing-rippled)
* [Participating in the Consensus Process](#running-a-validator)


# Additional Configuration

`rippled` should connect to the XRP Ledger with the default configuration. However, you can change your settings by editing the `rippled.cfg` file (located at `/opt/ripple/etc/rippled.cfg` when installing `rippled` with yum). For recommendations about configuration settings, see [Capacity Planning](#capacity-planning).

See [the `rippled` GitHub repository](https://github.com/ripple/rippled/blob/release/doc/rippled-example.cfg) for a description of all configuration options.

Changes to the `[debug_logfile]` or `[database_path]` sections may require you to give the `rippled` user and group ownership to your new configured path:

        $ chown -R rippled:rippled <configured path>

Restart `rippled` for any configuration changes to take effect:

        $ sudo service rippled restart
