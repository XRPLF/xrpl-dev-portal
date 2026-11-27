---
seo:
    description: Operate Clio day to day - writer lag, the alert set, what unhealthy looks like before failure, recovery, upgrades, and the backup question.
labels:
  - Core Server
---
# Clio Best Practices

This page covers operating Clio after it is running: what healthy looks like, what to alert on, what failure looks like before it happens, and the decisions that are cheap before the database is full and expensive after. The feeding servers are ordinary `xrpld` (formerly `rippled`) stock nodes; their own operation is covered on the [stock node pages](stock-node.md). For the architecture and the start-ledger decision, see [Clio](../server-modes/clio.md). The practices here come from one production deployment serving public endpoints and from the Clio project's documentation.

## Know what healthy looks like

| Signal | Healthy | Where to read it |
|:-------|:--------|:-----------------|
| Writer lag | The writer's validated ledger is 1 to 2 ledger intervals behind the network, a few seconds | `server_info` on the writer (`validated_ledger.age`) |
| Reader freshness | Readers report the same latest ledger as the writer, within seconds | `server_info` on each reader |
| Cache | `is_full` true, `is_enabled` true | `server_info` (`cache` object) |
| Historical query time | Stable and close to the database's own read latency; the production reference is a historical `ledger_data` in about 1.5 s with readers beside the database | Your gateway metrics |
| Database read p99 | Under about 200 ms on the Clio keyspace | Database metrics |
| Rejections | No "too busy" responses, no DoS guard rejections for legitimate clients | Clio metrics, gateway logs |

The writer-lag ladder one operator uses: under 10 seconds is normal as long as the ledger keeps advancing; 15 to 20 seconds sustained for about a minute means investigate the feeding servers, extraction progress, and database pressure; over 30 seconds or no progress means intervene, looking for competing workloads and failing dependencies; 60 seconds or more is urgent, and it is the point where Clio itself attaches warning 2002, "This server may be out of date", to every response: the threshold is fixed at 60 seconds since the close time of the last ledger that process published, isn't configurable, and is per process, so a stalled reader shows it too.

## Alert on the right things

The first published Clio alert set, from a deployment that runs Prometheus, Grafana, and Alertmanager against Clio, ScyllaDB, and the gateway. Each rule has a condition and a persistence window, so transient spikes don't page:

| Alert | Condition | Must persist |
|:------|:----------|:-------------|
| Reader ledger stale | Validated ledger age over 30 s | 2 min |
| Subscription source stale | No message from the feeding server for 30 s | 2 min |
| Writer publication inactivity | No new ledger published for 60 s | 5 min |
| Ingestion stalled | Keyspace write rate zero over 10 min while the network advances | A further 10 min |
| Database read timeouts | Read timeout rate above zero | 2 min |
| Database write timeouts | Write timeout rate above zero | 2 min |
| Pending compactions | More than 100 per database instance | 10 min |
| Failed compactions | Any in the last 10 min | Immediate |
| Keyspace read p99 | Over 200 ms | 10 min |
| Gateway backend latency | Average over 2 s | 5 min |
| Host CPU or memory | Over 90% | 10 min |
| Filesystem | Over 90% full | 15 min |

Two of those rows need adapting before you copy them. ScyllaDB claims all free memory on its hosts by design, so a memory-percent rule fires constantly there: alert on `MemAvailable` on the Clio hosts and on the database's own metrics on the database hosts, as [Monitoring](../../prerequisites/monitoring.md) says. And ScyllaDB's guidance is to keep 20% to 50% of disk free for compaction, so a filesystem alert at 90% full arrives after compactions are already at risk; 30% free is the safer line.

