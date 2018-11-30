# Capacity Planning

This section describes some of the challenges related to scaling `rippled` servers for testing and production deployments. Additionally, it describes how hardware and configuration settings relate to those challenges. Finally, this section offers recommendations to assist you in properly setting up `rippled` to meet the goals for the use case of your deployment.

Even the most minimally functional `rippled` server must contain the most recently validated ledger versions to submit transactions to the network and verify the integrity of the XRP Ledger. Beyond these requirements, consider the following possible business needs:

- Handling ever-increasing transaction volume
- Servicing transaction reporting information to clients
- Maintaining varying amounts of historical data

To meet your `rippled` capacity requirements, you must address these technical factors:

- The [configuration settings](#configuration-settings) that affect resource utilization
- The [network and hardware](#network-and-hardware) requirements to achieve consistent, good performance across the XRP Ledger network



## Configuration Settings

Ripple recommends using these configuration guidelines to optimize performance of your `rippled` server.

You can set the following parameters in the `rippled.cfg` file used for your `rippled` server. You can access an example configuration file, `rippled-example.cfg`, in the [`cfg` directory](https://github.com/ripple/rippled/blob/develop/cfg/rippled-example.cfg) in the `rippled` GitHub repo.


### Node Size

Set the `node_size` based on your server's expected load and the amount of memory you can make available to `rippled`.

The node size is talking about how big of an object to treat as one "node" in the ledger's underlying tree structure. It's not directly configuring storage or RAM, but it affects how much RAM your server uses and how fast your server can fetch things from disk.

For example, think of node size as the size of cardboard boxes you use to ship vases from a warehouse to your store. A larger cardboard box means that you can ship more vases at once with fewer trips from the warehouse. A large node size means that you can get more `rippled` transaction data, for example, with fewer trips to disk storage.

However, with a larger box, you also need to include more packing material to keep the vases from breaking during shipping, which takes up precious space in the box. Likewise, with a larger node size, you can get a lot of transaction data, but the data may also contain `rippled` start up information and ledger reports, which takes up precious RAM that can't be used for the subset of data you're actually using.

A part of tuning these configurations is about choosing the right node size so that the subset of data you're actually using can be retrieved in the fewest trips to disk storage, while also ensuring that all of it, including other data you aren't using right now, can fit in your available RAM.

Ripple recommends you always use the largest node size your available RAM can support. See the following table for recommended settings.

#### Recommendation

Each `node_size` has a corresponding requirement for available RAM. For example, if you set `node_size` to `huge`, you should have at least 32GB of available RAM to help ensure that `rippled` can run smoothly.

To tune your server, it may be useful to start with `tiny` and increase the size to `small`, `medium`, and so on as you refine the requirements for your use case.

***TODO: Small thing, but I switched the order of the node size and RAM columns because the node size column contains the value that you are setting and should be the starting point of focus.***

| `node_size` value | Available RAM for `rippled` | Notes                      |
|:------------------|:----------------------------|:---------------------------|
| `tiny`            | < 8GB                       | Not recommended for testing or production servers. If not specified in `rippled.cfg`, `tiny` is the default value. |
| `small`           | 8GB                         | Recommended for test servers. |
| `medium`          | 16GB                        | Note that the `rippled-example.cfg` has its `node_size` value set to `medium`. ***TODO: The doc also says: With a `node_size` of `medium`, a `rippled` server can be reasonably stable in a test Linux system with 16GB of RAM -- is our recommendation for test servers - small or medium? Or either?*** |
| `large`           | 32GB                        | While `large` is a legal value, Ripple recommends just using `huge` instead. ***TODO: Per Mark, `large` uses less memory, but increases disk access requirements. Since disk is slower than memory, this reduces performance. This is a great clarification - but for both large and huge, we list 32GB RAM. If we want to include this info from Mark - do we need to reduce the RAM value we list for `large` for it to make sense?*** |
| `huge`            | 32GB                        | Recommended for production servers. |

For `node_size` troubleshooting, see [Bad node_size value](server-wont-start.html#bad-node-size-value).


### Node DB Type

The `type` field in the `[node_db]` stanza of the `rippled.cfg` file sets the type of key-value store that `rippled` uses to hold the ledger store on disk.

This setting does not directly configure RAM settings, but the choice of key-value store has important implications for RAM usage because of the different ways these technologies cache and index data for fast lookup.

You can set the value to either `RocksDB` or `NuDB`.

* If you are running a `rippled` server as a production validator, Ripple recommends that you use `RocksDB` with rotational disk storage. [Learn more](#more-about-using-rocksdb)

* If you are running a `rippled` server for any other production use, Ripple recommends that you use `NuDB` with SSD storage. NuDB works with SSD storage only. [Learn more](#more-about-using-nudb)

The example `rippled-example.cfg` file has the `type` field in the `[node_db]` stanza is set to `RocksDB`. ***TODO: Just an FYI that in this case, if you don't set a type value, rippled will not run. There is no default value coded into rippled.***

#### More About Using RocksDB

[RocksDB](https://rocksdb.org/docs/getting-started.html) is an embeddable persistent key-value store that is optimized for rotational disks.

RocksDB requires approximately one-third less disk [storage](#storage) than NuDB and provides better I/O latency. However, the better I/O latency comes as result of the large amount of RAM RocksDB requires to store data indexes.

Validators should be configured to use RocksDB and to store no more than about 300,000 ledgers (approximately two weeks' worth of [historical data](#historical-data)) in the ledger store.

RocksDB has performance-related configuration options that you can set in `rippled.cfg` to achieve maximum transaction processing throughput. Here is the recommended configuration for a `rippled` server using RocksDB:

***TODO: reordered to match order in rippled-example.cfg***

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

Online deletion enables the purging of `rippled` ledgers from databases without any disruption of service. It removes only records that are not part of the current ledgers. ***TODO: what do we mean by "current ledgers"?*** Without online deletion, those databases grow without bounds. Freeing disk space requires stopping the process and manually removing database files. For more information, see [`[node_db]`: `online_delete`](https://github.com/ripple/rippled/blob/develop/cfg/rippled-example.cfg#L832).

<!-- {# ***TODO***: Add link to online_delete section, when complete, per https://ripplelabs.atlassian.net/browse/DOC-1313  #} -->

### Log Level

The example `rippled-example.cfg` file sets the logging verbosity to `warning` in the `[rpc_startup]` stanza. This setting greatly reduces disk space and I/O requirements over more verbose logging. However, more verbose logging provides increased visibility for troubleshooting.

**Caution:** If you omit the `log_level` command from the `[rpc_startup]` stanza, `rippled` writes logs to disk at the `debug` level and outputs `warning` level logs to the console. `debug` level logging requires several more GB of disk space per day than `warning` level, depending on transaction volumes and client activity.



## Network and Hardware

Each `rippled` server in the XRP Ledger network performs all of the transaction processing work of the network. Therefore, the baseline hardware for production `rippled` servers should be similar to that used in Ripple's [performance testing](https://ripple.com/dev-blog/demonstrably-scalable-blockchain/).


### Recommendation

For best performance in enterprise production environments, Ripple recommends running `rippled` on bare metal with the following characteristics:

- Operating System: Ubuntu 16.04+
- CPU: Intel Xeon 3+ GHz processor with 4 cores and hyperthreading enabled
- Disk: SSD (7000+ writes/second, 10,000+ reads/second)
- RAM:
	- For testing: 8GB+
	- For production: 32GB
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
