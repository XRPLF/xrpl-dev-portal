---
html: capacity-planning.html
parent: install-rippled.html
blurb: Plan system specs and tune configuration for rippled in production environments.
labels:
  - Core Server
  - Data Retention
---
# Capacity Planning

This document describes configuration, network, and hardware recommendations that you can use to tune and optimize the performance of an XRP Ledger server.

The load on an XRP Ledger server varies based on multiple factors. One is the activity in the network. The total size of data in the shared ledger and the total volume of transactions being sent vary based on organic factors throughout the global XRP Ledger community. Another factor is API usage; different types of [API calls](http-websocket-apis.html) put different load on the server. The performance characteristics can be very different between servers that provide a public API, provide a private API to specific integration software, or provide no API at all.

You should consider these factors to ensure that your server has the capacity to handle XRP Ledger network activity today and in the future.



## Configuration Settings

The default configuration file contains settings for a broad range of common use cases. You can get better performance by customizing the settings for your specific hardware and intended usage pattern.

The settings in this section are parameters in the `rippled.cfg` file. You can access an example config file, `rippled-example.cfg`, in the [`cfg` directory](https://github.com/ripple/rippled/blob/develop/cfg/rippled-example.cfg) in the `rippled` GitHub repo. The settings in the example config file match the default config installed alongside the server.


### Node Size

The `[node_size]` parameter should match the overall hardware capacity of your server. You can omit this parameter to have the server automatically choose an appropriate setting based on the system's total RAM and number of CPU threads. You can set this value explicitly if the automatic setting is wrong for your system, for example if some of the system's RAM or threads need to be set aside for other software, or the amounts reported by the operating system are inaccurate. (This can occur in some containers.) [Updated in: rippled 1.8.1][]

As a general rule, you should always use the largest node size your available RAM can support. See the following table for recommended settings.

#### Recommendation

Each `[node_size]` has a corresponding requirement for available RAM. For example, if you set `[node_size]` to `huge`, you should have at least 32 GB of available RAM to help ensure that `rippled` can run smoothly.

To tune your server, it may be useful to start with `tiny` and increase the size to `small`, `medium`, and so on as you refine the requirements for your use case.

| RAM available | `node_size` value | Notes                                    |
|:--------------|:------------------|:-----------------------------------------|
| < 8 GB        | `tiny`            | **Not recommended.** A server with this setting may not sync to a busy network. |
| 8 GB          | `small`           | Recommended for test servers that only need to run occasionally. |
| 16 GB         | `medium`          | The `rippled-example.cfg` file uses this value. |
| 32 GB         | `large`           | **Not recommended.** In practice, this setting performs worse than `huge` in most circumstances. Always use `huge` if you want stability. |
| 64 GB         | `huge`            | Recommended for production servers.      |

If you set the `[node_size]` parameter to an invalid value, the [server fails to start](server-wont-start.html#bad-node_size-value).


### Node DB Type

The `type` field in the `[node_db]` stanza of the `rippled.cfg` file sets the type of key-value store that `rippled` uses to hold the ledger store.

This setting does not directly configure RAM settings, but the choice of key-value store has important implications for RAM usage because of the different ways these technologies cache and index data for fast lookup.

- For most cases, use `NuDB` because its performance is constant even with large amounts of data on disk. A fast SSD is required. [Learn more](#more-about-using-nudb)

- If you are using rotational disks (not recommended) or an unusually slow SSD, use `RocksDB`. You should avoid this setting for production servers. [Learn more](#more-about-using-rocksdb)

The example `rippled-example.cfg` file has the `type` field in the `[node_db]` stanza set to `NuDB`.

#### More About Using RocksDB

[RocksDB](https://rocksdb.org/docs/getting-started.html) is an persistent key-value store built into `rippled`.

**Caution:** As of late 2021, the total size of the ledger has grown large enough that servers using RocksDB often struggle to maintain sync with the Mainnet. Large amounts of RAM can help, but you should generally use NuDB instead.

RocksDB is intended to work on either solid-state disks or rotational disks. It requires approximately one-third less [disk storage](#disk-space) than NuDB and provides better I/O latency. However, the better I/O latency comes as result of the large amount of RAM RocksDB requires to store data indexes.

RocksDB has performance-related configuration options that you can tweak for more transaction processing throughput. Here is a recommended `[node_db]` configuration for RocksDB:

```
[node_db]
type=RocksDB
path=/var/lib/rippled/db/rocksdb
open_files=512
filter_bits=12
cache_mb=512
file_size_mb=64
file_size_mult=2
online_delete=2000
advisory_delete=0
```

(Adjust the `path` to the directory where you want to keep the ledger store on disk. Adjust the `online_delete` and `advisory_delete` settings as desired for your configuration.)

#### More About Using NuDb

[NuDB](https://github.com/vinniefalco/nudb#introduction) is an append-only key-value store that is optimized for SSD drives.

NuDB has nearly constant performance and memory footprints regardless of the [amount of data being stored](#disk-space). NuDB _requires_ a solid-state drive, but uses much less RAM than RocksDB to access a large database.

Production servers should be configured to use NuDB and to store the amount of historical data required for the use case.

NuDB does not have performance-related configuration options available in `rippled.cfg`. Here is the recommended `[node_db]` configuration for a `rippled` server using NuDB:

```
[node_db]
type=NuDB
path=/var/lib/rippled/db/nudb
online_delete=2000
advisory_delete=0
```

(Adjust the `path` to the directory where you want to keep the ledger store on disk. Adjust the `online_delete` and `advisory_delete` settings as desired for your configuration.)


### Log Level

The example `rippled-example.cfg` file sets the logging verbosity to `warning` in the `[rpc_startup]` stanza. This setting greatly reduces disk space and I/O requirements over more verbose logging. However, more verbose logging provides increased visibility for troubleshooting.

**Caution:** If you omit the `log_level` command from the `[rpc_startup]` stanza, the server writes logs to disk at the `debug` level and outputs `warning` level logs to the console. Logging at the `debug` level requires several more GB of disk space per day than `warning` level, depending on transaction volumes and client activity.


## Network and Hardware

Each server in the XRP Ledger network performs all of the transaction processing work of the network. Total activity on the network varies but has mostly increased over time, so you should choose hardware with greater capacity than you need for the current network activity.

### Recommendation

See [System Requirements](system-requirements.html) for a summary of the recommended hardware specs.

#### CPU Utilization and Virtualization
<!-- STYLE_OVERRIDE: utilization -->

You'll get the best performance on bare metal, but virtual machines can perform nearly as well as long as the host hardware has high enough specs.

#### Disk Speed

The speed of storage is one of the most important factors in a server's capacity. Use a high-grade solid state disk drive (SSD) with low-latency random reads and high throughput. Ripple engineers have observed the following maximum reads and writes per second:

- Over 10,000 reads per second (in heavily-used public server clusters)
- Over 7,000 writes per second (in dedicated performance testing)

<!--{# TODO 2021-11: have bigger numbers been seen lately? These might need an update #}-->

#### Disk Space

The `[node_db]` stanza controls the server's _ledger store_, which holds [ledger history](ledger-history.html). The amount of disk space you need depends on how much history you plan to keep available locally. An XRP Ledger server does not need to store more than the most recent 256 ledger versions to follow the consensus process and report the complete state of the ledger, but you can only query your server for transactions that executed in ledger versions it has stored locally. Configure the `path` of the `[node_db]` to point to your chosen storage location for the ledger store.

You can control how much data you keep with [online deletion](online-deletion.html); the default config file has the server keep the latest 2000 ledger versions. Without online deletion, the server's disk requirements grow without bounds.

The following table approximates the requirements for different amounts of history, at the time of writing (2018-12-13):

| Real Time Amount | Number of Ledger Versions | Disk Space Required (RocksDB) | Disk Space Required (NuDB) |
|:-----------------|:--------------------------|:------------------------------|:--|
| 2 hours          | 2,000                     | 250 MB                        | 450 MB |
| 1 day            | 25,000                    | 8 GB                          | 12 GB |
| 14 days          | 350,000                   | 112 GB                        | 168 GB |
| 30 days          | 750,000                   | 240 GB                        | 360 GB |
| 90 days          | 2,250,000                 | 720 GB                        | 1 TB |
| 1 year           | 10,000,000                | 3 TB                          | 4.5 TB |
| 2 years          | 20,000,000                | 6 TB                          | 9 TB |
| Full history (as of 2022-12-18) | 76,500,000+    | (Not recommended)             | ~22.3 TB |

These numbers are estimates. They depend on several factors, most importantly the volume of transactions in the network. As transaction volume increases, each ledger version stores more unique data. You should provision extra storage capacity to prepare for future growth.

The `online_delete` setting tells the server how many ledger versions to keep after deleting old history. You should plan for enough disk space to store twice that many ledger versions at maximum (right before online deletion runs).

For instructions on how to change the amount of history you keep, see [Configure Online Deletion](configure-online-deletion.html).

The `[database_path]` configures separate bookkeeping databases: these include transaction data as well as some runtime configurations.

As a general rule, you can safely delete the database files (both the ledger store and the bookkeeping databases) for a `rippled` server when it isn't running; this clears any stored ledger history the server has, but it can re-acquire that data from the network. However, if you delete the `wallet.db` file in the `[database_path]`, you must manually reapply runtime configuration changes such as [amendment votes](configure-amendment-voting.html) and [peer reservations](use-a-peer-reservation.html).

If you want to contribute to storing ledger history but you do not have enough disk space to store full history, you can use the [History Sharding](history-sharding.html) feature to store a randomized range of ledgers in a separate shard store. History sharding is configured in the `[shard_db]` stanza.


##### Amazon Web Services

Amazon Web Services (AWS) is a popular virtualized hosting environment. You can run `rippled` in AWS, but do not use Elastic Block Storage (EBS). See [System Requirements](system-requirements.html). <!-- SPELLING_IGNORE: ebs, aws -->

AWS instance stores (`ephemeral` storage) provide suitable performance, but you may lose data in some circumstances, including when you start/stop an instance. This may be acceptable, since an individual XRP Ledger server can usually re-acquire lost ledger history from its peers. Configuration settings should be stored on more permanent storage.

Make sure the `path` of your `[node_db]` stanza and your `[database_path]` both point to the appropriate storage.

#### RAM/Memory

Memory requirements are mainly a function of the `node_size` configuration setting and the amount of client traffic retrieving historical data. For more information about memory requirements, see [Node Size](#node-size).

#### Network

Any enterprise or carrier-class data center should have enough network bandwidth to support running XRP Ledger servers. The actual bandwidth necessary varies significantly based on the current transaction volume in the network. Server behavior (such as backfilling [ledger history](ledger-history.html)) also affects network use. Consumer-grade home internet is generally not enough to run a reliable server.

During exceptionally high periods of transaction volume, some operators have reported that their servers have completely saturated a 100 megabit/s network link, so a gigabit network interface is required for reliable performance.

Here are examples of observed uncompressed network bandwidth use for common tasks:

| Task                                            | Send/Receive           |
|:------------------------------------------------|:-----------------------|
| Process average transaction volumes             | 2 Mbps up, 2 Mbps down |
| Process peak transaction volumes                | >100 Mbps up           |
| Serve historical ledger and transaction reports | 100 Mbps up            |
| Start up `rippled`                              | 20 Mbps down           |

You can save bandwidth by [enabling compression on peer-to-peer communications](enable-link-compression.html), at a cost of higher CPU. Many hardware configurations have spare CPU capacity during normal use, so this can be an economical option if your network bandwidth is limited.


## See Also

- **Concepts:**
    - [The `rippled` Server](xrpl-servers.html)
    - [Introduction to Consensus](intro-to-consensus.html)
- **Tutorials:**
    - [Configure rippled](configure-rippled.html)
        - [Configure Online Deletion](configure-online-deletion.html) - Adjust how many historical ledger versions your server should keep at a time.
    - [Troubleshoot rippled](troubleshoot-the-rippled-server.html)
- **References:**
    - [rippled API Reference](http-websocket-apis.html)
        - [`rippled` Commandline Usage](commandline-usage.html)
        - [logrotate method][] - Closes and reopens the server's debug log so you can rotate it with standard tools.
        - [server_info method][] - General information about the server including sync status and how many historical ledger versions it has available on disk.
        - [get_counts method][] - Additional health information, especially how many objects of various types it holds in RAM.

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
