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

Ripple recommends using these configuration guidelines to optimize performance of your `rippled` server. You can set the following parameters in the `rippled.cfg` file.


### Node Size

The `node_size` parameter determines the size of database caches and how much RAM you want the `rippled` server to be able to use at once. ***TODO: Edit stated correctly? What does "use at once" mean? The amount of RAM it can use to make a single read or write call? Do we need to say "at once"? For a single rippled server, are there multiple database caches - or just a single database cache? When we talk about Node Size, we are talking about configuring memory, and not storage, correct? Just clarifying for myself bc the two seem to get a little intertwined for me in this doc. For example, when we talk about a database cache - this is stored in RAM? But when we talk about the ledger store - that is stored in "storage," is that right? What is in the database cache vs the ledger store? The available RAM configured below has nothing to do with hardware storage, correct?*** Larger database caches decrease disk I/O requirements at a cost of higher memory requirements. ***TODO: Does it matter that SSDs don't have disks? Throughout, should we just refer to "storage" instead of "disks" or "disk storage"? For example, here we would refer to "storage I/O" instead? Does it matter?*** Ripple recommends you always use the largest database cache your available memory can support. See the following table for recommended settings.

#### Recommendation

| Available RAM for `rippled` | `node_size` value | Notes                      |
|:----------------------------|:------------------|:---------------------------|
| < 8GB                       | `tiny`            | If not specified, this is the default value. Not recommended. The delivered `rippled-example.cfg` has this value set to `medium`. ***TODO: In rippled-example.cfg, we recommend starting with the default value (tiny) and working upward, if necessary. Should we remove this "Not recommended." text here because we are recommending `tiny` as a starting value? I added the info about the delivered rippled-example.cfg file setting the configuration to `medium` so folks understand that if they don't change anything - they will get `medium`. Usually, when you hear that something is a default value, you assume that is what you'll get if you don't change anything. In this case, you'll need to change the delivered value (medium) to get the default value (tiny).*** |
| 8GB                         | `small`           | Recommended for test servers.   |
| 16GB                        | `medium`          |                            |
| 32GB                        | `large` or `huge` | Recommended for production servers. ***TODO: Do we want to say anything about the difference between `large` and `huge`? Either can be set with an available RAM of 32GB -- how are they different? Later in the doc we say we recommend `huge` for production servers.*** |


### Node DB Type

The `type` field in the `[node_db]` stanza of the `rippled.cfg` file sets the type of key-value database (or key-value store) that `rippled` uses to persist the XRP Ledger in the ledger store. ***TODO: what do we mean by persisting "the XRP Ledger in the ledger store"? By calling it the XRP Ledger it makes it sound like you are storing a full-history, which is not always the case. This content doesn't explicitly mention that this configuration also applies to the database cache (memory) - should it? Sorry if this is a dumb question - but this DB selection impacts storage, as well as RAM (memory), is that right?*** You can set the value to either `RocksDB` or `NuDB`. ***TODO: Updated the example values to the values I see in rippled-example.cfg - just for consistency and faster recognition - though the config does say these are case-insensitive.***

