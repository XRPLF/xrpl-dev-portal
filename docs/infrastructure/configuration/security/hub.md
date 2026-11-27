---
seo:
    description: Secure a public XRP Ledger hub - exposure, observed abuse, and hardening that has worked in production.
labels:
  - Core Server
---
# Hub Security

A hub is the most internet-exposed role an `xrpld` (formerly `rippled`) server can have: its purpose is to accept connections from strangers. The security model is therefore about exposing exactly one thing well, and nothing else at all.

## Expose the peer port and nothing else

- The peer protocol port (2459, the registered port and the default in current versions; 51235 on many older installs) is the only service a hub offers the internet.
- No public RPC. No public WebSocket. No admin interface on anything but loopback. Production peering fleets expose no client-facing service from their hubs at all; if you want to serve clients, do it from a different server.
- Management access (SSH) isn't part of the hub's public surface. Treat it per the hardening below.

The peer protocol itself is designed for hostile networks: peers are untrusted by default, consensus messages are signed, and the server's resource accounting bounds what any one peer can cost you (the [relay settings](../server-modes/hub.md#relay-policy) on the Hub page decide what it passes on). A hub extends trust to no one by listening.

## What abuse actually arrives

Operators who have run public hubs since 2021 report, consistently:

- **The persistent noise is against SSH, not xrpld**: scanning and brute-force attempts, continuously.
- **Occasional volumetric DDoS** against hub and validator addresses, absorbed by standard provider-level mitigation.
- **Little observed abuse of the peer protocol itself** behind ordinary hygiene.

That experience shapes the priorities: harden the management plane first, keep DDoS mitigation available, and let xrpld's own limits handle peer misbehavior.

## Hardening that production hubs use

- Key-only SSH with password login disabled, an IP allowlist, and a non-default port for noise reduction.
- Automatic banning of repeated failed access attempts (fail2ban or equivalent).
- Management reachable only through a VPN where the operation supports it.
- Every port except the peer port closed at the firewall, default-deny.
- Internal fleet traffic (between your own hubs) on private addressing where possible.

## Clustering hubs safely

Hub fleets often [cluster](../peering/cluster-xrpld-servers.md) their members so they share load information and don't re-verify each other's traffic. Two silent failure modes matter when you manage cluster configs:

- **A config with no `[node_seed]` and no surviving `wallet.db` (a rebuilt host, or a container without a persistent database volume) makes the server mint a fresh random identity** - no error, and the node silently drops out of every peer's `[cluster_nodes]` trust. An ordinary restart with the database intact keeps the identity; changing or removing an existing seed changes it too. A `[node_seed]` pins the identity across database rebuilds, which is why hubs set one.
- **A truncated `[cluster_nodes]` list is still a valid config.** A missing entry silently revokes that peer's cluster trust on this server, unless another listed member still reports it, since members learn each other through the reports of the members they list.

Treat the node identity files as managed artifacts: the seed lives on the host, `wallet.db` carries identity state between restarts, and configuration tooling should refuse to deploy a cluster config it can't render completely.

## Privacy obligations of a public role

Running public infrastructure means other operators' information passes through yours:

- Don't publish peer lists, reservation holders, or the addresses of servers that connect to you. Validators in particular may be using your hub precisely to keep their own addresses private. Know that the peer port also answers `/crawl`, which by default lists the address and port of every connected peer that hasn't asked to be hidden; validators ask for that, and stock servers and other hubs don't. `[crawl]` with `overlay = 0` removes the peer list from the response, at the cost of the overlay visibility the Hub page describes.
- If you run any verification or reservation system, don't retain requesters' addresses longer than the process needs, and never expose them.
- Sanitize your own configs before sharing them: `[ips_fixed]` entries and cluster keys describe your topology and your peers'.

