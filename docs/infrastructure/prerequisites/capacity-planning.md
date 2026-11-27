---
seo:
    description: Plan system specs and tune configuration for xrpld in production environments.
labels:
  - Core Server
  - Data Retention
---
# Capacity Planning

This document describes configuration, network, and hardware recommendations that you can use to tune and optimize the performance of an XRP Ledger server.

The load on an XRP Ledger server varies based on multiple factors. One is the activity in the network. The total size of data in the shared ledger and the total volume of transactions being sent vary based on organic factors throughout the global XRP Ledger community. Another factor is API usage; different types of [API calls](../../references/http-websocket-apis/index.md) put different load on the server. The performance characteristics can be very different between servers that provide a public API, provide a private API to specific integration software, or provide no API at all.

You should consider these factors to ensure that your server has the capacity to handle XRP Ledger network activity today and in the future.



## Configuration Settings

The default configuration file contains settings for a broad range of common use cases. You can get better performance by customizing the settings for your specific hardware and intended usage pattern.

The settings in this section are parameters in the `xrpld.cfg` file. You can access an example config file, `xrpld-example.cfg`, in the {% source-link name="cfg directory" path="cfg/xrpld-example.cfg" /%} in the `rippled` GitHub repo. The settings in the example config file match the default config installed alongside the server.


### Node Size

The `[node_size]` parameter should match the overall hardware capacity of your server. You can omit this parameter to have the server automatically choose an appropriate setting based on the system's total RAM and number of CPU threads. You can set this value explicitly if the automatic setting is wrong for your system, for example if some of the system's RAM or threads need to be set aside for other software, or the amounts reported by the operating system are inaccurate. (This can occur in some containers.) To see which value a running server is using, call the [server_info method][] on an admin connection; the response's `node_size` field reports it. The public form of the call omits the field.

As a general rule, you should always use the largest node size your available RAM can support. See the following table for recommended settings.

#### Recommendation

Each `[node_size]` has a comfortable host size. `huge` runs on 32 GB hosts in production; 64 GB is the comfortable build. The table is a guide to host sizing, not a list of hard requirements: the server auto-selects `huge` from 24 GB of RAM upward when it has 8 or more hardware threads.

To tune your server, it may be useful to start with `tiny` and increase the size to `small`, `medium`, and so on as you refine the requirements for your use case.

| Comfortable host RAM | `node_size` value | Notes                                    |
|:--------------|:------------------|:-----------------------------------------|
| < 8 GB        | `tiny`            | **Not recommended.** A server with this setting may not sync to a busy network. |
| 8 GB          | `small`           | Recommended for test servers that only need to run occasionally. |
| 16 GB         | `medium`          | The most a 4-thread host auto-selects, whatever its RAM; see the thread rule below. A 16 GB host with 6 or more threads auto-selects `large`. |
| 32 GB         | `large` or `huge` | `large` performs comparably to `huge` in measured tests. Most production validators run `huge`, including on 32 GB hosts. |
| 64 GB         | `huge`            | Recommended for production servers.      |