`rippled` offers a history sharding feature that allows you to store a randomized range of ledgers in a separate shard store. You may want to configure the shard store to use a different type of key-value database than the one you defined for the ledger store using the `[node_db]` stanza. For more information about how to use this feature, see [History Sharding](https://ripple.com/build/history-sharding/#shard-store-configuration).

#### RocksDB vs NuDB

The default backend data store is RocksDB, which is optimized for spinning disks. ***TODO: I need to test this but by default do we mean that if you don't set a node_db value, does it use RocksDB? Or by default do we mean that this is the value set in rippled-example.cfg? Just making sure.*** RocksDB requires approximately one-third less disk storage than NuDB and provides better I/O latency. However, the better I/O latency comes as result of the large amount of RAM RocksDB requires to store data indexes. ***TODO: I edited this section to clear up some ambiguity that was confusing to me. I hope that what I've come up with is still accurate? Can we change "default backend data store" to "default key-value database type"? I just want to correlate the node_db stanza name with how we refer to it here in the doc. When we talk about "data indexes" - is this akin to the database cache? Meaning, while storage is used for the ledger store -- memory is used for the database cache (aka data indexes?)***

NuDB, on the other hand, has nearly constant performance and memory footprint regardless of the amount of data being [stored](#storage). NuDB _requires_ a solid-state drive, but uses much less RAM than RocksDB to access a large database.

Ripple recommends using RocksDB for validators. `rippled` servers that operate as validators should keep only a few days' worth of [historical data](#historical-data) or less. For all other uses, Ripple recommends using NuDB.

***TODO: Based on my confusion above about the difference between storage and memory -- it would be great to standardize how we talk about what is being stored. Here we call what we are storing a "few days' worth of data", as well as something called the "ledger store". In the rippled.cfg, we refer to the "persistent datastore for rippled." In other areas of this doc and inputs to this doc, we talk about "data indexes," "persisting the XRP Ledger in the ledger store", a "database cache," and a "backend data store." Perhaps when we are talking about storage we can talk about the ledger store (or a few days' worth of ledger store data) and when we are talking about memory we can talk about the database cache? Any thoughts?***

RocksDB has performance-related configuration options you can modify to achieve maximum transaction processing throughput. (NuDB does not have performance-related configuration options.) Here is an example of the recommended configuration for a `rippled` server using RocksDB:

```
[node_db]
type=RocksDB
open_files=512
file_size_mb=64
file_size_mult=2
filter_bits=12
cache_mb=512
path={path_to_ledger_store}
```

### Historical Data

The amount of historical data that a `rippled` server keeps online is a major contributor to required storage space. At the time of writing (2018-10-29), a `rippled` server stores about 12GB of data per day and requires 8.4TB to store the full history of the XRP Ledger. You can expect this amount to grow as transaction volume increases across the XRP Ledger network. You can control how much data you keep with the `online_delete` and `advisory_delete` fields.

Online deletion enables pruning of `rippled` ledgers from databases without any disruption of service. It removes only records that are not part of the current ledgers. Without online deletion, those databases grow without bounds. Freeing disk space requires stopping the process and manually removing database files. For more information, see [`[node_db]`: `online_delete`](https://github.com/ripple/rippled/blob/develop/cfg/rippled-example.cfg#L832).

<!-- {# ***TODO***: Add link to online_delete section, when complete, per https://ripplelabs.atlassian.net/browse/DOC-1313  #} -->

### Log Level

The default `rippled.cfg` file sets the logging verbosity to `warning` in the `[rpc_startup]` stanza. This setting greatly reduces disk space and I/O requirements over more verbose logging. However, more verbose logging provides increased visibility for troubleshooting.

**Caution:** If you omit the `log_level` command from the `[rpc_startup]` stanza, `rippled` writes logs to disk at the `debug` level and outputs `warning` level logs to the console. `debug` level logging requires several more GB of disk space per day than `warning` level, depending on transaction volumes and client activity.



## Network and Hardware

Each `rippled` server in the XRP Ledger network performs all of the transaction processing work of the network. ***TODO: Is this true? What do we mean by "transaction processing" -- do we mean validation? Do we mean storing transaction history? I ask because I don't think "each rippled server in the XRP Ledger network" participates in the same way. Depending on the answer - aren't there some servers on the network that don't participate in "transaction processing"?*** It is unknown when volumes will approach maximum network capacity. ***TODO: This is true - but do we need to say it?*** Therefore, the baseline hardware for production `rippled` servers should be similar to that used in Ripple's [performance testing](https://ripple.com/dev-blog/demonstrably-scalable-blockchain/). ***TODO: Not sure about the word "Therefore" here - it's saying that because we don't know when volumes will approach max network capacity - you could use this configuration. I'm not sure if that make sense. I may be misunderstanding what we mean.***


### Recommendation

For best performance in enterprise production environments, Ripple recommends running `rippled` on bare metal with the following characteristics:

- Operating System: Ubuntu 16.04+
- CPU: Intel Xeon 3+ GHz processor with 4 cores and hyperthreading enabled
- Disk: SSD ***TODO: instead of "Disk" - refer to "Storage" instead?***
- RAM:
	- For testing: 8GB+
	- For production: 32GB
- Network: Enterprise data center network with a gigabit network interface on the host

***TODO: reordered the sections below to match the order of the bullets above, just for ease of tracking for the writer and the reader.***

#### CPU Utilization and Virtualization

Ripple performance engineering has determined that bare metal servers achieve maximum throughput. However, it is likely that hypervisors cause minimal degradation in performance. ***TODO: What are we saying about hypervisors here? Are we saying that you can run `rippled` on a virtual machine managed by a hypervisor with minimal degradation?***

#### Storage

Ripple recommends estimating storage sizing at roughly 12GB per day of data kept online with NuDB. RocksDB requires around 8GB per day. However, the data per day changes with activity in the network. You should provision extra capacity to prepare for future growth. At the time of writing (2018-10-29), a server with all XRP Ledger history requires 8.4TB.

<!-- {# ***TODO: Update the dated storage consideration above, as needed. ***#} -->
<!-- {# ***TODO: DOC-1331 tracks: Create historic metrics that a user can use to derive what will be required. For ex, a chart with 1TB in 2014, 3TB in 2015, 7TB in 2018 ***#} -->

SSD storage should support several thousand of both read and write IOPS. The maximum reads and writes per second that Ripple engineers have observed are over 10,000 reads per second (in heavily-used public server clusters), and over 7,000 writes per second (in dedicated performance testing).

##### Amazon Web Services

***TODO: I moved this to the Storage section so you see this info about AWS in the most relevant context. Is this okay?***

Amazon Web Services (AWS) is a popular virtualized hosting environment. You can run `rippled` in AWS, but Ripple does not recommend using Elastic Block Storage (EBS). ***TODO: When we say "run rippled in AWS" - do we mean AWS EC2?***  Elastic Block Storage's maximum number of IOPS (5,000) is insufficient for `rippled`'s heaviest loads, despite being very expensive.

AWS instance stores (`ephemeral` storage) do not have these constraints. ***TODO: AWS EC2 instance stores?*** Therefore, Ripple recommends deploying `rippled` servers with host types such as `M3` that have instance storage. The `database_path` and `node_db` path should each reside on instance storage.

**Caution:** AWS instance storage is not guaranteed to provide durability in the event of hard drive failure. Further, data that is lost when the instance stops and restarts (but not when just rebooted). This loss can be acceptable for a `rippled` server because an individual server can usually re-acquire that data from its peer servers.

#### RAM/Memory

Memory requirements are mainly a function of the `node_size` configuration setting and the amount of client traffic retrieving historical data. As mentioned, production servers should maximize performance and set this parameter to `huge`. ***TODO: In Node Size - Recommendation section above, we recommend `large` or `huge` for production. Here we say that production servers should use huge.***

You can set the `node_size` parameter lower to use less memory, but you should only do this for testing. With a `node_size` of `medium`, a `rippled` server can be reasonably stable in a test Linux system with as little as 8GB of RAM. ***TODO: In the Node Size - Recommendation section above, we match a node size of `medium` with 16GB of RAM. Here we match `medium` with 8GB of RAM. But the text here seems to be suggesting something more like a node size of `low` with 16GB of RAM, where you have more memory, but are using the node_size to use less memory than you have. How can we resolve what seem to me to be inconsistencies?***

#### Network

Any enterprise or carrier-class data center should have substantial network bandwidth to support running `rippled` servers. The minimum requirements are roughly 2Mbps transmit and 2Mbps receive for current transaction volumes. However, these can burst up to 100MBps transmissions when serving historical ledger and transaction reports. When a `rippled` server initially starts up, it can burst to over 20Mbps receive.
