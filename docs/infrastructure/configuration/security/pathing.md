---
seo:
    description: Secure an XRP Ledger pathfinding server - a cheap service-degradation vector that must sit behind a proxy and away from everything else.
labels:
  - Core Server
  - Security
---
# Pathfinding Security

A pathfinding server is a stock `xrpld` (formerly `rippled`) server, so everything on [Stock Node Security](stock-node.md) applies: admin ports on loopback, peer port rules, host hardening. Pathfinding adds one threat of its own, and it is cheap to exploit.

## A service-degradation vector

A handful of concurrent path requests is enough to make a server's path responses unusable for everyone, while the server itself stays healthy. Nobody has to crash anything: a few open `path_find` subscriptions with broad queries do it, and the usual signals (`server_state`, `load_factor`, peer count) don't show it. The node behind the service is unaffected, which is also why the damage is easy to miss.

The consequences for exposure:

- **Never expose `path_find` from a server that does anything else.** A public RPC node, a hub, or a submission node that also answers path requests hands strangers a way to degrade its real job. Set `[path_search_max]` to `0` on every server that serves strangers or whose applications don't call pathfinding; see [Pathfinding](../server-modes/pathing.md#who-should-carry-pathfinding).
- **Serve it only behind a proxy that limits concurrency**, per client and in total, and that can shed both `path_find` and `ripple_path_find` without touching anything else. The server's `tooBusy` response is a symptom, not a defense: the path-specific gate covers only `ripple_path_find` calls that name a ledger, open `path_find` subscriptions have no gate of their own, and the general busy response fires only when hundreds of client jobs are queued.
- **Treat the pathfinding server as disposable.** It holds no identity and no history worth keeping, so if it is saturated, restart or replace it. It is a full `xrpld` server with its own ledger state, though, not a calculator in front of one: a replacement must sync and be ready to answer path requests before the proxy sends it client traffic.

## What does not help

- **Rate limiting by request count alone.** One subscription is one request and keeps costing on every ledger close. Count open path subscriptions and concurrent searches, not requests per second.
- **Relying on the server's IP logs to deter abuse.** Knowing who degraded the service after the fact doesn't restore it. The proxy limit does.
- **Raising depth or hardware** in response to slow responses. Both increase what each request costs; the breaking point in concurrent clients barely moves.

## Admin surface

As for a stock node, with one addition: the `[path_search*]` stanzas change the cost profile of the server, so treat configuration access to a pathfinding server as you would access to a production database. A raised ceiling turns a service-degradation vector into a resource-exhaustion one.

## See also

- [Pathfinding](../server-modes/pathing.md)
- [Pathfinding Best Practices](../best-practices/pathing.md)
- [Pathfinding System Requirements](../../prerequisites/system-requirements/pathing.md)
- [Stock Node Security](stock-node.md)
