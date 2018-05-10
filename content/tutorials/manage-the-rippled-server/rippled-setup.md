# Operating rippled Servers

The core server of the XRP Ledger peer-to-peer network is [`rippled`](reference-rippled.html). Anyone can run their own `rippled` server that follows the network and keeps a complete copy of the XRP Ledger. You can even have your server take part in the consensus process.

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


## Parallel Networks

Most of the time, we describe the XRP Ledger as one collective, singular entity -- and that's mostly true. There is one production XRP Ledger peer-to-peer network, and all business that takes place on the XRP Ledger occurs within the production network.

However, sometimes you may want to do tests and experiments without interacting with the core network. That's why Ripple started the [Ripple Test Net](https://ripple.com/build/ripple-test-net/), an "alternate universe" network, which can act as a testing ground for applications and the `rippled` server itself, without impacting the business operations of everyday XRP Ledger users. The Ripple Test Net (also known as the AltNet) has a separate supply of TestNet-only XRP, which Ripple [gives away for free](https://ripple.com/build/ripple-test-net/) to parties interested in developing applications on the Test Net.

**Caution:** Ripple makes no guarantees about the stability of the test network. It has been and continues to be used to test various properties of server configuration, network topology, and network performance.

Over time, there may also be smaller, temporary test networks for specific purposes.

### Parallel Networks and Consensus

There is no `rippled` setting that defines which network it uses. Instead, it uses the consensus of validators it trusts to know which ledger to accept as the truth. When different consensus groups of `rippled` instances only trust other members of the same group, each group continues as a parallel network. Even if malicious or misbehaving computers connect to both networks, the consensus process overrides the confusion as long as the members of each network are not configured to trust members of another network in excess of their quorum settings.
