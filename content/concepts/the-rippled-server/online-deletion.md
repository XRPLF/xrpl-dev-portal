# Online Deletion
[[Source]<br/>](https://github.com/ripple/rippled/blob/master/src/ripple/app/misc/SHAMapStoreImp.cpp "Source")

The online deletion feature lets the `rippled` server delete the server's local copy of old ledger versions to keep disk usage from rapidly growing over time. Online deletion happens automatically by default, but can be configured to run only when prompted. [New in: rippled 0.27.0][]

The server always keeps the complete _current_ state of the ledger, with all the balances and settings it contains. The deleted data includes older transactions and versions of the ledger state that are older than the stored history.

The default config file sets the `rippled` server to keep the most recent 2000 ledger versions and automatically delete older data.

**Tip:** Even with online deletion, the amount of disk space required to store the same time span's worth of ledger data increases over time, because the size of individual ledger versions tends to grow over time. This growth is very slow in comparison to the accumulation of data that occurs without deleting old ledgers. For more information on disk space needs, see [Capacity Planning](capacity-planning.html).


## Background

The `rippled` server stores data from recent ledger versions in its _ledger store_. This data accumulates as the XRP Ledger network creates new ledger versions and validates them through the [consensus process](intro-to-consensus.html).

The XRP Ledger stores the complete state of the current ledger, with all balances, settings, and other data, in each ledger version. Unlike many cryptocurrency systems, an XRP Ledger server does not require full history to sync with the network, know the full state, and contribute to making forward progress.

Inside the ledger store, ledger data is "de-duplicated", with data that doesn't change from version to version only stored once. The records themselves in the ledger store do not indicate which ledger version(s) contain them; part of the work of online deletion is identifying which records are only used by outdated ledger versions. This process is time consuming and affects the disk I/O and application cache, so it is not feasible to delete old data on every ledger close.

### Fetching History

When it starts, a `rippled` server's first priority is to get a complete copy of the latest validated ledger. From there, it keeps up with advances in the ledger progress. If configured to do so, the server also backfills ledger history up to a configured amount, which must be equal or less than the cutoff beyond which online deletion is configured to delete.

The server can backfill history from before it became synced, as well as filling in any gaps in the history it has collected after syncing. (Gaps in ledger history can occur if a server temporarily becomes too busy to keep up with the network, loses its network connection, or suffers other temporary issues.) To backfill history, the server requests data from its peer `rippled` servers. The amount the server tries to backfill is defined by the `[ledger_history]` setting.

The XRP Ledger identifies data (on several different levels) by a unique hash of its contents. The XRP Ledger's state data contains a short summary of the ledger's history, in the form of the [LedgerHashes object type](ledgerhashes.html). Servers use the LedgerHashes objects to know which ledger versions to fetch, and to confirm that the ledger data they receive is correct and complete.

Backfilling history is one of the server's lowest priorities, so it may take a long time to fill missing history, especially if the server is busy or has less than sufficient hardware and network specs. For recommendations on hardware specs, see [Capacity Planning](capacity-planning.html). Backfilling history also requires that at least one of the server's direct peers has the history in question. <!--{# TODO: link some info for managing your peer connections when that exists #}-->

### Full History

Some servers in the XRP Ledger network are configured as "full-history" servers. These servers, which require significantly more disk space than other tracking servers, collect all available XRP Ledger history and **do not use online deletion**.

<!--{# TODO: link an eventual "run a full history server" tutorial #}-->

### History Sharding

An alternative to storing the full history of the XRP Ledger on a single expensive machine is to configure many servers to each store a portion of ledger history. The [History Sharding](history-sharding.html) feature makes this possible, storing ranges of ledger history in a separate storage area called the _shard store_. When a peer server asks for specific data (as described in [fetching history](#fetching-history) above), a server can answer using data from either its ledger store or shard store.

Online deletion **does not** delete from the shard store. However, if you configure online deletion to keep at least 32768 ledger versions in your server's ledger store, your server can copy full shards from the ledger store to the shard store before automatically deleting them from the ledger store.

For more information, see [Configure History Sharding](configure-history-sharding.html).


## Online Deletion Behavior

The online deletion settings configure how many ledger versions the `rippled` server should keep available in the ledger store at a time. However, the specified number is a guideline, not a hard rule:

- The server may have less than the configured number of ledger versions if it has not been running for long enough or if it lost sync with the network at any time. (The server attempts to backfill at least some history; see [fetching history](#fetching-history) above for details.)
- The server may store up to twice the configured number of ledger versions if online deletion is set to run automatically. (Each time it runs, it reduces the number of stored ledger versions to the configured number.)
- If advisory delete is enabled, the server stores all the ledger versions that it has acquired and built until someone calls the [can_delete method][].

    For example, if you call `can_delete` with a value of `now` once per day and an `online_delete` value of 2000, the server typically stores 2000 ledger versions at minimum and just over a full day's worth of ledger versions at maximum.

With online deletion enabled and running automatically (that is, with advisory delete disabled), the total amount of ledger data stored should remain at minimum equal to the number of ledger versions the server is configured to keep, with the maximum being roughly twice that many.

When online deletion runs, it does not reduce the size of the database files on disk; it only makes space within those files available to be reused for new data. To actually reduce the disk space allocated to the database files, you must restart `rippled`.

### Interrupting Online Deletion

Online deletion automatically stops if the [server state](rippled-server-states.html) becomes less than `full`. If this happens, the server writes a log message with the prefix `SHAMapStore::WRN`. The server attempts to start online deletion again after the next validated ledger version after becoming fully synced.

If you stop the server or it crashes while online deletion is running, online deletion resumes after the server is restarted and the server becomes fully synced.

To temporarily disable online deletion, you can use the [can_delete method][] with an argument of `never`. This change persists until the server restarts or you re-enable online deletion by calling [can_delete][can_delete method] again. For more information on controlling when online deletion happens, see [Advisory Deletion](#advisory-deletion).


## Configuration

The following settings relate to online deletion:

- **`online_delete`** - Specify a number of validated ledger versions to keep. The server periodically deletes any ledger versions that are older than this number. If not specified, no ledgers are deleted.

    The default config file specifies 2000 for this value. This cannot be less than 256, because some events like [Fee Voting](fee-voting.html) and the [Amendment Process](amendments.html#amendment-process) update only every 256 ledgers.

    **Caution:** If you run `rippled` with `online_delete` disabled, then later enable `online_delete` and restart the server, the server disregards but does not delete existing ledger history that your server already downloaded while `online_delete` was disabled. To save disk space, delete your existing history before re-starting the server with `online_delete` back on.

- **`[ledger_history]`** - Specify a number of validated ledgers, equal to or less than `online_delete`. If the server does not have at least this many validated ledger versions, it attempts to backfill them by fetching the data from peers.

    The default for this setting is 256 ledgers.

    The following diagram shows the relationship between `online_delete` and `ledger_history` settings:

    ![Ledgers older than `online_delete` are automatically deleted. Ledgers newer than `ledger_history` are backfilled. Ledgers in between are kept if available but not backfilled](img/online_delete-vs-ledger_history.png)

- **`advisory_delete`** - If enabled, online deletion is not scheduled automatically. Instead, an administrator must manually trigger online deletion. Use the value `0` for disabled or `1` for enabled.

    This setting is disabled by default.

- **`[fetch_depth]`** - Specify a number of ledger versions. The server does not accept fetch requests from peers for historical data that is older than the specified number of ledger versions. Specify the value `full` to serve any available data to peers.

    The default for `fetch_depth` is `full` (serve all available data).

    The `fetch_depth` setting cannot be higher than `online_delete` if both are specified. If `fetch_depth` is set higher, the server treats it as equal to `online_delete` instead.

    The following diagram shows how fetch_depth works:

    ![Ledger versions older than fetch_depth are not served to peers](img/fetch_depth.png)


### Relation to Real Time

Online deletion settings must be configured in terms of the number of ledger versions, not in terms of real time. You can estimate the amount of time represented by a number of ledger versions using the rate of ledger progress. Ledger versions typically close 3-4 seconds apart, with the overall rate of ledger closures ranging from about 20,000 to 27,000 per day throughout the years 2017-2018. There are hard limits of at least 2 seconds and no more than 20 seconds between ledgers as long as consensus is operating properly.

The following table approximates the requirements for different amounts of history:

| Real Time Amount | Number of Ledger Versions | Disk Space Required (RocksDB) | Disk Space Required (NuDB) |
|:-----------------|:--------------------------|:------------------------------|:--|
| 1 day            | 25,000                    | 8 GB                          | 12 GB |
| 14 days          | 350,000                   | 112 GB                        | 168 GB |
| 30 days          | 750,000                   | 240 GB                        | 360 GB |
| 90 days          | 2,250,000                 | 720 GB                        | 1 TB |
| 1 year           | 10,000,000                | 3 TB                          | 4.5 TB |
| 2 years          | 20,000,000                | 6 TB                          | 9 TB |

These numbers are estimates and depend on several factors:

- The rate of agreement among trusted validators. More disagreement slows the rate of new ledger creation. Disagreement can occur because of random chance, network latency, or validators running different software versions.
- The volume of transactions in the network. A high rate of transactions can increase the work needed to close a new ledger version, reducing the number of separate ledgers closed. An extremely low rate of transactions can also cause ledgers to close further apart (because there is nothing to be done).
- Changes and optimizations to the XRP Ledger's consensus algorithm can affect the speed of consensus and the rate of disagreement either positively or negatively.

### Advisory Deletion

By default, online deletion happens automatically and periodically. If the `advisory_delete` setting is enabled, online deletion only happens when an administrator triggers it using the [can_delete method][]. You can run this command with a scheduled job to trigger automatic deletion based on clock time instead of the number of ledger versions closed.

If your server is heavily used, the extra load from online deletion can cause your server to fall behind and temporarily de-sync from the consensus network. If this is the case, you can use advisory delete and schedule online deletion to happen only during off-peak times.

You can also use advisory delete for other reasons, such as if you want to manually confirm that the transaction data is backed up to a separate server before deleting it.

The `can_delete` API method can enable advisory deletion (with the value `never`) or disable advisory delete (with the value `always`). These setting changes persist until you restart the `rippled` server, at which point the settings in the config file override them.


## See Also

- [can_delete method][] API reference documentation
- [Configure Online Deletion with Advisory Delete](configure-online-deletion.html)





<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
