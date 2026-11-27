---
seo:
    description: Run a Clio server - who should, who should not, the two deployment shapes, choosing a start ledger, sourcing history, and checking that it works.
labels:
  - Core Server
---
# Clio

Clio is an XRP Ledger API server. It doesn't join the peer-to-peer network. It extracts validated ledger data from one or more `xrpld` (formerly `rippled`) servers over gRPC and WebSocket, writes that data to a Cassandra or ScyllaDB cluster in a compact form, and answers API requests from the cluster. For the concept, see [The Clio Server](../../../concepts/networks-and-servers/the-clio-server.md). For the installation steps, see [Install Clio on Ubuntu](../../installation/install-clio-on-ubuntu.md). This page is about whether to run it, which shape to run, and the decisions to make before the first ledger is stored.

Read [Clio System Requirements](../../prerequisites/system-requirements/clio.md) first. The database cluster, not Clio, decides what this role costs.

## Who should run Clio

Run Clio when at least one of these is true:

- **Historical queries dominate your traffic.** Account histories, old ledgers, NFT and token history. This is what Clio's store is built for, and what makes a plain `xrpld` slow or impossible past its retention window.
- **You need more than days of history and can't afford a full history `xrpld`.** Clio stores the same ledgers in less space: the one measured production store is a little over half the size of an `xrpld` full history store for the same ledgers (see [Clio System Requirements](../../prerequisites/system-requirements/clio.md#the-dataset-measured)).
- **API load is hurting your `xrpld`.** Readers take the request volume; the feeding servers only have to stay synced.

Don't run Clio when:

- **You need live subscriptions and shallow lookups.** A stock `xrpld` does that well on its own, and Clio adds a database cluster for no gain. Clio forwards a fixed set of methods, including transaction submission and anything about the current or closed ledger, to the feeding server anyway.
- **One stock server already copes.** Two newcomers in the 2026 operator survey installed Clio because they assumed it was required, found it overtaxed their machine, and removed it. It isn't required for anything.
- **You can't commit to operating a database cluster.** An operator running Clio behind public endpoints for years names the learning curve of running ScyllaDB as the real cost. Clio itself is the easy part.

If the first list is empty and you only want faster API responses, start with a well-sized [stock node](stock-node.md) and revisit.

## Two deployment shapes

Every Clio process can both ingest ledgers and answer queries; `read_only: true` is what turns a process into a pure reader. That gives two shapes, written up as separate guides:

| Guide | Who it is for | What it shows |
|:------|:--------------|:--------------|
| [Clio Simple Setup](clio-simple-setup.md) | Developers learning Clio, testing an integration, or running a private proof of concept where downtime is acceptable | The smallest deployment: one Clio process that writes and reads, one database node, one feeding `xrpld`. No reader pool, no redundancy. |
| [Clio Robust Setup](clio-robust-setup.md) | Application teams, infrastructure providers, and operators whose clients depend on the API through failures and maintenance | Writers separated from a load-balanced pool of read-only readers, a replicated ScyllaDB cluster, redundant feeders, and writer takeover. A reference architecture for availability and capacity planning. |

The guides answer different operational needs; they aren't stages of one installation. How much history the store holds is a separate decision (below), not a third shape.

Whatever the shape, three things are always true:

- **One writer at a time.** Clio processes coordinate through the database: each records its state in the keyspace every second, and the writer-capable process with the lowest random node id whose extraction has started and whose ledger cache is full becomes the writer; the others stand by. If the stored ledger stops advancing for 10 seconds a standby takes over, and a conditional write on the ledger range makes a process that loses a write race back off. A standby can't take over until its own ledger cache is full, so takeover time is bounded by cache load, not by the 10-second stall detection. The protocol guarantees one writer at a time, but writers competing for the role put avoidable load on the database, so production deployments run one process intended to write, isolated from client traffic, and pin every other process with `read_only: true`.
- **Several feeding servers, one set.** List two or more `xrpld` servers in `etl_sources`; Clio load-balances extraction across them and keeps going as long as one is synced, and every Clio process should list the same set. Each feeder needs a `[port_grpc]` stanza and a WebSocket port that list Clio's address in `secure_gateway` (see [Clio Security](../security/clio.md#the-feeding-servers-are-not-public)); in `[port_grpc]` the entries must be single addresses, not subnets or `0.0.0.0`. Sources in another region pull database traffic across regions; if you need a regional presence, build a second deployment with its own database there.
- **The database is the deployment.** Cassandra or ScyllaDB, one keyspace for Clio, local NVMe. In production, replication factor 3 with hosts placed across failure domains: Clio talks to the cluster at quorum consistency, so the cluster tolerates one replica of any given row being unavailable, which is protection against one host failing, not against arbitrary combinations.

## Choose the start ledger before you fill anything

Clio writes forward from the first ledger it stores and never backwards. On an empty database it begins at `start_sequence` if you set one, otherwise at the feeding server's current ledger. On a database with data, it resumes at the ledger after the latest one stored. There is no way to add earlier history later: a store that begins at ledger 100,000,000 can only ever answer from 100,000,000 onwards, and the only route to earlier ledgers is a new store filled from scratch.

So decide first what the deployment is for:

- **Recent history only.** Set `start_sequence` to a ledger a comfortable margin before the earliest you need, make sure the feeding server actually holds it, and let Clio fill from there.
- **Full history.** You need a source that holds every ledger from 32570: your own [full history server](full-history.md), or a snapshot from an operator who runs one. Expect the transfer and the fill to take weeks. The one production full history Clio in the 2026 survey took roughly two weeks to receive a 40 TB snapshot and two to three weeks more to load it.

`finish_sequence` exists for the opposite case, a store that stops just before a fixed ledger (the last ledger written is `finish_sequence` minus one), and is rarely what an operator wants.

## Version coupling

Clio decodes ledger data itself, so it must understand every amendment that is live on the network. The Clio release notes state which amendments each version supports; if an amendment Clio doesn't know becomes enabled, Clio's extraction stops and it reports itself as amendment blocked until upgraded. Treat Clio releases the way you treat `xrpld` releases: watch the [Clio releases](https://github.com/XRPLF/clio/releases), upgrade before amendments you haven't got reach their activation date, and check Clio's `server_info` after every `xrpld` upgrade. In practice operators report Clio has run unchanged across many `xrpld` releases; the discipline is for the exceptions.

## Verify it is doing its job

- `server_info` against a reader: the validated ledger `seq` advances, and `cache.is_full` is true once the ledger cache has loaded. Until it is, responses are slow and that is expected.
- `server_info` against the writer: the ledger age stays within a few seconds. Clio adds a warning with id 2002, "This server may be out of date", when it has fallen behind.
- A real historical query, against a ledger well before the start of any cache, returns in the time your users will accept. A container that is healthy and a process that answers prove nothing about historical service; only a historical query does.

## See also

- [Clio Simple Setup](clio-simple-setup.md)
- [Clio Robust Setup](clio-robust-setup.md)
- [Clio System Requirements](../../prerequisites/system-requirements/clio.md)
- [Clio Best Practices](../best-practices/clio.md)
- [Clio Security](../security/clio.md)
- [Install Clio on Ubuntu](../../installation/install-clio-on-ubuntu.md)
- [Clio configuration reference](https://github.com/XRPLF/clio/blob/2.8.0/docs/config-description.md) and [How to run Clio](https://github.com/XRPLF/clio/blob/2.8.0/docs/run-clio.md) in the Clio repository (2.8.0)
- [Full History](full-history.md)
- [Clio methods](../../../references/http-websocket-apis/public-api-methods/clio-methods/index.md)
