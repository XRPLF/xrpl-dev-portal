---
seo:
    description: Run a public XRP Ledger hub that provides peering capacity to the network.
labels:
  - Core Server
---
# Hub

A hub is an `xrpld` (formerly `rippled`) server configured to accept many inbound peer connections and relay traffic between them. Hubs are how the peer-to-peer network stays connected: fresh installs find their first peers through hubs, servers behind restrictive networks reach the rest of the network through them, and validators use them as stable, known peering points.

Running a hub is one of the most direct ways to contribute capacity to the XRP Ledger network. It is also a commitment: other people's servers come to depend on yours.

## Who should run a hub

A hub suits an operator who has reliable, high-allowance bandwidth (see [Hub System Requirements](../../prerequisites/system-requirements/hub.md)), expects to keep the hub up for years rather than months, and is reachable if something goes wrong.

Hubs are lighter to run than full history servers, and the load on the machine is small. They aren't the cheapest role, though: a hub's link carries 11 to 15 TiB a month at 100 to 300 peers (see [Hub System Requirements](../../prerequisites/system-requirements/hub.md#bandwidth-is-the-real-cost)). The larger commitment is the responsibility: peers accumulate slowly, other operators write your address into their configurations, validators may route through you precisely to keep their own addresses private, and a hub that disappears degrades sync for everyone who leaned on it. You owe them two things, availability and discretion; see [Privacy obligations of a public role](../security/hub.md#privacy-obligations-of-a-public-role). One long-running hub operator puts it plainly: becoming a trusted part of the network's plumbing is harder than it looks, and getting out again gracefully is harder still.

A small number of hubs are **bootstrap hubs**: their hostnames ship inside `xrpld` itself as the bootstrap list a server uses when its configuration names no `[ips]` or `[ips_fixed]` entries. Bootstrap listing happens through a change to the source code, which means the operator's domain is hardcoded into every release until another change removes it. Don't seek it until your hub has run reliably in public for a long time. For the current bootstrap hubs and how to use them, see [Connect to Public Hubs](../peering/connect-to-public-hubs.md).

## Configure a hub

A hub is a stock server with a handful of deliberate settings. Work from the [stock server setup](stock-node.md) first, then apply the following. Turn pathfinding off with `[path_search_max]` set to `0`; hubs have no use for it.

### Peer capacity

```
[peers_max]
300

[peer_private]
0
```

`peers_max` is the hub's defining setting; see [Hub System Requirements](../../prerequisites/system-requirements/hub.md#peer-capacity) for how to size it. The block above is a mature hub from the measured bootstrap fleet; start a new hub around 100 and raise the cap as the host and the link prove themselves. About 15% of the slots are outbound, so 300 gives roughly 45 outbound and 255 inbound, and the server allows about 7 inbound connections per IP address unless you set `ip_limit` in `[overlay]`. `peer_private` must be `0` (the default) so the hub's address is shared among peers: a hub that hides isn't a hub. Make sure the peer port is reachable from the internet; see [Forward Ports for Peering](../peering/forward-ports-for-peering.md).

### The peer crawler

```
[crawl]
overlay = 1
server = 1
counts = 0
unl = 1
```

Production hubs deliberately leave the [peer crawler](../peering/configure-the-peer-crawler.md) enabled: visibility into the overlay is useful to the network, and a public hub has little topology to hide. This is the opposite of the guidance for validators, which minimize what they reveal.

### History and retention

Two retention patterns both work in production:

- **Pure peering.** Keep minimal history (`ledger_history` and `online_delete` of a few hundred to a few thousand). The hub relays and serves fresh peers, nothing more. Cheapest to run; rotation churn at small retention values has no visible effect on a dedicated peering host.
- **History-serving hub.** Keep on the order of 50,000 to 100,000 ledgers. The hub serves everything it keeps unless you set `fetch_depth` lower, so leave that stanza out:

  ```
  [ledger_history]
  100000

  [node_db]
  type=NuDB
  path=/var/lib/xrpld/db/nudb
  online_delete=100000
  advisory_delete=0
  ```

  This makes the hub more useful to syncing peers at modest disk cost. Set `fetch_depth` only if you want to serve peers less than you store.

### Relay policy

`[relay_proposals]` and `[relay_validations]` control what the hub does with consensus messages from validators that aren't on its trusted list:

| Value | Behavior | When operators choose it |
|:------|:---------|:-------------------------|
| `all` (default for `[relay_validations]`) | Process and relay untrusted proposals and validations | Maximum usefulness to the network when resources allow |
| `trusted` (default for `[relay_proposals]`) | Process untrusted messages locally but don't relay them | Reduces relay overhead under heavy network activity while still evaluating everything. One fleet adopted this during a period of unusually large, transaction-heavy ledgers. |
| `drop_untrusted` | Drop untrusted messages without processing | Maximum load shedding; another production fleet runs this on its peering tier |

There is no single right answer. Validations default to the most generous setting and proposals don't, so a hub that sets nothing already relays untrusted validations but not untrusted proposals. The restrictive settings are measured responses to load.

### What a hub does not expose

A pure hub exposes the peer protocol and nothing else. Production peering fleets serve no public RPC or WebSocket at all from their hubs. If you also want to serve client traffic, treat that as a separate role on separate ports with the limits described in [Stock Server](stock-node.md), and read [Hub Security](../security/hub.md) first.

## Verify the hub is doing its job

- `server_info`: `server_state` should be `full`, and `peers` should climb toward your cap over days and weeks, not minutes. Peer population accretes slowly; see [Hub Best Practices](../best-practices/hub.md#restarts-and-peer-recovery).
- The [peer crawler endpoint](../peering/configure-the-peer-crawler.md) on your hub should answer publicly.
- Ask the network: other operators adding your hub to `[ips]` should sync and hold connections. Peer reservations for specific operators are a good citizenship tool; see [Use a Peer Reservation](../peering/use-a-peer-reservation.md).