Most of these signals come from `server_info`. The `etl` object (`etl_sources`, with `last_msg_age_seconds` for each feeding server, plus `is_writer`, `read_only`, and `last_publish_age_seconds`) is returned only to admin callers, which means requests whose client address is exactly `127.0.0.1` (the default, or `server.local_admin`; IPv6 `::1` doesn't count) or requests that supply the admin password; a monitor on another host sees no `etl` object unless it sends the password. Any caller sees `amendment_blocked` and `corruption_detected` when either is true, so alert on those two as well.

Three rules of thumb that the list encodes:

- **Alert on data freshness, not on process health.** A container can be healthy, an HTTP check can return 200, and the data can be minutes old. Every alert above proves something about ledger progress or query latency, not about a process being alive.
- **Watch the database as a first-class citizen.** Most Clio incidents are database incidents seen through Clio. Compactions, repairs, and read tails show up in Clio response times before any database host reports itself unhealthy.
- **Don't let health checks become load.** One operator traced writer rejections to its own monitoring probing the writer too often while it also served clients. Probe the writer lightly and keep clients off it.

The Clio repository ships an [example monitoring stack](https://github.com/XRPLF/clio/tree/2.8.0/docs/examples/infrastructure) (Prometheus and Grafana with a sample dashboard) that the Clio team labels a demonstration rather than a recommendation; it is a good starting point for the metric names.

## What unhealthy looks like before it fails

Clio degrades in a recognizable order:

1. RPC tail latency rises and pending database reads climb, while every database host still reports itself up and normal.
2. Clio starts rejecting work. Its request queue (`server.max_queue_size`, default 1000) fills and new requests get a busy response; outstanding database reads approach their configured ceiling.
3. Responses carry warning 2002, "This server may be out of date"; ledger events arrive late or not at all; the writer's published sequence falls behind what the database holds.
4. The cache reports `is_enabled` false (Clio disables it when it detects corruption, and `server_info` then shows `corruption_detected`; it also reads false if the cache is turned off in the configuration) or its sequence stops advancing.

Act at step one. By step three, clients are already seeing stale data.

## Isolate the writer

The writer's only job is ingestion. Keep it out of the client pools, out of the public gateway, and off the list of hosts your monitoring hammers. A writer that also serves clients was the one place "too busy" rejections were measured in production. Readers are disposable; the writer is the one process whose lag everyone downstream inherits.

## Add readers for the right reason

Add a reader, next to the database, when sustained latency, rejection rates, or maintenance windows justify it. Don't add one to fix a slow database: another reader is another client of the database and can make the pressure worse. If historical queries are slow and the database is busy, the fix is database capacity or locality, not Clio capacity.

## Restart with care

- **Writer restart is the recovery tool.** If ingestion stops and the feeding servers are fine, a graceful restart of the writer process alone, leaving the database and its volumes untouched, is the first move. In one production incident after a rollout, the operator found that an out-of-date persisted cache had stopped the writer resuming its role; restarting just the writer container cleared it with no data reset. If you persist the ledger cache to a file (`cache.file.path`), know that Clio rejects a file whose latest ledger is further behind the database than `cache.file.max_sequence_age` (default 5000 ledgers) allows. Clio gives itself `graceful_period` (default 10 seconds) to finish a clean shutdown; after that it exits itself with a failure status, and a second signal exits at once. Give the unit or container a stop timeout at least that long, and longer if you raise the setting.
- **Readers can be restarted without a data reset, one at a time.** Clients on a restarted reader reconnect through the gateway. Each restarted process reloads its ledger cache from the database (unless it loads a cache file), with `cache.num_markers` concurrent loaders (48 by default), and a reader is slow until it has; `cache.is_full` tells you when. Wait for it before you restart the next reader. If several processes may restart together, `cache.limit_load_in_cluster` lets only one of them load its cache at a time.
- **Feeding server restarts matter more than Clio restarts.** Clio resumes from the ledger after the last one stored, and the feeding `xrpld` must still hold that ledger. If the feeder was down long enough to have deleted it, Clio waits indefinitely. Keep feeder retention proportional to the downtime you expect; see [Clio System Requirements](../../prerequisites/system-requirements/clio.md#the-feeding-servers).

## Upgrade deliberately

Clio must know every live amendment or its extraction stops. Read each Clio release's amendment list, upgrade before new amendments reach activation, and check `server_info` on the writer after every `xrpld` upgrade as well, since the feeding servers and Clio move independently. Upgrade readers first and the writer last, so a bad release costs you a reader and not ingestion. Operators report Clio has otherwise been stable across many `xrpld` releases.

## Decide the backup question before the cluster is full

Replication is availability, not backup. A replication factor of 3 keeps the service running through the loss of one host, or two disks in different replica sets, and does nothing against a bad migration, an operator error, or a lost cluster. The honest recovery plan for a lost cluster is a rebuild: a new cluster, then a refill from a database snapshot if you kept one, or from a full history `xrpld` if you didn't, which takes weeks. One production operator runs exactly that plan, without snapshots, because the budget doesn't stretch to them, and says so plainly. Make the same decision consciously: snapshot storage for a 23 TiB dataset is a line item, and the alternative is a multi-week outage of historical service. Configuration, dashboards, and alert rules belong in version control regardless.

## See also

- [Clio](../server-modes/clio.md)
- [Clio System Requirements](../../prerequisites/system-requirements/clio.md)
- [Clio Security](../security/clio.md)
- [Monitoring](../../prerequisites/monitoring.md)
- [Backup and Recovery](../../prerequisites/backup-and-recovery.md)
- [Clio troubleshooting guide](https://github.com/XRPLF/clio/blob/2.8.0/docs/trouble_shooting.md) in the Clio repository (2.8.0)
