---
seo:
    description: What a dedicated XRP Ledger pathfinding server needs - isolation first, then CPU and memory headroom for a few expensive concurrent queries.
labels:
  - Core Server
---
# Pathfinding System Requirements

A pathfinding server is a stock `xrpld` (formerly `rippled`) server that exists to answer [path_find method][] and [ripple_path_find method][] requests and to do nothing else. Its requirements differ from a stock node's in one way: it needs headroom for a small number of very expensive requests, and it must not share that headroom with anything.

Very few operators need this role. One production pathfinding operation took part in the 2026 operator survey, and the professional operators who serve the public turn pathfinding off. Read [Pathfinding](../../configuration/server-modes/pathing.md) first; it explains why.

## The shape of the load

- **Cost is per request and exponential in depth.** A path search is a graph search across trust lines, order books, and AMM pools whose work grows exponentially with the configured depth. Storage doesn't enter into it; a pathfinding server keeps the same history as any stock node, and a short window is enough.
- **The breaking point is concurrency in the single digits.** On a stock server with elevated search settings, eleven concurrent `path_find` subscriptions pushed responses past six seconds and a hundred produced update gaps of a minute or more, while the server reported itself healthy.
- **The box fails before the node does.** Operators describe the failure mode as the pathfinding machine saturating or dying while the ledger node behind it is unaffected. That is the argument for a separate server: the blast radius is the pathfinding service alone.

## Hardware that follows from it

| Component | Guidance |
|:----------|:---------|
| Baseline | Everything on [Stock Node System Requirements](stock-node.md): local NVMe, 32 GB or more, dedicated CPU. Pathfinding adds to that; it doesn't replace it. |
| CPU | More cores help only as far as concurrent requests go; each request is a single expensive search. Dedicated, fast cores matter more than many cores. |
| Memory | Enough for the ledger state the search walks plus the server's normal footprint. The one measured production host that died under about five concurrent users had 256 GB; the lesson was isolation and concurrency limits, not more memory. |
| Disk and history | As a stock node. Keep history short; search runs against current state. |
| Network | Client-facing, so it scales with your request volume; the peering side is a stock node's. |

## What actually sizes it

The proxy in front. A pathfinding server's useful capacity is the number of concurrent path requests it can answer within the time your product tolerates, and that number is small on any hardware. Decide it by measurement, enforce it at the proxy, and add a second server when you exceed it. Raising search depth or buying a larger machine moves the number a little; the shape stays the same.

## Hosting

The one production pathfinding operation ran on dedicated bare metal, older-generation machines rented for price, and describes shared cloud instances as starved of CPU and disk at this workload unless paid for at a premium. The role is CPU-bound and latency-sensitive, so a dedicated host, or a cloud instance with dedicated cores and local NVMe, is the safe choice; the general hosting trade-offs are on [Validator System Requirements](validator.md#hosting).

## See also

- [Pathfinding](../../configuration/server-modes/pathing.md)
- [Pathfinding Best Practices](../../configuration/best-practices/pathing.md)
- [Pathfinding Security](../../configuration/security/pathing.md)
- [Stock Node System Requirements](stock-node.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}
