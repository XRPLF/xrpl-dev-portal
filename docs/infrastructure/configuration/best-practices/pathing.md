---
seo:
    description: Operate an XRP Ledger pathfinding server - measure path load, cap concurrency at the proxy, watch response time rather than node health.
labels:
  - Core Server
---
# Pathfinding Best Practices

A pathfinding server is a stock `xrpld` (formerly `rippled`) server with one expensive job. Everything on [Stock Node Best Practices](stock-node.md) applies: restarts, updates, retention, logs. This page adds the handful of practices specific to serving path requests. For the role itself and the settings, see [Pathfinding](../server-modes/pathing.md).

## Watch the service, not the server

The usual health signals don't see pathfinding trouble. In the one instrumented case, `server_state` stayed `full` and `load_factor` stayed flat while path responses took six seconds and then a minute. Monitor what clients experience:

- **Response time of a representative `ripple_path_find`**, run from outside on a schedule, with an alert on sustained slowness.
- **Update gaps on a `path_find` subscription**: the interval between updates should track ledger close time, about four seconds; gaps of tens of seconds mean the search isn't keeping up.
- **`tooBusy` responses**, which the server returns to `ripple_path_find` when it can't calculate paths. Any sustained rate is an outage of the service even though the server is up. Don't rely on seeing them: the path-specific guard applies only to `ripple_path_find` calls that name a ledger, `path_find` subscriptions have no gate of their own, and both the path guard and the server's general busy response are switched off for admin callers and for callers a `secure_gateway` front end passes on with `X-User`. Response time and update gaps are the dependable signals.
- **Job counts.** The admin [server_info method][] response has a `load` object with a `job_types` list. For each job type it shows how many jobs are waiting and in progress, plus the average and peak time; `pathFind` and `updatePaths` are the two that belong to this role. Watch their `avg_time`, `peak_time`, and `over_target` fields: a waiting count can't build for either, because `pathFind` is recorded as a load measurement rather than queued and `updatePaths` is capped at two jobs at a time. (`server_info` with `counters: true` also has `job_queue` totals since start, where `queued` minus `started` is the current waiting count, and a `current_activities` list of running jobs, but neither records `pathFind`, which is a load measurement rather than a job.)

## Cap concurrency where you can enforce it

The server will accept more path requests than it can serve well, and degrade all of them together. Put the limit in front:

- A reverse proxy or gateway that counts concurrent path requests per client and in total, and queues or rejects beyond a limit you measured.
- A limit you measured on your own hardware (see below), not one inferred from `tooBusy`. The server rejects a `ripple_path_find` that names a ledger when two such calls are already running, when more than 50 client jobs are queued, or when the server is loaded, so a proxy limit above two will see `tooBusy` on those calls and a proxy identified with `X-User` never will.
- Per-client limits as well as a global one, so a single integration can't take the service down for the rest.

## Check before you promise this service

Before offering path queries to anyone, reproduce the degradation yourself on the hardware you intend to use: open `path_find` subscriptions one at a time from a test client and watch update intervals and response times as you add them. The number at which they fall apart is your capacity. One operator's figures on a stock server are on the [Pathfinding](../server-modes/pathing.md#what-it-costs-measured) page (eleven concurrent subscriptions pushed responses past six seconds, and a hundred left gaps of a minute or more between updates); yours will differ, and only your own number is worth building a product on.

## Keep it a stock node otherwise

- Don't serve history, hubs, or public transaction submission from the same server. Each competes for the same CPU and memory and makes the capacity number meaningless.
- Keep search depth at what your use case needs. The settings the example configuration recommends for "advanced pathfinding" are the expensive end; every step up costs exponentially more.
- Update, restart, and rotate logs exactly as for a stock node. A pathfinding server has no special restart cost, so a second server behind the proxy makes maintenance invisible to clients.

## See also

- [Pathfinding](../server-modes/pathing.md)
- [Pathfinding System Requirements](../../prerequisites/system-requirements/pathing.md)
- [Pathfinding Security](../security/pathing.md)
- [Stock Node Best Practices](stock-node.md)
- [Monitoring](../../prerequisites/monitoring.md)
- [server_info method][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
