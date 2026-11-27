---
seo:
    description: Monitor xrpld servers - the alerts that matter, the doctrine from production fleets, and the traps that make monitoring lie.
labels:
  - Core Server
---
# Monitoring

Every production operator interviewed for these docs built their own monitoring, because nothing told them what to watch. This page is the distillation: what actually fails, which alerts caught real incidents across years of production operation, and the traps that make a green dashboard lie to you.

## Three rules before any tooling

1. **Monitor from outside the host.** The failure that matters most takes your monitoring down with it. Multi-hour outages in production happened precisely because the dashboards lived on the server that died. At minimum, one external check that pages you; ideally, external synthetic probes of whatever the server exists to serve.
2. **Prove freshness, not liveness.** A process check, an open port, and an HTTP 200 can all be green while the server is behind or its data is stale. Gate on ledger age and ledger advancement, and for serving infrastructure, run a real query as the check.
3. **Test that alerts reach someone.** An alert rule that fires into a dead channel is monitoring theater. Production operators discovered silent weeks-old breakage only by auditing delivery.

## The alert set

Three professional fleets' alert histories, years deep, converge on the same core. Every rule below caught at least one real incident in production:

| Alert | Suggested threshold | What it catches |
|:------|:--------------------|:----------------|
| Consensus agreement / missed validations | any sustained misses; investigate > a handful per hour | The one that matters on a validator: every real firing mapped to a nameable event |
| Validated ledger age | watch at 15 s, alert at 30 s | Fallen behind, for any reason |
| Server state | not `full`, `validating`, or `proposing` for more than a few minutes | Sync loss |
| Validator participation | a validator not `proposing` for more than a minute or two, read over an admin connection (a non-admin connection reports `full` for both) | A validator that has stopped proposing while still synced |
| Peer count, **both directions** | sudden drops; departures from the server's normal band | Peering incidents - totals hide splits: one network-wide incident never crossed a simple floor threshold while hubs bled peers in waves |
| Process uptime reset | any unexpected reset | Silent restarts: one operator found three OOM kills weeks later because `systemd` restarted fast enough that every dashboard stayed green |
| MemAvailable | stays under about 2 to 3 GB for minutes, not a brief dip | Real memory pressure - "used" memory is mostly page cache and is supposed to look high; `/proc/pressure/memory` stall time confirms it is real |
| Disk free & runway | 30% headroom; projected weeks of runway | Every volume the server writes to: the ledger store, the `[database_path]` volume, and the log. `transaction.db` doesn't shrink when rows are deleted, although SQLite reuses the freed space. The server's own stop at 512 MB free watches only the `[database_path]` volume, and only while `use_tx_tables` is on, so a ledger store on its own drive, or a server without transaction tables, needs its own alert |
| Swap-in activity | sustained pages read back from swap (alert on swap-in, never on swap used) | Early warning that proved itself repeatedly. Stale pages can sit in swap for weeks on a healthy host |
| Version drift | advertised vs expected; any `amendment_blocked` or `warnings` entry in admin `server_info` | One fleet ran 12 days on a version mismatch only this rule caught |
| Validator list expiry | any list with `available: false`, or an `expiration` under three days away ([validators method][]) | An expired list leaves the server unable to judge validity, and the failure is otherwise invisible until it happens |
| Clock sync | the NTP client reports unsynchronized | Ledger age is measured against the local clock, so a drifting clock corrupts that signal first. The server trusts the system clock; current versions read no `[sntp_servers]` stanza |


Role additions: hubs watch peer-disconnect rate and convergence time ([Hub Best Practices](../configuration/best-practices/hub.md#what-healthy-looks-like)); serving fleets watch IO latency and queue depth; full history watches the [storage ceilings](../configuration/best-practices/full-history.md#watch-the-ceilings).

## Traps that make monitoring lie

- **The `/health` endpoint** on the peer port returns an error status for any server with 7 or fewer peers (critical at none), however healthy, and a critical status when `load_factor_server` reaches 1,000 times `load_base` (a warning once it exceeds 100 times), which can happen under network-wide load while agreement stays perfect. Those are measured conditions, not verdicts on the role, but the defaults don't suit every deployment: a validator peered only with its own proxies never passes the peer count, and a quiet test network can trip the ledger-age warning while the server is fine. Gate those servers on admin [server_info][server_info method] instead.
- **Memory "used" percent** is the page cache doing its job. Alerting on it produces noise and then numbness; alert on MemAvailable.
- **After a restart**, the ledger range reports empty until sync and back-fills slowly. A freshness alert must allow the window, or operators learn to ignore it. See [Understanding Log Messages](../troubleshooting/understanding-log-messages.md#need-consensus-ledger).
- **Your own node's view of itself isn't ground truth.** Validators confirm agreement against external explorers and validator statistics, and client-serving fleets compare ledger height between their own servers and public references. One production fleet alerts at a ~5 ledger difference (warning) and 50 (critical) against both public servers and commercial RPC providers - a cheap cross-check that also tells you when the problem is theirs, not yours.

## Proportionate monitoring

A server only you depend on doesn't need PagerDuty. Working patterns from small operators: a cron job that alerts on *success*, so silence means look (immune to the dead-relay problem); a dashboard rendered into the SSH login banner, so health is seen on every login; rules file empty but checked daily by eye. The doctrine scales down - external, freshness, delivered - even when the tooling is a shell script.

## See Also

- [Understanding Log Messages](../troubleshooting/understanding-log-messages.md) - alert on signatures, not volume
- [Health Check Interventions](../troubleshooting/health-check-interventions.md)
- Per-role operations: [Validator](../configuration/best-practices/validator.md) / [Stock](../configuration/best-practices/stock-node.md) / [Hub](../configuration/best-practices/hub.md) / [Full History](../configuration/best-practices/full-history.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
