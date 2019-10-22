# Configure Full History

In its default configuration, the `rippled` server automatically deletes outdated history of XRP Ledger state and transactions as new ledger versions become available. This is sufficient for most servers, which do not need older history to know the current state and process transactions. However, it can be useful for the network if some servers provide as much history of the XRP Ledger as possible.

## Warnings

Storing full history is expensive. As of 2018-12-11, the full history of the XRP Ledger occupies approximately **9 terabytes** of disk space, which must be entirely stored on fast solid state disk drives for proper server performance. Such a large amount of solid state storage is not cheap, and the total amount of history you must store increases by approximately 12 GB per day.

Acquiring full history from the peer-to-peer network takes a long time (several months) and requires that your server has sufficient system and network resources to acquire older history while keeping up with new ledger progress. To get a faster start on acquiring ledger history, you may want to find another server operator who has a large amount of history already downloaded, who can give you a database dump or at least allow your server to explicitly peer with theirs for a long time to acquire history. The server can load ledger history from a file and verify the integrity of the historical ledgers it imports.

You do not need a full history server to participate in the network, validate transactions, or know the current state of the network. Full history is only useful for knowing the outcome of transactions that occurred in the past, or the state of the ledger at a given time in the past. To get such information, you must rely on other servers having the history you need.

If you want to contribute to storing the history of the XRP Ledger network without storing the full history, you can [configure history sharding](configure-history-sharding.html) to store randomly-selected chunks of ledger history instead.

## Configuration Steps

To configure your server to acquire and store full history, complete the following steps:

1. Stop the `rippled` server if it is running.

        $ sudo systemctl stop rippled

0. Remove (or comment out) the `online_delete` and `advisory_delete` settings from the `[node_db]` stanza of your server's config file, and change the type to `NuDB` if you haven't already:

        [node_db]
      	type=NuDB
      	path=/var/lib/rippled/db/nudb
      	#online_delete=2000
      	#advisory_delete=0

    On a full-history server, you should use NuDB for the ledger store, because RocksDB requires too much RAM when the database is that large. For more information, see [Capacity Planning](capacity-planning.html). You can remove the following performance-related configuration options from the default `[node_db]` stanza, because they only apply to RocksDB: `open_files`, `filter_bits`, `cache_mb`, `file_size_mb`, and `file_size_mult.`

    **Caution:** If you have any history already downloaded with RocksDB, you must either delete that data or change the paths to the databases in the config file when you switch to NuDB. You must change both the `path` field of the `[node_db]` stanza **and** the `[database_path]` (SQLite database) setting. Otherwise, the server may [fail to start](server-wont-start.html#state-db-error).

    {% include '_snippets/conf-file-location.md' %}<!--_ -->

0. Set the `[ledger_history]` stanza of your server's config file to `full`:

        [ledger_history]
        full

0. Set the `[ips_fixed]` stanza of your server's config file to explicitly peer with at least one server that has full history available.

        [ips_fixed]
        169.55.164.20
        50.22.123.215

    Your server can only download historical data from the peer-to-peer network if one its direct peers has the data available. The easiest way to ensure you can download full history is to peer with a server that already has full history.

    **Tip:** Ripple makes a pool of full history servers publicly available. You can resolve the domain `s2.ripple.com` a few times to get the IP addresses of these servers. Ripple offers these servers as a public service, so be aware that their availability to peer with other servers is limited and you may be blocked if you abuse them.

0. If you have a database dump from another full-history server to use as a basis, set the `[import_db]` stanza of your server's config file to point to the data to be imported. (Otherwise, skip this step.)

        [import_db]
      	type=NuDB
      	path=/tmp/full_history_dump/

0. Remove your server's existing database files, if you have any from previously running `rippled`.

    After disabling online deletion, the server ignores any data that was downloaded while online deletion was enabled, so you may as well clear up the disk space. For example:

        rm -r /var/lib/rippled/db/*

    **Warning:** Be sure that you have not put any files you want to keep in the folder before you delete it. It is generally safe to delete all of a `rippled` server's database files, but you should only do this if the configured database folder is not used for anything other than `rippled`'s databases.

0. Start the `rippled` server, importing the database dump if you have one available:

    If you have a database dump to load configured in `[import_db]`, start the server explicitly and include the `--import` [commandline option](commandline-usage.html#daemon-mode-options):

        $ /opt/ripple/bin/rippled --conf /etc/opt/ripple/rippled.cfg --import

    Importing a large database dump may take several minutes or even hours. During this time, the server is not fully started and synced with the network. Watch the server logs to see the status of the import.

    If you are not importing a database dump, start the server normally:

        $ sudo systemctl start rippled

0. If you added an `[import_db]` stanza to your server's config file, remove it after the import completes.

    Otherwise, your server may try to import the same data again the next time it is restarted.

0. Monitor your server's available history with the [server_info method][].

    The range of available ledgers reported in the `complete_ledgers` field should increase over time.

    The earliest available ledger version in the production XRP Ledger's history is ledger index **32570**. The first two weeks or so of ledger history was lost due to a bug in the server at the time. [Test nets and other chains](parallel-networks.html) generally have history going back to ledger index **1**.

## See Also

- **Concepts:**
    - [Ledger History](ledger-history.html)
    - [Consensus Network](consensus-network.html)
    - [rippled Server Modes](rippled-server-modes.html)
- **Tutorials:**
    - [Capacity Planning](capacity-planning.html), particularly [Disk Space](capacity-planning.html#disk-space)
    - [Configure Online Deletion](configure-online-deletion.html)
    - [Diagnosing Problems with rippled](diagnosing-problems.html)
    - [Understanding Log Messages](understanding-log-messages.html)
- **References:**
    - [server_info method][]
    - [can_delete method][]
    - [Ledger Data Formats](ledger-data-formats.html)
    - [rippled Commandline Usage Reference](commandline-usage.html)

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
