---
seo:
    description: The smallest Clio deployment - one process that both writes and reads, one database node, and one feeding xrpld - for learning, development, and private experiments.
labels:
  - Core Server
---
# Clio Simple Setup

Choose this setup if you are learning [Clio](clio.md), building an application integration, or trying a private proof of concept. One Clio process both writes ledger data and answers your queries. It is the simplest way to understand Clio before operating the [robust setup](clio-robust-setup.md), and for many private uses it is all you ever need.

**Don't choose this for anyone who needs the service to stay up.** If this Clio process, its database, or its feeder fails, service stops or goes stale. Use the robust setup instead.

## Shape of the deployment

One Clio process does both jobs: ingesting ledgers and serving API requests. There is no separate reader pool and no load balancer.

[{% inline-svg file="/docs/img/clio-simple.svg" /%}](/docs/img/clio-simple.svg "Diagram: one synced xrpld source feeds one Clio process that is both writer and reader; a local application queries it; it stores history in one Cassandra node; nothing is redundant")

Clio and the database can share a Linux host for a private exercise if the host has the resources. Keep them on the same host or the same local network, because a historical query is a chain of database round trips and distance multiplies into response time (see [Clio System Requirements](../../prerequisites/system-requirements/clio.md#locality-is-a-requirement-not-a-tuning)). The feeding `xrpld` (formerly `rippled`) can be on another trusted host. "One node" here means one Clio process, not a standalone Clio binary with no dependencies: the database and a synced `xrpld` are still required.

**How requests flow.** The `xrpld` supplies validated ledgers over WebSocket and gRPC; Clio stores them in Cassandra. Your application sends requests to that same Clio process, which answers from the stored data or forwards a fixed set of methods, such as transaction submission and requests for the current ledger, to the `xrpld`. Start the Clio process after the `xrpld` WebSocket port answers: Clio exits at startup if it can't reach any `etl_sources` entry.

The components and the settings this guide assumes for each:

| Component | Purpose | Default for this guide |
|:----------|:--------|:-----------------------|
| Clio | Ingest data and answer queries | `read_only: false` (the default), API bound to localhost or a private address |
| Cassandra | Store ledger history | One persistent node, `database.cassandra.replication_factor` of 1 |
| `xrpld` | Supply validated ledgers | One synced, trusted source on the network you want, with Clio's address in its `secure_gateway` settings |

This guide uses Cassandra for a straightforward first setup; ScyllaDB is an alternative, not an additional database. The installation steps are on [Install Clio on Ubuntu](../../installation/install-clio-on-ubuntu.md); the feeder settings are on [Clio Security](../security/clio.md#the-feeding-servers-are-not-public).

## Before the first ledger

Decide the start ledger first. Clio fills forward from `start_sequence` (or from the feeder's current ledger if you set none) and never backwards, so a store that begins at a recent ledger can only ever answer from that ledger on; see [Choose the start ledger before you fill anything](clio.md#choose-the-start-ledger-before-you-fill-anything). Choosing a recent start does **not** create a rolling retention window: Clio has no online deletion, so the store grows for as long as it runs. Monitor free disk space and ledger freshness from day one.

## What comes next

When an application or a client needs service through host failures or maintenance, move to the [robust setup](clio-robust-setup.md). That move is a new cluster and a reviewed migration or a fresh store, not a change of `replication_factor` in Clio's configuration: the replication factor is a property of the keyspace, applied when the keyspace is created.

## See also

- [Clio](clio.md)
- [Clio Robust Setup](clio-robust-setup.md)
- [Clio System Requirements](../../prerequisites/system-requirements/clio.md)
- [Clio Best Practices](../best-practices/clio.md)
- [Clio Security](../security/clio.md)
- [Install Clio on Ubuntu](../../installation/install-clio-on-ubuntu.md)
