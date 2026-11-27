---
seo:
    description: Secure an XRP Ledger full history server - private peering, gated admin, front-end-only exposure, and what actually needs protecting.
labels:
  - Core Server
---
# Full History Security

A full history `xrpld` (formerly `rippled`) server concentrates enormous replacement cost in one place, but very little of it is secret. The security posture follows from that split: the data is rebuildable (slowly, from siblings), the keys and identity aren't, and the server itself should be nearly invisible to the public internet.

## Exposure model

- **Peering: private and fixed.** Production full history servers run `[peer_private] 1` with a small `[ips_fixed]` set - their own fleet plus a few chosen peers. There is no reason for a full history server to accept connections from strangers; peering capacity is a [hub's](hub.md) job.
- **Client traffic arrives only through front ends.** Load balancers, gateways, or an indexer tier face the public, enforce limits, and route to the fleet. The servers themselves answer only their front ends - enforce that with the firewall (or a bind address on a private interface), and add `secure_gateway` on the serving ports so the front ends' forwarded client identities are trusted; `secure_gateway` refuses nobody on its own. Expect demand: a reachable full history server gets found and used within days, because few exist and every indexer and explorer wants one, so an exposed server is flooded with requests whether or not you meant to offer them. A healthy ledger server doesn't guarantee a healthy end-to-end service, and the reverse is also true: the public surface belongs to the front ends, where it can be defended without touching the origin tier.
- **Admin interfaces: loopback where possible, gated and firewalled where not.** Fleet tooling sometimes needs admin reachable beyond loopback; production configs that do this gate privilege with the `admin` allowlist *and* restrict the port at the host or network firewall. If you bind admin ports wide, the firewall isn't optional hardening - it is the control. Add `admin_user` and `admin_password` to that port and serve it over `https` or `wss`, so an address in the allowlist isn't enough on its own. If the server runs in Docker, a published port bypasses `ufw`: filter it in the `DOCKER-USER` chain, as described on the [Security index](index.md).

## Management plane

The practices of the fleet operators who run this role:

- SSH by key only, through a VPN, with in-house access control; every port except what the role requires closed by default.
- Infrastructure as code: servers are provisioned and configured from version-controlled definitions, so a rebuilt host is a known quantity rather than a hand-crafted one. At full history scale, where a rebuild is routine (see [Best Practices](../best-practices/full-history.md#redundancy-is-the-backup)), this is as much a security property as an operational one - configuration drift on a host you rarely rebuild is where quiet compromises and quiet mistakes both live.

## What actually needs protecting

| Asset | Replaceable? | Protection |
|:------|:-------------|:-----------|
| Node identity (`[node_seed]`, or the identity kept in `wallet.db` when no seed is set) | No - replacing it drops the server out of every `[cluster_nodes]` list and peer reservation that names its key | On-host, tight permissions; backed up with configs |
| Configs | Yes, but slowly by hand | Version control (private), sanitized before any sharing |
| The 44 TB dataset | Yes - from siblings, the better part of a day per rebuild over a 10 Gbps private link | Fleet redundancy, not secrecy: it is public data |
| Keys for any colocated validator role | No | Never on the full history server at all; see [Validator Security](validator.md) |

The inversion is worth stating: on most servers the data is the asset; on a full history server the data is *public by definition* - its integrity and availability matter, its confidentiality doesn't. Spend the protection effort on identity, access, and the fleet's ability to rebuild.

## Topology privacy

Even a private server leaks topology through its peers and its front ends. `[peer_private]` leaves no room for strangers in the peer slots, but the peer port still answers `/crawl`, `/health` and `/vl/` over HTTP to anyone who can reach it, and `/crawl` lists the addresses of connected peers that advertise themselves as public, which is the default. Firewall the peer port to your fleet, or turn the crawler off (`[crawl]` with `overlay = 0`, or the section set to `0`). Keep `[ips_fixed]` lists, internal addressing, and the shape of the fleet out of shared configs, screenshots, and support requests; publish endpoints, not origins. The research behind these pages received production configs only in sanitized form, and that is the correct instinct.
