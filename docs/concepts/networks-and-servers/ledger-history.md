---
html: ledger-history.html
parent: networks-and-servers.html
seo:
    description: rippled servers store a variable amount of transaction and state history locally.
labels:
  - Data Retention
  - Blockchain
  - Core Server
---
# Ledger History

The [consensus process](../consensus-protocol/index.md) creates a chain of [validated ledger versions](../ledgers/index.md), each derived from the previous one by applying a set of [transactions](../transactions/index.md). Every [`rippled` server](index.md) stores ledger versions and transaction history locally. The amount of transaction history a server stores depends on how long that server has been online and how much history it is configured to fetch and keep.

Servers in the peer-to-peer XRP Ledger network share transactions and other data with each other as part of the consensus process. Each server independently builds each new ledger version and compares results with its trusted validators to ensure consistency. (If a consensus of trusted validators disagrees with a server's results, that server fetches the necessary data from its peers to achieve consistency.) Servers can download older data from their peers to fill gaps in their available history. The structure of the ledger uses cryptographic [hashes](../../references/protocol/data-types/basic-data-types.md#hashes) of the data so that any server can verify the integrity and consistency of the data.

## Databases

Servers keep ledger state data and transactions in a key-value store called the _ledger store_. Additionally, `rippled` maintains a few SQLite database files for more flexible access to things like transaction history, and to track certain settings changes.

It is generally safe to delete all of a `rippled` server's database files when that server is not running. (You may want to do this, for example, if you change the server's storage settings or if you are switching from a test net to the production network.)

## Available History

By design, all data and transactions in the XRP Ledger are public, and anyone can search or query anything. However, your server can only search data that it has available locally. If you try to query for a ledger version or transaction that your server does not have available, your server replies that it cannot find that data. Other servers that have the necessary history can respond successfully to the same query. If you have a business that uses XRP Ledger data, you should be mindful of how much history your server has available.

The [server_info method][] reports how many ledger versions your server has available in the `complete_ledgers` field.

## Fetching History

When an XRP Ledger server starts, its first priority is to get a complete copy of the latest validated ledger. From there, it keeps up with advances in the ledger progress. The server fills in any gaps in its ledger history that occur after syncing, and can backfill history from before it became synced. (Gaps in ledger history can occur if a server temporarily becomes too busy to keep up with the network, loses its network connection, or suffers other temporary issues.) When downloading ledger history, the server requests the missing data from its [peer servers](peer-protocol.md), and verifies the data's integrity using cryptographic [hashes][Hash].

Backfilling history is one of the server's lowest priorities, so it may take a long time to fill missing history, especially if the server is busy or its hardware and network specs aren't good enough. For recommendations on hardware specs, see [Capacity Planning](../../infrastructure/installation/capacity-planning.md). Backfilling history also requires that at least one of the server's direct peers has the history in question. For more information on managing your server's peer-to-peer connections, see [Configure Peering](../../infrastructure/configuration/peering/index.md).

The XRP Ledger identifies data (on several different levels) by a unique hash of its contents. The XRP Ledger's state data contains a short summary of the ledger's history, in the form of the [LedgerHashes object type](../../references/protocol/ledger-data/ledger-entry-types/ledgerhashes.md). Servers use the LedgerHashes objects to know which ledger versions to fetch, and to confirm that the ledger data they receive is correct and complete.


<a id="with-advisory-deletion"></a><!-- old anchor to this area -->
### Backfilling
{% badge href="https://github.com/XRPLF/rippled/releases/tag/1.6.0" %}Updated in: rippled 1.6.0{% /badge %}

The amount of history a server attempts to download depends on its configuration. The server automatically tries to fill gaps by downloading history up to **the oldest ledger it already has available**. You can use the `[ledger_history]` setting to make the server backfill history beyond that point. However, the server never downloads ledgers that would be scheduled for [deletion](../../infrastructure/configuration/data-retention/online-deletion.md).

The `[ledger_history]` setting defines a minimum number of ledgers to accumulate from before the current validated ledger. Use the special value `full` to download the [full history](#full-history) of the network. If you specify a number of ledgers, it must be equal to or more than the `online_deletion` setting; you cannot use `[ledger_history]` to make the server download _less_ history. To reduce the amount of history a server stores, change the [online deletion](../../infrastructure/configuration/data-retention/online-deletion.md) settings instead. <!-- STYLE_OVERRIDE: a number of -->



## Full History

Some servers in the XRP Ledger network are configured as "full-history" servers. These servers, which require significantly more disk space than other tracking servers, collect all available XRP Ledger history and **do not use online deletion**.

The XRP Ledger Foundation provides access to a set of full history servers operated by community members (see [xrplcluster.com](https://xrplcluster.com) for more details).
Ripple also provides a set of public full-history servers as a public service at `s2.ripple.com`. <!-- SPELLING_IGNORE: xrplcluster -->

Providers of Full History servers reserve the right to block access that is found to abuse resources, or put inordinate load on the systems.

**Tip:** Unlike some cryptocurrency networks, servers in the XRP Ledger do not need full history to know the current state and keep up with current transactions.

For instructions on setting up full history, see [Configure Full History](../../infrastructure/configuration/data-retention/configure-full-history.md).

## History Sharding

An alternative to storing the full history of the XRP Ledger on a single expensive machine is to configure many servers to each store a part of all ledger history. The [History Sharding](../../infrastructure/configuration/data-retention/history-sharding.md) feature makes this possible, storing ranges of ledger history in a separate storage area called the _shard store_. When a peer server asks for specific data (as described in [fetching history](#fetching-history) above), a server can answer using data from either its ledger store or shard store.

Online deletion **does not** delete from the shard store. However, if you configure online deletion to keep at least 32768 ledger versions in your server's ledger store, your server can copy full shards from the ledger store to the shard store before automatically deleting them from the ledger store.

For more information, see [Configure History Sharding](../../infrastructure/configuration/data-retention/configure-history-sharding.md).


## See Also

- **Concepts:**
    - [Ledgers](../ledgers/index.md)
    - [Consensus](../consensus-protocol/index.md)
- **Tutorials:**
    - [Configure `rippled`](../../infrastructure/configuration/index.md)
        - [Configure Online Deletion](../../infrastructure/configuration/data-retention/configure-online-deletion.md)
        - [Configure Advisory Deletion](../../infrastructure/configuration/data-retention/configure-advisory-deletion.md)
        - [Configure History Sharding](../../infrastructure/configuration/data-retention/configure-history-sharding.md)
        - [Configure Full History](../../infrastructure/configuration/data-retention/configure-full-history.md)
- **References:**
    - [ledger method][]
    - [server_info method][]
    - [ledger_request method][]
    - [can_delete method][]
    - [ledger_cleaner method][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
