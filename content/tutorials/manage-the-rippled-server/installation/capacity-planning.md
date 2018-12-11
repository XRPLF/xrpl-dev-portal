# Capacity Planning

This section describes configuration, network, and hardware recommendations that you can use to tune and optimize the performance of your `rippled` server. Being aware of these considerations can help you ensure that your `rippled` server is ready to handle XRP Ledger network capacity today and in the near future.



## Configuration Settings

Ripple recommends using these configuration guidelines to optimize resource utilization and performance of your `rippled` server.

You can set the following parameters in the `rippled.cfg` file used for your `rippled` server. You can access an example configuration file, `rippled-example.cfg`, in the [`cfg` directory](https://github.com/ripple/rippled/blob/develop/cfg/rippled-example.cfg) in the `rippled` GitHub repo.


### Node Size

Set the `node_size` based on your server's expected load and the amount of memory you can make available to `rippled`.

Ripple recommends you always use the largest node size your available RAM can support. See the following table for recommended settings.

#### Recommendation

Each `node_size` has a corresponding requirement for available RAM. For example, if you set `node_size` to `huge`, you should have at least 32GB of available RAM to help ensure that `rippled` can run smoothly.

To tune your server, it may be useful to start with `tiny` and increase the size to `small`, `medium`, and so on as you refine the requirements for your use case.

| RAM available for `rippled` | `node_size` value | Notes                      |
|:----------------------------|:------------------|:---------------------------|
| < 8GB                       | `tiny`            | Not recommended for testing or production servers. This is the default value if you don't specify a value in `rippled.cfg`. |
| 8GB                         | `small`           | Recommended for test servers. |
| 16GB                        | `medium`          | The `rippled-example.cfg` file uses this value. |
| 32GB                        | `huge`            | Recommended for production servers. |

Although `large` is also a legal value for `[node_size]`, in practice it performs worse than `huge` in most circumstances. Ripple recommends always using `huge` instead of `large`.

If you set the `node_size` parameter to an invalid value, the [server fails to start](server-wont-start.html#bad-node-size-value).


### Node DB Type

The `type` field in the `[node_db]` stanza of the `rippled.cfg` file sets the type of key-value store that `rippled` uses to hold the ledger store.

This setting does not directly configure RAM settings, but the choice of key-value store has important implications for RAM usage because of the different ways these technologies cache and index data for fast lookup.

You can set the value to either `RocksDB` or `NuDB`.

- If your server is a validator, it only needs a small amount of history, so use `RocksDB` for best performance. [Learn more](#more-about-using-rocksdb)

- For most cases, use `NuDB` because its performance is constant even with large amounts of data on disk. A fast SSD is required. [Learn more](#more-about-using-nudb)

- If you are using rotational disks (not recommended) or even just a slow SSD, use `RocksDB`. [Learn more](#more-about-using-rocksdb)

The example `rippled-example.cfg` file has the `type` field in the `[node_db]` stanza set to `RocksDB`.

#### More About Using RocksDB

[RocksDB](https://rocksdb.org/docs/getting-started.html) is an embeddable persistent key-value store that is optimized for rotational disks.

RocksDB requires approximately one-third less disk [storage](#storage) than NuDB and provides better I/O latency. However, the better I/O latency comes as result of the large amount of RAM RocksDB requires to store data indexes.

Validators should be configured to use RocksDB and to store no more than about 300,000 ledgers (approximately two weeks' worth of [historical data](#historical-data)) in the ledger store.

RocksDB has performance-related configuration options that you can set in `rippled.cfg` to achieve maximum transaction processing throughput. Here is the recommended configuration for a `rippled` server using RocksDB:

```
[node_db]
type=RocksDB
path={path_to_ledger_store}
open_files=512
filter_bits=12
cache_mb=512
file_size_mb=64
file_size_mult=2
```

#### More About Using NuDb

[NuDB](https://github.com/vinniefalco/nudb#introduction) is an append-only key-value store that is optimized for SSD drives.

NuDB has nearly constant performance and memory footprints regardless of the amount of data being [stored](#storage). NuDB _requires_ a solid-state drive, but uses much less RAM than RocksDB to access a large database.

Non-validator production servers should be configured to use NuDB and to store the amount of historical data required for the use case.

NuDB does not have performance-related configuration options available in `rippled.cfg`.

#### History Sharding

`rippled` offers a history sharding feature that allows you to store a randomized range of ledgers in a separate shard store. You can use the `[shard_db]` stanza to configure the shard store to use a different type of key-value store than the one you defined for the ledger store using the `[node_db]` stanza. For more information about how to use this feature, see [History Sharding](history-sharding.html).


### Historical Data

The amount of historical data that a `rippled` server keeps online is a major contributor to required storage space. At the time of writing (2018-10-29), a `rippled` server stores about 12GB of data per day and requires 8.4TB to store the full history of the XRP Ledger. You can expect this amount to grow as transaction volume increases across the XRP Ledger network. You can control how much data you keep with the `online_delete` and `advisory_delete` fields.

Online deletion enables the purging of `rippled` ledgers from databases without any disruption of service. It removes only records that are not part of the current ledgers. Data in current ledgers means any data that's used by ledger versions that are new enough not to be deleted. Without online deletion, those databases grow without bounds. Freeing disk space requires stopping the process and manually removing database files. For more information, see [`[node_db]`: `online_delete`](https://github.com/ripple/rippled/blob/develop/cfg/rippled-example.cfg#L832).

<!-- {# ***TODO***: Add link to online_delete section, when complete, per https://ripplelabs.atlassian.net/browse/DOC-1313  #} -->

### Log Level

The example `rippled-example.cfg` file sets the logging verbosity to `warning` in the `[rpc_startup]` stanza. This setting greatly reduces disk space and I/O requirements over more verbose logging. However, more verbose logging provides increased visibility for troubleshooting.

**Caution:** If you omit the `log_level` command from the `[rpc_startup]` stanza, `rippled` writes logs to disk at the `debug` level and outputs `warning` level logs to the console. `debug` level logging requires several more GB of disk space per day than `warning` level, depending on transaction volumes and client activity.



## Network and Hardware

Each `rippled` server in the XRP Ledger network performs all of the transaction processing work of the network. Therefore, the baseline hardware for production `rippled` servers should be similar to that used in Ripple's [performance testing](https://ripple.com/dev-blog/demonstrably-scalable-blockchain/).

Ensuring that your `rippled` server meets these network and hardware requirements helps achieve consistent, good performance across the XRP Ledger network.


### Recommendation

For best performance in enterprise production environments, Ripple recommends running `rippled` on bare metal with the following characteristics:

- Operating System: Ubuntu 16.04+
- CPU: Intel Xeon 3+ GHz processor with 4 cores and hyperthreading enabled
- Disk: SSD (7000+ writes/second, 10,000+ reads/second)
- RAM: 32GB
- Network: Enterprise data center network with a gigabit network interface on the host

#### CPU Utilization and Virtualization

You'll get the best performance on bare metal, but virtual machines can perform nearly as well as long as the host hardware has high enough specs.

#### Storage

Here are some estimated `rippled` storage requirements:

- RocksDB stores around 8GB per day
- NuDB stores around 12GB per day

The amount of data stored per day changes with activity in the network.

You should provision extra storage capacity to prepare for future growth. At the time of writing (2018-10-29), a `rippled` server storing the full history of the XRP Ledger required 8.4TB.

<!-- {# ***TODO: Update the dated storage consideration above, as needed. ***#} -->
<!-- {# ***TODO: DOC-1331 tracks: Create historic metrics that a user can use to derive what will be required. For ex, a chart with 1TB in 2014, 3TB in 2015, 7TB in 2018 ***#} -->

SSD storage should support several thousand of both read and write IOPS. Ripple engineers observed the following maximum reads and writes per second:

- Over 10,000 reads per second (in heavily-used public server clusters)
- Over 7,000 writes per second (in dedicated performance testing)

##### Amazon Web Services

Amazon Web Services (AWS) is a popular virtualized hosting environment. You can run `rippled` in AWS, but Ripple does not recommend using Elastic Block Storage (EBS). Elastic Block Storage's maximum number of IOPS (5,000) is insufficient for `rippled`'s heaviest loads, despite being very expensive.

AWS instance stores (`ephemeral` storage) do not have these constraints. Therefore, Ripple recommends deploying `rippled` servers with host types such as `M3` that have instance storage. The `database_path` and `node_db` path should each reside on instance storage.

**Caution:** AWS instance storage is not guaranteed to provide durability in the event of hard drive failure. You also lose data when you stop/start or reboot the instance. The latter type of data loss can be acceptable for a `rippled` server because an individual server can usually re-acquire the lost data from its peer servers.

#### RAM/Memory

Memory requirements are mainly a function of the `node_size` configuration setting and the amount of client traffic retrieving historical data. For more information about memory requirements, see [Node Size](#node-size).

#### Network

Any enterprise or carrier-class data center should have substantial network bandwidth to support running `rippled` servers.

Here are examples of observed network bandwidth use for common `rippled` tasks:

| Task                                            | Transmit/Receive           |
|:------------------------------------------------|:---------------------------|
| Process current transaction volumes             | 2Mbps transmit, 2 Mbps receive |
| Serve historical ledger and transaction reports | 100Mbps transmit           |
| Start up `rippled`                              | 20Mbps receive             |
