---
seo:
    description: Run an XRP Ledger full history server - role, configuration shape, and serving patterns from production deployments.
labels:
  - Core Server
---
# Full History

A full history server is an `xrpld` (formerly `rippled`) server that retains every ledger version from index 32570 (the earliest retained Mainnet ledger) to the advancing tip. The network needs a small number of these so that any past transaction or ledger state remains publicly answerable; everything else can, and should, keep less.

Before building one, read [Full History System Requirements](../../prerequisites/system-requirements/full-history.md) - the scale and economics select who can realistically run this role.

## Who runs full history, and for whom

Production full history servers exist to feed things: explorers, indexers (including [Clio](clio.md)-style databases built by walking history), analytics and research, and public data services. They aren't general-purpose public endpoints. In production they sit behind load balancers that route only the queries other servers can't answer - requests for history too old for the recent-history fleet - so the expensive servers do the work only they can do.

## Configuration shape

The defining settings:

```
[ledger_history]
full

[node_db]
type=NuDB
path=/var/lib/xrpld/db/nudb
```

- `ledger_history` is `full`, and there is **no `online_delete`** - deletion and full history are opposites. (`advisory_delete` is read only when `online_delete` is set, so it has no place here either.)
- The path above is the packaged default. A full history store almost always lives on its own array; point `path` at that mount, and keep the same path on every page of your own procedure so you don't end up with two stores.
- The backend must be NuDB at this scale.
- Set the SQLite page size for `transaction.db` **before first start**; see [Configure Full History](../data-retention/configure-full-history.md). It can't be changed later without rebuilding a database measured in terabytes.

A production full history config differs from a stock server in several more deliberate ways:

```
[node_size]
huge

[node_db]
# in addition to the keys above:
cache_size=9000000
cache_age=600

[peer_private]
1

[peers_max]
10

[ips_fixed]
<your other server> <its peer port>
<a chosen peer> <its peer port>

[path_search_max]
0
```

- **Thread tuning, after measuring.** Serving history is parallel work, and production full history servers set `[workers]`, `[io_workers]` and `[prefetch_workers]` explicitly. Start from the defaults: unset, `workers` is derived from the core count and `node_size` and never exceeds 14 (6 plus the smaller of the core count and 8 at `huge` on a 16-core or larger host), `io_workers` is 6 on any host with more than two cores and `prefetch_workers` is 4. The example file's comment that `workers` is "processor threads plus 2" is out of date. Raise them only after measuring during the dry-run period, because the right values depend on the core count of the machine in front of you.
- **Private, fixed peering.** A full history server doesn't need or want open peer discovery: it peers with its operator's other servers and a few chosen peers (`[ips_fixed]`), keeping its capacity for serving rather than relaying. With `[peer_private]` and no `[ips_fixed]`, the server makes no outbound connections at all. With `[peer_private]` set, the server connects only to its `[ips_fixed]` peers, and fixed peers don't count toward `[peers_max]`, so the setting has no effect here and can be omitted (`[peers_in_max]` and `[peers_out_max]` don't change that); the example keeps `peers_max` 10 as a statement of intent. See [Configure a Private Server](../peering/configure-a-private-server.md).
- **Pathfinding off** (`path_search_max = 0`). Path queries are the most expensive requests a server can answer, and a full history server's capacity is for serving history; operators who run this role disable them.

## Serving patterns

- **Don't expose it raw.** Public traffic goes through front ends (load balancers, gateways, or an indexer layer) that enforce limits and route by ledger range. The full history fleet is the origin tier, not the edge.
- **Admin stays gated.** If admin ports bind beyond loopback for fleet tooling, the `admin` allowlist plus a host firewall carry the responsibility; see [Full History Security](../security/full-history.md).
- **Clio and indexers:** the link that needs locality is the one between the indexer and its own database - measured query latency differs by nearly 10x between an indexer near its database and one far from it. A full history Clio database is filled from a full history server (or a snapshot of one) once; after that, ordinary stock servers keep it current.

## Verify it's doing its job

- `server_info`: `complete_ledgers` should read `32570-<tip>` once history is complete. Anything with gaps means acquisition is still running or something was lost.
- Serve a genuinely old query (an `account_tx` or `ledger` request from years back) as a routine health check: a full history server whose old data can't be served is failing at the one thing it exists for.
