# Ledger History

The [consensus process](intro-to-consensus.html) creates a chain of [validated ledger versions](ledgers.html), each derived from the previous one by applying a set of [transactions](transaction-basics.html). Every [`rippled` server](the-rippled-server.html) stores ledger versions and transaction history locally. The amount of transaction history a server stores depends on how long that server has been online and how much history it is configured to fetch and keep.

Servers in the peer-to-peer XRP Ledger network share transactions and other data with each other as part of the consensus process. Each server independently builds each new ledger version and compares results with its trusted validators to ensure consistency. (If a consensus of trusted validators disagrees with a server's results, that server fetches the necessary data from its peers to achieve consistency.) Servers can download older data from their peers to fill gaps in their available history. The structure of the ledger uses cryptographic [hashes](basic-data-types.html#hashes) of the data so that any server can verify the integrity and consistency of the data.

## Databases

Servers keep ledger state data and transactions in a key-value store called the _ledger store_. Additionally, `rippled` maintains a few SQLite database files for more flexible access to things like transaction history, and to track certain settings changes.

It is generally safe to delete all of a `rippled` server's database files when that server is not running. (You may want to do this, for example, if you change the server's storage settings or if you are switching from a test net to the production network.)

## Available History

By design, all data and transactions in the XRP Ledger are public, and anyone can search or query anything. However, your server can only search data that it has available locally. If you try to query for a ledger version or transaction that your server does not have available, your server replies that it cannot find that data. Other servers that have the necessary history can respond successfully to the same query. If you have a business that uses XRP Ledger data, you should be mindful of how much history your server has available.

The [server_info method][] reports how many ledger versions your server has available in the `complete_ledgers` field.

## Fetching History

When it starts, a `rippled` server's first priority is to get a complete copy of the latest validated ledger. From there, it keeps up with advances in the ledger progress. If configured to do so, the server also backfills ledger history up to a configured amount, which must be equal to or less than the cutoff beyond which online deletion is configured to delete.

The server can backfill history from before it became synced, as well as filling in any gaps in the history it has collected after syncing. (Gaps in ledger history can occur if a server temporarily becomes too busy to keep up with the network, loses its network connection, or suffers other temporary issues.) To backfill history, the server requests data from its peer `rippled` servers. The amount the server tries to backfill is defined by the `[ledger_history]` setting.

The XRP Ledger identifies data (on several different levels) by a unique hash of its contents. The XRP Ledger's state data contains a short summary of the ledger's history, in the form of the [LedgerHashes object type](ledgerhashes.html). Servers use the LedgerHashes objects to know which ledger versions to fetch, and to confirm that the ledger data they receive is correct and complete.

Backfilling history is one of the server's lowest priorities, so it may take a long time to fill missing history, especially if the server is busy or has less than sufficient hardware and network specs. For recommendations on hardware specs, see [Capacity Planning](capacity-planning.html). Backfilling history also requires that at least one of the server's direct peers has the history in question. <!--{# TODO: link some info for managing your peer connections when that exists #}-->

### With Advisory Deletion

If [online deletion](online-deletion.html) and advisory deletion are both enabled, the server automatically backfills data up to the oldest ledger it has not been allowed to delete yet. This can fetch data beyond the number of ledger versions configured in the `[ledger_history]` and `online_delete` settings. The [can_delete method][] tells the server what ledger versions it is allowed to delete.


## Full History

Some servers in the XRP Ledger network are configured as "full-history" servers. These servers, which require significantly more disk space than other tracking servers, collect all available XRP Ledger history and **do not use online deletion**.

Ripple provides a set of public full-history servers as a public service at `s2.ripple.com`. This service is provided for the benefit of the larger XRP community. Ripple reserves the right to block those who abuse the servers or use more than their fair share of the servers' resources.

**Tip:** Unlike some cryptocurrency networks, servers in the XRP Ledger do not need full history to know the current state and keep up with current transactions.

For instructions on setting up full history, see [Configure Full History](configure-full-history.html).

## History Sharding

An alternative to storing the full history of the XRP Ledger on a single expensive machine is to configure many servers to each store a portion of ledger history. The [History Sharding](history-sharding.html) feature makes this possible, storing ranges of ledger history in a separate storage area called the _shard store_. When a peer server asks for specific data (as described in [fetching history](#fetching-history) above), a server can answer using data from either its ledger store or shard store.

Online deletion **does not** delete from the shard store. However, if you configure online deletion to keep at least 32768 ledger versions in your server's ledger store, your server can copy full shards from the ledger store to the shard store before automatically deleting them from the ledger store.

For more information, see [Configure History Sharding](configure-history-sharding.html).


## See Also

- **Concepts:**
    - [Ledgers](ledgers.html)
    - [Introduction to Consensus](intro-to-consensus.html)
- **Tutorials:**
    - [Configure `rippled`](configure-rippled.html)
        - [Configure Online Deletion](configure-online-deletion.html)
        - [Configure Advisory Deletion](configure-advisory-deletion.html)
        - [Configure History Sharding](configure-history-sharding.html)
        - [Configure Full History](configure-full-history.html)
- **References:**
    - [ledger method][]
    - [server_info method][]
    - [ledger_request method][]
    - [can_delete method][]
    - [ledger_cleaner method][]

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
