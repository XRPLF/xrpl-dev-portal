# Capacity Planning


Even the most minimally functional `rippled` server must contain the most recently validated ledger versions to submit transactions to the network and verify the integrity of the XRP Ledger. Beyond these, consider the following server requirements:

- Handling ever-increasing transaction volume
- Servicing transaction reporting information to clients
- Maintaining varying amounts of historical data

Capacity planning for `rippled` involves two factors:

- The [configuration settings](#configuration-settings) that affect resource utilization
- The [network and hardware] (#network and hardware) requirements to achieve consistent, good performance across the XRP Ledger network

## Configuration Settings

Ripple recommends the following guidelines to improve performance. You can set the following parameters in the `rippled.cfg` file to improve performance for your `rippled` server.

### Node Size

The `node_size` parameter determines the size of database caches. Ripple recommends you always set it to `huge` for production servers. Increased cache size requires less disk I/O and allows `rippled` to improve performance. The trade-off to improving performance is that memory requirements increase.

The `node_size` parameter determines the size of database caches. Larger database caches decrease disk I/O requirements at a cost of higher memory requirements. Ripple recommends you always use the largest database cache your available memory can support. For production servers with the recommended 32 GB of RAM, set `node_size` to `huge`. For `node_size` guidelines, see the following table:

| Available RAM for `rippled` | Recommended `node_size` value | Notes                              |
|:----------------------------|:------------------------------|:-----------------------------------|
| < 8 GB                      | `tiny`                        | Not recommended                    |
| 8 GB                        | `low`                         |                                    |
| 16 GB                       | `medium`                      |                                    |
| 32 GB                       | `huge`                        | Recommended for production servers |

### Node DB Type

The `type` field in the `node_db` section of the `rippled.cfg` file sets the type of key-value store that `rippled` uses to persist the XRP Ledger in the Ledger Store. You can set the value to either `rocksdb` or `nudb`. For setting the store that `rippled` uses to persist history shards, if you are participating in history sharding, see [History Sharding](XREF: concept-history-sharding.md#shard-store-configuration).

#### RocksDB vs NuDB
RocksDB requires approximately one-third less disk storage than NuDB and provides a corresponding improvement in I/O latency. However, this comes at a cost of increased memory utilization as storage size grows. NuDB, on the other hand, has nearly constant performance and memory footprint regardless of storage.

For `rippled` servers that operate as validators, which keep only a few days' worth of data or less, Ripple recommends using RocksDB. For all other uses, Ripple recommends users configure NuDB for the Ledger Store. NuDB has no performance-related configuration settings. However, tuning parameters are available for RocksDB that have been used to  achieve the maximum tested transaction processing throughput, shown here:

```
[node_db]
type=rocksdb
open_files=512
file_size_mb=64
file_size_mult=2
filter_bits=12
cache_mb=512
path={path_to_ledger_store}
```

### Historical Data

The amount of historical data kept online, as set in the `online_delete` and  `advisory_delete` fields, is a major contributor to required storage space. Currently, about 12GB of data is stored per day. However, you can expect this amount to grow as transaction volume increases across the XRP Ledger network.

### Log Level

The default `rippled.cfg` file configures the logging verbosity to `warning`. This setting greatly reduces disk space and I/O requirements over more verbose logging. However, more verbose logging provides increased visibility when troubleshooting.

**Note:** If you omit the `log_level` command from the `[rpc_startup]` stanza, `rippled` falls back to `debug` level logging, which requires several more GB of disk space per day, depending on transaction volumes and client activity.

## Network and Hardware

Each `rippled` server in the XRP Ledger network performs all of the transaction processing work of the network. It is unknown how soon volumes will approach maximum network capacity. Therefore, the baseline hardware for production `rippled` servers should be similar to that used in Ripple's [performance testing](https://ripple.com/dev-blog/demonstrably-scalable-blockchain/).

### Recommendation

For best performance in enterprise production environments, Ripple recommends running `rippled` on bare metal, with the following characteristics:

- Operating System: Ubuntu 16.04+
- CPU: Intel Xeon 3+ GHz processor with 4 cores and hyperthreading enabled
- Disk: SSD
- RAM:
	- For testing: 8GB+
	- For production: 32GB
- Network: Enterprise data center network with a gigabit network interface on the host

#### SSD Storage

SSD Storage should support several thousand both read and write IOPS.
The maximum reads and writes per second that Ripple engineers have observed are over 10,000 reads per second (in heavily-used public server clusters), and over 7,000 writes per second (in dedicated performance testing).

#### CPU Utilization and Virtualization
Ripple performance engineering finds that bare metal servers achieve maximum throughput. However, it is likely that hypervisors cause minimal degradation in performance.

#### Network

Any enterprise or carrier-class data center should have plenty of network bandwidth to support running `rippled` servers. The minimum requirements are roughly 2Mbps transmit and 2Mbps receive for current transaction volumes. However, these can burst up to 100MBps transmissions when serving up historical ledger and transaction reports. When a `rippled` server initially starts up, it can burst to well over 20Mbps receive.

#### Storage

Ripple recommends estimating storage sizing at roughly 12GB per day of data kept online with NuDB. RocksDB requires around 8GB per day. However, the data per day changes with activity in the network. You should provision extra capacity to prepare for future growth. Currently, a server with all XRP Ledger history requires 6.8TB.

<!-- {# ***TODO: Update the dated storage consideration above, as needed. ***#} -->
<!-- {# ***TODO: DOC-1331 tracks: Create historic metrics that a user can use to derive what will be required. For ex, a chart with 1TB in 2014, 3TB in 2015, 7TB in 2018 ***#} -->

#### Memory

Memory requirements are mainly a function of the `node_size` configuration setting and the amount of client traffic retrieving historical data. As mentioned, production servers should maximize performance and set this parameter to `huge`.
You can set the `node_size` parameter lower to use less memory, but you should only do this for testing. With a `node_size` of `medium`, a `rippled` server can be reasonably stable in a test Linux system with as little as 8GB of RAM.

#### Amazon Web Servives

Amazon Web Services (AWS) is a popular virtualized hosting environment, and you can run `rippled`  in that environment. However, using Elastic Block Storage (EBS) is not recommended, because the maximum number of IOPS (5,000) may not be able to keep up with the heaviest demands, yet it is very expensive.

AWS instance stores (`ephemeral` storage) do not have these constraints. Therefore, Ripple recommends deploying `rippled` servers with host types such as `M3` that have instance storage. The `database_path` and `node_db` path should each reside on instance storage.

**Caution:** AWS instance storage is not guaranteed to provide durability in the event of hard drive failure. Further, data that is lost when the instance stops and restarts (but not when just rebooted). This loss can be acceptable for a `rippled` server because an individual server can usually re-acquire that data from its peer servers.
