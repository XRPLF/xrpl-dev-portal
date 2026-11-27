---
seo:
    description: A Clio deployment built for availability - writer-capable nodes on one ScyllaDB cluster, a load-balanced pool of read-only readers, redundant feeders, and tested writer takeover.
labels:
  - Core Server
---
# Clio Robust Setup

Choose this setup when clients depend on the API staying usable through a host failure or planned maintenance, with a defined limit on how stale its data may become. Typical operators are application teams whose customers depend on the API, infrastructure providers serving several clients, and anyone who can't take the whole service offline to update a server.

Don't choose it to learn [Clio](clio.md). It needs database expertise, several hosts, monitoring, and a tested recovery procedure. Start with the [simple setup](clio-simple-setup.md) if downtime is acceptable. The sizing behind every component is on [Clio System Requirements](../../prerequisites/system-requirements/clio.md).

## Components and what each one covers

Writers ingest validated ledgers from `xrpld` (formerly `rippled`) into ScyllaDB; readers serve API requests from that data. Both run the same Clio software, and one process can do both jobs. This deployment separates the responsibilities: `read_only` controls whether a process may ingest, and client routing keeps traffic away from the writers. It isn't an API authorization mechanism.

The components, the topology to start with, and the failure each one covers:

| Component | Role and configuration | Starting topology | Failure covered |
|:----------|:-----------------------|:------------------|:----------------|
| Writers | Ingest ledgers with `read_only: false`; excluded from client routing | Two writer-capable nodes on separate hosts, sharing one keyspace | Loss of either writer host, within a tested takeover time |
| Readers | Serve queries with `read_only: true`; also connect to `xrpld` for subscriptions and forwarded requests | At least two on separate hosts | A reader failure, and rolling maintenance |
| ScyllaDB | Store the shared ledger history | At least three hosts, replication factor 3, rack-aware placement | Loss of one replica at quorum |
| Feeders | Supply validated ledgers over private WebSocket and gRPC | At least two synced `xrpld` servers on separate hosts | Loss of one source, within the history the others retain |
| Gateway | Route client requests to healthy readers | A managed load balancer with its own redundancy, or redundant gateways | Loss of one ingress instance |

**What it doesn't cover.** Read-only readers can't take over ingestion: if ingestion stops, they keep serving stored history, but freshness degrades until a writer resumes. Redundancy at every layer, not extra readers or database replication alone, is what keeps the service available. Agree on availability, maximum ledger age, recovery time, and acceptable data loss before you size anything, and commit to them only after you have tested the design.

## Ingestion: writer-capable nodes on one shared database

[{% inline-svg file="/docs/img/clio-robust-ingestion.svg" /%}](/docs/img/clio-robust-ingestion.svg "Diagram: two private ingestion paths, xrpld A to Clio Writer A and xrpld B to Clio Writer B; both writers run with read_only false, share one ScyllaDB keyspace, and serve no client traffic")

Run Writer A and Writer B on separate hosts, both connected to the same ScyllaDB cluster and keyspace, with `read_only: false` on both so either can ingest. Keep both behind the firewall and out of every client-facing load balancer.

Clio's own arbitration decides which one writes. Each process records its state in the keyspace every second; the writer-capable node with the lowest random node id whose extraction has started and whose ledger cache is full takes the writer seat, and the other stands by. If the stored ledger stops advancing for 10 seconds the standby takes over, and a conditional write on the ledger range makes a node that loses a write race back off, so at any moment one node is writing. A standby can't take over until its own cache is full, so takeover time is bounded by cache load. Start one writer first against a new keyspace: only a writer-capable process creates the schema, and a `read_only: true` process started against an empty keyspace refuses to start. That gives failover without keeping the second node stopped. Two cautions from production: the one operator running Clio behind public endpoints in the 2026 survey runs one process intended to write and reports that competing writers put strain on ScyllaDB, so don't let more than two nodes contend; and takeover isn't instant, so test writer loss with the release you run and measure how long ingestion takes to resume and how stale the readers get meanwhile.

Use at least two synced `xrpld` servers in P2P mode on the same network, and configure both sources on both writers rather than pairing each writer with one source, so either writer can use whichever source is synced and still holds the ledgers it needs. The A and B labels name hosts, not exclusive pairings.

