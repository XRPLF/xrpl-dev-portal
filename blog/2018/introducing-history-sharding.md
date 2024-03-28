---
date: 2018-11-07
category: 2018
labels:
    - Features
theme:
    markdown:
        editPage:
            hide: true
---
# Introducing History Sharding

As `rippled` servers operate, they continually witness data appended onto an ever-growing blockchain. This data becomes the history that the network agrees upon and that constitutes everything about the XRP Ledger.

As with most blockchains, it is imperative that XRP Ledger historical data remain readily available to participating servers. Therefore, every `rippled` server shares the responsibility of storing some history. But what if keeping the full history of the XRP Ledger starts to exceed the storage facility of most participants? For example, as of this writing, the space required to store full history of the XRP Ledger is over 8 terabytes, a hefty flash sum.

The [history sharding](https://developers.ripple.com/history-sharding.html) feature, enabled in `rippled` version 0.90.0, addresses this issue by distributing history into segments called shards. A shard contains all of the data for a range of ledgers. Using the history sharding feature, individual `rippled` servers can contribute to storing historical data without needing to store the entire history.

<!-- BREAK -->

A shard store does not replace a ledger store, but implements a reliable path toward distributed ledger history across the XRP Ledger Network. The history of all ledgers is shared by servers agreeing to keep shards. This makes it possible for servers to confirm that they have all the data they agreed to maintain, and produce proof trees or ledger deltas.

Because servers that are configured with history sharding randomly select the shards that they store, the full history of all closed ledgers is stored in a normal distribution curve, increasing the probability that the XRP Ledger Network evenly maintains the history.

## Shard Store Validation

Beginning with `rippled` version 0.90.0, you can use the [`--validateShards`](https://developers.ripple.com/commandline-usage.html#daemon-mode-options) command to check that shard store data is valid and consistent with network history. For example:

        ./rippled --validateShards

This operation verifies that all objects stored for every ledger stored in each shard are valid and consistent with the network. Run this command only when you start the server and note that it may take a while to complete.


## Node Store to Shard Store

Beginning with `rippled` version 1.0.0, you can use the [`--nodetoshard'](https://developers.ripple.com/commandline-usage.html#daemon-mode-options) command to import the data from an existing ledger store into a shard store. For example:

        ./rippled --nodetoshard

This command enables you to create shards based on the history you already have. The command creates shards from complete ledger ranges in the ledger store.

The command creates a copy of the data, so your server must have the additional disk space required by the shard maximum disk space setting ([`max_size_gb`](https://developers.ripple.com/history-sharding.html#shard-store-configuration)) in the `rippled.cfg` configuration file.


## Downloadable Shard Archives

Beginning with `rippled` version 1.1.0, you can use the `download_shard` API method to download and import shard archives from an HTTPS web server. <!--{# TODO: once download_shard rippled API method is documented per https://ripplelabs.atlassian.net/browse/DOC-1907, the ticket instructs the writer to update this dev blog post to link to the method's doc. #}--> For example:

        {
           "command":"download_shard",
           "shards":[
              {
                 "index":1,
                 "url":"https://www.domain.com/1.tar.lz4"
              }
           ]
        }

A shard archive is a [tar](https://en.wikipedia.org/wiki/Tar_(computing)) of a complete shard directory compressed with LZ4. Downloaded archives are checked to be valid and consistent with network history before being imported.

For more information, see [History Sharding](https://developers.ripple.com/history-sharding.html).
