---
seo:
    description: Run an XRP Ledger pathfinding server - what pathfinding costs, why it is on by default, how to turn it off per role, and how to serve it deliberately if you must.
labels:
  - Core Server
---
# Pathfinding

Pathfinding is the `xrpld` (formerly `rippled`) server's search for ways to deliver one currency as another across trust lines, order books, and AMM pools; see [Paths](../../../concepts/tokens/fungible-tokens/paths.md). Clients ask for it with the [path_find method][] (a subscription that keeps updating as ledgers close) and the [ripple_path_find method][] (one answer). Every ordinary server answers these requests by default. This page is about what that costs, who should carry it, and how to configure the role either way.

Read [Pathfinding System Requirements](../../prerequisites/system-requirements/pathing.md) alongside this page; they are short because the honest answer about pathfinding in 2026 is short.

## What the server does by default

- **Pathfinding is on** for any server that isn't a validator. The shipped configuration sets no `[path_search_max]`, and the compiled-in default is 3, so a stock server searches to depth 3 for anyone who asks. Most operators run it without knowing.
- **Validators turn it off automatically.** When `[validator_token]` or `[validation_seed]` is present, the server sets the maximum search depth to zero unless you set it explicitly. You don't have to do anything on a validator.
- **Under load the server searches less, not never.** The first pass for a new request always runs at `path_search_fast` depth; later passes use `path_search`, stepping down one level per pass while the server is busy, never below `path_search_fast`. The search climbs toward `path_search_max` only while the last pass found no paths and the server isn't busy, so the expensive requests are the ones that find nothing, and `ripple_path_find` returns `tooBusy` when the server can't calculate at all. The ceiling is the only lever that stops the work entirely.

## What it costs, measured

Path search is the most expensive request a server serves, and its cost rises exponentially with depth. The measurements that exist all point the same way:

- One production pathfinding operation instrumented a stock server with elevated search settings: eleven concurrent `path_find` subscriptions pushed response times past six seconds, and a hundred concurrent subscriptions produced gaps of sixty to a hundred seconds between updates. The server itself stayed healthy throughout, with `server_state` at `full` and a flat `load_factor`.
- A large public cluster routes path requests to dedicated backends rather than letting its ordinary servers answer them, and one operator's 256 GB machine died under roughly five concurrent pathfinding users before that separation.
- A professional operator serving public RPC and full history sets `path_search_max` to zero on every public node: the most expensive request a server can answer has no place on the machines that carry their public service. Path search runs against the current ledger's state, so retained history doesn't make a search cost more; what the full history servers lose is the headroom their real job needs.

Two facts in that picture matter more than the numbers. First, the degradation is in the path service, not the server: a node can look perfectly healthy by every usual signal while path responses are unusable. Second, the breaking point is a handful of concurrent clients, not hundreds. If your server serves pathfinding to anyone but yourself, assume it is already past that point at times you haven't noticed.

## Who should carry pathfinding

| Role | Pathfinding | Why |
|:-----|:------------|:----|
| Validator | Off (automatic) | Consensus latency is the job. Nothing else runs here. |
| Public RPC, hub, full history | Off, explicitly | Expensive requests from strangers on the servers that carry your public service. The operators who serve the public disable it. |
| Stock server for your own applications | On only if your applications call it | The default on. Accept the load, keep it off the public interface, and measure it. |
| Dedicated pathfinding server | On, fronted, isolated | A stock server whose only job is path requests, behind a proxy that limits concurrency. The only configuration in which offering pathfinding to others is honest. |

To turn it off, set the ceiling to zero; the other settings then don't matter for `path_find` and `ripple_path_find` (`sign` and `submit` with `build_path` still run at `path_search_old` depth, but with the ceiling at zero the server stops indexing order books, so those paths can't cross an order book or AMM; only a server that signs for clients answers those anyway):

```ini
[path_search_max]
0
```

## The settings

All four live in `xrpld.cfg`, each as a stanza holding one integer. Depth is the search aggressiveness; cost grows exponentially with it.

| Stanza | Meaning | Default |
|:-------|:--------|:--------|
| `[path_search]` | Depth used for a request when the server isn't under load | 2 |
| `[path_search_fast]` | Depth used first when the server is under load; the floor | 2 |
| `[path_search_max]` | The ceiling a request may climb to. `0` disables pathfinding | 3 |
| `[path_search_old]` | Depth used when the server builds paths itself for legacy sign-and-submit style requests | 2 |

The example configuration's own note recommends `path_search` 7, `path_search_fast` 2, `path_search_max` 10, and `path_search_old` 7 "to support advanced pathfinding". Treat those as the upper end for a dedicated pathfinding server with a proxy in front, never as settings for a server that does anything else. The pathfinding block on [Minimal Configurations](../minimal-configurations.md#pathfinding-server) deliberately starts lower, at depth 2 with a ceiling of 7, and says to raise the ceiling only after measuring.

## Serving pathfinding deliberately

If your product needs path queries at volume, the pattern that production operations use is:

1. A stock server with pathfinding enabled at the depths you need and nothing else to do: no public ports, no transaction submission from others, no history serving.
2. A proxy in front that terminates client connections, caps concurrent path requests to the handful the server can hold, and queues or rejects the rest. The server's own `tooBusy` response is the backstop, not the policy.
3. Monitoring on path response time and update gaps, not on `server_state`; see [Pathfinding Best Practices](../best-practices/pathing.md).
4. A second server if the first can't hold your concurrency, because raising depth or hardware doesn't change the shape of the problem.

Community tooling exists that moves path computation out of the server entirely by working from ledger snapshots; it is one operator's project, in development, and not covered here.

## See also

- [Pathfinding System Requirements](../../prerequisites/system-requirements/pathing.md)
- [Pathfinding Best Practices](../best-practices/pathing.md)
- [Pathfinding Security](../security/pathing.md)
- [Stock Node](stock-node.md)
- [Minimal Configurations](../minimal-configurations.md)
- [Paths](../../../concepts/tokens/fungible-tokens/paths.md)
- [path_find method][]
- [ripple_path_find method][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
