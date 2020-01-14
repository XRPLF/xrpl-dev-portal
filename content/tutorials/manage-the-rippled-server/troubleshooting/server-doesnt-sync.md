# rippled Server Doesn't Sync

This page explains possible reasons [a `rippled` server](the-rippled-server.html) may start successfully, but get stuck in a ["connected" state](rippled-server-states.html) without ever fully connecting to the network. (If the server crashes during or shortly after startup, see [Server Won't Start](server-wont-start.html) instead.)

These instructions assume you have [installed `rippled`](install-rippled.html) on a supported platform.


## Normal Syncing Behavior

Syncing with the network normally takes about 5 to 15 minutes. During that time, the server does several things:

- Loads a recommended validator list (typically from `vl.ripple.com`) to determine which validators it trusts.
- [Discovers peer servers](peer-protocol.html#peer-discovery) and connects to them.
- Downloads the [header](ledger-header.html) and full [state information](ledgers.html#tree-format) of the latest ledger from its peers, and uses that to build its internal database of ledger data.
- Listens to its trusted validators to find which ledger hashes have been recently validated.
- Collects newly-broadcast transactions and attempts to apply them to its in-progress ledger.

If the server is unable to keep up with the network while doing these tasks, the server does not sync to the network.


## First Step: Restart

Many syncing issues can be resolved by restarting the server. No matter why it failed to sync the first time, it may succeed on the second try.

If the [server_info method][] shows a [`server_state`](rippled-server-states.html) other than `proposing` or `full` and a `server_state_duration_us` of more than `900000000` (15 minutes in microseconds), then you should shut down the `rippled` service, wait a few seconds, and start it again. Optionally, restart the entire machine.

If the problem persists, check the other possibilities listed on this page. If none of them seem to apply, [open an issue in the `rippled` repository](https://github.com/ripple/rippled/issues) and add the "Syncing issue" label.


## Usual Causes of Syncing Issues

The most common cause of syncing issues is not meeting the [system requirements](system-requirements.html). The three most common shortfalls are:

- **Slow disks.** You need a consistently fast solid state disk (SSD). Cloud providers like AWS usually don't guarantee disk performance, which may be impacted by other users of shared hardware.
- **Insufficient RAM.** The memory requirements vary depending on several factors including ones that are hard to predict like network load and how people use the XRP Ledger, so it's good to have more than the minimum system requirements just in case.
- **Poor network connection.** Network requirements vary the most based on how people use the XRP Ledger, but a slow or unstable connection can make it impossible to keep up with new transactions and data added to the XRP Ledger.

If you are having trouble remaining synced, double-check that your server meets the system requirements. Depending on how you use your server, you may need to meet the higher "Recommended" requirements instead of just the "Minimum" requirements. If you meet the "Recommended" requirements and still cannot sync, try the other possibilities on this page.


## Couldn't Load Validator List

The default configuration uses a recommended list of validators retrieved from `vl.ripple.com`. This list is signed by Ripple's cryptographic key pair and has a built-in expiration date. If your server cannot download the list from `vl.ripple.com` for some reason, your server does not choose a set of trusted validators and cannot determine which possible ledgers to declare as valid. (If you are connected to [the testnet or another parallel network](parallel-networks.html), your server uses a list of trusted validators for that network instead.)

The `validator_list` block in the [server_info method][] response shows the status of your validator list including its expiration date. If you have a list, but it's expired, it's possible that your server had connectivity to the validator list site before but hasn't been able to connect lately, so your current list expired while your server was unable to download a more updated list.

You can also use the [validator_list_sites method][] to get more detailed information. If the `last_refresh_status` and `last_refresh_time` fields are missing from the validator site objects in the response, that probably indicates that your server is having trouble connecting to the validator list site. Check your firewall configuration to make sure you're not blocking outgoing traffic on port 80 (HTTP) or 443 (HTTPS). Also check that your DNS is able to resolve the domain of your validator list site.

<!-- TODO: create a tutorial for how to sideload a validator list from file and link it here -->


## Not Enough Peers

If your server does not connect to enough [peer servers](peer-protocol.html), it may not be able to download enough data to remain synced with the network as the network continues processing new transactions. This can happen if your network connection is unreliable, or if you configure your server as a [private server](peer-protocol.html#private-peers) without adding enough reliable fixed peers.

Use the [peers method][] to get information about your server's current peers. If you have exactly 10 or 11 peers, that may indicate that your firewall is blocking incoming peer connections. [Set up port forwarding](forward-ports-for-peering.html) to allow more incoming connections. If your server is configured as a private server, double-check the contents and syntax of the `[ips_fixed]` stanza in your config file, and add more proxies or public hubs if possible.


## Corrupt Databases

In rare cases, corrupt data saved in your `rippled` server's internal databases could cause it to fail to sync. You can safely delete your server's databases in most circumstances as long as the server is not running. Corrupt data can be the result of a momentary hardware failure when copying or writing to disk, a more serious disk failure, a different process crashing and writing to the wrong part of the disk, or other issues.

As a test, you can temporarily change the paths to your server's databases as long as you have enough free space to re-download the current ledger and store other settings.

**Note:** When you change the database paths, the server does not load some saved settings, such as the server's current [node key pair][] and [peer reservations](peer-protocol.html#fixed-peers-and-peer-reservations). If changing the database paths fixes your server' syncing problems, you may want to re-create some of these settings.

1. Stop the `rippled` server if it is running.

        $ sudo systemctl stop rippled

2. Create new empty folders to hold the fresh databases.

        $ mkdir /var/lib/rippled/db_new/
        $ mkdir /var/lib/rippled/db_new/nudb

3. Edit the config file to use the new paths. Be sure to change the `path` field of the `[node_db]` stanza **and** the value of the `[database_path]` stanza.

        [node_db]
        type=NuDB
        path=/var/lib/rippled/db_new/nudb

        [database_path]
         /var/lib/rippled/db_new

    {% include '_snippets/conf-file-location.md' %}<!--_ -->

4. Start the `rippled` server again.

        $ sudo systemctl start rippled

    If the server successfully syncs using the fresh databases, you can delete the folders that hold the old databases. You may also want to check for hardware failures, especially to your disk and RAM.


## See Also

- **Concepts:**
    - [The `rippled` Server](the-rippled-server.html)
    - [Peer Protocol](peer-protocol.html)
    - [Technical FAQ](technical-faq.html)
- **Tutorials:**
    - [Understanding Log Messages](understanding-log-messages.html)
    - [Capacity Planning](capacity-planning.html)
- **References:**
    - [rippled API Reference](rippled-api.html)
        - [peers method][]
        - [server_info method][]
        - [validator_list_sites method][]

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
