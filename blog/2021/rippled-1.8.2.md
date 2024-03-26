---
category: 2021
theme:
    markdown:
        editPage:
            hide: true
date: 2021-12-20
labels:
    - rippled Release Notes
---
# Introducing XRP Ledger version 1.8.2

Version 1.8.2 of `rippled`, the reference server implementation of the XRP Ledger protocol, is now available. This release addresses the full transaction queues and elevated transaction fees issue observed on the XRP ledger, and also provides some optimizations and small fixes to improve the server's performance overall.

Due to the holidays, version 1.8.2 is being made available as a "soft release" in the `unstable` package channel so that operators who are interested can upgrade. Automatic updates will not update to this release until it is pushed to the `stable` branch at a later date.

<!-- BREAK -->

## Summary of Issues

Recently, servers in the XRP Ledger network have had full transaction queues and transactions paying low fees have mostly not been able to be confirmed through the queue. After investigation, it was discovered that a large influx of transactions to the network caused it to raise the transaction costs to be proposed in the next ledger block, and defer transactions paying lower costs to later ledgers. The first part worked as designed, but deferred transactions were not being confirmed as the ledger had capacity to process them.

The root cause was that there were very many low-cost transactions that different servers in the network received in a different order due to incidental differences in timing or network topology, which caused validators to propose different sets of low-cost transactions from the queue. Since none of these transactions had support from a majority of validators, they were removed from the proposed transaction set. Normally, any transactions removed from a proposed transaction set are supposed to be retried in the next ledger, but servers attempted to put these deferred transactions into their transaction queues first, which had filled up. As a result, the deferred transactions were discarded, and the network was only able to confirm transactions that paid high costs.

## Bug Fixes

- **Address elevated transaction fees**: This change addresses the full queue problems in two ways. First, it puts deferred transactions directly into the open ledger, rather than transaction queue. This reverts a subset of the changes from [commit `62127d7`](https://github.com/ripple/rippled/commit/62127d725d801641bfaa61dee7d88c95e48820c5). A transaction that is in the open ledger but doesn't get validated should stay in the open ledger so that it can be proposed again right away. Second, it changes the order in which transactions are pulled from the transaction queue to increase the overlap in servers' initial transaction consensus proposals. Like the old rules, transactions paying higher fee levels are selected first. Unlike the old rules, transactions paying the same fee level are ordered by transaction ID / hash ascending. (Previously, transactions paying the same fee level were unsorted, resulting in each server having a different order.)

- **Add ignore_default option to account_lines API**: This flag, if present, suppresses the output of incoming trust lines in the default state. This is primarily motivated by observing that users often have many unwanted incoming trust lines in a default state, which are not useful in the vast majority of cases. Being able to suppress those when doing `account_lines` saves bandwidth and resources. ([#3980](https://github.com/ripple/rippled/pull/3980))

- **Make I/O and prefetch worker threads configurable**: This commit adds the ability to specify **io_workers** and **prefetch_workers** in the config file which can be used to specify the number of threads for processing raw inbound and outbound IO and configure the number of threads for performing node store prefetching. ([#3994](https://github.com/ripple/rippled/pull/3994))

- **Enforce account RPC limits by objects traversed**: This changes the way the account_objects API method counts and limits the number of objects it returns. Instead of limiting results by the number of objects found, it counts by the number of objects traversed. Additionally, the default and maximum limits for non-admin connections have been decreased. This reduces the amount of work that one API call can do so that public API servers can share load more effectively. ([#4032](https://github.com/ripple/rippled/pull/4032))

- **Fix a crash on shutdown**: The NuDB backend class could throw an error in its destructor, resulting in a crash while the server was shutting down gracefully. This crash was harmless but resulted in false alarms and noise when tracking down other possible crashes. ([#4017](https://github.com/ripple/rippled/pull/4017))

- **Improve reporting of job queue in admin server_info**: The server_info command, when run with admin permissions, provides information about jobs in the server's job queue. This commit provides more descriptive names and more granular categories for many jobs that were previously all identified as "clientCommand". ([#4031](https://github.com/ripple/rippled/pull/4031))

- **Improve full & compressed inner node deserialization**: Remove a redundant copy operation from low-level SHAMap deserialization. ([#4004](https://github.com/ripple/rippled/pull/4004))

- **Reporting mode: only forward to P2P nodes that are synced**: Previously, reporting mode servers forwarded to any of their configured P2P nodes at random. This commit improves the selection so that it only chooses from P2P nodes that are fully synced with the network. ([#4028](https://github.com/ripple/rippled/pull/4028))

- **Improve handling of HTTP X-Forwarded-For and Forwarded headers**: Fixes the way the server handles IPv6 addresses in these HTTP headers. ([#4009](https://github.com/ripple/rippled/pull/4009), [#4030](https://github.com/ripple/rippled/pull/4030))

- **Other minor improvements to logging and Reporting Mode.**
