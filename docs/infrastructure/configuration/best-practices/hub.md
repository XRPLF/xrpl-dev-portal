---
seo:
    description: Operate a public XRP Ledger hub day to day - health signals, restarts, updates, and peer reservations.
labels:
  - Core Server
---
# Hub Best Practices

This page covers operating an `xrpld` (formerly `rippled`) hub after it is set up: what healthy looks like, what fails first, and the operational habits of fleets that have run public hubs for years. For setup, see [Hub](../server-modes/hub.md).

## What healthy looks like

On a properly provisioned hub, the machine itself is quiet. A year of monitoring across one production fleet averaged about 1% CPU, under 20% memory use, and under 2% disk utilization at 300 peers. The signals that matter are about the network, on top of the common set in [Monitoring](../../prerequisites/monitoring.md#the-alert-set) (`server_state`, validated ledger age, `MemAvailable`, disk runway, and version drift):

- **Peer count sits in its normal band.** Learn your hub's plateau and alert on departures from it, not on an absolute number alone. With `[peers_max]` at 300 the server aims for about 45 outbound and 255 inbound, and fixed and reserved peers sit outside those caps, so the plateau can sit above 300.
- **Peer disconnect rate is low and steady.** A rising disconnect rate is the earliest warning sign experienced hub operators watch, and it often precedes any visible problem. Read it from `peer_disconnects` and `peer_disconnects_resources` in `server_info`. Both count since the server started and never reset, so graph and alert on the change per interval.
- **Consensus convergence time stays in the normal range.** Operators treat convergence above roughly 5 to 7 seconds as worth investigating.

When a hub is unhealthy, hardware is rarely the reason. Check internet connectivity and the upstream network first.

Alert on both directions of peer movement, not just the total. During one network-wide incident, hubs lost most of their peers in waves that never crossed a simple "total below N" threshold until far too late. Totals hide splits; track inbound and outbound counts separately.

## Restarts and peer recovery

Restarting a hub drops every peer it holds. The service itself returns in minutes, but the peer population doesn't:

- Peers that list the hub in their own `[ips_fixed]` come back on their own within seconds if the hub is already up: a peer retries a dropped fixed connection on its next one-second pass. If that attempt fails, each further failure lengthens the wait (1, 2, 3, 5, 8, 13, 21, 34 minutes, then 55), so a long restart delays even your fixed peers. A [reservation](#peer-reservations) guarantees them a slot while the hub refills.
- In one measured fleet, about 40% of peers return within 20 minutes and roughly 95% within about 5 hours.
- A hub relying purely on organic discovery can take days to regrow its population; one bootstrap hub measured almost two weeks back to its plateau after a restart.

Shorter downtime means faster repopulation, so keep restarts rare, brief, and planned. Plan them the way you would on a validator: check for an in-flight online deletion rotation first, give the server time to stop, and expect an empty `complete_ledgers` range until it has synced; see [Restart with care](validator.md#restart-with-care). A hub that keeps only a few hundred ledgers rotates often (about every half hour at 500 ledgers), so a restart is more likely to land in the middle of one.

## Run a fleet, not a monolith

Long-running hub operators run several hubs rather than one large one:

- **Split capacity.** For example, three hubs at higher peer caps plus two at lower caps as failover. If one high-capacity hub goes down, displaced peers re-home to the siblings.
- **Update one hub at a time.** Upgrade, verify it returns to `full` and regains peers, then move to the next. One fleet spreads a version rollout over two or three days so the pool is never degraded.
- **Keep at least one hub untouched at all times.** The same discipline professional operators apply to every multi-server role.


## Peer reservations

A [peer reservation](../peering/use-a-peer-reservation.md) guarantees a named peer a connection slot even when the hub is full. In practice, reservations are how hubs provide reliable service to the peers that matter most, such as validators that use the hub as a fixed peering point.

- One bootstrap fleet maintains roughly 85 reservations across its hubs, including reservations for multiple trusted validators, and reports no meaningful downside to granting them.
- A reservation doesn't reconnect anyone: the reserved server comes back because your hub is in its `[ips_fixed]`. What the reservation guarantees is admission, so a reserved peer is never turned away while the hub refills after a restart.
- Granting a reservation means someone now depends on you by name. Track who holds them, and tell reservation holders about planned maintenance.

If you automate granting reservations, verify that requesters actually operate the server they claim: at minimum, prove the request comes from the server's address and that the connecting server presents the claimed node public key.

One bootstrap operator runs an automated reservation service with exactly this verification flow at [xrpkuwait.com](https://xrpkuwait.com/xrpk-peer-reservation). Community-maintained, not endorsed by the XRPL Foundation or Ripple; review anything before you run it.

## Incidents: what a network event looks like from a hub

During the July 2026 manifest-flood incident, hubs were hit harder than validators: fleets that normally held 100 to 200 peers per hub dropped to 10 or 20. The operational lessons from operators who rode it out:

1. Monitoring fired on peer disconnects first, minutes before anything else looked wrong.
2. Local troubleshooting found nothing, because nothing local was wrong. Checking community channels established it was network-wide within minutes.
3. The fix was an urgent upstream release; roughly 80% of validators upgraded within a day or two. Hub operators' job was to update promptly, one hub at a time, and keep capacity available while the network recovered.

The general shape repeats: when a hub degrades and the host is healthy, look outward, and check whether others see it too, before changing anything locally.

## Logging and housekeeping

The [validator logging guidance](validator.md#manage-logs-from-day-one) applies unchanged: keep `log_level` at `warning`, rotate and cap the debug log, and treat unbounded logs as the self-inflicted outage they are. Hubs produce more peer-related log noise than quiet servers; alert on signatures, not volume.
