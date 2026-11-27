---
seo:
    description: Hardware and sizing guidance for a stock XRP Ledger server that submits transactions and serves clients.
labels:
  - Core Server
---
# Stock Node System Requirements

A stock server is the default `xrpld` (formerly `rippled`) configuration: it follows the ledger, relays transactions, and serves client applications. Its requirements sit between a bare validator and the heavy serving roles, and they scale with what you ask of it - a personal submission server and a public API backend are both "stock", with very different needs.

{% admonition type="info" name="Dated figures" %}
Measurements on this page are from production servers measured in 2026. Per-ledger data volume grows with network activity, so recheck yearly.
{% /admonition %}

## Recommended specifications

| Component | Recommendation | Why |
|:----------|:---------------|:----|
| CPU | 4 to 8 modern cores (8 or more hardware threads) | Keeping up with the ledger is cheap; serving clients adds load in proportion to traffic. Thread count also feeds automatic sizing: it caps `node_size` at half the threads, so a 4 vCPU instance runs `medium` even with 32 GB; see below. |
| Memory | 32 GB | **16 GB is the practical floor, and it pinches**: production operators running 16 GB instances report memory exhausting first. 32 GB runs comfortably with room for the page cache that makes NuDB fast. The usual rule applies: watch MemAvailable, not "used". |
| Disk | Local NVMe, 10,000 sustained IOPS; capacity per retention (below) | Local solid-state storage is non-negotiable: network-attached storage fails to sync regardless of provisioned IOPS, and shared-VM storage has collapsed under neighbors mid-flight. |
| Network | 100 Mbps, low jitter | At about 10 to 11 peers, measured servers moved roughly 100 to 120 GB per day, mostly inbound. The default `[peers_max]` of 21 is 10 outbound plus up to 11 inbound, so a server whose peer port nobody can reach settles near 10, and one that takes inbound fills toward 21. |


When `[node_size]` isn't set, the server sizes itself from the host's RAM and thread count at startup. See [Capacity Planning](../capacity-planning.md#node-size) - and note the upstream plan to replace this setting.

## Disk sizing by retention

Disk needs follow `online_delete`/`ledger_history`, not the role itself:

| Retention | Approximate store | Notes |
|:----------|:------------------|:------|
| Shipped default (512) to a few thousand ledgers | 10 to 30 GB, cycling to roughly double at rotation peaks | Rotates many times a day and wears the drive; acceptable for a dedicated peering box, not for a server that answers clients |
| About a day (25,000 to 32,000 ledgers) | Roughly 40 to 100 GB at rotation peaks | The sensible floor for anything that serves clients; see [Minimal Configurations](../../configuration/minimal-configurations.md) |
| ~2 weeks (300,000-400,000 ledgers) | Hundreds of GB of NuDB, double at rotation peaks, plus SQLite files (roughly 180 to 320 GB, an estimate extrapolated from the validator's per-ledger rate; measure your own) | The pattern production API servers choose; see [Stock Node](../../configuration/server-modes/stock-node.md#history-for-api-traffic) |
| Full history | A different project entirely | See [Full History System Requirements](full-history.md) |

Budget roughly double the steady-state store for rotation peaks, and remember that `transaction.db` doesn't shrink when rows are deleted: the freed space is reused inside the file, so growth slows but never reverses, and reclaiming the space requires a `VACUUM`.

One caveat for client-serving hosts specifically: at small retention values, the periodic deletion rotation is heavy I/O, and on a busy client-serving server it can be felt. Dedicated peering boxes shrug it off; servers answering queries during a rotation may not. If clients notice, lengthen the interval.

## Cost

A capable stock server runs from a repurposed home machine (electricity) to roughly $100 per month (USD) on rented dedicated hardware to a few hundred per month as a managed cloud instance with local NVMe. Serving the public adds bandwidth cost in proportion to traffic.

**Bare metal or cloud.** Both run stock servers in production, and the deciding factor is storage, not CPU or memory. Operators who tried network-attached cloud volumes couldn't get a server to sync even with tens of thousands of provisioned IOPS in RAID 0, because the floor is latency rather than throughput, while the same provider's instance-local NVMe synced without trouble; a shared virtual machine whose storage degraded under other tenants dropped a production server out of sync with no fix but migration. Rented dedicated hardware costs on the order of $55 to $100 a month per server with traffic included and gives you the disk and the network baseline outright. Cloud instances work when they have local NVMe and a dedicated network baseline (not burst credits), at roughly two to three times the monthly cost, in exchange for provider-grade power and connectivity and no capital outlay; a small cloud fleet of a validator and two or three servers runs $600 to $800 a month. Whichever you choose, measure the IOPS and latency you actually get before you depend on them.
