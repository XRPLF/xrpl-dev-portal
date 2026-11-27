---
seo:
    description: Operate a client-serving XRP Ledger stock server - port limits, health checks that prove freshness, and update patterns.
labels:
  - Core Server
---
# Stock Node Best Practices

This page covers operating an `xrpld` (formerly `rippled`) stock server day to day, with emphasis on the client-serving case - the place where most real-world operational pain in this role lives. For setup, see [Stock Node](../server-modes/stock-node.md).

## Port limits that production front ends actually run

If a port serves anyone beyond localhost, cap it. Values from production client-serving configs:

```
[port_rpc_public]
port = 8081
ip = 0.0.0.0
protocol = http
secure_gateway = <your front-end addresses>
limit = 50000

[port_ws_public]
port = 8080
ip = 0.0.0.0
protocol = ws
secure_gateway = <your front-end addresses>
limit = 50000
send_queue_limit = 20000
```

- `limit` caps concurrent connections per port; a new connection is refused once the count reaches the limit.
- `send_queue_limit` applies to WebSocket ports only: a WebSocket is disconnected when its send queue passes it (default 100). It bounds what a slow or stalled client can leave queued. The server pings an idle WebSocket connection about every 30 seconds (3 seconds for loopback connections) and closes it only if the ping itself can't be delivered within the next period, that is, when the client has stopped reading; a client that keeps reading but never answers isn't dropped, so `send_queue_limit` is the control that bounds a slow client. No configuration key sets the interval in current versions.
- `secure_gateway` names your load balancers or gateways: connections from those addresses are treated as proxied client traffic (with the real client identified by the `Forwarded` or `X-Forwarded-For` header) rather than being rate-limited as one very busy IP. Use it the moment anything sits in front of the server. Send `X-User` only for clients your front end has authenticated, because it lifts the limits for that connection.

## The built-in per-client limits

The server scores every non-privileged client by the work it causes: at 5,000 its responses carry `"warning": "load"`, and at 25,000 the server refuses it (HTTP 503 "Server is overloaded", or the WebSocket is closed) until the score decays. Two operational consequences:

- You don't need external per-IP rate limiting to survive ordinary misuse - the server defends itself.
- **Admin connections bypass this entirely, and so do `secure_gateway` connections that carry an `X-User` header.** A `secure_gateway` connection without that header is still scored, per client address taken from the `Forwarded` or `X-Forwarded-For` header. If your gateway sends `X-User`, it has lifted the server's limits for that traffic, so it must enforce its own. A runaway script of your own on an admin port can do damage no stranger could; give your own tooling the same discipline you expect of clients.

## Health checks must prove freshness

A process check, an HTTP 200, or a container health probe can all be green while the data served is stale or the server has fallen behind. Production serving operators converge on the same doctrine:

- Gate on **ledger age and advancement** (`server_info`: `validated_ledger.age`, sequence increasing), not reachability. Watch at ~15 seconds of age; treat ~30 as failure.
- Serve-check with a **real query** of the kind your clients make, including against every failover target.
- The peer-port `/health` endpoint has hardcoded thresholds - among them, **7 or fewer peers returns a warning (HTTP 503) and no peers at all returns critical (HTTP 500)**, and the server's own load factor (`load_factor_server` over `load_base`, with no fee escalation) above 100 warns while 1,000 or more is critical. Private-peered or few-peer servers can never look healthy to it. Gate such servers on admin `server_info` instead, and if a load balancer polls `/health`, know that a server in either state will be taken out of rotation.

## Monitoring and alerts

The [validator alert guidance](validator.md#alert-on-the-right-things) mostly transfers; the client-serving additions that page for real in production: sudden peer-count drops, ledger age, disk headroom (30% is a common floor), `MemAvailable` that stays under about 2 to 3 GB for minutes, a CPU ceiling (75%), and disk latency from host metrics. External black-box checks beat on-host checks - the failure that matters takes your monitoring with it.

## Restarts and retention

Restart a serving node the way you would a validator: check for an in-flight online deletion rotation first, give the server time to stop, and expect an empty `complete_ledgers` range until it has synced. See [Restart with care](validator.md#restart-with-care) and [An empty range after a restart is normal](validator.md#an-empty-range-after-a-restart-is-normal). Rotation is also heavy I/O that clients can feel. If they notice it, lengthen the retention window so it runs less often, and keep a second server to take traffic while the first rotates or restarts.

## Updates for serving fleets

With two or more servers, use the canary pattern: upgrade one, point your applications or indexers at the already-upgraded (or the untouched) server, watch, then roll the rest. Small providers run exactly this with a two-server fleet and an indexer switchover, and it converts a bad release from an outage into a non-event. The invariants are the same as everywhere: one at a time, watch it, keep a rollback path.

## Logging

The [validator logging rules](validator.md#manage-logs-from-day-one) apply unchanged: `warning` level, rotated and capped, alert on signatures not volume. Client-serving servers add one habit: log at the front end too - the server's log tells you what it did, the front end's log tells you what clients experienced, and incidents usually live in the gap.