The fragment below goes into both writers' configurations; it isn't a complete file. Replace the placeholders with your private addresses and shared keyspace, and supply the database credentials and TLS settings described in [Clio Security](../security/clio.md#supply-and-secure-database-credentials). Clio uses its `cassandra` backend for ScyllaDB. Check every key against the [configuration reference](https://github.com/XRPLF/clio/blob/2.8.0/docs/config-description.md) for the release you run.

```json
{
  "read_only": false,
  "database": {
    "type": "cassandra",
    "cassandra": {
      "contact_points": "SCYLLA_A_PRIVATE_IP,SCYLLA_B_PRIVATE_IP,SCYLLA_C_PRIVATE_IP",
      "port": 9042,
      "keyspace": "YOUR_SHARED_KEYSPACE"
    }
  },
  "etl_sources": [
    {
      "ip": "XRPLD_A_PRIVATE_IP",
      "ws_port": "6005",
      "grpc_port": "50051"
    },
    {
      "ip": "XRPLD_B_PRIVATE_IP",
      "ws_port": "6005",
      "grpc_port": "50051"
    }
  ]
}
```

Configure the same source list on the readers. Readers use their source connections for forwarding, subscriptions, and network information; `read_only: true` keeps them out of ingestion arbitration.

## Client queries: a load-balanced pool of readers

[{% inline-svg file="/docs/img/clio-robust-queries.svg" /%}](/docs/img/clio-robust-queries.svg "Diagram: API clients reach a redundant gateway, which routes only to read-only Clio readers; the readers query the same ScyllaDB cluster the writers fill; readers and database stay behind the firewall on one low-latency network")

The load balancer sends each request to a healthy reader (round-robin and least-connections both work), checks readiness and freshness, and drains a reader before maintenance. WebSocket sessions stay on the reader that accepted them; a reconnecting client may land on another. Use redundant gateways or a managed load balancer so ingress itself isn't a single point of failure.

Readers read the database directly; requests never pass through the writers, and the writers stay out of the backend pool. Readers are stateless against the shared database, so the pool grows without duplicating the dataset. Larger services run separate pools for HTTP queries, WebSocket sessions, and forwarded submissions, all read-only; the production pattern is on [Clio Best Practices](../best-practices/clio.md#isolate-the-writer).

## Keep readers beside their database

Keep the whole reader pool on the same low-latency local network as the database cluster. Readers being near each other isn't enough if they are all far from the database: historical queries make many database round trips, so distance compounds, and another region, or even a distant host in the same cloud region, isn't equivalent to the same LAN. The measured figures are on [Clio System Requirements](../../prerequisites/system-requirements/clio.md#locality-is-a-requirement-not-a-tuning).

Spread readers and database replicas across hosts, racks, or other failure domains without giving up that locality. Use local NVMe for database storage and rack-aware placement for replication factor 3, which means creating the keyspace yourself with `NetworkTopologyStrategy` before the first writer starts; Clio's own keyspace uses `SimpleStrategy`, which ignores racks. At quorum, replication factor 3 tolerates one unavailable replica for a row, not several failures at once, and replication isn't a backup; see [Decide the backup question before the cluster is full](../best-practices/clio.md#decide-the-backup-question-before-the-cluster-is-full).

Adding readers doesn't fix a saturated database or a slow link. A deployment in another region needs its own database and its own recovery plan, not distant readers attached to this cluster.

## Ongoing operation

Upgrade readers one at a time: drain, upgrade, wait for `cache.is_full` and fresh ledgers, then the next. Upgrade the writers one at a time with a tested takeover plan, confirming ingestion and ledger freshness before you move to the second. Read each release's notes for amendment support and schema compatibility before any upgrade or rollback. Keep database repair, snapshots, restore procedures, disk capacity, and feeder retention under regular review. Add readers for reader capacity; they don't fix a slow database. The day-to-day signals and the alert set are on [Clio Best Practices](../best-practices/clio.md).

## See also

- [Clio](clio.md)
- [Clio Simple Setup](clio-simple-setup.md)
- [Clio System Requirements](../../prerequisites/system-requirements/clio.md)
- [Clio Best Practices](../best-practices/clio.md)
- [Clio Security](../security/clio.md)
- [How to run Clio](https://github.com/XRPLF/clio/blob/2.8.0/docs/run-clio.md) in the Clio repository (2.8.0)
