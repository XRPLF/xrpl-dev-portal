---
seo:
    description: Hardware, hosting, and sizing guidance for running a production XRP Ledger validator.
labels:
  - Core Server
---
# Validator System Requirements

A validator is a small-history `xrpld` (formerly `rippled`) server whose only job is to keep up with consensus. Its hardware profile is different from a server that serves clients or history: it needs modest CPU and RAM, a small but high-endurance local NVMe drive, and consistent latency. Raw capacity matters much less than consistency.

This page describes what a production Mainnet validator needs. For development or test use, see [Development and Testing](development-and-testing.md). For shared requirements such as system time, see [System Requirements](index.md).

{% admonition type="info" name="About these figures" %}
Figures on the validator pages come from a 2026 survey of 22 XRP Ledger node operators, including eight trusted validators, and from measurements they supplied. Treat them as operating estimates to plan around, not fixed requirements: consumption moves with network activity, busy days with many large ledgers raise traffic and disk writes, and per-ledger data volume roughly doubled between 2025 and 2026. Recheck storage and memory yearly.
{% /admonition %}

## Recommended specifications

| Component | Recommendation | Why |
|:----------|:---------------|:----|
| CPU | four or more physical x86_64 cores with SMT (8 threads), dedicated (not shared vCPUs) | Consensus is latency-sensitive. More than about 8 cores brings no benefit. Fewer than 8 threads silently caps the auto-selected `node_size`; see [Node size](#node-size). |
| RAM | 32 GB minimum; 64 GB gives headroom | The process itself uses 13 to 18 GB; the rest is page cache. See [Memory](#memory). |
| Disk | Local NVMe, 500 GB to 1 TB, high endurance | Endurance and latency matter, not capacity. See [Disk](#disk). |
| Network | 1 Gbit interface, unmetered or generously metered | Driven by peer count; several TB per month at about 20 peers. See [Network](#network). |
| Operating system | Ubuntu LTS, Debian, or Red Hat Enterprise Linux | These receive packaged builds; operators also report the Red Hat packages running on Amazon Linux 2023. See [Install xrpld](../../installation/index.md). |

Production validators in the survey ranged from 6 to 24 cores and 32 to 128 GB of RAM. Nearly all of them used between 13 and 20 GB of it. Buy for consistency, not for headroom you will never use.

## What your specification means for the network

A validator's hardware isn't only its own concern. Consensus needs 80% of the trusted validators to agree on each ledger, so the network moves at the pace of the validators that make up that 80%, not at the pace of the fastest or the average. A validator that falls behind during a burst of transactions simply stops counting toward agreement; if more than a fifth of the list fall behind at the same time, ledgers close more slowly for everyone. When you choose hardware for a trusted validator, you are choosing for the busiest minute of the year, not the typical one.

What a burst actually stresses:

- **CPU threads.** Transaction processing and signature checking are where a burst lands. The server sizes its job-queue thread pool from the hardware threads it sees and the `node_size` tier: up to 14 threads on a `huge` host with 16 or more hardware threads, fewer on smaller hosts. Dedicated cores matter more than the count beyond that; a burstable or shared-vCPU instance that is throttled mid-burst misses rounds exactly when the network needs it.
- **Disk latency.** Every ledger is written to the store before the next round, and a burst means more objects per ledger. Local NVMe is the requirement because the constraint is latency, not throughput; see [Endurance and latency](#endurance-and-latency).
- **Bandwidth headroom.** Proposals and validations grow with transaction volume. The 4 to 7 GB per peer per day figure in [Network](#network) is a baseline; a validator near a metered cap or on a saturated uplink is the one that drops out first.
- **Not RAM beyond the `huge` tier.** The server stops scaling its caches once it sees 24 GB and eight or more hardware threads; above that, extra memory becomes page cache, which helps reads but doesn't change how the server rides a burst. Production validators on 32 GB and 128 GB hosts alike use 13 to 20 GB. 32 GB with headroom to 64 GB is the right range; 128 GB on every trusted validator wouldn't raise the network's capacity.

The other side of the same point is that the network pays for every validator, trusted or not. Each server verifies and relays the validations and manifests of every validator it hears about, so a large number of weakly run validators adds work to every server on the network and nothing to consensus. Run a validator because you intend to keep it well specified and well maintained, and run one, not a fleet.

## CPU

Consensus rewards consistent latency, not throughput. Practical guidance:

- Four physical cores with SMT (8 hardware threads) is enough. Eight cores is comfortable. Beyond that, a validator has no use for the extra cores. Without SMT, four cores means four threads, and the server then caps its auto-selected `node_size` at `medium` however much RAM the host has; pin `node_size` if you run on few threads.
- Prefer dedicated cores where you can. Avoid burstable (credit-based) instances: when the credits run out the CPU is throttled, and a throttled validator misses rounds. Reliable validators do run on good-quality shared vCPUs, but the shared-infrastructure failures operators reported came from resource contention they could neither see nor fix, so if you use shared infrastructure, measure it before trusting it.

## Memory

The most common sizing mistake is reading host "used" memory as pressure. On a validator with `node_size` set to `huge`:

- The `xrpld` process itself uses about 13 to 18 GB at steady state (one production validator's 30-day median is 15 GiB, peak just under 18). A validator can run a gigabyte or two heavier than a stock server with the same settings.
- The kernel fills the rest of RAM with cached ledger-store pages. A 32 GB host commonly shows 26 to 30 GB "used". That is cache doing its job. A server whose cache never fills has a small working set, which is normal on a validator; it isn't a sign that anything is wrong.
- Watch `MemAvailable`, never used percent. Trouble starts when `MemAvailable` stays under about 2 to 3 GB for minutes, not a brief dip: the ledger-store cache shrinks, reads go to disk, then swap thrashes, or the kernel kills the process on a swapless host. If your kernel exposes `/proc/pressure/memory`, sustained stall time there confirms the pressure is real. Keep the rule in gigabytes, not a percentage: the server needs the same 13 to 18 GB whether the host has 32 GB or 96.

What this means for sizing:

- **16 GB** isn't enough for Mainnet production. Memory exhausts first on 16 GB hosts.
- **32 GB** works. Several production validators, including validators on the default UNL (the [dUNL](../how-the-network-fits-together.md#what-a-validator-is-and-what-trust-means)), run on 32 GB with stock or near-stock configuration and no incidents.
- **64 GB** is the common choice for a new build. It costs little and removes memory from the list of things to watch. Beyond 64 GB there is nothing for a validator to use.

Swap: keep a small swap partition, ideally on a different physical device from the ledger store, and set `vm.swappiness=1`. On a cloud instance with a single local NVMe the same device is fine as long as the host has RAM headroom and rarely swaps; the only other device there is network storage, which is worse. A value of `0` risks premature out-of-memory kills; the goal is "swap rarely", not "never". Stale pages sitting in swap with no swap-in activity are normal and not a problem, even at half the swap space used, so alert on swap-in activity, never on swap used.

## Disk

### Size

A validator needs only recent ledgers. Size the volume using this rule (September 2026 figures):

- NuDB ledger store: 0.65 to 1.3 MB per ledger, moving with network activity. Size with the highest figure, not the average.
- SQLite databases (`transaction.db` and friends): about 0.3 to 0.4 MB per ledger of the range they hold, which reaches about two rotation intervals. The files **don't shrink** when rows are deleted; reclaiming the space requires a `VACUUM`.
- Peak usage is **two generations of the NuDB store** (right before [online deletion](../../configuration/data-retention/online-deletion.md) rotates) **plus the SQLite files**.
- One generation is the ledgers between rotations. That equals `online_delete` when `advisory_delete` is `0`. A scheduled `can_delete` can stretch it. A daily window that calls `can_delete now` and sets it back to `never` afterwards holds each rotation to the next window, so at 32,768 it rotates every 48 hours, about 44,300 ledgers. A daily `can_delete now` that stays armed lets each rotation run as soon as it is due.

For example, at `online_delete` 32,768 (about a day and a half) with rotation running freely, NuDB peaks at about 1.3 MB x 32,768 x 2 = 85 GB, and the SQLite files add about 25 GB. One production validator at that setting measured NuDB peaks of 61 to 86 GB, and up to 99 GB once a daily `can_delete` held rotation to every 48 hours. A 500 GB drive is generous for any validator retention setting up to a few days. Keep at least 30% free at all times; the server stops cleanly when the SQLite volume has less than 512 MB free, and the packaged `systemd` unit (`Restart=on-failure`) doesn't restart a clean exit (a container restart policy of `always` or `unless-stopped` does restart it, straight back into the full disk). That check runs as part of the transaction-table sweep, so a server with `use_tx_tables=0` has no low-disk stop at all and needs its own disk alert. It looks only at the `[database_path]` volume, so if the ledger store has its own drive, as Layout below recommends, alert on that drive's free space yourself. A second check stops it the same way when `transaction.db` has less than 512 MB of page headroom left inside the database; that one is a page-size ceiling, not a disk-space problem, and is covered in [Fix SQLite Transaction Database Page Size Issue](../../troubleshooting/fix-sqlite-tx-db-page-size-issue.md).

### Endurance and latency

The disk's job on a validator is sustained writes, not reads:

- With adequate RAM, nearly all reads are served from cache: one production host's device counters over 46 days averaged about two and a half writes for every read, and that includes the operating system and logs. The `io_latency_ms` figure in `server_info` isn't disk latency (it times the server's internal I/O queue); read disk latency from host metrics.
- Write volume doesn't grow with how much history you keep. If anything, small `online_delete` values write more, because each rotation copies the live state forward and small windows rotate far more often (see [Choose retention for a validator](../../configuration/best-practices/validator.md#choose-retention-for-a-validator)). Instrumented validators measured 0.3 to 1 TB written per day at the device level. Budget drive endurance (TBW or DWPD), not capacity. Consumer drives are a consumable at this write rate; several operators keep a spare drive on hand for that reason.
- Use local NVMe. Network-attached block storage has failed to sync even with very high provisioned IOPS, because the constraint is latency, not IOPS. If you must run in a cloud, choose an instance family with local (instance-store) NVMe and accept that the ledger store is rebuilt after any stop, resize, or scheduled maintenance event, not only after instance loss; a plain reboot keeps it. Shared-tenancy VPS storage with unpredictable latency has knocked production servers out of sync.
- SATA SSDs have run private validators for years in home deployments, but they leave little margin. NVMe is recommended.

### Layout

Two working patterns, with different goals:

- **Isolation:** the ledger store on its own NVMe drive; operating system, swap, and logs on another. This protects consensus latency from everything else on the host.
- **Redundancy:** two drives in RAID 1. This protects uptime against a drive failure, but doubles endurance spend and mirrors corruption.

A lost ledger store costs hours of resync, not data. The keys are the only thing on the host that can't be rebuilt, and `wallet.db` (node identity, peer reservations, amendment votes) is the one other file worth backing up with them (see [Validator Security](../../configuration/security/validator.md) and [Backup and Recovery](../backup-and-recovery.md)). Prefer isolation, and back up both.

Mount the ledger-store volume with `noatime`. Use the `none` or `mq-deadline` I/O scheduler for NVMe and enable `fstrim.timer`. Deeper `sysctl` tuning isn't needed on adequate hardware.

## Network

Validator bandwidth is driven almost entirely by peering. Client traffic is negligible on a validator that serves none.

- Plan roughly 4 to 7 GB per peer per day for a server with a small, fixed set of peers. One production validator with about 20 peers and link compression enabled counted about 113 GB a day (about 3.4 TB a month) in the server's own peer traffic counters, 61% inbound. To measure yours, read the `total` entry in the peer traffic list of the [print method][]; it counts compressed on-wire bytes from server start.
- Inbound dominates on validators and other servers that keep few peers and don't relay for others. (Hubs, which do relay, see roughly balanced traffic in both directions.)
- The levers are `peers_max` for a validator that uses discovered peers (the server keeps at least 10 outbound slots whatever `peers_max` says), the size of `[ips_fixed]` for a private one (fixed and cluster peers don't count toward `peers_max`, and a server with `[peer_private]` makes no automatic connections at all), [link compression](../../configuration/peering/enable-link-compression.md), and the [outbound-only topology](../../configuration/security/validator.md#topology-and-exposure).
- A 1 Gbit interface is plenty. 10 Gbit is unnecessary. A validator with a handful of fixed peers has run for years on a residential fiber line with about 25 Mbit upstream.
- Location alone isn't disqualifying. Validators in regions far from most of the network's peers have held full agreement over long periods, though one operator reports that distance from the network core costs performance. Geographic diversity of the validator set benefits the network as a whole.

## Hosting

Operators are genuinely split on where to run a validator, and both camps run reliable validators:

- **Bare metal** (rented, or owned at home or in a rack) is the majority choice among the operators in the survey. The arguments are dedicated I/O and CPU, included traffic, and control over the failure domain.
- **Cloud** validators, including dUNL validators, run without incident when they use instance-local NVMe, dedicated (not burstable) CPU, and a provider with DDoS mitigation. The arguments are provider-level high availability and no datacenter to run.

The network-level argument is diversity. A validator set concentrated on a few providers shares failure domains. If you are choosing, consider which providers and regions are under-represented.

Home hosting is a legitimate long-term option. Home validators in the survey have run for 2 to 7 years. What makes them work is engineering, not luck: fiber with sufficient upstream, layered firewalls, backup power, a static IP or a reliable lease, and network gear that doesn't update itself. See [Validator Best Practices](../../configuration/best-practices/validator.md#failures-outside-the-host).

Rough monthly cost per validator in 2026 (USD): under $10 marginal on existing home hardware, roughly $60 to $120 for rented bare metal, and about $200 to $400 for a cloud instance with local NVMe. Cloud bandwidth charges vary widely.

Avoid regardless of hosting model:

- Burstable (credit-based) instance types.
- Network-attached block storage for the ledger store.
- Any host where another workload can compete for disk or memory. Co-hosted processes are the most common cause of validator halts on home hardware.

## Virtual machines and containers

The "no virtual machines" folklore is really about shared tenancy. Validators run well on hypervisors you control, on two conditions:

- **Fixed memory allocation.** Dynamic memory, ballooning, and similar features let the hypervisor take RAM back from the guest. `node_size` is auto-selected from the RAM visible at boot, so a guest that booted small is sized for RAM it no longer has, and one that booted large is sized for RAM it may lose. One operator's validator produced thousands of peer disconnects per hour while still proposing until dynamic memory was disabled and `node_size` pinned.
- **Pin `node_size` explicitly** in `xrpld.cfg` rather than relying on auto-detection inside a guest.

Containers add one more rule: **memory limits count page cache.** A container cap of 20 GB on a process that uses 15 GB will pin the container at the cap and starve the cache, even though the process itself is well under the limit; one measured node sat at 19.2 of 20 GB with 26% I/O wait until the cap was removed. The kernel reclaims cache inside the container before it kills anything, so an out-of-memory kill follows only if the process itself grows toward the cap, during a resync for example. Either leave the validator container uncapped or set the cap far above the process footprint. On a shared `systemd` host, set `OOMScoreAdjust=-900` on the validator unit so the kernel kills co-tenants first.

Never run a validator as a replicated service: two servers with one validator key is the operator error that harms other operators. See [No High Availability](../../configuration/security/validator.md#no-high-availability).

## Node size

`node_size` is a setting in the server's configuration file, `xrpld.cfg`, which the [Validator](../../configuration/server-modes/validator.md) setup page introduces; it is covered here because it decides how much of the RAM above the server actually uses. The `[node_size]` setting controls the server's cache tiers, not how much data it stores. If you omit it, the server selects a size from the RAM it sees at startup, then caps it by CPU thread count:

| RAM visible at startup | Auto-selected `node_size` | Thread requirement |
|:-----------------------|:--------------------------|:-------------------|
| Under 6 GB | `tiny` | |
| 6 to 8 GB | `small` | 2 or more hardware threads, otherwise stepped down |
| 8 to 12 GB | `medium` | 4 or more hardware threads, otherwise stepped down |
| 12 to 24 GB | `large` | 6 or more hardware threads, otherwise stepped down |
| 24 GB and above | `huge` | 8 or more hardware threads, otherwise stepped down |

The RAM figure is total physical memory truncated to whole gibibytes, so a guest provisioned with a nominal 24 GB often reports 23 GiB and lands on `large`. Inside a container the thread count may not reflect a CPU quota. Stand-alone mode auto-selects `tiny`; an explicit `[node_size]` still applies. All of this is one more reason to pin the value.

Guidance for validators:

- Most production validators run `huge`, including on 32 GB hosts. The process footprint at `huge` is about 13 to 18 GB, not 64 GB. The [Capacity Planning](../capacity-planning.md#node-size) RAM table describes a comfortable host size per setting, not the process footprint.
- `large` performs comparably to `huge` in measured tests and runs in production fleets. A proposed change to the core server (XRPLF/rippled [#7965](https://github.com/XRPLF/rippled/pull/7965)) would replace `node_size` with a memory budget. Its description reports that the presets are entry counts rather than byte budgets, that a unit error gives a `huge` server a second `[node_db]` cache of 8.4 million entries kept for 15 hours (a server with online deletion never creates that cache; see the last point below), and that in the maintainers' capacity testing 64 GB servers ran out of memory at about 2.5 million accounts on `huge` while `large` carried the same load. Check the change's status, and expect this section to change if it lands.
- Don't drop to `small` to save memory on a host that can run `large`. In one operator's measured restarts it was the slowest size to reach `full` and the only one that pinned every core while catching up.
- Confirm the value in effect with the [server_info method][] over an **admin** connection. The `node_size` field appears only in admin responses.
- Don't hand-tune `[node_db]` cache settings to compensate. On a server with online deletion enabled, which is every validator, the `cache_size` and `cache_age` keys have no effect at all: the rotating store doesn't use that cache, as the example configuration notes.

## See also

- **Concepts:**
    - [The `xrpld` Server](../../../concepts/networks-and-servers/index.md)
    - [Consensus](../../../concepts/consensus-protocol/index.md)
- **Tutorials:**
    - [Validator](../../configuration/server-modes/validator.md)
    - [Validator Security](../../configuration/security/validator.md)
    - [Validator Best Practices](../../configuration/best-practices/validator.md)
    - [Capacity Planning](../capacity-planning.md)
    - [Configure Online Deletion](../../configuration/data-retention/configure-online-deletion.md)
- **References:**
    - [server_info method][]
    - [get_counts method][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
