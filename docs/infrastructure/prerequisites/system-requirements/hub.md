---
seo:
    description: Hardware, bandwidth, and sizing guidance for running a public XRP Ledger hub.
labels:
  - Core Server
---
# Hub System Requirements

A hub is an `xrpld` (formerly `rippled`) server that accepts a large number of inbound peer connections and relays messages between them. Hubs strengthen the peer-to-peer network: they give new servers somewhere to connect, carry consensus traffic between servers that aren't directly connected, and provide stable peering for validators. A hub's hardware profile is unusual: almost nothing on the machine works hard except the network connection.

This page describes what a production Mainnet hub needs. For the hub role itself and its configuration, see [Hub](../../configuration/server-modes/hub.md).

{% admonition type="info" name="Dated figures" %}
Measurements on this page are from production hubs measured in 2026, including a bootstrap-listed fleet with a year of continuous monitoring. Bandwidth grows with network activity, so recheck yearly.
{% /admonition %}

## Recommended specifications

| Component | Recommendation | Why |
|:----------|:---------------|:----|
| CPU | 12 cores / 24 threads, server class | Measured average utilization on a 300-peer hub is about 1%, with peaks under 15%. The cores exist for headroom and the operating system, not for `xrpld`. Under 8 hardware threads, automatic `node_size` selection is capped below `huge`; see [Node size](validator.md#node-size). |
| Memory | 64 GB | A 300-peer hub averages under 20% memory utilization on a 64 GB host. The usual `xrpld` memory rules apply; see [Validator System Requirements](validator.md#memory) for the MemAvailable guidance, which applies to every role. |
| Disk | 500 GB local NVMe, 10,000 sustained IOPS | Hubs keep modest history, so capacity needs are small: 300 GB works, 500 GB is comfortable, 1 TB is future-proof. Measured disk utilization averages under 2%, with brief spikes during [online deletion](../../configuration/data-retention/online-deletion.md). |
| Network | 1 Gbps port, unmetered or a transfer allowance above the monthly figures below | Bandwidth is the resource that actually scales with the role. The measured 300-peer hub averaged 50 Mbps, ran 122 Mbps over its busiest day, and reached 199 Mbps over five minutes, so a 100 Mbps link is under its own peaks. See below. |

## Bandwidth is the real cost

Everything else on a hub idles. The network connection doesn't. Measured figures from one production fleet, August 2026:

| Hub size | Monthly transfer | Sustained average | Highest daily average |
|:---------|:-----------------|:------------------|:----------------------|
| 300 peers | 15.3 TiB | 50 Mbps | 122 Mbps (1.19 TiB that day) |
| 100 peers | 10.8 TiB | 35 Mbps | 89 Mbps |

Short peaks run higher: the 300-peer hub's highest retained five-minute average was 199 Mbps. Plan the link and any transfer allowance for the peaks, not the average.

Two properties of hub traffic worth knowing when you plan:

- **Traffic is roughly balanced between inbound and outbound.** A hub relays, so it sends almost as much as it receives. Servers that don't relay for others see mostly inbound traffic instead. Metered hosting that charges for outbound traffic therefore costs a hub nearly twice what the inbound numbers suggest.
- **Scaling with peer count is sub-linear.** Three times the peers produced about 1.4 times the traffic in the measured fleet, because a relayed message is sent once per peer that needs it, not once per peer that offers it. Growing a hub is cheaper than the first peers suggest.


[Link compression](../../configuration/peering/enable-link-compression.md) reduces bytes on the wire at some CPU cost. The measured fleet above runs without it and has CPU to spare, so compression is a cost lever, not a requirement.

## Peer capacity

- Start around 100 peers and grow as the hardware and the connection prove themselves.
- About 300 peers is comfortable on the hardware above. At `peers_max` 300 the server aims for about 45 outbound connections and takes up to 255 inbound, and the default `ip_limit` lets one public IP hold up to 7 of them.
- Don't go beyond about 500 peers on one hub. That is operating practice from the bootstrap fleet, not a software limit: past that point, operators split into multiple hubs instead, which also adds redundancy.

A fleet of several smaller hubs beats one giant one: it survives restarts (peers re-home to the siblings) and lets you upgrade one hub at a time. See [Hub Best Practices](../../configuration/best-practices/hub.md).

## Hosting and cost

The hubs measured on this page run on dedicated hardware with their own public IP addresses and either unmetered links or allowances well above the table. That is the shape the role wants. The machine is cheap for what it does (one fleet's peering hubs rent for about $60 a month each, USD, 64 GB and 1 TB, with traffic included), and the address is part of the service: other operators write it into their configurations and validators reserve slots against it, so it must not change when an instance is replaced. On metered cloud hosting the bill is the bandwidth: 11 to 15 TiB a month of roughly symmetric traffic at egress prices, plus a reserved static address, and instance types whose network baseline relies on burst credits can't hold a hub's peaks. If you host a hub in a cloud, choose a dedicated-bandwidth instance, pin a static public address, and price the egress before the compute.

## What hubs don't need

- **Not much disk.** The hub role doesn't require serving deep history. Retention between a few thousand and 100,000 ledgers covers it; see [Hub](../../configuration/server-modes/hub.md#history-and-retention).
- **Not much CPU or memory headroom beyond the baseline.** The measured fleet's year of monitoring never came close to exhausting either.
- **No GPU, no RAID for the ledger store.** The store rebuilds from the network faster than most recovery procedures; keep redundancy at the fleet level.
