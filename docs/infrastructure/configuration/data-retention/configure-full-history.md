---
html: configure-full-history.html
parent: data-retention.html
seo:
    description: Configure an xrpld server to acquire and store the full history of the XRP Ledger.
labels:
  - Core Server
  - Data Retention
---
# Configure Full History

In its default configuration, the `xrpld` (formerly `rippled`) server deletes outdated ledger history as new ledger versions become available. That is correct for almost every server. A small number of servers instead retain **full history** - every ledger version back to index 32570 - so that the network's past remains publicly answerable.

This page is the configuration procedure. Read [Full History System Requirements](../../prerequisites/system-requirements/full-history.md) first for the scale (about 44 TB in 2026, growing 400 to 500 GB per month) and the economics, and [Full History Best Practices](../best-practices/full-history.md) for why one server isn't enough.

## Warnings

- **Storage:** the full dataset must live on fast solid-state storage. The NuDB store is a single file beyond ext4's 16 TiB (about 17.6 TB) single-file limit, so use XFS (recommended) or ZFS.
- **The SQLite ceiling:** `transaction.db` has a hard maximum size fixed by its page size at creation - about 17.6 TB at the default. **You must set the page size before the server first creates its databases** (step 2 below). Changing it later means rebuilding a multi-terabyte database; see [Fix SQLite Transaction Database Page Size](../../troubleshooting/fix-sqlite-tx-db-page-size-issue.md).
- **Acquisition:** downloading full history from the open peer-to-peer network isn't a realistic path - historical backfill is the server's lowest-priority work. Plan to import a database dump or copy from an existing full history server (its operator must **stop that server during the copy**; the store can't be copied hot).

If you transfer a database dump via Amazon S3, keep in mind that S3 limits individual objects to about 5 TB. This can be smaller than a full-history `nudb.dat` file, so split the file into smaller pieces before uploading. For example:

```
split -b 1000000000000 --numeric-suffixes=1 nudb.dat /var/lib/xrpld/split/nudb.dat
```

A full dump consists of `ledger.db`, `transaction.db`, `nudb/nudb.key`, and the split `nudb/nudb.dat01`, `nudb/nudb.dat02`, and so on pieces. After downloading, join the pieces back into one `nudb/nudb.dat` in order before you point `[import_db]` at the folder, for example `cat nudb.dat[0-9]* > nudb.dat`. Joining needs as much free space again as the pieces take up, until you delete them. `--import` reads only the node store named in `[import_db]` and writes every object into the new store. It doesn't import `ledger.db` or `transaction.db`.

## Configuration steps

To configure your server to acquire and store full history, complete the following steps:

1. Stop the `xrpld` server if it is running.

    ```
    $ sudo systemctl stop xrpld
    ```

0. Add a `[sqlite]` stanza setting the transaction database page size, **before the server ever creates its databases**:

    ```
    [sqlite]
    page_size=32768
    ```

    This raises the `transaction.db` ceiling from about 17.6 TB to about 140 TB (65536, the maximum, gives about 281 TB). It must be a power of two between 512 and 65536, and it only takes effect when the database is created (or rebuilt).

0. Remove (or comment out) the `online_delete` and `advisory_delete` settings from the `[node_db]` stanza of your server's config file, and make sure the type is `NuDB`:

    ```
    [node_db]
    type=NuDB
    path=/var/lib/xrpld/db/nudb
    #online_delete=300000
    #advisory_delete=0
    ```

    Full history requires NuDB; RocksDB needs too much memory at this size. If switching from RocksDB, remove its tuning keys (`open_files`, `filter_bits`, `cache_mb`, `file_size_mb`, `file_size_mult`), and either delete the old data or change both the `[node_db]` `path` and the `[database_path]`, or the server may [fail to start](../../troubleshooting/server-wont-start.md#state-db-error).

    {% partial file="/docs/_snippets/conf-file-location.md" /%}

0. Set the `[ledger_history]` stanza to `full`:

    ```
    [ledger_history]
    full
    ```

0. Set the `[ips_fixed]` stanza to explicitly peer with at least one full history server. This is for closing the gap between the last ledger in your dump or copy and the current ledger, not for acquiring the dataset: your server can only download historical data from a direct peer that has it, and backfill from the network doesn't reach full history in practice (see the warning above).

    ```
    [ips_fixed]
    full-history.example.net 51235
    ```

    {% admonition type="success" name="Tip" %}Ripple makes a pool of full history servers publicly available: add `s2.ripple.com 51235` to `[ips_fixed]` to reach them. They are a shared public service with limited peering capacity, so use them considerately - for filling bounded gaps, not as the plan for acquiring the whole dataset. For your first connections generally, see [Connect to Public Hubs](../peering/connect-to-public-hubs.md).{% /admonition %}

0. If you have a database dump from another full history server, set `[import_db]` to point at it. (Otherwise, skip this step.) For datasets this size, physically shipping drives is often the fastest transfer.

    ```
    [import_db]
    type=NuDB
    path=/data/full_history_dump/nudb
    ```

    The path is the folder that holds `nudb.dat` and `nudb.key`, not the folder above it: the server opens `<path>/nudb.dat`, and if that file isn't there it creates an empty store at the path and imports nothing.

0. Remove your server's existing database files, if any. After disabling online deletion, previously downloaded data isn't used, so reclaim the space:

    ```
    rm -r /var/lib/xrpld/db/*
    ```

    {% admonition type="danger" name="Warning" %}Only do this if the configured database folder holds nothing but `xrpld`'s databases.{% /admonition %}

0. Start the server, importing the dump if you have one:

    ```
    $ sudo -u xrpld /usr/bin/xrpld --conf /etc/xrpld/xrpld.cfg --import
    ```

    An import rewrites each object, so it takes much longer than copying the files. The server isn't synced until it completes. Watch the logs. Without a dump or a copy of an existing store, the server won't reach full history in practice; see [Full History Best Practices](../best-practices/full-history.md). To start without `--import`:

    ```
    $ sudo systemctl start xrpld
    ```

0. If you added `[import_db]`, remove it after the import completes. The server imports only when started with `--import`, so the stanza has no further use.

0. Monitor available history with the [server_info method][]: `complete_ledgers` should grow toward `32570-<current>`. The earliest available Mainnet ledger is index **32570** - the first two weeks of history were lost to an early server bug. [Test networks](../../../concepts/networks-and-servers/parallel-networks.md) generally have history from ledger index **1**.

## See Also

- **Concepts:**
    - [Ledger History](../../../concepts/networks-and-servers/ledger-history.md)
- **Tutorials:**
    - [Full History System Requirements](../../prerequisites/system-requirements/full-history.md)
    - [Full History Best Practices](../best-practices/full-history.md)
    - [Fix SQLite Transaction Database Page Size](../../troubleshooting/fix-sqlite-tx-db-page-size-issue.md)
    - [Configure Online Deletion](configure-online-deletion.md)
- **References:**
    - [server_info method][]
    - [xrpld Commandline Usage Reference](../../commandline-usage.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
