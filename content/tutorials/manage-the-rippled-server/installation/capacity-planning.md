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

Set the `node_size` parameter to define your `rippled` server's database cache size, as well as how much RAM you want the server to be able to use. Pick the appropriate size based on your server's expected load and available memory. ***TODO: correctly stated? The `tiny`, `huge`, etc values are setting the database cache size. When we list an Available RAM value in the table below - are we saying that this is how much RAM rippled will use? Or are we saying that if you select HUGE, you need to have at least 32GB available RAM for rippled?***

The `node_size` you define determines how big of an object to treat as one "node" in the ledger's underlying tree structure. 

It doesn't directly configure storage or RAM, but it affects how much RAM your `rippled` server uses and how fast it can fetch things from disk. For example, a larger node size decreases disk I/O requirements, but increases memory requirements.  ***TODO: Thank you for your patient explanations. I am so close to understanding this. The current doc says that node_size defines the  But one more question - and I'm sorry if I'm making this more complicated than it is - but by "node," we usually mean an instance of a rippled server. But in this case, are we talking about "node" as a unit of information or data to be retrieved or stored, the size of which we are defining based on this setting? The current doc says that this value sets the size of the database cache.***

Ripple recommends you always use the largest database cache your available memory can support. See the following table for recommended settings.

#### Recommendation

| Available RAM for `rippled` | `node_size` value | Notes                      |
|:----------------------------|:------------------|:---------------------------|
| < 8GB                       | `tiny`            | Not recommended. If not specified in `rippled.cfg`, `tiny` is the default value. |
| 8GB                         | `small`           | Recommended for test servers. |
| 16GB                        | `medium`          | The example `rippled-example.cfg` has its `node_size` value set to `medium`. |
| 32GB                        | `large`           | Ripple recommends using `huge` instead. `large` uses less memory than `huge`, but increases disk access requirements, which decreases performance. ***TODO: Included this row because `large` is an option in `rippled-example.cfg` and I think we need to acknowledge it here. Is the Available RAM value correct? We say that `large` uses less memory than `huge`, but the RAM values are the same.*** |
| 32GB                        | `huge`            | Recommended for production servers. |