If you set the `[node_size]` parameter to an invalid value, the [server fails to start](../troubleshooting/server-wont-start.md#bad-node_size-value).

The RAM figures above describe a comfortable host size for each setting, not the process footprint, which is about 12 to 16 GB at `huge` on a stock server and 13 to 18 GB on a validator. The example configuration ships no live `[node_size]` line. When it is omitted, the server selects a value from the RAM it sees at startup (under 6 GB `tiny`, under 8 `small`, under 12 `medium`, under 24 `large`, otherwise `huge`) and then caps the result at half the hardware thread count, so a 4-thread host never auto-selects above `medium` and `huge` needs 8 threads; see [Node size](system-requirements/validator.md#node-size). A proposed change to the core server (XRPLF/rippled [#7965](https://github.com/XRPLF/rippled/pull/7965)) would replace `node_size` with a memory limit.


### Node DB Type

The `type` field in the `[node_db]` stanza of the `xrpld.cfg` file sets the type of key-value store that `xrpld` uses to hold the ledger store.

For almost all purposes, use `NuDB`. A fast SSD is required. [Learn more](#more-about-using-nudb)

The `RocksDB` setting is available for legacy purposes, but is generally not recommended. [Learn more](#more-about-using-rocksdb)

The example `xrpld-example.cfg` file has the `type` field in the `[node_db]` stanza set to `NuDB`.

#### More About Using NuDB

[NuDB](https://github.com/vinniefalco/nudb#introduction) is an append-only key-value store that is optimized for SSD drives.

NuDB has nearly constant performance and memory footprints regardless of the [amount of data being stored](#disk-space). NuDB _requires_ a solid-state drive. Scalability testing has shown that NuDB has equivalent or better performance than RocksDB in production and comparable configurations.

Production servers should be configured to use NuDB and to store the amount of historical data required for your use case.

Here is an example `[node_db]` configuration for an `xrpld` server using NuDB, with the retention the shipped `xrpld-example.cfg` uses:

```
[node_db]
type=NuDB
path=/var/lib/xrpld/db/nudb
online_delete=512
advisory_delete=0
```

Adjust the `path` to the directory where you want to keep the ledger store on disk. Adjust the `online_delete` and `advisory_delete` settings as desired for your configuration. For more details about these settings, see [Configure Online Deletion](../configuration/data-retention/configure-online-deletion.md) and [Configure Advisory Deletion](../configuration/data-retention/configure-advisory-deletion.md).

NuDB uses a 4096-byte (4K) block size by default. You can change the block size with the optional `nudb_block_size` field, using any power of 2 between `4096` and `32768` bytes. {% badge href="https://xrpl.org/blog/2026/xrpld-3.2.0" %}New in: xrpld 3.2.0{% /badge %}

Test non-default block sizes to find what works best for your hardware before using them in production.

{% admonition type="warning" name="Caution" %}You can only set the block size when NuDB creates a new database. To change it afterward, you must delete the existing ledger store and let the server rebuild it.{% /admonition %}

#### More About Using RocksDB

[RocksDB](https://rocksdb.org/docs/getting-started.html) is a persistent key-value store built into `xrpld`. **Support for RocksDB is considered legacy.** Servers using RocksDB usually struggle to maintain sync with the Mainnet due to the memory requirements of maintaining a large database. Generally, you should use NuDB instead.

Cases where you might use RocksDB include if you need to load historical data saved in RocksDB format, or if you are storing data on slow SSDs or rotational disks. While rotational disks won't be able to keep up with Mainnet, you can probably run offline tests or small private networks on them.

RocksDB has performance-related configuration options that you can tweak for more transaction processing throughput. Here is an example `[node_db]` configuration for RocksDB:

```
[node_db]
type=RocksDB
path=/var/lib/xrpld/db/rocksdb
open_files=512
filter_bits=12
cache_mb=512
file_size_mb=64
file_size_mult=2
online_delete=512
advisory_delete=0
```

(Adjust the `path` to the directory where you want to keep the ledger store on disk. Adjust the `online_delete` and `advisory_delete` settings as desired for your configuration.)

### Transaction Tables

The `use_tx_tables` parameter in the `[ledger_tx_tables]` stanza controls whether `xrpld` maintains the SQLite transaction and account transaction tables. The default is `1` (enabled).

Set `use_tx_tables` to `0` to stop writing to these tables and improve throughput. This is useful for any `xrpld` server running in peer-to-peer mode that doesn't need to answer [tx method][] or [account_tx method][] requests.

```
[ledger_tx_tables]
use_tx_tables=0
```

{% admonition type="warning" name="Caution" %}Disabling `use_tx_tables` also causes the server to reject [tx method][] or [account_tx method][] requests.{% /admonition %}

### Log Level

The example `xrpld-example.cfg` file sets the logging verbosity to `warning` in the `[rpc_startup]` stanza. This setting greatly reduces disk space and I/O requirements over more verbose logging. However, more verbose logging provides increased visibility for troubleshooting.

{% admonition type="warning" name="Caution" %}If you omit the `log_level` command from the `[rpc_startup]` stanza, a server with a `[debug_logfile]` (as the packaged config has) writes logs at the `debug` level, and the same lines go to the file and to the console; there is no separate console level, and the packaged service passes `--silent` to suppress console output. Without a `[debug_logfile]` the threshold is `info` and nothing is written to disk. Logging at the `debug` level requires several more GB of disk space per day than `warning` level, depending on transaction volumes and client activity.{% /admonition %}


## Network and Hardware

Each server in the XRP Ledger network performs all of the transaction processing work of the network. Total activity on the network varies but has mostly increased over time, so you should choose hardware with greater capacity than you need for the current network activity.

### Recommendation

See [System Requirements](system-requirements/index.md), then the page for your role, for the recommended hardware specs.

#### CPU Utilization and Virtualization
<!-- STYLE_OVERRIDE: utilization -->

You'll get the best performance on bare metal, but virtual machines can perform nearly as well as long as the host hardware has high enough specs.

#### Disk Speed

The speed of storage is one of the most important factors in a server's capacity. Use a high-grade solid state disk drive (SSD) with low-latency random reads and high throughput. Ripple engineers have observed the following maximum reads and writes per second:

- Over 10,000 reads per second (in heavily-used public server clusters)
- Over 7,000 writes per second (in dedicated performance testing)

<!--{# TODO 2021-11: have bigger numbers been seen lately? These might need an update #}-->

#### Disk Space

The `[node_db]` stanza controls the server's _ledger store_, which holds [ledger history](../../concepts/networks-and-servers/ledger-history.md). The amount of disk space you need depends on how much history you plan to keep available locally. An XRP Ledger server doesn't need to store more than the most recent 256 ledger versions to follow the consensus process and report the complete state of the ledger, but you can only query your server for transactions that executed in ledger versions it has stored locally. Configure the `path` of the `[node_db]` to point to your chosen storage location for the ledger store.

You can control how much data you keep with [online deletion](../configuration/data-retention/online-deletion.md); the default config file has the server keep the latest 512 ledger versions, about half an hour. About a day (25,000 ledgers) is the recommended floor for anything that serves clients; see [Minimal Configurations](../configuration/minimal-configurations.md). Without online deletion, the server's disk requirements grow without bounds.

The size of the ledger store follows from a rule, not a table. Peak NuDB size = measured MB per ledger x the number of ledgers between rotations x 2. The factor of 2 is there because online deletion keeps two copies of the store until the next rotation, so the peak comes right before one.

Measure MB per ledger on your own server and write down the date, because it moves with network activity; one production validator measured 0.65 to 1.3 MB per ledger over 16 rotations in late 2026. Count the ledgers between rotations from the real schedule. With `advisory_delete=0` that is about `online_delete`; with a scheduled `can_delete` it is whatever the schedule allows. Don't scale a figure measured at one `online_delete` setting to another: each rotation copies the current state forward, so the cost per ledger changes with the interval.

Add the SQLite databases in `[database_path]`: about 0.3 to 0.4 MB per ledger of the range they hold, which reaches about two rotation intervals. They don't shrink when rows are deleted, although SQLite reuses the freed space. Keep at least 30% of the volume free on top of the peak.

[Validator System Requirements](system-requirements/validator.md#disk) has a worked example with measured figures. For the other roles, see [Stock Node System Requirements](system-requirements/stock-node.md), [Hub System Requirements](system-requirements/hub.md), and [Full History System Requirements](system-requirements/full-history.md), which carries a measured full history store of about 44 TB.

For instructions on how to change the amount of history you keep, see [Configure Online Deletion](../configuration/data-retention/configure-online-deletion.md).

The `[database_path]` configures separate bookkeeping databases: these include transaction data as well as some runtime configurations.

As a general rule, you can delete the database files (both the ledger store and the bookkeeping databases) for an `xrpld` server when it isn't running; this clears any stored ledger history the server has, but it can re-acquire that data from the network. However, if you delete the `wallet.db` file in the `[database_path]`, the server creates a new node identity (unless `[node_seed]` is set) and you must manually reapply runtime configuration changes such as [amendment votes](../configuration/configure-amendment-voting.md) and [peer reservations](../configuration/peering/use-a-peer-reservation.md). Servers that list your old node key, in `[cluster_nodes]` or in a peer reservation, no longer recognize you.

If your config file has a `[shard_db]` stanza, you can safely remove it. This section is obsolete and has no effect. {% badge href="https://github.com/XRPLF/rippled/releases/tag/2.3.0" %}Removed in: rippled 2.3.0{% /badge %}


##### Amazon Web Services

Amazon Web Services (AWS) is a popular virtualized hosting environment. You can run `xrpld` in AWS, but don't use Elastic Block Storage (EBS). See [Stock Node System Requirements](system-requirements/stock-node.md). <!-- SPELLING_IGNORE: ebs, aws -->

AWS instance stores (`ephemeral` storage) provide suitable performance, but you may lose data in some circumstances, including when you start/stop an instance. This may be acceptable, since an individual XRP Ledger server can usually re-acquire lost ledger history from its peers. Configuration settings should be stored on more permanent storage.

Make sure the `path` of your `[node_db]` stanza and your `[database_path]` both point to the appropriate storage.

#### RAM/Memory

Memory requirements are mainly a function of the `node_size` configuration setting and the amount of client traffic retrieving historical data. For more information about memory requirements, see [Node Size](#node-size).

#### Network

Any enterprise or carrier-class data center should have enough network bandwidth to support running XRP Ledger servers. The actual bandwidth necessary varies significantly based on the current transaction volume in the network. Server behavior (such as backfilling [ledger history](../../concepts/networks-and-servers/ledger-history.md)) also affects network use.

During exceptionally high periods of transaction volume, some operators have reported that their servers have completely saturated a 100 megabit/s network link, so a gigabit network interface is required for reliable performance.

Here are examples of observed uncompressed network bandwidth use for common tasks:

| Task                                            | Send/Receive           |
|:------------------------------------------------|:-----------------------|
| Process average transaction volumes             | 2 Mbps up, 2 Mbps down |
| Process peak transaction volumes                | >100 Mbps up           |
| Serve historical ledger and transaction reports | 100 Mbps up            |
| Start up `xrpld`                              | 20 Mbps down           |

You can save bandwidth by [enabling compression on peer-to-peer communications](../configuration/peering/enable-link-compression.md), at a cost of higher CPU. Many hardware configurations have spare CPU capacity during normal use, so this can be an economical option if your network bandwidth is limited.


## See Also

- **Concepts:**
    - [The `xrpld` Server](../../concepts/networks-and-servers/index.md)
    - [Consensus](../../concepts/consensus-protocol/index.md)
- **Tutorials:**
    - [Configure xrpld](../configuration/index.md)
        - [Configure Online Deletion](../configuration/data-retention/configure-online-deletion.md) - Adjust how many historical ledger versions your server should keep at a time.
    - [Troubleshoot xrpld](../troubleshooting/index.md)
- **References:**
    - [xrpld API Reference](../../references/http-websocket-apis/index.md)
        - [`xrpld` Commandline Usage](../commandline-usage.md)
        - [logrotate method][] - Closes and reopens the server's debug log so you can rotate it with standard tools.
        - [server_info method][] - General information about the server including sync status and how many historical ledger versions it has available on disk.
        - [get_counts method][] - Additional health information, especially how many objects of various types it holds in RAM.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
