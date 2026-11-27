---
seo:
    description: What a Clio deployment actually costs - the database cluster is the machine, locality is a requirement, and the dataset is about half the size of full history.
labels:
  - Core Server
---
# Clio System Requirements

[Clio](../../../concepts/networks-and-servers/the-clio-server.md) is an API server that reads validated ledger data from one or more `xrpld` (formerly `rippled`) servers, stores it in a Cassandra or ScyllaDB cluster, and answers API queries from that store. Clio itself is a light process. The database cluster behind it is the deployment, and it is sized and operated like one.

{% admonition type="info" name="Dated figures" %}
Measurements on this page come from one production Clio deployment serving public endpoints in 2026 (one writer, five readers, a six-host ScyllaDB cluster holding full history) and from the Clio project's own documentation. Treat them as a shape to plan from, not a specification.
{% /admonition %}

## Three tiers of commitment

| Tier | What it is | Hardware shape |
|:-----|:-----------|:---------------|
| Development | One Clio process and one database node, often Cassandra or Scylla in a container, fed by one `xrpld` with a short start ledger | A workstation or one modest server. Not for anything public. |
| Production, recent history | One writer, one or more read-only Clio readers, a replicated database cluster, two or more feeding `xrpld` servers | Three or more database hosts for replication factor 3, NVMe throughout, readers on the same network as the database |
| Production, full history | As above, with the database holding every ledger since index 32570 | Tens of terabytes of replicated NVMe, a full history `xrpld` or a provider snapshot to fill from, and weeks to fill it |

Almost everyone who thinks they need Clio needs the first tier for a while, and many then discover they don't need Clio at all. See [Clio](../../configuration/server-modes/clio.md#who-should-run-clio) before buying anything. The first tier is written up as the [Clio Simple Setup](../../configuration/server-modes/clio-simple-setup.md); the production tiers are the [Clio Robust Setup](../../configuration/server-modes/clio-robust-setup.md). The sizing guidance below supports both.

## The database is the machine

- **Storage.** NVMe only, local to the database hosts, on a filesystem the database documentation recommends (the production deployment runs XFS). Replication multiplies capacity: at replication factor 3, every byte is stored three times.
- **Memory.** ScyllaDB claims all free memory on a host by default and must be told otherwise if anything else runs there. The production deployment budgets about 300 GB of process memory per database host; that is its configuration, not a minimum.
- **Compute.** Clio readers tend to exhaust memory before CPU. Database hosts are bound by disk and by compaction and repair work, which must be budgeted alongside client reads.
- **Headroom.** Size from representative historical queries and ingestion, not from request counts alone, and leave room for replication, compression, compaction, repair, and the rebuild of a lost host.

## The dataset, measured

A full history Clio store measured about 23.4 TiB (about 25.7 TB) in October 2026, growing about 0.2 TiB a month with on-chain activity. That is a little over half the roughly 44 TB an `xrpld` full history server used for the same ledgers in the same year (see [Full History System Requirements](full-history.md)); the "up to four times less" on [The Clio Server](../../../concepts/networks-and-servers/the-clio-server.md) is the top of the range, not what this deployment measured. The saving is still the main reason Clio exists for history serving. Replication factor 3 makes the raw requirement about three times the dataset.

Filling that store is a project of its own. The production deployment received a snapshot of a full history `xrpld` store (about 40 TB) that took about two weeks to transfer, then two to three weeks more to load into the database. Plan for weeks, not days, before a full history Clio answers its first deep query.

## Locality is a requirement, not a tuning

A historical query is a chain of database round trips, so distance between a Clio reader and its database multiplies into response time. One measured historical `ledger_data` query took 11 to 12 seconds from readers hosted in a cloud region away from the database and 1.2 to 1.5 seconds from readers on the same local network. The operator removed the remote readers from service: they couldn't be made comparable. "Near" means the same rack or the same LAN.

Two consequences for sizing:

- Put readers where the database is. A reader in another region is a different system with its own database, not a remote reader.
- Adding readers doesn't relieve a slow database. It adds load to it. Add database capacity first, then readers.

## The feeding servers

Clio needs one or more `xrpld` servers in P2P mode, reachable over both WebSocket and gRPC, with Clio's address listed in each server's `secure_gateway` setting. They are ordinary stock servers with one sizing rule of their own: their retained history must cover the longest outage you expect of them. Clio resumes from the last ledger it stored, and if the feeding server has already deleted that ledger, Clio can't continue until history is backfilled or the gap is filled another way. Keep days of history on the feeders if days of downtime are possible. The shipped configuration keeps only 512 ledgers (`online_delete=512`), about half an hour, so a feeder on defaults can't cover even a short outage; a day is about 22,000 to 25,000 ledgers. See [Configure Online Deletion](../../configuration/data-retention/configure-online-deletion.md) for the setting and [Stock Node System Requirements](stock-node.md) for the servers themselves.

## Network

Readers serve clients, so bandwidth scales with your API traffic rather than with the ledger. Internally, the writer's traffic to the feeding servers is modest. Two links must be fast: reader to database, and the links between the database hosts themselves, which carry replication, repair, and the rebuild of a lost host; follow the database's own networking guidance when you plan the cluster rather than sizing only the reader side.

## Rough cost

A production Clio deployment costs what its database cluster costs: several NVMe-heavy hosts, owned or rented, plus the feeding servers. The operator behind the figures above runs it alongside a full history `xrpld` and public endpoints without external funding, and describes snapshots and extra redundancy as the first things that budget pressure removes. Decide what recovery you can afford before you fill the cluster, because the decision is much harder afterwards.

On hosting, the same deployment is the only evidence we have, and it points one way. The database cluster, the writer, and the full history feeder run on owned hardware in a colocation facility, after an early period on cloud credits that ended in bills the operator describes as extremely high. An attempt to place readers in a cloud region away from the database failed on latency (see above) and those readers were withdrawn. For this role, rented cloud capacity fits the development tier; a production cluster is owned NVMe hosts in one place, with the readers beside them.

## See also

- [Clio](../../configuration/server-modes/clio.md)
- [Clio Best Practices](../../configuration/best-practices/clio.md)
- [Clio Security](../../configuration/security/clio.md)
- [Install Clio on Ubuntu](../../installation/install-clio-on-ubuntu.md)
- [Full History System Requirements](full-history.md)
- [Capacity Planning](../capacity-planning.md)