For `node_size` troubleshooting, see [Bad node_size value](server-wont-start.html#bad-node-size-value).


### Node DB Type

The `type` field in the `[node_db]` stanza of the `rippled.cfg` file sets the type of key-value store that `rippled` uses to hold ledger data on disk. This setting does not directly configure RAM settings, but the choice of key-value store has important implications for RAM usage because of the different ways these technologies cache and index data for fast lookup.

You can set the value to either `RocksDB` or `NuDB`.

#### RocksDB vs NuDB

In the example `rippled-example.cfg` file, the `type` field in the `[node_db]` stanza is set to `RocksDB`, which is optimized for spinning disks. RocksDB requires approximately one-third less disk storage than NuDB and provides better I/O latency. However, the better I/O latency comes as result of the large amount of RAM RocksDB requires to store data indexes. ***TODO: in this case, if you don't set a type value, rippled will not run. there is no default value set in the code.***

NuDB, on the other hand, has nearly constant performance and memory footprint regardless of the amount of data being [stored](#storage). NuDB _requires_ a solid-state drive, but uses much less RAM than RocksDB to access a large database.

Validators should be configured to use RocksDB and to store no more than about 300,000 ledgers (approximately two weeks' worth of [historical data](#historical-data) in the ledger store. For other production servers, Ripple recommends using NuDB, with an amount of historical data configured based on business needs. Machines with only spinning disks (not recommended) must use RocksDB.

***TODO: When we talk about "data indexes" - is this akin to the database cache? Meaning, while storage is used for the ledger store -- memory is used for the database cache (aka data indexes?)***

***TODO: Based on my confusion above about the difference between storage and memory -- it would be great to standardize how we talk about what is being stored. Here we call what we are storing a "few days' worth of data", as well as something called the "ledger store". In the rippled.cfg, we refer to the "persistent datastore for rippled." In other areas of this doc and inputs to this doc, we talk about "data indexes," "persisting the XRP Ledger in the ledger store", a "database cache," and a "backend data store." Perhaps when we are talking about storage we can talk about the ledger store (or a few days' worth of ledger store data) and when we are talking about memory we can talk about the database cache? Any thoughts?***

***TODO: from rome:

I'm not entirely sure what you're advocating regarding the terminology, but I suspect your confusion may come from trying to separate the the persistent stores (on disk) from the transient storage (in RAM) that they require for indexes and cache. "Persist" is specifically referring to storing data for the long term (that is, on disk). The ledger store handles persisting, caching, and indexing the data to whatever extent the chosen tech is designed to do. To a large extent, the amount of RAM you need is directly correlated to how much you have stored on disk. (The size of your phone book depends on how many people are listed.)

I agree that there are a lot of almost interchangeable terms in use here like "ledger store", "key-value store", "node backend", "ledger database", etc. but I think untangling them and reducing the number of unique terms used may be beyond our control since those terms are also used as config options and API methods, and the names used in those places are really not that distinct or consistent. I'll try to give my breakdown of terms though (my preferred terms in bold):

ledger store / node store / node DB / ledger DB - The (mandatory) thing that stores current and historical ledgers (well, their contents) in a continuous history as they're produced.

shard store / shard DB - A place to store chunks of historical ledgers

key-value store / node backend / key-value database - The technology that actually stores the data in the ledger store or shard store. The two current choices are RocksDB and NuDB. (In the past, rippled supported other storage technologies too.)***

***TODO: from ryan: Saying "ledgers from the last few days" would probably add clarity.

I think the basic breakdown is:

"ledger store" -- Stores hashes of ledgers
"persistent datastore for rippled" -- Data that's stored for a medium to long-term period. As opposed to ledger storage, which can be deleted periodically in the short-term (depending on use-cases)
"data indexes" -- How RocksDB stores hashes
"database cache" -- same thing as ledger store?
"backend data store" -- same thing as ledger store?
Perhaps when we are talking about storage we can talk about the ledger store (or a few days' worth of ledger store data) and when we are talking about memory we can talk about the database cache? Any thoughts?

I think this makes sense. Instead of database cache, we might want to say "key-value store", but I might be confused as to the difference there.***

***TODO: from rome: Database cache and indexes are different things. Both are involved in fetching records quickly.

Index: A list of all the records you have, and possibly some details about them. For example, if you frequently have to look up people with a specific hair color, you might keep an index of people with brown hair in your yellow pages, so you can do that without calling every person in the book and asking them for their hair color. The problem is, the more indexes you keep, the more huge yellow books (indexes) you have occupying your office (RAM). Depending on how many indexes of how many records you keep, at some point you may have so many books in your office that you can't even fit enough many clients in your office to hold actual meetings. That's what happens if you use RocksDB with a big database and a small amount of RAM.

Cache: A convenient place where you keep a subset of things you expect to access soon. There are many different kinds of caches but for these key-value stores, it's most likely stored in RAM. So cache may contain entire records/blocks/objects/whatever that you expect to need to fetch soon, and is probably an order of magnitude faster than going all the way to disk to fetch those things. The trick is correctly predicting which things you're going to access again soon—stuff you saw recently, stuff that's sequentially after or just nearby stuff you recently looked up, etc. Going back to our yellow pages analogy, cache is almost like a waiting room space right next to your office. Cache also takes up space (as I mentioned, probably in RAM), so you don't want to dedicate so many square feet to the waiting room that you can't actually invite many people into the office proper.

RocksDB has a pretty thorough and efficient system for managing both of them. NuDB takes a different approach entirely: it says, "look, we have fast elevators and everyone lives pretty close to my office, so I'll just call them as I need them and keep as much office space as I can for actual work". If your elevators are actually slow (spinning disks) then you're going to spend a lot of time waiting around for people to show up in your office.***

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

#### History Sharding

`rippled` offers a history sharding feature that allows you to store a randomized range of ledgers in a separate shard store. You can use the `[shard_db]` stanza to configure the shard store to use a different type of key-value store than the one you defined for the ledger store using the `[node_db]` stanza. For more information about how to use this feature, see [History Sharding](history-sharding.html).


### Historical Data

The amount of historical data that a `rippled` server keeps online is a major contributor to required storage space. At the time of writing (2018-10-29), a `rippled` server stores about 12GB of data per day and requires 8.4TB to store the full history of the XRP Ledger. You can expect this amount to grow as transaction volume increases across the XRP Ledger network. You can control how much data you keep with the `online_delete` and `advisory_delete` fields.

Online deletion enables purging of `rippled` ledgers from databases without any disruption of service. It removes only records that are not part of the current ledgers. ***TODO: what do we mean by "current ledgers"?*** Without online deletion, those databases grow without bounds. Freeing disk space requires stopping the process and manually removing database files. For more information, see [`[node_db]`: `online_delete`](https://github.com/ripple/rippled/blob/develop/cfg/rippled-example.cfg#L832).

<!-- {# ***TODO***: Add link to online_delete section, when complete, per https://ripplelabs.atlassian.net/browse/DOC-1313  #} -->

### Log Level

The default `rippled.cfg` file sets the logging verbosity to `warning` in the `[rpc_startup]` stanza. This setting greatly reduces disk space and I/O requirements over more verbose logging. However, more verbose logging provides increased visibility for troubleshooting.

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

Ripple recommends estimating storage sizing at roughly 12GB per day of data kept online with NuDB. RocksDB requires around 8GB per day. However, the data per day changes with activity in the network. You should provision extra capacity to prepare for future growth. At the time of writing (2018-10-29), a server with all XRP Ledger history requires 8.4TB.

<!-- {# ***TODO: Update the dated storage consideration above, as needed. ***#} -->
<!-- {# ***TODO: DOC-1331 tracks: Create historic metrics that a user can use to derive what will be required. For ex, a chart with 1TB in 2014, 3TB in 2015, 7TB in 2018 ***#} -->

SSD storage should support several thousand of both read and write IOPS. The maximum reads and writes per second that Ripple engineers have observed are over 10,000 reads per second (in heavily-used public server clusters), and over 7,000 writes per second (in dedicated performance testing).

##### Amazon Web Services

Amazon Web Services (AWS) is a popular virtualized hosting environment. You can run `rippled` in AWS, but Ripple does not recommend using Elastic Block Storage (EBS). Elastic Block Storage's maximum number of IOPS (5,000) is insufficient for `rippled`'s heaviest loads, despite being very expensive.

AWS instance stores (`ephemeral` storage) do not have these constraints. Therefore, Ripple recommends deploying `rippled` servers with host types such as `M3` that have instance storage. The `database_path` and `node_db` path should each reside on instance storage.

**Caution:** AWS instance storage is not guaranteed to provide durability in the event of hard drive failure. You also lose data when you stop/start or reboot the instance. The latter type of data loss can be acceptable for a `rippled` server because an individual server can usually re-acquire the lost data from its peer servers.

#### RAM/Memory

Memory requirements are mainly a function of the `node_size` configuration setting and the amount of client traffic retrieving historical data. As mentioned, production servers should maximize performance and set this parameter to `huge`.

You can set the `node_size` parameter lower to use less memory, but you should only do this for testing. With a `node_size` of `medium`, a `rippled` server can be reasonably stable in a test Linux system with 16GB of RAM.

#### Network

Any enterprise or carrier-class data center should have substantial network bandwidth to support running `rippled` servers. The minimum requirements are roughly 2Mbps transmit and 2Mbps receive for current transaction volumes. However, these can burst up to 100MBps transmissions when serving historical ledger and transaction reports. When a `rippled` server initially starts up, it can burst to over 20Mbps receive.
