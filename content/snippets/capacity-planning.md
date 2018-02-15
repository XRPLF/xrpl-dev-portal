# Capacity Planning


Even the most minimally functional `rippled` server must contain the most recently validated Ledger versions to submit transactions to the network and verify the integrity of the XRP Ledger. Beyond these, consider the following server requirements:

- Handling ever-increasing transaction volume
- Servicing transaction reporting information to clients
- Maintaining varying amounts of historical data

Capacity planning for `rippled` involves two factors:

- The [configuration settings](#configuration-settings) that affect resource utilization
- The [network and hardware] (#network and hardware) requirements to achieve consistent, good performance across the XRP Ledger network

## Configuration Settings

Ripple recommends the following guidelines to improve performance, based on how our performance engineers evaluate the configuration properties listed. You can set the following parameters in the `rippled.cfg` file to improve performance for your `rippled` server.

### Node Size

The `node_size` parameter determines the size of database caches. For production systems, Ripple recommends that you always set it to `huge`. Increased cache size requires less disk I/O and allows `rippled` to improve performance. The trade-off to improving performance better is that memory requirements increase.

### Node DB Type

The `type` field in the `node_db` section of the `rippled.cfg` file sets the type of key-value store that `rippled` uses to persist the XRP Ledger in the Ledger Store. You can set the value to either `rocksdb` or `nudb`. For setting the store that `rippled` uses to persist history shards, if you are participating in history sharding, see [History Sharding](XREF: concept-history-sharding.md#shard-store-configuration).

#### RocksDB vs NuDB
RocksDB requires approximately one-third less disk storage than NuDB and provides a corresponding improvement in I/O latency. However, this comes at a cost of increased memory utilization as storage size grows. Nudb, on the other hand, has nearly constant performance and memory footprint regardless of storage.

For `rippled` servers that operate as validators, which keep only a few days' worth of data or less, Ripple recommends using RocksDB. For all other uses, Ripple recommends users configure NuDB for the Ledger Store. Nudb has no performance-related configuration options. But tuning parameters are available for RocksDB that have been used to help achieve maximum tested transaction processing throughput, and are as follows:

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

The amount of historical data kept online, as set in the `online_delete` and  `advisory_delete` field, is a major contributor to required storage space. Currently, about 12GB of data is stored per day. However, you should expect this amount to grow as transaction volume increases across the XRP Ledger Network.

### Log Level

The default logging verbosity for `rippled` in the `log_level` field is set to `debug` and requires several GB or more per day, depending on transaction volumes and client activity. Setting this to a lower level, such as warning, greatly reduces the space and I/O write requirements. The trade-off to a lower setting is decreased visibility for trouble-shooting problems.


## Network and Hardware

Each `rippled` server in the XRP Ledger network performs all of the transaction processing work of the network. It is unknown how soon volumes will approach maximum network capacity. Therefore, the baseline hardware for production `rippled` servers should be similar to that used in Ripple's [performance testing](https://ripple.com/dev-blog/demonstrably-scalable-blockchain/).

### Recommendation

For best performance in enterprise production environments, Ripple recommends running `rippled` on bare metal, with the following characteristics:

- Operating System: Ubuntu 16.04+
- CPU: Intel Xeon 3+ GHz processor with 4 cores and hyperthreading enabled
- Disk: SSD
- RAM: 32 GB RAM
- Network: Enterprise data center network with a gigabit network interface on the host

#### SSD Storage

SSD Storage should support several thousand both read and write IOPS. Maximum read IOPS come from heavily used servers such as those behind https://s1.ripple.com and https://s2.ripple.com, which service transaction and ledger history retrieval requests. This is sometimes over 10,000 reads per second! Maximum write IOPS have come from performance testing in which up to 7,000 writes/s have been observed.

#### CPU Utilization and Virtualization
Ripple perfmance engineering finds that bare metal servers acheive maximum throughput. However, it is likely that hypervisors would cause minimal degradation in performance.

#### Network

Any enterprise or carrier-class data center should have plenty of network bandwidth to support running `rippled` servers. The minimum requirements are roughly 2Mbps transmit and 2Mbps receive for current transaction volumes. However, these can burst up to 100MBps transmissions when serving up historical ledger and transaction reports. When a `rippled` server initially starts up, it can burst to well over 20Mbps receive.

#### Storage

Ripple recommends estimating storage sizing at roughly 12GB per day of data kept online with NuDB. RockDB requires around 8GB per day. However, future storage requirements are not known and extra capacity should be available to account for future growth. Currently, a server with all XRP Ledger history requires 6.8TB.

<!-- {# ***TODO: Update the dated storage consideration above, as needed. ***#} -->
<!-- {# ***TODO: Create historic metrics that a user can use to derive what will be required. For ex, a chart with 1TB in 2014, 3TB in 2015, 7TB in 2018 ***#} -->

#### Memory

Memory requirements are mainly a function of the `node_size` configuration option and the amount of client traffic retrieving historical data. As mentioned, production servers should maximize performance and set this parameter to `huge`. A smaller memory footprint can be achieved by setting the parameter lower, but that should only be used for testing. With a `node_size` of `medium`, a `rippled` server can be reasonably stable in a test Linux system with as little as 8GB of RAM.

#### Amazon Web Servives

Amazon Web Services (AWS) is a popular virtualized hosting environment, and you can run `rippled`  in that environment. However, using EBS storage is not recommended, because the maximum number of IOPS (5,000) may not be able to keep up with the heaviest demands, yet it is very expensive.

AWS instance stores (`ephemeral` storage) do not have these constraints. Therefore, Ripple recommends deploying `rippled` servers with host types such as `M3` that have instance storage. The `database_path` and `node_db` path should each reside on instance storage.

**Caution:** AWS instance storage is not guaranteed to provide durability in the event of hard drive failure. Further, data will be lost when the instance is stopped and restarted (but not when just rebooted).

